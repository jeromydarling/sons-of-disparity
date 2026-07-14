import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function RecordPage() {
  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-2xl mx-auto">
        <Link to="/" className="font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors mb-12 block">← Back</Link>
        <h1 className="font-serif text-4xl font-light text-marble mb-6">The Record Follows</h1>
        <p className="font-serif text-fog/70">A document that morphs across a life. Birth certificate. Discipline file. Arrest report. Plea deal. Prison ID. Job application.</p>
      </motion.div>
    </main>
  )
}
