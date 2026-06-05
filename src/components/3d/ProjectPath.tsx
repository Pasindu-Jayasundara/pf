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

  // Define a cleaner, gentler path
  const curve = useMemo(() => {
    return new CatmullRomCurve3([
      new Vector3(0, 0, 0),
      new Vector3(5, -1, -20),
      new Vector3(-5, -3, -50),
      new Vector3(0, -5, -80),
      new Vector3(5, -7, -110),
      new Vector3(0, -10, -150),
    ]);
  }, []);

  const roadGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 1.5, 8, false);
  }, [curve]);

  useFrame((state) => {
    if (!droneRef.current || !state.camera) return;

    // 1. Human Position & Rotation
    const progress = Math.max(0.0001, Math.min(scrollProgress, 0.9999));
    const pos = curve.getPointAt(progress);
    const tangent = curve.getTangentAt(progress);

    // Offset human ABOVE the path so it's not overlapped
    const upOffset = new Vector3(0, 0.8, 0);
    droneRef.current.position.copy(pos).add(upOffset);

    // Look ahead on the path
    const lookAtPos = curve.getPointAt(Math.min(progress + 0.01, 1)).add(upOffset);
    droneRef.current.lookAt(lookAtPos);

    // 2. Camera Following Logic
    // Offset camera behind and slightly above the human
    const offset = new Vector3(0, 4, 10);
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
            color="#2563eb"
            emissive="#1d4ed8"
            emissiveIntensity={0.5}
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
        lineWidth={5}
        transparent
        opacity={0.8}
      />

      {/* Atmospheric lighting following the drone */}
      <pointLight
        position={curve.getPointAt(scrollProgress)}
        intensity={30}
        distance={30}
        color="#00F2FE"
      />

      {/* The Walking Human Avatar */}
      <group ref={droneRef}>
        <HumanModel />
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

const HumanModel = () => {
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!bodyRef.current) return;
    // Walk animation
    const t = state.clock.getElapsedTime();
    const legL = bodyRef.current.children[2];
    const legR = bodyRef.current.children[3];
    const armL = bodyRef.current.children[4];
    const armR = bodyRef.current.children[5];

    if (legL && legR && armL && armR) {
        legL.rotation.x = Math.sin(t * 10) * 0.5;
        legR.rotation.x = Math.sin(t * 10 + Math.PI) * 0.5;
        armL.rotation.x = Math.sin(t * 10 + Math.PI) * 0.5;
        armR.rotation.x = Math.sin(t * 10) * 0.5;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Torso */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.2]} />
        <meshStandardMaterial color="#7342E2" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FFD1AA" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0.1, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.25, 0.5, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#7342E2" />
      </mesh>
      <mesh position={[0.25, 0.5, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#7342E2" />
      </mesh>
    </group>
  );
};

const ProjectPanel = ({ position, project, isActive }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current && isActive) {
        // Smoothly rotate to face camera when active
        groupRef.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={groupRef} position={position}>
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
