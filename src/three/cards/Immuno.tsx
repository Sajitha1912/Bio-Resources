import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Shape, type Group } from "three";

function Antibody({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[-0.16, 0.18, 0]} rotation={[0, 0, -0.55]}>
        <cylinderGeometry args={[0.035, 0.035, 0.55, 8]} />
        <meshStandardMaterial color="#f7f5ef" />
      </mesh>
      <mesh position={[0.16, 0.18, 0]} rotation={[0, 0, 0.55]}>
        <cylinderGeometry args={[0.035, 0.035, 0.55, 8]} />
        <meshStandardMaterial color="#f7f5ef" />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.35, 8]} />
        <meshStandardMaterial color="#7bc74d" />
      </mesh>
    </group>
  );
}

export function Immuno({ hovered }: { hovered: boolean }) {
  const orbit = useRef<Group>(null);
  const shield = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, 1.1);
    s.lineTo(0.9, 0.75);
    s.lineTo(0.78, -0.55);
    s.quadraticCurveTo(0.62, -1.15, 0, -1.45);
    s.quadraticCurveTo(-0.62, -1.15, -0.78, -0.55);
    s.lineTo(-0.9, 0.75);
    s.closePath();
    return s;
  }, []);
  useFrame((_, delta) => {
    if (orbit.current)
      orbit.current.rotation.z += delta * (hovered ? 0.55 : 0.22);
  });
  return (
    <group>
      <group scale={1.05}>
        <mesh>
          <extrudeGeometry
            args={[
              shield,
              {
                depth: 0.18,
                bevelEnabled: true,
                bevelSize: 0.08,
                bevelThickness: 0.06,
                bevelSegments: 3,
              },
            ]}
          />
          <meshPhysicalMaterial
            color="#1b8a7a"
            roughness={0.18}
            clearcoat={1}
            emissive="#1b8a7a"
            emissiveIntensity={hovered ? 0.32 : 0.12}
          />
        </mesh>
      </group>
      <group ref={orbit}>
        <Antibody position={[1.45, 0.8, 0]} rotation={[0, 0, -0.45]} />
        <Antibody position={[-1.45, -0.7, 0]} rotation={[0, 0, 2.7]} />
      </group>
      <mesh position={[0, 0.05, 0.25]}>
        <boxGeometry args={[0.22, 0.75, 0.08]} />
        <meshStandardMaterial
          color="#f7f5ef"
          emissive="#7bc74d"
          emissiveIntensity={hovered ? 0.9 : 0.35}
        />
      </mesh>
      <mesh position={[0, 0.05, 0.26]}>
        <boxGeometry args={[0.75, 0.22, 0.08]} />
        <meshStandardMaterial
          color="#f7f5ef"
          emissive="#7bc74d"
          emissiveIntensity={hovered ? 0.9 : 0.35}
        />
      </mesh>
    </group>
  );
}
