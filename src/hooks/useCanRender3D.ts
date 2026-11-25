import { useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** Below this many logical cores we treat the device as low-power. */
const MIN_CORES = 4
/** Below this much device memory (GB) we treat the device as low-power. */
const MIN_MEMORY = 4

type NavigatorWithMemory = Navigator & { deviceMemory?: number }

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

function isLowPower(): boolean {
  const { hardwareConcurrency, deviceMemory } = navigator as NavigatorWithMemory
  if (typeof hardwareConcurrency === 'number' && hardwareConcurrency > 0) {
    if (hardwareConcurrency < MIN_CORES) return true
  }
  if (typeof deviceMemory === 'number' && deviceMemory < MIN_MEMORY) return true
  return false
}

/**
 * True when it is safe to mount the WebGL hero scene: a fine pointer, a
 * reasonably capable device, a working WebGL context, and no reduced-motion
 * preference. Everything else falls back to the code-drawn SVG illustration.
 */
export function useCanRender3D(): boolean {
  const reduced = usePrefersReducedMotion()
  // Capability check runs once, synchronously, before the first paint — no
  // effect needed, so the scene never flashes in after mount.
  const [supported] = useState(() => {
    if (typeof window === 'undefined') return false
    const fine = window.matchMedia('(pointer: fine)').matches
    return fine && !isLowPower() && hasWebGL()
  })

  return supported && !reduced
}
