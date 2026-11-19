// ha3d-self: F6 宠物（按需加载：只有在 3D 设置里选了小猫或小狗时，AppSelect.js 才会动态导入这个文件）
import { a as M } from "./react.js";
import { j as e, g as te, l as X } from "./three.js";
const ha3dNoRaycast = () => {};
// prefers-reduced-motion（同 AppSelect.js 的 xt）
function xt() {
  const [t, s] = M.useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  return (
    M.useEffect(() => {
      const o = window.matchMedia("(prefers-reduced-motion: reduce)"),
        r = () => s(o.matches);
      return (
        o.addEventListener("change", r),
        () => o.removeEventListener("change", r)
      );
    }, []),
    t
  );
}
// ===== ha3d-self: F6 宠物（小猫 / 小狗）：在房间里随机走动，经门在房间之间移动，避开家具，不可点击 =====
// 坐标是楼层局部坐标（房间多边形 [x, z]）。导航用 0.15 m 栅格：格子在房间多边形内（四周 0.1 m 也在）、
// 离实体墙段（墙去掉门洞）≥ 0.2 m、不在家具旋转矩形（外扩 0.12 m）内才可走。
// 目标点：70% 留在当前房间，否则在按门连通关系 BFS 可达的房间里选；房间内拒绝采样（离墙 ≥ 0.25 m、不在家具内）。
// 路线依次经过门中心，每一段在栅格上 BFS 再拉直。速度按 useFrame 的 delta 计算，限帧时速度不变。
const ha3dPetSpecs = {
  cat: { speed: 0.35, size: 1, legH: 0.11, color: "#e8923e", belly: "#fbe3c4", dark: "#9a521c" },
  // ha3d-self: 0.2.2 小狗改成白色（耳朵略带米白，和头部区分），黑色眼睛和鼻头
  dog: { speed: 0.5, size: 1.42, legH: 0.12, color: "#f7f7f4", belly: "#ffffff", dark: "#e6e0d4", eye: "#111111" },
};
function ha3dInPolygon(t, s, o) {
  let r = !1;
  for (let n = 0, a = o.length - 1; n < o.length; a = n++) {
    const [i, d] = o[n],
      [l, c] = o[a];
    d > s != c > s && t < ((l - i) * (s - d)) / (c - d) + i && (r = !r);
  }
  return r;
}
function ha3dSegDist(t, s, o, r, n, a) {
  const i = n - o,
    d = a - r,
    l = i * i + d * d,
    c = l > 0 ? X.clamp(((t - o) * i + (s - r) * d) / l, 0, 1) : 0;
  return Math.hypot(t - o - c * i, s - r - c * d);
}
const ha3dEdgeDist = (t, s, o) =>
  o.reduce((r, n, a) => {
    const i = o[(a + 1) % o.length];
    return Math.min(r, ha3dSegDist(t, s, n[0], n[1], i[0], i[1]));
  }, 1 / 0);
function ha3dPetNav(t) {
  const s = t.rooms.filter((g) => (g.polygon?.length ?? 0) >= 3).map((g) => g.polygon);
  if (!s.length) return null;
  const o = s.flat(),
    C = 0.15,
    r = Math.min(...o.map((g) => g[0])),
    n = Math.min(...o.map((g) => g[1])),
    a = Math.ceil((Math.max(...o.map((g) => g[0])) - r) / C) + 1,
    i = Math.ceil((Math.max(...o.map((g) => g[1])) - n) / C) + 1,
    d = t.openings.filter((g) => g.type !== "window" && g.width > 0),
    l = [],
    doorAt = (g) => {
      const k = t.walls.find((G) => G.id === g.wallId);
      if (!k) return null;
      const p = k.end[0] - k.start[0],
        q = k.end[1] - k.start[1],
        G = Math.hypot(p, q) || 1;
      return [k.start[0] + (p / G) * g.offset, k.start[1] + (q / G) * g.offset];
    };
  // 实体墙段：墙去掉门洞
  for (const g of t.walls) {
    const k = g.end[0] - g.start[0],
      p = g.end[1] - g.start[1],
      q = Math.hypot(k, p);
    if (q < 1e-6) continue;
    const at = (G) => [g.start[0] + (k / q) * G, g.start[1] + (p / q) * G],
      gaps = d
        .filter((G) => G.wallId === g.id)
        .map((G) => [G.offset - G.width / 2, G.offset + G.width / 2])
        .sort((G, L) => G[0] - L[0]);
    let G = 0;
    for (const [L, I] of gaps) (L > G && l.push([...at(G), ...at(L)]), (G = Math.max(G, I)));
    G < q && l.push([...at(G), ...at(q)]);
  }
  const c = t.furniture.map((g) => ({
      x: g.position[0],
      y: g.position[1],
      c: Math.cos(g.rotation || 0),
      s: Math.sin(g.rotation || 0),
      w: g.width / 2,
      d: g.depth / 2,
    })),
    h = (g, k, p) =>
      c.some((q) => {
        const G = g - q.x,
          L = k - q.y;
        return Math.abs(G * q.c + L * q.s) <= q.w + p && Math.abs(-G * q.s + L * q.c) <= q.d + p;
      }),
    u = (g, k) => l.reduce((p, q) => Math.min(p, ha3dSegDist(g, k, q[0], q[1], q[2], q[3])), 1 / 0),
    f = (g, k) => s.findIndex((p) => ha3dInPolygon(g, k, p)),
    inside = (g, k) => f(g, k) >= 0,
    j = new Int16Array(a * i).fill(-1);
  for (let g = 0; g < i; g += 1)
    for (let k = 0; k < a; k += 1) {
      const p = r + k * C,
        q = n + g * C,
        G = f(p, q);
      G >= 0 &&
        inside(p + 0.1, q) &&
        inside(p - 0.1, q) &&
        inside(p, q + 0.1) &&
        inside(p, q - 0.1) &&
        u(p, q) >= 0.2 &&
        !h(p, q, 0.12) &&
        (j[g * a + k] = G);
    }
  // 门连通：门中心 = 墙起点 + 方向 × offset，到两个房间多边形边的距离都 ≤ 0.35 m
  const v = s.map(() => []);
  for (const g of d) {
    const k = doorAt(g);
    if (!k) continue;
    const p = s.map((q, G) => G).filter((G) => ha3dEdgeDist(k[0], k[1], s[G]) <= 0.35);
    for (const q of p) for (const G of p) q !== G && v[q].push({ to: G, at: k });
  }
  return { rooms: s, cell: C, minX: r, minY: n, cols: a, rows: i, walk: j, links: v, wallDist: u, inFurniture: h, roomAt: f };
}
function ha3dPetCell(t, s, o) {
  const r = Math.round((s - t.minX) / t.cell),
    n = Math.round((o - t.minY) / t.cell);
  return r < 0 || n < 0 || r >= t.cols || n >= t.rows ? -1 : n * t.cols + r;
}
function ha3dPetFree(t, s, o) {
  const r = ha3dPetCell(t, s, o);
  return r >= 0 && t.walk[r] >= 0;
}
function ha3dPetNearest(t, s, o) {
  const r = Math.round((s - t.minX) / t.cell),
    n = Math.round((o - t.minY) / t.cell);
  let a = -1,
    i = 1 / 0;
  for (let d = -3; d <= 3; d += 1)
    for (let l = -3; l <= 3; l += 1) {
      const c = r + l,
        h = n + d;
      if (c < 0 || h < 0 || c >= t.cols || h >= t.rows || t.walk[h * t.cols + c] < 0) continue;
      const u = l * l + d * d;
      u < i && ((i = u), (a = h * t.cols + c));
    }
  return a;
}
const ha3dPetPoint = (t, s) => [t.minX + (s % t.cols) * t.cell, t.minY + Math.floor(s / t.cols) * t.cell];
function ha3dPetSight(t, s, o) {
  const r = Math.max(1, Math.ceil(Math.hypot(o[0] - s[0], o[1] - s[1]) / 0.05));
  for (let n = 1; n < r; n += 1) {
    const a = n / r;
    if (!ha3dPetFree(t, s[0] + (o[0] - s[0]) * a, s[1] + (o[1] - s[1]) * a)) return !1;
  }
  return !0;
}
// 栅格 BFS（8 邻域，不切角）后拉直；返回途经点（不含起点），到不了返回 null
function ha3dPetRoute(t, s, o) {
  const r = ha3dPetNearest(t, s[0], s[1]),
    n = ha3dPetNearest(t, o[0], o[1]);
  if (r < 0 || n < 0) return null;
  const a = new Int32Array(t.walk.length).fill(-1),
    i = [r];
  a[r] = r;
  for (let c = 0; c < i.length && a[n] < 0; c += 1) {
    const h = i[c],
      u = h % t.cols,
      f = (h - u) / t.cols;
    for (const [j, v] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const y = u + j,
        x = f + v,
        b = x * t.cols + y;
      y < 0 ||
        x < 0 ||
        y >= t.cols ||
        x >= t.rows ||
        a[b] >= 0 ||
        t.walk[b] < 0 ||
        (j && v && (t.walk[f * t.cols + y] < 0 || t.walk[x * t.cols + u] < 0)) ||
        ((a[b] = h), i.push(b));
    }
  }
  if (a[n] < 0) return null;
  const d = [];
  for (let c = n; c !== r; c = a[c]) d.push(ha3dPetPoint(t, c));
  (d.push(ha3dPetPoint(t, r)), d.reverse());
  ha3dPetFree(t, o[0], o[1]) && (d[d.length - 1] = [o[0], o[1]]);
  const l = [];
  let c = ha3dPetFree(t, s[0], s[1]) ? s : d[0],
    h = 0;
  for (c !== s && l.push(c); h < d.length - 1; ) {
    let u = d.length - 1;
    for (; u > h + 1 && !ha3dPetSight(t, c, d[u]); ) u -= 1;
    (l.push(d[u]), (c = d[u]), (h = u));
  }
  return l;
}
function ha3dPetSample(t, s, o) {
  const r = t.rooms[s],
    n = r.map((l) => l[0]),
    a = r.map((l) => l[1]),
    [i, d] = [Math.min(...n), Math.min(...a)];
  for (let l = 0; l < 40; l += 1) {
    const c = i + Math.random() * (Math.max(...n) - i),
      h = d + Math.random() * (Math.max(...a) - d);
    if (
      ha3dInPolygon(c, h, r) &&
      ha3dEdgeDist(c, h, r) >= 0.25 &&
      t.wallDist(c, h) >= 0.25 &&
      !t.inFurniture(c, h, 0.12) &&
      ha3dPetFree(t, c, h) &&
      (!o || Math.hypot(c - o[0], h - o[1]) > 0.6)
    )
      return [c, h];
  }
  return null;
}
// 从当前房间按门 BFS：可达房间列表 + 每个房间的来路（上一个房间和经过的门中心）
function ha3dPetReach(t, s) {
  const o = new Map([[s, null]]),
    r = [s];
  for (let n = 0; n < r.length; n += 1)
    for (const a of t.links[r[n]] ?? []) o.has(a.to) || (o.set(a.to, { from: r[n], at: a.at }), r.push(a.to));
  return { rooms: r, via: o };
}
// 从 s.pos（房间 s.room）走到房间 o 里的点 r：依次经过门中心，每一段栅格寻路；到不了返回 null
function ha3dPetPathTo(t, s, o, r, n = ha3dPetReach(t, s.room)) {
  if (!n.via.has(o)) return null;
  const a = [];
  for (let d = o; d !== s.room; d = n.via.get(d).from) a.push(n.via.get(d).at);
  const i = [s.pos, ...a.reverse(), r];
  let l = [];
  for (let d = 0; d + 1 < i.length && l; d += 1) {
    const c = ha3dPetRoute(t, d ? l[l.length - 1] ?? i[d] : i[d], i[d + 1]);
    l = c ? l.concat(c) : null;
  }
  return l && l.length ? l : null;
}
function ha3dPetPlan(t, s) {
  const o = ha3dPetReach(t, s.room);
  for (let r = 0; r < 4; r += 1) {
    // 70% 留在当前房间，否则去一个可达的其他房间
    const n = Math.random() < 0.7 || o.rooms.length < 2 ? s.room : o.rooms[1 + Math.floor(Math.random() * (o.rooms.length - 1))],
      a = ha3dPetSample(t, n, s.pos),
      i = a && ha3dPetPathTo(t, s, n, a, o);
    if (i) return { path: i, room: n };
  }
  return null;
}
function ha3dPetMesh(t, s, o, r, n = [0, 0, 0], ha3dGloss = !1) {
  return e.jsxs("mesh", {
    raycast: ha3dNoRaycast,
    position: t,
    scale: s,
    rotation: n,
    // 轻微自发光：玻璃风格的冷色光照下也能看清毛色；眼睛不发光、略带光泽
    children: [
      o,
      ha3dGloss
        ? e.jsx("meshStandardMaterial", { color: r, roughness: 0.25, metalness: 0 })
        : e.jsx("meshStandardMaterial", { color: r, roughness: 0.78, emissive: r, emissiveIntensity: 0.22 }),
    ],
  });
}
function ha3dPet({ floor: t, kind: s }) {
  const o = ha3dPetSpecs[s] ?? ha3dPetSpecs.cat,
    r = M.useRef(null),
    n = M.useRef(null),
    a = M.useRef([]),
    i = xt(),
    d = M.useMemo(() => ha3dPetNav(t), [t.rooms, t.walls, t.openings, t.furniture]),
    l = M.useMemo(() => {
      if (!d) return null;
      const g = d.rooms
        .map((p, q) => q)
        .sort((p, q) => d.walk.filter((G) => G === q).length - d.walk.filter((G) => G === p).length);
      for (const p of g) {
        const q = ha3dPetSample(d, p);
        if (q) return { room: p, pos: q, heading: Math.random() * Math.PI * 2, path: [], next: p, wait: 1 + Math.random() * 2, phase: 0, sit: 1 };
      }
      return null;
    }, [d]),
    c = o.size,
    h = o.legH * c,
    u = (g) => e.jsx("sphereGeometry", { args: [1, g, Math.max(6, g - 4)] }),
    f = (g) => e.jsx("boxGeometry", { args: g });
  if (
    (te((g, k) => {
      const p = r.current;
      if (!p || !l || !d) return;
      const q = Math.min(k, 0.1);
      if (!i)
        if (l.path.length) {
          const [L, I] = l.path[0],
            $ = L - l.pos[0],
            m = I - l.pos[1],
            C = Math.hypot($, m),
            O = o.speed * q;
          if (
            (C <= O
              ? ((l.pos = [L, I]),
                l.path.shift(),
                l.path.length || ((l.wait = 2 + Math.random() * 4), (l.room = l.next)))
              : (l.pos = [l.pos[0] + ($ / C) * O, l.pos[1] + (m / C) * O]),
            C > 1e-3)
          ) {
            const _ = Math.atan2($, m) - l.heading;
            l.heading += Math.atan2(Math.sin(_), Math.cos(_)) * Math.min(1, q * 7);
          }
          ((l.phase += q * o.speed * 26), (l.sit = Math.max(0, l.sit - q * 4)));
        } else if (((l.sit = Math.min(1, l.sit + q * 3)), (l.wait -= q), l.wait <= 0)) {
          const L = ha3dPetPlan(d, l);
          L ? ((l.path = L.path), (l.next = L.room)) : (l.wait = 1.5);
        }
      (p.position.set(l.pos[0], 0.02, l.pos[1]), (p.rotation.y = l.heading));
      const G = Math.sin(l.phase) * 0.6 * (1 - l.sit);
      // 对角两条腿同相摆动；坐下时后腿向前折、前腿随抬起的上身伸长
      (a.current.forEach((L, I) => {
        L &&
          (I >= 2
            ? (L.rotation.x = (I === 2 ? -G : G) - 1.1 * l.sit)
            : ((L.rotation.x = I === 0 ? G : -G),
              (L.position.y = h + 0.07 * c * l.sit),
              (L.scale.y = 1 + (0.07 * c * l.sit) / h)));
      }),
        n.current && ((n.current.rotation.x = -0.42 * l.sit), (n.current.position.y = h - 0.04 * c * l.sit)));
    }),
    !l)
  )
    return null;
  const j = s === "dog",
    v = [
      [0.045 * c, 0.09 * c],
      [-0.045 * c, 0.09 * c],
      [0.045 * c, -0.08 * c],
      [-0.045 * c, -0.08 * c],
    ];
  return e.jsxs("group", {
    ref: r,
    name: "ha3d-pet",
    userData: { petKind: s, floorId: t.id },
    position: [l.pos[0], 0.02, l.pos[1]],
    rotation: [0, l.heading, 0],
    children: [
      v.map(([g, k], p) =>
        e.jsx(
          "group",
          {
            ref: (q) => (a.current[p] = q),
            position: [g, p >= 2 ? h : h + 0.07 * c, k],
            rotation: [p >= 2 ? -1.1 : 0, 0, 0],
            scale: [1, p >= 2 ? 1 : 1 + (0.07 * c) / h, 1],
            children: ha3dPetMesh([0, -h / 2, 0], [1, 1, 1], f([0.032 * c, h, 0.034 * c]), o.color),
          },
          p,
        ),
      ),
      e.jsxs("group", {
        ref: n,
        position: [0, h - 0.04 * c, -0.08 * c],
        rotation: [-0.42, 0, 0],
        children: [
          ha3dPetMesh([0, 0.07 * c, 0.08 * c], [0.085 * c, 0.078 * c, 0.165 * c], u(14), o.color),
          ha3dPetMesh([0, 0.045 * c, 0.09 * c], [0.06 * c, 0.05 * c, 0.12 * c], u(10), o.belly),
          ha3dPetMesh([0, 0.135 * c, 0.27 * c], [0.068 * c, 0.064 * c, 0.068 * c], u(14), o.color),
          j
            ? ha3dPetMesh([0, 0.115 * c, 0.33 * c], [1, 1, 1], f([0.055 * c, 0.045 * c, 0.07 * c]), o.belly)
            : ha3dPetMesh([0, 0.13 * c, 0.335 * c], [0.012, 0.01, 0.01], u(6), o.dark),
          // ha3d-self: 0.2.2 小狗的黑眼睛（头部前上方两侧）和黑鼻头（口鼻前端）
          ...(j
            ? [
                ...[-1, 1].map((g) =>
                  ha3dPetMesh([g * 0.03 * c, 0.155 * c, 0.322 * c], [0.0115 * c, 0.0115 * c, 0.0115 * c], u(10), o.eye, [0, 0, 0], !0),
                ),
                ha3dPetMesh([0, 0.13 * c, 0.367 * c], [0.013 * c, 0.011 * c, 0.009 * c], u(10), o.eye, [0, 0, 0], !0),
              ]
            : []),
          ...[-1, 1].map((g) =>
            j
              ? ha3dPetMesh([g * 0.066 * c, 0.115 * c, 0.26 * c], [1, 1, 1], f([0.022 * c, 0.085 * c, 0.05 * c]), o.dark, [0, 0, g * 0.22])
              : ha3dPetMesh(
                  [g * 0.034 * c, 0.195 * c, 0.27 * c],
                  [1, 1, 1],
                  e.jsx("coneGeometry", { args: [0.025, 0.055, 3] }),
                  o.color,
                  [0, 0, -g * 0.25],
                ),
          ),
          e.jsx("group", {
            position: [0, 0.085 * c, -0.07 * c],
            rotation: [j ? -0.5 : -0.55, 0, 0], // 尾巴上翘：猫约 58°、狗约 61°（离水平）
            children: ha3dPetMesh(
              [0, (j ? 0.07 : 0.11) * c, 0],
              [1, 1, 1],
              e.jsx("cylinderGeometry", { args: [0.012 * c, 0.016 * c, (j ? 0.14 : 0.22) * c, 6] }),
              j ? o.color : o.dark,
            ),
          }),
        ],
      }),
    ],
  });
}
// 导航函数一并导出，供 e2e（pets 套件）验证跨房间路线
export { ha3dPet as Ha3dPet, ha3dPetNav, ha3dPetPathTo, ha3dPetReach, ha3dPetSample };

