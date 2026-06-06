"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
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

    // Fade out intro title as we scroll deep into the section
    gsap.to(".projects-intro", {
      opacity: 0,
      y: -100,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "top -10%",
        scrub: true,
      }
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
      <div className="sticky top-0 h-screen w-full z-10 overflow-hidden">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 50 }}
          resize={{ scroll: false }}
          style={{ width: '100%', height: '100%' }}
        >
          <fog attach="fog" args={["#050816", 5, 40]} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <Suspense fallback={null}>
            <ProjectPath scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>

        {/* Intro Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none projects-intro flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-6xl md:text-9xl font-bold text-white mb-6 drop-shadow-[0_0_50px_rgba(37,99,235,0.8)] uppercase tracking-tighter">
            The Project Journey
          </h2>
          <p className="text-blue-400 font-mono tracking-[0.3em] uppercase text-xl">
            Scroll to travel through my milestones
          </p>
          <div className="mt-16 animate-bounce">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
          </div>
        </div>
      </div>

      {/* Spacer to allow scrolling through the 3D path */}
      <div className="h-[500vh] pointer-events-none" />
    </section>
  );
};

export default Projects;
