// 交互套件（plan.md 第 3 节）：3D 设置面板、F4 点击直接开关、B2 双击后拖动平移（首页 + 编辑器 3D）与 2D 编辑器拖动检查、B3 禁止文本选择。
import path from "node:path";

const CLICK_MODE_KEY = "ha3d.home.deviceClickMode";
const TOGGLE_DOMAINS = new Set(["light", "switch", "fan", "cover"]);
const UNAVAILABLE = new Set(["unavailable", "unknown", "offline"]);
const round = (value, digits = 3) => Number(Number(value).toFixed(digits));
const angleDelta = (a, b) => Math.abs(((((b - a) % 360) + 540) % 360) - 180);
const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]));

async function fetchProject(ctx) {
  return (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
}

/** 点「保存」（自动保存也会在 0.9 秒后触发），轮询 /api/projects/current 直到满足条件。 */
async function saveAndWait(ctx, page, predicate, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  let clicked = false;
  let project;
  while (Date.now() < deadline) {
    const button = page.locator(".save-status-button");
    if (!clicked && (await button.isEnabled().catch(() => false))) {
      await button.click().catch(() => undefined);
      clicked = true;
    }
    project = await fetchProject(ctx);
    if (predicate(project)) return { ok: true, project };
    await ctx.sleep(500);
  }
  return { ok: false, project };
}

/** 平面坐标（米）→ 页面坐标；onCanvas 表示该点最上层元素在平面图 svg 里。 */
async function planToScreen(page, [x, y]) {
  return page.evaluate(
    ([x, y]) => {
      const svg = document.querySelector("svg.floorplan-canvas");
      if (!svg) return null;
      const point = svg.createSVGPoint();
      point.x = x;
      point.y = y;
      const screen = point.matrixTransform(svg.getScreenCTM());
      const top = document.elementFromPoint(screen.x, screen.y);
      return { x: screen.x, y: screen.y, onCanvas: Boolean(top && top.closest("svg.floorplan-canvas") === svg) };
    },
    [x, y],
  );
}

const openDock = async (page) => {
  if (!(await page.locator(".corner-dock-menu button").first().isVisible())) await page.locator(".corner-dock-toggle").click();
  await page.waitForTimeout(300);
};

const detailState = (page) =>
  page.evaluate(() => ({
    sidebarSelected: Boolean(document.querySelector(".home-sidebar.entity-selected")),
    insightSelected: Boolean(document.querySelector(".home-insight-panel.entity-selected")),
    insightDetailShown: Boolean(document.querySelector('.insight-detail[aria-hidden="false"]')),
  }));
const detailOpen = (state) => state.sidebarSelected || state.insightSelected || state.insightDetailShown;

/** 让设备出现在画面里并且没被 HUD 挡住：先试当前机位，不行就俯视对准它。返回可点击的页面坐标。 */
async function clickablePoint(ctx, page, entityId) {
  let position = await ctx.screenPosOf(page, { entityId });
  if (!position) return null;
  let point = await ctx.projectToScreen(page, position.world);
  if (point?.onCanvas) return point;
  await ctx.focusOn(page, position.world, 4.5, [0.2, 1, 0.45]);
  position = await ctx.screenPosOf(page, { entityId });
  point = position && (await ctx.projectToScreen(page, position.world));
  return point?.onCanvas ? point : null;
}

/**
 * 在画布上按下、拖动、松开；doubleFirst 时先单击一次，第二次按下即双击。
 * 用 CDP 直接发鼠标事件并带上时间戳（单击 60 ms、两次按下间隔 180 ms、每步 16 ms），
 * 这样事件的 timeStamp 是用户真实操作的节奏；用 page.mouse 时每个事件都要等渲染进程确认，
 * swiftshader 渲染大户型时两次按下之间会被拉长到 350 ms 以上，测出来的不是双击。
 */
async function canvasDrag(page, start, { doubleFirst = false, dx = -216, dy = -48, steps = 12 } = {}) {
  const cdp = await page.context().newCDPSession(page);
  let time = Date.now() / 1000;
  const send = (type, x, y, extra) => cdp.send("Input.dispatchMouseEvent", { type, x, y, button: "left", timestamp: time, ...extra });
  await send("mouseMoved", start.x, start.y, { buttons: 0, button: "none" });
  time += 0.05;
  if (doubleFirst) {
    await send("mousePressed", start.x, start.y, { clickCount: 1, buttons: 1 });
    time += 0.06;
    await send("mouseReleased", start.x, start.y, { clickCount: 1, buttons: 0 });
    time += 0.12;
  }
  const clickCount = doubleFirst ? 2 : 1;
  await send("mousePressed", start.x, start.y, { clickCount, buttons: 1 });
  let x = start.x;
  let y = start.y;
  for (let step = 1; step <= steps; step += 1) {
    time += 0.016;
    x = start.x + (dx * step) / steps;
    y = start.y + (dy * step) / steps;
    await send("mouseMoved", x, y, { buttons: 1 });
  }
  time += 0.016;
  await send("mouseReleased", x, y, { clickCount, buttons: 0 });
  await cdp.detach();
}

/** 等相机停稳（OrbitControls 阻尼按帧衰减，swiftshader 帧率低时要好几秒）。 */
async function waitCameraStill(ctx, page, timeout = 8000) {
  const deadline = Date.now() + timeout;
  let previous = await ctx.readCamera(page);
  let still = 0;
  // 连续 3 次（共 1.2 s）没变化才算停稳：大户型在 swiftshader 下一帧可能要几百毫秒
  while (Date.now() < deadline && still < 3) {
    await ctx.sleep(400);
    const current = await ctx.readCamera(page);
    still = distance(current.position, previous.position) < 0.002 ? still + 1 : 0;
    previous = current;
  }
}

async function measureDrag(ctx, page, start, options, settleMs = 400) {
  await waitCameraStill(ctx, page);
  const before = await ctx.readCamera(page);
  await page.evaluate(() => {
    window.__ha3dDowns = [];
    if (!window.__ha3dDownsHooked) window.addEventListener("pointerdown", (event) => window.__ha3dDowns.push(event.timeStamp), true);
    window.__ha3dDownsHooked = true;
  });
  await canvasDrag(page, start, options);
  const downs = await page.evaluate(() => window.__ha3dDowns);
  await page.waitForTimeout(settleMs);
  await waitCameraStill(ctx, page);
  const after = await ctx.readCamera(page);
  return {
    pointerdownIntervalMs: downs.length > 1 ? round(downs[1] - downs[0], 1) : null,
    azimuthDeltaDeg: round(angleDelta(before.azimuthDeg, after.azimuthDeg), 2),
    polarDeltaDeg: round(Math.abs(after.polarDeg - before.polarDeg), 2),
    targetMoveM: round(distance(after.target, before.target)),
    before: { target: before.target.map((v) => round(v)), azimuthDeg: round(before.azimuthDeg, 2) },
    after: { target: after.target.map((v) => round(v)), azimuthDeg: round(after.azimuthDeg, 2) },
  };
}

/**
 * 找一个双击会落到「退出房间聚焦」的点：射线命中的物体链上，带 onDoubleClick 的只有楼层根 group
 * （房间地面自己有 onDoubleClick 会重新聚焦，所以要避开射线穿过地面的点）。
 */
async function findExitFocusPoint(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    if (!s) return null;
    const rect = s.gl.domElement.getBoundingClientRect();
    const raycaster = s.raycaster;
    const pointer = s.pointer.clone();
    for (let y = rect.top + 60; y < rect.bottom - 60; y += 24) {
      for (let x = rect.left + 60; x < rect.right - 60; x += 24) {
        if (document.elementFromPoint(x, y) !== s.gl.domElement) continue;
        pointer.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(pointer, s.camera);
        const hits = raycaster.intersectObjects(s.scene.children, true).filter((hit) => hit.object.visible && hit.object.isMesh);
        if (!hits.length) continue;
        const handlers = [];
        for (const hit of hits) {
          for (let object = hit.object; object; object = object.parent) {
            if (object.__r3f?.handlers?.onDoubleClick && !handlers.includes(object)) handlers.push(object);
          }
        }
        if (handlers.length === 1 && !handlers[0].isMesh) return { x, y };
      }
    }
    return null;
  });
}

export default async function interaction(ctx) {
  const { check, log } = ctx;
  const project = await fetchProject(ctx);
  const floor = project.floors[0];
  const entities = await (await fetch(`${ctx.stack.appUrl}/api/ha/entities`)).json().then((body) => body.entities);
  const entityById = new Map(entities.map((entity) => [entity.entityId, entity]));
  const out = { settings: {}, F4: {}, B2: {}, B3: [] };

  // ---------- 设置面板：打开、切换、刷新后保持 ----------
  {
    const page = await ctx.newPage();
    await ctx.gotoHome(page, { prefs: { [CLICK_MODE_KEY]: null } });
    await openDock(page);
    await page.locator('button[aria-label="3D 设置"]').click();
    const panel = page.locator('.home-settings-panel[role="dialog"][aria-label="3D 设置"]');
    await panel.waitFor({ state: "visible", timeout: 5000 }).catch(() => undefined);
    out.settings.opened = await panel.isVisible();
    out.settings.dockCollapsed = !(await page.locator(".home-corner-dock.tools-open").count());
    const detailButton = panel.getByRole("button", { name: "弹出详情" });
    const toggleButton = panel.getByRole("button", { name: "直接开关" });
    out.settings.initial = { detail: await detailButton.getAttribute("aria-pressed"), toggle: await toggleButton.getAttribute("aria-pressed") };
    await ctx.shot(page, "settings-panel-detail");
    check("设置面板能从页面工具菜单打开（role=dialog、aria-label=3D 设置），菜单随之收起", out.settings.opened && out.settings.dockCollapsed, out.settings);
    check("点击设备模式默认是「弹出详情」", out.settings.initial.detail === "true" && out.settings.initial.toggle === "false", out.settings.initial);
    await toggleButton.click();
    await page.waitForTimeout(300);
    out.settings.afterToggle = {
      toggle: await toggleButton.getAttribute("aria-pressed"),
      stored: await page.evaluate((key) => window.localStorage.getItem(key), CLICK_MODE_KEY),
    };
    await ctx.shot(page, "settings-panel-toggle");
    check("切换到「直接开关」后按钮状态和 localStorage 都更新", out.settings.afterToggle.toggle === "true" && out.settings.afterToggle.stored === "toggle", out.settings.afterToggle);
    await page.reload();
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await ctx.waitForScene(page, { settleMs: 800 });
    await openDock(page);
    await page.locator('button[aria-label="3D 设置"]').click();
    await panel.waitFor({ state: "visible", timeout: 5000 }).catch(() => undefined);
    out.settings.afterReload = await toggleButton.getAttribute("aria-pressed");
    check("刷新后仍然是「直接开关」", out.settings.afterReload === "true", out.settings.afterReload);
    await panel.getByRole("button", { name: "关闭 3D 设置" }).click();
    await page.waitForTimeout(400);
    out.settings.closed = !(await panel.isVisible());
    check("设置面板可以关闭", out.settings.closed);
    for (const style of ["glass", "cream"]) {
      await ctx.gotoHome(page, { style, settleMs: 800 });
      await openDock(page);
      await page.locator('button[aria-label="3D 设置"]').click();
      await page.waitForTimeout(600);
      await ctx.shot(page, `settings-panel-${style}`);
    }
    check("设置面板没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
  }
  await ctx.closeContexts();

  // ---------- F4：直接开关 ----------
  {
    const placed = floor.devices.map((device) => ({ device, entity: entityById.get(device.entityId) })).filter(({ entity }) => entity);
    const toggles = placed.filter(({ entity }) => entity.domain === "light" && !UNAVAILABLE.has(entity.state));
    const others = placed.filter(({ entity }) => !TOGGLE_DOMAINS.has(entity.domain) && ["lock", "climate", "sensor", "binary_sensor", "camera"].includes(entity.domain));
    others.sort((a, b) => (a.entity.domain === "lock" ? -1 : 0) - (b.entity.domain === "lock" ? -1 : 0));
    const page = await ctx.newPage();
    await ctx.gotoHome(page, { prefs: { [CLICK_MODE_KEY]: "toggle" } });
    let tested;
    for (const { device, entity } of toggles) {
      const point = await clickablePoint(ctx, page, device.entityId);
      if (!point) continue;
      const before = (await ctx.mock.states()).find((item) => item.entity_id === device.entityId)?.state;
      const callsBefore = (await ctx.mock.calls()).length;
      const beforeShot = await ctx.shot(page, "F4-toggle-before");
      await page.mouse.click(point.x, point.y);
      await page.waitForTimeout(1500);
      const calls = (await ctx.mock.calls()).slice(callsBefore);
      const toggleCall = calls.find((call) => call.domain === "light" && call.service === "toggle" && [].concat(call.data?.entity_id ?? []).includes(device.entityId));
      if (!toggleCall && !calls.length) continue; // 没点中，换一盏灯
      const after = (await ctx.mock.states()).find((item) => item.entity_id === device.entityId)?.state;
      const detail = await detailState(page);
      const afterShot = await ctx.shot(page, "F4-toggle-after");
      tested = { entityId: device.entityId, name: entity.name, point: { x: round(point.x, 1), y: round(point.y, 1) }, before, after, calls, detail, screenshots: [path.basename(beforeShot.path), path.basename(afterShot.path)] };
      break;
    }
    out.F4.toggle = tested ?? null;
    check("F4 直接开关模式下点击灯：mock 日志出现 light/toggle", tested?.calls.some((call) => call.domain === "light" && call.service === "toggle"), tested && { entityId: tested.entityId, calls: tested.calls });
    check("F4 详情面板没有打开（.home-sidebar.entity-selected、.home-insight-panel.entity-selected、显示中的 .insight-detail 都不存在）", tested && !detailOpen(tested.detail), tested?.detail);
    check("F4 灯的状态翻转", tested && tested.before && tested.after && tested.before !== tested.after, tested && { before: tested.before, after: tested.after });

    // 非开关类设备（门锁优先）仍然弹出详情
    let other;
    for (const { device, entity } of others) {
      await ctx.gotoHome(page, { prefs: { [CLICK_MODE_KEY]: "toggle" }, settleMs: 1500 });
      const point = await clickablePoint(ctx, page, device.entityId);
      if (!point) continue;
      const callsBefore = (await ctx.mock.calls()).length;
      await page.mouse.click(point.x, point.y);
      await page.waitForTimeout(1500);
      const detail = await detailState(page);
      const calls = (await ctx.mock.calls()).slice(callsBefore);
      other = { entityId: device.entityId, domain: entity.domain, detail, calls };
      if (detailOpen(detail)) {
        other.screenshot = path.basename((await ctx.shot(page, `F4-toggle-mode-${entity.domain}-detail`)).path);
        break;
      }
    }
    out.F4.nonToggle = other ?? null;
    check(`F4 直接开关模式下点击${other?.domain ?? "门锁"}仍然弹出详情、不发服务调用`, other && detailOpen(other.detail) && other.calls.length === 0, other);

    // detail 模式回归
    let regression;
    await ctx.gotoHome(page, { prefs: { [CLICK_MODE_KEY]: "detail" } });
    for (const { device } of toggles) {
      const point = await clickablePoint(ctx, page, device.entityId);
      if (!point) continue;
      const callsBefore = (await ctx.mock.calls()).length;
      await page.mouse.click(point.x, point.y);
      await page.waitForTimeout(1500);
      const detail = await detailState(page);
      regression = { entityId: device.entityId, detail, calls: (await ctx.mock.calls()).slice(callsBefore) };
      if (detailOpen(detail)) {
        regression.screenshot = path.basename((await ctx.shot(page, "F4-detail-mode")).path);
        break;
      }
    }
    out.F4.detailMode = regression ?? null;
    check("F4 弹出详情模式下点击灯会打开详情、不发 toggle", regression && detailOpen(regression.detail) && !regression.calls.some((call) => call.service === "toggle"), regression);
    check("F4 没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
  }
  await ctx.closeContexts();

  // ---------- B2：首页 ----------
  {
    const page = await ctx.newPage();
    // 起点放在某个房间地面上：双击拖动结束时浏览器会补发 dblclick，不能因此误触发房间聚焦
    const room = floor.rooms[0];
    const centroid = room.polygon.reduce((sum, [x, y]) => [sum[0] + x / room.polygon.length, sum[1] + y / room.polygon.length], [0, 0]);
    const startOf = async () => {
      const world = await ctx.planToWorld(page, [centroid[0], 0.03, centroid[1]]);
      const point = await ctx.projectToScreen(page, world);
      return point?.onCanvas ? { x: point.x, y: point.y } : { x: 1290, y: 740 };
    };
    await ctx.gotoHome(page);
    const start = await startOf();
    out.B2.home = { start, singleDrag: await measureDrag(ctx, page, start) };
    await ctx.gotoHome(page);
    out.B2.home.doubleClickDrag = await measureDrag(ctx, page, start, { doubleFirst: true });
    out.B2.home.focusAfterDoubleDrag = await page.locator(".room-focus-card").isVisible();
    await ctx.shot(page, "B2-home-after-double-drag");
    const { singleDrag, doubleClickDrag } = out.B2.home;
    check("B2 首页单次拖动仍然旋转（方位角变化 > 10°）", singleDrag.azimuthDeltaDeg > 10, singleDrag);
    check("B2 首页双击后拖动是平移：target 移动 ≥ 0.3 m、方位角变化 < 2°", doubleClickDrag.targetMoveM >= 0.3 && doubleClickDrag.azimuthDeltaDeg < 2, doubleClickDrag);
    check("B2 双击拖动结束后没有误触发房间聚焦", !out.B2.home.focusAfterDoubleDrag);

    // 双击但不拖动：地面上双击进入房间聚焦，在非地面物体上双击退出
    await ctx.gotoHome(page);
    const floorPoint = await startOf();
    await page.mouse.dblclick(floorPoint.x, floorPoint.y);
    await page.waitForTimeout(1800);
    const focused = await page.locator(".room-focus-card").isVisible();
    const exitPoint = focused ? await findExitFocusPoint(page) : null;
    if (exitPoint) {
      await page.mouse.dblclick(exitPoint.x, exitPoint.y);
      await page.waitForTimeout(1800);
    }
    const exited = focused && exitPoint ? !(await page.locator(".room-focus-card").isVisible()) : false;
    out.B2.home.focus = { floorPoint, focused, exitPoint, exited };
    await ctx.shot(page, "B2-home-after-dblclick-exit");
    check("B2 双击地面仍然进入房间聚焦", focused, out.B2.home.focus);
    check("B2 双击（不拖动）仍然退出房间聚焦", exited, out.B2.home.focus);
    check("B2 首页没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
  }
  await ctx.closeContexts();

  // ---------- B2：编辑器 3D ----------
  {
    const page = await ctx.newPage();
    await ctx.gotoEditor(page, { view: "3d" });
    const box = await page.locator(".editor-3d canvas").boundingBox();
    const start = { x: box.x + box.width * 0.55, y: box.y + box.height * 0.6 };
    out.B2.editor = { start, toolbarTitle: await page.locator(".three-view-toolbar").getAttribute("title") };
    out.B2.editor.singleDrag = await measureDrag(ctx, page, start, {}, 500);
    // 重新进入编辑器 3D，避免上一次旋转的阻尼余量算进双击拖动
    await ctx.gotoEditor(page, { view: "3d" });
    out.B2.editor.doubleClickDrag = await measureDrag(ctx, page, start, { doubleFirst: true }, 500);
    await ctx.shot(page, "B2-editor-3d-after-double-drag");
    const { singleDrag, doubleClickDrag } = out.B2.editor;
    check("B2 编辑器 3D 工具栏有操作提示 title", out.B2.editor.toolbarTitle === "双击后拖动可平移，拖动旋转，滚轮缩放", out.B2.editor.toolbarTitle);
    check("B2 编辑器 3D 单次拖动仍然旋转（方位角变化 > 10°）", singleDrag.azimuthDeltaDeg > 10, singleDrag);
    check("B2 编辑器 3D 双击后拖动是平移：target 移动 ≥ 0.3 m、方位角变化 < 2°", doubleClickDrag.targetMoveM >= 0.3 && doubleClickDrag.azimuthDeltaDeg < 2, doubleClickDrag);

    // ---------- B2：2D 编辑器拖动家具、设备 ----------
    await page.locator(".view-switch button", { hasText: "2D" }).click();
    await page.waitForSelector("svg.floorplan-canvas", { timeout: 30_000 });
    await page.locator('button[aria-label="导航：选择"]').click().catch(() => undefined);
    await ctx.sleep(800);
    const bed = floor.furniture.find((item) => item.kind === "bed") ?? floor.furniture[0];
    const nightstand = floor.furniture.find((item) => item.kind === "nightstand") ?? floor.furniture.find((item) => item !== bed);
    const device = floor.devices.find((item) => item.entityId.startsWith("light.")) ?? floor.devices[0];
    const targets = [
      bed && { label: `家具 ${bed.kind}`, type: "furniture", id: bed.id, plan: bed.position },
      nightstand && { label: `家具 ${nightstand.kind}`, type: "furniture", id: nightstand.id, plan: nightstand.position },
      device && { label: `设备 ${device.entityId}`, type: "device", id: device.id, plan: [device.position[0], device.position[2]] },
    ].filter(Boolean);
    out.B2.plan2d = [];
    for (const target of targets) {
      const current = await fetchProject(ctx);
      const read = (proj) => {
        const list = target.type === "furniture" ? proj.floors[0].furniture : proj.floors[0].devices;
        const item = list.find((entry) => entry.id === target.id);
        return item && { position: target.type === "furniture" ? item.position : [item.position[0], item.position[2]], rotation: item.rotation };
      };
      const before = read(current);
      const from = await planToScreen(page, before.position);
      const to = await planToScreen(page, [before.position[0] + 1, before.position[1]]);
      const record = { ...target, before, from, to };
      if (!from?.onCanvas) {
        record.skipped = "中心点被遮挡";
        out.B2.plan2d.push(record);
        check(`B2 2D ${target.label} 中心可点击`, false, record);
        continue;
      }
      // 先单击选中，再从中心拖动 1 m
      await page.mouse.click(from.x, from.y);
      await page.waitForTimeout(500);
      // 选中后中心点最上层的元素（修复前是旋转/缩放手柄的命中区）
      record.topAfterSelect = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.getAttribute("class") ?? null, from);
      if (target.type === "furniture")
        check(`B2 2D 选中${target.label}后中心点不被旋转/缩放手柄覆盖`, !/furniture-handle|furniture-rotate|furniture-resize/.test(record.topAfterSelect ?? ""), record.topAfterSelect);
      await page.mouse.move(from.x, from.y);
      await page.mouse.down();
      for (let step = 1; step <= 10; step += 1) await page.mouse.move(from.x + ((to.x - from.x) * step) / 10, from.y + ((to.y - from.y) * step) / 10);
      await page.mouse.up();
      await page.waitForTimeout(500);
      const saved = await saveAndWait(ctx, page, (proj) => {
        const after = read(proj);
        return after && distance(after.position, before.position) > 0.3;
      }, 6000);
      const after = read(saved.project);
      record.after = after;
      record.moveM = round(distance(after.position, before.position));
      record.rotationUnchanged = JSON.stringify(after.rotation) === JSON.stringify(before.rotation);
      out.B2.plan2d.push(record);
      check(`B2 2D 拖动${target.label}：位置改变（≈1 m）且 rotation 不变`, record.moveM > 0.5 && record.rotationUnchanged, { moveM: record.moveM, before: before.rotation, after: after.rotation });
    }
    await ctx.shot(page, "B2-editor-2d-after-drag");
    check("B2 编辑器没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
  }
  await ctx.closeContexts();

  // ---------- B3：双击、三击后没有选中文字 ----------
  {
    const page = await ctx.newPage();
    await ctx.gotoHome(page);
    const read = () => page.evaluate(() => window.getSelection()?.toString() ?? "");
    const clear = () => page.evaluate(() => window.getSelection()?.removeAllRanges());
    const probe = async (label, point) => {
      if (!point) {
        out.B3.push({ label, present: false });
        return;
      }
      await clear();
      await page.mouse.dblclick(point.x, point.y);
      await page.waitForTimeout(150);
      const dbl = await read();
      await clear();
      await page.mouse.click(point.x, point.y, { clickCount: 3 });
      await page.waitForTimeout(150);
      const triple = await read();
      await clear();
      const record = { label, present: true, point: { x: round(point.x, 1), y: round(point.y, 1) }, doubleClick: dbl, tripleClick: triple };
      out.B3.push(record);
      check(`B3 ${label}：双击、三击后 getSelection() 为空`, dbl === "" && triple === "", record);
    };
    const centerOf = async (selector) => {
      const locator = page.locator(selector).first();
      if (!(await locator.count()) || !(await locator.isVisible())) return null;
      const box = await locator.boundingBox();
      return box && { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    };
    await probe("3D 区域空白处", { x: 1290, y: 740 });
    await probe("标题", await centerOf(".scene-title h1"));
    for (const [tab, selector, label] of [
      ["照明", ".mijia-room-badge", "房间标签（照明）"],
      ["环境", ".mijia-room-badge", "房间标签（环境）"],
      ["安防", ".scene-device-status-chip", "设备状态标签（安防）"],
    ]) {
      await page.locator(".mijia-mode-tabs button", { hasText: tab }).first().click({ force: true, timeout: 5000 });
      await page.waitForTimeout(1500);
      await probe(label, await centerOf(selector));
    }
    await page.locator(".mijia-mode-tabs button", { hasText: "全屋" }).first().click({ force: true, timeout: 5000 });
    const userSelect = await page.evaluate(() => {
      const of = (selector) => {
        const el = document.querySelector(selector);
        return el ? getComputedStyle(el).userSelect || getComputedStyle(el).webkitUserSelect : null;
      };
      return { scene: of(".home-scene"), canvas: of(".home-scene canvas"), touchAction: getComputedStyle(document.querySelector(".home-scene canvas")).touchAction, title: of(".scene-title h1") };
    });
    out.B3userSelect = userSelect;
    check("B3 .home-scene 及其中元素 user-select: none，画布 touch-action: none", userSelect.scene === "none" && userSelect.canvas === "none" && userSelect.title === "none" && userSelect.touchAction === "none", userSelect);
    await ctx.shot(page, "B3-after-clicks");

    // 3D 区域里的输入框仍然可以选中文字（数据卡片管理的「卡片标题」）
    await openDock(page);
    await page.locator('button[aria-label="配置顶部概览数据"]').click();
    await page.locator(".home-overview-data-manager button", { hasText: "配置卡片" }).click();
    const input = page.locator('aside[aria-label="主屏数据配置"] input[type="text"], aside[aria-label="主屏数据配置"] input:not([type])').first();
    let inputResult = { present: false };
    if (await input.count()) {
      await input.fill("ha3d selectable text");
      await input.dblclick();
      await page.waitForTimeout(150);
      inputResult = await input.evaluate((el) => ({
        present: true,
        insideScene: Boolean(el.closest(".home-scene")),
        userSelect: getComputedStyle(el).userSelect,
        selected: el.value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0),
      }));
    }
    out.B3input = inputResult;
    await ctx.shot(page, "B3-input-selectable");
    check("B3 .home-scene 里的输入框仍然可以选中文字", inputResult.present && inputResult.insideScene && inputResult.userSelect !== "none" && inputResult.selected.length > 0, inputResult);

    // 编辑器 3D 视图里的房间标签
    await ctx.gotoEditor(page, { view: "3d" });
    await probe("编辑器 3D 房间标签", await centerOf(".room-label-3d"));
    const editorBox = await page.locator(".editor-3d canvas").boundingBox();
    await probe("编辑器 3D 画布", { x: editorBox.x + editorBox.width / 2, y: editorBox.y + editorBox.height * 0.8 });
    await ctx.shot(page, "B3-editor-3d");
    check("B3 没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
  }

  log(`B2 首页：${JSON.stringify({ single: out.B2.home?.singleDrag?.azimuthDeltaDeg, double: out.B2.home?.doubleClickDrag })}`);
  await ctx.writeJson(path.join(ctx.dir, "interaction.json"), out);
  return out;
}
