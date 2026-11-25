import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function Computational({ hovered }: { hovered: boolean }) {
  const bits = useRef<Group>(null);
  useFrame((_, delta) => {
    if (bits.current) bits.current.rotation.y += delta * (hovered ? 0.9 : 0.35);
  });
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.8, 1.8, 0.35, 2, 2, 2]} />
        <meshPhysicalMaterial
          color="#0f3d2e"
          roughness={0.12}
          clearcoat={1}
          emissive="#1b8a7a"
          emissiveIntensity={hovered ? 0.28 : 0.12}
        />
      </mesh>
      <mesh position={[0, 0, 0.19]}>
        <boxGeometry args={[1.05, 1.05, 0.05]} />
        <meshPhysicalMaterial
          color="#7bc74d"
          emissive="#7bc74d"
          emissiveIntensity={hovered ? 0.7 : 0.35}
        />
      </mesh>
      {[-0.72, -0.24, 0.24, 0.72].map((x) => (
        <group key={x}>
          {[-1.05, 1.05].map((y) => (
            <mesh key={y} position={[x, y, 0]}>
              <boxGeometry args={[0.12, 0.55, 0.12]} />
              <meshStandardMaterial color="#f7f5ef" metalness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      {[-0.72, -0.24, 0.24, 0.72].map((y) => (
        <mesh key={y} position={[y * 1.15, 0, 0.32]}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshStandardMaterial
            color="#1b8a7a"
            emissive="#1b8a7a"
            emissiveIntensity={hovered ? 1.5 : 0.8}
          />
        </mesh>
      ))}
      <group ref={bits}>
        {[0, 1, 2, 3].map((i) => {
          const a = (i * Math.PI) / 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 1.55, Math.sin(a) * 1.55, 0.25]}
            >
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshPhysicalMaterial
                color="#f7f5ef"
                emissive="#7bc74d"
                emissiveIntensity={0.25}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
