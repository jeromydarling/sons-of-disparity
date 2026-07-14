import type { Statistic } from '../types'
import { useSkepticMode } from '../context/SkepticModeContext'
import { analytics } from '../analytics/ga'

interface StatCardProps {
  stat: Statistic
  /** extra classes on the outer card (e.g. the scroll-in animation hook) */
  className?: string
}

/**
 * A single sourced statistic. When Skeptic Mode is on, the caveat renders
 * below the card — the argument shows its work.
 */
export default function StatCard({ stat, className = '' }: StatCardProps) {
  const { skepticMode } = useSkepticMode()

  return (
    <div className={`stat-card ${className}`}>
      <div className="stat-value">{stat.value_text}</div>
      <div className="stat-label">{stat.short_claim}</div>
      {stat.detail_text && (
        <p className="mt-2 font-serif text-sm text-marble/60 leading-relaxed">
          {stat.detail_text}
        </p>
      )}
      {stat.source_title && (
        <div className="mt-3">
          <a
            href={stat.source_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
            onClick={() => analytics.sourceOpened(stat.source_id ?? stat.slug)}
          >
            {stat.source_title}
          </a>
        </div>
      )}
      {skepticMode && stat.skeptic_caveat && (
        <div className="mt-3 border-l-2 border-brick/60 pl-3">
          <p className="font-mono text-[11px] leading-relaxed text-fog">
            <span className="text-brick/90 uppercase tracking-wider">Caveat — </span>
            {stat.skeptic_caveat}
          </p>
        </div>
      )}
    </div>
  )
}
