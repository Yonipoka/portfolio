import { SplitReveal } from '../components/SplitReveal'
import type { Content } from '../i18n'

type Doc = Content['privacy'] | Content['terms']

export function Legal({ doc }: { doc: Doc }) {
  return (
    <section className="px-[var(--gutter)] pt-[28vh] pb-28">
      <div className="grid gap-12 md:grid-cols-12">
        <header className="md:col-span-12">
          <span className="label text-signal">{doc.updated}</span>
          <SplitReveal
            as="h1"
            type="chars"
            className="display mt-5 text-[clamp(2.25rem,8vw,6.5rem)]"
          >
            {doc.title}
          </SplitReveal>
        </header>

        <div className="mt-8 md:col-span-8 md:col-start-4">
          {doc.sections.map((s, i) => (
            <section key={s.h} className="border-t border-rule py-10">
              <div className="grid gap-6 md:grid-cols-4">
                <h2 className="label text-ink-3 md:col-span-1">
                  {String(i + 1).padStart(2, '0')} / {s.h}
                </h2>
                <div className="space-y-4 md:col-span-3">
                  {s.p.map((para) => (
                    <SplitReveal
                      key={para.slice(0, 24)}
                      as="p"
                      className="text-[0.975rem] leading-[1.65] text-ink-2"
                    >
                      {para}
                    </SplitReveal>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
