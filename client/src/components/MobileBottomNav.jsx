import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const location = useLocation();

  // Hide nav bar on admin dashboard and login routes
  if (location.pathname === '/admin' || location.pathname === '/login') {
    return null;
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { path: '/contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 sm:hidden w-[90%] max-w-xs">
      {/* Ambient Backlight Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-sky-500/20 rounded-3xl blur-lg pointer-events-none opacity-70 animate-pulse" />

      {/* Ultra-Translucent Glassmorphism Dock Container */}
      <div className="relative flex items-center justify-around py-2 px-2 rounded-2xl bg-slate-950/40 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl transition-all duration-300">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-3.5 text-[10px] font-semibold transition-all duration-300 select-none"
            >
              {/* Soft Active Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabGlow"
                  className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 rounded-xl border border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon Element */}
              <Icon
                className={`w-4 h-4 z-10 transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              />

              {/* Label Text */}
              <span
                className={`z-10 transition-colors duration-300 tracking-wide ${
                  isActive ? 'text-emerald-300 font-bold' : 'text-slate-400 font-medium'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;