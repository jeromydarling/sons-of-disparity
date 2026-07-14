import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'

/**
 * Floating Skeptic Mode toggle. Defaults to bottom-left so it never collides
 * with the record rail (bottom-right); pass `position` where that corner is
 * taken (e.g. the cinema control bar).
 */
export default function SkepticToggle({ position = 'bottom-5 left-5' }: { position?: string }) {
  const { skepticMode, toggleSkepticMode } = useSkepticMode()

  return (
    <button
      type="button"
      onClick={() => {
        toggleSkepticMode()
        analytics.skepticToggled(!skepticMode)
      }}
      aria-pressed={skepticMode}
      className={`fixed ${position} z-50 px-3 py-2 font-mono text-[11px] uppercase tracking-wider
                  border backdrop-blur-sm transition-colors duration-300
                  ${
                    skepticMode
                      ? 'bg-brick/30 border-brick/70 text-marble'
                      : 'bg-asphalt/70 border-fog/30 text-fog hover:border-marble/40 hover:text-marble'
                  }`}
    >
      {skepticMode ? 'Skeptic Mode: ON' : 'Skeptic Mode'}
    </button>
  )
}
