import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Code2, Copy, Check, Terminal, Server, Database } from 'lucide-react';
import API from '../api/axios'; // ✅ Centralized API client

const SKILLS_TEMPLATE = [
  { name: 'React', keywords: ['React', 'JSX', 'Hooks', 'Context API'], count: 0, color: '#61DAFB', bg: 'hover:bg-[#61DAFB]/10 hover:border-[#61DAFB]' },
  { name: 'Node.js', keywords: ['Node.js', 'Node'], count: 0, color: '#339933', bg: 'hover:bg-[#339933]/10 hover:border-[#339933]' },
  { name: 'Express.js', keywords: ['Express.js', 'Express', 'MVC', 'REST API', 'REST'], count: 0, color: '#FFFFFF', bg: 'hover:bg-white/10 hover:border-white' },
  { name: 'MongoDB & Mongoose', keywords: ['MongoDB', 'Mongoose', 'Database'], count: 0, color: '#47A248', bg: 'hover:bg-[#47A248]/10 hover:border-[#47A248]' },
  { name: 'JavaScript (ES6+)', keywords: ['JavaScript', 'JS', 'ES6', 'DOM', 'Arrow Functions'], count: 0, color: '#F7DF1E', bg: 'hover:bg-[#F7DF1E]/10 hover:border-[#F7DF1E]' },
  { name: 'JWT & Security', keywords: ['JWT', 'JWT Auth', 'Bcrypt', 'HTTP-Only Cookies', 'Auth'], count: 0, color: '#EC4899', bg: 'hover:bg-pink-500/10 hover:border-pink-500' },
  { name: 'AJAX & Fetch API', keywords: ['AJAX', 'Fetch API', 'XHR', 'OMDb API', 'FakeStore API', 'OpenWeather API'], count: 0, color: '#06B6D4', bg: 'hover:bg-cyan-500/10 hover:border-cyan-500' },
  { name: 'Algorithms & Logic', keywords: ['Algorithms', 'Loops', 'Logic', 'Recursion', 'Bubble Sort'], count: 0, color: '#E34F26', bg: 'hover:bg-[#E34F26]/10 hover:border-[#E34F26]' },
  { name: 'OOP & Async', keywords: ['OOP', 'Promises', 'Async', 'Async/Await', 'ES6 Classes'], count: 0, color: '#F48024', bg: 'hover:bg-[#F48024]/10 hover:border-[#F48024]' },
  { name: 'Tailwind & UI', keywords: ['Tailwind', 'Bootstrap', 'Bootstrap 5', 'CSS3'], count: 0, color: '#38BDF8', bg: 'hover:bg-sky-500/10 hover:border-sky-500' },
  { name: 'HTML5 & Semantics', keywords: ['HTML5', 'Semantics', 'HTML Forms', 'HTML'], count: 0, color: '#E44D26', bg: 'hover:bg-orange-500/10 hover:border-orange-500' },
  { name: 'Git & GitHub', keywords: ['Git', 'GitHub', 'Version Control'], count: 0, color: '#F05032', bg: 'hover:bg-[#F05032]/10 hover:border-[#F05032]' }
];

const HIGHLIGHT_CARDS = [
  { icon: Terminal, title: 'Frontend Mastery', desc: 'React 18, Single Page Apps, Context API, Router DOM v6' },
  { icon: Server, title: 'Backend Engine', desc: 'Node.js, Express REST APIs, JWT Auth, MVC Architecture' },
  { icon: Database, title: 'Data Management', desc: 'MongoDB Atlas, Mongoose Relational Schemas, Indexing' }
];

const AboutAndSkills = () => {
  const [copied, setCopied] = useState(false);
  const [skills, setSkills] = useState(SKILLS_TEMPLATE);
  
  const myEmail = "Rajyabdullah@gmail.com";

  useEffect(() => {
    const fetchAndCalculateSkills = async () => {
      try {
        // ✅ Safely fetch via centralized API instance
        const response = await API.get('/projects');
        const allProjects = response.data.data || [];
        
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
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(myEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="about" className="py-16 space-y-16 border-t border-slate-800/60">
      
      {/* About Section */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <User className="w-3.5 h-3.5" />
            <span>ABOUT ME</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Full-Stack Software Engineer</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Passionate about building scalable, secure, and intuitive web applications using the MERN stack.
            Focused on clean architecture, modern UI design, and robust backend microservices.
          </p>

          {/* Copy Email Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all duration-300 border cursor-pointer ${
                copied
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-emerald-500/50 hover:text-white shadow-md'
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

        {/* Feature Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {HIGHLIGHT_CARDS.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/30 transition-all shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 w-fit text-emerald-400 border border-slate-700/50">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-sm">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Skills Section */}
      <div id="skills" className="space-y-6 pt-6 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Code2 className="w-3.5 h-3.5" />
            <span>SKILLS & TECH STACK</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Technologies I Work With</h3>
          <p className="text-xs text-slate-400">
            Database-synced project counters based on core tech stack
          </p>
        </div>

        {/* Badges Grid */}
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
              className={`px-4 py-2.5 rounded-xl border border-slate-800/80 bg-slate-900/90 text-slate-300 font-medium text-xs transition-colors duration-200 shadow-md flex items-center gap-2 ${skill.bg}`}
            >
              <span style={{ color: skill.color }} className="font-bold text-sm">●</span>
              <span>{skill.name}</span>
              {skill.count > 0 && (
                <span className="ml-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
                  {skill.count}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutAndSkills;