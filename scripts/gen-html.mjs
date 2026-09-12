/**
 * Generates every HTML entry point from one template, so meta tags, canonical
 * URLs and hreflang links can never drift apart between pages.
 * Run with: npm run gen:html
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://yonipoka.github.io'
const BASE = '/portfolio/'
const SITE_URL = ORIGIN + BASE
const OG = `${SITE_URL}og-image.png`

const META = {
  fr: {
    home: {
      title: 'John Stewart Nucum | Business Analyst Junior à Genève',
      desc: "Portfolio de John Stewart Nucum, diplômé HES-SO en informatique de gestion à Genève. Analyse métier, business intelligence et développement web en React et Next.js.",
    },
    faq: {
      title: 'Questions fréquentes | John Stewart Nucum',
      desc: "Disponibilité, permis de travail, langues et technologies : les réponses aux questions que les recruteurs posent le plus souvent.",
    },
    privacy: {
      title: 'Politique de confidentialité | John Stewart Nucum',
      desc: "Comment ce portfolio traite les données de ses visiteurs : hébergement, mesure d'audience, cookies et vos droits.",
    },
    terms: {
      title: "Conditions d'utilisation | John Stewart Nucum",
      desc: "Conditions d'utilisation du portfolio de John Stewart Nucum : propriété intellectuelle, responsabilité et droit applicable.",
    },
    notfound: {
      title: 'Page introuvable (404) | John Stewart Nucum',
      desc: "Cette page n'existe pas ou a été déplacée. Retournez à l'accueil du portfolio de John Stewart Nucum, business analyst junior à Genève.",
    },
  },
  en: {
    home: {
      title: 'John Stewart Nucum | Junior Business Analyst in Geneva',
      desc: 'Portfolio of John Stewart Nucum, HES-SO graduate in business information systems, Geneva. Business analysis, business intelligence and web development in React and Next.js.',
    },
    faq: {
      title: 'Frequently asked questions | John Stewart Nucum',
      desc: 'Availability, work permit, languages and technologies: answers to the questions recruiters ask most often.',
    },
    privacy: {
      title: 'Privacy policy | John Stewart Nucum',
      desc: 'How this portfolio handles visitor data: hosting, audience measurement, cookies and your rights.',
    },
    terms: {
      title: 'Terms of use | John Stewart Nucum',
      desc: "Terms of use for John Stewart Nucum's portfolio: intellectual property, liability and governing law.",
    },
  },
}

/** file path (relative to project root) -> page config */
const PAGES = [
  { file: 'index.html', lang: 'fr', page: 'home', path: '', alt: 'en/' },
  { file: 'faq.html', lang: 'fr', page: 'faq', path: 'faq.html', alt: 'en/faq.html' },
  { file: 'confidentialite.html', lang: 'fr', page: 'privacy', path: 'confidentialite.html', alt: 'en/privacy.html' },
  { file: 'conditions.html', lang: 'fr', page: 'legal', path: 'conditions.html', alt: 'en/terms.html', metaKey: 'terms' },
  { file: 'en/index.html', lang: 'en', page: 'home', path: 'en/', alt: '' },
  { file: 'en/faq.html', lang: 'en', page: 'faq', path: 'en/faq.html', alt: 'faq.html' },
  { file: 'en/privacy.html', lang: 'en', page: 'privacy', path: 'en/privacy.html', alt: 'confidentialite.html' },
  { file: 'en/terms.html', lang: 'en', page: 'legal', path: 'en/terms.html', alt: 'conditions.html', metaKey: 'terms' },
  { file: '404.html', lang: 'fr', page: 'notfound', path: '404.html', noindex: true },
]

const PERSON_JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'John Stewart Nucum',
  jobTitle: 'Junior Business Analyst',
  email: 'mailto:johnnucum122@gmail.com',
  url: SITE_URL,
  image: OG,
  address: { '@type': 'PostalAddress', addressLocality: 'Geneva', addressCountry: 'CH' },
  nationality: { '@type': 'Country', name: 'Switzerland' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Haute École de Gestion de Genève (HEG)' },
    { '@type': 'CollegeOrUniversity', name: 'Dankook University' },
  ],
  knowsLanguage: ['en', 'fr', 'tl', 'de'],
  knowsAbout: ['Business analysis', 'Business intelligence', 'React', 'Next.js', 'TypeScript', 'SQL', 'Power BI', 'BPMN'],
  sameAs: ['https://www.linkedin.com/in/john-stewart-nucum-', 'https://github.com/Yonipoka'],
})

/** Real content for crawlers and visitors without JavaScript. */
function noscript(lang) {
  return lang === 'fr'
    ? `<h1>John Stewart Nucum, Business Analyst Junior, Genève</h1>
      <p>Diplômé d'un Bachelor HES-SO en informatique de gestion (Haute École de Gestion de Genève, 2026). Analyse métier, business intelligence et développement web en React, Next.js et TypeScript.</p>
      <p>Ce portfolio utilise JavaScript pour ses animations. Vous pouvez me joindre directement :</p>
      <ul>
        <li>E-mail : <a href="mailto:johnnucum122@gmail.com">johnnucum122@gmail.com</a></li>
        <li><a href="https://www.linkedin.com/in/john-stewart-nucum-">LinkedIn</a> · <a href="https://github.com/Yonipoka">GitHub</a></li>
      </ul>`
    : `<h1>John Stewart Nucum, Junior Business Analyst, Geneva</h1>
      <p>HES-SO Bachelor graduate in business information systems (Geneva School of Business Administration, 2026). Business analysis, business intelligence, and web development with React, Next.js and TypeScript.</p>
      <p>This portfolio uses JavaScript for its animations. You can reach me directly:</p>
      <ul>
        <li>Email: <a href="mailto:johnnucum122@gmail.com">johnnucum122@gmail.com</a></li>
        <li><a href="https://www.linkedin.com/in/john-stewart-nucum-">LinkedIn</a> · <a href="https://github.com/Yonipoka">GitHub</a></li>
      </ul>`
}

function render(p) {
  const key = p.metaKey ?? p.page
  const m = META[p.lang][key === 'legal' ? 'terms' : key]
  const canonical = SITE_URL + p.path
  const isHome = p.page === 'home'
  const depth = p.file.includes('/') ? '../' : './'

  const alternates = p.noindex
    ? ''
    : `
    <link rel="alternate" hreflang="fr" href="${SITE_URL}${p.lang === 'fr' ? p.path : p.alt}" />
    <link rel="alternate" hreflang="en" href="${SITE_URL}${p.lang === 'en' ? p.path : p.alt}" />
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}${p.lang === 'fr' ? p.path : p.alt}" />`

  return `<!doctype html>
<html lang="${p.lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${m.title}</title>
    <meta name="description" content="${m.desc}" />
    <meta name="author" content="John Stewart Nucum" />
    <meta name="theme-color" content="#ebe8e1" />
    ${p.noindex ? '<meta name="robots" content="noindex, follow" />' : '<meta name="robots" content="index, follow, max-image-preview:large" />'}
    <link rel="canonical" href="${canonical}" />${alternates}

    <link rel="icon" type="image/svg+xml" href="${BASE}favicon.svg" />
    <link rel="apple-touch-icon" href="${BASE}apple-touch-icon.png" />
    <link rel="manifest" href="${BASE}site.webmanifest" />

    <meta property="og:type" content="${isHome ? 'profile' : 'website'}" />
    <meta property="og:site_name" content="John Stewart Nucum" />
    <meta property="og:locale" content="${p.lang === 'fr' ? 'fr_CH' : 'en_GB'}" />
    <meta property="og:title" content="${m.title}" />
    <meta property="og:description" content="${m.desc}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="John Stewart Nucum, Business Analyst Junior, Genève" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${m.title}" />
    <meta name="twitter:description" content="${m.desc}" />
    <meta name="twitter:image" content="${OG}" />
    <meta name="twitter:image:alt" content="John Stewart Nucum, Business Analyst Junior, Genève" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
    />
${isHome ? `    <script type="application/ld+json">${PERSON_JSONLD}</script>\n` : ''}  </head>
  <body>
    <div id="root" data-page="${p.page}" data-lang="${p.lang}"></div>
    <noscript>
      <div style="max-width:44rem;margin:0 auto;padding:3rem 1.5rem;font-family:system-ui,sans-serif;color:#0e0e0c;line-height:1.6">
      ${noscript(p.lang)}
      </div>
    </noscript>
    <script type="module" src="${depth}src/main.tsx"></script>
  </body>
</html>
`
}

let count = 0
for (const p of PAGES) {
  const out = resolve(ROOT, p.file)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, render(p), 'utf8')
  count++
}
console.log(`Generated ${count} HTML entry points.`)
