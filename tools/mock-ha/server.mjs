#!/usr/bin/env node
// 本地调试用的 mock Home Assistant：实现 HomeAssistantClient 用到的 REST / WebSocket 子集。
// 实体从项目 JSON 引用到的 entity_id 自动生成，另加 sun.sun、weather.home 和 weather.backup。
// 用法：node mock-ha/server.mjs --port 18123 --project <json> --token dev-token
import { readFileSync } from "node:fs";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

const now = () => new Date().toISOString();

/** 收集项目 JSON 里引用到的全部 entity_id。 */
export function collectProjectEntityIds(project) {
  const ids = new Set();
  const add = (value) => {
    if (typeof value === "string" && value.includes(".")) ids.add(value.trim());
  };
  for (const floor of project?.floors ?? []) {
    for (const device of floor.devices ?? []) add(device.entityId);
    for (const opening of floor.openings ?? []) {
      add(opening.entityId);
      add(opening.lockEntityId);
    }
    for (const room of floor.rooms ?? []) {
      for (const groups of Object.values(room.bindings ?? {})) {
        for (const binding of Object.values(groups ?? {})) for (const id of binding?.entityIds ?? []) add(id);
      }
    }
  }
  for (const widget of project?.dashboardWidgets ?? []) {
    add(widget.entityId);
    for (const item of widget.items ?? []) add(item.entityId);
  }
  return [...ids];
}

const sensorDefaults = [
  [/temp/, "23.5", { unit_of_measurement: "°C", device_class: "temperature" }],
  [/humid/, "52", { unit_of_measurement: "%", device_class: "humidity" }],
  [/pm2_?5|pm25/, "12", { unit_of_measurement: "µg/m³", device_class: "pm25" }],
  [/co2|carbon_dioxide/, "620", { unit_of_measurement: "ppm", device_class: "carbon_dioxide" }],
  [/voc/, "120", { unit_of_measurement: "µg/m³", device_class: "volatile_organic_compounds" }],
  [/illum|lux|light_level/, "320", { unit_of_measurement: "lx", device_class: "illuminance" }],
  [/power|watt/, "120", { unit_of_measurement: "W", device_class: "power" }],
  [/energy/, "3.2", { unit_of_measurement: "kWh", device_class: "energy" }],
  [/battery/, "88", { unit_of_measurement: "%", device_class: "battery" }],
];

/** 按域给出默认状态和属性。lightIndex 用来让灯隔一个开一个。 */
export function defaultEntityState(entityId, lightIndex = 0) {
  const [domain, objectId = ""] = entityId.split(".");
  const name = objectId.toLowerCase();
  const friendly_name = objectId.replace(/_/g, " ") || entityId;
  switch (domain) {
    case "light": {
      const on = lightIndex % 2 === 0;
      return {
        state: on ? "on" : "off",
        attributes: {
          friendly_name,
          brightness: on ? 180 : null,
          rgb_color: on ? [255, 214, 170] : null,
          color_mode: on ? "color_temp" : null,
          color_temp_kelvin: on ? 3600 : null,
          min_color_temp_kelvin: 2700,
          max_color_temp_kelvin: 6500,
          supported_color_modes: ["color_temp", "rgb"],
          supported_features: 40,
        },
      };
    }
    case "switch":
      return { state: "off", attributes: { friendly_name } };
    case "fan":
      return { state: "off", attributes: { friendly_name, percentage: 0, percentage_step: 25, supported_features: 1 } };
    case "cover":
      return { state: "open", attributes: { friendly_name, current_position: 60, supported_features: 15 } };
    case "climate":
      return {
        state: "cool",
        attributes: {
          friendly_name,
          hvac_modes: ["off", "cool", "heat", "dry", "fan_only", "auto"],
          min_temp: 16,
          max_temp: 30,
          target_temp_step: 1,
          temperature: 26,
          current_temperature: 25.5,
          current_humidity: 50,
          fan_mode: "auto",
          fan_modes: ["auto", "low", "medium", "high"],
          supported_features: 393,
        },
      };
    case "sensor": {
      const match = sensorDefaults.find(([pattern]) => pattern.test(name));
      return match
        ? { state: match[1], attributes: { friendly_name, state_class: "measurement", ...match[2] } }
        : { state: "21", attributes: { friendly_name, state_class: "measurement" } };
    }
    case "binary_sensor": {
      const attributes = { friendly_name };
      if (/door|window|contact/.test(name)) attributes.device_class = "door";
      else if (/motion|occupancy|presence/.test(name)) attributes.device_class = "motion";
      return { state: "off", attributes };
    }
    case "lock":
      return { state: "locked", attributes: { friendly_name, supported_features: 1 } };
    case "camera":
      return { state: "idle", attributes: { friendly_name, access_token: "mock", entity_picture: `/api/camera_proxy/${entityId}?token=mock` } };
    case "media_player":
      return { state: "idle", attributes: { friendly_name, volume_level: 0.3, supported_features: 152463 } };
    case "alarm_control_panel":
      return { state: "disarmed", attributes: { friendly_name, code_arm_required: false, supported_features: 63 } };
    case "vacuum":
      return { state: "docked", attributes: { friendly_name, battery_level: 100, supported_features: 16383 } };
    case "sun":
      return { state: "above_horizon", attributes: { friendly_name: "Sun", elevation: 45, azimuth: 180, rising: false, next_rising: now(), next_setting: now() } };
    case "weather":
      return {
        state: "sunny",
        attributes: {
          friendly_name: objectId === "home" ? "Home" : friendly_name.replace(/^./, (c) => c.toUpperCase()),
          temperature: 24,
          temperature_unit: "°C",
          humidity: 55,
          wind_speed: 8,
          wind_speed_unit: "km/h",
          pressure: 1013,
          pressure_unit: "hPa",
          supported_features: 3,
        },
      };
    default:
      return { state: "on", attributes: { friendly_name } };
  }
}

function forecastFor(entity) {
  const conditions = ["sunny", "partlycloudy", "rainy", "cloudy"];
  const base = Number(entity?.attributes?.temperature ?? 24);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return conditions.map((condition, index) => ({
    datetime: new Date(start.getTime() + (index + 1) * 86_400_000).toISOString(),
    condition,
    temperature: base + index,
    templow: base - 6 + index,
    precipitation_probability: condition === "rainy" ? 80 : 10,
    humidity: 50 + index * 5,
    wind_speed: 6 + index,
  }));
}

export function createMockHa({ project, token = "dev-token", log = console.log } = {}) {
  // weather.backup：第二个天气实体，供 3D 设置里的「天气实体」下拉框测试
  const entityIds = [...new Set([...collectProjectEntityIds(project), "sun.sun", "weather.home", "weather.backup"])];
  const states = new Map();
  const calls = [];
  const subscribers = new Map(); // socket -> Set<subscription id>

  // 恢复默认状态；和真实 HA 一样，对状态或属性有变化的实体广播 state_changed（否则应用里还是旧状态，例如 sun.sun 的高度）
  const reset = () => {
    const previous = new Map(states);
    states.clear();
    calls.length = 0;
    let lightIndex = 0;
    for (const entityId of entityIds) {
      const isLight = entityId.startsWith("light.");
      const { state, attributes } = defaultEntityState(entityId, isLight ? lightIndex++ : 0);
      const time = now();
      states.set(entityId, { entity_id: entityId, state, attributes, last_changed: time, last_updated: time, context: { id: `mock-${entityId}` } });
      const old = previous.get(entityId);
      if (old && (old.state !== state || JSON.stringify(old.attributes) !== JSON.stringify(attributes))) broadcast(entityId, old);
    }
  };

  const broadcast = (entityId, oldState) => {
    const newState = states.get(entityId);
    setTimeout(() => {
      for (const [socket, ids] of subscribers) {
        for (const id of ids) {
          socket.send(JSON.stringify({
            id,
            type: "event",
            event: { event_type: "state_changed", data: { entity_id: entityId, old_state: oldState ?? null, new_state: newState }, origin: "LOCAL", time_fired: now() },
          }));
        }
      }
    }, 50);
  };
  reset();

  const setState = (entityId, state, attributes, { merge = true } = {}) => {
    const previous = states.get(entityId);
    const time = now();
    const next = {
      entity_id: entityId,
      state: state === undefined ? previous?.state ?? "unknown" : String(state),
      attributes: merge ? { ...(previous?.attributes ?? {}), ...(attributes ?? {}) } : { ...(attributes ?? {}) },
      last_changed: previous && previous.state === String(state ?? previous.state) ? previous.last_changed : time,
      last_updated: time,
      context: { id: `mock-${Date.now()}` },
    };
    states.set(entityId, next);
    broadcast(entityId, previous);
    return next;
  };

  /** 按服务修改实体状态，返回被修改的状态列表。 */
  const applyService = (domain, service, data = {}) => {
    const targets = [].concat(data.entity_id ?? []).filter((id) => states.has(id));
    const changed = [];
    for (const entityId of targets) {
      const current = states.get(entityId);
      const entityDomain = entityId.split(".")[0];
      const attrs = {};
      let state = current.state;
      const isOn = current.state === "on";
      if (entityDomain === "cover") {
        const open = current.state === "open" || Number(current.attributes.current_position ?? 0) > 0;
        if (service === "open_cover" || service === "turn_on" || (service === "toggle" && !open)) (state = "open"), (attrs.current_position = 100);
        else if (service === "close_cover" || service === "turn_off" || (service === "toggle" && open)) (state = "closed"), (attrs.current_position = 0);
        else if (service === "set_cover_position") {
          const position = Number(data.position ?? 0);
          state = position > 0 ? "open" : "closed";
          attrs.current_position = position;
        }
      } else if (entityDomain === "lock") {
        if (service === "lock") state = "locked";
        else if (service === "unlock") state = "unlocked";
        else if (service === "open") state = "open";
      } else if (entityDomain === "climate") {
        if (service === "set_temperature" && data.temperature !== undefined) attrs.temperature = Number(data.temperature);
        if (service === "set_hvac_mode") state = String(data.hvac_mode);
        if (service === "turn_off") state = "off";
        if (service === "turn_on") state = current.state === "off" ? "cool" : current.state;
        if (service === "set_fan_mode") attrs.fan_mode = data.fan_mode;
      } else {
        if (service === "turn_on") state = "on";
        else if (service === "turn_off") state = "off";
        else if (service === "toggle") state = isOn ? "off" : "on";
        if (entityDomain === "light") {
          if (data.brightness !== undefined) (attrs.brightness = Number(data.brightness)), (state = "on");
          if (data.rgb_color) (attrs.rgb_color = data.rgb_color), (attrs.color_mode = "rgb"), (state = "on");
          if (data.color_temp_kelvin) (attrs.color_temp_kelvin = Number(data.color_temp_kelvin)), (attrs.color_mode = "color_temp"), (state = "on");
          if (state === "on" && current.attributes.brightness == null && attrs.brightness === undefined) attrs.brightness = 180;
        }
        if (entityDomain === "fan" && service === "set_percentage") {
          attrs.percentage = Number(data.percentage ?? 0);
          state = attrs.percentage > 0 ? "on" : "off";
        }
      }
      changed.push(setState(entityId, state, attrs));
    }
    return changed;
  };

  let sttText = "打开客厅灯";
  const recordCall = (via, domain, service, data) => {
    calls.push({ time: now(), via, domain, service, data });
  };

  const readBody = (request) =>
    new Promise((resolve) => {
      const chunks = [];
      request.on("data", (chunk) => chunks.push(chunk));
      request.on("end", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        try {
          resolve(raw ? JSON.parse(raw) : {});
        } catch {
          resolve({});
        }
      });
    });

  const sendJson = (response, status, body) => {
    response.writeHead(status, { "content-type": "application/json" });
    response.end(JSON.stringify(body));
  };

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, "http://mock");
    const pathname = url.pathname;
    response.on("finish", () => log(`[mock-ha] ${request.method} ${pathname} ${response.statusCode}`));
    try {
      if (pathname.startsWith("/mock/")) {
        if (request.method === "POST" && pathname === "/mock/set") {
          const body = await readBody(request);
          if (typeof body.entityId !== "string" || !body.entityId.includes(".")) return sendJson(response, 400, { error: "entityId required" });
          return sendJson(response, 200, { state: setState(body.entityId, body.state, body.attributes, { merge: body.merge !== false }) });
        }
        if (request.method === "GET" && pathname === "/mock/calls") return sendJson(response, 200, { calls });
        if (request.method === "POST" && pathname === "/mock/reset") {
          reset();
          return sendJson(response, 200, { ok: true, entityCount: states.size });
        }
        if (request.method === "GET" && pathname === "/mock/states") return sendJson(response, 200, { states: [...states.values()] });
        // assist_pipeline/run 的 stt 阶段返回的识别文字
        if (request.method === "POST" && pathname === "/mock/stt") {
          const body = await readBody(request);
          sttText = typeof body.text === "string" ? body.text : sttText;
          return sendJson(response, 200, { text: sttText });
        }
        return sendJson(response, 404, { error: "Not found" });
      }
      if (!pathname.startsWith("/api/")) return sendJson(response, 404, { error: "Not found" });
      const isCameraProxy = pathname.startsWith("/api/camera_proxy/");
      const authorized = request.headers.authorization === `Bearer ${token}` || (isCameraProxy && url.searchParams.has("token"));
      if (!authorized) return sendJson(response, 401, { message: "Unauthorized" });
      if (request.method === "GET" && pathname === "/api/") return sendJson(response, 200, { message: "API running." });
      if (request.method === "GET" && pathname === "/api/states") return sendJson(response, 200, [...states.values()]);
      const stateMatch = /^\/api\/states\/([^/]+)$/.exec(pathname);
      if (request.method === "GET" && stateMatch) {
        const state = states.get(decodeURIComponent(stateMatch[1]));
        return state ? sendJson(response, 200, state) : sendJson(response, 404, { message: "Entity not found." });
      }
      const serviceMatch = /^\/api\/services\/([^/]+)\/([^/]+)$/.exec(pathname);
      if (request.method === "POST" && serviceMatch) {
        const body = await readBody(request);
        recordCall("rest", serviceMatch[1], serviceMatch[2], body);
        return sendJson(response, 200, applyService(serviceMatch[1], serviceMatch[2], body));
      }
      if (request.method === "GET" && isCameraProxy) {
        response.writeHead(200, { "content-type": "image/png" });
        return response.end(PNG_1X1);
      }
      if (request.method === "POST" && pathname === "/api/conversation/process") {
        const body = await readBody(request);
        recordCall("rest", "conversation", "process", body);
        return sendJson(response, 200, {
          response: { speech: { plain: { speech: `收到：${body.text ?? ""}`, extra_data: null } }, card: {}, language: body.language ?? "zh-CN", response_type: "action_done", data: { targets: [], success: [], failed: [] } },
          conversation_id: body.conversation_id ?? "mock-conversation",
        });
      }
      return sendJson(response, 404, { message: "Not found" });
    } catch (error) {
      log(`[mock-ha] error ${error instanceof Error ? error.stack : error}`);
      return sendJson(response, 500, { message: "Mock error" });
    }
  });

  const areas = [];
  const seenAreas = new Set();
  const entityAreas = new Map();
  for (const floor of project?.floors ?? []) {
    const roomAreas = new Map();
    for (const room of floor.rooms ?? []) {
      if (!room.haAreaId) continue;
      roomAreas.set(room.id, room.haAreaId);
      if (!seenAreas.has(room.haAreaId)) {
        seenAreas.add(room.haAreaId);
        areas.push({ area_id: room.haAreaId, name: room.name ?? room.haAreaId, aliases: [], floor_id: null, icon: null, labels: [], picture: null });
      }
    }
    for (const device of floor.devices ?? []) {
      const areaId = roomAreas.get(device.roomId);
      if (device.entityId && areaId) entityAreas.set(device.entityId, areaId);
    }
  }

  const wss = new WebSocketServer({ noServer: true });
  server.on("upgrade", (request, socket, head) => {
    if (new URL(request.url, "http://mock").pathname !== "/api/websocket") return socket.destroy();
    wss.handleUpgrade(request, socket, head, (ws) => wss.emit("connection", ws));
  });
  wss.on("connection", (socket) => {
    let authed = false;
    log("[mock-ha] ws connected");
    socket.send(JSON.stringify({ type: "auth_required", ha_version: "2025.1.0" }));
    socket.on("close", () => {
      subscribers.delete(socket);
      log("[mock-ha] ws closed");
    });
    // assist_pipeline/run 的 stt 阶段：handler id → { id, bytes, sampleRate, pipeline }
    const sttRuns = new Map();
    socket.on("message", (raw, isBinary) => {
      if (isBinary) {
        const buffer = Buffer.from(raw);
        const run = sttRuns.get(buffer[0]);
        if (!run) return;
        if (buffer.length > 1) return void (run.bytes += buffer.length - 1);
        // 只有 handler id 的帧 = 音频结束
        sttRuns.delete(buffer[0]);
        recordCall("ws", "assist_pipeline", "stt", { bytes: run.bytes, sample_rate: run.sampleRate, pipeline: run.pipeline ?? null });
        const event = (type, data = {}) => socket.send(JSON.stringify({ id: run.id, type: "event", event: { type, data, timestamp: new Date().toISOString() } }));
        if (run.bytes < run.sampleRate * 2 * 0.3) event("error", { code: "stt-no-text-recognized", message: "No text recognized" });
        else {
          event("stt-vad-start", { timestamp: 0 });
          event("stt-vad-end", { timestamp: Math.round((run.bytes / 2 / run.sampleRate) * 1000) });
          event("stt-end", { stt_output: { text: sttText } });
        }
        return event("run-end", null);
      }
      let message;
      try {
        message = JSON.parse(raw.toString());
      } catch {
        return;
      }
      const reply = (result, success = true, error) => socket.send(JSON.stringify({ id: message.id, type: "result", success, result: success ? result : null, ...(error ? { error } : {}) }));
      if (!authed) {
        if (message.type === "auth" && message.access_token === token) {
          authed = true;
          log("[mock-ha] ws auth ok");
          socket.send(JSON.stringify({ type: "auth_ok", ha_version: "2025.1.0" }));
        } else {
          log("[mock-ha] ws auth invalid");
          socket.send(JSON.stringify({ type: "auth_invalid", message: "Invalid access token or password" }));
          socket.close();
        }
        return;
      }
      log(`[mock-ha] ws ${message.type}${message.type === "call_service" ? ` ${message.domain}.${message.service}` : ""}`);
      switch (message.type) {
        case "subscribe_events": {
          if (!subscribers.has(socket)) subscribers.set(socket, new Set());
          subscribers.get(socket).add(message.id);
          return reply(null);
        }
        case "config/area_registry/list":
          return reply(areas);
        case "config/device_registry/list":
          return reply([]);
        case "config/entity_registry/list":
          return reply(entityIds.map((entityId) => ({ entity_id: entityId, device_id: null, area_id: entityAreas.get(entityId) ?? null, platform: "mock" })));
        case "call_service": {
          const target = message.target?.entity_id ?? message.service_data?.entity_id;
          const data = { ...(message.service_data ?? {}), ...(target ? { entity_id: target } : {}) };
          recordCall("ws", message.domain, message.service, data);
          if (message.domain === "weather" && message.service === "get_forecasts" && message.return_response) {
            const response = {};
            for (const entityId of [].concat(target ?? [])) if (states.has(entityId)) response[entityId] = { forecast: forecastFor(states.get(entityId)) };
            return reply({ context: { id: `mock-${Date.now()}` }, response });
          }
          applyService(message.domain, message.service, data);
          return reply({ context: { id: `mock-${Date.now()}` }, response: null });
        }
        case "assist_pipeline/pipeline/list":
          return reply([]);
        case "assist_pipeline/run": {
          if (message.start_stage !== "stt") return reply(null, false, { code: "not_supported", message: "mock 只支持 stt 阶段" });
          const handler = (sttRuns.size % 200) + 1;
          sttRuns.set(handler, { id: message.id, bytes: 0, sampleRate: message.input?.sample_rate ?? 16000, pipeline: message.pipeline });
          reply(null);
          return socket.send(JSON.stringify({ id: message.id, type: "event", event: { type: "run-start", data: { pipeline: message.pipeline ?? "mock-preferred", language: "zh-CN", runner_data: { stt_binary_handler_id: handler, timeout: 300 } } } }));
        }
        case "ping":
          return socket.send(JSON.stringify({ id: message.id, type: "pong" }));
        default:
          return reply(null, false, { code: "unknown_command", message: `Unknown command ${message.type}` });
      }
    });
  });

  return {
    server,
    states,
    calls,
    reset,
    setState,
    listen: (port, host = "127.0.0.1") => new Promise((resolve) => server.listen(port, host, () => resolve(server.address()))),
    close: () =>
      new Promise((resolve) => {
        for (const client of wss.clients) client.terminate();
        wss.close();
        server.close(() => resolve());
      }),
  };
}

function parseArgs(argv) {
  const args = { port: 18123, token: "dev-token", project: undefined };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--port") (args.port = Number(value)), (index += 1);
    else if (key === "--token") (args.token = value), (index += 1);
    else if (key === "--project") (args.project = value), (index += 1);
  }
  return args;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = parseArgs(process.argv.slice(2));
  const defaultProject = fileURLToPath(new URL("../fixtures/demo-project.json", import.meta.url));
  const project = JSON.parse(readFileSync(args.project ?? defaultProject, "utf8"));
  const mock = createMockHa({ project, token: args.token });
  const address = await mock.listen(args.port);
  console.log(`[mock-ha] listening on http://127.0.0.1:${address.port} (${mock.states.size} entities)`);
  const stop = () => void mock.close().then(() => process.exit(0));
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);
}
