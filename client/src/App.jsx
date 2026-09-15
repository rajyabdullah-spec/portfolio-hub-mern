import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PageSEO from './components/PageSEO';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import Footer from './components/Footer';

// Critical hero component eagerly loaded
import Hero from './components/Hero';

// Lazy-loaded routes
const AboutAndSkills = lazy(() => import('./components/AboutAndSkills'));
const PortfolioGrid = lazy(() => import('./components/PortfolioGrid'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const PageLoaderFallback = () => (
  <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-3 select-none">
    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
    <span className="text-xs font-mono text-slate-500 tracking-wider">Loading module...</span>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <PageSEO />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #1e293b',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#0f172a',
              },
            },
            error: {
              iconTheme: {
                primary: '#f43f5e',
                secondary: '#0f172a',
              },
            },
          }}
        />
        <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 pb-16 sm:pb-0">
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<PageLoaderFallback />}>
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/about" element={<AboutAndSkills />} />
                <Route path="/portfolio" element={<PortfolioGrid />} />
                <Route path="/contact" element={<ContactForm />} />
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
            </Suspense>
          </main>
          <Footer />
          <MobileBottomNav />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;