import React from 'react';
import { Code2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const myEmail = "Rajyabdullah@gmail.com";

  const handleCopyEmail = (e) => {
    if (e.shiftKey || e.ctrlKey) {
      e.preventDefault();
      navigator.clipboard.writeText(myEmail);
      toast.success('Email copied to clipboard!');
    }
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 mt-16 select-none overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          
          {/* Brand & Status Indicator */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center gap-2 font-bold text-lg text-emerald-400 group cursor-pointer">
              <Code2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>Portfolio<span className="text-white">Hub</span></span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Crafting modern web applications with precision, speed, and clean code.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-400 mt-1 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All services & APIs operational</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/rajyabdullah-spec"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://linkedin.com/in/raji-dev-nl"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href={`mailto:${myEmail}`}
              onClick={handleCopyEmail}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Email"
              title="Click to Mail (or Ctrl/Shift+Click to Copy)"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-center text-xs text-slate-500 font-mono">
          <p>© {currentYear} Raji Al-Abdullah. Built with MERN Stack & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;