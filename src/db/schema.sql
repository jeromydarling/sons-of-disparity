-- Sons of Disparity — D1 Schema
-- Run: npm run db:migrate

CREATE TABLE IF NOT EXISTS story_acts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  act_number INTEGER NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  body_mdx TEXT NOT NULL,
  lenis_lerp REAL NOT NULL DEFAULT 0.1,
  higgsfield_loop_url TEXT,
  higgsfield_loop_url_b TEXT,
  poster_url TEXT,
  elevenlabs_audio_url TEXT,
  palette TEXT DEFAULT 'dark',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS statistics (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  act_number INTEGER NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_claim TEXT NOT NULL,
  value_text TEXT NOT NULL,
  detail_text TEXT,
  source_id TEXT,
  skeptic_caveat TEXT,
  display_style TEXT DEFAULT 'card',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  title TEXT NOT NULL,
  publisher TEXT NOT NULL,
  url TEXT NOT NULL,
  year INTEGER,
  methodology_note TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS counterfactuals (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  act_number INTEGER NOT NULL,
  trigger_event TEXT NOT NULL,
  black_outcome TEXT NOT NULL,
  white_outcome TEXT NOT NULL,
  disparity_note TEXT,
  source_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loading_phrases (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  phrase TEXT NOT NULL,
  weight INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS video_scenes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  chapter_slug TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  duration_seconds REAL,
  video_url TEXT,
  video_url_b TEXT,
  poster_url TEXT,
  transcript_text TEXT,
  narration_audio_url TEXT,
  higgsfield_prompt TEXT,
  elevenlabs_voice_id TEXT,
  status TEXT DEFAULT 'planned',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS video_scene_statistics (
  video_scene_id TEXT NOT NULL,
  statistic_id TEXT NOT NULL,
  timestamp_start_seconds REAL,
  timestamp_end_seconds REAL,
  display_mode TEXT DEFAULT 'overlay',
  PRIMARY KEY (video_scene_id, statistic_id)
);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  asset_type TEXT NOT NULL,
  provider TEXT,
  title TEXT,
  url TEXT NOT NULL,
  r2_key TEXT,
  mime_type TEXT,
  duration_seconds REAL,
  generation_prompt TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS narration_tracks (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  scene_id TEXT NOT NULL,
  provider TEXT DEFAULT 'elevenlabs',
  voice_id TEXT,
  audio_url TEXT NOT NULL,
  transcript TEXT NOT NULL,
  duration_seconds REAL,
  is_final INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Seed: loading phrases
INSERT OR IGNORE INTO loading_phrases (id, phrase, weight) VALUES
  ('lp1', 'He is not born guilty. But the record is already open.', 5),
  ('lp2', 'The odds were assembled before he had a name.', 4),
  ('lp3', 'Two boys. One charge. Different futures.', 4),
  ('lp4', 'The numbers do not lie. They were never asked to.', 3),
  ('lp5', 'Deon is not real. Every number that made him is.', 5);
