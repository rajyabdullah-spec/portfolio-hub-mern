import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, UserCheck, LayoutDashboard, Menu, X, Home, User, Briefcase, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isAdminRoute = location.pathname === '/admin';
  const isLoginRoute = location.pathname === '/login';

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: User },
    { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { path: '/contact', label: 'Contact', icon: Mail }
  ];

  // Animation for side popover card
  const sideCardVariants = {
    closed: {
      opacity: 0,
      scale: 0.9,
      x: 20,
      y: -10,
      transition: { duration: 0.15, ease: 'easeIn' }
    },
    open: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: { type: 'spring', stiffness: 380, damping: 26 }
    }
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-slate-950 border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 font-bold text-xl text-emerald-400 hover:opacity-95 transition-opacity"
            >
              <Code2 className="w-6 h-6 text-emerald-400" />
              <span>Portfolio<span className="text-white">Hub</span></span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
              {navLinks.map((navItem) => {
                const isActive = location.pathname.toLowerCase() === navItem.path.toLowerCase();
                return (
                  <Link
                    key={navItem.path}
                    to={navItem.path}
                    className={`relative py-1 transition-colors ${
                      isActive ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                    }`}
                  >
                    {navItem.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
              
              {user ? (
                <Link 
                  to="/admin" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isAdminRoute
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-emerald-600/90 to-teal-500/90 text-white border-emerald-400/30'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isLoginRoute
                      ? 'bg-slate-800 text-emerald-400 border-emerald-500/50'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Portal</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Trigger Button */}
            <div className="sm:hidden flex items-center relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Side Popover"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Compact Floating Side-Card Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed top-16 right-4 z-50 sm:hidden">
              <motion.div
                ref={cardRef}
                initial="closed"
                animate="open"
                exit="closed"
                variants={sideCardVariants}
                className="w-56 bg-slate-950 border border-slate-800/90 rounded-2xl p-3 shadow-2xl shadow-emerald-950/20"
              >
                {/* Icon Grid/List */}
                <div className="space-y-1">
                  {navLinks.map((navItem) => {
                    const Icon = navItem.icon;
                    const isActive = location.pathname.toLowerCase() === navItem.path.toLowerCase();
                    return (
                      <Link
                        key={navItem.path}
                        to={navItem.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20'
                            : 'text-slate-300 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-emerald-400/20 text-emerald-400' : 'bg-slate-900 text-slate-400'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{navItem.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Bottom CTA */}
                <div className="pt-2 mt-2 border-t border-slate-800/80">
                  {user ? (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl font-bold text-[11px] ${
                        isAdminRoute
                          ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-[11px] font-semibold border ${
                        isLoginRoute
                          ? 'bg-slate-800 text-emerald-400 border-emerald-500/50'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;