"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3 } from "three";
import { Text, Float, Line } from "@react-three/drei";
import * as THREE from "three";

export const ProjectPath = ({ scrollProgress }: { scrollProgress: number }) => {
  const droneRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  // Create a 3D path - Adjusted for mobile responsiveness if needed
  const curve = useMemo(() => {
    const scale = isMobile ? 0.6 : 1;
    return new CatmullRomCurve3([
      new Vector3(0, 0, 0),
      new Vector3(5 * scale, -5, -5),
      new Vector3(-5 * scale, -10, -10),
      new Vector3(5 * scale, -15, -15),
      new Vector3(0, -20, -20),
    ]);
  }, [isMobile]);

  const points = useMemo(() => curve.getPoints(100), [curve]);

  useFrame((state) => {
    if (!droneRef.current) return;

    // Position drone on path based on scroll
    const position = curve.getPointAt(scrollProgress);
    droneRef.current.position.copy(position);

    // Look ahead on the path
    const lookAt = curve.getPointAt(Math.min(scrollProgress + 0.01, 1));
    droneRef.current.lookAt(lookAt);

    // Add some dynamic movement
    droneRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.1;
    droneRef.current.position.x += Math.cos(state.clock.elapsedTime) * 0.05;
  });

  return (
    <group>
      <Line
        points={points}
        color="#3b82f6"
        lineWidth={1}
        transparent
        opacity={0.2}
      />

      <group ref={droneRef}>
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} />
          </mesh>
          <pointLight intensity={2} distance={10} color="#60a5fa" />
        </Float>
      </group>

      <ProjectMarker position={curve.getPointAt(0.2)} title="CrowdSchield" isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.45)} title="Rajapura Herbal" isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.7)} title="Vision Expert" isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.95)} title="Winlow Spices" isMobile={isMobile} />
    </group>
  );
};

const ProjectMarker = ({ position, title, isMobile }: { position: Vector3; title: string; isMobile: boolean }) => {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, isMobile ? 0.8 : 0.6, 0]}
        fontSize={isMobile ? 0.3 : 0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  );
};
