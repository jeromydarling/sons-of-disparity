import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import RecordFollows, { RECORD_STAGE_LABELS } from '../components/RecordFollows'

const STAGE_NOTES = [
  'Every life opens the same way: a name, a weight, a time of day. Nothing on this page is his doing. Everything after it will be treated as if it were.',
  'The first document with his name and a judgment on it. Black students are 3.6× more likely to be suspended for the same behavior — and a discretionary suspension nearly triples the odds of justice-system contact within a year.',
  'A tail light, a search, a first arrest at nineteen. Black Americans are arrested at 2.8× the rate of white Americans, and searched at roughly twice the rate — with less found.',
  'Eleven minutes of counsel and nineteen days of detention make the deal look like a door. White defendants get the top charge reduced 63.9% of the time; Black defendants, 50.7%.',
  'Thirty-one months of counts, four a day. He is one of the 1 in 3 the state projected the year he was born.',
  'The box is on page one, above his name. A white applicant with a felony record gets more callbacks than a Black applicant with no record at all.',
]

export default function RecordPage() {
  const [stage, setStage] = useState(0)

  return (
    <main className="min-h-screen bg-asphalt px-6 py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl"
      >
        <Link
          to="/"
          className="mb-12 block font-mono text-xs uppercase tracking-wider text-fog/40 hover:text-fog transition-colors"
        >
          ← Sons of Disparity
        </Link>
        <h1 className="font-serif text-4xl font-light text-marble mb-3">The Record Follows</h1>
        <p className="font-serif italic text-fog/70 mb-12 max-w-xl">
          One document, six shapes. It is opened before he can read and consulted long after
          anyone reads the rest of him.
        </p>

        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center">
          <RecordFollows stage={stage} variant="standalone" layoutPrefix="standalone" />

          <div className="flex-1">
            <ol className="space-y-1">
              {RECORD_STAGE_LABELS.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => setStage(i)}
                    className={`w-full border-l-2 px-4 py-3 text-left transition-colors ${
                      i === stage
                        ? 'border-brick bg-brick/10 text-marble'
                        : 'border-fog/20 text-fog hover:border-fog/50 hover:text-marble/80'
                    }`}
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                      {String(i + 1).padStart(2, '0')} · {label}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-md font-serif text-marble/75 leading-relaxed">
              {STAGE_NOTES[stage]}
            </p>
          </div>
        </div>

        <p className="mt-16 font-mono text-xs text-fog/40">
          Statistics cited on this page are sourced on the{' '}
          <Link to="/data" className="source-link">
            Data page
          </Link>
          .
        </p>
      </motion.div>
    </main>
  )
}
