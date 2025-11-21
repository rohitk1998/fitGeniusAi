
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Flame, Zap, Utensils, ArrowLeft, Sparkles, Wheat, Bean, Loader2, Edit2, Check } from 'lucide-react';
import { Meal, FitnessResponse } from '../types';
import { analyzeFoodContent } from '../services/geminiService';

interface CalorieTrackerProps {
  onBack: () => void;
  plannerData?: FitnessResponse | null;
  onLogActivity?: () => void;
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ onBack, plannerData, onLogActivity }) => {
  // Load initial state from local storage for Goals
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fitaura_goals');
    return saved ? JSON.parse(saved) : {
      calories: 2500,
      protein: 150,
      carbs: 300,
      fiber: 30
    };
  });

  // UI State for Editing Goals
  const [isEditingGoals, setIsEditingGoals] = useState(false);

  // Load initial state from local storage for Meals
  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('fitaura_meals');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Input State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fiber: ''
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('fitaura_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fitaura_meals', JSON.stringify(meals));
  }, [meals]);

  // Helpers
  const parseMacro = (str: string) => parseInt(str.replace(/\D/g, '')) || 0;

  const syncGoals = () => {
    if (!plannerData) return;
    setGoals({
      calories: plannerData.nutrition.dailyCalories,
      protein: parseMacro(plannerData.nutrition.protein),
      carbs: parseMacro(plannerData.nutrition.carbs),
      fiber: parseMacro(plannerData.nutrition.fiber)
    });
  };

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fiber: acc.fiber + meal.fiber
  }), { calories: 0, protein: 0, carbs: 0, fiber: 0 });

  const getProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const handleAnalyzeFood = async () => {
    if (!newMeal.name) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeFoodContent(newMeal.name);
      setNewMeal({
        name: data.name, // Use the clean name returned by AI
        calories: data.calories.toString(),
        protein: data.protein.toString(),
        carbs: data.carbs.toString(),
        fiber: data.fiber.toString()
      });
    } catch (error) {
      console.error("Failed to analyze food", error);
      // Optional: Add toast notification here
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addMeal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMeal.name || !newMeal.calories) return;

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name,
      calories: Number(newMeal.calories),
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fats: 0, 
      fiber: Number(newMeal.fiber) || 0,
      timestamp: new Date(),
    };

    setMeals([meal, ...meals]);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fiber: '' });
    
    if (onLogActivity) {
      onLogActivity();
    }
  };

  return (
    <div className="h-full w-full bg-[#0f172a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Tracker Command</h2>
            <p className="text-xs text-slate-400">Macro Analytics & Logging</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditingGoals(!isEditingGoals)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isEditingGoals ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}
        >
          {isEditingGoals ? <Check size={14} /> : <Edit2 size={14} />}
          {isEditingGoals ? 'Done Editing' : 'Edit Goals'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Calories Main Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Daily Energy</p>
                    {plannerData && isEditingGoals && (
                      <button onClick={syncGoals} className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-1">
                        <Sparkles size={10} /> Sync AI
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-baseline gap-1 mt-1">
                    <h3 className="text-3xl font-bold text-white">{totals.calories}</h3>
                    <span className="text-lg text-slate-500 font-medium">/</span>
                    {isEditingGoals ? (
                      <input 
                        type="number" 
                        value={goals.calories}
                        onChange={(e) => setGoals({...goals, calories: Number(e.target.value)})}
                        className="w-24 bg-slate-900/50 border border-slate-600 rounded px-2 py-0 text-lg text-white font-medium focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <span className="text-lg text-slate-500 font-medium">{goals.calories}</span>
                    )}
                  </div>
                </div>
                <Flame className="text-orange-500" size={24} />
              </div>
              
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden mb-2 relative z-10">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500" style={{ width: `${getProgress(totals.calories, goals.calories)}%` }}></div>
              </div>
              <p className="text-right text-xs text-slate-400 relative z-10">{Math.max(0, goals.calories - totals.calories)} kcal remaining</p>
            </div>

            {/* Protein Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 backdrop-blur-sm">
               <div className="flex justify-between mb-2">
                 <span className="text-slate-400 text-xs font-bold uppercase">Protein</span>
                 <Zap className="text-blue-400" size={18} />
               </div>
               <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-white">{totals.protein}g</span>
                  <span className="text-sm text-slate-500">/</span>
                  {isEditingGoals ? (
                      <input 
                        type="number" 
                        value={goals.protein}
                        onChange={(e) => setGoals({...goals, protein: Number(e.target.value)})}
                        className="w-16 bg-slate-900/50 border border-slate-600 rounded px-1 py-0 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <span className="text-sm text-slate-500">{goals.protein}g</span>
                    )}
               </div>
               <div className="w-full bg-slate-700 rounded-full h-1.5">
                 <div className="bg-blue-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${getProgress(totals.protein, goals.protein)}%` }}></div>
               </div>
            </div>

            {/* Carbs & Fiber Split */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 backdrop-blur-sm flex flex-col justify-between gap-4">
               {/* Carbs */}
               <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1"><Wheat size={12}/> Carbs</span>
                    <div className="flex items-baseline gap-1 text-sm">
                      <span className="text-white font-bold">{totals.carbs}</span>
                      <span className="text-slate-500">/</span>
                      {isEditingGoals ? (
                        <input 
                          type="number" 
                          value={goals.carbs}
                          onChange={(e) => setGoals({...goals, carbs: Number(e.target.value)})}
                          className="w-12 bg-slate-900/50 border border-slate-600 rounded px-1 py-0 text-xs text-white focus:outline-none focus:border-yellow-500"
                        />
                      ) : (
                        <span className="text-slate-500">{goals.carbs}g</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${getProgress(totals.carbs, goals.carbs)}%` }}></div>
                  </div>
               </div>

               {/* Fiber */}
               <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400 text-xs font-bold uppercase flex items-center gap-1"><Bean size={12}/> Fiber</span>
                    <div className="flex items-baseline gap-1 text-sm">
                      <span className="text-white font-bold">{totals.fiber}</span>
                      <span className="text-slate-500">/</span>
                      {isEditingGoals ? (
                        <input 
                          type="number" 
                          value={goals.fiber}
                          onChange={(e) => setGoals({...goals, fiber: Number(e.target.value)})}
                          className="w-12 bg-slate-900/50 border border-slate-600 rounded px-1 py-0 text-xs text-white focus:outline-none focus:border-green-500"
                        />
                      ) : (
                        <span className="text-slate-500">{goals.fiber}g</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-green-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${getProgress(totals.fiber, goals.fiber)}%` }}></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Content Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Input Form */}
            <div className="lg:col-span-1 bg-slate-800/30 border border-slate-700 rounded-3xl p-6 h-fit">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                 <Sparkles size={18} className="text-indigo-400"/>
                 Smart Add
               </h3>

              <form onSubmit={addMeal} className="space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Food Description</label>
                    <div className="flex gap-2">
                      <input
                        value={newMeal.name}
                        onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                        placeholder="e.g. 200g Chicken Breast"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button 
                        type="button"
                        onClick={handleAnalyzeFood}
                        disabled={isAnalyzing || !newMeal.name}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                        title="Auto-calculate calories with AI"
                      >
                         {isAnalyzing ? <Loader2 size={20} className="animate-spin"/> : <Sparkles size={20} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Tip: Type the food & click the sparkle icon to auto-fill macros.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Calories</label>
                       <input
                        type="number"
                        value={newMeal.calories}
                        onChange={e => setNewMeal({...newMeal, calories: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Protein (g)</label>
                       <input
                        type="number"
                        value={newMeal.protein}
                        onChange={e => setNewMeal({...newMeal, protein: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Carbs (g)</label>
                       <input
                        type="number"
                        value={newMeal.carbs}
                        onChange={e => setNewMeal({...newMeal, carbs: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fiber (g)</label>
                       <input
                        type="number"
                        value={newMeal.fiber}
                        onChange={e => setNewMeal({...newMeal, fiber: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       />
                     </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700 text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add to Log
                  </button>
                </form>
            </div>

            {/* Right Col: Log */}
            <div className="lg:col-span-2 bg-slate-800/30 border border-slate-700 rounded-3xl p-6 min-h-[400px]">
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                 <Utensils size={18} className="text-indigo-400"/>
                 Consumption Log
               </h3>
               
               <div className="space-y-2">
                 {meals.length === 0 && (
                    <div className="text-center py-20 opacity-30">
                       <Utensils size={48} className="mx-auto mb-4"/>
                       <p>No meals logged today</p>
                    </div>
                 )}
                 {meals.map((meal) => (
                   <div key={meal.id} className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-all">
                      <div>
                         <div className="font-bold text-white text-sm">{meal.name}</div>
                         <div className="flex gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><Flame size={10}/> {meal.calories}</span>
                            <span className="flex items-center gap-1 text-blue-400/80"><Zap size={10}/> {meal.protein}g</span>
                            <span className="flex items-center gap-1 text-yellow-400/80"><Wheat size={10}/> {meal.carbs}g</span>
                            <span className="flex items-center gap-1 text-green-400/80"><Bean size={10}/> {meal.fiber}g</span>
                         </div>
                      </div>
                      <button 
                        onClick={() => setMeals(meals.filter(m => m.id !== meal.id))}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
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

export default CalorieTracker;
