import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {
  ACTS,
  SOURCES,
  STATISTICS,
  VIDEO_SCENES,
  VIDEO_SCENE_STATISTICS,
} from '../data/content'

type Bindings = {
  DB: D1Database
  MEDIA_BUCKET: R2Bucket
  ASSETS: Fetcher
  GA4_MEASUREMENT_ID: string
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

// D1 may be unmigrated or unbound (fresh clone, local dev). Every read
// endpoint falls back to the bundled content module so the experience
// never renders empty.
async function withFallback<T>(fallback: T[], query: () => Promise<T[]>): Promise<T[]> {
  try {
    const rows = await query()
    return rows.length > 0 ? rows : fallback
  } catch {
    return fallback
  }
}

// Health
app.get('/api/health', (c) => c.json({ ok: true, ts: Date.now() }))

// Story acts
app.get('/api/acts', async (c) => {
  const rows = await withFallback(ACTS, async () => {
    const result = await c.env.DB.prepare(
      'SELECT * FROM story_acts ORDER BY act_number ASC'
    ).all()
    return result.results as unknown as typeof ACTS
  })
  return c.json(rows)
})

app.get('/api/acts/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const result = await c.env.DB.prepare('SELECT * FROM story_acts WHERE slug = ?')
      .bind(slug)
      .first()
    if (result) return c.json(result)
  } catch {
    // fall through to bundled content
  }
  const fallback = ACTS.find((a) => a.slug === slug)
  if (!fallback) return c.json({ error: 'Not found' }, 404)
  return c.json(fallback)
})

// Statistics (optionally filtered by act; joined with source title/url)
app.get('/api/statistics', async (c) => {
  const actNumber = c.req.query('act')
  const fallback = (
    actNumber ? STATISTICS.filter((s) => s.act_number === Number(actNumber)) : STATISTICS
  ).map((s) => {
    const src = SOURCES.find((x) => x.id === s.source_id)
    return { ...s, source_title: src?.title ?? null, source_url: src?.url ?? null }
  })
  const rows = await withFallback(fallback, async () => {
    const query = actNumber
      ? 'SELECT s.*, src.title as source_title, src.url as source_url FROM statistics s LEFT JOIN sources src ON s.source_id = src.id WHERE s.act_number = ? ORDER BY s.id'
      : 'SELECT s.*, src.title as source_title, src.url as source_url FROM statistics s LEFT JOIN sources src ON s.source_id = src.id ORDER BY s.act_number'
    const stmt = actNumber
      ? c.env.DB.prepare(query).bind(Number(actNumber))
      : c.env.DB.prepare(query)
    const result = await stmt.all()
    return result.results as unknown as typeof fallback
  })
  return c.json(rows)
})

// Sources
app.get('/api/sources', async (c) => {
  const rows = await withFallback(SOURCES, async () => {
    const result = await c.env.DB.prepare('SELECT * FROM sources ORDER BY publisher').all()
    return result.results as unknown as typeof SOURCES
  })
  return c.json(rows)
})

// Video scenes
app.get('/api/video-scenes', async (c) => {
  const rows = await withFallback(VIDEO_SCENES, async () => {
    const result = await c.env.DB.prepare(
      'SELECT * FROM video_scenes ORDER BY sequence ASC'
    ).all()
    return result.results as unknown as typeof VIDEO_SCENES
  })
  return c.json(rows)
})

// Scene ↔ statistic timestamps (drives cinema-mode stat overlays)
app.get('/api/video-scene-statistics', async (c) => {
  const rows = await withFallback(VIDEO_SCENE_STATISTICS, async () => {
    const result = await c.env.DB.prepare(
      'SELECT * FROM video_scene_statistics ORDER BY video_scene_id, timestamp_start_seconds'
    ).all()
    return result.results as unknown as typeof VIDEO_SCENE_STATISTICS
  })
  return c.json(rows)
})

// Loading phrase (random)
app.get('/api/loading-phrase', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      'SELECT phrase FROM loading_phrases ORDER BY RANDOM() LIMIT 1'
    ).first()
    if (result) return c.json(result)
  } catch {
    // fall through
  }
  return c.json({ phrase: 'He is not born guilty. But the record is already open.' })
})

// Media proxy — serves R2 objects (Higgsfield loops, ElevenLabs narration)
app.get('/api/media/:key{.+}', async (c) => {
  const key = c.req.param('key')
  try {
    const obj = await c.env.MEDIA_BUCKET.get(key)
    if (!obj) return c.json({ error: 'Not found' }, 404)
    const headers = new Headers()
    obj.writeHttpMetadata(headers)
    headers.set('etag', obj.httpEtag)
    headers.set('cache-control', 'public, max-age=31536000, immutable')
    return new Response(obj.body as unknown as BodyInit, { headers })
  } catch {
    return c.json({ error: 'Media unavailable' }, 503)
  }
})

// Everything else is the SPA — hand off to static assets, whose
// single-page-application not_found_handling serves index.html for routes.
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
