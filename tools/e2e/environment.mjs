// F3 时间与天气同步（plan.md 第 3 节）：用 mock 设置 weather.home 的 9 种天气 × sun.sun 高度 45° / 2°（傍晚）/ −20°，
// 每种组合截图，断言 .home-workspace 的 env-phase-* / env-weather-* class、ha3d-env-* / ha3d-weather-* 对象和主光源；
// 下雨、下雪、多云、夜晚星空各录一段视频；设置里选第二个天气实体（weather.backup）后生效；没有 sun.sun 时按本机时钟；
// 关闭同步后这些对象全部消失、昼夜回到 7–18 点规则。
import path from "node:path";

const NOON = "2026-06-01T12:00:00";
const NIGHT_CLOCK = "2026-06-01T22:00:00";
const CONDITIONS = ["sunny", "partlycloudy", "cloudy", "rainy", "pouring", "snowy", "lightning-rainy", "fog", "windy"];
const KIND = { sunny: "clear", partlycloudy: "cloudy", cloudy: "cloudy", rainy: "rain", pouring: "rain", snowy: "snow", "lightning-rainy": "storm", fog: "fog", windy: "wind" };
const SUNS = [
  { label: "day", elevation: 45, azimuth: 180, rising: false, phase: "day", theme: "day" },
  { label: "dusk", elevation: 2, azimuth: 285, rising: false, phase: "dusk", theme: "day" },
  { label: "night", elevation: -20, azimuth: 340, rising: false, phase: "night", theme: "night" },
];
const ENV_NAMES = ["ha3d-env-sun", "ha3d-env-moon", "ha3d-env-stars", "ha3d-env-clouds"];
const WEATHER_NAMES = ["ha3d-weather-rain", "ha3d-weather-snow", "ha3d-weather-wind", "ha3d-weather-fog", "ha3d-weather-lightning"];
const SYNC_KEY = "ha3d.home.environmentSync";
const WEATHER_KEY = "ha3d.home.weatherEntityId";
const QUALITY = "smooth";

/** 某个组合应当出现的对象。 */
function expectedObjects(phase, kind) {
  const calm = kind === "clear" || kind === "cloudy";
  return {
    "ha3d-env-sun": phase === "day" && calm,
    "ha3d-env-moon": phase === "night" && calm,
    "ha3d-env-stars": phase === "night" && calm,
    "ha3d-env-clouds": kind === "cloudy",
    "ha3d-weather-rain": kind === "rain" || kind === "storm",
    "ha3d-weather-snow": kind === "snow",
    "ha3d-weather-wind": kind === "wind" || kind === "storm",
    "ha3d-weather-fog": kind === "fog" || kind === "storm",
    "ha3d-weather-lightning": kind === "storm",
  };
}

const workspaceClass = (page) => page.evaluate(() => document.querySelector(".home-workspace")?.className ?? "");

/** 等 .home-workspace 的 class 满足 predicate（实体更新经后端推送，要几百毫秒）。 */
async function waitClass(ctx, page, predicate, timeout = 10_000) {
  const deadline = Date.now() + timeout;
  let value = await workspaceClass(page);
  while (Date.now() < deadline && !predicate(value)) {
    await ctx.sleep(250);
    value = await workspaceClass(page);
  }
  return value;
}

/** 主平行光（不是位置 (-7,7,-8) 的补光）的位置、颜色、强度，以及环境光强度。 */
const readLights = (page) =>
  page.evaluate(() => {
    const s = window.__ha3dDebug?.get();
    const out = { directional: [], ambient: [], hemisphere: [] };
    s?.scene.traverse((object) => {
      const position = object.position ? [object.position.x, object.position.y, object.position.z].map((v) => Number(v.toFixed(2))) : undefined;
      if (object.isDirectionalLight && !(object.position.x === -7 && object.position.y === 7)) out.directional.push({ position, color: `#${object.color.getHexString()}`, intensity: Number(object.intensity.toFixed(3)) });
      if (object.isAmbientLight) out.ambient.push(Number(object.intensity.toFixed(3)));
      if (object.isHemisphereLight) out.hemisphere.push(Number(object.intensity.toFixed(3)));
    });
    return { main: out.directional[0], ambient: out.ambient[0], hemisphere: out.hemisphere[0] };
  });

/** .home-scene 的背景（天空）在右上角一小块的平均亮度：截图右上角不会有户型。 */
async function skyLuma(ctx, page, buffer) {
  const box = await page.evaluate(() => {
    const rect = document.querySelector(".home-scene").getBoundingClientRect();
    return { x: rect.right - 10, y: rect.top + 10 };
  });
  return Number(ctx.sampleLuma(buffer, box.x, box.y, 6).toFixed(1));
}

async function setSun(ctx, sun) {
  await ctx.mock.set("sun.sun", sun.elevation > 0 ? "above_horizon" : "below_horizon", { elevation: sun.elevation, azimuth: sun.azimuth, rising: sun.rising });
}

const openSettings = async (page) => {
  if (!(await page.locator(".corner-dock-menu button").first().isVisible())) await page.locator(".corner-dock-toggle").click();
  await page.waitForTimeout(300);
  await page.locator('button[aria-label="3D 设置"]').click();
  const panel = page.locator('.home-settings-panel[role="dialog"]');
  await panel.waitFor({ state: "visible", timeout: 5000 });
  return panel;
};

export default async function environment(ctx) {
  const { check } = ctx;
  const out = { quality: QUALITY, combos: {}, cream: {}, videos: {}, entitySelect: {}, clock: {}, disabled: {} };

  // ---------- 9 种天气 × 3 个太阳高度（玻璃全量，奶油 4 种天气 × 3 个高度） ----------
  for (const [style, conditions] of [
    ["glass", CONDITIONS],
    ["cream", ["sunny", "cloudy", "rainy", "snowy"]],
  ]) {
    const page = await ctx.newPage({ startTime: NOON });
    await ctx.mock.set("weather.home", "sunny");
    await setSun(ctx, SUNS[0]);
    await ctx.gotoHome(page, { style, quality: QUALITY, prefs: { [SYNC_KEY]: null, [WEATHER_KEY]: "weather.home", "ha3d.home.pet": null } });
    const target = style === "glass" ? out.combos : out.cream;
    for (const sun of SUNS) {
      await setSun(ctx, sun);
      for (const condition of conditions) {
        const kind = KIND[condition];
        await ctx.mock.set("weather.home", condition);
        const className = await waitClass(ctx, page, (value) => value.includes(`env-phase-${sun.phase}`) && value.includes(`env-weather-${kind}`));
        await page.waitForTimeout(1200);
        const objects = await ctx.namedObjects(page);
        const lights = await readLights(page);
        const file = await ctx.shot(page, `F3-${style}-${sun.label}-${condition}`);
        const expected = expectedObjects(sun.phase, kind);
        const mismatched = Object.entries(expected).filter(([name, want]) => Boolean(objects[name]) !== want).map(([name, want]) => `${name}:${want ? "缺少" : "多余"}`);
        const record = {
          className: className.split(/\s+/).filter((item) => item.startsWith("env-") || item.startsWith("theme-")).join(" "),
          objects: Object.fromEntries([...ENV_NAMES, ...WEATHER_NAMES].filter((name) => objects[name]).map((name) => [name, objects[name]])),
          lights,
          skyLuma: await skyLuma(ctx, page, file.buffer),
          screenshot: path.basename(file.path),
          mismatched,
        };
        target[`${sun.label}-${condition}`] = record;
        const classOk = className.includes("env-sync") && className.includes(`env-phase-${sun.phase}`) && className.includes(`env-weather-${kind}`) && className.includes(`theme-${sun.theme}`);
        check(`F3[${style} ${sun.label} ${condition}] class 是 env-phase-${sun.phase} env-weather-${kind} theme-${sun.theme}`, classOk, record.className);
        check(`F3[${style} ${sun.label} ${condition}] 对应的 ha3d-env-*/ha3d-weather-* 对象齐全且没有多余`, mismatched.length === 0, mismatched.length ? mismatched : record.objects);
      }
    }
    check(`F3[${style}] 没有 pageerror`, page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
    await page.context().close();
  }

  // 主光源：白天白色、傍晚暖橙、夜晚冷蓝，强度 白天 > 傍晚 > 夜晚；下雨比晴天暗；位置随方位角变化
  {
    const day = out.combos["day-sunny"].lights;
    const dusk = out.combos["dusk-sunny"].lights;
    const night = out.combos["night-sunny"].lights;
    const rain = out.combos["day-rainy"].lights;
    const cloudy = out.combos["day-cloudy"].lights;
    check("F3 主光源颜色：白天 #ffffff、傍晚 #ffc48a、夜晚 #9fb4ff", day.main.color === "#ffffff" && dusk.main.color === "#ffc48a" && night.main.color === "#9fb4ff", { day: day.main, dusk: dusk.main, night: night.main });
    check(
      "F3 主光源和环境光强度：白天 > 傍晚 > 夜晚，多云、下雨比晴天暗",
      day.main.intensity > dusk.main.intensity && dusk.main.intensity > night.main.intensity && cloudy.main.intensity < day.main.intensity && rain.main.intensity < cloudy.main.intensity && night.ambient < day.ambient,
      { day: day.main.intensity, dusk: dusk.main.intensity, night: night.main.intensity, cloudy: cloudy.main.intensity, rain: rain.main.intensity, ambient: { day: day.ambient, night: night.ambient } },
    );
    check("F3 主光源位置随太阳方位/高度变化（半径 14，y ≥ 3）", JSON.stringify(day.main.position) !== JSON.stringify(dusk.main.position) && dusk.main.position[1] >= 3 && Math.abs(Math.hypot(...day.main.position) - 14) < 0.1, { day: day.main.position, dusk: dusk.main.position, night: night.main.position });
    for (const [style, combos] of [
      ["glass", out.combos],
      ["cream", out.cream],
    ]) {
      const sky = (key) => combos[key].skyLuma;
      check(`F3[${style}] 天空背景：夜晚比白天暗、下雨比晴天暗`, sky("night-sunny") < sky("day-sunny") && sky("day-rainy") < sky("day-sunny") && sky("night-rainy") < sky("day-rainy"), {
        daySunny: sky("day-sunny"),
        dayRainy: sky("day-rainy"),
        duskSunny: sky("dusk-sunny"),
        nightSunny: sky("night-sunny"),
        nightRainy: sky("night-rainy"),
      });
    }
  }

  // ---------- 视频：下雨、下雪、多云、夜晚星空 ----------
  for (const [name, condition, sun] of [
    ["rain", "rainy", SUNS[0]],
    ["snow", "snowy", SUNS[0]],
    ["cloudy", "cloudy", SUNS[0]],
    ["night-stars", "sunny", SUNS[2]],
  ]) {
    await ctx.mock.set("weather.home", condition);
    await setSun(ctx, sun);
    const page = await ctx.newPage({ startTime: NOON, video: path.join(ctx.dir, ".video-tmp") });
    await ctx.gotoHome(page, { quality: QUALITY, prefs: { [SYNC_KEY]: null, [WEATHER_KEY]: "weather.home", "ha3d.home.pet": null } });
    await page.waitForTimeout(6000);
    const frames = await ctx.countFrames(page, 2000);
    const file = await ctx.saveVideo(page, path.join(ctx.dir, "videos", `F3-${name}.webm`));
    out.videos[name] = { file: path.basename(file), framesIn2s: frames };
    check(`F3 视频 ${name} 已录制且场景在持续渲染`, Boolean(file) && frames > 0, out.videos[name]);
  }

  // ---------- 天气实体下拉框：选第二个天气实体后生效，刷新后保留 ----------
  {
    await ctx.mock.set("weather.home", "sunny");
    await ctx.mock.set("weather.backup", "snowy");
    await setSun(ctx, SUNS[0]);
    const page = await ctx.newPage({ startTime: NOON });
    await ctx.gotoHome(page, { quality: QUALITY, prefs: { [SYNC_KEY]: null, [WEATHER_KEY]: "weather.home", "ha3d.home.pet": null } });
    out.entitySelect.before = await waitClass(ctx, page, (value) => value.includes("env-weather-clear"));
    const panel = await openSettings(page);
    const trigger = panel.locator('.app-select-trigger[aria-label="天气实体"]');
    out.entitySelect.triggerBefore = (await trigger.textContent())?.trim();
    await trigger.click();
    const menu = page.locator('.app-select-menu[role="listbox"]');
    await menu.waitFor({ state: "visible", timeout: 5000 });
    out.entitySelect.options = (await menu.locator('[role="option"]').allTextContents()).map((text) => text.trim());
    await ctx.shot(page, "F3-weather-entity-options");
    await menu.locator('[role="option"]', { hasText: "weather.backup" }).click();
    out.entitySelect.after = await waitClass(ctx, page, (value) => value.includes("env-weather-snow"));
    await page.waitForTimeout(1200); // Canvas 内是另一个 React 根，粒子比 DOM class 晚一点挂载
    out.entitySelect.stored = await page.evaluate((key) => window.localStorage.getItem(key), WEATHER_KEY);
    out.entitySelect.objects = await ctx.namedObjects(page);
    await page.locator('button[aria-label="关闭 3D 设置"]').click();
    await page.waitForTimeout(1200);
    await ctx.shot(page, "F3-weather-entity-backup-snow");
    await page.reload();
    await page.waitForSelector("canvas", { timeout: 30_000 });
    await ctx.waitForScene(page, { settleMs: 1500 });
    out.entitySelect.afterReload = await workspaceClass(page);
    check("F3 天气实体下拉框列出「自动」和两个 weather 实体", out.entitySelect.options.length === 3 && out.entitySelect.options.some((text) => text.includes("weather.home")) && out.entitySelect.options.some((text) => text.includes("weather.backup")), out.entitySelect.options);
    check("F3 选 weather.backup（下雪）后场景切到 env-weather-snow 并出现雪花", out.entitySelect.before.includes("env-weather-clear") && out.entitySelect.after.includes("env-weather-snow") && Boolean(out.entitySelect.objects["ha3d-weather-snow"]), {
      before: out.entitySelect.before.match(/env-weather-\w+/)?.[0],
      after: out.entitySelect.after.match(/env-weather-\w+/)?.[0],
    });
    check("F3 天气实体保存到 localStorage 并在刷新后保留", out.entitySelect.stored === "weather.backup" && out.entitySelect.afterReload.includes("env-weather-snow"), { stored: out.entitySelect.stored });
    await page.context().close();
    await ctx.mock.set("weather.backup", "sunny");
  }

  // ---------- 没有 sun.sun 的太阳高度时按本机时钟近似 ----------
  {
    await ctx.mock.set("sun.sun", "unknown", { friendly_name: "Sun" }, { merge: false });
    for (const [label, time, phase, theme] of [
      ["noon", NOON, "day", "day"],
      ["22h", NIGHT_CLOCK, "night", "night"],
    ]) {
      const page = await ctx.newPage({ startTime: time });
      await ctx.gotoHome(page, { quality: QUALITY, prefs: { [SYNC_KEY]: null, [WEATHER_KEY]: "weather.home", "ha3d.home.pet": null } });
      const className = await waitClass(ctx, page, (value) => value.includes(`env-phase-${phase}`));
      out.clock[label] = className.split(/\s+/).filter((item) => item.startsWith("env-") || item.startsWith("theme-")).join(" ");
      await ctx.shot(page, `F3-clock-${label}`);
      check(`F3 没有 sun.sun 时按本机时钟：${label} → env-phase-${phase}、theme-${theme}`, className.includes(`env-phase-${phase}`) && className.includes(`theme-${theme}`), out.clock[label]);
      await page.context().close();
    }
    await setSun(ctx, SUNS[0]);
  }

  // ---------- 关闭同步：对象全部消失，昼夜按本机 7–18 点 ----------
  {
    await ctx.mock.set("weather.home", "cloudy");
    await setSun(ctx, SUNS[2]);
    const page = await ctx.newPage({ startTime: NOON });
    await ctx.gotoHome(page, { quality: QUALITY, prefs: { [SYNC_KEY]: null, [WEATHER_KEY]: "weather.home", "ha3d.home.pet": null } });
    await waitClass(ctx, page, (value) => value.includes("env-phase-night") && value.includes("env-weather-cloudy"));
    await page.waitForTimeout(800);
    out.disabled.beforeObjects = await ctx.namedObjects(page);
    out.disabled.beforeClass = await workspaceClass(page);
    await ctx.mock.set("weather.home", "rainy");
    await waitClass(ctx, page, (value) => value.includes("env-weather-rain"));
    await page.waitForTimeout(800);
    out.disabled.rainObjects = await ctx.namedObjects(page);
    const panel = await openSettings(page);
    const group = panel.locator('[role="group"][aria-label="时间与天气同步"]');
    out.disabled.initialPressed = await group.getByRole("button", { name: "开启" }).getAttribute("aria-pressed");
    await group.getByRole("button", { name: "关闭" }).click();
    await page.waitForTimeout(400);
    await ctx.shot(page, "F3-settings-sync-off");
    out.disabled.selectDisabled = await panel.locator(".ha3d-weather-select").evaluate((el) => el.classList.contains("disabled"));
    await page.locator('button[aria-label="关闭 3D 设置"]').click();
    await page.waitForTimeout(1500);
    out.disabled.afterObjects = await ctx.namedObjects(page);
    out.disabled.afterClass = await workspaceClass(page);
    out.disabled.stored = await page.evaluate((key) => window.localStorage.getItem(key), SYNC_KEY);
    out.disabled.framesIn5s = await ctx.countFrames(page, 5000);
    await ctx.shot(page, "F3-sync-off");
    const leftover = Object.keys(out.disabled.afterObjects).filter((name) => ENV_NAMES.includes(name) || WEATHER_NAMES.includes(name) || name === "ha3d-env-layer");
    check("F3 同步开启时默认是「开启」，夜晚多云有月亮、星空、云，下雨有雨丝", out.disabled.initialPressed === "true" && ["ha3d-env-moon", "ha3d-env-stars", "ha3d-env-clouds"].every((name) => out.disabled.beforeObjects[name]) && Boolean(out.disabled.rainObjects["ha3d-weather-rain"]), {
      before: out.disabled.beforeObjects,
      rain: out.disabled.rainObjects["ha3d-weather-rain"],
    });
    check("F3 关闭同步后 ha3d-env-*、ha3d-weather-* 对象全部消失，没有 env-* class", leftover.length === 0 && !/\benv-/.test(out.disabled.afterClass), { leftover, className: out.disabled.afterClass });
    check("F3 关闭同步后昼夜回到 7–18 点规则（本机 12:00 → theme-day，尽管太阳高度 −20°），设置写入 localStorage", out.disabled.afterClass.includes("theme-day") && out.disabled.stored === "false" && out.disabled.selectDisabled, {
      stored: out.disabled.stored,
      selectDisabled: out.disabled.selectDisabled,
    });
    // 帧数只记录：项目里开着的空调出风等设备动画仍会渲染；「没有持续动画时 0 帧」由 perf 套件断言
    check("没有 pageerror", page.ha3dErrors.length === 0, page.ha3dErrors.slice(0, 3));
    await page.context().close();
  }

  await ctx.mock.reset();
  await ctx.writeJson(path.join(ctx.dir, "environment.json"), out);
  return { combos: Object.keys(out.combos).length, cream: Object.keys(out.cream).length, videos: out.videos, entitySelect: { options: out.entitySelect.options }, clock: out.clock };
}
