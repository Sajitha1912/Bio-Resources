import { location } from '@/data/site'

/** True when both coordinates are present. */
export function hasGeo(): boolean {
  return location.lat != null && location.lng != null
}

/**
 * Destination used across all Google Maps links: "lat,lng" when coordinates
 * exist, otherwise the human-readable address.
 */
export function locationQuery(): string {
  if (hasGeo()) return `${location.lat},${location.lng}`
  return location.address
}

/** Keyless Google Maps embed URL (no API key required). */
export function mapEmbedUrl(): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery())}&z=15&output=embed`
}

/** "Open in Google Maps" target — the configured share link wins when set. */
export function openInMapsUrl(): string {
  if (location.mapsUrl.trim()) return location.mapsUrl
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery())}`
}

/** Turn-by-turn directions target. */
export function directionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationQuery())}`
}
