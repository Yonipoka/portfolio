import { useRef, useState } from 'react'
import { gsap, noMotion } from '../lib/gsap'
import { SplitReveal } from '../components/SplitReveal'
import { MagneticLink } from '../components/MagneticLink'
import { SITE, type Content } from '../i18n'

function Item({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const mark = useRef<HTMLSpanElement>(null)

  function toggle() {
    const next = !open
    setOpen(next)
    const el = panel.current
    if (!el || noMotion()) return

    gsap.to(mark.current, { rotate: next ? 45 : 0, duration: 0.45, ease: 'swiss' })
    if (next) {
      gsap.set(el, { height: 'auto' })
      gsap.from(el, { height: 0, duration: 0.55, ease: 'swiss' })
      gsap.from(el.querySelector('p'), { yPercent: 30, opacity: 0, duration: 0.6, delay: 0.05 })
    } else {
      gsap.to(el, { height: 0, duration: 0.4, ease: 'swissIn' })
    }
  }

  return (
    <li className="border-t border-rule">
      <h2>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={`faq-panel-${index}`}
          id={`faq-button-${index}`}
          className="flex w-full items-start justify-between gap-8 py-7 text-left"
        >
          <span className="label mt-2 shrink-0 text-signal">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="display flex-1 text-[clamp(1.125rem,2.6vw,1.9rem)] leading-[1.05]">
            {q}
          </span>
          <span
            ref={mark}
            aria-hidden="true"
            className="mt-1 shrink-0 text-2xl leading-none text-signal"
          >
            +
          </span>
        </button>
      </h2>
      <div
        ref={panel}
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-button-${index}`}
        hidden={!open}
        className="overflow-hidden"
      >
        <p className="max-w-2xl pb-8 pl-0 text-[1rem] leading-[1.6] text-ink-2 md:pl-[6rem]">
          {a}
        </p>
      </div>
    </li>
  )
}

export function Faq({ t }: { t: Content }) {
  return (
    <section className="px-[var(--gutter)] pt-[28vh] pb-28">
      <span className="label text-signal">FAQ</span>
      <SplitReveal as="h1" type="chars" className="display mt-5 text-[clamp(2.5rem,10vw,8rem)]">
        {t.faq.title}
      </SplitReveal>
      <SplitReveal as="p" className="mt-8 max-w-xl text-[1.0625rem] leading-[1.6] text-ink-2">
        {t.faq.lead}
      </SplitReveal>

      <ul className="mt-16 border-b border-rule">
        {t.faq.items.map((it, i) => (
          <Item key={it.q} q={it.q} a={it.a} index={i} />
        ))}
      </ul>

      <div className="mt-16">
        <MagneticLink
          href={`mailto:${SITE.email}`}
          className="display text-[clamp(1.5rem,4vw,3rem)]"
        >
          {t.contact.emailLabel} ↗
        </MagneticLink>
      </div>
    </section>
  )
}
