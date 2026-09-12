import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, noMotion } from '../lib/gsap'
import type { Content } from '../i18n'

const SECTION_IDS = ['about', 'projects', 'experience', 'skills', 'contact']

/**
 * A fixed index rail. One ScrollTrigger per section reports which one is
 * currently crossing the middle of the viewport, in both scroll directions
 * (onEnter / onEnterBack), and the active entry slides out and turns red.
 *
 * It is navigation as much as decoration: every entry is a real link.
 */
export function SectionIndex({ index }: { index: Content['kinetic']['index'] }) {
  const [active, setActive] = useState(-1)
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (noMotion()) return
    if (!window.matchMedia('(min-width: 1100px)').matches) return

    const ctx = gsap.context(() => {
      SECTION_IDS.forEach((id, i) => {
        const section = document.getElementById(id)
        if (!section) return
        ScrollTrigger.create({
          trigger: section,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
          onLeaveBack: () => i === 0 && setActive(-1),
        })
      })

      // The rail itself fades in once the hero is behind us.
      gsap.fromTo(
        root.current,
        { autoAlpha: 0, x: 12 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.6,
          scrollTrigger: { trigger: document.body, start: '80vh top', toggleActions: 'play none none reverse' },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={root}
      aria-label="Index"
      className="fixed right-[var(--gutter)] top-1/2 z-[92] hidden -translate-y-1/2 xl:block"
    >
      <ul className="space-y-2.5 text-right">
        {index.map((it, i) => (
          <li key={it.n}>
            <a
              href={`#${SECTION_IDS[i]}`}
              aria-current={active === i ? 'true' : undefined}
              className={`label inline-block transition-[transform,color] duration-400 ${
                active === i
                  ? 'translate-x-0 text-signal'
                  : 'translate-x-3 text-ink-3 hover:translate-x-1 hover:text-ink'
              }`}
            >
              <span className="tabular-nums">{it.n}</span>
              <span className={active === i ? 'ml-3 inline' : 'ml-3 hidden'}>{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
