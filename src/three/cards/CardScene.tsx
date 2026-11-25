import { Float, Lightformer, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";

export function CardScene({
  children,
  hovered = false,
  tilt,
}: {
  children: ReactNode;
  hovered?: boolean;
  tilt?: { x: number; y: number };
}) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale = hovered ? 1.08 : 1;
    const scale =
      group.current.scale.x +
      (targetScale - group.current.scale.x) * Math.min(1, delta * 7);
    group.current.scale.setScalar(scale);
    group.current.rotation.x +=
      ((tilt?.x ?? 0) - group.current.rotation.x) * Math.min(1, delta * 6);
    group.current.rotation.y +=
      ((tilt?.y ?? 0) - group.current.rotation.y) * Math.min(1, delta * 6);
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 7, 6]} intensity={1.8} color="#f7f5ef" />
      <directionalLight
        position={[-5, -2, 4]}
        intensity={0.55}
        color="#1b8a7a"
      />
      <pointLight
        position={[0, 1, 4]}
        intensity={hovered ? 1.1 : 0.55}
        color="#7bc74d"
        distance={8}
      />
      <Environment resolution={32}>
        <Lightformer
          intensity={0.8}
          color="#7bc74d"
          position={[4, 5, -4]}
          scale={[5, 5, 1]}
        />
        <Lightformer
          intensity={0.55}
          color="#1b8a7a"
          position={[-5, -1, 4]}
          scale={[4, 4, 1]}
        />
        <Lightformer
          intensity={0.4}
          color="#f7f5ef"
          position={[5, 2, 3]}
          scale={[3, 3, 1]}
        />
      </Environment>
      <Float
        speed={hovered ? 2.4 : 1.2}
        rotationIntensity={0.18}
        floatIntensity={0.35}
      >
        <group ref={group} scale={0.6}>
          {children}
        </group>
      </Float>
    </>
  );
}
