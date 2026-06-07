"use client";

import React from "react";
import { SESSIONS } from "@/constants";
import AmbientParticles from "@/components/ui/AmbientParticles";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin } from "lucide-react";

const Sessions = () => {
  return (
    <section id="sessions" className="theme-section relative overflow-hidden py-24 px-6">
      <AmbientParticles count={40} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
                <h2 className="text-4xl md:text-5xl font-bold text-glow mb-4">Technical Sessions</h2>
                <p className="theme-muted max-w-xl text-lg">
                    Sharing knowledge and empowering the next generation of developers through workshops and seminars.
                </p>
            </div>
            <div className="text-blue-500 font-mono font-bold tracking-widest text-sm bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                {SESSIONS.length} SESSIONS DELIVERED
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SESSIONS.map((session, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-morphism theme-card-hover p-8 rounded-3xl hover:border-blue-500 transition-all group"
            >
              <div className="mb-6 flex justify-between items-start">
                <div className="p-4 bg-blue-600/10 rounded-2xl group-hover:bg-blue-600 transition-colors">
                  <Users size={24} className="text-blue-400 group-hover:text-white" />
                </div>
                <span className="theme-subtle text-sm font-mono">{session.date}</span>
              </div>

              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                {session.title}
              </h3>
              <p className="theme-muted mb-8 line-clamp-3 leading-relaxed">
                {session.desc}
              </p>

              <div className="theme-subtle flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{session.organizer}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sessions;
