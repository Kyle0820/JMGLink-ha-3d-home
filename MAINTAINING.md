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
- 前端：`app/apps/web/dist/assets/` 里的 `index.js`、`AppSelect.js`、`HomeView.js`、`FloorplanEditor.js`、`index.css`、`HomeView.css` 是用 prettier 格式化过的业务代码，直接改。`three.js`、`react.js`、`hls.js` 是第三方库，保持压缩内容，不要改（`three.js` 开头对 hls.js 的副作用导入已删除）。
- `ha3dSettingsSync.js` 是本仓库新增的模块（首页设置跨设备同步），由 `index.js` 和 `HomeView.js` 静态导入。
- `ha3dVoice.js` 是本仓库新增的模块（0.2.3 麦克风语音输入），由 `index.js` 静态导入：先用浏览器自带的语音识别（`webkitSpeechRecognition`），没有或被拒绝时录音（16 kHz 16 位单声道 PCM），`POST ./api/ha/assist-stt?pipeline_id=…&sample_rate=16000`（`Content-Type: audio/pcm`，最长 30 秒）交给后端，后端用 HA 的 `assist_pipeline/run`（只跑 stt 阶段，二进制帧 = 1 字节 handler id + 音频）识别，返回 `{ text }`；识别出的文字和键入的指令一样提交给 `./api/ha/conversation`。非安全上下文（http://局域网地址）里浏览器既没有麦克风也不能用语音识别，直接在面板里提示需要 HTTPS。
- `ha3dPet.js` 是本仓库新增的按需加载模块（宠物），只在 3D 设置里选了小猫或小狗时由 `AppSelect.js` 动态导入；它直接从 `react.js`、`three.js` 导入用到的别名。
- `hls.js` 只在播放摄像头视频时由 `AppSelect.js` 的 `import("./hls.js")` 加载。不要再在其他文件里写 `import "./hls.js"`，也不要把它加回 `index.html` 的 modulepreload 或 `__vite__mapDeps` 列表，否则首页又会多下载约 525 KB。1.1.0 起 `index.html` 预加载 `react.js`、`three.js`、`ha3dSettingsSync.js`、`ha3dVoice.js`、`HomeView.js`、`AppSelect.js`（modulepreload）和 `HomeView.css`（stylesheet），让首页界面代码和项目数据的 API 请求并行下载（Vite 的预加载助手看到同 href 的 link 已存在就跳过）；这个列表里仍然不能有 hls.js。
- 变量名是压缩后的短名字。新代码写在对应的大文件里，可以直接用文件内部的别名（例如 AppSelect 里 `J` 是 Vector3、`te` 是 useFrame）。
- 每个文件只保留一份 lucide 许可声明（文件里第一个图标前），新增图标时不要再复制许可注释。

### 首页设置（后端同步 + localStorage）

首页的选项键名统一是 `ha3d.home.*`。0.2.2 起，下表标「同步」的键保存在后端 `<dataDir>/ui-settings.json`（`GET/PUT /api/ui-settings`，`PUT` 的 body 是 `{ "values": { 键: 字符串或 null } }`），修改后后端通过 ws 广播 `ui.settings_updated`，其他已打开的页面不刷新就会更新；浏览器的 localStorage 仍保留一份作为本机缓存。标「本机」的键只存在 localStorage。前端逻辑在 `assets/ha3dSettingsSync.js`：页面启动时（`index.js` 的 `load()`）拉取后端设置写进本机缓存；本机有、后端没有的键上传（从 0.2.1 及以前升级时的迁移）；用户修改时用 `ha3dSaveSetting` 或 `ha3dUseSyncedSetting`（挂载时只写本机、不上传）。新增同步的键时，把键名加进 `ha3dSyncedKeys`，并在 `ha3dOnRemoteSettings` 的回调里重新读取对应的 state。

| 同步 | 键（省略 `ha3d.home.` 前缀） |
| --- | --- |
| 同步 | `sceneVisualStyle`、`weatherForecastVisible`、`overviewDataSettings.<项目 id>`、`deviceClickMode`、`environmentSync`、`weatherEntityId`、`pet` |
| 本机 | `sceneQuality`（和设备性能有关）、`voiceEnabled` 和 `ha3d.voice.pipeline`（和麦克风有关）、编辑器的 `ha3d:show-*`（含 1.2.0 的属性面板展开状态 `ha3d:show-inspector`） |

各键的取值：

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

### 门锁绑定（0.2.5）
门（opening，`type: "door"`）可选字段 `lockEntityId`（只接受 `lock.*`，其他取值在 schema 的 `normalizeOpening` 里丢弃，没绑定时不写这个键），和门磁 `entityId` 互不影响。后端 `collectBoundEntityIds`、首页 `HomeView.js` 的实体订阅都包含它，所以只绑在门上、没有作为设备放置的门锁也会实时更新。

1.1.0 起的门扇开合规则（`AppSelect.js` 门组件 `pa` 的 `p`）：绑了门磁时只看门磁；没绑门磁、只绑门锁时，门锁 `unlocked` 开门，其他状态（`locked`、`locking`、`unlocking`、`jammed`、`open`、未知、离线、门锁实体不存在）都关门；两个都没绑时门保持打开（上游行为）。锁牌显示不受影响。

### 房间状态汇总（1.1.0）

首页双击房间聚焦时的 `.room-focus-card` 由 `HomeView.js` 的 `ha3dRoomSummary(room, floor, entities)` 生成：

- 实体：该楼层 `roomId === room.id` 的设备的 `entityId`，加上房间全部绑定（`room.bindings` 所有能力、所有角色的 `entityIds`），按 entityId 去重。
- 第一行 `.ha3d-room-summary-env`：只看 `sensor` 域，温度用 AppSelect 导出的 `ha3dTemperatureOf`（`nn`）、湿度用 `ha3dHumidityOf`（`an`），各取最低值，格式 `🌡 24.5°C · 💧 52%`；都没有时不显示，只有一项时只显示那一项。
- 类别行 `.ha3d-room-summary-row`（`data-category`，顺序固定，`ha3dRoomSummaryCategories`）：`light` 灯、`switch` 开关/插座、`climate` 空调/风扇（climate 不是 off/unavailable/unknown，或 fan 为 on）、`cover` 窗帘（open/opening 或 `current_position > 0`）、`doorWindow` 门窗（device_class 是 door/window/opening/garage_door 的 binary_sensor 为 on）、`lock` 门锁（unlocked/open 算未上锁），文本「<类别> 开启数/总数 开」（门锁是「未上锁」），总数为 0 的类别不显示。
- 最后一行 `.ha3d-room-summary-offline`「离线 N」：实体不存在或状态 `unavailable` 的个数。房间没有任何实体时只显示「暂无设备」，未连接时显示「连接后显示设备数据」。
- 颜色：`index.css` 里 `.ha3d-room-summary*` 在玻璃、奶油、夜间各有一份，新增风格时一起补。

### 编辑器属性面板收起（1.2.0）

- `FloorplanEditor.js` 的属性面板状态 `js`/`We` 由 `ha3dInitialInspectorOpen` 初始化：宽 >760px 时读 localStorage 的 `ha3d:show-inspector`；没存过或宽 ≤760px 时按上游默认，宽 >960px 展开。`js` 每次变化都写入这个键，宽 ≤760px（底部抽屉）时不写。
- 选中对象、放下家具时上游会自动展开（`We(!0)`），这个状态也会写入；选家具、设备、底图、标定工具时上游会收起面板，同样写入。存的就是当前看到的状态。
- 收起按钮是 `.ha3d-inspector-collapse`（lucide panel-right-close，`ha3dPanelRightCloseIcon`），只在宽 ≥761px 显示，同时隐藏 761–1120px 原来的 X 按钮 `.inspector-close`。收起后显示的是上游的 `.inspector-fab`「属性」按钮。

### 首页模式（1.2.0 删除底部 tab）

- `HomeView.js` 的模式 `q` 固定为 `overview`，setter `de` 不再调用；tab 列表 `$n` 和 `.mijia-mode-tabs` 的 JS、CSS 都已删除。
- `AppSelect.js` 里照明、遮阳、环境、安防的 `presentationMode` 分支，`.mijia-room-badge` 和 `.scene-mode-*` 样式还在，但已经到不了。以后要恢复模式切换，需要另外给出入口。

### 奶油风格的天气预报条和语音面板（1.2.0）

- 奶油风格不再覆盖 `.home-weather-forecast` 及其子元素。奶油在 `.home-workspace` 上改了 `--home-warm/cool/health`、字体和等宽数字，`index.css` 末尾的 ha3d-self 规则在预报条上恢复成玻璃的值。fixes120 和 cream 套件断言两种风格预报条的计算样式一致，再加奶油覆盖会让测试失败。
- 语音面板 `.voice-assistant-wrap` 由 `index.js` 渲染在 `.app-shell` 下，不在 `.home-workspace` 里，所以 `.visual-style-cream .voice-*` 那组旧规则不生效。奶油风格的语音面板规则要写成 `.mode-home:has(.visual-style-cream) .voice-*`。
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
| `ha3d-appliance-body`（`userData.appliance`：`washer` / `dryer` / `dishwasher` / `sock_washer` / `shower`，`userData.upper`：是否叠放上层） | 家电样式的模型根节点；叠放上层在模型内部抬高 `ha3dApplianceStackHeight` |
| `ha3d-appliance-drum`、`ha3d-appliance-indicator` | 洗衣机/烘干机/洗袜机转动的内筒，家电运行指示灯（off、unknown 时 `emissiveIntensity` 为 0） |
| `ha3d-shower-water` | 花洒水流，只在出水时挂载 |
| `ha3d-tv-screen`（`userData.petPortrait`：`dog` / `cat`） | 电视（`media_player.tv`）开着时屏幕上的宠物大头照，贴图用 2D canvas 画，跟随 3D 设置的宠物（没选时是小狗） |
| `ha3d-door-lock`（`userData.lockEntityId`、`lockState`、`lockColor`）、`ha3d-door-lock-light` | 门绑定门锁（opening 的 `lockEntityId`）时门扇上的锁牌和状态灯，只显示、不可点 |

不参与点击的装饰对象（光晕、环境层、宠物、花洒水流、电视画面、门锁牌）把 `raycast` 设为空函数。

家电样式（`Ta` 的家电分支）的半透明只用 `ha3dDim`：实体不存在或状态 `unavailable`/`offline` 时 0.5，`unknown` 不算离线（触发式模板二值传感器在 HA 重启后、第一次触发前一直是 unknown），画成不透明、停止状态。其他设备仍按 `Qe` 把 unknown 当离线。

### 渲染与性能

- 场景默认按需渲染（`frameloop="demand"`）。有持续动画（天气不是晴、多云、夜晚星空、宠物、自动旋转）时，balanced/high 用 `always`；eco/smooth 由 `ha3dFrameTicker` 按 20/30 fps 定时渲染，标签页隐藏时暂停。新增的持续动画只在 `useFrame` 里按 `delta` 推进，不要每帧 `invalidate()`，并把它加进 `t0` 里的持续动画判断。
- 设备自带的逐帧动画（出风 `ce`、传感器脉冲环 `Na`、家电内筒 `ha3dApplianceSpin`、花洒水流 `ha3dShowerWater`）在 eco/smooth 下不直接 `invalidate()`，而是经 `ha3dDeviceAnimInvalidate` 按 20/30 fps 排队（同一画布共用一个定时器），所以只有设备在动时也限帧，拖动、缩放视角由 OrbitControls 驱动、不受影响。新增的设备逐帧动画也走这个函数。
- 直接开关模式下，设备 `onClick` 先用 `ha3dIsDragClick`（R3F 的 `event.delta` > 6 px）排除拖动视角后的松手。
- 触屏手势（`ha3dDoubleTapPan`）：画布容器上非 passive 的 `touchstart`/`touchmove` 对两指以上的触摸、以及双击的第二次按下调用 `preventDefault`，iOS/iPadOS 和 HA App 的原生手势（双指滑动返回、双击按住的放大镜）拿不到这串触摸；第二次按下没拖动就松手时由它补发一次 `dblclick`。单指单击不拦截，`click` 仍由浏览器生成。
- eco 画质下 `ee`（drei Edges 的包装）不渲染描边。

### 固定文件名与缓存

所有 JS/CSS 都是固定文件名（不带 hash），以后改任何文件都不用改名。`app/apps/server/dist/config/staticAssets.js` 对 JS/CSS/HTML 返回 `Cache-Control: no-cache`（浏览器每次用 ETag 验证，没改动时返回 304），只有带 hash 的图片是 `immutable`。原因：用户浏览器里已经永久缓存了 0.1.6 带 hash 的文件名，换成新文件名才能让改动生效。新增图片时请保留 `<名>-<8位以上hash>.<扩展名>` 的命名，或者接受 no-cache。

### 压缩（1.1.0）

`app/apps/server/dist/config/ha3dCompression.js` 在 `main.js` 里注册为 Fastify 的 `onSend` 钩子，不加新依赖，用 `node:zlib`：

- 只处理 `GET`、状态 200、还没有 `content-encoding` 的响应；按 `Accept-Encoding` 优先 br、其次 gzip（`;q=0` 表示不接受），都不接受时原样返回。
- 静态文件：`staticAssets.js` 的 `setHeaders` 把路径、大小、mtime 记在 `reply.raw.ha3dStaticFile`；扩展名是 js/css/html/json/svg/md/txt 且 ≥ 1 KB 时压缩（br quality 9 / gzip level 9），结果按「路径 + 编码」缓存在内存里，大小或 mtime 变了就重算，并发请求共用同一个 Promise。图片不压缩。ETag 不变，`If-None-Match` 仍返回 304。
- API：`application/json` 且 ≥ 1 KB 时现压（br quality 5 / gzip level 6），不缓存。
- 压缩的响应都带 `Vary: Accept-Encoding`。不要在磁盘上放 `.br`/`.gz` 预压缩文件，它们会和源码不同步。
- 经 HA ingress 访问时，HA core 转发前去掉 `Accept-Encoding` 并在边界自己压缩（`homeassistant/components/hassio/ingress.py`），所以这个钩子只对直连端口和独立 Docker 部署生效。

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
- e2e（Playwright）：`HA3D_EVIDENCE_DIR=<仓库外目录> npm --prefix tools run e2e -- <套件...>`；默认使用合成的 `tools/fixtures/demo-project.json`，用自己的项目时设置 `HA3D_PROJECT_JSON=<路径>`。套件：`smoke export models editor interaction cream environment pets perf touch fixes022 fixes023 appliances fixes025 fixes110 loadtime fixes120`（`fixes120`：1.2.0 的作者弹窗删除（文件、代码引用、首页和编辑器 2D/3D 里的元素、请求）；属性面板收起、恢复、持久化、选中设备时自动展开（1440 和 900 宽，2D 和 3D）；奶油和玻璃天气预报条计算样式一致（1440 和 390 宽，附两种风格的截图）；奶油语音面板黑字；首页没有模式 tab，设备面板和场景面板仍在；`HA3D_FIXES120_BASELINE=1` 时只记录不断言，`HA3D_FIXES120_ONLY=author,inspector,weather,voice,tabs` 只跑其中几段）（`fixes110`：1.1.0 的只绑门锁的门按门锁开合、状态未知的家电不透明、房间状态汇总；`HA3D_FIXES110_BASELINE=1` 时只记录不断言，`HA3D_FIXES110_ONLY=lock,dryer,room` 只跑其中几段）（`loadtime`：首页加载前后对比（不限速和 CDP 限速 20/10 Mbps、40 ms 两种网络，传输字节、3D 首帧、设备出现时间）和编辑器里没有作者弹窗入口、不请求头像图片；`HA3D_LOADTIME_BASELINE=1` 时在改动前采集，写 `<证据目录>/loadtime/before.json`；之后正常运行时读 `HA3D_LOADTIME_BEFORE_JSON` 或这个 before.json 对比并断言，1.1.0 改动前的基线保存在证据目录之外时用 `HA3D_LOADTIME_BEFORE_JSON` 指定；`HA3D_LOADTIME_RUNS` 是每种网络的冷启动次数，默认 3）（`fixes025`：0.2.5 的电视宠物大头照、入户门绑定门锁、状态未知的家电实体在设备库里可选可放；`HA3D_FIXES025_BASELINE=1` 时只记录不断言，`HA3D_FIXES025_ONLY=tv,lock,library` 只跑其中几段）（`appliances`：家电样式：两种风格下渲染、运行/停止状态不同、叠放对齐、省电限帧、编辑器模型选项）（`fixes023`：0.2.3 的麦克风语音输入（假的语音识别和麦克风，含 http 访问、没有权限时的提示）、开门颜色和关门一致、小狗停留时间，`HA3D_FIXES023_BASELINE=1` 时只记录不断言，`HA3D_FIXES023_ONLY=voice,door,dog` 只跑其中几段）（`fixes022`：0.2.2 的白色小狗、页面工具菜单拖动后仍显示、两个浏览器上下文的设置同步；`HA3D_FIXES022_BASELINE=1` 时只记录不断言）（`touch`：iPad 视口 + CDP 触摸，`HA3D_TOUCH_BASELINE=1` 时只记录不断言）（`baseline` 只在改动前采集基线时用）。`perf` 需要基线：和 `<证据目录>/baseline/…/baseline.json` 对比，证据目录里没有时必须用 `HA3D_BASELINE_JSON` 指定（「B6 首页 JS 传输字节」比较的是传输字节，基线是未压缩传输），并用 `docker image inspect` 记录 `ha3d:arm64`、`ha3d:amd64` 和上游 0.1.6 镜像的大小（docker 不可用时跳过这一项）。

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
