"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightCircle,
  Code,
  Menu,
  X,
  Github,
  Linkedin,
  Mail
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("../3d/HeroScene"), { ssr: false });

const Logo = ({ fill = "currentColor" }: { fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill={fill}/>
  </svg>
);

import { NAV_LINKS, PERSONAL_INFO } from "@/constants";

const Hero = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section id="home" className="hero-shell relative w-full min-h-screen font-body overflow-hidden">
      {/* 3D Background */}
      <HeroScene />

      {/* Navbar */}
      <nav className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Logo />
            <span className="hero-strong font-heading text-xl tracking-tight">PASINDU.J</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/pasindu-jayasundara/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#7342E2] text-white rounded-full px-5 py-2.5 text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-purple-500/40 flex items-center gap-2 border border-white/10"
          >
            Hire Me <ArrowRightCircle size={16} />
          </a>
          <Link
            href="#contact"
            className="hero-panel backdrop-blur-md border rounded-full px-5 py-2.5 text-sm font-medium transition-all"
          >
            Contact
          </Link>
        </div>

        <button
          className="hero-strong md:hidden p-2"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Toggle menu"
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="hero-menu-backdrop fixed inset-0 z-40 backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
              className="hero-menu fixed right-0 top-0 z-50 w-[min(88vw,360px)] h-[100dvh] p-6 flex flex-col border-l"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <button onClick={() => setIsMenuOpen(false)} className="hero-strong">
                  <X size={28} />
                </button>
              </div>

              <div className="hero-divider h-px mb-8" />

              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + i * 0.07 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="hero-strong text-2xl font-heading hover:text-[#7342E2] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <a
                  href="https://www.linkedin.com/in/pasindu-jayasundara/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#7342E2] text-white rounded-full py-4 font-bold shadow-lg shadow-purple-500/20 text-center"
                >
                    Hire Me
                </a>
                <Link
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="hero-panel w-full rounded-full py-4 font-bold text-center border"
                >
                    Contact
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-center min-h-[calc(100vh-80px)]">
        <div className="max-w-[700px] pt-[clamp(40px,8vw,72px)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-sm text-xs font-medium tracking-wider mb-6 uppercase"
          >
            <div className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
            Available for new opportunities
          </motion.div>

          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-heading text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.95] tracking-[-0.03em] mb-8"
          >
            <span className="hero-strong block">Full-Stack</span>
            <span className="flex items-center gap-4 text-[#7342E2]">
              Architect <Code size={40} className="hero-faint" />
            </span>
            <span className="block opacity-90">& Developer.</span>
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="hero-muted text-[clamp(1rem,2.5vw,1.25rem)] leading-[1.6] mb-12 border-l-2 border-[#7342E2] pl-6 py-2 max-w-xl"
          >
            Hi, I&apos;m <span className="hero-strong font-bold">Pasindu Jayasundara</span>. I craft scalable digital ecosystems and immersive 3D interfaces. Bridging the gap between robust backend architecture and fluid frontend experiences.
          </motion.p>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap items-center gap-6"
          >
            <Link
              href="#projects"
              className="inline-flex items-center justify-between gap-8 bg-[#7342E2] text-white rounded-full px-8 py-5 font-semibold text-[clamp(0.9rem,2vw,1rem)] shadow-[0_4px_24px_rgba(115,66,226,0.4)] hover:scale-[1.04] hover:brightness-110 active:scale-[0.96] transition-all group"
            >
              <span>Explore My Journey</span>
              <ArrowRightCircle size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-4">
              {[
                { icon: Github, href: PERSONAL_INFO.github },
                { icon: Linkedin, href: PERSONAL_INFO.linkedin },
                { icon: Mail, href: `mailto:${PERSONAL_INFO.email}` }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social p-3 rounded-full border transition-all"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
