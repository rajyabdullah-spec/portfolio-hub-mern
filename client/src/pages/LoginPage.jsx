import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, AlertCircle, Eye, EyeOff, CheckCircle2, Lightbulb, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [isOn, setIsOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const emailInputRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Web Audio API for Switch Click Sound (No external audio file required)
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

  // Auto-focus on email input when lamp turns on
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
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      setLoading(false);
    }
  };

  const handleKeyDownString = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleLamp();
    }
  };

  // Detect Caps Lock state on Password Field
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
      
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl px-6">
        
        {/* Lamp and Toggle Section */}
        <div className="relative flex flex-col items-center z-20">
          
          <AnimatePresence>
            {!isOn && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 text-xs font-mono text-amber-400/80 animate-pulse whitespace-nowrap"
              >
                Pull the cord to illuminate
              </motion.span>
            )}
          </AnimatePresence>

          {/* Interactive Pull String with Keyboard Support & Click Sound */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label="Toggle Lamp Light"
            className="absolute top-[85px] right-[45px] z-30 flex flex-col items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
            whileTap={{ y: 22 }}
            onClick={handleToggleLamp}
            onKeyDown={handleKeyDownString}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <div className="h-28 w-[2px] bg-amber-200/50"></div>
            <div className="h-4 w-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)] border border-amber-200"></div>
          </motion.div>

          {/* Lamp Shade */}
          <div className="relative z-20 h-14 w-52 rounded-t-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-b-2 border-slate-700 shadow-xl">
            <div
              className={`absolute bottom-[-10px] left-1/2 h-6 w-20 -translate-x-1/2 rounded-b-full transition-all duration-300 ${
                isOn
                  ? 'bg-amber-100 shadow-[0_0_35px_#fef08a]'
                  : 'bg-slate-800 border-t border-slate-700'
              }`}
            />
          </div>

          {/* Lamp Stand */}
          <div className="h-96 w-3.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 shadow-inner"></div>

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
              borderLeft: '280px solid transparent',
              borderRight: '280px solid transparent',
              borderBottom: '550px solid rgba(251, 191, 36, 0.12)',
              filter: 'blur(25px)',
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
                className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-20"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white tracking-wide">Control Center</h3>
                  <p className="text-xs text-slate-400 mt-1">Authorized Portfolio Admin Access</p>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Admin Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        ref={emailInputRef}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@domain.com"
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/80 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-slate-400">Passcode</label>
                      <AnimatePresence>
                        {isCapsLockOn && (
                          <motion.span
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            className="text-[10px] font-mono text-amber-400 flex items-center gap-1"
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
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/80 transition-colors"
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
                    className={`w-full py-3 mt-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                      isSuccess
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-slate-800 disabled:text-slate-500'
                    }`}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 animate-bounce" />
                        <span>Welcome Back! Redirecting...</span>
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
                className="flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-slate-900 bg-slate-950/40"
              >
                <Lightbulb className="w-12 h-12 text-slate-800 mb-3" />
                <h4 className="text-sm font-mono font-bold text-slate-600">PORTFOLIO VAULT LOCKED</h4>
                <p className="text-xs text-slate-700 mt-1">Pull the cord to illuminate and unlock access</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;