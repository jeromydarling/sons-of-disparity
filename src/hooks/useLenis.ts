import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let activeLenis: Lenis | null = null

/**
 * Per-act friction control. Acts call this on enter to change how heavy
 * the scroll feels (e.g. Act 5 drops to 0.03 — molasses).
 */
export function updateLerp(value: number) {
  if (activeLenis) {
    // `options` exists at runtime but isn't in the published type defs
    ;(activeLenis as unknown as { options: { lerp?: number } }).options.lerp = value
  }
}

/**
 * Smooth scroll for story-mode pages. Driven by the GSAP ticker so
 * ScrollTrigger and Lenis share one clock. Disabled entirely under
 * prefers-reduced-motion via gsap.matchMedia().
 */
export function useLenis() {
  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({ lerp: 0.1, duration: 1.2, smoothWheel: true })
      activeLenis = lenis

      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
        activeLenis = null
      }
    })

    return () => mm.revert()
  }, [])

  return { updateLerp }
}
