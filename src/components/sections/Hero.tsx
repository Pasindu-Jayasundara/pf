"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightCircle,
  Zap,
  Code,
  Cpu,
  Menu,
  X,
  Terminal,
  Download
} from "lucide-react";
import Link from "next/link";

const Logo = ({ fill = "#192837" }: { fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill={fill}/>
  </svg>
);

import { NAV_LINKS } from "@/constants";

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
    <section id="home" className="relative w-full min-h-screen font-body text-[#192837] overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4" type="video/mp4" />
        </video>
        {/* Overlay to ensure readability if video is too bright */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Logo />
            <span className="font-heading text-xl tracking-tight">PASINDU.J</span>
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
            className="bg-[#7342E2] text-white rounded-full px-5 py-2.5 text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            Hire Me <ArrowRightCircle size={16} />
          </a>
          <Link
            href="#contact"
            className="bg-[#F2F2EE] text-[#192837] rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#e6e6e2] transition-all"
          >
            Contact
          </Link>
        </div>

        <button
          className="md:hidden p-2"
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
              className="fixed inset-0 z-40 bg-[#192837]/35 backdrop-blur-[4px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
              className="fixed right-0 top-0 z-50 w-[min(88vw,360px)] h-[100dvh] bg-[#CFC8C5] shadow-[-12px_0_48px_rgba(25,40,55,0.18)] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <Logo />
                <button onClick={() => setIsMenuOpen(false)}>
                  <X size={28} />
                </button>
              </div>

              <div className="h-px bg-[#192837]/10 mb-8" />

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
                      className="text-2xl font-heading"
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
                  className="w-full bg-[#F2F2EE] text-[#192837] rounded-full py-4 font-bold text-center"
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
        <div className="max-w-[560px] pt-[clamp(40px,8vw,72px)]">
          <motion.h1
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-heading text-[clamp(1.65rem,5vw,3rem)] leading-[1.05] tracking-[-0.01em] mb-6 flex flex-wrap items-center gap-x-3"
          >
            <Zap size={24} className="inline-block relative top-[-2px]" />
            Building Modern Digital
            <Code size={24} className="inline-block relative top-[-2px]" />
            Experiences with Precision
            <Cpu size={24} className="inline-block relative top-[-2px]" />
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-[clamp(0.9rem,2.5vw,1.1rem)] leading-[1.65] opacity-80 mb-10"
          >
            Zero stress, total control. Pasindu&apos;s digital craftsmanship keeps your projects covered with unbreakable code, one-tap interactivity, and pro-grade engineering for your non-stop world.
          </motion.p>

          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Link
              href="#projects"
              className="inline-flex items-center justify-between gap-8 bg-[#7342E2] text-white rounded-[50px] px-6 py-4.5 font-semibold text-[clamp(0.9rem,2vw,1rem)] shadow-[0_4px_24px_rgba(115,66,226,0.28)] min-w-[210px] hover:scale-[1.04] hover:brightness-110 active:scale-[0.96] transition-all group"
            >
              <span>Explore My Work</span>
              <ArrowRightCircle size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
