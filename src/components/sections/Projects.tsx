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
    <section id="projects" ref={containerRef} className="relative min-h-[400vh] bg-slate-950">
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden">
        <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <ProjectPath scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <div className="h-screen flex items-center justify-center pointer-events-none">
          <h2 className="text-6xl font-extrabold text-glow">Featured Projects</h2>
        </div>

        {PROJECTS.map((project, index) => (
          <div key={index} className="h-screen flex items-center justify-center px-6">
            <div className="project-card glass-morphism p-8 md:p-12 rounded-3xl max-w-2xl w-full">
              <span className="text-blue-500 font-mono text-sm mb-2 block">{project.duration}</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h3>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-400">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 transition-all">
                  Details <ExternalLink size={16} />
                </button>
                <button className="flex items-center gap-2 text-sm font-bold text-slate-300 border border-slate-700 px-6 py-3 rounded-full hover:border-slate-500 transition-all">
                  Source <GitBranch size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
