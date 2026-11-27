// B5 奶油风格弹窗可读性（plan.md 第 3 节）：逐个打开弹窗，在弹窗容器内跑 axe color-contrast。
// 这些弹窗大多是半透明背景 + backdrop-filter，axe 判定不了（记为 incomplete），所以另外做一次像素对比度检查：
// 取每段文字的计算颜色（乘上祖先 opacity），和截图里文字外圈 2 px 的背景中位色比较，正文 < 4.5、大字 < 3 记为不合格。
// 奶油风格：axe 违规和像素不合格都必须为 0；玻璃风格：两项都不能比基线多。
// 1.2.0 起奶油「天气预报」照搬玻璃样式：断言预报条的计算样式和玻璃一致（ctx.forecastComputedStyle），对比度只记录（米色背景上白字可读性变差）。
// HA3D_CREAM_BASELINE=1 时只采集并写 <证据>/cream/baseline.json（在修改 CSS 之前运行），不做断言。
// 弹窗（尤其玻璃风格）是半透明的，文字背后的颜色取决于下面的 3D 场景：昼夜、天气、太阳的位置、点开的灯是否亮着、
// 设备动画、设备摆在哪里。所以采集基线和断言时都固定：页面时钟 12:00（改造前的前端、以及收到 sun.sun 之前按本机时钟切昼夜），
// sun.sun 高度 45°、天气晴，「设备详情」点的灯为开启、亮度 180，空调关闭，项目临时换回 ctx.project 原文件
// （前面的 editor、interaction 套件会挪动设备、开关灯并保存），结束后换回；每个弹窗等 3D 画面停稳后再截图。
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PNG } from "pngjs";

const STYLES = ["cream", "glass"];
const DAY = "2026-06-01T12:00:00";

/** 「设备详情」点开的设备：第一层第一盏灯。 */
const detailDevice = (project) => project.floors[0].devices.find((item) => item.entityId.startsWith("light.")) ?? project.floors[0].devices[0];

/** 固定场景：太阳、天气、要点开的灯；空调关掉（出风动画一直在重绘，弹窗背后的像素随截图时刻变化）。 */
async function pinScene(ctx) {
  await ctx.mock.set("sun.sun", "above_horizon", { elevation: 45, azimuth: 180, rising: false });
  for (const entityId of ["weather.home", "weather.backup"]) await ctx.mock.set(entityId, "sunny");
  for (const { entity_id: entityId } of await ctx.mock.states()) if (entityId.startsWith("climate.")) await ctx.mock.set(entityId, "off");
  const device = detailDevice(ctx.project);
  if (device.entityId.startsWith("light."))
    await ctx.mock.set(device.entityId, "on", { brightness: 180, rgb_color: [255, 214, 170], color_mode: "color_temp", color_temp_kelvin: 3600 });
}

/**
 * 等 3D 画面停稳：点设备后镜头会飞向设备，这段过渡按帧推进，SwiftShader 下 1440×900 每帧要 0.5–0.7 s，
 * 整段要 10 秒左右，没停稳时弹窗背后的画面还在变。停稳的判据：2.5 s 没有渲染新帧（按需渲染、场景已静止），
 * 或者连续 3 个新帧相机位置和 target 都不变（场景里还有别的动画在重绘）。
 */
async function waitSceneStill(page, timeout = 25_000) {
  const read = () =>
    page.evaluate(() => {
      const s = window.__ha3dDebug?.get();
      if (!s) return null;
      const p = s.camera.position;
      const t = s.controls?.target ?? p;
      return { frame: s.gl.info.render.frame, key: [p.x, p.y, p.z, t.x, t.y, t.z].map((value) => value.toFixed(4)).join(",") };
    });
  const deadline = Date.now() + timeout;
  let last = await read();
  let lastFrameAt = Date.now();
  let stillFrames = 0;
  while (last && Date.now() < deadline) {
    await page.waitForTimeout(200);
    const current = await read();
    if (!current) return;
    if (current.frame !== last.frame) {
      stillFrames = current.key === last.key ? stillFrames + 1 : 0;
      lastFrameAt = Date.now();
      last = current;
    }
    if (stillFrames >= 3 || Date.now() - lastFrameAt >= 2500) return;
  }
}

/** 弹窗列表：[名称, 容器选择器, 打开方式]。 */
function dialogs(ctx, page) {
  const openDock = async () => {
    if (!(await page.locator(".corner-dock-menu button").first().isVisible())) await page.locator(".corner-dock-toggle").click();
    await page.waitForTimeout(300);
  };
  return [
    ["页面工具菜单", ".corner-dock-menu", openDock],
    ["设置面板", ".home-settings-panel", async () => (await openDock(), page.locator('button[aria-label="3D 设置"]').click({ timeout: 3000 }))],
    ["数据设置", ".home-overview-data-manager", async () => (await openDock(), page.locator('button[aria-label="配置顶部概览数据"]').click())],
    [
      "数据卡片管理",
      'aside[aria-label="主屏数据配置"]',
      async () => {
        await openDock();
        await page.locator('button[aria-label="配置顶部概览数据"]').click();
        await page.locator(".home-overview-data-manager button", { hasText: "配置卡片" }).click();
      },
    ],
    ["实体绑定", ".room-binding-panel", async () => (await openDock(), page.locator('button[aria-label="配置 HA 实体绑定"]').click())],
    ["天气预报", ".home-weather-forecast", async () => undefined],
    ["连接与服务", ".connection-panel", async () => (await openDock(), page.locator('button[aria-label="连接"]').click())],
    ["设备面板", ".home-sidebar.open", async () => (await openDock(), page.locator('button[aria-label="打开设备面板"]').click())],
    [
      "设备详情",
      ".home-insight-panel.entity-selected .insight-detail",
      async () => {
        const device = detailDevice(ctx.project);
        const position = await ctx.screenPosOf(page, { entityId: device.entityId });
        if (position) await page.mouse.click(position.x, position.y);
      },
    ],
    [
      "下拉菜单",
      ".app-select-menu",
      async () => {
        await openDock();
        await page.locator('button[aria-label="配置 HA 实体绑定"]').click();
        await page.waitForTimeout(800);
        await page.locator(".room-binding-panel .app-select-trigger").first().click();
      },
    ],
  ];
}

/** 收集容器内可见文字段：紧贴文字的矩形、颜色（含祖先 opacity）、是否大字。 */
async function collectTexts(page, selector) {
  return page.evaluate((selector) => {
    const parse = (value) => {
      const match = /rgba?\(([^)]+)\)/.exec(value);
      if (!match) return null;
      const parts = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      return [parts[0], parts[1], parts[2], parts[3] ?? 1];
    };
    const roots = [...document.querySelectorAll(selector)].filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
    });
    const out = [];
    for (const root of roots) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent.trim();
        const el = node.parentElement;
        if (!text || !el || el.closest('[aria-hidden="true"], :disabled, [aria-disabled="true"], svg, option')) continue;
        const style = getComputedStyle(el);
        if (style.visibility === "hidden" || style.display === "none") continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2 || rect.right <= 0 || rect.bottom <= 0 || rect.left >= innerWidth || rect.top >= innerHeight) continue;
        // 被其他层盖住的文字不算；pointer-events:none 的元素不参与命中测试，改为只检查滚动裁剪
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (style.pointerEvents === "none") {
          let clipped = false;
          for (let parent = el.parentElement; parent && !clipped; parent = parent.parentElement) {
            if (getComputedStyle(parent).overflow === "visible") continue;
            const box = parent.getBoundingClientRect();
            clipped = cx < box.left || cx > box.right || cy < box.top || cy > box.bottom;
          }
          if (clipped) continue;
        } else {
          const hit = document.elementFromPoint(cx, cy);
          if (!hit || !(el.contains(hit) || hit.contains(el))) continue;
        }
        let opacity = 1;
        for (let parent = el; parent; parent = parent.parentElement) opacity *= Number(getComputedStyle(parent).opacity);
        if (opacity < 0.05) continue;
        const color = parse(style.webkitTextFillColor && style.webkitTextFillColor !== style.color ? style.webkitTextFillColor : style.color);
        if (!color) continue;
        // 最近的有背景色的祖先是不透明纯色时直接用它（小圆形徽标这类，外圈采样会混进徽标外的像素）
        let solidBg = null;
        for (let parent = el; parent; parent = parent.parentElement) {
          const parentStyle = getComputedStyle(parent);
          const bg = parse(parentStyle.backgroundColor);
          if (parentStyle.backgroundImage !== "none") break;
          if (!bg || bg[3] === 0) continue;
          if (bg[3] >= 0.98 && opacity >= 0.98) solidBg = bg.slice(0, 3);
          break;
        }
        const size = parseFloat(style.fontSize);
        const weight = Number(style.fontWeight) || 400;
        const className = typeof el.className === "string" ? el.className : "";
        out.push({
          text: text.slice(0, 40),
          element: `${el.tagName.toLowerCase()}${className ? `.${className.trim().split(/\s+/).join(".")}` : ""}`,
          rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
          color: [color[0], color[1], color[2], color[3] * opacity],
          solidBg,
          large: size >= 24 || (size >= 18.66 && weight >= 700),
          fontSize: size,
        });
      }
    }
    return out;
  }, selector);
}

const luminance = ([r, g, b]) => {
  const channel = (value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** 文字外圈（向外 1–3 px）的背景中位色。 */
function ringBackground(png, rect) {
  const samples = [];
  const x0 = Math.floor(rect.x) - 3;
  const y0 = Math.floor(rect.y) - 3;
  const x1 = Math.ceil(rect.x + rect.width) + 3;
  const y1 = Math.ceil(rect.y + rect.height) + 3;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const inner = x > x0 + 1 && x < x1 - 1 && y > y0 + 1 && y < y1 - 1;
      if (inner || x < 0 || y < 0 || x >= png.width || y >= png.height) continue;
      const offset = (png.width * y + x) * 4;
      samples.push([png.data[offset], png.data[offset + 1], png.data[offset + 2]]);
    }
  }
  if (!samples.length) return null;
  const median = (index) => samples.map((item) => item[index]).sort((a, b) => a - b)[Math.floor(samples.length / 2)];
  return [median(0), median(1), median(2)];
}

function pixelContrast(buffer, texts) {
  const png = PNG.sync.read(buffer);
  const failures = [];
  let checked = 0;
  const seen = new Set();
  for (const item of texts) {
    const key = `${item.element}|${item.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const background = item.solidBg ?? ringBackground(png, item.rect);
    if (!background) continue;
    const alpha = item.color[3];
    const fg = [0, 1, 2].map((index) => item.color[index] * alpha + background[index] * (1 - alpha));
    const value = ratio(fg, background);
    const required = item.large ? 3 : 4.5;
    checked += 1;
    if (value < required)
      failures.push({ key, text: item.text, element: item.element, ratio: Number(value.toFixed(2)), required, fg: fg.map(Math.round), bg: background });
  }
  return { checked, failures, keys: [...seen] };
}

export default async function cream(ctx) {
  const { check } = ctx;
  const collectBaseline = process.env.HA3D_CREAM_BASELINE === "1";
  const baselineFile = path.join(ctx.dir, "baseline.json");
  const baseline = collectBaseline ? null : await readFile(baselineFile, "utf8").then(JSON.parse).catch(() => null);
  const results = {};
  const current = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
  const put = (project) => fetch(`${ctx.stack.appUrl}/api/projects/${encodeURIComponent(current.id)}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...project, id: current.id }) });
  if (!(await put(ctx.project)).ok) throw new Error("换回原项目失败");
  await pinScene(ctx);
  const page = await ctx.newPage({ startTime: DAY });
  try {
    for (const style of STYLES) {
      results[style] = {};
      for (const [name, selector, open] of dialogs(ctx, page)) {
        await ctx.gotoHome(page, { style, settleMs: 1200 });
        let entry = { selector };
        try {
          await open();
          await page.waitForTimeout(800);
          // 等弹窗自身和祖先的入场动画/过渡结束（低速渲染下 1.5 s 不一定够），无限循环的动画不算
          await page
            .waitForFunction(
              (selector) => {
                const roots = [...document.querySelectorAll(selector)];
                return document.getAnimations().every((animation) => {
                  const target = animation.effect?.target;
                  if (!target || animation.playState !== "running" || animation.effect.getTiming().iterations === Infinity) return true;
                  return !roots.some((root) => root.contains(target) || target.contains(root));
                });
              },
              selector,
              { timeout: 8000, polling: 200 },
            )
            .catch(() => undefined);
          await waitSceneStill(page);
          await page.waitForTimeout(500);
          const visible = await page.evaluate(
            (selector) =>
              [...document.querySelectorAll(selector)].some((el) => {
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0 && rect.left < window.innerWidth && getComputedStyle(el).visibility !== "hidden";
              }),
            selector,
          );
          const file = await ctx.shot(page, `B5-${style}-${name}`);
          entry.screenshot = path.basename(file.path);
          entry.visible = visible;
          if (visible) {
            const axe = await ctx.axeContrast(page, selector);
            const pixel = pixelContrast(file.buffer, await collectTexts(page, selector));
            entry = { ...entry, axeViolations: axe.violations, axeIncomplete: axe.incomplete, axeNodes: axe.nodes, pixelChecked: pixel.checked, pixelFailures: pixel.failures.length, pixelDetails: pixel.failures, pixelTexts: pixel.keys };
          }
          if (visible && name === "天气预报") entry.forecastStyle = await ctx.forecastComputedStyle(page);
        } catch (error) {
          entry.error = String(error?.message ?? error).split("\n")[0];
        }
        results[style][name] = entry;
        ctx.log(`${style} ${name}: ${entry.visible ? `axe ${entry.axeViolations}（incomplete ${entry.axeIncomplete}），像素 ${entry.pixelFailures}/${entry.pixelChecked}` : entry.error ?? "未打开"}`);
      }
    }
  } finally {
    await put(current);
  }
  await ctx.writeJson(path.join(ctx.dir, collectBaseline ? "baseline.json" : "cream.json"), results);
  if (collectBaseline) {
    check("已采集修改前基线", true, baselineFile);
    return { baseline: true };
  }

  for (const [name, entry] of Object.entries(results.cream)) {
    if (entry.error && name !== "设备面板") {
      check(`奶油 ${name} 能打开`, false, entry.error);
      continue;
    }
    if (!entry.visible) {
      // 设备面板在窄屏/无设备时不存在，其他弹窗必须能打开
      check(`奶油 ${name} 已打开`, name === "设备面板", entry.error ?? "不可见");
      continue;
    }
    if (name === "天气预报") {
      const glass = results.glass["天气预报"]?.forecastStyle;
      const diffs = glass ? ctx.diffComputedStyle(glass, entry.forecastStyle) : null;
      check("奶油 天气预报：计算样式与玻璃风格一致（1.2.0 照搬玻璃样式）", Boolean(glass) && diffs.length === 0, diffs ? { diffs: diffs.length, first: diffs.slice(0, 10) } : "玻璃风格没有采到预报条样式");
      check("奶油 天气预报：对比度只记录（米色背景上白字可读性变差）", true, { axe: entry.axeViolations, pixel: `${entry.pixelFailures}/${entry.pixelChecked}`, details: entry.pixelDetails.slice(0, 6) });
      continue;
    }
    check(`奶油 ${name}：axe color-contrast 0 违规`, entry.axeViolations === 0, entry.axeNodes.slice(0, 5));
    check(`奶油 ${name}：像素对比度 0 不合格`, entry.pixelFailures === 0, entry.pixelDetails.slice(0, 6));
  }
  for (const [name, entry] of Object.entries(results.glass)) {
    if (!entry.visible) continue;
    const before = baseline?.glass?.[name];
    if (!before?.visible) {
      check(`玻璃 ${name}：没有基线，只记录`, true, { axe: entry.axeViolations, pixel: entry.pixelFailures });
      continue;
    }
    check(`玻璃 ${name}：axe 违规不多于基线`, entry.axeViolations <= before.axeViolations, { before: before.axeViolations, after: entry.axeViolations });
    // 只比较基线里已有的文字；本 FEAT 新增的文字（例如菜单里的「设置」）沿用相邻按钮的玻璃样式，单独列出
    const known = new Set(before.pixelTexts ?? []);
    const existing = known.size ? entry.pixelDetails.filter((item) => known.has(item.key)) : entry.pixelDetails;
    const added = known.size ? entry.pixelDetails.filter((item) => !known.has(item.key)) : [];
    check(`玻璃 ${name}：已有文字的像素不合格不多于基线`, existing.length <= before.pixelFailures, {
      before: before.pixelFailures,
      after: existing.length,
      newTextFailures: added.length ? added : undefined,
      details: existing.length > before.pixelFailures ? existing.slice(0, 6) : undefined,
    });
  }
  check("没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
  const summary = (style) => Object.fromEntries(Object.entries(results[style]).map(([name, entry]) => [name, entry.visible ? { axe: entry.axeViolations, pixel: entry.pixelFailures } : "未打开"]));
  const beforeSummary = (style) =>
    baseline ? Object.fromEntries(Object.entries(baseline[style] ?? {}).map(([name, entry]) => [name, entry.visible ? { axe: entry.axeViolations, pixel: entry.pixelFailures } : "未打开"])) : null;
  return { before: { cream: beforeSummary("cream"), glass: beforeSummary("glass") }, after: { cream: summary("cream"), glass: summary("glass") } };
}
