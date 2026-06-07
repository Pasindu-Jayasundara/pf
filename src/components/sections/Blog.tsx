"use client";

import React from "react";
import { BLOG_POSTS } from "@/constants";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const Blog = () => {
  return (
    <section id="blog" className="theme-section-alt py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-glow mb-16 text-center">Latest Insights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post, index) => (
            <motion.a
              key={index}
              href={post.link}
              target="_blank"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col group"
            >
              <div className="theme-card-solid relative aspect-[16/10] rounded-3xl mb-6 overflow-hidden">
                {/* Abstract Blog Placeholder */}
                <div className="blog-art absolute inset-0 flex items-center justify-center">
                    <span className="blog-art-label text-6xl font-black tracking-tighter">POST #{index + 1}</span>
                </div>
                <div className="blog-art-button absolute top-4 right-4 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={20} />
                </div>
              </div>

              <div className="px-2">
                <span className="text-blue-500 font-mono text-xs mb-3 block tracking-widest">{post.date.toUpperCase()}</span>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="theme-muted mb-6 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="w-10 h-1 bg-blue-600 group-hover:w-24 transition-all duration-500" />
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-20 text-center">
            <a
                href="https://bhbg45.blogspot.com/"
                target="_blank"
                className="theme-border px-10 py-4 border-2 hover:border-blue-500 rounded-full font-bold transition-all text-sm tracking-widest"
            >
                VISIT BLOG
            </a>
        </div>
      </div>
    </section>
  );
};

export default Blog;
