// 1.1.0：只绑门锁的门按门锁开合（lock）、状态 unknown 的烘干机等家电不再半透明（dryer）、房间聚焦卡片显示状态汇总（room）。
// 在 fixture 上临时改项目和实体（结束后换回原项目并 mock.reset）。
// HA3D_FIXES110_BASELINE=1 时只记录不断言（在未修改的前端上采集修复前的基线）；HA3D_FIXES110_ONLY=lock,dryer,room 只跑其中几段。
import path from "node:path";

const NOON = "2026-06-01T12:00:00";
const BASELINE = process.env.HA3D_FIXES110_BASELINE === "1";
const ONLY = new Set((process.env.HA3D_FIXES110_ONLY || "lock,dryer,room").split(",").map((item) => item.trim()));
const STYLES = ["glass", "cream"];
const R90 = Math.PI / 2;

// ---------- lock ----------
const BEDROOM_DOOR = "opening-bedroom-door"; // 没有门磁，只绑门锁
const BEDROOM_LOCK = "lock.ha3d_bedroom_lock";
const ENTRY_DOOR = "opening-entry-door"; // 门磁 binary_sensor.entry_door + 门锁
const ENTRY_LOCK = "lock.ha3d_entry_door";
const ENTRY_SENSOR = "binary_sensor.entry_door";
const LOCK_STATES = ["unlocked", "locked", "locking", "unlocking", "jammed", "open", "unknown", "unavailable"];

function withLocks(project) {
  const clone = structuredClone(project);
  const floor = clone.floors[0];
  floor.openings = floor.openings.map((item) => {
    if (item.id === BEDROOM_DOOR) {
      const { entityId: _sensor, ...rest } = item;
      return { ...rest, lockEntityId: BEDROOM_LOCK };
    }
    if (item.id === ENTRY_DOOR) return { ...item, lockEntityId: ENTRY_LOCK };
    return item;
  });
  return clone;
}

/** 每扇门的门扇转角（ha3d-door-leaf rotation.y）和锁牌（ha3d-door-lock）的 lockState、世界坐标。 */
async function doorReport(page, openingIds) {
  return page.evaluate((ids) => {
    const s = window.__ha3dDebug?.get();
    if (!s) return null;
    s.scene.updateMatrixWorld(true);
    const out = Object.fromEntries(ids.map((id) => [id, { leaves: [], badges: [] }]));
    s.scene.traverse((o) => {
      const id = o.userData?.openingId;
      if (!out[id]) return;
      if (o.name === "ha3d-door-leaf") out[id].leaves.push(Number(o.rotation.y.toFixed(4)));
      if (o.name === "ha3d-door-lock") {
        const world = o.getWorldPosition(o.position.clone());
        out[id].badges.push({ lockState: o.userData.lockState ?? null, world: [world.x, world.y, world.z] });
      }
    });
    return out;
  }, openingIds);
}

// ---------- dryer ----------
const APPLIANCES = [
  { entityId: "binary_sensor.ha3d_fx_washer", modelId: "binary_sensor.washer", appliance: "washer", label: "洗衣机", position: [0.45, 0, 5.3], roomId: "room-kitchen" },
  { entityId: "binary_sensor.ha3d_fx_dryer", modelId: "binary_sensor.dryer", appliance: "dryer", label: "烘干机", position: [0.45, 0, 6.4], roomId: "room-kitchen" },
  { entityId: "binary_sensor.ha3d_fx_stack_washer", modelId: "binary_sensor.washer", appliance: "washer", label: "叠放洗衣机", position: [3.95, 0, 5.2], roomId: "room-bathroom" },
  { entityId: "binary_sensor.ha3d_fx_stack_dryer", modelId: "binary_sensor.dryer_upper", appliance: "dryer", label: "叠放烘干机", position: [3.95, 0, 5.2], roomId: "room-bathroom" },
];
const APPLIANCE_STATES = ["off", "on", "unknown", "unavailable"];

function withAppliances(project) {
  const clone = structuredClone(project);
  const floor = clone.floors[0];
  floor.devices = [
    ...floor.devices,
    ...APPLIANCES.map((item, index) => ({ id: `device-ha3d-fx-appliance-${index}`, entityId: item.entityId, kind: "binary_sensor", floorId: floor.id, roomId: item.roomId, position: item.position, rotation: [0, R90, 0], modelId: item.modelId })),
  ];
  return clone;
}

async function setAppliances(ctx, state) {
  for (const item of APPLIANCES) await ctx.mock.set(item.entityId, state, { friendly_name: item.label, device_class: "running" }, { merge: false });
}

/** 每个 ha3d-appliance-body：包围盒体积最大的 meshPhysicalMaterial 网格（机身）的 transparent / opacity，指示灯亮度。 */
async function bodyReport(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    if (!s) return {};
    s.scene.updateMatrixWorld(true);
    const out = {};
    s.scene.traverse((o) => {
      if (o.name !== "ha3d-appliance-body") return;
      let group = o.parent;
      while (group && !group.userData?.focusEntityId) group = group.parent;
      let best = null;
      let indicator = null;
      o.traverse((c) => {
        if (c.name === "ha3d-appliance-indicator") indicator = c.material.emissiveIntensity;
        if (!c.isMesh || !c.geometry || c.material?.type !== "MeshPhysicalMaterial") return;
        if (!c.geometry.boundingBox) c.geometry.computeBoundingBox();
        const b = c.geometry.boundingBox.clone().applyMatrix4(c.matrixWorld);
        const volume = (b.max.x - b.min.x) * (b.max.y - b.min.y) * (b.max.z - b.min.z);
        if (!best || volume > best.volume) best = { volume, transparent: c.material.transparent, opacity: c.material.opacity, center: [(b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2, (b.min.z + b.max.z) / 2] };
      });
      out[group?.userData?.focusEntityId ?? "?"] = { appliance: o.userData?.appliance, upper: o.userData?.upper, body: best && { transparent: best.transparent, opacity: best.opacity, volume: Number(best.volume.toFixed(4)) }, center: best?.center ?? null, indicator };
    });
    return out;
  });
}

// ---------- room ----------
const LIVING_EXTRA = [
  { id: "device-ha3d-fx-temp-2", entityId: "sensor.ha3d_living_temp_2", kind: "sensor", position: [5.8, 1.5, 4.2], modelId: "sensor.temperature" },
  { id: "device-ha3d-fx-plug", entityId: "switch.ha3d_living_plug", kind: "switch", position: [5.6, 0.3, 0.2], modelId: "switch.outlet" },
];
const HUMIDITY = ["sensor.ha3d_living_humidity", "sensor.ha3d_living_humidity_2"];

function withRoomSummary(project) {
  const clone = structuredClone(project);
  const floor = clone.floors[0];
  const living = floor.rooms.find((room) => room.id === "room-living");
  living.bindings = { ...living.bindings, environment: { ...living.bindings.environment, humidity: { entityIds: HUMIDITY, aggregation: "latest" } } };
  floor.devices = [...floor.devices, ...LIVING_EXTRA.map((item) => ({ ...item, floorId: floor.id, roomId: "room-living", rotation: [0, 0, 0] }))];
  return clone;
}

async function setRoomStates(ctx) {
  const temp = { device_class: "temperature", unit_of_measurement: "°C", state_class: "measurement" };
  const humid = { device_class: "humidity", unit_of_measurement: "%", state_class: "measurement" };
  await ctx.mock.set("sensor.living_temperature", "24.5", { friendly_name: "客厅温度", ...temp });
  await ctx.mock.set("sensor.ha3d_living_temp_2", "26.1", { friendly_name: "客厅温度 2", ...temp });
  await ctx.mock.set(HUMIDITY[0], "52", { friendly_name: "客厅湿度", ...humid });
  await ctx.mock.set(HUMIDITY[1], "61", { friendly_name: "客厅湿度 2", ...humid });
  await ctx.mock.set("light.ceiling_panel", "on");
  await ctx.mock.set("light.downlight", "off");
  await ctx.mock.set("climate.central_ac", "cool");
  await ctx.mock.set("lock.door", "locked");
  await ctx.mock.set(ENTRY_SENSOR, "off", { device_class: "door" });
  await ctx.mock.set("switch.ha3d_living_plug", "unavailable", { friendly_name: "客厅插座" });
}

/** 房间聚焦卡片：strong、.ha3d-room-summary 的子元素（class、data-category、文本）、整张卡片文本。 */
async function cardReport(page) {
  return page.evaluate(() => {
    const card = document.querySelector(".room-focus-card");
    if (!card) return null;
    const summary = card.querySelector(".ha3d-room-summary");
    return {
      room: card.querySelector("strong")?.textContent ?? null,
      text: card.innerText,
      summary: summary ? [...summary.children].map((el) => ({ className: el.className, category: el.dataset.category ?? null, text: el.textContent })) : null,
      env: card.querySelector(".ha3d-room-summary-env")?.textContent ?? null,
    };
  });
}

/** 双击房间地面进入聚焦：多边形质心优先，被遮挡或聚焦到别的房间时换多边形内的其他点（每次重新打开首页）。 */
async function focusRoom(ctx, page, room, homeOptions) {
  const n = room.polygon.length;
  const centroid = room.polygon.reduce((sum, [x, y]) => [sum[0] + x / n, sum[1] + y / n], [0, 0]);
  const candidates = [centroid, ...room.polygon.map(([x, y]) => [centroid[0] + (x - centroid[0]) * 0.5, centroid[1] + (y - centroid[1]) * 0.5])];
  const tried = [];
  for (const [x, y] of candidates) {
    const world = await ctx.planToWorld(page, [x, 0.03, y]);
    const point = await ctx.projectToScreen(page, world);
    if (!point?.onCanvas) {
      tried.push({ plan: [x, y], onCanvas: false });
      continue;
    }
    await page.mouse.dblclick(point.x, point.y);
    await page.waitForTimeout(1800);
    const card = await cardReport(page);
    tried.push({ plan: [x, y], point, room: card?.room ?? null });
    if (card?.room === room.name) return { ok: true, tried };
    if (card) await ctx.gotoHome(page, homeOptions);
  }
  return { ok: false, tried };
}

export default async function fixes110(ctx) {
  const check = (name, ok, detail) => (BASELINE ? ctx.check(`[基线，只记录] ${name}`, true, { ok: Boolean(ok), detail }) : ctx.check(name, ok, detail));
  const out = { baseline: BASELINE, lock: {}, dryer: {}, room: {} };
  const current = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
  const put = (project) => fetch(`${ctx.stack.appUrl}/api/projects/${encodeURIComponent(current.id)}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...project, id: current.id }) });
  try {
    // ---------- 1. 只绑门锁的门按门锁开合 ----------
    if (ONLY.has("lock")) {
      if (!(await put(withLocks(ctx.project))).ok) throw new Error("保存带门锁的项目失败");
      await ctx.mock.set(BEDROOM_LOCK, "locked", { friendly_name: "卧室门锁", supported_features: 0 });
      await ctx.mock.set(ENTRY_LOCK, "locked", { friendly_name: "入户门锁", supported_features: 0 });
      await ctx.mock.set(ENTRY_SENSOR, "off");
      for (const style of STYLES) {
        const record = (out.lock[style] = { bedroom: {}, entry: {} });
        const page = await ctx.newPage({ startTime: NOON, viewport: { width: 1200, height: 760 } });
        await ctx.gotoHome(page, { style, quality: "smooth", prefs: { "ha3d.home.pet": null }, settleMs: 3000 });
        const states = style === "glass" ? LOCK_STATES : ["unlocked", "locked"];
        let focused = false;
        for (const state of states) {
          await ctx.mock.set(BEDROOM_LOCK, state);
          await ctx.sleep(1500);
          const report = (await doorReport(page, [BEDROOM_DOOR]))[BEDROOM_DOOR];
          record.bedroom[state] = report;
          const open = state === "unlocked";
          check(
            `${style}：只绑门锁的卧室门，门锁 ${state} 时门扇${open ? "打开（≠ 0）" : "关着（= 0）"}，锁牌 lockState = ${state}`,
            report.leaves.length === 1 && (open ? report.leaves[0] !== 0 : report.leaves[0] === 0) && report.badges.length === 1 && report.badges[0].lockState === state,
            report,
          );
          if ((state === "unlocked" || state === "locked") && report.badges.length) {
            const world = report.badges[0].world;
            // 从客厅一侧正对卧室门（奶油风格的墙不透明，斜着看会被墙挡住）
            if (!focused) focused = await ctx.focusOn(page, world, 3, [-1, 0.55, 0.15]);
            await ctx.sleep(500);
            record.bedroom[state].screenshot = path.basename((await ctx.shot(page, `lock-bedroom-${state}-${style}`)).path);
          }
        }
        // 入户门：门磁 + 门锁，开合只看门磁
        await ctx.mock.set(BEDROOM_LOCK, "locked");
        await ctx.mock.set(ENTRY_SENSOR, "off");
        await ctx.mock.set(ENTRY_LOCK, "unlocked");
        await ctx.sleep(2000);
        record.entry.sensorOffUnlocked = (await doorReport(page, [ENTRY_DOOR]))[ENTRY_DOOR];
        check(
          `${style}：入户门门磁 off、门锁 unlocked 时门扇关着（= 0），锁牌 unlocked`,
          record.entry.sensorOffUnlocked.leaves.length >= 1 && record.entry.sensorOffUnlocked.leaves.every((value) => value === 0) && record.entry.sensorOffUnlocked.badges[0]?.lockState === "unlocked",
          record.entry.sensorOffUnlocked,
        );
        await ctx.mock.set(ENTRY_LOCK, "locked");
        await ctx.mock.set(ENTRY_SENSOR, "on");
        await ctx.sleep(2000);
        record.entry.sensorOnLocked = (await doorReport(page, [ENTRY_DOOR]))[ENTRY_DOOR];
        check(
          `${style}：入户门门磁 on、门锁 locked 时门扇打开（≠ 0），锁牌 locked`,
          record.entry.sensorOnLocked.leaves.some((value) => value !== 0) && record.entry.sensorOnLocked.badges[0]?.lockState === "locked",
          record.entry.sensorOnLocked,
        );
        await ctx.mock.set(ENTRY_SENSOR, "off");
        await ctx.sleep(1500);
        check(`${style}：门锁页面没有 pageerror`, page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
        await page.context().close();
      }
      await put(current);
      await ctx.mock.reset();
    }

    // ---------- 2. 状态 unknown 的家电不透明 ----------
    if (ONLY.has("dryer")) {
      if (!(await put(withAppliances(ctx.project))).ok) throw new Error("保存带家电的项目失败");
      for (const style of STYLES) {
        const record = (out.dryer[style] = {});
        // 每种风格都从 off 开始打开页面（上一轮停在 unavailable，页面刚加载完时的第一次推送可能还没到）
        await setAppliances(ctx, "off");
        const page = await ctx.newPage({ startTime: NOON, viewport: { width: 1200, height: 760 } });
        await ctx.gotoHome(page, { style, quality: "smooth", prefs: { "ha3d.home.pet": null }, settleMs: 3000 });
        for (const state of APPLIANCE_STATES) {
          await setAppliances(ctx, state);
          await ctx.sleep(2500);
          const report = await bodyReport(page);
          record[state] = Object.fromEntries(APPLIANCES.map((item) => [item.entityId, report[item.entityId] ?? null]));
          const bodies = APPLIANCES.map((item) => ({ label: item.label, ...(record[state][item.entityId]?.body ?? {}) }));
          const [washer, dryer, stackWasher, stackDryer] = bodies;
          if (state === "unavailable") {
            check(`${style}：unavailable 时四台机身仍是半透明（transparent true、opacity 0.5）`, bodies.every((body) => body.transparent === true && body.opacity === 0.5), bodies);
          } else {
            check(
              `${style}：${state} 时洗衣机、烘干机、叠放洗衣机、叠放烘干机机身都不透明（transparent false、opacity 1），烘干机和洗衣机相同`,
              bodies.every((body) => body.transparent === false && body.opacity === 1) && dryer.transparent === washer.transparent && dryer.opacity === washer.opacity && stackDryer.transparent === stackWasher.transparent && stackDryer.opacity === stackWasher.opacity,
              bodies,
            );
          }
          if (state === "unknown") {
            const indicators = APPLIANCES.map((item) => ({ label: item.label, indicator: record[state][item.entityId]?.indicator ?? null }));
            check(`${style}：unknown 时四台的指示灯都不亮（emissiveIntensity = 0）`, indicators.every((item) => item.indicator === 0), indicators);
            const stack = record[state][APPLIANCES[3].entityId];
            if (stack?.center) {
              record.focused = await ctx.focusOn(page, [stack.center[0], stack.center[1] - 0.35, stack.center[2]], 3, [1, 1.1, 0.3]);
              await ctx.sleep(800);
              record.screenshot = path.basename((await ctx.shot(page, `dryer-stack-unknown-${style}`)).path);
            }
            const single = record[state][APPLIANCES[1].entityId];
            if (single?.center) {
              await ctx.focusOn(page, [single.center[0], single.center[1], single.center[2] - 0.5], 3, [1, 1.1, 0.3]);
              await ctx.sleep(800);
              record.screenshotSingle = path.basename((await ctx.shot(page, `dryer-washer-unknown-${style}`)).path);
            }
          }
        }
        check(`${style}：家电页面没有 pageerror`, page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
        await page.context().close();
      }
      await put(current);
      await ctx.mock.reset();
    }

    // ---------- 3. 房间聚焦卡片：状态汇总 ----------
    if (ONLY.has("room")) {
      const project = withRoomSummary(ctx.project);
      if (!(await put(project)).ok) throw new Error("保存带湿度绑定的项目失败");
      await setRoomStates(ctx);
      const rooms = project.floors[0].rooms;
      const living = rooms.find((room) => room.id === "room-living");
      const bedroom = rooms.find((room) => room.id === "room-bedroom");
      for (const style of STYLES) {
        const record = (out.room[style] = {});
        const homeOptions = { style, quality: "smooth", prefs: { "ha3d.home.pet": null }, settleMs: 3000 };
        const page = await ctx.newPage({ startTime: NOON, viewport: { width: 1200, height: 760 } });
        for (const [key, room] of [["living", living], ["bedroom", bedroom]]) {
          await ctx.gotoHome(page, homeOptions);
          const focus = await focusRoom(ctx, page, room, homeOptions);
          const card = await cardReport(page);
          record[key] = { focus, card };
          check(`${style}：双击${room.name}地面进入聚焦，卡片标题是「${room.name}」`, focus.ok && card?.room === room.name, record[key]);
          if (card) {
            const box = await page.locator(".room-focus-card").boundingBox();
            if (box) record[key].screenshot = path.basename((await ctx.shot(page, `room-card-${key}-${style}`, { clip: { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 16), width: box.width + 32, height: box.height + 32 } })).path);
            await ctx.shot(page, `room-card-${key}-${style}-full`);
          }
          const rows = card?.summary ?? [];
          const byCategory = Object.fromEntries(rows.filter((row) => row.category).map((row) => [row.category, row.text]));
          const last = rows.at(-1);
          check(`${style}：${room.name}卡片里不再有「个已绑定设备」`, card && !card.text.includes("个已绑定设备"), card?.text);
          if (key === "living") {
            check(`${style}：客厅卡片第一行 .ha3d-room-summary-env 是「🌡 24.5°C · 💧 52%」（温度、湿度都取最低）`, rows[0]?.className.includes("ha3d-room-summary-env") && rows[0]?.text === "🌡 24.5°C · 💧 52%", rows);
            const expected = { light: "灯 1/2 开", switch: "开关/插座 0/1 开", climate: "空调/风扇 1/1 开", doorWindow: "门窗 0/1 开", lock: "门锁 0/1 未上锁" };
            check(`${style}：客厅各类别行正确、没有窗帘行`, Object.entries(expected).every(([category, text]) => byCategory[category] === text) && !("cover" in byCategory), byCategory);
            check(`${style}：客厅最后一行是「离线 1」`, last?.className.includes("ha3d-room-summary-offline") && last.text === "离线 1", last);
          } else {
            check(`${style}：卧室没有温湿度行`, card && !card.env && rows.length > 0, rows);
            check(`${style}：卧室有开关/插座、窗帘行（开关 0/2 开、窗帘 2/2 开）`, byCategory.switch === "开关/插座 0/2 开" && byCategory.cover === "窗帘 2/2 开", byCategory);
            check(`${style}：卧室最后一行是「离线 0」`, last?.className.includes("ha3d-room-summary-offline") && last.text === "离线 0", last);
          }
        }
        check(`${style}：房间卡片页面没有 pageerror`, page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
        await page.context().close();
      }
      await put(current);
    }
  } finally {
    await put(current);
    await ctx.mock.reset();
  }
  await ctx.writeJson(path.join(ctx.dir, "fixes110.json"), out);
  return out;
}
