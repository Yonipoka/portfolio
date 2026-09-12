/**
 * Renders the social share image and the Apple touch icon from SVG.
 * These outputs are committed to the repo, so this script only needs to run
 * again when the branding changes: npm run gen:images
 */
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = resolve(ROOT, 'public')

const FONT = 'Poppins, DejaVu Sans, sans-serif'

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ebe8e1"/>
  <rect x="0" y="0" width="1200" height="14" fill="#e4321b"/>

  <line x1="300" y1="14" x2="300" y2="630" stroke="#c6c2b8" stroke-width="1"/>
  <line x1="600" y1="14" x2="600" y2="630" stroke="#c6c2b8" stroke-width="1"/>
  <line x1="900" y1="14" x2="900" y2="630" stroke="#c6c2b8" stroke-width="1"/>

  <text x="72" y="96" font-family="${FONT}" font-size="20" font-weight="500" fill="#8c8880" letter-spacing="4">GENÈVE, SUISSE</text>
  <text x="1128" y="96" text-anchor="end" font-family="${FONT}" font-size="20" font-weight="500" fill="#8c8880" letter-spacing="4">2026</text>

  <text x="66" y="300" font-family="${FONT}" font-size="152" font-weight="800" fill="#0e0e0c" letter-spacing="-7">JOHN STEWART</text>
  <text x="66" y="430" font-family="${FONT}" font-size="152" font-weight="800" fill="#0e0e0c" letter-spacing="-7">NUCUM</text>

  <line x1="66" y1="480" x2="1134" y2="480" stroke="#0e0e0c" stroke-width="3"/>

  <text x="72" y="540" font-family="${FONT}" font-size="24" font-weight="500" fill="#e4321b" letter-spacing="4">BUSINESS ANALYST JUNIOR</text>
  <text x="72" y="580" font-family="${FONT}" font-size="22" font-weight="400" fill="#4a4843" letter-spacing="1">React · Next.js · TypeScript · SQL · Power BI · BPMN</text>
</svg>`

const icon = readFileSync(resolve(PUBLIC, 'favicon.svg'))

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(resolve(PUBLIC, 'og-image.png'))
await sharp(icon, { density: 400 })
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(resolve(PUBLIC, 'apple-touch-icon.png'))

writeFileSync(resolve(PUBLIC, '.nojekyll'), '')

console.log('Generated og-image.png (1200x630), apple-touch-icon.png (180x180) and .nojekyll')
