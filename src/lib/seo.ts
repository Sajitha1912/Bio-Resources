import { useEffect } from 'react'
import { company } from '@/data/site'

export type SeoOptions = {
  /** Page-specific title. The company name is appended automatically. */
  title: string
  description: string
  /** Route path beginning with "/" — used for the canonical URL. */
  path?: string
  /**
   * Absolute path to a social preview image, e.g. "/images/og-home.jpg".
   * Defaults to the company logo so every page has an og:image.
   */
  image?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function removeMeta(attr: 'name' | 'property', key: string) {
  document.head
    .querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
    ?.remove()
}

/**
 * Applies per-page SEO metadata (title, description, canonical, Open Graph,
 * Twitter and robots). Call once per page component.
 */
export function useSeo({
  title,
  description,
  path = '/',
  image = company.logo,
}: SeoOptions): void {
  useEffect(() => {
    const fullTitle =
      title === company.name ? title : `${title} — ${company.name}`
    const url = `${company.url}${path}`

    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', company.keywords.join(', '))
    upsertMeta('name', 'robots', 'index,follow')
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', company.name)
    upsertMeta('property', 'og:locale', 'en')
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)

    if (image) {
      upsertMeta('property', 'og:image', `${company.url}${image}`)
      upsertMeta('name', 'twitter:image', `${company.url}${image}`)
    } else {
      removeMeta('property', 'og:image')
      removeMeta('name', 'twitter:image')
    }

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, image])
}
