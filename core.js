'use strict';
/* Utilitaires, stockage, navigation et moteurs d'épreuves */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const R = {
  int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  pick: a => a[Math.floor(Math.random() * a.length)],
  shuffle: a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  sample: (a, n) => R.shuffle(a).slice(0, n),
  chance: p => Math.random() < p
};
const fr = (v, d = 2) => Number(v).toLocaleString('fr-FR', { maximumFractionDigits: d });
const mmss = s => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const pad2 = n => String(n).padStart(2, '0');
const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const monthOf = t => dayKey(t).slice(0, 7);
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
const lsGet = k => { try { return localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch { /* stockage indisponible */ } };

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2200);
}

const Wake = {
  lock: null,
  async on() { try { this.lock = await navigator.wakeLock?.request('screen'); } catch { this.lock = null; } },
  off() { try { this.lock?.release(); } catch { /* déjà libéré */ } this.lock = null; }
};

/* ---------------- Stockage : navigateur + base de l'artefact ---------------- */
const defaultProfile = () => ({ sport: [], lettre: '', itw: {}, dates: {}, settings: {}, u: 0 });
const Store = {
  KEY: 'oscp-alat-v1',
  data: { results: [], profile: defaultProfile() },
  db: null, uid: null, online: false, veille: null, veilleState: '',
  subs: new Set(), timers: {}, chains: {},
  init() {
    const raw = lsGet(this.KEY);
    if (raw) try { const d = JSON.parse(raw); this.data.results = d.results || []; this.data.profile = Object.assign(defaultProfile(), d.profile || {}); } catch { /* données locales illisibles */ }
  },
  saveLocal() { lsSet(this.KEY, JSON.stringify(this.data)); },
  on(f) { this.subs.add(f); },
  emit() { this.subs.forEach(f => { try { f(); } catch (e) { console.warn(e); } }); },
  add(r) {
    this.data.results.push(r);
    this.saveLocal();
    this.queue('r-' + monthOf(r.ts));
    this.emit();
  },
  touchProfile() {
    this.data.profile.u = Date.now();
    this.saveLocal();
    this.queue('profile');
  },
  queue(docId) {
    if (!this.db || !this.uid) return;
    clearTimeout(this.timers[docId]);
    this.timers[docId] = setTimeout(() => this.flush(docId), 800);
  },
  flush(docId) {
    const path = `data/users/${this.uid}/${docId}`;
    const body = docId === 'profile' ? this.data.profile : { items: this.data.results.filter(r => 'r-' + monthOf(r.ts) === docId) };
    const run = () => this.db.doc(path).set(JSON.parse(JSON.stringify(body))).catch(e => { console.warn('sync', e); if (e && e.code === 'unavailable') setTimeout(() => this.queue(docId), 4000 + Math.random() * 3000); });
    this.chains[docId] = (this.chains[docId] || Promise.resolve()).then(run);
  },
  async loadVeilleFile() {
    try {
      const r = await fetch('veille.json', { cache: 'no-cache' });
      if (!r.ok) throw new Error(String(r.status));
      this.veille = await r.json(); this.veilleState = 'ok';
    } catch { if (!this.veille) this.veilleState = 'nofile'; }
    this.emit();
  },
  importData(d) {
    if (!d || !Array.isArray(d.results)) throw new Error('format');
    const seen = new Set(this.data.results.map(r => r.id));
    const add = d.results.filter(r => r && r.id && typeof r.s === 'number' && !seen.has(r.id));
    this.data.results = [...this.data.results, ...add].sort((a, b) => a.ts - b.ts);
    if (d.profile && (d.profile.u || 0) > (this.data.profile.u || 0)) this.data.profile = Object.assign(defaultProfile(), d.profile);
    this.saveLocal();
    new Set(add.map(r => 'r-' + monthOf(r.ts))).forEach(m => this.queue(m));
    this.queue('profile');
    this.emit();
    return add.length;
  },
  async connect() {
    if (!window.claude || typeof claude.use !== 'function') return this.loadVeilleFile();
    let db = null, user = null;
    try { [db, user] = await Promise.all([claude.use('db'), claude.use('user')]); } catch { db = null; }
    if (!db) return this.loadVeilleFile();
    this.db = db;
    const slow = setTimeout(() => { if (!this.veilleState) { this.veilleState = 'slow'; this.emit(); } }, 10000);
    try {
      db.doc('veille/current').onSnapshot(s => {
        this.veille = s.exists ? s.data() : null;
        if (!s.metadata.fromCache) { clearTimeout(slow); this.veilleState = 'ok'; }
        this.emit();
      }, () => { clearTimeout(slow); this.veilleState = 'err'; this.emit(); });
    } catch { this.veilleState = 'err'; }
    if (!user) return;
    let id = null;
    try { id = await user.id(); } catch { id = null; }
    if (!id) return;
    this.uid = id;
    try {
      const snap = await db.collection('data/users/' + id).get();
      const remote = []; let prof = null;
      snap.docs.forEach(d => { const v = d.data() || {}; if (d.id === 'profile') prof = v; else if (d.id.startsWith('r-') && Array.isArray(v.items)) remote.push(...v.items); });
      const remoteIds = new Set(remote.map(r => r.id));
      const localOnly = this.data.results.filter(r => !remoteIds.has(r.id));
      const seen = new Set();
      this.data.results = [...remote, ...this.data.results].filter(r => r && r.id && !seen.has(r.id) && seen.add(r.id)).sort((a, b) => a.ts - b.ts);
      if (prof && (prof.u || 0) >= (this.data.profile.u || 0)) this.data.profile = Object.assign(defaultProfile(), prof);
      else if (this.data.profile.u) this.queue('profile');
      new Set(localOnly.map(r => 'r-' + monthOf(r.ts))).forEach(m => this.queue(m));
      this.online = true;
      this.saveLocal();
      this.emit();
    } catch (e) { console.warn('db', e); }
  },
  reset() {
    const months = new Set(this.data.results.map(r => 'r-' + monthOf(r.ts)));
    this.data = { results: [], profile: defaultProfile() };
    this.saveLocal();
    if (this.db && this.uid) months.forEach(m => this.db.doc(`data/users/${this.uid}/${m}`).delete().catch(() => {}));
    this.touchProfile();
    this.emit();
  }
};

/* ---------------- Questions déjà posées : on ne les repose pas ---------------- */
const Fresh = {
  KEY: 'oscp-seen-v1', mem: null, h: 0,
  load() { if (!this.mem) { try { this.mem = JSON.parse(lsGet(this.KEY) || '{}') || {}; } catch { this.mem = {}; } } return this.mem; },
  sig(q) {
    const s = (q.p + '|' + (q.ch[q.a] || '')).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');
    let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  },
  gen(id, fn) {
    const m = this.load(), list = m[id] || (m[id] = []), seen = new Set(list);
    let q = fn(), k = this.sig(q);
    for (let i = 0; i < 30 && seen.has(k); i++) { q = fn(); k = this.sig(q); }
    list.push(k); if (list.length > 2000) list.splice(0, list.length - 2000);
    clearTimeout(this.h); this.h = setTimeout(() => lsSet(this.KEY, JSON.stringify(this.mem)), 400);
    return q;
  }
};

/* ---------------- Statistiques ---------------- */
const Stats = {
  of(id) {
    const rs = Store.data.results.filter(r => r.t === id);
    const sc = rs.map(r => r.s);
    return { n: rs.length, last: rs[rs.length - 1] || null, avg: avg(sc.slice(-5)), best: sc.length ? Math.max(...sc) : null, series: sc.slice(-12), all: rs };
  },
  band(s) { return s == null ? 'none' : s >= 75 ? 'ok' : s >= 50 ? 'mid' : 'ko'; }
};
const chip = (s, label) => `<span class="chip ${Stats.band(s)}">${s == null ? (label || 'Nouveau') : Math.round(s) + ' %'}</span>`;
function spark(vals, w = 88, h = 26) {
  if (!vals || vals.length < 2) return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"></svg>`;
  const step = (w - 4) / (vals.length - 1), y = v => h - 3 - (v / 100) * (h - 6);
  const pts = vals.map((v, i) => [2 + i * step, y(v)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${d} L${last[0].toFixed(1)} ${h} L2 ${h} Z" class="sp-a"/><path d="${d}" class="sp-l"/><circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.6" class="sp-d"/></svg>`;
}
function ring(s, size = 132) {
  const r = 52, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(100, s)) / 100);
  return `<svg class="ring ${Stats.band(s)}" viewBox="0 0 120 120" width="${size}" height="${size}" aria-hidden="true"><circle cx="60" cy="60" r="${r}" class="rg-b"/><circle cx="60" cy="60" r="${r}" class="rg-f" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 60 60)"/><text x="60" y="58" class="rg-t">${Math.round(s)}</text><text x="60" y="80" class="rg-u">sur 100</text></svg>`;
}
const verdict = s => s >= 85 ? 'Excellent' : s >= 70 ? 'Solide' : s >= 50 ? 'À consolider' : 'À retravailler';

/* ---------------- Navigation ---------------- */
const App = {
  tab: 'cso', stacks: { cso: [], tours: [], simu: [], bilan: [] }, V: {}, scroll: {},
  cur() { const st = this.stacks[this.tab]; return st.length ? st[st.length - 1] : { v: this.tab + '-home', p: {} }; },
  keyOf(e) { return this.tab + ':' + this.stacks[this.tab].length; },
  go(v, p = {}) { this.scroll[this.keyOf()] = $('#view').scrollTop; this.stacks[this.tab].push({ v, p }); this.render(0); },
  back() { if (!this.stacks[this.tab].length) return; this.stacks[this.tab].pop(); this.render(this.scroll[this.keyOf()] || 0); },
  setTab(t) {
    if (t === this.tab) { if (this.stacks[t].length) { this.stacks[t] = []; this.render(0); } return; }
    this.scroll[this.keyOf()] = $('#view').scrollTop;
    this.tab = t; lsSet('oscp-tab', t); this.render(this.scroll[this.keyOf()] || 0);
  },
  render(scrollTo) {
    const { v, p } = this.cur();
    const view = this.V[v];
    if (!view) { this.stacks[this.tab] = []; return this.render(0); }
    $('#title').textContent = typeof view.title === 'function' ? view.title(p) : view.title;
    $('#eyebrow').textContent = view.eyebrow ? (typeof view.eyebrow === 'function' ? view.eyebrow(p) : view.eyebrow) : 'OSC/P · ALAT';
    $('#back').hidden = !this.stacks[this.tab].length;
    const el = $('#view');
    el.innerHTML = `<div class="vin">${view.render(p)}</div>`;
    view.mount && view.mount(el, p);
    if (scrollTo != null) el.scrollTop = scrollTo;
    $$('.dock button').forEach(b => b.setAttribute('aria-current', b.dataset.tab === this.tab ? 'page' : 'false'));
  },
  refresh() { if ($('#runner').hidden) { const el = $('#view'); const y = el.scrollTop; this.render(); el.scrollTop = y; } },
  softRefresh() {
    const a = document.activeElement;
    if (a && $('#view').contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    this.refresh();
  }
};
const Act = {};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-tab],[data-go],[data-act],[data-ract],[data-ch],#back');
  if (!t) return;
  if (t.id === 'back') return App.back();
  if (t.dataset.tab) return App.setTab(t.dataset.tab);
  if (t.dataset.go) return App.go(t.dataset.go, t.dataset.p ? JSON.parse(t.dataset.p) : {});
  if (t.dataset.act && Act[t.dataset.act]) return Act[t.dataset.act](t, e);
  if (t.dataset.ract) return Runner.act(t.dataset.ract, t);
  if (t.dataset.ch != null) return Runner.choose(Number(t.dataset.ch), t);
});
const gp = p => esc(JSON.stringify(p));

/* ---------------- Moteur de QCM chronométrés ---------------- */
const MODE_LABEL = { exam: 'Conditions réelles', express: 'Express', train: 'Entraînement corrigé' };
const Runner = {
  s: null, timer: null, queue: [], handler: null,
  get el() { return $('#runner'); },
  open() { this.el.hidden = false; document.body.classList.add('running'); Wake.on(); },
  close() {
    clearInterval(this.timer); this.timer = null;
    if (this.handler) { this.handler.stop && this.handler.stop(); this.handler = null; }
    this.el.hidden = true; this.el.innerHTML = ''; this.s = null; this.queue = [];
    document.body.classList.remove('running'); Wake.off(); App.refresh();
  },
  start(id, mode = 'exam', queue, nOver) {
    if (queue) this.queue = queue;
    const T = TESTS[id];
    if (this.handler && this.handler.stop) this.handler.stop();
    if (T.kind === 'sprint') { this.handler = Sprint; return Sprint.start(id); }
    if (T.kind === 'memo') { this.handler = Memo; return Memo.start(id, mode); }
    if (T.kind === 'sim') { this.handler = Sim; return Sim.start(T.day, mode); }
    this.handler = null;
    const n = nOver || (mode === 'exam' ? T.n : mode === 'express' ? Math.min(T.express || 10, T.n) : Math.min(T.n, T.trainN || 15));
    const limit = mode === 'exam' ? T.time : mode === 'express' ? Math.max(40, Math.round(T.time * n / T.n)) : 0;
    this.s = { id, T, mode, n, limit, ctx: T.setup ? T.setup() : {}, qs: [], ans: [], i: 0, t0: Date.now(), qt: Date.now(), lock: false };
    this.open(); this.renderQ();
    clearInterval(this.timer); this.timer = setInterval(() => this.tick(), 250); this.tick();
  },
  header(title, sub) {
    return `<header class="rn-top"><button class="icon-btn" data-ract="quit" aria-label="Quitter l'épreuve">${ICON.close}</button><div class="rn-t"><span class="eyebrow">${esc(sub)}</span><b>${esc(title)}</b></div><div class="rn-clock mono" id="rclock">--:--</div></header>`;
  },
  renderQ() {
    const s = this.s;
    if (s.i >= s.n) return this.finish(false);
    if (!s.qs[s.i]) s.qs[s.i] = s.T.fresh ? Fresh.gen(s.id, () => s.T.gen(s.ctx, s.i, s.n)) : s.T.gen(s.ctx, s.i, s.n);
    const q = s.qs[s.i], keys = !s.T.noKeys;
    this.el.innerHTML = `<div class="rn">${this.header(s.T.name, MODE_LABEL[s.mode])}
      <div class="rn-prog"><i style="width:${(s.i / s.n * 100).toFixed(1)}%"></i></div>
      <div class="rn-body">
        ${s.T.context ? `<div class="rn-ctx">${s.T.context(s.ctx)}</div>` : ''}
        <div class="rn-count mono">${s.i + 1}<span>/${s.n}</span></div>
        <div class="rn-q">${q.p}</div>
        ${q.v ? `<div class="rn-v">${q.v}</div>` : ''}
        <div class="choices ${q.lay || 'list'}">${q.ch.map((c, k) => `<button class="ch" data-ch="${k}">${keys ? `<span class="k mono">${'ABCDEF'[k]}</span>` : ''}<span class="c">${c}</span></button>`).join('')}</div>
        <div class="rn-fb" id="rfb"></div>
      </div>
      <footer class="rn-foot">${s.mode === 'train' ? '<button class="btn ghost sm" data-ract="end">Terminer et voir le bilan</button>' : '<button class="btn ghost sm" data-ract="skip">Passer cette question</button>'}</footer></div>`;
    this.tick();
  },
  choose(k, btn) {
    const s = this.s; if (!s || s.lock || !s.qs[s.i]) return;
    const q = s.qs[s.i], ok = k === q.a;
    s.ans[s.i] = { k, ok, dt: (Date.now() - s.qt) / 1000 };
    s.lock = true;
    if (s.mode === 'train') {
      $$('.ch', this.el).forEach((b, j) => { b.disabled = true; if (j === q.a) b.classList.add('ok'); else if (j === k) b.classList.add('ko'); });
      $('#rfb').innerHTML = `<div class="fb ${ok ? 'ok' : 'ko'}"><b>${ok ? 'Bonne réponse' : 'Mauvaise réponse'}</b>${q.ex ? `<p>${q.ex}</p>` : ''}</div><button class="btn" data-ract="next">Question suivante</button>`;
      $('#rfb').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      btn && btn.classList.add('picked');
      setTimeout(() => { if (this.s === s) this.next(); }, 110);
    }
  },
  next() { const s = this.s; s.i++; s.qt = Date.now(); s.lock = false; this.renderQ(); $('.rn-body', this.el) && ($('.rn-body', this.el).scrollTop = 0); },
  tick() {
    const s = this.s; if (!s || s.done) return;
    const el = $('#rclock'); if (!el) return;
    const t = (Date.now() - s.t0) / 1000;
    if (s.limit) {
      const rem = s.limit - t;
      el.textContent = mmss(rem); el.classList.toggle('low', rem < 30);
      if (rem <= 0) this.finish(true);
    } else el.textContent = mmss(t);
  },
  act(a) {
    if (a === 'quit') return this.confirmQuit();
    if (this.handler && this.handler.act && this.handler.act(a) !== false) return;
    if (a === 'next') return this.next();
    if (a === 'skip') { const s = this.s; if (!s.lock) { s.ans[s.i] = { k: -1, ok: false, dt: (Date.now() - s.qt) / 1000 }; this.next(); } return; }
    if (a === 'end') return this.finish(false);
    if (a === 'close') return this.close();
    if (a === 'again') { const { id, mode } = this.last; return this.start(id, mode); }
    if (a === 'nextq') { const n = this.queue.shift(); return this.start(n.id, n.mode, null, n.n); }
    if (a === 'review') { const r = $('#review'); r.hidden = !r.hidden; return; }
    if (a === 'stay') return $('#confirm')?.remove();
    if (a === 'leave') return this.close();
  },
  confirmQuit() {
    if ($('#confirm')) return;
    const d = document.createElement('div');
    d.id = 'confirm'; d.className = 'confirm';
    d.innerHTML = `<div class="cf-box" role="dialog" aria-modal="true"><b>Abandonner l'épreuve ?</b><p>La série en cours ne sera pas enregistrée.</p><div class="row2"><button class="btn ghost" data-ract="stay">Continuer</button><button class="btn danger" data-ract="leave">Abandonner</button></div></div>`;
    this.el.appendChild(d);
  },
  finish(timeout) {
    const s = this.s; if (!s || s.done) return;
    s.done = true; clearInterval(this.timer);
    const answered = s.ans.filter(Boolean).filter(a => a.k >= 0).length;
    const c = s.ans.filter(a => a && a.ok).length;
    const d = Math.round((Date.now() - s.t0) / 1000);
    const base = s.mode === 'train' ? Math.max(1, answered) : s.n;
    const score = Math.round(c / base * 100);
    const prev = Stats.of(s.id);
    const res = { id: newId(), t: s.id, ts: Date.now(), m: s.mode, c, n: s.n, a: answered, d, s: score };
    if (answered > 0) Store.add(res);
    this.last = { id: s.id, mode: s.mode };
    const errs = s.qs.map((q, i) => ({ q, a: s.ans[i], i })).filter(x => x.q && (!x.a || !x.a.ok));
    const delta = prev.avg != null ? score - prev.avg : null;
    this.el.innerHTML = `<div class="rn">${this.header(s.T.name, 'Résultat')}
      <div class="rn-body res">
        ${ring(score)}
        <h2>${verdict(score)}</h2>
        ${timeout ? '<p class="muted">Temps écoulé : les questions non traitées comptent comme fausses, comme le jour J.</p>' : ''}
        <div class="kpis"><div><b class="mono">${c}/${base}</b><span>bonnes réponses</span></div><div><b class="mono">${mmss(d)}</b><span>durée</span></div><div><b class="mono">${answered ? fr(d / answered, 1) : '–'} s</b><span>par question</span></div></div>
        ${delta != null ? `<p class="cmp">${delta >= 0 ? '▲' : '▼'} ${Math.abs(Math.round(delta))} pts par rapport à ta moyenne récente (${Math.round(prev.avg)} %)</p>` : '<p class="cmp">Première série enregistrée sur cette épreuve.</p>'}
        ${s.T.after ? `<p class="tip">${s.T.after}</p>` : ''}
        <div class="row2">${this.queue.length ? `<button class="btn" data-ract="nextq">Épreuve suivante : ${esc(TESTS[this.queue[0].id].name)}</button>` : `<button class="btn" data-ract="again">Recommencer</button>`}<button class="btn ghost" data-ract="close">Fermer</button></div>
        ${errs.length ? `<button class="linkbtn" data-ract="review">Revoir mes ${errs.length} erreur${errs.length > 1 ? 's' : ''}</button><div id="review" class="review" hidden>${errs.slice(0, 40).map(({ q, a, i }) => `<div class="rv"><span class="eyebrow">Question ${i + 1}</span><div class="rv-q">${q.p}</div>${q.v ? `<div class="rv-v">${q.v}</div>` : ''}<div class="rv-a"><div><span>Ta réponse</span><div class="rv-c ko">${a && a.k >= 0 ? q.ch[a.k] : 'Sans réponse'}</div></div><div><span>Bonne réponse</span><div class="rv-c ok">${q.ch[q.a]}</div></div></div>${q.ex ? `<p class="rv-x">${q.ex}</p>` : ''}</div>`).join('')}</div>` : ''}
      </div></div>`;
    $('#rclock').textContent = '';
  }
};
document.addEventListener('keydown', e => {
  if ($('#runner').hidden || !Runner.s || Runner.handler) return;
  const k = 'abcdef'.indexOf(e.key.toLowerCase());
  const n = '123456'.indexOf(e.key);
  const idx = k >= 0 ? k : n;
  if (idx >= 0) { const b = $$('.ch', Runner.el)[idx]; if (b && !b.disabled) Runner.choose(idx, b); }
  else if (e.key === 'Enter' && $('[data-ract="next"]')) Runner.next();
});

/* ---------------- Calcul mental (sprint de 2 minutes) ---------------- */
const Sprint = {
  s: null, timer: null,
  start(id) {
    this.s = { id, t0: Date.now(), dur: 120, c: 0, w: 0, q: Gen.mental(), inp: '', log: [] };
    Runner.open();
    Runner.el.innerHTML = `<div class="rn">${Runner.header(TESTS[id].name, 'Sprint 2 minutes')}
      <div class="rn-body sprint"><div class="sp-score mono"><span class="ok" id="sp-c">0</span> · <span class="ko" id="sp-w">0</span></div>
      <div class="sp-q mono" id="sp-q"></div><div class="sp-in mono" id="sp-in">&nbsp;</div>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'del', 0, 'skip'].map(k => `<button data-ract="k${k}" class="mono">${k === 'del' ? '⌫' : k === 'skip' ? 'Passer' : k}</button>`).join('')}</div></div></div>`;
    this.draw();
    clearInterval(this.timer); this.timer = setInterval(() => this.tick(), 200);
    this.kb = e => { if (/^[0-9]$/.test(e.key)) this.key(e.key); else if (e.key === 'Backspace') this.key('del'); };
    document.addEventListener('keydown', this.kb);
  },
  stop() { clearInterval(this.timer); document.removeEventListener('keydown', this.kb); },
  draw() { $('#sp-q').textContent = this.s.q.p + ' ='; $('#sp-in').innerHTML = this.s.inp || '&nbsp;'; $('#sp-c').textContent = this.s.c; $('#sp-w').textContent = this.s.w; },
  act(a) { if (a.startsWith('k')) { this.key(a.slice(1)); return true; } return false; },
  key(k) {
    const s = this.s; if (!s || s.done) return;
    if (k === 'del') { s.inp = s.inp.slice(0, -1); return this.draw(); }
    if (k === 'skip') { s.w++; s.log.push({ q: s.q.p, a: s.q.a, r: '' }); s.q = Gen.mental(); s.inp = ''; return this.draw(); }
    s.inp += k;
    const ans = String(s.q.a);
    if (s.inp === ans) { s.c++; this.flash('ok'); s.q = Gen.mental(); s.inp = ''; }
    else if (s.inp.length >= ans.length) { s.w++; s.log.push({ q: s.q.p, a: s.q.a, r: s.inp }); this.flash('ko'); s.q = Gen.mental(); s.inp = ''; }
    this.draw();
  },
  flash(c) { const el = $('#sp-in'); el.classList.remove('ok', 'ko'); void el.offsetWidth; el.classList.add(c); },
  tick() {
    const s = this.s, rem = s.dur - (Date.now() - s.t0) / 1000, el = $('#rclock');
    if (el) { el.textContent = mmss(rem); el.classList.toggle('low', rem < 15); }
    if (rem <= 0) this.finish();
  },
  finish() {
    const s = this.s; s.done = true; this.stop();
    const score = Math.min(100, Math.round(s.c * 100 / 35));
    const prev = Stats.of(s.id);
    if (s.c + s.w > 0) Store.add({ id: newId(), t: s.id, ts: Date.now(), m: 'sprint', c: s.c, n: s.c + s.w, a: s.c + s.w, d: s.dur, s: score });
    Runner.last = { id: s.id, mode: 'sprint' };
    Runner.el.innerHTML = `<div class="rn">${Runner.header(TESTS[s.id].name, 'Résultat')}<div class="rn-body res">${ring(score)}<h2>${s.c} calcul${s.c > 1 ? 's' : ''} juste${s.c > 1 ? 's' : ''} en 2 min</h2>
      <p class="muted">100 points = 35 calculs justes. ${s.w} erreur${s.w > 1 ? 's' : ''} ou passage${s.w > 1 ? 's' : ''}.</p>
      ${prev.best != null ? `<p class="cmp">Meilleur score précédent : ${prev.best} %</p>` : ''}
      <div class="row2"><button class="btn" data-ract="again">Recommencer</button><button class="btn ghost" data-ract="close">Fermer</button></div>
      ${s.log.length ? `<div class="review">${s.log.slice(-12).map(l => `<div class="rv sm"><span class="mono">${esc(l.q)} = <b class="ok">${l.a}</b></span>${l.r ? `<span class="mono ko">ta réponse ${esc(l.r)}</span>` : '<span class="muted">passé</span>'}</div>`).join('')}</div>` : ''}
      </div></div>`;
  }
};

/* ---------------- Mémorisation (formes et noms) ---------------- */
const Memo = {
  s: null, timer: null,
  start(id, mode) {
    const exam = mode === 'exam', themes = exam ? ['Lacs', 'Rivières', 'Baies'] : [R.pick(Object.keys(DATA.MEMO))];
    const count = mode === 'express' ? 10 : 15;
    this.s = { id, mode, count, themes, pi: 0, stage: 'intro', study: mode === 'express' ? 100 : 240, recall: mode === 'express' ? 75 : 150, phases: [], t0: 0, sel: null };
    Runner.open(); this.intro();
    clearInterval(this.timer); this.timer = setInterval(() => this.tick(), 250);
  },
  stop() { clearInterval(this.timer); },
  intro() {
    const s = this.s; s.stage = 'intro';
    const th = s.themes[s.pi];
    Runner.el.innerHTML = `<div class="rn">${Runner.header(TESTS[s.id].name, `Phase ${s.pi + 1}/${s.themes.length}`)}<div class="rn-body center">
      <span class="eyebrow">Thème</span><h2 class="big">${esc(th)}</h2>
      <p class="muted">${s.count} formes à associer à leur nom. ${mmss(s.study)} pour mémoriser, puis ${mmss(s.recall)} pour retrouver les noms.</p>
      <p class="tip">Il n'y a pas de point négatif : réponds à tout. Sécurise d'abord les associations faciles, puis complète.</p>
      <button class="btn" data-ract="mstudy">Commencer la mémorisation</button></div></div>`;
  },
  study() {
    const s = this.s; s.stage = 'study'; s.t0 = Date.now();
    s.items = Gen.memoPhase(s.themes[s.pi], s.count);
    Runner.el.innerHTML = `<div class="rn">${Runner.header(s.themes[s.pi], 'Mémorise')}<div class="rn-body"><div class="memo-grid">${s.items.map(it => `<div class="mg">${it.svg}<span>${esc(it.n)}</span></div>`).join('')}</div>
      <div class="rn-foot in"><button class="btn ghost" data-ract="mrecall">J'ai mémorisé, passer à la restitution</button></div></div></div>`;
  },
  recall() {
    const s = this.s; s.stage = 'recall'; s.t0 = Date.now();
    s.order = R.shuffle(s.items.map((_, i) => i));
    s.assign = {};
    this.drawRecall();
  },
  drawRecall() {
    const s = this.s;
    const names = s.items.map(it => it.n).sort((a, b) => a.localeCompare(b, 'fr'));
    const used = new Set(Object.values(s.assign));
    Runner.el.innerHTML = `<div class="rn">${Runner.header(s.themes[s.pi], 'Retrouve les noms')}<div class="rn-body">
      <p class="muted sm">Touche une forme, puis un nom. ${Object.keys(s.assign).length}/${s.count} associées.</p>
      <div class="memo-grid recall">${s.order.map(i => `<button class="mg ${s.sel === i ? 'sel' : ''} ${s.assign[i] ? 'done' : ''}" data-ract="msel${i}">${s.items[i].svg}<span>${s.assign[i] ? esc(s.assign[i]) : '?'}</span></button>`).join('')}</div>
      <div class="names ${s.sel == null ? 'dim' : ''}">${names.map(n => `<button class="nm ${used.has(n) ? 'used' : ''}" data-ract="mname${esc(n)}">${esc(n)}</button>`).join('')}</div>
      <div class="rn-foot in"><button class="btn" data-ract="mcheck">Valider la phase</button></div></div></div>`;
    this.tick();
  },
  act(a) {
    const s = this.s;
    if (a === 'mstudy') { this.study(); return true; }
    if (a === 'mrecall') { this.recall(); return true; }
    if (a.startsWith('msel')) { const i = Number(a.slice(4)); s.sel = s.sel === i ? null : i; this.drawRecall(); return true; }
    if (a.startsWith('mname')) {
      if (s.sel == null) { toast('Touche d\'abord une forme'); return true; }
      const n = a.slice(5);
      for (const k of Object.keys(s.assign)) if (s.assign[k] === n) delete s.assign[k];
      s.assign[s.sel] = n;
      const nextFree = s.order.find(i => !s.assign[i]);
      s.sel = nextFree ?? null;
      this.drawRecall(); return true;
    }
    if (a === 'mcheck') { this.check(); return true; }
    if (a === 'mnext') { s.pi++; this.intro(); return true; }
    if (a === 'mend') { this.finish(); return true; }
    return false;
  },
  check() {
    const s = this.s; s.stage = 'check';
    const ok = s.items.map((it, i) => s.assign[i] === it.n);
    const c = ok.filter(Boolean).length;
    s.phases.push({ theme: s.themes[s.pi], c, n: s.count });
    const more = s.pi < s.themes.length - 1;
    Runner.el.innerHTML = `<div class="rn">${Runner.header(s.themes[s.pi], 'Correction')}<div class="rn-body">
      <div class="phase-sc"><b class="mono">${c}/${s.count}</b><span>associations justes</span></div>
      <div class="memo-grid">${s.items.map((it, i) => `<div class="mg ${ok[i] ? 'good' : 'bad'}">${it.svg}<span>${esc(it.n)}</span>${!ok[i] ? `<em>${s.assign[i] ? esc(s.assign[i]) : 'vide'}</em>` : ''}</div>`).join('')}</div>
      <div class="rn-foot in"><button class="btn" data-ract="${more ? 'mnext' : 'mend'}">${more ? 'Phase suivante' : 'Voir le bilan'}</button></div></div></div>`;
  },
  tick() {
    const s = this.s; if (!s || (s.stage !== 'study' && s.stage !== 'recall')) { const el = $('#rclock'); if (el) el.textContent = ''; return; }
    const lim = s.stage === 'study' ? s.study : s.recall, rem = lim - (Date.now() - s.t0) / 1000, el = $('#rclock');
    if (el) { el.textContent = mmss(rem); el.classList.toggle('low', rem < 20); }
    if (rem <= 0) { if (s.stage === 'study') this.recall(); else this.check(); }
  },
  finish() {
    const s = this.s; this.stop();
    const c = s.phases.reduce((a, p) => a + p.c, 0), n = s.phases.reduce((a, p) => a + p.n, 0), score = Math.round(c / n * 100);
    Store.add({ id: newId(), t: s.id, ts: Date.now(), m: s.mode, c, n, a: n, d: 0, s: score });
    Runner.last = { id: s.id, mode: s.mode };
    Runner.el.innerHTML = `<div class="rn">${Runner.header(TESTS[s.id].name, 'Résultat')}<div class="rn-body res">${ring(score)}<h2>${c}/${n} associations</h2>
      <div class="kpis">${s.phases.map(p => `<div><b class="mono">${p.c}/${p.n}</b><span>${esc(p.theme)}</span></div>`).join('')}</div>
      <p class="tip">Méthode conseillée : relie chaque forme à une image mentale liée au nom (« ce lac a la forme d'une botte, comme l'Italie… »). Dix associations sûres valent mieux que quinze approximatives.</p>
      <div class="row2"><button class="btn" data-ract="again">Recommencer</button><button class="btn ghost" data-ract="close">Fermer</button></div></div></div>`;
  }
};
