// Clip 2 of 3: the "broken terminal" scam, the three signs, and the damage.
// B-roll under the presenter's voice; bottom-right stays free for the webcam.
import timeline from './timeline.data.js';
import {
  C, FONTS, clamp01, smooth, out3, inOut, lerp, fadeIn, fadeOut, win, pulse, brl,
  T, S, box, path, card, terminal, termGeo, chapter, grain, phone, notif, bell, eye,
} from '../aprox-shared/common.js';

export const needs = [
  'pede.fora', 'pede.insere', 'troca.olho', 'troca.itau', 'troca.vira', 'troca.troca',
  'sinais.sinais', 'sinais.s1', 'sinais.s2', 'sinais.s3', 'sinais.febraban',
  'estrago.tem', 'estrago.limite', 'estrago.compras', 'estrago.silencio', 'estrago.descobre',
];
const M = Object.fromEntries(needs.map((k) => [k, timeline.marks?.[k]]));
const SC = Object.fromEntries(timeline.scenes.map((s) => [s.id, s]));

const TX = 470, TY = 200;
const G = termGeo(TX, TY);
const PIN = ['4', '7', '1', '9'];
const keyT = PIN.map((_, i) => M['pede.insere'] + 1.4 + i * 0.9);
const EYE = [1060, 430];
const PANEL = [1040, 560, 330, 250];
const STAGE_END = SC.estrago.start;

// ---- Act 1: at the counter ----
function screenLines(t) {
  const typed = keyT.filter((k) => t >= k).length;
  if (t >= M['pede.insere'] + 0.9 && t < M['troca.vira'] + 0.4) {
    return [{ text: 'Digite a senha', size: 24, weight: 400, y: 66 }, { text: '*'.repeat(typed) || ' ', size: 50, y: 132 }];
  }
  if (t >= M['troca.vira'] + 0.4) return [{ text: 'Aprovado', size: 32, y: 104 }];
  return [{ text: 'Aproximação', size: 26, y: 70 }, { text: 'indisponível', size: 26, y: 106 }, { text: 'Insira o cartão', size: 20, weight: 400, y: 146, color: C.red }];
}

function realCardPos(t) {
  // into the slot, out again, over to the attendant, behind the panel, then up to his pocket
  const slotX = G.slot[0], inY = G.slot[1] + 110;
  let x = 330, y = 930, rot = -Math.PI / 2;
  const pIn = inOut((t - M['pede.insere'] - 0.1) / 0.9);
  x = lerp(330, slotX, pIn); y = lerp(930, inY, pIn);
  const pOut = inOut((t - M['troca.vira']) / 0.7);
  y = lerp(y, G.slot[1] + 150, pOut);
  const pGo = inOut((t - M['troca.vira'] - 0.6) / 1.1);
  x = lerp(x, PANEL[0] + PANEL[2] / 2, pGo); y = lerp(y, PANEL[1] + PANEL[3] / 2, pGo); rot = lerp(rot, 0, pGo);
  const pUp = inOut((t - M['troca.troca'] - 0.2) / 1.1);
  x = lerp(x, 1290, pUp); y = lerp(y, 300, pUp); rot = lerp(rot, 0.12, pUp);
  return { x, y, rot };
}
function fakeCardPos(t) {
  const p = inOut((t - M['troca.troca'] - 0.2) / 1.3);
  return { x: lerp(PANEL[0] + PANEL[2] / 2, 250, p), y: lerp(PANEL[1] + PANEL[3] / 2, 900, p), rot: lerp(0, -0.06, p), a: p > 0 ? 1 : 0 };
}

function drawCounter(g, t) {
  const leave = fadeOut(t, STAGE_END - 0.1, 0.5);
  if (leave <= 0) return;
  const a0 = leave;

  // speech bubble from the attendant
  const ba = win(t, M['pede.fora'] - 0.1, M['troca.olho'] - 0.3, 0.35) * a0;
  if (ba > 0) {
    box(g, 900, 230, 520, 120, { fill: C.paper, stroke: C.ink, width: 2.5, alpha: ba, radius: 22 });
    path(g, [[930, 350], [910, 395], [985, 350]], { color: C.ink, width: 2.5, alpha: ba, fill: C.paper });
    path(g, [[933, 348], [982, 348]], { color: C.paper, width: 5, alpha: ba });
    S(g, '“A aproximação está', 1160, 282, 34, { alpha: ba });
    S(g, 'fora do ar.”', 1160, 324, 34, { alpha: ba });
    T(g, 'atendente', 1160, 205, 22, { color: C.ink3, weight: 600, letterSpacing: 2, alpha: ba });
  }

  // real card (drawn before terminal so the slot hides it)
  const rc = realCardPos(t);
  const rcA = fadeIn(t, M['pede.insere'] - 0.1, 0.2) * a0;
  const behind = t >= M['troca.vira'] + 1.3 && t < M['troca.troca'] + 0.3;
  card(g, rc.x, rc.y, { rot: rc.rot, alpha: rcA, s: 0.8 });

  const typed = keyT.filter((k) => t >= k);
  const lastKey = typed.length ? PIN[typed.length - 1] : null;
  const lit = lastKey ? 1 - smooth((t - keyT[typed.length - 1] - 0.25) / 0.3) : 0;
  const approved = t >= M['troca.vira'] + 0.4;
  terminal(g, TX, TY, { alpha: a0, screen: screenLines(t), screenInvert: approved, keysLit: lastKey ? [lastKey] : [], keyLit: lit, slot: t > M['pede.insere'] + 0.8 && t < M['troca.vira'] + 0.4 });

  // the eye watches the keypad
  const ea = fadeIn(t, M['troca.olho'], 0.4) * a0;
  if (ea > 0) {
    const look = lastKey ? G.key(lastKey) : [G.pad[0] + 120, G.pad[1] + 120];
    const target = t >= M['troca.vira'] ? [rc.x, rc.y] : look;
    path(g, [[EYE[0] - 70, EYE[1] + 10], [G.pad[0] + G.pad[2] + 10, G.pad[1] + 80]], { color: C.red, width: 2, dash: [6, 10], alpha: ea * 0.7 * (1 - smooth((t - M['troca.vira']) / 0.4)) });
    eye(g, EYE[0], EYE[1], 56, target[0], target[1], { alpha: ea });
    const seen = typed.length;
    T(g, 'senha vista', EYE[0] + 90, EYE[1] - 8, 22, { align: 'left', color: C.red, weight: 600, alpha: ea });
    S(g, PIN.slice(0, seen).join(' ') + ' _'.repeat(4 - seen).trimEnd(), EYE[0] + 90, EYE[1] + 36, 40, { align: 'left', color: C.red, weight: 600, alpha: ea });
  }

  // the panel: "de costas"
  const pa = fadeIn(t, M['troca.vira'] + 0.7, 0.4) * fadeOut(t, M['troca.troca'] + 1.6, 0.5) * a0;
  if (pa > 0) {
    box(g, PANEL[0], PANEL[1], PANEL[2], PANEL[3], { fill: C.paper3, stroke: C.ink, width: 2.5, alpha: pa, radius: 18 });
    T(g, 'de costas', PANEL[0] + PANEL[2] / 2, PANEL[1] + PANEL[3] / 2 + 10, 30, { weight: 600, color: C.ink2, alpha: pa });
  }
  if (!behind && t >= M['troca.troca'] + 0.3) card(g, rc.x, rc.y, { rot: rc.rot, alpha: rcA, s: 0.8 });

  // the look-alike card coming back
  const fc = fakeCardPos(t);
  const fa = fc.a * a0;
  if (fa > 0 && t >= M['troca.troca'] + 0.3) card(g, fc.x, fc.y, { rot: fc.rot, alpha: fa, s: 0.8, last: '7730', fake: true });
  const la = fadeIn(t, M['troca.troca'] + 1.3, 0.4) * a0;
  if (la > 0) {
    T(g, 'parecido, mas não é o seu', fc.x, fc.y - 110, 24, { weight: 600, alpha: la });
    T(g, 'fica com o verdadeiro', rc.x, rc.y - 110, 24, { weight: 600, color: C.red, alpha: la });
  }
}

// ---- Act 2: the signs, pinned on the same picture ----
const SIGNS = [
  { k: 'sinais.s1', at: [G.screen[0] + G.screen[2] + 4, G.screen[1] + 4], text: 'aproximação “fora do ar”' },
  { k: 'sinais.s2', at: [EYE[0] - 70, EYE[1] - 50], text: 'olhar no teclado' },
  { k: 'sinais.s3', at: [1290 - 150, 300 - 95], text: 'cartão fora da sua vista' },
];
const LEG_X = 1440, LEG_Y = 500;
function drawSigns(g, t) {
  const veil = win(t, M['sinais.sinais'] - 0.2, STAGE_END - 0.1, 0.5);
  if (veil <= 0) return;
  g.rect(0, 0, 1920, 1080, { color: C.paper, alpha: veil * 0.7 });
  T(g, 'repare nos sinais', LEG_X, LEG_Y - 40, 24, { align: 'left', color: C.ink3, weight: 600, letterSpacing: 2, alpha: veil });
  SIGNS.forEach((s, i) => {
    const a = fadeIn(t, M[s.k], 0.35) * fadeOut(t, STAGE_END - 0.1, 0.5);
    if (a <= 0) return;
    const pop = 1 + 0.25 * pulse(t, M[s.k], 0.6);
    g.dot(s.at[0], s.at[1], 30 * pop, { color: C.red, alpha: a });
    T(g, String(i + 1), s.at[0], s.at[1] + 11, 30, { color: C.paper, weight: 600, alpha: a });
    const y = LEG_Y + i * 76;
    g.dot(LEG_X + 22, y, 22, { color: C.red, alpha: a });
    T(g, String(i + 1), LEG_X + 22, y + 8, 22, { color: C.paper, weight: 600, alpha: a });
    T(g, s.text, LEG_X + 60, y + 10, 30, { align: 'left', weight: 600, alpha: a });
  });
}

// ---- Act 3: the damage ----
const BUYS = [
  { what: 'Eletrônicos', v: 2399 },
  { what: 'Saque', v: 1000 },
  { what: 'Mercado', v: 640 },
];
const LX = 640, LW = 470, LMAX = 2600;
function drawDamage(g, t) {
  const a0 = fadeIn(t, M['estrago.tem'] - 0.2, 0.5);
  if (a0 <= 0) return;
  // what the scammer holds
  card(g, 330, 330, { s: 0.85, alpha: a0, rot: -0.05 });
  const pa = fadeIn(t, M['estrago.tem'] + 0.9, 0.4);
  box(g, 200, 470, 260, 76, { fill: C.red, alpha: pa, radius: 14 });
  T(g, 'senha  4 7 1 9', 330, 520, 30, { color: C.paper, weight: 600, alpha: pa });
  T(g, 'com o golpista', 330, 200, 24, { color: C.red, weight: 600, letterSpacing: 2, alpha: a0 });

  // limit line, then broken
  const la = fadeIn(t, M['estrago.limite'] - 0.2, 0.4);
  const lx = LX + (200 / LMAX) * LW;
  const br = out3((t - M['estrago.limite'] - 0.8) / 0.6);
  if (la > 0) {
    T(g, 'limite sem senha: R$ 200', lx + 14, 236, 22, { align: 'left', weight: 600, alpha: la * (1 - br * 0.6) });
    path(g, [[lx, 250], [lx, 580]], { color: br > 0.5 ? C.red : C.ink, width: 2.5, dash: [10, 8], alpha: la * (1 - br * 0.5) });
    T(g, 'com a senha, o limite não vale', lx + 14, 268, 24, { align: 'left', color: C.red, weight: 600, alpha: la * br });
  }
  // purchases
  let total = 0;
  BUYS.forEach((b, i) => {
    const s = (i === 0 ? M['estrago.limite'] + 0.4 : M['estrago.compras'] + (i - 1) * 0.8);
    if (t < s) return;
    const p = out3((t - s) / 0.8);
    total += b.v * p;
    const y = 300 + i * 90;
    box(g, LX, y, (b.v / LMAX) * LW * p, 62, { fill: C.red, alpha: 1, radius: 8 });
    T(g, `${b.what}  ${brl(b.v)}`, LX + (b.v / LMAX) * LW * p + 16, y + 41, 24, { align: 'left', color: C.ink, weight: 600, alpha: clamp01((t - s - 0.2) / 0.3) });
  });
  const ta = fadeIn(t, M['estrago.limite'] + 0.4, 0.4);
  if (ta > 0) {
    T(g, 'prejuízo', LX, 640, 24, { align: 'left', color: C.ink3, weight: 600, letterSpacing: 2, alpha: ta });
    S(g, brl(total), LX, 730, 96, { align: 'left', weight: 600, color: C.red, alpha: ta });
  }

  // phone: silent, then the late discovery
  const ph = fadeIn(t, M['estrago.silencio'] - 0.2, 0.5);
  if (ph > 0) {
    const px = 1460, py = 130;
    phone(g, px, py, { alpha: ph, w: 300, h: 590 });
    const sil = 1 - smooth((t - M['estrago.descobre']) / 0.4);
    bell(g, px + 150, py + 240, 110, { alpha: ph * sil, off: clamp01((t - M['estrago.silencio'] - 0.3) / 0.5), color: C.ink3 });
    T(g, 'notificações', px + 150, py + 380, 22, { weight: 600, color: C.ink3, alpha: ph * sil });
    T(g, 'desligadas', px + 150, py + 410, 22, { weight: 600, color: C.ink3, alpha: ph * sil });
    // days passing
    const days = ['terça', 'quarta', 'quinta'];
    const d = Math.min(2, Math.floor(Math.max(0, t - M['estrago.silencio'] - 0.6) / 0.5));
    T(g, days[d], px + 150, py + 500, 30, { weight: 600, alpha: ph * sil * fadeIn(t, M['estrago.silencio'] + 0.6, 0.3) });
    const na = fadeIn(t, M['estrago.descobre'] + 0.2, 0.4);
    if (na > 0) {
      T(g, 'quinta-feira', px + 150, py + 110, 22, { color: C.ink3, weight: 600, alpha: na });
      notif(g, px + 26, py + 150, 248, { title: 'Compras não', body: 'reconhecidas', alpha: na, red: true });
      S(g, brl(4039), px + 150, py + 330, 46, { weight: 600, color: C.red, alpha: fadeIn(t, M['estrago.descobre'] + 0.6, 0.4) });
      T(g, 'descoberto dias depois', px + 150, py + 380, 21, { color: C.ink2, alpha: fadeIn(t, M['estrago.descobre'] + 0.9, 0.4) });
    }
  }
}

// Source notes for lines the presenter says that the clip had no picture for.
function drawSources(g, t) {
  const notes = [
    { at: M['troca.itau'], to: M['troca.vira'] - 0.2, text: 'Itaú: há maquininhas adulteradas para registrar a senha' },
    { at: M['sinais.febraban'], to: STAGE_END - 0.1, text: 'Febraban alerta para a troca de cartão' },
  ];
  for (const n of notes) {
    const a = win(t, n.at, n.to, 0.4);
    if (a <= 0) continue;
    S(g, n.text, 960, 120, 36, { alpha: a });
    path(g, [[860, 142], [1060, 142]], { color: C.ink, width: 2, alpha: a });
  }
}

function drawHook(g, t) {
  const H = timeline.texts.find((x) => x.id === 'hook');
  const a = fadeIn(t, H.from - 0.3, 0.3) * (1 - smooth((t - H.to) / 0.4));
  if (a <= 0) return;
  S(g, 'O golpe da maquininha “quebrada”', 960, 140, 84, { weight: 600, alpha: a });
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
    { id: 'eye', at: M['troca.olho'], box: [990, 360, 140, 140] },
    { id: 'panel', at: M['troca.vira'] + 0.7, box: [1040, 560, 330, 250] },
    { id: 'sign1', at: M['sinais.s1'], box: [1440, 470, 420, 60] },
    { id: 'pin', at: M['estrago.tem'] + 0.9, box: [200, 470, 260, 76] },
    { id: 'phone', at: M['estrago.silencio'] - 0.2, box: [1460, 130, 300, 590] },
  ],
  fonts: FONTS,
  render(g, t) {
    g.clear(C.paper);
    grain(g, t);
    drawHook(g, t);
    drawCounter(g, t);
    drawSigns(g, t);
    drawSources(g, t);
    drawDamage(g, t);
    chapter(g, t, timeline.scenes, { pede: 'O golpe', troca: 'A troca', sinais: 'Os sinais', estrago: 'O estrago' });
  },
};
