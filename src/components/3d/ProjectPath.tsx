"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3 } from "three";
import { Text, Float, Line, Box, Html } from "@react-three/drei";
import * as THREE from "three";
import { PROJECTS } from "@/constants";

export const ProjectPath = ({ scrollProgress }: { scrollProgress: number }) => {
  const droneRef = useRef<THREE.Group>(null);

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
    let cameraOffset = new Vector3(0, 8, 15);

    // Zoom out and focus at the end to see the final milestone
    if (progress > 0.95) {
        cameraOffset = new Vector3(0, 6, 12);
    }

    const targetCameraPos = pos.clone().add(cameraOffset);
    state.camera.position.lerp(targetCameraPos, 0.1);

    // Look ahead at the human and slightly beyond
    if (progress > 0.97) {
        // At the very end, focus exactly on the final milestone
        const milestonePos = curve.getPointAt(1).add(new Vector3(0, 3, 0));
        state.camera.lookAt(milestonePos);
    } else if (progress > 0.90) {
        // Transition lookAt
        const milestonePos = curve.getPointAt(1).add(new Vector3(0, 3, 0));
        const lookTarget = pos.clone().add(new Vector3(0, 2, 0)).lerp(milestonePos, (progress - 0.9) * 10);
        state.camera.lookAt(lookTarget);
    } else {
        // Look at the human's feet/road position but slightly ahead
        state.camera.lookAt(pos.clone().add(new Vector3(0, 2, 0)));
    }
  });

  const currentProgress = THREE.MathUtils.clamp(scrollProgress, 0, 1);

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
        position={curve.getPointAt(currentProgress)}
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
        const side = i % 2 === 0 ? 1 : -1;
        const worldUp = new Vector3(0, 1, 0);

        const sideOffset = new Vector3()
          .crossVectors(tangent, worldUp)
          .normalize()
          .multiplyScalar(side * 8);
        const panelPos = position
          .clone()
          .add(sideOffset)
          .add(new Vector3(0, 2.8, 0));
        const roadAnchor = position.clone().add(new Vector3(0, 1.2, 0));
        const panelAnchor = panelPos.clone().add(new Vector3(0, -1.4, 0));
        const distanceFromProject = Math.abs(currentProgress - t);
        const focus = THREE.MathUtils.clamp(1 - distanceFromProject / 0.2, 0, 1);
        const easedFocus = THREE.MathUtils.smoothstep(focus, 0, 1);

        return (
          <group key={project.title}>
            <Line
              points={[roadAnchor, panelAnchor]}
              color={easedFocus > 0.6 ? "#00F2FE" : "#334155"}
              lineWidth={2}
              transparent
              opacity={easedFocus * 0.6}
            />
            <ProjectPanel
              position={panelPos}
              project={project}
              focus={focus}
            />
          </group>
        );
      })}

      {/* The Journey Continues - Final Milestone */}
      <FinalMilestone position={curve.getPointAt(1).add(new Vector3(0, 3, 0))} />
    </group>
  );
};

const HumanModel = ({ scrollProgress }: { scrollProgress: number }) => {
  const bodyRef = useRef<THREE.Group>(null);
  const legLRef = useRef<THREE.Group>(null);
  const legRRef = useRef<THREE.Group>(null);
  const armLRef = useRef<THREE.Group>(null);
  const armRRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Walk animation synced to scroll with a stable stride count.
    const phase = scrollProgress * Math.PI * 24;
    const swing = Math.sin(phase) * 0.45;
    const bob = Math.abs(Math.sin(phase)) * 0.06;

    if (bodyRef.current) bodyRef.current.position.y = bob;
    if (legLRef.current) legLRef.current.rotation.x = swing;
    if (legRRef.current) legRRef.current.rotation.x = -swing;
    if (armLRef.current) armLRef.current.rotation.x = -swing;
    if (armRRef.current) armRRef.current.rotation.x = swing;
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
      <group ref={legLRef} position={[-0.1, 0.35, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>
      <group ref={legRRef} position={[0.1, 0.35, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>
      </group>
      {/* Arms */}
      <group ref={armLRef} position={[-0.25, 0.75, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color="#7342E2" />
        </mesh>
      </group>
      <group ref={armRRef} position={[0.25, 0.75, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color="#7342E2" />
        </mesh>
      </group>
    </group>
  );
};

const FinalMilestone = ({ position }: { position: Vector3 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
        // Face camera but stay upright
        const target = state.camera.position.clone();
        target.y = groupRef.current.position.y;
        groupRef.current.lookAt(target);
    }
  });

  return (
    <group ref={groupRef} position={position}>
        <Float speed={4} rotationIntensity={0.1} floatIntensity={0.3}>
            <Text
                fontSize={0.6}
                color="#FFFFFF"
                anchorX="center"
                anchorY="middle"
                maxWidth={20}
                letterSpacing={0.25}
                font="/fonts/Geist-Bold.ttf"
            >
                THE JOURNEY CONTINUES...
                <meshStandardMaterial
                  color="#FFFFFF"
                  emissive="#00F2FE"
                  emissiveIntensity={12}
                  toneMapped={false}
                />
            </Text>
        </Float>
        <pointLight intensity={150} distance={40} color="#00F2FE" />
    </group>
  );
};

type ProjectPanelProps = {
  position: Vector3;
  project: (typeof PROJECTS)[number];
  focus: number;
};

const ProjectPanel = ({ position, project, focus }: ProjectPanelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const easedFocus = THREE.MathUtils.smoothstep(focus, 0, 1);

  useFrame(() => {
    if (groupRef.current) {
        // Face camera but stay upright (no tilting)
        const target = camera.position.clone();
        target.y = groupRef.current.position.y;
        groupRef.current.lookAt(target);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={0.78 + easedFocus * 0.28}>
      {/* Floating 3D Panel */}
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <Box args={[7, 4.5, 0.1]}>
          <meshStandardMaterial
            color="#0A0C16"
            transparent
            opacity={easedFocus}
            metalness={0.9}
            roughness={0.1}
          />
        </Box>

        <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[6.8, 4.3]} />
            <meshStandardMaterial
                color={easedFocus > 0.6 ? "#7342E2" : "#3b82f6"}
                transparent
                opacity={easedFocus * 0.5}
                emissive={easedFocus > 0.6 ? "#7342E2" : "#3b82f6"}
                emissiveIntensity={0.4 + easedFocus * 1.6}
            />
        </mesh>

        <Html
          transform
          distanceFactor={6} // Adjusted for better visibility
          position={[0, 0, 0.2]}
          className="pointer-events-none select-none"
        >
          <div
            className="w-[800px] p-10 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/20"
            style={{
              opacity: easedFocus,
              transform: `scale(${0.92 + easedFocus * 0.08})`,
              transition: "opacity 180ms ease, transform 180ms ease",
            }}
          >
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
    </group>
  );
};
