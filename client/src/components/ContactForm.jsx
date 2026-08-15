import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Mail, MapPin, CheckCircle2, MessageSquareText, Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMouseMove = (e) => {
    // Disable 3D calculations on mobile to prevent performance lag during scroll
    if (window.innerWidth < 768) return;

    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;

    const centerX = card.width / 2;
    const centerY = card.height / 2;

    const rotateXVal = ((y - centerY) / centerY) * -4;
    const rotateYVal = ((x - centerX) / centerX) * 4;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
    setGlowPos({
      x: (x / card.width) * 100,
      y: (y / card.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 768) return;
    setRotateX(0);
    setRotateY(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/messages', formData);
      setLoading(false);
      setIsSent(true);
      setFormData({ senderName: '', email: '', subject: '', message: '' });
      toast.success('Thank you! Your message has been sent successfully.');
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleResetForm = () => {
    setIsSent(false);
  };

  return (
    <motion.section 
      id="contact"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative py-12 md:py-16 select-none overflow-hidden"
    >
      {/* Dynamic Animated Ambient Orbs - Hidden on Mobile to fix GPU rendering bugs */}
      <motion.div 
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:block absolute top-1/4 left-10 w-80 h-80 bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none -z-10"
      />
      <motion.div 
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -30, 0],
          y: [0, 25, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:block absolute bottom-10 right-10 w-96 h-96 bg-teal-500/15 blur-[130px] rounded-full pointer-events-none -z-10"
      />

      {/* Header Section */}
      <div className="text-center max-w-xl mx-auto mb-12 space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs shadow-sm md:backdrop-blur-sm">
          <MessageSquareText className="w-4 h-4" />
          <span>LET'S CONNECT</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
          Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300">Touch</span>
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Have a project in mind, a career opportunity, or just want to discuss web engineering? Send a direct message.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl md:bg-slate-900/80 md:backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="text-xl font-bold text-white">Contact Info</h3>
              <span className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Now
              </span>
            </div>

            <div className="space-y-3.5">
              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Direct Email</span>
                  <a href="mailto:Rajyabdullah@gmail.com" className="text-sm font-semibold text-slate-200 hover:text-emerald-400 transition-colors">
                    Rajyabdullah@gmail.com
                  </a>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Location</span>
                  <span className="text-sm font-semibold text-slate-200">
                    Schoonhoven, Netherlands
                  </span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-start gap-4 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors group cursor-pointer"
              >
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Status</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    Open for Full-time & Remote Roles
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 md:bg-slate-900/40 md:border-slate-800/60 md:backdrop-blur-sm text-xs text-slate-400 leading-relaxed flex items-start gap-3 shadow-md">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-200 font-semibold block mb-0.5">Quick Delivery Guarantee</strong>
              Messages are sent directly to my database inbox with real-time notification capability.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form or Animated Success Card */}
        <div className="lg:col-span-7">
          <motion.div
            style={{ perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden group hover:border-emerald-500/40 transition-colors md:bg-slate-900/90 md:backdrop-blur-md min-h-[440px] flex flex-col justify-center"
          >
            {/* Radial Mouse Follow Glow - Hidden on mobile */}
            <div
              className="hidden md:block pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
              style={{
                background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(16, 185, 129, 0.12), transparent 80%)`,
              }}
            />

            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 w-full"
                >
                  <div className="mb-6 space-y-1">
                    <h3 className="text-xl font-bold text-white">Send a Direct Message</h3>
                    <p className="text-xs text-slate-400">Please fill out the form details below.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                        <input
                          type="text"
                          name="senderName"
                          required
                          value={formData.senderName}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-600"
                          placeholder="Your Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-600"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-600"
                        placeholder="Project Inquiry / Job Opportunity"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                      <textarea
                        name="message"
                        required
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-600 resize-none"
                        placeholder="Write your message details here..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group/btn w-full inline-flex justify-center items-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 border border-emerald-400/30 cursor-pointer"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="relative z-10 py-8 text-center flex flex-col items-center justify-center space-y-6"
                >
                  {/* Flying Paper Plane Trail Animation */}
                  <div className="relative w-full flex justify-center items-center h-24">
                    <motion.div
                      initial={{ x: -120, y: 80, opacity: 0, scale: 0.4, rotate: -25 }}
                      animate={{
                        x: [ -120, -20, 100, 250 ],
                        y: [ 80, 0, -60, -180 ],
                        opacity: [ 0, 1, 0.8, 0 ],
                        scale: [ 0.4, 1.2, 1, 0.4 ],
                        rotate: [ -25, -5, 15, 35 ]
                      }}
                      transition={{ duration: 1.8, ease: "easeInOut" }}
                      className="absolute text-emerald-400 pointer-events-none drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]"
                    >
                      <Send className="w-16 h-16 stroke-[1.8]" />
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.9, type: 'spring', stiffness: 220, damping: 15 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 border border-emerald-300/40"
                    >
                      <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="space-y-2 max-w-sm"
                  >
                    <h4 className="text-2xl font-extrabold text-white">Message Delivered!</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Thank you for reaching out! Your message has flown straight to my inbox and saved to the admin panel.
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer mt-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Send Another Message</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

      </div>
    </motion.section>
  );
};

export default ContactForm;