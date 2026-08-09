import React from 'react';
import { ArrowRight, Code, Terminal, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Full-Stack Software Developer</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Building Scalable & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-sky-200">
            Modern Web Experiences
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
          Hi, I'm <strong className="text-slate-200">Raji Al-Abdullah</strong>. I specialize in engineering full-stack applications using React, Node.js, Express, and MongoDB with a focus on high performance and intuitive UX.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-semibold text-sm transition-all"
          >
            <Terminal className="w-4 h-4 text-primary-400" />
            <span>Get in Touch</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;