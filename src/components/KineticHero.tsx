import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText, noMotion } from '../lib/gsap'
import type { Content } from '../i18n'

/**
 * The hero carries four separate GSAP techniques:
 *  - SplitText masked line reveal on the name
 *  - ScrambleTextPlugin cycling the role, on a repeating timeline
 *  - a DrawSVG rule that draws itself across the page
 *  - data-speed parallax (ScrollSmoother) on the meta column
 * It waits for `intro:done` from the preloader so the two never overlap.
 */
export function KineticHero({ t, kinetic }: { t: Content['hero']; kinetic: Content['kinetic'] }) {
  const root = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const roleRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el || noMotion()) return

    let split: SplitText | null = null
    let started = false

    const ctx = gsap.context(() => {
      const start = () => {
        if (started) return
        started = true

        split = new SplitText(nameRef.current!, { type: 'lines', mask: 'lines' })

        const tl = gsap.timeline()
        tl.from(split.lines, {
          yPercent: 118,
          duration: 1.25,
          stagger: 0.11,
          ease: 'swiss',
        })
          .from(
            el.querySelectorAll('[data-hero-up]'),
            { yPercent: 130, opacity: 0, duration: 0.9, stagger: 0.08 },
            '-=0.85',
          )
          .from(
            el.querySelector('[data-hero-rule]'),
            { drawSVG: '0%', duration: 1.1, ease: 'swiss' },
            '-=0.9',
          )
          .from(
            el.querySelectorAll('[data-hero-meta]'),
            { opacity: 0, duration: 0.7, stagger: 0.06 },
            '-=0.7',
          )

        // Role cycling, started after the entrance settles.
        if (roleRef.current && kinetic.roles.length > 1) {
          const loop = gsap.timeline({ repeat: -1, delay: 1.2 })
          kinetic.roles.forEach((_, i) => {
            const next = kinetic.roles[(i + 1) % kinetic.roles.length]
            loop.to(roleRef.current, {
              duration: 0.9,
              scrambleText: { text: next, chars: 'upperCase', speed: 0.5, revealDelay: 0.2 },
              ease: 'none',
              delay: 1.8,
            })
          })
        }
      }

      window.addEventListener('intro:done', start, { once: true })
      // Safety net: never leave the hero hidden if the intro event never fires.
      const fallback = window.setTimeout(start, 2600)

      return () => {
        window.removeEventListener('intro:done', start)
        clearTimeout(fallback)
      }
    }, el)

    return () => {
      split?.revert()
      ctx.revert()
    }
  }, [kinetic.roles])

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] px-[var(--gutter)] pt-[16vh] pb-[var(--gutter)]"
    >
      <div className="grid-rules" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <span data-hero-meta className="label text-ink-2">
            {t.eyebrow}
          </span>
          <span data-hero-meta className="label text-ink-2">
            2026
          </span>
        </div>

        <h1
          ref={nameRef}
          className="display text-[clamp(2.75rem,11.2vw,10.5rem)]"
          aria-label={t.name}
        >
          John Stewart
          <br />
          Nucum
        </h1>

        <svg
          className="mt-8 block w-full"
          height="2"
          viewBox="0 0 1000 2"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            data-hero-rule
            x1="0"
            y1="1"
            x2="1000"
            y2="1"
            stroke="currentColor"
            strokeWidth="2"
            className="text-ink"
          />
        </svg>

        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="overflow-hidden">
              <span
                data-hero-up
                className="label block text-signal"
                aria-label={t.role}
              >
                <span ref={roleRef}>{kinetic.roles[0]}</span>
              </span>
            </p>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.55] text-ink-2 sm:text-lg">
              {t.pitch}
            </p>
          </div>

          <div
            className="flex flex-col justify-end gap-3 md:col-span-5 md:items-end"
            data-speed="0.92"
          >
            <a
              href="#contact"
              data-cursor
              className="label wipe self-start text-ink md:self-end"
            >
              {t.ctaPrimary} ↓
            </a>
            <a
              href="#projects"
              data-cursor
              className="label wipe self-start text-ink-2 md:self-end"
            >
              {t.ctaSecondary} ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
