import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Loader2, Filter, ChevronDown, ChevronUp, Search, X, Sparkles } from 'lucide-react';
import ProjectCard3D from './ProjectCard3D';
import API from '../api/axios';

const CATEGORIES = ['All', 'HTML & CSS', 'Vanilla JS', 'Algorithms', 'AJAX & APIs', 'Node.js', 'React'];
const ITEMS_PER_PAGE = 12;

const PortfolioGrid = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
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
      {/* Header Section */}
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

      {/* Controls Bar: Categories & Live Search */}
      <div className="space-y-6 mb-10">
        
        {/* Real-time Search Input */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, keyword, or tech..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-500 shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Categories Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-2">
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

        {/* Counter Badge */}
        {!loading && !error && (
          <div className="text-center text-[11px] font-mono text-slate-500 flex items-center justify-center gap-1.5 pt-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Showing <strong className="text-slate-300 font-semibold">{displayedProjects.length}</strong> of <strong className="text-slate-300 font-semibold">{filteredProjects.length}</strong> filtered milestones</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {displayedProjects.map((project) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard3D project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Pagination Controls */}
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
        </>
      )}
    </motion.section>
  );
};

export default PortfolioGrid;