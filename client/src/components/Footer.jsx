import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Portfolio Hub. All rights reserved.</p>
        <p className="mt-1 text-xs text-slate-600">Engineered with MERN Stack & Tailwind CSS</p>
      </div>
    </footer>
  );
};

export default Footer;