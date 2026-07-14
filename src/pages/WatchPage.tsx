import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function WatchPage() {
  return (
    <main className="min-h-screen bg-asphalt flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-xl"
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-fog mb-6">
          Cinema Mode
        </p>
        <h1 className="font-serif text-4xl font-light text-marble mb-4">
          Watch the Story
        </h1>
        <p className="font-serif italic text-fog/60 mb-10">
          A narrated silhouette film based on one fictional life
          and the real statistics behind it.
        </p>
        <div className="aspect-video w-full max-w-2xl bg-charcoal border border-fog/10 flex items-center justify-center mb-8">
          <p className="font-mono text-xs text-fog/30 uppercase tracking-widest">
            Video — Coming Soon
          </p>
        </div>
        <Link to="/" className="font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors">
          ← Back
        </Link>
      </motion.div>
    </main>
  )
}
