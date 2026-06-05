"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, Matrix4, Quaternion } from "three";
import { Text, Float, Line, Box, PerspectiveCamera, Html, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { PROJECTS } from "@/constants";

export const ProjectPath = ({ scrollProgress }: { scrollProgress: number }) => {
  const droneRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  // Define a longer, more winding path for the "road"
  const curve = useMemo(() => {
    return new CatmullRomCurve3([
      new Vector3(0, 0, 0),
      new Vector3(10, -2, -15),
      new Vector3(-10, -5, -35),
      new Vector3(15, -10, -55),
      new Vector3(-15, -15, -75),
      new Vector3(0, -20, -100),
    ]);
  }, []);

  const roadGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 1.5, 8, false);
  }, [curve]);

  useFrame((state) => {
    if (!droneRef.current || !state.camera) return;

    // 1. Drone Position & Rotation
    const progress = Math.max(0.0001, Math.min(scrollProgress, 0.9999));
    const pos = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress);

    droneRef.current.position.copy(pos);

    // Look ahead on the path
    const lookAtPos = curve.getPointAt(Math.min(progress + 0.01, 1));
    droneRef.current.lookAt(lookAtPos);

    // 2. Camera Following Logic
    // Offset camera behind and slightly above the drone
    const offset = new Vector3(0, 3, 8);
    // Rotate offset to match path direction
    const matrix = new Matrix4().lookAt(pos, lookAtPos, new Vector3(0, 1, 0));
    const quat = new Quaternion().setFromRotationMatrix(matrix);
    offset.applyQuaternion(quat);

    const targetCameraPos = pos.clone().add(offset);
    state.camera.position.lerp(targetCameraPos, 0.1);
    state.camera.lookAt(pos.clone().add(tangent.multiplyScalar(5)));
  });

  return (
    <group>
      {/* The Road */}
      <mesh geometry={roadGeometry}>
        <meshStandardMaterial
            color="#111827"
            metalness={0.8}
            roughness={0.2}
            wireframe={false}
            transparent
            opacity={0.9}
        />
      </mesh>

      {/* Glowing Edges of the Road */}
      <Line
        points={curve.getPoints(100)}
        color="#7342E2"
        lineWidth={3}
        transparent
        opacity={0.5}
      />

      {/* Atmospheric lighting following the drone */}
      <pointLight
        position={curve.getPointAt(scrollProgress)}
        intensity={10}
        distance={20}
        color="#00F2FE"
      />

      {/* The Moving Drone / Traveler */}
      <group ref={droneRef}>
        <Float speed={5} rotationIntensity={1} floatIntensity={0.5}>
            <mesh>
                <boxGeometry args={[0.6, 0.2, 0.8]} />
                <meshStandardMaterial color="#7342E2" emissive="#7342E2" emissiveIntensity={0.5} />
            </mesh>
            {/* Front Light */}
            <mesh position={[0, 0, 0.4]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#00F2FE" emissive="#00F2FE" emissiveIntensity={2} />
            </mesh>
        </Float>
      </group>

      {/* Project Milestones */}
      {PROJECTS.map((project, i) => {
        const t = 0.2 + (i * 0.22); // Distribute projects along the path
        const position = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);

        // Offset panel to the side of the road
        const sideOffset = new Vector3(6, 2, 0);
        const matrix = new Matrix4().lookAt(new Vector3(0, 0, 0), tangent, new Vector3(0, 1, 0));
        const quat = new Quaternion().setFromRotationMatrix(matrix);
        sideOffset.applyQuaternion(quat);

        const panelPos = position.clone().add(sideOffset);

        return (
          <ProjectPanel
            key={i}
            position={panelPos}
            project={project}
            isActive={Math.abs(scrollProgress - t) < 0.15}
          />
        );
      })}
    </group>
  );
};

const ProjectPanel = ({ position, project, isActive }: any) => {
  return (
    <group position={position}>
      {/* Floating 3D Panel */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Box args={[5, 3.5, 0.1]} scale={isActive ? 1.1 : 1}>
          <meshStandardMaterial
            color="#0A0C16"
            transparent
            opacity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </Box>

        <mesh position={[0, 0, 0.06]} scale={isActive ? 1.05 : 1}>
            <planeGeometry args={[4.8, 3.3]} />
            <meshStandardMaterial
                color={isActive ? "#7342E2" : "#1e293b"}
                transparent
                opacity={0.2}
                emissive={isActive ? "#7342E2" : "#000"}
                emissiveIntensity={0.5}
            />
        </mesh>

        <Html
          transform
          distanceFactor={4}
          position={[0, 0, 0.1]}
          className="pointer-events-none select-none"
        >
          <div className={`w-[400px] p-6 rounded-xl transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95 grayscale'}`}>
            <h3 className="text-3xl font-bold text-white mb-2 leading-tight">{project.title}</h3>
            <p className="text-blue-400 font-mono text-sm mb-4">{project.duration}</p>
            <p className="text-white/70 text-base leading-relaxed mb-6 line-clamp-3">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/60">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Html>
      </Float>

      {/* Decorative Connector to Road */}
      <Line
        points={[new Vector3(0, 0, 0), new Vector3(-4, -2, 0)]}
        color={isActive ? "#00F2FE" : "#334155"}
        lineWidth={1}
        transparent
        opacity={0.3}
      />
    </group>
  );
};
