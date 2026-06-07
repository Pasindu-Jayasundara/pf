"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ProjectPath } from "@/components/3d/ProjectPath";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const usePrefersDark = () => {
  const [isDark, setIsDark] = useState(() => (
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches
  ));

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setIsDark(media.matches);

    updateTheme();
    media.addEventListener("change", updateTheme);

    return () => media.removeEventListener("change", updateTheme);
  }, []);

  return isDark;
};

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const introTitleRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isDark = usePrefersDark();

  const sceneBackground = isDark ? "#050816" : "#f8fafc";

  useLayoutEffect(() => {
    const container = containerRef.current;
    const introTitle = introTitleRef.current;
    const canvasContainer = canvasContainerRef.current;

    if (!container || !introTitle || !canvasContainer) return;

    const ctx = gsap.context(() => {
      gsap.set(introTitle, {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        y: "40vh",
        scale: 1.5,
        autoAlpha: 0,
        transformOrigin: "left top",
      });
      gsap.set(canvasContainer, { autoAlpha: 0 });

      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "top -100%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
        .to(introTitle, {
          autoAlpha: 1,
          duration: 0.35,
          ease: "none",
        })
        .to(introTitle, {
          top: "40px",
          left: "40px",
          xPercent: 0,
          yPercent: 0,
          y: 0,
          scale: 0.5,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(canvasContainer, {
          autoAlpha: 1,
          duration: 0.45,
          ease: "none",
        }, "-=0.25");

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const introProgress = 1 / 6;
          const progress = gsap.utils.clamp(
            0,
            1,
            (self.progress - introProgress) / (1 - introProgress)
          );

          setScrollProgress((current) => (
            Math.abs(current - progress) > 0.001 ? progress : current
          ));
        },
      });
    }, container);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={containerRef} className="project-shell relative min-h-[700vh]">
      <div className="sticky top-0 h-screen w-full z-10 overflow-hidden">

        {/* 3D Scene Container */}
        <div ref={canvasContainerRef} className="w-full h-full opacity-0">
          <Canvas
            camera={{ position: [0, 5, 10], fov: 50 }}
            resize={{ scroll: false }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={[sceneBackground]} />
            <fog attach="fog" args={[sceneBackground, isDark ? 5 : 8, isDark ? 40 : 55]} />
            <ambientLight intensity={isDark ? 0.5 : 0.9} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isDark ? 1 : 0.55} />
            <Suspense fallback={null}>
              <ProjectPath scrollProgress={scrollProgress} isDark={isDark} />
            </Suspense>
          </Canvas>
        </div>

        {/* Intro Overlay Title */}
        <div
          ref={introTitleRef}
          className="absolute z-20 pointer-events-none flex flex-col items-start justify-center"
        >
          <h2 className="project-title text-6xl md:text-8xl font-bold uppercase tracking-tighter whitespace-nowrap">
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
