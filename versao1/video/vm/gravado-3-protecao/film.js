// Clip 3 of 3: protection before, during and after paying, and what to do if it goes wrong.
// B-roll under the presenter's voice; bottom-right stays free for the webcam.
import timeline from './timeline.data.js';
import {
  C, FONTS, clamp01, smooth, out3, inOut, lerp, fadeIn, fadeOut, win, pulse,
  T, S, box, path, check, card, terminal, termGeo, chapter, grain, phone, notif, fingerprint, toggle, eye,
} from '../aprox-shared/common.js';

export const needs = [
  'antes.tres', 'antes.antes', 'antes.show', 'antes.carteira',
  'hora.visor', 'hora.vista', 'hora.desconfia', 'hora.cubra',
  'depois.confere', 'depois.notifica',
  'errado.errado', 'errado.bloqueia', 'errado.liga', 'errado.contesta',
];
const M = Object.fromEntries(needs.map((k) => [k, timeline.marks?.[k]]));
const SC = Object.fromEntries(timeline.scenes.map((s) => [s.id, s]));

// ---- Persistent timeline: Antes · Na hora · Depois ----
const STOPS = [
  { id: 'antes', x: 420, label: 'Antes' },
  { id: 'hora', x: 860, label: 'Na hora' },
  { id: 'depois', x: 1300, label: 'Depois' },
];
const LINE_Y = 210;
function drawTimeline(g, t) {
  const a = fadeIn(t, M['antes.tres'], 0.5) * fadeOut(t, SC.errado.start, 0.5);
  if (a <= 0) return;
  const grow = out3((t - M['antes.tres']) / 1.2);
  path(g, [[STOPS[0].x, LINE_Y], [lerp(STOPS[0].x, STOPS[2].x, grow), LINE_Y]], { color: C.fio2, width: 3, alpha: a });
  // progress
  const idx = t < SC.hora.start ? 0 : t < SC.depois.start ? 1 : 2;
  let px = STOPS[0].x;
  for (let i = 1; i < 3; i++) px = lerp(px, STOPS[i].x, inOut((t - SC[STOPS[i].id].start + 0.2) / 0.8));
  path(g, [[STOPS[0].x, LINE_Y], [px, LINE_Y]], { color: C.ink, width: 4, alpha: a * fadeIn(t, M['antes.antes'] - 0.3, 0.4) });
  STOPS.forEach((s, i) => {
    const on = fadeIn(t, M['antes.tres'] + 0.3 + i * 0.3, 0.3);
    const active = i === idx ? 1 : 0;
    const done = i < idx;
    g.dot(s.x, LINE_Y, 16 + 6 * active, { color: active || done ? C.ink : C.paper3, alpha: a * on });
    g.circle(s.x, LINE_Y, 16 + 6 * active, { color: C.ink, width: 2.5, alpha: a * on });
    S(g, s.label, s.x, LINE_Y - 40, active ? 44 : 34, { weight: 600, color: active ? C.ink : C.ink3, alpha: a * on });
  });
}

// ---- Antes ----
function drawAntes(g, t) {
  const a = fadeIn(t, M['antes.antes'] - 0.2, 0.4) * fadeOut(t, SC.hora.start, 0.4);
  if (a <= 0) return;
  const px = 300, py = 300, pw = 400, ph = 440;
  phone(g, px, py, { alpha: a, w: pw, h: ph });
  T(g, 'Ajustes do cartão', px + pw / 2, py + 92, 24, { weight: 600, alpha: a });
  const rows = [
    { y: py + 150, label: 'Notificações', sub: 'de compra', on: smooth((t - M['antes.antes'] - 0.8) / 0.35) },
    { y: py + 260, label: 'Aproximação', sub: 'pagamento sem contato', on: 1 - smooth((t - M['antes.show'] - 0.6) / 0.35) },
  ];
  rows.forEach((r, i) => {
    const vis = i === 0 ? a : a * Math.max(0.35, fadeIn(t, M['antes.show'] - 0.2, 0.3));
    T(g, r.label, px + 40, r.y + 22, 24, { align: 'left', weight: 600, alpha: vis });
    T(g, r.sub, px + 40, r.y + 52, 19, { align: 'left', color: C.ink3, alpha: vis });
    toggle(g, px + pw - 140, r.y, r.on, { alpha: vis });
  });
  // right-hand captions, one per tip
  const tips = [
    { at: M['antes.antes'], z: M['antes.show'], big: 'Ative as notificações', small: 'cada compra avisa na hora' },
    { at: M['antes.show'], z: M['antes.carteira'], big: 'Show ou bloco?', small: 'desative a aproximação por um tempo' },
  ];
  tips.forEach((tp) => {
    const ta = win(t, tp.at + 0.2, tp.z - 0.1, 0.35) * a;
    if (ta <= 0) return;
    S(g, tp.big, 820, 480, 58, { align: 'left', weight: 600, alpha: ta });
    T(g, tp.small, 820, 530, 28, { align: 'left', color: C.ink2, alpha: ta });
  });
  const ca = fadeIn(t, M['antes.carteira'] + 0.1, 0.4) * a;
  if (ca > 0) {
    box(g, 820, 330, 200, 200, { fill: C.paper2, stroke: C.ink, width: 2.5, alpha: ca, radius: 100 });
    fingerprint(g, 920, 420, 150, { alpha: ca });
    const ok = clamp01((t - M['antes.carteira'] - 1.2) / 0.4);
    if (ok > 0) { g.dot(1000, 350, 28, { color: C.ink, alpha: ca }); check(g, 1000, 352, 28, ok, { color: C.paper, alpha: ca }); }
    S(g, 'Ou use a carteira do celular', 820, 610, 50, { align: 'left', weight: 600, alpha: ca });
    T(g, 'ela pede biometria ou senha para pagar', 820, 658, 28, { align: 'left', color: C.ink2, alpha: ca });
  }
}

// ---- Na hora ----
const TX = 330, TY = 290;
const G = termGeo(TX, TY);
function drawHora(g, t) {
  const a = fadeIn(t, SC.hora.start + 0.1, 0.4) * fadeOut(t, SC.depois.start, 0.4);
  if (a <= 0) return;
  const typing = t >= M['hora.cubra'] + 0.6;
  const n = typing ? Math.min(4, Math.floor((t - M['hora.cubra'] - 0.6) / 0.35) + 1) : 0;
  terminal(g, TX, TY, {
    alpha: a,
    screen: t < M['hora.cubra'] + 0.3
      ? [{ text: 'R$ 38,90', size: 50, serif: true, y: 96 }, { text: 'Confira o valor', size: 20, weight: 400, y: 140 }]
      : [{ text: 'Senha', size: 24, weight: 400, y: 70 }, { text: '*'.repeat(n) || ' ', size: 50, y: 134 }],
  });
  // magnifier ring on the amount
  const va = win(t, M['hora.visor'] + 0.1, M['hora.vista'], 0.35) * a;
  if (va > 0) {
    const [sx, sy, sw, sh] = G.screen;
    g.circle(sx + sw / 2, sy + sh / 2, 125 + 6 * Math.sin(t * 3), { color: C.ink, width: 4, alpha: va });
  }
  // your card stays in your hand
  const ha = fadeIn(t, M['hora.vista'], 0.4) * fadeOut(t, M['hora.cubra'] - 0.1, 0.35) * a;
  if (ha > 0) {
    const bob = 6 * Math.sin(t * 2.2);
    card(g, 870, 360 + bob, { s: 0.7, rot: -0.06, alpha: ha });
    eye(g, 870, 500, 44, 870, 360, { alpha: ha, color: C.ink });
  }
  // a hand covers the keypad
  const ca = fadeIn(t, M['hora.cubra'], 0.4) * a;
  if (ca > 0) {
    const [kx, ky, kw, kh] = G.pad;
    const slide = out3((t - M['hora.cubra']) / 0.6);
    const hx = lerp(kx + kw + 200, kx - 20, slide);
    box(g, hx, ky - 20, kw + 40, kh * 0.62, { fill: C.paper3, stroke: C.ink, width: 2.5, alpha: ca, radius: 40 });
    T(g, 'mão por cima', hx + (kw + 40) / 2, ky + kh * 0.31 - 10, 22, { weight: 600, color: C.ink2, alpha: ca });
  }
  const tips = [
    { at: M['hora.visor'], z: M['hora.vista'], big: 'Olhe o valor no visor', small: 'antes de aproximar' },
    { at: M['hora.vista'], z: M['hora.desconfia'], big: 'O cartão fica com você', small: 'você mesmo insere e aproxima' },
    { at: M['hora.desconfia'], z: M['hora.cubra'], big: '“Fora do ar”? Desconfie', small: 'e pague de outro jeito' },
    { at: M['hora.cubra'], z: SC.depois.start + 1, big: 'Cubra o teclado', small: 'o visor deve mostrar só asteriscos' },
  ];
  tips.forEach((tp, i) => {
    const ta = win(t, tp.at + 0.2, tp.z - 0.1, 0.35) * a;
    if (ta <= 0) return;
    // the hand sits at 740-1000 from "vista" until "cubra": tips 1 and 2 go beside it
    const side = i === 1 || i === 2;
    const x = side ? 1020 : 820;
    S(g, tp.big, x, side ? 600 : 480, 58, { align: 'left', weight: 600, alpha: ta });
    T(g, tp.small, x, side ? 650 : 530, 28, { align: 'left', color: C.ink2, alpha: ta });
  });
}

// ---- Depois ----
function drawDepois(g, t) {
  const a = fadeIn(t, SC.depois.start + 0.1, 0.4) * fadeOut(t, SC.errado.start, 0.4);
  if (a <= 0) return;
  // compare the card you got back
  const ca = fadeIn(t, M['depois.confere'], 0.4) * a;
  card(g, 470, 420, { s: 0.85, alpha: ca, rot: -0.03 });
  const zoom = smooth((t - M['depois.confere'] - 0.7) / 0.4);
  if (zoom > 0) {
    box(g, 498, 416, 110, 44, { stroke: C.ink, width: 3, alpha: ca * zoom, radius: 10 });
    g.dot(470, 590, 26, { color: C.ink, alpha: ca * zoom });
    check(g, 470, 592, 26, clamp01((t - M['depois.confere'] - 1.0) / 0.3), { color: C.paper, alpha: ca });
    T(g, 'final 4821: é o seu', 470, 660, 26, { weight: 600, alpha: ca * zoom });
  }
  // the notification
  const na = fadeIn(t, M['depois.notifica'], 0.4) * a;
  if (na > 0) {
    const px = 860, py = 290;
    phone(g, px, py, { alpha: na, w: 380, h: 440 });
    const drop = out3((t - M['depois.notifica'] - 0.3) / 0.5);
    notif(g, px + 30, py + lerp(40, 110, drop), 320, { title: 'Compra aprovada', body: 'R$ 38,90 · Lanchonete', alpha: na * drop });
    const ok = clamp01((t - M['depois.notifica'] - 1.2) / 0.3);
    if (ok > 0) {
      T(g, 'valor confere', px + 190, py + 300, 26, { weight: 600, alpha: na });
      g.dot(px + 190, py + 360, 26, { color: C.ink, alpha: na });
      check(g, px + 190, py + 362, 26, ok, { color: C.paper, alpha: na });
    }
  }
}

// ---- Se der errado ----
const STEPS = [
  { k: 'errado.bloqueia', label: 'Bloqueie', sub: 'no app do banco' },
  { k: 'errado.liga', label: 'Ligue', sub: 'para o banco' },
  { k: 'errado.contesta', label: 'Conteste', sub: 'a compra' },
];
function lockIcon(g, x, y, s, a) {
  box(g, x - s * 0.4, y - s * 0.05, s * 0.8, s * 0.6, { fill: C.ink, alpha: a, radius: s * 0.1 });
  const ctx = g.ctx;
  ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = s * 0.1;
  ctx.beginPath(); ctx.arc(x, y - s * 0.12, s * 0.24, Math.PI, 0); ctx.lineTo(x + s * 0.24, y); ctx.moveTo(x - s * 0.24, y - s * 0.12); ctx.lineTo(x - s * 0.24, y); ctx.stroke();
}
function callIcon(g, x, y, s, a) {
  box(g, x - s * 0.22, y - s * 0.4, s * 0.44, s * 0.8, { stroke: C.ink, width: s * 0.08, alpha: a, radius: s * 0.1 });
  const ctx = g.ctx;
  ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = s * 0.06;
  for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.arc(x + s * 0.2, y - s * 0.2, s * (0.22 + i * 0.14), -1.2, -0.1); ctx.stroke(); }
}
function docIcon(g, x, y, s, a) {
  box(g, x - s * 0.3, y - s * 0.4, s * 0.6, s * 0.8, { stroke: C.ink, width: s * 0.08, alpha: a, radius: s * 0.06 });
  for (let i = 0; i < 3; i++) path(g, [[x - s * 0.16, y - s * 0.16 + i * s * 0.16], [x + s * 0.16, y - s * 0.16 + i * s * 0.16]], { color: C.ink, width: s * 0.06, alpha: a });
}
function drawErrado(g, t) {
  const a = fadeIn(t, M['errado.errado'] - 0.2, 0.4);
  if (a <= 0) return;
  S(g, 'Se der errado, não espere', 96, 230, 64, { align: 'left', weight: 600, alpha: a });
  STEPS.forEach((s, i) => {
    const x = 240 + i * 360, y = 420;
    const sa = fadeIn(t, M[s.k], 0.35);
    if (sa <= 0) return;
    const pop = 1 + 0.12 * pulse(t, M[s.k], 0.6);
    box(g, x - 90 * pop, y - 90 * pop, 180 * pop, 180 * pop, { fill: C.paper2, stroke: C.ink, width: 2.5, alpha: sa, radius: 90 * pop });
    [lockIcon, callIcon, docIcon][i](g, x, y, 90, sa);
    T(g, `${i + 1}`, x - 70, y - 70, 22, { weight: 600, color: C.ink3, alpha: sa });
    S(g, s.label, x, y + 150, 44, { weight: 600, alpha: sa });
    T(g, s.sub, x, y + 190, 24, { color: C.ink2, alpha: sa });
    if (i < 2) {
      const ar = out3((t - M[STEPS[i + 1].k] + 0.4) / 0.4);
      if (ar > 0) path(g, [[x + 110, y], [x + 110 + 140 * ar, y]], { color: C.ink, width: 3, alpha: sa });
      if (ar > 0.95) path(g, [[x + 236, y - 12], [x + 250, y], [x + 236, y + 12]], { color: C.ink, width: 3, alpha: sa });
    }
  });
  // loss meter: acting fast vs waiting
  const ma = fadeIn(t, M['errado.errado'] + 0.3, 0.4);
  const start = M['errado.errado'] + 0.3;
  const stop = M['errado.bloqueia'] + 0.4;
  const rate = 160;
  const fast = Math.max(0, Math.min(t, stop) - start) * rate;
  // frozen once the closing line appears: the recorded voice keeps talking for ~20 s after
  const tw = Math.min(t, M['errado.contesta'] + 1.4);
  const slow = Math.max(0, tw - start) * rate * (1 + Math.max(0, tw - stop) * 0.35);
  const X = 1280, W = 120, BASE = 700, SCALE = 0.085;
  if (ma > 0) {
    T(g, 'prejuízo', X + W, 250, 24, { color: C.ink3, weight: 600, letterSpacing: 2, alpha: ma });
    const hs = Math.min(360, slow * SCALE), hf = Math.min(390, fast * SCALE);
    box(g, X - 10, BASE - hs, W, hs, { fill: C.paper3, stroke: C.ink3, width: 2, dash: [8, 6], alpha: ma, radius: 6 });
    box(g, X + W + 20, BASE - hf, W, hf, { fill: C.ink, alpha: ma, radius: 6 });
    T(g, 'esperando', X + 50, BASE + 36, 21, { color: C.ink3, alpha: ma });
    T(g, 'agindo logo', X + W + 80, BASE + 36, 21, { weight: 600, alpha: ma });
    T(g, brl0s(slow), X + 50, BASE - hs - 16, 22, { color: C.ink3, weight: 600, alpha: ma });
    T(g, brl0s(fast), X + W + 80, BASE - hf - 16, 22, { weight: 600, alpha: ma });
  }
  const end = fadeIn(t, M['errado.contesta'] + 1.4, 0.5);
  if (end > 0) S(g, 'Quanto antes, menor o prejuízo.', 96, 900, 52, { align: 'left', weight: 600, alpha: end });
}
const brl0s = (v) => 'R$ ' + Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

function drawHook(g, t) {
  const H = timeline.texts.find((x) => x.id === 'hook');
  // on screen from frame 0: it is the thumbnail
  const a = 1 - smooth((t - H.to) / 0.4);
  if (a <= 0) return;
  S(g, 'Como se proteger', 960, 120, 88, { weight: 600, alpha: a });
}

export default {
  width: 1920,
  height: 1080,
  duration: timeline.duration,
  background: C.paper,
  cuts: [],
  holds: [],
  timeline,
  needs,
  waivers: [],
  cues: [
    { id: 'wallet', at: M['antes.carteira'] + 0.1, box: [820, 330, 200, 200] },
    { id: 'hand', at: M['hora.vista'], box: [740, 270, 260, 290] },
    { id: 'notif', at: M['depois.notifica'], box: [860, 290, 380, 440] },
    { id: 'block', at: M['errado.bloqueia'], box: [150, 330, 180, 180] },
    { id: 'contest', at: M['errado.contesta'], box: [870, 330, 180, 180] },
  ],
  fonts: FONTS,
  render(g, t) {
    g.clear(C.paper);
    grain(g, t);
    drawHook(g, t);
    drawTimeline(g, t);
    drawAntes(g, t);
    drawHora(g, t);
    drawDepois(g, t);
    drawErrado(g, t);
    chapter(g, t, timeline.scenes, { antes: 'Antes de sair', hora: 'Na hora de pagar', depois: 'Depois', errado: 'Se der errado' });
  },
};
