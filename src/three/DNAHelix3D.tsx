import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  Float,
  Instance,
  Instances,
  Lightformer,
  OrbitControls,
} from '@react-three/drei'
import {
  InstancedMesh,
  MathUtils,
  MeshPhysicalMaterial,
  Object3D,
  Quaternion,
  SphereGeometry,
  Vector3,
  type Group,
  type Mesh,
} from 'three'

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const UP = new Vector3(0, 1, 0)
/** Full helical turns along the strand. */
const TURNS = 2.4
/** Extra twist, in radians, applied across the whole scroll story. */
const TWIST = Math.PI * 0.7
/** Fraction of the helix that has unzipped by the end of the scroll story. */
const UNZIP_MAX = 0.85
/** Never advance more than a 30fps step, so a paused loop cannot lurch. */
const MAX_DELTA = 1 / 30

const FOREST = '#0F3D2E'
const LIME = '#7BC74D'
const TEAL = '#1B8A7A'
const CREAM = '#F7F5EF'

export type DNAHelix3DProps = {
  /** Total height of the helix in world units. */
  height?: number
  /** Number of base pairs (24–30 reads best). */
  pairs?: number
  /** Slowly spin the helix on its own. */
  autoRotate?: boolean
  /** Enable drag-to-rotate plus per-base-pair hover. */
  interactive?: boolean
  /** Scatter floating molecule clusters around the helix (hero mode). */
  molecules?: boolean
  /** Number of scroll steps used to light up one base pair each. */
  steps?: number
  /** Live 0..1 scroll progress, mutated by GSAP and read in the render loop. */
  progressRef?: { current: number }
  /** Pause the render loop while off-screen or when the tab is hidden. */
  paused?: boolean
}

/* -------------------------------------------------------------------------- */
/* Geometry                                                                    */
/* -------------------------------------------------------------------------- */

type BasePair = {
  /** Height of the pair, centred on the origin. */
  y: number
  /** Angle of the first strand at this height. */
  angle: number
  /** Distance from the top of the helix, where unzipping begins. */
  depth: number
  /** Scroll step this pair lights up for, or null when it has none. */
  step: number | null
}

function useBasePairs(height: number, pairs: number, steps: number): BasePair[] {
  return useMemo(() => {
    const last = Math.max(pairs - 1, 1)
    const list: BasePair[] = Array.from({ length: pairs }, (_, i) => {
      const t = i / last
      return {
        y: t * height - height / 2,
        angle: t * Math.PI * 2 * TURNS,
        depth: pairs - 1 - i,
        step: null,
      }
    })

    // Spread the steps down the helix so the pair that lights up keeps pace
    // with the unzip front as the pinned section scrolls.
    for (let s = 0; s < steps; s++) {
      const index = pairs - 1 - Math.round(((s + 0.5) / steps) * last)
      if (index >= 0 && index < pairs) list[index].step = s
    }

    return list
  }, [height, pairs, steps])
}

/* -------------------------------------------------------------------------- */
/* Helix model                                                                 */
/* -------------------------------------------------------------------------- */

type HelixModelProps = {
  height: number
  pairs: number
  steps: number
  autoRotate: boolean
  interactive: boolean
  progressRef?: { current: number }
}

function HelixModel({
  height,
  pairs,
  steps,
  autoRotate,
  interactive,
  progressRef,
}: HelixModelProps) {
  const data = useBasePairs(height, pairs, steps)
  const radius = height * 0.17
  const rungRadius = radius * 0.02
  const beadRadius = radius * 0.1

  const group = useRef<Group>(null)
  const strandA = useRef<InstancedMesh>(null)
  const strandB = useRef<InstancedMesh>(null)
  const rungs = useRef<(Mesh | null)[]>([])
  const hovered = useRef<number | null>(null)

  const helper = useMemo(() => new Object3D(), [])
  const axis = useMemo(() => new Vector3(), [])
  const quaternion = useMemo(() => new Quaternion(), [])

  /**
   * Both backbones are chains of beads. Instanced meshes keep the whole helix
   * to three draw calls however many base pairs it has.
   */
  const strands = useMemo(() => {
    const geometry = new SphereGeometry(beadRadius, 16, 16)
    const build = (color: string) => {
      const mesh = new InstancedMesh(
        geometry,
        new MeshPhysicalMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.26,
          roughness: 0.25,
          metalness: 0.1,
          clearcoat: 0.8,
          clearcoatRoughness: 0.22,
        }),
        pairs,
      )
      // Instance positions sit far from the geometry origin, so cull by hand.
      mesh.frustumCulled = false
      return mesh
    }
    return { a: build(FOREST), b: build(LIME), geometry }
  }, [pairs, beadRadius])

  useEffect(() => {
    const { a, b, geometry } = strands
    return () => {
      geometry.dispose()
      ;(a.material as MeshPhysicalMaterial).dispose()
      ;(b.material as MeshPhysicalMaterial).dispose()
      a.dispose()
      b.dispose()
    }
  }, [strands])

  const layout = (progress: number, delta: number) => {
    const a = strandA.current
    const b = strandB.current
    if (!a || !b) return

    const clamped = MathUtils.clamp(progress, 0, 1)
    const activeStep = Math.min(steps - 1, Math.floor(clamped * steps))
    const twist = clamped * TWIST
    const open = clamped * (pairs - 1) * UNZIP_MAX
    const spread = radius * 0.8

    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.22
    }

    for (let i = 0; i < data.length; i++) {
      const pair = data[i]
      const angle = pair.angle + twist
      const unzipped = MathUtils.clamp(open - pair.depth, 0, 1)
      const r = radius + unzipped * spread

      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r

      const isActive = pair.step === activeStep
      const isLit = pair.step !== null && pair.step <= activeStep
      const isHovered = interactive && hovered.current === i
      const beadScale =
        1 + (isActive ? 0.5 : isLit ? 0.25 : 0) + (isHovered ? 0.45 : 0)

      helper.position.set(x, pair.y, z)
      helper.rotation.set(0, 0, 0)
      helper.scale.setScalar(beadScale)
      helper.updateMatrix()
      a.setMatrixAt(i, helper.matrix)

      helper.position.set(-x, pair.y, -z)
      helper.updateMatrix()
      b.setMatrixAt(i, helper.matrix)

      const rung = rungs.current[i]
      if (!rung) continue

      // A rung always joins the two strands, so it stretches as the pair opens.
      axis.set(-x, 0, -z).normalize()
      quaternion.setFromUnitVectors(UP, axis)
      const thickness = 1 + (isActive ? 0.8 : 0) + (isHovered ? 1.2 : 0)
      rung.position.set(0, pair.y, 0)
      rung.quaternion.copy(quaternion)
      rung.scale.set(thickness, 2 * r, thickness)

      const material = rung.material as MeshPhysicalMaterial
      const glow = isHovered ? 1.9 : isActive ? 1.3 : isLit ? 0.6 : 0.18
      const opacity = isLit || isHovered ? 0.95 : 0.9 * (1 - unzipped * 0.85)
      material.emissiveIntensity = MathUtils.damp(
        material.emissiveIntensity,
        glow,
        9,
        delta,
      )
      material.opacity = MathUtils.damp(material.opacity, opacity, 9, delta)
    }

    a.instanceMatrix.needsUpdate = true
    b.instanceMatrix.needsUpdate = true
  }

  // useFrame runs before the frame is drawn, so the helix is already posed on
  // the very first render — nothing flashes at the origin.
  useFrame((_, delta) => {
    layout(progressRef?.current ?? 0, Math.min(delta, MAX_DELTA))
  })

  return (
    <group ref={group}>
      <primitive object={strands.a} ref={strandA} />
      <primitive object={strands.b} ref={strandB} />

      {data.map((_, i) => (
        <mesh
          key={`rung-${i}`}
          ref={(element) => {
            rungs.current[i] = element
          }}
          onPointerOver={
            interactive
              ? (event) => {
                  event.stopPropagation()
                  hovered.current = i
                }
              : undefined
          }
          onPointerOut={
            interactive
              ? () => {
                  if (hovered.current === i) hovered.current = null
                }
              : undefined
          }
        >
          <cylinderGeometry args={[rungRadius, rungRadius, 1, 8]} />
          <meshPhysicalMaterial
            color={i % 2 === 0 ? TEAL : LIME}
            emissive={i % 2 === 0 ? TEAL : LIME}
            emissiveIntensity={0.18}
            roughness={0.3}
            metalness={0.15}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

/* -------------------------------------------------------------------------- */
/* Molecules (hero only)                                                       */
/* -------------------------------------------------------------------------- */

const CLUSTER_CENTERS: [number, number, number][] = [
  [-2.7, 1.7, 0.7],
  [2.8, -1.5, 1.1],
  [-2.3, -2.0, -0.5],
  [2.5, 2.1, -0.8],
  [0.3, 2.8, -0.3],
  [-0.5, -2.8, 0.6],
]

const CLUSTER_OFFSETS: [number, number, number][] = [
  [0.62, 0.34, 0.12],
  [-0.44, 0.5, -0.22],
  [0.16, -0.56, 0.34],
  [-0.3, -0.18, -0.5],
  [0.52, -0.1, 0.42],
]

const CLUSTER_BONDS = CLUSTER_OFFSETS.map((offset) => {
  const to = new Vector3(offset[0], offset[1], offset[2])
  return {
    mid: to.clone().multiplyScalar(0.5),
    length: to.length(),
    quaternion: new Quaternion().setFromUnitVectors(UP, to.clone().normalize()),
  }
})

function Molecules({ scale }: { scale: number }) {
  return (
    <>
      {CLUSTER_CENTERS.map((center, index) => (
        <Float
          key={`cluster-${index}`}
          speed={1 + index * 0.16}
          rotationIntensity={0.35}
          floatIntensity={0.9}
        >
          <group
            position={[
              center[0] * scale,
              center[1] * scale,
              center[2] * scale,
            ]}
            scale={scale}
          >
            <Instances limit={CLUSTER_OFFSETS.length + 1}>
              <sphereGeometry args={[0.075, 16, 16]} />
              <meshPhysicalMaterial
                color={CREAM}
                emissive={TEAL}
                emissiveIntensity={0.2}
                roughness={0.3}
                metalness={0.2}
                clearcoat={0.6}
                clearcoatRoughness={0.3}
              />
              <Instance position={[0, 0, 0]} scale={1.6} color={LIME} />
              {CLUSTER_OFFSETS.map((offset, i) => (
                <Instance key={i} position={offset} />
              ))}
            </Instances>

            {CLUSTER_BONDS.map(({ mid, length, quaternion: bond }, i) => (
              <mesh
                key={i}
                position={mid}
                quaternion={bond}
                scale={[1, length, 1]}
              >
                <cylinderGeometry args={[0.014, 0.014, 1, 6]} />
                <meshStandardMaterial color={TEAL} transparent opacity={0.45} />
              </mesh>
            ))}
          </group>
        </Float>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Scene helpers                                                               */
/* -------------------------------------------------------------------------- */

/** Tilts the helix gently toward the pointer, whatever has pointer-events. */
function PointerTilt({
  children,
  strength = 0.12,
}: {
  children: ReactNode
  strength?: number
}) {
  const group = useRef<Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const target = group.current
    if (!target) return
    const step = Math.min(delta, MAX_DELTA)
    target.rotation.x = MathUtils.damp(
      target.rotation.x,
      pointer.current.y * strength,
      2.5,
      step,
    )
    target.rotation.z = MathUtils.damp(
      target.rotation.z,
      -pointer.current.x * strength * 0.6,
      2.5,
      step,
    )
  })

  return <group ref={group}>{children}</group>
}

/** Stops and restarts the render loop without tearing the scene down. */
function Frameloop({ paused }: { paused: boolean }) {
  const setFrameloop = useThree((state) => state.setFrameloop)
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    setFrameloop(paused ? 'never' : 'always')
    if (!paused) invalidate()
  }, [paused, setFrameloop, invalidate])

  return null
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Interactive WebGL DNA double helix: two beaded backbones joined by base-pair
 * rungs. It spins on its own, tilts toward the pointer, can be dragged, and
 * twiddles with a `progressRef` so it twists and unzips while a section is
 * scrolled. Everything is code-drawn — no textures or downloaded assets.
 */
export default function DNAHelix3D({
  height = 7,
  pairs = 28,
  autoRotate = true,
  interactive = false,
  molecules = false,
  steps = 5,
  progressRef,
  paused = false,
}: DNAHelix3DProps) {
  const cameraZ = height * 1.35 + 1

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, cameraZ], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className={interactive ? 'dna-helix' : undefined}
    >
      <Frameloop paused={paused} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 6]} intensity={1.5} />
      <directionalLight position={[-6, -3, -5]} intensity={0.4} color={TEAL} />
      <pointLight position={[3, 2, 3]} intensity={0.5} color={LIME} />

      {/* Subtle environment built in code — no HDR file to download. */}
      <Environment resolution={64} frames={1}>
        <Lightformer
          intensity={0.7}
          color={LIME}
          position={[0, 5, -5]}
          scale={[8, 8, 1]}
        />
        <Lightformer
          intensity={0.5}
          color={TEAL}
          position={[-5, -2, 4]}
          scale={[6, 6, 1]}
        />
        <Lightformer
          intensity={0.6}
          color={CREAM}
          position={[5, 3, 3]}
          scale={[5, 5, 1]}
        />
      </Environment>

      <PointerTilt>
        <HelixModel
          height={height}
          pairs={pairs}
          steps={steps}
          autoRotate={autoRotate}
          interactive={interactive}
          progressRef={progressRef}
        />
        {molecules ? <Molecules scale={height / 7} /> : null}
      </PointerTilt>

      {interactive ? (
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          minPolarAngle={Math.PI * 0.3}
          maxPolarAngle={Math.PI * 0.7}
        />
      ) : null}
    </Canvas>
  )
}
