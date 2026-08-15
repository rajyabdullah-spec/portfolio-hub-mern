import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Briefcase, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const location = useLocation();

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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 sm:hidden w-[92%] max-w-sm">
      <div className="flex items-center justify-around py-2.5 px-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-2xl backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-semibold transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-0 bg-emerald-500/10 rounded-xl border border-emerald-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              <Icon
                className={`w-5 h-5 z-10 transition-transform duration-200 ${
                  isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'
                }`}
              />

              <span
                className={`z-10 transition-colors ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
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