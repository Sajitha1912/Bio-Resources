import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { contactPage, services } from '@/data/site'
import { submitEnquiry } from '@/lib/enquiry'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Button } from '@/components/ui/Button'
import {
  FloatingInput,
  FloatingSelect,
  FloatingTextarea,
} from '@/components/ui/FloatingField'

const schema = z.object({
  firstName: z.string().min(1, 'Please enter your first name.'),
  lastName: z.string().min(1, 'Please enter your last name.'),
  email: z
    .string()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z
    .string()
    .min(10, 'Please tell us a little more (at least 10 characters).'),
  // Honeypot — must stay empty. Bots tend to fill every field.
  companyWebsite: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const SERVICE_OPTIONS = services.map((service) => ({
  value: service.title,
  label: service.title,
}))

/** Animated tick drawn with an SVG stroke, shown after a successful send. */
function SuccessMark({ reduced }: { reduced: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 52 52"
      className="size-16 text-accent dark:text-lime"
      aria-hidden="true"
      initial={reduced ? false : 'hidden'}
      animate="visible"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.path
        d="M15 27 L23 35 L38 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1 },
        }}
        transition={{ duration: 0.4, delay: reduced ? 0 : 0.5, ease: 'easeOut' }}
      />
    </motion.svg>
  )
}

export function ContactForm() {
  const reduced = usePrefersReducedMotion()
  const [sent, setSent] = useState(false)
  const [viaMailto, setViaMailto] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      message: '',
      companyWebsite: '',
    },
  })

  const { form } = contactPage

  const onSubmit = async (values: FormValues) => {
    // Honeypot tripped: behave as if it went through, but send nothing.
    if (values.companyWebsite) {
      reset()
      setViaMailto(false)
      setSent(true)
      return
    }

    const result = await submitEnquiry({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      service: values.service,
      message: values.message,
    })

    if (result.status === 'fallback') {
      // Open the visitor's email app with the message ready to send.
      window.location.assign(result.mailto)
    }

    setViaMailto(result.status === 'fallback')
    reset()
    setSent(true)
  }

  if (sent) {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 sm:p-8"
      >
        <SuccessMark reduced={reduced} />
        <div>
          <h3 className="text-xl">{form.success.title}</h3>
          <p className="mt-2 text-fg-muted">{form.confirmation}</p>
          {viaMailto ? (
            <p className="mt-1 text-sm text-fg-muted">{form.success.mailtoNote}</p>
          ) : null}
        </div>
        <Button variant="secondary" onClick={() => setSent(false)}>
          {form.success.again}
        </Button>
      </motion.div>
    )
  }

  const showSummary = submitCount > 0 && Object.keys(errors).length > 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {showSummary ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{form.errorSummary}</span>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingInput
          id="firstName"
          autoComplete="given-name"
          label={form.fields.firstName.label}
          error={errors.firstName?.message}
          required
          {...register('firstName')}
        />
        <FloatingInput
          id="lastName"
          autoComplete="family-name"
          label={form.fields.lastName.label}
          error={errors.lastName?.message}
          required
          {...register('lastName')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingInput
          id="email"
          type="email"
          autoComplete="email"
          label={form.fields.email.label}
          error={errors.email?.message}
          required
          {...register('email')}
        />
        <FloatingInput
          id="phone"
          type="tel"
          autoComplete="tel"
          label={form.fields.phone.label}
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>

      <FloatingSelect
        id="service"
        label={form.fields.service.label}
        options={SERVICE_OPTIONS}
        error={errors.service?.message}
        {...register('service')}
      />

      <FloatingTextarea
        id="message"
        rows={5}
        label={form.fields.message.label}
        error={errors.message?.message}
        required
        {...register('message')}
      />

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="companyWebsite">{form.honeypotLabel}</label>
        <input
          id="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('companyWebsite')}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? form.sendingLabel : form.submitLabel}
        </Button>
        <p className="text-xs text-fg-muted">{form.requiredNote}</p>
      </div>

      <p className="text-sm text-fg-muted">{form.confirmation}</p>
    </form>
  )
}
