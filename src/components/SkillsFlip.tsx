import { useRef, useState } from 'react'
import { gsap, Flip, noMotion } from '../lib/gsap'
import type { Content } from '../i18n'

/**
 * Filtering the skill list with GSAP Flip. Flip records the position of every
 * chip, React re-renders the filtered list, and Flip animates each chip from
 * where it was to where it now is, including the ones that simply shifted.
 * This is the thing you cannot do with CSS transitions alone.
 */
export function SkillsFlip({ t }: { t: Content['skills'] }) {
  const [active, setActive] = useState<string | null>(null)
  const container = useRef<HTMLDivElement>(null)

  const groups = t.groups
  const visible = active ? groups.filter((g) => g.name === active) : groups

  function choose(name: string | null) {
    if (noMotion() || !container.current) {
      setActive(name)
      return
    }
    const state = Flip.getState(container.current.querySelectorAll('[data-chip]'))
    setActive(name)
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: 'swiss',
        stagger: 0.015,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.25 }),
      })
    })
  }

  return (
    <div>
      <div className="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-label={t.title}>
        <button
          type="button"
          onClick={() => choose(null)}
          aria-pressed={active === null}
          className={`label wipe ${active === null ? 'text-signal' : 'text-ink-3'}`}
        >
          {t.title}
        </button>
        {groups.map((g) => (
          <button
            key={g.name}
            type="button"
            onClick={() => choose(active === g.name ? null : g.name)}
            aria-pressed={active === g.name}
            className={`label wipe ${active === g.name ? 'text-signal' : 'text-ink-3'}`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div ref={container} className="mt-10">
        {visible.map((g) => (
          <div key={g.name} className="mb-8">
            <h3 className="label border-t border-rule pt-3 text-ink-3">{g.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  data-chip
                  data-flip-id={s}
                  className="display text-[clamp(1.25rem,3vw,2.5rem)] leading-none"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
