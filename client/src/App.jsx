import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AboutAndSkills from './components/AboutAndSkills';
import ProjectsGrid from './components/ProjectsGrid';
import ContactForm from './components/ContactForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <div className="space-y-12">
                  <Hero />
                  <AboutAndSkills />
                  <ProjectsGrid />
                  <ContactForm />
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