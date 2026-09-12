import { KineticHero } from '../components/KineticHero'
import { SplitReveal } from '../components/SplitReveal'
import { Marquee } from '../components/Marquee'
import { HorizontalProjects } from '../components/HorizontalProjects'
import { StatCounter } from '../components/StatCounter'
import { SkillsFlip } from '../components/SkillsFlip'
import { MagneticLink } from '../components/MagneticLink'
import { ScrubWords } from '../components/ScrubWords'
import { DrawRule } from '../components/DrawRule'
import { BatchReveal } from '../components/BatchReveal'
import { SITE, type Content } from '../i18n'

function SectionHead({ n, title, id }: { n: string; title: string; id: string }) {
  return (
    <div className="mb-12 md:mb-20">
      <span className="label text-signal">
        {n} / {title}
      </span>
      <div data-skew>
        <SplitReveal
          as="h2"
          type="chars"
          className="display mt-5 text-[clamp(2.5rem,8vw,7rem)]"
        >
          <span id={id}>{title}</span>
        </SplitReveal>
      </div>
    </div>
  )
}

export function Home({ t }: { t: Content }) {
  const k = t.kinetic

  return (
    <>
      <KineticHero t={t.hero} kinetic={k} />

      {/* Ticker: skills as a kinetic band between hero and content. */}
      <div className="border-y border-rule bg-ink py-5 text-paper">
        <Marquee words={k.marquee} />
      </div>

      {/* 01. About */}
      <section
        id="about"
        aria-labelledby="about-title"
        className="relative px-[var(--gutter)] py-24 md:py-36"
      >
        <SectionHead n={k.index[0].n} title={t.about.title} id="about-title" />

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <SplitReveal as="p" className="display text-[clamp(1.5rem,3.6vw,2.75rem)] leading-[1.05]">
              {t.about.lead}
            </SplitReveal>

            <div className="mt-10 max-w-xl space-y-5">
              {t.about.body.map((p) => (
                <ScrubWords
                  key={p.slice(0, 24)}
                  className="text-[1.0625rem] leading-[1.6] text-ink-3"
                >
                  {p}
                </ScrubWords>
              ))}
            </div>
          </div>

          <dl className="md:col-span-4 md:col-start-9" data-speed="1.06">
            {t.about.facts.map((f) => (
              <div key={f.label} className="border-t border-rule py-4">
                <dt className="label text-ink-3">{f.label}</dt>
                <dd className="display mt-2 text-[clamp(1.25rem,2.6vw,2rem)]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-24">
          <DrawRule thick />
          <BatchReveal
            selector="[data-stat]"
            className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {k.stats.map((s) => (
              <div key={s.label} data-stat>
                <StatCounter value={s.value} label={s.label} />
              </div>
            ))}
          </BatchReveal>
        </div>
      </section>

      {/* 02. Projects, pinned horizontal on desktop */}
      <HorizontalProjects t={t.projects} />

      {/* 03. Background */}
      <section
        id="experience"
        aria-labelledby="experience-title"
        className="border-t border-rule px-[var(--gutter)] py-24 md:py-36"
      >
        <SectionHead n={k.index[2].n} title={t.experience.title} id="experience-title" />

        <div className="grid gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <h3 className="label pt-3">{t.experience.work}</h3>
            <DrawRule />
            <BatchReveal selector="[data-entry]" as="ul" className="mt-8 space-y-12">
              {t.experience.items.map((it) => (
                <li key={it.org} data-entry>
                  <span className="label text-signal">{it.period}</span>
                  <SplitReveal
                    as="h4"
                    className="display mt-3 text-[clamp(1.25rem,2.8vw,2rem)] leading-[1]"
                  >
                    {it.org}
                  </SplitReveal>
                  <p className="label mt-3 text-ink-3">{it.role}</p>
                  <ul className="mt-5 space-y-2.5">
                    {it.points.map((pt) => (
                      <li
                        key={pt.slice(0, 20)}
                        className="border-t border-rule pt-2.5 text-[0.95rem] leading-relaxed text-ink-2"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </BatchReveal>
          </div>

          <div className="md:col-span-5 md:col-start-8" data-speed="1.04">
            <h3 className="label pt-3">{t.experience.education}</h3>
            <DrawRule />
            <BatchReveal selector="[data-entry]" as="ul" className="mt-8 space-y-12">
              {t.experience.studies.map((it) => (
                <li key={it.org} data-entry>
                  <span className="label text-signal">{it.period}</span>
                  <SplitReveal
                    as="h4"
                    className="display mt-3 text-[clamp(1.25rem,2.8vw,2rem)] leading-[1]"
                  >
                    {it.org}
                  </SplitReveal>
                  <p className="label mt-3 text-ink-3">{it.role}</p>
                  <ul className="mt-5 space-y-2.5">
                    {it.points.map((pt) => (
                      <li
                        key={pt.slice(0, 20)}
                        className="border-t border-rule pt-2.5 text-[0.95rem] leading-relaxed text-ink-2"
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>

                  {it.courses && (
                    <div className="mt-6">
                      <h5 className="label text-ink-3">{t.experience.coursesLabel}</h5>
                      <ul className="mt-3 space-y-1.5">
                        {it.courses.map((c) => (
                          <li
                            key={c}
                            className="flex gap-3 text-[0.95rem] leading-relaxed text-ink-2"
                          >
                            <span aria-hidden="true" className="text-signal">
                              /
                            </span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </BatchReveal>
          </div>
        </div>
      </section>

      {/* 04. Skills, filtered with Flip */}
      <section
        id="skills"
        aria-labelledby="skills-title"
        className="border-t border-rule px-[var(--gutter)] py-24 md:py-36"
      >
        <SectionHead n={k.index[3].n} title={t.skills.title} id="skills-title" />
        <SkillsFlip t={t.skills} />

        <div className="mt-20">
          <h3 className="label border-t border-ink pt-3">{t.skills.languagesTitle}</h3>
          <dl className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.skills.languages.map((l) => (
              <div key={l.name} className="border-t border-rule py-4">
                <dt className="display text-[clamp(1.25rem,2.4vw,1.85rem)]">{l.name}</dt>
                <dd className="label mt-2 text-ink-3">{l.level}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 05. Contact */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="border-t border-rule px-[var(--gutter)] py-24 md:py-36"
      >
        <span className="label text-signal">
          {k.index[4].n} / {t.contact.title}
        </span>

        <SplitReveal
          as="h2"
          type="chars"
          className="display mt-5 text-[clamp(2.25rem,9vw,8rem)]"
        >
          <span id="contact-title">{t.contact.title}</span>
        </SplitReveal>

        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <SplitReveal as="p" className="max-w-xl text-[1.0625rem] leading-[1.6] text-ink-2 md:col-span-6">
            {t.contact.lead}
          </SplitReveal>

          <ul className="md:col-span-5 md:col-start-8">
            <li className="border-t border-ink py-5">
              <MagneticLink
                href={`mailto:${SITE.email}`}
                ariaLabel={t.contact.emailLabel}
                className="display text-[clamp(1.25rem,3vw,2.25rem)] break-all"
              >
                {SITE.email}
              </MagneticLink>
            </li>
            <li className="border-t border-rule py-5">
              <MagneticLink
                href={SITE.linkedin}
                external
                ariaLabel={t.contact.linkedinLabel}
                className="display text-[clamp(1.25rem,3vw,2.25rem)]"
              >
                LINKEDIN ↗
              </MagneticLink>
            </li>
            <li className="border-t border-rule py-5">
              <MagneticLink
                href={SITE.github}
                external
                ariaLabel={t.contact.githubLabel}
                className="display text-[clamp(1.25rem,3vw,2.25rem)]"
              >
                GITHUB ↗
              </MagneticLink>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
