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
    // Road radius is 1.5. Human model's feet are slightly below origin, so 1.7 feels solid.
    const upOffset = new Vector3(0, 1.7, 0);
    droneRef.current.position.copy(pos).add(upOffset);

    // Look ahead on the path
    const lookAtPos = curve.getPointAt(Math.min(progress + 0.01, 1)).add(upOffset);
    droneRef.current.lookAt(lookAtPos);

    // 2. Camera Following Logic - FIXED WORLD SPACE OFFSET
    // We want the camera to always be above and behind the human in world space
    // to avoid clipping through the tube as it curves.
    // Adjusted Y and Z offset for better framing.
    const targetCameraPos = pos.clone().add(new Vector3(0, 8, 15));
    state.camera.position.lerp(targetCameraPos, 0.1);

    // Look ahead at the human and slightly beyond
    if (progress > 0.92) {
        // At the end, focus on the final milestone
        const milestonePos = curve.getPointAt(1).add(new Vector3(0, 3, 0));
        state.camera.lookAt(milestonePos);
    } else {
        // Look at the human's feet/road position but slightly ahead
        state.camera.lookAt(pos.clone().add(new Vector3(0, 2, 0)));
    }
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
        <HumanModel scrollProgress={scrollProgress} />
      </group>

      {/* Project Milestones */}
      {PROJECTS.map((project, i) => {
        const t = 0.2 + (i * 0.22); // Distribute projects along the path
        const position = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);

        // Offset panel to the side of the road - moved further to avoid clipping
        const sideOffset = new Vector3(6.5, 2.5, 0);
        const matrix = new Matrix4().lookAt(new Vector3(0, 0, 0), tangent, new Vector3(0, 1, 0));
        const quat = new Quaternion().setFromRotationMatrix(matrix);
        sideOffset.applyQuaternion(quat);

        const panelPos = position.clone().add(sideOffset);

        return (
          <ProjectPanel
            key={i}
            position={panelPos}
            roadPosition={position}
            project={project}
            isActive={Math.abs(scrollProgress - t) < 0.08}
            isNear={Math.abs(scrollProgress - t) < 0.2}
          />
        );
      })}

      {/* The Journey Continues - Final Milestone */}
      <FinalMilestone position={curve.getPointAt(1).add(new Vector3(0, 3, 0))} />
    </group>
  );
};

const HumanModel = ({ scrollProgress }: { scrollProgress: number }) => {
  const legLRef = useRef<THREE.Mesh>(null);
  const legRRef = useRef<THREE.Mesh>(null);
  const armLRef = useRef<THREE.Mesh>(null);
  const armRRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    // Walk animation synced to scroll
    const t = scrollProgress * 100;

    if (legLRef.current) legLRef.current.rotation.x = Math.sin(t * 10) * 0.5;
    if (legRRef.current) legRRef.current.rotation.x = Math.sin(t * 10 + Math.PI) * 0.5;
    if (armLRef.current) armLRef.current.rotation.x = Math.sin(t * 10 + Math.PI) * 0.5;
    if (armRRef.current) armRRef.current.rotation.x = Math.sin(t * 10) * 0.5;
  });

  return (
    <group>
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
      <mesh ref={legLRef} position={[-0.1, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh ref={legRRef} position={[0.1, 0.1, 0]}>
        <boxGeometry args={[0.15, 0.5, 0.15]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      {/* Arms */}
      <mesh ref={armLRef} position={[-0.25, 0.5, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#7342E2" />
      </mesh>
      <mesh ref={armRRef} position={[0.25, 0.5, 0]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#7342E2" />
      </mesh>
    </group>
  );
};

const FinalMilestone = ({ position }: { position: Vector3 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
        // Look at camera but stay upright
        const target = state.camera.position.clone();
        target.y = groupRef.current.position.y;
        groupRef.current.lookAt(target);
    }
  });

  return (
    <group ref={groupRef} position={position}>
        <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text
                fontSize={1.2}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                maxWidth={40}
            >
                THE JOURNEY CONTINUES...
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive="#FFFFFF"
                  emissiveIntensity={2}
                  toneMapped={false}
                />
            </Text>
            {/* Background glow plate */}
            <mesh position={[0, 0, -0.8]}>
              <planeGeometry args={[12, 4]} />
              <meshBasicMaterial color="#7342E2" transparent opacity={0.5} />
            </mesh>
        </Float>
        <pointLight intensity={200} distance={100} color="#7342E2" />
    </group>
  );
};

const ProjectPanel = ({ position, roadPosition, project, isActive, isNear }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
        // Face camera but stay upright (no tilting)
        const target = camera.position.clone();
        target.y = groupRef.current.position.y;
        groupRef.current.lookAt(target);
    }
  });

  // Calculate local vector from panel to road
  const roadLocal = useMemo(() => {
    return new Vector3().copy(roadPosition).sub(position);
  }, [roadPosition, position]);

  return (
    <group ref={groupRef} position={position} visible={isNear}>
      {/* Floating 3D Panel */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <Box args={[7, 4.5, 0.1]} scale={isActive ? 1.4 : 1}>
          <meshStandardMaterial
            color="#0A0C16"
            transparent
            opacity={isActive ? 1 : 0.7}
            metalness={0.9}
            roughness={0.1}
          />
        </Box>

        <mesh position={[0, 0, 0.06]} scale={isActive ? 1.3 : 1}>
            <planeGeometry args={[6.8, 4.3]} />
            <meshStandardMaterial
                color={isActive ? "#7342E2" : "#3b82f6"}
                transparent
                opacity={isActive ? 0.5 : 0.3}
                emissive={isActive ? "#7342E2" : "#3b82f6"}
                emissiveIntensity={isActive ? 2 : 0.5}
            />
        </mesh>

        <Html
          transform
          distanceFactor={6} // Adjusted for better visibility
          position={[0, 0, 0.2]}
          className="pointer-events-none select-none"
        >
          <div className={`w-[800px] p-10 rounded-2xl transition-all duration-500 bg-black/60 backdrop-blur-xl border border-white/20 ${isActive ? 'opacity-100 scale-105' : 'opacity-60 scale-90'}`}>
            <h3 className="text-6xl font-bold text-white mb-6 leading-tight">{project.title}</h3>
            <p className="text-blue-400 font-mono text-2xl mb-4">{project.duration}</p>
            <p className="text-white/90 text-2xl leading-relaxed mb-10">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-4">
              {project.tags.slice(0, 4).map((tag: string) => (
                <span key={tag} className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-xl text-white/80">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Html>
      </Float>

      {/* Decorative Connector to Road */}
      <Line
        // We need to rotate the roadLocal back into the panel's local space to point correctly
        // But since we use lookAt, it's easier to just draw a line in world space if possible?
        // R3F Line points are local.
        points={[new Vector3(0, 0, 0), new Vector3(0, -2.5, -5)]} // Simplified placeholder that points generally down/back
        color={isActive ? "#00F2FE" : "#334155"}
        lineWidth={2}
        transparent
        opacity={0.5}
      />
    </group>
  );
};
