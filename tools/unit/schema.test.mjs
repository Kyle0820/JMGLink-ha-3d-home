// schema：doorStyle=entrance 和 4 种新家具 kind；未知取值的退回逻辑不变；旧项目向后兼容。
// 设置 HA3D_UPSTREAM_APP 时，fixture 和（设置了 HA3D_PROJECT_JSON 时的）自定义项目分别经过新旧
// normalizeFloorplanProject，去掉 createdAt / updatedAt 后必须深度相等。
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { normalizeFloorplanProject, normalizeFurniture, normalizeOpening } from "../../jmglink-ha-3d-home/app/packages/schema/dist/index.js";

const fixturePath = fileURLToPath(new URL("../fixtures/demo-project.json", import.meta.url));

test("doorStyle：门保留 double / entrance，其他取值变成 single", () => {
  assert.equal(normalizeOpening({ id: "d1", type: "door", wallId: "w", doorStyle: "entrance" }).doorStyle, "entrance");
  assert.equal(normalizeOpening({ id: "d2", type: "door", wallId: "w", doorStyle: "double" }).doorStyle, "double");
  assert.equal(normalizeOpening({ id: "d3", type: "door", wallId: "w", doorStyle: "garage" }).doorStyle, "single");
  assert.equal(normalizeOpening({ id: "d4", type: "door", wallId: "w" }).doorStyle, "single");
  assert.equal(normalizeOpening({ id: "w1", type: "window", wallId: "w", doorStyle: "entrance" }).doorStyle, "single");
});

test("新家具 kind 保留，并使用默认尺寸", () => {
  const expected = {
    fridge: { width: 0.7, depth: 0.68, height: 1.8 },
    bathroom_cabinet: { width: 0.8, depth: 0.48, height: 0.85 },
    chest_of_drawers: { width: 0.9, depth: 0.45, height: 1.0 },
    dog_crate: { width: 0.9, depth: 0.6, height: 0.7 },
  };
  for (const [kind, size] of Object.entries(expected)) {
    const item = normalizeFurniture({ id: `f-${kind}`, kind, position: [1, 2] }, "floor-1");
    assert.equal(item.kind, kind);
    assert.deepEqual({ width: item.width, depth: item.depth, height: item.height }, size);
  }
  const custom = normalizeFurniture({ id: "f-custom", kind: "fridge", width: 0.9, depth: 0.7, height: 1.9 }, "floor-1");
  assert.deepEqual([custom.width, custom.depth, custom.height], [0.9, 0.7, 1.9]);
});

test("未知家具 kind 仍然变成 sofa，toilet 保持不变", () => {
  assert.equal(normalizeFurniture({ id: "f1", kind: "piano" }, "floor-1").kind, "sofa");
  assert.equal(normalizeFurniture({ id: "f2", kind: "toilet" }, "floor-1").kind, "toilet");
});

test("整个项目经过 normalizeFloorplanProject 后保留新取值", () => {
  const project = {
    id: "p",
    name: "p",
    floors: [
      {
        id: "floor-1",
        walls: [{ id: "w1", start: [0, 0], end: [4, 0] }],
        rooms: [],
        openings: [{ id: "o1", type: "door", wallId: "w1", offset: 1, doorStyle: "entrance" }],
        devices: [],
        furniture: ["fridge", "bathroom_cabinet", "chest_of_drawers", "dog_crate"].map((kind) => ({ id: kind, kind })),
      },
    ],
  };
  const normalized = normalizeFloorplanProject(project);
  assert.equal(normalized.floors[0].openings[0].doorStyle, "entrance");
  assert.deepEqual(normalized.floors[0].furniture.map((item) => item.kind), ["fridge", "bathroom_cabinet", "chest_of_drawers", "dog_crate"]);
});

const upstreamApp = process.env.HA3D_UPSTREAM_APP;
const strip = (project) => {
  const { createdAt, updatedAt, ...rest } = project;
  return rest;
};

test("向后兼容：fixture 和自定义项目经过新旧 normalizeFloorplanProject 结果相同", { skip: upstreamApp ? false : "未设置 HA3D_UPSTREAM_APP" }, async (t) => {
  const upstream = await import(pathToFileURL(path.join(path.resolve(upstreamApp), "packages/schema/dist/index.js")).href);
  const sources = [["fixture", fixturePath]];
  if (process.env.HA3D_PROJECT_JSON) sources.push(["HA3D_PROJECT_JSON", path.resolve(process.env.HA3D_PROJECT_JSON)]);
  for (const [label, file] of sources) {
    await t.test(label, async () => {
      const raw = JSON.parse(await readFile(file, "utf8"));
      const current = strip(normalizeFloorplanProject(structuredClone(raw)));
      const previous = strip(upstream.normalizeFloorplanProject(structuredClone(raw)));
      assert.deepStrictEqual(current, previous);
    });
  }
});
