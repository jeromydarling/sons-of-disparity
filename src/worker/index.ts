import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
  MEDIA_BUCKET: R2Bucket
  GA4_MEASUREMENT_ID: string
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

// Health
app.get('/api/health', (c) => c.json({ ok: true, ts: Date.now() }))

// Story acts
app.get('/api/acts', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM story_acts ORDER BY act_number ASC'
  ).all()
  return c.json(result.results)
})

app.get('/api/acts/:slug', async (c) => {
  const slug = c.req.param('slug')
  const result = await c.env.DB.prepare(
    'SELECT * FROM story_acts WHERE slug = ?'
  ).bind(slug).first()
  if (!result) return c.json({ error: 'Not found' }, 404)
  return c.json(result)
})

// Statistics
app.get('/api/statistics', async (c) => {
  const actNumber = c.req.query('act')
  const query = actNumber
    ? 'SELECT s.*, src.title as source_title, src.url as source_url FROM statistics s LEFT JOIN sources src ON s.source_id = src.id WHERE s.act_number = ? ORDER BY s.id'
    : 'SELECT s.*, src.title as source_title, src.url as source_url FROM statistics s LEFT JOIN sources src ON s.source_id = src.id ORDER BY s.act_number'
  const stmt = actNumber
    ? c.env.DB.prepare(query).bind(Number(actNumber))
    : c.env.DB.prepare(query)
  const result = await stmt.all()
  return c.json(result.results)
})

// Sources
app.get('/api/sources', async (c) => {
  const result = await c.env.DB.prepare('SELECT * FROM sources ORDER BY publisher').all()
  return c.json(result.results)
})

// Video scenes
app.get('/api/video-scenes', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT * FROM video_scenes ORDER BY sequence ASC'
  ).all()
  return c.json(result.results)
})

// Loading phrase (random)
app.get('/api/loading-phrase', async (c) => {
  const result = await c.env.DB.prepare(
    'SELECT phrase FROM loading_phrases ORDER BY RANDOM() LIMIT 1'
  ).first()
  return c.json(result ?? { phrase: 'He is not born guilty. But the record is already open.' })
})

export default app
