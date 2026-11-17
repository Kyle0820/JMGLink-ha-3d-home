// HomeAssistantClient.queueEntityUpdate：绑定过滤生效时，sun / weather 域仍然放行。
import assert from "node:assert/strict";
import { test } from "node:test";
import { HomeAssistantClient } from "../../jmglink-ha-3d-home/app/apps/server/dist/ha/HomeAssistantClient.js";

const entity = (entityId) => ({ entityId, domain: entityId.split(".")[0], name: entityId, state: "on", attributes: {} });

function createClient() {
  return new HomeAssistantClient({ mode: "standalone", port: 0, dataDir: "/tmp", assetDir: "/tmp", ha: { restUrl: "http://127.0.0.1:9/api", websocketUrl: "ws://127.0.0.1:9/api/websocket", token: undefined } });
}

test("绑定过滤生效时 sun.sun、weather.* 和已绑定实体进入 pendingEntityUpdates，未绑定 sensor 不进入", () => {
  const client = createClient();
  client.setBoundEntityFilter(["light.a"]);
  for (const id of ["sun.sun", "weather.home", "weather.backup", "light.a", "sensor.x"]) client.queueEntityUpdate(entity(id));
  try {
    assert.deepEqual([...client.pendingEntityUpdates.keys()].sort(), ["light.a", "sun.sun", "weather.backup", "weather.home"]);
    assert.equal(client.pendingEntityUpdates.has("sensor.x"), false);
  } finally {
    client.clearPendingEntityUpdates();
  }
});

test("没有绑定过滤时所有实体都进入 pendingEntityUpdates", () => {
  const client = createClient();
  for (const id of ["sun.sun", "sensor.x"]) client.queueEntityUpdate(entity(id));
  try {
    assert.equal(client.pendingEntityUpdates.size, 2);
  } finally {
    client.clearPendingEntityUpdates();
  }
});

test("weather 的 state_changed 不带预报时沿用上一次的预报，带预报或不是 weather 时原样返回", () => {
  const client = createClient();
  client.entities.set("weather.home", { ...entity("weather.home"), attributes: { forecast: [{ condition: "rainy" }] } });
  const kept = client.ha3dKeepForecast({ ...entity("weather.home"), state: "cloudy", attributes: { temperature: 20 } });
  assert.deepEqual(kept.attributes, { temperature: 20, forecast: [{ condition: "rainy" }] });
  assert.equal(kept.state, "cloudy");
  const fresh = client.ha3dKeepForecast({ ...entity("weather.home"), attributes: { forecast: [] } });
  assert.deepEqual(fresh.attributes.forecast, []);
  const other = entity("sensor.x");
  assert.equal(client.ha3dKeepForecast(other), other);
  assert.deepEqual(client.ha3dKeepForecast(entity("weather.backup")).attributes, {});
});

test("刷新绑定过滤时不丢弃已排队的 sun / weather 更新", () => {
  const client = createClient();
  for (const id of ["sun.sun", "weather.home", "sensor.x"]) client.queueEntityUpdate(entity(id));
  client.setBoundEntityFilter(["light.a"]);
  try {
    assert.deepEqual([...client.pendingEntityUpdates.keys()].sort(), ["sun.sun", "weather.home"]);
  } finally {
    client.clearPendingEntityUpdates();
  }
});
