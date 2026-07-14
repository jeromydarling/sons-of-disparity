import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto">
        <Link to="/" className="font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors mb-12 block">← Back</Link>
        <h1 className="font-serif text-4xl font-light text-marble mb-6">Compare Lives</h1>
        <p className="font-serif text-fog/70">Enter two profiles. Same charge. No prior record. See what the data says about different outcomes.</p>
      </motion.div>
    </main>
  )
}
