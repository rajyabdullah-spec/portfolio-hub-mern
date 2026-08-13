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

  // Helper to match category logic for counts and filtering
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
          setError('Failed to fetch projects from backend API.');
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
    <section id="projects" className="py-16 border-t border-slate-800/60 select-none">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <FolderGit2 className="w-4 h-4" />
          <span>PORTFOLIO WORK</span>
        </div>
        <h2 className="text-3xl font-bold text-white">Engineering Progression</h2>
        <p className="text-xs text-slate-400 mt-1">
          A chronological journey tracking my growth across 70+ technical milestones.
        </p>
      </div>

      {/* Filter Categories Buttons */}
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
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 border-emerald-400'
                  : 'bg-slate-900/80 text-slate-400 hover:text-emerald-400 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/60'
              }`}
            >
              <span>{category}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-emerald-700/80 text-emerald-100'
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
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center text-sm max-w-lg mx-auto">
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="text-center text-slate-500 text-sm py-8">
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
          
          {/* Action Pagination Controls */}
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
                  const element = document.getElementById('projects');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
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
    </section>
  );
};

export default ProjectsGrid;