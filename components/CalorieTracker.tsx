import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Flame, Zap, Utensils, ArrowLeft, Sparkles, Wheat, Bean, Loader2, ChevronLeft, ChevronRight, X, Grid, Search } from 'lucide-react';
import { Meal, FitnessResponse } from '../types';
import { analyzeFoodContent } from '../services/geminiService';

interface CalorieTrackerProps {
  onBack: () => void;
  plannerData?: FitnessResponse | null;
  onLogActivity?: () => void;
}

const PRESET_MEALS = [
  { name: 'Oats & Berries', category: 'Veg', calories: 350, protein: 12, carbs: 60, fiber: 8, image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300' },
  { name: 'Chicken Breast', category: 'Non-Veg', calories: 280, protein: 55, carbs: 0, fiber: 0, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300' },
  { name: 'Avocado Toast', category: 'Veg', calories: 320, protein: 9, carbs: 35, fiber: 10, image: 'https://images.unsplash.com/photo-1525351463629-4874362cd484?w=300' },
  { name: 'Protein Shake', category: 'Drink', calories: 180, protein: 25, carbs: 5, fiber: 1, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300' },
  { name: 'Salmon & Rice', category: 'Non-Veg', calories: 550, protein: 45, carbs: 40, fiber: 2, image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=300' },
];

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ onBack, plannerData, onLogActivity }) => {
  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('fitaura_meals');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState('');

  const goals = useMemo(() => {
    if (plannerData) {
      const parseMacro = (str: string) => parseInt(str.replace(/\D/g, '')) || 0;
      return {
        calories: plannerData.nutrition.dailyCalories,
        protein: parseMacro(plannerData.nutrition.protein),
        carbs: parseMacro(plannerData.nutrition.carbs),
      };
    }
    return { calories: 2500, protein: 150, carbs: 300 };
  }, [plannerData]);

  const dayMeals = useMemo(() => {
    const selStr = selectedDate.toISOString().split('T')[0];
    return meals.filter(m => new Date(m.timestamp).toISOString().split('T')[0] === selStr);
  }, [meals, selectedDate]);

  const totals = dayMeals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs
  }), { calories: 0, protein: 0, carbs: 0 });

  const handleSmartAdd = async () => {
    if (!query) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodContent(query);
      const meal: Meal = { ...result, id: Date.now().toString(), timestamp: new Date(selectedDate) };
      setMeals([meal, ...meals]);
      setQuery('');
      if (onLogActivity) onLogActivity();
    } catch (e) { alert("Analysis failed"); }
    finally { setIsAnalyzing(false); }
  };

  const addPreset = (item: typeof PRESET_MEALS[0]) => {
    const meal: Meal = { ...item, fats: 0, id: Math.random().toString(), timestamp: new Date(selectedDate) };
    setMeals([meal, ...meals]);
    if (onLogActivity) onLogActivity();
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
      {/* Native-style Date Switcher */}
      <div className="p-6 flex items-center justify-between border-b border-slate-50 sticky top-0 bg-white/95 backdrop-blur-md z-30">
        <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate()-1)))} className="p-2 text-slate-400"><ChevronLeft size={24}/></button>
        <div className="text-center">
           <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">
             {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
           </h2>
        </div>
        <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate()+1)))} className="p-2 text-slate-400"><ChevronRight size={24}/></button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-8 pt-6 no-scrollbar">
        
        {/* Ring Summary */}
        <div className="flex items-center justify-center py-4">
           <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                 <circle cx="112" cy="112" r="95" fill="none" stroke="#f1f5f9" strokeWidth="20" />
                 <circle 
                    cx="112" cy="112" r="95" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="20" 
                    strokeDasharray={597}
                    strokeDashoffset={597 - (597 * Math.min(totals.calories/goals.calories, 1))}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                 />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className="text-5xl font-black text-slate-900 leading-none">{goals.calories - totals.calories}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Remaining</span>
              </div>
           </div>
        </div>

        {/* AI Input Search Bar */}
        <div className="relative">
           <input 
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="What did you eat?"
             className="w-full bg-slate-100 border-none rounded-3xl py-4 pl-14 pr-16 font-bold text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
             onKeyPress={(e) => e.key === 'Enter' && handleSmartAdd()}
           />
           <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
           <button 
             onClick={handleSmartAdd}
             disabled={isAnalyzing || !query}
             className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg shadow-indigo-100 disabled:opacity-50"
           >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>}
           </button>
        </div>

        {/* Story Reel Presets */}
        <section>
           <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4 px-1">Quick Add</h3>
           <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
              {PRESET_MEALS.map((m, i) => (
                <button key={i} onClick={() => addPreset(m)} className="flex flex-col items-center gap-2 group">
                   <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md transform active:scale-95 transition-transform">
                      <img src={m.image} className="w-full h-full rounded-full object-cover border-2 border-white" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-500 truncate w-16">{m.name}</span>
                </button>
              ))}
           </div>
        </section>

        {/* List Feed */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Today's Log</h3>
              <Grid size={16} className="text-slate-300" />
           </div>
           {dayMeals.length === 0 ? (
             <div className="py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest">Empty Plate</div>
           ) : (
             dayMeals.map((meal) => (
               <div key={meal.id} className="bg-white border border-slate-100 p-5 rounded-[2rem] flex items-center justify-between group">
                  <div>
                    <div className="font-black text-slate-800 text-sm">{meal.name}</div>
                    <div className="flex gap-3 text-[10px] font-bold text-slate-400 mt-1 uppercase">
                       <span className="text-orange-500">{meal.calories} kcal</span>
                       <span>{meal.protein}g protein</span>
                    </div>
                  </div>
                  <button onClick={() => setMeals(meals.filter(m => m.id !== meal.id))} className="p-2 text-slate-200 hover:text-rose-500 transition-colors">
                     <Trash2 size={18} />
                  </button>
               </div>
             ))
           )}
        </section>

      </div>
    </div>
  );
};

export default CalorieTracker;