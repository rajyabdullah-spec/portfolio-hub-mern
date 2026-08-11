import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Code2, Copy, Check } from 'lucide-react';

const SKILLS_TEMPLATE = [
  { name: 'React', keywords: ['React'], count: 0, color: '#61DAFB', bg: 'hover:bg-[#61DAFB]/10 hover:border-[#61DAFB]' },
  { name: 'Node.js', keywords: ['Node.js'], count: 0, color: '#339933', bg: 'hover:bg-[#339933]/10 hover:border-[#339933]' },
  { name: 'Express.js', keywords: ['Express.js', 'Express', 'MVC'], count: 0, color: '#FFFFFF', bg: 'hover:bg-white/10 hover:border-white' },
  { name: 'MongoDB', keywords: ['MongoDB', 'Mongoose', 'Database'], count: 0, color: '#47A248', bg: 'hover:bg-[#47A248]/10 hover:border-[#47A248]' },
  { name: 'JavaScript', keywords: ['JavaScript', 'JS', 'ES6', 'DOM'], count: 0, color: '#F7DF1E', bg: 'hover:bg-[#F7DF1E]/10 hover:border-[#F7DF1E]' },
  { name: 'Algorithms', keywords: ['Algorithms', 'Loops', 'Logic'], count: 0, color: '#E34F26', bg: 'hover:bg-[#E34F26]/10 hover:border-[#E34F26]' },
  { name: 'OOP & Async', keywords: ['OOP', 'Promises', 'Async', 'Fetch'], count: 0, color: '#F48024', bg: 'hover:bg-[#F48024]/10 hover:border-[#F48024]' },
  { name: 'Git & GitHub', keywords: ['Git', 'GitHub', 'Version Control'], count: 0, color: '#F05032', bg: 'hover:bg-[#F05032]/10 hover:border-[#F05032]' },
  { name: 'REST APIs', keywords: ['REST API', 'API', 'AJAX', 'Postman'], count: 0, color: '#A855F7', bg: 'hover:bg-purple-500/10 hover:border-purple-500' },
  { name: 'HTML & CSS', keywords: ['HTML5', 'CSS3', 'Bootstrap', 'Tailwind'], count: 0, color: '#1572B6', bg: 'hover:bg-[#1572B6]/10 hover:border-[#1572B6]' }
];

const AboutAndSkills = () => {
  const [copied, setCopied] = useState(false);
  const [skills, setSkills] = useState(SKILLS_TEMPLATE);
  
  const myEmail = "Rajyabdullah@gmail.com";

  useEffect(() => {
    const fetchAndCalculateSkills = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        const allProjects = response.data.data || [];
        
        // Dynamically count projects based on keywords matching the techStack
        const updatedSkills = SKILLS_TEMPLATE.map(skill => {
          const matchCount = allProjects.filter(project => 
            project.techStack.some(tech => 
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
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm">
          <User className="w-4 h-4" />
          <span>ABOUT ME</span>
        </div>
        <h2 className="text-3xl font-bold text-white">Full-Stack Developer</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Passionate about building scalable, secure, and intuitive web applications using the MERN stack.
          I focus on clean architecture, modern UI design, and robust backend logic.
        </p>

        {/* Copy Email Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all duration-300 border cursor-pointer ${
              copied
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
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

      {/* Dynamic Skills Section */}
      <div id="skills" className="space-y-6 pt-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm">
            <Code2 className="w-4 h-4" />
            <span>SKILLS & STACK</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Technologies I Work With</h3>
          <p className="text-xs text-slate-400">Hover over any technology to reveal database-synced project counts</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto pt-2">
          {skills.map((skill, idx) => (
            <div key={idx} className="relative group">
              {/* Tooltip Bubble */}
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-top-10 transition-all duration-300 pointer-events-none z-20">
                <div className="bg-slate-900 border border-slate-700 text-white text-[10px] font-mono py-1 px-2.5 rounded-lg shadow-2xl whitespace-nowrap">
                  {skill.count} Projects Built 🚀
                </div>
              </div>

              {/* Skill Badge */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 font-medium text-xs cursor-pointer transition-colors duration-300 shadow-md ${skill.bg}`}
              >
                <span style={{ color: skill.color }} className="font-bold mr-2 text-sm">●</span>
                {skill.name}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAndSkills;