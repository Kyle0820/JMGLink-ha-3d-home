#!/usr/bin/env node
// 本地启动 mock HA + 应用服务。
// 用法：node dev/start-local.mjs [--project <json>] [--port 18099] [--mock-port 18123] [--data-dir /tmp/ha3d-dev/data] [--keep-data]
// 同时导出 startStack/stopStack 供 e2e 使用。
import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = fileURLToPath(new URL("..", import.meta.url));
const repoDir = path.resolve(toolsDir, "..");
export const appDir = path.join(repoDir, "jmglink-ha-3d-home", "app");
export const defaultProjectPath = path.join(toolsDir, "fixtures", "demo-project.json");
const mockScript = path.join(toolsDir, "mock-ha", "server.mjs");
const serverScript = path.join(appDir, "apps", "server", "dist", "main.js");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(url, timeoutMs, child) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    if (child && child.exitCode !== null) throw new Error(`${url} 的进程已退出，退出码 ${child.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(200);
  }
  throw new Error(`等待 ${url} 超时：${lastError?.message ?? "unknown"}`);
}

function pipeOutput(child, logFile, prefix) {
  if (logFile) {
    const stream = createWriteStream(logFile, { flags: "a" });
    child.stdout.pipe(stream);
    child.stderr.pipe(stream);
    return;
  }
  for (const source of [child.stdout, child.stderr]) {
    source.on("data", (chunk) => {
      for (const line of chunk.toString().split(/\r?\n/)) if (line) console.log(`${prefix} ${line}`);
    });
  }
}

/**
 * 启动 mock HA 和应用服务，返回 { appUrl, mockUrl, dataDir, projectPath, stop }。
 * logDir 给出时，日志写到 <logDir>/mock-ha.log 和 <logDir>/server.log，否则打印到控制台。
 */
export async function startStack({
  project = defaultProjectPath,
  port = 18099,
  mockPort = 18123,
  dataDir = "/tmp/ha3d-dev/data",
  keepData = false,
  token = "dev-token",
  logDir,
  logLevel = "info",
} = {}) {
  const projectPath = path.resolve(project);
  const resolvedDataDir = path.resolve(dataDir);
  const assetDir = path.join(path.dirname(resolvedDataDir), "assets");
  if (!keepData) {
    await rm(resolvedDataDir, { recursive: true, force: true });
    await mkdir(path.join(resolvedDataDir, "projects"), { recursive: true });
    const content = JSON.parse(await readFile(projectPath, "utf8"));
    await writeFile(path.join(resolvedDataDir, "projects", "current-project.json"), JSON.stringify(content, null, 2));
  }
  await mkdir(assetDir, { recursive: true });
  if (logDir) await mkdir(logDir, { recursive: true });

  const children = [];
  const stop = async () => {
    await Promise.all(
      children.reverse().map(
        (child) =>
          new Promise((resolve) => {
            if (child.exitCode !== null || child.signalCode !== null) return resolve();
            const timer = setTimeout(() => child.kill("SIGKILL"), 5000);
            child.once("exit", () => {
              clearTimeout(timer);
              resolve();
            });
            child.kill("SIGTERM");
          }),
      ),
    );
    children.length = 0;
  };

  try {
    const mock = spawn(process.execPath, [mockScript, "--port", String(mockPort), "--project", projectPath, "--token", token], { stdio: ["ignore", "pipe", "pipe"] });
    children.push(mock);
    pipeOutput(mock, logDir && path.join(logDir, "mock-ha.log"), "[mock]");
    const mockUrl = `http://127.0.0.1:${mockPort}`;
    await waitFor(`${mockUrl}/mock/calls`, 10_000, mock);

    const server = spawn(process.execPath, [serverScript], {
      cwd: appDir,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        HA3D_MODE: "standalone",
        HA_URL: mockUrl,
        HA_TOKEN: token,
        PORT: String(port),
        HA3D_DATA_DIR: resolvedDataDir,
        HA3D_ASSET_DIR: assetDir,
        LOG_LEVEL: logLevel,
      },
    });
    children.push(server);
    pipeOutput(server, logDir && path.join(logDir, "server.log"), "[app]");
    const appUrl = `http://127.0.0.1:${port}`;
    await waitFor(`${appUrl}/api/health`, 20_000, server);
    return { appUrl, mockUrl, dataDir: resolvedDataDir, projectPath, stop };
  } catch (error) {
    await stop();
    throw error;
  }
}

export async function stopStack(stack) {
  await stack?.stop();
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const next = () => argv[++index];
    if (key === "--project") args.project = next();
    else if (key === "--port") args.port = Number(next());
    else if (key === "--mock-port") args.mockPort = Number(next());
    else if (key === "--data-dir") args.dataDir = next();
    else if (key === "--keep-data") args.keepData = true;
  }
  return args;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const stack = await startStack(parseArgs(process.argv.slice(2)));
  console.log(`[dev] 应用：${stack.appUrl}  mock HA：${stack.mockUrl}  数据目录：${stack.dataDir}`);
  const shutdown = () => void stopStack(stack).then(() => process.exit(0));
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
