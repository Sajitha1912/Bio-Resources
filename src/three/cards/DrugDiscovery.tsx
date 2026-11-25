import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function DrugDiscovery({ hovered }: { hovered: boolean }) {
  const orbit = useRef<Group>(null);
  useFrame((_, delta) => {
    if (orbit.current)
      orbit.current.rotation.z += delta * (hovered ? 0.65 : 0.28);
  });
  return (
    <group>
      <group rotation={[0.25, 0.1, -0.55]}>
        <mesh position={[-0.38, 0, 0]}>
          <capsuleGeometry args={[0.55, 0.55, 8, 16]} />
          <meshPhysicalMaterial
            color="#7bc74d"
            roughness={0.16}
            metalness={0.05}
            clearcoat={1}
            emissive="#7bc74d"
            emissiveIntensity={hovered ? 0.18 : 0.06}
          />
        </mesh>
        <mesh position={[0.38, 0, 0]}>
          <capsuleGeometry args={[0.55, 0.55, 8, 16]} />
          <meshPhysicalMaterial
            color="#f7f5ef"
            roughness={0.12}
            clearcoat={1}
            emissive="#1b8a7a"
            emissiveIntensity={0.05}
          />
        </mesh>
      </group>
      <group ref={orbit}>
        {[
          [1.55, 0.15],
          [1.1, 0.95],
          [-1.35, 0.65],
          [-1.1, -0.9],
          [0.7, -1.25],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, 0]}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshPhysicalMaterial
                color={i % 2 ? "#1b8a7a" : "#7bc74d"}
                emissive={i % 2 ? "#1b8a7a" : "#7bc74d"}
                emissiveIntensity={hovered ? 0.35 : 0.12}
              />
            </mesh>
            {i < 4 ? (
              <mesh rotation={[0, 0, Math.atan2(y, x)]}>
                <cylinderGeometry args={[0.025, 0.025, 0.7, 8]} />
                <meshStandardMaterial color="#f7f5ef" />
              </mesh>
            ) : null}
          </group>
        ))}
      </group>
      <group position={[1.55, 1.0, -0.2]} rotation={[0, 0, -0.6]}>
        <mesh scale={[0.7, 1.15, 0.12]}>
          <sphereGeometry args={[0.42, 20, 12]} />
          <meshPhysicalMaterial
            color="#0f3d2e"
            roughness={0.18}
            clearcoat={1}
            emissive="#7bc74d"
            emissiveIntensity={0.08}
          />
        </mesh>
        <mesh position={[0, 0, -0.02]}>
          <cylinderGeometry args={[0.018, 0.018, 0.9, 8]} />
          <meshStandardMaterial color="#7bc74d" />
        </mesh>
      </group>
    </group>
  );
}
