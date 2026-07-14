import { useEffect } from 'react'
import { prefetchCriticalData } from '../data/api'

/** Minimum time the index.html preloader stays visible (ms since navigation start). */
const MIN_PRELOADER_MS = 2200
/** Hard ceiling — never hold the page hostage on a slow/failed request. */
const MAX_PRELOADER_MS = 8000

let started = false

/**
 * Dismisses the index.html preloader after a minimum of 2200ms OR once all
 * critical data has loaded — whichever is later (capped at 8s).
 * Call once at the app root.
 */
export function usePreloader() {
  useEffect(() => {
    if (started) return
    started = true

    const wait = (ms: number) => new Promise<void>(res => window.setTimeout(res, ms))
    // performance.now() is ms since navigation start — the preloader has
    // already been on screen that long before React mounted.
    const minDelay = wait(Math.max(0, MIN_PRELOADER_MS - performance.now()))
    const maxDelay = wait(MAX_PRELOADER_MS)

    Promise.race([Promise.all([minDelay, prefetchCriticalData()]), maxDelay]).then(() => {
      window.__dismissPreloader?.()
    })
  }, [])
}
