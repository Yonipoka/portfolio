/** Single source of truth for whether we are allowed to animate. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Flags the document so CSS can decide what to hide before JS animates it. */
export function markMotionPreference(): void {
  const root = document.documentElement
  root.classList.add('has-js')
  if (prefersReducedMotion()) root.classList.add('reduced-motion')
}
