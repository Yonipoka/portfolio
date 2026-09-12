import { useLayoutEffect, useRef } from 'react'
import { gsap, noMotion } from '../lib/gsap'

/**
 * Counts a number up when it scrolls into view. Numbers are rendered as their
 * final value in the markup, so with JS off or motion reduced the reader still
 * sees the real figure, the animation only ever starts from a lower number.
 */
export function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || noMotion()) return
    const target = Number(value)
    if (!Number.isFinite(target)) return

    const pad = value.length
    const counter = { v: 0 }

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = String(Math.round(counter.v)).padStart(pad, '0')
        },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [value])

  return (
    <div className="border-t border-rule pt-4">
      <span
        ref={ref}
        className="display block text-[clamp(2.5rem,6vw,5rem)] leading-none"
      >
        {value}
      </span>
      <span className="label mt-3 block max-w-[16ch] text-ink-3">{label}</span>
    </div>
  )
}
