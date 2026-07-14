# Sons of Disparity

A three-mode narrative experience exploring racial disparity in the American criminal justice system.

- **Read** — Immersive scrollytelling with animated data
- **Watch** — Stylized B&W silhouette animated short with ElevenLabs narration
- **Explore** — Statistical powerhouse, Skeptic Mode, Compare Lives

## Stack

- React 19 + Vite + TypeScript + Tailwind CSS
- GSAP ScrollTrigger + Lenis + Framer Motion
- Cloudflare Workers + Static Assets (Vite plugin)
- Cloudflare D1 (database)
- Cloudflare R2 (video/audio assets)
- Hono (API Worker)
- GA4 (dedicated property)

## Dev

```bash
cp .env.example .env.local   # set VITE_GA4_MEASUREMENT_ID
npm install
npm run db:migrate           # apply schema + seed to the local D1
npm run dev
```

The app works even without a migrated database: the Worker and the client both
fall back to the bundled content module (`src/data/content.ts`).

## Content & data

`src/data/content.ts` is the single source of truth for acts, statistics,
sources, and video scenes. After editing it, regenerate the D1 seed:

```bash
npm run db:seed:generate     # rewrites src/db/seed.sql
npm run db:migrate           # local
npm run db:migrate:prod      # remote (requires a real database_id in wrangler.toml)
```

## Deploy

```bash
# one-time: wrangler d1 create sons-of-disparity-db → set database_id in wrangler.toml
npm run deploy
npm run db:migrate:prod
```

## Media assets

Higgsfield loops and ElevenLabs narration are pending. Swap them in by filling
`story_acts.higgsfield_loop_url`, `video_scenes.video_url`, and
`video_scenes.narration_audio_url` (upload to R2 and serve via `/api/media/:key`).
Cinema mode plays a storyboard placeholder with the full timing/overlay system
until then.

> *He is not born guilty. But the record is already open.*
