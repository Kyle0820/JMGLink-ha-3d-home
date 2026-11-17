#!/usr/bin/env bash
# 在本机按 HA Supervisor 的方式构建加载项镜像，用于验证 Dockerfile。
# 用法: scripts/build-image.sh <aarch64|amd64> [tag]
# 依赖: docker（默认 docker driver，不要建 docker-container 类型的 buildx builder，它要从 Docker Hub 拉镜像）
# 其他参数通过环境变量传：NPM_REGISTRY（默认用 Dockerfile 里的 npmmirror）、DOCKER（默认 docker，可设为 podman）
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ADDON="$ROOT/jmglink-ha-3d-home"
ARCH="${1:-}"
case "$ARCH" in
  aarch64) PLATFORM=linux/arm64 ;;
  amd64) PLATFORM=linux/amd64 ;;
  *) echo "用法: $0 <aarch64|amd64> [tag]" >&2; exit 2 ;;
esac
TAG="${2:-jmglink-ha-3d-home:local-$ARCH}"
DOCKER="${DOCKER:-docker}"
BUILD_FROM="ghcr.io/home-assistant/${ARCH}-base:3.22"
BUILD_VERSION="$(sed -n 's/^version:[[:space:]]*//p' "$ADDON/config.yaml" | tr -d '"'"'"' ')"
EXTRA=()
if [ -n "${NPM_REGISTRY:-}" ]; then EXTRA+=(--build-arg "NPM_REGISTRY=$NPM_REGISTRY"); fi
echo ">> 构建 ${TAG}（${PLATFORM}，BUILD_FROM=${BUILD_FROM}，BUILD_VERSION=${BUILD_VERSION}）"
"$DOCKER" build \
  --platform "$PLATFORM" \
  --build-arg "BUILD_FROM=$BUILD_FROM" \
  --build-arg "BUILD_VERSION=$BUILD_VERSION" \
  ${EXTRA[@]+"${EXTRA[@]}"} \
  -t "$TAG" \
  "$ADDON"
echo ">> 完成: $TAG"
