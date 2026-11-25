import { useEffect, useState } from 'react'

export type ScrollInfo = {
  /** Current vertical scroll position in pixels. */
  y: number
  /** Most recent scroll direction. */
  direction: 'up' | 'down'
  /** True while the page is still near the top. */
  atTop: boolean
}

/**
 * Tracks scroll position and direction on a rAF-throttled listener.
 * Used by the navbar to hide on scroll-down and reveal on scroll-up.
 */
export function useScrollInfo(threshold = 8): ScrollInfo {
  const [info, setInfo] = useState<ScrollInfo>({
    y: 0,
    direction: 'up',
    atTop: true,
  })

  useEffect(() => {
    let last = window.scrollY
    let frame = 0

    const read = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - last
      if (Math.abs(delta) < threshold) return
      const direction: ScrollInfo['direction'] = delta > 0 ? 'down' : 'up'
      last = y
      setInfo({ y, direction, atTop: y < 24 })
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [threshold])

  return info
}
