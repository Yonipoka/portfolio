/**
 * Broken-link check over the built site in dist/.
 *
 * - Internal links must resolve to a real file on disk.
 * - Absolute URLs pointing at this very site (canonical, hreflang, og:url) are
 *   verified against dist/ too, so a typo in a canonical tag is caught before
 *   deploy rather than after.
 * - Genuinely external links are probed over the network, unless
 *   --skip-external is passed (CI does, because a flaky third-party host must
 *   not fail a deploy).
 *
 * Usage: node scripts/check-links.mjs [--skip-external]
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, resolve, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')
const ORIGIN = 'https://yonipoka.github.io'
const BASE = '/portfolio/'
const SELF = ORIGIN + BASE
const SKIP_EXTERNAL = process.argv.includes('--skip-external')

/** Hosts that answer bots with 403/999 even though the page is fine. */
const BOT_HOSTILE = [/(^|\.)linkedin\.com$/i]

if (!existsSync(DIST)) {
  console.error('dist/ not found, run `npm run build` first.')
  process.exit(1)
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'))
const errors = []
const warnings = []
const externals = new Set()
let internalChecked = 0

/** Resolves a site path (relative to BASE) to a file in dist/, or null if missing. */
function distFileFor(pathFromBase) {
  let p = pathFromBase.split('#')[0].split('?')[0]
  let onDisk = join(DIST, p)
  if (p === '' || p.endsWith('/')) onDisk = join(onDisk, 'index.html')
  else if (existsSync(onDisk) && statSync(onDisk).isDirectory()) onDisk = join(onDisk, 'index.html')
  return existsSync(onDisk) ? onDisk : null
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  const rel = relative(DIST, file)

  // Skip tags whose href is a hint, not a navigable link.
  const skippable = new Set(
    [...html.matchAll(/<link\b[^>]*rel="(preconnect|dns-prefetch|preload|modulepreload)"[^>]*>/gi)]
      .flatMap((m) => [...m[0].matchAll(/href="([^"]+)"/g)].map((h) => h[1])),
  )

  // href/src everywhere, plus the handful of meta tags whose content IS a URL.
  const candidates = [
    ...[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<meta\b[^>]*(?:property|name)="(?:og:url|og:image|twitter:image)"[^>]*>/gi)]
      .flatMap((m) => [...m[0].matchAll(/content="([^"]+)"/g)].map((c) => c[1])),
  ]

  for (const href of candidates) {
    if (
      !href ||
      skippable.has(href) ||
      href.startsWith('data:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#')
    ) {
      continue
    }

    // Absolute URL that points back at this site -> check it against dist/.
    if (href.startsWith(SELF)) {
      internalChecked++
      if (!distFileFor(href.slice(SELF.length))) {
        errors.push(`${rel}: "${href}" → no such page in dist/`)
      }
      continue
    }

    if (/^https?:\/\//.test(href)) {
      if (href.startsWith(ORIGIN)) {
        errors.push(`${rel}: "${href}" is on this origin but outside the base path ${BASE}`)
      } else {
        externals.add(href)
      }
      continue
    }

    // Root-relative or document-relative link.
    internalChecked++
    if (href.startsWith(BASE)) {
      if (!distFileFor(href.slice(BASE.length))) {
        errors.push(`${rel}: "${href}" → missing file in dist/`)
      }
    } else if (href.startsWith('/')) {
      errors.push(`${rel}: "${href}" is root-relative but outside the base path ${BASE}`)
    } else {
      const onDisk = resolve(dirname(file), href.split('#')[0].split('?')[0])
      if (!existsSync(onDisk)) {
        errors.push(`${rel}: "${href}" → missing file ${relative(DIST, onDisk)}`)
      }
    }
  }
}

let externalChecked = 0
if (!SKIP_EXTERNAL) {
  for (const url of externals) {
    const host = (() => {
      try {
        return new URL(url).hostname
      } catch {
        return ''
      }
    })()
    try {
      const res = await fetch(url, { method: 'GET', redirect: 'follow' })
      externalChecked++
      if (res.status >= 400) {
        const hostile = BOT_HOSTILE.some((re) => re.test(host))
        const msg = `${url} → HTTP ${res.status}`
        if (hostile) warnings.push(`${msg} (host blocks automated checks, verify by hand)`)
        else errors.push(`external: ${msg}`)
      }
    } catch (e) {
      warnings.push(`${url} → ${e instanceof Error ? e.message : 'request failed'}`)
    }
  }
}

console.log(
  `Checked ${htmlFiles.length} pages · ${internalChecked} internal links · ` +
    `${SKIP_EXTERNAL ? `${externals.size} external skipped` : `${externalChecked} external`}`,
)

for (const w of warnings) console.warn(`  ! ${w}`)

if (errors.length) {
  console.error(`\n${errors.length} problem(s):`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exit(1)
}
console.log('No broken links.')
