// F6 宠物（plan.md 第 3 节）：设置为小猫、小狗各跑一次，20 秒内每 2 秒读一次 ha3d-pet 的位置（楼层局部坐标 = 平面坐标），
// 至少 3 个不同位置，全部落在某个房间多边形内、不在任何家具占地矩形内；宠物不参与拾取、点击不会选中设备；
// 体长、截图和视频；prefers-reduced-motion 时原地坐着；设置面板切换和 localStorage。
import path from "node:path";

const PET_KEY = "ha3d.home.pet";
const NOON = "2026-06-01T12:00:00";
const QUALITY = "smooth";
const round = (value, digits = 3) => Number(Number(value).toFixed(digits));

function pointInPolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function segmentDistance([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const t = dx || dy ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))) : 0;
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
/** 在某个房间多边形内（正好落在两个房间的公共边上时允许 2 cm 误差）。 */
function roomOf(point, rooms) {
  const inside = rooms.find((room) => pointInPolygon(point, room.polygon));
  if (inside) return inside.id;
  const near = rooms.find((room) => room.polygon.some((vertex, index) => segmentDistance(point, vertex, room.polygon[(index + 1) % room.polygon.length]) <= 0.02));
  return near ? `${near.id}(边上)` : null;
}
/** 落在哪件家具的旋转矩形内（与 3D 渲染一致：group 位置 (x, 0, y)，rotation.y = −rotation）。 */
function furnitureAt([x, y], furniture) {
  return (
    furniture.find((item) => {
      const dx = x - item.position[0];
      const dy = y - item.position[1];
      const c = Math.cos(item.rotation || 0);
      const s = Math.sin(item.rotation || 0);
      return Math.abs(dx * c + dy * s) <= item.width / 2 && Math.abs(-dx * s + dy * c) <= item.depth / 2;
    })?.id ?? null
  );
}

/** ha3d-pet 的局部坐标、朝向、所在楼层，以及转正后的包围盒尺寸和“射线能否打中宠物”。 */
const readPet = (page) =>
  page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    let pet;
    s?.scene.traverse((object) => {
      if (!pet && object.name === "ha3d-pet") pet = object;
    });
    if (!pet) return null;
    const heading = pet.rotation.y;
    pet.rotation.y = 0;
    pet.updateMatrixWorld(true);
    let box;
    let meshCount = 0;
    let raycastDisabled = true;
    pet.traverse((object) => {
      if (!object.isMesh) return;
      meshCount += 1;
      if (object.raycast === Object.getPrototypeOf(object).raycast) raycastDisabled = false;
      // 体长不算尾巴（唯一的圆柱）
      if (object.geometry.type === "CylinderGeometry") return;
      object.geometry.computeBoundingBox();
      const local = object.geometry.boundingBox.clone().applyMatrix4(object.matrixWorld);
      box = box ? box.union(local) : local;
    });
    pet.rotation.y = heading;
    pet.updateMatrixWorld(true);
    const size = box.getSize(box.min.clone());
    // 从相机穿过宠物中心打一条射线：宠物所有网格的 raycast 都是空函数，应当打不中
    const world = pet.getWorldPosition(pet.position.clone());
    world.y += 0.1;
    const ndc = world.clone().project(s.camera);
    const raycaster = new s.raycaster.constructor();
    raycaster.setFromCamera({ x: ndc.x, y: ndc.y }, s.camera);
    const hits = raycaster.intersectObject(pet, true).length;
    const rect = s.gl.domElement.getBoundingClientRect();
    return {
      position: [pet.position.x, pet.position.z],
      heading,
      kind: pet.userData.petKind,
      floorId: pet.userData.floorId,
      size: [size.x, size.y, size.z],
      meshCount,
      raycastDisabled,
      rayHits: hits,
      screen: { x: rect.left + ((ndc.x + 1) / 2) * rect.width, y: rect.top + ((1 - ndc.y) / 2) * rect.height },
      world: [world.x, world.y, world.z],
    };
  });

async function waitPet(ctx, page, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const pet = await readPet(page);
    if (pet) return pet;
    await ctx.sleep(300);
  }
  return null;
}

export default async function pets(ctx) {
  const { check } = ctx;
  // 用页面实际加载的项目（前面的 interaction 套件会在 2D 编辑器里把床、床头柜拖开 1 m 并保存），不用原始项目文件
  const current = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
  const floor = current.floors.find((item) => item.id === ctx.project.floors[0].id) ?? current.floors[0];
  const rooms = floor.rooms.filter((room) => room.polygon?.length >= 3);
  const out = { quality: QUALITY, floorId: floor.id, pets: {}, settings: {}, reducedMotion: {} };

  // ---------- 设置面板：无 / 小猫 / 小狗，写入 localStorage；默认无宠物、不加载宠物代码 ----------
  {
    const page = await ctx.newPage({ startTime: NOON });
    await ctx.gotoHome(page, { quality: QUALITY, prefs: { [PET_KEY]: null } });
    out.settings.defaultPet = await readPet(page);
    out.settings.chunkRequestedByDefault = page.ha3dResponses.some((item) => item.url.includes("ha3dPet.js"));
    if (!(await page.locator(".corner-dock-menu button").first().isVisible())) await page.locator(".corner-dock-toggle").click();
    await page.waitForTimeout(300);
    await page.locator('button[aria-label="3D 设置"]').click();
    const group = page.locator('.home-settings-panel [role="group"][aria-label="宠物"]');
    await group.waitFor({ state: "visible", timeout: 5000 });
    out.settings.options = (await group.getByRole("button").allTextContents()).map((text) => text.trim());
    out.settings.initialPressed = await group.getByRole("button", { name: "无" }).getAttribute("aria-pressed");
    await group.getByRole("button", { name: "小猫" }).click();
    await page.waitForTimeout(300);
    out.settings.stored = await page.evaluate((key) => window.localStorage.getItem(key), PET_KEY);
    await ctx.shot(page, "F6-settings-pet-cat");
    await page.locator('button[aria-label="关闭 3D 设置"]').click();
    const pet = await waitPet(ctx, page);
    out.settings.afterSelect = pet && { kind: pet.kind, floorId: pet.floorId };
    out.settings.chunkRequestedAfterSelect = page.ha3dResponses.some((item) => item.url.includes("ha3dPet.js") && item.status === 200);
    check("F6 默认没有宠物，也不下载 ha3dPet.js", out.settings.defaultPet === null && !out.settings.chunkRequestedByDefault && out.settings.initialPressed === "true", {
      defaultPet: out.settings.defaultPet,
      requested: out.settings.chunkRequestedByDefault,
    });
    check("F6 设置面板「宠物」有 无 / 小猫 / 小狗，选小猫后写入 localStorage 并出现 ha3d-pet（按需加载 ha3dPet.js）", JSON.stringify(out.settings.options) === JSON.stringify(["无", "小猫", "小狗"]) && out.settings.stored === "cat" && out.settings.afterSelect?.kind === "cat" && out.settings.chunkRequestedAfterSelect, out.settings);
    await page.context().close();
  }

  // ---------- 小猫、小狗：20 秒内每 2 秒采样位置 ----------
  for (const kind of ["cat", "dog"]) {
    const page = await ctx.newPage({ startTime: NOON, video: path.join(ctx.dir, ".video-tmp") });
    await ctx.gotoHome(page, { quality: QUALITY, prefs: { [PET_KEY]: kind } });
    const first = await waitPet(ctx, page);
    const record = { samples: [], size: first?.size?.map((value) => round(value)), meshCount: first?.meshCount, floorId: first?.floorId };
    if (!first) {
      check(`F6[${kind}] 场景里出现 ha3d-pet`, false);
      await page.context().close();
      continue;
    }
    for (let index = 0; index <= 10; index += 1) {
      const pet = await readPet(page);
      const position = pet.position.map((value) => round(value));
      record.samples.push({ t: index * 2, position, room: roomOf(position, rooms), furniture: furnitureAt(position, floor.furniture), heading: round(pet.heading, 2) });
      if (index === 3) await ctx.shot(page, `F6-${kind}-overview`);
      if (index < 10) await page.waitForTimeout(2000);
    }
    const last = await readPet(page);
    record.rayHits = last.rayHits;
    record.raycastDisabled = last.raycastDisabled;
    // 特写：宠物一直在动，先把相机移过去，再按它当前的位置补一次对准后立刻截图
    await ctx.focusOn(page, last.world, 3.2, [0.6, 0.95, 0.75]);
    await ctx.focusCamera(page, (await readPet(page)).world, 3.2, { direction: [0.6, 0.95, 0.75] });
    await ctx.shot(page, `F6-${kind}-closeup`);
    // 点击宠物所在位置：不会选中任何设备（宠物不可点击）。点击会穿过宠物打到后面的东西，
    // 所以等宠物走到身后（屏幕上）没有设备的位置再点。小猫到一个点停 2–6 秒，最多等 20 秒；
    // 小狗从 0.2.3 起停 25–45 秒，停在设备前面时要等它走开，最多等 60 秒
    let after;
    const maxWait = kind === "dog" ? 60 : 20;
    for (let attempt = 0; attempt < maxWait; attempt += 1) {
      after = await readPet(page);
      after.deviceBehind = await page.evaluate(({ x, y }) => {
        const s = window.__ha3dDebug.get();
        const rect = s.gl.domElement.getBoundingClientRect();
        const raycaster = new s.raycaster.constructor();
        raycaster.setFromCamera({ x: ((x - rect.left) / rect.width) * 2 - 1, y: -((y - rect.top) / rect.height) * 2 + 1 }, s.camera);
        for (const hit of raycaster.intersectObjects(s.scene.children, true)) {
          for (let node = hit.object; node; node = node.parent) if (node.userData?.focusEntityId) return node.userData.focusEntityId;
        }
        return null;
      }, after.screen);
      if (!after.deviceBehind) break;
      await page.waitForTimeout(1000);
    }
    record.clickDeviceBehind = after.deviceBehind;
    await page.mouse.click(after.screen.x, after.screen.y);
    await page.waitForTimeout(800);
    record.clickSelected = after.deviceBehind ? null : await page.evaluate(() => Boolean(document.querySelector(".home-insight-panel.entity-selected, .home-sidebar.entity-selected")));
    record.errors = page.ha3dErrors.slice(0, 3);
    const file = await ctx.saveVideo(page, path.join(ctx.dir, "videos", `F6-${kind}.webm`));
    record.video = file && path.basename(file);
    const distinct = new Set(record.samples.map((sample) => sample.position.map((value) => value.toFixed(2)).join(",")));
    record.distinctPositions = distinct.size;
    const outside = record.samples.filter((sample) => !sample.room);
    const inFurniture = record.samples.filter((sample) => sample.furniture);
    out.pets[kind] = record;
    const expectedLength = kind === "cat" ? 0.42 : 0.6;
    check(`F6[${kind}] 宠物在当前楼层（${floor.id}），体长约 ${expectedLength} m`, record.floorId === floor.id && Math.abs(record.size[2] - expectedLength) <= 0.08 * expectedLength + 0.03, { size: record.size, floorId: record.floorId });
    check(`F6[${kind}] 20 秒内至少 3 个不同位置`, distinct.size >= 3, { distinct: distinct.size, rooms: [...new Set(record.samples.map((sample) => sample.room))] });
    check(`F6[${kind}] 所有位置都在房间多边形内`, outside.length === 0, outside.length ? outside : record.samples.map((sample) => sample.room));
    check(`F6[${kind}] 所有位置都不在家具占地矩形内`, inFurniture.length === 0, inFurniture);
    check(`F6[${kind}] 不可点击：所有网格 raycast 为空函数，射线打不中，点击后没有选中设备`, record.raycastDisabled && record.rayHits === 0 && record.clickSelected === false, {
      raycastDisabled: record.raycastDisabled,
      rayHits: record.rayHits,
      clickSelected: record.clickSelected,
      deviceBehind: record.clickDeviceBehind,
    });
    check(`F6[${kind}] 有视频，没有 pageerror`, Boolean(record.video) && record.errors.length === 0, { video: record.video, errors: record.errors });
  }

  // ---------- 跨房间路线：每一对门连通的房间都能走通，路线经过门中心，沿途（每 5 cm）都在房间内、不碰家具 ----------
  {
    const page = await ctx.newPage({ startTime: NOON });
    await ctx.gotoHome(page, { quality: QUALITY, prefs: { [PET_KEY]: "cat" } });
    await waitPet(ctx, page);
    const result = await page.evaluate(async (floor) => {
      const m = await import("/assets/ha3dPet.js");
      const nav = m.ha3dPetNav(floor);
      const links = [];
      nav.links.forEach((list, from) => list.forEach((link) => links.push({ from, to: link.to, at: link.at })));
      const pick = (room) => {
        for (let attempt = 0; attempt < 20; attempt += 1) {
          const point = m.ha3dPetSample(nav, room);
          if (point) return point;
        }
        return null;
      };
      const routes = links.map((link) => {
        const start = pick(link.from);
        const end = pick(link.to);
        return { ...link, start, end, path: start && end ? m.ha3dPetPathTo(nav, { room: link.from, pos: start }, link.to, end) : null };
      });
      return { cells: nav.walk.length, walkable: nav.walk.filter((value) => value >= 0).length, routes };
    }, floor);
    out.routes = { cells: result.cells, walkable: result.walkable, items: [] };
    for (const route of result.routes) {
      const points = route.path ? [route.start, ...route.path] : [];
      const bad = [];
      let doorDistance = Infinity;
      for (let index = 0; index + 1 < points.length; index += 1) {
        const [a, b] = [points[index], points[index + 1]];
        const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.05));
        for (let step = 0; step <= steps; step += 1) {
          const point = [a[0] + ((b[0] - a[0]) * step) / steps, a[1] + ((b[1] - a[1]) * step) / steps];
          doorDistance = Math.min(doorDistance, Math.hypot(point[0] - route.at[0], point[1] - route.at[1]));
          if (!roomOf(point, rooms) || furnitureAt(point, floor.furniture)) bad.push(point.map((value) => round(value, 2)));
        }
      }
      out.routes.items.push({ from: rooms[route.from]?.id, to: rooms[route.to]?.id, door: route.at.map((value) => round(value, 2)), waypoints: route.path?.length ?? 0, doorDistance: round(doorDistance, 2), bad: bad.slice(0, 5) });
    }
    const items = out.routes.items;
    check("F6 有按门连通的房间对", items.length > 0, { pairs: items.map((item) => `${item.from}→${item.to}`) });
    check("F6 每一对门连通的房间都能规划出路线，并经过门中心（≤ 0.25 m）", items.length > 0 && items.every((item) => item.waypoints > 0 && item.doorDistance <= 0.25), items.map((item) => ({ pair: `${item.from}→${item.to}`, waypoints: item.waypoints, doorDistance: item.doorDistance })));
    check("F6 跨房间路线沿途都在房间多边形内、不穿过家具", items.every((item) => item.bad.length === 0), items.filter((item) => item.bad.length));
    await page.context().close();
  }

  // ---------- prefers-reduced-motion：原地坐着 ----------
  {
    const page = await ctx.newPage({ startTime: NOON, reducedMotion: true });
    await ctx.gotoHome(page, { quality: QUALITY, prefs: { [PET_KEY]: "cat" } });
    await waitPet(ctx, page);
    const positions = [];
    for (let index = 0; index < 3; index += 1) {
      positions.push((await readPet(page)).position.map((value) => round(value)));
      await page.waitForTimeout(2000);
    }
    out.reducedMotion.positions = positions;
    await ctx.shot(page, "F6-reduced-motion-sitting");
    await ctx.focusOn(page, (await readPet(page)).world, 2.4, [0.6, 0.95, 0.75]);
    await ctx.shot(page, "F6-reduced-motion-sitting-closeup");
    check("F6 prefers-reduced-motion 时宠物原地不动", positions.every((position) => position.join() === positions[0].join()), positions);
    await page.context().close();
  }

  await ctx.writeJson(path.join(ctx.dir, "pets.json"), out);
  return { cat: out.pets.cat && { distinct: out.pets.cat.distinctPositions, size: out.pets.cat.size }, dog: out.pets.dog && { distinct: out.pets.dog.distinctPositions, size: out.pets.dog.size } };
}
