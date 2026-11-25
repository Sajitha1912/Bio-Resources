import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, ExternalLink, MapPin, Navigation, X } from 'lucide-react'
import { location } from '@/data/site'
import { directionsUrl, mapEmbedUrl, openInMapsUrl } from '@/lib/location'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useSmoothScroll } from '@/providers/smooth-scroll-context'

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])'

const ACTION =
  'inline-flex min-w-[9rem] flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition'
const PRIMARY = `${ACTION} bg-forest text-cream hover:bg-forest-deep dark:bg-lime dark:text-forest dark:hover:bg-lime/90`
const SECONDARY = `${ACTION} border border-line bg-surface text-fg hover:border-teal/60 dark:hover:border-lime/60`

/**
 * Dialog body. Mounted only while open, so its transient state (map load,
 * "copied" flag) initialises fresh on every open with no reset effect.
 */
function LocationDialog({ onClose }: { onClose: () => void }) {
  const reduced = usePrefersReducedMotion()
  const { stop, start } = useSmoothScroll()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const copyTimer = useRef<number | undefined>(undefined)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [copied, setCopied] = useState(false)

  // Scroll lock, initial focus, Esc handling and a Tab focus trap.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    stop()
    const raf = requestAnimationFrame(() => closeRef.current?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(copyTimer.current)
      start()
      previouslyFocused?.focus()
    }
  }, [onClose, stop, start])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(location.address)
      setCopied(true)
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. an insecure context) — ignore.
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.28 }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-surface/95 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
              <MapPin className="size-5" />
            </span>
            <div>
              <h2 id="location-modal-title" className="text-lg font-medium">
                {location.label}
              </h2>
              <p className="mt-0.5 text-sm text-fg-muted">{location.address}</p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close location dialog"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-fg-muted transition hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative h-64 w-full bg-surface-strong">
          {!mapLoaded ? (
            <div
              aria-hidden="true"
              className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-strong via-surface to-surface-strong"
            />
          ) : null}
          <iframe
            title={`Map showing ${location.label}`}
            src={mapEmbedUrl()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapLoaded(true)}
            className="map-frame relative h-full w-full border-0"
          />
        </div>

        <div className="flex flex-wrap gap-3 p-5">
          <a
            href={openInMapsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={PRIMARY}
          >
            <ExternalLink className="size-4" />
            Open in Google Maps
          </a>
          <a
            href={directionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={SECONDARY}
          >
            <Navigation className="size-4" />
            Get Directions
          </a>
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            className={SECONDARY}
          >
            {copied ? (
              <Check className="size-4 text-accent dark:text-lime" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? 'Copied!' : 'Copy address'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Frosted-glass dialog with an embedded Google Map and quick actions.
 * Closes on the X button, the Esc key or a backdrop click, and traps focus
 * while open. The iframe is mounted only once the dialog opens (lazy).
 */
export function LocationModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open ? <LocationDialog onClose={onClose} /> : null}
    </AnimatePresence>
  )
}
