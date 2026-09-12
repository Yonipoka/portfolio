import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
const here = import.meta.dirname

const resolve = (...parts: string[]) => [here, ...parts].join('/')

// Project site on GitHub Pages -> https://yonipoka.github.io/portfolio/
export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      input: {
        home: resolve('index.html'),
        faq: resolve('faq.html'),
        confidentialite: resolve('confidentialite.html'),
        conditions: resolve('conditions.html'),
        notfound: resolve('404.html'),
        enHome: resolve('en/index.html'),
        enFaq: resolve('en/faq.html'),
        enPrivacy: resolve('en/privacy.html'),
        enTerms: resolve('en/terms.html'),
      },
    },
  },
})
