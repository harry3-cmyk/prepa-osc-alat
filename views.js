'use strict';
/* Catalogue des épreuves et écrans de l'application */

const ICON = {
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>'
};

const TESTS = {
  verbal: { code: 'VB', name: 'Verbal', grp: 'cso', n: 31, time: 480, gen: Gen.verbal,
    desc: 'Synonymes, contraires, intrus et définitions.',
    real: '31 questions en 8 minutes, environ 15 secondes par question. Le seul sous-test du TAMI-C qui ne soit pas entièrement aléatoire.',
    tips: ['Les leurres sont souvent des paronymes (mots qui se ressemblent) : lis le mot en entier.', 'Si tu hésites entre deux réponses, cherche le contraire du mot : il élimine souvent un leurre.', 'Ne bloque pas plus de 20 secondes : passe et avance.'] },
  maths_c: { code: 'MA', name: 'Mathématiques', grp: 'cso', n: 26, time: 1080, gen: Gen.mathsCSO,
    desc: 'Problèmes courts : pourcentages, vitesses, proportionnalité, moyennes, durées.',
    real: '26 problèmes en 18 minutes, 5 propositions par question, brouillon fourni.',
    tips: ['Pose le calcul au brouillon dès la lecture : les données inutiles sont rares.', 'Les pourcentages successifs se multiplient (×1,2 puis ×0,9), ils ne s\'additionnent pas.', 'Vitesse moyenne d\'un aller-retour : jamais la moyenne des deux vitesses.', 'Estime l\'ordre de grandeur avant de calculer : il élimine souvent 3 propositions.'] },
  spatial: { code: 'RO', name: 'Rotation de damiers', grp: 'cso', n: 25, time: 420, gen: Gen.spatial,
    desc: 'Retrouver la grille modèle après une rotation de 90°, 180° ou 270°.',
    real: '25 questions en 7 minutes. Les leurres sont des images en miroir : une rotation ne retourne jamais la figure.',
    tips: ['Repère un élément unique (le rond, le triangle) et une case voisine : suis ce couple pendant la rotation.', 'Un quart de tour vers la droite : la rangée du haut devient la colonne de droite.', 'Élimine d\'abord les miroirs, ils se trahissent par l\'ordre gauche-droite inversé.'] },
  codage: { code: 'CO', name: 'Codage', grp: 'cso', n: 45, time: 150, gen: Gen.codage, setup: Gen.codageSetup, context: Gen.codageContext, express: 20,
    desc: 'Une grille de 12 mots, chacun associé à un code à 4 chiffres : retrouve le code du mot demandé.',
    real: '45 questions en 2 min 30, soit environ 3 secondes par réponse. C\'est un test de vitesse.',
    tips: ['Les codes se ressemblent par paires (mêmes deux premiers chiffres) : vérifie les deux derniers.', 'Garde le regard sur la grille et lis le code en entier, pas seulement le début.', 'Le rythme compte plus que la perfection : ne reviens pas en arrière.'] },
  attention: { code: 'AT', name: 'Attention', grp: 'cso', n: 40, time: 210, gen: Gen.attention, noKeys: true, express: 15,
    desc: 'Quatre séries de chiffres, de lettres ou de noms : trouve celle qui diffère, ou indique qu\'elles sont toutes identiques.',
    real: '40 questions en 3 min 30, environ 5 secondes par question.',
    tips: ['Compare par blocs de 3 ou 4 caractères plutôt que lettre par lettre.', 'Pièges fréquents : O et 0, I et 1, S et 5, B et 8, deux caractères inversés, un accent.', 'Environ une question sur cinq n\'a aucune différence : ose « toutes identiques ».'] },
  cubes: { code: 'CU', name: 'Suites de cubes', grp: 'cso', n: 25, time: 840, gen: Gen.cubes, express: 8,
    desc: 'Trois cubes évoluent selon une logique : choisis le quatrième.',
    real: '25 questions en 14 minutes. Chaque face visible (dessus, gauche, droite) suit sa propre règle.',
    tips: ['Traite une face à la fois : dessus, puis gauche, puis droite.', 'Règles courantes : +1, +2, ×2, lettre suivante, flèche qui tourne de 45° ou 90°, quart coloré qui tourne, cycle de trois formes.', 'Élimine les propositions dès qu\'une face est fausse.'] },
  anglais: { code: 'EN', name: 'Anglais', grp: 'cso', n: 150, time: 3300, gen: Gen.anglais, express: 20,
    desc: 'Phrases à trous : grammaire courante, vocabulaire, prépositions, plus un peu de vocabulaire aéronautique.',
    real: '150 QCM en 55 minutes, environ 22 secondes par question, sans écoute.',
    tips: ['Les candidats décrivent un niveau « grammaire de collège-lycée » : temps, prépositions, comparatifs, modaux.', 'Un score faible peut entraîner un nouveau passage d\'anglais à Tours : vise large.', 'Lis la phrase entière : le mot-clé (since, for, yesterday) donne souvent le temps.'] },
  calcul: { code: 'CM', name: 'Calcul mental', grp: 'cso', kind: 'sprint',
    desc: 'Sprint de 2 minutes : additions, soustractions, tables, divisions. Saisie au pavé numérique.',
    real: 'Pas une épreuve à part entière, mais la base de toutes les épreuves de maths du CSO et de Tours.',
    tips: ['Vise 35 calculs justes en 2 minutes.', 'Une séance par jour suffit pour progresser vite.'] },
  cultureg: { code: 'CG', name: 'Culture générale', grp: 'cso', n: 30, time: 600, gen: Gen.cultureG,
    desc: 'Histoire, géographie, institutions, sciences et opérations militaires récentes.',
    real: 'Pas une épreuve chronométrée du CSO, mais ces connaissances sont attendues en entretien (actualité, institutions, armée).',
    tips: ['L\'entretien officier peut porter sur l\'actualité de défense et les institutions.', 'Lis l\'actualité défense chaque semaine avant tes sélections.'] },
  maths_t: { code: 'MT', name: 'Mathématiques SECMA', grp: 'tours', n: 20, time: 900, gen: Gen.mathsTours,
    desc: 'Calcul mental et problèmes courts : conversions, puissances, fractions, nœuds, pieds, consommation.',
    real: '20 questions en 15 minutes : 16 calculs puis 4 problèmes. Brouillon autorisé. Vitesse et précision sont évaluées.',
    tips: ['Un mauvais score peut être repris en entretien officier : on te demandera de justifier tes erreurs.', 'Mémorise : 1 kt = 1,852 km/h, 1 NM = 1 852 m, 1 ft ≈ 0,3 m, km/h ÷ 3,6 = m/s.', 'Exemple de problème cité : 20 % consommés puis 15 % du reste.'] },
  orientation: { code: 'OR', name: 'Orientation spatiale', grp: 'tours', n: 27, time: 420, gen: Gen.orientation, express: 8,
    desc: 'Lis l\'horizon artificiel et le compas, puis choisis l\'hélicoptère qui a cette attitude et ce cap.',
    real: '27 questions en 7 minutes, 5 images par question, difficulté croissante.',
    tips: ['Commence par le compas : il élimine en général 3 images sur 5 (nord : l\'appareil s\'éloigne de toi ; est : il va vers la droite).', 'Horizon artificiel : plus de bleu = nez en haut ; horizon qui monte à droite = inclinaison à droite.', 'Ne cherche pas la perfection visuelle : vérifie cap, puis inclinaison, puis assiette.'] },
  differences: { code: 'DF', name: 'Différences', grp: 'tours', n: 13, time: 600, gen: Gen.differences, express: 6,
    desc: 'Trouve l\'hélicoptère strictement identique au modèle. Parfois aucun ne l\'est.',
    real: '13 questions en 10 minutes, sans retour en arrière. Une correspondance est volontairement impossible.',
    tips: ['Balaye toujours dans le même ordre : nez, vitres, porte, train, queue, rotor, antenne.', 'Méfie-toi du piège « aucun identique » : vérifie la dernière proposition avant de valider.'] },
  memo: { code: 'ME', name: 'Mémorisation', grp: 'tours', kind: 'memo',
    desc: 'Associe 15 formes à leur nom (lacs, rivières, baies…), puis retrouve les noms.',
    real: '3 phases de 15 formes : 4 minutes pour mémoriser, 2 min 30 pour restituer. Pas de point négatif.',
    tips: ['Réponds à tout : une réponse au hasard ne coûte rien.', 'Commence par les formes les plus faciles à retenir.', 'Crée une image mentale reliant la silhouette au nom.'] },
  identif: { code: 'ID', name: 'Identification d\'aéronefs', grp: 'tours', n: 30, time: 900, gen: Gen.identif,
    desc: 'Reconnaître les aéronefs de l\'ALAT, de la Marine, de l\'armée de l\'air et de l\'étranger à partir de leurs caractéristiques.',
    real: '30 aéronefs en 15 minutes, présentés en photo le jour J. Ici, l\'entraînement porte sur les signes distinctifs.',
    tips: ['Complète avec des photos : cherche chaque nom en images et repère les signes cités ici.', 'Hélicoptères : nombre de pales, type d\'anticouple (rotor, Fenestron, coaxial, tandem), train, disposition de l\'équipage.', 'Les candidats citent aussi l\'armement (HOT, Mistral, canons de 20 et 30 mm).'] },
  culture: { code: 'CA', name: 'Culture aéro et ALAT', grp: 'tours', n: 40, time: 900, gen: Gen.cultureAero, express: 15,
    desc: 'ALAT, régiments, hélicoptères, mécanique du vol, navigation, radio, grades et institutions.',
    real: '40 QCM en 15 minutes sur la culture aéronautique, militaire et ALAT.',
    tips: ['Thèmes cités par les candidats : portance, lois de Newton, radio, pionniers de l\'aviation, armements.', 'Révise les fiches ALAT pour les régiments et le parcours de formation.'] },
  scm1: { code: 'S1', name: 'SCM · Jour 1', grp: 'simu', kind: 'sim', day: 1 },
  scm2: { code: 'S2', name: 'SCM · Jour 2', grp: 'simu', kind: 'sim', day: 2 },
  sport: { code: 'SP', name: 'Sport', grp: 'cso', kind: 'tool' }
};

const TAMIC = ['verbal', 'maths_c', 'spatial', 'codage', 'attention', 'cubes'];
const SECMA = ['maths_t', 'orientation', 'differences', 'memo', 'identif', 'culture'];
const CIRCUIT = {
  tamic: [['verbal', 8], ['maths_c', 4], ['spatial', 6], ['codage', 12], ['attention', 10], ['cubes', 3]],
  secma: [['maths_t', 4], ['orientation', 6], ['differences', 3], ['identif', 5], ['culture', 6]]
};

const testTime = T => { if (!T.time) return ''; const m = Math.floor(T.time / 60), s = T.time % 60; return s ? `${m} min ${s} s` : `${m} min`; };
const ago = ts => { const d = Math.max(0, Math.floor((Date.now() - ts) / 86400000)); return d === 0 ? 'aujourd\'hui' : d === 1 ? 'hier' : `il y a ${d} j`; };
function testRow(id) {
  const T = TESTS[id], st = Stats.of(id);
  const meta = T.kind === 'sprint' ? 'Sprint 2 min · illimité' : T.kind === 'memo' ? '3 × 15 formes · 4 min + 2 min 30' : `${T.n} q · ${testTime(T)}`;
  return `<button class="trow" data-go="test" data-p="${gp({ id })}"><span class="tile mono">${T.code}</span><span class="tr-m"><b>${esc(T.name)}</b><span>${meta}</span></span><span class="tr-r">${st.n > 1 ? spark(st.series, 52, 20) : ''}${chip(st.avg)}</span></button>`;
}
function toolRow(go, code, name, meta, p = {}) {
  return `<button class="trow" data-go="${go}" data-p="${gp(p)}"><span class="tile mono alt">${code}</span><span class="tr-m"><b>${esc(name)}</b><span>${esc(meta)}</span></span><span class="tr-r chev">${ICON.chev}</span></button>`;
}
function stageScore(ids) {
  const vals = ids.map(id => Stats.of(id).avg);
  const done = vals.filter(v => v != null);
  return { cover: done.length / ids.length, score: done.length ? avg(vals.map(v => v ?? 0)) : null, done: done.length, total: ids.length };
}
function daysTo(d) { if (!d) return null; const t = new Date(d + 'T08:00:00'); return Math.ceil((t - Date.now()) / 86400000); }
function heroStage({ step, title, place, ids, dateKey }) {
  const sc = stageScore(ids), dl = daysTo(Store.data.profile.dates[dateKey]);
  return `<section class="hero">
    <div class="hero-l"><span class="eyebrow">${step}</span><h2>${title}</h2><p>${place}</p>
      ${dl != null && dl >= 0 ? `<span class="countdown mono">J-${dl}</span>` : `<button class="linkbtn sm" data-go="settings">Indiquer ma date de passage</button>`}</div>
    <div class="hero-r"><div class="gauge">${ring(sc.score ?? 0, 92)}</div><span class="mono sm">${sc.done}/${sc.total} épreuves travaillées</span></div>
  </section>`;
}

/* ---------------- Onglet CSO ---------------- */
App.V['cso-home'] = {
  title: 'CSO', eyebrow: 'Étape 2 · Présélection',
  render: () => `${heroStage({ step: 'Centre de sélection et d\'orientation', title: 'TAMI-C, anglais, sport, entretien', place: '1 à 2 jours · épreuves communes à toutes les armées', ids: [...TAMIC, 'anglais'], dateKey: 'cso' })}
    <button class="circuit" data-act="circuit" data-k="tamic"><span>${ICON.play}</span><span><b>Circuit express TAMI-C</b><small>Les 6 sous-tests à la suite · ≈ 10 min</small></span></button>
    <h3 class="sec">TAMI-C <span>6 épreuves chronométrées sur ordinateur</span></h3>
    <div class="list">${TAMIC.map(testRow).join('')}</div>
    <h3 class="sec">Autres épreuves du CSO</h3>
    <div class="list">${['anglais', 'calcul', 'cultureg'].map(testRow).join('')}
      ${toolRow('sport', 'SP', 'Sport', 'Luc Léger, tractions ou poulie, Killy · barèmes et bip')}
      ${toolRow('itw', 'EM', 'Entretien de motivation', 'Questions posées et pistes de réponse', { cat: 'Motivation' })}
      ${toolRow('info', 'PE', 'Tests de personnalité', 'Ce qu\'il faut savoir avant de les passer', { k: 'perso' })}</div>`
};

/* ---------------- Onglet Tours ---------------- */
App.V['tours-home'] = {
  title: 'Tours', eyebrow: 'Étape 3 · SECMA',
  render: () => `${heroStage({ step: 'SECMA · base aérienne 705 de Tours', title: 'Sélection spécifique ALAT', place: 'Environ 2 jours sur place · ancienne sélection de Vincennes', ids: SECMA, dateKey: 'tours' })}
    <button class="circuit" data-act="circuit" data-k="secma"><span>${ICON.play}</span><span><b>Circuit express SECMA</b><small>Maths, orientation, différences, identification, culture · ≈ 12 min</small></span></button>
    <h3 class="sec">Jour 1 <span>épreuves écrites et informatisées</span></h3>
    <div class="list">${toolRow('lettre', 'LM', 'Lettre de motivation', 'Manuscrite · 15 min · réutilisée en entretien')}
      ${SECMA.map(testRow).join('')}</div>
    <h3 class="sec">Simulateur SCM <span>éliminatoire, jours 1 et 2</span></h3>
    <div class="list"><button class="trow" data-tab="simu"><span class="tile mono hot">SC</span><span class="tr-m"><b>Simulateur de coordination</b><span>Cyclique, collectif, palonniers et tâches annexes</span></span><span class="tr-r">${chip(Stats.of('scm1').avg)}</span></button></div>
    <h3 class="sec">Jour 2 <span>entretiens</span></h3>
    <div class="list">${toolRow('itw', 'EP', 'Entretien psychologue', 'Personnalité, stress, motivations', { cat: 'Personnalité' })}
      ${toolRow('itw', 'EO', 'Entretien officier', 'Projet, ALAT, armée, actualité, calculs', { cat: 'Connaissances' })}
      ${toolRow('itw', 'MS', 'Mises en situation', 'Questions éthiques et cas concrets', { cat: 'Mise en situation' })}
      ${toolRow('info', 'PE', 'Questionnaires de personnalité', 'Trois questionnaires, dont un très long', { k: 'perso' })}</div>
    <h3 class="sec">Réviser</h3>
    <div class="list">${toolRow('fiches', 'FI', 'Fiches ALAT', 'Hélicoptères, régiments, armement, vol, radio, grades')}
      ${toolRow('info', 'MD', 'Visite médicale CEMPN', 'Ce que vérifient les médecins du personnel navigant', { k: 'cempn' })}</div>`
};

/* ---------------- Fiche d'une épreuve ---------------- */
App.V.test = {
  title: p => TESTS[p.id].name, eyebrow: p => TESTS[p.id].grp === 'cso' ? 'CSO · ' + (TAMIC.includes(p.id) ? 'TAMI-C' : 'épreuve') : 'SECMA · Tours',
  render: ({ id }) => {
    const T = TESTS[id], st = Stats.of(id);
    const exN = T.kind ? null : Math.min(T.express || 10, T.n);
    const btns = T.kind === 'sprint' ? `<button class="btn" data-act="run" data-id="${id}" data-m="sprint">Lancer le sprint de 2 minutes</button>`
      : T.kind === 'memo' ? `<button class="btn" data-act="run" data-id="${id}" data-m="exam">Conditions réelles · 3 phases</button><button class="btn ghost" data-act="run" data-id="${id}" data-m="express">Express · 10 formes</button><button class="btn ghost" data-act="run" data-id="${id}" data-m="train">Une phase de 15 formes</button>`
      : `<button class="btn" data-act="run" data-id="${id}" data-m="exam">Conditions réelles · ${T.n} q · ${testTime(T)}</button>
         <button class="btn ghost" data-act="run" data-id="${id}" data-m="express">Express · ${exN} q · ${mmss(Math.max(40, Math.round(T.time * exN / T.n)))}</button>
         <button class="btn ghost" data-act="run" data-id="${id}" data-m="train">Entraînement corrigé · sans chrono</button>`;
    return `<section class="detail">
      <p class="lead">${esc(T.desc)}</p>
      <div class="facts"><span class="eyebrow">Le jour J</span><p>${esc(T.real)}</p></div>
      <div class="actions">${btns}</div>
      <div class="statsbox">${st.n ? `<div class="sb-k"><div><b class="mono">${Math.round(st.avg)}%</b><span>moyenne récente</span></div><div><b class="mono">${st.best}%</b><span>meilleur</span></div><div><b class="mono">${st.n}</b><span>séries</span></div></div>${spark(st.series, 300, 60)}` : '<p class="muted">Aucune série pour l\'instant. Commence par une série express pour situer ton niveau.</p>'}</div>
      <h3 class="sec">Conseils</h3><ul class="tips">${T.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    </section>`;
  }
};
Act.run = t => Runner.start(t.dataset.id, t.dataset.m);
Act.circuit = t => { const q = CIRCUIT[t.dataset.k].map(([id, n]) => ({ id, mode: 'express', n })); const f = q.shift(); Runner.start(f.id, 'express', q, f.n); };

/* ---------------- Onglet Simulateur ---------------- */
App.V['simu-home'] = {
  title: 'Simulateur', eyebrow: 'SCM · coordination et attention partagée',
  render: () => {
    const set = Store.data.profile.settings, dur = set.simDur || 3;
    const s1 = Stats.of('scm1'), s2 = Stats.of('scm2');
    const last = [...s1.all, ...s2.all].sort((a, b) => b.ts - a.ts)[0];
    return `<section class="sim-hero">
      <div class="sim-pv" aria-hidden="true"><span class="ind b"></span><span class="ind g"></span><span class="ind r"></span></div>
      <div><span class="eyebrow">Épreuve la plus déterminante</span><h2>Recentre trois indicateurs pendant que tu comptes, écoutes et mémorises.</h2>
      <p>Pouce gauche : collectif (vert, haut-bas) et palonniers (rouge, gauche-droite). Pouce droit : cyclique (bleu). Sur ordinateur : Z Q S D et les flèches.</p></div></section>
      <div class="list">
        <button class="trow big" data-act="run" data-id="scm1" data-m="exam"><span class="tile mono hot">J1</span><span class="tr-m"><b>Jour 1 · conditions réelles</b><span>1 essai non noté + 3 séries de ${dur} min · forme à compter</span></span><span class="tr-r">${chip(s1.avg)}</span></button>
        <button class="trow big" data-act="run" data-id="scm2" data-m="exam"><span class="tile mono hot">J2</span><span class="tr-m"><b>Jour 2 · conditions réelles</b><span>3 séries de ${dur} min · + sons et nombres à retenir</span></span><span class="tr-r">${chip(s2.avg)}</span></button>
        <button class="trow" data-act="run" data-id="scm1" data-m="express"><span class="tile mono">X1</span><span class="tr-m"><b>Série express jour 1</b><span>Une série de 90 s</span></span><span class="tr-r chev">${ICON.chev}</span></button>
        <button class="trow" data-act="run" data-id="scm2" data-m="express"><span class="tile mono">X2</span><span class="tr-m"><b>Série express jour 2</b><span>Une série de 90 s avec sons et nombres</span></span><span class="tr-r chev">${ICON.chev}</span></button>
      </div>
      <h3 class="sec">Réglages</h3>
      <div class="settings">
        <div class="seg" role="group" aria-label="Durée d'une série">${[1, 2, 3, 4].map(m => `<button data-act="simdur" data-v="${m}" aria-pressed="${dur === m}">${m} min</button>`).join('')}</div>
        <label class="toggle"><input type="checkbox" id="invped" ${set.invPed ? 'checked' : ''}><span>Palonniers inversés</span></label>
        <label class="toggle"><input type="checkbox" id="simsound" ${set.simSound === false ? '' : 'checked'}><span>Bruit de fond au jour 2</span></label>
      </div>
      ${last ? `<h3 class="sec">Dernière session</h3><div class="card">${Sim.summaryHTML(last)}</div>` : ''}
      <h3 class="sec">Ce que disent les candidats</h3>
      <ul class="tips">
        <li>Jour 1 : un essai, puis 3 séries notées. Un niveau insuffisant à la fin du jour 1 élimine.</li>
        <li>La progression d'une série à l'autre est observée : une régression ou une stagnation pèse lourd.</li>
        <li>Après les séances, on te demande d'analyser ta prestation. Entraîne-toi à le faire ici à chaque série.</li>
        <li>Conseil rapporté d'un officier : compter les formes à voix basse et prioriser les tâches.</li>
        <li>Le sens des commandes a fait débat en 2024 (palonniers, indicateur bleu). Écoute le briefing et utilise l'essai pour vérifier.</li>
        <li>Entraîne-toi avec modération : le but est de connaître le format, pas de surapprendre ce simulateur, qui n'est qu'une approximation sur téléphone.</li>
      </ul>`;
  },
  mount: el => {
    $('#invped', el).onchange = e => { Store.data.profile.settings.invPed = e.target.checked; Store.touchProfile(); };
    $('#simsound', el).onchange = e => { Store.data.profile.settings.simSound = e.target.checked; Store.touchProfile(); };
  }
};
Act.simdur = t => { Store.data.profile.settings.simDur = Number(t.dataset.v); Store.touchProfile(); App.refresh(); };

/* ---------------- Sport ---------------- */
const BAREME = {
  H: { ll: { 20: 12, 19: 11, 18: 10.5, 17: 10, 16: 9.5, 15: 9, 14: 8.5, 13: 8, 12: 7.75, 11: 7.5, 10: 7.25, 8: 6.75, 6: 6.25, 4: 5.75, 2: 5.25 },
    tr: { 20: 17, 19: 16, 18: 15, 17: 14, 16: 13, 15: 12, 14: 11, 13: 10, 12: 9, 11: 8, 10: 7, 9: 6, 8: 5, 7: 4, 5: 3, 3: 2, 1: 1 } },
  F: { ll: { 20: 9, 19: 8.5, 18: 8, 17: 7.5, 16: 7, 15: 6.5, 14: 6, 13: 5.75, 12: 5.5, 11: 5.25, 10: 5, 8: 4.75, 6: 4.5, 4: 4.25, 2: 4 },
    tr: { 20: 59, 19: 58, 18: 53, 17: 50, 16: 47, 15: 44, 14: 42, 13: 38, 12: 34, 11: 30, 10: 29, 9: 25, 8: 24, 7: 21, 6: 20, 5: 19, 4: 16, 3: 14, 2: 11, 1: 9 } },
  ky: { 20: 260, 19: 248, 18: 236, 17: 224, 16: 212, 15: 200, 14: 188, 13: 176, 12: 164, 11: 152, 10: 140, 9: 128, 8: 116, 7: 104, 6: 92, 5: 80, 4: 68, 3: 56, 2: 44, 1: 32 }
};
const noteFor = (tab, v) => { let best = 0; for (const [n, th] of Object.entries(tab)) if (v >= th && Number(n) > best) best = Number(n); return best; };
const llLabel = v => { const p = Math.floor(v), s = Math.round((v - p) * 60); return s ? `${p} + ${s} s` : `${p}`; };
const Sport = { sex: 'H', ll: null, tr: null, ky: null };
App.V.sport = {
  title: 'Sport', eyebrow: 'CSO · épreuves physiques',
  render: () => {
    const prof = Store.data.profile;
    Sport.sex = prof.settings.sex || Sport.sex;
    const B = BAREME[Sport.sex];
    const n1 = Sport.ll != null ? noteFor(B.ll, Sport.ll) : null, n2 = Sport.tr != null ? noteFor(B.tr, Sport.tr) : null, n3 = Sport.ky != null ? noteFor(BAREME.ky, Sport.ky) : null;
    const notes = [n1, n2, n3].filter(v => v != null), moy = notes.length === 3 ? avg(notes) : null;
    const llOpts = [...new Set(Object.values(B.ll))].sort((a, b) => a - b);
    const log = prof.sport.slice(-8).reverse();
    return `<section class="detail">
      <p class="lead">Trois épreuves : Luc Léger, tractions (hommes) ou tirage à la poulie haute (femmes), et Killy (la chaise contre un mur). Le Killy a remplacé les squats en 2025.</p>
      <div class="seg" role="group" aria-label="Barème">${[['H', 'Barème hommes'], ['F', 'Barème femmes']].map(([k, l]) => `<button data-act="sex" data-v="${k}" aria-pressed="${Sport.sex === k}">${l}</button>`).join('')}</div>
      <div class="sportgrid">
        <div class="card"><span class="eyebrow">Luc Léger</span><select id="sp-ll"><option value="">Palier atteint…</option>${llOpts.map(v => `<option value="${v}" ${Sport.ll === v ? 'selected' : ''}>Palier ${llLabel(v)}</option>`).join('')}</select><div class="note mono">${n1 != null ? n1 + '/20' : '–'}</div><button class="btn ghost sm" data-go="bip">Lancer la bande-son</button></div>
        <div class="card"><span class="eyebrow">${Sport.sex === 'H' ? 'Tractions' : 'Tirage poulie'}</span><input id="sp-tr" type="number" min="0" max="80" inputmode="numeric" placeholder="Répétitions" value="${Sport.tr ?? ''}"><div class="note mono">${n2 != null ? n2 + '/20' : '–'}</div><span class="muted sm">${Sport.sex === 'H' ? 'Comptée bras tendus, sans balancement' : 'Charge selon ton poids : 25, 30 ou 35 kg'}</span></div>
        <div class="card"><span class="eyebrow">Killy (chaise)</span><div class="chrono mono" id="ky-t">${Sport.ky != null ? mmss(Sport.ky) : '0:00'}</div><div class="row2"><button class="btn sm" data-act="kygo" id="ky-b">${Killy.t0 ? 'Arrêter' : 'Démarrer'}</button><button class="btn ghost sm" data-act="kyreset">Effacer</button></div><div class="note mono">${n3 != null ? n3 + '/20' : '–'}</div></div>
      </div>
      <div class="card total"><div><span class="eyebrow">Moyenne sport</span><b class="mono big">${moy != null ? fr(moy, 1) + '/20' : '–'}</b></div><button class="btn" data-act="sportsave" ${moy == null ? 'disabled' : ''}>Enregistrer la séance</button></div>
      <p class="muted sm">Barème indicatif publié par un site de préparation (pilotemilitaire.fr). Des candidats citent d'autres seuils pour le Killy (2 min 48 pour 20/20 selon certains) : vérifie auprès de ton CIRFA.</p>
      ${log.length ? `<h3 class="sec">Journal</h3><div class="list">${log.map(e => `<div class="trow static"><span class="tile mono alt">${fr(e.moy, 1)}</span><span class="tr-m"><b>${new Date(e.ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</b><span>Léger ${llLabel(e.ll)} · ${e.sex === 'H' ? 'tractions' : 'poulie'} ${e.tr} · Killy ${mmss(e.ky)}</span></span></div>`).join('')}</div>` : ''}
      <h3 class="sec">Conseils</h3><ul class="tips"><li>Prépare-toi au moins six mois à l'avance, avec régularité.</li><li>Entraîne le Killy juste après la course : le jour J, il vient après le Luc Léger.</li><li>Moins de 5 tractions : alterne avec des tractions assistées. Plus de 10 : ajoute du lest.</li><li>Viser au moins le palier 10 à 11 au Luc Léger est un objectif souvent cité.</li></ul>
    </section>`;
  },
  mount: el => {
    $('#sp-ll', el).onchange = e => { Sport.ll = e.target.value ? Number(e.target.value) : null; App.refresh(); };
    $('#sp-tr', el).onchange = e => { Sport.tr = e.target.value === '' ? null : Number(e.target.value); App.refresh(); };
  }
};
const Killy = { t0: 0, h: 0 };
Act.sex = t => { Sport.sex = t.dataset.v; Store.data.profile.settings.sex = Sport.sex; Store.touchProfile(); App.refresh(); };
Act.kygo = () => {
  if (!Killy.t0) {
    Killy.t0 = Date.now(); $('#ky-b').textContent = 'Arrêter';
    Killy.h = setInterval(() => { const el = $('#ky-t'); if (el) el.textContent = mmss((Date.now() - Killy.t0) / 1000); }, 200);
  } else { clearInterval(Killy.h); Sport.ky = Math.round((Date.now() - Killy.t0) / 1000); Killy.t0 = 0; App.refresh(); }
};
Act.kyreset = () => { clearInterval(Killy.h); Killy.t0 = 0; Sport.ky = null; App.refresh(); };
Act.sportsave = () => {
  const B = BAREME[Sport.sex];
  const n = [noteFor(B.ll, Sport.ll), noteFor(B.tr, Sport.tr), noteFor(BAREME.ky, Sport.ky)], moy = avg(n);
  const e = { ts: Date.now(), sex: Sport.sex, ll: Sport.ll, tr: Sport.tr, ky: Sport.ky, notes: n, moy };
  Store.data.profile.sport.push(e); Store.touchProfile();
  Store.add({ id: newId(), t: 'sport', ts: e.ts, m: 'log', c: Math.round(moy * 10) / 10, n: 20, a: 3, d: 0, s: Math.round(moy * 5) });
  toast('Séance de sport enregistrée'); App.refresh();
};

/* Bande-son Luc Léger : 1 min d'échauffement à 8 km/h, puis +0,5 km/h par palier d'une minute */
const Bip = {
  ac: null, run: false, t0: 0, raf: 0, next: 0, pal: 0, shuttle: 0,
  beep(f = 880, d = 0.12, when = 0) { const o = this.ac.createOscillator(), g = this.ac.createGain(); o.frequency.value = f; o.connect(g); g.connect(this.ac.destination); const t = this.ac.currentTime + when; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.4, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.start(t); o.stop(t + d + 0.02); },
  speed(p) { return 8 + 0.5 * p; },
  start() {
    try { this.ac = this.ac || new (window.AudioContext || window.webkitAudioContext)(); this.ac.resume(); } catch { toast('Le son est indisponible sur cet appareil'); return; }
    this.run = true; this.t0 = performance.now(); this.pal = 0; this.shuttle = 0; this.next = 0; this.beep(660, 0.3);
    const loop = () => {
      if (!this.run) return;
      const t = (performance.now() - this.t0) / 1000, pal = Math.floor(t / 60);
      if (pal > 12) { this.stop(true); return; }
      if (pal !== this.pal) { this.pal = pal; [0, 0.18, 0.36].forEach(w => this.beep(990, 0.1, w)); }
      if (t >= this.next) { this.shuttle++; this.beep(880); this.next += 20 / (this.speed(this.pal) / 3.6); }
      const el = $('#bip-st');
      if (el) el.innerHTML = `<div><b class="mono">${this.pal === 0 ? 'Éch.' : this.pal}</b><span>palier</span></div><div><b class="mono">${fr(this.speed(this.pal), 1)}</b><span>km/h</span></div><div><b class="mono">${this.shuttle}</b><span>allers</span></div><div><b class="mono">${mmss(t)}</b><span>temps</span></div>`;
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
    Wake.on(); App.refresh();
  },
  stop(done) {
    if (!this.run) return;
    this.run = false; cancelAnimationFrame(this.raf); Wake.off();
    const t = (performance.now() - this.t0) / 1000, pal = Math.min(12, Math.floor(t / 60)), sec = t - pal * 60;
    const v = pal + Math.floor(Math.min(59, sec) / 15) * 0.25;
    Sport.ll = pal >= 1 ? Math.max(...Object.values(BAREME[Sport.sex].ll).filter(x => x <= v), 0) || null : null;
    this.result = { pal, sec: Math.round(sec), done };
    App.refresh();
  }
};
App.V.bip = {
  title: 'Bande-son Luc Léger', eyebrow: 'Sport · navette 20 m',
  render: () => `<section class="detail">
    <p class="lead">Place deux plots à 20 m. À chaque bip, tu dois avoir atteint l'autre plot. Trois bips rapprochés annoncent le palier suivant (+0,5 km/h).</p>
    <div class="kpis big" id="bip-st"><div><b class="mono">–</b><span>palier</span></div><div><b class="mono">8</b><span>km/h</span></div><div><b class="mono">0</b><span>allers</span></div><div><b class="mono">0:00</b><span>temps</span></div></div>
    <div class="actions">${Bip.run ? '<button class="btn danger" data-act="bipstop">J\'arrête : noter mon palier</button>' : '<button class="btn" data-act="bipgo">Démarrer (1 min d\'échauffement à 8 km/h)</button>'}</div>
    ${Bip.result ? `<div class="card"><span class="eyebrow">Dernier essai</span><p>Arrêt au palier ${Bip.result.pal} après ${Bip.result.sec} s${Sport.ll ? ` : retenu « palier ${llLabel(Sport.ll)} » pour le barème` : ''}.</p><button class="btn ghost sm" data-act="back">Revenir au barème</button></div>` : ''}
    <p class="muted sm">Bande-son indicative, construite à partir de la description publiée (départ 8 km/h, paliers d'une minute, arrêt au palier 12). Monte le volume et garde l'écran allumé.</p></section>`
};
Act.bipgo = () => Bip.start();
Act.bipstop = () => Bip.stop(false);
Act.back = () => App.back();

/* ---------------- Lettre de motivation ---------------- */
const Lettre = { t0: 0, h: 0, saveH: 0 };
const LETTRE_POINTS = ['Pourquoi l\'ALAT : l\'aérocombat, les missions au contact des troupes', 'Pourquoi devenir officier, pas seulement pilote', 'Ton parcours et ce qui t\'a préparé (sport, responsabilités, BIA, aéroclub)', 'Des qualités prouvées par des faits', 'Ce que tu sais de la formation : Saint-Cyr Coëtquidan, Dax, Le Cannet-des-Maures', 'Ta disponibilité : mutations, OPEX, vie en régiment', 'Une conclusion et une formule de politesse'];
App.V.lettre = {
  title: 'Lettre de motivation', eyebrow: 'SECMA · jour 1',
  render: () => {
    const txt = Store.data.profile.lettre || '', words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
    return `<section class="detail">
      <p class="lead">Le jour J, tu la rédiges à la main en 15 minutes. Elle est ensuite lue par l'officier et sert de base aux entretiens : connais-la dans ses grandes lignes et reste cohérent.</p>
      <div class="lettre-bar"><div class="chrono mono" id="lt-t">${Lettre.t0 ? '' : '15:00'}</div><button class="btn sm" data-act="ltgo">${Lettre.t0 ? 'Arrêter' : 'Chrono 15 min'}</button><span class="muted sm mono" id="lt-w">${words} mots</span></div>
      <label class="sr" for="lt-txt">Ta lettre</label>
      <textarea id="lt-txt" rows="14" placeholder="Mon colonel,&#10;&#10;Depuis …">${esc(txt)}</textarea>
      <p class="muted sm">Brouillon enregistré automatiquement${Store.online ? ' et synchronisé entre tes appareils' : ' sur cet appareil'}.</p>
      <h3 class="sec">Points à couvrir</h3><ul class="checks">${LETTRE_POINTS.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      <h3 class="sec">Conseils</h3><ul class="tips"><li>Écris lisiblement, sans ratures : entraîne-toi sur papier avec ce chrono.</li><li>Une page suffit. Vise des phrases courtes et des exemples concrets.</li><li>Zéro faute : fais-la relire, puis réécris-la de mémoire en 15 minutes.</li></ul>
    </section>`;
  },
  mount: el => {
    const ta = $('#lt-txt', el);
    ta.oninput = () => {
      const w = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0; $('#lt-w').textContent = w + ' mots';
      clearTimeout(Lettre.saveH); Lettre.saveH = setTimeout(() => { Store.data.profile.lettre = ta.value; Store.touchProfile(); }, 900);
    };
    if (Lettre.t0) Lettre.tick();
  }
};
Lettre.tick = () => { const el = $('#lt-t'); if (!el) return; const rem = 900 - (Date.now() - Lettre.t0) / 1000; el.textContent = mmss(rem); el.classList.toggle('low', rem < 60); if (rem <= 0) { clearInterval(Lettre.h); Lettre.t0 = 0; toast('15 minutes écoulées : pose le stylo'); App.refresh(); } };
Act.ltgo = () => { if (Lettre.t0) { clearInterval(Lettre.h); Lettre.t0 = 0; } else { Lettre.t0 = Date.now(); Lettre.h = setInterval(Lettre.tick, 500); } App.refresh(); };

/* ---------------- Entretiens ---------------- */
const ITW = DATA.ITW.map((l, i) => { const [cat, q, tip] = l.split('|'); return { i, cat, q, tip }; });
const ITW_CATS = ['Motivation', 'Personnalité', 'Mise en situation', 'Connaissances'];
const Interview = { cur: null, t0: 0, h: 0, show: false };
App.V.itw = {
  title: 'Entretiens', eyebrow: 'Psychologue et officier',
  render: p => {
    const cat = p.cat || 'Motivation';
    const qs = ITW.filter(x => x.cat === cat), notes = Store.data.profile.itw;
    const cur = Interview.cur;
    return `<section class="detail">
      <p class="lead">Les candidats décrivent un entretien psychologue « généraliste » et un entretien officier de 30 à 45 minutes, présenté comme l'un des plus importants en commission.</p>
      <div class="simq card">${cur ? `<span class="eyebrow">${esc(cur.cat)}</span><p class="q">${esc(cur.q)}</p><div class="chrono mono" id="itw-t">2:00</div>${Interview.show ? `<p class="tipbox">${esc(cur.tip)}</p>` : ''}<div class="row2"><button class="btn ghost sm" data-act="itwtip">${Interview.show ? 'Masquer les pistes' : 'Voir les pistes'}</button><button class="btn sm" data-act="itwnext">Question suivante</button></div>`
        : `<span class="eyebrow">Simulation</span><p>Une question au hasard, 2 minutes pour répondre à voix haute, puis les pistes.</p><button class="btn" data-act="itwnext">Me poser une question</button>`}</div>
      <div class="seg wrap" role="group" aria-label="Thème">${ITW_CATS.map(c => `<button data-act="itwcat" data-v="${esc(c)}" aria-pressed="${c === cat}">${esc(c)}</button>`).join('')}</div>
      <div class="qa">${qs.map(x => `<details class="qa-i"><summary>${esc(x.q)}</summary><p>${esc(x.tip)}</p><label class="sr" for="n${x.i}">Ma réponse</label><textarea id="n${x.i}" data-n="${x.i}" rows="3" placeholder="Ma réponse, en quelques mots-clés…">${esc(notes[x.i] || '')}</textarea></details>`).join('')}</div>
    </section>`;
  },
  mount: el => {
    $$('textarea[data-n]', el).forEach(ta => ta.oninput = () => { clearTimeout(ta._h); ta._h = setTimeout(() => { Store.data.profile.itw[ta.dataset.n] = ta.value; Store.touchProfile(); }, 900); });
    if (Interview.cur) Interview.tick();
  }
};
Interview.tick = () => { const el = $('#itw-t'); if (!el) return; const rem = 120 - (Date.now() - Interview.t0) / 1000; el.textContent = mmss(rem); el.classList.toggle('low', rem < 20); };
Act.itwcat = t => { App.stacks[App.tab][App.stacks[App.tab].length - 1].p = { cat: t.dataset.v }; App.refresh(); };
Act.itwnext = () => { Interview.cur = R.pick(ITW.filter(x => x !== Interview.cur)); Interview.show = false; Interview.t0 = Date.now(); clearInterval(Interview.h); Interview.h = setInterval(Interview.tick, 500); App.refresh(); };
Act.itwtip = () => { Interview.show = !Interview.show; App.refresh(); };

/* ---------------- Fiches ALAT ---------------- */
const FICHES = DATA.FICHES.map(l => { const [cat, r, v] = l.split('|'); return { cat, r, v }; });
App.V.fiches = {
  title: 'Fiches ALAT', eyebrow: 'Révisions',
  render: p => {
    const cats = [...new Set(FICHES.map(f => f.cat))], cat = p.cat || cats[0];
    return `<section class="detail"><p class="lead">Touche une fiche pour la retourner. Essaie de réciter le verso avant de l'ouvrir.</p>
      <div class="seg wrap" role="group" aria-label="Thème">${cats.map(c => `<button data-act="ficat" data-v="${esc(c)}" aria-pressed="${c === cat}">${esc(c)}</button>`).join('')}</div>
      <div class="fiches">${FICHES.filter(f => f.cat === cat).map(f => `<details class="fiche"><summary>${esc(f.r)}</summary><p>${esc(f.v)}</p></details>`).join('')}</div>
      <p class="muted sm">Fiches de synthèse rédigées pour cette application. Vérifie les informations susceptibles d'évoluer (matériels en service, organisation) avant tes entretiens.</p></section>`;
  }
};
Act.ficat = t => { App.stacks[App.tab][App.stacks[App.tab].length - 1].p = { cat: t.dataset.v }; App.refresh(); };

/* ---------------- Pages d'information ---------------- */
const INFO = {
  perso: { title: 'Tests de personnalité', body: `<p class="lead">Au CSO comme à Tours, tu remplis des questionnaires de personnalité. Il n'y a ni bonne ni mauvaise réponse et il n'existe pas d'entraînement à proprement parler.</p>
    <ul class="tips"><li>Au CSO : des affirmations à noter selon qu'elles te correspondent (environ 80 en une vingtaine de minutes selon un site de préparation).</li><li>À Tours : plusieurs questionnaires chronométrés, dont un de 240 questions selon un candidat (2018). Si tu bloques sur une question, on peut te demander de justifier.</li><li>Le psychologue s'appuie sur ces résultats et sur le compte rendu du CSO : reste cohérent d'un test à l'autre et en entretien.</li><li>Ne cherche pas à paraître parfait : les incohérences se voient. Réponds vite et sincèrement.</li></ul>` },
  cempn: { title: 'Visite médicale CEMPN', body: `<p class="lead">Après Tours, l'aptitude médicale du personnel navigant est vérifiée dans un centre d'expertise (CEMPN), par exemple à l'hôpital Percy de Clamart.</p>
    <ul class="tips"><li>Examens cités : vue (acuité, couleurs, champ visuel), audition, cœur (ECG, effort), prise de sang et analyse d'urine, ORL.</li><li>Le daltonisme est décrit comme normalement rédhibitoire ; une forte myopie peut poser problème. Renseigne-toi auprès du CIRFA sur ta situation avant de candidater.</li><li>Conseils de candidats : dors bien, pas de sport intense dans les 24 h avant, et prévois des lunettes de soleil pour l'examen des yeux avec gouttes.</li><li>Résultats possibles : apte, inapte temporaire, inapte définitif.</li></ul>` }
};
App.V.info = { title: p => INFO[p.k].title, eyebrow: 'À savoir', render: p => `<section class="detail">${INFO[p.k].body}</section>` };

/* ---------------- Réglages ---------------- */
App.V.settings = {
  title: 'Réglages', eyebrow: 'Mes dates et mes données',
  render: () => {
    const d = Store.data.profile.dates;
    return `<section class="detail">
      <div class="card form"><label for="d-cso">Date de mon CSO</label><input type="date" id="d-cso" value="${d.cso || ''}"><label for="d-tours">Date de ma sélection à Tours</label><input type="date" id="d-tours" value="${d.tours || ''}"><p class="muted sm">Un compte à rebours s'affiche en haut des onglets CSO et Tours.</p></div>
      ${window.claude ? `<div class="card"><span class="eyebrow">Synchronisation</span><p>${Store.online ? 'Tes résultats sont enregistrés dans ton espace privé et synchronisés entre ton téléphone et ton ordinateur.' : 'Tes résultats sont enregistrés sur cet appareil. La synchronisation reprendra dès que l\'application pourra joindre ton espace.'}</p></div>`
        : `<div class="card"><span class="eyebrow">Sauvegarde</span><p>Tes résultats sont enregistrés sur ce téléphone, dans le navigateur. Fais une sauvegarde de temps en temps : elle te permet de les récupérer sur un autre appareil ou après avoir vidé les données du navigateur.</p><div class="row2"><button class="btn ghost" data-act="exportdata">Sauvegarder mes résultats</button><label class="btn ghost" for="imp">Restaurer une sauvegarde</label></div><input type="file" id="imp" accept="application/json,.json" hidden></div>`}
      ${window.claude ? '' : `<div class="card"><span class="eyebrow">Écran d'accueil</span>${window.__bip ? '<button class="btn" data-act="install">Installer l\'app sur ce téléphone</button>' : ''}<p>iPhone : dans Safari, touche le bouton Partager puis « Sur l'écran d'accueil ». Android : dans Chrome, menu ⋮ puis « Installer l'application » ou « Ajouter à l'écran d'accueil ».</p></div>`}
      <div class="card"><span class="eyebrow">Remise à zéro</span><p>Efface tous tes résultats, ton journal de sport et tes brouillons.</p>${Settings.confirm ? '<div class="row2"><button class="btn ghost" data-act="rstno">Annuler</button><button class="btn danger" data-act="rstyes">Tout effacer</button></div>' : '<button class="btn ghost" data-act="rstask">Effacer mes données</button>'}</div>
    </section>`;
  },
  mount: el => {
    ['cso', 'tours'].forEach(k => { $('#d-' + k, el).onchange = e => { Store.data.profile.dates[k] = e.target.value; Store.touchProfile(); toast('Date enregistrée'); }; });
    const imp = $('#imp', el);
    if (imp) imp.onchange = () => {
      const f = imp.files && imp.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { const n = Store.importData(JSON.parse(rd.result)); toast(n ? `${n} série${n > 1 ? 's' : ''} restaurée${n > 1 ? 's' : ''}` : 'Rien de nouveau dans cette sauvegarde'); } catch { toast('Ce fichier n\'est pas une sauvegarde de l\'app'); } };
      rd.readAsText(f);
    };
  }
};
Act.install = async () => { const p = window.__bip; if (!p) return; p.prompt(); try { await p.userChoice; } catch { /* fenêtre fermée */ } window.__bip = null; App.refresh(); };
Act.exportdata = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(Store.data)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = `prepa-alat-${dayKey()}.json`;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
  toast('Sauvegarde téléchargée');
};
const Settings = { confirm: false };
Act.rstask = () => { Settings.confirm = true; App.refresh(); };
Act.rstno = () => { Settings.confirm = false; App.refresh(); };
Act.rstyes = () => { Settings.confirm = false; Store.reset(); toast('Données effacées'); App.refresh(); };

/* ---------------- Onglet Bilan ---------------- */
const Bilan = { seg: lsGet('oscp-seg') || 'prog', tag: 'Tout' };
const WEIGHT = { scm1: 3, scm2: 3, orientation: 1.4, maths_t: 1.2, memo: 1.2, culture: 1.2, identif: 1.1, anglais: 1.2 };
function streak() {
  const days = [...new Set(Store.data.results.map(r => dayKey(r.ts)))].sort().reverse();
  if (!days.length) return 0;
  let n = 0, d = new Date();
  if (days[0] !== dayKey()) d.setDate(d.getDate() - 1);
  for (const k of days) { if (k === dayKey(d)) { n++; d.setDate(d.getDate() - 1); } else if (k < dayKey(d)) break; }
  return n;
}
function planNext() {
  const ids = [...TAMIC, 'anglais', ...SECMA.filter(i => i !== 'memo'), 'scm1'];
  const now = Date.now();
  const scored = ids.map(id => {
    const st = Stats.of(id), age = st.last ? (now - st.last.ts) / 86400000 : 30;
    const gap = st.avg == null ? 60 : 100 - st.avg;
    return { id, st, k: (gap + Math.min(age, 14) * 2) * (WEIGHT[id] || 1) };
  }).sort((a, b) => b.k - a.k);
  return scored.slice(0, 3);
}
App.V['bilan-home'] = {
  title: 'Bilan', eyebrow: 'Ma progression et les retours terrain',
  render: () => {
    const seg = Bilan.seg;
    const tabs = [['prog', 'Progression'], ['veille', 'Retours'], ['parcours', 'Parcours']];
    return `<div class="seg full" role="tablist">${tabs.map(([k, l]) => `<button role="tab" data-act="bseg" data-v="${k}" aria-pressed="${seg === k}">${l}</button>`).join('')}</div>
      ${seg === 'prog' ? Bilan.prog() : seg === 'veille' ? Bilan.veille() : Bilan.parcours()}`;
  }
};
Act.bseg = t => { Bilan.seg = t.dataset.v; lsSet('oscp-seg', Bilan.seg); App.refresh(); };
Act.btag = t => { Bilan.tag = t.dataset.v; App.refresh(); };
Act.plan = () => { const q = planNext().map(x => ({ id: x.id, mode: 'express' })); const f = q.shift(); Runner.start(f.id, 'express', q); };
Bilan.prog = () => {
  const rs = Store.data.results;
  const totMin = Math.round(rs.reduce((a, r) => a + (r.d || 0), 0) / 60);
  const all = [...TAMIC, 'anglais', ...SECMA, 'scm1', 'scm2', 'calcul', 'cultureg', 'sport'];
  const rows = all.map(id => ({ id, st: Stats.of(id) }));
  const done = rows.filter(r => r.st.avg != null).sort((a, b) => b.st.avg - a.st.avg);
  const strong = done.filter(r => r.st.avg >= 60).slice(0, 3), weak = done.slice().reverse().filter(r => r.st.avg < 75).slice(0, 3);
  const never = rows.filter(r => r.st.n === 0 && r.id !== 'sport' && r.id !== 'cultureg');
  const plan = planNext();
  const stg = [['CSO · TAMI-C et anglais', stageScore([...TAMIC, 'anglais'])], ['Tours · SECMA', stageScore(SECMA)], ['Simulateur SCM', stageScore(['scm1', 'scm2'])]];
  const globalScore = avg(stg.map(([, s]) => (s.score ?? 0)));
  const name = id => TESTS[id] ? TESTS[id].name : id;
  return `<div class="kpis strip"><div><b class="mono">${Math.round(globalScore)}%</b><span>préparation globale</span></div><div><b class="mono">${rs.length}</b><span>séries</span></div><div><b class="mono">${totMin}</b><span>minutes</span></div><div><b class="mono">${streak()}</b><span>jours d'affilée</span></div></div>
    <div class="card plan"><span class="eyebrow">Séance conseillée · environ 10 min</span><ol>${plan.map(x => `<li><b>${esc(name(x.id))}</b><span>${x.st.avg == null ? 'jamais travaillé' : `moyenne ${Math.round(x.st.avg)} %`}${x.st.last ? ` · ${ago(x.st.last.ts)}` : ''}</span></li>`).join('')}</ol><button class="btn" data-act="plan">Lancer la séance</button></div>
    <h3 class="sec">Par étape</h3><div class="stages">${stg.map(([l, s]) => `<div class="stage"><div class="st-h"><b>${l}</b><span class="mono">${s.score == null ? '–' : Math.round(s.score) + ' %'}</span></div><div class="bar"><i class="${Stats.band(s.score)}" style="width:${Math.round(s.score || 0)}%"></i></div><span class="muted sm">${s.done}/${s.total} épreuves travaillées</span></div>`).join('')}</div>
    <div class="twocol">
      <div class="card"><span class="eyebrow ok">Points forts</span>${strong.length ? `<ul class="rank">${strong.map(r => `<li><span>${esc(name(r.id))}</span>${chip(r.st.avg)}</li>`).join('')}</ul>` : '<p class="muted sm">Ils apparaîtront après quelques séries.</p>'}</div>
      <div class="card"><span class="eyebrow ko">À travailler en priorité</span>${weak.length ? `<ul class="rank">${weak.map(r => `<li><span>${esc(name(r.id))}</span>${chip(r.st.avg)}</li>`).join('')}</ul>` : '<p class="muted sm">Rien de faible pour l\'instant.</p>'}</div>
    </div>
    ${never.length ? `<p class="muted sm">Jamais travaillé : ${never.map(r => esc(name(r.id))).join(', ')}.</p>` : ''}
    <h3 class="sec">Toutes les épreuves</h3>
    <div class="table">${rows.filter(r => r.st.n).map(r => `<div class="tb-r"><span class="tile mono sm">${TESTS[r.id] ? TESTS[r.id].code : ''}</span><span class="tb-n">${esc(name(r.id))}<small>${r.st.n} série${r.st.n > 1 ? 's' : ''} · meilleur ${r.st.best} %</small></span>${spark(r.st.series, 70, 22)}${chip(r.st.avg)}</div>`).join('') || '<p class="muted">Tes résultats apparaîtront ici dès ta première série. Lance la séance conseillée ci-dessus pour commencer.</p>'}</div>
    ${rs.length ? `<h3 class="sec">Dernières séries</h3><div class="hist">${rs.slice(-12).reverse().map(r => `<div class="hs-r"><span class="mono muted">${new Date(r.ts).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span><span>${esc(name(r.t))}<small>${MODE_LABEL[r.m] || (r.m === 'sprint' ? 'Sprint' : r.m === 'log' ? 'Journal' : '')}</small></span>${chip(r.s)}</div>`).join('')}</div>` : ''}
    <div class="foot-links"><button class="linkbtn" data-go="settings">Mes dates et mes données</button></div>`;
};
Bilan.veille = () => {
  const v = Store.veille, st = Store.veilleState;
  if (!v) {
    const msg = st === 'nofile' ? 'Impossible de charger les retours terrain : vérifie ta connexion internet, puis rouvre cet onglet.'
      : st === 'err' ? 'Impossible de charger les retours pour le moment. Réessaie un peu plus tard.'
      : st === 'slow' ? 'Les retours terrain mettent du temps à arriver. Vérifie ta connexion.'
      : st === 'ok' ? 'Aucun retour publié pour l\'instant. La prochaine mise à jour les ajoutera ici.' : 'Chargement des retours terrain…';
    return `<div class="empty"><span class="eyebrow">Retours terrain</span><p>${msg}</p><p class="muted sm">Ils sont mis à jour toutes les trois semaines à partir des forums et sites de candidats.</p></div>`;
  }
  const items = Array.isArray(v.items) ? v.items : [];
  const tags = ['Tout', ...new Set(items.map(i => i.tag).filter(Boolean))];
  const list = Bilan.tag === 'Tout' ? items : items.filter(i => i.tag === Bilan.tag);
  return `<div class="veille-h"><div><span class="eyebrow">Dernière mise à jour</span><b>${esc(fmtDate(v.updatedAt))}</b></div><div><span class="eyebrow">Prochaine</span><b>${esc(fmtDate(v.nextUpdate))}</b></div></div>
    ${Array.isArray(v.changes) && v.changes.length ? `<div class="card news"><span class="eyebrow">Nouveautés de cette mise à jour</span><ul>${v.changes.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>` : ''}
    <div class="seg wrap" role="group" aria-label="Filtrer">${tags.map(t => `<button data-act="btag" data-v="${esc(t)}" aria-pressed="${Bilan.tag === t}">${esc(t)}</button>`).join('')}</div>
    <div class="feed">${list.map(i => `<article class="fd"><div class="fd-h"><span class="tag">${esc(i.tag || '')}</span><span class="mono muted sm">${esc(i.date || '')}</span></div><h4>${esc(i.title)}</h4><p>${esc(i.body)}</p>${i.src ? `<span class="src">${i.url && /^https:\/\//.test(i.url) ? `<a href="${esc(i.url)}" target="_blank" rel="noopener">${esc(i.src)}</a>` : esc(i.src)}</span>` : ''}</article>`).join('')}</div>
    <p class="muted sm">Témoignages et informations de sites non officiels : seuls ton CIRFA et le site officiel de recrutement de l'armée de Terre font foi.</p>`;
};
const fmtDate = s => { if (!s) return '–'; const d = new Date(s + (s.length === 10 ? 'T12:00:00' : '')); return isNaN(d) ? s : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); };
Bilan.parcours = () => {
  const steps = [
    ['CIRFA Terre', 'Dossier, entretien d\'information, vérification des conditions. Environ 2 mois avant la convocation.'],
    ['CSO', 'TAMI-C (6 sous-tests), anglais (150 QCM en 55 min), personnalité, sport, visite médicale initiale, entretien de motivation.'],
    ['SECMA · Tours', 'Lettre de motivation, maths, orientation, différences, mémorisation, identification, culture, simulateur SCM (éliminatoire), entretiens psychologue et officier.'],
    ['CEMPN', 'Aptitude médicale du personnel navigant : vue, audition, cœur, analyses, ORL. Attente de 1 à 4 mois selon les candidats.'],
    ['Commission', 'Plusieurs commissions par an selon les candidats (mars, mai, juillet en 2024). Liste principale, liste complémentaire ou refus.'],
    ['Saint-Cyr Coëtquidan', 'Formation initiale d\'officier (plusieurs mois selon les sources).'],
    ['EALAT Dax', 'Pilotage de base sur H120 Colibri et brevet de pilote militaire d\'hélicoptère.'],
    ['Le Cannet-des-Maures', 'Spécialisation sur hélicoptère d\'armes (Tigre, Caïman…), puis affectation en régiment.']
  ];
  return `<div class="card cond"><span class="eyebrow">Conditions annoncées par les sites de préparation</span><ul><li>Nationalité française, baccalauréat (toutes filières), JDC effectuée</li><li>18 à 32 ans au dépôt du dossier</li><li>Deux tentatives au maximum, espacées de deux ans</li></ul><p class="muted sm">À confirmer auprès de ton CIRFA : ces conditions évoluent.</p></div>
    <ol class="timeline">${steps.map(([t, d]) => `<li><b>${t}</b><p>${d}</p></li>`).join('')}</ol>
    <h3 class="sec">Sources consultées</h3>
    <ul class="links"><li><a href="https://www.devenez-pilote.fr/alat" target="_blank" rel="noopener">devenez-pilote.fr · ALAT</a></li><li><a href="https://pilotemilitaire.fr/alat/" target="_blank" rel="noopener">pilotemilitaire.fr · ALAT</a></li><li><a href="https://piloteready.fr/alat/epreuves" target="_blank" rel="noopener">piloteready.fr · épreuves ALAT</a></li><li><a href="https://forum.aeronet-fr.org/viewtopic.php?t=35343" target="_blank" rel="noopener">Forum Aéronet · Pilote ALAT</a></li><li><a href="https://www.sengager.fr" target="_blank" rel="noopener">sengager.fr · recrutement officiel de l'armée de Terre</a></li></ul>`;
};

/* ---------------- Démarrage ---------------- */
function boot() {
  Store.init();
  const t = lsGet('oscp-tab'); if (t && App.stacks[t]) App.tab = t;
  App.render(0);
  Store.on(() => App.softRefresh());
  Store.connect();
}
boot();
