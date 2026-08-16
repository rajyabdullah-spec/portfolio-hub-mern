import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, UserCheck, LayoutDashboard, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const isAdminRoute = location.pathname === '/admin';
  const isLoginRoute = location.pathname === '/login';

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav ref={menuRef} className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400 hover:opacity-90 transition-opacity">
            <Code2 className="w-6 h-6" />
            <span>Portfolio<span className="text-white">Hub</span></span>
          </Link>
          
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navLinks.map((navItem) => {
              const isActive = location.pathname.toLowerCase() === navItem.path.toLowerCase();
              return (
                <Link
                  key={navItem.path}
                  to={navItem.path}
                  className={`relative py-1 transition-all duration-150 ${
                    isActive ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                  }`}
                >
                  {navItem.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            
            {user ? (
              <Link 
                to="/admin" 
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg border ${
                  isAdminRoute
                    ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-emerald-500/30 border-emerald-400'
                    : 'bg-gradient-to-r from-emerald-600/90 to-teal-500/90 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/20 border-emerald-400/30'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isLoginRoute
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>

          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-2xl">
          {navLinks.map((navItem) => {
            const isActive = location.pathname.toLowerCase() === navItem.path.toLowerCase();
            return (
              <Link
                key={navItem.path}
                to={navItem.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-slate-900 text-emerald-400 font-bold border-l-2 border-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {navItem.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-bold text-xs ${
                  isAdminRoute
                    ? 'bg-emerald-500 text-white shadow-lg border border-emerald-400'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold border ${
                  isLoginRoute
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;