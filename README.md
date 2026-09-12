# Portfolio, John Stewart Nucum

Site personnel bilingue (FR/EN), construit avec React 19, TypeScript, Tailwind CSS 4
et trois bibliothèques d'animation : **GSAP** et tous ses plugins premium (désormais
gratuits), **anime.js** et **React Spring**. Direction visuelle : éditorial suisse,
motion d'agence.

Déployé gratuitement sur GitHub Pages : <https://yonipoka.github.io/portfolio/>

---

## Déploiement, à faire une seule fois

1. **Créer le dépôt** sur GitHub, nommé exactement `portfolio`, en public.

2. **Pousser le code** depuis le dossier du projet :

   ```bash
   git init
   git add .
   git commit -m "Portfolio initial"
   git branch -M main
   git remote add origin https://github.com/Yonipoka/portfolio.git
   git push -u origin main
   ```

3. **Activer GitHub Pages** : dépôt → *Settings* → *Pages* → sous **Source**,
   choisir **GitHub Actions** (et non « Deploy from a branch »).

4. C'est tout. Chaque `git push` sur `main` reconstruit et redéploie le site
   automatiquement via `.github/workflows/deploy.yml`. Le premier déploiement
   prend deux à trois minutes.

> **Si tu changes le nom du dépôt**, il faut mettre à jour le chemin de base à
> trois endroits : `base` dans `vite.config.ts`, `BASE`/`ORIGIN` dans
> `scripts/gen-html.mjs` et dans `scripts/check-links.mjs`, et les URL dans
> `public/sitemap.xml`, `public/robots.txt` et `public/site.webmanifest`.

---

## À compléter avant la mise en ligne

Une seule chose est encore un placeholder :

- **Google Analytics**, dans `src/i18n.ts`, remplacer `gaMeasurementId: 'G-XXXXXXXXXX'`
  par ton vrai identifiant de mesure (crée une propriété sur
  <https://analytics.google.com>, gratuit). Tant que le placeholder est en place,
  le script n'est jamais chargé : le site fonctionne, il ne mesure simplement rien.

---

## Commandes

| Commande | Effet |
|---|---|
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur de développement sur <http://localhost:5173/portfolio/> |
| `npm run build` | Génère les pages HTML, vérifie les types, construit `dist/` |
| `npm run preview` | Sert le `dist/` construit, pour tester avant de pousser |
| `npm run check:links` | Vérifie tous les liens du site construit |
| `npm run verify` | `build` + `check:links` en une commande |
| `npm run gen:images` | Régénère l'image de partage et l'icône (après changement de branding) |
| `npm run qa` | Structure, accessibilité de base, consentement, mouvement réduit |
| `npm run audit` | Audit complet : contraste WCAG, cibles tactiles, clavier, navigation, points de rupture |
| `npm run preflight` | Contrôle avant mise en ligne : SEO des 9 pages, parcours cookies, langues, FAQ, pages légales |

Les deux scripts de vérification ont besoin du site servi :

```bash
npm run preview &     # sert dist/ sur :4173
npm run qa            # captures d'écran dans /tmp/qa + assertions de structure
npm run audit         # contraste, cibles tactiles, clavier, ancres, lien profond
npm run preflight     # SEO des 9 pages, consentement de bout en bout, langues, FAQ, légal
```

`preflight` est le contrôle à lancer juste avant de pousser. Il vérifie notamment
qu'aucune requête Google Analytics ne part avant le consentement, qu'aucune ne
part après un refus, et que l'identifiant de mesure n'est plus le placeholder.

`audit` mesure les vraies couleurs calculées par le navigateur, teste la
navigation au clavier par de vraies tabulations, et vérifie qu'après un clic sur
un lien de section on peut toujours remonter et redescendre.

---

## Structure

```
index.html, faq.html, confidentialite.html, conditions.html   pages FR
en/index.html, en/faq.html, en/privacy.html, en/terms.html    pages EN
404.html                                                      page d'erreur
public/         robots.txt, sitemap.xml, favicon, image de partage, manifest
src/i18n.ts     TOUT le contenu du site, FR et EN, au même endroit
src/components/ KineticHero, SplitReveal, ScrubWords, BatchReveal, DrawRule,
                Marquee, HorizontalProjects, SkillsFlip, StatCounter,
                ScrollProgress, SectionIndex, MagneticLink, Cursor, Preloader,
                SmoothScroll, Header, Footer, CookieBanner
src/pages/      Home, Faq, Legal, NotFound
src/lib/        gsap (plugins + easings), consentement, analytics, motion, URL
scripts/        génération du HTML et des images, vérification des liens, QA navigateur
```

**Les fichiers `.html` à la racine sont générés** par `scripts/gen-html.mjs`, ne les
édite jamais à la main, ils sont réécrits à chaque build. Pour changer un titre ou une
meta description, édite `scripts/gen-html.mjs`. Pour changer du contenu visible,
édite `src/i18n.ts`.

---

## Design et animation

**Direction visuelle : éditorial suisse, motion d'agence.** Grille de 12 colonnes à
filets apparents, typographie Archivo en très grandes tailles, fond papier, encre
noire et un seul rouge de signalisation. Aucune ombre, aucun dégradé, aucun coin
arrondi, la hiérarchie vient de la taille et du filet, pas de la décoration.

GSAP est devenu entièrement gratuit en 2025, plugins premium compris. Le site les
utilise :

| Technique | Plugin / API | Où |
|---|---|---|
| Révélation par lignes masquées | **SplitText** | titres et entrées de parcours |
| Lecture au scroll, mot par mot | **SplitText** + `scrub` | paragraphes de la section À propos |
| Défilement inertiel + parallaxe | **ScrollSmoother** | toute la page (`data-speed`) |
| Section horizontale épinglée | **ScrollTrigger** (`pin`, `containerAnimation`) | les projets |
| Barre de progression du scroll | **ScrollTrigger** (`scrub: true`) | filet rouge en haut |
| Index de section qui suit la lecture | **ScrollTrigger** (`onEnter` / `onEnterBack`) | rail 01 à 05, à droite |
| Révélation groupée des listes | **ScrollTrigger.batch** | parcours, formation, chiffres |
| Filets qui se tracent au scroll | **DrawSVG** (`scrub`) | séparateurs de section |
| Inclinaison selon la vitesse | `smoother.getVelocity()` + `quickSetter` | titres de section |
| Filtrage animé des compétences | **Flip** | section Compétences |
| Intitulé de poste qui se recompose | **ScrambleText** | hero |
| Vitesse du bandeau liée au scroll | **Observer** | ticker des technologies |
| Courbe d'accélération maison | **CustomEase** | partout (`ease: 'swiss'`) |
| Compteurs | **ScrollTrigger** + tween | chiffres de la section À propos |
| Curseur qui suit le pointeur | `gsap.quickTo` | desktop uniquement |
| Préchargeur compté 000 à 100 | timeline GSAP | au premier chargement |

**React Spring** garde ce qu'il fait mieux que GSAP : le magnétisme des liens de
contact. Une motion continuellement re-ciblée par le pointeur et interruptible
correspond exactement à un ressort, pas à un tween de durée fixe.

**anime.js** garde la page 404 : une oscillation indépendante par chiffre, sur une
timeline qui n'a rien à voir avec le scroll.

## Choix techniques, et leurs limites

**Pages HTML séparées plutôt qu'un routeur côté client.** Chaque page a sa propre
URL réelle, sa balise `canonical`, ses `hreflang` FR/EN et son entrée au sitemap.

**Le contenu est rendu par JavaScript.** Google exécute le JavaScript et indexera
le site normalement, mais certains crawlers plus simples ne le font pas. Chaque page
contient donc un bloc `<noscript>` avec le nom, le titre, le pitch et les coordonnées.

**Aucun tiret cadratin dans le contenu.** Le texte du site utilise virgules,
deux-points, parenthèses et barres obliques.

**Poids : environ 180 kB compressés sur l'accueil.** GSAP avec ses plugins pèse à lui
seul 72 kB. C'est le prix assumé de ce niveau d'animation. Chaque page est un module
séparé : la politique de confidentialité ne télécharge ni le scroll horizontal ni
React Spring.

**Tout se dégrade proprement.** Sous `prefers-reduced-motion`, le préchargeur est
sauté, ScrollSmoother n'est pas créé, SplitText ne découpe rien, le bandeau ne défile
pas, le curseur disparaît et tout le contenu est visible immédiatement. Sur mobile et
sur écran tactile, la section horizontale redevient une pile verticale et le
défilement reste natif. C'est vérifié automatiquement par `scripts/qa.mjs`.

**La navigation par ancre est interceptée, jamais native.** Un lien `#projets`
traité normalement par le navigateur fait défiler le conteneur interne de
ScrollSmoother, ce qui désynchronise la transformation : la page paraît figée ou
vide et on ne peut plus remonter. `src/lib/anchors.ts` intercepte tous les liens
internes, passe par `smoother.scrollTo`, décale de la hauteur de l'en-tête, met
l'URL à jour avec `replaceState`, et déplace le focus clavier sur la section
atteinte. Les liens profonds (`/#skills` ouvert directement) attendent la fin de
l'intro et l'arrivée du chunk de la page avant de sauter.

**Contrastes vérifiés, pas supposés.** Chaque couleur de texte du thème est
annotée dans `src/index.css` avec son ratio réel, et `npm run audit` échoue si
l'un d'eux repasse sous le seuil WCAG AA. Deux rouges coexistent pour cette
raison : `signal` sur fond papier, `signal-light` sur fond encre.

**Le CSS maison vit dans `@layer base` et `@layer components`.** Écrit hors
couche, il battrait toutes les utilitaires Tailwind quelle que soit la
spécificité : c'est ainsi qu'une règle de confort tactile a un jour annulé
`md:hidden` et laissé le bouton MENU visible sur desktop, où son panneau reste
masqué. Toute règle ajoutée doit rester dans une couche.

**Les éléments `position: fixed` sont hors de ScrollSmoother.** En-tête, curseur,
préchargeur et bandeau cookies sont rendus à côté du wrapper, jamais dedans : un
ancêtre transformé casse le positionnement fixe.

## Points juridiques

Les pages « Politique de confidentialité » et « Conditions d'utilisation » ont été
rédigées pour ce site précis, sous droit suisse. Elles sont honnêtes et à jour, mais
elles ne remplacent pas l'avis d'un juriste. Relis-les avant la mise en ligne, en
particulier si tu ajoutes un jour un formulaire ou un autre service tiers.
