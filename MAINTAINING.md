# 自维护说明

上游作者只发布编译好的镜像 `docker.jmglink.cn/jmglink-ha-3d`，不公开源码。本仓库改为在 HA 本地构建：以上游镜像为基础，用 `patches/app/` 覆盖改过的文件。

## 结构

- `jmglink-ha-3d-home/Dockerfile`：`FROM` 上游镜像，`COPY patches/app/ /app/`
- `jmglink-ha-3d-home/patches/app/`：目录结构与镜像内 `/app` 一一对应，只放改动过的文件
- `scripts/extract-upstream.sh`：把上游镜像的 `/app` 提取到 `upstream/<版本>/`（不入库），前端格式化到 `upstream/<版本>/web-pretty/`

镜像内 `/app` 的布局：

- `apps/server/dist/`：后端，Node.js + Fastify，tsc 编译产物，可直接阅读修改
- `apps/web/dist/`：前端，React + Three.js，Vite 压缩打包，没有 sourcemap
- `packages/schema/dist/`：前后端共用的数据结构

## 修 bug

1. `scripts/extract-upstream.sh` 提取当前版本（依赖 `brew install crane`）
2. 后端：把 `upstream/<版本>/app/apps/server/dist/xxx.js` 复制到 `patches/app/apps/server/dist/xxx.js` 再修改
3. 前端：把 `upstream/<版本>/web-pretty/xxx-HASH.js` 复制到 `patches/app/apps/web/dist/assets/xxx-HASH.js`（文件名保持不变）再修改，格式化后的 JS 可以直接运行
4. `config.yaml` 的 `version` 递增（如 `0.1.6-fix2`），更新 `CHANGELOG.md`，推送后在 HA 里更新加载项即可重新构建

## 跟进上游新版本

1. 改 `Dockerfile` 里的 `UPSTREAM_VERSION`，重新跑提取脚本
2. 逐个对比补丁文件与新版本对应文件，重新应用改动。前端文件名里的 hash 每次构建都会变，需要按新文件名重新放置
3. `config.yaml` 的 `version` 改为 `<新版本>-fix1`
