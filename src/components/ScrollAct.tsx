import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Statistic, StoryAct } from '../types'
import StatCard from './StatCard'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollActProps {
  act: StoryAct
  onEnter: (actNumber: number) => void
  onLeave: (actNumber: number) => void
  /** Sourced statistics for this act — animate in from the right margin */
  stats?: Statistic[]
  /** Embedded interactives (e.g. TheSameMistake in Act 4) */
  children?: ReactNode
}

const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

export default function ScrollAct({ act, onEnter, onLeave, stats = [], children }: ScrollActProps) {
  const sectionRef = useRef<HTMLElement>(null)
  // Callbacks live in refs so ScrollTriggers are built exactly once.
  const enterRef = useRef(onEnter)
  const leaveRef = useRef(onLeave)
  enterRef.current = onEnter
  leaveRef.current = onLeave

  const isPrison = act.palette === 'desaturated'
  const isSeedling = act.palette === 'seedling'

  useLayoutEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => enterRef.current(act.act_number),
        onEnterBack: () => enterRef.current(act.act_number),
        onLeave: () => leaveRef.current(act.act_number),
        onLeaveBack: () => leaveRef.current(act.act_number),
      })

      gsap.utils.toArray<HTMLElement>('.act-para').forEach((para) => {
        gsap.from(para, {
          opacity: 0,
          y: 36,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: para, start: 'top 85%' },
        })
      })

      // Stat cards slide in from the right margin
      gsap.utils.toArray<HTMLElement>('.stat-slide').forEach((card) => {
        gsap.from(card, {
          x: 96,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 60%' },
        })
      })
    }, el)

    return () => ctx.revert()
  }, [act.act_number])

  return (
    <section
      ref={sectionRef}
      id={act.slug}
      data-act={act.act_number}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Large screens: the loop plays full-bleed behind the text */}
      <div className={`absolute inset-0 hidden lg:block ${isPrison ? 'grayscale contrast-75' : ''}`}>
        {act.higgsfield_loop_url ? (
          <video
            className="h-full w-full object-cover"
            src={act.higgsfield_loop_url}
            poster={act.poster_url ?? undefined}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-bruise to-asphalt" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-asphalt/90 via-asphalt/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-16 lg:py-44 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
        {/* Phones: the whole sketch frame, uncropped, above the prose */}
        <div className="lg:hidden relative -mx-6 mb-10 lg:col-span-2">
          {act.higgsfield_loop_url ? (
            <video
              className={`aspect-video w-full ${isPrison ? 'grayscale contrast-75' : ''}`}
              src={act.higgsfield_loop_url}
              poster={act.poster_url ?? undefined}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <div className="aspect-video w-full bg-gradient-to-b from-bruise to-asphalt" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-asphalt to-transparent" />
        </div>
        {/* Prose column — narrows to max-w-sm inside the prison act */}
        <div className={isPrison ? 'max-w-sm' : 'max-w-2xl'}>
          <p
            className={`act-para font-mono text-xs uppercase tracking-[0.25em] mb-4 ${
              isSeedling ? 'text-seedling' : 'text-fog'
            }`}
          >
            Act {roman[act.act_number]}
            {act.subtitle ? ` — ${act.subtitle}` : ''}
          </p>
          <h2 className="act-para font-serif text-4xl md:text-5xl font-light text-marble leading-tight mb-10">
            {act.title}
          </h2>
          <div className="space-y-6 font-serif text-lg text-marble/80 leading-relaxed">
            {act.body_mdx.split('\n\n').map((para, i) => (
              <p key={i} className="act-para">
                {para}
              </p>
            ))}
          </div>

          {children && <div className="mt-16">{children}</div>}
        </div>

        {/* Stat rail — enters from the right margin */}
        {stats.length > 0 && (
          <aside className="mt-16 lg:mt-24 space-y-6">
            {stats.map((stat) => (
              <StatCard key={stat.slug} stat={stat} className="stat-slide max-w-xs" />
            ))}
          </aside>
        )}
      </div>
    </section>
  )
}
