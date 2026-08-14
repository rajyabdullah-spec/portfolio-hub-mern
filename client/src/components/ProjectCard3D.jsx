import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, FolderGit2, PlayCircle, Share2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectCard3D = ({ project }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [copied, setCopied] = useState(false);

  // Determine showcase buttons
  const hasLiveApp = Boolean(project.liveUrl) && project.liveUrl.includes('http');
  const hasGifDemo = Boolean(project.imageUrl) && project.imageUrl.length > 0;
  
  // Folder Path vs Main Repo Root
  const directFolderUrl = project.subPathUrl || project.githubUrl || '';
  
  const getMainRepoUrl = (url) => {
    if (!url) return 'https://github.com/rajyabdullah-spec/portfolio-hub-mern';
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

    const rotateXVal = ((y - centerY) / centerY) * -7;
    const rotateYVal = ((x - centerX) / centerX) * 7;

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

  // Share Direct Link Handler
  const handleShare = async (e) => {
    e.stopPropagation();
    const targetUrl = directFolderUrl || window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: targetUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard if share was cancelled or unsupported
      }
    }

    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    toast.success('Project link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative rounded-3xl bg-slate-900/90 border border-slate-800/80 p-6 group hover:border-emerald-500/50 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between min-h-[240px] select-none backdrop-blur-sm"
    >
      {/* Radial Mouse Follow Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
        style={{
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(16, 185, 129, 0.14), transparent 80%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header Bar with Badge & Share Button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border shadow-sm ${
            hasLiveApp
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : hasGifDemo
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-400'
          }`}>
            {hasLiveApp ? '● Live Application' : hasGifDemo ? '🎬 Interactive Demo' : '💻 Code Module'}
          </span>

          {/* Share Action */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 border border-slate-700/50 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            title="Share Project Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-1">
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
              className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/50 group-hover:border-slate-600/60 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Links Bar */}
      <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-800/80 text-xs relative z-10">
        
        {/* Primary Action Button */}
        {hasLiveApp ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all border border-emerald-400/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Live App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : hasGifDemo ? (
          <a
            href={project.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all border border-indigo-400/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Watch Demo</span>
          </a>
        ) : (
          <a
            href={directFolderUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all border border-slate-700 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Explore Code</span>
          </a>
        )}

        {/* Secondary GitHub Actions (Original Layout Restored) */}
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

      </div>
    </motion.div>
  );
};

export default ProjectCard3D;