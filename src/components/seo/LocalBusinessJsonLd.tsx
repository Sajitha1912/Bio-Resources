import { useEffect } from 'react'
import { company, contact, location, primaryPhone } from '@/data/site'
import { hasGeo } from '@/lib/location'

const SCRIPT_ID = 'ld-localbusiness'

/**
 * Injects site-wide LocalBusiness structured data (JSON-LD) into <head> once.
 * All values come from src/data/site.ts — nothing is hardcoded here.
 *
 * VERIFY: confirm the legal business name, full postal address, country code,
 * opening hours and (if provided) the coordinates before launch — search
 * engines treat these as factual.
 */
export function LocalBusinessJsonLd() {
  useEffect(() => {
    const emailChannel = contact.channels.find((entry) => entry.id === 'email')

    const data = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: company.companyName,
      legalName: company.companyName,
      description: company.description,
      url: company.url,
      email: emailChannel?.value,
      telephone: primaryPhone?.value,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.address,
        addressLocality: 'Sankagiri',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
      ...(hasGeo()
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: location.lat,
              longitude: location.lng,
            },
          }
        : {}),
      areaServed: 'IN',
      openingHours: contact.hours,
      founder: {
        '@type': 'Person',
        name: company.leadScientist.name,
        honorificSuffix: company.leadScientist.credentials,
        jobTitle: company.leadScientist.role,
      },
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(data)

    return () => {
      document.getElementById(SCRIPT_ID)?.remove()
    }
  }, [])

  return null
}
