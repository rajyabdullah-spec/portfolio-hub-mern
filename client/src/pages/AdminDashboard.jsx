import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, Loader2, X, FolderGit2, 
  LogOut, Mail, Inbox, Send, Search,
  Sparkles, MessageSquare, Layers, ChevronLeft, ChevronRight,
  Eye, RefreshCw, ExternalLink, Code2, CheckSquare, Square, Star, CheckCheck, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ITEMS_PER_PAGE = 8;
const PROJECT_CATEGORIES = ['All', 'HTML & CSS', 'Vanilla JS', 'Algorithms', 'AJAX & APIs', 'Node.js', 'React'];

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

  // Projects State
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectCategory, setProjectCategory] = useState('All');

  // Messages State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageFilter, setMessageFilter] = useState('all'); // all, unread, starred
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState([]);

  // Common State
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    subPathUrl: '',
    isPublished: true,
  });
  const [techStackList, setTechStackList] = useState([]);
  const [techInput, setTechInput] = useState('');

  // Fetching Data
  const fetchProjects = async () => {
    try {
      const response = await API.get('/projects/admin');
      const data = response.data.data || [];
      const ordered = data.sort((a, b) => (b._id || '').localeCompare(a._id || ''));
      setProjects(ordered);
    } catch (err) {
      toast.error('Failed to load admin projects');
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await API.get('/messages');
      setMessages(response.data.data || []);
      setSelectedMessageIds([]); 
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);
    await Promise.all([fetchProjects(), fetchMessages()]);
    setRefreshing(false);
    toast.success('Dashboard data refreshed');
  };

  useEffect(() => {
    fetchProjects();
    fetchMessages();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  // Tech Stack Helpers
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

  // Project Modals
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setSelectedProject(null);
    setFormData({ title: '', description: '', imageUrl: '', githubUrl: '', liveUrl: '', subPathUrl: '', isPublished: true });
    setTechStackList([]);
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setSelectedProject(null);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      imageUrl: project.imageUrl || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      subPathUrl: project.subPathUrl || '',
      isPublished: project.isPublished !== false, 
    });
    setTechStackList(Array.isArray(project.techStack) ? [...project.techStack] : []);
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);

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
        toast.success('Project updated successfully!');
      } else {
        await API.post('/projects', formattedData);
        toast.success('Project created successfully!');
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed. Please check inputs.');
    } finally {
      setActionLoading(false);
    }
  };

  // Unified Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);

    try {
      if (deleteTarget.type === 'project') {
        await API.delete(`/projects/${deleteTarget.id}`);
        toast.success('Project deleted successfully');
        setSelectedProject(null);
        fetchProjects();
      } else if (deleteTarget.type === 'message') {
        await API.delete(`/messages/${deleteTarget.id}`);
        toast.success('Message deleted successfully');
        if (selectedMessage?._id === deleteTarget.id) setSelectedMessage(null);
        fetchMessages();
      }
    } catch (err) {
      toast.error('Failed to perform delete operation');
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  // Message Individual Actions
  const handleMarkAsRead = async (id) => {
    setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    if (selectedMessage && selectedMessage._id === id) {
      setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);
    }
    try { await API.put(`/messages/${id}/read`, {}); } catch (err) { fetchMessages(); }
  };

  const handleToggleStar = async (id, e) => {
    e.stopPropagation();
    setMessages(prev => prev.map(m => m._id === id ? { ...m, isStarred: !m.isStarred } : m));
    if (selectedMessage && selectedMessage._id === id) {
      setSelectedMessage(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
    }
    try { await API.put(`/messages/${id}/star`, {}); } catch (err) { fetchMessages(); }
  };

  // Message Bulk Actions
  const handleToggleMessageSelection = (id, e) => {
    e.stopPropagation();
    setSelectedMessageIds(prev => 
      prev.includes(id) ? prev.filter(msgId => msgId !== id) : [...prev, id]
    );
  };

  const handleSelectAllMessages = (filteredMsgList) => {
    if (selectedMessageIds.length === filteredMsgList.length && filteredMsgList.length > 0) {
      setSelectedMessageIds([]);
    } else {
      setSelectedMessageIds(filteredMsgList.map(m => m._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessageIds.length === 0) return;
    setActionLoading(true);
    try {
      await API.post('/messages/bulk-delete', { ids: selectedMessageIds });
      toast.success(`${selectedMessageIds.length} messages deleted`);
      fetchMessages();
    } catch (err) {
      toast.error('Failed to delete selected messages');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkRead = async () => {
    if (selectedMessageIds.length === 0) return;
    setActionLoading(true);
    try {
      await API.post('/messages/bulk-read', { ids: selectedMessageIds });
      toast.success(`${selectedMessageIds.length} messages marked as read`);
      fetchMessages();
    } catch (err) {
      toast.error('Failed to mark messages as read');
    } finally {
      setActionLoading(false);
    }
  };

  // Project Filtering Logic
  const isProjectInCategory = (project, category) => {
    if (category === 'All') return true;
    const techs = (project.techStack || []).map(t => t.toLowerCase());
    const hasReact = techs.includes('react') || techs.includes('react 18');
    const hasNode = techs.includes('node.js');
    const hasAjax = techs.includes('ajax');
    const hasAlgo = techs.includes('algorithms');
    const hasJS = techs.includes('javascript');
    const hasHtmlCss = techs.includes('html5') || techs.includes('css3') || techs.includes('bootstrap') || techs.includes('bootstrap 5') || techs.includes('materialize css');

    switch (category) {
      case 'HTML & CSS': return hasHtmlCss && !hasJS && !hasReact && !hasNode && !hasAlgo && !hasAjax;
      case 'Vanilla JS': return hasJS && !hasAjax && !hasAlgo && !hasNode && !hasReact;
      case 'Algorithms': return hasAlgo;
      case 'AJAX & APIs': return hasAjax && !hasNode && !hasReact;
      case 'Node.js': return hasNode && !hasReact;
      case 'React': return hasReact;
      default: return true;
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()) || 
                          p.techStack?.some((t) => t.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    return matchesSearch && isProjectInCategory(p, projectCategory);
  });

  const totalProjectPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startProjectIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startProjectIndex, startProjectIndex + ITEMS_PER_PAGE);

  // Message Filtering Logic
  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = m.senderName?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q);
    if (messageFilter === 'unread') return matchesSearch && !m.isRead;
    if (messageFilter === 'starred') return matchesSearch && m.isStarred;
    return matchesSearch;
  });

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen py-10 px-4 max-w-6xl mx-auto space-y-8 select-none">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-emerald-400 w-6 h-6" />
            <span>Portfolio Control Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage portfolio projects & client inquiries</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshAll}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Project</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 font-bold text-xs transition-all cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 border-t-2 border-t-emerald-500 flex items-center justify-between shadow-lg hover:border-emerald-500/40 transition-all">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Total Projects</span>
            <span className="text-2xl font-bold text-white">{projects.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 border-t-2 border-t-teal-500 flex items-center justify-between shadow-lg hover:border-teal-500/40 transition-all">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1">Client Inquiries</span>
            <span className="text-2xl font-bold text-white">{messages.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 border-t-2 border-t-rose-500/80 flex items-center justify-between shadow-lg hover:border-rose-500/40 transition-all">
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
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
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
                onClick={() => { setMessageFilter('all'); setSelectedMessageIds([]); }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  messageFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setMessageFilter('unread'); setSelectedMessageIds([]); }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  messageFilter === 'unread' ? 'bg-slate-800 text-rose-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => { setMessageFilter('starred'); setSelectedMessageIds([]); }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  messageFilter === 'starred' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className="w-3 h-3" /> Starred
              </button>
            </div>
          )}

          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab === 'projects') setCurrentPage(1);
              }}
              placeholder={activeTab === 'projects' ? "Search projects..." : "Search messages..."}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Projects List Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          
          {/* Projects Category Filter */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
            <Filter className="w-4 h-4 text-slate-500 mr-1 hidden sm:block" />
            {PROJECT_CATEGORIES.map(category => {
              const isActive = projectCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => { setProjectCategory(category); setCurrentPage(1); }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 border-emerald-400/50'
                      : 'bg-slate-900/80 text-slate-400 hover:text-emerald-400 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{category}</span>
                </button>
              );
            })}
          </div>

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
                    onClick={() => setSelectedProject(project)}
                    className={`p-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between hover:bg-slate-900/90 transition-all shadow-md overflow-hidden cursor-pointer group ${
                      project.isPublished === false ? 'border-amber-500/30 hover:border-amber-500/50' : 'hover:border-emerald-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                          {project.isPublished === false && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-bold tracking-wider uppercase">
                              Draft
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0 font-mono">Click to view</span>
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
        <div className="space-y-4">
          
          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedMessageIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleSelectAllMessages(filteredMessages)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {selectedMessageIds.length === filteredMessages.length ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                  <span className="text-xs font-bold text-indigo-300">
                    {selectedMessageIds.length} message(s) selected
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleBulkRead}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark Read
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            <div className="flex flex-col gap-2">
              {/* Select All Row Header (Hidden on Mobile) */}
              <div className="hidden sm:flex items-center px-5 py-2">
                <button 
                  onClick={() => handleSelectAllMessages(filteredMessages)}
                  className="text-slate-500 hover:text-emerald-400 transition-colors mr-3"
                >
                  {selectedMessageIds.length === filteredMessages.length && filteredMessages.length > 0 
                    ? <CheckSquare className="w-4 h-4" /> 
                    : <Square className="w-4 h-4" />}
                </button>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select All</span>
              </div>

              {filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.isRead) handleMarkAsRead(msg._id);
                  }}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4 hover:border-emerald-500/40 group ${
                    msg.isRead 
                      ? 'bg-slate-900/40 border-slate-800/60' 
                      : 'bg-slate-900 border-slate-700 shadow-md shadow-emerald-500/5'
                  } ${selectedMessageIds.includes(msg._id) ? 'border-indigo-500/40 bg-indigo-500/5' : ''}`}
                >
                  {/* Left Controls */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => handleToggleMessageSelection(msg._id, e)}
                      className={`transition-colors ${selectedMessageIds.includes(msg._id) ? 'text-indigo-400' : 'text-slate-600 hover:text-indigo-400'}`}
                    >
                      {selectedMessageIds.includes(msg._id) ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => handleToggleStar(msg._id, e)}
                      className={`transition-colors hover:scale-110 ${msg.isStarred ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-600 hover:text-amber-400/50'}`}
                    >
                      <Star className="w-4 h-4" fill={msg.isStarred ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Message Info */}
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                    <div className="sm:w-1/4 shrink-0">
                      <h4 className={`text-sm truncate ${msg.isRead ? 'text-slate-300 font-semibold' : 'text-white font-bold'}`}>
                        {msg.senderName}
                      </h4>
                    </div>
                    
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase tracking-wide">
                          New
                        </span>
                      )}
                      <p className={`text-sm truncate ${msg.isRead ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                        <span className="mr-2">{msg.subject || 'No Subject'}</span>
                        <span className="text-slate-500 font-normal hidden sm:inline">- {msg.message}</span>
                      </p>
                    </div>

                    <div className="shrink-0 sm:text-right mt-2 sm:mt-0">
                      <span className={`text-[10px] font-mono ${msg.isRead ? 'text-slate-500' : 'text-emerald-400/80 font-bold'}`}>
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Project Details / Preview Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Project Details</h3>
                  {selectedProject.isPublished === false && (
                    <span className="ml-2 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                      Draft
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{selectedProject.title}</h4>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(selectedProject.techStack || []).map((tech, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] border border-slate-700 font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 max-h-40 overflow-y-auto whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedProject.liveUrl && (
                    <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Link
                    </a>
                  )}
                  {(selectedProject.githubUrl || selectedProject.subPathUrl) && (
                    <a href={selectedProject.githubUrl || selectedProject.subPathUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors">
                      <Code2 className="w-3.5 h-3.5" /> Source Code
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 mt-2">
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block">Manage this entry safely</span>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setDeleteTarget({ type: 'project', id: selectedProject._id, name: selectedProject.title });
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(selectedProject)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Project
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Message Details Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Inquiry Details</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleToggleStar(selectedMessage._id, e)}
                    className={`p-1.5 rounded-xl transition-colors cursor-pointer border ${selectedMessage.isStarred ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-400'}`}
                    title={selectedMessage.isStarred ? "Remove Star" : "Star Message"}
                  >
                    <Star className="w-4 h-4" fill={selectedMessage.isStarred ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
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

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 mt-2">
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block">Manage this entry safely</span>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setDeleteTarget({ type: 'message', id: selectedMessage._id, name: `message from ${selectedMessage.senderName}` })}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Portfolio Inquiry')}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Reply
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create / Edit Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
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
                {/* Draft / Publish Toggle Switch */}
                <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800 p-4 rounded-xl mb-2">
                  <div>
                    <span className="block text-sm font-bold text-white">Project Visibility</span>
                    <span className="text-[10px] text-slate-400 font-mono">Publicly visible on portfolio or hidden as draft</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                      formData.isPublished ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isPublished ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

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
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700/60 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Add
                    </button>
                  </div>

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
                            className="hover:text-rose-400 p-0.5 rounded-full transition-colors cursor-pointer"
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://demo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Project Files (subPathUrl)</label>
                    <input
                      type="url"
                      value={formData.subPathUrl}
                      onChange={(e) => setFormData({ ...formData, subPathUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Root URL</label>
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
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {actionLoading ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <Trash2 className="w-6 h-6 text-rose-400" />
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
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs tracking-wide transition-all duration-200 shadow-lg shadow-rose-600/25 border border-rose-400/30 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {actionLoading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;