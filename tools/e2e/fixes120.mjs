// 1.2.0 界面调整，5 段：
// author：作者弹窗（编辑器顶栏按钮、弹窗、头像图片）已删除：文件不存在、代码里没有引用、首页和编辑器 2D/3D 里没有相关元素和文字、不请求这些资源；
// inspector：编辑器属性面板右上角的收起图标（1440 宽 2D/3D、900 宽），收起后出现「属性」按钮、点它恢复，展开状态存本机 ha3d:show-inspector，选中设备时自动展开；
// weather：奶油风格的 4 天天气预报条和玻璃风格计算样式一致（1440、390 宽，附两种风格的截图）；
// voice：奶油风格下语音面板的对话、状态、输入框文字是黑色，玻璃风格不变；
// tabs：首页没有「全屋/照明/遮阳/环境/安防」tab，模式固定为全屋，左下 ☰、右下麦克风、设备面板、场景面板仍在。
// HA3D_FIXES120_BASELINE=1 时只记录不断言（在未修改的前端上采集基线）；HA3D_FIXES120_ONLY=author,inspector,weather,voice,tabs 只跑其中几段。
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fakeRecognition } from "./fixes023.mjs";

const NOON = "2026-06-01T12:00:00";
const BASELINE = process.env.HA3D_FIXES120_BASELINE === "1";
const ONLY = new Set((process.env.HA3D_FIXES120_ONLY || "author,inspector,weather,voice,tabs").split(",").map((item) => item.trim()));
const STYLES = ["glass", "cream"];
const WIDE = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };
const WEB = fileURLToPath(new URL("../../jmglink-ha-3d-home/app/apps/web/dist/", import.meta.url));
const AVATARS = ["bao-DLSEpnIs", "dong-DgWfh9gf", "ec-CXT8k6X9", "mk-s3fnpTA8", "niu-CqhQI55s", "sheng-wrAbX6pX", "star-dash-MlyKIEhc", "star-v-C-491AVE", "star-yi-g43xz0NV", "tian-D1bs_UW3", "tu-CIrL7ZWP"];
const AUTHOR_FILES = ["AuthorSupportDialog.js", ...AVATARS.map((name) => `${name}.png`)];
const AUTHOR_PATTERN = new RegExp(["AuthorSupport", "author-support", "editor-support", "jmglink-logo", "heart-handshake", "为爱发电", "支持作者", ...AVATARS].join("|"));
const AUTHOR_REQUEST = new RegExp(["AuthorSupportDialog\\.js", ...AVATARS].join("|"));
const THIRD_PARTY = new Set(["three.js", "react.js", "hls.js"]);
const MODE_TABS = ["全屋", "照明", "遮阳", "环境", "安防"];
const BLACK = "rgb(0, 0, 0)";
const INSPECTOR_KEY = "ha3d:show-inspector";

/** 元素存在且可见时点击，返回是否点了（基线时按钮可能不存在，不能卡在超时上）。 */
async function clickIf(locator, options) {
  const first = locator.first();
  if (!(await first.count()) || !(await first.isVisible())) return false;
  await first.click(options);
  return true;
}

/** 按元素的包围盒外扩 pad 截图（裁到视口内）；元素不存在时截整页。 */
async function shotAround(ctx, page, selector, name, pad = 24) {
  const box = await page.locator(selector).first().boundingBox().catch(() => null);
  const viewport = page.viewportSize();
  if (!box || !viewport) return path.basename((await ctx.shot(page, name)).path);
  const x = Math.max(0, box.x - pad);
  const y = Math.max(0, box.y - pad);
  const clip = { x, y, width: Math.min(viewport.width, box.x + box.width + pad) - x, height: Math.min(viewport.height, box.y + box.height + pad) - y };
  return path.basename((await ctx.shot(page, name, { clip })).path);
}

// ---------- author ----------
async function scanAuthorCode() {
  const files = [
    ...(await readdir(WEB)).filter((name) => /\.(html|md)$/.test(name)),
    ...(await readdir(path.join(WEB, "assets"))).filter((name) => /\.(js|css)$/.test(name) && !THIRD_PARTY.has(name)).map((name) => `assets/${name}`),
  ];
  const hits = [];
  for (const file of files) {
    const lines = (await readFile(path.join(WEB, file), "utf8")).split("\n");
    lines.forEach((line, index) => {
      if (AUTHOR_PATTERN.test(line)) hits.push(`${file}:${index + 1}: ${line.trim().slice(0, 120)}`);
    });
  }
  return { files, hits };
}

async function authorDom(page) {
  return page.evaluate(() => ({
    elements: document.querySelectorAll('[class*="author-support"], .editor-support-slot').length,
    text: ["为爱发电", "支持作者"].filter((word) => document.body.innerText.includes(word)),
  }));
}

// ---------- inspector ----------
async function inspectorState(page, key) {
  return page.evaluate((key) => {
    const visible = (el) => {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.5 && rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.left < window.innerWidth && rect.bottom > 0 && rect.top < window.innerHeight;
    };
    const panel = document.querySelector(".inspector-panel");
    const collapse = document.querySelector(".ha3d-inspector-collapse");
    const fab = document.querySelector(".inspector-fab");
    const panelRect = panel?.getBoundingClientRect();
    const collapseRect = collapse?.getBoundingClientRect();
    return {
      open: Boolean(panel?.classList.contains("open")),
      panelVisible: visible(panel),
      collapseVisible: visible(collapse),
      collapseOffset: panelRect && collapseRect && visible(collapse) ? { right: Math.round(panelRect.right - collapseRect.right), top: Math.round(collapseRect.top - panelRect.top) } : null,
      closeVisible: visible(document.querySelector(".inspector-close")),
      fabVisible: visible(fab),
      fabText: fab?.textContent.trim() ?? null,
      stored: window.localStorage.getItem(key),
    };
  }, key);
}
/** 等属性面板的显隐过渡（0.22 s）结束：3D 视图下 SwiftShader 占满主线程，过渡会拖到 1 s 以上。 */
async function settlePanel(page) {
  await page.waitForTimeout(500);
  await page.waitForFunction(() => (document.querySelector(".inspector-panel")?.getAnimations().length ?? 0) === 0, undefined, { timeout: 5000, polling: 100 }).catch(() => undefined);
}
const atCorner = (state) => Boolean(state.collapseOffset) && Math.abs(state.collapseOffset.right) <= 80 && Math.abs(state.collapseOffset.top) <= 80;

// ---------- voice ----------
async function voiceStyles(page) {
  return page.evaluate(() => {
    const read = (el, pseudo) => {
      if (!el) return null;
      const style = getComputedStyle(el, pseudo);
      return { color: style.color, textShadow: style.textShadow };
    };
    const input = document.querySelector(".voice-input input");
    return {
      messages: [...document.querySelectorAll(".voice-message")].map((el) => ({ role: el.classList.contains("user") ? "user" : "assistant", text: el.textContent, ...read(el.querySelector("p")) })),
      status: read(document.querySelector(".voice-status")),
      picker: read(document.querySelector(".voice-picker-trigger")),
      input: read(input),
      placeholder: input ? getComputedStyle(input, "::placeholder").color : null,
      mic: read(document.querySelector(".voice-input-mic"))?.color ?? null,
    };
  });
}

export default async function fixes120(ctx) {
  const check = (name, ok, detail) => (BASELINE ? ctx.check(`[基线，只记录] ${name}`, true, { ok: Boolean(ok), detail }) : ctx.check(name, ok, detail));
  const out = { baseline: BASELINE, author: {}, inspector: {}, weather: {}, voice: {}, tabs: {} };
  const ownContexts = [];
  try {
    await ctx.mock.set("sun.sun", "above_horizon", { elevation: 45, azimuth: 180, rising: false });
    for (const entityId of ["weather.home", "weather.backup"]) await ctx.mock.set(entityId, "sunny");

    // ---------- 1. 作者弹窗已删除 ----------
    if (ONLY.has("author")) {
      const record = out.author;
      record.files = Object.fromEntries(AUTHOR_FILES.map((name) => [name, existsSync(path.join(WEB, "assets", name))]));
      const present = Object.entries(record.files).filter(([, exists]) => exists).map(([name]) => name);
      check("作者弹窗模块 AuthorSupportDialog.js 和 11 张头像 png 都已删除", present.length === 0, present);
      const scan = await scanAuthorCode();
      record.scan = { scanned: scan.files.length, hits: scan.hits };
      check(`前端代码（index.html、根目录 .md/.html、assets 下 ${scan.files.filter((file) => file.startsWith("assets/")).length} 个 js/css，不含 three/react/hls）里没有作者弹窗的类名、文案和头像引用`, scan.hits.length === 0, { hits: scan.hits.length, first: scan.hits.slice(0, 10) });

      const page = await ctx.newPage({ startTime: NOON, viewport: WIDE });
      await ctx.gotoHome(page, { style: "glass", quality: "smooth", prefs: { "ha3d.home.pet": null }, settleMs: 1500 });
      await clickIf(page.locator(".corner-dock-toggle"));
      await page.waitForTimeout(400);
      record.home = await authorDom(page);
      record.home.screenshot = path.basename((await ctx.shot(page, "author-home")).path);
      check("首页（展开 ☰ 菜单）没有作者入口元素，也没有「为爱发电」「支持作者」文字", record.home.elements === 0 && record.home.text.length === 0, record.home);

      await ctx.gotoEditor(page, { view: "2d", style: "glass", quality: "smooth", prefs: { "ha3d.home.pet": null } });
      record.editor2d = await authorDom(page);
      record.editor2d.screenshot = path.basename((await ctx.shot(page, "author-editor-2d")).path);
      check("编辑器 2D 没有作者入口元素，也没有「为爱发电」「支持作者」文字", record.editor2d.elements === 0 && record.editor2d.text.length === 0, record.editor2d);

      await page.evaluate(() => {
        window.__ha3dDebug = undefined;
      });
      await page.locator(".view-switch button", { hasText: "3D" }).click();
      await page.waitForSelector("canvas", { timeout: 30_000 });
      await ctx.waitForScene(page, { settleMs: 2500, requireDevices: false });
      record.editor3d = await authorDom(page);
      record.editor3d.screenshot = path.basename((await ctx.shot(page, "author-editor-3d")).path);
      check("编辑器 3D 没有作者入口元素，也没有「为爱发电」「支持作者」文字", record.editor3d.elements === 0 && record.editor3d.text.length === 0, record.editor3d);

      record.requests = page.ha3dResponses.filter((item) => AUTHOR_REQUEST.test(item.url)).map((item) => item.url);
      check("首页和编辑器没有请求作者弹窗模块和头像图片", record.requests.length === 0, record.requests);
      record.errors = page.ha3dErrors.slice(0, 3);
      check("作者弹窗段没有 pageerror", page.ha3dErrors.length === 0, record.errors);
      await page.context().close();
    }

    // ---------- 2. 属性面板右上角收起 ----------
    if (ONLY.has("inspector")) {
      const record = (out.inspector = { wide: {}, narrow: {} });
      const homePrefs = { style: "glass", quality: "smooth" };
      const wait = () => settlePanel(page);
      const page = await ctx.newPage({ startTime: NOON, viewport: WIDE });
      await ctx.gotoEditor(page, { view: "2d", ...homePrefs, prefs: { [INSPECTOR_KEY]: null, "ha3d.home.pet": null } });
      const initial = (record.wide.initial = await inspectorState(page, INSPECTOR_KEY));
      check("1440 宽 2D：属性面板默认展开，右上角有收起图标（离面板右上角 80 px 内），没有「属性」按钮", initial.open && initial.panelVisible && initial.collapseVisible && atCorner(initial) && !initial.fabVisible, initial);

      await clickIf(page.locator(".ha3d-inspector-collapse"));
      await wait();
      const collapsed = (record.wide.collapsed = await inspectorState(page, INSPECTOR_KEY));
      record.wide.collapsed.screenshot = path.basename((await ctx.shot(page, "inspector-2d-collapsed")).path);
      check("1440 宽 2D：点收起图标后面板隐藏，出现「属性」按钮，本机存 ha3d:show-inspector = false", !collapsed.open && !collapsed.panelVisible && collapsed.fabVisible && collapsed.fabText === "属性" && collapsed.stored === "false", collapsed);

      await clickIf(page.locator(".inspector-fab"));
      await wait();
      const restored = (record.wide.restored = await inspectorState(page, INSPECTOR_KEY));
      record.wide.restored.screenshot = path.basename((await ctx.shot(page, "inspector-2d-restored")).path);
      check("1440 宽 2D：点「属性」按钮后面板恢复，「属性」按钮消失，本机存 true", restored.open && restored.panelVisible && !restored.fabVisible && restored.stored === "true", restored);

      await clickIf(page.locator(".ha3d-inspector-collapse"));
      await wait();
      await ctx.gotoEditor(page, { view: "2d", ...homePrefs, prefs: { "ha3d.home.pet": null } });
      const reopened = (record.wide.reopened = await inspectorState(page, INSPECTOR_KEY));
      check("1440 宽：收起后重新进入编辑器，面板仍是收起的，「属性」按钮可见（状态存在本机）", !reopened.open && !reopened.panelVisible && reopened.fabVisible && reopened.stored === "false", reopened);

      const device = page.locator("g.plan-device");
      record.wide.deviceCount = await device.count();
      if (record.wide.deviceCount) await device.first().click({ force: true });
      await wait();
      const selected = (record.wide.selected = await inspectorState(page, INSPECTOR_KEY));
      check("1440 宽 2D：收起时点选设备，面板自动展开，本机存 true", record.wide.deviceCount > 0 && selected.open && selected.panelVisible && selected.stored === "true", selected);

      await page.evaluate(() => {
        window.__ha3dDebug = undefined;
      });
      await page.locator(".view-switch button", { hasText: "3D" }).click();
      await page.waitForSelector("canvas", { timeout: 30_000 });
      await ctx.waitForScene(page, { settleMs: 2500, requireDevices: false });
      const view3d = (record.wide.view3d = await inspectorState(page, INSPECTOR_KEY));
      await clickIf(page.locator(".ha3d-inspector-collapse"));
      await wait();
      const collapsed3d = (record.wide.collapsed3d = await inspectorState(page, INSPECTOR_KEY));
      record.wide.collapsed3d.screenshot = path.basename((await ctx.shot(page, "inspector-3d-collapsed")).path);
      await clickIf(page.locator(".inspector-fab"));
      await wait();
      const restored3d = (record.wide.restored3d = await inspectorState(page, INSPECTOR_KEY));
      record.wide.restored3d.screenshot = path.basename((await ctx.shot(page, "inspector-3d-restored")).path);
      check("1440 宽 3D：面板右上角有收起图标", view3d.open && view3d.collapseVisible && atCorner(view3d), view3d);
      check("1440 宽 3D：点收起图标后面板隐藏、出现「属性」按钮；点「属性」按钮后面板恢复", !collapsed3d.panelVisible && collapsed3d.fabVisible && collapsed3d.stored === "false" && restored3d.panelVisible && !restored3d.fabVisible && restored3d.stored === "true", { collapsed3d, restored3d });
      record.wide.errors = page.ha3dErrors.slice(0, 3);
      check("1440 宽属性面板页面没有 pageerror", page.ha3dErrors.length === 0, record.wide.errors);
      await page.context().close();

      const narrow = await ctx.newPage({ startTime: NOON, viewport: { width: 900, height: 700 } });
      await ctx.gotoEditor(narrow, { view: "2d", ...homePrefs, prefs: { [INSPECTOR_KEY]: null, "ha3d.home.pet": null } });
      const first = (record.narrow.initial = await inspectorState(narrow, INSPECTOR_KEY));
      check("900 宽：第一次进入时面板默认收起（宽 ≤960），「属性」按钮可见", !first.open && !first.panelVisible && first.fabVisible, first);
      await clickIf(narrow.locator(".inspector-fab"));
      await settlePanel(narrow);
      const opened = (record.narrow.opened = await inspectorState(narrow, INSPECTOR_KEY));
      check("900 宽：点「属性」展开后右上角是收起图标，原来的 X 按钮不显示", opened.panelVisible && opened.collapseVisible && atCorner(opened) && !opened.closeVisible, opened);
      await clickIf(narrow.locator(".ha3d-inspector-collapse"));
      await settlePanel(narrow);
      const closed = (record.narrow.collapsed = await inspectorState(narrow, INSPECTOR_KEY));
      record.narrow.collapsed.screenshot = path.basename((await ctx.shot(narrow, "inspector-900")).path);
      check("900 宽：点收起图标后面板隐藏，「属性」按钮出现", !closed.panelVisible && closed.fabVisible, closed);
      record.narrow.errors = narrow.ha3dErrors.slice(0, 3);
      check("900 宽属性面板页面没有 pageerror", narrow.ha3dErrors.length === 0, record.narrow.errors);
      await narrow.context().close();
    }

    // ---------- 3. 奶油天气预报条照搬玻璃 ----------
    if (ONLY.has("weather")) {
      const record = out.weather;
      record.note = "奶油米色背景上白字的可读性会变差（用户要求照搬玻璃样式）";
      for (const viewport of [WIDE, PHONE]) {
        const styles = {};
        const entry = (record[viewport.width] = {});
        for (const style of STYLES) {
          const page = await ctx.newPage({ startTime: NOON, viewport });
          await ctx.gotoHome(page, { style, quality: "balanced", prefs: { "ha3d.home.pet": null, "ha3d.home.weatherForecastVisible": "true" } });
          styles[style] = await ctx.forecastComputedStyle(page);
          entry[style] = {
            items: Object.keys(styles[style]).filter((key) => /^item\d+$/.test(key)).length,
            screenshot: await shotAround(ctx, page, ".home-weather-forecast", `weather-${style}-${viewport.width}`),
            full: path.basename((await ctx.shot(page, `weather-${style}-${viewport.width}-full`)).path),
            errors: page.ha3dErrors.slice(0, 3),
            style: styles[style],
          };
          check(`${viewport.width}px ${style}：天气预报页面没有 pageerror`, page.ha3dErrors.length === 0, entry[style].errors);
          await page.context().close();
        }
        const diffs = ctx.diffComputedStyle(styles.glass, styles.cream);
        entry.diffCount = diffs.length;
        entry.diffs = diffs;
        check(
          `${viewport.width}px：奶油天气预报条的计算样式（背景、边框、圆角、文字颜色、阴影、模糊、字体）与玻璃一致`,
          entry.glass.items === 4 && entry.cream.items === 4 && diffs.length === 0,
          { items: { glass: entry.glass.items, cream: entry.cream.items }, diffs: diffs.length, first: diffs.slice(0, 20) },
        );
      }
    }

    // ---------- 4. 奶油语音面板黑字 ----------
    if (ONLY.has("voice")) {
      for (const style of ["cream", "glass"]) {
        const context = await ctx.browser.newContext({ baseURL: ctx.stack.appUrl, viewport: WIDE, deviceScaleFactor: 1, hasTouch: true, locale: "zh-CN" });
        ownContexts.push(context);
        await context.addInitScript(fakeRecognition, "ok");
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(String(error)));
        await ctx.gotoHome(page, { style, quality: "eco", prefs: { "ha3d.home.voiceEnabled": "true", "ha3d.home.pet": null }, settleMs: 1500 });
        if (await page.locator(".voice-fab").count()) await page.locator(".voice-fab").tap();
        // 状态行（「正在聆听…」）只在识别过程中出现，回复后消失，所以在聆听时先读一次
        await page.waitForSelector(".voice-status", { timeout: 3000 }).catch(() => undefined);
        const listening = await voiceStyles(page);
        await page.waitForFunction(() => [...document.querySelectorAll(".voice-message:not(.user)")].some((el) => el.textContent.includes("收到：打开客厅灯")), undefined, { timeout: 10_000 }).catch(() => undefined);
        await page.waitForTimeout(600);
        const read = (out.voice[style] = await voiceStyles(page));
        read.status = read.status ?? listening.status;
        read.screenshot = await shotAround(ctx, page, ".voice-assistant-wrap", `voice-${style}`);
        read.full = path.basename((await ctx.shot(page, `voice-${style}-full`)).path);
        read.errors = errors.slice(0, 3);
        if (style === "cream") {
          const texts = [...read.messages, read.status, read.picker, read.input].filter(Boolean);
          check(
            "奶油：语音面板的对话（用户、助手）、状态行、助手选择按钮、输入框文字都是黑色 rgb(0, 0, 0)，没有 text-shadow",
            read.messages.length >= 2 && read.input && texts.every((item) => item.color === BLACK && item.textShadow === "none"),
            { messages: read.messages, status: read.status, picker: read.picker, input: read.input },
          );
          check("奶油：输入框占位符是 50% 黑色 rgba(0, 0, 0, 0.5)，面板里的麦克风图标是黑色", read.placeholder === "rgba(0, 0, 0, 0.5)" && read.mic === BLACK, { placeholder: read.placeholder, mic: read.mic });
        } else {
          // 1.1.0 的值（fixes120-before 基线）：助手消息 rgba(255, 255, 255, 0.9)，用户消息 rgba(221, 235, 255, 0.98)
          const glassColor = { assistant: "rgba(255, 255, 255, 0.9)", user: "rgba(221, 235, 255, 0.98)" };
          check("玻璃：语音面板对话文字颜色不变（助手 rgba(255, 255, 255, 0.9)、用户 rgba(221, 235, 255, 0.98)）", read.messages.length >= 2 && read.messages.every((item) => item.color === glassColor[item.role]), read.messages);
        }
        check(`${style}：语音面板页面没有 pageerror`, errors.length === 0, read.errors);
        await context.close();
      }
    }

    // ---------- 5. 首页没有模式 tab ----------
    if (ONLY.has("tabs")) {
      for (const viewport of [WIDE, PHONE]) {
        for (const style of STYLES) {
          const page = await ctx.newPage({ startTime: NOON, viewport });
          await ctx.gotoHome(page, { style, quality: "smooth", prefs: { "ha3d.home.pet": null }, settleMs: 1500 });
          const ui = await page.evaluate((labels) => {
            const visible = (selector) => {
              const el = document.querySelector(selector);
              if (!el) return false;
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
            };
            return {
              tabs: document.querySelectorAll(".mijia-mode-tabs").length,
              buttons: [...document.querySelectorAll("button")].map((button) => button.textContent.trim()).filter((text) => labels.includes(text)),
              workspace: document.querySelector(".home-workspace")?.className ?? null,
              dock: visible(".corner-dock-toggle"),
              voice: visible(".voice-fab"),
            };
          }, MODE_TABS);
          const key = `${style}-${viewport.width}`;
          const record = (out.tabs[key] = { ...ui, screenshot: path.basename((await ctx.shot(page, `tabs-${key}`)).path) });
          check(`${viewport.width}px ${style}：首页没有底部模式 tab（.mijia-mode-tabs，也没有文字是全屋/照明/遮阳/环境/安防的按钮）`, ui.tabs === 0 && ui.buttons.length === 0, { tabs: ui.tabs, buttons: ui.buttons });
          check(`${viewport.width}px ${style}：首页模式固定为全屋（.home-workspace 有 scene-mode-overview），左下 ☰ 和右下麦克风还在`, String(ui.workspace).includes("scene-mode-overview") && ui.dock && ui.voice, { workspace: ui.workspace, dock: ui.dock, voice: ui.voice });
          if (viewport === WIDE && style === "glass") {
            record.scenePanel = (await page.locator(".home-insight-panel").count()) > 0;
            await clickIf(page.locator(".corner-dock-toggle"));
            await page.waitForTimeout(300);
            await clickIf(page.locator('button[aria-label="打开设备面板"]'));
            await page.waitForTimeout(800);
            record.sidebar = await page.evaluate(() => {
              const sidebar = document.querySelector(".home-sidebar.open");
              return {
                open: Boolean(sidebar),
                search: Boolean(sidebar?.querySelector('input[aria-label="搜索设备"]')),
                area: Boolean(sidebar?.querySelector('[aria-label="按 Home Assistant 区域筛选设备"]')),
                groups: Boolean(sidebar?.querySelector(".entity-groups")),
              };
            });
            record.sidebarScreenshot = path.basename((await ctx.shot(page, "tabs-device-sidebar")).path);
            check("场景面板（.home-insight-panel）还在", record.scenePanel, record.scenePanel);
            check("☰ →「设备」打开的设备面板里有搜索设备、按 HA 区域筛选和设备列表", record.sidebar.open && record.sidebar.search && record.sidebar.area && record.sidebar.groups, record.sidebar);
          }
          record.errors = page.ha3dErrors.slice(0, 3);
          check(`${viewport.width}px ${style}：模式 tab 页面没有 pageerror`, page.ha3dErrors.length === 0, record.errors);
          await page.context().close();
        }
      }
    }
  } finally {
    await Promise.all(ownContexts.map((context) => context.close().catch(() => undefined)));
    await ctx.mock.reset();
  }
  await ctx.writeJson(path.join(ctx.dir, "fixes120.json"), out);
  return out;
}
