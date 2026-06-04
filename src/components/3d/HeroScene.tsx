"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Stars, MeshWobbleMaterial, TorusKnot } from "@react-three/drei";
import * as THREE from "three";

export const HeroScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t / 4) / 4;
    groupRef.current.rotation.x = Math.cos(t / 4) / 8;

    // Mouse following effect for the group
    const mouseX = (state.mouse.x * viewportWidth(state)) / 20;
    const mouseY = (state.mouse.y * viewportHeight(state)) / 20;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouseX, 0.1);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouseY, 0.1);
  });

  const viewportWidth = (state: any) => state.viewport.width;
  const viewportHeight = (state: any) => state.viewport.height;

  return (
    <group ref={groupRef}>
      {/* Central Interactive Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere
          args={[1.5, 64, 64]}
          scale={hovered ? 1.2 : 1}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <MeshDistortMaterial
            color={hovered ? "#60a5fa" : "#3b82f6"}
            speed={5}
            distort={0.4}
            radius={1}
          />
        </Sphere>
      </Float>

      {/* Orbiting Elements */}
      <OrbitingElement radius={4} speed={0.5} color="#60a5fa">
        <TorusKnot args={[0.4, 0.1, 128, 16]}>
          <MeshWobbleMaterial factor={1} speed={2} color="#60a5fa" />
        </TorusKnot>
      </OrbitingElement>

      <OrbitingElement radius={5} speed={-0.3} color="#2563eb" offset={Math.PI}>
        <octahedronGeometry args={[0.5, 0]} />
        <MeshWobbleMaterial factor={0.5} speed={5} color="#2563eb" />
      </OrbitingElement>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#3b82f6" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#60a5fa" />
    </group>
  );
};

const OrbitingElement = ({ children, radius, speed, offset = 0 }: any) => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 0.5) * (radius / 2);
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return <group ref={ref}>{children}</group>;
};
