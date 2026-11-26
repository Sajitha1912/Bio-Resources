import { useState } from 'react'

let webgl2Available: boolean | undefined

function hasWebGL(): boolean {
  if (webgl2Available !== undefined) return webgl2Available

  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')
    webgl2Available = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webgl2Available = false
  }

  return webgl2Available
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
