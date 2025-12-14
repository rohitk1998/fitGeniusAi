
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const GeneratingView: React.FC = () => (
    <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-700">
       <div className="relative mb-8">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="w-24 h-24 bg-white border border-indigo-100 rounded-full flex items-center justify-center shadow-lg relative z-10">
             <Brain className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center animate-bounce">
             <Sparkles className="w-4 h-4 text-white" />
          </div>
       </div>
       <h3 className="text-2xl font-bold text-slate-900 mb-2">Designing Protocol</h3>
       <p className="text-slate-500 mb-8 text-center max-w-md">Analyzing metabolic data and constructing your hyper-personalized periodization plan...</p>
       
       {/* Progress Bar */}
       <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-[loading_2s_ease-in-out_infinite] w-full origin-left"></div>
       </div>
    </div>
);

export default GeneratingView;
