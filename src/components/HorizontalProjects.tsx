import { useLayoutEffect, useRef } from 'react'
import { gsap, noMotion } from '../lib/gsap'
import type { Content } from '../i18n'

/**
 * The pinned horizontal section. The page stops scrolling vertically and the
 * project panels travel sideways instead, the classic agency move, and the one
 * place a portfolio can show it understands scroll choreography.
 *
 * Under reduced motion (or on a narrow screen) it degrades to an ordinary
 * vertical stack: no pin, no horizontal travel, same content and same order.
 */
export function HorizontalProjects({ t }: { t: Content['projects'] }) {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const sec = section.current
    const tr = track.current
    if (!sec || !tr || noMotion()) return
    if (!window.matchMedia('(min-width: 900px)').matches) return

    const ctx = gsap.context(() => {
      const distance = () => tr.scrollWidth - window.innerWidth

      const horizontal = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Panels reveal as they cross the viewport horizontally. `containerAnimation`
      // is what lets ScrollTrigger read position along a horizontal tween.
      gsap.utils.toArray<HTMLElement>('[data-panel]', sec).forEach((panel) => {
        gsap.from(panel.querySelector('[data-panel-inner]'), {
          opacity: 0,
          yPercent: 8,
          ease: 'swiss',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontal,
            start: 'left 85%',
            once: true,
          },
        })
      })
    }, sec)

    return () => ctx.revert()
  }, [t])

  return (
    <div ref={section} id="projects" className="relative overflow-hidden">
      <div
        ref={track}
        className="flex flex-col lg:h-[100svh] lg:w-max lg:flex-row lg:items-stretch"
      >
        {/* Intro panel */}
        <div className="flex shrink-0 flex-col justify-end border-t border-rule px-[var(--gutter)] py-16 lg:w-[42vw] lg:justify-center lg:border-l lg:border-t-0">
          <span className="label text-signal">02 / {t.title}</span>
          <h2 className="display mt-5 text-[clamp(2.5rem,7vw,6rem)]">{t.title}</h2>
          <p className="mt-6 max-w-sm text-ink-2">{t.lead}</p>
          <span className="label mt-10 hidden text-ink-3 lg:block">↔ scroll</span>
        </div>

        {t.items.map((p, i) => (
          <article
            key={p.id}
            data-panel
            className="flex shrink-0 flex-col justify-center border-t border-rule px-[var(--gutter)] py-16 lg:w-[52vw] lg:border-l lg:border-t-0"
          >
            <div data-panel-inner>
              <div className="flex items-start justify-between gap-6">
                <span className="display text-[clamp(3rem,7vw,6rem)] leading-[0.8] text-signal">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="label pt-1 text-ink-3">{p.year}</span>
              </div>

              <hr className="rule mt-8 mb-7" />

              <h3 className="display text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[0.95]">
                {p.name}
              </h3>
              <p className="label mt-4 text-ink-3">{p.kind}</p>

              <p className="mt-7 max-w-xl text-[1.0625rem] leading-[1.55] text-ink-2">
                {p.summary}
              </p>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="label text-ink-3">{p.roleLabel}</h4>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{p.role}</p>
                </div>
                <div>
                  <h4 className="label text-ink-3">{p.stackLabel}</h4>
                  <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {p.stack.map((s) => (
                      <li key={s} className="label text-ink">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
