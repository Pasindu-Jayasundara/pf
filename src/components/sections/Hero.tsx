"use client";

import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { HeroScene } from "@/components/3d/HeroScene";
import { PERSONAL_INFO } from "@/constants";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      }, "-=0.7")
      .from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      }, "-=0.7");

      // Floating animation for CTA
      gsap.to(".scroll-indicator", {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <HeroScene />
        </Canvas>
      </div>

      <div className="relative z-10 text-center px-6 mt-[-10vh]">
        <h1
          ref={titleRef}
          className="text-6xl md:text-9xl font-black tracking-tighter mb-4 text-glow leading-none"
        >
          {PERSONAL_INFO.name.split(" ")[0]}
          <br className="md:hidden" />
          <span className="text-blue-500"> {PERSONAL_INFO.name.split(" ")[1]}</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto font-medium uppercase tracking-widest"
        >
          {PERSONAL_INFO.role}
        </p>
        <div ref={ctaRef} className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a
            href="#projects"
            className="group relative px-10 py-4 bg-white text-slate-950 rounded-full font-bold transition-all overflow-hidden"
          >
            <span className="relative z-10">EXPLORE PROJECTS</span>
            <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="#contact"
            className="text-white font-bold hover:text-blue-400 transition-colors tracking-widest text-sm"
          >
            LET'S TALK
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 scroll-indicator">
        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500">SCROLL</span>
        <ArrowDown size={16} className="text-blue-500" />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-950 to-transparent z-0" />
    </section>
  );
};

export default Hero;
