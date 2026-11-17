#!/usr/bin/env bash
# 只用于「对比上游新版本」，镜像构建不依赖它，也不依赖作者的镜像。
# 从作者发布的镜像提取 /app 到 upstream/<version>/（已 gitignore），并生成：
#   upstream/<version>/web-pretty/  上游原始文件名的格式化前端代码，方便阅读
#   upstream/<version>/web-stable/  用 scripts/normalize-web-dist.mjs 生成的固定文件名版本，
#                                   可直接 diff -r upstream/<version>/web-stable jmglink-ha-3d-home/app/apps/web/dist
# 用法: scripts/extract-upstream.sh <version>   例如 scripts/extract-upstream.sh 0.1.6
# 依赖: crane (brew install crane)、node、npx
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "用法: $0 <version>   例如 $0 0.1.6" >&2
  exit 2
fi
IMAGE="docker.jmglink.cn/jmglink-ha-3d:${VERSION}"
OUT="$ROOT/upstream/${VERSION}"
rm -rf "$OUT"
mkdir -p "$OUT"
echo ">> 导出 ${IMAGE} -> ${OUT}"
crane export --platform linux/arm64 "$IMAGE" - \
  | tar -x -C "$OUT" --exclude 'app/node_modules' app
# 前端是压缩过的单行 JS，格式化一份到 web-pretty/ 方便阅读
echo ">> 格式化前端代码 -> ${OUT}/web-pretty"
mkdir -p "$OUT/web-pretty"
for f in "$OUT"/app/apps/web/dist/assets/*.js; do
  name="$(basename "$f")"
  case "$name" in three-*|hls-*) continue ;; esac  # 第三方库
  cp "$f" "$OUT/web-pretty/$name"
done
npx --yes prettier@3 --ignore-path /dev/null --log-level warn --write "$OUT/web-pretty/"*.js
echo ">> 固定文件名并格式化 -> ${OUT}/web-stable"
node "$ROOT/scripts/normalize-web-dist.mjs" "$OUT/app/apps/web/dist" "$OUT/web-stable"
echo ">> 完成。对比: diff -r upstream/${VERSION}/web-stable jmglink-ha-3d-home/app/apps/web/dist"
