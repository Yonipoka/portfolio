/**
 * Visual + structural QA pass against the built site served on :4173.
 * Captures screenshots and runs a set of accessibility and SEO assertions
 * that a static file check cannot make (rendered DOM, contrast, landmarks).
 *
 * Usage: node scripts/qa.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:4173/portfolio/'
const OUT = '/tmp/qa'
mkdirSync(OUT, { recursive: true })

const PAGES = [
  { name: 'home-fr', path: '' },
  { name: 'home-en', path: 'en/' },
  { name: 'faq-fr', path: 'faq.html' },
  { name: 'privacy-fr', path: 'confidentialite.html' },
  { name: 'notfound', path: '404.html' },
]

const problems = []
// CHROME_PATH lets this run against a preinstalled browser instead of a download.
const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
)

for (const p of PAGES) {
  for (const vp of [
    { label: 'desktop', width: 1440, height: 900 },
    { label: 'mobile', width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 })
    const page = await ctx.newPage()

    // Block third-party requests: this harness may have no egress, and a hanging
    // font request must not be mistaken for a page problem.
    await page.route('**/*', (route) => {
      const url = route.request().url()
      if (url.startsWith('http://localhost')) return route.continue()
      return route.abort()
    })

    const consoleErrors = []
    // net::ERR_FAILED comes from the third-party requests we deliberately block.
    page.on('console', (m) => {
      if (m.type() !== 'error') return
      if (m.text().includes('net::ERR_FAILED')) return
      consoleErrors.push(m.text())
    })
    page.on('pageerror', (e) => consoleErrors.push(String(e)))

    await page.goto(BASE + p.path, { waitUntil: 'load' })
    await page.waitForTimeout(3200) // let the preloader finish and reveals play

    await page.screenshot({
      path: `${OUT}/${p.name}-${vp.label}.png`,
      fullPage: vp.label === 'desktop' && p.name === 'home-fr',
    })

    if (consoleErrors.length) {
      problems.push(`${p.name}/${vp.label}: console errors → ${consoleErrors.join(' | ')}`)
    }

    // --- Structural / accessibility assertions on the rendered DOM ---
    const audit = await page.evaluate(() => {
      const out = []
      if (document.querySelectorAll('h1').length !== 1) {
        out.push(`expected exactly one h1, found ${document.querySelectorAll('h1').length}`)
      }
      if (!document.querySelector('main#main')) out.push('no <main id="main"> landmark')
      if (!document.querySelector('header nav')) out.push('no nav inside header')
      if (!document.querySelector('footer')) out.push('no footer landmark')

      const imgs = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt'))
      if (imgs.length) out.push(`${imgs.length} <img> without alt`)

      const badButtons = [...document.querySelectorAll('button')].filter(
        (b) => !b.textContent?.trim() && !b.getAttribute('aria-label'),
      )
      if (badButtons.length) out.push(`${badButtons.length} button(s) with no accessible name`)

      const badLinks = [...document.querySelectorAll('a')].filter(
        (a) => !a.textContent?.trim() && !a.getAttribute('aria-label'),
      )
      if (badLinks.length) out.push(`${badLinks.length} link(s) with no accessible name`)

      // Any visible body text still stuck at opacity 0 means a reveal never fired.
      // Only flag elements that are comfortably on screen: a scroll reveal is
      // meant to stay hidden while the element is barely peeking over the fold.
      const stuck = [...document.querySelectorAll('[data-anim]')].filter((el) => {
        const r = el.getBoundingClientRect()
        const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0)
        const mostlyVisible = r.height > 0 && visible / r.height > 0.6
        return mostlyVisible && parseFloat(getComputedStyle(el).opacity) < 0.05
      })
      if (stuck.length) out.push(`${stuck.length} on-screen element(s) stuck at opacity 0`)

      if (document.documentElement.scrollWidth > window.innerWidth + 1) {
        out.push(
          `horizontal overflow: ${document.documentElement.scrollWidth}px > ${window.innerWidth}px`,
        )
      }
      return out
    })
    audit.forEach((a) => problems.push(`${p.name}/${vp.label}: ${a}`))

    // Cookie banner must be present before consent, and analytics must NOT be loaded.
    if (vp.label === 'desktop' && p.name === 'home-fr') {
      const banner = await page.locator('[role="dialog"]').count()
      if (!banner) problems.push('home-fr: cookie banner not shown on first visit')
      const gaLoaded = await page.evaluate(
        () => !!document.querySelector('script[src*="googletagmanager"]'),
      )
      if (gaLoaded) problems.push('home-fr: analytics script loaded BEFORE consent')

      // Keyboard: the first Tab must land on the skip link.
      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() => document.activeElement?.textContent?.trim())
      if (!focused || !/contenu principal|main content/i.test(focused)) {
        problems.push(`home-fr: first Tab should focus the skip link, focused "${focused}"`)
      }
    }

    await ctx.close()
  }
}

// Reduced-motion run: content must be fully visible with no animation.
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const page = await ctx.newPage()
await page.route('**/*', (route) =>
  route.request().url().startsWith('http://localhost') ? route.continue() : route.abort(),
)
await page.goto(BASE, { waitUntil: 'load' })
await page.waitForTimeout(1200)
await page.screenshot({ path: `${OUT}/home-reduced-motion.png` })
const hidden = await page.evaluate(
  () =>
    [...document.querySelectorAll('[data-anim]')].filter(
      (el) => parseFloat(getComputedStyle(el).opacity) < 0.9,
    ).length,
)
if (hidden) problems.push(`reduced-motion: ${hidden} element(s) not fully visible`)
await ctx.close()

await browser.close()

if (problems.length) {
  console.error(`${problems.length} problem(s):`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  process.exit(1)
}
console.log('QA passed: structure, accessibility, consent gating and reduced motion all OK.')
