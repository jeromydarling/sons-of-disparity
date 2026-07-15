import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Source, Statistic } from '../types'
import { fetchSources, fetchStatistics } from '../data/api'
import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'
import StatCard from '../components/StatCard'

const ACT_TITLES: Record<number, string> = {
  0: 'Compare Lives inputs',
  1: 'Act I — Before He Has a Name',
  2: 'Act II — The Hallway',
  3: 'Act III — The Stop',
  4: 'Act IV — The Plea',
  5: 'Act V — The Count',
  6: 'Act VI — The Box',
  7: 'Act VII — The Cross-Examination',
  8: 'Act VIII — The Nursery',
}

export default function DataPage() {
  const { skepticMode } = useSkepticMode()
  const [stats, setStats] = useState<Statistic[]>([])
  const [sources, setSources] = useState<Source[]>([])

  useEffect(() => {
    let alive = true
    Promise.all([fetchStatistics(), fetchSources()]).then(([st, so]) => {
      if (!alive) return
      setStats(st)
      setSources(so)
    })
    return () => {
      alive = false
    }
  }, [])

  const actNumbers = [...new Set(stats.map((s) => s.act_number))].sort(
    (a, b) => (a || 99) - (b || 99) // story acts first, calculator inputs last
  )

  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-3xl"
      >
        <Link
          to="/"
          className="mb-12 block font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors"
        >
          ← Sons of Disparity
        </Link>
        {/* The global Skeptic Mode toggle lives in the top-right controls */}
        <h1 className="mb-10 font-serif text-4xl font-light text-marble">The Data</h1>
        {skepticMode && (
          <div className="mb-8 border-l-2 border-brick bg-brick/10 px-4 py-3">
            <p className="font-mono text-xs text-brick/80">
              Skeptic Mode does not weaken the argument. It shows its work. Caveats, methodology
              notes, and study limitations are now visible.
            </p>
          </div>
        )}

        {/* Statistics, grouped by act */}
        {actNumbers.map((n) => (
          <section key={n} className="mb-14">
            <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-fog">
              {ACT_TITLES[n] ?? `Act ${n}`}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {stats
                .filter((s) => s.act_number === n)
                .map((stat) => (
                  <StatCard key={stat.slug} stat={stat} />
                ))}
            </div>
          </section>
        ))}

        {/* Sources */}
        <section className="mt-20">
          <h2 className="mb-6 font-serif text-2xl font-light text-marble">Sources</h2>
          <ul className="divide-y divide-fog/15">
            {sources.map((source) => (
              <li key={source.id} className="py-4">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-marble/90 hover:text-marble underline underline-offset-4 decoration-fog/30"
                  onClick={() => analytics.sourceOpened(source.id)}
                >
                  {source.title}
                </a>
                <p className="mt-1 font-mono text-xs text-fog">
                  {source.publisher}
                  {source.year ? ` · ${source.year}` : ''}
                </p>
                {skepticMode && source.methodology_note && (
                  <p className="mt-2 border-l-2 border-brick/60 pl-3 font-mono text-[11px] leading-relaxed text-fog">
                    <span className="text-brick/90 uppercase tracking-wider">Methodology — </span>
                    {source.methodology_note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-16 font-mono text-xs text-fog/40">
          Full methodology notes live on the{' '}
          <Link to="/skeptic" className="source-link">
            Skeptic page
          </Link>
          , or flip on Skeptic Mode anywhere.
        </p>
      </motion.div>
    </main>
  )
}
