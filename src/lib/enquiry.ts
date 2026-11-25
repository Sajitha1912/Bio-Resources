import { company, contact } from '@/data/site'

/** The fields collected by the contact form. */
export type EnquiryPayload = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  service?: string
  message: string
}

/**
 * Result of an enquiry submission.
 * - `sent`     — the endpoint accepted the payload.
 * - `fallback` — no endpoint (or it failed); open the prefilled mailto link.
 */
export type SubmitResult =
  | { status: 'sent' }
  | { status: 'fallback'; mailto: string }

/** First mail-capable contact channel, used as the mailto recipient. */
function recipientEmail(): string {
  const channel = contact.channels.find((item) => item.href?.startsWith('mailto:'))
  return channel?.value ?? ''
}

/** Builds a prefilled mailto: link from an enquiry. */
export function buildMailto(payload: EnquiryPayload): string {
  const subject = `New enquiry via the ${company.shortName} website`
  const body = [
    `Name: ${[payload.firstName, payload.lastName].filter(Boolean).join(' ')}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.service ? `Service of interest: ${payload.service}` : null,
    '',
    payload.message,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  return `mailto:${recipientEmail()}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`
}

/**
 * Posts an enquiry to `VITE_FORM_ENDPOINT`. Falls back to a prefilled
 * mailto: link when no endpoint is configured, or when the request fails —
 * so the visitor always has a way to reach us.
 */
export async function submitEnquiry(
  payload: EnquiryPayload,
): Promise<SubmitResult> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT?.trim()

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          source: company.url,
          submittedAt: new Date().toISOString(),
        }),
      })
      if (response.ok) return { status: 'sent' }
    } catch {
      // Network or CORS failure — fall through to the mailto fallback.
    }
  }

  return { status: 'fallback', mailto: buildMailto(payload) }
}
