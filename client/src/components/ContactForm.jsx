import React, { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ContactForm = () => {
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
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <section id="contact" className="py-16 border-t border-slate-800/60">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Get In Touch</h2>
          <p className="text-slate-400 text-sm">
            Have a question or want to work together? Drop a message below!
          </p>
        </div>

        {status.success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Thank you! Your message has been sent successfully.</span>
          </div>
        )}

        {status.error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{status.error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                name="senderName"
                required
                value={formData.senderName}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-primary-500"
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
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-primary-500"
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
              className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-primary-500"
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
              className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-primary-500"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
          >
            {status.loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;