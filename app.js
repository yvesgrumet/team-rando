/* ═══════════════════════════════  TEAM RANDO  ═══════════════════════════════ */

const CACHE = { config:{}, membres:{}, randos:{}, faites:{}, sorties:{}, participations:{}, messages:{}, presence:{} };
const loaded = { config:false, randos:false, membres:false };
let ME = null;            // { id, prenom, nom, ... }
let CURRENT = 'home';
let appReady = false;
let METEO = null;

const NANTUA = { lat:46.152, lon:5.609 };
const VAPID_PUBLIC = 'BCD75gHfv6xGXA6HpWVZTKmaj9oMwvfqgNMeJmnim9yEMP155WLfLQ5VjSRM6mZmeZLRjVDEDCxaYndnB5PLs78';

/* ───────── Catalogue de vraies randos ≤ 2h30 de Nantua (pré-chargé) ───────── */
const SEED_RANDOS = [
  // ── BUGEY (proche, 2–55 min) ──
  {nom:"Tour du Lac de Nantua",massif:"Bugey",denivele:60,distance_km:8,duree_h:2,temps_voiture_min:2,difficulte:"Facile",paysage:"Lac",depart:"Nantua"},
  {nom:"Belvédère & Roche de Nantua",massif:"Bugey",denivele:350,distance_km:6,duree_h:2.5,temps_voiture_min:5,difficulte:"Moyen",paysage:"Panorama",depart:"Nantua"},
  {nom:"Cascade & Lac de Sylans",massif:"Bugey",denivele:120,distance_km:6,duree_h:2,temps_voiture_min:12,difficulte:"Facile",paysage:"Lac",depart:"Les Neyrolles"},
  {nom:"Lac Genin",massif:"Bugey",denivele:150,distance_km:5,duree_h:1.5,temps_voiture_min:20,difficulte:"Facile",paysage:"Lac",depart:"Charix"},
  {nom:"Plateau de Retord",massif:"Bugey",denivele:250,distance_km:9,duree_h:3,temps_voiture_min:30,difficulte:"Facile",paysage:"Plateau",depart:"Cuvéry"},
  {nom:"Le Molard de Don",massif:"Bugey",denivele:400,distance_km:9,duree_h:3.5,temps_voiture_min:30,difficulte:"Moyen",paysage:"Panorama",depart:"Giron"},
  {nom:"Cascade de Charabotte",massif:"Bugey",denivele:200,distance_km:7,duree_h:3,temps_voiture_min:45,difficulte:"Facile",paysage:"Cascade",depart:"Hostiaz"},
  {nom:"Le Crêt de la Goutte & Fort l'Écluse",massif:"Bugey",denivele:450,distance_km:8,duree_h:3.5,temps_voiture_min:45,difficulte:"Moyen",paysage:"Panorama",depart:"Léaz"},
  {nom:"Le Grand Colombier",massif:"Bugey",denivele:900,distance_km:12,duree_h:5,temps_voiture_min:50,difficulte:"Difficile",paysage:"Sommet",depart:"Virieu-le-Petit"},
  {nom:"Réserve du Marais de Lavours",massif:"Bugey",denivele:30,distance_km:7,duree_h:2,temps_voiture_min:55,difficulte:"Facile",paysage:"Marais",depart:"Ceyzérieu"},
  // ── HAUT-JURA (35–65 min) ──
  {nom:"Crêt de Chalam",massif:"Haut-Jura",denivele:600,distance_km:11,duree_h:4.5,temps_voiture_min:35,difficulte:"Moyen",paysage:"Sommet",depart:"La Pesse"},
  {nom:"La Borne au Lion",massif:"Haut-Jura",denivele:300,distance_km:9,duree_h:3,temps_voiture_min:40,difficulte:"Facile",paysage:"Forêt",depart:"La Pesse"},
  {nom:"Le Petit Crêt d'Eau",massif:"Haut-Jura",denivele:700,distance_km:10,duree_h:4,temps_voiture_min:40,difficulte:"Moyen",paysage:"Sommet",depart:"Confort"},
  {nom:"Crêt de la Neige (sommet du Jura, 1720 m)",massif:"Haut-Jura",denivele:900,distance_km:14,duree_h:5.5,temps_voiture_min:50,difficulte:"Difficile",paysage:"Sommet",depart:"Lélex / La Vattay"},
  {nom:"Le Reculet",massif:"Haut-Jura",denivele:850,distance_km:13,duree_h:5,temps_voiture_min:50,difficulte:"Difficile",paysage:"Sommet",depart:"Thoiry / La Vattay"},
  {nom:"Colomby de Gex",massif:"Haut-Jura",denivele:650,distance_km:12,duree_h:4.5,temps_voiture_min:50,difficulte:"Moyen",paysage:"Panorama",depart:"Col de la Faucille"},
  {nom:"La Forêt du Massacre & Crêt Pela",massif:"Haut-Jura",denivele:400,distance_km:11,duree_h:4,temps_voiture_min:60,difficulte:"Moyen",paysage:"Forêt",depart:"Lajoux"},
  {nom:"La Dôle (Suisse)",massif:"Haut-Jura",denivele:700,distance_km:12,duree_h:4.5,temps_voiture_min:60,difficulte:"Moyen",paysage:"Panorama",depart:"La Cure"},
  {nom:"Lac & Cascades des Rousses",massif:"Haut-Jura",denivele:200,distance_km:8,duree_h:2.5,temps_voiture_min:65,difficulte:"Facile",paysage:"Lac",depart:"Les Rousses"},
  // ── JURA des lacs (55–90 min) ──
  {nom:"Cascades du Hérisson",massif:"Jura",denivele:300,distance_km:7,duree_h:3,temps_voiture_min:55,difficulte:"Facile",paysage:"Cascade",depart:"Ménétrux-en-Joux"},
  {nom:"Belvédère du Regardoir (Lac de Vouglans)",massif:"Jura",denivele:200,distance_km:8,duree_h:3,temps_voiture_min:55,difficulte:"Facile",paysage:"Lac",depart:"Maisod"},
  {nom:"Pic de l'Aigle & Lac de Bonlieu",massif:"Jura",denivele:350,distance_km:9,duree_h:3.5,temps_voiture_min:60,difficulte:"Moyen",paysage:"Panorama",depart:"Ilay"},
  {nom:"Belvédères des 4 Lacs",massif:"Jura",denivele:250,distance_km:10,duree_h:3.5,temps_voiture_min:65,difficulte:"Facile",paysage:"Panorama",depart:"Le Frasnois"},
  {nom:"Cirque & Reculée de Baume-les-Messieurs",massif:"Jura",denivele:350,distance_km:9,duree_h:3.5,temps_voiture_min:80,difficulte:"Moyen",paysage:"Gorges",depart:"Baume-les-Messieurs"},
  {nom:"Cascade des Tufs",massif:"Jura",denivele:150,distance_km:6,duree_h:2.5,temps_voiture_min:85,difficulte:"Facile",paysage:"Cascade",depart:"Les Planches-près-Arbois"},
  // ── GENEVOIS (45–60 min) ──
  {nom:"Le Vuache",massif:"Genevois",denivele:500,distance_km:9,duree_h:3.5,temps_voiture_min:45,difficulte:"Moyen",paysage:"Forêt",depart:"Chaumont"},
  {nom:"Le Salève",massif:"Genevois",denivele:800,distance_km:11,duree_h:4.5,temps_voiture_min:60,difficulte:"Moyen",paysage:"Panorama",depart:"Collonges-sous-Salève"},
  // ── ANNECY (75–90 min) ──
  {nom:"Le Semnoz",massif:"Annecy",denivele:700,distance_km:12,duree_h:4.5,temps_voiture_min:75,difficulte:"Moyen",paysage:"Panorama",depart:"Quintal"},
  {nom:"Mont Veyrier – Mont Baron",massif:"Annecy",denivele:750,distance_km:9,duree_h:4,temps_voiture_min:75,difficulte:"Moyen",paysage:"Panorama",depart:"Annecy-le-Vieux"},
  {nom:"Roc de Chère",massif:"Annecy",denivele:200,distance_km:7,duree_h:2.5,temps_voiture_min:80,difficulte:"Facile",paysage:"Lac",depart:"Talloires"},
  {nom:"Le Parmelan",massif:"Annecy",denivele:750,distance_km:11,duree_h:4.5,temps_voiture_min:80,difficulte:"Moyen",paysage:"Sommet",depart:"Villaz"},
  {nom:"Les Dents de Lanfon",massif:"Annecy",denivele:1000,distance_km:9,duree_h:5,temps_voiture_min:90,difficulte:"Difficile",paysage:"Sommet",depart:"Col des Nantets"},
  {nom:"La Tournette",massif:"Annecy",denivele:1350,distance_km:13,duree_h:6.5,temps_voiture_min:90,difficulte:"Difficile",paysage:"Sommet",depart:"Montmin (Chalet de l'Aulp)"},
  // ── BAUGES (85–120 min) ──
  {nom:"Roc des Bœufs",massif:"Bauges",denivele:900,distance_km:11,duree_h:5,temps_voiture_min:85,difficulte:"Difficile",paysage:"Panorama",depart:"Le Châtelard"},
  {nom:"Pointe de la Sambuy",massif:"Bauges",denivele:700,distance_km:8,duree_h:4,temps_voiture_min:95,difficulte:"Moyen",paysage:"Sommet",depart:"Seythenex"},
  {nom:"Mont Colombier",massif:"Bauges",denivele:1100,distance_km:12,duree_h:6,temps_voiture_min:105,difficulte:"Difficile",paysage:"Sommet",depart:"Aillon-le-Jeune"},
  {nom:"Mont Revard (balcon du Lac du Bourget)",massif:"Bauges",denivele:500,distance_km:10,duree_h:4,temps_voiture_min:110,difficulte:"Facile",paysage:"Panorama",depart:"Les Déserts"},
  {nom:"La Dent de Rossanaz",massif:"Bauges",denivele:900,distance_km:9,duree_h:5,temps_voiture_min:110,difficulte:"Difficile",paysage:"Sommet",depart:"Saint-François-de-Sales"},
  {nom:"Mont Trélod",massif:"Bauges",denivele:1300,distance_km:11,duree_h:6.5,temps_voiture_min:115,difficulte:"Difficile",paysage:"Sommet",depart:"École"},
  {nom:"Mont d'Arcalod",massif:"Bauges",denivele:1400,distance_km:13,duree_h:7,temps_voiture_min:120,difficulte:"Très difficile",paysage:"Sommet",depart:"École"},
  // ── ARAVIS (100–115 min) ──
  {nom:"Le Mont Charvin",massif:"Aravis",denivele:1150,distance_km:11,duree_h:6,temps_voiture_min:100,difficulte:"Difficile",paysage:"Sommet",depart:"Le Bouchet-Mont-Charvin"},
  {nom:"Lac de Tardevant",massif:"Aravis",denivele:850,distance_km:10,duree_h:4.5,temps_voiture_min:105,difficulte:"Moyen",paysage:"Lac",depart:"La Clusaz (Les Confins)"},
  {nom:"Lac de Lessy",massif:"Aravis",denivele:700,distance_km:8,duree_h:4,temps_voiture_min:110,difficulte:"Moyen",paysage:"Lac",depart:"Le Grand-Bornand"},
  {nom:"Le Trou de la Mouche",massif:"Aravis",denivele:1100,distance_km:12,duree_h:6,temps_voiture_min:110,difficulte:"Difficile",paysage:"Sommet",depart:"Le Grand-Bornand"},
  {nom:"Pointe Percée (sommet des Aravis, 2750 m)",massif:"Aravis",denivele:1500,distance_km:13,duree_h:7,temps_voiture_min:110,difficulte:"Très difficile",paysage:"Sommet",depart:"Le Grand-Bornand"},
  {nom:"Lac de Peyre",massif:"Aravis",denivele:600,distance_km:7,duree_h:3.5,temps_voiture_min:115,difficulte:"Moyen",paysage:"Lac",depart:"Le Reposoir"},
  // ── CHABLAIS (110–135 min) ──
  {nom:"Mont Billiat",massif:"Chablais",denivele:800,distance_km:9,duree_h:4.5,temps_voiture_min:110,difficulte:"Moyen",paysage:"Sommet",depart:"Vailly"},
  {nom:"Mont Chéry",massif:"Chablais",denivele:700,distance_km:8,duree_h:4,temps_voiture_min:120,difficulte:"Moyen",paysage:"Panorama",depart:"Les Gets"},
  {nom:"Lac de Tavaneuse",massif:"Chablais",denivele:800,distance_km:10,duree_h:5,temps_voiture_min:130,difficulte:"Moyen",paysage:"Lac",depart:"Abondance"},
  {nom:"Les Cornettes de Bise",massif:"Chablais",denivele:1200,distance_km:13,duree_h:6.5,temps_voiture_min:135,difficulte:"Difficile",paysage:"Sommet",depart:"La Chapelle-d'Abondance"},
  // ── CHARTREUSE (120–140 min) ──
  {nom:"Le Charmant Som",massif:"Chartreuse",denivele:500,distance_km:7,duree_h:3,temps_voiture_min:120,difficulte:"Moyen",paysage:"Panorama",depart:"Col de Porte"},
  {nom:"Chamechaude (sommet de Chartreuse, 2082 m)",massif:"Chartreuse",denivele:750,distance_km:8,duree_h:4,temps_voiture_min:130,difficulte:"Moyen",paysage:"Sommet",depart:"Col de Porte"},
  {nom:"La Grande Sure",massif:"Chartreuse",denivele:900,distance_km:11,duree_h:5,temps_voiture_min:130,difficulte:"Difficile",paysage:"Sommet",depart:"Pomarey"},
  {nom:"Dent de Crolles",massif:"Chartreuse",denivele:850,distance_km:11,duree_h:5,temps_voiture_min:140,difficulte:"Difficile",paysage:"Panorama",depart:"Col du Coq"},
  // ── 2ᵉ série ──
  {nom:"Mont Myon",massif:"Bugey",denivele:300,distance_km:7,duree_h:3,temps_voiture_min:45,difficulte:"Facile",paysage:"Panorama",depart:"Pressiat"},
  {nom:"Cascade de Cerveyrieu",massif:"Bugey",denivele:100,distance_km:5,duree_h:2,temps_voiture_min:50,difficulte:"Facile",paysage:"Cascade",depart:"Artemare"},
  {nom:"Le Crêt du Nu (Lac du Bourget)",massif:"Bugey",denivele:700,distance_km:10,duree_h:4.5,temps_voiture_min:55,difficulte:"Moyen",paysage:"Panorama",depart:"Béon"},
  {nom:"Le Chapeau de Gendarme",massif:"Haut-Jura",denivele:200,distance_km:5,duree_h:2,temps_voiture_min:55,difficulte:"Facile",paysage:"Panorama",depart:"Septmoncel"},
  {nom:"La Roche Blanche",massif:"Haut-Jura",denivele:400,distance_km:8,duree_h:3.5,temps_voiture_min:55,difficulte:"Moyen",paysage:"Panorama",depart:"Septmoncel"},
  {nom:"Lac de l'Abbaye",massif:"Haut-Jura",denivele:150,distance_km:9,duree_h:3,temps_voiture_min:65,difficulte:"Facile",paysage:"Lac",depart:"Grande-Rivière"},
  {nom:"Lac de Chalain",massif:"Jura",denivele:100,distance_km:8,duree_h:2.5,temps_voiture_min:70,difficulte:"Facile",paysage:"Lac",depart:"Marigny"},
  {nom:"Belvédère de la Reculée de Ladoye",massif:"Jura",denivele:250,distance_km:7,duree_h:3,temps_voiture_min:80,difficulte:"Moyen",paysage:"Panorama",depart:"Ladoye-sur-Seille"},
  {nom:"Mont Poupet",massif:"Jura",denivele:500,distance_km:9,duree_h:4,temps_voiture_min:95,difficulte:"Moyen",paysage:"Panorama",depart:"Salins-les-Bains"},
  {nom:"Source du Lison",massif:"Jura",denivele:200,distance_km:7,duree_h:3,temps_voiture_min:100,difficulte:"Facile",paysage:"Cascade",depart:"Nans-sous-Sainte-Anne"},
  {nom:"La Dent du Chat",massif:"Bugey",denivele:900,distance_km:10,duree_h:5,temps_voiture_min:110,difficulte:"Difficile",paysage:"Panorama",depart:"Le Bourget-du-Lac"},
  {nom:"La Croix du Nivolet",massif:"Bauges",denivele:700,distance_km:11,duree_h:4.5,temps_voiture_min:110,difficulte:"Moyen",paysage:"Panorama",depart:"Les Déserts"},
  {nom:"Le Môle",massif:"Bornes",denivele:900,distance_km:9,duree_h:5,temps_voiture_min:100,difficulte:"Moyen",paysage:"Sommet",depart:"Saint-Jean-de-Tholome"},
  {nom:"Pointe d'Andey",massif:"Bornes",denivele:800,distance_km:8,duree_h:4.5,temps_voiture_min:95,difficulte:"Moyen",paysage:"Panorama",depart:"Bonneville"},
  {nom:"Plateau des Glières",massif:"Bornes",denivele:300,distance_km:9,duree_h:3,temps_voiture_min:90,difficulte:"Facile",paysage:"Plateau",depart:"Thorens-Glières"},
  {nom:"Montagne de Sous-Dine",massif:"Bornes",denivele:1000,distance_km:11,duree_h:5.5,temps_voiture_min:95,difficulte:"Difficile",paysage:"Sommet",depart:"Thorens-Glières"},
  {nom:"Lac de Roy",massif:"Aravis",denivele:600,distance_km:7,duree_h:3.5,temps_voiture_min:110,difficulte:"Moyen",paysage:"Lac",depart:"Le Grand-Bornand"},
  {nom:"Pointe de Marcelly",massif:"Chablais",denivele:700,distance_km:8,duree_h:4,temps_voiture_min:115,difficulte:"Moyen",paysage:"Sommet",depart:"Taninges"},
  {nom:"Lac de Montriond",massif:"Chablais",denivele:100,distance_km:6,duree_h:2,temps_voiture_min:125,difficulte:"Facile",paysage:"Lac",depart:"Montriond"},
  {nom:"Le Mont Granier",massif:"Chartreuse",denivele:1000,distance_km:11,duree_h:5.5,temps_voiture_min:140,difficulte:"Difficile",paysage:"Sommet",depart:"Chapareillan"},
  // ── 3ᵉ série ──
  {nom:"Cascade de Glandieu",massif:"Bugey",denivele:80,distance_km:4,duree_h:1.5,temps_voiture_min:45,difficulte:"Facile",paysage:"Cascade",depart:"Saint-Benoît"},
  {nom:"Le Grand Crêt d'Eau",massif:"Haut-Jura",denivele:750,distance_km:12,duree_h:4.5,temps_voiture_min:45,difficulte:"Moyen",paysage:"Sommet",depart:"Confort"},
  {nom:"Mont Tendre (Suisse)",massif:"Haut-Jura",denivele:600,distance_km:13,duree_h:4.5,temps_voiture_min:75,difficulte:"Moyen",paysage:"Sommet",depart:"Le Pont"},
  {nom:"Le Mont d'Or",massif:"Jura",denivele:400,distance_km:9,duree_h:3.5,temps_voiture_min:100,difficulte:"Moyen",paysage:"Panorama",depart:"Longevilles-Mont-d'Or"},
  {nom:"Lac de Saint-Point",massif:"Jura",denivele:100,distance_km:9,duree_h:2.5,temps_voiture_min:95,difficulte:"Facile",paysage:"Lac",depart:"Malbuisson"},
  {nom:"Le Sur Cou",massif:"Bornes",denivele:600,distance_km:8,duree_h:4,temps_voiture_min:85,difficulte:"Moyen",paysage:"Panorama",depart:"Le Petit-Bornand"},
  {nom:"La Pointe de Beauregard",massif:"Aravis",denivele:400,distance_km:8,duree_h:3,temps_voiture_min:100,difficulte:"Facile",paysage:"Panorama",depart:"La Clusaz"},
  {nom:"Lac des Confins",massif:"Aravis",denivele:150,distance_km:6,duree_h:2,temps_voiture_min:100,difficulte:"Facile",paysage:"Lac",depart:"La Clusaz"},
  {nom:"Le Margériaz",massif:"Bauges",denivele:500,distance_km:9,duree_h:3.5,temps_voiture_min:110,difficulte:"Moyen",paysage:"Plateau",depart:"Les Déserts"},
  {nom:"La Galoppaz",massif:"Bauges",denivele:900,distance_km:10,duree_h:5,temps_voiture_min:100,difficulte:"Difficile",paysage:"Sommet",depart:"Le Châtelard"},
  {nom:"La Dent d'Oche",massif:"Chablais",denivele:1100,distance_km:11,duree_h:6,temps_voiture_min:135,difficulte:"Difficile",paysage:"Sommet",depart:"Bernex"},
  {nom:"Mont Forchat",massif:"Chablais",denivele:700,distance_km:9,duree_h:4,temps_voiture_min:120,difficulte:"Moyen",paysage:"Sommet",depart:"Les Habères"},
  {nom:"Pointe de Chalune",massif:"Chablais",denivele:900,distance_km:10,duree_h:5,temps_voiture_min:130,difficulte:"Difficile",paysage:"Sommet",depart:"Praz-de-Lys"},
  {nom:"Le Grand Som",massif:"Chartreuse",denivele:1000,distance_km:13,duree_h:6,temps_voiture_min:130,difficulte:"Difficile",paysage:"Sommet",depart:"Saint-Pierre-de-Chartreuse"},
  {nom:"La Pinéa",massif:"Chartreuse",denivele:600,distance_km:9,duree_h:4,temps_voiture_min:125,difficulte:"Moyen",paysage:"Sommet",depart:"Col de Porte"},
  {nom:"La Montagne d'Âge",massif:"Genevois",denivele:300,distance_km:7,duree_h:2.5,temps_voiture_min:75,difficulte:"Facile",paysage:"Panorama",depart:"Allonzier-la-Caille"},
  // ── 4ᵉ série : 1h–2h de route, moyennes & difficiles ──
  {nom:"La Tête du Danay",massif:"Aravis",denivele:500,distance_km:7,duree_h:3.5,temps_voiture_min:100,difficulte:"Moyen",paysage:"Panorama",depart:"La Clusaz"},
  {nom:"La Tête de l'Aulp",massif:"Aravis",denivele:700,distance_km:9,duree_h:4.5,temps_voiture_min:100,difficulte:"Moyen",paysage:"Sommet",depart:"La Clusaz"},
  {nom:"Le Roc des Tours",massif:"Aravis",denivele:900,distance_km:9,duree_h:5,temps_voiture_min:110,difficulte:"Difficile",paysage:"Sommet",depart:"Le Grand-Bornand"},
  {nom:"Le Pic de Jallouvre",massif:"Aravis",denivele:1100,distance_km:12,duree_h:6,temps_voiture_min:110,difficulte:"Difficile",paysage:"Sommet",depart:"Le Grand-Bornand"},
  {nom:"L'Aiguille de Borderan",massif:"Aravis",denivele:1100,distance_km:12,duree_h:6,temps_voiture_min:110,difficulte:"Difficile",paysage:"Sommet",depart:"Le Grand-Bornand"},
  {nom:"Le Mont Lachat de Châtillon",massif:"Aravis",denivele:900,distance_km:10,duree_h:5,temps_voiture_min:105,difficulte:"Difficile",paysage:"Sommet",depart:"La Clusaz"},
  {nom:"Mont Baret",massif:"Bornes",denivele:800,distance_km:9,duree_h:4.5,temps_voiture_min:90,difficulte:"Moyen",paysage:"Panorama",depart:"Le Petit-Bornand"},
  {nom:"La Pointe de Talamarche",massif:"Bornes",denivele:900,distance_km:10,duree_h:5,temps_voiture_min:95,difficulte:"Difficile",paysage:"Sommet",depart:"Thônes"},
  {nom:"Le Crêt du Char",massif:"Bauges",denivele:800,distance_km:10,duree_h:4.5,temps_voiture_min:95,difficulte:"Moyen",paysage:"Panorama",depart:"Lescheraines"},
  {nom:"La Croix d'Allant",massif:"Bauges",denivele:800,distance_km:9,duree_h:4.5,temps_voiture_min:110,difficulte:"Moyen",paysage:"Panorama",depart:"Jarsy"},
  {nom:"Le Mont Pécloz",massif:"Bauges",denivele:1300,distance_km:12,duree_h:7,temps_voiture_min:115,difficulte:"Difficile",paysage:"Sommet",depart:"École"},
  {nom:"La Pointe de Chaurionde",massif:"Bauges",denivele:1200,distance_km:11,duree_h:6,temps_voiture_min:115,difficulte:"Difficile",paysage:"Sommet",depart:"École"},
  {nom:"La Pointe de Velan",massif:"Chablais",denivele:900,distance_km:10,duree_h:5,temps_voiture_min:120,difficulte:"Difficile",paysage:"Sommet",depart:"Bellevaux"},
  {nom:"Le Roc d'Enfer",massif:"Chablais",denivele:1200,distance_km:13,duree_h:6.5,temps_voiture_min:120,difficulte:"Difficile",paysage:"Sommet",depart:"La Côte-d'Arbroz"}
];
const SEED_VERSION = 5;

/* ─────────────────────────────  Saints / Fête du jour  ───────────────────── */
const SAINTS={"01-01":"Marie","01-02":"Basile","01-03":"Geneviève","01-04":"Odilon","01-05":"Édouard","01-06":"Mélaine","01-07":"Raymond","01-08":"Lucien","01-09":"Alix","01-10":"Guillaume","01-11":"Pauline","01-12":"Tatiana","01-13":"Yvette","01-14":"Nina","01-15":"Rémi","01-16":"Marcel","01-17":"Roseline","01-18":"Prisca","01-19":"Marius","01-20":"Sébastien","01-21":"Agnès","01-22":"Vincent","01-23":"Barnard","01-24":"François de Sales","01-25":"Conversion de Paul","01-26":"Paule","01-27":"Angèle","01-28":"Thomas d'Aquin","01-29":"Gildas","01-30":"Martine","01-31":"Marcelle","02-01":"Ella","02-02":"Présentation","02-03":"Blaise","02-04":"Véronique","02-05":"Agathe","02-06":"Gaston","02-07":"Eugénie","02-08":"Jacqueline","02-09":"Apolline","02-10":"Arnaud","02-11":"N.-D. de Lourdes","02-12":"Félix","02-13":"Béatrice","02-14":"Valentin","02-15":"Claude","02-16":"Julienne","02-17":"Alexis","02-18":"Bernadette","02-19":"Gabin","02-20":"Aimée","02-21":"Pierre Damien","02-22":"Isabelle","02-23":"Lazare","02-24":"Modeste","02-25":"Roméo","02-26":"Nestor","02-27":"Honorine","02-28":"Romain","02-29":"Auguste","03-01":"Aubin","03-02":"Charles le Bon","03-03":"Guénolé","03-04":"Casimir","03-05":"Olive","03-06":"Colette","03-07":"Félicité","03-08":"Jean de Dieu","03-09":"Françoise","03-10":"Vivien","03-11":"Rosine","03-12":"Justine","03-13":"Rodrigue","03-14":"Mathilde","03-15":"Louise","03-16":"Bénédicte","03-17":"Patrice","03-18":"Cyrille","03-19":"Joseph","03-20":"Herbert","03-21":"Clémence","03-22":"Léa","03-23":"Victorien","03-24":"Catherine de Suède","03-25":"Annonciation","03-26":"Larissa","03-27":"Habib","03-28":"Gontran","03-29":"Gwladys","03-30":"Amédée","03-31":"Benjamin","04-01":"Hugues","04-02":"Sandrine","04-03":"Richard","04-04":"Isidore","04-05":"Irène","04-06":"Marcellin","04-07":"J.-B. de la Salle","04-08":"Julie","04-09":"Gautier","04-10":"Fulbert","04-11":"Stanislas","04-12":"Jules","04-13":"Ida","04-14":"Maxime","04-15":"Paterne","04-16":"Benoît-Joseph","04-17":"Anicet","04-18":"Parfait","04-19":"Emma","04-20":"Odette","04-21":"Anselme","04-22":"Alexandre","04-23":"Georges","04-24":"Fidèle","04-25":"Marc","04-26":"Alida","04-27":"Zita","04-28":"Valérie","04-29":"Catherine de Sienne","04-30":"Robert","05-01":"Fête du Travail","05-02":"Boris","05-03":"Philippe & Jacques","05-04":"Sylvain","05-05":"Judith","05-06":"Prudence","05-07":"Gisèle","05-08":"Victoire 1945","05-09":"Pacôme","05-10":"Solange","05-11":"Estelle","05-12":"Achille","05-13":"Rolande","05-14":"Matthias","05-15":"Denise","05-16":"Honoré","05-17":"Pascal","05-18":"Éric","05-19":"Yves","05-20":"Bernardin","05-21":"Constantin","05-22":"Émile","05-23":"Didier","05-24":"Donatien","05-25":"Sophie","05-26":"Bérenger","05-27":"Augustin","05-28":"Germain","05-29":"Aymar","05-30":"Ferdinand","05-31":"Visitation","06-01":"Justin","06-02":"Blandine","06-03":"Kévin","06-04":"Clotilde","06-05":"Igor","06-06":"Norbert","06-07":"Gilbert","06-08":"Médard","06-09":"Diane","06-10":"Landry","06-11":"Barnabé","06-12":"Guy","06-13":"Antoine de Padoue","06-14":"Élisée","06-15":"Germaine","06-16":"J.-F. Régis","06-17":"Hervé","06-18":"Léonce","06-19":"Romuald","06-20":"Silvère","06-21":"Rodolphe","06-22":"Alban","06-23":"Audrey","06-24":"Jean-Baptiste","06-25":"Prosper","06-26":"Anthelme","06-27":"Fernand","06-28":"Irénée","06-29":"Pierre & Paul","06-30":"Martial","07-01":"Thierry","07-02":"Martinien","07-03":"Thomas","07-04":"Florent","07-05":"Antoine","07-06":"Mariette","07-07":"Raoul","07-08":"Thibaut","07-09":"Amandine","07-10":"Ulrich","07-11":"Benoît","07-12":"Olivier","07-13":"Henri & Joël","07-14":"Fête Nationale","07-15":"Donald","07-16":"N.-D. du Mont-Carmel","07-17":"Charlotte","07-18":"Frédéric","07-19":"Arsène","07-20":"Marina","07-21":"Victor","07-22":"Marie-Madeleine","07-23":"Brigitte","07-24":"Christine","07-25":"Jacques","07-26":"Anne & Joachim","07-27":"Nathalie","07-28":"Samson","07-29":"Marthe","07-30":"Juliette","07-31":"Ignace de Loyola","08-01":"Alphonse","08-02":"Julien Eymard","08-03":"Lydie","08-04":"J.-M. Vianney","08-05":"Abel","08-06":"Transfiguration","08-07":"Gaétan","08-08":"Dominique","08-09":"Amour","08-10":"Laurent","08-11":"Claire","08-12":"Clarisse","08-13":"Hippolyte","08-14":"Évrard","08-15":"Assomption","08-16":"Armel","08-17":"Hyacinthe","08-18":"Hélène","08-19":"Jean Eudes","08-20":"Bernard","08-21":"Christophe","08-22":"Fabrice","08-23":"Rose de Lima","08-24":"Barthélemy","08-25":"Louis","08-26":"Natacha","08-27":"Monique","08-28":"Augustin","08-29":"Sabine","08-30":"Fiacre","08-31":"Aristide","09-01":"Gilles","09-02":"Ingrid","09-03":"Grégoire","09-04":"Rosalie","09-05":"Raïssa","09-06":"Bertrand","09-07":"Reine","09-08":"Nativité de Marie","09-09":"Alain","09-10":"Inès","09-11":"Adelphe","09-12":"Apollinaire","09-13":"Aimé","09-14":"La Sainte-Croix","09-15":"Roland","09-16":"Édith","09-17":"Renaud","09-18":"Nadège","09-19":"Émilie","09-20":"Davy","09-21":"Matthieu","09-22":"Maurice","09-23":"Constant","09-24":"Thècle","09-25":"Hermann","09-26":"Côme & Damien","09-27":"Vincent de Paul","09-28":"Venceslas","09-29":"Michel, Gabriel, Raphaël","09-30":"Jérôme","10-01":"Thérèse de l'E.-J.","10-02":"Léger","10-03":"Gérard","10-04":"François d'Assise","10-05":"Fleur","10-06":"Bruno","10-07":"Serge","10-08":"Pélagie","10-09":"Denis","10-10":"Ghislain","10-11":"Firmin","10-12":"Wilfried","10-13":"Géraud","10-14":"Juste","10-15":"Thérèse d'Avila","10-16":"Edwige","10-17":"Baudouin","10-18":"Luc","10-19":"René","10-20":"Adeline","10-21":"Céline","10-22":"Élodie","10-23":"Jean de Capistran","10-24":"Florentin","10-25":"Crépin","10-26":"Dimitri","10-27":"Émeline","10-28":"Simon & Jude","10-29":"Narcisse","10-30":"Bienvenue","10-31":"Quentin","11-01":"Toussaint","11-02":"Défunts","11-03":"Hubert","11-04":"Charles","11-05":"Sylvie","11-06":"Bertille","11-07":"Carine","11-08":"Geoffroy","11-09":"Théodore","11-10":"Léon","11-11":"Armistice / Martin","11-12":"Christian","11-13":"Brice","11-14":"Sidoine","11-15":"Albert","11-16":"Marguerite","11-17":"Élisabeth","11-18":"Aude","11-19":"Tanguy","11-20":"Edmond","11-21":"Présentation de Marie","11-22":"Cécile","11-23":"Clément","11-24":"Flora","11-25":"Catherine","11-26":"Delphine","11-27":"Séverin","11-28":"Jacques de la M.","11-29":"Saturnin","11-30":"André","12-01":"Florence","12-02":"Viviane","12-03":"François-Xavier","12-04":"Barbara","12-05":"Gérald","12-06":"Nicolas","12-07":"Ambroise","12-08":"Immaculée Conception","12-09":"Pierre Fourier","12-10":"Romaric","12-11":"Daniel","12-12":"Jeanne F.-C.","12-13":"Lucie","12-14":"Odile","12-15":"Ninon","12-16":"Alice","12-17":"Gaël","12-18":"Gatien","12-19":"Urbain","12-20":"Abraham","12-21":"Pierre C.","12-22":"Françoise-Xavière","12-23":"Armand","12-24":"Adèle","12-25":"Noël","12-26":"Étienne","12-27":"Jean","12-28":"Saints Innocents","12-29":"David","12-30":"Roger","12-31":"Sylvestre"};

/* ════════════════════════════════  UTILS  ════════════════════════════════ */
const $  = id => document.getElementById(id);
const arr = obj => Object.entries(obj||{}).map(([id,v]) => ({id, ...v}));
const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const jsStr = s => String(s==null?'':s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");

const JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
const MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
const MOIS3=['jan','fév','mar','avr','mai','juin','juil','aoû','sep','oct','nov','déc'];

function todayStr(){ const n=new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`; }
function fmtH(h){ return h ? h.replace(':','h') : ''; }   // "08:00" -> "08h00"
function fmtVoiture(m){ if(m==null) return ''; m=Math.round(m); if(m<60) return m+' min'; const h=Math.floor(m/60),mm=m%60; return h+'h'+(mm?String(mm).padStart(2,'0'):''); }  // 115 -> "1h55"
// Saisie de date JJ/MM/AAAA (slashs auto) ↔ stockage ISO AAAA-MM-JJ
function fmtDateInput(el){
  let v=el.value.replace(/\D/g,'').slice(0,8);
  let out=v.slice(0,2);
  if(v.length>2) out+='/'+v.slice(2,4);
  if(v.length>4) out+='/'+v.slice(4,8);
  el.value=out;
}
function frToIso(s){
  const m=(s||'').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(!m) return null;
  const d=+m[1], mo=+m[2], y=+m[3];
  if(mo<1||mo>12||d<1||d>31||y<1900||y>2100) return null;
  return y+'-'+String(mo).padStart(2,'0')+'-'+String(d).padStart(2,'0');
}
function isoToFr(iso){
  const m=(iso||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}
function waLink(tel){
  let d=(tel||'').replace(/\D/g,'');
  if(!d) return null;
  if(d.startsWith('0')) d='33'+d.slice(1);   // France : 0X… -> 33X…
  return 'https://wa.me/'+d;
}
function mmdd(d){ return d? d.slice(5,10):''; }
function parseD(d){ return d? new Date(d+'T00:00:00') : null; }
function fmtLong(d){ const t=parseD(d); return t? `${JOURS[t.getDay()]} ${t.getDate()} ${MOIS[t.getMonth()]} ${t.getFullYear()}`:'—'; }
function fmtShort(d){ const t=parseD(d); return t? `${t.getDate()} ${MOIS3[t.getMonth()]} ${t.getFullYear()}`:'—'; }
function age(d){ if(!d) return null; const n=new Date(),b=new Date(d); let a=n.getFullYear()-b.getFullYear(); const m=n.getMonth()-b.getMonth(); if(m<0||(m===0&&n.getDate()<b.getDate()))a--; return a; }

function toast(msg,type){ const t=$('toast'); t.textContent=msg; t.className='show '+(type||'ok'); clearTimeout(t._t); t._t=setTimeout(()=>t.className='',2600); }

/* ── Lookups ── */
const getM = id => CACHE.membres[id] ? {id, ...CACHE.membres[id]} : null;
const getR = id => CACHE.randos[id]  ? {id, ...CACHE.randos[id]}  : null;
const getS = id => CACHE.sorties[id] ? {id, ...CACHE.sorties[id]} : null;
const faitesOf  = rid => arr(CACHE.faites).filter(f=>f.randoId===rid);
const iDid      = rid => arr(CACHE.faites).some(f=>f.randoId===rid && f.membreId===(ME&&ME.id));
const partsOf   = sid => arr(CACHE.participations).filter(p=>p.sortieId===sid);
const iJoin     = sid => partsOf(sid).some(p=>p.membreId===(ME&&ME.id));
const upcoming  = () => arr(CACHE.sorties).filter(s=>s.date>=todayStr()).sort((a,b)=>a.date.localeCompare(b.date));
const sortieVue = s => !ME || s.organisateurId===ME.id || (s.vu && s.vu[ME.id]);
function unseenSortieCount(){ if(!ME) return 0; return upcoming().filter(s=>!sortieVue(s)).length; }
async function markSortiesSeen(){
  if(!ME) return;
  const toMark=arr(CACHE.sorties).filter(s=>s.organisateurId!==ME.id && !(s.vu&&s.vu[ME.id]));
  if(!toMark.length) return;
  await Promise.all(toMark.map(s=>DB.update('sorties/'+s.id+'/vu',{[ME.id]:true})));
}

function avatar(m,size){ const s=size||44;
  if(m&&m.photo) return `<div class="av" style="width:${s}px;height:${s}px"><img src="${m.photo}" alt=""></div>`;
  const ini=m?((m.prenom||'?')[0]+((m.nom||'')[0]||'')).toUpperCase():'?';
  return `<div class="av" style="width:${s}px;height:${s}px;font-size:${Math.round(s*0.4)}px">${esc(ini)}</div>`;
}

/* Liens de recherche vers les 3 sites */
function siteLinks(nom){
  const q = encodeURIComponent(nom+' randonnée');
  return {
    visorando:`https://www.google.com/search?q=${q}+site:visorando.com`,
    altitude :`https://www.google.com/search?q=${q}+site:altituderando.com`,
    annecy   :`https://www.google.com/search?q=${encodeURIComponent(nom+' randonnée lac annecy aravis outdoor')}`
  };
}

function randoChips(r){
  const c=[];
  if(r.temps_voiture_min!=null) c.push(`<span class="chip chip-sky">🚗 ${fmtVoiture(r.temps_voiture_min)}</span>`);
  if(r.denivele!=null)          c.push(`<span class="chip">⛰️ ${r.denivele} m</span>`);
  if(r.distance_km!=null)       c.push(`<span class="chip">📏 ${r.distance_km} km</span>`);
  if(r.duree_h!=null)           c.push(`<span class="chip">⏱️ ${r.duree_h} h</span>`);
  if(r.difficulte)              c.push(`<span class="chip chip-sun">🎯 ${esc(r.difficulte)}</span>`);
  if(r.paysage)                 c.push(`<span class="chip chip-green">🌄 ${esc(r.paysage)}</span>`);
  return c.join('');
}

/* ════════════════════════════════  PHOTO  ════════════════════════════════ */
function compressFile(file, maxSize, cb, quality){
  quality=quality||0.72;
  const rd=new FileReader();
  rd.onload=ev=>{ const img=new Image();
    img.onload=()=>{ let w=img.width,h=img.height;
      if(w>maxSize||h>maxSize){ if(w>h){h=Math.round(h*maxSize/w);w=maxSize;}else{w=Math.round(w*maxSize/h);h=maxSize;} }
      const c=document.createElement('canvas'); c.width=w;c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      cb(c.toDataURL('image/jpeg',quality));
    }; img.src=ev.target.result;
  }; rd.readAsDataURL(file);
}
function pickPhoto(maxSize, cb, quality){
  const inp=$('photo-input'); inp.value=''; inp.multiple=false;
  inp.onchange=e=>{ const f=e.target.files&&e.target.files[0]; if(f) compressFile(f,maxSize,cb,quality); };
  inp.click();
}
function pickPhotos(maxSize, cb, quality){
  const inp=$('photo-input'); inp.value=''; inp.multiple=true;
  inp.onchange=e=>{ const files=[...(e.target.files||[])]; inp.multiple=false; files.forEach(f=>compressFile(f,maxSize,cb,quality)); };
  inp.click();
}

/* ════════════════════════════════  MODAL  ════════════════════════════════ */
function openModal(html){ $('modal-body').innerHTML=html; $('modal-bg').classList.add('open'); }
function closeModal(e){ if(!e||e.target===$('modal-bg')) $('modal-bg').classList.remove('open'); }
function closeModalNow(){ $('modal-bg').classList.remove('open'); }

/* ════════════════════════════════  BOOT  ════════════════════════════════ */
function boot(){
  DB.watch('config',         v=>{ CACHE.config=v||{};         loaded.config=true;  seedIfNeeded(); tryGate(); afterData(); });
  DB.watch('membres',        v=>{ CACHE.membres=v||{};        loaded.membres=true; tryGate(); afterData(); });
  DB.watch('randos',         v=>{ CACHE.randos=v||{};         loaded.randos=true;  seedIfNeeded(); afterData(); });
  DB.watch('faites',         v=>{ CACHE.faites=v||{};         afterData(); });
  DB.watch('sorties',        v=>{ CACHE.sorties=v||{};        onSortiesChange(); afterData(); });
  DB.watch('participations', v=>{ CACHE.participations=v||{}; afterData(); });
  DB.watch('messages',       v=>{ CACHE.messages=v||{};       onMessagesChange(); afterData(); });
  DB.watch('presence',       v=>{ CACHE.presence=v||{};       afterData(); });
}

// La porte d'entrée n'apparaît qu'une fois les données de base chargées
// (évite d'afficher "choisis ton profil" avant que les membres soient connus).
let gateStarted=false;
function tryGate(){
  if(gateStarted || !loaded.config || !loaded.membres) return;
  gateStarted=true;
  gateStart();
}

let seeding=false;
const withDefaults = r => ({...r, region:r.region||r.massif||null, description:r.description||'', url:r.url||'', createdBy:'seed', createdAt:new Date().toISOString()});
function seedIfNeeded(){
  if(seeding || !loaded.config || !loaded.randos) return;
  const cfg = CACHE.config||{};
  if(cfg.seeded && (cfg.seedVersion||1) >= SEED_VERSION) return;
  seeding=true;
  (async()=>{
    try{
      if(!cfg.seeded){
        // Première initialisation
        await DB.update('config',{ password:cfg.password||'rando', teamName:'Team Rando', seeded:true, seedVersion:SEED_VERSION });
        for(const r of SEED_RANDOS) await DB.push('randos', withDefaults(r));
      } else {
        // Mise à jour du catalogue : ajoute les nouvelles randos + complète les massifs manquants
        const have={}; arr(CACHE.randos).forEach(x=>{ have[(x.nom||'').toLowerCase().trim()]=x; });
        for(const r of SEED_RANDOS){
          const ex=have[r.nom.toLowerCase().trim()];
          if(!ex) await DB.push('randos', withDefaults(r));
          else if(!ex.massif && r.massif) await DB.update('randos/'+ex.id,{massif:r.massif});
        }
        await DB.update('config',{ seedVersion:SEED_VERSION });
      }
    }catch(e){ console.error(e); }
  })();
}

let _rt;
function afterData(){
  if(ME && CACHE.membres[ME.id]) ME={id:ME.id, ...CACHE.membres[ME.id]};
  clearTimeout(_rt); _rt=setTimeout(()=>{ if(appReady){ renderView(CURRENT); updateBadges(); } },70);
}

/* ════════════════════════════  ACCÈS / PROFIL  ════════════════════════════ */
function show(id){ $(id).classList.add('show'); }
function hide(id){ $(id).classList.remove('show'); }

function gateStart(){
  if(localStorage.getItem('tr_pw_ok')) pwOk();
  else { show('ov-pw'); setTimeout(()=>$('pw-input').focus(),200); }
}
function submitPw(){
  const v=$('pw-input').value.trim().toLowerCase();
  const real=String((CACHE.config&&CACHE.config.password)||'rando').toLowerCase();
  if(v===real){ localStorage.setItem('tr_pw_ok','1'); hide('ov-pw'); pwOk(); }
  else { $('pw-err').style.display='block'; $('pw-input').value=''; $('pw-input').focus(); }
}
function pwOk(){
  const id=localStorage.getItem('tr_me');
  if(id && CACHE.membres[id]){ ME={id, ...CACHE.membres[id]}; enterApp(); }
  else showPicker();
}
function showPicker(){
  const ms=arr(CACHE.membres).sort((a,b)=>(a.prenom||'').localeCompare(b.prenom||''));
  $('profil-card').innerHTML=`
    <div class="ov-emoji">👋</div>
    <div class="ov-title">Qui es-tu ?</div>
    <div class="ov-sub">Choisis ton profil ou crée-le</div>
    <div style="margin:16px 0 8px;text-align:left">
      ${ms.length?ms.map(m=>`<button class="pick" onclick="choisirProfil('${m.id}')">${avatar(m,46)}<span class="nm">${esc(m.prenom)} ${esc(m.nom||'')}</span></button>`).join(''):'<p class="mini-note">Aucun membre encore. Crée le premier profil 👇</p>'}
    </div>
    <button class="btn btn-sun btn-full" onclick="openCreerProfil()">➕ Créer mon profil</button>`;
  show('ov-profil');
}
function choisirProfil(id){ localStorage.setItem('tr_me',id); ME={id, ...CACHE.membres[id]}; hide('ov-profil'); enterApp(); }

let _npPhoto=null;
function openCreerProfil(){
  _npPhoto=null;
  const first = arr(CACHE.membres).length===0;
  $('profil-card').innerHTML=`
    <div class="ov-title" style="margin-bottom:14px">➕ Mon profil</div>
    <div class="photo-pick">
      <img id="np-prev" class="photo-prev" src="" style="display:none">
      <button class="btn btn-soft btn-sm" onclick="npPhoto()">📷 Ajouter ma photo</button>
    </div>
    <div style="text-align:left">
      <div class="frow">
        <div class="fg"><label>Prénom *</label><input id="np-prenom" placeholder="Jean"></div>
        <div class="fg"><label>Nom</label><input id="np-nom" placeholder="Dupont"></div>
      </div>
      <div class="frow">
        <div class="fg"><label>Naissance</label><input id="np-naiss" inputmode="numeric" maxlength="10" placeholder="JJ/MM/AAAA" autocomplete="off" oninput="fmtDateInput(this)"></div>
        <div class="fg"><label>Téléphone</label><input type="tel" id="np-tel" placeholder="06…"></div>
      </div>
    </div>
    ${first?'<p class="mini-note">🛡️ Tu seras l\'administrateur (1er membre).</p>':''}
    <button class="btn btn-full btn-lg" style="margin-top:6px" onclick="creerProfil()">Créer mon profil ✓</button>
    <button class="btn btn-ghost btn-full btn-sm" style="margin-top:8px" onclick="showPicker()">← Retour</button>`;
}
function npPhoto(){ pickPhoto(400,d=>{ _npPhoto=d; const p=$('np-prev'); p.src=d; p.style.display='block'; }); }
async function creerProfil(){
  const prenom=$('np-prenom').value.trim(); if(!prenom) return toast('Indique ton prénom','err');
  const naissRaw=$('np-naiss').value.trim();
  let naiss=null; if(naissRaw){ naiss=frToIso(naissRaw); if(!naiss) return toast('Date de naissance : format JJ/MM/AAAA','err'); }
  const first=arr(CACHE.membres).length===0;
  const data={ prenom, nom:$('np-nom').value.trim()||null, photo:_npPhoto, date_naissance:naiss,
    telephone:$('np-tel').value.trim()||null, isAdmin:first, createdAt:new Date().toISOString() };
  const id=await DB.push('membres',data);
  localStorage.setItem('tr_me',id); ME={id,...data};
  hide('ov-profil'); toast('Bienvenue '+prenom+' ! 🎉'); enterApp();
}

function enterApp(){
  appReady=true; $('app').style.display='block';
  navigate('home');
  if(METEO===null) loadMeteo();
  startPresence();
  if(pushSupported() && Notification.permission==='granted') enableNotifs(true); // rafraîchit l'abonnement
  clearNotifs();
  // init "déjà vu" pour ne pas notifier l'historique au démarrage
  lastMsgKnown = (msgsArr().slice(-1)[0]||{}).id || '';
  lastSortieKnown = (arr(CACHE.sorties).sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||'')).slice(-1)[0]||{}).id || '';
}

/* ════════════════════════════════  NAV  ════════════════════════════════ */
function navigate(v){
  if(v==='messages'){ if(_forceChan) _forceChan=false; else gotoLastConversation(); }
  CURRENT=v;
  document.querySelectorAll('.view').forEach(e=>e.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(e=>e.classList.remove('active'));
  $('view-'+v).classList.add('active');
  const n=document.querySelector(`.nav-item[data-v="${v}"]`); if(n)n.classList.add('active');
  window.scrollTo(0,0);
  renderView(v);
}
function renderView(v){
  ({home:renderHome,sorties:renderSorties,randos:renderRandos,messages:renderMessages,membres:renderMembres,reglages:renderReglages}[v]||(()=>{}))();
}
function setNavBadge(id,n){ const b=$(id); if(!b) return; b.textContent=n>0?(n>99?'99':n):''; b.style.display=n>0?'flex':'none'; }
function updateBadges(){
  const ns=unseenSortieCount();
  const nm=unreadMsgCount();
  setNavBadge('nav-badge-sorties', ns);
  setNavBadge('nav-badge-messages', nm);
  // Badge icône : seulement en arrière-plan (clearNotifs() l'efface à l'ouverture)
  if(document.visibilityState!=='visible'){
    const total=ns+nm;
    if('setAppBadge' in navigator){ if(total>0) navigator.setAppBadge(total).catch(()=>{}); else navigator.clearAppBadge().catch(()=>{}); }
  }
}

/* ════════════════════════════════  MÉTÉO  ════════════════════════════════ */
const WICON={0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌦️",53:"🌦️",55:"🌧️",61:"🌧️",63:"🌧️",65:"🌧️",71:"❄️",73:"❄️",75:"❄️",77:"❄️",80:"🌦️",81:"🌧️",82:"⛈️",85:"❄️",86:"❄️",95:"⛈️",96:"⛈️",99:"⛈️"};
let FORECAST=null;   // { 'YYYY-MM-DD': {ic,max,min} } sur 16 jours
async function loadMeteo(){
  try{
    const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${NANTUA.lat}&longitude=${NANTUA.lon}&current=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris&forecast_days=16`);
    const d=await r.json();
    METEO={ temp:Math.round(d.current.temperature_2m), ic:WICON[d.current.weathercode]||'🌡️',
      max:Math.round(d.daily.temperature_2m_max[0]), min:Math.round(d.daily.temperature_2m_min[0]) };
    FORECAST={};
    d.daily.time.forEach((date,i)=>{ FORECAST[date]={ ic:WICON[d.daily.weathercode[i]]||'🌡️', max:Math.round(d.daily.temperature_2m_max[i]), min:Math.round(d.daily.temperature_2m_min[i]) }; });
  }catch{ METEO={fail:true}; FORECAST={}; }
  if(appReady && CURRENT==='home') renderHome();
  if(appReady && CURRENT==='sorties') renderSorties();
}

/* ════════════════════════════════  ACCUEIL  ════════════════════════════════ */
function renderHome(){
  const now=new Date();
  const key=`${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const fete=SAINTS[key];
  const teamName=(CACHE.config&&CACHE.config.teamName)||'Team Rando';
  const teamPhoto=CACHE.config&&CACHE.config.teamPhoto;

  const bdays=arr(CACHE.membres).filter(m=>m.date_naissance && mmdd(m.date_naissance)===key);
  const bdayHtml=bdays.length?`<div class="bday"><span class="ic">🎂</span><div>Joyeux anniversaire <b>${bdays.map(b=>esc(b.prenom)).join(', ')}</b> !${bdays[0].date_naissance?` <span style="opacity:.8">(${age(bdays[0].date_naissance)} ans)</span>`:''}</div></div>`:'';

  const meteoLink=`https://www.google.com/search?q=${encodeURIComponent('meteoblue Nantua montagne')}`;
  const meteoHtml=METEO
    ? (METEO.fail
        ? `<a class="hero-meteo" href="${meteoLink}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">🌦️ Météo montagne ↗</a>`
        : `<a class="hero-meteo" href="${meteoLink}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">${METEO.ic} ${METEO.temp}°C à Nantua · ${METEO.min}°/${METEO.max}° · détails ↗</a>`)
    : `<div class="hero-meteo">🌡️ Météo…</div>`;

  const teamBlock = teamPhoto
    ? `<img class="team-photo" src="${teamPhoto}" alt="La Team" onclick="reglerTeamPhoto()">`
    : `<div class="team-photo-empty" onclick="reglerTeamPhoto()"><div style="font-size:38px">📸</div><div>Ajouter la photo de la Team</div></div>`;

  const next=upcoming().slice(0,3);
  const nextHtml=next.length?next.map(sortieCard).join(''):`<div class="empty"><div class="e-ic">🌄</div><p>Pas de sortie prévue.<br>Lance la prochaine aventure !</p><button class="btn btn-sun" style="margin-top:14px" onclick="navigate('sorties')">Créer une sortie</button></div>`;

  $('view-home').innerHTML=`
    <div class="hero">
      <div class="sun">☀️</div>
      <div class="hero-day">${JOURS[now.getDay()]}</div>
      <div class="hero-date">${now.getDate()} ${MOIS[now.getMonth()]}</div>
      ${fete?`<div class="hero-fete">✨ Bonne fête aux ${esc(fete)}</div>`:''}
      ${meteoHtml}
    </div>
    <div class="team-photo-wrap">${teamBlock}</div>
    <div class="team-cap">${esc(teamName)} <small>${arr(CACHE.membres).length} randonneurs · région de Nantua</small></div>
    ${bdayHtml}
    <div class="stats">
      <div class="stat"><div class="v">${arr(CACHE.randos).length}</div><div class="l">Randos</div></div>
      <div class="stat"><div class="v">${arr(CACHE.membres).length}</div><div class="l">La Team</div></div>
      <div class="stat"><div class="v">${arr(CACHE.faites).filter(f=>f.membreId===ME.id).length}</div><div class="l">Mes faites</div></div>
    </div>
    <div class="section-t">📅 Prochaines sorties</div>
    ${nextHtml}
    <div style="height:14px"></div>`;
}

function reglerTeamPhoto(){
  pickPhoto(1100, async d=>{ await DB.update('config',{teamPhoto:d}); toast('Photo de la Team mise à jour ! 📸'); });
}

/* ════════════════════════════════  SORTIES  ════════════════════════════════ */
function sortieCard(s){
  const t=parseD(s.date); const r=s.randoId?getR(s.randoId):null;
  const nom=r?r.nom:(s.titre||'Rando à choisir');
  const org=getM(s.organisateurId);
  const np=partsOf(s.id).length;
  return `<div class="sortie" onclick="openSortie('${s.id}')">
    <div class="sortie-band">
      <div class="sortie-date"><div class="d">${t?t.getDate():'?'}</div><div class="m">${t?MOIS3[t.getMonth()]:''}</div><div class="j">${t?JOURS[t.getDay()].slice(0,3):''}</div></div>
      <div class="sortie-main">
        <div class="sortie-nom">${esc(nom)}</div>
        <div class="sortie-org">Organisé par ${esc(org?org.prenom:'?')}</div>
        <div class="chips">
          ${s.heure?`<span class="chip chip-sun">🚗 ${fmtH(s.heure)}</span>`:''}
          ${iJoin(s.id)?'<span class="chip chip-green">✓ Je viens</span>':''}
          <span class="chip">👥 ${np}</span>
          ${s.nbPhotos?`<span class="chip">📷 ${s.nbPhotos}</span>`:''}
          ${r&&r.temps_voiture_min!=null?`<span class="chip chip-sky">⏱️ ${fmtVoiture(r.temps_voiture_min)} route</span>`:''}
          ${!r?'<span class="chip chip-sun">💡 rando à définir</span>':''}
        </div>
      </div>
    </div></div>`;
}

function calendarStrip(){
  let cells='';
  const today=new Date();
  for(let i=0;i<15;i++){
    const dt=new Date(today.getFullYear(),today.getMonth(),today.getDate()+i);
    const ds=`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    const f=(FORECAST&&FORECAST[ds])||{};
    const ss=arr(CACHE.sorties).filter(s=>s.date===ds);
    const hasS=ss.length>0;
    const onclick = hasS ? `openSortie('${ss[0].id}')` : `creerSortieDate('${ds}')`;
    cells+=`<div class="cal-day ${hasS?'has-sortie':''} ${i===0?'today':''}" onclick="${onclick}">
      <div class="cal-dow">${JOURS[dt.getDay()].slice(0,3)}</div>
      <div class="cal-num">${dt.getDate()}</div>
      <div class="cal-ic">${f.ic||'·'}</div>
      <div class="cal-temp">${f.max!=null?f.max+'°':''}<span>${f.min!=null?f.min+'°':''}</span></div>
      ${hasS?'<div class="cal-dot"></div>':''}
    </div>`;
  }
  return `<div class="section-t" style="padding-bottom:2px">🌤️ Météo 15 jours <small style="font-family:'Nunito';font-weight:700;font-size:12px;color:var(--muted)">· Nantua · touche un jour</small></div>
    <div class="cal-strip">${cells}</div>`;
}
function creerSortieDate(ds){ openCreerSortie(ds); }
function renderSorties(){
  const up=upcoming();
  const past=arr(CACHE.sorties).filter(s=>s.date<todayStr()).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,8);
  $('view-sorties').innerHTML=`
    <div class="phead"><div class="phead-row"><div><h2>📅 Sorties</h2><div class="sub">Qui veut randonner, et quand</div></div>
      <button class="btn btn-sun btn-sm" onclick="openCreerSortie()">+ Sortie</button></div></div>
    ${calendarStrip()}
    <div class="section-t">🥾 Sorties prévues</div>
    ${up.length?up.map(sortieCard).join(''):`<div class="empty"><div class="e-ic">📅</div><p>Aucune sortie à venir</p><button class="btn btn-sun" style="margin-top:14px" onclick="openCreerSortie()">Créer la première</button></div>`}
    ${past.length?`<div class="section-t">🕘 Sorties passées</div>${past.map(sortieCard).join('')}`:''}
    <div style="height:14px"></div>`;
  markSortiesSeen();
}

function openCreerSortie(defDate){
  openModal(`
    <h3>📅 Nouvelle sortie</h3>
    <div class="frow">
      <div class="fg"><label>Quel jour ? *</label><input type="date" id="cs-date" min="${todayStr()}" value="${defDate||''}"></div>
      <div class="fg"><label>🚗 Départ covoiturage</label><input type="time" id="cs-heure"></div>
    </div>
    <div class="fg"><label>📍 Lieu de covoiturage</label><input id="cs-lieu" placeholder="Parking Intermarché Nantua…"></div>
    <div class="fg"><label>Titre (facultatif)</label><input id="cs-titre" placeholder="Sortie du dimanche"></div>
    <div class="fg"><label>Autres infos</label><textarea id="cs-notes" rows="2" placeholder="Pique-nique, équipement…"></textarea></div>
    <p class="mini-note">💡 Inscris-toi, invite les copains, puis l'appli proposera des randos que personne n'a encore faites.</p>
    <button class="btn btn-full btn-lg" onclick="creerSortie()">Créer la sortie ✓</button>`);
}
async function creerSortie(){
  const date=$('cs-date').value; if(!date) return toast('Choisis une date','err');
  const id=await DB.push('sorties',{ date, heure:$('cs-heure').value||null, lieuCovoit:$('cs-lieu').value.trim()||null,
    randoId:null, titre:$('cs-titre').value.trim()||null, vu:{[ME.id]:true},
    organisateurId:ME.id, notes:$('cs-notes').value.trim()||null, statut:'planifiee', createdAt:new Date().toISOString() });
  await DB.push('participations',{ sortieId:id, membreId:ME.id, createdAt:new Date().toISOString() });
  pushNotifyOthers('📅 Nouvelle sortie', (ME.prenom||'Quelqu\'un')+' propose une sortie le '+fmtShort(date), '/');
  closeModalNow(); toast('Sortie créée ! 🎉'); navigate('sorties');
}

function openSortie(id){
  const s=getS(id); if(!s) return;
  const r=s.randoId?getR(s.randoId):null;
  const org=getM(s.organisateurId);
  const isOrga=s.organisateurId===ME.id || ME.isAdmin;
  const parts=partsOf(id).map(p=>getM(p.membreId)).filter(Boolean);
  const nom=r?r.nom:(s.titre||'Rando à définir');

  const partHtml=parts.length?parts.map(m=>`<div class="prow">${avatar(m,38)}<div><b>${esc(m.prenom)} ${esc(m.nom||'')}</b><div style="font-size:12px;color:var(--muted);font-weight:700">${arr(CACHE.faites).filter(f=>f.membreId===m.id).length} randos faites</div></div></div>`).join(''):'<p class="mini-note">Personne inscrit pour l\'instant</p>';

  const covoit = (s.heure||s.lieuCovoit)?`<div class="card" style="margin:0 0 12px;background:#fff7ed;border-color:#fed7aa">
      <div class="card-t" style="font-size:15px">🚗 Covoiturage</div>
      ${s.heure?`<div style="font-weight:800">Départ à ${fmtH(s.heure)}</div>`:''}
      ${s.lieuCovoit?`<div style="margin-top:2px">📍 ${esc(s.lieuCovoit)} <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.lieuCovoit)}" target="_blank" rel="noopener" style="color:var(--sky-d);font-weight:800;text-decoration:none">· voir ↗</a></div>`:''}
    </div>`:'';

  openModal(`
    <div class="dhead"><div class="s">${fmtLong(s.date)}</div><div class="t">${esc(nom)}</div><div class="s">Organisé par ${esc(org?org.prenom:'?')}</div></div>
    ${covoit}
    ${r?`<div class="chips" style="margin-bottom:12px">${randoChips(r)}</div>${r.depart?`<p class="mini-note" style="text-align:left;padding:0 0 10px">📍 Départ rando : <b>${esc(r.depart)}</b>${r.massif||r.region?` · massif ${esc(r.massif||r.region)}`:''}</p>`:''}${siteButtons(r)}`:`<div class="sugg" style="margin-bottom:12px">⚠️ La rando n'est pas encore choisie. Inscrivez-vous puis touchez <b>Suggestions</b>.</div>`}
    ${s.notes?`<div class="card" style="margin:0 0 12px"><div class="card-t">ℹ️ Infos</div>${esc(s.notes)}</div>`:''}
    <div class="card-t" style="padding:0 0 4px">👥 Participants (${parts.length})</div>
    <div style="margin-bottom:14px">${partHtml}</div>
    <div class="card" style="margin:0 0 14px">
      <div class="card-t" style="font-size:15px">📷 Album photos${s.nbPhotos?` (${s.nbPhotos})`:''}</div>
      <div id="gallery-grid" class="gallery-grid"><div class="mini-note" style="text-align:left;padding:4px 0">Chargement…</div></div>
      <button class="btn btn-soft btn-full btn-sm" style="margin-top:10px" onclick="addPhotosToSortie('${id}')">➕ Ajouter des photos</button>
    </div>
    <div class="chips" style="gap:8px">
      ${iJoin(id)?(s.organisateurId===ME.id?'':`<button class="btn btn-danger btn-sm" onclick="quitterSortie('${id}')">Me désinscrire</button>`):`<button class="btn btn-sm" onclick="rejoindreSortie('${id}')">✓ Je viens !</button>`}
      <button class="btn btn-soft btn-sm" onclick="openSuggestions('${id}')">💡 Suggestions rando</button>
      <button class="btn btn-soft btn-sm" onclick="openChan('sortie_${id}','sorties')">💬 Discussion</button>
      ${isOrga?`<button class="btn btn-ghost btn-sm" onclick="openEditSortie('${id}')">✏️ Modifier</button>`:''}
      ${isOrga?`<button class="btn btn-danger btn-sm" onclick="supprSortie('${id}')">🗑️</button>`:''}
    </div>`);
  renderGallery(id);
}

/* ── Album photos d'une sortie (chargé à la demande, stockage Firebase) ── */
let GAL={};
async function renderGallery(sid){
  const g=$('gallery-grid'); if(!g) return;
  let data={};
  try{ data=await DB.get('galleries/'+sid)||{}; }catch(e){}
  const photos=Object.entries(data).map(([pid,p])=>({pid,...p})).sort((a,b)=>(a.at||'').localeCompare(b.at||''));
  GAL[sid]=photos;
  if(!$('gallery-grid')) return; // l'utilisateur a peut-être fermé/changé de vue
  // auto-correction du compteur affiché sur les cartes
  const s=getS(sid); if(s && (s.nbPhotos||0)!==photos.length) DB.update('sorties/'+sid,{nbPhotos:photos.length});
  $('gallery-grid').innerHTML = photos.length
    ? photos.map(p=>`<div class="gthumb" onclick="openPhoto('${sid}','${p.pid}')"><img src="${p.img}" alt="" loading="lazy"></div>`).join('')
    : '<div class="mini-note" style="text-align:left;padding:4px 0">Aucune photo. Ajoutez les premières souvenirs ! 📸</div>';
}
function addPhotosToSortie(sid){
  pickPhotos(1280, async (dataUrl)=>{
    try{
      await DB.push('galleries/'+sid,{img:dataUrl, by:ME.id, at:new Date().toISOString()});
      toast('Photo ajoutée 📸');
      renderGallery(sid);
    }catch(e){ toast('Erreur d\'envoi','err'); }
  }, 0.55);
}
function openPhoto(sid,pid){
  const p=(GAL[sid]||[]).find(x=>x.pid===pid); if(!p) return;
  const by=getM(p.by); const canDel=(p.by===(ME&&ME.id))||(ME&&ME.isAdmin);
  openModal(`
    <img src="${p.img}" style="width:100%;border-radius:14px;display:block">
    <div class="mini-note" style="text-align:left;padding:10px 0 0">📷 ${esc(by?by.prenom:'?')}${p.at?' · '+fmtShort(p.at.slice(0,10)):''}</div>
    <div class="chips" style="margin-top:12px">
      <button class="btn btn-ghost btn-sm" onclick="openSortie('${sid}')">← Retour à la sortie</button>
      ${canDel?`<button class="btn btn-danger btn-sm" onclick="deletePhoto('${sid}','${pid}')">🗑️ Supprimer</button>`:''}
    </div>`);
}
async function deletePhoto(sid,pid){
  if(!confirm('Supprimer cette photo ?')) return;
  await DB.remove('galleries/'+sid+'/'+pid);
  toast('Photo supprimée'); openSortie(sid);
}
async function rejoindreSortie(id){ await DB.push('participations',{sortieId:id,membreId:ME.id,createdAt:new Date().toISOString()}); toast('Tu participes ! 🥾'); openSortie(id); }
async function quitterSortie(id){
  const mine=partsOf(id).find(p=>p.membreId===ME.id); if(mine) await DB.remove('participations/'+mine.id);
  toast('Désinscrit'); openSortie(id);
}
async function supprSortie(id){
  if(!confirm('Supprimer cette sortie ?')) return;
  for(const p of partsOf(id)) await DB.remove('participations/'+p.id);
  await DB.remove('sorties/'+id); closeModalNow(); toast('Sortie supprimée'); navigate('sorties');
}
function openEditSortie(id){
  const s=getS(id);
  openModal(`<h3>✏️ Modifier la sortie</h3>
    <div class="frow">
      <div class="fg"><label>Date</label><input type="date" id="es-date" value="${s.date}"></div>
      <div class="fg"><label>🚗 Départ covoit.</label><input type="time" id="es-heure" value="${s.heure||''}"></div>
    </div>
    <div class="fg"><label>📍 Lieu de covoiturage</label><input id="es-lieu" value="${esc(s.lieuCovoit||'')}" placeholder="Parking Intermarché Nantua…"></div>
    <div class="fg"><label>Titre</label><input id="es-titre" value="${esc(s.titre||'')}"></div>
    <div class="fg"><label>Autres infos</label><textarea id="es-notes" rows="2">${esc(s.notes||'')}</textarea></div>
    <button class="btn btn-full btn-lg" onclick="majSortie('${id}')">Enregistrer</button>`);
}
async function majSortie(id){
  await DB.update('sorties/'+id,{date:$('es-date').value,heure:$('es-heure').value||null,lieuCovoit:$('es-lieu').value.trim()||null,titre:$('es-titre').value.trim()||null,notes:$('es-notes').value.trim()||null});
  toast('Modifié ✓'); openSortie(id);
}

let SUGG={mode:'todo',voiture:0};
function openSuggestions(sid){ SUGG={mode:'todo',voiture:0}; renderSuggModal(sid); }
function suggList(sid){
  const partIds=partsOf(sid).map(p=>p.membreId);
  const done=new Set(arr(CACHE.faites).filter(f=>partIds.includes(f.membreId)).map(f=>f.randoId));
  let list=arr(CACHE.randos);
  if(SUGG.mode==='todo') list=list.filter(r=>!done.has(r.id));
  else if(SUGG.mode==='done') list=list.filter(r=>done.has(r.id));
  if(SUGG.voiture) list=list.filter(r=>(r.temps_voiture_min||999)<=SUGG.voiture);
  list.sort((a,b)=>faitesOf(a.id).length-faitesOf(b.id).length || (a.temps_voiture_min||0)-(b.temps_voiture_min||0));
  return list;
}
function renderSuggModal(sid){
  const modes=[['todo','✨ Jamais faites'],['all','Toutes'],['done','✓ Déjà faites']];
  const voits=[[0,'🚗 Toutes durées'],[30,'≤30min'],[60,'≤1h'],[90,'≤1h30'],[150,'≤2h30']];
  openModal(`
    <h3>💡 Choisir une rando</h3>
    <button class="btn btn-sun btn-full btn-sm" style="margin-bottom:10px" onclick="addRandoForSortie('${sid}')">➕ Ajouter une rando absente (lien Visorando…)</button>
    <p class="mini-note" style="text-align:left;padding:0 0 8px">Ou choisis dans le catalogue. Par défaut : les randos que <b>personne parmi les inscrits</b> n'a faites.</p>
    <div class="filters" style="margin:0 -4px 8px;border:none;padding:0">
      ${modes.map(([v,l])=>`<span class="fchip ${SUGG.mode===v?'on':''}" onclick="setSugg('${sid}','mode','${v}')">${l}</span>`).join('')}
    </div>
    <div class="filters" style="margin:0 -4px 12px;border:none;padding:0">
      ${voits.map(([v,l])=>`<span class="fchip ${SUGG.voiture===v?'on':''}" onclick="setSugg('${sid}','voiture',${v})">${l}</span>`).join('')}
    </div>
    <div id="sugg-list">${suggHtml(sid,suggList(sid))}</div>`);
}
function setSugg(sid,key,val){ SUGG[key]=val; renderSuggModal(sid); }
function suggHtml(sid,list){
  if(!list.length) return '<div class="empty"><div class="e-ic">🤷</div><p>Aucune rando avec ces filtres.<br>Change le filtre ci-dessus.</p></div>';
  return list.map(r=>`<div class="sugg">
    <div class="n">${esc(r.nom)}</div>
    <div class="m">${[r.massif||r.region,r.temps_voiture_min!=null?`🚗 ${fmtVoiture(r.temps_voiture_min)}`:'',r.denivele!=null?`⛰️ ${r.denivele} m`:'',r.difficulte].filter(Boolean).join(' · ')}</div>
    <div class="chips" style="margin-top:9px">
      <button class="btn btn-sm" onclick="choisirRando('${sid}','${r.id}')">✓ Choisir</button>
      <button class="btn btn-ghost btn-sm" onclick="openRando('${r.id}')">Détails</button>
    </div></div>`).join('');
}
async function choisirRando(sid,rid){
  await DB.update('sorties/'+sid,{randoId:rid}); toast('Rando choisie ! 🥾'); openSortie(sid);
}

/* ════════════════════════════════  RANDOS  ════════════════════════════════ */
let RF={};   // filtres randos
function renderRandos(){
  pregeocodeTowns();
  const counts={}; arr(CACHE.randos).forEach(r=>{ const m=r.massif||r.region; if(m) counts[m]=(counts[m]||0)+1; });
  const massifs=Object.keys(counts).sort();
  $('view-randos').innerHTML=`
    <div class="phead"><div class="phead-row"><div><h2>🥾 Randos</h2><div class="sub">${arr(CACHE.randos).length} randos à ≤ 2h30 de Nantua</div></div>
      <button class="btn btn-sun btn-sm" onclick="openCreerRando()">+ Ajouter</button></div></div>
    <div class="searchbar"><div class="search-in">🔍<input id="r-search" placeholder="Chercher une rando, un lieu…" value="${esc(RF.q||'')}" oninput="majSearch(this.value)"></div>
      <select class="massif-select" onchange="setRF('massif',this.value)">
        <option value="">⛰️ Tous les massifs</option>
        ${massifs.map(m=>`<option value="${esc(m)}" ${RF.massif===m?'selected':''}>${esc(m)} (${counts[m]})</option>`).join('')}
      </select>
    </div>
    <div class="filters">
      ${[['','Toutes'],['30','🚗 ≤30min'],['60','≤1h'],['90','≤1h30'],['150','≤2h30']].map(([v,l])=>`<span class="fchip ${(''+(RF.voiture||''))===v?'on':''}" onclick="setRF('voiture','${v}')">${l}</span>`).join('')}
      <span class="fchip ${RF.todo?'on':''}" onclick="toggleRF('todo')">✨ Pas encore faites</span>
      ${['Facile','Moyen','Difficile'].map(d=>`<span class="fchip ${RF.diff===d?'on':''}" onclick="setRF('diff','${RF.diff===d?'':d}')">${d}</span>`).join('')}
    </div>
    <div id="rando-list"></div>`;
  drawRandos();
}
function majSearch(v){ RF.q=v; clearTimeout(window._st); window._st=setTimeout(runSearch,400); }
async function runSearch(){
  const q=(RF.q||'').trim(); RF.near=null;
  if(q){
    const ql=q.toLowerCase();
    const textMatch=arr(CACHE.randos).some(r=>(r.nom+' '+(r.depart||'')+' '+(r.massif||r.region||'')+' '+(r.paysage||'')).toLowerCase().includes(ql));
    if(!textMatch){
      pregeocodeTowns();
      const g=await geocode(q);
      if(g) RF.near={ name:q.charAt(0).toUpperCase()+q.slice(1), lat:g.lat, lon:g.lon };
    }
  }
  drawRandos();
}
function setRF(k,v){ if(v==='')delete RF[k]; else RF[k]=v; renderRandos(); }
function toggleRF(k){ if(RF[k])delete RF[k]; else RF[k]=1; renderRandos(); }
function drawRandos(){
  const el=$('rando-list'); if(!el) return;
  const nearMode=!!RF.near;
  let list, count;
  if(nearMode){
    const radiusKm = RF.voiture ? Math.round(+RF.voiture*0.9) : 30;
    list=arr(CACHE.randos).map(r=>{ const g=randoCoords(r); return {...r,_dist:g?haversineKm(RF.near.lat,RF.near.lon,g.lat,g.lon):null}; })
      .filter(r=>r._dist!=null && r._dist<=radiusKm);
    if(RF.massif) list=list.filter(r=>(r.massif||r.region)===RF.massif);
    if(RF.diff) list=list.filter(r=>r.difficulte===RF.diff);
    if(RF.todo) list=list.filter(r=>!iDid(r.id));
    list.sort((a,b)=>a._dist-b._dist);
    count=`<div class="rando-count">📍 ${list.length} rando${list.length>1?'s':''} autour ${dePrefix(RF.near.name)}<b>${esc(RF.near.name)}</b> (≈ ${radiusKm} km${RF.voiture?'':' / 30 min'})${pregeoDone?'':' · calcul des distances…'}</div>`;
  } else {
    list=arr(CACHE.randos);
    if(RF.q){ const q=RF.q.toLowerCase(); list=list.filter(r=>(r.nom+' '+(r.depart||'')+' '+(r.massif||r.region||'')+' '+(r.paysage||'')).toLowerCase().includes(q)); }
    if(RF.massif) list=list.filter(r=>(r.massif||r.region)===RF.massif);
    if(RF.voiture) list=list.filter(r=>(r.temps_voiture_min||999)<=+RF.voiture);
    if(RF.diff) list=list.filter(r=>r.difficulte===RF.diff);
    if(RF.todo) list=list.filter(r=>!iDid(r.id));
    list.sort((a,b)=>(a.temps_voiture_min||999)-(b.temps_voiture_min||999) || a.nom.localeCompare(b.nom));
    count=`<div class="rando-count">${list.length} rando${list.length>1?'s':''}${RF.massif?` · ${esc(RF.massif)}`:''}${RF.voiture?` · ≤ ${RF.voiture==='150'?'2h30':RF.voiture==='90'?'1h30':RF.voiture==='60'?'1h':RF.voiture+' min'} de route`:''} · triées par temps de voiture ⬇️</div>`;
  }
  el.innerHTML=list.length?count+list.map(r=>{
    const nb=faitesOf(r.id).length; const done=iDid(r.id);
    const sub=nearMode?`📍 à ~${Math.round(r._dist)} km ${dePrefix(RF.near.name)}${esc(RF.near.name)} · ${esc(r.massif||r.region||'')}`:`⛰️ ${esc(r.massif||r.region||'')}${r.depart?` · ${esc(r.depart)}`:''}`;
    return `<div class="rando" onclick="openRando('${r.id}')">
      <div class="rando-top"><div style="flex:1;min-width:0"><div class="rando-nom">${esc(r.nom)}</div><div class="rando-region">${sub}</div></div>
        <button class="rando-done-btn ${done?'done':''}" onclick="quickToggleFaite('${r.id}',event)" title="${done?"Tu l'as faite — appuie pour retirer":'Marquer comme faite'}">${done?'✅':'⬜'}</button></div>
      <div class="chips">${randoChips(r)}</div>
      ${nb?`<div style="font-size:12.5px;color:var(--green-d);font-weight:800;margin-top:7px">👣 Faite ${nb}× dans la team</div>`:'<div style="font-size:12.5px;color:var(--orange-d);font-weight:800;margin-top:7px">✨ Jamais faite par la team</div>'}
    </div>`;
  }).join(''):`<div class="empty"><div class="e-ic">${nearMode?'📍':'🥾'}</div><p>${nearMode?`Aucune rando à ≈ ${RF.voiture?Math.round(+RF.voiture*0.9)+' km':'30 min'} ${dePrefix(RF.near.name)}${esc(RF.near.name)}.<br>Élargis avec ≤1h ou ≤1h30.`:'Aucune rando trouvée'}</p>${nearMode?'':'<button class="btn btn-sun" style="margin-top:12px" onclick="openCreerRando()">Ajouter une rando</button>'}</div>`;
}

function cleanPlace(r){ let d=(r.depart||'').split('/')[0].split('(')[0].trim(); return d || r.massif || r.region || r.nom; }

/* ── Recherche par proximité d'un lieu (géocodage Open-Meteo, cache local) ── */
const GEO_KEY='tr_geo_v1';
let GEO=(()=>{ try{ return JSON.parse(localStorage.getItem(GEO_KEY))||{}; }catch(e){ return {}; } })();
function saveGEO(){ try{ localStorage.setItem(GEO_KEY,JSON.stringify(GEO)); }catch(e){} }
const cleanTown = d => (d||'').split('/')[0].split('(')[0].trim();
async function geocode(name){
  const key=(name||'').toLowerCase().trim(); if(!key) return null;
  if(key in GEO) return GEO[key];
  try{
    const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=fr`);
    const d=await r.json();
    const g=d.results&&d.results[0]?{lat:d.results[0].latitude,lon:d.results[0].longitude}:null;
    GEO[key]=g; saveGEO(); return g;
  }catch(e){ return null; }
}
function haversineKm(la1,lo1,la2,lo2){ const R=6371,t=x=>x*Math.PI/180,dLa=t(la2-la1),dLo=t(lo2-lo1);
  const s=Math.sin(dLa/2)**2+Math.cos(t(la1))*Math.cos(t(la2))*Math.sin(dLo/2)**2; return 2*R*Math.asin(Math.sqrt(s)); }
function randoCoords(r){ return GEO[cleanTown(r.depart).toLowerCase()]||null; }
const dePrefix = n => /^[aeiouyhàâäéèêëîïôöûü]/i.test(n||'') ? "d'" : 'de ';
let pregeoStarted=false, pregeoDone=false;
async function pregeocodeTowns(){
  if(pregeoStarted) return; pregeoStarted=true;
  const towns=[...new Set(arr(CACHE.randos).map(r=>cleanTown(r.depart)).filter(Boolean))];
  for(const t of towns){ if(!(t.toLowerCase() in GEO)){ await geocode(t); await new Promise(r=>setTimeout(r,130)); } }
  pregeoDone=true;
  if(appReady && CURRENT==='randos' && RF.near) drawRandos();
}
function geoQuery(r){ return encodeURIComponent(cleanPlace(r)+', '+(r.massif||r.region||'')+', France'); }
function mapsUrl(r){ return `https://www.google.com/maps/dir/?api=1&destination=${geoQuery(r)}`; }
function meteoUrl(r){ return `https://www.google.com/search?q=${encodeURIComponent('meteoblue '+cleanPlace(r))}`; }

function linkLabel(u){
  const s=(u||'').toLowerCase();
  if(s.includes('visorando'))      return {n:'Fiche Visorando',c:'#2e7d32',i:'V'};
  if(s.includes('altituderando'))  return {n:'Fiche AltitudeRando',c:'#0277bd',i:'A'};
  if(s.includes('annecy')||s.includes('aravis')) return {n:'Lac Annecy Aravis',c:'#f97316',i:'🏔️'};
  if(s.includes('komoot'))         return {n:'Fiche Komoot',c:'#6aa127',i:'K'};
  if(s.includes('google.com/maps')||s.includes('openstreetmap')) return {n:'Carte / trace',c:'#1a73e8',i:'📍'};
  return {n:'Voir la fiche',c:'var(--green)',i:'🔗'};
}
function siteButtons(r){
  const L=siteLinks(r.nom);
  const saved=(r.urls&&r.urls.length)?r.urls:(r.url?[r.url]:[]);
  const savedHtml=saved.map(u=>{ const lb=linkLabel(u); return `<a class="sitelink" href="${esc(u)}" target="_blank" rel="noopener"><span class="logo" style="background:${lb.c}">${lb.i}</span> ${lb.n} <span class="arr">↗</span></a>`; }).join('');
  return `<div style="margin:4px 0 8px">
    ${savedHtml}
    <a class="sitelink" href="${L.visorando}" target="_blank" rel="noopener"><span class="logo" style="background:#2e7d32">V</span> Chercher sur Visorando <span class="arr">↗</span></a>
    <a class="sitelink" href="${L.altitude}" target="_blank" rel="noopener"><span class="logo" style="background:#0277bd">A</span> Chercher sur AltitudeRando <span class="arr">↗</span></a>
    <a class="sitelink" href="${L.annecy}" target="_blank" rel="noopener"><span class="logo" style="background:var(--orange-d)">🏔️</span> Lac Annecy Aravis Outdoor <span class="arr">↗</span></a>
    <a class="sitelink" href="${mapsUrl(r)}" target="_blank" rel="noopener"><span class="logo" style="background:#1a73e8">📍</span> Itinéraire (Google Maps) <span class="arr">↗</span></a>
    <a class="sitelink" href="${meteoUrl(r)}" target="_blank" rel="noopener"><span class="logo" style="background:#0ea5e9">🌦️</span> Météo montagne (meteoblue) <span class="arr">↗</span></a>
  </div>`;
}

function openRando(id){
  const r=getR(id); if(!r) return;
  const faits=faitesOf(id).map(f=>({...f,m:getM(f.membreId)})).filter(x=>x.m);
  const mine=r.createdBy===ME.id || ME.isAdmin;
  openModal(`
    <div class="dhead"><div class="t">${esc(r.nom)}</div><div class="s">⛰️ ${esc(r.massif||r.region||'')}${r.depart?` · départ ${esc(r.depart)}`:''}</div></div>
    <div class="chips" style="margin-bottom:12px">${randoChips(r)}</div>
    ${r.description?`<p style="margin-bottom:12px">${esc(r.description)}</p>`:''}
    ${siteButtons(r)}
    <div class="card" style="margin:12px 0 0">
      <div class="card-t" style="font-size:15px">👣 Qui l'a faite (${faits.length})</div>
      ${faits.length?faits.map(x=>`<div class="prow">${avatar(x.m,34)}<div><b>${esc(x.m.prenom)} ${esc(x.m.nom||'')}</b>${x.date_faite?`<div style="font-size:12px;color:var(--muted);font-weight:700">${fmtShort(x.date_faite)}${x.note?' · '+esc(x.note):''}</div>`:''}</div></div>`).join(''):'<p class="mini-note" style="text-align:left;padding:6px 0">Personne dans la team ne l\'a encore faite ! 🌟</p>'}
    </div>
    <div class="chips" style="margin-top:14px">
      ${iDid(id)?`<button class="btn btn-ghost btn-sm" onclick="retirerFaite('${id}')">✗ Je ne l'ai plus faite</button>`:`<button class="btn btn-sm" onclick="openMarquerFaite('${id}')">✅ Je l'ai faite !</button>`}
      <button class="btn btn-soft btn-sm" onclick="openChan('rando_${id}','randos')">💬 Commentaires</button>
      ${mine?`<button class="btn btn-ghost btn-sm" onclick="openEditRando('${id}')">✏️ Modifier</button>`:''}
      ${mine?`<button class="btn btn-danger btn-sm" onclick="supprRando('${id}')">🗑️</button>`:''}
    </div>`);
}
function openMarquerFaite(id){
  const r=getR(id);
  openModal(`<h3>✅ ${esc(r.nom)}</h3>
    <div class="fg"><label>Quand l'as-tu faite ?</label><input type="date" id="mf-date" value="${todayStr()}"></div>
    <div class="fg"><label>Un mot (facultatif)</label><textarea id="mf-note" rows="2" placeholder="Vue magnifique au sommet…"></textarea></div>
    <button class="btn btn-full btn-lg" onclick="marquerFaite('${id}')">C'est fait ! 🎉</button>`);
}
async function marquerFaite(id){
  await DB.push('faites',{ randoId:id, membreId:ME.id, date_faite:$('mf-date').value||null, note:$('mf-note').value.trim()||null, createdAt:new Date().toISOString() });
  toast('Bravo ! 🎉'); openRando(id);
}
async function retirerFaite(id){
  const mine=arr(CACHE.faites).filter(f=>f.randoId===id&&f.membreId===ME.id);
  for(const f of mine) await DB.remove('faites/'+f.id);
  toast('Retiré'); openRando(id);
}
async function quickToggleFaite(rid,e){
  if(e&&e.stopPropagation) e.stopPropagation();
  if(iDid(rid)){
    const mine=arr(CACHE.faites).filter(f=>f.randoId===rid&&f.membreId===ME.id);
    for(const f of mine) await DB.remove('faites/'+f.id);
    toast('Retiré de tes randos faites');
  } else {
    await DB.push('faites',{randoId:rid,membreId:ME.id,date_faite:todayStr(),note:null,createdAt:new Date().toISOString()});
    toast('Ajouté à tes randos faites ✅');
  }
  drawRandos();
}
async function supprRando(id){
  if(!confirm('Supprimer cette rando du catalogue ?')) return;
  for(const f of faitesOf(id)) await DB.remove('faites/'+f.id);
  await DB.remove('randos/'+id); closeModalNow(); toast('Rando supprimée'); drawRandos();
}
function openCreerRando(){ randoForm(null); }
function openEditRando(id){ randoForm(getR(id)); }
function addRandoForSortie(sid){ randoForm(null, sid); }
function randoForm(r, forSortie){
  r=r||{};
  const urls=(r.urls&&r.urls.length)?r.urls:(r.url?[r.url]:[]);
  const opt=(arr,sel)=>arr.map(o=>`<option ${o===sel?'selected':''}>${o}</option>`).join('');
  openModal(`<h3>${r.id?'✏️ Modifier':(forSortie?'🥾 Rando pour la sortie':'🥾 Nouvelle rando')}</h3>
    ${r.id?'':`<div class="fg" style="background:#f0f9ff;border:1.5px dashed var(--sky);border-radius:14px;padding:12px">
      <label>📥 Importer depuis un lien</label>
      <input type="url" id="rf-import">
      <button class="btn btn-soft btn-sm btn-full" style="margin-top:8px" onclick="importDepuisLien()">Pré-remplir avec ce lien</button>
      <p class="mini-note" style="text-align:left;padding:6px 0 0">Collez un lien Visorando/AltitudeRando : le nom et le lien se remplissent. Complétez ensuite le reste.</p>
    </div>`}
    <div class="fg"><label>Nom *</label><input id="rf-nom" value="${esc(r.nom||'')}"></div>
    <div class="fg"><label>Massif</label>
      <input id="rf-massif" list="massif-list" value="${esc(r.massif||r.region||'')}">
      <datalist id="massif-list">${['Bugey','Haut-Jura','Jura','Genevois','Annecy','Bornes','Aravis','Bauges','Chablais','Chartreuse'].map(m=>`<option value="${m}">`).join('')}</datalist>
    </div>
    <div class="fg"><label>Lieu de départ</label><input id="rf-depart" value="${esc(r.depart||'')}"></div>
    <div class="frow">
      <div class="fg"><label>🚗 Voiture (min)</label><input type="number" id="rf-voiture" value="${r.temps_voiture_min??''}"></div>
      <div class="fg"><label>⛰️ Dénivelé (m)</label><input type="number" id="rf-deniv" value="${r.denivele??''}"></div>
    </div>
    <div class="frow">
      <div class="fg"><label>📏 Distance (km)</label><input type="number" step="0.1" id="rf-dist" value="${r.distance_km??''}"></div>
      <div class="fg"><label>⏱️ Durée (h)</label><input type="number" step="0.5" id="rf-duree" value="${r.duree_h??''}"></div>
    </div>
    <div class="frow">
      <div class="fg"><label>Difficulté</label><select id="rf-diff"><option value="">—</option>${opt(['Facile','Moyen','Difficile','Très difficile'],r.difficulte)}</select></div>
      <div class="fg"><label>Paysage</label><select id="rf-pays"><option value="">—</option>${opt(['Lac','Sommet','Panorama','Forêt','Cascade','Gorges','Plateau','Glacier','Village'],r.paysage)}</select></div>
    </div>
    <div class="fg"><label>Description</label><textarea id="rf-desc" rows="2">${esc(r.description||'')}</textarea></div>
    <div class="fg"><label>🔗 Liens (Visorando, AltitudeRando… — plusieurs possibles)</label>
      <input type="url" id="rf-url1" value="${esc(urls[0]||'')}">
      <input type="url" id="rf-url2" value="${esc(urls[1]||'')}" style="margin-top:6px">
      <input type="url" id="rf-url3" value="${esc(urls[2]||'')}" style="margin-top:6px">
    </div>
    <button class="btn btn-full btn-lg" onclick="saveRando('${r.id||''}','${forSortie||''}')">${r.id?'Enregistrer':(forSortie?'Ajouter & choisir pour la sortie':'Ajouter la rando')} ✓</button>`);
}
function nameFromUrl(u){
  try{
    let path=new URL(u).pathname.replace(/\/+$/,'');
    let seg=decodeURIComponent(path.split('/').pop()||'');
    seg=seg.replace(/\.(html?|php)$/i,'')
           .replace(/^(randonnee|rando|circuit|itineraire|trace|hike|balade)[-_]/i,'')
           .replace(/[-_]+/g,' ')
           .replace(/\s+\d{3,}$/,'')      // enlève un éventuel identifiant numérique final
           .replace(/\s+/g,' ').trim();
    if(!seg) return '';
    return seg.replace(/\b\p{L}/gu,c=>c.toUpperCase());
  }catch(e){ return ''; }
}
function importDepuisLien(){
  const u=$('rf-import').value.trim();
  if(!u) return toast('Collez d\'abord un lien','err');
  if(!/^https?:\/\//i.test(u)) return toast('Lien invalide (doit commencer par http)','err');
  $('rf-url1').value=u;
  const nom=nameFromUrl(u);
  if(nom){ $('rf-nom').value=nom; toast('Nom et lien remplis ✓ — complétez le reste'); }
  else { toast('Lien ajouté ✓ — saisissez le nom à la main'); }
}
async function saveRando(id, forSortie){
  const nom=$('rf-nom').value.trim(); if(!nom) return toast('Indique un nom','err');
  const num=v=>v===''?null:+v;
  const urls=['rf-url1','rf-url2','rf-url3'].map(i=>($(i)?$(i).value.trim():'')).filter(u=>/^https?:\/\//i.test(u));
  const data={ nom, massif:$('rf-massif').value.trim()||null, region:$('rf-massif').value.trim()||null, depart:$('rf-depart').value.trim()||null,
    temps_voiture_min:num($('rf-voiture').value), denivele:num($('rf-deniv').value), distance_km:num($('rf-dist').value),
    duree_h:num($('rf-duree').value), difficulte:$('rf-diff').value||null, paysage:$('rf-pays').value||null,
    description:$('rf-desc').value.trim()||null, urls:urls.length?urls:null, url:urls[0]||null };
  if(id){ await DB.update('randos/'+id,data); toast('Modifié ✓'); openRando(id); }
  else {
    data.createdBy=ME.id; data.createdAt=new Date().toISOString();
    const nid=await DB.push('randos',data);
    if(forSortie){ await DB.update('sorties/'+forSortie,{randoId:nid}); toast('Rando créée et choisie ! 🥾'); openSortie(forSortie); }
    else { toast('Rando ajoutée ! 🥾'); closeModalNow(); drawRandos(); }
  }
}

/* ════════════════════════════════  MESSAGERIE  ════════════════════════════════ */
let lastMsgKnown=null, lastSortieKnown=null, presenceTimer=null;

const msgsArr = () => arr(CACHE.messages).sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||''));
function unreadMsgCount(){ if(!ME) return 0; return msgsArr().filter(m=>m.membreId!==ME.id && !(m.vu&&m.vu[ME.id])).length; }

/* ── Présence (qui est en ligne) ── */
function onlineMembres(){
  const now=Date.now();
  return arr(CACHE.presence).filter(p=>p.lastSeen && (now-p.lastSeen)<120000)
    .map(p=>getM(p.id)).filter(Boolean).sort((a,b)=>(a.prenom||'').localeCompare(b.prenom||''));
}
function isOnline(mid){ const p=CACHE.presence[mid]; return p && p.lastSeen && (Date.now()-p.lastSeen)<120000; }
function beat(){ if(ME) DB.update('presence/'+ME.id,{lastSeen:Date.now(),prenom:ME.prenom}); }
function startPresence(){
  if(!ME) return;
  beat();
  clearInterval(presenceTimer);
  presenceTimer=setInterval(beat,45000);
  document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible'){ beat(); clearNotifs(); if(appReady){ renderView(CURRENT); updateBadges(); } } });
}

/* ── Canaux (Tchat / Sortie / Rando) ── */
let MTAB='general', MCHAN='general', _forceChan=false, _lastChatKey='';
const chanOf   = m => m.channel || 'general';
const chanMsgs = chan => msgsArr().filter(m=>chanOf(m)===chan);
function unreadInChan(chan){ if(!ME) return 0; return chanMsgs(chan).filter(m=>m.membreId!==ME.id && !(m.vu&&m.vu[ME.id])).length; }
function tabUnread(tab){
  if(!ME) return 0;
  if(tab==='general') return unreadInChan('general');
  const pref = tab==='sorties'?'sortie_':'rando_';
  return msgsArr().filter(m=>m.membreId!==ME.id && !(m.vu&&m.vu[ME.id]) && chanOf(m).startsWith(pref)).length;
}
function chanTitle(chan){
  if(chan==='general') return '💬 Tchat général';
  if(chan.indexOf('sortie_')===0){ const s=getS(chan.slice(7)); const r=s&&s.randoId?getR(s.randoId):null; return '📅 '+(r?r.nom:(s&&s.titre)||'Sortie')+(s?' · '+fmtShort(s.date):''); }
  if(chan.indexOf('rando_')===0){ const r=getR(chan.slice(6)); return '🥾 '+(r?r.nom:'Rando'); }
  return '💬';
}
function activeChan(){ if(MTAB==='general') return 'general'; if(MCHAN && MCHAN!=='general') return MCHAN; return null; }
function lastMsg(){ const msgs=msgsArr(); if(!msgs.length) return null; return msgs.slice().sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||'')).pop(); }
function tabOfChan(c){ if(c==='general') return 'general'; if(c.indexOf('sortie_')===0) return 'sorties'; if(c.indexOf('rando_')===0) return 'randos'; return null; }
function lastActivityTab(){ const m=lastMsg(); return m?tabOfChan(chanOf(m)):null; }
function lastActivityChan(){ const m=lastMsg(); return m?chanOf(m):null; }
// Dernière conversation d'un onglet donné (la plus récente de la catégorie)
function lastChanInTab(tab){
  if(tab==='general') return 'general';
  const pref = tab==='sorties'?'sortie_':'rando_';
  const ms=msgsArr().filter(m=>chanOf(m).indexOf(pref)===0).sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||''));
  return ms.length?chanOf(ms[ms.length-1]):null;
}
// Ouvre directement la dernière conversation (toutes catégories) — pour l'entrée dans Messages
function gotoLastConversation(){
  const lc=lastActivityChan();
  if(!lc||lc==='general'){ MTAB='general'; MCHAN='general'; return; }
  MTAB=tabOfChan(lc)||'general'; MCHAN=lc;
}
function setMTab(tab){ MTAB=tab; MCHAN = lastChanInTab(tab); renderMessages(); }
function openChan(chan,tab){ closeModalNow(); _forceChan=true; MTAB=tab||MTAB; MCHAN=chan; if(CURRENT!=='messages') navigate('messages'); else { renderMessages(); _forceChan=false; } }
function backToList(){ MCHAN=null; renderMessages(); }

/* ── Vue Messages ── */
function renderMessages(){
  const online=onlineMembres();
  const tabs=[['general','💬 Tchat'],['sorties','📅 Sorties'],['randos','🥾 Randos']];
  const ac=activeChan();
  const prev=$('msg-input'); const keepVal=prev?prev.value:''; const keepFocus=prev&&document.activeElement===prev;
  const inner = ac ? chatBlock(ac) : (MTAB==='sorties'?discList('sortie'):discList('rando'));
  const lastTab=lastActivityTab();
  $('view-messages').innerHTML=`
    <div class="phead"><h2>💬 Messages</h2><div class="sub">${online.length} en ligne${online.length?' · '+online.map(m=>esc(m.prenom)).join(', '):''}</div></div>
    <div class="filters" style="position:sticky;top:0;z-index:16">
      ${tabs.map(([v,l])=>{const u=tabUnread(v); const isLast=lastTab===v&&MTAB!==v; return `<span class="fchip ${MTAB===v?'on':''}${isLast?' last-chan':''}" onclick="setMTab('${v}')">${l}${u?` <span class="disc-badge" style="display:inline-flex;height:17px;min-width:17px;font-size:10px">${u}</span>`:''}</span>`;}).join('')}
    </div>
    ${inner}`;
  if(ac){ const key=ac+':'+chanMsgs(ac).length; const grow=key!==_lastChatKey; _lastChatKey=key; scrollMsgsBottom(grow); }
  const inp=$('msg-input'); if(inp){ inp.value=keepVal; if(keepFocus) inp.focus(); }
  markMessagesRead(null); // on est dans la messagerie → tout est considéré vu (efface le badge)
}
function scrollMsgsBottom(scroll){
  // On garde l'en-tête + les onglets visibles : seule .msg-list défile (hauteur bornée).
  const ml=$('msg-list'); if(!ml) return;
  if(scroll) window.scrollTo(0,0);
  const apply=()=>{
    ml.style.minHeight='0';   // sinon le min-height CSS écrase la hauteur et le dernier message passe sous la barre
    const top=ml.getBoundingClientRect().top;
    const bar=document.querySelector('.msg-bar'); const barH=bar?bar.offsetHeight:62;
    const navH=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||62;
    const h=window.innerHeight - top - barH - navH - 14;
    ml.style.height=Math.max(160,h)+'px';
    ml.style.overflowY='auto';
    ml.style.paddingBottom='10px';
    if(scroll) ml.scrollTop=ml.scrollHeight;
  };
  requestAnimationFrame(()=>{ apply(); requestAnimationFrame(apply); });
  setTimeout(apply,150); setTimeout(apply,450);
  if(scroll) ml.querySelectorAll('img').forEach(im=>{ if(!im.complete) im.addEventListener('load', ()=>{ apply(); }, {once:true}); });
}
function chatBlock(chan){
  const list=chanMsgs(chan);
  const head = chan==='general' ? '' : `<div class="chat-head"><button class="btn btn-ghost btn-sm" onclick="backToList()">←</button> <b>${esc(chanTitle(chan))}</b></div>`;
  return `${head}
    <div id="msg-list" class="msg-list">${list.length?list.map(msgBubble).join(''):`<div class="empty"><div class="e-ic">💬</div><p>${chan==='general'?'Lance la discussion avec la team !':'Aucun message ici.<br>Écris le premier !'}</p></div>`}</div>
    <div class="msg-bar">
      <button class="msg-photo" onclick="sendPhotoMsg()" aria-label="Envoyer une photo">📷</button>
      <input id="msg-input" class="msg-input" placeholder="Écris un message…" autocomplete="off" onkeydown="if(event.key==='Enter')sendMessage()">
      <button class="msg-send" onclick="sendMessage()" aria-label="Envoyer">➤</button>
    </div>`;
}
/* ── Réactions emoji sur un message ── */
const REACTS=['👍','❤️','😂','😮','😢','🙏','🔥','👏','💪','🥾'];
function openReact(id){
  openModal(`<div style="text-align:center">
    <div style="font-family:'Fredoka',sans-serif;font-size:16px;margin-bottom:12px">Réagir au message</div>
    <div style="display:flex;gap:4px;justify-content:center;flex-wrap:wrap">
      ${REACTS.map(e=>`<button type="button" class="emoji-btn" style="font-size:30px" onclick="toggleReact('${id}','${e}')">${e}</button>`).join('')}
    </div>
    <button class="btn btn-ghost btn-full btn-sm" style="margin-top:12px" onclick="closeModalNow()">Annuler</button>
  </div>`);
}
async function toggleReact(id,e){
  closeModalNow();
  const m=CACHE.messages[id]; if(!m||!ME) return;
  const cur=(m.reactions&&m.reactions[ME.id])||'';
  if(cur===e) await DB.remove('messages/'+id+'/reactions/'+ME.id);
  else await DB.set('messages/'+id+'/reactions/'+ME.id, e);
}
function whoReacted(id,em){
  const m=CACHE.messages[id]; if(!m||!m.reactions) return;
  const names=Object.entries(m.reactions).filter(([,e])=>e===em).map(([mid])=>{const x=getM(mid);return x?esc(x.prenom):'?';});
  toast(em+'  '+names.join(', '));
}
function reactsHtml(m){
  const r=m.reactions||{}; const ids=Object.keys(r); if(!ids.length) return '';
  const groups={}; ids.forEach(mid=>{ const e=r[mid]; (groups[e]=groups[e]||[]).push(mid); });
  return `<div class="msg-reacts">${Object.entries(groups).map(([e,list])=>`<span class="react-chip${ME&&list.indexOf(ME.id)>=0?' mine':''}" onclick="event.stopPropagation();whoReacted('${m.id}','${e}')">${e}${list.length>1?' '+list.length:''}</span>`).join('')}</div>`;
}
function discList(kind){
  if(kind==='sortie'){
    const ss=arr(CACHE.sorties).sort((a,b)=>b.date.localeCompare(a.date));
    if(!ss.length) return '<div class="empty"><div class="e-ic">📅</div><p>Aucune sortie.<br>Crée une sortie pour en discuter.</p></div>';
    return '<div style="padding:6px 0 14px">'+ss.map(s=>{
      const chan='sortie_'+s.id, n=chanMsgs(chan).length, u=unreadInChan(chan);
      const r=s.randoId?getR(s.randoId):null, nom=r?r.nom:(s.titre||'Sortie');
      return `<div class="disc-row" onclick="openChan('${chan}','sorties')"><div style="min-width:0"><b>${esc(nom)}</b><div class="membre-det">${fmtShort(s.date)} · ${n} message${n>1?'s':''}</div></div>${u?`<span class="disc-badge">${u}</span>`:'<span class="disc-arr">›</span>'}</div>`;
    }).join('')+'</div>';
  }
  const cnt={}; msgsArr().forEach(m=>{ const c=chanOf(m); if(c.indexOf('rando_')===0) cnt[c.slice(6)]=(cnt[c.slice(6)]||0)+1; });
  const ids=Object.keys(cnt);
  if(!ids.length) return '<div class="empty"><div class="e-ic">🥾</div><p>Aucune discussion de rando.<br>Ouvre une rando → « Commentaires ».</p></div>';
  return '<div style="padding:6px 0 14px">'+ids.map(id=>{
    const r=getR(id); if(!r) return ''; const chan='rando_'+id, u=unreadInChan(chan);
    return `<div class="disc-row" onclick="openChan('${chan}','randos')"><div style="min-width:0"><b>${esc(r.nom)}</b><div class="membre-det">${cnt[id]} message${cnt[id]>1?'s':''}</div></div>${u?`<span class="disc-badge">${u}</span>`:'<span class="disc-arr">›</span>'}</div>`;
  }).join('')+'</div>';
}
function msgBubble(m){
  const me=m.membreId===(ME&&ME.id);
  const auth=getM(m.membreId);
  const t=new Date(m.createdAt);
  const hh=isNaN(t.getTime())?'':`${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`;
  const seers=Object.keys(m.vu||{}).filter(id=>id!==m.membreId).map(id=>getM(id)).filter(Boolean);
  const seenTxt=me&&seers.length?`<div class="msg-seen">✓ Vu par ${seers.map(s=>esc(s.prenom)).join(', ')}</div>`:'';
  const canDel=me||(ME&&ME.isAdmin);
  return `<div class="msg-row ${me?'mine':''}">
    ${me?'':avatar(auth,32)}
    <div class="msg-col">
      <div class="msg-bub ${me?'mine':''}" onclick="openReact('${m.id}')" title="Appuie pour réagir">
        ${me?'':`<div class="msg-auth">${esc(auth?auth.prenom:'?')}</div>`}
        ${m.img?`<img class="msg-img" src="${m.img}" alt="" onclick="event.stopPropagation();openImg('${m.id}')">`:''}
        ${m.texte?`<div class="msg-txt">${esc(m.texte)}</div>`:''}
        <div class="msg-meta">${hh}${canDel?` · <span class="msg-del" onclick="event.stopPropagation();supprMessage('${m.id}')">supprimer</span>`:''}</div>
        ${seenTxt}
      </div>
      ${reactsHtml(m)}
    </div>
  </div>`;
}
function openImg(id){ const m=CACHE.messages[id]; if(!m||!m.img) return; openModal(`<img src="${m.img}" style="width:100%;border-radius:14px;display:block"><button class="btn btn-ghost btn-full btn-sm" style="margin-top:12px" onclick="closeModalNow()">Fermer</button>`); }
function notifyMsg(chan,t){
  const where = chan==='general' ? 'Tchat' : chanTitle(chan).replace(/^\S+\s/,'');
  pushNotifyOthers('💬 '+(ME.prenom||'')+' — '+where, (t||'📷 Photo').slice(0,140), '/');
}
async function sendMessage(){
  const inp=$('msg-input'); if(!inp) return; const t=inp.value.trim(); if(!t) return;
  const chan=activeChan()||'general';
  inp.value=''; maybeEnableNotifs();
  await DB.push('messages',{ membreId:ME.id, channel:chan, texte:t, createdAt:new Date().toISOString(), vu:{[ME.id]:true} });
  notifyMsg(chan,t);
}
function sendPhotoMsg(){
  const chan=activeChan()||'general'; maybeEnableNotifs();
  pickPhoto(1100, async img=>{
    await DB.push('messages',{ membreId:ME.id, channel:chan, img, createdAt:new Date().toISOString(), vu:{[ME.id]:true} });
    toast('Photo envoyée 📷'); notifyMsg(chan,null);
  }, 0.6);
}
async function supprMessage(id){
  if(!confirm('Supprimer ce message ?')) return;
  await DB.remove('messages/'+id); toast('Message supprimé');
}
async function markMessagesRead(chan){
  if(!ME) return;
  let list=msgsArr().filter(m=>m.membreId!==ME.id && !(m.vu&&m.vu[ME.id]));
  if(chan) list=list.filter(m=>chanOf(m)===chan);
  if(!list.length) return;
  await Promise.all(list.map(m=>DB.update('messages/'+m.id+'/vu',{[ME.id]:true})));
}

/* ── Notifications (message / sortie) ── */
function requestNotifPerm(){
  try{ if('Notification' in window && Notification.permission==='default') Notification.requestPermission(); }catch(e){}
}
function notify(title,body){
  try{ if('Notification' in window && Notification.permission==='granted') new Notification(title,{body:body,icon:'icon-192.png'}); }catch(e){}
}

/* ── Notifications PUSH (même appli fermée) ── */
function urlB64ToUint8(base64){
  const pad='='.repeat((4-base64.length%4)%4);
  const b=(base64+pad).replace(/-/g,'+').replace(/_/g,'/');
  const raw=atob(b); const arr=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) arr[i]=raw.charCodeAt(i);
  return arr;
}
function pushSupported(){ return ('Notification' in window) && ('serviceWorker' in navigator) && ('PushManager' in window); }
async function enableNotifs(silent){
  if(!pushSupported()){ if(!silent) toast('Notifications non gérées par cet appareil','err'); return false; }
  try{
    const perm = await Notification.requestPermission();
    if(perm!=='granted'){ if(!silent) toast('Notifications refusées'); return false; }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if(!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey: urlB64ToUint8(VAPID_PUBLIC) });
    if(ME) await DB.set('pushSubs/'+ME.id, sub.toJSON());
    if(!silent){ toast('Notifications activées 🔔'); if(appReady&&CURRENT==='reglages') renderReglages(); }
    return true;
  }catch(e){ console.error('enableNotifs',e); if(!silent) toast('Activation impossible','err'); return false; }
}
function maybeEnableNotifs(){ if(pushSupported() && Notification.permission==='default') enableNotifs(true); }
async function pushNotifyOthers(title, body, url){
  try{
    const subsObj = await DB.get('pushSubs') || {};
    const subs = Object.entries(subsObj).filter(([id])=>id!==(ME&&ME.id)).map(([,s])=>s);
    if(!subs.length) return;
    await fetch('/api/notify', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ subs, title, body, url: url||'/' }) });
  }catch(e){ console.warn('push KO', e); }
}
async function clearNotifs(){
  if('clearAppBadge' in navigator) navigator.clearAppBadge().catch(()=>{});
  try{ const reg=await navigator.serviceWorker.ready; (await reg.getNotifications()).forEach(n=>n.close()); }catch(e){}
}
function notifStatusHtml(){
  if(!pushSupported()) return '<p class="mini-note" style="text-align:left;padding:0">Non géré ici. Sur iPhone : installe d\'abord l\'appli sur l\'écran d\'accueil, puis rouvre-la depuis l\'icône.</p>';
  const p=Notification.permission;
  if(p==='granted') return '<div class="btn btn-soft btn-full btn-sm" style="cursor:default">✅ Notifications activées</div>';
  if(p==='denied')  return '<p class="mini-note" style="text-align:left;padding:0">⛔ Bloquées. Autorise les notifications dans les réglages de ton téléphone, puis reviens.</p>';
  return '<button class="btn btn-full btn-sm" onclick="enableNotifs()">🔔 Activer les notifications</button>';
}
function onMessagesChange(){
  if(!appReady||!ME){ return; }
  const latest=msgsArr().slice(-1)[0];
  if(lastMsgKnown===null){ lastMsgKnown=latest?latest.id:''; return; }
  if(latest && latest.id!==lastMsgKnown && latest.membreId!==ME.id){
    const a=getM(latest.membreId);
    const chan=chanOf(latest);
    const where = chan==='general' ? '' : ' ('+chanTitle(chan).replace(/^\S+\s/,'').slice(0,22)+')';
    const corps = latest.texte ? latest.texte.slice(0,38) : '📷 photo';
    if(CURRENT!=='messages') toast('💬 '+(a?a.prenom:'')+where+' : '+corps);
  }
  lastMsgKnown=latest?latest.id:'';
}
function onSortiesChange(){
  if(!appReady||!ME){ return; }
  const latest=arr(CACHE.sorties).sort((a,b)=>(a.createdAt||'').localeCompare(b.createdAt||'')).slice(-1)[0];
  if(lastSortieKnown===null){ lastSortieKnown=latest?latest.id:''; return; }
  if(latest && latest.id!==lastSortieKnown && latest.organisateurId!==ME.id){
    const a=getM(latest.organisateurId);
    const msg=(a?a.prenom:'Quelqu\'un')+' propose une sortie le '+fmtShort(latest.date);
    if(CURRENT!=='sorties'){ toast('📅 '+msg); notify('Team Rando — nouvelle sortie', msg); }
  }
  lastSortieKnown=latest?latest.id:'';
}

/* ════════════════════════════════  MEMBRES  ════════════════════════════════ */
function renderMembres(){
  const ms=arr(CACHE.membres).sort((a,b)=>(a.prenom||'').localeCompare(b.prenom||''));
  const key=`${String(new Date().getMonth()+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}`;
  const online=onlineMembres();
  $('view-membres').innerHTML=`
    <div class="phead"><h2>👥 La Team</h2><div class="sub">${ms.length} randonneurs · ${online.length} en ligne</div></div>
    ${online.length?`<div class="online-row">${online.map(m=>`<span class="online-pill"><span class="dot-online"></span>${esc(m.prenom)}</span>`).join('')}</div>`:''}
    ${ms.map(m=>{
      const a=age(m.date_naissance); const bd=m.date_naissance&&mmdd(m.date_naissance)===key; const on=isOnline(m.id);
      const wa=m.telephone?waLink(m.telephone):null; const canDel=ME&&(ME.isAdmin||m.id===ME.id);
      return `<div class="membre"><span class="av-wrap">${avatar(m,52)}${on?'<span class="dot-online"></span>':''}</span>
        <div style="flex:1;min-width:0">
          <div class="membre-nom">${esc(m.prenom)} ${esc(m.nom||'')} ${bd?'🎂':''}${m.isAdmin?'<span class="chip chip-sun" style="font-size:10px;padding:2px 7px">admin</span>':''}</div>
          ${m.date_naissance?`<div class="membre-det">🎂 ${isoToFr(m.date_naissance)}${a!=null?` · ${a} ans`:''}</div>`:''}
          <div class="membre-det">${m.telephone?`<a href="tel:${esc(m.telephone)}">📞 ${esc(m.telephone)}</a>${wa?` &nbsp; <a href="${wa}" target="_blank" rel="noopener" style="color:#1faa53">💬 WhatsApp</a>`:''}`:'pas de téléphone'}</div>
          <div class="membre-det">🥾 ${arr(CACHE.faites).filter(f=>f.membreId===m.id).length} randos faites${on?' · <span style="color:var(--green-d)">en ligne</span>':''}</div>
        </div>
        ${canDel?`<button title="Supprimer le profil" onclick="supprMembreTeam('${m.id}','${jsStr(m.prenom)}')" style="flex-shrink:0;width:38px;height:38px;border-radius:50%;border:none;background:#fee2e2;color:#dc2626;font-size:16px;cursor:pointer">🗑️</button>`:''}
      </div>`;
    }).join('')}
    <div style="height:14px"></div>`;
}

/* ════════════════════════════════  RÉGLAGES  ════════════════════════════════ */
function renderReglages(){
  const mode=DB.mode==='firebase';
  $('view-reglages').innerHTML=`
    <div class="phead"><h2>⚙️ Réglages</h2></div>
    <div class="card">
      <div style="display:flex;align-items:center;gap:14px">${avatar(ME,58)}
        <div><div style="font-family:'Fredoka';font-size:20px;font-weight:600">${esc(ME.prenom)} ${esc(ME.nom||'')}</div>
        <div style="font-size:13px;color:var(--muted);font-weight:700">${age(ME.date_naissance)!=null?age(ME.date_naissance)+' ans · ':''}${esc(ME.telephone||'—')}</div></div>
      </div>
      <button class="btn btn-soft btn-full btn-sm" style="margin-top:12px" onclick="openEditProfil()">✏️ Modifier mon profil & ma photo</button>
    </div>
    <div class="card">
      <div class="card-t">📸 Photo de la Team</div>
      <p class="mini-note" style="text-align:left;padding:0 0 10px">Elle s'affiche sur la page d'accueil pour tout le monde.</p>
      <button class="btn btn-soft btn-full btn-sm" onclick="reglerTeamPhoto()">Changer la photo de la Team</button>
    </div>
    ${ME.isAdmin?`<div class="card">
      <div class="card-t">🛡️ Administration</div>
      <button class="btn btn-soft btn-full btn-sm" style="margin-bottom:8px" onclick="openCodeGroupe()">🔑 Changer le code du groupe</button>
      <button class="btn btn-soft btn-full btn-sm" onclick="openGestionMembres()">👥 Gérer les membres</button>
    </div>`:''}
    <div class="card">
      <div class="card-t">🔔 Notifications</div>
      <p class="mini-note" style="text-align:left;padding:0 0 10px">Être prévenu d'un nouveau message ou d'une nouvelle sortie, même quand l'appli est fermée.</p>
      ${notifStatusHtml()}
    </div>
    <div class="card">
      <div class="card-t">📲 Installer l'appli</div>
      <p class="mini-note" style="text-align:left;padding:0">
        <b>iPhone :</b> ouvre le lien dans Safari → bouton Partager → « Sur l'écran d'accueil ».<br>
        <b>Android :</b> ouvre le lien dans Chrome → menu ⋮ → « Installer l'application ».
      </p>
    </div>
    <div class="card">
      <div class="card-t">ℹ️ État</div>
      <p class="mini-note" style="text-align:left;padding:0">
        🔒 <b style="color:var(--green-d)">Application sécurisée</b> : accès par code du groupe + connexion privée chiffrée (HTTPS).<br>
        Données partagées : ${mode?'<b style="color:var(--green-d)">✅ Firebase (tout le monde voit la même chose)</b>':'<span class="badge-mode">⚠️ Mode local (test, ce téléphone seulement)</span><br>Pour partager avec les amis, configure Firebase (voir INSTALLATION.md).'}
      </p>
    </div>
    <div style="padding:4px 14px 0"><button class="btn btn-danger btn-full" onclick="changerProfil()">🔄 Changer de profil</button></div>
    <div style="height:14px"></div>`;
}
function changerProfil(){ localStorage.removeItem('tr_me'); location.reload(); }

function openEditProfil(){
  let photo=ME.photo||null;
  openModal(`<h3>✏️ Mon profil</h3>
    <div class="photo-pick">
      <img id="ep-prev" class="photo-prev" src="${ME.photo||''}" style="${ME.photo?'':'display:none'}">
      <button class="btn btn-soft btn-sm" onclick="epPhoto()">📷 ${ME.photo?'Changer':'Ajouter'} ma photo</button>
    </div>
    <div class="frow">
      <div class="fg"><label>Prénom</label><input id="ep-prenom" value="${esc(ME.prenom||'')}"></div>
      <div class="fg"><label>Nom</label><input id="ep-nom" value="${esc(ME.nom||'')}"></div>
    </div>
    <div class="frow">
      <div class="fg"><label>Naissance</label><input id="ep-naiss" inputmode="numeric" maxlength="10" placeholder="JJ/MM/AAAA" autocomplete="off" oninput="fmtDateInput(this)" value="${isoToFr(ME.date_naissance)}"></div>
      <div class="fg"><label>Téléphone</label><input type="tel" id="ep-tel" value="${esc(ME.telephone||'')}"></div>
    </div>
    <button class="btn btn-full btn-lg" onclick="majProfil()">Enregistrer ✓</button>`);
  window.epPhoto=()=>pickPhoto(400,d=>{ photo=d; const p=$('ep-prev'); p.src=d; p.style.display='block'; });
  window.majProfil=async()=>{
    const naissRaw=$('ep-naiss').value.trim();
    let naiss=null; if(naissRaw){ naiss=frToIso(naissRaw); if(!naiss) return toast('Date de naissance : format JJ/MM/AAAA','err'); }
    await DB.update('membres/'+ME.id,{ prenom:$('ep-prenom').value.trim()||ME.prenom, nom:$('ep-nom').value.trim()||null,
      date_naissance:naiss, telephone:$('ep-tel').value.trim()||null, photo });
    toast('Profil mis à jour ✓'); closeModalNow();
  };
}
function openCodeGroupe(){
  openModal(`<h3>🔑 Code du groupe</h3>
    <p class="mini-note" style="text-align:left;padding:0 0 10px">C'est le code que tes amis saisissent pour entrer. Communique-le-leur avec le lien.</p>
    <div class="fg"><label>Nouveau code</label><input id="cg-code" value="${esc(CACHE.config.password||'rando')}"></div>
    <button class="btn btn-full btn-lg" onclick="majCode()">Enregistrer</button>`);
  window.majCode=async()=>{ const c=$('cg-code').value.trim(); if(!c) return toast('Code vide','err');
    await DB.update('config',{password:c}); toast('Code mis à jour ✓'); closeModalNow(); };
}
function openGestionMembres(){
  const ms=arr(CACHE.membres).sort((a,b)=>(a.prenom||'').localeCompare(b.prenom||''));
  openModal(`<h3>👥 Gérer les membres</h3>
    ${ms.map(m=>`<div class="prow">${avatar(m,38)}
      <div style="flex:1"><b>${esc(m.prenom)} ${esc(m.nom||'')}</b>${m.isAdmin?' <span class="chip chip-sun" style="font-size:10px">admin</span>':''}</div>
      ${m.id!==ME.id?`<button class="btn btn-danger btn-sm" onclick="supprMembre('${m.id}','${jsStr(m.prenom)}')">🗑️</button>${!m.isAdmin?`<button class="btn btn-ghost btn-sm" onclick="promo('${m.id}')">⭐</button>`:''}`:'<span style="font-size:12px;color:var(--muted);font-weight:800">moi</span>'}
    </div>`).join('')}
    <p class="mini-note" style="text-align:left">⭐ = passer admin · 🗑️ = retirer du groupe</p>`);
}
async function supprMembre(id,nom){ if(!confirm('Retirer '+nom+' du groupe ?')) return; await DB.remove('membres/'+id); toast('Membre retiré'); openGestionMembres(); }
async function supprMembreTeam(id,prenom){
  const self=id===(ME&&ME.id);
  if(!confirm((self?'Supprimer TON profil':'Supprimer le profil de '+prenom)+' ?\nC\'est définitif.')) return;
  await DB.remove('membres/'+id);
  try{ await DB.remove('pushSubs/'+id); }catch(e){}
  if(self){ localStorage.removeItem('tr_me'); location.reload(); return; }
  toast('Profil supprimé'); renderMembres();
}
async function promo(id){ await DB.update('membres/'+id,{isAdmin:true}); toast('Nouveau admin ⭐'); openGestionMembres(); }

/* ════════════════════════════════  START  ════════════════════════════════ */
window.submitPw=submitPw; window.navigate=navigate; window.closeModal=closeModal;
window.choisirProfil=choisirProfil; window.openCreerProfil=openCreerProfil;
window.showPicker=showPicker; window.npPhoto=npPhoto; window.creerProfil=creerProfil;
window.fmtDateInput=fmtDateInput;
window.reglerTeamPhoto=reglerTeamPhoto;
window.openSortie=openSortie; window.openCreerSortie=openCreerSortie; window.creerSortie=creerSortie; window.creerSortieDate=creerSortieDate;
window.addPhotosToSortie=addPhotosToSortie; window.openPhoto=openPhoto; window.deletePhoto=deletePhoto;
window.rejoindreSortie=rejoindreSortie; window.quitterSortie=quitterSortie; window.supprSortie=supprSortie;
window.openEditSortie=openEditSortie; window.majSortie=majSortie;
window.openSuggestions=openSuggestions; window.setSugg=setSugg; window.choisirRando=choisirRando;
window.openRando=openRando; window.openCreerRando=openCreerRando; window.openEditRando=openEditRando; window.addRandoForSortie=addRandoForSortie;
window.saveRando=saveRando; window.importDepuisLien=importDepuisLien;
window.majSearch=majSearch; window.setRF=setRF; window.toggleRF=toggleRF;
window.openMarquerFaite=openMarquerFaite; window.marquerFaite=marquerFaite; window.retirerFaite=retirerFaite; window.supprRando=supprRando;
window.openEditProfil=openEditProfil; window.openCodeGroupe=openCodeGroupe; window.openGestionMembres=openGestionMembres;
window.supprMembre=supprMembre; window.supprMembreTeam=supprMembreTeam; window.promo=promo; window.changerProfil=changerProfil;
window.sendMessage=sendMessage; window.supprMessage=supprMessage; window.quickToggleFaite=quickToggleFaite;
window.setMTab=setMTab; window.openChan=openChan; window.backToList=backToList; window.sendPhotoMsg=sendPhotoMsg; window.openImg=openImg;
window.enableNotifs=enableNotifs;

if(window.__DB_READY) boot();
else window.addEventListener('db-ready', boot);
