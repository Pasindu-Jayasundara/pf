"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3 } from "three";
import { Text, Float, Line, Icosahedron, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

export const ProjectPath = ({ scrollProgress }: { scrollProgress: number }) => {
  const droneRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  const curve = useMemo(() => {
    const scale = isMobile ? 0.6 : 1;
    return new CatmullRomCurve3([
      new Vector3(0, 0, 0),
      new Vector3(6 * scale, -5, -8),
      new Vector3(-6 * scale, -12, -15),
      new Vector3(6 * scale, -20, -22),
      new Vector3(0, -28, -30),
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

    // Add complex rotation and movement
    droneRef.current.rotation.z += 0.05;
    droneRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.15;
  });

  return (
    <group>
      <Line
        points={points}
        color="#3b82f6"
        lineWidth={2}
        transparent
        opacity={0.15}
      />

      {/* The Moving 3D Object - Detailed Icosahedron */}
      <group ref={droneRef}>
        <Float speed={8} rotationIntensity={3} floatIntensity={2}>
            <Icosahedron args={[0.5, 0]}>
                <MeshWobbleMaterial factor={0.6} speed={3} color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} />
            </Icosahedron>
            <pointLight intensity={3} distance={15} color="#3b82f6" />
            <pointLight position={[1, 1, 1]} intensity={1} color="#ffffff" />
        </Float>
      </group>

      <ProjectMarker position={curve.getPointAt(0.2)} title="CrowdSchield" index={1} progress={scrollProgress} isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.45)} title="Rajapura Herbal" index={2} progress={scrollProgress} isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.7)} title="Vision Expert" index={3} progress={scrollProgress} isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.95)} title="Winlow Spices" index={4} progress={scrollProgress} isMobile={isMobile} />
    </group>
  );
};

const ProjectMarker = ({ position, title, index, progress, isMobile }: any) => {
  const milestoneProgress = [0.2, 0.45, 0.7, 0.95][index - 1];
  const isActive = Math.abs(progress - milestoneProgress) < 0.05;

  return (
    <group position={position}>
      <mesh scale={isActive ? 1.5 : 1}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
            color={isActive ? "#3b82f6" : "#1e293b"}
            emissive={isActive ? "#3b82f6" : "#000000"}
            emissiveIntensity={2}
        />
      </mesh>

      {isActive && (
        <mesh>
            <ringGeometry args={[0.3, 0.35, 32]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}

      <Text
        position={[0, isMobile ? 1 : 0.8, 0]}
        fontSize={isMobile ? 0.35 : 0.5}
        color={isActive ? "white" : "#64748b"}
        anchorX="center"
        anchorY="middle"
      >
        {`${index}. ${title}`}
      </Text>
    </group>
  );
};
