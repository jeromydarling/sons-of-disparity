// Generates src/db/seed.sql from src/data/content.ts so the bundled fallback
// content and the D1 database can never drift apart.
// Run: npm run db:seed:generate  (requires Node 22+ for type stripping)

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const content = await import(resolve(here, '../src/data/content.ts'))
const { ACTS, SOURCES, STATISTICS, VIDEO_SCENES, VIDEO_SCENE_STATISTICS } = content

const q = v => {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'number') return String(v)
  return `'${String(v).replace(/'/g, "''")}'`
}

const insert = (table, rows, cols) =>
  rows
    .map(
      r =>
        `INSERT OR REPLACE INTO ${table} (${cols.join(', ')}) VALUES (${cols
          .map(c => q(r[c]))
          .join(', ')});`
    )
    .join('\n')

const sql = `-- Sons of Disparity — D1 seed data
-- GENERATED FILE — do not edit by hand.
-- Source of truth: src/data/content.ts
-- Regenerate: npm run db:seed:generate

${insert('sources', SOURCES, ['id', 'title', 'publisher', 'url', 'year', 'methodology_note'])}

${insert('statistics', STATISTICS, [
  'id',
  'act_number',
  'slug',
  'short_claim',
  'value_text',
  'detail_text',
  'source_id',
  'skeptic_caveat',
  'display_style',
])}

${insert('story_acts', ACTS, [
  'id',
  'act_number',
  'slug',
  'title',
  'subtitle',
  'body_mdx',
  'lenis_lerp',
  'higgsfield_loop_url',
  'poster_url',
  'elevenlabs_audio_url',
  'palette',
])}

${insert('video_scenes', VIDEO_SCENES, [
  'id',
  'slug',
  'title',
  'chapter_slug',
  'sequence',
  'duration_seconds',
  'video_url',
  'poster_url',
  'transcript_text',
  'narration_audio_url',
  'higgsfield_prompt',
  'elevenlabs_voice_id',
  'status',
])}

${insert('video_scene_statistics', VIDEO_SCENE_STATISTICS, [
  'video_scene_id',
  'statistic_id',
  'timestamp_start_seconds',
  'timestamp_end_seconds',
  'display_mode',
])}
`

const out = resolve(here, '../src/db/seed.sql')
writeFileSync(out, sql)
console.log(`Wrote ${out}`)
