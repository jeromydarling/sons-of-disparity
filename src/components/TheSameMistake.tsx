import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Statistic } from '../types'
import { fetchSources, fetchStatistics } from '../data/api'
import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'

gsap.registerPlugin(ScrollTrigger)

// The measured divergence. Two nineteen-year-olds, same charge, no priors.
// deonPct/tylerPct drive the bar widths; num drives the animated counter.
const ROWS = [
  {
    slug: 'plea-charge-reduction',
    label: 'Chance the top charge is reduced or dropped',
    deon: { num: 50.7, suffix: '%', pct: 50.7 },
    tyler: { num: 63.9, suffix: '%', pct: 63.9 },
  },
  {
    slug: 'plea-misdemeanor-jail',
    label: 'Avoids a jail-carrying conviction — same misdemeanor',
    deon: { num: 1, prefix: '', suffix: '×', pct: 57 },
    tyler: { num: 1.75, suffix: '×', pct: 100 },
    note: 'Tyler avoids incarceration 75% more often',
  },
  {
    slug: 'plea-sentence-length',
    label: 'Sentence length if convicted (same arrest offense)',
    deon: { num: 100, suffix: '%', pct: 100 },
    tyler: { num: 90, suffix: '%', pct: 90 },
    note: 'Tyler’s sentence runs ~10% shorter',
  },
] as const

interface PersonColProps {
  name: string
  desc: string
}

function PersonHeader({ name, desc }: PersonColProps) {
  return (
    <div>
      <p className="font-serif text-2xl text-marble">{name}</p>
      <p className="font-mono text-[11px] uppercase tracking-wider text-fog mt-1">{desc}</p>
    </div>
  )
}

/**
 * The Counterfactual Fork — rendered inside Act 4 (The Plea).
 * Split screen: Deon (Black, 19, no priors) vs Tyler (white, 19, no priors).
 * Same charge. The divergence animates in as the fork scrolls into view.
 */
export default function TheSameMistake() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState<Statistic[]>([])
  const { skepticMode } = useSkepticMode()

  useEffect(() => {
    let alive = true
    // Sources arrive pre-joined onto statistics; fetchSources warms the cache
    // for the attribution fallback below.
    Promise.all([fetchStatistics(4), fetchSources()]).then(([s]) => {
      if (alive) setStats(s)
    })
    return () => {
      alive = false
    }
  }, [])

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.fork-row').forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: 'top 70%' },
        })

        row.querySelectorAll<HTMLElement>('.fork-bar').forEach((bar) => {
          tl.to(
            bar,
            {
              width: `${bar.dataset.target}%`,
              duration: 1.4,
              ease: 'power3.inOut',
            },
            0
          )
        })

        row.querySelectorAll<HTMLElement>('.fork-num').forEach((numEl) => {
          const target = Number(numEl.dataset.target)
          const decimals = Number(numEl.dataset.decimals ?? 0)
          const suffix = numEl.dataset.suffix ?? ''
          const proxy = { v: 0 }
          tl.to(
            proxy,
            {
              v: target,
              duration: 1.4,
              ease: 'power3.inOut',
              onUpdate: () => {
                numEl.textContent = `${proxy.v.toFixed(decimals)}${suffix}`
              },
            },
            0
          )
        })
      })
    }, el)

    return () => ctx.revert()
  }, [stats.length])

  const statFor = (slug: string) => stats.find((s) => s.slug === slug)

  return (
    <div ref={rootRef} className="border border-fog/20 bg-asphalt/80 backdrop-blur-sm">
      <div className="border-b border-fog/20 px-6 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brick">
          The Counterfactual Fork
        </p>
        <h3 className="font-serif text-2xl text-marble mt-2">The Same Mistake</h3>
        <p className="font-serif italic text-sm text-fog mt-1">
          Same charge. Same age. Same empty record. The fork below is measured, not imagined.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px bg-fog/20">
        <div className="bg-asphalt px-6 py-5">
          <PersonHeader name="Deon" desc="Black · 19 · no priors" />
        </div>
        <div className="bg-asphalt px-6 py-5">
          <PersonHeader name="Tyler" desc="white · 19 · no priors" />
        </div>
      </div>

      <div className="divide-y divide-fog/15">
        {ROWS.map((row) => {
          const stat = statFor(row.slug)
          return (
            <div key={row.slug} className="fork-row px-6 py-6">
              <p className="font-mono text-xs uppercase tracking-wider text-marble/70 mb-4">
                {row.label}
              </p>
              <div className="grid grid-cols-2 gap-6">
                {(['deon', 'tyler'] as const).map((who) => {
                  const side = row[who]
                  const decimals = Number.isInteger(side.num) ? 0 : side.num < 10 ? 2 : 1
                  return (
                    <div key={who}>
                      <span
                        className="fork-num block font-mono text-2xl text-marble"
                        data-target={side.num}
                        data-decimals={decimals}
                        data-suffix={side.suffix}
                      >
                        0{side.suffix}
                      </span>
                      <div className="mt-2 h-1.5 bg-fog/15">
                        <div
                          className={`fork-bar h-full w-0 ${who === 'deon' ? 'bg-brick' : 'bg-marble/70'}`}
                          data-target={side.pct}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              {'note' in row && row.note && (
                <p className="mt-3 font-serif italic text-sm text-fog">{row.note}</p>
              )}
              {/* Source attribution — always visible, never optional */}
              <p className="mt-3 font-mono text-[11px] text-fog/70">
                Source:{' '}
                {stat?.source_title ? (
                  <a
                    href={stat.source_url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="source-link"
                    onClick={() => analytics.sourceOpened(stat.source_id ?? row.slug)}
                  >
                    {stat.source_title}
                  </a>
                ) : (
                  'Berdejó, “Criminalizing Race,” Boston College Law Review (2018); Rehavi & Starr, Journal of Political Economy (2014)'
                )}
              </p>
              {skepticMode && stat?.skeptic_caveat && (
                <p className="mt-2 border-l-2 border-brick/60 pl-3 font-mono text-[11px] leading-relaxed text-fog">
                  <span className="text-brick/90 uppercase tracking-wider">Caveat — </span>
                  {stat.skeptic_caveat}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
