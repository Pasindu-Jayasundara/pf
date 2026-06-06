"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { EXPERIENCE, EDUCATION } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCount, setActiveCount] = useState(0);

  const timelineItems = useMemo(() => [
    ...EXPERIENCE.map((item) => ({
      title: item.role,
      organization: item.company,
      duration: item.duration,
      description: item.description,
      Icon: Briefcase,
    })),
    ...EDUCATION.map((item) => ({
      title: item.role,
      organization: item.company,
      duration: item.duration,
      description: [],
      Icon: GraduationCap,
    })),
  ], []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const updateActiveMarkers = (progress: number) => {
        if (!timelineRef.current) return;

        const timelineRect = timelineRef.current.getBoundingClientRect();
        const filledHeight = timelineRect.height * progress;
        const nextActiveCount = markerRefs.current.reduce((count, marker) => {
          if (!marker) return count;

          const markerRect = marker.getBoundingClientRect();
          const markerCenter = markerRect.top - timelineRect.top + markerRect.height / 2;

          return markerCenter <= filledHeight ? count + 1 : count;
        }, 0);

        setActiveCount((current) => (
          current === nextActiveCount ? current : nextActiveCount
        ));
      };

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateActiveMarkers(self.progress),
            onRefresh: (self) => updateActiveMarkers(self.progress),
          },
        }
      );

      gsap.utils.toArray(".timeline-item").forEach((item: any) => {
        gsap.from(item, {
          x: () => (
            window.matchMedia("(min-width: 768px)").matches
              ? item.dataset.side === "left" ? -50 : 50
              : 24
          ),
          opacity: 0,
          y: 16,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-16 px-5 sm:px-6 md:py-24 bg-slate-900/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 md:mb-16 text-center text-glow">
          Professional Journey
        </h2>

        <div ref={timelineRef} className="relative pl-16 md:pl-0">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-slate-800" />
          <div
            ref={lineRef}
            className="absolute left-6 md:left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-blue-500 origin-top"
          />

          {/* Items */}
          <div className="space-y-14 md:space-y-24">
            {timelineItems.map((item, index) => {
                const isLeft = index % 2 === 0;
                const isActive = index < activeCount;
                const Icon = item.Icon;

                return (
                  <div
                    key={`${item.title}-${item.organization}`}
                    className="timeline-item relative min-h-12 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-x-8"
                    data-side={isLeft ? "left" : "right"}
                  >
                    <div
                      data-timeline-content
                      className={`min-w-0 md:row-start-1 ${
                        isLeft
                          ? "md:col-start-1 md:pr-2 md:text-right"
                          : "md:col-start-3 md:pl-2 md:text-left"
                      }`}
                    >
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-blue-400">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-base sm:text-lg md:text-xl text-slate-100 font-semibold">
                        {item.organization}
                      </p>
                      {item.duration && (
                        <p className="mt-1 text-sm sm:text-base text-slate-400">
                          {item.duration}
                        </p>
                      )}
                      {item.description.length > 0 && (
                        <ul className={`mt-4 text-sm sm:text-base text-slate-400 space-y-2 ${
                          isLeft ? "md:ml-auto" : ""
                        }`}>
                          {item.description.map((desc) => (
                            <li key={desc}>{desc}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div
                      data-timeline-marker
                      ref={(node) => {
                        markerRefs.current[index] = node;
                      }}
                      className={`absolute -left-16 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 md:static md:col-start-2 md:row-start-1 md:h-14 md:w-14 ${
                        isActive
                          ? "border-blue-300 bg-blue-600 text-white shadow-[0_0_22px_rgba(37,99,235,0.65)]"
                          : "border-slate-600 bg-slate-700 text-slate-300"
                      }`}
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>

                    <div className={`hidden md:block md:row-start-1 ${isLeft ? "md:col-start-3" : "md:col-start-1"}`} />
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
