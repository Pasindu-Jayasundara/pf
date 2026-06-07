"use client";

import React, { useState } from "react";
import { SKILLS, PERSONAL_INFO, VOLUNTEERING } from "@/constants";
import { Mail, ExternalLink, Link as LinkIcon, MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SkillsAndContact = () => {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", PERSONAL_INFO.web3form_key);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus("success");
        setResultMessage("Message sent successfully! I'll get back to you soon.");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus("error");
        setResultMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setFormStatus("error");
      setResultMessage("Failed to connect to the server. Check your internet connection.");
    }
  };

  return (
    <section id="skills" className="theme-section-alt py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">

        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-glow">Expertise & Impact</h2>

          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-8 text-blue-400 font-mono tracking-wider flex items-center gap-3">
                <span className="w-8 h-px bg-blue-500/30"></span>
                TECHNICAL SKILLS
            </h3>
            <div className="flex flex-wrap gap-3">
              {SKILLS.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="theme-chip px-5 py-3 rounded-2xl text-sm border transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-8 text-blue-400 font-mono tracking-wider flex items-center gap-3">
                <span className="w-8 h-px bg-blue-500/30"></span>
                VOLUNTEERING
            </h3>
            <div className="space-y-4">
              {VOLUNTEERING.map((item, i) => (
                <div key={i} className="glass-morphism theme-card-hover p-6 rounded-2xl transition-colors">
                  <h4 className="theme-strong font-bold text-lg mb-1">{item.title}</h4>
                  <p className="theme-muted text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="contact">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-glow">Get In Touch</h2>
          <div className="glass-morphism p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden">

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="theme-subtle text-xs font-bold uppercase tracking-widest ml-1">Name</label>
                        <input
                            name="name"
                            required
                            placeholder="John Doe"
                            suppressHydrationWarning
                            className="theme-input w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="theme-subtle text-xs font-bold uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="john@example.com"
                            suppressHydrationWarning
                            className="theme-input w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="theme-subtle text-xs font-bold uppercase tracking-widest ml-1">Message</label>
                    <textarea
                        name="message"
                        required
                        placeholder="Tell me about your project..."
                        rows={5}
                        suppressHydrationWarning
                        className="theme-input w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={formStatus === "submitting"}
                    suppressHydrationWarning
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-white text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                >
                    {formStatus === "submitting" ? "SENDING..." : (
                        <>SEND MESSAGE <Send size={20} /></>
                    )}
                </button>

                <AnimatePresence>
                    {formStatus !== "idle" && formStatus !== "submitting" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                                formStatus === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                        >
                            {formStatus === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {resultMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            <div className="theme-border mt-12 pt-12 border-t grid grid-cols-1 sm:grid-cols-3 gap-8">
                <a href={PERSONAL_INFO.linkedin} target="_blank" className="flex flex-col items-center gap-2 group">
                    <div className="theme-icon-tile p-3 rounded-xl transition-colors">
                        <LinkIcon size={20} />
                    </div>
                    <span className="theme-subtle text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
                </a>
                <a href={PERSONAL_INFO.github} target="_blank" className="flex flex-col items-center gap-2 group">
                    <div className="theme-icon-tile p-3 rounded-xl transition-colors">
                        <MessageSquare size={20} />
                    </div>
                    <span className="theme-subtle text-[10px] font-bold uppercase tracking-widest">GitHub</span>
                </a>
                <a href={`mailto:${PERSONAL_INFO.email}`} className="flex flex-col items-center gap-2 group">
                    <div className="theme-icon-tile p-3 rounded-xl transition-colors">
                        <Mail size={20} />
                    </div>
                    <span className="theme-subtle text-[10px] font-bold uppercase tracking-widest">Email</span>
                </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SkillsAndContact;
