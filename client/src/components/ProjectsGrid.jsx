import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FolderGit2, Loader2, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import ProjectCard3D from './ProjectCard3D';

const CATEGORIES = ['All', 'HTML & CSS', 'Vanilla JS', 'Algorithms', 'AJAX & APIs', 'Node.js', 'React'];
const ITEMS_PER_PAGE = 12;

const ProjectsGrid = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        const data = response.data.data || [];
        
        const strictlyOrderedData = data.sort((a, b) => a._id.localeCompare(b._id));
        
        setProjects(strictlyOrderedData);
        setFilteredProjects(strictlyOrderedData);
      } catch (err) {
        setError('Failed to fetch projects from backend API.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE); 
    
    if (activeCategory === 'All') {
      setFilteredProjects(projects);
      return;
    }

    const filtered = projects.filter(project => {
      const techs = project.techStack.map(t => t.toLowerCase());
      
      const hasReact = techs.includes('react') || techs.includes('react 18');
      const hasNode = techs.includes('node.js');
      const hasAjax = techs.includes('ajax');
      const hasAlgo = techs.includes('algorithms');
      const hasJS = techs.includes('javascript');
      const hasHtmlCss = techs.includes('html5') || techs.includes('css3') || techs.includes('bootstrap') || techs.includes('bootstrap 5') || techs.includes('materialize css');

      switch (activeCategory) {
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
    });

    setFilteredProjects(filtered);
  }, [activeCategory, projects]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  return (
    <section id="projects" className="py-16 border-t border-slate-800/60">
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm">
          <FolderGit2 className="w-4 h-4" />
          <span>PORTFOLIO WORK</span>
        </div>
        <h2 className="text-3xl font-bold text-white">Engineering Progression</h2>
        <p className="text-xs text-slate-400 mt-1">
          A chronological journey tracking my growth across 70+ technical milestones.
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-2 mb-10 px-4">
        <Filter className="w-4 h-4 text-slate-500 mr-2" />
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeCategory === category
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 border border-primary-500'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <ProjectCard3D key={project._id} project={project} />
            ))}
          </div>
          
          <div className="flex justify-center items-center gap-4 mt-12">
            {hasMore && (
              <button
                onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer font-semibold text-xs shadow-lg"
              >
                <span>Load More</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            {visibleCount > ITEMS_PER_PAGE && (
              <button
                onClick={() => {
                  setVisibleCount(ITEMS_PER_PAGE);
                  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer font-semibold text-xs"
              >
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectsGrid;