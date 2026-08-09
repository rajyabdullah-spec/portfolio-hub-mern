import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Terminal, UserCheck } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-dark-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary-500">
            <Code2 className="w-6 h-6" />
            <span>Portfolio<span className="text-white">Hub</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-primary-500 transition-colors">About</a>
            <a href="#projects" className="hover:text-primary-500 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-primary-500 transition-colors">Contact</a>
            <Link 
              to="/login" 
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs transition-all shadow-lg shadow-primary-600/20"
            >
              <UserCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;