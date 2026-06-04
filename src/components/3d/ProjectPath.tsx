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
    const scale = isMobile ? 0.6 : 1;
    return new CatmullRomCurve3([
      new Vector3(0, 0, 0),
      new Vector3(6 * scale, -5, -8),
      new Vector3(-6 * scale, -12, -15),
      new Vector3(6 * scale, -20, -22),
      new Vector3(0, -28, -30),
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
    droneRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });

  return (
    <group>
      {/* The Road/Path - Double line for road effect */}
      <Line
        points={points.map(p => new Vector3(p.x - 0.2, p.y, p.z))}
        color="#7342E2"
        lineWidth={3}
        transparent
        opacity={0.3}
      />
      <Line
        points={points.map(p => new Vector3(p.x + 0.2, p.y, p.z))}
        color="#7342E2"
        lineWidth={3}
        transparent
        opacity={0.3}
      />

      {/* Decorative Path Markers (Dashed lines effect) */}
      {points.filter((_, i) => i % 5 === 0).map((p, i) => (
         <mesh key={i} position={p} rotation={[Math.PI/2, 0, 0]}>
            <boxGeometry args={[0.05, 0.2, 0.01]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
         </mesh>
      ))}

      {/* The Moving Drone - Inspired by the camera/drone in image */}
      <group ref={droneRef}>
        <Float speed={10} rotationIntensity={2} floatIntensity={1}>
            {/* Camera body */}
            <Box args={[0.4, 0.4, 0.6]}>
                <meshStandardMaterial color="#192837" metalness={0.8} roughness={0.2} />
            </Box>
            {/* Lens */}
            <Cylinder args={[0.15, 0.15, 0.2, 32]} rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0.35]}>
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
            </Cylinder>
            {/* Side wings */}
            <Box args={[0.8, 0.05, 0.2]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#7342E2" />
            </Box>

            <pointLight intensity={2} distance={10} color="#7342E2" />
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
      {/* Node/Stop */}
      <mesh scale={isActive ? 1.5 : 1}>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
        <meshStandardMaterial
            color={isActive ? "#7342E2" : "#1e293b"}
            emissive={isActive ? "#7342E2" : "#000000"}
            emissiveIntensity={2}
        />
      </mesh>

      {isActive && (
        <Float speed={5} rotationIntensity={0} floatIntensity={0.5}>
            <Icosahedron args={[0.15, 0]} position={[0, 0.5, 0]}>
                <MeshWobbleMaterial factor={0.6} speed={3} color="#7342E2" emissive="#7342E2" emissiveIntensity={1} />
            </Icosahedron>
        </Float>
      )}

      <Text
        position={[0, isMobile ? 1.2 : 1, 0]}
        fontSize={isMobile ? 0.35 : 0.5}
        color={isActive ? "white" : "#64748b"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {`${index}. ${title}`}
      </Text>
    </group>
  );
};
