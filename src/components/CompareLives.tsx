import { useEffect, useState } from 'react'
import type { Statistic } from '../types'
import { fetchStatistics } from '../data/api'
import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'

// Phase-1 input set: four structural exposures, each tied to a sourced
// statistic seeded in the D1 `statistics` table (act_number = 0).
const QUESTIONS = [
  {
    key: 'poverty',
    label: 'Poverty level in childhood',
    statSlug: 'compare-poverty',
    options: [
      { value: 'above', label: 'Above the poverty line', exposure: 0 },
      { value: 'near', label: 'Near poverty', exposure: 1 },
      { value: 'below', label: 'Below the poverty line', exposure: 2 },
    ],
    ranges: [
      'Population baseline for childhood economic exposure.',
      'Elevated exposure: near-poverty households cycle in and out of the line, with unstable housing and schools.',
      'High exposure: childhood poverty is the strongest single predictor of later system contact — and it is distributed 3-to-1 by race.',
    ],
  },
  {
    key: 'discipline',
    label: 'School discipline history',
    statSlug: 'compare-discipline',
    options: [
      { value: 'none', label: 'None', exposure: 0 },
      { value: 'one', label: 'One suspension', exposure: 1 },
      { value: 'multiple', label: 'Multiple suspensions', exposure: 2 },
    ],
    ranges: [
      'Baseline: no recorded discipline file.',
      'A single discretionary suspension nearly triples (2.85×) the odds of juvenile-justice contact within a year.',
      'Repeated removals compound: each one re-raises exposure and lowers graduation odds — the strongest school-to-system pathway in the data.',
    ],
  },
  {
    key: 'bail',
    label: 'Bail availability',
    statSlug: 'compare-bail',
    options: [
      { value: 'afford', label: 'Could afford bail', exposure: 0 },
      { value: 'cannot', label: 'Could not afford bail', exposure: 2 },
    ],
    ranges: [
      'Baseline: awaiting trial at home, employed, able to assist a defense.',
      '',
      'Pretrial detention raises conviction likelihood by ~13 percentage points — almost entirely through guilty pleas — and depresses employment for years.',
    ],
  },
  {
    key: 'charge',
    label: 'Charge type',
    statSlug: 'compare-charge',
    options: [
      { value: 'misdemeanor', label: 'Misdemeanor', exposure: 1 },
      { value: 'felony', label: 'Felony', exposure: 2 },
    ],
    ranges: [
      '',
      'At the misdemeanor level, white defendants avoid jail-carrying convictions ~75% more often than Black defendants facing the same charge.',
      'A felony record cuts a Black applicant’s callback rate to 5% — under a third of a white applicant’s rate with the identical record (17%).',
    ],
  },
] as const

type Answers = Record<string, string>

const EXPOSURE_LABELS = ['Baseline', 'Elevated', 'High'] as const
const EXPOSURE_WIDTHS = ['w-1/6', 'w-1/2', 'w-full'] as const
const EXPOSURE_COLORS = ['bg-fog/60', 'bg-marble/70', 'bg-brick'] as const

/**
 * Compare Lives — structural exposure calculator (Phase 1 input set).
 * Outputs are statistical ranges from the D1 statistics table, never
 * predictions about an individual.
 */
export default function CompareLives() {
  const [answers, setAnswers] = useState<Answers>({})
  const [ran, setRan] = useState(false)
  const [stats, setStats] = useState<Statistic[]>([])
  const { skepticMode } = useSkepticMode()

  useEffect(() => {
    let alive = true
    fetchStatistics(0).then((s) => {
      if (alive) setStats(s)
    })
    return () => {
      alive = false
    }
  }, [])

  const complete = QUESTIONS.every((q) => answers[q.key])

  const run = () => {
    setRan(true)
    analytics.compareLivesRun()
  }

  const statFor = (slug: string) => stats.find((s) => s.slug === slug)

  return (
    <div className="max-w-2xl">
      <div className="space-y-10">
        {QUESTIONS.map((q) => (
          <fieldset key={q.key}>
            <legend className="font-mono text-xs uppercase tracking-[0.2em] text-marble/80 mb-3">
              {q.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer border px-4 py-2 font-mono text-xs tracking-wider transition-colors ${
                    answers[q.key] === opt.value
                      ? 'border-marble bg-marble text-asphalt'
                      : 'border-fog/30 text-fog hover:border-marble/50 hover:text-marble'
                  }`}
                >
                  <input
                    type="radio"
                    name={q.key}
                    value={opt.value}
                    checked={answers[q.key] === opt.value}
                    onChange={() => {
                      setAnswers((a) => ({ ...a, [q.key]: opt.value }))
                      setRan(false)
                    }}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <button
        type="button"
        disabled={!complete}
        onClick={run}
        className="mt-12 border border-marble/40 px-8 py-4 font-mono text-sm uppercase tracking-wider text-marble
                   transition-all duration-300 enabled:hover:bg-marble enabled:hover:text-asphalt
                   disabled:cursor-not-allowed disabled:border-fog/20 disabled:text-fog/40"
      >
        Run the numbers
      </button>

      {ran && (
        <div className="mt-14 space-y-8">
          <p className="border-l-2 border-brick bg-brick/10 px-4 py-3 font-mono text-xs leading-relaxed text-marble/80">
            These are statistical ranges, not predictions about individuals.
          </p>

          {QUESTIONS.map((q) => {
            const selected = q.options.find((o) => o.value === answers[q.key])
            if (!selected) return null
            const stat = statFor(q.statSlug)
            const level = selected.exposure
            return (
              <div key={q.key} className="border border-fog/20 bg-charcoal/60 p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-wider text-fog">{q.label}</p>
                  <p className="font-mono text-xs text-marble/80">{selected.label}</p>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 bg-fog/15">
                    <div className={`h-full ${EXPOSURE_WIDTHS[level]} ${EXPOSURE_COLORS[level]}`} />
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-marble/70 w-20 text-right">
                    {EXPOSURE_LABELS[level]}
                  </span>
                </div>
                <p className="mt-3 font-serif text-sm text-marble/75 leading-relaxed">
                  {q.ranges[level]}
                </p>
                {stat && (
                  <p className="mt-3 font-mono text-[11px] text-fog/70">
                    {stat.value_text} — {stat.short_claim}.{' '}
                    {stat.source_title && (
                      <a
                        href={stat.source_url ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                        onClick={() => analytics.sourceOpened(stat.source_id ?? stat.slug)}
                      >
                        {stat.source_title}
                      </a>
                    )}
                  </p>
                )}
                {skepticMode && stat?.skeptic_caveat && (
                  <p className="mt-2 border-l-2 border-brick/60 pl-3 font-mono text-[11px] leading-relaxed text-fog">
                    <span className="text-brick/90 uppercase tracking-wider">Caveat — </span>
                    {stat.skeptic_caveat}
                  </p>
                )}
              </div>
            )
          })}

          <p className="font-serif italic text-sm text-fog/60">
            Exposure describes what a system does with a profile — not what a person will do.
          </p>
        </div>
      )}
    </div>
  )
}
