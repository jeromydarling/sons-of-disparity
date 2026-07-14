import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Link to="/" className="font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors mb-12 block">
          ← Sons of Disparity
        </Link>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-fog mb-4">Act I</p>
        <h1 className="font-serif text-4xl font-light text-marble mb-8 leading-tight">
          Before He Has a Name
        </h1>
        <div className="prose prose-invert prose-lg max-w-none font-serif text-marble/80 leading-relaxed space-y-6">
          <p>
            The boy was called Deon. He was born in 2001, in an apartment on the north side
            of a city that looked like a lot of American cities — old industry, new neglect,
            neighborhoods where the map turns gray.
          </p>
          <p>
            His grandmother called him watchful. She meant it as a compliment.
          </p>
          <p>
            He watched everything from the window of the apartment where four people lived
            in three rooms. He watched the block below, which was beautiful and dangerous
            in the way that blocks like that are always both.
          </p>
        </div>
        <div className="mt-16 stat-card max-w-xs">
          <div className="stat-value">28.5%</div>
          <div className="stat-label">Black child poverty rate (2023)</div>
        </div>
      </motion.div>
    </main>
  )
}
