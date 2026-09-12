import { SITE } from '../i18n'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let loaded = false

/**
 * Loads Google Analytics ONLY after explicit consent. Nothing, not the script
 * tag, not a cookie, touches the visitor's browser before this runs.
 */
export function loadAnalytics(): void {
  if (loaded) return
  const id = SITE.gaMeasurementId
  // Guard against shipping with the placeholder still in place.
  if (!id || id.includes('XXXXXXXXXX')) {
    if (import.meta.env.DEV) {
      console.info('[analytics] No measurement ID set, skipping Google Analytics.')
    }
    return
  }
  loaded = true

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', id, { anonymize_ip: true })
}

/** Best-effort removal of GA cookies when consent is withdrawn. */
export function purgeAnalyticsCookies(): void {
  const host = window.location.hostname
  document.cookie.split(';').forEach((raw) => {
    const name = raw.split('=')[0]?.trim()
    if (!name) return
    if (name.startsWith('_ga') || name.startsWith('_gid')) {
      document.cookie = `${name}=; Max-Age=0; path=/`
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${host}`
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host}`
    }
  })
}
