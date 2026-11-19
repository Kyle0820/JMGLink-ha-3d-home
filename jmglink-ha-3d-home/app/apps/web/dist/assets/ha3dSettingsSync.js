// ===== ha3d-self: 0.2.2 首页设置跨设备同步 =====
// 页面工具菜单和「3D 设置」里的选项原来只存在本机 localStorage。现在保存到后端 data 目录（GET/PUT ./api/ui-settings），
// 一台设备改了以后后端通过 ws 推送 ui.settings_updated，其他已打开的页面不刷新就会更新。
// localStorage 仍然保留一份，作为本机缓存（离线、后端不可用时照常使用）。
// 和设备性能、硬件有关的设置每台设备单独保存，不在这里同步：画质 ha3d.home.sceneQuality、语音开关和语音管线。
// 升级迁移：页面启动时，本机有、后端还没有的键上传到后端；后端已有的键以后端为准写回本机。
import { a as ha3dReact } from "./react.js";
const ha3dSyncedKeys = new Set([
  "ha3d.home.sceneVisualStyle",
  "ha3d.home.weatherForecastVisible",
  "ha3d.home.deviceClickMode",
  "ha3d.home.environmentSync",
  "ha3d.home.weatherEntityId",
  "ha3d.home.pet",
]);
const ha3dSyncedPrefixes = ["ha3d.home.overviewDataSettings."];
export function ha3dIsSyncedKey(t) {
  return ha3dSyncedKeys.has(t) || ha3dSyncedPrefixes.some((s) => t.startsWith(s));
}
// 后端最近确认过的值（键不在里面 = 后端没有这个键）
const ha3dKnown = new Map(),
  // 本机改了、还没成功写到后端的值
  ha3dPending = new Map(),
  ha3dListeners = new Set();
let ha3dFlushing = Promise.resolve(),
  ha3dReady;
function ha3dLocalGet(t) {
  try {
    return window.localStorage.getItem(t);
  } catch {
    return null;
  }
}
function ha3dLocalSet(t, s) {
  try {
    s === null ? window.localStorage.removeItem(t) : window.localStorage.setItem(t, s);
  } catch {}
}
function ha3dLocalSyncedEntries() {
  const t = {};
  try {
    for (let s = 0; s < window.localStorage.length; s += 1) {
      const o = window.localStorage.key(s);
      if (o && ha3dIsSyncedKey(o)) {
        const r = window.localStorage.getItem(o);
        r !== null && (t[o] = r);
      }
    }
  } catch {}
  return t;
}
async function ha3dFetchJson(t, s) {
  const o = new AbortController(),
    r = window.setTimeout(() => o.abort(), 5e3);
  try {
    const n = await fetch(t, { ...s, signal: o.signal });
    if (!n.ok) throw new Error(`${t} ${n.status}`);
    return await n.json();
  } finally {
    window.clearTimeout(r);
  }
}
function ha3dEmit(t) {
  if (!t.length) return;
  for (const s of ha3dListeners)
    try {
      s(t);
    } catch {}
}
// 把后端的值写到本机；本机还有没发出去的修改时，那个键以本机为准
function ha3dApply(t) {
  const s = [];
  for (const [o, r] of Object.entries(t ?? {})) {
    if (!ha3dIsSyncedKey(o)) continue;
    const n = typeof r == "string" ? r : null;
    n === null ? ha3dKnown.delete(o) : ha3dKnown.set(o, n);
    if (ha3dPending.has(o)) continue;
    ha3dLocalGet(o) !== n && (ha3dLocalSet(o, n), s.push(o));
  }
  ha3dEmit(s);
}
function ha3dFlush() {
  return (ha3dFlushing = ha3dFlushing.then(async () => {
    if (!ha3dPending.size) return;
    const t = Object.fromEntries(ha3dPending);
    try {
      const s = await ha3dFetchJson("./api/ui-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values: t }),
      });
      for (const [o, r] of Object.entries(t)) {
        ha3dPending.get(o) === r && ha3dPending.delete(o);
        ha3dKnown.set(o, r);
      }
      ha3dApply(s.values);
    } catch {
      // 后端暂时不可用：保留在 ha3dPending，ws 重连后 ha3dRefreshSettings 会再发
    }
  }));
}
/** 用户修改了设置：写本机，并在值和后端不同时发给后端。非同步的键只写本机。 */
export function ha3dSaveSetting(t, s) {
  const o = String(s);
  ha3dLocalSet(t, o);
  if (!ha3dIsSyncedKey(t) || (ha3dKnown.get(t) === o && !ha3dPending.has(t))) return;
  ha3dPending.set(t, o);
  void ha3dFlush();
}
/** 从后端拉取全部设置并应用；先把本机还没发出去的修改发掉。永远不会 reject。 */
export async function ha3dRefreshSettings() {
  try {
    await ha3dFlush();
    const t = await ha3dFetchJson("./api/ui-settings");
    const s = t.values ?? {};
    // 迁移：本机有、后端没有的键上传（0.2.1 及以前只存在本机）
    for (const [o, r] of Object.entries(ha3dLocalSyncedEntries()))
      Object.prototype.hasOwnProperty.call(s, o) || ha3dPending.has(o) || ha3dPending.set(o, r);
    ha3dApply(s);
    ha3dPending.size && (await ha3dFlush());
  } catch {}
}
/** 页面启动时调用一次（同一页面里重复调用返回同一个 Promise）。 */
export function ha3dInitSettings() {
  return (ha3dReady ??= ha3dRefreshSettings());
}
/** ws 收到 ui.settings_updated */
export function ha3dApplyRemoteSettings(t) {
  ha3dApply(t?.values);
}
/** 订阅后端推送导致的本机设置变化，回调参数是变化的键列表；返回取消订阅函数。 */
export function ha3dOnRemoteSettings(t) {
  return ha3dListeners.add(t), () => ha3dListeners.delete(t);
}
/**
 * 把 React state 写回本机，并在用户修改时同步到后端。第一次运行（挂载）只写本机、不上传，
 * 避免新设备用默认值覆盖后端已有的设置；后端推送引起的 state 变化和后端值相同，也不会再上传。
 * 和原来的写法一样只在值变化时运行（键随项目变化时，值也会随之重新读取）。
 */
export function ha3dUseSyncedSetting(t, s) {
  const o = ha3dReact.useRef(!0);
  ha3dReact.useEffect(() => {
    if (o.current) {
      ((o.current = !1), ha3dLocalSet(t, s));
      return;
    }
    ha3dSaveSetting(t, s);
  }, [s]);
}
