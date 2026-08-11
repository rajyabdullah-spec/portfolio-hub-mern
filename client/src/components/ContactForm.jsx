import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare, X, Mail } from 'lucide-react';

const ContactForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      await axios.post('http://localhost:5000/api/messages', formData);
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ senderName: '', email: '', subject: '', message: '' });

      // Fast auto-close after 1 second
      setTimeout(() => {
        setIsOpen(false);
        setStatus((prev) => ({ ...prev, success: false }));
      }, 1000);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <section id="contact" className="py-12 border-t border-slate-800/60">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Call to Action Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              <MessageSquare className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Have a project or inquiry in mind?</h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
              Feel free to reach out anytime. I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-emerald-400/30"
          >
            <Mail className="w-4 h-4 stroke-[2.5]" />
            <span>Open Contact Form</span>
          </button>
        </div>

      </div>

      {/* Interactive Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-700/40"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-bold text-white">Send a Message</h3>
                <p className="text-xs text-slate-400">Fill out the details below and I'll get back to you promptly.</p>
              </div>

              {status.success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Thank you! Your message has been sent successfully.</span>
                </motion.div>
              )}

              {status.error && (
                <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{status.error}</span>
                </div>
              )}

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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-600"
                      placeholder="Raji"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-600"
                      placeholder="raji@example.com"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-600"
                    placeholder="Project Inquiry"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-all placeholder-slate-600 resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full inline-flex justify-center items-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 border border-emerald-400/30 cursor-pointer"
                >
                  {status.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactForm;