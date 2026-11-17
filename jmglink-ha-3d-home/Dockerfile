# 基于作者发布的官方镜像，只覆盖 patches/app 里改过的文件。
# 升级上游版本：改 UPSTREAM_VERSION，重新跑 scripts/extract-upstream.sh 对比补丁。
ARG UPSTREAM_VERSION=0.1.6
FROM docker.jmglink.cn/jmglink-ha-3d:${UPSTREAM_VERSION}

# patches/app 的目录结构与镜像内 /app 一一对应
COPY patches/app/ /app/
