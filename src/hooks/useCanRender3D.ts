import { useState } from 'react'

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

/**
 * True when the browser can create the WebGL2 context required by Three.js.
 * Device class, pointer type, and motion preferences do not disable 3D.
 */
export function useCanRender3D(): boolean {
  // Capability check runs once, synchronously, before the first paint — no
  // effect needed, so the scene never flashes in after mount.
  const [supported] = useState(
    () => typeof window !== 'undefined' && hasWebGL(),
  )
  return supported
}
