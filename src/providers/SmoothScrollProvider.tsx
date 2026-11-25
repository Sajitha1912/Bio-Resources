import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { SmoothScrollContext, type SmoothScrollApi } from './smooth-scroll-context'

gsap.registerPlugin(ScrollTrigger)

/**
 * Sets up Lenis smooth scrolling and keeps GSAP's ScrollTrigger in sync with it.
 * Disabled entirely when the user prefers reduced motion, falling back to
 * native scrolling.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const api = useMemo<SmoothScrollApi>(
    () => ({
      scrollTo: (target, options) => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, options)
          return
        }
        // Reduced-motion / no-Lenis fallback.
        const top =
          typeof target === 'number' ? target : 0
        window.scrollTo({ top, behavior: 'auto' })
      },
      stop: () => {
        if (lenisRef.current) {
          lenisRef.current.stop()
          return
        }
        document.documentElement.style.overflow = 'hidden'
      },
      start: () => {
        if (lenisRef.current) {
          lenisRef.current.start()
          return
        }
        document.documentElement.style.overflow = ''
      },
    }),
    [],
  )

  return (
    <SmoothScrollContext.Provider value={api}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
