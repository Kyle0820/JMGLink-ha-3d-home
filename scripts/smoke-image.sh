#!/usr/bin/env bash
# 冒烟测试：以 standalone 模式启动镜像，检查 /api/health 和当前项目。
# 用法: scripts/smoke-image.sh <tag> [project.json]
#   给了 project.json 时先拷到临时数据目录的 projects/current-project.json，并打印它的 project.id
# 环境变量: DOCKER（默认 docker）、SMOKE_PORT（默认 18199）、SMOKE_DATA_ROOT（默认 ~/.cache/ha3d-smoke）
set -euo pipefail
TAG="${1:-}"
PROJECT="${2:-}"
if [ -z "$TAG" ]; then echo "用法: $0 <tag> [project.json]" >&2; exit 2; fi
DOCKER="${DOCKER:-docker}"
PORT="${SMOKE_PORT:-18199}"
# 临时数据目录放在 $HOME 下：colima/podman machine 默认只把 $HOME 共享给虚拟机，
# 放在 /tmp 或 $TMPDIR 时容器里看到的是空目录（project.json 会被静默忽略）
SMOKE_ROOT="${SMOKE_DATA_ROOT:-$HOME/.cache/ha3d-smoke}"
mkdir -p "$SMOKE_ROOT"
DATA="$(mktemp -d "$SMOKE_ROOT/run.XXXXXX")"
NAME="ha3d-smoke-$$"
cleanup() {
  "$DOCKER" rm -f "$NAME" >/dev/null 2>&1 || true
  rm -rf "$DATA"
}
trap cleanup EXIT

if [ -n "$PROJECT" ]; then
  mkdir -p "$DATA/projects"
  cp "$PROJECT" "$DATA/projects/current-project.json"
fi
chmod -R a+rwX "$DATA"

echo ">> 启动 ${TAG}（端口 ${PORT}）"
"$DOCKER" run -d --name "$NAME" -p "$PORT:8099" -e HA3D_MODE=standalone -v "$DATA:/data" "$TAG" >/dev/null
"$DOCKER" image inspect "$TAG" --format 'image: {{.Os}}/{{.Architecture}} size={{.Size}}'

HEALTH=""
for _ in $(seq 1 30); do
  if HEALTH="$(curl -sf -m 2 "http://127.0.0.1:$PORT/api/health")"; then break; fi
  HEALTH=""
  sleep 1
done
if [ -z "$HEALTH" ]; then
  echo "!! 30 秒内 /api/health 没有响应" >&2
  "$DOCKER" logs "$NAME" >&2 || true
  exit 1
fi
echo "health: $HEALTH"
case "$HEALTH" in *'"ok":true'*) ;; *) echo "!! health 不是 ok:true" >&2; exit 1 ;; esac

CURRENT="$(curl -sf -m 5 "http://127.0.0.1:$PORT/api/projects/current")"
# 摘要 = id + 楼层/房间/设备数量。内置示例项目的 id 也是 demo-apartment，只比 id 分不出是否真的加载了 project.json
SUMMARY='const p=j.project||j;const f=p.floors||[];const n=(k)=>f.reduce((a,x)=>a+(x[k]||[]).length,0);console.log(`${p.id||""} floors=${f.length} rooms=${n("rooms")} devices=${n("devices")}`)'
ACTUAL="$(printf '%s' "$CURRENT" | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);${SUMMARY}})")"
echo "project.id: ${ACTUAL%% *}"
echo "project: $ACTUAL"
if [ -n "$PROJECT" ]; then
  EXPECTED="$(node -e "const j=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));${SUMMARY}" "$PROJECT")"
  if [ "$ACTUAL" != "$EXPECTED" ]; then
    echo "!! 当前项目与 $(basename "$PROJECT") 不一致：期望 ${EXPECTED}，实际 ${ACTUAL}" >&2
    exit 1
  fi
  echo "当前项目与 $(basename "$PROJECT") 一致"
fi
echo ">> 冒烟通过: $TAG"
