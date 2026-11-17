// BUG 7 修复后：curl 矩阵 + 在编辑器 UI 里点击「导出 JSON」（请求方法 GET、状态 200、下载内容等于当前项目）。
import { readFile } from "node:fs/promises";
import path from "node:path";
import { exportMatrix, uiExport } from "./baseline.mjs";

export default async function exportSuite(ctx) {
  const { check } = ctx;
  const current = (await (await fetch(`${ctx.stack.appUrl}/api/projects/current`)).json()).project;

  const matrix = await exportMatrix(ctx.stack.appUrl, current.id);
  await ctx.writeJson(path.join(ctx.dir, "matrix.json"), matrix);
  const statusOf = (prefix) => matrix.find((item) => item.name.startsWith(prefix))?.status;
  check("GET 导出返回 200", statusOf("GET") === 200, statusOf("GET"));
  check("POST 不带 content-type 返回 200", statusOf("POST 无 content-type") === 200, statusOf("POST 无 content-type"));
  check("POST octet-stream 空 body（content-length:0）返回 200", statusOf("POST octet-stream 空 body（content-length:0）") === 200, statusOf("POST octet-stream 空 body（content-length:0）"));
  check("POST octet-stream 空 body（chunked）返回 200", statusOf("POST octet-stream 空 body（chunked）") === 200, statusOf("POST octet-stream 空 body（chunked）"));
  check("POST octet-stream 非空 body 仍返回 415", statusOf("POST octet-stream 非空 body") === 415, statusOf("POST octet-stream 非空 body"));
  check("POST /api/ha/reconnect octet-stream 空 body 不是 415", statusOf("POST /api/ha/reconnect") !== 415, statusOf("POST /api/ha/reconnect"));

  const page = await ctx.newPage();
  const result = await uiExport(ctx, page);
  await ctx.shot(page, "ui-export");
  const exportRequests = result.requests;
  check("UI 导出只发出 1 个 /export 请求", exportRequests.length === 1, exportRequests);
  check("UI 导出请求方法是 GET", exportRequests.length > 0 && exportRequests.every((item) => item.method === "GET"), exportRequests);
  check("UI 导出状态 200", exportRequests.length > 0 && exportRequests.every((item) => item.status === 200), exportRequests);
  check("页面没有「导出失败」提示", !result.errorText, result.errorText);
  let downloaded;
  if (result.download) {
    const file = path.join(ctx.dir, "downloaded-project.json");
    await result.download.saveAs(file);
    downloaded = JSON.parse(await readFile(file, "utf8"));
  }
  check("浏览器触发了下载", Boolean(downloaded), result.download?.suggestedFilename());
  check("下载的 JSON 的 id 等于当前项目", downloaded?.id === current.id, { downloaded: downloaded?.id, current: current.id });
  check("下载的 JSON 的 floors 等于当前项目", JSON.stringify(downloaded?.floors) === JSON.stringify(current.floors));
  check("UI 导出没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));

  return { matrix, uiRequests: exportRequests, suggestedFilename: result.download?.suggestedFilename() ?? null };
}
