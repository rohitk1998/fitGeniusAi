
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FeatureSectionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string; // e.g. "indigo"
  buttonText: string;
  onAction: () => void;
  visualContent: React.ReactNode;
  reversed?: boolean;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ 
  id, title, description, icon, colorClass, buttonText, onAction, visualContent, reversed 
}) => {
  
  // Tailwind dynamic class construction is risky, but we'll use a mapping or simple prop passing for colors in a real app. 
  // For simplicity here, we assume colorClass maps to standard tailwind colors like 'indigo', 'emerald', 'blue', 'orange'.
  
  // Helper to generate dynamic styles
  const getButtonClass = () => {
    switch(colorClass) {
      case 'indigo': return "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700";
      case 'emerald': return "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700";
      case 'blue': return "bg-blue-600 shadow-blue-200 hover:bg-blue-700";
      case 'orange': return "bg-orange-600 shadow-orange-900/50 hover:bg-orange-700";
      default: return "bg-slate-900 shadow-slate-200 hover:bg-slate-800";
    }
  };

  const getIconBgClass = () => {
    switch(colorClass) {
      case 'indigo': return "bg-indigo-50 text-indigo-600";
      case 'emerald': return "bg-emerald-50 text-emerald-600";
      case 'blue': return "bg-blue-50 text-blue-600";
      case 'orange': return "bg-orange-500/20 text-orange-500";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  const isDark = colorClass === 'orange'; // Hardcoded for Stats section which is dark mode

  return (
    <section 
      id={id} 
      className={`scroll-mt-32 py-24 px-6 md:px-20 max-w-7xl mx-auto border-b border-gray-100 ${isDark ? 'bg-slate-900 rounded-[3rem] text-white my-12 border-none' : ''} ${id === 'tracker' ? 'bg-slate-50/50 rounded-[3rem] my-12' : ''}`}
    >
      <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16`}>
        <div className="flex-1 space-y-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getIconBgClass()}`}>
            {icon}
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
          <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {description}
          </p>
          <button 
            onClick={onAction}
            className={`${getButtonClass()} text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2`}
          >
            {buttonText} <ArrowRight size={18} />
          </button>
        </div>
        
        {/* Visual Container */}
        <div onClick={onAction} className={`flex-1 w-full ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-3xl shadow-2xl cursor-pointer hover:-translate-y-2 transition-transform duration-500 group overflow-hidden border`}>
          {visualContent}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
