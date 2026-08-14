import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, Eye, EyeOff, CheckCircle2, Lightbulb, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [isOn, setIsOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const emailInputRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isOn ? 300 : 600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // Ignore if audio context is blocked
    }
  };

  const handleToggleLamp = () => {
    playClickSound();
    setIsOn((prev) => !prev);
  };

  useEffect(() => {
    if (isOn) {
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      setIsSuccess(true);
      toast.success('Authenticated successfully! Redirecting...');

      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleKeyDownString = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleLamp();
    }
  };

  const handlePasswordKeyEvent = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const formVariants = {
    hidden: {
      opacity: 0,
      scale: 0.85,
      y: -20,
      rotateX: 15,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        mass: 0.8,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      filter: 'blur(8px)',
      transition: {
        duration: 0.25,
        ease: 'easeIn',
      },
    },
  };

  const placeholderVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center py-10 select-none overflow-hidden bg-slate-950">
      
      {/* Background Ambient Glow */}
      <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isOn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full max-w-5xl px-6">
        
        {/* Lamp and Toggle Section */}
        <div className="relative flex flex-col items-center z-20">
          
          <AnimatePresence>
            {!isOn && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-9 text-xs font-mono text-amber-400/90 animate-pulse whitespace-nowrap bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20"
              >
                Pull the cord to illuminate
              </motion.span>
            )}
          </AnimatePresence>

          {/* Interactive Pull String */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Toggle Lamp Light"
            className="absolute top-[85px] right-[45px] z-30 flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full group"
            whileTap={{ y: 22 }}
            onClick={handleToggleLamp}
            onKeyDown={handleKeyDownString}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <div className="h-28 w-[2px] bg-amber-200/60 group-hover:bg-amber-300 transition-colors"></div>
            <div className="h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] border border-amber-200 group-hover:scale-110 transition-transform"></div>
          </motion.div>

          {/* Lamp Shade */}
          <div className="relative z-20 h-14 w-52 rounded-t-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-b-2 border-slate-700 shadow-2xl">
            <div
              className={`absolute bottom-[-10px] left-1/2 h-6 w-20 -translate-x-1/2 rounded-b-full transition-all duration-300 ${
                isOn
                  ? 'bg-amber-100 shadow-[0_0_40px_#fef08a]'
                  : 'bg-slate-800 border-t border-slate-700'
              }`}
            />
          </div>

          {/* Lamp Stand */}
          <div className="h-80 lg:h-96 w-3.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 shadow-inner"></div>

          {/* Lamp Base */}
          <div className="h-5 w-40 rounded-t-xl bg-gradient-to-b from-slate-700 to-slate-900 border-t border-slate-600 shadow-2xl"></div>

          {/* Light Cone Effect */}
          <div
            className={`pointer-events-none absolute top-[50px] left-1/2 -translate-x-1/2 transition-opacity duration-500 ease-in-out ${
              isOn ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '0',
              height: '0',
              borderLeft: '260px solid transparent',
              borderRight: '260px solid transparent',
              borderBottom: '520px solid rgba(251, 191, 36, 0.12)',
              filter: 'blur(20px)',
            }}
          />
        </div>

        {/* Form Container */}
        <div className="relative w-full max-w-md min-h-[420px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isOn ? (
              <motion.div
                key="login-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-8 shadow-2xl shadow-emerald-950/20 relative z-20"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    SECURE AUTHENTICATION
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">Control Center</h3>
                  <p className="text-xs text-slate-400 mt-1">Authorized Portfolio Admin Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Admin Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        ref={emailInputRef}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@domain.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-slate-300">Passcode</label>
                      <AnimatePresence>
                        {isCapsLockOn && (
                          <motion.span
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            className="text-[10px] font-mono text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                          >
                            <Lock className="w-3 h-3" /> CAPS LOCK IS ON
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handlePasswordKeyEvent}
                        onKeyUp={handlePasswordKeyEvent}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
                    disabled={loading || isSuccess}
                    className={`w-full py-3.5 mt-2 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:-translate-y-0.5 active:translate-y-0 border ${
                      isSuccess
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border-emerald-400/30 disabled:bg-slate-800 disabled:text-slate-500'
                    }`}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 animate-bounce" />
                        <span>Authenticated! Redirecting...</span>
                      </>
                    ) : loading ? (
                      'Authenticating...'
                    ) : (
                      'Authenticate & Access'
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="lamp-off-state"
                variants={placeholderVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-sm"
              >
                <Lightbulb className="w-10 h-10 text-slate-800 mb-3" />
                <h4 className="text-xs font-mono font-bold text-slate-600 tracking-wider">PORTFOLIO VAULT LOCKED</h4>
                <p className="text-[11px] text-slate-700 mt-1">Pull the cord to illuminate and unlock access</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;