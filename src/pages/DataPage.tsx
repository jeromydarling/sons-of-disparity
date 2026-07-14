import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'

export default function DataPage() {
  const { skepticMode, toggleSkepticMode } = useSkepticMode()
  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <Link to="/" className="font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors mb-12 block">
          ← Sons of Disparity
        </Link>
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-4xl font-light text-marble">The Data</h1>
          <button
            onClick={() => { toggleSkepticMode(); analytics.skepticToggled(!skepticMode) }}
            className={`skeptic-badge cursor-pointer transition-all ${
              skepticMode ? 'bg-brick/40 border-brick/60' : ''
            }`}
          >
            {skepticMode ? 'Skeptic Mode: ON' : 'Skeptic Mode'}
          </button>
        </div>
        {skepticMode && (
          <div className="mb-8 border-l-2 border-brick px-4 py-3 bg-brick/10">
            <p className="font-mono text-xs text-brick/80">
              Skeptic Mode does not weaken the argument. It shows its work.
              Caveats, methodology notes, and study limitations are now visible.
            </p>
          </div>
        )}
        <p className="font-serif italic text-fog/60">
          Sources, statistics, and methodology loading…
        </p>
      </motion.div>
    </main>
  )
}
