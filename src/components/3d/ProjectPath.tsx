"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3 } from "three";
import { Text, Float, Line, Icosahedron, MeshWobbleMaterial, Cylinder, Box } from "@react-three/drei";
import * as THREE from "three";

export const ProjectPath = ({ scrollProgress }: { scrollProgress: number }) => {
  const droneRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  const curve = useMemo(() => {
    const scale = isMobile ? 0.8 : 1.2;
    // Spread horizontally (X) and move through depth (Z) instead of just down (Y)
    return new CatmullRomCurve3([
      new Vector3(-10 * scale, 2, -5),
      new Vector3(-5 * scale, 0, -10),
      new Vector3(8 * scale, -1, -15),
      new Vector3(-8 * scale, -2, -20),
      new Vector3(5 * scale, -1, -25),
      new Vector3(0, 0, -30),
    ]);
  }, [isMobile]);

  const points = useMemo(() => curve.getPoints(200), [curve]);

  useFrame((state) => {
    if (!droneRef.current) return;

    // Position drone on path based on scroll
    const position = curve.getPointAt(scrollProgress);
    droneRef.current.position.copy(position);

    // Look ahead on the path
    const lookAt = curve.getPointAt(Math.min(scrollProgress + 0.01, 1));
    droneRef.current.lookAt(lookAt);

    // Add hover movement
    droneRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  return (
    <group>
      {/* Neon Glowing Path */}
      <Line
        points={points}
        color="#7342E2"
        lineWidth={8}
        transparent
        opacity={0.8}
      />
      {/* Path Core Glow */}
      <Line
        points={points}
        color="#A78BFA"
        lineWidth={2}
        transparent
        opacity={1}
      />

      {/* Pulsing light following the drone */}
      <pointLight
        position={curve.getPointAt(scrollProgress)}
        intensity={5}
        distance={15}
        color="#7342E2"
      />

      {/* The Moving Drone */}
      <group ref={droneRef}>
        <Float speed={10} rotationIntensity={2} floatIntensity={1}>
            <Box args={[0.5, 0.3, 0.7]}>
                <meshStandardMaterial color="#111827" metalness={1} roughness={0.1} />
            </Box>
            <Cylinder args={[0.15, 0.15, 0.2, 32]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.4]}>
                <meshStandardMaterial color="#7342E2" emissive="#7342E2" emissiveIntensity={5} />
            </Cylinder>
            {/* Propellers / Wings */}
            <mesh position={[0.4, 0, 0]}>
                <boxGeometry args={[0.4, 0.02, 0.2]} />
                <meshStandardMaterial color="#4B5563" />
            </mesh>
            <mesh position={[-0.4, 0, 0]}>
                <boxGeometry args={[0.4, 0.02, 0.2]} />
                <meshStandardMaterial color="#4B5563" />
            </mesh>
        </Float>
      </group>

      <ProjectMarker position={curve.getPointAt(0.3)} title="CrowdSchield" index={1} progress={scrollProgress} isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.5)} title="Rajapura Herbal" index={2} progress={scrollProgress} isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.7)} title="Vision Expert" index={3} progress={scrollProgress} isMobile={isMobile} />
      <ProjectMarker position={curve.getPointAt(0.9)} title="Winlow Spices" index={4} progress={scrollProgress} isMobile={isMobile} />
    </group>
  );
};

const ProjectMarker = ({ position, title, index, progress, isMobile }: any) => {
  // Define ranges for each project to stay active
  const ranges = [
    [0.2, 0.4], // Project 1 active range
    [0.4, 0.6], // Project 2 active range
    [0.6, 0.8], // Project 3 active range
    [0.8, 1.0], // Project 4 active range
  ];
  const [start, end] = ranges[index - 1];
  const isActive = progress >= start && progress <= end;

  return (
    <group position={position}>
      {/* Glowing Node */}
      <mesh scale={isActive ? 1.5 : 1}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
            color={isActive ? "#7342E2" : "#334155"}
            emissive={isActive ? "#7342E2" : "#000000"}
            emissiveIntensity={isActive ? 10 : 0}
        />
      </mesh>

      {isActive && (
        <pointLight intensity={2} distance={5} color="#7342E2" />
      )}

      <Text
        position={[0, isMobile ? 0.8 : 1, 0]}
        fontSize={isMobile ? 0.4 : 0.6}
        color={isActive ? "white" : "#475569"}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/plusjakartasans/v3/L0x5DF4xlVMF-BfR8bXMIjhLq38.woff"
      >
        {`${index}. ${title}`}
      </Text>
    </group>
  );
};
