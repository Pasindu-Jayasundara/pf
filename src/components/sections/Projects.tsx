"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ProjectPath } from "@/components/3d/ProjectPath";
import { PROJECTS } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, GitBranch } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    gsap.utils.toArray(".project-card").forEach((card: any, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 100, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 40%",
            scrub: true,
          }
        }
      );
    });

    return () => trigger.kill();
  }, []);

  return (
    <section id="projects" ref={containerRef} className="relative min-h-[600vh] bg-[#050816]">
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
          <fog attach="fog" args={["#050816", 5, 40]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <ProjectPath scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      <div className="relative z-10 pointer-events-none">
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-5xl md:text-7xl font-heading text-white mb-4">The Project Journey</h2>
          <p className="text-white/50 font-mono tracking-widest uppercase text-sm">Scroll to travel through my milestones</p>
          <div className="mt-12 animate-bounce opacity-20">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white to-transparent" />
          </div>
        </div>

        {/* Spacing for scroll depth */}
        <div className="h-[400vh]" />

        <div className="h-screen flex items-center justify-center">
            <p className="text-white/20 font-mono italic text-lg">And the journey continues...</p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
