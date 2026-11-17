// Shared look for the three "pagamento por aproximação" B-roll clips.
// Paper-and-ink palette from the project's site (DESIGN.md), one red for the fraud.
// Bottom-right corner (WEBCAM) stays empty: the presenters' webcam goes there.

export const C = {
  paper: '#f6f4ef',
  paper2: '#ece9e2',
  paper3: '#e1ddd4',
  ink: '#161513',
  ink2: '#46433d',
  ink3: '#6b675f',
  fio: '#cdc9bf',
  fio2: '#9d988d',
  red: '#b42318',
  redSoft: '#f3d9d4',
};

export const WEBCAM = [1440, 750, 440, 290];

export const FONTS = [
  { family: 'Newsreader', weight: 500, url: '/node_modules/@fontsource/newsreader/files/newsreader-latin-500-normal.woff2' },
  { family: 'Newsreader', weight: 600, url: '/node_modules/@fontsource/newsreader/files/newsreader-latin-600-normal.woff2' },
  { family: 'Inter', weight: 400, url: '/node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2' },
  { family: 'Inter', weight: 600, url: '/node_modules/@fontsource/inter/files/inter-latin-600-normal.woff2' },
];

export const TAU = Math.PI * 2;
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const smooth = (x) => { const c = clamp01(x); return c * c * (3 - 2 * c); };
export const out3 = (x) => 1 - (1 - clamp01(x)) ** 4;
export const inOut = (x) => { const c = clamp01(x); return c < 0.5 ? 4 * c * c * c : 1 - ((-2 * c + 2) ** 3) / 2; };
export const back = (x) => { const c = clamp01(x); const s = 1.4; return 1 + (s + 1) * (c - 1) ** 3 + s * (c - 1) ** 2; };
export const lerp = (a, b, p) => a + (b - a) * p;
export const fadeIn = (t, a, d = 0.4) => out3((t - a) / d);
export const fadeOut = (t, z, d = 0.4) => 1 - smooth((t - z) / d);
export const win = (t, a, z, d = 0.4) => fadeIn(t, a, d) * fadeOut(t, z, d);
export const pulse = (t, a, d = 1.2) => (t < a || t > a + d ? 0 : Math.min(1, (t - a) / 0.12) * (1 - smooth((t - a - 0.2) / (d - 0.2))));

export const brl = (v) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const brl0 = (v) => 'R$ ' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export function T(g, str, x, y, size, o = {}) {
  g.text(str, { x, y, size, font: 'Inter', weight: 400, color: C.ink, ...o });
}
export function S(g, str, x, y, size, o = {}) {
  g.text(str, { x, y, size, font: 'Newsreader', weight: 500, color: C.ink, letterSpacing: -size * 0.02, ...o });
}

export function box(g, x, y, w, h, { fill, stroke, alpha = 1, width = 2, radius = 16, dash } = {}) {
  const ctx = g.ctx;
  const a = clamp01(alpha);
  if (a <= 0) return;
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) {
    ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.setLineDash(dash ?? []);
    ctx.stroke(); ctx.setLineDash([]);
  }
}

export function path(g, pts, { color = C.ink, alpha = 1, width = 3, dash, fill, close = false } = {}) {
  const ctx = g.ctx;
  const a = clamp01(alpha);
  if (a <= 0) return;
  ctx.globalAlpha = a;
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  if (close) ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.setLineDash(dash ?? []); ctx.stroke(); ctx.setLineDash([]);
}

// Partial stroke: draw the first p (0..1) of a polyline.
export function drawOn(g, pts, p, o = {}) {
  if (p <= 0) return;
  let total = 0;
  const seg = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
  let left = total * clamp01(p);
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (left >= seg[i - 1]) { out.push(pts[i]); left -= seg[i - 1]; continue; }
    const q = left / seg[i - 1];
    out.push([lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)]);
    break;
  }
  path(g, out, o);
}

export function check(g, x, y, s, p, o = {}) {
  drawOn(g, [[x - s * 0.5, y], [x - s * 0.15, y + s * 0.35], [x + s * 0.55, y - s * 0.4]], p, { width: s * 0.16, ...o });
}
export function cross(g, x, y, s, p, o = {}) {
  drawOn(g, [[x - s / 2, y - s / 2], [x + s / 2, y + s / 2]], p * 2, { width: s * 0.16, ...o });
  drawOn(g, [[x + s / 2, y - s / 2], [x - s / 2, y + s / 2]], p * 2 - 1, { width: s * 0.16, ...o });
}

// Contactless symbol: four arcs opening to the right.
export function waves(g, x, y, s, { color = C.ink, alpha = 1, width } = {}) {
  const ctx = g.ctx;
  if (alpha <= 0) return;
  ctx.globalAlpha = clamp01(alpha);
  ctx.strokeStyle = color; ctx.lineWidth = width ?? s * 0.09; ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(x - s * 0.35, y, s * (0.2 + i * 0.22), -0.75, 0.75);
    ctx.stroke();
  }
}

// Bank card. (x, y) is the centre; rot in radians; s = scale (1 => 340x214).
export function card(g, x, y, { s = 1, rot = 0, alpha = 1, last = '4821', name = 'SEU CARTÃO', fake = false, hidden = false } = {}) {
  if (alpha <= 0) return;
  const ctx = g.ctx;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const w = 340, h = 214;
  box(g, -w / 2 + 6, -h / 2 + 10, w, h, { fill: C.ink, alpha: alpha * 0.12, radius: 20 });
  box(g, -w / 2, -h / 2, w, h, { fill: fake ? C.ink2 : C.ink, alpha, radius: 20 });
  if (!hidden) {
    box(g, -w / 2 + 34, -h / 2 + 62, 52, 40, { fill: C.paper3, alpha, radius: 7 });
    path(g, [[-w / 2 + 34, -h / 2 + 82], [-w / 2 + 86, -h / 2 + 82]], { color: C.fio2, width: 2, alpha });
    path(g, [[-w / 2 + 60, -h / 2 + 62], [-w / 2 + 60, -h / 2 + 102]], { color: C.fio2, width: 2, alpha });
    waves(g, w / 2 - 50, -h / 2 + 82, 46, { color: C.paper, alpha: alpha * 0.9 });
    g.text('•••• •••• •••• ' + last, { x: -w / 2 + 34, y: h / 2 - 66, size: 24, font: 'Inter', weight: 600, color: C.paper, alpha, align: 'left', letterSpacing: 1.5 });
    g.text(name, { x: -w / 2 + 34, y: h / 2 - 30, size: 17, font: 'Inter', weight: 400, color: C.fio, alpha, align: 'left', letterSpacing: 2 });
  }
  ctx.restore();
}

// Card terminal ("maquininha"). (x, y) = top-left. Returns geometry for anchoring.
export const TERM = { w: 330, h: 560 };
export function terminal(g, x, y, { alpha = 1, screen = [], screenInvert = false, keysLit = [], keyLit = 0, slot = false, redScreen = false } = {}) {
  if (alpha <= 0) return termGeo(x, y);
  const { w, h } = TERM;
  box(g, x + 8, y + 12, w, h, { fill: C.ink, alpha: alpha * 0.1, radius: 34 });
  box(g, x, y, w, h, { fill: C.paper, stroke: C.ink, width: 3, alpha, radius: 34 });
  // screen
  const sx = x + 30, sy = y + 36, sw = w - 60, sh = 170;
  box(g, sx, sy, sw, sh, { fill: screenInvert ? (redScreen ? C.red : C.ink) : C.paper2, stroke: C.ink, width: 2, alpha, radius: 12 });
  screen.forEach((l, i) => {
    const col = screenInvert ? C.paper : (l.color ?? C.ink);
    g.text(l.text, { x: sx + sw / 2, y: sy + (l.y ?? 58 + i * 46), size: l.size ?? 30, font: l.serif ? 'Newsreader' : 'Inter', weight: l.weight ?? 600, color: col, alpha: alpha * (l.alpha ?? 1), align: 'center' });
  });
  // contactless mark above the keypad
  waves(g, x + w / 2 + 6, y + 238, 30, { color: C.ink3, alpha: alpha * 0.8 });
  // keypad 3x4
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  keys.forEach((k, i) => {
    const kx = x + 42 + (i % 3) * 86, ky = y + 270 + Math.floor(i / 3) * 62;
    const lit = keysLit.includes(k) ? keyLit : 0;
    box(g, kx, ky, 74, 50, { fill: lit > 0 ? C.ink : C.paper2, stroke: C.fio2, width: 1.5, alpha, radius: 10 });
    if (lit > 0) box(g, kx, ky, 74, 50, { fill: C.ink, alpha: alpha * lit, radius: 10 });
    g.text(k, { x: kx + 37, y: ky + 34, size: 24, font: 'Inter', weight: 600, color: lit > 0.5 ? C.paper : C.ink, alpha, align: 'center' });
  });
  // card slot at the bottom edge
  box(g, x + 70, y + h - 22, w - 140, 10, { fill: slot ? C.ink : C.fio2, alpha, radius: 5 });
  return termGeo(x, y);
}
export function termGeo(x, y) {
  return {
    x, y, w: TERM.w, h: TERM.h,
    screen: [x + 30, y + 36, TERM.w - 60, 170],
    pad: [x + 42, y + 270, 246, 236],
    slot: [x + TERM.w / 2, y + TERM.h - 17],
    top: [x + TERM.w / 2, y],
    key: (k) => {
      const i = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].indexOf(k);
      return [x + 42 + (i % 3) * 86 + 37, y + 270 + Math.floor(i / 3) * 62 + 25];
    },
  };
}

// Phone. (x, y) top-left, 300x600.
export function phone(g, x, y, { alpha = 1, w = 300, h = 600 } = {}) {
  if (alpha <= 0) return;
  box(g, x + 8, y + 12, w, h, { fill: C.ink, alpha: alpha * 0.1, radius: 46 });
  box(g, x, y, w, h, { fill: C.ink, alpha, radius: 46 });
  box(g, x + 14, y + 14, w - 28, h - 28, { fill: C.paper, alpha, radius: 34 });
  box(g, x + w / 2 - 44, y + 26, 88, 22, { fill: C.ink, alpha, radius: 11 });
}

// Notification banner inside a phone.
export function notif(g, x, y, w, { title, body, alpha = 1, red = false } = {}) {
  if (alpha <= 0) return;
  box(g, x, y, w, 96, { fill: red ? C.redSoft : C.paper2, stroke: red ? C.red : C.fio, width: 1.5, alpha, radius: 18 });
  g.text(title, { x: x + 20, y: y + 38, size: 21, font: 'Inter', weight: 600, color: red ? C.red : C.ink, alpha, align: 'left' });
  g.text(body, { x: x + 20, y: y + 72, size: 21, font: 'Inter', weight: 400, color: C.ink2, alpha, align: 'left' });
}

// Bell, optionally struck through.
export function bell(g, x, y, s, { alpha = 1, off = 0, color = C.ink } = {}) {
  if (alpha <= 0) return;
  const ctx = g.ctx;
  ctx.globalAlpha = clamp01(alpha);
  ctx.strokeStyle = color; ctx.lineWidth = s * 0.09; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.42, y + s * 0.25);
  ctx.quadraticCurveTo(x - s * 0.3, y + s * 0.1, x - s * 0.3, y - s * 0.1);
  ctx.arc(x, y - s * 0.1, s * 0.3, Math.PI, 0);
  ctx.quadraticCurveTo(x + s * 0.3, y + s * 0.1, x + s * 0.42, y + s * 0.25);
  ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y + s * 0.34, s * 0.08, 0, TAU); ctx.stroke();
  if (off > 0) drawOn(g, [[x - s * 0.5, y - s * 0.55], [x + s * 0.5, y + s * 0.5]], off, { color: C.red, width: s * 0.1, alpha });
}

// Eye that looks toward (lx, ly).
export function eye(g, x, y, s, lx, ly, { alpha = 1, color = C.red } = {}) {
  if (alpha <= 0) return;
  const ctx = g.ctx;
  ctx.globalAlpha = clamp01(alpha);
  ctx.beginPath();
  ctx.moveTo(x - s, y);
  ctx.quadraticCurveTo(x, y - s * 0.95, x + s, y);
  ctx.quadraticCurveTo(x, y + s * 0.95, x - s, y);
  ctx.closePath();
  ctx.fillStyle = C.paper; ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = s * 0.1; ctx.stroke();
  const a = Math.atan2(ly - y, lx - x);
  g.dot(x + Math.cos(a) * s * 0.28, y + Math.sin(a) * s * 0.2, s * 0.3, { color, alpha });
  g.dot(x + Math.cos(a) * s * 0.28, y + Math.sin(a) * s * 0.2, s * 0.12, { color: C.ink, alpha });
}

// Fingerprint (concentric partial arcs).
export function fingerprint(g, x, y, s, { alpha = 1, color = C.ink } = {}) {
  if (alpha <= 0) return;
  const ctx = g.ctx;
  ctx.globalAlpha = clamp01(alpha); ctx.strokeStyle = color; ctx.lineWidth = s * 0.06; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(x, y + s * 0.1, s * (0.12 + i * 0.1), s * (0.18 + i * 0.12), 0, Math.PI * (1.05 + i * 0.02), Math.PI * (2.0 - i * 0.03) + (i % 2) * 0.6);
    ctx.stroke();
  }
}

// Toggle switch.
export function toggle(g, x, y, on, { alpha = 1 } = {}) {
  if (alpha <= 0) return;
  box(g, x, y, 92, 50, { fill: on > 0.5 ? C.ink : C.paper3, stroke: C.ink, width: 2, alpha, radius: 25 });
  g.dot(lerp(x + 25, x + 67, on), y + 25, 18, { color: C.paper, alpha });
}

// Chapter label (top-left) and a quiet frame line, shared by all clips.
export function chapter(g, t, scenes, labels) {
  for (const s of scenes) {
    const label = labels[s.id];
    if (!label) continue;
    const a = fadeIn(t, s.start + 0.1, 0.4) * fadeOut(t, s.end - 0.25, 0.3);
    if (a <= 0) continue;
    T(g, label.toUpperCase(), 96, 104, 24, { align: 'left', color: C.ink3, letterSpacing: 3.2, weight: 600, alpha: a });
    path(g, [[96, 124], [96 + 64 * a, 124]], { color: C.ink, width: 3, alpha: a });
  }
}

// Gentle drifting paper grain so held frames are never fully frozen.
export function grain(g, t) {
  const r = g.rng(7);
  for (let i = 0; i < 70; i++) {
    const x = r() * 1920, y = r() * 1080, ph = r() * TAU;
    g.dot(x + 6 * Math.sin(t * 0.25 + ph), y + 6 * Math.cos(t * 0.2 + ph), 1.6, { color: C.fio2, alpha: 0.35 });
  }
}
