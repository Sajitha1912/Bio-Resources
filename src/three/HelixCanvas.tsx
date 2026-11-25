<<<<<<< HEAD
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
=======
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
>>>>>>> e384689851efcff18a3874befa8b5e3ae8fd05ae
import { cn } from '@/lib/cn'
import { useCanRender3D } from '@/hooks/useCanRender3D'
import { HelixFallback } from './HelixFallback'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import type { DNAHelix3DProps } from './DNAHelix3D'

const DNAHelix3D = lazy(() => import('./DNAHelix3D'))

export type HelixCanvasProps = DNAHelix3DProps & {
  className?: string
}

/**
<<<<<<< HEAD
 * Lazily mounts the WebGL helix on WebGL2-capable browsers and only once it
 * has scrolled into view, pausing the render loop when it leaves the screen
 * or the tab is hidden.
=======
 * Lazily mounts the WebGL helix on capable desktops and only once it has
 * scrolled into view, pausing the render loop again whenever it leaves the
 * screen or the tab is hidden. Mobile, low-power devices, reduced motion and
 * any WebGL failure fall back to the code-drawn SVG.
>>>>>>> e384689851efcff18a3874befa8b5e3ae8fd05ae
 */
export function HelixCanvas({ className, ...props }: HelixCanvasProps) {
  const canRender = useCanRender3D()
  const holder = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [entered, setEntered] = useState(false)
  const [hidden, setHidden] = useState(false)
<<<<<<< HEAD
  const [contextLost, setContextLost] = useState(false)
  const handleContextLost = useCallback(() => setContextLost(true), [])
=======
>>>>>>> e384689851efcff18a3874befa8b5e3ae8fd05ae

  useEffect(() => {
    if (!canRender) return
    const element = holder.current

    if (!element || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      setEntered(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting)
        setInView(visible)
        if (visible) setEntered(true)
      },
      { rootMargin: '160px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [canRender])

  useEffect(() => {
    const sync = () => setHidden(document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  const fallback = <HelixFallback className={cn('h-full w-full', className)} />

<<<<<<< HEAD
  if (!canRender || contextLost) return fallback
=======
  if (!canRender) return fallback
>>>>>>> e384689851efcff18a3874befa8b5e3ae8fd05ae

  return (
    <div ref={holder} className={cn('relative', className)} aria-hidden="true">
      {entered ? (
        <CanvasErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
<<<<<<< HEAD
            <DNAHelix3D
              {...props}
              paused={!inView || hidden}
              onContextLost={handleContextLost}
            />
=======
            <DNAHelix3D {...props} paused={!inView || hidden} />
>>>>>>> e384689851efcff18a3874befa8b5e3ae8fd05ae
          </Suspense>
        </CanvasErrorBoundary>
      ) : null}
    </div>
  )
}
