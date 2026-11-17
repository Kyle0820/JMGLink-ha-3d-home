// 编辑器套件（plan.md 第 3 节）：F1 入户门、F5 新家具、F7/F8 模型选项、B4 设备水平旋转。
// 编辑结果通过 GET /api/projects/current 验证，再切到编辑器 3D 视图检查对应的 3D 对象。
import path from "node:path";

const NEW_FURNITURE = [
  ["fridge", "冰箱"],
  ["toilet", "马桶"],
  ["bathroom_cabinet", "浴室柜"],
  ["chest_of_drawers", "斗柜"],
  ["dog_crate", "狗笼子"],
];
const HALF_PI = Math.PI / 2;
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isStrip = (modelId) => (modelId ?? "").includes("strip");
const near = (value, expected, tolerance = 0.01) => typeof value === "number" && Math.abs(value - expected) <= tolerance;
const round = (value, digits = 3) => Number(Number(value).toFixed(digits));

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

async function showView(ctx, page, view) {
  if (view === "3d") await page.evaluate(() => (window.__ha3dDebug = undefined));
  await page.locator(".view-switch button", { hasText: view === "3d" ? "3D" : "2D" }).click();
  if (view === "3d") {
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await ctx.waitForScene(page, { requireDevices: false });
  } else {
    await page.waitForSelector("svg.floorplan-canvas", { timeout: 30_000 });
    await ctx.sleep(800);
  }
}

/** 平面坐标（米）→ 页面坐标；onCanvas 表示该点最上层元素在平面图 svg 里（没被面板挡住）。 */
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

function pointInPolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function segmentDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lengthSq = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lengthSq));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

function furnitureDistance(p, item) {
  const ox = p[0] - item.position[0];
  const oy = p[1] - item.position[1];
  const c = Math.cos(item.rotation ?? 0);
  const s = Math.sin(item.rotation ?? 0);
  const lx = ox * c + oy * s;
  const ly = -ox * s + oy * c;
  return Math.hypot(Math.max(0, Math.abs(lx) - item.width / 2), Math.max(0, Math.abs(ly) - item.depth / 2));
}

/** 房间里离墙、设备、家具、门窗都足够远的空位，按空旷程度从大到小排列。 */
function freeSpots(floor) {
  const devicePoints = floor.devices.flatMap((device) => [
    [device.position[0], device.position[2]],
    ...(device.controlledLightFixtures ?? []).map((fixture) => [fixture.position[0], fixture.position[2]]),
  ]);
  const openingPoints = floor.openings.flatMap((opening) => {
    const wall = floor.walls.find((item) => item.id === opening.wallId);
    if (!wall) return [];
    const length = Math.hypot(wall.end[0] - wall.start[0], wall.end[1] - wall.start[1]) || 1;
    return [[wall.start[0] + ((wall.end[0] - wall.start[0]) / length) * opening.offset, wall.start[1] + ((wall.end[1] - wall.start[1]) / length) * opening.offset]];
  });
  const spots = [];
  for (const room of floor.rooms) {
    const xs = room.polygon.map(([x]) => x);
    const ys = room.polygon.map(([, y]) => y);
    for (let x = Math.min(...xs) + 0.25; x < Math.max(...xs); x += 0.25)
      for (let y = Math.min(...ys) + 0.25; y < Math.max(...ys); y += 0.25) {
        const p = [Number(x.toFixed(2)), Number(y.toFixed(2))];
        if (!pointInPolygon(p, room.polygon)) continue;
        const clearance = Math.min(
          ...floor.walls.map((wall) => segmentDistance(p, wall.start, wall.end) - 0.15),
          ...devicePoints.map((point) => Math.hypot(p[0] - point[0], p[1] - point[1]) - 0.3),
          ...floor.furniture.map((item) => furnitureDistance(p, item)),
          ...openingPoints.map((point) => Math.hypot(p[0] - point[0], p[1] - point[1]) - 0.6),
        );
        if (clearance >= 0.45) spots.push({ point: p, roomId: room.id, clearance });
      }
  }
  return spots.sort((a, b) => b.clearance - a.clearance);
}

/** 平面图里某个设备的标记（按 <title> 精确匹配实体名，排除开关控制的灯位）。 */
const deviceMarker = (page, name) =>
  page
    .locator("g.plan-device:not(.switch-light-fixture)")
    .filter({ has: page.locator("title", { hasText: new RegExp(`^${escapeRegExp(name)}$`) }) })
    .first();

async function selectDevice(page, name) {
  const marker = deviceMarker(page, name);
  await marker.dispatchEvent("click");
  await page.waitForTimeout(700);
  return marker;
}

/** 标记内第一层 <g> 的 rotate(角度)。 */
async function markerRotation(marker) {
  const transform = (await marker.locator(":scope > g").first().getAttribute("transform")) ?? "";
  const match = /rotate\(([-\d.e]+)\)/.exec(transform);
  return match ? Number(match[1]) : 0;
}

const rotationInputs = (page) => page.getByText("水平旋转", { exact: true });
const rotationInput = (page) => page.locator(".property-section", { has: page.locator("h3", { hasText: /^朝向$/ }) }).locator('input[type="number"]');
const modelOptions = (page) => page.locator(".device-model-property .device-model-grid button strong").allInnerTexts();

/** 3D 场景里某个实体的设备组（userData.focusEntityId）的 rotation.y 和世界坐标。 */
async function deviceGroup3d(page, entityId) {
  return page.evaluate((entityId) => {
    const s = window.__ha3dDebug?.get();
    if (!s) return null;
    s.scene.updateMatrixWorld(true);
    let found = null;
    s.scene.traverse((o) => {
      if (!found && o.userData?.focusEntityId === entityId) found = o;
    });
    if (!found) return null;
    const world = found.getWorldPosition(found.position.clone());
    return { rotationY: found.rotation.y, world: [world.x, world.y, world.z] };
  }, entityId);
}

/**
 * 编辑器 3D 的相机由预设机位（透视/顶视/正视）驱动，focusCamera 设置的机位会被拉回预设，
 * 所以这里切换预设、等相机停稳，再按对象的投影位置裁一块截图。
 */
async function presetShotAround(ctx, page, preset, world, name, half = 150) {
  // 房间名标签（drei Html）会盖住房间中央的灯具，截图时临时隐藏
  if (!page.ha3dLabelsHidden) {
    await page.addStyleTag({ content: ".room-label-3d { visibility: hidden !important; }" });
    page.ha3dLabelsHidden = true;
  }
  await page.locator(".three-view-toolbar button", { hasText: preset }).click();
  let previous;
  for (let index = 0; index < 24; index += 1) {
    await ctx.sleep(350);
    const camera = await ctx.readCamera(page);
    if (previous && Math.hypot(...camera.position.map((value, axis) => value - previous.position[axis])) < 0.001) break;
    previous = camera;
  }
  const point = await ctx.projectToScreen(page, world);
  const viewport = page.viewportSize();
  const x = Math.max(0, Math.min(viewport.width - half * 2, point.x - half));
  const y = Math.max(0, Math.min(viewport.height - half * 2, point.y - half));
  const file = await ctx.shot(page, name, { clip: { x, y, width: half * 2, height: half * 2 } });
  return { screenshot: path.basename(file.path), point: { x: round(point.x, 1), y: round(point.y, 1), onCanvas: point.onCanvas } };
}

async function named3d(page, name) {
  return page.evaluate((name) => {
    const s = window.__ha3dDebug?.get();
    if (!s) return [];
    s.scene.updateMatrixWorld(true);
    const out = [];
    s.scene.traverse((o) => {
      if (o.name !== name) return;
      const world = o.getWorldPosition(o.position.clone());
      out.push({ userData: { ...o.userData }, world: [world.x, world.y, world.z] });
    });
    return out;
  }, name);
}

export default async function editor(ctx) {
  const { check, log } = ctx;
  const original = await fetchProject(ctx);
  const floor = original.floors[0];
  const entities = await (await fetch(`${ctx.stack.appUrl}/api/ha/entities`)).json().then((body) => body.entities);
  const nameOf = (entityId) => entities.find((entity) => entity.entityId === entityId)?.name ?? entityId;
  const out = { B4: {}, F1: {}, F5: {}, F7: {}, F8: {} };

  const page = await ctx.newPage();
  await ctx.gotoEditor(page, { view: "2d" });

  // 选中要测试的设备：矩形平板灯优先（转 90° 在 3D 里最明显）
  const lights = floor.devices.filter((device) => device.entityId.startsWith("light.") && device.modelId && !isStrip(device.modelId));
  const light = lights.find((device) => device.modelId === "light.ceiling_panel") ?? lights[0];
  const switchDevice = floor.devices.find((device) => device.entityId.startsWith("switch.") && !isStrip(device.modelId));
  const sensor = floor.devices.find((device) => device.entityId.startsWith("sensor."));
  const strip = floor.devices.find((device) => isStrip(device.modelId));
  const cover = floor.devices.find((device) => device.entityId.startsWith("cover."));
  const fixtureSwitch = floor.devices.find((device) => device.entityId.startsWith("switch.") && device.controlledLightFixtures?.some((fixture) => !isStrip(fixture.modelId)));

  // ---------- B4 修复前对照：3D 里灯的原始朝向 ----------
  if (light) {
    await showView(ctx, page, "3d");
    const group = await deviceGroup3d(page, light.entityId);
    if (group) {
      out.B4.before3dShot = await presetShotAround(ctx, page, "顶视", group.world, "B4-editor-3d-light-before", 110);
    }
    out.B4.before3d = group && { rotationY: round(group.rotationY) };
    out.B4.editorHalos = await named3d(page, "ha3d-light-halo").then((items) => items.length);
    check("F2 编辑器 3D 视图不画光晕（不遮挡灯具朝向）", out.B4.editorHalos === 0, { halos: out.B4.editorHalos });
    await showView(ctx, page, "2d");
  }

  // ---------- F7 / F8：模型选项里有「电脑」「晾衣架」 ----------
  if (switchDevice) {
    await selectDevice(page, nameOf(switchDevice.entityId));
    const options = await modelOptions(page);
    out.F7.options = options;
    await ctx.shot(page, "F7-model-options");
    check("F7 开关设备的模型选项里有「电脑」", options.some((text) => text.startsWith("电脑")), options);
  } else out.F7.skipped = "项目里没有开关设备";
  if (cover) {
    await selectDevice(page, nameOf(cover.entityId));
    const options = await modelOptions(page);
    out.F8.options = options;
    await ctx.shot(page, "F8-model-options");
    check("F8 窗帘设备的模型选项里有「晾衣架」", options.some((text) => text.startsWith("晾衣架")), options);
  } else out.F8.skipped = "项目里没有窗帘设备";

  // ---------- B4：灯、开关、传感器都有「水平旋转」，输入 90 ----------
  const rotated = [];
  for (const [label, device] of [
    ["light", light],
    ["switch", switchDevice],
    ["sensor", sensor],
  ]) {
    if (!device) {
      out.B4[label] = { present: false };
      continue;
    }
    const marker = await selectDevice(page, nameOf(device.entityId));
    const count = await rotationInputs(page).count();
    const record = { entityId: device.entityId, modelId: device.modelId ?? null, rotationInputs: count };
    out.B4[label] = record;
    check(`B4 选中${label}（${device.modelId ?? "自动"}）时有「水平旋转」输入框`, count === 1, record);
    if (!count) continue;
    await rotationInput(page).fill("90");
    await page.waitForTimeout(500);
    record.iconRotation = round(await markerRotation(marker), 2);
    check(`B4 ${label} 的 2D 图标跟着旋转到 90°`, near(record.iconRotation, 90, 0.05), record);
    const box = await marker.boundingBox();
    if (box) record.screenshot = path.basename((await ctx.shot(page, `B4-editor-2d-${label}`, { clip: { x: Math.max(0, box.x - 160), y: Math.max(0, box.y - 120), width: 320 + box.width, height: 240 + box.height } })).path);
    rotated.push(device);
  }
  if (strip) {
    await selectDevice(page, nameOf(strip.entityId));
    out.B4.strip = { entityId: strip.entityId, rotationInputs: await rotationInputs(page).count() };
    check("B4 灯带不显示「水平旋转」", out.B4.strip.rotationInputs === 0, out.B4.strip);
  } else out.B4.strip = { present: false };

  // 开关控制的普通灯具：灯位列表里有水平旋转输入框（处理函数 Vo）
  let rotatedFixture;
  if (fixtureSwitch) {
    await selectDevice(page, nameOf(fixtureSwitch.entityId));
    const fixture = fixtureSwitch.controlledLightFixtures.find((item) => !isStrip(item.modelId));
    const input = page.locator(`input[aria-label="${fixture.label ?? "灯具 1"}水平旋转"]`);
    const count = await input.count();
    out.B4.fixture = { switchEntityId: fixtureSwitch.entityId, fixtureId: fixture.id, inputs: count };
    check("B4 开关控制的灯具有水平旋转输入框", count === 1, out.B4.fixture);
    if (count) {
      await input.fill("90");
      await page.waitForTimeout(500);
      const glyph = page.locator("g.plan-device.switch-light-fixture").filter({ has: page.locator("title", { hasText: `· ${fixture.label}` }) }).first();
      out.B4.fixture.iconRotation = round(await markerRotation(glyph), 2);
      check("B4 开关控制灯具的 2D 图标跟着旋转到 90°", near(out.B4.fixture.iconRotation, 90, 0.05), out.B4.fixture);
      rotatedFixture = { switchId: fixtureSwitch.id, fixtureId: fixture.id };
    }
  }
  if (rotated.length || rotatedFixture) {
    const saved = await saveAndWait(ctx, page, (project) => {
      const devices = project.floors[0].devices;
      const devicesOk = rotated.every((device) => near(devices.find((item) => item.id === device.id)?.rotation?.[1], -HALF_PI));
      const fixtureOk = !rotatedFixture || near(devices.find((item) => item.id === rotatedFixture.switchId)?.controlledLightFixtures?.find((item) => item.id === rotatedFixture.fixtureId)?.rotation?.[1], -HALF_PI);
      return devicesOk && fixtureOk;
    });
    const devices = saved.project.floors[0].devices;
    out.B4.saved = Object.fromEntries(rotated.map((device) => [device.entityId, devices.find((item) => item.id === device.id)?.rotation]));
    if (rotatedFixture) out.B4.saved.fixture = devices.find((item) => item.id === rotatedFixture.switchId)?.controlledLightFixtures?.find((item) => item.id === rotatedFixture.fixtureId)?.rotation;
    check("B4 保存后 rotation[1] ≈ -π/2", saved.ok, out.B4.saved);
  }

  // ---------- F1：选一扇单开门改成入户门 ----------
  const doorIndex = (() => {
    const candidates = floor.openings.map((opening, index) => ({ opening, index })).filter(({ opening }) => opening.type === "door" && opening.hasLeaf !== false && (opening.doorStyle ?? "single") === "single");
    return (candidates.find(({ opening }) => !opening.entityId) ?? candidates[0])?.index;
  })();
  let entranceDoor;
  if (doorIndex !== undefined) {
    entranceDoor = floor.openings[doorIndex];
    const openingMarker = page.locator("g.plan-opening").nth(doorIndex);
    await openingMarker.dispatchEvent("click");
    await page.waitForTimeout(600);
    const button = page.locator(".option-grid button", { hasText: /^入户门$/ });
    out.F1.buttonPresent = (await button.count()) === 1;
    check("F1 门模型样式里有「入户门」", out.F1.buttonPresent, { openingId: entranceDoor.id });
    if (out.F1.buttonPresent) {
      await button.click();
      await page.waitForTimeout(500);
      out.F1.active = (await button.getAttribute("class"))?.includes("active") ?? false;
      out.F1.flipEnabled = await page.locator(".flip-opening-button").isEnabled();
      out.F1.symbol = { threshold: await openingMarker.locator(".door-threshold").count(), entranceLeaf: await openingMarker.locator(".door-leaf-entrance").count() };
      check("F1 入户门可以翻转（翻转按钮可用）", out.F1.flipEnabled, out.F1);
      check("F1 2D 平面图有入户门符号（加粗门扇 + 门槛线）", out.F1.symbol.threshold === 1 && out.F1.symbol.entranceLeaf >= 1, out.F1.symbol);
      const box = await openingMarker.boundingBox();
      if (box) await ctx.shot(page, "F1-editor-2d-entrance", { clip: { x: Math.max(0, box.x - 200), y: Math.max(0, box.y - 160), width: box.width + 400, height: box.height + 320 } });
      await ctx.shot(page, "F1-editor-2d");
      const saved = await saveAndWait(ctx, page, (project) => project.floors[0].openings.find((item) => item.id === entranceDoor.id)?.doorStyle === "entrance");
      out.F1.savedDoorStyle = saved.project.floors[0].openings.find((item) => item.id === entranceDoor.id)?.doorStyle;
      check("F1 保存后 doorStyle === \"entrance\"", saved.ok, { openingId: entranceDoor.id, doorStyle: out.F1.savedDoorStyle });
    }
  } else out.F1.skipped = "项目里没有单开门";

  // ---------- F5：家具库里有 5 种新家具，逐个放置并保存 ----------
  await page.locator('button[aria-label="放置：家具"]').click();
  await page.waitForTimeout(600);
  const library = page.locator(".furniture-library-grid button:visible");
  const libraryLabels = await library.locator("strong").allInnerTexts();
  out.F5.library = libraryLabels;
  await ctx.shot(page, "F5-furniture-library");
  check("F5 家具库里有冰箱、马桶、浴室柜、斗柜、狗笼子", NEW_FURNITURE.every(([, label]) => libraryLabels.includes(label)), libraryLabels);
  const spots = freeSpots(floor);
  const used = [];
  out.F5.placed = [];
  for (const [kind, label] of NEW_FURNITURE) {
    // 放下一件家具后会选中它并打开属性面板，家具库随之收起；重新点工具栏的「家具」打开
    const entry = library.filter({ has: page.locator("strong", { hasText: new RegExp(`^${label}$`) }) }).first();
    if (!(await entry.isVisible().catch(() => false))) {
      await page.locator('button[aria-label="放置：家具"]').click();
      await page.waitForTimeout(500);
    }
    await entry.click();
    await page.waitForTimeout(300);
    const before = await page.locator(`rect.furniture-footprint.${kind}`).count();
    let placedAt;
    for (const spot of spots) {
      if (used.some((point) => Math.hypot(point[0] - spot.point[0], point[1] - spot.point[1]) < 1.2)) continue;
      const screen = await planToScreen(page, spot.point);
      if (!screen?.onCanvas) continue;
      await page.mouse.click(screen.x, screen.y);
      await page.waitForTimeout(500);
      if ((await page.locator(`rect.furniture-footprint.${kind}`).count()) > before) {
        placedAt = spot;
        used.push(spot.point);
        break;
      }
    }
    out.F5.placed.push({ kind, point: placedAt?.point ?? null, roomId: placedAt?.roomId ?? null });
    check(`F5 在平面图里放置了${label}（${kind}）`, Boolean(placedAt), placedAt?.point);
  }
  await ctx.shot(page, "F5-editor-2d");
  const originalIds = new Set(floor.furniture.map((item) => item.id));
  const savedFurniture = await saveAndWait(ctx, page, (project) => {
    const added = project.floors[0].furniture.filter((item) => !originalIds.has(item.id));
    return NEW_FURNITURE.every(([kind]) => added.some((item) => item.kind === kind));
  });
  const added = savedFurniture.project.floors[0].furniture.filter((item) => !originalIds.has(item.id));
  out.F5.saved = added.map((item) => ({ id: item.id, kind: item.kind, roomId: item.roomId, size: [item.width, item.depth, item.height] }));
  check("F5 保存后项目里新家具的 kind 正确", savedFurniture.ok, out.F5.saved);

  // ---------- 编辑器 3D：旋转、入户门、新家具 ----------
  // 切回选择工具，收起家具库，免得挡住 3D 画面
  await page.locator('button[aria-label="导航：选择"]').click().catch(() => undefined);
  await showView(ctx, page, "3d");
  for (const device of rotated) {
    const group = await deviceGroup3d(page, device.entityId);
    out.B4[`${device.entityId}-3d`] = group && { rotationY: round(group.rotationY) };
    check(`B4 3D 里 ${device.entityId} 的 rotation.y ≈ -π/2`, group && near(group.rotationY, -HALF_PI), out.B4[`${device.entityId}-3d`]);
  }
  if (light && rotated.includes(light)) {
    const group = await deviceGroup3d(page, light.entityId);
    if (group) {
      out.B4.after3dShot = await presetShotAround(ctx, page, "顶视", group.world, "B4-editor-3d-light-after", 110);
    }
  }
  if (entranceDoor && out.F1.savedDoorStyle === "entrance") {
    const leaves = (await named3d(page, "ha3d-door-leaf")).filter((item) => item.userData.openingId === entranceDoor.id);
    out.F1.leaf3d = leaves.map((item) => item.userData);
    check("F1 编辑器 3D 里这扇门的 ha3d-door-leaf.userData.doorStyle === \"entrance\"", leaves.length === 1 && leaves[0].userData.doorStyle === "entrance", out.F1.leaf3d);
    if (leaves[0]) {
      out.F1.editor3dShot = await presetShotAround(ctx, page, "顶视", leaves[0].world, "F1-editor-3d-entrance", 130);
    }
  }
  out.F5.objects3d = {};
  for (const item of added) {
    const objects = (await named3d(page, `ha3d-furniture-${item.kind}`)).filter((object) => object.userData.furnitureId === item.id);
    out.F5.objects3d[item.kind] = objects.length;
    check(`F5 编辑器 3D 里有 ha3d-furniture-${item.kind}`, objects.length === 1, { id: item.id, count: objects.length });
    if (objects[0]) {
      await presetShotAround(ctx, page, "顶视", objects[0].world, `F5-editor-3d-${item.kind}`, 110);
    }
  }

  check("editor 套件没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
  log(`B4：${JSON.stringify(out.B4.saved ?? {})}`);
  await ctx.writeJson(path.join(ctx.dir, "editor.json"), out);
  return out;
}
