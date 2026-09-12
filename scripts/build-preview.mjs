/**
 * Builds a single self-contained HTML file of the home page, for sharing a live
 * preview before the real multi-page site is deployed to GitHub Pages.
 * Not part of the deploy, the real site is the multi-page build in dist/.
 */
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, '.preview')

await build({
  root: ROOT,
  base: './',
  configFile: false,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: OUT,
    emptyOutDir: true,
    target: 'es2020',
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      input: resolve(ROOT, 'index.html'),
      output: { inlineDynamicImports: true, entryFileNames: 'app.js', assetFileNames: '[name][extname]' },
    },
  },
  logLevel: 'warn',
})

const files = readdirSync(OUT)
const js = files.find((f) => f.endsWith('.js'))
const css = files.find((f) => f.endsWith('.css'))

const script = readFileSync(resolve(OUT, js), 'utf8')
const styles = css ? readFileSync(resolve(OUT, css), 'utf8') : ''

// The Artifact host supplies <!doctype>, <head> and <body>, so emit only the
// page contents: title, styles, mount point, and the bundled app.
const out = `<title>John Stewart Nucum | Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
/>
<style>
${styles}
</style>
<div id="root" data-page="home" data-lang="fr"></div>
<script type="module">
${script}
</script>
`

writeFileSync(resolve(ROOT, 'preview.html'), out, 'utf8')
console.log(`preview.html written (${(out.length / 1024).toFixed(0)} kB)`)
