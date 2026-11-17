#!/usr/bin/env node
// 用法：node e2e/run.mjs <suite...>
// 启动一次测试栈（项目取 HA3D_PROJECT_JSON，默认合成 fixture；证据目录取 HA3D_EVIDENCE_DIR，默认 /tmp/ha3d-evidence），
// 依次运行 e2e/<suite>.mjs 的 default async (ctx)，结果写到 <证据目录>/<suite>/result.json，有失败时退出码 1。
import { open, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { defaultProjectPath } from "../dev/start-local.mjs";
import * as lib from "./lib.mjs";

const suites = process.argv.slice(2).filter((arg) => arg !== "--");
if (!suites.length) {
  console.error("用法：node e2e/run.mjs <suite...>");
  process.exit(2);
}
const e2eDir = path.dirname(fileURLToPath(import.meta.url));
const evidenceRoot = path.resolve(process.env.HA3D_EVIDENCE_DIR || "/tmp/ha3d-evidence");
const projectPath = path.resolve(process.env.HA3D_PROJECT_JSON || defaultProjectPath);
const isFixture = projectPath === path.resolve(defaultProjectPath);
const project = JSON.parse(await readFile(projectPath, "utf8"));
const stackLogDir = path.join(evidenceRoot, "_stack");

async function fileSize(file) {
  try {
    return (await stat(file)).size;
  } catch {
    return 0;
  }
}

/** 把共享日志里本套件期间新增的部分写到套件目录。 */
async function copySlice(source, from, target) {
  const size = await fileSize(source);
  const buffer = Buffer.alloc(Math.max(0, size - from));
  if (buffer.length) {
    const handle = await open(source, "r");
    await handle.read(buffer, 0, buffer.length, from);
    await handle.close();
  }
  await writeFile(target, buffer);
}

console.log(`[e2e] 项目：${isFixture ? "fixture" : projectPath}，证据目录：${evidenceRoot}`);
const stack = await lib.startStack({
  project: projectPath,
  port: Number(process.env.HA3D_E2E_PORT || 18099),
  mockPort: Number(process.env.HA3D_E2E_MOCK_PORT || 18123),
  dataDir: process.env.HA3D_E2E_DATA_DIR || "/tmp/ha3d-e2e/data",
  logDir: stackLogDir,
});
const browser = await lib.launchBrowser();
lib.setRuntime({ browser, stack, evidenceRoot });

let failed = false;
try {
  for (const suite of suites) {
    const module = await import(pathToFileURL(path.join(e2eDir, `${suite}.mjs`)).href);
    const suiteKey = module.apartmentSubdir && !isFixture ? path.join(suite, "apartment") : suite;
    const suiteDir = path.join(evidenceRoot, suiteKey);
    const checks = [];
    const result = { suite, project: isFixture ? "fixture" : "custom", projectId: project.id, startedAt: new Date().toISOString(), passed: false, checks, data: {} };
    const logOffsets = { server: await fileSize(path.join(stackLogDir, "server.log")), mock: await fileSize(path.join(stackLogDir, "mock-ha.log")) };
    const startedAt = Date.now();
    const ctx = {
      ...lib,
      suite,
      suiteKey,
      dir: suiteDir,
      evidenceRoot,
      stack,
      browser,
      project,
      projectPath,
      isFixture,
      data: result.data,
      shot: (page, name, options) => lib.shot(page, suiteKey, name, options),
      check(name, ok, detail) {
        checks.push({ name, ok: Boolean(ok), detail });
        console.log(`  ${ok ? "✓" : "✗"} ${name}${detail === undefined ? "" : ` — ${typeof detail === "string" ? detail : JSON.stringify(detail)}`}`);
        return Boolean(ok);
      },
      log: (...args) => console.log(`  [${suite}]`, ...args),
    };
    console.log(`[e2e] ▶ ${suite}`);
    try {
      await lib.mock.reset();
      const returned = await module.default(ctx);
      if (returned && typeof returned === "object") Object.assign(result.data, returned);
      result.passed = checks.every((item) => item.ok);
    } catch (error) {
      result.error = String(error?.stack ?? error);
      console.error(`  ✗ ${suite} 异常：${result.error}`);
    } finally {
      await lib.closeContexts();
    }
    result.durationMs = Date.now() - startedAt;
    await lib.writeJson(path.join(suiteDir, "result.json"), result);
    await copySlice(path.join(stackLogDir, "server.log"), logOffsets.server, path.join(suiteDir, "server.log"));
    await copySlice(path.join(stackLogDir, "mock-ha.log"), logOffsets.mock, path.join(suiteDir, "mock-ha.log"));
    console.log(`[e2e] ${result.passed ? "通过" : "失败"} ${suite}（${checks.filter((c) => c.ok).length}/${checks.length}，${result.durationMs} ms）→ ${path.join(suiteDir, "result.json")}`);
    if (!result.passed) failed = true;
  }
} finally {
  await browser.close().catch(() => undefined);
  await lib.stopStack(stack);
}
process.exit(failed ? 1 : 0);
