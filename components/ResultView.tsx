
import React from 'react';
import { FitnessResponse } from '../types';
import { 
  Utensils, 
  TrendingUp, 
  Calendar,
  Dumbbell,
  Target,
  RefreshCw,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface ResultViewProps {
  data: FitnessResponse;
  onReset: () => void;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ data, onReset, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-[#0f172a]">
      
      {/* Top Action Bar */}
      <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
              Plan Generated Successfully
            </h2>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-all text-sm font-medium"
        >
          <RefreshCw size={16} />
          New Plan
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex p-6 gap-6 min-w-max">
          
          {/* Column 1: Blueprint (Summary) */}
          <div className="w-[350px] flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">
              <Target size={14} />
              <span>Blueprint</span>
              <span className="ml-auto bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px]">Overview</span>
            </div>
            
            <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm overflow-y-auto custom-scrollbar flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
                  Executive Summary
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {data.summary}
                </p>
              </div>
              
              <div className="mt-auto p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Key Objectives</h4>
                <div className="space-y-2">
                   <div className="flex items-center gap-3 text-sm text-slate-300">
                     <CheckCircle2 size={16} className="text-indigo-500" />
                     <span>Optimized for your biology</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-300">
                     <CheckCircle2 size={16} className="text-indigo-500" />
                     <span>Sustainable progression</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-300">
                     <CheckCircle2 size={16} className="text-indigo-500" />
                     <span>Injury prevention focused</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Fuel (Nutrition) */}
          <div className="w-[350px] flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">
              <Utensils size={14} />
              <span>Fuel Strategy</span>
            </div>

            <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-0 backdrop-blur-sm overflow-y-auto custom-scrollbar flex flex-col">
              {/* Macro Header */}
              <div className="p-6 bg-gradient-to-br from-emerald-900/50 to-slate-900 border-b border-emerald-500/20">
                <div className="flex justify-between items-end mb-2">
                   <span className="text-emerald-400 text-xs font-bold uppercase">Daily Target</span>
                </div>
                <div className="text-5xl font-bold text-white mb-1 tracking-tight">
                  {data.nutrition.dailyCalories}
                </div>
                <div className="text-sm text-emerald-200/70 font-medium">Kcal per day</div>
              </div>

              {/* Macro Grid */}
              <div className="grid grid-cols-2 gap-px bg-slate-700">
                <div className="bg-slate-800 p-4 text-center hover:bg-slate-750 transition-colors">
                  <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Protein</div>
                  <div className="text-lg font-bold text-white">{data.nutrition.protein}</div>
                </div>
                <div className="bg-slate-800 p-4 text-center hover:bg-slate-750 transition-colors">
                  <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Carbs</div>
                  <div className="text-lg font-bold text-white">{data.nutrition.carbs}</div>
                </div>
                <div className="bg-slate-800 p-4 text-center hover:bg-slate-750 transition-colors">
                  <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Fats</div>
                  <div className="text-lg font-bold text-white">{data.nutrition.fats}</div>
                </div>
                <div className="bg-slate-800 p-4 text-center hover:bg-slate-750 transition-colors">
                  <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Fiber</div>
                  <div className="text-lg font-bold text-white">{data.nutrition.fiber}</div>
                </div>
              </div>

              {/* Food List */}
              <div className="p-6">
                <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                  Recommended Sources
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.nutrition.keyFoods.map((food, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg font-medium border border-emerald-500/20">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Action (Workout) */}
          <div className="w-[400px] flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">
              <Calendar size={14} />
              <span>Action Plan</span>
              <span className="ml-auto bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full text-[10px]">{data.weeklySchedule.length} Sessions</span>
            </div>

            <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-2 backdrop-blur-sm overflow-y-auto custom-scrollbar space-y-3">
              {data.weeklySchedule.map((dayPlan, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-700 rounded-xl p-4 hover:border-indigo-500/50 transition-all group">
                   <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800">
                      <h4 className="font-bold text-white">{dayPlan.day}</h4>
                      <span className="text-[10px] font-bold uppercase px-2 py-1 bg-indigo-500 text-white rounded">
                        {dayPlan.focus}
                      </span>
                   </div>
                   <div className="space-y-2">
                     {dayPlan.exercises.map((ex, i) => (
                       <div key={i} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Dumbbell size={12} className="text-slate-600" />
                            <span>{ex.exercise}</span>
                          </div>
                          <div className="flex gap-2 text-xs font-mono text-slate-500">
                             <span className="text-indigo-300">{ex.sets} sets</span>
                             <span>×</span>
                             <span>{ex.reps}</span>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Forecast (Milestones) */}
          <div className="w-[300px] flex flex-col gap-4 h-full">
             <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">
              <TrendingUp size={14} />
              <span>Forecast</span>
            </div>

            <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm overflow-y-auto custom-scrollbar relative">
               {/* Timeline Line */}
               <div className="absolute left-[43px] top-8 bottom-8 w-0.5 bg-slate-700/50"></div>

               <div className="space-y-8 relative">
                  {data.milestones.map((ms, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                       <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900 border border-slate-600 text-blue-400 flex items-center justify-center font-bold z-10 shadow-lg shadow-black/50">
                          {ms.month}
                       </div>
                       <div className="pt-1">
                          <div className="text-white font-bold mb-1">{ms.expectedResult}</div>
                          <p className="text-xs text-slate-400 leading-relaxed">{ms.description}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultView;
