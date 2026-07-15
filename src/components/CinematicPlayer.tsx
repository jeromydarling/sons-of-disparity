import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import type { Source, Statistic, VideoScene, VideoSceneStatistic } from '../types'
import { fetchSceneStatistics, fetchSources, fetchStatistics, fetchVideoScenes } from '../data/api'
import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'
import StatOverlay from './StatOverlay'
import { buildSceneCues } from '../utils/captions'

const sceneDuration = (s: VideoScene) => s.duration_seconds ?? 60

const fmt = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

// Placeholder art per scene until Higgsfield loops land — B&W gradients only;
// the nursery scene (last) is the single place green may appear.
const placeholderBg = (idx: number, isLast: boolean) =>
  isLast
    ? 'radial-gradient(120% 100% at 30% 70%, rgba(63,107,69,0.25) 0%, #111111 60%)'
    : `radial-gradient(120% 100% at ${25 + (idx % 3) * 25}% ${60 - (idx % 2) * 20}%, #2A1C26 0%, #111111 65%)`

/**
 * Cinema Mode. A virtual master clock (GSAP ticker) drives playback across
 * scenes. Scene videos are atmospheric Higgsfield loops (muted, looping), the
 * ElevenLabs narration <audio> stays synced to the clock, and a GSAP timeline
 * synced to the clock fires <StatOverlay /> at the timestamps stored in
 * video_scene_statistics. Scene duration comes from the narration length.
 */
export default function CinematicPlayer() {
  const { skepticMode } = useSkepticMode()

  const [scenes, setScenes] = useState<VideoScene[]>([])
  const [links, setLinks] = useState<VideoSceneStatistic[]>([])
  const [stats, setStats] = useState<Statistic[]>([])
  const [sources, setSources] = useState<Source[]>([])

  const [playing, setPlaying] = useState(false)
  const [sceneIdx, setSceneIdx] = useState(0)
  const [uiTime, setUiTime] = useState(0)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [evidence, setEvidence] = useState<Statistic | null>(null)
  const [ended, setEnded] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const overlayEls = useRef(new Map<string, HTMLButtonElement>())
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const timeRef = useRef(0)
  const playingRef = useRef(false)
  const sceneIdxRef = useRef(0)
  const startedRef = useRef(false)
  const progressFired = useRef(new Set<number>())
  const scenesReached = useRef(new Set<string>())

  useEffect(() => {
    let alive = true
    Promise.all([fetchVideoScenes(), fetchSceneStatistics(), fetchStatistics(), fetchSources()]).then(
      ([sc, li, st, so]) => {
        if (!alive) return
        setScenes([...sc].sort((a, b) => a.sequence - b.sequence))
        setLinks(li)
        setStats(st)
        setSources(so)
      }
    )
    return () => {
      alive = false
    }
  }, [])

  const statsById = useMemo(() => new Map(stats.map((s) => [s.id, s])), [stats])
  const sourcesById = useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources])

  const starts = useMemo(() => {
    let t = 0
    return scenes.map((s) => {
      const start = t
      t += sceneDuration(s)
      return start
    })
  }, [scenes])

  const total = useMemo(
    () => scenes.reduce((n, s) => n + sceneDuration(s), 0),
    [scenes]
  )

  const indexAt = useCallback(
    (t: number) => {
      let idx = 0
      for (let i = 0; i < starts.length; i++) if (t >= starts[i]) idx = i
      return idx
    },
    [starts]
  )

  const scene = scenes[sceneIdx]
  const sceneLinks = useMemo(
    () =>
      scene
        ? links
            .filter((l) => l.video_scene_id === scene.id && l.timestamp_start_seconds != null)
            .sort((a, b) => (a.timestamp_start_seconds ?? 0) - (b.timestamp_start_seconds ?? 0))
        : [],
    [links, scene]
  )

  const cues = useMemo(
    () => (scene?.transcript_text ? buildSceneCues(scene.transcript_text, sceneDuration(scene)) : []),
    [scene]
  )

  /* --- master clock ------------------------------------------------------ */

  const setClock = useCallback(
    (t: number) => {
      timeRef.current = t
      const idx = indexAt(t)
      if (idx !== sceneIdxRef.current) {
        sceneIdxRef.current = idx
        setSceneIdx(idx)
      }
      const sc = scenes[idx]
      if (sc && !scenesReached.current.has(sc.slug)) {
        scenesReached.current.add(sc.slug)
        analytics.videoSceneReached(sc.slug)
      }

      // stat-overlay timeline follows the clock exactly
      if (tlRef.current) tlRef.current.time(Math.max(0, t - (starts[idx] ?? 0)), false)

      // narration audio stays synced to the clock
      const audio = audioRef.current
      if (audio) {
        const local = t - (starts[idx] ?? 0)
        if (Math.abs(audio.currentTime - local) > 0.35) audio.currentTime = local
      }

      // progress milestones
      if (total > 0) {
        const pct = (t / total) * 100
        for (const mark of [25, 50, 75] as const) {
          if (pct >= mark && !progressFired.current.has(mark)) {
            progressFired.current.add(mark)
            analytics.videoProgress(mark)
          }
        }
      }

      setUiTime((prev) => (Math.abs(prev - t) > 0.08 ? t : prev))
    },
    [indexAt, scenes, starts, total]
  )

  useEffect(() => {
    if (!scenes.length) return
    const tick = (_time: number, deltaTime: number) => {
      if (!playingRef.current) return
      // the virtual clock is always master — scene videos are mood loops
      let t = timeRef.current + deltaTime / 1000
      if (t >= total) {
        playingRef.current = false
        setPlaying(false)
        setEnded(true)
        analytics.videoCompleted()
        window.dispatchEvent(new Event('sod:cinema-stopped'))
        t = total
      }
      setClock(t)
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
    }
  }, [scenes, starts, total, setClock])

  // build the overlay timeline for the current scene
  useLayoutEffect(() => {
    if (!scene) return
    const tl = gsap.timeline({ paused: true })
    sceneLinks.forEach((link) => {
      const el = overlayEls.current.get(link.statistic_id)
      if (!el) return
      const start = link.timestamp_start_seconds ?? 0
      const end = link.timestamp_end_seconds ?? start + 10
      tl.fromTo(
        el,
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        start
      )
      tl.to(el, { autoAlpha: 0, y: -18, duration: 0.5, ease: 'power2.in' }, end)
    })
    tlRef.current = tl
    tl.time(Math.max(0, timeRef.current - (starts[sceneIdx] ?? 0)), false)
    return () => {
      tl.kill()
      tlRef.current = null
    }
  }, [scene, sceneLinks, sceneIdx, starts])

  /* --- controls ------------------------------------------------------------ */

  const play = useCallback(() => {
    if (!startedRef.current) {
      startedRef.current = true
      analytics.videoStarted()
    }
    if (ended && timeRef.current >= total) {
      setClock(0)
      setEnded(false)
    }
    playingRef.current = true
    setPlaying(true)
    videoRef.current?.play().catch(() => {})
    audioRef.current?.play().catch(() => {})
    // hand the soundstage to the narration — AmbientAudio listens
    window.dispatchEvent(new Event('sod:cinema-playing'))
  }, [ended, total, setClock])

  const pause = useCallback(() => {
    playingRef.current = false
    setPlaying(false)
    videoRef.current?.pause()
    audioRef.current?.pause()
    window.dispatchEvent(new Event('sod:cinema-stopped'))
  }, [])

  // keep loop video + narration elements following the play state across
  // scene changes (both elements remount per scene), and release the
  // soundstage on unmount
  useEffect(() => {
    if (playing) {
      videoRef.current?.play().catch(() => {})
      audioRef.current?.play().catch(() => {})
    }
  }, [playing, sceneIdx])

  useEffect(() => {
    return () => {
      window.dispatchEvent(new Event('sod:cinema-stopped'))
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (playingRef.current) pause()
    else play()
  }, [play, pause])

  const seek = useCallback(
    (t: number) => {
      const clamped = Math.max(0, Math.min(t, total))
      setEnded(false)
      setClock(clamped)
    },
    [total, setClock]
  )

  const openEvidence = useCallback(
    (stat: Statistic) => {
      pause()
      setEvidence(stat)
      analytics.evidencePauseOpened(stat.slug)
    },
    [pause]
  )

  const toggleCaptions = useCallback(() => {
    setCaptionsOn((on) => {
      if (!on) analytics.captionsEnabled()
      return !on
    })
  }, [])

  const toggleTranscript = useCallback(() => {
    setTranscriptOpen((open) => {
      if (!open) analytics.transcriptOpened()
      return !open
    })
  }, [])

  // S — open the source card for the active (or most recent) stat
  const openActiveSource = useCallback(() => {
    const local = timeRef.current - (starts[sceneIdxRef.current] ?? 0)
    const active =
      [...sceneLinks].reverse().find((l) => (l.timestamp_start_seconds ?? 0) <= local) ?? sceneLinks[0]
    const stat = active && statsById.get(active.statistic_id)
    if (stat) openEvidence(stat)
  }, [sceneLinks, starts, statsById, openEvidence])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case 'c':
        case 'C':
          toggleCaptions()
          break
        case 't':
        case 'T':
          toggleTranscript()
          break
        case 's':
        case 'S':
          openActiveSource()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, toggleCaptions, toggleTranscript, openActiveSource])

  /* --- render ---------------------------------------------------------------- */

  if (!scene) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-fog/40">Loading the record…</p>
      </div>
    )
  }

  const localTime = uiTime - (starts[sceneIdx] ?? 0)
  const activeCue = cues.find((c) => localTime >= c.start && localTime < c.end)
  const isLastScene = sceneIdx === scenes.length - 1
  const evidenceSource = evidence?.source_id ? sourcesById.get(evidence.source_id) : undefined

  return (
    <div className="relative h-full w-full overflow-hidden bg-asphalt">
      {/* Frame: Higgsfield mood loop, or the styled storyboard placeholder */}
      {scene.video_url ? (
        <video
          key={scene.id}
          ref={videoRef}
          // portrait: letterbox the full frame; landscape: fill the screen
          className={`absolute inset-0 h-full w-full object-cover portrait:object-contain ${
            scene.chapter_slug === 'act-5' ? 'grayscale contrast-90' : ''
          }`}
          src={scene.video_url}
          poster={scene.poster_url ?? undefined}
          loop
          muted
          playsInline
          onLoadedData={() => {
            if (playingRef.current) videoRef.current?.play().catch(() => {})
          }}
        />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.id}
            className="absolute inset-0"
            style={{ background: placeholderBg(sceneIdx, isLastScene) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            {/* film grain */}
            <div
              className="absolute inset-0 opacity-[0.07] mix-blend-screen"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-asphalt/90 to-transparent" />
            <div className="absolute left-8 top-1/2 max-w-md -translate-y-1/2 lg:left-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fog mb-3">
                Scene {String(scene.sequence).padStart(2, '0')} · storyboard
              </p>
              <h2 className="font-serif text-4xl font-light text-marble leading-tight">{scene.title}</h2>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-fog/70">
                Higgsfield silhouette footage pending — narration and evidence run in real time.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Narration track (ElevenLabs) — synced to the master clock */}
      {scene.narration_audio_url && (
        <audio key={`audio-${scene.id}`} ref={audioRef} src={scene.narration_audio_url} preload="auto" />
      )}

      {/* Stat overlays — GSAP owns visibility via the scene timeline */}
      <div className="pointer-events-none absolute bottom-40 right-6 z-20 flex flex-col items-end gap-4 lg:right-14">
        {sceneLinks.map((link) => {
          const stat = statsById.get(link.statistic_id)
          if (!stat) return null
          return (
            <StatOverlay
              key={`${scene.id}-${link.statistic_id}`}
              stat={stat}
              onOpen={openEvidence}
              ref={(el) => {
                if (el) overlayEls.current.set(link.statistic_id, el)
                else overlayEls.current.delete(link.statistic_id)
              }}
            />
          )
        })}
      </div>

      {/* Captions — cue timing follows the master clock, not the loop video */}
      {captionsOn && activeCue && (
        <div className="pointer-events-none absolute inset-x-0 bottom-36 z-20 flex justify-center px-6">
          <p className="max-w-2xl bg-asphalt/80 px-4 py-2 text-center font-serif text-lg text-marble">
            {activeCue.text}
          </p>
        </div>
      )}

      {/* Ended card */}
      <AnimatePresence>
        {ended && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-asphalt/90 px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="max-w-md font-serif italic text-lg text-marble/80">
              The story is fiction. The numbers are not.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/data"
                onClick={() => analytics.watchToData()}
                className="border border-marble/40 px-6 py-3 font-mono text-xs uppercase tracking-wider text-marble hover:bg-marble hover:text-asphalt transition-all"
              >
                Examine the evidence
              </Link>
              <Link
                to="/story"
                onClick={() => analytics.watchToStory()}
                className="border border-fog/30 px-6 py-3 font-mono text-xs uppercase tracking-wider text-fog hover:text-marble hover:border-marble/40 transition-all"
              >
                Scroll the record
              </Link>
            </div>
            <button
              type="button"
              onClick={play}
              className="font-mono text-xs uppercase tracking-widest text-fog/60 hover:text-marble transition-colors"
            >
              ↺ Watch again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evidence Pause — source card */}
      <AnimatePresence>
        {evidence && (
          <motion.aside
            className="absolute bottom-24 left-6 z-40 w-[22rem] max-w-[calc(100vw-3rem)] border border-fog/30 bg-asphalt/95 p-5 backdrop-blur"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35 }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brick mb-3">
              Evidence pause
            </p>
            <p className="font-mono text-3xl text-marble">{evidence.value_text}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-fog">
              {evidence.short_claim}
            </p>
            {evidence.detail_text && (
              <p className="mt-3 font-serif text-sm leading-relaxed text-marble/75">
                {evidence.detail_text}
              </p>
            )}
            {evidence.source_title && (
              <p className="mt-3 font-mono text-[11px] text-fog/80">
                Source:{' '}
                <a
                  href={evidence.source_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                  onClick={() => analytics.sourceOpened(evidence.source_id ?? evidence.slug)}
                >
                  {evidence.source_title}
                </a>
              </p>
            )}
            {skepticMode && evidenceSource?.methodology_note && (
              <p className="mt-3 border-l-2 border-brick/60 pl-3 font-mono text-[11px] leading-relaxed text-fog">
                <span className="text-brick/90 uppercase tracking-wider">Methodology — </span>
                {evidenceSource.methodology_note}
              </p>
            )}
            {skepticMode && evidence.skeptic_caveat && (
              <p className="mt-2 border-l-2 border-brick/60 pl-3 font-mono text-[11px] leading-relaxed text-fog">
                <span className="text-brick/90 uppercase tracking-wider">Caveat — </span>
                {evidence.skeptic_caveat}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setEvidence(null)
                play()
              }}
              className="mt-4 border border-marble/40 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-marble hover:bg-marble hover:text-asphalt transition-all"
            >
              Resume
            </button>
            <button
              type="button"
              onClick={() => setEvidence(null)}
              className="ml-3 font-mono text-[11px] uppercase tracking-wider text-fog/60 hover:text-marble transition-colors"
            >
              Close
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Transcript drawer */}
      <AnimatePresence>
        {transcriptOpen && (
          <motion.section
            className="absolute inset-x-0 bottom-0 z-40 max-h-[60vh] overflow-y-auto border-t border-fog/25 bg-asphalt/95 px-6 py-6 backdrop-blur lg:px-16"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-fog">Transcript</h3>
              <button
                type="button"
                onClick={toggleTranscript}
                className="font-mono text-[11px] uppercase tracking-wider text-fog/60 hover:text-marble"
              >
                Close (T)
              </button>
            </div>
            <div className="space-y-6">
              {scenes.map((s, i) => (
                <div key={s.id}>
                  <button
                    type="button"
                    onClick={() => seek(starts[i])}
                    className={`font-mono text-[11px] uppercase tracking-wider transition-colors ${
                      i === sceneIdx ? 'text-brick' : 'text-fog hover:text-marble'
                    }`}
                  >
                    {fmt(starts[i])} · {s.title}
                  </button>
                  <p className="mt-1 max-w-3xl font-serif text-sm leading-relaxed text-marble/70">
                    {s.transcript_text}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Control bar */}
      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-asphalt via-asphalt/85 to-transparent px-6 pb-5 pt-10 lg:px-14">
        {/* scrubber */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={Math.max(total, 1)}
            step={0.1}
            value={uiTime}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek"
            className="h-1 w-full cursor-pointer appearance-none bg-fog/25 accent-[#7A2E2A]"
          />
          {/* chapter ticks */}
          {starts.map((s, i) =>
            i === 0 ? null : (
              <span
                key={i}
                className="pointer-events-none absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-marble/50"
                style={{ left: `${(s / Math.max(total, 1)) * 100}%` }}
              />
            )
          )}
        </div>

        {/* chapter markers */}
        <div className="mt-2 hidden gap-1 md:flex">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => seek(starts[i])}
              style={{ width: `${(sceneDuration(s) / Math.max(total, 1)) * 100}%` }}
              className={`truncate border-t-2 px-1 pt-1 text-left font-mono text-[10px] uppercase tracking-wider transition-colors ${
                i === sceneIdx
                  ? 'border-brick text-marble'
                  : 'border-transparent text-fog/50 hover:text-fog'
              }`}
              title={s.title}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? 'Pause' : 'Play'}
            className="flex h-10 w-10 items-center justify-center border border-marble/40 text-marble hover:bg-marble hover:text-asphalt transition-all"
          >
            {playing ? (
              <span className="flex gap-1">
                <span className="block h-3.5 w-1 bg-current" />
                <span className="block h-3.5 w-1 bg-current" />
              </span>
            ) : (
              <span className="ml-0.5 block h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-current" />
            )}
          </button>
          <span className="font-mono text-xs text-fog">
            {fmt(uiTime)} / {fmt(total)}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-wider text-fog/40 sm:block">
            space play · C captions · T transcript · S source
          </span>
          <span className="flex-1" />
          <button
            type="button"
            onClick={toggleCaptions}
            className={`font-mono text-[11px] uppercase tracking-wider transition-colors ${
              captionsOn ? 'text-marble' : 'text-fog/60 hover:text-marble'
            }`}
          >
            CC
          </button>
          <button
            type="button"
            onClick={toggleTranscript}
            className={`font-mono text-[11px] uppercase tracking-wider transition-colors ${
              transcriptOpen ? 'text-marble' : 'text-fog/60 hover:text-marble'
            }`}
          >
            Transcript
          </button>
        </div>
      </div>
    </div>
  )
}
