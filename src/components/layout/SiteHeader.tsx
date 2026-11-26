import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { company, nav, primaryPhone } from '@/data/site'
import { cn } from '@/lib/cn'
import { useScrollInfo } from '@/hooks/useScrollInfo'
import { Container } from '@/components/ui/Container'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { LocationButton } from '@/components/location/LocationButton'
import { MobileMenu } from './MobileMenu'
import { TopContactBar } from './TopContactBar'
import { BrandLockup } from '@/components/ui/BrandLockup'

/**
 * Sticky navbar: hides while scrolling down, reveals on scroll up, and picks
 * up a blurred backdrop once the page has moved.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { y, direction } = useScrollInfo()

  // Close the menu whenever the route changes (covers browser back/forward).
  // Adjusting state during render avoids an extra effect pass.
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    if (open) setOpen(false)
  }

  const scrolled = y > 12
  const hidden = !open && direction === 'down' && y > 140

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
          scrolled && !open
            ? 'border-line bg-bg/70 backdrop-blur-xl'
            : 'border-transparent',
        )}
      >
        <TopContactBar />
        <Container>
          <div
            className={cn(
              'flex items-center justify-between gap-4 transition-[height] duration-300',
              scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-18',
            )}
          >
            <Link
              to="/"
              className="min-w-0 shrink-0"
              aria-label={`${company.companyName} — home`}
            >
              <BrandLockup compact={scrolled} />
            </Link>

            <nav
              className="hidden items-center gap-1 md:flex"
              aria-label="Primary"
            >
              {nav.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative rounded-full px-4 py-2 text-sm transition',
                      isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive ? (
                        <motion.span
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-full bg-surface"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      ) : null}
                      <span className="relative">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <span className="hidden lg:block">
                <LocationButton />
              </span>

              {primaryPhone?.href ? (
                <span className="hidden lg:block">
                  <MagneticButton
                    href={primaryPhone.href}
                    ariaLabel={`Call ${primaryPhone.value}`}
                    strength={0.25}
                    className="bg-forest text-cream hover:bg-forest-deep dark:bg-lime dark:text-forest dark:hover:bg-lime/90"
                  >
                    <Phone className="size-4" />
                    Call Now
                  </MagneticButton>
                </span>
              ) : null}

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-fg backdrop-blur md:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </Container>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}
