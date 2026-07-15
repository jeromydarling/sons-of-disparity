import { Link } from 'react-router-dom'
import CinematicPlayer from '../components/CinematicPlayer'

export default function WatchPage() {
  return (
    // 100dvh keeps the control bar above the iOS Safari toolbar; h-screen is
    // the fallback where dvh is unsupported
    <main className="h-screen w-screen overflow-hidden bg-asphalt" style={{ height: '100dvh' }}>
      <Link
        to="/"
        className="absolute left-4 top-4 z-40 border border-fog/20 bg-asphalt/70 px-3 py-2 backdrop-blur-sm
                   font-mono text-[11px] sm:text-xs uppercase tracking-wider text-fog/70 hover:text-marble transition-colors"
      >
        ← <span className="hidden sm:inline">Sons of Disparity</span>
        <span className="sm:hidden">Home</span>
      </Link>
      <CinematicPlayer />
    </main>
  )
}
