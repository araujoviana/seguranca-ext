// Recorded-voice version (Matheus). Clip 1 of 3: how contactless payment works, and where it is weak.
// B-roll under the presenter's voice; bottom-right stays free for the webcam.
import timeline from './timeline.data.js';
import {
  C, FONTS, clamp01, smooth, out3, inOut, lerp, fadeIn, fadeOut, win, brl,
  T, S, box, path, check, cross, card, terminal, chapter, grain,
} from '../aprox-shared/common.js';

export const needs = [
  'nfc.encosta', 'nfc.perto', 'codigo.gera', 'codigo.copia', 'codigo.abecs',
  'limite.fraco', 'limite.ate', 'limite.mao', 'limite.dinheiro',
];
const M = Object.fromEntries(needs.map((k) => [k, timeline.marks?.[k]]));
const SC = Object.fromEntries(timeline.scenes.map((s) => [s.id, s]));

const TX = 560, TY = 280;            // terminal, first two scenes
const TX2 = 150;                      // terminal after it slides left
const ORIGIN = [TX + 330 + 10, TY + 238]; // where the field starts (right side, level with the contactless mark)
const TOUCH = 1080;                   // card centre x when touching
const AWAY = 1360;
const CARD_Y = TY + 238;

const CODES = ['8F2A·C71D', '3B90·E4A6', 'D15C·7F02'];
const LIST_X = 1290, LIST_Y = 250;

const BUYS = [
  { v: 79.9, what: 'Bar' },
  { v: 120.0, what: 'Farmácia' },
  { v: 189.9, what: 'Loja' },
];
const BAR_X = 860, BAR_W = 560, BAR_MAX = 250, BAR_Y = 560;

function slideLeft(t) { return inOut((t - SC.limite.start - 0.1) / 0.9); }

function cardX(t) {
  const a = M['nfc.encosta'];
  let x = lerp(1560, TOUCH, inOut((t - a) / 1.3));
  x = lerp(x, AWAY, inOut((t - M['nfc.perto'] - 0.2) / 1.0));
  x = lerp(x, TOUCH, inOut((t - M['nfc.perto'] - 2.3) / 0.8));
  // three taps for three purchases: back off and return
  for (let i = 0; i < 3; i++) {
    const s = M['codigo.gera'] + i * 0.95 - 0.35;
    const p = clamp01((t - s) / 0.7);
    x += 70 * Math.sin(Math.PI * p);
  }
  return x;
}

// Tap times (moments the card is in the field and the terminal answers).
function taps() {
  return [
    M['nfc.encosta'] + 1.35,
    M['nfc.perto'] + 3.1,
    M['codigo.gera'] + 0.0, M['codigo.gera'] + 0.95, M['codigo.gera'] + 1.9,
  ];
}

function drawField(g, t, x0) {
  const [ox, oy] = [x0 + 340, ORIGIN[1]];
  // rings expanding from the terminal; they stop at the field's edge (~120 px)
  for (let k = 0; k < 3; k++) {
    const ph = ((t * 0.9 + k / 3) % 1);
    const r = 20 + ph * 115;
    const a = (1 - ph) * 0.55 * fadeIn(t, M['nfc.encosta'] + 0.6, 0.5) * (1 - smooth((t - SC.limite.start) / 0.4));
    if (a <= 0) continue;
    const ctx = g.ctx;
    ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ox, oy, r, -0.9, 0.9); ctx.stroke();
  }
}

function drawFieldLabels(g, t, x0) {
  const [ox, oy] = [x0 + 340, ORIGIN[1]];
  const cx = cardX(t) - 170;
  // field boundary + distance label during "perto"
  const pa = win(t, M['nfc.perto'], M['codigo.gera'] - 0.6, 0.4);
  if (pa > 0) {
    const ctx = g.ctx;
    ctx.globalAlpha = pa; ctx.strokeStyle = C.ink3; ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.arc(ox, oy, 140, -1.1, 1.1); ctx.stroke(); ctx.setLineDash([]);
    // bracket under the gap
    const by = oy + 175;
    path(g, [[ox, by - 12], [ox, by], [ox + 140, by], [ox + 140, by - 12]], { color: C.ink, width: 2.5, alpha: pa });
    T(g, 'poucos centímetros', ox, by + 40, 26, { align: 'left', weight: 600, alpha: pa });
    const out = smooth((cx - ox - 150) / 60);
    T(g, 'longe demais: nada acontece', ox, by + 78, 24, { align: 'left', color: C.red, alpha: pa * out * (1 - smooth((t - M['nfc.perto'] - 2.3) / 0.3)) });
  }
}

function screenAt(t) {
  const tp = taps().filter((x) => t >= x);
  const last = tp.length ? tp[tp.length - 1] : -99;
  if (t >= SC.limite.start) return null;
  if (t - last < 1.0 && last > 0) {
    return { lines: [{ text: 'Aprovado', size: 34, y: 112 }], ok: clamp01((t - last) / 0.4), invert: true };
  }
  return { lines: [{ text: 'R$ 38,90', size: 40, serif: true, y: 82 }, { text: 'Aproxime o cartão', size: 22, weight: 400, y: 128 }] };
}

function drawStageA(g, t) {
  const sl = slideLeft(t);
  const x0 = lerp(TX, TX2, sl);
  drawField(g, t, x0);
  if (t < SC.limite.start + 1.05) {
    const sc = screenAt(t) ?? { lines: [] };
    const geo = terminal(g, x0, TY, { screen: sc.lines, screenInvert: !!sc.invert });
    if (sc.ok !== undefined) check(g, geo.screen[0] + geo.screen[2] / 2, geo.screen[1] + 58, 44, sc.ok, { color: C.paper });
  }
  drawFieldLabels(g, t, x0);
  // card (scenes 1-2)
  const ca = fadeIn(t, M['nfc.encosta'] - 0.2, 0.3) * fadeOut(t, SC.limite.start, 0.35);
  if (ca > 0) card(g, cardX(t), CARD_Y, { alpha: ca, rot: -0.04 });
}

function drawCodes(g, t) {
  const leave = fadeOut(t, SC.limite.start - 0.1, 0.4);
  if (leave <= 0) return;
  const ha = fadeIn(t, M['codigo.gera'], 0.3) * leave;
  T(g, 'cada compra, um código novo', LIST_X, LIST_Y - 40, 26, { align: 'left', weight: 600, color: C.ink2, alpha: ha });
  CODES.forEach((code, i) => {
    const s = M['codigo.gera'] + i * 0.95 + 0.1;
    if (t < s) return;
    const p = out3((t - s) / 0.7);
    const fx = TX + 165, fy = TY + 120;
    const x = lerp(fx, LIST_X, p), y = lerp(fy, LIST_Y + i * 84, p);
    const a = Math.min(1, (t - s) / 0.15) * leave;
    box(g, x, y, 300, 62, { fill: C.paper, stroke: C.ink, width: 2, alpha: a, radius: 12 });
    T(g, code, x + 24, y + 41, 27, { align: 'left', weight: 600, letterSpacing: 2, alpha: a });
    T(g, `compra ${i + 1}`, x + 284, y + 41, 19, { align: 'right', color: C.ink3, alpha: a });
  });
  // the copied code is replayed and refused
  const cp = M['codigo.copia'];
  if (t >= cp) {
    const a = fadeIn(t, cp, 0.3) * leave;
    const x = LIST_X + 40, y = LIST_Y + 300;
    box(g, x, y, 300, 62, { fill: C.paper, stroke: C.red, width: 2.5, dash: [9, 7], alpha: a, radius: 12 });
    T(g, CODES[0], x + 24, y + 41, 27, { align: 'left', weight: 600, letterSpacing: 2, color: C.red, alpha: a });
    T(g, 'cópia', x + 284, y + 41, 19, { align: 'right', color: C.red, alpha: a });
    const rp = clamp01((t - cp - 1.5) / 0.4);
    cross(g, x + 340, y + 31, 34, rp, { color: C.red, alpha: a });
    T(g, 'recusado: esse código já foi usado', x, y + 104, 24, { align: 'left', color: C.red, weight: 600, alpha: a * fadeIn(t, cp + 1.7, 0.4) });
  }
  // source note
  const ab = fadeIn(t, M['codigo.abecs'], 0.5) * leave;
  if (ab > 0) {
    path(g, [[TX - 400, 960], [TX - 400, 1010]], { color: C.ink, width: 3, alpha: ab });
    S(g, 'Abecs, 2020: nenhum problema significativo de segurança', TX - 380, 996, 34, { align: 'left', alpha: ab });
  }
}

function drawLimit(g, t) {
  const a0 = fadeIn(t, M['limite.fraco'], 0.5);
  if (a0 <= 0) return;
  // forgotten card on the table
  const pick = inOut((t - M['limite.mao']) / 1.0);
  const restX = 1110, restY = 300;
  const termGeoX = TX2 + 340 + 160, termGeoY = TY + 238;
  const cx = lerp(restX, termGeoX, pick), cy = lerp(restY, termGeoY, pick);
  const fadeCard = fadeIn(t, M['limite.fraco'] + 0.2, 0.5);
  // table line
  path(g, [[860, 420], [1400, 420]], { color: C.fio2, width: 2, alpha: fadeCard * (1 - pick) });
  T(g, 'esquecido na mesa', restX, 470, 24, { color: C.ink3, alpha: fadeCard * (1 - smooth((t - M['limite.mao']) / 0.3)) });
  card(g, cx, cy, { alpha: fadeCard, rot: lerp(-0.08, -0.04, pick), s: 0.82 });
  // stranger's dashed red outline once picked up
  const sa = fadeIn(t, M['limite.mao'] + 0.2, 0.4);
  if (sa > 0) {
    box(g, cx - 155, cy - 100, 310, 200, { stroke: C.red, width: 3, dash: [10, 8], alpha: sa, radius: 22 });
    T(g, 'outra pessoa', cx, cy - 122, 26, { color: C.red, weight: 600, alpha: sa });
  }

  // terminal on the left keeps answering
  const buyT = BUYS.map((_, i) => M['limite.mao'] + 1.0 + i * 0.85);
  const last = buyT.filter((x) => t >= x).pop();
  const ok = last !== undefined && t - last < 0.8;
  const geo = terminal(g, TX2, TY, {
    alpha: t >= SC.limite.start + 1.05 ? 1 : 0,
    screenInvert: ok,
    screen: ok ? [{ text: 'Aprovado', size: 34, y: 112 }] : [{ text: 'Sem senha', size: 30, y: 82 }, { text: 'até R$ 200', size: 26, weight: 400, y: 126 }],
  });
  if (ok) check(g, geo.screen[0] + geo.screen[2] / 2, geo.screen[1] + 58, 44, clamp01((t - last) / 0.3), { color: C.paper });

  // limit chart
  const ca = fadeIn(t, M['limite.ate'], 0.5);
  if (ca <= 0) return;
  const lx = BAR_X + (200 / BAR_MAX) * BAR_W;
  const ly0 = BAR_Y - 30, ly1 = BAR_Y + 3 * 74 + 10;
  path(g, [[lx, ly0], [lx, lerp(ly0, ly1, out3((t - M['limite.ate']) / 0.8))]], { color: C.ink, width: 2.5, dash: [10, 8], alpha: ca });
  T(g, 'limite sem senha', lx + 14, ly0 + 4, 22, { align: 'left', weight: 600, alpha: ca });
  T(g, 'cerca de R$ 200 (varia por banco)', lx + 14, ly0 + 32, 20, { align: 'left', color: C.ink3, alpha: ca });
  BUYS.forEach((b, i) => {
    const s = buyT[i];
    const y = BAR_Y + i * 74;
    const ghost = fadeIn(t, M['limite.ate'] + 0.2 + i * 0.1, 0.4);
    box(g, BAR_X, y, BAR_W * (200 / BAR_MAX), 52, { fill: C.paper2, alpha: ghost * 0.9, radius: 8 });
    if (t < s) return;
    const p = out3((t - s) / 0.6);
    const w = (b.v / BAR_MAX) * BAR_W * p;
    box(g, BAR_X, y, w, 52, { fill: C.ink, alpha: 1, radius: 8 });
    T(g, `${b.what}  ${brl(b.v)}`, BAR_X + 18, y + 35, 23, { align: 'left', color: C.paper, weight: 600, alpha: clamp01((t - s - 0.2) / 0.3) });
  });
  // running total: the hero
  const total = BUYS.reduce((acc, b, i) => acc + b.v * out3((t - buyT[i]) / 0.6), 0);
  const ta = fadeIn(t, buyT[0], 0.4);
  if (ta > 0) {
    T(g, 'gasto por outra pessoa, sem digitar senha', BAR_X, 830, 24, { align: 'left', color: C.ink3, alpha: ta });
    S(g, brl(total), BAR_X, 920, 92, { align: 'left', weight: 600, color: total > 300 ? C.red : C.ink, alpha: ta });
  }
  const ha = fadeIn(t, M['limite.dinheiro'] + 0.2, 0.5);
  if (ha > 0) {
    const u = out3((t - M['limite.dinheiro'] - 0.2) / 0.6);
    path(g, [[BAR_X, 945], [BAR_X + 400 * u, 945]], { color: C.red, width: 4, alpha: ha });
    S(g, 'funciona quase como dinheiro', BAR_X, 1000, 40, { align: 'left', color: C.ink2, alpha: ha });
  }
}

function drawHook(g, t) {
  const H = timeline.texts.find((x) => x.id === 'hook');
  const a = fadeIn(t, H.from - 0.3, 0.3) * (1 - smooth((t - H.to) / 0.4));
  if (a <= 0) return;
  S(g, 'Encostou, pagou.', 960, 190, 84, { weight: 600, alpha: a });
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
    { id: 'approved', at: M['nfc.encosta'] + 1.35, box: [590, 316, 270, 170] },
    { id: 'list_head', at: M['codigo.gera'], box: [1290, 185, 360, 40] },
    { id: 'copy', at: M['codigo.copia'], box: [1330, 550, 300, 62] },
    { id: 'abecs', at: M['codigo.abecs'], box: [150, 950, 1100, 70] },
    { id: 'limit', at: M['limite.ate'], box: [1240, 520, 200, 220] },
    { id: 'stranger', at: M['limite.mao'], box: [860, 180, 560, 320] },
  ],
  fonts: FONTS,
  render(g, t) {
    g.clear(C.paper);
    grain(g, t);
    drawHook(g, t);
    drawStageA(g, t);
    drawCodes(g, t);
    drawLimit(g, t);
    chapter(g, t, timeline.scenes, { nfc: 'A tecnologia', codigo: 'Um código por compra', limite: 'O ponto fraco' });
  },
};
