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
export async function newPage({ lowEnd = false, touch = false, reducedMotion = false, video, viewport = { width: 1440, height: 900 } } = {}) {
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

/** 先写 localStorage（ha3d.home.*），再打开 /?ha3dDebug=1，等待画布稳定。 */
export async function gotoHome(page, { style, quality, prefs = {}, settleMs = 2500, query = "" } = {}) {
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
  async set(entityId, stateValue, attributes) {
    const response = await fetch(`${mockUrl()}/mock/set`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ entityId, state: stateValue, attributes }) });
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
      camera.position.copy(target).add(direction.multiplyScalar(distance));
      if (controls) {
        controls.target.copy(target);
        controls.update();
      } else camera.lookAt(target);
      s.invalidate();
    },
    { worldPos, distance, fixedDirection },
  );
  await sleep(600);
}

/** ms 毫秒内渲染的帧数（gl.info.render.frame 的增量）。 */
export async function countFrames(page, ms = 5000) {
  const read = () => page.evaluate(() => window.__ha3dDebug?.get().gl.info.render.frame ?? 0);
  const before = await read();
  await sleep(ms);
  return (await read()) - before;
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
