import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Statistic, StoryAct } from '../types'
import { fetchActs, fetchStatistics } from '../data/api'
import { useLenis, updateLerp } from '../hooks/useLenis'
import { analytics } from '../analytics/ga'
import ScrollAct from '../components/ScrollAct'
import RecordFollows from '../components/RecordFollows'
import TheSameMistake from '../components/TheSameMistake'
import SkepticToggle from '../components/SkepticToggle'

/** Which record stage (0..5) the file has reached after a given act. */
const stageForAct = (actNumber: number) => Math.max(0, Math.min(actNumber - 1, 5))

export default function StoryPage() {
  useLenis()

  const [acts, setActs] = useState<StoryAct[]>([])
  const [stats, setStats] = useState<Statistic[]>([])
  const [currentAct, setCurrentAct] = useState(1)
  const reachedRef = useRef(new Set<number>())

  useEffect(() => {
    let alive = true
    Promise.all([fetchActs(), fetchStatistics()]).then(([a, s]) => {
      if (!alive) return
      setActs(a)
      setStats(s)
    })
    return () => {
      alive = false
    }
  }, [])

  const actsByNumber = useMemo(() => new Map(acts.map((a) => [a.act_number, a])), [acts])

  const handleEnter = useCallback(
    (actNumber: number) => {
      setCurrentAct(actNumber)
      const act = actsByNumber.get(actNumber)
      // Per-act scroll friction — Act 5 drops to 0.03 (time moves differently inside)
      updateLerp(act?.lenis_lerp ?? 0.1)
      if (!reachedRef.current.has(actNumber)) {
        reachedRef.current.add(actNumber)
        analytics.actReached(actNumber, act?.slug ?? String(actNumber))
      }
    },
    [actsByNumber]
  )

  const handleLeave = useCallback((actNumber: number) => {
    analytics.actCompleted(actNumber)
  }, [])

  return (
    <main className="bg-asphalt">
      {/* Title card */}
      <header className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <Link
          to="/"
          className="absolute top-8 left-6 font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors"
        >
          ← Sons of Disparity
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-fog mb-6">
          Scroll the record
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-light text-marble leading-tight mb-6">
          One life, seven acts
        </h1>
        <p className="max-w-xl font-serif italic text-fog/70">
          Deon isn’t real. Every number that made him is. Scroll slowly — the record does.
        </p>
      </header>

      {/* Desktop: the record follows in a sticky right rail */}
      <div className="pointer-events-none fixed right-6 bottom-6 z-30 hidden lg:block">
        <RecordFollows stage={stageForAct(currentAct)} variant="rail" layoutPrefix="rail" />
      </div>

      {acts.map((act) => (
        <div key={act.slug}>
          <ScrollAct
            act={act}
            onEnter={handleEnter}
            onLeave={handleLeave}
            stats={stats.filter((s) => s.act_number === act.act_number)}
          >
            {act.act_number === 4 ? <TheSameMistake /> : undefined}
          </ScrollAct>

          {/* Mobile: interstitial full-screen panel — the record morphs between acts */}
          {act.act_number <= 6 && (
            <section className="flex min-h-[85vh] flex-col items-center justify-center gap-8 px-6 lg:hidden">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fog">
                The record follows
              </p>
              <RecordFollows
                stage={stageForAct(act.act_number)}
                variant="panel"
                layoutPrefix={`interstitial-${act.act_number}`}
              />
            </section>
          )}
        </div>
      ))}

      {/* Closing — the only green in the story lives in Act 7 and here */}
      {acts.length > 0 && (
        <footer className="flex min-h-[70vh] flex-col items-center justify-center gap-10 px-6 text-center">
          <p className="max-w-md font-serif italic text-lg text-marble/80 leading-relaxed">
            The system is on trial. Not the neighborhood. Not the mother. Not the boy.
          </p>
          <div className="h-px w-24 bg-seedling/60" />
          <nav className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/data"
              className="px-6 py-3 border border-marble/30 text-marble font-mono text-xs tracking-wider uppercase hover:bg-marble hover:text-asphalt transition-all duration-300"
            >
              Examine the evidence
            </Link>
            <Link
              to="/watch"
              className="px-6 py-3 border border-fog/20 text-fog font-mono text-xs tracking-wider uppercase hover:border-marble/30 hover:text-marble transition-all duration-300"
            >
              Watch the story
            </Link>
            <Link
              to="/compare"
              className="px-6 py-3 border border-fog/20 text-fog font-mono text-xs tracking-wider uppercase hover:border-marble/30 hover:text-marble transition-all duration-300"
            >
              Compare lives
            </Link>
          </nav>
        </footer>
      )}

      <SkepticToggle />
    </main>
  )
}
