# CV en ligne de Maxime Montcel, version Star Wars

CV web statique (HTML, CSS, JavaScript sans framework) publié avec GitHub Pages. Étudiant en **BTS SIO option SISR**, je suis en **alternance au Département de la Loire**.

- **Site en ligne** : https://maximemontcel.github.io/page_cv/
- **Dépôt** : https://github.com/MaximeMontcel/page_cv
- **CV au format PDF** : [cv-maxime-montcel.pdf](cv-maxime-montcel.pdf)
- **Contact** : [profil GitHub](https://github.com/MaximeMontcel) et [profil LinkedIn](https://www.linkedin.com/in/maxime-montcel-b7a4153b3/)

> Confidentialité : aucun numéro de téléphone, e-mail ou adresse postale n'est publié, ni sur le site, ni dans le dépôt.

---

## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| Fond étoilé animé | Canvas en 3D légère qui suit la souris, étoiles filantes, **saut en hyperespace** au lancement du générique et au retour en haut |
| Arrivée en hyperespace | Au chargement du site, on démarre en plein saut en hyperespace, puis on en sort avec un flash lumineux : la bataille d'Endor surgit et le texte du hero se met en place |
| Bataille d'Endor | Fond du hero animé en canvas : l'Étoile de la Mort II en construction au-dessus de la lune d'Endor, X-wing et chasseurs TIE en combat (**tirs rebelles rouges, tirs impériaux verts**), explosions à chaque vaisseau détruit, destroyers et croiseurs qui échangent des tirs, superlaser vert de l'Étoile de la Mort et passage du Faucon Millenium |
| Sabres laser | Une poignée et une lame lumineuse qui **s'allume** à l'apparition de chaque section (couleur différente par section) |
| Générique Star Wars | « Il y a bien longtemps… », logo, texte déroulant en 3D et **vraie musique du générique** (« Main Title » de John Williams, piste officielle sur YouTube) qui démarre avec le logo ; bouton pour couper le son ; version synthétisée de secours si YouTube ne répond pas |
| Yoda assistant | Bulle de dialogue avec effet machine à écrire, utilisable au clavier et lue par les lecteurs d'écran |
| Droids | R2-D2, C-3PO et BB-8 **dessinés et animés en SVG** (dôme qui pivote, bras qui salue, boule qui roule) présentent mes qualités ; les cartes s'inclinent en 3D sous la souris |
| Galaxie | Bandes défilantes de 20 planètes et 21 personnages **dessinés et animés en SVG** : coups de sabre, tirs de blaster, salut de la main, Force, éclairs de Sidious, oreilles de Yoda et Grogu, planètes qui tournent avec nuages, lunes, anneaux et vaisseaux. Bouton pause, **flèches précédent / suivant** et défilement manuel (glisser au doigt, molette, flèches du clavier) |
| Effets sonores | Sabre, blaster, bips de droids, hyperespace : **désactivés par défaut**, activables avec le bouton haut-parleur (choix mémorisé) |
| Navigation | Menu collant avec soulignement lumineux qui suit la section lue, barre de progression, bouton retour en haut |
| CV PDF | Version imprimable sur 2 pages A4, générée à partir de la feuille de style d'impression |

## Arborescence

```
.
├─ index.html               Page unique du CV
├─ css/style.css            Styles (mobile d'abord, impression, mouvements réduits)
├─ js/app.js                Interactions (chargé avec defer)
├─ fonts/                   Police Chakra Petch (WOFF2) et sa licence OFL
├─ img/                     Favicon SVG, image de partage, poignée de sabre
│  └─ anime/                46 illustrations animées en SVG (personnages, planètes, droids, Yoda, Faucon Millenium)
├─ cv-maxime-montcel.pdf    CV téléchargeable
├─ cv.md                    Contenu du CV rédigé en Markdown (étape 1 des consignes)
├─ grille_evaluation.md     Grille d'évaluation du projet
├─ docs/consignes.md        Consignes d'origine du projet
└─ .nojekyll                Publication GitHub Pages sans traitement Jekyll
```

## Choix techniques

- **HTML sémantique** : un seul `<h1>`, une hiérarchie `h2 → h3 → h4` sans saut, balises `header`, `nav`, `main`, `section`, `article`, `aside` et `footer`, et un lien d'évitement « Aller au contenu principal ».
- **Responsive** : mobile d'abord, grilles CSS (1, 2 puis 4 colonnes), menu défilant horizontalement sur mobile, aucun défilement horizontal de la page à 375 px.
- **Accessibilité** :
  - contraste minimal mesuré de **6,85:1** (le seuil WCAG AA est de 4,5:1) ;
  - focus visibles ;
  - toutes les fonctions utilisables au clavier (Échap ferme Yoda et le générique, focus maintenu dans le générique) ;
  - attributs `alt` sur toutes les images ;
  - textes de liens explicites ;
  - toutes les animations coupées si l'utilisateur a activé « réduire les animations ».
- **SEO** : `title` et `meta description` pertinents, URL canonique, balises Open Graph pour le partage, favicon.
- **Performance** :
  - illustrations en SVG animé (quelques Ko chacune, compressées par GitHub Pages) et photos WebP redimensionnées à leur taille d'affichage ×2 ;
  - `loading="lazy"` sous la ligne de flottaison et `fetchpriority="high"` sur l'image du hero ;
  - une seule police web (2 graisses), hébergée dans le dépôt et préchargée : aucun blocage du rendu par un service externe ;
  - script en `defer` ;
  - aucune bibliothèque ;
  - animations mises en pause hors écran (la bataille du hero s'arrête dès qu'il n'est plus visible) ;
  - fond du hero dessiné en canvas : plus de grande photo à télécharger.
- **Sons et musique** : effets sonores synthétisés en JavaScript (Web Audio API) ; la musique du générique est lue depuis la piste officielle sur YouTube (IFrame API, domaine youtube-nocookie.com). Le lecteur n'est chargé qu'au clic sur « Lancer le générique » : aucun fichier protégé n'est stocké dans le dépôt et la page n'est pas ralentie au chargement.

## Lancer le site en local

Ouvrir `index.html` dans un navigateur suffit. Pour un rendu identique à GitHub Pages, on peut aussi utiliser l'extension « Live Server » de VS Code.

## Mettre à jour le CV PDF

1. Ouvrir le site dans Chrome ou Edge.
2. Faire `Ctrl + P` et choisir « Enregistrer au format PDF ».
3. Désactiver « En-têtes et pieds de page » puis enregistrer sous `cv-maxime-montcel.pdf`.

La feuille de style d'impression (section 13 de `style.css`) produit automatiquement une version noir et blanc sur 2 pages.

---

## 🧪 Auto-évaluation

### Résultats des validateurs

| Outil | Résultat | Observations |
|---|---|---|
| W3C HTML (validator.w3.org) | **0 erreur, 0 avertissement** | Testé le 21/10/2026 sur l'URL publique. La V1 n'avait pas pu être testée : le site renvoyait une erreur 404 (GitHub Pages non activé) |
| W3C CSS (jigsaw.w3.org) | **CSS valide, 0 erreur** | 36 avertissements d'information seulement (variables CSS non vérifiables, préfixes `-webkit-`) |
| Outiref (audit SEO) | **4 étoiles** | H1 unique et hiérarchie correcte, URL canonique, liens internes et externes. Remarques : textes alternatifs vides sur les illustrations décoratives (le nom figure déjà sous chaque carte), meta description courte (128 caractères), tiret bas dans l'URL du dépôt. Suite à l'audit : titre allongé à 11 mots, textes alternatifs ajoutés et meta description allongée (corrections n° 26) |
| Structure des titres (Outiref / plan W3C) | H1 unique, hiérarchie H2 → H4 sans saut | Plan relevé par le W3C : `h1` Maxime Montcel, 8 `h2` (Profil, Mon alternance, Compétences, Projets, Parcours, Mes atouts, La galaxie, Me contacter), `h3` et `h4` imbriqués correctement |
| PageSpeed mobile | **Performance 93 · Accessibilité 100 · Bonnes pratiques 100 · SEO 100** | FCP 2,5 s · LCP 2,5 s · TBT 0 ms · CLS 0,004 · Speed Index 3,9 s (Moto G Power, 4G lente). [Rapport](https://pagespeed.web.dev/analysis/https-maximemontcel-github-io-page_cv/rekrqs6xhi?form_factor=mobile) |
| PageSpeed ordinateur | **Performance 98 · Accessibilité 100 · Bonnes pratiques 100 · SEO 100** | [Rapport](https://pagespeed.web.dev/analysis/https-maximemontcel-github-io-page_cv/rekrqs6xhi?form_factor=desktop) |
| Contrastes (calcul WCAG) | 6,85:1 au minimum | Texte gris 9,5:1, liens et dates jaunes 15:1, bouton principal 15,6:1 |
| Responsive | OK à 375 px, 800 px et 1 024 px | Largeur de page égale à la largeur d'écran (pas de défilement horizontal) |
| Clavier | OK | Lien d'évitement, menu, boutons, Yoda, générique (Tab bloqué dans la fenêtre, Échap pour fermer) |
| Console du navigateur | 0 erreur | |

### Mesures V1 → version finale

| Indicateur | V1 | Version finale | Évolution |
|---|---|---|---|
| Poids des images transférées | 4 246 Ko (51 JPEG/PNG) | 79 Ko (1 WebP + 47 SVG compressés, fond en canvas) | **−98 %** |
| Polices web | 3 familles, 9 graisses, dont un `@import` bloquant dans le CSS | 1 famille, 2 graisses (20 Ko) hébergées dans le dépôt et préchargées | −7 graisses, plus aucune requête vers Google Fonts |
| Poids du CSS | 44,7 Ko (≈ 250 lignes inutilisées) | 39 Ko, sans code mort | −13 % |
| Poids du HTML | 37,7 Ko | 34 Ko | −10 % |
| Poids du JavaScript | 22 Ko | 55 Ko (bataille d'Endor, hyperespace, lecteur YouTube, bandes défilantes) | +150 %, sans aucune bibliothèque, chargé en `defer` |
| Contextes audio | 2 | 1 (partagé) | |
| Données personnelles dans le dépôt | Téléphone et e-mail dans `cv.md` | Aucune | Conforme |
| Sons au chargement | Activés par défaut | Désactivés par défaut | |
| Fichier PDF du CV | Absent | 2 pages A4 | |

### Journal des corrections (V1 → finale)

| # | Problème constaté | Cause | Correction | Impact |
|---|---|---|---|---|
| 1 | Téléphone et e-mail personnel publiés | Présents dans `cv.md` | Supprimés, contact par GitHub et LinkedIn uniquement | Respect de la confidentialité |
| 2 | Images trop lourdes (jusqu'à 205 Ko pièce) | Photos 880 px affichées en 360 px, PNG de 200 Ko affichés en 116 px | Conversion en WebP à la taille d'affichage ×2 | −87 % de poids |
| 3 | Rendu bloqué par les polices | `@import` Google Fonts en tête du CSS, 3 familles | Une seule famille chargée par `<link>` dans le HTML | Moins de requêtes bloquantes |
| 4 | Boutons de Yoda atteignables au clavier alors qu'ils étaient masqués | Bulle masquée avec `aria-hidden` mais toujours focusable | Attribut `hidden` + `aria-expanded` sur le bouton Yoda | Erreur d'accessibilité supprimée |
| 5 | Générique : la touche Tab sortait de la fenêtre | Pas de piège de focus | Focus maintenu dans le générique, page en `inert` | Navigation clavier cohérente |
| 6 | Bandes défilantes impossibles à arrêter (WCAG 2.2.2) | Pause au survol uniquement | Bouton « Mettre en pause » + pause au focus | Conforme WCAG |
| 7 | Avertissement W3C sur `role="banner"` | Rôle redondant sur `<header>` | Rôle supprimé | Validation plus propre |
| 8 | `aria-label` sur des `div` sans rôle | Bandes défilantes non identifiées | `role="region"` et listes `<ul>` | Validation W3C |
| 9 | Menu sur 3 à 4 lignes sur mobile | 10 liens qui passaient à la ligne | 8 liens sur une ligne défilante, lien actif recentré automatiquement | Plus de titres cachés sous le menu |
| 10 | Vaisseaux reconstruits pendant le défilement sur mobile | `resize` déclenché par la barre d'adresse | Reconstruction seulement si on passe le seuil de 768 px | Plus de saccades |
| 11 | Vaisseaux figés sur le bord gauche en mode « animations réduites » | Création des vaisseaux même sans animation | Aucun vaisseau créé dans ce mode | Rendu propre |
| 12 | Effets lourds : flous de 70 px, `backdrop-filter` partout, ombres animées | Choix graphiques de la V1 | Fond en canvas, effets limités à `transform` et `opacity`, pause hors écran | Animations fluides |
| 13 | Fautes et incohérences | « Contremandier », « Chosen One », « TS SIO », stage sans description | Textes relus et corrigés | Contenu professionnel |
| 14 | Pas de projets ni de section alternance | Section absente | Sections « Mon alternance » et « Projets » avec liens GitHub | Lecture recruteur plus rapide |
| 15 | Pas de favicon ni de balises de partage | Non prévus | Favicon SVG, Open Graph, URL canonique | SEO et partage |
| 16 | CV encore orienté « recherche d'alternance » | Alternance trouvée au Département de la Loire | Hero, profil, section « Mon alternance », contact, générique, Yoda, title, meta description et PDF mis à jour | Contenu à jour et cohérent |
| 17 | Missions d'alternance absentes | Information ajoutée après la signature | Support aux utilisateurs et gestion de parc ajoutés (alternance, compétences, expériences, PDF) | Expérience professionnelle concrète |
| 18 | 44 photos officielles (droits Lucasfilm, 438 Ko) | Visuels repris du Databank | Remplacées par des illustrations SVG dessinées et animées pour le site | −63 % sur ces images et plus de photos sous droits |
| 19 | Fond du hero : photo fixe de Coruscant (33 Ko) et vaisseaux en images | Décor statique | Bataille d'Endor dessinée et animée en canvas, avec une image fixe si l'utilisateur réduit les animations | Fond vivant, 4 images en moins (−64 Ko) |
| 20 | Arrivée sur le site sans mise en scène | Pas d'introduction visuelle | Saut en hyperespace d'environ 1 s au chargement puis sortie vers la bataille (désactivé si l'utilisateur réduit les animations) | Effet « waouh » dès l'ouverture, contenu lisible en moins de 2,5 s |
| 21 | Musique du générique synthétisée, peu fidèle | Pas de fichier audio dans le dépôt | Lecture de la piste officielle « Main Title » via l'API YouTube, chargée au clic seulement, avec repli sur la version synthétisée | Vraie musique sans héberger d'œuvre protégée |
| 22 | « Erreur de configuration » du lecteur YouTube | Site ouvert en fichier local : YouTube refuse la lecture sans site d'origine (erreur 153), et un délai de secours trop court (4 s) | Détection du fichier local avec message explicatif, préchargement au survol du bouton, délai porté à 9 s, repli sur la musique synthétisée seulement en cas d'erreur réelle | Musique officielle fiable sur le site en ligne |
| 23 | Personnages trop génériques | Mêmes formes pour tous | Casques de Vador, Kylo, Din et Boba redessinés, coiffures propres à chacun, capuche et visage de Dark Sidious, Reine Amidala maquillée, arbalète laser de Chewbacca, détails de costumes | Personnages reconnaissables au premier coup d'œil |
| 24 | Le bouton « Mettre en pause » des bandes défilantes ne faisait rien | Règle CSS de l'animation plus prioritaire que celle de la pause | Défilement piloté en JavaScript : pause fiable, flèches précédent / suivant, défilement manuel au doigt, à la molette ou au clavier, reprise automatique après 2,5 s | Pause conforme WCAG 2.2.2 et navigation libre |
| 25 | Accroche du profil trop longue (environ 5 lignes) | Deux paragraphes | Accroche ramenée à 2 phrases, comme le demande la consigne (2–3 lignes) | Lecture recruteur plus rapide |
| 26 | Outiref : 43 images sans texte alternatif, meta description courte (128 caractères) | Illustrations considérées comme décoratives | Texte alternatif sur les 41 illustrations de la galaxie, meta description allongée à 209 caractères | Meilleure note SEO, images décrites pour les lecteurs d'écran |
| 27 | PageSpeed : la police Google bloque le rendu (≈ 1,4 s d'économie possible) | Feuille de style chargée depuis fonts.googleapis.com | Police hébergée dans le dépôt (2 × 10 Ko) et préchargée | Affichage plus rapide, plus de dépendance externe |
| 28 | Yoda et le Faucon Millenium encore en photos officielles | Visuels du Databank | Redessinés en SVG comme les autres personnages | 100 % de visuels originaux, −41 Ko |

### Auto-évaluation selon la grille

| Critère | Auto-note (0–4) | Justification |
|---|---:|---|
| C1 Contenu | 3 | Accroche claire, alternance au Département de la Loire (support utilisateurs, gestion de parc), 2 projets avec résultats chiffrés (−98 %, limites anti-spam) |
| C2 HTML sémantique | 4 | H1 unique, hiérarchie sans saut, balises structurelles, ancres et liens explicites |
| C3 Responsive | 4 | Grilles mobile d'abord, typographie fluide, testé de 375 px à 1 024 px sans défilement horizontal |
| C4 UX & accessibilité | 4 | Contrastes ≥ 6,85:1, focus visibles, clavier complet, mouvements réduits respectés, sons désactivés par défaut |
| C5 SEO | 4 | Title et meta description ciblés, Open Graph, URL canonique, structure claire |
| C6 Performance | 4 | PageSpeed 93 sur mobile et 98 sur ordinateur (mesuré avant d'héberger la police), TBT 0 ms, CLS 0,004 ; images −98 %, une police locale, `defer`, aucune bibliothèque |
| C7 Validation | 4 | W3C HTML 0 erreur, CSS valide, titres conformes, PageSpeed 93 à 100 ; journal de 24 corrections V1 → finale |
| C8 Publication | 4 | En ligne sur https://maximemontcel.github.io/page_cv/, testé sur mobile (375 px), plusieurs itérations après publication |
| C9 Auto-évaluation | 4 | Résultats, causes, corrections et impact mesuré |
| C10 Confidentialité | 4 | Aucune donnée sensible, message de contact clair via GitHub et LinkedIn |
| C11 Qualité du dépôt | 3 | Arborescence claire, README utile, commits numérotés V1 → V10 (le dernier, « Modif du README », pourrait être plus précis) |

---

## Crédits

Projet scolaire non commercial. Star Wars appartient à Lucasfilm Ltd. Toutes les illustrations (personnages, droids, planètes, vaisseaux, bataille d'Endor) sont dessinées et animées pour ce site, sans photo officielle. Univers : [Wookieepedia](https://starwars.fandom.com/fr/). Musique du générique : « Main Title » de John Williams et du London Symphony Orchestra, piste officielle fournie à YouTube par Universal Music Group, lue sans être copiée dans le dépôt. Police : [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch), sous licence SIL Open Font License 1.1 (voir `fonts/OFL.txt`).
