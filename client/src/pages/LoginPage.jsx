import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, KeyRound, AlertCircle, ShieldAlert, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setIsSuccess(true);

      // Delay briefly to enjoy the success state before redirecting
      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[75vh] flex flex-col items-center justify-center py-6 select-none">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-2 shadow-2xl relative overflow-hidden">
        
        {/* Top Vault Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
            <Shield className="w-4 h-4" />
            <span>VAULT STATUS: {isOpen ? 'UNLOCKED' : 'LOCKED'}</span>
          </div>
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-[11px] font-mono px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            {isOpen ? 'Close Door' : 'Pull Shutter'}
          </button>
        </div>

        {/* Shutter Screen / Content */}
        <div className="relative p-6 min-h-[380px] flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full space-y-4 z-10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white">Admin Authentication</h3>
              <p className="text-xs text-slate-400">Security Level 4 Restricted Access</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Identity</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Passcode</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isOpen || isSuccess}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isSuccess 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-800'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                  <span>Welcome Back, Admin!</span>
                </>
              ) : loading ? (
                'Authenticating...'
              ) : (
                'Access Vault'
              )}
            </button>
          </form>

          {/* Shutter Layer */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div 
                initial={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 border-t border-slate-800"
              >
                <div className="w-full h-full border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                  <ShieldAlert className="w-12 h-12 text-slate-600 mb-3 animate-pulse" />
                  <h4 className="text-sm font-mono font-bold text-slate-300">VAULT SHUTTER CLOSED</h4>
                  <p className="text-[11px] text-slate-500 mt-1 mb-6">Pull the lever below to lift shutter</p>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ y: 10 }}
                    onClick={() => setIsOpen(true)}
                    className="cursor-pointer px-6 py-2.5 rounded-full bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 text-xs font-mono flex items-center gap-2 shadow-lg"
                  >
                    <span>⬇ PULL TO UNLOCK</span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;