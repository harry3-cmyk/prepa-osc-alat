'use strict';
/* Banques de contenu. Formats compacts, une entrée par ligne :
   SYN  : mot=synonyme|leurre|leurre|leurre
   ANT  : mot=antonyme|leurre|leurre|leurre
   DEF  : définition=mot|leurre|leurre|leurre
   INTR : intrus|mot|mot|mot|mot|raison
   QCM  : question|bonne réponse|leurre|leurre|leurre|explication (facultative)
   ENG  : phrase avec ___|bonne réponse|leurre|leurre|leurre */
const lines = s => s.trim().split('\n').map(l => l.trim()).filter(Boolean);

const DATA = {};

DATA.SYN = lines(`
Abnégation=Sacrifice|Négation|Obstination|Abolition
Acerbe=Mordant|Docile|Accessible|Apaisant
Affable=Aimable|Affligé|Fiable|Hautain
Aléatoire=Incertain|Alimentaire|Régulier|Allégé
Altruiste=Généreux|Égoïste|Autoritaire|Alternatif
Anodin=Insignifiant|Anonyme|Grave|Douloureux
Apathique=Indolent|Sympathique|Énergique|Apeuré
Âpre=Rude|Doux|Ample|Habile
Arbitraire=Injustifié|Arboricole|Équitable|Arithmétique
Ardu=Difficile|Ardent|Aisé|Arrondi
Assidu=Appliqué|Acide|Absent|Assis
Austère=Sévère|Fastueux|Austral|Aléatoire
Avare=Pingre|Prodigue|Aveugle|Agile
Belliqueux=Guerrier|Pacifique|Beau|Bénévole
Caduc=Périmé|Cadet|Récent|Calme
Candide=Naïf|Candidat|Rusé|Brûlant
Circonspect=Prudent|Circonscrit|Imprudent|Rond
Clairvoyant=Perspicace|Aveugle|Lumineux|Bavard
Concis=Bref|Prolixe|Concave|Conscient
Corroborer=Confirmer|Corrompre|Infirmer|Collaborer
Cupide=Avide|Généreux|Cupule|Stupide
Désuet=Démodé|Désert|Moderne|Déçu
Diligent=Zélé|Négligent|Dirigeant|Dilué
Éloquent=Expressif|Muet|Élégant|Éloigné
Éminent=Remarquable|Imminent|Médiocre|Émouvant
Enclin=Porté|Réfractaire|Enclavé|Encombré
Équivoque=Ambigu|Univoque|Équitable|Équilibré
Érudit=Savant|Ignorant|Éruptif|Exclu
Exhaustif=Complet|Partiel|Excessif|Exotique
Fallacieux=Trompeur|Sincère|Facétieux|Fastidieux
Fastidieux=Ennuyeux|Fastueux|Passionnant|Facile
Fortuit=Accidentel|Gratuit|Prévu|Fortifié
Fougueux=Impétueux|Calme|Fongique|Fourbe
Frugal=Sobre|Copieux|Fragile|Fructueux
Futile=Insignifiant|Utile|Fertile|Furtif
Hâbleur=Vantard|Modeste|Habile|Habitué
Hétéroclite=Disparate|Homogène|Hétérodoxe|Héroïque
Hilare=Joyeux|Morose|Hiérarchique|Hâtif
Hostile=Défavorable|Amical|Hospitalier|Hôtelier
Hypothétique=Incertain|Avéré|Hypocrite|Hydraulique
Impavide=Intrépide|Peureux|Impair|Insipide
Impétueux=Fougueux|Placide|Impérieux|Impie
Inéluctable=Inévitable|Évitable|Ineffable|Illisible
Inextricable=Embrouillé|Simple|Inexorable|Extrait
Intègre=Honnête|Corrompu|Intégral|Interne
Laconique=Concis|Bavard|Lacustre|Logique
Léthargique=Somnolent|Alerte|Létal|Liturgique
Loquace=Bavard|Taciturne|Loufoque|Local
Lucide=Clairvoyant|Confus|Lucratif|Ludique
Mansuétude=Indulgence|Sévérité|Mansarde|Mésentente
Méticuleux=Minutieux|Négligent|Métallique|Méfiant
Mièvre=Fade|Vigoureux|Mineur|Mûr
Morose=Maussade|Gai|Mordant|Rosé
Nonchalant=Indolent|Vif|Nocturne|Nuancé
Obsolète=Dépassé|Actuel|Obstiné|Obscur
Obtempérer=Obéir|Désobéir|Obtenir|Tempérer
Onéreux=Coûteux|Gratuit|Onirique|Honoré
Opiniâtre=Tenace|Versatile|Opiacé|Optimiste
Ostensible=Visible|Discret|Osseux|Hostile
Pérenne=Durable|Éphémère|Paternel|Pérégrin
Perfide=Déloyal|Fidèle|Perforé|Parfait
Pertinent=Approprié|Inadapté|Persistant|Impertinent
Placide=Calme|Nerveux|Placé|Plat
Prolixe=Bavard|Concis|Prolifique|Prophétique
Prompt=Rapide|Lent|Propre|Probable
Prodigue=Dépensier|Avare|Prodige|Prudent
Pusillanime=Craintif|Courageux|Unanime|Puéril
Rébarbatif=Rebutant|Attrayant|Rebelle|Barbu
Récalcitrant=Rebelle|Docile|Récurrent|Calcifié
Rédhibitoire=Éliminatoire|Accessoire|Rédempteur|Répétitif
Saugrenu=Bizarre|Normal|Sauvage|Sanguin
Sibyllin=Énigmatique|Clair|Sifflant|Sylvestre
Sommaire=Succinct|Détaillé|Sombre|Somptueux
Somptueux=Luxueux|Modeste|Somnolent|Sommaire
Spontané=Naturel|Calculé|Sportif|Spatial
Taciturne=Silencieux|Bavard|Tactile|Turbulent
Téméraire=Audacieux|Prudent|Temporaire|Ténébreux
Tenace=Obstiné|Faible|Tendre|Ténu
Torride=Brûlant|Glacial|Torrentiel|Tordu
Truculent=Pittoresque|Fade|Turbulent|Truqué
Ubiquité=Omniprésence|Absence|Iniquité|Utilité
Urbain=Courtois|Rustre|Urgent|Turbulent
Velléitaire=Indécis|Résolu|Véloce|Vénal
Véhément=Violent|Calme|Véritable|Vêtement
Vénal=Corruptible|Intègre|Veineux|Vénérable
Versatile=Changeant|Constant|Polyvalent|Verbal
Vétuste=Délabré|Neuf|Vêtu|Vaste
Zélé=Dévoué|Paresseux|Ailé|Zébré
Atermoyer=Temporiser|Accélérer|Atterrir|Amarrer
Exhorter=Encourager|Dissuader|Extorquer|Exhumer
Entériner=Ratifier|Annuler|Enterrer|Enrayer
Juguler=Enrayer|Favoriser|Jongler|Jubiler
Péricliter=Décliner|Prospérer|Pétiller|Pérorer
Pallier=Remédier|Aggraver|Palper|Parier
Proscrire=Interdire|Autoriser|Prescrire|Proposer
Récuser=Rejeter|Accepter|Accuser|Récupérer
Spolier=Déposséder|Restituer|Souiller|Spécifier
Fustiger=Critiquer|Louer|Fusionner|Fumiger
Galvaniser=Enthousiasmer|Décourager|Galvauder|Gaver
Obérer=Compromettre|Assainir|Opérer|Oublier
Rigoureux=Strict|Laxiste|Rugueux|Rieur
Aguerri=Expérimenté|Novice|Agressif|Aigri
Abrupt=Escarpé|Doux|Absurde|Abrité
Alacrité=Entrain|Lassitude|Acidité|Alarme
`);

DATA.ANT = lines(`
Prolixe=Concis|Bavard|Prolifique|Lent
Altruiste=Égoïste|Généreux|Altier|Absent
Pérenne=Éphémère|Durable|Paternel|Ancien
Prodigue=Avare|Dépensier|Prodige|Riche
Austère=Fastueux|Sévère|Rigide|Austral
Hostile=Amical|Agressif|Hôtelier|Rude
Docile=Rebelle|Obéissant|Docte|Calme
Placide=Nerveux|Calme|Placé|Lent
Explicite=Implicite|Clair|Exprès|Explosif
Concave=Convexe|Creux|Concis|Conique
Ascendant=Descendant|Montant|Assistant|Absent
Optimiste=Pessimiste|Confiant|Optique|Opportun
Unanime=Partagé|Uni|Animé|Total
Avéré=Infondé|Prouvé|Avide|Aveugle
Diurne=Nocturne|Quotidien|Durable|Diffus
Intègre=Corrompu|Honnête|Intégral|Entier
Néophyte=Expert|Débutant|Néon|Novice
Clément=Impitoyable|Indulgent|Climatique|Clair
Antérieur=Postérieur|Précédent|Intérieur|Ancien
Facultatif=Obligatoire|Optionnel|Facile|Fautif
Majorer=Minorer|Augmenter|Majeur|Mesurer
Éphémère=Durable|Passager|Fragile|Rapide
Licite=Illicite|Légal|Lisse|Lucide
Loquace=Taciturne|Bavard|Local|Léger
Profane=Initié|Ignorant|Profond|Prophète
Acquiescer=Refuser|Accepter|Acquérir|Agir
Bénin=Grave|Anodin|Béni|Bénéfique
Exhaustif=Partiel|Complet|Épuisé|Excessif
Lucide=Confus|Clairvoyant|Lumineux|Ludique
Hétérogène=Homogène|Disparate|Hétéroclite|Hérétique
Proscrire=Autoriser|Interdire|Prescrire|Décrire
Ratifier=Annuler|Valider|Raréfier|Rectifier
Amplifier=Atténuer|Accroître|Simplifier|Appliquer
Exogène=Endogène|Externe|Exotique|Oxygène
Centrifuge=Centripète|Excentré|Central|Fugace
Économe=Dépensier|Épargnant|Économique|Ému
Sédentaire=Nomade|Casanier|Sédimentaire|Solitaire
Rural=Urbain|Champêtre|Royal|Rugueux
Zénith=Nadir|Sommet|Zèbre|Azimut
Aval=Amont|Descente|Avalanche|Avant
Modeste=Orgueilleux|Humble|Moderne|Modique
Prospérer=Péricliter|Fleurir|Prospecter|Persévérer
Spontané=Prémédité|Naturel|Sportif|Soudain
Tenace=Velléitaire|Obstiné|Tendu|Ténu
Véridique=Mensonger|Exact|Véritable|Vénérable
Volubile=Taciturne|Bavard|Volatil|Voluptueux
Paroxysme=Accalmie|Apogée|Paradoxe|Parodie
Indigent=Opulent|Pauvre|Indigène|Indigné
Magnanime=Mesquin|Généreux|Magnifique|Unanime
Hardi=Timoré|Audacieux|Hâtif|Ardent
Belliqueux=Pacifique|Guerrier|Belliciste|Beau
Sagace=Obtus|Perspicace|Sage|Salace
Assidu=Irrégulier|Appliqué|Acide|Assis
Sobriété=Excès|Modération|Sobriquet|Sévérité
Dissiper=Rassembler|Disperser|Dissimuler|Dessiner
Abondance=Pénurie|Profusion|Abandon|Aisance
Apogée=Déclin|Sommet|Apothéose|Apôtre
Allégresse=Tristesse|Joie|Allègement|Adresse
Opaque=Transparent|Sombre|Opulent|Ombragé
Ardu=Facile|Difficile|Ardent|Aride
`);

DATA.DEF = lines(`
Qui dure très peu de temps=Éphémère|Pérenne|Épique|Empirique
Qui parle très peu=Taciturne|Loquace|Tacite|Turbulent
Personne qui débute dans une activité=Néophyte|Expert|Néologisme|Prosélyte
Qui manque de courage=Pusillanime|Magnanime|Unanime|Téméraire
Endurci par l'expérience, notamment du combat=Aguerri|Agressif|Novice|Aigri
Peur soudaine et collective=Panique|Pagaille|Phobie|Patience
Mot de sens contraire=Antonyme|Synonyme|Homonyme|Paronyme
Mot de même sens=Synonyme|Antonyme|Homonyme|Acronyme
Mot qui se prononce comme un autre mais n'a pas le même sens=Homonyme|Synonyme|Antonyme|Pseudonyme
Mot très proche d'un autre par la forme mais de sens différent=Paronyme|Homonyme|Synonyme|Anonyme
Répétition inutile d'une même idée (« monter en haut »)=Pléonasme|Oxymore|Métaphore|Litote
Figure qui associe deux termes contradictoires=Oxymore|Pléonasme|Euphémisme|Hyperbole
Figure qui dit moins pour suggérer plus=Litote|Hyperbole|Métonymie|Anaphore
Exagération volontaire=Hyperbole|Litote|Euphémisme|Parabole
Qui se rapporte aux lacs=Lacustre|Lactique|Laconique|Fluvial
Qui vit ou se produit la nuit=Nocturne|Diurne|Nocif|Nautique
Qui se rapporte aux fleuves et rivières=Fluvial|Pluvial|Fluide|Littoral
Qui se rapporte à la pluie=Pluvial|Fluvial|Pluriel|Pulvérulent
Qu'on ne peut pas éviter=Inéluctable|Inextricable|Ineffable|Inaltérable
Qu'on ne peut exprimer par des mots=Ineffable|Inéluctable|Infâme|Indélébile
Qui ne peut pas s'effacer=Indélébile|Ineffable|Indécis|Incrédule
Qui ne croit pas facilement=Incrédule|Crédule|Incroyable|Indécis
Qui croit trop facilement=Crédule|Incrédule|Cruel|Crédible
Haine ou mépris du genre humain=Misanthropie|Philanthropie|Misogynie|Mythomanie
Tendance pathologique au mensonge=Mythomanie|Mégalomanie|Kleptomanie|Misanthropie
Impulsion pathologique à voler=Kleptomanie|Mythomanie|Pyromanie|Mélomanie
Qui aime la musique=Mélomane|Mégalomane|Mythomane|Métronome
Science qui étudie l'atmosphère et le temps qu'il fait=Météorologie|Astronomie|Géologie|Climatisation
Instrument qui mesure la pression atmosphérique=Baromètre|Thermomètre|Hygromètre|Anémomètre
Instrument qui mesure la vitesse du vent=Anémomètre|Baromètre|Hygromètre|Odomètre
Instrument qui mesure l'humidité de l'air=Hygromètre|Hydromètre|Baromètre|Anémomètre
Partie arrière d'un navire=Poupe|Proue|Bâbord|Tribord
Côté gauche d'un navire, en regardant vers l'avant=Bâbord|Tribord|Poupe|Proue
Fait de se poser sur l'eau=Amerrissage|Alunissage|Atterrissage|Appontage
Fait de se poser sur le pont d'un navire=Appontage|Amerrissage|Accostage|Abordage
Qui n'est plus valable=Caduc|Valide|Candide|Cadastral
Confirmer officiellement=Ratifier|Raréfier|Rectifier|Réfuter
Démontrer la fausseté de=Réfuter|Ratifier|Réputer|Corroborer
Qui pardonne facilement, généreux d'esprit=Magnanime|Pusillanime|Unanime|Anonyme
Qui s'expose au danger sans réfléchir=Téméraire|Timoré|Temporaire|Tempéré
Qui manque d'assurance, craintif=Timoré|Téméraire|Timbré|Tiède
Remettre à plus tard=Différer|Déférer|Diffamer|Digérer
Qui a plusieurs sens=Polysémique|Polyglotte|Polymorphe|Polyvalent
Qui parle plusieurs langues=Polyglotte|Polysémique|Polygame|Polygone
Qui se fait en secret, en cachette=Clandestin|Clairsemé|Clément|Explicite
Qui est permis par la loi=Licite|Illicite|Lucide|Lisible
Qui se rapporte à la guerre=Martial|Marital|Marial|Matinal
Qui se rapporte au mariage=Marital|Martial|Mortel|Matinal
`);

DATA.INTR = lines(`
Sapin|Chêne|Hêtre|Érable|Frêne|Le sapin est un résineux, les autres sont des feuillus.
Hautbois|Violon|Alto|Violoncelle|Contrebasse|Le hautbois est un instrument à vent, les autres sont à cordes.
Lune|Mercure|Vénus|Mars|Jupiter|La Lune est un satellite, les autres sont des planètes.
Cube|Triangle|Carré|Losange|Rectangle|Le cube est un volume, les autres sont des figures planes.
Loup|Lion|Tigre|Guépard|Panthère|Le loup n'est pas un félin.
Marne|Seine|Loire|Garonne|Rhône|La Marne est un affluent, les autres sont des fleuves.
Mouette|Aigle|Faucon|Buse|Vautour|La mouette n'est pas un rapace.
Bronze|Cuivre|Fer|Zinc|Plomb|Le bronze est un alliage, les autres sont des métaux purs.
Bourse|Euro|Dollar|Yen|Livre|La Bourse n'est pas une monnaie.
Vitesse|Courir|Marcher|Sauter|Nager|« Vitesse » est un nom, les autres sont des verbes.
Lent|Rapide|Vif|Prompt|Véloce|« Lent » a le sens opposé des autres.
Morose|Joyeux|Gai|Enjoué|Hilare|« Morose » a le sens opposé des autres.
Escadrille|Infanterie|Cavalerie|Artillerie|Génie|L'escadrille est une unité aérienne, les autres sont des armes de l'armée de Terre.
Capitaine|Caporal|Sergent|Adjudant|Major|Le capitaine est officier, pas les autres.
Rafale|Tigre|Caïman|Gazelle|Puma|Le Rafale est un avion, les autres sont des hélicoptères.
Cockpit|Bâbord|Tribord|Proue|Poupe|Cockpit n'est pas un terme de marine.
Accoster|Atterrir|Décoller|Amerrir|Alunir|Accoster concerne un navire, les autres un aéronef ou un engin spatial.
Polygone|Hexagone|Pentagone|Octogone|Décagone|« Polygone » est le terme générique.
Arc-en-ciel|Tonnerre|Éclair|Orage|Foudre|L'arc-en-ciel n'est pas lié à l'orage.
Anticyclone|Cumulus|Stratus|Cirrus|Cumulonimbus|L'anticyclone n'est pas un nuage.
Kilogramme|Kilomètre|Mètre|Mille|Pied|Le kilogramme mesure une masse, les autres une longueur.
Bruxelles|Paris|Lyon|Marseille|Toulouse|Bruxelles n'est pas en France.
Norvège|Allemagne|Italie|Espagne|Belgique|La Norvège n'est pas membre de l'Union européenne.
Fougère|Coquelicot|Tulipe|Rose|Marguerite|La fougère ne fait pas de fleurs.
Mémoire|Ouïe|Vue|Odorat|Toucher|La mémoire n'est pas un sens.
Picasso|Mozart|Beethoven|Chopin|Bach|Picasso est peintre, les autres sont compositeurs.
Monet|Molière|Racine|Corneille|Hugo|Monet est peintre, les autres sont écrivains.
Quinze|Onze|Treize|Sept|Dix-sept|15 n'est pas un nombre premier.
56|16|25|36|49|56 n'est pas un carré parfait.
48|2|8|32|64|48 n'est pas une puissance de 2.
Police|Gendarmerie|Marine nationale|Armée de terre|Armée de l'air|La Police nationale n'est pas une force armée.
Aileron|Palonnier|Cyclique|Collectif|Rotor anticouple|L'aileron est une gouverne d'avion.
Taureau|Agneau|Poulain|Veau|Faon|Le taureau est un adulte, les autres sont des petits.
Table|Siège|Tabouret|Fauteuil|Chaise|On ne s'assoit pas sur une table.
Moitié|Cent|Mille|Million|Milliard|« Moitié » est une fraction.
Boussole|Nord|Sud|Est|Ouest|La boussole est un instrument, les autres sont des points cardinaux.
Fourbe|Sincère|Franc|Loyal|Honnête|« Fourbe » a le sens opposé des autres.
Prolixe|Bref|Concis|Laconique|Succinct|« Prolixe » a le sens opposé des autres.
Acerbe|Bienveillant|Aimable|Affable|Courtois|« Acerbe » a le sens opposé des autres.
`);

/* Culture générale (bonus CSO + entretiens) */
DATA.CG = lines(`
En quelle année a été signé l'armistice de la Première Guerre mondiale ?|1918|1914|1917|1919|11 novembre 1918.
Date du débarquement allié en Normandie ?|6 juin 1944|8 mai 1945|11 novembre 1918|14 juillet 1944
La capitulation allemande qui termine la guerre en Europe date du :|8 mai 1945|6 juin 1944|11 novembre 1945|2 septembre 1945
Qui est le chef des armées en France ?|Le président de la République|Le Premier ministre|Le ministre des Armées|Le chef d'état-major des armées|Article 15 de la Constitution.
En quelle année l'OTAN a-t-elle été créée ?|1949|1945|1957|1962
Où se trouve le siège de l'OTAN ?|Bruxelles|Genève|New York|Strasbourg
Combien de membres permanents compte le Conseil de sécurité de l'ONU ?|5|7|10|15|États-Unis, Russie, Chine, France, Royaume-Uni.
Où se trouve le siège de l'ONU ?|New York|Genève|Washington|Bruxelles
La Constitution de la Ve République a été adoptée en :|1958|1946|1962|1968
Premier président de la Ve République :|Charles de Gaulle|Georges Pompidou|René Coty|Vincent Auriol
La prise de la Bastille a eu lieu le :|14 juillet 1789|4 août 1789|21 janvier 1793|14 juillet 1790
La chute du mur de Berlin date de :|1989|1991|1985|1961
Le traité de Rome, qui crée la CEE, est signé en :|1957|1951|1992|1945
Le traité de Maastricht est signé en :|1992|1957|2002|1986
Les pièces et billets en euro sont mis en circulation en :|2002|1999|1992|2005
La suspension du service national obligatoire est votée en :|1997|1981|2002|1989
Que signifie JDC ?|Journée défense et citoyenneté|Journée de la défense civile|Journée des combattants|Jeunesse, défense et citoyenneté
La bataille de Verdun a lieu en :|1916|1914|1918|1940
Napoléon Ier est sacré empereur en :|1804|1799|1815|1789
La bataille de Waterloo a lieu en :|1815|1805|1812|1798
La bataille d'Austerlitz a lieu en :|1805|1815|1792|1812
Capitale de l'Australie :|Canberra|Sydney|Melbourne|Perth
Capitale du Canada :|Ottawa|Toronto|Montréal|Vancouver
Capitale de la Turquie :|Ankara|Istanbul|Izmir|Antalya
Capitale du Mali :|Bamako|Niamey|Ouagadougou|Dakar
Capitale du Niger :|Niamey|Bamako|N'Djamena|Abuja
Capitale du Tchad :|N'Djamena|Niamey|Bangui|Yaoundé
Capitale de l'Ukraine :|Kyiv (Kiev)|Kharkiv|Odessa|Minsk
Plus long fleuve de France :|La Loire|La Seine|Le Rhône|La Garonne
Plus haut sommet de France :|Le mont Blanc|La barre des Écrins|Le Vignemale|Le puy de Sancy
Nombre de régions en France métropolitaine depuis 2016 :|13|22|18|12
Nombre de départements français :|101|95|96|100
La Guyane française a une frontière avec :|le Brésil|le Venezuela|la Colombie|le Pérou|Ainsi qu'avec le Suriname.
Plus grand océan du monde :|Pacifique|Atlantique|Indien|Arctique
Planète la plus proche du Soleil :|Mercure|Vénus|Mars|La Terre
Vitesse de la lumière dans le vide (environ) :|300 000 km/s|300 000 km/h|30 000 km/s|3 000 km/s
Vitesse du son dans l'air à 15 °C (environ) :|340 m/s|1 200 m/s|34 m/s|3 400 m/s
Formule chimique de l'eau :|H₂O|CO₂|O₂|H₂O₂
Gaz le plus abondant dans l'air :|L'azote (≈ 78 %)|L'oxygène|Le dioxyde de carbone|L'argon
Unité de force du Système international :|Le newton|Le joule|Le watt|Le pascal
Unité de pression du Système international :|Le pascal|Le newton|Le joule|Le watt
Unité de puissance :|Le watt|Le joule|Le newton|Le volt
Qui a formulé la loi de la gravitation universelle ?|Isaac Newton|Galilée|Albert Einstein|Johannes Kepler
Auteur des « Misérables » :|Victor Hugo|Émile Zola|Honoré de Balzac|Gustave Flaubert
Auteur du « Petit Prince » :|Antoine de Saint-Exupéry|Jules Verne|Albert Camus|Marcel Pagnol
Devise de la République française :|Liberté, Égalité, Fraternité|Honneur et Patrie|Travail, Famille, Patrie|Unité, Progrès, Justice
Hymne national français :|La Marseillaise|Le Chant du départ|La Madelon|Le Chant des partisans
Où siège le Parlement européen en session plénière ?|Strasbourg|Bruxelles|Luxembourg|Francfort
Combien d'États compte l'Union européenne depuis le Brexit ?|27|28|25|30
Dans quel quartier de Paris se trouve le ministère des Armées ?|Balard|La Défense|Bercy|Matignon
Résidence du Premier ministre :|L'hôtel de Matignon|Le palais de l'Élysée|Le palais Bourbon|Le palais du Luxembourg
L'Assemblée nationale siège au :|Palais Bourbon|Palais du Luxembourg|Palais de l'Élysée|Hôtel de Matignon
Le Sénat siège au :|Palais du Luxembourg|Palais Bourbon|Palais-Royal|Quai d'Orsay
Le « Quai d'Orsay » désigne le ministère :|des Affaires étrangères|de l'Intérieur|des Armées|de l'Économie
Durée du mandat du président de la République :|5 ans|7 ans|4 ans|6 ans
L'opération Sentinelle consiste à :|protéger le territoire national|combattre au Sahel|frapper au Levant|soutenir l'ONU au Liban|Lancée en janvier 2015.
L'opération Barkhane se déroulait :|au Sahel|au Levant|en Afghanistan|en Centrafrique
L'opération Serval (2013) s'est déroulée :|au Mali|en Libye|en Côte d'Ivoire|en Centrafrique
L'opération Chammal concerne :|l'Irak et la Syrie|le Mali|le Liban|l'Estonie
L'opération Sangaris s'est déroulée :|en Centrafrique|au Mali|au Tchad|en Somalie
L'opération Harmattan (2011) s'est déroulée :|en Libye|au Mali|en Irak|en Syrie
La FINUL est une force de l'ONU déployée :|au Liban|au Mali|au Kosovo|à Chypre
Le 11 novembre commémore :|l'armistice de 1918|la victoire de 1945|la prise de la Bastille|le débarquement
`);

/* Culture aéronautique, militaire et ALAT (épreuve SECMA) */
DATA.AERO = lines(`
Que signifie le sigle ALAT ?|Aviation légère de l'armée de Terre|Aviation logistique de l'armée de Terre|Armée légère d'assaut tactique|Aéromobilité légère de l'armée de Terre
En quelle année l'ALAT a-t-elle été créée ?|1954|1945|1962|1940|Créée le 22 novembre 1954.
Où se déroule la formation initiale au pilotage des pilotes de l'ALAT ?|À Dax|À Salon-de-Provence|À Tours|À Cognac|École de l'ALAT, base école Général Navelet.
Où se déroule la formation sur hélicoptère d'armes (Tigre, Caïman) ?|Au Cannet-des-Maures (Le Luc)|À Dax|À Pau|À Phalsbourg|Base école Général Lejay.
Sur quel hélicoptère les élèves débutent-ils le pilotage à Dax ?|H120 Colibri|Tigre|NH90 Caïman|Puma
Le 1er RHC est stationné à :|Phalsbourg|Pau|Étain|Dax
Le 3e RHC est stationné à :|Étain|Phalsbourg|Pau|Valence
Le 5e RHC est stationné à :|Pau|Étain|Phalsbourg|Montauban
Le 4e RHFS est stationné à :|Pau|Montauban|Le Luc|Dax
Que signifie RHC ?|Régiment d'hélicoptères de combat|Régiment héliporté de choc|Régiment d'hélicoptères de commandement|Régiment d'hélicoptères de campagne
Que signifie RHFS ?|Régiment d'hélicoptères des forces spéciales|Régiment héliporté de frappe stratégique|Régiment d'hélicoptères de formation supérieure|Régiment d'hélicoptères de fret et de soutien
La 4e brigade d'aérocombat (4e BAC) a été créée en :|2016|1999|2010|1977
Où se trouve la 9e BSAM (base de soutien du matériel de l'ALAT) ?|À Montauban|À Pau|À Valence|À Dax
Qui construit le Tigre ?|Airbus Helicopters (ex-Eurocopter)|Dassault Aviation|Leonardo|Boeing
Le Tigre est un hélicoptère :|d'attaque et d'appui|de transport lourd|de manœuvre|d'instruction
Le Tigre est issu d'une coopération entre la France et :|l'Allemagne|l'Italie|le Royaume-Uni|les Pays-Bas
Calibre du canon sous le nez du Tigre :|30 mm|20 mm|12,7 mm|40 mm
Quelle version du Tigre emporte le missile antichar Hellfire ?|HAD (appui destruction)|HAP (appui protection)|UHT|HAC
Comment est installé l'équipage du Tigre ?|En tandem, pilote à l'avant|Côte à côte|En tandem, pilote à l'arrière|Pilote seul
Le NH90 Caïman de l'armée de Terre est un hélicoptère :|de manœuvre et d'assaut|d'attaque|de reconnaissance|d'instruction
Le NH90 est produit par le consortium :|NHIndustries|MBDA|Thales|Safran
Comment s'appelle le rotor anticouple caréné de la Gazelle ?|Fenestron|NOTAR|Rotor coaxial|Rotor en tandem
Missile antichar emporté par la Gazelle :|HOT|Hellfire|Exocet|Aster
Missile air-air très courte portée utilisé par l'ALAT :|Mistral|Exocet|Meteor|Scalp
Quel hélicoptère doit succéder à la Gazelle ?|H160M Guépard|NH90 Caïman|H145M|AW139|Programme HIL (hélicoptère interarmées léger).
Que signifie le programme HIL ?|Hélicoptère interarmées léger|Hélicoptère d'intervention lourde|Hélicoptère d'infanterie légère|Hélicoptère interarmées logistique
Le Puma (SA330) est un hélicoptère :|de manœuvre|d'attaque|d'observation|d'instruction
Le Cougar est une évolution du :|Super Puma|Gazelle|Alouette III|Dauphin
Premier hélicoptère à turbine produit en série au monde :|Alouette II|Gazelle|Bell 47|Sikorsky S-55
Premier vol libre d'un hélicoptère avec pilote (1907) :|Paul Cornu|Louis Blériot|Igor Sikorsky|Clément Ader
En quelle année Igor Sikorsky fait-il voler le VS-300 ?|1939|1907|1925|1955
Premier vol motorisé des frères Wright :|1903|1890|1909|1914
Premier à traverser la Manche en avion (1909) :|Louis Blériot|Roland Garros|Charles Lindbergh|Clément Ader
Premier à traverser la Méditerranée en avion (1913) :|Roland Garros|Louis Blériot|Jean Mermoz|Hélène Boucher
Première traversée de l'Atlantique en solitaire et sans escale (1927) :|Charles Lindbergh|Amelia Earhart|Jean Mermoz|Nungesser et Coli
Qui fait décoller l'Éole en 1890 ?|Clément Ader|Louis Blériot|Henri Farman|Alberto Santos-Dumont
Auteur de « Vol de nuit » et « Terre des hommes » :|Antoine de Saint-Exupéry|Jean Mermoz|Joseph Kessel|Romain Gary
As français aux 53 victoires, disparu en 1917 :|Georges Guynemer|René Fonck|Roland Garros|Charles Nungesser
Le pas collectif permet principalement :|de faire varier la portance de toutes les pales à la fois|d'incliner le disque rotor|de contrôler le lacet|de régler le rotor anticouple|Il sert à monter ou descendre.
Le pas cyclique permet :|d'incliner le disque rotor pour se déplacer|de faire varier la portance globale|de compenser le couple|de démarrer la turbine
Les palonniers d'un hélicoptère agissent sur :|le pas du rotor anticouple (lacet)|le pas cyclique|le pas collectif|les volets
À quoi sert le rotor anticouple ?|À compenser le couple du rotor principal|À augmenter la portance|À freiner l'appareil|À refroidir le moteur
L'autorotation, c'est :|une descente où l'air entraîne le rotor, moteur coupé|une rotation de l'appareil sur lui-même|un décollage vertical|le lancement du rotor au sol
L'effet de sol :|améliore les performances près du sol|réduit la portance près du sol|n'existe qu'en avion|augmente la consommation
Le vortex (état d'anneau tourbillonnaire) survient surtout lors :|d'une descente verticale rapide à faible vitesse|d'une croisière rapide|d'un décollage en effet de sol|d'une autorotation stabilisée
Hélicoptère à deux rotors en tandem :|CH-47 Chinook|UH-60 Black Hawk|AH-64 Apache|Mi-24
Hélicoptère à rotors coaxiaux contrarotatifs :|Ka-52|Mi-28|AH-1Z|NH90
Sur un avion, les ailerons commandent :|le roulis|le tangage|le lacet|la vitesse
Sur un avion, la gouverne de profondeur commande :|le tangage|le roulis|le lacet|la portance
Sur un avion, la gouverne de direction commande :|le lacet|le roulis|le tangage|la poussée
Force qui s'oppose à l'avancement d'un aéronef :|La traînée|La portance|La poussée|Le poids
L'angle d'incidence est l'angle entre :|la corde du profil et le vent relatif|l'aile et le fuselage|l'horizon et le fuselage|deux pales
Le décrochage survient quand :|l'incidence dépasse l'incidence critique|la vitesse est trop élevée|le moteur s'arrête|le train est sorti
Le théorème de Bernoulli relie :|la vitesse et la pression d'un fluide|la masse et l'accélération|la température et le volume|le poids et l'altitude
La 3e loi de Newton est le principe :|des actions réciproques (action-réaction)|d'inertie|fondamental de la dynamique|de la gravitation
Un nœud correspond à :|1 mille nautique par heure (1,852 km/h)|1 km/h|1 mile terrestre par heure|1 m/s
Un mille nautique vaut :|1 852 m|1 609 m|1 000 m|2 000 m
Un pied vaut environ :|0,30 m|0,50 m|1 m|0,10 m
L'heure UTC est aussi appelée heure :|Zulu|Alpha|Lima|Bravo
Le cap 270° correspond à l':|ouest|est|sud|nord
Le cap 135° correspond au :|sud-est|nord-est|sud-ouest|nord-ouest
Un vent « du 360 » :|vient du nord|souffle vers le nord|vient de l'est|vient du sud|Le vent est toujours donné par sa provenance.
Le QNH est :|la pression ramenée au niveau de la mer|la pression au niveau du terrain|la température au sol|la vitesse du vent|Calé sur l'altimètre, il donne l'altitude.
Calé sur l'altimètre, le QFE donne :|la hauteur au-dessus du terrain|l'altitude|le niveau de vol|la vitesse
Pression standard au niveau de la mer :|1013,25 hPa|1000 hPa|1030 hPa|760 hPa|760 est la valeur en millimètres de mercure.
Température standard au niveau de la mer (atmosphère type) :|15 °C|0 °C|20 °C|10 °C
Code transpondeur de détresse :|7700|7600|7500|2000
Code transpondeur en cas de panne radio :|7600|7700|7500|1200
Code transpondeur en cas d'intervention illicite :|7500|7600|7700|7000
Message radio de détresse :|MAYDAY|PAN PAN|SECURITE|ROGER
Message radio d'urgence (sans danger immédiat) :|PAN PAN|MAYDAY|WILCO|ROGER
Lettre Q en alphabet OTAN :|Quebec|Queen|Quiz|Quartz
Lettre W en alphabet OTAN :|Whiskey|William|Wolf|Winter
Lettre J en alphabet OTAN :|Juliett|Jupiter|Jack|Jaguar
Lettre Y en alphabet OTAN :|Yankee|Yellow|York|Yoga
Lettre K en alphabet OTAN :|Kilo|King|Kappa|Kiwi
Un METAR est :|une observation météo régulière d'aérodrome|une prévision d'aérodrome|un avis de tempête|un plan de vol
Un TAF est :|une prévision météo d'aérodrome|une observation en temps réel|un avertissement de cisaillement|une carte de vents
Nuage d'orage le plus dangereux pour l'aviation :|Cumulonimbus|Cirrus|Stratus|Altocumulus
Grade d'officier juste au-dessus de lieutenant :|Capitaine|Commandant|Sous-lieutenant|Colonel
Grade juste au-dessus de capitaine dans l'armée de Terre :|Commandant|Lieutenant-colonel|Colonel|Major
Combien d'étoiles porte un général de brigade ?|2|1|3|4
Plus haut grade de sous-officier :|Major|Adjudant-chef|Sergent-chef|Adjudant
Que signifie CEMA ?|Chef d'état-major des armées|Chef d'état-major de l'armée de Terre|Commandant des écoles militaires d'aviation|Commandement européen des moyens aériens
Que signifie CEMAT ?|Chef d'état-major de l'armée de Terre|Chef d'état-major des armées|Commandement des moyens aériens tactiques|Centre d'entraînement militaire de l'aviation de Terre
École qui forme les officiers de l'armée de Terre :|Saint-Cyr Coëtquidan|Saint-Maixent|Salon-de-Provence|L'École navale
Saint-Cyr Coëtquidan se trouve dans le :|Morbihan|Calvados|Finistère|Loiret
L'École nationale des sous-officiers d'active (ENSOA) est à :|Saint-Maixent-l'École|Coëtquidan|Dax|Tours
Le seul porte-avions en service dans la Marine nationale :|Charles de Gaulle|Clemenceau|Foch|Richelieu
Depuis quel type de navire les hélicoptères de l'ALAT ont-ils opéré en Libye (2011) ?|Porte-hélicoptères amphibie (BPC)|Sous-marin|Frégate de surveillance|Pétrolier ravitailleur
Avion de combat polyvalent de Dassault en service en France :|Rafale|Mirage III|Super-Étendard|Jaguar
Surnom de l'A400M en France :|Atlas|Hercules|Transall|Phénix
Surnom de l'A330 MRTT en France :|Phénix|Atlas|Griffon|Pégase
Avion de la Patrouille de France :|Alphajet|Rafale|Mirage 2000|PC-21
Véhicules du programme SCORPION de l'armée de Terre :|Griffon et Jaguar|Leclerc et AMX-10|VAB et VBL|Boxer et Patria
Fusil d'assaut actuel de l'armée de Terre :|HK416F|FAMAS|MAS 36|AK-47
Char de combat principal de l'armée de Terre :|Leclerc|AMX-30|Leopard 2|Abrams
L'AH-64 Apache est un hélicoptère :|américain|russe|britannique|italien
Le Mi-24 « Hind » est d'origine :|soviétique|américaine|française|chinoise
Le V-22 Osprey est :|un convertible à rotors basculants|un hélicoptère à rotors en tandem|un drone|un hélicoptère d'attaque
Plus gros hélicoptère produit en série :|Mi-26|CH-47 Chinook|CH-53|AW101
Que signifie OPEX ?|Opération extérieure|Opération exceptionnelle|Officier d'expérience|Opération d'exercice
L'aérocombat désigne :|le combat d'hélicoptères intégré à la manœuvre terrestre|la défense aérienne du territoire|le combat aérien entre chasseurs|le transport stratégique
`);

/* Banque d'identification d'aéronefs : nom|type|indices */
DATA.AIRCRAFT = lines(`
Tigre|h|Hélicoptère d'attaque franco-allemand, équipage en tandem, viseur au-dessus de la cabine, canon de 30 mm sous le nez, ailettes emportant roquettes et missiles.
NH90 Caïman|h|Hélicoptère de manœuvre européen biturbine, fuselage composite arrondi, rampe arrière, train tricycle, une vingtaine de soldats en cabine.
Gazelle|h|Hélicoptère léger de reconnaissance, verrière bulle très vitrée, rotor tripale, Fenestron dans la dérive, patins.
Puma|h|Hélicoptère de manœuvre biturbine des années 1960-70, rotor quadripale, train tricycle, rotor de queue classique.
Cougar|h|Version militaire allongée du Super Puma, biturbine, rotor quadripale, transport tactique et forces spéciales.
Caracal (H225M)|h|Biturbine de recherche et sauvetage et forces spéciales, rotor principal à 5 pales, perche de ravitaillement en vol.
Fennec|h|Biturbine léger dérivé de l'Écureuil, rotor tripale, patins, rotor de queue classique, utilisé pour l'instruction et la liaison.
Colibri (H120)|h|Monoturbine léger d'instruction à Fenestron et rotor tripale, sur lequel les élèves pilotes débutent à Dax.
Guépard (H160M)|h|Nouvel hélicoptère interarmées léger, pales « Blue Edge » à 5 pales, Fenestron incliné, empennage arrière biplan.
Alouette III|h|Hélicoptère léger français monoturbine des années 1960, cabine très vitrée, train tricycle fixe, longtemps utilisé pour le sauvetage en mer.
Dauphin / Panther|h|Biturbine moyen à Fenestron et train rentrant, utilisé par la Marine pour le sauvetage et à bord des frégates.
AH-64 Apache|h|Hélicoptère d'attaque américain, équipage en tandem avec le pilote à l'arrière, radar en boule au-dessus du rotor sur certaines versions.
AH-1Z Viper|h|Hélicoptère d'attaque américain très étroit, dérivé du Huey, équipage en tandem, utilisé par les Marines.
UH-60 Black Hawk|h|Hélicoptère de manœuvre américain de Sikorsky, rotor quadripale, rotor de queue incliné, train à roulette de queue.
CH-47 Chinook|h|Hélicoptère de transport lourd américain à deux rotors en tandem et rampe arrière.
Mi-24 Hind|h|Hélicoptère soviétique d'attaque capable d'emporter des troupes, deux verrières bulles étagées, ailettes à pylônes.
Mi-8 / Mi-17|h|Hélicoptère de transport soviétique très répandu, rotor à 5 pales, portes arrière en coquille.
Ka-52 Alligator|h|Hélicoptère d'attaque russe à rotors coaxiaux contrarotatifs, sans rotor de queue, équipage côte à côte.
Mi-28 Havoc|h|Hélicoptère d'attaque russe en tandem à rotor à 5 pales, souvent comparé à l'Apache.
Mi-26 Halo|h|Le plus gros hélicoptère produit en série, rotor principal à 8 pales.
AW101 Merlin|h|Hélicoptère trimoteur italo-britannique à rotor 5 pales, pour la lutte anti-sous-marine et le transport.
V-22 Osprey|h|Convertible américain à rotors basculants, décolle comme un hélicoptère et vole comme un avion.
H135 (EC135)|h|Biturbine léger à Fenestron, utilisé par la Gendarmerie et le SAMU.
H145 (EC145)|h|Biturbine léger à portes arrière en coquille, utilisé par la Sécurité civile (« Dragon ») et la Gendarmerie.
Écureuil (AS350)|h|Monoturbine léger civil très répandu, qui s'est posé au sommet de l'Everest en 2005.
Bell 47|h|Hélicoptère léger à verrière bulle et poutre de queue en treillis, rendu célèbre par la série M*A*S*H.
Rafale|a|Avion de combat omnirôle français biréacteur, aile delta et plans canard.
Mirage 2000|a|Chasseur français monoréacteur à aile delta, sans plans canard.
A400M Atlas|a|Avion de transport européen à quatre turbopropulseurs aux hélices contrarotatives par paire, aile haute.
C-130 Hercules|a|Transport tactique américain à quatre turbopropulseurs, aile haute, en service depuis les années 1950.
CASA CN-235|a|Biturbopropulseur espagnol de transport tactique léger, aile haute et rampe arrière.
A330 MRTT Phénix|a|Ravitailleur et transport stratégique biréacteur dérivé d'un avion de ligne.
Alphajet|a|Biréacteur d'entraînement franco-allemand à aile haute, utilisé par la Patrouille de France.
Pilatus PC-21|a|Avion d'entraînement suisse à turbopropulseur, utilisé à Cognac pour former les pilotes de chasse.
E-3F AWACS|a|Avion de détection aérienne reconnaissable à son grand radôme rotatif au-dessus du fuselage.
E-2 Hawkeye|a|Avion de guet aérien embarqué à radôme, biturbopropulseur, à bord du Charles de Gaulle.
Atlantique 2|a|Avion français de patrouille maritime biturbopropulseur, spécialisé dans la lutte anti-sous-marine.
F-35 Lightning II|a|Chasseur furtif américain monoréacteur de 5e génération.
F-16 Fighting Falcon|a|Chasseur léger américain monoréacteur, entrée d'air sous le fuselage, verrière bulle.
Eurofighter Typhoon|a|Chasseur européen biréacteur à aile delta et plans canard (Allemagne, Royaume-Uni, Italie, Espagne).
Su-35|a|Chasseur russe biréacteur lourd et très manœuvrant, à poussée vectorielle.
Saab Gripen|a|Chasseur suédois monoréacteur léger à aile delta et plans canard.
MQ-9 Reaper|a|Drone MALE américain à hélice propulsive arrière et empennage en Y, utilisé par la France.
B-2 Spirit|a|Bombardier furtif américain en forme d'aile volante.
`);

/* Anglais : phrases à trous */
DATA.ENG = lines(`
If I ___ more time, I would learn to fly.|had|have|would have|will have
She has lived in Paris ___ 2015.|since|for|during|from
We have been waiting ___ two hours.|for|since|during|ago
The pilot ___ the helicopter when the alarm went off.|was flying|flew|has flown|is flying
I ___ to the base yesterday.|went|have gone|go|was go
By the time we arrived, the plane ___.|had already taken off|already took off|has already taken off|was already take off
He is ___ than his brother.|taller|more tall|tallest|the taller
This is the ___ mission I have ever done.|most difficult|difficultest|more difficult|most difficultest
You ___ smoke on board. It's forbidden.|mustn't|don't have to|needn't|haven't to
You ___ wear a tie; it's optional.|don't have to|mustn't|can't|shouldn't to
The report ___ by the captain tomorrow.|will be written|will write|is writing|writes
The engine ___ checked every 100 hours.|is|are|has|does
I'm looking forward to ___ you.|seeing|see|to see|saw
He suggested ___ the flight.|postponing|to postpone|postpone|postponed
She asked me where I ___.|lived|do live|live|did live
There isn't ___ fuel left in the tank.|much|many|a few|few
How ___ soldiers are there in the unit?|many|much|lot|more
I've got ___ friends in the army.|a few|a little|much|little
Neither the pilot ___ the co-pilot saw the drone.|nor|or|and|neither
He's used to ___ up early.|getting|get|got|have got
I used ___ in Lyon when I was a child.|to live|living|live|lived
The man ___ car was stolen called the police.|whose|who|which|whom
This is the base ___ I was trained.|where|which|what|whose
If it rains tomorrow, we ___ the exercise.|will cancel|would cancel|cancel|cancelled
If I had known, I ___ you.|would have told|would tell|had told|will tell
He drives ___.|carefully|careful|carefulness|more careful
The weather is ___ bad to fly today.|too|enough|very much|so much
He isn't old ___ to join the army.|enough|too|so|such
It was ___ a long flight that we all fell asleep.|such|so|too|very
The mission was ___ dangerous that it was cancelled.|so|such|too|enough
I'd rather you ___ here.|stayed|stay|will stay|staying
It's high time we ___.|left|leave|will leave|have left
She ___ English for five years before she moved to London.|had studied|has studied|studies|was study
Look at those clouds! It ___ rain.|is going to|will be|goes to|is raining to
The briefing ___ at 9 a.m. every Monday.|starts|is starting|start|starting
Can you tell me what time ___?|it is|is it|it's being|does it
I don't know ___ he will come or not.|whether|unless|despite|although
___ the bad weather, the helicopter took off.|Despite|Although|However|Even
___ it was raining, they continued the training.|Although|Despite|In spite|However
He has ___ finished his report; it's on your desk.|just|yet|ever|still
Have you ___ been to the United States?|ever|already|yet|still
I haven't received his message ___.|yet|already|still|just
The aircraft is ___ the hangar.|in|on|at|into
We'll meet ___ Monday.|on|in|at|by
The flight leaves ___ 6 o'clock.|at|on|in|by
I was born ___ 2004.|in|on|at|since
He's interested ___ aviation.|in|on|by|for
She is good ___ mathematics.|at|in|on|for
It depends ___ the weather.|on|of|from|at
They arrived ___ the airport late.|at|to|in|on
The crew is responsible ___ the safety of the passengers.|for|of|to|on
Please fill ___ this form.|in|on|up|at
The pilot had to turn ___ because of the fog.|back|off|on|up
Don't give ___! You can pass the test.|up|in|off|over
It's too loud. Could you turn it ___ a little?|down|up|over|in
The plane took ___ on time.|off|up|out|over
We ran ___ of fuel.|out|off|away|over
I need to look ___ this word in the dictionary.|up|for|after|at
Who will look ___ your dog while you're away?|after|for|up|out
The captain told us ___ quiet.|to be|be|being|that be
Let me ___ you with your bag.|help|to help|helping|helped
He made me ___ the exercise again.|do|to do|doing|did
I'm not used ___ in the dark.|to flying|to fly|fly|flying to
The more you practise, the ___ you get.|better|best|good|more good
He speaks English ___ than I do.|better|more good|best|well
Can you give me some ___ about the course?|information|informations|an information|informative
He gave me some good ___.|advice|advices|an advice|advise
The news ___ good today.|is|are|have|be
Everybody ___ ready for the inspection.|is|are|were|have
Each of the pilots ___ a helmet.|has|have|are having|having
A lot of people ___ waiting outside.|are|is|was|has
I wish I ___ fly a helicopter.|could|can|will|would can
You'd better ___ now.|leave|to leave|leaving|left
He must ___ forgotten the appointment.|have|has|had|having
She can't ___ at home; her car isn't there.|be|being|been|to be
The soldiers ___ inspected every morning.|are|is|be|being
The new helicopter ___ next year.|will be delivered|will deliver|delivers|is delivering
My passport ___ last week.|was stolen|stole|has stolen|is stolen
I had my hair ___ yesterday.|cut|to cut|cutting|cuts
He denied ___ the window.|breaking|to break|break|broke
They decided ___ the mission.|to abort|aborting|abort|aborted
I'm sorry ___ late.|for being|to being|for be|being for
He apologised ___ the delay.|for|of|about|on
She's afraid ___ heights.|of|from|by|at
The instructor ___ me to check the fuel.|reminded|remembered|reminds of|remember
Please ___ me your pen.|lend|borrow|loan to|lending
Can I ___ your pen?|borrow|lend|loan|lending
We need to ___ a decision quickly.|make|do|take on|get
He ___ his best during the test.|did|made|took|had
The flight was ___ because of a technical problem.|delayed|late|retarded|slowed
The ___ of the runway is 2,000 metres.|length|long|longer|lengthen
The helicopter flew ___ the mountains.|over|above of|on|across of
The control tower gave us ___ to land.|clearance|clear|clearing|cleared
The aircraft was ___ by the strong wind.|damaged|damage|damaging|damages
We must check the weather ___ before the flight.|forecast|forest|forward|foresee
Fasten your seat ___.|belt|bell|band|bolt
The pilot reported an engine ___.|failure|fail|failing|failed
The plane is ___ altitude.|gaining|winning|earning|getting up
Visibility was ___ due to fog.|poor|weak|thin|little
I've known him ___ we were children.|since|for|during|from
She ___ her keys, so she couldn't get in.|had lost|has lost|loses|was losing
While I ___ TV, the phone rang.|was watching|watched|am watching|have watched
This time next week, I ___ in Dax.|will be training|will train|train|am train
By 2030, he ___ his training.|will have completed|will complete|completes|has completed
The book, ___ I bought yesterday, is very interesting.|which|that|who|what
That's the instructor ___ taught me to fly.|who|which|whose|whom
I don't mind ___ at weekends.|working|to work|work|worked
It's no use ___ about it.|worrying|to worry|worry|worried
You look tired. You ___ go to bed.|should|must to|ought|had
They ___ married for ten years.|have been|are|were being|has been
___ do you go to the gym? Twice a week.|How often|How much|How long|How many
___ does it take to get to Tours? About two hours.|How long|How far|How often|How much
___ is it from Paris to Dax? About 700 km.|How far|How long|How much|How many
I'm going ___ holiday next week.|on|in|at|for
He came ___ foot.|on|by|with|in
We travelled ___ train.|by|on|with|in
Unless you ___ harder, you'll fail.|work|don't work|will work|worked
I'll call you as soon as I ___.|arrive|will arrive|arrived|am arriving to
The war ended ___ 1945.|in|on|at|since
He was ___ tired to continue.|too|enough|so much|very much
What ___ you do if you saw an accident?|would|will|did|do
Hardly ___ landed when the storm began.|had we|we had|did we|we have
Not only ___ fast, but it is also reliable.|is it|it is|it's|does it
I object ___ treated like this.|to being|to be|being|for being
She is capable ___ leading the team.|of|to|for|in
The mechanic is ___ the engine right now.|repairing|repair|repaired|repairs
"Roger" means "I have received ___ your last transmission".|all of|any of|some of|none of
"Wilco" means "I ___ comply".|will|would|have|did
"Mayday" is used in case of ___.|distress|urgency|routine|delay
A helicopter can ___, which means it can stay in the air in one place.|hover|glide|soar|taxi
The tail rotor counteracts the ___ produced by the main rotor.|torque|lift|drag|thrust
Before take-off, the pilot goes through the pre-flight ___.|checklist|checkpoint|checkout|cheque
The opposite of "take-off" is "___".|landing|land off|dropping|down taking
Air traffic ___ gave the crew a new heading.|control|controller|controlling|controls
`);

/* Questions d'entretien : catégorie|question|pistes */
DATA.ITW = lines(`
Motivation|Présentez-vous en cinq minutes.|Structure en 3 temps : parcours, ce qui t'a mené vers l'ALAT, ce que tu apportes. Chronomètre-toi : 5 minutes, pas 2 ni 10. Termine sur ton projet.
Motivation|Pourquoi l'ALAT plutôt que l'armée de l'air et de l'espace ou la Marine ?|Parle de l'aérocombat : voler au contact des troupes au sol, au ras du terrain, au service de la manœuvre terrestre. Montre que tu connais la différence de missions.
Motivation|Pourquoi voulez-vous être officier, et pas seulement pilote ?|L'officier commande, décide et assume. Le jury veut un bon militaire avant un bon pilote : chef de bord, chef de patrouille, responsabilités humaines.
Motivation|Pourquoi êtes-vous fait pour être pilote ?|Des faits plutôt que des adjectifs : gestion du stress, sport, responsabilités, rigueur. Un exemple concret par qualité.
Motivation|Que savez-vous du métier de pilote ALAT au quotidien ?|Missions : reconnaissance, appui feu, assaut, transport, évacuation sanitaire. Vie en régiment, entraînement, OPEX, vol de nuit sous jumelles de vision nocturne.
Motivation|Que ferez-vous si vous n'êtes pas retenu ?|Question posée à plusieurs candidats. Une vraie solution de repli réfléchie rassure, elle ne trahit pas un manque de motivation. Rester crédible et serein.
Motivation|Avez-vous déposé d'autres candidatures (autre armée, Gendarmerie) ?|Question posée en 2024. Réponds franchement et explique la cohérence de tes choix.
Motivation|Quel hélicoptère aimeriez-vous piloter et pourquoi ?|Tu peux avoir une préférence argumentée, mais montre que tu iras là où l'institution a besoin de toi.
Motivation|Comment vous êtes-vous préparé à ces sélections ?|Montre de la méthode : entraînement régulier, sport, culture aéro, visites (RHC, aéroclub, BIA).
Motivation|Que pensent vos proches de votre projet ?|Question citée par les candidats. Le soutien familial compte face aux mutations et aux OPEX : sois honnête.
Motivation|Êtes-vous prêt à être muté et à partir plusieurs mois en opération ?|Réponse franche et réfléchie, pas un « oui » automatique. Montre que tu en as parlé avec tes proches.
Motivation|Où vous voyez-vous dans dix ans ?|Projet réaliste : chef de bord, chef de patrouille, qualification, éventuellement instructeur. Reste cohérent avec le statut d'officier sous contrat.
Personnalité|Citez trois qualités et trois défauts.|De vrais défauts, avec ce que tu fais pour les corriger. Reste cohérent avec tes questionnaires de personnalité : ne t'invente pas de profil.
Personnalité|Comment réagissez-vous sous stress ? Donnez un exemple.|Un exemple vécu (examen, sport, imprévu) : situation, action, résultat, ce que tu en as appris.
Personnalité|Racontez un échec et ce que vous en avez tiré.|Assume l'échec, analyse sans te dévaloriser, montre ce que tu as changé ensuite.
Personnalité|Racontez une situation où vous avez dirigé un groupe.|Sport collectif, association, travail, scoutisme : ton rôle, la difficulté, la décision, le résultat.
Personnalité|Comment gérez-vous un conflit dans une équipe ?|Écouter, recadrer sur la mission, en parler en face, rendre compte si nécessaire.
Personnalité|Votre supérieur vous donne un ordre que vous jugez mauvais. Que faites-vous ?|Tu exécutes un ordre légal tout en faisant remonter ton avis par la voie hiérarchique. Un ordre manifestement illégal ne s'exécute pas.
Personnalité|Quelle est votre plus grande fierté ?|Une réussite qui a demandé de l'effort dans la durée, et qui parle de toi.
Personnalité|Pratiquez-vous un sport collectif ? Qu'est-ce que ça vous apporte ?|Esprit d'équipe, dépassement, rigueur dans l'entraînement : fais le lien avec un équipage.
Mise en situation|Êtes-vous prêt à donner la mort ? Et à risquer la vôtre ?|Question attendue. Réponse posée : le cadre légal, la mission, la responsabilité de l'officier. Ni bravade ni hésitation.
Mise en situation|Avez-vous peur de mourir ?|Reconnaître la peur est normal ; montre comment tu la gères (préparation, confiance dans l'équipage et l'entraînement).
Mise en situation|On vous ordonne un tir ; vous découvrez une école à proximité de l'objectif. Que faites-vous ?|Question rapportée par un candidat en 2018. Droit des conflits armés, discrimination et proportionnalité : tu ne tires pas sans certitude, tu rends compte immédiatement.
Mise en situation|Un équipier commet une faute grave. Que faites-vous ?|Sécurité d'abord, puis tu en parles et tu rends compte : la loyauté envers l'équipage ne couvre pas une faute qui met des vies en jeu.
Mise en situation|En vol, une panne survient et votre chef de bord ne réagit pas. Que faites-vous ?|Annonce claire, application des procédures, travail en équipage : c'est l'esprit de la gestion des ressources de l'équipage.
Connaissances|Citez les régiments d'hélicoptères de l'ALAT et leur garnison.|1er RHC Phalsbourg, 3e RHC Étain, 5e RHC Pau, 4e RHFS Pau, plus la 9e BSAM à Montauban et l'EALAT (Dax, Le Cannet-des-Maures).
Connaissances|Quels hélicoptères l'ALAT met-elle en œuvre ? Quel rôle pour chacun ?|Tigre (attaque), Caïman NH90 (manœuvre), Gazelle (reconnaissance, remplacée par le Guépard), Puma et Cougar (manœuvre), Caracal (forces spéciales), Fennec et Colibri (instruction, liaison).
Connaissances|Décrivez la formation d'un officier sous contrat pilote.|Saint-Cyr Coëtquidan (formation d'officier), puis l'EALAT à Dax (pilotage de base), puis Le Cannet-des-Maures (hélicoptère d'armes), puis affectation en régiment.
Connaissances|Qui est le chef d'état-major de l'armée de Terre ? Et le CEMA ?|Question posée en entretien officier. Vérifie les noms juste avant ton passage : ils changent.
Connaissances|Citez des opérations récentes de l'armée française.|Sentinelle (territoire national), Chammal (Levant), missions OTAN sur le flanc Est (Estonie, Roumanie), Daman (Liban), passé récent au Sahel (Barkhane).
Connaissances|Qu'est-ce que l'aérocombat ?|L'emploi des hélicoptères au cœur de la manœuvre terrestre, au contact, en coordination étroite avec les unités au sol.
Connaissances|Quels sont les grands enjeux de défense actuels ?|Retour de la haute intensité (Ukraine), drones, flanc Est de l'OTAN, menaces terroristes, outre-mer. Montre que tu suis l'actualité.
Connaissances|Expliquez simplement comment vole un hélicoptère.|Collectif (portance de toutes les pales), cyclique (inclinaison du disque, déplacement), palonniers (rotor anticouple, lacet).
Connaissances|Qu'est-ce qu'un officier sous contrat ?|Un officier recruté pour une durée déterminée, renouvelable. Montre que tu connais ton futur statut.
Connaissances|Vous volez à 150 nœuds pendant 1 h 20. Quelle distance parcourez-vous ?|150 × 4/3 = 200 milles nautiques. Les officiers posent aussi des calculs à l'oral : reste calme et pose le raisonnement à voix haute.
Connaissances|Un rotor de 5 m de rayon fait 10 tours. Quelle distance parcourt l'extrémité d'une pale ?|2 × π × 5 × 10 ≈ 314 m. Question posée à un candidat en 2018.
Connaissances|Lisez ce METAR : LFBD 311030Z 27015KT 9999 SCT025 12/08 Q1018|Bordeaux-Mérignac, le 31 à 10 h 30 UTC, vent du 270 à 15 nœuds, visibilité 10 km ou plus, nuages épars à 2 500 ft, température 12 °C, point de rosée 8 °C, QNH 1018 hPa.
`);

/* Thèmes de mémorisation (épreuve SECMA) */
DATA.MEMO = {
  'Lacs': ['Léman', 'Annecy', 'Bourget', 'Serre-Ponçon', 'Vassivière', 'Sainte-Croix', 'Der', 'Guerlédan', 'Paladru', 'Aiguebelette', 'Grand-Lieu', 'Pareloup', 'Naussac', 'Vouglans', 'Madine', 'Orient', 'Salagou', 'Chambon', 'Pavin', 'Gérardmer', 'Longemer', 'Laffrey', 'Bimont', 'Carcans'],
  'Rivières': ['Loire', 'Seine', 'Garonne', 'Dordogne', 'Rhône', 'Saône', 'Marne', 'Oise', 'Lot', 'Tarn', 'Vienne', 'Charente', 'Allier', 'Durance', 'Moselle', 'Meuse', 'Somme', 'Aisne', 'Cher', 'Indre', 'Isère', 'Ardèche', 'Adour', 'Aude', 'Orne', 'Vilaine'],
  'Baies': ['Somme', 'Mont-Saint-Michel', 'Audierne', 'Douarnenez', 'Quiberon', 'Saint-Brieuc', 'Morlaix', 'Bourgneuf', 'Anges', 'Cannes', 'Calvi', 'Ajaccio', 'Seine', 'Lannion', 'Canche', 'Authie', 'Arcachon', 'Aiguillon', 'Lancieux', 'Saint-Malo'],
  'Animaux': ['Lynx', 'Puma', 'Fennec', 'Gazelle', 'Caïman', 'Tigre', 'Guépard', 'Colibri', 'Faucon', 'Hermine', 'Chamois', 'Bouquetin', 'Loutre', 'Blaireau', 'Martre', 'Héron', 'Milan', 'Busard', 'Isard', 'Mouflon'],
  'Arbres': ['Chêne', 'Hêtre', 'Frêne', 'Érable', 'Tilleul', 'Bouleau', 'Charme', 'Aulne', 'Saule', 'Peuplier', 'Mélèze', 'Épicéa', 'Sapin', 'Pin', 'Cèdre', 'If', 'Orme', 'Noyer', 'Platane', 'Marronnier']
};

/* Mots pour l'épreuve de codage */
DATA.CODE_WORDS = {
  villes: ['NANTES', 'BREST', 'LILLE', 'NANCY', 'DIJON', 'AMIENS', 'ROUEN', 'TOURS', 'METZ', 'REIMS', 'NIMES', 'LYON', 'PAU', 'DAX', 'NICE', 'CAEN', 'BLOIS', 'ALBI', 'AGEN', 'TOUL'],
  animaux: ['LIEVRE', 'RENARD', 'CASTOR', 'BELETTE', 'HIBOU', 'CHOUETTE', 'LOUTRE', 'MARMOTTE', 'SANGLIER', 'CERF', 'CHEVREUIL', 'FAUCON', 'AIGLE', 'MILAN', 'HERON', 'CYGNE', 'LYNX', 'LOUP', 'OURS', 'BLAIREAU'],
  objets: ['BOUSSOLE', 'JUMELLES', 'CASQUE', 'RADIO', 'CARTE', 'LAMPE', 'GOURDE', 'TENTE', 'SANGLE', 'GILET', 'GANTS', 'MONTRE', 'CRAYON', 'CAHIER', 'REGLE', 'COMPAS', 'SAC', 'CORDE', 'PELLE', 'BACHE']
};

DATA.NAMES = ['Lefèvre', 'Dumont', 'Marchand', 'Bertrand', 'Rousseau', 'Gauthier', 'Morel', 'Fournier', 'Girard', 'Bonnet', 'Lambert', 'Fontaine', 'Chevalier', 'Robin', 'Masson', 'Sanchez', 'Mercier', 'Blanchard', 'Guérin', 'Boyer', 'Garnier', 'Faure', 'André', 'Lemaire', 'Duval', 'Joly', 'Gautier', 'Roger', 'Roche', 'Roy'];
DATA.FIRST = ['Hugo', 'Léa', 'Louis', 'Emma', 'Jules', 'Chloé', 'Adam', 'Inès', 'Lucas', 'Manon', 'Nathan', 'Camille', 'Théo', 'Sarah', 'Arthur', 'Zoé', 'Raphaël', 'Lina', 'Paul', 'Jade'];

/* Fiches de révision ALAT : catégorie|recto|verso */
DATA.FICHES = lines(`
Hélicoptères|Tigre|Hélicoptère d'attaque franco-allemand (Airbus Helicopters). Équipage de 2 en tandem, pilote à l'avant. Versions HAP (appui protection : canon 30 mm, roquettes 68 mm, Mistral) et HAD (appui destruction : ajoute le missile Hellfire). Formation au Cannet-des-Maures.
Hélicoptères|NH90 Caïman|Hélicoptère de manœuvre et d'assaut (NHIndustries). Biturbine, rampe arrière, commandes de vol électriques, une vingtaine de soldats. Remplace progressivement le Puma.
Hélicoptères|Gazelle (SA341/342)|Hélicoptère léger de reconnaissance et d'attaque (Aérospatiale), Fenestron. Versions canon 20 mm, missiles HOT (antichar) ou Mistral (air-air), caméra Viviane. Doit être remplacée par le H160M Guépard.
Hélicoptères|H160M Guépard|Hélicoptère interarmées léger (programme HIL) d'Airbus Helicopters. Pales Blue Edge, Fenestron incliné. Destiné aux trois armées, il doit succéder notamment à la Gazelle.
Hélicoptères|Puma (SA330)|Hélicoptère de manœuvre biturbine des années 1970, rotor quadripale. Remplacé progressivement par le Caïman.
Hélicoptères|Cougar (AS532)|Évolution militaire du Super Puma, biturbine de manœuvre, utilisé pour le transport tactique et les forces spéciales.
Hélicoptères|Caracal (H225M)|Biturbine à rotor 5 pales, ravitaillable en vol, utilisé pour les forces spéciales et la recherche et le sauvetage au combat.
Hélicoptères|Fennec (AS555)|Biturbine léger dérivé de l'Écureuil, utilisé pour l'instruction et la liaison.
Hélicoptères|Colibri (H120)|Monoturbine léger d'instruction : premier hélicoptère des élèves pilotes à Dax.
Unités|1er RHC|Régiment d'hélicoptères de combat de Phalsbourg (Moselle).
Unités|3e RHC|Régiment d'hélicoptères de combat d'Étain (Meuse).
Unités|5e RHC|Régiment d'hélicoptères de combat de Pau.
Unités|4e RHFS|Régiment d'hélicoptères des forces spéciales, à Pau.
Unités|4e BAC|4e brigade d'aérocombat, créée en 2016 : elle regroupe les régiments d'hélicoptères de combat.
Unités|9e BSAM|Base de soutien du matériel de l'ALAT, à Montauban : maintenance lourde des hélicoptères.
Unités|EALAT|École de l'ALAT : Dax (base école Général Navelet, pilotage de base) et Le Cannet-des-Maures (base école Général Lejay, hélicoptères d'armes).
Armement|Canon de 30 mm|Canon en tourelle sous le nez du Tigre.
Armement|Roquettes de 68 mm|Roquettes non guidées en paniers, emportées par le Tigre.
Armement|HOT|Missile antichar filoguidé emporté par la Gazelle.
Armement|Hellfire|Missile antichar à guidage laser emporté par le Tigre HAD.
Armement|Mistral|Missile air-air et sol-air très courte portée, à autodirecteur infrarouge.
Vol|Pas collectif|Levier à gauche du pilote : change le pas de toutes les pales à la fois. Plus de pas, plus de portance : l'hélicoptère monte.
Vol|Pas cyclique|Manche entre les jambes : incline le disque rotor dans une direction, ce qui déplace l'hélicoptère dans cette direction.
Vol|Palonniers|Pédales : changent le pas du rotor anticouple et contrôlent le lacet (le cap) en vol stationnaire.
Vol|Rotor anticouple|Compense le couple créé par le rotor principal, qui sinon ferait tourner le fuselage en sens inverse.
Vol|Autorotation|En cas de panne moteur, la descente fait tourner le rotor grâce à l'air : on peut se poser sans moteur.
Vol|Effet de sol|Près du sol, le souffle du rotor est freiné : la portance augmente et le stationnaire demande moins de puissance.
Vol|Vortex|État d'anneau tourbillonnaire : en descente verticale rapide à faible vitesse, le rotor « avale » son propre souffle et perd de la portance.
Navigation|Unités|1 nœud = 1 mille nautique par heure = 1,852 km/h. 1 mille nautique = 1 852 m. 1 pied ≈ 0,3048 m.
Navigation|Caps|000 nord, 090 est, 180 sud, 270 ouest. Le vent est donné par sa provenance.
Navigation|Calages altimétriques|QNH : altitude (pression ramenée au niveau de la mer). QFE : hauteur au-dessus du terrain. 1013,25 hPa : niveau de vol.
Radio|Codes transpondeur|7700 détresse, 7600 panne radio, 7500 intervention illicite.
Radio|Messages|MAYDAY : détresse. PAN PAN : urgence. ROGER : bien reçu. WILCO : bien reçu, j'exécute.
Radio|Alphabet OTAN (A à M)|Alpha, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliett, Kilo, Lima, Mike.
Radio|Alphabet OTAN (N à Z)|November, Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, Victor, Whiskey, X-ray, Yankee, Zulu.
Armée|Grades d'officiers|Aspirant (élève), sous-lieutenant, lieutenant, capitaine, commandant, lieutenant-colonel, colonel, puis généraux : brigade (2 étoiles), division (3), corps d'armée (4), armée (5).
Armée|Grades de sous-officiers|Sergent, sergent-chef, adjudant, adjudant-chef, major.
Armée|Chaîne de commandement|Président de la République (chef des armées), ministre des Armées, CEMA (chef d'état-major des armées), CEMAT (armée de Terre).
`);
