import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Code2, Copy, Check, Terminal, Server, Database, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

const SKILLS_TEMPLATE = [
  { name: 'React 18', category: 'Frontend', keywords: ['React', 'JSX', 'Hooks', 'Context API'], count: 0, color: '#61DAFB', bg: 'hover:bg-[#61DAFB]/10 hover:border-[#61DAFB]/50' },
  { name: 'Node.js', category: 'Backend', keywords: ['Node.js', 'Node'], count: 0, color: '#339933', bg: 'hover:bg-[#339933]/10 hover:border-[#339933]/50' },
  { name: 'Express.js & APIs', category: 'Backend', keywords: ['Express.js', 'Express', 'MVC', 'REST API', 'REST'], count: 0, color: '#FFFFFF', bg: 'hover:bg-white/10 hover:border-white/50' },
  { name: 'MongoDB & Mongoose', category: 'Database', keywords: ['MongoDB', 'Mongoose', 'Database'], count: 0, color: '#47A248', bg: 'hover:bg-[#47A248]/10 hover:border-[#47A248]/50' },
  { name: 'JavaScript (ES6+)', category: 'Core', keywords: ['JavaScript', 'JS', 'ES6', 'DOM', 'Arrow Functions'], count: 0, color: '#F7DF1E', bg: 'hover:bg-[#F7DF1E]/10 hover:border-[#F7DF1E]/50' },
  { name: 'JWT & Auth Security', category: 'Backend', keywords: ['JWT', 'JWT Auth', 'Bcrypt', 'HTTP-Only Cookies', 'Auth'], count: 0, color: '#EC4899', bg: 'hover:bg-pink-500/10 hover:border-pink-500/50' },
  { name: 'REST & External APIs', category: 'Frontend', keywords: ['AJAX', 'Fetch API', 'XHR', 'OMDb API', 'FakeStore API', 'OpenWeather API'], count: 0, color: '#06B6D4', bg: 'hover:bg-cyan-500/10 hover:border-cyan-500/50' },
  { name: 'Algorithms & Logic', category: 'Core', keywords: ['Algorithms', 'Loops', 'Logic', 'Recursion', 'Bubble Sort'], count: 0, color: '#E34F26', bg: 'hover:bg-[#E34F26]/10 hover:border-[#E34F26]/50' },
  { name: 'OOP & Async JS', category: 'Core', keywords: ['OOP', 'Promises', 'Async', 'Async/Await', 'ES6 Classes'], count: 0, color: '#F48024', bg: 'hover:bg-[#F48024]/10 hover:border-[#F48024]/50' },
  { name: 'Tailwind CSS v4', category: 'Frontend', keywords: ['Tailwind', 'Bootstrap', 'Bootstrap 5', 'CSS3'], count: 0, color: '#38BDF8', bg: 'hover:bg-sky-500/10 hover:border-sky-500/50' },
  { name: 'Semantic HTML5', category: 'Frontend', keywords: ['HTML5', 'Semantics', 'HTML Forms', 'HTML'], count: 0, color: '#E44D26', bg: 'hover:bg-orange-500/10 hover:border-orange-500/50' },
  { name: 'Git & GitHub Workflow', category: 'Tools', keywords: ['Git', 'GitHub', 'Version Control'], count: 0, color: '#F05032', bg: 'hover:bg-[#F05032]/10 hover:border-[#F05032]/50' }
];

const HIGHLIGHT_CARDS = [
  { icon: Terminal, title: 'Frontend Architecture', desc: 'Crafting responsive Single Page Applications (SPAs) with React 18, Tailwind CSS, and optimized state management.' },
  { icon: Server, title: 'Backend Engineering', desc: 'Designing RESTful APIs with Node.js, Express, stateful JWT authentication, and security middleware.' },
  { icon: Database, title: 'Database & Data Modeling', desc: 'Managing MongoDB Atlas databases, structured Mongoose schemas, data validation, and aggregation pipelines.' }
];

const AboutAndSkills = () => {
  const [copied, setCopied] = useState(false);
  const [skills, setSkills] = useState(SKILLS_TEMPLATE);
  
  const myEmail = "rajyabdullah@gmail.com";

  useEffect(() => {
    let isMounted = true;

    const fetchAndCalculateSkills = async () => {
      try {
        const response = await API.get('/projects');
        const allProjects = response.data.data || [];
        
        if (!isMounted) return;

        const updatedSkills = SKILLS_TEMPLATE.map(skill => {
          const matchCount = allProjects.filter(project => 
            (project.techStack || []).some(tech => 
              skill.keywords.some(keyword => tech.toLowerCase().includes(keyword.toLowerCase()))
            )
          ).length;
          
          return { ...skill, count: matchCount };
        });
        
        setSkills(updatedSkills);
      } catch (error) {
        console.error("Failed to load project counts for skills mapping", error);
      }
    };
    
    fetchAndCalculateSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(myEmail);
    setCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.section 
      id="about" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="py-12 md:py-16 space-y-16 select-none"
    >
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
            <User className="w-3.5 h-3.5" />
            <span>ABOUT ME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Full-Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-300">Software Engineer</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
            Passionately engineering scalable, secure, and intuitive web applications using the MERN stack.
            Focused on clean architecture, modern UI design, and robust backend services.
          </p>

          <div className="pt-3 flex justify-center">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all duration-300 border cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
                copied
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-white shadow-md'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied to Clipboard! 📋</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>{myEmail}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          {HIGHLIGHT_CARDS.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/40 transition-colors shadow-xl flex flex-col justify-between group backdrop-blur-md"
              >
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-800/80 w-fit text-emerald-400 border border-slate-700/50 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="skills" className="space-y-8 pt-6 max-w-4xl mx-auto px-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
            <Code2 className="w-3.5 h-3.5" />
            <span>SKILLS & TECH STACK</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Technologies I Work With</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Database-synced skill counters dynamically calculating project milestones in real time.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 pt-2"
        >
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2.5 rounded-2xl border border-slate-800/80 bg-slate-900/90 text-slate-300 font-medium text-xs transition-all duration-200 shadow-lg flex items-center gap-2.5 backdrop-blur-sm cursor-default ${skill.bg}`}
            >
              <span style={{ color: skill.color }} className="font-bold text-sm">●</span>
              <span className="font-semibold">{skill.name}</span>
              {skill.count > 0 && (
                <span className="ml-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 shadow-inner">
                  {skill.count} {skill.count === 1 ? 'project' : 'projects'}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500 pt-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time skill aggregation synced with MongoDB Atlas</span>
        </div>

        {/* Fully Responsive CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex justify-center pt-12 pb-4 w-full px-4"
        >
          <Link
            to="/portfolio"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 font-semibold text-xs sm:text-sm transition-all shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 text-center"
          >
            <span>Next: Check Out My Work & Projects</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
          </Link>
        </motion.div>

      </div>
    </motion.section>
  );
};

export default AboutAndSkills;