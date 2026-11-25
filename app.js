'use strict';
/* Figura — a canvas for diagrams of every kind: states and automata, categories, circuits, geometry, ZX.
   No build step. See agents.md for the map of this file. */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 9);
const clone = o => JSON.parse(JSON.stringify(o));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const R2D = 180 / Math.PI, D2R = Math.PI / 180;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const f2 = v => Math.round(v * 100) / 100;

/* ================= icons ================= */
const sv = (inner, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const IC = {
  select: sv('<path d="M5.5 3.5l12.5 6.3-5.5 1.8-2.4 5.5z"/>'),
  lasso: sv('<path d="M8 17.2C5 16.3 3 14.2 3 11.6 3 7.8 7 5 12 5s9 2.8 9 6.4c0 3.5-4 6.3-9 6.3-1 0-2-.1-2.9-.3"/><circle cx="8.6" cy="17.4" r="1.4"/><path d="M8.3 18.8c-.4 1.1 0 2.1 1 2.7"/>'),
  hand: sv('<path d="M8 12.5V6a1.5 1.5 0 013 0v5m0-6.6V4a1.5 1.5 0 013 0v7m0-5.4a1.5 1.5 0 013 0V11m0-2.6a1.5 1.5 0 013 0V15a6 6 0 01-6 6h-1.4a6 6 0 01-4.7-2.3l-3.3-4.2a1.6 1.6 0 012.5-2L8 14"/>'),
  circle: sv('<circle cx="12" cy="12" r="7.5"/>'),
  rect: sv('<rect x="3.8" y="6.5" width="16.4" height="11" rx="2.4"/>'),
  tri: sv('<path d="M12 4.8l8 13.7H4z"/>'),
  diamond: sv('<path d="M12 3.6l8.4 8.4-8.4 8.4L3.6 12z"/>'),
  text: sv('<path d="M5.5 7V5h13v2M12 5v14M9.5 19h5"/>'),
  edge: sv('<path d="M5 19L18.5 5.5"/><path d="M11.5 5.5h7v7"/>'),
  dot: sv('<circle cx="12" cy="12" r="3.6" fill="currentColor" stroke="none"/>'),
  edgeDash: sv('<path d="M5 19L18.5 5.5" stroke-dasharray="3 3.2"/><path d="M11.5 5.5h7v7"/>'),
  edgeDot: sv('<path d="M5 19L18.5 5.5" stroke-dasharray="0 3.4" stroke-width="2.2"/><path d="M11.5 5.5h7v7"/>'),
  image: sv('<rect x="3.5" y="5" width="17" height="14" rx="2.2"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 16.5l-5-5L7 19"/>'),
  compass: sv('<circle cx="12" cy="4.6" r="1.7"/><path d="M11.2 6.2L6.5 19.5M12.8 6.2l4.7 13.3"/><path d="M4.5 15.5c4.4 3 10.6 3 15 0" stroke-dasharray="1.8 2.2"/>'),
  laser: sv('<path d="M4 20l8-8"/><circle cx="15.5" cy="8.5" r="2.4" fill="currentColor" stroke="none"/><path d="M15.5 2.8v1.4M21.2 8.5h-1.4M19.5 4.5l-1 1M19.5 12.5l-1-1M11.5 4.5l1 1"/>'),
  undo: sv('<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 010 11H11"/>', 16),
  redo: sv('<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 000 11H13"/>', 16),
  zin: sv('<path d="M12 5v14M5 12h14"/>', 16),
  zout: sv('<path d="M5 12h14"/>', 16),
  fit: sv('<path d="M4 9V5a1 1 0 011-1h4M15 4h4a1 1 0 011 1v4M20 15v4a1 1 0 01-1 1h-4M9 20H5a1 1 0 01-1-1v-4"/>', 16),
  open: sv('<path d="M3.5 7.5a2 2 0 012-2h4l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2h-13a2 2 0 01-2-2z"/>'),
  exp: sv('<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5"/>'),
  gear: sv('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>'),
  help: sv('<circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 014.8 1c0 1.7-2.4 2.3-2.4 3.8M12 17.2h.01"/>'),
  close: sv('<path d="M6 6l12 12M18 6L6 18"/>', 16),
  more: sv('<circle cx="5.5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="12" r="1.2" fill="currentColor"/>', 16),
  crop: sv('<path d="M6 2.5V16a2 2 0 002 2h13.5"/><path d="M2.5 6H16a2 2 0 012 2v13.5"/>', 16),
  shape: sv('<circle cx="8.5" cy="8.5" r="4.5"/><rect x="11" y="11" width="9.5" height="9.5" rx="1.5"/>', 16),
  heads: sv('<path d="M3 12h17M15 7l5 5-5 5"/>', 16),
  label: sv('<path d="M4 7V5h11v2M9.5 5v12M7.5 17h4M14 13h6M14 17h4"/>', 16),
  olab: sv('<rect x="5" y="10" width="11" height="9" rx="2"/><path d="M7 5.5h7M19.5 12.5v4"/>', 16),
  lstyle: sv('<path d="M3.5 7h17"/><path d="M3.5 12h17" stroke-dasharray="3.5 3"/><path d="M3.5 17h17" stroke-dasharray="0 3.4" stroke-width="2.2"/>', 16),
  dup: sv('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>', 16),
  trash: sv('<path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l.9 12.2a1.5 1.5 0 001.5 1.3h6.2a1.5 1.5 0 001.5-1.3L17.5 7"/>', 16),
  front: sv('<rect x="9" y="9" width="11" height="11" rx="2" fill="currentColor" fill-opacity=".18"/><path d="M15 9V5.5A1.5 1.5 0 0013.5 4h-8A1.5 1.5 0 004 5.5v8A1.5 1.5 0 005.5 15H9"/>', 16),
  back: sv('<rect x="4" y="4" width="11" height="11" rx="2" fill="currentColor" fill-opacity=".18"/><path d="M9 15v3.5a1.5 1.5 0 001.5 1.5h8a1.5 1.5 0 001.5-1.5v-8A1.5 1.5 0 0018.5 9H15"/>', 16),
  copy: sv('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 012-2h10"/>', 16),
  paste: sv('<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5V3h6v1.5"/>', 16),
  swap: sv('<path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/>', 16),
  straight: sv('<path d="M4 18L20 6"/>', 16),
  selBox: sv('<rect x="4" y="5" width="16" height="14" rx="2" stroke-dasharray="3 2.6"/>'),
  map: sv('<path d="M9 4.5L3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>', 16),
  ftop: sv('<path d="M5 4h14M12 20V8.5M7.5 13L12 8.5l4.5 4.5"/>', 16),
  fbot: sv('<path d="M5 20h14M12 4v11.5M7.5 11L12 15.5l4.5-4.5"/>', 16),
  layers: sv('<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5"/><path d="M3.5 16.5L12 21l8.5-4.5"/>', 16),
  lock: sv('<rect class="lk-b" x="5" y="11" width="14" height="9.5" rx="2.2"/><path class="lk-sh" d="M8 11V8a4 4 0 0 1 8 0v3"/>', 16),
  lockS: sv('<rect x="5" y="11" width="14" height="9.5" rx="2.2" fill="currentColor" fill-opacity=".15"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 12),
  closeS: sv('<path d="M7 7l10 10M17 7L7 17"/>', 12),
  plus: sv('<path d="M12 5.5v13M5.5 12h13"/>', 16),
  tex: '<span style="font:600 12px Georgia,serif;letter-spacing:-.02em">T<sub style="font-size:10px;vertical-align:-2px">E</sub>X</span>',
  bold: '<b class="gl" style="font-weight:650">B</b>', ital: '<i class="gl" style="font-family:Georgia,serif">I</i>', under: '<u class="gl" style="text-underline-offset:2px;text-decoration-thickness:1px">U</u>',
  vert: sv('<path d="M9 4v16M5 7V4h8v3M17 9v11M15 18l2 2 2-2"/>', 16),
  horiz: sv('<path d="M4 9h16M7 5H4v8h3M9 17h11M18 15l2 2-2 2"/>', 16),
  dots: sv('<g fill="currentColor" stroke="none"><circle cx="6" cy="6" r="1.5"/><circle cx="12" cy="6" r="1.5"/><circle cx="18" cy="6" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/><circle cx="6" cy="18" r="1.5"/><circle cx="12" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></g>', 16),
  half: sv('<g fill="currentColor" stroke="none"><circle cx="5" cy="5" r="1.6"/><circle cx="19" cy="5" r="1.6"/><circle cx="5" cy="19" r="1.6"/><circle cx="19" cy="19" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="5" r=".9"/><circle cx="5" cy="12" r=".9"/><circle cx="19" cy="12" r=".9"/><circle cx="12" cy="19" r=".9"/></g>', 16),
  free: sv('<path d="M4 17c3-9 6 2 9-5s5-3 7-6"/>', 16),
  logo: '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="7" cy="8" r="4.2" fill="#d6d8fb" stroke="#1d1d1f" stroke-width="1.6"/><rect x="12.5" y="12.5" width="8.5" height="8.5" rx="2" fill="#fde2c4" stroke="#1d1d1f" stroke-width="1.6"/><path d="M10 11l3.4 3.4" stroke="#1d1d1f" stroke-width="1.6" stroke-linecap="round"/></svg>',
};
const triIc = d => { const r = { up: 0, right: 90, down: 180, left: 270 }[d]; return `<span style="display:grid;transform:rotate(${r}deg)">${sv('<path d="M12 5l7.5 13h-15z"/>', 15)}</span>`; };
const headIc = (t, back) => {
  const tr = back ? 'transform="matrix(-1 0 0 1 24 0)"' : '';
  const L = `<path d="M3 12H${{ tri: 15, otri: 14, circ: 14.4, ocirc: 14.4, ray: 13.5 }[t] || 19}"/>`;
  const H = { none: '', vee: '<path d="M14.5 7.5L19 12l-4.5 4.5"/>', tri: '<path d="M14 7.5L19.5 12 14 16.5z" fill="currentColor"/>', otri: '<path d="M14 7.5L19.5 12 14 16.5z"/>',
    two: '<path d="M11 7.5l4.5 4.5L11 16.5M15 7.5l4.5 4.5-4.5 4.5"/>', circ: '<circle cx="17" cy="12" r="2.6" fill="currentColor"/>', ocirc: '<circle cx="17" cy="12" r="2.6"/>',
    hook: '<path d="M19 12c2.6 0 2.6-5 0-5"/>', bar: '<path d="M19.5 7.5v9"/>', ray: '<path d="M15.5 12h2.2" opacity=".55"/><path d="M19.7 12h1.6" opacity=".25"/>' }[t];
  return sv(`<g ${tr}>${L}${H}</g>`, 18);
};
const dashPat = sd => sd === 'dash' ? [3, 2] : sd === 'dot' ? [0, 2] : /^d:/.test(sd || '') ? sd.split(':').slice(1).map(Number) : null;
const lineIc = (sd, w = 1.8) => {
  const p = /^d:/.test(sd || '') ? dashPat(sd) : null;
  const da = p ? `stroke-dasharray="${p[0] * 1.4} ${p[1] * 1.5 + (p[0] ? 0 : 1)}"` : sd === 'dash' ? 'stroke-dasharray="4 3"' : sd === 'dot' ? 'stroke-dasharray="0 3.6"' : '';
  return `<svg width="22" height="12" viewBox="0 0 22 12"><path d="M2 6h18" fill="none" stroke="currentColor" stroke-width="${p && !p[0] ? 2.2 : w}" stroke-linecap="round" ${da}/></svg>`;
};
const shapeIc = k => `<svg width="24" height="12" viewBox="0 0 24 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${{ line: '<path d="M2 6h20"/>', double: '<path d="M2 4.2h20M2 7.8h20"/>', wave: '<path d="M2 6c1.6-4 3.4-4 5 0s3.4 4 5 0 3.4-4 5 0 3.4 4 5 0"/>', zig: '<path d="M2 6l2.5-3.5 5 7 5-7 5 7L22 6"/>' }[k]}</svg>`;

/* ================= palette ================= */
function hsl2hex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}
const HUES = [4, 22, 40, 84, 148, 174, 198, 218, 256, 328];
const TONES = { Pastel: [64, 94], Soft: [52, 85], Vivid: [56, 54], Deep: [44, 33] };
const PAL = { Mono: ['#ffffff', '#f4f4f2', '#e4e4e0', '#cbcbc6', '#a3a39e', '#7a7a7e', '#56565b', '#3a3a3f', '#1d1d1f', '#000000'] };
for (const [t, [s, l]] of Object.entries(TONES)) PAL[t] = HUES.map(h => hsl2hex(h, s, l));
const TONE_NAMES = ['Mono', 'Pastel', 'Soft', 'Vivid', 'Deep'];
const WIDTHS = [0.75, 1, 1.5, 2, 3, 4.5];
const TSIZES = [11, 13, 15, 18, 24, 32];

/* ================= state ================= */
const G = 40;   // grid spacing in world px
const KDEF = {
  circle: { w: 40, h: 40, fill: 'none', stroke: '#1d1d1f', sw: 1.5, dbl: false, sd: 'solid', rad: 0 },
  rect: { w: 80, h: 40, fill: 'none', stroke: '#1d1d1f', sw: 1.5, dbl: false, sd: 'solid', rad: 6 },
  tri: { w: 48, h: 42, fill: 'none', stroke: '#1d1d1f', sw: 1.5, dbl: false, sd: 'solid', rad: 0, dir: 'up' },
  diamond: { w: 56, h: 56, fill: 'none', stroke: '#1d1d1f', sw: 1.5, dbl: false, sd: 'solid', rad: 4 },
  text: { w: 12, h: 12, fill: 'none', stroke: 'none', sw: 1.5, dbl: false, sd: 'solid', rad: 0 },
  dot: { w: 8, h: 8, fill: '#1d1d1f', stroke: 'none', sw: 1.5, dbl: false, sd: 'solid', rad: 0 },
  image: { w: 160, h: 120, fill: 'none', stroke: 'none', sw: 1.5, dbl: false, sd: 'solid', rad: 0 },
};
const TS = { size: 15, color: '#1d1d1f', bold: false, italic: false, under: false, vert: false };
const STYLE_KEYS = ['fill', 'stroke', 'sw', 'dbl', 'sd', 'rad', 'dir', 'att'];
const LS = { doc: 'figura-doc-v1', ws: 'figura-ws-v1', prefs: 'figura-prefs-v1', seen: 'figura-seen-v1', mm: 'figura-mm-v1', dock: 'figura-dock-v1', cp: 'figura-cp-v1', recent: 'figura-recent-v1', order: 'figura-order-v1', docks: 'figura-docks-v1' };
const lsGet = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };
const ORD = Object.assign({ seg: {} }, lsGet(LS.order) || {});
if (ORD.dock && !ORD.dock.includes('dot')) { const i = ORD.dock.indexOf('diamond'); ORD.dock.splice(i < 0 ? ORD.dock.length : i + 1, 0, 'dot'); }

const prefs = Object.assign({ grid: 'dots', magnet: true, selMode: 'box', tone: 'Soft', edge: { dash: 'solid', head: 'vee' }, defs: {} }, lsGet(LS.prefs) || {});
const savePrefs = () => lsSet(LS.prefs, prefs);
/* once: new defaults are no fill and a single border, so drop those two from older saved tool defaults */
if (!prefs.defsV2) { for (const k in prefs.defs || {}) { delete prefs.defs[k].dbl; if (prefs.defs[k].fill === '#ffffff') delete prefs.defs[k].fill; } prefs.defsV2 = 1; savePrefs(); }

let doc = { nodes: [], edges: [] };
let assets = {};                 // asset id → data URL (images)
const blobUrls = {};             // asset id → object URL used on screen
let idx = new Map();             // node id → node
let sel = new Set();             // selected node and edge ids
let cam = { x: 0, y: 0, z: 1 };
let tool = 'select';
let holdS = false, parMode = null, nbOn = 0, nbT = 0;
let drag = null, hov = null, wirePend = null, editing = null, crop = null, guides = [];
let space = false, undoS = [], redoS = [], clip = null, clipText = '', pasteN = 0, lastPtr = null, pasteWait = 0;

const vp = $('#viewport'), world = $('#world'), esvg = $('#edges'), nodesL = $('#nodes'), elabsL = $('#elabs'), ov = $('#ov'), lcv = $('#laser');
const bar = $('#bar'), pp = $('#pp'), menu = $('#menu'), hint = $('#hint');
const nodeEls = new Map(), elabEls = new Map(), geo = new Map(), meas = new Map(), egeo = new Map();

const isEdgeId = id => id[0] === 'e';
const selNodes = () => doc.nodes.filter(n => sel.has(n.id));
const selEdges = () => doc.edges.filter(e => sel.has(e.id));
const edgeById = id => doc.edges.find(e => e.id === id);

/* ================= geometry ================= */
function rotv(x, y, deg) { const a = deg * D2R, c = Math.cos(a), s = Math.sin(a); return { x: x * c - y * s, y: x * s + y * c }; }
const toLocal = (n, p) => rotv(p.x - n.x, p.y - n.y, -(n.rot || 0));
const fromLocal = (n, l) => { const r = rotv(l.x, l.y, n.rot || 0); return { x: n.x + r.x, y: n.y + r.y }; };
const size = n => geo.get(n.id) || { w: n.w, h: n.h };
const unit = (x, y) => { const L = Math.hypot(x, y) || 1; return { x: x / L, y: y / L }; };
const step = () => prefs.grid === 'dots' ? G : prefs.grid === 'half' ? G / 2 : 0;
const snapV = v => { const s = step(); return s ? Math.round(v / s) * s : v; };
const snapP = p => ({ x: snapV(p.x), y: snapV(p.y) });

function poly(n, w, h) {
  const a = w / 2, b = h / 2;
  switch (n.k) {
    case 'circle': case 'dot': return null;
    case 'diamond': return [[0, -b], [a, 0], [0, b], [-a, 0]];
    case 'tri': return { up: [[0, -b], [a, b], [-a, b]], down: [[0, b], [-a, -b], [a, -b]], right: [[a, 0], [-a, b], [-a, -b]], left: [[-a, 0], [a, -b], [a, b]] }[n.dir || 'up'];
    default: return [[-a, -b], [a, -b], [a, b], [-a, b]];
  }
}
function rayPoly(P, ux, uy) {
  let best = 0;
  for (let i = 0; i < P.length; i++) {
    const A = P[i], B = P[(i + 1) % P.length], ex = B[0] - A[0], ey = B[1] - A[1];
    const den = ux * ey - uy * ex; if (Math.abs(den) < 1e-9) continue;
    const s = (A[0] * ey - A[1] * ex) / den, v = (A[0] * uy - A[1] * ux) / den;
    if (s > 0 && v >= -1e-6 && v <= 1 + 1e-6) best = Math.max(best, s);
  }
  return best;
}
/* the small gap between a shape's outline and the lines that meet it */
const bpad = n => n.k === 'dot' ? 1 : (n.k === 'text' || n.k === 'image' && n.stroke === 'none') ? 3 : (n.stroke === 'none' ? 1.5 : n.sw / 2 + 1.5);
/* point where a ray from the node's centre towards p leaves the node (plus a small gap) */
function boundary(n, p) {
  const { w, h } = size(n);
  const pad = bpad(n);
  let l = toLocal(n, p), L = Math.hypot(l.x, l.y);
  if (L < 1e-6) { l = { x: 0, y: -1 }; L = 1; }
  const ux = l.x / L, uy = l.y / L;
  const t = n.k === 'circle' || n.k === 'dot' ? 1 / Math.sqrt((ux / (w / 2)) ** 2 + (uy / (h / 2)) ** 2) : (rayPoly(poly(n, w, h), ux, uy) || Math.max(w, h) / 2);
  return fromLocal(n, { x: ux * (t + pad), y: uy * (t + pad) });
}
function pip(P, p) {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const [xi, yi] = P[i], [xj, yj] = P[j];
    if ((yi > p.y) !== (yj > p.y) && p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function segDist(p, A, B) {
  const ex = B[0] - A[0], ey = B[1] - A[1], L2 = ex * ex + ey * ey || 1;
  const t = clamp(((p.x - A[0]) * ex + (p.y - A[1]) * ey) / L2, 0, 1);
  return Math.hypot(p.x - A[0] - t * ex, p.y - A[1] - t * ey);
}
function inside(n, p, m = 0) {
  const { w, h } = size(n), l = toLocal(n, p);
  let a = w / 2 + m, b = h / 2 + m;
  if (n.k === 'dot') { a = b = Math.max(a, m ? 7 / cam.z : 0); return l.x * l.x + l.y * l.y <= a * a; }
  if (n.k === 'circle') return (l.x / a) ** 2 + (l.y / b) ** 2 <= 1;
  if (Math.abs(l.x) > a || Math.abs(l.y) > b) return false;
  if (n.k === 'diamond') return Math.abs(l.x) / a + Math.abs(l.y) / b <= 1;
  if (n.k === 'tri') { const P = poly(n, w, h); return pip(P, l) || P.some((A, i) => segDist(l, A, P[(i + 1) % P.length]) <= m); }
  return true;
}
function hitNode(p, skip) {
  const m = 4 / cam.z;
  /* points win over anything they sit on (a dot on a circle's ring, a midpoint on a line) */
  for (let i = doc.nodes.length - 1; i >= 0; i--) { const n = doc.nodes[i]; if (n !== skip && n.k === 'dot' && inside(n, p, m)) return n; }
  /* a compass circle is only hit on its ring, so what lies inside it stays clickable */
  for (let i = doc.nodes.length - 1; i >= 0; i--) { const n = doc.nodes[i]; if (n !== skip && (n.dep?.op === 'circ' ? Math.abs(Math.hypot(p.x - n.x, p.y - n.y) - n.w / 2) <= m + 2 / cam.z : inside(n, p, m))) return n; }
  return null;
}
function corners(n, pad = 0) {
  const { w, h } = size(n), a = w / 2 + pad, b = h / 2 + pad;
  return [[-a, -b], [a, -b], [a, b], [-a, b]].map(([x, y]) => fromLocal(n, { x, y }));
}
function bboxOf(pts) {
  let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
  for (const p of pts) { l = Math.min(l, p.x); t = Math.min(t, p.y); r = Math.max(r, p.x); b = Math.max(b, p.y); }
  return { l, t, r, b, w: r - l, h: b - t, cx: (l + r) / 2, cy: (t + b) / 2 };
}
function insetPoly(P, d) {
  const C = P.reduce((s, q) => [s[0] + q[0] / P.length, s[1] + q[1] / P.length], [0, 0]);
  const lines = P.map((A, i) => {
    const B = P[(i + 1) % P.length]; const e = unit(B[0] - A[0], B[1] - A[1]);
    let nx = -e.y, ny = e.x; if (nx * (C[0] - A[0]) + ny * (C[1] - A[1]) < 0) { nx = -nx; ny = -ny; }
    return { p: [A[0] + nx * d, A[1] + ny * d], e };
  });
  return lines.map((L2, i) => {
    const L1 = lines[(i - 1 + lines.length) % lines.length];
    const cr = L1.e.x * L2.e.y - L1.e.y * L2.e.x; if (Math.abs(cr) < 1e-9) return L2.p;
    const t = ((L2.p[0] - L1.p[0]) * L2.e.y - (L2.p[1] - L1.p[1]) * L2.e.x) / cr;
    return [L1.p[0] + L1.e.x * t, L1.p[1] + L1.e.y * t];
  });
}
function roundPath(P, r) {
  const n = P.length, fmt = q => `${f2(q[0])},${f2(q[1])}`;
  if (!r) return 'M' + P.map(fmt).join('L') + 'Z';
  const cut = i => {
    const V = P[i], A = P[(i - 1 + n) % n], B = P[(i + 1) % n];
    const la = Math.hypot(A[0] - V[0], A[1] - V[1]), lb = Math.hypot(B[0] - V[0], B[1] - V[1]), rr = Math.min(r, la / 2.1, lb / 2.1);
    return [[V[0] + (A[0] - V[0]) / la * rr, V[1] + (A[1] - V[1]) / la * rr], V, [V[0] + (B[0] - V[0]) / lb * rr, V[1] + (B[1] - V[1]) / lb * rr]];
  };
  const C = P.map((_, i) => cut(i));
  let d = 'M' + fmt(C[0][2]);
  for (let i = 1; i <= n; i++) { const c = C[i % n]; d += 'L' + fmt(c[0]) + 'Q' + fmt(c[1]) + ' ' + fmt(c[2]); }
  return d + 'Z';
}
function shapeD(n, w, h, inset = 0) {
  const cx = w / 2, cy = h / 2;
  if (n.k === 'circle' || n.k === 'dot') {
    const a = Math.max(.5, w / 2 - inset), b = Math.max(.5, h / 2 - inset);
    const k = .5523, P = (x, y) => `${f2(cx + x)},${f2(cy + y)}`;
    return `M${P(a, 0)}C${P(a, k * b)} ${P(k * a, b)} ${P(0, b)}C${P(-k * a, b)} ${P(-a, k * b)} ${P(-a, 0)}C${P(-a, -k * b)} ${P(-k * a, -b)} ${P(0, -b)}C${P(k * a, -b)} ${P(a, -k * b)} ${P(a, 0)}Z`;
  }
  let P = poly(n, w, h);
  if (inset) P = insetPoly(P, inset);
  return roundPath(P.map(([x, y]) => [x + cx, y + cy]), Math.max(0, (n.rad || 0) - inset * .4));
}
function dashArr(sd, sw) {
  if (sd === 'dash') return `stroke-dasharray="${f2(4 + sw * 2)} ${f2(3 + sw * 1.4)}"`;
  if (sd === 'dot') return `stroke-dasharray="0 ${f2(2.4 + sw * 1.6)}" stroke-linecap="round"`;
  if (/^d:/.test(sd || '')) { const [a, b] = dashPat(sd), u = 1 + sw; return a ? `stroke-dasharray="${f2(a * u)} ${f2(b * u)}"` : `stroke-dasharray="0 ${f2(b * u + sw)}" stroke-linecap="round"`; }
  return '';
}

/* ================= text ================= */
const htmlCache = new Map();
/* text with LaTeX: $…$, \(…\) inline; $$…$$, \[…\] and bare \begin{matrix|pmatrix|align|cases|…} as display */
const MATH_RE = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|(\\begin\{([a-zA-Z]+\*?)\}[\s\S]*?\\end\{\5\})|\$([^$]+?)\$/g;
const hasMath = s => !!s && (s.includes('$') || /\\[[(]|\\begin\{/.test(s));
function mathParts(s) {
  const out = []; let last = 0;
  for (const m of s.matchAll(MATH_RE)) {
    if (m.index > last) out.push({ t: s.slice(last, m.index) });
    const disp = m[1] != null || m[2] != null || m[4] != null;
    out.push({ m: (m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[6]).trim(), disp, raw: m[0] });
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push({ t: s.slice(last) });
  return out;
}
/* environments that only live at the top of a display (align, equation, gather) become their inner forms */
const innerEnv = tex => tex.replace(/\\(begin|end)\{(align|alignat|flalign|gather|multline)\*?\}/g, (_, be, env) => `\\${be}{${env === 'gather' || env === 'multline' ? 'gathered' : 'aligned'}}`).replace(/\\(begin|end)\{(equation)\*?\}/g, '');
function texHTML(s) {
  if (!s) return '';
  let h = htmlCache.get(s); if (h != null) return h;
  if (!hasMath(s) || !window.katex) h = esc(s);
  else h = mathParts(s).map((p, i, ps) => {
    if (p.t != null) { let t = p.t; if (ps[i - 1]?.disp) t = t.replace(/^[ \t]*\n/, ''); if (ps[i + 1]?.disp) t = t.replace(/\n[ \t]*$/, ''); return esc(t); }
    try { return `<span class="mx ${p.disp ? 'disp' : ''}">${katex.renderToString(innerEnv(p.m), { throwOnError: false, displayMode: p.disp, strict: 'ignore', trust: false })}</span>`; }
    catch { return esc(p.raw); }
  }).join('');
  if (window.katex || !hasMath(s)) htmlCache.set(s, h);
  return h;
}
function styleLab(lab, ts) {
  lab.style.fontSize = ts.size + 'px'; lab.style.color = ts.color; lab.style.fontWeight = ts.bold ? 650 : 400;
  lab.style.fontStyle = ts.italic ? 'italic' : 'normal'; lab.style.textDecoration = ts.under ? 'underline' : 'none';
  lab.classList.toggle('vert', !!ts.vert);
}
/* size a shape needs around a text box tw × th */
function needSize(n, m) {
  if (n.k === 'image' || n.k === 'dot' || !m.w) return { w: 0, h: 0 };
  const ex = n.dbl ? 9 : 0, tw = m.w, th = m.h;
  switch (n.k) {
    case 'text': return { w: tw + 6, h: th + 4 };
    case 'rect': return { w: tw + 24 + ex, h: th + 14 + ex };
    case 'circle': { let w = Math.SQRT2 * (tw + 8) + ex, h = Math.SQRT2 * (th + 4) + ex; if (w / h < 1.6) w = h = Math.max(w, h); return { w, h }; }
    case 'diamond': return { w: 2 * tw + 22 + ex, h: 2 * th + 16 + ex };
    case 'tri': { const v = !n.dir || n.dir === 'up' || n.dir === 'down'; return v ? { w: 2.15 * (tw + 8) + ex, h: 2.6 * th + 12 + ex } : { w: 2.6 * tw + 12 + ex, h: 2.15 * (th + 8) + ex }; }
  }
  return { w: tw, h: th };
}

/* ================= images ================= */
function urlOf(aid) {
  if (blobUrls[aid]) return blobUrls[aid];
  const d = assets[aid]; if (!d) return '';
  try {
    const [head, b64] = d.split(','); const mime = head.slice(5).split(';')[0];
    const bin = atob(b64), arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return (blobUrls[aid] = URL.createObjectURL(new Blob([arr], { type: mime })));
  } catch { return d; }
}
const cropOf = n => n.crop || { x: 0, y: 0, w: n.nat?.w || 100, h: n.nat?.h || 100 };
function imageMarkup(n, w, h, uidS, url) {
  const nat = n.nat || { w, h }, c = cropOf(n);
  const par = n.k === 'image' ? 'none' : 'xMidYMid slice';
  return `<g clip-path="url(#c${uidS})"><svg class="im" x="0" y="0" width="${f2(w)}" height="${f2(h)}" viewBox="${f2(c.x)} ${f2(c.y)} ${f2(c.w)} ${f2(c.h)}" preserveAspectRatio="${par}"><image href="${url}" width="${nat.w}" height="${nat.h}" preserveAspectRatio="none"/></svg></g>`;
}
function shapeMarkup(n, w, h, uidS, urlFn) {
  const d = shapeD(n, w, h);
  let s = '';
  const showFill = n.k !== 'text' && n.k !== 'image' && n.fill !== 'none';
  if (showFill) s += `<path d="${d}" fill="${n.fill}"/>`;
  if (n.img && assets[n.img] && n.k !== 'text') {
    s += `<defs><clipPath id="c${uidS}"><path d="${d}"/></clipPath></defs>` + imageMarkup(n, w, h, uidS, urlFn(n.img));
  }
  if (n.k !== 'text' && n.stroke !== 'none' && n.sw > 0) {
    const da = dashArr(n.sd, n.sw);
    s += `<path d="${d}" fill="none" stroke="${n.stroke}" stroke-width="${n.sw}" ${da}/>`;
    if (n.dbl) s += `<path d="${shapeD(n, w, h, Math.max(3.2, n.sw * 1.6 + 2.2))}" fill="none" stroke="${n.stroke}" stroke-width="${n.sw}" ${da}/>`;
  }
  return s;
}

/* ================= edges ================= */
function endPt(e, which) {
  const id = e[which], n = id && idx.get(id);
  if (n) return { x: n.x, y: n.y, n };
  const p = e['p' + which] || { x: 0, y: 0 };
  return { x: p.x, y: p.y, n: null };
}
/* ================= ports: where a line meets a shape (as ZX Draw's box wires) =================
   A line end on a shape (not a dot) sits on one of its sides, at the place its pin says
   (e.qa / e.qb = { s: side, t: place along the side, px from its middle }), or on a vertex ({ v }).
   Sides are the polygon's edges in order (rect: top, right, bottom, left); a circle has four quarter sides in the same order.
   The ends on one side are ordered by their pins and laid out by n.lay: '' evenly, 'ends' packed to both ends,
   'mid' all into the middle of the side. Each end leaves with a short straight leg square to the side (STUB), then
   follows its own path; 'mid' and vertex ends have no leg. A side with more ends than fit makes the shape grow (portGrow).
   Ports ease to new places (animPort, τ 36 ms) and drawEdges keeps going on rAF while one still moves. */
const STUB = 9, PSTEP = 14, PMAG = 26, VMAG = 11;
/* 'along the line': lines aim at the centre and meet the outline where they cross it (no ports). Circles do that unless n.att = 'pin';
   other shapes have ports unless n.att = 'free' */
const isFree = n => n.k === 'circle' ? n.att !== 'pin' : n.att === 'free';
const hasPorts = n => !!n && n.k !== 'dot' && !isFree(n);
const attOf = n => isFree(n) ? 'free' : 'pin';
const ATTS = [['free', sv('<circle cx="10" cy="14" r="6.5"/><path d="M14.6 9.4 21 3"/>', 16), 'Along the line: meets the circle where it points'],
  ['pin', sv('<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="3.5" r="1.3" fill="currentColor"/><circle cx="20.5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="20.5" r="1.3" fill="currentColor"/><circle cx="3.5" cy="12" r="1.3" fill="currentColor"/>', 16), 'Fixed ports on the sides']];
const rectLike = n => n.k !== 'circle' && n.k !== 'diamond' && n.k !== 'tri';
const LAYS = [['', sv('<path d="M6 4v16M6 7.5h9M6 12h9M6 16.5h9"/>', 16), 'Ports spread evenly'],
  ['ends', sv('<path d="M6 4v16M6 6.5h9M6 9.5h9M6 14.5h9M6 17.5h9"/>', 16), 'Ports packed to both ends'],
  ['mid', sv('<path d="M6 4v16M6 12l10-6M6 12h10M6 12l10 6"/>', 16), 'All into the middle']];
let EB = new Map(), PL = new Map(), PV = null;   // ends per node, layouts per node (this render), snap preview
const EL = () => PV ? PV.list : doc.edges;
function edgesByNode() {
  EB = new Map(); PL = new Map();
  EL().forEach((e, i) => {
    if (e.a && e.a === e.b) return;
    for (const w of ['a', 'b']) { const id = e[w]; if (!id) continue; let L = EB.get(id); if (!L) EB.set(id, L = []); L.push({ e, w, i }); }
  });
}
function sidesOf(n, w, h) {
  const a = w / 2, b = h / 2;
  if (n.k === 'circle') return [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([ux, uy], i) => ({ i, circ: true, ux, uy, mx: 0, my: 0, len: (ux ? a : b) * Math.SQRT2 }));
  const P = poly(n, w, h), m = P.length, cx = P.reduce((s, q) => s + q[0], 0) / m, cy = P.reduce((s, q) => s + q[1], 0) / m;
  return P.map((A, i) => {
    const B = P[(i + 1) % m], len = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, ux = (B[0] - A[0]) / len, uy = (B[1] - A[1]) / len, mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    let nx = uy, ny = -ux; if (nx * (mx - cx) + ny * (my - cy) < 0) { nx = -nx; ny = -ny; }
    return { i, ux, uy, nx, ny, mx, my, len };
  });
}
/* the point t px along side S from its middle (on the outline) and the outward normal there */
function sidePt(S, t, w, h) {
  t = clamp(t, -S.len / 2, S.len / 2);
  if (!S.circ) return { x: S.mx + S.ux * t, y: S.my + S.uy * t, nx: S.nx, ny: S.ny };
  const a = w / 2, b = h / 2;
  let x, y;
  if (!S.uy) { x = S.ux * t; y = (S.i === 0 ? -1 : 1) * b * Math.sqrt(Math.max(0, 1 - (x / a) ** 2)); }
  else { y = S.uy * t; x = (S.i === 1 ? 1 : -1) * a * Math.sqrt(Math.max(0, 1 - (y / b) ** 2)); }
  const u = unit(x / (a * a), y / (b * b));
  return { x, y, nx: u.x, ny: u.y };
}
/* the side a local point belongs to, and its place along it */
function sideAt(n, S, l, w, h) {
  let s = 0;
  if (n.k === 'circle' || rectLike(n)) s = Math.abs(l.x) / (w / 2) >= Math.abs(l.y) / (h / 2) ? (l.x < 0 ? 3 : 1) : (l.y < 0 ? 0 : 2);
  else { let best = -Infinity; S.forEach((q, i) => { const v = q.nx * (l.x - q.mx) + q.ny * (l.y - q.my); if (v > best) { best = v; s = i; } }); }
  const q = S[s];
  return { s, t: clamp((l.x - q.mx) * q.ux + (l.y - q.my) * q.uy, -q.len / 2, q.len / 2) };
}
/* corners on the drawn outline (a rounded corner's middle) */
function vertsOf(n, w, h) {
  if (n.k === 'circle' || n.k === 'dot') return [];
  const P = poly(n, w, h), m = P.length, r = n.rad || 0;
  return P.map((V, i) => {
    if (!r) return { x: V[0], y: V[1] };
    const A = P[(i - 1 + m) % m], B = P[(i + 1) % m], la = Math.hypot(A[0] - V[0], A[1] - V[1]), lb = Math.hypot(B[0] - V[0], B[1] - V[1]), rr = Math.min(r, la / 2.1, lb / 2.1);
    return { x: V[0] + .25 * ((A[0] - V[0]) / la + (B[0] - V[0]) / lb) * rr, y: V[1] + .25 * ((A[1] - V[1]) / la + (B[1] - V[1]) / lb) * rr };
  });
}
function sortSides(n, w, h) {
  const S = sidesOf(n, w, h), V = vertsOf(n, w, h), lists = S.map(() => []), vx = [];
  for (const x of EB.get(n.id) || []) {
    const pin = x.e['q' + x.w];
    if (pin && pin.v != null) { if (pin.v < V.length) { vx.push({ ...x, v: pin.v }); continue; } }
    let s, key;
    if (pin && pin.s != null && pin.s < S.length) { s = pin.s; key = +pin.t || 0; }
    else if (n.k === 'diamond' && V.length) {   /* a diamond is wired at its corners unless told otherwise: the one facing the other end */
      const l = toLocal(n, endPt(x.e, x.w === 'a' ? 'b' : 'a')); let bi = 0, bd = -Infinity;
      V.forEach((q, i) => { const d = q.x * l.x / (w * w) + q.y * l.y / (h * h); if (d > bd) { bd = d; bi = i; } });
      vx.push({ ...x, v: bi }); continue;
    } else { const o = endPt(x.e, x.w === 'a' ? 'b' : 'a'), r = sideAt(n, S, toLocal(n, o), w, h); s = r.s; key = r.t; }
    lists[s].push({ ...x, key });
  }
  lists.forEach(L => L.sort((p, q) => p.key - q.key || p.i - q.i || (p.w < q.w ? -1 : 1)));
  return { S, V, lists, vx };
}
/* offsets of k ports along a side of length len; need = the length they want */
function portOffs(k, len, lay) {
  if (k <= 1 || lay === 'mid') return { o: Array(k).fill(0), need: 0 };
  if (lay === 'ends') {
    const m = PSTEP * .8, need = 2 * m + k * PSTEP, L = Math.max(len, need), a = Math.ceil(k / 2);
    return { o: Array.from({ length: k }, (_, i) => i < a ? -L / 2 + m + i * PSTEP : L / 2 - m - (k - 1 - i) * PSTEP), need };
  }
  const need = (k + 1) * PSTEP, g = Math.max(len, need) / (k + 1);
  return { o: Array.from({ length: k }, (_, i) => -(k - 1) * g / 2 + i * g), need };
}
/* the size a shape needs so its ports fit */
function portGrow(n, w, h) {
  if (!hasPorts(n) || !EB.has(n.id) || n.lay === 'mid') return { w, h };
  const { S, lists } = sortSides(n, w, h);
  if (n.k === 'circle' || rectLike(n)) {
    let W = w, H = h; const k = n.k === 'circle' ? Math.SQRT2 : 1;
    lists.forEach((L, i) => { if (L.length < 2) return; const nd = portOffs(L.length, S[i].len, n.lay).need * k; if (i % 2 === 0) W = Math.max(W, nd); else H = Math.max(H, nd); });
    return { w: W, h: H };
  }
  let f = 1; lists.forEach((L, i) => { if (L.length >= 2) f = Math.max(f, portOffs(L.length, S[i].len, n.lay).need / S[i].len); });
  return { w: w * f, h: h * f };
}
function layoutOf(n) {
  let L = PL.get(n.id); if (L) return L;
  const { w, h } = size(n), { S, V, lists, vx } = sortSides(n, w, h), map = new Map(), pad = bpad(n), lay = n.lay || '';
  lists.forEach((Ls, i) => {
    const { o } = portOffs(Ls.length, S[i].len, lay);
    Ls.forEach((x, j) => { const q = sidePt(S[i], o[j], w, h); map.set(x.e.id + ':' + x.w, { x: q.x + q.nx * pad, y: q.y + q.ny * pad, nx: q.nx, ny: q.ny, leg: lay === 'mid' ? 0 : STUB, s: i, t: clamp(o[j], -S[i].len / 2, S[i].len / 2) }); });
  });
  if (vx.length) {
    const cx = V.reduce((s, q) => s + q.x, 0) / V.length, cy = V.reduce((s, q) => s + q.y, 0) / V.length;
    vx.forEach(x => { const P = V[x.v], d = unit(P.x - cx, P.y - cy); map.set(x.e.id + ':' + x.w, { x: P.x + d.x * pad, y: P.y + d.y * pad, nx: d.x, ny: d.y, leg: 0, v: x.v }); });
  }
  L = { map, S, w, h, pad }; PL.set(n.id, L); return L;
}
/* ports glide: along their side (exact on the outline while the shape resizes), straight across when they change side */
const portAnim = new Map();
let portFrame = 0, portK = 1, portBusy = false, portLastT = 0, portRaf = 0, noAnim = false;
function portTick() { const now = performance.now(); portFrame++; portK = portLastT ? 1 - Math.exp(-Math.min(34, now - portLastT) / 36) : 1; portLastT = now; portBusy = false; }
function animPort(key, q, L) {
  let a = portAnim.get(key);
  if (!a) { portAnim.set(key, { ...q, f: portFrame, m: 0 }); return q; }
  if (a.f !== portFrame) {
    a.f = portFrame;
    const ease = (k, eps) => { a[k] += (q[k] - a[k]) * portK; if (Math.abs(q[k] - a[k]) > eps) portBusy = true; else a[k] = q[k]; };
    ease('leg', .05);
    if (!a.m && q.s != null && a.s === q.s) ease('t', .2);
    else {
      a.m = 1; for (const k of ['x', 'y']) ease(k, .2); for (const k of ['nx', 'ny']) ease(k, .01);
      if (a.x === q.x && a.y === q.y) { a.m = 0; a.s = q.s; a.t = q.t; a.v = q.v; }
    }
  }
  if (!a.m && q.s != null && a.s === q.s) { const p = sidePt(L.S[q.s], a.t, L.w, L.h); a.x = p.x + p.nx * L.pad; a.y = p.y + p.ny * L.pad; a.nx = p.nx; a.ny = p.ny; }
  else if (!a.m) { a.x = q.x; a.y = q.y; a.nx = q.nx; a.ny = q.ny; }
  const u = unit(a.nx, a.ny);
  return { x: a.x, y: a.y, nx: u.x, ny: u.y, leg: a.leg };
}
/* where end w of e meets n: { at (on the outline), d (outward), leg, p (end of the leg, where the line's own path starts) } */
function portTip(e, w, n, cut) {
  if (!hasPorts(n)) return null;
  const L = layoutOf(n);
  let key = e.id + ':' + w, q = L.map.get(key);
  if (!q) { key = e.id + '~:' + w; q = L.map.get(key); }   // the faded original while its preview is shown
  if (!q) return null;
  if (!noAnim) {
    const ak = key + '@' + n.id, tw = portAnim.get(e.id + '~:' + w + '@' + n.id);
    if (!portAnim.has(ak) && tw) portAnim.set(ak, { ...tw, f: -1 });   // a previewed line lands where its preview was
    q = animPort(ak, q, L);
  }
  const at = fromLocal(n, q), d = rotv(q.nx, q.ny, n.rot || 0), leg = q.leg * (1 + Math.max(0, (cut ? cut + 3 : 0) - STUB) / STUB);
  return { at, d, leg, p: { x: at.x + d.x * leg, y: at.y + d.y * leg } };
}
/* once per page: lines pinned to a diamond's side before diamonds wired at corners move to the corner facing their other end */
function diamondCorners() {
  if (doc.dv) return;
  for (const e of doc.edges) for (const w of ['a', 'b']) { const n = e[w] && idx.get(e[w]); if (n && n.k === 'diamond' && e['q' + w] && e['q' + w].v == null) delete e['q' + w]; }
  doc.dv = 1;
}
/* every end on a shape keeps the side and place it entered at, so moving other things never reorders it */
function pinAll() {
  for (const e of doc.edges) {
    if (e.a && e.a === e.b) continue;
    for (const w of ['a', 'b']) {
      const n = e[w] && idx.get(e[w]); if (!hasPorts(n) || e['q' + w]) continue;
      const q = layoutOf(n).map.get(e.id + ':' + w); if (!q) continue;
      e['q' + w] = q.v != null ? { v: q.v } : { s: q.s, t: Math.round(q.t * 10) / 10 };
    }
  }
}
/* the pin for a point near n: a vertex (within VMAG px), else its nearest side; deep inside a big shape: none (side facing the other end) */
function pinAt(n, p) {
  if (!hasPorts(n)) return { pin: null, x: n.x, y: n.y };
  const { w, h } = size(n), l = toLocal(n, p), z = cam.z, V = vertsOf(n, w, h);
  let vi = -1, vd = (n.k === 'diamond' ? VMAG + 16 : VMAG) / z;   // diamonds: corners first
  V.forEach((q, i) => { const dd = Math.hypot(l.x - q.x, l.y - q.y); if (dd < vd) { vd = dd; vi = i; } });
  if (vi >= 0) return { pin: { v: vi }, ...fromLocal(n, V[vi]) };
  const S = sidesOf(n, w, h), r = sideAt(n, S, l, w, h), q = sidePt(S[r.s], r.t, w, h);
  if (inside(n, p) && Math.hypot(l.x - q.x, l.y - q.y) > PMAG / z) return { pin: null, x: n.x, y: n.y };
  return { pin: { s: r.s, t: Math.round(r.t * 10) / 10 }, ...fromLocal(n, q) };
}
/* magnet for line ends: the shape whose outline is within PMAG px of p (dots first, then the topmost) */
function magnetAt(p, skip) {
  const R = PMAG / cam.z; let best = null, bd = Infinity;
  for (let i = doc.nodes.length - 1; i >= 0; i--) {
    const n = doc.nodes[i]; if (n.id === skip) continue;
    let dist;
    if (n.dep?.op === 'circ') dist = Math.abs(Math.hypot(p.x - n.x, p.y - n.y) - size(n).w / 2);
    else if (n.k !== 'dot' && inside(n, p)) dist = 0;
    else { const b = boundary(n, p); dist = Math.max(0, Math.hypot(p.x - n.x, p.y - n.y) - Math.hypot(b.x - n.x, b.y - n.y)); }
    if (dist > R) continue;
    if (n.k === 'dot') dist -= R;
    if (dist < bd) { bd = dist; best = n; }
  }
  return best && { n: best, ...pinAt(best, p) };
}
/* While a line end is snapped onto a shape, everything is drawn as if it were connected: the shape's other ports make room
   and the line shows dashed (ve). Returns { src (the real line, drawn faded), ve, w, list } or null. */
let pvBorn = { key: '', t: 0 };
function previewFor() {
  const m = drag && drag.mag; if (!m) return null;
  let src = null, w = 'b', ve;
  if (drag.t === 'end') { src = drag.e; w = drag.w; ve = { ...src, id: src.id + '~', [w]: m.n.id }; delete ve['p' + w]; if (ve[w === 'a' ? 'b' : 'a'] === m.n.id) return null; }
  else if (drag.t === 'edge' && drag.moved && !(drag.chain?.length > 1) && m.n !== drag.from) {
    ve = { ...edgeStyle(), id: '~new', a: drag.from ? drag.from.id : null, b: m.n.id };
    if (!drag.from) ve.pa = drag.fp; else if (drag.fromPin) ve.qa = drag.fromPin;
  } else return null;
  delete ve['q' + w]; if (m.pin) ve['q' + w] = m.pin;
  const key = ve.id + ':' + w + '@' + m.n.id;
  if (hasPorts(m.n) && !portAnim.has(key)) { const l = toLocal(m.n, drag.p), u = unit(l.x, l.y); portAnim.set(key, { x: l.x, y: l.y, nx: u.x, ny: u.y, leg: 0, m: 1, f: -1 }); }   // slides in from where the end is
  const k = m.n.id + ve.id, now = performance.now(); if (k !== pvBorn.key) pvBorn = { key: k, t: now };
  return { src: src ? src.id : null, ve, w, list: src ? doc.edges.map(e => e === src ? ve : e) : doc.edges.concat([ve]) };
}
const pvAge = () => `animation-delay:${-(performance.now() - pvBorn.t) | 0}ms`;
/* the preview's port becomes the real line's on drop */
function landPort(from, e, w, n) { const t = portAnim.get(from + ':' + w + '@' + n); if (t) portAnim.set(e.id + ':' + w + '@' + n, { ...t, f: -1 }); }
/* ================= constructions: points and circles computed from other objects =================
   n.dep = { op, ... }: the node's place (and a circle's size) is worked out from the objects it names on every render;
   it cannot be dragged, it follows them. ops: mid (e | a,b), pb (e | a,b, s=±1: ends of the perpendicular bisector),
   foot (p, e), refl (p, e), par (p, e), x (e, e2), xlc (e, c, s), xcc (c1, c2, s), ctr (n), circ (c, r: {n} or {x,y}). */
const DEP_IDS = ['e', 'e2', 'p', 'a', 'b', 'n', 'c', 'c1', 'c2'];
const depRefs = d => { const r = []; for (const k of DEP_IDS) if (typeof d[k] === 'string') r.push(d[k]); for (const k of ['c', 'r']) if (d[k] && typeof d[k] === 'object' && d[k].n) r.push(d[k].n); return r; };
function depPos(d) {
  const P = id => { const n = idx.get(id); return n ? { x: n.x, y: n.y } : null; };
  const Ln = id => { const e = edgeById(id); if (!e || (e.a && e.a === e.b)) return null; const A = endPt(e, 'a'), B = endPt(e, 'b'); if ((e.a && !A.n) || (e.b && !B.n)) return null; return Math.hypot(B.x - A.x, B.y - A.y) > 1e-9 ? [A, B] : null; };
  const Ci = id => { const n = idx.get(id); return n ? { x: n.x, y: n.y, r: (n.w + n.h) / 4 } : null; };
  const two = () => d.e ? Ln(d.e) : (P(d.a) && P(d.b) ? [P(d.a), P(d.b)] : null);
  const foot = (p, A, B) => { const dx = B.x - A.x, dy = B.y - A.y, t = ((p.x - A.x) * dx + (p.y - A.y) * dy) / (dx * dx + dy * dy); return { x: A.x + t * dx, y: A.y + t * dy }; };
  switch (d.op) {
    case 'mid': { const l = two(); return l && { x: (l[0].x + l[1].x) / 2, y: (l[0].y + l[1].y) / 2 }; }
    case 'pb': { const l = two(); if (!l) return null; const [A, B] = l; return { x: (A.x + B.x) / 2 - (B.y - A.y) / 2 * d.s, y: (A.y + B.y) / 2 + (B.x - A.x) / 2 * d.s }; }
    case 'foot': { const l = Ln(d.e), q = P(d.p); return l && q && foot(q, ...l); }
    case 'refl': { const l = Ln(d.e), q = P(d.p); if (!l || !q) return null; const f = foot(q, ...l); return { x: 2 * f.x - q.x, y: 2 * f.y - q.y }; }
    case 'par': { const l = Ln(d.e), q = P(d.p); return l && q && { x: q.x + l[1].x - l[0].x, y: q.y + l[1].y - l[0].y }; }
    case 'x': {
      const l = Ln(d.e), m = Ln(d.e2); if (!l || !m) return null;
      const [A, B] = l, [C, D] = m, r = { x: B.x - A.x, y: B.y - A.y }, q = { x: D.x - C.x, y: D.y - C.y }, den = r.x * q.y - r.y * q.x;
      if (Math.abs(den) < 1e-9) return null;
      const t = ((C.x - A.x) * q.y - (C.y - A.y) * q.x) / den; return { x: A.x + t * r.x, y: A.y + t * r.y };
    }
    case 'xlc': {
      const l = Ln(d.e), c = Ci(d.c); if (!l || !c) return null;
      const [A, B] = l, dx = B.x - A.x, dy = B.y - A.y, fx = A.x - c.x, fy = A.y - c.y;
      const a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), cc = fx * fx + fy * fy - c.r * c.r, D = b * b - 4 * a * cc;
      if (D < 0) return null;
      const t = (-b + d.s * Math.sqrt(D)) / (2 * a); return { x: A.x + t * dx, y: A.y + t * dy };
    }
    case 'xcc': {
      const a = Ci(d.c1), b = Ci(d.c2); if (!a || !b) return null;
      const dd = Math.hypot(b.x - a.x, b.y - a.y); if (dd < 1e-9 || dd > a.r + b.r || dd < Math.abs(a.r - b.r)) return null;
      const l = (a.r * a.r - b.r * b.r + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, a.r * a.r - l * l)), ux = (b.x - a.x) / dd, uy = (b.y - a.y) / dd;
      return { x: a.x + ux * l - uy * h * d.s, y: a.y + uy * l + ux * h * d.s };
    }
    case 'ctr': return P(d.n);
    case 'circ': {
      const at = q => q && (q.n ? P(q.n) : q), C = at(d.c), Rp = at(d.r); if (!C || !Rp) return null;
      return { x: C.x, y: C.y, d: Math.max(2, 2 * Math.hypot(Rp.x - C.x, Rp.y - C.y)) };
    }
  }
  return null;
}
function solveDeps() {
  const ds = doc.nodes.filter(n => n.dep); if (!ds.length) return;
  for (let pass = 0; pass < 5; pass++) {
    let ch = false;
    for (const n of ds) {
      const r = depPos(n.dep);
      if (!r) { if (!n.dead) { n.dead = true; ch = true; } continue; }
      if (n.dead) { delete n.dead; ch = true; }
      if (Math.abs(r.x - n.x) > 1e-6 || Math.abs(r.y - n.y) > 1e-6) { n.x = r.x; n.y = r.y; ch = true; }
      if (r.d && Math.abs(r.d - n.w) > 1e-6) { n.w = n.h = r.d; ch = true; }
    }
    if (!ch) break;
  }
}
/* copies keep their construction only when everything it names was copied too (else they become free) */
function remapDep(d, nm, em, off = 0) {
  const o = clone(d);
  for (const k of ['e', 'e2']) if (typeof o[k] === 'string') { if (!em[o[k]]) return null; o[k] = em[o[k]]; }
  for (const k of ['p', 'a', 'b', 'n', 'c', 'c1', 'c2']) if (typeof o[k] === 'string') { if (!nm[o[k]]) return null; o[k] = nm[o[k]]; }
  for (const k of ['c', 'r']) if (o[k] && typeof o[k] === 'object') { if (o[k].n) { if (!nm[o[k].n]) return null; o[k] = { n: nm[o[k].n] }; } else o[k] = { x: o[k].x + off, y: o[k].y + off }; }
  return o;
}
function remapDeps(made, nm, em, off) { for (const m of made) if (m.dep) { const d = remapDep(m.dep, nm, em, off); if (d) m.dep = d; else { delete m.dep; delete m.dead; } } }
const headLen = sw => 6 + sw * 2.4;
const HEADS = ['none', 'vee', 'tri', 'otri', 'two', 'circ', 'ocirc', 'bar', 'hook', 'ray'];
/* head size for a line: a double line gets a head wide enough to cover both rails (like ⇒) */
const railOff = sw => sw * .9 + 1.1;
function headDim(e) {
  const sw = e.sw, L0 = headLen(sw);
  if ((e.shape || 'line') !== 'double') return { L: L0, W: L0 * .42, o: 0 };
  const o = railOff(sw), L = L0 * 1.1 + o * 1.2;
  return { L, W: Math.max(L * .5, o + sw * 2.2), o };
}
/* how far the line stops short of the tip: under a filled head, at a circle, or (double lines) where the rails meet the arms */
function cutFor(t, e) {
  if (!t || t === 'none' || t === 'bar' || t === 'hook' || t === 'ray') return 0;
  const { L, W, o } = headDim(e), sw = e.sw;
  if (t === 'tri' || t === 'otri') return L * .85;
  if (t === 'circ' || t === 'ocirc') return L * .62;
  return o ? L * o / W + sw * .5 : sw * .6;
}
function bez(P, t) { let p = P; while (p.length > 1) { const n = []; for (let i = 0; i < p.length - 1; i++) n.push({ x: p[i].x + (p[i + 1].x - p[i].x) * t, y: p[i].y + (p[i + 1].y - p[i].y) * t }); p = n; } return p[0]; }
/* path through Bezier control points ctrl (2, 3 or 4), drawn plain, double, wavy or zigzag */
function styledPath(ctrl, e, pre) {
  const sh = e.shape || 'line', F = q => `${f2(q.x)},${f2(q.y)}`;
  if (pre) ctrl = [pre.S[0], pre.S[pre.S.length - 1]];
  if (sh === 'line' && pre) return pre.d;
  if (sh === 'line') return ctrl.length === 2 ? `M${F(ctrl[0])}L${F(ctrl[1])}` : ctrl.length === 3 ? `M${F(ctrl[0])}Q${F(ctrl[1])} ${F(ctrl[2])}` : `M${F(ctrl[0])}C${F(ctrl[1])} ${F(ctrl[2])} ${F(ctrl[3])}`;
  const S = pre ? pre.S : [ctrl[0]], N = pre ? S.length - 1 : 160, len = [0];
  for (let i = 1; i <= N; i++) { const q = pre ? S[i] : bez(ctrl, i / N); len.push(len[i - 1] + Math.hypot(q.x - S[i - 1].x, q.y - S[i - 1].y)); if (!pre) S.push(q); }
  const L = len[N];
  if (L < 2) return `M${F(ctrl[0])}L${F(ctrl[ctrl.length - 1])}`;
  const at = s => {
    let lo = 0, hi = N; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (len[m] < s) lo = m; else hi = m; }
    const a = S[lo], b = S[hi], k = (s - len[lo]) / ((len[hi] - len[lo]) || 1), t = unit(b.x - a.x, b.y - a.y);
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, nx: -t.y, ny: t.x };
  };
  const off = (s, o) => { const p = at(s); return { x: p.x + p.nx * o, y: p.y + p.ny * o }; };
  const sw = e.sw;
  if (sh === 'double') {
    const o = railOff(sw), n = Math.max(2, Math.ceil(L / 3)), side = g => 'M' + Array.from({ length: n + 1 }, (_, i) => F(off(L * i / n, o * g))).join('L');
    return side(1) + side(-1);
  }
  const A = 2.2 + sw * .9, lam0 = 9 + sw * 2.2;
  /* straight lead where a head sits, so the head lines up with the line instead of a half wave */
  const lead = t => (!t || t === 'none' || t === 'ray' ? 1 : headLen(sw) * .9 + 2), l0 = Math.min(lead(e.tail), L / 4), l1 = Math.min(lead(e.head), L / 4), span = Math.max(1, L - l0 - l1);
  const lam = span / Math.max(1, Math.round(span / lam0)), ramp = Math.min(lam * .6, span / 3);
  const env = s => Math.max(0, Math.min(1, (s - l0) / ramp, (L - l1 - s) / ramp));
  const pts = [];
  if (sh === 'wave') { const n = Math.max(8, Math.ceil(L / 1.2)); for (let i = 0; i <= n; i++) { const s2 = L * i / n; pts.push(off(s2, A * Math.sin(2 * Math.PI * (s2 - l0) / lam) * env(s2))); } }
  else { const q = lam / 4; pts.push(off(0, 0), off(l0, 0)); for (let k = 1; l0 + k * q < L - l1 - .5; k++) { const v = k % 4 === 1 ? 1 : k % 4 === 3 ? -1 : 0; if (v) pts.push(off(l0 + k * q, A * v * env(l0 + k * q))); } pts.push(off(L - l1, 0), off(L, 0)); }
  return 'M' + pts.map(F).join('L');
}
/* ---------- line routes: arc (bend), Bézier (two handles), S-curve, elbow, rounded elbow ---------- */
const C1D = { t: .3, v: .25 }, C2D = { t: .7, v: .25 };
const frameOf = (A, B) => { const L = Math.hypot(B.x - A.x, B.y - A.y) || 1; return { L, ux: (B.x - A.x) / L, uy: (B.y - A.y) / L, nx: (B.y - A.y) / L, ny: -(B.x - A.x) / L }; };
const ctlPt = (A, B, c) => { const f = frameOf(A, B); return { x: A.x + f.ux * f.L * c.t + f.nx * f.L * c.v, y: A.y + f.uy * f.L * c.t + f.ny * f.L * c.v }; };
const ctlOf = (A, B, p) => { const f = frameOf(A, B), dx = p.x - A.x, dy = p.y - A.y; return { t: Math.round((dx * f.ux + dy * f.uy) / f.L * 1000) / 1000, v: Math.round((dx * f.nx + dy * f.ny) / f.L * 1000) / 1000 }; };
const elbH = (e, A, B) => e.ek ? e.ek === 'h' : Math.abs(B.x - A.x) >= Math.abs(B.y - A.y);
/* a polyline with optionally rounded corners: path text plus dense samples (for wavy / double lines) */
function polyPre(pts, r) {
  const F = q => `${f2(q.x)},${f2(q.y)}`, S = [pts[0]];
  const line = (a, b) => { const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2)); for (let i = 1; i <= n; i++) S.push({ x: a.x + (b.x - a.x) * i / n, y: a.y + (b.y - a.y) * i / n }); };
  let d = 'M' + F(pts[0]), cur = pts[0];
  for (let i = 1; i < pts.length - 1; i++) {
    const V = pts[i], A0 = pts[i - 1], B0 = pts[i + 1], la = Math.hypot(V.x - A0.x, V.y - A0.y), lb = Math.hypot(B0.x - V.x, B0.y - V.y), rr = Math.min(r, la / 2, lb / 2);
    if (rr < .5) { d += 'L' + F(V); line(cur, V); cur = V; continue; }
    const p1 = { x: V.x + (A0.x - V.x) / la * rr, y: V.y + (A0.y - V.y) / la * rr }, p2 = { x: V.x + (B0.x - V.x) / lb * rr, y: V.y + (B0.y - V.y) / lb * rr };
    d += 'L' + F(p1) + 'Q' + F(V) + ' ' + F(p2); line(cur, p1);
    for (let k = 1; k <= 6; k++) S.push(bez([p1, V, p2], k / 6));
    cur = p2;
  }
  const end = pts[pts.length - 1]; d += 'L' + F(end); line(cur, end);
  return { d, S };
}
/* the first direction along a list of points from a (skipping points on top of it) */
function dirAlong(a, list) { for (const q of list) if (Math.hypot(q.x - a.x, q.y - a.y) > .5) return unit(q.x - a.x, q.y - a.y); return { x: 1, y: 0 }; }
/* a core path from A to B (Bézier control points c, or polyline pts) plus the legs out of the shapes (ta / tb) and the head cuts */
function assemble(e, c, pts, r, ta, tb, cs, ce) {
  const la = !!(ta && ta.leg > .05), lb = !!(tb && tb.leg > .05), F = q => `${f2(q.x)},${f2(q.y)}`;
  if (pts) {
    const full = [la ? ta.at : null, ...pts, lb ? tb.at : null].filter(Boolean);
    const P = full[0], Q = full[full.length - 1], dS = dirAlong(P, full.slice(1)), dE = (u => ({ x: -u.x, y: -u.y }))(dirAlong(Q, full.slice(0, -1).reverse()));
    full[0] = { x: P.x + dS.x * cs, y: P.y + dS.y * cs }; full[full.length - 1] = { x: Q.x - dE.x * ce, y: Q.y - dE.y * ce };
    return { d: styledPath(null, e, polyPre(full, r)), P, Q, dS, dE };
  }
  const K = c.slice(), k0 = K[0], k1 = K[K.length - 1];
  const P = la ? ta.at : k0, Q = lb ? tb.at : k1;
  const dS = la ? ta.d : dirAlong(k0, K.slice(1)), dE = lb ? { x: -tb.d.x, y: -tb.d.y } : (u => ({ x: -u.x, y: -u.y }))(dirAlong(k1, K.slice(0, -1).reverse()));
  const P2 = { x: P.x + dS.x * cs, y: P.y + dS.y * cs }, Q2 = { x: Q.x - dE.x * ce, y: Q.y - dE.y * ce };
  if (!la) K[0] = P2; if (!lb) K[K.length - 1] = Q2;
  let d;
  if (!la && !lb) d = styledPath(K, e);
  else if ((e.shape || 'line') === 'line') {
    const cv = K.length === 2 ? 'L' + F(K[1]) : K.length === 3 ? 'Q' + F(K[1]) + ' ' + F(K[2]) : 'C' + F(K[1]) + ' ' + F(K[2]) + ' ' + F(K[3]);
    d = 'M' + F(P2) + (la ? 'L' + F(K[0]) : '') + cv + (lb ? 'L' + F(Q2) : '');
  } else {
    const S = [P2]; if (la) S.push(K[0]);
    const N = K.length === 2 ? 1 : 40; for (let i = 1; i <= N; i++) S.push(bez(K, i / N));
    if (lb) S.push(Q2);
    d = styledPath(null, e, polyPre(S, 0));
  }
  return { d, P, Q, dS, dE };
}
function routeGeom(e, A, B, ta, tb, cs, ce) {
  const r = e.route;
  if (r === 'bez' || r === 's') {
    let c1, c2;
    if (r === 'bez') { c1 = ctlPt(A, B, e.c1 || C1D); c2 = ctlPt(A, B, e.c2 || C2D); }
    else { const h = Math.abs(B.x - A.x) >= Math.abs(B.y - A.y), mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2; c1 = h ? { x: mx, y: A.y } : { x: A.x, y: my }; c2 = h ? { x: mx, y: B.y } : { x: B.x, y: my }; }
    const P = A.n ? boundary(A.n, c1) : { x: A.x, y: A.y }, Q = B.n ? boundary(B.n, c2) : { x: B.x, y: B.y };
    const K = [P, c1, c2, Q], mid = bez(K, .5), a = bez(K, .49), b = bez(K, .51), t = unit(b.x - a.x, b.y - a.y);
    return { ...assemble(e, K, null, 0, ta, tb, cs, ce), C: mid, mid, nrm: { x: t.y, y: -t.x }, side: 1, c1, c2, K };
  }
  const h = elbH(e, A, B), em = e.em ?? .5;
  let pts;
  if (h) { const mx = A.x + (B.x - A.x) * em, P = A.n ? boundary(A.n, { x: mx, y: A.y }) : A, Q = B.n ? boundary(B.n, { x: mx, y: B.y }) : B; pts = [P, { x: mx, y: P.y }, { x: mx, y: Q.y }, Q]; }
  else { const my = A.y + (B.y - A.y) * em, P = A.n ? boundary(A.n, { x: A.x, y: my }) : A, Q = B.n ? boundary(B.n, { x: B.x, y: my }) : B; pts = [P, { x: P.x, y: my }, { x: Q.x, y: my }, Q]; }
  pts = pts.map(q => ({ x: q.x, y: q.y })).filter((q, i, a) => !i || Math.hypot(q.x - a[i - 1].x, q.y - a[i - 1].y) > .3);
  if (pts.length < 2) pts = [{ x: A.x, y: A.y }, { x: B.x, y: B.y }];
  const m = Math.floor((pts.length - 1) / 2), M1 = pts[m], M2 = pts[m + 1] || M1, mid = { x: (M1.x + M2.x) / 2, y: (M1.y + M2.y) / 2 };
  return { ...assemble(e, null, pts, r === 'elbowr' ? 10 : 0, ta, tb, cs, ce), C: mid, mid, nrm: h ? { x: 1, y: 0 } : { x: 0, y: -1 }, side: 1, pts };
}
/* g.A / g.B: where the line's own path starts and ends (the legs' ends on shapes with ports); g.ta / g.tb: the ports */
function edgeGeom(e) {
  const A0 = endPt(e, 'a'), B0 = endPt(e, 'b');
  if (A0.n && A0.n === B0.n) return loopGeom(e, A0.n);
  const cs = cutFor(e.tail, e), ce = cutFor(e.head, e);
  const ta = A0.n ? portTip(e, 'a', A0.n, cs) : null, tb = B0.n ? portTip(e, 'b', B0.n, ce) : null;
  const A = ta ? { x: ta.p.x, y: ta.p.y, n: null } : A0, B = tb ? { x: tb.p.x, y: tb.p.y, n: null } : B0;
  let g;
  if (e.route && e.route !== 'arc') g = routeGeom(e, A, B, ta, tb, cs, ce);
  else {
    const L = Math.hypot(B.x - A.x, B.y - A.y) || 1, nx = (B.y - A.y) / L, ny = -(B.x - A.x) / L;
    const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, bend = e.bend || 0;
    const C = { x: mx + nx * bend * 2, y: my + ny * bend * 2 };
    const P = A.n ? boundary(A.n, bend ? C : B) : { x: A.x, y: A.y };
    const Q = B.n ? boundary(B.n, bend ? C : A) : { x: B.x, y: B.y };
    const mid = bend ? { x: .25 * P.x + .5 * C.x + .25 * Q.x, y: .25 * P.y + .5 * C.y + .25 * Q.y } : { x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2 };
    g = { ...assemble(e, bend ? [P, C, Q] : [P, Q], null, 0, ta, tb, cs, ce), C, mid, nrm: { x: nx, y: ny }, ctr: { x: mx, y: my }, side: bend < 0 ? -1 : 1, K: bend ? [P, C, Q] : [P, Q] };
  }
  g.A = A; g.B = B; g.ta = ta; g.tb = tb;
  return g;
}
function loopGeom(e, n) {
  const la = e.la ?? -90, sp = 26, far = a => ({ x: n.x + Math.cos(a * D2R) * 1e4, y: n.y + Math.sin(a * D2R) * 1e4 });
  const P = boundary(n, far(la - sp)), Q = boundary(n, far(la + sp));
  const k = 30 + Math.min(18, Math.max(size(n).w, size(n).h) * .15), dir = a => ({ x: Math.cos(a * D2R), y: Math.sin(a * D2R) });
  const d1 = dir(la - sp * 1.5), d2 = dir(la + sp * 1.5);
  const c1 = { x: P.x + d1.x * k, y: P.y + d1.y * k }, c2 = { x: Q.x + d2.x * k, y: Q.y + d2.y * k };
  const dS = unit(c1.x - P.x, c1.y - P.y), dE = unit(Q.x - c2.x, Q.y - c2.y);
  const cs = cutFor(e.tail, e), ce = cutFor(e.head, e);
  const P2 = { x: P.x + dS.x * cs, y: P.y + dS.y * cs }, Q2 = { x: Q.x - dE.x * ce, y: Q.y - dE.y * ce };
  const d = styledPath([P2, c1, c2, Q2], e);
  const mid = { x: .125 * P.x + .375 * c1.x + .375 * c2.x + .125 * Q.x, y: .125 * P.y + .375 * c1.y + .375 * c2.y + .125 * Q.y };
  return { d, P, Q, C: mid, dS, dE, mid, nrm: dir(la), loop: true, side: 1, K: [P, c1, c2, Q] };
}
function circPath(cx, cy, r) { const k = .5523 * r, F = (x, y) => `${f2(cx + x)},${f2(cy + y)}`; return `M${F(r, 0)}C${F(r, k)} ${F(k, r)} ${F(0, r)}C${F(-k, r)} ${F(-r, k)} ${F(-r, 0)}C${F(-r, -k)} ${F(-k, -r)} ${F(0, -r)}C${F(k, -r)} ${F(r, -k)} ${F(r, 0)}Z`; }
function headMarkup(t, T, d, sw, col, e) {
  if (!t || t === 'none' || t === 'ray') return '';
  const { L, W } = e ? headDim(e) : { L: headLen(sw), W: headLen(sw) * .42 }, q = { x: -d.y, y: d.x };
  const P = (a, b) => `${f2(T.x + d.x * a + q.x * b)},${f2(T.y + d.y * a + q.y * b)}`;
  const S = `fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
  switch (t) {
    case 'vee': return `<path d="M${P(-L, W)}L${P(0, 0)}L${P(-L, -W)}" ${S}/>`;
    case 'tri': return `<path d="M${P(-L, W)}L${P(0, 0)}L${P(-L, -W)}Z" fill="${col}" stroke="${col}" stroke-width="${f2(sw * .6)}" stroke-linejoin="round"/>`;
    case 'otri': return `<path d="M${P(-L * .95, W)}L${P(0, 0)}L${P(-L * .95, -W)}Z" fill="#ffffff" stroke="${col}" stroke-width="${f2(sw * .85)}" stroke-linejoin="round"/>`;
    case 'two': return `<path d="M${P(-L, W)}L${P(0, 0)}L${P(-L, -W)}M${P(-L * 1.55, W)}L${P(-L * .55, 0)}L${P(-L * 1.55, -W)}" ${S}/>`;
    case 'circ': case 'ocirc': { const r = L * .31; return `<path d="${circPath(T.x - d.x * r, T.y - d.y * r, r)}" fill="${t === 'circ' ? col : '#ffffff'}" stroke="${col}" stroke-width="${f2(sw * .8)}"/>`; }
    case 'hook': { const r = W * .85; return `<path d="M${P(0, 0)}C${P(L * .75, 0)} ${P(L * .75, -2 * r)} ${P(0, -2 * r)}" ${S}/>`; }
    case 'bar': return `<path d="M${P(0, W)}L${P(0, -W)}" ${S}/>`;
  }
  return '';
}
/* a ray end: the line runs on through its last point for one grid step and fades out */
function rayEnds(e, g) {
  const out = [];
  for (const [w, T, d] of [['b', g.Q, g.dE], ['a', g.P, { x: -g.dS.x, y: -g.dS.y }]]) {
    if ((w === 'b' ? e.head : e.tail) !== 'ray' || !T || !d) continue;
    const E = endPt(e, w), S0 = E.n ? boundary(E.n, { x: E.x + d.x * 1e4, y: E.y + d.y * 1e4 }) : { x: T.x, y: T.y };
    const run = Math.max(G - Math.hypot(S0.x - E.x, S0.y - E.y), G * .5);
    out.push({ w, S: S0, F: { x: S0.x + d.x * run, y: S0.y + d.y * run } });
  }
  return out;
}
function edgeMarkup(e, g, interactive) {
  const col = e.color, sw = e.sw;
  let s = `<path class="ep" d="${g.d}" stroke="${col}" stroke-width="${sw}" fill="none" stroke-linecap="round" stroke-linejoin="round" ${dashArr(e.dash, sw)}/>`;
  for (const r of rayEnds(e, g)) {
    /* on the canvas a ray really runs on for ever; image / LaTeX export keep the short fade */
    if (interactive) { const u = unit(r.F.x - r.S.x, r.F.y - r.S.y), L = 1e6; s += `<path class="ep" d="M${f2(r.S.x)},${f2(r.S.y)}L${f2(r.S.x + u.x * L)},${f2(r.S.y + u.y * L)}" stroke="${col}" stroke-width="${sw}" fill="none" ${dashArr(e.dash, sw)}/>`; continue; }
    const id = `rg${e.id}${r.w}x`;
    s += `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f2(r.S.x)}" y1="${f2(r.S.y)}" x2="${f2(r.F.x)}" y2="${f2(r.F.y)}"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>`
      + `<path class="ep" d="M${f2(r.S.x)},${f2(r.S.y)}L${f2(r.F.x)},${f2(r.F.y)}" stroke="url(#${id})" stroke-width="${sw}" fill="none" ${dashArr(e.dash, sw)}/>`;
  }
  s += headMarkup(e.head, g.Q, g.dE, sw, col, e) + headMarkup(e.tail, g.P, { x: -g.dS.x, y: -g.dS.y }, sw, col, e);
  if (!interactive) return s;
  return `<g data-e="${e.id}" class="${sel.has(e.id) ? 'sel' : ''}"><path class="hit" d="${g.d}" stroke-width="14" vector-effect="non-scaling-stroke"/>${s}</g>`;
}
const labOff = (n, w, h) => { if (n.k !== 'tri') return { x: 0, y: 0 }; const d = n.dir || 'up'; return d === 'up' ? { x: 0, y: h / 6 } : d === 'down' ? { x: 0, y: -h / 6 } : d === 'right' ? { x: -w / 6, y: 0 } : { x: w / 6, y: 0 }; };
/* a point on the line's own curve at parameter t (Bézier parameter, or share of the length on a polyline) and the normal on its left */
function curveAt(g, t) {
  let p, a, b;
  if (g.K) { p = bez(g.K, t); a = bez(g.K, Math.max(0, t - .01)); b = bez(g.K, Math.min(1, t + .01)); }
  else {
    const P = g.pts, L = []; let T = 0;
    for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y); L.push(l); T += l; }
    let d = t * T, i = 0; while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; }
    const f = L[i] ? d / L[i] : 0; a = P[i]; b = P[i + 1] || P[i];
    p = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }
  const u = unit(b.x - a.x, b.y - a.y);
  return { p, n: { x: u.y, y: -u.x } };
}
/* nearest place on the curve to q: t, and how far q lies to the left (+) / right (−) */
function nearestT(g, q) {
  let bt = .5, bd = Infinity;
  const at = t => { const c = curveAt(g, t), d = Math.hypot(q.x - c.p.x, q.y - c.p.y); if (d < bd) { bd = d; bt = t; } };
  for (let i = 0; i <= 80; i++) at(i / 80);
  const t0 = bt; for (let i = -10; i <= 10; i++) at(clamp(t0 + i / 800, 0, 1));
  const c = curveAt(g, bt);
  return { t: bt, d: (q.x - c.p.x) * c.n.x + (q.y - c.p.y) * c.n.y, p: c.p };
}
/* which side 'auto' resolves to: outside of the bend, else left of the direction */
const lpSide = (e, g) => { const lp = e.lp || 'auto'; return lp === 'on' ? 0 : lp === 'r' ? -1 : lp === 'l' ? 1 : (g.loop ? 1 : g.side); };
function labelPos(e, g, lw, lh) {
  const s = lpSide(e, g);
  if (g.loop && e.lt == null) { if (!s) return g.mid; const n = g.nrm, off = 5 + Math.abs(n.x) * lw / 2 + Math.abs(n.y) * lh / 2; return { x: g.mid.x + n.x * off, y: g.mid.y + n.y * off }; }
  if (!g.K && !g.pts) return g.mid;
  const c = curveAt(g, e.lt ?? .5);
  if (!s) return c.p;
  const n = { x: c.n.x * s, y: c.n.y * s }, off = 5 + Math.abs(n.x) * lw / 2 + Math.abs(n.y) * lh / 2;
  return { x: c.p.x + n.x * off, y: c.p.y + n.y * off };
}
/* labels outside a shape: n.ol = { t, b, l, r } (above, below, left, right) */
const OL_SIDES = ['t', 'r', 'b', 'l'];
function olBox(n) {
  const G = geo.get(n.id), w = G ? G.w : size(n).w, h = G ? G.h : size(n).h, a = (n.rot || 0) * D2R, c = Math.abs(Math.cos(a)), si = Math.abs(Math.sin(a));
  return { hx: c * w / 2 + si * h / 2, hy: si * w / 2 + c * h / 2 };
}
const OL_GAP = 5;
/* n.oa = { side: deg } puts a label anywhere round the shape (screen angle, 0 = right, 90 = down); none = the middle of its side */
const OL_ANG = { t: -90, r: 0, b: 90, l: 180 };
const olAng = (n, side) => n.oa?.[side] ?? OL_ANG[side];
function olPos(n, side, m) {
  const { hx, hy } = olBox(n), a = olAng(n, side) * D2R, c = Math.cos(a), s = Math.sin(a);
  /* out along the angle until the label's box just clears the shape's box */
  const k = Math.min(Math.abs(c) > 1e-6 ? (hx + OL_GAP + m.w / 2) / Math.abs(c) : Infinity, Math.abs(s) > 1e-6 ? (hy + OL_GAP + m.h / 2) / Math.abs(s) : Infinity);
  return { x: n.x + c * k, y: n.y + s * k };
}
/* the side of n that q is nearest to, judged against the shape's own proportions */
function olSideAt(n, q) { const { hx, hy } = olBox(n), dx = (q.x - n.x) / (hx + 12), dy = (q.y - n.y) / (hy + 12); return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'b' : 't'); }
/* a double-click just outside a shape (within ~26 screen px) aims at that side's outer label */
/* a shape whose box holds p even where its outline does not (the corners round an ellipse or a diamond): writing there means its own text */
function boxHit(p) {
  for (let i = doc.nodes.length - 1; i >= 0; i--) {
    const n = doc.nodes[i]; if (n.k === 'dot' || n.k === 'image' || n.dep?.op === 'circ') continue;
    const { hx, hy } = olBox(n); if (Math.abs(p.x - n.x) <= hx && Math.abs(p.y - n.y) <= hy) return n;
  }
  return null;
}
function outerHit(p) {
  const m = 26 / cam.z;
  for (let i = doc.nodes.length - 1; i >= 0; i--) {
    const n = doc.nodes[i]; if (n.k === 'dot' || n.k === 'text' || n.dep) continue;
    const { hx, hy } = olBox(n), dx = Math.abs(p.x - n.x), dy = Math.abs(p.y - n.y);
    if (dx <= hx + m && dy <= hy + m && (dx > hx || dy > hy)) return { n, side: olSideAt(n, p) };
  }
  return null;
}

/* ================= render ================= */
function render() {
  idx = new Map(doc.nodes.map(n => [n.id, n]));
  solveDeps();
  diamondCorners();
  PV = previewFor(); edgesByNode();
  const eids = new Set(doc.edges.map(e => e.id));
  for (const id of [...sel]) if (!idx.has(id) && !eids.has(id)) sel.delete(id);
  const alive = new Set();
  doc.nodes.forEach((n, i) => {
    alive.add(n.id);
    let el = nodeEls.get(n.id);
    if (!el) { el = document.createElement('div'); el.className = 'node'; el.innerHTML = '<svg></svg><div class="lab"></div>'; nodesL.appendChild(el); nodeEls.set(n.id, el); }
    paintNode(n, el, i);
  });
  for (const [id, el] of nodeEls) if (!alive.has(id)) { el.remove(); nodeEls.delete(id); }
  if (!PV) pinAll();
  drawEdges();
  drawOuter();
  drawOverlay();
  updateBar();
  hint.style.opacity = doc.nodes.length || doc.edges.length ? 0 : 1;
  $('#zUndo').disabled = !undoS.length; $('#zRedo').disabled = !redoS.length;
  queueMM(); scheduleSave();
}
function paintNode(n, el, i) {
  const svg = el.firstChild, lab = el.lastChild;
  const isEd = editing && editing.kind === 'node' && editing.id === n.id;
  const t = n.k === 'image' ? '' : (n.text || '');
  if (!isEd && el._t !== t) { lab.innerHTML = texHTML(t); el._t = t; }
  const tsk = JSON.stringify(n.ts);
  if (el._ts !== tsk) { styleLab(lab, n.ts); el._ts = tsk; }
  lab.hidden = n.k === 'image' || n.k === 'dot';
  el.classList.toggle('dep', !!n.dep); el.classList.toggle('dead', !!n.dead);
  let m;
  if (isEd) m = { w: lab.offsetWidth, h: lab.offsetHeight };
  else if (!t) m = { w: 0, h: 0 };
  else { const key = t + '|' + tsk; m = meas.get(key); if (!m) { m = { w: lab.offsetWidth, h: lab.offsetHeight }; meas.set(key, m); } }
  const need = needSize(n, m);
  const gr = portGrow(n, n.k === 'text' ? Math.max(need.w, 14) : Math.max(n.w, need.w), n.k === 'text' ? Math.max(need.h, 14) : Math.max(n.h, need.h)), w = gr.w, h = gr.h;
  geo.set(n.id, { w, h, need });
  /* free-standing text hides the grid dots behind it (not over another shape, not while writing) */
  el.classList.toggle('bk', n.k === 'text' && !!t && !isEd && !doc.nodes.some(o => o !== n && o.k !== 'text' && Math.abs(o.x - n.x) * 2 < w + (geo.get(o.id)?.w ?? o.w) && Math.abs(o.y - n.y) * 2 < h + (geo.get(o.id)?.h ?? o.h)));
  el.style.cssText = `left:${n.x - w / 2}px;top:${n.y - h / 2}px;width:${w}px;height:${h}px;z-index:${i};transform:rotate(${n.rot || 0}deg)`;
  const { x: sx, y: sy } = labOff(n, w, h);
  lab.style.transform = `translate(calc(-50% + ${f2(sx)}px), calc(-50% + ${f2(sy)}px))`;
  const skey = [n.k, f2(w), f2(h), n.fill, n.stroke, n.sw, n.dbl, n.sd, n.rad, n.dir, n.img].join('|');
  if (el._s !== skey) { svg.setAttribute('width', w); svg.setAttribute('height', h); svg.innerHTML = shapeMarkup(n, w, h, n.id, urlOf); el._s = skey; }
  if (n.img) { const im = svg.querySelector('svg.im'); if (im) { const c = cropOf(n); im.setAttribute('viewBox', `${c.x} ${c.y} ${c.w} ${c.h}`); } }
}
function edgeLabel(e, g, alive) {
  const isEd = editing && editing.kind === 'elab' && editing.id === e.id;
  if (!e.label && !isEd) return;
  alive.add(e.id);
  let el = elabEls.get(e.id);
  if (!el) { el = document.createElement('div'); el.className = 'elab'; el.dataset.e = e.id; elabsL.appendChild(el); elabEls.set(e.id, el); }
  if (!isEd && el._t !== e.label) { el.innerHTML = texHTML(e.label); el._t = e.label; el._m = null; }
  el.style.color = e.lcol || '#1d1d1f';
  if (!el._m || isEd) el._m = { w: el.offsetWidth, h: el.offsetHeight };
  const p = labelPos(e, g, el._m.w, el._m.h);
  el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
  el.classList.toggle('on', lpSide(e, g) === 0);
  el.classList.toggle('sel', sel.has(e.id));
  el.classList.toggle('drag', drag?.t === 'elab' && drag.e === e && !!drag.moved);
}
/* outer labels of every shape: one element per filled side, in the label layer (never rotated with the shape) */
const olEls = new Map();
function drawOuter() {
  const alive = new Set();
  for (const n of doc.nodes) {
    for (const side of OL_SIDES) {
      const isEd = editing && editing.kind === 'olab' && editing.id === n.id && editing.side === side, t = n.ol && n.ol[side];
      if (!t && !isEd) continue;
      const key = n.id + ':' + side; alive.add(key);
      let el = olEls.get(key);
      if (!el) { el = document.createElement('div'); el.className = 'olab'; el.dataset.n = n.id; el.dataset.s = side; elabsL.appendChild(el); olEls.set(key, el); }
      if (!isEd && el._t !== t) { el.innerHTML = texHTML(t); el._t = t; el._m = null; }
      el.style.color = n.ts?.color || '#1d1d1f';
      if (!el._m || isEd) el._m = { w: el.offsetWidth, h: el.offsetHeight };
      const q = olPos(n, side, el._m);
      el.style.left = q.x + 'px'; el.style.top = q.y + 'px';
      el.classList.toggle('sel', sel.has(n.id));
      el.classList.toggle('drag', drag?.t === 'olab' && drag.n === n && !!drag.moved);
    }
  }
  for (const [k, el] of olEls) if (!alive.has(k)) { if (!(editing && editing.lab === el)) { el.remove(); olEls.delete(k); } }
}
const PV_COL = '#5b5bd6';
let pvG = null;   // geometry of the previewed line (the magnet dot sits on its end)
function drawEdges() {
  portTick();
  let s = '';
  const alive = new Set();
  pvG = null;
  for (const e of EL()) {
    const g = edgeGeom(e);
    if (PV && e === PV.ve) { pvG = g; s += `<g class="pvw" style="${pvAge()}">${edgeMarkup({ ...e, color: PV_COL, dash: 'solid', sw: Math.max(1.4, e.sw) }, g, false)}</g>`; continue; }
    egeo.set(e.id, g);
    s += edgeMarkup(e, g, true);
    edgeLabel(e, g, alive);
  }
  if (PV && PV.src) {
    const e = edgeById(PV.src);
    if (e) { const g = edgeGeom(e); egeo.set(e.id, g); s += `<g class="pvsrc" style="${pvAge()}">${edgeMarkup(e, g, true)}</g>`; edgeLabel(e, g, alive); }
  }
  for (const [id, el] of elabEls) if (!alive.has(id)) { el.remove(); elabEls.delete(id); }
  esvg.innerHTML = s;
  if (portBusy && !portRaf) portRaf = requestAnimationFrame(() => { portRaf = 0; drawEdges(); drawOverlay(); });
}

/* ---------- overlay (screen space) ---------- */
const S = p => ({ x: p.x * cam.z + cam.x, y: p.y * cam.z + cam.y });
const W = (sx, sy) => ({ x: (sx - cam.x) / cam.z, y: (sy - cam.y) / cam.z });
const pts = a => a.map(p => { const q = S(p); return `${f2(q.x)},${f2(q.y)}`; }).join(' ');
const RS_CUR = ['ns', 'nesw', 'ew', 'nwse'];
function curFor(dx, dy, rot) { let a = (Math.atan2(dy, dx) * R2D + rot + 360 + 90) % 180; return RS_CUR[Math.round(a / 45) % 4] + '-resize'; }

function drawOverlay() {
  let s = '';
  const z = cam.z, ns = selNodes(), es = selEdges();
  if (crop) { ov.innerHTML = cropOverlay(); return; }
  // hover anchors: drag one out to connect
  if (hov && !drag && tool === 'select' && !(ns.length === 1 && ns[0] === hov) && idx.has(hov.id) && hov.k !== 'image') {
    const { w, h } = size(hov), o = 13 / z;
    for (const [x, y] of [[0, -h / 2 - o], [w / 2 + o, 0], [0, h / 2 + o], [-w / 2 - o, 0]]) {
      const q = S(fromLocal(hov, { x, y }));
      s += `<circle class="o-anc h" data-h="anc" cx="${f2(q.x)}" cy="${f2(q.y)}" r="4.5"/>`;
    }
  }
  if ((tool === 'edge' || drag?.t === 'edge' || drag?.t === 'end' || wirePend) && !drag?.mag && (drag?.target || (tool === 'edge' && hov))) {
    const t = drag?.target || hov, c = corners(t, 4 / z);
    s += `<polygon class="o-hot" points="${pts(c)}"/>`;
  }
  /* end handles where lines meet the selected shapes (drag along the shape, onto another one, or off it) */
  const pend = [];
  /* writing a label outside a shape: no box, handles or port dots round it */
  const olEd = editing?.kind === 'olab';
  if ((!drag || drag.t === 'end') && ns.length && ns.length <= 12 && !olEd) {
    const nid = new Set(ns.map(n => n.id));
    for (const e of doc.edges) {
      if (sel.has(e.id) || (e.a && e.a === e.b)) continue;
      const g = egeo.get(e.id); if (!g || g.loop) continue;
      for (const [w, P] of [['a', g.P], ['b', g.Q]]) if (nid.has(e[w]) || (drag?.t === 'end' && drag.e === e && drag.w === w)) pend.push([e.id, w, S(P)]);
    }
  }
  // selection
  if (ns.length > 1) {
    for (const n of ns) s += `<polygon class="o-box" points="${pts(corners(n, 2 / z))}" opacity=".55"/>`;
    const bb = bboxOf(ns.flatMap(n => corners(n))), a = S({ x: bb.l, y: bb.t }), b = S({ x: bb.r, y: bb.b });
    s += `<rect class="o-grp" x="${f2(a.x - 6)}" y="${f2(a.y - 6)}" width="${f2(b.x - a.x + 12)}" height="${f2(b.y - a.y + 12)}" rx="4"/>`;
    if (!drag || drag.t === 'rot') {
      const cx = (a.x + b.x) / 2, ry = a.y - 30;
      s += `<line class="o-stem" x1="${f2(cx)}" y1="${f2(a.y - 6)}" x2="${f2(cx)}" y2="${f2(ry)}"/><circle class="o-rot h ${drag?.t === 'rot' ? 'on' : ''}" data-h="rot" cx="${f2(cx)}" cy="${f2(ry)}" r="5"/>`;
    }
  } else if (ns.length === 1 && !olEd) {
    const n = ns[0], { w, h } = size(n), p = 3 / z, a = w / 2 + p, b = h / 2 + p, r = n.rot || 0;
    s += `<polygon class="o-box" points="${pts(corners(n, p))}"/>`;
    if ((!drag || drag.t === 'rs' || drag.t === 'rot') && !n.dep) {
      const hs = n.k === 'text' || n.k === 'dot' ? [[-1, -1], [1, -1], [1, 1], [-1, 1]] : [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];
      for (const [hx, hy] of hs) {
        if (!hx && w * z < 26 || !hy && h * z < 26) continue;
        const q = S(fromLocal(n, { x: hx * a, y: hy * b }));
        if ((!hx || !hy) && pend.some(x => Math.hypot(x[2].x - q.x, x[2].y - q.y) < 9)) continue;   // a port sits there
        s += `<circle class="o-hd h" data-h="rs" data-d="${hx},${hy}" cx="${f2(q.x)}" cy="${f2(q.y)}" r="4" style="cursor:${curFor(hx, hy, r)}"/>`;
      }
      const top = S(fromLocal(n, { x: 0, y: -b })), knob = S(fromLocal(n, { x: 0, y: -b - 24 / z }));
      s += `<line class="o-stem" x1="${f2(top.x)}" y1="${f2(top.y)}" x2="${f2(knob.x)}" y2="${f2(knob.y)}"/><circle class="o-rot h ${drag?.t === 'rot' ? 'on' : ''}" data-h="rot" cx="${f2(knob.x)}" cy="${f2(knob.y)}" r="5"/>`;
    }
  }
  if (drag?.t === 'rot') {
    const c = S(drag.c), a = drag.shown ?? 0, d = { x: Math.sin(a * D2R), y: -Math.cos(a * D2R) }, L = 2000;
    if (drag.snapped) s += `<line class="o-aguide" x1="${f2(c.x - d.x * L)}" y1="${f2(c.y - d.y * L)}" x2="${f2(c.x + d.x * L)}" y2="${f2(c.y + d.y * L)}"/>`;
    const txt = `${Math.round(((a % 360) + 540) % 360 - 180)}°`, bw = 12 + txt.length * 6.5;
    s += `<g class="o-badge ${drag.snapped ? 'snap' : ''}" transform="translate(${f2(drag.sx + 18)},${f2(drag.sy - 18)})"><rect x="${-bw / 2}" y="-10" width="${bw}" height="20" rx="6"/><text>${txt}</text></g>`;
  }
  // edges
  for (const e of es) {
    const g = egeo.get(e.id) || edgeGeom(e), P = S(g.P), Q = S(g.Q), M = S(g.mid);
    if (g.c1 && e.route === 'bez') {
      if (!drag || drag.t === 'ctl') { const c1 = S(g.c1), c2 = S(g.c2); s += `<line class="o-ctl" x1="${f2(P.x)}" y1="${f2(P.y)}" x2="${f2(c1.x)}" y2="${f2(c1.y)}"/><line class="o-ctl" x1="${f2(Q.x)}" y1="${f2(Q.y)}" x2="${f2(c2.x)}" y2="${f2(c2.y)}"/><rect class="o-bend o-cpt h" data-h="c1" data-e="${e.id}" x="${f2(c1.x - 4.5)}" y="${f2(c1.y - 4.5)}" width="9" height="9" rx="2.5"/><rect class="o-bend o-cpt h" data-h="c2" data-e="${e.id}" x="${f2(c2.x - 4.5)}" y="${f2(c2.y - 4.5)}" width="9" height="9" rx="2.5"/>`; }
    } else if (g.pts) { if (!drag || drag.t === 'ctl') s += `<circle class="o-bend h" data-h="elb" data-e="${e.id}" cx="${f2(M.x)}" cy="${f2(M.y)}" r="5" style="cursor:${elbH(e, g.A || endPt(e, 'a'), g.B || endPt(e, 'b')) ? 'ew-resize' : 'ns-resize'}"/>`; }
    else if (g.c1) { /* S-curve: nothing to drag */ }
    else if (!drag || drag.t === 'bend' || drag.t === 'loop') s += `<circle class="o-bend h" data-h="${g.loop ? 'loop' : 'bend'}" data-e="${e.id}" cx="${f2(M.x)}" cy="${f2(M.y)}" r="5"/>`;
    if (!g.loop && (!drag || drag.t === 'end')) {
      s += `<circle class="o-ep h ${e.a ? '' : 'free'}" data-h="end" data-w="a" data-e="${e.id}" cx="${f2(P.x)}" cy="${f2(P.y)}" r="4.5"/>`;
      s += `<circle class="o-ep h ${e.b ? '' : 'free'}" data-h="end" data-w="b" data-e="${e.id}" cx="${f2(Q.x)}" cy="${f2(Q.y)}" r="4.5"/>`;
    }
  }
  for (const [id, w, q] of pend) s += `<circle class="o-ep o-pend h" data-h="end" data-w="${w}" data-e="${id}" cx="${f2(q.x)}" cy="${f2(q.y)}" r="3.6"/>`;
  if (drag?.mag && PV && pvG) { const q = S(PV.w === 'a' ? pvG.P : pvG.Q); s += `<circle class="o-mag" cx="${f2(q.x)}" cy="${f2(q.y)}" r="6" style="${pvAge()}"/>`; }
  // drags in progress
  if (drag?.t === 'elab' && drag.moved) { const g = egeo.get(drag.e.id); if (g && (g.K || g.pts)) { const q = S(curveAt(g, drag.e.lt ?? .5).p); s += `<circle class="o-lt ${drag.e.lt == null ? 'mid' : ''}" cx="${f2(q.x)}" cy="${f2(q.y)}" r="3.2"/>`; } }
  if (drag?.t === 'olab' && drag.moved) { const n = drag.n, { hx, hy } = olBox(n); for (const [sd, x, y] of [['t', 0, -hy], ['r', hx, 0], ['b', 0, hy], ['l', -hx, 0]]) { const q = S({ x: n.x + x, y: n.y + y }); s += `<circle class="o-lt ${sd === drag.side ? 'mid' : ''}" cx="${f2(q.x)}" cy="${f2(q.y)}" r="3.2"/>`; } }
  if (drag?.t === 'marq') {
    const a = S(drag.s), b = S(drag.p);
    s += `<rect class="o-marq" x="${f2(Math.min(a.x, b.x))}" y="${f2(Math.min(a.y, b.y))}" width="${f2(Math.abs(b.x - a.x))}" height="${f2(Math.abs(b.y - a.y))}" rx="2"/>`;
  }
  if (drag?.t === 'lasso' && drag.path.length > 1) s += `<polygon class="o-lasso" points="${pts(drag.path)}"/>`;
  if (drag?.t === 'create' && drag.moved && drag.box) {
    const B = drag.box, a = S({ x: B.l, y: B.t }), b = S({ x: B.r, y: B.b }), w = b.x - a.x, h = b.y - a.y;
    s += `<rect class="o-ghostbox" x="${f2(a.x)}" y="${f2(a.y)}" width="${f2(w)}" height="${f2(h)}" rx="4"/>`;
    const txt = `${Math.round(B.r - B.l)} × ${Math.round(B.b - B.t)}`, bw = 14 + txt.length * 6.3;
    s += `<g class="o-badge" transform="translate(${f2(b.x + 10 + bw / 2)},${f2(b.y + 14)})"><rect x="${-bw / 2}" y="-10" width="${bw}" height="20" rx="6"/><text>${txt}</text></g>`;
  }
  const ghostFrom = drag?.t === 'edge' ? drag : (wirePend && lastPtr ? { from: typeof wirePend === 'string' ? idx.get(wirePend) : null, fp: typeof wirePend === 'object' ? wirePend : null, p: lastPtr, target: hov } : null);
  if (wirePend && typeof wirePend === 'object' && !drag) { const q = S(wirePend); s += `<circle class="o-comp-c" cx="${f2(q.x)}" cy="${f2(q.y)}" r="3"/>`; }
  if (ghostFrom && ghostFrom.p && (drag?.moved || !drag) && !(drag?.mag && PV)) {
    const tgt = ghostFrom.target, to = tgt && tgt !== ghostFrom.from ? tgt : null;
    const end = to ? { x: to.x, y: to.y } : ghostFrom.p;
    const a = ghostFrom.from ? boundary(ghostFrom.from, end) : ghostFrom.fp;
    const b = to ? boundary(to, a) : end;
    if (a) { const A = S(a), B = S(b); s += `<line class="o-ghost" x1="${f2(A.x)}" y1="${f2(A.y)}" x2="${f2(B.x)}" y2="${f2(B.y)}"/>`; }
  }
  {
    const ln = (a, b, c) => { const A = S(a), B = S(b); s += `<line class="o-ghost ${c}" x1="${f2(A.x)}" y1="${f2(A.y)}" x2="${f2(B.x)}" y2="${f2(B.y)}"/>`; };
    if (!drag && (fanOn() || parMode) && lastPtr) {
      const t = hov && idx.has(hov.id) ? hov : null;
      if (parMode && t) for (const [a, b] of parTargets(t)) ln(boundary(a, b), boundary(b, a), 'fan par');
      else if (parMode) for (const a of fanSources(null)) ln(boundary(a, lastPtr), lastPtr, 'fan faint');
      else if (t) for (const a of fanSources(t)) ln(boundary(a, t), boundary(t, a), 'fan');
      else for (const a of fanSources(null)) ln(boundary(a, lastPtr), lastPtr, 'fan faint');
    }
    if (drag?.t === 'edge' && drag.moved && drag.from && drag.chain?.length) {
      const seq = [drag.from, ...drag.chain];
      for (let i = 1; i < seq.length; i++) ln(boundary(seq[i - 1], seq[i]), boundary(seq[i], seq[i - 1]), 'chain');
    }
    if (nbOn) {
      const ph = `animation-delay:-${Math.round((performance.now() - nbOn) % 1100)}ms`, rings = new Map(), hot = new Set();
      selNodes().forEach((n, i) => {
        const c = NB_COLS[i % NB_COLS.length], q = S(n), { w, h } = size(n);
        s += `<ellipse class="o-nbsrc" cx="${f2(q.x)}" cy="${f2(q.y)}" rx="${f2(w / 2 * z + 5)}" ry="${f2(h / 2 * z + 5)}" style="--c:${c}"/>`;
        for (const e2 of doc.edges) {
          const o = e2.a === n.id ? e2.b : e2.b === n.id ? e2.a : null; if (!o) continue;
          hot.add(e2.id); if (o === n.id) continue;
          const L = rings.get(o) || []; if (!L.includes(c)) L.push(c); rings.set(o, L);
        }
      });
      for (const [id, cs] of rings) {
        const m = idx.get(id); if (!m) continue; const q = S(m), { w, h } = size(m);
        cs.forEach((c, j) => { s += `<ellipse class="o-nb" cx="${f2(q.x)}" cy="${f2(q.y)}" rx="${f2(w / 2 * z + 7 + j * 4)}" ry="${f2(h / 2 * z + 7 + j * 4)}" style="--c:${c};${ph.replace(/-(\d+)ms/, (_, v) => '-' + (+v + j * 140) + 'ms')}"/>`; });
      }
      $$('#edges [data-e]').forEach(el => el.classList.toggle('nbw', hot.has(el.dataset.e)));
    } else $$('#edges .nbw').forEach(el => el.classList.remove('nbw'));
  }
  for (const gd of guides) { const a = S(gd[0]), b = S(gd[1]); s += `<line class="o-guide" x1="${f2(a.x)}" y1="${f2(a.y)}" x2="${f2(b.x)}" y2="${f2(b.y)}"/>`; }
  /* compass: a light circle from the centre to the pointer (or to the shape under it) */
  const cp = drag?.t === 'compass' && drag.moved ? { c: drag.c, p: drag.p } : compassPend && tool === 'compass' && compassAt ? { c: compassPend, p: compassAt } : null;
  if (cp) {
    const C = refPt(cp.c), r0 = compassRef(cp.p, cp.c), Rp = refPt(r0), sc = S(C), sr = S(Rp), rr = Math.hypot(Rp.x - C.x, Rp.y - C.y) * z;
    s += `<circle class="o-comp" cx="${f2(sc.x)}" cy="${f2(sc.y)}" r="${f2(rr)}"/><line class="o-comp-r" x1="${f2(sc.x)}" y1="${f2(sc.y)}" x2="${f2(sr.x)}" y2="${f2(sr.y)}"/><circle class="o-comp-c" cx="${f2(sc.x)}" cy="${f2(sc.y)}" r="3"/><circle class="o-comp-c" cx="${f2(sr.x)}" cy="${f2(sr.y)}" r="${r0.n ? 4 : 2.5}"/>`;
  } else if (tool === 'compass' && hov && idx.has(hov.id)) { const q = S(hov); s += `<circle class="o-comp-c" cx="${f2(q.x)}" cy="${f2(q.y)}" r="3"/>`; }
  ov.innerHTML = s;
}

/* ================= camera ================= */
function applyCam() {
  world.style.transform = `translate(${cam.x}px,${cam.y}px) scale(${cam.z})`;
  const st = G * cam.z, ox = cam.x - st / 2, oy = cam.y - st / 2, r = clamp(1.1 * Math.sqrt(cam.z), .8, 1.6);
  const dot = (rr, c) => `radial-gradient(circle, ${c} ${rr}px, transparent ${rr + .7}px)`;
  if (prefs.grid === 'half' && st >= 18) {
    vp.style.setProperty('--gi', `${dot(r, '#b3b3ac')}, ${dot(r * .62, '#cfcfc9')}`);
    vp.style.setProperty('--gs', `${st}px ${st}px, ${st / 2}px ${st / 2}px`);
    vp.style.setProperty('--gp', `${ox}px ${oy}px, ${cam.x - st / 4}px ${cam.y - st / 4}px`);
  } else {
    vp.style.setProperty('--gi', st < 9 ? 'none' : dot(r, '#b3b3ac'));
    vp.style.setProperty('--gs', `${st}px ${st}px`);
    vp.style.setProperty('--gp', `${ox}px ${oy}px`);
  }
  $('#zPct').textContent = Math.round(cam.z * 100) + '%';
  drawOverlay(); placeBar(); queueMM();
}
function zoomAt(f, sx, sy) {
  const nz = clamp(cam.z * f, .1, 8), k = nz / cam.z;
  cam.x = sx - (sx - cam.x) * k; cam.y = sy - (sy - cam.y) * k; cam.z = nz; applyCam();
}
let flyRaf = 0;
function flyTo(t, ms = 380) {
  cancelAnimationFrame(flyRaf);
  const s = { ...cam }, t0 = performance.now(), ease = x => 1 - Math.pow(1 - x, 3);
  const tick = now => {
    const k = ease(Math.min(1, (now - t0) / ms));
    cam.x = s.x + (t.x - s.x) * k; cam.y = s.y + (t.y - s.y) * k; cam.z = s.z + (t.z - s.z) * k; applyCam();
    if (k < 1) flyRaf = requestAnimationFrame(tick);
  };
  flyRaf = requestAnimationFrame(tick);
}
function contentBox(only) {
  const ns = only || doc.nodes, ps = ns.flatMap(n => corners(n));
  for (const e of doc.edges) if (!only || sel.has(e.id)) { const g = egeo.get(e.id) || edgeGeom(e); ps.push(g.P, g.Q, g.mid); }
  return ps.length ? bboxOf(ps) : null;
}
function fit() {
  const b = contentBox(); if (!b) { flyTo({ x: innerWidth / 2, y: innerHeight / 2, z: 1 }); return; }
  const pad = 90, z = clamp(Math.min((innerWidth - pad * 2) / Math.max(b.w, 1), (innerHeight - pad * 2 - 60) / Math.max(b.h, 1)), .1, 2);
  flyTo({ x: innerWidth / 2 - b.cx * z, y: innerHeight / 2 - 10 - b.cy * z, z });
}

/* ================= history, storage & pages ================= */
const snap = () => JSON.stringify(doc);
function commit(before) {
  if (before == null || before === snap()) return;
  undoS.push(before); if (undoS.length > 200) undoS.shift(); redoS = []; render();
}
function mutate(fn) { if (lockedStop()) return; const b = snap(); fn(); render(); commit(b); }
function undo() { if (lockedStop() || !undoS.length) return; endEdit(); redoS.push(snap()); doc = JSON.parse(undoS.pop()); render(); refreshPP(); }
function redo() { if (lockedStop() || !redoS.length) return; endEdit(); undoS.push(snap()); doc = JSON.parse(redoS.pop()); render(); refreshPP(); }

let ws = { tabs: [], active: 0 }, armed = -1;
const curTab = () => ws.tabs[ws.active];
const isLocked = () => !!curTab()?.locked;
function lockedStop() {
  if (!isLocked()) return false;
  toast('This page is locked — press K to unlock', 1600);
  const b = $('#btnLock'); b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge');
  return true;
}
const newTabObj = (name, d) => ({ id: 't' + uid(), name, doc: d || { nodes: [], edges: [] }, cam: null, locked: false });
function syncTab() { const t = curTab(); if (!t) return; t.doc = doc; t.cam = { ...cam }; t._u = undoS; t._r = redoS; }
function loadTab(anim) {
  const t = curTab(); doc = t.doc; doc.nodes ||= []; doc.edges ||= [];
  cam = t.cam ? { ...t.cam } : { x: innerWidth / 2, y: innerHeight / 2, z: 1 };
  undoS = t._u ||= []; redoS = t._r ||= [];
  sel.clear(); hov = null; wirePend = null; crop = null;
  closePP(); syncLock(); drawTabs(); render(); applyCam();
  if (anim) { world.classList.remove('tabin'); void world.offsetWidth; world.classList.add('tabin'); }
}
const uniqueName = n => { let m = n || 'Page', i = 2; while (ws.tabs.some(t => t.name === m)) m = `${n} ${i++}`; return m; };
function nextName() { let i = ws.tabs.length + 1; while (ws.tabs.some(t => t.name === 'Page ' + i)) i++; return 'Page ' + i; }
function switchTab(i) { if (i === ws.active || !ws.tabs[i]) return; endEdit(); if (crop) endCrop(); syncTab(); ws.active = i; loadTab(true); scheduleSave(); }
function addTab(d, name) {
  endEdit(); syncTab();
  ws.tabs.splice(ws.active + 1, 0, newTabObj(uniqueName(name || nextName()), d)); ws.active++;
  loadTab(true); if (d) fit(); scheduleSave();
}
function dupTab(i) { syncTab(); const t = ws.tabs[i]; ws.tabs.splice(i + 1, 0, { ...newTabObj(uniqueName(t.name + ' copy'), clone(t.doc)), cam: t.cam && { ...t.cam } }); ws.active = i + 1; loadTab(true); scheduleSave(); }
function moveTab(i, d) {
  const j = i + d; if (j < 0 || j >= ws.tabs.length) return;
  syncTab(); const a = ws.tabs; [a[i], a[j]] = [a[j], a[i]];
  if (ws.active === i) ws.active = j; else if (ws.active === j) ws.active = i;
  drawTabs(); scheduleSave();
}
function closeTab(i) {
  const t = ws.tabs[i]; if (t.locked) { toast('Unlock the page first'); return; }
  syncTab();
  if (ws.tabs.length === 1) { t.doc = { nodes: [], edges: [] }; t._u = []; t._r = []; loadTab(true); scheduleSave(); return; }
  ws.tabs.splice(i, 1);
  if (i < ws.active) ws.active--; else if (ws.active >= ws.tabs.length) ws.active = ws.tabs.length - 1;
  loadTab(true); scheduleSave();
}
function toggleLock(i = ws.active) {
  const t = ws.tabs[i]; if (!t) return;
  t.locked = !t.locked;
  if (i === ws.active) { endEdit(); if (crop) endCrop(); sel.clear(); wirePend = null; syncLock(); render(); toast(t.locked ? 'Page locked: view only' : 'Page unlocked', 1200); }
  drawTabs(); scheduleSave(); drawSub();
}
function syncLock() { const l = isLocked(); $('#btnLock').classList.toggle('on', l); $('#btnLock').title = l ? 'Unlock this page (K)' : 'Lock this page (K)'; vp.classList.toggle('locked', l); }
function drawTabs() {
  const tr = $('#tabs .tab-track');
  tr.innerHTML = ws.tabs.map((t, i) => `<div class="tab ${i === ws.active ? 'on' : ''} ${ws.tabs.length === 1 ? 'solo' : ''}" data-i="${i}" title="Double-click to rename · right-click for more">${t.locked ? `<span class="tlock">${IC.lockS}</span>` : ''}<span class="tname">${esc(t.name)}</span>${ws.tabs.length > 1 ? `<button class="tx" data-x="${i}" title="Delete page">${IC.closeS}</button>` : ''}</div>`).join('');
  tr.querySelector('.tab.on')?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
}
function renameTab(i) {
  const el = $(`#tabs .tab[data-i="${i}"] .tname`); if (!el) return;
  const inp = document.createElement('input'); inp.className = 'tren'; inp.value = ws.tabs[i].name; inp.size = Math.max(3, inp.value.length);
  el.replaceWith(inp); inp.focus(); inp.select();
  const done = ok => { inp.onblur = null; if (ok && inp.value.trim()) ws.tabs[i].name = inp.value.trim().slice(0, 60); drawTabs(); scheduleSave(); };
  inp.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') done(true); if (e.key === 'Escape') done(false); };
  inp.oninput = () => (inp.size = Math.max(3, inp.value.length));
  inp.onblur = () => done(true);
  inp.onpointerdown = e => e.stopPropagation();
}
function tabMenu(i, x, y) {
  const t = ws.tabs[i];
  showMenu(x, y, [
    { t: 'Rename', ic: IC.label, f: () => renameTab(i) },
    { t: 'Duplicate page', ic: IC.dup, f: () => dupTab(i) },
    { t: t.locked ? 'Unlock page' : 'Lock page', k: 'K', ic: IC.lock, f: () => toggleLock(i) },
    '-',
    { t: 'Move left', f: () => moveTab(i, -1) },
    { t: 'Move right', f: () => moveTab(i, 1) },
    { t: 'Export page (.figura)', ic: IC.exp.replace(/width="18" height="18"/, 'width="16" height="16"'), f: () => saveFile([t]) },
    '-',
    { t: 'New page', ic: IC.plus, f: () => addTab() },
    { t: 'Delete page', ic: IC.trash, danger: true, f: () => closeTab(i) },
  ]);
}
$('#tabs').addEventListener('click', e => {
  const x = e.target.closest('.tx');
  if (x) {
    e.stopPropagation();
    const i = +x.dataset.x, t = ws.tabs[i], has = (i === ws.active ? doc : t.doc).nodes.length;
    if (t.locked) { toast('Unlock the page first'); return; }
    if (has && armed !== i) { armed = i; x.classList.add('arm'); x.textContent = 'Delete?'; setTimeout(() => { if (armed === i) { armed = -1; drawTabs(); } }, 2600); return; }
    armed = -1; closeTab(i); return;
  }
  if (e.target.closest('.tadd')) { addTab(); return; }
  const tb = e.target.closest('.tab'); if (tb && !e.target.closest('.tren')) switchTab(+tb.dataset.i);
});
$('#tabs').addEventListener('dblclick', e => { const tb = e.target.closest('.tab'); if (tb && !e.target.closest('.tx')) renameTab(+tb.dataset.i); });
$('#tabs').addEventListener('contextmenu', e => { const tb = e.target.closest('.tab'); if (!tb) return; e.preventDefault(); tabMenu(+tb.dataset.i, e.clientX, e.clientY); });
$('#tabs').addEventListener('wheel', e => { const tr = $('#tabs .tab-track'); if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { tr.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });

let saveT = 0, warned = false;
function scheduleSave() { clearTimeout(saveT); saveT = setTimeout(save, 350); }
function assetsOf(tabs) { const u = {}; for (const t of tabs) for (const n of (t === curTab() ? doc : t.doc).nodes) if (n.img && assets[n.img]) u[n.img] = assets[n.img]; return u; }
const wsData = tabs => ({ figura: 2, tabs: tabs.map(t => ({ id: t.id, name: t.name, doc: t === curTab() ? doc : t.doc, cam: t === curTab() ? cam : t.cam, locked: !!t.locked })), active: Math.max(0, tabs.indexOf(curTab())), assets: assetsOf(tabs) });
function save() {
  syncTab();
  if (!lsSet(LS.ws, wsData(ws.tabs)) && !warned) { warned = true; toast('Too large to autosave (big pictures) — save a .figura file'); }
}
function load() {
  const d = lsGet(LS.ws);
  if (d && d.tabs?.length) {
    ws = { tabs: d.tabs.map(t => ({ ...newTabObj(t.name, t.doc), id: t.id, cam: t.cam, locked: !!t.locked })), active: clamp(d.active || 0, 0, d.tabs.length - 1) };
    assets = d.assets || {};
  } else {
    const o = lsGet(LS.doc);
    ws = { tabs: [newTabObj('Page 1', o?.doc)], active: 0 };
    if (o) { assets = o.assets || {}; ws.tabs[0].cam = o.cam; }
  }
}
/* ================= nodes & edges ================= */
function newNode(k, x, y, over = {}) {
  const d = prefs.defs[k] || {};
  const n = { id: 'n' + uid(), k, x, y, rot: 0, text: '', ...clone(KDEF[k]) };
  for (const key of STYLE_KEYS) if (d[key] !== undefined) n[key] = d[key];
  if (k === 'dot' && d.w > 0) n.w = n.h = d.w;
  if (k === 'diamond' && d.w > 0 && d.h > 0) { n.w = d.w; n.h = d.h; }
  const st = stamp && stamp.k === k && tool === k ? stamp.s || {} : null;
  if (st) {
    for (const key of STYLE_KEYS) if (st[key] !== undefined) n[key] = st[key];
    if (st.w > 0) { n.w = st.w; n.h = st.h > 0 ? st.h : st.w; }
    if (st.text) n.text = st.text;
  }
  Object.assign(n, over);
  n.ts = { ...TS, ...(d.ts || {}), ...(st?.ts || {}), ...(over.ts || {}) };
  return n;
}
function remember(n, key, v) {
  const d = prefs.defs[n.k] ||= {};
  if (key.startsWith('ts.')) (d.ts ||= {})[key.slice(3)] = v; else d[key] = v;
  savePrefs();
}
const edgeStyle = () => ({ ...edgeBase(), ...(stamp && stamp.k === 'edge' && tool === 'edge' ? Object.fromEntries(Object.entries(stamp.s || {}).filter(([k]) => ['dash', 'sw', 'color', 'head', 'tail', 'shape', 'route'].includes(k))) : {}) });
const edgeBase = () => ({ dash: prefs.edge.dash, sw: prefs.edge.sw || 1.4, color: prefs.edge.color || '#1d1d1f',
  head: prefs.edge.head ?? 'vee', tail: prefs.edge.tail || 'none', shape: prefs.edge.shape || 'line', bend: 0, label: '', lp: 'auto', ...(prefs.edge.route && prefs.edge.route !== 'arc' ? { route: prefs.edge.route } : {}) });
function newEdge(a, b, pa, pb) {
  const e = { id: 'e' + uid(), a: a ? a.id : null, b: b ? b.id : null, ...edgeStyle() };
  if (a && a === b) delete e.route;
  if (!a) e.pa = pa; if (!b) e.pb = pb;
  if (a && b && a === b) {
    const used = doc.edges.filter(x => x.a === a.id && x.b === a.id).map(x => x.la ?? -90);
    e.la = [-90, 90, 0, 180, -45, -135].find(t => !used.includes(t)) ?? -90;
  } else if (a && b) {
    const rev = doc.edges.filter(x => x.a === b.id && x.b === a.id), same = doc.edges.filter(x => x.a === a.id && x.b === b.id);
    if (e.route) { /* routed lines keep their shape */ }
    else if (rev.length && !same.length) { for (const r of rev) if (!r.bend) r.bend = 14; e.bend = 14; }
    else if (same.length) e.bend = 16 * Math.ceil(same.length / 2 + .1) * (same.length % 2 ? 1 : -1);
    else e.bend = avoidBend(a, b);
  }
  doc.edges.push(e);
  return e;
}
/* a straight line from a to b that would run over another shape bends just enough to go round it
   (like ZX Draw): the smallest bend, on the freer side, that keeps 8px from every shape it is not wired to.
   A straight line that only passes close by (no touch, 2px) stays straight.
   Shapes that hold a or b (a frame around them), pictures and text are ignored. */
function avoidBend(a, b, gone) {
  const L = Math.hypot(b.x - a.x, b.y - a.y); if (L < 1) return 0;
  const nx = (b.y - a.y) / L, ny = -(b.x - a.x) / L, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const obs = doc.nodes.filter(o => o !== a && o !== b && !(gone && gone.has(o.id)) && o.k !== 'image' && o.k !== 'text' && !inside(o, a) && !inside(o, b));
  if (!obs.length) return 0;
  const M = 8;   /* a bend keeps 8px from every shape, but a straight line bends only when it really touches one (2px) */
  const clear = (bend, m = M) => {
    const C = { x: mx + nx * bend * 2, y: my + ny * bend * 2 };
    for (let i = 1; i < 40; i++) {
      const t = i / 40, u = 1 - t, q = { x: u * u * a.x + 2 * u * t * C.x + t * t * b.x, y: u * u * a.y + 2 * u * t * C.y + t * t * b.y };
      if (inside(a, q, 2) || inside(b, q, 2)) continue;
      if (obs.some(o => inside(o, q, m))) return false;
    }
    return true;
  };
  if (clear(0, 2)) return 0;
  const room = bend => { /* how far the curve's apex is from the nearest shape: used to pick the freer side */
    const q = { x: mx + nx * bend, y: my + ny * bend };
    return Math.min(...obs.map(o => Math.hypot(o.x - q.x, o.y - q.y)));
  };
  for (let k = .08; k <= .75; k += .04) {
    const v = Math.round(k * L), ok = [v, -v].filter(x => clear(x));
    if (ok.length === 2) return room(v) >= room(-v) ? v : -v;
    if (ok.length) return ok[0];
  }
  return 0;
}
/* deleting a shape that has exactly two lines joins them into one line (like ZX Draw); with more, the lines go */
function bridgeOut(n, gone) {
  const es = doc.edges.filter(e => !gone.has(e.id) && (e.a === n.id || e.b === n.id));
  if (es.length !== 2 || es.some(e => e.a === e.b)) return;
  /* the line coming in first, so the arrow keeps pointing the same way */
  let [e1, e2] = es;
  if (e1.a === n.id && e2.b === n.id) [e1, e2] = [e2, e1];
  const end = (e, near) => e.a === n.id ? (near ? 'a' : 'b') : (near ? 'b' : 'a');
  const fa = end(e1, false), fb = end(e2, false);
  const A = e1[fa], B = e2[fb];
  if (A && A === B) return;
  const m = { ...clone(e1), id: 'e' + uid(), bend: 0, label: e1.label || e2.label || '' };
  for (const k of ['route', 'c1', 'c2', 'em', 'ek', 'pa', 'pb', 'qa', 'qb']) delete m[k];
  m.a = A || null; m.b = B || null;
  if (e1['q' + fa]) m.qa = clone(e1['q' + fa]); if (e2['q' + fb]) m.qb = clone(e2['q' + fb]);   // the far ends keep their ports
  if (!A) m.pa = clone(e1['p' + fa]); if (!B) m.pb = clone(e2['p' + fb]);
  m.tail = fa === 'a' ? e1.tail || 'none' : e1.head || 'none';
  m.head = fb === 'b' ? e2.head ?? 'none' : e2.tail || 'none';
  doc.edges = doc.edges.filter(e => e !== e1 && e !== e2);
  doc.edges.push(m);
  const na = A && idx.get(A), nb = B && idx.get(B);
  if (na && nb && !gone.has(A) && !gone.has(B)) m.bend = avoidBend(na, nb, gone);
}
function deleteSel() {
  if (!sel.size) return;
  mutate(() => {
    const gone = new Set(sel);
    const eGone = e => gone.has(e.id) || gone.has(e.a) || gone.has(e.b);
    for (let more = true; more;) {
      more = false;
      for (const n of doc.nodes) if (n.dep && !gone.has(n.id) && depRefs(n.dep).some(r => gone.has(r) || (edgeById(r) && eGone(edgeById(r))))) { gone.add(n.id); more = true; }
    }
    for (const n of selNodes()) bridgeOut(n, gone);
    doc.nodes = doc.nodes.filter(n => !gone.has(n.id));
    doc.edges = doc.edges.filter(e => !gone.has(e.id) && !gone.has(e.a) && !gone.has(e.b));
    sel.clear();
  });
}
function copySel() {
  const ns = selNodes(), ids = new Set(ns.map(n => n.id));
  /* selected lines come along even without their shapes: a missing end becomes a loose point where it is now */
  const es = doc.edges.filter(e => sel.has(e.id) || (e.a && e.b && ids.has(e.a) && ids.has(e.b))).map(e => {
    const c = clone(e), g = egeo.get(e.id) || edgeGeom(e);
    if (c.a && !ids.has(c.a)) { c.pa = { x: g.P.x, y: g.P.y }; c.a = null; delete c.qa; }
    if (c.b && !ids.has(c.b)) { c.pb = { x: g.Q.x, y: g.Q.y }; c.b = null; delete c.qb; }
    return c;
  });
  if (!ns.length && !es.length) return false;
  clip = { nodes: clone(ns), edges: es }; pasteN = 0; clipText = '';
  return true;
}
/* ⌘C: keep the copy here and put its TikZ on the system clipboard, so a paste can tell whether the clipboard still holds it */
function copyOut() {
  if (!copySel()) return false;
  let tx = ''; try { tx = latexFor(true, true).tex; } catch { }
  clipText = tx || '\u0001figura';
  /* no clipboard access: then every ⌘V pastes this copy */
  try { navigator.clipboard.writeText(clipText).catch(() => { clipText = null; }); } catch { clipText = null; }
  toast(sel.size > 1 ? `Copied ${sel.size}` : 'Copied');
  return true;
}
const pasteHere = () => pasteClip(clip, (++pasteN) * (step() || 20));
function pasteClip(c, off) {
  if (!c) return;
  mutate(() => {
    const map = {}, emap = {}, made = []; sel.clear();
    for (const n of c.nodes) { const m = { ...clone(n), id: 'n' + uid(), x: n.x + off, y: n.y + off }; map[n.id] = m.id; doc.nodes.push(m); made.push(m); sel.add(m.id); }
    for (const e of c.edges) {
      const m = { ...clone(e), id: 'e' + uid(), a: e.a ? map[e.a] : null, b: e.b ? map[e.b] : null };
      if (m.pa) m.pa = { x: m.pa.x + off, y: m.pa.y + off }; if (m.pb) m.pb = { x: m.pb.x + off, y: m.pb.y + off };
      if ((e.a && !m.a) || (e.b && !m.b)) continue;
      emap[e.id] = m.id; doc.edges.push(m); sel.add(m.id);
    }
    remapDeps(made, map, emap, off);
  });
}
function duplicate() { if (!copySel()) return; const c = clip; pasteClip(c, step() || 20); }
function order(where) {
  if (!selNodes().length) return;
  mutate(() => {
    const s = n => sel.has(n.id); let a = [...doc.nodes];
    if (where === 'top') a = [...a.filter(n => !s(n)), ...a.filter(s)];
    else if (where === 'bottom') a = [...a.filter(s), ...a.filter(n => !s(n))];
    else if (where === 'up') { for (let i = a.length - 2; i >= 0; i--) if (s(a[i]) && !s(a[i + 1])) [a[i], a[i + 1]] = [a[i + 1], a[i]]; }
    else for (let i = 1; i < a.length; i++) if (s(a[i]) && !s(a[i - 1])) [a[i], a[i - 1]] = [a[i - 1], a[i]];
    doc.nodes = a;
  });
}

/* ================= tools ================= */
const TOOLS = ['select', 'hand', 'circle', 'rect', 'tri', 'diamond', 'dot', 'text', 'edge', 'compass', 'image', 'laser'];
let compassPend = null, compassAt = null;
const refPt = q => (q.n ? idx.get(q.n) || { x: 0, y: 0 } : q);
const compassRef = (p, c) => { const n = hitNode(p); return n && n.k !== 'image' && !(c && c.n === n.id) ? { n: n.id } : snapP(p); };
function makeCircle(c, r) {
  const C = refPt(c), Rp = refPt(r), rad = Math.hypot(Rp.x - C.x, Rp.y - C.y); if (rad < 3) return;
  mutate(() => {
    const n = newNode('circle', C.x, C.y, { w: 2 * rad, h: 2 * rad }); n.fill = 'none'; n.text = '';
    if (c.n || r.n) n.dep = { op: 'circ', c: c.n ? { n: c.n } : { x: C.x, y: C.y }, r: r.n ? { n: r.n } : { x: Rp.x, y: Rp.y } };
    doc.nodes.push(n); sel.clear(); sel.add(n.id);
  });
}
const SHAPES = ['circle', 'rect', 'tri', 'diamond'];
const PEEK = new Set(['select', 'laser']);
let subPeek = false;
function setTool(t, fromUser) {
  /* an own button: its kind's tool, with its look for what gets made */
  let st = null;
  if (typeof t === 'string' && t.startsWith('st:')) { st = stampById(t.slice(3)); if (!st) return; if (stamp === st && fromUser === 'click') { openDockEd(t); return; } t = st.k; }
  if (t === 'image') { pickImage(null); return; }
  if (!st && !stamp && fromUser && t === tool) {
    /* select / laser: their options only show on a second click (or right-click), and only for a moment */
    if (fromUser === 'click' && PEEK.has(t)) { subPeek = !subPeek; drawSub(); return; }
    if (t === 'select') { setSelMode(prefs.selMode === 'box' ? 'lasso' : 'box'); return; }
  }
  if (t !== tool || st !== stamp) subPeek = false;
  stamp = st;
  tool = t; wirePend = null; compassPend = null; if (t !== 'select') hov = null;
  syncDock(); vp.classList.toggle('place', SHAPES.includes(t) || t === 'text' || t === 'edge' || t === 'dot' || t === 'compass');
  vp.classList.toggle('hand', t === 'hand'); vp.classList.toggle('laser', t === 'laser');
  if (t !== 'laser') laserDot = null;
  closeHP(true); drawSub();
  drawOverlay();
}
function setSelMode(m) {
  prefs.selMode = m; savePrefs();
  const b = $('#dock [data-tool=select]'); if (b) { b.classList.remove('flip'); void b.offsetWidth; b.classList.add('flip'); }
  setTimeout(() => syncDock(), 120);
  drawSub(true);
}
/* the connector tool icon draws the current line: width, dashes, double / wave / zigzag and both ends */
const dotIc = (d, s = 18) => sv(`<circle cx="12" cy="12" r="${Math.max(1.2, Math.min(7, 1 + d * .4))}" fill="currentColor" stroke="none"/>`, s);
/* dot sizes: presets (right-click to change or delete, + adds) */
const dszSeg = (a, cur) => `<div class="seg">${presetOf('dSz').map((d, i) => `<button class="${d === cur ? 'on' : ''}" data-a="${a}" data-v="${d}" data-pk="dSz:${i}" title="${d}px · right-click to change">${dotIc(d, 16)}</button>`).join('')}</div>${paddBtn('dSz')}`;
function edgeToolIc(E) {
  const shape = E.shape || 'line', hd = E.head ?? 'vee', tl = E.tail || 'none', dbl = shape === 'double';
  const w = dbl ? 1.1 : shape !== 'line' ? 1.35 : Math.min(2.6, Math.max(1.2, 1 + (E.sw || 1.4) * .33));
  const cut = h => ({ none: 20.5, ray: 14, tri: 15.6, otri: 15.6, circ: 17.4, ocirc: 17.4, two: 20, vee: dbl ? 18.2 : 20.3 })[h] ?? 20.3;
  const x1 = 24 - cut(tl), x2 = cut(hd);
  const HD = {
    vee: dbl ? '<path d="M15.6 7.6L20.4 12l-4.8 4.4"/>' : '<path d="M16.6 8.2L20.4 12l-3.8 3.8"/>',
    two: '<path d="M16.6 8.2L20.4 12l-3.8 3.8M13.4 8.2L17.2 12l-3.8 3.8"/>',
    tri: '<path d="M15.2 8.4L21 12l-5.8 3.6z" fill="currentColor"/>',
    otri: '<path d="M15.6 8.6L21 12l-5.4 3.4z"/>',
    circ: '<circle cx="19.2" cy="12" r="1.9" fill="currentColor"/>',
    ocirc: '<circle cx="19.2" cy="12" r="1.8"/>',
    bar: '<path d="M20.4 8.2v7.6"/>',
    hook: '<path d="M20.4 12c0-2.3-1.7-3.8-3.8-3.8"/>',
    ray: '<path d="M15.4 12h2" opacity=".55"/><path d="M19 12h1.6" opacity=".25"/>',
  };
  let body;
  if (shape === 'wave' || shape === 'zig') {
    const a = x1 + (tl === 'none' ? 0 : 1.6), b = x2 - (hd === 'none' ? 0 : 1.6), n = Math.max(2, Math.round((b - a) / 5.2)), lam = (b - a) / n;
    if (shape === 'wave') { body = `M${x1} 12H${a}`; for (let i = 0; i < n; i++) body += `q${lam / 4} -3 ${lam / 2} 0q${lam / 4} 3 ${lam / 2} 0`; body += `H${x2}`; }
    else { body = `M${x1} 12H${a}`; for (let i = 0; i < n; i++) body += `l${lam / 4} -2.2l${lam / 2} 4.4l${lam / 4} -2.2`; body += `H${x2}`; }
  } else body = dbl ? `M${x1} 10.5H${x2}M${x1} 13.5H${x2}` : `M${x1} 12H${x2}`;
  const pt = shape === 'line' || dbl ? dashPat(E.dash) : null;
  const da = pt ? (pt[0] ? `stroke-dasharray="${pt[0] * 1.1 + w * .5} ${pt[1] * 1.1 + w * .6}"` : `stroke-dasharray="0 ${pt[1] + w + 1.2}" stroke-width="${w + .7}"`) : '';
  const heads = `<g stroke-width="1.35">${HD[hd] || ''}${tl !== 'none' ? `<g transform="matrix(-1 0 0 1 24 0)">${HD[tl] || ''}</g>` : ''}</g>`;
  return sv(`<g transform="rotate(-45 12 12)"><path d="${body}" ${da} ${/stroke-width/.test(da) ? '' : `stroke-width="${w}"`}/>${heads}</g>`);
}
function syncDock() {
  for (const b of $$('#dock .tool')) {
    const t = b.dataset.tool, st = t.startsWith('st:') ? stampById(t.slice(3)) : null;
    const ic = st ? stampIc(st) : builtinIc(t);
    if (!ic) continue;
    const ti = b.querySelector('.ti'); if (ti._ic !== ic) { ti.innerHTML = ic; ti._ic = ic; }
    b.classList.toggle('on', stamp ? t === 'st:' + stamp.id : t === tool);
  }
  syncPill($('#dock'), $('#dock .tool.on'));
}
function syncPill(box, on, instant) {
  let pill = box.querySelector(':scope > .pill');
  if (!pill) { pill = document.createElement('span'); pill.className = 'pill'; box.prepend(pill); instant = true; }
  if (!on) { pill.style.opacity = 0; return; }
  /* drawn while hidden (bar or popover not shown yet): measure again once it is on screen */
  if (!on.offsetWidth) { if ((box._pw = (box._pw || 0) + 1) < 30) requestAnimationFrame(() => box.isConnected && syncPill(box, box.querySelector(':scope > button.on') || on, true)); return; }
  box._pw = 0;
  if (instant) pill.style.transition = 'none';
  pill.style.opacity = 1;
  pill.style.width = on.offsetWidth + 'px'; pill.style.height = on.offsetHeight + 'px';
  pill.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
  if (instant) { void pill.offsetWidth; pill.style.transition = ''; }
}
/* Update a rebuilt panel in place when only states changed (on / values / colours / titles),
   so clicks never flash: the pill slides and rings fade instead of the whole row being redrawn. */
const sigOf = h => h.replace(/\s(class|data-v|style|title|value)="[^"]*"/g, '').replace(/\schecked\b/g, '');
function patchHTML(root, html) {
  const sig = sigOf(html);
  if (root._sig !== sig) return false;
  const t = document.createElement('div'); t.innerHTML = html;
  const A = [...root.querySelectorAll('*')].filter(e => !e.classList.contains('pill')), B = [...t.querySelectorAll('*')];
  if (A.length !== B.length || A.some((a, i) => a.tagName !== B[i].tagName)) return false;
  A.forEach((a, i) => {
    const b = B[i];
    for (const at of ['class', 'data-v', 'style', 'title']) { const v = b.getAttribute(at); if (v == null) { if (a.hasAttribute(at)) a.removeAttribute(at); } else if (a.getAttribute(at) !== v) a.setAttribute(at, v); }
    if (b.tagName === 'INPUT') {
      if (a.type === 'checkbox') a.checked = b.hasAttribute('checked');
      else if (document.activeElement !== a && b.hasAttribute('value')) a.value = b.getAttribute('value');
    }
  });
  root.querySelectorAll('.seg').forEach(sg => syncPill(sg, sg.querySelector(':scope > button.on')));
  return true;
}
function initSegs(root, old) {
  $$('.seg', root).forEach((sg, i) => {
    const on = sg.querySelector(':scope > button.on');
    if (old && old[i]) {
      const pill = document.createElement('span'); pill.className = 'pill'; sg.prepend(pill);
      pill.style.transition = 'none'; Object.assign(pill.style, old[i]); void pill.offsetWidth; pill.style.transition = '';
      requestAnimationFrame(() => syncPill(sg, on));
    } else syncPill(sg, on, true);
  });
}

/* ================= pointer input ================= */
const ptrs = new Map();
let pinch = null, longT = 0;
const evW = e => { const r = vp.getBoundingClientRect(); return W(e.clientX - r.left, e.clientY - r.top); };
const evS = e => { const r = vp.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

vp.addEventListener('pointerdown', e => {
  if (e.target.closest('.editing')) return;
  /* a press that only closes an open panel / menu / text edit: with a drawing tool it must not also
     draw a shape or start a line there (same fix as in ZX Draw) */
  const closing = e.button === 0 && tool !== 'select' && tool !== 'hand' && !e.target.closest('[data-h]')
    && (!pp.hidden || !menu.hidden || !cpk.hidden || (!hpop.hidden && !hpop.classList.contains('out')) || !!editing);
  if (editing) endEdit();
  closePP(); closeMenu();
  if (closing) { closeHP(true); e.preventDefault(); return; }
  ptrs.set(e.pointerId, evS(e));
  if (ptrs.size === 2) { startPinch(); return; }
  if (ptrs.size > 2) return;
  try { vp.setPointerCapture(e.pointerId); } catch {}
  const p = evW(e), sp = evS(e);
  lastPtr = p;
  if (e.pointerType === 'touch') { clearTimeout(longT); longT = setTimeout(() => { if (drag && !drag.moved) { const d = drag; drag = null; if (d.before) commit(d.before); ctxAt(e.clientX, e.clientY, p); } }, 520); }
  if (e.button === 2) {
    if (tool === 'edge' && !isLocked() && !hitNode(p) && !e.target.closest('[data-e], .elab')) drag = { t: 'marq', s: p, p, base: new Set(e.shiftKey ? sel : []), sp, right: true, moved: false };
    return;
  }
  if (e.button === 1 || space || tool === 'hand') { drag = { t: 'pan', sx: sp.x, sy: sp.y, cx: cam.x, cy: cam.y }; vp.classList.add('panning'); return; }
  if (tool === 'laser') { drag = { t: 'laser' }; laserAdd(sp.x, sp.y); return; }
  if (isLocked()) { drag = { t: 'pan', sx: sp.x, sy: sp.y, cx: cam.x, cy: cam.y }; vp.classList.add('panning'); return; }
  if (crop) { cropDown(e, p); return; }
  const h = e.target.closest('[data-h]');
  if (h) { handleDown(h, p, sp, e); return; }
  /* labels: drag a line's label along it (and across it: left side, on the line, right side); an outer label round its shape */
  if (tool === 'select' && !parMode && !wirePend && !e.shiftKey && !e.altKey) {
    const ol = e.target.closest('.olab'), lb = e.target.closest('.elab');
    if (ol) { const n2 = idx.get(ol.dataset.n); if (n2) { const was = sel.has(n2.id); if (!was) selectOnly(n2.id); drag = { t: 'olab', n: n2, side: ol.dataset.s, before: snap(), sp, again: was }; return; } }
    if (lb) { const ed = edgeById(lb.dataset.e); if (ed) { const was = sel.has(ed.id); if (!was) selectOnly(ed.id); drag = { t: 'elab', e: ed, before: snap(), sp, again: was }; return; } }
  }
  const elab = e.target.closest('.elab'), olN = e.target.closest('.olab');
  const n = elab ? null : olN ? idx.get(olN.dataset.n) : hitNode(p);
  const eg = elab || (!n && e.target.closest('[data-e]'));
  const eid = (eg ? eg.dataset.e : null);

  if (parMode) { if (n) parTo(n, e.shiftKey); drag = { t: 'none' }; drawOverlay(); return; }
  if (tool === 'edge' && n && (e.metaKey || e.ctrlKey)) { if (sel.has(n.id)) sel.delete(n.id); else sel.add(n.id); render(); drag = { t: 'none' }; return; }
  if (wirePend) {
    /* second click: a line from the first point (a shape or a spot on the canvas) to this one */
    const a = typeof wirePend === 'string' ? idx.get(wirePend) : null, ap = typeof wirePend === 'object' ? wirePend : null; wirePend = null;
    const m = n ? null : magnetAt(p, a ? a.id : null), t = n || (m ? m.n : null), q = snapP(p);
    if ((a || ap) && (t || !ap || Math.hypot(q.x - ap.x, q.y - ap.y) > 6)) mutate(() => {
      const ne = newEdge(a, t, ap, t ? null : q);
      if (t && t !== a && m && m.pin) ne.qb = m.pin;
      sel.clear(); sel.add(ne.id);
    });
    drag = { t: 'none' }; render(); return;
  }
  if (tool === 'edge') {
    if (eid && !n) { selectOnly(eid); drag = { t: 'none' }; return; }
    drag = { t: 'edge', from: n, fp: n ? null : snapP(p), s: p, sp, p, moved: false, target: null, chain: [], fan: !!n && fanOn(), keep: e.shiftKey, fromPin: n ? pinAt(n, p).pin : null };
    return;
  }
  if (tool === 'compass') {
    const ref = compassRef(p, compassPend);
    if (compassPend) { const c = compassPend; compassPend = null; makeCircle(c, ref); drag = { t: 'none' }; drawOverlay(); return; }
    drag = { t: 'compass', c: n && n.k !== 'image' ? { n: n.id } : snapP(p), p, sp, moved: false }; drawOverlay(); return;
  }
  if (tool === 'dot') {
    if (n) { pressNode(n, p, sp, e); return; }
    if (eid) { selectOnly(eid); drag = { t: 'none' }; return; }
    const q = snapP(p); mutate(() => { const d = newNode('dot', q.x, q.y); doc.nodes.push(d); sel.clear(); sel.add(d.id); });
    drag = { t: 'none' }; return;
  }
  if (SHAPES.includes(tool) || tool === 'text') {
    if (tool === 'text') { const tn = (n && n.k !== 'image' && n.k !== 'dot') ? n : (!n && !eid ? boxHit(p) : null); if (tn) { drag = { t: 'none' }; setTimeout(() => editNode(tn), 0); return; } }
    if (n) { pressNode(n, p, sp, e); return; }
    if (eid) { selectOnly(eid); drag = { t: 'none' }; return; }
    /* after the press has finished moving focus, or the new field loses it at once and is dropped as empty */
    if (tool === 'text') { const q = snapP(p); drag = { t: 'none' }; setTimeout(() => createText(q), 0); return; }
    drag = { t: 'create', k: tool, s: snapP(p), p: snapP(p), sp, moved: false };
    return;
  }
  // select
  if (n) { pressNode(n, p, sp, e); return; }
  if (eid) {
    if (e.shiftKey) { sel.has(eid) ? sel.delete(eid) : sel.add(eid); render(); drag = { t: 'none' }; return; }
    const was = sel.has(eid);
    if (!was) selectOnly(eid);
    const ed = edgeById(eid);
    if (ed && !ed.a && !ed.b) { startMove(p, sp, null, e); drag.again = was; return; }
    drag = { t: 'none', again: was }; return;
  }
  if (!e.shiftKey) sel.clear();
  const lasso = (prefs.selMode === 'lasso') !== e.altKey;
  drag = lasso ? { t: 'lasso', path: [p], base: new Set(sel), sp } : { t: 'marq', s: p, p, base: new Set(sel), sp };
  render();
});

function selectOnly(id) { sel.clear(); sel.add(id); render(); }
function pressNode(n, p, sp, e) {
  const wasSel = sel.has(n.id) && !e.shiftKey;
  if (e.shiftKey) { if (sel.has(n.id)) { sel.delete(n.id); render(); drag = { t: 'none' }; return; } sel.add(n.id); }
  else if (!sel.has(n.id)) { sel.clear(); sel.add(n.id); }
  render();
  startMove(p, sp, n, e);
  if (drag) drag.again = wasSel;   // a click on what was already selected opens its bar
}
function startMove(p, sp, primary, e) {
  const before = snap();
  if (e.altKey && sel.size) {
    copySel(); const c = clip; const map = {};
    const ids = new Set(c.nodes.map(n => n.id)); sel.clear();
    const emap = {}, made = [];
    for (const n of c.nodes) { const m = { ...clone(n), id: 'n' + uid() }; map[n.id] = m.id; doc.nodes.push(m); made.push(m); sel.add(m.id); }
    for (const ed of c.edges) { const m = { ...clone(ed), id: 'e' + uid(), a: ed.a ? map[ed.a] : null, b: ed.b ? map[ed.b] : null }; emap[ed.id] = m.id; doc.edges.push(m); sel.add(m.id); }
    remapDeps(made, map, emap, 0);
    if (primary && ids.has(primary.id)) primary = doc.nodes.find(x => x.id === map[primary.id]);
    render(); vp.classList.add('copying');
  }
  const orig = new Map(selNodes().filter(n => !n.dep).map(n => [n.id, { x: n.x, y: n.y }]));
  const eorig = new Map(selEdges().map(ed => [ed.id, { pa: ed.pa && { ...ed.pa }, pb: ed.pb && { ...ed.pb } }]));
  drag = { t: 'move', s: p, sp, before, orig, eorig, primary, moved: false, clickId: primary?.id };
}
function handleDown(h, p, sp, e) {
  const kind = h.dataset.h, before = snap();
  if (kind === 'anc') { const q = W(+h.getAttribute('cx'), +h.getAttribute('cy')); drag = { t: 'edge', from: hov, fp: null, s: p, sp, p, moved: false, target: null, anc: true, ancPt: q, fromPin: pinAt(hov, q).pin }; return; }
  if (kind === 'rs') {
    const n = selNodes()[0], [hx, hy] = h.dataset.d.split(',').map(Number), { w, h: hh } = size(n);
    const anchor = fromLocal(n, { x: -hx * w / 2, y: -hy * hh / 2 });
    drag = { t: 'rs', n, hx, hy, anchor, c0: { x: n.x, y: n.y }, w0: w, h0: hh, size0: n.ts.size, before, sp }; return;
  }
  if (kind === 'rot') {
    const ns = selNodes(), bb = bboxOf(ns.flatMap(n => corners(n)));
    const c = ns.length === 1 ? { x: ns[0].x, y: ns[0].y } : { x: bb.cx, y: bb.cy };
    drag = { t: 'rot', c, a0: Math.atan2(p.y - c.y, p.x - c.x) * R2D + 90, orig: ns.map(n => ({ n, x: n.x, y: n.y, rot: n.rot || 0 })), before, sx: sp.x, sy: sp.y, shown: ns.length === 1 ? ns[0].rot || 0 : 0 };
    return;
  }
  const ed = edgeById(h.dataset.e); if (!ed) return;
  if (kind === 'bend') drag = { t: 'bend', e: ed, before };
  else if (kind === 'c1' || kind === 'c2' || kind === 'elb') drag = { t: 'ctl', w: kind, e: ed, before };
  else if (kind === 'loop') drag = { t: 'loop', e: ed, before };
  else if (kind === 'end') { const w = h.dataset.w; drag = { t: 'end', e: ed, w, before, target: null, p, home: ed[w], homePin: ed['q' + w] && { ...ed['q' + w] } }; }
}

vp.addEventListener('pointermove', e => {
  if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, evS(e));
  if (pinch) { movePinch(); return; }
  const p = evW(e), sp = evS(e); lastPtr = p;
  if (tool === 'laser') { laserDot = sp; if (drag?.t === 'laser') laserAdd(sp.x, sp.y); else kickLaser(); return; }
  if (!drag) {
    if (crop) return;
    if (tool === 'compass') { const n2 = hitNode(p); hov = n2 && n2.k !== 'image' ? n2 : null; compassAt = p; drawOverlay(); return; }
    if (e.target.closest('[data-h]')) return;
    let n = tool === 'select' || tool === 'edge' || wirePend || parMode ? hitNode(p) : null;
    if (!n && hov && tool === 'select' && idx.has(hov.id) && inside(hov, p, 26 / cam.z)) n = hov;
    if (n !== hov || wirePend || parMode || fanOn()) { hov = n; drawOverlay(); }
    vp.classList.toggle('over-node', !!n && tool === 'select');
    return;
  }
  if (drag.sp && !drag.moved) { if (Math.hypot(sp.x - drag.sp.x, sp.y - drag.sp.y) < 4) return; drag.moved = true; clearTimeout(longT); hideBar(); }
  clearTimeout(longT);
  switch (drag.t) {
    case 'elab': {
      const ed = drag.e, g = egeo.get(ed.id) || edgeGeom(ed); if (!g.K && !g.pts) break;
      const h = nearestT(g, p), m = elabEls.get(ed.id)?._m || { w: 20, h: 16 };
      let t = clamp(h.t, .04, .96); if (Math.abs(t - .5) < .035) t = .5;
      if (t === .5) delete ed.lt; else ed.lt = Math.round(t * 1000) / 1000;
      ed.lp = Math.abs(h.d) < Math.max(7 / cam.z, m.h * .5) ? 'on' : h.d > 0 ? 'l' : 'r';
      render(); break;
    }
    case 'olab': {
      const n = drag.n, to = olSideAt(n, p), fr = drag.side;
      /* any angle round the shape; it settles on a side's middle within 8° */
      let ang = Math.round(Math.atan2(p.y - n.y, p.x - n.x) / D2R); if (ang <= -180) ang += 360;
      const dm = Math.abs(((ang - OL_ANG[to]) % 360 + 540) % 360 - 180);
      if (to !== fr && n.ol) {
        const a = n.ol[fr], b = n.ol[to]; n.ol[to] = a; if (b) n.ol[fr] = b; else delete n.ol[fr];
        if (n.oa) { delete n.oa[fr]; delete n.oa[to]; }
        const A = olEls.get(n.id + ':' + fr), B = olEls.get(n.id + ':' + to);
        olEls.delete(n.id + ':' + fr); olEls.delete(n.id + ':' + to);
        if (A) { A.dataset.s = to; olEls.set(n.id + ':' + to, A); A._m = null; }
        if (B) { B.dataset.s = fr; olEls.set(n.id + ':' + fr, B); B._m = null; }
        drag.side = to;
      }
      if (n.ol) { n.oa = n.oa || {}; if (dm <= 8) delete n.oa[to]; else n.oa[to] = ang; if (!Object.keys(n.oa).length) delete n.oa; }
      render(); break;
    }
    case 'pan': cam.x = drag.cx + sp.x - drag.sx; cam.y = drag.cy + sp.y - drag.sy; applyCam(); break;
    case 'move': moveDrag(p); break;
    case 'compass': drag.p = p; hov = hitNode(p); drawOverlay(); break;
    case 'marq': {
      drag.p = p; const l = Math.min(drag.s.x, p.x), r = Math.max(drag.s.x, p.x), t = Math.min(drag.s.y, p.y), b = Math.max(drag.s.y, p.y);
      const inR = q => q.x >= l && q.x <= r && q.y >= t && q.y <= b;
      sel = new Set(drag.base);
      for (const n of doc.nodes) if (corners(n).every(inR)) sel.add(n.id);
      for (const ed of doc.edges) { const g = egeo.get(ed.id); if (g && inR(g.P) && inR(g.Q)) sel.add(ed.id); }
      drawEdges(); drawOverlay(); break;
    }
    case 'lasso': {
      const last = drag.path[drag.path.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) * cam.z > 3) drag.path.push(p);
      const P = drag.path.map(q => [q.x, q.y]);
      sel = new Set(drag.base);
      if (P.length > 2) {
        for (const n of doc.nodes) if (pip(P, n)) sel.add(n.id);
        for (const ed of doc.edges) if (egeo.get(ed.id) && pip(P, egeo.get(ed.id).mid)) sel.add(ed.id);
      }
      drawEdges(); drawOverlay(); break;
    }
    case 'create': {
      const raw = snapP(p);
      if (space && drag.last) drag.s = { x: drag.s.x + raw.x - drag.last.x, y: drag.s.y + raw.y - drag.last.y };
      drag.last = raw;
      let dx = raw.x - drag.s.x, dy = raw.y - drag.s.y;
      if (e.shiftKey) {
        const dir = defOf('tri').dir || 'up', k = drag.k !== 'tri' ? 1 : dir === 'up' || dir === 'down' ? Math.sqrt(3) / 2 : 2 / Math.sqrt(3);
        const w = Math.max(Math.abs(dx), Math.abs(dy) / k);
        dx = Math.sign(dx || 1) * w; dy = Math.sign(dy || 1) * w * k;
      }
      drag.p = { x: drag.s.x + dx, y: drag.s.y + dy };
      drag.box = e.altKey ? { l: drag.s.x - Math.abs(dx), r: drag.s.x + Math.abs(dx), t: drag.s.y - Math.abs(dy), b: drag.s.y + Math.abs(dy) }
        : { l: Math.min(drag.s.x, drag.p.x), r: Math.max(drag.s.x, drag.p.x), t: Math.min(drag.s.y, drag.p.y), b: Math.max(drag.s.y, drag.p.y) };
      drag.mods = (e.shiftKey ? '⇧ ' : '') + (e.altKey ? '⌥ ' : '');
      drawOverlay(); break;
    }
    case 'edge': {
      const lp = drag.p || p; drag.p = p; const t = hitNode(p);
      /* every shape the stroke passed through since the last sample, in order: a fast drag jumps over small ones */
      if (drag.from && !drag.anc) {
        const L = Math.hypot(p.x - lp.x, p.y - lp.y), k = Math.max(1, Math.ceil(L / (4 / cam.z)));
        for (let i = 1; i <= k; i++) {
          const q = { x: lp.x + (p.x - lp.x) * i / k, y: lp.y + (p.y - lp.y) * i / k }, u = hitNode(q);
          if (u && u !== drag.from && u !== drag.chain.at(-1) && inside(u, q, 0) && u.k !== 'text') drag.chain.push(u);
        }
      }
      drag.target = t && (t !== drag.from || Math.hypot(p.x - drag.s.x, p.y - drag.s.y) > 30 / cam.z || drag.anc) ? t : null;
      if (drag.anc && t === drag.from) drag.target = null;
      /* magnet: within PMAG px of a shape the line is drawn as if already connected */
      const had = !!drag.mag;
      let m = drag.chain.length > 1 ? null : magnetAt(p);
      if (m && m.n === drag.from) m = null;
      drag.mag = m; if (m) drag.target = m.n;
      if (m || had) render(); else drawOverlay();
      break;
    }
    case 'rs': resizeDrag(p, e); break;
    case 'rot': rotDrag(p, sp, e); break;
    case 'bend': {
      const ed = drag.e, gg = egeo.get(ed.id), A = gg?.A || endPt(ed, 'a'), B = gg?.B || endPt(ed, 'b'), L = Math.hypot(B.x - A.x, B.y - A.y) || 1;
      const nx = (B.y - A.y) / L, ny = -(B.x - A.x) / L;
      let b = (p.x - (A.x + B.x) / 2) * nx + (p.y - (A.y + B.y) / 2) * ny;
      if (prefs.magnet && !e.shiftKey && Math.abs(b) * cam.z < 7) b = 0;
      ed.bend = Math.round(b * 10) / 10; render(); break;
    }
    case 'ctl': {
      const ed = drag.e, gg = egeo.get(ed.id), A = gg?.A || endPt(ed, 'a'), B = gg?.B || endPt(ed, 'b');
      if (drag.w === 'elb') {
        const h = elbH(ed, A, B), den = h ? B.x - A.x : B.y - A.y;
        let m = Math.abs(den) < 1 ? .5 : ((h ? p.x - A.x : p.y - A.y) / den);
        if (prefs.magnet && !e.shiftKey && Math.abs(m - .5) * Math.abs(den) * cam.z < 7) m = .5;
        ed.ek = h ? 'h' : 'v'; ed.em = Math.round(clamp(m, -1, 2) * 1000) / 1000;
      } else ed[drag.w] = ctlOf(A, B, p);
      render(); break;
    }
    case 'loop': {
      const n = idx.get(drag.e.a); if (!n) break;
      let a = Math.atan2(p.y - n.y, p.x - n.x) * R2D;
      if (prefs.magnet) { const t = Math.round(a / 45) * 45; if (Math.abs(a - t) < 7) a = t; }
      drag.e.la = Math.round(a); render(); break;
    }
    case 'end': {
      /* along its own shape: the pin follows live (place, order, side); near another shape: preview; elsewhere: a loose end */
      const ed = drag.e, w = drag.w, m = magnetAt(p, ed[w === 'a' ? 'b' : 'a']);
      drag.p = p; drag.target = m ? m.n : null;
      if (m && m.n.id === drag.home) {
        ed[w] = drag.home; delete ed['p' + w];
        const pin = m.pin || drag.homePin; if (pin) ed['q' + w] = pin; else delete ed['q' + w];
        drag.mag = null;
      } else { ed[w] = null; ed['p' + w] = m ? { x: p.x, y: p.y } : snapP(p); delete ed['q' + w]; drag.mag = m; }
      render(); break;
    }
  }
});

function moveDrag(p) {
  if (drag.primary?.dep && !drag.orig.size) { if (!drag.told) { drag.told = true; toast('Built from other objects: move those and it follows'); } return; }
  let dx = p.x - drag.s.x, dy = p.y - drag.s.y;
  guides = [];
  const pr = drag.primary && drag.orig.get(drag.primary.id);
  if (step() && pr) { dx = snapV(pr.x + dx) - pr.x; dy = snapV(pr.y + dy) - pr.y; }
  else if (step()) { dx = snapV(dx); dy = snapV(dy); }
  else if (prefs.magnet && drag.orig.size) ({ dx, dy } = alignSnap(dx, dy));
  for (const n of doc.nodes) { const o = drag.orig.get(n.id); if (o) { n.x = o.x + dx; n.y = o.y + dy; } }
  for (const ed of doc.edges) {
    const o = drag.eorig.get(ed.id); if (!o) continue;
    if (o.pa && !ed.a) ed.pa = { x: o.pa.x + dx, y: o.pa.y + dy };
    if (o.pb && !ed.b) ed.pb = { x: o.pb.x + dx, y: o.pb.y + dy };
  }
  render();
}
/* free placement: snap the moving group's edges / centre to other nodes', with red guides */
function alignSnap(dx, dy) {
  const thr = 6 / cam.z, moving = doc.nodes.filter(n => drag.orig.has(n.id));
  const mb = bboxOf(moving.flatMap(n => corners(n).map(c => ({ x: c.x - n.x + drag.orig.get(n.id).x + dx, y: c.y - n.y + drag.orig.get(n.id).y + dy }))));
  const others = doc.nodes.filter(n => !drag.orig.has(n.id)).map(n => bboxOf(corners(n)));
  let bx = null, by = null;
  for (const o of others) {
    for (const [mv, ov2] of [[mb.l, o.l], [mb.cx, o.cx], [mb.r, o.r], [mb.l, o.r], [mb.r, o.l]]) { const d = ov2 - mv; if (Math.abs(d) < thr && (!bx || Math.abs(d) < Math.abs(bx.d))) bx = { d, x: ov2, o }; }
    for (const [mv, ov2] of [[mb.t, o.t], [mb.cy, o.cy], [mb.b, o.b], [mb.t, o.b], [mb.b, o.t]]) { const d = ov2 - mv; if (Math.abs(d) < thr && (!by || Math.abs(d) < Math.abs(by.d))) by = { d, y: ov2, o }; }
  }
  if (bx) { dx += bx.d; guides.push([{ x: bx.x, y: Math.min(mb.t, bx.o.t) - 10 }, { x: bx.x, y: Math.max(mb.b, bx.o.b) + 10 }]); }
  if (by) { dy += by.d; guides.push([{ x: Math.min(mb.l, by.o.l) - 10, y: by.y }, { x: Math.max(mb.r, by.o.r) + 10, y: by.y }]); }
  return { dx, dy };
}
function resizeDrag(p, e) {
  const { n, hx, hy, w0, h0 } = drag, rot = n.rot || 0, ctr = e.altKey && n.k !== 'text';
  const anchor = ctr ? drag.c0 : drag.anchor, f = ctr ? 2 : 1;
  const v = rotv(p.x - anchor.x, p.y - anchor.y, -rot);
  let nw = hx ? Math.max(n.k === 'dot' ? 2 : 8, hx * v.x * f) : w0, nh = hy ? Math.max(n.k === 'dot' ? 2 : 8, hy * v.y * f) : h0;
  if (n.k === 'dot') { const d = Math.min(80, Math.round(Math.max(hx ? nw : 0, hy ? nh : 0))); n.w = n.h = d; render(); return; }
  const keep = (n.k === 'image' || n.k === 'text') !== e.shiftKey;
  if (keep && hx && hy) { const s = Math.max(nw / w0, nh / h0); nw = w0 * s; nh = h0 * s; }
  if (n.k === 'text') {
    const s = hy ? nh / h0 : nw / w0;
    n.ts = { ...n.ts, size: clamp(Math.round(drag.size0 * s), 6, 160) };
    render(); return;
  }
  const st = step() && !(rot % 90) ? step() / 2 : 0;
  if (st) { if (hx) nw = Math.max(st, Math.round(nw / st) * st); if (hy) nh = Math.max(st, Math.round(nh / st) * st); }
  const need = geo.get(n.id)?.need || { w: 0, h: 0 };
  nw = Math.max(nw, need.w); nh = Math.max(nh, need.h);
  const c = ctr ? { x: 0, y: 0 } : rotv(hx * nw / 2, hy * nh / 2, rot);
  n.x = anchor.x + c.x; n.y = anchor.y + c.y; n.w = nw; n.h = nh;
  render();
}
function magnetAngle(a) {
  const t = Math.round(a / 15) * 15, d = Math.abs(a - t);
  if (!prefs.magnet) return { a, snapped: false };
  if (d <= 1.5) return { a: t, snapped: true };
  if (d < 6.5) { const k = (d - 1.5) / 5, w = 1 - k * k * (3 - 2 * k); return { a: a + (t - a) * w, snapped: false }; }
  return { a, snapped: false };
}
function rotDrag(p, sp, e) {
  const raw = Math.atan2(p.y - drag.c.y, p.x - drag.c.x) * R2D + 90;
  drag.sx = sp.x; drag.sy = sp.y;
  if (drag.orig.length === 1) {
    const o = drag.orig[0];
    let r = e.shiftKey ? { a: Math.round(raw / 15) * 15, snapped: true } : magnetAngle(((raw % 360) + 540) % 360 - 180);
    o.n.rot = Math.round(r.a * 10) / 10; drag.shown = o.n.rot; drag.snapped = r.snapped;
  } else {
    let dl = ((raw - drag.a0) % 360 + 540) % 360 - 180;
    const r = e.shiftKey ? { a: Math.round(dl / 15) * 15, snapped: true } : magnetAngle(dl);
    dl = r.a; drag.shown = dl; drag.snapped = r.snapped;
    for (const o of drag.orig) {
      const v = rotv(o.x - drag.c.x, o.y - drag.c.y, dl);
      o.n.x = drag.c.x + v.x; o.n.y = drag.c.y + v.y; o.n.rot = Math.round((o.rot + dl) * 10) / 10;
    }
  }
  render();
}

const endPtr = e => {
  ptrs.delete(e.pointerId);
  if (pinch) { if (ptrs.size < 2) pinch = null; return true; }
  return false;
};
vp.addEventListener('pointerup', e => {
  clearTimeout(longT);
  if (endPtr(e)) return;
  vp.classList.remove('panning', 'copying');
  const d = drag; drag = null; guides = [];
  if (!d) return;
  const p = evW(e);
  switch (d.t) {
    case 'move':
      if (d.moved) commit(d.before);
      else if (!e.shiftKey && d.clickId && sel.size > 1 && !e.altKey) selectOnly(d.clickId);
      else if (d.again && !e.altKey) openBar();
      break;
    case 'none': if (d.again) openBar(); break;
    case 'elab': case 'olab': if (d.moved) commit(d.before); else if (d.again) openBar(); render(); break;
    case 'create': {
      let n;
      const b = snap();
      const B = d.box;
      if (!d.moved || !B || B.r - B.l < 6 || B.b - B.t < 6) n = newNode(d.k, d.s.x, d.s.y);
      else n = newNode(d.k, (B.l + B.r) / 2, (B.t + B.b) / 2, { w: B.r - B.l, h: B.b - B.t });
      doc.nodes.push(n); sel.clear(); sel.add(n.id); render(); commit(b);
      break;
    }
    case 'edge': finishEdge(d, p); break;
    case 'compass': if (d.moved) makeCircle(d.c, compassRef(p, d.c)); else { compassPend = d.c; compassAt = p; } drawOverlay(); break;
    case 'marq': if (d.right && !d.moved && d.ctx) ctxAt(...d.ctx); break;
    case 'end': if (d.mag) { const ed = d.e, w = d.w; ed[w] = d.mag.n.id; delete ed['p' + w]; if (d.mag.pin) ed['q' + w] = d.mag.pin; else delete ed['q' + w]; landPort(ed.id + '~', ed, w, d.mag.n.id); } commit(d.before); break;
    case 'rs': case 'rot': case 'bend': case 'loop': case 'ctl': commit(d.before); break;
    case 'laser': break;
    case 'crop-h': case 'crop-pan': break;
  }
  render();
});
vp.addEventListener('pointercancel', e => { clearTimeout(longT); endPtr(e); if (drag?.before) commit(drag.before); drag = null; guides = []; vp.classList.remove('panning', 'copying'); render(); });
vp.addEventListener('pointerleave', () => { if (!drag && hov) { hov = null; drawOverlay(); } if (tool === 'laser' && !drag) { laserDot = null; kickLaser(); } });

/* ---------- wiring many at once (as in ZX Draw) ---------- */
/* text joins in when the selection is only text (labels mixed in with shapes are left out) */
const wireable = ns => { const s = ns.filter(n => n.k !== 'text'); return s.length ? s : ns; };
const fanSources = t => wireable(selNodes().filter(n => n !== t));
const fanOn = () => tool === 'edge' && !wirePend && !parMode && wireable(selNodes()).length >= (holdS ? 1 : 2);
/* many → one: every selected node gets a line to t (Shift, or holding S, keeps the sources for the next target) */
function fanTo(t, keep) {
  const src = fanSources(t); if (!src.length) return false;
  mutate(() => { const made = src.map(a => newEdge(a, t)); if (!keep) { sel.clear(); made.forEach(m => sel.add(m.id)); } });
  return true;
}
/* parallel: the source nearest t goes to t, every other source to the node at the same offset from t */
function parTargets(t) {
  const src = fanSources(t); if (!src.length) return [];
  const s0 = src.reduce((a, b) => Math.hypot(b.x - t.x, b.y - t.y) < Math.hypot(a.x - t.x, a.y - t.y) ? b : a);
  const out = [];
  for (const a of src) {
    if (a === s0) { out.push([a, t]); continue; }
    const q = { x: t.x + a.x - s0.x, y: t.y + a.y - s0.y }, tol = Math.max(30, Math.hypot(a.x - s0.x, a.y - s0.y) * .45);
    let best = null, bd = tol;
    for (const m of doc.nodes) { if (m === a || m.k === 'text') continue; const d = Math.hypot(m.x - q.x, m.y - q.y); if (d < bd) { bd = d; best = m; } }
    if (best) out.push([a, best]);
  }
  return out;
}
function parTo(t, keep) {
  const pairs = parTargets(t); if (!pairs.length) return;
  if (parMode) parMode.used = true;
  mutate(() => { const made = pairs.map(([a, b]) => newEdge(a, b)); if (!keep) { sel.clear(); made.forEach(m => sel.add(m.id)); } });
}
/* a stroke that ran through several nodes: wire them in order */
function linkChain(seq) {
  const s2 = seq.filter((n, i) => n && n !== seq[i - 1]); if (s2.length < 2) return false;
  mutate(() => { sel.clear(); for (let i = 1; i < s2.length; i++) sel.add(newEdge(s2[i - 1], s2[i]).id); });
  return true;
}
function swapNodes() {
  const ns = selNodes(); if (ns.length !== 2) return;
  /* the lines stay where they are: each shape takes over the other's connections */
  const [a, b] = ns, sw = id => id === a.id ? b.id : id === b.id ? a.id : id;
  mutate(() => { [a.x, b.x] = [b.x, a.x]; [a.y, b.y] = [b.y, a.y]; doc.edges.forEach(e => { e.a = sw(e.a); e.b = sw(e.b); }); });
}
const NB_COLS = ['#5b5bd6', '#e5484d', '#12a594', '#f76b15', '#8e4ec6', '#0090ff'];
/* where a copy of n goes when its hover dot at q is clicked: one gap out in that direction, past anything already there */
function nextSpot(n, q) {
  const { w, h } = size(n), l = toLocal(n, q), hor = Math.abs(l.x) / w >= Math.abs(l.y) / h;
  const sx = hor ? Math.sign(l.x) || 1 : 0, sy = hor ? 0 : Math.sign(l.y) || 1, dist = (hor ? w : h) + Math.max(G * 1.5, 56);
  for (let k = 1; k < 8; k++) { const c = snapP(fromLocal(n, { x: sx * dist * k, y: sy * dist * k })); if (!doc.nodes.some(o => o !== n && inside(o, c, Math.max(w, h) / 2))) return c; }
  return snapP(fromLocal(n, { x: sx * dist, y: sy * dist }));
}
function finishEdge(d, p) {
  const b = snap(), from = d.from;
  if (!d.moved && d.fan && from) { if (fanTo(from, d.keep || holdS)) return; }
  /* a click on a hover dot: a copy of the shape one step out that way, wired to it */
  if (!d.moved && d.anc && from && d.ancPt) { p = nextSpot(from, d.ancPt); d = { ...d, moved: true, target: null, chain: [] }; }
  if (!d.moved) { if (tool === 'edge' && (from || d.fp)) { wirePend = from ? from.id : { x: d.fp.x, y: d.fp.y }; hov = from; drawOverlay(); } return; }
  if (from && d.chain && d.chain.length >= 2 && linkChain([from, ...d.chain])) return;
  if (!d.moved && !from) return;
  let target = d.target;
  let ne;
  if (target) {
    ne = newEdge(from, target, d.fp, null);
    if (from && from !== target && d.fromPin) ne.qa = d.fromPin;
    if (d.mag && d.mag.n === target) { if (d.mag.pin) ne.qb = d.mag.pin; landPort('~new', ne, 'b', target.id); if (from) landPort('~new', ne, 'a', from.id); }
  }
  else if (d.anc && from) {
    const q = snapP(p);
    const m = newNode(from.k, q.x, q.y, { w: from.w, h: from.h, ...Object.fromEntries(STYLE_KEYS.map(k => [k, from[k]])), dbl: false, ts: { ...from.ts } });
    if (m.k === 'text') m.text = '';
    doc.nodes.push(m); ne = newEdge(from, m); idx.set(m.id, m); if (d.fromPin) ne.qa = d.fromPin;
  } else {
    const q = snapP(p);
    if (!from && Math.hypot(q.x - d.fp.x, q.y - d.fp.y) < 6) return;
    ne = newEdge(from, null, d.fp, q);
  }
  sel.clear(); sel.add(ne.id); render(); commit(b);
}

/* pinch / wheel */
function startPinch() {
  if (drag?.before) { doc = JSON.parse(drag.before); }
  drag = null; clearTimeout(longT);
  const [a, b] = [...ptrs.values()];
  pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), m: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, cam: { ...cam } };
  render();
}
function movePinch() {
  const [a, b] = [...ptrs.values()]; if (!a || !b) return;
  const d = Math.hypot(a.x - b.x, a.y - b.y), m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const z = clamp(pinch.cam.z * d / pinch.d, .1, 8), k = z / pinch.cam.z;
  cam.z = z; cam.x = m.x - (pinch.m.x - pinch.cam.x) * k; cam.y = m.y - (pinch.m.y - pinch.cam.y) * k; applyCam();
}
vp.addEventListener('wheel', e => {
  e.preventDefault();
  if (crop && (e.ctrlKey || e.metaKey || true) && cropWheel(e)) return;
  const s = evS(e);
  if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-e.deltaY * (e.deltaMode ? .05 : .0065)), s.x, s.y);
  else { cam.x -= e.deltaX; cam.y -= e.deltaY; applyCam(); }
}, { passive: false });

vp.addEventListener('dblclick', e => {
  if (e.target.closest('.editing') || isLocked()) return;
  const p = evW(e);
  const ol = e.target.closest('.olab');
  if (ol && !crop) { const n2 = idx.get(ol.dataset.n); if (n2) editOuter(n2, ol.dataset.s); return; }
  const elab = e.target.closest('.elab');
  let n = elab ? null : hitNode(p);
  const eg = elab || (!n && e.target.closest('[data-e]'));
  if (!n && !eg) n = boxHit(p);
  if (crop) { endCrop(); return; }
  if (n) { if (n.k === 'image') startCrop(n); else editNode(n); return; }
  if (eg) { const ed = edgeById(eg.dataset.e); if (ed) editEdgeLabel(ed, elab ? null : p); return; }
  if (tool === 'select') { const oh = outerHit(p); if (oh) { editOuter(oh.n, oh.side); return; } createText(snapP(p)); }
});
vp.addEventListener('contextmenu', e => {
  e.preventDefault();
  if (drag?.right) { drag.ctx = [e.clientX, e.clientY, evW(e), e.target]; return; }
  if (drag || e.target.closest('.editing') || isLocked()) return;
  ctxAt(e.clientX, e.clientY, evW(e), e.target);
});

/* ================= text editing ================= */
function createText(p) {
  const before = snap();
  const n = newNode('text', p.x, p.y);
  doc.nodes.push(n); sel.clear(); sel.add(n.id); render();
  editNode(n, before);
}
function editNode(n, before) {
  if (n.k === 'image' || n.k === 'dot') return;
  endEdit();
  const el = nodeEls.get(n.id); if (!el) return;
  const lab = el.lastChild;
  editing = { kind: 'node', id: n.id, lab, before: before || snap() };
  try { lab.contentEditable = 'plaintext-only'; } catch { lab.contentEditable = 'true'; }
  lab.classList.add('editing');
  lab.textContent = n.text || '';
  el._t = null;
  sel.clear(); sel.add(n.id);
  lab.focus();
  const r = document.createRange(); r.selectNodeContents(lab); const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  lab.oninput = () => { n.text = lab.innerText.replace(/\n$/, ''); render(); };
  lab.onkeydown = ev => {
    ev.stopPropagation();
    if (ev.key === 'Escape' || (ev.key === 'Enter' && !ev.shiftKey)) { ev.preventDefault(); endEdit(); }
  };
  lab.onpaste = ev => { ev.preventDefault(); document.execCommand('insertText', false, ev.clipboardData.getData('text/plain')); };
  lab.onblur = () => setTimeout(() => { if (editing && editing.lab === lab) endEdit(); }, 0);
  render();
}
function endEdit() {
  if (!editing) return;
  const ed = editing; editing = null;
  const lab = ed.lab; lab.contentEditable = 'false'; lab.classList.remove('editing'); lab.oninput = lab.onkeydown = lab.onblur = lab.onpaste = null;
  if (ed.kind === 'elab') {
    const e = edgeById(ed.id); if (e) e.label = (e.label || '').replace(/\s+$/, '');
    lab._t = null; getSelection().removeAllRanges(); render(); commit(ed.before); return;
  }
  if (ed.kind === 'olab') {
    const n = idx.get(ed.id);
    if (n && n.ol) { const v = (n.ol[ed.side] || '').replace(/\s+$/, ''); if (v) n.ol[ed.side] = v; else { delete n.ol[ed.side]; if (n.oa) { delete n.oa[ed.side]; if (!Object.keys(n.oa).length) delete n.oa; } } if (!Object.keys(n.ol).length) delete n.ol; }
    lab._t = null; getSelection().removeAllRanges(); render(); commit(ed.before); return;
  }
  const n = doc.nodes.find(x => x.id === ed.id);
  if (n) {
    n.text = (n.text || '').replace(/\s+$/, '');
    if (n.k === 'text' && !n.text) { doc.nodes = doc.nodes.filter(x => x !== n); sel.delete(n.id); }
  }
  const el = nodeEls.get(ed.id); if (el) el._t = null;
  getSelection().removeAllRanges();
  render(); commit(ed.before);
}
/* write a label in place on the canvas (line labels, outer labels): Enter or Esc ends, Shift+Enter breaks the line */
function inlineEdit(lab, text, set) {
  try { lab.contentEditable = 'plaintext-only'; } catch { lab.contentEditable = 'true'; }
  lab.classList.add('editing');
  lab.textContent = text || '';
  lab.focus();
  const r = document.createRange(); r.selectNodeContents(lab); const sl = getSelection(); sl.removeAllRanges(); sl.addRange(r);
  lab.oninput = () => { set(lab.innerText.replace(/\n$/, '')); render(); };
  lab.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Escape' || (ev.key === 'Enter' && !ev.shiftKey)) { ev.preventDefault(); endEdit(); } };
  lab.onpaste = ev => { ev.preventDefault(); document.execCommand('insertText', false, ev.clipboardData.getData('text/plain')); };
  lab.onblur = () => setTimeout(() => { if (editing && editing.lab === lab) endEdit(); }, 0);
}
/* label a line where it was double-clicked (at = a canvas point on or near the line) */
function editEdgeLabel(e, at) {
  if (isLocked()) return;
  endEdit(); closePP();
  const before = snap();
  if (at && !e.label) { const g = egeo.get(e.id) || edgeGeom(e); if (g.K || g.pts) { const h = nearestT(g, at), t = clamp(h.t, .06, .94); if (Math.abs(t - .5) > .04) e.lt = Math.round(t * 1000) / 1000; else delete e.lt; } }
  sel.clear(); sel.add(e.id);
  editing = { kind: 'elab', id: e.id, before };
  render();
  const el = elabEls.get(e.id); if (!el) { editing = null; return; }
  editing.lab = el;
  inlineEdit(el, e.label, v => { e.label = v; });
  render();
}
function editOuter(n, side) {
  if (isLocked() || n.k === 'dot' || n.k === 'text') return;
  endEdit(); closePP();
  const before = snap();
  n.ol = n.ol || {}; if (n.ol[side] == null) n.ol[side] = '';
  sel.clear(); sel.add(n.id);
  editing = { kind: 'olab', id: n.id, side, before };
  render();
  const el = olEls.get(n.id + ':' + side); if (!el) { editing = null; return; }
  editing.lab = el;
  inlineEdit(el, n.ol[side], v => { n.ol[side] = v; });
  render();
}

/* ================= crop ================= */
function startCrop(n) {
  if (!n.img || !assets[n.img]) { pickImage(n); return; }
  endEdit(); closePP();
  const { w, h } = size(n), nat = n.nat, c = cropOf(n);
  let I;
  if (n.k === 'image') { const sx = w / c.w, sy = h / c.h; I = { x: -w / 2 - c.x * sx, y: -h / 2 - c.y * sy, w: nat.w * sx, h: nat.h * sy }; }
  else { const s = Math.max(w / c.w, h / c.h); I = { x: -(c.x + c.w / 2) * s, y: -(c.y + c.h / 2) * s, w: nat.w * s, h: nat.h * s }; }
  crop = { id: n.id, n, I, B: { l: -w / 2, t: -h / 2, r: w / 2, b: h / 2 }, c0: { x: n.x, y: n.y }, before: snap() };
  sel.clear(); sel.add(n.id); render(); toast('Drag to move the picture · handles to crop · Enter to finish', 2200);
}
function applyCrop() {
  const { n, I, B, c0 } = crop, nat = n.nat;
  n.crop = { x: (B.l - I.x) / I.w * nat.w, y: (B.t - I.y) / I.h * nat.h, w: (B.r - B.l) / I.w * nat.w, h: (B.b - B.t) / I.h * nat.h };
  if (n.k === 'image') {
    const m = rotv((B.l + B.r) / 2, (B.t + B.b) / 2, n.rot || 0);
    n.x = c0.x + m.x; n.y = c0.y + m.y; n.w = B.r - B.l; n.h = B.b - B.t;
  }
  render();
}
function endCrop() { if (!crop) return; const b = crop.before; crop = null; render(); commit(b); }
function cropLocal(p) { const { n, c0 } = crop; return rotv(p.x - c0.x, p.y - c0.y, -(n.rot || 0)); }
function cropDown(e, p) {
  const h = e.target.closest('[data-h=crop]');
  const l = cropLocal(p), B = crop.B;
  if (h) { drag = { t: 'crop-h', d: h.dataset.d.split(',').map(Number) }; return; }
  if (l.x >= B.l && l.x <= B.r && l.y >= B.t && l.y <= B.b) { drag = { t: 'crop-pan', l0: l, I0: { ...crop.I } }; return; }
  endCrop();
}
function cropMove(p) {
  const l = cropLocal(p), { I, B } = crop;
  if (drag.t === 'crop-pan') {
    I.x = clamp(drag.I0.x + l.x - drag.l0.x, B.r - I.w, B.l); I.y = clamp(drag.I0.y + l.y - drag.l0.y, B.b - I.h, B.t);
  } else {
    const [hx, hy] = drag.d, m = 10;
    if (hx < 0) B.l = clamp(l.x, I.x, B.r - m); if (hx > 0) B.r = clamp(l.x, B.l + m, I.x + I.w);
    if (hy < 0) B.t = clamp(l.y, I.y, B.b - m); if (hy > 0) B.b = clamp(l.y, B.t + m, I.y + I.h);
  }
  applyCrop();
}
function cropWheel(e) {
  if (!(e.ctrlKey || e.metaKey) && crop.n.k === 'image') return false;
  const { I, B } = crop, f = Math.exp(-e.deltaY * .004), cx = (B.l + B.r) / 2, cy = (B.t + B.b) / 2;
  const minS = Math.max((B.r - B.l) / I.w, (B.b - B.t) / I.h);
  const s = Math.max(f, minS);
  const nw = I.w * s, nh = I.h * s;
  I.x = clamp(cx - (cx - I.x) * s, B.r - nw, B.l); I.y = clamp(cy - (cy - I.y) * s, B.b - nh, B.t); I.w = nw; I.h = nh;
  applyCrop(); return true;
}
function cropOverlay() {
  const { n, I, B, c0 } = crop, rot = n.rot || 0, z = cam.z;
  const P = (x, y) => S({ x: c0.x + rotv(x, y, rot).x, y: c0.y + rotv(x, y, rot).y });
  const o = P(I.x, I.y);
  let s = `<g transform="translate(${f2(o.x)},${f2(o.y)}) rotate(${rot}) scale(${z})"><image class="o-cropimg" href="${urlOf(n.img)}" width="${f2(I.w)}" height="${f2(I.h)}" preserveAspectRatio="none"/></g>`;
  const box = [P(B.l, B.t), P(B.r, B.t), P(B.r, B.b), P(B.l, B.b)];
  s += `<polygon class="o-crop" points="${box.map(q => `${f2(q.x)},${f2(q.y)}`).join(' ')}"/>`;
  if (n.k === 'image') for (const [hx, hy] of [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]]) {
    const q = P(hx < 0 ? B.l : hx > 0 ? B.r : (B.l + B.r) / 2, hy < 0 ? B.t : hy > 0 ? B.b : (B.t + B.b) / 2);
    s += `<rect class="o-crophd h" data-h="crop" data-d="${hx},${hy}" x="${f2(q.x - 4.5)}" y="${f2(q.y - 4.5)}" width="9" height="9" rx="2" style="cursor:${curFor(hx, hy, rot)}"/>`;
  }
  return s;
}
vp.addEventListener('pointermove', e => { if (crop && drag && (drag.t === 'crop-h' || drag.t === 'crop-pan')) cropMove(evW(e)); });

/* ================= laser ================= */
let laserPts = [], laserRaf = 0, laserDot = null;
const LIFE = 650;
const hexRgb = c => { const n = parseInt(c.slice(1), 16); return `${n >> 16 & 255},${n >> 8 & 255},${n & 255}`; };
function laserAdd(x, y) { if (prefs.laserMode === 'dot') { kickLaser(); return; } laserPts.push({ x, y, t: performance.now() }); kickLaser(); }
function kickLaser() { if (!laserRaf) laserRaf = requestAnimationFrame(laserTick); }
function laserTick(now) {
  laserRaf = 0;
  const dpr = devicePixelRatio || 1, w = vp.clientWidth, h = vp.clientHeight;
  if (lcv.width !== w * dpr || lcv.height !== h * dpr) { lcv.width = w * dpr; lcv.height = h * dpr; lcv.style.width = w + 'px'; lcv.style.height = h + 'px'; }
  const c = lcv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
  laserPts = laserPts.filter(p => now - p.t < LIFE);
  const lc = '255,64,64';
  c.lineCap = c.lineJoin = 'round';
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < laserPts.length; i++) {
      const a = laserPts[i - 1], b = laserPts[i], k = 1 - (now - b.t) / LIFE, wd = 1.2 + 4.8 * k;
      c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y);
      if (pass === 0) { c.strokeStyle = `rgba(${lc},${.18 * k})`; c.lineWidth = wd * 3.2; }
      else if (pass === 1) { c.strokeStyle = `rgba(${lc},${.9 * k})`; c.lineWidth = wd; }
      else { c.strokeStyle = `rgba(255,236,236,${.9 * k})`; c.lineWidth = wd * .35; }
      c.stroke();
    }
  }
  if (laserDot && tool === 'laser') {
    const R_ = prefs.laserMode === 'dot' ? 16 : 11;
    const g = c.createRadialGradient(laserDot.x, laserDot.y, 0, laserDot.x, laserDot.y, R_);
    g.addColorStop(0, `rgba(${lc},.95)`); g.addColorStop(.35, `rgba(${lc},.5)`); g.addColorStop(1, `rgba(${lc},0)`);
    c.fillStyle = g; c.beginPath(); c.arc(laserDot.x, laserDot.y, R_, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(laserDot.x, laserDot.y, R_ === 16 ? 2.6 : 1.8, 0, 7); c.fill();
  }
  if (laserPts.length) kickLaser();
}

/* ================= context bar & popovers ================= */
let ppKey = null, ppAnchor = null, ppBuild = null, ppBefore = null, barSig = '';
const chip = (c, ring) => `<span class="chip ${c === 'none' ? 'none' : ''} ${ring ? 'ring' : ''}" style="${ring ? `border-color:${c === 'none' ? '#ccc' : c}` : `background:${c === 'none' ? '#fff' : c}`}"></span>`;
const common = (arr, f) => { const v = arr.map(f); return v.every(x => x === v[0]) ? v[0] : undefined; };
function hideBar() { bar.classList.add('hide'); }
/* the style bar shows only on request (as in ZX Draw): click a selected object again, or right-click it.
   It belongs to that selection: another selection closes it; the pointer moving away fades it out. */
let barOn = false, barSel = '', barOutT = 0, layOpen = false;
const selSig = () => [...sel].sort().join(',');
function openBar() { if (!sel.size) return; layOpen = false; clearTimeout(barOutT); bar.classList.remove('out'); barOn = true; barSel = selSig(); updateBar(); requestAnimationFrame(() => bar.querySelectorAll('.seg').forEach(g => syncPill(g, g.querySelector(':scope > button.on'), true))); }
function closeBar(fade) {
  if (!barOn) return;
  if (!fade || bar.hidden) { barOn = false; updateBar(); return; }
  bar.classList.add('out'); closePP(); closeCP();
  clearTimeout(barOutT); barOutT = setTimeout(() => { bar.classList.remove('out'); barOn = false; updateBar(); }, 200);
}
/* mouse only: well away from both the bar (and its popover) and the selection → fade out */
document.addEventListener('pointermove', e => {
  if (!barOn || bar.hidden || e.pointerType !== 'mouse' || drag || bar.classList.contains('out')) return;
  if (!cpk.hidden || ppBefore != null || (document.activeElement && (bar.contains(document.activeElement) || pp.contains(document.activeElement)) && /INPUT|TEXTAREA/.test(document.activeElement.tagName))) return;
  const far = (r, m) => e.clientX < r.left - m || e.clientX > r.right + m || e.clientY < r.top - m || e.clientY > r.bottom + m;
  const ps = selNodes().flatMap(n => corners(n)); for (const ed of selEdges()) { const g = egeo.get(ed.id); if (g) ps.push(g.P, g.Q, g.mid); }
  const sb = ps.length ? bboxOf(ps.map(S)) : null, vr = vp.getBoundingClientRect();
  const selR = sb && { left: sb.l + vr.left, right: sb.r + vr.left, top: sb.t + vr.top, bottom: sb.b + vr.top };
  if (far(bar.getBoundingClientRect(), 70) && (pp.hidden || far(pp.getBoundingClientRect(), 70)) && (!selR || far(selR, 50))) closeBar(true);
}, { passive: true });
const AL = k => sv({
  l: '<path d="M4 4v16"/><rect x="7" y="6" width="11" height="4.5" rx="1"/><rect x="7" y="13.5" width="7" height="4.5" rx="1"/>',
  c: '<path d="M12 4v16"/><rect x="5.5" y="6" width="13" height="4.5" rx="1"/><rect x="8" y="13.5" width="8" height="4.5" rx="1"/>',
  r: '<path d="M20 4v16"/><rect x="6" y="6" width="11" height="4.5" rx="1"/><rect x="10" y="13.5" width="7" height="4.5" rx="1"/>',
  t: '<path d="M4 4h16"/><rect x="6" y="7" width="4.5" height="11" rx="1"/><rect x="13.5" y="7" width="4.5" height="7" rx="1"/>',
  m: '<path d="M4 12h16"/><rect x="6" y="5.5" width="4.5" height="13" rx="1"/><rect x="13.5" y="8" width="4.5" height="8" rx="1"/>',
  b: '<path d="M4 20h16"/><rect x="6" y="6" width="4.5" height="11" rx="1"/><rect x="13.5" y="10" width="4.5" height="7" rx="1"/>',
  dh: '<path d="M4 4v16M20 4v16"/><rect x="9.5" y="7" width="5" height="10" rx="1"/>',
  dv: '<path d="M4 4h16M4 20h16"/><rect x="7" y="9.5" width="10" height="5" rx="1"/>',
}[k], 16);
const ALIGN_IC = AL('l');
function alignNodes(k) {
  const ns = selNodes(); if (ns.length < 2) return;
  const bx = ns.map(n => ({ n, b: bboxOf(corners(n)) })), B = bboxOf(ns.flatMap(n => corners(n)));
  if (k === 'dh' || k === 'dv') {
    const h = k === 'dh', srt = bx.sort((p, q) => h ? p.b.cx - q.b.cx : p.b.cy - q.b.cy);
    const gap = ((h ? B.w : B.h) - srt.reduce((a, p) => a + (h ? p.b.w : p.b.h), 0)) / (srt.length - 1);
    let cur = h ? B.l : B.t;
    for (const { n, b } of srt) { if (h) { n.x += cur - b.l; cur += b.w + gap; } else { n.y += cur - b.t; cur += b.h + gap; } }
    return;
  }
  for (const { n, b } of bx) {
    if (k === 'l') n.x += B.l - b.l; if (k === 'r') n.x += B.r - b.r; if (k === 'c') n.x += B.cx - b.cx;
    if (k === 't') n.y += B.t - b.t; if (k === 'b') n.y += B.b - b.b; if (k === 'm') n.y += B.cy - b.cy;
  }
}
const bsep = '<span class="bsep"></span>';
const bb = (attr, ic, t, on) => `<button class="bb ${on ? 'on' : ''}" ${attr} title="${t}">${ic}</button>`;
/* last cell of a quick-colour row: shows the current colour when it is not a preset; click = full picker */
function anyDot(a, cur, qs) {
  const own = cur && cur !== 'none' && !qs.some(c => lc(c) === lc(cur));
  return `<button class="sdot anyc ${own ? 'on own' : ''}" data-cp="${a}" data-v="${own ? cur : '#888888'}" title="${own ? cur + ' · ' : ''}Any colour" ${own ? `style="--c:${cur}"` : ''}></button>`;
}
function updateBar() {
  const ns = selNodes(), es = selEdges();
  if (barOn && selSig() !== barSel) barOn = false;
  if ((!ns.length && !es.length) || crop || editing || !barOn) { bar.hidden = true; if (!crop) closePP(); barSig = ''; return; }
  if (drag && drag.moved) { hideBar(); return; }
  bar.classList.remove('hide');
  let h = '';
  const dots = ns.filter(n => n.k === 'dot'), shapes = ns.filter(n => n.k !== 'text' && n.k !== 'image' && n.k !== 'dot'), texts = ns.filter(n => n.k !== 'image' && n.k !== 'dot'), imgs = ns.filter(n => n.k === 'image');
  /* colour group */
  /* fill and text colour live in the second row when it shows them; no duplicate chip here */
  if (shapes.length && es.length) h += bb('data-p="fill"', chip(common(shapes, n => n.fill) ?? '#ddd'), 'Fill');
  const eOnly = es.length && !ns.length;
  /* lines only: the colour is chosen right here (quick dots), so no chip and no popover */
  if (eOnly) { const c0 = common(es, e => e.color) ?? '#1d1d1f'; h += `<span class="qgrp">` + quickOf('qLine').map((c, i) => `<button class="sdot ${lc(c) === lc(c0) ? 'on' : ''}" data-a="ecol" data-v="${c}" data-q="qLine:${i}" title="${c} · right-click to change" style="--c:${c}"></button>`).join('') + anyDot('ecol', c0, quickOf('qLine')) + qAddBtn('qLine', c0) + '</span>'; }
  else if (shapes.length || imgs.length || es.length) h += bb('data-p="stroke"', chip(common([...shapes, ...imgs], n => n.stroke) ?? common(es, e => e.color) ?? '#1d1d1f', true), es.length && !ns.length ? 'Line colour' : 'Border: colour, width, style, double');
  if (texts.length && !es.length && shapes.length) h += bb('data-p="tcolor"', `<span class="tchip" style="--c:${common(texts, n => n.ts.color) ?? '#1d1d1f'}">A</span>`, 'Text colour');
  if (ns.length && !es.length) {
    if (shapes.length) h += bsep + bb('data-p="shape"', shapes.length === 1 ? small(IC[shapes[0].k]) : IC.shape, 'Shape: kind, direction, corners');
    /* text group */
    if (texts.length) {
      const sz = common(texts, n => n.ts.size), g = f => common(texts, n => f(n.ts));
      h += bsep + `<button class="bb" data-a="tsz" data-v="-1" title="Smaller">−</button><button class="bb bnum" data-p="text" title="Text size and style">${sz ?? '–'}</button><button class="bb" data-a="tsz" data-v="1" title="Larger">+</button>`;
      h += bb('data-a="tbold"', IC.bold, 'Bold (' + MOD + 'B)', g(t => t.bold)) + bb('data-a="tital"', IC.ital, 'Italic (' + MOD + 'I)', g(t => t.italic)) + bb('data-a="tunder"', IC.under, 'Underline (' + MOD + 'U)', g(t => t.under));
    }
    /* arrange group */
    h += bsep;
    if (shapes.length === 1 || imgs.length === 1 && ns.length === 1) h += imgs.length ? bb('data-a="crop"', IC.crop, 'Crop / move the picture (double-click)') : bb('data-a="imgPick"', small(IC.image), shapes[0].img ? 'Replace the picture inside' : 'Put a picture inside');
    if (shapes.length === 1 && ns.length === 1 && !shapes[0].dep) h += bb('data-a="oladd"', IC.olab, 'Add a label outside · drag it round the shape');
    if (ns.length >= 2) h += bb('data-p="align"', ALIGN_IC, 'Align and space');
    /* layer order: laid out flat when the first row has room (dots: nothing else there), else it unfolds on click */
    const roomy = dots.length === ns.length;
    h += roomy ? `<span class="lgrp flat">` : `<span class="lgrp ${layOpen ? 'open' : ''}">${bb('data-a="layx"', IC.layers, layOpen ? 'Fold layer order' : 'Layer order', layOpen)}`;
    h += `<span class="lx">${bb('data-a="ord" data-v="top"', IC.ftop, 'Bring to front (⇧⌘])')}${bb('data-a="ord" data-v="up"', IC.front, 'Bring forward (⌘])')}${bb('data-a="ord" data-v="down"', IC.back, 'Send backward (⌘[)')}${bb('data-a="ord" data-v="bottom"', IC.fbot, 'Send to back (⇧⌘[)')}</span></span>`;
    if (ns.length === 1 && ns[0].rot) h += `<button class="bb bnum" data-a="rot0" title="Reset rotation">${f2(ns[0].rot)}°</button>`;
  }
  if (es.length && !ns.length) {
    /* style, shape, width, arrows and path are all in the second row; only the per-end heads open a panel */
    h += bsep + bb('data-p="heads"', IC.heads, 'Start and end heads');
    if (es.length === 1) h += bb('data-p="label"', IC.label, 'Label (double-click the line)');
    h += bsep + bb('data-a="flip"', IC.swap, 'Reverse direction') + bb('data-a="straight"', IC.straight, 'Straighten');
  }
  h += bsep + bb('data-a="dupl"', IC.dup, 'Duplicate (' + MOD + 'D)') + bb('data-a="del"', IC.trash, 'Delete (⌫)') + bb('data-m="more"', IC.more, 'More');
  /* second row: the common choices, one click each */
  let r2 = '';
  if (dots.length && dots.length === ns.length && !es.length) {
    const f = common(dots, n => n.fill), d0 = common(dots, n => n.w);
    /* dots are small marks: they take the strong line colours, not the pale fills */
    r2 = quickOf('qLine').map((c, i) => `<button class="sdot ${lc(c) === lc(f || '') ? 'on' : ''}" data-a="fill" data-v="${c}" data-q="qLine:${i}" title="${c} · right-click to change" style="--c:${c}"></button>`).join('')
      + anyDot('fill', f, quickOf('qLine')) + qAddBtn('qLine', f) + vs + dszSeg('dsz', d0) + dStep('dsz', d0);
  } else if (es.length && !ns.length) {
    const tl = common(es, e => e.tail || 'none'), hd = common(es, e => e.head), cur = tl + '|' + hd;
    r2 = dashSeg('edash', common(es, e => e.dash)) + vs + seg('eshape', common(es, e => e.shape || 'line'), ESHAPES) + vs
      + wdHTML('esw', common(es, e => e.sw), 0, 'wBar') + vs + seg('earrow', ARROWS.some(a => a[0] === cur) ? cur : '', ARROWS) + vs + seg('eroute', common(es, e => e.route || 'arc'), ROUTES);
  } else if (shapes.length && !es.length) {
    const f = common(shapes, n => n.fill);
    r2 = `<button class="sdot none ${f === 'none' ? 'on' : ''}" data-a="fill" data-v="none" title="No fill" style="--c:#fff"></button>`
      + quickOf('qFill').map((c, i) => `<button class="sdot ${lc(c) === lc(f || '') ? 'on' : ''}" data-a="fill" data-v="${c}" data-q="qFill:${i}" title="${c} · right-click to change" style="--c:${c}"></button>`).join('')
      + anyDot('fill', f, quickOf('qFill')) + qAddBtn('qFill', f)
      + vs + (off => offG(off, wdHTML('sw', off ? null : common(shapes, n => n.sw), 0, 'wBar') + vs + dashSeg('sd', off ? null : common(shapes, n => n.sd || 'solid'))))(common(shapes, n => n.stroke) === 'none');
  } else if (texts.length && !es.length) {
    const c0 = common(texts, n => n.ts.color);
    r2 = quickOf('qText').map((c, i) => `<button class="sdot ${lc(c) === lc(c0 || '') ? 'on' : ''}" data-a="tcol" data-v="${c}" data-q="qText:${i}" title="${c} · right-click to change" style="--c:${c}"></button>`).join('')
      + anyDot('tcol', c0, quickOf('qText')) + qAddBtn('qText', c0)
      + vs + tszHTML('tsize', common(texts, n => n.ts.size), 'tBar');
  }
  if (!es.length) {
    const cn = ns.filter(n => n.k !== 'dot' && EB.has(n.id)), pn = ns.filter(n => hasPorts(n) && EB.has(n.id));
    if (cn.length) r2 += (r2 ? vs : '') + seg('catt', common(cn, attOf) ?? null, ATTS);
    if (pn.length) r2 += (r2 ? vs : '') + seg('play', common(pn, n => n.lay || '') ?? null, LAYS);
  }
  h = h.replace(/^(<span class="bsep"><\/span>)+/, '');
  h = `<div class="brow">${h}</div>${r2 ? `<div class="brow2">${r2}</div>` : ''}`;
  if (h !== barSig) {
    if (!patchHTML(bar, h)) { bar.innerHTML = h; bar._sig = sigOf(h); initSegs(bar); }
    barSig = h; if (ppKey) bar.querySelector(`[data-p="${ppKey}"]`)?.classList.add('open');
  }
  bar.hidden = false;
  placeBar();
}
function placeBar() {
  if (bar.hidden) return;
  const ns = selNodes(), es = selEdges();
  const ps = ns.flatMap(n => corners(n)); for (const e of es) if (egeo.get(e.id)) ps.push(egeo.get(e.id).P, egeo.get(e.id).Q, egeo.get(e.id).mid);
  if (!ps.length) return;
  const b = bboxOf(ps.map(S)), bw = bar.offsetWidth, bh = bar.offsetHeight;
  let x = clamp(b.cx - bw / 2, 8, innerWidth - bw - 8), y = b.t - bh - (ns.length === 1 ? 46 : 18);
  if (y < 62) y = Math.min(b.b + 16, innerHeight - bh - 70);
  bar.style.left = x + 'px'; bar.style.top = y + 'px';
  if (ppKey && ppAnchor && !pp.hidden) placePop(pp, ppAnchor);
}
bar.addEventListener('pointerdown', e => e.stopPropagation());
bar.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.p) { clearTimeout(hovT); if (ppKey === b.dataset.p) { if (ppHover) { ppHover = false; return; } closePP(); } else openPP(b.dataset.p, b); return; }
  if (b.dataset.m) { const r = b.getBoundingClientRect(); ctxItems(r.left, r.bottom + 6, true); return; }
  if (b.dataset.a === 'layx') { layOpen = !layOpen; updateBar(); return; }
  if (b.dataset.a) { act(b.dataset.a, b.dataset.v); if (barOn && sel.size) { barSel = selSig(); updateBar(); } }
});
/* next to a side dock the sub-bar stands upright: its popovers open beside it, level with the button */
function besideSub(el, r) {
  const side = sub.dataset.side || 'bottom';
  if (side === 'bottom' || !el._fromSub) return false;
  const sr = sub.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
  const x = side === 'left' ? Math.min(sr.right + 10, innerWidth - w - 8) : Math.max(8, sr.left - w - 10), y = clamp(r.top + r.height / 2 - h / 2, 8, Math.max(8, innerHeight - h - 8));
  el.style.left = x + 'px'; el.style.top = y + 'px';
  el.classList.remove('up', 'below'); el.dataset.beside = side;
  el.style.setProperty('--ay', clamp(r.top + r.height / 2 - y, 12, h - 12) + 'px');
  return true;
}
function placePop(el, anchor) {
  el._fromSub = !!(anchor.closest && anchor.closest('#sub')); delete el.dataset.beside;
  if (el._fromSub && besideSub(el, anchor.getBoundingClientRect())) return;
  const r = anchor.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
  let x = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8), y = r.bottom + 8;
  if (anchor.closest && anchor.closest('#bar')) {
    const br = bar.getBoundingClientRect();
    y = br.top - h - 8; if (y < 8) y = br.bottom + 8;
    el.classList.toggle('up', y < br.top);
  } else el.classList.toggle('up', false);
  if (y + h > innerHeight - 8) { y = Math.max(8, r.top - h - 8); el.classList.add('up'); }
  el.style.left = x + 'px'; el.style.top = y + 'px';
}
const BUILD = {};
BUILD.align = () => {
  const many = selNodes().length >= 3;
  return `<div class="row">${['l', 'c', 'r'].map(k => ib('al', AL(k), { l: 'Align left', c: 'Align centres', r: 'Align right' }[k], false, k)).join('')}${vs}${['t', 'm', 'b'].map(k => ib('al', AL(k), { t: 'Align top', m: 'Align middles', b: 'Align bottom' }[k], false, k)).join('')}${many ? vs + ib('al', AL('dh'), 'Space evenly across', false, 'dh') + ib('al', AL('dv'), 'Space evenly down', false, 'dv') : ''}</div>`;
};
BUILD.tcolor = () => palHTML('tcol', common(selNodes().filter(n => n.k !== 'image'), n => n.ts.color), false);
let ppHover = false, hovT = 0, leaveT = 0, outT = 0, glideT = 0, enterT = 0;
function openPP(key, anchor, build, hover) {
  closeMenu(); clearTimeout(outT); pp.classList.remove('out');
  const was = !pp.hidden;
  ppKey = key; ppAnchor = anchor; ppBuild = build || BUILD[key]; ppHover = !!hover;
  $$('#bar .bb.open').forEach(b => b.classList.remove('open')); anchor.classList?.add('open');
  /* already open: glide to the new button and fade the new content in, instead of popping again */
  pp.classList.toggle('glide', was); clearTimeout(glideT); if (was) glideT = setTimeout(() => pp.classList.remove('glide'), 260);
  /* the entrance plays once per opening: once settled, dropping glide / out or flipping up never replays it (that was the flash) */
  clearTimeout(enterT);
  if (!was) { pp.classList.remove('settled'); enterT = setTimeout(() => pp.classList.add('settled'), 240); } else pp.classList.add('settled');
  const html0 = ppBuild(); pp.hidden = false; pp.innerHTML = html0; pp._sig = sigOf(html0); initSegs(pp); placePop(pp, anchor);
  if (!hover) pp.querySelector('[autofocus]')?.focus();
}
/* bar popovers follow the mouse: open on hover, fade out shortly after the pointer leaves both the button and the popover */
function fadeClosePP() {
  if (pp.hidden) return;
  pp.classList.add('out'); clearTimeout(outT);
  outT = setTimeout(() => { pp.classList.remove('out'); if (ppHover) closePP(); }, 150);
}
function schedLeave() {
  clearTimeout(leaveT);
  leaveT = setTimeout(() => {
    if (!ppHover || pp.hidden) return;
    const ae = document.activeElement;
    if (ae && pp.contains(ae) && ae.matches('input:not([type=range]):not([type=checkbox]), textarea')) return;
    if (!cpk.hidden || ppBefore != null || pp.matches(':hover') || bar.querySelector('[data-p]:hover') || (ppAnchor && ppAnchor.matches && ppAnchor.matches(':hover'))) return;
    fadeClosePP();
  }, 280);
}
bar.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse') return;
  const b = e.target.closest('button'); clearTimeout(hovT);
  if (!b || !b.dataset.p) { if (ppHover) schedLeave(); return; }
  clearTimeout(leaveT);
  if (ppKey === b.dataset.p) { if (pp.classList.contains('out')) { clearTimeout(outT); pp.classList.remove('out'); } return; }
  if (!pp.hidden && !ppHover) return;   // a popover opened by a click stays until clicked away
  hovT = setTimeout(() => openPP(b.dataset.p, b, null, true), pp.hidden ? 120 : 40);
});
bar.addEventListener('pointerleave', e => { clearTimeout(hovT); if (e.pointerType === 'mouse' && ppHover) schedLeave(); });
pp.addEventListener('pointerenter', () => { clearTimeout(leaveT); if (pp.classList.contains('out')) { clearTimeout(outT); pp.classList.remove('out'); } });
pp.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && ppHover) schedLeave(); });
function refreshPP() {
  if (!ppKey || pp.hidden) return;
  if (!selNodes().length && !selEdges().length && !ppKey.startsWith('_')) { closePP(); return; }
  const old = $$('.seg > .pill', pp).map(p => ({ transform: p.style.transform, width: p.style.width, height: p.style.height }));
  const sw2 = Object.fromEntries($$('input.sw2', pp).map(i => [i.dataset.a, i.checked]));
  const st = pp.scrollTop, foc = document.activeElement && pp.contains(document.activeElement) ? document.activeElement.dataset.a : null;
  const html = ppBuild();
  if (!patchHTML(pp, html)) { pp.innerHTML = html; pp._sig = sigOf(html); initSegs(pp, old); pp.scrollTop = st; }
  for (const i of $$('input.sw2', pp)) if (i.dataset.a in sw2 && sw2[i.dataset.a] !== i.checked) { const v = i.checked; i.checked = !v; requestAnimationFrame(() => (i.checked = v)); }
  if (foc) pp.querySelector(`[data-a="${foc}"]`)?.focus();
  if (ppAnchor?.isConnected) placePop(pp, ppAnchor);
  else { const nb = bar.querySelector(`[data-p="${ppKey}"]`); if (nb) { ppAnchor = nb; nb.classList.add('open'); placePop(pp, nb); } }
  if (cp) cpPlace();
}
function closePP() { if (pp.hidden) return; closeCP(); pp.hidden = true; ppHover = false; pp.classList.remove('out', 'glide', 'settled'); clearTimeout(enterT); ppKey = null; ppAnchor = null; $$('.bb.open').forEach(b => b.classList.remove('open')); }
document.addEventListener('pointerdown', e => {
  if (!pp.hidden && !pp.contains(e.target) && !e.target.closest('#cpk') && !bar.contains(e.target) && !e.target.closest('#dock') && !e.target.closest('.top')) closePP();
  if (!menu.hidden && !menu.contains(e.target)) closeMenu();
}, true);

const vs = '<span class="vsep"></span>';
/* colour popovers: the quick row (yours, editable); the full palette only when asked for (the ring cell) */
function palHTML(a, cur, none = true, forceFull) {
  if (forceFull || pp._full) return (forceFull ? '' : quickRowHTML(a, cur, none, true)) + palFull(a, cur, none);
  return quickRowHTML(a, cur, none, false);
}
function quickRowHTML(a, cur, none, open) {
  const k = a === 'fill' || (a === 'x' && none) ? 'qFill' : a === 'tcol' || a === 'x' ? 'qText' : 'qLine', qs = quickOf(k);
  const own = cur && cur !== 'none' && !qs.some(c => lc(c) === lc(cur));
  return `<div class="qrow">${none ? `<button class="sdot none ${cur === 'none' ? 'on' : ''}" data-a="${a}" data-v="none" title="None" style="--c:#fff"></button>` : ''}`
    + qs.map((c, i) => `<button class="sdot ${lc(c) === lc(cur || '') ? 'on' : ''}" data-a="${a}" data-v="${c}" data-q="${k}:${i}" title="${c} · right-click to change" style="--c:${c}"></button>`).join('')
    + `<button class="sdot anyc ${own ? 'on own' : ''} ${open ? 'open' : ''}" data-pfull="1" title="${open ? 'Fewer colours' : 'All colours'}" ${own ? `style="--c:${cur}"` : ''}></button>` + qAddBtn(k, cur) + '</div>';
}
function palFull(a, cur, none = true) {
  const btn = c => `<button class="sw ${c === cur ? 'on' : ''}" data-a="${a}" data-v="${c}" style="background:${c}" title="${c}"></button>`;
  const hex = /^#[0-9a-f]{6}$/i.test(cur || '') ? cur : '#5b5bd6';
  const known = cur === 'none' || TONE_NAMES.some(t => PAL[t].includes(cur));
  const extra = [];
  if (none) extra.push(`<button class="sw none ${cur === 'none' ? 'on' : ''}" data-a="${a}" data-v="none" title="None"></button>`);
  extra.push(`<button class="sw custom ${cur && !known ? 'on' : ''}" data-cp="${a}" data-v="${hex}" title="Any colour: picker, hex, rgb, hsl" ${cur && !known ? `style="--cc:${cur}"` : ''}></button>`);
  while (extra.length < TONE_NAMES.length) extra.push('<i></i>');
  return `<div class="pal pfx">${TONE_NAMES.map((t, i) => PAL[t].map(btn).join('') + extra[i]).join('')}</div>`;
}
/* editable presets (right-click one to change it); a value set elsewhere shows as an extra item at the end */
const PDEF = { dash: ['solid', 'dash', 'dot'], wBar: [1, 1.5, 2.5, 4], wSub: [1, 1.5, 2.5], tBar: [11, 13, 15, 18, 24], tSub: [13, 15, 18, 24] };
const PMAX = 8;
/* style presets: a whole look in one click (width + dashes + wave/zigzag + colour); right-click edits it in a full panel */
const SDEF = {
  bSty: [{ sw: 1 }, { sw: 1.5 }, { sw: 2.5 }, { sw: 1.5, sd: 'dash' }],
  lSty: [{ sw: 1.4 }, { sw: 2.5 }, { sw: 1.4, dash: 'dash' }, { sw: 1.4, dash: 'dot' }, { sw: 1.4, shape: 'wave' }],
};
Object.assign(PDEF, SDEF, { dSz: [3, 5, 8, 12, 16] });
const STY_KEYS = { bSty: { sw: 'sw', dash: 'sd', col: 'stroke' }, lSty: { sw: 'sw', dash: 'dash', col: 'color', shape: 'shape' } };
function styIc(p, line) {
  const w = Math.min(4.2, Math.max(.8, (p.sw || 1.5) * 1.1)), dk = line ? p.dash : p.sd, pt = dashPat(dk), col = p.col || 'currentColor';
  const da = pt ? (pt[0] ? `stroke-dasharray="${pt[0] * 1.3 + w * .6} ${pt[1] * 1.3 + w * .5}"` : `stroke-dasharray="0 ${pt[1] * 1.3 + w + 1}"`) : '';
  const d = { line: 'M3 6h18', double: 'M3 4h18M3 8h18', wave: 'M3 6c1.5-3.6 3-3.6 4.5 0s3 3.6 4.5 0 3-3.6 4.5 0 3 3.6 4.5 0', zig: 'M3 6l2.3-3.2 4.5 6.4 4.5-6.4 4.5 6.4L21 6' }[(line && p.shape) || 'line'];
  return `<svg width="24" height="12" viewBox="0 0 24 12" fill="none"><path d="${d}" stroke="${col}" stroke-width="${(line && p.shape === 'double') ? Math.min(w, 1.6) : w}" stroke-linecap="round" stroke-linejoin="round" ${da}/></svg>`;
}
const styOf = (pk, cur) => { const K = STY_KEYS[pk], o = { sw: cur[K.sw] }; o.dash = cur[K.dash] || 'solid'; if (K.shape) o.shape = cur[K.shape] || 'line'; o.col = cur[K.col]; return o; };
const styMatch = (p, o, line) => (p.sw ?? 1.5) === o.sw && ((line ? p.dash : p.sd) || 'solid') === o.dash && (!line || (p.shape || 'line') === o.shape) && (!p.col || lc(p.col) === lc(o.col || ''));
function stySeg(a, pk, cur) {
  const ls = presetOf(pk), line = pk === 'lSty', o = styOf(pk, cur), off = !line && cur.stroke === 'none', hit = off ? -1 : ls.findIndex(p => styMatch(p, o, line));
  const name = p => [`${p.sw ?? 1.5}px`, (line ? p.dash : p.sd) && (line ? p.dash : p.sd) !== 'solid' ? dashName(line ? p.dash : p.sd).toLowerCase() : '', line && p.shape && p.shape !== 'line' ? p.shape : '', p.col || ''].filter(Boolean).join(' · ');
  return `<div class="seg sty ${off ? 'off' : ''}" ${off ? 'title="No border · pick a style to add one"' : ''}>${ls.map((p, i) => `<button class="${i === hit ? 'on' : ''}" data-a="${a}" data-v="${i}" data-sk="${pk}:${i}" title="${name(p)} · right-click to edit">${styIc(p, line)}</button>`).join('')}</div>${paddBtn(pk)}`;
}
/* the full editor for one style preset (opens on right-click, or after +) */
function openStyEd(btn) {
  const [pk, si] = btn.dataset.sk.split(':'), i = +si, line = pk === 'lSty';
  const build = () => {
    const p = presetOf(pk)[i]; if (!p) return '';
    const sw = p.sw ?? 1.5, dk = (line ? p.dash : p.sd) || 'solid';
    return `<div class="row">${wdHTML('sw', sw, [1, 1.5, 2.5, 4])}${wStep('sw', sw)}${vs}${seg('dash', dk, DASHES.concat(/^d:/.test(dk) ? [[dk, lineIc(dk), dashName(dk)]] : []))}${line ? vs + seg('shape', p.shape || 'line', ESHAPES) : ''}</div>`
      + palHTML('col', p.col || '', false)
      + `<div class="sty-foot"><span class="sty-prev">${styIc(p, line)}</span><span class="grow"></span><button class="tbtn warn" data-a="sdel" ${presetOf(pk).length > 1 ? '' : 'disabled'}>Delete preset</button></div>`;
  };
  pp._edge = (a, v) => {
    const ls = presetOf(pk).map(x => ({ ...x })), p = ls[i]; if (!p) return;
    if (a === 'sdel') { if (ls.length > 1) { ls.splice(i, 1); setPreset(pk, ls); } closePP(); return; }
    if (a === 'sw') { if (!(+v > 0)) return; p.sw = Math.min(12, +v); }
    else if (a === 'dash') { if (line) p.dash = v; else p.sd = v; }
    else if (a === 'shape') p.shape = v;
    else if (a === 'col') p.col = v === 'none' ? undefined : v;
    else return;
    setPreset(pk, ls);
  };
  openPP('_sty', btn, build);
}
document.addEventListener('contextmenu', e => {
  const b = e.target.closest('[data-sk]'); if (!b) return;
  e.preventDefault(); e.stopImmediatePropagation(); closeQ(); openStyEd(b);
}, true);
/* default corner radius of the round-corners switch: right-click it to set */
const radPre = () => (prefs.pw && prefs.pw.rad) || 6;
function openRadEd(btn) {
  pp._edge = (a, v) => {
    if (a !== 'radp' && a !== 'radpn') return;
    const n = clamp(Math.round(+v), 1, 60); if (!(n > 0)) return;
    prefs.pw = prefs.pw || {}; prefs.pw.rad = n; savePrefs();
    const D = kk => (prefs.defs[kk] ||= {}); if ((defOf('rect').rad || 0) > 0) ['rect', 'diamond'].forEach(k2 => (D(k2).rad = n)); savePrefs();
    drawSub(true); refreshPP();
  };
  openPP('_rad', btn, () => { const r = radPre(); return `<div class="row"><span class="lbl">Corner radius</span><span class="nstep"><button data-a="radp" data-v="${Math.max(1, r - 1)}">−</button><input class="nnum" inputmode="numeric" data-a="radpn" value="${r}"><button data-a="radp" data-v="${r + 1}">+</button></span>${vs}${seg('radp', r, [2, 4, 6, 10, 16].map(x => [x, `<span class="tnum">${x}</span>`, x + 'px']))}</div>`; });
}
document.addEventListener('contextmenu', e => {
  const b = e.target.closest('[data-a="s:round"], #pp [data-a="round"]'); if (!b) return;
  e.preventDefault(); e.stopImmediatePropagation(); openRadEd(b);
}, true);
/* "+" at the end of a preset row: adds one and opens its little editor; folds away when the row is full */
const paddBtn = pk => `<button class="padd ${presetOf(pk).length >= PMAX ? 'full' : ''}" data-padd="${pk}" title="Add a preset">${sv('<path d="M12 6v12M6 12h12"/>', 12)}</button>`;
const presetOf = pk => (prefs.pw && Array.isArray(prefs.pw[pk]) && prefs.pw[pk].length ? prefs.pw[pk] : PDEF[pk]);
const wdBtn = (a, w, cur, extra) => `<button class="${w === cur ? 'on' : ''} ${extra && extra.temp ? 'temp' : ''}" data-a="${a}" data-v="${w}" ${extra ? extra.attr : ''} title="${w}px${extra ? (extra.temp ? ' · right-click to keep' : ' · right-click to change') : ''}">${lineIc('solid', Math.min(4.5, w * 1.1))}</button>`;
const wdHTML = (a, cur, ws_ = WIDTHS, pk, noTemp) => {
  if (pk) ws_ = presetOf(pk);
  const own = pk && !noTemp && typeof cur === 'number' && !ws_.includes(cur);
  return `<div class="seg">${ordSort(ws_, w => w, ORD.seg[a]).map(w => wdBtn(a, w, cur, pk && { attr: `data-pk="${pk}:${ws_.indexOf(w)}"` })).join('')}${own ? wdBtn(a, cur, cur, { temp: 1, attr: `data-pt="${pk}"` }) : ''}</div>${pk ? paddBtn(pk) : ''}`;
};
/* exact width: − value + (any value; it then shows as the extra item in the preset rows) */
const dStep = (a, cur) => {
  const c = typeof cur === 'number' ? cur : 8;
  return `<span class="nstep" title="Exact size (px)"><button data-a="${a}" data-v="${Math.max(2, c - 1)}">−</button><input class="nnum" inputmode="decimal" data-a="${a}" value="${typeof cur === 'number' ? cur : ''}"><button data-a="${a}" data-v="${Math.min(80, c + 1)}">+</button></span>`;
};
const wStep = (a, cur) => {
  const c = typeof cur === 'number' ? cur : 1.5, st = c < 1 ? .25 : .5, r4 = x => Math.round(x * 4) / 4;
  return `<span class="nstep" title="Exact width (px)"><button data-a="${a}" data-v="${Math.max(.25, r4(c - st))}">−</button><input class="nnum" inputmode="decimal" data-a="${a}" value="${typeof cur === 'number' ? cur : ''}"><button data-a="${a}" data-v="${Math.min(12, r4(c + st))}">+</button></span>`;
};
const tszPx = n => n <= 15 ? n - .5 : Math.min(22, 14.5 + (n - 15) * .45);
const tszLab = n => `<span class="tsz"><span class="tsA" style="font-size:${tszPx(n)}px">A</span><span class="tsN">${n}</span></span>`;
const tszHTML = (a, cur, pk) => {
  const ls = presetOf(pk), own = typeof cur === 'number' && !ls.includes(cur);
  const b = (n, attr, temp) => `<button data-a="${a}" data-v="${n}" ${attr} class="${n === cur ? 'on' : ''} ${temp ? 'temp' : ''}" title="Text size ${n} · right-click to ${temp ? 'keep' : 'change'}">${tszLab(n)}</button>`;
  return `<div class="seg">${ordSort(ls, n => n, ORD.seg[a]).map(n => b(n, `data-pk="${pk}:${ls.indexOf(n)}"`)).join('')}${own ? b(cur, `data-pt="${pk}"`, 1) : ''}</div>${paddBtn(pk)}`;
};
const seg = (a, cur, opts) => `<div class="seg">${ordSort(opts, o => o[0], ORD.seg[a]).map(([v, lab, ttl]) => `<button data-a="${a}" data-v="${v}" class="${String(v) === String(cur) ? 'on' : ''}" title="${ttl || ''}">${lab}</button>`).join('')}</div>`;
const sw2 = (a, on) => `<input type="checkbox" class="sw2" data-a="${a}" ${on ? 'checked' : ''}>`;
const lbl = t => `<span class="lbl">${t}</span>`;
const ib = (a, ic, t, on, v = '') => `<button class="wd ${on ? 'on' : ''}" data-a="${a}" data-v="${v}" title="${t}">${ic}</button>`;
const small = ic => ic.replace(/width="18" height="18"/, 'width="16" height="16"');
const DASHES = [['solid', lineIc('solid'), 'Solid'], ['dash', lineIc('dash'), 'Dashed'], ['dot', lineIc('dot', 2.2), 'Dotted']];
const dashName = v => v === 'solid' ? 'Solid' : v === 'dash' ? 'Dashed' : v === 'dot' ? 'Dotted' : (p => p && !p[0] ? `Dots · gap ${p[1]}` : p ? `Dashes ${p[0]} · gap ${p[1]}` : v)(dashPat(v));
const dashSeg = (a, cur) => {
  const ls = presetOf('dash'), own = cur && !ls.includes(cur);
  const b = (v, attr, temp) => `<button data-a="${a}" data-v="${v}" ${attr} class="${v === cur ? 'on' : ''} ${temp ? 'temp' : ''}" title="${dashName(v)} · right-click to ${temp ? 'keep' : 'change'}">${lineIc(v, v === 'dot' ? 2.2 : 1.8)}</button>`;
  return `<div class="seg">${ordSort(ls, v => v, ORD.seg[a]).map(v => b(v, `data-pk="dash:${ls.indexOf(v)}"`)).join('')}${own ? b(cur, 'data-pt="dash"', 1) : ''}</div>${paddBtn('dash')}`;
};
const ROUTES = [['arc', 'M4 17Q12 2 20 17', 'Arc: drag the middle to bend'], ['bez', 'M4 18C5 6 19 18 20 6', 'Bézier: two handles'], ['s', 'M4 18C12 18 12 6 20 6', 'S-curve'], ['elbow', 'M4 18H12V6H20', 'Elbow'], ['elbowr', 'M4 18H9a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3h5', 'Rounded elbow']]
  .map(([k, d, t]) => [k, sv(`<path d="${d}"/>${k === 'bez' ? '<path d="M4 18L5 6M20 6L19 18" stroke-width=".9" opacity=".5"/><circle cx="5" cy="6" r="1.4" fill="currentColor"/><circle cx="19" cy="18" r="1.4" fill="currentColor"/>' : ''}`, 18), t]);
const ESHAPES = [['line', 'Line'], ['double', 'Double line'], ['wave', 'Wavy'], ['zig', 'Zigzag']].map(([k, t]) => [k, shapeIc(k), t]);
const HEAD_NAMES = { none: 'None', vee: 'Arrow', tri: 'Filled triangle', otri: 'Open triangle', two: 'Double head', circ: 'Dot', ocirc: 'Circle', bar: 'Bar', hook: 'Hook', ray: 'Ray: runs on one grid step and fades' };
const headOpts = back => HEADS.map(t => [t, headIc(t, back), HEAD_NAMES[t]]);
const KINDS = [['circle', small(IC.circle), 'Circle'], ['rect', small(IC.rect), 'Box'], ['tri', small(IC.tri), 'Triangle'], ['diamond', small(IC.diamond), 'Diamond']];
const DIRS = ['up', 'right', 'down', 'left'].map(d => [d, triIc(d), 'Points ' + d]);
const diaIc = (w, h) => sv(`<path d="M12 ${12 - h}L${12 + w} 12L12 ${12 + h}L${12 - w} 12Z"/>`, 18);
const DIAS = [['sq', diaIc(7.5, 7.5), 'Square diamond (equal sides)'], ['wide', diaIc(9, 5.5), 'Wide'], ['tall', diaIc(5.5, 9), 'Tall']];
const DIA_SZ = { sq: [56, 56], wide: [76, 48], tall: [48, 76] };
const diaOf = d => d.w === d.h ? 'sq' : d.w > d.h ? 'wide' : 'tall';
const DBL_IC = sv('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5"/>', 16);
const RND_IC = sv('<path d="M4 20V10a6 6 0 016-6h10"/>', 16);
const SIZE_OPTS = [[11, 10.5], [13, 12.5], [15, 14.5], [18, 16.5], [24, 18.5], [32, 21]].map(([n, px]) => [n, `<span class="tsz"><span class="tsA" style="font-size:${px}px">A</span><span class="tsN">${n}</span></span>`, `Text size ${n}`]);

BUILD.fill = () => palHTML('fill', common(selNodes().filter(shp), n => n.fill));
BUILD.stroke = () => {
  const ns = selNodes().filter(n => n.k !== 'text'), es = selEdges();
  if (!ns.length) return palHTML('ecol', common(es, e => e.color), false);
  const off = common(ns, n => n.stroke) === 'none', c = f => (off ? null : common(ns, f));
  return `<div class="row">${offG(off, wdHTML('sw', c(n => n.sw), 0, 'wBar') + wStep('sw', c(n => n.sw)) + vs + dashSeg('sd', c(n => n.sd || 'solid')) + vs + ib('dbl', DBL_IC, 'Double border', !!c(n => !!n.dbl), c(n => !!n.dbl) ? '' : '1'))}</div>${palHTML('stroke', common(ns, n => n.stroke))}`;
};
BUILD.shape = () => {
  const ns = selNodes().filter(shp), k = common(ns, n => n.k);
  let h = `<div class="row">${seg('kind', k, [...KINDS, ['text', small(IC.text), 'Text only']])}`;
  if (ns.some(n => n.k === 'tri')) h += vs + seg('dir', common(ns, n => n.dir || 'up'), DIRS);
  if (ns.some(n => n.k !== 'circle')) {
    const r = common(ns, n => n.rad || 0) ?? 6;
    h += vs + ib('round', RND_IC, 'Rounded corners', r > 0, r > 0 ? '' : '1');
    if (r > 0) h += `<span class="nstep" title="Corner radius"><button data-a="radd" data-v="-1" title="Less round">−</button><input class="nnum" inputmode="numeric" value="${r}" data-a="rad"><button data-a="radd" data-v="1" title="More round">+</button></span>`;
  }
  return h + vs + ib('fitText', small(IC.fit), 'Fit to text') + '</div>';
};
/* the bar already has − size +, B I U and the colours; this panel only adds every size and vertical text */
const ALL_SIZES = [9, 11, 13, 15, 18, 21, 24, 28, 32, 40, 48, 64];
BUILD.text = () => {
  const ns = selNodes().filter(n => n.k !== 'image'), g = f => common(ns, n => f(n.ts)), sz = g(t => t.size), vert = !!g(t => !!t.vert);
  return `<div class="row">${seg('tsize', sz, ALL_SIZES.map(n => [n, `<span class="tnum">${n}</span>`, `Size ${n}`]))}${vs}${ib('tvert', IC.vert, vert ? 'Horizontal text' : 'Vertical text', vert, vert ? '0' : '1')}</div>`;
};
BUILD.image = () => {
  const n = selNodes()[0]; if (!n) return '';
  return `<div class="row">${ib('imgPick', small(IC.image), n.img ? 'Replace picture' : 'Insert picture')}${n.img ? ib('crop', IC.crop, 'Crop / move picture') + ib('imgDel', IC.trash, 'Remove picture') : ''}</div>`;
};
BUILD.layer = () => `<div class="row">${ib('ord', IC.ftop, 'Bring to front (⇧⌘])', false, 'top')}${ib('ord', IC.front, 'Bring forward (⌘])', false, 'up')}${ib('ord', IC.back, 'Send backward (⌘[)', false, 'down')}${ib('ord', IC.fbot, 'Send to back (⇧⌘[)', false, 'bottom')}</div>`;
BUILD.line = () => {
  const es = selEdges();
  return `<div class="row">${dashSeg('edash', common(es, e => e.dash))}${vs}${seg('eshape', common(es, e => e.shape || 'line'), ESHAPES)}${vs}${wdHTML('esw', common(es, e => e.sw), 0, 'wBar')}${wStep('esw', common(es, e => e.sw))}${vs}${ib('straight', IC.straight, 'Straighten')}${ib('flip', IC.swap, 'Reverse direction')}</div><div class="row">${seg('eroute', common(es, e => e.route || 'arc'), ROUTES)}</div>`;
};
BUILD.heads = () => {
  const es = selEdges();
  return `<div class="row"><span class="lbl sm">Start</span>${seg('tail', common(es, e => e.tail), headOpts(true))}</div><div class="row"><span class="lbl sm">End</span>${seg('head', common(es, e => e.head), headOpts(false))}</div>`;
};
const LP_IC = {
  auto: sv('<path d="M4 15h16"/><text x="12" y="10.5" font-size="8.5" text-anchor="middle" fill="currentColor" stroke="none" font-family="Georgia,serif" font-style="italic">a</text><path d="M18.5 4.5l1.5 1.5-1.5 1.5" stroke-width="1.1"/>', 16),
  l: sv('<path d="M4 15h16"/><rect x="8" y="5" width="8" height="5.5" rx="1.5" fill="currentColor" stroke="none" opacity=".75"/>', 16),
  on: sv('<path d="M4 12h4M16 12h4"/><rect x="8" y="9.2" width="8" height="5.6" rx="1.5" fill="currentColor" stroke="none" opacity=".75"/>', 16),
  r: sv('<path d="M4 9h16"/><rect x="8" y="13.5" width="8" height="5.5" rx="1.5" fill="currentColor" stroke="none" opacity=".75"/>', 16),
};
BUILD.olab = () => {
  const n = selNodes()[0]; if (!n) return '';
  const o = n.ol || {}, T = { t: 'Above', b: 'Below', l: 'Left', r: 'Right' };
  const b = sd => `<button class="olb ol-${sd} ${o[sd] ? 'on' : ''}" data-a="oled" data-v="${sd}" title="${T[sd]}">${o[sd] ? `<span class="olt">${texHTML(o[sd])}</span>` : '<i></i>'}</button>`;
  return `<div class="olpad">${b('t')}${b('l')}<span class="olc"></span>${b('r')}${b('b')}</div>`;
};
BUILD.label = () => {
  const e = selEdges()[0]; if (!e) return '';
  return `<div class="row"><input class="tin lab-in" data-a="elabel" value="${esc(e.label || '')}" placeholder="label · $math$" autofocus spellcheck="false">${vs}${seg('lp', (s0 => s0 === 0 ? 'on' : s0 > 0 ? 'l' : 'r')(lpSide(e, egeo.get(e.id) || edgeGeom(e))), [['l', LP_IC.l, 'One side'], ['on', LP_IC.on, 'On the line: the line runs through it'], ['r', LP_IC.r, 'Other side']])}</div>`;
};
function openLabelPop(e) { render(); const b = bar.querySelector('[data-p=label]'); if (b) openPP('label', b); }

const forNodes = (f, filt = () => true) => selNodes().filter(filt).forEach(f);
/* no border: width / dash / double show no choice (dimmed); picking one brings a border back */
const offG = (off, html) => off ? `<span class="grp off" title="No border · pick a width or style to add one">${html}</span>` : html;
const revive = () => setN('stroke', '#1d1d1f', n => shp(n) && n.k !== 'dot' && n.stroke === 'none');
function setN(key, v, filt) { forNodes(n => { n[key] = v; remember(n, key, v); }, filt); }
function setTS(key, v) { forNodes(n => { n.ts = { ...n.ts, [key]: v }; remember(n, 'ts.' + key, v); }, n => n.k !== 'image'); }
function setRoute(e, v) {
  if (e.a && e.a === e.b) return;
  if (v === 'arc') { delete e.route; return; }
  if (v === 'bez' && e.route !== 'bez') {
    const A = endPt(e, 'a'), B = endPt(e, 'b'), L = Math.hypot(B.x - A.x, B.y - A.y) || 1, k = e.bend ? Math.round(4 * e.bend / (3 * L) * 1000) / 1000 : .25;
    e.c1 = { t: e.bend ? 1 / 3 : C1D.t, v: k }; e.c2 = { t: e.bend ? 2 / 3 : C2D.t, v: k };
  }
  e.route = v; e.bend = 0;
}
function setE(key, v) { selEdges().forEach(e => { e[key] = v; }); if (['dash', 'head', 'sw', 'color', 'tail', 'shape'].includes(key)) { prefs.edge[key] = v; savePrefs(); syncDock(); drawSub(true); } }
const notImg = n => n.k !== 'image', shp = n => n.k !== 'text' && n.k !== 'image';
function act(a, v, live) {
  if (a === 'oladd') { const n = selNodes()[0]; if (n) editOuter(n, ['t', 'b', 'r', 'l'].find(sd => !n.ol?.[sd]) || 't'); return; }
  if (a === 'oled') { const n = selNodes()[0]; if (n) editOuter(n, v); return; }
  const b = ppBefore ?? snap();
  if ((a === 'dbl' || a === 'round') && typeof v === 'string') v = v === '1';
  switch (a) {
    case 'tone': prefs.tone = v; savePrefs(); refreshPP(); return;
    case 'fill': setN('fill', v, shp); break;
    case 'dsz': { const d = Math.round(+v); if (!(d >= 2)) break; forNodes(n => { n.w = n.h = Math.min(d, 80); remember(n, 'w', n.w); }, n => n.k === 'dot'); break; }
    case 'stroke': setN('stroke', v, n => n.k !== 'text' && n.k !== 'dot'); selEdges().forEach(e => { if (v !== 'none') e.color = v; }); break;
    case 'sw': if (!(+v > 0)) break; revive(); setN('sw', Math.min(+v, 12), n => n.k !== 'text' && n.k !== 'dot'); break;
    case 'sd': revive(); setN('sd', v, n => n.k !== 'text' && n.k !== 'dot'); break;
    case 'dbl': if (v) revive(); setN('dbl', !!v, shp); break;
    case 'kind': forNodes(n => { n.k = v; if (v === 'tri' && !n.dir) n.dir = 'up'; if (v !== 'text') { const d = KDEF[v]; if (n.w === KDEF.text.w) { n.w = d.w; n.h = d.h; } if (n.fill === 'none' && n.stroke === 'none') { n.fill = d.fill; n.stroke = d.stroke; } } }, notImg); break;
    case 'round': setN('rad', v ? radPre() : 0, n => shp(n) && n.k !== 'circle'); break;
    case 'rad': { const r1 = Math.round(+v); if (!(r1 >= 1)) break; setN('rad', Math.min(r1, 99), n => shp(n) && n.k !== 'circle'); break; }
    case 'radd': { const r0 = common(selNodes().filter(n => shp(n) && n.k !== 'circle'), n => n.rad || 0) ?? 6; setN('rad', clamp(r0 + +v, 1, 99), n => shp(n) && n.k !== 'circle'); const f = pp.querySelector('.nnum[data-a=rad]'); if (f) f.value = clamp(r0 + +v, 1, 99); break; }
    case 'dir': forNodes(n => { if (n.k === 'tri') { const flip = (n.dir === 'up' || n.dir === 'down') !== (v === 'up' || v === 'down'); if (flip) [n.w, n.h] = [n.h, n.w]; n.dir = v; remember(n, 'dir', v); } }); break;
    case 'play': forNodes(n => { if (v) n.lay = v; else delete n.lay; }, hasPorts); break;
    case 'catt': forNodes(n => { const a = n.k === 'circle' ? (v === 'pin' ? 'pin' : undefined) : (v === 'free' ? 'free' : undefined); if (a) n.att = a; else delete n.att; remember(n, 'att', a); }, n => n.k !== 'dot'); break;
    case 'fitText': forNodes(n => { n.w = KDEF[n.k].w; n.h = KDEF[n.k].h; }, shp); break;
    case 'tsize': case 'tsizeR': setTS('size', +v); break;
    case 'tbold': setTS('bold', !common(selNodes().filter(notImg), n => n.ts.bold)); break;
    case 'tital': setTS('italic', !common(selNodes().filter(notImg), n => n.ts.italic)); break;
    case 'tunder': setTS('under', !common(selNodes().filter(notImg), n => n.ts.under)); break;
    case 'tvert': setTS('vert', !!+v); break;
    case 'tcol': setTS('color', v); break;
    case 'imgPick': pickImage(selNodes()[0]); return;
    case 'imgDel': forNodes(n => { delete n.img; delete n.crop; delete n.nat; }); break;
    case 'crop': closePP(); startCrop(selNodes()[0]); return;
    case 'rot0': forNodes(n => { n.rot = 0; }); break;
    case 'edash': setE('dash', v); break;
    case 'esw': if (!(+v > 0)) break; setE('sw', Math.min(+v, 12)); break;
    case 'ecol': setE('color', v); break;
    case 'head': setE('head', v); break;
    case 'tail': setE('tail', v); break;
    case 'eshape': setE('shape', v); break;
    case 'eroute': selEdges().forEach(e => setRoute(e, v)); prefs.edge.route = v; savePrefs(); syncDock(); drawSub(true); break;
    case 'earrow': { const [t1, h1] = v.split('|'); setE('tail', t1); setE('head', h1); break; }
    case 'ord': order(v); refreshPP(); return;
    case 'dupl': closePP(); duplicate(); return;
    case 'del': closePP(); deleteSel(); return;
    case 'al': alignNodes(v); break;
    case 'tsz': { const ns = selNodes().filter(n => n.k !== 'image'), cur = common(ns, n => n.ts.size) ?? 15, L = [8, 9, 10, 11, 12, 13, 15, 18, 21, 24, 28, 32, 40, 48, 56, 64, 72];
      const nx = +v > 0 ? L.find(x => x > cur) ?? 72 : [...L].reverse().find(x => x < cur) ?? 8; setTS('size', nx); break; }
    case 'straight': selEdges().forEach(e => { e.bend = 0; delete e.route; delete e.c1; delete e.c2; delete e.em; delete e.ek; }); break;
    case 'flip': selEdges().forEach(e => { [e.a, e.b] = [e.b, e.a]; [e.pa, e.pb] = [e.pb, e.pa]; if (!e.pa) delete e.pa; if (!e.pb) delete e.pb; [e.qa, e.qb] = [e.qb, e.qa]; if (!e.qa) delete e.qa; if (!e.qb) delete e.qb; e.bend = -(e.bend || 0); if (e.c1) { const c1 = e.c1, c2 = e.c2 || C2D; e.c1 = { t: 1 - c2.t, v: -c2.v }; e.c2 = { t: 1 - c1.t, v: -c1.v }; } if (e.em != null) e.em = 1 - e.em; if (e.lt != null) e.lt = 1 - e.lt; if (e.lp === 'l' || e.lp === 'r') e.lp = e.lp === 'l' ? 'r' : 'l'; }); break;
    case 'elabel': selEdges().forEach(e => { e.label = v; }); break;
    case 'lp': selEdges().forEach(e => { e.lp = v; }); break;
  }
  render();
  if (live) { ppBefore = b; return; }
  ppBefore = null; commit(b); refreshPP();
}
/* a field's 'change' fires on the press that leaves it: rebuilding the panel then would swallow that click
   (ZX Draw had this bug), so the refresh waits until the press is over and its click has run */
let ppPress = false, ppLater = false;
pp.addEventListener('pointerdown', e => { e.stopPropagation(); ppPress = true; });
addEventListener('pointerup', () => { if (!ppPress) return; ppPress = false; setTimeout(() => { if (ppLater) { ppLater = false; refreshPP(); } }, 0); }, true);
addEventListener('pointercancel', () => { ppPress = false; if (ppLater) { ppLater = false; refreshPP(); } }, true);
pp.addEventListener('click', e => {
  const b = e.target.closest('button[data-a]'); if (!b) return;
  if (b.closest('.tones')) { act('tone', b.dataset.v); return; }
  if (pp._edge) { pp._edge(b.dataset.a, b.dataset.v); return; }
  act(b.dataset.a, b.dataset.v);
});
pp.addEventListener('input', e => {
  const t = e.target, a = t.dataset.a; if (!a) return;
  if (pp._edge) { pp._edge(a, t.type === 'checkbox' ? t.checked : t.value); return; }
  if (t.type === 'checkbox') { act(a, t.checked); return; }
  act(a, t.value, true);
});
pp.addEventListener('change', e => { const t = e.target; if (t.type === 'checkbox' || pp._edge) return; if (ppBefore != null) { const b = ppBefore; ppBefore = null; commit(b); if (ppPress) ppLater = true; else refreshPP(); } });
pp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter' || e.key === 'Escape') { if (ppBefore != null) { const b = ppBefore; ppBefore = null; commit(b); } closePP(); } });

/* ---------- colour picker: square / wheel / sliders, any typed format ---------- */
const cpk = document.createElement('div'); cpk.id = 'cpk'; cpk.hidden = true; document.body.appendChild(cpk);
const cpPref = Object.assign({ mode: 'square', fmt: 'hex' }, lsGet(LS.cp) || {});
let cp = null, cpRecent = lsGet(LS.recent) || [];
const hsv2rgb = (h, s, v) => { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map(x => Math.round(x * 255)); };
const rgb2hsv = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), d = M - m; let h = 0; if (d) { h = M === r ? ((g - b) / d) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return { h, s: M ? d / M : 0, v: M }; };
const rgb2hex = c => '#' + c.map(x => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')).join('');
const hex2rgb = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const rgb2hsl = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const M = Math.max(r, g, b), m = Math.min(r, g, b), l = (M + m) / 2, d = M - m; let h = 0, s = 0; if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = M === r ? ((g - b) / d) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, s * 100, l * 100]; };
const hsl2rgb = (h, s, l) => { s /= 100; l /= 100; const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [f(0), f(8), f(4)].map(x => Math.round(x * 255)); };
const cpCtx = document.createElement('canvas').getContext('2d');
function parseColor(t) {
  t = String(t).trim(); if (!t) return null;
  if (/^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(t)) t = '#' + t.replace('#', '');
  else if (/^\d{1,3}[\s,]+\d{1,3}[\s,]+\d{1,3}$/.test(t)) t = `rgb(${t.split(/[\s,]+/).join(',')})`;
  cpCtx.fillStyle = '#010203'; cpCtx.fillStyle = t;
  const o = cpCtx.fillStyle;
  if (o === '#010203' && rgb2hex(hex2rgb(/^#/.test(t) && t.length === 7 ? t : '#000000')) !== '#010203') return null;
  if (o.startsWith('#')) return o;
  const m = o.match(/[\d.]+/g); return m ? rgb2hex(m.slice(0, 3).map(Number)) : null;
}
const cpHex = () => rgb2hex(hsv2rgb(cp.h, cp.s, cp.v));
function cpText(hex) {
  const c = hex2rgb(hex);
  if (cpPref.fmt === 'rgb') return `rgb(${c.join(', ')})`;
  if (cpPref.fmt === 'hsl') { const [h, s, l] = rgb2hsl(c).map(Math.round); return `hsl(${h}, ${s}%, ${l}%)`; }
  return hex.toUpperCase();
}
const CP_IC = {
  square: sv('<rect x="4" y="4" width="12" height="16" rx="2"/><path d="M19.5 4v16"/>', 16),
  wheel: sv('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2"/>', 16),
  sliders: sv('<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="1.8" fill="currentColor"/><circle cx="15" cy="12" r="1.8" fill="currentColor"/><circle cx="7" cy="17" r="1.8" fill="currentColor"/>', 16),
  drop: sv('<path d="M14.5 5.5l4 4M17 3.5a2.1 2.1 0 013 3l-2 2-3-3zM15 8L6 17l-1.5 3.5L8 19l9-9"/>', 16),
};
/* opt.done = label of a confirm button: the colour is only handed over when it is pressed */
function openCP(anchor, cur, cb, opt) {
  const hex = parseColor(cur && cur !== 'none' ? cur : '#5b5bd6') || '#5b5bd6';
  cp = { ...rgb2hsv(hex2rgb(hex)), old: hex, cb, anchor, done: opt && opt.done };
  cpk.hidden = false; cpk.style.transition = 'none'; cpBuild(); cpPlace(); void cpk.offsetWidth; cpk.style.transition = '';
}
function closeCP() { if (cpk.hidden) return; cpk.hidden = true; cp = null; }
function cpPlace() {
  const p = !pp.hidden ? pp.getBoundingClientRect() : cp.anchor.getBoundingClientRect(), w = cpk.offsetWidth, h = cpk.offsetHeight;
  let x, y;
  const yy = clamp(p.top + h > p.bottom && p.bottom > innerHeight * .55 ? p.bottom - h : p.top, 8, innerHeight - h - 8);
  if (p.right + 8 + w <= innerWidth - 8) { x = p.right + 8; y = yy; }
  else if (p.left - 8 - w >= 8) { x = p.left - w - 8; y = yy; }
  else { x = clamp(p.left, 8, innerWidth - w - 8); y = p.top - h - 8 >= 8 ? p.top - h - 8 : clamp(p.bottom + 8, 8, innerHeight - h - 8); }
  cpk.style.left = x + 'px'; cpk.style.top = y + 'px';
}
function cpArea(m) {
  if (m === 'square') return `<div class="cp-sv" data-d="sv"><canvas></canvas><i class="cp-th"></i></div><div class="cp-bar cp-hue" data-d="hue"><i></i></div>`;
  if (m === 'wheel') return `<div class="cp-wh" data-d="wh"><canvas></canvas><i class="cp-th"></i></div><div class="cp-bar" data-d="val"><i></i></div>`;
  return [0, 1, 2].map(i => `<div class="cp-sl"><span class="cp-k"></span><div class="cp-bar" data-d="c${i}"><i></i></div><input class="cp-n" data-n="${i}" inputmode="numeric"></div>`).join('');
}
/* switching square / wheel / sliders: only the middle changes; the panel eases to its new height and the view fades in */
function cpSwitch(m) {
  if (m === cpPref.mode) return;
  cpPref.mode = m; lsSet(LS.cp, cpPref);
  const sg = cpk.querySelector('[data-a=cpm]').parentElement;
  sg.querySelectorAll(':scope > button').forEach(b => b.classList.toggle('on', b.dataset.v === m)); syncPill(sg, sg.querySelector(':scope > button.on'));
  const area = cpk.querySelector('.cp-area'), h0 = cpk.offsetHeight;
  cpk.getAnimations().forEach(a => a.cancel());
  area.innerHTML = cpArea(m); cpUpdate();
  const h1 = cpk.offsetHeight;
  cpk.style.overflow = 'hidden';
  cpk.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: 320, easing: 'cubic-bezier(.3,1.08,.4,1)' }).finished.then(() => { cpk.style.overflow = ''; }, () => {});
  area.animate([{ opacity: 0, transform: 'translateY(6px) scale(.97)', filter: 'blur(2px)' }, { opacity: 1, transform: 'none', filter: 'none' }], { duration: 300, delay: 40, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'backwards' });
  cpPlace();
}
function cpBuild() {
  const m = cpPref.mode, area = cpArea(m);
  cpk.innerHTML = `<div class="row">${seg('cpm', m, [['square', CP_IC.square, 'Square'], ['wheel', CP_IC.wheel, 'Wheel'], ['sliders', CP_IC.sliders, 'Sliders']])}<span style="flex:1"></span>${seg('cpf', cpPref.fmt, [['hex', 'HEX', 'Hex'], ['rgb', 'RGB', 'RGB'], ['hsl', 'HSL', 'HSL']])}</div>
  <div class="cp-area">${area}</div>
  <div class="row cp-foot">${window.EyeDropper ? `<button class="wd cp-drop" data-c="drop" title="Pick from screen">${CP_IC.drop}</button>` : ''}<span class="cp-sw" title="Before (click to go back) / after"><i class="cp-old" style="background:${cp.old}" data-c="old"></i><i class="cp-new"></i></span><input class="tin cp-in" spellcheck="false" title="#hex, rgb(…), hsl(…), 255 0 0 or a CSS name">${cp.done ? `<button class="cp-done" data-c="done" title="${cp.done} this colour">${sv('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 13)}<span>${cp.done}</span></button>` : ''}</div>
  ${cpRecent.length ? `<div class="cp-rec">${cpRecent.map(c => `<button class="sdot" data-c="rec" data-v="${c}" style="--c:${c}" title="${c}"></button>`).join('')}</div>` : ''}`;
  initSegs(cpk);
  cpUpdate();
}
function cpUpdate(keepInput) {
  const hex = cpHex(), rgb = hex2rgb(hex), m = cpPref.mode, pure = rgb2hex(hsv2rgb(cp.h, 1, 1));
  const th = (sel, x, y, c) => { const t = cpk.querySelector(sel); if (!t) return; t.style.left = x * 100 + '%'; if (y != null) t.style.top = y * 100 + '%'; if (c) t.style.background = c; };
  if (m === 'square') {
    const cv = cpk.querySelector('.cp-sv canvas'), W_ = cv.width = 200, H_ = cv.height = 130, g = cv.getContext('2d');
    g.fillStyle = pure; g.fillRect(0, 0, W_, H_);
    let gr = g.createLinearGradient(0, 0, W_, 0); gr.addColorStop(0, '#fff'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, W_, H_);
    gr = g.createLinearGradient(0, 0, 0, H_); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(0, 0, W_, H_);
    th('.cp-sv .cp-th', cp.s, 1 - cp.v, hex); th('.cp-hue i', cp.h / 360, null, pure);
  }
  if (m === 'wheel') {
    const cv = cpk.querySelector('.cp-wh canvas'), S = cv.width = cv.height = 260, g = cv.getContext('2d'), R = S / 2;
    g.clearRect(0, 0, S, S);
    if (g.createConicGradient) { const cg = g.createConicGradient(0, R, R); for (let i = 0; i <= 12; i++) cg.addColorStop(i / 12, rgb2hex(hsv2rgb(i * 30 % 360, 1, 1))); g.fillStyle = cg; }
    g.beginPath(); g.arc(R, R, R, 0, Math.PI * 2); g.fill();
    const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, '#fff'); rg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = rg; g.fill();
    const a = cp.h * D2R; th('.cp-wh .cp-th', .5 + Math.cos(a) * cp.s / 2, .5 + Math.sin(a) * cp.s / 2, hex);
    const vb = cpk.querySelector('[data-d=val]'); vb.style.background = `linear-gradient(90deg, #000, ${rgb2hex(hsv2rgb(cp.h, cp.s, 1))})`; th('[data-d=val] i', cp.v, null, hex);
  }
  if (m === 'sliders') {
    const hsl = cpPref.fmt === 'hsl', vals = hsl ? rgb2hsl(rgb) : rgb, max = hsl ? [360, 100, 100] : [255, 255, 255], keys = hsl ? ['H', 'S', 'L'] : ['R', 'G', 'B'];
    if (hsl && cp.s === 0) vals[0] = cp.h;
    [0, 1, 2].forEach(i => {
      const stops = hsl ? (i === 0 ? [0, 60, 120, 180, 240, 300, 360].map(h => rgb2hex(hsl2rgb(h, vals[1], vals[2]))) : [0, .5, 1].map(t => rgb2hex(hsl2rgb(vals[0], i === 1 ? t * 100 : vals[1], i === 2 ? t * 100 : vals[2]))))
        : [0, 1].map(t => rgb2hex(rgb.map((c, j) => j === i ? t * 255 : c)));
      cpk.querySelector(`[data-d=c${i}]`).style.background = `linear-gradient(90deg, ${stops.join(',')})`;
      th(`[data-d=c${i}] i`, vals[i] / max[i], null, hex);
      cpk.querySelectorAll('.cp-k')[i].textContent = keys[i];
      const n = cpk.querySelector(`[data-n="${i}"]`); if (document.activeElement !== n) n.value = Math.round(vals[i]);
    });
  }
  cpk.querySelector('.cp-new').style.background = hex;
  const inp = cpk.querySelector('.cp-in'); if (!keepInput && document.activeElement !== inp) inp.value = cpText(hex);
}
function cpSet(hex, live) { const o = rgb2hsv(hex2rgb(hex)); Object.assign(cp, o.s ? o : { s: o.s, v: o.v }, o.v ? {} : { v: 0 }); if (o.s && o.v) cp.h = o.h; cpUpdate(); cpEmit(live); }
function cpEmit(live) {
  const hex = cpHex(); if (cp.done) return;
  cp.cb(hex, live);
  if (!live) { cpRecent = [hex, ...cpRecent.filter(c => c !== hex)].slice(0, 10); lsSet(LS.recent, cpRecent); }
}
function cpFrom(d, e) {
  const el = cpk.querySelector(`[data-d="${d}"]`), r = el.getBoundingClientRect(), fx = clamp((e.clientX - r.left) / r.width, 0, 1), fy = clamp((e.clientY - r.top) / r.height, 0, 1);
  if (d === 'sv') { cp.s = fx; cp.v = 1 - fy; }
  else if (d === 'hue') cp.h = fx * 360;
  else if (d === 'val') cp.v = fx;
  else if (d === 'wh') { const dx = fx - .5, dy = fy - .5; cp.s = Math.min(1, Math.hypot(dx, dy) * 2); cp.h = (Math.atan2(dy, dx) * R2D + 360) % 360; }
  else { const i = +d[1], hsl = cpPref.fmt === 'hsl'; cpChan(i, fx * (hsl ? (i ? 100 : 360) : 255)); return; }
  cpUpdate(); cpEmit(true);
}
function cpChan(i, val) {
  if (cpPref.fmt === 'hsl') { const v = rgb2hsl(hex2rgb(cpHex())); if (cp.s === 0) v[0] = cp.h; v[i] = val; const o = rgb2hsv(hsl2rgb(...v)); cp.s = o.s; cp.v = o.v; cp.h = i === 0 || o.s ? (i === 0 ? val % 360 : o.h) : cp.h; }
  else { const c = hex2rgb(cpHex()); c[i] = clamp(val, 0, 255); const o = rgb2hsv(c); cp.s = o.s; cp.v = o.v; if (o.s && o.v) cp.h = o.h; }
  cpUpdate(); cpEmit(true);
}
cpk.addEventListener('pointerdown', e => {
  e.stopPropagation();
  const d = e.target.closest('[data-d]'); if (!d) return;
  e.preventDefault(); d.setPointerCapture?.(e.pointerId); cpk.classList.add('drag');
  cpFrom(d.dataset.d, e);
  const mv = ev => cpFrom(d.dataset.d, ev), up = () => { d.removeEventListener('pointermove', mv); d.removeEventListener('pointerup', up); d.removeEventListener('pointercancel', up); cpk.classList.remove('drag'); if (cp) cpEmit(false); };
  d.addEventListener('pointermove', mv); d.addEventListener('pointerup', up); d.addEventListener('pointercancel', up);
});
cpk.addEventListener('click', async e => {
  const b = e.target.closest('[data-a], [data-c]'); if (!b || !cp) return;
  if (b.dataset.a === 'cpm') { cpSwitch(b.dataset.v); return; }
  if (b.dataset.a === 'cpf') { cpPref.fmt = b.dataset.v; lsSet(LS.cp, cpPref); cpk.querySelector('.cp-in').blur(); if (cpPref.mode === 'sliders') cpBuild(); else cpUpdate(); return; }
  const c = b.dataset.c;
  if (c === 'done') { const hex = cpHex(), f = cp.cb; cpRecent = [hex, ...cpRecent.filter(x => x !== hex)].slice(0, 10); lsSet(LS.recent, cpRecent); closeCP(); f(hex, false); return; }
  if (c === 'old') cpSet(cp.old, false);
  if (c === 'rec') cpSet(b.dataset.v, false);
  if (c === 'drop') { try { const r = await new EyeDropper().open(); const h = parseColor(r.sRGBHex); if (h && cp) cpSet(h, false); } catch { /* cancelled */ } }
});
cpk.addEventListener('input', e => {
  const t = e.target;
  if (t.classList.contains('cp-in')) { const h = parseColor(t.value); t.classList.toggle('bad', !h); if (h) { const o = rgb2hsv(hex2rgb(h)); cp.s = o.s; cp.v = o.v; if (o.s && o.v) cp.h = o.h; cpUpdate(true); cpEmit(true); } }
  if (t.dataset.n != null) { const v = parseFloat(t.value); if (!isNaN(v)) cpChan(+t.dataset.n, v); }
});
cpk.addEventListener('focusout', e => { if (!cp) return; if (e.target.classList.contains('cp-in') || e.target.dataset.n != null) { e.target.classList.remove('bad'); cpEmit(false); cpUpdate(); if (e.target.classList.contains('cp-in')) e.target.value = cpText(cpHex()); } });
cpk.addEventListener('keydown', e => {
  e.stopPropagation();
  if (e.key === 'Escape') { closeCP(); return; }
  if (e.key === 'Enter') { e.target.blur?.(); return; }
  if (e.target.dataset.n != null && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); cpChan(+e.target.dataset.n, (parseFloat(e.target.value) || 0) + (e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? 10 : 1)); e.target.value = ''; cpUpdate(); }
});
document.addEventListener('pointerdown', e => { if (!cpk.hidden && !cpk.contains(e.target) && !e.target.closest('[data-cp]')) closeCP(); }, true);
/* the "custom colour" swatch in every palette (and in the bar) opens the picker */
for (const host of [pp, bar]) host.addEventListener('click', e => {
  const b = e.target.closest('[data-cp]'); if (!b) return;
  e.stopImmediatePropagation();
  if (cp && cp.anchorKey === b.dataset.cp) { closeCP(); return; }
  const a = b.dataset.cp;
  openCP(b, b.dataset.v, (hex, live) => { if (host === pp && pp._edge) { if (!live) pp._edge(a, hex); return; } act(a, hex, live); });
  cp.anchorKey = a;
}, true);

/* ---------- "more arrow heads": a floating card that springs up from the ⋯ button ---------- */
const hpop = document.createElement('div'); hpop.id = 'hpop'; hpop.hidden = true; document.body.appendChild(hpop);
let hpT = 0;
const hpHTML = () => { const E = prefs.edge; return `<div class="hrow"><span class="hl">Start</span>${seg('s:tail', E.tail || 'none', headOpts(true))}</div><div class="hrow"><span class="hl">End</span>${seg('s:head', E.head ?? 'vee', headOpts(false))}</div><div class="hrow"><span class="hl">Path</span>${seg('s:route', E.route || 'arc', ROUTES)}</div>`; };
function openHP() {
  const b = sub.querySelector('[data-a="s:hx"]'); if (!b) return;
  clearTimeout(hpT); subExp = 'x';
  const html = hpHTML(); hpop.innerHTML = html; hpop._sig = sigOf(html); hpop.hidden = false; initSegs(hpop);
  hpop.classList.remove('out', 'in'); placeHP(); void hpop.offsetWidth; hpop.classList.add('in');
  drawSub(true);
}
function placeHP() {
  const b = sub.querySelector('[data-a="s:hx"]'); if (!b || hpop.hidden) return;
  const r = b.getBoundingClientRect(), sr = sub.getBoundingClientRect(), w = hpop.offsetWidth, h = hpop.offsetHeight, side = sub.dataset.side || 'bottom';
  let x = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8), y = sr.top - h - 10;
  if (side !== 'bottom') { x = side === 'left' ? sr.right + 10 : sr.left - w - 10; y = clamp(r.top + r.height / 2 - h / 2, 8, innerHeight - h - 8); }
  hpop.style.left = x + 'px'; hpop.style.top = y + 'px';
  hpop.style.setProperty('--ox', (r.left + r.width / 2 - x) + 'px'); hpop.dataset.side = side;
}
let hpHover = false;
function closeHP(now) {
  hpHover = false;
  if (hpop.hidden) { subExp = null; return; }
  subExp = null; clearTimeout(hpT);
  if (now) { hpop.hidden = true; hpop.classList.remove('in', 'out'); return; }
  hpop.classList.remove('in'); hpop.classList.add('out');
  hpT = setTimeout(() => { hpop.hidden = true; hpop.classList.remove('out'); }, 170);
  drawSub(true);
}
hpop.addEventListener('pointerdown', e => e.stopPropagation());
hpop.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  subAct(b.dataset.a, b.dataset.v);
  const html = hpHTML(); if (!patchHTML(hpop, html)) { hpop.innerHTML = html; hpop._sig = sigOf(html); initSegs(hpop); }
});
document.addEventListener('pointerdown', e => { if (!hpop.hidden && !e.target.closest('#hpop, [data-a="s:hx"]')) closeHP(); }, true);
addEventListener('keydown', e => { if (e.key === 'Escape' && !hpop.hidden) { e.stopImmediatePropagation(); closeHP(); } }, true);

/* ---------- tool sub-bar: one compact row that springs out of the dock for the active tool ---------- */
const sub = $('#sub');
let subExp = null, subTool = null;
/* quick colours: soft fills that keep text readable; line / text colours clear on white and in print, one family */
const QUICK = ['#ffffff', '#fde2e1', '#feead6', '#fdf1c7', '#dcf3e5', '#dbeafe', '#e6e1fb', '#f1efec'];
/* quick colours in the sub-bar: editable (right-click a dot); a colour picked elsewhere shows as an extra dot */
/* lines, dots and text: ink, slate and six muted hues of even weight (clear on white and in print, none shouting) */
const QINK = ['#1d1d1f', '#6e7581', '#c4524e', '#d0793a', '#3f8c6a', '#3a6db3', '#6f5fc4', '#b05482'];
const QDEF = { qFill: QUICK, qText: QINK, qLine: QINK };
/* quick rows still equal to the old defaults move to the new ones (rows you changed are kept) */
{ const OLD = { qFill: ['#ffffff', '#f6dcd9', '#f5e6c8', '#d6ecdf', '#d4e6f1', '#dcdcf3', '#ece7e1'], qText: ['#1d1d1f', '#6b7280', '#c24a42', '#c98a2b', '#2f8a63', '#3466ad', '#7553ad'], qLine: ['#1d1d1f', '#8e8e93', '#c24a42', '#c98a2b', '#2f8a63', '#3466ad', '#7553ad'] };
  const V2 = ['#1d1d1f', '#6b7280', '#dc3e42', '#ef5f00', '#2b9a66', '#0d74ce', '#6e56cf', '#c2298a'];
  let ch = false; for (const k in OLD) if (Array.isArray(prefs[k]) && (prefs[k].join() === OLD[k].join() || (k !== 'qFill' && prefs[k].join() === V2.join()))) { delete prefs[k]; ch = true; } if (ch) savePrefs(); }
const quickOf = k => (Array.isArray(prefs[k]) && prefs[k].length ? prefs[k] : QDEF[k]);
const lc = c => String(c).toLowerCase();
function quickDots(a, k, cur, extra = []) {
  const qs = quickOf(k);
  let h = qs.map((c, i) => `<button class="sdot ${lc(c) === lc(cur) ? 'on' : ''}" data-a="${a}" data-v="${c}" data-q="${k}:${i}" title="${c} · right-click to change" style="--c:${c}"></button>`).join('');
  const own = cur && cur !== 'none' && !qs.concat(extra).some(c => lc(c) === lc(cur));
  h += `<button class="sdot anyc ${own ? 'on own' : ''}" data-a="s:pal" data-v="${k === 'qText' ? 'tcol' : a === 's:dcol' ? 'dcol' : 'fill'}" title="${own ? cur + ' · ' : ''}More colours" ${own ? `style="--c:${cur}"` : ''}></button>`;
  return h + qAddBtn(k, cur);
}
/* "+" adds a colour to the quick colours; it folds away once the row is full */
const QMAX = 10;
let qJustFull = null;
function qAddBtn(k, cur) {
  const full = quickOf(k).length >= QMAX;
  return `<button class="sdot qadd ${full && qJustFull !== k ? 'full' : ''}" data-qadd="${k}" data-v="${cur || ''}" title="Add to quick colours" ${full ? 'tabindex="-1"' : ''}>${IC.plus}</button>`;
}
function setQuick(k, arr) {
  const was = quickOf(k).length;
  prefs[k] = arr.slice(0, QMAX); savePrefs();
  if (prefs[k].length >= QMAX && was < QMAX) qJustFull = k;
  drawSub(true); barSig = ''; updateBar(); if (!pp.hidden) refreshPP();
  if (qJustFull) setTimeout(() => { document.querySelectorAll(`[data-qadd="${qJustFull}"]`).forEach(b => b.classList.add('full')); qJustFull = null; }, 60);
}
function qAdd(b) {
  const k = b.dataset.qadd, qs = quickOf(k), cur = b.dataset.v;
  if (qs.length >= QMAX) return;
  const known = c => quickOf(k).some(q => lc(q) === lc(c));
  if (cur && cur !== 'none' && /^#/.test(cur) && !known(cur)) { setQuick(k, [...qs, cur]); return; }
  openCP(b, cur && cur !== 'none' ? cur : '#7f8fa6', (hex, live) => { if (!live && !known(hex) && quickOf(k).length < QMAX) setQuick(k, [...quickOf(k), hex]); }, { done: 'Add' });
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-qadd]'); if (!b) return;
  e.stopImmediatePropagation(); if (!b.classList.contains('full')) qAdd(b);
}, true);
/* right-click on a quick colour: a small icon card right above the dot */
const qpop = document.createElement('div'); qpop.id = 'qpop'; qpop.hidden = true; document.body.appendChild(qpop);
const Q_IC = {
  edit: sv('<path d="M14.5 5.5l4 4M4 20l1-4.5L15.5 5l4 4L9 19.5z"/>', 15),
  left: sv('<path d="M14 6l-6 6 6 6"/>', 15),
  right: sv('<path d="M10 6l6 6-6 6"/>', 15),
  pin: sv('<path d="M12 5v14M5 12h14"/>', 15),
  reset: sv('<path d="M4 12a8 8 0 108-8H8"/><path d="M10 1.5L7.5 4 10 6.5"/>', 15),
};
let qState = null;
function quickMenu(b) {
  closeMenu();
  const a = b.dataset.a, cur = b.closest('#bar, #pp') ? null : a === 's:tcol' ? defOf('text').ts.color : a === 's:dcol' ? defOf('dot').fill : defOf(SHAPES.includes(tool) ? tool : 'rect').fill;
  const btn = (q, ic, t, extra = '') => `<button class="qb" data-q="${q}" ${extra} title="${t}">${ic}</button>`;
  let h;
  if (b.dataset.qt) {
    const k = b.dataset.qt, qs = quickOf(k);
    qState = { k, c: b.dataset.v };
    h = `${btn('keep', Q_IC.pin, 'Keep in quick colours')}<span class="qsep"></span><span class="qlab">Replace</span>${qs.map((c, i) => `<button class="qd" data-q="rep" data-i="${i}" style="--c:${c}" title="Replace ${c}"></button>`).join('')}`;
  } else {
    const [k, si] = b.dataset.q.split(':'), i = +si, qs = quickOf(k);
    qState = { k, i, b };
    h = btn('edit', Q_IC.edit, 'Change colour…')
      + (cur && cur !== 'none' && lc(cur) !== lc(qs[i]) ? `<button class="qd" data-q="use" style="--c:${cur}" title="Use the current colour (${cur})"></button>` : '')
      + `<span class="qsep"></span>`
      + btn('left', Q_IC.left, 'Move left', i > 0 ? '' : 'disabled') + btn('right', Q_IC.right, 'Move right', i < qs.length - 1 ? '' : 'disabled')
      + `<span class="qsep"></span>`
      + btn('del', IC.trash.replace(/width="\d+" height="\d+"/, 'width="15" height="15"'), 'Remove', qs.length > 1 ? 'class="qb danger"' : 'disabled')
      + btn('reset', Q_IC.reset, 'Reset quick colours');
  }
  qpop.innerHTML = h; qpop.hidden = false;
  qpop.classList.remove('in'); void qpop.offsetWidth; qpop.classList.add('in');
  const r = b.getBoundingClientRect(), w = qpop.offsetWidth, hh = qpop.offsetHeight;
  qpop._fromSub = !!b.closest('#sub'); delete qpop.dataset.beside;
  if (qpop._fromSub && besideSub(qpop, r)) return;
  let x = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8), y = r.top - hh - 10;
  if (y < 8) y = Math.min(r.bottom + 10, innerHeight - hh - 8);
  qpop.style.left = x + 'px'; qpop.style.top = y + 'px';
  qpop.classList.toggle('below', y > r.top);
  qpop.style.setProperty('--ax', (r.left + r.width / 2 - x) + 'px');
}
let pState = null;
const pStep = (pk, v) => pk[0] === 'w' ? (v < 1 ? .25 : .5) : (v < 24 ? 1 : 2);
const pClamp = (pk, v) => pk === 'dSz' ? clamp(Math.round(v), 2, 60) : pk[0] === 'w' ? clamp(Math.round(v * 4) / 4, .25, 12) : clamp(Math.round(v), 6, 120);
function setPreset(pk, arr) {
  prefs.pw = prefs.pw || {}; prefs.pw[pk] = arr.slice(0, PMAX); savePrefs();
  drawSub(true); barSig = ''; updateBar(); if (!pp.hidden) refreshPP();
}
function placeQ(b) {
  qpop.classList.remove('in'); void qpop.offsetWidth; qpop.classList.add('in');
  const r = b.getBoundingClientRect(), w = qpop.offsetWidth, hh = qpop.offsetHeight;
  qpop._fromSub = !!b.closest('#sub'); delete qpop.dataset.beside;
  if (qpop._fromSub && besideSub(qpop, r)) return;
  let x = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8), y = r.top - hh - 10;
  if (y < 8) y = Math.min(r.bottom + 10, innerHeight - hh - 8);
  qpop.style.left = x + 'px'; qpop.style.top = y + 'px';
  qpop.classList.toggle('below', y > r.top);
  qpop.style.setProperty('--ax', (r.left + r.width / 2 - x) + 'px');
}
function presetMenu(b) {
  closeMenu(); qState = null;
  const temp = !!b.dataset.pt, pk = temp ? b.dataset.pt : b.dataset.pk.split(':')[0], i = temp ? -1 : +b.dataset.pk.split(':')[1], ls = presetOf(pk), unit = pk[0] === 'w' || pk === 'dSz' ? 'px' : '';
  pState = { pk, i, v: +b.dataset.v, b };
  const btn = (q, ic, t, extra = '') => `<button class="qb" data-pq="${q}" ${extra} title="${t}">${ic}</button>`;
  if (pk === 'dash') {
    const v = temp ? b.dataset.v : ls[i], pt = dashPat(v), st = (q, lab, val) => `<span class="dl">${lab}</span><span class="nstep"><button data-pq="${q}-" title="Less">−</button><span class="pv">${val}</span><button data-pq="${q}+" title="More">+</button></span>`;
    pState.v = v;
    qpop.innerHTML = (temp ? btn('keep', Q_IC.pin, 'Keep as a preset', ls.length < PMAX ? '' : 'disabled')
      : (pt ? st('da', 'Dash', pt[0]) + st('ga', 'Gap', pt[1]) : `<span class="qlab">Solid</span>`)
        + `<span class="qsep"></span>` + btn('del', IC.trash.replace(/width="\d+" height="\d+"/, 'width="15" height="15"'), 'Remove', ls.length > 1 ? 'class="qb danger"' : 'disabled'));
    qpop.hidden = false; placeQ(b); return;
  }
  qpop.innerHTML = temp
    ? `<span class="qlab">${b.dataset.v}${unit}</span>${btn('keep', Q_IC.pin, 'Keep as a preset', ls.length < PMAX ? '' : 'disabled')}`
    : `<span class="nstep"><button data-pq="dn" title="Smaller">−</button><input class="pv" inputmode="decimal" value="${ls[i]}" title="Type a value"><button data-pq="up" title="Larger">+</button></span>`
      + `<span class="qsep"></span>` + btn('del', IC.trash.replace(/width="\d+" height="\d+"/, 'width="15" height="15"'), 'Remove', ls.length > 1 ? 'class="qb danger"' : 'disabled');
  qpop.hidden = false; placeQ(b);
}
qpop.addEventListener('click', e => {
  const t = e.target.closest('[data-pq]'); if (!t || t.disabled || !pState) return;
  const { pk, i, v } = pState, ls = presetOf(pk).slice();
  if (pk === 'dash') {
    const q = t.dataset.pq;
    if (q === 'da-' || q === 'da+' || q === 'ga-' || q === 'ga+') {
      const p = dashPat(ls[i]).slice(), j = q[0] === 'd' ? 0 : 1, r2 = x => Math.round(x * 2) / 2;
      p[j] = clamp(r2(p[j] + (q[2] === '+' ? .5 : -.5)), j ? .5 : 0, 12);
      const n = `d:${p[0]}:${p[1]}`; if (ls.includes(n)) return;
      ls[i] = n; setPreset(pk, ls); pState.v = n;
      const pv = qpop.querySelectorAll('.pv'); pv[0].textContent = p[0]; pv[1].textContent = p[1];
      const nb = document.querySelector(`[data-pk="dash:${i}"]`); if (nb) pState.b = nb;
      return;
    }
    if (q === 'add') { let k = 1; while (ls.includes(`d:${k}:1.5`)) k++; const arr = [...ls, `d:${k}:1.5`]; setPreset(pk, arr); const nb = document.querySelector(`[data-pk="dash:${arr.length - 1}"]`); if (nb) presetMenu(nb); return; }
    if (q === 'keep') { if (!ls.includes(v)) setPreset(pk, [...ls, v]); }
    if (q === 'del') setPreset(pk, ls.filter((_, j) => j !== i));
    if (q === 'reset') { setPreset(pk, PDEF[pk]); delete prefs.pw[pk]; savePrefs(); }
    pState = null; qpop.hidden = true; return;
  }
  switch (t.dataset.pq) {
    case 'keep': if (!ls.includes(v)) setPreset(pk, [...ls, v].sort((a, b) => a - b)); break;
    case 'up': case 'dn': {
      const n = pClamp(pk, ls[i] + (t.dataset.pq === 'up' ? 1 : -1) * pStep(pk, ls[i]));
      if (ls.includes(n)) return;
      ls[i] = n; setPreset(pk, ls);
      qpop.querySelector('.pv').value = n;
      return;
    }
    case 'add': {
      let n = pClamp(pk, Math.max(...ls) + pStep(pk, Math.max(...ls)) * 2);
      while (ls.includes(n) && n < 120) n = pClamp(pk, n + pStep(pk, n));
      if (ls.includes(n) || ls.length >= PMAX) return;
      const arr = [...ls, n].sort((a, b) => a - b); setPreset(pk, arr);
      const nb = document.querySelector(`[data-pk="${pk}:${arr.indexOf(n)}"]`); if (nb) presetMenu(nb);
      return;
    }
    case 'del': setPreset(pk, ls.filter((_, j) => j !== i)); break;
    case 'reset': if (prefs.pw) delete prefs.pw[pk]; setPreset(pk, PDEF[pk]); delete prefs.pw[pk]; savePrefs(); break;
  }
  pState = null; qpop.hidden = true;
});
document.addEventListener('click', e => {
  const b = e.target.closest('[data-padd]'); if (!b) return;
  e.stopImmediatePropagation(); if (b.classList.contains('full')) return;
  const pk = b.dataset.padd, ls = presetOf(pk);
  if (ls.length >= PMAX) return;
  if (SDEF[pk]) {
    const line = pk === 'lSty', cur = line ? { sw: prefs.edge.sw || 1.4, dash: prefs.edge.dash || 'solid', shape: prefs.edge.shape || 'line', col: prefs.edge.color } : (d => ({ sw: d.sw, sd: d.sd || 'solid', col: d.stroke }))(defOf(SHAPES.includes(tool) ? tool : 'rect'));
    setPreset(pk, [...ls.map(x => ({ ...x })), cur]);
    const nb = document.querySelector(`[data-sk="${pk}:${ls.length}"]`); if (nb) { nb.classList.add('born'); openStyEd(nb); }
    return;
  }
  if (pk === 'dash') { let k = 1; while (ls.includes(`d:${k}:1.5`)) k++; setPreset(pk, [...ls, `d:${k}:1.5`]); }
  else {
    let n = pClamp(pk, Math.max(...ls) + pStep(pk, Math.max(...ls)) * 2);
    while (ls.includes(n) && n < 120) n = pClamp(pk, n + pStep(pk, n));
    if (ls.includes(n)) return;
    setPreset(pk, [...ls, n].sort((x, y) => x - y));
  }
  const arr = presetOf(pk), nv = arr.find(v => !ls.includes(v)), host = b.parentElement;
  const nb = (host && host.querySelector(`[data-pk="${pk}:${arr.indexOf(nv)}"]`)) || document.querySelector(`[data-pk="${pk}:${arr.indexOf(nv)}"]`);
  if (nb) { nb.classList.add('born'); presetMenu(nb); }
}, true);
qpop.addEventListener('input', e => {
  if (!e.target.classList.contains('pv') || !pState) return;
  const { pk, i } = pState, ls = presetOf(pk).slice(), raw = parseFloat(e.target.value);
  if (!(raw > 0)) return;
  const n = pClamp(pk, raw); if (ls.includes(n) && ls[i] !== n) return;
  ls[i] = n; setPreset(pk, ls);
});
qpop.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter' || e.key === 'Escape') { pState = null; qpop.hidden = true; } });
document.addEventListener('contextmenu', e => {
  const b = e.target.closest('[data-pk], [data-pt]'); if (!b || e.ctrlKey && document.body.classList.contains('ro-armed')) return;
  e.preventDefault(); e.stopImmediatePropagation(); presetMenu(b);
}, true);
function closeQ() { pState = null; if (!qpop.hidden) { qpop.hidden = true; qState = null; } }
qpop.addEventListener('pointerdown', e => e.stopPropagation());
qpop.addEventListener('click', e => {
  const t = e.target.closest('[data-q]'); if (!t || t.disabled || !qState) return;
  const { k, i, c, b } = qState, qs = quickOf(k).slice();
  switch (t.dataset.q) {
    case 'keep': setQuick(k, [...qs, c]); break;
    case 'rep': qs[+t.dataset.i] = c; setQuick(k, qs); break;
    case 'edit': closeQ(); openCP(b, qs[i], (hex, live) => { if (!live) { const n = quickOf(k).slice(); n[i] = hex; setQuick(k, n); } }); return;
    case 'use': qs[i] = getComputedStyle(t).getPropertyValue('--c').trim(); setQuick(k, qs); break;
    case 'left': [qs[i - 1], qs[i]] = [qs[i], qs[i - 1]]; setQuick(k, qs); break;
    case 'right': [qs[i + 1], qs[i]] = [qs[i], qs[i + 1]]; setQuick(k, qs); break;
    case 'del': setQuick(k, qs.filter((_, j) => j !== i)); break;
    case 'reset': delete prefs[k]; savePrefs(); drawSub(true); break;
  }
  closeQ();
});
document.addEventListener('pointerdown', e => { if (!qpop.hidden && !qpop.contains(e.target)) closeQ(); }, true);
addEventListener('keydown', e => { if (e.key === 'Escape' && !qpop.hidden) { e.stopImmediatePropagation(); closeQ(); } }, true);
/* common arrows as one-click presets (start|end); every other combination sits behind the "more" button */
const arrowIc = (tl, hd) => {
  const end = { none: '', ray: '<path d="M15.5 12h2.2" opacity=".55"/><path d="M19.7 12h1.6" opacity=".25"/>', vee: '<path d="M15.5 7.5L20 12l-4.5 4.5" fill="none"/>', tri: '<path d="M14 7.8L20.5 12 14 16.2z" fill="currentColor"/>', otri: '<path d="M14 7.8L20.5 12 14 16.2z" fill="#fff"/>' };
  const st = { none: '', ray: '<path d="M6.3 12h2.2" opacity=".55"/><path d="M2.7 12h1.6" opacity=".25"/>', vee: '<path d="M8.5 7.5L4 12l4.5 4.5" fill="none"/>', tri: '<path d="M10 7.8L3.5 12 10 16.2z" fill="currentColor"/>', circ: '<circle cx="5" cy="12" r="2.2" fill="currentColor"/>' };
  const x1 = tl === 'none' ? 3.5 : tl === 'ray' ? 10.5 : tl === 'circ' ? 7 : tl === 'tri' ? 9 : 4.5, x2 = hd === 'none' ? 20.5 : hd === 'ray' ? 13.5 : hd === 'vee' ? 19.5 : 14.5;
  return sv(`<path d="M${x1} 12H${x2}"/>${st[tl] || ''}${end[hd] || ''}`, 18);
};
const ARROWS = [['none|none', 'Plain line'], ['none|vee', 'Arrow'], ['vee|vee', 'Both ways'], ['none|tri', 'Filled arrow'], ['none|otri', 'Open triangle (inheritance)'], ['circ|vee', 'From a dot'], ['none|ray', 'Ray (runs on and fades)'], ['ray|ray', 'Line (runs on both ways)']].map(([k, t]) => [k, arrowIc(...k.split('|')), t]);
const MORE_IC = sv('<circle cx="6" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18" cy="12" r="1.3" fill="currentColor"/>', 16);
const LZ_IC = {
  dot: '<svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="#ff4040" opacity=".18"/><circle cx="12" cy="12" r="3.2" fill="#ff4040"/></svg>',
  line: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-linecap="round"><path d="M4 15c3-4 5 1 8-2s4-5 8-4" stroke="#ff4040" stroke-width="5" opacity=".18"/><path d="M4 15c3-4 5 1 8-2s4-5 8-4" stroke="#ff4040" stroke-width="2"/></svg>',
};
const defOf = k => ({ ...KDEF[k], ...(prefs.defs[k] || {}), ts: { ...TS, ...(prefs.defs[k]?.ts || {}) } });
const dot = (a, c, cur, t) => `<button class="sdot ${c === cur ? 'on' : ''} ${c === 'none' ? 'none' : ''}" data-a="${a}" data-v="${c}" title="${t || c}" style="--c:${c === 'none' ? '#fff' : c}"></button>`;
/* a tool's sub-bar is made of parts; a layout may hide them or change their order (layout.subs[tool] = visible ids in order) */
const SUB_NAMES = { selm: 'Box / lasso', fill: 'Fill', border: 'Border', dir: 'Direction', dia: 'Proportions', round: 'Corners', col: 'Colour', size: 'Size', style: 'Bold, italic, underline', lstyle: 'Line style', arrow: 'Arrow heads', mode: 'Mode' };
function subParts(t) {
  if (t === 'select') return [['selm', seg('s:selm', prefs.selMode, [['box', small(IC.selBox), 'Box select (V)'], ['lasso', small(IC.lasso), 'Lasso (V again)']])]];
  if (SHAPES.includes(t)) {
    const d = defOf(t), P = [];
    P.push(['fill', `<span class="qgrp">${dot('s:fill', 'none', d.fill, 'No fill') + quickDots('s:fill', 'qFill', d.fill)}</span>`]);
    /* a width that is not one of the row's presets: the border chip (where it was set) shows it as chosen, with a dot */
    const ownS = d.stroke !== 'none' && !presetOf('bSty').some(p => styMatch(p, styOf('bSty', d), false));
    P.push(['border', `<button class="wd bchip ${ownS ? 'on mark' : ''}" data-a="s:bpal" title="Border: none, colour, width, dashes">${chip(d.stroke || '#1d1d1f', true)}</button>` + stySeg('s:bsty', 'bSty', d)]);
    if (t === 'tri') P.push(['dir', seg('s:dir', d.dir || 'up', DIRS)]);
    if (t === 'diamond') P.push(['dia', seg('s:dia', diaOf(d), DIAS)]);
    if (t === 'rect' || t === 'diamond') P.push(['round', ib('s:round', RND_IC, `Rounded corners (${radPre()}px · right-click to set)`, (d.rad || 0) > 0)]);
    return P;
  }
  if (t === 'dot') {
    const d = defOf('dot');
    return [['col', `<span class="qgrp">${dot('s:dcol', '#1d1d1f', d.fill, 'Ink') + quickDots('s:dcol', 'qFill', d.fill, ['#1d1d1f'])}</span>`], ['size', dszSeg('s:dsz', d.w)]];
  }
  if (t === 'text') {
    const ts = defOf('text').ts;
    return [['size', tszHTML('s:tsize', ts.size, 'tSub')], ['style', ib('s:bold', IC.bold, 'Bold', ts.bold) + ib('s:italic', IC.ital, 'Italic', ts.italic) + ib('s:under', IC.under, 'Underline', ts.under) + ib('s:vert', IC.vert, 'Vertical', ts.vert)],
      ['col', `<span class="qgrp">${quickDots('s:tcol', 'qText', ts.color)}</span>`]];
  }
  if (t === 'edge') {
    const E = prefs.edge;
    const tl = E.tail || 'none', hd = E.head ?? 'vee', cur = tl + '|' + hd, known = ARROWS.some(a => a[0] === cur);
    return [['lstyle', stySeg('s:lsty', 'lSty', { sw: E.sw || 1.4, dash: E.dash, shape: E.shape, color: E.color || '#1d1d1f' })],
      ['arrow', seg('s:arrow', known ? cur : '', ARROWS) + `<button class="wd more ${subExp || !known ? 'on' : ''} ${!known ? 'mark' : ''}" data-a="s:hx" data-v="x" title="More arrow heads: pick start and end">${MORE_IC}</button>`]];
  }
  if (t === 'laser') return [['mode', seg('s:lmode', prefs.laserMode || 'line', [['dot', LZ_IC.dot, 'Dot: a glowing pointer'], ['line', LZ_IC.line, 'Line: a fading trail']])]];
  return [];
}
/* the parts a layout shows for tool t, in its order */
function subShown(t, d = curDock()) {
  const all = subParts(t), cfg = d.subs && d.subs[t];
  return cfg ? cfg.map(id => all.find(p => p[0] === id)).filter(Boolean) : all;
}
let subIds = [];
function subHTML(t) { const L = subShown(t); subIds = L.map(p => p[0]); return L.map(p => p[1]).join(vs); }
let subAnimT = 0;
function drawSub(keep) {
  const t = stamp || (isLocked() && tool !== 'laser') ? null : PEEK.has(tool) && !subPeek ? null : tool, h = t ? subHTML(t) : '';
  /* another tool: whatever was opened from the old row (colours, border, heads, preset card) goes with it */
  if (subTool !== t) {
    if (!pp.hidden && (ppKey === '_pal' || ppKey === '_bord' || (ppAnchor && sub.contains(ppAnchor)))) { pp.classList.add('out'); clearTimeout(outT); outT = setTimeout(() => { pp.classList.remove('out'); closePP(); }, 150); }
    if (typeof closeHP === 'function') closeHP(true);
    if (!qpop.hidden) closeQ();
  }
  if (!h) { sub.classList.remove('in'); subTool = null; sub._sig = null; return; }
  const html = `<div class="srow">${h}</div>`;
  /* same tool: change only what changed (selection ring, pill), no rebuild, no replayed entrance */
  if (subTool === t && sub.classList.contains('in') && patchHTML(sub, html)) { placeSub(); return; }
  const old = keep && subTool === t ? $$('.seg > .pill', sub).map(q => ({ transform: q.style.transform, width: q.style.width, height: q.style.height })) : null;
  sub.innerHTML = html; sub._sig = sigOf(html);
  initSegs(sub, old);
  if (subTool !== t) {
    sub.classList.remove('in'); void sub.offsetWidth;
    sub.classList.add('anim'); clearTimeout(subAnimT); subAnimT = setTimeout(() => sub.classList.remove('anim'), 500);
  }
  subTool = t; sub.classList.add('in');
  placeSub();
}
function placeSub() {
  if (!sub.classList.contains('in')) return;
  requestAnimationFrame(placeHP);
  const side = $('#dock').dataset.side || 'bottom';
  /* beside a side dock the row stands upright: set the side first so the size is measured in that layout */
  if (sub.dataset.side !== side) { sub.dataset.side = side; sub.querySelectorAll('.seg').forEach(sg => syncPill(sg, sg.querySelector(':scope > button.on'), true)); }
  const d = $('#dock').getBoundingClientRect(), b = $('#dock .tool.on')?.getBoundingClientRect() || d, w = sub.offsetWidth, h = sub.offsetHeight;
  let x, y;
  if (side === 'bottom') { x = clamp(b.left + b.width / 2 - w / 2, 8, innerWidth - w - 8); y = d.top - h - 8; }
  else { x = side === 'left' ? d.right + 8 : d.left - w - 8; y = Math.max(8, Math.min(Math.max(b.top + b.height / 2 - h / 2, 56), innerHeight - h - 8)); }
  sub.dataset.side = side; sub.style.left = x + 'px';
  if (side === 'bottom') { sub.style.top = 'auto'; sub.style.bottom = (innerHeight - d.top + 8) + 'px'; } else { sub.style.bottom = 'auto'; sub.style.top = y + 'px'; }
}
function subAct(a, v) {
  const k = a.slice(2), D = kk => (prefs.defs[kk] ||= {});
  switch (k) {
    case 'selm': setSelMode(v); break;
    case 'tool': setTool(v); return;
    case 'fill': case 'stroke': SHAPES.forEach(s2 => (D(s2)[k] = v)); break;
    case 'sw': if (!(+v > 0)) return; SHAPES.forEach(s2 => { D(s2).sw = Math.min(+v, 12); if (defOf(s2).stroke === 'none') D(s2).stroke = '#1d1d1f'; }); break;
    case 'sd': SHAPES.forEach(s2 => { D(s2).sd = v; if (defOf(s2).stroke === 'none') D(s2).stroke = '#1d1d1f'; }); break;
    case 'bpal': {
      const d0 = () => defOf(SHAPES.includes(tool) ? tool : 'rect');
      pp._edge = (a2, v2) => { subAct('s:' + a2, v2); refreshPP(); };
      openPP('_bord', sub.querySelector('[data-a="s:bpal"]'), () => { const d = d0(); return `<div class="row">${(off => offG(off, wdHTML('sw', off ? null : d.sw, 0, 'wBar') + wStep('sw', off ? null : d.sw) + vs + dashSeg('sd', off ? null : d.sd || 'solid') + vs + ib('dbl', DBL_IC, 'Double border', !off && !!d.dbl)))(d.stroke === 'none')}</div>${palHTML('stroke', d.stroke)}`; });
      return;
    }
    case 'dbl': { const on = !defOf(tool).dbl || defOf(tool).stroke === 'none'; SHAPES.forEach(s2 => { D(s2).dbl = on; if (on && defOf(s2).stroke === 'none') D(s2).stroke = '#1d1d1f'; }); break; }
    case 'dir': D('tri').dir = v; break;
    case 'dia': { const [w, h] = DIA_SZ[v] || DIA_SZ.sq; D('diamond').w = w; D('diamond').h = h; break; }
    case 'round': { const on = !(defOf(tool).rad > 0); ['rect', 'diamond'].forEach(s2 => (D(s2).rad = on ? radPre() : 0)); break; }
    case 'bsty': { const p = presetOf('bSty')[+v]; if (!p) return; SHAPES.forEach(s2 => { const d = D(s2); d.sw = p.sw ?? 1.5; d.sd = p.sd || 'solid'; if (p.col) d.stroke = p.col; else if (defOf(s2).stroke === 'none') d.stroke = '#1d1d1f'; }); break; }
    case 'lsty': { const p = presetOf('lSty')[+v]; if (!p) return; const E = prefs.edge; E.sw = p.sw ?? 1.4; E.dash = p.dash || 'solid'; E.shape = p.shape || 'line'; if (p.col) E.color = p.col; syncDock(); break; }
    case 'tsize': (D('text').ts ||= {}).size = +v; break;
    case 'bold': case 'italic': case 'under': case 'vert': { const ts = (D('text').ts ||= {}); ts[k] = !defOf('text').ts[k]; break; }
    case 'tcol': (D('text').ts ||= {}).color = v; break;
    case 'dash': case 'shape': case 'head': case 'tail': case 'route': prefs.edge[k] = v; syncDock(); break;
    case 'hx': if (subExp && hpHover) { hpHover = false; drawSub(true); return; } if (subExp) closeHP(); else openHP(); return;
    case 'arrow': { const [a1, b1] = v.split('|'); prefs.edge.tail = a1; prefs.edge.head = b1; syncDock(); break; }
    case 'lmode': prefs.laserMode = v; laserPts = []; break;
    case 'dcol': D('dot').fill = v; break;
    case 'dsz': { const d = Math.round(+v); if (!(d >= 2)) return; D('dot').w = D('dot').h = Math.min(80, d); syncDock(); break; }
    case 'pal': {
      const key = v, curOf = () => key === 'tcol' ? defOf('text').ts.color : key === 'dcol' ? defOf('dot').fill : defOf(SHAPES.includes(tool) ? tool : 'rect').fill;
      pp._edge = (a2, v2) => { subAct('s:' + key, v2); refreshPP(); };
      openPP('_pal', sub.querySelector('[data-a="s:pal"]'), () => palHTML('x', curOf(), key === 'fill', true));
      return;
    }
  }
  savePrefs(); drawSub(true);
  if ((k === 'selm' || k === 'lmode') && subPeek) setTimeout(() => { subPeek = false; drawSub(); }, 280);
}
sub.addEventListener('pointerdown', e => e.stopPropagation());
sub.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b) subAct(b.dataset.a, b.dataset.v); });
bar.addEventListener('contextmenu', e => {
  const b = e.target.closest('.sdot[data-q]'); if (!b) return;
  e.preventDefault(); e.stopPropagation(); quickMenu(b);
});
sub.addEventListener('contextmenu', e => {
  e.preventDefault();
  const b = e.target.closest('.sdot[data-q], .sdot[data-qt]'); if (b) { quickMenu(b); return; }
  /* which part: count the separators before the pressed item */
  const row = sub.querySelector('.srow'); let top = e.target; while (top && top.parentElement !== row) top = top.parentElement;
  const t = subTool; if (!top || !t) return;
  let i = 0; for (let x = top.previousElementSibling; x; x = x.previousElementSibling) if (x.classList.contains('vsep')) i++;
  const id = subIds[i], items = [];
  if (id && subIds.length > 1) items.push({ t: `Hide “${SUB_NAMES[id]}”`, ic: small(IC.close), f: () => editDock(d => { (d.subs ||= {})[t] = subIds.filter(x => x !== id); }) });
  items.push({ t: 'Customize this menu…', ic: small(IC.gear), f: () => openDockEd(t) });
  showMenu(e.clientX, e.clientY, items);
  const r = menu.getBoundingClientRect(); menu.style.top = Math.max(8, sub.getBoundingClientRect().top - r.height - 6) + 'px';
});
const _openPP = openPP;
openPP = function (key, anchor, build, hover) { if (!key.startsWith('_')) pp._edge = null; if (key !== ppKey) pp._full = false; _openPP(key, anchor, build, hover); };
pp.addEventListener('click', e => {
  const b = e.target.closest('[data-pfull]'); if (!b) return;
  e.stopImmediatePropagation(); pp._full = !pp._full; refreshPP(); if (ppAnchor) placePop(pp, ppAnchor);
}, true);
pp.addEventListener('contextmenu', e => { const b = e.target.closest('.sdot[data-q]'); if (!b) return; e.preventDefault(); e.stopPropagation(); quickMenu(b); });

/* ---------- hover to open: sub-bar "+" colours and "⋯" heads, Settings ---------- */
let hvT = 0, hpLeaveT = 0;
function hoverPPTrigger(el, open) {
  clearTimeout(hvT); clearTimeout(leaveT);
  if (ppAnchor === el && !pp.hidden) { if (pp.classList.contains('out')) { clearTimeout(outT); pp.classList.remove('out'); } return; }
  if (!pp.hidden && !ppHover) return;
  hvT = setTimeout(() => { open(); if (!pp.hidden && ppAnchor === el) ppHover = true; }, pp.hidden ? 140 : 50);
}
function hpLeave() {
  clearTimeout(hpLeaveT);
  hpLeaveT = setTimeout(() => { if (hpHover && !hpop.matches(':hover') && !sub.querySelector('[data-a="s:hx"]:hover')) closeHP(); }, 280);
}
sub.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse') return;
  const b = e.target.closest('[data-a="s:pal"], [data-a="s:bpal"], [data-a="s:hx"]');
  if (!b) { clearTimeout(hvT); return; }
  if (b.dataset.a !== 's:hx') hoverPPTrigger(b, () => subAct(b.dataset.a, b.dataset.v));
  else { clearTimeout(hpLeaveT); clearTimeout(hvT); if (hpop.hidden || hpop.classList.contains('out')) hvT = setTimeout(() => { openHP(); hpHover = true; }, 140); }
});
sub.addEventListener('pointerout', e => {
  if (e.pointerType !== 'mouse') return;
  const b = e.target.closest('[data-a="s:pal"], [data-a="s:bpal"], [data-a="s:hx"]'); if (!b || b.contains(e.relatedTarget)) return;
  clearTimeout(hvT);
  if (b.dataset.a !== 's:hx') { if (ppHover && ppAnchor === b) schedLeave(); }
  else if (hpHover) hpLeave();
});
hpop.addEventListener('pointerenter', () => clearTimeout(hpLeaveT));
hpop.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' && hpHover) hpLeave(); });
for (const id of ['btnSet']) {
  const el = $('#' + id);
  el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hoverPPTrigger(el, () => el.click()); });
  el.addEventListener('pointerleave', e => { clearTimeout(hvT); if (e.pointerType === 'mouse' && ppHover && ppAnchor === el) schedLeave(); });
}

/* ---------- movable dock: bottom, left or right edge ---------- */
let dockSide = lsGet(LS.dock) || 'bottom';
const dockEl = $('#dock');
function applyDockSide(from) {
  const side = innerWidth <= 640 ? 'bottom' : dockSide;
  dockEl.dataset.side = side; document.body.dataset.dock = side; dockEl.classList.toggle('side', side !== 'bottom');
  if (from) {
    const r1 = dockEl.getBoundingClientRect();
    const an = dockEl.animate([{ translate: `${from.left - r1.left}px ${from.top - r1.top}px`, opacity: .85 }, { translate: '0 0', opacity: 1 }], { duration: 460, easing: 'cubic-bezier(.3,1.25,.5,1)' });
    sub.classList.remove('in'); subTool = null;
    an.finished.then(() => drawSub(), () => {});
    $$('.tool, .dock-sep', dockEl).forEach((b, i) => b.animate([{ opacity: 0, scale: .6 }, { opacity: 1, scale: 1 }], { duration: 300, delay: 60 + i * 18, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'backwards' }));
  }
  syncDock(); placeSub();
}
function dockTarget(x) { return x < innerWidth * .22 ? 'left' : x > innerWidth * .78 ? 'right' : 'bottom'; }
function showDockHint(side) {
  const h = $('#dockHint'); if (!side) { h.hidden = true; return; }
  h.hidden = false;
  /* the outline of the dock where it would land: same size as the dock, a few px around it */
  const L = Math.max(dockEl.offsetWidth, dockEl.offsetHeight) + 8, S = Math.min(dockEl.offsetWidth, dockEl.offsetHeight) + 8;
  const r = side === 'bottom' ? { left: (innerWidth - L) / 2, top: innerHeight - S - 10, width: L, height: S } : { left: side === 'left' ? 10 : innerWidth - S - 10, top: Math.max(8, (innerHeight - L) / 2), width: S, height: Math.min(L, innerHeight - 16) };
  Object.assign(h.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
}
$('.dock-grip').addEventListener('pointerdown', e => {
  if (innerWidth <= 640) return;
  e.preventDefault(); e.stopPropagation();
  const g = e.currentTarget; try { g.setPointerCapture(e.pointerId); } catch (_) {}
  const sx = e.clientX, sy = e.clientY; let side = null;
  dockEl.classList.add('dragging'); sub.classList.remove('in');
  const mv = ev => { dockEl.style.translate = `${ev.clientX - sx}px ${ev.clientY - sy}px`; side = dockTarget(ev.clientX); showDockHint(side); };
  /* the drag ends on every way out (release anywhere, cancel, lost capture, window blur, Esc), only once */
  let done = false;
  const esc = ev => { if (ev.key === 'Escape') { side = null; up(); } };
  const up = () => {
    if (done) return; done = true;
    removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
    removeEventListener('blur', up); removeEventListener('keydown', esc, true); g.removeEventListener('lostpointercapture', up);
    try { g.releasePointerCapture(e.pointerId); } catch (_) {}
    const from = dockEl.getBoundingClientRect(); dockEl.style.translate = ''; dockEl.classList.remove('dragging'); showDockHint(null);
    if (side) { dockSide = side; lsSet(LS.dock, side); }
    applyDockSide(from);
  };
  addEventListener('pointermove', mv); addEventListener('pointerup', up); addEventListener('pointercancel', up);
  addEventListener('blur', up); addEventListener('keydown', esc, true); g.addEventListener('lostpointercapture', up);
});
$('.dock-grip').addEventListener('dblclick', () => { const from = dockEl.getBoundingClientRect(); dockSide = { bottom: 'left', left: 'right', right: 'bottom' }[dockSide]; lsSet(LS.dock, dockSide); applyDockSide(from); });

/* ---------- minimap ---------- */
const mm = $('#minimap'), mmc = $('#mmc');
let mmQ = false, mmView = null, mmDrag = false, mmCol = !!lsGet(LS.mm);
function queueMM() { if (!mmQ) { mmQ = true; requestAnimationFrame(drawMinimap); } }
function drawMinimap() {
  mmQ = false; mm.classList.toggle('collapsed', mmCol);
  $('#mmTog').innerHTML = mmCol ? IC.map : IC.closeS; $('#mmTog').title = mmCol ? 'Show map' : 'Hide map';
  const has = doc.nodes.length || doc.edges.length; mm.classList.toggle('empty', !has);
  if (!has || mmCol || getComputedStyle(mm).display === 'none') return;
  const Wd = mm.clientWidth, Hd = mm.clientHeight, dpr = devicePixelRatio || 1;
  if (mmc.width !== Math.round(Wd * dpr) || mmc.height !== Math.round(Hd * dpr)) { mmc.width = Math.round(Wd * dpr); mmc.height = Math.round(Hd * dpr); mmc.style.width = Wd + 'px'; mmc.style.height = Hd + 'px'; }
  const g = mmc.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, Wd, Hd);
  const v0 = W(0, 0), v1 = W(innerWidth, innerHeight);
  if (!mmDrag || !mmView) {
    const b = contentBox() || { l: v0.x, t: v0.y, r: v1.x, b: v1.y };
    const U = { l: Math.min(b.l, v0.x), t: Math.min(b.t, v0.y), r: Math.max(b.r, v1.x), b: Math.max(b.b, v1.y) }, pad = 8;
    const sc = Math.min((Wd - 2 * pad) / (U.r - U.l || 1), (Hd - 2 * pad) / (U.b - U.t || 1));
    mmView = { s: sc, ox: pad + ((Wd - 2 * pad) - (U.r - U.l) * sc) / 2 - U.l * sc, oy: pad + ((Hd - 2 * pad) - (U.b - U.t) * sc) / 2 - U.t * sc };
  }
  const { s: sc, ox, oy } = mmView, X = x => ox + x * sc, Y = y => oy + y * sc;
  g.strokeStyle = 'rgba(30,30,30,.45)'; g.lineWidth = .8; g.beginPath();
  for (const e of doc.edges) { const gm = egeo.get(e.id); if (!gm) continue; g.moveTo(X(gm.P.x), Y(gm.P.y)); g.lineTo(X(gm.mid.x), Y(gm.mid.y)); g.lineTo(X(gm.Q.x), Y(gm.Q.y)); }
  g.stroke();
  for (const n of doc.nodes) {
    const { w, h } = size(n);
    g.beginPath();
    if (n.k === 'circle' || n.k === 'dot') g.ellipse(X(n.x), Y(n.y), Math.max(1, w / 2 * sc), Math.max(1, h / 2 * sc), (n.rot || 0) * D2R, 0, Math.PI * 2);
    else { const P = poly(n.k === 'text' || n.k === 'image' ? { k: 'rect' } : n, w, h).map(([x, y]) => fromLocal(n, { x, y })); P.forEach((q, i) => i ? g.lineTo(X(q.x), Y(q.y)) : g.moveTo(X(q.x), Y(q.y))); g.closePath(); }
    g.fillStyle = n.k === 'text' ? 'rgba(120,120,120,.35)' : n.k === 'image' ? '#d9d9e6' : n.fill === 'none' ? 'transparent' : n.fill;
    g.fill();
    if (n.k !== 'text' && n.stroke !== 'none') { g.strokeStyle = 'rgba(30,30,30,.6)'; g.lineWidth = .6; g.stroke(); }
  }
  g.fillStyle = 'rgba(91,91,214,.08)'; g.strokeStyle = 'rgba(91,91,214,.9)'; g.lineWidth = 1.2;
  g.beginPath(); g.roundRect ? g.roundRect(X(v0.x), Y(v0.y), (v1.x - v0.x) * sc, (v1.y - v0.y) * sc, 3) : g.rect(X(v0.x), Y(v0.y), (v1.x - v0.x) * sc, (v1.y - v0.y) * sc); g.fill(); g.stroke();
}
function mmGoto(e) {
  if (!mmView) return;
  const r = mmc.getBoundingClientRect(), wx = (e.clientX - r.left - mmView.ox) / mmView.s, wy = (e.clientY - r.top - mmView.oy) / mmView.s;
  cam.x = innerWidth / 2 - wx * cam.z; cam.y = innerHeight / 2 - wy * cam.z; applyCam();
}
mmc.addEventListener('pointerdown', e => { e.stopPropagation(); mmDrag = true; mm.classList.add('dragging'); mmc.setPointerCapture(e.pointerId); mmGoto(e); });
mmc.addEventListener('pointermove', e => { if (mmDrag) mmGoto(e); });
const mmEnd = () => { mmDrag = false; mm.classList.remove('dragging'); queueMM(); };
mmc.addEventListener('pointerup', mmEnd); mmc.addEventListener('pointercancel', mmEnd);
$('#mmTog').addEventListener('click', e => { e.stopPropagation(); mmCol = !mmCol; lsSet(LS.mm, mmCol); queueMM(); });

/* ================= menus ================= */
function closeMenu() { menu.hidden = true; }
function showMenu(x, y, items) {
  menu.innerHTML = items.map((it, i) => it === '-' ? '<div class="msep"></div>' : it.seg ? `<div class="mrow"><span>${it.t}</span><span class="mseg">${it.seg.map(([v, ic, t]) => `<button class="${v === it.cur ? 'on' : ''}" data-i="${i}" data-v="${v}" title="${t}">${ic}</button>`).join('')}</span></div>` : `<button class="mi ${it.danger ? 'danger' : ''}" data-i="${i}">${it.ic || ''}<span>${it.t}</span>${it.k ? `<kbd>${it.k}</kbd>` : ''}</button>`).join('');
  menu.hidden = false;
  const w = menu.offsetWidth, h = menu.offsetHeight;
  menu.style.left = clamp(x, 8, innerWidth - w - 8) + 'px'; menu.style.top = clamp(y, 8, innerHeight - h - 8) + 'px';
  menu.onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; closeMenu(); const it = items[+b.dataset.i]; it.seg ? it.f(b.dataset.v) : it.f(); };
}
const MOD = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl+';
const GEO_IC = {
  mid: sv('<path d="M4 16L20 8"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/><circle cx="4" cy="16" r="1.4" fill="currentColor" stroke="none"/><circle cx="20" cy="8" r="1.4" fill="currentColor" stroke="none"/>', 16),
  perp: sv('<path d="M3 18h18M12 18V5"/><path d="M12 14.5h3.5V18" stroke-width="1.2"/><circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none"/>', 16),
  pbis: sv('<path d="M4 15h16M12 4v16" /><circle cx="12" cy="15" r="1.8" fill="currentColor" stroke="none"/><path d="M4 13v4M20 13v4" stroke-width="1.2"/>', 16),
  par: sv('<path d="M3 16L17 8M7 20l14-8"/><circle cx="7" cy="20" r="1.5" fill="currentColor" stroke="none"/>', 16),
  inter: sv('<path d="M4 18L20 6M4 7l16 11"/><circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none"/>', 16),
  refl: sv('<path d="M12 3v18" stroke-dasharray="2 2"/><circle cx="6" cy="9" r="1.8" fill="currentColor" stroke="none"/><circle cx="18" cy="9" r="1.8"/><path d="M8 9h8" stroke-width="1" stroke-dasharray="1.5 1.5"/>', 16),
  ctr: sv('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none"/>', 16),
  free: sv('<circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>', 16),
};
/* what the selection can build: [action id, label, run]; the same list feeds the right-click menu and the keys */
function geoOptions() {
  const ns = selNodes().filter(n => n.k !== 'image'), es = selEdges().filter(e => !(e.a && e.a === e.b)), out = [];
  const circ = n => n.k === 'circle';
  if ((es.length === 1 && !ns.length) || (ns.length === 2 && !es.length)) {
    const base = es.length ? { e: es[0].id } : { a: ns[0].id, b: ns[1].id };
    out.push(['mid', 'Midpoint', () => geoMake(() => [mkPt({ op: 'mid', ...base })])]);
    out.push(['pbis', 'Perpendicular bisector', () => geoMake(() => { const a = mkPt({ op: 'pb', ...base, s: 1 }, 5), b = mkPt({ op: 'pb', ...base, s: -1 }, 5); return [a, b, geoEdge(a, b)]; })]);
  }
  if (ns.length === 1 && es.length === 1) {
    const q = ns[0].id, e = es[0].id;
    out.push(['perp', 'Perpendicular to the line', () => geoMake(() => { const f = mkPt({ op: 'foot', p: q, e }); return [f, geoEdge(ns[0], f)]; })]);
    out.push(['par', 'Parallel through the point', () => geoMake(() => { const r = mkPt({ op: 'par', p: q, e }); return [r, geoEdge(ns[0], r)]; })]);
    out.push(['refl', 'Reflect in the line', () => geoMake(() => [mkPt({ op: 'refl', p: q, e })])]);
    if (circ(ns[0])) out.push(['inter', 'Where line and circle meet', () => geoMake(() => [mkPt({ op: 'xlc', e, c: q, s: 1 }), mkPt({ op: 'xlc', e, c: q, s: -1 })])]);
  }
  if (es.length === 2 && !ns.length) out.push(['inter', 'Intersection', () => geoMake(() => [mkPt({ op: 'x', e: es[0].id, e2: es[1].id })])]);
  if (ns.length === 2 && !es.length && ns.every(circ)) out.push(['inter', 'Where the circles meet', () => geoMake(() => [mkPt({ op: 'xcc', c1: ns[0].id, c2: ns[1].id, s: 1 }), mkPt({ op: 'xcc', c1: ns[0].id, c2: ns[1].id, s: -1 })])]);
  if (ns.length === 1 && !es.length && ns[0].k !== 'dot') out.push(['ctr', 'Centre point', () => geoMake(() => [mkPt({ op: 'ctr', n: ns[0].id })])]);
  return out;
}
function mkPt(dep, size) {
  const n = newNode('dot', 0, 0); if (size) n.w = n.h = size;
  n.dep = dep; doc.nodes.push(n); idx.set(n.id, n);
  const r = depPos(dep); if (r) { n.x = r.x; n.y = r.y; } else n.dead = true;
  return n;
}
function geoEdge(a, b) {
  const e = newEdge(a, b); e.head = 'none'; e.tail = 'none'; e.bend = 0;
  for (const k of ['route', 'c1', 'c2', 'em', 'ek']) delete e[k];
  return e;
}
function geoMake(fn) {
  if (isLocked()) { lockedStop(); return; }
  let made = [];
  mutate(() => { made = fn(); sel.clear(); made.forEach(m => sel.add(m.id)); });
  if (made.some(m => m.dead)) toast('They do not meet here: the point shows faint until they do');
}
const GEO_HELP = { mid: 'a line, or two points', pbis: 'a line, or two points', perp: 'a point and a line', par: 'a point and a line', refl: 'a point and a line', inter: 'two lines, two circles, or a line and a circle', ctr: 'one shape' };
function construct(id) {
  const o = geoOptions().find(x => x[0] === id);
  if (o) o[2](); else toast('Select ' + GEO_HELP[id] + ' first');
}
function freeSel() { mutate(() => selNodes().forEach(n => { delete n.dep; delete n.dead; })); toast('Now a free point'); }
function ctxItems(x, y) {
  const geo = geoOptions().map(([id, t, f]) => ({ t, ic: GEO_IC[id], k: keys[id] ? keyLabel(keys[id]) : '', f }));
  if (selNodes().some(n => n.dep)) geo.push({ t: 'Make free (stop following)', ic: GEO_IC.free, f: freeSel });
  const items = [...geo, ...(geo.length ? ['-'] : []),
    { t: 'Duplicate', k: MOD + 'D', ic: IC.dup, f: duplicate },
    { t: 'Copy', k: MOD + 'C', ic: IC.copy, f: copyOut },
  ];
  if (selNodes().length + selEdges().length === 1 && !selNodes().some(n => n.dep || n.k === 'image')) items.push({ t: 'Add to toolbar', ic: small(IC.plus), f: addStampFromSel });
  const pn = selNodes().filter(n => hasPorts(n) && EB.has(n.id)), cn = selNodes().filter(n => n.k !== 'dot' && EB.has(n.id));
  if (cn.length || pn.length) items.push('-');
  if (cn.length) items.push({ t: 'Lines meet', seg: ATTS, cur: common(cn, attOf), f: v => act('catt', v) });
  if (pn.length) items.push({ t: 'Ports', seg: LAYS, cur: common(pn, n => n.lay || ''), f: v => act('play', v) });
  if (selNodes().length) items.push('-',
    { t: 'Bring to front', k: '⇧' + MOD + ']', ic: IC.ftop, f: () => order('top') },
    { t: 'Bring forward', k: MOD + ']', ic: IC.front, f: () => order('up') },
    { t: 'Send backward', k: MOD + '[', ic: IC.back, f: () => order('down') },
    { t: 'Send to back', k: '⇧' + MOD + '[', ic: IC.fbot, f: () => order('bottom') });
  items.push('-', { t: 'Delete', k: '⌫', ic: IC.trash, danger: true, f: deleteSel });
  showMenu(x, y, items);
}
function ctxAt(cx, cy, p, target) {
  closePP();
  /* the selection overlay can sit on top of a line: look through everything under the pointer */
  const under = document.elementsFromPoint(cx, cy), lineEl = under.map(x => x.closest && x.closest('#edges [data-e], .elab')).find(Boolean);
  const elab = target?.closest?.('.elab'), n = elab ? null : hitNode(p), eg = elab || (!n && (target?.closest?.('[data-e]') || lineEl));
  const id = n?.id || (eg ? eg.dataset.e : null);
  if (id) { if (!sel.has(id)) selectOnly(id); openBar(); return; }
  showMenu(cx, cy, [
    { t: 'Paste', k: MOD + 'V', ic: IC.paste, f: pasteHere },
    { t: 'Insert picture…', ic: IC.image.replace(/width="18" height="18"/, 'width="16" height="16"'), f: () => { pickAt = p; pickImage(null); } },
    { t: 'Add text', ic: IC.text.replace(/width="18" height="18"/, 'width="16" height="16"'), f: () => createText(snapP(p)) },
    '-',
    { t: 'Select all', k: MOD + 'A', f: selectAll },
    { t: 'Fit everything', k: 'F', ic: IC.fit, f: fit },
  ]);
}
function selectAll() { sel = new Set([...doc.nodes.map(n => n.id), ...doc.edges.map(e => e.id)]); render(); }

/* ================= images ================= */
let pickTarget = null, pickAt = null;
function pickImage(target) { pickTarget = target; const f = $('#fileImg'); f.value = ''; f.click(); }
$('#fileImg').addEventListener('change', e => { const f = e.target.files[0]; if (f) addImageFile(f, pickAt, pickTarget); pickAt = null; pickTarget = null; });
const readURL = f => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsDataURL(f); });
const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
async function addImageFile(file, at, into) {
  if (!file.type.startsWith('image/')) return;
  let url = await readURL(file), img = await loadImg(url);
  let w = img.naturalWidth || 200, h = img.naturalHeight || 150;
  const MAX = 1800;
  if (Math.max(w, h) > MAX && !/svg/.test(file.type)) {
    const s = MAX / Math.max(w, h), c = document.createElement('canvas'); c.width = Math.round(w * s); c.height = Math.round(h * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    url = c.toDataURL(/png|gif|webp/.test(file.type) ? 'image/png' : 'image/jpeg', .9); w = c.width; h = c.height;
  }
  const aid = 'a' + uid(); assets[aid] = url;
  if (into && into.k !== 'image' && doc.nodes.includes(into)) {
    mutate(() => { into.img = aid; into.nat = { w, h }; delete into.crop; if (into.k === 'text') into.k = 'rect'; });
    return;
  }
  const c = at || W(innerWidth / 2, innerHeight / 2 - 20), s = Math.min(1, 260 / Math.max(w, h));
  if (into && into.k === 'image') { mutate(() => { into.img = aid; into.nat = { w, h }; delete into.crop; into.h = into.w * h / w; }); return; }
  mutate(() => { const n = newNode('image', c.x, c.y, { w: w * s, h: h * s, img: aid, nat: { w, h } }); doc.nodes.push(n); sel.clear(); sel.add(n.id); });
  setTool('select');
}
document.addEventListener('paste', e => {
  clearTimeout(pasteWait); pasteWait = 0;
  if (e.target.closest?.('input, textarea, [contenteditable=true], [contenteditable=plaintext-only]')) return;
  if (isLocked()) { lockedStop(); return; }
  const tx = e.clipboardData?.getData('text/plain');
  /* our own copy is still what the clipboard holds (or the clipboard says nothing): paste it exactly */
  const nFiles = [...(e.clipboardData?.files || [])].length;
  if (clip && !nFiles && (clipText === null || !tx || tx === clipText || tx.replace(/\r\n/g, '\n') === clipText)) { e.preventDefault(); pasteHere(); return; }
  if (tx && /%figura:|\\begin\{(figura|tikzpicture)\}|^\s*\\(node|draw)\b/.test(tx)) { const d = parseTikz(tx); if (d) { e.preventDefault(); pasteClip(d, 0); toast('Pasted from LaTeX'); return; } }
  const files = [...(e.clipboardData?.files || [])].filter(f => f.type.startsWith('image/'));
  if (files.length) {
    e.preventDefault();
    const ns = selNodes(), into = ns.length === 1 && ns[0].k !== 'image' && ns[0].k !== 'text' ? ns[0] : null;
    files.forEach((f, i) => addImageFile(f, lastPtr && { x: lastPtr.x + i * 20, y: lastPtr.y + i * 20 }, i ? null : into));
    return;
  }
  const t = e.clipboardData?.getData('text/plain');
  if (t) { e.preventDefault(); const p = snapP(lastPtr || W(innerWidth / 2, innerHeight / 2)); mutate(() => { const n = newNode('text', p.x, p.y, { text: t.slice(0, 2000) }); doc.nodes.push(n); sel.clear(); sel.add(n.id); }); }
});
vp.addEventListener('dragover', e => { e.preventDefault(); });
vp.addEventListener('drop', e => {
  e.preventDefault();
  const p = evW(e), fs = [...e.dataTransfer.files];
  if (fs.some(f => /\.(figura|json|tex)$/i.test(f.name))) { fs.filter(f => /\.(figura|json|tex)$/i.test(f.name)).forEach(openFile); return; }
  if (isLocked()) { lockedStop(); return; }
  const into = hitNode(p);
  fs.filter(f => f.type.startsWith('image/')).forEach((f, i) => addImageFile(f, { x: p.x + i * 24, y: p.y + i * 24 }, i ? null : (into && into.k !== 'text' ? into : null)));
});

/* ================= keyboard ================= */
const typing = t => t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
addEventListener('keydown', e => {
  if (typing(e.target)) return;
  const k = e.key, mod = e.metaKey || e.ctrlKey, lk = k.toLowerCase();
  if ((k === 'Meta' || k === 'Control') && !e.repeat && selNodes().length && !isLocked()) { clearTimeout(nbT); nbT = setTimeout(() => { nbOn = performance.now(); drawOverlay(); }, 160); }
  else if (mod) { clearTimeout(nbT); if (nbOn) { nbOn = 0; drawOverlay(); } }
  if (['Shift', 'Alt', 'Meta', 'Control', 'CapsLock'].includes(k)) return;
  if (k === ' ') { if (!space) { space = true; vp.classList.add('hand'); } e.preventDefault(); return; }
  if (isLocked() && (mod ? !'cso0=-'.includes(lk) || lk.length > 1 : !(lk === 'escape' || LOCK_OK.has(actionOf(lk)) || /^[0-9]$/.test(k)))) { e.preventDefault(); lockedStop(); return; }
  if (mod) {
    const h = {
      z: () => (e.shiftKey ? redo() : undo()), y: redo, c: copyOut, x: () => { if (copyOut()) deleteSel(); }, d: duplicate, a: selectAll,
      ']': () => order(e.shiftKey ? 'top' : 'up'), '}': () => order('top'), '[': () => order(e.shiftKey ? 'bottom' : 'down'), '{': () => order('bottom'),
      s: () => saveFile(), o: () => $('#fileDoc').click(), 0: () => zoom100(),
      '=': () => zoomAt(1.2, innerWidth / 2, innerHeight / 2), '-': () => zoomAt(1 / 1.2, innerWidth / 2, innerHeight / 2),
      b: () => selNodes().length && act('tbold'), i: () => selNodes().length && act('tital'), u: () => selNodes().length && act('tunder'),
    }[lk];
    if (h) { e.preventDefault(); h(); }
    /* ⌘V goes through the paste event (it can read the clipboard); browsers that send none get our own copy */
    else if (lk === 'v' && !e.shiftKey && clip) { clearTimeout(pasteWait); pasteWait = setTimeout(() => { if (pasteWait) { pasteWait = 0; pasteHere(); } }, 120); }
    return;
  }
  if (e.altKey) return;
  if (k === 'Escape') {
    if (crop) endCrop(); else if (compassPend) { compassPend = null; drawOverlay(); } else if (wirePend) { wirePend = null; drawOverlay(); } else if (!pp.hidden || !menu.hidden) { closePP(); closeMenu(); }
    else if (!$('#modal').hidden) closeModal(); else if (sel.size) { sel.clear(); render(); } else setTool('select');
    return;
  }
  if (k === 'Enter') {
    if (crop) { endCrop(); return; }
    const ns = selNodes(); if (ns.length === 1) { e.preventDefault(); ns[0].k === 'image' ? startCrop(ns[0]) : editNode(ns[0]); }
    else { const es = selEdges(); if (es.length === 1) { e.preventDefault(); editEdgeLabel(es[0]); } }
    return;
  }
  if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); deleteSel(); return; }
  if (k.startsWith('Arrow') && sel.size) {
    e.preventDefault();
    const st = e.shiftKey ? (step() || 10) : (step() ? step() / 2 : 1), dx = k === 'ArrowLeft' ? -st : k === 'ArrowRight' ? st : 0, dy = k === 'ArrowUp' ? -st : k === 'ArrowDown' ? st : 0;
    mutate(() => { forNodes(n => { n.x += dx; n.y += dy; }); selEdges().forEach(ed => { if (!ed.a && ed.pa) ed.pa = { x: ed.pa.x + dx, y: ed.pa.y + dy }; if (!ed.b && ed.pb) ed.pb = { x: ed.pb.x + dx, y: ed.pb.y + dy }; }); });
    return;
  }
  /* the layout's own buttons answer to their keys first */
  { const st = !mod && !e.altKey && curItems().find(x => typeof x === 'object' && x.key && x.key === lk); if (st) { e.preventDefault(); setTool('st:' + st.id, true); return; } }
  const aid = actionOf(lk);
  /* hold the connect key: connect from the selection; hold the Dot key: parallel lines; tap it: the Dot tool */
  if (aid === 'wire') { e.preventDefault(); if (!e.repeat && !holdS && tool === 'select' && selNodes().length) { holdS = true; setTool('edge'); } return; }
  if (aid === 'dot' && (tool === 'select' || tool === 'edge') && selNodes().length) {
    e.preventDefault(); if (!e.repeat && !parMode) { parMode = { t0: performance.now(), used: false }; vp.classList.add('place'); drawOverlay(); } return;
  }
  if (aid === 'swap' && selNodes().length !== 2) return;
  if (aid) { if (e.shiftKey && TOOLS.includes(aid)) return; e.preventDefault(); ACTIONS.find(x => x[0] === aid)[4](); return; }
  if (/^[0-9]$/.test(k)) { const it = curItems().filter(x => x !== '|')[(+k + 9) % 10]; if (it) setTool(itemKey(it), true); return; }
});
addEventListener('keyup', e => {
  const lk = (e.key || '').toLowerCase();
  if (e.key === 'Meta' || e.key === 'Control') { clearTimeout(nbT); if (nbOn) { nbOn = 0; drawOverlay(); } }
  if (lk === keys.wire && holdS) { holdS = false; wirePend = null; setTool('select'); }
  if (lk === keys.dot && parMode) { const pm = parMode; parMode = null; vp.classList.toggle('place', tool !== 'select'); if (!pm.used && performance.now() - pm.t0 < 280) setTool('dot', true); else drawOverlay(); }
});
addEventListener('keyup', e => { if (e.key === ' ') { space = false; if (tool !== 'hand') vp.classList.remove('hand'); } });
addEventListener('blur', () => { clearTimeout(nbT); nbOn = 0; if (holdS) { holdS = false; setTool('select'); } parMode = null; space = false; vp.classList.toggle('hand', tool === 'hand'); });
const zoom100 = () => flyTo({ x: innerWidth / 2 - (innerWidth / 2 - cam.x) / cam.z, y: innerHeight / 2 - (innerHeight / 2 - cam.y) / cam.z, z: 1 });

/* ================= grid & settings ================= */
function setGrid(g, user) {
  const was = prefs.grid;
  prefs.grid = g; savePrefs();
  if (user && g !== was) askSnap();
  vp.classList.toggle('g-free', g === 'free');
  $$('#gridSeg button').forEach(b => b.classList.toggle('on', b.dataset.g === g));
  syncPill($('#gridSeg'), $('#gridSeg button.on'));
  applyCam();
}
$('#gridSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setGrid(b.dataset.g, true); });
/* switching to a grid: if anything sits off it, a small card asks whether to snap everything to the nearest grid point */
const gpop = document.createElement('div'); gpop.id = 'gpop'; gpop.hidden = true; document.body.appendChild(gpop);
function offGrid() {
  const st = step(); if (!st) return null;
  const off = v => Math.abs(v - Math.round(v / st) * st) > .01;
  const ns = doc.nodes.filter(n => !n.dep && (off(n.x) || off(n.y)));
  const es = doc.edges.filter(e => (!e.a && e.pa && (off(e.pa.x) || off(e.pa.y))) || (!e.b && e.pb && (off(e.pb.x) || off(e.pb.y))));
  return ns.length || es.length ? { ns, es, n: ns.length + es.length } : null;
}
function closeGpop() { if (gpop.hidden || gpop.classList.contains('out')) return; gpop.classList.add('out'); setTimeout(() => { gpop.hidden = true; gpop.classList.remove('out'); }, 160); }
function askSnap() {
  const o = offGrid(); if (!o || isLocked()) { closeGpop(); return; }
  gpop.innerHTML = `<span>${o.n === 1 ? '1 object is' : o.n + ' objects are'} off the grid</span><button class="gp-no">Leave</button><button class="gp-ok">Snap</button>`;
  gpop.classList.remove('out'); gpop.hidden = false;
  const r = $('#gridSeg').getBoundingClientRect(), w = gpop.offsetWidth;
  gpop.style.left = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8) + 'px'; gpop.style.top = (r.bottom + 10) + 'px';
  gpop.style.setProperty('--ax', (r.left + r.width / 2 - parseFloat(gpop.style.left)) + 'px');
  gpop.style.animation = 'none'; void gpop.offsetWidth; gpop.style.animation = '';
  gpop.onclick = e => { if (e.target.closest('.gp-ok')) { closeGpop(); snapAll(); } else if (e.target.closest('.gp-no')) closeGpop(); };
}
document.addEventListener('pointerdown', e => { if (!gpop.hidden && !gpop.contains(e.target) && !e.target.closest('#gridSeg')) closeGpop(); }, true);
/* every free object (and loose line end) glides to its nearest grid point; one undo step */
function snapAll() {
  const o = offGrid(); if (!o || lockedStop()) return;
  const before = snap(), moves = [];
  for (const n of o.ns) moves.push({ o: n, k: null, f: { x: n.x, y: n.y }, t: snapP(n) });
  for (const e of o.es) for (const w of ['a', 'b']) { const q = e['p' + w]; if (!e[w] && q) moves.push({ o: e, k: 'p' + w, f: { ...q }, t: snapP(q) }); }
  const t0 = performance.now(), ms = 260, ease = x => 1 - Math.pow(1 - x, 3);
  let done = false;
  const tick = now => {
    if (done) return;
    const k = ease(Math.min(1, ((now ?? performance.now()) - t0) / ms));
    for (const m of moves) { const tg = m.k ? m.o[m.k] : m.o; tg.x = m.f.x + (m.t.x - m.f.x) * k; tg.y = m.f.y + (m.t.y - m.f.y) * k; }
    render();
    if (k < 1) requestAnimationFrame(tick); else { done = true; commit(before); }
  };
  requestAnimationFrame(tick);
  setTimeout(() => tick(t0 + ms), ms + 80);   // finishes even when frames are paused (background tab)
}
$('#btnSet').addEventListener('click', e => {
  pp._edge = (a, v) => {
    if (a === 'grid') { setGrid(v, true); refreshPP(); }
    if (a === 'magnet') { prefs.magnet = v; savePrefs(); }
    if (a === 'dock') { switchDock(v); refreshPP(); return; }
    if (a === 'dockEd') { closePP(); openDockEd(); return; }
    if (a === 'resetDock') {
      const b = pp.querySelector('[data-a=resetDock]');
      if (docks.user.length && !b.classList.contains('arm')) { const sm = b.querySelector('small'), t0 = sm.textContent; b.classList.add('arm'); sm.textContent = `Click again: ${docks.user.length} own layout${docks.user.length > 1 ? 's go' : ' goes'}`; setTimeout(() => { if (b.isConnected) { b.classList.remove('arm'); sm.textContent = t0; } }, 2600); return; }
      const from = dockEl.getBoundingClientRect();
      docks = { cur: 'general', user: [] }; saveDocks(); stamp = null; delete ORD.dock; saveOrd();
      dockSide = 'bottom'; lsSet(LS.dock, 'bottom');
      renderDock(true); applyDockSide(from); setTool('select'); refreshPP(); toast('Toolbar back to the default'); return;
    }
    if (a === 'resetCols') {
      delete prefs.qFill; delete prefs.qText; cpRecent = []; lsSet(LS.recent, cpRecent);
      for (const k in prefs.defs || {}) { const d = prefs.defs[k]; delete d.fill; delete d.stroke; if (d.ts) delete d.ts.color; }
      savePrefs(); drawSub(true); barSig = ''; updateBar(); closePP(); toast('Colours back to the defaults'); return;
    }
    if (a === 'resetAll') {
      const b = pp.querySelector('[data-a=resetAll]');
      if (!b.classList.contains('arm')) { const sm = b.querySelector('small'), t0 = sm.textContent; b.classList.add('arm'); sm.textContent = 'Click again to reset everything'; setTimeout(() => { if (b.isConnected) { b.classList.remove('arm'); sm.textContent = t0; } }, 2600); return; }
      ['qFill', 'qText', 'pw', 'tone', 'laserMode'].forEach(k => delete prefs[k]);
      prefs.defs = {}; prefs.edge = { dash: 'solid', head: 'vee' }; savePrefs();
      [LS.order, LS.recent, LS.cp, LS.dock, LS.mm, LS.docks].forEach(k => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
      save(); location.reload(); return;
    }
    if (a === 'clear') { mutate(() => { doc.nodes = []; doc.edges = []; sel.clear(); }); closePP(); toast('Page cleared — ' + MOD + 'Z to undo'); }
  };
  openPP('_set', e.currentTarget, () => `<div class="setp">
    <label class="st-row"><span class="st-t">Magnetic snapping<small>Snap to grid and shapes</small></span>${sw2('magnet', prefs.magnet)}</label>
    <div class="st-h">Toolbar</div>
    ${allDocks().map(d => `<button class="st-btn dkp ${d.id === docks.cur ? 'on' : ''}" data-a="dock" data-v="${d.id}"><span class="st-t">${esc(d.name)}</span>${d.id === docks.cur ? CHECK_IC : ''}</button>`).join('')}
    <button class="st-btn" data-a="dockEd"><span class="st-t">Customize…<small>Order, hide, own buttons</small></span></button>
    <div class="st-h">Restore defaults</div>
    <button class="st-btn" data-a="resetDock"><span class="st-t">Toolbar<small>Layouts, own buttons, menus, position</small></span></button>
    <button class="st-btn" data-a="resetCols"><span class="st-t">Colours<small>Quick colours, tool colours, recent</small></span></button>
    <button class="st-btn" data-a="resetAll"><span class="st-t">Everything<small>Also widths, sizes, dashes, order, toolbar layouts</small></span></button>
    <i class="st-sep"></i>
    <button class="st-btn warn" data-a="clear"><span class="st-t">Clear page<small>${MOD}Z brings it back</small></span></button>
  </div>`);
});

/* ================= files ================= */
function download(name, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
const fileName = n => (n || 'drawing').replace(/[\\/:*?"<>|]+/g, '-').trim() || 'drawing';
function saveFile(tabs = ws.tabs) { syncTab(); download(`${tabs.length === 1 ? fileName(tabs[0].name) : 'canvas'}.figura`, new Blob([JSON.stringify(wsData(tabs))], { type: 'application/json' })); }
async function openFile(f) {
  try {
    const txt = await f.text(), base = f.name.replace(/\.\w+$/, '');
    if (/\.tex$/i.test(f.name) || /%figura:|\\begin\{(figura|tikzpicture)\}/.test(txt)) { const d = parseTikz(txt); if (!d) throw 0; addTab(d, base); toast('Imported from LaTeX'); return; }
    const d = JSON.parse(txt);
    if (d && d.figuraToolbar) { const n = importDocks(d); toast(n ? 'Toolbar layout added' : 'No toolbar layout in this file'); return; }
    Object.assign(assets, d.assets || {});
    if (d.tabs?.length) {
      endEdit(); syncTab();
      const first = ws.tabs.length;
      for (const t of d.tabs) ws.tabs.push({ ...newTabObj(uniqueName(t.name), t.doc), cam: t.cam, locked: !!t.locked });
      ws.active = first; loadTab(true); scheduleSave();
      toast(`Imported ${d.tabs.length} page${d.tabs.length > 1 ? 's' : ''}`); return;
    }
    if (d.doc) { addTab(d.doc, base); return; }
    throw 0;
  } catch { toast('Could not read this file'); }
}
$('#fileDoc').addEventListener('change', e => { [...e.target.files].forEach(openFile); e.target.value = ''; });
$('#btnOpen').addEventListener('click', e => {
  const r = e.currentTarget.getBoundingClientRect();
  showMenu(r.left - 120, r.bottom + 6, [
    { t: 'New page', ic: IC.plus, f: () => addTab() },
    { t: 'Import… (.figura, .tex, .figtool)', k: MOD + 'O', ic: small(IC.open), f: () => $('#fileDoc').click() },
    '-',
    { t: 'Export all pages', k: MOD + 'S', ic: small(IC.exp), f: () => saveFile() },
    { t: 'Export this page', ic: small(IC.exp), f: () => saveFile([curTab()]) },
  ]);
});

/* ================= image & SVG export ================= */
let mjP = null;
function loadMathJax() {
  if (window.MathJax?.tex2svg) return Promise.resolve();
  if (mjP) return mjP;
  window.MathJax = { svg: { fontCache: 'none' }, startup: { typeset: false } };
  mjP = new Promise((ok, no) => { const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js'; sc.onload = () => (window.MathJax.startup?.promise || Promise.resolve()).then(ok); sc.onerror = no; document.head.appendChild(sc); });
  return mjP;
}
const ELT = { ...TS, size: 15 };
function labelSVG(text, ts, cx, cy) {
  if (!text) return '';
  const fam = 'KaTeX_Main, "Latin Modern Roman", "Times New Roman", serif', col = ts.color;
  if (hasMath(text) && window.MathJax?.tex2svg) {
    const lines = [''];
    for (const p of mathParts(text)) {
      if (p.m != null) { const t = innerEnv(p.m).replace(/\n/g, ' '); if (p.disp) { if (lines[lines.length - 1].trim()) lines.push(''); lines[lines.length - 1] += `\\displaystyle{${t}}`; lines.push(''); } else lines[lines.length - 1] += t; continue; }
      p.t.split('\n').forEach((q, i) => { if (i) lines.push(''); if (q) lines[lines.length - 1] += `\\text{${q.replace(/[\\{}]/g, '\\$&')}}`; });
    }
    while (lines.length > 1 && !lines[lines.length - 1]) lines.pop();
    while (lines.length > 1 && !lines[0]) lines.shift();
    let tex = lines.length > 1 ? `\\begin{array}{c}${lines.join('\\\\')}\\end{array}` : lines[0];
    if (ts.bold) tex = `\\boldsymbol{${tex}}`;
    try {
      const el = MathJax.tex2svg(tex, { display: false }).querySelector('svg');
      const ex = ts.size * .442, w = parseFloat(el.getAttribute('width')) * ex, h = parseFloat(el.getAttribute('height')) * ex;
      el.setAttribute('width', f2(w)); el.setAttribute('height', f2(h)); el.setAttribute('x', f2(cx - w / 2)); el.setAttribute('y', f2(cy - h / 2));
      el.removeAttribute('style'); el.setAttribute('color', col);
      return ts.vert ? `<g transform="rotate(90 ${f2(cx)} ${f2(cy)})">${el.outerHTML}</g>` : el.outerHTML;
    } catch { /* plain text below */ }
  }
  const lines = text.replace(/\$/g, '').split('\n'), lh = ts.size * 1.25; /* no math renderer: plain text */
  const attrs = `font-family='${fam}' font-size="${ts.size}" fill="${col}" font-weight="${ts.bold ? 650 : 400}" font-style="${ts.italic ? 'italic' : 'normal'}" ${ts.under ? 'text-decoration="underline"' : ''} text-anchor="middle" dominant-baseline="central"`;
  const body = `<text ${attrs}>${lines.map((l, i) => `<tspan x="${f2(cx)}" y="${f2(cy + (i - (lines.length - 1) / 2) * lh)}">${esc(l) || ' '}</tspan>`).join('')}</text>`;
  return ts.vert ? `<g transform="rotate(90 ${f2(cx)} ${f2(cy)})">${body}</g>` : body;
}
function exportSet(onlySel) {
  const ns = onlySel ? selNodes() : doc.nodes, ids = new Set(ns.map(n => n.id));
  const es = doc.edges.filter(e => !onlySel || sel.has(e.id) || ((!e.a || ids.has(e.a)) && (!e.b || ids.has(e.b)) && (e.a || e.b)));
  return { ns, es };
}
const elabSize = e => elabEls.get(e.id)?._m || { w: 20, h: 16 };
async function buildSVG(onlySel) {
  const { ns, es } = exportSet(onlySel);
  if ([...ns.map(n => n.text), ...ns.flatMap(n => Object.values(n.ol || {})), ...es.map(e => e.label)].some(hasMath)) { try { await loadMathJax(); } catch { toast('Math renderer unavailable offline — exporting as plain text'); } }
  const ps = ns.flatMap(n => corners(n));
  let body = '';
  for (const e of es) {
    noAnim = true; const g = edgeGeom(e); noAnim = false; body += edgeMarkup(e, g, false); ps.push(g.P, g.Q, g.mid);
    if (e.label) {
      const m = elabSize(e), p = labelPos(e, g, m.w, m.h);
      if (lpSide(e, g) === 0) body += `<rect x="${f2(p.x - m.w / 2)}" y="${f2(p.y - m.h / 2)}" width="${f2(m.w)}" height="${f2(m.h)}" rx="4" fill="#ffffff"/>`;
      body += labelSVG(e.label, { ...ELT, color: e.lcol || '#1d1d1f' }, p.x, p.y); ps.push({ x: p.x - m.w / 2, y: p.y - m.h / 2 }, { x: p.x + m.w / 2, y: p.y + m.h / 2 });
    }
  }
  ns.forEach((n, i) => {
    const { w, h } = size(n), o = labOff(n, w, h);
    if (n.ol) for (const sd of OL_SIDES) if (n.ol[sd]) {
      const m = olEls.get(n.id + ':' + sd)?._m || { w: 20, h: 16 }, q = olPos(n, sd, m);
      body += labelSVG(n.ol[sd], { ...ELT, color: n.ts?.color || '#1d1d1f' }, q.x, q.y); ps.push({ x: q.x - m.w / 2, y: q.y - m.h / 2 }, { x: q.x + m.w / 2, y: q.y + m.h / 2 });
    }
    body += `<g transform="translate(${f2(n.x)} ${f2(n.y)}) rotate(${n.rot || 0}) translate(${f2(-w / 2)} ${f2(-h / 2)})">${shapeMarkup(n, w, h, 'x' + i, aid => assets[aid])}${n.k !== 'image' ? labelSVG(n.text, n.ts, w / 2 + o.x, h / 2 + o.y) : ''}</g>`;
  });
  if (!ps.length) return null;
  const b = bboxOf(ps), pad = 14, x = b.l - pad, y = b.t - pad, w = b.w + pad * 2, h = b.h + pad * 2;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${f2(w)}" height="${f2(h)}" viewBox="${f2(x)} ${f2(y)} ${f2(w)} ${f2(h)}">${body}</svg>`, w, h, x, y };
}
async function toPNG(r, scale, bg) {
  const img = await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(r.svg));
  const c = document.createElement('canvas'); c.width = Math.ceil(r.w * scale); c.height = Math.ceil(r.h * scale);
  const g = c.getContext('2d'); if (bg) { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); }
  g.drawImage(img, 0, 0, c.width, c.height);
  return new Promise(ok => c.toBlob(ok, 'image/png'));
}

/* ================= LaTeX (figura.sty): plain TikZ you could write by hand, and back ================= */
/* named colours: the palette, the default quick colours, then your own quick colours (fgMy…) */
const HUE_N = ['Red', 'Orange', 'Amber', 'Lime', 'Green', 'Teal', 'Cyan', 'Blue', 'Violet', 'Pink'];
const FIXED_COLS = [
  ['white', '#ffffff'], ['black', '#000000'], ['fgInk', '#1d1d1f'],
  ['fgRose', '#fde2e1'], ['fgPeach', '#feead6'], ['fgSand', '#fdf1c7'], ['fgMint', '#dcf3e5'], ['fgSky', '#dbeafe'], ['fgLilac', '#e6e1fb'], ['fgStone', '#f1efec'],
  ['fgGrey', '#6e7581'], ['fgRed', '#c4524e'], ['fgOrange', '#d0793a'], ['fgGreen', '#3f8c6a'], ['fgBlue', '#3a6db3'], ['fgViolet', '#6f5fc4'], ['fgPink', '#b05482'], ['fgMuted', '#8e8e93'], ['fgAmber', '#c98a2b'],
  ...['Snow', 'Mist', 'Silver', 'Ash', 'Steel', 'Slate', 'Graphite'].map((n, i) => ['fg' + n, PAL.Mono[i + 1]]),
  ...['Pastel', 'Soft', 'Vivid', 'Deep'].flatMap(t => HUE_N.map((h, i) => ['fg' + t + h, PAL[t][i]])),
];
function hueWord(hex) {
  const [r, g, b] = hex2rgb(hex).map(v => v / 255), M = Math.max(r, g, b), m = Math.min(r, g, b), l = (M + m) / 2, d = M - m;
  if (d < .08) return l > .85 ? 'Light' : l < .25 ? 'Dark' : 'Grey';
  let h = M === r ? ((g - b) / d) % 6 : M === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360;
  const i = HUES.reduce((bi, x, j) => Math.min(Math.abs(h - x), 360 - Math.abs(h - x)) < Math.min(Math.abs(h - HUES[bi]), 360 - Math.abs(h - HUES[bi])) ? j : bi, 0);
  return HUE_N[i];
}
/* hex → name and name → hex, including your quick colours as fgMy<Hue><n> */
function colourNames() {
  const byHex = {}, byName = {};
  for (const [n, h] of FIXED_COLS) { if (!byHex[lc(h)]) byHex[lc(h)] = n; byName[n] = lc(h); }
  const mine = [...new Set(['qFill', 'qText', 'qLine'].flatMap(k => quickOf(k)).map(lc))].filter(h => /^#[0-9a-f]{6}$/.test(h) && !byHex[h]).sort();
  const used = {};
  for (const h of mine) { const w = hueWord(h); used[w] = (used[w] || 0) + 1; const n = 'fgMy' + w + (used[w] > 1 ? used[w] : ''); byHex[h] = n; byName[n] = h; }
  return { byHex, byName, mine };
}
function styText() {
  const { byHex, byName, mine } = colourNames(), def = n => `\\definecolor{${n}}{HTML}{${byName[n].slice(1).toUpperCase()}}`;
  const fixed = FIXED_COLS.filter(([n]) => n !== 'white' && n !== 'black').map(([n]) => n);
  const rows = (ns, k) => { const out = []; for (let i = 0; i < ns.length; i += k) out.push(ns.slice(i, i + k).map(def).join(' ')); return out.join('\n'); };
  return String.raw`%% figura.sty -- Figura diagrams as plain TikZ: export them, or write them yourself.
%%
%%   \usepackage{figura}
%%   \begin{figura}                      % 1 unit = 1 canvas pixel (\fgu, default 2/3 pt); y points down
%%     \node[fg box, fill=fgRose] (a) at (0,0)   {Hello};
%%     \node[fg circle]           (b) at (160,0) {$q_0$};
%%     \draw[fg line, ->] (a) -- node[fg label] {$f$} (b);
%%     \draw[fg line, ->] (b) to[loop at=90] (b);
%%   \end{figura}
%%
%% Shapes   fg dot (or fg dot=5: diameter), fg box, fg circle (an ellipse), fg diamond, fg triangle (+ points down/left/right), fg text, fg image
%% Size     w=80, h=40 (canvas px), r=6 (corner radius); text size=18, bold, italic; \fgvert{...} for vertical text
%% Border   draw=fgBlue, lw=2.5, dashed, dotted, dashes={on}{off}, dots={gap}, double border, draw=none
%% Colours  fill=fgSky, text=fgRed, or any hex: fill hex=A04070, draw hex=..., text hex=...
%% Lines    fg line + ->, <->, -{Triangle}, -{Triangle[open]}, ->>, -{Circle}, -{Circle[open]}, -|, -{Hooks[right]}
%%          bend left=20 / bend right=20, loop at=90 (degrees, 90 = up), wave, zigzag, double line
%% Labels   node[fg label] (left of the direction), node[fg label, swap] (right), node[fg label on] (on the line), pos=0.3 (along)
%%          outside a shape: \node[fg box, label={[fg olabel]above:{text}}]  (above / below / left / right)
%% Options  \begin{figura}[scale=1.2]  \begin{figura}[unit=0.5pt]  \begin{figura}[baseline=north]
\NeedsTeXFormat{LaTeX2e}
\ProvidesPackage{figura}[2026/11/12 v2.0 Figura diagrams]
\RequirePackage{tikz}
\RequirePackage{graphicx}
\RequirePackage{amsmath}
\usetikzlibrary{arrows.meta,shapes.geometric,decorations.pathmorphing}
\newdimen\fgu \fgu=0.66667pt
\def\fg@baseline{center}
\pgfkeys{/figura/.is family,
  /figura/unit/.code={\fgu=#1\relax},
  /figura/scale/.code={\fgu=#1\fgu\relax},
  /figura/baseline/.code={\def\fg@baseline{#1}}}
\newcommand\figuraset[1]{\pgfkeys{/figura,#1}}
%% ---- colours (Figura's palette and quick colours)
${rows(fixed, 4)}
${mine.length ? '%% ---- your own quick colours\n' + rows(mine.map(h => byHex[h]), 4) + '\n' : ''}%% ---- text: size in canvas px, line height 1.25
\def\fg@size{15}\def\fg@series{}\def\fg@shape{}
\newcommand\fgfont[2]{\edef\fg@fs{\the\dimexpr#1\fgu\relax}\edef\fg@fl{\the\dimexpr#2\fgu\relax}\fontsize{\fg@fs}{\fg@fl}\selectfont}
\def\fg@font{\edef\fg@fs{\the\dimexpr\fg@size\fgu\relax}\edef\fg@fl{\the\dimexpr5\dimexpr\fg@size\fgu\relax/4\relax}\fontsize{\fg@fs}{\fg@fl}\selectfont\fg@series\fg@shape}
\newcommand\fgvert[1]{\rotatebox{-90}{\begin{tabular}{@{}c@{}}#1\end{tabular}}}
\tikzset{
  size/.code={\def\fg@size{#1}}, bold/.code={\def\fg@series{\bfseries}}, italic/.code={\def\fg@shape{\itshape}},
  lw/.style={line width=#1\fgu}, w/.style={minimum width=#1\fgu}, h/.style={minimum height=#1\fgu}, r/.style={rounded corners=#1\fgu},
  fill hex/.code={\definecolor{fg@#1}{HTML}{#1}\pgfkeysalso{fill=fg@#1}},
  draw hex/.code={\definecolor{fg@#1}{HTML}{#1}\pgfkeysalso{draw=fg@#1}},
  text hex/.code={\definecolor{fg@#1}{HTML}{#1}\pgfkeysalso{text=fg@#1}},
  dashes/.style 2 args={dash pattern=on #1\fgu+#1\pgflinewidth off #2\fgu+#2\pgflinewidth},
  dots/.style={dash pattern=on 0pt off #1\fgu+#1\pgflinewidth+\pgflinewidth, line cap=round},
  double border/.style={double=white, double distance=2.5\fgu},
  fg node/.style={draw=fgInk, line width=1.5\fgu, inner sep=3\fgu, outer sep=0pt, align=center, text=fgInk, font=\fg@font},
  fg box/.style={fg node, rectangle, minimum width=80\fgu, minimum height=40\fgu, rounded corners=6\fgu},
  fg circle/.style={fg node, ellipse, minimum width=40\fgu, minimum height=40\fgu, inner sep=1\fgu},
  fg dot/.style={circle, fill=fgInk, draw=none, inner sep=0pt, outer sep=.5\fgu, minimum size=#1\fgu}, fg dot/.default=8,
  fg ray/.style={}, fg fade/.style={line cap=butt},   % a ray: the line runs on and fades (Figura writes the fading pieces)
  fg diamond/.style={fg node, diamond, minimum width=56\fgu, minimum height=56\fgu, inner sep=1\fgu, rounded corners=4\fgu},
  fg triangle/.style={fg node, isosceles triangle, isosceles triangle stretches, shape border rotate=90, minimum width=48\fgu, minimum height=42\fgu, inner sep=1\fgu},
  points up/.style={shape border rotate=90}, points down/.style={shape border rotate=270},
  points left/.style={shape border rotate=180}, points right/.style={shape border rotate=0},
  fg text/.style={inner sep=1\fgu, outer sep=0pt, align=center, text=fgInk, font=\fg@font},
  fg image/.style={inner sep=0pt, outer sep=0pt},
  picture/.style n args={3}{path picture={\node[inner sep=0pt] at (path picture bounding box.center) {\includegraphics[width=#2\fgu,height=#3\fgu]{#1}};}},
  fg line/.style={draw=fgInk, line width=1.4\fgu},
  double line/.style={double=white, double distance=2.4\fgu},
  wave/.style={decorate, decoration={snake, amplitude=2.2\fgu, segment length=9\fgu, pre length=3\fgu, post length=8\fgu}},
  zigzag/.style={decorate, decoration={zigzag, amplitude=2.4\fgu, segment length=8\fgu, pre length=3\fgu, post length=8\fgu}},
  loop at/.code={\pgfmathsetmacro\fg@o{#1+30}\pgfmathsetmacro\fg@i{#1-30}\pgfkeysalso{loop,out=\fg@o,in=\fg@i,min distance=16\fgu,looseness=6}},
  fg label/.style={auto, inner sep=2.5\fgu, text=fgInk, font=\fg@font},
  fg label on/.style={inner sep=2\fgu, fill=white, rounded corners=3\fgu, text=fgInk, font=\fg@font},
  fg olabel/.style={inner sep=2\fgu, label distance=1.5\fgu, text=fgInk, font=\fg@font},
}
\newenvironment{figura}[1][]{%
  \begingroup\pgfkeys{/figura,#1}%
  \begin{tikzpicture}[x=\fgu,y=-\fgu,line cap=butt,line join=miter,looseness=.85,
    >={Straight Barb[length=\the\dimexpr6\fgu\relax,width=\the\dimexpr11\fgu\relax]},
    dashed/.style={dash pattern=on 4\fgu+2\pgflinewidth off 3\fgu+1.4\pgflinewidth},
    dotted/.style={dash pattern=on 0pt off 2.4\fgu+1.6\pgflinewidth, line cap=round},
    baseline=(current bounding box.\fg@baseline)]}%
  {\end{tikzpicture}\endgroup}
\endinput
`;
}
const tn = v => String(Math.round(v * 10) / 10);
/* π α ⊕ … typed straight into a label: pdflatex stops on them ("Unicode character not set up"), so the export
   writes macros (as ZX Draw does): inside $…$ as \pi, in text as $\pi$ */
const UNI = { 'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta', 'ε': 'epsilon', 'ζ': 'zeta', 'η': 'eta', 'θ': 'theta', 'ι': 'iota', 'κ': 'kappa', 'λ': 'lambda', 'μ': 'mu', 'ν': 'nu', 'ξ': 'xi', 'π': 'pi', 'ρ': 'rho', 'σ': 'sigma', 'τ': 'tau', 'υ': 'upsilon', 'φ': 'phi', 'χ': 'chi', 'ψ': 'psi', 'ω': 'omega',
  'Γ': 'Gamma', 'Δ': 'Delta', 'Θ': 'Theta', 'Λ': 'Lambda', 'Ξ': 'Xi', 'Π': 'Pi', 'Σ': 'Sigma', 'Φ': 'Phi', 'Ψ': 'Psi', 'Ω': 'Omega',
  '⊕': 'oplus', '⊗': 'otimes', '∝': 'propto', '·': 'cdot', '×': 'times', '→': 'to', '←': 'leftarrow', '↔': 'leftrightarrow', '⇒': 'Rightarrow', '≤': 'leq', '≥': 'geq', '≠': 'neq', '≈': 'approx', '∞': 'infty', '∈': 'in', '∀': 'forall', '∃': 'exists', '¬': 'neg', '∧': 'wedge', '∨': 'vee', '⋮': 'vdots', '⋯': 'cdots', '…': 'ldots', '√': 'surd' };
const UNI_RE = new RegExp('[' + Object.keys(UNI).join('') + ']', 'g');
const uniMath = m => m.replace(UNI_RE, (c, i) => '\\' + UNI[c] + (/[A-Za-z]/.test(m[i + 1] || '') ? ' ' : '')).replace(/−/g, '-');
const uniText = t => t.replace(UNI_RE, c => `$\\${UNI[c]}$`).replace(/−/g, '-');
const texEsc = t => t.replace(/[\\{}#%&_^~$]/g, c => ({ '\\': '\\textbackslash{}', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}' }[c] || '\\' + c));
/* label text → TeX: text escaped, $…$ kept, display maths as $\displaystyle …$, lines joined with \\ */
function texText(t, ts) {
  const lines = [''];
  for (const p of mathParts(t || '')) {
    if (p.m != null) { const m = innerEnv(p.m).replace(/\s*\n\s*/g, ' '); lines[lines.length - 1] += p.disp ? `$\\displaystyle ${uniMath(m)}$` : `$${uniMath(m)}$`; continue; }
    p.t.split('\n').forEach((q, i) => { if (i) lines.push(''); lines[lines.length - 1] += uniText(texEsc(q)); });
  }
  let s = lines.map(l => (ts && ts.under && l ? `\\underline{${l}}` : l)).join(' \\\\ ');
  if (ts && ts.vert && s) s = `\\fgvert{${s}}`;
  return s;
}
const HEAD_TIP = { vee: '>', tri: '{Triangle}', otri: '{Triangle[open]}', two: '>>', circ: '{Circle}', ocirc: '{Circle[open]}', bar: '|', hook: '{Hooks[right]}' };
const TAIL_TIP = { ...HEAD_TIP, vee: '<', two: '<<' };
const arrowSpec = (tail, head) => { const a = TAIL_TIP[tail] || '', b = HEAD_TIP[head] || ''; return a || b ? `${a}-${b}` : ''; };
const dashOpt = sd => sd === 'dash' ? 'dashed' : sd === 'dot' ? 'dotted' : /^d:/.test(sd || '') ? (p => p[0] ? `dashes={${p[0]}}{${p[1]}}` : `dots=${p[1]}`)(dashPat(sd)) : '';
/* ---------- plain TikZ: the same picture with every style written out (no figura.sty) ---------- */
const PU = .66667;   // pt per canvas px, as \fgu in figura.sty
const pd = v => String(Math.round(v * PU * 100) / 100) + 'pt';
let pCol = null;   // hex → name while a plain TikZ export runs
const rgbOf = hex => { if (pCol) return pColName(hex); const h = (hex || '#000').replace('#', ''), v = h.length === 3 ? h.split('').map(c => c + c).join('') : h.slice(0, 6); return `{rgb,255:red,${parseInt(v.slice(0, 2), 16)};green,${parseInt(v.slice(2, 4), 16)};blue,${parseInt(v.slice(4, 6), 16)}}`; };
const pFont = ts => `font=\\fontsize{${pd(ts.size)}}{${pd(ts.size * 1.25)}}\\selectfont${ts.bold ? '\\bfseries' : ''}${ts.italic ? '\\itshape' : ''}`;
const pDash = (sd, sw) => sd === 'dash' ? 'dashed' : sd === 'dot' ? 'dotted' : /^d:/.test(sd || '') ? (q => q[0] ? `dash pattern=on ${pd(q[0] * (1 + sw))} off ${pd(q[1] * (1 + sw))}` : `dash pattern=on 0pt off ${pd(q[1] * (1 + sw) + sw)}, line cap=round`)(dashPat(sd)) : '';
function pColName(hex) {
  const h = lc(hex || '#000000'), x = h.length === 4 ? '#' + h.slice(1).split('').map(c => c + c).join('') : h.slice(0, 7);
  if (x === '#ffffff') return 'white'; if (x === '#000000') return 'black';
  if (pCol.has(x)) return pCol.get(x);
  const used = new Set(pCol.values()), base = colourNames().byHex[x] || 'fg' + hueWord(x);
  let nm = base, i = 2; while (used.has(nm)) nm = base + i++;
  pCol.set(x, nm); return nm;
}
/* options shared by every use of a pool become one short style; the rest stay on the line */
const P_STY = { rect: 'box', circle: 'oval', diamond: 'rhomb', tri: 'tri', dot: 'dot', text: 'txt', image: 'img', line: 'link', lab: 'lab', onlab: 'onlab', olab: 'olab', fade: 'fade' };
function plainStyles(text, uses) {
  const out = uses.map(u => u.o.filter(Boolean)), defs = [], keep = x => !/^label=/.test(x);
  const common = ids => out[ids[0]].filter(x => keep(x) && ids.every(i => out[i].includes(x)));
  const byPool = {}; uses.forEach((u, i) => (byPool[u.pool] ||= []).push(i));
  /* bordered shapes first share one style (fig), then each kind used twice or more gets its own on top */
  const SH = ['rect', 'circle', 'diamond', 'tri'], shIds = SH.flatMap(k => byPool[k] || []);
  const strip = (ids, cm) => { for (const i of ids) out[i] = out[i].filter(x => !cm.includes(x)); };
  let fig = null;
  if (shIds.length > 1) { const cm = common(shIds); if (cm.length) { fig = 'fig'; defs.push(`fig/.style={${cm.join(', ')}}`); strip(shIds, cm); } }
  for (const [pool, ids] of Object.entries(byPool)) {
    const sh = SH.includes(pool), nm = P_STY[pool] || pool;
    const cm = ids.length > 1 ? common(ids) : [];
    if (cm.length) { defs.push(`${nm}/.style={${[...(sh && fig ? [fig] : []), ...cm].join(', ')}}`); strip(ids, cm); ids.forEach(i => out[i].unshift(nm)); }
    else if (sh && fig) ids.forEach(i => out[i].unshift(fig));
  }
  let t = text, guard = 0;
  while (/\u0001\d+\u0001/.test(t) && guard++ < 4) t = t.replace(/\u0001(\d+)\u0001/g, (_, i) => out[+i].join(', '));
  return { defs, text: t };
}
function plainNode(n, w, h) {
  const ts = n.ts || TS, o = [];
  if (n.k === 'dot') return ['circle', 'inner sep=0pt', 'outer sep=0pt', `minimum size=${pd(n.w)}`, n.fill === 'none' ? 'draw' : `fill=${rgbOf(n.fill)}`];
  if (n.k === 'image') return ['inner sep=0pt', 'outer sep=0pt'];
  if (n.k === 'text') return ['inner sep=' + pd(1), 'outer sep=0pt', 'align=center', ...(lc(ts.color) !== '#1d1d1f' ? [`text=${rgbOf(ts.color)}`] : []), pFont(ts)];
  o.push({ rect: 'rectangle', circle: n.w === n.h ? 'circle' : 'ellipse', diamond: 'diamond', tri: 'isosceles triangle, isosceles triangle stretches' }[n.k]);
  if (n.k === 'tri') o.push('shape border rotate=' + ({ up: 90, down: 270, left: 180, right: 0 }[n.dir || 'up']));
  o.push(`minimum width=${pd(n.w)}`, `minimum height=${pd(n.h)}`, `inner sep=${pd(n.k === 'rect' ? 3 : 1)}`, 'outer sep=0pt', 'align=center');
  if ((n.k === 'rect' || n.k === 'diamond') && n.rad) o.push(`rounded corners=${pd(n.rad)}`);
  if (n.stroke !== 'none') { o.push(`draw=${rgbOf(n.stroke)}`, `line width=${pd(n.sw)}`); const da = pDash(n.sd, n.sw); if (da) o.push(da); if (n.dbl) o.push('double=white', `double distance=${pd(2.5)}`); }
  if (n.fill && n.fill !== 'none') o.push(`fill=${rgbOf(n.fill)}`);
  if (lc(ts.color) !== '#1d1d1f') o.push(`text=${rgbOf(ts.color)}`);
  o.push(pFont(ts));
  return o;
}
const P_TIP = { vee: '{Straight Barb}', tri: '{Triangle}', otri: '{Triangle[open]}', two: '{Straight Barb[]Straight Barb}', circ: '{Circle}', ocirc: '{Circle[open]}', bar: '{Bar}', hook: '{Hooks[right]}' };
function plainEdge(e) {
  const o = [`draw=${rgbOf(e.color)}`, `line width=${pd(e.sw || 1.4)}`], a = P_TIP[e.tail] || '', b = P_TIP[e.head] || '';
  if (a || b) o.push(`${a}-${b}`);
  const da = pDash(e.dash, e.sw); if (da) o.push(da);
  if (e.shape === 'double') o.push('double=white', `double distance=${pd(2.4)}`);
  if (e.shape === 'wave') o.push('decorate', `decoration={snake, amplitude=${pd(2.2)}, segment length=${pd(9)}, pre length=${pd(3)}, post length=${pd(8)}}`);
  if (e.shape === 'zig') o.push('decorate', `decoration={zigzag, amplitude=${pd(2.4)}, segment length=${pd(8)}, pre length=${pd(3)}, post length=${pd(8)}}`);
  if (e.route === 'elbowr' && e.shape !== 'wave' && e.shape !== 'zig') o.push(`rounded corners=${pd(10)}`);
  return o;
}
function latexFor(onlySel, plain) {
  const { ns, es } = exportSet(onlySel), imgs = [], { byHex } = colourNames();
  const uses = [], S = (pool, o) => { uses.push({ pool, o }); return `\u0001${uses.length - 1}\u0001`; };
  pCol = plain ? new Map() : null;
  try {
  const col = (key, hex, def) => {
    if (!hex || lc(hex) === lc(def || '')) return '';
    if (hex === 'none') return key === 'fill' ? '' : `${key}=none`;
    const n = byHex[lc(hex)]; return n ? `${key}=${n}` : `${key} hex=${hex.replace('#', '').toUpperCase()}`;
  };
  /* top-left of the drawing at (0,0), on whole tens so a grid stays a grid */
  const sz = new Map(ns.map(n => [n.id, size(n)]));
  const xs = ns.map(n => n.x - sz.get(n.id).w / 2), ys = ns.map(n => n.y - sz.get(n.id).h / 2);
  for (const e of es) for (const k of ['pa', 'pb']) if (e[k]) { xs.push(e[k].x); ys.push(e[k].y); }
  const ox = xs.length ? Math.floor(Math.min(...xs) / 10) * 10 : 0, oy = ys.length ? Math.floor(Math.min(...ys) / 10) * 10 : 0;
  const P = (x, y) => `(${tn(x - ox)},${tn(y - oy)})`;
  const letters = i => { let s = ''; i++; while (i > 0) { const r = (i - 1) % 26; s = String.fromCharCode(97 + r) + s; i = Math.floor((i - 1) / 26); } return s; };
  const name = new Map(ns.map((n, i) => [n.id, letters(i)]));
  const KN = { dot: 'fg dot', rect: 'fg box', circle: 'fg circle', diamond: 'fg diamond', tri: 'fg triangle', text: 'fg text', image: 'fg image' };
  const L = [], post = [], pad = Math.max(1, ...ns.map(n => name.get(n.id).length));
  for (const n of ns) {
    const o = [KN[n.k]], D = KDEF[n.k] || {}, ts = n.ts || TS;
    let body = n.k === 'image' ? '' : texText(n.text, ts);
    if (n.k === 'tri' && n.dir && n.dir !== 'up') o.push('points ' + n.dir);
    if (n.k === 'dot') { if (n.w !== D.w) o[0] = 'fg dot=' + tn(n.w); o.push(col('fill', n.fill, D.fill)); }
    else if (n.k !== 'text' && n.k !== 'image') {
      if (n.w !== D.w) o.push('w=' + tn(n.w)); if (n.h !== D.h) o.push('h=' + tn(n.h));
      if ((n.k === 'rect' || n.k === 'diamond') && (n.rad || 0) !== (D.rad || 0)) o.push('r=' + tn(n.rad || 0));
      o.push(col('fill', n.fill, 'none'), col('draw', n.stroke, '#1d1d1f'));
      if (n.stroke !== 'none') { if (n.sw !== 1.5) o.push('lw=' + tn(n.sw)); o.push(dashOpt(n.sd)); if (n.dbl) o.push('double border'); }
      if (n.img) { const s2 = sz.get(n.id), f = `figura-pic-${imgs.length + 1}.png`; imgs.push({ n, w: s2.w, h: s2.h, f }); o.push(`picture={${f}}{${tn(s2.w)}}{${tn(s2.h)}}`); }
    }
    if (n.k === 'image') { const s2 = sz.get(n.id), f = `figura-pic-${imgs.length + 1}.png`; imgs.push({ n, w: s2.w, h: s2.h, f }); body = `\\includegraphics[width=${tn(s2.w)}\\fgu,height=${tn(s2.h)}\\fgu]{${f}}`; }
    if (n.rot) o.push('rotate=' + tn(-n.rot));
    if (n.k !== 'image' && n.k !== 'dot') {
      if (ts.size !== 15) o.push('size=' + tn(ts.size)); if (ts.bold) o.push('bold'); if (ts.italic) o.push('italic');
      o.push(col('text', ts.color, '#1d1d1f'));
    }
    const nm = `(${name.get(n.id)})`.padEnd(pad + 2);
    const olabs = n.ol ? OL_SIDES.filter(sd => n.ol[sd]).map(sd => [sd, n.ol[sd]]) : [];
    const OLP = { t: 'above', b: 'below', l: 'left', r: 'right' };
    if (plain) {
      o.length = 0; o.push(...plainNode(n)); if (n.rot) o.push('rotate=' + tn(-n.rot));
      body = body.replace(/\\fgvert\{([\s\S]*)\}$/, '\\rotatebox{90}{$1}').replace(/\\fgu/g, 'pt');
      if (n.k === 'image') { const s2 = sz.get(n.id); body = `\\includegraphics[width=${pd(s2.w)},height=${pd(s2.h)}]{${imgs[imgs.length - 1].f}}`; }
      else if (n.img) { const s2 = sz.get(n.id), im = imgs.find(x => x.n === n); o.push(`path picture={\\node[inner sep=0pt] at (path picture bounding box.center) {\\includegraphics[width=${pd(s2.w)},height=${pd(s2.h)}]{${im.f}}};}`); }
    }
    for (const [sd, t] of olabs) {
      const lo = plain ? [`inner sep=${pd(2)}`, `label distance=${pd(1.5)}`, ts.color && lc(ts.color) !== '#1d1d1f' ? `text=${rgbOf(ts.color)}` : '', pFont(ELT)] : ['fg olabel', col('text', ts.color, '#1d1d1f')];
      const oa = n.oa?.[sd], where = oa == null ? OLP[sd] : String(Math.round(-oa));
      o.push(`label={[${plain ? S('olab', lo) : lo.filter(Boolean).join(', ')}]${where}:{${texText(t, ELT)}}}`);
    }
    L.push(`\\node[${plain ? S(n.k, o) : o.filter(Boolean).join(', ')}] ${nm} at ${P(n.x, n.y)} {${body}};`);
  }
  if (ns.length && es.length) L.push('');
  for (const e of es) {
    const A = e.a && name.get(e.a), B = e.b && name.get(e.b);
    if ((e.a && !A) || (e.b && !B)) continue;
    const g = egeo.get(e.id) || edgeGeom(e);
    /* a line on a port meets its shape at that port: an angle anchor of the node */
    const anc = (nm, id, q) => { const n = idx.get(id), l = q && n ? toLocal(n, q) : null; return l && Math.hypot(l.x, l.y) > .5 ? `(${nm}.${Math.round((Math.atan2(-l.y, l.x) * R2D + 360) % 360) % 360})` : `(${nm})`; };
    const ra = A ? (g.ta ? anc(A, e.a, g.ta.at) : `(${A})`) : P(e.pa.x, e.pa.y), rb = B ? (g.tb ? anc(B, e.b, g.tb.at) : `(${B})`) : P(e.pb.x, e.pb.y);
    const o = ['fg line', arrowSpec(e.tail, e.head), col('draw', e.color, '#1d1d1f')];
    if ((e.sw || 1.4) !== 1.4) o.push('lw=' + tn(e.sw)); o.push(dashOpt(e.dash));
    o.push({ double: 'double line', wave: 'wave', zig: 'zigzag' }[e.shape] || '');
    let op = '--', side = 1;
    if (e.a && e.a === e.b) { op = `to[loop at=${tn(-(e.la ?? -90))}]`; }
    else if (g.c1) op = `.. controls ${P(g.c1.x, g.c1.y)} and ${P(g.c2.x, g.c2.y)} ..`;
    else if (g.pts && g.pts.length > 2) { op = '-- ' + g.pts.slice(1, -1).map(q => P(q.x, q.y)).join(' -- ') + ' --'; if (e.route === 'elbowr' && e.shape !== 'wave' && e.shape !== 'zig') o.push('r=10'); }
    else if (e.bend) {
      const pa = A ? idx.get(e.a) : e.pa, pb = B ? idx.get(e.b) : e.pb, Ld = Math.hypot(pb.x - pa.x, pb.y - pa.y) || 1;
      const th = Math.round(Math.atan(4 * Math.abs(e.bend) / Ld) * 180 / Math.PI);
      op = `to[bend ${e.bend > 0 ? 'left' : 'right'}=${th}]`; side = e.bend > 0 ? 1 : -1;
    }
    let lab = '';
    if (plain) {
      o.length = 0; o.push(...plainEdge(e));
      if (e.a && e.a === e.b) { const la = -(e.la ?? -90); op = `to[loop, out=${tn(la + 30)}, in=${tn(la - 30)}, min distance=${pd(16)}, looseness=6]`; }
    }
    if (e.label) {
      const lp = e.lp || 'auto', s = lp === 'r' ? -1 : lp === 'l' ? 1 : (g && g.loop) ? 1 : side;
      const lo = plain ? [...(lp === 'on' ? ['fill=white', `rounded corners=${pd(3)}`, `inner sep=${pd(2)}`] : ['auto', `inner sep=${pd(2.5)}`]), lp !== 'on' && s < 0 ? 'swap' : '', e.lcol && lc(e.lcol) !== '#1d1d1f' ? `text=${rgbOf(e.lcol)}` : '', pFont(ELT)].filter(Boolean)
        : [lp === 'on' ? 'fg label on' : 'fg label', lp !== 'on' && s < 0 ? 'swap' : '', col('text', e.lcol, '#1d1d1f')].filter(Boolean);
      const lt = Math.abs((e.lt ?? .5) - .5) < .005 ? .5 : Math.round(e.lt * 100) / 100;
      if (lt !== .5 && g.pts && g.pts.length > 2) {
        /* a label part way along an elbow: its own node where the canvas shows it */
        const m = elabSize(e), q = labelPos(e, g, m.w, m.h);
        const po = plain ? [...(lp === 'on' ? ['fill=white', `rounded corners=${pd(3)}`, `inner sep=${pd(2)}`] : [`inner sep=${pd(1)}`]), e.lcol && lc(e.lcol) !== '#1d1d1f' ? `text=${rgbOf(e.lcol)}` : '', pFont(ELT)] : [lp === 'on' ? 'fg label on' : 'fg olabel', col('text', e.lcol, '#1d1d1f')];
        post.push(`\\node[${plain ? S(lp === 'on' ? 'onlab' : 'olab', po) : po.filter(Boolean).join(', ')}] at ${P(q.x, q.y)} {${texText(e.label, ELT)}};`);
      } else {
        if (lt !== .5) lo.push('pos=' + tn(lt));
        lab = ` node[${plain ? S(lp === 'on' ? 'onlab' : 'lab', lo) : lo.join(', ')}] {${texText(e.label, ELT)}}`;
      }
    }
    const rays = rayEnds(e, g);
    if (rays.length && !plain) o.push('fg ray=' + (rays.length === 2 ? 'both' : rays[0].w === 'b' ? 'end' : 'start'));
    L.push(`\\draw[${plain ? S('line', o) : o.filter(Boolean).join(', ')}] ${ra} ${op}${lab} ${rb};`);
    /* the fade: short pieces, each a little lighter (works in any TikZ, no fadings library) */
    for (const r of rays) {
      const N = 8, base = plain ? [`draw=${rgbOf(e.color)}`, `line width=${pd(e.sw || 1.4)}`, 'line cap=butt', pDash(e.dash, e.sw)] : ['fg line', 'fg fade', col('draw', e.color, '#1d1d1f'), (e.sw || 1.4) !== 1.4 ? 'lw=' + tn(e.sw) : '', dashOpt(e.dash)];
      for (let i = 0; i < N; i++) {
        const a = { x: r.S.x + (r.F.x - r.S.x) * i / N, y: r.S.y + (r.F.y - r.S.y) * i / N }, b = { x: r.S.x + (r.F.x - r.S.x) * (i + 1) / N, y: r.S.y + (r.F.y - r.S.y) * (i + 1) / N };
        const fo = [...base, 'opacity=' + tn(Math.round((1 - (i + .5) / N) * 100) / 100)];
        L.push(`\\draw[${plain ? S('fade', fo) : fo.filter(Boolean).join(', ')}] ${P(a.x, a.y)} -- ${P(b.x, b.y)};`);
      }
    }
  }
  L.push(...post);
  if (plain) {
    const libs = [...(ns.some(n => n.k === 'diamond' || n.k === 'tri' || n.k === 'circle' && n.w !== n.h) ? ['shapes.geometric'] : []), ...(es.some(e => e.head && e.head !== 'none' || e.tail && e.tail !== 'none') ? ['arrows.meta'] : []), ...(es.some(e => e.shape === 'wave' || e.shape === 'zig') ? ['decorations.pathmorphing'] : [])];
    const { defs, text } = plainStyles(L.map(l => l ? '  ' + l : '').join('\n'), uses);
    const cols = [...pCol].map(([h, n]) => `  \\definecolor{${n}}{HTML}{${h.slice(1).toUpperCase()}}`);
    const need = ['\\usepackage{tikz}', ...(libs.length ? [`\\usetikzlibrary{${libs.join(', ')}}`] : []), ...(imgs.length || ns.some(n => n.ts?.vert) ? ['\\usepackage{graphicx}'] : [])];
    const po = [`x=${PU}pt`, `y=-${PU}pt`, ...defs];
    return { tex: `% Figura · needs ${need.join(' ')}\n${libs.length ? `\\usetikzlibrary{${libs.join(', ')}}\n` : ''}\\begin{tikzpicture}[${po.length > 2 ? '\n  ' + po.join(',\n  ') : po.join(', ')}]\n${cols.length ? cols.join('\n') + '\n' : ''}${text}\n\\end{tikzpicture}`, imgs };
  }
  return { tex: `% Figura -- needs \\usepackage{figura} (figura.sty: Export > figura.sty)\n\\begin{figura}\n${L.map(l => l ? '  ' + l : '').join('\n')}\n\\end{figura}`, imgs };
  } finally { pCol = null; }
}

/* ---------- reading LaTeX back: Figura's own export, or TikZ written by hand ---------- */
const PX_PT = 1 / 0.66667, PX_CM = 28.4528 * PX_PT;
const XCOL = { red: '#ff0000', green: '#00ff00', blue: '#0000ff', cyan: '#00ffff', magenta: '#ff00ff', yellow: '#ffff00', black: '#000000', white: '#ffffff',
  gray: '#808080', grey: '#808080', darkgray: '#404040', lightgray: '#bfbfbf', brown: '#bf8040', lime: '#bfff00', olive: '#808000', orange: '#ff8000', pink: '#ffbfbf', purple: '#bf0040', teal: '#008080', violet: '#800080' };
function texColour(v, names) {
  v = (v || '').trim().replace(/^\{|\}$/g, '');
  if (!v || v === 'none') return v || null;
  const rgb = v.match(/rgb,255:\s*red,(\d+);\s*green,(\d+);\s*blue,(\d+)/); if (rgb) return '#' + rgb.slice(1).map(x => (+x).toString(16).padStart(2, '0')).join('');
  const fh = v.match(/^fg@?([0-9A-Fa-f]{6})$/); if (fh) return '#' + fh[1].toLowerCase();
  const mix = v.split('!');
  const base = c => names[c] || XCOL[c.toLowerCase()] || null;
  let c = base(mix[0]); if (!c) return null;
  for (let i = 1; i < mix.length; i += 2) {
    const p = Math.max(0, Math.min(100, +mix[i])) / 100, o = mix[i + 1] ? base(mix[i + 1]) : '#ffffff'; if (!o || isNaN(p)) break;
    const a = hex2rgb(c), b = hex2rgb(o); c = '#' + a.map((x, j) => Math.round(x * p + b[j] * (1 - p)).toString(16).padStart(2, '0')).join('');
  }
  return c;
}
function stripComments(s) { return s.split('\n').map(l => { const m = l.match(/(^|[^\\])%/); return m ? l.slice(0, m.index + m[1].length) : l; }).join('\n'); }
/* split on a separator at depth 0 of {} [] () */
function splitTop(s, sep) {
  const out = []; let d = 0, cur = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '\\' && i + 1 < s.length) { cur += c + s[++i]; continue; }
    if ('{[('.includes(c)) d++; else if ('}])'.includes(c)) d--;
    if (c === sep && d === 0) { out.push(cur); cur = ''; } else cur += c;
  }
  out.push(cur); return out;
}
let tkStyles = null;   // name → options, from name/.style={...} while parseTikz runs
const optList0 = s => splitTop(s, ',').map(x => x.trim()).filter(Boolean).map(x => { const i = x.indexOf('='); return i < 0 ? [x, null] : [x.slice(0, i).trim(), x.slice(i + 1).trim()]; });
const optList = (s, depth = 0) => optList0(s).flatMap(([k, v]) => (tkStyles && v == null && tkStyles[k] && depth < 8 ? optList(tkStyles[k], depth + 1) : [[k, v]]));
function readStyles(optsText) {
  for (const [k, v] of optList0(optsText)) { const m = k.match(/^(.+?)\/\.style$/); if (m && v != null) tkStyles[m[1].trim()] = v.replace(/^\{([\s\S]*)\}$/, '$1'); }
}
/* read one balanced group starting at s[i] (one of { [ ( ) */
function group(s, i) {
  const open = s[i], close = { '{': '}', '[': ']', '(': ')' }[open]; let d = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '\\') { j++; continue; }
    if (s[j] === open) d++; else if (s[j] === close && --d === 0) return { v: s.slice(i + 1, j), end: j + 1 };
  }
  return { v: s.slice(i + 1), end: s.length };
}
function texToText(t) {
  const st = { bold: false, italic: false, under: false, vert: false };
  t = t.trim();
  const wrap = (cmd, k) => { const m = t.match(new RegExp('^\\\\' + cmd + '\\{([\\s\\S]*)\\}$')); if (m && group(t, cmd.length + 1).end === t.length) { t = m[1].trim(); st[k] = true; return true; } return false; };
  for (let k = 0; k < 4; k++) wrap('fgvert', 'vert') || wrap('textbf', 'bold') || wrap('textit', 'italic') || wrap('underline', 'under');
  const parts = t.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g);
  t = parts.map(p => {
    if (/^\$\\displaystyle\s/.test(p)) return '$$' + p.slice(14, -1).trim() + '$$';
    if (/^(\$|\\\(|\\\[)/.test(p)) return p;
    return p.replace(/\\\\(\[[^\]]*\])?\s*/g, '\n').replace(/\\underline\{([^{}]*)\}/g, (_, x) => { st.under = true; return x; })
      .replace(/\\textbackslash\{\}/g, '\\').replace(/\\textasciitilde\{\}/g, '~').replace(/\\textasciicircum\{\}/g, '^').replace(/\\([{}#%&_$])/g, '$1')
      .replace(/\{\\(bfseries|bf)\s*([^{}]*)\}/g, (_, a, x) => { st.bold = true; return x; }).replace(/~/g, ' ').replace(/[ \t]*\n[ \t]*/g, '\n');
  }).join('');
  return { text: t.trim(), st };
}
/* "3pt", "2\fgu", "1.5" → canvas px; plain numbers are canvas px in figura, cm in tikzpicture */
function dimPx(v, unitless) {
  const m = String(v).trim().match(/^(-?[\d.]+)\s*(\\fgu|pt|cm|mm|in|em|ex|bp)?$/); if (!m) return null;
  const x = +m[1]; return x * ({ '\\fgu': 1, pt: PX_PT, bp: PX_PT * 1.00375, cm: PX_CM, mm: PX_CM / 10, in: PX_CM * 2.54, em: 15, ex: 7 }[m[2]] ?? unitless);
}
const TIP_HEAD = t => {
  t = t.replace(/^\{|\}$/g, '').trim();
  if (!t) return 'none';
  if (/^(>|<|to|To|Straight Barb|Computer Modern Rightarrow|cm to|Rightarrow)$/.test(t)) return 'vee';
  if (/^(>>|<<)$/.test(t) || /Barb(\[\])?\]?\s*Straight Barb/.test(t)) return 'two';
  if (/open/.test(t) && /Triangle|Latex|Stealth|latex/.test(t)) return 'otri';
  if (/^(Triangle|Latex|latex|Stealth|stealth|triangle 45|triangle 60)/.test(t)) return 'tri';
  if (/^(o|Circle\[open\]|Circle\[open.*)$/.test(t) || (/Circle/.test(t) && /open/.test(t))) return 'ocirc';
  if (/^(\*|Circle)/.test(t)) return 'circ';
  if (/^(\||Bar|\[|\])$/.test(t)) return 'bar';
  if (/Hooks|hook/.test(t)) return 'hook';
  return 'vee';
};
function arrowsOf(k) {
  if (!/-/.test(k) || /=/.test(k)) return null;
  const ok = t => !t || /^\{.*\}$/.test(t) || /^(>|<|>>|<<|\||o|\*|to|To|latex|Latex|stealth|Stealth|Triangle|Circle|Bar|Hooks|hook|Straight Barb|Rightarrow|triangle 45|triangle 60)$/.test(t.trim());
  let d = 0;
  for (let i = 0; i < k.length; i++) {
    const c = k[i]; if (c === '{' || c === '[') d++; else if (c === '}' || c === ']') d--;
    else if (c === '-' && d === 0) { const a = k.slice(0, i), b = k.slice(i + 1); return ok(a) && ok(b) ? { tail: TIP_HEAD(a), head: TIP_HEAD(b) } : null; }
  }
  return null;
}
const TIKZ_W = { 'ultra thin': .5, 'very thin': .8, thin: 1, semithick: 1.4, thick: 2, 'very thick': 2.8, 'ultra thick': 4 };
const LOOPS = { above: 90, below: -90, left: 180, right: 0 };
function parseTikz(src) {
  if (!src) return null;
  const old = src.match(/^%figura:(.*)$/m);
  if (old) { try { const d = JSON.parse(old[1]); if (d.nodes) return { nodes: d.nodes, edges: d.edges || [] }; } catch { /* fall through */ } }
  const { byName } = colourNames(), names = { ...byName };
  const s0 = stripComments(src), blocks = [];
  tkStyles = {};
  try {
  for (const t of s0.matchAll(/\\tikzset\s*\{/g)) readStyles(group(s0, t.index + t[0].length - 1).v);
  const re = /\\begin\{(figura|tikzpicture)\}/g; let m;
  while ((m = re.exec(s0))) {
    const end = s0.indexOf(`\\end{${m[1]}}`, re.lastIndex); if (end < 0) break;
    let b = s0.slice(re.lastIndex, end), unit = null, ys = null;
    if (b.trim()[0] === '[') {
      const g = group(b, b.indexOf('[')); readStyles(g.v);
      for (const [k, v] of optList0(g.v)) { if (k === 'x' && v) unit = dimPx(v.replace(/^-/, ''), PX_CM); if (k === 'y' && v) ys = /^-/.test(v.trim()) ? 1 : -1; }
      b = b.slice(g.end);
    }
    blocks.push({ body: b.replace(/\\definecolor\s*\{[^}]*\}\s*\{[^}]*\}\s*\{[^}]*\}/g, ''), fig: m[1] === 'figura', unit, ys }); re.lastIndex = end;
  }
  if (!blocks.length && /\\(node|draw)\b/.test(s0)) blocks.push({ body: s0, fig: true });
  if (!blocks.length) return null;
  const nodes = [], edges = [], ids = {}; let shiftX = 0;
  for (const { body, fig, unit, ys } of blocks) {
    const U = fig ? 1 : unit || PX_CM, YS = fig ? 1 : ys || -1, here = [], defs = s0.matchAll(/\\definecolor\{([^}]+)\}\{HTML\}\{([0-9A-Fa-f]{6})\}/g);
    for (const d of defs) names[d[1]] = '#' + d[2].toLowerCase();
    const pt = str => {
      const v = str.trim(), c = v.match(/^(-?[\d.]+\s*(?:\\fgu|pt|cm|mm|in|em|bp)?)\s*,\s*(-?[\d.]+\s*(?:\\fgu|pt|cm|mm|in|em|bp)?)$/);
      if (c) return { x: dimPx(c[1], U) + shiftX, y: YS * dimPx(c[2], U) };
      const id = ids[v.replace(/\.[\w ]+$/, '').trim()]; return id ? { id } : null;
    };
    for (let stmt of splitTop(body, ';')) {
      stmt = stmt.trim(); const cm = stmt.match(/^\\(node|draw|path|coordinate)\b\s*/); if (!cm) continue;
      let i = cm[0].length; const kind = cm[1];
      if (kind === 'node' || kind === 'coordinate') {
        let opts = [], nm = null, at = null, text = '';
        while (i < stmt.length) {
          const c = stmt[i];
          if (/\s/.test(c)) { i++; continue; }
          if (c === '[') { const g = group(stmt, i); opts = opts.concat(optList(g.v)); i = g.end; continue; }
          if (c === '(') { const g = group(stmt, i); if (nm == null && !/,/.test(g.v)) nm = g.v.trim(); else if (!at) at = g.v; i = g.end; continue; }
          if (stmt.startsWith('at', i)) { i += 2; continue; }
          if (c === '{') { text = group(stmt, i).v; break; }
          i++;
        }
        const O = Object.fromEntries(opts.map(([k, v]) => [k, v ?? true]));
        let p = at ? pt(at) : null;
        const rel = opts.find(([k, v]) => /^(above|below|left|right)( (left|right))?$/.test(k) && v && /^of /.test(v));
        if (!p && rel) { const ref = nodes.find(n => n.id === ids[rel[1].slice(3).trim()]); if (ref) { const dx = /right/.test(rel[0]) ? 1 : /left/.test(rel[0]) ? -1 : 0, dy = /below/.test(rel[0]) ? 1 : /above/.test(rel[0]) ? -1 : 0; p = { x: ref.x + dx * (ref.w + 50), y: ref.y + dy * (ref.h + 40) }; } }
        if (!p || p.id) p = { x: (nodes.length % 5) * 120, y: Math.floor(nodes.length / 5) * 90 };
        if (kind === 'coordinate') { if (nm) ids[nm] = { pt: p }; continue; }
        const has = k => k in O;
        let k = has('fg dot') || (has('circle') && has('minimum size') && has('fill') && !has('draw') && !text.trim()) ? 'dot' : has('fg box') ? 'rect' : has('fg circle') ? 'circle' : has('fg diamond') ? 'diamond' : has('fg triangle') ? 'tri' : has('fg text') ? 'text' : has('fg image') ? 'image'
          : has('circle') || has('ellipse') || has('circle split') ? 'circle' : has('diamond') ? 'diamond' : has('isosceles triangle') || (has('regular polygon') && O['regular polygon sides'] == 3) ? 'tri'
          : has('rectangle') || has('draw') || has('fill') || has('rounded corners') ? 'rect' : 'text';
        const isFg = opts.some(([k2]) => /^fg (box|circle|diamond|triangle)$/.test(k2));
        if (k === 'image') k = 'rect';
        const n = { id: 'n' + uid(), k, x: p.x, y: p.y, rot: 0, text: '', ...clone(KDEF[k]) };
        n.ts = { ...TS };
        if (k === 'dot') { n.h = n.w = typeof O['fg dot'] === 'string' && +O['fg dot'] > 0 ? +O['fg dot'] : 8; }
        else if (k !== 'text') { n.fill = 'none'; n.stroke = isFg || has('draw') ? '#1d1d1f' : 'none'; n.sw = isFg ? 1.5 : 1.4; if (!isFg && k === 'rect') n.rad = 0; if (!isFg) { n.w = k === 'circle' ? 28 : 40; n.h = k === 'circle' ? 28 : 24; } }
        for (const [key, v] of opts) {
          const num = v != null ? dimPx(v, 1) : null;
          if (key === 'w' || key === 'minimum width') { if (num) n.w = key === 'w' ? +v : num; }
          else if (key === 'h' || key === 'minimum height') { if (num) n.h = key === 'h' ? +v : num; }
          else if (key === 'minimum size') { if (num) n.w = n.h = num; }
          else if (key === 'r') n.rad = +v;
          else if (key === 'rounded corners') n.rad = v ? dimPx(v, 1) ?? 4 : 4 * PX_PT;
          else if (key === 'sharp corners') n.rad = 0;
          else if (key === 'fill') { const c = texColour(v, names); if (c) n.fill = c; }
          else if (key === 'draw') { const c = v ? texColour(v, names) : '#1d1d1f'; if (c) n.stroke = c; }
          else if (key === 'fill hex') n.fill = '#' + v.toLowerCase();
          else if (key === 'draw hex') n.stroke = '#' + v.toLowerCase();
          else if (key === 'text hex') n.ts.color = '#' + v.toLowerCase();
          else if (key === 'text' || key === 'color') { const c = texColour(v, names); if (c) { n.ts.color = c; if (key === 'color' && n.stroke !== 'none') n.stroke = c; } }
          else if (key === 'lw') n.sw = +v;
          else if (key === 'line width') { if (num) n.sw = Math.round(dimPx(v, 1) * 20) / 20; }
          else if (/^(ultra thin|very thin|thin|semithick|thick|very thick|ultra thick)$/.test(key)) n.sw = TIKZ_W[key];
          else if (key === 'dashed' || key === 'densely dashed' || key === 'loosely dashed') n.sd = 'dash';
          else if (key === 'dotted' || key === 'densely dotted' || key === 'loosely dotted') n.sd = 'dot';
          else if (key === 'dashes') { const d = v.match(/\{([\d.]+)\}\s*\{([\d.]+)\}/); if (d) n.sd = `d:${d[1]}:${d[2]}`; }
          else if (key === 'dots') n.sd = `d:0:${+v}`;
          else if (key === 'double border' || key === 'double') n.dbl = true;
          else if (key === 'rotate') n.rot = -(+v || 0);
          else if (/^points (up|down|left|right)$/.test(key)) n.dir = key.slice(7);
          else if (key === 'shape border rotate') n.dir = { 0: 'right', 90: 'up', 180: 'left', 270: 'down', '-90': 'down' }[+v] || 'up';
          else if (key === 'label' && v) {
            /* label={[opts]above:text} → a label outside the shape */
            let t = v.trim(); if (t[0] === '{' && t[t.length - 1] === '}') t = t.slice(1, -1).trim();
            if (t[0] === '[') t = t.slice(group(t, 0).end).trim();
            const c = splitTop(t, ':'), pos = c.length > 1 ? c[0].trim() : 'above', body = (c.length > 1 ? c.slice(1).join(':') : t).trim().replace(/^\{([\s\S]*)\}$/, '$1');
            let sd = /^(above|north)$/.test(pos) ? 't' : /^(below|south)$/.test(pos) ? 'b' : /^(left|west)$/.test(pos) ? 'l' : /^(right|east)$/.test(pos) ? 'r' : null, oa = null;
            if (!sd && /^-?[\d.]+$/.test(pos)) { let a = -(+pos) % 360; if (a <= -180) a += 360; if (a > 180) a -= 360; sd = a > -45 && a <= 45 ? 'r' : a > 45 && a <= 135 ? 'b' : a > -135 && a <= -45 ? 't' : 'l'; if (a !== OL_ANG[sd] && !(sd === 'l' && a === -180)) oa = Math.round(a); }
            const lt = texToText(body).text; if (sd && lt) { n.ol = n.ol || {}; n.ol[sd] = lt; if (oa != null) { n.oa = n.oa || {}; n.oa[sd] = oa; } }
          }
          else if (key === 'size') n.ts.size = +v;
          else if (key === 'bold') n.ts.bold = true;
          else if (key === 'italic') n.ts.italic = true;
          else if (key === 'font') { if (/bfseries|\\bf\b/.test(v)) n.ts.bold = true; if (/itshape|\\it\b/.test(v)) n.ts.italic = true; const fs = v.match(/\\fgfont\{([\d.]+)\}/); if (fs) n.ts.size = +fs[1]; else if (/\\large\b/.test(v)) n.ts.size = 18; else if (/\\Large\b/.test(v)) n.ts.size = 21; else if (/\\small\b/.test(v)) n.ts.size = 13; }
          else if (fig === false && /^(red|blue|green|black|gray|orange|purple|cyan|magenta|teal|violet|brown)(!.*)?$/.test(key) && v == null) { const c = texColour(key, names); if (c) { if (n.stroke !== 'none') n.stroke = c; n.ts.color = c; } }
        }
        if (k === 'text') { n.fill = 'none'; n.stroke = 'none'; }
        const tt = texToText(/\\includegraphics/.test(text) ? '' : text); n.text = tt.text; Object.assign(n.ts, { bold: n.ts.bold || tt.st.bold, italic: n.ts.italic || tt.st.italic, under: tt.st.under, vert: tt.st.vert });
        nodes.push(n); here.push(n); if (nm) ids[nm] = n.id;
        continue;
      }
      /* \draw: (A) -- (B), (A) to[...] (B), node labels, chains */
      let opts = [];
      const seq = [];
      while (i < stmt.length) {
        const c = stmt[i];
        if (/\s/.test(c)) { i++; continue; }
        if (c === '[' && !seq.length) { const g = group(stmt, i); opts = opts.concat(optList(g.v)); i = g.end; continue; }
        if (c === '(') { const g = group(stmt, i); seq.push({ p: g.v }); i = g.end; continue; }
        if (stmt.startsWith('..', i)) {
          i += 2; const ws = () => { while (/\s/.test(stmt[i] || '')) i++; }; ws();
          if (stmt.startsWith('controls', i)) { i += 8; ws(); const c = []; if (stmt[i] === '(') { const g = group(stmt, i); c.push(g.v); i = g.end; } ws(); if (stmt.startsWith('and', i)) { i += 3; ws(); if (stmt[i] === '(') { const g = group(stmt, i); c.push(g.v); i = g.end; } } ws(); if (stmt.startsWith('..', i)) i += 2; seq.push({ op: 'ctl', c, o: [] }); }
          continue;
        }
        if (stmt.startsWith('--', i) || stmt.startsWith('-|', i) || stmt.startsWith('|-', i)) { seq.push({ op: '--', o: [] }); i += 2; continue; }
        if (stmt.startsWith('to', i) || stmt.startsWith('edge', i)) { i += stmt.startsWith('to', i) ? 2 : 4; let o = []; while (/\s/.test(stmt[i] || '')) i++; if (stmt[i] === '[') { const g = group(stmt, i); o = optList(g.v); i = g.end; } seq.push({ op: 'to', o }); continue; }
        if (stmt.startsWith('node', i)) { i += 4; let o = []; while (/\s/.test(stmt[i] || '')) i++; if (stmt[i] === '[') { const g = group(stmt, i); o = optList(g.v); i = g.end; } while (/\s/.test(stmt[i] || '')) i++; let t = ''; if (stmt[i] === '{') { const g = group(stmt, i); t = g.v; i = g.end; } seq.push({ lab: t, o }); continue; }
        i++;
      }
      const base = { color: '#1d1d1f', sw: 1.4, dash: 'solid', head: 'none', tail: 'none', shape: 'line' };
      for (const [key, v] of opts) {
        const ar = arrowsOf(key); if (ar && v == null) { base.head = ar.head; base.tail = ar.tail; continue; }
        if (key === 'draw' || key === 'color') { const c = texColour(v, names); if (c && c !== 'none') base.color = c; }
        else if (key === 'draw hex') base.color = '#' + v.toLowerCase();
        else if (key === 'lw') base.sw = +v;
        else if (key === 'r' || key === 'rounded corners') base.round = true;
        else if (key === 'line width') { const x = dimPx(v, 1); if (x) base.sw = Math.round(x * 20) / 20; }
        else if (/^(ultra thin|very thin|thin|semithick|thick|very thick|ultra thick)$/.test(key)) base.sw = TIKZ_W[key];
        else if (/dashed$/.test(key)) base.dash = 'dash';
        else if (/dotted$/.test(key)) base.dash = 'dot';
        else if (key === 'dashes') { const d = v.match(/\{([\d.]+)\}\s*\{([\d.]+)\}/); if (d) base.dash = `d:${d[1]}:${d[2]}`; }
        else if (key === 'dots') base.dash = `d:0:${+v}`;
        else if (key === 'double line' || key === 'double') base.shape = 'double';
        else if (key === 'wave' || key === 'snake') base.shape = 'wave';
        else if (key === 'zigzag') base.shape = 'zig';
        else if (key === 'fg ray') { if (/end|both/.test(v || 'end')) base.head = 'ray'; if (/start|both/.test(v || '')) base.tail = 'ray'; }
        else if (key === 'decoration' && /snake|coil/.test(v)) base.shape = 'wave';
        else if (key === 'decoration' && /zigzag/.test(v)) base.shape = 'zig';
        else if (!fig && v == null && XCOL[key.split('!')[0].toLowerCase()]) { const c = texColour(key, names); if (c) base.color = c; }
      }
      if (opts.some(([k]) => k === 'fg fade')) continue;
      /* plain TikZ fade pieces (butt caps, falling opacity) after a line: that line is a ray at the nearer end */
      if (opts.some(([k, v]) => k === 'line cap' && v === 'butt') && opts.some(([k]) => k === 'opacity')) {
        const e0 = edges[edges.length - 1], q = seq[0]?.p != null ? pt(seq[0].p) : null;
        if (e0 && q && !q.id) {
          const at = (id, p) => (id ? nodes.find(n => n.id === id) : p), A = at(e0.a, e0.pa), B = at(e0.b, e0.pb);
          if (A && B) { if (Math.hypot(q.x - B.x, q.y - B.y) <= Math.hypot(q.x - A.x, q.y - A.y)) e0.head = 'ray'; else e0.tail = 'ray'; }
        }
        continue;
      }
      const endOf = q => { const r = pt(q.p); if (!r) return null; if (r.id && r.id.pt) return { pt: r.id.pt }; return r.id ? { id: r.id } : { pt: r }; };
      /* (node) -- (x,y) -- (x,y) -- (node) with straight-across steps: one elbow line */
      for (let j = 0; j + 6 < seq.length; j++) {
        const w7 = seq.slice(j, j + 7);
        if (!(w7[0].p != null && w7[2].p != null && w7[4].p != null && w7[6].p != null && w7[1].op === '--' && w7[3].op === '--' && w7[5].op === '--')) continue;
        const a0 = endOf(w7[0]), m1 = endOf(w7[2]), m2 = endOf(w7[4]), b0 = endOf(w7[6]);
        if (!a0 || !b0 || !m1?.pt || !m2?.pt || m1.id || m2.id) continue;
        if (Math.abs(m1.pt.x - m2.pt.x) > .5 && Math.abs(m1.pt.y - m2.pt.y) > .5) continue;
        seq.splice(j + 1, 5, { op: 'elb', m: [m1.pt, m2.pt], o: [] });
      }
      let prev = null, pend = null, labs = [];
      for (const it of seq) {
        if (it.p != null) {
          const cur = endOf(it); if (!cur) { prev = null; continue; }
          if (prev && pend) {
            const e = { id: 'e' + uid(), a: prev.id || null, b: cur.id || null, ...base, bend: 0, label: '', lp: 'auto' };
            if (!e.a) e.pa = prev.pt; if (!e.b) e.pb = cur.pt;
            const O = pend.o, get = k => (O.find(([k2]) => k2 === k) || [])[1];
            const bl = O.find(([k2]) => k2 === 'bend left' || k2 === 'bend right');
            const pa = e.a ? nodes.find(n => n.id === e.a) : e.pa, pb = e.b ? nodes.find(n => n.id === e.b) : e.pb;
            if (pend.op === 'ctl' && pa && pb && pend.c.length) { const q1 = pt(pend.c[0]), q2 = pt(pend.c[1] || pend.c[0]); if (q1 && q2 && !q1.id && !q2.id) { e.route = 'bez'; e.c1 = ctlOf(pa, pb, q1); e.c2 = ctlOf(pa, pb, q2); } }
            if (pend.op === 'elb' && pa && pb) { const [m1] = pend.m, h = Math.abs(m1.x - pa.x) > Math.abs(m1.y - pa.y); e.route = base.round ? 'elbowr' : 'elbow'; e.ek = h ? 'h' : 'v'; const den = h ? pb.x - pa.x : pb.y - pa.y; e.em = Math.abs(den) < 1 ? .5 : Math.round(((h ? m1.x - pa.x : m1.y - pa.y) / den) * 1000) / 1000; }
            delete e.round;
            if (bl && pa && pb) { const th = +(bl[1] ?? 30), Ld = Math.hypot(pb.x - pa.x, pb.y - pa.y); e.bend = Math.round(Math.tan(th * Math.PI / 180) * Ld / 4 * (bl[0] === 'bend left' ? 1 : -1)); }
            const loopAt = get('loop at'), lk = O.find(([k2]) => /^loop (above|below|left|right)$/.test(k2));
            if (e.a && e.a === e.b) e.la = loopAt != null ? -(+loopAt) : lk ? -LOOPS[lk[0].slice(5)] : get('out') != null ? -((+get('out') + +(get('in') ?? get('out'))) / 2) : -90;
            for (const [k2, v] of O) { const ar = arrowsOf(k2); if (ar && v == null) { e.head = ar.head; e.tail = ar.tail; } }
            const lab = labs[0];
            if (lab) {
              const LO = Object.fromEntries(lab.o.map(([k2, v]) => [k2, v ?? true])), tt = texToText(lab.lab);
              if (LO.pos != null && +LO.pos >= 0 && +LO.pos <= 1 && Math.abs(+LO.pos - .5) > .001) e.lt = +LO.pos; else if ('near start' in LO) e.lt = .25; else if ('near end' in LO) e.lt = .75;
              e.label = tt.text; e.lp = 'fg label on' in LO || ('fill' in LO && !('auto' in LO) && !('fg label' in LO)) || 'sloped' in LO ? 'on' : 'swap' in LO || LO.auto === 'right' ? (e.bend < 0 ? 'auto' : 'r') : e.bend < 0 ? 'l' : 'auto';
              const lc2 = LO['text hex'] ? '#' + LO['text hex'].toLowerCase() : LO.text ? texColour(LO.text, names) : null; if (lc2) e.lcol = lc2;
            }
            edges.push(e);
          }
          prev = cur; pend = null; labs = [];
        } else if (it.op) { pend = it; labs = []; }
        else if (it.lab != null) labs.push(it);
      }
    }
    if (here.length) { const r = Math.max(...here.map(n => n.x + n.w / 2)); shiftX = r + 80; }
  }
  return nodes.length || edges.length ? { nodes, edges } : null;
  } finally { tkStyles = null; }
}
async function picPNG({ n, w, h }) {
  const img = await loadImg(assets[n.img]); const c = { ...cropOf(n) };
  if (n.k !== 'image') { const ar = w / h; if (c.w / c.h > ar) { const nw = c.h * ar; c.x += (c.w - nw) / 2; c.w = nw; } else { const nh = c.w / ar; c.y += (c.h - nh) / 2; c.h = nh; } }
  const k = Math.min(1, 2000 / Math.max(c.w, c.h)), cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(c.w * k)); cv.height = Math.max(1, Math.round(c.h * k));
  cv.getContext('2d').drawImage(img, c.x, c.y, c.w, c.h, 0, 0, cv.width, cv.height);
  return new Promise(ok => cv.toBlob(ok, 'image/png'));
}
/* ---------- export modal (like ZX-Draw): tabs LaTeX / Image / File, options, preview, actions at the bottom ---------- */
const EXP = Object.assign({ tab: 'tikz', fmt: 'png', scale: 3, white: true, files: 'all' }, lsGet('figura-exp-v1') || {});
if (!EXP.tk) { EXP.tk = 1; if (EXP.tab === 'tex') EXP.tab = 'tikz'; }   // TikZ became the default
let expOnly = false;
const DL_IC = sv('<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19h14"/>', 16);
function openExport(tab) {
  closePP(); closeMenu();
  if (tab) EXP.tab = tab;
  expOnly = sel.size > 0 && expOnly;
  const box = $('#modal .mbox');
  box.classList.add('exp');
  box.innerHTML = `<div class="ehead"><h2>Export</h2>${seg('etab', EXP.tab, [['tikz', 'TikZ'], ['tex', 'figura.sty'], ['img', 'Image'], ['file', 'File']])}<span class="grow"></span><button class="ibtn" data-x title="Close (Esc)">${IC.close}</button></div><div class="ebody"></div>`;
  $('#modal').hidden = false;
  initSegs($('.ehead', box));
  box.onclick = e => {
    if (e.target.closest('[data-x]')) { closeModal(); return; }
    const t = e.target.closest('[data-a="etab"]');
    if (t && t.dataset.v !== EXP.tab) {
      EXP.tab = t.dataset.v; lsSet('figura-exp-v1', EXP);
      $$('.ehead .seg button', box).forEach(b => b.classList.toggle('on', b === t)); syncPill($('.ehead .seg', box), t); expShow();
    }
  };
  expShow();
  requestAnimationFrame(() => syncPill($('.ehead .seg', box), $('.ehead .seg button.on', box)));
}
const scopeSeg = () => sel.size ? seg('only', expOnly ? 1 : 0, [[0, 'Whole page'], [1, 'Selection']]) : '';
function expShow() {
  const body = $('#modal .ebody'); body.classList.remove('in'); void body.offsetWidth; body.classList.add('in');
  ({ tex: expTex, tikz: b => expTex(b, true), img: expImg, file: expFile })[EXP.tab](body);
  body.querySelectorAll('[data-a="only"]').forEach(b => { b.onclick = () => { expOnly = b.dataset.v === '1'; expShow(); }; });
}
function expTex(body, plain) {
  const { tex, imgs } = latexFor(expOnly, plain);
  const empty = !tex.includes('\\path') && !tex.includes('\\node');
  body.innerHTML = `<div class="eopts">${scopeSeg()}<span class="grow"></span><span class="muted">${imgs.length ? `${imgs.length} picture${imgs.length > 1 ? 's' : ''} go next to the .tex` : 'Same geometry as the canvas'}</span></div>
    <textarea class="code" readonly spellcheck="false"></textarea>
    <div class="efoot"><span class="muted">${plain ? 'Only needs TikZ · paste or import it to edit again' : 'Shorter, with <code>\\usepackage{figura}</code>'}</span><span class="grow"></span>
      ${plain ? '' : `<button class="btn ghost" data-l="sty">${DL_IC}<span>figura.sty</span></button>`}${imgs.length ? `<button class="btn ghost" data-l="pics">${DL_IC}<span>Pictures</span></button>` : ''}
      <button class="btn ghost" data-l="tex">${DL_IC}<span>.tex</span></button><button class="btn primary" data-l="copy">${IC.copy}<span>Copy</span></button></div>`;
  initSegs(body);
  const ta = body.querySelector('textarea'); ta.value = empty ? '% nothing to export yet' : tex;
  body.querySelector('.efoot').onclick = async e => {
    const b = e.target.closest('[data-l]'); if (!b) return;
    const a = b.dataset.l;
    if (a === 'sty') { download('figura.sty', new Blob([styText()], { type: 'text/x-tex' })); return; }
    if (empty) { toast('Nothing to export'); return; }
    if (a === 'copy') { try { await navigator.clipboard.writeText(tex); } catch { ta.select(); document.execCommand('copy'); } toast(plain ? 'TikZ copied' : 'LaTeX copied'); }
    if (a === 'tex') download(fileName(curTab().name) + '.tex', new Blob([tex], { type: 'text/x-tex' }));
    if (a === 'pics') for (const im of imgs) { download(im.f, await picPNG(im)); await new Promise(r => setTimeout(r, 200)); }
  };
}
async function expImg(body) {
  const png = EXP.fmt === 'png';
  body.innerHTML = `<div class="eopts">${scopeSeg()}${seg('fmt', EXP.fmt, [['png', 'PNG'], ['svg', 'SVG']])}<div class="cond ${png ? '' : 'off'}">${seg('scale', EXP.scale, [[2, '2×'], [3, '3×'], [4, '4×']])}</div><span class="grow"></span>${lbl('White')}${sw2('white', EXP.white)}</div>
    <div class="eprev ${EXP.white ? '' : 'checker'}"><span class="muted">Typesetting…</span></div>
    <div class="efoot"><span class="muted">Formulas set in TeX fonts</span><span class="grow"></span>${png ? `<button class="btn ghost" data-i="copy">${IC.copy}<span>Copy</span></button>` : ''}<button class="btn primary" data-i="dl">${DL_IC}<span>Download</span></button></div>`;
  initSegs(body);
  const eo = body.querySelector('.eopts');
  eo.onclick = e => {
    const b = e.target.closest('button[data-a]'); if (!b || b.dataset.a === 'only') return;
    if (b.dataset.a === 'fmt') EXP.fmt = b.dataset.v;
    if (b.dataset.a === 'scale') EXP.scale = +b.dataset.v;
    lsSet('figura-exp-v1', EXP); expShow();
  };
  eo.querySelector('[data-a=white]').onchange = e => { EXP.white = e.target.checked; lsSet('figura-exp-v1', EXP); body.querySelector('.eprev').classList.toggle('checker', !EXP.white); };
  const r = await buildSVG(expOnly);
  const pv = body.querySelector('.eprev'); if (!pv || !pv.isConnected) return;
  if (!r) { pv.innerHTML = '<span class="muted">Nothing to export yet</span>'; return; }
  pv.innerHTML = r.svg.replace('<svg ', `<svg style="max-width:100%;max-height:100%;width:${f2(Math.min(r.w * 1.5, 900))}px;height:auto" `);
  body.querySelector('.efoot').onclick = async e => {
    const b = e.target.closest('[data-i]'); if (!b) return;
    if (b.dataset.i === 'dl') {
      if (EXP.fmt === 'svg') download(fileName(curTab().name) + '.svg', new Blob([r.svg], { type: 'image/svg+xml' }));
      else download(fileName(curTab().name) + '.png', await toPNG(r, EXP.scale, EXP.white));
      toast('Image saved');
    }
    if (b.dataset.i === 'copy') { try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': toPNG(r, EXP.scale, EXP.white) })]); toast('PNG copied'); } catch { toast('Clipboard not available here'); } }
  };
}
function expFile(body) {
  syncTab();
  const n = ws.tabs.length;
  body.innerHTML = `<div class="eopts">${seg('files', EXP.files, [['all', `All pages (${n})`], ['one', 'This page']])}<span class="grow"></span></div>
    <div class="efile">${(EXP.files === 'all' ? ws.tabs : [curTab()]).map(t => `<div class="ef-row"><b>${esc(t.name)}</b><span class="muted">${t.doc.nodes.length} shapes · ${t.doc.edges.length} lines${t.locked ? ' · locked' : ''}</span></div>`).join('')}</div>
    <div class="efoot"><span class="muted">A <code>.figura</code> file keeps everything, pictures too, and opens again with Import.</span><span class="grow"></span><button class="btn primary" data-f="dl">${DL_IC}<span>Download</span></button></div>`;
  initSegs(body);
  body.querySelector('.eopts').onclick = e => { const b = e.target.closest('[data-a=files]'); if (b) { EXP.files = b.dataset.v; lsSet('figura-exp-v1', EXP); expShow(); } };
  body.querySelector('[data-f=dl]').onclick = () => saveFile(EXP.files === 'all' ? ws.tabs : [curTab()]);
}
$('#btnExport').addEventListener('click', () => openExport());

/* ================= help ================= */
function closeModal() { $('#modal').hidden = true; $('#modal .mbox').classList.remove('exp', 'help', 'dked'); closeDockEd(); closeCP(); recording = null; }
$('#modal').addEventListener('pointerdown', e => { if (e.target.id === 'modal') closeModal(); });
/* ================= help: guide (LaTeX, import / export, animated key cards) and rebindable shortcuts ================= */
const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const ALT = IS_MAC ? '⌥' : 'Alt';
const cap = k => `<kbd class="cap">${k}</kbd>`;
const codeBlock = (code, id) => `<div class="gcode"><pre id="${id}">${esc(code)}</pre><button class="gcopy" data-copy="${id}">${IC.copy}<span>Copy</span></button></div>`;
/* tiny looping demos: SVG + SMIL, 220 × 110 */
const DUR = '3.6s', INK = '#1d1d1f', ACC = '#5b5bd6';
const anim = (attr, values, kt, extra = '') => `<animate attributeName="${attr}" values="${values}" keyTimes="${kt}" dur="${DUR}" repeatCount="indefinite"${extra}/>`;
const move = (values, kt) => `<animateTransform attributeName="transform" type="translate" values="${values}" keyTimes="${kt}" dur="${DUR}" repeatCount="indefinite"/>`;
const SPL = n => ` calcMode="spline" keySplines="${Array(n).fill('.45 0 .2 1').join(';')}"`;
const CUR = `<path d="M0 0v15l4-3.6 3 6.6 2.6-1.1-2.9-6.4h5.4z" fill="${INK}" stroke="#fff" stroke-width="1.1" stroke-linejoin="round"/>`;
const cur = (vals, kt) => `<g>${move(vals, kt)}${CUR}</g>`;
const dC = (x, y, r = 11, fill = '#fff', extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="1.3">${extra}</circle>`;
const dB = (x, y, w = 30, h = 20, fill = '#fff', extra = '') => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="4" fill="${fill}" stroke="${INK}" stroke-width="1.3">${extra}</rect>`;
const dL = (d, extra = '', sw = 1.4) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${extra}</path>`;
const grow = (x1, y1, x2, y2, t0, t1) => { const L = Math.hypot(x2 - x1, y2 - y1); return `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="${f2(L)}" stroke-dashoffset="${f2(L)}">${anim('stroke-dashoffset', `${f2(L)};${f2(L)};0;0;${f2(L)}`, `0;${t0};${t1};.92;1`)}</path>`; };
const ringA = (x, y, vals, kt, r = 15) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${ACC}" stroke-width="2" opacity="0">${anim('opacity', vals, kt)}</circle>`;
const keyCap = (x, y, k, on, off) => `<g transform="translate(${x} ${y})"><rect width="${Math.max(18, 8 + k.length * 7)}" height="18" rx="4" fill="#fff" stroke="#d8d8d2">${anim('fill', `#fff;#fff;#e6e6fb;#e6e6fb;#fff;#fff`, `0;${on};${on + .02};${off};${off + .02};1`)}</rect><text x="${Math.max(18, 8 + k.length * 7) / 2}" y="13" class="dkey">${k}</text></g>`;
const demoSvg = inner => `<svg class="demo" viewBox="0 0 220 110" aria-hidden="true">${inner}</svg>`;
const dots = () => Array.from({ length: 8 }, (_, i) => Array.from({ length: 4 }, (_, j) => `<circle cx="${8 + i * 30}" cy="${10 + j * 30}" r="1.3" fill="#d2d2cc"/>`).join('')).join('');
const DEMOS = {
  select: () => demoSvg(dB(60, 55) + `<g>${move('0 0;0 0;0 0;60 0;60 0;0 0', '0;.3;.4;.65;.85;1')}${dC(130, 55)}${ringA(130, 55, '0;0;1;1;0', '0;.28;.32;.85;1')}</g>` + cur('200 100;134 59;134 59;194 59;194 59;200 100', '0;.25;.4;.65;.85;1')),
  hand: () => demoSvg(`<g>${move('0 0;0 0;-30 0;-30 0;0 0', '0;.15;.55;.75;1')}${dots()}${dB(90, 55)}${dC(150, 55)}${dL('M105 55H139')}</g>` + `<g>${move('120 70;120 70;90 70;90 70;120 70', '0;.15;.55;.75;1')}<g transform="translate(-9 -9)" color="${INK}">${IC.hand.replace('<svg ', '<svg x="0" y="0" ')}</g></g>`),
  shapes: () => demoSvg(`<rect x="40" y="35" height="40" rx="4" fill="#fff" stroke="${INK}" stroke-width="1.3" width="0">${anim('width', '0;0;60;60;0', '0;.1;.4;.9;1')}${anim('opacity', '0;0;1;1;0', '0;.1;.12;.9;1')}</rect>`
    + `<g transform="translate(160 55)"><circle r="0" fill="#fff" stroke="${INK}" stroke-width="1.3">${anim('r', '0;0;20;17;17;0', '0;.55;.62;.68;.9;1')}</circle></g>` + cur('40 35;40 35;100 75;100 75;160 55;160 55;40 35', '0;.1;.4;.5;.56;.9;1')),
  dot: () => demoSvg(dL('M30 80L110 30L190 80', '', 1) + [[30, 80, .2], [110, 30, .4], [190, 80, .6]].map(([x, y, t]) => `<circle cx="${x}" cy="${y}" r="0" fill="${INK}">${anim('r', `0;0;5;3.5;3.5;0`, `0;${t};${t + .05};${t + .1};.92;1`)}</circle>`).join('') + cur('30 80;30 80;110 30;110 30;190 80;190 80', '0;.2;.35;.4;.55;1')),
  text: () => demoSvg(dB(110, 55, 120, 44) + `<text x="110" y="60" class="dtex" opacity="0">${anim('opacity', '0;0;1;1;0', '0;.25;.3;.9;1')}x² + y² = 1</text><text x="110" y="60" class="dtex raw">${anim('opacity', '1;1;0;0;1', '0;.25;.3;.9;1')}$x^2+y^2=1$</text>`),
  wire: () => demoSvg(dB(50, 55) + dC(170, 55) + grow(66, 55, 157, 55, .2, .55) + `<path d="M150 49L158 55L150 61" fill="none" stroke="${INK}" stroke-width="1.4" opacity="0">${anim('opacity', '0;0;1;1;0', '0;.54;.56;.92;1')}</path>` + cur('54 59;54 59;168 59;168 59;54 59', '0;.2;.55;.9;1')),
  route: () => {
    const P = ['M40 70C40 70 110 10 180 40', 'M40 70C90 70 70 10 180 40', 'M40 70C110 70 110 40 180 40', 'M40 70C110 70 110 40 180 40'];
    const E = 'M40 70H110V40H180';
    const lab = ['arc', 'Bézier', 'S-curve', 'elbow'];
    return demoSvg(dC(40, 70, 6, '#fff') + dC(180, 40, 6, '#fff')
      + `<path fill="none" stroke="${INK}" stroke-width="1.5" d="${P[0]}">${anim('d', 'M40 70Q110 0 180 40;M40 70Q110 0 180 40;M40 70Q110 0 180 40', '0;.5;1')}${anim('opacity', '1;1;0;0;1', '0;.24;.25;.99;1', ' calcMode="discrete"')}</path>`
      + `<path fill="none" stroke="${INK}" stroke-width="1.5" d="${P[1]}" opacity="0">${anim('opacity', '0;1;0;0', '0;.25;.5;1', ' calcMode="discrete"')}</path><g opacity="0">${anim('opacity', '0;1;0;0', '0;.25;.5;1', ' calcMode="discrete"')}<path d="M40 70L90 70M180 40L70 10" stroke="${ACC}" stroke-width=".8" opacity=".6"/><rect x="86" y="66" width="8" height="8" rx="2" fill="#fff" stroke="${ACC}"/><rect x="66" y="6" width="8" height="8" rx="2" fill="#fff" stroke="${ACC}"/></g>`
      + `<path fill="none" stroke="${INK}" stroke-width="1.5" d="${P[2]}" opacity="0">${anim('opacity', '0;0;1;0;0', '0;.5;.5;.75;1', ' calcMode="discrete"')}</path>`
      + `<path fill="none" stroke="${INK}" stroke-width="1.5" d="${E}" opacity="0">${anim('opacity', '0;0;1;1', '0;.75;.75;1', ' calcMode="discrete"')}</path>`
      + lab.map((l, i) => `<text x="110" y="100" class="dlabel" opacity="0">${l}${anim('opacity', [0, 1, 2, 3].map(j => (j === i ? 1 : 0)).concat(i === 0 ? 1 : 0).join(';'), '0;.25;.5;.75;1', ' calcMode="discrete"')}</text>`).join(''));
  },
  fan: () => {
    const S3 = [[40, 22], [40, 55], [40, 88]];
    return demoSvg(S3.map(([x, y], i) => grow(x + 11, y, 154, 55, (.52 + i * .04).toFixed(2), (.7 + i * .04).toFixed(2))).join('') + S3.map(([x, y], i) => dC(x, y) + ringA(x, y, '0;0;1;1;0;0', `0;${(.08 + i * .07).toFixed(2)};${(.12 + i * .07).toFixed(2)};.52;.56;1`)).join('')
      + dB(170, 55) + ringA(170, 55, '0;0;1;0;0', '0;.46;.5;.6;1', 19) + cur('120 100;46 26;46 26;46 59;46 59;46 92;46 92;174 60;174 60;120 100', '0;.08;.12;.15;.19;.22;.26;.44;.6;1') + keyCap(194, 6, keys.wire.toUpperCase(), .28, .62));
  },
  par: () => demoSvg(dC(40, 35) + dC(40, 75) + dC(170, 35) + dC(170, 75) + ringA(40, 35, '0;.9;.9;0', '0;.1;.85;1') + ringA(40, 75, '0;.9;.9;0', '0;.1;.85;1')
    + `<g opacity="0">${anim('opacity', '0;0;.8;.8;0;0', '0;.3;.34;.5;.52;1')}${dL('M51 35H159', '', 1.2).replace(INK, '#12a594').replace('stroke-linecap', 'stroke-dasharray="3 3" stroke-linecap')}${dL('M51 75H159', '', 1.2).replace(INK, '#12a594').replace('stroke-linecap', 'stroke-dasharray="3 3" stroke-linecap')}</g>`
    + grow(51, 35, 159, 35, .5, .7) + grow(51, 75, 159, 75, .52, .72) + cur('120 100;174 39;174 39;174 39;120 100', '0;.3;.5;.8;1') + keyCap(196, 6, keys.dot.toUpperCase(), .2, .8)),
  ports: () => {
    const Y = [[40, 70], [55, 40], [70, 55]], kt = '0;.25;.55;.9;1';
    return demoSvg(dB(55, 55, 40, 56) + dC(180, 55)
      + Y.map(([a, b]) => dL(`M77 ${a}H86L168 55`, anim('d', `M77 ${a}H86L168 55;M77 ${a}H86L168 55;M77 ${b}H86L168 55;M77 ${b}H86L168 55;M77 ${a}H86L168 55`, kt))).join('')
      + `<circle cx="77" cy="40" r="3.4" fill="#fff" stroke="${ACC}" stroke-width="1.5">${anim('cy', '40;40;70;70;40', kt)}</circle>`
      + cur('120 100;81 44;81 74;81 74;120 100', '0;.25;.55;.9;1'));
  },
  chain: () => demoSvg(dC(30, 55) + dC(90, 30) + dC(150, 80) + dC(200, 40) + grow(41, 52, 79, 34, .15, .3) + grow(98, 38, 142, 72, .32, .5) + grow(160, 74, 190, 46, .52, .66) + cur('34 59;34 59;94 34;154 84;204 44;204 44;34 59', '0;.1;.3;.5;.66;.9;1')),
  swap: () => demoSvg(dL('M20 55H200') + `<g>${move('0 0;0 0;80 0;80 0;0 0', '0;.35;.55;.85;1')}${dB(70, 55, 30, 20, '#f6dcd9')}</g><g>${move('0 0;0 0;-80 0;-80 0;0 0', '0;.35;.55;.85;1')}${dC(150, 55, 11, '#dbe8f6')}</g>` + keyCap(100, 8, keys.swap.toUpperCase(), .3, .45)),
  rotate: () => demoSvg(`<g transform="translate(110 55)"><g>${'<animateTransform attributeName="transform" type="rotate" values="0;0;15;15;30;30;45;45;0" keyTimes="0;.15;.2;.4;.45;.65;.7;.9;1" dur="' + DUR + '" repeatCount="indefinite"/>'}<path d="M0 -26L24 16H-24Z" fill="#fff" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/></g></g>` + keyCap(150, 80, ']', .15, .22) + `<text x="110" y="104" class="dlabel">15° per press</text>`),
  compass: () => demoSvg(`<circle cx="70" cy="55" r="3" fill="${INK}"/><circle cx="70" cy="55" r="0" fill="none" stroke="${ACC}" stroke-width="1.2" opacity=".5">${anim('r', '0;0;55;55;0', '0;.2;.6;.9;1')}</circle><circle cx="70" cy="55" r="0" fill="none" stroke="${INK}" stroke-width="1.3" opacity="0">${anim('r', '55;55;55;55', '0;.6;.9;1')}${anim('opacity', '0;0;1;1;0', '0;.6;.62;.92;1')}</circle>` + cur('74 59;74 59;129 59;129 59;74 59', '0;.2;.6;.9;1')),
  construct: () => demoSvg(dL('M30 80L190 30', '', 1.2) + `<circle cx="110" cy="55" r="0" fill="${ACC}">${anim('r', '0;0;5;3.5;3.5;0', '0;.3;.36;.42;.92;1')}</circle><circle cx="80" cy="25" r="3.5" fill="${INK}"/><path d="M80 25L95 72" stroke="${INK}" stroke-width="1.2" stroke-dasharray="50" stroke-dashoffset="50">${anim('stroke-dashoffset', '50;50;0;0;50', '0;.55;.7;.92;1')}</path><circle cx="95" cy="72" r="0" fill="${ACC}">${anim('r', '0;0;3.5;3.5;0', '0;.68;.72;.92;1')}</circle>` + keyCap(160, 78, keys.mid.toUpperCase(), .25, .4) + keyCap(186, 78, keys.perp.toUpperCase(), .5, .65)),
  ray: () => demoSvg(`<defs><linearGradient id="dmr" x1="0" x2="1"><stop offset="0" stop-color="${INK}"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></linearGradient></defs>` + `<circle cx="40" cy="55" r="3.5" fill="${INK}"/><circle cx="140" cy="55" r="3.5" fill="${INK}"/>` + dL('M40 55H140') + `<rect x="144" y="54.3" height="1.4" width="0" fill="url(#dmr)">${anim('width', '0;0;50;50;0', '0;.3;.6;.92;1')}</rect>`),
  laser: () => demoSvg(`<path d="M30 80C60 20 100 20 120 55S180 90 195 30" fill="none" stroke="#ff4040" stroke-width="3" stroke-linecap="round" stroke-dasharray="260" stroke-dashoffset="260" opacity=".8">${anim('stroke-dashoffset', '260;0;0;-260', '0;.5;.6;1')}</path>`),
  prop: () => demoSvg(`<rect x="60" y="20" height="70" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.3" width="40">${anim('width', '40;40;100;70;70;40', '0;.1;.4;.5;.9;1')}</rect>` + keyCap(150, 8, '⇧', .45, .9) + cur('100 90;100 90;160 90;130 90;130 90;100 90', '0;.1;.4;.5;.9;1')),
  centre: () => demoSvg(`<circle cx="110" cy="55" r="2" fill="${ACC}"/><rect rx="3" fill="#fff" fill-opacity=".6" stroke="${INK}" stroke-width="1.3" x="110" y="55" width="0" height="0">${anim('x', '110;110;60;60;110', '0;.15;.6;.9;1')}${anim('y', '55;55;25;25;55', '0;.15;.6;.9;1')}${anim('width', '0;0;100;100;0', '0;.15;.6;.9;1')}${anim('height', '0;0;60;60;0', '0;.15;.6;.9;1')}</rect>` + keyCap(186, 8, ALT, .1, .9) + cur('110 55;110 55;160 85;160 85;110 55', '0;.15;.6;.9;1')),
  spmove: () => demoSvg(`<g>${move('0 0;0 0;0 0;50 0;50 0;0 0', '0;.1;.4;.7;.9;1')}<rect x="40" y="30" height="50" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.3" width="0">${anim('width', '0;0;60;60;60;0', '0;.1;.4;.7;.9;1')}</rect></g>` + keyCap(160, 8, 'Space', .4, .7) + cur('40 30;40 30;100 80;150 80;150 80;40 30', '0;.1;.4;.7;.9;1')),
  dup: () => demoSvg(dB(70, 55) + `<g opacity=".95">${move('0 0;0 0;80 0;80 0;0 0', '0;.25;.55;.85;1')}${anim('opacity', '0;0;.95;.95;0', '0;.24;.3;.85;1')}${dB(70, 55)}<circle cx="86" cy="45" r="6" fill="${ACC}"/><path d="M83.5 45h5M86 42.5v5" stroke="#fff" stroke-width="1.4"/></g>` + cur('74 59;74 59;154 59;154 59;74 59', '0;.25;.55;.85;1')),
  nb: () => demoSvg(dL('M60 55L120 25M60 55L120 85M120 25L180 55') + dC(60, 55, 11, '#f6dcd9') + dC(120, 25) + dC(120, 85) + dC(180, 55)
    + [[120, 25], [120, 85]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${ACC}" stroke-width="2" opacity="0">${anim('opacity', '0;0;.9;0;.9;0;0', '0;.2;.3;.5;.6;.8;1')}${anim('r', '14;14;14;20;14;20;14', '0;.2;.3;.5;.6;.8;1')}</circle>`).join('') + keyCap(186, 8, IS_MAC ? '⌘' : 'Ctrl', .2, .85)),
  rdrag: () => demoSvg(dC(60, 35) + dC(60, 75) + dB(170, 55) + `<rect x="35" y="15" fill="rgba(91,91,214,.08)" stroke="${ACC}" stroke-dasharray="4 3" width="0" height="0">${anim('width', '0;0;50;50;0;0', '0;.1;.35;.45;.46;1')}${anim('height', '0;0;80;80;0;0', '0;.1;.35;.45;.46;1')}</rect>` + ringA(60, 35, '0;0;1;1;0', '0;.35;.38;.9;1') + ringA(60, 75, '0;0;1;1;0', '0;.35;.38;.9;1') + grow(71, 35, 154, 52, .6, .75) + grow(71, 75, 154, 58, .62, .77) + cur('35 15;35 15;85 95;85 95;174 59;174 59;35 15', '0;.1;.35;.45;.58;.9;1')),
  zoom: () => demoSvg(`<g transform="translate(110 55)"><g>${'<animateTransform attributeName="transform" type="scale" values="1;1;1.5;1.5;1" keyTimes="0;.2;.5;.8;1" dur="' + DUR + '" repeatCount="indefinite"/>'}<g transform="translate(-110 -55)">${dB(80, 55)}${dC(140, 55)}${dL('M95 55H129')}</g></g></g>` + keyCap(10, 8, IS_MAC ? '⌘' : 'Ctrl', .2, .8)),
};
const GUIDE_KEYS = () => [
  ['select', [keys.select], 'Select and move', 'Click to select, drag to move. Drag on empty canvas to box-select; press V again to lasso. Click the selected shape again (or right-click) for its style bar; double-click to write in it.'],
  ['hand', [keys.hand, 'Space'], 'Hand / pan', 'Drag anywhere to move around. Holding Space does the same from any tool; two fingers on a trackpad too.'],
  ['shapes', [keys.circle, keys.rect, keys.tri, keys.diamond], 'Shapes', 'Click for the default size, or drag a box. The bar above the dock sets fill, border, direction (triangle), proportions (diamond) and corners.'],
  ['dot', [keys.dot], 'Dots', 'A small filled point: click to place, sizes and colours in the bar. Lines snap to it like to any shape.'],
  ['text', [keys.text], 'Text and maths', 'Or double-click the canvas. $…$, \\[…\\] and \\begin{pmatrix}…\\end{pmatrix} are typeset as LaTeX.'],
  ['wire', [keys.edge], 'Connect', 'Drag from one shape to another, or click one and then the other. Dropping in empty space makes a new shape. Drag the middle dot to bend.'],
  ['route', [keys.edge], 'Curve types', 'With a line selected: arc, Bézier (two handles), S-curve, elbow or rounded elbow. For new lines: ⋯ in the connector bar → Path.'],
  ['fan', [keys.wire, 'hold'], 'Connect many at once', `Select shapes, hold ${keys.wire.toUpperCase()} and click a target: each selected shape gets a line to it (keep holding for more). In the connector tool: 2+ selected and click; ⇧ keeps the sources, ${IS_MAC ? '⌘' : 'Ctrl'}-click adds or drops one.`],
  ['par', [keys.dot, 'hold'], 'Parallel lines', `Select shapes, hold ${keys.dot.toUpperCase()} and click a target: the nearest source goes there, every other one to the shape at the same offset. A quick tap of ${keys.dot.toUpperCase()} is still the Dot tool.`],
  ['swap', [keys.swap], 'Swap two shapes', 'Select exactly two shapes and press W: they trade places, lines follow.'],
  ['rotate', [keys.rotL, keys.rotR], 'Rotate by 15°', 'Turns the selection; or drag the dot above it (snaps every 15°).'],
  ['compass', [keys.compass], 'Compass', 'Press on a centre (a shape, or any point) and drag to the circle, or click the centre and then a point. Built on shapes, the circle follows them when they move.'],
  ['construct', [keys.mid, keys.perp, keys.pbis], 'Constructions', `Select a line (or two points) for the midpoint ${keys.mid.toUpperCase()} or perpendicular bisector ${keys.pbis.toUpperCase()}; a point and a line for the perpendicular ${keys.perp.toUpperCase()}, parallel ${keys.par.toUpperCase()} or reflection ${keys.refl.toUpperCase()}; two lines or circles for the intersection ${keys.inter.toUpperCase()}. Or right-click. Built points follow their objects and cannot be dragged; restyle them, or build on them again.`],
  ['ray', [keys.edge], 'Rays', 'With a line selected: the ray ends in the arrow row (or Start / End heads). The line runs one grid step past its last point and fades, in LaTeX too.'],
  ['laser', [keys.laser], 'Laser pointer', 'For presenting: a glowing dot or a fading trail (pick in its bar).'],
];
const GUIDE_MODS = () => [
  ['prop', ['⇧', 'drag'], 'In proportion', 'While drawing: square, circle, square diamond, equilateral triangle. While resizing: keeps the shape’s proportions.'],
  ['centre', [ALT, 'drag'], 'From the centre', 'While drawing or resizing, the shape grows around its centre instead of from a corner.'],
  ['spmove', ['Space', 'drag'], 'Move while drawing', 'Keep the mouse down, hold Space and move: the shape being drawn moves; let go of Space to size it again.'],
  ['dup', [ALT, 'drag'], 'Duplicate while moving', 'Drag a selected shape with Option / Alt held: a copy goes where you drop it.'],
  ['ports', ['drag'], 'Line ends on shapes', 'Select a shape or line: a dot sits where each line meets it. Drag it along the shape to change its place, order or side, onto another shape to reconnect, or into empty space to leave it loose. Near a shape a line snaps on and shows where it will land. Right-click a shape to spread its ports evenly, pack them to both ends or join them in the middle.'],
  ['chain', ['drag'], 'Through several shapes', 'In the connector tool, a stroke that runs through shapes connects them in that order.'],
  ['nb', [IS_MAC ? '⌘' : 'Ctrl', 'hold'], 'Show neighbours', 'Hold it with shapes selected: everything wired to them pulses, one colour per selected shape.'],
  ['rdrag', ['Right', 'drag'], 'Box-select in the connector tool', 'Hold the right button and drag a box: those shapes become sources, then click a target. A plain right-click still opens the menu.'],
  ['zoom', [IS_MAC ? '⌘' : 'Ctrl', 'scroll'], 'Zoom', `Or pinch. ${keys.fit.toUpperCase()} fits everything, ${IS_MAC ? '⌘' : 'Ctrl'}0 goes to 100%.`],
];
function guideHTML() {
  const word = k => ['drag', 'click', 'scroll', 'hold'].includes(k);
  const card = ([demo, ks, title, desc]) => `<article class="gcard"><div class="gdemo">${DEMOS[demo]()}</div>
    <div class="gtitle"><span>${title}</span><span class="gkeys">${ks.map(k => word(k) ? `<span class="gplus">${k}</span>` : cap(keyLabel(k))).join('')}</span></div><p>${esc(desc)}</p></article>`;
  const minimal = String.raw`\documentclass{article}
\usepackage{tikz}
\usetikzlibrary{arrows.meta, shapes.geometric}

\begin{document}
\begin{figure}[h]
  \centering
  % pasted from Figura: Export > TikZ > Copy
  \begin{tikzpicture}[
    x=0.66667pt,
    y=-0.66667pt,
    oval/.style={ellipse, minimum width=28pt, minimum height=28pt, draw, line width=0.93pt}]
    \node[oval] (a) at (20,20)  {$q_0$};
    \node[oval] (b) at (140,20) {$q_1$};
    \draw[line width=0.93pt, -{Straight Barb}] (a) -- node[auto] {$a$} (b);
  \end{tikzpicture}
  \caption{Pasted from Figura}
\end{figure}
\end{document}`;
  const M = IS_MAC ? '⌘' : 'Ctrl';
  return `<div class="guide">
    <nav class="gnav">${[['g-latex', 'Use in LaTeX'], ['g-io', 'Import & export'], ['g-keys', 'Keys'], ['g-mods', 'Mouse & modifiers']].map(([id, l], i) => `<button data-go="${id}" class="${i ? '' : 'on'}">${l}</button>`).join('')}</nav>
    <div class="gmain" id="gmain">
      <section id="g-latex"><h3>Use in LaTeX</h3><p class="glead">Plain TikZ, nothing else to install. The result looks like the canvas.</p>
        <ol class="gsteps">
          <li><div class="gnum">1</div><div class="gstep"><h4>Load TikZ in the preamble</h4><p>The export’s first line names the libraries it uses; most pictures need only these. Works on TeX Live, MiKTeX and Overleaf.</p>${codeBlock('\\usepackage{tikz}\n\\usetikzlibrary{arrows.meta, shapes.geometric}', 'gc-use')}</div></li>
          <li><div class="gnum">2</div><div class="gstep"><h4>Paste the picture</h4><p><b>Export</b> → TikZ → <b>Copy</b>, and paste where the figure goes. Shared looks sit as short styles at the top, so it is easy to edit by hand. A complete example:</p>${codeBlock(minimal, 'gc-min')}
            <p class="gnote">Want shorter code? <b>Export</b> → figura.sty writes <code>fg box</code>, <code>fg line</code>… and needs the style file:</p>
            <div class="grow2"><button class="btn ghost sm" data-sty="dl">${DL_IC}<span>Download figura.sty</span></button><button class="btn ghost sm" data-sty="copy">${IC.copy}<span>Copy its contents</span></button></div></div></li>
        </ol></section>
      <section id="g-io"><h3>Import & export</h3>
        <div class="gio">
          <div class="giocard"><div class="gioi">${DL_IC}</div><h4>TikZ</h4><p>Needs only <code>\\usepackage{tikz}</code>: shared looks as short styles, colours defined once. Paste it back onto the canvas (${cap(M)}${cap('V')}) or open the .tex to edit it again.</p><button class="linkbtn" data-goexp="tikz">Open TikZ export</button></div>
          <div class="giocard"><div class="gioi">${DL_IC}</div><h4>figura.sty</h4><p>Shorter code (<code>fg box</code>, <code>fg line</code>) for documents that load the style file.</p><button class="linkbtn" data-goexp="tex">Open figura.sty export</button></div>
          <div class="giocard"><div class="gioi">${DL_IC}</div><h4>Image</h4><p>PNG (2–4×, copy or download) or SVG, white or transparent; formulas set in TeX fonts.</p><button class="linkbtn" data-goexp="img">Open image export</button></div>
          <div class="giocard"><div class="gioi">${IC.copy}</div><h4>Import</h4><p>Paste or drop <code>.tex</code>: Figura’s own export and hand-written <code>tikzpicture</code>s (nodes, <code>--</code>, <code>to[bend …]</code>, <code>.. controls ..</code>, loops, labels, colours like <code>blue!20</code>).</p></div>
          <div class="giocard"><div class="gioi">${DL_IC}</div><h4>Files</h4><p>${cap(M)}${cap('S')} saves every page as a <code>.figura</code> file; ${cap(M)}${cap('O')} or dropping it opens it again.</p><button class="linkbtn" data-goexp="file">Open file export</button></div>
        </div></section>
      <section id="g-keys"><h3>Keys</h3><p class="glead">Single keys. Every one can be changed in the Shortcuts tab — the cards follow your keys.</p><div class="ggrid">${GUIDE_KEYS().map(card).join('')}</div>
        <div class="gmore">${[[keys.lock, 'Lock page'], [keys.grid, 'Grid: dots → half → free'], [keys.fit, 'Fit everything'], [keys.help, 'This help'], ['Esc', 'One step back']].map(([k, l]) => `<span>${cap(keyLabel(k))}${l}</span>`).join('')}</div></section>
      <section id="g-mods"><h3>Mouse & modifiers</h3><div class="ggrid">${GUIDE_MODS().map(card).join('')}</div>
        <div class="gmore">${[[`${M} Z`, 'Undo'], [`⇧ ${M} Z`, 'Redo'], [`${M} C / V`, 'Copy, paste'], [`${M} D`, 'Duplicate'], [`${M} A`, 'Select all'], [`${M} ] / [`, 'Forward / backward'], ['Enter', 'Write / label'], ['← ↑ → ↓', 'Nudge']].map(([k, l]) => `<span>${k.split(' ').map(t => (t === '/' ? '<span class="gsep">/</span>' : cap(t))).join('')}${l}</span>`).join('')}</div></section>
    </div></div>`;
}
function wireGuide(body) {
  const main = body.querySelector('#gmain'), nav = body.querySelector('.gnav');
  nav.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) main.querySelector('#' + b.dataset.go).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  main.addEventListener('scroll', () => {
    const secs = [...main.querySelectorAll('section')], top = main.getBoundingClientRect().top + 40;
    let cur0 = secs[0].id; secs.forEach(s2 => { if (s2.getBoundingClientRect().top <= top) cur0 = s2.id; });
    nav.querySelectorAll('[data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === cur0));
  }, { passive: true });
}

/* ---------- shortcuts: [id, group, what it does, default key, action] ---------- */
const ACTIONS = [
  ['select', 'Tools', 'Select / move · again: box ↔ lasso', 'v', () => setTool('select', true)],
  ['hand', 'Tools', 'Hand (or hold Space)', 'h', () => setTool('hand', true)],
  ['circle', 'Tools', 'Circle', 'o', () => setTool('circle', true)],
  ['rect', 'Tools', 'Box', 'r', () => setTool('rect', true)],
  ['tri', 'Tools', 'Triangle', 'y', () => setTool('tri', true)],
  ['diamond', 'Tools', 'Diamond', 'd', () => setTool('diamond', true)],
  ['dot', 'Tools', 'Dot · hold with shapes selected: parallel lines', 'p', () => setTool('dot', true)],
  ['text', 'Tools', 'Text (or double-click the canvas)', 't', () => setTool('text', true)],
  ['edge', 'Tools', 'Connector · again: line style', 'e', () => setTool('edge', true)],
  ['image', 'Tools', 'Picture (or paste / drop one)', 'i', () => setTool('image', true)],
  ['laser', 'Tools', 'Laser pointer', 'l', () => setTool('laser', true)],
  ['compass', 'Tools', 'Compass: centre, then a point on the circle', 'c', () => setTool('compass', true)],
  ['wire', 'Connect', 'Hold with shapes selected: connect them to what you click', 's', () => {}],
  ['mid', 'Construct', 'Midpoint (a line, or two points)', 'm', () => construct('mid')],
  ['perp', 'Construct', 'Perpendicular from a point to a line', 'j', () => construct('perp')],
  ['pbis', 'Construct', 'Perpendicular bisector (a line, or two points)', 'b', () => construct('pbis')],
  ['par', 'Construct', 'Parallel line through a point', 'n', () => construct('par')],
  ['inter', 'Construct', 'Intersection (lines / circles)', 'x', () => construct('inter')],
  ['refl', 'Construct', 'Reflect a point in a line', 'u', () => construct('refl')],
  ['ctr', 'Construct', 'Centre point of a shape', 'q', () => construct('ctr')],
  ['swap', 'Edit', 'Swap two selected shapes', 'w', () => swapNodes()],
  ['rotL', 'Edit', 'Rotate −15°', '[', () => rotSel(-15)],
  ['rotR', 'Edit', 'Rotate +15°', ']', () => rotSel(15)],
  ['lock', 'View', 'Lock / unlock the page', 'k', () => toggleLock()],
  ['grid', 'View', 'Grid: dots → half → free', 'g', () => setGrid({ dots: 'half', half: 'free', free: 'dots' }[prefs.grid], true)],
  ['fit', 'View', 'Fit everything', 'f', () => fit()],
  ['zin', 'View', 'Zoom in', '=', () => zoomAt(1.2, innerWidth / 2, innerHeight / 2)],
  ['zout', 'View', 'Zoom out', '-', () => zoomAt(1 / 1.2, innerWidth / 2, innerHeight / 2)],
  ['help', 'View', 'Help and shortcuts', '?', () => openHelp()],
];
const FIXED = [
  ['Draw', 'In proportion: square, circle, square diamond, equilateral triangle', '⇧ + drag'],
  ['Draw', 'Draw or resize from the centre', `${ALT} + drag`],
  ['Draw', 'Move the shape while drawing it', 'Space while dragging'],
  ['Connect', 'Connect many to one (2+ selected, connector tool)', 'Click the target'],
  ['Connect', '…keep the sources for more targets', '⇧ + click'],
  ['Connect', 'Add / drop a source', `${IS_MAC ? '⌘' : 'Ctrl'} + click`],
  ['Connect', 'Wire every shape a stroke passes', 'Drag through'],
  ['Connect', 'Box-select in the connector tool', 'Right-drag'],
  ['Connect', 'Line from two clicks (shapes or empty spots) · self-loop: the same shape twice', 'Click, click'],
  ['Connect', 'Bend / Bézier handles / elbow step', 'Drag the dots on a selected line'],
  ['Connect', 'Move a line end along a shape, onto another, or off it', 'Drag its end dot'],
  ['Connect', 'Ports evenly · packed to the ends · in the middle', 'Right-click a shape'],
  ['Edit', 'Show wired neighbours', `Hold ${IS_MAC ? '⌘' : 'Ctrl'}`],
  ['Edit', 'Duplicate while moving', `${ALT} + drag`],
  ['Edit', 'Add to the selection', '⇧ + click'],
  ['Edit', 'Write in a shape / label a line', 'Double-click · Enter'],
  ['Edit', 'Undo · redo', `${IS_MAC ? '⌘' : 'Ctrl'}Z · ⇧${IS_MAC ? '⌘' : 'Ctrl'}Z`],
  ['Edit', 'Copy · paste · duplicate', `${IS_MAC ? '⌘' : 'Ctrl'}C · V · D`],
  ['Edit', 'Bold · italic · underline', `${IS_MAC ? '⌘' : 'Ctrl'}B · I · U`],
  ['Edit', 'Forward / backward · to front / back', `${IS_MAC ? '⌘' : 'Ctrl'}] [ · ⇧${IS_MAC ? '⌘' : 'Ctrl'}] [`],
  ['Edit', 'Nudge · delete', '← ↑ → ↓ · ⌫'],
  ['View', 'Zoom', `${IS_MAC ? '⌘' : 'Ctrl'} + scroll · pinch`],
  ['View', 'Export / open pages', `${IS_MAC ? '⌘' : 'Ctrl'}S · ${IS_MAC ? '⌘' : 'Ctrl'}O`],
  ['View', 'Rename a page', 'Double-click its tab'],
  ['View', 'Move the toolbar', 'Drag its grip'],
];
const KEYS_LS = 'figura-keys-v1';
const RESERVED = new Set([' ', 'escape', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'tab', 'shift', 'meta', 'control', 'alt', 'capslock', 'delete', 'backspace', 'enter']);
let keys = {};
function loadKeys() { keys = Object.fromEntries(ACTIONS.map(a => [a[0], a[3]])); Object.assign(keys, lsGet(KEYS_LS) || {}); }
const saveKeys = () => lsSet(KEYS_LS, keys);
const keyLabel = k => ({ backspace: '⌫', enter: '↵', ' ': 'Space', '-': '−' }[k] || (k && k.length === 1 ? k.toUpperCase() : k || '—'));
const actionOf = k => { if (k === '+') k = '='; if (k === '_') k = '-'; const a = ACTIONS.find(x => keys[x[0]] === k); return a ? a[0] : null; };
const LOCK_OK = new Set(['select', 'hand', 'laser', 'lock', 'grid', 'fit', 'zin', 'zout', 'help']);
function rotSel(d) { if (selNodes().length) mutate(() => forNodes(n => { n.rot = Math.round(((n.rot || 0) + d) / 15) * 15; n.rot = ((n.rot + 540) % 360) - 180; })); }
function updateKbd() {
  let stK; try { stK = new Set(curItems().filter(x => typeof x === 'object' && x.key).map(x => x.key)); } catch { stK = new Set(); }
  $$('#dock .tool[data-tool]').forEach(b => {
    if (b.classList.contains('stamp')) return;
    const kb = b.querySelector('kbd'), k = keys[b.dataset.tool]; if (!k) return;
    if (kb) kb.textContent = stK.has(k) ? '' : keyLabel(k);
    b.title = b.title.replace(/\(([^ ,·)]+)/, `(${keyLabel(k)}`);
  });
}
loadKeys();

let helpTab = 'guide', recording = null;
function openHelp(tab) {
  if (tab === 'guide' || tab === 'keys') helpTab = tab;
  closePP(); closeMenu();
  const box = $('#modal .mbox');
  box.classList.add('help');
  box.innerHTML = `<div class="ehead"><h2>Help</h2>${seg('htab', helpTab, [['guide', 'Guide'], ['keys', 'Shortcuts']])}<span class="grow"></span><button class="ibtn" data-x title="Close (Esc)">${IC.close}</button></div><div id="helpBody" class="hbody"></div>`;
  $('#modal').hidden = false; initSegs($('.ehead', box));
  box.onclick = async e => {
    if (e.target.closest('[data-x]')) { closeModal(); return; }
    const t = e.target.closest('[data-a="htab"]');
    if (t && t.dataset.v !== helpTab) { helpTab = t.dataset.v; $$('.ehead .seg button', box).forEach(b => b.classList.toggle('on', b === t)); syncPill($('.ehead .seg', box), t); drawHelp(); return; }
    const rb = e.target.closest('[data-rebind]'); if (rb) { startRecording(rb); return; }
    if (e.target.closest('[data-kreset]')) { keys = Object.fromEntries(ACTIONS.map(a => [a[0], a[3]])); saveKeys(); updateKbd(); drawHelp(); toast('Shortcuts back to the defaults'); return; }
    const cp = e.target.closest('[data-copy]');
    if (cp) { const tx = box.querySelector('#' + cp.dataset.copy).textContent; try { await navigator.clipboard.writeText(tx); cp.querySelector('span').textContent = 'Copied ✓'; setTimeout(() => { if (cp.isConnected) cp.querySelector('span').textContent = 'Copy'; }, 1300); } catch { toast('Could not copy'); } return; }
    const st = e.target.closest('[data-sty]');
    if (st) { if (st.dataset.sty === 'dl') download('figura.sty', new Blob([styText()], { type: 'text/x-tex' })); else { try { await navigator.clipboard.writeText(styText()); toast('figura.sty copied'); } catch { toast('Could not copy'); } } return; }
    const ge = e.target.closest('[data-goexp]'); if (ge) { closeModal(); openExport(ge.dataset.goexp); }
  };
  drawHelp();
  requestAnimationFrame(() => syncPill($('.ehead .seg', box), $('.ehead .seg button.on', box)));
}
function drawHelp() {
  const body = $('#helpBody'); if (!body) return;
  body.classList.remove('in'); void body.offsetWidth; body.classList.add('in');
  if (helpTab === 'keys') body.innerHTML = keysTable();
  else { body.innerHTML = guideHTML(); wireGuide(body); }
}
function keysTable() {
  const groups = ['Tools', 'Draw', 'Connect', 'Edit', 'View'];
  const rows = g => [
    ...ACTIONS.filter(a => a[1] === g).map(a => `<tr><td>${a[2]}</td><td class="kc"><button class="kbtn${keys[a[0]] !== a[3] ? ' custom' : ''}" data-rebind="${a[0]}" title="Click, then press a new key">${keyLabel(keys[a[0]])}</button></td></tr>`),
    ...FIXED.filter(f => f[0] === g).map(f => `<tr class="fixed"><td>${f[1]}</td><td class="kc"><span class="kfix">${f[2]}</span></td></tr>`),
  ].join('');
  const custom = ACTIONS.some(a => keys[a[0]] !== a[3]);
  return `<div class="ktop"><span class="muted">Click a key to change it, then press the new key (Esc cancels). A key already in use swaps over.</span><span class="grow"></span>${custom ? '<button class="tbtn" data-kreset>Reset to defaults</button>' : ''}</div>
    <table class="ktable">${groups.map(g => `<tbody><tr class="kgroup"><th colspan="2">${g}</th></tr>${rows(g)}</tbody>`).join('')}</table>`;
}
function startRecording(btn) {
  if (recording) recording.btn.classList.remove('rec');
  recording = { btn, id: btn.dataset.rebind }; btn.classList.add('rec'); btn.textContent = 'Press a key…';
}
addEventListener('keydown', e => {
  if (!recording) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const { id, btn } = recording, k = e.key.toLowerCase();
  if (k === 'escape') { recording = null; btn.classList.remove('rec'); btn.textContent = keyLabel(keys[id]); return; }
  if (['shift', 'meta', 'control', 'alt'].includes(k)) return;
  if (e.metaKey || e.ctrlKey || RESERVED.has(k) || /^[0-9]$/.test(k)) { toast('That key is reserved — try another'); return; }
  recording = null;
  const other = ACTIONS.find(a => a[0] !== id && keys[a[0]] === k);
  if (other) { keys[other[0]] = keys[id]; toast(`Swapped with “${other[2].split(' ·')[0]}”`); }
  keys[id] = k; saveKeys(); updateKbd(); drawHelp();
}, true);
updateKbd();
$('#btnHelp').addEventListener('click', () => openHelp());

/* ================= toast ================= */
let toastT = 0;
function toast(msg, ms = 2200) { const t = $('#toast'); t.textContent = msg; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), ms); }

/* ================= boot ================= */
$('.logo').innerHTML = IC.logo;
for (const [id, ic] of [['zUndo', 'undo'], ['zRedo', 'redo'], ['zOut', 'zout'], ['zIn', 'zin'], ['zFit', 'fit'], ['btnOpen', 'open'], ['btnExport', 'exp'], ['btnSet', 'gear'], ['btnHelp', 'help'], ['btnLock', 'lock']]) $('#' + id).innerHTML = IC[ic];
$('#tabs .tadd').innerHTML = IC.plus;
$('#btnLock').onclick = () => toggleLock();
for (const b of $$('#gridSeg button')) b.innerHTML = IC[b.dataset.g];
$('#zUndo').onclick = undo; $('#zRedo').onclick = redo; $('#zFit').onclick = fit;
$('#zIn').onclick = () => zoomAt(1.2, innerWidth / 2, innerHeight / 2); $('#zOut').onclick = () => zoomAt(1 / 1.2, innerWidth / 2, innerHeight / 2);
$('#zPct').onclick = zoom100;
$('#dock').addEventListener('click', e => { const b = e.target.closest('.tool'); if (b) { setTool(b.dataset.tool, 'click'); if (e.detail) b.blur(); } });   // no focus left behind: Space (pan) would press it again
document.querySelector('.top')?.addEventListener('click', e => { const b = e.target.closest('button'); if (b && e.detail) b.blur(); });
$('#dock').addEventListener('contextmenu', e => { e.preventDefault(); dockMenu(e.clientX, e.clientY, e.target.closest('.tool')); });
document.addEventListener('pointerdown', e => { if (subPeek && !e.target.closest('#sub, #dock')) { subPeek = false; drawSub(); } }, true);
$('#dock').addEventListener('pointerdown', e => e.stopPropagation());
addEventListener('resize', () => { applyDockSide(); applyCam(); placeSub(); });

/* ================= toolbar layouts: order, hidden buttons, own buttons ("stamps": a tool with a saved look), presets ================= */
const TOOL_NAMES = { select: 'Select', hand: 'Hand', circle: 'Circle', rect: 'Box', tri: 'Triangle', diamond: 'Diamond', dot: 'Dot', text: 'Text', edge: 'Connector', compass: 'Compass', image: 'Image', laser: 'Laser pointer' };
const TOOL_MORE = { select: ' · again: box ↔ lasso', hand: ', or hold Space' };
const ZXC = { z: '#d8f8d8', x: '#e8a5a5', h: '#ffffbf', he: '#4488cc' };
const SYS_DOCKS = [
  { id: 'general', name: 'General', items: ['select', 'hand', '|', 'circle', 'rect', 'tri', 'diamond', 'dot', 'text', 'edge', 'compass', 'image', '|', 'laser'] },
  { id: 'zx', name: 'ZX-calculus', items: ['select', 'hand', '|',
    { id: 'zx-z', k: 'circle', name: 'Z spider', key: 'z', s: { fill: ZXC.z, stroke: '#1d1d1f', sw: 1, w: 22, h: 22, ts: { size: 11 } } },
    { id: 'zx-x', k: 'circle', name: 'X spider', key: 'x', s: { fill: ZXC.x, stroke: '#1d1d1f', sw: 1, w: 22, h: 22, ts: { size: 11 } } },
    { id: 'zx-h', k: 'rect', name: 'Hadamard box', key: 'h', s: { fill: ZXC.h, stroke: '#1d1d1f', sw: 1, w: 14, h: 14, rad: 0, ts: { size: 10 } } },
    { id: 'zx-n', k: 'dot', name: 'Wire point', key: 'n', s: { fill: '#6e7581', w: 5, h: 5 } },
    { id: 'zx-p', k: 'dot', name: 'Dot', key: 'd', s: { fill: '#1d1d1f', w: 6, h: 6 } },
    'text',
    { id: 'zx-b', k: 'rect', name: 'Box', key: 'b', s: { fill: '#ffffff', stroke: '#1d1d1f', sw: 1, w: 40, h: 30, rad: 0, text: 'U' } },
    '|',
    { id: 'zx-w', k: 'edge', name: 'Wire', key: 'e', s: { head: 'none', tail: 'none', dash: 'solid', shape: 'line', sw: 1.4, color: '#1d1d1f' } },
    { id: 'zx-he', k: 'edge', name: 'Hadamard edge', key: 'w', s: { head: 'none', tail: 'none', dash: 'dash', shape: 'line', sw: 1.6, color: ZXC.he } },
    '|', 'laser'] },
  { id: 'cat', name: 'Category theory', items: ['select', 'hand', '|',
    { id: 'ct-o', k: 'text', name: 'Object', key: 'o', s: { text: '$A$', ts: { size: 15 } } },
    'dot', '|',
    { id: 'ct-ar', k: 'edge', name: 'Arrow', key: 'e', s: { head: 'vee', tail: 'none', dash: 'solid', shape: 'line' } },
    { id: 'ct-mono', k: 'edge', name: 'Mono ↪', s: { head: 'vee', tail: 'hook', dash: 'solid', shape: 'line' } },
    { id: 'ct-epi', k: 'edge', name: 'Epi ↠', s: { head: 'two', tail: 'none', dash: 'solid', shape: 'line' } },
    { id: 'ct-dash', k: 'edge', name: 'Dashed arrow (unique / exists)', s: { head: 'vee', tail: 'none', dash: 'dash', shape: 'line' } },
    { id: 'ct-maps', k: 'edge', name: 'Maps to ↦', s: { head: 'vee', tail: 'bar', dash: 'solid', shape: 'line' } },
    { id: 'ct-2', k: 'edge', name: '2-cell ⇒', s: { head: 'vee', tail: 'none', dash: 'solid', shape: 'double' } },
    { id: 'ct-eq', k: 'edge', name: 'Equals', s: { head: 'none', tail: 'none', dash: 'solid', shape: 'double' } },
    '|', 'rect', 'circle', 'text', '|', 'laser'] },
];
const STAMP_KINDS = ['circle', 'rect', 'tri', 'diamond', 'dot', 'text', 'edge'];
let docks = (() => { const d = lsGet(LS.docks); return d && Array.isArray(d.user) ? d : { cur: 'general', user: [] }; })();
/* a dock order saved before layouts existed becomes your own copy of General */
if (!lsGet(LS.docks) && ORD.dock) {
  const out = []; let run = [];
  const flush = () => { out.push(...ordSort(run, x => x, ORD.dock)); run = []; };
  for (const it of SYS_DOCKS[0].items) { if (it === '|') { flush(); out.push('|'); } else run.push(it); } flush();
  if (out.join() !== SYS_DOCKS[0].items.join()) { docks.user.push({ id: 'u' + uid(), name: 'General (mine)', items: out }); docks.cur = docks.user[0].id; }
}
const saveDocks = () => lsSet(LS.docks, docks);
const allDocks = () => [...SYS_DOCKS.map(x => ({ ...x, sys: true })), ...docks.user];
const curDock = () => allDocks().find(x => x.id === docks.cur) || { ...SYS_DOCKS[0], sys: true };
const curItems = () => curDock().items;
const itemKey = it => (typeof it === 'string' ? it : 'st:' + it.id);
const stampById = id => curItems().find(x => typeof x === 'object' && x.id === id) || null;
let stamp = null;   // the own button in use: tool is its kind, new objects take its look
const tidySeps = d => { d.items = d.items.filter((x, i, a) => x !== '|' || (i > 0 && i < a.length - 1 && a[i - 1] !== '|')); };
const uniqueDockName = n => { let s = n, i = 2; while (allDocks().some(d => d.name.toLowerCase() === s.toLowerCase())) s = `${n} ${i++}`; return s; };
/* change the layout in use; a system layout is copied first, so the presets stay as they are */
function editDock(fn, quiet) {
  let d = curDock();
  if (d.sys) {
    const c = { id: 'u' + uid(), name: uniqueDockName(d.name + ' (mine)'), items: clone(d.items), subs: clone(d.subs || {}) };
    docks.user.push(c); docks.cur = c.id; d = c;
    if (!quiet) toast(`Saved as your own layout “${c.name}”`);
  }
  fn(d); tidySeps(d); saveDocks(); renderDock(); drawSub(true); if (dockEd) drawDockEd();
  return d;
}
function switchDock(id) {
  if (!allDocks().some(d => d.id === id) || id === docks.cur) return;
  const from = dockEl.getBoundingClientRect();
  docks.cur = id; saveDocks(); stamp = null; renderDock(true);
  if (!curItems().includes(tool)) setTool('select'); else setTool(tool);
  if (dockEd) drawDockEd();
  void from;
}
/* the dock icon of an own button: its shape in its colours, its line with its ends, its text */
const inkOr = c => (!c || lc(c) === '#1d1d1f' ? 'currentColor' : c);
const glyphOf = t => (t || '').replace(/\$|\\[a-zA-Z]+|[{}_^]/g, '').trim().slice(0, 2);
function stampIc(st, size = 18) {
  const s = st.s || {}, k = st.k;
  if (k === 'edge') { const ic = edgeToolIc({ ...s, sw: s.sw || 1.4 }); const c = inkOr(s.color); return c === 'currentColor' ? ic : ic.replace('<svg', `<svg style="color:${c}"`); }
  if (k === 'dot') { const r = clamp((s.w || 8) * .42, 2, 5.5); return sv(`<circle cx="12" cy="12" r="${f2(r)}" fill="${inkOr(s.fill)}" stroke="none"/>`, size); }
  if (k === 'text') { const ts = s.ts || {}; return sv(`<text x="12" y="16.6" font-size="${glyphOf(s.text).length > 1 ? 11 : 14}" text-anchor="middle" fill="${inkOr(ts.color)}" stroke="none" font-family="KaTeX_Main,'Latin Modern Roman',serif" font-style="${/\$/.test(s.text || '') ? 'italic' : 'normal'}" font-weight="${ts.bold ? 700 : 400}">${esc(glyphOf(s.text) || 'T')}</text>`, size); }
  const fill = s.fill && s.fill !== 'none' ? s.fill : 'none', stroke = s.stroke === 'none' ? 'none' : inkOr(s.stroke);
  const pt = s.sd && s.sd !== 'solid' ? dashPat(s.sd) : null, sw = clamp((s.sw ?? 1.5) * .95, 1, 2.2);
  const da = pt ? (pt[0] ? `stroke-dasharray="2.4 1.8"` : `stroke-dasharray="0 2.6" stroke-linecap="round" stroke-width="${sw + .5}"`) : '';
  const sq = (s.w || 1) === (s.h || 2), a = `fill="${fill}" stroke="${stroke}" ${da} ${/stroke-width/.test(da) ? '' : `stroke-width="${sw}"`}`;
  let g;
  if (k === 'circle') g = `<circle cx="12" cy="12" r="${sq ? 7 : 6}" ${a}${sq ? '' : ' transform="matrix(1.25 0 0 1 -3 0)"'}/>`;
  else if (k === 'rect') g = sq ? `<rect x="5.5" y="5.5" width="13" height="13" rx="${s.rad ? 2.5 : .8}" ${a}/>` : `<rect x="4" y="6.5" width="16" height="11" rx="${s.rad ? 2.5 : .8}" ${a}/>`;
  else if (k === 'tri') g = `<path d="M12 5L19.5 18.5H4.5Z" stroke-linejoin="round" ${a}/>`;
  else g = `<path d="M12 4L20 12L12 20L4 12Z" stroke-linejoin="round" ${a}/>`;
  const gl = glyphOf(s.text);
  if (gl) g += `<text x="12" y="14.6" font-size="${gl.length > 1 ? 6.5 : 8}" text-anchor="middle" fill="currentColor" stroke="none" font-family="KaTeX_Main,serif">${esc(gl)}</text>`;
  return sv(g, size);
}
const builtinIc = t => (t === 'select' ? IC[prefs.selMode === 'lasso' ? 'lasso' : 'select'] : t === 'edge' ? edgeToolIc(prefs.edge) : t === 'dot' ? dotIc(defOf('dot').w, 18) : IC[t]);
const itemIc = it => (typeof it === 'string' ? builtinIc(it) : stampIc(it));
const itemName = it => (typeof it === 'string' ? TOOL_NAMES[it] || it : it.name || TOOL_NAMES[it.k]);
function renderDock(anim) {
  const keep = dockEl.querySelector('.dock-grip'), pill = dockEl.querySelector(':scope > .pill');
  [...dockEl.children].forEach(c => { if (c !== keep && c !== pill) c.remove(); });
  let h = '';
  for (const it of curItems()) {
    if (it === '|') { h += '<span class="dock-sep"></span>'; continue; }
    if (typeof it === 'string') { if (!TOOL_NAMES[it]) continue; h += `<button class="tool" data-tool="${it}" title="${TOOL_NAMES[it]} (${keyLabel(keys[it] || '')}${TOOL_MORE[it] || ''})"><span class="ti"></span><kbd>${keyLabel(keys[it] || '')}</kbd></button>`; continue; }
    const k = it.key ? it.key.toUpperCase() : '';
    h += `<button class="tool stamp" data-tool="st:${it.id}" title="${esc(it.name || TOOL_NAMES[it.k])}${k ? ` (${k})` : ''} · click again to edit"><span class="ti"></span>${k ? `<kbd>${esc(k)}</kbd>` : ''}</button>`;
  }
  dockEl.insertAdjacentHTML('beforeend', h);
  if (stamp) stamp = stampById(stamp.id);
  updateKbd(); syncDock();
  if (anim) $$('.tool, .dock-sep', dockEl).forEach((b, i) => b.animate([{ opacity: 0, scale: .6 }, { opacity: 1, scale: 1 }], { duration: 280, delay: i * 16, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'backwards' }));
  placeSub();
}
/* an own button from an object on the canvas: its look (and short text) */
function stampFrom(o) {
  if (o.a !== undefined || o.pa || o.pb) {
    const s = {}; for (const k of ['head', 'tail', 'dash', 'shape', 'sw', 'color', 'route']) if (o[k] !== undefined) s[k] = o[k];
    return { id: 's' + uid(), k: 'edge', name: 'Line', s };
  }
  if (!STAMP_KINDS.includes(o.k)) return null;
  const s = { w: o.w, h: o.h, ts: clone(o.ts || {}) };
  for (const k of STYLE_KEYS) if (o[k] !== undefined) s[k] = o[k];
  if (o.text && o.text.length <= 24) s.text = o.text;
  return { id: 's' + uid(), k: o.k, name: o.text && o.text.length <= 12 ? o.text.replace(/\$/g, '') : TOOL_NAMES[o.k], s };
}
function addStampFromSel() {
  const o = selNodes()[0] || selEdges()[0]; if (!o) return;
  const st = stampFrom(o); if (!st) { toast('This cannot become a button'); return; }
  editDock(d => { const i = d.items.lastIndexOf('|'); d.items.splice(i > 0 ? i : d.items.length, 0, st); }, true);
  toast(`Added to “${curDock().name}”`);
  const b = dockEl.querySelector(`[data-tool="st:${st.id}"]`); if (b) b.animate([{ scale: .3, opacity: 0 }, { scale: 1.15, opacity: 1 }, { scale: 1 }], { duration: 420, easing: 'cubic-bezier(.3,1.4,.5,1)' });
}
const CHECK_IC = sv('<path d="M5 12.5l4.2 4L19 7"/>', 16), BLANK_IC = sv('', 16);
function dockMenu(x, y, b) {
  const items = [], t = b?.dataset.tool;
  if (t && PEEK.has(t)) items.push({ t: 'Options', ic: small(IC.more), f: () => { if (tool !== t) setTool(t, true); subPeek = true; drawSub(); } });
  if (t && t.startsWith('st:')) items.push({ t: 'Edit this button', ic: small(IC.lstyle || IC.shape), f: () => openDockEd(t) });
  if (t) items.push({ t: 'Hide this button', ic: small(IC.close), f: () => editDock(d => { d.items = d.items.filter(i => itemKey(i) !== t); }) });
  if (selNodes().length + selEdges().length === 1) items.push({ t: 'Add the selected look as a button', ic: small(IC.plus), f: addStampFromSel });
  items.push({ t: 'Customize toolbar…', ic: small(IC.gear), f: () => openDockEd() }, '-');
  for (const d of allDocks()) items.push({ t: esc(d.name), ic: d.id === docks.cur ? CHECK_IC : BLANK_IC, f: () => switchDock(d.id) });
  showMenu(x, y, items);
  const r = menu.getBoundingClientRect(); if (r.bottom > innerHeight - 70 && dockEl.dataset.side === 'bottom') menu.style.top = Math.max(8, dockEl.getBoundingClientRect().top - r.height - 8) + 'px';
}

/* ---------- layouts as files (.figtool): share them, or carry them to another machine ---------- */
const COLOR_RE = /^(#[0-9a-f]{3,8}|none)$/i;
function cleanStamp(x) {
  if (!x || typeof x !== 'object' || !STAMP_KINDS.includes(x.k)) return null;
  const s0 = x.s && typeof x.s === 'object' ? x.s : {}, s = {};
  const col = v => (typeof v === 'string' && COLOR_RE.test(v) ? v : undefined), num = (v, a, b) => (typeof v === 'number' && v >= a && v <= b ? v : undefined);
  const put = (k, v) => { if (v !== undefined) s[k] = v; };
  put('fill', col(s0.fill)); put('stroke', col(s0.stroke)); put('color', col(s0.color));
  put('sw', num(s0.sw, .1, 20)); put('w', num(s0.w, 2, 600)); put('h', num(s0.h, 2, 600)); put('rad', num(s0.rad, 0, 99));
  put('dbl', typeof s0.dbl === 'boolean' ? s0.dbl : undefined);
  put('sd', typeof s0.sd === 'string' && /^[a-z0-9:.]{1,20}$/i.test(s0.sd) ? s0.sd : undefined);
  put('dash', typeof s0.dash === 'string' && /^[a-z0-9:.]{1,20}$/i.test(s0.dash) ? s0.dash : undefined);
  put('dir', ['up', 'down', 'left', 'right'].includes(s0.dir) ? s0.dir : undefined);
  put('head', HEADS.includes(s0.head) ? s0.head : undefined); put('tail', HEADS.includes(s0.tail) ? s0.tail : undefined);
  put('shape', ['line', 'double', 'wave', 'zig'].includes(s0.shape) ? s0.shape : undefined);
  put('route', ['arc', 'bez', 's', 'elbow', 'elbowr'].includes(s0.route) ? s0.route : undefined);
  put('text', typeof s0.text === 'string' ? s0.text.slice(0, 200) : undefined);
  if (s0.ts && typeof s0.ts === 'object') { const t = {}; if (num(s0.ts.size, 6, 96)) t.size = s0.ts.size; if (col(s0.ts.color)) t.color = s0.ts.color; for (const b of ['bold', 'italic', 'under']) if (s0.ts[b] === true) t[b] = true; s.ts = t; }
  const o = { id: typeof x.id === 'string' && /^[\w-]{1,40}$/.test(x.id) ? x.id : 's' + uid(), k: x.k, name: typeof x.name === 'string' ? x.name.slice(0, 60) : '', s };
  if (typeof x.key === 'string' && /^[a-z0-9]$/i.test(x.key)) o.key = x.key.toLowerCase();
  return o;
}
function exportDock() {
  const d = curDock();
  download(`${fileName(d.name)}.figtool`, new Blob([JSON.stringify({ figuraToolbar: 1, layouts: [{ name: d.name, items: d.items, subs: d.subs || {} }] }, null, 1)], { type: 'application/json' }));
}
/* returns how many layouts were added; each comes in as your own, under a free name */
function importDocks(obj) {
  const L = Array.isArray(obj?.layouts) ? obj.layouts : [];
  let last = null, n = 0;
  for (const l of L) {
    if (!l || !Array.isArray(l.items)) continue;
    const seen = new Set(), items = l.items.map(it => (it === '|' ? '|' : typeof it === 'string' ? (TOOL_NAMES[it] ? it : null) : cleanStamp(it))).filter(it => {
      if (!it) return false; const k = itemKey(it); if (it !== '|' && seen.has(k)) return false; seen.add(k); return true;
    });
    if (!items.length) continue;
    const c = { id: 'u' + uid(), name: uniqueDockName(typeof l.name === 'string' && l.name.trim() ? l.name.trim().slice(0, 60) : 'Imported'), items };
    if (l.subs && typeof l.subs === 'object') { c.subs = {}; for (const [k, v] of Object.entries(l.subs)) if (TOOL_NAMES[k] && Array.isArray(v)) c.subs[k] = v.filter(x => typeof x === 'string' && SUB_NAMES[x]).slice(0, 12); }
    tidySeps(c); docks.user.push(c); last = c; n++;
  }
  if (last) { saveDocks(); switchDock(last.id); }
  return n;
}
async function importDockFile(f) {
  try { const n = importDocks(JSON.parse(await f.text())); toast(n ? `Toolbar layout${n > 1 ? 's' : ''} added` : 'No toolbar layout in this file'); if (dockEd) drawDockEd(); }
  catch { toast('Could not read this file'); }
}

/* ---------- the toolbar editor: layouts, the strip (drag to reorder, × to hide), add, and the selected button's look ---------- */
let dockEd = null;
function openDockEd(selKey) {
  closePP(); closeMenu();
  dockEd = { sel: selKey || null };
  const box = $('#modal .mbox'); box.classList.remove('exp', 'help'); box.classList.add('dked'); box.onclick = null; box.oninput = null;
  $('#modal').hidden = false; document.body.classList.add('dked-on');
  drawDockEd(true);
}
const DK_SIZES = [1, 1.5, 2.5, 4];
function dkDots(f, cur, list, none) {
  let h = none ? `<button class="sdot none ${cur === 'none' || !cur ? 'on' : ''}" data-dk="${f}" data-v="none" title="None" style="--c:#fff"></button>` : '';
  h += list.map(c => `<button class="sdot ${lc(c) === lc(cur || '') ? 'on' : ''}" data-dk="${f}" data-v="${c}" title="${c}" style="--c:${c}"></button>`).join('');
  const own = cur && cur !== 'none' && !list.some(c => lc(c) === lc(cur));
  return `<span class="qgrp">${h}<button class="sdot anyc ${own ? 'on own' : ''}" data-dkp="${f}" title="More colours" ${own ? `style="--c:${cur}"` : ''}></button></span>`;
}
const dkSeg = (f, cur, opts) => `<div class="seg">${opts.map(([v, lab, t]) => `<button data-dk="${f}" data-v="${v}" class="${String(v) === String(cur) ? 'on' : ''}" title="${t || ''}">${lab}</button>`).join('')}</div>`;
const dkNum = (f, v, t, w = 44) => `<input class="dk-num" data-f="${f}" inputmode="decimal" value="${v ?? ''}" title="${t}" style="width:${w}px">`;
function dkInsp(st) {
  if (!st) return '';
  const s = st.s || {}, k = st.k, ts = s.ts || {}, used = keyUse(st.key, st.id);
  let h = `<div class="dk-row"><span class="dk-ic">${stampIc(st, 22)}</span><input class="dk-in" data-f="name" value="${esc(st.name || '')}" placeholder="${TOOL_NAMES[k]}" spellcheck="false">`
    + `<span class="dk-key ${used ? 'clash' : ''}" title="${used ? 'Also ' + used + ' — this button wins while the layout is on' : 'Shortcut key'}"><input data-f="key" maxlength="1" value="${esc((st.key || '').toUpperCase())}" placeholder="key" spellcheck="false"></span></div>`;
  if (k === 'edge') {
    h += `<div class="dk-row">${dkDots('color', s.color || '#1d1d1f', quickOf('qLine'))}</div>`;
    h += `<div class="dk-row">${dkSeg('sw', s.sw || 1.4, [1, 1.4, 2, 3].map(w => [w, lineIc('solid', Math.min(4.5, w * 1.1)), w + 'px']))}${vs}${dkSeg('dash', s.dash || 'solid', presetOf('dash').map(v => [v, lineIc(v, v === 'dot' ? 2.2 : 1.8), dashName(v)]))}${vs}${dkSeg('shape', s.shape || 'line', ESHAPES)}</div>`;
    h += `<div class="dk-row">${dkSeg('tail', s.tail || 'none', headOpts(true))}</div><div class="dk-row">${dkSeg('head', s.head ?? 'vee', headOpts(false))}</div>`;
    return h;
  }
  if (k === 'dot') return h + `<div class="dk-row">${dkDots('fill', s.fill || '#1d1d1f', ['#1d1d1f', ...quickOf('qLine').filter(c => lc(c) !== '#1d1d1f')])}${vs}${dkNum('w', s.w || 8, 'Size (px)')}</div>`;
  if (k === 'text') return h + `<div class="dk-row"><input class="dk-in wide" data-f="text" value="${esc(s.text || '')}" placeholder="Starting text · $math$" spellcheck="false">${vs}${dkNum('size', ts.size || 15, 'Text size')}</div><div class="dk-row">${dkDots('tcol', ts.color || '#1d1d1f', quickOf('qText'))}</div>`;
  h += `<div class="dk-row">${dkSeg('k', k, KINDS)}${vs}${dkNum('w', s.w ?? KDEF[k].w, 'Width')}<span class="dk-x">×</span>${dkNum('h', s.h ?? KDEF[k].h, 'Height')}${vs}<input class="dk-in" data-f="text" value="${esc(s.text || '')}" placeholder="Text" spellcheck="false" style="width:70px"></div>`;
  h += `<div class="dk-row">${dkDots('fill', s.fill || 'none', quickOf('qFill'), true)}</div>`;
  h += `<div class="dk-row">${dkDots('stroke', s.stroke ?? '#1d1d1f', quickOf('qLine'), true)}${vs}${dkSeg('bsw', s.sw ?? 1.5, DK_SIZES.map(w => [w, lineIc('solid', Math.min(4.5, w * 1.1)), w + 'px']))}${vs}${dkSeg('sd', s.sd || 'solid', presetOf('dash').map(v => [v, lineIc(v, v === 'dot' ? 2.2 : 1.8), dashName(v)]))}</div>`;
  return h;
}
/* a built-in tool: the parts of its sub-bar, as they look; click to show / hide, drag to reorder */
function dkSubInsp(t, d) {
  const all = subParts(t), shown = subShown(t, d).map(p => p[0]);
  const head = `<div class="dk-row"><span class="dk-ic">${builtinIc(t)}</span><span class="dk-tn">${TOOL_NAMES[t]}</span><span class="grow"></span>${d.subs && d.subs[t] ? `<button class="dk-a" data-spreset="${t}" title="Show every part in the usual order">Reset</button>` : ''}</div>`;
  if (!all.length) return head;
  const order = [...shown, ...all.map(p => p[0]).filter(id => !shown.includes(id))];
  return head + `<div class="dk-subs" data-subt="${t}">${order.map(id => `<div class="dk-sp ${shown.includes(id) ? '' : 'off'}" data-sp="${id}" data-spt="${t}" title="${SUB_NAMES[id]} · click to ${shown.includes(id) ? 'hide' : 'show'}, drag to move"><span class="dk-spv">${all.find(p => p[0] === id)[1]}</span></div>`).join('')}</div>`;
}
/* who else answers to this key: another button of the layout, or a built-in shortcut */
function keyUse(k, selfId) {
  if (!k) return '';
  const o = curItems().find(x => typeof x === 'object' && x.id !== selfId && x.key === k); if (o) return o.name;
  const a = ACTIONS.find(x => keys[x[0]] === k); return a ? a[2] : '';
}
function drawDockEd(first) {
  if (!dockEd) return;
  const box = $('#modal .mbox'), d = curDock(), items = d.items;
  const inL = new Set(items.filter(x => typeof x === 'string')), hidden = Object.keys(TOOL_NAMES).filter(t => !inL.has(t));
  const st = dockEd.sel && dockEd.sel.startsWith('st:') ? items.find(x => itemKey(x) === dockEd.sel) : null;
  const bt = dockEd.sel && !st && TOOL_NAMES[dockEd.sel] ? dockEd.sel : null;
  const one = selNodes().length + selEdges().length === 1;
  const lays = allDocks().map(x => `<button class="dk-lay ${x.id === d.id ? 'on' : ''} ${x.sys ? 'sys' : ''}" data-lay="${x.id}">${esc(x.name)}</button>`).join('');
  box.innerHTML = `<div class="ehead"><h2>Toolbar</h2><span class="grow"></span><button class="ibtn" data-x title="Close (Esc)">${IC.close}</button></div>
  <div class="dk-body">
    <div class="dk-lays">${lays}<button class="dk-lay add" data-newlay title="New layout from this one">${small(IC.plus)}</button></div>
    <div class="dk-cur"><input class="dk-lname" data-lname value="${esc(d.name)}" ${d.sys ? 'readonly title="A built-in layout: changing it makes your own copy"' : 'title="Rename"'} spellcheck="false">
      <span class="grow"></span>
      <button class="ibtn sm" data-implay title="Import a layout (.figtool)">${small(IC.open)}</button>
      <button class="ibtn sm" data-explay title="Export this layout (.figtool)">${small(IC.exp)}</button>
      <button class="ibtn sm" data-duplay title="Duplicate">${small(IC.dup)}</button>
      ${d.sys ? '' : `<button class="ibtn sm warn" data-dellay title="Delete this layout">${small(IC.trash)}</button>`}</div>
    <div class="dk-strip">${items.map((it, i) => it === '|' ? `<div class="dk-it sep" data-i="${i}" title="Separator"><i></i><button class="dk-rm" data-rm="${i}" title="Remove">×</button></div>` : `<div class="dk-it ${itemKey(it) === dockEd.sel ? 'on' : ''} ${typeof it === 'object' ? 'stamp' : ''}" data-i="${i}" title="${esc(itemName(it))}">${itemIc(it)}<button class="dk-rm" data-rm="${i}" title="Hide">×</button></div>`).join('')}</div>
    <div class="dk-add">
      ${hidden.map(t => `<button class="dk-a" data-addt="${t}" title="Show ${TOOL_NAMES[t]}">${builtinIc(t)}</button>`).join('')}
      <button class="dk-a" data-addsep title="Separator"><i class="dk-sepic"></i></button>${vs}
      ${STAMP_KINDS.map(k => `<button class="dk-a new" data-adds="${k}" title="New ${TOOL_NAMES[k].toLowerCase()} button">${stampIc({ k, s: k === 'edge' ? { head: 'vee' } : k === 'text' ? { text: 'A' } : {} })}</button>`).join('')}
      ${one ? `${vs}<button class="dk-a from" data-from title="A button with the look of the selected object">${small(IC.plus)}<span>Selected look</span></button>` : ''}
    </div>
    <div class="dk-insp ${st || bt ? 'in' : ''}">${st ? dkInsp(st) : bt ? dkSubInsp(bt, d) : ''}</div>
  </div>`;
  initSegs(box);
  if (first) box.animate([{ opacity: 0, scale: .97 }, { opacity: 1, scale: 1 }], { duration: 220, easing: 'cubic-bezier(.2,.9,.3,1)' });
}
function closeDockEd() { dockEd = null; document.body.classList.remove('dked-on'); }
/* a look value from the editor → the selected button */
function dkSet(f, v) {
  const key = dockEd?.sel; if (!key) return;
  editDock(d => {
    const st = d.items.find(x => itemKey(x) === key); if (!st) return;
    const s = st.s ||= {};
    if (f === 'name') st.name = v;
    else if (f === 'key') { const k = (v || '').toLowerCase().slice(0, 1); if (k && /[a-z0-9]/.test(k)) st.key = k; else delete st.key; }
    else if (f === 'k') { st.k = v; delete s.w; delete s.h; }
    else if (f === 'w' || f === 'h') { const n = +v; if (n >= 2 && n <= 600) { s[f] = n; if (st.k === 'dot') s.h = s.w; } }
    else if (f === 'size') { const n = +v; if (n >= 6 && n <= 96) (s.ts ||= {}).size = n; }
    else if (f === 'tcol') (s.ts ||= {}).color = v;
    else if (f === 'bsw') { s.sw = +v; if (s.stroke === 'none') s.stroke = '#1d1d1f'; }
    else if (f === 'sw') s.sw = +v;
    else if (f === 'text') { if (v) s.text = v; else delete s.text; }
    else s[f] = v;
  });
}
/* what an add-row button makes: a built-in tool, a separator, or a new own button of a kind */
function dkNewItem(el) {
  if (el.dataset.addt) return el.dataset.addt;
  if (el.hasAttribute('data-addsep')) return '|';
  const k = el.dataset.adds; if (!k) return null;
  const st = { id: 's' + uid(), k, name: '', s: k === 'edge' ? { ...edgeStyle() } : k === 'text' ? {} : k === 'dot' ? { fill: '#1d1d1f', w: 8, h: 8 } : { fill: KDEF[k].fill, stroke: '#1d1d1f', sw: 1.5 } };
  if (k === 'edge') ['bend', 'label', 'lp'].forEach(x => delete st.s[x]);
  return st;
}
$('#modal').addEventListener('click', e => {
  if (!dockEd || dkDrag?.moved) return;
  const t = e.target;
  if (t.closest('[data-x]')) { closeModal(); return; }
  let b;
  if (t.closest('[data-explay]')) { exportDock(); return; }
  if (t.closest('[data-implay]')) { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.figtool,.json,application/json'; inp.onchange = () => { if (inp.files[0]) importDockFile(inp.files[0]); }; inp.click(); return; }
  if ((b = t.closest('[data-lay]'))) { switchDock(b.dataset.lay); dockEd.sel = null; drawDockEd(); return; }
  if (t.closest('[data-newlay]') || t.closest('[data-duplay]')) { const c = { id: 'u' + uid(), name: uniqueDockName(curDock().name + (t.closest('[data-newlay]') ? ' (new)' : ' (copy)')), items: clone(curItems()), subs: clone(curDock().subs || {}) }; docks.user.push(c); saveDocks(); switchDock(c.id); drawDockEd(); const i = $('.dk-lname'); if (i) { i.focus(); i.select(); } return; }
  if (t.closest('[data-dellay]')) {
    const b2 = t.closest('[data-dellay]');
    if (!b2.classList.contains('arm')) { b2.classList.add('arm'); b2.title = 'Click again to delete'; setTimeout(() => b2.isConnected && b2.classList.remove('arm'), 2400); return; }
    const id = docks.cur; docks.user = docks.user.filter(x => x.id !== id); docks.cur = 'general'; saveDocks(); stamp = null; renderDock(true); setTool('select'); dockEd.sel = null; drawDockEd(); return;
  }
  if ((b = t.closest('[data-rm]'))) { const i = +b.dataset.rm, k = itemKey(curItems()[i]); editDock(d => { d.items.splice(i, 1); }); if (dockEd.sel === k) { dockEd.sel = null; drawDockEd(); } return; }
  if ((b = t.closest('[data-addt]'))) { editDock(d => { const i = d.items.lastIndexOf('|'); d.items.splice(i > 0 ? i : d.items.length, 0, b.dataset.addt); }); return; }
  if (t.closest('[data-addsep]')) { editDock(d => { d.items.push('|'); }); return; }
  if ((b = t.closest('[data-adds]'))) {
    const st = dkNewItem(b);
    dockEd.sel = 'st:' + st.id; editDock(d => { const i = d.items.lastIndexOf('|'); d.items.splice(i > 0 ? i : d.items.length, 0, st); }); return;
  }
  if (t.closest('[data-from]')) { addStampFromSel(); const it = curItems().filter(x => typeof x === 'object').pop(); if (it) { dockEd.sel = itemKey(it); drawDockEd(); } return; }
  if ((b = t.closest('[data-dkp]'))) { const f = b.dataset.dkp, st = curItems().find(x => itemKey(x) === dockEd.sel), s = st?.s || {}; openCP(b, f === 'tcol' ? s.ts?.color : s[f], (hex, live) => { if (!live) dkSet(f, hex); }); return; }
  if ((b = t.closest('[data-dk]'))) { dkSet(b.dataset.dk, b.dataset.v); return; }
  if ((b = t.closest('[data-spt]')) && !dkDrag?.moved) { const tl = b.dataset.spt, id = b.dataset.sp; editDock(d => { const all = subParts(tl).map(p => p[0]), cur = d.subs?.[tl] || all; (d.subs ||= {})[tl] = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]; if (!d.subs[tl].length) d.subs[tl] = cur; }); return; }
  if (t.closest('[data-spreset]')) { const tl = t.closest('[data-spreset]').dataset.spreset; editDock(d => { if (d.subs) delete d.subs[tl]; }); return; }
  if ((b = t.closest('.dk-it')) && !b.classList.contains('sep') && !dkDrag?.moved) { const k = itemKey(curItems()[+b.dataset.i]); dockEd.sel = dockEd.sel === k ? null : k; drawDockEd(); }
});
/* text fields: saved as you type; a built-in layout is copied on the first change (then the field is found again) */
$('#modal').addEventListener('input', e => {
  if (!dockEd) return;
  const f = e.target.dataset.f, before = curDock().sys;
  if (e.target.matches('[data-lname]')) { const d = curDock(); if (d.sys) return; d.name = e.target.value || 'Layout'; saveDocks(); $$('.dk-lay.on').forEach(b => { b.textContent = d.name; }); return; }
  if (!f) return;
  if (f === 'w' || f === 'h' || f === 'size') { if (!(+e.target.value > 0)) return; }
  const pos = e.target.selectionStart;
  dkSet(f, e.target.value);
  const el = $(`.dk-insp [data-f="${f}"]`); if (el && (before || document.activeElement !== el)) { el.focus(); try { el.setSelectionRange(pos, pos); } catch { /* number-like */ } }
});
/* drag a button along the strip; the others slide out of the way */
/* drag, no keys needed: strip buttons along the strip (or off it to hide), add-row buttons onto the strip at a spot, sub-bar parts along their row */
let dkDrag = null;
const dkFlip = (box, fn) => {
  const els = [...box.children], first = new Map(els.map(x => [x, x.getBoundingClientRect()]));
  fn();
  for (const x of els) { if (!x.isConnected) continue; const a = first.get(x), b = x.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top; if (dx || dy) x.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], { duration: 180, easing: 'cubic-bezier(.2,.9,.3,1)' }); }
};
/* the child the pointer is before (null = at the end), skipping the moving one */
function dkRef(box, x, y, skip) {
  for (const o of box.children) { if (o === skip) continue; const r = o.getBoundingClientRect(); if (y < r.bottom + 8 && x < r.left + r.width / 2) return o; }
  return null;
}
const nearBox = (box, e, m) => { const r = box.getBoundingClientRect(); return e.clientX > r.left - m && e.clientX < r.right + m && e.clientY > r.top - m && e.clientY < r.bottom + m; };
$('#modal').addEventListener('pointerdown', e => {
  if (!dockEd || e.button !== 0) return;
  if (e.target.closest('.dk-rm')) return;
  const add = e.target.closest('.dk-a[data-addt], .dk-a[data-addsep], .dk-a[data-adds]');
  if (add) { dkDrag = { add, sx: e.clientX, sy: e.clientY, moved: false, strip: $('.dk-strip') }; return; }
  const it = e.target.closest('.dk-it, .dk-sp'); if (!it) return;
  dkDrag = { el: it, sx: e.clientX, sy: e.clientY, moved: false, strip: it.parentElement };
});
addEventListener('pointermove', e => {
  const g = dkDrag; if (!g) return;
  if (!g.moved && Math.hypot(e.clientX - g.sx, e.clientY - g.sy) < 4) return;
  if (!g.moved) {
    g.moved = true; document.body.classList.add('dk-dragging');
    if (g.add) { g.ghost = document.createElement('div'); g.ghost.className = 'dk-ghost'; g.ghost.innerHTML = g.add.innerHTML; document.body.appendChild(g.ghost); g.add.classList.add('src'); }
    else g.el.classList.add('drag');
  }
  if (g.add) {
    g.ghost.style.left = e.clientX + 'px'; g.ghost.style.top = e.clientY + 'px';
    const over = nearBox(g.strip, e, 26);
    g.ghost.classList.toggle('hot', over);
    if (!over) { if (g.ph) { const ph = g.ph; g.ph = null; dkFlip(g.strip, () => ph.remove()); } return; }
    if (!g.ph) { g.ph = document.createElement('div'); g.ph.className = 'dk-it ph'; }
    const ref = dkRef(g.strip, e.clientX, e.clientY, g.ph);
    if (g.ph.isConnected && (ref === g.ph.nextSibling)) return;
    dkFlip(g.strip, () => g.strip.insertBefore(g.ph, ref));
    return;
  }
  /* a strip button pulled well away from the strip: let go to hide it */
  if (g.el.classList.contains('dk-it')) {
    const out = !nearBox(g.strip, e, 34);
    if (out !== !!g.out) { g.out = out; g.el.classList.toggle('out', out); }
    g.el.style.translate = `0 ${out ? clamp(e.clientY - g.strip.getBoundingClientRect().top - 24, -40, 40) : 0}px`;
    if (out) return;
  }
  const ref = dkRef(g.strip, e.clientX, e.clientY, g.el);
  if (ref === g.el.nextSibling || (!ref && g.el === g.strip.lastElementChild)) return;
  dkFlip(g.strip, () => g.strip.insertBefore(g.el, ref));
});
addEventListener('pointerup', () => {
  const g = dkDrag; if (!g) return;
  setTimeout(() => { if (dkDrag === g) dkDrag = null; }, 0);
  document.body.classList.remove('dk-dragging');
  if (g.add) {
    g.add.classList.remove('src');
    if (!g.moved) return;
    const gh = g.ghost;
    if (!g.ph || !g.ph.isConnected) { const r = g.add.getBoundingClientRect(); gh.style.transition = 'left .2s, top .2s, opacity .2s, scale .2s'; gh.style.left = r.left + r.width / 2 + 'px'; gh.style.top = r.top + r.height / 2 + 'px'; gh.style.opacity = 0; setTimeout(() => gh.remove(), 220); return; }
    gh.remove();
    const it = dkNewItem(g.add), src = curItems();
    const order = [...g.strip.children].map(x => (x === g.ph ? it : src[+x.dataset.i]));
    if (typeof it === 'object') dockEd.sel = 'st:' + it.id;
    editDock(d => { d.items = order.map(o => (typeof o === 'object' && o !== it ? d.items.find(x => typeof x === 'object' && x.id === o.id) : o)).filter(Boolean); });
    const nb = $(`.dk-strip .dk-it[data-i="${curItems().findIndex(x => x === it || (typeof it === 'object' && typeof x === 'object' && x.id === it.id) || (typeof it === 'string' && it !== '|' && x === it))}"]`);
    if (nb) nb.animate([{ scale: .4, opacity: 0 }, { scale: 1.12, opacity: 1 }, { scale: 1 }], { duration: 340, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    return;
  }
  g.el.classList.remove('drag');
  if (!g.moved) return;
  if (g.el.classList.contains('dk-sp')) {
    const tl = g.strip.dataset.subt, vis = [...g.strip.children].filter(x => !x.classList.contains('off')).map(x => x.dataset.sp);
    editDock(d => { (d.subs ||= {})[tl] = vis; }); return;
  }
  if (g.out) { const i = +g.el.dataset.i, k = itemKey(curItems()[i]); g.el.animate([{ opacity: .5, scale: .8 }, { opacity: 0, scale: .4 }], { duration: 160, fill: 'forwards' }); setTimeout(() => { editDock(d => { d.items.splice(i, 1); }); if (dockEd && dockEd.sel === k) { dockEd.sel = null; drawDockEd(); } }, 160); return; }
  const src = curItems(), order = [...g.strip.children].map(x => src[+x.dataset.i]);
  editDock(d => { d.items = order.map(it => (typeof it === 'object' ? d.items.find(x => typeof x === 'object' && x.id === it.id) : it)); });
});

/* ---------- ⌘ / Ctrl + drag: reorder buttons inside their group (dock sections, top buttons, grid switch, any segment, quick colours) ---------- */
const saveOrd = () => lsSet(LS.order, ORD);
function ordSort(list, keyOf, saved) {
  if (!saved || !saved.length) return list;
  const ix = k => { const i = saved.indexOf(String(k)); return i < 0 ? 1e6 : i; };
  return list.map((x, i) => [x, i]).sort((p, q) => (ix(keyOf(p[0])) - ix(keyOf(q[0]))) || p[1] - q[1]).map(p => p[0]);
}
/* which group a pressed element belongs to */
function roGroup(t) {
  let el;
  if ((el = t.closest('#dock .tool'))) {
    const all = [...$('#dock').children], i = all.indexOf(el);
    let a = i, b = i;
    while (a > 0 && all[a - 1].classList.contains('tool')) a--;
    while (b < all.length - 1 && all[b + 1].classList.contains('tool')) b++;
    return { el, items: all.slice(a, b + 1), key: x => x.dataset.tool, commit: () => { const order = [...dockEl.children].filter(x => x.classList.contains('tool') || x.classList.contains('dock-sep')).map(x => (x.classList.contains('dock-sep') ? '|' : x.dataset.tool)); editDock(d => { d.items = order.map(k => (k === '|' || !k.startsWith('st:') ? k : d.items.find(i => typeof i === 'object' && 'st:' + i.id === k))).filter(Boolean); }); }, dom: true };
  }
  if ((el = t.closest('.top-actions > .ibtn'))) return { el, items: $$('.top-actions > .ibtn'), key: x => x.id, commit: () => { ORD.top = $$('.top-actions > .ibtn').map(x => x.id); saveOrd(); }, dom: true };
  if ((el = t.closest('#gridSeg > button'))) return { el, items: $$('#gridSeg > button'), key: x => x.dataset.g, commit: () => { ORD.grid = $$('#gridSeg > button').map(x => x.dataset.g); saveOrd(); syncPill($('#gridSeg'), $('#gridSeg button.on'), true); }, dom: true };
  if ((el = t.closest('#sub .sdot[data-q], #pp .sdot[data-q]'))) {
    const k = el.dataset.q.split(':')[0], items = $$(`.sdot[data-q^="${k}:"]`, el.parentElement);
    return { el, items, key: x => x.dataset.v, commit: keys => setQuick(k, keys) };
  }
  if ((el = t.closest('.seg > button[data-a]'))) {
    const a = el.dataset.a, items = [...el.parentElement.querySelectorAll(':scope > button')];
    if (items.length < 2) return null;
    return { el, items, key: x => x.dataset.v, commit: keys => { ORD.seg[a] = keys; saveOrd(); if (sub.contains(el)) drawSub(true); else if (pp.contains(el)) refreshPP(); else if (cpk.contains(el)) cpBuild(); else if (bar.contains(el)) { barSig = ''; updateBar(); } } };
  }
  return null;
}
let ro = null, roEat = false;
function roVertical(items) { const a = items[0].getBoundingClientRect(), b = items[items.length - 1].getBoundingClientRect(); return Math.abs(b.top - a.top) > Math.abs(b.left - a.left); }
document.addEventListener('pointerdown', e => {
  if (!(e.metaKey || e.ctrlKey) || e.button !== 0) return;
  const g = roGroup(e.target); if (!g || g.items.length < 2) return;
  e.preventDefault(); e.stopPropagation();
  const v = roVertical(g.items), rs = g.items.map(x => x.getBoundingClientRect());
  const P = r => v ? r.top : r.left, S = r => v ? r.height : r.width;
  const from = g.items.indexOf(g.el);
  const gap = rs.length > 1 ? Math.max(0, P(rs[1]) - (P(rs[0]) + S(rs[0]))) : 0;
  ro = { ...g, v, rs, P, S, from, to: from, gap, sx: e.clientX, sy: e.clientY, pill: g.el.parentElement.querySelector(':scope > .pill') };
  document.body.classList.add('ro-on');
  g.items.forEach(x => { x.classList.add('ro-item'); });
  g.el.classList.add('ro-drag');
}, true);
addEventListener('pointermove', e => {
  if (!ro) return;
  const d = ro.v ? e.clientY - ro.sy : e.clientX - ro.sx, r0 = ro.rs[ro.from];
  const lo = ro.P(ro.rs[0]) - ro.P(r0), hi = ro.P(ro.rs[ro.rs.length - 1]) + ro.S(ro.rs[ro.rs.length - 1]) - ro.P(r0) - ro.S(r0);
  const dd = clamp(d, lo - 6, hi + 6), c = ro.P(r0) + ro.S(r0) / 2 + dd;
  let to = 0; ro.rs.forEach((r, i) => { if (i !== ro.from && c > ro.P(r) + ro.S(r) / 2) to++; });
  ro.to = to; ro.d = dd;
  ro.el.style.translate = ro.v ? `0 ${dd}px` : `${dd}px 0`;
  const shift = ro.S(r0) + ro.gap;
  ro.items.forEach((x, i) => {
    if (i === ro.from) return;
    const o = ro.from < to && i > ro.from && i <= to ? -shift : ro.from > to && i >= to && i < ro.from ? shift : 0;
    x.style.translate = ro.v ? `0 ${o}px` : `${o}px 0`;
  });
  if (ro.pill) { const on = ro.items.find(x => x.classList.contains('on')); if (on) ro.pill.style.translate = on.style.translate; }
});
function roEnd() {
  if (!ro) return;
  const g = ro; ro = null; roEat = true; setTimeout(() => (roEat = false), 0);
  document.body.classList.remove('ro-on');
  /* settle the dragged item into its slot, then commit the new order without a jump */
  let off = 0;
  if (g.to > g.from) for (let i = g.from + 1; i <= g.to; i++) off += g.S(g.rs[i]) + g.gap;
  else for (let i = g.to; i < g.from; i++) off -= g.S(g.rs[i]) + g.gap;
  g.el.classList.remove('ro-drag'); g.el.classList.add('ro-land');
  g.el.style.translate = g.v ? `0 ${off}px` : `${off}px 0`;
  if (g.pill && g.el.classList.contains('on')) g.pill.style.translate = g.el.style.translate;
  setTimeout(() => {
    const order = g.items.slice(); order.splice(g.from, 1); order.splice(g.to, 0, g.el);
    g.items.forEach(x => { x.style.transition = 'none'; x.style.translate = ''; x.classList.remove('ro-item', 'ro-land'); });
    if (g.pill) { g.pill.style.transition = 'none'; g.pill.style.translate = ''; }
    if (g.dom && g.to !== g.from) { const ref = g.items[g.items.length - 1].nextSibling, par = g.el.parentElement; order.forEach(x => par.insertBefore(x, ref)); }
    if (g.to !== g.from) g.commit(order.map(g.key));
    else if (g.pill) syncPill(g.el.parentElement, g.el.parentElement.querySelector(':scope > button.on'), true);
    void document.body.offsetWidth;
    g.items.forEach(x => { x.style.transition = ''; });
    if (g.pill) g.pill.style.transition = '';
  }, 200);
}
document.addEventListener('contextmenu', e => { if (ro || roEat) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
addEventListener('pointerup', roEnd); addEventListener('pointercancel', roEnd); addEventListener('blur', roEnd);
document.addEventListener('click', e => { if (roEat) { e.stopPropagation(); e.preventDefault(); roEat = false; } }, true);
/* while ⌘ / Ctrl is held, reorderable buttons show a grab cursor */
addEventListener('keydown', e => { if (e.key === 'Meta' || e.key === 'Control') document.body.classList.add('ro-armed'); });
addEventListener('keyup', e => { if (e.key === 'Meta' || e.key === 'Control') document.body.classList.remove('ro-armed'); });
addEventListener('blur', () => document.body.classList.remove('ro-armed'));
/* saved orders for the static groups */
(function applyOrders() {
  if (ORD.top) { const bs = $$('.top-actions > .ibtn'), par = bs[0].parentElement; ordSort(bs, x => x.id, ORD.top).forEach(x => par.appendChild(x)); }
  if (ORD.grid) { const bs = $$('#gridSeg > button'), par = $('#gridSeg'); ordSort(bs, x => x.dataset.g, ORD.grid).forEach(x => par.appendChild(x)); }
})();

load();
setGrid(prefs.grid);
renderDock();
applyDockSide();
loadTab(false);
drawSub();
if (document.fonts) document.fonts.ready.then(() => { meas.clear(); for (const el of elabEls.values()) el._m = null; for (const el of olEls.values()) el._m = null; render(); });
addEventListener('load', () => { htmlCache.clear(); meas.clear(); for (const el of nodeEls.values()) el._t = null; for (const el of elabEls.values()) el._t = null; for (const el of olEls.values()) el._t = null; render(); placeSub(); });
if (!lsGet(LS.seen)) { lsSet(LS.seen, 1); setTimeout(() => toast('Tip: press ? for every shortcut', 3200), 800); }
window.Figura = { get doc() { return doc; }, get pps() { return { ppHover, ppKey }; }, get sel() { return sel; }, render, latex: only => latexFor(!!only).tex, tikz: only => latexFor(!!only, true).tex, get sty() { return styText(); }, parseTikz };
})();
