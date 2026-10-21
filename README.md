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
| Hero Coruscant | Ville de Coruscant en fond, X-wing, chasseurs TIE et Faucon Millenium qui traversent l'écran |
| Sabres laser | Une poignée et une lame lumineuse qui **s'allume** à l'apparition de chaque section (couleur différente par section) |
| Générique Star Wars | « Il y a bien longtemps… », logo, texte déroulant en 3D et musique générée en Web Audio (bouton pour couper le son) |
| Yoda assistant | Bulle de dialogue avec effet machine à écrire, utilisable au clavier et lue par les lecteurs d'écran |
| Droids | R2-D2, C-3PO et BB-8 présentent mes qualités ; les cartes s'inclinent en 3D sous la souris |
| Galaxie | Bandes défilantes de 20 planètes et 21 personnages, avec un bouton pause |
| Effets sonores | Sabre, blaster, bips de droids, hyperespace : **désactivés par défaut**, activables avec le bouton haut-parleur (choix mémorisé) |
| Navigation | Menu collant avec soulignement lumineux qui suit la section lue, barre de progression, bouton retour en haut |
| CV PDF | Version imprimable sur 2 pages A4, générée à partir de la feuille de style d'impression |

## Arborescence

```
.
├─ index.html               Page unique du CV
├─ css/style.css            Styles (mobile d'abord, impression, mouvements réduits)
├─ js/app.js                Interactions (chargé avec defer)
├─ img/                     Images WebP optimisées + favicon SVG + image de partage
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
  - images WebP redimensionnées à leur taille d'affichage ×2 ;
  - `loading="lazy"` sous la ligne de flottaison et `fetchpriority="high"` sur l'image du hero ;
  - une seule police web (2 graisses) ;
  - script en `defer` ;
  - aucune bibliothèque ;
  - animations mises en pause hors écran.
- **Sons et musique** : synthétisés en JavaScript (Web Audio API), donc aucun fichier audio à télécharger.

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
| W3C (validator.w3.org) | À relever sur l'URL publique | La V1 n'a pas pu être testée : le site renvoyait une erreur 404 (GitHub Pages non activé) |
| Outiref | H1 unique, hiérarchie H2 → H4 sans saut | Plan vérifié dans le navigateur : `h1`, 8 `h2`, puis `h3` et `h4` imbriqués correctement |
| PageSpeed mobile | À relever sur l'URL publique | Performance : … · Accessibilité : … · Bonnes pratiques : … · SEO : … |
| Contrastes (calcul WCAG) | 6,85:1 au minimum | Texte gris 9,5:1, liens et dates jaunes 15:1, bouton principal 15,6:1 |
| Responsive | OK à 375 px, 800 px et 1 024 px | Largeur de page égale à la largeur d'écran (pas de défilement horizontal) |
| Clavier | OK | Lien d'évitement, menu, boutons, Yoda, générique (Tab bloqué dans la fenêtre, Échap pour fermer) |
| Console du navigateur | 0 erreur | |

### Mesures V1 → version finale

| Indicateur | V1 | Version finale | Évolution |
|---|---|---|---|
| Poids des images chargées | 4 246 Ko (51 JPEG/PNG) | 530 Ko (WebP) | **−87 %** |
| Polices web | 3 familles, 9 graisses, dont un `@import` bloquant dans le CSS | 1 famille, 2 graisses, `<link>` + `preconnect` | −7 graisses |
| Poids du CSS | 44,7 Ko (≈ 250 lignes inutilisées) | 37 Ko, sans code mort | −17 % |
| Poids du HTML | 37,7 Ko | 33 Ko | −12 % |
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

### Auto-évaluation selon la grille

| Critère | Auto-note (0–4) | Justification |
|---|---:|---|
| C1 Contenu | 3 | Accroche claire, alternance au Département de la Loire, 2 projets avec résultats chiffrés (−87 %, limites anti-spam) ; l'expérience professionnelle reste limitée à des stages d'observation |
| C2 HTML sémantique | 4 | H1 unique, hiérarchie sans saut, balises structurelles, ancres et liens explicites |
| C3 Responsive | 4 | Grilles mobile d'abord, typographie fluide, testé de 375 px à 1 024 px sans défilement horizontal |
| C4 UX & accessibilité | 4 | Contrastes ≥ 6,85:1, focus visibles, clavier complet, mouvements réduits respectés, sons désactivés par défaut |
| C5 SEO | 4 | Title et meta description ciblés, Open Graph, URL canonique, structure claire |
| C6 Performance | 3 | Images −87 %, une police, `defer`, aucune bibliothèque ; à confirmer avec PageSpeed |
| C7 Validation | 3 | Corrections listées ci-dessus ; scores W3C et PageSpeed à relever après publication |
| C8 Publication | à faire | Activer GitHub Pages (Settings → Pages → `main` / root), puis tester sur mobile |
| C9 Auto-évaluation | 4 | Résultats, causes, corrections et impact mesuré |
| C10 Confidentialité | 4 | Aucune donnée sensible, message de contact clair via GitHub et LinkedIn |
| C11 Qualité du dépôt | 3 | Arborescence claire, README utile, commits numérotés V1 → V8 |

---

## Crédits

Projet scolaire non commercial. Star Wars et ses visuels appartiennent à Lucasfilm Ltd. Sources : [Databank StarWars.com](https://www.starwars.com/databank) et [Wookieepedia](https://starwars.fandom.com/fr/). Police : [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) (Google Fonts).
