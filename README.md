# page_cv page HTML statique

Un CV en ligne simple, lisible et responsive, publié avec GitHub Pages.

> IMPORTANT – Confidentialité  
> N’ajoutez aucune donnée personnelle sensible : pas de numéro de téléphone, pas d’adresse postale, pas d’e‑mail personnel.  
> Lien de contact conseillé : votre profil GitHub uniquement.

---

## 🎯 Objectifs d’apprentissage

- Publier un site statique avec GitHub Pages.
- Structurer un document HTML sémantique (H1–H6).
- Mettre en page responsive (CSS ou Bootstrap).
- Appliquer des bases d’UX, d’accessibilité et de SEO.
- Améliorer les performances (optimisation images, chargement des scripts).
- Utiliser des validateurs (W3C, Outiref, PageSpeed) et corriger les problèmes.

---

## ✅ Livrables

- L’URL du dépôt GitHub.
- L’URL du site en ligne via GitHub Pages.
- Une section “Auto‑évaluation” (dans ce README) indiquant :
  - Les résultats/résumés des outils (W3C, Outiref, PageSpeed).
  - Les corrections effectuées entre la V1 et la version finale.

---

## 🧭 Notions à connaître (résumé express)

- Git/GitHub : un dépôt contient vos fichiers ; `commit` enregistre une version ; `push` l’envoie sur GitHub ; GitHub Pages héberge votre site statique depuis la branche choisie.
- HTML sémantique : structure logique du document (un seul H1, puis H2/H3…), balises significatives (`header`, `nav`, `main`, `section`, `article`, `footer`).
- CSS responsive : mobile‑first, flexbox/grid, media queries ; ou Bootstrap (grille `.container` `.row` `.col`).
- Accessibilité/UX : contraste suffisant, tailles de police lisibles, navigation clavier (focus visibles), textes de lien explicites, attributs `alt` sur les images.
- SEO minimum : `<title>` descriptif, `<meta name="description">`, balises sémantiques, contenu clair.
- Performance : images légères, JS différé (`defer`), CSS minimal, éviter les ressources inutiles.
- Validation : W3C (syntaxe), Outiref (titres/structure), PageSpeed (performance et bonnes pratiques).

---

## 🛠️ Prérequis

- Compte GitHub (utilisez votre mail scolaire/pro).
- Git installé (ou utiliser l’éditeur web de GitHub).
- Éditeur de code recommandé : VS Code (facultatif).

---

## 🚀 Plan de travail

### 0) Créer le dépôt

1. Sur GitHub, créez un dépôt nommé `page_cv`.  
2. Clonez-le localement ou utilisez l’éditeur web GitHub.

Commandes (optionnel) :
```bash
git init
git add .
git commit -m "V1 - CV en ligne"
git branch -M main
git remote add origin https://github.com/ALIAS/page_cv
git push -u origin main
```

### 1) Rédiger votre contenu en Markdown (contenu d’abord)

Créez `cv.md` avec :
- Présentation courte (2–3 lignes).
- Compétences (liste).
- Formation.
- Expériences/projets (3–4 maximum, résultats concrets).
- Centres d’intérêt (optionnel).
- Contact : lien GitHub uniquement.

> Astuce : soignez l’orthographe et la concision ; un CV web = lecture rapide. Il est plus facile de réaliser la structure du CV à ce moment


### 2) Construire la structure de fichiers

```
.
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ app.js   (facultatif)
└─ img/        (images optimisées)
```

### 3) Créer la page HTML (Bootstrap optionnel)

Voir exemple fourni index.html

### 4) Responsive, UX, Accessibilité – checklist

- Mobile d’abord ; testez sur smartphone ou outils de dev.
- Grille CSS ou Bootstrap ; pas d’horizontale scroll.
- Contraste suffisant ; police ≥ 16 px ; espacements réguliers.
- Navigation au clavier (Tab) : focus visibles et ordre logique.
- Images avec attributs `alt` descriptifs.
- Liens avec textes explicites (“Voir mes projets GitHub”).

### 5) SEO minimum – checklist

- Un seul `<h1>` pertinent (titre de la page).
- `<title>` descriptif et `<meta name="description">` renseignée.
- Balises sémantiques (`header`, `main`, `section`, `footer`).
- URLs/ancres lisibles, contenu clair et structuré.

### 6) Performances – checklist

- Images optimisées (WebP/JPEG), largeur adaptée, ≤ 150–300 ko si possible.
- Scripts avec `defer`, CSS minimal, pas de bibliothèques inutiles.
- Éviter les polices web multiples ; privilégier la police système.

### 7) Validation et corrections

- HTML : https://validator.w3.org/  
- Structure H1–H6 : https://www.outiref.fr/  
- Performances (mobile) : https://pagespeed.web.dev/?hl=fr  
- Optionnel : https://gtmetrix.com/

Corrigez toutes les erreurs bloquantes, puis recommittez et poussez.

### 8) Publication (GitHub Pages)

1. GitHub → onglet “Settings” du dépôt → “Pages”.  
2. Source : “Deploy from a branch” → Branche `main` → Dossier `/root`.  
3. Enregistrer et patienter 1–2 minutes.  
4. Testez l’URL sur mobile et relancez les validateurs.

---

## 🧪 Auto‑évaluation (à compléter)

- W3C : 0 erreur / X avertissements (principaux points).
- Outiref : H1 unique, hiérarchie H2–H6 correcte (observations).
- PageSpeed (mobile) : Performance XX, Accessibilité XX, Bonnes pratiques XX, SEO XX.
- Améliorations effectuées entre V1 et finale :
  - …
  - …

---

## 🔗 Ressources utiles

- W3C Validator : https://validator.w3.org/
- Outiref (structure & SEO) : https://www.outiref.fr/
- PageSpeed Insights : https://pagespeed.web.dev/?hl=fr
- GTmetrix (optionnel) : https://gtmetrix.com/
