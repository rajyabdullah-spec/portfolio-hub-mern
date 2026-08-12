import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, UserCheck, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#about');
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

  // Enhanced Active Section Detection with Bottom-Page Trigger
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      // Check if user is near the bottom of the page (activates Contact)
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

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(targetId);
    
    if (location.pathname !== '/') {
      navigate(`/${targetId}`);
    } else {
      const element = document.querySelector(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav ref={menuRef} className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-400 hover:opacity-90 transition-opacity">
            <Code2 className="w-6 h-6" />
            <span>Portfolio<span className="text-white">Hub</span></span>
          </Link>
          
          {/* Desktop Navigation Links with Active Highlighting */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a 
              href="#about" 
              onClick={(e) => handleNavClick(e, '#about')}
              className={`transition-all duration-200 ${
                activeSection === '#about' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 pb-0.5' : 'hover:text-emerald-400'
              }`}
            >
              About
            </a>
            <a 
              href="#projects" 
              onClick={(e) => handleNavClick(e, '#projects')}
              className={`transition-all duration-200 ${
                activeSection === '#projects' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 pb-0.5' : 'hover:text-emerald-400'
              }`}
            >
              Projects
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, '#contact')}
              className={`transition-all duration-200 ${
                activeSection === '#contact' ? 'text-emerald-400 font-bold border-b-2 border-emerald-400 pb-0.5' : 'hover:text-emerald-400'
              }`}
            >
              Contact
            </a>
            
            {user ? (
              <Link 
                to="/admin" 
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 border border-emerald-400/30"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-all"
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
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-xs"
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