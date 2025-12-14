
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

// --- ASSET LIBRARY ---
// A curated list of high-speed, reliable Unsplash images to prevent loading failures
const ASSET_LIBRARY: Record<string, string> = {
  // Foods
  'oat': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&q=80',
  'porridge': 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=600&q=80',
  'egg': 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
  'chicken': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80',
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=600&q=80',
  'fish': 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=600&q=80',
  'steak': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80',
  'beef': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80',
  'smoothie': 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80',
  'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
  'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
  'rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80',
  'avocado': 'https://images.unsplash.com/photo-1523049673856-6bbc818d7650?w=600&q=80',
  'toast': 'https://images.unsplash.com/photo-1525351463629-4874362cd484?w=600&q=80',
  'fruit': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
  
  // Exercises / Body Parts
  'chest': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  'bench': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  'press': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  'pushup': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  
  'back': 'https://images.unsplash.com/photo-1603287681836-e174ce71808e?w=400&q=80',
  'pull': 'https://images.unsplash.com/photo-1603287681836-e174ce71808e?w=400&q=80',
  'row': 'https://images.unsplash.com/photo-1603287681836-e174ce71808e?w=400&q=80',
  
  'leg': 'https://images.unsplash.com/photo-1434608519344-49d77a699ded?w=400&q=80',
  'squat': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&q=80',
  'deadlift': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
  
  'arm': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
  'curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
  'tricep': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80',
  
  'cardio': 'https://images.unsplash.com/photo-1538805060512-e2496537c021?w=400&q=80',
  'run': 'https://images.unsplash.com/photo-1538805060512-e2496537c021?w=400&q=80',
  'hiit': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&q=80',
  'yoga': 'https://images.unsplash.com/photo-1544367563-12123d8966cd?w=400&q=80',
  'stretch': 'https://images.unsplash.com/photo-1544367563-12123d8966cd?w=400&q=80',
};

const ResultView: React.FC<ResultViewProps> = ({ data, onReset, onBack }) => {
  
  // Permanent Fix for Image Loading:
  // Instead of generating images via AI (slow, unreliable), we map keywords to stable Unsplash assets.
  const getStableImage = (keyword: string, type: 'food' | 'gym') => {
    if (!keyword) return type === 'food' 
      ? 'https://images.unsplash.com/photo-1543353071-087f9da376e8?w=600&q=80' 
      : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80';

    const lowerKey = keyword.toLowerCase();
    
    // Check asset library for matches
    for (const key of Object.keys(ASSET_LIBRARY)) {
      if (lowerKey.includes(key)) {
        return ASSET_LIBRARY[key];
      }
    }
    
    // Fallbacks if no keyword match
    if (type === 'food') return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80'; // Healthy generic food
    return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80'; // Generic gym
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      
      {/* Top Action Bar */}
      <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
              Protocol Generated
            </h2>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-700 px-4 py-2 rounded-lg border border-gray-200 shadow-sm transition-all text-sm font-medium"
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
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">
              <Target size={14} />
              <span>Blueprint</span>
            </div>
            
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-y-auto custom-scrollbar flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Executive Summary
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {data.summary}
                </p>
              </div>
              
              <div className="mt-auto p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-400 uppercase mb-3 flex items-center gap-1">
                   <Award size={12}/> Core Focus
                </h4>
                <div className="space-y-3">
                   <div className="flex items-start gap-3 text-sm text-slate-700">
                     <CheckCircle2 size={16} className="text-indigo-600 mt-0.5" />
                     <span>Progressive Overload</span>
                   </div>
                   <div className="flex items-start gap-3 text-sm text-slate-700">
                     <CheckCircle2 size={16} className="text-indigo-600 mt-0.5" />
                     <span>Metabolic Adaptation</span>
                   </div>
                   <div className="flex items-start gap-3 text-sm text-slate-700">
                     <CheckCircle2 size={16} className="text-indigo-600 mt-0.5" />
                     <span>Recovery Optimization</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Fuel (Nutrition) - UPDATED WITH IMAGES */}
          <div className="w-[380px] flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">
              <Utensils size={14} />
              <span>Fuel Strategy</span>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-0 shadow-sm overflow-y-auto custom-scrollbar flex flex-col">
              {/* Macro Header */}
              <div className="p-6 bg-emerald-600 rounded-t-2xl relative overflow-hidden">
                <div className="relative z-10">
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-emerald-100 text-xs font-bold uppercase">Daily Target</span>
                   </div>
                   <div className="text-5xl font-bold text-white mb-1 tracking-tight">
                     {data.nutrition.dailyCalories}
                   </div>
                   <div className="text-sm text-emerald-100/80 font-medium">Calories per day</div>
                </div>
                <Flame className="absolute -right-4 -bottom-4 text-emerald-500/50" size={120} />
              </div>

              {/* Macro Grid */}
              <div className="grid grid-cols-4 gap-px bg-gray-100 border-b border-gray-100">
                <div className="bg-white p-2 py-4 text-center">
                  <div className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Protein</div>
                  <div className="text-sm font-bold text-slate-900">{data.nutrition.protein}</div>
                </div>
                <div className="bg-white p-2 py-4 text-center">
                  <div className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Carbs</div>
                  <div className="text-sm font-bold text-slate-900">{data.nutrition.carbs}</div>
                </div>
                <div className="bg-white p-2 py-4 text-center">
                  <div className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Fats</div>
                  <div className="text-sm font-bold text-slate-900">{data.nutrition.fats}</div>
                </div>
                <div className="bg-white p-2 py-4 text-center">
                  <div className="text-[10px] text-slate-400 uppercase mb-1 font-bold">Fiber</div>
                  <div className="text-sm font-bold text-slate-900">{data.nutrition.fiber}</div>
                </div>
              </div>

              {/* Example Meals List with Images */}
              <div className="p-6">
                 <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                  Recommended Meals
                </h4>
                <div className="space-y-4">
                  {data.nutrition.exampleMeals?.map((meal, idx) => (
                    <div key={idx} className="group overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                       <div className="h-32 w-full overflow-hidden bg-gray-100 relative">
                          <img 
                            src={getStableImage(meal.imageKeyword || meal.name, 'food')} 
                            alt={meal.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-2 left-3 text-white font-bold text-sm shadow-black drop-shadow-md">
                             {meal.name}
                          </div>
                       </div>
                       <div className="p-3 grid grid-cols-3 gap-2 text-center">
                          <div>
                             <div className="text-[10px] text-slate-400 uppercase">Cal</div>
                             <div className="font-bold text-slate-800 text-xs">{meal.calories}</div>
                          </div>
                          <div>
                             <div className="text-[10px] text-slate-400 uppercase">Pro</div>
                             <div className="font-bold text-slate-800 text-xs">{meal.protein}g</div>
                          </div>
                          <div>
                             <div className="text-[10px] text-slate-400 uppercase">Carb</div>
                             <div className="font-bold text-slate-800 text-xs">{meal.carbs}g</div>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Action (Workout) - UPDATED WITH IMAGES */}
          <div className="w-[420px] flex flex-col gap-4 h-full">
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">
              <Calendar size={14} />
              <span>Action Plan</span>
              <span className="ml-auto bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] border border-indigo-100">{data.weeklySchedule.length} Sessions</span>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-2 shadow-sm overflow-y-auto custom-scrollbar space-y-3">
              {data.weeklySchedule.map((dayPlan, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-all shadow-sm group">
                   <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                      <div>
                        <h4 className="font-bold text-slate-800">{dayPlan.day}</h4>
                        <div className="text-xs text-slate-500 mt-1">{dayPlan.exercises.length} Exercises</div>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                        {dayPlan.focus}
                      </span>
                   </div>
                   <div className="space-y-3">
                     {dayPlan.exercises.map((ex, i) => (
                       <div key={i} className="flex gap-3 items-center">
                          {/* Exercise Thumbnail */}
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                             <img 
                               src={getStableImage(ex.exercise, 'gym')} 
                               alt={ex.exercise}
                               className="w-full h-full object-cover"
                               loading="lazy"
                             />
                          </div>
                          
                          <div className="flex-1">
                             <div className="text-sm font-bold text-slate-700 leading-tight">{ex.exercise}</div>
                             <div className="flex gap-3 text-xs text-slate-500 mt-1 font-medium">
                                <span className="flex items-center gap-1"><Dumbbell size={10}/> {ex.sets}x{ex.reps}</span>
                                <span className="flex items-center gap-1 text-orange-500"><Clock size={10}/> {ex.rest || '60s'}</span>
                             </div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Forecast (Milestones) - UPDATED JOURNEY MAP */}
          <div className="w-[320px] flex flex-col gap-4 h-full">
             <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">
              <TrendingUp size={14} />
              <span>Forecast</span>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-y-auto custom-scrollbar relative">
               {/* Timeline Line */}
               <div className="absolute left-[34px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-200 to-gray-200"></div>

               <div className="space-y-10 relative">
                  {data.milestones.map((ms, idx) => (
                    <div key={idx} className="relative pl-10 group">
                       {/* Node */}
                       <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white border-4 border-indigo-500 shadow-md z-10 group-hover:scale-110 transition-transform"></div>
                       
                       <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-xs font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">Month {ms.month}</span>
                          </div>
                          
                          <div className="text-slate-900 font-bold mb-2 text-lg">{ms.expectedResult}</div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-3">{ms.description}</p>
                          
                          <div className="space-y-2 pt-3 border-t border-gray-100">
                             {ms.habitToMaster && (
                               <div className="flex items-center gap-2">
                                  <CheckCircle2 size={12} className="text-emerald-500"/>
                                  <span className="text-xs font-bold text-slate-700">Habit: {ms.habitToMaster}</span>
                               </div>
                             )}
                             {ms.motivationalQuote && (
                               <div className="bg-gray-50 p-2 rounded-lg text-[10px] text-slate-500 italic">
                                  "{ms.motivationalQuote}"
                               </div>
                             )}
                          </div>
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
