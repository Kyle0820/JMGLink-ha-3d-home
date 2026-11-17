# 在 HA 设备上由 Supervisor 本地构建，BUILD_FROM 由 build.yaml 按架构指定。
# 不要加 "# syntax=" 指令：它会去 Docker Hub 拉 dockerfile 前端镜像。
ARG BUILD_FROM=ghcr.io/home-assistant/aarch64-base:3.22
FROM ${BUILD_FROM}

ARG BUILD_VERSION=dev
ARG NPM_REGISTRY=https://registry.npmmirror.com

# 网络不稳时 apk 解包 nodejs 会偶发 "I/O error"，最多重试 3 次
RUN for attempt in 1 2 3; do \
        apk add --no-cache nodejs npm && break; \
        [ "$attempt" = 3 ] && exit 1; \
        echo "apk add 失败，5 秒后重试（第 ${attempt} 次）"; sleep 5; \
    done

WORKDIR /app
COPY app/package.json app/package-lock.json ./
COPY app/apps/server/package.json apps/server/package.json
COPY app/packages/schema/package.json packages/schema/package.json
RUN npm ci --omit=dev --no-audit --no-fund --registry="${NPM_REGISTRY}" \
    && npm cache clean --force \
    && apk del npm

COPY app/ ./

ENV NODE_ENV=production \
    HA3D_MODE=addon \
    HA3D_BUILD_VERSION=${BUILD_VERSION} \
    PORT=8099 \
    HA3D_DATA_DIR=/data \
    HA3D_ASSET_DIR=/media/ha-3d

EXPOSE 8099
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:8099/api/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

# 不走 s6 的 /init，与上游镜像一样由 node 直接当 PID 1（main.js 自己处理 SIGTERM）
ENTRYPOINT []
CMD ["node", "apps/server/dist/main.js"]
