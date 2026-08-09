import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, UserCheck, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
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
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-500">
            <Code2 className="w-6 h-6" />
            <span>Portfolio<span className="text-white">Hub</span></span>
          </Link>
          
          <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <a 
              href="#about" 
              onClick={(e) => handleNavClick(e, '#about')}
              className="hover:text-primary-500 transition-colors hidden sm:block"
            >
              About
            </a>
            <a 
              href="#projects" 
              onClick={(e) => handleNavClick(e, '#projects')}
              className="hover:text-primary-500 transition-colors hidden sm:block"
            >
              Projects
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hover:text-primary-500 transition-colors hidden sm:block"
            >
              Contact
            </a>
            
            {user ? (
              <Link 
                to="/admin" 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-600/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs transition-all shadow-lg shadow-primary-600/20"
              >
                <UserCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;