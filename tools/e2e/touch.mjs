// 触屏手势套件（0.2.1）：iPad Pro 11 横屏视口（1194×834，DPR 2，isMobile、hasTouch）+ 触屏模拟。
// Chromium 用 CDP Input.dispatchTouchEvent 发可信触摸（带时间戳，浏览器自己生成 pointer 事件和兼容 click/dblclick）。
// 在 window 冒泡阶段记录 touchstart/touchmove 是否被 preventDefault：iOS/iPadOS 上，页面没有 preventDefault 的触摸
// 会同时交给原生手势（HA App 的「双指右滑 = 返回上一页」、双击按住的文本放大镜等），这一项是它们能否被拦下的前提。
// 另外记录每种手势期间的帧数和 gl.render 耗时（渲染开销）。
// HA3D_TOUCH_BASELINE=1：只采集、不断言（在修复前的代码上运行，作为对照）。
import path from "node:path";
import { devices } from "playwright";
import { clickablePoint, findExitFocusPoint } from "./interaction.mjs";

const CLICK_MODE_KEY = "ha3d.home.deviceClickMode";
const DEVICE = devices["iPad Pro 11 landscape"];
const round = (value, digits = 3) => Number(Number(value).toFixed(digits));
const angleDelta = (a, b) => Math.abs(((((b - a) % 360) + 540) % 360) - 180);
const distance = (a, b) => Math.hypot(...a.map((value, index) => value - b[index]));

async function newIpadPage(ctx) {
  const context = await ctx.browser.newContext({
    ...DEVICE,
    baseURL: ctx.stack.appUrl,
    locale: "zh-CN",
    reducedMotion: "no-preference",
  });
  ctx.runtime().contexts.add(context);
  await context.addInitScript(() => {
    const log = { touchstart: 0, touchstartPrevented: 0, multiStart: 0, multiStartPrevented: 0, touchmove: 0, touchmovePrevented: 0, multiMove: 0, multiMovePrevented: 0, click: 0, dblclick: 0 };
    window.__ha3dTouchLog = log;
    window.__ha3dTouchReset = () => {
      for (const key of Object.keys(log)) log[key] = 0;
    };
    // 冒泡到 window 时页面自己的监听都已执行，defaultPrevented 就是最终结果
    window.addEventListener(
      "touchstart",
      (event) => {
        log.touchstart += 1;
        if (event.defaultPrevented) log.touchstartPrevented += 1;
        if (event.touches.length >= 2) {
          log.multiStart += 1;
          if (event.defaultPrevented) log.multiStartPrevented += 1;
        }
      },
      { passive: true },
    );
    window.addEventListener(
      "touchmove",
      (event) => {
        log.touchmove += 1;
        if (event.defaultPrevented) log.touchmovePrevented += 1;
        if (event.touches.length >= 2) {
          log.multiMove += 1;
          if (event.defaultPrevented) log.multiMovePrevented += 1;
        }
      },
      { passive: true },
    );
    window.addEventListener("click", () => (log.click += 1));
    window.addEventListener("dblclick", () => (log.dblclick += 1));
  });
  const page = await context.newPage();
  page.ha3dErrors = [];
  page.on("pageerror", (error) => page.ha3dErrors.push(String(error?.stack ?? error)));
  return page;
}

/** 给 gl.render 计时（毫秒），并开始记录帧数。 */
async function startRenderProbe(page) {
  await page.evaluate(() => {
    const s = window.__ha3dDebug.get();
    if (!s.gl.__ha3dTimed) {
      const render = s.gl.render.bind(s.gl);
      s.gl.render = (scene, camera) => {
        const t = performance.now();
        render(scene, camera);
        window.__ha3dRenderMs.push(performance.now() - t);
      };
      s.gl.__ha3dTimed = true;
    }
    window.__ha3dRenderMs = [];
    window.__ha3dProbeStart = { frame: s.gl.info.render.frame, time: performance.now() };
  });
}
async function stopRenderProbe(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug.get();
    const ms = window.__ha3dRenderMs.slice().sort((a, b) => a - b);
    const frames = s.gl.info.render.frame - window.__ha3dProbeStart.frame;
    const elapsed = performance.now() - window.__ha3dProbeStart.time;
    const pick = (q) => (ms.length ? ms[Math.min(ms.length - 1, Math.floor(ms.length * q))] : null);
    return {
      frames,
      elapsedMs: Math.round(elapsed),
      fps: Number(((frames * 1000) / elapsed).toFixed(2)),
      renderMsMean: ms.length ? Number((ms.reduce((a, b) => a + b, 0) / ms.length).toFixed(2)) : null,
      renderMsP50: pick(0.5) && Number(pick(0.5).toFixed(2)),
      renderMsP95: pick(0.95) && Number(pick(0.95).toFixed(2)),
      dpr: s.gl.getPixelRatio(),
      drawingBuffer: [s.gl.domElement.width, s.gl.domElement.height],
    };
  });
}

/**
 * 发一串触摸：steps 里每项 { type: touchStart|touchMove|touchEnd, points: [[x,y]...], dt: 秒 }。
 * 时间戳按 dt 累加，事件的 timeStamp 是真实操作的节奏（不受 swiftshader 渲染慢影响）。
 */
async function touchSequence(page, steps) {
  const cdp = await page.context().newCDPSession(page);
  let time = Date.now() / 1000;
  for (const { type, points, dt = 0.016 } of steps) {
    time += dt;
    await cdp.send("Input.dispatchTouchEvent", { type, timestamp: time, touchPoints: points.map(([x, y], id) => ({ x, y, id, radiusX: 8, radiusY: 8, force: 1 })) });
  }
  await cdp.detach();
}
const moves = (from, dx, dy, steps, offsets = [[0, 0]]) =>
  Array.from({ length: steps }, (_, index) => ({
    type: "touchMove",
    points: offsets.map(([ox, oy]) => [from.x + ox + (dx * (index + 1)) / steps, from.y + oy + (dy * (index + 1)) / steps]),
  }));
const gestures = {
  tap: (p) => [
    { type: "touchStart", points: [[p.x, p.y]], dt: 0.05 },
    { type: "touchEnd", points: [], dt: 0.06 },
  ],
  doubleTap: (p) => [...gestures.tap(p), { type: "touchStart", points: [[p.x, p.y]], dt: 0.12 }, { type: "touchEnd", points: [], dt: 0.06 }],
  drag: (p, dx = -240, dy = -40, steps = 24) => [{ type: "touchStart", points: [[p.x, p.y]], dt: 0.05 }, ...moves(p, dx, dy, steps), { type: "touchEnd", points: [] }],
  doubleTapDrag: (p, dx = -240, dy = -40, steps = 24) => [
    ...gestures.tap(p),
    { type: "touchStart", points: [[p.x, p.y]], dt: 0.12 },
    ...moves(p, dx, dy, steps),
    { type: "touchEnd", points: [] },
  ],
  // 双指平移：先落一根手指，30 ms 后第二根（真实操作两指很少同时落下），两指间距 90 px 不变，整体向右滑
  twoFingerPan: (p, dx = 260, dy = 30, steps = 24) => [
    { type: "touchStart", points: [[p.x - 45, p.y]], dt: 0.05 },
    { type: "touchStart", points: [[p.x - 45, p.y], [p.x + 45, p.y]], dt: 0.03 },
    ...moves(p, dx, dy, steps, [[-45, 0], [45, 0]]),
    { type: "touchEnd", points: [] },
  ],
};

async function waitCameraStill(ctx, page, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  let previous = await ctx.readCamera(page);
  let still = 0;
  while (Date.now() < deadline && still < 3) {
    await ctx.sleep(400);
    const current = await ctx.readCamera(page);
    still = distance(current.position, previous.position) < 0.002 ? still + 1 : 0;
    previous = current;
  }
}

/** 执行一个手势，返回相机变化、触摸日志、渲染开销、手势后的页面状态。 */
async function runGesture(ctx, page, steps) {
  await waitCameraStill(ctx, page);
  const before = await ctx.readCamera(page);
  const url = page.url();
  await page.evaluate(() => window.__ha3dTouchReset());
  await startRenderProbe(page);
  await touchSequence(page, steps);
  await page.waitForTimeout(400);
  const render = await stopRenderProbe(page);
  await waitCameraStill(ctx, page);
  const after = await ctx.readCamera(page);
  return {
    azimuthDeltaDeg: round(angleDelta(before.azimuthDeg, after.azimuthDeg), 2),
    targetMoveM: round(distance(after.target, before.target)),
    distanceDeltaM: round(Math.abs(distance(after.position, after.target) - distance(before.position, before.target))),
    touch: await page.evaluate(() => ({ ...window.__ha3dTouchLog })),
    render,
    focused: await page.locator(".room-focus-card").isVisible(),
    urlUnchanged: page.url() === url,
  };
}

export default async function touch(ctx) {
  const { check, log } = ctx;
  const collectBaseline = process.env.HA3D_TOUCH_BASELINE === "1";
  const verify = (name, ok, detail) => (collectBaseline ? check(`[基线，只记录] ${name}`, true, detail) : check(name, ok, detail));
  const project = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
  const floor = project.floors[0];
  const out = { device: "iPad Pro 11 landscape", viewport: DEVICE.viewport, deviceScaleFactor: DEVICE.deviceScaleFactor, home: {}, toggle: {} };
  const page = await newIpadPage(ctx);
  const room = floor.rooms[0];
  const centroid = room.polygon.reduce((sum, [x, y]) => [sum[0] + x / room.polygon.length, sum[1] + y / room.polygon.length], [0, 0]);
  const floorPoint = async () => {
    const world = await ctx.planToWorld(page, [centroid[0], 0.03, centroid[1]]);
    const point = await ctx.projectToScreen(page, world);
    return point?.onCanvas ? { x: point.x, y: point.y } : { x: DEVICE.viewport.width * 0.6, y: DEVICE.viewport.height * 0.62 };
  };

  // ---------- 首页：单指旋转、双击后拖动平移、双指平移 ----------
  await ctx.gotoHome(page, { prefs: { [CLICK_MODE_KEY]: null } });
  out.quality = await page.evaluate(() => window.localStorage.getItem("ha3d.home.sceneQuality"));
  let start = await floorPoint();
  out.home.start = start;
  out.home.rotate = await runGesture(ctx, page, gestures.drag(start));
  await ctx.gotoHome(page);
  start = await floorPoint();
  out.home.doubleTapDrag = await runGesture(ctx, page, gestures.doubleTapDrag(start));
  await ctx.shot(page, "ipad-after-double-tap-drag");
  await ctx.gotoHome(page);
  start = await floorPoint();
  out.home.twoFingerPan = await runGesture(ctx, page, gestures.twoFingerPan(start));
  await ctx.shot(page, "ipad-after-two-finger-pan");
  const { rotate, doubleTapDrag, twoFingerPan } = out.home;
  check("单指拖动仍然旋转（方位角变化 > 10°）", rotate.azimuthDeltaDeg > 10, rotate);
  check("单指拖动时页面不拦截 touchstart（单击仍由浏览器生成 click）", rotate.touch.touchstartPrevented === 0, rotate.touch);
  check("双击后拖动是平移：target 移动 ≥ 0.3 m、方位角变化 < 2°", doubleTapDrag.targetMoveM >= 0.3 && doubleTapDrag.azimuthDeltaDeg < 2, doubleTapDrag);
  verify("双击后拖动：第二次按下的 touchstart、之后的 touchmove 都被 preventDefault（iPadOS 不再进入双击按住的放大镜/文本选择）", doubleTapDrag.touch.touchstartPrevented === 1 && doubleTapDrag.touch.touchmove > 0 && doubleTapDrag.touch.touchmovePrevented === doubleTapDrag.touch.touchmove, doubleTapDrag.touch);
  verify("双击后拖动：没有 dblclick、没有进入房间聚焦、只有第一次轻点的 1 次 click", doubleTapDrag.touch.dblclick === 0 && !doubleTapDrag.focused && doubleTapDrag.touch.click === 1, { touch: doubleTapDrag.touch, focused: doubleTapDrag.focused });
  check("双指平移：target 移动 ≥ 0.3 m、方位角变化 < 2°", twoFingerPan.targetMoveM >= 0.3 && twoFingerPan.azimuthDeltaDeg < 2, twoFingerPan);
  verify("双指平移：所有两指 touchstart / touchmove 都被 preventDefault（HA App、iPadOS 的双指原生手势拿不到这串触摸）", twoFingerPan.touch.multiStart > 0 && twoFingerPan.touch.multiStartPrevented === twoFingerPan.touch.multiStart && twoFingerPan.touch.multiMove > 0 && twoFingerPan.touch.multiMovePrevented === twoFingerPan.touch.multiMove, twoFingerPan.touch);
  check("双指平移：没有 click / dblclick、没有进入房间聚焦、页面地址不变", twoFingerPan.touch.click === 0 && twoFingerPan.touch.dblclick === 0 && !twoFingerPan.focused && twoFingerPan.urlUnchanged, { touch: twoFingerPan.touch, focused: twoFingerPan.focused, urlUnchanged: twoFingerPan.urlUnchanged });

  // ---------- 双击（不拖动）：地面上进入房间聚焦，非地面处退出 ----------
  await ctx.gotoHome(page);
  const tapPoint = await floorPoint();
  const enter = await runGesture(ctx, page, gestures.doubleTap(tapPoint));
  await page.waitForTimeout(1500);
  const focused = await page.locator(".room-focus-card").isVisible();
  const exitPoint = focused ? await findExitFocusPoint(page) : null;
  const exit = exitPoint ? await runGesture(ctx, page, gestures.doubleTap(exitPoint)) : null;
  await page.waitForTimeout(1500);
  const exited = focused && exitPoint ? !(await page.locator(".room-focus-card").isVisible()) : false;
  out.home.doubleTap = { tapPoint, enter: enter.touch, focused, exitPoint, exit: exit?.touch ?? null, exited };
  await ctx.shot(page, "ipad-after-double-tap-exit");
  check("双击地面（不拖动）进入房间聚焦，dblclick 正好 1 次", focused && enter.touch.dblclick === 1, out.home.doubleTap);
  check("双击非地面处（不拖动）退出房间聚焦，dblclick 正好 1 次", exited && exit?.touch.dblclick === 1, out.home.doubleTap);

  // ---------- 直接开关模式：单击灯 1 次 toggle，双击拖动 0 次，单次拖动 0 次 ----------
  const lights = floor.devices.filter((device) => device.entityId.startsWith("light."));
  const togglesOf = (calls, entityId) => calls.filter((call) => call.service === "toggle" && [].concat(call.data?.entity_id ?? []).includes(entityId)).length;
  for (const device of lights) {
    await ctx.gotoHome(page, { prefs: { [CLICK_MODE_KEY]: "toggle" } });
    const point = await clickablePoint(ctx, page, device.entityId);
    if (!point) continue;
    const callsBefore = (await ctx.mock.calls()).length;
    await touchSequence(page, gestures.tap(point));
    const deadline = Date.now() + 5000;
    let calls = [];
    while (Date.now() < deadline && !togglesOf(calls, device.entityId)) {
      await page.waitForTimeout(250);
      calls = (await ctx.mock.calls()).slice(callsBefore);
    }
    await page.waitForTimeout(1000);
    calls = (await ctx.mock.calls()).slice(callsBefore);
    if (!togglesOf(calls, device.entityId)) continue; // 没点中，换一盏灯
    out.toggle.tap = { entityId: device.entityId, point, toggles: togglesOf(calls, device.entityId) };

    await ctx.gotoHome(page, { prefs: { [CLICK_MODE_KEY]: "toggle" } });
    const point2 = await clickablePoint(ctx, page, device.entityId);
    if (point2) {
      const before2 = (await ctx.mock.calls()).length;
      const drag = await runGesture(ctx, page, gestures.doubleTapDrag(point2));
      await page.waitForTimeout(1500);
      out.toggle.doubleTapDrag = { point: point2, targetMoveM: drag.targetMoveM, toggles: togglesOf((await ctx.mock.calls()).slice(before2), device.entityId) };
    }
    await ctx.gotoHome(page, { prefs: { [CLICK_MODE_KEY]: "toggle" } });
    const point3 = await clickablePoint(ctx, page, device.entityId);
    if (point3) {
      const before3 = (await ctx.mock.calls()).length;
      const drag = await runGesture(ctx, page, gestures.drag(point3, 160, 0, 20));
      await page.waitForTimeout(1500);
      out.toggle.singleDrag = { point: point3, azimuthDeltaDeg: drag.azimuthDeltaDeg, toggles: togglesOf((await ctx.mock.calls()).slice(before3), device.entityId) };
    }
    break;
  }
  check("直接开关：单击灯 1 次 toggle", out.toggle.tap?.toggles === 1, out.toggle.tap);
  check("直接开关：从灯上双击后拖动 0 次 toggle（画面平移 ≥ 0.3 m）", out.toggle.doubleTapDrag?.toggles === 0 && out.toggle.doubleTapDrag.targetMoveM >= 0.3, out.toggle.doubleTapDrag);
  check("直接开关：从灯上单次拖动 0 次 toggle", out.toggle.singleDrag?.toggles === 0, out.toggle.singleDrag);
  check("触屏套件没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));

  log(`渲染开销（${out.quality ?? "默认画质"}）：旋转 ${JSON.stringify(rotate.render)}；双击拖动 ${JSON.stringify(doubleTapDrag.render)}；双指平移 ${JSON.stringify(twoFingerPan.render)}`);
  await ctx.writeJson(path.join(ctx.dir, collectBaseline ? "touch-baseline.json" : "touch.json"), out);
  return { quality: out.quality, render: { rotate: rotate.render, doubleTapDrag: doubleTapDrag.render, twoFingerPan: twoFingerPan.render } };
}
