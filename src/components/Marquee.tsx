import { useLayoutEffect, useRef } from 'react'
import { gsap, Observer, noMotion } from '../lib/gsap'

/**
 * Infinite ticker. The track is duplicated and wrapped with gsap.utils.wrap, so
 * it loops seamlessly at any width. Observer feeds scroll velocity back into the
 * timeScale, so the band speeds up and flips direction as you scroll, the
 * detail that makes a marquee feel connected to the page instead of decorative.
 */
export function Marquee({ words, className = '' }: { words: string[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = track.current
    if (!el || noMotion()) return

    const ctx = gsap.context(() => {
      const half = el.scrollWidth / 2
      const tween = gsap.to(el, {
        x: -half,
        duration: 28,
        ease: 'none',
        repeat: -1,
        modifiers: { x: gsap.utils.unitize(gsap.utils.wrap(-half, 0)) },
      })

      const obs = Observer.create({
        type: 'wheel,touch,scroll',
        onChangeY(self) {
          const v = gsap.utils.clamp(-6, 6, self.velocityY / 260)
          gsap.to(tween, { timeScale: v === 0 ? 1 : v, duration: 0.4, overwrite: true })
          gsap.to(tween, { timeScale: 1, duration: 1.4, delay: 0.4, overwrite: false })
        },
      })

      return () => obs.kill()
    }, el)

    return () => ctx.revert()
  }, [words])

  // Rendered twice so the wrap point is always covered.
  const run = [...words, ...words]

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div ref={track} className="marquee">
        {run.map((w, i) => (
          <span
            key={`${w}-${i}`}
            className="display shrink-0 px-[0.35em] text-[clamp(2.5rem,7vw,6rem)]"
          >
            {w}
            <span className="text-signal-light">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
