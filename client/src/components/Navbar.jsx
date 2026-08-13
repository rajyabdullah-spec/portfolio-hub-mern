import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, UserCheck, LayoutDashboard, Menu, X } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#about');
  const menuRef = useRef(null);

  // Framer Motion Scroll Progress Bar Setup
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

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

  // Handle route change & active section updates
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    // Handle initial scroll positioning if navigated from another page with hash
    if (location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'auto' });
          setActiveSection(location.hash);
        }, 50);
      }
    }

    const handleScroll = () => {
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isBottom) {
        setActiveSection('#contact');
        return;
      }

      const sections = ['about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${sectionId}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, location.hash]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/${targetId}`);
    } else {
      setActiveSection(targetId);
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isAdminRoute = location.pathname === '/admin';
  const isLoginRoute = location.pathname === '/login';

  return (
    <nav ref={menuRef} className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400 hover:opacity-90 transition-opacity">
            <Code2 className="w-6 h-6" />
            <span>Portfolio<span className="text-white">Hub</span></span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
            {[
              { id: '#about', label: 'About' },
              { id: '#projects', label: 'Projects' },
              { id: '#contact', label: 'Contact' }
            ].map((navItem) => {
              const isActive = activeSection === navItem.id;
              return (
                <a
                  key={navItem.id}
                  href={navItem.id}
                  onClick={(e) => handleNavClick(e, navItem.id)}
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
                </a>
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

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Top Scroll Progress Indicator */}
      {location.pathname === '/' && (
        <motion.div
          className="h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 origin-left shadow-[0_0_10px_rgba(16,185,129,0.7)]"
          style={{ scaleX }}
        />
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 shadow-2xl">
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, '#about')}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              activeSection === '#about' ? 'bg-slate-900 text-emerald-400 font-bold border-l-2 border-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            About
          </a>
          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, '#projects')}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              activeSection === '#projects' ? 'bg-slate-900 text-emerald-400 font-bold border-l-2 border-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              activeSection === '#contact' ? 'bg-slate-900 text-emerald-400 font-bold border-l-2 border-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            Contact
          </a>

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