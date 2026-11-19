// 0.2.2：白色小狗和黑眼睛、页面工具菜单展开后拖动模型不变空白、首页设置跨设备同步。
// HA3D_FIXES022_BASELINE=1 时只记录不断言（在修复前的代码上采集对照数据）。
import { readFile } from "node:fs/promises";
import path from "node:path";
const BASELINE = process.env.HA3D_FIXES022_BASELINE === "1";
const NOON = "2026-06-01T12:00:00";
const K = {
  style: "ha3d.home.sceneVisualStyle",
  forecast: "ha3d.home.weatherForecastVisible",
  click: "ha3d.home.deviceClickMode",
  pet: "ha3d.home.pet",
  env: "ha3d.home.environmentSync",
  quality: "ha3d.home.sceneQuality",
};
const round = (value, digits = 3) => Number(Number(value).toFixed(digits));
/** 页面工具菜单：是否展开、各菜单项的计算样式、焦点是否在菜单里。 */
async function dockState(page) {
  return page.evaluate(() => {
    const dock = document.querySelector(".home-corner-dock");
    const menu = dock?.querySelector(".corner-dock-menu");
    const items = [...(menu?.querySelectorAll(".corner-dock-action, .corner-dock-icon") ?? [])].map((item) => {
      const style = getComputedStyle(item);
      const span = item.querySelector("span");
      const rect = item.getBoundingClientRect();
      return { label: item.getAttribute("aria-label"), opacity: Number(style.opacity), width: Math.round(rect.width), pointerEvents: style.pointerEvents, textOpacity: span ? Number(getComputedStyle(span).opacity) : null };
    });
    const menuStyle = menu ? getComputedStyle(menu) : null;
    return {
      open: dock?.classList.contains("tools-open") ?? false,
      focusInDock: Boolean(dock && dock.contains(document.activeElement)),
      hovered: Boolean(dock?.matches(":hover")),
      menu: menuStyle && { opacity: Number(menuStyle.opacity), visibility: menuStyle.visibility },
      items,
      visibleItems: items.filter((item) => item.opacity > 0.9 && item.width > 20 && (item.textOpacity === null || item.textOpacity > 0.9)).length,
    };
  });
}
async function workspaceClass(page) {
  return page.evaluate(() => document.querySelector(".home-workspace")?.className ?? "");
}
const local = (page, key) => page.evaluate((key) => window.localStorage.getItem(key), key);
async function waitFor(page, predicate, arg, timeout = 6000) {
  const started = Date.now();
  try {
    await page.waitForFunction(predicate, arg, { timeout, polling: 100 });
    return Date.now() - started;
  } catch {
    return null;
  }
}
export default async function fixes022(ctx) {
  const { check, log } = ctx;
  const ok = (name, value, detail) => (BASELINE ? (log(`[基线] ${name}：${value ? "是" : "否"} ${JSON.stringify(detail)}`), value) : check(name, value, detail));
  const out = { dog: {}, dock: {}, sync: {} };

  // ---------- 1. 白色小狗、黑眼睛（减少动态效果：原地坐着，方便特写） ----------
  {
    const page = await ctx.newPage({ startTime: NOON, reducedMotion: true });
    await ctx.gotoHome(page, { quality: "high", prefs: { [K.pet]: "dog" }, settleMs: 4000 });
    const pet = await page.evaluate(() => {
      const s = window.__ha3dDebug.get();
      let pet;
      s.scene.traverse((o) => {
        if (o.name === "ha3d-pet") pet = o;
      });
      if (!pet) return null;
      const colors = {};
      pet.traverse((o) => {
        if (!o.isMesh) return;
        const hex = `#${o.material.color.getHexString()}`;
        colors[hex] = (colors[hex] ?? 0) + 1;
      });
      const head = pet.localToWorld(pet.position.clone().set(0, 0.25, 0.3));
      return { colors, heading: pet.rotation.y, head: [head.x, head.y, head.z] };
    });
    out.dog.pet = pet;
    if (pet) {
      // 从小狗正前方偏上看脸
      const direction = [Math.sin(pet.heading), 0.55, Math.cos(pet.heading)];
      await ctx.focusCamera(page, pet.head, 1.1, { direction });
      await page.waitForTimeout(800);
      out.dog.closeup = path.basename((await ctx.shot(page, "dog-closeup")).path);
      await ctx.focusCamera(page, pet.head, 2.4, { direction: [Math.sin(pet.heading + 1.2), 0.9, Math.cos(pet.heading + 1.2)] });
      await page.waitForTimeout(800);
      out.dog.side = path.basename((await ctx.shot(page, "dog-side")).path);
    }
    const colors = pet?.colors ?? {};
    ok("小狗身体是白色（#f7f7f4 / #ffffff），没有原来的棕色 #c9a273", (colors["#f7f7f4"] ?? 0) >= 6 && !colors["#c9a273"], colors);
    ok("小狗有黑色眼睛和鼻头（3 个 #111111 网格）", colors["#111111"] === 3, colors);
    await page.context().close();
  }

  // ---------- 5. 页面工具菜单（右上角）展开后拖动旋转模型，菜单项保持显示 ----------
  for (const [label, viewport] of [
    ["ipad", { width: 1194, height: 834 }],
    ["desktop", { width: 1440, height: 900 }],
  ]) {
    const page = await ctx.newPage({ startTime: NOON, viewport });
    await ctx.gotoHome(page, { quality: "smooth" });
    await page.locator(".corner-dock-toggle").click();
    await page.waitForTimeout(500);
    const opened = await dockState(page);
    await ctx.shot(page, `dock-${label}-opened`);
    const before = await ctx.readCamera(page);
    // 在画布中间偏左下拖动（离开菜单），松手后把指针停在远离菜单的位置
    const start = { x: viewport.width * 0.4, y: viewport.height * 0.6 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    for (let step = 1; step <= 12; step += 1) await page.mouse.move(start.x + step * 20, start.y + step * 3);
    await page.mouse.up();
    await page.mouse.move(viewport.width * 0.3, viewport.height * 0.75);
    await page.waitForTimeout(600);
    const afterDrag = await dockState(page);
    const after = await ctx.readCamera(page);
    await ctx.shot(page, `dock-${label}-after-drag`);
    out.dock[label] = { opened, afterDrag, azimuthChange: round(Math.abs(after.azimuthDeg - before.azimuthDeg), 1) };
    ok(`页面工具[${label}] 拖动模型确实旋转了视角（方位角变化 > 5°）`, out.dock[label].azimuthChange > 5, { azimuthChange: out.dock[label].azimuthChange });
    ok(
      `页面工具[${label}] 展开后拖动模型、指针离开菜单：菜单仍展开，所有菜单项和文字都可见`,
      afterDrag.open && !afterDrag.hovered && !afterDrag.focusInDock && afterDrag.items.length > 0 && afterDrag.visibleItems === afterDrag.items.length,
      { open: afterDrag.open, hovered: afterDrag.hovered, focusInDock: afterDrag.focusInDock, visible: `${afterDrag.visibleItems}/${afterDrag.items.length}`, sample: afterDrag.items.slice(0, 3) },
    );
    await page.context().close();
  }

  // ---------- 6. 首页设置跨设备同步（两个浏览器上下文 = 两台设备） ----------
  if (!BASELINE) {
    await ctx.uiSettings.clear();
    // 设备 A：0.2.1 留下的本机设置（奶油风格、隐藏天气预报、直接开关、省电画质）
    const a = await ctx.newPage({ startTime: NOON });
    await ctx.gotoHome(a, { keepServerSettings: true, prefs: { [K.style]: "cream", [K.forecast]: "false", [K.click]: "toggle", [K.quality]: "eco" } });
    await a.waitForTimeout(800);
    const migrated = await ctx.uiSettings.get();
    out.sync.migrated = migrated;
    check(
      "迁移：设备 A 本机的风格、天气预报、点击设备模式上传到后端，画质不上传",
      migrated[K.style] === "cream" && migrated[K.forecast] === "false" && migrated[K.click] === "toggle" && !(K.quality in migrated),
      migrated,
    );
    // 设备 B：全新浏览器（没有 localStorage），打开后直接是 A 的设置
    const b = await ctx.newPage({ startTime: NOON });
    // 画质不同步：B 用流畅（swiftshader 下两个页面同时渲染，高画质截图会超时）
    await ctx.gotoHome(b, { keepServerSettings: true, prefs: { [K.quality]: "smooth" } });
    out.sync.bInitial = { className: await workspaceClass(b), click: await local(b, K.click), quality: await local(b, K.quality) };
    await ctx.shot(a, "sync-1-A-cream");
    await ctx.shot(b, "sync-1-B-opened-cream");
    check("设备 B 首次打开就用后端的设置：奶油风格、隐藏天气预报、直接开关", /visual-style-cream/.test(out.sync.bInitial.className) && !/weather-forecast-visible/.test(out.sync.bInitial.className) && out.sync.bInitial.click === "toggle", out.sync.bInitial);
    check("画质每台设备单独保存：B 不是 A 的省电画质", !/render-quality-eco/.test(out.sync.bInitial.className), out.sync.bInitial);
    const bQualityBefore = (await workspaceClass(b)).match(/render-quality-\w+/)?.[0];

    // A 在页面工具菜单里切换风格、打开天气预报，B 不刷新自动更新
    const bLoads = [];
    b.on("load", () => bLoads.push(Date.now()));
    await a.locator(".corner-dock-toggle").click();
    await a.locator(".style-dock-action").click();
    const styleMs = await waitFor(b, () => /visual-style-glass/.test(document.querySelector(".home-workspace")?.className ?? ""));
    await a.locator(".weather-forecast-toggle").click();
    const forecastMs = await waitFor(b, () => /weather-forecast-visible/.test(document.querySelector(".home-workspace")?.className ?? ""));
    // A 在 3D 设置里把「点击设备」改回弹出详情、关闭「时间与天气同步」
    await a.locator('button[aria-label="3D 设置"]').click();
    const panel = a.locator('aside[aria-label="3D 设置"]');
    await panel.locator('[aria-label="点击设备"] button', { hasText: "弹出详情" }).click();
    await panel.locator('[aria-label="时间与天气同步"] button', { hasText: "关闭" }).click();
    const clickMs = await waitFor(b, (key) => window.localStorage.getItem(key) === "detail", K.click);
    const envMs = await waitFor(b, () => !/env-sync/.test(document.querySelector(".home-workspace")?.className ?? ""));
    await ctx.shot(a, "sync-2-A-changed", { timeout: 60_000 });
    // A 切换画质：B 不变（A 换画质会重建画布，swiftshader 下要几秒）
    await a.locator('button[aria-label="关闭 3D 设置"]').click();
    await a.locator(".corner-dock-toggle").click();
    await a.locator(".quality-dock-action").click();
    await b.waitForTimeout(6000);
    const bQualityAfter = (await workspaceClass(b)).match(/render-quality-\w+/)?.[0];
    await b.locator(".corner-dock-toggle").click();
    await b.locator('button[aria-label="3D 设置"]').click();
    await b.waitForTimeout(500);
    const bClickPressed = await b.locator('aside[aria-label="3D 设置"] [aria-label="点击设备"] button[aria-pressed="true"]').textContent().catch(() => null);
    await ctx.shot(b, "sync-2-B-auto-updated", { timeout: 60_000 });
    out.sync.live = { styleMs, forecastMs, clickMs, envMs, bReloads: bLoads.length, bQualityBefore, bQualityAfter, bClickPressed, server: await ctx.uiSettings.get() };
    check(
      "A 修改后 B 不刷新自动更新：风格、天气预报、点击设备、时间与天气同步都在 6 秒内变化，期间 B 没有重新加载",
      styleMs !== null && forecastMs !== null && clickMs !== null && envMs !== null && bLoads.length === 0,
      out.sync.live,
    );
    check("B 的 3D 设置面板显示 A 改的「弹出详情」", bClickPressed?.trim() === "弹出详情", { bClickPressed });
    check("A 切换画质后 B 的画质不变", bQualityBefore && bQualityBefore === bQualityAfter, { bQualityBefore, bQualityAfter });

    // 刷新后仍在：B 清空 localStorage 后刷新（模拟换浏览器），A 直接刷新
    await b.evaluate(() => window.localStorage.clear());
    await b.reload();
    await ctx.waitForScene(b);
    await a.reload();
    await ctx.waitForScene(a);
    const file = JSON.parse(await readFile(path.join(ctx.stack.dataDir, "ui-settings.json"), "utf8"));
    out.sync.reloaded = { a: await workspaceClass(a), b: await workspaceClass(b), bClick: await local(b, K.click), bEnv: await local(b, K.env), file };
    await ctx.shot(b, "sync-3-B-reloaded");
    check(
      "刷新后设置仍在（B 清空本机缓存后刷新）：玻璃风格、显示天气预报、弹出详情、关闭时间与天气同步；后端 data/ui-settings.json 里有这些值",
      [out.sync.reloaded.a, out.sync.reloaded.b].every((name) => /visual-style-glass/.test(name) && /weather-forecast-visible/.test(name)) &&
        out.sync.reloaded.bClick === "detail" &&
        out.sync.reloaded.bEnv === "false" &&
        [out.sync.reloaded.a, out.sync.reloaded.b].every((name) => !/env-sync/.test(name)) &&
        file.values[K.style] === "glass" &&
        file.values[K.env] === "false",
      { a: out.sync.reloaded.a, b: out.sync.reloaded.b, bClick: out.sync.reloaded.bClick, bEnv: out.sync.reloaded.bEnv, file: file.values },
    );
    check("同步过程中没有 pageerror", a.ha3dErrors.length === 0 && b.ha3dErrors.length === 0, [...a.ha3dErrors, ...b.ha3dErrors].slice(0, 3));
    await ctx.closeContexts();
    await ctx.uiSettings.clear();
  }
  await ctx.writeJson(path.join(ctx.dir, "fixes022.json"), out);
  return { dog: out.dog.pet?.colors, dock: Object.fromEntries(Object.entries(out.dock).map(([key, value]) => [key, { opened: value.opened.visibleItems, afterDrag: `${value.afterDrag.visibleItems}/${value.afterDrag.items.length}`, azimuthChange: value.azimuthChange }])), sync: out.sync.live };
}
