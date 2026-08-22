import React, { useState } from 'react';
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
      // Audio fallback
    }
  };

  const handleToggleLamp = () => {
    playClickSound();
    setIsOn((prev) => !prev);
  };

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

  const handlePasswordKeyEvent = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 15, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 260, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.95, y: -10, filter: 'blur(6px)', transition: { duration: 0.2 } },
  };

  const placeholderVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start md:justify-center py-4 md:py-10 select-none overflow-hidden bg-slate-950">
      
      {/* Background Ambient Glow */}
      <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${isOn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[400px] bg-amber-500/10 blur-[90px] md:blur-[140px] rounded-full" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-16 w-full max-w-5xl px-4 sm:px-6 z-10 pt-2 md:pt-0">
        
        {/* Lamp Section - Compacted for mobile */}
        <div className="relative flex flex-col items-center z-20 transform scale-75 sm:scale-90 md:scale-100 transition-transform origin-top">
          
          <AnimatePresence>
            {!isOn && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-7 text-[10px] sm:text-xs font-mono text-amber-400/90 animate-pulse whitespace-nowrap bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/20"
              >
                Pull cord to illuminate
              </motion.span>
            )}
          </AnimatePresence>

          {/* Interactive Cord */}
          <motion.div
            className="absolute top-[65px] right-[30px] md:right-[45px] z-30 flex flex-col items-center cursor-pointer group"
            whileTap={{ y: 20 }}
            onClick={handleToggleLamp}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <div className="h-20 md:h-28 w-[2px] bg-amber-200/60 group-hover:bg-amber-300 transition-colors"></div>
            <div className="h-3.5 w-3.5 md:h-4 md:w-4 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] border border-amber-200 group-hover:scale-110 transition-transform"></div>
          </motion.div>

          {/* Lamp Shade */}
          <div className="relative z-20 h-12 md:h-14 w-44 md:w-52 rounded-t-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-b-2 border-slate-700 shadow-2xl">
            <div
              className={`absolute bottom-[-9px] left-1/2 h-5 md:h-6 w-16 md:w-20 -translate-x-1/2 rounded-b-full transition-all duration-300 ${
                isOn
                  ? 'bg-amber-100 shadow-[0_0_35px_#fef08a]'
                  : 'bg-slate-800 border-t border-slate-700'
              }`}
            />
          </div>

          {/* Lamp Stand - Scaled down height on mobile */}
          <div className="h-24 sm:h-56 md:h-80 lg:h-96 w-3 md:w-3.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 shadow-inner"></div>

          {/* Lamp Base */}
          <div className="h-4 md:h-5 w-32 md:w-40 rounded-t-xl bg-gradient-to-b from-slate-700 to-slate-900 border-t border-slate-600 shadow-2xl"></div>

          {/* Light Cone Effect */}
          <div
            className={`pointer-events-none absolute top-[45px] left-1/2 -translate-x-1/2 transition-opacity duration-500 ease-in-out ${
              isOn ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '0',
              height: '0',
              borderLeft: '190px solid transparent',
              borderRight: '190px solid transparent',
              borderBottom: '420px solid rgba(251, 191, 36, 0.12)',
              filter: 'blur(18px)',
            }}
          />
        </div>

        {/* Form Container - Positioned to comfortably fit under the shortened lamp base on mobile */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md min-h-[320px] sm:min-h-[380px] flex items-center justify-center -mt-6 md:mt-0">
          <AnimatePresence mode="wait">
            {isOn ? (
              <motion.div
                key="login-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/20 relative z-20"
              >
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    SECURE AUTHENTICATION
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white tracking-wide">Control Center</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Authorized Portfolio Admin Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-medium text-slate-300 mb-1">Admin Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@domain.com"
                        className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] sm:text-xs font-medium text-slate-300">Passcode</label>
                      <AnimatePresence>
                        {isCapsLockOn && (
                          <motion.span
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 5 }}
                            className="text-[9px] font-mono text-amber-400 flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20"
                          >
                            <Lock className="w-2.5 h-2.5" /> CAPS LOCK IS ON
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
                        className="w-full pl-9 pr-10 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
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
                    className={`w-full py-2.5 sm:py-3.5 mt-1 sm:mt-2 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:-translate-y-0.5 active:translate-y-0 border ${
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
                className="flex flex-col items-center justify-center text-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-900 bg-slate-950/60 backdrop-blur-sm w-full"
              >
                <Lightbulb className="w-7 h-7 sm:w-10 sm:h-10 text-slate-800 mb-2 sm:mb-3" />
                <h4 className="text-[10px] sm:text-xs font-mono font-bold text-slate-600 tracking-wider">PORTFOLIO VAULT LOCKED</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-700 mt-1">Pull the cord to illuminate and unlock access</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;