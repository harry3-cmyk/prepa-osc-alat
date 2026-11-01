'use strict';
/* Variété supplémentaire : nouveaux modèles de problèmes, calcul mental élargi,
   anglais généré par règles, nouveaux formats de vocabulaire, culture générée à partir de tables. */

const W = {
  cap: s => s.charAt(0).toUpperCase() + s.slice(1),
  one: (...v) => R.pick(v),
  name: () => R.pick(['Hugo', 'Léa', 'Lucas', 'Inès', 'Nathan', 'Chloé', 'Adam', 'Manon', 'Théo', 'Sarah', 'Jules', 'Camille', 'Malik', 'Emma']),
  hm: v => { v = ((v % 1440) + 1440) % 1440; return `${Math.floor(v / 60)} h ${String(v % 60).padStart(2, '0')}`; },
  dur: t => t >= 60 ? `${Math.floor(t / 60)} h${t % 60 ? ' ' + String(t % 60).padStart(2, '0') : ''}` : `${t} min`
};
const ITEMS = ['un blouson', 'un sac à dos', 'une montre', 'une paire de rangers', 'un casque audio', 'une tente', 'une lampe frontale', 'un GPS de randonnée', 'une paire de jumelles'];
const VEH = [['Un hélicoptère', [120, 150, 180, 200, 240, 270, 300]], ['Un convoi', [40, 45, 50, 60, 70, 80, 90]], ['Un drone', [60, 80, 90, 100, 120, 150]], ['Un TGV', [180, 240, 270, 300, 320]], ['Un cycliste', [15, 18, 20, 24, 25, 30]], ['Un véhicule blindé', [30, 40, 50, 60, 70]]];
const TIMES = [10, 12, 15, 20, 24, 30, 36, 40, 45, 48, 50, 54, 72, 75, 80, 90, 100, 105, 120];
const signed = v => (v > 0 ? '+' : v < 0 ? '−' : '') + fr(Math.abs(v), 1);
const strQ = (p, good, bad, ex) => ({ str: true, p, good, bad: bad.filter(b => b !== good), ex });

/* ---------------- Mathématiques TAMI-C : modèles supplémentaires ---------------- */
MATHS_CSO.push(
  () => { const Pv = R.int(6, 60) * 5, r = R.pick([10, 15, 20, 25, 30, 40, 50]), a = Pv * (100 - r) / 100, it = R.pick(ITEMS), n = W.name();
    return { p: W.one(`Pendant les soldes, ${it} affiché ${Pv} € bénéficie de ${r} % de réduction. Combien le paie-t-on ?`, `${n} achète ${it} à ${Pv} € avec une remise de ${r} %. Combien paie ${n} ?`, `Un magasin baisse de ${r} % le prix d'${it}, qui coûtait ${Pv} €. Quel est le nouveau prix ?`), a, u: ' €', bad: [Pv * r / 100, Pv - r, Pv * (100 + r) / 100], ex: `${Pv} × ${fr(1 - r / 100)} = ${fr(a)} €` }; },
  () => { const r = R.pick([10, 20, 25, 40, 50]), Pv = R.int(3, 30) * 20, F = Pv * (100 - r) / 100, it = R.pick(ITEMS);
    return { p: W.one(`Après une remise de ${r} %, ${it} coûte ${F} €. Quel était son prix avant la remise ?`, `${W.name()} paie ${F} € pour ${it}, après une remise de ${r} %. Quel était le prix d'origine ?`, `Un article soldé à −${r} % est vendu ${F} €. Combien coûtait-il avant les soldes ?`), a: Pv, u: ' €', bad: [F * (1 + r / 100), F + r, Pv + 10], ex: `Prix initial = ${F} ÷ ${fr(1 - r / 100)} = ${Pv} €. Ajouter ${r} % au prix soldé ne redonne pas le prix de départ.` }; },
  () => { const ht = R.int(4, 80) * 5, ttc = ht * 1.2;
    return W.one(
      { p: `Un équipement coûte ${ht} € hors taxes. Avec une TVA de 20 %, quel est son prix TTC ?`, a: ttc, u: ' €', bad: [ht * 0.2, ht + 20, ht * 1.02], ex: `${ht} × 1,2 = ${fr(ttc)} €` },
      { p: `Un équipement coûte ${fr(ttc)} € TTC, TVA de 20 % comprise. Quel est son prix hors taxes ?`, a: ht, u: ' €', bad: [ttc * 0.8, ttc - 20, ht + 5], ex: `${fr(ttc)} ÷ 1,2 = ${ht} €. Retirer 20 % du prix TTC donne un résultat faux.` }); },
  () => { const A = R.int(2, 40) * 20, pct = R.pick([5, 10, 15, 20, 25, 30, 40, 50]), up = R.chance(0.5), B = A * (100 + (up ? pct : -pct)) / 100, s = up ? '+' : '−';
    const ctx = W.one(`Le prix d'un billet passe de ${A} € à ${B} €.`, `L'effectif d'une unité passe de ${A} à ${B} militaires.`, `Le nombre de candidats passe de ${A} à ${B} d'une année sur l'autre.`, `La consommation d'un véhicule passe de ${A} à ${B} litres par mois.`);
    return strQ(`${ctx} Quelle est l'évolution en pourcentage ?`, `${s}${pct} %`, [`${s}${pct + 5} %`, `${up ? '−' : '+'}${pct} %`, `${s}${fr(Math.abs(B - A) / B * 100, 1)} %`, `${s}${pct * 2} %`], `(${B} − ${A}) ÷ ${A} = ${s}${pct} %. On divise toujours par la valeur de départ.`); },
  () => { const [N, pct] = pickUntil(() => [R.pick([20, 25, 40, 50, 80, 200, 250, 400, 500]), R.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80])], ([N, p]) => (N * p) % 100 === 0); const k = N * pct / 100;
    return { p: W.one(`Sur ${N} candidats, ${k} sont retenus. Quel pourcentage de candidats est retenu ?`, `${W.name()} répond juste à ${k} questions sur ${N}. Quel est son pourcentage de réussite ?`, `${k} hélicoptères sur ${N} sont disponibles. Quel pourcentage cela représente-t-il ?`), a: pct, u: ' %', bad: [100 - pct, pct + 5, rnd(N / k, 1)], ex: `${k} ÷ ${N} × 100 = ${pct} %` }; },
  () => { const [veh, vs] = R.pick(VEH), [V, t] = pickUntil(() => [R.pick(vs), R.pick(TIMES)], ([V, t]) => (V * t) % 60 === 0), D = V * t / 60;
    return { p: W.one(`${veh} ${/hélicoptère|drone/.test(veh) ? 'vole' : 'roule'} à ${V} km/h pendant ${W.dur(t)}. Quelle distance parcourt-il ?`, `À ${V} km/h de moyenne, quelle distance couvre-t-on en ${W.dur(t)} ?`, `${veh} se déplace à ${V} km/h. Combien de kilomètres fait-il en ${W.dur(t)} ?`), a: D, u: ' km', bad: [V * t / 100, D * 2, D + V / 10], ex: `${V} × ${t}/60 = ${D} km` }; },
  () => { const [veh, vs] = R.pick(VEH), [V, t] = pickUntil(() => [R.pick(vs), R.pick(TIMES)], ([V, t]) => (V * t) % 60 === 0), D = V * t / 60;
    return { p: W.one(`${veh} parcourt ${D} km en ${W.dur(t)}. Quelle est sa vitesse moyenne ?`, `${D} km en ${W.dur(t)} : quelle vitesse moyenne en km/h ?`), a: V, u: ' km/h', bad: [rnd(D / t * 100, 1), V + 10, rnd(D * t / 60, 1)], ex: `${D} ÷ (${t}/60) = ${V} km/h` }; },
  () => { const [v1, v2] = [R.pick([40, 50, 60, 80, 90]), R.pick([60, 70, 80, 90, 100, 120])], t = pickUntil(() => R.pick([20, 30, 40, 45, 60, 90, 120]), t => ((v1 + v2) * t) % 60 === 0), D = (v1 + v2) * t / 60;
    return { p: W.one(`Deux convois distants de ${D} km roulent l'un vers l'autre, à ${v1} et ${v2} km/h. Au bout de combien de minutes se croisent-ils ?`, `${W.name()} part de A vers B à ${v1} km/h ; au même moment, ${W.name()} part de B vers A à ${v2} km/h. A et B sont distants de ${D} km. Dans combien de minutes se croisent-ils ?`), a: t, u: ' min', bad: [Math.round(D / Math.max(v1, v2) * 60), t * 2, t + 15], ex: `Ils se rapprochent à ${v1 + v2} km/h : ${D} ÷ ${v1 + v2} h = ${t} min` }; },
  () => { const [v1, dv, t] = pickUntil(() => [R.pick([40, 50, 60, 80]), R.pick([10, 20, 30, 40]), R.pick([15, 20, 30, 45, 60])], ([v1, dv, t]) => (v1 * t) % 60 === 0 && ((v1 * t / 60) * 60) % dv === 0); const lead = v1 * t / 60, T = lead * 60 / dv;
    return { p: `Un premier véhicule part à ${v1} km/h. ${t} minutes plus tard, un second part du même point à ${v1 + dv} km/h. Combien de minutes faut-il au second pour rattraper le premier ?`, a: T, u: ' min', bad: [t, Math.round(lead / (v1 + dv) * 60), T + t], ex: `Avance du premier : ${lead} km. Écart de vitesse : ${dv} km/h. ${lead} ÷ ${dv} h = ${T} min` }; },
  () => { const c = R.pick([6, 8, 10, 12, 15, 25, 30, 35, 40]), D = R.int(3, 16) * 50, a = c * D / 100;
    return { p: W.one(`Un véhicule consomme ${c} L aux 100 km. Combien de litres lui faut-il pour ${D} km ?`, `Avec une consommation de ${c} litres pour 100 km, combien consomme-t-on sur ${D} km ?`), a, u: ' L', bad: [c * D / 10, rnd(D / c, 1), a + c], ex: `${c} × ${D} / 100 = ${fr(a)} L` }; },
  () => { const [n, d, m] = pickUntil(() => [R.pick([20, 30, 40, 60, 80, 120]), R.pick([6, 8, 10, 12, 15, 20]), R.pick([15, 20, 24, 30, 40, 48, 60, 80, 100])], ([n, d, m]) => m !== n && (n * d) % m === 0); const a = n * d / m;
    return { p: W.one(`Une réserve de vivres permet de nourrir ${n} soldats pendant ${d} jours. Pendant combien de jours nourrira-t-elle ${m} soldats ?`, `${n} rations par jour suffisent pour ${d} jours. Combien de jours tiendra le stock à raison de ${m} rations par jour ?`), a, u: ' jours', bad: [d * m / n, d + (n - m) / 10, a + 2], ex: `${n} × ${d} = ${n * d} rations, ÷ ${m} = ${fr(a)} jours` }; },
  () => { const [t1, t2] = R.pick([[6, 3], [12, 6], [4, 12], [10, 15], [20, 30], [6, 12], [3, 6], [12, 4], [2, 6], [30, 60]]), a = t1 * t2 / (t1 + t2);
    return { p: W.one(`Une équipe nettoie un hangar en ${t1} h, une autre en ${t2} h. En combien d'heures le nettoient-elles ensemble ?`, `Un premier camion-citerne remplit une cuve en ${t1} h, un second en ${t2} h. Ensemble, combien d'heures faut-il ?`), a, u: ' h', bad: [(t1 + t2) / 2, Math.abs(t1 - t2), t1 + t2], ex: `1/${t1} + 1/${t2} = 1/${a} : ${fr(a)} h` }; },
  () => { const q = R.pick([3, 4, 5, 6, 8, 10]), p = pickUntil(() => R.int(1, q - 1), p => gcd(p, q) === 1), N = q * R.int(4, 30), a = p * N / q;
    return { p: W.one(`Combien valent les ${p}/${q} de ${N} ?`, `Un régiment compte ${N} militaires, dont ${p}/${q} sont en exercice. Combien de militaires sont en exercice ?`), a, bad: [N / p * q, N - a, a + q], ex: `${N} ÷ ${q} × ${p} = ${a}` }; },
  () => { const m = R.pick([3, 4, 5, 6]), n = R.pick([2, 3, 4, 5]), good = frac((m - 1) * (n - 1), m * n);
    const ctx = W.one(`${W.name()} dépense 1/${m} de son salaire pour le loyer, puis 1/${n} de ce qui reste pour les courses.`, `Un hélicoptère consomme 1/${m} de son carburant à l'aller, puis 1/${n} de ce qui reste au retour.`);
    return strQ(`${ctx} Quelle fraction du total reste-t-il ?`, good, [frac(Math.max(1, m * n - m - n), m * n), frac(1, m * n), frac(m - 1, m), frac(n - 1, n * m)], `1 − 1/${m} = ${frac(m - 1, m)}, puis × (1 − 1/${n}) = ${good}`); },
  () => { const notes = [R.int(6, 18), R.int(6, 18), R.int(6, 18)], co = [R.int(1, 4), R.int(1, 4), R.int(1, 4)], sc = co.reduce((a, b) => a + b, 0), sum = notes.reduce((a, n, i) => a + n * co[i], 0), a = rnd(sum / sc, 2);
    return { p: `Notes : ${notes[0]} (coefficient ${co[0]}), ${notes[1]} (coefficient ${co[1]}) et ${notes[2]} (coefficient ${co[2]}). Quelle est la moyenne ?`, a, bad: [rnd(avg(notes), 2), rnd(sum / 3, 2), rnd(a + 1, 2)], dec: 2, ex: `${sum} points ÷ ${sc} coefficients = ${fr(a)}` }; },
  () => { const fils = R.int(5, 20), D = R.int(22, 35), S = 2 * fils + D;
    return { p: `La somme des âges d'un père et de son fils vaut ${S} ans. Le père a ${D} ans de plus que son fils. Quel âge a le fils ?`, a: fils, u: ' ans', bad: [fils + D, Math.round(S / 2), S - D], ex: `(${S} − ${D}) ÷ 2 = ${fils} ans` }; },
  () => { const y = R.int(5, 60), x = y + R.int(3, 40), S = x + y, D = x - y;
    return { p: W.one(`La somme de deux nombres vaut ${S} et leur différence ${D}. Quel est le plus grand ?`, `Deux équipes comptent ${S} soldats au total ; la première a ${D} soldats de plus que la seconde. Combien en a la première ?`), a: x, bad: [y, Math.round(S / 2), S - D], ex: `(${S} + ${D}) ÷ 2 = ${x}` }; },
  () => { const n = R.int(10, 90), big = R.chance(0.5), S = 3 * n + 3;
    return { p: `La somme de trois nombres entiers consécutifs vaut ${S}. Quel est le ${big ? 'plus grand' : 'plus petit'} ?`, a: big ? n + 2 : n, bad: [n + 1, big ? n : n + 2, Math.round(S / 3) + 3], ex: `${S} ÷ 3 = ${n + 1} (le nombre du milieu)` }; },
  () => { const [C, t] = pickUntil(() => [R.pick([120, 150, 180, 200, 240, 300, 360]), R.pick([20, 30, 40, 45, 50, 75, 90, 100, 150])], ([C, t]) => (C * t) % 60 === 0), a = C * t / 60;
    return { p: `Un hélicoptère consomme ${C} litres par heure. Combien de litres lui faut-il pour un vol de ${W.dur(t)} ?`, a, u: ' L', bad: [C * t / 100, a + C / 2, C + t], ex: `${C} × ${t}/60 = ${a} L` }; },
  () => { const E = R.pick([25000, 50000, 100000, 200000]), d = R.int(2, 14), km = d * E / 100000;
    return { p: `Sur une carte au 1/${E.toLocaleString('fr-FR')}, quelle longueur (en cm) représente une distance réelle de ${fr(km)} km ?`, a: d, u: ' cm', bad: [d * 10, rnd(d / 10, 2), d + 2], ex: `${fr(km)} km = ${(km * 100000).toLocaleString('fr-FR')} cm, ÷ ${E.toLocaleString('fr-FR')} = ${d} cm` }; },
  () => { const L = R.int(8, 40), l = R.int(3, L - 1), P2 = 2 * (L + l);
    return { p: `Un terrain rectangulaire a un périmètre de ${P2} m et une longueur de ${L} m. Quelle est son aire ?`, a: L * l, u: ' m²', bad: [L * (P2 / 2), L * (P2 - L), (L + l) * 2], ex: `Largeur = ${P2}/2 − ${L} = ${l} m, aire = ${L} × ${l} = ${L * l} m²` }; },
  () => { const arr = R.int(8 * 60, 22 * 60), dur = R.int(25, 170), dep = arr - dur;
    return strQ(`Un hélicoptère se pose à ${W.hm(arr)} après un vol de ${W.dur(dur)}. À quelle heure a-t-il décollé ?`, W.hm(dep), [W.hm(dep + 10), W.hm(dep - 10), W.hm(arr + dur), W.hm(dep + 60)], `${W.hm(arr)} − ${W.dur(dur)} = ${W.hm(dep)}`); },
  () => { const dep = R.int(6 * 60, 20 * 60), d = R.int(35, 200), arr = dep + d;
    return strQ(`Départ à ${W.hm(dep)}, arrivée à ${W.hm(arr)}. Combien de temps a duré le trajet ?`, W.dur(d), [W.dur(d + 10), W.dur(Math.max(5, d - 10)), W.dur(d + 40), W.dur(d + 60)], `De ${W.hm(dep)} à ${W.hm(arr)} : ${W.dur(d)}`); },
  () => { const [a, b] = R.sample([1, 2, 3, 4, 5], 2), u = R.int(2, 15) * 10, S = (a + b) * u, big = Math.max(a, b) * u;
    return { p: `On partage ${S} € entre deux personnes, proportionnellement à ${a} et ${b}. Combien reçoit celle qui a la plus grosse part ?`, a: big, u: ' €', bad: [S / 2, Math.min(a, b) * u, S - u], ex: `${S} ÷ (${a} + ${b}) = ${u} € par part, × ${Math.max(a, b)} = ${big} €` }; },
  () => { const [x, y, pa, pb] = pickUntil(() => [R.int(1, 4), R.int(1, 4), R.int(2, 12), R.int(2, 12)], ([x, y, a, b]) => a !== b && (x * a + y * b) % (x + y) === 0), m = (x * pa + y * pb) / (x + y);
    return { p: `On mélange ${x} kg d'un produit à ${pa} €/kg avec ${y} kg d'un produit à ${pb} €/kg. Quel est le prix moyen du kilo ?`, a: m, u: ' €/kg', bad: [(pa + pb) / 2, x * pa + y * pb, m + 1], ex: `(${x}×${pa} + ${y}×${pb}) ÷ ${x + y} = ${fr(m)} €/kg` }; },
  () => { const [C, d, Rv] = pickUntil(() => [R.int(4, 20) * 50, R.pick([5, 10, 15, 20, 25]), R.int(1, 10) * 25], ([C, d, Rv]) => Rv < C && (C - Rv) % d === 0); const a = (C - Rv) / d;
    return { p: `Une cuve contient ${C} L et perd ${d} L par minute. Au bout de combien de minutes ne reste-t-il que ${Rv} L ?`, a, u: ' min', bad: [C / d, Rv / d, a + 5], ex: `(${C} − ${Rv}) ÷ ${d} = ${a} min` }; },
  () => { const [k, n, t, k2, t2] = pickUntil(() => [R.pick([2, 3, 4, 5, 6]), R.pick([2, 3, 4, 6, 8, 10]), R.pick([10, 15, 20, 30]), R.pick([2, 3, 4, 6, 8, 10, 12]), R.pick([20, 30, 40, 45, 60, 90])], ([k, n, t, k2, t2]) => (n * k2 * t2) % (k * t) === 0 && k2 !== k); const a = n * k2 * t2 / (k * t);
    return { p: `${k} soldats montent ${n} tentes en ${t} minutes. Combien de tentes ${k2} soldats monteront-ils en ${W.dur(t2)} au même rythme ?`, a, u: ' tentes', bad: [n * k2 / k, n * t2 / t, a + n], ex: `Un soldat monte ${fr(n / k, 2)} tente en ${t} min. ${n} × (${k2}/${k}) × (${t2}/${t}) = ${a}` }; }
);

/* ---------------- Mathématiques SECMA : calculs et problèmes supplémentaires ---------------- */
CALC_T.push(
  () => { const x = R.int(101, 989); return { p: `Combien faut-il ajouter à ${x} pour obtenir 1 000 ?`, a: 1000 - x, bad: [1000 - x + 10, 900 - x + 100 - 1, 1000 - x - 10] }; },
  () => { const p = R.pick([10, 20, 25, 50, 75, 40]), N = R.int(2, 30) * 20, v = N * p / 100; return { p: `${p} % d'un nombre valent ${v}. Quel est ce nombre ?`, a: N, bad: [v * p / 100, v + p, N / 2], ex: `${v} ÷ ${p} × 100 = ${N}` }; },
  () => { const b = R.int(3, 8), a = R.int(1, b - 1), d = R.int(3, 8), c = R.int(1, d - 1), g = frac(a * d, b * c);
    return strQ(`${a}/${b} ÷ ${c}/${d} = ?`, g, [frac(a * c, b * d), frac(b * c, a * d), frac(a * d + 1, b * c)], `Diviser par une fraction, c'est multiplier par son inverse : ${a}/${b} × ${d}/${c}`); },
  () => { const nums = pickUntil(() => [R.int(8, 60), R.int(8, 60), R.int(8, 60), R.int(8, 60)], v => v.reduce((a, b) => a + b, 0) % 4 === 0), m = nums.reduce((a, b) => a + b, 0) / 4;
    return { p: `Moyenne de ${nums.join(', ')} ?`, a: m, bad: [m + 1, m - 2, m + 4], ex: `${nums.reduce((a, b) => a + b, 0)} ÷ 4 = ${m}` }; },
  () => { const a = R.int(11, 99), b = R.int(11, 99), v = a * b, mag = 10 ** Math.round(Math.log10(v)), opts = [mag / 100, mag / 10, mag, mag * 10, mag * 100].filter(x => x >= 1);
    return strQ(`Ordre de grandeur de ${a} × ${b} ?`, mag.toLocaleString('fr-FR'), opts.filter(x => x !== mag).map(x => x.toLocaleString('fr-FR')), `${a} × ${b} = ${v.toLocaleString('fr-FR')}, proche de ${mag.toLocaleString('fr-FR')}`); },
  () => { const m = R.int(1, 9), s = R.int(5, 55); return { p: `${m} min ${s} s = ? s`, a: m * 60 + s, u: ' s', bad: [m * 100 + s, m * 60 + s + 60, m * 60], ex: `${m} × 60 + ${s} = ${m * 60 + s} s` }; },
  () => { const [d, f] = R.pick([['0,375', '3/8'], ['0,125', '1/8'], ['0,75', '3/4'], ['0,6', '3/5'], ['0,2', '1/5'], ['0,875', '7/8'], ['0,4', '2/5'], ['0,625', '5/8'], ['0,05', '1/20'], ['0,25', '1/4']]);
    return strQ(`${d} = ?`, f, R.sample(['3/8', '1/8', '3/4', '3/5', '1/5', '7/8', '2/5', '5/8', '1/20', '1/4', '1/3', '2/3'].filter(x => x !== f), 3), `${f} = ${d}`); },
  () => { const k = R.pick([10, 20, 50, 100, 150, 200]); return { p: `${k} NM ≈ ? km`, a: Math.round(k * 1.852), u: ' km', bad: [Math.round(k * 1.609), Math.round(k / 1.852), k * 2], ex: `1 NM = 1,852 km` }; }
);
PROB_T.push(
  () => { const V = R.int(10, 120) * 5, kg = R.chance(0.5);
    return kg ? { p: `Un réservoir contient ${V} L de carburant de densité 0,8. Quelle masse de carburant cela représente-t-il ?`, a: V * 0.8, u: ' kg', bad: [V / 0.8, V * 0.2, V - 8], ex: `${V} × 0,8 = ${fr(V * 0.8)} kg` }
      : { p: `Il faut ${(V * 4).toLocaleString('fr-FR')} kg de carburant de densité 0,8. Combien de litres cela fait-il ?`, a: V * 5, u: ' L', bad: [V * 4 * 0.8, V * 4 + 80, V * 4], ex: `${(V * 4).toLocaleString('fr-FR')} ÷ 0,8 = ${(V * 5).toLocaleString('fr-FR')} L` }; },
  () => { const vz = R.pick([300, 400, 500, 600, 800, 1000]), h2 = R.pick([500, 1000, 1500]), dh = vz * R.int(2, 8), h1 = h2 + dh;
    return { p: `Un hélicoptère descend de ${h1.toLocaleString('fr-FR')} ft à ${h2.toLocaleString('fr-FR')} ft à ${vz} ft/min. Combien de minutes dure la descente ?`, a: dh / vz, u: ' min', bad: [h1 / vz, dh / vz + 2, Math.round(h2 / vz)], ex: `(${h1} − ${h2}) ÷ ${vz} = ${dh / vz} min` }; },
  () => { const tas = R.pick([90, 100, 120, 150]), w = R.pick([10, 20, 30]), gs = tas + w, t = pickUntil(() => R.pick([20, 30, 40, 45, 60, 90]), t => (gs * t) % 60 === 0), D = gs * t / 60;
    return { p: `Vitesse propre ${tas} kt avec ${w} kt de vent arrière. Combien de minutes pour parcourir ${D} NM ?`, a: t, u: ' min', bad: [Math.round(D / tas * 60), Math.round(D / (tas - w) * 60), t + 10], ex: `Vitesse sol = ${tas} + ${w} = ${gs} kt. ${D} ÷ ${gs} h = ${t} min` }; },
  () => { const [c, V, D] = pickUntil(() => [R.pick([200, 240, 300, 360, 400]), R.pick([100, 120, 150]), R.pick([50, 75, 100, 150, 200, 250, 300])], ([c, V, D]) => (c * D) % V === 0), a = c * D / V;
    return { p: `Un hélicoptère consomme ${c} kg de carburant par heure et vole à ${V} kt. Combien de carburant lui faut-il pour ${D} NM ?`, a, u: ' kg', bad: [c * D / 100, rnd(c / V * 60, 1), a + c / 2], ex: `Durée = ${D}/${V} h, × ${c} kg/h = ${fr(a)} kg` }; },
  () => { const p = R.pick([2, 3, 4, 5, 6, 8, 10]), d = R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4]); return { p: `Une route monte de ${p} % sur ${fr(d)} km. Quel dénivelé gagne-t-on ?`, a: p * d * 10, u: ' m', bad: [p * d, p * d * 100, p * d * 10 + 50], ex: `${p} % de ${fr(d * 1000)} m = ${fr(p * d * 10)} m` }; }
);

/* ---------------- Calcul mental : plus de familles de calculs ---------------- */
const MENTAL = [
  () => { const a = R.int(12, 89), b = R.int(12, 89); return { p: `${a} + ${b}`, a: a + b }; },
  () => { const a = R.int(30, 150), b = R.int(11, a - 1); return { p: `${a} − ${b}`, a: a - b }; },
  () => { const a = R.int(3, 12), b = R.int(3, 12); return { p: `${a} × ${b}`, a: a * b }; },
  () => { const a = R.int(11, 29), b = R.int(2, 9); return { p: `${a} × ${b}`, a: a * b }; },
  () => { const b = R.int(3, 12), r = R.int(3, 15); return { p: `${b * r} ÷ ${b}`, a: r }; },
  () => { const x = R.int(11, 89); return { p: `100 − ${x}`, a: 100 - x }; },
  () => { const x = R.int(12, 98); return { p: `${x} × 5`, a: x * 5 }; },
  () => { const x = R.int(2, 24) * 4; return { p: `${x} × 25`, a: x * 25 }; },
  () => { const x = R.int(12, 90); return { p: `${x} × 11`, a: x * 11 }; },
  () => { const x = R.int(11, 25); return { p: `${x}²`, a: x * x }; },
  () => { const x = R.int(26, 499); return { p: `2 × ${x}`, a: 2 * x }; },
  () => { const x = R.int(26, 499) * 2; return { p: `${x} ÷ 2`, a: x / 2 }; },
  () => { const x = R.int(3, 90) * 10; return { p: `10 % de ${x}`, a: x / 10 }; },
  () => { const x = R.int(2, 40) * 4; return { p: `25 % de ${x}`, a: x / 4 }; },
  () => { const x = R.int(2, 40) * 5; return { p: `20 % de ${x}`, a: x / 5 }; },
  () => { const x = R.int(11, 99); return { p: `${x} × 9`, a: x * 9 }; },
  () => { const a = R.int(101, 899), b = R.int(11, 99); return { p: `${a} + ${b}`, a: a + b }; }
];
Gen.mental = () => R.pick(MENTAL)();

/* ---------------- Verbal : nouveaux formats à partir des mêmes listes ---------------- */
DATA.ORTHO = lines(`
Accueil|Acceuil|Accueuil|Acueil
Apercevoir|Appercevoir|Apersevoir|Aperçevoir
Développer|Dévelloper|Développper|Devellopper
Rationnel|Rationel|Rasionnel|Rationnell
Aéroport|Aéreport|Aérroport|Aréoport
Hélicoptère|Hélicoptaire|Hélicopter|Hélikoptère
Parachute|Parrachute|Parachutte|Parachut
Abréviation|Abbréviation|Abréviasion|Abrévation
Bizarre|Bizzare|Bizare|Bizzarre
Connexion|Connection|Conexion|Connextion
Dilemme|Dilemne|Dillemme|Dilème
Exigence|Exigeance|Éxigence|Exigense
Langage|Language|Langague|Languaje
Occurrence|Occurence|Ocurrence|Occurrance
Rythme|Rhythme|Rytme|Ryhtme
Professionnel|Profesionnel|Professionel|Proffessionnel
Personnel|Personel|Perssonnel|Personnell
Néanmoins|Néamoins|Néanmoin|Nénmoins
Malgré|Malgrés|Mallgré|Malgret
Pilote|Pillote|Pilotte|Pillotte
Aérien|Aréien|Aérrien|Aéryen
Atterrissage|Aterrissage|Atterissage|Aterisage
Appareil|Apareil|Apparreil|Appareuil
Mécanique|Mécannique|Méccanique|Mékanique
Chronomètre|Cronomètre|Chronomètrre|Chronométre
Physique|Phisique|Fysique|Physiqe
Psychologue|Psycologue|Psychologe|Phsychologue
Commission|Comission|Commision|Comision
Adresse|Addresse|Adrese|Addrese
Dommage|Domage|Dommmage|Domaje
Courrier|Courier|Couurier|Courrié
Rigueur|Rigeur|Riggueur|Rigeure
Ascenseur|Assenceur|Ascenceur|Assenseur
Exceptionnel|Exeptionnel|Exceptionel|Excepsionnel
Tranquille|Tranquile|Trenquille|Tranquil
Succès|Sucès|Succé|Sucsès
Effectif|Efectif|Effectiff|Éffectif
Cauchemar|Cauchemard|Cochemar|Cauchemare
Carrosserie|Carroserie|Carosserie|Carrosseri
Pharmacie|Farmacie|Pharmatie|Pharmasie
`);
const VB = {
  syn: () => parseEq(R.pick(DATA.SYN)), ant: () => parseEq(R.pick(DATA.ANT)), def: () => parseEq(R.pick(DATA.DEF)),
  q: s => `« ${esc(s)} »`
};
const VERBAL_F = [
  [14, () => { const [w, g, ...b] = VB.syn(); return mkQ(W.one(`Synonyme de <b>${esc(w)}</b>`, `Quel mot a le même sens que <b>${esc(w)}</b> ?`, `<b>${esc(w)}</b> veut dire à peu près…`), g, b); }],
  [9, () => { const [w, g, ...b] = VB.syn(); return mkQ(`Quel mot a le même sens que <b>${esc(g)}</b> ?`, w, b, { ex: `${w} = ${g}` }); }],
  [7, () => { const it = [VB.syn(), VB.syn(), VB.syn(), VB.syn()]; if (new Set(it.map(x => x[0])).size < 4) return VERBAL_F[0][1](); const [w, g] = it[0];
    return mkQ('Quelle paire est formée de deux <b>synonymes</b> ?', `${w} – ${g}`, it.slice(1).map(([x, , ...b]) => `${x} – ${R.pick(b)}`), { ex: `${w} et ${g} ont le même sens.` }); }],
  [12, () => { const [w, g, ...b] = VB.ant(); return mkQ(W.one(`Contraire de <b>${esc(w)}</b>`, `Quel mot a le sens opposé de <b>${esc(w)}</b> ?`, `Antonyme de <b>${esc(w)}</b>`), g, b); }],
  [6, () => { const it = [VB.ant(), VB.ant(), VB.ant(), VB.ant()]; if (new Set(it.map(x => x[0])).size < 4) return VERBAL_F[3][1](); const [w, g] = it[0];
    return mkQ('Quelle paire est formée de deux mots de sens <b>contraire</b> ?', `${w} – ${g}`, it.slice(1).map(([x, , ...b]) => `${x} – ${b[0]}`), { ex: `${w} et ${g} sont des contraires.` }); }],
  [8, () => { let m, t; do { m = VB.ant(); t = VB.ant(); } while (m[0] === t[0]); const [w, g, ...b] = t;
    return mkQ(`${VB.q(m[0])} est à ${VB.q(m[1])} ce que ${VB.q(w)} est à…`, g, b, { ex: `Relation de contraires : ${m[0]} / ${m[1]}, donc ${w} / ${g}.` }); }],
  [5, () => { let m, t; do { m = VB.syn(); t = VB.syn(); } while (m[0] === t[0]); const [w, g, ...b] = t;
    return mkQ(`${VB.q(m[0])} est à ${VB.q(m[1])} ce que ${VB.q(w)} est à…`, g, b, { ex: `Relation de synonymes : ${m[0]} / ${m[1]}, donc ${w} / ${g}.` }); }],
  [13, () => { const [g, ...rest] = R.pick(DATA.INTR).split('|'); const why = rest.pop(); return mkQ(W.one('Quel mot est l\'intrus ?', 'Quel mot n\'appartient pas à la même série ?', 'Trouve l\'intrus'), g, rest, { ex: why }); }],
  [8, () => { const [d, g, ...b] = VB.def(); return mkQ(`<i>${esc(d)}</i>`, g, b, { ex: `${g} : ${d.toLowerCase()}.` }); }],
  [6, () => { const all = DATA.DEF.map(parseEq), it = R.pick(all), others = R.sample(all.filter(x => x[1] !== it[1]), 3);
    return mkQ(`Que signifie <b>${esc(it[1])}</b> ?`, it[0], others.map(o => o[0]), { ex: `${it[1]} : ${it[0].toLowerCase()}.` }); }],
  [8, () => { const [g, ...b] = R.pick(DATA.ORTHO).split('|'); return mkQ('Quel mot est correctement orthographié ?', g, b); }]
];
const VERBAL_W = VERBAL_F.reduce((a, [w]) => a + w, 0);
Gen.verbal = () => { let r = Math.random() * VERBAL_W; for (const [w, f] of VERBAL_F) { if ((r -= w) < 0) return f(); } return VERBAL_F[0][1](); };

/* ---------------- Anglais : phrases générées par règle de grammaire ---------------- */
const EN = {
  s3: ['The pilot', 'My instructor', 'The captain', 'Our mechanic', 'The new recruit', 'My sister', 'The colonel', 'The navigator', 'Tom', 'Sarah', 'The doctor', 'My brother'],
  pl: ['The pilots', 'My friends', 'The soldiers', 'The cadets', 'Our instructors', 'The mechanics', 'We', 'They'],
  v: [['check', 'checks', 'checked', 'checked', 'checking', 'the engine'], ['clean', 'cleans', 'cleaned', 'cleaned', 'cleaning', 'the cockpit'], ['study', 'studies', 'studied', 'studied', 'studying', 'the map'],
    ['fly', 'flies', 'flew', 'flown', 'flying', 'the Gazelle'], ['write', 'writes', 'wrote', 'written', 'writing', 'a report'], ['read', 'reads', 'read', 'read', 'reading', 'the weather forecast'],
    ['drive', 'drives', 'drove', 'driven', 'driving', 'the truck'], ['prepare', 'prepares', 'prepared', 'prepared', 'preparing', 'the briefing'], ['repair', 'repairs', 'repaired', 'repaired', 'repairing', 'the radio'],
    ['teach', 'teaches', 'taught', 'taught', 'teaching', 'the new cadets'], ['buy', 'buys', 'bought', 'bought', 'buying', 'fresh bread'], ['take', 'takes', 'took', 'taken', 'taking', 'the bus'],
    ['send', 'sends', 'sent', 'sent', 'sending', 'an email to the base'], ['run', 'runs', 'ran', 'run', 'running', 'five kilometres'], ['eat', 'eats', 'ate', 'eaten', 'eating', 'breakfast'], ['watch', 'watches', 'watched', 'watched', 'watching', 'the news']],
  lc: s => /^(The|My|Our|We|They) /.test(s + ' ') ? s.charAt(0).toLowerCase() + s.slice(1) : s,
  short: [['fast', 'faster', 'fastest'], ['quick', 'quicker', 'quickest'], ['big', 'bigger', 'biggest'], ['heavy', 'heavier', 'heaviest'], ['small', 'smaller', 'smallest'], ['old', 'older', 'oldest'], ['light', 'lighter', 'lightest'], ['cheap', 'cheaper', 'cheapest'], ['noisy', 'noisier', 'noisiest'], ['safe', 'safer', 'safest'], ['good', 'better', 'best'], ['bad', 'worse', 'worst'], ['long', 'longer', 'longest'], ['short', 'shorter', 'shortest'], ['easy', 'easier', 'easiest']],
  long: ['expensive', 'powerful', 'comfortable', 'reliable', 'modern', 'dangerous', 'difficult', 'important', 'interesting', 'beautiful']
};
const enAdj = a => EN.short.find(x => x[0] === a);
const enComp = a => { const s = enAdj(a); if (!s) return [`more ${a}`, [`${a.endsWith('e') ? a + 'r' : a + 'er'}`, `most ${a}`, `the more ${a}`]];
  if (a === 'good') return ['better', ['more good', 'best', 'gooder']]; if (a === 'bad') return ['worse', ['more bad', 'worst', 'badder']];
  return [s[1], [`more ${a}`, s[2], `more ${s[1]}`]]; };
const enSup = a => { const s = enAdj(a); if (!s) return [`most ${a}`, [`more ${a}`, a.endsWith('e') ? a + 'st' : a + 'est', `the most ${a}`]];
  if (a === 'good') return ['best', ['better', 'most good', 'goodest']]; if (a === 'bad') return ['worst', ['worse', 'most bad', 'baddest']];
  return [s[2], [s[1], `most ${a}`, `more ${s[2]}`]]; };
const EN_T = [
  () => { const [b, s, , , ing, o] = R.pick(EN.v); return [`${R.pick(EN.s3)} ___ ${o} ${R.pick(['every morning', 'every day', 'every week', 'on Mondays', 'twice a week'])}.`, s, [b, ing, 'to ' + b], 'Habitude au présent simple : -s à la 3e personne du singulier.']; },
  () => { const [b, s, , , ing, o] = R.pick(EN.v), pl = R.chance(0.4), S = pl ? R.pick(EN.pl) : R.pick(EN.s3), lead = R.pick(['Right now,', 'At the moment,', 'Look!', 'Listen!']);
    const subj = lead.endsWith(',') ? EN.lc(S) : S;
    return [`${lead} ${subj} ___ ${o}.`, (pl ? 'are ' : 'is ') + ing, pl ? ['is ' + ing, b, 'am ' + ing] : [s, 'are ' + ing, 'be ' + ing], 'Action en cours : be + -ing (present continuous).']; },
  () => { const [b, s, past, pp, ing, o] = R.pick(EN.v.filter(x => x[0] !== x[2])), when = R.pick(['yesterday', 'last night', 'last week', 'two days ago', 'in 2019', 'last Monday']);
    return [`${R.pick(EN.s3)} ___ ${o} ${when}.`, past, ['has ' + pp, s, 'is ' + ing], `Moment passé et terminé (${when}) : prétérit.`]; },
  () => { const point = R.chance(0.5), tm = point ? R.pick(['2019', '2021', 'last summer', 'January', 'Monday', 'the start of the course', 'last year']) : R.pick(['three years', 'two months', 'a long time', 'ten days', 'six weeks', 'five hours', 'ages']);
    return [`${R.pick(EN.s3)} has ${R.pick(['lived in Pau', 'worked at the base', 'known the instructor', 'been a pilot', 'studied English', 'served in the army', 'trained in Dax'])} ___ ${tm}.`, point ? 'since' : 'for', [point ? 'for' : 'since', 'during', 'from'], point ? 'since + point de départ (date, moment).' : 'for + durée.']; },
  () => R.pick([
    () => [`Have you ___ ${R.pick(['flown in a helicopter', 'been to Canada', 'seen a Tiger up close', 'met the colonel', 'driven a truck'])}?`, 'ever', ['yet', 'ago', 'still'], 'ever = déjà, au moins une fois (dans une question).'],
    () => { const [, , , pp, , o] = R.pick(EN.v); return [`I haven't ${pp} ${o} ___.`, 'yet', ['ago', 'just', 'still'], 'yet en fin de phrase négative = pas encore.']; },
    () => { const [, , , pp, , o] = R.pick(EN.v); return [`${R.pick(EN.s3)} has ___ ${pp} ${o}: it's finished now.`, 'just', ['yet', 'ever', 'ago'], 'just = à l\'instant (present perfect).']; }
  ])(),
  () => { const veh = R.chance(0.6), [A, B] = veh ? R.pick([['This helicopter', 'that one'], ['The new radio', 'the old one'], ['This truck', 'the other one'], ['My new phone', 'my old one'], ['The blue car', 'the red one']]) : R.pick([["Today's mission", "yesterday's"], ['This test', 'the previous one'], ['The second route', 'the first one']]);
    const adj = veh ? R.pick(['fast', 'big', 'heavy', 'small', 'old', 'light', 'cheap', 'noisy', 'safe', 'good', 'bad', 'expensive', 'powerful', 'comfortable', 'reliable', 'modern']) : R.pick(['long', 'short', 'easy', 'good', 'bad', 'difficult', 'dangerous', 'important', 'interesting']);
    const [g, b] = enComp(adj); return [`${A} is ___ than ${B}.`, g, b, enAdj(adj) ? 'Adjectif court : -er + than.' : 'Adjectif long : more + adjectif + than.']; },
  () => { const [n, pp, adjs] = R.pick([['flight', 'made', ['long', 'easy', 'difficult', 'dangerous', 'interesting']], ['test', 'taken', ['easy', 'difficult', 'long', 'important', 'short']], ['view', 'seen', ['beautiful', 'good', 'bad']], ['helicopter', 'flown', ['fast', 'powerful', 'modern', 'old', 'noisy', 'good']], ['book', 'read', ['interesting', 'good', 'long', 'bad']]]);
    const adj = R.pick(adjs), [g, b] = enSup(adj); return [`It's the ___ ${n} I have ever ${pp}.`, g, b, enAdj(adj) ? 'Superlatif court : the + -est.' : 'Superlatif long : the most + adjectif.']; },
  () => R.pick([
    () => { const [g, w] = R.pick([['rains', 'rain'], ['snows', 'snow']]); return [`If it ___ tomorrow, ${R.pick(["we'll cancel the flight", 'the exercise will be postponed', "we'll stay at the base"])}.`, g, [`will ${w}`, `${w}ed`, `would ${w}`], 'Condition réelle : If + présent, will + verbe.']; },
    () => [`If the weather ___ bad, ${R.pick(["we won't take off", 'the training will stop', "we'll fly tomorrow"])}.`, 'is', ['will be', 'was', 'would be'], 'If + présent, will + verbe.'],
    () => [`If you ___ hard, you will pass the ${R.pick(['tests', 'selection', 'exam'])}.`, 'work', ['will work', 'worked', 'would work'], 'If + présent, will + verbe.']
  ])(),
  () => R.pick([
    () => [`If I ___ more time, I would ${R.pick(['learn to fly', 'travel more', 'train every day', 'read more books'])}.`, 'had', ['have', 'will have', 'would have'], 'Hypothèse : If + prétérit, would + verbe.'],
    () => [`If I ___ you, I would ${R.pick(['accept the offer', 'ask the instructor', 'go to bed early', 'study the map again'])}.`, 'were', ['am', 'will be', 'would be'], 'If I were you : conseil (prétérit de be).'],
    () => [`If ${R.pick(['she', 'he', 'my friend'])} ___ the answer, ${R.pick(['she', 'he'])} would tell us.`, 'knew', ['knows', 'will know', 'would know'], 'Hypothèse : If + prétérit, would + verbe.']
  ])(),
  () => { const [c1, c2, g, b] = R.pick([['we had left earlier', 'we ___ the train', 'would have caught', ['would catch', 'will catch', 'had caught']], ['she had studied more', 'she ___ the exam', 'would have passed', ['would pass', 'will pass', 'had passed']], ['the weather had been better', 'we ___ on time', 'would have landed', ['would land', 'will land', 'had landed']], ['you had asked me', 'I ___ you', 'would have helped', ['would help', 'will help', 'had helped']], ['he had checked the fuel', 'he ___ the mission', 'would have completed', ['would complete', 'will complete', 'had completed']]]);
    return [`If ${c1}, ${c2}.`, g, b, 'Regret sur le passé : If + had + participe, would have + participe.']; },
  () => R.chance(0.5) ? [`You ___ ${R.pick(['smoke on board', 'use your phone during the test', 'talk to other candidates during the exam', 'enter the hangar without a badge', 'touch the controls before the briefing'])}. It's forbidden.`, "mustn't", ["don't have to", "needn't", "haven't to"], "mustn't = interdiction."]
    : [`You ___ ${R.pick(['wear a tie', 'bring your own headset', 'stay after the briefing', 'come on Saturday', 'take notes'])}: it's optional.`, "don't have to", ["mustn't", "can't", "shouldn't to"], "don't have to = ce n'est pas obligatoire."],
  () => { const [o, base, pp] = R.pick([['engine', 'check', 'checked'], ['helicopter', 'inspect', 'inspected'], ['runway', 'clean', 'cleaned'], ['report', 'write', 'written'], ['radio', 'repair', 'repaired'], ['briefing', 'prepare', 'prepared'], ['map', 'update', 'updated'], ['cockpit', 'clean', 'cleaned']]);
    const k = R.int(0, 2);
    if (k === 0) return [`The ${o} ___ every ${R.pick(['day', 'week', 'month'])}.`, `is ${pp}`, [base + (base.endsWith('h') ? 'es' : 's'), `is ${base}ing`.replace('eing', 'ing'), `has ${base}`], 'Passif présent : is + participe passé.'];
    if (k === 1) return [`The ${o}s ___ every ${R.pick(['day', 'week', 'month'])}.`, `are ${pp}`, [`is ${pp}`, `are ${base}`, `${base}ing`.replace('eing', 'ing')], 'Passif présent pluriel : are + participe passé.'];
    return [`The ${o} ___ yesterday.`, `was ${pp}`, [`is ${pp}`, `has been ${base}`, base === 'write' ? 'wrote' : pp], 'Passif passé : was + participe passé.'].map((x, i) => i === 2 ? x.filter(y => y !== `was ${pp}`) : x); },
  () => { const [inf, ing] = R.pick([['fly at night', 'flying at night'], ['work at weekends', 'working at weekends'], ['take the bus', 'taking the bus'], ['study English', 'studying English'], ['wait for the results', 'waiting for the results'], ['travel abroad', 'travelling abroad'], ['repeat the test', 'repeating the test'], ['change the plan', 'changing the plan']]);
    const v = inf.split(' ')[0], past = { fly: 'flew', work: 'worked', take: 'took', study: 'studied', wait: 'waited', travel: 'travelled', repeat: 'repeated', change: 'changed' }[v] + inf.slice(v.length);
    if (R.chance(0.5)) { const m = R.pick(['enjoyed', 'avoided', 'finished', 'suggested', 'kept', 'considered']); return [`${R.pick(EN.s3)} ${m} ___.`, ing, ['to ' + inf, inf, past], `Après ${m.replace(/ed$|t$/, m === 'kept' ? 'keep' : '')}… on emploie -ing.`.replace(/Après .*?…/, 'Après enjoy, avoid, finish, suggest, keep, consider…')]; }
    const m = R.pick(['wanted', 'decided', 'hoped', 'planned', 'agreed', 'refused', 'promised', 'needed']); return [`${R.pick(EN.s3)} ${m} ___.`, 'to ' + inf, [ing, inf, past], 'Après want, decide, hope, plan, agree, refuse, promise, need… on emploie to + verbe.']; },
  () => { const prep = R.pick(['in', 'on', 'at']), X = R.pick({ in: ['July', '2027', 'the morning', 'winter', 'the evening', 'March'], on: ['Monday', 'Friday morning', '15 May', 'my birthday', 'Christmas Day'], at: ["6 o'clock", 'noon', 'night', 'midnight', '7:30'] }[prep]);
    return [`${R.pick(['The exercise starts', 'We fly', 'The briefing is', 'The course begins', 'They land'])} ___ ${X}.`, prep, ['in', 'on', 'at', 'to'].filter(p => p !== prep), 'in + mois, année, saison, moment de la journée ; on + jour, date ; at + heure, night.']; },
  () => { const [adj, p, comp, excl] = R.pick([['interested', 'in', 'aviation', []], ['good', 'at', 'mathematics', ['with']], ['afraid', 'of', 'heights', []], ['responsible', 'for', 'the safety of the crew', ['to']], ['proud', 'of', 'the unit', []], ['tired', 'of', 'waiting', ['from']], ['keen', 'on', 'sport', []], ['aware', 'of', 'the risks', []], ['capable', 'of', 'leading a team', []], ['similar', 'to', 'the old model', []], ['different', 'from', 'the old model', ['to']], ['famous', 'for', 'its helicopters', ['as']]]);
    return [`${R.pick(EN.s3)} is very ${adj} ___ ${comp}.`, p, R.sample(['in', 'at', 'of', 'for', 'on', 'to', 'from', 'with'].filter(x => x !== p && !excl.includes(x)), 3), `${adj} ${p}`]; },
  () => R.pick([
    () => [`There isn't ___ ${R.pick(['fuel', 'time', 'water', 'information', 'money'])} left.`, 'much', ['many', 'a few', 'few'], 'much + indénombrable (fuel, time, water…).'],
    () => [`How ___ ${R.pick(['soldiers', 'helicopters', 'questions', 'flights', 'mistakes'])} are there?`, 'many', ['much', 'lot', 'more'], 'many + dénombrable au pluriel.'],
    () => [`We still have ___ ${R.pick(['days', 'friends', 'questions', 'spare parts'])}, so don't worry.`, 'a few', ['a little', 'much', 'little'], 'a few + pluriel dénombrable = quelques.'],
    () => [`There is only ___ ${R.pick(['fuel', 'water', 'time', 'money'])} left in the ${R.pick(['tank', 'reserve'])}.`.replace('time left in the tank', 'time left in the reserve'), 'a little', ['a few', 'many', 'few'], 'a little + indénombrable = un peu de.']
  ])(),
  () => R.pick([
    () => [`The ${R.pick(['pilot', 'instructor', 'officer', 'woman', 'man'])} ___ ${R.pick(['flew us here', 'met us at the gate', 'gave the briefing'])} is ${R.pick(['Italian', 'Spanish', 'German', 'very experienced'])}.`, 'who', ['which', 'whose', 'where'], 'who pour une personne sujet.'],
    () => [`The ${R.pick(['helicopter', 'truck', 'plane', 'drone'])} ___ ${R.pick(['landed this morning', 'broke down yesterday', 'arrived last week'])} belongs to the ${R.pick(['Navy', 'Army', 'Air Force'])}.`, 'which', ['who', 'whose', 'where'], 'which pour une chose.'],
    () => [`The ${R.pick(['man', 'woman', 'pilot', 'officer'])} ___ ${R.pick(['car', 'bag', 'phone', 'helmet'])} was stolen called the police.`, 'whose', ['who', 'which', 'where'], 'whose = dont (possession).'],
    () => [`This is the ${R.pick(['base', 'town', 'airfield', 'school'])} ___ I ${R.pick(['trained', 'was born', 'grew up', 'learnt to fly'])}.`, 'where', ['which', 'who', 'whose'], 'where pour un lieu.']
  ])(),
  () => { const [w, q, ans, excl] = R.pick([['How often', 'do you train?', ['Three times a week.', 'Every day.', 'Twice a month.'], []], ['How long', 'does the flight take?', ['About two hours.', 'Forty minutes.'], ['How far']], ['How far', 'is the base from here?', ['About 30 kilometres.', 'Ten miles.'], ['How long']], ['How much', 'does the course cost?', ['About 200 euros.'], []], ['How many', 'helicopters are there in the regiment?', ['About forty.', 'Twenty-five.'], []], ['How old', 'is your brother?', ['Twenty-two.'], []]]);
    return [`___ ${q} — ${R.pick(ans)}`, w, R.sample(['How often', 'How long', 'How far', 'How much', 'How many', 'How old'].filter(x => x !== w && !excl.includes(x)), 3), `${w} : la réponse indique ce qu'on demande.`]; },
  () => { const [s, p, excl] = R.pick([[`The helicopter took ___ at ${R.pick(['six', 'dawn', 'noon'])}.`, 'off', []], [`We ran ___ of fuel ${R.pick(['near the coast', 'on the way back', 'over the mountains'])}.`, 'out', []], ["Don't give ___! You can pass the tests.", 'up', []], ['Please fill ___ this form before the test.', 'in', ['out']], ['I need to look ___ this word in the dictionary.', 'up', []], ['Who will look ___ the dog while you are away?', 'after', []], [`The pilot had to turn ___ because of the ${R.pick(['fog', 'storm', 'snow'])}.`, 'back', ['around']], ["It's too loud. Could you turn the radio ___?", 'down', ['off', 'up']], [`The exercise was called ___ because of the ${R.pick(['storm', 'wind', 'fog'])}.`, 'off', []]]);
    return [s, p, R.sample(['off', 'out', 'up', 'in', 'after', 'back', 'down', 'on', 'over'].filter(x => x !== p && !excl.includes(x)), 3), 'Verbe à particule : retiens-le avec son sens.']; },
  () => R.pick([
    () => [`${R.pick(EN.s3)} ___ like ${R.pick(['coffee', 'flying at night', 'long briefings', 'cold weather'])}.`, "doesn't", ["don't", "isn't", "hasn't"], "Négation au présent à la 3e personne : doesn't + verbe."],
    () => [`${R.pick(EN.pl.filter(x => x !== 'We'))} ___ arrived yet.`, "haven't", ["hasn't", "didn't", "aren't"], "Present perfect négatif au pluriel : haven't + participe."],
    () => [`${R.pick(EN.s3)} ___ working today: it's a day off.`, "isn't", ["doesn't", "hasn't", "aren't"], "Présent continu négatif : isn't + -ing."]
  ])(),
  () => { const an = R.chance(0.5), n = an ? R.pick(['officer', 'engineer', 'instructor', 'hour', 'honest answer', 'army officer', 'old helicopter', 'interesting mission', 'excellent pilot']) : R.pick(['pilot', 'mechanic', 'soldier', 'university', 'European country', 'uniform', 'one-way ticket', 'helicopter', 'useful tool']);
    const S = /officer|engineer|instructor|pilot|mechanic|soldier/.test(n) ? `${R.pick(['She', 'He', 'My cousin'])} is ___ ${n}.` : `It's ___ ${n}.`;
    return [S, an ? 'an' : 'a', [an ? 'a' : 'an', 'any'], 'a ou an selon le son : an hour, an officer ; a university, a European.']; },
  () => R.chance(0.5) ? [`When I was a child, I used ___ ${R.pick(['in Lyon', 'near the sea', 'in the mountains', 'abroad'])}.`, 'to live', ['living', 'live', 'lived'], 'used to + verbe = habitude passée.']
    : (() => { const [ing, base, past] = R.pick([['getting up early', 'get up early', 'got up early'], ['working at night', 'work at night', 'worked at night'], ['flying in bad weather', 'fly in bad weather', 'flew in bad weather'], ['wearing a uniform', 'wear a uniform', 'wore a uniform']]);
      return [`${R.pick(EN.s3)} is used to ___.`, ing, [base, past, 'to ' + base], 'be used to + -ing = être habitué à.']; })()
];
const enQ = () => { const [s, g, b, ex] = R.pick(EN_T)(); return mkQ(esc(s).replace('___', '<span class="blank">______</span>'), esc(g), b.map(esc), { ex: esc(ex) }); };
const enBank = Gen.anglais;
Gen.anglais = ctx => R.chance(0.65) ? enQ() : enBank(ctx);

/* ---------------- Culture : questions générées à partir de tables de faits ---------------- */
const NATO = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];
const OLDALPHA = ['Able', 'Baker', 'Easy', 'Fox', 'George', 'How', 'Item', 'Jig', 'King', 'Love', 'Nan', 'Oboe', 'Peter', 'Queen', 'Roger', 'Sugar', 'Tare', 'Uncle', 'William', 'Yoke', 'Zebra', 'Mary', 'Jack', 'Yellow', 'Tommy', 'Victory'];
const DIRS = ['le nord', 'le nord-est', "l'est", 'le sud-est', 'le sud', 'le sud-ouest', "l'ouest", 'le nord-ouest'];
const h3 = h => String(((h % 360) + 360) % 360).padStart(3, '0');
const GRADES = [['Aspirant', 'Sous-lieutenant', 'Lieutenant', 'Capitaine', 'Commandant', 'Lieutenant-colonel', 'Colonel', 'Général de brigade', 'Général de division', "Général de corps d'armée", "Général d'armée"], ['Sergent', 'Sergent-chef', 'Adjudant', 'Adjudant-chef', 'Major'], ['Soldat de 2e classe', 'Soldat de 1re classe', 'Caporal', 'Caporal-chef']];
const HELIS = [['Tigre', "l'attaque et l'appui-feu", 4, 'att'], ['NH90 Caïman', 'la manœuvre et le transport de troupes', 4, 'man'], ['Gazelle', "la reconnaissance et l'attaque légère", 3, 'rec'], ['Puma', 'la manœuvre et le transport de troupes', 4, 'man'], ['Caracal', 'les forces spéciales et le sauvetage au combat', 5, 'sof'], ['Fennec', "l'instruction et la liaison", 3, 'ins'], ['Colibri', "l'instruction des élèves pilotes à Dax", 3, 'ins'], ['Guépard (H160M)', "le rôle d'hélicoptère interarmées léger", 5, 'hil']];
const EVENTS = [[1903, 'le premier vol motorisé des frères Wright', 'a'], [1907, "le premier vol libre d'un hélicoptère piloté (Paul Cornu)", 'a'], [1909, 'la traversée de la Manche en avion par Blériot', 'a'], [1913, 'la traversée de la Méditerranée en avion par Roland Garros', 'a'], [1927, "la traversée de l'Atlantique en solitaire par Lindbergh", 'a'], [1939, 'le premier vol du VS-300 de Sikorsky', 'a'], [1954, "la création de l'ALAT", 'a'], [2016, "la création de la 4e brigade d'aérocombat", 'a'], [1890, "le vol de l'Éole de Clément Ader", 'a'],
  [1789, 'la prise de la Bastille', 'g'], [1804, 'le sacre de Napoléon Ier', 'g'], [1815, 'la bataille de Waterloo', 'g'], [1916, 'la bataille de Verdun', 'g'], [1918, "l'armistice de la Première Guerre mondiale", 'g'], [1944, 'le débarquement en Normandie', 'g'], [1945, "la création de l'ONU", 'g'], [1949, "la création de l'OTAN", 'g'], [1957, 'le traité de Rome', 'g'], [1958, 'la Constitution de la Ve République', 'g'], [1989, 'la chute du mur de Berlin', 'g'], [1992, 'le traité de Maastricht', 'g'], [2002, "la mise en circulation de l'euro", 'g'], [2011, "l'opération Harmattan en Libye", 'g'], [2013, "l'opération Serval au Mali", 'g'], [2015, "le lancement de l'opération Sentinelle", 'g']];
const CAPITALS = [["l'Allemagne", 'Berlin', 'Munich'], ["l'Espagne", 'Madrid', 'Barcelone'], ["l'Italie", 'Rome', 'Milan'], ['le Portugal', 'Lisbonne', 'Porto'], ['la Belgique', 'Bruxelles', 'Anvers'], ['les Pays-Bas', 'Amsterdam', 'Rotterdam'], ['la Suisse', 'Berne', 'Genève'], ["l'Autriche", 'Vienne', 'Salzbourg'], ['la Pologne', 'Varsovie', 'Cracovie'], ["l'Ukraine", 'Kyiv', 'Kharkiv'], ['la Russie', 'Moscou', 'Saint-Pétersbourg'], ['le Royaume-Uni', 'Londres', 'Manchester'], ["l'Irlande", 'Dublin', 'Cork'], ['la Norvège', 'Oslo', 'Bergen'], ['la Suède', 'Stockholm', 'Göteborg'], ['la Finlande', 'Helsinki', 'Turku'], ['le Danemark', 'Copenhague', 'Aarhus'], ['la Grèce', 'Athènes', 'Thessalonique'], ['la Turquie', 'Ankara', 'Istanbul'], ['la Roumanie', 'Bucarest', 'Cluj-Napoca'], ["l'Estonie", 'Tallinn', 'Tartu'], ['la Lettonie', 'Riga', 'Daugavpils'], ['la Lituanie', 'Vilnius', 'Kaunas'], ['les États-Unis', 'Washington', 'New York'], ['le Canada', 'Ottawa', 'Toronto'], ['le Brésil', 'Brasilia', 'Rio de Janeiro'], ["l'Australie", 'Canberra', 'Sydney'], ['le Japon', 'Tokyo', 'Osaka'], ['la Chine', 'Pékin', 'Shanghai'], ["l'Inde", 'New Delhi', 'Bombay'], ['le Mali', 'Bamako', 'Tombouctou'], ['le Niger', 'Niamey', 'Agadez'], ['le Tchad', "N'Djamena", 'Abéché'], ['le Liban', 'Beyrouth', 'Tripoli'], ['la Syrie', 'Damas', 'Alep'], ["l'Irak", 'Bagdad', 'Mossoul'], ["l'Égypte", 'Le Caire', 'Alexandrie'], ['le Maroc', 'Rabat', 'Casablanca'], ["l'Algérie", 'Alger', 'Oran'], ['le Sénégal', 'Dakar', 'Saint-Louis'], ["la Côte d'Ivoire", 'Yamoussoukro', 'Abidjan'], ['la Nouvelle-Zélande', 'Wellington', 'Auckland']];
const UNITS = [['la force', 'le newton', 'N'], ['la pression', 'le pascal', 'Pa'], ["l'énergie", 'le joule', 'J'], ['la puissance', 'le watt', 'W'], ['la tension électrique', 'le volt', 'V'], ["l'intensité électrique", "l'ampère", 'A'], ['la résistance électrique', "l'ohm", 'Ω'], ['la fréquence', 'le hertz', 'Hz'], ['la température (Système international)', 'le kelvin', 'K'], ['la masse', 'le kilogramme', 'kg'], ['la charge électrique', 'le coulomb', 'C'], ['la quantité de matière', 'la mole', 'mol']];
const OPS = [['Serval', 'au Mali (2013)'], ['Barkhane', 'au Sahel (2014-2022)'], ['Sangaris', 'en Centrafrique (2013-2016)'], ['Chammal', 'en Irak et en Syrie'], ['Harmattan', 'en Libye (2011)'], ['Sentinelle', 'sur le territoire national'], ['Daman', 'au Liban, au sein de la FINUL'], ['Daguet', 'pendant la guerre du Golfe (1991)'], ['Pamir', 'en Afghanistan'], ['Lynx', "en Estonie, dans le cadre de l'OTAN"], ['Aigle', "en Roumanie, dans le cadre de l'OTAN"]];
const yearsNear = y => R.sample([-12, -10, -5, -3, -2, -1, 1, 2, 3, 5, 10, 12].map(d => y + d), 3).map(String);
const CULT_A = [
  () => { const i = R.int(0, 25); return mkQ(`Lettre ${String.fromCharCode(65 + i)} en alphabet OTAN ?`, NATO[i], R.sample([...OLDALPHA, ...NATO.filter((_, j) => j !== i)], 3)); },
  () => { const i = R.int(0, 25); return mkQ(`« ${NATO[i]} » correspond à quelle lettre ?`, String.fromCharCode(65 + i), R.sample([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter((_, j) => j !== i), 3)); },
  () => { const w = R.pick(['ALAT', 'DAX', 'PAU', 'TIGRE', 'PUMA', 'SCM', 'CSO', 'LUC', 'ETAIN']), sp = [...w].map(c => NATO[c.charCodeAt(0) - 65]);
    const wrong = k => { const c = sp.slice(), L = w.charCodeAt(k) - 65; c[k] = OLDALPHA.find(x => x[0] === w[k] && x !== NATO[L]) || NATO[(L + 1) % 26]; return c.join(' '); };
    return mkQ(`Comment épeler « ${w} » avec l'alphabet OTAN ?`, sp.join(' '), R.shuffle([...Array(w.length).keys()]).slice(0, 3).map(wrong)); },
  () => { const k = R.int(0, 7); return mkQ(`Un cap de ${h3(k * 45)}° mène vers…`, DIRS[k], R.sample(DIRS.filter((_, j) => j !== k), 3), { ex: '000 nord, 090 est, 180 sud, 270 ouest.' }); },
  () => { const h = R.int(0, 35) * 10; return mkQ(`Quel est le cap inverse (réciproque) du cap ${h3(h)} ?`, h3(h + 180), [h3(h + 90), h3(h - 90), h3(360 - h)].filter(x => x !== h3(h + 180)), { ex: `On ajoute ou on retire 180 : ${h3(h)} ± 180 = ${h3(h + 180)}` }); },
  () => { const n = R.int(1, 36), o = ((n + 17) % 36) + 1, f = x => String(x).padStart(2, '0'), rw = x => x % 360 === 0 ? '360' : h3(x);
    return R.chance(0.5) ? mkQ(`La piste ${f(n)} est orientée au…`, `${rw(n * 10)}°`, [`${h3(n)}°`, `${rw(n * 10 + 180)}°`, `${rw(n * 10 + 90)}°`], { ex: 'Numéro de piste × 10 = orientation magnétique en degrés.' }) : mkQ(`L'autre extrémité de la piste ${f(n)} porte le numéro…`, f(o), [f(((n + 8) % 36) + 1), f(((n + 26) % 36) + 1), f(36 - n || 36)].filter(x => x !== f(o)), { ex: `Les deux numéros d'une piste diffèrent de 18 (180°).` }); },
  () => { const k = R.int(0, 7); return mkQ(`Un vent « du ${h3(k * 45)} » vient de…`, DIRS[k], [DIRS[(k + 4) % 8], DIRS[(k + 2) % 8], DIRS[(k + 6) % 8]], { ex: 'Le vent est donné par sa provenance.' }); },
  () => { const g = R.pick(GRADES), i = R.int(0, g.length - 2), up = R.chance(0.5), j = up ? i : i + 1, ans = up ? g[i + 1] : g[i];
    return mkQ(`Quel grade vient juste ${up ? 'au-dessus' : 'en dessous'} de « ${g[j]} » ?`, ans, R.sample(g.filter(x => x !== ans && x !== g[j]), 3)); },
  () => { const g = R.pick(GRADES), s = R.sample(g.map((x, i) => [x, i]), 4), top = s.reduce((a, b) => b[1] > a[1] ? b : a); return mkQ('Lequel de ces grades est le plus élevé ?', top[0], s.filter(x => x !== top).map(x => x[0])); },
  () => { const [n, st] = R.pick([['Général de brigade', 2], ['Général de division', 3], ["Général de corps d'armée", 4], ["Général d'armée", 5]]); return mkQ(`Combien d'étoiles porte un ${n.toLowerCase()} ?`, String(st), ['1', '2', '3', '4', '5', '6'].filter(x => x !== String(st)).slice(0, 4)); },
  () => { const r = R.pick([['le 1er RHC', 'Phalsbourg'], ['le 3e RHC', 'Étain'], ['le 5e RHC', 'Pau'], ['le 4e RHFS', 'Pau'], ['la 9e BSAM', 'Montauban']]); return mkQ(`Où est ${r[0].startsWith('la') ? 'stationnée' : 'stationné'} ${r[0]} ?`, r[1], R.sample(['Phalsbourg', 'Étain', 'Pau', 'Montauban', 'Dax', 'Valence', 'Le Luc'].filter(x => x !== r[1]), 3)); },
  () => { const r = R.pick([['1er RHC', 'Phalsbourg'], ['3e RHC', 'Étain'], ['9e BSAM', 'Montauban']]); return mkQ(`Quelle unité de l'ALAT est stationnée à ${r[1]} ?`, r[0], ['1er RHC', '3e RHC', '5e RHC', '4e RHFS', '9e BSAM'].filter(x => x !== r[0] && !(r[1] === 'Pau' && /5e|4e/.test(x))).slice(0, 3)); },
  () => { const h = R.pick(HELIS); return mkQ(`Hélicoptère ${h[0]} : combien de pales compte son rotor principal ?`, String(h[2]), ['2', '3', '4', '5'].filter(x => x !== String(h[2]))); },
  () => { const h = R.pick(HELIS), others = [...new Map(HELIS.filter(x => x[3] !== h[3]).map(x => [x[3], x])).values()];
    return mkQ(`Mission principale de l'hélicoptère ${h[0]} :`, h[1], R.sample(others, 3).map(x => x[1])); },
  () => { const five = R.pick(HELIS.filter(h => h[2] === 5)), rest = R.sample(HELIS.filter(h => h[2] !== 5), 3); return mkQ('Lequel de ces hélicoptères a un rotor principal à 5 pales ?', five[0], rest.map(h => h[0])); },
  () => { const e = R.pick(EVENTS.filter(x => x[2] === 'a')); return mkQ(`En quelle année a eu lieu ${e[1]} ?`, String(e[0]), yearsNear(e[0])); },
  () => { const e = R.pick(EVENTS.filter(x => x[2] === 'a')); return mkQ(`Que s'est-il passé en ${e[0]} ?`, W.cap(e[1]), R.sample(EVENTS.filter(x => x[2] === 'a' && x[0] !== e[0]), 3).map(x => W.cap(x[1]))); },
  () => { const c = R.pick([['7700', 'la détresse'], ['7600', 'la panne radio'], ['7500', "l'intervention illicite"]]); return R.chance(0.5) ? mkQ(`Le code transpondeur ${c[0]} signale…`, c[1], ['la détresse', 'la panne radio', "l'intervention illicite", 'un vol militaire'].filter(x => x !== c[1])) : mkQ(`Code transpondeur à afficher pour ${c[1]} :`, c[0], ['7700', '7600', '7500', '7000'].filter(x => x !== c[0])); },
  () => { const k = R.pick([50, 80, 100, 120, 150, 200, 250]), a = Math.round(k * 1.852); return mkQ(`${k} nœuds représentent environ…`, `${a} km/h`, [`${Math.round(k * 1.609)} km/h`, `${Math.round(k / 1.852)} km/h`, `${k * 3} km/h`], { ex: '1 nœud = 1,852 km/h' }); },
  () => { const f = R.pick([1000, 2000, 3000, 5000, 8000, 10000]), a = Math.round(f * 0.3048 / 10) * 10; return mkQ(`${f.toLocaleString('fr-FR')} ft représentent environ…`, `${a.toLocaleString('fr-FR')} m`, [`${(a * 3).toLocaleString('fr-FR')} m`, `${(f / 10).toLocaleString('fr-FR')} m`, `${(a * 2).toLocaleString('fr-FR')} m`], { ex: '1 ft ≈ 0,3 m' }); }
];
const CULT_G = [
  () => { const c = R.pick(CAPITALS), de = c[0].replace(/^le /, 'du ').replace(/^les /, 'des ').replace(/^la /, 'de la ').replace(/^l'/, "de l'"); return mkQ(`Capitale ${de} ?`, c[1], [c[2], ...R.sample(CAPITALS.filter(x => x !== c), 2).map(x => x[1])]); },
  () => { const c = R.pick(CAPITALS); return mkQ(`${c[1]} est la capitale de…`, c[0], R.sample(CAPITALS.filter(x => x !== c), 3).map(x => x[0])); },
  () => { const e = R.pick(EVENTS.filter(x => x[2] === 'g')); return mkQ(`En quelle année a eu lieu ${e[1]} ?`, String(e[0]), yearsNear(e[0])); },
  () => { const e = R.pick(EVENTS.filter(x => x[2] === 'g')); return mkQ(`Quel événement date de ${e[0]} ?`, W.cap(e[1]), R.sample(EVENTS.filter(x => x[2] === 'g' && x[0] !== e[0]), 3).map(x => W.cap(x[1]))); },
  () => { const u = R.pick(UNITS); return mkQ(`Unité de ${u[0]} (Système international) :`, u[1], R.sample(UNITS.filter(x => x !== u), 3).map(x => x[1])); },
  () => { const u = R.pick(UNITS); return mkQ(`${W.cap(u[1])} mesure…`, u[0], R.sample(UNITS.filter(x => x !== u), 3).map(x => x[0])); },
  () => { const u = R.pick(UNITS); return mkQ(`Symbole ${u[1].replace(/^le /, 'du ').replace(/^la /, 'de la ').replace(/^l'/, "de l'")} :`, u[2], R.sample(UNITS.filter(x => x !== u), 3).map(x => x[2])); },
  () => { const o = R.pick(OPS); return mkQ(`L'opération ${o[0]} se déroule ou s'est déroulée…`, o[1], R.sample(OPS.filter(x => x !== o), 3).map(x => x[1])); },
  () => { const o = R.pick(OPS); return mkQ(`Quelle opération se déroule ou s'est déroulée ${o[1]} ?`, o[0], R.sample(OPS.filter(x => x !== o), 3).map(x => x[0])); }
];
const aeroBank = Gen.cultureAero, cgBank = Gen.cultureG;
Gen.cultureAero = ctx => R.chance(0.55) ? R.pick(CULT_A)() : aeroBank(ctx);
Gen.cultureG = ctx => R.chance(0.6) ? R.pick(CULT_G)() : cgBank(ctx);
