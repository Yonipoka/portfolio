import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, noMotion } from '../lib/gsap'

/**
 * A hairline of signal red across the top, scrubbed directly to page progress.
 * `scrub: true` with no duration means the bar is a pure function of scroll
 * position: it tracks the finger exactly, forwards and backwards.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = bar.current
    if (!el || noMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[96] h-[3px]"
    >
      <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-signal" />
    </div>
  )
}
