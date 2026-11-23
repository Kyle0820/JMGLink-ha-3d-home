// 模型套件（plan.md 第 3 节）：F1 入户门、F2 灯具光晕、F5 新家具、F7 电脑、F8 晾衣架、B1 门框重影、B8 门不透明。
// 项目里没有对应对象时（例如个人项目没有电脑开关），该小节只记录「跳过」，不算失败。
import path from "node:path";
import { PNG } from "pngjs";
import { inwardDirection, openingCenter } from "./baseline.mjs";

const NEW_FURNITURE = ["fridge", "toilet", "bathroom_cabinet", "chest_of_drawers", "dog_crate"];
const STYLES = ["glass", "cream"];
// 昼夜主题按本机时钟 7–18 点切换，固定时间让结果可重复
const DAY = "2026-06-01T12:00:00";
const NIGHT = "2026-06-01T22:00:00";

/** 等相机停止过渡（连续两次读数位移 < 1 mm），返回机位 { target, distance, direction }。 */
async function stableCamera(ctx, page, timeoutMs = 12_000) {
  const deadline = Date.now() + timeoutMs;
  let previous = await ctx.readCamera(page);
  let stableCount = 0;
  while (Date.now() < deadline && stableCount < 2) {
    await page.waitForTimeout(400);
    const current = await ctx.readCamera(page);
    const moved = Math.hypot(...current.position.map((value, index) => value - previous.position[index]));
    stableCount = moved < 0.001 ? stableCount + 1 : 0;
    previous = current;
  }
  const offset = previous.position.map((value, index) => value - previous.target[index]);
  const distance = Math.hypot(...offset);
  const { fov, viewHeightPx } = await page.evaluate(() => {
    const s = window.__ha3dDebug.get();
    return { fov: s.camera.fov ?? 32, viewHeightPx: s.gl.domElement.getBoundingClientRect().height };
  });
  return { target: previous.target, distance, direction: offset.map((value) => value / distance), fov, viewHeightPx };
}

/** 画面中部亮度的标准差：接近 0 说明截图是一片纯色（相机在墙里或被遮挡）。 */
function lumaSpread(buffer) {
  const png = PNG.sync.read(buffer);
  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let y = Math.round(png.height * 0.28); y < png.height * 0.88; y += 4)
    for (let x = Math.round(png.width * 0.2); x < png.width * 0.76; x += 4) {
      const offset = (png.width * y + x) * 4;
      const luma = 0.2126 * png.data[offset] + 0.7152 * png.data[offset + 1] + 0.0722 * png.data[offset + 2];
      sum += luma;
      sumSq += luma * luma;
      count += 1;
    }
  const mean = sum / count;
  return Math.sqrt(Math.max(0, sumSq / count - mean * mean));
}

/** PNG 里 (x,y) 半径 r 内的平均 RGB。 */
function sampleRgb(buffer, x, y, r = 10) {
  const png = PNG.sync.read(buffer);
  const sum = [0, 0, 0];
  let count = 0;
  for (let dy = -r; dy <= r; dy += 1)
    for (let dx = -r; dx <= r; dx += 1) {
      if (dx * dx + dy * dy > r * r) continue;
      const px = Math.round(x + dx);
      const py = Math.round(y + dy);
      if (px < 0 || py < 0 || px >= png.width || py >= png.height) continue;
      const offset = (png.width * py + px) * 4;
      for (let channel = 0; channel < 3; channel += 1) sum[channel] += png.data[offset + channel];
      count += 1;
    }
  return sum.map((value) => Math.round(value / Math.max(1, count)));
}

/** 场景里所有门框 / 门扇，按 openingId 汇总材质、描边数量和包围盒中心。 */
async function doorReport(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    if (!s) return [];
    s.scene.updateMatrixWorld(true);
    const info = (m) => ({
      type: m.type,
      transparent: m.transparent,
      opacity: Number(m.opacity.toFixed(3)),
      depthWrite: m.depthWrite,
      color: m.color ? `#${m.color.getHexString()}` : undefined,
      emissive: m.emissive ? `#${m.emissive.getHexString()}` : undefined,
      emissiveIntensity: m.emissiveIntensity,
    });
    const centerOf = (root) => {
      let box = null;
      root.traverse((o) => {
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (!o.isMesh || !o.geometry || m?.type === "LineMaterial") return;
        if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld);
        box = box ? box.union(b) : b;
      });
      if (!box) return null;
      const c = box.getCenter(box.min.clone());
      return [c.x, c.y, c.z];
    };
    const byId = {};
    s.scene.traverse((o) => {
      if (o.name !== "ha3d-door-frame" && o.name !== "ha3d-door-leaf") return;
      const id = o.userData?.openingId ?? "?";
      const rec = (byId[id] ??= { openingId: id, doorStyle: o.userData?.doorStyle, frames: 0, leaves: 0, frameEdges: 0, leafEdges: [], frameMaterials: [], leafMaterials: [], leafCenters: [], leafRotations: [] });
      const materials = [];
      let edges = 0;
      o.traverse((c) => {
        const m = Array.isArray(c.material) ? c.material[0] : c.material;
        if (!m) return;
        if (m.type === "LineMaterial" || c.isLineSegments) {
          edges += 1;
          if (o.name === "ha3d-door-leaf") (rec.leafEdgeMaterials ??= []).push({ color: m.color ? `#${m.color.getHexString()}` : undefined, opacity: Number(m.opacity.toFixed(3)) });
          return;
        }
        if (c.isMesh) materials.push(info(m));
      });
      if (o.name === "ha3d-door-frame") {
        rec.frames += 1;
        rec.frameEdges += edges;
        rec.frameMaterials.push(...materials);
        rec.frameCenter = centerOf(o);
      } else {
        rec.leaves += 1;
        rec.leafRotations.push(Number(o.rotation.y.toFixed(3)));
        rec.leafEdges.push(edges);
        rec.leafMaterials.push(...materials);
        rec.leafCenters.push(centerOf(o));
      }
    });
    return Object.values(byId);
  });
}

/** 所有 ha3d-light-halo：所属设备、屏幕位置（取设备组原点，即灯的位置）和材质参数。 */
async function haloReport(page) {
  return page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    if (!s) return [];
    s.scene.updateMatrixWorld(true);
    const rect = s.gl.domElement.getBoundingClientRect();
    const out = [];
    s.scene.traverse((o) => {
      if (o.name !== "ha3d-light-halo") return;
      let group = o.parent;
      while (group && !group.userData?.focusEntityId) group = group.parent;
      // 取光晕自身的位置：吸顶灯就在灯体上，落地灯在灯头高度（设备原点在地面）
      const world = o.getWorldPosition(o.position.clone());
      const p = world.clone().project(s.camera);
      const x = rect.left + ((p.x + 1) / 2) * rect.width;
      const y = rect.top + ((1 - p.y) / 2) * rect.height;
      const inView = p.z > -1 && p.z < 1 && Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1;
      out.push({
        entityId: group?.userData?.focusEntityId ?? null,
        world: [world.x, world.y, world.z].map((v) => Number(v.toFixed(3))),
        x,
        y,
        inView,
        onCanvas: inView && document.elementFromPoint(x, y) === s.gl.domElement,
        size: Number(o.scale.x.toFixed(3)),
        opacity: Number(o.material.opacity.toFixed(3)),
        color: `#${o.material.color.getHexString()}`,
        additive: o.material.blending === 2,
        depthWrite: o.material.depthWrite,
        toneMapped: o.material.toneMapped,
        renderOrder: o.renderOrder,
        raycastDisabled: o.raycast.toString().replace(/\s/g, "") === "()=>{}",
      });
    });
    return out;
  });
}

/** 按名字找对象（可限定在某个实体的设备组下），返回世界坐标和材质参数。 */
async function namedObjects(page, name, entityId) {
  return page.evaluate(
    ({ name, entityId }) => {
      const s = window.__ha3dDebug?.get();
      if (!s) return [];
      s.scene.updateMatrixWorld(true);
      const out = [];
      s.scene.traverse((o) => {
        if (o.name !== name) return;
        let group = o.parent;
        while (group && !group.userData?.focusEntityId) group = group.parent;
        if (entityId && group?.userData?.focusEntityId !== entityId) return;
        const world = o.getWorldPosition(o.position.clone());
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        out.push({
          entityId: group?.userData?.focusEntityId ?? null,
          userData: { ...o.userData },
          world: [world.x, world.y, world.z],
          emissiveIntensity: m?.emissiveIntensity,
          emissive: m?.emissive ? `#${m.emissive.getHexString()}` : undefined,
          color: m?.color ? `#${m.color.getHexString()}` : undefined,
        });
      });
      return out;
    },
    { name, entityId },
  );
}

const wallOf = (floor, opening) => floor.walls.find((wall) => wall.id === opening.wallId);

/** 平面里从 origin 沿 dir 出发，到最近一面墙（排除 skipId）的距离。 */
function wallClearance(floor, origin, dir, skipId) {
  let best = Infinity;
  for (const wall of floor.walls) {
    if (wall.id === skipId) continue;
    const ex = wall.end[0] - wall.start[0];
    const ey = wall.end[1] - wall.start[1];
    const denominator = dir[0] * ey - dir[1] * ex;
    if (Math.abs(denominator) < 1e-9) continue;
    const ox = wall.start[0] - origin[0];
    const oy = wall.start[1] - origin[1];
    const t = (ox * ey - oy * ex) / denominator;
    const u = (ox * dir[1] - oy * dir[0]) / denominator;
    if (t > 0.05 && u >= -0.02 && u <= 1.02) best = Math.min(best, t - (wall.thickness ?? 0.12) / 2);
  }
  return best;
}

/**
 * 门的特写机位：默认沿 inwardDirection；相机最近只能离 target 3 m（OrbitControls minDistance），
 * 房间进深不够时相机会跑到对面墙后面（奶油风格的墙不透明，截图一片空白）。
 * 这时换到进深更大的一侧，仍不够就抬高俯角，让相机的水平距离留在房间里。
 */
function doorView(floor, opening, distance = 3.2) {
  const wall = wallOf(floor, opening);
  const preferred = inwardDirection(floor, opening);
  const planCenter = openingCenter(floor, opening);
  const origin = [planCenter[0], planCenter[2]];
  const normal = [preferred[0], preferred[2]];
  const length = Math.hypot(...normal) || 1;
  const sides = [normal, [-normal[0], -normal[1]]].map((side) => {
    const dir = [side[0] / length, side[1] / length];
    return { dir, clearance: wallClearance(floor, origin, dir, wall?.id) };
  });
  const elevation = Math.atan2(preferred[1], length);
  const fits = (side) => side.clearance - 0.3 >= distance * Math.cos(elevation);
  const side = fits(sides[0]) ? sides[0] : sides[1].clearance > sides[0].clearance ? sides[1] : sides[0];
  const cosine = Math.min(Math.cos(elevation), Math.max(Math.cos((68 * Math.PI) / 180), (side.clearance - 0.3) / distance));
  const sine = Math.sqrt(1 - cosine * cosine);
  return { direction: [side.dir[0] * cosine, sine, side.dir[1] * cosine], distance, clearance: Number(side.clearance.toFixed(2)) };
}

/**
 * 在 doorView 的基础上挑一个没有遮挡的机位：两侧 × 多个俯角 × 左右偏转，逐个在页面里做射线检测，
 * 从相机到门扇中心（以及墙面采样点）之间的第一个不透明物体必须就是目标本身（家具、柜子不能挡在中间）。
 */
async function clearDoorView(page, floor, opening, targetWorld, points, distance = 3.2) {
  const base = doorView(floor, opening, distance);
  const horizontal = [base.direction[0], base.direction[2]];
  const length = Math.hypot(...horizontal) || 1;
  const candidates = [base.direction];
  for (const side of [1, -1])
    for (const elevationDeg of [29, 42, 56, 68])
      for (const yawDeg of [0, 25, -25]) {
        const yaw = (yawDeg * Math.PI) / 180;
        const hx = (side * horizontal[0]) / length;
        const hz = (side * horizontal[1]) / length;
        const rx = hx * Math.cos(yaw) - hz * Math.sin(yaw);
        const rz = hx * Math.sin(yaw) + hz * Math.cos(yaw);
        const elevation = (elevationDeg * Math.PI) / 180;
        candidates.push([rx * Math.cos(elevation), Math.sin(elevation), rz * Math.cos(elevation)]);
      }
  const index = await page.evaluate(
    ({ candidates, targetWorld, points, distance, openingId }) => {
      const s = window.__ha3dDebug?.get();
      if (!s) return 0;
      s.scene.updateMatrixWorld(true);
      const V = s.camera.position.constructor;
      const Raycaster = s.raycaster.constructor;
      const raycaster = new Raycaster();
      const opaque = (hit) => {
        const material = Array.isArray(hit.object.material) ? hit.object.material[0] : hit.object.material;
        if (!hit.object.isMesh || !material || !hit.object.visible || material.visible === false) return false;
        return !(material.transparent && material.opacity < 0.6);
      };
      const inLeaf = (object) => {
        for (let node = object; node; node = node.parent) if (node.name === "ha3d-door-leaf" && node.userData?.openingId === openingId) return true;
        return false;
      };
      raycaster.camera = s.camera;
      const target = new V(...targetWorld);
      for (const [index, direction] of candidates.entries()) {
        const origin = target.clone().add(new V(...direction).normalize().multiplyScalar(distance));
        // 相机到采样点之间不能有不透明物体（玻璃风格的墙是半透明的，不算遮挡）
        const clear = points.every(({ world }) => {
          const toPoint = new V(...world).sub(origin);
          const pointDistance = toPoint.length();
          raycaster.set(origin, toPoint.normalize());
          raycaster.far = pointDistance;
          return !raycaster.intersectObjects(s.scene.children, true).some((hit) => opaque(hit) && !inLeaf(hit.object) && hit.distance < pointDistance - 0.12);
        });
        if (clear) return index;
      }
      return -1;
    },
    { candidates, targetWorld, points, distance, openingId: opening.id },
  );
  return { ...base, direction: candidates[Math.max(0, index)], candidate: index };
}

/** 门旁边一段墙面上的采样点（平面坐标 [x, 高度, y]），取门洞两侧中剩余墙长较大的一侧。 */
function wallSamplePoint(floor, opening) {
  const wall = wallOf(floor, opening);
  const dx = wall.end[0] - wall.start[0];
  const dy = wall.end[1] - wall.start[1];
  const length = Math.hypot(dx, dy) || 1;
  const startRoom = opening.offset - opening.width / 2;
  const endRoom = length - opening.offset - opening.width / 2;
  const along = startRoom > endRoom ? opening.offset - opening.width / 2 - Math.min(0.4, startRoom / 2) : opening.offset + opening.width / 2 + Math.min(0.4, endRoom / 2);
  return [wall.start[0] + (dx / length) * along, 1.2, wall.start[1] + (dy / length) * along];
}

const round = (value, digits = 1) => Number(Number(value).toFixed(digits));

export default async function models(ctx) {
  const { check, log } = ctx;
  const floor = ctx.project.floors[0];
  const doors = floor.openings.filter((opening) => opening.type === "door");
  const boundDoors = doors.filter((opening) => opening.entityId && opening.hasLeaf !== false);
  const out = { B1: {}, B8: {}, F1: {}, F2: {}, F5: {}, F7: {}, F8: {} };

  // ---------- B1 / B8 / F1：门（两种风格） ----------
  // 门的特写里关掉所有灯：灯具的光锥会叠在门扇上，干扰门扇和墙的亮度对比
  const lightSwitches = floor.devices.filter((device) => device.entityId.startsWith("light.") || (device.entityId.startsWith("switch.") && device.controlledLightFixtures?.length)).map((device) => device.entityId);
  for (const style of STYLES) {
    const page = await ctx.newPage({ startTime: DAY });
    for (const door of boundDoors) await ctx.mock.set(door.entityId, "off");
    for (const entityId of lightSwitches) await ctx.mock.set(entityId, "off");
    await ctx.gotoHome(page, { style });
    const report = await doorReport(page);
    const byId = new Map(report.map((item) => [item.openingId, item]));
    out.B8[style] = { leaves: [], luma: [] };
    out.B1[style] = { doors: {} };
    out.F1[style] = {};

    // B1：每个门洞只有一个门框组；门框不透明；门扇最多一层描边
    const frameCounts = Object.fromEntries(doors.map((door) => [door.id, byId.get(door.id)?.frames ?? 0]));
    check(`B1[${style}] 每个门洞只有一个 ha3d-door-frame`, doors.length > 0 && Object.values(frameCounts).every((count) => count === 1), frameCounts);
    const frameMaterials = report.flatMap((item) => item.frameMaterials);
    check(`B1[${style}] 门框材质全部不透明`, frameMaterials.length > 0 && frameMaterials.every((m) => m.transparent === false && m.opacity === 1 && m.depthWrite === true), { count: frameMaterials.length });
    check(`B1[${style}] 每个门扇最多一层描边`, report.every((item) => item.leafEdges.every((count) => count <= 1)), report.map((item) => ({ id: item.openingId, leafEdges: item.leafEdges, frameEdges: item.frameEdges })));

    // B8：门扇材质不透明
    const leafMaterials = report.flatMap((item) => item.leafMaterials.map((m) => ({ openingId: item.openingId, ...m })));
    out.B8[style].leaves = leafMaterials;
    check(`B8[${style}] 门扇材质 transparent=false 且 opacity=1`, leafMaterials.length > 0 && leafMaterials.every((m) => m.transparent === false && m.opacity === 1), { count: leafMaterials.length, sample: leafMaterials.slice(0, 2) });

    // F1：入户门的 userData
    const entrances = doors.filter((door) => door.doorStyle === "entrance");
    if (entrances.length) {
      const ok = entrances.every((door) => byId.get(door.id)?.doorStyle === "entrance" && byId.get(door.id)?.leaves === 1);
      check(`F1[${style}] 入户门的 ha3d-door-leaf.userData.doorStyle === "entrance"`, ok, entrances.map((door) => ({ id: door.id, ...byId.get(door.id) && { doorStyle: byId.get(door.id).doorStyle, leaves: byId.get(door.id).leaves } })));
    }

    // 绑定门磁的门：关、开两种状态各一张特写；关门时采样门扇和墙的亮度（B8）
    for (const door of boundDoors) {
      const center = await ctx.planToWorld(page, openingCenter(floor, door));
      // 关门状态下找一个能同时看清门扇中心和旁边墙面的机位，开门截图沿用同一机位
      await ctx.mock.set(door.entityId, "off");
      await page.waitForTimeout(1200);
      const leafCenter = (await doorReport(page)).find((item) => item.openingId === door.id)?.leafCenters?.[0];
      const wallWorld = await ctx.planToWorld(page, wallSamplePoint(floor, door));
      const view = leafCenter ? await clearDoorView(page, floor, door, center, [{ world: leafCenter }, { world: wallWorld }]) : doorView(floor, door);
      const record = { view };
      for (const [stateName, value] of [
        ["closed", "off"],
        ["open", "on"],
      ]) {
        await ctx.mock.set(door.entityId, value);
        await page.waitForTimeout(1500);
        const focused = await ctx.focusOn(page, center, view.distance, view.direction);
        const file = await ctx.shot(page, `B1-door-${style}-${door.id}-${stateName}`);
        const doorNow = (await doorReport(page)).find((item) => item.openingId === door.id);
        record[stateName] = { screenshot: path.basename(file.path), focused, spread: round(lumaSpread(file.buffer)), frames: doorNow?.frames, leafEdges: doorNow?.leafEdges, frameEdges: doorNow?.frameEdges, leafRotations: doorNow?.leafRotations, leafMaterial: doorNow?.leafMaterials?.[0], leafEdgeMaterial: doorNow?.leafEdgeMaterials?.[0] };
        if (doorNow?.leafCenters?.[0]) {
          const point = await ctx.projectToScreen(page, doorNow.leafCenters[0]);
          record[stateName].leafRgb = point?.onCanvas ? sampleRgb(file.buffer, point.x, point.y, 6) : undefined;
        }
        // 0.2.3：打开的门扇不再单独设颜色（0.2.1 薄荷绿、0.2.2 白色），材质颜色、自发光、描边都和关门时一样
        if (stateName === "open") {
          const a = record.closed.leafMaterial,
            b = record.open.leafMaterial,
            ea = record.closed.leafEdgeMaterial,
            eb = record.open.leafEdgeMaterial;
          check(
            `门扇[${style}] ${door.id} 打开和关闭的颜色一致：材质颜色、自发光颜色和强度、描边颜色和不透明度都相同`,
            a && b && a.color === b.color && a.emissive === b.emissive && a.emissiveIntensity === b.emissiveIntensity && JSON.stringify(ea) === JSON.stringify(eb),
            { closed: { material: a, edge: ea, rgb: record.closed.leafRgb }, open: { material: b, edge: eb, rgb: record.open.leafRgb } },
          );
        }
        // 纯色画面的亮度标准差约 0–2；FEAT-005 起主光源跟随太阳方位，开门特写里门扇和墙的明暗更接近（APT 有两张降到 6–8），阈值取 5
        check(`B1[${style}] ${door.id} ${stateName === "closed" ? "关门" : "开门"}特写有效（机位到位、画面不是纯色）`, focused && record[stateName].spread >= 5, { focused, spread: record[stateName].spread, view });
        if (stateName === "closed" && doorNow?.leafCenters?.[0]) {
          const leafPoint = await ctx.projectToScreen(page, doorNow.leafCenters[0]);
          const wallPoint = await ctx.projectToScreen(page, await ctx.planToWorld(page, wallSamplePoint(floor, door)));
          const leafLuma = ctx.sampleLuma(file.buffer, leafPoint.x, leafPoint.y, 10);
          const wallLuma = ctx.sampleLuma(file.buffer, wallPoint.x, wallPoint.y, 10);
          const sample = { openingId: door.id, doorStyle: door.doorStyle, leafLuma: round(leafLuma), wallLuma: round(wallLuma), diff: round(Math.abs(leafLuma - wallLuma)), leafPoint, wallPoint };
          out.B8[style].luma.push(sample);
          check(`B8[${style}] ${door.id} 门扇与墙的平均亮度差 ≥ 20`, leafPoint.onCanvas && wallPoint.onCanvas && sample.diff >= 20, sample);
          const key = door.doorStyle === "entrance" ? "entrance" : "normal";
          out.F1[style][`${key}LeafLuma`] ??= sample.leafLuma;
          out.F1[style][`${key}LeafRgb`] ??= sampleRgb(file.buffer, leafPoint.x, leafPoint.y, 10);
        }
      }
      const swing = Math.abs((record.open.leafRotations?.[0] ?? 0) - (record.closed.leafRotations?.[0] ?? 0));
      check(`B1[${style}] ${door.id} 门磁打开后门扇实时转开（不刷新页面）`, swing > 0.3, { closed: record.closed.leafRotations, open: record.open.leafRotations });
      await ctx.mock.set(door.entityId, "off");
      out.B1[style].doors[door.id] = record;
    }

    // F1：入户门和普通门的特写，以及门扇亮度对比
    const normal = doors.find((door) => door.doorStyle !== "entrance" && door.hasLeaf !== false);
    for (const [label, door] of [
      ["entrance", entrances[0]],
      ["normal", normal],
    ]) {
      if (!door) continue;
      const center = await ctx.planToWorld(page, openingCenter(floor, door));
      const leafCenter = (await doorReport(page)).find((item) => item.openingId === door.id)?.leafCenters?.[0];
      const view = leafCenter ? await clearDoorView(page, floor, door, center, [{ world: leafCenter }]) : doorView(floor, door);
      await ctx.focusOn(page, center, view.distance, view.direction);
      const file = await ctx.shot(page, `F1-${label}-${style}`);
      if (!door.entityId) {
        const leafCenter = (await doorReport(page)).find((item) => item.openingId === door.id)?.leafCenters?.[0];
        const point = leafCenter && (await ctx.projectToScreen(page, leafCenter));
        if (point?.onCanvas) {
          out.F1[style][`${label}LeafLuma`] ??= round(ctx.sampleLuma(file.buffer, point.x, point.y, 10));
          out.F1[style][`${label}LeafRgb`] ??= sampleRgb(file.buffer, point.x, point.y, 10);
        }
      }
    }
    if (entrances.length && normal) {
      const { entranceLeafLuma: a, normalLeafLuma: b, entranceLeafRgb: ra, normalLeafRgb: rb } = out.F1[style];
      out.F1[style].rgbDistance = ra && rb ? round(Math.hypot(ra[0] - rb[0], ra[1] - rb[1], ra[2] - rb[2])) : undefined;
      check(
        `F1[${style}] 入户门和普通门可以区分（门扇亮度差 ≥ 15 或颜色距离 ≥ 30）`,
        a !== undefined && b !== undefined && (Math.abs(a - b) >= 15 || out.F1[style].rgbDistance >= 30),
        out.F1[style],
      );
    }
    await page.context().close();
  }

  // ---------- F2：灯具开灯时的光晕 ----------
  {
    const lightDevices = floor.devices.filter((device) => device.entityId.startsWith("light."));
    const switchFixtures = floor.devices.filter((device) => device.entityId.startsWith("switch.") && device.controlledLightFixtures?.length);
    const lightEntities = [...new Set([...lightDevices.map((device) => device.entityId), ...switchFixtures.map((device) => device.entityId)])];
    // 只对明确选了非灯带模型的灯断言光晕；没写 modelId 的灯按名称自动识别，可能是灯带
    const expectHalo = new Set([
      ...lightDevices.filter((device) => device.modelId && !device.modelId.includes("strip")).map((device) => device.entityId),
      ...switchFixtures.filter((device) => device.controlledLightFixtures.some((fixture) => !(fixture.modelId ?? "").includes("strip"))).map((device) => device.entityId),
    ]);
    const setAll = async (on) => {
      for (const entityId of lightEntities) await ctx.mock.set(entityId, on ? "on" : "off", entityId.startsWith("light.") ? { brightness: on ? 200 : null } : undefined);
    };
    for (const [style, time, perLight] of [
      ["glass", DAY, true],
      ["cream", DAY, true],
      ["glass", NIGHT, false],
    ]) {
      const label = `${style}-${time === DAY ? "day" : "night"}`;
      // FEAT-005 起「时间与天气同步」默认开启，有 sun.sun 时昼夜跟太阳高度走：夜晚这一轮同时把太阳设到地平线以下
      await ctx.mock.set("sun.sun", time === DAY ? "above_horizon" : "below_horizon", time === DAY ? { elevation: 45, azimuth: 180, rising: false } : { elevation: -20, azimuth: 340, rising: false });
      const page = await ctx.newPage({ startTime: time });
      await setAll(false);
      await ctx.gotoHome(page, { style });
      // 首页加载后相机还会过渡一段时间：等稳定后记下机位，每次截图前重新设回同一机位
      const pose = await stableCamera(ctx, page);
      const reassert = () => ctx.focusOn(page, pose.target, pose.distance, pose.direction);
      await reassert();
      const offHalos = await haloReport(page);
      const off = await ctx.shot(page, `F2-${label}-all-off`);
      await setAll(true);
      await page.waitForTimeout(2500);
      await reassert();
      const onHalos = await haloReport(page);
      const on = await ctx.shot(page, `F2-${label}-all-on`);
      const record = { offHalos: offHalos.length, onHalos: onHalos.length, pose, lights: [] };
      const withHalo = new Set(onHalos.map((halo) => halo.entityId));
      for (const halo of onHalos) {
        const item = { ...halo, x: round(halo.x), y: round(halo.y) };
        // 全屋视角下的亮度变化，只记录：户型越大，同一盏灯在屏幕上越小
        if (halo.onCanvas) item.overviewDelta = round(ctx.sampleLuma(on.buffer, halo.x, halo.y, 24) - ctx.sampleLuma(off.buffer, halo.x, halo.y, 24));
        record.lights.push(item);
      }
      // 判定用的逐灯取景：沿全屋视角方向对准这盏灯，取景让 24 px 采样圆不超过光晕半径（最小 80 px/m），
      // 开灯、关灯各截一张同机位的图，比较灯所在位置的平均亮度
      if (perLight) {
        for (const [index, item] of record.lights.entries()) {
          item.pxPerMeter = Math.max(80, 24 / (item.size / 2));
          item.cameraDistance = round(Math.max(3.2, pose.viewHeightPx / (item.pxPerMeter * 2 * Math.tan((pose.fov * Math.PI) / 360))), 2);
          await ctx.focusOn(page, item.world, item.cameraDistance, pose.direction);
          const point = await ctx.projectToScreen(page, item.world);
          const shotOn = await ctx.shot(page, `F2-${label}-light${index}-on`);
          item.closeUp = { x: round(point.x), y: round(point.y), onCanvas: point.onCanvas, lumaOn: round(ctx.sampleLuma(shotOn.buffer, point.x, point.y, 24)) };
        }
        await setAll(false);
        await page.waitForTimeout(2000);
        for (const [index, item] of record.lights.entries()) {
          await ctx.focusOn(page, item.world, item.cameraDistance, pose.direction);
          const point = await ctx.projectToScreen(page, item.world);
          const shotOff = await ctx.shot(page, `F2-${label}-light${index}-off`);
          item.closeUp.lumaOff = round(ctx.sampleLuma(shotOff.buffer, point.x, point.y, 24));
          item.closeUp.moved = round(Math.hypot(point.x - item.closeUp.x, point.y - item.closeUp.y));
          item.delta = round(item.closeUp.lumaOn - item.closeUp.lumaOff);
        }
      }
      await setAll(false);
      await page.waitForTimeout(1500);
      await reassert();
      const afterHalos = await haloReport(page);
      record.afterHalos = afterHalos.length;
      await ctx.shot(page, `F2-${label}-off-again`);
      record.missing = [...expectHalo].filter((entityId) => !withHalo.has(entityId));
      out.F2[label] = record;
      check(`F2[${label}] 关灯时没有 ha3d-light-halo`, offHalos.length === 0, { count: offHalos.length });
      check(`F2[${label}] 开灯后每盏（非灯带）灯都有 ha3d-light-halo`, expectHalo.size > 0 && record.missing.length === 0, { expected: expectHalo.size, halos: onHalos.length, missing: record.missing });
      check(
        `F2[${label}] 光晕材质：加法混合、toneMapped=false、depthWrite=false、renderOrder=10、不参与拾取`,
        onHalos.length > 0 && onHalos.every((halo) => halo.additive && !halo.toneMapped && !halo.depthWrite && halo.renderOrder === 10 && halo.raycastDisabled),
        onHalos.slice(0, 2),
      );
      if (perLight) {
        const measured = record.lights.filter((item) => item.closeUp?.onCanvas);
        check(
          `F2[${label}] 灯所在位置（半径 24 px）平均亮度提升 ≥ 25（逐灯对准取景）`,
          measured.length === record.lights.length && measured.length > 0 && measured.every((item) => item.delta >= 25 && item.closeUp.moved < 3),
          measured.map((item) => ({ entityId: item.entityId, size: item.size, delta: item.delta, overviewDelta: item.overviewDelta })),
        );
      }
      if (switchFixtures.length) check(`F2[${label}] 开关控制的灯具同样出现光晕`, switchFixtures.every((device) => withHalo.has(device.entityId)), switchFixtures.map((device) => device.entityId));
      check(`F2[${label}] 关灯后光晕消失`, afterHalos.length === 0, { count: afterHalos.length });
      await page.context().close();
    }
    await ctx.mock.reset();
  }

  // ---------- F5 / F7 / F8：新家具、电脑、晾衣架（玻璃风格） ----------
  const page = await ctx.newPage({ startTime: DAY });
  await ctx.gotoHome(page);
  await stableCamera(ctx, page);

  // F5：每种新家具都存在对应的 ha3d-furniture-<kind>，并各有一张特写
  const kinds = NEW_FURNITURE.filter((kind) => floor.furniture.some((item) => item.kind === kind));
  out.F5.kinds = {};
  for (const kind of kinds) {
    const objects = await namedObjects(page, `ha3d-furniture-${kind}`);
    const item = floor.furniture.find((furniture) => furniture.kind === kind);
    out.F5.kinds[kind] = { count: objects.length, expected: floor.furniture.filter((furniture) => furniture.kind === kind).length };
    check(`F5 3D 里存在 ha3d-furniture-${kind}`, objects.length === out.F5.kinds[kind].expected, out.F5.kinds[kind]);
    const target = objects.find((object) => object.userData.furnitureId === item.id) ?? objects[0];
    if (target) {
      const rotation = item.rotation ?? 0;
      await ctx.focusOn(page, [target.world[0], target.world[1] + 0.5, target.world[2]], 3, [Math.sin(rotation), 0.85, -Math.cos(rotation)]);
      out.F5.kinds[kind].screenshot = path.basename((await ctx.shot(page, `F5-${kind}`)).path);
    }
  }
  if (!kinds.length) out.F5.skipped = "项目里没有新家具（editor 套件会放置并检查）";

  // F7：电脑开关，开时屏幕自发光，关时为 0
  const computers = floor.devices.filter((device) => device.modelId === "switch.computer");
  for (const device of computers) {
    const world = await ctx.planToWorld(page, device.position);
    const record = {};
    for (const [stateName, value] of [
      ["off", "off"],
      ["on", "on"],
    ]) {
      await ctx.mock.set(device.entityId, value);
      await page.waitForTimeout(1500);
      await ctx.focusOn(page, [world[0], world[1] + 0.3, world[2]], 3, [0.35, 0.75, 1]);
      const screens = await namedObjects(page, "ha3d-computer-screen", device.entityId);
      record[stateName] = { screens: screens.length, emissiveIntensity: screens[0]?.emissiveIntensity, emissive: screens[0]?.emissive, color: screens[0]?.color, screenshot: path.basename((await ctx.shot(page, `F7-computer-${stateName}`)).path) };
    }
    out.F7[device.entityId] = record;
    check(`F7 ${device.entityId} 开时 emissiveIntensity > 0`, record.on.screens === 1 && record.on.emissiveIntensity > 0, record.on);
    check(`F7 ${device.entityId} 关时 emissiveIntensity = 0`, record.off.screens === 1 && record.off.emissiveIntensity === 0, record.off);
    await ctx.mock.set(device.entityId, "off");
  }
  if (!computers.length) out.F7.skipped = "项目里没有 switch.computer 设备";

  // F8：晾衣架 position 0（closed）→ 100（open），横杆世界坐标下降 ≥ 0.5 m（0.2.1 起 open 表示降下）
  const racks = floor.devices.filter((device) => device.modelId === "cover.clothes_rack");
  for (const device of racks) {
    const world = await ctx.planToWorld(page, device.position);
    const yaw = device.rotation?.[1] ?? 0;
    // 横杆沿本地 x 方向；相机放在垂直于横杆、朝房间中心的一侧
    const room = floor.rooms.find((item) => item.id === device.roomId);
    const centroid = room ? room.polygon.reduce((sum, [x, y]) => [sum[0] + x / room.polygon.length, sum[1] + y / room.polygon.length], [0, 0]) : [device.position[0], device.position[2] + 1];
    let perpendicular = [Math.sin(yaw), Math.cos(yaw)];
    if (perpendicular[0] * (centroid[0] - device.position[0]) + perpendicular[1] * (centroid[1] - device.position[2]) < 0) perpendicular = [-perpendicular[0], -perpendicular[1]];
    const direction = [perpendicular[0], 0.35, perpendicular[1]];
    const record = {};
    for (const [stateName, value, position] of [
      ["up", "closed", 0],
      ["down", "open", 100],
    ]) {
      await ctx.mock.set(device.entityId, value, { current_position: position });
      await page.waitForTimeout(3000);
      await ctx.focusOn(page, [world[0], world[1] - 0.9, world[2]], 4.6, direction);
      const bars = await namedObjects(page, "ha3d-clothes-rack-bars", device.entityId);
      record[stateName] = { position, bars: bars.length, barsWorldY: bars[0] && round(bars[0].world[1], 3), screenshot: path.basename((await ctx.shot(page, `F8-clothes-rack-${stateName}`)).path) };
    }
    record.drop = round(record.up.barsWorldY - record.down.barsWorldY, 3);
    out.F8[device.entityId] = record;
    // 0.2.2 起伸缩杆最长 0.5 m（收起 0.15 m），横杆最多下降 0.35 m
    check(`F8 ${device.entityId} position 0 → 100 时横杆下降 0.3–0.36 m（伸缩杆最长 0.5 m）`, record.up.bars === 1 && record.down.bars === 1 && record.drop >= 0.3 && record.drop <= 0.36, record);
  }
  if (!racks.length) out.F8.skipped = "项目里没有 cover.clothes_rack 设备";

  check("models 套件没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
  log(`B8 亮度：${JSON.stringify(Object.fromEntries(STYLES.map((style) => [style, out.B8[style].luma.map((item) => item.diff)])))}`);
  await ctx.writeJson(path.join(ctx.dir, "models.json"), out);
  return {
    B8luma: Object.fromEntries(STYLES.map((style) => [style, out.B8[style].luma.map(({ openingId, leafLuma, wallLuma, diff }) => ({ openingId, leafLuma, wallLuma, diff }))])),
    F1: out.F1,
    F2: Object.fromEntries(
      Object.entries(out.F2).map(([label, record]) => [
        label,
        { onHalos: record.onHalos, afterHalos: record.afterHalos, deltas: record.lights.map((item) => ({ entityId: item.entityId, size: item.size, delta: item.delta, overviewDelta: item.overviewDelta })) },
      ]),
    ),
    F7: out.F7,
    F8: out.F8,
    F5: out.F5,
  };
}

// fixes023 复用门的读取和机位
export { doorReport, clearDoorView, doorView, sampleRgb };
