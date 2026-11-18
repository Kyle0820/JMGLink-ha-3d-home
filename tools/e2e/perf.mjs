// B6 精简与性能（plan.md 第 2 节 Q4、第 3 节 B6）：与 FEAT-002 的基线（<证据>/baseline/…/baseline.json）对比，
// 写 <证据>/perf/perf.json 和 perf.md（前后对比表、镜像大小、删掉的代码）。
// - 首页和编辑器加载都不请求 hls.js，首页 JS 字节数比基线少 ≥ 500 KB，默认不加载宠物代码；
// - 没有持续动画（晴天白天、无宠物、设备不在动）时，各画质稳定后 5 秒 0 帧；
// - 只有设备动画（空调出风；传感器脉冲环）时 eco ≤ 22 fps、smooth ≤ 32 fps，同时拖动视角时不受这个限制；
// - 有持续动画（下雨 + 宠物，空调出风也开着）时 eco ≤ 22 fps、smooth ≤ 32 fps（另在小视口下测一遍，那里软件渲染能跑得更快）；
// - eco 每帧 draw call 比基线 eco 少，eco 下没有 drei Edges 描边；
// - 模拟低端设备、没保存过画质时默认 eco（4 核 / 4 GB 时 smooth）。
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const QUALITIES = ["eco", "smooth", "balanced", "high"];
const NOON = "2026-06-01T12:00:00";
const repoDir = fileURLToPath(new URL("../..", import.meta.url));
const webDir = "jmglink-ha-3d-home/app/apps/web/dist";
const UPSTREAM_IMAGE = "docker.jmglink.cn/jmglink-ha-3d:0.1.6";
// KB 按 1000 字节计（与 plan.md 里「hls.js 约 525 KB」= 524,953 B 一致）
const KB = 1000;
const kb = (bytes) => (bytes === null || bytes === undefined ? "—" : `${(bytes / KB).toFixed(1)} KB`);
const mb = (bytes) => (bytes === null || bytes === undefined ? "—" : `${(bytes / 1e6).toFixed(1)} MB`);

async function loadBaseline(ctx) {
  const candidates = [
    process.env.HA3D_BASELINE_JSON,
    ctx.isFixture ? path.join(ctx.evidenceRoot, "baseline", "baseline.json") : path.join(ctx.evidenceRoot, "baseline", "apartment", "baseline.json"),
    ctx.isFixture ? null : path.join(path.dirname(ctx.evidenceRoot), "baseline", "apartment", "baseline.json"),
  ].filter(Boolean);
  for (const file of candidates) if (existsSync(file)) return { file, data: JSON.parse(await readFile(file, "utf8")) };
  return { file: null, data: null };
}

/** 设备不在动：空调、风扇关，媒体空闲，扫地机回座，二元传感器 off。 */
async function stopDeviceAnimations(ctx) {
  const states = await ctx.mock.states();
  const changed = [];
  for (const item of states) {
    const [domain] = item.entity_id.split(".");
    const target = { climate: "off", fan: "off", media_player: "idle", vacuum: "docked", binary_sensor: "off" }[domain];
    if (target && item.state !== target) {
      await ctx.mock.set(item.entity_id, target, domain === "fan" ? { percentage: 0 } : undefined);
      changed.push(item.entity_id);
    }
  }
  return changed;
}

/** 等场景停止渲染（帧计数连续 2 次、每次 1.5 秒都不变），最长 maxMs；返回用时。
 * SwiftShader 下大户型一帧要几百毫秒，而相机入场过渡、淡入、阻尼都按每帧最多 0.05 s 推进，3 秒不一定停得下来。 */
async function waitIdle(ctx, page, maxMs = 45_000) {
  const read = () => page.evaluate(() => window.__ha3dDebug?.get().gl.info.render.frame ?? 0);
  const started = Date.now();
  let previous = await read();
  let still = 0;
  while (Date.now() - started < maxMs && still < 2) {
    await ctx.sleep(1500);
    const current = await read();
    still = current === previous ? still + 1 : 0;
    previous = current;
  }
  return Date.now() - started;
}

/** 用 CDP 按住左键在画布中间左右来回拖动 ms 毫秒（每 16 ms 一步，旋转视角），返回这段时间的帧率。 */
async function dragFps(ctx, page, ms = 4000) {
  const box = await page.locator(".home-scene canvas").first().boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height * 0.6;
  const cdp = await page.context().newCDPSession(page);
  const send = (type, x, extra) => cdp.send("Input.dispatchMouseEvent", { type, x, y: cy, button: "left", ...extra });
  const read = () => page.evaluate(() => window.__ha3dDebug.get().gl.info.render.frame);
  await send("mouseMoved", cx, { buttons: 0, button: "none" });
  await send("mousePressed", cx, { clickCount: 1, buttons: 1 });
  const before = await read();
  const started = Date.now();
  let x = cx;
  for (let step = 1; Date.now() - started < ms; step += 1) {
    x = cx + 60 * Math.sin(step / 10);
    await send("mouseMoved", x, { buttons: 1 });
    await ctx.sleep(16);
  }
  const frames = (await read()) - before;
  const elapsed = Date.now() - started;
  await send("mouseReleased", x, { clickCount: 1, buttons: 0 });
  await cdp.detach();
  return Number(((frames * 1000) / elapsed).toFixed(1));
}

const qualityOf = (page) => page.evaluate(() => /render-quality-(\w+)/.exec(document.querySelector(".home-workspace")?.className ?? "")?.[1] ?? null);

/** eco/high 下 drei Edges 的数量（LineMaterial 或非天气的 LineSegments）。 */
const edgesCount = (page) =>
  page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    let count = 0;
    s?.scene.traverse((object) => {
      const material = Array.isArray(object.material) ? object.material[0] : object.material;
      if ((object.isLineSegments || material?.type === "LineMaterial") && !object.name.startsWith("ha3d-weather")) count += 1;
    });
    return count;
  });

/**
 * 把当前项目临时换成采集基线时的场景，测 eco/high 的 draw call，再换回来。
 * fixture：引入 baseline.mjs 那个提交里的 fixture（之后 FEAT-003 给 fixture 加了房间、家具、设备）；
 * 自定义项目：HA3D_PROJECT_JSON 原文件（前面的 editor、interaction 套件会往项目里放家具、拖动设备并保存）。
 */
async function baselineSceneDrawCalls(ctx, page) {
  const git = (...args) => run("git", ["-C", repoDir, ...args], { maxBuffer: 16 * 1024 * 1024 }).then((result) => result.stdout);
  const commit = ctx.isFixture ? (await git("log", "--diff-filter=A", "--format=%h", "--", "tools/e2e/baseline.mjs")).trim().split("\n").pop() : null;
  const old = ctx.isFixture ? JSON.parse(await git("show", `${commit}:tools/fixtures/demo-project.json`)) : ctx.project;
  const current = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
  const put = (project) => fetch(`${ctx.stack.appUrl}/api/projects/${encodeURIComponent(current.id)}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...project, id: current.id }) });
  const result = ctx.isFixture ? { fixtureCommit: commit } : { project: "HA3D_PROJECT_JSON 原文件" };
  try {
    if (!(await put(old)).ok) throw new Error("保存基线 fixture 失败");
    for (const quality of ["eco", "high"]) {
      await ctx.gotoHome(page, { quality, settleMs: 3000, prefs: { "ha3d.home.pet": null } });
      result[quality] = await ctx.drawCallsPerFrame(page);
    }
  } finally {
    await put(current);
  }
  return result;
}

/**
 * 把当前项目临时换成「同样的房间和墙，只留空调，没有家具和其他设备」，在 480×320 下测四种画质只有出风动画时的帧率
 * 和拖动视角时的帧率，再换回来。场景够轻，SwiftShader 能跑到 60 fps 左右，才看得出 smooth 的 30 fps 上限。
 */
async function simpleSceneFps(ctx) {
  const current = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
  const put = (project) => fetch(`${ctx.stack.appUrl}/api/projects/${encodeURIComponent(current.id)}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...project, id: current.id }) });
  const simple = { ...current, floors: current.floors.map((floor) => ({ ...floor, furniture: [], devices: (floor.devices ?? []).filter((device) => device.kind === "climate") })) };
  const result = { devices: simple.floors.flatMap((floor) => floor.devices.map((device) => device.entityId)), deviceOnly: {}, drag: {} };
  try {
    if (!(await put(simple)).ok) throw new Error("保存只留空调的项目失败");
    const page = await ctx.newPage({ startTime: NOON, viewport: { width: 480, height: 320 } });
    for (const quality of QUALITIES) {
      await ctx.gotoHome(page, { quality, settleMs: 3000, prefs: { "ha3d.home.pet": null } });
      result.deviceOnly[quality] = Number(((await ctx.countFrames(page, 5000)) / 5).toFixed(1));
      result.drag[quality] = await dragFps(ctx, page);
    }
    await page.context().close();
  } finally {
    await put(current);
  }
  return result;
}

async function imageSize(tag, { pull = false } = {}) {
  try {
    const { stdout } = await run("docker", ["image", "inspect", tag, "--format", "{{.Size}}"], { timeout: 30_000 });
    return Number(stdout.trim());
  } catch {
    if (!pull) return null;
  }
  try {
    await run("docker", ["pull", "--platform", "linux/arm64", tag], { timeout: 600_000 });
    return imageSize(tag);
  } catch {
    return null;
  }
}

/** 与上游导入时（引入 AppSelect.js 的那个提交）比较前端文件大小，列出删掉的文件。 */
async function codeDiff() {
  const git = (...args) => run("git", ["-C", repoDir, ...args], { maxBuffer: 64 * 1024 * 1024 }).then((result) => result.stdout);
  const base = process.env.HA3D_PERF_BASE_REF || (await git("log", "--diff-filter=A", "--format=%h", "--", `${webDir}/assets/AppSelect.js`)).trim().split("\n").pop();
  const baseFiles = (await git("ls-tree", "-r", "--name-only", base, "--", webDir)).trim().split("\n");
  const files = [];
  for (const file of ["index.html", "assets/index.js", "assets/HomeView.js", "assets/AppSelect.js", "assets/FloorplanEditor.js", "assets/AuthorSupportDialog.js", "assets/three.js", "assets/ha3dPet.js"]) {
    const full = `${webDir}/${file}`;
    const before = baseFiles.includes(full) ? await git("show", `${base}:${full}`) : null;
    const after = existsSync(path.join(repoDir, full)) ? await readFile(path.join(repoDir, full), "utf8") : null;
    files.push({ file, beforeBytes: before === null ? null : Buffer.byteLength(before), afterBytes: after === null ? null : Buffer.byteLength(after), beforeLines: before?.split("\n").length ?? null, afterLines: after?.split("\n").length ?? null });
  }
  const deleted = [];
  for (const file of baseFiles) if (!existsSync(path.join(repoDir, file))) deleted.push({ file: file.slice(webDir.length + 1), bytes: Buffer.byteLength(await git("show", `${base}:${file}`)) });
  return { base, files, deleted };
}

export default async function perf(ctx) {
  const { check } = ctx;
  const baseline = await loadBaseline(ctx);
  const before = baseline.data?.B6 ?? null;
  const out = { baselineFile: baseline.file, idleFrames5s: {}, idleFramesWithDevices5s: {}, deviceOnlyFpsSmallViewport: {}, dragFpsSmallViewport: {}, animatedFps: {}, animatedFpsSmallViewport: {}, drawCalls: {}, edges: {}, lowEnd: {} };

  // ---------- 资源：首页、编辑器 ----------
  {
    const page = await ctx.newPage({ startTime: NOON });
    await ctx.gotoHome(page, { prefs: { "ha3d.home.pet": null } });
    const resources = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => ({ name: entry.name, size: entry.decodedBodySize })));
    const js = resources.filter((entry) => /\.js(\?|$)/.test(entry.name));
    out.homeJsBytes = js.reduce((sum, entry) => sum + entry.size, 0);
    out.homeJsFiles = js.map((entry) => ({ file: new URL(entry.name).pathname, bytes: entry.size }));
    out.homeRequestedHls = js.some((entry) => entry.name.includes("hls"));
    out.homeRequestedPet = js.some((entry) => entry.name.includes("ha3dPet"));
    await ctx.gotoEditor(page, { view: "2d", settleMs: 800 });
    await page.locator(".view-switch button", { hasText: "3D" }).click();
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await ctx.waitForScene(page, { requireDevices: false, settleMs: 1500 });
    out.editorRequestedHls = page.ha3dResponses.some((item) => item.url.includes("hls"));
    const saved = before ? before.homeJsBytes - out.homeJsBytes : null;
    out.homeJsSavedBytes = saved;
    check("B6 首页不请求 hls.js，也不加载宠物代码（默认无宠物）", !out.homeRequestedHls && !out.homeRequestedPet, out.homeJsFiles);
    check("B6 编辑器（2D 和 3D）不请求 hls.js", !out.editorRequestedHls, page.ha3dResponses.filter((item) => item.url.includes("hls")));
    check("B6 首页 JS 字节数比基线少 ≥ 500 KB", saved !== null && saved >= 500 * KB, { before: before?.homeJsBytes, after: out.homeJsBytes, savedKB: saved === null ? null : Number((saved / KB).toFixed(1)) });
    check("B6 首页没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
    await page.context().close();
  }

  // ---------- 空闲帧数：先按默认设备状态记录（和基线同条件），再让设备停下来断言 0 帧 ----------
  {
    const page = await ctx.newPage({ startTime: NOON });
    for (const quality of QUALITIES) {
      await ctx.gotoHome(page, { quality, settleMs: 3000, prefs: { "ha3d.home.pet": null } });
      out.idleFramesWithDevices5s[quality] = await ctx.countFrames(page, 5000);
    }
    out.stoppedDevices = await stopDeviceAnimations(ctx);
    for (const quality of QUALITIES) {
      await ctx.gotoHome(page, { quality, settleMs: 3000, prefs: { "ha3d.home.pet": null } });
      out.idleSettleMs = { ...(out.idleSettleMs ?? {}), [quality]: await waitIdle(ctx, page) };
      out.idleFrames5s[quality] = await ctx.countFrames(page, 5000);
      ctx.log(`空闲 ${quality}：${out.idleFrames5s[quality]} 帧（设备在动时 ${out.idleFramesWithDevices5s[quality]}）`);
    }
    check("B6 没有持续动画时（晴天白天、无宠物、设备停止）各画质稳定后 5 秒 0 帧", QUALITIES.every((quality) => out.idleFrames5s[quality] === 0), { idle: out.idleFrames5s, settleMs: out.idleSettleMs, withDevices: out.idleFramesWithDevices5s, stopped: out.stoppedDevices });
    await page.context().close();
    await ctx.mock.reset();
  }

  // ---------- 只有设备动画（晴天白天、无宠物，mock 默认空调制冷、出风开着）：eco/smooth 限帧，拖动视角不限帧 ----------
  // 1440×900 用上面「默认设备状态」的空闲帧数；SwiftShader 在 1440×900 下 eco 本身只能跑 20 fps 左右，所以另在 480×320 下测
  {
    out.deviceOnlyFps = Object.fromEntries(QUALITIES.map((quality) => [quality, Number((out.idleFramesWithDevices5s[quality] / 5).toFixed(1))]));
    const page = await ctx.newPage({ startTime: NOON, viewport: { width: 480, height: 320 } });
    for (const quality of ["eco", "smooth", "balanced"]) {
      await ctx.gotoHome(page, { quality, settleMs: 3000, prefs: { "ha3d.home.pet": null } });
      out.deviceOnlyFpsSmallViewport[quality] = Number(((await ctx.countFrames(page, 5000)) / 5).toFixed(1));
      out.dragFpsSmallViewport[quality] = await dragFps(ctx, page);
    }
    ctx.log(`只有出风动画的帧率：1440×900 ${JSON.stringify(out.deviceOnlyFps)}，480×320 ${JSON.stringify(out.deviceOnlyFpsSmallViewport)}；480×320 拖动时 ${JSON.stringify(out.dragFpsSmallViewport)}`);
    const small = out.deviceOnlyFpsSmallViewport;
    check(
      "B6 只有设备动画（空调出风开着）时 eco ≤ 22 fps、smooth ≤ 32 fps，且都在渲染（1440×900 和 480×320）",
      [out.deviceOnlyFps, small].every((fps) => fps.eco > 0 && fps.eco <= 22 && fps.smooth > 0 && fps.smooth <= 32),
      { "1440x900": out.deviceOnlyFps, "480x320": small },
    );
    const drag = out.dragFpsSmallViewport;
    check("B6 出风限帧不影响拖动视角：480×320 下 eco 拖动时 > 22 fps（出风限帧是 20 fps）", drag.eco > 22, { drag, deviceOnly: small });
    await page.context().close();
    // 整个户型下 smooth、balanced 在 SwiftShader 里本身只能跑 25–30 / 8 fps 左右，看不出 30 fps 的上限，也看不出 balanced/high 不限帧：
    // 临时把场景换成只留空调（见 simpleSceneFps），再测一遍四种画质
    out.simpleScene = await simpleSceneFps(ctx);
    const simple = out.simpleScene;
    ctx.log(`只留空调的场景（480×320）：只有出风 ${JSON.stringify(simple.deviceOnly)}，拖动时 ${JSON.stringify(simple.drag)}`);
    // balanced/high 不限帧：只有出风时的帧率接近同画质拖动时的帧率（软件渲染本身的上限；户型大时 high 也跑不到 60 fps）
    check(
      "B6 只留空调的场景（480×320）：只有出风时 eco ≤ 22 fps、smooth ≤ 32 fps，balanced/high 不限帧（不低于同画质拖动时的 80%）；拖动视角时 eco、smooth 都 > 32 fps",
      simple.deviceOnly.eco > 0 && simple.deviceOnly.eco <= 22 && simple.deviceOnly.smooth > 0 && simple.deviceOnly.smooth <= 32 &&
        ["balanced", "high"].every((quality) => simple.deviceOnly[quality] >= simple.drag[quality] * 0.8) && simple.drag.eco > 32 && simple.drag.smooth > 32,
      simple,
    );
    await ctx.mock.reset();
  }

  // ---------- 只有传感器脉冲环（设备都停下，改一次传感器读数，脉冲约 2.4 秒）：eco/smooth 同样限帧 ----------
  {
    const sensor = ctx.project.floors.flatMap((floor) => floor.devices ?? []).find((device) => device.kind === "sensor" && device.entityId);
    if (sensor) {
      await stopDeviceAnimations(ctx);
      const page = await ctx.newPage({ startTime: NOON, viewport: { width: 480, height: 320 } });
      const read = () => page.evaluate(() => window.__ha3dDebug.get().gl.info.render.frame);
      out.sensorPulseFpsSmallViewport = {};
      for (const [index, quality] of ["eco", "smooth", "balanced"].entries()) {
        await ctx.gotoHome(page, { quality, settleMs: 3000, prefs: { "ha3d.home.pet": null } });
        await waitIdle(ctx, page);
        await ctx.mock.set(sensor.entityId, (40.5 + index).toFixed(1));
        await ctx.sleep(300);
        const before = await read();
        await ctx.sleep(2000);
        out.sensorPulseFpsSmallViewport[quality] = Number((((await read()) - before) / 2).toFixed(1));
      }
      const pulse = out.sensorPulseFpsSmallViewport;
      ctx.log(`只有传感器脉冲环的帧率（480×320，${sensor.entityId}）：${JSON.stringify(pulse)}`);
      check("B6 只有传感器脉冲环在动时（480×320）eco ≤ 22 fps、smooth ≤ 32 fps，且都在渲染", pulse.eco > 0 && pulse.eco <= 22 && pulse.smooth > 0 && pulse.smooth <= 32, { entityId: sensor.entityId, ...pulse });
      await page.context().close();
      await ctx.mock.reset();
    }
  }

  // ---------- 持续动画（下雨 + 宠物；空调出风开着）下的帧率 ----------
  for (const [key, viewport] of [
    ["animatedFps", { width: 1440, height: 900 }],
    ["animatedFpsSmallViewport", { width: 480, height: 320 }],
  ]) {
    await ctx.mock.set("weather.home", "rainy");
    const page = await ctx.newPage({ startTime: NOON, viewport });
    for (const quality of ["eco", "smooth", "balanced"]) {
      await ctx.gotoHome(page, { quality, settleMs: 3000, prefs: { "ha3d.home.pet": "cat", "ha3d.home.environmentSync": null } });
      const frames = await ctx.countFrames(page, 5000);
      out[key][quality] = Number((frames / 5).toFixed(1));
    }
    ctx.log(`持续动画帧率（${viewport.width}×${viewport.height}）：${JSON.stringify(out[key])}`);
    check(`B6 持续动画时（${viewport.width}×${viewport.height}）eco ≤ 22 fps、smooth ≤ 32 fps，且都在渲染`, out[key].eco > 0 && out[key].eco <= 22 && out[key].smooth > 0 && out[key].smooth <= 32, out[key]);
    await page.context().close();
    await ctx.mock.reset();
  }

  // ---------- draw call、Edges ----------
  {
    const page = await ctx.newPage({ startTime: NOON });
    for (const quality of ["eco", "high"]) {
      await ctx.gotoHome(page, { quality, settleMs: 3000, prefs: { "ha3d.home.pet": null } });
      out.drawCalls[quality] = await ctx.drawCallsPerFrame(page);
      out.edges[quality] = await edgesCount(page);
    }
    // 同场景对比：换回采集基线时的场景再测一次（见 baselineSceneDrawCalls）
    out.drawCallsSameScene = await baselineSceneDrawCalls(ctx, page);
    const beforeEco = before?.drawCalls?.eco?.calls ?? null;
    check("B6 同一场景下 eco 每帧 draw call 比基线 eco 少", beforeEco !== null && out.drawCallsSameScene?.eco?.calls < beforeEco, { before: before?.drawCalls, sameScene: out.drawCallsSameScene, currentProject: out.drawCalls });
    check("B6 eco 下不画 drei Edges 描边（high 下照常）", out.edges.eco === 0 && out.edges.high > 0, out.edges);
    await page.context().close();
  }

  // ---------- 低端设备默认画质 ----------
  {
    const lowEnd = await ctx.newPage({ lowEnd: true, startTime: NOON });
    await ctx.gotoHome(lowEnd, { prefs: { "ha3d.home.sceneQuality": null } });
    out.lowEnd.twoCores = { quality: await qualityOf(lowEnd), navigator: await lowEnd.evaluate(() => ({ hardwareConcurrency: navigator.hardwareConcurrency, deviceMemory: navigator.deviceMemory })) };
    const mid = await ctx.newPage({ startTime: NOON });
    await mid.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "hardwareConcurrency", { get: () => 4, configurable: true });
      Object.defineProperty(Navigator.prototype, "deviceMemory", { get: () => 4, configurable: true });
    });
    await ctx.gotoHome(mid, { prefs: { "ha3d.home.sceneQuality": null } });
    out.lowEnd.fourCores = { quality: await qualityOf(mid) };
    const normal = await ctx.newPage({ startTime: NOON });
    await ctx.gotoHome(normal, { prefs: { "ha3d.home.sceneQuality": null } });
    out.lowEnd.thisMachine = { quality: await qualityOf(normal), navigator: await normal.evaluate(() => ({ hardwareConcurrency: navigator.hardwareConcurrency, deviceMemory: navigator.deviceMemory })) };
    check("B6 模拟低端设备（2 核 / 2 GB）且没保存画质时默认 eco", out.lowEnd.twoCores.quality === "eco", out.lowEnd.twoCores);
    // 本机不改写 navigator：按它自己的核数/内存应得的默认值判断（> 4 核且 > 4 GB 时按屏宽，1440 px → high）
    const { hardwareConcurrency: cores, deviceMemory: memory } = out.lowEnd.thisMachine.navigator;
    out.lowEnd.thisMachine.expected = (cores && cores <= 2) || (memory && memory <= 2) ? "eco" : (cores && cores <= 4) || (memory && memory <= 4) ? "smooth" : "high";
    check("B6 4 核 / 4 GB 时默认 smooth，本机按自身能力（够强时按屏宽）", out.lowEnd.fourCores.quality === "smooth" && out.lowEnd.thisMachine.quality === out.lowEnd.thisMachine.expected, { fourCores: out.lowEnd.fourCores, thisMachine: out.lowEnd.thisMachine });
  }

  // ---------- 镜像大小、删掉的代码 ----------
  out.images = { "ha3d:arm64": await imageSize("ha3d:arm64"), "ha3d:amd64": await imageSize("ha3d:amd64"), [UPSTREAM_IMAGE]: await imageSize(UPSTREAM_IMAGE, { pull: true }) };
  let dockerAvailable = true;
  try {
    await run("docker", ["info", "--format", "{{.ServerVersion}}"], { timeout: 20_000 });
  } catch {
    dockerAvailable = false;
  }
  check("B6 镜像大小已记录（本仓库 ha3d:arm64 与上游 0.1.6 arm64）", !dockerAvailable ? true : out.images["ha3d:arm64"] > 0 && out.images[UPSTREAM_IMAGE] > 0, dockerAvailable ? out.images : "docker 不可用，跳过");
  out.code = await codeDiff();

  // ---------- perf.md ----------
  const yes = (value) => (value ? "是" : "否");
  const row = (name, b, a, ok) => `| ${name} | ${b ?? "—"} | ${a ?? "—"} | ${ok === undefined ? "" : ok ? "✓" : "✗"} |`;
  const lines = [
    `# B6 精简与性能：前后对比（${ctx.isFixture ? "fixture" : "自定义项目"}）`,
    "",
    `基线：${baseline.file ? (baseline.file.startsWith(path.dirname(ctx.evidenceRoot)) ? path.relative(ctx.evidenceRoot, baseline.file) : baseline.file) : "（没有找到基线）"}（FEAT-002 在改动前采集）。生成时间：${new Date().toISOString()}。浏览器：Playwright chromium-headless-shell + SwiftShader（软件渲染，帧率远低于真实 GPU）。`,
    "",
    "| 指标 | 基线 | 现在 | 达标 |",
    "| --- | --- | --- | --- |",
    row("首页 JS 总字节（解码后）", kb(before?.homeJsBytes), `${kb(out.homeJsBytes)}（少 ${kb(out.homeJsSavedBytes)}）`, out.homeJsSavedBytes >= 500 * KB),
    row("首页请求 hls.js", yes(before?.homeRequestedHls), yes(out.homeRequestedHls), !out.homeRequestedHls),
    row("编辑器请求 hls.js", yes(before?.editorRequestedHls), yes(out.editorRequestedHls), !out.editorRequestedHls),
    row("首页加载宠物代码 ha3dPet.js（默认无宠物）", "—", yes(out.homeRequestedPet), !out.homeRequestedPet),
    ...QUALITIES.map((quality) => row(`空闲 5 秒帧数 ${quality}（默认设备状态，空调出风开着）`, before?.idleFrames5s?.[quality], out.idleFramesWithDevices5s[quality])),
    ...QUALITIES.map((quality) => row(`空闲 5 秒帧数 ${quality}（没有任何持续动画）`, "—", out.idleFrames5s[quality], out.idleFrames5s[quality] === 0)),
    ...["eco", "smooth", "balanced"].map((quality) => row(`只有出风动画 帧率 ${quality}，480×320（fps）`, "—", out.deviceOnlyFpsSmallViewport[quality], quality === "eco" ? out.deviceOnlyFpsSmallViewport.eco <= 22 : quality === "smooth" ? out.deviceOnlyFpsSmallViewport.smooth <= 32 : undefined)),
    ...["eco", "smooth", "balanced"].map((quality) => row(`只有出风动画、同时拖动视角 帧率 ${quality}，480×320（fps）`, "—", out.dragFpsSmallViewport[quality], quality === "eco" ? out.dragFpsSmallViewport.eco > 22 : undefined)),
    ...QUALITIES.map((quality) => row(`只留空调的场景：只有出风动画 帧率 ${quality}，480×320（fps）`, "—", out.simpleScene.deviceOnly[quality], quality === "eco" ? out.simpleScene.deviceOnly.eco <= 22 : quality === "smooth" ? out.simpleScene.deviceOnly.smooth <= 32 : out.simpleScene.deviceOnly[quality] >= out.simpleScene.drag[quality] * 0.8)),
    ...QUALITIES.map((quality) => row(`只留空调的场景：只有出风动画、同时拖动视角 帧率 ${quality}，480×320（fps）`, "—", out.simpleScene.drag[quality], quality === "eco" || quality === "smooth" ? out.simpleScene.drag[quality] > 32 : undefined)),
    ...(out.sensorPulseFpsSmallViewport
      ? ["eco", "smooth", "balanced"].map((quality) => row(`只有传感器脉冲环 帧率 ${quality}，480×320（fps）`, "—", out.sensorPulseFpsSmallViewport[quality], quality === "eco" ? out.sensorPulseFpsSmallViewport.eco <= 22 : quality === "smooth" ? out.sensorPulseFpsSmallViewport.smooth <= 32 : undefined))
      : []),
    ...["eco", "smooth", "balanced"].map((quality) => row(`下雨 + 宠物 帧率 ${quality}，1440×900（fps）`, "—", out.animatedFps[quality], quality === "eco" ? out.animatedFps.eco <= 22 : quality === "smooth" ? out.animatedFps.smooth <= 32 : undefined)),
    ...["eco", "smooth", "balanced"].map((quality) => row(`下雨 + 宠物 帧率 ${quality}，480×320（fps）`, "—", out.animatedFpsSmallViewport[quality], quality === "eco" ? out.animatedFpsSmallViewport.eco <= 22 : quality === "smooth" ? out.animatedFpsSmallViewport.smooth <= 32 : undefined)),
    row("每帧 draw call eco（与基线同一场景）", before?.drawCalls?.eco?.calls, out.drawCallsSameScene?.eco?.calls, before?.drawCalls?.eco ? out.drawCallsSameScene?.eco?.calls < before.drawCalls.eco.calls : undefined),
    row("每帧 draw call high（与基线同一场景）", before?.drawCalls?.high?.calls, out.drawCallsSameScene?.high?.calls),
    row(`每帧 draw call eco / high（当前${ctx.isFixture ? " fixture，含 FEAT-003 新增的房间、家具、设备" : "项目，含前面套件放进去的家具"}）`, "—", `${out.drawCalls.eco?.calls} / ${out.drawCalls.high?.calls}`),
    row("每帧三角形 eco（与基线同一场景）", before?.drawCalls?.eco?.triangles, out.drawCallsSameScene?.eco?.triangles),
    row("drei Edges 描边数 eco / high", "—", `${out.edges.eco} / ${out.edges.high}`, out.edges.eco === 0),
    row("低端设备（2 核 / 2 GB）默认画质", before?.lowEndDefaultQuality, out.lowEnd.twoCores.quality, out.lowEnd.twoCores.quality === "eco"),
    row("4 核 / 4 GB 默认画质", "—", out.lowEnd.fourCores.quality, out.lowEnd.fourCores.quality === "smooth"),
    "",
    "说明：「默认设备状态」的空闲帧数不是 0，是因为 mock 里空调默认制冷，出风动画在动（设备动画，不属于场景的持续动画）。省电（eco）、流畅（smooth）下，设备动画自己触发的重绘（空调、风扇等的出风，传感器的脉冲环）经 ha3dDeviceAnimInvalidate 限到 20 / 30 fps；均衡（balanced）、高（high）照旧每帧重绘，SwiftShader 下受软件渲染速度限制，真机上是屏幕刷新率。拖动、缩放视角时帧由 OrbitControls 驱动，不受这个限制，仍按屏幕刷新率渲染（见「同时拖动视角」几行）。整个户型下 smooth、balanced 在 SwiftShader 里本身只能跑 25–30 / 8 fps 左右，看不出 smooth 的 30 fps 上限，也看不出 balanced/high 不限帧，所以另把场景临时换成「同样的房间和墙，只留空调」测了四种画质（「只留空调的场景」几行，eco、smooth 拖动时 SwiftShader 在这里能跑到 60 fps 左右；balanced/high 的达标条件是只有出风时不低于同画质拖动时的 80%，即和软件渲染本身的上限一致、没有被限帧）。传感器脉冲环那几行是设备都停下后改一次传感器读数，测脉冲期间 2 秒的帧率。设备都停下后各画质 5 秒 0 帧。场景有持续动画（天气、云、星空、宠物、自动旋转）时，eco/smooth 由 ha3dFrameTicker 接管渲染（20/30 fps 上限，这期间拖动视角和设备动画也不超过上限），balanced/high 仍是 always。SwiftShader 在 1440×900 下本身跑不到 30 fps，所以另在 480×320 下测了一遍。",
    "",
    "## 镜像大小（docker image inspect 的 Size）",
    "",
    "| 镜像 | 大小 |",
    "| --- | --- |",
    ...Object.entries(out.images).map(([tag, size]) => `| ${tag}${tag === UPSTREAM_IMAGE ? "（上游，只为测量而拉取）" : ""} | ${mb(size)}${size ? `（${size} B）` : ""} |`),
    "",
    `## 前端文件（与上游导入时 ${out.code.base} 比较）`,
    "",
    "| 文件 | 上游字节 | 现在字节 | 上游行数 | 现在行数 |",
    "| --- | --- | --- | --- | --- |",
    ...out.code.files.map((item) => `| ${item.file} | ${item.beforeBytes ?? "—"} | ${item.afterBytes ?? "—"} | ${item.beforeLines ?? "—"} | ${item.afterLines ?? "—"} |`),
    "",
    `删除的文件：${out.code.deleted.map((item) => `${item.file}（${item.bytes} B）`).join("、") || "无"}。`,
    "",
    "删掉的代码：index.js / HomeView.js / FloorplanEditor.js / AuthorSupportDialog.js / three.js 里 hls.js 的副作用导入和 __vite__mapDeps 预加载项、index.html 的 hls modulepreload（hls.js 只在播放摄像头时由 AppSelect.js 动态加载）；HomeView.js 永远关闭的开发展示面板（Bs、Xs、Ot、K、Ks、ft、qs、Qs、sa、Zs、Us、Gs、Ys、Js、en、tn、Gn 和 bug 图标）；AppSelect.js 不可达的卡通风格描边（OutlineEffect 类 Ko、Ja）、卡通调色板（Fe、un，以及 Nn、Fn 里的卡通配色）和各模型的 meshToonMaterial 分支；每个 lucide 图标前重复的同一份许可声明合并为每个文件一处。宠物代码拆到按需加载的 ha3dPet.js。",
    "",
  ];
  await mkdir(ctx.dir, { recursive: true });
  await writeFile(path.join(ctx.dir, "perf.md"), lines.join("\n"));
  await ctx.writeJson(path.join(ctx.dir, "perf.json"), out);
  return { homeJsBytes: out.homeJsBytes, savedKB: out.homeJsSavedBytes && Number((out.homeJsSavedBytes / KB).toFixed(1)), idle: out.idleFrames5s, fps: out.animatedFps, fpsSmall: out.animatedFpsSmallViewport, drawCalls: out.drawCalls, images: out.images };
}
