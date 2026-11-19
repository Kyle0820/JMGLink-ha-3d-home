// BUG 7（导出 415）：用临时数据目录在 18198 端口启动 main.js，跑 plan.md 第 3 节 B7 的请求矩阵。
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

const appDir = fileURLToPath(new URL("../../jmglink-ha-3d-home/app/", import.meta.url));
const fixturePath = fileURLToPath(new URL("../fixtures/demo-project.json", import.meta.url));
const port = 18198;
const baseUrl = `http://127.0.0.1:${port}`;
let server;
let tempDir;
let projectId;

function request(method, pathname, { headers = {}, body, chunked = false } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ method, hostname: "127.0.0.1", port, path: pathname, headers }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString("utf8") }));
    });
    req.on("error", reject);
    if (chunked) req.setHeader("transfer-encoding", "chunked");
    if (body !== undefined) req.write(body);
    req.end();
  });
}

before(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), "ha3d-http-test-"));
  await mkdir(path.join(tempDir, "data", "projects"), { recursive: true });
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  projectId = fixture.id;
  await writeFile(path.join(tempDir, "data", "projects", "current-project.json"), JSON.stringify(fixture));
  server = spawn(process.execPath, ["apps/server/dist/main.js"], {
    cwd: appDir,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, HA3D_MODE: "standalone", HA_TOKEN: "", HA_URL: "http://127.0.0.1:9", PORT: String(port), HA3D_DATA_DIR: path.join(tempDir, "data"), HA3D_ASSET_DIR: path.join(tempDir, "assets"), LOG_LEVEL: "warn" },
  });
  let output = "";
  server.stdout.on("data", (chunk) => (output += chunk));
  server.stderr.on("data", (chunk) => (output += chunk));
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`main.js 已退出：${output}`);
    try {
      if ((await request("GET", "/api/health")).status === 200) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`main.js 启动超时：${output}`);
});

after(async () => {
  if (server && server.exitCode === null) {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill("SIGTERM");
    await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 3000))]);
    if (server.exitCode === null) server.kill("SIGKILL");
  }
  if (tempDir) await rm(tempDir, { recursive: true, force: true });
});

const exportPath = () => `/api/projects/${encodeURIComponent(projectId)}/export`;
const octet = { "content-type": "application/octet-stream" };

test("GET 导出返回 200 和当前项目", async () => {
  const response = await request("GET", exportPath());
  assert.equal(response.status, 200);
  assert.equal(JSON.parse(response.body).id, projectId);
  assert.match(response.headers["content-disposition"], /attachment/);
});

test("POST 导出不带 content-type 返回 200", async () => {
  const response = await request("POST", exportPath(), { headers: { "content-length": "0" } });
  assert.equal(response.status, 200);
});

test("POST 导出 octet-stream 空 body（content-length:0）返回 200", async () => {
  const response = await request("POST", exportPath(), { headers: { ...octet, "content-length": "0" } });
  assert.equal(response.status, 200, response.body);
  assert.equal(JSON.parse(response.body).id, projectId);
});

test("POST 导出 octet-stream 空 body（chunked）返回 200", async () => {
  const response = await request("POST", exportPath(), { headers: octet, chunked: true });
  assert.equal(response.status, 200, response.body);
});

test("POST 导出 octet-stream 非空 body 仍返回 415", async () => {
  const response = await request("POST", exportPath(), { headers: octet, body: "abc" });
  assert.equal(response.status, 415);
  assert.equal(JSON.parse(response.body).error, "Unsupported Media Type");
});

test("POST /api/ha/reconnect octet-stream 空 body 不是 415", async () => {
  const response = await request("POST", "/api/ha/reconnect", { headers: { ...octet, "content-length": "0" } });
  assert.notEqual(response.status, 415, response.body);
});

test("JSON body 仍按内置解析器处理", async () => {
  const body = JSON.stringify({ name: "http 测试项目" });
  const response = await request("POST", "/api/projects", { headers: { "content-type": "application/json", "content-length": String(Buffer.byteLength(body)) }, body });
  assert.equal(response.status, 201, response.body);
  assert.equal(JSON.parse(response.body).project.name, "http 测试项目");
});
// 0.2.2 首页设置跨设备同步：GET/PUT /api/ui-settings，写入 <dataDir>/ui-settings.json
const putSettings = (values) => {
  const body = JSON.stringify({ values });
  return request("PUT", "/api/ui-settings", { headers: { "content-type": "application/json", "content-length": String(Buffer.byteLength(body)) }, body });
};
test("ui-settings：初始为空，PUT 合并写入并落盘，null 删除", async () => {
  const initial = JSON.parse((await request("GET", "/api/ui-settings")).body);
  assert.deepEqual(initial.values, {});
  const first = await putSettings({ "ha3d.home.sceneVisualStyle": "cream", "ha3d.home.pet": "dog" });
  assert.equal(first.status, 200, first.body);
  assert.deepEqual(JSON.parse(first.body).changed.sort(), ["ha3d.home.pet", "ha3d.home.sceneVisualStyle"]);
  const second = JSON.parse((await putSettings({ "ha3d.home.pet": null, "ha3d.home.sceneVisualStyle": "cream" })).body);
  assert.deepEqual(second.changed, ["ha3d.home.pet"]);
  assert.deepEqual(second.values, { "ha3d.home.sceneVisualStyle": "cream" });
  const file = JSON.parse(await readFile(path.join(tempDir, "data", "ui-settings.json"), "utf8"));
  assert.equal(file.version, 1);
  assert.deepEqual(file.values, { "ha3d.home.sceneVisualStyle": "cream" });
});
test("ui-settings：非法键名、非字符串值返回 400", async () => {
  assert.equal((await putSettings({ "other.key": "x" })).status, 400);
  assert.equal((await putSettings({ "ha3d.home.pet": 1 })).status, 400);
  assert.equal((await putSettings("x")).status, 400);
});
