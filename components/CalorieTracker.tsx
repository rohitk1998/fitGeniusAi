
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Flame, Zap, Utensils, ArrowLeft, Sparkles, Wheat, Bean, Loader2, ChevronLeft, ChevronRight, Calendar, Grid, X, Leaf, Beef, Coffee, Apple, Croissant } from 'lucide-react';
import { Meal, FitnessResponse } from '../types';
import { analyzeFoodContent } from '../services/geminiService';

interface CalorieTrackerProps {
  onBack: () => void;
  plannerData?: FitnessResponse | null;
  onLogActivity?: () => void;
}

type FoodCategory = 'All' | 'Veg' | 'Non-Veg' | 'Fruit' | 'Snack' | 'Drink';

const PRESET_MEALS = [
  // Veg
  { name: 'Oats & Berries', category: 'Veg', calories: 350, protein: 12, carbs: 60, fiber: 8, image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300&q=80' },
  { name: 'Avocado Toast', category: 'Veg', calories: 320, protein: 9, carbs: 35, fiber: 10, image: 'https://images.unsplash.com/photo-1525351463629-4874362cd484?w=300&q=80' },
  { name: 'Greek Yogurt', category: 'Veg', calories: 150, protein: 15, carbs: 8, fiber: 0, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&q=80' },
  { name: 'Rice Bowl', category: 'Veg', calories: 300, protein: 6, carbs: 60, fiber: 2, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300&q=80' },
  { name: 'Quinoa Salad', category: 'Veg', calories: 220, protein: 8, carbs: 30, fiber: 5, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80' },
  { name: 'Paneer Wrap', category: 'Veg', calories: 280, protein: 14, carbs: 25, fiber: 2, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80' },

  // Non-Veg
  { name: 'Chicken Breast', category: 'Non-Veg', calories: 280, protein: 55, carbs: 0, fiber: 0, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&q=80' },
  { name: 'Salmon', category: 'Non-Veg', calories: 450, protein: 40, carbs: 0, fiber: 0, image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=300&q=80' },
  { name: 'Boiled Eggs (2)', category: 'Non-Veg', calories: 140, protein: 12, carbs: 1, fiber: 0, image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&q=80' },
  { name: 'Grilled Steak', category: 'Non-Veg', calories: 500, protein: 45, carbs: 0, fiber: 0, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&q=80' },
  { name: 'Turkey Sandwich', category: 'Non-Veg', calories: 320, protein: 25, carbs: 30, fiber: 4, image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?w=300&q=80' },

  // Fruits
  { name: 'Banana', category: 'Fruit', calories: 105, protein: 1, carbs: 27, fiber: 3, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300&q=80' },
  { name: 'Apple', category: 'Fruit', calories: 95, protein: 0, carbs: 25, fiber: 4, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&q=80' },
  { name: 'Mixed Berries', category: 'Fruit', calories: 60, protein: 1, carbs: 14, fiber: 3, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80' },

  // Snacks
  { name: 'Almonds (30g)', category: 'Snack', calories: 160, protein: 6, carbs: 6, fiber: 3, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&q=80' },
  { name: 'Protein Bar', category: 'Snack', calories: 200, protein: 20, carbs: 15, fiber: 5, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80' },
  { name: 'Dark Chocolate', category: 'Snack', calories: 150, protein: 2, carbs: 10, fiber: 2, image: 'https://images.unsplash.com/photo-1511381971704-58586c757c2c?w=300&q=80' },

  // Drinks
  { name: 'Protein Shake', category: 'Drink', calories: 180, protein: 25, carbs: 5, fiber: 1, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300&q=80' },
  { name: 'Black Coffee', category: 'Drink', calories: 5, protein: 0, carbs: 0, fiber: 0, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80' },
  { name: 'Green Smoothie', category: 'Drink', calories: 120, protein: 2, carbs: 20, fiber: 4, image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300&q=80' },
];

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ onBack, plannerData, onLogActivity }) => {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('fitaura_goals');
    return saved ? JSON.parse(saved) : {
      calories: 2500,
      protein: 150,
      carbs: 300,
      fiber: 30
    };
  });

  // Date State for Carousel
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('fitaura_meals');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('All');
  
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fiber: ''
  });

  useEffect(() => {
    localStorage.setItem('fitaura_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fitaura_meals', JSON.stringify(meals));
  }, [meals]);

  // Sync goals from planner if available
  useEffect(() => {
    if (plannerData) {
        const parseMacro = (str: string) => parseInt(str.replace(/\D/g, '')) || 0;
        setGoals({
            calories: plannerData.nutrition.dailyCalories,
            protein: parseMacro(plannerData.nutrition.protein),
            carbs: parseMacro(plannerData.nutrition.carbs),
            fiber: parseMacro(plannerData.nutrition.fiber)
        });
    }
  }, [plannerData]);

  // Filter Meals by Selected Date
  const dayMeals = useMemo(() => {
    const selStr = selectedDate.toISOString().split('T')[0];
    return meals.filter(m => {
        const mDate = new Date(m.timestamp).toISOString().split('T')[0];
        return mDate === selStr;
    });
  }, [meals, selectedDate]);

  const totals = dayMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fiber: acc.fiber + meal.fiber
  }), { calories: 0, protein: 0, carbs: 0, fiber: 0 });

  const getProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const isToday = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  };

  const formatDateDisplay = (date: Date) => {
      if (isToday(date)) return "TODAY";
      return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  };

  const formatFullDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleAnalyzeFood = async () => {
    if (!newMeal.name) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeFoodContent(newMeal.name);
      setNewMeal({
        name: data.name,
        calories: data.calories.toString(),
        protein: data.protein.toString(),
        carbs: data.carbs.toString(),
        fiber: data.fiber.toString()
      });
    } catch (error) {
      console.error("Failed to analyze food", error);
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
      timestamp: new Date(selectedDate),
    };

    setMeals([meal, ...meals]);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fiber: '' });
    
    if (onLogActivity) {
      onLogActivity();
    }
  };

  const addPresetMeal = (preset: typeof PRESET_MEALS[0]) => {
    const meal: Meal = {
      id: Date.now().toString() + Math.random(),
      name: preset.name,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fats: 0,
      fiber: preset.fiber,
      timestamp: new Date(selectedDate),
    };

    setMeals([meal, ...meals]);
    if (onLogActivity) {
      onLogActivity();
    }
    // Optional: Close modal if open
    // setIsModalOpen(false); 
  };

  // Categories Config
  const CATEGORIES: { id: FoodCategory; icon: React.ReactNode; label: string }[] = [
    { id: 'All', icon: <Grid size={16} />, label: 'All' },
    { id: 'Veg', icon: <Leaf size={16} />, label: 'Veg' },
    { id: 'Non-Veg', icon: <Beef size={16} />, label: 'Non-Veg' },
    { id: 'Fruit', icon: <Apple size={16} />, label: 'Fruits' },
    { id: 'Snack', icon: <Croissant size={16} />, label: 'Snacks' },
    { id: 'Drink', icon: <Coffee size={16} />, label: 'Drinks' },
  ];

  const filteredPresets = PRESET_MEALS.filter(m => activeCategory === 'All' || m.category === activeCategory);

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden relative">
      
      {/* Floating Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-20 p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Main Content Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-12">
            
            {/* Date Carousel Header */}
            <div className="flex flex-col items-center justify-center mb-12 relative">
                <div className="flex items-center gap-8 md:gap-16">
                    <button 
                        onClick={() => changeDate(-1)} 
                        className="p-4 rounded-full hover:bg-gray-50 text-slate-300 hover:text-slate-600 transition-all"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    
                    <div className="text-center animate-in fade-in zoom-in duration-300 key={selectedDate.toString()}">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-2">
                            {formatDateDisplay(selectedDate)}
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl font-medium flex items-center justify-center gap-2">
                            <Calendar size={18} />
                            {formatFullDate(selectedDate)}
                        </p>
                    </div>

                    <button 
                         onClick={() => changeDate(1)} 
                         disabled={isToday(selectedDate)}
                         className="p-4 rounded-full hover:bg-gray-50 text-slate-300 hover:text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                
                {/* Calories Main Card */}
                <div className="md:col-span-2 bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden shadow-xl shadow-slate-200">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Flame size={120} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="w-full">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Energy Balance</div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-6xl font-black tracking-tighter leading-none">{totals.calories}</span>
                                <span className="text-xl text-slate-500 font-medium mb-1">/ {goals.calories}</span>
                            </div>
                            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000 ease-out" 
                                    style={{ width: `${getProgress(totals.calories, goals.calories)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Protein Card */}
                <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Protein</span>
                        <Zap className="text-blue-500" size={20} />
                    </div>
                    <div className="flex items-end gap-1 mb-3">
                        <span className="text-4xl font-black text-slate-900">{totals.protein}</span>
                        <span className="text-sm text-slate-400 font-bold mb-1">/ {goals.protein}g</span>
                    </div>
                    <div className="w-full h-2 bg-blue-200/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${getProgress(totals.protein, goals.protein)}%` }}></div>
                    </div>
                </div>

                {/* Carbs & Fiber Combined */}
                <div className="bg-gray-50 border border-gray-200 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between gap-6">
                    {/* Carbs */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-500 text-xs font-bold uppercase flex items-center gap-1"><Wheat size={12}/> Carbs</span>
                            <span className="text-slate-900 text-sm font-bold">{totals.carbs} <span className="text-slate-400 font-normal">/ {goals.carbs}g</span></span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${getProgress(totals.carbs, goals.carbs)}%` }}></div>
                        </div>
                    </div>

                    {/* Fiber */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-500 text-xs font-bold uppercase flex items-center gap-1"><Bean size={12}/> Fiber</span>
                            <span className="text-slate-900 text-sm font-bold">{totals.fiber} <span className="text-slate-400 font-normal">/ {goals.fiber}g</span></span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${getProgress(totals.fiber, goals.fiber)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Add Stories Carousel */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">Quick Add</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tap to Log</span>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
                    >
                      See All
                    </button>
                </div>
                <div className="overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                    <div className="flex gap-4 min-w-max">
                        {PRESET_MEALS.slice(0, 10).map((item, idx) => (
                            <button 
                                key={idx}
                                onClick={() => addPresetMeal(item)}
                                className="flex flex-col items-center gap-2 group transition-all"
                            >
                                <div className="relative w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-600 group-hover:scale-110 transition-transform cursor-pointer shadow-sm">
                                    <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden relative bg-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 bg-slate-900 text-white rounded-full p-1.5 border-2 border-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                         <Plus size={10} strokeWidth={4} />
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-slate-600 max-w-[80px] truncate text-center group-hover:text-slate-900">{item.name}</span>
                            </button>
                        ))}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex flex-col items-center gap-2 group justify-center"
                        >
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all">
                                <Grid size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400">More</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Smart Add & Log Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Smart Add Form */}
                <div className="lg:col-span-1 bg-white border border-gray-200 rounded-[2rem] p-6 shadow-lg shadow-indigo-50/50">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Sparkles size={18} className="text-indigo-500"/>
                        Custom Entry
                    </h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Type a meal description to auto-calculate using AI, <span className="font-bold text-slate-700">OR</span> enter values manually below.
                    </p>
                    <form onSubmit={addMeal} className="space-y-4">
                        <div className="relative">
                            <div className="flex gap-2">
                                <input
                                    value={newMeal.name}
                                    onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                                    placeholder="e.g. 2 Eggs & Toast"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                />
                                <button 
                                    type="button"
                                    onClick={handleAnalyzeFood}
                                    disabled={isAnalyzing || !newMeal.name}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow-lg shadow-indigo-200"
                                    title="Auto-Analyze with AI"
                                >
                                    {isAnalyzing ? <Loader2 size={20} className="animate-spin"/> : <Sparkles size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                             <input type="number" placeholder="Kcal" value={newMeal.calories} onChange={e => setNewMeal({...newMeal, calories: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-all"/>
                             <input type="number" placeholder="Pro (g)" value={newMeal.protein} onChange={e => setNewMeal({...newMeal, protein: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-all"/>
                             <input type="number" placeholder="Carb (g)" value={newMeal.carbs} onChange={e => setNewMeal({...newMeal, carbs: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-all"/>
                             <input type="number" placeholder="Fib (g)" value={newMeal.fiber} onChange={e => setNewMeal({...newMeal, fiber: e.target.value})} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-all"/>
                        </div>

                        <button 
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Plus size={16} /> Log Meal
                        </button>
                    </form>
                </div>

                {/* Consumption Log */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="text-lg font-bold text-slate-900">Consumption Log</h3>
                        <div className="text-xs font-bold text-slate-400 uppercase">{dayMeals.length} Entries</div>
                    </div>
                    
                    {dayMeals.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                            <Utensils size={32} className="mx-auto mb-3 text-slate-300"/>
                            <p className="text-slate-400 font-medium">No meals logged for {isToday(selectedDate) ? 'today' : 'this day'}</p>
                        </div>
                    ) : (
                        dayMeals.map((meal) => (
                            <div key={meal.id} className="group flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 hover:shadow-md transition-all animate-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <div className="font-bold text-slate-800 text-base mb-1">{meal.name}</div>
                                    <div className="flex gap-4 text-xs font-bold text-slate-500">
                                        <span className="flex items-center gap-1 text-orange-500"><Flame size={12}/> {meal.calories}</span>
                                        <span className="flex items-center gap-1 text-blue-600"><Zap size={12}/> {meal.protein}g</span>
                                        <span className="flex items-center gap-1 text-yellow-600"><Wheat size={12}/> {meal.carbs}g</span>
                                        <span className="flex items-center gap-1 text-emerald-600"><Bean size={12}/> {meal.fiber}g</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setMeals(meals.filter(m => m.id !== meal.id))}
                                    className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* FOOD GALLERY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-4xl h-[85vh] md:h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
              
              {/* Modal Header */}
              <div className="flex-none p-6 border-b border-gray-100 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-bold text-slate-900">Food Library</h3>
                    <p className="text-sm text-slate-500">Select items to add to your daily log.</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={24} className="text-slate-600"/>
                 </button>
              </div>

              {/* Categories Tabs */}
              <div className="flex-none px-6 py-4 border-b border-gray-100 overflow-x-auto no-scrollbar">
                 <div className="flex gap-2">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                           activeCategory === cat.id 
                           ? 'bg-slate-900 text-white shadow-lg' 
                           : 'bg-gray-50 text-slate-500 hover:bg-gray-100'
                        }`}
                      >
                         {cat.icon} {cat.label}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Grid Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 custom-scrollbar">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPresets.map((item, idx) => (
                       <button 
                         key={idx}
                         onClick={() => { addPresetMeal(item); }}
                         className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group flex flex-col gap-3 relative overflow-hidden"
                       >
                          <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             {/* Badge */}
                             <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/90 backdrop-blur text-slate-800">
                                {item.category}
                             </div>
                             {/* Add Overlay */}
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white rounded-full p-2 text-indigo-600">
                                   <Plus size={24} strokeWidth={3} />
                                </div>
                             </div>
                          </div>
                          <div>
                             <div className="font-bold text-slate-900 text-sm mb-1">{item.name}</div>
                             <div className="text-xs text-slate-500 flex items-center gap-2">
                                <span className="flex items-center gap-0.5 text-orange-500"><Flame size={10}/> {item.calories}</span>
                                <span className="flex items-center gap-0.5 text-blue-500"><Zap size={10}/> {item.protein}g</span>
                             </div>
                          </div>
                       </button>
                    ))}
                 </div>
                 {filteredPresets.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                       <Utensils size={48} className="mb-4" />
                       <p>No items found in this category.</p>
                    </div>
                 )}
              </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default CalorieTracker;
