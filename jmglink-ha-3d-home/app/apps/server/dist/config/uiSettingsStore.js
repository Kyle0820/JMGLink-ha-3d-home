// ===== ha3d-self: 0.2.2 首页设置跨设备同步 =====
// 首页的显示设置（风格、天气预报、顶部概览数据、点击设备模式、时间与天气同步、天气实体、宠物）保存在 <dataDir>/ui-settings.json，
// 格式 { "version": 1, "values": { "<localStorage 键>": "<字符串值>" }, "updatedAt": "..." }。
// 前端决定哪些键同步（画质、语音等和设备有关的设置不发过来）；这里只校验键名格式和大小。
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
export const UI_SETTING_KEY_PATTERN = /^ha3d\.home\.[A-Za-z0-9_.:-]{1,160}$/;
export const UI_SETTING_MAX_VALUE_LENGTH = 32 * 1024;
export const UI_SETTING_MAX_KEYS = 200;
export class UiSettingsStore {
    filePath;
    values = {};
    updatedAt;
    queue = Promise.resolve();
    constructor(filePath) {
        this.filePath = filePath;
    }
    static async create(dataDir) {
        const directory = path.resolve(dataDir);
        await mkdir(directory, { recursive: true });
        const store = new UiSettingsStore(path.join(directory, "ui-settings.json"));
        await store.load();
        return store;
    }
    async load() {
        try {
            const value = JSON.parse(await readFile(this.filePath, "utf8"));
            const values = value && typeof value === "object" && value.values && typeof value.values === "object" ? value.values : {};
            this.values = Object.fromEntries(Object.entries(values).filter(([key, item]) => UI_SETTING_KEY_PATTERN.test(key) && typeof item === "string"));
            this.updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : undefined;
        }
        catch {
            this.values = {};
        }
    }
    snapshot() {
        return { values: { ...this.values }, updatedAt: this.updatedAt ?? null };
    }
    /** 校验 PUT 的 values：键名格式、值为字符串（null 表示删除）、长度上限。返回错误信息或 undefined。 */
    static validate(values) {
        if (!values || typeof values !== "object" || Array.isArray(values))
            return "values must be an object";
        const entries = Object.entries(values);
        if (entries.length > UI_SETTING_MAX_KEYS)
            return `at most ${UI_SETTING_MAX_KEYS} keys`;
        for (const [key, value] of entries) {
            if (!UI_SETTING_KEY_PATTERN.test(key))
                return `invalid key: ${key.slice(0, 80)}`;
            if (value !== null && typeof value !== "string")
                return `value of ${key} must be a string or null`;
            if (typeof value === "string" && value.length > UI_SETTING_MAX_VALUE_LENGTH)
                return `value of ${key} is too long`;
        }
        return undefined;
    }
    /** 合并写入（null 删除），返回真正变化了的键和值；没有变化时不写文件。 */
    update(values) {
        const run = this.queue.then(async () => {
            const changed = {};
            const next = { ...this.values };
            for (const [key, value] of Object.entries(values)) {
                if (value === null) {
                    if (key in next) {
                        delete next[key];
                        changed[key] = null;
                    }
                }
                else if (next[key] !== value) {
                    next[key] = value;
                    changed[key] = value;
                }
            }
            if (Object.keys(next).length > UI_SETTING_MAX_KEYS)
                throw Object.assign(new Error(`at most ${UI_SETTING_MAX_KEYS} keys`), { statusCode: 400 });
            if (Object.keys(changed).length) {
                const updatedAt = new Date().toISOString();
                await this.writeJsonAtomically({ version: 1, values: next, updatedAt });
                this.values = next;
                this.updatedAt = updatedAt;
            }
            return changed;
        });
        this.queue = run.catch(() => undefined);
        return run;
    }
    async writeJsonAtomically(value) {
        const temporaryPath = `${this.filePath}.tmp`;
        await writeFile(temporaryPath, JSON.stringify(value, null, 2), "utf8");
        await rename(temporaryPath, this.filePath);
    }
}
export async function registerUiSettingsRoutes(app, store, gateway) {
    app.get("/api/ui-settings", async () => store.snapshot());
    app.put("/api/ui-settings", async (request, reply) => {
        const values = request.body?.values;
        const error = UiSettingsStore.validate(values);
        if (error)
            return reply.code(400).send({ error });
        const changed = await store.update(values);
        const snapshot = store.snapshot();
        if (Object.keys(changed).length)
            gateway?.broadcast({ type: "ui.settings_updated", payload: { values: changed, updatedAt: snapshot.updatedAt } });
        return { ...snapshot, changed: Object.keys(changed) };
    });
}
