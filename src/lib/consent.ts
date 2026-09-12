export type ConsentValue = 'granted' | 'denied'

const KEY = 'jsn-analytics-consent'

/**
 * Browser storage can throw (private mode, blocked site data), so every read and
 * write is guarded and the site must work correctly when it returns null.
 */
export function readConsent(): ConsentValue | null {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

export function writeConsent(value: ConsentValue): void {
  try {
    window.localStorage.setItem(KEY, value)
  } catch {
    /* Consent simply won't persist; the banner reappears next visit. */
  }
}

export function clearConsent(): void {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* no-op */
  }
}
