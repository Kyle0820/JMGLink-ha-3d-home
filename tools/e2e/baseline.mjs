// 修复前基线：只采集、不断言（plan.md 第 3 节「修复前」一栏），输出 <证据>/baseline/baseline.json 和截图。
// 用非 fixture 项目（HA3D_PROJECT_JSON）运行时输出到 <证据>/baseline/apartment/。
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";

export const apartmentSubdir = true;

const QUALITIES = ["eco", "smooth", "balanced", "high"];

/** 门洞中心（世界坐标，y 取门高一半）。 */
export function openingCenter(floor, opening) {
  const wall = floor.walls.find((item) => item.id === opening.wallId);
  if (!wall) return null;
  const dx = wall.end[0] - wall.start[0];
  const dy = wall.end[1] - wall.start[1];
  const length = Math.hypot(dx, dy) || 1;
  const x = wall.start[0] + (dx / length) * opening.offset;
  const z = wall.start[1] + (dy / length) * opening.offset;
  return [x, (opening.bottom ?? 0) + (opening.height ?? 2.1) / 2, z];
}

function pointInPolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** 特写相机方向：沿墙法线朝向房间内部，略微俯视。 */
export function inwardDirection(floor, opening) {
  const wall = floor.walls.find((item) => item.id === opening.wallId);
  const center = openingCenter(floor, opening);
  const dx = wall.end[0] - wall.start[0];
  const dy = wall.end[1] - wall.start[1];
  const length = Math.hypot(dx, dy) || 1;
  let normal = [-dy / length, dx / length];
  const probe = [center[0] + normal[0] * 0.5, center[2] + normal[1] * 0.5];
  if (!floor.rooms.some((room) => pointInPolygon(probe, room.polygon))) normal = [-normal[0], -normal[1]];
  return [normal[0], 0.55, normal[1]];
}

/** 列出门洞附近（水平 0.8 m 内）不属于设备的网格和描边，用于判断重影来源和门扇材质。 */
async function analyzeDoor(page, center, height) {
  return page.evaluate(
    ({ center, height }) => {
      const s = window.__ha3dDebug?.get();
      if (!s) return null;
      s.scene.updateMatrixWorld(true);
      const items = [];
      s.scene.traverse((object) => {
        if (!(object.isMesh || object.isLineSegments) || !object.geometry || !object.visible) return;
        for (let parent = object; parent; parent = parent.parent) if (parent.userData?.focusEntityId) return;
        const geometry = object.geometry;
        if (!geometry.boundingBox) geometry.computeBoundingBox();
        const box = geometry.boundingBox.clone().applyMatrix4(object.matrixWorld);
        const c = box.getCenter(box.min.clone());
        const size = box.getSize(box.min.clone());
        if (size.x > 3 || size.z > 3) return;
        if (Math.hypot(c.x - center[0], c.z - center[2]) > 0.8 || c.y > height + 0.3) return;
        const material = Array.isArray(object.material) ? object.material[0] : object.material;
        items.push({
          kind: object.isLineSegments ? "edges" : "mesh",
          geometry: geometry.type,
          size: [size.x, size.y, size.z].map((value) => Number(value.toFixed(3))),
          center: [c.x, c.y, c.z].map((value) => Number(value.toFixed(3))),
          material: material && {
            type: material.type,
            transparent: material.transparent,
            opacity: Number(material.opacity.toFixed(3)),
            depthWrite: material.depthWrite,
            color: material.color ? `#${material.color.getHexString()}` : undefined,
          },
        });
      });
      for (const item of items) if (item.material?.type === "LineMaterial") item.kind = "edges";
      const meshes = items.filter((item) => item.kind === "mesh");
      const frames = meshes.filter((item) => item.geometry === "BoxGeometry" && (Math.abs(item.size[1] - height) < 0.15 || item.size[1] < 0.1));
      const leaves = meshes.filter((item) => item.geometry === "ExtrudeGeometry" && item.size[1] > height * 0.8);
      const unique = (list) => [...new Map(list.map((item) => [JSON.stringify(item.material), item.material])).values()];
      return {
        meshCount: meshes.length,
        edgesCount: items.length - meshes.length,
        frameBoxCount: frames.length,
        leafCount: leaves.length,
        leafMaterials: unique(leaves),
        frameMaterials: unique(frames),
        items,
      };
    },
    { center, height },
  );
}

function rawRequest(baseUrl, method, pathname, { headers = {}, body, chunked = false } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, baseUrl);
    const request = http.request({ method, hostname: url.hostname, port: url.port, path: url.pathname, headers }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, body: Buffer.concat(chunks).toString("utf8").slice(0, 200) }));
    });
    request.on("error", reject);
    if (chunked) request.setHeader("transfer-encoding", "chunked");
    if (body !== undefined) request.write(body);
    request.end();
  });
}

/** plan.md 第 3 节 B7 的 curl 矩阵。 */
export async function exportMatrix(baseUrl, projectId) {
  const exportPath = `/api/projects/${encodeURIComponent(projectId)}/export`;
  const octet = { "content-type": "application/octet-stream" };
  const cases = [
    ["GET", exportPath, {}],
    ["POST 无 content-type", exportPath, { headers: { "content-length": "0" } }],
    ["POST octet-stream 空 body（content-length:0）", exportPath, { headers: { ...octet, "content-length": "0" } }],
    ["POST octet-stream 空 body（chunked）", exportPath, { headers: octet, chunked: true }],
    ["POST octet-stream 非空 body", exportPath, { headers: octet, body: "abc" }],
    ["POST /api/ha/reconnect octet-stream 空 body", "/api/ha/reconnect", { headers: { ...octet, "content-length": "0" } }],
  ];
  const results = [];
  for (const [name, pathname, options] of cases) {
    const method = name.startsWith("GET") ? "GET" : "POST";
    const response = await rawRequest(baseUrl, method, pathname, options);
    results.push({ name, method, path: pathname, status: response.status, body: response.status >= 400 ? response.body : undefined });
  }
  return results;
}

/** 在编辑器「项目设置」里点击「导出 JSON」，记录 /export 请求的方法、状态和下载结果。 */
export async function uiExport(ctx, page) {
  await ctx.gotoEditor(page, { view: "2d", settleMs: 800 });
  const requests = [];
  const onResponse = (response) => {
    if (/\/api\/projects\/[^/]+\/export$/.test(new URL(response.url()).pathname))
      requests.push({ method: response.request().method(), status: response.status(), url: new URL(response.url()).pathname });
  };
  page.on("response", onResponse);
  await page.locator('button[aria-label="项目设置"]').click();
  const drawer = page.locator(".project-settings-drawer");
  await drawer.waitFor({ state: "visible" });
  const downloadPromise = page.waitForEvent("download", { timeout: 8000 }).catch(() => undefined);
  await drawer.getByRole("button", { name: "导出 JSON" }).click();
  const download = await downloadPromise;
  await page.waitForTimeout(800);
  page.off("response", onResponse);
  const errorText = await page.evaluate(
    () =>
      [...document.querySelectorAll("body *")].map((el) => (el.childElementCount === 0 ? el.textContent : "")).find((text) => text?.includes("导出失败")) ??
      null,
  );
  return { page, requests, download, errorText };
}

export default async function baseline(ctx) {
  const out = { generatedAt: new Date().toISOString(), project: ctx.isFixture ? "fixture" : "custom" };
  const floor = ctx.project.floors[0];
  const entities = await (await fetch(`${ctx.stack.appUrl}/api/ha/entities`)).json().then((body) => body.entities);
  const entityById = new Map(entities.map((entity) => [entity.entityId, entity]));

  out.errors = {};
  const only = process.env.HA3D_BASELINE_ONLY?.split(",");
  const section = async (name, fn) => {
    if (only && !only.includes(name)) return;
    const startedAt = Date.now();
    try {
      await fn();
    } catch (error) {
      out.errors[name] = String(error?.message ?? error).split("\n")[0];
      ctx.log(`${name} 出错：${out.errors[name]}`);
    } finally {
      await ctx.closeContexts();
    }
    ctx.log(`${name} 用时 ${Date.now() - startedAt} ms`);
  };

  // ---------- B1 / B8：门（玻璃、奶油两种风格；绑定门磁的门关、开两种状态） ----------
  await section("B1/B8", async () => {
    const doors = floor.openings.filter((opening) => opening.type !== "window");
    const boundDoor = doors.find((opening) => opening.entityId);
    out.B1 = { boundDoorId: boundDoor?.id ?? null, styles: {} };
    out.B8 = { styles: {} };
    for (const style of ["glass", "cream"]) {
      const page = await ctx.newPage();
      await ctx.gotoHome(page, { style });
      out.B8.styles[style] = [];
      for (const door of doors) {
        const planCenter = openingCenter(floor, door);
        if (!planCenter) continue;
        const center = await ctx.planToWorld(page, planCenter);
        const analysis = await analyzeDoor(page, center, door.height ?? 2.1);
        out.B8.styles[style].push({
          openingId: door.id,
          bound: Boolean(door.entityId),
          doorStyle: door.doorStyle,
          leafMaterials: analysis?.leafMaterials,
          frameMaterials: analysis?.frameMaterials,
        });
      }
      if (boundDoor) {
        const center = await ctx.planToWorld(page, openingCenter(floor, boundDoor));
        const record = {};
        for (const [stateName, value] of [
          ["closed", "off"],
          ["open", "on"],
        ]) {
          await ctx.mock.set(boundDoor.entityId, value);
          await page.waitForTimeout(1200);
          // 场景自带的相机过渡可能覆盖设置，确认 target 到位，最多重试 3 次
        for (let attempt = 0; attempt < 3; attempt += 1) {
          await ctx.focusCamera(page, center, 6, { direction: inwardDirection(floor, boundDoor) });
          await page.waitForTimeout(700);
          const camera = await ctx.readCamera(page);
          if (Math.hypot(camera.target[0] - center[0], camera.target[2] - center[2]) < 0.2) break;
        }
          await page.waitForTimeout(800);
          const analysis = await analyzeDoor(page, center, boundDoor.height ?? 2.1);
          const file = await ctx.shot(page, `B1-door-${style}-${stateName}`);
          record[stateName] = { screenshot: path.basename(file.path), ...analysis };
        }
        await ctx.mock.set(boundDoor.entityId, "off");
        out.B1.styles[style] = record;
      }
      if (style === "glass") await ctx.shot(page, "B8-home-glass");
      await page.context().close();
    }
  });

  // ---------- B2：单次拖动和双击后拖动 ----------
  await section("B2", async () => {
    const page = await ctx.newPage();
    await ctx.gotoHome(page);
    const start = { x: 1290, y: 740 };
    const drag = async (doubleFirst) => {
      const before = await ctx.readCamera(page);
      if (doubleFirst) {
        await page.mouse.click(start.x, start.y);
        await page.waitForTimeout(120);
      }
      await page.mouse.move(start.x, start.y);
      await page.mouse.down({ clickCount: doubleFirst ? 2 : 1 });
      for (let step = 1; step <= 12; step += 1) await page.mouse.move(start.x - step * 18, start.y - step * 4);
      await page.mouse.up();
      await page.waitForTimeout(1200);
      const after = await ctx.readCamera(page);
      return {
        before,
        after,
        azimuthDeltaDeg: Number((after.azimuthDeg - before.azimuthDeg).toFixed(2)),
        targetMoveM: Number(Math.hypot(...after.target.map((value, index) => value - before.target[index])).toFixed(3)),
      };
    };
    out.B2 = { home: { singleDrag: await drag(false) } };
    await ctx.gotoHome(page);
    out.B2.home.doubleClickDrag = await drag(true);
    await ctx.shot(page, "B2-home-after-double-drag");
  });

  // ---------- B3：双击、三击后选中的文字 ----------
  await section("B3", async () => {
    const page = await ctx.newPage();
    await ctx.gotoHome(page);
    const probe = async (label, locate) => {
      const point = await locate();
      ctx.log(`B3 ${label}: ${point ? `${Math.round(point.x)},${Math.round(point.y)}` : "不存在"}`);
      if (!point) return { label, present: false };
      const read = () => page.evaluate(() => window.getSelection()?.toString() ?? "");
      const clear = () => page.evaluate(() => window.getSelection()?.removeAllRanges());
      await clear();
      await page.mouse.dblclick(point.x, point.y);
      await page.waitForTimeout(150);
      const dbl = await read();
      await clear();
      await page.mouse.click(point.x, point.y, { clickCount: 3 });
      await page.waitForTimeout(150);
      const triple = await read();
      await clear();
      return { label, present: true, point, doubleClick: dbl, tripleClick: triple };
    };
    const centerOf = (selector) => async () => {
      const locator = page.locator(selector).first();
      if (!(await locator.count()) || !(await locator.isVisible())) return null;
      const box = await locator.boundingBox();
      return box && { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    };
    out.B3 = [];
    out.B3.push(await probe("3D 区域空白处", async () => ({ x: 1290, y: 740 })));
    out.B3.push(await probe("标题", centerOf(".scene-title")));
    out.B3.push(await probe("数据卡片", centerOf(".home-dashboard-card")));
    out.B3.push(await probe("天气预报条目", centerOf(".weather-forecast-item")));
    for (const [tab, selector, label] of [
      ["照明", ".mijia-room-badge", "房间标签（照明）"],
      ["环境", ".mijia-room-badge", "房间标签（环境）"],
      ["环境", ".scene-device-status-chip", "设备状态标签（环境）"],
      ["安防", ".scene-device-status-chip", "设备状态标签（安防）"],
    ]) {
      await page.locator(".mijia-mode-tabs button", { hasText: tab }).first().click({ force: true, timeout: 5000 });
      await page.waitForTimeout(1500);
      out.B3.push(await probe(label, centerOf(selector)));
    }
    // 拖动选择：从 3D 区域按下、拖过标题和标签（模拟旋转模型时划过文字）
    const dragSelect = async (label, from, to) => {
      await page.evaluate(() => window.getSelection()?.removeAllRanges());
      await page.mouse.move(from.x, from.y);
      await page.mouse.down();
      for (let step = 1; step <= 10; step += 1) await page.mouse.move(from.x + ((to.x - from.x) * step) / 10, from.y + ((to.y - from.y) * step) / 10);
      await page.mouse.up();
      await page.waitForTimeout(200);
      const selected = await page.evaluate(() => window.getSelection()?.toString() ?? "");
      return { label, drag: true, from, to, selected };
    };
    const badge = await centerOf(".mijia-room-badge")();
    out.B3.push(await dragSelect("从标题左侧拖过标题", { x: 20, y: 60 }, { x: 420, y: 60 }));
    if (badge) out.B3.push(await dragSelect("从 3D 区域拖过房间标签", { x: badge.x - 120, y: badge.y + 40 }, { x: badge.x + 120, y: badge.y }));
    await ctx.shot(page, "B3-after-clicks");
    // 编辑器 3D 视图里的房间标签（drei Html）
    await ctx.gotoEditor(page, { view: "3d" });
    const editorLabel = await centerOf(".room-label-3d")();
    out.B3.push(await probe("编辑器 3D 房间标签", async () => editorLabel));
    if (editorLabel) out.B3.push(await dragSelect("编辑器 3D 拖过房间标签", { x: editorLabel.x - 100, y: editorLabel.y + 30 }, { x: editorLabel.x + 100, y: editorLabel.y - 10 }));
    await ctx.shot(page, "B3-editor-3d");
  });

  // ---------- B4：编辑器选中灯、开关、传感器时旋转输入框的数量 ----------
  await section("B4", async () => {
    const page = await ctx.newPage();
    await ctx.gotoEditor(page, { view: "2d" });
    out.B4 = {};
    for (const domain of ["light", "switch", "sensor"]) {
      const device = floor.devices.find((item) => item.entityId.startsWith(`${domain}.`));
      if (!device) {
        out.B4[domain] = { present: false };
        continue;
      }
      const title = entityById.get(device.entityId)?.name ?? device.entityId;
      ctx.log(`B4 ${domain}: ${title}`);
      const marker = page
        .locator("g.plan-device")
        .filter({ has: page.locator(`title`, { hasText: title }) })
        .first();
      await marker.dispatchEvent("click");
      await page.waitForTimeout(600);
      const rotationInputs = await page.getByText("水平旋转", { exact: true }).count();
      const file = await ctx.shot(page, `B4-editor-${domain}`);
      out.B4[domain] = { present: true, entityId: device.entityId, modelId: device.modelId ?? null, rotationInputs, screenshot: path.basename(file.path) };
    }
  });

  // ---------- B5：奶油风格下各弹窗的 axe color-contrast ----------
  await section("B5", async () => {
    out.B5 = {};
    const page = await ctx.newPage();
    const openDock = async () => {
      if (!(await page.locator(".corner-dock-menu button").first().isVisible())) await page.locator(".corner-dock-toggle").click();
      await page.waitForTimeout(300);
    };
    const dialogs = [
      ["设置面板（页面工具菜单）", ".corner-dock-menu", async () => openDock()],
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
          const device = floor.devices.find((item) => item.entityId.startsWith("light.")) ?? floor.devices[0];
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
    for (const [name, selector, open] of dialogs) {
      ctx.log(`B5 ${name}`);
      await ctx.gotoHome(page, { style: "cream", settleMs: 1200 });
      try {
        await open();
        await page.waitForTimeout(1800);
        // 任一匹配元素在视口内有尺寸且 visibility 不是 hidden 即视为已打开
        const visible = await page.evaluate((selector) => [...document.querySelectorAll(selector)].some((el) => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && rect.left < window.innerWidth && getComputedStyle(el).visibility !== "hidden";
        }), selector);
        const file = await ctx.shot(page, `B5-cream-${name.replace(/[（）\s]/g, "")}`);
        out.B5[name] = visible
          ? { selector, ...(await ctx.axeContrast(page, selector)), screenshot: path.basename(file.path) }
          : { selector, visible: false, screenshot: path.basename(file.path) };
      } catch (error) {
        out.B5[name] = { selector, error: String(error?.message ?? error).split("\n")[0] };
      }
    }
  });

  // ---------- B6：JS 字节数、hls.js、空闲帧数、draw call、低端默认画质 ----------
  await section("B6", async () => {
    out.B6 = { idleFrames5s: {}, drawCalls: {} };
    const page = await ctx.newPage();
    await ctx.gotoHome(page);
    const resources = await page.evaluate(() =>
      performance.getEntriesByType("resource").map((entry) => ({ name: entry.name, size: entry.decodedBodySize, transfer: entry.transferSize })),
    );
    const js = resources.filter((entry) => /\.js(\?|$)/.test(entry.name));
    out.B6.homeJsBytes = js.reduce((sum, entry) => sum + entry.size, 0);
    out.B6.homeJsFiles = js.map((entry) => ({ file: new URL(entry.name).pathname, bytes: entry.size }));
    out.B6.homeRequestedHls = js.some((entry) => entry.name.includes("hls"));
    for (const quality of QUALITIES) {
      await ctx.gotoHome(page, { quality, settleMs: 3000 });
      ctx.log(`B6 ${quality} 已加载`);
      out.B6.idleFrames5s[quality] = await ctx.countFrames(page, 5000);
      ctx.log(`B6 ${quality} 帧数 ${out.B6.idleFrames5s[quality]}`);
      if (quality === "eco" || quality === "high") out.B6.drawCalls[quality] = await ctx.drawCallsPerFrame(page);
    }
    const editorPage = await ctx.newPage();
    await ctx.gotoEditor(editorPage, { view: "2d", settleMs: 800 });
    out.B6.editorRequestedHls = editorPage.ha3dResponses.some((item) => item.url.includes("hls"));
    const lowEnd = await ctx.newPage({ lowEnd: true });
    await ctx.gotoHome(lowEnd, { prefs: { "ha3d.home.sceneQuality": null } });
    out.B6.lowEndDefaultQuality = await lowEnd.evaluate(
      () => /render-quality-(\w+)/.exec(document.querySelector(".home-workspace")?.className ?? "")?.[1] ?? null,
    );
    out.B6.lowEndNavigator = await lowEnd.evaluate(() => ({ hardwareConcurrency: navigator.hardwareConcurrency, deviceMemory: navigator.deviceMemory }));
  });

  // ---------- B7：导出接口 curl 矩阵和 UI 导出 ----------
  await section("B7", async () => {
    const projectId = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project.id;
    out.B7 = { matrix: await exportMatrix(ctx.stack.appUrl, projectId) };
    const page = await ctx.newPage();
    const result = await uiExport(ctx, page);
    await ctx.shot(page, "B7-ui-export");
    out.B7.ui = { requests: result.requests, downloaded: Boolean(result.download), errorText: result.errorText };
  });

  // 只重跑部分小节（HA3D_BASELINE_ONLY）时，合并进已有的 baseline.json
  const file = path.join(ctx.dir, "baseline.json");
  if (only) {
    const previous = await readFile(file, "utf8").then(JSON.parse).catch(() => ({}));
    Object.assign(out, { ...previous, ...out, errors: { ...Object.fromEntries(Object.entries(previous.errors ?? {}).filter(([key]) => !only.includes(key))), ...out.errors } });
  }
  await ctx.writeJson(file, out);
  return { errors: out.errors, B4: out.B4, B7: out.B7, B8: out.B8 };
}
