"use client";

import React from "react";
import { SKILLS, PERSONAL_INFO, VOLUNTEERING } from "@/constants";
import { Mail, ExternalLink, Link as LinkIcon, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const SkillsAndContact = () => {
  return (
    <section id="skills" className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        <div>
          <h2 className="text-4xl font-bold mb-12 text-glow">Expertise & Impact</h2>

          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 text-blue-400 font-mono tracking-wider">TECHNICAL SKILLS</h3>
            <div className="flex flex-wrap gap-3">
              {SKILLS.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 bg-slate-800 rounded-lg text-sm border border-slate-700 hover:border-blue-500 transition-colors cursor-default text-slate-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-blue-400 font-mono tracking-wider">VOLUNTEERING</h3>
            <div className="space-y-4">
              {VOLUNTEERING.map((item, i) => (
                <div key={i} className="glass-morphism p-4 rounded-xl border border-slate-800/50">
                  <h4 className="font-bold text-slate-100">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="contact">
          <h2 className="text-4xl font-bold mb-12 text-glow">Get In Touch</h2>
          <div className="glass-morphism p-8 md:p-12 rounded-3xl border border-slate-800/50">
            <p className="text-slate-300 mb-10 text-lg leading-relaxed">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>

            <div className="space-y-8">
              <a href={`mailto:${PERSONAL_INFO.email}`} className="flex items-center gap-6 group">
                <div className="p-4 bg-slate-800 rounded-2xl group-hover:bg-blue-600 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <Mail size={24} className="text-blue-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-1">Email</p>
                  <p className="text-slate-100 font-medium group-hover:text-blue-400 transition-colors">{PERSONAL_INFO.email}</p>
                </div>
              </a>

              <a href={PERSONAL_INFO.linkedin} target="_blank" className="flex items-center gap-6 group">
                <div className="p-4 bg-slate-800 rounded-2xl group-hover:bg-blue-600 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <LinkIcon size={24} className="text-blue-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-1">LinkedIn</p>
                  <p className="text-slate-100 font-medium group-hover:text-blue-400 transition-colors">pasindu-jayasundara</p>
                </div>
              </a>

              <a href={PERSONAL_INFO.github} target="_blank" className="flex items-center gap-6 group">
                <div className="p-4 bg-slate-800 rounded-2xl group-hover:bg-blue-600 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  <MessageSquare size={24} className="text-blue-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-mono tracking-widest uppercase mb-1">GitHub</p>
                  <p className="text-slate-100 font-medium group-hover:text-blue-400 transition-colors">Pasindu-Jayasundara</p>
                </div>
              </a>
            </div>

            <div className="mt-12">
              <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 active:scale-[0.98]">
                SEND A MESSAGE <ExternalLink size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SkillsAndContact;
