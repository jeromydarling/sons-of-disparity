import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'

/**
 * Skeptic Mode toggle — rendered inside <FloatingControls /> in the top-right
 * corner of every page. Deliberately prominent: the argument wants to be
 * checked.
 */
export default function SkepticToggle() {
  const { skepticMode, toggleSkepticMode } = useSkepticMode()

  return (
    <button
      type="button"
      onClick={() => {
        toggleSkepticMode()
        analytics.skepticToggled(!skepticMode)
      }}
      aria-pressed={skepticMode}
      className={`px-4 py-2.5 font-mono text-xs uppercase tracking-wider border backdrop-blur-sm
                  transition-colors duration-300 shadow-[0_2px_16px_rgba(0,0,0,0.5)]
                  ${
                    skepticMode
                      ? 'bg-brick/50 border-brick text-marble'
                      : 'bg-asphalt/85 border-marble/40 text-marble/90 hover:border-marble hover:bg-asphalt'
                  }`}
    >
      {skepticMode ? 'Skeptic Mode: ON' : 'Skeptic Mode'}
    </button>
  )
}
