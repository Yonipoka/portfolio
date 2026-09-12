import { useLayoutEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { gsap, noMotion } from '../lib/gsap'
import { MagneticLink } from '../components/MagneticLink'
import { pagePath } from '../lib/url'
import type { Content, Lang } from '../i18n'

/**
 * The 404 keeps anime.js: a continuous per-digit wobble on a long loop is
 * exactly the kind of small independent timeline anime.js expresses most
 * concisely, and it keeps this page's motion off GSAP's ticker entirely.
 */
export function NotFound({ t, lang }: { t: Content['notFound']; lang: Lang }) {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (noMotion()) return
    const el = root.current
    if (!el) return
    const digits = Array.from(el.querySelectorAll('[data-digit]'))
    if (!digits.length) return

    animate(digits, {
      opacity: [0, 1],
      y: [{ from: '0.6em', to: '0em' }],
      duration: 1000,
      delay: stagger(110),
      ease: 'outExpo',
    })

    animate(digits, {
      rotateZ: [{ to: -2.5 }, { to: 2.5 }],
      duration: 3400,
      delay: stagger(260, { start: 800 }),
      loop: true,
      alternate: true,
      ease: 'inOutSine',
    })

    // The rule underneath is GSAP's: DrawSVG wipes it across as the page settles.
    gsap.from(el.querySelector('[data-404-rule]'), {
      drawSVG: '0%',
      duration: 1.2,
      delay: 0.4,
      ease: 'swiss',
    })
  }, [])

  return (
    <section
      ref={root}
      className="flex min-h-[100svh] flex-col justify-center px-[var(--gutter)] py-32"
    >
      <span className="label text-signal">ERROR</span>

      <div
        aria-hidden="true"
        className="display mt-4 flex text-[clamp(6rem,32vw,22rem)] leading-[0.8]"
      >
        {t.code.split('').map((d, i) => (
          <span key={`${d}-${i}`} data-digit className="inline-block">
            {d}
          </span>
        ))}
      </div>

      <svg
        className="mt-6 block w-full"
        height="2"
        viewBox="0 0 1000 2"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          data-404-rule
          x1="0"
          y1="1"
          x2="1000"
          y2="1"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>

      <div className="mt-10 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-6">
          <h1 className="display text-[clamp(1.5rem,4vw,3rem)] leading-[1.02]">{t.title}</h1>
          <p className="mt-5 max-w-md text-[1rem] leading-[1.6] text-ink-2">{t.lead}</p>
        </div>

        <ul className="md:col-span-5 md:col-start-8">
          <li className="border-t border-ink py-5">
            <MagneticLink
              href={pagePath('home', lang)}
              className="display text-[clamp(1.25rem,3vw,2.25rem)]"
            >
              {t.cta} ↗
            </MagneticLink>
          </li>
          <li className="border-t border-rule py-5">
            <MagneticLink
              href={pagePath('faq', lang)}
              className="display text-[clamp(1.25rem,3vw,2.25rem)] text-ink-2"
            >
              {t.alt} ↗
            </MagneticLink>
          </li>
        </ul>
      </div>
    </section>
  )
}
