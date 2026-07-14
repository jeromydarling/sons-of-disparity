import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto">
        <Link to="/" className="font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors mb-12 block">← Back</Link>
        <h1 className="font-serif text-4xl font-light text-marble mb-6">About</h1>
        <p className="font-serif text-fog/70 mb-4">Sons of Disparity is a data-driven narrative project. Every statistic is sourced. Every source is cited. The story is fiction. The numbers are not.</p>
        <p className="font-serif italic text-fog/40 text-sm">The system is on trial. Not the neighborhood. Not the mother. Not the boy.</p>
      </motion.div>
    </main>
  )
}
