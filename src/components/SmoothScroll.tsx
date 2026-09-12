import { useLayoutEffect, type ReactNode } from 'react'
import { gsap, ScrollSmoother, ScrollTrigger, noMotion } from '../lib/gsap'
import { installAnchorNavigation } from '../lib/anchors'

/**
 * ScrollSmoother wraps the page in an inertial scroll. Anything position:fixed
 * must live OUTSIDE this wrapper, the smoother transforms #smooth-content, and
 * a transformed ancestor breaks fixed positioning.
 *
 * It also enables data-speed / data-lag parallax on descendants (effects: true).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    // In-page anchors must be intercepted whether or not the smoother exists:
    // native hash jumps break ScrollSmoother, and even without it the focus
    // handling in installAnchorNavigation is what keeps anchors accessible.
    if (noMotion()) return installAnchorNavigation()

    // Touch devices keep native scrolling: smoothing there fights the OS and
    // costs battery for no gain.
    const coarse = window.matchMedia('(pointer: coarse)').matches

    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: coarse ? 0 : 1.15,
      smoothTouch: false,
      effects: true,
      normalizeScroll: false,
    })

    const refresh = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(refresh).catch(() => {})

    // Velocity-driven skew: elements marked [data-skew] lean into the scroll and
    // spring back when it stops. Read from the smoother's own velocity, clamped
    // hard so it stays a suggestion of speed rather than a distortion.
    const skewTargets = gsap.utils.toArray<HTMLElement>('[data-skew]')
    let skewTicker: (() => void) | null = null

    if (skewTargets.length && !coarse) {
      const setters = skewTargets.map((el) => gsap.quickSetter(el, 'skewY', 'deg'))
      let current = 0
      skewTicker = () => {
        const target = gsap.utils.clamp(-4, 4, smoother.getVelocity() / -320)
        current += (target - current) * 0.12
        if (Math.abs(current) < 0.005) current = 0
        setters.forEach((set) => set(current))
      }
      gsap.ticker.add(skewTicker)
    }

    const cleanupAnchors = installAnchorNavigation()

    return () => {
      cleanupAnchors()
      if (skewTicker) gsap.ticker.remove(skewTicker)
      smoother.kill()
      gsap.killTweensOf(window)
    }
  }, [])

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  )
}
