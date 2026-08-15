import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal, Sparkles, FileText, CheckCircle2, User, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center py-16 sm:py-28 overflow-hidden select-none">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[200px] bg-sky-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-8">
        
        {/* Left Column: Text & Hero CTA */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-7">
          
          {/* Status Badges */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-mono shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for New Projects</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Software Developer</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
          >
            Building Scalable & <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-200">
              Modern Web Experiences
            </span>
          </motion.h1>

          {/* Main Bio Paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl"
          >
            Hi, I'm <strong className="text-slate-200 font-semibold">Raji Al-Abdullah</strong>. I specialize in engineering production-grade full-stack web applications using React, Node.js, Express, and MongoDB with a focus on high performance and clean architecture.
          </motion.p>

          {/* Micro-Bio Teaser Card (Designed specifically to highlight About section) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="w-full max-w-2xl p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg group hover:border-emerald-500/30 transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Software Engineering Profile
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Passionate about crafting fast REST APIs, responsive UI layouts & clean code architecture.
                </p>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 shrink-0 transition-colors group/link self-end sm:self-center"
            >
              <span>Read Full Bio</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Hero Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1 w-full"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all border border-emerald-400/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-xs transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Get in Touch</span>
            </Link>

            <a
              href="/Raji_Al-Abdullah_CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800/80 font-mono text-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>CV / Resume</span>
            </a>
          </motion.div>

          {/* Tech Highlights */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-400 text-xs font-mono w-full"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>MERN Stack</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>REST API</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clean Code</span>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Profile Avatar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center items-center relative w-full lg:max-w-md py-6 lg:py-0"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(16, 185, 129, 0.4)",
                "0 0 0 35px rgba(16, 185, 129, 0)",
              ],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute rounded-full w-[240px] h-[240px] sm:w-[320px] sm:h-[320px]"
          />
          
          <div className="relative z-10 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full p-2 bg-gradient-to-tr from-emerald-500 to-teal-900 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <img 
              src="/profile.jpg" 
              alt="Raji Al-Abdullah" 
              className="w-full h-full object-cover rounded-full border-4 border-slate-950 bg-slate-800"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;