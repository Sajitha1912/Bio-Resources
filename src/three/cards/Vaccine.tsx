import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function Vaccine({ hovered }: { hovered: boolean }) {
  const plunger = useRef<Group>(null);
  const droplets = useRef<Group>(null);
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * (hovered ? 1.8 : 0.8);
    if (plunger.current)
      plunger.current.position.y = -0.15 + Math.sin(t) * 0.12;
    if (droplets.current)
      droplets.current.rotation.y += delta * (hovered ? 0.8 : 0.25);
  });
  return (
    <group>
      <group position={[-0.35, 0, 0]} rotation={[0, 0, -0.18]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 1.55, 24, 1, true]} />
          <meshPhysicalMaterial
            color="#f7f5ef"
            transparent
            opacity={0.55}
            roughness={0.1}
            clearcoat={1}
            side={2}
          />
        </mesh>
        <mesh position={[0, -0.72, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.55, 16]} />
          <meshStandardMaterial color="#f7f5ef" metalness={0.2} />
        </mesh>
        <mesh position={[0, -1.02, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.7, 10]} />
          <meshStandardMaterial color="#7bc74d" />
        </mesh>
        <group ref={plunger}>
          <mesh position={[0, 0.92, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.12, 20]} />
            <meshPhysicalMaterial
              color="#1b8a7a"
              emissive="#1b8a7a"
              emissiveIntensity={hovered ? 0.35 : 0.12}
            />
          </mesh>
          <mesh position={[0, 1.35, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.75, 12]} />
            <meshStandardMaterial color="#f7f5ef" />
          </mesh>
        </group>
      </group>
      <group position={[1.05, -0.55, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.22, 0.85, 20]} />
          <meshPhysicalMaterial
            color="#7bc74d"
            transparent
            opacity={0.55}
            emissive="#7bc74d"
            emissiveIntensity={hovered ? 0.35 : 0.12}
          />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.1, 20]} />
          <meshStandardMaterial color="#f7f5ef" />
        </mesh>
      </group>
      <group ref={droplets} position={[0.2, -1.25, 0]}>
        {[0, 1, 2].map((i) => {
          const a = i * 2.1;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * (0.4 + i * 0.08), Math.sin(a) * 0.18, 0]}
            >
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshPhysicalMaterial
                color="#7bc74d"
                emissive="#7bc74d"
                emissiveIntensity={hovered ? 0.8 : 0.35}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
