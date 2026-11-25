import { useEffect, useState } from 'react'

/**
 * Heuristic for "keep it cheap": small screens, coarse pointers (touch) or
 * devices reporting few CPU cores. Used to shrink particle/node counts and to
 * disable pointer-driven canvas interaction.
 */
export function useIsLowPower(): boolean {
  const [low, setLow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const update = () => {
      const cores = navigator.hardwareConcurrency ?? 8
      setLow(mq.matches || cores <= 4)
    }

    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return low
}
