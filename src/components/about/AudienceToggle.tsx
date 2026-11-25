import { createElement, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { about } from '@/data/site'
import { getIcon } from '@/lib/icons'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/cn'

const { segments } = about

/**
 * Animated toggle between the two audiences we serve. The pill slides between
 * tabs (framer-motion `layoutId`) and the panel cross-fades. Both effects are
 * neutralised when reduced motion is requested.
 */
export function AudienceToggle() {
  const reduced = usePrefersReducedMotion()
  const [activeId, setActiveId] = useState(segments.tabs[0].id)

  const active =
    segments.items.find((item) => item.id === activeId) ?? segments.items[0]
  const icon = getIcon(active.icon)

  return (
    <div className="mt-10 flex flex-col items-center">
      <div
        role="tablist"
        aria-label={segments.title}
        className="relative inline-flex rounded-full border border-line bg-surface p-1 backdrop-blur"
      >
        {segments.tabs.map((tab) => {
          const isActive = tab.id === activeId
          return (
            <button
              key={tab.id}
              id={`audience-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`audience-panel-${tab.id}`}
              onClick={() => setActiveId(tab.id)}
              className={cn(
                'relative z-10 cursor-pointer rounded-full px-6 py-2 text-sm font-medium transition',
                isActive
                  ? 'text-cream dark:text-forest'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {isActive ? (
                reduced ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-forest dark:bg-lime"
                  />
                ) : (
                  <motion.span
                    aria-hidden="true"
                    layoutId="audience-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-forest dark:bg-lime"
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )
              ) : null}
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="mt-8 w-full max-w-3xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            id={`audience-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`audience-tab-${active.id}`}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-teal/10 text-accent dark:bg-lime/10 dark:text-lime">
                {createElement(icon, { className: 'size-6' })}
              </span>
              <div>
                <h3 className="text-2xl">{active.title}</h3>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {active.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-fg-muted"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-accent dark:text-lime" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
