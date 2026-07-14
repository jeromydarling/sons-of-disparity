import AmbientAudio from './AmbientAudio'
import SkepticToggle from './SkepticToggle'

/**
 * The two site-wide controls — Skeptic Mode and the background score —
 * pinned together in the top-right corner on every page so they're always
 * in the same place and easy to find.
 */
export default function FloatingControls() {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-stretch gap-2">
      <SkepticToggle />
      <AmbientAudio />
    </div>
  )
}
