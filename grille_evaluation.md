### evaluation.md — Grille d’évaluation du projet “CV Web – page HTML statique”

---

#### Résumé des demandes faites aux étudiants
- Publier un CV web statique sur GitHub Pages, avec un dépôt GitHub et une URL publique.  
- Produire une page HTML sémantique et responsive (CSS/Bootstrap), soigner l’UX, l’accessibilité, le SEO minimum et la performance.  
- Utiliser des validateurs (W3C, Outiref, PageSpeed), corriger les problèmes, documenter une auto‑évaluation (résultats et corrections V1 → version finale).  
- Respecter la confidentialité (pas d’e‑mail perso, pas d’adresse postale, pas de n° de téléphone ; proposer un lien GitHub de contact). ([github.com](https://github.com/fabrice1618/cv_html_statique))

---

### 1) Barème et coefficients

- Objectif: noter chaque critère sur 0 à 4, puis appliquer un coefficient.  
- Note finale = somme des “scores pondérés”, normalisée sur 20.  
- Coefficients officiels: à reprendre depuis le fichier eval_notes_cv_modele.xlsx (voir dépôt). En attendant, des valeurs par défaut sont proposées ci‑dessous; remplacez‑les dès que vous avez les coefficients réels. ([github.com](https://github.com/fabrice1618/cv_html_statique))

| N° | Critère | Barème (0–4) | Coefficient (remplacer par ceux de l’xlsx) |
|---|---|---|---|
| C1 | Contenu du CV (clarté, concision, orthographe, pertinence) | 0–4 | 10 |
| C2 | HTML sémantique (H1 unique, hiérarchie H2–H6, balises structurelles) | 0–4 | 10 |
| C3 | Responsive & mise en page (CSS/Bootstrap) | 0–4 | 15 |
| C4 | UX & Accessibilité (contraste, lisibilité, navigation clavier, alt) | 0–4 | 15 |
| C5 | SEO minimum (title, meta description, structure, libellés de liens) | 0–4 | 10 |
| C6 | Performance (images optimisées, CSS/JS minimal, defer, polices) | 0–4 | 10 |
| C7 | Validation & corrections (W3C, Outiref, PageSpeed + corrections V1→finale) | 0–4 | 10 |
| C8 | Publication GitHub Pages (site en ligne opérationnel) | 0–4 | 5 |
| C9 | Auto‑évaluation documentée (résultats, analyse, actions correctives) | 0–4 | 5 |
| C10 | Confidentialité et respect des consignes | 0–4 | 5 |
| C11 | Qualité du dépôt (arborescence, README, commits clairs) | 0–4 | 5 |

- Total coefficients par défaut: 100 (mettez à jour selon l’xlsx).  
- Références aux outils/attendus: W3C, Outiref, PageSpeed, publication Pages, auto‑éval. ([github.com](https://github.com/fabrice1618/cv_html_statique))

Formule de calcul:
\[ \text{Note finale} = \frac{\sum_{i=1}^{n} \left(\text{score}_i \times \text{coef}_i\right)}{\sum_{i=1}^{n} \text{coef}_i} \times 20 \]

---

### 2) Descripteurs de niveaux (0 à 4) par critère

- C1 Contenu du CV  
  0 = informations absentes/inutiles, fautes nombreuses; 1 = très lacunaire; 2 = partiel, imprécis; 3 = clair, concis, sans fautes majeures; 4 = très clair, orienté résultats (chiffres, réalisations mesurables).

- C2 HTML sémantique  
  0 = balisage incohérent, multiples H1; 1 = problèmes majeurs persistants; 2 = hiérarchie partiellement correcte; 3 = hiérarchie propre, balises `header/main/section/footer`; 4 = sémantique exemplaire, liens/ancres explicites.

- C3 Responsive & mise en page  
  0 = non responsive; 1 = ruptures majeures; 2 = responsive partiel (scroll horizontal); 3 = rendu stable mobile/desktop; 4 = responsive soigné (grille, espacements, typographie cohérente). ([github.com](https://github.com/fabrice1618/cv_html_statique))

- C4 UX & Accessibilité  
  0 = contrastes illisibles, pas d’alts; 1 = défauts critiques; 2 = règles de base incomplètes; 3 = contrastes ok, focus visibles, nav clavier; 4 = très bonne lisibilité, liens explicites, parcours fluide. ([github.com](https://github.com/fabrice1618/cv_html_statique))

- C5 SEO minimum  
  0 = title/meta absents; 1 = balises présentes mais peu pertinentes; 2 = structure améliorable; 3 = title/meta pertinents, structure claire; 4 = très propre (titres, liens, texte descriptif). ([github.com](https://github.com/fabrice1618/cv_html_statique))

- C6 Performance  
  0 = images lourdes, blocages; 1 = optimisations rares; 2 = quelques optimisations; 3 = images optimisées, `defer`, CSS minimal; 4 = très performant (budgets images, peu de dépendances). ([github.com](https://github.com/fabrice1618/cv_html_statique))

- C7 Validation & corrections  
  0 = erreurs bloquantes non corrigées; 1 = corrections mineures; 2 = corrections partielles; 3 = W3C ok, Outiref structure ok, PageSpeed mobile correct; 4 = excellent + journal de corrections clair (V1→finale). ([github.com](https://github.com/fabrice1618/cv_html_statique))

- C8 Publication GitHub Pages  
  0 = non publié; 1 = lien KO; 2 = publié mais instable; 3 = site en ligne stable; 4 = en ligne + testé mobile + itérations après publication. ([github.com](https://github.com/fabrice1618/cv_html_statique))

- C9 Auto‑évaluation documentée  
  0 = absente; 1 = très sommaire; 2 = résultats indiqués sans analyse; 3 = résultats + corrections listées; 4 = résultats, analyse des causes, impact mesuré. ([github.com](https://github.com/fabrice1618/cv_html_statique))

- C10 Confidentialité/consignes  
  0 = infos sensibles exposées; 1 = oublis majeurs; 2 = un écart; 3 = conforme; 4 = conforme + message de contact GitHub clair. ([github.com](https://github.com/fabrice1618/cv_html_statique))

- C11 Qualité du dépôt  
  0 = fichiers dispersés, pas de README; 1 = structure confuse; 2 = structure minimale; 3 = arborescence claire, README utile, commits propres; 4 = exemplaire (nomenclature, messages de commit informatifs). ([github.com](https://github.com/fabrice1618/cv_html_statique))

---

### 3) Récapitulatif des évaluations

À compléter par le correcteur (exemple de tableau — remplacez les coefficients par ceux de l’xlsx).

| Critère | Score (0–4) | Coef | Score pondéré = Score×Coef |
|---|---:|---:|---:|
| C1 Contenu |   | 10 |   |
| C2 HTML sémantique |   | 10 |   |
| C3 Responsive |   | 15 |   |
| C4 UX & Accessibilité |   | 15 |   |
| C5 SEO |   | 10 |   |
| C6 Performance |   | 10 |   |
| C7 Validation & corrections |   | 10 |   |
| C8 Publication Pages |   | 5 |   |
| C9 Auto‑évaluation |   | 5 |   |
| C10 Confidentialité |   | 5 |   |
| C11 Qualité du dépôt |   | 5 |   |
| Total |  | 100 | Somme |

- Note finale: appliquez la formule ci‑dessus pour convertir en /20.  
- Observations globales du correcteur:  
  - Points forts: …  
  - Axes d’amélioration: …

---

### 4) Liste de contrôle (pour l’étudiant, avant rendu)

- Dépôt GitHub et URL GitHub Pages OK.  
- W3C: erreurs corrigées; Outiref: H1 unique, hiérarchie OK; PageSpeed mobile: scores lisibles.  
- Images optimisées (WebP/JPEG), CSS/JS minimisés, defer pour les scripts.  
- Confidentialité respectée; contact via profil GitHub uniquement.  
- Auto‑évaluation complétée (résultats + corrections). ([github.com](https://github.com/fabrice1618/cv_html_statique))

---

### 5) Analyse “DRH” — Lecture du CV pour un recrutement en alternance

- Lisibilité et impact: visez une accroche courte et orientée objectifs (qui vous êtes, ce que vous cherchez, ce que vous apportez). Mettez 3–4 réalisations avec résultats mesurables (ex: “mise en place d’un site vitrine, +35% trafic organique en 3 mois”).  
- Pertinence: recentrez compétences et projets sur l’alternance visée (stack, outils, méthode). Classez vos compétences par familles (Front: HTML/CSS/Bootstrap; Outils: Git/GitHub; Qualité: accessibilité, SEO, performance).  
- Preuves: liez des projets GitHub spécifiques (repos publics, README montrant objectifs/stack/résultats), capture d’écran légère si utile.  
- UX de CV: structurez en blocs scannables (titres, listes), liens explicites (“Voir mes projets GitHub”). Assurez un contraste suffisant et une bonne taille de police pour lecture mobile.  
- Professionnalisme: soignez l’orthographe, les intitulés, les dates; évitez informations sensibles (conformément aux consignes); présentez une “empreinte Git” propre (commits clairs).  
- Différenciation: ajoutez 1–2 éléments distinctifs (mini‑projet technique, badge PageSpeed, note d’accessibilité) et une courte section “Ce que je cherche en alternance (rythme, domaines)”.

Cette grille aide à simuler un regard recruteur: rapide, centré résultats, sensible à la qualité perçue (clarté, cohérence, preuves).

---

### 6) Mode d’utilisation

1) Renseignez les coefficients exacts depuis eval_notes_cv_modele.xlsx dans la table du §3.  
2) Évaluez chaque critère sur 0–4 selon les descripteurs du §2.  
3) Calculez la note finale avec la formule.  
4) Rédigez un court feedback (points forts / axes d’amélioration) et, si possible, une recommandation (OK pour alternance / À renforcer avant entretien).

---

Notes/citations:
- Cahier des charges, livrables, checklists (HTML sémantique, responsive, UX/accessibilité, SEO, performances, validateurs W3C–Outiref–PageSpeed, publication GitHub Pages, auto‑évaluation, confidentialité): voir le README du dépôt. ([github.com](https://github.com/fabrice1618/cv_html_statique))

---
