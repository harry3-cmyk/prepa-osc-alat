'use strict';
/* Générateurs d'épreuves. Chaque générateur renvoie une question :
   { p: énoncé HTML, v: visuel HTML facultatif, ch: [choix HTML], a: index de la bonne réponse,
     ex: explication, lay: 'list' | 'g2' | 'g3' | 'img' } */

const Gen = {};

function mkQ(p, good, bad, o = {}) {
  const uniq = [];
  for (const b of bad) if (b !== good && !uniq.includes(b)) uniq.push(b);
  const ch = R.shuffle([good, ...uniq]);
  return { p, ch, a: ch.indexOf(good), ex: o.ex || '', v: o.v || '', lay: o.lay || 'list' };
}
const decOf = v => { const s = String(Math.round(v * 1000) / 1000); const i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; };
const rnd = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
function stepOf(a) { const m = Math.abs(a); if (m < 10) return 1; return Math.max(1, 10 ** (Math.floor(Math.log10(m)) - 1)); }

/* Leurres numériques plausibles autour de la bonne réponse */
function numBad(ans, extra = [], o = {}) {
  const n = o.n || 4, dec = o.dec ?? decOf(ans);
  const out = [];
  const add = v => { v = rnd(v, dec); if (Number.isFinite(v) && v !== rnd(ans, dec) && (o.neg || v > 0) && !out.includes(v)) out.push(v); };
  extra.forEach(add);
  const st = o.step || stepOf(ans);
  let g = 0;
  while (out.length < n && g++ < 80) {
    if (R.chance(0.5)) add(ans + R.pick([-3, -2, -1, 1, 2, 3]) * st);
    else add(dec === 0 ? Math.round(ans * (1 + R.pick([-0.25, -0.2, -0.1, 0.1, 0.2, 0.25, 0.5]))) : ans * (1 + R.pick([-0.2, -0.1, 0.1, 0.2, 0.5])));
  }
  return out.slice(0, n);
}
function numQ(t, o = {}) {
  const dec = t.dec ?? decOf(t.a);
  const f = v => (t.pre || '') + fr(v, dec) + (t.u || '');
  return mkQ(t.p, f(t.a), numBad(t.a, t.bad || [], { dec, step: t.step }).map(f), { ex: t.ex, lay: o.lay || 'g2' });
}
const pickUntil = (fn, ok) => { let v; let g = 0; do { v = fn(); } while (!ok(v) && g++ < 200); return v; };

/* ---------------- TAMI-C : Mathématiques ---------------- */
const MATHS_CSO = [
  () => { const P = R.int(8, 80) * 5, r = R.pick([10, 15, 20, 25, 30, 40]), a = P * (100 - r) / 100;
    return { p: `Un équipement coûte ${P} €. Il est soldé à −${r} %. Quel est son nouveau prix ?`, a, u: ' €', bad: [P * r / 100, P - r, P * (100 + r) / 100], ex: `${P} × (1 − ${r}/100) = ${fr(a)} €` }; },
  () => { const P = R.int(4, 40) * 50, x = R.pick([10, 20, 25, 50]), y = R.pick([10, 20, 25]), a = P * (1 + x / 100) * (1 - y / 100);
    return { p: `Un prix de ${P} € augmente de ${x} %, puis baisse de ${y} %. Quel est le prix final ?`, a, u: ' €', bad: [P * (1 + (x - y) / 100), P], ex: `${P} × ${fr(1 + x / 100)} × ${fr(1 - y / 100)} = ${fr(a)} €. Les pourcentages successifs se multiplient, ils ne s'additionnent pas.` }; },
  () => { const [V, t] = pickUntil(() => [R.pick([120, 150, 180, 200, 240, 270, 300]), R.pick([10, 12, 15, 20, 24, 30, 36, 40, 45, 48, 50])], ([V, t]) => (V * t) % 60 === 0); const a = V * t / 60;
    return { p: `Un hélicoptère vole à ${V} km/h pendant ${t} minutes. Quelle distance parcourt-il ?`, a, u: ' km', bad: [V * t / 100, a * 2, a + 10], ex: `${V} × ${t}/60 = ${a} km` }; },
  () => { const [V, t] = pickUntil(() => [R.pick([120, 150, 180, 200, 240, 300]), R.pick([12, 15, 20, 24, 30, 35, 40, 45, 50, 54])], ([V, t]) => (V * t) % 60 === 0); const D = V * t / 60;
    return { p: `À ${V} km/h, combien de minutes faut-il pour parcourir ${D} km ?`, a: t, u: ' min', bad: [t + 5, t - 5, Math.round(t * 1.2), Math.round(D / V * 100)], ex: `${D} / ${V} h = ${t} min` }; },
  () => { const [v1, v2] = R.pick([[60, 40], [120, 80], [90, 60], [150, 100], [30, 20], [120, 60], [180, 90], [60, 30]]); const a = 2 * v1 * v2 / (v1 + v2);
    return { p: `Un véhicule fait l'aller à ${v1} km/h et le retour par la même route à ${v2} km/h. Quelle est sa vitesse moyenne sur l'aller-retour ?`, a, u: ' km/h', bad: [(v1 + v2) / 2, v1 - v2 / 2, a + 5], ex: `Vitesse moyenne = 2 × ${v1} × ${v2} / (${v1} + ${v2}) = ${a} km/h. Ce n'est pas la moyenne des vitesses (${(v1 + v2) / 2}).` }; },
  () => { const k = R.pick([2, 3, 4, 5, 6]), u = R.pick([1.5, 2, 2.5, 3, 4, 1.2]), c = rnd(k * u, 2), m = R.int(7, 15), a = rnd(m * u, 2);
    return { p: `${k} kg de matériel coûtent ${fr(c)} €. Combien coûtent ${m} kg ?`, a, u: ' €', bad: [rnd(c * m / (k + 1), 2), a + u, a - u], ex: `${fr(c)} / ${k} = ${fr(u)} € le kg, × ${m} = ${fr(a)} €` }; },
  () => { const [n, d, m] = pickUntil(() => [R.int(3, 8), R.pick([6, 8, 10, 12, 15, 18, 20, 24]), R.int(2, 12)], ([n, d, m]) => m !== n && (n * d) % m === 0); const a = n * d / m;
    return { p: `${n} mécaniciens révisent un hélicoptère en ${d} heures. Combien d'heures faudrait-il à ${m} mécaniciens travaillant au même rythme ?`, a, u: ' h', bad: [d * m / n, d + (n - m), Math.abs(d - (m - n)) || d + 2], ex: `Proportionnalité inverse : ${n} × ${d} = ${n * d} heures de travail, / ${m} = ${fr(a)} h` }; },
  () => { const q = R.pick([3, 4, 5, 6, 8]), p = pickUntil(() => R.int(1, q - 1), p => gcd(p, q) === 1), N = q * R.int(3, 20), V = p * N / q;
    return { p: `Les ${p}/${q} d'un nombre valent ${V}. Quel est ce nombre ?`, a: N, bad: [rnd(V * p / q, 1), V * q, V + q], ex: `${V} × ${q} / ${p} = ${N}` }; },
  () => { const notes = [R.int(7, 17), R.int(7, 17), R.int(7, 17)], m = R.int(10, 15), s = notes.reduce((a, b) => a + b, 0), x = 4 * m - s;
    if (x < 0 || x > 20) return MATHS_CSO[8]();
    return { p: `Un candidat a obtenu ${notes.join(', ')} sur 20. Quelle note doit-il avoir à la 4e épreuve (même coefficient) pour obtenir ${m} de moyenne ?`, a: x, bad: [m, x + 1, x - 1, Math.round(s / 3)], ex: `4 × ${m} − (${notes.join(' + ')}) = ${4 * m} − ${s} = ${x}` }; },
  () => { const [a, b] = R.pick([[3, 2], [4, 3], [5, 3], [4, 2], [5, 4]]); const k = pickUntil(() => R.int(4, 15), k => (k * (b - 1)) % (a - b) === 0 && k * (b - 1) / (a - b) > 2 && a * k * (b - 1) / (a - b) <= 80); const s = k * (b - 1) / (a - b);
    return { p: `Un père a ${a} fois l'âge de son fils. Dans ${k} ans, il n'aura plus que ${b} fois son âge. Quel âge a le fils aujourd'hui ?`, a: s, u: ' ans', bad: [s + k, a * s, s + 2], ex: `${a}s + ${k} = ${b}(s + ${k}) donc s = ${s}. Le père a ${a * s} ans.` }; },
  () => { const [C, t] = pickUntil(() => [R.pick([150, 200, 240, 300, 360, 400]), R.pick([30, 45, 60, 75, 90, 105, 120, 135, 150])], ([C, t]) => (C * t) % 60 === 0); const Rv = C * t / 60;
    return { p: `Un hélicoptère consomme ${C} litres de carburant par heure. Avec ${Rv} litres utilisables, combien de minutes peut-il voler ?`, a: t, u: ' min', bad: [Math.round(Rv / C * 100), t + 15, t - 15], ex: `${Rv} / ${C} = ${fr(Rv / C)} h = ${t} min` }; },
  () => { const E = R.pick([25000, 50000, 100000, 200000]), d = R.int(2, 12), a = d * E / 100000;
    return { p: `Sur une carte au 1/${E.toLocaleString('fr-FR')}, deux points sont séparés de ${d} cm. Quelle est la distance réelle ?`, a, u: ' km', bad: [a * 10, a / 10, a * 2], ex: `${d} cm × ${E.toLocaleString('fr-FR')} = ${fr(d * E / 100)} m = ${fr(a)} km` }; },
  () => { const x = R.pick([5, 12, 15, 25, 35, 40, 60, 75]), N = R.int(2, 30) * 20, a = x * N / 100;
    return { p: `Combien font ${x} % de ${N} ?`, a, bad: [N / x, a * 10, N - x], ex: `${N} × ${x}/100 = ${fr(a)}` }; },
  () => { const C = R.int(2, 20) * 500, t = R.pick([2, 3, 4, 5]), n = R.int(2, 6), a = C * t * n / 100;
    return { p: `Un capital de ${C.toLocaleString('fr-FR')} € est placé à ${t} % d'intérêts simples par an. Combien rapporte-t-il en ${n} ans ?`, a, u: ' €', bad: [C * t / 100, a + C * t / 100, a * 2], ex: `${C} × ${t}/100 × ${n} = ${fr(a)} €` }; },
  () => { const x = R.pick([10, 20, 30, 50]), y = R.pick([10, 20, 25, 50]), a = rnd(((1 + x / 100) * (1 + y / 100) - 1) * 100, 1);
    return { p: `On augmente la longueur d'un rectangle de ${x} % et sa largeur de ${y} %. De combien de pourcents son aire augmente-t-elle ?`, a, pre: '+', u: ' %', bad: [x + y, x * y / 10, a + 5], ex: `${fr(1 + x / 100)} × ${fr(1 + y / 100)} = ${fr(1 + a / 100)}, soit +${fr(a)} %` }; },
  () => { const [t1, t2] = R.pick([[6, 3], [12, 6], [4, 12], [10, 15], [20, 30], [6, 12], [3, 6], [12, 4]]), a = t1 * t2 / (t1 + t2);
    return { p: `Une pompe remplit une citerne en ${t1} h, une seconde en ${t2} h. Ensemble, en combien d'heures la remplissent-elles ?`, a, u: ' h', bad: [(t1 + t2) / 2, Math.abs(t1 - t2), t1 + t2], ex: `Débits : 1/${t1} + 1/${t2} = ${fr(1 / t1 + 1 / t2, 3)} citerne/h, soit ${fr(a)} h` }; },
  () => { const h = R.int(6, 20), m = R.int(5, 55), dh = R.int(0, 2), dm = R.int(10, 55), tot = h * 60 + m + dh * 60 + dm;
    const f = v => { v = ((v % 1440) + 1440) % 1440; return `${Math.floor(v / 60)} h ${String(v % 60).padStart(2, '0')}`; };
    return { str: true, p: `Un hélicoptère décolle à ${h} h ${String(m).padStart(2, '0')} pour un vol de ${dh ? dh + ' h ' : ''}${dm} min. À quelle heure se pose-t-il ?`, good: f(tot), bad: [f(tot + 10), f(tot - 10), f(tot + 60), f(h * 60 + m + dh * 60 + dm - 60 + 100)], ex: `${h} h ${m} + ${dh} h ${dm} = ${f(tot)}` }; }
];
function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
function tplToQ(t) { return t.str ? mkQ(t.p, t.good, t.bad, { ex: t.ex, lay: 'g2' }) : numQ(t); }
Gen.mathsCSO = () => tplToQ(R.pick(MATHS_CSO)());

/* ---------------- SECMA : Mathématiques (calculs + problèmes) ---------------- */
const frac = (n, d) => { const g = gcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : `${n}/${d}`; };
const CALC_T = [
  () => { const v = R.pick([36, 54, 72, 90, 108, 126, 144, 162, 180]); return { p: `${v} km/h = ? m/s`, a: v / 3.6, u: ' m/s', bad: [v / 6, v * 3.6 / 10, v / 3.6 + 5], ex: `Diviser par 3,6 : ${v} / 3,6 = ${v / 3.6}` }; },
  () => { const k = R.pick([50, 100, 150, 200, 250]); const a = Math.round(k * 1.852); return { p: `${k} nœuds ≈ ? km/h`, a, u: ' km/h', bad: [Math.round(k * 1.609), Math.round(k / 1.852), k * 2], ex: `1 nœud = 1,852 km/h : ${k} × 1,852 ≈ ${a}` }; },
  () => { const f = R.pick([1000, 2000, 3000, 5000, 10000]); const a = Math.round(f * 0.3048); return { p: `${f.toLocaleString('fr-FR')} ft ≈ ? m`, a, u: ' m', bad: [Math.round(f / 0.3048), Math.round(f * 0.5), Math.round(f * 0.2)], ex: `1 ft ≈ 0,3048 m` }; },
  () => { const k = R.int(6, 12); return { p: `2<sup>${k}</sup> = ?`, a: 2 ** k, bad: [2 ** (k - 1), 2 ** (k + 1), 2 * k * 10], ex: `2<sup>10</sup> = 1 024` }; },
  () => { const n = R.int(11, 25); return { p: `${n}² = ?`, a: n * n, bad: [n * n + n, n * n - 10, n * 20], ex: `${n} × ${n} = ${n * n}` }; },
  () => { const n = R.int(12, 30); return { p: `√${n * n} = ?`, a: n, bad: [n + 1, n - 1, n + 2] }; },
  () => { const b = R.pick([2, 3, 4, 5, 6]), d = R.pick([3, 4, 5, 6, 8].filter(x => x !== b)), a = R.int(1, b - 1), c = R.int(1, d - 1);
    return { str: true, p: `${a}/${b} + ${c}/${d} = ?`, good: frac(a * d + c * b, b * d), bad: [frac(a + c, b + d), frac(a * c, b * d), frac(a * d + c * b + d, b * d)], ex: `Même dénominateur : (${a}×${d} + ${c}×${b}) / ${b * d}` }; },
  () => { const b = R.int(3, 7), a = R.int(1, b - 1), d = R.int(3, 8), c = R.int(1, d - 1), g = frac(a * c, b * d);
    const bad = [frac(a * d, b * c), frac(a + c, b + d), frac(a * c + 1, b * d), frac(a * c, b + d), frac(a + c, b * d), frac(a * c, b * d + 1)].filter(x => x !== g);
    return { str: true, p: `${a}/${b} × ${c}/${d} = ?`, good: g, bad: [...new Set(bad)].slice(0, 4), ex: `On multiplie numérateurs et dénominateurs : ${a * c}/${b * d}${g !== `${a * c}/${b * d}` ? ` = ${g}` : ''}.` }; },
  () => { const q = R.pick([20, 25, 30, 40, 50, 60, 75]), b = R.pick([0.12, 0.04, 0.25, 0.2, 0.05]), a = rnd(q * b, 2);
    return { p: `${fr(a)} ÷ ${fr(b)} = ?`, a: q, bad: [q / 10, q * 10, q + 5], ex: `${fr(a)} ÷ ${fr(b)} = ${fr(a * 100)} ÷ ${fr(b * 100)} = ${q}` }; },
  () => { const a = R.int(12, 49), b = R.int(11, 29); return { p: `${a} × ${b} = ?`, a: a * b, bad: [a * b + 10, a * b - b, a * (b + 1)] }; },
  () => { const d = R.int(12, 48), q = R.int(12, 45); return { p: `${d * q} ÷ ${d} = ?`, a: q, bad: [q + 1, q - 1, q + 10] }; },
  () => { const x = R.pick([5, 12, 15, 25, 35, 40, 75]), N = R.int(2, 30) * 20; return { p: `${x} % de ${N} = ?`, a: x * N / 100, bad: [N / x, x * N / 10, N - x] }; },
  () => { const x = R.int(2, 15), a = R.int(2, 9), b = R.int(1, 30), c = a * x + b; return { p: `${a}x + ${b} = ${c}. Combien vaut x ?`, a: x, bad: [x + 1, x - 1, (c + b) / a], ex: `x = (${c} − ${b}) / ${a} = ${x}` }; },
  () => { const h = R.pick([0.25, 0.75, 1.2, 1.5, 1.75, 2.4, 2.25, 3.6]); return { p: `${fr(h)} h = ? min`, a: h * 60, u: ' min', bad: [Math.floor(h) * 60 + Math.round((h % 1) * 100), h * 100, h * 60 + 15], ex: `${fr(h)} × 60 = ${h * 60} min` }; },
  () => { const a = R.int(11, 99) / 10, e1 = R.int(2, 4), e2 = R.int(3, 5); return { p: `${fr(a)} × 10<sup>${e1}</sup> ÷ 10<sup>${e2}</sup> = ?`, a: rnd(a * 10 ** (e1 - e2), 4), bad: [rnd(a * 10 ** (e1 - e2 + 1), 4), rnd(a * 10 ** (e1 - e2 - 1), 4), rnd(a * 10 ** (e1 + e2), 4)] }; },
  () => { const a = R.int(10, 50), b = R.int(2, 9), c = R.int(2, 9), d = R.int(1, 20); return { p: `${a} + ${b} × ${c} − ${d} = ?`, a: a + b * c - d, bad: [(a + b) * c - d, a + b * (c - d), a + b * c + d], ex: `La multiplication d'abord : ${b} × ${c} = ${b * c}` }; }
];
const PROB_T = [
  () => { const p1 = R.pick([10, 20, 25]), p2 = R.pick([10, 15, 20, 25]), a = rnd((1 - p1 / 100) * (1 - p2 / 100) * 100, 1);
    return { p: `Un réservoir plein perd ${p1} % de son carburant, puis ${p2} % de ce qui reste. Quel pourcentage reste-t-il ?`, a, u: ' %', bad: [100 - p1 - p2, a - 5, a + 5], ex: `${fr(1 - p1 / 100)} × ${fr(1 - p2 / 100)} = ${fr(a / 100, 3)}` }; },
  () => { const V = R.pick([90, 120, 150, 180]), t = R.pick([40, 80, 90, 100, 120]), a = V * t / 60;
    return { p: `Vous volez à ${V} nœuds pendant ${Math.floor(t / 60) ? Math.floor(t / 60) + ' h ' : ''}${t % 60 ? (t % 60) + ' min' : ''}. Quelle distance parcourez-vous ?`, a, u: ' NM', bad: [V * (Math.floor(t / 60) + (t % 60) / 100), a + 20, a * 1.852], ex: `${V} × ${t}/60 = ${a} milles nautiques` }; },
  () => { const r = R.pick([4, 5, 6, 7, 8]), n = R.pick([5, 10, 20]), a = rnd(2 * 3.14 * r * n, 1);
    return { p: `Un rotor de ${r} m de rayon effectue ${n} tours. Quelle distance parcourt l'extrémité d'une pale ? (π ≈ 3,14)`, a, u: ' m', bad: [rnd(3.14 * r * n, 1), rnd(3.14 * r * r * n, 1), rnd(2 * 3.14 * r * n * 2, 1)], ex: `Circonférence 2πr = ${fr(2 * 3.14 * r)} m, × ${n} = ${fr(a)} m` }; },
  () => { const tas = R.pick([120, 150, 180]), w = R.pick([20, 30]), gs = tas - w, t = pickUntil(() => R.pick([20, 30, 40, 45, 60, 90]), t => (gs * t) % 60 === 0), D = gs * t / 60;
    return { p: `Vitesse propre ${tas} kt, vent de face ${w} kt. Combien de minutes pour parcourir ${D} NM ?`, a: t, u: ' min', bad: [Math.round(D / tas * 60), Math.round(D / (tas + w) * 60), t + 10], ex: `Vitesse sol = ${tas} − ${w} = ${gs} kt. ${D} / ${gs} h = ${t} min` }; },
  () => { const v1 = R.pick([60, 80, 90, 120]), v2 = R.pick([40, 60, 90, 120]), t = R.pick([30, 45, 60, 90, 120]), D = (v1 + v2) * t / 60;
    if (D % 1) return PROB_T[4]();
    return { p: `Deux véhicules distants de ${D} km roulent l'un vers l'autre à ${v1} et ${v2} km/h. Au bout de combien de minutes se croisent-ils ?`, a: t, u: ' min', bad: [Math.round(D / Math.abs(v1 - v2 || 10) * 60), t + 15, t * 2], ex: `Vitesse de rapprochement ${v1 + v2} km/h : ${D} / ${v1 + v2} h = ${t} min` }; },
  () => { const vz = R.pick([500, 750, 1000]), h1 = R.pick([500, 1000, 1500]), dh = vz * R.int(2, 6), h2 = h1 + dh;
    return { p: `Un hélicoptère monte à ${vz} ft/min. Combien de minutes pour passer de ${h1} ft à ${h2} ft ?`, a: dh / vz, u: ' min', bad: [h2 / vz, dh / vz + 1, Math.round(h1 / vz)], ex: `(${h2} − ${h1}) / ${vz} = ${dh / vz} min` }; }
];
Gen.mathsTours = (ctx, i, n) => {
  const nProb = Math.max(1, Math.round(n / 5));
  return tplToQ(R.pick(i >= n - nProb ? PROB_T : CALC_T)());
};

/* ---------------- Calcul mental (sprint) ---------------- */
Gen.mental = () => {
  const t = R.pick(['+', '+', '−', '−', '×', '×', '÷']);
  let a, b, r;
  if (t === '+') { a = R.int(12, 89); b = R.int(12, 89); r = a + b; }
  else if (t === '−') { a = R.int(30, 150); b = R.int(11, a - 1); r = a - b; }
  else if (t === '×') { if (R.chance(0.5)) { a = R.int(3, 12); b = R.int(3, 12); } else { a = R.int(11, 29); b = R.int(2, 9); } r = a * b; }
  else { b = R.int(3, 12); r = R.int(3, 15); a = b * r; }
  return { p: `${a} ${t} ${b}`, a: r };
};

/* ---------------- TAMI-C : Verbal ---------------- */
const parseEq = l => { const [w, rest] = l.split('='); return [w, ...rest.split('|')]; };
Gen.verbal = () => {
  const k = Math.random();
  if (k < 0.32) { const [w, g, ...b] = parseEq(R.pick(DATA.SYN)); return mkQ(`Synonyme de <b>${esc(w)}</b>`, g, b); }
  if (k < 0.56) { const [w, g, ...b] = parseEq(R.pick(DATA.ANT)); return mkQ(`Contraire de <b>${esc(w)}</b>`, g, b); }
  if (k < 0.78) { const [g, ...rest] = R.pick(DATA.INTR).split('|'); const why = rest.pop(); return mkQ('Quel mot est l\'intrus ?', g, rest, { ex: why }); }
  const [d, g, ...b] = parseEq(R.pick(DATA.DEF)); return mkQ(`<i>${esc(d)}</i>`, g, b, { ex: `Définition : ${d}.` });
};

/* ---------------- QCM de banque (culture, anglais) ---------------- */
function bankQ(line, deco) {
  const [q, g, b1, b2, b3, ex] = line.split('|');
  return mkQ(deco ? deco(q) : esc(q), esc(g), [b1, b2, b3].map(esc), { ex: ex || '' });
}
function bankGen(bank, deco) {
  return ctx => {
    if (!ctx.pool || !ctx.pool.length) ctx.pool = R.shuffle(bank);
    return bankQ(ctx.pool.pop(), deco);
  };
}
Gen.anglais = bankGen(DATA.ENG, q => esc(q).replace('___', '<span class="blank">______</span>'));
Gen.cultureG = bankGen(DATA.CG);
Gen.cultureAero = bankGen(DATA.AERO);

Gen.identif = ctx => {
  if (!ctx.pool || !ctx.pool.length) ctx.pool = R.shuffle(DATA.AIRCRAFT.map(l => l.split('|')));
  const [name, type, clue] = ctx.pool.pop();
  const same = DATA.AIRCRAFT.map(l => l.split('|')).filter(x => x[1] === type && x[0] !== name);
  const others = R.sample(same, 3);
  if (R.chance(0.72)) return mkQ(`<span class="eyebrow">Identifie l'aéronef</span><br>${esc(clue)}`, esc(name), others.map(o => esc(o[0])), { ex: `${name} : ${clue}` });
  return mkQ(`Quelle description correspond au <b>${esc(name)}</b> ?`, esc(clue), others.map(o => esc(o[2])), { ex: '' });
};

/* ---------------- TAMI-C : Codage ---------------- */
Gen.codageSetup = () => {
  const theme = R.pick(Object.keys(DATA.CODE_WORDS));
  const words = R.sample(DATA.CODE_WORDS[theme], 12);
  const prefixes = [];
  while (prefixes.length < 6) { const p = String(R.int(10, 99)); if (!prefixes.includes(p)) prefixes.push(p); }
  const codes = [];
  for (let i = 0; i < 12; i++) {
    let c; do { c = prefixes[i % 6] + String(R.int(10, 99)); } while (codes.includes(c));
    codes.push(c);
  }
  return { words, codes: R.shuffle(codes), last: -1 };
};
Gen.codageContext = ctx => `<div class="codegrid">${ctx.words.map((w, i) => `<div><span>${w}</span><b>${ctx.codes[i]}</b></div>`).join('')}</div>`;
Gen.codage = ctx => {
  let i; do { i = R.int(0, 11); } while (i === ctx.last); ctx.last = i;
  const good = ctx.codes[i];
  const pool = new Set();
  const swap = s => { const k = R.int(0, 2); return s.slice(0, k) + s[k + 1] + s[k] + s.slice(k + 2); };
  const alter = s => { const k = R.int(0, 3); const d = (Number(s[k]) + R.pick([1, 9, 2, 8])) % 10; return s.slice(0, k) + d + s.slice(k + 1); };
  const sameP = ctx.codes.filter((c, j) => j !== i && c.slice(0, 2) === good.slice(0, 2));
  sameP.forEach(c => pool.add(c));
  let g = 0;
  while (pool.size < 4 && g++ < 50) {
    const r = Math.random();
    const c = r < 0.35 ? swap(good) : r < 0.65 ? alter(good) : R.pick(ctx.codes);
    if (c !== good) pool.add(c);
  }
  return mkQ(`Code de <b class="mono">${ctx.words[i]}</b> ?`, good, [...pool].slice(0, 4), { lay: 'g3' });
};

/* ---------------- TAMI-C : Attention ---------------- */
const CONFUSE = { O: '0', '0': 'O', I: '1', '1': 'I', S: '5', '5': 'S', B: '8', '8': 'B', Z: '2', '2': 'Z', G: '6', '6': 'G', E: 'F', F: 'E', P: 'R', R: 'P', M: 'N', N: 'M', U: 'V', V: 'U', C: 'G', Q: 'O', '3': '8', '7': '1', '9': '4', '4': '9' };
Gen.attention = () => {
  const kind = R.pick(['num', 'num', 'alnum', 'alnum', 'nom']);
  let base;
  if (kind === 'num') base = Array.from({ length: R.int(7, 9) }, () => R.int(0, 9)).join('');
  else if (kind === 'alnum') { const A = 'ABCDEFGHJKLMNPRSTUVXZ0123456789'; base = Array.from({ length: 8 }, (_, k) => k === 4 ? '-' : A[R.int(0, A.length - 1)]).join(''); }
  else base = `${R.pick(DATA.NAMES)}-${R.pick(DATA.NAMES)} ${R.pick(DATA.FIRST)}`;
  const mutate = s => {
    const idx = [...s].map((c, k) => k).filter(k => /[A-Za-z0-9éèêëàâîïôûç]/.test(s[k]));
    const k = R.pick(idx), c = s[k];
    let n;
    if (kind === 'nom') {
      const L = { e: 'é', é: 'e', è: 'é', a: 'o', o: 'a', n: 'm', m: 'n', i: 'l', l: 'i', u: 'v', r: 'n', t: 'f', c: 'e', s: 'z' };
      if (R.chance(0.3) && k > 0 && s[k - 1] !== ' ') return s.slice(0, k) + c + s.slice(k);
      n = L[c] || L[c.toLowerCase()] || 'e';
      if (c === c.toUpperCase() && c !== c.toLowerCase()) n = n.toUpperCase();
    } else if (R.chance(0.35) && k < s.length - 1 && /[A-Z0-9]/.test(s[k + 1]) && s[k + 1] !== c) {
      return s.slice(0, k) + s[k + 1] + c + s.slice(k + 2);
    } else n = CONFUSE[c] || (/\d/.test(c) ? String((Number(c) + 1) % 10) : String.fromCharCode(c === 'Z' ? 89 : c.charCodeAt(0) + 1));
    return n === c ? s.slice(0, k) + (c === 'A' ? 'B' : 'A') + s.slice(k + 1) : s.slice(0, k) + n + s.slice(k + 1);
  };
  const all = [base, base, base, base];
  let ans = 4;
  if (!R.chance(0.22)) { ans = R.int(0, 3); all[ans] = mutate(base); if (all[ans] === base) ans = 4; }
  const ch = all.map((s, k) => `<span class="mono lbl">${'ABCD'[k]}</span><span class="mono attn">${esc(s)}</span>`).concat(['Toutes identiques']);
  return { p: 'Une série est-elle différente des autres ?', ch, a: ans, lay: 'list', ex: ans < 4 ? `Différence en ${'ABCD'[ans]} : ${esc(all[ans])} au lieu de ${esc(base)}` : 'Les quatre séries étaient identiques.' };
};

/* ---------------- TAMI-C : Rotation (damiers) ---------------- */
const rot90 = (g, N) => g.map((_, k) => { const r = Math.floor(k / N), c = k % N; return g[(N - 1 - c) * N + r]; });
const mirror = (g, N) => g.map((_, k) => { const r = Math.floor(k / N), c = k % N; return g[r * N + (N - 1 - c)]; });
const rotN = (g, N, t) => { for (let i = 0; i < t; i++) g = rot90(g, N); return g; };
const gkey = g => g.join('');
function gridSVG(g, N) {
  const S = 100, c = S / N;
  let s = `<svg viewBox="-2 -2 ${S + 4} ${S + 4}" class="gsvg" aria-hidden="true"><rect x="0" y="0" width="${S}" height="${S}" class="g-bg"/>`;
  g.forEach((v, k) => {
    const x = (k % N) * c, y = Math.floor(k / N) * c;
    if (v === 1) s += `<rect x="${x}" y="${y}" width="${c}" height="${c}" class="g-on"/>`;
    if (v === 2) s += `<circle cx="${x + c / 2}" cy="${y + c / 2}" r="${c * 0.3}" class="g-dot"/>`;
    if (v === 3) s += `<path d="M${x + c * 0.2} ${y + c * 0.8} L${x + c / 2} ${y + c * 0.2} L${x + c * 0.8} ${y + c * 0.8} Z" class="g-dot"/>`;
  });
  for (let i = 1; i < N; i++) s += `<line x1="${i * c}" y1="0" x2="${i * c}" y2="${S}" class="g-ln"/><line x1="0" y1="${i * c}" x2="${S}" y2="${i * c}" class="g-ln"/>`;
  return s + `<rect x="0" y="0" width="${S}" height="${S}" class="g-fr"/></svg>`;
}
Gen.spatial = () => {
  const N = R.pick([4, 4, 5]);
  let g, rots;
  for (let tries = 0; tries < 100; tries++) {
    g = Array(N * N).fill(0);
    const cells = R.sample([...Array(N * N).keys()], R.int(N + 1, N + 3));
    cells.forEach((k, j) => { g[k] = j === 0 ? 2 : j === 1 && N === 5 ? 3 : 1; });
    rots = [0, 1, 2, 3].map(t => gkey(rotN(g, N, t)));
    const m = mirror(g, N);
    const mr = [0, 1, 2, 3].map(t => gkey(rotN(m, N, t)));
    if (new Set(rots).size === 4 && !mr.some(k => rots.includes(k))) break;
  }
  const good = rotN(g, N, R.int(1, 3));
  const m = mirror(g, N);
  const opts = [good];
  const keys = new Set([gkey(good)]);
  const push = c => { const k = gkey(c); if (!keys.has(k) && !rots.includes(k)) { keys.add(k); opts.push(c); } };
  R.shuffle([0, 1, 2, 3]).forEach(t => opts.length < 4 && push(rotN(m, N, t)));
  let guard = 0;
  while (opts.length < 5 && guard++ < 40) {
    const c = rotN(g, N, R.int(1, 3)).slice();
    const on = c.map((v, k) => v === 1 ? k : -1).filter(k => k >= 0), off = c.map((v, k) => v === 0 ? k : -1).filter(k => k >= 0);
    const a = R.pick(on), b = R.pick(off); c[a] = 0; c[b] = 1;
    push(c);
  }
  const ord = R.shuffle(opts.map((o, k) => k));
  return { p: 'Quelle grille est le modèle après rotation ?', v: `<div class="model"><span class="eyebrow">Modèle</span>${gridSVG(g, N)}</div>`, ch: ord.map(k => gridSVG(opts[k], N)), a: ord.indexOf(0), lay: 'g3', ex: 'Les autres grilles sont des images en miroir ou ont une case déplacée : une rotation ne retourne jamais la figure.' };
};

/* ---------------- TAMI-C : Suites de cubes ---------------- */
const SHAPES = ['circle', 'tri', 'square', 'star'];
const FACE = {
  num() {
    const k = R.pick([1, 2, 3, -1, -2, 'x2']);
    let s;
    if (k === 'x2') { const a = R.int(1, 2); s = [a, a * 2, a * 4, a * 8]; }
    else { const a = k > 0 ? R.int(1, 9) : R.int(9, 15); s = [0, 1, 2, 3].map(i => a + i * k); }
    const v = s[3];
    return { t: 'num', s, w: [v + 1, v - 1, s[2], v + (k === 'x2' ? 2 : k)].filter(x => x !== v && x >= 0) };
  },
  let() {
    const k = R.int(1, 3), a = R.int(0, 14), s = [0, 1, 2, 3].map(i => a + i * k), v = s[3];
    return { t: 'let', s, w: [v + 1, v - 1, v + k, s[2]].filter(x => x !== v && x >= 0 && x < 26) };
  },
  arr() {
    const k = R.pick([45, 90, -45, -90, 135]), a = R.pick([0, 45, 90, 135, 180, 225, 270, 315]), s = [0, 1, 2, 3].map(i => ((a + i * k) % 360 + 360) % 360), v = s[3];
    return { t: 'arr', s, w: [(v + 180) % 360, ((s[2] - k) % 360 + 360) % 360, (v + 90) % 360, (v + 270) % 360].filter(x => x !== v) };
  },
  dot() {
    const up = R.chance(0.6), a = up ? R.int(1, 2) : R.int(5, 6), s = [0, 1, 2, 3].map(i => a + (up ? i : -i)), v = s[3];
    return { t: 'dot', s, w: [v + 1, v - 1, s[2]].filter(x => x !== v && x >= 0 && x <= 6) };
  },
  quad() {
    const k = R.pick([1, -1, 2]), a = R.int(0, 3), s = [0, 1, 2, 3].map(i => ((a + i * k) % 4 + 4) % 4), v = s[3];
    return { t: 'quad', s, w: [0, 1, 2, 3].filter(x => x !== v) };
  },
  shp() {
    const c = R.sample([0, 1, 2, 3], 3), s = [c[0], c[1], c[2], c[0]], other = [0, 1, 2, 3].find(x => !c.includes(x));
    return { t: 'shp', s, w: [c[1], c[2], other] };
  }
};
const DOTS = { 0: [], 1: [[50, 50]], 2: [[30, 30], [70, 70]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[30, 30], [70, 30], [30, 70], [70, 70]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[30, 24], [70, 24], [30, 50], [70, 50], [30, 76], [70, 76]] };
function shapeSVG(i, cls) {
  const s = SHAPES[i];
  if (s === 'circle') return `<circle cx="50" cy="50" r="26" class="${cls}"/>`;
  if (s === 'tri') return `<path d="M50 20 L80 76 L20 76 Z" class="${cls}"/>`;
  if (s === 'square') return `<rect x="25" y="25" width="50" height="50" class="${cls}"/>`;
  return `<path d="M50 16 L59 40 L84 40 L64 56 L72 82 L50 66 L28 82 L36 56 L16 40 L41 40 Z" class="${cls}"/>`;
}
function faceSVG(t, v) {
  if (t === 'num') return `<text x="50" y="54" class="cf-t">${v}</text>`;
  if (t === 'let') return `<text x="50" y="54" class="cf-t">${String.fromCharCode(65 + v)}</text>`;
  if (t === 'arr') return `<g transform="rotate(${v} 50 50)"><path d="M50 14 L70 42 L57 42 L57 84 L43 84 L43 42 L30 42 Z" class="cf-f"/></g>`;
  if (t === 'dot') return DOTS[v].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" class="cf-f"/>`).join('');
  if (t === 'quad') { const x = v === 1 || v === 2 ? 50 : 0, y = v >= 2 ? 50 : 0; return `<rect x="${x}" y="${y}" width="50" height="50" class="cf-f"/><path d="M50 0 V100 M0 50 H100" class="cf-l"/>`; }
  return shapeSVG(v, 'cf-f');
}
function cubeSVG(c) {
  const S = 38, cx = 50, cy = 52, dx = 0.866 * S, dy = 0.5 * S;
  const m = (ax, ay, bx, by, ox, oy) => `matrix(${ax / 100} ${ay / 100} ${bx / 100} ${by / 100} ${ox} ${oy})`;
  const top = m(dx, dy, -dx, dy, cx, cy - S), left = m(dx, dy, 0, S, cx - dx, cy - dy), right = m(dx, -dy, 0, S, cx, cy);
  const face = (tr, f, shade) => `<g transform="${tr}"><rect x="0" y="0" width="100" height="100" class="cf-bg ${shade}"/>${faceSVG(f.t, f.v)}<rect x="0" y="0" width="100" height="100" class="cf-e"/></g>`;
  return `<svg viewBox="0 0 100 104" class="cube" aria-hidden="true">${face(top, c.top, 'sh0')}${face(left, c.left, 'sh1')}${face(right, c.right, 'sh2')}</svg>`;
}
Gen.cubes = () => {
  const types = R.sample(Object.keys(FACE), 3);
  const seqs = types.map(t => FACE[t]());
  const sides = ['top', 'left', 'right'];
  const cubeAt = i => Object.fromEntries(sides.map((sd, j) => [sd, { t: seqs[j].t, v: seqs[j].s[i] }]));
  const good = cubeAt(3);
  const opts = [good], keys = new Set([JSON.stringify(good)]);
  let guard = 0;
  while (opts.length < 5 && guard++ < 60) {
    const j = R.int(0, 2);
    if (!seqs[j].w.length) continue;
    const c = JSON.parse(JSON.stringify(good));
    c[sides[j]].v = R.pick(seqs[j].w);
    if (R.chance(0.25)) { const j2 = (j + 1) % 3; if (seqs[j2].w.length) c[sides[j2]].v = R.pick(seqs[j2].w); }
    const k = JSON.stringify(c);
    if (!keys.has(k)) { keys.add(k); opts.push(c); }
  }
  const ord = R.shuffle(opts.map((_, k) => k));
  const seqHTML = `<div class="cubeseq">${[0, 1, 2].map(i => cubeSVG(cubeAt(i))).join('')}<div class="cube q">?</div></div>`;
  return { p: 'Quel cube complète la suite ?', v: seqHTML, ch: ord.map(k => cubeSVG(opts[k])), a: ord.indexOf(0), lay: 'g3', ex: 'Chaque face suit sa propre logique : regarde-les une par une (dessus, gauche, droite).' };
};

/* ---------------- SECMA : Orientation (horizon artificiel + compas) ---------------- */
const Orient = (() => {
  const F = [];
  const hex = (x, w, top, bot) => [[x, 0, top], [x, w, top * 0.55 + bot * 0.1], [x, w, bot * 0.6], [x, 0, bot], [x, -w, bot * 0.6], [x, -w, top * 0.55 + bot * 0.1]];
  const loft = (frames, colFn) => { for (let i = 0; i < frames.length - 1; i++) for (let j = 0; j < 6; j++) { const a = frames[i], b = frames[i + 1], k = (j + 1) % 6; F.push({ p: [a[j], a[k], b[k], b[j]], c: colFn(i, j) }); } };
  const cap = (fr, c) => F.push({ p: fr.slice(), c });
  const body = [hex(-1.4, 0.32, 0.45, -0.35), hex(-0.6, 0.55, 0.62, -0.55), hex(0.6, 0.55, 0.58, -0.55), hex(1.35, 0.45, 0.32, -0.5), hex(1.9, 0.2, 0.02, -0.3)];
  loft(body, (i, j) => (i >= 2 && (j === 0 || j === 5 || j === 1)) ? 'glass' : 'body');
  cap(body[0], 'body'); cap(body[4], 'glass');
  const boom = [hex(-1.4, 0.16, 0.38, 0.02), hex(-4.2, 0.08, 0.32, 0.16)];
  loft(boom, () => 'body'); cap(boom[1], 'body');
  F.push({ p: [[-3.9, 0, 0.3], [-4.35, 0, 0.3], [-4.55, 0, 1.15], [-4.25, 0, 1.15]], c: 'body' });
  F.push({ p: [[-3.25, -0.8, 0.22], [-3.25, 0.8, 0.22], [-3.6, 0.8, 0.22], [-3.6, -0.8, 0.22]], c: 'body' });
  for (const y of [-0.62, 0.62]) {
    F.push({ p: [[-1.2, y, -0.92], [1.55, y, -0.92], [1.75, y, -0.75], [1.5, y, -0.86], [-1.2, y, -0.86]], c: 'dark' });
    for (const x of [-0.6, 0.85]) F.push({ p: [[x, y * 0.55, -0.45], [x + 0.12, y * 0.55, -0.45], [x + 0.12, y, -0.88], [x, y, -0.88]], c: 'dark' });
  }
  F.push({ p: [[0.12, 0, 0.6], [0.12, 0, 0.9], [-0.12, 0, 0.9], [-0.12, 0, 0.6]], c: 'dark' });
  const disc = (cx, cy, cz, r, plane) => Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2; return plane === 'xy' ? [cx + r * Math.cos(a), cy + r * Math.sin(a), cz] : [cx + r * Math.cos(a), cy, cz + r * Math.sin(a)]; });
  const ROTOR = disc(0, 0, 0.92, 3.1, 'xy'), TAIL = disc(-4.3, 0.14, 0.85, 0.5, 'xz');
  const D = Math.PI / 180;
  function xf(v, h, p, b) {
    let [x, y, z] = v;
    const cb = Math.cos(b * D), sb = Math.sin(b * D);
    [y, z] = [y * cb + z * sb, -y * sb + z * cb];
    const cp = Math.cos(p * D), sp = Math.sin(p * D);
    [x, z] = [x * cp - z * sp, x * sp + z * cp];
    const ch = Math.cos(h * D), sh = Math.sin(h * D);
    return [x * sh + y * ch, x * ch - y * sh, z];
  }
  const E = 18 * D, dir = [0, Math.cos(E), -Math.sin(E)], up = [0, Math.sin(E), Math.cos(E)];
  const L = (() => { const v = [-0.35, -0.55, 0.75]; const n = Math.hypot(...v); return v.map(c => c / n); })();
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function colors() {
    const cs = getComputedStyle(document.documentElement);
    const g = n => cs.getPropertyValue(n).trim() || '#888';
    return { body: g('--heli'), glass: g('--glass'), dark: g('--heli-dark'), rotor: g('--fg'), bg: g('--surface-2') };
  }
  const hexRgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  function heli(h, p, b, W = 240, H = 170) {
    const cv = document.createElement('canvas'); cv.width = W * 2; cv.height = H * 2;
    const ctx = cv.getContext('2d'); ctx.scale(2, 2);
    const C = colors();
    const sc = Math.min(W, H) / 7.4, ox = W / 2, oy = H / 2 + 6;
    const proj = P => [ox + P[0] * sc, oy - dot(P, up) * sc];
    const faces = F.map(f => {
      const P = f.p.map(v => xf(v, h, p, b));
      const u = P[1].map((c, i) => c - P[0][i]), w = P[2].map((c, i) => c - P[0][i]);
      const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      const nl = Math.hypot(...n) || 1;
      const shade = 0.5 + 0.5 * Math.abs(dot(n, L) / nl);
      return { P, c: f.c, d: P.reduce((s, q) => s + dot(q, dir), 0) / P.length, shade };
    }).sort((a, b) => b.d - a.d);
    const tailP = TAIL.map(v => xf(v, h, p, b));
    const tailD = tailP.reduce((s, q) => s + dot(q, dir), 0) / tailP.length;
    let tailDone = false;
    const drawTail = () => { ctx.beginPath(); tailP.forEach((q, i) => { const [x, y] = proj(q); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); ctx.globalAlpha = 0.3; ctx.fillStyle = C.rotor; ctx.fill(); ctx.globalAlpha = 0.7; ctx.strokeStyle = C.rotor; ctx.lineWidth = 0.8; ctx.stroke(); ctx.globalAlpha = 1; tailDone = true; };
    for (const f of faces) {
      if (!tailDone && f.d < tailD) drawTail();
      const rgb = hexRgb(C[f.c] || C.body).map(v => Math.round(v * f.shade));
      ctx.beginPath(); f.P.forEach((q, i) => { const [x, y] = proj(q); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
      ctx.fillStyle = `rgb(${rgb})`; ctx.fill(); ctx.strokeStyle = `rgba(0,0,0,.35)`; ctx.lineWidth = 0.5; ctx.stroke();
    }
    if (!tailDone) drawTail();
    const RP = ROTOR.map(v => xf(v, h, p, b));
    ctx.beginPath(); RP.forEach((q, i) => { const [x, y] = proj(q); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
    ctx.globalAlpha = 0.16; ctx.fillStyle = C.rotor; ctx.fill(); ctx.globalAlpha = 0.55; ctx.strokeStyle = C.rotor; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
    return cv.toDataURL();
  }
  function instruments(h, p, b) {
    const W = 300, H = 150, cv = document.createElement('canvas'); cv.width = W * 2; cv.height = H * 2;
    const ctx = cv.getContext('2d'); ctx.scale(2, 2);
    const r = 62;
    // Horizon artificiel
    ctx.save(); ctx.translate(75, 75);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.clip();
    ctx.save(); ctx.rotate(-b * D); ctx.translate(0, p * 1.6);
    ctx.fillStyle = '#3E8ED0'; ctx.fillRect(-150, -150, 300, 150);
    ctx.fillStyle = '#7A5230'; ctx.fillRect(-150, 0, 300, 150);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(150, 0); ctx.stroke();
    ctx.lineWidth = 1.2;
    for (const k of [-20, -10, 10, 20]) { const y = -k * 1.6, w = Math.abs(k) === 10 ? 14 : 22; ctx.beginPath(); ctx.moveTo(-w, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, -r + 12 - p * 1.6); ctx.lineTo(-6, -r + 22 - p * 1.6); ctx.lineTo(6, -r + 22 - p * 1.6); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    for (const a of [-60, -30, 0, 30, 60]) { ctx.save(); ctx.rotate(a * D); ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, -r + (a ? 8 : 11)); ctx.stroke(); ctx.restore(); }
    ctx.strokeStyle = '#F2B13B'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-12, 0); ctx.lineTo(-6, 6); ctx.moveTo(34, 0); ctx.lineTo(12, 0); ctx.lineTo(6, 6); ctx.stroke();
    ctx.fillStyle = '#F2B13B'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(75, 75, r + 1, 0, Math.PI * 2); ctx.stroke();
    // Compas
    ctx.save(); ctx.translate(225, 75);
    ctx.fillStyle = '#111820'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.rotate(-h * D);
    ctx.strokeStyle = '#E6EDF3'; ctx.fillStyle = '#E6EDF3';
    for (let a = 0; a < 360; a += 15) { ctx.save(); ctx.rotate(a * D); ctx.lineWidth = a % 45 ? 1 : 2; ctx.beginPath(); ctx.moveTo(0, -r + 2); ctx.lineTo(0, -r + (a % 45 ? 8 : 12)); ctx.stroke(); ctx.restore(); }
    ctx.font = '700 15px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    [['N', 0], ['E', 90], ['S', 180], ['O', 270]].forEach(([t, a]) => { ctx.save(); ctx.rotate(a * D); ctx.fillStyle = t === 'N' ? '#F2B13B' : '#E6EDF3'; ctx.fillText(t, 0, -r + 24); ctx.restore(); });
    ctx.restore();
    ctx.fillStyle = '#F2B13B'; ctx.beginPath(); ctx.moveTo(0, -r - 2); ctx.lineTo(-6, -r - 10); ctx.lineTo(6, -r - 10); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#F2B13B'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(0, 18); ctx.moveTo(-14, -2); ctx.lineTo(14, -2); ctx.moveTo(-6, 14); ctx.lineTo(6, 14); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = '#444'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(225, 75, r + 1, 0, Math.PI * 2); ctx.stroke();
    return cv.toDataURL();
  }
  return { heli, instruments };
})();
const CAP = h => ['nord', 'nord-est', 'est', 'sud-est', 'sud', 'sud-ouest', 'ouest', 'nord-ouest'][h / 45];
Gen.orientation = () => {
  const h = R.int(0, 7) * 45, b = R.pick([-30, 0, 30]), p = R.pick([-12, 0, 12]);
  const key = (a, c, d) => `${a}/${c}/${d}`;
  const good = [h, b, p], seen = new Set([key(...good)]), opts = [good];
  const cands = R.shuffle([
    [h, -b || 30, p], [h, b, -p || 12], [(h + 180) % 360, b, p], [(360 - h) % 360, -b, p], [(h + 90) % 360, b, p], [(h + 270) % 360, b, p],
    [h, b === 0 ? -30 : 0, p], [h, b, p === 0 ? -12 : 0], [(h + 180) % 360, -b, -p], [(h + 45) % 360, b, p]
  ]);
  for (const c of cands) { if (opts.length >= 5) break; const k = key(...c); if (!seen.has(k)) { seen.add(k); opts.push(c); } }
  const ord = R.shuffle(opts.map((_, k) => k));
  const att = `${p > 0 ? 'en montée' : p < 0 ? 'en descente' : 'en palier'}, ${b > 0 ? 'incliné à droite' : b < 0 ? 'incliné à gauche' : 'ailes à plat'}`;
  return {
    p: 'Quel hélicoptère correspond aux instruments ?',
    v: `<img class="instr" alt="Horizon artificiel et compas" src="${Orient.instruments(h, p, b)}"><p class="hint">Tu observes depuis le sud, légèrement au-dessus : le nord est vers l'avant de l'image, l'est à droite.</p>`,
    ch: ord.map(k => `<img alt="" src="${Orient.heli(...[opts[k][0], opts[k][2], opts[k][1]])}">`),
    a: ord.indexOf(0), lay: 'img',
    ex: `Cap ${String(h).padStart(3, '0')} (${CAP(h)}), ${att}.`
  };
};

/* ---------------- SECMA : Différences (silhouettes d'hélicoptères) ---------------- */
const HF = ['nose', 'win', 'door', 'gear', 'tail', 'stab', 'hub', 'stub', 'sensor', 'ant', 'exh'];
const HF_VALS = { nose: ['round', 'point'], win: [1, 2], door: [0, 1], gear: ['skid', 'wheel'], tail: ['rotor', 'fen'], stab: [0, 1], hub: ['ball', 'box'], stub: [0, 1], sensor: [0, 1], ant: [0, 1], exh: [0, 1] };
function heliSVG(h) {
  const st = 'class="hs"';
  let s = `<svg viewBox="0 0 200 100" class="hsvg" aria-hidden="true">`;
  s += `<line x1="38" y1="20" x2="162" y2="20" class="hl"/>`;
  s += h.hub === 'ball' ? `<line x1="100" y1="22" x2="100" y2="34" class="hl"/><circle cx="100" cy="20" r="4" ${st}/>` : `<line x1="100" y1="24" x2="100" y2="34" class="hl"/><rect x="95" y="17" width="10" height="7" ${st}/>`;
  s += `<path d="M62 46 L16 44 L16 49 L62 58 Z" ${st}/>`;
  if (h.tail === 'rotor') s += `<path d="M16 46 L9 26 L22 26 L24 46 Z" ${st}/><circle cx="12" cy="30" r="9" class="hl"/><line x1="4" y1="30" x2="20" y2="30" class="hl"/>`;
  else s += `<path d="M16 48 L6 22 L20 22 L28 46 Z" ${st}/><circle cx="15" cy="34" r="5" class="hl"/>`;
  if (h.stab) s += `<rect x="26" y="45" width="16" height="3" ${st}/>`;
  if (h.ant) s += `<line x1="44" y1="46" x2="40" y2="36" class="hl"/>`;
  s += h.nose === 'round' ? `<path d="M60 58 Q60 36 88 34 L120 34 Q142 36 144 54 Q144 68 128 68 L72 68 Q60 68 60 58 Z" ${st}/>` : `<path d="M60 58 Q60 36 88 34 L118 34 Q134 37 152 60 Q146 68 128 68 L72 68 Q60 68 60 58 Z" ${st}/>`;
  s += h.nose === 'round' ? `<path d="M124 38 Q138 40 140 52 L126 52 Z" class="hw"/>` : `<path d="M122 38 Q134 41 146 58 L126 56 Z" class="hw"/>`;
  s += `<rect x="96" y="40" width="12" height="10" rx="2" class="hw"/>`;
  if (h.win === 2) s += `<rect x="78" y="40" width="12" height="10" rx="2" class="hw"/>`;
  if (h.door) s += `<rect x="72" y="38" width="22" height="27" rx="1" class="hd"/>`;
  if (h.exh) s += `<rect x="72" y="29" width="14" height="6" rx="2" ${st}/>`;
  if (h.stub) s += `<rect x="86" y="58" width="30" height="4" ${st}/><ellipse cx="101" cy="66" rx="12" ry="3.5" ${st}/>`;
  if (h.sensor) s += h.nose === 'round' ? `<circle cx="138" cy="70" r="4" ${st}/>` : `<circle cx="144" cy="68" r="4" ${st}/>`;
  if (h.gear === 'skid') s += `<line x1="82" y1="68" x2="78" y2="82" class="hl"/><line x1="120" y1="68" x2="124" y2="82" class="hl"/><path d="M64 82 L138 82 Q146 82 148 76" class="hl" fill="none"/>`;
  else s += `<line x1="82" y1="68" x2="80" y2="78" class="hl"/><line x1="128" y1="68" x2="130" y2="78" class="hl"/><circle cx="80" cy="82" r="5" ${st}/><circle cx="130" cy="82" r="5" ${st}/>`;
  return s + '</svg>';
}
Gen.differences = () => {
  const base = Object.fromEntries(HF.map(f => [f, R.pick(HF_VALS[f])]));
  const vary = (h, n = 1) => { const c = { ...h }; R.sample(HF, n).forEach(f => { c[f] = HF_VALS[f].find(v => v !== h[f]); }); return c; };
  const has = R.chance(0.78);
  const opts = [], keys = new Set([JSON.stringify(base)]);
  if (has) opts.push(base);
  let g = 0;
  while (opts.length < 5 && g++ < 60) { const c = vary(base, R.chance(0.8) ? 1 : 2), k = JSON.stringify(c); if (!keys.has(k)) { keys.add(k); opts.push(c); } }
  const ord = R.shuffle(opts.map((_, k) => k));
  const ch = ord.map(k => heliSVG(opts[k])).concat(['<span class="none">Aucun identique</span>']);
  return { p: 'Quel hélicoptère est strictement identique au modèle ?', v: `<div class="model wide"><span class="eyebrow">Modèle</span>${heliSVG(base)}</div>`, ch, a: has ? ord.indexOf(0) : 5, lay: 'img', ex: has ? 'Compare un détail à la fois : nez, vitres, porte, train, queue, mât, antenne.' : 'Piège : aucun dessin n\'était identique au modèle.' };
};

/* ---------------- SECMA : Mémorisation ---------------- */
Gen.blob = seed => {
  let s = seed;
  const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  const n = 7 + Math.floor(rand() * 5), pts = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + rand() * 0.4, r = 22 + rand() * 24; pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r * (0.7 + rand() * 0.5)]); }
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).map(v => v.toFixed(1)).join(' ')}`;
  for (let i = 0; i < n; i++) { const p = pts[i], m = mid(p, pts[(i + 1) % n]); d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`; }
  return `<svg viewBox="0 0 100 100" class="blob" aria-hidden="true"><path d="${d} Z"/></svg>`;
};
Gen.memoPhase = (theme, count = 15) => {
  const names = R.sample(DATA.MEMO[theme], count);
  return names.map(n => ({ n, svg: Gen.blob(R.int(1, 2147483646)) }));
};
