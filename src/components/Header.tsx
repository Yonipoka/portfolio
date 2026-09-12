import { useEffect, useLayoutEffect, useState } from 'react'
import { SITE, type Lang, type Content } from '../i18n'
import { pagePath } from '../lib/url'
import { ScrollTrigger, ScrollSmoother, noMotion } from '../lib/gsap'

type Page = 'home' | 'faq' | 'legal' | 'privacy' | 'notfound'

export function Header({ t, lang, page }: { t: Content['nav']; lang: Lang; page: Page }) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(page !== 'home')
  const other: Lang = lang === 'fr' ? 'en' : 'fr'
  const home = pagePath('home', lang)

  /**
   * Over the hero the bar is transparent and inverts whatever is behind it.
   * Past the hero it takes a solid paper background: difference blending is
   * elegant over one big headline, illegible over body copy.
   */
  useLayoutEffect(() => {
    if (page !== 'home') return
    if (noMotion()) {
      setSolid(true)
      return
    }
    const st = ScrollTrigger.create({
      start: '70vh top',
      onToggle: (self) => setSolid(self.isActive),
    })
    return () => st.kill()
  }, [page])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Locking `body` does not stop ScrollSmoother, which drives its own scroll.
  // Pausing the smoother is what actually freezes the page behind the menu.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    ScrollSmoother.get()?.paused(open)
    return () => {
      document.body.style.overflow = ''
      ScrollSmoother.get()?.paused(false)
    }
  }, [open])

  const links =
    page === 'home'
      ? [
          { href: '#about', label: t.about },
          { href: '#projects', label: t.projects },
          { href: '#experience', label: t.experience },
          { href: '#skills', label: t.skills },
          { href: '#contact', label: t.contact },
        ]
      : [
          { href: home, label: t.home },
          { href: pagePath('faq', lang), label: t.faq },
        ]

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-ink focus:px-5 focus:py-3 focus:text-paper"
      >
        <span className="label">{t.skip}</span>
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[95] transition-colors duration-500 ${
          solid
            ? 'border-b border-rule bg-paper'
            : 'mix-blend-difference'
        }`}
      >
        <nav
          aria-label={t.menu}
          className={`flex items-center justify-between px-[var(--gutter)] py-5 ${
            solid ? 'text-ink' : 'text-paper'
          }`}
        >
          <a href={home} className="label" aria-label={SITE.name}>
            J.S. NUCUM
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="label wipe">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={pagePath(page === 'notfound' ? 'home' : page, other)}
                lang={other}
                hrefLang={other}
                className="label wipe"
              >
                {other.toUpperCase()}
              </a>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-panel"
            className="label md:hidden"
          >
            {open ? t.close : t.menu}
          </button>
        </nav>
      </header>

      {/* Full-bleed mobile menu, outside the smoother so it stays put. */}
      <div
        id="menu-panel"
        hidden={!open}
        className="fixed inset-0 z-[94] flex flex-col justify-center bg-ink px-[var(--gutter)] text-paper md:hidden"
      >
        <ul className="space-y-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="display block py-1 text-[clamp(2rem,10vw,3.5rem)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={pagePath(page === 'notfound' ? 'home' : page, other)}
          lang={other}
          hrefLang={other}
          className="label mt-12 text-signal-light"
        >
          {t.switchTo}
        </a>
      </div>
    </>
  )
}
