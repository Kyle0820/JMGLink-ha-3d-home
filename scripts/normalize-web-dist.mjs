#!/usr/bin/env node
// 把 Vite 产物整理成本仓库维护的形态：
//   1. assets/ 下 <名>-<8位hash>.js|css 改为固定文件名 <名>.js|css
//   2. 所有 js/css/html 里的旧文件名替换为新文件名（import、import()、__vite__mapDeps、index.html）
//   3. 用 prettier 格式化业务 chunk（three.js、react.js、hls.js 是第三方库，保持压缩）
// png 和 dist 根目录的其他文件原样复制。
// 用法: node scripts/normalize-web-dist.mjs <vite-dist目录> <输出目录>
// 导入上游和对比上游新版本（scripts/extract-upstream.sh）用的是同一个脚本，所以结果可以直接 diff -r。
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// 固定 prettier 版本，保证不同时间运行的格式化结果一致
const PRETTIER = "prettier@3.10.1";
const VENDOR_CHUNKS = new Set(["three.js", "react.js", "hls.js"]);
const HASHED = /^(.+?)-([A-Za-z0-9_-]{8})\.(js|css)$/;
const TEXT_EXT = new Set([".js", ".css", ".html"]);

function fail(message) {
  console.error(`normalize-web-dist: ${message}`);
  process.exit(1);
}

const [srcArg, outArg] = process.argv.slice(2);
if (!srcArg || !outArg) {
  console.error("用法: node scripts/normalize-web-dist.mjs <vite-dist目录> <输出目录>");
  process.exit(2);
}
const src = path.resolve(srcArg);
const out = path.resolve(outArg);
if (!fs.existsSync(path.join(src, "assets"))) fail(`${src} 下没有 assets/ 目录`);
if (src === out) fail("输出目录不能和输入目录相同");

fs.rmSync(out, { recursive: true, force: true });
fs.cpSync(src, out, { recursive: true });

const assetsDir = path.join(out, "assets");
const existing = new Set(fs.readdirSync(assetsDir));
const renames = new Map();
const targets = new Set();
for (const name of [...existing].sort()) {
  const match = HASHED.exec(name);
  if (!match) continue;
  const stable = `${match[1]}.${match[3]}`;
  if (targets.has(stable) || existing.has(stable)) fail(`改名冲突: ${name} -> ${stable}`);
  targets.add(stable);
  renames.set(name, stable);
}
for (const [from, to] of renames) fs.renameSync(path.join(assetsDir, from), path.join(assetsDir, to));

// 长名字先替换，避免一个旧名是另一个旧名的子串时替换错位
const ordered = [...renames].sort((a, b) => b[0].length - a[0].length);
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const textFiles = walk(out).filter((file) => TEXT_EXT.has(path.extname(file)));
for (const file of textFiles) {
  const before = fs.readFileSync(file, "utf8");
  let after = before;
  for (const [from, to] of ordered) after = after.split(from).join(to);
  if (after !== before) fs.writeFileSync(file, after);
}
for (const file of textFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const [from] of ordered) {
    if (content.includes(from)) fail(`${path.relative(out, file)} 仍然引用 ${from}`);
  }
}

const toFormat = fs
  .readdirSync(assetsDir)
  .filter((name) => /\.(js|css)$/.test(name) && !VENDOR_CHUNKS.has(name))
  .sort()
  .map((name) => path.join(assetsDir, name));
if (toFormat.length) {
  const result = spawnSync(
    "npx",
    ["--yes", PRETTIER, "--ignore-path", "/dev/null", "--log-level", "warn", "--write", ...toFormat],
    { stdio: "inherit" },
  );
  if (result.status !== 0) fail(`prettier 执行失败（退出码 ${result.status ?? result.error}）`);
}

for (const [from, to] of renames) console.log(`${from} -> ${to}`);
console.log(`完成: ${out}（改名 ${renames.size} 个，格式化 ${toFormat.length} 个）`);
