import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, FolderGit2, Mail, Trash2, LogOut, 
  Plus, Loader2, CheckCircle, AlertCircle, ExternalLink, Code2 
} from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'messages'
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, msgRes] = await Promise.all([
        axios.get('http://localhost:5000/api/projects'),
        axios.get('http://localhost:5000/api/messages'),
      ]);
      setProjects(projRes.data.data);
      setMessages(msgRes.data.data);
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to load dashboard data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const payload = {
        ...newProject,
        techStack: newProject.techStack.split(',').map((item) => item.trim()),
      };

      await axios.post('http://localhost:5000/api/projects', payload);
      setStatusMsg({ type: 'success', text: 'Project created successfully!' });
      setNewProject({ title: '', description: '', techStack: '', githubUrl: '', liveUrl: '' });
      fetchData();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Error creating project.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      setStatusMsg({ type: 'success', text: 'Project deleted successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to delete project.' });
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`);
      setMessages(messages.filter((m) => m._id !== id));
      setStatusMsg({ type: 'success', text: 'Message deleted successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to delete message.' });
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Top Header & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Management Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your portfolio content and customer inquiries in real-time.</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold text-xs transition-all w-fit"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{projects.length}</p>
            <p className="text-xs text-slate-400">Total Live Projects</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{messages.length}</p>
            <p className="text-xs text-slate-400">Received Messages</p>
          </div>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMsg.text && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'projects'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Projects Management ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'messages'
              ? 'border-primary-500 text-primary-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Messages Inbox ({messages.length})
        </button>
      </div>

      {/* Tab 1: Projects Management */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Project Form */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 h-fit">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-primary-400" />
              <span>Add New Project</span>
            </h2>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-primary-500"
                  placeholder="Portfolio Hub MERN"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-primary-500"
                  placeholder="Full-stack web application for developer showcase..."
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  required
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-primary-500"
                  placeholder="React, Node.js, Express, MongoDB"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-primary-500"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Live Demo URL</label>
                <input
                  type="url"
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-primary-500"
                  placeholder="https://myportfolio.com"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs transition-all disabled:opacity-50 mt-2"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /><span>Save Project</span></>}
              </button>
            </form>
          </div>

          {/* Existing Projects List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-white">Existing Projects List</h2>
            
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary-500 animate-spin" /></div>
            ) : projects.length === 0 ? (
              <p className="text-slate-500 text-xs">No projects created yet.</p>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project._id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-100 text-sm">{project.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 pt-2">
                        {project.techStack.map((tech, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono border border-slate-700/50">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Messages Inbox */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">User Inquiries Inbox</h2>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary-500 animate-spin" /></div>
          ) : messages.length === 0 ? (
            <p className="text-slate-500 text-xs">No messages received yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((msg) => (
                <div key={msg._id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                      <div>
                        <h3 className="font-bold text-white text-sm">{msg.senderName}</h3>
                        <p className="text-xs text-primary-400">{msg.email}</p>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    {msg.subject && <p className="text-xs font-semibold text-slate-200 mb-1">Sub: {msg.subject}</p>}
                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/40">
                      "{msg.message}"
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Message</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;