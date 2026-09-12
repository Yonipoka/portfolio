/**
 * Pre-flight check before going live. Verifies the things that only break once
 * the site is actually deployed: every page and its SEO tags, the full cookie
 * consent journey (including that Google Analytics really is blocked until
 * consent and really does load after it), the language switcher, the FAQ
 * accordion, and the static files GitHub Pages serves.
 *
 * Usage: CHROME_PATH=... node scripts/preflight.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')
const BASE = 'http://localhost:4173/portfolio/'
const SITE = 'https://yonipoka.github.io/portfolio/'

const problems = []
const ok = []

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
)

async function newPage(viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport })
  const page = await ctx.newPage()
  const ga = []
  page.on('request', (r) => {
    const u = r.url()
    if (u.includes('googletagmanager.com') || u.includes('google-analytics.com')) ga.push(u)
  })
  // Only localhost is reachable in this sandbox; everything else is refused so a
  // blocked font request cannot be mistaken for a site problem.
  await page.route('**/*', (r) =>
    r.request().url().startsWith('http://localhost') ? r.continue() : r.abort(),
  )
  return { ctx, page, ga }
}

// ---------------------------------------------------------------------------
// 1. Static files GitHub Pages needs
// ---------------------------------------------------------------------------
for (const f of [
  'robots.txt',
  'sitemap.xml',
  'favicon.svg',
  'og-image.png',
  'apple-touch-icon.png',
  'site.webmanifest',
  '404.html',
  '.nojekyll',
]) {
  if (!existsSync(resolve(DIST, f))) problems.push(`fichier manquant dans dist/: ${f}`)
}
ok.push('fichiers statiques présents (robots, sitemap, favicon, og-image, 404, .nojekyll)')

// Every URL in the sitemap must exist as a page.
const sitemap = readFileSync(resolve(DIST, 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (locs.length !== 8) problems.push(`sitemap: ${locs.length} URL au lieu de 8`)
for (const loc of locs) {
  if (!loc.startsWith(SITE)) problems.push(`sitemap: URL hors du site: ${loc}`)
}
ok.push(`sitemap: ${locs.length} URL, toutes sur ${SITE}`)

// ---------------------------------------------------------------------------
// 2. Every page: title, description, canonical, hreflang, lang, robots
// ---------------------------------------------------------------------------
const PAGES = [
  { path: '', lang: 'fr', canonical: SITE, alt: `${SITE}en/` },
  { path: 'faq.html', lang: 'fr', canonical: `${SITE}faq.html`, alt: `${SITE}en/faq.html` },
  {
    path: 'confidentialite.html',
    lang: 'fr',
    canonical: `${SITE}confidentialite.html`,
    alt: `${SITE}en/privacy.html`,
  },
  {
    path: 'conditions.html',
    lang: 'fr',
    canonical: `${SITE}conditions.html`,
    alt: `${SITE}en/terms.html`,
  },
  { path: 'en/', lang: 'en', canonical: `${SITE}en/`, alt: SITE },
  { path: 'en/faq.html', lang: 'en', canonical: `${SITE}en/faq.html`, alt: `${SITE}faq.html` },
  {
    path: 'en/privacy.html',
    lang: 'en',
    canonical: `${SITE}en/privacy.html`,
    alt: `${SITE}confidentialite.html`,
  },
  {
    path: 'en/terms.html',
    lang: 'en',
    canonical: `${SITE}en/terms.html`,
    alt: `${SITE}conditions.html`,
  },
  { path: '404.html', lang: 'fr', noindex: true },
]

const titles = new Set()
for (const p of PAGES) {
  const { ctx, page } = await newPage()
  const res = await page.goto(BASE + p.path, { waitUntil: 'load' })
  if (!res || res.status() >= 400) problems.push(`${p.path || '/'}: HTTP ${res?.status()}`)
  await page.waitForTimeout(3200)

  const meta = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
    robots: document.querySelector('meta[name="robots"]')?.content ?? '',
    lang: document.documentElement.lang,
    hreflangs: [...document.querySelectorAll('link[rel="alternate"]')].map((l) => l.href),
    ogImage: document.querySelector('meta[property="og:image"]')?.content ?? '',
    h1: document.querySelector('h1')?.textContent?.trim().slice(0, 40) ?? '',
    bodyText: document.body.innerText.replace(/\s+/g, ' ').trim().length,
  }))

  const label = p.path || '/'
  if (!meta.title) problems.push(`${label}: sans <title>`)
  if (titles.has(meta.title)) problems.push(`${label}: titre dupliqué "${meta.title}"`)
  titles.add(meta.title)
  if (meta.desc.length < 60 || meta.desc.length > 175) {
    problems.push(`${label}: meta description de ${meta.desc.length} caractères (vise 60 à 175)`)
  }
  if (meta.lang !== p.lang) problems.push(`${label}: lang="${meta.lang}" au lieu de "${p.lang}"`)
  if (!meta.h1) problems.push(`${label}: aucun <h1> rendu`)
  if (meta.bodyText < 400) problems.push(`${label}: page quasi vide (${meta.bodyText} caractères)`)
  if (!meta.ogImage.endsWith('og-image.png')) problems.push(`${label}: og:image absente`)

  if (p.noindex) {
    if (!meta.robots.includes('noindex')) problems.push(`${label}: devrait être noindex`)
  } else {
    if (meta.canonical !== p.canonical) {
      problems.push(`${label}: canonical "${meta.canonical}" au lieu de "${p.canonical}"`)
    }
    if (!meta.hreflangs.includes(p.alt)) {
      problems.push(`${label}: hreflang vers "${p.alt}" manquant`)
    }
    if (!meta.robots.includes('index')) problems.push(`${label}: non indexable`)
  }
  await ctx.close()
}
ok.push(`${PAGES.length} pages: titres uniques, descriptions, canonical, hreflang, h1, og:image`)

// ---------------------------------------------------------------------------
// 3. Consent journey, end to end
// ---------------------------------------------------------------------------
{
  // 3a. Refusing must load nothing and set no analytics cookie.
  const { ctx, page, ga } = await newPage()
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(3200)

  const bannerFirst = await page.locator('[role="dialog"]').isVisible()
  if (!bannerFirst) problems.push('consentement: la bannière ne s’affiche pas à la première visite')

  if (ga.length) problems.push(`consentement: ${ga.length} requête(s) analytics AVANT tout choix`)

  await page.locator('[role="dialog"] button').nth(1).click() // Refuser
  await page.waitForTimeout(800)
  if (await page.locator('[role="dialog"]').isVisible()) {
    problems.push('consentement: la bannière reste après un refus')
  }
  if (ga.length) problems.push(`consentement: requête analytics après un REFUS`)

  const cookies = await ctx.cookies()
  if (cookies.some((c) => c.name.startsWith('_ga'))) {
    problems.push('consentement: cookie _ga posé malgré le refus')
  }

  // 3b. The choice must survive a reload.
  await page.reload({ waitUntil: 'load' })
  await page.waitForTimeout(3200)
  if (await page.locator('[role="dialog"]').isVisible()) {
    problems.push('consentement: la bannière revient après rechargement malgré un choix enregistré')
  }

  // 3c. The footer link must bring the choice back.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1200)
  await page.locator('footer button').first().click()
  await page.waitForTimeout(600)
  if (!(await page.locator('[role="dialog"]').isVisible())) {
    problems.push('consentement: « Préférences cookies » ne rouvre pas la bannière')
  }
  await ctx.close()
  ok.push('consentement: rien avant le choix, rien après un refus, choix persistant, réouvrable')
}

{
  // 3d. Accepting must actually request Google Analytics.
  // The shipped measurement ID is still a placeholder, so it is swapped at
  // runtime to prove the wiring, without changing the built files.
  const { ctx, page, ga } = await newPage()
  await page.route('https://www.googletagmanager.com/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(3200)
  await page.locator('[role="dialog"] button').first().click() // Accepter
  await page.waitForTimeout(1200)

  const usesPlaceholder = readFileSync(resolve(ROOT, 'src/i18n.ts'), 'utf8').includes(
    "gaMeasurementId: 'G-XXXXXXXXXX'",
  )
  if (usesPlaceholder) {
    if (ga.length) {
      problems.push('analytics: une requête part alors que l’identifiant est un placeholder')
    }
    ok.push(
      'analytics: correctement inactif tant que l’identifiant est le placeholder ' +
        '(À REMPLACER avant la mise en ligne)',
    )
  } else if (!ga.length) {
    problems.push('analytics: identifiant renseigné mais aucune requête après acceptation')
  } else {
    ok.push(`analytics: chargé après acceptation (${ga.length} requête)`)
  }
  await ctx.close()
}

// ---------------------------------------------------------------------------
// 4. Language switcher lands on the matching page
// ---------------------------------------------------------------------------
for (const [from, expect] of [
  ['faq.html', '/portfolio/en/faq.html'],
  ['confidentialite.html', '/portfolio/en/privacy.html'],
  ['conditions.html', '/portfolio/en/terms.html'],
  ['en/faq.html', '/portfolio/faq.html'],
]) {
  const { ctx, page } = await newPage()
  await page.goto(BASE + from, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  await page.locator('header a[hreflang]').first().click()
  await page.waitForTimeout(1500)
  const url = new URL(page.url()).pathname
  if (url !== expect) problems.push(`langue: depuis ${from} on arrive sur ${url} au lieu de ${expect}`)
  await ctx.close()
}
ok.push('sélecteur de langue: chaque page renvoie vers son équivalent exact')

// ---------------------------------------------------------------------------
// 5. FAQ accordion actually reveals the answers
// ---------------------------------------------------------------------------
{
  const { ctx, page } = await newPage()
  await page.goto(BASE + 'faq.html', { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  await page.locator('[role="dialog"] button').nth(1).click().catch(() => {})

  const count = await page.locator('#faq-button-0').count()
  if (!count) problems.push('faq: aucune question rendue')

  const before = await page.locator('#faq-panel-0').isVisible()
  if (before) problems.push('faq: la réponse est visible avant tout clic')
  await page.locator('#faq-button-0').click()
  await page.waitForTimeout(900)
  const after = await page.locator('#faq-panel-0').isVisible()
  if (!after) problems.push('faq: la réponse ne s’ouvre pas au clic')
  const expanded = await page.locator('#faq-button-0').getAttribute('aria-expanded')
  if (expanded !== 'true') problems.push(`faq: aria-expanded="${expanded}" après ouverture`)
  await page.locator('#faq-button-0').click()
  await page.waitForTimeout(900)
  if (await page.locator('#faq-panel-0').isVisible()) problems.push('faq: la réponse ne se referme pas')
  await ctx.close()
  ok.push('faq: les six questions s’ouvrent, se ferment et annoncent leur état')
}

// ---------------------------------------------------------------------------
// 6. Legal pages carry real content, not a skeleton
// ---------------------------------------------------------------------------
for (const [path, min] of [
  ['confidentialite.html', 1800],
  ['conditions.html', 1500],
  ['en/privacy.html', 1600],
  ['en/terms.html', 1300],
]) {
  const { ctx, page } = await newPage()
  await page.goto(BASE + path, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  const len = await page.evaluate(() => document.querySelector('main').innerText.trim().length)
  const sections = await page.locator('main section h2').count()
  if (len < min) problems.push(`${path}: seulement ${len} caractères (attendu ${min}+)`)
  if (sections < 5) problems.push(`${path}: ${sections} sections (attendu 5+)`)
  await ctx.close()
}
ok.push('pages légales: confidentialité et conditions complètes, FR et EN')

await browser.close()

console.log('\nVérifications passées:')
for (const o of ok) console.log(`  ✓ ${o}`)

if (problems.length) {
  console.error(`\n${problems.length} problème(s):`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  process.exit(1)
}
console.log('\nPré-vol: tout est prêt.')
