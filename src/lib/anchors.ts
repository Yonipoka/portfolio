import { gsap, ScrollSmoother, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

/** Height of the fixed header, so a section title never lands under it. */
const HEADER_OFFSET = 72

function targetFor(hash: string): HTMLElement | null {
  if (!hash || hash === '#') return null
  if (hash === '#top') return document.body
  try {
    return document.querySelector<HTMLElement>(hash)
  } catch {
    return null // not a valid selector, e.g. "#123"
  }
}

/**
 * Moves keyboard focus to the section that was jumped to. Without this, a
 * keyboard or screen-reader user is scrolled somewhere new while their focus
 * stays behind in the navigation, which is the classic broken skip-link.
 */
function focusTarget(el: HTMLElement) {
  if (el === document.body) return
  const hadTabIndex = el.hasAttribute('tabindex')
  if (!hadTabIndex) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
  if (!hadTabIndex) {
    el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true })
  }
}

function goTo(el: HTMLElement, animate: boolean) {
  const smoother = ScrollSmoother.get()

  if (smoother) {
    // ScrollSmoother owns the scroll position: going through it is the only way
    // to keep the smoother, ScrollTrigger and the pinned sections in sync.
    const y = el === document.body ? 0 : smoother.offset(el, 'top top') - HEADER_OFFSET
    if (animate) {
      gsap.to(smoother, {
        scrollTop: y,
        duration: 1.1,
        ease: 'swiss',
        overwrite: true,
        onComplete: () => focusTarget(el),
      })
    } else {
      smoother.scrollTop(y)
      focusTarget(el)
    }
    return
  }

  // No smoother (reduced motion, or a page without it): plain window scrolling.
  const y =
    el === document.body
      ? 0
      : el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
  window.scrollTo({ top: y, behavior: animate ? 'smooth' : 'auto' })
  focusTarget(el)
}

/**
 * Takes over every in-page anchor on the document. Returns a cleanup function.
 *
 * Native hash navigation and ScrollSmoother are incompatible: the browser
 * scrolls the smoother's own wrapper, the transform desyncs, and the page
 * appears frozen or blank. So the default is prevented and the jump is routed
 * through the smoother, with the URL updated by replaceState so the address bar
 * still reflects the section.
 */
export function installAnchorNavigation(): () => void {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return
    }
    const link = (e.target as HTMLElement | null)?.closest?.('a')
    if (!link) return

    const href = link.getAttribute('href') ?? ''
    if (!href.startsWith('#')) return

    const el = targetFor(href)
    if (!el) return

    e.preventDefault()
    goTo(el, !prefersReducedMotion())
    history.replaceState(null, '', href === '#top' ? location.pathname : href)
  }

  document.addEventListener('click', onClick)

  /**
   * A URL opened with a hash is harder: the page body is a lazily-loaded chunk,
   * so the target usually does not exist yet, and the intro has the smoother
   * paused anyway. So wait for the intro, then poll briefly for the element
   * before jumping.
   */
  let deepLinkDone = false
  const hash = location.hash

  function resolveDeepLink() {
    if (deepLinkDone) return
    let tries = 0
    const attempt = () => {
      if (deepLinkDone) return
      const el = targetFor(hash)
      if (el) {
        deepLinkDone = true
        ScrollTrigger.refresh()
        goTo(el, false)
        return
      }
      if (++tries < 40) window.setTimeout(attempt, 100)
    }
    attempt()
  }

  let fallbackTimer = 0
  if (hash && hash !== '#') {
    window.addEventListener('intro:done', resolveDeepLink, { once: true })
    // If the intro never runs (reduced motion, or it was already over), go anyway.
    fallbackTimer = window.setTimeout(resolveDeepLink, 400)
  }

  return () => {
    document.removeEventListener('click', onClick)
    window.removeEventListener('intro:done', resolveDeepLink)
    clearTimeout(fallbackTimer)
  }
}
