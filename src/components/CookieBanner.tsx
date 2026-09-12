import { useEffect, useState } from 'react'
import { readConsent, writeConsent, type ConsentValue } from '../lib/consent'
import { loadAnalytics, purgeAnalyticsCookies } from '../lib/analytics'
import { pagePath } from '../lib/url'
import type { Content, Lang } from '../i18n'

/**
 * Consent gate. Analytics is loaded only from here, and only on 'granted'.
 * Rendered outside ScrollSmoother so it stays pinned to the viewport.
 */
export function CookieBanner({ t, lang }: { t: Content['cookie']; lang: Lang }) {
  const [choice, setChoice] = useState<ConsentValue | null | undefined>(undefined)

  useEffect(() => {
    const stored = readConsent()
    setChoice(stored)
    if (stored === 'granted') loadAnalytics()

    const openPrefs = () => setChoice(null)
    window.addEventListener('open-cookie-preferences', openPrefs)
    return () => window.removeEventListener('open-cookie-preferences', openPrefs)
  }, [])

  function decide(value: ConsentValue) {
    writeConsent(value)
    setChoice(value)
    if (value === 'granted') loadAnalytics()
    else purgeAnalyticsCookies()
  }

  // `undefined` = not read yet, so render nothing and avoid a flash.
  if (choice === undefined || choice === 'granted' || choice === 'denied') return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-body"
      className="fixed inset-x-0 bottom-0 z-[93] border-t border-ink-2 bg-ink px-[var(--gutter)] py-6 text-paper"
    >
      <div className="grid gap-5 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <h2 id="cookie-title" className="label text-signal-light">
            {t.title}
          </h2>
          <p
            id="cookie-body"
            className="mt-3 max-w-2xl text-[0.9375rem] leading-[1.55] text-paper-2"
          >
            {t.body}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:col-span-5 md:justify-end">
          <button type="button" onClick={() => decide('granted')} className="label wipe text-signal-light">
            {t.accept} ✓
          </button>
          <button type="button" onClick={() => decide('denied')} className="label wipe">
            {t.decline} ✕
          </button>
          <a href={pagePath('privacy', lang)} className="label wipe text-paper-muted">
            {t.more} ↗
          </a>
        </div>
      </div>
    </div>
  )
}
