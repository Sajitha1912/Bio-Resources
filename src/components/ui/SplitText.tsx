import { Fragment, type ComponentType, type ElementType } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useRevealInView } from '@/hooks/useRevealInView'
import { cn } from '@/lib/cn'

/**
 * Reveals text unit-by-unit (words by default) with a masked slide-up.
 *
 * The in-view ref sits on the *outer* tag, not the masked span: a word that
 * starts translated outside its `overflow-hidden` wrapper measures as fully
 * clipped, so an observer on the span would never report it as intersecting and
 * the heading would stay blank. `useRevealInView` also adds a polling safety
 * net so the text always appears. Renders plain text under reduced motion.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  by = 'word',
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
}: {
  text: string
  as?: ElementType
  by?: 'word' | 'char'
  className?: string
  delay?: number
  stagger?: number
  once?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  const { ref, shown } = useRevealInView<HTMLElement>({ amount: 0.2, once })

  if (reduced) return <Tag className={className}>{text}</Tag>

  const units = by === 'char' ? Array.from(text) : text.split(' ')
  const Comp = Tag as ComponentType<any>

  return (
    <Comp
      ref={ref}
      className={cn('inline-block', className)}
      aria-label={text}
    >
      {units.map((unit, index) => (
        <Fragment key={`${unit}-${index}`}>
          <span
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={{ y: '115%', opacity: 0 }}
              animate={
                shown ? { y: '0%', opacity: 1 } : { y: '115%', opacity: 0 }
              }
              transition={{
                duration: 0.7,
                delay: delay + index * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {unit === '' ? '\u00A0' : unit}
            </motion.span>
          </span>
          {by === 'word' && index < units.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Comp>
  )
}
