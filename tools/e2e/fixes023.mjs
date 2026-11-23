// 0.2.3：麦克风语音输入、开门颜色和关门一致、小狗停留时间。（第 3 条太阳/月亮贴图的对比在证据目录的 sky 脚本里，要同时跑 Chromium 和 WebKit。）
// HA3D_FIXES023_BASELINE=1 时只记录不断言（在修复前的代码上采集对照数据）；HA3D_FIXES023_ONLY=voice,door,dog 只跑其中几段。
import path from "node:path";
import { chromium } from "playwright";
import { openingCenter } from "./baseline.mjs";
import { clearDoorView, doorReport, doorView, sampleRgb } from "./models.mjs";
const BASELINE = process.env.HA3D_FIXES023_BASELINE === "1";
const ONLY = (process.env.HA3D_FIXES023_ONLY || "voice,door,dog").split(",");
const NOON = "2026-06-01T12:00:00";
const LAN_HOST = "ha3d-lan.test";
const round = (value, digits = 3) => Number(Number(value).toFixed(digits));

// 假的 Web Speech API：start() 后 50 ms onstart；mode=ok 时 0.6 s 给出中间结果「打开客」、1.6 s 给出最终结果「打开客厅灯」后结束；
// mode 是错误码时 0.3 s 后 onerror + onend。window.__ha3dFakeRec 记录调用次数。
function fakeRecognition(mode) {
  window.__ha3dFakeRec = { mode, starts: 0, stops: 0, lang: null };
  const list = (text, isFinal) => Object.assign([Object.assign([{ transcript: text, confidence: 0.9 }], { isFinal })], {});
  class Ha3dFakeRecognition {
    start() {
      const rec = window.__ha3dFakeRec;
      rec.starts += 1;
      rec.lang = this.lang;
      setTimeout(() => this.onstart && this.onstart(), 50);
      if (rec.mode === "ok") {
        this.t1 = setTimeout(() => this.onresult && this.onresult({ resultIndex: 0, results: list("打开客", !1) }), 600);
        this.t2 = setTimeout(() => {
          this.onresult && this.onresult({ resultIndex: 0, results: list("打开客厅灯", !0) });
          this.onend && this.onend();
        }, 1600);
      } else
        setTimeout(() => {
          this.onerror && this.onerror({ error: rec.mode });
          this.onend && this.onend();
        }, 300);
    }
    stop() {
      window.__ha3dFakeRec.stops += 1;
    }
    abort() {
      clearTimeout(this.t1);
      clearTimeout(this.t2);
    }
  }
  window.SpeechRecognition = Ha3dFakeRecognition;
  window.webkitSpeechRecognition = Ha3dFakeRecognition;
}
// 去掉浏览器语音识别（相当于 Firefox、HA iOS App 内置浏览器等没有这个 API 的环境）
function noRecognition() {
  for (const name of ["SpeechRecognition", "webkitSpeechRecognition"]) Object.defineProperty(window, name, { value: undefined, configurable: true, writable: true });
}
// 假麦克风（headless Chromium 的 getUserMedia 拿不到设备会一直等）：用 AudioContext 生成音频流，
// 0.2 s 静音 + 1.5 s 440 Hz（幅度 0.4）+ 之后静音，相当于「说了一句话然后停下」。mode=denied 时按用户拒绝权限抛 NotAllowedError。
function fakeMicrophone(mode) {
  window.__ha3dFakeMic = { mode, calls: 0 };
  navigator.mediaDevices.getUserMedia = async () => {
    window.__ha3dFakeMic.calls += 1;
    if (mode === "denied") throw new DOMException("Permission denied", "NotAllowedError");
    const ac = new AudioContext();
    await ac.resume();
    const osc = ac.createOscillator(),
      gain = ac.createGain(),
      dest = ac.createMediaStreamDestination();
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.setValueAtTime(0.4, ac.currentTime + 0.2);
    gain.gain.setValueAtTime(0, ac.currentTime + 1.7);
    osc.connect(gain).connect(dest);
    osc.start();
    return dest.stream;
  };
}
async function voiceState(page) {
  return page.evaluate(() => {
    const fab = document.querySelector(".voice-fab");
    return {
      secure: window.isSecureContext,
      hasMediaDevices: Boolean(navigator.mediaDevices),
      fabClass: fab?.className ?? null,
      fabLabel: fab?.getAttribute("aria-label") ?? null,
      panelOpen: Boolean(document.querySelector(".voice-feed.tools-open")),
      status: document.querySelector(".voice-status")?.textContent ?? null,
      input: document.querySelector(".voice-input input")?.value ?? null,
      inputFocused: Boolean(document.activeElement?.matches?.(".voice-input input")),
      messages: [...document.querySelectorAll(".voice-message")].map((item) => ({ role: item.classList.contains("user") ? "user" : "assistant", text: item.textContent })),
      fake: window.__ha3dFakeRec ?? null,
    };
  });
}
async function waitVoice(page, predicate, timeout = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const state = await voiceState(page);
    if (predicate(state)) return { ...state, ms: Date.now() - started };
    await page.waitForTimeout(100);
  }
  return { ...(await voiceState(page)), ms: null };
}
const conversationCalls = (calls, from) => calls.slice(from).filter((call) => call.domain === "conversation");
const sttCalls = (calls, from) => calls.slice(from).filter((call) => call.domain === "assist_pipeline" && call.service === "stt");

export default async function fixes023(ctx) {
  const { check, log } = ctx;
  const ok = (name, value, detail) => (BASELINE ? (log(`[基线] ${name}：${value ? "是" : "否"} ${JSON.stringify(detail)}`), value) : check(name, value, detail));
  const out = { voice: {}, door: {}, dog: {} };
  const viewport = { width: 390, height: 844 };
  const extraBrowsers = [];
  const newVoicePage = async (browser, { baseURL = ctx.stack.appUrl, init, permissions } = {}) => {
    const context = await browser.newContext({ baseURL, viewport, deviceScaleFactor: 1, hasTouch: true, isMobile: false, locale: "zh-CN" });
    if (permissions) await context.grantPermissions(permissions, { origin: baseURL });
    for (const item of init ?? []) {
      const [fn, arg] = Array.isArray(item) ? item : [item];
      await context.addInitScript(fn, arg);
    }
    const page = await context.newPage();
    page.ha3dErrors = [];
    page.on("pageerror", (error) => page.ha3dErrors.push(String(error)));
    await ctx.gotoHome(page, { quality: "eco", prefs: { "ha3d.home.voiceEnabled": "true", "ha3d.home.pet": null }, settleMs: 1500 });
    return page;
  };
  const tapFab = (page) => page.locator(".voice-fab").tap();

  // ---------- 第 1 条：麦克风语音输入 ----------
  if (ONLY.includes("voice")) {
    // V1 浏览器语音识别（安全上下文 127.0.0.1，假的 SpeechRecognition）：轻触 → 聆听 → 中间结果进输入框 → 最终结果提交给 conversation
    {
      const page = await newVoicePage(ctx.browser, { init: [[fakeRecognition, "ok"]] });
      const before = (await ctx.mock.calls()).length;
      const initial = await voiceState(page);
      await tapFab(page);
      const listening = await waitVoice(page, (s) => s.fabClass?.includes("listening"), 3000);
      const interim = await waitVoice(page, (s) => s.input === "打开客", 3000);
      await ctx.shot(page, "V1-browser-listening-interim");
      const done = await waitVoice(page, (s) => s.messages.some((m) => m.role === "assistant" && m.text.includes("打开客厅灯")), 8000);
      await ctx.shot(page, "V1-browser-done");
      const calls = conversationCalls(await ctx.mock.calls(), before);
      out.voice.browser = { initial, listening, interim, done, conversation: calls.map((call) => call.data), errors: page.ha3dErrors };
      ok("V1 浏览器语音识别：轻触麦克风就开始识别（start 调用 1 次，lang=zh-CN），聆听时按钮是 listening 状态", listening.fake?.starts === 1 && listening.fake?.lang === "zh-CN" && listening.fabClass?.includes("listening"), { fake: listening.fake, fabClass: listening.fabClass, status: listening.status });
      ok("V1 识别中的文字显示在输入框里", interim.input === "打开客", { input: interim.input, status: interim.status });
      ok("V1 开始说话时输入框没有获得焦点（iPhone 上不会弹出软键盘）", listening.panelOpen && !listening.inputFocused && !interim.inputFocused, { listening: listening.inputFocused, interim: interim.inputFocused });
      ok("V1 最终文字「打开客厅灯」提交给 conversation，对话记录里有用户和助手两条", calls.length === 1 && calls[0].data.text === "打开客厅灯" && done.messages.some((m) => m.role === "user" && m.text === "打开客厅灯"), { calls: calls.map((call) => call.data), messages: done.messages });
      ok("V1 没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors);
      await page.context().close();
    }

    // V2 没有浏览器语音识别（相当于 HA App 内置浏览器）：录音 → POST ./api/ha/assist-stt → HA assist_pipeline/run(stt) → 文字 → conversation
    {
      const page = await newVoicePage(ctx.browser, { init: [noRecognition, [fakeMicrophone, "ok"]] });
      const before = (await ctx.mock.calls()).length;
      await tapFab(page);
      const listening = await waitVoice(page, (s) => s.fabClass?.includes("listening"), 4000);
      await ctx.shot(page, "V2-ha-stt-listening");
      const transcribing = await waitVoice(page, (s) => (s.status ?? "").includes("正在识别") || s.messages.length > 0, 10000);
      const done = await waitVoice(page, (s) => s.messages.some((m) => m.role === "assistant" && m.text.includes("打开客厅灯")), 10000);
      await ctx.shot(page, "V2-ha-stt-done");
      const all = await ctx.mock.calls();
      const stt = sttCalls(all, before);
      const conversation = conversationCalls(all, before);
      out.voice.haStt = { listening, transcribing, done, stt: stt.map((call) => call.data), conversation: conversation.map((call) => call.data), errors: page.ha3dErrors };
      ok("V2 没有浏览器语音识别时改为录音，聆听状态提示「Home Assistant 识别」", listening.fabClass?.includes("listening") && (listening.status ?? "").includes("Home Assistant"), { status: listening.status, fabClass: listening.fabClass });
      ok("V2 说完（安静 1.2 秒）自动停止，录音交给 HA 的 assist_pipeline/run stt 阶段（16 kHz，≥ 1 秒的 PCM）", stt.length === 1 && stt[0].data.sample_rate === 16000 && stt[0].data.bytes >= 16000 * 2, stt.map((call) => call.data));
      ok("V2 HA 识别出的「打开客厅灯」提交给 conversation，助手回复出现在对话记录里", conversation.length === 1 && conversation[0].data.text === "打开客厅灯" && done.messages.some((m) => m.role === "assistant" && m.text.includes("打开客厅灯")), { conversation: conversation.map((call) => call.data), messages: done.messages });
      ok("V2 没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors);
      await page.context().close();
    }

    // V5 浏览器语音识别被拒绝（service-not-allowed，例如 HA App 没有语音识别权限）：提示并改用 HA 识别，按提示点输入框右侧的麦克风就能用
    {
      const page = await newVoicePage(ctx.browser, { init: [[fakeRecognition, "service-not-allowed"], [fakeMicrophone, "ok"]] });
      const before = (await ctx.mock.calls()).length;
      await tapFab(page);
      const refused = await waitVoice(page, (s) => Boolean(s.status) && !s.fabClass?.includes("listening") && s.fake?.starts === 1, 4000);
      await ctx.shot(page, "V5-recognition-refused");
      // 提示指向输入框右侧的麦克风（面板开着时大麦克风是收起），按提示点一次就开始
      await page.locator(".voice-input-mic").tap();
      const done = await waitVoice(page, (s) => s.messages.some((m) => m.role === "assistant" && m.text.includes("打开客厅灯")), 14000);
      await ctx.shot(page, "V5-fallback-ha-done");
      const all = await ctx.mock.calls();
      out.voice.fallback = { refused, done, stt: sttCalls(all, before).map((call) => call.data), conversation: conversationCalls(all, before).map((call) => call.data) };
      ok("V5 浏览器语音识别被拒绝时显示原因，说明已改用 Home Assistant 识别，并指向输入框右侧的麦克风", (refused.status ?? "").includes("已改用 Home Assistant 语音识别") && (refused.status ?? "").includes("输入框右侧的麦克风"), { status: refused.status });
      ok("V5 按提示点一次输入框右侧的麦克风就走 HA 识别（浏览器识别不再调用），文字提交给 conversation", done.fake?.starts === 1 && out.voice.fallback.stt.length === 1 && out.voice.fallback.conversation.some((call) => call.text === "打开客厅灯"), out.voice.fallback);
      await page.context().close();
    }

    // V3 非安全上下文（http://<局域网主机名>，和用户用 http://192.168.0.105:8123 访问一样）
    const lanBrowser = await chromium.launch({ headless: true, args: [...ctx.browserArgs, `--host-resolver-rules=MAP ${LAN_HOST} 127.0.0.1`] });
    extraBrowsers.push(lanBrowser);
    const lanURL = ctx.stack.appUrl.replace("127.0.0.1", LAN_HOST).replace("localhost", LAN_HOST);
    for (const [key, init, label] of [
      ["insecureNative", undefined, "Chromium 自带的语音识别"],
      ["insecureNoApi", [noRecognition], "没有语音识别 API"],
    ]) {
      const page = await newVoicePage(lanBrowser, { baseURL: lanURL, init });
      await tapFab(page);
      const state = await waitVoice(page, (s) => Boolean(s.status) && !s.fabClass?.includes("listening") && !(s.status ?? "").startsWith("正在"), 8000);
      await ctx.shot(page, `V3-${key}`);
      out.voice[key] = state;
      ok(`V3 http 访问（${label}）：isSecureContext=false、没有 mediaDevices，点麦克风后面板里提示需要 HTTPS`, state.secure === false && !state.hasMediaDevices && state.panelOpen && (state.status ?? "").includes("HTTPS"), { secure: state.secure, hasMediaDevices: state.hasMediaDevices, status: state.status });
      ok(`V3 http 访问（${label}）：语音用不了时输入框自动获得焦点，可以直接键入；没有 pageerror`, state.inputFocused && page.ha3dErrors.length === 0, { inputFocused: state.inputFocused, errors: page.ha3dErrors });
      await page.context().close();
    }

    // V4 安全上下文、没有麦克风权限（没有浏览器语音识别，录音时 getUserMedia 被拒绝）
    {
      const page = await newVoicePage(ctx.browser, { init: [noRecognition, [fakeMicrophone, "denied"]] });
      await tapFab(page);
      const state = await waitVoice(page, (s) => Boolean(s.status) && !(s.status ?? "").startsWith("正在"), 8000);
      await ctx.shot(page, "V4-mic-permission-denied");
      out.voice.noPermission = state;
      ok("V4 没有麦克风权限时提示去设置里允许麦克风", (state.status ?? "").includes("麦克风权限被拒绝"), { status: state.status });
      await page.context().close();
    }
  }

  // ---------- 第 2 条：绑定门磁的门，打开时颜色和关门一样 ----------
  if (ONLY.includes("door")) {
    const floor = ctx.project.floors[0];
    const doors = floor.openings.filter((item) => item.type === "door" && item.entityId && item.hasLeaf !== false);
    for (const style of ["glass", "cream"]) {
      const page = await ctx.newPage({ startTime: NOON });
      await ctx.gotoHome(page, { style, quality: "high", prefs: { "ha3d.home.pet": null } });
      out.door[style] = {};
      for (const door of doors) {
        const center = await ctx.planToWorld(page, openingCenter(floor, door));
        await ctx.mock.set(door.entityId, "off");
        await page.waitForTimeout(1200);
        const leafCenter = (await doorReport(page)).find((item) => item.openingId === door.id)?.leafCenters?.[0];
        const view = leafCenter ? await clearDoorView(page, floor, door, center, [{ world: leafCenter }]) : doorView(floor, door);
        const record = {};
        for (const [stateName, value] of [
          ["closed", "off"],
          ["open", "on"],
        ]) {
          await ctx.mock.set(door.entityId, value);
          await page.waitForTimeout(1500);
          await ctx.focusOn(page, center, view.distance, view.direction);
          const file = await ctx.shot(page, `D-door-${style}-${door.id}-${stateName}`);
          const now = (await doorReport(page)).find((item) => item.openingId === door.id);
          const point = now?.leafCenters?.[0] && (await ctx.projectToScreen(page, now.leafCenters[0]));
          record[stateName] = { material: now?.leafMaterials?.[0], edge: now?.leafEdgeMaterials?.[0], rotation: now?.leafRotations?.[0], rgb: point?.onCanvas ? sampleRgb(file.buffer, point.x, point.y, 6) : null, screenshot: path.basename(file.path) };
        }
        await ctx.mock.set(door.entityId, "off");
        out.door[style][door.id] = record;
        const a = record.closed,
          b = record.open;
        ok(
          `门[${style}] ${door.id} 打开时材质颜色、自发光、描边和关门一样，门扇转开 > 0.3 rad`,
          a.material?.color === b.material?.color && a.material?.emissive === b.material?.emissive && a.material?.emissiveIntensity === b.material?.emissiveIntensity && JSON.stringify(a.edge) === JSON.stringify(b.edge) && Math.abs((b.rotation ?? 0) - (a.rotation ?? 0)) > 0.3,
          record,
        );
      }
      await page.context().close();
    }
  }

  // ---------- 第 4 条：小狗停留时间（120 秒内每 250 ms 采样位置，连续不动 ≥ 1 秒算一次停留） ----------
  if (ONLY.includes("dog")) {
    // 宠物按每帧的 delta（上限 0.1 秒）推进，swiftshader 掉到几帧每秒时停留会被拉长，所以用小视口 + 省电画质（20 fps 定时渲染），并记录帧率
    const page = await ctx.newPage({ startTime: NOON, viewport: { width: 640, height: 480 } });
    await ctx.gotoHome(page, { quality: "eco", prefs: { "ha3d.home.pet": "dog" }, settleMs: 500 });
    await page.waitForFunction(() => {
      let found = false;
      window.__ha3dDebug?.get()?.scene.traverse((o) => (found ||= o.name === "ha3d-pet"));
      return found;
    }, null, { timeout: 20_000 });
    const samples = await page.evaluate(async () => {
      const read = () => {
        let pet;
        window.__ha3dDebug.get().scene.traverse((o) => {
          if (o.name === "ha3d-pet") pet = o;
        });
        return [pet.position.x, pet.position.z, window.__ha3dDebug.get().gl.info.render.frame];
      };
      const list = [];
      const started = performance.now();
      while (performance.now() - started < 120_000) {
        list.push([Math.round(performance.now() - started), ...read()]);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      return list;
    });
    const moving = samples.slice(1).map((sample, index) => Math.hypot(sample[1] - samples[index][1], sample[2] - samples[index][2]) > 0.002);
    const rests = [];
    const walks = [];
    let runStart = 0;
    for (let i = 1; i <= moving.length; i += 1) {
      if (i < moving.length && moving[i] === moving[runStart]) continue;
      const seconds = (samples[i][0] - samples[runStart][0]) / 1000;
      (moving[runStart] ? walks : rests).push(round(seconds, 1));
      runStart = i;
    }
    const total = (samples.at(-1)[0] - samples[0][0]) / 1000;
    const walking = moving.filter(Boolean).length * 0.25;
    // 第一段停留是出现后的 firstRest，最后一段可能被 120 秒截断，统计「完整的停留」时去掉首尾
    const fullRests = rests.slice(moving[0] ? 0 : 1, moving.at(-1) ? undefined : -1).filter((seconds) => seconds >= 1);
    const fps = round((samples.at(-1)[3] - samples[0][3]) / total, 1);
    out.dog = { fps, seconds: round(total, 1), walkingSeconds: round(walking, 1), walkingShare: round(walking / total, 3), trips: walks.length, rests, walks, fullRests, firstRest: moving[0] ? 0 : rests[0] };
    log(`[dog] ${JSON.stringify(out.dog)}`);
    await ctx.shot(page, "P-dog");
    ok("小狗：每次到点后停留 25–45 秒（120 秒内完整的停留都在这个范围内，至少走动 1 次）", walks.length >= 1 && fullRests.length >= 1 && fullRests.every((seconds) => seconds >= 24 && seconds <= 46.5), out.dog);
    // 出现后的第一段停留（firstRest 4–8 秒）只记录：采样开始时小狗已经出现了一会儿，量出来的不是完整的一段
    await page.context().close();
  }

  for (const browser of extraBrowsers) await browser.close();
  await ctx.writeJson(path.join(ctx.dir, "fixes023.json"), out);
  return { voice: Object.keys(out.voice), door: Object.keys(out.door), dog: out.dog };
}
