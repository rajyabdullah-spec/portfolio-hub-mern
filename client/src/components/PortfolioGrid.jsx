import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Loader2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import ProjectCard3D from './ProjectCard3D';
import API from '../api/axios';

const CATEGORIES = ['All', 'HTML & CSS', 'Vanilla JS', 'Algorithms', 'AJAX & APIs', 'Node.js', 'React'];
const ITEMS_PER_PAGE = 12;

const ProjectsGrid = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
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
    const filtered = projects.filter(project => isProjectInCategory(project, activeCategory));
    setFilteredProjects(filtered);
  }, [activeCategory, projects]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <motion.section 
      id="portfolio"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="py-12 md:py-16 select-none"
    >
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm shadow-sm">
          <FolderGit2 className="w-4 h-4" />
          <span>PORTFOLIO SHOWCASE</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Works</span>
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          A curated collection of my full-stack applications and technical milestones.
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 mb-10 px-4">
        <Filter className="w-4 h-4 text-slate-500 mr-1" />
        {CATEGORIES.map(category => {
          const categoryCount = projects.filter(p => isProjectInCategory(p, category)).length;
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer border hover:-translate-y-0.5 active:translate-y-0 ${
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

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <span className="text-slate-400 text-sm font-mono animate-pulse">Loading Portfolio...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center text-sm max-w-lg mx-auto shadow-sm">
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-center text-slate-500 text-sm py-12 bg-slate-900/50 rounded-2xl border border-slate-800/50 max-w-md mx-auto">
          No projects found under this category filter.
        </p>
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

export default ProjectsGrid;