#!/usr/bin/env bash
# 从上游镜像提取 /app 到 upstream/<version>/（已 gitignore），并生成格式化后的前端代码。
# 用法: scripts/extract-upstream.sh [version]   默认读 Dockerfile 里的 UPSTREAM_VERSION
# 依赖: crane (brew install crane), npx
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="${1:-$(sed -n 's/^ARG UPSTREAM_VERSION=//p' "$ROOT/jmglink-ha-3d-home/Dockerfile")}"
IMAGE="docker.jmglink.cn/jmglink-ha-3d:${VERSION}"
OUT="$ROOT/upstream/${VERSION}"

rm -rf "$OUT"
mkdir -p "$OUT"
echo ">> 导出 ${IMAGE} -> ${OUT}"
crane export --platform linux/arm64 "$IMAGE" - \
  | tar -x -C "$OUT" --exclude 'app/node_modules' app

# 前端是压缩过的单行 JS，格式化一份到 web-pretty/ 方便阅读和改
echo ">> 格式化前端代码 -> ${OUT}/web-pretty"
mkdir -p "$OUT/web-pretty"
for f in "$OUT"/app/apps/web/dist/assets/*.js; do
  name="$(basename "$f")"
  case "$name" in three-*|hls-*) continue ;; esac  # 第三方库
  cp "$f" "$OUT/web-pretty/$name"
done
npx --yes prettier@3 --ignore-path /dev/null --log-level warn --write "$OUT/web-pretty/"*.js

echo ">> 完成"
