// 家电样式（0.2.4）：洗衣机、烘干机、洗碗机、洗袜机、花洒（binary_sensor，on = 运行中 / 出水）。
// 在 fixture 上临时加合成设备（结束后换回原项目），检查两种视觉风格下都能渲染、运行/停止状态不同、
// 叠放的洗衣机 + 烘干机上下对齐（两种上下顺序）、省电画质下只有家电在动时限帧、编辑器里能选到这些样式。
import path from "node:path";

const NOON = "2026-06-01T12:00:00";
const STYLES = ["glass", "cream"];
const round = (value, digits = 3) => Number(Number(value).toFixed(digits));
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const R90 = Math.PI / 2;
// stack：叠放组；upper：叠放上层；name：实体友好名（平面图标记的 <title>）
const APPLIANCES = [
  { entityId: "binary_sensor.ha3d_washer_running", modelId: "binary_sensor.washer", appliance: "washer", upper: false, stack: "A", name: "洗衣机运行", position: [3.95, 0, 5.2], rotation: [0, R90, 0], roomId: "room-bathroom", deviceClass: "running" },
  { entityId: "binary_sensor.ha3d_dryer_running", modelId: "binary_sensor.dryer_upper", appliance: "dryer", upper: true, stack: "A", name: "烘干机运行", position: [3.95, 0, 5.2], rotation: [0, R90, 0], roomId: "room-bathroom", deviceClass: "running" },
  { entityId: "binary_sensor.ha3d_test_dryer", modelId: "binary_sensor.dryer", appliance: "dryer", upper: false, stack: "B", name: "测试烘干机", position: [0.45, 0, 6.2], rotation: [0, R90, 0], roomId: "room-kitchen", deviceClass: "running" },
  { entityId: "binary_sensor.ha3d_test_washer", modelId: "binary_sensor.washer_upper", appliance: "washer", upper: true, stack: "B", name: "测试洗衣机", position: [0.45, 0, 6.2], rotation: [0, R90, 0], roomId: "room-kitchen", deviceClass: "running" },
  { entityId: "binary_sensor.ha3d_dishwasher_running", modelId: "binary_sensor.dishwasher", appliance: "dishwasher", upper: false, name: "洗碗机运行", position: [3.15, 0, 5.6], rotation: [0, -R90, 0], roomId: "room-kitchen", deviceClass: "running" },
  { entityId: "binary_sensor.ha3d_sock_washer_running", modelId: "binary_sensor.sock_washer", appliance: "sock_washer", upper: false, name: "洗袜机运行", position: [4.2, 0.85, 7.2], rotation: [0, Math.PI, 0], roomId: "room-bathroom", deviceClass: "running" },
  { entityId: "binary_sensor.ha3d_shower_water", modelId: "binary_sensor.shower", appliance: "shower", upper: false, name: "花洒出水", position: [5.9, 2, 5.8], rotation: [0, -R90, 0], roomId: "room-bathroom", deviceClass: "moisture" },
];
const LABELS = ["洗衣机", "洗衣机（叠放上层）", "烘干机", "烘干机（叠放上层）", "洗碗机", "洗袜机", "花洒"];
const SPINNING = new Set(["washer", "dryer", "sock_washer"]);
const WITH_INDICATOR = new Set(["washer", "dryer", "dishwasher", "sock_washer"]);
// 特写：每组一张，target 是包围盒中心加偏移，方向按设备正面（front）+ 侧面（side）+ 向上（高过墙顶）；OrbitControls 的 minDistance 是 3
const CLOSEUPS = [
  { key: "stack-A", entityId: "binary_sensor.ha3d_washer_running", group: ["binary_sensor.ha3d_washer_running", "binary_sensor.ha3d_dryer_running"], distance: 3 },
  { key: "stack-B", entityId: "binary_sensor.ha3d_test_dryer", group: ["binary_sensor.ha3d_test_dryer", "binary_sensor.ha3d_test_washer"], distance: 3 },
  { key: "dishwasher", entityId: "binary_sensor.ha3d_dishwasher_running", distance: 3 },
  { key: "sock-washer", entityId: "binary_sensor.ha3d_sock_washer_running", distance: 3 },
  { key: "shower", entityId: "binary_sensor.ha3d_shower_water", distance: 3, dy: -0.5 },
];

function withAppliances(project) {
  const clone = structuredClone(project);
  const floor = clone.floors[0];
  floor.devices = [
    ...floor.devices,
    ...APPLIANCES.map((item, index) => ({
      id: `device-ha3d-appliance-${index}`,
      entityId: item.entityId,
      kind: "binary_sensor",
      floorId: floor.id,
      roomId: item.roomId,
      position: item.position,
      rotation: item.rotation,
      modelId: item.modelId,
    })),
  ];
  return clone;
}

async function setAll(ctx, state) {
  for (const item of APPLIANCES) {
    const attributes = { friendly_name: item.name, device_class: item.deviceClass };
    if (item.deviceClass === "running") Object.assign(attributes, { phase: state === "on" ? "washing" : "idle", remaining_min: state === "on" ? 42 : 0 });
    await ctx.mock.set(item.entityId, state, attributes);
  }
}

/** 每个 ha3d-appliance-body：所属实体、userData、世界包围盒（不含描边）、内筒转角、指示灯亮度、可见的花洒水流数、正面方向。 */
async function applianceReport(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    if (!s) return [];
    s.scene.updateMatrixWorld(true);
    const out = [];
    const isVisible = (o) => {
      for (let c = o; c; c = c.parent) if (!c.visible) return false;
      return true;
    };
    s.scene.traverse((o) => {
      if (o.name !== "ha3d-appliance-body" || !isVisible(o)) return;
      let group = o.parent;
      while (group && !group.userData?.focusEntityId) group = group.parent;
      let box = null;
      let drum = null;
      let indicator = null;
      let water = 0;
      o.traverse((c) => {
        if (c.name === "ha3d-appliance-drum") drum = c;
        if (c.name === "ha3d-appliance-indicator") indicator = c;
        if (c.name === "ha3d-shower-water" && isVisible(c)) water += 1;
        const m = Array.isArray(c.material) ? c.material[0] : c.material;
        if (!c.isMesh || !c.geometry || c.isLineSegments || m?.type === "LineMaterial") return;
        if (!c.geometry.boundingBox) c.geometry.computeBoundingBox();
        const b = c.geometry.boundingBox.clone().applyMatrix4(c.matrixWorld);
        box = box ? box.union(b) : b;
      });
      const origin = o.getWorldPosition(o.position.clone());
      const front = o.localToWorld(o.position.clone().set(0, 0, 1)).sub(o.localToWorld(o.position.clone().set(0, 0, 0)));
      front.y = 0;
      front.normalize();
      out.push({
        entityId: group?.userData?.focusEntityId ?? null,
        userData: { ...o.userData },
        min: box && [box.min.x, box.min.y, box.min.z],
        max: box && [box.max.x, box.max.y, box.max.z],
        origin: [origin.x, origin.y, origin.z],
        front: [front.x, front.z],
        drum: drum && { z: drum.rotation.z, y: drum.rotation.y },
        indicator: indicator ? indicator.material.emissiveIntensity : null,
        water,
      });
    });
    return out;
  });
}
const byEntity = (report) => Object.fromEntries(report.map((item) => [item.entityId, item]));
const center = (item) => item.min.map((value, axis) => (value + item.max[axis]) / 2);
const drumAngle = (item) => (item?.drum ? item.drum.z + item.drum.y : null);

/** 帧计数连续 2 次、每次 1.5 秒都不变（同 perf.mjs 的 waitIdle）。 */
async function waitIdle(ctx, page, maxMs = 45_000) {
  const read = () => page.evaluate(() => window.__ha3dDebug?.get().gl.info.render.frame ?? 0);
  const started = Date.now();
  let previous = await read();
  let still = 0;
  while (Date.now() - started < maxMs && still < 2) {
    await ctx.sleep(1500);
    const current = await read();
    still = current === previous ? still + 1 : 0;
    previous = current;
  }
  return Date.now() - started;
}

/** 晴天白天、空调等其他设备停下来，只剩家电可能在动。 */
async function pinScene(ctx) {
  await ctx.mock.set("sun.sun", "above_horizon", { elevation: 45, azimuth: 180, rising: false });
  for (const entityId of ["weather.home", "weather.backup"]) await ctx.mock.set(entityId, "sunny");
  for (const item of await ctx.mock.states()) {
    const [domain] = item.entity_id.split(".");
    const target = { climate: "off", fan: "off", media_player: "idle", vacuum: "docked", binary_sensor: "off" }[domain];
    if (target && item.state !== target) await ctx.mock.set(item.entity_id, target, domain === "fan" ? { percentage: 0 } : undefined);
  }
}

export default async function appliances(ctx) {
  const { check } = ctx;
  const out = { styles: {}, frames: {}, editor: {} };
  const current = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;
  const put = (project) => fetch(`${ctx.stack.appUrl}/api/projects/${encodeURIComponent(current.id)}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...project, id: current.id }) });
  if (!(await put(withAppliances(ctx.project))).ok) throw new Error("保存带家电的项目失败");
  try {
    await pinScene(ctx);
    await setAll(ctx, "off");

    // ---------- 两种视觉风格：渲染、运行/停止状态、叠放对齐、截图 ----------
    for (const style of STYLES) {
      const record = (out.styles[style] = {});
      const page = await ctx.newPage({ startTime: NOON, viewport: { width: 1200, height: 760 } });
      await ctx.gotoHome(page, { style, quality: "smooth", prefs: { "ha3d.home.pet": null }, settleMs: 3000 });
      const states = {};
      const snapshot = async (label) => {
        const first = byEntity(await applianceReport(page));
        await ctx.sleep(2000);
        const second = byEntity(await applianceReport(page));
        states[label] = Object.fromEntries(
          APPLIANCES.map((item) => {
            const a = first[item.entityId];
            const b = second[item.entityId];
            return [item.entityId, { indicator: b?.indicator ?? null, water: b?.water ?? 0, drumDelta: a?.drum && b?.drum ? round(Math.abs(drumAngle(b) - drumAngle(a))) : null }];
          }),
        );
        return second;
      };
      const offState = (label) =>
        APPLIANCES.every((item) => {
          const value = states[label][item.entityId];
          return (!WITH_INDICATOR.has(item.appliance) || value.indicator === 0) && (!SPINNING.has(item.appliance) || value.drumDelta === 0) && value.water === 0;
        });

      const initial = await snapshot("off");
      record.bodies = APPLIANCES.map((item) => ({ entityId: item.entityId, found: initial[item.entityId]?.userData ?? null }));
      check(
        `${style}：每个家电实体都有一个 ha3d-appliance-body，userData.appliance / upper 与样式一致`,
        APPLIANCES.every((item) => {
          const found = initial[item.entityId];
          return found && found.userData.appliance === item.appliance && found.userData.upper === item.upper;
        }) && (await applianceReport(page)).length === APPLIANCES.length,
        record.bodies,
      );
      check(`${style}：全部 off 时指示灯 emissiveIntensity = 0、内筒 2 秒不转、没有花洒水流`, offState("off"), states.off);

      // 叠放：上层底面贴着下层顶面，水平中心和占地一致
      record.stacks = {};
      for (const stack of ["A", "B"]) {
        const lower = initial[APPLIANCES.find((item) => item.stack === stack && !item.upper).entityId];
        const upper = initial[APPLIANCES.find((item) => item.stack === stack && item.upper).entityId];
        const gap = upper.min[1] - lower.max[1];
        const [lc, uc] = [center(lower), center(upper)];
        const offset = Math.hypot(uc[0] - lc[0], uc[2] - lc[2]);
        const size = (item) => [item.max[0] - item.min[0], item.max[2] - item.min[2]];
        const sizeDiff = Math.max(...size(lower).map((value, index) => Math.abs(value - size(upper)[index])));
        record.stacks[stack] = { lower: lower.userData, upper: upper.userData, gap: round(gap), centerOffset: round(offset), footprintDiff: round(sizeDiff), lowerTop: round(lower.max[1]), upperBottom: round(upper.min[1]), upperTop: round(upper.max[1]) };
        check(
          `${style}：叠放组 ${stack}（下层${lower.userData.appliance === "washer" ? "洗衣机" : "烘干机"}）上层底面贴着下层顶面（< 0.03），水平中心差 < 0.02，占地尺寸差 < 0.01`,
          Math.abs(gap) < 0.03 && offset < 0.02 && sizeDiff < 0.01,
          record.stacks[stack],
        );
      }

      // 全部 on
      await setAll(ctx, "on");
      await ctx.sleep(2500);
      await snapshot("on");
      check(
        `${style}：全部 on 时指示灯亮（> 0）、内筒 2 秒转过 > 0.2 rad、花洒有水流`,
        APPLIANCES.every((item) => {
          const value = states.on[item.entityId];
          return (!WITH_INDICATOR.has(item.appliance) || value.indicator > 0) && (!SPINNING.has(item.appliance) || value.drumDelta > 0.2) && (item.appliance !== "shower" || value.water >= 1);
        }),
        states.on,
      );

      // 截图：运行中的特写，叠放组 A 另存 stacked-washer-dryer-<style>.png
      const shots = (record.screenshots = {});
      const report = byEntity(await applianceReport(page));
      const pose = (closeup) => {
        const items = (closeup.group ?? [closeup.entityId]).map((id) => report[id]);
        const min = [0, 1, 2].map((axis) => Math.min(...items.map((item) => item.min[axis])));
        const max = [0, 1, 2].map((axis) => Math.max(...items.map((item) => item.max[axis])));
        const target = min.map((value, axis) => (value + max[axis]) / 2);
        target[1] += closeup.dy ?? 0;
        const [fx, fz] = items[0].front;
        return { target, direction: [fx + fz * 0.3, 1.1, fz - fx * 0.3] };
      };
      for (const stateName of ["on", "off"]) {
        if (stateName === "off") {
          await setAll(ctx, "off");
          await ctx.sleep(2500);
        }
        for (const closeup of CLOSEUPS) {
          const { target, direction } = pose(closeup);
          const focused = await ctx.focusOn(page, target, closeup.distance, direction);
          await ctx.sleep(800);
          const name = closeup.key === "stack-A" ? `stacked-washer-dryer-${style}${stateName === "on" ? "" : "-off"}` : `${closeup.key}-${style}-${stateName}`;
          const file = await ctx.shot(page, name);
          shots[name] = { file: path.basename(file.path), focused };
        }
      }
      check(`${style}：特写截图都对准了设备`, Object.values(shots).every((item) => item.focused), shots);

      // 再次 off（上面已切到 off）：和最初一样
      await snapshot("offAgain");
      check(`${style}：再次 off 后指示灯灭、内筒停、花洒水流消失`, offState("offAgain"), states.offAgain);
      record.states = states;
      check(`${style}：页面没有 pageerror`, page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
      await page.context().close();
    }

    // ---------- 省电画质限帧：全部停止时 0 帧，只有洗衣机在转时 ≤ 22 fps ----------
    {
      const page = await ctx.newPage({ startTime: NOON, viewport: { width: 640, height: 400 } });
      await setAll(ctx, "off");
      await ctx.gotoHome(page, { style: "glass", quality: "eco", prefs: { "ha3d.home.pet": null }, settleMs: 3000 });
      out.frames.idleSettleMs = await waitIdle(ctx, page);
      out.frames.idle5s = await ctx.countFrames(page, 5000);
      check("eco：家电全部停止、场景稳定后 5 秒 0 帧", out.frames.idle5s === 0, out.frames);
      const washer = APPLIANCES[0];
      await ctx.mock.set(washer.entityId, "on", { friendly_name: washer.name, device_class: "running", phase: "washing", remaining_min: 42 });
      await ctx.sleep(1500);
      out.frames.washerOn5s = await ctx.countFrames(page, 5000);
      check("eco：只有洗衣机在转时 5 秒内有帧且 ≤ 110 帧（≤ 22 fps）", out.frames.washerOn5s > 0 && out.frames.washerOn5s <= 110, out.frames);
      await ctx.mock.set(washer.entityId, "off", { friendly_name: washer.name, device_class: "running", phase: "idle", remaining_min: 0 });
      await ctx.sleep(4000);
      out.frames.afterOff5s = await ctx.countFrames(page, 5000);
      check("eco：洗衣机停下、内筒减速结束后不再渲染（5 秒 0 帧）", out.frames.afterOff5s === 0, out.frames);
      check("eco：页面没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
      await page.context().close();
    }

    // ---------- 编辑器：模型样式选项、平面图标记、3D 视图 ----------
    {
      const page = await ctx.newPage({ startTime: NOON });
      await ctx.gotoEditor(page, { view: "2d", style: "glass" });
      const markers = {};
      for (const item of APPLIANCES) {
        markers[item.entityId] = await page
          .locator("g.plan-device:not(.switch-light-fixture)")
          .filter({ has: page.locator("title", { hasText: new RegExp(`^${escapeRegExp(item.name)}$`) }) })
          .count();
      }
      out.editor.markers = markers;
      check("编辑器 2D：每个家电都有平面图标记", Object.values(markers).every((count) => count === 1), markers);
      const glyphs = await page.evaluate(() =>
        [...document.querySelectorAll("g.plan-device")]
          .filter((marker) => /运行|测试|出水/.test(marker.querySelector("title")?.textContent ?? ""))
          .map((marker) => ({ title: marker.querySelector("title")?.textContent, shapes: marker.querySelectorAll(".device-glyph-core, .device-glyph-stroke").length })),
      );
      out.editor.glyphs = glyphs;
      check("编辑器 2D：家电标记里有家电图标（至少一个图形）", glyphs.length === APPLIANCES.length && glyphs.every((item) => item.shapes >= 1), glyphs);
      const marker = page
        .locator("g.plan-device:not(.switch-light-fixture)")
        .filter({ has: page.locator("title", { hasText: /^洗衣机运行$/ }) })
        .first();
      await marker.dispatchEvent("click");
      await page.waitForTimeout(700);
      out.editor.modelOptions = await page.locator(".device-model-property .device-model-grid button strong").allInnerTexts();
      check("编辑器：binary_sensor 的模型样式里有 7 个家电样式", LABELS.every((label) => out.editor.modelOptions.includes(label)), out.editor.modelOptions);
      await ctx.shot(page, "editor-model-options");
      await page.evaluate(() => {
        window.__ha3dDebug = undefined;
      });
      await page.locator(".view-switch button", { hasText: "3D" }).click();
      await page.waitForSelector("canvas", { timeout: 30_000 });
      await ctx.waitForScene(page, { settleMs: 3000, requireDevices: false });
      out.editor.bodies3d = (await applianceReport(page)).length;
      check("编辑器 3D：7 个 ha3d-appliance-body 都可见", out.editor.bodies3d === APPLIANCES.length, out.editor.bodies3d);
      await ctx.shot(page, "editor-3d");
      check("编辑器：页面没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
      await page.context().close();
    }
  } finally {
    await put(current);
    await ctx.mock.reset();
  }
  await ctx.writeJson(path.join(ctx.dir, "appliances.json"), out);
  return out;
}
