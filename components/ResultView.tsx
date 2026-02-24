import React from 'react';
import { FitnessResponse } from '../types';
import { 
  Utensils, 
  TrendingUp, 
  Dumbbell,
  Target,
  RefreshCw,
  ArrowLeft,
  Clock,
  Flame,
  Award,
  Zap
} from 'lucide-react';

interface ResultViewProps {
  data: FitnessResponse;
  onReset: () => void;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ data, onReset, onBack }) => {
  return (
    <div className="h-full w-full bg-slate-50 flex flex-col overflow-hidden animate-fade-in">
      {/* Page Header */}
      <div className="flex-none bg-white px-12 py-8 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Protocol</h2>
            <p className="text-slate-500 font-medium">Custom engineered for your biological profile.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onReset} className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition-all">
            <RefreshCw size={16} /> Re-Calculate
          </button>
        </div>
      </div>

      {/* 3-Column Desktop Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-12 grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* Column 1: Summary & Forecast (xl:col-span-3) */}
        <div className="xl:col-span-3 space-y-8">
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                   <Target size={20} className="text-indigo-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">The Mission</span>
                </div>
                <p className="text-lg font-medium leading-relaxed mb-8">{data.summary}</p>
                <div className="flex flex-wrap gap-2">
                   <div className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 uppercase tracking-widest">Growth Phase</div>
                   <div className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-bold border border-white/10 uppercase tracking-widest">Optimized</div>
                </div>
             </div>
             <Award className="absolute -right-12 -bottom-12 text-white/5" size={240} />
          </section>

          <section className="space-y-4">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 px-2">
                <TrendingUp size={16} className="text-indigo-600" /> Forecasted Milestones
             </h3>
             <div className="space-y-4">
                {data.milestones.map((m, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                     <div className="flex justify-between mb-4">
                        <span className="text-[10px] font-black text-indigo-600 uppercase">Month {m.month}</span>
                        <div className="h-4 w-4 rounded-full bg-indigo-100 flex items-center justify-center">
                           <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                        </div>
                     </div>
                     <div className="text-xl font-black text-slate-900 mb-1">{m.expectedResult}</div>
                     <p className="text-xs text-slate-500 italic">"{m.motivationalQuote}"</p>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* Column 2: Nutrition Lab (xl:col-span-4) */}
        <div className="xl:col-span-4 space-y-8">
           <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Utensils size={24} className="text-emerald-500"/> Nutrition Lab
                </h3>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs">
                   {data.nutrition.dailyCalories} kcal
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <MacroBox label="Protein" val={data.nutrition.protein} color="bg-blue-500" />
                 <MacroBox label="Carbs" val={data.nutrition.carbs} color="bg-amber-500" />
                 <MacroBox label="Fats" val={data.nutrition.fats} color="bg-rose-500" />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sample Fuel Protocol</h4>
                 {data.nutrition.exampleMeals.map((meal, i) => (
                    <div key={i} className="flex items-center gap-4 group p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                       <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&q=80&fit=crop`} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                          />
                       </div>
                       <div className="flex-1">
                          <div className="font-bold text-sm text-slate-800">{meal.name}</div>
                          <div className="flex gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase">
                             <span className="flex items-center gap-1"><Flame size={10} className="text-orange-500" /> {meal.calories} kcal</span>
                             <span>{meal.protein}g Protein</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </section>
        </div>

        {/* Column 3: Training Split (xl:col-span-5) */}
        <div className="xl:col-span-5 space-y-8">
           <section className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Dumbbell size={24} className="text-indigo-600"/> Training Periodization
              </h3>
              <div className="space-y-6">
                 {data.weeklySchedule.map((day, i) => (
                   <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                      <div className="flex justify-between items-center mb-6">
                         <div>
                            <span className="text-xl font-black text-slate-900">{day.day}</span>
                            <div className="text-xs font-bold text-indigo-600 mt-1 uppercase tracking-widest">{day.focus}</div>
                         </div>
                         <Zap size={24} className="text-indigo-200" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {day.exercises.map((ex, j) => (
                            <div key={j} className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                  {j+1}
                               </div>
                               <div>
                                  <div className="text-sm font-bold text-slate-800">{ex.exercise}</div>
                                  <div className="flex gap-4 text-[10px] font-bold text-slate-400 mt-1 uppercase">
                                     <span>{ex.sets} × {ex.reps}</span>
                                     <span className="flex items-center gap-1 text-rose-500"><Clock size={10}/> {ex.rest}</span>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>
           </section>
        </div>

      </div>
    </div>
  );
};

const MacroBox = ({ label, val, color }: { label: string, val: string, color: string }) => (
  <div className="bg-slate-50 p-4 rounded-3xl text-center">
     <div className={`w-1.5 h-1.5 rounded-full mx-auto mb-2 ${color}`}></div>
     <div className="text-sm font-black text-slate-900">{val}</div>
     <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{label}</div>
  </div>
);

export default ResultView;