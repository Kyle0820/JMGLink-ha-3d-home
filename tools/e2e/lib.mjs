// e2e 公共库：测试栈、浏览器页面、调试桥（?ha3dDebug=1）读取、截图与像素/对比度分析。
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import { startStack, stopStack } from "../dev/start-local.mjs";

export { startStack, stopStack };

const state = { browser: undefined, stack: undefined, evidenceRoot: "/tmp/ha3d-evidence", contexts: new Set() };

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const browserArgs = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];

export async function launchBrowser() {
  const channel = process.env.HA3D_BROWSER_CHANNEL || undefined;
  return chromium.launch({ headless: true, channel, args: browserArgs });
}

/** run.mjs 在启动测试栈后调用，供本库的其他函数使用。 */
export function setRuntime({ browser, stack, evidenceRoot }) {
  if (browser) state.browser = browser;
  if (stack) state.stack = stack;
  if (evidenceRoot) state.evidenceRoot = evidenceRoot;
}

export const runtime = () => state;

/** 关闭本套件创建的所有浏览器上下文（会让录像落盘）。 */
export async function closeContexts() {
  const contexts = [...state.contexts];
  state.contexts.clear();
  await Promise.all(contexts.map((context) => context.close().catch(() => undefined)));
}

/**
 * 新建页面。lowEnd：改写 hardwareConcurrency/deviceMemory 为 2；touch：触摸设备；
 * reducedMotion：prefers-reduced-motion: reduce；video：录像目录（true 时用 <证据>/videos）。
 * 页面上挂 ha3dErrors（pageerror）和 ha3dResponses（同源响应）。
 */
export async function newPage({ lowEnd = false, touch = false, reducedMotion = false, video, viewport = { width: 1440, height: 900 }, startTime } = {}) {
  if (!state.browser) throw new Error("browser 未初始化");
  const videoDir = video === true ? path.join(state.evidenceRoot, "videos") : video;
  const context = await state.browser.newContext({
    baseURL: state.stack?.appUrl,
    viewport,
    deviceScaleFactor: 1,
    hasTouch: touch,
    isMobile: false,
    reducedMotion: reducedMotion ? "reduce" : "no-preference",
    acceptDownloads: true,
    locale: "zh-CN",
    ...(videoDir ? { recordVideo: { dir: videoDir, size: viewport } } : {}),
  });
  state.contexts.add(context);
  if (lowEnd) {
    await context.addInitScript(() => {
      Object.defineProperty(Navigator.prototype, "hardwareConcurrency", { get: () => 2, configurable: true });
      Object.defineProperty(Navigator.prototype, "deviceMemory", { get: () => 2, configurable: true });
    });
  }
  // startTime：页面里的 Date 从这个本地时间开始正常走（昼夜主题按本机时钟切换）。
  // 不用 page.clock：它会冻结时间，让依赖时间差的过渡动画一直重绘，swiftshader 下截图超时。
  if (startTime) {
    await context.addInitScript((target) => {
      const RealDate = Date;
      const offset = RealDate.parse(target) - RealDate.now();
      class Ha3dDate extends RealDate {
        constructor(...args) {
          if (args.length) super(...args);
          else super(RealDate.now() + offset);
        }
        static now() {
          return RealDate.now() + offset;
        }
      }
      window.Date = Ha3dDate;
    }, startTime);
  }
  const page = await context.newPage();
  page.ha3dErrors = [];
  page.ha3dConsoleErrors = [];
  page.ha3dResponses = [];
  page.on("pageerror", (error) => page.ha3dErrors.push(String(error?.stack ?? error)));
  page.on("console", (message) => {
    if (message.type() === "error") page.ha3dConsoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    const url = response.url();
    if (state.stack && url.startsWith(state.stack.appUrl)) {
      page.ha3dResponses.push({ url: url.slice(state.stack.appUrl.length), method: response.request().method(), status: response.status(), type: response.request().resourceType() });
    }
  });
  return page;
}

/** 等待调试桥就绪并且场景至少渲染过一帧。 */
export async function waitForScene(page, { timeout = 30_000, settleMs = 2500, requireDevices = true } = {}) {
  await page.waitForFunction(
    (needDevices) => {
      const debug = window.__ha3dDebug;
      if (!debug) return false;
      const s = debug.get();
      if (!s?.gl || s.gl.info.render.frame < 1) return false;
      if (!needDevices) return true;
      let found = false;
      s.scene.traverse((object) => {
        if (object.userData?.focusEntityId) found = true;
      });
      return found;
    },
    requireDevices,
    { timeout, polling: 250 },
  ).catch(() => undefined);
  await sleep(settleMs);
}

/** 0.2.2 起首页设置保存在后端（/api/ui-settings）：读取全部，或把全部键删掉。 */
export const uiSettings = {
  async get() {
    return (await (await fetch(`${state.stack.appUrl}/api/ui-settings`)).json()).values;
  },
  async put(values) {
    const response = await fetch(`${state.stack.appUrl}/api/ui-settings`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ values }) });
    if (!response.ok) throw new Error(`ui-settings PUT 失败：${response.status}`);
    return (await response.json()).values;
  },
  async clear() {
    const values = await uiSettings.get();
    if (Object.keys(values).length) await uiSettings.put(Object.fromEntries(Object.keys(values).map((key) => [key, null])));
  },
};

/**
 * 先写 localStorage（ha3d.home.*），再打开 /?ha3dDebug=1，等待画布稳定。
 * 默认先清空后端保存的首页设置，页面启动时会把这里写的 localStorage 迁移到后端，和 0.2.1 以前「只看本机」的行为一致；
 * keepServerSettings: true 时保留后端设置（跨设备同步测试用）。
 */
export async function gotoHome(page, { style, quality, prefs = {}, settleMs = 2500, query = "", keepServerSettings = false } = {}) {
  if (!keepServerSettings && state.stack) await uiSettings.clear();
  await page.goto("/api/health");
  const values = { ...prefs };
  if (style) values["ha3d.home.sceneVisualStyle"] = style;
  if (quality) values["ha3d.home.sceneQuality"] = quality;
  await page.evaluate((entries) => {
    for (const [key, value] of Object.entries(entries)) {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, String(value));
    }
  }, values);
  await page.goto(`/?ha3dDebug=1${query}`);
  await page.waitForSelector("canvas", { timeout: 30_000 });
  await waitForScene(page, { settleMs });
}

/** 从首页进入编辑器；view 为 "2d" 或 "3d"。 */
export async function gotoEditor(page, { view = "2d", settleMs = 2500, ...homeOptions } = {}) {
  await gotoHome(page, { ...homeOptions, settleMs: 500 });
  // 「编辑」按钮在左下角的折叠菜单里，先展开
  const editButton = page.locator('button[aria-label="进入户型编辑"]');
  if (!(await editButton.isVisible())) await page.locator(".corner-dock-toggle").click();
  await editButton.click();
  await page.waitForSelector(".view-switch", { timeout: 30_000 });
  if (view === "3d") {
    await page.evaluate(() => {
      window.__ha3dDebug = undefined;
    });
    await page.locator(".view-switch button", { hasText: "3D" }).click();
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await waitForScene(page, { settleMs, requireDevices: false });
  } else {
    await sleep(settleMs);
  }
}

const mockUrl = () => {
  if (!state.stack) throw new Error("测试栈未启动");
  return state.stack.mockUrl;
};

export const mock = {
  /** merge=false 时整个替换属性（例如去掉 sun.sun 的 elevation，测试本机时钟兜底）。 */
  async set(entityId, stateValue, attributes, { merge } = {}) {
    const response = await fetch(`${mockUrl()}/mock/set`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ entityId, state: stateValue, attributes, merge }) });
    if (!response.ok) throw new Error(`mock.set 失败：${response.status}`);
    return (await response.json()).state;
  },
  async calls() {
    return (await (await fetch(`${mockUrl()}/mock/calls`)).json()).calls;
  },
  async reset() {
    const response = await fetch(`${mockUrl()}/mock/reset`, { method: "POST" });
    if (!response.ok) throw new Error(`mock.reset 失败：${response.status}`);
  },
  async states() {
    return (await (await fetch(`${mockUrl()}/mock/states`)).json()).states;
  },
};

/** 场景里以 prefix 开头的对象名 → 数量（只统计 visible 的对象链）。 */
export async function namedObjects(page, prefix = "ha3d-") {
  return page.evaluate((prefix) => {
    const s = window.__ha3dDebug?.get();
    const out = {};
    if (!s) return out;
    const visit = (object) => {
      if (!object.visible) return;
      if (object.name && object.name.startsWith(prefix)) out[object.name] = (out[object.name] ?? 0) + 1;
      for (const child of object.children) visit(child);
    };
    visit(s.scene);
    return out;
  }, prefix);
}

/** 关闭页面所在的上下文让录像落盘，再另存为 file（录像目录里的随机文件名删掉）。 */
export async function saveVideo(page, file) {
  const video = page.video();
  if (!video) return null;
  const context = page.context();
  state.contexts.delete(context);
  await context.close();
  await mkdir(path.dirname(file), { recursive: true });
  await video.saveAs(file);
  await video.delete().catch(() => undefined);
  return file;
}

/** 场景里带 userData.focusEntityId 的设备数量（按 entityId 去重）。 */
export async function countSceneDevices(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    if (!s) return 0;
    const ids = new Set();
    s.scene.traverse((object) => {
      if (object.userData?.focusEntityId) ids.add(object.userData.focusEntityId);
    });
    return ids.size;
  });
}

/** 按 entityId（userData.focusEntityId）或对象 name 找到 3D 对象，投影成页面坐标。找不到时返回 null。 */
export async function screenPosOf(page, { entityId, name, index = 0 }) {
  return page.evaluate(
    ({ entityId, name, index }) => {
      const s = window.__ha3dDebug?.get();
      if (!s) return null;
      const matches = [];
      s.scene.traverse((object) => {
        if ((entityId && object.userData?.focusEntityId === entityId) || (name && object.name === name)) matches.push(object);
      });
      const target = matches[index];
      if (!target) return null;
      target.updateWorldMatrix(true, false);
      const world = target.position.clone();
      target.getWorldPosition(world);
      const projected = world.clone().project(s.camera);
      const rect = s.gl.domElement.getBoundingClientRect();
      return {
        x: rect.left + ((projected.x + 1) / 2) * rect.width,
        y: rect.top + ((1 - projected.y) / 2) * rect.height,
        world: [world.x, world.y, world.z],
        inView: projected.z > -1 && projected.z < 1 && Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1,
        count: matches.length,
      };
    },
    { entityId, name, index },
  );
}

/**
 * 平面坐标转世界坐标：plan 为 [x, 高度, y]（与 device.position 相同）。
 * 场景会把楼层整体平移居中，这里借用任意设备组的父节点（楼层内坐标系）做变换。
 */
export async function planToWorld(page, plan) {
  return page.evaluate((plan) => {
    const s = window.__ha3dDebug?.get();
    if (!s) return plan;
    let parent;
    s.scene.traverse((object) => {
      if (!parent && object.userData?.focusEntityId && object.parent) parent = object.parent;
    });
    if (!parent) return plan;
    parent.updateWorldMatrix(true, false);
    const point = parent.localToWorld(s.camera.position.clone().set(plan[0], plan[1], plan[2]));
    return [point.x, point.y, point.z];
  }, plan);
}

/** 把相机对准 worldPos，保持当前方向，距离为 distance。 */
export async function focusCamera(page, worldPos, distance = 4, { direction: fixedDirection } = {}) {
  await page.evaluate(
    ({ worldPos, distance, fixedDirection }) => {
      const s = window.__ha3dDebug.get();
      const camera = s.camera;
      const controls = s.controls;
      const target = camera.position.clone().set(worldPos[0], worldPos[1], worldPos[2]);
      const direction = fixedDirection
        ? camera.position.clone().set(fixedDirection[0], fixedDirection[1], fixedDirection[2]).normalize()
        : camera.position.clone().sub(controls?.target ?? target).normalize();
      if (direction.lengthSq() === 0) direction.set(0, 1, 1).normalize();
      // 和用户拖动一样先发 start 事件：场景的相机过渡监听它来停止自动取景，否则会把机位拉回去
      controls?.dispatchEvent?.({ type: "start" });
      camera.position.copy(target).add(direction.multiplyScalar(distance));
      if (controls) {
        controls.target.copy(target);
        controls.update();
        controls.dispatchEvent?.({ type: "end" });
      } else camera.lookAt(target);
      s.invalidate();
    },
    { worldPos, distance, fixedDirection },
  );
  await sleep(600);
}

/**
 * 带重试的 focusCamera：状态变化（例如门磁打开）可能触发场景自带的相机过渡并覆盖设置，
 * 先等相机停稳，再设置机位，并确认 target 和相机位置都到位（最多 5 次）。返回是否到位。
 */
export async function focusOn(page, worldPos, distance = 4, direction) {
  const settle = async () => {
    let previous = await readCamera(page);
    for (let index = 0; index < 10; index += 1) {
      await sleep(250);
      const current = await readCamera(page);
      if (Math.hypot(...current.position.map((value, axis) => value - previous.position[axis])) < 0.001) return;
      previous = current;
    }
  };
  let ok = false;
  for (let attempt = 0; attempt < 5 && !ok; attempt += 1) {
    await settle();
    await focusCamera(page, worldPos, distance, { direction });
    await sleep(500);
    const camera = await readCamera(page);
    const targetError = Math.hypot(camera.target[0] - worldPos[0], camera.target[1] - worldPos[1], camera.target[2] - worldPos[2]);
    const distanceError = Math.abs(Math.hypot(...camera.position.map((value, axis) => value - camera.target[axis])) - distance);
    ok = targetError < 0.2 && distanceError < 0.3;
  }
  await sleep(400);
  return ok;
}

/** 世界坐标投影成页面坐标；onCanvas 表示该点最上层元素就是画布（没有被 HUD 挡住）。 */
export async function projectToScreen(page, world) {
  return page.evaluate((world) => {
    const s = window.__ha3dDebug?.get();
    if (!s) return null;
    const projected = s.camera.position.clone().set(world[0], world[1], world[2]).project(s.camera);
    const rect = s.gl.domElement.getBoundingClientRect();
    const x = rect.left + ((projected.x + 1) / 2) * rect.width;
    const y = rect.top + ((1 - projected.y) / 2) * rect.height;
    const inView = projected.z > -1 && projected.z < 1 && Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1;
    return { x, y, inView, onCanvas: inView && document.elementFromPoint(x, y) === s.gl.domElement };
  }, world);
}

/** ms 毫秒内渲染的帧数（gl.info.render.frame 的增量）。 */
export async function countFrames(page, ms = 5000) {
  const read = () => page.evaluate(() => window.__ha3dDebug?.get().gl.info.render.frame ?? 0);
  const before = await read();
  await sleep(ms);
  return (await read()) - before;
}

/** B3：首页 3D 区域里各处文字的计算样式 user-select，以及画布的 touch-action；元素不存在时为 null。修复前后都记录，用来对照。 */
export async function sceneUserSelect(page) {
  return page.evaluate(() => {
    const of = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const style = getComputedStyle(el);
      return style.userSelect || style.webkitUserSelect;
    };
    const canvas = document.querySelector(".home-scene canvas");
    return {
      scene: of(".home-scene"),
      canvas: of(".home-scene canvas"),
      canvasTouchAction: canvas ? getComputedStyle(canvas).touchAction : null,
      title: of(".scene-title h1"),
      dashboardCard: of(".home-dashboard-card"),
      forecastItem: of(".weather-forecast-item"),
      roomBadge: of(".mijia-room-badge"),
      statusChip: of(".scene-device-status-chip"),
    };
  });
}

/** 触屏长按：CDP touchStart，按住 ms 毫秒后 touchEnd；返回按住期间和松开后 getSelection() 的文字（页面要用 touch: true 创建）。 */
export async function touchLongPress(page, point, ms = 1200) {
  const read = () => page.evaluate(() => window.getSelection()?.toString() ?? "");
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: point.x, y: point.y }] });
  await sleep(ms);
  const during = await read();
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await sleep(300);
  const after = await read();
  await cdp.detach();
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
  return { during, after };
}

/** 手动渲染一帧，读取 draw call 和三角形数量。 */
export async function drawCallsPerFrame(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug.get();
    const autoReset = s.gl.info.autoReset;
    s.gl.info.autoReset = false;
    s.gl.info.reset();
    s.gl.render(s.scene, s.camera);
    const result = { calls: s.gl.info.render.calls, triangles: s.gl.info.render.triangles };
    s.gl.info.autoReset = autoReset;
    return result;
  });
}

/** 读取相机方位角（度）、极角和 controls.target。 */
export async function readCamera(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    if (!s) return null;
    const controls = s.controls;
    const target = controls?.target ?? { x: 0, y: 0, z: 0 };
    const dx = s.camera.position.x - target.x;
    const dz = s.camera.position.z - target.z;
    return {
      azimuthDeg: controls?.getAzimuthalAngle ? (controls.getAzimuthalAngle() * 180) / Math.PI : (Math.atan2(dx, dz) * 180) / Math.PI,
      polarDeg: controls?.getPolarAngle ? (controls.getPolarAngle() * 180) / Math.PI : null,
      target: [target.x, target.y, target.z],
      position: [s.camera.position.x, s.camera.position.y, s.camera.position.z],
    };
  });
}

/** PNG 截图里 (x,y) 周围半径 r 内的平均亮度（0–255）。 */
export function sampleLuma(pngBuffer, x, y, r = 24) {
  const png = PNG.sync.read(pngBuffer);
  let sum = 0;
  let count = 0;
  for (let dy = -r; dy <= r; dy += 1) {
    for (let dx = -r; dx <= r; dx += 1) {
      if (dx * dx + dy * dy > r * r) continue;
      const px = Math.round(x + dx);
      const py = Math.round(y + dy);
      if (px < 0 || py < 0 || px >= png.width || py >= png.height) continue;
      const offset = (png.width * py + px) * 4;
      sum += 0.2126 * png.data[offset] + 0.7152 * png.data[offset + 1] + 0.0722 * png.data[offset + 2];
      count += 1;
    }
  }
  return count ? sum / count : 0;
}

/** 截图到 <证据>/<suite>/<name>.png，返回 { path, buffer }。 */
export async function shot(page, suite, name, options = {}) {
  const dir = path.join(state.evidenceRoot, suite);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${name}.png`);
  const buffer = await page.screenshot({ path: file, ...options });
  return { path: file, buffer };
}

/** 在 selector 范围内只跑 axe 的 color-contrast 规则。 */
export async function axeContrast(page, selector) {
  const result = await new AxeBuilder({ page }).include(selector).withRules(["color-contrast"]).analyze();
  const nodes = result.violations.flatMap((violation) => violation.nodes);
  const incomplete = result.incomplete.flatMap((item) => item.nodes);
  return {
    violations: nodes.length,
    // axe 无法判定（半透明背景、backdrop-filter、背景图）的节点数
    incomplete: incomplete.length,
    nodes: nodes.map((node) => ({ target: node.target.join(" "), summary: node.failureSummary?.split("\n").slice(0, 3).join(" ") })),
  };
}

export async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}
