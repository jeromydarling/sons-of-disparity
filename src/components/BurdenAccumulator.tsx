import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Statistic } from '../types'
import { fetchStatistics } from '../data/api'
import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'

// Each burden is anchored to a sourced statistic already in the D1
// statistics table (statSlug), so the skeptic can pull every thread.
const BURDENS = [
  {
    slug: 'wealth-ratio-today',
    label: 'Inherit one-tenth the wealth cushion',
    weight: '10:1 median household wealth',
  },
  {
    slug: 'neighborhood-poverty',
    label: 'Grow up where two-thirds of your neighbors are poor',
    weight: '66% vs 6% raised in high-poverty neighborhoods',
  },
  {
    slug: 'suspension-disparity',
    label: 'Be suspended for what your classmate apologized for',
    weight: '3.6× more likely to be suspended',
  },
  {
    slug: 'search-disparity',
    label: 'Be searched at the stop — with less found',
    weight: '~2× the search rate, lower hit rate',
  },
  {
    slug: 'pretrial-detention-conviction',
    label: 'Wait in jail because you cannot post bail',
    weight: '+13 points of conviction risk, via pleas',
  },
  {
    slug: 'plea-charge-reduction',
    label: 'Watch the plea math run against you',
    weight: '63.9% vs 50.7% chance the top charge drops',
  },
  {
    slug: 'drug-imprisonment-13x',
    label: 'Carry drug laws enforced 13× harder on you',
    weight: '13× the drug imprisonment rate, same use rate',
  },
  {
    slug: 'lifetime-one-in-five',
    label: 'Hold 1-in-5 lifetime odds of prison',
    weight: 'roughly 4× your white counterpart’s odds',
  },
] as const

const EHRLICHMAN =
  '“The Nixon campaign in 1968, and the Nixon White House after that, had two enemies: the antiwar left and black people… by getting the public to associate the hippies with marijuana and blacks with heroin, and then criminalizing both heavily, we could disrupt those communities… Did we know we were lying about the drugs? Of course we did.”'

/**
 * The Burden Accumulator — Act VII's cross-examination made participatory.
 * The reader stacks Deon's conditions onto their own life one at a time and
 * watches the field darken. At the full stack, the verdict question appears.
 */
export default function BurdenAccumulator() {
  const [carried, setCarried] = useState<Set<string>>(new Set())
  const [confessionOpen, setConfessionOpen] = useState(false)
  const [stats, setStats] = useState<Statistic[]>([])
  const { skepticMode } = useSkepticMode()
  const completedRef = useRef(false)

  useEffect(() => {
    let alive = true
    fetchStatistics().then((s) => {
      if (alive) setStats(s)
    })
    return () => {
      alive = false
    }
  }, [])

  const statBySlug = useMemo(() => new Map(stats.map((s) => [s.slug, s])), [stats])

  const count = carried.size
  const all = count === BURDENS.length

  useEffect(() => {
    if (all && !completedRef.current) {
      completedRef.current = true
      analytics.crossExamCompleted()
    }
  }, [all])

  const toggle = (slug: string) => {
    setCarried((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else {
        next.add(slug)
        analytics.burdenToggled(slug, next.size)
      }
      return next
    })
  }

  return (
    <div className="border border-fog/20 bg-asphalt/90">
      <div className="border-b border-fog/20 px-6 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brick">
          The burden stack
        </p>
        <h3 className="mt-2 font-serif text-2xl text-marble">
          “He should have done better.”
        </h3>
        <p className="mt-1 font-serif italic text-sm text-fog">
          Fine. Keep your intelligence, your willpower, your faith. Now take his conditions,
          one at a time, and carry them.
        </p>
      </div>

      {/* The field — darkens as burdens stack */}
      <div className="relative border-b border-fog/20 px-6 py-6">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-fog">
            Burdens carried
          </span>
          <span className="font-mono text-2xl text-marble">
            {count}<span className="text-fog/60"> / {BURDENS.length}</span>
          </span>
        </div>
        <div className="mt-3 h-1.5 bg-fog/15">
          <div
            className="h-full bg-brick transition-all duration-700 ease-out"
            style={{ width: `${(count / BURDENS.length) * 100}%` }}
          />
        </div>
        <p
          className="mt-3 font-serif text-sm italic transition-colors duration-700"
          style={{ color: `rgba(216,211,199,${0.65 - count * 0.05})` }}
        >
          {count === 0 && 'The road ahead is the one you actually walked.'}
          {count > 0 && count < BURDENS.length && 'The same road. Less light each time.'}
          {all && 'This is the road he was told to walk better.'}
        </p>
      </div>

      {/* The toggles */}
      <ul className="divide-y divide-fog/10">
        {BURDENS.map((burden) => {
          const on = carried.has(burden.slug)
          const stat = statBySlug.get(burden.slug)
          return (
            <li key={burden.slug}>
              <button
                type="button"
                onClick={() => toggle(burden.slug)}
                aria-pressed={on}
                className={`flex w-full items-start gap-4 px-6 py-4 text-left transition-colors duration-500 ${
                  on ? 'bg-bruise/60' : 'hover:bg-charcoal/60'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border font-mono text-xs transition-colors ${
                    on ? 'border-brick bg-brick/40 text-marble' : 'border-fog/40 text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span className="min-w-0">
                  <span className={`block font-serif transition-colors ${on ? 'text-marble' : 'text-marble/75'}`}>
                    {burden.label}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-fog">
                    {burden.weight}
                    {stat?.source_title && (
                      <>
                        {' · '}
                        <a
                          href={stat.source_url ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="source-link"
                          onClick={(e) => {
                            e.stopPropagation()
                            analytics.sourceOpened(stat.source_id ?? burden.slug)
                          }}
                        >
                          source
                        </a>
                      </>
                    )}
                  </span>
                  {skepticMode && stat?.skeptic_caveat && (
                    <span className="mt-1.5 block border-l-2 border-brick/60 pl-3 font-mono text-[11px] leading-relaxed text-fog">
                      {stat.skeptic_caveat}
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* The confession — contested, and labeled as such */}
      <div className="border-t border-fog/20 px-6 py-5">
        <button
          type="button"
          onClick={() => setConfessionOpen((v) => !v)}
          className="font-mono text-[11px] uppercase tracking-wider text-fog hover:text-marble transition-colors"
        >
          {confessionOpen ? '− Hide' : '+ Read'} the confession — Nixon domestic-policy advisor, 1994
        </button>
        <AnimatePresence>
          {confessionOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <blockquote className="mt-4 border-l-2 border-brick pl-4 font-serif italic text-marble/80 leading-relaxed">
                {EHRLICHMAN}
              </blockquote>
              <p className="mt-3 font-mono text-[11px] text-fog/80">
                — John Ehrlichman, as reported by Dan Baum,{' '}
                <a
                  href="https://harpers.org/archive/2016/04/legalize-it-all/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                  onClick={() => analytics.sourceOpened('src-harpers-ehrlichman')}
                >
                  Harper’s Magazine (2016)
                </a>
              </p>
              <p className="mt-2 border-l-2 border-brick/60 pl-3 font-mono text-[11px] leading-relaxed text-fog">
                Contested: Ehrlichman died before publication and his family disputes the quote.
                It is presented as a claimed confession, not a settled fact — the enforcement
                statistics above stand without it.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The verdict — earned only at the full stack */}
      <AnimatePresence>
        {all && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="border-t border-brick/40 bg-bruise/40 px-6 py-8"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brick mb-4">
              The question
            </p>
            <p className="font-serif text-xl leading-relaxed text-marble">
              If you had inherited the same burdens, been watched by the same system, and been
              punished at the same rate — are you certain your life would look any different?
            </p>
            <p className="mt-5 font-serif italic text-sm text-fog">
              If the answer is anything but yes, then this was never a story about individual
              failure.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
