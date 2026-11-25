import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function MedicinalPlant({ hovered }: { hovered: boolean }) {
  const leaf = useRef<Group>(null);
  useFrame((state) => {
    if (leaf.current)
      leaf.current.rotation.z =
        Math.sin(state.clock.elapsedTime * (hovered ? 2.2 : 0.9)) * 0.12;
  });
  return (
    <group>
      <group ref={leaf}>
        <mesh scale={[1.15, 1.45, 0.12]} position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.62, 32, 16]} />
          <meshPhysicalMaterial
            color="#7bc74d"
            transparent
            opacity={0.92}
            roughness={0.24}
            clearcoat={1}
            side={2}
            emissive="#0f3d2e"
            emissiveIntensity={hovered ? 0.16 : 0.06}
          />
        </mesh>
        <mesh position={[0, -0.55, -0.02]}>
          <cylinderGeometry args={[0.025, 0.025, 1.8, 10]} />
          <meshStandardMaterial color="#f7f5ef" roughness={0.3} />
        </mesh>
        {[-0.5, -0.22, 0.08, 0.36].map((y) => (
          <group key={y} position={[0, y, 0.08]}>
            <mesh position={[0.28, -0.05, 0]} rotation={[0, 0, -0.55]}>
              <cylinderGeometry args={[0.012, 0.012, 0.65, 8]} />
              <meshStandardMaterial color="#1b8a7a" />
            </mesh>
            <mesh position={[-0.28, -0.05, 0]} rotation={[0, 0, 0.55]}>
              <cylinderGeometry args={[0.012, 0.012, 0.65, 8]} />
              <meshStandardMaterial color="#1b8a7a" />
            </mesh>
          </group>
        ))}
      </group>
      {[
        [1.4, 0.8],
        [1.1, -0.8],
        [-1.35, 0.25],
        [-1.0, -1],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.2]}>
          <sphereGeometry args={[i % 2 ? 0.06 : 0.09, 12, 12]} />
          <meshPhysicalMaterial
            color="#f7f5ef"
            emissive="#7bc74d"
            emissiveIntensity={hovered ? 0.5 : 0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
