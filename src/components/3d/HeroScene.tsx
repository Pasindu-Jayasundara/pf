"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Text,
  MeshDistortMaterial,
  Sphere,
  Environment,
  PresentationControls,
  ContactShadows,
  Instances,
  Instance
} from "@react-three/drei";
import * as THREE from "three";

const FloatingObjects = () => {
  const count = 20;
  const positions = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      speed: Math.random() * 0.2 + 0.1
    }));
  }, []);

  return (
    <group>
      {positions.map((item, i) => (
        <Float
          key={i}
          speed={item.speed * 5}
          rotationIntensity={2}
          floatIntensity={2}
          position={item.position as any}
        >
          <mesh rotation={item.rotation as any}>
            {i % 3 === 0 ? (
              <boxGeometry args={[0.5, 0.5, 0.5]} />
            ) : i % 3 === 1 ? (
              <torusGeometry args={[0.3, 0.1, 16, 32]} />
            ) : (
              <octahedronGeometry args={[0.4]} />
            )}
            <meshStandardMaterial
              color={i % 2 === 0 ? "#7342E2" : "#00F2FE"}
              emissive={i % 2 === 0 ? "#7342E2" : "#00F2FE"}
              emissiveIntensity={0.5}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const InteractiveCore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Follow mouse with some easing
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;

    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x * 0.5 + 2, 0.1);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y * 0.5, 0.1);

    groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <icosahedronGeometry args={[2, 2]} />
          <MeshDistortMaterial
            color="#7342E2"
            speed={2}
            distort={0.4}
            radius={1}
            emissive="#7342E2"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Wireframe overlay */}
      <mesh scale={1.1}>
        <icosahedronGeometry args={[2, 2]} />
        <meshStandardMaterial
          wireframe
          color="#00F2FE"
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

const CodingParticles = () => {
  const particles = useMemo(() => {
    const temp = [];
    const strings = ["<dev>", "{JSON}", "0101", "const", "=>", "push", "git", "React", "Next.js"];
    for (let i = 0; i < 15; i++) {
      temp.push({
        text: strings[Math.floor(Math.random() * strings.length)],
        pos: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10 - 5
        ],
        speed: Math.random() * 0.01 + 0.005
      });
    }
    return temp;
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <Float key={i} speed={1} position={p.pos as any}>
          <Text
            fontSize={0.3}
            color="#FFFFFF"
            fillOpacity={0.2}
          >
            {p.text}
          </Text>
        </Float>
      ))}
    </>
  );
};

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 bg-[#050816]" style={{ height: '100%', width: '100%' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        resize={{ scroll: false }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#7342E2" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00F2FE" />
        <spotLight
          position={[0, 10, 0]}
          intensity={1.5}
          angle={0.3}
          penumbra={1}
          castShadow
        />

        <Suspense fallback={null}>
          <PresentationControls
            global
            snap
            speed={2}
            damping={0.1}
            rotation={[0, 0.3, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <InteractiveCore />
          </PresentationControls>

          <FloatingObjects />
          <CodingParticles />

          <ContactShadows
            position={[0, -4, 0]}
            opacity={0.4}
            scale={20}
            blur={2}
            far={4.5}
          />

          <Environment preset="city" />
        </Suspense>
      </Canvas>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#050816] via-[#050816]/60 to-transparent" />
    </div>
  );
}
