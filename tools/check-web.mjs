#!/usr/bin/env node
// 静态检查前端模块图：用 esbuild 打包 WEB/assets/index.js（不写文件），抓语法错误和不存在的导入名。
import { build } from "esbuild";
import { fileURLToPath } from "node:url";

const entry = fileURLToPath(new URL("../jmglink-ha-3d-home/app/apps/web/dist/assets/index.js", import.meta.url));

try {
  const result = await build({ entryPoints: [entry], bundle: true, format: "esm", write: false, logLevel: "silent" });
  const bytes = result.outputFiles.reduce((sum, file) => sum + file.contents.length, 0);
  for (const warning of result.warnings) console.warn(`warning: ${warning.text} (${warning.location?.file ?? ""}:${warning.location?.line ?? ""})`);
  console.log(`check:web ok：${entry}，输出 ${bytes} 字节，${result.warnings.length} 个警告`);
} catch (error) {
  const errors = error.errors ?? [{ text: String(error) }];
  for (const item of errors) console.error(`error: ${item.text} (${item.location?.file ?? ""}:${item.location?.line ?? ""}:${item.location?.column ?? ""})`);
  console.error(`check:web 失败：${errors.length} 个错误`);
  process.exit(1);
}
