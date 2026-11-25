import path from "node:path";
export function staticAssetOptions(root) {
    return {
        root, prefix: "/", cacheControl: false, etag: true, lastModified: true,
        setHeaders(response, filePath, stat) {
            response.ha3dStaticFile = { path: filePath, size: stat.size, mtimeMs: stat.mtimeMs }; // ha3d-self: 1.1.0 给 ha3dCompression.js 的压缩缓存用
            const relativePath = path.relative(root, filePath).replace(/\\/g, "/");
            // ha3d-self: js/css 改为固定文件名，用户浏览器里已永久缓存 0.1.6 的 hash 文件名，
            // 所以 js/css/html 一律 no-cache（每次用 ETag 验证），只有带 hash 的图片保持 immutable。
            const hashedAsset = /^assets\/[^/]+-[A-Za-z0-9_-]{8,}\.(?:png|jpe?g|webp|gif|svg)$/.test(relativePath);
            response.setHeader("Cache-Control", hashedAsset ? "public, max-age=31536000, immutable" : "no-cache");
        },
    };
}
