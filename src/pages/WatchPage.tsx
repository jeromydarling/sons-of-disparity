import { Link } from 'react-router-dom'
import CinematicPlayer from '../components/CinematicPlayer'
import SkepticToggle from '../components/SkepticToggle'

export default function WatchPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-asphalt">
      <Link
        to="/"
        className="absolute left-6 top-6 z-40 font-mono text-xs uppercase tracking-wider text-fog/50 hover:text-marble transition-colors"
      >
        ← Sons of Disparity
      </Link>
      <CinematicPlayer />
      <SkepticToggle position="top-6 right-6" />
    </main>
  )
}
