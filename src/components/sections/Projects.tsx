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
  const introTitleRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Scene Scroll Progress (Starts after intro)
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Map 0.15 - 1.0 to 0.0 - 1.0 for the 3D journey
        const progress = Math.max(0, (self.progress - 0.15) / 0.85);
        setScrollProgress(progress);
      },
    });

    // 2. Intro Animation Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "top -100%", // The animation takes 100vh of scrolling
        scrub: true,
        pin: true, // Pin the section while title moves
      }
    });

    tl.fromTo(introTitleRef.current,
      {
        y: "40vh",
        x: "0%",
        left: "50%",
        top: "50%",
        translateX: "-50%",
        translateY: "-50%",
        scale: 1.5,
        opacity: 0
      },
      {
        opacity: 1,
        duration: 0.5
      }
    )
    .to(introTitleRef.current, {
      top: "40px",
      left: "40px",
      x: "0%",
      translateX: "0%",
      translateY: "0%",
      y: "0",
      scale: 0.5, // Standard size
      duration: 1.5,
      ease: "power2.inOut"
    })
    .to(canvasContainerRef.current, {
      opacity: 1,
      duration: 1,
    }, "-=0.5"); // Reveal canvas as title reaches corner

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
    <section id="projects" ref={containerRef} className="relative min-h-[700vh] bg-[#050816]">
      <div className="sticky top-0 h-screen w-full z-10 overflow-hidden">

        {/* 3D Scene Container */}
        <div ref={canvasContainerRef} className="w-full h-full opacity-0">
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
        </div>

        {/* Intro Overlay Title */}
        <div
          ref={introTitleRef}
          className="absolute z-20 pointer-events-none flex flex-col items-start justify-center"
        >
          <h2 className="text-6xl md:text-8xl font-bold text-white drop-shadow-[0_0_30px_rgba(37,99,235,0.6)] uppercase tracking-tighter whitespace-nowrap">
            The Project Journey
          </h2>
          <p className="text-blue-400 font-mono tracking-[0.2em] uppercase text-lg mt-2 opacity-60 intro-subtitle">
            My Professional Milestones
          </p>
        </div>
      </div>

      {/* Spacer to allow scrolling through the 3D path */}
      <div className="h-[600vh] pointer-events-none" />
    </section>
  );
};

export default Projects;
