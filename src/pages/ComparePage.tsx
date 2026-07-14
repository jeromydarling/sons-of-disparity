import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CompareLives from '../components/CompareLives'
import SkepticToggle from '../components/SkepticToggle'

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-2xl"
      >
        <Link
          to="/"
          className="mb-12 block font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors"
        >
          ← Sons of Disparity
        </Link>
        <h1 className="font-serif text-4xl font-light text-marble mb-4">Compare Lives</h1>
        <p className="font-serif text-fog/70 mb-12 max-w-xl leading-relaxed">
          Four structural facts about a childhood and a charge. Choose them, and see the exposure
          ranges the data assigns — before anyone has done anything.
        </p>
        <CompareLives />
      </motion.div>
      <SkepticToggle />
    </main>
  )
}
