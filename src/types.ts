// Shared domain types — mirror src/db/schema.sql

export interface StoryAct {
  id: string
  act_number: number
  slug: string
  title: string
  subtitle: string | null
  /** Prose paragraphs separated by blank lines */
  body_mdx: string
  lenis_lerp: number
  higgsfield_loop_url: string | null
  /** second composition of the same moment — crossfades with the first */
  higgsfield_loop_url_b?: string | null
  poster_url: string | null
  elevenlabs_audio_url: string | null
  palette: 'dark' | 'desaturated' | 'seedling' | string
}

export interface Statistic {
  id: string
  act_number: number
  slug: string
  short_claim: string
  value_text: string
  detail_text: string | null
  source_id: string | null
  skeptic_caveat: string | null
  display_style: string
  // joined by the API
  source_title?: string | null
  source_url?: string | null
}

export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  year: number | null
  methodology_note: string | null
}

export interface VideoScene {
  id: string
  slug: string
  title: string
  chapter_slug: string
  sequence: number
  duration_seconds: number | null
  video_url: string | null
  /** second composition — crossfades with the first while the scene plays */
  video_url_b?: string | null
  poster_url: string | null
  transcript_text: string | null
  narration_audio_url: string | null
  higgsfield_prompt: string | null
  elevenlabs_voice_id: string | null
  status: string
}

export interface VideoSceneStatistic {
  video_scene_id: string
  statistic_id: string
  timestamp_start_seconds: number | null
  timestamp_end_seconds: number | null
  display_mode: string
}

/** Stage indexes for The Record Follows */
export const RECORD_STAGES = [
  'birth-certificate',
  'school-discipline-file',
  'arrest-report',
  'plea-agreement',
  'prison-id-card',
  'job-application',
] as const

export type RecordStage = (typeof RECORD_STAGES)[number]
