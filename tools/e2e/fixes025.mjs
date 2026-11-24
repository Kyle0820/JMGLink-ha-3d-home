// 0.2.5：电视画面显示宠物大头照、入户门绑定门锁（lock）、状态未知的家电实体在编辑器设备库里能选中和绑定。
// 在 fixture 上临时加合成设备和实体（结束后换回原项目）。
// HA3D_FIXES025_BASELINE=1 时只记录不断言（在 master 上采集修复前的基线）；HA3D_FIXES025_ONLY=tv,lock,library 只跑其中几段。
import path from "node:path";
import { PNG } from "pngjs";

const NOON = "2026-06-01T12:00:00";
const BASELINE = process.env.HA3D_FIXES025_BASELINE === "1";
const ONLY = new Set((process.env.HA3D_FIXES025_ONLY || "tv,lock,library").split(",").map((item) => item.trim()));
const TV = "media_player.ha3d_living_tv";
const LOCK = "lock.ha3d_entry_door"; // 只绑在门上，不作为设备放置（和用户的 lock.ha3d_entry_door 一样）
const ENTRY_DOOR = "opening-entry-door";
// 用户 HA 里的家电实体（trigger-based template binary_sensor，HA 重启后到第一次触发前都是 unknown）
const APPLIANCES = [
  { entityId: "binary_sensor.ha3d_washer_running", name: "洗衣机运行", deviceClass: "running", modelId: "binary_sensor.washer", label: "洗衣机" },
  { entityId: "binary_sensor.ha3d_dryer_running", name: "烘干机运行", deviceClass: "running", modelId: "binary_sensor.dryer", label: "烘干机" },
  { entityId: "binary_sensor.ha3d_dishwasher_running", name: "洗碗机运行", deviceClass: "running", modelId: "binary_sensor.dishwasher", label: "洗碗机" },
  { entityId: "binary_sensor.ha3d_sock_washer_running", name: "洗袜子机运行", deviceClass: "running", modelId: "binary_sensor.sock_washer", label: "洗袜机" },
  { entityId: "binary_sensor.ha3d_shower_water", name: "花洒用水", deviceClass: "moisture", modelId: "binary_sensor.shower", label: "花洒" },
  // 没有 device_class、状态 unavailable：按名字认出是家电
  { entityId: "binary_sensor.ha3d_spare_dryer", name: "备用烘干机", deviceClass: null, modelId: "binary_sensor.dryer", label: "烘干机", state: "unavailable" },
];
// 放到平面图里的两个：状态 unknown 的洗衣机、unavailable 的备用烘干机
const PLACE = [
  { entityId: "binary_sensor.ha3d_washer_running", point: [4.6, 5.4] },
  { entityId: "binary_sensor.ha3d_spare_dryer", point: [3.0, 5.2] },
];
const round = (value, digits = 3) => Number(Number(value).toFixed(digits));

function withTv(project) {
  const clone = structuredClone(project);
  const floor = clone.floors[0];
  // 电视放在客厅电视柜（[3.6, 0.3]，高 0.34）上，正面朝 +z（朝向沙发）
  floor.devices = [...floor.devices, { id: "device-ha3d-tv", entityId: TV, kind: "media_player", floorId: floor.id, roomId: "room-living", position: [3.6, 0.46, 0.3], rotation: [0, 0, 0], modelId: "media_player.tv" }];
  return clone;
}

async function fetchProject(ctx) {
  return (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
}

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

function rgbAt(buffer, x, y, r = 4) {
  const png = PNG.sync.read(buffer);
  const sum = [0, 0, 0];
  let count = 0;
  for (let dy = -r; dy <= r; dy += 1)
    for (let dx = -r; dx <= r; dx += 1) {
      const px = Math.round(x + dx);
      const py = Math.round(y + dy);
      if (px < 0 || py < 0 || px >= png.width || py >= png.height) continue;
      const offset = (png.width * py + px) * 4;
      for (let c = 0; c < 3; c += 1) sum[c] += png.data[offset + c];
      count += 1;
    }
  return sum.map((value) => Math.round(value / Math.max(1, count)));
}

/** 电视屏幕：ha3d-tv-screen 是否挂载、userData、贴图中心（脸）和眼睛位置的像素。 */
async function tvReport(page) {
  return page.evaluate((tv) => {
    const s = window.__ha3dDebug?.get();
    if (!s) return null;
    let group = null;
    s.scene.traverse((o) => {
      if (!group && o.userData?.focusEntityId === tv) group = o;
    });
    if (!group) return { found: false };
    const screens = [];
    group.traverse((o) => {
      if (o.name !== "ha3d-tv-screen") return;
      const image = o.material?.map?.image;
      const px = (x, y) => (image?.getContext ? [...image.getContext("2d").getImageData(x, y, 1, 1).data.slice(0, 3)] : null);
      screens.push({ userData: { ...o.userData }, visible: o.visible, size: image ? [image.width, image.height] : null, face: px(256, 110), leftEye: px(256 - 32, 128), catEye: px(256 - 34 - 9, 134) });
    });
    return { found: true, screens };
  }, TV);
}

/** 门锁牌：ha3d-door-lock 的 userData、锁牌灯颜色、入户门门扇的转角。 */
async function lockReport(page) {
  return page.evaluate((doorId) => {
    const s = window.__ha3dDebug?.get();
    if (!s) return null;
    const badges = [];
    const leaves = [];
    s.scene.traverse((o) => {
      if (o.name === "ha3d-door-lock" && o.userData?.openingId === doorId) {
        const lights = [];
        o.traverse((c) => {
          if (c.name === "ha3d-door-lock-light") lights.push(`#${c.material.color.getHexString()}`);
        });
        const world = o.getWorldPosition(o.position.clone());
        badges.push({ userData: { ...o.userData }, lights, world: [world.x, world.y, world.z] });
      }
      if (o.name === "ha3d-door-leaf" && o.userData?.openingId === doorId) leaves.push(Number(o.rotation.y.toFixed(4)));
    });
    return { badges, leaves };
  }, ENTRY_DOOR);
}

async function shotAround(ctx, page, world, name, size = [420, 300]) {
  const screen = await ctx.projectToScreen(page, world);
  const viewport = page.viewportSize();
  const x = Math.max(0, Math.min(viewport.width - size[0], Math.round(screen.x - size[0] / 2)));
  const y = Math.max(0, Math.min(viewport.height - size[1], Math.round(screen.y - size[1] / 2)));
  const full = await ctx.shot(page, `${name}-full`);
  const crop = await ctx.shot(page, name, { clip: { x, y, width: size[0], height: size[1] } });
  return { file: path.basename(crop.path), full: path.basename(full.path), screen, buffer: full.buffer };
}

export default async function fixes025(ctx) {
  const check = (name, ok, detail) => (BASELINE ? ctx.check(`[基线，只记录] ${name}`, true, { ok: Boolean(ok), detail }) : ctx.check(name, ok, detail));
  const out = { baseline: BASELINE, tv: {}, lock: {}, library: {} };
  const current = await fetchProject(ctx);
  const put = (project) => fetch(`${ctx.stack.appUrl}/api/projects/${encodeURIComponent(current.id)}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...project, id: current.id }) });
  try {
    // ---------- 1. 电视画面 ----------
    if (ONLY.has("tv")) {
      if (!(await put(withTv(ctx.project))).ok) throw new Error("保存带电视的项目失败");
      await ctx.mock.set(TV, "off", { friendly_name: "客厅电视", device_class: "tv", supported_features: 152463 });
      const cases = [
        { key: "off-dog", state: "off", pet: "dog", expect: null },
        { key: "on-dog", state: "on", pet: "dog", expect: "dog" },
        { key: "playing-cat", state: "playing", pet: "cat", expect: "cat" },
        { key: "idle-none", state: "idle", pet: "none", expect: "dog" },
        { key: "standby-none", state: "standby", pet: "none", expect: null },
        { key: "unavailable-none", state: "unavailable", pet: "none", expect: null },
      ];
      let page;
      let pet;
      for (const item of cases) {
        if (item.pet !== pet) {
          if (page) await page.context().close();
          page = await ctx.newPage({ startTime: NOON, viewport: { width: 1200, height: 760 } });
          await ctx.mock.set(TV, item.state);
          await ctx.gotoHome(page, { style: "glass", quality: "smooth", prefs: { "ha3d.home.pet": item.pet }, settleMs: 3000 });
          pet = item.pet;
        } else {
          await ctx.mock.set(TV, item.state);
          await ctx.sleep(1500);
        }
        const report = await tvReport(page);
        const record = (out.tv[item.key] = { state: item.state, pet: item.pet, report });
        const screen = report?.screens?.[0];
        if (item.expect) {
          const tvPos = await ctx.screenPosOf(page, { entityId: TV });
          record.focused = await ctx.focusOn(page, tvPos.world, 3, [0, 0.35, 1]);
          await ctx.sleep(600);
          const image = await shotAround(ctx, page, [tvPos.world[0], tvPos.world[1] + 0.12, tvPos.world[2]], `tv-${item.key}`);
          record.screenshot = image.file;
          record.screenRgb = rgbAt(image.buffer, image.screen.x, image.screen.y - 4);
          delete image.buffer;
        }
        if (item.expect === "dog")
          check(
            `电视 ${item.state}、宠物 ${item.pet}：屏幕显示小狗大头照（白脸 RGB 都 > 225，眼睛黑色 < 40）`,
            report?.screens?.length === 1 && screen.userData.petPortrait === "dog" && screen.face.every((v) => v > 225) && screen.leftEye.every((v) => v < 40),
            record,
          );
        else if (item.expect === "cat")
          check(
            `电视 ${item.state}、宠物 ${item.pet}：屏幕显示小猫大头照（橘色脸 R > 200、B < 110）`,
            report?.screens?.length === 1 && screen.userData.petPortrait === "cat" && screen.face[0] > 200 && screen.face[2] < 110,
            record,
          );
        else check(`电视 ${item.state}：屏幕上没有大头照`, report?.found && report.screens.length === 0, record);
        if (item.key === "off-dog") {
          const tvPos = await ctx.screenPosOf(page, { entityId: TV });
          await ctx.focusOn(page, tvPos.world, 3, [0, 0.35, 1]);
          await ctx.sleep(600);
          const image = await shotAround(ctx, page, [tvPos.world[0], tvPos.world[1] + 0.12, tvPos.world[2]], "tv-off-dog");
          record.screenshot = image.file;
          record.screenRgb = rgbAt(image.buffer, image.screen.x, image.screen.y - 4);
        }
      }
      check("电视：页面没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
      await page.context().close();
      await put(current);
    }

    // ---------- 2. 入户门绑定门锁 ----------
    if (ONLY.has("lock")) {
      await ctx.mock.set(LOCK, "locked", { friendly_name: "入户门锁", supported_features: 0 });
      await ctx.mock.set("binary_sensor.entry_door", "off");
      await ctx.sleep(500);
      const page = await ctx.newPage({ startTime: NOON });
      await ctx.gotoEditor(page, { view: "2d", style: "glass" });
      const doorIndex = current.floors[0].openings.findIndex((item) => item.id === ENTRY_DOOR);
      await page.locator("g.plan-opening").nth(doorIndex).dispatchEvent("click");
      await page.waitForTimeout(700);
      const sensorOptions = await page.locator(".door-sensor-property:not(.door-lock-property) select option").evaluateAll((items) => items.map((item) => item.value));
      const lockSelect = page.locator(".door-lock-property select");
      out.lock.editor = { sensorOptions, lockSelect: await lockSelect.count() };
      out.lock.editor.lockOptions = out.lock.editor.lockSelect ? await lockSelect.locator("option").evaluateAll((items) => items.map((item) => ({ value: item.value, text: item.textContent }))) : [];
      check("编辑器：门磁下拉框仍只列 binary_sensor（不绑定 + binary_sensor.*）", sensorOptions.length > 1 && sensorOptions.every((value) => value === "" || value.startsWith("binary_sensor.")), sensorOptions);
      check("编辑器：门属性里有「门锁绑定」下拉框，列出 lock 实体（含只绑在门上的 lock.ha3d_entry_door）", out.lock.editor.lockSelect === 1 && out.lock.editor.lockOptions.some((item) => item.value === LOCK) && out.lock.editor.lockOptions.every((item) => item.value === "" || item.value.startsWith("lock.")), out.lock.editor);
      if (out.lock.editor.lockSelect) {
        await page.locator(".door-lock-property .app-select-trigger").click();
        const menu = page.locator('.app-select-menu[role="listbox"][aria-label="门锁实体"]');
        await menu.waitFor({ state: "visible", timeout: 5000 });
        await ctx.shot(page, "lock-editor-options");
        await menu.locator('[role="option"]', { hasText: LOCK }).click();
        await page.waitForTimeout(500);
        out.lock.editor.hint = await page.locator(".door-lock-property .field-hint").innerText();
        const panel = page.locator(".door-lock-property");
        await panel.scrollIntoViewIfNeeded();
        const box = await panel.boundingBox();
        await ctx.shot(page, "lock-editor-binding", box ? { clip: { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 260), width: box.width + 40, height: box.height + 280 } } : {});
        const saved = await saveAndWait(ctx, page, (project) => project.floors[0].openings.find((item) => item.id === ENTRY_DOOR)?.lockEntityId === LOCK);
        const door = saved.project.floors[0].openings.find((item) => item.id === ENTRY_DOOR);
        out.lock.saved = { entityId: door?.entityId, lockEntityId: door?.lockEntityId };
        check("保存后入户门 lockEntityId = lock.ha3d_entry_door，门磁 entityId 不变", saved.ok && door.entityId === "binary_sensor.entry_door", out.lock.saved);
      }
      await page.context().close();

      // 首页 3D：锁牌随门锁状态变化（门锁不是设备，靠门上的绑定实时推送），门扇角度只看门磁
      const home = await ctx.newPage({ startTime: NOON, viewport: { width: 1200, height: 760 } });
      await ctx.gotoHome(home, { style: "glass", quality: "smooth", prefs: { "ha3d.home.pet": null }, settleMs: 3000 });
      const states = (out.lock.states = {});
      const expected = { locked: "#22c55e", unlocked: "#f59e0b", jammed: "#ef4444", unknown: "#9ca3af" };
      let first = true;
      for (const [state, color] of Object.entries(expected)) {
        await ctx.mock.set(LOCK, state);
        await ctx.sleep(1500);
        const report = await lockReport(home);
        states[state] = report;
        check(
          `3D：门锁 ${state} 时入户门锁牌 lockState = ${state}、灯是 ${color}（两面各一个），门磁关着时门扇角度 0`,
          report?.badges.length === 1 && report.badges[0].userData.lockState === state && report.badges[0].lights.length === 2 && report.badges[0].lights.every((item) => item === color) && report.leaves.every((value) => value === 0),
          report,
        );
        if (report?.badges.length && (state === "locked" || state === "unlocked")) {
          const world = report.badges[0].world;
          if (first) {
            out.lock.focused = await ctx.focusOn(home, world, 3, [0.25, 0.3, 1]);
            first = false;
          }
          await ctx.sleep(500);
          const image = await shotAround(ctx, home, world, `lock-3d-${state}`);
          states[state].screenshot = image.file;
          delete image.buffer;
        }
      }
      // 门磁打开：门扇转开，锁牌跟着门扇
      await ctx.mock.set(LOCK, "unlocked");
      await ctx.mock.set("binary_sensor.entry_door", "on");
      await ctx.sleep(2500);
      states.doorOpen = await lockReport(home);
      check("3D：门磁打开后门扇转开（≠ 0），锁牌还在、显示未上锁", states.doorOpen?.leaves.some((value) => value !== 0) && states.doorOpen.badges[0]?.userData.lockState === "unlocked", states.doorOpen);
      await ctx.mock.set("binary_sensor.entry_door", "off");
      await ctx.sleep(2500);
      // 单击、双击锁牌：不会调用任何 lock 服务
      const callsBefore = (await ctx.mock.calls()).length;
      const badge = (await lockReport(home))?.badges[0];
      if (badge) {
        const point = await ctx.projectToScreen(home, badge.world);
        out.lock.clickPoint = point;
        await home.mouse.click(point.x, point.y);
        await ctx.sleep(800);
        await home.mouse.dblclick(point.x, point.y);
        await ctx.sleep(1200);
      }
      const lockCalls = (await ctx.mock.calls()).slice(callsBefore).filter((item) => item.domain === "lock" || [].concat(item.data?.entity_id ?? []).includes(LOCK));
      out.lock.callsAfterClick = lockCalls;
      check("3D：单击、双击锁牌都不会开锁（mock HA 没有收到 lock 服务调用）", badge && lockCalls.length === 0, { clicked: Boolean(badge), lockCalls });
      check("门锁：页面没有 pageerror", home.ha3dErrors.length === 0, home.ha3dErrors.slice(0, 3));
      await home.context().close();
      await put(current);
    }

    // ---------- 3. 编辑器设备库：状态未知的家电实体 ----------
    if (ONLY.has("library")) {
      const setAppliances = async (overrides = {}) => {
        for (const item of APPLIANCES) {
          const attributes = { friendly_name: item.name };
          if (item.deviceClass) attributes.device_class = item.deviceClass;
          await ctx.mock.set(item.entityId, overrides[item.entityId] ?? item.state ?? "unknown", attributes, { merge: false });
        }
        await ctx.sleep(800);
      };
      await setAppliances();
      const api = (await (await fetch(`${ctx.stack.appUrl}/api/ha/entities`)).json()).entities.filter((entity) => APPLIANCES.some((item) => item.entityId === entity.entityId));
      out.library.api = api.map((entity) => ({ entityId: entity.entityId, domain: entity.domain, state: entity.state, device_class: entity.attributes?.device_class ?? null, name: entity.name }));
      await ctx.writeJson(path.join(ctx.dir, "api-ha-entities-appliances.json"), out.library.api);
      check("后端 /api/ha/entities 返回了全部家电实体，状态是 unknown / unavailable（后端没有按状态过滤）", out.library.api.length === APPLIANCES.length, out.library.api);

      const readLibrary = async (page) => {
        if (!(await page.locator(".device-library-content .device-entity-list:visible").count())) await page.locator('button[aria-label="放置：设备"]').click();
        await page.waitForTimeout(600);
        const ids = await page.locator(".device-library-content .device-entity-list button:visible .entity-id-line").allInnerTexts();
        const hint = (await page.locator(".device-library-content .device-library-hint").allInnerTexts())[0] ?? null;
        return { visible: Object.fromEntries(APPLIANCES.map((item) => [item.entityId, ids.includes(item.entityId)])), total: ids.length, hint };
      };
      let page = await ctx.newPage({ startTime: NOON });
      await ctx.gotoEditor(page, { view: "2d", style: "glass" });
      out.library.unknown = await readLibrary(page);
      await ctx.shot(page, "library-unknown");
      check("设备库：6 个家电实体（状态 unknown / unavailable）都列出来了", APPLIANCES.every((item) => out.library.unknown.visible[item.entityId]), out.library.unknown);
      await page.context().close();

      // 诊断：同样的实体改成 on，看是不是状态导致的
      await setAppliances(Object.fromEntries(APPLIANCES.map((item) => [item.entityId, "on"])));
      page = await ctx.newPage({ startTime: NOON });
      await ctx.gotoEditor(page, { view: "2d", style: "glass" });
      out.library.on = await readLibrary(page);
      ctx.log(`诊断（状态 on）：${JSON.stringify(out.library.on)}`);
      await page.context().close();
      await setAppliances();

      // 选中、看推荐样式、放到平面图、保存
      page = await ctx.newPage({ startTime: NOON });
      await ctx.gotoEditor(page, { view: "2d", style: "glass" });
      await readLibrary(page);
      out.library.models = {};
      for (const item of APPLIANCES) {
        const entry = page.locator(".device-library-content .device-entity-list button:visible").filter({ has: page.locator(".entity-id-line", { hasText: item.entityId }) });
        if (!(await entry.count())) {
          out.library.models[item.entityId] = null;
          continue;
        }
        await entry.first().click();
        await page.waitForTimeout(400);
        const active = await page.locator(".device-library-content .device-model-selector:visible .device-model-grid button.active strong").allInnerTexts();
        const recommended = await page.locator(".device-library-content .device-model-selector:visible .device-model-grid button strong:has(em)").allInnerTexts();
        out.library.models[item.entityId] = { active: active.map((text) => text.replace("推荐", "").trim()), recommended: recommended.map((text) => text.replace("推荐", "").trim()) };
        if (item.entityId === "binary_sensor.ha3d_washer_running") await ctx.shot(page, "library-washer-selected");
      }
      check(
        "设备库：选中后默认（推荐）样式就是对应家电（洗衣机、烘干机、洗碗机、洗袜机、花洒）",
        APPLIANCES.every((item) => out.library.models[item.entityId]?.active?.[0] === item.label && out.library.models[item.entityId]?.recommended?.[0] === item.label),
        out.library.models,
      );
      out.library.placed = [];
      for (const target of PLACE) {
        if (!(await page.locator(".device-library-content .device-entity-list:visible").count())) await page.locator('button[aria-label="放置：设备"]').click();
        await page.waitForTimeout(500);
        const entry = page.locator(".device-library-content .device-entity-list button:visible").filter({ has: page.locator(".entity-id-line", { hasText: target.entityId }) });
        if (!(await entry.count())) {
          out.library.placed.push({ entityId: target.entityId, placed: false, reason: "设备库里没有" });
          continue;
        }
        await entry.first().click();
        await page.waitForTimeout(400);
        const before = await page.locator("g.plan-device").count();
        const screen = await planToScreen(page, target.point);
        if (screen?.onCanvas) await page.mouse.click(screen.x, screen.y);
        await page.waitForTimeout(600);
        out.library.placed.push({ entityId: target.entityId, placed: (await page.locator("g.plan-device").count()) > before, screen });
      }
      check("设备库：状态 unknown 的洗衣机、unavailable 的备用烘干机都放进了平面图", out.library.placed.length === PLACE.length && out.library.placed.every((item) => item.placed), out.library.placed);
      await ctx.shot(page, "library-placed-2d");
      const saved = await saveAndWait(ctx, page, (project) => PLACE.every((target) => project.floors[0].devices.some((device) => device.entityId === target.entityId)));
      out.library.saved = saved.project.floors[0].devices.filter((device) => PLACE.some((target) => target.entityId === device.entityId)).map((device) => ({ entityId: device.entityId, kind: device.kind, modelId: device.modelId, roomId: device.roomId, position: device.position.map((value) => round(value)) }));
      check(
        "保存后项目里有这两个设备，kind = binary_sensor，modelId 是洗衣机 / 烘干机样式",
        saved.ok && PLACE.every((target) => out.library.saved.some((device) => device.entityId === target.entityId && device.kind === "binary_sensor" && device.modelId === APPLIANCES.find((item) => item.entityId === target.entityId).modelId)),
        out.library.saved,
      );
      check("编辑器：页面没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
      await page.context().close();

      if (saved.ok) {
        const home = await ctx.newPage({ startTime: NOON, viewport: { width: 1200, height: 760 } });
        await ctx.gotoHome(home, { style: "glass", quality: "smooth", prefs: { "ha3d.home.pet": null }, settleMs: 3000 });
        out.library.home = await home.evaluate((ids) => {
          const s = window.__ha3dDebug?.get();
          const found = {};
          s?.scene.traverse((o) => {
            if (o.name !== "ha3d-appliance-body") return;
            let group = o.parent;
            while (group && !group.userData?.focusEntityId) group = group.parent;
            if (ids.includes(group?.userData?.focusEntityId)) found[group.userData.focusEntityId] = { ...o.userData };
          });
          return found;
        }, PLACE.map((item) => item.entityId));
        check("首页 3D：放好的两个设备都渲染成家电模型（ha3d-appliance-body）", PLACE.every((item) => out.library.home[item.entityId]), out.library.home);
        const washer = await ctx.screenPosOf(home, { entityId: PLACE[0].entityId });
        if (washer) {
          await ctx.focusOn(home, washer.world, 3.5, [0.4, 1.1, 1]);
          await ctx.shot(home, "library-home-3d");
        }
        await home.context().close();
      }
      await put(current);
    }
  } finally {
    await put(current);
    await ctx.mock.reset();
  }
  await ctx.writeJson(path.join(ctx.dir, "fixes025.json"), out);
  return out;
}
