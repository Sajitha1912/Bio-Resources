import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

type LenisScrollToParams = Parameters<Lenis['scrollTo']>

export type SmoothScrollApi = {
  /** Scrolls the page, routed through Lenis when it is active. */
  scrollTo: (...args: LenisScrollToParams) => void
  /** Freezes scrolling (preloader, open mobile menu). */
  stop: () => void
  /** Resumes scrolling after a stop. */
  start: () => void
}

export const SmoothScrollContext = createContext<SmoothScrollApi | null>(null)

export function useSmoothScroll(): SmoothScrollApi {
  const ctx = useContext(SmoothScrollContext)
  if (!ctx) {
    throw new Error('useSmoothScroll must be used within <SmoothScrollProvider>')
  }
  return ctx
}
