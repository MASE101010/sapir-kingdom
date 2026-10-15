// The reel's cards and captions, drawn on a 2D canvas over the 3D frame. Drawing them ourselves (instead of the page's
// HTML) lets a frame be read back in a tenth of a second, so a minute of reel renders in minutes on a plain machine.
// Layout: a 1080 × 1920 frame; cards stack from the top, captions sit below the middle, the subject stays in between.
const NAVY = '#13213b', GOLD = '#f2b632', CREAM = '#fffaf0', TEAL = '#0f6f73', MUTED = '#5f6b7a', RED = '#c2412d', INK = '#13213b';
const BODY = 'Rubik, sans-serif', DISPLAY = 'Crown, Rubik, sans-serif';
export const FONTS = ['800 60px Rubik', '700 40px Rubik', '400 100px Crown'];

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const backOut = x => { x = clamp(x); const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function box(g, x, y, w, h, r, fill = CREAM, line = 7, shadow = 14) {
  if (shadow) { rr(g, x, y + shadow, w, h, r); g.fillStyle = NAVY; g.fill(); }
  rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); g.lineWidth = line; g.strokeStyle = NAVY; g.stroke();
}
function text(g, s, x, y, { font, color = INK, align = 'center', dir = 'rtl', stroke = 0, strokeColor = NAVY, drop = 0 } = {}) {
  g.font = font; g.direction = dir; g.textAlign = align; g.textBaseline = 'alphabetic'; g.lineJoin = 'round';
  if (drop) { g.lineWidth = stroke; g.strokeStyle = strokeColor; g.strokeText(s, x, y + drop); g.fillStyle = strokeColor; g.fillText(s, x, y + drop); }
  if (stroke) { g.lineWidth = stroke; g.strokeStyle = strokeColor; g.strokeText(s, x, y); }
  g.fillStyle = color; g.fillText(s, x, y);
}
function pill(g, s, cx, y, { font = `800 48px ${BODY}`, fill = CREAM, pad = 36, h = 86 } = {}) {
  g.font = font; g.direction = 'rtl'; const w = g.measureText(s).width + pad * 2;
  box(g, cx - w / 2, y, w, h, h / 2, fill, 6, 8); text(g, s, cx, y + h * .66, { font }); return h + 8;
}
function wrap(g, s, font, width) {
  g.font = font; g.direction = 'rtl'; const out = []; let line = '';
  for (const w of s.split(/\s+/)) { const next = line ? `${line} ${w}` : w; if (g.measureText(next).width > width && line) { out.push(line); line = w; } else line = next; }
  if (line) out.push(line); return out;
}

/** draws one card at the top centre (cx, y); returns its height */
function card(g, c, k, cx, y) {
  const W = 900, x = cx - W / 2, R = 44;
  switch (c.type) {
    case 'title': {
      const h1 = pill(g, k.kingdom, cx, y, { font: `800 40px ${BODY}`, h: 76 });
      text(g, c.text ?? `יום ${k.day}`, cx, y + h1 + 150, { font: `400 150px ${DISPLAY}`, color: GOLD, stroke: 26, drop: 12 });
      return h1 + 190;
    }
    case 'label': return pill(g, c.text, cx, y);
    case 'note': {                                   // a story's text: a title in gold, and a few lines
      const lines = (c.text ?? '').split('\n').flatMap(l => wrap(g, l, `700 54px ${BODY}`, W - 110)), H = 150 + lines.length * 74 + (c.foot ? 70 : 0);
      box(g, x, y, W, H, R);
      text(g, c.title ?? '', cx, y + 104, { font: `400 78px ${DISPLAY}`, color: GOLD, stroke: 14, strokeColor: NAVY });
      lines.forEach((l, i) => text(g, l, cx, y + 190 + i * 74, { font: `700 54px ${BODY}` }));
      if (c.foot) text(g, c.foot, cx, y + H - 40, { font: `800 40px ${BODY}`, color: TEAL });
      return H + 14;
    }
    case 'cta': {
      text(g, c.text ?? 'מה בונים מחר?', cx, y + 120, { font: `400 120px ${DISPLAY}`, color: GOLD, stroke: 24, drop: 10 });
      return 160 + pill(g, c.sub ?? 'תגיבו בתגובות', cx, y + 160, { fill: GOLD });
    }
    case 'counter': {
      const H = 400; box(g, x, y, W, H, R);
      text(g, 'מרשם התושבים', x + W - 44, y + 74, { font: `800 42px ${BODY}`, align: 'right' });
      box(g, x + 44, y + 30, 150, 60, 30, TEAL, 0, 0); text(g, 'רשמי', x + 119, y + 72, { font: `800 32px ${BODY}`, color: '#fff' });
      text(g, `תושבים · יום ${k.day}`, x + W - 44, y + 126, { font: `700 36px ${BODY}`, color: MUTED, align: 'right' });
      const f = smooth((k.t - c.t0 - .3) / Math.max(.5, (c.t1 - c.t0) * .7)), n = Math.round((c.from ?? 0) + ((c.to ?? 0) - (c.from ?? 0)) * f);
      text(g, n.toLocaleString('he-IL'), x + W - 44, y + 280, { font: `800 160px ${BODY}`, align: 'right', dir: 'ltr' });
      const pts = [...(k.history ?? []), c.to ?? 0], max = Math.max(...pts, 1), n1 = Math.max(pts.length - 1, 1), sx = x + 60, sw = 380, sy = y + 360, sh = 150;
      g.beginPath(); pts.forEach((v, i) => { const px = sx + i / n1 * sw, py = sy - v / max * sh; i ? g.lineTo(px, py) : g.moveTo(px, py); });
      g.lineWidth = 9; g.strokeStyle = TEAL; g.lineCap = 'round'; g.stroke();
      g.beginPath(); g.arc(sx + sw, sy - (c.to ?? 0) / max * sh, 13, 0, Math.PI * 2); g.fillStyle = GOLD; g.fill(); g.lineWidth = 5; g.strokeStyle = NAVY; g.stroke();
      return H + 14;
    }
    case 'comment': {
      const lines = wrap(g, c.text, `700 50px ${BODY}`, 520).slice(0, 3), H = 190 + lines.length * 60; box(g, x, y, W, H, R);
      text(g, c.head ?? 'התגובה המנצחת', x + W - 44, y + 72, { font: `800 40px ${BODY}`, align: 'right' });
      if (c.img) g.drawImage(c.img, x + W - 44 - 130, y + 104, 130, 130);
      text(g, `@${c.u}`, x + W - 200, y + 146, { font: `800 42px ${BODY}`, align: 'right', dir: 'ltr' });
      lines.forEach((l, i) => text(g, l, x + W - 200, y + 210 + i * 60, { font: `700 50px ${BODY}`, align: 'right' }));
      if (c.likes !== null) text(g, `♥ ${Number(c.likes ?? 0).toLocaleString('he-IL')}`, x + 44, y + 160, { font: `800 46px ${BODY}`, color: RED, align: 'left', dir: 'ltr' });
      return H + 14;
    }
    case 'idcard': {
      const chips = c.honours ?? [], H = 420 + (chips.length ? 100 : 0); box(g, x, y, W, H, R);
      g.save(); rr(g, x, y, W, 100, [R, R, 0, 0]); g.fillStyle = NAVY; g.fill(); g.restore();
      text(g, 'תעודת תושב', x + W - 44, y + 66, { font: `400 46px ${DISPLAY}`, color: GOLD, align: 'right' });
      text(g, k.kingdom, x + 44, y + 64, { font: `400 34px ${DISPLAY}`, color: GOLD, align: 'left' });
      if (c.img) g.drawImage(c.img, x + W - 44 - 210, y + 140, 210, 210);
      const fx = x + W - 290;
      text(g, `@${c.u}`, fx, y + 190, { font: `800 56px ${BODY}`, align: 'right', dir: 'ltr' });
      text(g, c.house ?? '', fx, y + 260, { font: `700 40px ${BODY}`, align: 'right' });
      text(g, c.address ?? '', fx, y + 318, { font: `700 40px ${BODY}`, align: 'right' });
      let px = x + W - 44; g.font = `800 36px ${BODY}`;
      for (const h of chips) { const w = g.measureText(h).width + 52; if (px - w < x + 30) break; box(g, px - w, y + 400, w, 72, 36, GOLD, 5, 0); text(g, h, px - w / 2, y + 448, { font: `800 36px ${BODY}` }); px -= w + 14; }
      return H + 14;
    }
  }
  return 0;
}

/** effects over the whole frame (episode "fx"): stickers that pop, banners that slam in, flashes, a red vignette,
 *  confetti. Camera effects (shake, punch) are in reel.js. Each has t0, t1. */
const EMOJI = '"Noto Color Emoji", "Apple Color Emoji", sans-serif';
const rnd = i => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
function effect(g, f, t) {
  const age = t - f.t0, life = f.t1 - f.t0, out = clamp((f.t1 - t) / .25), a = clamp(Math.min(age / .12, out));
  if (a <= 0) return;
  g.save(); g.globalAlpha = a;
  switch (f.type) {
    case 'flash': g.globalAlpha = clamp(1 - age / life) * (f.alpha ?? .8); g.fillStyle = f.color ?? '#fff'; g.fillRect(0, 0, 1080, 1920); break;
    case 'vignette': { const p = .55 + .45 * Math.sin(age * (f.speed ?? 7)); const gr = g.createRadialGradient(540, 960, 380, 540, 960, 1150);
      gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, f.color ?? `rgba(200,20,20,${.55 * p + .2})`); g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920); break; }
    case 'sticker': { const s = backOut(age / .35) * (1 + .05 * Math.sin(age * 9)), r = ((f.rot ?? 0) + 6 * Math.sin(age * 5 + (f.x ?? 0))) * Math.PI / 180;
      g.translate(f.x ?? 540, f.y ?? 700); g.rotate(r); g.scale(s, s);
      const emoji = /\p{Extended_Pictographic}/u.test(f.text);
      text(g, f.text, 0, 0, { font: emoji ? `${f.size ?? 140}px ${EMOJI}` : `400 ${f.size ?? 110}px ${DISPLAY}`, color: f.color ?? GOLD, stroke: emoji ? 0 : 20, drop: emoji ? 0 : 8, dir: 'rtl' }); break; }
    case 'banner': { const s = 1 + .7 * (1 - backOut(age / .3)), sh = age < .4 ? (rnd(Math.floor(t * 60)) - .5) * 24 : 0;
      g.translate(540 + sh, f.y ?? 760); g.rotate((f.rot ?? -4) * Math.PI / 180); g.scale(s, s);
      if (f.band) { g.fillStyle = f.band; g.fillRect(-620, -(f.size ?? 120) * .95, 1240, (f.size ?? 120) * 1.3); }
      text(g, f.text, 0, 0, { font: `400 ${f.size ?? 120}px ${DISPLAY}`, color: f.color ?? '#fff', stroke: 24, strokeColor: f.stroke ?? NAVY, drop: 10 }); break; }
    case 'news': {                                   // a TV news flash: a red header with LIVE, the channel, the clock, and a ticker below
      const sl = backOut(age / .4), y0 = f.y ?? 250;
      g.translate((1 - sl) * 1100, 0);
      g.fillStyle = RED; g.fillRect(0, y0, 1080, 132); g.fillStyle = '#8e2a1d'; g.fillRect(0, y0 + 126, 1080, 6);
      text(g, f.text ?? 'מבזק חדשות מיוחד', 600, y0 + 96, { font: `400 86px ${DISPLAY}`, color: '#fff', stroke: 10, strokeColor: '#7a1f14' });
      const blink = Math.sin(t * 6) > -.2; rr(g, 26, y0 + 34, 150, 64, 14); g.fillStyle = '#fff'; g.fill();
      if (blink) { g.beginPath(); g.arc(56, y0 + 66, 12, 0, Math.PI * 2); g.fillStyle = RED; g.fill(); }
      text(g, 'LIVE', 120, y0 + 81, { font: `800 38px ${BODY}`, color: RED, dir: 'ltr' });
      g.fillStyle = NAVY; g.fillRect(0, y0 + 132, 1080, 64);
      text(g, f.sub ?? 'חדשות הממלכה', 1050, y0 + 177, { font: `800 38px ${BODY}`, color: GOLD, align: 'right' });
      text(g, f.clock ?? '15:00', 40, y0 + 177, { font: `800 38px ${BODY}`, color: '#fff', align: 'left', dir: 'ltr' });
      if (f.ticker) { const ty = f.ty ?? 1560; g.fillStyle = NAVY; g.fillRect(0, ty, 1080, 74); g.fillStyle = GOLD; g.fillRect(0, ty, 190, 74);
        text(g, 'עכשיו', 95, ty + 52, { font: `800 40px ${BODY}`, color: NAVY });
        g.save(); g.beginPath(); g.rect(190, ty, 890, 74); g.clip(); g.font = `700 42px ${BODY}`; g.direction = 'rtl';
        const w = g.measureText(f.ticker).width + 120, x = 190 + ((age * 170) % w) - w + 890;
        for (const dx of [0, w]) text(g, f.ticker, x + dx, ty + 52, { font: `700 42px ${BODY}`, color: '#fff', align: 'right' });
        g.restore(); }
      break; }
    case 'confetti': { const cols = [GOLD, RED, TEAL, '#ffffff', '#3b6fb6', '#7a4f9a'];
      for (let i = 0; i < (f.n ?? 140); i++) { const x = rnd(i) * 1080 + Math.sin(age * 3 + i) * 40, y = -60 + (age * (380 + rnd(i + 7) * 520)) + rnd(i + 3) * -700, w = 14 + rnd(i + 5) * 16;
        if (y < -40 || y > 1960) continue; g.save(); g.translate(x, y); g.rotate(age * 6 + i); g.fillStyle = cols[i % cols.length]; g.fillRect(-w / 2, -w / 4, w, w / 2); g.restore(); } break; }
  }
  g.restore();
}

/** the whole overlay for time t. k: { t, day, kingdom, history, handle }, cards (with t0, t1), chunks (caption words) */
export function drawOverlay(g, k, cards, chunks, fx = []) {
  for (const f of fx) if (k.t >= f.t0 && k.t < f.t1 + .25 && f.under) effect(g, f, k.t);
  let y = k.top ?? 170;
  for (const c of cards) {
    if (k.t < c.t0 || k.t >= c.t1 + .25) continue;
    const fin = Math.min(backOut((k.t - c.t0) / .45), 1.2), fout = 1 - clamp((k.t - c.t1) / .25), s = (.6 + .4 * fin) * fout + (1 - fout) * .9;
    g.save(); g.globalAlpha = clamp(Math.min((k.t - c.t0) / .2, fout)); g.translate(540, y); g.scale(s, s); g.translate(-540, -y);
    const h = card(g, c, k, 540, y); g.restore(); y += h * Math.max(s, .9) + 26;
  }
  for (const f of fx) if (k.t >= f.t0 && k.t < f.t1 + .25 && !f.under) effect(g, f, k.t);
  // the caption: the chunk being said, the word being said in gold
  const ch = chunks.find(c => k.t >= (c.t0 ?? c.words[0].start - .05) && k.t < (c.t1 ?? c.words.at(-1).end + .25));
  if (ch) {
    const font = `800 76px ${BODY}`; g.font = font; g.direction = 'rtl'; const sp = g.measureText(' ').width, ws = ch.words.map(w => g.measureText(w.w).width);
    const lines = [[]]; let width = 0; ch.words.forEach((w, i) => { if (width + ws[i] > 940 && lines.at(-1).length) { lines.push([]); width = 0; } lines.at(-1).push(i); width += ws[i] + sp; });
    lines.forEach((line, li) => {
      const total = line.reduce((a, i) => a + ws[i], 0) + sp * (line.length - 1); let xr = 540 + total / 2;
      for (const i of line) { const w = ch.words[i], on = k.t >= w.start && k.t < w.end + .15;
        text(g, w.w, xr, 1360 + li * 96, { font, color: on ? GOLD : '#ffffff', align: 'right', stroke: 18 }); xr -= ws[i] + sp; }
    });
  }
  text(g, `@${k.handle}`, 50, 1880, { font: `700 30px ${BODY}`, color: '#fff', align: 'left', dir: 'ltr', stroke: 8, strokeColor: 'rgba(19,33,59,.6)' });
}
