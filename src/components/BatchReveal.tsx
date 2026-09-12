import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, ScrollTrigger, noMotion } from '../lib/gsap'

/**
 * ScrollTrigger.batch groups every element that enters the viewport within the
 * same frame window and staggers them as one set, instead of creating one
 * trigger per element. For a long list this is both cheaper and better looking:
 * items that appear together animate together, whatever the scroll speed.
 */
export function BatchReveal({
  children,
  selector,
  as: Tag = 'div',
  className = '',
}: {
  children: ReactNode
  selector: string
  as?: ElementType
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || noMotion()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(selector, el)
      if (!items.length) return

      gsap.set(items, { opacity: 0, y: 34 })

      ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.09,
            ease: 'swiss',
            overwrite: true,
          }),
      })
    }, el)

    return () => ctx.revert()
  }, [selector])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
