import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-dark-900 text-slate-100">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
                    Welcome to <span className="text-primary-500">Portfolio Hub</span>
                  </h1>
                  <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                    Full-Stack MERN Platform setup is successful and ready for components!
                  </p>
                </div>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;