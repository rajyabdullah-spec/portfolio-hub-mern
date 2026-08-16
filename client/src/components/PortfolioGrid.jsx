import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Loader2, Filter, ChevronDown, ChevronUp, Search, X, Sparkles, LayoutGrid, List, ArrowRight, ExternalLink, Code2, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCard3D from './ProjectCard3D';
import API from '../api/axios';

const CATEGORIES = ['All', 'HTML & CSS', 'Vanilla JS', 'Algorithms', 'AJAX & APIs', 'Node.js', 'React'];
const ITEMS_PER_PAGE = 6;

const PortfolioGrid = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      case 'HTML & CSS':
        return hasHtmlCss && !hasJS && !hasReact && !hasNode && !hasAlgo && !hasAjax;
      case 'Vanilla JS':
        return hasJS && !hasAjax && !hasAlgo && !hasNode && !hasReact;
      case 'Algorithms':
        return hasAlgo;
      case 'AJAX & APIs':
        return hasAjax && !hasNode && !hasReact;
      case 'Node.js':
        return hasNode && !hasReact;
      case 'React':
        return hasReact;
      default:
        return true;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const response = await API.get('/projects');
        const data = response.data.data || [];
        const strictlyOrderedData = data.sort((a, b) => (a._id || '').localeCompare(b._id || ''));
        
        if (isMounted) {
          setProjects(strictlyOrderedData);
          setFilteredProjects(strictlyOrderedData);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch portfolio data from backend API.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    let result = projects.filter(project => isProjectInCategory(project, activeCategory));

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        (project.title && project.title.toLowerCase().includes(query)) ||
        (project.description && project.description.toLowerCase().includes(query)) ||
        (project.techStack || []).some(tech => tech.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(result);
  }, [activeCategory, searchQuery, projects]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <motion.section 
      id="portfolio"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="py-12 md:py-16 select-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs shadow-sm backdrop-blur-sm">
          <FolderGit2 className="w-4 h-4" />
          <span>PORTFOLIO SHOWCASE</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300">Works</span>
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          A curated collection of my full-stack web applications, technical milestones, and code repositories.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        {/* Responsive Controls Wrapper */}
        <div className="flex flex-row items-center justify-between gap-3 max-w-4xl mx-auto w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-500 shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle - Fixed Size */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 sm:p-2.5 rounded-xl transition-all ${
                viewMode === 'grid' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 sm:p-2.5 rounded-xl transition-all ${
                viewMode === 'list' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
          <Filter className="w-4 h-4 text-slate-500 mr-1 hidden sm:block" />
          {CATEGORIES.map(category => {
            const categoryCount = projects.filter(p => isProjectInCategory(p, category)).length;
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer border hover:-translate-y-0.5 active:translate-y-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25 border-emerald-400/50'
                    : 'bg-slate-900/80 text-slate-400 hover:text-emerald-400 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/60'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {categoryCount}
                </span>
              </button>
            );
          })}
        </div>

        {!loading && !error && (
          <div className="text-center text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Showing <strong className="text-slate-300 font-semibold">{displayedProjects.length}</strong> of <strong className="text-slate-300 font-semibold">{filteredProjects.length}</strong> filtered milestones</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-60 rounded-2xl bg-slate-900/50 border border-slate-800/60 animate-pulse p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                <div className="h-6 bg-slate-800 rounded w-2/3"></div>
                <div className="h-12 bg-slate-800/60 rounded w-full"></div>
              </div>
              <div className="h-8 bg-slate-800 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center text-sm max-w-lg mx-auto shadow-sm">
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center text-slate-500 text-sm py-16 bg-slate-900/40 rounded-3xl border border-slate-800/60 max-w-md mx-auto space-y-2">
          <p className="font-semibold text-slate-400">No projects match your filter or search criteria.</p>
          <p className="text-xs text-slate-600">Try clearing your search query or selecting a different category.</p>
        </div>
      ) : (
        <>
          <motion.div 
            layout
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col gap-4 max-w-5xl mx-auto w-full"
            }
          >
            <AnimatePresence>
              {displayedProjects.map((project) => {
                
                const hasLiveApp = Boolean(project.liveUrl) && project.liveUrl.includes('http');
                const hasGifDemo = Boolean(project.imageUrl) && project.imageUrl.length > 0;
                const directFolderUrl = project.subPathUrl || project.githubUrl || '';
                
                const getMainRepoUrl = (url) => {
                  if (!url) return 'https://github.com/rajyabdullah-spec/portfolio-hub-mern';
                  const match = url.match(/https:\/\/github\.com\/[^\/]+\/[^\/]+/);
                  return match ? match[0] : url;
                };
                const mainRepoUrl = getMainRepoUrl(project.githubUrl || project.subPathUrl);

                return (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: viewMode === 'grid' ? 0.9 : 0.98, y: viewMode === 'list' ? 10 : 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    {viewMode === 'grid' ? (
                      <ProjectCard3D project={project} />
                    ) : (
                      /* Fully Expanded Horizontal List Row Card */
                      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-lg backdrop-blur-sm group">
                        
                        <div className="flex-1 space-y-2.5 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border shadow-sm ${
                              hasLiveApp
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : hasGifDemo
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                : 'bg-slate-800/80 border-slate-700/60 text-slate-400'
                            }`}>
                              {hasLiveApp ? '● Live Application' : hasGifDemo ? '🎬 Interactive Demo' : '💻 Code Module'}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                            {project.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(project.techStack || []).slice(0, 6).map((tech, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/50">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                          <div className="flex items-center gap-1.5">
                            {directFolderUrl && (
                              <a
                                href={directFolderUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                title="View Direct Project Code Folder"
                              >
                                <Code2 className="w-4 h-4" />
                              </a>
                            )}
                            <a
                              href={mainRepoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all hover:-translate-y-0.5 active:translate-y-0"
                              title="Open Repository Root"
                            >
                              <FolderGit2 className="w-4 h-4" />
                            </a>
                          </div>

                          {hasLiveApp ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all border border-emerald-400/30 hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <span>Live App</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : hasGifDemo ? (
                            <a
                              href={project.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all border border-indigo-400/30 hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Watch Demo</span>
                            </a>
                          ) : (
                            <a
                              href={directFolderUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all border border-slate-700 hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <Code2 className="w-3.5 h-3.5" />
                              <span>Explore Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
          
          <div className="flex justify-center items-center gap-4 mt-12">
            {hasMore && (
              <button
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-slate-800/80 transition-all cursor-pointer font-semibold text-xs shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Load More</span>
                <ChevronDown className="w-4 h-4 text-emerald-400" />
              </button>
            )}
            {visibleCount > ITEMS_PER_PAGE && (
              <button
                onClick={() => {
                  setVisibleCount(ITEMS_PER_PAGE);
                  const element = document.getElementById('portfolio');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/80 transition-all cursor-pointer font-semibold text-xs shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center pt-16 pb-4 w-full px-4"
          >
            <Link
              to="/contact"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 font-semibold text-xs sm:text-sm transition-all shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 text-center"
            >
              <span>Like What You See? Get In Touch</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
            </Link>
          </motion.div>

        </>
      )}
    </motion.section>
  );
};

export default PortfolioGrid;