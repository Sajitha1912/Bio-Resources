import { useState, type ComponentPropsWithRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Form fields with a floating label. The label sits inside the field while it
 * is empty, and lifts to the top border once the field is focused or filled.
 * `float` is derived from focus + value state (rather than CSS
 * `:placeholder-shown`) so the behaviour is identical across input, textarea
 * and select.
 */

type SharedProps = {
  id: string
  label: string
  error?: string
  required?: boolean
}

const FIELD_CLASSES =
  'peer w-full rounded-xl border bg-surface text-sm text-fg transition focus:outline-none'

function labelClasses(float: boolean, focused: boolean, error: boolean) {
  return cn(
    'pointer-events-none absolute left-4 origin-left transition-all duration-200',
    float ? 'top-2 text-xs' : 'top-1/2 -translate-y-1/2 text-sm',
    error
      ? 'text-red-600 dark:text-red-400'
      : focused
        ? 'text-accent dark:text-lime'
        : 'text-fg-muted',
  )
}

function borderClasses(error: boolean) {
  return error
    ? 'border-red-500/70 dark:border-red-400/70'
    : 'border-line focus:border-teal dark:focus:border-lime'
}

function FloatingLabel({
  htmlFor,
  label,
  float,
  focused,
  error,
  required,
}: {
  htmlFor: string
  label: string
  float: boolean
  focused: boolean
  error: boolean
  required?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className={labelClasses(float, focused, error)}>
      {label}
      {required ? (
        <span aria-hidden="true" className="text-accent dark:text-lime">
          {' '}
          *
        </span>
      ) : null}
    </label>
  )
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null
  return (
    <p
      id={`${id}-error`}
      role="alert"
      className="mt-1.5 text-sm text-red-600 dark:text-red-400"
    >
      {error}
    </p>
  )
}

export function FloatingInput({
  id,
  label,
  error,
  required,
  className,
  onChange,
  onFocus,
  onBlur,
  ...props
}: SharedProps & ComponentPropsWithRef<'input'>) {
  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(false)
  const float = focused || filled

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required || undefined}
          onChange={(event) => {
            setFilled(event.target.value !== '')
            onChange?.(event)
          }}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          className={cn(
            FIELD_CLASSES,
            'px-4 pt-6 pb-2',
            borderClasses(Boolean(error)),
            className,
          )}
          {...props}
        />
        <FloatingLabel
          htmlFor={id}
          label={label}
          float={float}
          focused={focused}
          error={Boolean(error)}
          required={required}
        />
      </div>
      <FieldError id={id} error={error} />
    </div>
  )
}

export function FloatingTextarea({
  id,
  label,
  error,
  required,
  className,
  onChange,
  onFocus,
  onBlur,
  ...props
}: SharedProps & ComponentPropsWithRef<'textarea'>) {
  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(false)
  const float = focused || filled

  return (
    <div>
      <div className="relative">
        <textarea
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required || undefined}
          onChange={(event) => {
            setFilled(event.target.value !== '')
            onChange?.(event)
          }}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          className={cn(
            FIELD_CLASSES,
            'resize-y px-4 pt-6 pb-2',
            borderClasses(Boolean(error)),
            className,
          )}
          {...props}
        />
        <FloatingLabel
          htmlFor={id}
          label={label}
          float={float}
          focused={focused}
          error={Boolean(error)}
          required={required}
        />
      </div>
      <FieldError id={id} error={error} />
    </div>
  )
}

export function FloatingSelect({
  id,
  label,
  error,
  required,
  className,
  options,
  onChange,
  onFocus,
  onBlur,
  ...props
}: SharedProps & {
  options: { value: string; label: string }[]
} & ComponentPropsWithRef<'select'>) {
  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(false)
  const float = focused || filled

  return (
    <div>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required={required || undefined}
          onChange={(event) => {
            setFilled(event.target.value !== '')
            onChange?.(event)
          }}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          className={cn(
            FIELD_CLASSES,
            'appearance-none px-4 pt-6 pr-10 pb-2',
            borderClasses(Boolean(error)),
            className,
          )}
          {...props}
        >
          <option value="" />
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fg-muted"
        />
        <FloatingLabel
          htmlFor={id}
          label={label}
          float={float}
          focused={focused}
          error={Boolean(error)}
          required={required}
        />
      </div>
      <FieldError id={id} error={error} />
    </div>
  )
}
