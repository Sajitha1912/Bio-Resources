import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { primaryPhone } from '@/data/site'

/** Floating call action, shown only on mobile. */
export function FloatingCall() {
  if (!primaryPhone?.href) return null

  return (
    <motion.a
      href={primaryPhone.href}
      aria-label={`Call ${primaryPhone.value}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 18 }}
      className="fixed bottom-5 left-5 z-[70] flex size-14 items-center justify-center rounded-full bg-lime text-forest shadow-lg shadow-lime/40 md:hidden"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-ping rounded-full bg-lime/50"
      />
      <Phone className="relative size-6" />
    </motion.a>
  )
}
