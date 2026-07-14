import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Source } from '../types'
import { fetchSources } from '../data/api'
import { analytics } from '../analytics/ga'

export default function SkepticPage() {
  const [sources, setSources] = useState<Source[]>([])

  useEffect(() => {
    let alive = true
    fetchSources().then((s) => {
      if (alive) setSources(s)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-2xl"
      >
        <Link
          to="/data"
          className="mb-12 block font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors"
        >
          ← Data
        </Link>
        <h1 className="font-serif text-4xl font-light text-marble mb-6">Skeptic Mode</h1>
        <div className="space-y-4 font-serif text-marble/75 leading-relaxed mb-14">
          <p>
            This project makes a claim, and claims deserve scrutiny. Skeptic Mode exists so the
            scrutiny doesn’t have to be done somewhere else: every statistic in the experience
            carries a caveat, and every source below carries a methodology note — what the study
            measured, how, and where it is weakest.
          </p>
          <p>
            Three standards were applied. Disparity figures had to compare like with like where the
            underlying study allowed it. Causal language is used only where the study design
            supports it (audit studies, random judge assignment). And where cohorts or measures
            vary, the range is stated instead of the most dramatic number.
          </p>
        </div>

        <h2 className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-fog">
          Methodology, source by source
        </h2>
        <ul className="divide-y divide-fog/15">
          {sources.map((source) => (
            <li key={source.id} className="py-5">
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
              {source.methodology_note && (
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-fog">
                  {source.methodology_note}
                </p>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </main>
  )
}
