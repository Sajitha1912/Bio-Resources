import { useEffect, useState } from 'react'

const QUERY = '(pointer: fine)'

/**
 * True only on devices with a precise pointer (mouse/trackpad).
 * Used to enable the custom cursor and magnetic hover effects, which are
 * pointless (or harmful) on touch devices.
 */
export function usePointerFine(): boolean {
  const [fine, setFine] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const onChange = () => setFine(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return fine
}
