// ===== ha3d-self: 1.1.0 静态资源和 API JSON 压缩 =====
// onSend 钩子：按 Accept-Encoding 协商 br（优先）或 gzip。
// - 静态文本文件（js/css/html/json/svg/md/txt，≥ 1 KB）：staticAssets.js 的 setHeaders 在 reply.raw.ha3dStaticFile 记下路径、大小、mtime，
//   压缩结果按「路径 + 编码」缓存，大小或 mtime 变化时重算，并发请求共用同一个 Promise。ETag 不变，304 仍由 @fastify/static 返回。
// - API 的 JSON 响应 ≥ 1 KB 时现压，不缓存。
// 经 HA ingress 访问时，HA core 转发前会去掉 Accept-Encoding，并在边界自己压缩（hassio/ingress.py 的 INIT_HEADERS_FILTER、should_compress），
// 所以这里在 ingress 下不起作用、也不耗 CPU；只对直连端口和独立 Docker 部署生效。
import { readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import zlib from "node:zlib";

const ha3dBrotli = promisify(zlib.brotliCompress);
const ha3dGzip = promisify(zlib.gzip);
const ha3dMinBytes = 1024;
const ha3dStaticExtensions = new Set([".js", ".css", ".html", ".json", ".svg", ".md", ".txt"]);
const ha3dStaticCache = new Map();

/** 解析 Accept-Encoding，返回 "br"、"gzip" 或 null（q=0 表示不接受）。 */
export function ha3dPickEncoding(header) {
    if (!header)
        return null;
    const accepted = new Map();
    for (const part of String(header).split(",")) {
        const [name, ...params] = part.trim().toLowerCase().split(";");
        if (!name)
            continue;
        const q = params.map((param) => param.trim()).find((param) => param.startsWith("q="));
        accepted.set(name, q ? Number(q.slice(2)) : 1);
    }
    const ok = (name) => {
        const q = accepted.has(name) ? accepted.get(name) : accepted.get("*");
        return typeof q === "number" && q > 0;
    };
    if (ok("br"))
        return "br";
    if (ok("gzip"))
        return "gzip";
    return null;
}

function ha3dCompress(buffer, encoding, level) {
    return encoding === "br"
        ? ha3dBrotli(buffer, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: level.br, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: buffer.length } })
        : ha3dGzip(buffer, { level: level.gzip });
}

function ha3dCompressedStatic(file, encoding) {
    const key = `${file.path}|${encoding}`;
    const cached = ha3dStaticCache.get(key);
    if (cached && cached.size === file.size && cached.mtimeMs === file.mtimeMs)
        return cached.promise;
    const promise = readFile(file.path).then((buffer) => ha3dCompress(buffer, encoding, { br: 9, gzip: 9 }));
    const entry = { size: file.size, mtimeMs: file.mtimeMs, promise };
    ha3dStaticCache.set(key, entry);
    promise.catch(() => {
        if (ha3dStaticCache.get(key) === entry)
            ha3dStaticCache.delete(key);
    });
    return promise;
}

function ha3dAddVary(reply) {
    const vary = reply.getHeader("vary");
    if (!vary)
        reply.header("vary", "Accept-Encoding");
    else if (!/(^|,)\s*(accept-encoding|\*)\s*(,|$)/i.test(String(vary)))
        reply.header("vary", `${vary}, Accept-Encoding`);
}

export function registerHa3dCompression(app) {
    app.addHook("onSend", async (request, reply, payload) => {
        if (request.method !== "GET" || reply.statusCode !== 200 || reply.getHeader("content-encoding"))
            return payload;
        const file = reply.raw.ha3dStaticFile;
        if (file) {
            if (file.size < ha3dMinBytes || !ha3dStaticExtensions.has(path.extname(file.path).toLowerCase()))
                return payload;
            ha3dAddVary(reply);
            const encoding = ha3dPickEncoding(request.headers["accept-encoding"]);
            if (!encoding)
                return payload;
            const compressed = await ha3dCompressedStatic(file, encoding);
            payload?.destroy?.();
            reply.header("content-encoding", encoding);
            reply.header("content-length", compressed.length);
            reply.removeHeader("accept-ranges");
            return compressed;
        }
        if (typeof payload !== "string" && !Buffer.isBuffer(payload))
            return payload;
        if (!/application\/json/i.test(String(reply.getHeader("content-type") ?? "")))
            return payload;
        const buffer = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
        if (buffer.length < ha3dMinBytes)
            return payload;
        ha3dAddVary(reply);
        const encoding = ha3dPickEncoding(request.headers["accept-encoding"]);
        if (!encoding)
            return payload;
        const compressed = await ha3dCompress(buffer, encoding, { br: 5, gzip: 6 });
        reply.header("content-encoding", encoding);
        reply.header("content-length", compressed.length);
        return compressed;
    });
}
