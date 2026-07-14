import { forwardRef } from 'react'
import type { Statistic } from '../types'

interface StatOverlayProps {
  stat: Statistic
  onOpen: (stat: Statistic) => void
}

/**
 * A statistic surfaced over the film at its exact timestamp. GSAP owns its
 * visibility (autoAlpha) via the player timeline; clicking it triggers an
 * Evidence Pause.
 */
const StatOverlay = forwardRef<HTMLButtonElement, StatOverlayProps>(function StatOverlay(
  { stat, onOpen },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onOpen(stat)}
      style={{ visibility: 'hidden', opacity: 0 }}
      className="pointer-events-auto block w-64 border border-fog/30 bg-asphalt/85 px-4 py-3 text-left
                 backdrop-blur-sm transition-colors hover:border-marble/60"
      aria-label={`Evidence: ${stat.short_claim}`}
    >
      <span className="block font-mono text-2xl text-marble leading-none">{stat.value_text}</span>
      <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-fog">
        {stat.short_claim}
      </span>
      <span className="mt-2 block font-mono text-[10px] text-fog/60">tap to pause on the evidence</span>
    </button>
  )
})

export default StatOverlay
