import { SITE, type Content, type Lang } from '../i18n'
import { pagePath } from '../lib/url'

export function Footer({
  t,
  cookieLabel,
  lang,
}: {
  t: Content['footer']
  cookieLabel: string
  lang: Lang
}) {
  return (
    <footer className="border-t border-rule bg-ink px-[var(--gutter)] py-12 text-paper">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="display text-[clamp(1.75rem,5vw,3.5rem)]">
            J.S. NUCUM
            <span className="text-signal-light">.</span>
          </p>
          <p className="label mt-5 text-paper-muted">
            © {new Date().getFullYear()} {SITE.name}. {t.rights}
          </p>
          <p className="label mt-1 text-paper-muted">{t.builtWith}</p>
        </div>

        <nav aria-label={t.privacy} className="md:col-span-3">
          <ul className="space-y-2.5">
            <li>
              <a href={pagePath('faq', lang)} className="label wipe">
                {t.faq}
              </a>
            </li>
            <li>
              <a href={pagePath('privacy', lang)} className="label wipe">
                {t.privacy}
              </a>
            </li>
            <li>
              <a href={pagePath('legal', lang)} className="label wipe">
                {t.terms}
              </a>
            </li>
            <li>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
                className="label wipe text-left"
              >
                {cookieLabel}
              </button>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <ul className="space-y-2.5">
            <li>
              <a href={`mailto:${SITE.email}`} className="label wipe">
                EMAIL ↗
              </a>
            </li>
            <li>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="label wipe"
              >
                LINKEDIN ↗
              </a>
            </li>
            <li>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="label wipe"
              >
                GITHUB ↗
              </a>
            </li>
            <li>
              <a href="#top" className="label wipe text-paper-muted">
                {t.backToTop} ↑
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
