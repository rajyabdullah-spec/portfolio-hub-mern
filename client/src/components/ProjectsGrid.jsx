import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FolderGit2, ExternalLink, Code2, Loader2 } from 'lucide-react';

const ProjectsGrid = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data.data);
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
            <div
              key={project._id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
            >
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-800/60 text-xs">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsGrid;