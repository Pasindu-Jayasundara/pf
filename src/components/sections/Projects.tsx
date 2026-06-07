"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ProjectPath } from "@/components/3d/ProjectPath";
import { PROJECTS } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROJECT_MILESTONES = PROJECTS.map((_, index) => 0.2 + index * 0.22);

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

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window === "undefined"
      ? false
      : window.matchMedia("(max-width: 767px)").matches
  ));

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(media.matches);

    updateViewport();
    media.addEventListener("change", updateViewport);

    return () => media.removeEventListener("change", updateViewport);
  }, []);

  return isMobile;
};

const getActiveProjectIndex = (progress: number) => {
  return PROJECT_MILESTONES.reduce((activeIndex, milestone, index) => {
    const activeDistance = Math.abs(progress - PROJECT_MILESTONES[activeIndex]);
    const distance = Math.abs(progress - milestone);

    return distance < activeDistance ? index : activeIndex;
  }, 0);
};

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const introTitleRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isDark = usePrefersDark();
  const isMobile = useIsMobile();

  const sceneBackground = isDark ? "#050816" : "#f8fafc";
  const activeProjectIndex = getActiveProjectIndex(scrollProgress);
  const activeProject = PROJECTS[activeProjectIndex];
  const activeMilestone = PROJECT_MILESTONES[activeProjectIndex];
  const activeProjectFocus = Math.max(0, Math.min(1, 1 - Math.abs(scrollProgress - activeMilestone) / 0.24));
  const showMobileProject = scrollProgress > 0.07 && scrollProgress < 0.95;

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
            camera={{ position: [0, 5, 10], fov: isMobile ? 62 : 50 }}
            resize={{ scroll: false }}
            style={{ width: '100%', height: '100%' }}
          >
            <color attach="background" args={[sceneBackground]} />
            <fog attach="fog" args={[sceneBackground, isDark ? 5 : 8, isDark ? 40 : 55]} />
            <ambientLight intensity={isDark ? 0.5 : 0.9} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isDark ? 1 : 0.55} />
            <Suspense fallback={null}>
              <ProjectPath scrollProgress={scrollProgress} isDark={isDark} isMobile={isMobile} />
            </Suspense>
          </Canvas>
        </div>

        {/* Intro Overlay Title */}
        <div
          ref={introTitleRef}
          className="absolute z-20 pointer-events-none flex max-w-[calc(100vw-32px)] flex-col items-start justify-center"
        >
          <h2 className="project-title text-4xl sm:text-5xl md:text-8xl font-bold uppercase leading-[0.95] md:whitespace-nowrap">
            The Project Journey
          </h2>
          <p className="text-blue-400 font-mono tracking-[0.18em] uppercase text-[10px] sm:text-xs md:text-lg mt-2 opacity-60 intro-subtitle">
            My Professional Milestones
          </p>
        </div>

        <div
          className="md:hidden absolute left-4 right-4 bottom-5 z-30 transition-all duration-300"
          style={{
            opacity: showMobileProject ? 0.92 + activeProjectFocus * 0.08 : 0,
            transform: showMobileProject ? "translateY(0)" : "translateY(16px)",
            pointerEvents: showMobileProject ? "auto" : "none",
          }}
        >
          <div className="project-panel rounded-2xl border p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-blue-400 font-mono text-[10px] uppercase tracking-[0.18em]">
                Project {activeProjectIndex + 1}/{PROJECTS.length}
              </span>
              <span className="project-panel-text shrink-0 text-xs font-medium">
                {activeProject.duration}
              </span>
            </div>

            <h3 className="project-panel-title text-2xl font-bold leading-tight">
              {activeProject.title}
            </h3>
            <p className="project-panel-text mt-2 line-clamp-3 text-sm leading-relaxed">
              {activeProject.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {activeProject.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="project-tag rounded-full border px-3 py-1 text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-1.5">
              {PROJECTS.map((project, index) => (
                <span
                  key={project.title}
                  className={`h-1 rounded-full transition-colors ${
                    index === activeProjectIndex ? "bg-blue-500" : "bg-blue-500/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to allow scrolling through the 3D path */}
      <div className="h-[600vh] pointer-events-none" />
    </section>
  );
};

export default Projects;
