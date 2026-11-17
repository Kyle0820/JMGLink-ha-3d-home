// 冒烟测试：首页、编辑器 2D、编辑器 3D 都没有 pageerror，所有资源返回 200，首页设备数量大于 0，各截一张图。
export default async function smoke(ctx) {
  const { check } = ctx;
  const badResponses = (page) => page.ha3dResponses.filter((item) => item.status !== 200 && item.status !== 101 && item.status !== 204);

  const home = await ctx.newPage();
  await ctx.gotoHome(home);
  const deviceCount = await ctx.countSceneDevices(home);
  await ctx.shot(home, "home");
  const assets = home.ha3dResponses.filter((item) => item.url.startsWith("/assets/"));
  check("首页没有 pageerror", home.ha3dErrors.length === 0, home.ha3dErrors.slice(0, 3));
  check("首页设备数量大于 0", deviceCount > 0, { deviceCount });
  check("首页 /assets/ 资源都返回 200", assets.length > 0 && assets.every((item) => item.status === 200), { count: assets.length });

  await ctx.gotoEditor(home, { view: "2d" });
  await ctx.shot(home, "editor-2d");
  check("编辑器 2D 没有 pageerror", home.ha3dErrors.length === 0, home.ha3dErrors.slice(0, 3));

  await home.locator(".view-switch button", { hasText: "3D" }).click();
  await home.waitForSelector("canvas", { timeout: 30_000 });
  await ctx.waitForScene(home, { requireDevices: false });
  await ctx.shot(home, "editor-3d");
  check("编辑器 3D 没有 pageerror", home.ha3dErrors.length === 0, home.ha3dErrors.slice(0, 3));
  check("所有同源请求返回 200", badResponses(home).length === 0, badResponses(home).slice(0, 5));

  const calls = await ctx.mock.calls();
  return {
    deviceCount,
    assetRequests: assets.length,
    responses: home.ha3dResponses.length,
    consoleErrors: home.ha3dConsoleErrors.slice(0, 10),
    mockCalls: calls.length,
  };
}
