import { useEffect, useRef } from 'react'
import { gsap, noMotion } from '../lib/gsap'

/**
 * A difference-blended dot that trails the pointer, scaled up over interactive
 * elements. gsap.quickTo is the cheap path here: it reuses one tween instead of
 * creating a new one on every mousemove.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (noMotion() || window.matchMedia('(pointer: coarse)').matches) return

    gsap.set(el, { xPercent: -50, yPercent: -50 })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    const scaleTo = gsap.quickTo(el, 'scale', { duration: 0.3, ease: 'power3' })

    const move = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      scaleTo(t.closest('a, button, [data-cursor]') ? 3.2 : 1)
    }

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])

  return <div ref={ref} className="cursor-dot" aria-hidden="true" />
}
