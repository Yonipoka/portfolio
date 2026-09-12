/**
 * Accessibility and UX audit against the built site on :4173.
 * Goes beyond structure: real contrast ratios, touch target sizes, keyboard
 * reachability, anchor navigation, and scroll recovery after a jump.
 *
 * Usage: CHROME_PATH=/path/to/chrome node scripts/audit.mjs
 */
import { chromium } from 'playwright'

const BASE = 'http://localhost:4173/portfolio/'
const problems = []
const notes = []

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
)

async function newPage(viewport, opts = {}) {
  const ctx = await browser.newContext({ viewport, ...opts })
  const page = await ctx.newPage()
  await page.route('**/*', (r) =>
    r.request().url().startsWith('http://localhost') ? r.continue() : r.abort(),
  )
  return { ctx, page }
}

/** Contrast + target size + focusability, evaluated on the rendered page. */
const AUDIT_FN = () => {
  const out = []

  // getComputedStyle can hand back oklab() when a colour carries an alpha
  // modifier, so colours are resolved through the browser's own paint path
  // instead of being parsed by hand.
  const probe = document.createElement('span')
  probe.style.display = 'none'
  document.body.appendChild(probe)
  function toRGB(value) {
    probe.style.color = ''
    probe.style.color = value
    const resolved = getComputedStyle(probe).color
    const n = (resolved.match(/[\d.]+/g) || []).map(Number)
    return n.length >= 3 ? n.slice(0, 3) : null
  }

  const srgb = (c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)
  const parse = (s) => toRGB(s)

  function bgOf(el) {
    let n = el
    while (n && n !== document.documentElement) {
      const raw = getComputedStyle(n).backgroundColor
      if (raw && raw !== 'transparent' && !raw.includes('rgba(0, 0, 0, 0)')) {
        const rgb = toRGB(raw)
        if (rgb) return rgb
      }
      n = n.parentElement
    }
    return toRGB(getComputedStyle(document.body).backgroundColor) || [255, 255, 255]
  }

  /** Difference blending inverts against whatever is behind it: a static
      contrast ratio is meaningless there, so those subtrees are skipped. */
  function blended(el) {
    let n = el
    while (n && n !== document.documentElement) {
      if (getComputedStyle(n).mixBlendMode !== 'normal') return true
      n = n.parentElement
    }
    return false
  }

  const visible = (el) => {
    const r = el.getBoundingClientRect()
    const st = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && +st.opacity > 0.1
  }

  // --- Contrast on every visible piece of text ---
  const textEls = [...document.querySelectorAll('p, h1, h2, h3, h4, h5, li, a, button, dt, dd, span')]
    .filter((el) => el.childElementCount === 0 && el.textContent.trim().length > 1)
    .filter(visible)
    .filter((el) => !blended(el))

  const seen = new Set()
  for (const el of textEls) {
    const st = getComputedStyle(el)
    const fg = parse(st.color)
    const bg = bgOf(el)
    if (fg.length < 3) continue
    const l1 = lum(fg), l2 = lum(bg)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const px = parseFloat(st.fontSize)
    const bold = parseInt(st.fontWeight, 10) >= 700
    const large = px >= 24 || (bold && px >= 18.66)
    const min = large ? 3 : 4.5
    if (ratio < min) {
      const key = `${st.color}|${px}|${el.tagName}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push(
        `contraste ${ratio.toFixed(2)}:1 (minimum ${min}) — ${el.tagName.toLowerCase()} ${px}px ` +
          `"${el.textContent.trim().slice(0, 38)}"`,
      )
    }
  }

  // --- Touch target size on interactive elements ---
  for (const el of [...document.querySelectorAll('a, button')].filter(visible)) {
    // Screen-reader-only links take their real size only once focused.
    if (el.className.includes('sr-only')) {
      el.focus()
      const fr = el.getBoundingClientRect()
      el.blur()
      if (fr.height >= 24) continue
    }
    const r = el.getBoundingClientRect()
    if (r.height < 24) {
      out.push(
        `cible tactile ${Math.round(r.width)}x${Math.round(r.height)}px — ` +
          `"${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}"`,
      )
    }
  }

  // --- Accessible names ---
  for (const el of [...document.querySelectorAll('a, button')].filter(visible)) {
    const name = (el.textContent || '').trim() || el.getAttribute('aria-label')
    if (!name) out.push(`élément interactif sans nom accessible: <${el.tagName.toLowerCase()}>`)
  }

  // --- Landmarks and headings ---
  const h1s = document.querySelectorAll('h1')
  if (h1s.length !== 1) out.push(`${h1s.length} <h1> (il en faut exactement un)`)

  const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter(visible)
    .map((h) => +h.tagName[1])
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      out.push(`saut de niveau de titre: h${levels[i - 1]} suivi de h${levels[i]}`)
      break
    }
  }

  // --- Language ---
  if (!document.documentElement.lang) out.push('<html> sans attribut lang')

  // --- Horizontal overflow ---
  if (document.documentElement.scrollWidth > window.innerWidth + 1) {
    out.push(`débordement horizontal: ${document.documentElement.scrollWidth}px > ${window.innerWidth}px`)
  }

  probe.remove()
  return out
}

// ---------------------------------------------------------------------------
// 1. Per-page, per-viewport audit
// ---------------------------------------------------------------------------
const PAGES = [
  ['accueil FR', ''],
  ['accueil EN', 'en/'],
  ['faq', 'faq.html'],
  ['confidentialité', 'confidentialite.html'],
  ['404', '404.html'],
]

for (const [label, path] of PAGES) {
  for (const vp of [
    { label: 'desktop', width: 1440, height: 900 },
    { label: 'mobile', width: 390, height: 844 },
  ]) {
    const { ctx, page } = await newPage(vp)
    await page.goto(BASE + path, { waitUntil: 'load' })
    await page.waitForTimeout(3400)
    // Dismiss consent so it stops covering the content being measured.
    await page.locator('[role="dialog"] button').nth(1).click().catch(() => {})
    await page.waitForTimeout(400)

    const found = await page.evaluate(AUDIT_FN)
    found.forEach((f) => problems.push(`${label}/${vp.label}: ${f}`))
    await ctx.close()
  }
}

// ---------------------------------------------------------------------------
// 2. Anchor navigation and scroll recovery (the reported bug)
// ---------------------------------------------------------------------------
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(3400)
  await page.locator('[role="dialog"] button').nth(1).click().catch(() => {})
  await page.waitForTimeout(400)

  const positions = []
  for (const href of ['#about', '#projects', '#experience', '#skills', '#contact']) {
    await page.click(`header a[href="${href}"]`)
    await page.waitForTimeout(1900)
    const y = await page.evaluate(() => Math.round(window.scrollY))
    positions.push([href, y])
    if (y === 0) problems.push(`navigation: clic sur ${href} ne défile pas (scrollY reste 0)`)
    const focused = await page.evaluate(() => document.activeElement?.id)
    if (focused !== href.slice(1)) {
      problems.push(`navigation: le focus ne suit pas ${href} (focus sur "${focused}")`)
    }
  }
  // Strictly increasing means each target is further down than the last.
  for (let i = 1; i < positions.length; i++) {
    if (positions[i][1] <= positions[i - 1][1]) {
      problems.push(
        `navigation: ${positions[i][0]} (${positions[i][1]}px) n'est pas après ` +
          `${positions[i - 1][0]} (${positions[i - 1][1]}px)`,
      )
    }
  }

  // Can the user scroll back up after a jump?
  await page.mouse.wheel(0, -9000)
  await page.waitForTimeout(2000)
  const backTop = await page.evaluate(() => Math.round(window.scrollY))
  if (backTop > 200) problems.push(`navigation: impossible de remonter après un clic (scrollY=${backTop})`)

  await page.mouse.wheel(0, 2500)
  await page.waitForTimeout(1500)
  const backDown = await page.evaluate(() => Math.round(window.scrollY))
  if (backDown < 500) problems.push(`navigation: impossible de redescendre après un clic (scrollY=${backDown})`)

  await ctx.close()
}

// ---------------------------------------------------------------------------
// 3. Deep link straight to a section
// ---------------------------------------------------------------------------
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 })
  await page.goto(BASE + '#skills', { waitUntil: 'load' })
  await page.waitForTimeout(4500)
  const y = await page.evaluate(() => Math.round(window.scrollY))
  if (y < 500) problems.push(`lien profond: /#skills n'atteint pas la section (scrollY=${y})`)
  else notes.push(`lien profond /#skills: scrollY=${y}`)
  await ctx.close()
}

// ---------------------------------------------------------------------------
// 4. Keyboard: skip link, tab order, menu, consent
// ---------------------------------------------------------------------------
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(3400)

  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
  if (!/contenu principal|main content/i.test(first || '')) {
    problems.push(`clavier: la première tabulation ne donne pas le lien d'évitement ("${first}")`)
  }

  // Consent must be operable from the keyboard.
  const reachable = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]')
    if (!dialog) return 'absent'
    return dialog.querySelectorAll('button, a').length
  })
  if (reachable === 'absent') problems.push('clavier: bannière de consentement absente au premier chargement')
  else if (reachable < 2) problems.push('clavier: bannière de consentement sans boutons atteignables')

  // Focus rings must be checked with REAL keyboard traversal: :focus-visible is
  // deliberately not matched by a scripted .focus() call, so testing that way
  // reports failures that no keyboard user would ever see.
  const noRing = []
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Tab')
    const r = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      const st = getComputedStyle(el)
      const ring = st.outlineStyle !== 'none' && parseFloat(st.outlineWidth) > 0
      if (ring && el.matches(':focus-visible')) return null
      return `${el.tagName} "${(el.textContent || '').trim().slice(0, 24)}"`
    })
    if (r) noRing.push(r)
  }
  if (noRing.length) {
    problems.push(`clavier: sans anneau de focus visible: ${noRing.join(', ')}`)
  }

  await ctx.close()
}

// ---------------------------------------------------------------------------
// 5. Mobile menu: opens, locks the page, closes, restores scrolling
// ---------------------------------------------------------------------------
{
  const { ctx, page } = await newPage({ width: 390, height: 844 })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(3400)
  await page.locator('[role="dialog"] button').nth(1).click().catch(() => {})
  await page.waitForTimeout(300)

  await page.click('header button')
  await page.waitForTimeout(500)
  const menuVisible = await page.isVisible('#menu-panel')
  if (!menuVisible) problems.push('mobile: le menu ne s’ouvre pas')

  await page.click('#menu-panel a[href="#projects"]')
  await page.waitForTimeout(1800)
  const afterMenu = await page.evaluate(() => ({
    y: Math.round(window.scrollY),
    menuOpen: !document.getElementById('menu-panel')?.hidden,
    bodyOverflow: document.body.style.overflow,
  }))
  if (afterMenu.menuOpen) problems.push('mobile: le menu reste ouvert après un clic sur un lien')
  if (afterMenu.y === 0) problems.push('mobile: le lien du menu ne défile pas')
  if (afterMenu.bodyOverflow === 'hidden') problems.push('mobile: le défilement reste bloqué après fermeture du menu')

  await ctx.close()
}

// ---------------------------------------------------------------------------
// 6. Reduced motion: everything readable, nothing hidden
// ---------------------------------------------------------------------------
{
  const { ctx, page } = await newPage({ width: 1440, height: 900 }, { reducedMotion: 'reduce' })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(1500)
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll('main p, main h2, main h3, main li')].filter((el) => {
        const r = el.getBoundingClientRect()
        return r.height > 4 && +getComputedStyle(el).opacity < 0.5
      }).length,
  )
  if (hidden) problems.push(`mouvement réduit: ${hidden} bloc(s) de contenu restent invisibles`)

  await page.click('header a[href="#skills"]')
  await page.waitForTimeout(1200)
  const y = await page.evaluate(() => Math.round(window.scrollY))
  if (y < 300) problems.push(`mouvement réduit: la navigation par ancre ne fonctionne pas (scrollY=${y})`)
  await ctx.close()
}

// ---------------------------------------------------------------------------
// 7. The navigation must switch cleanly at the breakpoint.
//    A base CSS rule once out-ranked `md:hidden` and left the MENU button on
//    desktop, where its panel stays display:none: a button that opens nothing.
// ---------------------------------------------------------------------------
for (const width of [1440, 1024, 900, 820, 767, 500, 390]) {
  const { ctx, page } = await newPage({ width, height: 800 })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForTimeout(3400)
  await page.locator('[role="dialog"] button').nth(1).click().catch(() => {})
  await page.waitForTimeout(300)

  const mobile = width < 768
  const btn = await page.locator('header button').isVisible().catch(() => false)
  const desktopNav = await page.locator('header ul').first().isVisible().catch(() => false)

  if (btn !== mobile) {
    problems.push(
      `menu ${width}px: bouton MENU ${btn ? 'visible' : 'absent'} alors qu'il devrait être ` +
        `${mobile ? 'visible' : 'absent'}`,
    )
  }
  if (desktopNav === mobile) {
    problems.push(`menu ${width}px: navigation desktop ${desktopNav ? 'visible' : 'absente'} à tort`)
  }
  if (btn) {
    await page.locator('header button').click()
    await page.waitForTimeout(600)
    const opens = await page.locator('#menu-panel a[href="#projects"]').isVisible().catch(() => false)
    if (!opens) problems.push(`menu ${width}px: le bouton MENU n'ouvre rien`)
  }
  await ctx.close()
}

await browser.close()

for (const n of notes) console.log(`  · ${n}`)
if (problems.length) {
  console.error(`\n${problems.length} problème(s):`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  process.exit(1)
}
console.log('\nAudit accessibilité et UX: aucun problème détecté.')
