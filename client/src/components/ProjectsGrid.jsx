import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FolderGit2, Loader2 } from 'lucide-react';
import ProjectCard3D from './ProjectCard3D';

const ProjectsGrid = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch projects from backend API.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-16 border-t border-slate-800/60">
      <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm">
          <FolderGit2 className="w-4 h-4" />
          <span>PORTFOLIO WORK</span>
        </div>
        <h2 className="text-3xl font-bold text-white">Featured Projects</h2>
        <p className="text-xs text-slate-400 mt-1">
          Hover over cards to experience interactive 3D perspective
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <p className="text-center text-slate-500 text-sm py-8">
          No projects found in the database yet. Add some via Admin Panel!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard3D key={project._id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsGrid;