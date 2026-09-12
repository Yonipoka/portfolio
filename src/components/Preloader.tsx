import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollSmoother, noMotion } from '../lib/gsap'

/**
 * A short counted intro: 000 → 100, then the black panel clips away upwards and
 * dispatches `intro:done` so the hero can start. Skipped entirely for reduced
 * motion, and it never blocks content for more than ~1.6s.
 */
export function Preloader({ name }: { name: string }) {
  const [gone, setGone] = useState(() => noMotion())
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (noMotion()) {
      window.dispatchEvent(new CustomEvent('intro:done'))
      return
    }
    const el = root.current
    const n = num.current
    if (!el || !n) return

    document.body.style.overflow = 'hidden'
    ScrollSmoother.get()?.paused(true)
    const counter = { v: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        ScrollSmoother.get()?.paused(false)
        setGone(true)
        window.dispatchEvent(new CustomEvent('intro:done'))
      },
    })

    tl.to(counter, {
      v: 100,
      duration: 1.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        n.textContent = String(Math.round(counter.v)).padStart(3, '0')
      },
    })
      .to(el.querySelectorAll('[data-intro-item]'), {
        yPercent: -110,
        duration: 0.5,
        stagger: 0.04,
        ease: 'swissIn',
      })
      .to(
        el,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.8,
          ease: 'swiss',
        },
        '-=0.15',
      )

    return () => {
      document.body.style.overflow = ''
      ScrollSmoother.get()?.paused(false)
      tl.kill()
    }
  }, [])

  if (gone) return null

  return (
    <div
      ref={root}
      className="preloader"
      aria-hidden="true"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <span className="label overflow-hidden">
        <span data-intro-item className="block">
          {name}
        </span>
      </span>
      <span className="display overflow-hidden text-[clamp(3rem,12vw,9rem)] leading-none">
        <span data-intro-item className="block">
          <span ref={num}>000</span>
        </span>
      </span>
    </div>
  )
}
