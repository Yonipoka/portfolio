import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, noMotion } from '../lib/gsap'

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** 'lines' for body copy, 'chars' for short display type. */
  type?: 'lines' | 'chars'
  delay?: number
  start?: string
}

/**
 * The workhorse reveal: SplitText cuts the element into masked lines (or chars)
 * and ScrollTrigger plays them in from below. Because the mask is a real
 * overflow box, the text appears to rise out of the page rather than fade -
 * the difference between an editorial reveal and a generic one.
 */
export function SplitReveal({
  children,
  as: Tag = 'div',
  className = '',
  type = 'lines',
  delay = 0,
  start = 'top 88%',
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || noMotion()) return

    let split: SplitText | null = null
    const ctx = gsap.context(() => {
      split = new SplitText(el, {
        type,
        mask: type,
        linesClass: 'split-line',
        charsClass: 'split-char',
      })
      const targets = type === 'lines' ? split.lines : split.chars

      gsap.from(targets, {
        yPercent: 115,
        duration: type === 'chars' ? 0.9 : 1.1,
        delay,
        stagger: type === 'chars' ? 0.02 : 0.08,
        ease: 'swiss',
        scrollTrigger: { trigger: el, start, once: true },
      })
    }, el)

    return () => {
      split?.revert()
      ctx.revert()
    }
  }, [type, delay, start])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
