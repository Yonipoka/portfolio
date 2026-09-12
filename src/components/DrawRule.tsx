import { useLayoutEffect, useRef } from 'react'
import { gsap, noMotion } from '../lib/gsap'

/**
 * A section divider that draws itself across the page as you scroll past it,
 * using DrawSVGPlugin on a scrub. With reduced motion (or no JS) the line is
 * simply there, full width, from the start.
 */
export function DrawRule({ thick = false }: { thick?: boolean }) {
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || noMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelector('line'),
        { drawSVG: '0%' },
        {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            end: 'top 45%',
            scrub: 0.5,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={ref}
      className="block w-full text-ink"
      height={thick ? 3 : 1}
      viewBox={`0 0 1000 ${thick ? 3 : 1}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line
        x1="0"
        y1={thick ? 1.5 : 0.5}
        x2="1000"
        y2={thick ? 1.5 : 0.5}
        stroke="currentColor"
        strokeWidth={thick ? 3 : 1}
      />
    </svg>
  )
}
