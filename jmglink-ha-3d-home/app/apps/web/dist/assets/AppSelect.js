import { u as De, c as H, R as Mt, p as as, f as cr } from "./index.js";
import { a as M } from "./react.js";
import {
    d as B,
    N as Ee,
    V as J,
    x as Mr,
    i as Ne,
    A as Q,
    C as Te,
    l as X,
    h as Y,
    e as Ze,
    _ as _r,
    L as _t,
    M as at,
    u as be,
    p as br,
    B as cs,
    q as ds,
    j as e, // ha3d-self: B6 改名，ee 改为下面按画质决定是否描边的包装
    b as fr,
    H as ge,
    k as gr,
    E as ha3dDreiEdges,
    D as hr,
    S as is,
    o as jr,
    r as lr,
    f as ls,
    m as mr,
    F as nt,
    P as pr,
    g as te,
    R as ur,
    w as vr,
    v as wr,
    n as xr,
    O as yr,
    s as yt,
    t as zt
} from "./three.js";
// ===== ha3d-self: B6 eco 画质不画 drei Edges 描边（每个描边都是一次额外的 draw call） =====
// t0 在 Canvas 里用 ha3dQualityContext.Provider 传入当前画质；不在场景里时默认照常描边。
const ha3dQualityContext = M.createContext("high");
function ee(t) {
  return M.useContext(ha3dQualityContext) === "eco"
    ? null
    : e.jsx(ha3dDreiEdges, t);
}
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 *
 * ha3d-self: B6 本文件里每个 lucide 图标前都有这同一份许可声明，合并为这一处
 */ const kr = [
    [
      "path",
      {
        d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
        key: "169zse",
      },
    ],
  ],
  Kt = H("activity", kr);
const Sr = [
    ["path", { d: "M12 8V4H8", key: "hb8ula" }],
    [
      "rect",
      { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" },
    ],
    ["path", { d: "M2 14h2", key: "vft8re" }],
    ["path", { d: "M20 14h2", key: "4cs60a" }],
    ["path", { d: "M15 13v2", key: "1xurst" }],
    ["path", { d: "M9 13v2", key: "rq6x2g" }],
  ],
  Cr = H("bot", Sr);
const Pr = [
    [
      "path",
      {
        d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
        key: "hh9hay",
      },
    ],
    ["path", { d: "m3.3 7 8.7 5 8.7-5", key: "g66t2b" }],
    ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ],
  Li = H("box", Pr);
const zr = [
    [
      "path",
      {
        d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
        key: "18u6gg",
      },
    ],
    ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }],
  ],
  Er = H("camera", zr);
const Gr = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]],
  Lr = H("check", Gr);
const $r = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
  Tr = H("chevron-down", $r);
const Ir = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
  ],
  Nr = H("circle-question-mark", Ir);
const Or = [
    [
      "path",
      {
        d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
        key: "1ptgy4",
      },
    ],
    [
      "path",
      {
        d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
        key: "1sl1rz",
      },
    ],
  ],
  hs = H("droplets", Or);
const Rr = [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        key: "ct8e1f",
      },
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        key: "13bj9a",
      },
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ],
  $i = H("eye-off", Rr);
const Fr = [
    [
      "path",
      {
        d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        key: "1nclc0",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
  Ti = H("eye", Fr);
const Ar = [
    ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
    ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }],
  ],
  Br = H("gauge", Ar);
const Hr = [
    [
      "path",
      { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" },
    ],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "r6nss1",
      },
    ],
  ],
  Ii = H("house", Hr);
const Dr = [
    [
      "path",
      {
        d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
        key: "zw3jo",
      },
    ],
    [
      "path",
      {
        d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
        key: "1wduqc",
      },
    ],
    [
      "path",
      {
        d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
        key: "kqbvx6",
      },
    ],
  ],
  Ni = H("layers", Dr);
const Wr = [
    [
      "path",
      {
        d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
        key: "nnexq3",
      },
    ],
    [
      "path",
      { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12", key: "mt58a7" },
    ],
  ],
  us = H("leaf", Wr);
const Vr = [
    [
      "path",
      { d: "M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5", key: "1fkcox" },
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
    [
      "path",
      {
        d: "M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5",
        key: "10m8kw",
      },
    ],
    ["path", { d: "M9 18h6", key: "x1upvd" }],
    ["path", { d: "M10 22h4", key: "ceow96" }],
  ],
  Ur = H("lightbulb-off", Vr);
const Kr = [
    [
      "path",
      {
        d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
        key: "1gvzjb",
      },
    ],
    ["path", { d: "M9 18h6", key: "x1upvd" }],
    ["path", { d: "M10 22h4", key: "ceow96" }],
  ],
  fs = H("lightbulb", Kr);
const qr = [
    ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
    ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
    ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }],
  ],
  Oi = H("link-2", qr);
const Xr = [
    [
      "rect",
      {
        width: "18",
        height: "11",
        x: "3",
        y: "11",
        rx: "2",
        ry: "2",
        key: "1w4ew1",
      },
    ],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }],
  ],
  Zr = H("lock", Xr);
const Yr = [
    [
      "path",
      {
        d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
        key: "e79jfc",
      },
    ],
    [
      "circle",
      { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" },
    ],
    [
      "circle",
      { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" },
    ],
    [
      "circle",
      { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" },
    ],
    [
      "circle",
      { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" },
    ],
  ],
  Qr = H("palette", Yr);
const Jr = [
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
    ],
    ["path", { d: "M3 9h18", key: "1pudct" }],
    ["path", { d: "m9 16 3-3 3 3", key: "1idcnm" }],
  ],
  eo = H("panel-top-close", Jr);
const to = [
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
    ],
    ["path", { d: "M3 9h18", key: "1pudct" }],
    ["path", { d: "m15 14-3 3-3-3", key: "g215vf" }],
  ],
  so = H("panel-top-open", to);
const ro = [
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
    ],
    ["path", { d: "M3 9h18", key: "1pudct" }],
  ],
  oo = H("panel-top", ro);
const no = [
    [
      "rect",
      { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
    ],
    ["path", { d: "M3 9h18", key: "1pudct" }],
    ["path", { d: "M9 21V9", key: "1oto5p" }],
  ],
  ao = H("panels-top-left", no);
const io = [
    [
      "rect",
      { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" },
    ],
    [
      "rect",
      { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" },
    ],
  ],
  co = H("pause", io);
const lo = [
    [
      "path",
      {
        d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
        key: "10ikf1",
      },
    ],
  ],
  ho = H("play", lo);
const uo = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }],
  ],
  Ri = H("plus", uo);
const fo = [
    ["path", { d: "M18.36 6.64A9 9 0 0 1 20.77 15", key: "dxknvb" }],
    ["path", { d: "M6.16 6.16a9 9 0 1 0 12.68 12.68", key: "1x7qb5" }],
    ["path", { d: "M12 2v4", key: "3427ic" }],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ],
  po = H("power-off", fo);
const go = [
    ["path", { d: "M12 2v10", key: "mnfbl" }],
    ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }],
  ],
  mo = H("power", go);
const xo = [
    ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478", key: "1fwjs5" }],
    ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134", key: "ehdyv1" }],
    ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134", key: "1q22gi" }],
    ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478", key: "r2q7qm" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ],
  jo = H("radio", xo);
const yo = [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        key: "1c8476",
      },
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }],
  ],
  Fi = H("save", yo);
const bo = [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ],
  Ai = H("search", bo);
const wo = [
    ["path", { d: "M14 17H5", key: "gfn3mx" }],
    ["path", { d: "M19 7h-9", key: "6i9tg" }],
    ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
    ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }],
  ],
  Bi = H("settings-2", wo);
const vo = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
  ],
  ps = H("shield", vo);
const Mo = [
    ["path", { d: "M10 5H3", key: "1qgfaw" }],
    ["path", { d: "M12 19H3", key: "yhmn1j" }],
    ["path", { d: "M14 3v4", key: "1sua03" }],
    ["path", { d: "M16 17v4", key: "1q0r14" }],
    ["path", { d: "M21 12h-9", key: "1o4lsq" }],
    ["path", { d: "M21 19h-5", key: "1rlt1p" }],
    ["path", { d: "M21 5h-7", key: "1oszz2" }],
    ["path", { d: "M8 10v4", key: "tgpxqk" }],
    ["path", { d: "M8 12H3", key: "a7s4jb" }],
  ],
  gs = H("sliders-horizontal", Mo);
const _o = [
    ["path", { d: "m10 20-1.25-2.5L6 18", key: "18frcb" }],
    ["path", { d: "M10 4 8.75 6.5 6 6", key: "7mghy3" }],
    ["path", { d: "m14 20 1.25-2.5L18 18", key: "1chtki" }],
    ["path", { d: "m14 4 1.25 2.5L18 6", key: "1b4wsy" }],
    ["path", { d: "m17 21-3-6h-4", key: "15hhxa" }],
    ["path", { d: "m17 3-3 6 1.5 3", key: "11697g" }],
    ["path", { d: "M2 12h6.5L10 9", key: "kv9z4n" }],
    ["path", { d: "m20 10-1.5 2 1.5 2", key: "1swlpi" }],
    ["path", { d: "M22 12h-6.5L14 15", key: "1mxi28" }],
    ["path", { d: "m4 10 1.5 2L4 14", key: "k9enpj" }],
    ["path", { d: "m7 21 3-6-1.5-3", key: "j8hb9u" }],
    ["path", { d: "m7 3 3 6h4", key: "1otusx" }],
  ],
  ko = H("snowflake", _o);
const So = [
    [
      "path",
      {
        d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
        key: "1s2grr",
      },
    ],
    ["path", { d: "M20 2v4", key: "1rf3ol" }],
    ["path", { d: "M22 4h-4", key: "gwowj6" }],
    ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }],
  ],
  Co = H("sparkles", So);
const Po = [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
  ],
  Et = H("sun", Po);
const zo = [
    [
      "path",
      { d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z", key: "17jzev" },
    ],
  ],
  We = H("thermometer", zo);
const Eo = [
    ["circle", { cx: "9", cy: "12", r: "3", key: "u3jwor" }],
    [
      "rect",
      { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" },
    ],
  ],
  Go = H("toggle-left", Eo);
const Lo = [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }],
  ],
  Hi = H("trash-2", Lo);
const $o = [
    ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
    ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }],
  ],
  To = H("user-round", $o);
const Io = [
    [
      "path",
      {
        d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
        key: "ftymec",
      },
    ],
    [
      "rect",
      { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" },
    ],
  ],
  No = H("video", Io);
const Oo = [
    ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
    ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
    ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }],
  ],
  lt = H("wind", Oo);
var Ro = lr();
function Fo(t, s, o = !0) {
  const r = M.useRef({}),
    n = M.useMemo(
      () =>
        o
          ? [...new Set(s)].sort().join(`
`)
          : "",
      [o, s],
    );
  return M.useMemo(() => {
    if (!o || !n)
      return (Object.keys(r.current).length && (r.current = {}), r.current);
    const a = {};
    for (const l of n.split(`
`)) {
      const c = t[l];
      c && (a[l] = c);
    }
    const i = r.current,
      d = Object.keys(a);
    return Object.keys(i).length === d.length && d.every((l) => i[l] === a[l])
      ? i
      : ((r.current = a), a);
  }, [o, t, n]);
}
const ms = [
    {
      id: "light.ceiling",
      kind: "light",
      label: "通用吸顶灯",
      description: "贴顶矩形灯具，适合主灯或平板灯",
      placement: "ceiling",
      defaultHeight: 1.62,
    },
    {
      id: "light.ceiling_panel",
      kind: "light",
      label: "平板吸顶灯",
      description: "超薄矩形面板灯，适合客厅、厨房和办公区",
      placement: "ceiling",
      defaultHeight: 1.62,
    },
    {
      id: "light.ceiling_round",
      kind: "light",
      label: "圆形吸顶灯",
      description: "圆盘吸顶灯，适合卧室、走廊和玄关",
      placement: "ceiling",
      defaultHeight: 1.62,
    },
    {
      id: "light.downlight",
      kind: "light",
      label: "筒灯/射灯",
      description: "嵌入式小光源，适合多点布光",
      placement: "ceiling",
      defaultHeight: 1.66,
    },
    {
      id: "light.wall_sconce",
      kind: "light",
      label: "壁灯",
      description: "墙面装饰灯或床头壁灯",
      placement: "wall",
      defaultHeight: 1.32,
    },
    {
      id: "light.chandelier",
      kind: "light",
      label: "吊灯",
      description: "下垂灯体，适合餐厅与客厅焦点",
      placement: "ceiling",
      defaultHeight: 1.48,
    },
    {
      id: "light.floor_lamp",
      kind: "light",
      label: "落地灯",
      description: "从地面升起的氛围灯",
      placement: "floor",
      defaultHeight: 0,
    },
    {
      id: "light.strip",
      kind: "light",
      label: "灯带",
      description: "线性光带，适合柜体和边缘氛围",
      placement: "ceiling",
      defaultHeight: 1.44,
    },
    {
      id: "switch.wall",
      kind: "switch",
      label: "单键开关",
      description: "经典墙壁开关面板",
      placement: "wall",
      defaultHeight: 0.92,
    },
    {
      id: "switch.double",
      kind: "switch",
      label: "双键开关",
      description: "双路墙壁控制面板",
      placement: "wall",
      defaultHeight: 0.92,
    },
    {
      id: "switch.triple",
      kind: "switch",
      label: "三键开关",
      description: "三路墙壁控制面板",
      placement: "wall",
      defaultHeight: 0.92,
    },
    {
      id: "switch.scene",
      kind: "switch",
      label: "场景按钮",
      description: "无线/场景控制按钮",
      placement: "wall",
      defaultHeight: 0.88,
    },
    {
      id: "switch.ac_airflow",
      kind: "switch",
      label: "空调开关",
      description: "空调电源/扫风联动，带气流效果",
      placement: "wall",
      defaultHeight: 0.94,
    },
    {
      id: "switch.outlet",
      kind: "switch",
      label: "智能插座",
      description: "低位插座或电源模块",
      placement: "wall",
      defaultHeight: 0.28,
    },
    // ha3d-self: F7 电脑样式开关
    {
      id: "switch.computer",
      kind: "switch",
      label: "电脑",
      description: "台式电脑/显示器，开机时屏幕亮起",
      placement: "surface",
      defaultHeight: 0.75,
    },
    {
      id: "switch.light.ceiling",
      kind: "switch",
      label: "通用吸顶灯",
      description: "智能开关控制的吸顶灯或平板灯，复用灯具造型",
      placement: "ceiling",
      defaultHeight: 1.62,
    },
    {
      id: "switch.light.ceiling_panel",
      kind: "switch",
      label: "平板吸顶灯",
      description: "智能开关控制的平板吸顶灯，复用灯具造型",
      placement: "ceiling",
      defaultHeight: 1.62,
    },
    {
      id: "switch.light.ceiling_round",
      kind: "switch",
      label: "圆形吸顶灯",
      description: "智能开关控制的圆形吸顶灯，复用灯具造型",
      placement: "ceiling",
      defaultHeight: 1.62,
    },
    {
      id: "switch.light.downlight",
      kind: "switch",
      label: "筒灯/射灯",
      description: "智能开关控制的筒灯或射灯，复用灯具造型",
      placement: "ceiling",
      defaultHeight: 1.66,
    },
    {
      id: "switch.light.wall_sconce",
      kind: "switch",
      label: "壁灯",
      description: "智能开关控制的壁灯，复用灯具造型",
      placement: "wall",
      defaultHeight: 1.32,
    },
    {
      id: "switch.light.chandelier",
      kind: "switch",
      label: "吊灯",
      description: "智能开关控制的吊灯，复用灯具造型",
      placement: "ceiling",
      defaultHeight: 1.48,
    },
    {
      id: "switch.light.floor_lamp",
      kind: "switch",
      label: "落地灯",
      description: "智能开关控制的落地灯，复用灯具造型",
      placement: "floor",
      defaultHeight: 0,
    },
    {
      id: "switch.light.strip",
      kind: "switch",
      label: "灯带",
      description: "智能开关控制的灯带，复用灯具造型",
      placement: "ceiling",
      defaultHeight: 1.44,
    },
    {
      id: "cover.curtain",
      kind: "cover",
      label: "窗帘",
      description: "轨道与左右帘布",
      placement: "wall",
      defaultHeight: 1.12,
    },
    {
      id: "cover.blind",
      kind: "cover",
      label: "百叶/卷帘",
      description: "水平叶片或卷帘结构",
      placement: "wall",
      defaultHeight: 1.12,
    },
    // ha3d-self: F8 晾衣架样式窗帘
    {
      id: "cover.clothes_rack",
      kind: "cover",
      label: "晾衣架",
      description: "吊顶升降晾衣架，按开合度升降",
      placement: "ceiling",
      defaultHeight: 1.62,
    },
    {
      id: "climate.wall_ac",
      kind: "climate",
      label: "壁挂空调",
      description: "墙面空调室内机",
      placement: "wall",
      defaultHeight: 1.32,
    },
    {
      id: "climate.central_ac",
      kind: "climate",
      label: "中央空调/风管机",
      description: "吊顶风管机，侧向出风口造型",
      placement: "ceiling",
      defaultHeight: 1.58,
    },
    {
      id: "climate.floor_ac",
      kind: "climate",
      label: "柜式空调",
      description: "落地塔式空调机",
      placement: "floor",
      defaultHeight: 0,
    },
    {
      id: "climate.thermostat",
      kind: "climate",
      label: "温控面板",
      description: "墙面温控器/地暖控制",
      placement: "wall",
      defaultHeight: 0.96,
    },
    {
      id: "sensor.wall",
      kind: "sensor",
      label: "通用传感器",
      description: "小型圆形墙面传感器",
      placement: "wall",
      defaultHeight: 1,
    },
    {
      id: "sensor.temperature",
      kind: "sensor",
      label: "温度传感器",
      description: "温湿度屏显或探头",
      placement: "wall",
      defaultHeight: 0.98,
    },
    {
      id: "sensor.humidity",
      kind: "sensor",
      label: "湿度传感器",
      description: "湿度/水汽监测点",
      placement: "wall",
      defaultHeight: 0.98,
    },
    {
      id: "sensor.light_level",
      kind: "sensor",
      label: "照度传感器",
      description: "环境光照/亮度监测",
      placement: "ceiling",
      defaultHeight: 1.45,
    },
    {
      id: "sensor.co2",
      kind: "sensor",
      label: "CO₂ 传感器",
      description: "二氧化碳/空气闷热度监测",
      placement: "wall",
      defaultHeight: 0.98,
    },
    {
      id: "sensor.pm25",
      kind: "sensor",
      label: "PM2.5 传感器",
      description: "颗粒物/空气净化联动",
      placement: "wall",
      defaultHeight: 0.98,
    },
    {
      id: "sensor.air_quality",
      kind: "sensor",
      label: "空气质量",
      description: "CO₂ / PM2.5 / 空气盒子",
      placement: "wall",
      defaultHeight: 0.96,
    },
    {
      id: "sensor.power",
      kind: "sensor",
      label: "电量仪表",
      description: "能耗/功率计量模块",
      placement: "wall",
      defaultHeight: 0.9,
    },
    {
      id: "binary_sensor.wall",
      kind: "binary_sensor",
      label: "安防传感器",
      description: "通用安全状态点",
      placement: "wall",
      defaultHeight: 1,
    },
    {
      id: "binary_sensor.door",
      kind: "binary_sensor",
      label: "门窗传感器",
      description: "门磁/窗磁双模块",
      placement: "wall",
      defaultHeight: 1,
    },
    {
      id: "binary_sensor.motion",
      kind: "binary_sensor",
      label: "人体传感器",
      description: "PIR / 存在探测器",
      placement: "ceiling",
      defaultHeight: 1.5,
    },
    {
      id: "binary_sensor.presence",
      kind: "binary_sensor",
      label: "存在传感器",
      description: "毫米波/人体存在雷达",
      placement: "ceiling",
      defaultHeight: 1.48,
    },
    {
      id: "binary_sensor.smoke",
      kind: "binary_sensor",
      label: "烟雾燃气",
      description: "吊顶报警探测器",
      placement: "ceiling",
      defaultHeight: 1.55,
    },
    {
      id: "binary_sensor.water",
      kind: "binary_sensor",
      label: "水浸传感器",
      description: "靠近地面的漏水探测",
      placement: "floor",
      defaultHeight: 0.04,
    },
    {
      id: "camera.wall",
      kind: "camera",
      label: "摄像头",
      description: "墙面/角落摄像头",
      placement: "wall",
      defaultHeight: 1.25,
    },
    {
      id: "camera.dome",
      kind: "camera",
      label: "云台球机",
      description: "半球/云台摄像头",
      placement: "ceiling",
      defaultHeight: 1.5,
    },
    {
      id: "camera.bullet",
      kind: "camera",
      label: "枪机摄像头",
      description: "室外/走廊定向监控摄像头",
      placement: "wall",
      defaultHeight: 1.35,
    },
    {
      id: "camera.doorbell",
      kind: "camera",
      label: "可视门铃",
      description: "门口可视门铃/对讲摄像头",
      placement: "wall",
      defaultHeight: 1.08,
    },
    {
      id: "lock.door",
      kind: "lock",
      label: "智能门锁",
      description: "入户门锁/电子锁状态点",
      placement: "wall",
      defaultHeight: 0.96,
    },
    {
      id: "fan.ceiling",
      kind: "fan",
      label: "风扇",
      description: "吊顶风扇",
      placement: "ceiling",
      defaultHeight: 1.5,
    },
    {
      id: "fan.floor",
      kind: "fan",
      label: "落地扇",
      description: "循环扇/落地风扇",
      placement: "floor",
      defaultHeight: 0,
    },
    {
      id: "fan.tower",
      kind: "fan",
      label: "塔扇",
      description: "细长立式塔扇",
      placement: "floor",
      defaultHeight: 0,
    },
    {
      id: "media_player.tv",
      kind: "media_player",
      label: "电视",
      description: "墙面屏幕/投影显示",
      placement: "wall",
      defaultHeight: 1,
    },
    {
      id: "media_player.speaker",
      kind: "media_player",
      label: "音箱",
      description: "桌面/落地扬声器",
      placement: "surface",
      defaultHeight: 0.55,
    },
    {
      id: "vacuum.robot",
      kind: "vacuum",
      label: "扫地机器人",
      description: "圆盘式地面清洁机器人",
      placement: "floor",
      defaultHeight: 0.04,
    },
    {
      id: "alarm.panel",
      kind: "alarm_control_panel",
      label: "安防面板",
      description: "安防主机/控制面板",
      placement: "wall",
      defaultHeight: 0.95,
    },
    {
      id: "custom.point",
      kind: "custom",
      label: "通用设备",
      description: "未归类的设备点位",
      placement: "surface",
      defaultHeight: 0.75,
    },
  ],
  Ao = {
    "switch.light.ceiling": "light.ceiling",
    "switch.light.ceiling_panel": "light.ceiling_panel",
    "switch.light.ceiling_round": "light.ceiling_round",
    "switch.light.downlight": "light.downlight",
    "switch.light.wall_sconce": "light.wall_sconce",
    "switch.light.chandelier": "light.chandelier",
    "switch.light.floor_lamp": "light.floor_lamp",
    "switch.light.strip": "light.strip",
  };
function xs(t) {
  return Ao[t] ?? t;
}
const He = new Map(ms.map((t) => [t.id, t])),
  js = {
    alarm_control_panel: "alarm.panel",
    binary_sensor: "binary_sensor.wall",
    camera: "camera.wall",
    climate: "climate.wall_ac",
    cover: "cover.curtain",
    custom: "custom.point",
    fan: "fan.ceiling",
    light: "light.ceiling",
    lock: "lock.door",
    media_player: "media_player.tv",
    sensor: "sensor.wall",
    switch: "switch.wall",
    vacuum: "vacuum.robot",
  },
  Bo = (t) =>
    [
      "light",
      "switch",
      "cover",
      "climate",
      "sensor",
      "binary_sensor",
      "camera",
      "lock",
      "fan",
      "media_player",
      "alarm_control_panel",
      "vacuum",
    ].includes(t)
      ? t
      : "custom";
function Gt(t) {
  return Bo(t.domain);
}
function Lt(t) {
  return t ? He.get(t) : void 0;
}
function Di(t) {
  const s = typeof t == "string" ? t : Gt(t);
  return ms.filter((o) => o.kind === s);
}
const Ho = (t) => {
  const s = (t == null ? void 0 : t.attributes) ?? {},
    o = typeof s.device_class == "string" ? s.device_class : "",
    r = typeof s.unit_of_measurement == "string" ? s.unit_of_measurement : "";
  return `${(t == null ? void 0 : t.name) ?? ""} ${(t == null ? void 0 : t.entityId) ?? ""} ${o} ${r}`.toLowerCase();
};
function ys(t, s = t ? Gt(t) : "custom") {
  const o = Ho(t);
  return (t == null ? void 0 : t.domain) === "light" || s === "light"
    ? /(壁灯|wall lamp|wall.?sconce|sconce|床头灯|bedside lamp)/i.test(o)
      ? "light.wall_sconce"
      : /(吊灯|chandelier|pendant)/i.test(o)
        ? "light.chandelier"
        : /(落地灯|floor lamp|floor_lamp|floorlight)/i.test(o)
          ? "light.floor_lamp"
          : /(灯带|lightstrip|light strip|strip|氛围灯带)/i.test(o)
            ? "light.strip"
            : /(筒灯|射灯|downlight|spotlight|spot light)/i.test(o)
              ? "light.downlight"
              : /(平板灯|面板灯|panel light|panel_light|flat ceiling|平板吸顶)/i.test(
                    o,
                  )
                ? "light.ceiling_panel"
                : /(圆形吸顶|圆吸顶|圆灯|round ceiling|round_ceiling|ceiling round)/i.test(
                      o,
                    )
                  ? "light.ceiling_round"
                  : (/(吸顶灯|ceiling|主灯|客厅灯|卧室灯)/i.test(o),
                    "light.ceiling")
    : (t == null ? void 0 : t.domain) === "switch" || s === "switch"
      ? /(插座|socket|outlet|plug)/i.test(o)
        ? "switch.outlet"
        : /(空调.*开关|air.?conditioner.*switch|ac.*switch|switch_status|扫风|摆风|airflow|swing)/i.test(
              o,
            )
          ? "switch.ac_airflow"
          : /(场景|scene|button|按钮|无线|remote)/i.test(o)
            ? "switch.scene"
            : /(灯带|lightstrip|light strip|strip|氛围灯带)/i.test(o)
              ? "switch.light.strip"
              : /(壁灯|wall lamp|wall.?sconce|sconce|床头灯|bedside lamp)/i.test(
                    o,
                  )
                ? "switch.light.wall_sconce"
                : /(吊灯|chandelier|pendant)/i.test(o)
                  ? "switch.light.chandelier"
                  : /(落地灯|floor lamp|floor_lamp|floorlight)/i.test(o)
                    ? "switch.light.floor_lamp"
                    : /(筒灯|射灯|downlight|spotlight|spot light)/i.test(o)
                      ? "switch.light.downlight"
                      : /(平板灯|面板灯|panel light|panel_light|flat ceiling|平板吸顶)/i.test(
                            o,
                          )
                        ? "switch.light.ceiling_panel"
                        : /(圆形吸顶|圆吸顶|圆灯|round ceiling|round_ceiling|ceiling round)/i.test(
                              o,
                            )
                          ? "switch.light.ceiling_round"
                          : /(吸顶灯|ceiling|主灯|照明|灯光|灯\b|light)/i.test(
                                o,
                              )
                            ? "switch.light.ceiling"
                            : /(三键|三路|triple|three|3键|三开|switch3|switch2|switch1|wall_switch)/i.test(
                                  o,
                                )
                              ? "switch.triple"
                              : /(双键|双路|double|two|2键|二键|二路)/i.test(o)
                                ? "switch.double"
                                : "switch.wall"
      : (t == null ? void 0 : t.domain) === "cover" || s === "cover"
        ? /(百叶|卷帘|blind|shade|roller)/i.test(o)
          ? "cover.blind"
          : "cover.curtain"
        : (t == null ? void 0 : t.domain) === "climate" || s === "climate"
          ? /(中央空调|风管机|多联机|central|duct|cassette|vent|vrf)/i.test(o)
            ? "climate.central_ac"
            : /(柜机|立式|落地|floor|tower)/i.test(o)
              ? "climate.floor_ac"
              : /(温控|地暖|thermostat|floor heating|heat pump)/i.test(o)
                ? "climate.thermostat"
                : "climate.wall_ac"
          : (t == null ? void 0 : t.domain) === "sensor" || s === "sensor"
            ? /(温度|temperature|°c|℃)/i.test(o)
              ? "sensor.temperature"
              : /(湿度|humidity|%)/i.test(o)
                ? "sensor.humidity"
                : /(illuminance|照度|光照|light level|lux|\blx\b)/i.test(o)
                  ? "sensor.light_level"
                  : /(co2|co₂|二氧化碳|carbon dioxide)/i.test(o)
                    ? "sensor.co2"
                    : /(pm2\.?5|pm25|颗粒物|particle|particulate)/i.test(o)
                      ? "sensor.pm25"
                      : /(空气|air|pm2\.?5|pm10|co2|co₂|voc|aqi|甲醛|hcho)/i.test(
                            o,
                          )
                        ? "sensor.air_quality"
                        : /(功率|电量|能耗|power|energy|kwh|w$|瓦)/i.test(o)
                          ? "sensor.power"
                          : "sensor.wall"
            : (t == null ? void 0 : t.domain) === "binary_sensor" ||
                s === "binary_sensor"
              ? /(门|窗|door|window|contact|opening)/i.test(o)
                ? "binary_sensor.door"
                : /(存在|人在|presence|occupancy|毫米波|millimeter|mmwave|fp1|fp2|fp310)/i.test(
                      o,
                    )
                  ? "binary_sensor.presence"
                  : /(人体|移动|motion|pir)/i.test(o)
                    ? "binary_sensor.motion"
                    : /(烟雾|燃气|烟感|气体|smoke|gas|co)/i.test(o)
                      ? "binary_sensor.smoke"
                      : /(水浸|漏水|water|moisture|leak)/i.test(o)
                        ? "binary_sensor.water"
                        : "binary_sensor.wall"
              : (t == null ? void 0 : t.domain) === "camera" || s === "camera"
                ? /(门铃|doorbell|intercom|可视门铃)/i.test(o)
                  ? "camera.doorbell"
                  : /(枪机|室外|走廊|bullet|outdoor|corridor|hallway)/i.test(o)
                    ? "camera.bullet"
                    : /(云台|球机|半球|dome|ptz|pan|tilt)/i.test(o)
                      ? "camera.dome"
                      : "camera.wall"
                : (t == null ? void 0 : t.domain) === "lock" || s === "lock"
                  ? "lock.door"
                  : (t == null ? void 0 : t.domain) === "fan" || s === "fan"
                    ? /(塔扇|tower)/i.test(o)
                      ? "fan.tower"
                      : /(落地|循环|floor|stand|pedestal|circulator)/i.test(o)
                        ? "fan.floor"
                        : "fan.ceiling"
                    : (t == null ? void 0 : t.domain) === "media_player" ||
                        s === "media_player"
                      ? /(音箱|音响|speaker|sound|sonos|homepod|小爱|小明)/i.test(
                          o,
                        )
                        ? "media_player.speaker"
                        : "media_player.tv"
                      : (t == null ? void 0 : t.domain) === "vacuum" ||
                          s === "vacuum"
                        ? "vacuum.robot"
                        : js[s];
}
function bs(t, s) {
  const o = Lt(t.modelId);
  if (o && o.kind === t.kind) return o;
  const r = ys(s, t.kind);
  return He.get(r) ?? He.get(js[t.kind]) ?? He.get("custom.point");
}
function Wi(t, s, o) {
  const r = Gt(t),
    n = Lt(o) ?? He.get(ys(t, r));
  return n.placement === "ceiling" || n.id === "climate.wall_ac"
    ? Math.max(0.2, s)
    : n.defaultHeight;
}
const Pe = [
    { kelvin: 2e3, color: [255, 151, 82] },
    { kelvin: 2700, color: [255, 190, 118] },
    { kelvin: 4e3, color: [255, 239, 211] },
    { kelvin: 5e3, color: [245, 248, 255] },
    { kelvin: 6500, color: [215, 231, 255] },
  ],
  Ve = (t, s, o) => Math.min(o, Math.max(s, t)),
  Re = (t, s) => {
    const o = t == null ? void 0 : t.attributes[s];
    return typeof o == "number" && Number.isFinite(o) ? o : void 0;
  },
  Ge = (t, s) => {
    const o = t == null ? void 0 : t.attributes[s];
    return Array.isArray(o)
      ? o.filter((r) => typeof r == "number" && Number.isFinite(r))
      : [];
  },
  Do = (t) => {
    const s = t == null ? void 0 : t.attributes.supported_color_modes;
    return Array.isArray(s) ? s.filter((o) => typeof o == "string") : [];
  },
  kt = (t) =>
    Math.round(Ve(t, 0, 255))
      .toString(16)
      .padStart(2, "0"),
  ws = (t) => `#${t.slice(0, 3).map(kt).join("")}`;
function Wo(t, s) {
  const o = (((t % 360) + 360) % 360) / 60,
    n = Ve(s, 0, 100) / 100,
    a = n * (1 - Math.abs((o % 2) - 1)),
    i = 1 - n,
    [d, l, c] =
      o < 1
        ? [n, a, 0]
        : o < 2
          ? [a, n, 0]
          : o < 3
            ? [0, n, a]
            : o < 4
              ? [0, a, n]
              : o < 5
                ? [a, 0, n]
                : [n, 0, a];
  return ws([(d + i) * 255, (l + i) * 255, (c + i) * 255]);
}
function Vo(t, s) {
  for (const r of ["rgb_color", "rgbw_color", "rgbww_color"]) {
    const n = Ge(t, r);
    if (n.length >= 3) return ws(n);
  }
  const o = Ge(t, "hs_color");
  return o.length >= 2 ? Wo(o[0], o[1]) : s;
}
function Uo(t) {
  const s = Ve(t, Pe[0].kelvin, Pe[Pe.length - 1].kelvin),
    o = Pe.findIndex((d) => d.kelvin >= s),
    r = Pe[Math.max(0, o)],
    n = Pe[Math.max(0, o - 1)];
  if (r.kelvin === n.kelvin) return `#${r.color.map(kt).join("")}`;
  const a = (s - n.kelvin) / (r.kelvin - n.kelvin);
  return `#${n.color
    .map((d, l) => d + (r.color[l] - d) * a)
    .map(kt)
    .join("")}`;
}
function dt(t) {
  const s = (t == null ? void 0 : t.state.toLowerCase()) === "on",
    o = Do(t),
    r =
      ["rgb_color", "rgbw_color", "rgbww_color"].some(
        (y) => Ge(t, y).length >= 3,
      ) || Ge(t, "hs_color").length >= 2,
    n = Re(t, "brightness"),
    a =
      n !== void 0 ||
      o.some((y) =>
        [
          "brightness",
          "color_temp",
          "hs",
          "rgb",
          "rgbw",
          "rgbww",
          "xy",
          "white",
        ].includes(y),
      ),
    i = s ? Ve((n ?? 200) / 255, 0.04, 1) : 0,
    d = Re(t, "color_temp_kelvin"),
    l = Re(t, "color_temp"),
    c = Re(t, "min_color_temp_kelvin") ?? 2e3,
    h = Math.max(c, Re(t, "max_color_temp_kelvin") ?? 6500),
    u = d ?? (l && l > 0 ? 1e6 / l : 4e3),
    f = Math.round(Ve(u, c, h)),
    j = d !== void 0 || l !== void 0 || o.includes("color_temp"),
    v =
      o.some((y) => ["hs", "rgb", "rgbw", "rgbww", "xy"].includes(y)) ||
      Ge(t, "rgb_color").length >= 3 ||
      Ge(t, "hs_color").length >= 2;
  return {
    brightness: i,
    brightnessPercent: s ? Math.round(i * 100) : 0,
    color: Vo(t, Uo(f)),
    colorTempKelvin: f,
    hasBrightness: a,
    hasColor: v,
    hasColorTemperature: j,
    isOn: s,
    usesColor: r,
  };
}
function $t(t) {
  if (!t.isOn) return "关闭";
  const s = [
    t.hasBrightness ? `${t.brightnessPercent}%` : void 0,
    t.usesColor
      ? "彩色"
      : t.hasColorTemperature
        ? `${t.colorTempKelvin}K`
        : void 0,
  ].filter(Boolean);
  return s.length ? s.join(" · ") : "开启";
}
const Vi = {
    environment: "环境",
    lighting: "照明",
    shade: "遮阳",
    security: "安防",
  },
  St = [
    {
      capability: "environment",
      role: "temperature",
      label: "温度",
      description: "房间温度传感器或空调当前温度",
      domains: ["sensor", "climate"],
      deviceClasses: ["temperature"],
      units: ["°c", "℃"],
      keywords: ["temperature", "temp", "温度"],
      aggregation: "avg",
    },
    {
      capability: "environment",
      role: "humidity",
      label: "湿度",
      description: "房间湿度传感器",
      domains: ["sensor"],
      deviceClasses: ["humidity"],
      units: ["%"],
      keywords: ["humidity", "湿度"],
      aggregation: "avg",
    },
    {
      capability: "environment",
      role: "pm25",
      label: "PM2.5",
      description: "颗粒物传感器",
      domains: ["sensor"],
      deviceClasses: ["pm25"],
      keywords: ["pm2.5", "pm25", "颗粒物"],
      aggregation: "avg",
    },
    {
      capability: "environment",
      role: "co2",
      label: "CO₂",
      description: "二氧化碳传感器",
      domains: ["sensor"],
      deviceClasses: ["carbon_dioxide"],
      keywords: ["co2", "carbon dioxide", "二氧化碳"],
      aggregation: "avg",
    },
    {
      capability: "environment",
      role: "voc",
      label: "VOC",
      description: "挥发性有机物传感器",
      domains: ["sensor"],
      deviceClasses: ["volatile_organic_compounds"],
      keywords: ["voc", "tvoc", "甲醛", "挥发"],
      aggregation: "avg",
    },
    {
      capability: "environment",
      role: "illuminance",
      label: "照度",
      description: "光照/照度传感器",
      domains: ["sensor"],
      deviceClasses: ["illuminance"],
      keywords: ["illuminance", "lux", "照度", "光照"],
      aggregation: "avg",
    },
    {
      capability: "lighting",
      role: "main",
      label: "主灯",
      description: "房间主要照明",
      domains: ["light", "switch"],
      keywords: ["main", "ceiling", "主灯", "吸顶灯", "灯"],
      aggregation: "latest",
    },
    {
      capability: "lighting",
      role: "ambient",
      label: "氛围灯",
      description: "灯带、筒灯或辅助照明",
      domains: ["light", "switch"],
      keywords: ["strip", "ambient", "氛围", "灯带", "射灯", "筒灯"],
      aggregation: "latest",
    },
    {
      capability: "lighting",
      role: "scene",
      label: "灯光场景",
      description: "Home Assistant 场景实体",
      domains: ["scene"],
      keywords: ["scene", "场景"],
      aggregation: "latest",
    },
    {
      capability: "shade",
      role: "curtain",
      label: "窗帘",
      description: "窗帘、卷帘、遮阳帘",
      domains: ["cover"],
      deviceClasses: ["curtain", "shade"],
      keywords: ["curtain", "shade", "窗帘", "遮阳"],
      aggregation: "latest",
    },
    {
      capability: "shade",
      role: "blind",
      label: "百叶",
      description: "百叶帘或可调角度遮阳",
      domains: ["cover"],
      deviceClasses: ["blind", "shutter"],
      keywords: ["blind", "shutter", "百叶"],
      aggregation: "latest",
    },
    {
      capability: "security",
      role: "motion",
      label: "人体/移动",
      description: "移动、人体或占用传感器",
      domains: ["binary_sensor"],
      deviceClasses: ["motion", "occupancy"],
      keywords: ["motion", "人体", "移动"],
      aggregation: "latest",
    },
    {
      capability: "security",
      role: "presence",
      label: "存在",
      description: "存在检测或毫米波传感器",
      domains: ["binary_sensor", "sensor"],
      deviceClasses: ["presence", "occupancy"],
      keywords: ["presence", "occupancy", "存在", "人在"],
      aggregation: "latest",
    },
    {
      capability: "security",
      role: "doorWindow",
      label: "门窗",
      description: "门窗开合传感器",
      domains: ["binary_sensor"],
      deviceClasses: ["door", "window", "opening"],
      keywords: ["door", "window", "门", "窗"],
      aggregation: "latest",
    },
    {
      capability: "security",
      role: "camera",
      label: "摄像头",
      description: "摄像头实体",
      domains: ["camera"],
      keywords: ["camera", "摄像"],
      aggregation: "latest",
    },
    {
      capability: "security",
      role: "lock",
      label: "门锁",
      description: "门锁实体",
      domains: ["lock"],
      keywords: ["lock", "锁"],
      aggregation: "latest",
    },
    {
      capability: "security",
      role: "alarm",
      label: "布撤防",
      description: "安防面板",
      domains: ["alarm_control_panel"],
      keywords: ["alarm", "安防", "报警"],
      aggregation: "latest",
    },
  ],
  qo = {
    environment: ["sensor", "climate"],
    lighting: ["light", "scene"],
    shade: ["cover"],
    security: ["alarm_control_panel", "binary_sensor", "camera", "lock"],
  },
  vs = (t) => (typeof t == "string" ? t.trim().toLowerCase() : ""),
  Xo = (t) => `${t.entityId} ${t.name}`.toLowerCase(),
  Zo = (t) => vs(t.attributes.device_class),
  Yo = (t) => vs(t.attributes.unit_of_measurement);
function Ms(t, s) {
  return (t == null ? void 0 : t[s]) ?? {};
}
function Qo(t, s) {
  return St.find((o) => o.capability === t && o.role === s);
}
function pe(t, s, o) {
  var r;
  return ((r = Ms(t.bindings, s)[o]) == null ? void 0 : r.entityIds) ?? [];
}
function Jo(t, s) {
  const o = s ? [Ms(t.bindings, s)] : Object.values(t.bindings ?? {});
  return [
    ...new Set(o.flatMap((r) => Object.values(r).flatMap((n) => n.entityIds))),
  ];
}
function en(t, s, o, r) {
  return tn(t, s, o, r ? [r] : []);
}
function tn(t, s, o, r) {
  const n = { ...(t.bindings ?? {}) },
    a = { ...(n[s] ?? {}) },
    i = [...new Set(r.filter(Boolean))];
  if (i.length) {
    const l = Qo(s, o);
    a[o] = { entityIds: i, aggregation: l == null ? void 0 : l.aggregation };
  } else delete a[o];
  n[s] = Object.keys(a).length ? a : void 0;
  const d = Object.fromEntries(
    Object.entries(n).filter(([, l]) => l && Object.keys(l).length),
  );
  return { ...t, bindings: Object.keys(d).length ? d : void 0 };
}
function sn(t, s, o) {
  return Jo(t, o)
    .map((r) => s[r])
    .filter((r) => !!r);
}
function Le(t, s, o, r) {
  const n = sn(t, o, r),
    a = s.devices
      .filter((i) => i.roomId === t.id)
      .map((i) => ({ device: i, entity: o[i.entityId] }))
      .filter(({ device: i, entity: d }) => {
        var l;
        return !!(
          d &&
          (qo[r].includes(d.domain) ||
            (r === "lighting" &&
              (l = i.modelId) != null &&
              l.startsWith("switch.light.")))
        );
      })
      .map(({ entity: i }) => i);
  return [...new Map([...n, ...a].map((i) => [i.entityId, i])).values()];
}
function Ct(t, s, o, r) {
  var c, h, u;
  if (!s.domains.includes(t.domain)) return 0;
  const n = Zo(t),
    a = Yo(t),
    i = Xo(t),
    d =
      ((c = s.keywords) == null
        ? void 0
        : c.some((f) => i.includes(f.toLowerCase()))) ?? !1;
  if (s.capability === "lighting" && t.domain === "switch" && !d) return 0;
  let l = 2;
  return (
    o && t.areaId === o && (l += 20),
    r && i.includes(r.toLowerCase()) && (l += 4),
    (h = s.deviceClasses) != null &&
      h.some((f) => n === f || n.includes(f)) &&
      (l += 14),
    (u = s.units) != null && u.some((f) => a === f) && (l += 8),
    d && (l += 8),
    (t.state === "unavailable" || t.state === "unknown") && (l -= 12),
    l
  );
}
function rn(t, s, o, r) {
  var a;
  return (a = t
    .map((i) => ({ entity: i, score: Ct(i, s, o, r) }))
    .filter((i) => i.score > 2)
    .sort(
      (i, d) => d.score - i.score || i.entity.name.localeCompare(d.entity.name),
    )[0]) == null
    ? void 0
    : a.entity;
}
function Ui(t, s, o, r) {
  return [...t]
    .filter((n) => s.domains.includes(n.domain))
    .sort(
      (n, a) => Ct(a, s, o, r) - Ct(n, s, o, r) || n.name.localeCompare(a.name),
    );
}
function Ki(t, s, o) {
  const r = Object.values(s);
  return (o ? St.filter((a) => a.capability === o) : St).reduce((a, i) => {
    if (pe(a, i.capability, i.role).length) return a;
    const d = rn(r, i, a.haAreaId, a.name);
    return en(a, i.capability, i.role, d == null ? void 0 : d.entityId);
  }, t);
}
const ye = (t) => {
    if (typeof t == "number" && Number.isFinite(t)) return t;
    if (typeof t == "string") {
      const s = Number.parseFloat(t);
      return Number.isFinite(s) ? s : void 0;
    }
  },
  ht = (t) => `${t.entityId} ${t.name}`.toLowerCase(),
  _s = (t, s) =>
    typeof t.attributes[s] == "string"
      ? `${t.attributes[s]}`.toLowerCase()
      : "",
  Tt = (t) => _s(t, "unit_of_measurement").trim(),
  ut = (t) => _s(t, "device_class").trim(),
  ae = (t) => (t.length ? t.reduce((s, o) => s + o, 0) / t.length : void 0),
  on = (t, s) => {
    if (t.length)
      return s === "min"
        ? Math.min(...t)
        : s === "max"
          ? Math.max(...t)
          : s === "latest"
            ? t.at(-1)
            : ae(t);
  };
function nn(t) {
  if (t.domain === "climate")
    return ye(t.attributes.current_temperature) ?? ye(t.attributes.temperature);
  const s = Tt(t),
    o = ut(t),
    r = ht(t);
  return o === "temperature" ||
    s === "°c" ||
    s === "°f" ||
    r.includes("temperature") ||
    r.includes("温度")
    ? ye(t.state)
    : void 0;
}
function an(t) {
  const s = Tt(t),
    o = ut(t),
    r = ht(t);
  return o === "humidity" ||
    (s === "%" && (r.includes("humidity") || r.includes("湿度")))
    ? ye(t.state)
    : void 0;
}
function cn(t, s) {
  const o = ut(t),
    r = ht(t);
  if (
    (s === "pm25" &&
      (o === "pm25" || r.includes("pm2.5") || r.includes("pm25"))) ||
    (s === "co2" &&
      (o === "carbon_dioxide" ||
        r.includes("co2") ||
        r.includes("二氧化碳"))) ||
    (s === "voc" &&
      (o === "volatile_organic_compounds" ||
        r.includes("voc") ||
        r.includes("tvoc")))
  )
    return ye(t.state);
}
function ln(t) {
  const s = Tt(t),
    o = ut(t),
    r = ht(t);
  return o === "illuminance" ||
    s === "lx" ||
    r.includes("illuminance") ||
    r.includes("lux") ||
    r.includes("照度") ||
    r.includes("光照")
    ? ye(t.state)
    : void 0;
}
const It = (t) =>
  t.pm25 === void 0 &&
  t.co2 === void 0 &&
  t.voc === void 0 &&
  t.humidity === void 0
    ? "--"
    : (t.pm25 ?? 0) > 75 ||
        (t.co2 ?? 0) > 1500 ||
        (t.voc ?? 0) > 1e3 ||
        (t.humidity ?? 0) > 72
      ? "中"
      : (t.pm25 ?? 0) > 35 ||
          (t.co2 ?? 0) > 1e3 ||
          (t.voc ?? 0) > 500 ||
          (t.humidity ?? 0) > 66
        ? "良"
        : "优";
function ie(t, s) {
  return t
    .map((o) =>
      s === "temperature"
        ? nn(o)
        : s === "humidity"
          ? an(o)
          : s === "illuminance"
            ? ln(o)
            : cn(o, s),
    )
    .filter((o) => typeof o == "number");
}
function ze(t, s, o) {
  var a, i;
  const r =
    (i = (a = t.bindings) == null ? void 0 : a.environment) == null
      ? void 0
      : i[o];
  if (!r) return;
  const n = ie(
    r.entityIds.map((d) => s[d]).filter((d) => !!d),
    o,
  );
  return on(n, r.aggregation);
}
function qt(t, s) {
  const o = ie(s, "temperature"),
    r = ie(s, "humidity"),
    n = ae(ie(s, "pm25")),
    a = ae(ie(s, "co2")),
    i = ae(ie(s, "voc")),
    d = ae(ie(s, "illuminance")),
    l = ae(o),
    c = ae(r);
  if (!(
    l === void 0 &&
    c === void 0 &&
    n === void 0 &&
    a === void 0 &&
    i === void 0 &&
    d === void 0
  ))
    return {
      temperature: l,
      humidity: c,
      pm25: n,
      co2: a,
      voc: i,
      illuminance: d,
      quality: It({ humidity: c, pm25: n, co2: a, voc: i }),
      source: t,
    };
}
function ks(t, s, o) {
  if (
    pe(t, "environment", "temperature").length ||
    pe(t, "environment", "humidity").length ||
    pe(t, "environment", "pm25").length ||
    pe(t, "environment", "co2").length ||
    pe(t, "environment", "voc").length ||
    pe(t, "environment", "illuminance").length
  ) {
    const l = ze(t, o, "temperature"),
      c = ze(t, o, "humidity"),
      h = ze(t, o, "pm25"),
      u = ze(t, o, "co2"),
      f = ze(t, o, "voc"),
      j = ze(t, o, "illuminance");
    return {
      temperature: l,
      humidity: c,
      pm25: h,
      co2: u,
      voc: f,
      illuminance: j,
      quality: It({ humidity: c, pm25: h, co2: u, voc: f }),
      source: "binding",
    };
  }
  const n = Le(t, s, o, "environment"),
    a = qt("device", n);
  if (a) return a;
  const i = t.haAreaId
      ? Object.values(o).filter(
          (l) =>
            l.areaId === t.haAreaId && ["sensor", "climate"].includes(l.domain),
        )
      : [],
    d = qt("area", i);
  return d || { quality: "--", source: "unconfigured" };
}
function qi(t, s) {
  const o =
      (s == null
        ? void 0
        : s.floors.flatMap((b) => b.rooms.map((w) => ks(w, b, t)))) ?? [],
    r = Object.values(t),
    n = o.map((b) => b.temperature).filter((b) => typeof b == "number"),
    a = o.map((b) => b.humidity).filter((b) => typeof b == "number"),
    i = ie(r, "temperature"),
    d = ie(r, "humidity"),
    l = n.length ? n : i,
    c = a.length ? a : d,
    h = ae(l),
    u = ae(c),
    f = ae(ie(r, "pm25")),
    j = ae(ie(r, "co2")),
    v = ae(ie(r, "voc")),
    y = l.length ? Math.min(...l) : void 0,
    x = l.length ? Math.max(...l) : void 0;
  return {
    temperature: h,
    humidity: u,
    temperatureRange:
      y !== void 0 && x !== void 0
        ? `${y.toFixed(1)} - ${x.toFixed(1)}°`
        : "--",
    humidityRange: c.length
      ? `${Math.min(...c).toFixed(0)} - ${Math.max(...c).toFixed(0)}%`
      : "--",
    airQuality: It({ humidity: u, pm25: f, co2: j, voc: v }),
  };
}
function Ss(t, s, o) {
  return ks(t, s, o);
}
const dn = {
    background: "#405f91",
    fog: "#5d7cae",
    ground: "#6d88b3",
    wallColor: "#d7e2f1",
    wallOpacity: 0.28,
    wallEdgeColor: "#f7fbff",
    wallEdgeOpacity: 0.14,
    floorPalette: ["#7e90ae", "#8797b4", "#8d9db9", "#7789a9", "#8394b2"],
    roomHighlight: "#a6b8d4",
    roomAccent: "#8f9fbd",
    roomEdgeColor: "#fbfdff",
    foundation: "#526985",
    furnitureMain: "#b7c3d4",
    furnitureDetail: "#74849c",
    deviceBody: "#f8fbff",
    glow: "#eef7ff",
  },
  hn = {
    background: "#587db2",
    fog: "#7290bd",
    ground: "#7893bb",
    wallColor: "#dbe5f3",
    wallOpacity: 0.28,
    wallEdgeColor: "#fbfdff",
    wallEdgeOpacity: 0.14,
    floorPalette: ["#8192b0", "#8a9ab6", "#91a0bc", "#788aa8", "#8495b3"],
    roomHighlight: "#a9bad5",
    roomAccent: "#91a3bf",
    roomEdgeColor: "#ffffff",
    foundation: "#536b89",
    furnitureMain: "#bac6d7",
    furnitureDetail: "#75869d",
    deviceBody: "#fbfdff",
    glow: "#f4fbff",
  };
// ha3d-self: B6 删除卡通风格调色板 Fe、un()，以及 Nn、Fn 的卡通配色和各模型的 meshToonMaterial 分支（visualStyle 不会是 "cartoon"，见 Ja 处说明）
const Ae = {
  background: "#c8bcaa",
  fog: "#d9cdbc",
  ground: "#b7a68f",
  wallColor: "#e7dfd2",
  wallOpacity: 0.92,
  wallEdgeColor: "#746858",
  wallEdgeOpacity: 0.3,
  floorPalette: ["#cba873", "#d4b98e", "#bfa172", "#ddc7a3", "#b79160"],
  roomHighlight: "#e6bd67",
  roomAccent: "#c99b5d",
  roomEdgeColor: "#655a4d",
  foundation: "#91816e",
  furnitureMain: "#b9824e",
  furnitureDetail: "#665848",
  deviceBody: "#eee7dc",
  glow: "#d89a3f",
};
function fn(t) {
  return t === "lighting"
    ? {
        ...Ae,
        background: "#cdb99b",
        fog: "#ddc7a8",
        ground: "#b89b72",
        floorPalette: ["#ce984f", "#d7ad72", "#be874f", "#d2ae7a", "#ad7542"],
        roomHighlight: "#e7b451",
        roomAccent: "#c89049",
        glow: "#e19a32",
      }
    : t === "shade"
      ? {
          ...Ae,
          background: "#b9bbb3",
          fog: "#cecac0",
          ground: "#a8a596",
          floorPalette: ["#b9aa8e", "#c7b89c", "#ae9f84", "#d0c2aa", "#a18f74"],
          roomAccent: "#aa9a84",
          glow: "#9b8160",
        }
      : t === "environment"
        ? {
            ...Ae,
            background: "#bcc0ad",
            fog: "#d1d3c3",
            ground: "#a9af94",
            floorPalette: [
              "#b9b587",
              "#c8bea0",
              "#aebc96",
              "#d1c39d",
              "#ae9e78",
            ],
            roomAccent: "#b4ab7d",
            glow: "#aa914d",
          }
        : t === "security"
          ? {
              ...Ae,
              background: "#bdb3aa",
              fog: "#d2c7bd",
              ground: "#a69a8d",
              floorPalette: [
                "#bca187",
                "#cbb5a2",
                "#ad9380",
                "#d1bdab",
                "#a18976",
              ],
              roomAccent: "#b68e76",
              glow: "#bd7158",
            }
          : Ae;
}
function Nt(t, s = "overview", o = "glass") {
  if (o === "cream") return fn(s);
  const r = t === "night" ? dn : hn;
  return s === "lighting"
    ? {
        ...r,
        background: t === "night" ? "#080817" : "#5879ad",
        fog: t === "night" ? "#0c0c20" : "#6685b4",
        ground: t === "night" ? "#080817" : "#5879ad",
        wallColor: t === "night" ? "#6d6c94" : "#c9d3e0",
        wallEdgeColor: t === "night" ? "#d8c9b0" : "#eef3ff",
        wallOpacity: t === "night" ? 0.4 : 0.42,
        wallEdgeOpacity: t === "night" ? 0.045 : 0.04,
        floorPalette:
          t === "night"
            ? ["#383247", "#40384c", "#473e51", "#3b3448", "#44394d"]
            : ["#647793", "#6b7e99", "#72859f", "#60738f", "#6e809a"],
        roomAccent: t === "night" ? "#584841" : "#929db5",
        roomEdgeColor: t === "night" ? "#d8c9b0" : "#f4f7ff",
        furnitureMain: t === "night" ? "#47445c" : "#bac8d8",
        furnitureDetail: t === "night" ? "#29283b" : "#7a8da6",
        glow: "#ffd08a",
      }
    : s === "shade"
      ? {
          ...r,
          background: "#080c22",
          fog: "#0c122b",
          ground: "#080c22",
          wallColor: "#6d7e9f",
          wallOpacity: 0.4,
          floorPalette: ["#1d3151", "#213858", "#263f60", "#1e3556", "#273e60"],
          roomAccent: "#2a405e",
          wallEdgeColor: "#b6c9e8",
          wallEdgeOpacity: 0.045,
          roomEdgeColor: "#b8e7ff",
          furnitureMain: "#425873",
          furnitureDetail: "#263a53",
          glow: "#83d8ff",
        }
      : s === "environment"
        ? {
            ...r,
            background: "#5579ae",
            fog: "#6f8fbd",
            ground: "#7895bf",
            wallColor: "#dce7f4",
            wallOpacity: 0.27,
            wallEdgeOpacity: 0.14,
            floorPalette: [
              "#8395b4",
              "#8d9db9",
              "#94a4bf",
              "#7b8ead",
              "#8798b6",
            ],
            roomAccent: "#97a9c5",
            wallEdgeColor: "#f7fcff",
            furnitureMain: "#bac6d8",
            furnitureDetail: "#76879f",
            foundation: "#566f91",
            glow: "#c4e9ff",
          }
        : s === "security"
          ? {
              ...r,
              background: "#070a1d",
              fog: "#0b0f27",
              ground: "#070a1d",
              wallColor: "#6f7799",
              wallOpacity: 0.4,
              wallEdgeColor: "#c0b8d3",
              wallEdgeOpacity: 0.045,
              floorPalette: [
                "#1a213d",
                "#1d2644",
                "#222b4b",
                "#1b2340",
                "#222943",
              ],
              roomAccent: "#3c2c4f",
              furnitureMain: "#303952",
              furnitureDetail: "#1c2339",
              foundation: "#0e142b",
              glow: "#ff708a",
            }
          : r;
}
const pn = {
    alarm_control_panel: "安防",
    automation: "自动化",
    binary_sensor: "感应器",
    button: "按钮",
    conversation: "语音助手",
    device_tracker: "定位",
    event: "事件",
    light: "灯光",
    lock: "门锁",
    switch: "开关",
    cover: "窗帘",
    climate: "空调",
    sensor: "传感器",
    camera: "摄像机",
    fan: "风扇",
    media_player: "影音设备",
    vacuum: "扫地机器人",
    notify: "通知",
    number: "数值",
    person: "成员",
    script: "脚本",
    scene: "场景",
    select: "选项",
    sun: "日照",
    tag: "标签",
    tts: "语音播报",
    update: "更新",
    weather: "天气",
    zone: "区域",
  },
  gn = {
    apparent_power: "视在功率",
    aqi: "空气质量",
    atmospheric_pressure: "气压",
    battery: "电量",
    carbon_dioxide: "二氧化碳",
    carbon_monoxide: "一氧化碳",
    current: "电流",
    door: "门磁",
    energy: "能耗",
    gas: "燃气",
    humidity: "湿度",
    illuminance: "照度",
    moisture: "水浸",
    motion: "人体感应",
    pm1: "PM1",
    pm10: "PM10",
    pm25: "PM2.5",
    power: "功率",
    pressure: "压力",
    signal_strength: "信号",
    smoke: "烟雾",
    temperature: "温度",
    voltage: "电压",
    window: "窗磁",
  },
  mn = {
    on: "已开启",
    off: "已关闭",
    open: "已打开",
    closed: "已关闭",
    opening: "正在打开",
    closing: "正在关闭",
    unavailable: "离线",
    unknown: "状态未知",
    idle: "待机",
    auto: "自动",
    cool: "制冷",
    heat: "制热",
    dry: "除湿",
    fan_only: "送风",
    playing: "播放中",
    paused: "已暂停",
    cleaning: "清扫中",
    docked: "已回充",
    returning: "回充中",
    error: "异常",
    home: "在家",
    not_home: "离家",
  },
  xn = {
    alarm_control_panel: ps,
    binary_sensor: Kt,
    light: fs,
    lock: Zr,
    switch: Go,
    cover: ao,
    climate: We,
    sensor: Kt,
    camera: Er,
    fan: lt,
    media_player: jo,
    person: To,
    vacuum: Cr,
    scene: Co,
  };
function Ue(t) {
  return pn[t] ?? "智能设备";
}
function jn(t) {
  const s = t.attributes.device_class;
  return typeof s == "string" && s.trim() ? s.trim().toLowerCase() : void 0;
}
function yn(t) {
  const s = jn(t);
  if (s) return gn[s] ?? s.replace(/_/g, " ");
}
function Xi(t) {
  const s = yn(t);
  return s ? `${Ue(t.domain)} · ${s}` : Ue(t.domain);
}
function Ke(t) {
  if (t.domain === "sensor") {
    const s =
      typeof t.attributes.unit_of_measurement == "string"
        ? t.attributes.unit_of_measurement
        : "";
    return `${t.state}${s}`;
  }
  return mn[t.state] ?? t.state;
}
function bn(t) {
  return ![
    "off",
    "closed",
    "idle",
    "paused",
    "unavailable",
    "unknown",
  ].includes(t.state);
}
function Cs({ domain: t, size: s = 18 }) {
  const o = xn[t] ?? Nr;
  return e.jsx(o, { size: s, "aria-hidden": "true" });
}
const Ps = 0.96,
  zs = 0.25,
  it = [1.16, 1.16],
  Zi = 0.22,
  wn = (t) => t === "light.strip" || t === "switch.light.strip",
  vn = (t) => (t === "ring" ? 3 : 2),
  Mn = (t) => {
    var s;
    return Math.max(
      zs,
      Math.abs(((s = t.scale) == null ? void 0 : s[0]) ?? 1) * Ps,
    );
  },
  Es = (t) => {
    var s;
    return -(((s = t.rotation) == null ? void 0 : s[1]) ?? 0);
  },
  Yi = (t) => (Es(t) * 180) / Math.PI;
function _n(t) {
  const s = [t.position[0], t.position[2]],
    o = Mn(t) / 2,
    r = Es(t),
    n = [Math.cos(r) * o, Math.sin(r) * o];
  return { start: [s[0] - n[0], s[1] - n[1]], end: [s[0] + n[0], s[1] + n[1]] };
}
function Ye(t) {
  const s = t.lightStrip;
  return !!(s && s.points.length >= vn(s.shape));
}
function Gs(t) {
  return Ye(t) ? t.lightStrip.shape : "line";
}
function Ls(t) {
  if (Ye(t)) return t.lightStrip.points.map((r) => [...r]);
  const { start: s, end: o } = _n(t);
  return [s, o];
}
function $s(t, s) {
  const o = [];
  for (let r = 0; r < t.length - 1; r += 1)
    o.push({ start: t[r], end: t[r + 1] });
  return (
    s === "ring" &&
      t.length >= 3 &&
      o.push({ start: t[t.length - 1], end: t[0] }),
    o
  );
}
function kn(t, s) {
  return $s(t, s).reduce(
    (o, r) => o + Math.hypot(r.end[0] - r.start[0], r.end[1] - r.start[1]),
    0,
  );
}
function Qi(t) {
  return kn(Ls(t), Gs(t));
}
function Sn(t) {
  return t.length
    ? [
        t.reduce((s, o) => s + o[0], 0) / t.length,
        t.reduce((s, o) => s + o[1], 0) / t.length,
      ]
    : [0, 0];
}
function Ts(t, s) {
  let o = !1;
  for (let r = 0, n = s.length - 1; r < s.length; n = r++) {
    const [a, i] = s[r],
      [d, l] = s[n];
    i > t[1] != l > t[1] &&
      t[0] < ((d - a) * (t[1] - i)) / (l - i || Number.EPSILON) + a &&
      (o = !o);
  }
  return o;
}
function Ji(t, s, o, r) {
  var i, d;
  const n = Sn(r),
    a = s.rooms.find((l) => Ts(n, l.polygon));
  return {
    ...t,
    roomId: a == null ? void 0 : a.id,
    position: [n[0], t.position[1], n[1]],
    rotation: Ye(t) ? [0, 0, 0] : t.rotation,
    scale: [
      1,
      ((i = t.scale) == null ? void 0 : i[1]) ?? it[0],
      ((d = t.scale) == null ? void 0 : d[2]) ?? it[1],
    ],
    lightStrip: { shape: o, points: r.map((l) => [...l]) },
  };
}
function e0(t, s, o, r) {
  var l, c, h, u;
  const n = Math.max(zs, Math.hypot(r[0] - o[0], r[1] - o[1])),
    a = Math.atan2(r[1] - o[1], r[0] - o[0]),
    i = [(o[0] + r[0]) / 2, (o[1] + r[1]) / 2],
    d = s.rooms.find((f) => Ts(i, f.polygon));
  return {
    ...t,
    roomId: d == null ? void 0 : d.id,
    position: [i[0], t.position[1], i[1]],
    rotation: [
      ((l = t.rotation) == null ? void 0 : l[0]) ?? 0,
      -a,
      ((c = t.rotation) == null ? void 0 : c[2]) ?? 0,
    ],
    scale: [
      n / Ps,
      ((h = t.scale) == null ? void 0 : h[1]) ?? it[0],
      ((u = t.scale) == null ? void 0 : u[2]) ?? it[1],
    ],
    lightStrip: void 0,
  };
}
const Cn = new Set(["unavailable", "unknown", "offline"]),
  Pn = new Set([
    "on",
    "open",
    "opening",
    "cool",
    "heat",
    "dry",
    "fan_only",
    "cleaning",
    "returning",
    "playing",
    "armed_home",
    "armed_away",
    "armed_night",
    "triggered",
  ]),
  zn = new Set([
    "on",
    "open",
    "opening",
    "detected",
    "problem",
    "unsafe",
    "unlocked",
    "triggered",
    "armed_triggered",
  ]),
  Is = [
    "door",
    "window",
    "opening",
    "lock",
    "smoke",
    "gas",
    "moisture",
    "problem",
    "safety",
  ],
  Ns = ["motion", "presence", "occupancy"],
  En = new Set(["alarm_control_panel", "binary_sensor", "camera", "lock"]);
function he(t) {
  return (t == null ? void 0 : t.state.toLowerCase()) ?? "unknown";
}
function Qe(t) {
  return Cn.has(he(t));
}
function Os(t, s) {
  const o = he(s);
  if (Qe(s)) return !1;
  if (Pn.has(o)) return !0;
  if (t.kind === "sensor") return !1;
  const r = Number.parseFloat((s == null ? void 0 : s.state) ?? "");
  return (
    Number.isFinite(r) &&
    Math.abs(r) > 0 &&
    ["fan", "cover", "media_player"].includes(t.kind)
  );
}
function ft(t, s) {
  const o = "entityId" in t && "kind" in t ? t : void 0,
    r = s ?? ("domain" in t ? t : void 0),
    n = he(r),
    a =
      typeof (r == null ? void 0 : r.attributes.device_class) == "string"
        ? r.attributes.device_class.toLowerCase()
        : "",
    i =
      `${(r == null ? void 0 : r.name) ?? ""} ${(r == null ? void 0 : r.entityId) ?? ""}`.toLowerCase(),
    d = Is.some((u) => a.includes(u) || i.includes(u)),
    l = Ns.some((u) => a.includes(u) || i.includes(u)),
    c = (o == null ? void 0 : o.kind) ?? (r == null ? void 0 : r.domain) ?? "",
    h = En.has(c) || d || l;
  return Qe(r)
    ? h
    : c === "alarm_control_panel"
      ? ["triggered", "armed_triggered"].includes(n)
      : c === "binary_sensor"
        ? zn.has(n) && (d || l)
        : (r == null ? void 0 : r.domain) === "lock"
          ? ["unlocked", "open"].includes(n)
          : !1;
}
function pt(t, s, o) {
  var i;
  if (o === "overview") return !1;
  if (o === "lighting")
    return (
      t.kind === "light" ||
      ((i = t.modelId) == null ? void 0 : i.startsWith("switch.light.")) ||
      (s == null ? void 0 : s.domain) === "light"
    );
  if (o === "shade")
    return t.kind === "cover" || (s == null ? void 0 : s.domain) === "cover";
  if (o === "environment")
    return (
      t.kind === "sensor" ||
      t.kind === "climate" ||
      (s == null ? void 0 : s.domain) === "sensor" ||
      (s == null ? void 0 : s.domain) === "climate"
    );
  const r =
      typeof (s == null ? void 0 : s.attributes.device_class) == "string"
        ? s.attributes.device_class.toLowerCase()
        : "",
    n =
      `${(s == null ? void 0 : s.name) ?? ""} ${(s == null ? void 0 : s.entityId) ?? ""}`.toLowerCase(),
    a = [...Is, ...Ns].some((d) => r.includes(d) || n.includes(d));
  return (
    ["camera", "lock", "alarm_control_panel", "binary_sensor"].includes(
      t.kind,
    ) ||
    ["camera", "lock", "alarm_control_panel", "binary_sensor"].includes(
      (s == null ? void 0 : s.domain) ?? "",
    ) ||
    a
  );
}
const Ot = (t, s, o) => Math.min(o, Math.max(s, t)),
  Gn = 0.04;
function Rs(t) {
  return Math.max(t, Gn);
}
function gt(t, s = !1) {
  return Math.min(t, Ot(t * 0.86, 1.9, 2.45));
}
function Rt(t) {
  return gt(t);
}
function Fs() {
  return 0.96;
}
function Ln(t, s) {
  const o = Math.max(0.2, s ?? t),
    r = gt(o);
  return Ot((t * r) / o, 0, r);
}
function $n(t, s, o, r) {
  const [n, a, i] = t;
  return s === "floor" ? [n, Rs(Ot(a, 0, 0.08)), i] : [n, Ln(a, r), i];
}
function Xt(t) {
  return t >= 1.55 ? 0.76 : t >= 1.05 ? 0.84 : t >= 0.72 ? 0.92 : 1;
}
function Oe() {
  const t = be((r) => r.gl),
    s = be((r) => r.invalidate),
    o = M.useCallback(() => {
      ((t.shadowMap.needsUpdate = !0), s());
    }, [t, s]);
  return (M.useLayoutEffect(o), o);
}
function Tn() {
  const t = be((s) => s.gl);
  return (
    Oe(),
    M.useLayoutEffect(() => {
      const s = t.shadowMap.autoUpdate;
      return (
        (t.shadowMap.autoUpdate = !1),
        () => {
          t.shadowMap.autoUpdate = s;
        }
      );
    }, [t]),
    null
  );
}
function As(t) {
  const o = new Uint8Array(65536);
  for (let n = 0; n < 128; n++)
    for (let a = 0; a < 128; a++) {
      const i = Math.sin(a * 0.42 + Math.sin((n * Math.PI) / 64) * 2.4),
        d = ((a % 4 < 2 ? 1 : -1) + (n % 4 < 2 ? 1 : -1)) * 12,
        l = t === "fabric" ? 160 + d : 170 + i * 25 + Math.sin(a * 1.7) * 6,
        c = (n * 128 + a) * 4;
      ((o[c] = o[c + 1] = o[c + 2] = l), (o[c + 3] = 255));
    }
  const r = new hr(o, 128, 128);
  return (
    (r.wrapS = r.wrapT = ur),
    r.repeat.set(t === "fabric" ? 8 : 2, t === "fabric" ? 8 : 1),
    (r.magFilter = _t),
    (r.minFilter = fr),
    (r.generateMipmaps = !0),
    (r.needsUpdate = !0),
    r
  );
}
const Ft = As("fabric"),
  In = As("wood");
function Nn(t, s) {
  return t === "cream"
    ? {
        wood: "#bd8c58",
        fabric: "#c8a986",
        linen: "#f8efe2",
        metal: "#9a876e",
        stone: "#e7d6bd",
        accentA: "#d8cbbb",
        accentB: "#c9c5b9",
        screen: "#64736f",
      }
    : s
      ? {
          wood: "#718294",
          fabric: "#8297a7",
          linen: "#c7d2dd",
          metal: "#93a5b7",
          stone: "#b8c8d7",
          accentA: "#abb6c4",
          accentB: "#a2b1c0",
          screen: "#4c6377",
        }
      : {
          wood: "#aebdcd",
          fabric: "#a4b8c9",
          linen: "#edf4fa",
          metal: "#a5b5c3",
          stone: "#d5e1ea",
          accentA: "#ccd3dd",
          accentB: "#bfccd8",
          screen: "#607a91",
        };
}
function W({
  at: t,
  size: s,
  color: o,
  finish: r = "wood",
  radius: n = 0.018,
}) {
  return e.jsx(B, {
    position: t,
    args: s,
    radius: Math.min(n, ...s.map((a) => a * 0.45)),
    smoothness: 3,
    castShadow: !0,
    receiveShadow: !0,
    children: e.jsx("meshStandardMaterial", {
      color: o,
      roughness: r === "fabric" ? 0.94 : r === "wood" ? 0.57 : 0.3,
      metalness: r === "metal" ? 0.72 : 0,
      bumpMap: r === "fabric" ? Ft : r === "wood" ? In : void 0,
      bumpScale: r === "fabric" ? 0.008 : 0.003,
    }),
  });
}
function On(t) {
  return [
    "sofa",
    "bed",
    "dining_table",
    "desk",
    "wardrobe",
    "cabinet",
    "tv_stand",
    "kitchen_island",
    "coffee_table",
    "bookshelf",
    "sideboard",
    "shoe_cabinet",
    "nightstand",
    "side_table",
    "wash_basin",
    "toilet",
    "water_heater",
    "squat_toilet",
    "gas_stove",
    // ha3d-self: F5 新家具
    "fridge",
    "bathroom_cabinet",
    "chest_of_drawers",
    "dog_crate",
  ].includes(t);
}
// ===== ha3d-self: F5 新家具模型 =====
// 椭圆柱（马桶圈、台盆等）：半径 1 的圆柱按 rx/rz 缩放
function ha3dEllipse({ at, rx, rz, height, color, top = 1, bottom = 1, rotation }) {
  return e.jsxs("mesh", {
    position: at,
    rotation,
    scale: [rx, 1, rz],
    castShadow: !0,
    receiveShadow: !0,
    children: [
      e.jsx("cylinderGeometry", { args: [top, bottom, height, 36] }),
      e.jsx("meshStandardMaterial", { color, roughness: 0.3, metalness: 0 }),
    ],
  });
}
// 细杆（笼子钢丝等）：普通盒子，比 RoundedBox 便宜
function ha3dBar({ at, size, color }) {
  return e.jsxs("mesh", {
    position: at,
    castShadow: !0,
    children: [
      e.jsx("boxGeometry", { args: size }),
      e.jsx("meshStandardMaterial", { color, roughness: 0.36, metalness: 0.5 }),
    ],
  });
}
function ha3dFurnitureModel(
  t,
  { r, n, a, wood: d, fabric: l, linen: c, metal: h, stone: u, accentA: f, screen: v },
) {
  if (t === "fridge") {
    const s = T(h, "#ffffff", 0.5),
      o = T(h, "#ffffff", 0.32),
      g = T(h, "#1f2933", 0.35);
    return e.jsxs("group", {
      children: [
        e.jsx(W, {
          at: [0, n * 0.5, a * 0.03],
          size: [r, n, a * 0.92],
          color: s,
          finish: "stone",
          radius: 0.03,
        }),
        e.jsx(W, {
          at: [0, n * 0.69, -a * 0.46],
          size: [r * 0.97, n * 0.58, a * 0.07],
          color: o,
          finish: "stone",
          radius: 0.02,
        }),
        e.jsx(W, {
          at: [0, n * 0.2, -a * 0.46],
          size: [r * 0.97, n * 0.37, a * 0.07],
          color: o,
          finish: "stone",
          radius: 0.02,
        }),
        e.jsx(W, {
          at: [r * 0.38, n * 0.62, -a * 0.52],
          size: [0.024, n * 0.24, 0.032],
          color: g,
          finish: "metal",
        }),
        e.jsx(W, {
          at: [r * 0.38, n * 0.31, -a * 0.52],
          size: [0.024, n * 0.12, 0.032],
          color: g,
          finish: "metal",
        }),
      ],
    });
  }
  if (t === "toilet") {
    const s = T(u, "#ffffff", 0.25),
      o = T(c, "#ffffff", 0.2),
      g = T(u, v, 0.45);
    return e.jsxs("group", {
      children: [
        e.jsx(W, {
          at: [0, n * 0.2, a * 0.02],
          size: [r * 0.4, n * 0.4, a * 0.46],
          color: s,
          finish: "stone",
          radius: 0.05,
        }),
        e.jsx(ha3dEllipse, {
          at: [0, n * 0.47, -a * 0.1],
          rx: r * 0.3,
          rz: a * 0.34,
          bottom: 0.78,
          height: n * 0.16,
          color: s,
        }),
        e.jsx(ha3dEllipse, {
          at: [0, n * 0.565, -a * 0.1],
          rx: r * 0.31,
          rz: a * 0.35,
          height: 0.03,
          color: o,
        }),
        e.jsx(ha3dEllipse, {
          at: [0, n * 0.585, -a * 0.12],
          rx: r * 0.19,
          rz: a * 0.22,
          height: 0.012,
          color: g,
        }),
        e.jsx(ha3dEllipse, {
          at: [0, n * 0.86, a * 0.2],
          rotation: [-Math.PI / 2 + 0.14, 0, 0],
          rx: r * 0.29,
          rz: n * 0.25,
          height: 0.024,
          color: o,
        }),
        e.jsx(W, {
          at: [0, n * 0.73, a * 0.36],
          size: [r * 0.62, n * 0.54, a * 0.24],
          color: o,
          finish: "stone",
          radius: 0.04,
        }),
        e.jsx(W, {
          at: [0, n * 1.005, a * 0.36],
          size: [0.06, 0.014, 0.05],
          color: h,
          finish: "metal",
        }),
      ],
    });
  }
  if (t === "bathroom_cabinet") {
    const s = T(c, "#ffffff", 0.25),
      o = T(v, "#e3eef5", 0.58);
    return e.jsxs("group", {
      children: [
        e.jsx(W, {
          at: [0, n * 0.42, a * 0.02],
          size: [r, n * 0.78, a * 0.94],
          color: d,
        }),
        [-1, 1].map((g) =>
          e.jsxs(
            "group",
            {
              children: [
                e.jsx(W, {
                  at: [g * r * 0.245, n * 0.42, -a * 0.47],
                  size: [r * 0.47, n * 0.7, a * 0.05],
                  color: c,
                }),
                e.jsx(W, {
                  at: [g * r * 0.05, n * 0.56, -a * 0.505],
                  size: [0.016, n * 0.16, 0.022],
                  color: h,
                  finish: "metal",
                }),
              ],
            },
            g,
          ),
        ),
        e.jsx(W, {
          at: [0, n * 0.84, 0],
          size: [r * 1.02, n * 0.06, a],
          color: u,
          finish: "stone",
        }),
        e.jsx(ha3dEllipse, {
          at: [0, n * 0.9, -a * 0.05],
          rx: r * 0.26,
          rz: a * 0.3,
          bottom: 0.7,
          height: n * 0.08,
          color: s,
        }),
        e.jsx(ha3dEllipse, {
          at: [0, n * 0.942, -a * 0.06],
          rx: r * 0.2,
          rz: a * 0.23,
          height: 0.006,
          color: T(u, v, 0.35),
        }),
        e.jsx(W, {
          at: [0, n * 0.96, a * 0.3],
          size: [0.026, n * 0.16, 0.026],
          color: h,
          finish: "metal",
        }),
        e.jsx(W, {
          at: [0, n * 1.03, a * 0.21],
          size: [0.026, 0.022, a * 0.2],
          color: h,
          finish: "metal",
        }),
        e.jsx(W, {
          at: [0, n * 1.56, a * 0.47],
          size: [r * 0.9, n * 0.74, 0.018],
          color: h,
          finish: "metal",
        }),
        e.jsx(W, {
          at: [0, n * 1.56, a * 0.455],
          size: [r * 0.84, n * 0.68, 0.012],
          color: o,
          finish: "stone",
        }),
      ],
    });
  }
  if (t === "chest_of_drawers") {
    const s = T(d, "#000000", 0.18);
    return e.jsxs("group", {
      children: [
        e.jsx(W, {
          at: [0, n * 0.03, 0],
          size: [r * 0.94, n * 0.06, a * 0.9],
          color: s,
        }),
        e.jsx(W, {
          at: [0, n * 0.52, a * 0.02],
          size: [r, n * 0.92, a * 0.94],
          color: d,
        }),
        [0, 1, 2, 3].map((g) => {
          const o = n * (0.17 + g * 0.225);
          return e.jsxs(
            "group",
            {
              children: [
                e.jsx(W, {
                  at: [0, o, -a * 0.475],
                  size: [r * 0.92, n * 0.2, a * 0.05],
                  color: g % 2 ? u : c,
                }),
                e.jsx(W, {
                  at: [0, o, -a * 0.515],
                  size: [r * 0.24, 0.02, 0.024],
                  color: h,
                  finish: "metal",
                }),
              ],
            },
            g,
          );
        }),
        e.jsx(W, {
          at: [0, n * 0.99, 0],
          size: [r * 1.02, n * 0.03, a],
          color: d,
        }),
      ],
    });
  }
  if (t === "dog_crate") {
    const s = T(h, "#1f2933", 0.42),
      o = T(h, "#2a3138", 0.2),
      g = n * 0.52,
      _ = n * 0.88,
      k = [];
    // 立柱、顶框、腰线
    for (const E of [-1, 1])
      for (const P of [-1, 1])
        k.push({ at: [E * r * 0.48, g, P * a * 0.48], size: [0.02, _, 0.02] });
    for (const E of [-1, 1]) {
      k.push({ at: [0, n * 0.96, E * a * 0.48], size: [r, 0.02, 0.02] });
      k.push({ at: [E * r * 0.48, n * 0.96, 0], size: [0.02, 0.02, a] });
      k.push({ at: [E * r * 0.48, g, 0], size: [0.012, 0.012, a] });
    }
    k.push({ at: [0, g, a * 0.48], size: [r, 0.012, 0.012] });
    // 顶面、背面、两侧的钢丝
    for (const E of [-0.27, 0, 0.27])
      k.push({ at: [0, n * 0.96, E * a], size: [r * 0.96, 0.01, 0.01] });
    for (const E of [-0.32, -0.16, 0, 0.16, 0.32])
      k.push({ at: [E * r, g, a * 0.48], size: [0.01, _, 0.01] });
    for (const E of [-1, 1])
      for (const P of [-0.24, 0, 0.24])
        k.push({ at: [E * r * 0.48, g, P * a], size: [0.01, _, 0.01] });
    // 正面：门两侧的固定钢丝
    for (const E of [-0.4, -0.32, 0.32, 0.4])
      k.push({ at: [E * r, g, -a * 0.48], size: [0.01, _, 0.01] });
    k.push({ at: [0, g, -a * 0.48], size: [r, 0.012, 0.012] });
    // 前门：门框 + 竖向钢丝
    const N = [
      { at: [-r * 0.24, n * 0.5, 0], size: [0.018, n * 0.78, 0.018] },
      { at: [r * 0.24, n * 0.5, 0], size: [0.018, n * 0.78, 0.018] },
      { at: [0, n * 0.89, 0], size: [r * 0.48, 0.018, 0.018] },
      { at: [0, n * 0.11, 0], size: [r * 0.48, 0.018, 0.018] },
      ...[-0.12, 0, 0.12].map((E) => ({
        at: [E * r, n * 0.5, 0],
        size: [0.01, n * 0.78, 0.01],
      })),
    ];
    return e.jsxs("group", {
      children: [
        e.jsx(W, {
          at: [0, n * 0.04, 0],
          size: [r, n * 0.08, a],
          color: o,
          finish: "stone",
          radius: 0.012,
        }),
        e.jsx(W, {
          at: [0, n * 0.1, a * 0.04],
          size: [r * 0.8, n * 0.05, a * 0.78],
          color: l,
          finish: "fabric",
          radius: 0.02,
        }),
        k.map((E, P) => e.jsx(ha3dBar, { ...E, color: s }, P)),
        e.jsxs("group", {
          position: [0, 0, -a * 0.5],
          children: [
            N.map((E, P) => e.jsx(ha3dBar, { ...E, color: s }, P)),
            e.jsx(W, {
              at: [r * 0.2, n * 0.5, -0.012],
              size: [0.05, 0.035, 0.022],
              color: f,
              finish: "stone",
            }),
          ],
        }),
      ],
    });
  }
  return null;
}
function Rn({ item: t, night: s, visualStyle: o = "glass" }) {
  const { width: r, height: n, depth: a, kind: i } = t,
    {
      wood: d,
      fabric: l,
      linen: c,
      metal: h,
      stone: u,
      accentA: f,
      accentB: j,
      screen: v,
    } = Nn(o, s),
    y = (b) =>
      [-1, 1].flatMap((w) =>
        [-1, 1].map((S) =>
          e.jsx(
            W,
            {
              at: [w * r * 0.4, b / 2, S * a * 0.36],
              size: [r * 0.035, b, a * 0.065],
              color: h,
              finish: "metal",
            },
            `${w}-${S}`,
          ),
        ),
      );
  if (i === "sofa")
    return e.jsxs("group", {
      children: [
        y(n * 0.15),
        e.jsx(W, {
          at: [0, n * 0.24, 0],
          size: [r * 0.96, n * 0.2, a * 0.9],
          color: l,
          finish: "fabric",
        }),
        e.jsx(W, {
          at: [0, n * 0.65, a * 0.36],
          size: [r * 0.94, n * 0.65, a * 0.19],
          color: l,
          finish: "fabric",
          radius: 0.065,
        }),
        [-1, 1].map((b) =>
          e.jsx(
            W,
            {
              at: [b * r * 0.445, n * 0.46, 0],
              size: [r * 0.11, n * 0.49, a * 0.94],
              color: l,
              finish: "fabric",
              radius: 0.065,
            },
            b,
          ),
        ),
        [-1, 1].map((b) =>
          e.jsxs(
            "group",
            {
              children: [
                e.jsx(W, {
                  at: [b * r * 0.197, n * 0.43, -a * 0.08],
                  size: [r * 0.381, n * 0.2, a * 0.68],
                  color: c,
                  finish: "fabric",
                  radius: 0.055,
                }),
                e.jsx("group", {
                  position: [b * r * 0.197, n * 0.72, a * 0.21],
                  rotation: [-0.12, 0, 0],
                  children: e.jsx(W, {
                    at: [0, 0, 0],
                    size: [r * 0.38, n * 0.38, a * 0.19],
                    color: c,
                    finish: "fabric",
                    radius: 0.07,
                  }),
                }),
                e.jsx("group", {
                  position: [b * r * 0.3, n * 0.65, -a * 0.02],
                  rotation: [0.12, b * 0.15, b * 0.2],
                  children: e.jsx(W, {
                    at: [0, 0, 0],
                    size: [r * 0.15, n * 0.28, a * 0.15],
                    color: b === 1 ? f : j,
                    finish: "fabric",
                    radius: 0.06,
                  }),
                }),
              ],
            },
            b,
          ),
        ),
      ],
    });
  if (i === "bed")
    return e.jsxs("group", {
      children: [
        y(n * 0.13),
        e.jsx(W, {
          at: [0, n * 0.25, 0],
          size: [r, n * 0.25, a * 0.97],
          color: d,
        }),
        e.jsx(W, {
          at: [0, n * 0.62, -a * 0.46],
          size: [r, n * 0.76, a * 0.08],
          color: l,
          finish: "fabric",
          radius: 0.045,
        }),
        e.jsx(W, {
          at: [0, n * 0.44, 0],
          size: [r * 0.95, n * 0.2, a * 0.88],
          color: c,
          finish: "fabric",
          radius: 0.07,
        }),
        e.jsx(W, {
          at: [0, n * 0.565, a * 0.13],
          size: [r * 0.97, n * 0.12, a * 0.65],
          color: c,
          finish: "fabric",
          radius: 0.045,
        }),
        e.jsx(W, {
          at: [0, n * 0.635, a * 0.28],
          size: [r * 0.98, n * 0.04, a * 0.25],
          color: j,
          finish: "fabric",
        }),
        [-1, 1].map((b) =>
          e.jsx(
            W,
            {
              at: [b * r * 0.235, n * 0.61, -a * 0.29],
              size: [r * 0.4, n * 0.17, a * 0.19],
              color: c,
              finish: "fabric",
              radius: 0.07,
            },
            b,
          ),
        ),
      ],
    });
  if (i === "coffee_table" || i === "desk")
    return e.jsxs("group", {
      children: [
        y(n * 0.9),
        e.jsx(W, {
          at: [0, n * 0.95, 0],
          size: [r, n * 0.1, a],
          color: i === "desk" ? d : u,
          finish: i === "desk" ? "wood" : "stone",
          radius: 0.045,
        }),
        i === "coffee_table"
          ? e.jsxs(e.Fragment, {
              children: [
                e.jsx(W, {
                  at: [-r * 0.16, n * 1.025, 0],
                  size: [r * 0.25, n * 0.05, a * 0.33],
                  color: j,
                }),
                e.jsx(W, {
                  at: [-r * 0.13, n * 1.072, 0],
                  size: [r * 0.23, n * 0.04, a * 0.3],
                  color: c,
                }),
                e.jsxs("mesh", {
                  position: [r * 0.22, n * 1.12, 0],
                  children: [
                    e.jsx("cylinderGeometry", {
                      args: [a * 0.07, a * 0.06, n * 0.22, 24],
                    }),
                    e.jsx("meshStandardMaterial", {
                      color: u,
                      roughness: 0.28,
                    }),
                  ],
                }),
              ],
            })
          : e.jsxs(e.Fragment, {
              children: [
                e.jsx(W, {
                  at: [0, n + 0.02, -a * 0.2],
                  size: [r * 0.22, 0.025, a * 0.2],
                  color: h,
                  finish: "metal",
                }),
                e.jsx(W, {
                  at: [0, n + 0.1, -a * 0.23],
                  size: [0.035, 0.17, 0.035],
                  color: h,
                  finish: "metal",
                }),
                e.jsx(W, {
                  at: [0, n + 0.28, -a * 0.23],
                  size: [r * 0.48, 0.3, 0.035],
                  color: h,
                  finish: "metal",
                }),
                e.jsx(W, {
                  at: [0, n + 0.28, -a * 0.208],
                  size: [r * 0.45, 0.27, 0.008],
                  color: v,
                  finish: "stone",
                }),
                e.jsx(W, {
                  at: [0, n + 0.018, a * 0.12],
                  size: [r * 0.3, 0.025, a * 0.19],
                  color: j,
                }),
              ],
            }),
      ],
    });
  if (i === "dining_table" || i === "kitchen_island")
    return e.jsxs("group", {
      children: [
        e.jsx(W, {
          at: [0, n * 0.78, 0],
          size: [r, n * 0.18, a],
          color: d,
          radius: 0.04,
        }),
        y(n * 0.72),
        i === "kitchen_island" &&
          e.jsxs(e.Fragment, {
            children: [
              e.jsx(W, {
                at: [0, n * 0.42, 0],
                size: [r * 0.86, n * 0.65, a * 0.8],
                color: j,
              }),
              e.jsx(W, {
                at: [r * 0.2, n * 0.89, -a * 0.12],
                size: [r * 0.2, 0.012, a * 0.24],
                color: u,
                finish: "stone",
              }),
            ],
          }),
      ],
    });
  if (i === "tv_stand" || i === "side_table")
    return e.jsxs("group", {
      children: [
        e.jsx(W, { at: [0, n * 0.42, 0], size: [r, n * 0.75, a], color: d }),
        e.jsx(W, {
          at: [0, n * 0.84, 0],
          size: [r * 1.04, 0.06, a * 1.04],
          color: u,
          finish: "stone",
        }),
        i === "tv_stand" &&
          e.jsxs(e.Fragment, {
            children: [
              e.jsx(W, {
                at: [0, n * 0.58, -a * 0.52],
                size: [r * 0.52, n * 0.15, 0.012],
                color: v,
              }),
              e.jsx(W, {
                at: [0, n * 0.58, -a * 0.54],
                size: [0.018, n * 0.36, 0.014],
                color: h,
                finish: "metal",
              }),
            ],
          }),
      ],
    });
  if (i === "bookshelf")
    return e.jsxs("group", {
      children: [
        e.jsx(W, {
          at: [0, n * 0.5, a * 0.4],
          size: [r, n, a * 0.14],
          color: d,
        }),
        [-1, 1].map((b) =>
          e.jsx(
            W,
            { at: [b * r * 0.46, n * 0.5, 0], size: [0.06, n, a], color: d },
            b,
          ),
        ),
        [0.2, 0.4, 0.6, 0.8].map((b) =>
          e.jsx(W, { at: [0, n * b, 0], size: [r, 0.045, a], color: d }, b),
        ),
      ],
    });
  // ===== ha3d-self: F5 新家具模型（冰箱、马桶、浴室柜、斗柜、狗笼子；正面朝 -z） =====
  const ha3dModel = ha3dFurnitureModel(i, {
    r,
    n,
    a,
    wood: d,
    fabric: l,
    linen: c,
    metal: h,
    stone: u,
    accentA: f,
    screen: v,
  });
  if (ha3dModel) return ha3dModel;
  if (
    [
      "wash_basin",
      "toilet",
      "squat_toilet",
      "gas_stove",
      "water_heater",
    ].includes(i)
  )
    return e.jsxs("group", {
      children: [
        e.jsx(W, {
          at: [0, Math.max(0.04, n * 0.42), 0],
          size: [r * 0.9, Math.max(0.08, n * 0.7), a * 0.82],
          color: u,
          finish: "stone",
          radius: 0.06,
        }),
        e.jsx(W, {
          at: [0, n * 0.82, a * 0.02],
          size: [r * 0.92, Math.max(0.04, n * 0.12), a * 0.86],
          color: c,
          finish: "stone",
          radius: 0.05,
        }),
        i === "gas_stove" &&
          e.jsxs(e.Fragment, {
            children: [
              e.jsx(W, {
                at: [0, n * 0.92, 0],
                size: [r * 0.82, 0.02, a * 0.7],
                color: v,
                finish: "stone",
              }),
              [-1, 1].map((b) =>
                e.jsxs(
                  "mesh",
                  {
                    position: [b * r * 0.2, n * 0.945, 0],
                    rotation: [-Math.PI / 2, 0, 0],
                    children: [
                      e.jsx("torusGeometry", {
                        args: [r * 0.12, 0.012, 8, 24],
                      }),
                      e.jsx("meshStandardMaterial", {
                        color: h,
                        metalness: 0.5,
                        roughness: 0.3,
                      }),
                    ],
                  },
                  b,
                ),
              ),
            ],
          }),
        i === "water_heater" &&
          e.jsx(W, {
            at: [0, n * 0.92, -a * 0.05],
            size: [r * 0.7, 0.025, a * 0.5],
            color: j,
            finish: "metal",
          }),
      ],
    });
  const x =
    i === "nightstand" ? 1 : Math.max(2, Math.min(4, Math.round(r / 0.5)));
  return e.jsxs("group", {
    children: [
      e.jsx(W, {
        at: [0, n * 0.07, 0],
        size: [r * 0.87, n * 0.14, a * 0.82],
        color: h,
      }),
      e.jsx(W, {
        at: [0, n * 0.55, a * 0.01],
        size: [r, n * 0.9, a * 0.94],
        color: d,
      }),
      Array.from({ length: x }, (b, w) =>
        e.jsxs(
          "group",
          {
            children: [
              e.jsx(W, {
                at: [((w - (x - 1) / 2) * r) / x, n * 0.555, -a * 0.48],
                size: [r / x - Math.min(0.012, r * 0.015), n * 0.87, a * 0.06],
                color: w % 2 ? u : c,
              }),
              e.jsx(W, {
                at: [
                  ((w - (x - 1) / 2) * r) / x + (r / x) * 0.3,
                  n * 0.57,
                  -a * 0.522,
                ],
                size: [0.014, Math.min(0.23, n * 0.23), 0.022],
                color: h,
                finish: "metal",
              }),
            ],
          },
          w,
        ),
      ),
      e.jsx(W, {
        at: [0, n * 0.985, 0],
        size: [r * 1.015, n * 0.03, a],
        color: d,
      }),
    ],
  });
}
function Fn(t) {
  return t === "cream"
    ? {
        shell: "#faf3e7",
        trim: "#b8a58e",
        dark: "#655a4f",
        lens: "#6b8790",
        reflection: "#f5dfb8",
      }
    : {
        shell: "#f4f8fc",
        trim: "#b9c8d5",
        dark: "#465866",
        lens: "#527e9b",
        reflection: "#d9efff",
      };
}
function An(t, s) {
  if (!t) return s.dark;
  const o = t.toLowerCase();
  return [
    "#111e26",
    "#12242e",
    "#182327",
    "#213139",
    "#25373e",
    "#273136",
    "#303b40",
    "#314349",
    "#333c40",
    "#344047",
    "#38474e",
    "#3c474b",
    "#203e4d",
    "#25363d",
  ].includes(o)
    ? s.dark
    : [
          "#95bac5",
          "#acb7ba",
          "#a5afb3",
          "#9eaaad",
          "#69777a",
          "#69777c",
          "#6d7b7e",
          "#78888e",
          "#7b929a",
          "#8d9a9d",
          "#8fa0a7",
        ].includes(o)
      ? s.trim
      : [
            "#d3dadb",
            "#dde3e2",
            "#dfe5e6",
            "#d7dcdd",
            "#a5adb2",
            "#cbd2d5",
            "#d9e3e6",
            "#f4f7f5",
          ].includes(o)
        ? s.shell
        : ["#95bac5", "#527e9b", "#203e4d"].includes(o)
          ? s.lens
          : ["#95bac5", "#cbeaff"].includes(o)
            ? s.reflection
            : t;
}
function Bn({
  modelId: t,
  unavailable: s,
  active: o,
  color: r,
  visualStyle: n = "glass",
}) {
  const a = Fn(n),
    d = s ? 0.42 : 1,
    l = (j = a.dark, v = !1, y = !1) => {
      const x = An(j, a);
      return e.jsx("meshPhysicalMaterial", {
        color: x,
        roughness: y ? 0.91 : v ? 0.3 : 0.48,
        metalness: v ? 0.65 : 0.02,
        clearcoat: v || y ? 0 : 0.18,
        bumpMap: y ? Ft : void 0,
        bumpScale: 0.0018,
        transparent: s,
        opacity: d,
      });
    },
    c = (j, v, y, x = !1, b = !1) =>
      e.jsx(B, {
        position: j,
        args: v,
        radius: Math.min(...v) * 0.3,
        smoothness: 2,
        children: l(y, x, b),
      }),
    h = (j, v = 0.006) =>
      e.jsxs("mesh", {
        position: j,
        children: [
          e.jsx("sphereGeometry", { args: [v, 12, 8] }),
          e.jsx("meshStandardMaterial", {
            color: o && !s ? r : "#6f787c",
            emissive: r,
            emissiveIntensity: o && !s ? 0.8 : 0,
            roughness: 0.25,
          }),
        ],
      }),
    u = (j, v, y, x = 5) =>
      e.jsxs("group", {
        position: j,
        children: [
          c([0, 0, 0], [v, y, 0.008], "#273136"),
          Array.from({ length: x }, (b, w) =>
            e.jsx(
              "group",
              {
                children: c(
                  [0, (w / (x - 1) - 0.5) * y * 0.84, 0.008],
                  [v * 0.95, (y / x) * 0.32, 0.009],
                  "#9eaaad",
                  !0,
                ),
              },
              w,
            ),
          ),
        ],
      }),
    f = (j, v, y = [0, 0, 0]) =>
      e.jsxs("group", {
        position: j,
        rotation: y,
        children: [
          e.jsxs("mesh", {
            children: [
              e.jsx("torusGeometry", { args: [v, v * 0.16, 8, 32] }),
              l(a.trim, !0),
            ],
          }),
          e.jsxs("mesh", {
            position: [0, 0, 0.001],
            children: [
              e.jsx("circleGeometry", { args: [v * 0.86, 32] }),
              e.jsx("meshPhysicalMaterial", {
                color: a.dark,
                roughness: 0.12,
                metalness: 0.2,
                clearcoat: 1,
                transparent: s,
                opacity: d,
              }),
            ],
          }),
          e.jsxs("mesh", {
            position: [0, 0, 0.002],
            children: [
              e.jsx("circleGeometry", { args: [v * 0.46, 24] }),
              l(a.lens),
            ],
          }),
          e.jsxs("mesh", {
            position: [-v * 0.22, v * 0.25, 0.003],
            children: [
              e.jsx("circleGeometry", { args: [v * 0.16, 16] }),
              l(a.reflection),
            ],
          }),
        ],
      });
  return t.startsWith("camera.")
    ? t === "camera.bullet"
      ? e.jsxs("group", {
          children: [
            f([0.137, 0.016, 0], 0.043, [0, Math.PI / 2, 0]),
            c([-0.16, 0.032, 0], [0.024, 0.12, 0.12], "#a5afb3", !0),
          ],
        })
      : t === "camera.dome"
        ? e.jsxs("group", {
            children: [f([0, -0.056, 0.103], 0.035), h([0.062, -0.04, 0.09])],
          })
        : t === "camera.doorbell"
          ? e.jsxs("group", {
              children: [
                c([0, 0.065, 0.032], [0.12, 0.15, 0.01], "#303b40"),
                f([0, 0.076, 0.045], 0.033),
                u([0, -0.126, 0.046], 0.075, 0.025, 3),
                h([0, -0.065, 0.04], 0.009),
              ],
            })
          : e.jsxs("group", {
              children: [
                f([0, 0.016, 0.12], 0.044),
                c([0, -0.085, -0.025], [0.035, 0.09, 0.035], "#a5afb3", !0),
                h([0.09, 0.02, 0.07]),
              ],
            })
    : t === "media_player.speaker"
      ? e.jsxs("group", {
          children: [
            c([0, 0.24, 0.114], [0.217, 0.44, 0.014], "#333c40", !1, !0),
            c([0, 0.015, 0], [0.22, 0.023, 0.2], "#566268", !0),
            h([0, 0.435, 0.125]),
          ],
        })
      : t === "media_player.tv"
        ? e.jsxs("group", {
            children: [
              c([0, 0.12, 0.027], [0.53, 0.295, 0.012], "#182327"),
              c(
                [0, 0.123, 0.035],
                [0.505, 0.265, 0.006],
                o ? "#304e5b" : "#111a1e",
              ),
              h([0.21, -0.023, 0.037], 0.003),
            ],
          })
        : t === "vacuum.robot"
          ? e.jsxs("group", {
              children: [
                e.jsxs("mesh", {
                  position: [0, 0.047, 0],
                  children: [
                    e.jsx("cylinderGeometry", {
                      args: [0.261, 0.258, 0.035, 64],
                    }),
                    l("#344047"),
                  ],
                }),
                e.jsxs("mesh", {
                  position: [0, 0.111, 0],
                  children: [
                    e.jsx("cylinderGeometry", {
                      args: [0.222, 0.222, 0.006, 64],
                    }),
                    l("#d3dadb"),
                  ],
                }),
                e.jsxs("mesh", {
                  position: [0.055, 0.135, -0.025],
                  children: [
                    e.jsx("cylinderGeometry", {
                      args: [0.061, 0.061, 0.019, 32],
                    }),
                    l("#38474e"),
                  ],
                }),
                c([0, 0.05, 0.249], [0.14, 0.022, 0.009], "#12242e"),
                h([-0.08, 0.118, 0.06]),
              ],
            })
          : [
                "climate.wall_ac",
                "climate.floor_ac",
                "climate.central_ac",
              ].includes(t)
            ? null
            : t === "climate.thermostat"
              ? e.jsxs("group", {
                  children: [f([0, 0.035, 0.039], 0.09), h([0, -0.11, 0.044])],
                })
              : t.startsWith("sensor.")
                ? ["sensor.light_level", "sensor.wall"].includes(t)
                  ? e.jsx("group", {
                      children: f(
                        [
                          0,
                          t === "sensor.wall" ? 0 : -0.044,
                          t === "sensor.wall" ? 0.038 : 0,
                        ],
                        0.062,
                        t === "sensor.wall" ? [0, 0, 0] : [Math.PI / 2, 0, 0],
                      ),
                    })
                  : t === "sensor.pm25" || t === "sensor.humidity"
                    ? e.jsxs("group", {
                        children: [
                          f(
                            [0, 0.02, t === "sensor.pm25" ? 0.055 : 0.08],
                            0.075,
                          ),
                          h([
                            0.045,
                            -0.01,
                            t === "sensor.pm25" ? 0.059 : 0.084,
                          ]),
                        ],
                      })
                    : e.jsxs("group", {
                        children: [
                          c([0, 0.055, 0.047], [0.2, 0.095, 0.008], "#314349"),
                          u([0, -0.085, 0.048], 0.12, 0.03, 3),
                          h([0.09, -0.035, 0.05]),
                        ],
                      })
                : t === "binary_sensor.door"
                  ? e.jsxs("group", {
                      children: [
                        c([-0.045, 0, 0.031], [0.075, 0.23, 0.008], "#dde3e2"),
                        h([-0.045, 0.09, 0.038], 0.005),
                      ],
                    })
                  : t.startsWith("binary_sensor.")
                    ? e.jsx("group", {
                        children:
                          t === "binary_sensor.wall"
                            ? u([0, -0.065, 0.035], 0.14, 0.045, 4)
                            : e.jsxs("group", {
                                rotation: [
                                  t === "binary_sensor.water"
                                    ? -Math.PI / 2
                                    : Math.PI / 2,
                                  0,
                                  0,
                                ],
                                children: [
                                  f(
                                    [
                                      0,
                                      0,
                                      t === "binary_sensor.water"
                                        ? 0.078
                                        : 0.05,
                                    ],
                                    t === "binary_sensor.motion"
                                      ? 0.072
                                      : 0.045,
                                  ),
                                  [0, 1, 2, 3, 4, 5, 6, 7].map((j) =>
                                    e.jsx(
                                      "group",
                                      {
                                        rotation: [0, 0, (j * Math.PI) / 4],
                                        children: c(
                                          [
                                            0.11,
                                            0,
                                            t === "binary_sensor.water"
                                              ? 0.075
                                              : 0.049,
                                          ],
                                          [0.028, 0.006, 0.008],
                                          "#69777a",
                                        ),
                                      },
                                      j,
                                    ),
                                  ),
                                ],
                              }),
                      })
                    : t === "fan.floor"
                      ? e.jsxs("group", {
                          children: [
                            c(
                              [0, 0.067, 0.1],
                              [0.09, 0.01, 0.07],
                              "#69777c",
                              !0,
                            ),
                            h([0, 0.077, 0.11]),
                          ],
                        })
                      : t === "fan.ceiling"
                        ? e.jsx("group", {
                            children: e.jsxs("mesh", {
                              position: [0, 0.013, 0],
                              children: [
                                e.jsx("cylinderGeometry", {
                                  args: [0.134, 0.134, 0.018, 40],
                                }),
                                l("#69777c", !0),
                              ],
                            }),
                          })
                        : t === "fan.tower"
                          ? e.jsx("group", { children: h([0, 0.07, 0.16]) })
                          : t.startsWith("switch.")
                            ? e.jsx("group", {
                                children: c(
                                  [0, -0.16, 0.041],
                                  [0.11, 0.004, 0.005],
                                  "#6d7b7e",
                                  !0,
                                ),
                              })
                            : t === "lock.door" || t === "alarm.panel"
                              ? e.jsxs("group", {
                                  children: [
                                    c(
                                      [0, 0.11, 0.064],
                                      [
                                        t === "lock.door" ? 0.095 : 0.22,
                                        0.09,
                                        0.01,
                                      ],
                                      "#213139",
                                    ),
                                    h([0, 0.14, 0.071]),
                                    t === "lock.door" &&
                                      c(
                                        [0.035, -0.045, 0.072],
                                        [0.16, 0.022, 0.026],
                                        "#78888e",
                                        !0,
                                      ),
                                  ],
                                })
                              : t === "custom.point"
                                ? e.jsxs("group", {
                                    children: [
                                      e.jsxs("mesh", {
                                        rotation: [Math.PI / 2, 0, 0],
                                        children: [
                                          e.jsx("torusGeometry", {
                                            args: [0.145, 0.006, 8, 32],
                                          }),
                                          l("#7b929a", !0),
                                        ],
                                      }),
                                      h([0, 0.13, 0.078]),
                                    ],
                                  })
                                : null;
}
function Hn({ modelId: t, unavailable: s, visualStyle: o = "glass" }) {
  if (t === "light.strip" || t === "light.ceiling_panel") return null;
  const r =
      t === "light.downlight"
        ? 0.085
        : t === "light.chandelier"
          ? 0.29
          : t === "light.floor_lamp"
            ? 0.245
            : t === "light.wall_sconce"
              ? 0.17
              : t === "light.ceiling_round"
                ? 0.25
                : 0.3,
    n = t === "light.chandelier" ? -0.519 : t === "light.floor_lamp" ? 1.05 : 0;
  return e.jsxs("mesh", {
    position: [0, n, 0],
    rotation: [t === "light.wall_sconce" ? 0 : Math.PI / 2, 0, 0],
    children: [
      e.jsx("torusGeometry", { args: [r, 0.004, 8, 48] }),
      e.jsx("meshStandardMaterial", {
        color: o === "cream" ? "#d9cdb9" : "#d6dfdf",
        roughness: 0.44,
        metalness: 0.18,
        transparent: s,
        opacity: s ? 0.35 : 1,
      }),
    ],
  });
}
function bt(t, s, o) {
  return o ||
    !["cool", "heat", "dry", "fan_only", "auto", "heat_cool"].includes(t)
    ? !1
    : typeof s == "string"
      ? [
          "cooling",
          "heating",
          "drying",
          "fan",
          "preheating",
          "defrosting",
        ].includes(s)
      : !0;
}
function At(t) {
  const s = t == null ? void 0 : t.state.trim().toLowerCase();
  return !s || ["unknown", "unavailable", "offline"].includes(s)
    ? {
        active: !1,
        color: "#a3a9ad",
        label: t ? (!s || s === "unknown" ? "未知" : "离线") : "未同步",
      }
    : ["on", "occupied", "detected", "home", "open", "true"].includes(s)
      ? { active: !0, color: "#58a889", label: "有人" }
      : [
            "off",
            "clear",
            "not_occupied",
            "not_home",
            "closed",
            "false",
          ].includes(s)
        ? { active: !1, color: "#b6c6c1", label: "无人" }
        : { active: !1, color: "#a3a9ad", label: "未知" };
}
const re = 1e-7;
function Dn(t, s) {
  const o = [],
    r = [];
  return (
    t.forEach((n, a) => {
      const i = t[(a + 1) % t.length],
        d = s.distanceToPoint(n),
        l = s.distanceToPoint(i);
      if (
        (d <= re && o.push(n),
        d >= -re && r.push(n),
        (d > re && l < -re) || (d < -re && l > re))
      ) {
        const c = n.clone().lerp(i, d / (d - l));
        (o.push(c), r.push(c));
      }
    }),
    { inside: o, outside: r }
  );
}
function Wn(t, s, o) {
  if (!new ls().setFromPoints(t.points).intersectsBox(s.bounds)) return [t];
  let r = t.points;
  const n = [];
  for (const a of s.planes) {
    const i = r.map((l) => a.distanceToPoint(l));
    if (i.every((l) => Math.abs(l) <= re)) {
      if (t.normal.dot(a.normal) > 0 && o) return [t];
      continue;
    }
    if (i.every((l) => l >= -re))
      return (n.push({ points: r, normal: t.normal }), n);
    if (i.every((l) => l <= re)) continue;
    const d = Dn(r, a);
    if (
      (d.outside.length >= 3 && n.push({ points: d.outside, normal: t.normal }),
      (r = d.inside),
      r.length < 3)
    )
      return n;
  }
  return n;
}
function Vn({ wall: t, height: s, openings: o }, r) {
  const n = Math.hypot(t.end[0] - t.start[0], t.end[1] - t.start[1]),
    a = (t.thickness * r) / 2;
  if (n < re || s < re || a < re) return [];
  const i = new J((t.end[0] - t.start[0]) / n, 0, (t.end[1] - t.start[1]) / n),
    d = new J(-i.z, 0, i.x),
    l =
      s > 1
        ? o
            .filter((f) => f.type === "door" || f.type === "window")
            .map((f) => ({
              left: Math.max(0, f.offset - f.width / 2),
              right: Math.min(n, f.offset + f.width / 2),
              bottom: Math.max(0, f.bottom),
              top: Math.min(s, f.bottom + f.height),
            }))
            .filter((f) => f.right > f.left && f.top > f.bottom)
        : [],
    c = [...new Set([-a, n + a, ...l.flatMap((f) => [f.left, f.right])])].sort(
      (f, j) => f - j,
    ),
    h = [...new Set([0, s, ...l.flatMap((f) => [f.bottom, f.top])])].sort(
      (f, j) => f - j,
    ),
    u = [];
  for (let f = 0; f < c.length - 1; f++)
    for (let j = 0; j < h.length - 1; j++) {
      const v = (c[f] + c[f + 1]) / 2,
        y = (h[j] + h[j + 1]) / 2;
      if (l.some((w) => v > w.left && v < w.right && y > w.bottom && y < w.top))
        continue;
      const x = [
          [c[f], h[j], -a],
          [c[f + 1], h[j], -a],
          [c[f + 1], h[j + 1], -a],
          [c[f], h[j + 1], -a],
          [c[f], h[j], a],
          [c[f + 1], h[j], a],
          [c[f + 1], h[j + 1], a],
          [c[f], h[j + 1], a],
        ].map(([w, S, G]) =>
          new J(t.start[0], S, t.start[1])
            .addScaledVector(i, w)
            .addScaledVector(d, G),
        ),
        b = [
          [0, 3, 2, 1],
          [4, 5, 6, 7],
          [0, 4, 7, 3],
          [1, 2, 6, 5],
          [0, 1, 5, 4],
          [3, 7, 6, 2],
        ].map((w) => {
          const S = w.map((L) => x[L]),
            G = new J()
              .subVectors(S[1], S[0])
              .cross(new J().subVectors(S[2], S[0]))
              .normalize();
          return { points: S, normal: G };
        });
      u.push({
        faces: b,
        planes: b.map((w) =>
          new pr().setFromNormalAndCoplanarPoint(w.normal, w.points[0]),
        ),
        bounds: new ls().setFromPoints(x),
      });
    }
  return u;
}
function Un(t, s) {
  const o = t.flatMap((i) => Vn(i, s)),
    r = [],
    n = [];
  o.forEach((i, d) => {
    let l = i.faces;
    o.forEach((c, h) => {
      d === h ||
        !i.bounds.intersectsBox(c.bounds) ||
        (l = l.flatMap((u) => Wn(u, c, d < h)));
    });
    for (const c of l)
      for (let h = 1; h < c.points.length - 1; h++) {
        const u = [c.points[0], c.points[h], c.points[h + 1]];
        u[1].clone().sub(u[0]).cross(u[2].clone().sub(u[0])).lengthSq() <
          re * re ||
          u.forEach((j) => {
            (r.push(...j.toArray()), n.push(...c.normal.toArray()));
          });
      }
  });
  const a = new Ze();
  return (
    a.setAttribute("position", new nt(r, 3)),
    a.setAttribute("normal", new nt(n, 3)),
    a.computeBoundingSphere(),
    a
  );
}
const Bs = M.createContext("glass"),
  oe = () => M.useContext(Bs),
  me = (t, s) => Nt(t, s, oe()),
  Hs = (t, s, o) => {
    var r;
    return (
      ((r = t.materials.find((n) => n.id === s)) == null ? void 0 : r.color) ??
      o
    );
  },
  Zt = new Map(),
  T = (t, s, o) => {
    const r = `${t}|${s}|${o}`,
      n = Zt.get(r);
    if (n) return n;
    const a = `#${new Te(t).lerp(new Te(s), o).getHexString()}`;
    return (Zt.set(r, a), a);
  },
  ot = (t, s, o) => Math.min(o, Math.max(s, t)),
  Kn = "#f7fbff",
  qn = 0.2,
  Xn = (t, s = !1) => (s ? "#8d97a5" : T(t, "#fbfdff", 0.78)),
  Zn = (t, s = !1) => (s ? "#697382" : T(t, "#dce7f2", 0.46)),
  et = (t) => T(t, "#eef4f8", 0.22),
  Bt = (t) => T(t, "#ffffff", 0.62),
  mt = (t, s) => ({
    color: t ? "#40536c" : s ? "#6f6252" : Kn,
    opacity: t ? 0.16 : s ? 0.18 : qn,
    threshold: t ? 18 : s ? 22 : 24,
  }),
  Yn = "#ffd15f",
  Ds = (t) => T(Yn, t, 0.12);
function Ht({ children: t }) {
  const s = M.useRef(null);
  return (
    M.useLayoutEffect(() => {
      var o;
      (o = s.current) == null ||
        o.traverse((r) => {
          r instanceof at && ((r.castShadow = !1), (r.receiveShadow = !1));
        });
    }),
    e.jsx("group", { ref: s, children: t })
  );
}
function Ws({ target: t, color: s, active: o, selected: r, intensity: n = 1 }) {
  return (
    M.useLayoutEffect(() => {
      const a = t.current;
      if (!a || !o) return;
      const i = r
          ? [
              { thickness: 0.018, opacity: 0.92 },
              { thickness: 0.046, opacity: 0.2 },
            ]
          : [
              { thickness: 0.014, opacity: 0.68 },
              { thickness: 0.034, opacity: 0.12 },
            ],
        d = [];
      a.traverse((c) => {
        c instanceof at && !c.userData.deviceEdgeGlow && d.push(c);
      });
      const l = [];
      for (const c of d)
        for (const h of i) {
          const u = new is({
              uniforms: {
                glowColor: { value: new Te(s) },
                glowOpacity: { value: h.opacity * n },
                glowThickness: { value: h.thickness },
              },
              vertexShader: `
            uniform float glowThickness;
            void main() {
              vec3 expanded = position + normalize(normal) * glowThickness;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(expanded, 1.0);
            }
          `,
              fragmentShader: `
            uniform vec3 glowColor;
            uniform float glowOpacity;
            void main() {
              gl_FragColor = vec4(glowColor, glowOpacity);
            }
          `,
              side: cs,
              transparent: !0,
              depthWrite: !1,
              blending: Q,
              toneMapped: !1,
            }),
            f = new at(c.geometry, u);
          ((f.name = "device-model-edge-glow"),
            (f.renderOrder = 9),
            (f.frustumCulled = c.frustumCulled),
            (f.userData.deviceEdgeGlow = !0),
            (f.raycast = () => {}),
            c.add(f),
            l.push({ parent: c, mesh: f, material: u }));
        }
      return () => {
        for (const c of l) (c.parent.remove(c.mesh), c.material.dispose());
      };
    }, [o, s, n, r, t]),
    null
  );
}
function Vs(t) {
  const s = t.polygon.reduce((o, [r, n]) => [o[0] + r, o[1] + n], [0, 0]);
  return [s[0] / t.polygon.length, s[1] / t.polygon.length];
}
function Qn(t) {
  return (
    Math.abs(
      t.polygon.reduce((s, o, r) => {
        const n = t.polygon[(r + 1) % t.polygon.length];
        return s + o[0] * n[1] - n[0] * o[1];
      }, 0),
    ) / 2
  );
}
function Us(t, s) {
  let o = !1;
  for (let r = 0, n = s.length - 1; r < s.length; n = r++) {
    const [a, i] = s[r],
      [d, l] = s[n];
    i > t[1] != l > t[1] &&
      t[0] < ((d - a) * (t[1] - i)) / (l - i || Number.EPSILON) + a &&
      (o = !o);
  }
  return o;
}
function Yt(t) {
  const s = he(t);
  return Qe(t)
    ? !1
    : ["on", "open", "opening", "detected", "unsafe", "unlocked"].includes(s);
}
function Jn(t, s, o = "glass") {
  const r = Nt(t, s, o),
    n = r.floorPalette[0];
  if (o === "cartoon" || o === "cream") return n;
  const a =
      t === "night" || s === "shade" || s === "environment" || s === "security",
    i = T(n, r.wallColor, a ? 0.06 : 0.1);
  return T(i, n, a ? 0.025 : 0.045);
}
function ea(t, s, o, r) {
  var n;
  return ft(t, s)
    ? "#ff708a"
    : t.kind === "light" ||
        ((n = t.modelId) != null && n.startsWith("switch.light."))
      ? r
      : pt(t, s, o)
        ? Dt(o, r)
        : t.kind === "climate"
          ? he(s) === "heat"
            ? "#ee8a5f"
            : "#83d8ff"
          : t.kind === "cover"
            ? "#83d8ff"
            : t.kind === "sensor"
              ? "#9cf0ca"
              : t.kind === "lock" ||
                  t.kind === "binary_sensor" ||
                  t.kind === "alarm_control_panel" ||
                  t.kind === "camera"
                ? "#ff8aa0"
                : t.kind === "fan" || t.kind === "vacuum"
                  ? "#8ee7d5"
                  : r;
}
function ta(t, s, o, r) {
  return !o || r === "overview" ? !0 : pt(t, s, r);
}
function sa(t, s) {
  return !t || s === "overview" || s === "lighting";
}
function ra(t, s, o) {
  let r = 0,
    n = 0,
    a = 0;
  for (const l of t) {
    const c = s[l.entityId];
    (Os(l, c) && (r += 1), ft(l, c) && (n += 1), pt(l, c, o) && (a += 1));
  }
  const i = n ? "#ff708a" : a ? Dt(o, "#a9c4ff") : r ? "#9cf0ca" : "#a9c4ff";
  return {
    active: r,
    alerts: n,
    modeMatches: a,
    color: i,
    opacity: n ? 0.145 : a ? 0.088 : r ? 0.058 : 0,
  };
}
function oa(t, s) {
  return t.roomId
    ? t.roomId === s.id
    : Us([t.position[0], t.position[2]], s.polygon);
}
function na(t, s, o) {
  const r = s.devices
      .filter((i) => {
        var d, l;
        return (
          (i.kind === "light" ||
            ((d = i.modelId) == null
              ? void 0
              : d.startsWith("switch.light.")) ||
            ((l = o[i.entityId]) == null ? void 0 : l.domain) === "light") &&
          oa(i, t)
        );
      })
      .map((i) => o[i.entityId])
      .filter((i) => !!i),
    n = s.devices
      .filter((i) => {
        var d;
        return ((d = o[i.entityId]) == null ? void 0 : d.domain) === "switch";
      })
      .flatMap((i) =>
        (i.controlledLightFixtures ?? [])
          .filter((d) =>
            d.roomId
              ? d.roomId === t.id
              : Us([d.position[0], d.position[2]], t.polygon),
          )
          .map(() => o[i.entityId]),
      )
      .filter((i) => !!i),
    a = Le(t, s, o, "lighting").filter((i) => i.domain === "light");
  return [...r, ...n, ...a].filter((i) => he(i) === "on");
}
function aa(t, s, o) {
  const n = na(t, s, o)
    .map((c) => dt(c))
    .filter((c) => c.isOn);
  if (!n.length)
    return {
      active: 0,
      color: "#e2b27a",
      level: 0,
      opacity: 0,
      edgeOpacity: 0,
    };
  const a = ot(n.reduce((c, h) => c + h.brightness, 0) / n.length, 0.22, 1),
    i = n.reduce((c, h) => (h.brightness > c.brightness ? h : c), n[0]),
    d = Math.min(0.045, (n.length - 1) * 0.012),
    l = T(T(i.color, "#ffc24f", 0.74), "#fff0bd", 0.08);
  return {
    active: n.length,
    color: l,
    level: a,
    opacity: ot(0.09 + a * 0.082 + d, 0.12, 0.22),
    edgeOpacity: ot(0.04 + a * 0.045, 0.052, 0.09),
  };
}
function ia(t, s) {
  return [
    ...new Set([...pe(t, "lighting", "main"), ...pe(t, "lighting", "ambient")]),
  ]
    .map((o) => s[o])
    .filter((o) => !!(o && (o.domain === "light" || o.domain === "switch")));
}
function Dt(t, s) {
  return t === "lighting"
    ? "#ffd08a"
    : t === "shade"
      ? "#83d8ff"
      : t === "environment"
        ? "#9cf0ca"
        : t === "security"
          ? "#ff708a"
          : s;
}
const tt = [18, 8],
  Ie = [16, 6],
  Qt = [
    {
      key: "temperature",
      label: "温度",
      icon: (t) => e.jsx(We, { className: t, size: 13 }),
      stateKey: "temperature",
    },
    {
      key: "humidity",
      label: "湿度",
      icon: (t) => e.jsx(hs, { className: t, size: 13 }),
      stateKey: "humidity",
    },
    {
      key: "pm25",
      label: "PM2.5",
      icon: (t) => e.jsx(Br, { className: t, size: 13 }),
      stateKey: "pm25",
    },
    {
      key: "co2",
      label: "CO₂",
      icon: (t) => e.jsx(lt, { className: t, size: 13 }),
      stateKey: "co2",
    },
    {
      key: "voc",
      label: "VOC",
      icon: (t) => e.jsx(us, { className: t, size: 13 }),
      stateKey: "voc",
    },
    {
      key: "illuminance",
      label: "照度",
      icon: (t) => e.jsx(Et, { className: t, size: 13 }),
      stateKey: "illuminance",
    },
  ];
function ca(t, s) {
  return s === "temperature" && t.domain === "climate"
    ? Number(t.attributes.current_temperature ?? t.attributes.temperature)
    : Number(t.state);
}
function la(t, s) {
  if (["unknown", "unavailable", ""].includes(he(t))) return Ke(t);
  const o = ca(t, s),
    r =
      typeof t.attributes.unit_of_measurement == "string"
        ? t.attributes.unit_of_measurement
        : "";
  return Number.isFinite(o)
    ? s === "temperature"
      ? `${o.toFixed(1)}°`
      : s === "humidity"
        ? `${o.toFixed(0)}%`
        : s === "illuminance"
          ? `${o.toFixed(0)}${r || "lx"}`
          : s === "co2" || s === "voc"
            ? `${o.toFixed(0)}${r && r.length <= 4 ? r : ""}`
            : `${o.toFixed(0)}${r && r.length <= 4 ? r : ""}`
    : Ke(t);
}
function da(t, s, o) {
  if (s.source === "binding")
    return Qt.flatMap((n) => {
      const a = pe(t, "environment", n.key)[0],
        i = s[n.stateKey] ?? (a ? void 0 : s[n.stateKey]),
        d = a ? o[a] : void 0;
      if (i === void 0 && !d) return [];
      const l =
        i !== void 0
          ? n.key === "temperature"
            ? `${i.toFixed(1)}°`
            : n.key === "humidity"
              ? `${i.toFixed(0)}%`
              : n.key === "illuminance"
                ? `${i.toFixed(0)}lx`
                : i.toFixed(0)
          : la(d, n.key);
      return [
        {
          key: n.key,
          label: n.label,
          icon: n.icon(`metric-icon metric-${n.key}`),
          value: l,
        },
      ];
    });
  const r = Qt.flatMap((n) => {
    const a = s[n.stateKey];
    if (a === void 0) return [];
    const i =
      n.key === "temperature"
        ? `${a.toFixed(1)}°`
        : n.key === "humidity"
          ? `${a.toFixed(0)}%`
          : n.key === "illuminance"
            ? `${a.toFixed(0)}lx`
            : a.toFixed(0);
    return [
      {
        key: n.key,
        label: n.label,
        icon: n.icon(`metric-icon metric-${n.key}`),
        value: i,
      },
    ];
  });
  return (
    s.quality !== "--" &&
      r.push({
        key: "air",
        label: "空气",
        icon: e.jsx(us, { className: "metric-icon metric-air", size: 13 }),
        value: s.quality,
      }),
    r
  );
}
function ha({
  room: t,
  floor: s,
  entities: o,
  theme: r,
  mode: n,
  onLightingAction: a,
  onShadeAction: i,
  onSecuritySelect: d,
}) {
  const l = Vs(t),
    c = Ss(t, s, o),
    h =
      c.source === "binding"
        ? "实况"
        : c.source === "area"
          ? "Area"
          : c.source === "device"
            ? "设备"
            : "未配置",
    u = Math.min(2.65, Math.max(1.62, Rt(s.height) + 0.58)),
    f = Le(t, s, o, "lighting").filter(
      (p) => p.domain === "light" || p.domain === "switch",
    ),
    j = ia(t, o),
    v = j.map((p) => p.entityId),
    y = Le(t, s, o, "shade").filter((p) => p.domain === "cover"),
    x = y.map((p) => p.entityId),
    b = Le(t, s, o, "security"),
    w = b.filter((p) => p.domain === "camera"),
    S = f.filter((p) => he(p) === "on").length,
    G = y.filter(
      (p) =>
        ["open", "opening"].includes(he(p)) ||
        Number(p.attributes.current_position ?? 0) > 0,
    ).length,
    L = y.length
      ? y.reduce(
          (p, m) =>
            p +
            Number(
              m.attributes.current_position ?? (he(m) === "open" ? 100 : 0),
            ),
          0,
        ) / y.length
      : 0,
    I = b.filter((p) => ft(p)).length;
  if (n === "lighting")
    return e.jsxs(ge, {
      position: [l[0], u, l[1]],
      center: !0,
      zIndexRange: tt,
      className: `mijia-room-badge mode-lighting badge-${r}`,
      children: [
        e.jsxs("div", {
          className: "badge-head",
          children: [
            e.jsx("strong", { children: t.name }),
            e.jsx("em", { children: S ? `${S} 盏亮着` : "灯全关着" }),
          ],
        }),
        e.jsxs("div", {
          className: "badge-actions",
          children: [
            e.jsx("button", {
              type: "button",
              className: S ? "active" : "",
              disabled: !v.length,
              onClick: (p) => {
                (p.stopPropagation(), a == null || a(v, "turn_on"));
              },
              "aria-label": `打开${t.name}绑定灯具`,
              title: v.length
                ? `打开 ${j.length} 个绑定灯具`
                : "未绑定主灯或氛围灯",
              children: e.jsx(fs, { size: 16 }),
            }),
            e.jsx("button", {
              type: "button",
              disabled: !v.length,
              onClick: (p) => {
                (p.stopPropagation(), a == null || a(v, "turn_off"));
              },
              "aria-label": `关闭${t.name}绑定灯具`,
              title: v.length
                ? `关闭 ${j.length} 个绑定灯具`
                : "未绑定主灯或氛围灯",
              children: e.jsx(Ur, { size: 16 }),
            }),
          ],
        }),
      ],
    });
  if (n === "shade") {
    const p = y.length
      ? `${G} 开 · ${Math.max(0, y.length - G)} 关`
      : "暂无窗帘";
    return e.jsxs(ge, {
      position: [l[0], u, l[1]],
      center: !0,
      zIndexRange: tt,
      className: `mijia-room-badge mode-shade badge-${r}`,
      children: [
        e.jsxs("div", {
          className: "badge-head",
          children: [
            e.jsx("strong", { children: t.name }),
            e.jsx("em", { children: p }),
          ],
        }),
        e.jsxs("div", {
          className: "badge-actions three",
          children: [
            e.jsx("button", {
              type: "button",
              className: L >= 90 ? "active" : "",
              disabled: !x.length,
              onClick: (m) => {
                (m.stopPropagation(), i == null || i(x, 100));
              },
              "aria-label": `打开${t.name}窗帘`,
              title: x.length ? `打开 ${y.length} 个窗帘` : "未绑定窗帘",
              children: e.jsx(so, { size: 16 }),
            }),
            e.jsx("button", {
              type: "button",
              className: L > 5 && L < 90 ? "active" : "",
              disabled: !x.length,
              onClick: (m) => {
                (m.stopPropagation(), i == null || i(x, 50));
              },
              "aria-label": `半开${t.name}窗帘`,
              title: x.length ? `半开 ${y.length} 个窗帘` : "未绑定窗帘",
              children: e.jsx(oo, { size: 16 }),
            }),
            e.jsx("button", {
              type: "button",
              className: x.length && L <= 5 ? "active" : "",
              disabled: !x.length,
              onClick: (m) => {
                (m.stopPropagation(), i == null || i(x, 0));
              },
              "aria-label": `关闭${t.name}窗帘`,
              title: x.length ? `关闭 ${y.length} 个窗帘` : "未绑定窗帘",
              children: e.jsx(eo, { size: 16 }),
            }),
          ],
        }),
      ],
    });
  }
  if (n === "security") {
    const p = I ? `${I} 个告警` : b.length ? "安防正常" : "暂无安防";
    return e.jsx(ge, {
      position: [l[0], u, l[1]],
      center: !0,
      zIndexRange: tt,
      className: `mijia-room-badge mode-security badge-${r} ${I ? "has-alert" : ""}`,
      children: e.jsxs("button", {
        type: "button",
        className: "security-badge-button",
        onClick: (m) => {
          (m.stopPropagation(),
            d == null ||
              d({
                floorId: s.id,
                roomId: t.id,
                floorName: s.name,
                roomName: t.name,
                cameraEntityIds: w.map((C) => C.entityId),
              }));
        },
        "aria-label": `查看${t.name}区域摄像头`,
        title: w.length ? `查看 ${w.length} 个摄像头` : p,
        children: [
          e.jsxs("span", {
            className: "security-badge-copy",
            children: [
              e.jsx("strong", { children: t.name }),
              e.jsx("em", { children: w.length ? `${w.length} 个摄像头` : p }),
            ],
          }),
          e.jsx("span", {
            className: `security-badge-icon ${I ? "alert" : ""}`,
            children: e.jsx(ps, { size: 16 }),
          }),
        ],
      }),
    });
  }
  const $ = da(t, c, o);
  return $.length
    ? e.jsxs(ge, {
        position: [l[0], u, l[1]],
        center: !0,
        zIndexRange: tt,
        className: `mijia-room-badge room-environment-badge badge-${r} badge-source-${c.source}`,
        children: [
          e.jsxs("div", {
            className: "badge-head",
            children: [
              e.jsx("strong", { children: t.name }),
              e.jsx("em", { children: h }),
            ],
          }),
          e.jsx("div", {
            className: `badge-metrics metrics-${$.length}`,
            children: $.map((p) =>
              e.jsxs(
                "span",
                {
                  className: `metric-chip metric-${p.key}`,
                  title: `${p.label} ${p.value}`,
                  children: [
                    p.icon,
                    e.jsx("small", { children: p.label }),
                    e.jsx("b", { children: p.value }),
                  ],
                },
                p.key,
              ),
            ),
          }),
        ],
      })
    : null;
}
function Jt({
  room: t,
  color: s,
  opacity: o,
  alert: r,
  y: n = 0.044,
  renderOrder: a = 2,
  edgeOpacity: i,
  blending: d = Q,
}) {
  const l = M.useMemo(() => {
    const c = t.polygon[0],
      h = new Ne();
    h.moveTo(c[0], -c[1]);
    for (const u of t.polygon.slice(1)) h.lineTo(u[0], -u[1]);
    return (h.closePath(), h);
  }, [t]);
  return e.jsxs("mesh", {
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, n, 0],
    renderOrder: a,
    children: [
      e.jsx("shapeGeometry", { args: [l] }),
      e.jsx("meshBasicMaterial", {
        color: s,
        transparent: !0,
        opacity: o,
        depthWrite: !1,
        toneMapped: !1,
        blending: d,
      }),
      (r || i !== void 0) &&
        e.jsx(ee, {
          color: s,
          threshold: 28,
          opacity: i ?? 0.18,
          transparent: !0,
        }),
    ],
  });
}
function ua({
  room: t,
  project: s,
  showLabel: o,
  theme: r,
  presentation: n,
  presentationMode: a,
  highlighted: i,
  accented: d,
  lit: l,
  lightColor: c,
  lightLevel: h,
  onFocus: u,
  onHover: f,
}) {
  const j = M.useMemo(() => {
      const O = t.polygon[0],
        g = new Ne();
      g.moveTo(O[0], -O[1]);
      for (const _ of t.polygon.slice(1)) g.lineTo(_[0], -_[1]);
      return (g.closePath(), g);
    }, [t]),
    v = Vs(t),
    y = oe(),
    x = y === "cartoon" && n,
    b = y === "cream" && n,
    w = me(r, a),
    S = i
      ? w.roomHighlight
      : n
        ? Jn(r, a, y)
        : d
          ? w.roomAccent
          : Hs(s, t.floorMaterialId, "#c9a675"),
    G = ot(h ?? 0, 0, 1),
    L = c ?? w.glow,
    I = n && l ? T(S, L, i ? 0.16 : 0.4 + G * 0.16) : S,
    $ = x
      ? i
        ? 0.44
        : l
          ? 0.34
          : d
            ? 0.28
            : 0.2
      : b
        ? i
          ? 0.32
          : l
            ? 0.18 + G * 0.055
            : d
              ? 0.17
              : 0.12
        : n
          ? i
            ? 0.18
            : l
              ? 0.065 + G * 0.04
              : d
                ? 0.075
                : 0.026
          : i
            ? 0.86
            : d
              ? 0.62
              : 0.24,
    p = i ? 0.1 : !n && d ? 0.045 : 0,
    m =
      n && l
        ? T(L, w.glow, 0.2)
        : i || (!n && d)
          ? I
          : n
            ? T(I, w.glow, 0.06)
            : "#000000",
    C = n ? Math.max(p, l ? 0.052 + G * 0.078 : 0.008) : p;
  return e.jsxs("group", {
    children: [
      e.jsxs("mesh", {
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, 0.025, 0],
        receiveShadow: !0,
        onPointerOver: (O) => {
          (O.stopPropagation(), f == null || f(!0));
        },
        onPointerOut: () => (f == null ? void 0 : f(!1)),
        onDoubleClick: (O) => {
          (O.stopPropagation(), u == null || u());
        },
        children: [
          e.jsx("shapeGeometry", { args: [j] }),
          e.jsx("meshPhysicalMaterial", {
            color: I,
            roughness: n ? (l ? 0.5 : 0.46) : 0.72,
            metalness: n ? 0.02 : 0.015,
            clearcoat: n ? (l ? 0.18 : 0.2) : 0,
            clearcoatRoughness: n ? 0.68 : 0.82,
            reflectivity: n ? (l ? 0.12 : 0.14) : 0.08,
            emissive: m,
            emissiveIntensity: C,
            polygonOffset: n,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1,
          }),
          $ > 0 &&
            e.jsx(ee, {
              color:
                x || b || i || d
                  ? w.roomEdgeColor
                  : l
                    ? T(L, "#ffffff", 0.42)
                    : n
                      ? w.wallEdgeColor
                      : "#6f6253",
              threshold: x ? 18 : b ? 24 : 30,
              opacity: $,
              transparent: !0,
            }),
        ],
      }),
      !n &&
        e.jsxs("mesh", {
          rotation: [-Math.PI / 2, 0, 0],
          position: [0, -0.015, 0],
          receiveShadow: !0,
          children: [
            e.jsx("shapeGeometry", { args: [j] }),
            e.jsx("meshStandardMaterial", {
              color: "#d5d9d4",
              roughness: 0.95,
            }),
          ],
        }),
      o &&
        e.jsxs(ge, {
          position: [v[0], 0.11, v[1]],
          center: !0,
          zIndexRange: Ie,
          className: "room-label room-label-3d",
          children: [
            e.jsx("strong", { children: t.name }),
            e.jsxs("span", { children: [Qn(t).toFixed(1), " m²"] }),
          ],
        }),
    ],
  });
}
function A({
  position: t,
  size: s,
  color: o,
  roughness: r = 0.72,
  presentation: n = !1,
}) {
  const a = oe(),
    i = a === "cartoon" && n,
    d = a === "cream" && n,
    l = i
      ? et(o)
      : d
        ? T(et(o), "#fff3df", 0.2)
        : n
          ? T(et(o), "#eef5ff", 0.24)
          : et(o),
    c = e.jsx("meshPhysicalMaterial", {
      color: l,
      roughness: d ? 0.64 : n ? Math.min(r, 0.44) : r,
      metalness: d ? 0.006 : 0.018,
      clearcoat: d ? 0.08 : n ? 0.34 : 0.16,
      clearcoatRoughness: d ? 0.82 : n ? 0.56 : 0.82,
      transparent: !1,
      opacity: 1,
    });
  if (n) {
    const h = Math.min(0.12, Math.min(s[0], s[1], s[2]) * 0.5),
      u = mt(i, d);
    return e.jsxs(B, {
      position: t,
      args: [s[0], s[1], s[2]],
      radius: h,
      smoothness: 5,
      castShadow: !0,
      receiveShadow: !0,
      children: [
        c,
        e.jsx(ee, {
          color: u.color,
          threshold: u.threshold,
          opacity: u.opacity,
          transparent: !0,
        }),
      ],
    });
  }
  return e.jsxs("mesh", {
    position: t,
    castShadow: !0,
    receiveShadow: !0,
    children: [
      e.jsx("boxGeometry", { args: [s[0], s[1], s[2]] }),
      c,
      e.jsx(ee, {
        color: Bt(l),
        threshold: 34,
        opacity: 0.16,
        transparent: !0,
      }),
    ],
  });
}
function fa({
  x: t,
  y: s,
  width: o,
  height: r,
  depth: n,
  color: a,
  presentation: i = !1,
  theme: d = "day",
  presentationMode: l = "overview",
  showEdges: c = !0,
}) {
  if (o <= 0.01 || r <= 0.01) return null;
  const h = oe(),
    u = h === "cartoon" && i,
    f = h === "cream" && i,
    j = me(d, l),
    v = i
      ? u
        ? T(j.wallColor, j.wallEdgeColor, 0.18)
        : f
          ? j.wallEdgeColor
          : T(j.wallEdgeColor, "#ffffff", 0.12)
      : "#8d8982",
    y = i
      ? u
        ? 0.08
        : f
          ? 0.16
          : Math.max(0.16, j.wallEdgeOpacity + 0.08)
      : 0.14;
  return e.jsxs("mesh", {
    position: [t, s, 0],
    castShadow: !0,
    receiveShadow: !0,
    children: [
      e.jsx("boxGeometry", { args: [o, r, n] }),
      e.jsx("meshPhysicalMaterial", {
        color: i ? j.wallColor : a,
        roughness: f ? 0.74 : i ? 0.5 : 0.84,
        metalness: 0,
        clearcoat: f ? 0.02 : i ? 0.16 : 0,
        clearcoatRoughness: f ? 0.94 : 0.72,
        transparent: i && j.wallOpacity < 0.99,
        opacity: i ? Math.max(0.2, j.wallOpacity * (f ? 1 : 0.82)) : 1,
        depthWrite: f || !i,
      }),
      c &&
        e.jsx(ee, {
          color: v,
          threshold: u ? 18 : f ? 28 : i ? 26 : 35,
          opacity: y,
          transparent: !0,
        }),
    ],
  });
}
function pa({
  opening: t,
  wallLength: s,
  wallDepth: o,
  presentation: r,
  theme: n,
  presentationMode: a,
  entity: i,
}) {
  const d = t.offset - s / 2,
    l = oe(),
    c = l === "cartoon" && r,
    h = l === "cream" && r,
    u = me(n, a),
    f = r ? T(u.wallColor, "#ffffff", c ? 0.22 : h ? 0.16 : 0.34) : "#e7ebef",
    j = c ? 0.3 : h ? 0.58 : r ? 0.18 : 1,
    v = r
      ? T(u.wallEdgeColor, u.wallColor, c ? 0.82 : h ? 0.42 : 0.68)
      : "#ffffff",
    y = c ? 0.055 : h ? 0.105 : r ? 0.08 : 0,
    x = ({
      x: g,
      y: _,
      width: k,
      height: E,
      depth: P = o + 0.035,
      solid: ha3dSolid = !1, // ha3d-self: B1/B8 门框在首页也不透明
      color: ha3dColor = f,
    }) =>
      e.jsxs("mesh", {
        position: [g, _, 0],
        castShadow: !r,
        receiveShadow: !0,
        renderOrder: r ? 6 : 2,
        children: [
          e.jsx("boxGeometry", { args: [k, E, P] }),
          e.jsx("meshPhysicalMaterial", {
            color: ha3dColor,
            roughness: r ? 0.52 : 0.56,
            metalness: 0.01,
            clearcoat: r ? 0.08 : 0.12,
            clearcoatRoughness: 0.72,
            emissive: r ? v : "#000000",
            emissiveIntensity: r ? 0.006 : 0,
            transparent: r && !ha3dSolid,
            opacity: ha3dSolid ? 1 : j,
            depthWrite: !r || ha3dSolid,
          }),
          r &&
            e.jsx(ee, { color: v, threshold: 18, opacity: y, transparent: !0 }),
        ],
      });
  if (t.type === "window") {
    const g = !!(t.entityId && Yt(i)),
      _ = t.windowStyle === "floor_to_ceiling" ? 0 : t.bottom,
      k = Math.min(0.045, t.width * 0.1, t.height * 0.1),
      E = t.width - k * 2,
      P = t.height - k * 2,
      N = E / 2,
      R = t.windowOpening === "outward",
      F = k * 0.55,
      z = h ? "#e5ede4" : "#d8edf5",
      U = h ? "#eee4d4" : "#edf4f6",
      V = ({ x: D, y: K, width: q, height: se }) =>
        e.jsxs("mesh", {
          position: [D, K, 0],
          children: [
            e.jsx("boxGeometry", { args: [q, se, 0.025] }),
            e.jsx("meshStandardMaterial", {
              color: U,
              roughness: 0.42,
              metalness: 0.08,
              transparent: !0,
              opacity: r ? 0.72 : 1,
            }),
          ],
        });
    return e.jsxs("group", {
      position: [d, _ + t.height / 2, 0],
      children: [
        e.jsx(x, { x: -t.width / 2 + k / 2, y: 0, width: k, height: t.height }),
        e.jsx(x, { x: t.width / 2 - k / 2, y: 0, width: k, height: t.height }),
        e.jsx(x, { x: 0, y: t.height / 2 - k / 2, width: t.width, height: k }),
        e.jsx(x, { x: 0, y: -t.height / 2 + k / 2, width: t.width, height: k }),
        t.windowStyle !== "floor_to_ceiling" &&
          e.jsx(x, {
            x: 0,
            y: -t.height / 2,
            width: t.width + k * 2,
            height: k,
            depth: o + 0.1,
          }),
        [-1, 1].map((D) =>
          e.jsx(
            "group",
            {
              position: [
                R ? (D * E) / 2 : D === -1 && g ? E / 4 : (D * E) / 4,
                0,
                R ? 0 : D * 0.022,
              ],
              rotation: [0, R && g ? (-D * Math.PI) / 3 : 0, 0],
              children: e.jsxs("group", {
                position: [R ? (-D * N) / 2 : 0, 0, 0],
                children: [
                  e.jsxs("mesh", {
                    renderOrder: 5,
                    children: [
                      e.jsx("planeGeometry", { args: [N - F * 2, P - F * 2] }),
                      e.jsx("meshPhysicalMaterial", {
                        color: z,
                        transparent: !0,
                        opacity: r ? 0.24 : 0.38,
                        roughness: 0.12,
                        metalness: 0.04,
                        clearcoat: 0.8,
                        depthWrite: !1,
                        side: Y,
                      }),
                    ],
                  }),
                  e.jsx(V, { x: -N / 2 + F / 2, y: 0, width: F, height: P }),
                  e.jsx(V, { x: N / 2 - F / 2, y: 0, width: F, height: P }),
                  e.jsx(V, { x: 0, y: P / 2 - F / 2, width: N, height: F }),
                  e.jsx(V, { x: 0, y: -P / 2 + F / 2, width: N, height: F }),
                ],
              }),
            },
            D,
          ),
        ),
      ],
    });
  }
  // ===== ha3d-self: 门（B1 门框不透明、只有一层描边；B8 门扇不透明；F1 入户门） =====
  const ha3dEntrance = t.doorStyle === "entrance",
    ha3dWarm = l === "cream" || l === "cartoon",
    ha3dUserData = { openingId: t.id, doorStyle: t.doorStyle ?? "single" },
    b = ha3dEntrance ? 0.08 : r ? 0.048 : 0.062,
    w = o + (r ? 0.014 : 0.006) + (ha3dEntrance ? 0.02 : 0),
    ha3dFrameColor = ha3dEntrance ? (ha3dWarm ? "#5b4738" : "#374151") : f,
    S = e.jsxs("group", {
      name: "ha3d-door-frame",
      userData: ha3dUserData,
      position: [d, t.height / 2, 0],
      children: [
        e.jsx(x, {
          x: -t.width / 2 + b / 2,
          y: 0,
          width: b,
          height: t.height,
          depth: w,
          solid: !0,
          color: ha3dFrameColor,
        }),
        e.jsx(x, {
          x: t.width / 2 - b / 2,
          y: 0,
          width: b,
          height: t.height,
          depth: w,
          solid: !0,
          color: ha3dFrameColor,
        }),
        e.jsx(x, {
          x: 0,
          y: t.height / 2 - b / 2,
          width: t.width,
          height: b,
          depth: w,
          solid: !0,
          color: ha3dFrameColor,
        }),
        // 入户门门槛条
        ha3dEntrance &&
          e.jsxs("mesh", {
            position: [0, -t.height / 2 + 0.0125, 0],
            receiveShadow: !0,
            children: [
              e.jsx("boxGeometry", { args: [t.width + 0.04, 0.025, w + 0.05] }),
              e.jsx("meshStandardMaterial", {
                color: ha3dWarm ? "#a08a6c" : "#9ca3af",
                metalness: 0.45,
                roughness: 0.35,
              }),
            ],
          }),
      ],
    });
  if (!t.hasLeaf) return e.jsx(e.Fragment, { children: S });
  const G = t.hinge === "start" ? -1 : 1,
    L = t.swing === "inward" ? 1 : -1,
    I = t.doorStyle === "double" ? [-1, 1] : [G],
    $ = (t.width * 0.96) / I.length,
    p = t.entityId ? Yt(i) : !0,
    m = p ? L * (r ? 0.68 : 0.58) : 0,
    // ha3d-self: 0.2.3 绑定了门磁的门扇打开时不再单独设颜色（0.2.1 及以前是薄荷绿、0.2.2 是白色），
    // 颜色、自发光、描边都和关门时一样，开关状态只看门扇角度
    // 门扇实色：玻璃风格偏冷灰蓝、奶油风格暖木色；入户门为深色金属
    C = ha3dEntrance
      ? ha3dWarm
        ? "#6f5847"
        : "#4b5563"
      : r
        ? ha3dWarm
          ? "#a87c52"
          : "#64788f"
        : "#b78b61",
    O = v,
    ha3dLeafDepth = ha3dEntrance ? 0.07 : 0.045,
    ha3dLeafZ = L * (ha3dEntrance ? 0.04 : 0.03),
    ha3dTrim = ha3dWarm ? "#d8c3a0" : "#d1d5db";
  return e.jsxs(e.Fragment, {
    children: [
      S,
      I.map((g) =>
        e.jsxs(
          "group",
          {
            name: "ha3d-door-leaf",
            userData: ha3dUserData,
            position: [d + (g * t.width) / 2, 0, 0],
            rotation: [0, m * g, 0],
            children: [
              e.jsxs(B, {
                position: [(-g * $) / 2, t.height / 2, ha3dLeafZ],
                args: [$, t.height * 0.97, ha3dLeafDepth],
                radius: ha3dEntrance ? 0.01 : r ? 0.02 : 0.012,
                smoothness: 4,
                castShadow: !0,
                children: [
                  e.jsx("meshPhysicalMaterial", {
                    color: C,
                    roughness: ha3dEntrance ? 0.38 : r ? 0.5 : 0.72,
                    metalness: ha3dEntrance ? 0.32 : 0.012,
                    clearcoat: r ? 0.2 : 0,
                    clearcoatRoughness: 0.56,
                    transparent: !1,
                    opacity: 1,
                    depthWrite: !0,
                    emissive: r ? O : "#000000",
                    emissiveIntensity: r ? 0.03 : 0, // ha3d-self: 0.2.3 开门不再加亮（原来 0.14）
                  }),
                  r &&
                    e.jsx(ee, {
                      color: v, // ha3d-self: 0.2.3 开门的描边和关门一样（原来白色、不透明度 0.2）
                      threshold: 18,
                      opacity: 0.12,
                      transparent: !0,
                    }),
                ],
              }),
              ha3dEntrance
                ? e.jsxs(e.Fragment, {
                    children: [
                      // 3 道横向压纹（两面都凸出一点）
                      [0.2, 0.34, 0.64].map((k) =>
                        e.jsxs(
                          "mesh",
                          {
                            position: [(-g * $) / 2, t.height * k, ha3dLeafZ],
                            children: [
                              e.jsx("boxGeometry", {
                                args: [$ * 0.78, 0.022, ha3dLeafDepth + 0.008],
                              }),
                              e.jsx("meshStandardMaterial", {
                                color: T(C, "#ffffff", 0.2),
                                metalness: 0.35,
                                roughness: 0.4,
                              }),
                            ],
                          },
                          k,
                        ),
                      ),
                      // 横把手（内外两侧）+ 锁面板
                      [-1, 1].map((k) =>
                        e.jsxs(
                          "group",
                          {
                            position: [
                              -g * $ * 0.84,
                              t.height * 0.48,
                              ha3dLeafZ + k * (ha3dLeafDepth / 2 + 0.006),
                            ],
                            children: [
                              e.jsxs("mesh", {
                                children: [
                                  e.jsx("boxGeometry", {
                                    args: [0.06, 0.2, 0.012],
                                  }),
                                  e.jsx("meshStandardMaterial", {
                                    color: ha3dTrim,
                                    metalness: 0.55,
                                    roughness: 0.3,
                                  }),
                                ],
                              }),
                              e.jsxs("mesh", {
                                position: [g * 0.07, 0.03, k * 0.03],
                                children: [
                                  e.jsx("boxGeometry", {
                                    args: [0.2, 0.026, 0.026],
                                  }),
                                  e.jsx("meshStandardMaterial", {
                                    color: ha3dTrim,
                                    metalness: 0.6,
                                    roughness: 0.26,
                                  }),
                                ],
                              }),
                            ],
                          },
                          k,
                        ),
                      ),
                      // 猫眼
                      e.jsxs("mesh", {
                        position: [(-g * $) / 2, t.height * 0.8, ha3dLeafZ],
                        rotation: [Math.PI / 2, 0, 0],
                        children: [
                          e.jsx("cylinderGeometry", {
                            args: [0.02, 0.02, ha3dLeafDepth + 0.016, 16],
                          }),
                          e.jsx("meshStandardMaterial", {
                            color: "#111827",
                            metalness: 0.5,
                            roughness: 0.2,
                          }),
                        ],
                      }),
                    ],
                  })
                : e.jsxs("mesh", {
                    position: [-g * $ * 0.82, t.height * 0.54, L * 0.065],
                    children: [
                      e.jsx("sphereGeometry", { args: [0.035, 16, 8] }),
                      e.jsx("meshStandardMaterial", {
                        color: r ? T(u.wallColor, "#ffffff", 0.48) : "#71604d",
                        metalness: 0.55,
                        roughness: 0.28,
                        emissive: r ? v : "#000000",
                        emissiveIntensity: r ? 0.08 : 0,
                      }),
                    ],
                  }),
            ],
          },
          g,
        ),
      ),
    ],
  });
}
const ga = M.memo(function ({
    walls: s,
    openings: o,
    thicknessScale: r,
    theme: n,
    mode: a,
  }) {
    const i = M.useMemo(
      () =>
        Un(
          s.map((h) => ({
            wall: h,
            height: gt(h.height),
            openings: o.filter((u) => u.wallId === h.id),
          })),
          r,
        ),
      [s, o, r],
    );
    M.useEffect(() => () => i.dispose(), [i]);
    const d = oe(),
      l = me(n, a),
      c = d === "cream";
    return e.jsx("mesh", {
      geometry: i,
      receiveShadow: !0,
      children:
        e.jsx("meshPhysicalMaterial", {
          color: l.wallColor,
          roughness: c ? 0.72 : 0.46,
          metalness: 0.004,
          clearcoat: c ? 0.02 : 0.16,
          clearcoatRoughness: c ? 0.94 : 0.7,
          transparent: l.wallOpacity < 0.99,
          opacity: Math.max(0.18, l.wallOpacity * (c ? 1 : 0.88)),
          depthWrite: c,
          side: Y,
        }),
    });
  }),
  ma = M.memo(function ({
    wall: s,
    color: o,
    openings: r,
    renderHeight: n,
    presentation: a,
    theme: i,
    presentationMode: d,
    thicknessScale: l,
    entities: c,
  }) {
    if (s.transparent) return null;
    const h = s.end[0] - s.start[0],
      u = s.end[1] - s.start[1],
      f = Math.hypot(h, u),
      j = Math.atan2(u, h),
      v = [(s.start[0] + s.end[0]) / 2, 0, (s.start[1] + s.end[1]) / 2],
      y = s.thickness * l,
      x = [...r].sort((g, _) => g.offset - _.offset),
      b =
        n > 1
          ? a
            ? x.filter((g) => g.type === "window" || g.type === "door")
            : x
          : [],
      w = n > 0.42 ? x : [],
      S = M.useMemo(() => {
        const g = new Ne(),
          _ = a ? 0 : y / 2,
          k = -f / 2 - _,
          E = f / 2 + _;
        (g.moveTo(k, 0),
          g.lineTo(E, 0),
          g.lineTo(E, n),
          g.lineTo(k, n),
          g.closePath());
        for (const P of b) {
          const N = P.offset - f / 2,
            R = Math.max(k + 0.001, N - P.width / 2),
            F = Math.min(E - 0.001, N + P.width / 2),
            z = Math.max(0.001, P.bottom),
            U = Math.min(n - 0.001, P.bottom + P.height);
          if (F - R <= 0.01 || U - z <= 0.01) continue;
          const V = new gr();
          (V.moveTo(R, z),
            V.lineTo(R, U),
            V.lineTo(F, U),
            V.lineTo(F, z),
            V.closePath(),
            g.holes.push(V));
        }
        return g;
      }, [b, f, a, n, y]),
      G = [];
    let L = 0;
    for (const g of b.filter((_) => _.type === "door" && _.bottom < 0.1)) {
      const _ = Math.max(L, g.offset - g.width / 2);
      (_ > L && G.push({ start: L, end: _ }),
        (L = Math.max(L, Math.min(f, g.offset + g.width / 2))));
    }
    L < f && G.push({ start: L, end: f });
    const I = oe(),
      $ = I === "cartoon" && a,
      p = I === "cream" && a,
      m = me(i, d),
      C = a
        ? $
          ? T(m.wallColor, m.wallEdgeColor, 0.18)
          : p
            ? m.wallEdgeColor
            : T(m.wallEdgeColor, "#ffffff", 0.1)
        : "#8d8982",
      O = a
        ? $
          ? 0.06
          : p
            ? 0.16
            : Math.max(0.15, m.wallEdgeOpacity + 0.07)
        : 0.14;
    return e.jsxs("group", {
      position: v,
      rotation: [0, -j, 0],
      children: [
        !a &&
          e.jsxs("mesh", {
            position: [0, 0, -y / 2],
            castShadow: !0,
            receiveShadow: !0,
            children: [
              e.jsx("extrudeGeometry", {
                args: [
                  S,
                  a
                    ? {
                        depth: y,
                        bevelEnabled: !0,
                        bevelSize: Math.min(0.014, y * 0.1),
                        bevelThickness: Math.min(0.008, y * 0.06),
                        bevelSegments: 2,
                        curveSegments: 3,
                      }
                    : { depth: y, bevelEnabled: !1, curveSegments: 1 },
                ],
              }),
              e.jsx("meshPhysicalMaterial", {
                color: a ? m.wallColor : o,
                roughness: p ? 0.72 : a ? 0.46 : 0.84,
                metalness: 0.004,
                clearcoat: p ? 0.02 : a ? 0.16 : 0,
                clearcoatRoughness: p ? 0.94 : 0.7,
                transparent: a && m.wallOpacity < 0.99,
                opacity: a
                  ? Math.max(0.18, m.wallOpacity * (p ? 1 : 0.88))
                  : 1,
                depthWrite: p || !a,
                side: Y,
              }),
              e.jsx(ee, {
                color: C,
                threshold: $ ? 18 : p ? 28 : a ? 26 : 35,
                opacity: O,
                transparent: !0,
              }),
            ],
          }),
        w.map((g) =>
          e.jsx(
            "group",
            {
              children: e.jsx(pa, {
                opening: g,
                wallLength: f,
                wallDepth: y,
                presentation: a,
                theme: i,
                presentationMode: d,
                entity: g.entityId ? c[g.entityId] : void 0,
              }),
            },
            g.id,
          ),
        ),
        !a &&
          G.map((g, _) => {
            const k = g.start <= 0.001 ? g.start - y / 2 : g.start,
              E = g.end >= f - 0.001 ? g.end + y / 2 : g.end;
            return e.jsx(
              fa,
              {
                x: (k + E) / 2 - f / 2,
                y: 0.045,
                width: E - k,
                height: 0.09,
                depth: y + 0.035,
                color: a ? m.wallColor : "#dedbd5",
                presentation: a,
                theme: i,
                presentationMode: d,
                showEdges: !1,
              },
              `baseboard-${_}`,
            );
          }),
      ],
    });
  });
function xa(t) {
  const s = M.useMemo(
      () => t.openings.flatMap((r) => (r.entityId ? [r.entityId] : [])),
      [t.openings],
    ),
    o = Fo(t.entities, s);
  return e.jsx(ma, { ...t, entities: o });
}
const Pt = (t, s, o) => {
  const r = t == null ? void 0 : t.attributes[s];
  return typeof r == "number" ? r : o;
};
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
function es({ active: t, axis: s = "z", speed: o = 8, children: r }) {
  const n = M.useRef(null),
    a = Oe(),
    i = M.useRef(0),
    d = xt();
  return (
    te((l, c) => {
      if (!n.current || document.hidden) return;
      const h = t && !d ? o : 0;
      if (
        ((i.current = X.damp(i.current, h, t ? 3 : 2, Math.min(c, 0.05))),
        Math.abs(i.current) < 0.015)
      ) {
        i.current = 0;
        return;
      }
      ((n.current.rotation[s] += Math.min(c, 0.05) * i.current), a());
    }),
    e.jsx("group", { ref: n, children: r })
  );
}
function ts({ active: t, amplitude: s = 0.18, speed: o = 1.2, children: r }) {
  const n = xt(),
    a = M.useRef(null),
    i = Oe();
  return (
    te(({ clock: d }, l) => {
      if (
        !a.current ||
        document.hidden ||
        ((!t || n) && a.current.rotation.y === 0)
      )
        return;
      const c = t && !n ? Math.sin(d.elapsedTime * o) * s : 0,
        h = X.damp(a.current.rotation.y, c, 6, Math.min(l, 0.05));
      ((a.current.rotation.y = (!t || n) && Math.abs(h) < 0.001 ? 0 : h), i());
    }),
    e.jsx("group", { ref: a, children: r })
  );
}
function ja(t, s = 8) {
  const [o, r] = M.useState(t),
    n = M.useRef(t),
    a = Oe();
  return (
    M.useEffect(() => {
      ((n.current = Number.isFinite(n.current) ? n.current : t),
        r((i) => (Number.isFinite(i) ? i : t)));
    }, [t]),
    te((i, d) => {
      const l = n.current;
      if (Math.abs(l - t) < 0.001) {
        l !== t && ((n.current = t), r(t));
        return;
      }
      const c = X.damp(l, t, s, Math.min(d, 0.05));
      ((n.current = Math.abs(c - t) < 0.001 ? t : c), r(n.current), a());
    }),
    o
  );
}
const Ks = { value: 0 };
function ya() {
  return (
    te(({ clock: t }) => {
      Ks.value = t.elapsedTime;
    }),
    null
  );
}
const ba = `
  precision mediump float;
  uniform vec3 uDirection;
  uniform float uEndHalfWidth;
  uniform float uLength;
  uniform float uLodFar;
  uniform float uLodNear;
  uniform float uPhase;
  uniform vec3 uSideAxis;
  uniform float uSideLock;
  uniform float uSpreadPower;
  uniform float uStartHalfWidth;
  uniform float uTime;
  uniform float uTurbulence;
  varying vec2 vUv;
  varying float vLodFade;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vUv = uv;
    float along = uv.y;
    float side = uv.x * 2.0 - 1.0;
    vec3 anchor = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    mat3 basis = mat3(modelMatrix);

    vec3 rawDirection = basis * uDirection;
    if (length(rawDirection) < 0.0001) rawDirection = vec3(0.0, 0.0, 1.0);
    vec3 flowDirection = normalize(rawDirection);

    vec3 viewDirection = normalize(cameraPosition - anchor);
    vec3 cameraSide = cross(viewDirection, flowDirection);
    if (length(cameraSide) < 0.0001) cameraSide = cross(vec3(0.0, 1.0, 0.0), flowDirection);
    if (length(cameraSide) < 0.0001) cameraSide = vec3(1.0, 0.0, 0.0);
    cameraSide = normalize(cameraSide);

    vec3 preferredSide = basis * uSideAxis;
    if (length(preferredSide) < 0.0001) preferredSide = cameraSide;
    preferredSide = normalize(preferredSide);
    vec3 mixedSide = mix(cameraSide, preferredSide, clamp(uSideLock, 0.0, 1.0));
    if (length(mixedSide) < 0.0001) mixedSide = cameraSide;
    vec3 sideDirection = normalize(mixedSide);

    float width = mix(uStartHalfWidth, uEndHalfWidth, pow(along, uSpreadPower));
    float drift = (noise2(vec2(along * 3.7 - uTime * 0.11 + uPhase, side * 1.9)) - 0.5) * uTurbulence * along * (1.0 - along * 0.35);
    vec3 worldPosition = anchor + flowDirection * (along * uLength) + sideDirection * (side * width + drift);

    float cameraDistance = distance(cameraPosition, anchor);
    vLodFade = 1.0 - smoothstep(uLodNear, uLodFar, cameraDistance);
    gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition, 1.0);
  }
`,
  wa = `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uPhase;
  uniform float uSpeed;
  uniform float uStrength;
  uniform float uTime;
  uniform float uTurbulence;
  varying vec2 vUv;
  varying float vLodFade;

  float hash21(vec2 p) {
    p = fract(p * vec2(234.54, 875.31));
    p += dot(p, p + 31.72);
    return fract(p.x * p.y);
  }

  float noise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    float along = vUv.y;
    float side = vUv.x * 2.0 - 1.0;
    float time = uTime * uSpeed;
    vec2 flowUv = vec2(vUv.x * 4.2 + uPhase, along * 7.0 - time);
    float lowNoise = noise2(flowUv);
    float fineNoise = noise2(flowUv * 2.17 + 9.4);
    float edgeWarp = (lowNoise - 0.5) * uTurbulence * (0.18 + along * 0.62);
    float feather = 1.0 - smoothstep(0.52, 1.0, abs(side + edgeWarp));
    float root = 1.0 - smoothstep(0.0, 0.42, along);
    float farFade = 1.0 - smoothstep(0.62, 1.0, along);
    float startFade = smoothstep(0.0, 0.08, along);
    float stream = 0.5 + 0.5 * sin((along * 6.6 - time * 1.18 + lowNoise * 0.9 + uPhase) * 6.2831853);
    stream = smoothstep(0.5, 1.0, stream);
    float mist = 0.36 + lowNoise * 0.26 + fineNoise * 0.14;
    float lodOpacity = mix(0.42, 1.0, clamp(vLodFade, 0.0, 1.0));
    float alpha = uOpacity * uStrength * feather * startFade * farFade * lodOpacity * (0.46 + root * 0.72 + mist * 0.32 + stream * 0.18);
    // Keep the climate hue recognizable while adding a luminous, icy core so
    // the airflow reads clearly against the pale floorplan.
    vec3 color = mix(vec3(0.10, 0.66, 1.0), uColor, 0.84);
    float core = smoothstep(0.18, 0.92, root * 0.7 + stream * 0.42 + mist * 0.24);
    color = mix(color, vec3(0.78, 0.96, 1.0), core * 0.28);
    gl_FragColor = vec4(color, clamp(alpha * 1.12, 0.0, 0.68));
    if (gl_FragColor.a < 0.004) discard;
  }
`;
// ===== ha3d-self: B6 设备动画限帧（省电 20 fps、流畅 30 fps） =====
// 出风（ce，空调、风扇等）和传感器脉冲环（Na，人在、门开、读数变化时）原来每帧 invalidate，场景里只有它们在动时也按显示器刷新率渲染。
// 省电/流畅下改为按帧率排队一次 invalidate，同一画布上的多个设备动画共用一个定时器；
// 拖动、缩放视角时帧由 OrbitControls 驱动，不受这里影响。均衡/高照旧每帧 invalidate。
const ha3dDeviceAnimFps = { eco: 20, smooth: 30 },
  ha3dDeviceAnimTimers = new WeakMap();
function ha3dDeviceAnimInvalidate(t, s) {
  const o = ha3dDeviceAnimFps[s];
  if (!o) return t();
  let r = ha3dDeviceAnimTimers.get(t);
  if (!r) ((r = { timer: 0, last: 0 }), ha3dDeviceAnimTimers.set(t, r));
  r.timer ||
    (r.timer = window.setTimeout(
      () => {
        ((r.timer = 0), (r.last = performance.now()), t());
      },
      Math.max(0, 1e3 / o - (performance.now() - r.last)),
    ));
}
function ce({
  color: t,
  direction: s,
  endWidth: o,
  length: r,
  opacity: n,
  phase: a = 0,
  position: i = [0, 0, 0],
  sideAxis: d = [1, 0, 0],
  sideLock: l = 0.22,
  speed: c = 0.42,
  spreadPower: h = 1,
  startWidth: u,
  strength: f = 1,
  turbulence: j = 0.1,
  visible: v = !0,
}) {
  const y = be((G) => G.invalidate),
    ha3dQuality = M.useContext(ha3dQualityContext); // ha3d-self: B6
  M.useEffect(() => {
    v && y();
  }, [y, v]);
  const x = xt(),
    b = M.useRef(0);
  te((G, L) => {
    !v ||
      document.hidden ||
      ((b.current = X.damp(b.current, 1, 5, Math.min(L, 0.05))),
      (S.uOpacity.value = n * (x ? 1 : b.current)),
      (S.uTime.value = x ? 0 : Ks.value),
      x || ha3dDeviceAnimInvalidate(y, ha3dQuality)); // ha3d-self: B6 省电/流畅下限帧
  });
  const w = T(t, "#f0f8f5", 0.45),
    S = M.useMemo(
      () => ({
        uColor: { value: new Te(w) },
        uDirection: { value: new J(s[0], s[1], s[2]) },
        uEndHalfWidth: { value: o * 0.5 },
        uLength: { value: r },
        uLodFar: { value: 6.6 },
        uLodNear: { value: 2.2 },
        uOpacity: { value: n },
        uPhase: { value: a },
        uSideAxis: { value: new J(d[0], d[1], d[2]) },
        uSideLock: { value: l },
        uSpeed: { value: c },
        uSpreadPower: { value: h },
        uStartHalfWidth: { value: u * 0.5 },
        uStrength: { value: f },
        uTime: { value: 0 },
        uTurbulence: { value: j },
      }),
      [s, o, r, w, n, a, d, l, c, h, u, f, j],
    );
  return (
    M.useEffect(() => {
      (S.uColor.value.set(w),
        S.uDirection.value.set(s[0], s[1], s[2]),
        (S.uEndHalfWidth.value = o * 0.5),
        (S.uLength.value = r),
        (S.uOpacity.value = n),
        (S.uPhase.value = a),
        S.uSideAxis.value.set(d[0], d[1], d[2]),
        (S.uSideLock.value = l),
        (S.uSpeed.value = c),
        (S.uSpreadPower.value = h),
        (S.uStartHalfWidth.value = u * 0.5),
        (S.uStrength.value = f),
        (S.uTurbulence.value = j));
    }, [s, o, r, w, n, a, d, l, c, h, u, f, j, S]),
    v
      ? e.jsxs("mesh", {
          position: i,
          renderOrder: 10,
          children: [
            e.jsx("planeGeometry", { args: [1, 1, 1, 1] }),
            e.jsx("shaderMaterial", {
              uniforms: S,
              vertexShader: ba,
              fragmentShader: wa,
              transparent: !0,
              depthWrite: !1,
              side: Y,
              blending: Q,
              toneMapped: !1,
            }),
          ],
        })
      : null
  );
}
function va({ color: t, variant: s, strong: o = !1 }) {
  return e.jsx(ce, {
    color: t,
    direction: s === "down" ? [0, -1, 0] : [0, -0.08, 1],
    endWidth: o ? 0.82 : 0.5,
    length: o ? 1.08 : 0.7,
    opacity: o ? 0.32 : 0.21,
    phase: 0.17,
    sideAxis: [1, 0, 0],
    sideLock: 0.18,
    speed: 0.58,
    spreadPower: 0.78,
    startWidth: o ? 0.22 : 0.14,
    turbulence: o ? 0.18 : 0.12,
  });
}
function wt({
  color: t,
  profile: s = "round",
  strong: o = !1,
  variant: r,
  wideStart: n = !1,
}) {
  const a = o ? 0.34 : 0.22;
  if (s === "slot")
    return e.jsx(ce, {
      color: t,
      direction: [0, -0.03, 1],
      endWidth: 0.86,
      length: o ? 1.16 : 0.86,
      opacity: a * 0.82,
      phase: 0.31,
      sideAxis: [0, 1, 0],
      sideLock: 0.88,
      speed: 0.38,
      spreadPower: 1.15,
      startWidth: 0.7,
      turbulence: 0.08,
    });
  if (r === "down")
    return e.jsxs(e.Fragment, {
      children: [
        e.jsx(ce, {
          color: t,
          direction: [0, -1, 0],
          endWidth: 1.55,
          length: o ? 1.16 : 0.84,
          opacity: a * 0.92,
          phase: 0.12,
          sideAxis: [1, 0, 0],
          sideLock: 0.2,
          speed: 0.34,
          spreadPower: 0.66,
          startWidth: 0.34,
          turbulence: 0.16,
        }),
        e.jsx(ce, {
          color: t,
          direction: [0, -1, 0],
          endWidth: 1.35,
          length: o ? 1.02 : 0.76,
          opacity: a * 0.56,
          phase: 0.54,
          sideAxis: [0, 0, 1],
          sideLock: 0.5,
          speed: 0.3,
          spreadPower: 0.72,
          startWidth: 0.26,
          turbulence: 0.14,
        }),
      ],
    });
  const i = n ? 0.42 : 0.26;
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(ce, {
        color: t,
        direction: [0, -0.04, 1],
        endWidth: o ? 1.18 : 0.82,
        length: o ? 1.3 : 0.92,
        opacity: a,
        phase: 0.19,
        sideAxis: [1, 0, 0],
        sideLock: 0.18,
        speed: 0.42,
        spreadPower: 0.76,
        startWidth: i,
        turbulence: 0.2,
      }),
      e.jsx(ce, {
        color: t,
        direction: [0, -0.02, 1],
        endWidth: o ? 0.82 : 0.58,
        length: o ? 1.12 : 0.8,
        opacity: a * 0.52,
        phase: 0.61,
        sideAxis: [0, 1, 0],
        sideLock: 0.36,
        speed: 0.36,
        spreadPower: 0.9,
        startWidth: i * 0.72,
        turbulence: 0.16,
      }),
    ],
  });
}
const Ma = (() => {
    const t = new Ne();
    return (
      t.moveTo(0.06, -0.044),
      t.bezierCurveTo(0.3, -0.082, 0.66, -0.088, 0.92, -0.066),
      t.bezierCurveTo(1.01, -0.056, 1.06, -0.026, 1.075, 0.012),
      t.bezierCurveTo(1.052, 0.052, 1.006, 0.07, 0.92, 0.074),
      t.bezierCurveTo(0.64, 0.088, 0.28, 0.076, 0.06, 0.042),
      t.bezierCurveTo(0.02, 0.03, 0.018, -0.034, 0.06, -0.044),
      t
    );
  })(),
  _a = (() => {
    const t = new Ne();
    return (
      t.moveTo(0.028, -0.026),
      t.bezierCurveTo(0.082, -0.082, 0.174, -0.106, 0.236, -0.072),
      t.bezierCurveTo(0.272, -0.044, 0.266, 0.026, 0.218, 0.066),
      t.bezierCurveTo(0.152, 0.116, 0.07, 0.082, 0.026, 0.024),
      t.bezierCurveTo(0.012, 0.006, 0.012, -0.008, 0.028, -0.026),
      t
    );
  })();
function ka({ color: t }) {
  return e.jsxs("group", {
    position: [0, -0.066, 0.095],
    children: [
      e.jsx(ce, {
        color: t,
        direction: [0, -0.42, 1],
        endWidth: 0.72,
        length: 0.88,
        opacity: 0.26,
        phase: 0.22,
        sideAxis: [1, 0, 0],
        sideLock: 0.42,
        speed: 0.34,
        spreadPower: 0.82,
        startWidth: 0.38,
        turbulence: 0.1,
      }),
      e.jsx(ce, {
        color: t,
        direction: [0, -0.36, 1],
        endWidth: 0.5,
        length: 0.76,
        opacity: 0.16,
        phase: 0.67,
        sideAxis: [0, 1, 0],
        sideLock: 0.3,
        speed: 0.28,
        spreadPower: 0.95,
        startWidth: 0.22,
        turbulence: 0.08,
      }),
    ],
  });
}
function Sa({ color: t }) {
  return e.jsxs("group", {
    position: [0, -0.09, 0.2],
    children: [
      e.jsx(ce, {
        color: t,
        direction: [0, -0.24, 1],
        endWidth: 1.46,
        length: 0.88,
        opacity: 0.24,
        phase: 0.1,
        sideAxis: [1, 0, 0],
        sideLock: 0.58,
        speed: 0.24,
        spreadPower: 0.62,
        startWidth: 0.72,
        turbulence: 0.075,
      }),
      e.jsx(ce, {
        color: t,
        direction: [0, -0.18, 1],
        endWidth: 1.04,
        length: 0.76,
        opacity: 0.14,
        phase: 0.49,
        sideAxis: [0, 1, 0],
        sideLock: 0.24,
        speed: 0.21,
        spreadPower: 0.86,
        startWidth: 0.36,
        turbulence: 0.065,
      }),
    ],
  });
}
function Ca({ color: t }) {
  return e.jsxs("group", {
    position: [0, 0.86, 0.146],
    children: [
      e.jsx(ce, {
        color: t,
        direction: [0, -0.34, 1],
        endWidth: 0.76,
        length: 0.74,
        opacity: 0.25,
        phase: 0.28,
        sideAxis: [1, 0, 0],
        sideLock: 0.4,
        speed: 0.3,
        spreadPower: 0.9,
        startWidth: 0.32,
        turbulence: 0.12,
      }),
      e.jsx(ce, {
        color: t,
        direction: [0, -0.38, 1],
        endWidth: 0.92,
        length: 0.7,
        opacity: 0.16,
        phase: 0.73,
        sideAxis: [0, 1, 0],
        sideLock: 0.68,
        speed: 0.26,
        spreadPower: 1.05,
        startWidth: 0.56,
        turbulence: 0.1,
      }),
    ],
  });
}
function Pa(t) {
  const o = [
    t == null ? void 0 : t.attributes.temperature,
    t == null ? void 0 : t.attributes.target_temperature,
    t == null ? void 0 : t.attributes.current_temperature,
  ]
    .map((r) =>
      typeof r == "number"
        ? r
        : typeof r == "string"
          ? Number.parseFloat(r)
          : Number.NaN,
    )
    .find((r) => Number.isFinite(r));
  return `${Math.round(o ?? 26)}°`;
}
function za({ color: t, temperature: s }) {
  return e.jsx(ge, {
    position: [0, 0.48, 0.04],
    center: !0,
    zIndexRange: Ie,
    className: "scene-climate-status-badge",
    children: e.jsxs("div", {
      children: [
        e.jsx(ko, { size: 19, strokeWidth: 2.7, style: { color: t } }),
        e.jsx("strong", { children: s }),
      ],
    }),
  });
}
function st({
  color: t,
  level: s,
  position: o,
  radius: r,
  scale: n = [1, 1, 1],
}) {
  const a = T(t, "#ffffff", 0.18);
  return e.jsxs("group", {
    position: o,
    children: [
      e.jsxs("mesh", {
        scale: n,
        renderOrder: 7,
        children: [
          e.jsx("sphereGeometry", { args: [r, 32, 16] }),
          e.jsx("meshBasicMaterial", {
            color: a,
            transparent: !0,
            opacity: 0.055 + s * 0.16,
            depthWrite: !1,
            blending: Q,
            toneMapped: !1,
          }),
        ],
      }),
      e.jsxs("mesh", {
        scale: [n[0] * 1.7, n[1] * 1.7, n[2] * 1.7],
        renderOrder: 6,
        children: [
          e.jsx("sphereGeometry", { args: [r, 32, 16] }),
          e.jsx("meshBasicMaterial", {
            color: a,
            transparent: !0,
            opacity: 0.02 + s * 0.075,
            depthWrite: !1,
            blending: Q,
            toneMapped: !1,
          }),
        ],
      }),
    ],
  });
}
function ss({ color: t, level: s, radius: o, position: r, elongated: n = !1 }) {
  const a = T(t, "#ffffff", 0.16),
    i = n ? [1.65, 1, 1] : [1, 1, 1];
  return e.jsx("group", {
    position: r,
    rotation: [-Math.PI / 2, 0, 0],
    scale: i,
    renderOrder: 5,
    children: e.jsxs("mesh", {
      children: [
        e.jsx("circleGeometry", { args: [o, 56] }),
        e.jsx("meshBasicMaterial", {
          color: a,
          transparent: !0,
          opacity: 0.018 + s * 0.052,
          depthWrite: !1,
          blending: Q,
          toneMapped: !1,
        }),
      ],
    }),
  });
}
function _e(t) {
  const s = M.useRef(null),
    o = xt(),
    r = be((i) => i.invalidate),
    n = M.useRef(0),
    a = M.useRef([]);
  return (
    M.useLayoutEffect(() => {
      var i;
      ((a.current = []),
        (i = s.current) == null ||
          i.traverse((d) => {
            if (
              (d instanceof mr &&
                a.current.push({ light: d, value: d.intensity }),
              d instanceof at)
            ) {
              const l = Array.isArray(d.material) ? d.material : [d.material];
              for (const c of l)
                c.transparent &&
                  a.current.push({ material: c, value: c.opacity });
            }
          }),
        (n.current = 0),
        r());
    }, [t.color, t.brightness, t.variant, r]),
    te((i, d) => {
      if (n.current >= 1) return;
      n.current = o ? 1 : Math.min(1, n.current + Math.min(d, 0.05) / 0.45);
      const l = 1 - (1 - n.current) ** 3;
      for (const c of a.current)
        (c.material && (c.material.opacity = c.value * l),
          c.light && (c.light.intensity = c.value * l));
      r();
    }),
    e.jsx("group", { ref: s, children: e.jsx(Ea, { ...t }) })
  );
}
function Ea({ color: t, brightness: s, variant: o }) {
  const r = X.clamp(s, 0, 1),
    n = Ds(t),
    a = T(n, "#fff7d6", 0.18);
  if (o === "floor")
    return e.jsxs("group", {
      children: [
        e.jsx("pointLight", {
          color: a,
          intensity: 0.42 + r * 1.9,
          distance: 2.25 + r * 1.9,
          position: [0, 1.14, 0],
          decay: 2,
        }),
        e.jsx(st, {
          color: n,
          level: r,
          position: [0, 1.06, 0],
          radius: 0.22,
          scale: [1.05, 0.72, 1.05],
        }),
        e.jsx(ss, {
          color: n,
          level: r,
          radius: 0.42 + r * 0.18,
          position: [0, 0.026, 0],
        }),
      ],
    });
  if (o === "strip")
    return e.jsxs("group", {
      children: [
        e.jsx("pointLight", {
          color: a,
          intensity: 0.32 + r * 1.42,
          distance: 2.2 + r * 1.7,
          decay: 2,
        }),
        e.jsx(st, {
          color: n,
          level: r,
          position: [0, -0.045, 0],
          radius: 0.15,
          scale: [3.15, 0.3, 0.42],
        }),
        e.jsxs("mesh", {
          position: [0, -0.09, 0],
          rotation: [-Math.PI / 2, 0, 0],
          children: [
            e.jsx("planeGeometry", { args: [1.18, 0.28] }),
            e.jsx("meshBasicMaterial", {
              color: a,
              transparent: !0,
              opacity: 0.045 + r * 0.092,
              depthWrite: !1,
              blending: Q,
              toneMapped: !1,
            }),
          ],
        }),
      ],
    });
  if (o === "wall")
    return e.jsxs("group", {
      children: [
        e.jsx("pointLight", {
          color: a,
          intensity: 0.38 + r * 1.7,
          distance: 1.9 + r * 1.4,
          decay: 2,
          position: [0, 0, 0.12],
        }),
        e.jsx(st, {
          color: n,
          level: r,
          position: [0, 0, 0.06],
          radius: 0.17,
          scale: [1.35, 0.82, 0.38],
        }),
        e.jsxs("mesh", {
          position: [0, -0.18, 0.18],
          rotation: [-Math.PI / 2, 0, 0],
          children: [
            e.jsx("coneGeometry", { args: [0.34, 0.72, 36, 1, !0] }),
            e.jsx("meshBasicMaterial", {
              color: a,
              transparent: !0,
              opacity: 0.014 + r * 0.048,
              side: Y,
              depthWrite: !1,
              blending: Q,
              toneMapped: !1,
            }),
          ],
        }),
      ],
    });
  const i = o === "chandelier" ? 1.08 : o === "downlight" ? 0.9 : 1.28,
    d = o === "downlight" ? 0.16 : o === "chandelier" ? 0.38 : 0.44,
    l = o === "chandelier" ? -0.52 : o === "downlight" ? -0.028 : -0.068,
    c = o === "downlight" ? 0.058 : o === "chandelier" ? 0.26 : 0.24,
    h =
      o === "downlight"
        ? [1, 0.18, 1]
        : [1, o === "chandelier" ? 0.5 : 0.34, 1],
    u = o === "downlight" ? 0.011 + r * 0.038 : 0.018 + r * 0.058;
  return e.jsxs("group", {
    children: [
      e.jsx("pointLight", {
        color: a,
        intensity:
          (o === "chandelier" ? 0.62 : 0.42) +
          r * (o === "downlight" ? 1.08 : 2.12),
        distance:
          (o === "ceiling" ? 3.35 : o === "downlight" ? 2.15 : 2.75) +
          r * (o === "downlight" ? 1.1 : 1.75),
        decay: 2,
        position: [0, l, 0],
      }),
      o !== "ceiling" &&
        e.jsx(st, {
          color: n,
          level: r,
          position: [0, l, 0],
          radius: c,
          scale: h,
        }),
      e.jsxs("mesh", {
        position: [0, l - i / 2, 0],
        children: [
          e.jsx("coneGeometry", { args: [d, i, 40, 1, !0] }),
          e.jsx("meshBasicMaterial", {
            color: a,
            transparent: !0,
            opacity: u,
            side: Y,
            depthWrite: !1,
            blending: Q,
            toneMapped: !1,
          }),
        ],
      }),
      e.jsx(ss, {
        color: n,
        level: r,
        radius: d * (0.72 + r * 0.16),
        position: [0, l - i + 0.012, 0],
      }),
    ],
  });
}
// ===== ha3d-self: F2 灯具开灯时的光晕 =====
// 首页相机多为俯视，吸顶类灯具的光晕放在灯体上方一点，避免被灯体自身挡住
const ha3dHaloLayouts = {
  "light.ceiling": { size: 0.9, position: [0, 0.07, 0] },
  "light.ceiling_panel": { size: 0.9, position: [0, 0.06, 0] },
  "light.ceiling_round": { size: 0.9, position: [0, 0.07, 0] },
  "light.downlight": { size: 0.35, position: [0, 0.04, 0] },
  "light.chandelier": { size: 1, position: [0, -0.34, 0] },
  "light.wall_sconce": { size: 0.6, position: [0, -0.02, 0.14] },
  "light.floor_lamp": { size: 0.7, position: [0, 1.2, 0] },
};
let ha3dHaloTexture;
// ha3d-self: 0.2.2 光晕贴图改为直接生成像素（ImageData，256×256，带 mipmap）：RGB 恒为 255，只有 alpha 按半径衰减。
// 原来用 2D canvas 的径向渐变（128×128）：canvas 内部按预乘 alpha 存 8 位，上传 WebGL 时再反预乘，
// 低 alpha 处每个通道的舍入误差会变成颜色偏差；各浏览器/GPU 的 canvas 光栅化（抖动、色彩空间转换）也不同。
// 手机上把镜头拉近时，128 px 的贴图被放大到上千像素，这些偏差就成了光晕里的彩色小点。
// 现在不经过 canvas，也不再关掉 mipmap，远看时不闪烁。
const ha3dHaloStops = [
  [0, 1],
  [0.3, 0.85],
  [0.65, 0.4],
  [1, 0],
];
function ha3dHaloAlpha(t) {
  if (t >= 1) return 0;
  for (let s = 1; s < ha3dHaloStops.length; s += 1) {
    const [o, r] = ha3dHaloStops[s - 1],
      [n, a] = ha3dHaloStops[s];
    if (t <= n) {
      const i = (t - o) / (n - o);
      return r + (a - r) * i * i * (3 - 2 * i); // 段内 smoothstep，段与段之间没有折痕
    }
  }
  return 0;
}
function ha3dGetHaloTexture() {
  if (ha3dHaloTexture !== void 0) return ha3dHaloTexture;
  if (typeof ImageData > "u") return (ha3dHaloTexture = null);
  const t = 256,
    s = new Uint8ClampedArray(t * t * 4);
  for (let o = 0; o < t; o += 1)
    for (let r = 0; r < t; r += 1) {
      const n = (o * t + r) * 4,
        a = Math.hypot(r + 0.5 - t / 2, o + 0.5 - t / 2) / (t / 2);
      ((s[n] = 255), (s[n + 1] = 255), (s[n + 2] = 255), (s[n + 3] = Math.round(255 * ha3dHaloAlpha(a))));
    }
  const o = new wr(new ImageData(s, t, t));
  return ((o.colorSpace = ds), (o.magFilter = _t), (ha3dHaloTexture = o));
}
const ha3dNoRaycast = () => {},
  ha3dHaloBase = new J(),
  ha3dHaloToCamera = new J();
// ha3d-self: 0.2.2 光晕是正对相机的平面（sprite），原来放在灯体中心附近，平面从灯体中间穿过：
// 灯体在平面后面的一半被叠加了光，前面的一半没有，看起来一半亮一半暗（像阴影）。
// 现在每帧把光晕沿「灯 → 相机」方向前移半个光晕尺寸，整块平面都在灯体前面，灯体整体被均匀照亮；
// 前移是沿视线方向，所以屏幕上的位置不变，同时按距离缩小，屏幕上的大小也不变。
function ha3dLightHalo({ modelId: t, color: s, brightness: o }) {
  const n = M.useRef(null),
    r = ha3dHaloLayouts[t] ?? ha3dHaloLayouts["light.ceiling"];
  if (
    (te(({ camera: a }) => {
      const i = n.current;
      if (!i || !i.parent) return;
      (i.parent.updateWorldMatrix(!0, !1),
        ha3dHaloBase.set(r.position[0], r.position[1], r.position[2]),
        i.parent.localToWorld(ha3dHaloBase));
      const d = ha3dHaloToCamera.copy(a.position).sub(ha3dHaloBase),
        l = d.length(),
        c = Math.min(r.size * 0.5, l * 0.5),
        h = l > 1e-6 ? (l - c) / l : 1;
      (l > 1e-6 && ha3dHaloBase.addScaledVector(d, c / l),
        i.parent.worldToLocal(ha3dHaloBase),
        i.position.copy(ha3dHaloBase),
        i.scale.set(r.size * h, r.size * h, 1));
    }),
    t === "light.strip")
  )
    return null;
  return e.jsx("sprite", {
    ref: n,
    name: "ha3d-light-halo",
    position: r.position,
    scale: [r.size, r.size, 1],
    renderOrder: 10,
    raycast: ha3dNoRaycast,
    children: e.jsx("spriteMaterial", {
      map: ha3dGetHaloTexture() ?? void 0,
      color: s,
      transparent: !0,
      opacity: Math.min(1, 0.35 + 0.65 * (o ?? 0)),
      blending: Q,
      depthWrite: !1,
      toneMapped: !1,
    }),
  });
}
function qs(t) {
  const s = oe();
  return e.jsxs("group", {
    children: [
      e.jsx(Ga, { ...t }),
      e.jsx(Hn, {
        modelId: t.modelId,
        unavailable: t.unavailable,
        visualStyle: s,
      }),
      // ha3d-self: F2 首页里开灯且可用时追加光晕（开关控制的灯具 Fa 也走这里）；
      // 编辑器 3D 视图不加，避免近距离俯视时光晕盖住灯具的形状和朝向
      t.presentation &&
        t.appearance.isOn &&
        !t.unavailable &&
        e.jsx(ha3dLightHalo, {
          modelId: t.modelId,
          color: t.appearance.color,
          brightness: t.appearance.brightness,
        }),
    ],
  });
}
function Ga({
  modelId: t,
  bodyColor: s,
  appearance: o,
  unavailable: r,
  modeHighlighted: n,
  presentation: a,
  selected: i = !1,
  device: d,
}) {
  const l = oe(),
    c = l === "cartoon" && a,
    h = l === "cream" && a,
    u = o.isOn && !r,
    f = i && !r,
    j = o.brightness,
    v = r ? 0.48 : 1,
    y = r
      ? "#bbc1bf"
      : a
        ? h
          ? T(s, "#fff5e8", 0.68)
          : T(s, "#fbfdff", 0.84)
        : "#eef1ef",
    x = Ds(o.color),
    b = r
      ? "#a5adb2"
      : u
        ? T(x, "#fffdf4", 0.58)
        : f
          ? T(x, "#f8fdff", 0.62)
          : a
            ? "#edf4f6"
            : "#e4e8e5",
    w = u ? (0.28 + j * 1.62) * (n ? 1.1 : 1) : f ? 0.34 : 0,
    S = mt(c, h),
    G = ($ = 0.04) =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx("meshPhysicalMaterial", {
            color: y,
            roughness: $ >= 0.1 ? 0.3 : 0.48,
            metalness: Math.min($, 0.12),
            clearcoat: 0.12,
            clearcoatRoughness: 0.42,
            emissive: f ? x : "#000000",
            emissiveIntensity: f ? 0.06 : 0,
            side: Y,
            transparent: r,
            opacity: v,
          }),
          e.jsx(ee, {
            color: a ? S.color : Bt(y),
            threshold: a ? S.threshold : 34,
            opacity: a ? S.opacity : 0.12,
            transparent: !0,
          }),
        ],
      }),
    L = () =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx("meshPhysicalMaterial", {
            color: b,
            emissive: u || f ? x : "#000000",
            emissiveIntensity: w,
            roughness: a ? 0.22 : 0.3,
            metalness: 0,
            clearcoat: a ? 0.36 : 0.26,
            clearcoatRoughness: a ? 0.5 : 0.6,
            transparent: !0,
            opacity: r ? 0.42 : u ? 0.98 : f ? 0.9 : 0.84,
          }),
          a &&
            e.jsx(ee, {
              color: S.color,
              threshold: S.threshold,
              opacity:
                u || f ? Math.min(S.opacity + 0.06, 0.3) : S.opacity * 0.8,
              transparent: !0,
            }),
        ],
      }),
    I = ($ = 1) =>
      e.jsx("meshBasicMaterial", {
        color: u || f ? x : o.color,
        transparent: !0,
        opacity: u ? (0.12 + j * 0.28) * $ : f ? 0.09 * $ : 0.025,
        depthWrite: !1,
        blending: u || f ? Q : Ee,
        toneMapped: !1,
      });
  if (t === "light.ceiling_panel") {
    const $ = a ? T(y, "#d8dde0", 0.36) : "#d7dcdd",
      p = u || f ? T(x, "#ffffff", 0.52) : "#f4f7f5",
      m = e.jsx("meshPhysicalMaterial", {
        color: y,
        roughness: a ? 0.3 : 0.44,
        metalness: 0.05,
        clearcoat: a ? 0.34 : 0.18,
        clearcoatRoughness: a ? 0.58 : 0.74,
        emissive: f ? x : "#000000",
        emissiveIntensity: f ? 0.08 : 0,
        transparent: r,
        opacity: v,
      }),
      C = e.jsx("meshPhysicalMaterial", {
        color: b,
        emissive: u || f ? x : "#000000",
        emissiveIntensity: w,
        roughness: a ? 0.24 : 0.32,
        metalness: 0,
        clearcoat: a ? 0.34 : 0.24,
        clearcoatRoughness: a ? 0.52 : 0.62,
        transparent: !0,
        opacity: r ? 0.42 : u ? 0.98 : f ? 0.9 : 0.86,
      }),
      O = () =>
        e.jsx("meshPhysicalMaterial", {
          color: $,
          roughness: 0.36,
          metalness: 0.12,
          clearcoat: 0.28,
          clearcoatRoughness: 0.64,
          transparent: r,
          opacity: v,
        });
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [0, 0.011, 0],
          args: [0.52, 0.026, 0.31],
          radius: 0.012,
          smoothness: 5,
          castShadow: !0,
          children: m,
        }),
        e.jsx(B, {
          position: [0, -0.009, 0],
          args: [0.475, 0.02, 0.265],
          radius: 0.009,
          smoothness: 5,
          children: C,
        }),
        e.jsx(B, {
          position: [0, -0.021, -0.143],
          args: [0.47, 0.0035, 0.008],
          radius: 0.0015,
          smoothness: 2,
          children: O(),
        }),
        e.jsx(B, {
          position: [0, -0.021, 0.143],
          args: [0.47, 0.0035, 0.008],
          radius: 0.0015,
          smoothness: 2,
          children: O(),
        }),
        e.jsx(B, {
          position: [-0.243, -0.021, 0],
          args: [0.008, 0.0035, 0.262],
          radius: 0.0015,
          smoothness: 2,
          children: O(),
        }),
        e.jsx(B, {
          position: [0.243, -0.021, 0],
          args: [0.008, 0.0035, 0.262],
          radius: 0.0015,
          smoothness: 2,
          children: O(),
        }),
        e.jsxs("mesh", {
          position: [0, -0.024, 0],
          rotation: [-Math.PI / 2, 0, 0],
          renderOrder: 8,
          children: [
            e.jsx("planeGeometry", { args: [0.43, 0.23] }),
            I(u ? 0.78 : 0.38),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.0242, 0],
          rotation: [-Math.PI / 2, 0, 0],
          renderOrder: 9,
          children: [
            e.jsx("planeGeometry", { args: [0.355, 0.17] }),
            e.jsx("meshBasicMaterial", {
              color: p,
              transparent: !0,
              opacity: r ? 0.06 : u ? 0.18 + j * 0.18 : f ? 0.13 : 0.055,
              depthWrite: !1,
              blending: u || f ? Q : Ee,
              toneMapped: !1,
            }),
          ],
        }),
        u && e.jsx(_e, { color: o.color, brightness: j, variant: "ceiling" }),
      ],
    });
  }
  if (t === "light.ceiling_round")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.016, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.245, 0.262, 0.034, 64] }),
            G(0.05),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.01, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.225, 0.238, 0.03, 64] }),
            L(),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.03, 0],
          rotation: [-Math.PI / 2, 0, 0],
          renderOrder: 8,
          children: [
            e.jsx("circleGeometry", { args: [0.2, 64] }),
            I(u ? 0.78 : 0.38),
          ],
        }),
        u && e.jsx(_e, { color: o.color, brightness: j, variant: "ceiling" }),
      ],
    });
  if (t === "light.downlight") {
    const $ = r ? "#8f98a2" : a ? T(y, "#ffffff", 0.44) : y,
      p = r ? "#a5adb2" : u ? T(x, "#fffaf0", 0.58) : "#dfe5e6";
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          castShadow: !0,
          position: [0, 0.004, 0],
          children: [
            e.jsx("cylinderGeometry", { args: [0.098, 0.108, 0.018, 48] }),
            e.jsx("meshPhysicalMaterial", {
              color: $,
              roughness: a ? 0.28 : 0.36,
              metalness: 0.08,
              clearcoat: 0.28,
              clearcoatRoughness: 0.62,
              transparent: r,
              opacity: v,
            }),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.008, 0],
          children: [
            e.jsx("cylinderGeometry", { args: [0.058, 0.068, 0.014, 48] }),
            e.jsx("meshPhysicalMaterial", {
              color: p,
              emissive: u || f ? x : "#000000",
              emissiveIntensity: u ? 0.28 + j * 1.05 : f ? 0.36 : 0,
              roughness: 0.22,
              metalness: 0,
              clearcoat: 0.3,
              clearcoatRoughness: 0.52,
              transparent: !0,
              opacity: r ? 0.42 : u ? 0.96 : f ? 0.86 : 0.72,
            }),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.017, 0],
          rotation: [-Math.PI / 2, 0, 0],
          renderOrder: 8,
          children: [e.jsx("circleGeometry", { args: [0.07, 48] }), I(0.42)],
        }),
        u && e.jsx(_e, { color: o.color, brightness: j, variant: "downlight" }),
      ],
    });
  }
  if (t === "light.chandelier")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.08, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.1, 0.115, 0.055, 32] }),
            G(0.08),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.16, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.014, 0.014, 0.44, 12] }),
            G(0.18),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.4, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.13, 0.29, 0.24, 40, 1, !0] }),
            G(0.06),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.525, 0],
          children: [
            e.jsx("cylinderGeometry", { args: [0.245, 0.27, 0.026, 40] }),
            L(),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.542, 0],
          rotation: [-Math.PI / 2, 0, 0],
          children: [e.jsx("circleGeometry", { args: [0.25, 40] }), I()],
        }),
        u &&
          e.jsx(_e, { color: o.color, brightness: j, variant: "chandelier" }),
      ],
    });
  if (t === "light.wall_sconce")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0, -0.006],
          rotation: [Math.PI / 2, 0, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.17, 0.17, 0.036, 40] }),
            G(0.08),
          ],
        }),
        e.jsx(B, {
          position: [0, -0.02, 0.036],
          args: [0.26, 0.24, 0.082],
          radius: 0.06,
          smoothness: 6,
          castShadow: !0,
          children: L(),
        }),
        e.jsxs("mesh", {
          position: [0, -0.02, 0.087],
          renderOrder: 8,
          children: [
            e.jsx("circleGeometry", { args: [0.125, 40] }),
            I(u ? 0.62 : 0.32),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.17, 0.036],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.012, 0.012, 0.18, 12] }),
            G(0.16),
          ],
        }),
        u && e.jsx(_e, { color: o.color, brightness: j, variant: "wall" }),
      ],
    });
  if (t === "light.floor_lamp")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.025, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.17, 0.19, 0.05, 32] }),
            G(0.1),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.59, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.018, 0.022, 1.12, 14] }),
            G(0.2),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 1.19, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.17, 0.245, 0.28, 40, 1, !0] }),
            G(0.05),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 1.045, 0],
          children: [
            e.jsx("cylinderGeometry", { args: [0.205, 0.225, 0.024, 40] }),
            L(),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 1.03, 0],
          rotation: [-Math.PI / 2, 0, 0],
          children: [e.jsx("circleGeometry", { args: [0.21, 40] }), I()],
        }),
        u && e.jsx(_e, { color: o.color, brightness: j, variant: "floor" }),
      ],
    });
  if (t === "light.strip") {
    const $ = h ? "#eee4d4" : "#edf4f6",
      p = u ? T(x, "#fff6d6", 0.26) : $,
      m = () =>
        e.jsx("meshBasicMaterial", {
          color: $,
          transparent: !0,
          opacity: r ? 0.22 : 0.46,
          depthWrite: !1,
          toneMapped: !1,
        }),
      C = 0.032,
      O = (g, _, k) => {
        const E = k[0] - _[0],
          P = k[1] - _[1],
          N = Math.max(0.08, Math.hypot(E, P)),
          R = Math.max(0.012, N - C * 2),
          F = Math.atan2(P, E),
          z = [(_[0] + k[0]) / 2, 0, (_[1] + k[1]) / 2];
        return e.jsxs(
          "group",
          {
            position: z,
            rotation: [0, -F, 0],
            children: [
              e.jsx(B, {
                position: [0, 0.023, 0],
                args: [N, 0.018, 0.043],
                radius: 0.005,
                smoothness: 2,
                children: m(),
              }),
              u &&
                e.jsxs("mesh", {
                  rotation: [0, 0, Math.PI / 2],
                  children: [
                    e.jsx("capsuleGeometry", { args: [C * 2.05, R, 8, 24] }),
                    e.jsx("meshBasicMaterial", {
                      color: p,
                      transparent: !0,
                      opacity: (0.12 + j * 0.24) * (n ? 1.15 : 1),
                      depthWrite: !1,
                      blending: Q,
                      toneMapped: !1,
                    }),
                  ],
                }),
              e.jsxs("mesh", {
                rotation: [0, 0, Math.PI / 2],
                children: [
                  e.jsx("capsuleGeometry", { args: [C, R, 8, 28] }),
                  e.jsx("meshBasicMaterial", {
                    color: p,
                    transparent: !0,
                    opacity: r ? 0.2 : u ? 0.94 : 0.34,
                    depthWrite: !1,
                    blending: u ? Q : Ee,
                    toneMapped: !1,
                  }),
                ],
              }),
              e.jsxs("mesh", {
                rotation: [0, 0, Math.PI / 2],
                children: [
                  e.jsx("capsuleGeometry", {
                    args: [0.12, Math.max(0.01, N - 0.24), 4, 12],
                  }),
                  e.jsx("meshBasicMaterial", {
                    transparent: !0,
                    opacity: 0,
                    depthWrite: !1,
                  }),
                ],
              }),
            ],
          },
          g,
        );
      };
    if (d && Ye(d)) {
      const g = [d.position[0], d.position[2]],
        _ = $s(Ls(d), Gs(d));
      return e.jsx("group", {
        children: _.map((k, E) =>
          O(
            `strip-segment-${E}`,
            [k.start[0] - g[0], k.start[1] - g[1]],
            [k.end[0] - g[0], k.end[1] - g[1]],
          ),
        ),
      });
    }
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [0, 0.023, 0],
          args: [0.944, 0.018, 0.043],
          radius: 0.005,
          smoothness: 2,
          children: m(),
        }),
        e.jsxs("mesh", {
          rotation: [0, 0, Math.PI / 2],
          children: [
            e.jsx("capsuleGeometry", { args: [C, 0.88, 8, 28] }),
            e.jsx("meshBasicMaterial", {
              color: p,
              transparent: !0,
              opacity: r ? 0.2 : u ? 0.94 : 0.34,
              depthWrite: !1,
              blending: u ? Q : Ee,
              toneMapped: !1,
            }),
          ],
        }),
      ],
    });
  }
  return e.jsxs("group", {
    children: [
      e.jsxs("mesh", {
        position: [0, 0.018, 0],
        castShadow: !0,
        children: [
          e.jsx("cylinderGeometry", { args: [0.285, 0.31, 0.044, 64] }),
          G(0.05),
        ],
      }),
      e.jsxs("mesh", {
        position: [0, -0.014, 0],
        castShadow: !0,
        children: [
          e.jsx("cylinderGeometry", { args: [0.255, 0.275, 0.036, 64] }),
          L(),
        ],
      }),
      e.jsxs("mesh", {
        position: [0, -0.036, 0],
        rotation: [-Math.PI / 2, 0, 0],
        renderOrder: 8,
        children: [
          e.jsx("ringGeometry", { args: [0.19, 0.265, 64] }),
          I(u ? 0.82 : 0.45),
        ],
      }),
      e.jsxs("mesh", {
        position: [0, -0.038, 0],
        rotation: [-Math.PI / 2, 0, 0],
        renderOrder: 9,
        children: [
          e.jsx("circleGeometry", { args: [0.176, 64] }),
          I(u ? 0.72 : 0.36),
        ],
      }),
      e.jsxs("mesh", {
        position: [0, 0.046, 0],
        rotation: [-Math.PI / 2, 0, 0],
        children: [
          e.jsx("ringGeometry", { args: [0.255, 0.304, 64] }),
          e.jsx("meshBasicMaterial", {
            color: T(y, "#ffffff", 0.32),
            transparent: !0,
            opacity: r ? 0.18 : 0.32,
            depthWrite: !1,
            toneMapped: !1,
          }),
        ],
      }),
      u && e.jsx(_e, { color: o.color, brightness: j, variant: "ceiling" }),
    ],
  });
}
function La({ span: t, height: s, depth: o, children: r }) {
  const n = M.useMemo(() => {
    const i = [],
      d = [],
      l = [];
    for (let h = 0; h <= 10; h += 1) {
      const u = h / 10,
        f = (u - 0.5) * t,
        v = h === 0 || h === 10 ? 0 : (h % 2 === 0 ? 1 : -1) * o;
      (i.push(f, -s / 2, v, f, s / 2, v), d.push(u, 0, u, 1));
    }
    for (let h = 0; h < 10; h += 1) {
      const u = h * 2,
        f = u + 1,
        j = u + 2,
        v = u + 3;
      l.push(u, j, f, f, j, v);
    }
    const c = new Ze();
    return (
      c.setAttribute("position", new nt(i, 3)),
      c.setAttribute("uv", new nt(d, 2)),
      c.setIndex(l),
      c.computeVertexNormals(),
      c
    );
  }, [o, s, t]);
  return e.jsx("mesh", {
    geometry: n,
    castShadow: !0,
    receiveShadow: !0,
    children: r,
  });
}
function $a(t) {
  const s = oe();
  return e.jsxs("group", {
    children: [
      e.jsx(Ta, { ...t }),
      ![
        "binary_sensor.presence",
        "binary_sensor.motion",
        "switch.computer", // ha3d-self: 电脑模型自带细节，不叠加开关面板的指示条
      ].includes(t.modelId) &&
        e.jsx(Bn, {
          modelId: t.modelId,
          unavailable: t.unavailable,
          active: t.glowActive,
          color: t.highlightColor,
          visualStyle: s,
        }),
    ],
  });
}
function Ta({
  kind: t,
  modelId: s,
  bodyColor: o,
  highlightColor: r,
  glowActive: n,
  unavailable: a,
  modeHighlighted: i,
  state: d,
  coverPosition: l,
  climateColor: c,
  presentation: h,
  selected: u = !1,
  entity: f,
}) {
  const j = oe(),
    v = j === "cartoon" && h,
    y = j === "cream" && h,
    x = a ? 0.5 : 1,
    b = t === "fan" || t === "climate" ? (y ? "#f0e9dd" : "#edf2f1") : Xn(o, a),
    w = Zn(o, a),
    S = h ? T(r, "#f7fbff", 0.32) : T(r, "#f5fbff", 0.18),
    G = n ? S : "#000000",
    L = u ? 0.09 : n ? (i ? 0.04 : 0.02) : 0,
    I = ja(l, h ? 6.5 : 9),
    $ = mt(v, y),
    p = (g = 0.46, _ = 0.025, k = "shell") => {
      const E = k === "detail" ? w : b;
      return e.jsxs(e.Fragment, {
        children: [
          e.jsx("meshPhysicalMaterial", {
            color: E,
            roughness: h
              ? Math.max(Math.min(g, 0.4), 0.26)
              : Math.max(g, 0.38),
            metalness: h ? Math.min(_, 0.12) : _,
            clearcoat: h ? 0.38 : 0.22,
            clearcoatRoughness: h ? 0.58 : 0.7,
            emissive: G,
            emissiveIntensity: L,
            transparent: a,
            opacity: x,
          }),
          e.jsx(ee, {
            color: h ? $.color : Bt(E),
            threshold: h ? $.threshold : 34,
            opacity: h ? $.opacity : 0.14,
            transparent: !0,
          }),
        ],
      });
    },
    m = (g = 0.52) =>
      e.jsx("meshBasicMaterial", {
        color: S,
        transparent: !0,
        opacity: a ? 0.12 : g * (h ? 0.66 : 0.76),
        depthWrite: !1,
        toneMapped: !1,
      }),
    C = n || d === "on",
    O = (g) => {
      const _ = g === 1 ? 0.3 : g === 2 ? 0.34 : 0.38;
      return e.jsxs("group", {
        children: [
          e.jsxs(B, {
            args: [_, 0.42, 0.062],
            radius: 0.032,
            smoothness: 4,
            castShadow: !0,
            children: [
              e.jsx("meshPhysicalMaterial", {
                color: b,
                roughness: 0.34,
                metalness: 0.02,
                clearcoat: 0.38,
                clearcoatRoughness: 0.58,
                transparent: a,
                opacity: x,
              }),
              h &&
                e.jsx(ee, {
                  color: $.color,
                  threshold: $.threshold,
                  opacity: $.opacity,
                  transparent: !0,
                }),
            ],
          }),
          Array.from({ length: g }).map((k, E) => {
            const P = g === 1 ? 0 : (E - (g - 1) / 2) * (_ / g);
            return e.jsx(
              "group",
              {
                position: [P, 0, 0.038],
                rotation: [C ? -0.075 : 0.055, 0, 0],
                children: e.jsx(B, {
                  args: [_ / g - 0.032, 0.29, 0.016],
                  radius: 0.018,
                  smoothness: 3,
                  children: e.jsx("meshPhysicalMaterial", {
                    color: C ? T(S, "#ffffff", 0.26) : w,
                    roughness: 0.28,
                    metalness: 0.015,
                    clearcoat: 0.44,
                    clearcoatRoughness: 0.54,
                    emissive: C ? S : "#000000",
                    emissiveIntensity: C ? 0.18 : 0,
                  }),
                }),
              },
              E,
            );
          }),
          e.jsxs("mesh", {
            position: [_ / 2 - 0.055, -0.165, 0.044],
            children: [
              e.jsx("sphereGeometry", { args: [0.018, 16, 8] }),
              e.jsx("meshBasicMaterial", {
                color: C ? S : "#7f8a94",
                transparent: !0,
                opacity: C ? 0.92 : 0.36,
                toneMapped: !1,
              }),
            ],
          }),
          C &&
            e.jsx("pointLight", {
              color: S,
              intensity: 0.32,
              distance: 0.72,
              position: [0, 0, 0.16],
            }),
        ],
      });
    };
  if (s === "switch.outlet")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          args: [0.3, 0.38, 0.06],
          radius: 0.032,
          smoothness: 4,
          castShadow: !0,
          children: p(0.34, 0.02),
        }),
        [-0.055, 0.055].map((g) =>
          e.jsxs(
            "mesh",
            {
              position: [g, 0.05, 0.038],
              children: [
                e.jsx("boxGeometry", { args: [0.024, 0.088, 0.012] }),
                m(C ? 0.78 : 0.34),
              ],
            },
            g,
          ),
        ),
        e.jsxs("mesh", {
          position: [0, -0.085, 0.04],
          children: [
            e.jsx("circleGeometry", { args: [0.028, 22] }),
            m(C ? 0.52 : 0.28),
          ],
        }),
        C &&
          e.jsx("pointLight", {
            color: S,
            intensity: 0.28,
            distance: 0.64,
            position: [0, 0, 0.14],
          }),
      ],
    });
  if (s === "switch.scene")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          args: [0.34, 0.34, 0.06],
          radius: 0.06,
          smoothness: 5,
          castShadow: !0,
          children: p(0.32, 0.02),
        }),
        [-0.07, 0.07].flatMap((g) =>
          [-0.07, 0.07].map((_) =>
            e.jsxs(
              "mesh",
              {
                position: [g, _, 0.038],
                children: [
                  e.jsx("circleGeometry", { args: [0.036, 22] }),
                  m(C ? 0.72 : 0.3),
                ],
              },
              `${g}-${_}`,
            ),
          ),
        ),
        C &&
          e.jsx("pointLight", {
            color: S,
            intensity: 0.3,
            distance: 0.7,
            position: [0, 0, 0.16],
          }),
      ],
    });
  if (s === "switch.ac_airflow")
    return e.jsxs("group", {
      children: [
        O(1),
        e.jsxs("mesh", {
          position: [0, 0.055, 0.052],
          children: [
            e.jsx("boxGeometry", { args: [0.18, 0.026, 0.012] }),
            m(C ? 0.68 : 0.3),
          ],
        }),
        [-0.075, 0, 0.075].map((g) =>
          e.jsxs(
            "mesh",
            {
              position: [g, -0.085, 0.054],
              children: [
                e.jsx("boxGeometry", { args: [0.044, 0.012, 0.012] }),
                m(C ? 0.54 : 0.2),
              ],
            },
            g,
          ),
        ),
        C &&
          e.jsx("group", {
            position: [0, -0.04, 0.13],
            scale: [0.72, 0.72, 0.72],
            children: e.jsx(va, { color: c, variant: "forward" }),
          }),
      ],
    });
  if (s === "switch.double") return O(2);
  if (s === "switch.triple") return O(3);
  // ===== ha3d-self: F7 电脑样式开关（显示器 + 底座支架、键盘、主机箱、电源灯；正面朝 +z） =====
  if (s === "switch.computer") {
    const g = d === "on" && !a,
      _ = y ? "#5a4f45" : "#2f3742",
      k = y ? "#8a7d6e" : "#5b6573",
      E = (q, N = 0.42, R = 0.1) =>
        e.jsx("meshPhysicalMaterial", {
          color: q,
          roughness: N,
          metalness: R,
          clearcoat: 0.2,
          clearcoatRoughness: 0.6,
          transparent: a,
          opacity: x,
        }),
      P = (N) =>
        h &&
        e.jsx(ee, {
          color: $.color,
          threshold: $.threshold,
          opacity: N ?? $.opacity,
          transparent: !0,
        });
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.008, -0.1],
          castShadow: !0,
          children: [e.jsx("boxGeometry", { args: [0.22, 0.016, 0.16] }), E(k)],
        }),
        e.jsxs("mesh", {
          position: [0, 0.1, -0.135],
          castShadow: !0,
          children: [e.jsx("boxGeometry", { args: [0.04, 0.17, 0.03] }), E(k)],
        }),
        e.jsxs(B, {
          position: [0, 0.3, -0.115],
          args: [0.56, 0.34, 0.03],
          radius: 0.01,
          smoothness: 3,
          castShadow: !0,
          children: [E(_, 0.36, 0.08), P()],
        }),
        e.jsxs("mesh", {
          name: "ha3d-computer-screen",
          position: [0, 0.305, -0.099],
          children: [
            e.jsx("planeGeometry", { args: [0.52, 0.3] }),
            e.jsx("meshStandardMaterial", {
              color: g ? "#dbeafe" : "#0b0f14",
              emissive: g ? "#9cc8ff" : "#000000",
              emissiveIntensity: g ? 0.9 : 0,
              roughness: 0.18,
              metalness: 0,
              transparent: a,
              opacity: x,
            }),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.009, 0.1],
          castShadow: !0,
          children: [e.jsx("boxGeometry", { args: [0.42, 0.018, 0.13] }), E(k)],
        }),
        e.jsxs("mesh", {
          position: [0, 0.0195, 0.1],
          children: [
            e.jsx("boxGeometry", { args: [0.38, 0.004, 0.1] }),
            E(T(k, "#ffffff", 0.35), 0.6, 0),
          ],
        }),
        e.jsxs(B, {
          position: [0.42, 0.2, -0.04],
          args: [0.18, 0.4, 0.38],
          radius: 0.012,
          smoothness: 3,
          castShadow: !0,
          children: [E(_, 0.4, 0.12), P()],
        }),
        e.jsxs("mesh", {
          position: [0.42, 0.33, 0.152],
          children: [
            e.jsx("sphereGeometry", { args: [0.011, 12, 8] }),
            e.jsx("meshBasicMaterial", {
              color: g ? "#5ee08a" : "#4b5563",
              toneMapped: !1,
            }),
          ],
        }),
      ],
    });
  }
  if (t === "switch") return O(1);
  // ===== ha3d-self: F8 晾衣架（吊顶底座、两组吊绳、横杆按开合度升降） =====
  // ha3d-self: 0.2.1 映射反过来：晾衣架接入 HA 的 cover 一般把「降下」当作打开，position 100（open）降到最低，0（closed）收到顶
  // ha3d-self: 0.2.2 伸缩杆最长从 1 m 减半到 0.5 m（收起仍是 0.15 m），挂衣服的阈值按比例从 0.4 改到 0.25
  if (s === "cover.clothes_rack") {
    const g = X.clamp(I / 100, 0, 1),
      _ = X.lerp(0.15, 0.5, g),
      k = e.jsx("meshPhysicalMaterial", {
        color: T(b, "#ffffff", 0.36),
        roughness: 0.34,
        metalness: 0.24,
        clearcoat: 0.3,
        clearcoatRoughness: 0.56,
        transparent: a,
        opacity: a ? 0.4 : 1,
      }),
      E = e.jsx("meshBasicMaterial", {
        color: T(w, "#ffffff", h ? 0.4 : 0.2),
        transparent: !0,
        opacity: a ? 0.2 : 0.7,
        toneMapped: !1,
      }),
      P = y
        ? ["#c79a7a", "#9fb59a", "#d8c7a6"]
        : ["#8fb8de", "#f0b48a", "#b9d7a1"];
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, -0.02, 0],
          castShadow: !0,
          children: [e.jsx("boxGeometry", { args: [1.02, 0.05, 0.16] }), k],
        }),
        e.jsxs("mesh", {
          position: [0, -0.046, 0.082],
          children: [
            e.jsx("boxGeometry", { args: [0.3, 0.012, 0.006] }),
            m(n ? 0.5 : 0.2),
          ],
        }),
        [-0.38, 0.38].flatMap((N) =>
          [-0.05, 0.05].map((R) =>
            e.jsxs(
              "mesh",
              {
                position: [N, -0.045 - (_ - 0.045) / 2, R],
                children: [
                  e.jsx("cylinderGeometry", {
                    args: [0.004, 0.004, Math.max(0.01, _ - 0.045), 6],
                  }),
                  E,
                ],
              },
              `${N}-${R}`,
            ),
          ),
        ),
        e.jsxs("group", {
          name: "ha3d-clothes-rack-bars",
          position: [0, -_, 0],
          children: [
            [-0.06, 0.06].map((N) =>
              e.jsxs(
                "mesh",
                {
                  position: [0, 0, N],
                  rotation: [0, 0, Math.PI / 2],
                  castShadow: !0,
                  children: [
                    e.jsx("cylinderGeometry", { args: [0.012, 0.012, 1.06, 12] }),
                    k,
                  ],
                },
                N,
              ),
            ),
            [-0.38, 0.38].map((N) =>
              e.jsxs(
                "mesh",
                {
                  position: [N, 0.012, 0],
                  children: [
                    e.jsx("boxGeometry", { args: [0.04, 0.03, 0.17] }),
                    k,
                  ],
                },
                N,
              ),
            ),
            _ > 0.25 &&
              [-0.3, 0, 0.3].map((N, R) =>
                e.jsxs(
                  "group",
                  {
                    position: [N, -0.03, 0.06],
                    children: [
                      e.jsxs("mesh", {
                        position: [0, -0.04, 0],
                        children: [
                          e.jsx("boxGeometry", { args: [0.2, 0.012, 0.006] }),
                          E,
                        ],
                      }),
                      e.jsxs("mesh", {
                        position: [0, -0.1, 0],
                        castShadow: !0,
                        children: [
                          e.jsx("boxGeometry", { args: [0.34, 0.09, 0.012] }),
                          e.jsx("meshStandardMaterial", {
                            color: P[R],
                            roughness: 0.92,
                            side: Y,
                          }),
                        ],
                      }),
                      e.jsxs("mesh", {
                        position: [0, -0.27, 0],
                        castShadow: !0,
                        children: [
                          e.jsx("boxGeometry", { args: [0.22, 0.32, 0.012] }),
                          e.jsx("meshStandardMaterial", {
                            color: P[R],
                            roughness: 0.92,
                            side: Y,
                          }),
                        ],
                      }),
                    ],
                  },
                  N,
                ),
              ),
          ],
        }),
      ],
    });
  }
  if (s === "cover.blind") {
    const g = X.clamp(I / 100, 0, 1),
      _ = 0.92,
      P = X.lerp(0.72, 0.2, g),
      N = 0.11,
      R = 10,
      F = X.lerp(-0.06, 0.72, g),
      z = (K, q = 0.12) =>
        e.jsx("meshPhysicalMaterial", {
          color: T(w, h ? "#f7fbff" : "#ffffff", q),
          roughness: 0.54,
          metalness: 0.02,
          clearcoat: 0.16,
          clearcoatRoughness: 0.72,
          transparent: !0,
          opacity: a ? 0.22 : K,
          side: Y,
        }),
      U = e.jsx("meshPhysicalMaterial", {
        color: T(b, "#ffffff", 0.38),
        roughness: 0.34,
        metalness: 0.2,
        clearcoat: 0.28,
        clearcoatRoughness: 0.54,
        transparent: a,
        opacity: a ? 0.38 : 1,
      }),
      V = e.jsx("meshBasicMaterial", {
        color: T(w, "#ffffff", h ? 0.48 : 0.28),
        transparent: !0,
        opacity: a ? 0.18 : h ? 0.34 : 0.5,
        toneMapped: !1,
      }),
      D = N - P;
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.18, 0],
          castShadow: !0,
          children: [
            e.jsx("boxGeometry", { args: [_ + 0.1, 0.044, 0.048] }),
            U,
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.206, 0.022],
          children: [
            e.jsx("boxGeometry", { args: [_ * 0.74, 0.01, 0.008] }),
            m(n ? 0.4 : 0.16),
          ],
        }),
        [-0.36, 0, 0.36].map((K) =>
          e.jsxs(
            "mesh",
            {
              position: [K, N - P / 2, 0.032],
              children: [
                e.jsx("cylinderGeometry", {
                  args: [0.004, 0.004, P + 0.05, 8],
                }),
                V,
              ],
            },
            `cord-${K}`,
          ),
        ),
        Array.from({ length: R }).map((K, q) => {
          const se = q / (R - 1),
            ve = N - se * P,
            ue = X.lerp(0.72, 0.48, g) * (1 - q * 0.018);
          return e.jsxs(
            "mesh",
            {
              position: [0, ve, 0.012 + (q % 2) * 0.004],
              rotation: [F, 0, 0],
              castShadow: !0,
              receiveShadow: !0,
              children: [
                e.jsx("boxGeometry", { args: [_, 0.012, 0.054] }),
                z(ue, q % 2 === 0 ? 0.18 : 0.06),
              ],
            },
            q,
          );
        }),
        e.jsxs("mesh", {
          position: [0, D - 0.035, 0.025],
          castShadow: !0,
          children: [
            e.jsx("boxGeometry", { args: [_ * 0.9, 0.026, 0.026] }),
            U,
          ],
        }),
        e.jsxs("mesh", {
          position: [_ / 2 + 0.06, N - P * 0.36, 0.035],
          children: [
            e.jsx("cylinderGeometry", { args: [0.004, 0.004, P * 0.62, 8] }),
            V,
          ],
        }),
        [0, 1, 2].map((K) =>
          e.jsxs(
            "mesh",
            {
              position: [_ / 2 + 0.06, D + 0.04 - K * 0.036, 0.035],
              children: [
                e.jsx("sphereGeometry", { args: [0.012, 12, 8] }),
                m(n ? 0.34 : 0.18),
              ],
            },
            `pull-${K}`,
          ),
        ),
      ],
    });
  }
  if (s === "cover.curtain") {
    const g = X.clamp(I / 100, 0, 1),
      _ = (P = 0.82) =>
        e.jsx("meshPhysicalMaterial", {
          color: T(w, h ? "#edf5ff" : "#ffffff", h ? 0.18 : 0.08),
          side: Y,
          roughness: 0.96,
          metalness: 0,
          bumpMap: Ft,
          bumpScale: 0.004,
          sheen: 0.35,
          sheenColor: "#e4e9e5",
          transparent: a,
          opacity: a ? 0.26 : 1,
        }),
      k = e.jsx("meshPhysicalMaterial", {
        color: T(b, "#ffffff", 0.42),
        roughness: 0.36,
        metalness: 0.22,
        clearcoat: 0.34,
        clearcoatRoughness: 0.58,
        transparent: a,
        opacity: a ? 0.42 : 1,
      }),
      E = (P) => {
        const N = X.lerp(0.47, 0.145, g),
          R = P * X.lerp(0.235, 0.425, g),
          F = X.lerp(0.018, 0.045, g);
        return e.jsxs(
          "group",
          {
            position: [R, -0.34, 0.018],
            children: [
              e.jsx(La, { span: N, height: 0.9, depth: F, children: _(0.76) }),
              e.jsx(B, {
                position: [0, -0.435, 0],
                args: [N, 0.022, F],
                radius: 0.004,
                smoothness: 2,
                children: _(),
              }),
            ],
          },
          P,
        );
      };
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.17, 0],
          castShadow: !0,
          children: [e.jsx("boxGeometry", { args: [1.04, 0.026, 0.035] }), k],
        }),
        e.jsxs("mesh", {
          position: [0, 0.205, 0.006],
          children: [
            e.jsx("boxGeometry", { args: [0.58, 0.014, 0.012] }),
            m(0.24),
          ],
        }),
        [-0.52, 0.52].map((P) =>
          e.jsxs(
            "mesh",
            {
              position: [P, 0.17, 0],
              children: [e.jsx("sphereGeometry", { args: [0.026, 18, 10] }), k],
            },
            P,
          ),
        ),
        [-0.34, -0.2, -0.06, 0.08, 0.22, 0.36].map((P) =>
          e.jsxs(
            "mesh",
            {
              position: [P, 0.135, 0.014],
              children: [
                e.jsx("boxGeometry", { args: [0.012, 0.05, 0.012] }),
                m(0.16),
              ],
            },
            P,
          ),
        ),
        E(-1),
        E(1),
      ],
    });
  }
  if (s === "climate.floor_ac") {
    const g = bt(d, f == null ? void 0 : f.attributes.hvac_action, a);
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [0, 0.54, 0],
          args: [0.36, 1.08, 0.25],
          radius: 0.08,
          smoothness: 6,
          castShadow: !0,
          children: e.jsx("meshPhysicalMaterial", {
            color: b,
            roughness: 0.34,
            metalness: 0.035,
            clearcoat: 0.32,
            clearcoatRoughness: 0.64,
            emissive: g ? c : "#000000",
            emissiveIntensity: g ? 0.08 : 0,
            transparent: a,
            opacity: x,
          }),
        }),
        e.jsxs("mesh", {
          position: [0, 0.92, 0.132],
          children: [
            e.jsx("boxGeometry", { args: [0.17, 0.064, 0.012] }),
            m(g ? 0.66 : 0.25),
          ],
        }),
        [-0.19, -0.1, -0.01, 0.08, 0.17, 0.26].map((_, k) =>
          e.jsxs(
            "mesh",
            {
              position: [0, 0.52 + _, 0.136],
              rotation: [g ? -0.1 - k * 0.012 : 0, 0, 0],
              children: [
                e.jsx("boxGeometry", { args: [0.235, 0.012, 0.012] }),
                m(g ? 0.54 : 0.17),
              ],
            },
            _,
          ),
        ),
        g && e.jsx(Ca, { color: c }),
      ],
    });
  }
  if (s === "climate.central_ac") {
    const g = bt(d, f == null ? void 0 : f.attributes.hvac_action, a),
      _ = T(b, "#ffffff", 0.18),
      k = T(b, "#f8fbff", 0.36),
      E = T(b, "#8b9b9d", 0.48);
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [0, -0.07, 0],
          args: [0.92, 0.2, 0.34],
          radius: 0.055,
          smoothness: 7,
          castShadow: !0,
          children: e.jsx("meshPhysicalMaterial", {
            color: _,
            roughness: 0.32,
            metalness: 0.045,
            clearcoat: 0.36,
            clearcoatRoughness: 0.6,
            emissive: g ? c : "#000000",
            emissiveIntensity: g ? 0.075 : 0,
            transparent: a,
            opacity: x,
          }),
        }),
        e.jsx(B, {
          position: [0, -0.085, 0.19],
          args: [0.78, 0.085, 0.045],
          radius: 0.018,
          smoothness: 4,
          children: e.jsx("meshPhysicalMaterial", {
            color: k,
            roughness: 0.24,
            metalness: 0.025,
            clearcoat: 0.46,
            clearcoatRoughness: 0.52,
            emissive: g ? c : "#000000",
            emissiveIntensity: g ? 0.16 : 0,
            transparent: !0,
            opacity: a ? 0.26 : 0.82,
          }),
        }),
        e.jsxs("mesh", {
          position: [0, -0.086, 0.217],
          children: [
            e.jsx("boxGeometry", { args: [0.7, 0.052, 0.01] }),
            e.jsx("meshPhysicalMaterial", {
              color: E,
              roughness: 0.42,
              metalness: 0.02,
              transparent: !0,
              opacity: a ? 0.18 : 0.78,
            }),
          ],
        }),
        [-0.031, -0.01, 0.011, 0.032].map((P, N) =>
          e.jsxs(
            "mesh",
            {
              position: [0, -0.086 + P, 0.225],
              rotation: [g ? -0.18 - N * 0.018 : -0.05, 0, 0],
              children: [
                e.jsx("boxGeometry", { args: [0.68, 0.006, 0.018] }),
                m(g ? 0.62 : 0.26),
              ],
            },
            P,
          ),
        ),
        [-0.36, 0.36].map((P) =>
          e.jsxs(
            "mesh",
            {
              position: [P, -0.085, 0.223],
              children: [
                e.jsx("boxGeometry", { args: [0.018, 0.07, 0.018] }),
                m(g ? 0.42 : 0.18),
              ],
            },
            P,
          ),
        ),
        e.jsxs("mesh", {
          position: [0, 0.034, -0.045],
          children: [
            e.jsx("boxGeometry", { args: [0.72, 0.018, 0.18] }),
            m(g ? 0.28 : 0.11),
          ],
        }),
        g && e.jsx(Sa, { color: c }),
      ],
    });
  }
  if (s === "climate.thermostat")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          castShadow: !0,
          args: [0.32, 0.38, 0.058],
          radius: Math.min(0.32, 0.38, 0.058) * 0.18,
          smoothness: 3,
          children: p(0.32, 0.03),
        }),
        e.jsxs("mesh", {
          position: [0, 0.035, 0.034],
          children: [
            e.jsx("circleGeometry", { args: [0.082, 32] }),
            m(n ? 0.62 : 0.28),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.11, 0.035],
          children: [
            e.jsx("boxGeometry", { args: [0.15, 0.026, 0.012] }),
            m(0.24),
          ],
        }),
      ],
    });
  if (s === "climate.wall_ac") {
    const g = bt(d, f == null ? void 0 : f.attributes.hvac_action, a),
      _ = d === "heat" ? T(c, "#ffd6bd", 0.34) : c,
      k = d === "heat" ? "#ffad78" : "#35cfff";
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          args: [0.54, 0.22, 0.18],
          radius: 0.055,
          smoothness: 7,
          castShadow: !0,
          children: e.jsx("meshPhysicalMaterial", {
            color: b,
            roughness: 0.28,
            metalness: 0.025,
            clearcoat: 0.46,
            clearcoatRoughness: 0.52,
            emissive: g ? _ : "#000000",
            emissiveIntensity: g ? 0.055 : 0,
            transparent: a,
            opacity: x,
          }),
        }),
        e.jsx(B, {
          position: [0, -0.058, 0.098],
          args: [0.41, 0.045, 0.026],
          radius: 0.018,
          smoothness: 4,
          children: e.jsx("meshPhysicalMaterial", {
            color: T(b, "#ffffff", 0.42),
            roughness: 0.24,
            metalness: 0.02,
            clearcoat: 0.5,
            clearcoatRoughness: 0.48,
            emissive: g ? _ : "#000000",
            emissiveIntensity: g ? 0.18 : 0,
            transparent: !0,
            opacity: a ? 0.22 : 0.76,
          }),
        }),
        e.jsxs("mesh", {
          position: [-0.145, 0.064, 0.096],
          children: [
            e.jsx("circleGeometry", { args: [0.012, 24] }),
            e.jsx("meshBasicMaterial", {
              color: k,
              transparent: !0,
              opacity: g ? 0.82 : 0.26,
              depthWrite: !1,
              toneMapped: !1,
            }),
          ],
        }),
        e.jsxs("mesh", {
          position: [0.185, -0.006, 0.099],
          children: [
            e.jsx("sphereGeometry", { args: [0.014, 16, 8] }),
            e.jsx("meshBasicMaterial", {
              color: g ? k : "#b5bfbe",
              transparent: !0,
              opacity: a ? 0.28 : 0.82,
              toneMapped: !1,
            }),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.074, 0.096],
          children: [
            e.jsx("planeGeometry", { args: [0.34, 0.024] }),
            e.jsx("meshBasicMaterial", {
              color: "#ffffff",
              transparent: !0,
              opacity: a ? 0.08 : 0.22,
              depthWrite: !1,
              toneMapped: !1,
            }),
          ],
        }),
        g && e.jsx(ka, { color: _ }),
        g && h && e.jsx(za, { color: k, temperature: Pa(f) }),
      ],
    });
  }
  if (s === "sensor.temperature")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          castShadow: !0,
          args: [0.26, 0.34, 0.052],
          radius: Math.min(0.26, 0.34, 0.052) * 0.18,
          smoothness: 3,
          children: p(0.36, 0.02),
        }),
        e.jsxs("mesh", {
          position: [0, 0.045, 0.032],
          children: [
            e.jsx("boxGeometry", { args: [0.14, 0.075, 0.01] }),
            m(n ? 0.58 : 0.24),
          ],
        }),
        e.jsxs("mesh", {
          position: [-0.075, -0.085, 0.033],
          children: [
            e.jsx("boxGeometry", { args: [0.018, 0.11, 0.01] }),
            m(0.42),
          ],
        }),
        e.jsxs("mesh", {
          position: [-0.075, -0.145, 0.034],
          children: [e.jsx("circleGeometry", { args: [0.033, 18] }), m(0.42)],
        }),
      ],
    });
  if (s === "sensor.humidity")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          castShadow: !0,
          rotation: [Math.PI / 2, 0, 0],
          children: [
            e.jsx("cylinderGeometry", { args: [0.13, 0.13, 0.08, 48] }),
            p(0.38, 0.02),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.01, 0.045],
          children: [
            e.jsx("circleGeometry", { args: [0.07, 24] }),
            m(n ? 0.64 : 0.3),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.018, 0.052],
          children: [
            e.jsx("sphereGeometry", { args: [0.026, 14, 8] }),
            m(0.48),
          ],
        }),
      ],
    });
  if (s === "sensor.light_level")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.12, 0.14, 0.07, 30] }),
            p(0.34, 0.03),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.043, 0],
          rotation: [-Math.PI / 2, 0, 0],
          children: [
            e.jsx("circleGeometry", { args: [0.087, 28] }),
            m(n ? 0.72 : 0.34),
          ],
        }),
        [0, 1, 2, 3].map((g) =>
          e.jsxs(
            "mesh",
            {
              rotation: [0, 0, (g * Math.PI) / 2],
              position: [0, -0.05, 0],
              children: [
                e.jsx("boxGeometry", { args: [0.19, 0.012, 0.012] }),
                e.jsx("meshBasicMaterial", {
                  color: S,
                  transparent: !0,
                  opacity: a ? 0.08 : 0.16,
                  depthWrite: !1,
                  toneMapped: !1,
                }),
              ],
            },
            g,
          ),
        ),
      ],
    });
  if (s === "sensor.air_quality")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          castShadow: !0,
          args: [0.3, 0.3, 0.055],
          radius: Math.min(0.3, 0.3, 0.055) * 0.18,
          smoothness: 3,
          children: p(0.34, 0.03),
        }),
        [-0.075, 0, 0.075].map((g) =>
          e.jsxs(
            "mesh",
            {
              position: [g, 0.045, 0.033],
              children: [
                e.jsx("circleGeometry", { args: [0.026, 16] }),
                m(n ? 0.64 : 0.28),
              ],
            },
            g,
          ),
        ),
        e.jsxs("mesh", {
          position: [0, -0.075, 0.034],
          children: [
            e.jsx("boxGeometry", { args: [0.18, 0.03, 0.01] }),
            m(0.26),
          ],
        }),
      ],
    });
  if (s === "sensor.co2")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          args: [0.31, 0.29, 0.06],
          radius: 0.038,
          smoothness: 4,
          castShadow: !0,
          children: p(0.34, 0.03),
        }),
        e.jsxs("mesh", {
          position: [0, 0.055, 0.038],
          children: [
            e.jsx("boxGeometry", { args: [0.18, 0.052, 0.012] }),
            m(n ? 0.62 : 0.26),
          ],
        }),
        [-0.07, 0, 0.07].map((g) =>
          e.jsxs(
            "mesh",
            {
              position: [g, -0.035, 0.039],
              children: [
                e.jsx("boxGeometry", { args: [0.032, 0.072, 0.01] }),
                m(n ? 0.5 : 0.22),
              ],
            },
            g,
          ),
        ),
        e.jsxs("mesh", {
          position: [0, -0.095, 0.04],
          children: [
            e.jsx("boxGeometry", { args: [0.14, 0.018, 0.01] }),
            m(0.24),
          ],
        }),
      ],
    });
  if (s === "sensor.pm25")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          castShadow: !0,
          rotation: [Math.PI / 2, 0, 0],
          children: [
            e.jsx("cylinderGeometry", { args: [0.15, 0.17, 0.06, 48] }),
            p(0.36, 0.03),
          ],
        }),
        [
          [-0.065, 0.035, 0.036],
          [0, 0.055, 0.038],
          [0.065, 0.035, 0.036],
          [-0.035, -0.045, 0.038],
          [0.045, -0.055, 0.038],
        ].map(([g, _, k], E) =>
          e.jsxs(
            "mesh",
            {
              position: [g, _, k],
              children: [
                e.jsx("sphereGeometry", { args: [0.022, 14, 8] }),
                m(n ? 0.68 : 0.3),
              ],
            },
            E,
          ),
        ),
        n &&
          e.jsxs("mesh", {
            rotation: [-Math.PI / 2, 0, 0],
            position: [0, 0, 0.002],
            children: [
              e.jsx("ringGeometry", { args: [0.18, 0.24, 34] }),
              m(0.14),
            ],
          }),
      ],
    });
  if (s === "sensor.power")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          castShadow: !0,
          args: [0.28, 0.34, 0.055],
          radius: Math.min(0.28, 0.34, 0.055) * 0.18,
          smoothness: 3,
          children: p(0.35, 0.04),
        }),
        [0.04, 0.08, 0.13].map((g, _) =>
          e.jsxs(
            "mesh",
            {
              position: [-0.065 + _ * 0.065, -0.08 + g / 2, 0.034],
              children: [
                e.jsx("boxGeometry", { args: [0.034, g, 0.012] }),
                m(n ? 0.58 : 0.28),
              ],
            },
            _,
          ),
        ),
        e.jsxs("mesh", {
          position: [0, 0.085, 0.034],
          children: [
            e.jsx("boxGeometry", { args: [0.16, 0.045, 0.012] }),
            m(0.24),
          ],
        }),
      ],
    });
  if (t === "sensor")
    return e.jsxs("mesh", {
      castShadow: !0,
      rotation: [Math.PI / 2, 0, 0],
      children: [
        e.jsx("cylinderGeometry", { args: [0.11, 0.13, 0.07, 48] }),
        p(0.4, 0.02),
      ],
    });
  if (s === "binary_sensor.motion" || s === "binary_sensor.presence") {
    const g = At(f),
      _ = (k = 1) =>
        e.jsx("meshBasicMaterial", {
          color: g.color,
          transparent: !0,
          opacity: k,
          depthWrite: !1,
          toneMapped: !1,
          side: Y,
        });
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.155, 0.17, 0.065, 48] }),
            e.jsx("meshPhysicalMaterial", {
              color: y ? "#f1eadd" : "#edf3f2",
              roughness: 0.48,
              clearcoat: 0.16,
              transparent: !0,
              opacity: a ? 0.45 : 0.92,
            }),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.036, 0],
          scale: [1, 0.32, 1],
          children: [
            e.jsx("sphereGeometry", { args: [0.12, 32, 16] }),
            e.jsx("meshPhysicalMaterial", {
              color: y ? "#f9f4e9" : "#f6faf9",
              roughness: 0.58,
              transparent: !0,
              opacity: 0.72,
            }),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.042, 0],
          rotation: [Math.PI / 2, 0, 0],
          children: [
            e.jsx("ringGeometry", { args: [0.135, 0.15, 48] }),
            _(g.active ? 0.95 : 0.48),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.036, 0],
          rotation: [-Math.PI / 2, 0, 0],
          children: [e.jsx("circleGeometry", { args: [0.035, 24] }), _()],
        }),
      ],
    });
  }
  if (s === "binary_sensor.smoke")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.17, 0.19, 0.08, 34] }),
            p(0.42, 0.03),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.045, 0],
          rotation: [-Math.PI / 2, 0, 0],
          children: [
            e.jsx("ringGeometry", { args: [0.08, 0.145, 32] }),
            m(n ? 0.56 : 0.2),
          ],
        }),
      ],
    });
  if (s === "binary_sensor.water")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.035, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.16, 0.18, 0.07, 28] }),
            p(0.44, 0.02),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.079, 0],
          rotation: [-Math.PI / 2, 0, 0],
          children: [
            e.jsx("ringGeometry", { args: [0.07, 0.13, 30] }),
            m(n ? 0.58 : 0.24),
          ],
        }),
      ],
    });
  if (s === "binary_sensor.door")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [-0.045, 0, 0],
          castShadow: !0,
          args: [0.11, 0.3, 0.055],
          radius: Math.min(0.11, 0.3, 0.055) * 0.18,
          smoothness: 3,
          children: p(0.34, 0.04),
        }),
        e.jsx(B, {
          position: [0.075, 0, 0],
          castShadow: !0,
          args: [0.055, 0.24, 0.045],
          radius: Math.min(0.055, 0.24, 0.045) * 0.18,
          smoothness: 3,
          children: p(0.4, 0.03),
        }),
        n &&
          e.jsxs("mesh", {
            position: [-0.045, 0.11, 0.032],
            children: [e.jsx("circleGeometry", { args: [0.024, 16] }), m(0.78)],
          }),
      ],
    });
  if (t === "binary_sensor")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          castShadow: !0,
          args: [0.24, 0.3, 0.055],
          radius: Math.min(0.24, 0.3, 0.055) * 0.18,
          smoothness: 3,
          children: p(0.34, 0.04),
        }),
        e.jsxs("mesh", {
          position: [0, 0.08, 0.033],
          children: [
            e.jsx("circleGeometry", { args: [0.034, 18] }),
            m(n ? 0.68 : 0.3),
          ],
        }),
      ],
    });
  if (s === "fan.floor") {
    const g = !a && d === "on",
      _ = T(b, "#d9f1ff", 0.34),
      k = 0.82,
      E = [0, 1, 2, 3, 4].map((R) =>
        e.jsx(
          "group",
          {
            rotation: [0, 0, (R * Math.PI * 2) / 5 - 0.08],
            children: e.jsxs("mesh", {
              position: [0, 0, 0.034],
              rotation: [0, 0, 0.08],
              scale: [0.72, 0.78, 1],
              castShadow: !0,
              children: [
                e.jsx("shapeGeometry", { args: [_a] }),
                e.jsx("meshPhysicalMaterial", {
                  color: T(_, "#7f9ab0", 0.2),
                  roughness: 0.46,
                  metalness: 0.015,
                  clearcoat: 0.18,
                  clearcoatRoughness: 0.7,
                  transparent: a,
                  opacity: x * 0.92,
                  emissive: G,
                  emissiveIntensity: L * 0.32,
                  side: Y,
                }),
              ],
            }),
          },
          R,
        ),
      ),
      P = Array.from({ length: 24 }, (R, F) => (F * Math.PI * 2) / 24).map(
        (R) =>
          e.jsxs(
            "mesh",
            {
              position: [Math.cos(R) * 0.122, Math.sin(R) * 0.122, 0.082],
              rotation: [0, 0, R],
              children: [
                e.jsx("boxGeometry", { args: [0.19, 0.0027, 0.0032] }),
                e.jsx("meshBasicMaterial", {
                  color: T(S, "#ffffff", 0.28),
                  transparent: !0,
                  opacity: a ? 0.06 : 0.26,
                  depthWrite: !1,
                  toneMapped: !1,
                }),
              ],
            },
            R,
          ),
      ),
      N = [0.092, 0.162, 0.228].map((R, F) =>
        e.jsxs(
          "mesh",
          {
            position: [0, 0, 0.086],
            children: [
              e.jsx("torusGeometry", {
                args: [R, F === 2 ? 0.0065 : 0.0035, 7, 84],
              }),
              e.jsx("meshBasicMaterial", {
                color: T(S, "#ffffff", 0.32),
                transparent: !0,
                opacity: a ? 0.06 : F === 2 ? 0.28 : 0.18,
                depthWrite: !1,
                toneMapped: !1,
              }),
            ],
          },
          R,
        ),
      );
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.032, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.21, 0.248, 0.064, 64] }),
            p(0.42, 0.1),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.077, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.132, 0.17, 0.032, 52] }),
            p(0.34, 0.08, "detail"),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.44, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.016, 0.021, 0.78, 24] }),
            p(0.31, 0.18, "detail"),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.79, 0.01],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.04, 0.052, 0.075, 24] }),
            p(0.34, 0.1),
          ],
        }),
        e.jsx(ts, {
          active: g,
          amplitude: 0.16,
          speed: 0.86,
          children: e.jsxs("group", {
            position: [0, 0.93, 0.028],
            rotation: [0.02, -0.08, 0.01],
            scale: [k, k, k],
            children: [
              e.jsxs("mesh", {
                position: [0, -0.138, -0.024],
                castShadow: !0,
                children: [
                  e.jsx("cylinderGeometry", { args: [0.008, 0.011, 0.28, 14] }),
                  p(0.34, 0.14, "detail"),
                ],
              }),
              e.jsxs("mesh", {
                position: [0, 0, -0.058],
                castShadow: !0,
                children: [
                  e.jsx("torusGeometry", { args: [0.248, 0.01, 10, 96] }),
                  p(0.38, 0.08),
                ],
              }),
              e.jsxs("mesh", {
                position: [0, 0, -0.064],
                children: [
                  e.jsx("torusGeometry", { args: [0.178, 0.004, 6, 76] }),
                  m(g ? 0.14 : 0.06),
                ],
              }),
              e.jsxs("mesh", {
                position: [0, 0, -0.122],
                scale: [1, 1, 0.42],
                castShadow: !0,
                children: [
                  e.jsx("sphereGeometry", { args: [0.168, 42, 18] }),
                  p(0.38, 0.1, "detail"),
                ],
              }),
              e.jsxs("mesh", {
                position: [0, 0, 0.008],
                children: [
                  e.jsx("torusGeometry", { args: [0.245, 0.014, 10, 84] }),
                  p(0.36, 0.08),
                ],
              }),
              e.jsxs("mesh", {
                position: [0, 0, 0.083],
                children: [
                  e.jsx("torusGeometry", { args: [0.228, 0.01, 8, 84] }),
                  m(g ? 0.28 : 0.14),
                ],
              }),
              e.jsxs("mesh", {
                position: [0, 0, 0.094],
                children: [
                  e.jsx("torusGeometry", { args: [0.142, 0.004, 6, 72] }),
                  m(g ? 0.16 : 0.075),
                ],
              }),
              N,
              P,
              e.jsx(es, {
                active: g,
                speed: 6 + Pt(f, "percentage", 60) * 0.12,
                children: E,
              }),
              e.jsxs("mesh", {
                position: [0, 0, 0.104],
                rotation: [Math.PI / 2, 0, 0],
                castShadow: !0,
                children: [
                  e.jsx("cylinderGeometry", {
                    args: [0.062, 0.072, 0.038, 42],
                  }),
                  p(0.34, 0.1),
                ],
              }),
              g &&
                e.jsxs("mesh", {
                  position: [0, 0, 0.118],
                  renderOrder: 9,
                  children: [
                    e.jsx("ringGeometry", { args: [0.112, 0.222, 58] }),
                    e.jsx("meshBasicMaterial", {
                      color: T(r, "#ffffff", 0.36),
                      transparent: !0,
                      opacity: 0.038,
                      depthWrite: !1,
                      blending: Q,
                      toneMapped: !1,
                      side: Y,
                    }),
                  ],
                }),
              g &&
                e.jsx("group", {
                  position: [0, 0, 0.18],
                  scale: [0.78, 0.78, 0.82],
                  children: e.jsx(wt, {
                    color: r,
                    variant: "forward",
                    strong: !0,
                    wideStart: !0,
                  }),
                }),
            ],
          }),
        }),
      ],
    });
  }
  if (s === "fan.tower") {
    const g = !a && d === "on";
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.04, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.2, 0.24, 0.065, 44] }),
            p(0.38, 0.08),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.085, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.15, 0.18, 0.035, 36] }),
            p(0.34, 0.06, "detail"),
          ],
        }),
        e.jsxs(ts, {
          active: g,
          amplitude: 0.14,
          speed: 0.78,
          children: [
            e.jsx(B, {
              position: [0, 0.54, 0],
              args: [0.22, 0.98, 0.18],
              radius: 0.08,
              smoothness: 8,
              castShadow: !0,
              children: e.jsx("meshPhysicalMaterial", {
                color: b,
                roughness: 0.34,
                metalness: 0.035,
                clearcoat: 0.38,
                clearcoatRoughness: 0.62,
                transparent: a,
                opacity: x,
                emissive: G,
                emissiveIntensity: L,
              }),
            }),
            e.jsx(B, {
              position: [0, 0.55, 0.095],
              args: [0.135, 0.74, 0.018],
              radius: 0.032,
              smoothness: 5,
              children: e.jsx("meshStandardMaterial", {
                color: "#303d43",
                roughness: 0.68,
                transparent: a,
                opacity: x,
              }),
            }),
            [-0.28, -0.18, -0.08, 0.02, 0.12, 0.22, 0.32].map((_) =>
              e.jsxs(
                "mesh",
                {
                  position: [0, 0.53 + _, 0.112],
                  children: [
                    e.jsx("boxGeometry", { args: [0.13, 0.008, 0.01] }),
                    m(g ? 0.34 : 0.14),
                  ],
                },
                _,
              ),
            ),
            [-0.045, 0, 0.045].map((_) =>
              e.jsxs(
                "mesh",
                {
                  position: [_, 0.55, 0.114],
                  children: [
                    e.jsx("boxGeometry", { args: [0.006, 0.62, 0.01] }),
                    m(g ? 0.22 : 0.1),
                  ],
                },
                _,
              ),
            ),
            e.jsxs("mesh", {
              position: [0, 1.04, 0],
              castShadow: !0,
              children: [
                e.jsx("sphereGeometry", { args: [0.083, 26, 12] }),
                p(0.32, 0.1),
              ],
            }),
            e.jsxs("mesh", {
              position: [0, 1.085, 0.002],
              scale: [1, 0.32, 1],
              children: [
                e.jsx("sphereGeometry", { args: [0.07, 24, 10] }),
                m(g ? 0.22 : 0.1),
              ],
            }),
            g &&
              e.jsx("group", {
                position: [0, 0.6, 0.22],
                scale: [0.96, 1.08, 1.04],
                children: e.jsx(wt, {
                  color: r,
                  profile: "slot",
                  variant: "forward",
                  strong: !0,
                }),
              }),
          ],
        }),
      ],
    });
  }
  if (s === "fan.ceiling") {
    const g = !a && d === "on",
      _ = T(b, "#d9f1ff", 0.32),
      k = [0, 1, 2, 3].map((E) =>
        e.jsxs(
          "group",
          {
            rotation: [0, (E * Math.PI) / 2, 0],
            children: [
              e.jsxs("mesh", {
                position: [0.045, -0.03, 0],
                rotation: [-Math.PI / 2, 0, 0.014],
                scale: [1.04, 1.08, 1],
                castShadow: !0,
                receiveShadow: !0,
                children: [
                  e.jsx("shapeGeometry", { args: [Ma] }),
                  e.jsx("meshPhysicalMaterial", {
                    color: _,
                    roughness: 0.48,
                    metalness: 0.018,
                    clearcoat: 0.2,
                    clearcoatRoughness: 0.74,
                    transparent: a,
                    opacity: x,
                    emissive: G,
                    emissiveIntensity: L * 0.24,
                    side: Y,
                  }),
                ],
              }),
              e.jsxs("mesh", {
                position: [0.21, -0.012, 0],
                rotation: [0, 0, -0.012],
                castShadow: !0,
                children: [
                  e.jsx("boxGeometry", { args: [0.3, 0.012, 0.042] }),
                  p(0.32, 0.08, "detail"),
                ],
              }),
              e.jsxs("mesh", {
                position: [0.35, -0.01, 0],
                children: [
                  e.jsx("boxGeometry", { args: [0.072, 0.014, 0.062] }),
                  m(g ? 0.13 : 0.055),
                ],
              }),
            ],
          },
          E,
        ),
      );
    return e.jsxs("group", {
      children: [
        e.jsx(es, {
          active: g,
          axis: "y",
          speed: 3 + Pt(f, "percentage", 60) * 0.08,
          children: k,
        }),
        e.jsxs("mesh", {
          position: [0, 0.14, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.016, 0.022, 0.25, 24] }),
            p(0.28, 0.18, "detail"),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.285, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.066, 0.094, 0.052, 48] }),
            p(0.36, 0.08),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.315, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.072, 0.086, 0.026, 48] }),
            p(0.42, 0.08),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.023, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.13, 0.132, 0.095, 64] }),
            p(0.36, 0.1),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.036, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.14, 0.128, 0.04, 64] }),
            p(0.32, 0.12),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.074, 0],
          scale: [1, 0.28, 1],
          children: [
            e.jsx("sphereGeometry", { args: [0.112, 42, 14] }),
            p(0.34, 0.08),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.056, 0],
          rotation: [-Math.PI / 2, 0, 0],
          children: [
            e.jsx("ringGeometry", { args: [0.076, 0.136, 58] }),
            m(g ? 0.13 : 0.06),
          ],
        }),
        n &&
          e.jsxs("mesh", {
            rotation: [-Math.PI / 2, 0, 0],
            children: [
              e.jsx("ringGeometry", { args: [0.32, 0.82, 80] }),
              m(0.07),
            ],
          }),
        g &&
          e.jsx("group", {
            position: [0, -0.13, 0],
            scale: [0.86, 0.86, 0.86],
            children: e.jsx(wt, { color: r, variant: "down", strong: !0 }),
          }),
      ],
    });
  }
  if (s === "camera.dome")
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.135, 0.145, 0.064, 34] }),
            p(0.34, 0.08),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.056, 0],
          scale: [1, 0.62, 1],
          children: [
            e.jsx("sphereGeometry", { args: [0.12, 30, 14] }),
            m(n ? 0.62 : 0.36),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.056, 0.096],
          rotation: [Math.PI / 2, 0, 0],
          children: [
            e.jsx("circleGeometry", { args: [0.035, 18] }),
            m(n ? 0.82 : 0.48),
          ],
        }),
      ],
    });
  if (s === "camera.wall")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [0, 0.016, 0],
          castShadow: !0,
          args: [0.26, 0.17, 0.13],
          radius: Math.min(0.26, 0.17, 0.13) * 0.18,
          smoothness: 3,
          children: p(0.36, 0.08),
        }),
        e.jsxs("mesh", {
          position: [0, 0.016, 0.079],
          rotation: [Math.PI / 2, 0, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.054, 0.068, 0.058, 28] }),
            p(0.22, 0.18),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, 0.016, 0.116],
          rotation: [Math.PI / 2, 0, 0],
          children: [
            e.jsx("circleGeometry", { args: [0.04, 24] }),
            m(n ? 0.82 : 0.45),
          ],
        }),
      ],
    });
  if (s === "camera.bullet")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [-0.095, 0.032, 0],
          rotation: [0, 0, 0.12],
          castShadow: !0,
          args: [0.1, 0.044, 0.055],
          radius: Math.min(0.1, 0.044, 0.055) * 0.18,
          smoothness: 3,
          children: p(0.42, 0.12, "detail"),
        }),
        e.jsxs("mesh", {
          position: [0.01, 0.016, 0],
          rotation: [0, 0, Math.PI / 2],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.056, 0.064, 0.22, 26] }),
            p(0.28, 0.18),
          ],
        }),
        e.jsxs("mesh", {
          position: [0.135, 0.016, 0],
          rotation: [0, 0, Math.PI / 2],
          children: [
            e.jsx("circleGeometry", { args: [0.046, 24] }),
            m(n ? 0.86 : 0.46),
          ],
        }),
        e.jsx(B, {
          position: [0.01, 0.079, 0],
          castShadow: !0,
          args: [0.235, 0.02, 0.068],
          radius: Math.min(0.235, 0.02, 0.068) * 0.18,
          smoothness: 3,
          children: p(0.5, 0.08, "detail"),
        }),
      ],
    });
  if (s === "camera.doorbell")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          args: [0.145, 0.34, 0.058],
          radius: 0.038,
          smoothness: 5,
          castShadow: !0,
          children: p(0.32, 0.08),
        }),
        e.jsxs("mesh", {
          position: [0, 0.076, 0.036],
          children: [
            e.jsx("circleGeometry", { args: [0.037, 24] }),
            m(n ? 0.82 : 0.45),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.066, 0.037],
          children: [
            e.jsx("circleGeometry", { args: [0.028, 22] }),
            m(n ? 0.58 : 0.28),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.126, 0.037],
          children: [
            e.jsx("boxGeometry", { args: [0.07, 0.019, 0.01] }),
            m(0.24),
          ],
        }),
      ],
    });
  if (s === "media_player.speaker")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [0, 0.24, 0],
          castShadow: !0,
          args: [0.24, 0.48, 0.22],
          radius: Math.min(0.24, 0.48, 0.22) * 0.18,
          smoothness: 3,
          children: p(0.44, 0.05),
        }),
        [-0.11, 0.02, 0.14].map((g) =>
          e.jsxs(
            "mesh",
            {
              position: [0, 0.24 + g, 0.116],
              children: [
                e.jsx("circleGeometry", { args: [0.045, 20] }),
                m(n ? 0.54 : 0.24),
              ],
            },
            g,
          ),
        ),
      ],
    });
  if (s === "media_player.tv")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          position: [0, 0.12, 0],
          castShadow: !0,
          args: [0.56, 0.32, 0.045],
          radius: Math.min(0.56, 0.32, 0.045) * 0.18,
          smoothness: 3,
          children: p(0.42, 0.04),
        }),
        e.jsxs("mesh", {
          position: [0, 0.12, 0.026],
          children: [
            e.jsx("boxGeometry", { args: [0.47, 0.24, 0.01] }),
            m(n ? 0.42 : 0.18),
          ],
        }),
        e.jsx(B, {
          position: [0, -0.08, 0],
          castShadow: !0,
          args: [0.18, 0.07, 0.07],
          radius: Math.min(0.18, 0.07, 0.07) * 0.18,
          smoothness: 3,
          children: p(0.46, 0.06),
        }),
      ],
    });
  if (s === "vacuum.robot") {
    const g = ["cleaning", "returning", "on"].includes(d);
    return e.jsxs("group", {
      children: [
        e.jsxs("mesh", {
          position: [0, 0.055, 0],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.24, 0.26, 0.11, 44] }),
            p(0.46, 0.12),
          ],
        }),
        e.jsxs("mesh", {
          position: [0.055, 0.132, -0.025],
          castShadow: !0,
          children: [
            e.jsx("cylinderGeometry", { args: [0.055, 0.06, 0.04, 22] }),
            p(0.32, 0.14),
          ],
        }),
        e.jsxs("mesh", {
          position: [-0.08, 0.114, 0.06],
          children: [
            e.jsx("circleGeometry", { args: [0.026, 18] }),
            m(g ? 0.58 : 0.28),
          ],
        }),
        [-0.12, 0.12].map((_) =>
          e.jsxs(
            "mesh",
            {
              position: [_, 0.052, -0.23],
              children: [
                e.jsx("boxGeometry", { args: [0.08, 0.026, 0.026] }),
                m(0.3),
              ],
            },
            _,
          ),
        ),
        g &&
          e.jsxs("mesh", {
            position: [0, 0.118, 0],
            rotation: [-Math.PI / 2, 0, 0],
            children: [
              e.jsx("ringGeometry", { args: [0.29, 0.36, 44] }),
              e.jsx("meshBasicMaterial", {
                color: S,
                transparent: !0,
                opacity: 0.18,
                depthWrite: !1,
                toneMapped: !1,
              }),
            ],
          }),
      ],
    });
  }
  if (s === "alarm.panel")
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          castShadow: !0,
          args: [0.32, 0.44, 0.06],
          radius: Math.min(0.32, 0.44, 0.06) * 0.18,
          smoothness: 3,
          children: p(0.34, 0.05),
        }),
        e.jsxs("mesh", {
          position: [0, 0.11, 0.034],
          children: [
            e.jsx("boxGeometry", { args: [0.2, 0.08, 0.012] }),
            m(n ? 0.58 : 0.28),
          ],
        }),
        [-0.07, 0, 0.07].map((g) =>
          e.jsxs(
            "mesh",
            {
              position: [g, -0.055, 0.035],
              children: [
                e.jsx("circleGeometry", { args: [0.022, 16] }),
                m(0.36),
              ],
            },
            g,
          ),
        ),
      ],
    });
  if (s === "lock.door") {
    const g = ["unlocked", "open", "opening"].includes(d);
    return e.jsxs("group", {
      children: [
        e.jsx(B, {
          args: [0.24, 0.44, 0.07],
          radius: 0.045,
          smoothness: 5,
          castShadow: !0,
          children: e.jsx("meshPhysicalMaterial", {
            color: b,
            roughness: 0.32,
            metalness: 0.08,
            clearcoat: 0.36,
            clearcoatRoughness: 0.58,
            emissive: g || n ? S : "#000000",
            emissiveIntensity: g ? 0.2 : n ? 0.12 : 0,
            transparent: a,
            opacity: x,
          }),
        }),
        e.jsxs("mesh", {
          position: [0, 0.09, 0.046],
          rotation: [0, 0, g ? -0.24 : 0],
          children: [
            e.jsx("torusGeometry", { args: [0.053, 0.01, 8, 24, Math.PI] }),
            m(g || n ? 0.72 : 0.32),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.025, 0.047],
          children: [
            e.jsx("boxGeometry", { args: [0.105, 0.09, 0.012] }),
            m(g || n ? 0.62 : 0.26),
          ],
        }),
        e.jsxs("mesh", {
          position: [0, -0.125, 0.048],
          children: [
            e.jsx("boxGeometry", { args: [0.024, 0.095, 0.012] }),
            m(0.35),
          ],
        }),
        g &&
          e.jsxs("mesh", {
            position: [0, 0, 0.09],
            children: [
              e.jsx("sphereGeometry", { args: [0.025, 16, 8] }),
              e.jsx("meshBasicMaterial", {
                color: S,
                transparent: !0,
                opacity: 0.92,
                toneMapped: !1,
              }),
            ],
          }),
      ],
    });
  }
  return e.jsxs("mesh", {
    castShadow: !0,
    children: [
      e.jsx("sphereGeometry", { args: [0.15, 24, 14] }),
      p(0.35, 0.04),
    ],
  });
}
function Xs(t, s) {
  return s
    ? t.startsWith("camera.")
      ? [0.94, 0.94, 0.94]
      : t === "light.strip" ||
          t === "cover.curtain" ||
          t === "cover.blind" ||
          t === "media_player.tv" ||
          t === "climate.central_ac"
        ? [1.16, 1.16, 1.16]
        : [
              "light.floor_lamp",
              "climate.floor_ac",
              "fan.floor",
              "fan.tower",
            ].includes(t)
          ? [1.18, 1.18, 1.18]
          : t === "vacuum.robot"
            ? [1.24, 1.24, 1.24]
            : t === "light.downlight"
              ? [1, 1, 1]
              : [
                    "light.ceiling_panel",
                    "light.ceiling_round",
                    "light.wall_sconce",
                  ].includes(t)
                ? [1.06, 1.06, 1.06]
                : [
                      "binary_sensor.motion",
                      "binary_sensor.presence",
                      "binary_sensor.smoke",
                    ].includes(t)
                  ? [1.26, 1.26, 1.26]
                  : ["lock.door"].includes(t)
                    ? [1.18, 1.18, 1.18]
                    : t.startsWith("sensor.")
                      ? [1.1, 1.1, 1.1]
                      : [1.12, 1.12, 1.12]
    : t === "light.strip" ||
        t === "cover.curtain" ||
        t === "cover.blind" ||
        t === "media_player.tv" ||
        t === "climate.central_ac"
      ? [1.16, 1.16, 1.16]
      : [
            "light.floor_lamp",
            "climate.floor_ac",
            "fan.floor",
            "fan.tower",
          ].includes(t)
        ? [1.12, 1.12, 1.12]
        : t === "vacuum.robot"
          ? [1.22, 1.22, 1.22]
          : t === "light.downlight"
            ? [1, 1, 1]
            : [
                  "light.ceiling_panel",
                  "light.ceiling_round",
                  "light.wall_sconce",
                ].includes(t)
              ? [1.04, 1.04, 1.04]
              : t.startsWith("camera.")
                ? [1.02, 1.02, 1.02]
                : [
                      "binary_sensor.motion",
                      "binary_sensor.presence",
                      "binary_sensor.smoke",
                    ].includes(t)
                  ? [1.34, 1.34, 1.34]
                  : ["lock.door"].includes(t)
                    ? [1.28, 1.28, 1.28]
                    : [1.24, 1.24, 1.24];
}
function Zs(t) {
  return t === "light.wall_sconce"
    ? 0.52
    : t === "light.floor_lamp"
      ? 1.52
      : t === "climate.floor_ac"
        ? 1.28
        : t === "fan.floor" || t === "fan.tower"
          ? 1.2
          : t === "climate.central_ac"
            ? 0.62
            : t === "media_player.speaker"
              ? 0.72
              : t === "camera.bullet"
                ? 0.48
                : t === "camera.doorbell"
                  ? 0.54
                  : t === "lock.door"
                    ? 0.64
                    : t === "vacuum.robot"
                      ? 0.38
                      : t === "binary_sensor.water"
                        ? 0.28
                        : 0.42;
}
function Ia(t, s) {
  return t === "light.wall_sconce"
    ? 0.46
    : [
          "light.floor_lamp",
          "climate.floor_ac",
          "fan.floor",
          "fan.tower",
        ].includes(t)
      ? 1.38
      : s === "floor"
        ? 0.46
        : t === "climate.central_ac"
          ? 0.52
          : t.startsWith("camera.")
            ? 0.48
            : t === "lock.door"
              ? 0.66
              : s === "ceiling"
                ? 0.48
                : 0.54;
}
function Ys(t) {
  return t === "light.wall_sconce"
    ? { radius: 0.3, y: 0 }
    : t === "light.ceiling_panel"
      ? { radius: 0.34, y: 0 }
      : t === "light.ceiling_round"
        ? { radius: 0.28, y: 0 }
        : t === "fan.floor"
          ? { radius: 0.38, y: 0.66 }
          : [
                "light.floor_lamp",
                "climate.floor_ac",
                "fan.floor",
                "fan.tower",
              ].includes(t)
            ? { radius: 0.46, y: 0.72 }
            : t === "climate.central_ac"
              ? { radius: 0.56, y: -0.08 }
              : t === "media_player.tv" || t.startsWith("cover.")
                ? { radius: 0.42, y: 0.04 }
                : t === "media_player.speaker"
                  ? { radius: 0.34, y: 0.24 }
                  : t === "camera.bullet"
                    ? { radius: 0.28, y: 0.01 }
                    : t.startsWith("camera.")
                      ? { radius: 0.26, y: 0 }
                      : t === "lock.door"
                        ? { radius: 0.34, y: 0 }
                        : [
                              "sensor.co2",
                              "sensor.pm25",
                              "binary_sensor.presence",
                            ].includes(t)
                          ? { radius: 0.33, y: 0 }
                          : t === "binary_sensor.water" || t === "vacuum.robot"
                            ? { radius: 0.32, y: 0.08 }
                            : { radius: 0.34, y: 0 };
}
function Qs({ modelId: t, target: s }) {
  return t === "light.strip"
    ? e.jsxs("mesh", {
        position: [0, -0.02, 0],
        children: [
          e.jsx("boxGeometry", { args: [1.04, 0.36, 0.36] }),
          e.jsx("meshBasicMaterial", {
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
          }),
        ],
      })
    : e.jsxs("mesh", {
        position: [0, s.y, 0],
        children: [
          e.jsx("sphereGeometry", { args: [s.radius, 16, 8] }),
          e.jsx("meshBasicMaterial", {
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
          }),
        ],
      });
}
function Na({ active: t, unavailable: s, value: o, color: r }) {
  const n = M.useRef(null),
    a = M.useRef(0),
    i = M.useRef(0),
    d = M.useRef(o),
    l = be((u) => u.invalidate),
    ha3dQuality = M.useContext(ha3dQualityContext), // ha3d-self: B6
    [c, h] = M.useState(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  return (
    M.useEffect(() => {
      const u = window.matchMedia("(prefers-reduced-motion: reduce)"),
        f = () => h(u.matches);
      return (
        u.addEventListener("change", f),
        () => u.removeEventListener("change", f)
      );
    }, []),
    M.useEffect(() => {
      (d.current !== o && !s && !c && (i.current = 2.4),
        c && (i.current = 0),
        s && (i.current = 0),
        (d.current = o),
        l());
    }, [o, s, t, c, l]),
    te((u, f) => {
      if (!n.current || document.hidden) return;
      const j = Math.min(f, 0.05);
      ((a.current += j), (i.current = Math.max(0, i.current - j)));
      const v = !s && (t || i.current > 0);
      (n.current.children.forEach((y, x) => {
        const b = y,
          w = c ? x * 0.3 : (a.current / 1.8 + x / 3) % 1;
        ((b.visible = !s && (v || x === 0)),
          b.scale.setScalar(v ? 1 + w * 2.4 : 1),
          (b.material.opacity = v ? (c ? 0.3 : 0.6 * (1 - w)) : 0.16));
      }),
        v && !c && ha3dDeviceAnimInvalidate(l, ha3dQuality)); // ha3d-self: B6 传感器脉冲环同样限帧
    }),
    e.jsx("group", {
      ref: n,
      position: [0, -0.12, 0],
      children: [0, 1, 2].map((u) =>
        e.jsxs(
          "mesh",
          {
            rotation: [-Math.PI / 2, 0, 0],
            visible: !1,
            children: [
              e.jsx("ringGeometry", { args: [0.19, 0.205, 48] }),
              e.jsx("meshBasicMaterial", {
                color: r,
                transparent: !0,
                opacity: 0,
                depthWrite: !1,
                toneMapped: !1,
                side: Y,
              }),
            ],
          },
          u,
        ),
      ),
    })
  );
}
function Oa({ device: t, entity: s, color: o, offsetY: r, warning: n }) {
  var d;
  const i = ["binary_sensor.presence", "binary_sensor.motion"].includes(
    bs(t, s).id,
  )
    ? At(s).label
    : t.kind === "light" ||
        ((d = t.modelId) != null && d.startsWith("switch.light."))
      ? $t(dt(s))
      : s
        ? Ke(s)
        : "未同步";
  return e.jsxs(ge, {
    position: [0, r, 0.04],
    center: !0,
    zIndexRange: Ie,
    className: `scene-device-status-chip chip-${t.kind} ${n ? "chip-warning" : ""}`,
    children: [
      e.jsx("i", { style: { backgroundColor: o } }),
      e.jsx("span", { children: (s == null ? void 0 : s.name) ?? t.entityId }),
      e.jsx("strong", { children: i }),
    ],
  });
}
function Js(t, s, o, r, n) {
  if (n) return $n(t, s, o, r);
  const [a, i, d] = t;
  return s === "floor" ? [a, Rs(i), d] : [a, i, d];
}
// ===== ha3d-self: F4 点击设备直接开关（只在首页展示模式生效，编辑器里点击仍是选中） =====
const ha3dToggleDomains = new Set(["light", "switch", "fan", "cover"]);
function ha3dCanDirectToggle(t, s) {
  return t === "toggle" && !!s && !Qe(s) && ha3dToggleDomains.has(s.domain);
}
// toggle 延迟 350 ms 发送：等待期间出现第二次按下（双击、双击后拖动平移；条件与 ha3dDoubleTapPan 相同：
// 两次按下间隔 ≤ 350 ms、距离 ≤ 30 px）就取消第一次的 toggle，第二次按下产生的 click 也不开关。
// 否则双击拖动从灯上开始时，第一次轻点和平移松手各算一次 click，灯会开→关闪一下。
const ha3dDirectToggleDelayMs = 350,
  ha3dPendingToggles = [];
// R3F 对拖动后的松手也派发 click（只要按下、松手时都命中设备），移动距离放在 event.delta（px）里；
// 超过 6 px（与 ha3dDoubleTapPan 判定拖动的距离相同）算拖动视角，不开关也不弹详情。
const ha3dIsDragClick = (t) => t.delta > 6;
let ha3dDownSeq = 0,
  ha3dLastDown = { seq: 0, time: -1 / 0, x: 0, y: 0 },
  ha3dSecondTap = !1;
window.addEventListener(
  "pointerdown",
  (t) => {
    if (t.button !== 0 || !t.isPrimary) return;
    ha3dDownSeq += 1;
    ha3dSecondTap =
      t.timeStamp - ha3dLastDown.time <= ha3dDirectToggleDelayMs &&
      Math.hypot(t.clientX - ha3dLastDown.x, t.clientY - ha3dLastDown.y) <= 30;
    if (!ha3dSecondTap) {
      ha3dLastDown = { seq: ha3dDownSeq, time: t.timeStamp, x: t.clientX, y: t.clientY };
      return;
    }
    for (let s = ha3dPendingToggles.length - 1; s >= 0; s--)
      ha3dPendingToggles[s].seq === ha3dLastDown.seq &&
        (clearTimeout(ha3dPendingToggles[s].timer), ha3dPendingToggles.splice(s, 1));
    ha3dLastDown = { seq: 0, time: -1 / 0, x: 0, y: 0 };
  },
  !0,
);
/** 延迟发送 toggle（见上）；失败时执行原来的选中逻辑 fallback。 */
function ha3dDirectToggle(t, s, o) {
  if (ha3dSecondTap) return;
  const r = { seq: ha3dDownSeq, timer: 0 };
  ((r.timer = setTimeout(() => {
    const n = ha3dPendingToggles.indexOf(r);
    (n >= 0 && ha3dPendingToggles.splice(n, 1),
      Promise.resolve()
        .then(() => t({ type: "toggle", entityId: s }))
        .catch(o));
  }, ha3dDirectToggleDelayMs)),
    ha3dPendingToggles.push(r));
}
const Ra = M.memo(function ({
    device: s,
    entity: o,
    presentation: r,
    theme: n,
    presentationMode: a,
    floorHeight: i,
    onSelect: d,
    onDeviceSelect: l,
  }) {
    const c = De((je) => je.selectEntity),
      h = De((je) => je.selectedEntityId === s.entityId),
      ha3dClickMode = De((je) => je.deviceClickMode), // ha3d-self: F4
      ha3dAct = De((je) => je.act), // ha3d-self: F4
      [u, f] = M.useState(!1),
      j = M.useRef(null),
      v = he(o),
      y = Qe(o),
      x = Os(s, o),
      b = ft(s, o),
      w = Pt(o, "current_position", v === "open" ? 100 : 0),
      S = v === "heat" ? "#ff784d" : "#38c8ff",
      G = me(n, a),
      L = bs(s, o),
      I = xs(L.id),
      $ = I.startsWith("light."),
      p = ["binary_sensor.presence", "binary_sensor.motion"].includes(L.id),
      m = At(o),
      C = pt(s, o, a),
      O = dt(o),
      g = $
        ? O.color
        : s.kind === "cover"
          ? "#4c9ed9"
          : s.kind === "sensor"
            ? "#2dae7b"
            : s.kind === "binary_sensor" ||
                s.kind === "lock" ||
                s.kind === "alarm_control_panel"
              ? "#c6687b"
              : s.kind === "camera"
                ? "#6d74be"
                : s.kind === "climate"
                  ? S
                  : s.kind === "fan"
                    ? "#45a79a"
                    : s.kind === "vacuum"
                      ? "#5c8fb6"
                      : s.kind === "switch"
                        ? "#7b9a63"
                        : "#7b78d1",
      _ = y && r ? "#87909a" : g,
      k = $ ? O.color : C ? Dt(a, _) : _,
      E = y ? (r ? "#77808a" : _) : r ? G.deviceBody : _,
      P = b && a === "security",
      N = p
        ? m.active
        : ($ ? x : x || P || (C && (s.kind !== "climate" || x))) && !y,
      R = s.kind === "binary_sensor" ? x && !y : N || (h && !y),
      F = p ? m.color : ea(s, o, a, k),
      z = r && (u || h),
      U = T(F, "#e8f8ff", $ ? 0.68 : 0.34),
      V = h ? 0.9 : $ && x ? 0.42 : 0.78,
      K = wn(L.id) && Ye(s),
      q = K ? [1, 1, 1] : s.scale ? s.scale : Xs(I, r),
      se = K ? [0, 0, 0] : s.rotation,
      ve = Ys(I),
      ue = s.kind === "sensor" || s.kind === "binary_sensor",
      fe = y && r && h && !ue,
      Me =
        r &&
        !ue &&
        !(a === "lighting" && $) &&
        (s.kind === "binary_sensor" || h || P || (x && a === "lighting")),
      xe = Js(s.position, L.placement, I, i, r);
    return e.jsxs("group", {
      userData: { focusEntityId: s.entityId },
      position: xe,
      rotation: se,
      scale: q,
      onClick: (je) => {
        const ha3dSelect = () => {
          (c(s.entityId),
            d == null || d(s.entityId),
            l == null || l(s.id, s.entityId));
        };
        // ha3d-self: F4 直接开关模式下，开关类设备点击即 toggle，不弹详情；拖动视角后的松手什么都不做
        if (r && ha3dCanDirectToggle(ha3dClickMode, o)) {
          je.stopPropagation();
          if (ha3dIsDragClick(je)) return;
          (as(), ha3dDirectToggle(ha3dAct, o.entityId, ha3dSelect));
          return;
        }
        (je.stopPropagation(), as(), ha3dSelect());
      },
      onPointerOver: (je) => {
        (je.stopPropagation(), f(!0), (document.body.style.cursor = "pointer"));
      },
      onPointerOut: (je) => {
        (je.stopPropagation(), f(!1), (document.body.style.cursor = "auto"));
      },
      children: [
        e.jsx(Qs, { modelId: I, target: ve }),
        N &&
          !$ &&
          s.kind !== "binary_sensor" &&
          e.jsx("pointLight", {
            color: a === "lighting" ? "#ffd08a" : k,
            intensity: r ? (C ? 2.25 : 1.55) : 1.35,
            distance: 2.7,
          }),
        e.jsx("group", {
          ref: j,
          children: e.jsx(Ht, {
            children: $
              ? e.jsx(qs, {
                  modelId: I,
                  bodyColor: E,
                  appearance: O,
                  unavailable: y,
                  modeHighlighted: C,
                  presentation: r,
                  selected: h,
                  device: s,
                })
              : e.jsx($a, {
                  kind: s.kind,
                  modelId: L.id,
                  bodyColor: E,
                  highlightColor: k,
                  glowActive: R,
                  unavailable: y,
                  modeHighlighted: C,
                  state: v,
                  coverPosition: w,
                  climateColor: S,
                  presentation: r,
                  selected: h,
                  entity: o,
                }),
          }),
        }),
        ue &&
          e.jsx(Na, {
            active: p ? m.active : s.kind === "binary_sensor" && x,
            unavailable: y || v === "unknown" || !o,
            value: o == null ? void 0 : o.state,
            color: p ? m.color : F,
          }),
        e.jsx(Ws, {
          target: j,
          color: U,
          active: z,
          selected: h,
          intensity: V,
        }),
        Me &&
          e.jsx(Oa, {
            device: s,
            entity: o,
            color: F,
            offsetY: Ia(I, L.placement),
            warning: b,
          }),
        !r &&
          h &&
          !ue &&
          e.jsxs(ge, {
            position: [0, Zs(I), 0],
            center: !0,
            zIndexRange: Ie,
            className: "scene-device-selected-label",
            children: [
              e.jsx("span", {
                children: (o == null ? void 0 : o.name) ?? s.entityId,
              }),
              e.jsxs("small", {
                children: [L.label, $ ? ` · ${y ? "离线" : $t(O)}` : ""],
              }),
            ],
          }),
        fe &&
          e.jsx(ge, {
            position: [0, s.kind === "sensor" ? 0.61 : 0.34, 0],
            center: !0,
            zIndexRange: Ie,
            className: "scene-device-offline",
            children: "离线",
          }),
      ],
    });
  }),
  Fa = M.memo(function ({
    fixture: s,
    switchDevice: o,
    entity: r,
    presentation: n,
    theme: a,
    presentationMode: i,
    onSelect: d,
    onDeviceSelect: l,
  }) {
    var m;
    const c = De((C) => C.selectEntity),
      h = De((C) => C.selectedEntityId === o.entityId),
      ha3dClickMode = De((C) => C.deviceClickMode), // ha3d-self: F4
      ha3dAct = De((C) => C.act), // ha3d-self: F4
      [u, f] = M.useState(!1),
      j = M.useRef(null),
      v = Qe(r),
      y = xs(s.modelId ?? "light.downlight"),
      x = dt(r),
      b = me(a, i),
      w = i === "lighting",
      S = ((m = Lt(y)) == null ? void 0 : m.placement) ?? "ceiling",
      G = Js(s.position, S, y, void 0, n),
      L = {
        id: s.id,
        entityId: o.entityId,
        kind: "light",
        floorId: o.floorId,
        roomId: s.roomId,
        position: s.position,
        rotation: s.rotation ?? [0, 0, 0],
        scale: s.scale,
        modelId: y,
      },
      I = s.scale ? s.scale : Xs(y, n),
      $ = v ? (n ? "#77808a" : "#9aa2aa") : n ? b.deviceBody : x.color,
      p = () => {
        (as(),
          c(o.entityId),
          d == null || d(o.entityId),
          l == null || l(o.id, o.entityId));
      };
    return e.jsxs("group", {
      userData: { focusEntityId: o.entityId },
      position: G,
      rotation: s.rotation ?? [0, 0, 0],
      scale: I,
      onClick: (C) => {
        // ha3d-self: F4 开关控制的灯具按开关实体 toggle；失败时退回选中；拖动视角后的松手什么都不做
        if (n && ha3dCanDirectToggle(ha3dClickMode, r)) {
          C.stopPropagation();
          if (ha3dIsDragClick(C)) return;
          (as(),
            ha3dDirectToggle(ha3dAct, o.entityId, () => {
              (c(o.entityId),
                d == null || d(o.entityId),
                l == null || l(o.id, o.entityId));
            }));
          return;
        }
        (C.stopPropagation(), p());
      },
      onPointerOver: (C) => {
        (C.stopPropagation(), f(!0), (document.body.style.cursor = "pointer"));
      },
      onPointerOut: (C) => {
        (C.stopPropagation(), f(!1), (document.body.style.cursor = "auto"));
      },
      children: [
        e.jsx(Qs, { modelId: y, target: Ys(y) }),
        e.jsx("group", {
          ref: j,
          children: e.jsx(Ht, {
            children: e.jsx(qs, {
              modelId: y,
              bodyColor: $,
              appearance: x,
              unavailable: v,
              modeHighlighted: w,
              presentation: n,
              selected: h,
              device: L,
            }),
          }),
        }),
        e.jsx(Ws, {
          target: j,
          color: v ? "#87909a" : T(x.color, "#e8f8ff", 0.68),
          active: n && (u || h),
          selected: h,
          intensity: h ? 0.9 : 0.78,
        }),
        !n &&
          h &&
          e.jsxs(ge, {
            position: [0, Zs(y), 0],
            center: !0,
            zIndexRange: Ie,
            className: "scene-device-selected-label",
            children: [
              e.jsx("span", { children: s.label ?? r.name }),
              e.jsxs("small", { children: ["由 ", r.name, " 控制 · ", $t(x)] }),
            ],
          }),
      ],
    });
  }),
  Aa = M.memo(function ({
    item: s,
    theme: o,
    presentation: r,
    presentationMode: n,
  }) {
    const a = oe(),
      i = a === "cartoon" && r,
      d = a === "cream" && r,
      l = me(o, n),
      c = l.furnitureMain,
      h = l.furnitureDetail,
      u = i ? c : d ? T(c, "#f7ead5", 0.26) : r ? T(c, "#edf5ff", 0.28) : c,
      f = i ? h : d ? T(h, "#cdbb9f", 0.18) : r ? T(h, "#d8e8ff", 0.22) : h,
      j = i
        ? "#fff7e8"
        : d
          ? "#f6efe4"
          : n === "security"
            ? f
            : o === "night"
              ? "#8da2c9"
              : "#eaf2ff",
      v = mt(i, d);
    if (On(s.kind))
      return e.jsx("group", {
        name: `ha3d-furniture-${s.kind}`, // ha3d-self: 供 e2e 定位家具
        userData: { furnitureId: s.id },
        position: [s.position[0], 0, s.position[1]],
        rotation: [0, -s.rotation, 0],
        scale: [1, r ? Xt(s.height) : 1, 1],
        children: e.jsx(Rn, { item: s, night: o === "night", visualStyle: a }),
      });
    const y = Math.min(0.38, s.height * 0.45),
      x = Math.min(0.12, s.height * 0.16),
      b = (w = y) =>
        [-1, 1].flatMap((S) =>
          [-1, 1].map((G) =>
            e.jsx(
              A,
              {
                presentation: r,
                position: [
                  S * (s.width / 2 - 0.09),
                  w / 2,
                  G * (s.depth / 2 - 0.09),
                ],
                size: [0.08, w, 0.08],
                color: h,
              },
              `${S}-${G}`,
            ),
          ),
        );
    return e.jsx("group", {
      position: [s.position[0], 0, s.position[1]],
      rotation: [0, -s.rotation, 0],
      scale: [1, r ? Xt(s.height) : 1, 1],
      children: e.jsxs(Ht, {
        children: [
          s.kind === "sofa" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.24, s.depth * 0.14],
                  size: [s.width, s.height * 0.48, s.depth * 0.58],
                  color: u,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.68, s.depth * 0.34],
                  size: [s.width, s.height * 0.36, s.depth * 0.16],
                  color: f,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [-s.width * 0.45, s.height * 0.38, s.depth * 0.02],
                  size: [s.width * 0.12, s.height * 0.44, s.depth * 0.58],
                  color: u,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [s.width * 0.45, s.height * 0.38, s.depth * 0.02],
                  size: [s.width * 0.12, s.height * 0.44, s.depth * 0.58],
                  color: u,
                }),
                [-0.24, 0.24].map((w) =>
                  e.jsx(
                    A,
                    {
                      presentation: r,
                      position: [w * s.width, s.height * 0.53, s.depth * 0.06],
                      size: [s.width * 0.43, s.height * 0.12, s.depth * 0.48],
                      color: j,
                      roughness: 0.5,
                    },
                    `seat-${w}`,
                  ),
                ),
                [-0.25, 0.25].map((w) =>
                  e.jsx(
                    A,
                    {
                      presentation: r,
                      position: [w * s.width, s.height * 0.7, s.depth * 0.22],
                      size: [s.width * 0.34, s.height * 0.22, s.depth * 0.12],
                      color: f,
                      roughness: 0.5,
                    },
                    `pillow-${w}`,
                  ),
                ),
              ],
            }),
          s.kind === "bed" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.2, 0],
                  size: [s.width, s.height * 0.4, s.depth],
                  color: u,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.64, -s.depth * 0.43],
                  size: [s.width + 0.04, s.height * 0.78, s.depth * 0.12],
                  color: f,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.48, s.depth * 0.12],
                  size: [s.width * 0.9, s.height * 0.15, s.depth * 0.72],
                  color: j,
                }),
                [-0.24, 0.24].map((w) =>
                  e.jsx(
                    A,
                    {
                      presentation: r,
                      position: [w * s.width, s.height * 0.64, -s.depth * 0.21],
                      size: [s.width * 0.3, s.height * 0.18, s.depth * 0.18],
                      color: T(j, "#ffffff", 0.14),
                      roughness: 0.46,
                    },
                    `bed-pillow-${w}`,
                  ),
                ),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.56, s.depth * 0.22],
                  size: [s.width * 0.72, s.height * 0.05, s.depth * 0.38],
                  color: T(f, "#ffffff", 0.1),
                  roughness: 0.48,
                }),
              ],
            }),
          s.kind === "dining_table" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height - x / 2, 0],
                  size: [s.width, x, s.depth],
                  color: u,
                  roughness: 0.5,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height + x * 0.12, 0],
                  size: [s.width * 0.82, x * 0.18, s.depth * 0.72],
                  color: T(j, "#ffffff", 0.1),
                  roughness: 0.42,
                }),
                b(s.height - x),
                [
                  [-0.34, -0.72, Math.PI],
                  [0.34, -0.72, Math.PI],
                  [-0.34, 0.72, 0],
                  [0.34, 0.72, 0],
                ].map(([w, S, G], L) =>
                  e.jsxs(
                    "group",
                    {
                      position: [w * s.width, 0, S * s.depth],
                      rotation: [0, G, 0],
                      children: [
                        e.jsx(A, {
                          presentation: r,
                          position: [0, Math.max(0.1, s.height * 0.34), 0],
                          size: [
                            s.width * 0.22,
                            s.height * 0.18,
                            s.depth * 0.2,
                          ],
                          color: j,
                          roughness: 0.52,
                        }),
                        e.jsx(A, {
                          presentation: r,
                          position: [
                            0,
                            Math.max(0.1, s.height * 0.58),
                            s.depth * 0.09,
                          ],
                          size: [
                            s.width * 0.22,
                            s.height * 0.34,
                            s.depth * 0.07,
                          ],
                          color: f,
                          roughness: 0.54,
                        }),
                        [-1, 1].flatMap((I) =>
                          [-1, 1].map(($) =>
                            e.jsx(
                              A,
                              {
                                presentation: r,
                                position: [
                                  I * s.width * 0.08,
                                  Math.max(0.05, s.height * 0.18),
                                  $ * s.depth * 0.065,
                                ],
                                size: [0.035, s.height * 0.36, 0.035],
                                color: f,
                                roughness: 0.6,
                              },
                              `${I}-${$}`,
                            ),
                          ),
                        ),
                      ],
                    },
                    `chair-${L}`,
                  ),
                ),
              ],
            }),
          s.kind === "desk" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height - x / 2, 0],
                  size: [s.width, x, s.depth],
                  color: u,
                  roughness: 0.5,
                }),
                b(s.height - x),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.55, -s.depth * 0.4],
                  size: [s.width * 0.48, s.height * 0.48, s.depth * 0.16],
                  color: f,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height + 0.14, -s.depth * 0.18],
                  size: [s.width * 0.34, s.height * 0.36, 0.045],
                  color: T(f, "#dff4ff", 0.28),
                  roughness: 0.42,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height + 0.015, -s.depth * 0.18],
                  size: [0.06, 0.08, 0.05],
                  color: f,
                  roughness: 0.56,
                }),
              ],
            }),
          s.kind === "wardrobe" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height / 2, 0],
                  size: [s.width, s.height, s.depth],
                  color: u,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.54, -s.depth / 2 - 0.004],
                  size: [0.035, s.height * 0.76, 0.02],
                  color: f,
                }),
                [-0.25, 0.25].map((w) =>
                  e.jsx(
                    A,
                    {
                      presentation: r,
                      position: [
                        w * s.width,
                        s.height * 0.54,
                        -s.depth / 2 - 0.012,
                      ],
                      size: [0.018, s.height * 0.68, 0.018],
                      color: f,
                      roughness: 0.48,
                    },
                    `wardrobe-panel-${w}`,
                  ),
                ),
              ],
            }),
          s.kind === "cabinet" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height / 2, 0],
                  size: [s.width, s.height, s.depth],
                  color: u,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height + 0.025, 0],
                  size: [s.width + 0.04, 0.05, s.depth + 0.04],
                  color: f,
                  roughness: 0.5,
                }),
                [-0.22, 0, 0.22].map((w) =>
                  e.jsx(
                    A,
                    {
                      presentation: r,
                      position: [
                        w * s.width,
                        s.height * 0.54,
                        -s.depth / 2 - 0.012,
                      ],
                      size: [0.014, s.height * 0.62, 0.016],
                      color: f,
                      roughness: 0.48,
                    },
                    `cabinet-line-${w}`,
                  ),
                ),
              ],
            }),
          (s.kind === "sideboard" ||
            s.kind === "shoe_cabinet" ||
            s.kind === "nightstand") &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.46, 0],
                  size: [s.width, s.height * 0.88, s.depth],
                  color: u,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height + 0.025, 0],
                  size: [s.width + 0.035, 0.05, s.depth + 0.035],
                  color: f,
                  roughness: 0.48,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.54, -s.depth / 2 - 0.012],
                  size: [s.width * 0.92, 0.014, 0.016],
                  color: f,
                  roughness: 0.48,
                }),
                s.kind === "nightstand"
                  ? e.jsx(A, {
                      presentation: r,
                      position: [0, s.height * 0.62, -s.depth / 2 - 0.016],
                      size: [s.width * 0.36, s.height * 0.08, 0.014],
                      color: j,
                      roughness: 0.5,
                    })
                  : [-0.25, 0.25].map((w) =>
                      e.jsx(
                        A,
                        {
                          presentation: r,
                          position: [
                            w * s.width,
                            s.height * 0.52,
                            -s.depth / 2 - 0.016,
                          ],
                          size: [0.014, s.height * 0.58, 0.016],
                          color: f,
                          roughness: 0.48,
                        },
                        `storage-line-${w}`,
                      ),
                    ),
                s.kind === "shoe_cabinet" &&
                  [0.32, 0.52, 0.72].map((w) =>
                    e.jsx(
                      A,
                      {
                        presentation: r,
                        position: [0, s.height * w, -s.depth / 2 - 0.02],
                        size: [s.width * 0.74, 0.012, 0.014],
                        color: j,
                        roughness: 0.55,
                      },
                      `shoe-slat-${w}`,
                    ),
                  ),
                b(Math.min(0.12, s.height * 0.22)),
              ],
            }),
          s.kind === "tv_stand" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.4, 0],
                  size: [s.width, s.height * 0.72, s.depth],
                  color: c,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.84, 0],
                  size: [s.width + 0.07, s.height * 0.12, s.depth + 0.045],
                  color: h,
                  roughness: 0.48,
                }),
                [-0.28, 0, 0.28].map((w) =>
                  e.jsx(
                    A,
                    {
                      presentation: r,
                      position: [
                        w * s.width,
                        s.height * 0.5,
                        -s.depth / 2 - 0.006,
                      ],
                      size: [s.width * 0.22, s.height * 0.18, 0.018],
                      color: h,
                      roughness: 0.5,
                    },
                    w,
                  ),
                ),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.5, -s.depth / 2 - 0.018],
                  size: [0.018, s.height * 0.44, 0.018],
                  color: f,
                  roughness: 0.48,
                }),
                b(Math.min(0.14, s.height * 0.28)),
              ],
            }),
          s.kind === "kitchen_island" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.42, 0],
                  size: [s.width * 0.92, s.height * 0.84, s.depth * 0.88],
                  color: c,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height + 0.035, 0],
                  size: [s.width + 0.08, 0.07, s.depth + 0.08],
                  color: h,
                  roughness: 0.44,
                }),
                e.jsxs("mesh", {
                  position: [s.width * 0.23, s.height + 0.076, -s.depth * 0.12],
                  receiveShadow: !0,
                  children: [
                    e.jsx("boxGeometry", {
                      args: [s.width * 0.2, 0.012, s.depth * 0.22],
                    }),
                    e.jsx("meshPhysicalMaterial", {
                      color: o === "night" ? "#7f95a7" : "#eef6f8",
                      roughness: 0.22,
                      metalness: 0.025,
                      clearcoat: 0.32,
                      clearcoatRoughness: 0.54,
                      transparent: !0,
                      opacity: n === "security" ? 0.46 : 0.78,
                    }),
                    e.jsx(ee, {
                      color: v.color,
                      threshold: v.threshold,
                      opacity: v.opacity * 0.65,
                      transparent: !0,
                    }),
                  ],
                }),
                [-0.08, 0.08].map((w) =>
                  e.jsxs(
                    "mesh",
                    {
                      position: [
                        s.width * -0.18 + w,
                        s.height + 0.083,
                        s.depth * 0.12,
                      ],
                      rotation: [-Math.PI / 2, 0, 0],
                      children: [
                        e.jsx("ringGeometry", { args: [0.055, 0.075, 24] }),
                        e.jsx("meshBasicMaterial", {
                          color: o === "night" ? "#a9bbc8" : "#9fb0b8",
                          transparent: !0,
                          opacity: 0.48,
                          toneMapped: !1,
                        }),
                      ],
                    },
                    w,
                  ),
                ),
              ],
            }),
          s.kind === "coffee_table" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsxs("mesh", {
                  position: [0, s.height, 0],
                  castShadow: !0,
                  receiveShadow: !0,
                  children: [
                    e.jsx("boxGeometry", {
                      args: [s.width, Math.min(0.06, s.height * 0.18), s.depth],
                    }),
                    e.jsx("meshPhysicalMaterial", {
                      color: o === "night" ? "#8fa5b4" : "#f0f8fb",
                      roughness: 0.2,
                      metalness: 0.01,
                      clearcoat: 0.34,
                      clearcoatRoughness: 0.5,
                      transparent: !0,
                      opacity: n === "security" ? 0.42 : 0.68,
                    }),
                    e.jsx(ee, {
                      color: v.color,
                      threshold: v.threshold,
                      opacity: v.opacity * 0.7,
                      transparent: !0,
                    }),
                  ],
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.48, 0],
                  size: [s.width * 0.56, s.height * 0.16, s.depth * 0.38],
                  color: c,
                  roughness: 0.56,
                }),
                b(Math.max(0.16, s.height * 0.72)),
              ],
            }),
          s.kind === "side_table" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsxs("mesh", {
                  position: [0, s.height, 0],
                  castShadow: !0,
                  receiveShadow: !0,
                  children: [
                    e.jsx("cylinderGeometry", {
                      args: [
                        s.width * 0.36,
                        s.width * 0.4,
                        Math.min(0.055, s.height * 0.16),
                        36,
                      ],
                    }),
                    e.jsx("meshPhysicalMaterial", {
                      color: o === "night" ? "#8fa5b4" : "#f0f8fb",
                      roughness: 0.22,
                      metalness: 0.01,
                      clearcoat: 0.32,
                      clearcoatRoughness: 0.52,
                      transparent: !0,
                      opacity: n === "security" ? 0.42 : 0.7,
                    }),
                    e.jsx(ee, {
                      color: v.color,
                      threshold: v.threshold,
                      opacity: v.opacity * 0.7,
                      transparent: !0,
                    }),
                  ],
                }),
                e.jsxs("mesh", {
                  position: [0, s.height * 0.5, 0],
                  castShadow: !0,
                  children: [
                    e.jsx("cylinderGeometry", {
                      args: [0.035, 0.045, s.height * 0.82, 18],
                    }),
                    e.jsx("meshPhysicalMaterial", {
                      color: f,
                      roughness: 0.44,
                      metalness: 0.025,
                      clearcoat: 0.22,
                      clearcoatRoughness: 0.62,
                    }),
                    e.jsx(ee, {
                      color: v.color,
                      threshold: v.threshold,
                      opacity: v.opacity * 0.58,
                      transparent: !0,
                    }),
                  ],
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height * 0.16, 0],
                  size: [s.width * 0.54, s.height * 0.12, s.depth * 0.54],
                  color: f,
                  roughness: 0.56,
                }),
              ],
            }),
          !1,
          !1,
          !1,
          !1,
          s.kind === "gas_stove" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(B, {
                  position: [0, s.height * 0.32, 0],
                  args: [s.width * 0.94, s.height * 0.64, s.depth * 0.92],
                  radius: 0.035,
                  smoothness: 4,
                  castShadow: !0,
                  receiveShadow: !0,
                  children: e.jsx("meshPhysicalMaterial", {
                    color: f,
                    roughness: 0.3,
                    metalness: 0.25,
                  }),
                }),
                e.jsx(B, {
                  position: [0, s.height * 0.72, 0],
                  args: [s.width, s.height * 0.22, s.depth],
                  radius: 0.012,
                  smoothness: 5,
                  castShadow: !0,
                  receiveShadow: !0,
                  children: e.jsx("meshPhysicalMaterial", {
                    color: "#26343b",
                    roughness: 0.2,
                    metalness: 0.18,
                    clearcoat: 0.35,
                    clearcoatRoughness: 0.32,
                  }),
                }),
                [-0.24, 0.24].map((w) =>
                  e.jsxs(
                    "group",
                    {
                      position: [w * s.width, s.height * 0.84, 0],
                      children: [
                        e.jsxs("mesh", {
                          rotation: [-Math.PI / 2, 0, 0],
                          children: [
                            e.jsx("torusGeometry", {
                              args: [s.width * 0.14, 0.018, 10, 28],
                            }),
                            e.jsx("meshPhysicalMaterial", {
                              color: "#8d9ba0",
                              roughness: 0.2,
                              metalness: 0.58,
                            }),
                          ],
                        }),
                        e.jsxs("mesh", {
                          rotation: [-Math.PI / 2, 0, 0],
                          children: [
                            e.jsx("cylinderGeometry", {
                              args: [
                                s.width * 0.105,
                                s.width * 0.105,
                                0.012,
                                24,
                              ],
                            }),
                            e.jsx("meshBasicMaterial", { color: "#141d21" }),
                          ],
                        }),
                      ],
                    },
                    w,
                  ),
                ),
                [-0.2, 0.2].map((w) =>
                  e.jsxs(
                    "mesh",
                    {
                      position: [w * s.width, s.height * 0.78, s.depth * 0.47],
                      rotation: [Math.PI / 2, 0, 0],
                      children: [
                        e.jsx("cylinderGeometry", {
                          args: [0.035, 0.035, 0.025, 20],
                        }),
                        e.jsx("meshPhysicalMaterial", {
                          color: "#b8c3c6",
                          roughness: 0.18,
                          metalness: 0.7,
                        }),
                      ],
                    },
                    w,
                  ),
                ),
              ],
            }),
          s.kind === "bookshelf" &&
            e.jsxs(e.Fragment, {
              children: [
                e.jsx(A, {
                  presentation: r,
                  position: [0, s.height / 2, s.depth * 0.42],
                  size: [s.width, s.height, s.depth * 0.12],
                  color: h,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [-s.width / 2 + 0.035, s.height / 2, 0],
                  size: [0.07, s.height, s.depth],
                  color: c,
                }),
                e.jsx(A, {
                  presentation: r,
                  position: [s.width / 2 - 0.035, s.height / 2, 0],
                  size: [0.07, s.height, s.depth],
                  color: c,
                }),
                [0.18, 0.38, 0.58, 0.78].map((w) =>
                  e.jsx(
                    A,
                    {
                      presentation: r,
                      position: [0, s.height * w, 0],
                      size: [s.width, 0.055, s.depth],
                      color: c,
                      roughness: 0.56,
                    },
                    w,
                  ),
                ),
                [-0.28, -0.1, 0.1, 0.28].map((w, S) =>
                  e.jsx(
                    A,
                    {
                      presentation: r,
                      position: [
                        w * s.width,
                        s.height * (0.26 + (S % 2) * 0.2),
                        -s.depth * 0.08,
                      ],
                      size: [s.width * 0.1, s.height * 0.16, s.depth * 0.42],
                      color: S % 2 ? "#8198a8" : "#9f8d7f",
                      roughness: 0.66,
                    },
                    w,
                  ),
                ),
              ],
            }),
        ],
      }),
    });
  });
function er(t) {
  const s = t.flatMap((i) => i.walls.flatMap((d) => [d.start, d.end])),
    o = s.length ? Math.min(...s.map((i) => i[0])) : 0,
    r = s.length ? Math.max(...s.map((i) => i[0])) : 8,
    n = s.length ? Math.min(...s.map((i) => i[1])) : 0,
    a = s.length ? Math.max(...s.map((i) => i[1])) : 6;
  return { minX: o, maxX: r, minZ: n, maxZ: a };
}
const $e = 1e-4,
  ke = (t) => Math.round(t * 1e4) / 1e4,
  le = (t) => `${t[0].toFixed(4)},${t[1].toFixed(4)}`,
  Be = (t, s) => {
    const o = le(t),
      r = le(s);
    return o < r ? `${o}|${r}` : `${r}|${o}`;
  };
function rs(t) {
  const { minX: s, maxX: o, minZ: r, maxZ: n } = er(t);
  return [
    [s, r],
    [o, r],
    [o, n],
    [s, n],
  ];
}
function os(t, s, o, r) {
  if (Math.abs(r - o) <= $e) return;
  const n = ke(s),
    a = n.toFixed(4),
    i = t.get(a) ?? { coord: n, intervals: [] };
  (i.intervals.push({ from: ke(Math.min(o, r)), to: ke(Math.max(o, r)) }),
    t.set(a, i));
}
function ns(t, s) {
  const o = [];
  for (const r of t.values()) {
    const n = [
      ...new Set(
        r.intervals.flatMap((a) => [a.from, a.to]).map((a) => a.toFixed(4)),
      ),
    ]
      .map(Number)
      .sort((a, i) => a - i);
    for (let a = 0; a < n.length - 1; a += 1) {
      const i = n[a],
        d = n[a + 1];
      d - i <= $e ||
        r.intervals.filter((c) => c.from <= i + $e && c.to >= d - $e).length !==
          1 ||
        o.push(
          s
            ? { start: [i, r.coord], end: [d, r.coord] }
            : { start: [r.coord, i], end: [r.coord, d] },
        );
    }
  }
  return o;
}
function Ba(t) {
  const s = new Map(),
    o = new Map(),
    r = new Map();
  for (const l of t.flatMap((c) => c.rooms))
    for (let c = 0; c < l.polygon.length; c += 1) {
      const h = [ke(l.polygon[c][0]), ke(l.polygon[c][1])],
        u = [
          ke(l.polygon[(c + 1) % l.polygon.length][0]),
          ke(l.polygon[(c + 1) % l.polygon.length][1]),
        ];
      if (Math.abs(h[1] - u[1]) <= $e) {
        os(s, (h[1] + u[1]) / 2, h[0], u[0]);
        continue;
      }
      if (Math.abs(h[0] - u[0]) <= $e) {
        os(o, (h[0] + u[0]) / 2, h[1], u[1]);
        continue;
      }
      const f = Be(h, u),
        j = r.get(f);
      j ? (j.count += 1) : r.set(f, { start: h, end: u, count: 1 });
    }
  const n = [
    ...ns(s, !0),
    ...ns(o, !1),
    ...[...r.values()].filter((l) => l.count === 1),
  ];
  if (!n.length) return [rs(t)];
  const a = new Set(n.map((l) => Be(l.start, l.end))),
    i = new Map();
  for (const l of n) {
    const c = le(l.start),
      h = le(l.end);
    (i.set(c, [...(i.get(c) ?? []), l.end]),
      i.set(h, [...(i.get(h) ?? []), l.start]));
  }
  const d = [];
  for (const l of n) {
    const c = Be(l.start, l.end);
    if (!a.has(c)) continue;
    const h = [l.start, l.end];
    a.delete(c);
    let u = l.end,
      f = 0;
    for (; le(u) !== le(l.start) && f < n.length + 4;) {
      f += 1;
      const j = le(u),
        v = le(h[h.length - 2]),
        y = (i.get(j) ?? []).filter((b) => a.has(Be(u, b))),
        x = y.find((b) => le(b) !== v) ?? y[0];
      if (!x) break;
      (a.delete(Be(u, x)), h.push(x), (u = x));
    }
    (h.length > 3 && le(h.at(-1) ?? h[0]) === le(h[0]) && h.pop(),
      h.length >= 3 && d.push(h));
  }
  return d.length ? d : [rs(t)];
}
function Ha(t) {
  return (
    t.reduce((s, o, r) => {
      const n = t[(r + 1) % t.length];
      return s + o[0] * n[1] - n[0] * o[1];
    }, 0) / 2
  );
}
function Da(t) {
  const s = Ha(t) < 0 ? [...t].reverse() : t,
    o = new Ne(),
    r = s[0];
  o.moveTo(r[0], -r[1]);
  for (const n of s.slice(1)) o.lineTo(n[0], -n[1]);
  return (o.closePath(), o);
}
const Wa = {
    depth: 0.16,
    bevelEnabled: !0,
    bevelSize: 0.026,
    bevelThickness: 0.012,
    bevelSegments: 2,
    curveSegments: 2,
  },
  Va = M.memo(function ({ loops: s, theme: o, presentationMode: r }) {
    const n = oe(),
      a = n === "cartoon",
      i = n === "cream",
      d = me(o, r),
      l = M.useMemo(() => s.map(Da), [s]),
      c =
        a || i
          ? d.foundation
          : T(
              d.foundation,
              d.ground,
              o === "night" || r === "shade" || r === "security" ? 0.16 : 0.28,
            ),
      h = a ? "#41506a" : i ? "#877c6c" : T(d.foundation, "#172942", 0.28);
    return e.jsx("group", {
      position: [0, -0.155, 0],
      renderOrder: -2,
      children: l.map((u, f) =>
        e.jsxs(
          "mesh",
          {
            rotation: [-Math.PI / 2, 0, 0],
            receiveShadow: !0,
            castShadow: !0,
            children: [
              e.jsx("extrudeGeometry", { args: [u, Wa] }),
              e.jsx("meshPhysicalMaterial", {
                color: c,
                roughness: i ? 0.68 : 0.42,
                metalness: i ? 0.012 : 0.035,
                clearcoat: i ? 0.05 : 0.24,
                clearcoatRoughness: i ? 0.86 : 0.58,
              }),
              e.jsx(ee, {
                color: h,
                threshold: 18,
                opacity: a ? 0.54 : i ? 0.42 : 0.34,
                transparent: !0,
              }),
            ],
          },
          f,
        ),
      ),
    });
  }),
  Ua = M.memo(function ({ loops: s, theme: o, presentationMode: r }) {
    const a = oe() === "cream",
      i = me(o, r),
      d = o === "night" || r === "shade" || r === "security",
      l = a ? 0.48 : 0.58,
      c = -0.148,
      h = a
        ? T(i.ground, "#fff6de", 0.54)
        : d
          ? T(i.glow, "#d7e9ff", 0.46)
          : T(i.glow, "#f3fbff", 0.58),
      u = a ? 0.18 : d ? 0.38 : 0.32,
      f = M.useMemo(() => {
        const v = [];
        for (const [y, x] of s.entries())
          for (let b = 0; b < x.length; b += 1) {
            const w = x[b],
              S = x[(b + 1) % x.length],
              G = S[0] - w[0],
              L = S[1] - w[1],
              I = Math.hypot(G, L);
            I <= 0.02 ||
              v.push({
                id: `${y}-${b}`,
                center: [(w[0] + S[0]) / 2, c - l / 2, (w[1] + S[1]) / 2],
                length: I,
                angle: Math.atan2(L, G),
              });
          }
        return v;
      }, [s, l]),
      j = M.useMemo(
        () => ({ uColor: { value: new Te(h) }, uOpacity: { value: u } }),
        [h, u],
      );
    return e.jsx("group", {
      renderOrder: -5,
      children: f.map((v) =>
        e.jsxs(
          "mesh",
          {
            position: v.center,
            rotation: [0, -v.angle, 0],
            renderOrder: -5,
            children: [
              e.jsx("planeGeometry", { args: [v.length, l, 1, 1] }),
              e.jsx("shaderMaterial", {
                uniforms: j,
                vertexShader: `
              varying float vTopFade;
              void main() {
                vTopFade = clamp(position.y / ${l.toFixed(4)} + 0.5, 0.0, 1.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
                fragmentShader: `
              uniform vec3 uColor;
              uniform float uOpacity;
              varying float vTopFade;
              void main() {
                float verticalFade = smoothstep(0.0, 1.0, vTopFade);
                float hotTop = smoothstep(0.7, 1.0, vTopFade);
                float alpha = uOpacity * pow(verticalFade, 2.8);
                if (alpha < 0.01) discard;
                vec3 color = mix(uColor * 0.7, vec3(1.0), hotTop * 0.36);
                gl_FragColor = vec4(color, alpha);
              }
            `,
                side: Y,
                blending: Q,
                depthWrite: !1,
                depthTest: !0,
                transparent: !0,
                toneMapped: !1,
              }),
            ],
          },
          v.id,
        ),
      ),
    });
  });
// ===== ha3d-self: F6 宠物组件在 ha3dPet.js 里，选了宠物才加载（B6：首页默认不下载） =====
const ha3dPet = M.lazy(() =>
  import("./ha3dPet.js").then((t) => ({ default: t.Ha3dPet })),
);
function Ka({
  floor: t,
  project: s,
  entities: o,
  wallMode: r,
  showDevices: n,
  showLabels: a,
  elevation: i,
  theme: d = "day",
  presentation: l = !1,
  presentationMode: c = "overview",
  wallThicknessScale: h = 1,
  focusedRoom: u,
  showRoomBadges: f = !1,
  onRoomFocus: j,
  onRoomLightingAction: v,
  onRoomShadeAction: y,
  onRoomSecuritySelect: x,
  onEntitySelect: b,
  onDeviceSelect: w,
  hoveredRoomKey: S,
  setHoveredRoomKey: G,
  pet: ha3dPetKind = "none", // ha3d-self: F6
}) {
  const L = M.useRef(null),
    I = Oe();
  te((z, U) => {
    if (!L.current || L.current.position.y === i) return;
    const V = X.damp(L.current.position.y, i, 8, Math.min(U, 0.05));
    ((L.current.position.y = Math.abs(V - i) < 0.002 ? i : V), I());
  });
  const $ = t.walls.flatMap((z) => [z.start, z.end]),
    p = $.length ? Math.min(...$.map((z) => z[0])) : 0,
    m = $.length ? Math.max(...$.map((z) => z[0])) : 8,
    C = $.length ? Math.min(...$.map((z) => z[1])) : 0,
    O = $.length ? Math.max(...$.map((z) => z[1])) : 6,
    g = (p + m) / 2,
    _ = (C + O) / 2,
    k = M.useMemo(() => t.walls.filter((z) => !z.transparent), [t.walls]),
    E = M.useMemo(
      () =>
        new Map(
          t.walls.map((z) => [
            z.id,
            t.openings.filter((U) => U.wallId === z.id),
          ]),
        ),
      [t.walls, t.openings],
    ),
    P = (z) => {
      const U = Math.abs(z.end[1] - z.start[1]) < 0.04,
        V = Math.abs(z.end[0] - z.start[0]) < 0.04,
        D = (z.start[0] + z.end[0]) / 2,
        K = (z.start[1] + z.end[1]) / 2,
        q = (U && K > _) || (V && D > g);
      return l
        ? gt(z.height, q)
        : r === "cutaway" && q
          ? Math.min(0.72, z.height)
          : z.height;
    },
    N = t.devices.filter((z) => {
      const U = o[z.entityId];
      return !!(U && ta(z, U, l, c));
    }),
    R = sa(l, c)
      ? t.devices.filter((z) => {
          var U, V;
          return (
            ((U = o[z.entityId]) == null ? void 0 : U.domain) === "switch" &&
            ((V = z.controlledLightFixtures) == null ? void 0 : V.length)
          );
        })
      : [],
    F = !l || c === "overview" || c === "lighting";
  return e.jsxs("group", {
    ref: L,
    position: [0, 0, 0],
    children: [
      t.rooms.map((z) => {
        const U = `${t.id}:${z.id}`,
          V = N.filter((xe) => xe.roomId === z.id),
          D = ra(V, o, c),
          K = c === "overview" ? [] : Le(z, t, o, c),
          q = c === "environment" ? Ss(z, t, o) : void 0,
          se =
            c === "environment"
              ? (q == null ? void 0 : q.source) !== "unconfigured"
              : K.length > 0,
          ve = c === "environment" ? se : D.modeMatches > 0 || se,
          ue = c === "security" && D.alerts > 0,
          fe = aa(z, t, o),
          Me = F && fe.active > 0;
        return e.jsxs(
          "group",
          {
            children: [
              l &&
                Me &&
                e.jsx(Jt, {
                  room: z,
                  color: fe.color,
                  opacity: fe.opacity,
                  alert: !1,
                  y: 0.041,
                  renderOrder: 1,
                  edgeOpacity: fe.edgeOpacity,
                  blending: Ee,
                }),
              l &&
                ue &&
                D.opacity > 0 &&
                e.jsx(Jt, {
                  room: z,
                  color: D.color,
                  opacity: D.opacity,
                  alert: c === "security" && D.alerts > 0,
                  y: 0.052,
                  renderOrder: 3,
                }),
              e.jsx(ua, {
                room: z,
                project: s,
                showLabel: a,
                theme: d,
                presentation: l,
                presentationMode: c,
                accented: ve || Me || D.active > 0 || D.alerts > 0,
                lit: Me,
                lightColor: fe.color,
                lightLevel: fe.level,
                highlighted:
                  S === U ||
                  ((u == null ? void 0 : u.floorId) === t.id &&
                    u.roomId === z.id),
                onHover: (xe) => G(xe ? U : void 0),
                onFocus: () =>
                  j == null ? void 0 : j({ floorId: t.id, roomId: z.id }),
              }),
              l &&
                f &&
                se &&
                e.jsx(ha, {
                  room: z,
                  floor: t,
                  entities: o,
                  theme: d,
                  mode: c,
                  onLightingAction: v,
                  onShadeAction: y,
                  onSecuritySelect: x,
                }),
            ],
          },
          z.id,
        );
      }),
      l &&
        e.jsx(ga, {
          walls: k,
          openings: t.openings,
          thicknessScale: h,
          theme: d,
          mode: c,
        }),
      k.map((z) =>
        e.jsx(
          xa,
          {
            wall: z,
            openings: E.get(z.id),
            renderHeight: P(z),
            color: Hs(s, z.materialId, "#f3f1ed"),
            theme: d,
            presentation: l,
            presentationMode: c,
            thicknessScale: h,
            entities: o,
          },
          z.id,
        ),
      ),
      t.furniture.map((z) =>
        e.jsx(
          Aa,
          { item: z, theme: d, presentation: l, presentationMode: c },
          z.id,
        ),
      ),
      n &&
        N.map((z) =>
          e.jsx(
            Ra,
            {
              device: z,
              entity: o[z.entityId],
              presentation: l,
              theme: d,
              presentationMode: c,
              floorHeight: t.height,
              onSelect: b,
              onDeviceSelect: w,
            },
            z.id,
          ),
        ),
      n &&
        R.flatMap((z) =>
          (z.controlledLightFixtures ?? []).map((U) =>
            e.jsx(
              Fa,
              {
                fixture: U,
                switchDevice: z,
                entity: o[z.entityId],
                presentation: l,
                theme: d,
                presentationMode: c,
                onSelect: b,
                onDeviceSelect: w,
              },
              `${z.id}-${U.id}`,
            ),
          ),
        ),
      l &&
        ha3dPetKind !== "none" &&
        e.jsx(M.Suspense, {
          fallback: null,
          children: e.jsx(ha3dPet, { floor: t, kind: ha3dPetKind }),
        }), // ha3d-self: F6
    ],
  });
}
function qa({
  project: t,
  entities: s,
  floorId: o,
  showAllFloors: r,
  wallMode: n,
  showDevices: a,
  showLabels: i,
  showGrid: d,
  theme: l = "day",
  presentation: c = !1,
  presentationMode: h = "overview",
  visualStyle: u = "glass",
  wallThicknessScale: f = 1,
  focusedRoom: j,
  showRoomBadges: v = !1,
  onRoomFocus: y,
  onRoomLightingAction: x,
  onRoomShadeAction: b,
  onRoomSecuritySelect: w,
  onEntitySelect: S,
  onDeviceSelect: G,
  autoRotate: L = !1,
  pet: ha3dPetKind = "none", // ha3d-self: F6
}) {
  const I = M.useMemo(
      () => [...t.floors].sort((D, K) => D.level - K.level),
      [t.floors],
    ),
    $ = I.find((D) => D.id === o) ?? I[0],
    p = M.useMemo(() => (r ? I : $ ? [$] : []), [I, $, r]),
    m = p[0],
    C = M.useMemo(
      () => (m ? Ba([m]) : []),
      [m == null ? void 0 : m.rooms, m == null ? void 0 : m.walls],
    ),
    [O, g] = M.useState(),
    _ = M.useRef(null),
    k = Oe(),
    { minX: E, maxX: P, minZ: N, maxZ: R } = er(p),
    F = -(E + P) / 2,
    z = -(N + R) / 2;
  let U = 0;
  const V = new Map();
  for (const D of p)
    (V.set(D.id, U), (U += c ? Rt(D.height) + Fs() : D.height + 1.15));
  return (
    te((D, K) => {
      !L ||
        !_.current ||
        ((_.current.rotation.y += Math.min(K, 0.05) * 0.18), k());
    }),
    e.jsxs(Bs.Provider, {
      value: u,
      children: [
        e.jsx(ya, {}),
        e.jsxs("group", {
          ref: _,
          onDoubleClick: () => (y == null ? void 0 : y(void 0)),
          children: [
            d &&
              e.jsx("gridHelper", {
                args: [18, 36, "#cfd8dc", "#edf2f1"],
                position: [0, -0.025, 0],
              }),
            e.jsxs("group", {
              position: [F, 0, z],
              children: [
                c &&
                  u !== "cartoon" &&
                  m &&
                  e.jsx(Ua, { loops: C, theme: l, presentationMode: h }),
                c &&
                  m &&
                  e.jsx(Va, { loops: C, theme: l, presentationMode: h }),
                p.map((D) =>
                  e.jsx(
                    Ka,
                    {
                      floor: D,
                      project: t,
                      entities: s,
                      wallMode: n,
                      showDevices: a,
                      showLabels: i,
                      elevation: V.get(D.id) ?? 0,
                      theme: l,
                      presentation: c,
                      presentationMode: h,
                      wallThicknessScale: f,
                      focusedRoom: j,
                      showRoomBadges: v,
                      onRoomFocus: y,
                      onRoomLightingAction: x,
                      onRoomShadeAction: b,
                      onRoomSecuritySelect: w,
                      onEntitySelect: S,
                      onDeviceSelect: G,
                      hoveredRoomKey: O,
                      setHoveredRoomKey: g,
                      // ha3d-self: F6 宠物只在当前楼层（全楼层视图时是 level 最低的楼层）
                      pet: D === m ? ha3dPetKind : "none",
                    },
                    D.id,
                  ),
                ),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
function Xa({
  project: t,
  floorId: s,
  showAllFloors: o,
  presentation: r,
  focusedRoom: n,
}) {
  const a = [...t.floors].sort((g, _) => g.level - _.level),
    i = a.find((g) => g.id === s) ?? a[0],
    d = o ? a : [i],
    l = d.flatMap((g) => g.walls.flatMap((_) => [_.start, _.end])),
    c = l.length ? Math.min(...l.map(([g]) => g)) : 0,
    h = l.length ? Math.max(...l.map(([g]) => g)) : 8,
    u = l.length ? Math.min(...l.map(([, g]) => g)) : 0,
    f = l.length ? Math.max(...l.map(([, g]) => g)) : 6,
    j = h - c,
    v = f - u,
    y = r ? Fs() : 1.15,
    x = (g) => (r ? Rt(g) : g),
    b = o
      ? d.reduce((g, _) => g + x(_.height), 0) + Math.max(0, d.length - 1) * y
      : x(i.height),
    w = r ? Math.max(0.72, Math.min(1.12, x(i.height) * 0.44)) : 0.55,
    S = r ? 0.92 : 2,
    G = {
      target: [0, o ? Math.max(0.72, b / 2 - S) : w, 0],
      distance:
        Math.max(9.5, j * 1.42, v * 1.7, b * (o ? 1.65 : 1.3)) *
        (r && o ? 1.06 : 1),
    },
    L = n ? d.find((g) => g.id === n.floorId) : void 0,
    I =
      L == null
        ? void 0
        : L.rooms.find((g) => g.id === (n == null ? void 0 : n.roomId));
  if (!L || !(I != null && I.polygon.length)) return G;
  let $ = 0;
  for (const g of d) {
    if (g.id === L.id) break;
    $ += x(g.height) + y;
  }
  const p = I.polygon.map(([g]) => g),
    m = I.polygon.map(([, g]) => g),
    C = Math.max(...p) - Math.min(...p),
    O = Math.max(...m) - Math.min(...m);
  return {
    target: [
      (Math.min(...p) + Math.max(...p)) / 2 - (c + h) / 2,
      $ + Math.min(x(L.height) * 0.48, r ? 1.18 : 1.15),
      (Math.min(...m) + Math.max(...m)) / 2 - (u + f) / 2,
    ],
    distance: Math.max(5.8, C * 2.25, O * 2.35, x(L.height) * (r ? 1.72 : 1.8)),
  };
}
function Za(t, s, o) {
  const r = Math.max(1, t - o.left - o.right),
    n = Math.max(1, s - o.top - o.bottom);
  return {
    safeWidth: r,
    safeHeight: n,
    aspect: r / n,
    horizontalOffset: (o.left - o.right) / 2,
    verticalOffset: (o.top - o.bottom) / 2,
  };
}
const Ya = {
  eco: {
    antialias: !1,
    dpr: [0.55, 0.75],
    extraLights: "minimal",
    shadowMapSize: [256, 256],
    shadows: !1,
  },
  smooth: {
    antialias: !1,
    dpr: [0.75, 1],
    extraLights: "reduced",
    shadowMapSize: [512, 512],
    shadows: !0,
  },
  balanced: {
    antialias: !0,
    dpr: [1, 1.35],
    extraLights: "full",
    shadowMapSize: [1024, 1024],
    shadows: !0,
  },
  high: {
    antialias: !0,
    dpr: [1, 1.6],
    extraLights: "full",
    shadowMapSize: [1536, 1536],
    shadows: !0,
  },
};
function Qa({
  preset: t,
  frame: s,
  presentation: o,
  showAllFloors: r,
  viewportInsets: n,
  resetKey: a,
  controlPanelOpen: i,
  focusEntityId: d,
}) {
  const { camera: l, size: c, controls: h, invalidate: u, scene: f } = be(),
    j = M.useRef(!0),
    v = M.useRef(!1),
    y = M.useRef(),
    x = M.useRef(),
    b = M.useRef(),
    w = M.useRef(),
    S = M.useMemo(() => new J(...s.target), [s.target]),
    G = Za(c.width, c.height, n),
    L = c.width <= 620,
    I = o && r,
    $ = o
      ? I
        ? c.width <= 620
          ? 1.18
          : c.width <= 960
            ? 1.04
            : 0.94
        : c.width <= 620
          ? 1.06
          : c.width <= 960
            ? 0.88
            : 0.8
      : c.width <= 620
        ? 1.02
        : 0.88,
    p =
      c.width <= 620
        ? Math.max(1, Math.min(1.52, 0.78 / Math.max(0.1, G.aspect)))
        : Math.max(1, Math.min(1.72, 0.92 / Math.max(0.1, G.aspect))),
    m = s.distance * $ * p,
    C = M.useMemo(
      () =>
        t === "top"
          ? new J(s.target[0], s.target[1] + m * 1.65, s.target[2] + 0.001)
          : t === "front"
            ? new J(s.target[0], s.target[1] + m * 0.28, s.target[2] + m * 1.5)
            : I
              ? new J(
                  s.target[0] + m * 0.86,
                  s.target[1] + m * 0.72,
                  s.target[2] + m * 1.04,
                )
              : o
                ? new J(
                    s.target[0] + m * 0.74,
                    s.target[1] + m * 1.08,
                    s.target[2] + m * 0.88,
                  )
                : new J(
                    s.target[0] + m * 0.86,
                    s.target[1] + m * 0.86,
                    s.target[2] + m * 1.04,
                  ),
      [I, s.target, t, m],
    ),
    O = M.useMemo(() => {
      const g = S.clone().sub(C).normalize(),
        _ = t === "top" ? new J(0, 0, -1) : new J(0, 1, 0),
        k = g.clone().cross(_).normalize(),
        E = k.clone().cross(g).normalize(),
        P = l instanceof yt ? l.fov : 32,
        N = (2 * m * Math.tan(X.degToRad(P) / 2)) / Math.max(1, c.height);
      return S.clone()
        .addScaledVector(k, -G.horizontalOffset * N)
        .addScaledVector(E, G.verticalOffset * N);
    }, [S, l, t, m, c.height, C, G.horizontalOffset, G.verticalOffset]);
  return (
    M.useEffect(() => {
      (l.up.set(0, t === "top" ? 0 : 1, t === "top" ? -1 : 0),
        l instanceof yt &&
          ((l.fov = L
            ? t === "top"
              ? 36
              : o
                ? 34
                : 38
            : t === "top"
              ? o
                ? 29
                : 31
              : o
                ? 29
                : 36),
          l.updateProjectionMatrix()),
        u());
    }, [l, L, u, t, o]),
    M.useEffect(() => {
      i ||
        v.current ||
        ((w.current = { position: C.clone(), target: O.clone() }),
        (j.current = !0),
        u());
    }, [u, t, o, a, r, C, O, i]),
    M.useEffect(() => {
      var k;
      if (i === v.current && d === y.current) return;
      const g = i && !v.current;
      ((v.current = i), (y.current = d));
      const _ = h;
      if (i) {
        const E = {
          position: l.position.clone(),
          target:
            ((k = _ == null ? void 0 : _.target) == null
              ? void 0
              : k.clone()) ?? O.clone(),
        };
        ((g || !b.current) && (b.current = E), f.updateMatrixWorld(!0));
        let P;
        f.traverse((se) => {
          !P && d && se.userData.focusEntityId === d && (P = se);
        });
        const N = b.current,
          R = P ? P.getWorldPosition(new J()) : N.target.clone(),
          F = N.position.distanceTo(N.target),
          z = P ? Math.min(F, Math.max(6, F * 0.68)) : F,
          U = E.position.clone().sub(E.target).normalize(),
          V = l instanceof yt ? l.fov : 32,
          D = (2 * z * Math.tan(X.degToRad(V) / 2)) / Math.max(1, c.height),
          q = new J(1, 0, 0)
            .applyQuaternion(l.quaternion)
            .multiplyScalar(Math.min(120, c.width * 0.06) * D);
        w.current = {
          position: R.clone().addScaledVector(U, z).add(q),
          target: R.clone().add(q),
        };
      } else b.current && ((w.current = b.current), (b.current = void 0));
      ((j.current = !0), u());
    }, [l, i, h, d, u, O, f, c.height, c.width]),
    M.useEffect(() => {
      var k;
      const g = h,
        _ = () => {
          j.current = !1;
        };
      return (
        (k = g == null ? void 0 : g.addEventListener) == null ||
          k.call(g, "start", _),
        () => {
          var E;
          return (E = g == null ? void 0 : g.removeEventListener) == null
            ? void 0
            : E.call(g, "start", _);
        }
      );
    }, [h]),
    te((g, _) => {
      var z, U, V;
      const k = w.current;
      if (!j.current || !k) return;
      const E = h;
      ((z = x.current) == null ? void 0 : z.destination) !== k &&
        (x.current = {
          destination: k,
          position: l.position.clone(),
          target:
            ((U = E == null ? void 0 : E.target) == null
              ? void 0
              : U.clone()) ?? O.clone(),
          elapsed: 0,
        });
      const P = x.current;
      P.elapsed += Math.min(_, 0.05);
      const N =
          typeof window < "u" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        R = Math.min(1, P.elapsed / (N ? 0.15 : 0.95)),
        F = R * R * R * (R * (R * 6 - 15) + 10);
      (l.position.lerpVectors(P.position, k.position, F),
        E != null && E.target
          ? (E.target.lerpVectors(P.target, k.target, F), l.lookAt(E.target))
          : l.lookAt(k.target),
        R === 1 &&
          (l.position.copy(k.position),
          (V = E == null ? void 0 : E.target) == null || V.copy(k.target),
          l.lookAt(k.target),
          (j.current = !1)),
        u());
    }),
    null
  );
}
// ha3d-self: B6 删除卡通风格描边（Ja + OutlineEffect 类 Ko）：卡通风格已在首页迁移为奶油风格，visualStyle 不会是 "cartoon"
const Wt = {
  eco: { rain: 56, snow: 42, wind: 5 },
  smooth: { rain: 86, snow: 64, wind: 7 },
  balanced: { rain: 132, snow: 96, wind: 9 },
  high: { rain: 188, snow: 132, wind: 12 },
};
function Z(t) {
  return Math.abs(Math.sin(t * 12.9898) * 43758.5453) % 1;
}
function ei({ frame: t, intensity: s, storm: o, quality: r }) {
  const n = Math.max(24, Math.round(Wt[r].rain * Math.max(0.35, s))),
    a = Math.max(8, t.distance * 1.18),
    i = Math.max(4.5, t.distance * 0.52),
    d = M.useMemo(() => {
      const c = new Ze();
      return (
        c.setAttribute("position", new zt(new Float32Array(n * 2 * 3), 3)),
        c
      );
    }, [n]),
    l = M.useMemo(
      () =>
        Array.from({ length: n }, (c, h) => ({
          x: (Z(h + 1) - 0.5) * a,
          z: (Z(h + 301) - 0.5) * a,
          offset: Z(h + 701),
          length: X.lerp(0.22, o ? 0.54 : 0.38, Z(h + 1201)),
        })),
      [n, a, o],
    );
  return (
    M.useEffect(() => () => d.dispose(), [d]),
    te(({ clock: c }) => {
      const h = d.getAttribute("position"),
        u = h.array,
        f = o ? 1.95 : 1.42,
        j = o ? 1.25 : 0.58;
      for (let v = 0; v < n; v += 1) {
        const y = l[v],
          x = (y.offset + c.elapsedTime * f) % 1,
          b = t.target[0] + y.x + x * j,
          w = t.target[1] + i * (0.75 - x),
          S = t.target[2] + y.z - x * j * 0.36,
          G = v * 6;
        ((u[G] = b),
          (u[G + 1] = w),
          (u[G + 2] = S),
          (u[G + 3] = b + j * 0.08),
          (u[G + 4] = w - y.length),
          (u[G + 5] = S - j * 0.03));
      }
      h.needsUpdate = !0;
    }),
    e.jsx("lineSegments", {
      name: "ha3d-weather-rain", // ha3d-self: F3 标注已有粒子
      geometry: d,
      renderOrder: 2,
      children: e.jsx("lineBasicMaterial", {
        color: o ? "#dbeaff" : "#cce7ff",
        transparent: !0,
        opacity: o ? 0.48 : 0.34,
        depthWrite: !1,
        blending: Q,
        toneMapped: !1,
      }),
    })
  );
}
function ti({ frame: t, intensity: s, quality: o }) {
  const r = Math.max(28, Math.round(Wt[o].snow * Math.max(0.36, s))),
    n = Math.max(8, t.distance * 1.12),
    a = Math.max(4.2, t.distance * 0.5),
    i = M.useMemo(() => {
      const l = new Ze();
      return (
        l.setAttribute("position", new zt(new Float32Array(r * 3), 3)),
        l
      );
    }, [r]),
    d = M.useMemo(
      () =>
        Array.from({ length: r }, (l, c) => ({
          x: (Z(c + 17) - 0.5) * n,
          z: (Z(c + 337) - 0.5) * n,
          offset: Z(c + 937),
          drift: X.lerp(0.16, 0.58, Z(c + 1437)),
        })),
      [r, n],
    );
  return (
    M.useEffect(() => () => i.dispose(), [i]),
    te(({ clock: l }) => {
      const c = i.getAttribute("position"),
        h = c.array;
      for (let u = 0; u < r; u += 1) {
        const f = d[u],
          j = (f.offset + l.elapsedTime * 0.18) % 1,
          v = Math.sin(l.elapsedTime * 0.72 + u) * f.drift,
          y = u * 3;
        ((h[y] = t.target[0] + f.x + v),
          (h[y + 1] = t.target[1] + a * (0.72 - j)),
          (h[y + 2] =
            t.target[2] +
            f.z +
            Math.cos(l.elapsedTime * 0.48 + u) * f.drift * 0.42));
      }
      c.needsUpdate = !0;
    }),
    e.jsx("points", {
      name: "ha3d-weather-snow", // ha3d-self: F3 标注已有粒子
      geometry: i,
      renderOrder: 2,
      children: e.jsx("pointsMaterial", {
        color: "#f6fbff",
        size: 0.06,
        sizeAttenuation: !0,
        transparent: !0,
        opacity: 0.78,
        depthWrite: !1,
        blending: Q,
        toneMapped: !1,
      }),
    })
  );
}
function si({ frame: t, intensity: s, quality: o }) {
  const r = Math.max(4, Math.round(Wt[o].wind * Math.max(0.55, s))),
    n = Math.max(7, t.distance * 1.05),
    a = M.useMemo(() => {
      const d = new Ze();
      return (
        d.setAttribute("position", new zt(new Float32Array(r * 2 * 3), 3)),
        d
      );
    }, [r]),
    i = M.useMemo(
      () =>
        Array.from({ length: r }, (d, l) => ({
          y: X.lerp(0.55, 2.6, Z(l + 43)),
          z: (Z(l + 443) - 0.5) * n,
          offset: Z(l + 843),
          length: X.lerp(0.9, 1.8, Z(l + 1243)),
        })),
      [r, n],
    );
  return (
    M.useEffect(() => () => a.dispose(), [a]),
    te(({ clock: d }) => {
      const l = a.getAttribute("position"),
        c = l.array;
      for (let h = 0; h < r; h += 1) {
        const u = i[h],
          f = (u.offset + d.elapsedTime * (0.18 + s * 0.18)) % 1,
          j = t.target[0] - n * 0.52 + f * n,
          v = t.target[1] + u.y + Math.sin(d.elapsedTime * 0.9 + h) * 0.08,
          y = t.target[2] + u.z,
          x = h * 6;
        ((c[x] = j),
          (c[x + 1] = v),
          (c[x + 2] = y),
          (c[x + 3] = j + u.length),
          (c[x + 4] = v + 0.04),
          (c[x + 5] = y + 0.18));
      }
      l.needsUpdate = !0;
    }),
    e.jsx("lineSegments", {
      name: "ha3d-weather-wind", // ha3d-self: F3 标注已有粒子
      geometry: a,
      renderOrder: 2,
      children: e.jsx("lineBasicMaterial", {
        color: "#d9f7ff",
        transparent: !0,
        opacity: 0.2 + s * 0.2,
        depthWrite: !1,
        blending: Q,
        toneMapped: !1,
      }),
    })
  );
}
function ri({ enabled: t, frame: s }) {
  const o = M.useRef(null);
  return (
    te(({ clock: r }) => {
      if (!o.current) return;
      const n = Math.pow(
        Math.max(0, Math.sin(r.elapsedTime * 1.7) - 0.92) / 0.08,
        2,
      );
      o.current.intensity = t ? n * 5.4 : 0;
    }),
    e.jsx("pointLight", {
      ref: o,
      name: "ha3d-weather-lightning", // ha3d-self: F3 标注已有粒子
      position: [
        s.target[0] - s.distance * 0.28,
        s.target[1] + s.distance * 0.5,
        s.target[2] - s.distance * 0.22,
      ],
      color: "#eaf2ff",
      intensity: 0,
      distance: s.distance * 1.8,
    })
  );
}
function oi({ frame: t, intensity: s, quality: o, storm: r = !1 }) {
  const n = M.useRef(null),
    a = o === "eco" ? 10 : o === "smooth" ? 15 : o === "balanced" ? 20 : 28,
    i = Math.max(6.3, t.distance * 0.84),
    d = i * 1.86,
    l = M.useMemo(() => {
      const h = document.createElement("canvas");
      ((h.width = 128), (h.height = 128));
      const u = h.getContext("2d");
      if (!u) return null;
      const f = u.createRadialGradient(64, 64, 0, 64, 64, 64);
      (f.addColorStop(0, "rgba(255,255,255,0.54)"),
        f.addColorStop(0.46, "rgba(255,255,255,0.24)"),
        f.addColorStop(1, "rgba(255,255,255,0)"),
        (u.fillStyle = f),
        u.fillRect(0, 0, h.width, h.height));
      const j = new wr(h);
      return ((j.colorSpace = ds), (j.minFilter = _t), (j.magFilter = _t), j);
    }, []),
    c = M.useMemo(
      () =>
        Array.from({ length: a }, (h, u) => {
          const f = (u / a) * Math.PI * 2 + Z(u + 110) * 0.42,
            j = i * X.lerp(0.48, 0.76, Z(u + 210));
          return {
            x: Math.cos(f) * j,
            z: Math.sin(f) * j,
            y: X.lerp(0.12, 1.25, Z(u + 310)),
            scale:
              X.lerp(1.38, 2.72, Z(u + 410)) *
              Math.max(0.86, t.distance * 0.13),
            drift: X.lerp(0.14, 0.38, Z(u + 510)),
            phase: Z(u + 610) * Math.PI * 2,
            opacity: X.lerp(0.44, 0.74, Z(u + 710)),
            speed: X.lerp(0.36, 0.68, Z(u + 810)) * (r ? 1.6 : 1),
          };
        }),
      [a, t.distance, i],
    );
  return (
    M.useEffect(() => () => (l == null ? void 0 : l.dispose()), [l]),
    te(({ clock: h }) => {
      if (!n.current) return;
      const u = Math.cos(-0.58),
        f = Math.sin(-0.58),
        j = -f,
        v = u;
      n.current.children.forEach((y, x) => {
        const b = c[x],
          w = (((b.phase + h.elapsedTime * b.speed) % d) / d - 0.5) * d,
          S = Math.sin(h.elapsedTime * 0.42 + b.phase) * b.drift;
        ((y.position.x = t.target[0] + b.x + u * w + j * S),
          (y.position.y =
            t.target[1] +
            b.y +
            Math.sin(h.elapsedTime * 0.28 + b.phase) * 0.12),
          (y.position.z = t.target[2] + b.z + f * w + v * S));
        const G = y instanceof vr ? y.material : null;
        G instanceof Mr &&
          (G.opacity =
            (r ? 0.2 : 0.32) *
            s *
            b.opacity *
            (0.82 + Math.sin(h.elapsedTime * 0.24 + b.phase) * 0.18));
      });
    }),
    e.jsx("group", {
      ref: n,
      name: "ha3d-weather-fog", // ha3d-self: F3 标注已有粒子
      renderOrder: 0,
      children: c.map((h, u) =>
        e.jsx(
          "sprite",
          {
            position: [t.target[0] + h.x, t.target[1] + h.y, t.target[2] + h.z],
            scale: [h.scale * 1.9, h.scale, 1],
            children: e.jsx("spriteMaterial", {
              map: l ?? void 0,
              color: r ? "#d3dded" : "#eef6fb",
              transparent: !0,
              opacity: (r ? 0.2 : 0.32) * s * h.opacity,
              depthWrite: !1,
              depthTest: !0,
              blending: Ee,
              toneMapped: !1,
            }),
          },
          u,
        ),
      ),
    })
  );
}
function ni({
  frame: t,
  presentation: s,
  quality: o,
  weather: r,
  visualStyle: n,
}) {
  if (!s || !r || r.kind === "clear" || n === "cartoon") return null;
  const a = X.clamp(r.intensity, 0.25, 1),
    i = r.kind === "storm";
  return e.jsxs("group", {
    children: [
      (r.kind === "rain" || i) &&
        e.jsx(ei, { frame: t, intensity: a, storm: i, quality: o }),
      r.kind === "snow" && e.jsx(ti, { frame: t, intensity: a, quality: o }),
      (r.kind === "wind" || i) &&
        e.jsx(si, {
          frame: t,
          intensity: Math.max(a, r.windSpeed ? r.windSpeed / 38 : 0.45),
          quality: o,
        }),
      (r.kind === "fog" || i) &&
        e.jsx(oi, {
          frame: t,
          intensity: r.kind === "fog" ? Math.max(0.82, a) : a * 0.52,
          quality: o,
          storm: i,
        }),
      i && e.jsx(ri, { enabled: !0, frame: t }),
    ],
  });
}
// ===== ha3d-self: F3 时间与天气同步的环境层（太阳、月亮与星空、云层） =====
// 天空是 .home-scene 的 CSS 渐变（展示模式画布透明），固定在屏幕上，所以这一层也跟随相机：
// 放在相机前方远处（比户型远，被户型遮挡），只在渲染时更新位置，本身不触发重绘；
// 星星闪烁、云飘动靠 t0 的持续动画判断（夜晚有星空、天气不是 clear）驱动。
const ha3dEnvCounts = {
    eco: { stars: 60, clouds: 6 },
    smooth: { stars: 90, clouds: 9 },
    balanced: { stars: 140, clouds: 12 },
    high: { stars: 200, clouds: 16 },
  },
  ha3dEnvTextures = {};
// ha3d-self: 0.2.3 太阳、月亮、云的贴图改为直接生成像素（ImageData，256×256），和 0.2.2 的灯光晕同一个做法。
// 原来用 2D canvas 径向渐变：canvas 按预乘 alpha 存 8 位，上传 WebGL 时再反预乘，低 alpha 处每个通道的舍入误差
// 被放大成颜色偏差（太阳外圈是暖色、月亮光晕整圈 alpha ≤ 0.34，偏差更大），各平台 canvas 光栅化（抖动、色彩空间）也不同，
// 手机上就成了太阳、月亮周围的彩色小点。现在每个纹素的 RGB、alpha 按色标直接算出来，同一半径上颜色完全一致。
// 色标沿用原来的值（半径 0–1，[r, g, b, a]），段内线性插值；月牙按覆盖率做抗锯齿后叠到光晕上（原来 128 px 里半径 30、挖掉的圆心偏 (16, -10) 半径 27）。
const ha3dEnvStops = {
  sun: [
    [0, [255, 253, 240, 1]],
    [0.2, [255, 240, 190, 1]],
    [0.27, [255, 214, 130, 0.5]],
    [1, [255, 196, 110, 0]],
  ],
  moon: [
    [0, [214, 226, 255, 0.34]],
    [0.25, [214, 226, 255, 0.34]],
    [1, [214, 226, 255, 0]],
  ],
  cloud: [
    [0, [255, 255, 255, 0.85]],
    [0.45, [255, 255, 255, 0.4]],
    [1, [255, 255, 255, 0]],
  ],
};
function ha3dEnvStopColor(t, s) {
  if (s >= 1) return [t[t.length - 1][1][0], t[t.length - 1][1][1], t[t.length - 1][1][2], 0];
  for (let o = 1; o < t.length; o += 1)
    if (s <= t[o][0]) {
      const [r, n] = t[o - 1],
        [a, i] = t[o],
        d = (s - r) / (a - r);
      return n.map((l, c) => l + (i[c] - l) * d);
    }
  return t[t.length - 1][1];
}
function ha3dEnvTexture(t) {
  if (ha3dEnvTextures[t]) return ha3dEnvTextures[t];
  if (typeof ImageData > "u") return null;
  const s = 256,
    o = s / 128,
    r = new Uint8ClampedArray(s * s * 4),
    n = ha3dEnvStops[t] ?? ha3dEnvStops.cloud;
  for (let a = 0; a < s; a += 1)
    for (let i = 0; i < s; i += 1) {
      const d = i + 0.5,
        l = a + 0.5;
      let [c, h, u, f] = ha3dEnvStopColor(n, Math.hypot(d - s / 2, l - s / 2) / (s / 2));
      if (t === "moon") {
        // 月牙覆盖率 = 圆盘 × (1 − 挖掉的圆)，边缘 1 个纹素宽的线性过渡；颜色 #f4f1e3，source-over 叠在光晕上
        const j = X.clamp(30 * o - Math.hypot(d - 64 * o, l - 64 * o) + 0.5, 0, 1),
          v = X.clamp(27 * o - Math.hypot(d - 80 * o, l - 54 * o) + 0.5, 0, 1),
          y = j * (1 - v);
        if (y > 0) {
          const x = y + f * (1 - y);
          ((c = (244 * y + c * f * (1 - y)) / x), (h = (241 * y + h * f * (1 - y)) / x), (u = (227 * y + u * f * (1 - y)) / x), (f = x));
        }
      }
      const p = (a * s + i) * 4;
      ((r[p] = c), (r[p + 1] = h), (r[p + 2] = u), (r[p + 3] = Math.round(f * 255)));
    }
  const a = new wr(new ImageData(r, s, s));
  return ((a.colorSpace = ds), (ha3dEnvTextures[t] = a));
}
function ha3dSkySprite({ key: t, ...s }, o, r) {
  return e.jsx(
    "sprite",
    {
      ...s,
      raycast: ha3dNoRaycast,
      children: e.jsx("spriteMaterial", { map: ha3dEnvTexture(o) ?? void 0, transparent: !0, depthWrite: !1, fog: !1, toneMapped: !1, ...r }),
    },
    t,
  );
}
// 方位角 90°（东）→ 屏幕右上偏中，270°（西）→ 最右；高度越高越靠上。单位是半个屏幕高度。
const ha3dSkyX = (t) => 0.35 + X.clamp((((t % 360) + 360) % 360 - 90) / 180, 0, 1);
function ha3dEnvironmentLayer({ environment: t, frame: s, quality: o }) {
  const r = M.useRef(null),
    n = M.useRef(null),
    a = M.useRef(null),
    i = M.useRef(null),
    d = M.useRef(null),
    l = xt(),
    c = t.weatherKind,
    h = c === "clear" || c === "cloudy",
    u = t.phase === "day" && h,
    f = t.phase === "night" && h,
    j = c === "cloudy",
    v = ha3dEnvCounts[o] ?? ha3dEnvCounts.high,
    y = t.phase === "night",
    x = ha3dSkyX(y ? t.azimuth + 180 : t.azimuth),
    b = y
      ? 0.55 + 0.3 * X.clamp(Math.abs(t.elevation) / 60, 0, 1)
      : 0.5 + 0.35 * X.clamp(t.elevation / 60, 0, 1),
    w = M.useMemo(
      () =>
        f
          ? [0, 1, 2].map((g) => {
              const k = Math.floor(v.stars / 3) + (g < v.stars % 3 ? 1 : 0),
                p = new Float32Array(k * 3);
              for (let q = 0; q < k; q += 1) {
                const G = g * 1e3 + q;
                ((p[q * 3] = (Z(G + 11) - 0.5) * 4.4),
                  (p[q * 3 + 1] = X.lerp(-0.08, 1, Z(G + 71) ** 0.8)));
              }
              const L = new Ze();
              return (
                L.setAttribute("position", new zt(p, 3)),
                { geometry: L, phase: g * 2.1, speed: 0.8 + g * 0.45, size: [2.6, 2, 1.5][g] }
              );
            })
          : [],
      [f, v.stars],
    ),
    S = M.useMemo(
      () =>
        j
          ? Array.from({ length: v.clouds }, (g, k) => ({
              x: Z(k + 901) * 8,
              y: X.lerp(0.3, 0.95, Z(k + 951)),
              w: X.lerp(0.42, 0.8, Z(k + 991)),
              speed: X.lerp(0.012, 0.032, Z(k + 1031)),
              opacity: X.lerp(0.55, 0.9, Z(k + 1071)),
            }))
          : [],
      [j, v.clouds],
    );
  return (
    M.useEffect(() => () => w.forEach((g) => g.geometry.dispose()), [w]),
    te(({ camera: g, size: k, clock: p }) => {
      const q = r.current,
        G = n.current;
      if (!q || !G) return;
      const L = Math.tan(X.degToRad((g.fov ?? 32) / 2)),
        I = Math.min(140, Math.max(60, s.distance * 6)),
        $ = k.width / Math.max(1, k.height),
        m = Math.min(x, $ * 0.92 - 0.12),
        C = l ? 0 : p.elapsedTime;
      (q.position.copy(g.position),
        q.quaternion.copy(g.quaternion),
        q.scale.setScalar(I * L),
        G.position.set(0, 0, -1 / L),
        a.current && a.current.position.set(m, b, 0),
        i.current && i.current.position.set(m, b, 0),
        d.current &&
          d.current.children.forEach((O, _) => {
            const E = w[_];
            E &&
              (O.material.opacity = l
                ? 0.8
                : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(C * E.speed + E.phase)));
          }));
      const ha3dClouds = q.getObjectByName("ha3d-env-clouds");
      if (ha3dClouds) {
        const _ = 2 * ($ + 0.9);
        ha3dClouds.children.forEach((E, P) => {
          const N = S[P];
          N && (E.position.x = ((((N.x + C * N.speed) % _) + _) % _) - _ / 2);
        });
      }
    }),
    e.jsx("group", {
      ref: r,
      name: "ha3d-env-layer",
      children: e.jsxs("group", {
        ref: n,
        children: [
          u && ha3dSkySprite({ ref: a, name: "ha3d-env-sun", renderOrder: -2, position: [x, b, 0], scale: [0.6, 0.6, 1] }, "sun"),
          f && ha3dSkySprite({ ref: i, name: "ha3d-env-moon", renderOrder: -2, position: [x, b, 0], scale: [0.3, 0.3, 1] }, "moon"),
          f &&
            e.jsx("group", {
              ref: d,
              name: "ha3d-env-stars",
              children: w.map((g, k) =>
                e.jsx(
                  "points",
                  {
                    geometry: g.geometry,
                    raycast: ha3dNoRaycast,
                    renderOrder: -3,
                    frustumCulled: !1,
                    children: e.jsx("pointsMaterial", {
                      color: "#eef3ff",
                      size: g.size,
                      sizeAttenuation: !1,
                      transparent: !0,
                      opacity: 0.8,
                      depthWrite: !1,
                      fog: !1,
                      toneMapped: !1,
                    }),
                  },
                  k,
                ),
              ),
            }),
          j &&
            e.jsx("group", {
              name: "ha3d-env-clouds",
              children: S.map((g, k) =>
                ha3dSkySprite(
                  { key: k, renderOrder: -1, position: [g.x - 4, g.y, 0], scale: [g.w * 1.9, g.w * 0.8, 1] },
                  "cloud",
                  { color: y ? "#6c7488" : "#f5f8fc", opacity: g.opacity * (0.45 + 0.45 * t.intensity) },
                ),
              ),
            }),
        ],
      }),
    })
  );
}
// ===== ha3d-self: F3 主光源跟随太阳（夜晚取对面方位当月光）；颜色、强度按昼夜阶段和天气 =====
function ha3dEnvironmentLight(t) {
  if (!t) return null;
  const s = t.phase === "night",
    o = X.degToRad(s ? t.azimuth + 180 : t.azimuth),
    r = X.degToRad(Math.abs(t.elevation)),
    n = t.phase === "day" ? 1 : s ? 0.35 : 0.75,
    a =
      t.weatherKind === "cloudy"
        ? 0.8
        : t.weatherKind === "rain" || t.weatherKind === "storm"
          ? 0.7
          : 1;
  return {
    position: [
      14 * Math.cos(r) * Math.sin(o),
      Math.max(3, 14 * Math.sin(r)),
      -14 * Math.cos(r) * Math.cos(o),
    ],
    color: t.phase === "day" ? void 0 : s ? "#9fb4ff" : "#ffc48a",
    scale: n * a,
  };
}
// ===== ha3d-self: B6 持续动画限帧（eco 20 fps、smooth 30 fps，标签页隐藏时暂停） =====
// frameloop 为 demand，按帧率定时 invalidate；同时用优先级 1 的 useFrame 接管渲染，
// 设备自带的逐帧动画（空调出风、风扇等会每帧 invalidate）在这期间也不会超过上限，被跳过的帧补一次延迟渲染。
function ha3dFrameTicker({ fps: t }) {
  const s = be((n) => n.invalidate),
    o = M.useRef(0),
    r = M.useRef(0);
  return (
    M.useEffect(() => {
      let n = 0;
      const a = () => {
          n && (window.clearInterval(n), (n = 0));
        },
        i = () => {
          (a(), document.hidden || (n = window.setInterval(() => s(), 1e3 / t)));
        };
      return (
        i(),
        document.addEventListener("visibilitychange", i),
        () => {
          (a(),
            document.removeEventListener("visibilitychange", i),
            r.current && window.clearTimeout(r.current),
            (r.current = 0));
        }
      );
    }, [t, s]),
    te((n) => {
      const a = performance.now(),
        i = (1e3 / t) * 0.95,
        d = a - o.current;
      d >= i
        ? ((o.current = a), n.gl.render(n.scene, n.camera))
        : r.current ||
          (r.current = window.setTimeout(() => {
            ((r.current = 0), s());
          }, i - d));
    }, 1),
    null
  );
}
// ===== ha3d-self: B2 双击（双击触摸）后拖动改为平移 =====
// 第二次按下与上次按下间隔 ≤ 350 ms、距离 ≤ 30 px 时，本次拖动的左键/单指改为 PAN，抬起后恢复旋转。
// 平移结束时浏览器会补发 dblclick，拦下它，避免误触发房间聚焦。
// ha3d-self: 0.2.1 触屏手势交给页面自己处理（touchstart/touchmove 非 passive 并 preventDefault）：
// - 双指（≥2 个触点）：iOS/iPadOS 不再识别为原生手势（HA App 的「双指右滑 = 返回上一页」、页面缩放），双指平移/缩放只由 OrbitControls 处理；
// - 双击的第二次按下：iPadOS 不再进入「双击按住 → 文本放大镜/选择」，也不再补发原生 click/dblclick；
//   第二次按下没有拖动就松手时，由这里补发一次 dblclick，保留「双击退出房间聚焦 / 双击地板聚焦房间」。
// 单指单击不 preventDefault，click 仍由浏览器生成（设备 onClick、直接开关不受影响）。鼠标不会产生 touch 事件，行为不变。
function ha3dDoubleTapPan() {
  const t = be((r) => r.controls),
    s = be((r) => r.gl);
  return (
    M.useEffect(() => {
      if (!t || !s || !t.mouseButtons || !t.touches) return;
      // pointerdown 监听在 controls 自己的元素上（R3F 事件源），capture 阶段先于 OrbitControls 读 mouseButtons；
      // R3F 的 dblclick 也挂在这个元素上，所以拦截 dblclick 要用 stopImmediatePropagation
      const r = t.domElement ?? s.domElement.parentElement ?? s.domElement,
        n = t.mouseButtons.LEFT,
        a = t.touches.ONE;
      t.screenSpacePanning = !0;
      let i = -1 / 0,
        d = 0,
        l = 0,
        c = !1,
        h = 0,
        u = 0,
        f = !1,
        ha3dTouchHandled = !1, // 本次双击的第二次按下已在 touchstart 里 preventDefault（浏览器不会再补发 click/dblclick）
        ha3dSyntheticAt = -1 / 0,
        ha3dDispatching = !1;
      const j = (w) => {
          if (!c) return;
          const ha3dTap = ha3dTouchHandled && !f && w && w.type === "pointerup";
          ((c = !1), (ha3dTouchHandled = !1), (t.mouseButtons.LEFT = n), (t.touches.ONE = a));
          if (!ha3dTap) return;
          const ha3dX = w.clientX,
            ha3dY = w.clientY;
          // 等 R3F 先处理完这次 pointerup，再补发 dblclick（R3F 按 pointerdown 时命中的对象派发 onDoubleClick）
          window.setTimeout(() => {
            ((ha3dSyntheticAt = performance.now()), (ha3dDispatching = !0));
            try {
              r.dispatchEvent(
                new MouseEvent("dblclick", {
                  bubbles: !0,
                  cancelable: !0,
                  composed: !0,
                  view: window,
                  detail: 2,
                  button: 0,
                  clientX: ha3dX,
                  clientY: ha3dY,
                }),
              );
            } finally {
              ha3dDispatching = !1;
            }
          }, 0);
        },
        ha3dTouchStart = (w) => {
          w.cancelable &&
            (w.touches.length >= 2 || c) &&
            (w.preventDefault(), c && (ha3dTouchHandled = !0));
        },
        ha3dTouchMove = (w) => {
          w.cancelable && (w.touches.length >= 2 || c) && w.preventDefault();
        },
        v = (w) => {
          if (w.button !== 0 || !w.isPrimary) return;
          const S = w.timeStamp; // 用事件时间戳，主线程忙（低端设备渲染慢）时也按用户实际的按下间隔判断
          S - i <= 350 && Math.hypot(w.clientX - d, w.clientY - l) <= 30
            ? ((c = !0),
              (f = !1),
              (h = w.clientX),
              (u = w.clientY),
              (i = -1 / 0),
              (t.mouseButtons.LEFT = 2),
              (t.touches.ONE = 1))
            : ((f = !1), (i = S), (d = w.clientX), (l = w.clientY));
        },
        y = (w) => {
          c && !f && Math.hypot(w.clientX - h, w.clientY - u) > 6 && (f = !0);
        },
        x = (w) => {
          if (ha3dDispatching) return; // 自己补发的 dblclick
          // 已补发过一次时，浏览器如果仍然补发原生 dblclick，拦下，避免同一次双击处理两次
          if (performance.now() - ha3dSyntheticAt < 600) {
            ((ha3dSyntheticAt = -1 / 0), w.stopImmediatePropagation());
            return;
          }
          f && ((f = !1), w.stopImmediatePropagation());
        };
      // OrbitControls 把 pointermove/pointerup 挂在 document 上，松手位置可能在画布外，这里同样挂在 window 上
      return (
        r.addEventListener("pointerdown", v, !0),
        window.addEventListener("pointermove", y, !0),
        window.addEventListener("pointerup", j, !0),
        window.addEventListener("pointercancel", j, !0),
        r.addEventListener("dblclick", x, !0),
        r.addEventListener("touchstart", ha3dTouchStart, { passive: !1 }),
        r.addEventListener("touchmove", ha3dTouchMove, { passive: !1 }),
        () => {
          (r.removeEventListener("touchstart", ha3dTouchStart, { passive: !1 }),
            r.removeEventListener("touchmove", ha3dTouchMove, { passive: !1 }),
            r.removeEventListener("pointerdown", v, !0),
            window.removeEventListener("pointermove", y, !0),
            window.removeEventListener("pointerup", j, !0),
            window.removeEventListener("pointercancel", j, !0),
            r.removeEventListener("dblclick", x, !0),
            j());
        }
      );
    }, [t, s]),
    null
  );
}
const t0 = M.memo(function ({
    project: s,
    entities: o,
    floorId: r,
    showAllFloors: n = !1,
    cameraPreset: a = "iso",
    wallMode: i = "full",
    showDevices: d = !0,
    showLabels: l = !0,
    showGrid: c = !1,
    theme: h = "day",
    presentation: u = !1,
    wallThicknessScale: f = 1,
    focusedRoom: j,
    showRoomBadges: v = !1,
    presentationMode: y = "overview",
    visualStyle: x = "glass",
    onRoomFocus: b,
    onRoomLightingAction: w,
    onRoomShadeAction: S,
    onRoomSecuritySelect: G,
    onEntitySelect: L,
    onDeviceSelect: I,
    viewportInsets: $ = { top: 0, right: 0, bottom: 0, left: 0 },
    quality: p = "high",
    autoRotate: m = !1,
    cameraResetKey: C,
    controlPanelOpen: O = !1,
    focusEntityId: g,
    weather: _,
    environment: ha3dEnv, // ha3d-self: F3 { phase, elevation, azimuth, weatherKind, intensity, windSpeed }
    pet: ha3dPetKind = "none", // ha3d-self: F6 none / cat / dog
  }) {
    const k = M.useMemo(
        () =>
          Xa({
            project: s,
            floorId: r,
            showAllFloors: n,
            presentation: u,
            focusedRoom: j,
          }),
        [r, j, u, s, n],
      ),
      E = h === "night",
      P = x === "cartoon" && u,
      N = x === "cream" && u,
      R = M.useMemo(() => Nt(h, y, x), [y, h, x]),
      F = u ? R.background : E ? "#070a14" : "#e9eef0",
      z =
        !P &&
        !N &&
        u &&
        (y === "shade" ||
          y === "security" ||
          (E && y !== "environment" && y !== "overview")),
      U = P
        ? 1.26
        : N
          ? 0.94
          : y === "lighting"
            ? 1.18
            : y === "security"
              ? 0.88
              : 1,
      V = P || N ? 1 : y === "shade" || y === "environment" ? 1.14 : 1,
      D = y === "lighting" ? 1.42 : 1,
      K = Ya[p],
      q = K.extraLights === "full",
      se = K.extraLights !== "minimal",
      ve = k.distance * (P ? 5.6 : N ? 7.4 : u ? 3.9 : 2.5),
      ue = k.distance * (P ? 11.2 : N ? 14.8 : u ? 8.4 : 5.8),
      // ha3d-self: F3/F6/B6 持续动画：天气不是 clear（含多云）、夜晚有星空、宠物在走、自动旋转；
      // eco/smooth 下改为 demand + ha3dFrameTicker 限帧，balanced/high 仍是 always
      ha3dReduced = xt(),
      ha3dEnvOn = !!(u && !P && ha3dEnv),
      ha3dStars =
        ha3dEnvOn &&
        ha3dEnv.phase === "night" &&
        (ha3dEnv.weatherKind === "clear" || ha3dEnv.weatherKind === "cloudy"),
      fe =
        !!(u && !P && _ && _.kind !== "clear") ||
        (ha3dStars && !ha3dReduced) ||
        (u && ha3dPetKind !== "none" && !ha3dReduced),
      ha3dLimitFps = m || fe ? (p === "eco" ? 20 : p === "smooth" ? 30 : 0) : 0,
      Me = (m || fe) && !ha3dLimitFps ? "always" : "demand",
      ha3dLight = ha3dEnvOn ? ha3dEnvironmentLight(ha3dEnv) : null,
      ha3dLightScale = ha3dLight ? ha3dLight.scale : 1;
    return e.jsxs(
      xr,
      {
        camera: { position: [8.4, 9.6, 10.2], fov: 36, near: 0.1, far: 150 },
        shadows: K.shadows,
        frameloop: Me,
        dpr: K.dpr,
        gl: {
          alpha: u,
          antialias: K.antialias,
          toneMapping: jr,
          toneMappingExposure: P
            ? 1.08
            : N
              ? 0.9
              : z
                ? y === "security"
                  ? 0.9
                  : 1.02
                : u
                  ? 1
                  : 1.05,
          powerPreference: "high-performance",
        },
        onCreated: (ha3dState) => {
          const xe = ha3dState.gl; // ha3d-self: 接收完整 state，供调试桥使用
          ((xe.shadowMap.enabled = K.shadows),
            (xe.shadowMap.type = br),
            (xe.outputColorSpace = ds));
          // ha3d-self: 调试桥，仅 URL 带 ?ha3dDebug 时暴露 R3F 状态给 e2e
          if (new URLSearchParams(location.search).has("ha3dDebug"))
            window.__ha3dDebug = { get: ha3dState.get };
        },
        // ha3d-self: B6 Canvas 内容外包一层画质 context，eco 下 ee（Edges）不渲染
        children: e.jsxs(ha3dQualityContext.Provider, {
          value: p,
          children: [
          e.jsx(Tn, {}),
          ha3dLimitFps > 0 && e.jsx(ha3dFrameTicker, { fps: ha3dLimitFps }), // ha3d-self: B6
          !u && e.jsx("color", { attach: "background", args: [F] }),
          e.jsx("fog", { attach: "fog", args: [u ? R.fog : F, ve, ue] }),
          e.jsx("ambientLight", {
            intensity:
              (P ? 0.72 : N ? 0.4 : z ? 0.56 : u ? 0.58 : 0.76) *
              V *
              ha3dLightScale, // ha3d-self: F3
            color: P ? "#fff2df" : N ? "#eadfce" : z ? "#a8b5dc" : "#edf4ff",
          }),
          e.jsx("hemisphereLight", {
            args: [
              P ? "#fff4df" : N ? "#f4eadb" : z ? "#c3ceee" : "#f5f8ff",
              P ? "#7fa5c4" : N ? "#7f715f" : z ? "#050817" : "#647b9a",
              (P ? 1.08 : N ? 0.62 : z ? 0.78 : u ? 0.82 : 1.2) *
                V *
                ha3dLightScale, // ha3d-self: F3
            ],
          }),
          e.jsx("directionalLight", {
            position: ha3dLight ? ha3dLight.position : [8, 14, 9], // ha3d-self: F3
            color:
              (ha3dLight && ha3dLight.color) ||
              (P ? "#fff0cc" : N ? "#f5e3c8" : z ? "#e4eaff" : "#ffffff"),
            intensity:
              (P ? 1.44 : N ? 1.12 : z ? 0.96 : u ? 0.88 : 1.8) *
              U *
              ha3dLightScale, // ha3d-self: F3
            castShadow: K.shadows,
            "shadow-mapSize": K.shadowMapSize,
            "shadow-bias": -16e-5,
            "shadow-normalBias": 0.045,
            children: e.jsx("orthographicCamera", {
              attach: "shadow-camera",
              args: [-16, 16, 16, -16],
            }),
          }),
          u &&
            q &&
            !P &&
            e.jsx("directionalLight", {
              position: [-7, 7, -8],
              color: R.glow,
              intensity: (z ? 0.26 : 0.18) * V,
            }),
          u &&
            q &&
            !P &&
            e.jsx("pointLight", {
              position: [-8, 5.8, 5],
              color: R.glow,
              intensity: (z ? 1.35 : N ? 0.42 : 0.72) * V,
              distance: 22,
            }),
          u &&
            q &&
            !P &&
            e.jsx("pointLight", {
              position: [6, 4.4, -4],
              color:
                y === "lighting"
                  ? "#ffd08a"
                  : z
                    ? "#d6c5b6"
                    : N
                      ? "#e8c99f"
                      : "#fff4dd",
              intensity: (z ? 1.38 : N ? 0.48 : 0.78) * D,
              distance: 14,
            }),
          y === "lighting" &&
            se &&
            e.jsx("pointLight", {
              position: [0, 2.8, 0],
              color: "#ffd08a",
              intensity: 2.4,
              distance: 14,
            }),
          y === "security" &&
            se &&
            e.jsx("pointLight", {
              position: [-5.5, 2.6, -4.5],
              color: "#ff708a",
              intensity: 1.4,
              distance: 12,
            }),
          z &&
            q &&
            e.jsx("pointLight", {
              position: [4, 3.2, -2],
              color: R.glow,
              intensity: y === "security" ? 1.7 : 2.15,
              distance: 10,
            }),
          e.jsx(ni, {
            frame: k,
            presentation: u,
            quality: p,
            weather: _,
            visualStyle: x,
          }),
          ha3dEnvOn &&
            e.jsx(ha3dEnvironmentLayer, {
              environment: ha3dEnv,
              frame: k,
              quality: p,
            }), // ha3d-self: F3
          e.jsx(qa, {
            project: s,
            entities: o,
            floorId: r,
            showAllFloors: n,
            wallMode: i,
            showDevices: d,
            showLabels: l,
            showGrid: c,
            theme: h,
            presentation: u,
            wallThicknessScale: f,
            focusedRoom: j,
            showRoomBadges: v,
            presentationMode: y,
            visualStyle: x,
            onRoomFocus: b,
            onRoomLightingAction: w,
            onRoomShadeAction: S,
            onRoomSecuritySelect: G,
            onEntitySelect: L,
            onDeviceSelect: I,
            autoRotate: m && !O,
            pet: u ? ha3dPetKind : "none", // ha3d-self: F6
          }),
          e.jsx(Qa, {
            preset: a,
            frame: k,
            presentation: u,
            showAllFloors: n,
            viewportInsets: $,
            resetKey: C,
            controlPanelOpen: O,
            focusEntityId: g,
          }),
          e.jsx(yr, {
            makeDefault: !0,
            enableDamping: !0,
            dampingFactor: 0.085,
            minDistance: 3,
            maxDistance: Math.max(26, k.distance * 3),
            maxPolarAngle: Math.PI / 2.05,
          }),
          e.jsx(ha3dDoubleTapPan, {}), // ha3d-self: B2
          ],
        }),
      },
      p,
    );
  }),
  ai = {
    battery: "电量",
    battery_level: "电量",
    brightness: "亮度",
    color_mode: "颜色模式",
    color_temp_kelvin: "色温",
    current_position: "当前位置",
    current_temperature: "当前温度",
    device_class: "设备类型",
    "environment.temperature": "环境温度",
    fan_mode: "风速模式",
    hvac_action: "运行状态",
    humidity: "湿度",
    illuminance: "照度",
    max_color_temp_kelvin: "最高色温",
    min_color_temp_kelvin: "最低色温",
    percentage: "风速",
    signal_strength: "信号",
    supported_color_modes: "灯光能力",
    temperature: "目标温度",
  },
  ii = new Set([
    "entity_picture",
    "friendly_name",
    "icon",
    "supported_features",
    "unit_of_measurement",
  ]),
  tr = new Set([
    "sensor",
    "binary_sensor",
    "camera",
    "update",
    "button",
    "event",
    "tag",
    "person",
    "device_tracker",
    "automation",
    "script",
    "notify",
    "tts",
  ]),
  ci = new Set(["switch", "media_player", "input_boolean"]),
  li = new Set([
    "brightness",
    "color_temp",
    "hs",
    "rgb",
    "rgbw",
    "rgbww",
    "xy",
    "white",
  ]),
  di = new Set(["hs", "rgb", "rgbw", "rgbww", "xy"]),
  hi = new Set(["unavailable", "unknown"]),
  we = (t, s, o) => Math.min(o, Math.max(s, t)),
  Se = (t, s) => Object.prototype.hasOwnProperty.call(t.attributes, s),
  Vt = (t, s) => {
    const o = t == null ? void 0 : t.attributes[s];
    return typeof o == "number" && Number.isFinite(o) ? o : void 0;
  },
  de = (t, s, o) => Vt(t, s) ?? o,
  sr = (t, s) => {
    const o = t.attributes[s];
    return Array.isArray(o) ? o.filter((r) => typeof r == "string") : [];
  },
  ct = (t, s) => {
    const o = t.attributes[s];
    return Array.isArray(o)
      ? o.filter((r) => typeof r == "number" && Number.isFinite(r))
      : [];
  },
  Ce = (t) => `${Math.round(t)}%`,
  rt = (t) => `${Math.round(t)}K`,
  ui = (t) =>
    Math.round(we(t, 0, 255))
      .toString(16)
      .padStart(2, "0"),
  rr = (t) => `#${t.slice(0, 3).map(ui).join("")}`,
  vt = (t, s) => `${t}${t.includes("?") ? "&" : "?"}ts=${s}`,
  or = () => {
    if (typeof document > "u") return !1;
    const t = document.createElement("video");
    return !!(
      t.canPlayType("application/vnd.apple.mpegurl") ||
      t.canPlayType("application/x-mpegURL")
    );
  },
  fi = () => typeof window < "u" && typeof window.MediaSource < "u",
  pi = () => or() || fi();
function qe(t) {
  return (
    {
      auto: "自动",
      cool: "制冷",
      dry: "除湿",
      fan_only: "送风",
      heat: "制热",
      off: "关闭",
      on: "开启",
    }[t] ?? t
  );
}
function gi(t, s, o) {
  if (o != null) {
    if (s === "brightness" && typeof o == "number") return Ce((o / 255) * 100);
    if (
      s === "color_temp_kelvin" ||
      s === "min_color_temp_kelvin" ||
      s === "max_color_temp_kelvin"
    )
      return `${o}K`;
    if (
      s === "current_position" ||
      s === "percentage" ||
      s === "battery" ||
      s === "battery_level"
    )
      return `${o}%`;
    if (
      s === "current_temperature" ||
      s === "temperature" ||
      s === "environment.temperature"
    )
      return `${o}°C`;
    if (s === "humidity") return `${o}%`;
    if (Array.isArray(o)) {
      const r = o
        .filter((n) => typeof n == "string" || typeof n == "number")
        .map((n) => (typeof n == "string" ? qe(n) : String(n)));
      return r.length ? r.join(" / ") : void 0;
    }
    if (typeof o == "number") {
      const r =
        typeof t.attributes.unit_of_measurement == "string"
          ? t.attributes.unit_of_measurement
          : "";
      return `${Number.isInteger(o) ? o : o.toFixed(1)}${r}`;
    }
    if (typeof o == "boolean") return o ? "是" : "否";
    if (typeof o == "string") return qe(o);
  }
}
function mi(t) {
  return [
    ...[
      "current_temperature",
      "temperature",
      "hvac_action",
      "fan_mode",
      "brightness",
      "color_temp_kelvin",
      "current_position",
      "percentage",
      "battery",
      "battery_level",
      "humidity",
      "illuminance",
      "signal_strength",
      "device_class",
      "supported_color_modes",
    ],
    ...Object.keys(t.attributes),
  ]
    .filter((r, n, a) => a.indexOf(r) === n)
    .filter((r) => !ii.has(r))
    .map((r) => {
      const n = t.attributes[r],
        a = gi(t, r, n);
      if (a)
        return { key: r, label: ai[r] ?? r.replace(/[_.-]/g, " "), value: a };
    })
    .filter((r) => !!r)
    .slice(0, 6);
}
function xi(t) {
  const s = sr(t, "supported_color_modes"),
    o = new Set(s),
    r = (u) => s.some((f) => u.has(f)),
    n = de(t, "min_color_temp_kelvin", 2700),
    a = Math.max(n + 100, de(t, "max_color_temp_kelvin", 6500)),
    i = de(t, "brightness", t.state === "on" ? 180 : 0),
    d = we(de(t, "color_temp_kelvin", Math.round((n + a) / 2)), n, a),
    l =
      r(li) ||
      (o.size === 0 && Se(t, "brightness")) ||
      Vt(t, "brightness") !== void 0,
    c =
      o.has("color_temp") ||
      Se(t, "color_temp_kelvin") ||
      Se(t, "min_color_temp_kelvin") ||
      Se(t, "max_color_temp_kelvin"),
    h =
      r(di) || ct(t, "rgb_color").length >= 3 || ct(t, "hs_color").length >= 2;
  return {
    brightness: i,
    brightnessPercent: Math.round((i / 255) * 100),
    colorTempKelvin: d,
    hasBrightness: l,
    hasColor: h,
    hasColorTemperature: c,
    maxKelvin: a,
    minKelvin: n,
    modes: s,
  };
}
function ji(t, s) {
  const o = (((t % 360) + 360) % 360) / 60,
    n = we(s, 0, 100) / 100,
    a = n * (1 - Math.abs((o % 2) - 1)),
    i = 1 - n,
    [d, l, c] =
      o < 1
        ? [n, a, 0]
        : o < 2
          ? [a, n, 0]
          : o < 3
            ? [0, n, a]
            : o < 4
              ? [0, a, n]
              : o < 5
                ? [a, 0, n]
                : [n, 0, a];
  return rr([(d + i) * 255, (l + i) * 255, (c + i) * 255]);
}
function yi(t) {
  for (const o of ["rgb_color", "rgbw_color", "rgbww_color"]) {
    const r = ct(t, o);
    if (r.length >= 3) return rr(r);
  }
  const s = ct(t, "hs_color");
  return s.length >= 2 ? ji(s[0], s[1]) : "#ffcc8a";
}
function bi(t) {
  const s = t.replace("#", "").trim();
  return /^[0-9a-fA-F]{6}$/.test(s)
    ? [
        Number.parseInt(s.slice(0, 2), 16),
        Number.parseInt(s.slice(2, 4), 16),
        Number.parseInt(s.slice(4, 6), 16),
      ]
    : [255, 204, 138];
}
function ne({ title: t, hint: s, children: o }) {
  return e.jsxs("div", {
    className: "control-section",
    style: { background: "rgba(0,0,0,0)", boxShadow: "none" },
    children: [
      e.jsxs("div", {
        className: "control-section-heading",
        children: [
          e.jsx("strong", { children: t }),
          s && e.jsx("span", { children: s }),
        ],
      }),
      o,
    ],
  });
}
function jt({ items: t }) {
  return e.jsx("div", {
    className: "capability-strip",
    "aria-label": "设备能力",
    children: t.map((s) =>
      e.jsx(
        "span",
        { className: s.active ? "active" : "", children: s.label },
        s.label,
      ),
    ),
  });
}
function Xe({
  ariaLabel: t,
  disabled: s = !1,
  formatValue: o,
  icon: r,
  label: n,
  max: a,
  min: i,
  onCommit: d,
  step: l = 1,
  value: c,
}) {
  const [h, u] = M.useState(c),
    [f, j] = M.useState(!1),
    v = M.useRef(c),
    y = M.useRef(!1),
    x = M.useRef(c),
    b = M.useRef(d),
    w = M.useRef(void 0),
    S = 180;
  (M.useEffect(() => {
    b.current = d;
  }, [d]),
    M.useEffect(() => {
      const g = we(c, i, a);
      y.current || ((v.current = g), (x.current = g), u(g));
    }, [a, i, c]),
    M.useEffect(
      () => () => {
        w.current && window.clearTimeout(w.current);
      },
      [],
    ));
  function G(g) {
    return we(Number.isFinite(g) ? g : c, i, a);
  }
  function L() {
    w.current && (window.clearTimeout(w.current), (w.current = void 0));
  }
  function I(g) {
    const _ = G(g);
    (x.current !== void 0 && Math.abs(x.current - _) < 1e-4) ||
      ((x.current = _), b.current(_));
  }
  function $(g) {
    (L(),
      (w.current = window.setTimeout(() => {
        ((w.current = void 0), I(g));
      }, S)));
  }
  function p() {
    s || ((y.current = !0), j(!0));
  }
  function m() {
    (!y.current && !w.current) || (L(), I(v.current), (y.current = !1), j(!1));
  }
  function C(g) {
    const _ = G(g);
    ((v.current = _), u(_), $(_));
  }
  const O = o(h);
  return e.jsxs("label", {
    className: `slider-row slider-row-compact smooth-slider-row ${f ? "is-editing" : ""}`,
    children: [
      e.jsxs("span", {
        children: [r, n, " ", e.jsx("strong", { children: O })],
      }),
      e.jsx("input", {
        "aria-label": t,
        "aria-valuetext": O,
        disabled: s,
        type: "range",
        min: i,
        max: a,
        step: l,
        value: h,
        onBlur: m,
        onChange: (g) => C(Number(g.currentTarget.value)),
        onKeyDown: p,
        onKeyUp: m,
        onPointerCancel: m,
        onPointerDown: p,
        onPointerUp: m,
      }),
    ],
  });
}
function Je({
  active: t,
  busy: s,
  entity: o,
  labels: r = { on: "开启", off: "关闭", toggle: "切换" },
  run: n,
}) {
  return e.jsxs("div", {
    className: "action-grid",
    children: [
      e.jsxs("button", {
        type: "button",
        className: t ? "active" : "",
        disabled: s,
        onClick: () => n({ type: "turn_on", entityId: o.entityId }),
        children: [e.jsx(mo, { size: 16 }), r.on],
      }),
      e.jsxs("button", {
        type: "button",
        className: t ? "" : "active",
        disabled: s,
        onClick: () => n({ type: "turn_off", entityId: o.entityId }),
        children: [e.jsx(po, { size: 16 }), r.off],
      }),
      e.jsxs("button", {
        type: "button",
        disabled: s,
        onClick: () => n({ type: "toggle", entityId: o.entityId }),
        children: [e.jsx(Mt, { size: 15 }), r.toggle],
      }),
    ],
  });
}
function wi({ active: t, busy: s, compact: o = !1, entity: r, run: n }) {
  const a = xi(r),
    i = yi(r),
    d = [
      { label: "暖白", value: a.minKelvin },
      { label: "自然", value: Math.round((a.minKelvin + a.maxKelvin) / 2) },
      { label: "清爽", value: a.maxKelvin },
    ],
    l = [
      { label: "暖橙", value: "#ff9f43" },
      { label: "玫红", value: "#ff5c8a" },
      { label: "紫光", value: "#8b5cf6" },
      { label: "海蓝", value: "#35b9ff" },
      { label: "青绿", value: "#2dd4bf" },
      { label: "日光", value: "#fff1c2" },
    ],
    c = (h) =>
      n({ type: "set_rgb_color", entityId: r.entityId, rgbColor: bi(h) });
  return e.jsxs("div", {
    className: "typed-control-stack typed-control-light",
    children: [
      !o &&
        e.jsx(jt, {
          items: [
            { label: "开关", active: !0 },
            { label: "亮度", active: a.hasBrightness },
            { label: "色温", active: a.hasColorTemperature },
            { label: "彩色", active: a.hasColor },
          ],
        }),
      e.jsx(ne, {
        title: o ? "开关" : "灯光控制",
        hint: o
          ? void 0
          : a.modes.length
            ? a.modes.map(qe).join(" / ")
            : "基础灯光",
        children: e.jsx(Je, { active: t, busy: s, entity: r, run: n }),
      }),
      a.hasBrightness &&
        e.jsx(ne, {
          title: "亮度",
          hint: Ce(a.brightnessPercent),
          children: e.jsx(Xe, {
            ariaLabel: "设置灯光亮度",
            disabled: s,
            icon: e.jsx(gs, { size: 14 }),
            label: "亮度强度",
            min: 0,
            max: 255,
            value: a.brightness,
            formatValue: (h) => Ce((h / 255) * 100),
            onCommit: (h) =>
              n(
                { type: "set_brightness", entityId: r.entityId, brightness: h },
                { blocking: !1 },
              ),
          }),
        }),
      a.hasColorTemperature &&
        e.jsxs(ne, {
          title: "色温",
          hint: `${rt(a.minKelvin)} - ${rt(a.maxKelvin)}`,
          children: [
            e.jsx(Xe, {
              ariaLabel: "设置灯光色温",
              disabled: s,
              icon: e.jsx(Et, { size: 14 }),
              label: "冷暖色温",
              min: a.minKelvin,
              max: a.maxKelvin,
              step: 50,
              value: a.colorTempKelvin,
              formatValue: rt,
              onCommit: (h) =>
                n(
                  {
                    type: "set_color_temperature",
                    entityId: r.entityId,
                    colorTempKelvin: h,
                  },
                  { blocking: !1 },
                ),
            }),
            e.jsx("div", {
              className: "preset-grid light-temperature-presets",
              children: d.map((h) =>
                e.jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: s,
                    onClick: () =>
                      n({
                        type: "set_color_temperature",
                        entityId: r.entityId,
                        colorTempKelvin: h.value,
                      }),
                    children: [
                      h.label,
                      e.jsx("small", { children: rt(h.value) }),
                    ],
                  },
                  h.label,
                ),
              ),
            }),
          ],
        }),
      a.hasColor &&
        e.jsxs(ne, {
          title: "颜色",
          hint: i.toUpperCase(),
          children: [
            e.jsxs("div", {
              className: "light-color-picker-row",
              children: [
                e.jsxs("span", {
                  children: [
                    e.jsx(Qr, { size: 14 }),
                    "彩色灯光 ",
                    e.jsx("strong", { children: i.toUpperCase() }),
                  ],
                }),
                e.jsxs("div", {
                  className: "light-color-picker-control",
                  children: [
                    e.jsx("i", { style: { background: i } }),
                    e.jsx("input", {
                      "aria-label": "设置灯光颜色",
                      disabled: s,
                      type: "color",
                      value: i,
                      onChange: (h) => c(h.target.value),
                    }),
                  ],
                }),
              ],
            }),
            e.jsx("div", {
              className: "preset-grid light-color-presets",
              children: l.map((h) =>
                e.jsxs(
                  "button",
                  {
                    type: "button",
                    disabled: s,
                    onClick: () => c(h.value),
                    "aria-label": `设置灯光颜色为${h.label}`,
                    children: [
                      e.jsx("span", { style: { background: h.value } }),
                      e.jsx("small", { children: h.label }),
                    ],
                  },
                  h.label,
                ),
              ),
            }),
          ],
        }),
      !o &&
        !a.hasBrightness &&
        !a.hasColorTemperature &&
        !a.hasColor &&
        e.jsx("p", {
          className: "control-hint",
          children:
            "这个灯在 HA 数据中只暴露开关能力，因此隐藏亮度、色温和颜色控件。",
        }),
    ],
  });
}
function vi({ active: t, busy: s, compact: o = !1, entity: r, run: n }) {
  const a = we(de(r, "current_position", r.state === "open" ? 100 : 0), 0, 100),
    i = Se(r, "current_position") || (de(r, "supported_features", 0) & 4) === 4;
  return e.jsxs("div", {
    className: "typed-control-stack typed-control-cover",
    children: [
      !o &&
        e.jsx(jt, {
          items: [
            { label: "打开/关闭", active: !0 },
            { label: "位置", active: i },
          ],
        }),
      e.jsx(ne, {
        title: o ? "开关" : "遮阳控制",
        hint: o ? void 0 : t ? "已打开" : "已关闭",
        children: e.jsx(Je, {
          active: t,
          busy: s,
          entity: r,
          labels: { on: "打开", off: "关闭", toggle: "切换" },
          run: n,
        }),
      }),
      i &&
        e.jsx(ne, {
          title: "开合位置",
          hint: Ce(a),
          children: e.jsx(Xe, {
            ariaLabel: "设置窗帘位置",
            disabled: s,
            icon: e.jsx(gs, { size: 14 }),
            label: "窗帘位置",
            min: 0,
            max: 100,
            value: a,
            formatValue: Ce,
            onCommit: (d) =>
              n(
                {
                  type: "set_cover_position",
                  entityId: r.entityId,
                  position: d,
                },
                { blocking: !1 },
              ),
          }),
        }),
    ],
  });
}
function Mi({ active: t, busy: s, compact: o = !1, entity: r, run: n }) {
  const a = de(r, "min_temp", 16),
    i = Math.max(a + 1, de(r, "max_temp", 32)),
    d = de(r, "target_temp_step", 0.5),
    l = we(de(r, "temperature", 26), a, i),
    c = Vt(r, "current_temperature"),
    h = sr(r, "hvac_modes"),
    u = h.length ? h : ["off", "auto", "cool", "heat", "dry", "fan_only"];
  return e.jsxs("div", {
    className: "typed-control-stack typed-control-climate",
    children: [
      e.jsxs("div", {
        className: "climate-readout-row",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx(We, { size: 16 }),
              e.jsx("small", { children: "当前" }),
              e.jsx("strong", { children: c !== void 0 ? `${c}°C` : "—" }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx(Et, { size: 16 }),
              e.jsx("small", { children: "目标" }),
              e.jsxs("strong", { children: [l, "°C"] }),
            ],
          }),
          e.jsxs("div", {
            children: [
              e.jsx(lt, { size: 16 }),
              e.jsx("small", { children: "状态" }),
              e.jsx("strong", {
                children: qe(String(r.attributes.hvac_action ?? r.state)),
              }),
            ],
          }),
        ],
      }),
      e.jsx(ne, {
        title: o ? "开关" : "空调控制",
        hint: o ? void 0 : t ? "运行中" : "待机",
        children: e.jsx(Je, {
          active: t,
          busy: s,
          entity: r,
          labels: { on: "启动", off: "关闭", toggle: "切换" },
          run: n,
        }),
      }),
      e.jsx(ne, {
        title: "目标温度",
        hint: `${a}°C - ${i}°C`,
        children: e.jsx(Xe, {
          ariaLabel: "设置目标温度",
          disabled: s,
          icon: e.jsx(We, { size: 14 }),
          label: "设定温度",
          min: a,
          max: i,
          step: d,
          value: l,
          formatValue: (f) => `${f}°C`,
          onCommit: (f) =>
            n(
              { type: "set_temperature", entityId: r.entityId, temperature: f },
              { blocking: !1 },
            ),
        }),
      }),
      e.jsx(ne, {
        title: "运行模式",
        children: e.jsx("div", {
          className: "preset-grid climate-mode-grid",
          role: "group",
          "aria-label": "设置空调模式",
          children: u.map((f) => {
            const j = r.state === f;
            return e.jsx(
              "button",
              {
                type: "button",
                className: j ? "active" : "",
                disabled: s || j,
                onClick: () =>
                  n({ type: "set_hvac_mode", entityId: r.entityId, mode: f }),
                "aria-pressed": j,
                children: qe(f),
              },
              f,
            );
          }),
        }),
      }),
    ],
  });
}
function _i({ active: t, busy: s, compact: o = !1, entity: r, run: n }) {
  const a = we(de(r, "percentage", t ? 100 : 0), 0, 100),
    i = Se(r, "percentage") || Se(r, "percentage_step");
  return e.jsxs("div", {
    className: "typed-control-stack typed-control-fan",
    children: [
      !o &&
        e.jsx(jt, {
          items: [
            { label: "开关", active: !0 },
            { label: "风速", active: i },
          ],
        }),
      e.jsx(ne, {
        title: o ? "开关" : "风扇控制",
        hint: o ? void 0 : t ? "运行中" : "待机",
        children: e.jsx(Je, { active: t, busy: s, entity: r, run: n }),
      }),
      i &&
        e.jsx(ne, {
          title: "风速",
          hint: Ce(a),
          children: e.jsx(Xe, {
            ariaLabel: "设置风扇风速",
            disabled: s,
            icon: e.jsx(lt, { size: 14 }),
            label: "风速比例",
            min: 0,
            max: 100,
            value: a,
            formatValue: Ce,
            onCommit: (d) =>
              n(
                {
                  type: "set_fan_percentage",
                  entityId: r.entityId,
                  percentage: d,
                },
                { blocking: !1 },
              ),
          }),
        }),
    ],
  });
}
function nr({ entity: t }) {
  const s =
    typeof t.attributes.device_class == "string"
      ? t.attributes.device_class
      : Ue(t.domain);
  return e.jsxs("div", {
    className: "readonly-signal-card",
    children: [
      e.jsx("span", {
        className: `domain-icon domain-${t.domain}`,
        children: e.jsx(Cs, { domain: t.domain, size: 20 }),
      }),
      e.jsxs("div", {
        children: [
          e.jsx("small", { children: s }),
          e.jsx("strong", { children: Ke(t) }),
        ],
      }),
      t.domain === "sensor" && e.jsx(We, { size: 17 }),
      t.domain === "binary_sensor" && e.jsx(hs, { size: 17 }),
    ],
  });
}
function ar({ compact: t = !1, entity: s }) {
  return e.jsxs("div", {
    className: "typed-control-stack typed-control-readonly",
    children: [
      e.jsx(nr, { entity: s }),
      !t &&
        e.jsx("p", {
          className: "control-hint",
          children: "此类实体作为状态来源展示，不显示会产生副作用的控制按钮。",
        }),
    ],
  });
}
function ki({ label: t, onError: s, src: o }) {
  const r = M.useRef(null);
  return (
    M.useEffect(() => {
      const n = r.current;
      if (!n) return;
      let a = !1,
        i;
      return or()
        ? ((n.src = o),
          n.play().catch(() => {}),
          () => {
            ((a = !0), n.removeAttribute("src"), n.load());
          })
        : (_r(
            async () => {
              const { default: d } = await import("./hls.js");
              return { default: d };
            },
            [],
            import.meta.url,
          )
            .then(({ default: d }) => {
              if (a) return;
              if (!d.isSupported()) {
                s();
                return;
              }
              const l = new d({
                backBufferLength: 30,
                enableWorker: !0,
                liveSyncDurationCount: 3,
                lowLatencyMode: !0,
              });
              ((i = l),
                l.on(d.Events.ERROR, (c, h) => {
                  h.fatal && (s(), l.destroy());
                }),
                l.on(d.Events.MANIFEST_PARSED, () => {
                  n.play().catch(() => {});
                }),
                l.loadSource(o),
                l.attachMedia(n));
            })
            .catch(() => s()),
          () => {
            ((a = !0),
              i == null || i.destroy(),
              n.removeAttribute("src"),
              n.load());
          });
    }, [s, o]),
    e.jsx("video", {
      ref: r,
      className: "camera-live-media",
      muted: !0,
      controls: !0,
      playsInline: !0,
      "aria-label": t,
      onError: s,
    })
  );
}
function Si({ compact: t = !1, entity: s }) {
  var N;
  const [o, r] = M.useState(),
    [n, a] = M.useState(!1),
    [i, d] = M.useState(!1),
    [l, c] = M.useState(),
    [h, u] = M.useState(!1),
    [f, j] = M.useState(!1),
    [v, y] = M.useState(!1),
    [x, b] = M.useState(Date.now()),
    [w, S] = M.useState(Date.now());
  M.useEffect(() => {
    (r(void 0),
      a(!1),
      d(!1),
      c(void 0),
      u(!1),
      j(!1),
      y(!1),
      b(Date.now()),
      S(Date.now()));
  }, [s.entityId]);
  const G = pi(),
    L =
      !!(o != null && o.mjpegUrl) &&
      !(
        (N = o == null ? void 0 : o.mjpegUrl) != null &&
        N.includes("camera_proxy_stream")
      ),
    I = n && (o == null ? void 0 : o.source) === "mjpeg" && L && !h,
    $ =
      n &&
      !I &&
      (o == null ? void 0 : o.source) === "hls" &&
      G &&
      !!o.hlsUrl &&
      !f,
    p = n && !!o && !I && !$ && !v,
    m = !n || i || (n && !I && !$ && !p);
  M.useEffect(() => {
    if (!p) return;
    const R = window.setInterval(() => S(Date.now()), 1500);
    return () => window.clearInterval(R);
  }, [p]);
  async function C() {
    (d(!0), c(void 0), u(!1), j(!1), y(!1));
    try {
      const R = await cr(s.entityId);
      (r(R), b(Date.now()), S(Date.now()), a(!0));
    } catch (R) {
      (c(R instanceof Error ? R.message : "摄像头画面获取失败"), a(!1));
    } finally {
      d(!1);
    }
  }
  function O() {
    (a(!1), u(!1), j(!1), y(!1));
  }
  function g() {
    (u(!1), j(!1), y(!1), b(Date.now()), S(Date.now()));
  }
  const _ = i ? "连接中" : n ? (p ? "快照刷新" : "直播中") : "按需播放",
    k = o ? vt(o.snapshotUrl, w) : void 0,
    E = i ? "正在连接摄像头" : n ? "画面加载失败" : "点击播放实时画面",
    P = n
      ? "请确认该 camera 实体在 Home Assistant 中可以预览。"
      : "优先实时流，无法播放时自动使用快照刷新。";
  return e.jsxs("div", {
    className: "typed-control-stack typed-control-camera",
    children: [
      e.jsxs(ne, {
        title: "实时画面",
        hint: _,
        children: [
          e.jsxs("div", {
            className: `camera-preview-frame ${n ? "is-playing" : ""}`,
            "aria-live": "polite",
            children: [
              I &&
                (o == null ? void 0 : o.mjpegUrl) &&
                e.jsx("img", {
                  className: "camera-live-media",
                  src: vt(o.mjpegUrl, x),
                  alt: `${s.name} 实时画面`,
                  onError: () => u(!0),
                }),
              $ &&
                (o == null ? void 0 : o.hlsUrl) &&
                e.jsx(ki, {
                  label: `${s.name} HLS 实时画面`,
                  src: vt(o.hlsUrl, x),
                  onError: () => j(!0),
                }),
              p &&
                k &&
                e.jsx("img", {
                  className: "camera-live-media",
                  src: k,
                  alt: `${s.name} 快照画面`,
                  onError: () => {
                    (y(!0),
                      c(
                        "摄像头快照加载失败，请确认该实体在 Home Assistant 中可预览。",
                      ));
                  },
                }),
              m &&
                e.jsxs("div", {
                  className: "camera-preview-placeholder",
                  children: [
                    e.jsx(No, { size: 22 }),
                    e.jsx("strong", { children: E }),
                    e.jsx("small", { children: P }),
                  ],
                }),
            ],
          }),
          e.jsxs("div", {
            className: "camera-preview-toolbar",
            children: [
              e.jsxs("button", {
                type: "button",
                className: n ? "active" : "",
                disabled: i,
                onClick: n
                  ? O
                  : () => {
                      C();
                    },
                children: [
                  i
                    ? e.jsx(Mt, { className: "spin-icon", size: 15 })
                    : n
                      ? e.jsx(co, { size: 15 })
                      : e.jsx(ho, { size: 15 }),
                  i ? "连接中" : n ? "停止" : "播放",
                ],
              }),
              e.jsxs("button", {
                type: "button",
                disabled: i || !o,
                onClick: g,
                children: [e.jsx(Mt, { size: 15 }), "刷新"],
              }),
            ],
          }),
          l &&
            e.jsx("p", {
              className: "camera-preview-error",
              role: "status",
              children: l,
            }),
        ],
      }),
      !t && e.jsx(nr, { entity: s }),
      !t &&
        e.jsx("p", {
          className: "control-hint",
          children: "摄像头为只读设备；播放失败时会自动改用定时快照。",
        }),
    ],
  });
}
function Ci({ active: t, busy: s, compact: o = !1, entity: r, run: n }) {
  return ci.has(r.domain)
    ? e.jsxs("div", {
        className: "typed-control-stack typed-control-generic",
        children: [
          !o && e.jsx(jt, { items: [{ label: "开关", active: !0 }] }),
          e.jsx(ne, {
            title: o ? "开关" : `${Ue(r.domain)}控制`,
            hint: o ? void 0 : t ? "运行中" : "待机",
            children: e.jsx(Je, { active: t, busy: s, entity: r, run: n }),
          }),
        ],
      })
    : e.jsx(ar, { compact: o, entity: r });
}
function Pi({ active: t, busy: s, compact: o = !1, entity: r, run: n }) {
  return r.domain === "light"
    ? e.jsx(wi, { active: t, busy: s, compact: o, entity: r, run: n })
    : r.domain === "cover"
      ? e.jsx(vi, { active: t, busy: s, compact: o, entity: r, run: n })
      : r.domain === "climate"
        ? e.jsx(Mi, { active: t, busy: s, compact: o, entity: r, run: n })
        : r.domain === "fan"
          ? e.jsx(_i, { active: t, busy: s, compact: o, entity: r, run: n })
          : r.domain === "camera"
            ? e.jsx(Si, { compact: o, entity: r })
            : tr.has(r.domain)
              ? e.jsx(ar, { compact: o, entity: r })
              : e.jsx(Ci, {
                  active: t,
                  busy: s,
                  compact: o,
                  entity: r,
                  run: n,
                });
}
function s0({ compact: t = !1, entity: s }) {
  const o = De((x) => x.act),
    [r, n] = M.useState(!1),
    [a, i] = M.useState();
  M.useEffect(() => {
    i(void 0);
  }, [s == null ? void 0 : s.entityId]);
  const d = s ? Ke(s) : "选择 3D 场景中的设备，或从设备列表中选择。";
  async function l(x, b = {}) {
    const w = b.blocking !== !1;
    (w && n(!0), i(void 0));
    try {
      await o(x);
    } catch (S) {
      i(S instanceof Error ? S.message : "控制操作失败");
    } finally {
      w && n(!1);
    }
  }
  if (!s)
    return e.jsxs(
      "section",
      {
        className: "control-card empty-state",
        children: [
          e.jsx("p", { className: "eyebrow", children: "设备控制" }),
          e.jsx("h2", { children: "选择一个设备" }),
          e.jsx("p", { children: d }),
        ],
      },
      "empty",
    );
  const c = bn(s),
    h = hi.has(s.state),
    u = tr.has(s.domain),
    f = r ? "同步中" : h ? "不可用" : u ? "只读" : c ? "运行中" : "待机",
    j = mi(s),
    v = (x, b) => {
      l(x, b);
    },
    y = !t;
  return e.jsxs("section", {
    className: `control-card ${t ? "compact" : ""} ${r ? "is-busy" : ""}`,
    "aria-busy": r,
    children: [
      y &&
        e.jsxs("div", {
          className: "entity-control-hero",
          children: [
            e.jsx("span", {
              className: `domain-icon domain-${s.domain} entity-hero-icon ${c ? "active" : ""}`,
              children: e.jsx(Cs, { domain: s.domain, size: 25 }),
            }),
            e.jsxs("div", {
              children: [
                e.jsx("p", { className: "eyebrow", children: Ue(s.domain) }),
                e.jsx("h2", { children: s.name }),
                e.jsx("p", { className: "entity-id", children: s.entityId }),
              ],
            }),
            e.jsxs("span", {
              className: `control-sync-pill ${r ? "syncing" : !h && (c || u) ? "online" : ""}`,
              children: [e.jsx("i", {}), f],
            }),
          ],
        }),
      y &&
        e.jsxs("div", {
          className: `state-readout ${c ? "active" : ""}`,
          children: [
            e.jsxs("span", { children: [e.jsx("i", {}), "当前状态"] }),
            e.jsx("strong", { children: d }),
          ],
        }),
      y &&
        j.length > 0 &&
        e.jsx("div", {
          className: "entity-attribute-grid",
          "aria-label": "设备关键属性",
          children: j.map((x) =>
            e.jsxs(
              "div",
              {
                children: [
                  e.jsx("small", { children: x.label }),
                  e.jsx("strong", { children: x.value }),
                ],
              },
              x.key,
            ),
          ),
        }),
      e.jsx(Pi, { active: c, busy: r || h, compact: t, entity: s, run: v }),
      a &&
        e.jsx("p", { className: "control-error", role: "status", children: a }),
    ],
  });
}
function ir(t) {
  const s = [];
  return (
    M.Children.forEach(t, (o) => {
      M.isValidElement(o) &&
        (o.type === "option"
          ? s.push(o)
          : o.props.children && s.push(...ir(o.props.children)));
    }),
    s
  );
}
function r0({
  children: t,
  className: s = "",
  disabled: o,
  value: r,
  defaultValue: n,
  onChange: a,
  onBlur: i,
  onFocus: d,
  "aria-label": l,
  id: c,
  name: h,
  ...u
}) {
  const f = M.useId(),
    j = c ?? f,
    v = M.useRef(null),
    y = M.useRef(null),
    [x, b] = M.useState(!1),
    [w, S] = M.useState(0),
    [G, L] = M.useState(String(n ?? "")),
    [I, $] = M.useState(),
    p = M.useMemo(() => ir(t), [t]),
    m = String(r ?? G),
    C = Math.max(
      0,
      p.findIndex((k) => String(k.props.value ?? "") === m),
    ),
    O = p[C];
  M.useEffect(() => {
    if (!x) return;
    const k = () => {
        var z;
        const P = (z = v.current) == null ? void 0 : z.getBoundingClientRect();
        if (!P) return;
        const N = Math.min(360, window.innerHeight * 0.5),
          R = window.innerHeight - P.bottom - 8,
          F = R < Math.min(220, N) && P.top > R;
        $({
          left: Math.max(
            8,
            Math.min(P.left, window.innerWidth - Math.max(P.width, 280) - 8),
          ),
          width: Math.min(Math.max(P.width, 280), window.innerWidth - 16),
          maxHeight: N,
          ...(F
            ? { bottom: window.innerHeight - P.top + 5 }
            : { top: P.bottom + 5 }),
        });
      },
      E = (P) => {
        var R, F;
        const N = P.target;
        !((R = v.current) != null && R.contains(N)) &&
          !((F = y.current) != null && F.contains(N)) &&
          b(!1);
      };
    return (
      k(),
      document.addEventListener("pointerdown", E),
      window.addEventListener("resize", k),
      window.addEventListener("scroll", k, !0),
      () => {
        (document.removeEventListener("pointerdown", E),
          window.removeEventListener("resize", k),
          window.removeEventListener("scroll", k, !0));
      }
    );
  }, [x]);
  function g(k) {
    const E = p[k];
    if (!E || E.props.disabled) return;
    const P = String(E.props.value ?? "");
    (L(P),
      b(!1),
      a == null ||
        a({
          target: { value: P, name: h },
          currentTarget: { value: P, name: h },
        }));
  }
  function _(k) {
    var N;
    if (k.key === "Escape") {
      b(!1);
      return;
    }
    if (k.key === "Enter" || k.key === " ") {
      (k.preventDefault(), x ? g(w) : b(!0));
      return;
    }
    if (k.key !== "ArrowDown" && k.key !== "ArrowUp") return;
    k.preventDefault();
    const E = k.key === "ArrowDown" ? 1 : -1;
    let P = x ? w : C;
    do P = (P + E + p.length) % p.length;
    while ((N = p[P]) != null && N.props.disabled && P !== w);
    (S(P), b(!0));
  }
  return e.jsxs("div", {
    ref: v,
    className: `app-select ${x ? "open" : ""} ${o ? "disabled" : ""} ${s}`,
    children: [
      e.jsx("select", {
        id: j,
        name: h,
        value: m,
        disabled: o,
        onChange: a,
        "aria-hidden": "true",
        tabIndex: -1,
        ...u,
        children: t,
      }),
      e.jsxs("button", {
        type: "button",
        className: "app-select-trigger",
        disabled: o,
        "aria-label": l,
        "aria-haspopup": "listbox",
        "aria-expanded": x,
        "aria-controls": `${j}-listbox`,
        onFocus: (k) => (d == null ? void 0 : d(k)),
        onBlur: (k) => (i == null ? void 0 : i(k)),
        onClick: () => {
          (S(C), b((k) => !k));
        },
        onKeyDown: _,
        children: [
          e.jsx("span", {
            children: (O == null ? void 0 : O.props.children) ?? "请选择",
          }),
          e.jsx(Tr, { size: 15 }),
        ],
      }),
      x &&
        I &&
        Ro.createPortal(
          e.jsx("div", {
            ref: y,
            id: `${j}-listbox`,
            className: "app-select-menu",
            style: I,
            role: "listbox",
            "aria-label": l,
            children: p.map((k, E) =>
              e.jsxs(
                "button",
                {
                  type: "button",
                  role: "option",
                  "aria-selected": E === C,
                  disabled: k.props.disabled,
                  className: E === w ? "active" : "",
                  onPointerMove: () => S(E),
                  onClick: () => g(E),
                  children: [
                    e.jsx("span", { children: k.props.children }),
                    E === C && e.jsx(Lr, { size: 14 }),
                  ],
                },
                String(k.key ?? k.props.value ?? E),
              ),
            ),
          }),
          document.body,
        ),
    ],
  });
}
export {
    Co as $,
    r0 as A,
    Li as B,
    Lr as C,
    xs as D,
    Ti as E,
    dt as F,
    Sn as G,
    Ii as H,
    Zi as I,
    Tr as J,
    s0 as K,
    it as L,
    Oi as M,
    yn as N,
    ms as O,
    Ri as P,
    Gt as Q,
    Ai as R,
    gs as S,
    Hi as T,
    vn as U,
    Ro as V,
    jn as W,
    Cs as X,
    Xi as Y,
    St as Z,
    Vi as _,
    Gs as a,
    pe as a0,
    rn as a1,
    Ui as a2,
    Jo as a3,
    Ki as a4,
    tn as a5,
    en as a6,
    qi as a7,
    We as a8,
    hs as a9,
    us as aa,
    lt as ab,
    Et as ac,
    To as ad,
    Br as ae,
    Kt as af,
    fs as ag,
    ps as ah,
    ho as ai,
    Ls as b,
    Ue as c,
    Wi as d,
    wn as e,
    Ps as f,
    Di as g,
    kn as h,
    ys as i,
    zs as j,
    Ye as k,
    $s as l,
    Ji as m,
    e0 as n,
    Qi as o,
    Mn as p,
    Yi as q,
    bs as r,
    bn as s,
    Ke as t,
    Fo as u,
    Ni as v,
    $i as w,
    Fi as x,
    Bi as y,
    t0 as z
};

