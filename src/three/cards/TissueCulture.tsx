import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function TissueCulture({ hovered }: { hovered: boolean }) {
  const sprout = useRef<Group>(null);
  useFrame((state) => {
    if (sprout.current)
      sprout.current.scale.y =
        0.55 +
        ((Math.sin(state.clock.elapsedTime * (hovered ? 2 : 0.8)) + 1) / 2) *
          0.55;
  });
  return (
    <group>
      <mesh position={[0, -0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.18, 32]} />
        <meshPhysicalMaterial
          color="#0f3d2e"
          transparent
          opacity={0.58}
          roughness={0.12}
          clearcoat={1}
          emissive="#1b8a7a"
          emissiveIntensity={hovered ? 0.28 : 0.12}
        />
      </mesh>
      <mesh position={[0, -0.61, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.06, 12, 32]} />
        <meshStandardMaterial
          color="#7bc74d"
          emissive="#7bc74d"
          emissiveIntensity={hovered ? 1.2 : 0.55}
        />
      </mesh>
      <group ref={sprout} position={[0, -0.55, 0.05]}>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.045, 0.06, 1.3, 10]} />
          <meshStandardMaterial color="#7bc74d" />
        </mesh>
        <mesh
          position={[-0.38, 1.05, 0]}
          rotation={[0, 0, -0.75]}
          scale={[0.8, 1.15, 0.12]}
        >
          <sphereGeometry args={[0.42, 20, 12]} />
          <meshPhysicalMaterial
            color="#1b8a7a"
            emissive="#7bc74d"
            emissiveIntensity={hovered ? 0.35 : 0.12}
          />
        </mesh>
        <mesh
          position={[0.38, 1.25, 0]}
          rotation={[0, 0, 0.75]}
          scale={[0.8, 1.15, 0.12]}
        >
          <sphereGeometry args={[0.42, 20, 12]} />
          <meshPhysicalMaterial
            color="#7bc74d"
            emissive="#7bc74d"
            emissiveIntensity={hovered ? 0.35 : 0.12}
          />
        </mesh>
      </group>
      {[
        [-0.85, -0.45],
        [0.72, -0.38],
        [0.55, 0.05],
        [-0.55, -0.2],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, -0.48, y]}>
          <sphereGeometry args={[0.11 + (i % 2) * 0.04, 16, 16]} />
          <meshPhysicalMaterial
            color="#f7f5ef"
            transparent
            opacity={0.72}
            emissive="#1b8a7a"
            emissiveIntensity={hovered ? 0.5 : 0.18}
          />
        </mesh>
      ))}
    </group>
  );
}
