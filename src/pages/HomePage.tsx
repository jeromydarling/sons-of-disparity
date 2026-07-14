import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { analytics } from '../analytics/ga'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-asphalt flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        className="max-w-2xl"
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-fog mb-8">
          A narrative in three modes
        </p>

        <h1 className="font-serif text-5xl md:text-7xl font-light text-marble leading-tight mb-6">
          Sons of Disparity
        </h1>

        <p className="font-serif italic text-lg text-fog/80 mb-14 leading-relaxed">
          One fictional life. Every number real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/story"
            onClick={() => analytics.modeSelected('scroll')}
            className="group px-8 py-4 border border-marble/30 text-marble font-mono text-sm
                       tracking-wider uppercase hover:bg-marble hover:text-asphalt
                       transition-all duration-300"
          >
            Scroll the Record
          </Link>
          <Link
            to="/watch"
            onClick={() => analytics.modeSelected('watch')}
            className="group px-8 py-4 border border-fog/20 text-fog font-mono text-sm
                       tracking-wider uppercase hover:border-marble/30 hover:text-marble
                       transition-all duration-300"
          >
            Watch the Story
          </Link>
          <Link
            to="/data"
            onClick={() => analytics.modeSelected('data')}
            className="group px-8 py-4 border border-fog/20 text-fog font-mono text-sm
                       tracking-wider uppercase hover:border-marble/30 hover:text-marble
                       transition-all duration-300"
          >
            Explore the Data
          </Link>
        </div>

        <p className="mt-16 font-mono text-xs text-fog/30 tracking-widest uppercase">
          Deon isn’t real. Every number that made him is.
        </p>
      </motion.div>
    </main>
  )
}
