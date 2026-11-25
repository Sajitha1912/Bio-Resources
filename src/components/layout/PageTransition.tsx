import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Cross-fades page content between routes and sweeps a coloured wipe across
 * the screen on each navigation. Disabled under reduced motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const reduced = usePrefersReducedMotion()
  const previous = useRef(pathname)
  const [wipeKey, setWipeKey] = useState(0)

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    setWipeKey((key) => key + 1)
  }, [pathname])

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
          transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!reduced && wipeKey > 0 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[88] overflow-hidden"
        >
          <motion.div
            key={wipeKey}
            className="h-full w-full bg-gradient-to-r from-forest via-teal to-lime"
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '0%', '100%'] }}
            transition={{
              duration: 0.85,
              times: [0, 0.42, 0.55, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        </div>
      ) : null}
    </>
  )
}
