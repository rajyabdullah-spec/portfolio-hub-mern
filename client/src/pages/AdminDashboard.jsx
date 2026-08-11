import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit2, Loader2, X, FolderGit2, AlertCircle, 
  CheckCircle2, LogOut, Mail, Check, Inbox, Send, Search,
  Sparkles, MessageSquare, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  // Navigation Tabs: 'projects' | 'messages'
  const [activeTab, setActiveTab] = useState('projects');

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageFilter, setMessageFilter] = useState('all'); // 'all' | 'unread'

  // Search Query State
  const [searchQuery, setSearchQuery] = useState('');

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Context & Navigation
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Modal States for Projects
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
  });

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data.data || []);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch Messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages', { withCredentials: true });
      setMessages(response.data.data || []);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchMessages();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  // Open Modal for Create Project
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', techStack: '', imageUrl: '', githubUrl: '', liveUrl: '' });
    setIsModalOpen(true);
  };

  // Open Modal for Edit Project
  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack || '',
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
    });
    setIsModalOpen(true);
  };

  // Submit Create or Update Project
  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    const formattedData = {
      ...formData,
      techStack: typeof formData.techStack === 'string'
        ? formData.techStack.split(',').map((item) => item.trim()).filter(Boolean)
        : formData.techStack,
    };

    try {
      if (editingProject) {
        await axios.put(`http://localhost:5000/api/projects/${editingProject._id}`, formattedData, { withCredentials: true });
        setSuccess('Project updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/projects', formattedData, { withCredentials: true });
        setSuccess('Project created successfully!');
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please check inputs.');
    } finally {
      setActionLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);

    try {
      if (deleteTarget.type === 'project') {
        await axios.delete(`http://localhost:5000/api/projects/${deleteTarget.id}`, { withCredentials: true });
        setSuccess('Project deleted successfully');
        fetchProjects();
      } else if (deleteTarget.type === 'message') {
        await axios.delete(`http://localhost:5000/api/messages/${deleteTarget.id}`, { withCredentials: true });
        setSuccess('Message deleted successfully');
        fetchMessages();
      }
    } catch (err) {
      setError('Failed to perform delete operation');
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Mark Message as Read
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/messages/${id}/read`, {}, { withCredentials: true });
      fetchMessages();
    } catch (err) {
      setError('Failed to mark message as read');
    }
  };

  // Calculated Stats & Filters
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const filteredProjects = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    if (messageFilter === 'unread') return matchesSearch && !m.isRead;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen py-10 px-4 max-w-6xl mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-emerald-400 w-6 h-6" />
            <span>Admin Control Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage portfolio projects and monitor client inquiries</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 border border-emerald-400/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Project</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 font-bold text-xs transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 border-t-2 border-t-emerald-500 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Total Projects</span>
            <span className="text-2xl font-bold text-white">{projects.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 border-t-2 border-t-indigo-500 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Total Inquiries</span>
            <span className="text-2xl font-bold text-white">{messages.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 border-t-2 border-t-rose-500 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Unread Messages</span>
            <span className="text-2xl font-bold text-rose-400">{unreadMessagesCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('projects'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('messages'); setSearchQuery(''); }}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 border border-emerald-500'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inbox</span>
            {unreadMessagesCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'messages' ? 'bg-slate-950 text-white' : 'bg-rose-500 text-white'
              }`}>
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'messages' && (
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setMessageFilter('all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  messageFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setMessageFilter('unread')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  messageFilter === 'unread' ? 'bg-slate-800 text-rose-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread
              </button>
            </div>
          )}

          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'projects' ? "Search projects or tech..." : "Search sender or email..."}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: PROJECTS SECTION */}
      {activeTab === 'projects' && (
        <>
          {loadingProjects ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
              No matching projects found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-700 transition-colors"
                >
                  <div>
                    {project.imageUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden h-36 bg-slate-950 border border-slate-800">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <h3 className="font-bold text-white text-base mb-1">{project.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {(project.techStack || []).map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleOpenEditModal(project)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-all duration-200 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteTarget({ type: 'project', id: project._id, name: project.title })}
                      disabled={actionLoading}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-100"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: MESSAGES INBOX SECTION */}
      {activeTab === 'messages' && (
        <>
          {loadingMessages ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Inbox className="w-8 h-8 text-slate-600" />
              <span>No matching messages found in your inbox.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-5 rounded-2xl border transition-all ${
                    msg.isRead 
                      ? 'bg-slate-900/60 border-slate-800/80 opacity-80' 
                      : 'bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{msg.senderName}</h4>
                        {!msg.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{msg.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </a>

                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(msg._id)}
                          className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Read</span>
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTarget({ type: 'message', id: msg._id, name: `message from ${msg.senderName}` })}
                        disabled={actionLoading}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {msg.subject && (
                      <p className="text-xs font-semibold text-slate-200">
                        Subject: <span className="text-slate-400 font-normal">{msg.subject}</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/40 mt-2">
                      {msg.message}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block pt-1 text-right">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Dialog for Create & Edit Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Project Details' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Portfolio Hub"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe key features of the application..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none transition-colors"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="React, Node.js, MongoDB, Express"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://demo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 border border-emerald-400/30 cursor-pointer"
                >
                  {actionLoading ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Confirm Delete</h3>
                <p className="text-[11px] text-slate-400">Permanent Removal Warning</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
              Are you sure you want to delete <strong className="text-white">"{deleteTarget.name}"</strong>? This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs transition-all duration-200 cursor-pointer shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 border border-rose-400/30"
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;