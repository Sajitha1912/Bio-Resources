import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { Phone, X } from 'lucide-react'
import { contact, nav, primaryPhone } from '@/data/site'
import { useSmoothScroll } from '@/providers/smooth-scroll-context'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { BrandLockup } from '@/components/ui/BrandLockup'

/** Full-screen animated navigation for small screens. */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { stop, start } = useSmoothScroll()

  // Freeze page scrolling while the menu is open.
  useEffect(() => {
    if (!open) return
    stop()
    return () => start()
  }, [open, stop, start])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu"
          id="mobile-nav"
          className="fixed inset-0 z-[80] flex flex-col bg-bg/95 backdrop-blur-2xl md:hidden"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex h-16 items-center justify-between px-5 sm:h-18">
            <BrandLockup />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-fg"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col justify-center gap-1 px-6"
            aria-label="Mobile"
          >
            {nav.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.18 + index * 0.06,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block py-2 font-heading text-4xl transition-colors ${
                      isActive
                        ? 'text-accent dark:text-lime'
                        : 'text-fg hover:text-accent dark:hover:text-lime'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="space-y-4 border-t border-line px-6 py-8"
          >
            <p className="text-sm text-fg-muted">{contact.hours}</p>
            {primaryPhone?.href ? (
              <MagneticButton
                href={primaryPhone.href}
                ariaLabel={`Call ${primaryPhone.value}`}
                className="w-full bg-forest text-cream dark:bg-lime dark:text-forest"
              >
                <Phone className="size-4" />
                Call {primaryPhone.value}
              </MagneticButton>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
