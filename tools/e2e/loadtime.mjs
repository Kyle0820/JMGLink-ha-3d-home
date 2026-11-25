// 1.1.0 需求 2：首页加载体积和 3D 打开速度的前后对比，以及作者弹窗不再有二维码。
// 两种网络：local（不限速）和 lan20（CDP 限速 20/10 Mbps、40 ms），每种跑 HA3D_LOADTIME_RUNS 次（默认 3）取中位数。
// 每次都是全新的浏览器上下文、禁用缓存：记录首页传输字节（导航 + 全部资源的 transferSize）、按类型的传输字节、
// 3D 首帧时间（gl.info.render.frame ≥ 1）、设备出现时间（场景里有 userData.focusEntityId）、每个 JS/CSS 的 content-encoding。
// HA3D_LOADTIME_BASELINE=1 时只记录（写 <证据>/loadtime/before.json，在改动前采集）；
// 否则读 HA3D_LOADTIME_BEFORE_JSON 或 <证据>/loadtime/before.json，写 after.json 和 loadtime.md 并断言。
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const NOON = "2026-06-01T12:00:00";
const BASELINE = process.env.HA3D_LOADTIME_BASELINE === "1";
const RUNS = Math.max(1, Number(process.env.HA3D_LOADTIME_RUNS || 3));
const KB = 1024;
const NETWORKS = {
  local: null,
  lan20: { offline: false, latency: 40, downloadThroughput: 2_500_000, uploadThroughput: 1_250_000 },
};

const median = (values) => {
  const sorted = values.filter((value) => typeof value === "number" && Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

function categoryOf(pathname) {
  if (pathname.startsWith("/api/")) return "api";
  if (/\.js$/.test(pathname)) return "js";
  if (/\.css$/.test(pathname)) return "css";
  if (/\.(png|jpe?g|gif|webp|svg|avif|ico)$/.test(pathname)) return "image";
  return "other";
}

/** 一次冷启动测量。 */
async function measure(ctx, network) {
  await ctx.uiSettings.clear();
  const page = await ctx.newPage({ startTime: NOON });
  await page.context().addInitScript(() => {
    window.localStorage.setItem("ha3d.home.sceneQuality", "balanced");
    window.localStorage.setItem("ha3d.home.sceneVisualStyle", "glass");
    window.localStorage.removeItem("ha3d.home.pet");
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (NETWORKS[network]) await cdp.send("Network.emulateNetworkConditions", NETWORKS[network]);
  const encodings = new Map();
  page.on("response", (response) => {
    const url = response.url();
    if (!url.startsWith(ctx.stack.appUrl)) return;
    const pathname = new URL(url).pathname;
    encodings.set(pathname, { status: response.status(), encoding: response.headers()["content-encoding"] ?? null });
  });
  await page.goto("/?ha3dDebug=1", { waitUntil: "commit" });
  await page.waitForFunction(
    () => {
      const s = window.__ha3dDebug?.get();
      if (!s?.gl || s.gl.info.render.frame < 1) return false;
      window.__ha3dFirstFrameMs ??= performance.now();
      return true;
    },
    undefined,
    { timeout: 120_000, polling: 50 },
  );
  await page.waitForFunction(
    () => {
      const s = window.__ha3dDebug?.get();
      let found = false;
      s?.scene.traverse((object) => {
        if (object.userData?.focusEntityId) found = true;
      });
      if (found) window.__ha3dDevicesMs ??= performance.now();
      return found;
    },
    undefined,
    { timeout: 120_000, polling: 50 },
  );
  await ctx.sleep(3000);
  const timing = await page.evaluate(() => {
    const pick = (entry) => ({ name: entry.name, transfer: entry.transferSize, encoded: entry.encodedBodySize, decoded: entry.decodedBodySize });
    return {
      firstFrameMs: window.__ha3dFirstFrameMs ?? null,
      devicesMs: window.__ha3dDevicesMs ?? null,
      navigation: performance.getEntriesByType("navigation").map(pick),
      resources: performance.getEntriesByType("resource").map(pick),
    };
  });
  const errors = [...page.ha3dErrors];
  await cdp.detach().catch(() => undefined);
  await page.context().close();

  const entries = [...timing.navigation.map((entry) => ({ ...entry, navigation: true })), ...timing.resources].map((entry) => ({ ...entry, pathname: new URL(entry.name).pathname }));
  const sameOrigin = entries.filter((entry) => entry.name.startsWith(ctx.stack.appUrl));
  const byType = { js: 0, css: 0, image: 0, api: 0, other: 0 };
  for (const entry of sameOrigin) byType[entry.navigation ? "other" : categoryOf(entry.pathname)] += entry.transfer;
  const files = sameOrigin
    .filter((entry) => !entry.navigation && ["js", "css"].includes(categoryOf(entry.pathname)))
    .map((entry) => ({ file: entry.pathname, transfer: entry.transfer, decoded: entry.decoded, encoding: encodings.get(entry.pathname)?.encoding ?? null }));
  return {
    firstFrameMs: timing.firstFrameMs === null ? null : Math.round(timing.firstFrameMs),
    devicesMs: timing.devicesMs === null ? null : Math.round(timing.devicesMs),
    transferBytes: entries.reduce((sum, entry) => sum + entry.transfer, 0),
    byType,
    files,
    requestedHls: entries.some((entry) => entry.pathname.includes("hls")),
    requestedQr: entries.some((entry) => /Qr-/.test(entry.pathname)),
    requests: sameOrigin.map((entry) => entry.pathname),
    errors,
  };
}

function summarize(runs) {
  const last = runs[runs.length - 1];
  return {
    runs: runs.length,
    transferBytes: median(runs.map((run) => run.transferBytes)),
    jsTransferBytes: median(runs.map((run) => run.byType.js)),
    byType: Object.fromEntries(Object.keys(last.byType).map((key) => [key, median(runs.map((run) => run.byType[key]))])),
    firstFrameMs: median(runs.map((run) => run.firstFrameMs)),
    devicesMs: median(runs.map((run) => run.devicesMs)),
    files: last.files,
    requestedHls: runs.some((run) => run.requestedHls),
    requestedQr: runs.some((run) => run.requestedQr),
    errors: runs.flatMap((run) => run.errors),
    samples: runs.map(({ firstFrameMs, devicesMs, transferBytes, byType }) => ({ firstFrameMs, devicesMs, transferBytes, byType })),
  };
}

/** 作者弹窗：二维码图片、文字链接，截图。 */
async function authorDialog(ctx) {
  const page = await ctx.newPage({ startTime: NOON });
  await ctx.gotoEditor(page, { view: "2d", prefs: { "ha3d.home.pet": null } });
  await page.locator(".author-support-button").click();
  const dialog = page.locator(".author-support-dialog");
  await dialog.waitFor({ state: "visible", timeout: 15_000 });
  await ctx.sleep(800);
  const report = await dialog.evaluate((element) => ({
    images: [...element.querySelectorAll("img")].map((img) => {
      const src = img.getAttribute("src") ?? "";
      return src.startsWith("data:") ? `${src.slice(0, 32)}…` : src;
    }),
    links: [...element.querySelectorAll("a.author-support-social-link")].map((a) => ({ text: a.textContent.trim(), href: a.getAttribute("href") })),
  }));
  await ctx.shot(page, "author-dialog");
  report.errors = [...page.ha3dErrors];
  report.requests = page.ha3dResponses.map((item) => item.url);
  await page.context().close();
  return report;
}

const fmtBytes = (value) => (value === null || value === undefined ? "—" : `${(value / KB).toFixed(1)} KB`);
const fmtMs = (value) => (value === null || value === undefined ? "—" : `${value} ms`);
const change = (before, after) => (before && after !== null && after !== undefined ? `${(((after - before) / before) * 100).toFixed(1)}%` : "—");

function markdown(before, after) {
  const lines = ["# loadtime：首页加载前后对比", "", `每种网络先跑 1 次不计入的预热，再跑 ${after.runsPerNetwork} 次冷启动（全新上下文、禁用缓存）取中位数。lan20 = CDP 限速 20/10 Mbps、40 ms 延迟。SwiftShader 软件渲染，local 下首帧主要受 CPU 限制。`, ""];
  for (const network of Object.keys(NETWORKS)) {
    const b = before.networks[network];
    const a = after.networks[network];
    lines.push(`## ${network}`, "", "| 指标 | 修改前 | 修改后 | 变化 |", "| --- | --- | --- | --- |");
    lines.push(`| 首页传输字节 | ${fmtBytes(b?.transferBytes)} | ${fmtBytes(a.transferBytes)} | ${change(b?.transferBytes, a.transferBytes)} |`);
    lines.push(`| JS 传输字节 | ${fmtBytes(b?.jsTransferBytes)} | ${fmtBytes(a.jsTransferBytes)} | ${change(b?.jsTransferBytes, a.jsTransferBytes)} |`);
    lines.push(`| 3D 首帧 | ${fmtMs(b?.firstFrameMs)} | ${fmtMs(a.firstFrameMs)} | ${change(b?.firstFrameMs, a.firstFrameMs)} |`);
    lines.push(`| 设备出现 | ${fmtMs(b?.devicesMs)} | ${fmtMs(a.devicesMs)} | ${change(b?.devicesMs, a.devicesMs)} |`, "");
    lines.push("| 文件 | 修改前传输 | 修改后传输 | 解码后 | 修改后编码 |", "| --- | --- | --- | --- | --- |");
    const names = [...new Set([...(b?.files ?? []).map((file) => file.file), ...a.files.map((file) => file.file)])];
    for (const name of names) {
      const fb = b?.files.find((file) => file.file === name);
      const fa = a.files.find((file) => file.file === name);
      lines.push(`| ${name} | ${fmtBytes(fb?.transfer)} | ${fmtBytes(fa?.transfer)} | ${fmtBytes(fa?.decoded ?? fb?.decoded)} | ${fa?.encoding ?? "—"} |`);
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

export default async function loadtime(ctx) {
  const { check } = ctx;
  const out = { baseline: BASELINE, runsPerNetwork: RUNS, networks: {} };
  for (const network of Object.keys(NETWORKS)) {
    // 先跑一次不计入的预热（浏览器 / SwiftShader 第一次启动、后端压缩缓存为空时首帧要多 3 秒左右）
    const warmup = await measure(ctx, network);
    const runs = [];
    for (let index = 0; index < RUNS; index += 1) runs.push(await measure(ctx, network));
    out.networks[network] = { ...summarize(runs), warmupFirstFrameMs: warmup.firstFrameMs };
    const s = out.networks[network];
    ctx.log(`${network}：首页传输 ${fmtBytes(s.transferBytes)}（JS ${fmtBytes(s.jsTransferBytes)}），3D 首帧 ${fmtMs(s.firstFrameMs)}，设备出现 ${fmtMs(s.devicesMs)}`);
  }
  out.authorDialog = await authorDialog(ctx);
  ctx.log(`作者弹窗：图片 ${JSON.stringify(out.authorDialog.images)}，链接 ${JSON.stringify(out.authorDialog.links)}`);

  if (BASELINE) {
    await ctx.writeJson(path.join(ctx.dir, "before.json"), out);
    check("loadtime 基线已记录（只记录不断言）", true, { local: out.networks.local.transferBytes, lan20FirstFrameMs: out.networks.lan20.firstFrameMs });
    return out;
  }

  const beforeFile = process.env.HA3D_LOADTIME_BEFORE_JSON || path.join(ctx.dir, "before.json");
  const before = existsSync(beforeFile) ? JSON.parse(await readFile(beforeFile, "utf8")) : null;
  await ctx.writeJson(path.join(ctx.dir, "after.json"), out);
  if (before) await writeFile(path.join(ctx.dir, "loadtime.md"), markdown(before, out));
  const local = out.networks.local;
  const lan20 = out.networks.lan20;
  check("有修改前的 before.json", Boolean(before), beforeFile);
  check(
    "local 首页传输字节 ≤ 修改前的 50%",
    before && local.transferBytes <= before.networks.local.transferBytes * 0.5,
    { before: before?.networks.local.transferBytes, after: local.transferBytes },
  );
  check("lan20 3D 首帧中位数小于修改前", before && lan20.firstFrameMs !== null && lan20.firstFrameMs < before.networks.lan20.firstFrameMs, {
    before: before?.networks.lan20.firstFrameMs,
    after: lan20.firstFrameMs,
  });
  const uncompressed = Object.entries(out.networks).flatMap(([network, summary]) =>
    summary.files.filter((file) => file.decoded >= KB && !["gzip", "br"].includes(file.encoding)).map((file) => ({ network, ...file })),
  );
  check("首页 ≥ 1 KB 的 JS/CSS 响应都带 content-encoding（gzip 或 br）", uncompressed.length === 0, uncompressed);
  check("首页不请求 hls.js 和二维码图片", !local.requestedHls && !lan20.requestedHls && !local.requestedQr && !lan20.requestedQr, {
    hls: local.requestedHls || lan20.requestedHls,
    qr: local.requestedQr || lan20.requestedQr,
  });
  const dialog = out.authorDialog;
  check("作者弹窗没有二维码图片", !dialog.images.some((src) => /Qr/.test(src ?? "")) && !dialog.requests.some((url) => /Qr-/.test(url)), dialog.images);
  check("作者弹窗有 http(s) 文字链接", dialog.links.length > 0 && dialog.links.every((link) => /^https?:\/\//.test(link.href ?? "")), dialog.links);
  const errors = [...local.errors, ...lan20.errors, ...dialog.errors];
  check("没有 pageerror", errors.length === 0, errors.slice(0, 3));
  return out;
}
