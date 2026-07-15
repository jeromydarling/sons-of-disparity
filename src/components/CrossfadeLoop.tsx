import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export interface CrossfadeLoopHandle {
  play: () => void
  pause: () => void
}

interface CrossfadeLoopProps {
  srcA: string
  /** Second composition of the same moment — when present, A and B alternate */
  srcB?: string | null
  poster?: string | null
  /** Applied to both <video> elements (object-fit etc.) */
  videoClassName?: string
  /** Seconds each composition holds before crossfading (fade is 1s) */
  holdSeconds?: number
  /** Autoplay on mount (story backgrounds). Cinema mode drives play/pause via ref. */
  autoPlay?: boolean
}

/**
 * Two takes of the same scene, alternating with a slow crossfade so the
 * eye never catches a hard loop restart while reading. With only one
 * source it behaves like a plain looped video.
 */
const CrossfadeLoop = forwardRef<CrossfadeLoopHandle, CrossfadeLoopProps>(function CrossfadeLoop(
  { srcA, srcB, poster, videoClassName = '', holdSeconds = 10, autoPlay = false },
  ref
) {
  const refA = useRef<HTMLVideoElement | null>(null)
  const refB = useRef<HTMLVideoElement | null>(null)
  const [showB, setShowB] = useState(false)
  const playingRef = useRef(autoPlay)

  useImperativeHandle(ref, () => ({
    play: () => {
      playingRef.current = true
      refA.current?.play().catch(() => {})
      refB.current?.play().catch(() => {})
    },
    pause: () => {
      playingRef.current = false
      refA.current?.pause()
      refB.current?.pause()
    },
  }))

  useEffect(() => {
    if (!srcB) return
    const id = window.setInterval(() => {
      if (playingRef.current || autoPlay) setShowB((v) => !v)
    }, holdSeconds * 1000)
    return () => window.clearInterval(id)
  }, [srcB, holdSeconds, autoPlay])

  const common = {
    loop: true,
    muted: true,
    playsInline: true,
    autoPlay,
    preload: 'auto' as const,
  }

  return (
    <div className="absolute inset-0">
      <video
        ref={refA}
        src={srcA}
        poster={poster ?? undefined}
        {...common}
        className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${videoClassName} ${
          showB && srcB ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {srcB && (
        <video
          ref={refB}
          src={srcB}
          {...common}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${videoClassName} ${
            showB ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
})

export default CrossfadeLoop
