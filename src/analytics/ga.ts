// Google Analytics 4 — Sons of Disparity dedicated property
// Replace GA4_MEASUREMENT_ID with your actual G-XXXXXXXXXX value

const GA4_ID = (import.meta.env.VITE_GA4_MEASUREMENT_ID as string) || 'G-REPLACE_ME'

export function initGA4() {
  if (typeof window === 'undefined') return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) { window.dataLayer.push(args) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA4_ID, {
    send_page_view: true,
    custom_map: { dimension1: 'mode', dimension2: 'act_number' },
  })
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', event, params)
}

export const analytics = {
  modeSelected:       (mode: 'scroll' | 'watch' | 'data') => track('mode_selected', { mode }),
  actReached:         (actNumber: number, slug: string) => track('act_reached', { act_number: actNumber, slug }),
  actCompleted:       (actNumber: number) => track('act_completed', { act_number: actNumber }),
  skepticToggled:     (on: boolean) => track('skeptic_toggled', { enabled: on }),
  sourceOpened:       (sourceId: string) => track('source_opened', { source_id: sourceId }),
  recordMorphed:      (stage: string) => track('record_morphed', { stage }),
  compareLivesRun:    () => track('compare_lives_run'),
  videoStarted:       () => track('video_started'),
  videoProgress:      (pct: 25 | 50 | 75) => track(`video_progress_${pct}`),
  videoCompleted:     () => track('video_completed'),
  videoSceneReached:  (slug: string) => track('video_scene_reached', { slug }),
  captionsEnabled:    () => track('captions_enabled'),
  transcriptOpened:   () => track('transcript_opened'),
  evidencePauseOpened:(statSlug: string) => track('evidence_pause_opened', { stat_slug: statSlug }),
  watchToData:        () => track('watch_to_data_clicked'),
  watchToStory:       () => track('watch_to_story_clicked'),
  narrationToggled:   (on: boolean) => track('narration_toggled', { enabled: on }),
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
    __dismissPreloader: () => void
  }
}
