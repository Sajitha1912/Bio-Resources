import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * In-view detection for reveal animations, with a safety net.
 *
 * `useInView` alone can leave content stuck hidden: the observer's very first
 * callback can race the element's initial transform, and a masked word that
 * starts translated outside an `overflow-hidden` wrapper measures as fully
 * clipped — so it never reports as intersecting and its reveal never runs.
 *
 * To guarantee nothing stays invisible we attach the ref to the *outer*,
 * un-clipped element and, after `softMs`, start polling: as soon as the element
 * is within (or just outside) the viewport we reveal it, even if the observer
 * never fired. Polling — rather than an unconditional timer — means content far
 * below the fold still animates in on scroll instead of firing early.
 *
 * `shown` is sticky once true, so the reveal never reverses.
 */
export function useRevealInView<T extends HTMLElement>({
  amount = 0.2,
  once = true,
  softMs = 1500,
  recheckMs = 1200,
}: {
  amount?: number | 'some' | 'all'
  once?: boolean
  softMs?: number
  recheckMs?: number
} = {}) {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once, amount })
  const [forced, setForced] = useState(false)

  useEffect(() => {
    if (forced) return

    let interval = 0
    const check = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 0
      if (rect.bottom > -vh * 0.3 && rect.top < vh * 1.3) {
        setForced(true)
        if (interval) window.clearInterval(interval)
      }
    }

    const start = window.setTimeout(() => {
      check()
      interval = window.setInterval(check, recheckMs)
    }, softMs)

    return () => {
      window.clearTimeout(start)
      if (interval) window.clearInterval(interval)
    }
  }, [softMs, recheckMs, forced])

  return { ref, shown: inView || forced }
}
