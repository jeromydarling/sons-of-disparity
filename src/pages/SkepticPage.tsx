import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function SkepticPage() {
  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto">
        <Link to="/data" className="font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors mb-12 block">← Data</Link>
        <h1 className="font-serif text-4xl font-light text-marble mb-6">Skeptic Mode</h1>
        <p className="font-serif text-fog/70">Methodology, caveats, and source quality ratings for every statistic in this project.</p>
      </motion.div>
    </main>
  )
}
