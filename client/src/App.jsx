import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import AboutAndSkills from './components/AboutAndSkills';
import ProjectsGrid from './components/ProjectsGrid';
import ContactForm from './components/ContactForm';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToHash />
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
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;