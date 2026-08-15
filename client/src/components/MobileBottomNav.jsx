import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Mail } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const MobileBottomNav = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  // Handle scroll behavior (Hide on scroll down, show on scroll up)
  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = current - previous;

    // Show at top of page or when scrolling up
    if (current < 50) {
      setIsVisible(true);
    } else if (diff > 5) {
      setIsVisible(false); // Scrolling down
    } else if (diff < -5) {
      setIsVisible(true); // Scrolling up
    }
  });

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
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ 
        y: isVisible ? 0 : 80, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 sm:hidden w-[88%] max-w-xs pointer-events-none"
    >
      {/* Ambient Backlight Glow - Subtle & Translucent */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-sky-500/15 rounded-3xl blur-md pointer-events-none opacity-60" />

      {/* Ultra-Transparent Glassmorphic Container */}
      <div className="relative pointer-events-auto flex items-center justify-around py-2 px-2 rounded-2xl bg-slate-950/25 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 text-[10px] font-semibold transition-all duration-300 select-none"
            >
              {/* Active Indicator Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabGlow"
                  className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-400/10 rounded-xl border border-emerald-400/25 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon Element */}
              <Icon
                className={`w-4 h-4 z-10 transition-all duration-300 ${
                  isActive 
                    ? 'text-emerald-400 scale-110 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]' 
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
    </motion.div>
  );
};

export default MobileBottomNav;