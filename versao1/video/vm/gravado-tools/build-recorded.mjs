// Builds a vm timeline from a real recording instead of Kokoro.
// Word times come from faster-whisper (trans/*.json); marks are chosen by hand
// in recorded.json, as absolute times in the source recording.
// Usage: node build-recorded.mjs <film-id>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildTimeline, applyExtras } from '/home/tideman/.claude/skills/videomaking/src/timeline.js';

const W = '/mnt/data/videomaking/seguranca-ext';
const VIDEO = '/mnt/data/Projetos/mack-projs/2sem2026-codigos/seguranca-ext/versao1/video';
const REPO = '/mnt/data/Projetos/ai-projs/videomaking-skill';
const FILMS = path.join(REPO, 'films');
const spec = JSON.parse(fs.readFileSync(path.join(W, 'scripts/recorded.json'), 'utf8'));
const id = process.argv[2];
const f = spec.films[id];
if (!f) throw new Error(`unknown film ${id}`);

// Flatten whisper words, apply name fixes ("firma ban" -> "Febraban").
const raw = JSON.parse(fs.readFileSync(path.join(W, 'trans', f.trans), 'utf8'))
  .flatMap((s) => s.words.map((w) => ({ text: w.w.trim(), start: w.s, end: w.e })));
const words = [];
for (const w of raw) {
  if (w.text in spec.fixes) {
    const to = spec.fixes[w.text];
    if (to === null) { words[words.length - 1].end = w.end; continue; }
    words.push({ ...w, text: to });
  } else words.push(w);
}

const scenesIn = f.scenes.map((s, i) => ({ ...s, stop: i + 1 < f.scenes.length ? f.scenes[i + 1].start : f.t1 }));
const voices = {};
const script = { title: f.title, scenes: [] };
const md = [`# ${f.title}`, '', '> Gerado de build-recorded.mjs: fala real transcrita (faster-whisper), marcas escolhidas à mão.', ''];

for (const s of scenesIn) {
  const ws = words.filter((w) => w.start >= s.start && w.start < s.stop);
  if (!ws.length) throw new Error(`scene ${s.id} has no words`);
  const v0 = ws[0].start;
  const vEnd = Math.min(ws[ws.length - 1].end, s.stop);
  // Sentence chunks for vo[] and captions.
  const chunks = [];
  let cur = [];
  for (const w of ws) {
    cur.push(w);
    if (/[.?!]$/.test(w.text)) { chunks.push(cur); cur = []; }
  }
  if (cur.length) chunks.push(cur);
  voices[s.id] = {
    duration: vEnd - v0,
    words: ws.map((w) => ({ text: w.text, spoken: w.text, start: w.start - v0, end: Math.min(w.end, vEnd) - v0 })),
    marks: Object.fromEntries(Object.entries(s.marks).map(([k, t]) => [k, t - v0])),
    chunks: chunks.map((c) => ({ text: c.map((w) => w.text).join(' '), start: c[0].start - v0, end: Math.min(c[c.length - 1].end, vEnd) - v0 })),
    matchRate: null,
  };
  script.scenes.push({ id: s.id, attrs: { ...s.attrs, lead: v0 - s.start, hold: s.stop - vEnd } });

  // script.md for the record: the words actually said, with marks before the word they land on.
  const byTime = Object.entries(s.marks).sort((a, b) => a[1] - b[1]);
  const line = ws.map((w) => {
    const m = byTime.filter(([, t]) => Math.abs(t - w.start) < 0.02).map(([k]) => `[#${k}] `).join('');
    return m + w.text;
  }).join(' ');
  for (const [k, t] of byTime) {
    if (!ws.some((w) => Math.abs(t - w.start) < 0.02)) throw new Error(`mark ${s.id}.${k} at ${t} is not on a word start`);
  }
  md.push(`## ${s.id} {chapter="${s.attrs.chapter}"}`, line, '');
}

let tl = buildTimeline({ script, voices, config: { end: 0 } });
const extrasPath = path.join(FILMS, id, 'extras.json');
tl = applyExtras(tl, JSON.parse(fs.readFileSync(extrasPath, 'utf8')));
tl.meta.vo = { status: 'RECORDED', source: f.src, from: f.t0, to: f.t1 };

const out = path.join(REPO, 'out', id);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'timeline.json'), JSON.stringify(tl, null, 2));
fs.writeFileSync(path.join(FILMS, id, 'timeline.data.js'), `export default ${JSON.stringify(tl, null, 2)};\n`);
fs.writeFileSync(path.join(FILMS, id, 'script.md'), md.join('\n'));

// Narration = the real recording, cut to the same window, padded/trimmed to the timeline length.
execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(f.t0), '-t', String(tl.duration), '-i', path.join(VIDEO, f.src),
  '-vn', '-ac', '1', '-ar', '48000', '-af', `apad=whole_dur=${tl.duration}`, path.join(out, 'narration.wav')]);

console.log(JSON.stringify({ id, duration: tl.duration, wantDuration: +(f.t1 - f.t0).toFixed(3), sceneStarts: tl.scenes.map((s) => [s.id, +(s.start + f.t0).toFixed(2)]), marks: tl.marks }, null, 1));
