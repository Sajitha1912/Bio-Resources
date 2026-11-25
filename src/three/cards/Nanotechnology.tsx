import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function Nanotechnology({ hovered }: { hovered: boolean }) {
  const electrons = useRef<Group>(null);
  useFrame((_, delta) => {
    if (electrons.current)
      electrons.current.rotation.z += delta * (hovered ? 1.2 : 0.45);
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.58, 32, 32]} />
        <meshPhysicalMaterial
          color="#7bc74d"
          roughness={0.12}
          clearcoat={1}
          emissive="#7bc74d"
          emissiveIntensity={hovered ? 0.75 : 0.32}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.82, 24, 24]} />
        <meshBasicMaterial
          color="#7bc74d"
          transparent
          opacity={hovered ? 0.12 : 0.07}
        />
      </mesh>
      {[0, Math.PI / 3, -Math.PI / 3].map((r, i) => (
        <mesh key={i} rotation={[r, 0.35, i * 0.35]}>
          <torusGeometry args={[1.28, 0.025, 8, 64]} />
          <meshStandardMaterial
            color={i === 1 ? "#1b8a7a" : "#f7f5ef"}
            emissive={i === 1 ? "#1b8a7a" : "#7bc74d"}
            emissiveIntensity={hovered ? 0.8 : 0.35}
          />
        </mesh>
      ))}
      <group ref={electrons}>
        {[0, 1, 2].map((i) => {
          const a = i * Math.PI * 0.67;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(a) * 1.28,
                Math.sin(a) * 0.55,
                Math.sin(a) * 0.7,
              ]}
            >
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshPhysicalMaterial
                color="#f7f5ef"
                emissive="#7bc74d"
                emissiveIntensity={hovered ? 1.5 : 0.7}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
