import { StrictMode, Suspense, lazy, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { content, type Lang } from './i18n'
import { markMotionPreference } from './lib/motion'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CookieBanner } from './components/CookieBanner'
import { Cursor } from './components/Cursor'
import { Preloader } from './components/Preloader'
import { SmoothScroll } from './components/SmoothScroll'
import { ScrollProgress } from './components/ScrollProgress'
import { SectionIndex } from './components/SectionIndex'

type PageName = 'home' | 'faq' | 'privacy' | 'legal' | 'notfound'

const root = document.getElementById('root')
if (!root) throw new Error('#root is missing')

const page = (root.dataset.page ?? 'home') as PageName
let lang = (root.dataset.lang ?? 'fr') as Lang

// 404.html is served for any unknown path, so the language is decided at runtime
// from the URL the visitor actually asked for.
if (page === 'notfound') {
  lang = window.location.pathname.includes('/en/') ? 'en' : 'fr'
  document.documentElement.lang = lang
  document.title = content[lang].meta.notfound.title
}

markMotionPreference()

const t = content[lang]

/** One chunk per page: the privacy policy never downloads the horizontal scroll. */
const Body: ComponentType = (() => {
  switch (page) {
    case 'faq': {
      const Faq = lazy(() => import('./pages/Faq').then((m) => ({ default: m.Faq })))
      return () => <Faq t={t} />
    }
    case 'privacy': {
      const Legal = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Legal })))
      return () => <Legal doc={t.privacy} />
    }
    case 'legal': {
      const Legal = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Legal })))
      return () => <Legal doc={t.terms} />
    }
    case 'notfound': {
      const NotFound = lazy(() =>
        import('./pages/NotFound').then((m) => ({ default: m.NotFound })),
      )
      return () => <NotFound t={t.notFound} lang={lang} />
    }
    default: {
      const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })))
      return () => <Home t={t} />
    }
  }
})()

createRoot(root).render(
  <StrictMode>
    {/* Everything position:fixed lives outside SmoothScroll, a transformed
        ancestor would break fixed positioning. */}
    <Preloader name="J.S. NUCUM / PORTFOLIO" />
    <Cursor />
    <ScrollProgress />
    <Header t={t.nav} lang={lang} page={page} />
    {page === 'home' && <SectionIndex index={t.kinetic.index} />}

    <SmoothScroll>
      <main id="main">
        <Suspense fallback={<div className="min-h-[100svh]" />}>
          <Body />
        </Suspense>
      </main>
      <Footer t={t.footer} cookieLabel={t.cookie.manage} lang={lang} />
    </SmoothScroll>

    <CookieBanner t={t.cookie} lang={lang} />
  </StrictMode>,
)
