import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RECORD_STAGES } from '../types'
import { analytics } from '../analytics/ga'

export const RECORD_STAGE_LABELS = [
  'Birth Certificate',
  'School Discipline File',
  'Arrest Report',
  'Plea Agreement',
  'Prison ID Card',
  'Job Application',
] as const

interface RecordFollowsProps {
  /** 0..5 — which document the record has become */
  stage: number
  /** rail: sticky desktop right-rail · panel: mobile interstitial · standalone: /record */
  variant?: 'rail' | 'panel' | 'standalone'
  /** Namespace for layoutIds when multiple instances coexist */
  layoutPrefix?: string
}

const S = '#D8D3C7' // marble stroke
const B = '#7A2E2A' // brick accents

/* --- shared svg fragments ------------------------------------------------ */

const Lines = ({ x, y, widths, gap = 12 }: { x: number; y: number; widths: number[]; gap?: number }) => (
  <g stroke={S} strokeOpacity={0.35} strokeWidth={1.5}>
    {widths.map((w, i) => (
      <line key={i} x1={x} y1={y + i * gap} x2={x + w} y2={y + i * gap} />
    ))}
  </g>
)

const Title = ({ text, y = 34 }: { text: string; y?: number }) => (
  <text
    x={100}
    y={y}
    textAnchor="middle"
    fill={S}
    fillOpacity={0.85}
    fontFamily="'IBM Plex Mono', monospace"
    fontSize={9}
    letterSpacing={1.5}
  >
    {text}
  </text>
)

/* --- the six documents --------------------------------------------------- */

function BirthCertificate() {
  return (
    <>
      <rect x={22} y={20} width={156} height={220} fill="none" stroke={S} strokeOpacity={0.4} strokeWidth={1} />
      <Title text="CERTIFICATE OF" y={44} />
      <Title text="LIVE BIRTH" y={57} />
      <Lines x={40} y={84} widths={[120, 96, 110, 82]} gap={16} />
      {/* infant footprint */}
      <ellipse cx={72} cy={186} rx={13} ry={20} fill={S} fillOpacity={0.18} />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={62 + i * 5.5} cy={162 - Math.abs(i - 2) * 1.5} r={2.4} fill={S} fillOpacity={0.18} />
      ))}
      {/* seal */}
      <circle cx={140} cy={192} r={18} fill="none" stroke={S} strokeOpacity={0.4} strokeWidth={1} strokeDasharray="3 2" />
      <circle cx={140} cy={192} r={11} fill="none" stroke={S} strokeOpacity={0.3} strokeWidth={1} />
    </>
  )
}

function DisciplineFile() {
  return (
    <>
      {/* folder tab */}
      <path d="M30 40 h44 l8 -10 h34 v10" fill="none" stroke={S} strokeOpacity={0.5} strokeWidth={1.5} />
      <rect x={30} y={40} width={140} height={190} fill="none" stroke={S} strokeOpacity={0.5} strokeWidth={1.5} />
      <Title text="DISCIPLINE REPORT" y={62} />
      <Lines x={46} y={82} widths={[108, 84, 100]} gap={14} />
      {/* incident checkboxes */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={46} y={130 + i * 22} width={10} height={10} fill="none" stroke={S} strokeOpacity={0.5} strokeWidth={1.2} />
          {i === 0 && (
            <path d={`M47 ${132} l8 7 M55 ${131} l-8 8`} stroke={B} strokeWidth={1.6} />
          )}
          <line x1={64} y1={135 + i * 22} x2={150} y2={135 + i * 22} stroke={S} strokeOpacity={0.3} strokeWidth={1.5} />
        </g>
      ))}
      {/* "pattern" stamp */}
      <g transform="rotate(-8 100 208)">
        <rect x={62} y={198} width={76} height={20} fill="none" stroke={B} strokeOpacity={0.8} strokeWidth={1.2} />
        <text x={100} y={212} textAnchor="middle" fill={B} fontFamily="'IBM Plex Mono', monospace" fontSize={9} letterSpacing={2}>
          PATTERN
        </text>
      </g>
    </>
  )
}

function ArrestReport() {
  return (
    <>
      <rect x={26} y={24} width={148} height={212} fill="none" stroke={S} strokeOpacity={0.5} strokeWidth={1.5} />
      <Title text="ARREST REPORT" y={46} />
      {/* mugshot */}
      <rect x={42} y={60} width={52} height={62} fill="none" stroke={S} strokeOpacity={0.45} strokeWidth={1.2} />
      <path
        d="M68 74 a9 10 0 1 1 -0.1 0 M52 122 q16 -22 32 0"
        fill={S}
        fillOpacity={0.16}
        stroke={S}
        strokeOpacity={0.3}
        strokeWidth={1}
      />
      {/* height lines behind */}
      <Lines x={42} y={70} widths={[0]} />
      <Lines x={104} y={68} widths={[56, 56, 40, 48]} gap={14} />
      {/* fingerprint */}
      <g fill="none" stroke={S} strokeOpacity={0.4} strokeWidth={1}>
        {[4, 8, 12, 16].map((r) => (
          <ellipse key={r} cx={64} cy={176} rx={r} ry={r * 1.25} />
        ))}
      </g>
      <Lines x={104} y={152} widths={[52, 44]} gap={14} />
      <text x={104} y={214} fill={S} fillOpacity={0.5} fontFamily="'IBM Plex Mono', monospace" fontSize={8} letterSpacing={1}>
        CASE №2019-0611
      </text>
    </>
  )
}

function PleaAgreement() {
  return (
    <>
      <rect x={26} y={24} width={148} height={212} fill="none" stroke={S} strokeOpacity={0.5} strokeWidth={1.5} />
      <Title text="PLEA AGREEMENT" y={46} />
      <Lines x={42} y={64} widths={[116, 116, 104, 116, 92, 116, 110, 74]} gap={11} />
      <text x={42} y={168} fill={B} fontFamily="'IBM Plex Mono', monospace" fontSize={8} letterSpacing={2}>
        COUNT 1 — GUILTY
      </text>
      {/* signature */}
      <path
        d="M46 206 q10 -14 18 -2 t16 -4 t14 2 q8 -8 14 -1"
        fill="none"
        stroke={S}
        strokeOpacity={0.6}
        strokeWidth={1.2}
      />
      <line x1={42} y1={212} x2={158} y2={212} stroke={S} strokeOpacity={0.4} strokeWidth={1} />
      <text x={42} y={224} fill={S} fillOpacity={0.4} fontFamily="'IBM Plex Mono', monospace" fontSize={7} letterSpacing={1}>
        DEFENDANT SIGNATURE
      </text>
    </>
  )
}

function PrisonId() {
  return (
    <>
      {/* landscape card centered on the page */}
      <rect x={30} y={72} width={140} height={96} rx={4} fill="none" stroke={S} strokeOpacity={0.55} strokeWidth={1.5} />
      <text x={44} y={92} fill={S} fillOpacity={0.7} fontFamily="'IBM Plex Mono', monospace" fontSize={8} letterSpacing={2}>
        DEPT. OF CORRECTIONS
      </text>
      <rect x={44} y={100} width={34} height={44} fill="none" stroke={S} strokeOpacity={0.4} strokeWidth={1} />
      <path
        d="M61 112 a6 7 0 1 1 -0.1 0 M50 144 q11 -15 22 0"
        fill={S}
        fillOpacity={0.16}
        stroke={S}
        strokeOpacity={0.3}
        strokeWidth={1}
      />
      <Lines x={88} y={108} widths={[64, 48, 56]} gap={13} />
      <text x={88} y={152} fill={B} fontFamily="'IBM Plex Mono', monospace" fontSize={9} letterSpacing={1.5}>
        №31-2020-D
      </text>
      {/* barcode */}
      <g stroke={S} strokeOpacity={0.6}>
        {[0, 3, 5, 9, 12, 16, 18, 23, 26, 28, 33, 37, 40, 44, 47, 52, 55, 59, 63, 66, 70, 75, 78, 84, 88, 92].map((x) => (
          <line key={x} x1={44 + x} y1={178} x2={44 + x} y2={196} strokeWidth={x % 3 === 0 ? 2 : 1} />
        ))}
      </g>
    </>
  )
}

function JobApplication() {
  return (
    <>
      <rect x={26} y={24} width={148} height={212} fill="none" stroke={S} strokeOpacity={0.5} strokeWidth={1.5} />
      <Title text="EMPLOYMENT APPLICATION" y={46} />
      <Lines x={42} y={64} widths={[116, 98, 116, 84]} gap={13} />
      {/* the box — pre-checked */}
      <rect x={42} y={128} width={116} height={44} fill="none" stroke={B} strokeOpacity={0.9} strokeWidth={1.5} />
      <text x={50} y={144} fill={S} fillOpacity={0.75} fontFamily="'IBM Plex Mono', monospace" fontSize={7.5} letterSpacing={0.5}>
        Have you ever been
      </text>
      <text x={50} y={154} fill={S} fillOpacity={0.75} fontFamily="'IBM Plex Mono', monospace" fontSize={7.5} letterSpacing={0.5}>
        convicted of a felony?
      </text>
      <rect x={50} y={158} width={9} height={9} fill="none" stroke={B} strokeWidth={1.4} />
      <path d="M51 159 l7 7 M58 159 l-7 7" stroke={B} strokeWidth={1.6} />
      <text x={64} y={166} fill={B} fontFamily="'IBM Plex Mono', monospace" fontSize={8} letterSpacing={1}>
        YES
      </text>
      <Lines x={42} y={190} widths={[116, 102, 116]} gap={13} />
    </>
  )
}

const STAGE_SVGS = [BirthCertificate, DisciplineFile, ArrestReport, PleaAgreement, PrisonId, JobApplication]

/* --- component ------------------------------------------------------------ */

export default function RecordFollows({ stage, variant = 'rail', layoutPrefix = 'record' }: RecordFollowsProps) {
  const clamped = Math.max(0, Math.min(stage, RECORD_STAGES.length - 1))
  const Doc = STAGE_SVGS[clamped]
  const prevStage = useRef<number | null>(null)

  useEffect(() => {
    if (prevStage.current !== null && prevStage.current !== clamped) {
      analytics.recordMorphed(RECORD_STAGES[clamped])
    }
    prevStage.current = clamped
  }, [clamped])

  const sizes = {
    rail: 'w-44',
    panel: 'w-56',
    standalone: 'w-64 md:w-72',
  } as const

  return (
    <figure className={`${sizes[variant]} select-none`} aria-label={`The record: ${RECORD_STAGE_LABELS[clamped]}`}>
      {/* The paper persists across stages — the contents morph */}
      <motion.div
        layoutId={`${layoutPrefix}-paper`}
        layout
        className="relative bg-charcoal/90 border border-fog/20 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.svg
            key={clamped}
            viewBox="0 0 200 260"
            className="block w-full h-auto"
            initial={{ opacity: 0, y: 10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Doc />
          </motion.svg>
        </AnimatePresence>
      </motion.div>

      <motion.figcaption
        layoutId={`${layoutPrefix}-label`}
        className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-fog"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={clamped}
            className="block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {String(clamped + 1).padStart(2, '0')} · {RECORD_STAGE_LABELS[clamped]}
          </motion.span>
        </AnimatePresence>
      </motion.figcaption>
    </figure>
  )
}
