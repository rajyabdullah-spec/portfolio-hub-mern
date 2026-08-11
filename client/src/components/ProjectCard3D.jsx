import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, FolderGit2, PlayCircle } from 'lucide-react';

const ProjectCard3D = ({ project }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  // Determine showcase buttons
  const hasLiveApp = Boolean(project.liveUrl) && project.liveUrl.includes('http');
  const hasGifDemo = Boolean(project.imageUrl) && project.imageUrl.length > 0;
  
  // Folder Path vs Main Repo Root
  const directFolderUrl = project.subPathUrl || project.githubUrl || '';
  
  const getMainRepoUrl = (url) => {
    if (!url) return 'https://github.com/rajyabdullah-spec';
    const match = url.match(/https:\/\/github\.com\/[^\/]+\/[^\/]+/);
    return match ? match[0] : url;
  };

  const mainRepoUrl = getMainRepoUrl(project.githubUrl || project.subPathUrl);

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;

    const centerX = card.width / 2;
    const centerY = card.height / 2;

    const rotateXVal = ((y - centerY) / centerY) * -8;
    const rotateYVal = ((x - centerX) / centerX) * 8;

    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
    setGlowPos({
      x: (x / card.width) * 100,
      y: (y / card.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-2xl bg-slate-900/90 border border-slate-800/80 p-6 group hover:border-emerald-500/50 transition-colors shadow-xl overflow-hidden flex flex-col justify-between min-h-[230px]"
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(16, 185, 129, 0.12), transparent 80%)`,
        }}
      />

      <div>
        {/* Type Badge & Status Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
            hasLiveApp
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : hasGifDemo
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            {hasLiveApp ? '● Live Application' : hasGifDemo ? '🎬 Interactive Demo' : '💻 Code Module'}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-slate-400 mb-5 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {(project.techStack || []).map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/50"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Links Bar */}
      <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-800/80 text-xs">
        
        {/* Primary Action Button */}
        {hasLiveApp ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all border border-emerald-400/30"
          >
            <span>Live App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : hasGifDemo ? (
          <a
            href={project.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all border border-indigo-400/30"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Watch Demo</span>
          </a>
        ) : (
          <a
            href={directFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all border border-slate-700"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Explore Code</span>
          </a>
        )}

        {/* Secondary GitHub Actions */}
        <div className="flex items-center gap-1.5">
          {/* 1. Direct Project Code Folder Link */}
          {directFolderUrl && (
            <a
              href={directFolderUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
              title="View Direct Project Code Folder"
            >
              <Code2 className="w-4 h-4" />
            </a>
          )}

          {/* 2. Main Repository Root Link (README.md) */}
          <a
            href={mainRepoUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
            title="Open Repository Root (README.md)"
          >
            <FolderGit2 className="w-4 h-4" />
          </a>
        </div>

      </div>
    </motion.div>
  );
};

export default ProjectCard3D;