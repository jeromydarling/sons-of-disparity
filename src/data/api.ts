// Thin fetch layer over the Worker API with graceful fallback to the
// bundled content module (used when D1 is empty or the API is unreachable).

import type { Source, Statistic, StoryAct, VideoScene, VideoSceneStatistic } from '../types'
import { ACTS, SOURCES, STATISTICS, VIDEO_SCENES, VIDEO_SCENE_STATISTICS } from './content'

const cache = new Map<string, Promise<unknown>>()

async function getJSON<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } })
    if (!res.ok) return fallback
    const data = (await res.json()) as T
    if (Array.isArray(data) && data.length === 0 && Array.isArray(fallback)) return fallback
    return data
  } catch {
    return fallback
  }
}

function cached<T>(url: string, fallback: T): Promise<T> {
  if (!cache.has(url)) cache.set(url, getJSON(url, fallback))
  return cache.get(url) as Promise<T>
}

export const fetchActs = () => cached<StoryAct[]>('/api/acts', ACTS)

export const fetchSources = () => cached<Source[]>('/api/sources', SOURCES)

export function fetchStatistics(act?: number): Promise<Statistic[]> {
  const fallback = act === undefined ? STATISTICS : STATISTICS.filter(s => s.act_number === act)
  const url = act === undefined ? '/api/statistics' : `/api/statistics?act=${act}`
  return cached<Statistic[]>(url, fallback)
}

export const fetchVideoScenes = () => cached<VideoScene[]>('/api/video-scenes', VIDEO_SCENES)

export const fetchSceneStatistics = () =>
  cached<VideoSceneStatistic[]>('/api/video-scene-statistics', VIDEO_SCENE_STATISTICS)

/** Everything the first paint of any mode needs. Used to gate the preloader. */
export function prefetchCriticalData(): Promise<unknown> {
  return Promise.allSettled([fetchActs(), fetchStatistics(), fetchSources()])
}
