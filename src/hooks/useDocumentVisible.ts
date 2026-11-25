import { useEffect } from 'react'

/**
 * Toggles a `tab-hidden` class on <html> whenever the browser tab loses
 * visibility. CSS in index.css uses it to pause looping animations (film
 * grain, marquees, floating motifs) so we are not burning CPU off-screen.
 */
export function useDocumentVisible(): void {
  useEffect(() => {
    const root = document.documentElement

    const sync = () => {
      root.classList.toggle('tab-hidden', document.hidden)
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    return () => {
      document.removeEventListener('visibilitychange', sync)
      root.classList.remove('tab-hidden')
    }
  }, [])
}
