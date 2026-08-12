import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit2, Loader2, X, FolderGit2, AlertCircle, 
  CheckCircle2, LogOut, Mail, Check, Inbox, Send, Search,
  Sparkles, MessageSquare, Layers, ChevronLeft, ChevronRight,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios'; // ✅ Centralized Axios Client

const ITEMS_PER_PAGE = 8;

const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageFilter, setMessageFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null); // Full message details modal

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    subPathUrl: '',
  });
  
  // Interactive Tech Stack Chips State
  const [techStackList, setTechStackList] = useState([]);
  const [techInput, setTechInput] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects');
      const data = response.data.data || [];
      const ordered = data.sort((a, b) => a._id.localeCompare(b._id));
      setProjects(ordered);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await API.get('/messages');
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  // Tech Stack Chip Helpers
  const handleAddTechChip = (e) => {
    if (e) e.preventDefault();
    const trimmed = techInput.trim();
    if (trimmed && !techStackList.includes(trimmed)) {
      setTechStackList([...techStackList, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTechChip = (indexToRemove) => {
    setTechStackList(techStackList.filter((_, idx) => idx !== indexToRemove));
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', imageUrl: '', githubUrl: '', liveUrl: '', subPathUrl: '' });
    setTechStackList([]);
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      subPathUrl: project.subPathUrl || '',
    });
    setTechStackList(Array.isArray(project.techStack) ? [...project.techStack] : []);
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError('');

    let currentStack = [...techStackList];
    if (techInput.trim() && !currentStack.includes(techInput.trim())) {
      currentStack.push(techInput.trim());
    }

    const formattedData = {
      ...formData,
      techStack: Array.from(new Set(currentStack)),
    };

    try {
      if (editingProject) {
        await API.put(`/projects/${editingProject._id}`, formattedData);
        setSuccess('Project updated successfully!');
      } else {
        await API.post('/projects', formattedData);
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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);

    try {
      if (deleteTarget.type === 'project') {
        await API.delete(`/projects/${deleteTarget.id}`);
        setSuccess('Project deleted successfully');
        fetchProjects();
      } else if (deleteTarget.type === 'message') {
        await API.delete(`/messages/${deleteTarget.id}`);
        setSuccess('Message deleted successfully');
        if (selectedMessage?._id === deleteTarget.id) {
          setSelectedMessage(null);
        }
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

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/messages/${id}/read`, {});
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);
      }
      fetchMessages();
    } catch (err) {
      setError('Failed to mark message as read');
    }
  };

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const filteredProjects = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      p.techStack?.some((t) => t.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  );

  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      m.senderName?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q);

    if (messageFilter === 'unread') return matchesSearch && !m.isRead;
    return matchesSearch;
  });

  const totalProjectPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startProjectIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startProjectIndex, startProjectIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen py-10 px-4 max-w-6xl mx-auto space-y-8">
      
      {/* Top Header */}
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
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 font-bold text-xs transition-all duration-200 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
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

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 border-t-2 border-t-rose-500/80 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Unread Messages</span>
            <span className="text-2xl font-bold text-rose-400">{unreadMessagesCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('projects'); setSearchQuery(''); setCurrentPage(1); }}
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
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
                activeTab === 'messages' 
                  ? 'bg-slate-950 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab === 'projects') setCurrentPage(1);
              }}
              placeholder={activeTab === 'projects' ? "Search projects or tech..." : "Search sender or email..."}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="p-1 text-emerald-400 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="p-1 text-rose-400 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Projects List Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {loadingProjects ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : currentProjects.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
              No matching projects found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentProjects.map((project) => (
                  <div
                    key={project._id}
                    className="p-5 bg-slate-900/90 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-lg overflow-hidden"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-bold text-white line-clamp-1">{project.title}</h3>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenEditModal(project)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-lg transition-colors cursor-pointer border border-slate-700/50"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: 'project', id: project._id, name: project.title })}
                            disabled={actionLoading}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20 cursor-pointer disabled:opacity-50"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {(project.techStack || []).slice(0, 5).map((tech, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/90 text-slate-300 rounded-md border border-slate-700/50"
                          >
                            {tech}
                          </span>
                        ))}
                        {(project.techStack && project.techStack.length > 5) && (
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800/50 text-slate-500 rounded-md border border-slate-700/30">
                            +{project.techStack.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalProjectPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <span>
                    Showing Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalProjectPages}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      disabled={currentPage === totalProjectPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalProjectPages))}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Messages Inbox Tab */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.isRead) handleMarkAsRead(msg._id);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:border-emerald-500/40 ${
                    msg.isRead 
                      ? 'bg-slate-900/60 border-slate-800/80 opacity-80' 
                      : 'bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{msg.senderName}</h4>
                        {!msg.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono mb-2">{msg.email}</p>

                    {msg.subject && (
                      <p className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                        {msg.subject}
                      </p>
                    )}

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span className="inline-flex items-center gap-1 hover:underline">
                      <Eye className="w-3.5 h-3.5" /> Read Full Message
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ type: 'message', id: msg._id, name: `message from ${msg.senderName}` });
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Inquiry Details</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedMessage.senderName}</h4>
                  <a href={`mailto:${selectedMessage.email}`} className="text-xs text-emerald-400 font-mono hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {formatDate(selectedMessage.createdAt)}
                </span>
              </div>

              {selectedMessage.subject && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Subject</span>
                  <p className="text-xs font-bold text-white">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Message Body</span>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                onClick={() => setDeleteTarget({ type: 'message', id: selectedMessage._id, name: `message from ${selectedMessage.senderName}` })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
              >
                Delete
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply via Mail</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
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

              {/* Interactive Tech Stack Chips Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tech Stack List (Type and press Enter or click Add)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTechChip();
                      }
                    }}
                    placeholder="e.g. React, Node.js, MongoDB"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTechChip}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700/60 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Added Badges Display */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  {techStackList.length === 0 ? (
                    <span className="text-[11px] text-slate-600 font-mono p-1">No tech tags added yet.</span>
                  ) : (
                    techStackList.map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 text-xs border border-slate-700 font-mono"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTechChip(idx)}
                          className="hover:text-rose-400 p-0.5 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Image/GIF URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.gif"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo / Render URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://demo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Files URL (subPathUrl)</label>
                  <input
                    type="url"
                    value={formData.subPathUrl}
                    onChange={(e) => setFormData({ ...formData, subPathUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Root URL (README)</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
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

      {/* Delete Confirmation Modal */}
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