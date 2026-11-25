import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSmoothScroll } from '@/providers/smooth-scroll-context'

/** Resets scroll position on route changes (through Lenis when active). */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const { scrollTo } = useSmoothScroll()

  useEffect(() => {
    scrollTo(0, { immediate: true })
  }, [pathname, scrollTo])

  return null
}
