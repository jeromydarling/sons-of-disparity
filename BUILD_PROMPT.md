# BUILD_PROMPT: Sons of Disparity

This is the exhaustive Claude Code specification for `sons-of-disparity`.
The scaffold already exists. Use this to complete the full experience.

## Stack
- React 19 + Vite + TypeScript + Tailwind CSS
- GSAP ScrollTrigger + Lenis + Framer Motion
- Cloudflare Workers + Static Assets (Vite plugin)
- Cloudflare D1 (`DB` binding)
- Cloudflare R2 (`MEDIA_BUCKET` binding)
- Hono (API Worker at `src/worker/index.ts`)
- GA4 (dedicated property — set `VITE_GA4_MEASUREMENT_ID` in `.env.local`)

## Before You Start
1. Copy `.env.example` to `.env.local`
2. Set `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX` (your dedicated property)
3. Run `npm install`
4. Run `wrangler d1 create sons-of-disparity-db` and update `wrangler.toml` with the database ID
5. Run `npm run db:migrate` to apply `src/db/schema.sql`
6. Run `npm run dev`

## Phase 1: Complete the Loading Experience
The `index.html` preloader is already wired with number flashes + phrase reveal.
Extend `src/main.tsx` to call `window.__dismissPreloader()` only after a minimum of
2200ms OR when all critical data is loaded, whichever is later.
Add a `usePreloader` hook at `src/hooks/usePreloader.ts`.

## Phase 2: Lenis Smooth Scroll Setup
Create `src/hooks/useLenis.ts`.
- Initialize Lenis with `lerp: 0.1, duration: 1.2`
- Integrate with GSAP ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- Expose `updateLerp(value: number)` for per-act friction control
- Use `gsap.matchMedia()` to disable Lenis for `prefers-reduced-motion`
Call `useLenis()` at the top level of `StoryPage`.

## Phase 3: Story Acts with Scroll Triggers
In `StoryPage`, fetch acts from `/api/acts`.
For each act, render a `<ScrollAct />` component.

### `<ScrollAct />` props:
```ts
interface ScrollActProps {
  act: StoryAct
  onEnter: (actNumber: number) => void
  onLeave: (actNumber: number) => void
}
```

### Behavior:
- Background: `<video autoPlay loop muted playsInline>` using `act.higgsfield_loop_url`
  OR a dark gradient fallback (`bg-gradient-to-b from-bruise to-asphalt`)
- Video overlay: `bg-gradient-to-r from-asphalt/90 via-asphalt/70 to-transparent`
- Text scrolls over video in a max-w-2xl column
- Stat cards animate in from the right margin at `scrollTrigger: { start: 'top 60%' }`
- For Act 5 (prison chapter): drop Lenis lerp to `0.03`, narrow text column to `max-w-sm`,
  desaturate background

## Phase 4: The Record Follows
Create `src/components/RecordFollows.tsx`.
This is a sticky document that morphs as the user scrolls through acts.

Stages (in order):
1. Birth Certificate
2. School Discipline File
3. Arrest Report
4. Plea Agreement
5. Prison ID Card
6. Job Application (with pre-checked felony box)

Each stage is an SVG outline. Use Framer Motion `layoutId` for morphing transitions.
Track stage changes with `analytics.recordMorphed(stage)`.

Deploy as:
- Sticky right-rail on desktop (visible at `lg:` breakpoint)
- Interstitial full-screen panel on mobile between acts
- Standalone at `/record` route

## Phase 5: The Counterfactual Fork
Create `src/components/TheSameMistake.tsx`.
Render in Act 4 (The Plea).

Fetch from `/api/statistics?act=4` and `/api/sources`.
Split-screen: LEFT = Deon (Black, 19, no priors), RIGHT = Tyler (white, 19, no priors).
Same charge. Animate the divergence:
- Charge reduction: Tyler 63.9% → Deon 50.7%
- Incarceration risk for misdemeanor: Tyler avoids 75% more often
- Sentence length if convicted: Tyler ~10% shorter

Use GSAP `to()` animations triggered by scroll.
Always show source attribution below each stat.

## Phase 6: Compare Lives Calculator
Create `src/components/CompareLives.tsx` (also used by `/compare` route).

Inputs (Phase 1, simple set):
- Poverty level (below poverty line / near poverty / above)
- School discipline history (none / one suspension / multiple)
- Bail availability (could afford / could not afford)
- Charge type (felony / misdemeanor)

Outputs: structural risk exposure ranges sourced from D1 `statistics` table.
Always show: “These are statistical ranges, not predictions about individuals.”
Track with `analytics.compareLivesRun()`.

## Phase 7: Cinema Mode — /watch
Complete `src/pages/WatchPage.tsx`.

Create `src/components/CinematicPlayer.tsx`.

Behavior:
- Full-screen video player
- Plays ElevenLabs narration as separate `<audio>` track synced to `video.currentTime`
- Uses GSAP timeline synced to `audio.currentTime` to trigger `<StatOverlay />` at exact timestamps
  stored in D1 `video_scene_statistics.timestamp_start_seconds`
- Chapter markers below the scrubber
- Captions (`<track kind="subtitles">` using WebVTT from `transcript_text`)
- Transcript drawer (slide up from bottom)
- Evidence Pause: when a stat overlay is clicked, the video pauses and a source card expands
- Keyboard: Space = play/pause, C = captions, T = transcript, S = skeptic source card
- All interactions tracked via `analytics.*` functions

For now, render a styled placeholder if `video_url` is null.
Design for easy swap-in once Higgsfield assets are ready.

## Phase 8: Skeptic Mode Integration
SkepticMode context is already wired. Integrate it:
- In `<ScrollAct />`: show `stat.skeptic_caveat` below each stat card when enabled
- In `<DataPage />`: show `source.methodology_note` for each source
- In `<CinematicPlayer />`: show source cards with methodology when evidence pause is opened
- Add a floating Skeptic Mode toggle button to `StoryPage` and `WatchPage`

## GA4 Setup Reminder
Set `VITE_GA4_MEASUREMENT_ID` in `.env.local`.
All analytics calls are already wired in `src/analytics/ga.ts`.
Optional: add `VITE_CROS_GA4_ID=G-RKF41M29QE` to dual-send events to the CROS Family aggregate.

## Style Rules
- Font: `Fraunces` (serif, literary) for prose; `IBM Plex Mono` for stats/data/UI labels
- Colors: asphalt `#111111`, bruise `#2A1C26`, brick `#7A2E2A`, marble `#D8D3C7`, fog `#6B6B6B`, seedling `#3F6B45`
- Green (`seedling`) appears ONLY in Act 7 / the final nursery scene
- Selection color: brick background
- No bright colors until the ending

## Higgsfield Visual Style (for video assets)
Base prompt:
> Stylized black and white silhouette animation, restrained urban documentary tone, paper-cut shadows, soft film grain, high contrast but gentle edges, realistic human movement, no exaggerated drama, no violence shown directly, dignified portrayal, American city neighborhood, streetlight glow, shallow depth, slow camera movement, minimal color, analog texture, believable, quiet, humane

Negative prompt:
> No photorealistic faces, no gore, no guns pointed at camera, no sensational crime drama, no flashy police lights, no comic book style, no horror style, no caricature, no text artifacts

Color rule: pure B&W throughout. Muted seedling green ONLY in the final nursery scene.

## Ethical Guardrail
> The system is on trial. Not the neighborhood. Not the mother. Not the boy.

Every design decision should honor this.
