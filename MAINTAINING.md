# 自维护说明

上游作者只发布编译好的镜像 `docker.jmglink.cn/jmglink-ha-3d`，不公开源码。本仓库从 0.1.6 起把镜像里的 `/app` 完整放进 `jmglink-ha-3d-home/app/` 自己维护，HA Supervisor 在设备上用本仓库的 Dockerfile 本地构建，不再依赖作者的镜像。

## 目录结构

- `repository.yaml`：HA 加载项仓库描述
- `jmglink-ha-3d-home/`：加载项
  - `config.yaml`：加载项配置（`slug`、`ingress_port 8099`、`map` 不能改，`version` 发版时递增）
  - `build.yaml`：按架构指定基础镜像 `ghcr.io/home-assistant/<arch>-base:3.22`
  - `Dockerfile`：`apk add nodejs npm` → 用 `app/package-lock.json` 执行 `npm ci --omit=dev` → `COPY app/`
  - `.dockerignore`：排除 `node_modules`、`.DS_Store`
  - `CHANGELOG.md`（中文）、`DOCS.md`、`translations/`
  - `app/`：就是镜像里的 `/app`，也就是源码
    - `apps/server/dist/`：后端，Node.js + Fastify + ws，可读的 ESM JS，直接修改
    - `packages/schema/dist/`：前后端共用的数据结构和规范化逻辑
    - `apps/web/dist/`：前端，React + react-three-fiber + drei 的 Vite 产物
- `scripts/`：`normalize-web-dist.mjs`、`extract-upstream.sh`、`build-image.sh`、`smoke-image.sh`
- `tools/`：只用于开发和测试，不进镜像（mock HA、本地启动、单元测试、e2e）
- `upstream/`：上游提取结果，已 gitignore

## 修改代码

`app/` 下的文件就是源码，没有前端构建步骤，改完直接生效。

- 后端：直接改 `app/apps/server/dist/**/*.js`。
- 前端：`app/apps/web/dist/assets/` 里的 `index.js`、`AppSelect.js`、`HomeView.js`、`FloorplanEditor.js`、`AuthorSupportDialog.js`、`index.css`、`HomeView.css` 是用 prettier 格式化过的业务代码，直接改。`three.js`、`react.js`、`hls.js` 是第三方库，保持压缩内容，不要改（`three.js` 开头对 hls.js 的副作用导入已删除）。
- `ha3dPet.js` 是本仓库新增的按需加载模块（宠物），只在 3D 设置里选了小猫或小狗时由 `AppSelect.js` 动态导入；它直接从 `react.js`、`three.js` 导入用到的别名。
- `hls.js` 只在播放摄像头视频时由 `AppSelect.js` 的 `import("./hls.js")` 加载。不要再在其他文件里写 `import "./hls.js"`，也不要把它加回 `index.html` 的 modulepreload 或 `__vite__mapDeps` 列表，否则首页又会多下载约 525 KB。
- 变量名是压缩后的短名字。新代码写在对应的大文件里，可以直接用文件内部的别名（例如 AppSelect 里 `J` 是 Vector3、`te` 是 useFrame）。
- 每个文件只保留一份 lucide 许可声明（文件里第一个图标前），新增图标时不要再复制许可注释。

### 首页设置（localStorage）

首页的选项都存在浏览器的 localStorage，键名统一是 `ha3d.home.*`：

| 键 | 取值 | 默认 | 说明 |
| --- | --- | --- | --- |
| `ha3d.home.sceneQuality` | `eco` / `smooth` / `balanced` / `high` | 没保存过时：≤2 核或 ≤2 GB → `eco`，≤4 → `smooth`，否则屏宽 ≤1180 px → `balanced`、更宽 → `high` | 画质（上游已有，低端判断是本仓库加的） |
| `ha3d.home.sceneVisualStyle` | `glass` / `cream` | `glass` | 视觉风格（上游已有） |
| `ha3d.home.weatherForecastVisible` | `true` / `false` | `true` | 天气预报条（上游已有） |
| `ha3d.home.overviewDataSettings` | JSON | — | 顶部概览数据（上游已有） |
| `ha3d.home.deviceClickMode` | `detail` / `toggle` | `detail` | 3D 设置「点击设备」：弹出详情 / 直接开关（store 里的 `deviceClickMode`） |
| `ha3d.home.environmentSync` | `true` / `false` | `true` | 3D 设置「时间与天气同步」；关闭后不显示天气动画，昼夜按 7–18 点 |
| `ha3d.home.weatherEntityId` | `weather.*` 或空 | 空（自动：第一个 `weather.*`） | 3D 设置「天气实体」 |
| `ha3d.home.pet` | `none` / `cat` / `dog` | `none` | 3D 设置「宠物」 |

昼夜和太阳位置优先用 `sun.sun` 的 `elevation`、`azimuth`、`rising`（后端对 `sun`、`weather` 两个域始终推送 `state_changed`），没有时按本机时钟近似。

### 3D 对象命名（`ha3d-*`）

新增或修改的 3D 对象都设置了 `name`（部分还有 `userData`），e2e 通过 `?ha3dDebug=1` 时暴露的 `window.__ha3dDebug.get()`（R3F 状态）按名字查找。新增对象请沿用 `ha3d-<功能>-<部件>` 的命名：

| 名字 | 对象 |
| --- | --- |
| `ha3d-door-frame`、`ha3d-door-leaf`（`userData.doorStyle`） | 门框、门扇 |
| `ha3d-light-halo` | 开灯时灯具外的光晕 |
| `ha3d-furniture-<kind>` | 家具（`userData.furnitureId`） |
| `ha3d-computer-screen`、`ha3d-clothes-rack-bars` | 电脑屏幕、晾衣架横杆 |
| `ha3d-env-layer`、`ha3d-env-sun`、`ha3d-env-moon`、`ha3d-env-stars`、`ha3d-env-clouds` | 环境层（跟随相机）和太阳、月亮、星空、云层 |
| `ha3d-weather-rain`、`ha3d-weather-snow`、`ha3d-weather-wind`、`ha3d-weather-fog`、`ha3d-weather-lightning` | 上游已有的天气粒子 |
| `ha3d-pet`（`userData.petKind`、`userData.floorId`） | 宠物，位置是楼层局部坐标（等于平面坐标） |

不参与点击的装饰对象（光晕、环境层、宠物）把 `raycast` 设为空函数。

### 渲染与性能

- 场景默认按需渲染（`frameloop="demand"`）。有持续动画（天气不是晴、多云、夜晚星空、宠物、自动旋转）时，balanced/high 用 `always`；eco/smooth 由 `ha3dFrameTicker` 按 20/30 fps 定时渲染，标签页隐藏时暂停。新增的持续动画只在 `useFrame` 里按 `delta` 推进，不要每帧 `invalidate()`，并把它加进 `t0` 里的持续动画判断。
- 设备自带的逐帧动画（出风 `ce`、传感器脉冲环 `Na`）在 eco/smooth 下不直接 `invalidate()`，而是经 `ha3dDeviceAnimInvalidate` 按 20/30 fps 排队（同一画布共用一个定时器），所以只有设备在动时也限帧，拖动、缩放视角由 OrbitControls 驱动、不受影响。新增的设备逐帧动画也走这个函数。
- 直接开关模式下，设备 `onClick` 先用 `ha3dIsDragClick`（R3F 的 `event.delta` > 6 px）排除拖动视角后的松手。
- 触屏手势（`ha3dDoubleTapPan`）：画布容器上非 passive 的 `touchstart`/`touchmove` 对两指以上的触摸、以及双击的第二次按下调用 `preventDefault`，iOS/iPadOS 和 HA App 的原生手势（双指滑动返回、双击按住的放大镜）拿不到这串触摸；第二次按下没拖动就松手时由它补发一次 `dblclick`。单指单击不拦截，`click` 仍由浏览器生成。
- eco 画质下 `ee`（drei Edges 的包装）不渲染描边。

### 固定文件名与缓存

所有 JS/CSS 都是固定文件名（不带 hash），以后改任何文件都不用改名。`app/apps/server/dist/config/staticAssets.js` 对 JS/CSS/HTML 返回 `Cache-Control: no-cache`（浏览器每次用 ETag 验证，没改动时返回 304），只有带 hash 的图片是 `immutable`。原因：用户浏览器里已经永久缓存了 0.1.6 带 hash 的文件名，换成新文件名才能让改动生效。新增图片时请保留 `<名>-<8位以上hash>.<扩展名>` 的命名，或者接受 no-cache。

### 注释约定

- 原地修改上游代码时，在行尾或代码块前加 `// ha3d-self: <说明>`（CSS 用 `/* ha3d-self: ... */`）。
- 新代码块用 `// ===== ha3d-self: <功能> =====` 标出。
- 新标识符一律加 `ha3d` 前缀，避免和压缩后的短变量名冲突。

这样 `grep -rn ha3d-self jmglink-ha-3d-home/app` 就能列出所有自维护改动。

## 本地运行和测试

依赖：Node 22 以上。

```bash
npm ci --prefix jmglink-ha-3d-home/app --omit=dev
npm ci --prefix tools
```

- 本地启动：`node tools/dev/start-local.mjs --project <项目.json>` 先启动 mock HA（`:18123`），再以 standalone 模式启动应用（`:18099`），数据目录默认 `/tmp/ha3d-dev`（在仓库之外）。
- 单元测试：`npm --prefix tools run test:unit`
- 前端模块图静态检查（esbuild，抓语法错误和不存在的导入名）：`npm --prefix tools run check:web`
- e2e（Playwright）：`HA3D_EVIDENCE_DIR=<仓库外目录> npm --prefix tools run e2e -- <套件...>`；默认使用合成的 `tools/fixtures/demo-project.json`，用自己的项目时设置 `HA3D_PROJECT_JSON=<路径>`。套件：`smoke export models editor interaction cream environment pets perf touch`（`touch`：iPad 视口 + CDP 触摸，`HA3D_TOUCH_BASELINE=1` 时只记录不断言）（`baseline` 只在改动前采集基线时用）。`perf` 会和 `<证据目录>/baseline/…/baseline.json` 对比（也可用 `HA3D_BASELINE_JSON` 指定），并用 `docker image inspect` 记录 `ha3d:arm64`、`ha3d:amd64` 和上游 0.1.6 镜像的大小（docker 不可用时跳过这一项）。

只想快速看后端是否正常：

```bash
cd jmglink-ha-3d-home/app
HA3D_MODE=standalone PORT=18099 HA3D_DATA_DIR=/tmp/ha3d-dev/data HA3D_ASSET_DIR=/tmp/ha3d-dev/assets node apps/server/dist/main.js
curl -s 127.0.0.1:18099/api/health
```

## 构建镜像和冒烟测试

本机需要 docker（macOS 可用 colima：`brew install colima docker`，`colima start --vm-type vz --vz-rosetta --cpu 4 --memory 6`，rosetta 用来跑 amd64）。

```bash
scripts/build-image.sh aarch64 ha3d:arm64     # 或 amd64 ha3d:amd64
scripts/smoke-image.sh ha3d:arm64 [项目.json]  # 启动容器，检查 /api/health 和当前项目 id，结束后删除容器
```

注意：

- Dockerfile 里不要写 `# syntax=` 指令，不要 `FROM` Docker Hub 上的镜像，也不要建 `docker-container` 类型的 buildx builder，它们都要访问 Docker Hub。
- 改了依赖后，在 `jmglink-ha-3d-home/app` 下执行 `npm install --package-lock-only --registry=https://registry.npmjs.org/` 重新生成 `package-lock.json`（`resolved` 必须是 registry.npmjs.org，构建时 npm 会替换成 `NPM_REGISTRY` 指定的源）。改了 Dockerfile、package.json 或 lock 时，两个架构都要构建并冒烟。

### 构建网络

HA 设备构建时需要能访问 `ghcr.io`（基础镜像）、Alpine 包仓库（`dl-cdn.alpinelinux.org`）和 npm 源。npm 源默认 `https://registry.npmmirror.com`，可以在 `build.yaml` 里加 `args: { NPM_REGISTRY: https://registry.npmjs.org }` 改掉。网络不稳时 `apk add` 解包 nodejs 偶尔会报 `I/O error`，Dockerfile 会自动重试 3 次；还是失败就在 HA 里重新安装或重建加载项。

## 发版

1. `jmglink-ha-3d-home/config.yaml` 的 `version` 递增（HA 只在版本号变化时提示更新并重新构建）。
2. 在 `jmglink-ha-3d-home/CHANGELOG.md` 用中文写本次改动。
3. 推送到 master，在 HA 的加载项商店里刷新并更新加载项。

## 对比上游新版本

```bash
scripts/extract-upstream.sh <版本>      # 依赖 brew install crane
diff -r upstream/<版本>/web-stable jmglink-ha-3d-home/app/apps/web/dist
diff -r upstream/<版本>/app/apps/server/dist jmglink-ha-3d-home/app/apps/server/dist
```

`extract-upstream.sh` 只用于对比：它从作者的镜像仓库提取 `/app` 到 `upstream/<版本>/`，并用和导入时相同的 `normalize-web-dist.mjs` 生成固定文件名的 `web-stable/`，所以可以直接 `diff -r`。按 diff 把需要的上游改动手工合入本仓库，`ha3d-self` 注释标出的地方要保留。

## 隐私

- 不要把自己家的项目 JSON（例如 `ha3d-*.json`，已 gitignore）或其中的实体名、房间、坐标、截图提交进仓库。入库的测试数据只用合成的 fixture。
- e2e 证据（截图、视频、日志）写到仓库之外的目录（`HA3D_EVIDENCE_DIR`）。
