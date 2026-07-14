import { useEffect, useRef, useState } from 'react'

const SRC = '/media/ambient-long-time-man.mp3'
const VOLUME = 0.35 // the file itself is loudness-normalized low (-24 LUFS)
const STORAGE_KEY = 'sod-ambient'

/**
 * Site-wide background music — "It Makes a Long Time Man Feel Bad",
 * a traditional prison work song, played as a quiet bed. Starts on the
 * first user interaction (browser autoplay policy), loops, and ducks
 * out entirely while cinema-mode narration is playing
 * (window events `sod:cinema-playing` / `sod:cinema-stopped`).
 */
export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const duckedRef = useRef(false)
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'off'
    } catch {
      return true
    }
  })
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  useEffect(() => {
    const audio = new Audio(SRC)
    audio.loop = true
    audio.volume = VOLUME
    audio.preload = 'auto'
    audioRef.current = audio

    const tryPlay = () => {
      if (!enabledRef.current || duckedRef.current) return
      audio.play().catch(() => {
        /* blocked until a user gesture — the listeners below retry */
      })
    }

    // Autoplay is usually blocked before the first gesture; retry on it.
    const onFirstGesture = () => {
      tryPlay()
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
    }
    window.addEventListener('pointerdown', onFirstGesture)
    window.addEventListener('keydown', onFirstGesture)
    tryPlay()

    // Cinema mode owns the soundstage while narration plays
    const onCinemaPlaying = () => {
      duckedRef.current = true
      audio.pause()
    }
    const onCinemaStopped = () => {
      duckedRef.current = false
      if (enabledRef.current) audio.play().catch(() => {})
    }
    window.addEventListener('sod:cinema-playing', onCinemaPlaying)
    window.addEventListener('sod:cinema-stopped', onCinemaStopped)

    return () => {
      audio.pause()
      audio.src = ''
      window.removeEventListener('pointerdown', onFirstGesture)
      window.removeEventListener('keydown', onFirstGesture)
      window.removeEventListener('sod:cinema-playing', onCinemaPlaying)
      window.removeEventListener('sod:cinema-stopped', onCinemaStopped)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
    } catch {
      /* private mode */
    }
    if (enabled && !duckedRef.current) audio.play().catch(() => {})
    else audio.pause()
  }, [enabled])

  return (
    <button
      type="button"
      onClick={() => setEnabled((v) => !v)}
      aria-pressed={enabled}
      aria-label={enabled ? 'Mute background music' : 'Play background music'}
      title="“It Makes a Long Time Man Feel Bad” — traditional work song"
      className={`fixed top-5 right-5 z-50 flex h-9 w-9 items-center justify-center border font-mono text-sm
                  backdrop-blur-sm transition-colors duration-300
                  ${
                    enabled
                      ? 'border-fog/40 bg-asphalt/70 text-marble'
                      : 'border-fog/25 bg-asphalt/70 text-fog/50 line-through hover:text-fog'
                  }`}
    >
      ♪
    </button>
  )
}
