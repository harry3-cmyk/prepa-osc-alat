'use strict';
/* Simulateur de coordination type SCM.
   Canaux : cyclique (bleu, 2 axes), collectif (vert, vertical), palonniers (rouge, horizontal).
   Toutes les 2 s, deux axes sont déplacés au hasard ; il faut les ramener au centre. */

const SIM_COLORS = [['rouge', '#FF4D4D'], ['orange', '#FF9F1C'], ['vert', '#3DDC84']];
const SIM_SHAPES = ['rond', 'carré', 'triangle', 'losange'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const Sim = {
  s: null, raf: 0, ac: null, noise: null,
  start(day, mode) {
    const set = Store.data.profile.settings, dur = mode === 'express' ? 90 : (set.simDur || 3) * 60;
    const series = mode === 'express' ? [{ scored: true, label: 'Série express' }]
      : day === 1 ? [{ scored: false, label: 'Essai non noté' }, { scored: true, label: 'Série 1/3' }, { scored: true, label: 'Série 2/3' }, { scored: true, label: 'Série 3/3' }]
      : [{ scored: true, label: 'Série 1/3' }, { scored: true, label: 'Série 2/3' }, { scored: true, label: 'Série 3/3' }];
    this.s = { day, mode, dur, series, si: 0, results: [], self: [], inv: !!set.invPed, sound: set.simSound !== false, phase: 'brief' };
    Runner.open();
    this.brief();
  },
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; this.noiseOff(); document.removeEventListener('keydown', this.kd); document.removeEventListener('keyup', this.ku); window.removeEventListener('resize', this.rs); clearInterval(this.pauseH); },
  title() { return `SCM · Jour ${this.s.day}`; },
  brief() {
    const s = this.s;
    Runner.el.innerHTML = `<div class="rn">${Runner.header(this.title(), s.mode === 'express' ? 'Série express' : 'Conditions réelles')}<div class="rn-body center brief">
      <div class="sim-pv" aria-hidden="true"><span class="ind b"></span><span class="ind g"></span><span class="ind r"></span></div>
      <h2>Briefing</h2>
      <ol class="steps">
        <li>Une forme colorée s'affiche 5 secondes : retiens sa forme <b>et</b> sa couleur.</li>
        <li>Garde les trois indicateurs au centre. Pouce gauche : <b class="g">vert</b> en haut-bas, <b class="r">rouge</b> en gauche-droite${s.inv ? ' (inversé)' : ''}. Pouce droit : <b class="b">bleu</b>.</li>
        <li>Des formes clignotent sur les bords : compte celles identiques à la forme retenue.</li>
        ${s.day === 2 ? '<li>Un son <b>grave</b> : bouton Grave (gauche). Un son <b>aigu</b> : bouton Aigu (droite).</li><li>Quatre nombres s\'affichent en haut pendant la série : retiens-les dans l\'ordre.</li>' : ''}
      </ol>
      <p class="muted sm">${s.series.length} série${s.series.length > 1 ? 's' : ''} de ${mmss(s.dur)}. Sur ordinateur : Z Q S D (ou W A S D) et les flèches${s.day === 2 ? ', F pour grave et J pour aigu' : ''}.</p>
      <button class="btn" data-ract="simgo">Je suis prêt</button></div></div>`;
  },
  act(a) {
    if (a === 'simgo') { this.initAudio(); this.prep(); return true; }
    if (a === 'simnext') { if (this.s.phase !== 'input') return true; this.collect(); this.s.si++; this.s.si < this.s.series.length ? this.prep() : this.finish(); return true; }
    if (a.startsWith('self')) { this.s.selfPick = a.slice(4); $$('.selfq button', Runner.el).forEach(b => b.setAttribute('aria-pressed', b.dataset.ract === a)); return true; }
    if (a === 'again') { this.stop(); Runner.start(this.s.day === 1 ? 'scm1' : 'scm2', this.s.mode); return true; }
    return false;
  },
  initAudio() {
    try { this.ac = this.ac || new (window.AudioContext || window.webkitAudioContext)(); this.ac.resume(); } catch { this.ac = null; }
  },
  tone(f) {
    if (!this.ac) return;
    const o = this.ac.createOscillator(), g = this.ac.createGain(), t = this.ac.currentTime;
    o.frequency.value = f; o.type = 'sine'; o.connect(g); g.connect(this.ac.destination);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
    o.start(t); o.stop(t + 0.26);
  },
  noiseOn() {
    if (!this.ac || this.noise || !this.s.sound) return;
    const len = this.ac.sampleRate * 2, buf = this.ac.createBuffer(1, len, this.ac.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    const src = this.ac.createBufferSource(), g = this.ac.createGain();
    src.buffer = buf; src.loop = true; g.gain.value = 0.12; src.connect(g); g.connect(this.ac.destination); src.start();
    this.noise = src;
  },
  noiseOff() { try { this.noise && this.noise.stop(); } catch { /* déjà arrêté */ } this.noise = null; },

  /* ----- Préparation d'une série : forme cible ----- */
  prep() {
    const s = this.s, ser = s.series[s.si];
    ser.target = { shape: R.int(0, 3), color: R.int(0, 2) };
    s.phase = 'target';
    this.layout(ser.label);
    s.t0 = performance.now();
    this.loop();
  },
  layout(label) {
    const d2 = this.s.day === 2;
    document.removeEventListener('keydown', this.kd); document.removeEventListener('keyup', this.ku); window.removeEventListener('resize', this.rs);
    Runner.el.innerHTML = `<div class="rn sim">${Runner.header(this.title(), label)}
      <div class="sim-stage"><canvas id="simc" aria-label="Indicateurs du simulateur"></canvas></div>
      <div class="sim-ctrl">
        <div class="stick" id="stL"><div class="ring"></div><div class="knob g"></div>${d2 ? '<button class="sbtn" id="bL">Grave</button>' : ''}<span class="lab">Collectif · palonniers</span></div>
        <div class="stick" id="stR"><div class="ring"></div><div class="knob b"></div>${d2 ? '<button class="sbtn" id="bR">Aigu</button>' : ''}<span class="lab">Cyclique</span></div>
      </div></div>`;
    const cv = $('#simc');
    this.cv = cv; this.ctx = cv.getContext('2d');
    this.rs = () => { const r = cv.parentElement.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = r.width * dpr; cv.height = r.height * dpr; cv.style.width = r.width + 'px'; cv.style.height = r.height + 'px'; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); this.W = r.width; this.H = r.height; };
    this.rs(); window.addEventListener('resize', this.rs);
    this.in = { lx: 0, ly: 0, rx: 0, ry: 0, kb: {} };
    this.stick($('#stL'), (x, y) => { this.in.lx = x; this.in.ly = y; });
    this.stick($('#stR'), (x, y) => { this.in.rx = x; this.in.ry = y; });
    if (d2) { this.press($('#bL'), 'g'); this.press($('#bR'), 'a'); }
    this.kd = e => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'z', 'q', 's', 'd', 'w', 'a'].includes(k)) { this.in.kb[k] = 1; e.preventDefault(); }
      if (d2 && !e.repeat && k === 'f') this.answer('g');
      if (d2 && !e.repeat && k === 'j') this.answer('a');
    };
    this.ku = e => { delete this.in.kb[e.key.toLowerCase()]; };
    document.addEventListener('keydown', this.kd); document.addEventListener('keyup', this.ku);
  },
  stick(el, cb) {
    const knob = $('.knob', el);
    let id = null, cx = 0, cy = 0, rad = 1;
    const set = (x, y) => { knob.style.transform = `translate(${x * rad}px, ${-y * rad}px)`; cb(x, y); };
    const move = e => { let dx = (e.clientX - cx) / rad, dy = (e.clientY - cy) / rad; const m = Math.hypot(dx, dy); if (m > 1) { dx /= m; dy /= m; } set(dx, -dy); };
    el.addEventListener('pointerdown', e => {
      if (e.target.closest('.sbtn')) return;
      id = e.pointerId; el.setPointerCapture(id);
      const r = $('.ring', el).getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; rad = r.width / 2 * 0.72;
      move(e); e.preventDefault();
    });
    el.addEventListener('pointermove', e => { if (e.pointerId === id) move(e); });
    const up = e => { if (e.pointerId === id) { id = null; set(0, 0); } };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  },
  press(btn, k) { btn.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); this.answer(k); btn.classList.add('hit'); setTimeout(() => btn.classList.remove('hit'), 150); }); },

  /* ----- Série ----- */
  begin() {
    const s = this.s, ser = s.series[s.si];
    s.phase = 'run'; s.t0 = performance.now(); s.last = s.t0;
    ser.st = {
      pos: { bx: 0, by: 0, g: 0, r: 0 }, kick: {}, drift: { bx: 0, by: 0, g: 0, r: 0 }, nextKick: 2, nextDrift: 1,
      err: { bx: 0, by: 0, g: 0, r: 0 }, frames: 0, zone: 0, rts: [], pend: {},
      lamps: [], nextLamp: 2 + Math.random(), trueCount: 0,
      tones: [], nextTone: 3 + Math.random() * 2, hits: 0, wrong: 0, miss: 0,
      digits: s.day === 2 ? [R.int(1, 9), R.int(1, 9), R.int(1, 9), R.int(10, 99)] : [], digitAt: [0.18, 0.38, 0.58, 0.78].map(f => f * s.dur), shown: -1
    };
    if (s.day === 2) this.noiseOn();
  },
  answer(k) {
    const ser = this.s.series[this.s.si]; if (this.s.phase !== 'run' || !ser.st) return;
    const st = ser.st, t = (performance.now() - this.s.t0) / 1000;
    const open = st.tones.find(x => !x.done && t - x.t <= 1.5);
    if (!open) { st.wrong++; return; }
    open.done = true;
    if (open.k === k) st.hits++; else st.wrong++;
  },
  loop() {
    cancelAnimationFrame(this.raf);
    const step = now => {
      const s = this.s; if (!s || !this.cv || !document.body.contains(this.cv)) return;
      if (s.phase === 'target') {
        const t = (now - s.t0) / 1000;
        this.drawTarget(5 - t);
        if (t >= 5) this.begin();
      } else if (s.phase === 'run') {
        const dt = Math.min(0.05, (now - s.last) / 1000); s.last = now;
        const t = (now - s.t0) / 1000;
        this.update(dt, t);
        this.draw(t);
        const clk = $('#rclock'); if (clk) { clk.textContent = mmss(s.dur - t); clk.classList.toggle('low', s.dur - t < 15); }
        if (t >= s.dur) { this.endSeries(); return; }
      }
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  },
  update(dt, t) {
    const s = this.s, st = s.series[s.si].st, P = st.pos, kb = this.in.kb;
    const ax = v => Math.abs(v) < 0.08 ? 0 : Math.sign(v) * Math.abs(v) ** 1.4;
    const lx = ax(this.in.lx) + ((kb.d ? 1 : 0) - (kb.q || kb.a ? 1 : 0)), ly = ax(this.in.ly) + ((kb.z || kb.w ? 1 : 0) - (kb.s ? 1 : 0));
    const rx = ax(this.in.rx) + ((kb.arrowright ? 1 : 0) - (kb.arrowleft ? 1 : 0)), ry = ax(this.in.ry) + ((kb.arrowup ? 1 : 0) - (kb.arrowdown ? 1 : 0));
    const RATE = 1.25, inv = s.inv ? -1 : 1;
    P.r += clamp(lx, -1, 1) * inv * RATE * dt;
    P.g += clamp(ly, -1, 1) * RATE * dt;
    P.bx += clamp(rx, -1, 1) * RATE * dt;
    P.by += clamp(ry, -1, 1) * RATE * dt;
    if (t >= st.nextDrift) { st.nextDrift += 1; for (const k in st.drift) st.drift[k] = (Math.random() * 2 - 1) * 0.07; }
    if (t >= st.nextKick) {
      st.nextKick += 2;
      R.sample(['bx', 'by', 'g', 'r'], 2).forEach(k => {
        const mag = 0.3 + Math.random() * 0.4, sign = Math.abs(P[k]) > 0.4 ? -Math.sign(P[k]) : (Math.random() < 0.5 ? -1 : 1);
        st.kick[k] = { v: sign * mag / 0.3, left: 0.3 };
        if (st.pend[k] != null) st.rts.push(2);
        st.pend[k] = t;
      });
    }
    for (const k in P) {
      P[k] += st.drift[k] * dt;
      const kk = st.kick[k]; if (kk && kk.left > 0) { const d = Math.min(dt, kk.left); P[k] += kk.v * d; kk.left -= d; }
      P[k] = clamp(P[k], -1, 1);
      st.err[k] += Math.abs(P[k]);
      if (st.pend[k] != null && (!kk || kk.left <= 0) && Math.abs(P[k]) < 0.15) { st.rts.push(Math.min(2, t - st.pend[k])); st.pend[k] = null; }
    }
    st.frames++;
    if (Math.max(...Object.values(P).map(Math.abs)) < 0.15) st.zone++;
    /* Lampes périphériques */
    if (t >= st.nextLamp) {
      st.nextLamp = t + 1.3 + Math.random() * 1.3;
      const tg = s.series[s.si].target, r = Math.random();
      let shape = tg.shape, color = tg.color;
      if (r < 0.32) { st.trueCount++; }
      else if (r < 0.56) color = (tg.color + R.int(1, 2)) % 3;
      else if (r < 0.8) shape = (tg.shape + R.int(1, 3)) % 4;
      else { shape = (tg.shape + R.int(1, 3)) % 4; color = (tg.color + R.int(1, 2)) % 3; }
      st.lamps.push({ t, pos: R.int(0, 6), shape, color });
    }
    st.lamps = st.lamps.filter(l => t - l.t < 0.5);
    /* Sons (jour 2) */
    if (s.day === 2) {
      if (t >= st.nextTone && t < s.dur - 2) { st.nextTone = t + 2.8 + Math.random() * 2.4; const k = R.chance(0.5) ? 'g' : 'a'; st.tones.push({ t, k }); this.tone(k === 'g' ? 300 : 1300); }
      st.tones.forEach(x => { if (!x.done && t - x.t > 1.5) { x.done = true; x.miss = true; st.miss++; } });
      const di = st.digitAt.findIndex((a, i) => t >= a && t < a + 1.6);
      st.shown = di;
    }
  },
  shapePath(ctx, shape, x, y, r) {
    ctx.beginPath();
    if (shape === 0) ctx.arc(x, y, r, 0, Math.PI * 2);
    else if (shape === 1) ctx.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
    else if (shape === 2) { ctx.moveTo(x, y - r); ctx.lineTo(x + r, y + r * 0.8); ctx.lineTo(x - r, y + r * 0.8); ctx.closePath(); }
    else { ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); }
  },
  frame() {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#05080B'; ctx.fillRect(0, 0, W, H);
    return { ctx, W, H };
  },
  drawTarget(rem) {
    const { ctx, W, H } = this.frame(), tg = this.s.series[this.s.si].target;
    const r = Math.min(W, H) * 0.16;
    ctx.fillStyle = SIM_COLORS[tg.color][1]; this.shapePath(ctx, tg.shape, W / 2, H * 0.45, r); ctx.fill();
    ctx.fillStyle = '#E6EDF3'; ctx.textAlign = 'center'; ctx.font = '600 16px Barlow, sans-serif';
    ctx.fillText(`Retiens : ${SIM_SHAPES[tg.shape]} ${SIM_COLORS[tg.color][0]}`, W / 2, H * 0.45 + r + 34);
    ctx.font = '700 28px "JetBrains Mono", monospace'; ctx.fillStyle = '#F2B13B';
    ctx.fillText(Math.max(0, Math.ceil(rem)), W / 2, H * 0.12 + 14);
    const clk = $('#rclock'); if (clk) clk.textContent = mmss(this.s.dur);
  },
  draw(t) {
    const { ctx, W, H } = this.frame(), s = this.s, st = s.series[s.si].st, P = st.pos;
    const side = Math.min(W * 0.52, H * 0.56), cx = W / 2 + 14, cy = H * 0.44, half = side / 2;
    const L = cx - half, T = cy - half;
    /* Cadre cyclique */
    ctx.strokeStyle = '#2A3B4D'; ctx.lineWidth = 1.5; ctx.strokeRect(L, T, side, side);
    ctx.beginPath(); ctx.moveTo(cx, T); ctx.lineTo(cx, T + side); ctx.moveTo(L, cy); ctx.lineTo(L + side, cy); ctx.strokeStyle = '#1C2A38'; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, side * 0.075, 0, Math.PI * 2); ctx.strokeStyle = '#3A536B'; ctx.lineWidth = 2; ctx.stroke();
    const bx = cx + P.bx * half * 0.92, by = cy - P.by * half * 0.92;
    ctx.fillStyle = '#4DA8FF'; ctx.beginPath(); ctx.arc(bx, by, 11, 0, Math.PI * 2); ctx.fill();
    /* Collectif (vert, vertical) */
    const gx = L - 34;
    ctx.strokeStyle = '#2A3B4D'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gx, T); ctx.lineTo(gx, T + side); ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = '#3A536B'; ctx.beginPath(); ctx.moveTo(gx - 12, cy); ctx.lineTo(gx + 12, cy); ctx.stroke();
    ctx.fillStyle = '#3DDC84'; ctx.fillRect(gx - 14, cy - P.g * half * 0.92 - 5, 28, 10);
    /* Palonniers (rouge, horizontal) */
    const ry = T + side + 30;
    ctx.strokeStyle = '#2A3B4D'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(L, ry); ctx.lineTo(L + side, ry); ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = '#3A536B'; ctx.beginPath(); ctx.moveTo(cx, ry - 12); ctx.lineTo(cx, ry + 12); ctx.stroke();
    ctx.fillStyle = '#FF4D4D'; ctx.fillRect(cx + P.r * half * 0.92 - 5, ry - 14, 10, 28);
    /* Lampes périphériques */
    const m = 26, spots = [[m, m], [W - m, m], [m, H - m], [W - m, H - m], [m, H * 0.44], [W - m, H * 0.44], [W / 2, m]];
    st.lamps.forEach(l => { const [x, y] = spots[l.pos]; ctx.fillStyle = SIM_COLORS[l.color][1]; this.shapePath(ctx, l.shape, x, y, 13); ctx.fill(); });
    /* Nombres (jour 2) */
    if (s.day === 2 && st.shown >= 0) {
      ctx.fillStyle = '#E6EDF3'; ctx.font = '700 30px "JetBrains Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText(st.digits[st.shown], W / 2, T - 16 > 34 ? T - 16 : 40);
    }
    /* Zone */
    const inZone = Math.max(...Object.values(P).map(Math.abs)) < 0.15;
    ctx.fillStyle = inZone ? '#3DDC84' : '#33475B'; ctx.beginPath(); ctx.arc(W - 26, H * 0.44 + 32, 4, 0, Math.PI * 2); ctx.fill();
  },
  endSeries() {
    cancelAnimationFrame(this.raf); this.noiseOff();
    const s = this.s, ser = s.series[s.si], st = ser.st;
    for (const k in st.pend) if (st.pend[k] != null) st.rts.push(2);
    const meanErr = avg(Object.values(st.err).map(e => e / Math.max(1, st.frames)));
    ser.prec = Math.round(100 * clamp(1 - meanErr / 0.45, 0, 1));
    ser.rt = avg(st.rts) ?? 2;
    ser.react = Math.round(100 * clamp(1 - (ser.rt - 0.35) / 1.4, 0, 1));
    ser.track = Math.round(0.7 * ser.prec + 0.3 * ser.react);
    ser.zone = Math.round(st.zone / Math.max(1, st.frames) * 100);
    ser.trueCount = st.trueCount;
    if (s.day === 2) { const tot = st.tones.length || 1; ser.so = Math.round(100 * clamp((st.hits - 0.5 * st.wrong) / tot, 0, 1)); ser.toneStats = { hits: st.hits, wrong: st.wrong, miss: st.miss, tot: st.tones.length }; }
    s.phase = 'input';
    this.pauseScreen();
  },
  pauseScreen() {
    const s = this.s, ser = s.series[s.si], tg = ser.target, last = s.si === s.series.length - 1;
    const prevScored = s.series.slice(0, s.si).filter(x => x.scored).length;
    Runner.el.innerHTML = `<div class="rn">${Runner.header(this.title(), ser.label + ' · pause')}<div class="rn-body sim-pause">
      <div class="card"><label for="cnt">Combien de <b style="color:${SIM_COLORS[tg.color][1]}">${SIM_SHAPES[tg.shape]}s ${SIM_COLORS[tg.color][0]}s</b> as-tu vus ?</label><input id="cnt" type="number" inputmode="numeric" min="0" max="99" autocomplete="off"></div>
      ${s.day === 2 ? `<div class="card"><label>Les quatre nombres, dans l'ordre</label><div class="digits">${[0, 1, 2, 3].map(i => `<input id="dg${i}" type="number" inputmode="numeric" min="0" max="99" aria-label="Nombre ${i + 1}" autocomplete="off">`).join('')}</div></div>` : ''}
      ${ser.scored && prevScored ? `<div class="card selfq"><span>Auto-analyse : par rapport à la série précédente, tu as fait…</span><div class="seg">${[['mieux', 'Mieux'], ['pareil', 'Pareil'], ['moins', 'Moins bien']].map(([k, l]) => `<button data-ract="self${k}" aria-pressed="false">${l}</button>`).join('')}</div></div>` : ''}
      <p class="muted sm" id="pz">Pause d'une minute, comme le jour J.</p>
      <button class="btn" data-ract="simnext">${last ? 'Voir le bilan' : 'Série suivante'}</button></div></div>`;
    s.selfPick = null;
    const t0 = Date.now();
    clearInterval(this.pauseH);
    this.pauseH = setInterval(() => { const el = $('#pz'), clk = $('#rclock'), rem = 60 - (Date.now() - t0) / 1000; if (clk) clk.textContent = mmss(rem); if (el && rem <= 0) { el.textContent = 'Pause terminée : valide quand tu es prêt.'; clearInterval(this.pauseH); } }, 500);
    setTimeout(() => $('#cnt') && $('#cnt').focus(), 50);
  },
  collect() {
    clearInterval(this.pauseH);
    const s = this.s, ser = s.series[s.si];
    const v = $('#cnt') ? $('#cnt').value : '';
    ser.counted = v === '' ? null : Number(v);
    const diff = ser.counted == null ? 9 : Math.abs(ser.counted - ser.trueCount);
    ser.ct = diff === 0 ? 100 : diff === 1 ? 70 : diff === 2 ? 40 : 0;
    if (s.day === 2) {
      const got = [0, 1, 2, 3].map(i => $('#dg' + i) ? $('#dg' + i).value : '');
      ser.dgOk = got.filter((g, i) => g !== '' && Number(g) === ser.st.digits[i]).length;
      ser.dg = ser.dgOk * 25; ser.digits = ser.st.digits;
      ser.score = Math.round(0.55 * ser.track + 0.15 * ser.ct + 0.15 * ser.so + 0.15 * ser.dg);
    } else ser.score = Math.round(0.75 * ser.track + 0.25 * ser.ct);
    const prev = s.series.slice(0, s.si).filter(x => x.scored).pop();
    if (ser.scored && prev && s.selfPick) {
      const d = ser.score - prev.score, real = d > 3 ? 'mieux' : d < -3 ? 'moins' : 'pareil';
      s.self.push(real === s.selfPick);
    }
    delete ser.st;
  },
  finish() {
    this.stop();
    const s = this.s, sc = s.series.filter(x => x.scored);
    const score = Math.round(avg(sc.map(x => x.score)));
    const trend = sc.length > 1 ? (sc[sc.length - 1].track - sc[0].track > 3 ? 'Progression' : sc[sc.length - 1].track - sc[0].track < -3 ? 'Régression' : 'Stagnation') : null;
    const res = {
      id: newId(), t: s.day === 1 ? 'scm1' : 'scm2', ts: Date.now(), m: s.mode, c: score, n: 100, a: sc.length, d: s.dur * s.series.length, s: score,
      x: { ser: s.series.map(x => ({ l: x.label, sc: x.scored, s: x.score, tr: x.track, p: x.prec, rt: Math.round(x.rt * 100) / 100, ct: x.ct, n: x.trueCount, k: x.counted, so: x.so, dg: x.dg })), trend, self: s.self.length ? `${s.self.filter(Boolean).length}/${s.self.length}` : null }
    };
    Store.add(res);
    const next = Runner.queue.length;
    Runner.el.innerHTML = `<div class="rn">${Runner.header(this.title(), 'Bilan')}<div class="rn-body res">${ring(score)}<h2>${verdict(score)}</h2>
      ${this.summaryHTML(res)}
      <ul class="tips">${this.advice(res).map(a => `<li>${a}</li>`).join('')}</ul>
      <div class="row2">${next ? `<button class="btn" data-ract="nextq">Épreuve suivante : ${esc(TESTS[Runner.queue[0].id].name)}</button>` : '<button class="btn" data-ract="again">Recommencer</button>'}<button class="btn ghost" data-ract="close">Fermer</button></div></div></div>`;
  },
  summaryHTML(r) {
    const x = r.x || {}, ser = x.ser || [];
    return `<div class="simsum">
      <div class="ss-bars">${ser.map(z => `<div class="ss-b ${z.sc ? '' : 'trial'}"><i style="height:${clamp(z.s || 0, 2, 100)}%" class="${Stats.band(z.s)}"></i><b class="mono">${z.s ?? '–'}</b><span>${esc((z.l || '').replace('Série ', 'S').replace('Essai non noté', 'Essai').replace('/3', ''))}</span></div>`).join('')}</div>
      <div class="ss-k">
        ${x.trend ? `<span class="chip ${x.trend === 'Progression' ? 'ok' : x.trend === 'Régression' ? 'ko' : 'mid'}">${x.trend}</span>` : ''}
        ${x.self ? `<span class="chip none">Auto-analyse juste ${x.self}</span>` : ''}
        <span class="muted sm">${new Date(r.ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} · ${r.t === 'scm1' ? 'jour 1' : 'jour 2'}</span>
      </div>
      <div class="ss-t">${ser.filter(z => z.sc).map(z => `<div><span>${esc(z.l)}</span><span class="mono">pilotage ${z.tr} · précision ${z.p} · réaction ${fr(z.rt, 2)} s · comptage ${z.k ?? '–'}/${z.n}${z.so != null ? ` · sons ${z.so}` : ''}${z.dg != null ? ` · nombres ${z.dg / 25}/4` : ''}</span></div>`).join('')}</div></div>`;
  },
  advice(r) {
    const ser = (r.x.ser || []).filter(z => z.sc), a = [];
    if (!ser.length) return a;
    const m = k => avg(ser.map(z => z[k]).filter(v => v != null));
    if (m('p') < 60) a.push('Précision faible : fais de petites corrections fréquentes plutôt que de grands mouvements.');
    if (m('rt') > 1.1) a.push('Réaction lente après chaque déplacement : balaie les trois indicateurs en permanence, sans fixer le bleu.');
    if (m('ct') < 70) a.push('Comptage imprécis : compte à voix basse, ou mémorise un repère par forme vue (A, B, C…).');
    if (r.t === 'scm2' && m('so') < 70) a.push('Sons : garde les pouces près des boutons et réagis vite, même au détriment du pilotage pendant une demi-seconde.');
    if (r.t === 'scm2' && m('dg') < 75) a.push('Nombres : répète la suite dans ta tête à chaque nouveau nombre (« 4, 1… 4, 1, 9… »).');
    if (r.x.trend === 'Régression' || r.x.trend === 'Stagnation') a.push('Le jury regarde la progression entre les séries : analyse ce qui a coincé et change une seule chose à la série suivante.');
    if (!a.length) a.push('Très bonne session. Garde ce rythme sans sur-entraîner : deux à trois sessions par semaine suffisent.');
    return a;
  }
};
