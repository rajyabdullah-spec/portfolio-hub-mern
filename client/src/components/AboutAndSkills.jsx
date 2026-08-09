import React from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

const skills = [
  'JavaScript (ES6+)', 'React.js', 'Node.js', 'Express.js',
  'MongoDB & Mongoose', 'Tailwind CSS', 'RESTful APIs', 'Git & GitHub'
];

const AboutAndSkills = () => {
  return (
    <section id="about" className="py-16 border-t border-slate-800/60">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* About Text */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-primary-400 font-semibold text-sm">
            <Cpu className="w-4 h-4" />
            <span>ABOUT ME</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Passionate About Crafting Clean & Efficient Code
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            As a Software Engineering student focused on web development, I bridge the gap between frontend user experience and backend system architecture. My goal is to build reliable, maintainable platforms that solve real-world problems.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <h3 className="text-lg font-bold text-white mb-4">Core Tech Stack</h3>
          <div className="grid grid-cols-2 gap-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutAndSkills;