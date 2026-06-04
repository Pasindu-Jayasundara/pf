"use client";

import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { HeroScene } from "@/components/3d/HeroScene";
import { PERSONAL_INFO } from "@/constants";
import gsap from "gsap";
import { ArrowDown, GitBranch, Link as LinkIcon, Mail } from "lucide-react";

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
        duration: 1.2,
        ease: "expo.out",
      })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
      }, "-=0.9")
      .from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
      }, "-=0.9")
      .from(".social-icon", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
      }, "-=0.5");

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
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <HeroScene />
        </Canvas>
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="mb-6 flex justify-center gap-6">
            <a href={PERSONAL_INFO.github} target="_blank" className="social-icon p-3 glass-morphism rounded-full hover:bg-blue-600 transition-colors">
                <GitBranch size={20} />
            </a>
            <a href={PERSONAL_INFO.linkedin} target="_blank" className="social-icon p-3 glass-morphism rounded-full hover:bg-blue-600 transition-colors">
                <LinkIcon size={20} />
            </a>
            <a href={`mailto:${PERSONAL_INFO.email}`} className="social-icon p-3 glass-morphism rounded-full hover:bg-blue-600 transition-colors">
                <Mail size={20} />
            </a>
        </div>

        <h1
          ref={titleRef}
          className="text-7xl md:text-[10rem] font-black tracking-tighter mb-4 text-glow leading-none select-none"
        >
          {PERSONAL_INFO.name.split(" ")[0]}
          <span className="text-blue-500"> {PERSONAL_INFO.name.split(" ")[1]}</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto font-medium uppercase tracking-[0.3em]"
        >
          {PERSONAL_INFO.role}
        </p>

        <div ref={ctaRef} className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <a
            href="#projects"
            className="group relative px-12 py-5 bg-blue-600 text-white rounded-full font-bold transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] overflow-hidden"
          >
            <span className="relative z-10">VIEW MY WORK</span>
            <div className="absolute inset-0 bg-blue-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </a>
          <a
            href="#contact"
            className="text-white font-bold hover:text-blue-400 transition-all border-b-2 border-transparent hover:border-blue-400 pb-1 tracking-[0.2em] text-sm"
          >
            GET IN TOUCH
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 scroll-indicator">
        <span className="text-[10px] font-bold tracking-[0.3em] text-slate-500">DISCOVER</span>
        <ArrowDown size={18} className="text-blue-500" />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-950 to-transparent z-0" />
    </section>
  );
};

export default Hero;
