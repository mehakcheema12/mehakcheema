(() => {
'use strict';
const C = window.PORTFOLIO;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const wait = ms => new Promise(r => setTimeout(r, ms));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const DPR = Math.min(devicePixelRatio || 1, 2);
const store = {
  get(k, s = sessionStorage) { try { return s.getItem(k); } catch (e) { return null; } },
  set(k, v, s = sessionStorage) { try { s.setItem(k, v); } catch (e) {} }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
try { history.scrollRestoration = 'manual'; } catch (e) {}

/* =========================== THEMES (three palettes) =========================== */
const root = document.documentElement;
let THEME = C.themes[0], THEME_I = 0;
function setTheme(n) {
  THEME_I = ((n % C.themes.length) + C.themes.length) % C.themes.length; THEME = C.themes[THEME_I];
  ['bg', 'fg', 'accent', 'blue', 'cream', 'gold', 'deep'].forEach(k => root.style.setProperty('--' + k, THEME[k]));
  root.dataset.pattern = THEME.pattern || 'dots';
  $('meta[name="theme-color"]').content = THEME.bg;
  try { localStorage.setItem('palette', THEME_I); } catch (e) {}
  $$('.tsw').forEach((b, i) => b.setAttribute('aria-checked', i === THEME_I));
  const lab = $('#themerLabel'); if (lab && lab.dataset.ready) lab.textContent = THEME.name;
}
let savedTheme = 0; try { savedTheme = +localStorage.getItem('palette') || 0; } catch (e) {}
setTheme(savedTheme);
const isReload = (((performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {}).type) === 'reload';

/* =========================== CONTENT =========================== */
const ICONS = {
  dribbble: '<circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>',
  behance: '<path d="M2.5 5.5h5.2a3.1 3.1 0 0 1 0 6.2H2.5zM2.5 11.7h5.8a3.4 3.4 0 0 1 0 6.8H2.5zM14.3 15h7.2a3.6 3.6 0 1 0-1 2.6M15.3 6.5h5.2"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  x: '<path d="M4 4l11.7 16H20L8.3 4z"/><path d="M4 20l6.8-6.8M20 4l-6.8 6.8"/>',
  pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  people: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  spark: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  support: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
  atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  layers: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  cap: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5M22 10v6"/>'
};
const svg = (name, extra = '') => `<svg viewBox="0 0 24 24" ${extra} aria-hidden="true">${ICONS[name] || ICONS.spark}</svg>`;
const nameParts = C.heroName.split(/\s+/), initials = (nameParts[0][0] + (nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '')).toUpperCase();
const B = C.badge;

$('#mark').textContent = C.wordmark; $('#mark').setAttribute('aria-label', `${C.heroName}, home`);
if (C.cv) { $('#navCv').href = C.cv; $('#navCv').hidden = false; }
$('#bLabel').textContent = B.label; $('#bId').textContent = B.id;
$('#bPhoto').innerHTML = B.photo ? `<img src="${esc(B.photo)}" alt="">` : initials;
$('#bWho').innerHTML = `<b>${esc(B.name)}</b>` + B.role.map(r => `<span>${esc(r)}</span>`).join('').replace('</span><span>', '<br>');
$('#bAvail').textContent = B.availability; $('#bSign').textContent = B.signature;
$('#bSeal1').innerHTML = $('#bSeal2').innerHTML = B.seal.map(esc).join('<br>');
$('#bTitle').textContent = B.backTitle;
$('#bRows').innerHTML = B.backRows.map(r => `<li><span class="bico">${svg(r.icon)}</span><div><b>${esc(r.title)}</b><small>${esc(r.text)}</small></div></li>`).join('');
$('#bNote').textContent = B.backNote; $('#bMail').textContent = C.email;
$('#socials').innerHTML = C.socials.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}">${svg(s.icon)}</a>`).join('');
$('#footSocial').innerHTML = C.socials.map(s => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('');
$('#footMail').textContent = C.email; $('#footMail').href = `mailto:${C.email}`;
$('#reachMail').textContent = C.email; $('#reachMail').href = `mailto:${C.email}`;
$('#reachSocials').innerHTML = $('#socials').innerHTML;
$('#footStatus').textContent = C.status;
$('#footCopy').textContent = `© ${new Date().getFullYear()} ${C.heroName}`;
$$('[data-mail]').forEach(a => a.href = `mailto:${C.email}?subject=${encodeURIComponent(a.dataset.mail)}`);

/* =========================== HERO LAYOUT =========================== */
const intro = $('#intro'), wordsEl = $('#words'), strapC = $('#strap'), sctx = strapC.getContext('2d');
const bcard = $('#bcard'), bspin = $('#bspin');
const mctx = document.createElement('canvas').getContext('2d');
const emW = t => { mctx.font = '400 100px Anton'; return mctx.measureText(t).width / 100; };
let HW = 1, HH = 1, CW = 300, HERO = null, anchor = { x: 0, y: -80 }, restY = 200, ropeLen = 280;

function layoutHero() {
  HW = intro.clientWidth; HH = intro.clientHeight;
  const wide = HW > 760;
  // the name: first word big in Anton, the rest signed across it in script
  const [first, ...restW] = C.heroName.split(/\s+/), rest = restW.join(' ');
  const big = first.toUpperCase();
  const maxW = HW - clamp(HW * .06, 20, 96) * 2;
  const fs1 = Math.min(HH * (wide ? .26 : .17), maxW / emW(big));
  const lh1 = fs1 * .96, fsS = fs1 * (wide ? .5 : .56), nameW = emW(big) * fs1;
  const nameY = HH * (wide ? .965 : .935) - fsS * .5 - lh1 * .5;
  const sigRight = Math.max(8, (HW - nameW) / 2 - fs1 * (wide ? .18 : .04));
  const lines = [{ text: big, fs: fs1, lh: lh1, y: nameY }];
  wordsEl.innerHTML = `<span style="top:${(nameY - lh1 / 2).toFixed(1)}px;height:${lh1.toFixed(1)}px;line-height:${lh1.toFixed(1)}px;font-size:${fs1.toFixed(2)}px;--d:0s">${esc(big)}</span>`
    + (rest ? ` <span class="sig" style="top:${(nameY + lh1 * .1).toFixed(1)}px;right:${sigRight.toFixed(1)}px;line-height:${(fsS * 1.3).toFixed(1)}px;font-size:${fsS.toFixed(2)}px;--d:.25s">${esc(rest)}</span>` : '');
  const gapTop = clamp(HH * .1, 64, 110), gapBot = nameY - fs1 * .6 - HH * .012;
  const chPx = clamp(gapBot - gapTop, 170, 540);
  CW = Math.min(HW * (wide ? .62 : .8), 380, chPx / 1.41);
  bcard.style.setProperty('--cw', CW.toFixed(2) + 'px');
  const clipOff = CW / 32 * 1.8;
  HERO = { lines, card: { cx: HW / 2, cy: gapTop + CW * 1.41 / 2, w: CW, h: CW * 1.41 } };
  intro.style.setProperty('--cy', HERO.card.cy.toFixed(1) + 'px');
  anchor = { x: HW / 2, y: -80 }; restY = gapTop - clipOff; ropeLen = restY - anchor.y;
  strapC.width = HW * DPR; strapC.height = HH * DPR; strapC.style.width = HW + 'px'; strapC.style.height = HH + 'px';
}

/* =========================== ROPE + BADGE PHYSICS =========================== */
const N = 16, GRAV = 2600, DAMP = .993, CARD_W = .12;
let pts = [], seg = 20, drag = null, dragT = { x: 0, y: 0 }, ang = 0, angV = 0, flip = 0, flipV = 0, flipT = 0;
let tilt = { x: 0, y: 0 }, tiltT = { x: 0, y: 0 }, heroOn = true, started = false;

function initRope(drop) {
  seg = ropeLen / N; pts = [];
  const a = drop ? 2.3 : 0;
  for (let i = 0; i <= N; i++) {
    const x = anchor.x - Math.sin(a) * i * seg * .95, y = anchor.y + Math.cos(a) * i * seg * .95;
    pts.push({ x, y, px: x, py: y });
  }
}
function physics(dt) {
  const SUB = 4, h = dt / SUB;
  for (let s = 0; s < SUB; s++) {
    for (let i = 1; i <= N; i++) {
      const p = pts[i];
      if (i === N && drag) { p.px = p.x; p.py = p.y; p.x += (dragT.x - p.x) / (SUB - s); p.y += (dragT.y - p.y) / (SUB - s); continue; }
      const vx = (p.x - p.px) * DAMP, vy = (p.y - p.py) * DAMP;
      p.px = p.x; p.py = p.y; p.x += vx; p.y += vy + GRAV * h * h;
    }
    pts[0].x = anchor.x; pts[0].y = anchor.y;
    for (let k = 0; k < 10; k++) {
      for (let i = 0; i < N; i++) {
        const a = pts[i], b = pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-6;
        if (d <= seg) continue;                       // a rope only resists stretching
        const wa = i === 0 ? 0 : 1, wb = i + 1 === N ? (drag ? 0 : CARD_W) : 1, sum = wa + wb;
        if (!sum) continue;
        const diff = (d - seg) / d;
        a.x += dx * diff * wa / sum; a.y += dy * diff * wa / sum;
        b.x -= dx * diff * wb / sum; b.y -= dy * diff * wb / sum;
      }
    }
  }
  // the card follows the end of the strap, with a little lag of its own
  const a = pts[N - 2], b = pts[N];
  const target = -Math.atan2(b.x - a.x, b.y - a.y);
  angV += ((target - ang) * 140 - angV * 11) * dt; ang += angV * dt;
  flipV += ((flipT - flip) * 110 - flipV * 13) * dt; flip += flipV * dt;
  const vx = (b.x - b.px) / (dt / 4);
  tiltT.y = clamp(vx * .012, -25, 25) + (fine && !drag ? tiltT.hy || 0 : 0);
  tilt.x += (tiltT.x - tilt.x) * Math.min(1, dt * 8); tilt.y += (tiltT.y - tilt.y) * Math.min(1, dt * 8);
}
let strapCache = null;
function drawStrap() {
  sctx.setTransform(DPR, 0, 0, DPR, 0, 0); sctx.clearRect(0, 0, HW, HH);
  const sw = CW * .13;
  sctx.lineJoin = 'round'; sctx.lineCap = 'butt';
  const path = () => { sctx.beginPath(); sctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < N; i++) { const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2; sctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my); }
    sctx.lineTo(pts[N].x, pts[N].y); };
  path(); sctx.strokeStyle = 'rgba(0,0,0,.28)'; sctx.lineWidth = sw + 3; sctx.stroke();
  path(); sctx.strokeStyle = THEME.fg; sctx.lineWidth = sw; sctx.stroke();
  path(); sctx.strokeStyle = 'rgba(71,47,38,.18)'; sctx.lineWidth = sw * .12; sctx.setLineDash([2, 4]); sctx.stroke(); sctx.setLineDash([]);
  // text along the strap
  const fs = sw * .48, text = B.strapText;
  if (!strapCache || strapCache.fs !== fs) {
    sctx.font = `700 ${fs}px "Plus Jakarta Sans", sans-serif`;
    strapCache = { fs, w: [...text].map(c => sctx.measureText(c).width + fs * .12) };
  }
  sctx.font = `700 ${fs}px "Plus Jakarta Sans", sans-serif`; sctx.fillStyle = THEME.bg; sctx.textBaseline = 'middle'; sctx.textAlign = 'center';
  const cum = [0]; for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cum[N] - CW * .06; let s = 8, ci = 0, si = 0; const chars = [...text];
  while (s < total) {
    const w = strapCache.w[ci % chars.length], mid = s + w / 2;
    while (si < N - 1 && cum[si + 1] < mid) si++;
    const p = pts[si], q = pts[si + 1], t = (mid - cum[si]) / ((cum[si + 1] - cum[si]) || 1);
    sctx.save(); sctx.translate(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t); sctx.rotate(Math.atan2(q.y - p.y, q.x - p.x));
    sctx.fillText(chars[ci % chars.length], 0, 0); sctx.restore();
    s += w; ci++;
  }
}
function renderCard() {
  const e = pts[N];
  bcard.style.transform = `translate3d(${e.x.toFixed(2)}px,${e.y.toFixed(2)}px,0) rotate(${ang.toFixed(4)}rad)`;
  bspin.style.transform = `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${(flip + tilt.y).toFixed(2)}deg)`;
}
let last = 0, raf = 0;
function heroFrame(now) {
  raf = requestAnimationFrame(heroFrame);
  const dt = clamp((now - (last || now)) / 1000, 1 / 240, 1 / 30); last = now;
  physics(dt); drawStrap(); renderCard();
}
function heroRun(on) {
  if (on && !raf && started) { last = 0; raf = requestAnimationFrame(heroFrame); }
  else if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
}
new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; heroRun(heroOn && !document.hidden); }).observe(intro);
document.addEventListener('visibilitychange', () => heroRun(heroOn && !document.hidden));

// pointer: hover tilts, drag throws, a click flips
let downAt = null;
bspin.addEventListener('pointerdown', e => {
  e.preventDefault(); bspin.setPointerCapture(e.pointerId);
  const end = pts[N]; downAt = { x: e.clientX, y: e.clientY, t: performance.now(), ox: end.x - e.clientX, oy: end.y - e.clientY + (intro.getBoundingClientRect().top) };
  intro.classList.add('touched');
});
bspin.addEventListener('pointermove', e => {
  if (!downAt) return;
  if (!drag && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 5) drag = true;
  if (drag) { const top = intro.getBoundingClientRect().top; dragT.x = e.clientX + downAt.ox; dragT.y = e.clientY - top + downAt.oy; }
});
const release = () => {
  if (!downAt) return;
  if (!drag) flipT += 180;
  else { const p = pts[N]; const vx = p.x - p.px, vy = p.y - p.py, m = Math.hypot(vx, vy), max = 40; if (m > max) { p.px = p.x - vx / m * max; p.py = p.y - vy / m * max; } }
  drag = null; downAt = null;
};
bspin.addEventListener('pointerup', release); bspin.addEventListener('pointercancel', release);
$('#flipBtn').addEventListener('click', () => { flipT += 180; });
if (fine) intro.addEventListener('pointermove', e => {
  const r = intro.getBoundingClientRect(), cx = pts[N] ? pts[N].x : HW / 2, cy = HERO ? HERO.card.cy : HH / 2;
  tiltT.x = clamp(-(e.clientY - r.top - cy) / HH * 22, -14, 14); tiltT.hy = clamp((e.clientX - r.left - cx) / HW * 30, -18, 18);
});
intro.addEventListener('pointerleave', () => { tiltT.x = 0; tiltT.hy = 0; });

let rsT;
addEventListener('resize', () => { clearTimeout(rsT); rsT = setTimeout(() => {
  const oldW = HW; layoutHero(); seg = ropeLen / N;
  const dx = (HW - oldW) / 2; pts.forEach(p => { p.x += dx; p.px += dx; });
  if (!raf && started) { drawStrap(); renderCard(); }
}, 80); });

function startHero(instant) {
  if (instant) intro.classList.add('instant');
  initRope(!reduce && !instant ? true : false);
  if (reduce || instant) { /* settle quietly */ for (let i = 0; i < 400; i++) physics(1 / 60); }
  started = true; intro.classList.add('ready');
  showThemer();
  if (instant) requestAnimationFrame(() => intro.classList.remove('instant'));
  heroRun(heroOn && !document.hidden);
  if (!raf) { drawStrap(); renderCard(); }
}

/* =========================== ENVELOPE (before the loader) =========================== */
// tiny paper / wax sounds, synthesised so there are no audio files to load
let envAC;
function envSfx(type) {
  try {
    envAC = envAC || new (window.AudioContext || window.webkitAudioContext)();
    const ac = envAC, t = ac.currentTime;
    const play = (dur, ftype, freq, q, peak, attack, start = 0) => {
      const b = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      s.buffer = b; f.type = ftype; f.frequency.value = freq; f.Q.value = q;
      g.gain.setValueAtTime(0, t + start); g.gain.linearRampToValueAtTime(peak, t + start + attack);
      g.gain.exponentialRampToValueAtTime(.0001, t + start + dur);
      s.connect(f).connect(g).connect(ac.destination); s.start(t + start); s.stop(t + start + dur + .05);
    };
    if (type === 'press') play(.08, 'lowpass', 500, .7, .3, .004);
    if (type === 'crack') { play(.05, 'highpass', 1800, .8, .5, .001); play(.07, 'bandpass', 3200, 1.2, .35, .001, .035); play(.12, 'lowpass', 900, .7, .22, .002, .012); }
    if (type === 'flap') play(.55, 'bandpass', 2600, .5, .09, .14);
    if (type === 'slide') play(.95, 'bandpass', 1500, .6, .08, .32);
  } catch (e) {}
}

function envelope() {
  const el = $('#envx');
  if (!el) return Promise.resolve();
  return new Promise(resolve => {
    const stage = $('#envxStage'), tilt = $('#envxTilt'), flap = $('#envxFlap'), letter = $('#envxLetter');
    const sealT = $('#envxSealT'), sealB = $('#envxSealB');
    sealT.innerHTML = sealB.innerHTML = '<svg viewBox="0 0 120 120" aria-hidden="true"><use href="#exSeal"/></svg>';
    // a jagged crack through the seal: the top half rides away on the flap, the bottom half stays on the envelope
    const CRACK = [[-20, 52], [10, 52], [19, 46], [27, 55], [36, 48], [44, 57], [51, 50], [59, 55], [66, 45], [75, 53], [84, 47], [92, 52], [120, 50]];
    const crack = (lift = 0) => CRACK.map(([x, y]) => `${x}% ${y - lift}%`);
    sealT.style.clipPath = `polygon(-20% -20%,120% -20%,${crack().reverse().join(',')})`;
    // until it breaks, the bottom half overlaps the top a little so no seam shows
    sealB.style.clipPath = `polygon(${crack(4).join(',')},120% 120%,-20% 120%)`;

    // gentle 3D tilt that follows the pointer
    let tx = 0, ty = 0, cx = 0, cy = 0, base = 7, follow = true, run = true;
    const onMove = e => { if (follow) { tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; } };
    if (fine) addEventListener('pointermove', onMove);
    (function loop() {
      if (!run) return;
      cx += (tx - cx) * .07; cy += (ty - cy) * .07;
      tilt.style.transform = `rotateX(${(base - cy * 7).toFixed(2)}deg) rotateY(${(cx * 10).toFixed(2)}deg)`;
      requestAnimationFrame(loop);
    })();
    requestAnimationFrame(() => el.classList.add('in'));

    const crumbs = () => {
      for (let i = 0; i < 14; i++) {
        const c = document.createElement('i'), sz = 2 + Math.random() * 5;
        c.className = 'envx-crumb'; c.style.width = sz + 'px'; c.style.height = (sz * (.6 + Math.random() * .6)).toFixed(1) + 'px';
        tilt.appendChild(c);
        const a = Math.random() * Math.PI * 2, v = 30 + Math.random() * 80, dx = Math.cos(a) * v, dy = Math.sin(a) * v * .6 - 34, r = (Math.random() - .5) * 720;
        c.animate([
          { transform: 'translate3d(-50%,-50%,8px) rotate(0deg)', opacity: 1 },
          { transform: `translate3d(calc(-50% + ${(dx * .6).toFixed(1)}px),calc(-50% + ${dy.toFixed(1)}px),8px) rotate(${(r / 2).toFixed(0)}deg)`, opacity: 1, offset: .35 },
          { transform: `translate3d(calc(-50% + ${dx.toFixed(1)}px),calc(-50% + ${(dy + 150).toFixed(1)}px),8px) rotate(${r.toFixed(0)}deg)`, opacity: 0 }
        ], { duration: 700 + Math.random() * 450, easing: 'cubic-bezier(.25,.6,.5,1)' }).onfinish = () => c.remove();
      }
    };
    const fade = (els, ms, delay = 0) => els.forEach(n => n && n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, delay, easing: 'ease', fill: 'forwards' }));

    let opened = false;
    const open = async () => {
      if (opened) return; opened = true;
      el.classList.add('open'); follow = false; tx = ty = 0; base = 0;
      removeEventListener('pointermove', onMove); removeEventListener('keydown', onKey);

      // 1. press down on the seal…
      envSfx('press');
      await Promise.all([sealT, sealB].map(s => s.animate([{ scale: 1 }, { scale: .93 }, { scale: 1 }], { duration: 230, easing: 'ease-out' }).finished));
      // 2. …it cracks, the halves jolt apart and a few wax crumbs fly
      envSfx('crack'); crumbs();
      sealB.style.clipPath = `polygon(${crack().join(',')},120% 120%,-20% 120%)`;
      sealT.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '-.5px -1.5px', rotate: '-3deg' }], { duration: 280, easing: 'cubic-bezier(.2,1.6,.4,1)', fill: 'forwards' });
      sealB.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '.5px 1px', rotate: '1.8deg' }], { duration: 280, easing: 'cubic-bezier(.2,1.6,.4,1)', fill: 'forwards' });
      await wait(300);

      // 3. the flap swings open (it tucks behind the letter once it's past vertical)
      envSfx('flap');
      flap.animate([
        { transform: 'translateZ(4px) rotateX(0deg)' },
        { transform: 'translateZ(4px) rotateX(90deg)', offset: .5 },
        { transform: 'translateZ(-1px) rotateX(180deg)' }
      ], { duration: 980, easing: 'cubic-bezier(.55,0,.25,1)', fill: 'forwards' });
      await wait(760);

      // 4. the letter slides up and out while the envelope drops to make room
      envSfx('slide');
      const envH = tilt.offsetHeight, sc = Math.min(1, innerHeight * .9 / (envH * 2.05));
      stage.animate([{ translate: '0 0', scale: 1 }, { translate: `0 ${(43.5 * sc).toFixed(1)}%`, scale: sc }], { duration: 1000, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
      letter.animate([{ transform: 'translateY(0%) translateZ(1px)' }, { transform: 'translateY(-112%) translateZ(1px)' }], { duration: 1050, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
      await wait(1180);

      // 5. the letter comes forward and fills the screen, becoming the loader's paper
      run = false; tilt.style.transform = 'none';
      const r = letter.getBoundingClientRect();
      const s = Math.max(innerWidth / r.width, innerHeight / r.height) * 1.25;
      const dx = (innerWidth / 2 - (r.left + r.width / 2)) / sc, dy = (innerHeight / 2 - (r.top + r.height / 2)) / sc;
      fade([letter.firstElementChild], 260); letter.classList.add('bare');
      fade([...el.querySelectorAll('.envx-face,.envx-seal,.envx-shadow')], 420, 120);
      await letter.animate([
        { transform: 'translate(0px,0px) translateY(-112%) translateZ(1px) scale(1)', borderRadius: '3px' },
        { transform: `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) translateY(-112%) translateZ(10px) scale(${(s / sc).toFixed(3)})`, borderRadius: '0px' }
      ], { duration: 950, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' }).finished;

      el.remove();
      resolve();
    };
    const onKey = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
    el.addEventListener('click', open);
    addEventListener('keydown', onKey);
  });
}

/* =========================== LOADER =========================== */
async function runLoader() {
  const el = $('#loader');
  const seen = store.get('introSeen') === '1'; store.set('introSeen', '1');
  if (reduce || (seen && !isReload)) { el.remove(); $('#envx')?.remove(); return false; }
  root.classList.add('loading');
  await envelope();
  const hello = $('#lHello'), count = $('#lCount'), bar = $('#lBar');
  // EDIT: the greetings, with an optional style ('gur' = Gurmukhi, 'dev' = Devanagari, 'serif' = italic serif)
  const words = [['Hello', ''], ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'gur'], ['नमस्ते', 'dev'], ['Bonjour', 'serif'], ['Hola', ''], ['Ciao', 'serif'], ['Welcome', '']];
  const T = 4600, t0 = performance.now();
  (function tick() {
    const p = Math.min(1, (performance.now() - t0) / T), e = 1 - Math.pow(1 - p, 2.4);
    count.textContent = Math.round(e * 100); bar.style.transform = `scaleX(${e.toFixed(3)})`;
    if (p < 1) requestAnimationFrame(tick);
  })();
  for (const [w, c] of words) { hello.textContent = w; hello.className = 'l-hello ' + c; await wait(T / words.length); }
  await wait(120);
  return () => { el.classList.add('out'); root.classList.remove('loading'); setTimeout(() => el.remove(), 1100); };
}

(async function boot() {
  scrollTo(0, 0);
  await Promise.race([document.fonts.load('100px Anton').then(() => document.fonts.ready), wait(3000)]);
  layoutHero();
  const lift = await runLoader();
  if (lift) { lift(); await wait(350); }
  startHero(false);
})();

/* =========================== PALETTE SWITCHER =========================== */
const themer = $('#themer'), themerLab = $('#themerLabel');
themer.insertAdjacentHTML('beforeend', C.themes.map((t, i) =>
  `<button class="tsw" type="button" role="radio" aria-checked="${i === THEME_I}" aria-label="${esc(t.name)} palette" title="${esc(t.name)}" style="--a:${t.bg};--b:${t.fg};--c:${t.accent}"></button>`).join(''));
$$('.tsw').forEach((b, i) => b.addEventListener('click', () => {
  setTheme(i); themerLab.dataset.ready = 1; themerLab.textContent = THEME.name;
  themer.classList.add('say'); clearTimeout(themer._t); themer._t = setTimeout(() => themer.classList.remove('say'), 1800);
}));
if (C.themes.length < 2) themer.remove();
function showThemer() {
  if (C.themes.length < 2) return;
  setTimeout(() => {
    themer.classList.add('on', 'say'); themerLab.textContent = 'Pick a palette';
    setTimeout(() => { themer.classList.remove('say'); setTimeout(() => { themerLab.dataset.ready = 1; themerLab.textContent = THEME.name; }, 450); }, 4000);
  }, 1600);
}

/* =========================== NAV =========================== */
const top = $('#topBar'), burger = $('#burger');
const navState = () => top.classList.toggle('hide', scrollY < innerHeight * .55 && !top.classList.contains('open'));
burger.addEventListener('click', () => { const o = !top.classList.contains('open'); top.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); navState(); });
$$('#nav a').forEach(a => a.addEventListener('click', () => { top.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

/* =========================== REVEALS =========================== */
$$('.split').forEach(el => {
  let k = 0; const parts = [], wrap = html => `<span class="w"><i style="--d:${(k++ * .06).toFixed(2)}s">${html}</i></span>`;
  el.childNodes.forEach(n => {
    if (n.nodeType === 3) n.textContent.split(/\s+/).filter(Boolean).forEach(w => parts.push(wrap(esc(w))));
    else if (n.nodeType === 1) parts.push(wrap(n.outerHTML));
  });
  el.innerHTML = parts.join(' ');
});
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
$$('[data-anim], .split').forEach(el => io.observe(el));

// About: words ink in as the paragraph is scrolled through
const fill = $('#fill'), fillWords = [];
(function splitFill(node) {
  [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
        else { const s = document.createElement('span'); s.className = 'fw'; s.textContent = part; frag.appendChild(s); fillWords.push(s); }
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== 'STAR-I') splitFill(n);
  });
})(fill);
function fillUpdate() {
  const r = fill.getBoundingClientRect(), start = innerHeight * .88, end = innerHeight * .42;
  const p = clamp((start - r.top) / (r.height + start - end), 0, 1), n = Math.round(p * fillWords.length);
  fillWords.forEach((w, i) => w.classList.toggle('on', i < n));
}

/* =========================== WORK =========================== */
const tilesEl = $('#tiles');
const feedHTML = kind => { const one = kind === 'web' ? 'h l s c c c l s c c c h l s c c c' : 'h l s c l s c h l s c l s c'; const f = one.split(' ').map(c => `<i class="${c}"></i>`).join(''); return f + f; };
const mockHTML = w => `<div class="t-mock ${w.kind === 'web' ? 'web' : 'app'}" style="--c:${w.colors?.[1] || THEME.accent}"><div class="dev"><div class="feed">${feedHTML(w.kind)}</div></div><div class="chip"><i></i><i></i></div></div>`;
const slidesHTML = w => `<div class="t-slides">${w.gallery.map((src, k) => `<img src="${esc(src)}" alt="" loading="${k ? 'lazy' : 'eager'}" class="${k ? '' : 'on'}">`).join('')}</div>`;
const phonesHTML = w => { const p = w.phones, pick = [p[1], p[0], p[2]].filter(Boolean);
  return `<div class="t-phones" style="--c:${w.colors?.[1] || THEME.accent}">${pick.map((src, k) => `<img src="${esc(src)}" alt="" class="ph${k}" loading="lazy">`).join('')}</div>`; };
const mediaHTML = w => w.phones?.length ? phonesHTML(w) : w.gallery?.length ? slidesHTML(w) : w.video ? `<video src="${esc(w.video)}" ${w.image ? `poster="${esc(w.image)}"` : ''} muted loop playsinline autoplay preload="metadata"></video>`
  : w.image ? `<img src="${esc(w.image)}" alt="" loading="lazy">` : mockHTML(w);
tilesEl.innerHTML = C.work.map((w, i) => `
  <button class="tile" type="button" data-i="${i}" aria-label="${esc(w.title)}: open project">
    <div class="t-frame"><div class="t-media">${mediaHTML(w)}</div><span class="t-tag"><i></i>${esc(w.tag)}</span></div>
    <div class="t-cap"><span class="t-num">${String(i + 1).padStart(2, '0')}</span>
      <div><b>${esc(w.title)}</b><small>${esc(w.stack || (w.kind === 'web' ? 'Website' : 'Mobile app'))}${w.year ? ' · ' + esc(w.year) : ''}</small></div>
      <span class="t-go" aria-hidden="true">${ARROW}</span></div>
  </button>`).join('');
const tiles = $$('.tile');
const tio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); tio.unobserve(e.target); } }), { threshold: .12 });
tiles.forEach((t, i) => { t.style.setProperty('--d', (i % 2) * 110 + 'ms'); tio.observe(t); });
// cycle each tile's screenshots (paused while the tile is off screen)
$$('.t-slides').forEach(box => {
  const imgs = [...box.children]; let k = 0, vis = false;
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(box);
  if (!reduce) setInterval(() => { if (!vis || document.hidden) return; imgs[k].classList.remove('on'); k = (k + 1) % imgs.length; imgs[k].classList.add('on'); }, 2600);
});

// a "View" bubble that follows the mouse over the tiles
const cview = $('#cview');
if (fine) {
  document.body.classList.add('cv-on');
  addEventListener('pointermove', e => {
    cview.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    cview.classList.toggle('on', !!e.target.closest?.('.tile'));
  }, { passive: true });
}

// project screen
function showShot(k) {
  const shots = $$('#caseVisual .cs-shots img'), th = $$('#caseVisual .cs-thumbs button');
  if (!shots.length) return; k = k % shots.length;
  shots.forEach((im, i) => im.classList.toggle('on', i === k)); th.forEach((b, i) => b.classList.toggle('on', i === k));
}
const caseD = $('#case'), caseSteps = $('#caseSteps'), caseVisual = $('#caseVisual');
let caseIdx = 0, caseIO = null;
function openCase(i) {
  caseIdx = (i + C.work.length) % C.work.length;
  const w = C.work[caseIdx], next = C.work[(caseIdx + 1) % C.work.length];
  const steps = [
    `<p class="cs-k">${esc(w.tag)}${w.year ? ' · ' + esc(w.year) : ''}</p><h2 id="caseTitle">${esc(w.title)}</h2><p class="cs-sum">${esc(w.summary || '')}</p>
     <dl class="case-meta"><div><dt>Role</dt><dd>${esc(w.role || '')}</dd></div><div><dt>Year</dt><dd>${esc(w.year || '')}</dd></div><div><dt>Stack</dt><dd>${esc(w.stack || '')}</dd></div></dl>`
  ];
  if (w.challenge) steps.push(`<p class="cs-k">The idea</p><h3>Why I built it</h3><p>${esc(w.challenge)}</p>`);
  if (w.approach) steps.push(`<p class="cs-k">The build</p><h3>How I built it</h3><p>${esc(w.approach)}</p>`);
  if (w.features?.length) steps.push(`<p class="cs-k">Features</p><h3>What it does</h3><ol class="cs-dec">${w.features.map(d => `<li><b>${esc(d.title)}</b><p>${esc(d.text)}</p></li>`).join('')}</ol>`);
  if (w.team?.length) steps.push(`<p class="cs-k">The team</p><h3>Who built it</h3><ul class="cs-team">${w.team.map(([n, r]) => `<li class="${n === C.heroName ? 'me' : ''}"><b>${esc(n)}</b><span>${esc(r)}</span></li>`).join('')}</ul>`);
  if (w.outcome) steps.push(`<p class="cs-k">The outcome</p><h3>Where it is now</h3><p>${esc(w.outcome)}</p>`);
  caseSteps.innerHTML = steps.map((s, k) => `<section class="cs-step${k ? '' : ' on'}" data-k="${k}">${s}</section>`).join('');
  caseVisual.style.setProperty('--c', w.colors?.[1] || THEME.accent);
  if (w.phones?.length) {
    caseVisual.classList.add('has-shots', 'has-phones');
    caseVisual.innerHTML = `<div class="cs-phone"><div class="cs-shots">${w.phones.map((src, k) => `<img src="${esc(src)}" alt="${esc(w.title)} screen ${k + 1}" class="${k ? '' : 'on'}">`).join('')}</div></div>
      <div class="cs-thumbs" role="group" aria-label="Screens">${w.phones.map((src, k) => `<button type="button" class="${k ? '' : 'on'}" aria-label="Show screen ${k + 1}"><img src="${esc(src)}" alt=""></button>`).join('')}</div>`;
    $$('.cs-thumbs button').forEach((b, k) => b.addEventListener('click', () => showShot(k)));
  } else if (w.gallery?.length) {
    caseVisual.classList.remove('has-phones');
    const host = (w.link || '').replace(/^https?:\/\//, '').replace(/\/$/, '') || w.title.toLowerCase();
    caseVisual.classList.add('has-shots');
    caseVisual.innerHTML = `<div class="cs-browser"><div class="cs-bar"><i></i><i></i><i></i><span>${esc(host)}</span></div>
      <div class="cs-shots">${w.gallery.map((src, k) => `<img src="${esc(src)}" alt="${esc(w.title)} screenshot ${k + 1}" class="${k ? '' : 'on'}" loading="lazy">`).join('')}</div></div>
      <div class="cs-thumbs" role="group" aria-label="Screenshots">${w.gallery.map((src, k) => `<button type="button" class="${k ? '' : 'on'}" aria-label="Show screenshot ${k + 1}"><img src="${esc(src)}" alt=""></button>`).join('')}</div>`;
    $$('.cs-thumbs button').forEach((b, k) => b.addEventListener('click', () => showShot(k)));
  } else {
    caseVisual.classList.remove('has-shots', 'has-phones');
    caseVisual.innerHTML = mediaHTML(w) + (w.colors ? `<div class="cs-palette">${w.colors.map(c => `<i style="--s:${c}"></i>`).join('')}</div>` : '');
  }
  caseVisual.dataset.s = 0;
  $('#caseCount').textContent = `${String(caseIdx + 1).padStart(2, '0')} / ${String(C.work.length).padStart(2, '0')}`;
  const live = $('#caseLive'); live.hidden = !w.link; if (w.link) live.href = w.link;
  const code = $('#caseCode'); code.hidden = !w.github; if (w.github) code.href = w.github;
  $('#caseNextTitle').textContent = next.title;
  if (!caseD.open) { caseD.showModal(); root.style.overflow = 'hidden'; }
  caseD.scrollTop = 0;
  caseIO?.disconnect();
  caseIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) {
    $$('.cs-step').forEach(s => s.classList.toggle('on', s === e.target)); caseVisual.dataset.s = e.target.dataset.k; showShot(+e.target.dataset.k); } }),
    { root: caseD, rootMargin: '-45% 0px -45% 0px' });
  $$('.cs-step').forEach(s => caseIO.observe(s));
}
tilesEl.addEventListener('click', e => { const t = e.target.closest('.tile'); if (t) openCase(+t.dataset.i); });
$('#caseNext').addEventListener('click', () => openCase(caseIdx + 1));
caseD.addEventListener('close', () => { root.style.overflow = ''; caseIO?.disconnect(); });
$$('dialog [data-close]').forEach(b => b.addEventListener('click', () => b.closest('dialog').close()));

// more about me
const more = $('#more');
(function zine() {
  const mz = $('#mz'), prog = $('#mzProg');
  // cover: one span per letter so they can drop in one by one
  const big = more.querySelector('[data-letters]');
  big.innerHTML = [...big.textContent].map((ch, k) => `<i style="--k:${k}">${esc(ch)}</i>`).join('');
  // manifesto: wrap every word so it can ink in
  const ink = $('#mzInk');
  (function wrap(node) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.append(part);
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.append(s); }
        });
        n.replaceWith(frag);
      } else wrap(n);
    });
  })(ink);
  const words = [...ink.querySelectorAll('.w')], mark = ink.querySelector('mark');
  // section reveals
  $$('.mz-tag, .mz-halves article, .mz-nums li, .mz-made li, .mz-q .mz-qgrid > *, .mz-rtxt, .mz-sign, .mz-acts').forEach((el, i) => {
    el.setAttribute('data-up', ''); if (el.matches('.mz-nums li, .mz-made li, .mz-halves article')) el.style.setProperty('--d', `${(i % 3) * .1}s`);
  });
  // the code that types itself
  const CODE = [
    ['c', '// hi, this is me in JavaScript\n'], ['k', 'const '], ['b', 'mehak'], ['', ' = {\n'],
    ['p', '  stack'], ['', ': ['], ['s', "'Mongo'"], ['', ', '], ['s', "'Express'"], ['', ', '], ['s', "'React'"], ['', ', '], ['s', "'Node'"], ['', '],\n'],
    ['p', '  designs'], ['', ': '], ['s', "'interfaces people enjoy'"], ['', ',\n'],
    ['p', '  learning'], ['', ': ['], ['s', "'AI/ML'"], ['', ', '], ['s', "'Qiskit'"], ['', '],\n'],
    ['p', '  cgpa'], ['', ': '], ['b', '9.5'], ['', ',\n'],
    ['p', '  ships'], ['', ': '], ['k', 'true'], ['', '\n};']
  ];
  const codeEl = $('#mzCode');
  let typed = false;
  function typeCode() {
    if (typed) return; typed = true;
    if (reduce) { codeEl.innerHTML = CODE.map(([c, t]) => c ? `<span class="${c}">${esc(t)}</span>` : esc(t)).join(''); return; }
    let seg = 0, ch = 0;
    (function step() {
      if (!more.open) { typed = false; codeEl.innerHTML = ''; return; }
      if (seg >= CODE.length) return;
      const [c, t] = CODE[seg]; ch++;
      const done = CODE.slice(0, seg).map(([c2, t2]) => c2 ? `<span class="${c2}">${esc(t2)}</span>` : esc(t2)).join('');
      const part = esc(t.slice(0, ch));
      codeEl.innerHTML = done + (c ? `<span class="${c}">${part}</span>` : part);
      if (ch >= t.length) { seg++; ch = 0; }
      setTimeout(step, t[ch - 1] === '\n' ? 140 : 22 + Math.random() * 30);
    })();
  }
  // count-ups
  function count(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = +el.dataset.count, dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const show = v => el.textContent = pre + v.toFixed(dec) + suf;
    if (reduce) return show(to);
    const t0 = performance.now();
    (function tick(t) { const p = Math.min((t - t0) / 1400, 1); show(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tick); })(t0);
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('on'); io.unobserve(el);
    if (el.id === 'mzCode') typeCode();
    if (el.dataset.count) count(el);
  }), { root: mz, threshold: .25 });
  // scroll: progress bar + words ink in through the middle of the screen
  let queued = false;
  function onMz() {
    queued = false;
    const max = mz.scrollHeight - mz.clientHeight;
    prog.style.transform = `scaleX(${max > 0 ? mz.scrollTop / max : 0})`;
    const line = mz.clientHeight * .62;
    words.forEach(w => w.classList.toggle('on', reduce || w.getBoundingClientRect().top < line));
    mark.classList.toggle('on', mark.getBoundingClientRect().top < line);
  }
  mz.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(onMz); } }, { passive: true });
  // projects: a peek follows the cursor, click opens the case study
  const peek = $('#mzPeek'), pimg = peek.querySelector('img');
  let px = 0, py = 0, tx = 0, ty = 0, praf = 0;
  const follow = () => { px += (tx - px) * .18; py += (ty - py) * .18; peek.style.transform = `translate(${px.toFixed(1)}px,${py.toFixed(1)}px)`; praf = peek.classList.contains('on') ? requestAnimationFrame(follow) : 0; };
  $$('#mzMade li').forEach(li => {
    li.addEventListener('pointerenter', e => { pimg.src = li.dataset.img; tx = px = e.clientX + 24; ty = py = e.clientY - 120; peek.classList.add('on'); if (!praf) praf = requestAnimationFrame(follow); });
    li.addEventListener('pointermove', e => { tx = e.clientX + 24; ty = e.clientY - 120; });
    li.addEventListener('pointerleave', () => peek.classList.remove('on'));
    li.addEventListener('click', () => { peek.classList.remove('on'); more.close(); openCase(+li.dataset.i); });
    li.tabIndex = 0; li.setAttribute('role', 'button');
    li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); li.click(); } });
  });
  // open: the page grows out of the button
  $('#moreOpen').addEventListener('click', e => {
    const b = e.currentTarget.getBoundingClientRect();
    more.style.setProperty('--ox', `${clamp(b.left + b.width / 2, 0, innerWidth)}px`); more.style.setProperty('--oy', `${clamp(b.top + b.height / 2, 0, innerHeight)}px`);
    more.showModal(); root.style.overflow = 'hidden'; mz.scrollTop = 0;
    $$('#mz [data-up], #mzCode, #mz [data-count], .mz-roots').forEach(el => io.observe(el));
    onMz();
  });
  more.addEventListener('close', () => { root.style.overflow = ''; peek.classList.remove('on'); });
})();

/* =========================== SKILL CARDS: parallax =========================== */
(function skillParallax() {
  const cards = $$('.sk-card'); if (!cards.length || reduce) return;
  // scroll: each card drifts at its own speed (three-across layout only)
  const SPEED = [-36, 28, -58], three = matchMedia('(min-width:901px)'), off = cards.map(() => 0);
  let queued = false;
  function drift() {
    queued = false;
    const vh = innerHeight;
    cards.forEach((c, i) => {
      if (!three.matches) { if (off[i]) { off[i] = 0; c.style.translate = ''; } return; }
      const r = c.getBoundingClientRect(), top = r.top - off[i];
      if (top > vh + 300 || top + r.height < -300) return;
      const p = clamp((top + r.height / 2 - vh / 2) / vh, -1.2, 1.2);
      off[i] = p * SPEED[i % SPEED.length];
      c.style.translate = `0 ${off[i].toFixed(1)}px`;
    });
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(drift); } };
  addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue, { passive: true }); queue();
  // pointer: the card tilts toward the cursor and its layers float at different depths
  if (!fine) return;
  cards.forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), mx = (e.clientX - r.left) / r.width - .5, my = (e.clientY - r.top) / r.height - .5;
      c.classList.add('tilting');
      c.style.transform = `perspective(1000px) rotateX(${(-my * 9).toFixed(2)}deg) rotateY(${(mx * 11).toFixed(2)}deg) translateY(-6px)`;
      c.style.setProperty('--mx', mx.toFixed(3)); c.style.setProperty('--my', my.toFixed(3));
      c.style.setProperty('--gx', ((mx + .5) * 100).toFixed(1) + '%'); c.style.setProperty('--gy', ((my + .5) * 100).toFixed(1) + '%');
    });
    c.addEventListener('pointerleave', () => {
      c.classList.remove('tilting'); c.style.transform = '';
      c.style.setProperty('--mx', 0); c.style.setProperty('--my', 0);
    });
  });
})();

/* =========================== TOOLS =========================== */
[$('#trow1'), $('#trow2')].forEach((row, r) => {
  const list = C.tools[r] || [];
  const one = list.map(([n, slug]) => `<span class="tool"><i><img src="${/^https?:/.test(slug) ? slug : `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${slug}.svg`}" alt="" width="24" height="24" loading="lazy" onerror="this.replaceWith(document.createTextNode('${esc(n[0])}'))"></i>${esc(n)}</span>`).join('');
  row.setAttribute('role', 'img'); row.setAttribute('aria-label', list.map(t => t[0]).join(', '));
  row.innerHTML = `<div class="ttrack" aria-hidden="true">${one.repeat(4)}</div>`;
});

/* =========================== STRAPS: crossed tape that slides as you scroll =========================== */
$$('.straps').forEach(function straps(box) {
  const tracks = [...box.querySelectorAll('.strap-track')];
  const words = C[box.dataset.set || 'straps'] || [['Design', 'Code'], ['UI/UX', 'Full stack']];
  tracks.forEach((t, i) => { t.innerHTML = (words[i] || words[0]).map(w => `<span>${esc(w)}</span>`).join('').repeat(8); });
  if (reduce) return;
  let queued = false;
  function slide() {
    queued = false;
    const r = box.getBoundingClientRect();
    if (r.bottom < -200 || r.top > innerHeight + 200) return;
    const y = (innerHeight - r.top + 400) * .6; // grows as the straps move up the screen
    tracks.forEach((t, i) => {
      const w = t.scrollWidth / 2, x = i % 2 ? -w + (y % w) : -(y % w);
      t.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    });
  }
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(slide); } };
  addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue, { passive: true }); queue();
});

/* =========================== PAPETERIE: rubber stamps on a Paris postcard =========================== */
(function papeterie() {
  const card = $('#card'); if (!card) return;
  const W = card.width, H = card.height, x = card.getContext('2d');
  const TAU = Math.PI * 2, R = Math.random, STAMP_PX = 280;
  const SANS = '"Plus Jakarta Sans",sans-serif', SERIF = '"DM Serif Display",Georgia,serif', SCRIPT = '"Pinyon Script",cursive';
  const INK = C.stampInk || '#6B4630';
  const PAPERS = ['#FBF3E1', '#F9E8E2', '#EAF0F4', '#F2EFDD'];
  const wrap = $('#cardWrap'), ghost = $('#ghost'), gcv = ghost.querySelector('canvas'), hint = $('#papHint'), msgIn = $('#papMsg');
  const swrap = $('#stamps');
  const bUndo = $('#ppUndo'), bWash = $('#ppWash'), bNew = $('#ppNew'), bSave = $('#ppSave');
  const base = document.createElement('canvas'); base.width = W; base.height = H;
  let marks = [], stampI = 0, paperI = 0, nextRot = 0, nextScale = 1;

  /* ---- little drawing helpers (stamps are drawn on a 100 × 100 grid) ---- */
  const ell = (c, ex, ey, rx, ry, rot = 0) => { c.beginPath(); c.ellipse(ex, ey, rx, ry, rot, 0, TAU); };
  const cut = (c, fn) => { c.save(); c.globalCompositeOperation = 'destination-out'; fn(); c.restore(); };
  function heart(c, hx, hy, s) {
    c.beginPath(); c.moveTo(hx, hy + s * .5);
    c.bezierCurveTo(hx - s * .1, hy + s * .4, hx - s * .55, hy + s * .1, hx - s * .55, hy - s * .15);
    c.bezierCurveTo(hx - s * .55, hy - s * .45, hx - s * .15, hy - s * .55, hx, hy - s * .25);
    c.bezierCurveTo(hx + s * .15, hy - s * .55, hx + s * .55, hy - s * .45, hx + s * .55, hy - s * .15);
    c.bezierCurveTo(hx + s * .55, hy + s * .1, hx + s * .1, hy + s * .4, hx, hy + s * .5);
  }
  function sparkle(c, sx, sy, r) {
    c.beginPath(); c.moveTo(sx, sy - r);
    c.quadraticCurveTo(sx, sy, sx + r, sy); c.quadraticCurveTo(sx, sy, sx, sy + r);
    c.quadraticCurveTo(sx, sy, sx - r, sy); c.quadraticCurveTo(sx, sy, sx, sy - r); c.fill();
  }
  function ringText(c, text, cx, cy, r, font) {
    const ch = [...text], step = TAU / ch.length;
    c.save(); c.font = font; c.textAlign = 'center'; c.textBaseline = 'middle';
    ch.forEach((k, i) => { c.save(); c.translate(cx, cy); c.rotate(i * step); c.fillText(k, 0, -r); c.restore(); });
    c.restore();
  }
  function spaced(c, text, cx, cy, gap) {
    const ch = [...text], ws = ch.map(k => c.measureText(k).width);
    let px = cx - (ws.reduce((a, b) => a + b, 0) + gap * (ch.length - 1)) / 2;
    c.save(); c.textAlign = 'left'; ch.forEach((k, i) => { c.fillText(k, px, cy); px += ws[i] + gap; }); c.restore();
  }

  /* ---- the stamp drawer ---- */
  const STAMPS = [
    { fr: 'café', en: 'coffee', draw(c) {
      c.lineWidth = 2.6; ell(c, 50, 50, 46, 46); c.stroke();
      c.lineWidth = 1.3; ell(c, 50, 50, 33, 33); c.stroke();
      ringText(c, 'CAFÉ CRÈME • PARIS • ', 50, 50, 39.6, `700 7.4px ${SANS}`);
      c.beginPath(); c.moveTo(37, 46); c.lineTo(61, 46); c.quadraticCurveTo(61, 66, 49, 66); c.quadraticCurveTo(37, 66, 37, 46); c.fill();
      c.lineWidth = 2.6; c.beginPath(); c.arc(62, 53, 4.5, -1.4, 1.4); c.stroke();
      ell(c, 49, 68.5, 17, 2.6); c.fill();
      c.lineWidth = 1.8; [43, 49, 55].forEach(sx => { c.beginPath(); c.moveTo(sx, 42); c.bezierCurveTo(sx - 3, 38, sx + 3, 35, sx, 30); c.stroke(); });
      cut(c, () => { heart(c, 49, 55, 9); c.fill(); });
    } },
    { fr: 'nœud', en: 'bow', draw(c) {
      [1, -1].forEach(d => {
        c.save(); c.translate(50, 0); c.scale(d, 1); c.translate(-50, 0);
        c.beginPath(); c.moveTo(50, 47); c.bezierCurveTo(36, 26, 12, 30, 16, 46); c.bezierCurveTo(19, 60, 38, 58, 50, 51); c.fill();
        c.beginPath(); c.moveTo(47, 52); c.lineTo(33, 82); c.lineTo(39, 79); c.lineTo(43, 85); c.lineTo(53, 54); c.closePath(); c.fill();
        cut(c, () => { c.lineWidth = 2; c.beginPath(); c.moveTo(43, 47); c.quadraticCurveTo(30, 38, 22, 45); c.stroke(); });
        c.restore();
      });
      cut(c, () => { c.lineWidth = 2.4; ell(c, 50, 49.5, 8.5, 10.5); c.stroke(); });
      ell(c, 50, 49.5, 6.5, 8.5); c.fill();
    } },
    { fr: 'croissant', en: 'croissant', draw(c) {
      const A = [-160, -125, -90, -55, -20], RX = [8, 12, 15, 12, 8], RY = [8, 11, 13.5, 11, 8], cx = 50, cy = 74, r = 30;
      A.forEach((a, i) => { const t = a * Math.PI / 180; ell(c, cx + r * Math.cos(t), cy + r * Math.sin(t), RX[i], RY[i], t); c.fill(); });
      cut(c, () => {
        c.lineWidth = 2.2;
        [-142, -107, -73, -38].forEach(a => { const t = a * Math.PI / 180; c.beginPath(); c.moveTo(cx + 17 * Math.cos(t), cy + 17 * Math.sin(t)); c.lineTo(cx + 46 * Math.cos(t), cy + 46 * Math.sin(t)); c.stroke(); });
        c.lineWidth = 1.4; c.beginPath(); c.arc(cx, cy, 33, -1.95, -1.2); c.stroke();
      });
    } },
    { fr: 'la tour', en: 'Eiffel Tower', draw(c) {
      c.lineWidth = 2.4; c.strokeRect(18, 6, 64, 88);
      c.lineWidth = 1; c.strokeRect(22, 10, 56, 80);
      c.beginPath(); c.moveTo(48.6, 22); c.lineTo(51.4, 22); c.lineTo(55.5, 44); c.lineTo(59, 44); c.lineTo(59, 47.5); c.lineTo(57.2, 47.5);
      c.lineTo(68, 74); c.lineTo(60, 74); c.quadraticCurveTo(50, 56, 40, 74); c.lineTo(32, 74); c.lineTo(42.8, 47.5); c.lineTo(41, 47.5); c.lineTo(41, 44); c.lineTo(44.5, 44); c.closePath(); c.fill();
      c.fillRect(46, 32, 8, 2.4);
      c.lineWidth = 1.4; c.beginPath(); c.moveTo(50, 14); c.lineTo(50, 22); c.stroke();
      cut(c, () => {
        c.lineWidth = 1.1; c.beginPath(); c.moveTo(44, 49.5); c.lineTo(56, 62); c.moveTo(56, 49.5); c.lineTo(44, 62); c.stroke();
        c.lineWidth = .9; c.beginPath(); c.moveTo(47.6, 37); c.lineTo(52.4, 42); c.moveTo(52.4, 37); c.lineTo(47.6, 42); c.stroke();
      });
      c.font = `700 9px ${SANS}`; c.textBaseline = 'middle'; spaced(c, 'PARIS', 50, 83, 3);
      sparkle(c, 29, 19, 3.2); sparkle(c, 71, 19, 3.2);
    } },
    { fr: 'macaron', en: 'macaron', draw(c) {
      c.beginPath(); c.moveTo(23, 46); c.bezierCurveTo(23, 24, 77, 24, 77, 46); c.closePath(); c.fill();
      c.beginPath(); c.roundRect(25, 46, 50, 14, 7); c.fill();
      c.beginPath(); c.moveTo(23, 60); c.bezierCurveTo(23, 80, 77, 80, 77, 60); c.closePath(); c.fill();
      cut(c, () => {
        c.lineWidth = 1.8; c.beginPath(); c.moveTo(20, 46); c.lineTo(80, 46); c.moveTo(20, 60); c.lineTo(80, 60); c.stroke();
        c.lineWidth = 2; c.beginPath(); c.arc(40, 39, 9, Math.PI * 1.1, Math.PI * 1.42); c.stroke();
      });
      for (let fx = 26; fx <= 74; fx += 4) { ell(c, fx, 45, 1.7, 1.7); c.fill(); ell(c, fx, 61, 1.7, 1.7); c.fill(); }
    } },
    { fr: 'rose', en: 'rose', draw(c) {
      ell(c, 50, 38, 17, 17); c.fill();
      c.lineWidth = 3; c.beginPath(); c.moveTo(50, 54); c.quadraticCurveTo(46, 72, 50, 92); c.stroke();
      ell(c, 40, 72, 10, 4.5, -.5); c.fill(); ell(c, 59, 80, 10, 4.5, .5); c.fill();
      cut(c, () => {
        c.lineWidth = 1.8; c.beginPath();
        for (let t = 0; t <= 5.2 * Math.PI; t += .12) { const rr = 1 + t * .95, px = 50 + rr * Math.cos(t), py = 38 + rr * Math.sin(t); t ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
        c.lineWidth = 1.2; c.beginPath(); c.moveTo(33, 75.8); c.lineTo(47, 68.2); c.moveTo(52, 76); c.lineTo(66, 84); c.stroke();
      });
    } },
    { fr: 'cerises', en: 'cherries', draw(c) {
      c.lineWidth = 2.4;
      c.beginPath(); c.moveTo(37, 58); c.quadraticCurveTo(40, 38, 55, 22); c.stroke();
      c.beginPath(); c.moveTo(63, 54); c.quadraticCurveTo(60, 38, 55, 22); c.stroke();
      ell(c, 37, 66, 12, 12); c.fill(); ell(c, 63, 62, 12, 12); c.fill();
      ell(c, 67, 21, 11, 4.6, -.35); c.fill();
      cut(c, () => {
        c.lineWidth = 2; c.beginPath(); c.arc(37, 66, 7, Math.PI * 1.05, Math.PI * 1.45); c.stroke();
        c.beginPath(); c.arc(63, 62, 7, Math.PI * 1.05, Math.PI * 1.45); c.stroke();
        c.lineWidth = 1.1; c.beginPath(); c.moveTo(58, 24); c.lineTo(76, 18); c.stroke();
      });
    } },
    { fr: 'bisou', en: 'kiss', draw(c) {
      c.beginPath(); c.moveTo(18, 46); c.bezierCurveTo(28, 32, 40, 30, 50, 38); c.bezierCurveTo(60, 30, 72, 32, 82, 46); c.bezierCurveTo(70, 66, 30, 66, 18, 46); c.fill();
      cut(c, () => {
        c.lineWidth = 2.4; c.beginPath(); c.moveTo(21, 46); c.quadraticCurveTo(50, 53, 79, 46); c.stroke();
        ell(c, 59, 55.5, 6, 1.6, -.1); c.fill();
      });
      c.font = `22px ${SCRIPT}`; c.fillText('bisou', 50, 79);
    } },
    { fr: 'parfum', en: 'perfume', draw(c) {
      c.beginPath(); c.roundRect(29, 44, 42, 42, 11); c.fill();
      c.fillRect(44.5, 35, 11, 10);
      c.beginPath(); c.roundRect(41, 20, 18, 15, 3); c.fill();
      cut(c, () => {
        c.lineWidth = 1.6; c.beginPath(); c.roundRect(37, 55, 26, 20, 3); c.stroke();
        heart(c, 50, 65, 9); c.fill();
        c.lineWidth = 1.4; c.beginPath(); c.moveTo(42, 35.6); c.lineTo(58, 35.6); c.stroke();
      });
      sparkle(c, 76, 28, 5); sparkle(c, 23, 36, 3.4); sparkle(c, 80, 48, 2.6);
    } },
    { fr: 'par avion', en: 'air mail', draw(c) {
      c.save(); c.beginPath(); c.rect(6, 18, 88, 64); c.rect(13, 25, 74, 50); c.clip('evenodd');
      c.lineWidth = 4.5; for (let k = -80; k < 110; k += 11) { c.beginPath(); c.moveTo(k, 90); c.lineTo(k + 70, 10); c.stroke(); }
      c.restore();
      c.lineWidth = 2.2; c.strokeRect(6, 18, 88, 64);
      c.lineWidth = 1; c.strokeRect(13, 25, 74, 50);
      c.lineWidth = 2.2; c.strokeRect(36, 31, 28, 19);
      c.beginPath(); c.moveTo(36, 31); c.lineTo(50, 42); c.lineTo(64, 31); c.stroke();
      heart(c, 50, 42.5, 8); c.fill();
      c.font = `700 8px ${SANS}`; c.textBaseline = 'middle'; spaced(c, 'PAR AVION', 50, 63, 1.6);
    } },
    { fr: 'bonjour', en: 'hello', draw(c) {
      c.lineWidth = 2.4; c.beginPath(); c.roundRect(5, 27, 90, 46, 7); c.stroke();
      c.lineWidth = 1; c.beginPath(); c.roundRect(9.5, 31.5, 81, 37, 4); c.stroke();
      c.font = `italic 20px ${SERIF}`; c.fillText('Bonjour', 50, 47);
      c.font = `700 5.4px ${SANS}`; c.textBaseline = 'middle'; spaced(c, 'AVEC AMOUR', 50, 61.5, 1.4);
      sparkle(c, 50, 22, 3);
    } },
    { fr: 'cachet', en: 'wax seal', draw(c) {
      c.beginPath();
      for (let i = 0; i <= 140; i++) { const t = i / 140 * TAU, rr = 42 + 2.6 * Math.sin(t * 14) + 1.4 * Math.sin(t * 5 + 1), px = 50 + rr * Math.cos(t), py = 50 + rr * Math.sin(t); i ? c.lineTo(px, py) : c.moveTo(px, py); }
      c.fill();
      cut(c, () => {
        c.lineWidth = 1.6; ell(c, 50, 50, 31, 31); c.stroke();
        c.font = `italic 40px ${SERIF}`; c.fillText('M', 50, 53);
      });
    } }
  ];

  // an inked impression: crisp art, then speckles, bald patches and uneven pressure knocked out of it
  function inkStamp(i, color, px, rough) {
    const cv = document.createElement('canvas'); cv.width = cv.height = px;
    const c = cv.getContext('2d');
    c.scale(px / 100, px / 100);
    c.fillStyle = c.strokeStyle = color; c.lineCap = c.lineJoin = 'round'; c.textAlign = 'center'; c.textBaseline = 'middle';
    STAMPS[i].draw(c);
    if (!rough) return cv;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'destination-out'; c.fillStyle = '#000';
    for (let k = 0, n = px * px / 26 * rough; k < n; k++) { c.globalAlpha = R() * .75; const s = .6 + R() * px / 160; c.fillRect(R() * px, R() * px, s, s); }
    for (let k = 0; k < 6 * rough; k++) { c.globalAlpha = .2 + R() * .35; ell(c, R() * px, R() * px, px * (.01 + R() * .035), px * (.005 + R() * .012), R() * Math.PI); c.fill(); }
    const a = R() * TAU, h = px / 2, g = c.createLinearGradient(h + Math.cos(a) * h, h + Math.sin(a) * h, h - Math.cos(a) * h, h - Math.sin(a) * h);
    g.addColorStop(0, 'rgba(0,0,0,.6)'); g.addColorStop(.55, 'rgba(0,0,0,0)');
    c.globalAlpha = rough; c.fillStyle = g; c.fillRect(0, 0, px, px);
    return cv;
  }

  /* ---- the postcard itself ---- */
  function paintBase() {
    const b = base.getContext('2d');
    b.globalAlpha = 1; b.fillStyle = PAPERS[paperI]; b.fillRect(0, 0, W, H);
    for (let k = 0; k < 9000; k++) { b.fillStyle = `rgba(71,47,38,${(R() * .055).toFixed(3)})`; b.fillRect(R() * W, R() * H, 1.2 + R() * 2.2, 1.2 + R() * 2.2); }
    b.strokeStyle = 'rgba(71,47,38,.3)'; b.lineWidth = 2; b.strokeRect(34, 34, W - 68, H - 68);
    b.lineWidth = 1; b.strokeRect(46, 46, W - 92, H - 92);
    b.fillStyle = 'rgba(71,47,38,.5)'; b.font = `700 22px ${SANS}`; b.textBaseline = 'middle'; spaced(b, 'CARTE POSTALE', W / 2, 96, 10);
    // the postmark
    const pm = 'rgba(43,63,122,.42)', cx = 1300, cy = 196, d = new Date();
    b.strokeStyle = b.fillStyle = pm;
    b.lineWidth = 3; ell(b, cx, cy, 86, 86); b.stroke();
    b.lineWidth = 1.5; ell(b, cx, cy, 64, 64); b.stroke();
    ringText(b, 'PARIS • PAPETERIE • 75006 • ', cx, cy, 75, `700 14px ${SANS}`);
    b.textAlign = 'center'; b.textBaseline = 'middle';
    b.font = `32px ${SERIF}`; b.fillText(`${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en', { month: 'short' }).toUpperCase()}`, cx, cy - 10);
    b.font = `700 17px ${SANS}`; b.fillText(String(d.getFullYear()), cx, cy + 22);
    b.lineWidth = 3;
    for (let k = 0; k < 4; k++) { b.beginPath(); for (let px = 930; px <= 1205; px += 4) { const py = 150 + k * 28 + Math.sin(px / 22) * 7; px === 930 ? b.moveTo(px, py) : b.lineTo(px, py); } b.stroke(); }
    // a dotted line to write on
    b.strokeStyle = 'rgba(71,47,38,.22)'; b.lineWidth = 2; b.setLineDash([2, 10]);
    b.beginPath(); b.moveTo(96, 912); b.lineTo(980, 912); b.stroke(); b.setLineDash([]);
  }
  function render() {
    x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; x.drawImage(base, 0, 0);
    marks.forEach(m => {
      x.save(); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .92;
      x.translate(m.x, m.y); x.rotate(m.r); x.drawImage(m.img, -m.img.width / 2, -m.img.height / 2); x.restore();
    });
    const msg = msgIn.value.trim();
    if (msg) { x.save(); x.fillStyle = '#3B2A22'; x.font = `78px ${SCRIPT}`; x.textBaseline = 'alphabetic'; x.fillText(msg, 100, 896, 1200); x.restore(); }
    const n = marks.length;
    bUndo.disabled = bWash.disabled = !n;
    hint.textContent = !n ? `${fine ? 'Click' : 'Tap'} anywhere on the card to press your stamp` : n >= 40 ? 'That’s a lot of love for one postcard ✦' : n === 1 ? 'Très chic. Keep going ✦' : '';
  }

  /* ---- the stamp drawer ---- */
  swrap.innerHTML = STAMPS.map((s, i) => `<button class="stp" type="button" data-i="${i}" aria-pressed="${i === stampI}" aria-label="${esc(s.fr)} (${esc(s.en)})" title="${esc(s.en)}"><canvas width="128" height="128"></canvas><span>${esc(s.fr)}</span></button>`).join('');
  function paintTiles() {
    $$('.stp canvas').forEach((cv, i) => { const c = cv.getContext('2d'); c.clearRect(0, 0, 128, 128); c.drawImage(inkStamp(i, INK, 128, .3), 0, 0); });
  }
  function rollNext() { nextRot = (R() - .5) * .42; nextScale = .88 + R() * .2; paintGhost(); }
  function paintGhost() {
    const c = gcv.getContext('2d'); c.clearRect(0, 0, gcv.width, gcv.height);
    c.drawImage(inkStamp(stampI, INK, gcv.width, 0), 0, 0);
    gcv.style.rotate = nextRot + 'rad'; gcv.style.scale = nextScale;
  }
  swrap.addEventListener('click', e => {
    const b = e.target.closest('.stp'); if (!b) return;
    stampI = +b.dataset.i; $$('.stp').forEach(t => t.setAttribute('aria-pressed', t === b)); paintGhost();
  });

  /* ---- pressing ---- */
  function press(px, py) {
    const size = Math.round(STAMP_PX * nextScale);
    marks.push({ x: px, y: py, r: nextRot, img: inkStamp(stampI, INK, size, 1) });
    render(); rollNext();
  }
  const toCard = e => { const r = card.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
  card.addEventListener('click', e => {
    const [px, py] = toCard(e);
    if (!reduce && ghost.classList.contains('on')) {
      ghost.classList.remove('press'); void ghost.offsetWidth; ghost.classList.add('press');
      setTimeout(() => press(px, py), 110);
    } else press(px, py);
  });
  card.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault(); press(170 + R() * (W - 340), 200 + R() * (H - 380));
  });
  if (fine) {
    const sizeGhost = () => wrap.style.setProperty('--gs', STAMP_PX * card.getBoundingClientRect().width / W + 'px');
    wrap.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { sizeGhost(); ghost.classList.add('on'); } });
    wrap.addEventListener('pointerleave', () => ghost.classList.remove('on'));
    wrap.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = wrap.getBoundingClientRect(), gs = parseFloat(wrap.style.getPropertyValue('--gs')) || 0;
      ghost.style.transform = `translate(${e.clientX - r.left - gs / 2}px,${e.clientY - r.top - gs / 2}px)`;
    });
    addEventListener('resize', sizeGhost, { passive: true });
  }

  /* ---- controls ---- */
  msgIn.addEventListener('input', render);
  bUndo.addEventListener('click', () => { marks.pop(); render(); });
  bWash.addEventListener('click', () => { marks = []; render(); });
  bNew.addEventListener('click', () => { marks = []; msgIn.value = ''; paperI = (paperI + 1) % PAPERS.length; paintBase(); render(); });
  bSave.addEventListener('click', () => {
    card.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'postcard-from-paris.png';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, 'image/png');
  });

  function boot() { paintBase(); render(); paintTiles(); rollNext(); }
  boot();
  // the canvas needs the web fonts before it can letter anything
  if (document.fonts) Promise.all([`22px ${SANS}`, `700 22px ${SANS}`, `32px ${SERIF}`, `italic 32px ${SERIF}`, `40px ${SCRIPT}`].map(f => document.fonts.load(f))).then(() => { paintBase(); render(); paintTiles(); paintGhost(); }).catch(() => {});
})();

/* =========================== REACH OUT FORM (Formspree) =========================== */
(function reachForm() {
  const form = $('#rform'), send = $('#rSend'), status = $('#rStatus');
  form.action = C.formspree;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = ''; status.classList.remove('err');
    send.disabled = true; send.firstChild.textContent = 'Sending…';
    try {
      const res = await fetch(C.formspree, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { form.classList.add('sent'); form.dispatchEvent(new Event('tw:sent')); setTimeout(() => form.reset(), 1100); }
      else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.errors ? data.errors.map(x => x.message).join(', ') : 'Something went wrong.');
      }
    } catch (err) {
      status.textContent = `${err.message || 'Could not send.'} You can also email me at ${C.email}.`;
      status.classList.add('err');
    } finally { send.disabled = false; send.firstChild.textContent = 'Send message'; }
  });
  $('#rAgain').addEventListener('click', () => { form.classList.remove('sent'); form.querySelector('[name=name]').focus(); });
})();

/* =========================== PROCESS: pinned steps + particle form =========================== */
const proc = $('#education'), steps = $$('.pstep'), railB = $$('#prail button');
let pStep = 0;
function procUpdate() {
  const r = proc.getBoundingClientRect(), span = proc.offsetHeight - innerHeight;
  const p = clamp(-r.top / span, 0, .9999), s = Math.floor(p * steps.length);
  railB.forEach((b, i) => b.style.setProperty('--f', clamp(p * steps.length - i, 0, 1).toFixed(3)));
  if (s !== pStep) {
    pStep = s;
    steps.forEach((el, i) => el.classList.toggle('on', i === s));
    railB.forEach((b, i) => i === s ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current'));
  }
}
railB.forEach((b, i) => b.addEventListener('click', () => {
  const span = proc.offsetHeight - innerHeight; scrollTo({ top: proc.offsetTop + span * (i + .5) / steps.length, behavior: reduce ? 'auto' : 'smooth' });
}));

(function particles() {
  const host = $('.pstick'), cv = $('#procCanvas'), x = cv.getContext('2d');
  const SW = 400, SH = 200;   // a wide canvas, so a school name fits on one line
  const off = document.createElement('canvas'); off.width = SW; off.height = SH; const o = off.getContext('2d', { willReadFrequently: true });
  // each step's data-shape (the school's name) is drawn in the display font and sampled into dots
  const shapes = steps.map(el => () => {
    const t = el.dataset.shape || el.querySelector('h3').textContent;
    let fs = 170; o.font = `400 ${fs}px Anton`; fs = Math.min(fs, fs * 360 / o.measureText(t).width);
    o.font = `400 ${fs}px Anton`; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText(t, SW / 2, SH / 2 + fs * .04);
    star(SW / 2 + o.measureText(t).width / 2 + 10, SH / 2 - fs * .42, 14, 4); star(SW / 2 - o.measureText(t).width / 2 - 8, SH / 2 + fs * .42, 10, 3);
  });
  function star(cx, cy, r, w) { o.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? w : r; o.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } o.closePath(); o.fill(); }
  function rrect(a, b, w, h, r) { o.beginPath(); o.roundRect ? o.roundRect(a, b, w, h, r) : o.rect(a, b, w, h); }
  const COUNT = innerWidth < 860 ? 1300 : 2600;
  let targets = [];
  const sample = () => { targets = shapes.map(draw => {
    o.clearRect(0, 0, SW, SH); o.fillStyle = o.strokeStyle = '#fff'; draw();
    const d = o.getImageData(0, 0, SW, SH).data, pool = [];
    for (let yy = 0; yy < SH; yy += 2) for (let xx = 0; xx < SW; xx += 2) if (d[(yy * SW + xx) * 4 + 3] > 128) pool.push([xx / SW - .5, (yy - SH / 2) / SW]);
    return Array.from({ length: COUNT }, () => { const p = pool[(Math.random() * pool.length) | 0] || [0, 0]; return [p[0] + (Math.random() - .5) * .012, p[1] + (Math.random() - .5) * .012]; });
  }); };
  sample(); document.fonts.load('100px Anton').then(sample);
  let W = 1, H = 1, cx = 0, cy = 0, sz = 1, mobile = false;
  const P = Array.from({ length: COUNT }, (_, i) => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: 0, vy: 0, s: Math.random() * 6.28, acc: Math.random() < .6, r: Math.random() < .15 ? 3 : 2.1 }));
  const ptr = { x: -999, y: -999 };
  function resize() {
    W = host.clientWidth; H = host.clientHeight; cv.width = W * DPR; cv.height = H * DPR; x.setTransform(DPR, 0, 0, DPR, 0, 0);
    mobile = W < 860;
    if (mobile) { cx = W * .5; cy = H * .36; sz = Math.min(W * .9, H * .8); } else { cx = W * .72; cy = H * .5; sz = Math.min(W * .4, H * 1.1); }
  }
  resize(); addEventListener('resize', resize);
  host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; });
  host.addEventListener('pointerleave', () => { ptr.x = ptr.y = -999; });
  let raf = 0, on = false;
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const T = targets[pStep], time = t / 1000;
    x.clearRect(0, 0, W, H);
    const ac = THEME.accent, fg = THEME.fg;
    x.globalAlpha = mobile ? .45 : 1;
    for (let i = 0; i < COUNT; i++) {
      const p = P[i], tg = T[i];
      const tx = cx + tg[0] * sz + Math.sin(time * 1.3 + p.s) * 2.2, ty = cy + tg[1] * sz + Math.cos(time * 1.1 + p.s) * 2.2;
      p.vx += (tx - p.x) * .045; p.vy += (ty - p.y) * .045;
      const dx = p.x - ptr.x, dy = p.y - ptr.y, d2 = dx * dx + dy * dy;
      if (d2 < 8100) { const f = (1 - Math.sqrt(d2) / 90) * 3.2, d = Math.sqrt(d2) || 1; p.vx += dx / d * f; p.vy += dy / d * f; }
      p.vx *= .82; p.vy *= .82; p.x += p.vx; p.y += p.vy;
    }
    x.fillStyle = ac; for (const p of P) if (p.acc) x.fillRect(p.x, p.y, p.r, p.r);
    x.fillStyle = fg; for (const p of P) if (!p.acc) x.fillRect(p.x, p.y, p.r, p.r);
    x.globalAlpha = 1;
  }
  new IntersectionObserver(([e]) => {
    on = e.isIntersecting;
    if (on && !raf) raf = requestAnimationFrame(frame); else if (!on && raf) { cancelAnimationFrame(raf); raf = 0; }
  }, { rootMargin: '10% 0px' }).observe(proc);
})();

/* =========================== CONTACT CURTAIN =========================== */
const foot = $('#foot'), space = $('#contact'), fTitle = $('#footTitle'), fEnd = $('#footEnd');
const sizeFoot = () => { space.style.height = foot.offsetHeight + 'px'; };
sizeFoot(); addEventListener('resize', sizeFoot); document.fonts.ready.then(sizeFoot);
function footUpdate() {
  const r = space.getBoundingClientRect(), q = clamp((innerHeight - r.top) / space.offsetHeight, 0, 1);
  foot.classList.toggle('live', q > 0);
  fTitle.style.transform = `scaleY(${(.12 + .88 * q).toFixed(3)})`;
  fEnd.style.transform = `translateY(${((1 - q) * 60).toFixed(1)}px) rotate(${((1 - q) * -8).toFixed(2)}deg)`;
  fEnd.style.opacity = clamp(q * 1.4 - .2, 0, 1).toFixed(2);
}
const fcopy = $('#fcopy');
fcopy.addEventListener('click', async () => {
  let ok = false; try { await navigator.clipboard.writeText(C.email); ok = true; } catch (e) {}
  fcopy.querySelector('.fcopy-t').textContent = ok ? 'Copied!' : C.email;
  fcopy.classList.add('done'); setTimeout(() => fcopy.classList.remove('done'), 1600);
});

/* =========================== SCROLL LOOP =========================== */
let ticking = false;
function onScroll() {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => { ticking = false; navState(); fillUpdate(); procUpdate(); footUpdate(); });
}
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
onScroll();

/* =========================== REACH OUT: typewriter (key presses, carriage, sounds) =========================== */
(function typewriter() {
  const form = $('#rform'); if (!form || !form.classList.contains('tw')) return;
  const paper = form.querySelector('.tw-paper'), keysBox = $('#twKeys'), soundBtn = $('#twSound'), area = form.querySelector('textarea');
  /* key hotspots over the photo: [key, x, y, w, h] in the image's 736x575 pixels */
  const IW = 736, IH = 575, KEYS = [["1",117,319,32,28],["2",162,319,32,28],["3",205,319,32,28],["4",248,319,32,28],["5",291,319,32,28],["6",333,319,32,28],["7",376,319,32,28],["8",419,319,32,28],["9",462,319,32,28],["0",506,319,32,28],["-",550,319,32,28],["=",592,319,32,28],["q",136,361,32,28],["w",180,361,32,28],["e",223,361,32,28],["r",266,361,32,28],["t",309,361,32,28],["z",352,361,32,28],["u",395,361,32,28],["i",441,361,32,28],["o",484,361,32,28],["p",527,361,32,28],["[",573,361,32,28],["a",144,401,32,28],["s",188,401,32,28],["d",232,401,32,28],["f",275,401,32,28],["g",320,401,32,28],["h",363,401,32,28],["j",406,401,32,28],["k",451,401,32,28],["l",494,401,32,28],[";",538,401,32,28],["'",582,401,32,28],["y",162,442,32,28],["x",206,442,32,28],["c",249,442,32,28],["v",293,442,32,28],["b",337,442,32,28],["n",381,442,32,28],["m",425,442,32,28],[",",469,442,32,28],[".",512,442,32,28],["/",564,442,32,28],["shift",112,446,36,26],["shift2",618,446,36,26],["enter",638,400,32,26],["back",626,354,30,24],["space",170,488,408,18]];
  KEYS.forEach(([k, x, y, w, h]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.tabIndex = -1; b.className = 'tw-key'; b.dataset.k = k;
    Object.assign(b.style, { left: x / IW * 100 + '%', top: y / IH * 100 + '%', width: w / IW * 100 + '%', height: h / IH * 100 + '%' });
    b.style.setProperty('--bs', `${IW / w * 100}% ${IH / h * 100}%`);
    b.style.setProperty('--bp', `${x / (IW - w) * 100}% ${y / (IH - h) * 100}%`);
    keysBox.appendChild(b);
  });
  const keyEl = {}; keysBox.querySelectorAll('.tw-key').forEach(b => keyEl[b.dataset.k] = b);
  const isField = el => el && el.matches && el.matches('input:not([type=radio]):not([type=hidden]), textarea') && form.contains(el);
  let lastField = null;

  /* sounds: synthesized with Web Audio so there are no audio files to load */
  let on = true; try { on = localStorage.getItem('tw-sound') !== 'off'; } catch (e) {}
  soundBtn.setAttribute('aria-pressed', on);
  soundBtn.addEventListener('click', () => { on = !on; soundBtn.setAttribute('aria-pressed', on); try { localStorage.setItem('tw-sound', on ? 'on' : 'off'); } catch (e) {} });
  let ac, noise;
  const ctx = () => {
    if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = new A();
      noise = ac.createBuffer(1, ac.sampleRate * .4, ac.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  };
  const burst = (a, t, dur, freq, q, vol, type = 'bandpass') => {
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noise; f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    s.connect(f).connect(g).connect(a.destination); s.start(t, Math.random() * .3); s.stop(t + dur);
  };
  const tone = (a, t, freq, dur, vol, type = 'sine') => {
    const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur);
  };
  const clack = (soft) => { if (!on) return; const a = ctx(); if (!a) return; const t = a.currentTime;
    burst(a, t, .045, 1700 + Math.random() * 900, 1.1, soft ? .35 : .6); tone(a, t, 120 + Math.random() * 30, .06, soft ? .12 : .22, 'triangle'); };
  const ding = () => { if (!on) return; const a = ctx(); if (!a) return; const t = a.currentTime; tone(a, t, 2093, 1.2, .18); tone(a, t, 4186, .6, .05); };
  const zip = (dur = .28) => { if (!on) return; const a = ctx(); if (!a) return; const t = a.currentTime;
    for (let i = 0; i < 9; i++) burst(a, t + i * dur / 9, .02, 2400, 2, .12); burst(a, t + dur, .08, 900, 1, .35); };

  /* key press animation */
  const timers = {};
  const press = k => { const b = keyEl[k] || (k === ' ' ? keyEl.space : null) || keyEl[Object.keys(keyEl)[(k.charCodeAt(0) || 0) % 26]];
    if (!b) return; b.classList.add('down'); clearTimeout(timers[b.dataset.k]); timers[b.dataset.k] = setTimeout(() => b.classList.remove('down'), 110); };

  /* carriage: the paper + platen slide left as the column grows, and snap back on a new line */
  const caretCol = el => {
    let pos; try { pos = el.selectionStart; } catch (e) {} if (pos == null) pos = el.value.length;
    const col = pos - el.value.lastIndexOf('\n', pos - 1) - 1;
    const per = Math.max(10, Math.floor(el.clientWidth / (parseFloat(getComputedStyle(el).fontSize) * .58)));
    return { col: col % per, per };
  };
  let bellAt = -1;
  const carriage = el => {
    if (reduce || !isField(el)) return;
    const { col, per } = caretCol(el);
    form.style.setProperty('--cx', (-Math.min(col / per, 1) * 26).toFixed(1) + 'px');
    if (el === area && col === per - 6 && bellAt !== el.selectionStart) { bellAt = el.selectionStart; ding(); }
  };

  form.addEventListener('focusin', e => { if (isField(e.target)) { lastField = e.target; carriage(e.target); } });
  form.addEventListener('keydown', e => {
    if (!isField(e.target) || e.metaKey || e.ctrlKey || e.altKey || e.repeat && e.key.length > 1) return;
    if (e.key.length === 1) { press(e.key.toLowerCase()); clack(); }
    else if (e.key === 'Backspace') { press('back'); clack(true); }
    else if (e.key === 'Enter' && e.target === area) { press('enter'); zip(); }
  });
  ['input', 'keyup', 'click'].forEach(ev => form.addEventListener(ev, e => carriage(e.target)));

  /* clicking the on-screen keys types into the last focused field */
  keysBox.addEventListener('pointerdown', e => {
    const b = e.target.closest('.tw-key'); if (!b) return;
    e.preventDefault();
    const f = isField(document.activeElement) ? document.activeElement : (lastField || area);
    f.focus();
    const k = b.dataset.k, ch = k === 'space' ? ' ' : k === 'enter' ? '\n' : k;
    if (k === 'enter' && f !== area) { press(k); return; }
    try {
      const s = f.selectionStart, en = f.selectionEnd;
      if (k === 'back') { if (s === en && s > 0) f.setRangeText('', s - 1, s, 'end'); else f.setRangeText('', s, en, 'end'); }
      else f.setRangeText(ch, s, en, 'end');
    } catch (err) { f.value = k === 'back' ? f.value.slice(0, -1) : f.value + ch; } // email inputs have no selection API
    f.dispatchEvent(new Event('input', { bubbles: true }));
    press(k); k === 'enter' ? zip() : clack(k === 'back');
  });

  /* sending rolls the sheet out; "send another" feeds a fresh one in */
  form.addEventListener('tw:sent', () => { form.style.setProperty('--cx', '0px'); zip(.9); });
  $('#rAgain').addEventListener('click', () => {
    paper.style.transition = 'none'; paper.style.transform = reduce ? '' : 'translateY(100%)'; paper.style.opacity = '1';
    paper.offsetHeight;
    paper.style.transition = ''; paper.style.transform = ''; paper.style.opacity = '';
    zip(.5);
  });
})();

})();
