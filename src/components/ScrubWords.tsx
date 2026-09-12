import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, noMotion } from '../lib/gsap'

/**
 * Word-by-word colour scrub. The paragraph starts pale and each word turns to
 * full ink as the reader scrolls through it, so the text is literally read by
 * scrolling. `scrub` ties it to position rather than time, which is what makes
 * it feel driven rather than triggered.
 */
export function ScrubWords({
  children,
  as: Tag = 'p',
  className = '',
}: {
  children: ReactNode
  as?: ElementType
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || noMotion()) return

    let split: SplitText | null = null
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type: 'words', wordsClass: 'scrub-word' })

      gsap.fromTo(
        split.words,
        { color: 'var(--color-ink-3)' },
        {
          color: 'var(--color-ink)',
          ease: 'none',
          stagger: 0.4,
          scrollTrigger: {
            trigger: el,
            start: 'top 78%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        },
      )
    }, el)

    return () => {
      split?.revert()
      ctx.revert()
    }
  }, [])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
