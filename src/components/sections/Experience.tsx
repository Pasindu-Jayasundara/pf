"use client";

import React, { useEffect, useRef } from "react";
import { EXPERIENCE, EDUCATION } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray(".timeline-item").forEach((item: any) => {
        gsap.from(item, {
          x: item.dataset.side === "left" ? -50 : 50,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-24 px-6 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-center text-glow">Professional Journey</h2>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-slate-800 rounded-full" />
          <div
            ref={lineRef}
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500 rounded-full origin-top"
          />

          {/* Items */}
          <div className="space-y-24">
            {EXPERIENCE.map((exp, index) => (
              <div
                key={index}
                className="timeline-item relative flex items-center justify-between"
                data-side={index % 2 === 0 ? "left" : "right"}
              >
                <div className={`w-[45%] ${index % 2 === 0 ? "text-right pr-8" : "order-1 pl-8"}`}>
                  <h3 className="text-2xl font-bold text-blue-400">{exp.role}</h3>
                  <p className="text-lg text-slate-200 font-medium">{exp.company}</p>
                  <p className="text-sm text-slate-400 mb-4">{exp.duration}</p>
                  <ul className={`text-slate-400 space-y-2 ${index % 2 === 0 ? "ml-auto" : ""}`}>
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-sm">{desc}</li>
                    ))}
                  </ul>
                </div>

                <div className="z-10 bg-blue-600 p-3 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                  <Briefcase size={24} className="text-white" />
                </div>

                <div className="w-[45%]" />
              </div>
            ))}

            {EDUCATION.map((edu, index) => {
                const totalIndex = index + EXPERIENCE.length;
                return (
                  <div
                    key={index}
                    className="timeline-item relative flex items-center justify-between"
                    data-side={totalIndex % 2 === 0 ? "left" : "right"}
                  >
                    <div className={`w-[45%] ${totalIndex % 2 === 0 ? "text-right pr-8" : "order-1 pl-8 text-left"}`}>
                      <h3 className="text-2xl font-bold text-blue-400">{edu.role}</h3>
                      <p className="text-lg text-slate-200 font-medium">{edu.company}</p>
                      <p className="text-sm text-slate-400">{edu.duration}</p>
                    </div>

                    <div className="z-10 bg-slate-700 p-3 rounded-full">
                      <GraduationCap size={24} className="text-white" />
                    </div>

                    <div className="w-[45%]" />
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
