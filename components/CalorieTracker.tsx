import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Flame, Utensils, ArrowLeft, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Meal, FitnessResponse } from '../types';
import { analyzeFoodContent } from '../services/geminiService';

interface CalorieTrackerProps {
  onBack: () => void;
  plannerData?: FitnessResponse | null;
  onLogActivity?: () => void;
}

type PresetItem = {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  image: string;
};

const PRESET_MEALS: PresetItem[] = [
  { name: 'Oats & Berries', category: 'Veg', calories: 350, protein: 12, carbs: 60, fats: 6, fiber: 8, image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300' },
  { name: 'Chicken Breast', category: 'Non-Veg', calories: 280, protein: 55, carbs: 0, fats: 6, fiber: 0, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300' },
  { name: 'Avocado Toast', category: 'Veg', calories: 320, protein: 9, carbs: 35, fats: 18, fiber: 10, image: 'https://images.unsplash.com/photo-1525351463629-4874362cd484?w=300' },
  { name: 'Protein Shake', category: 'Drink', calories: 180, protein: 25, carbs: 5, fats: 2, fiber: 1, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300' },
  { name: 'Salmon & Rice', category: 'Non-Veg', calories: 550, protein: 45, carbs: 40, fats: 22, fiber: 2, image: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=300' },
];

const toDateStr = (d: Date) => d.toISOString().split('T')[0];

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ onBack, plannerData, onLogActivity }) => {
  const [meals, setMeals] = useState<Meal[]>(() => {
    try {
      const saved = localStorage.getItem('fitaura_meals');
      if (!saved) return [];
      const parsed = JSON.parse(saved) as Meal[];
      return parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
    } catch {
      return [];
    }
  });

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    localStorage.setItem('fitaura_meals', JSON.stringify(meals));
  }, [meals]);

  const goals = useMemo(() => {
    if (plannerData) {
      const parseMacro = (str: string) => parseInt(str.replace(/\D/g, '')) || 0;
      return {
        calories: plannerData.nutrition.dailyCalories,
        protein: parseMacro(plannerData.nutrition.protein),
        carbs: parseMacro(plannerData.nutrition.carbs),
        fats: parseMacro(plannerData.nutrition.fats) || 65,
      };
    }
    return { calories: 2500, protein: 150, carbs: 300, fats: 65 };
  }, [plannerData]);

  const dayMeals = useMemo(() => {
    const selStr = toDateStr(selectedDate);
    return meals.filter(m => toDateStr(new Date(m.timestamp)) === selStr);
  }, [meals, selectedDate]);

  const totals = useMemo(() => dayMeals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fats: acc.fats + m.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 }), [dayMeals]);

  // Streak: days in last 14 that have at least one meal
  const weekDates = useMemo(() => {
    const out: Date[] = [];
    const d = new Date();
    for (let i = 13; i >= 0; i--) {
      const x = new Date(d);
      x.setDate(x.getDate() - i);
      out.push(x);
    }
    return out;
  }, []);

  const dateHasLog = (d: Date) => {
    const str = toDateStr(d);
    return meals.some(m => toDateStr(new Date(m.timestamp)) === str);
  };

  const goPrevDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 1);
    setSelectedDate(next);
  };

  const goNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleSmartAdd = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodContent(query.trim());
      const meal: Meal = {
        ...result,
        id: Date.now().toString(),
        timestamp: new Date(selectedDate),
      };
      setMeals(prev => [meal, ...prev]);
      setQuery('');
      setShowCustomInput(false);
      onLogActivity?.();
    } catch {
      alert('Analysis failed. Try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addPreset = (item: PresetItem) => {
    const meal: Meal = {
      id: crypto.randomUUID?.() ?? Math.random().toString(),
      name: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fats: item.fats,
      fiber: item.fiber,
      timestamp: new Date(selectedDate),
    };
    setMeals(prev => [meal, ...prev]);
    onLogActivity?.();
  };

  const removeMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const pct = (current: number, goal: number) => Math.min(100, goal ? (current / goal) * 100 : 0);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex-none bg-white border-b border-slate-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Nutrition Lab</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        {/* Macro summary – all values on top */}
        <div className="p-4 sm:p-6 bg-white border-b border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <MacroCard
              label="Calories"
              current={totals.calories}
              goal={goals.calories}
              unit="kcal"
              icon={<Flame size={18} className="text-amber-500" />}
            />
            <MacroCard
              label="Protein"
              current={totals.protein}
              goal={goals.protein}
              unit="g"
              icon={<Utensils size={18} className="text-blue-500" />}
            />
            <MacroCard
              label="Carbs"
              current={totals.carbs}
              goal={goals.carbs}
              unit="g"
              icon={<span className="text-amber-600 font-bold text-sm">C</span>}
            />
            <MacroCard
              label="Fats"
              current={totals.fats}
              goal={goals.fats}
              unit="g"
              icon={<span className="text-rose-500 font-bold text-sm">F</span>}
            />
          </div>
        </div>

        {/* Date strip + selected day */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-white border-b border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-4">
            <button onClick={goPrevDay} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50" aria-label="Previous day">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <button onClick={goNextDay} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50" aria-label="Next day">
              <ChevronRight size={20} />
            </button>
          </div>
          {/* Streak-style week view */}
          <div className="flex gap-1.5 justify-between">
            {weekDates.map((d) => {
              const isSelected = toDateStr(d) === toDateStr(selectedDate);
              const hasLog = dateHasLog(d);
              return (
                <button
                  key={d.getTime()}
                  onClick={() => setSelectedDate(new Date(d))}
                  className={`
                    flex-1 min-w-0 aspect-square rounded-xl text-[10px] font-bold transition-all
                    ${isSelected ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2' : 'bg-slate-100 text-slate-500'}
                    ${hasLog && !isSelected ? 'bg-indigo-100 text-indigo-700' : ''}
                  `}
                  title={d.toLocaleDateString()}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add section: predefined + custom */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Quick add</h3>
          <div className="flex flex-wrap gap-2">
            {PRESET_MEALS.map((m, i) => (
              <button
                key={i}
                onClick={() => addPreset(m)}
                className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all shadow-sm"
              >
                <span className="truncate max-w-[100px] sm:max-w-[120px]">{m.name}</span>
                <span className="text-[10px] text-slate-400">{m.calories} kcal</span>
              </button>
            ))}
          </div>

          {/* Custom add */}
          {showCustomInput ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Grilled chicken salad"
                className="flex-1 min-w-0 bg-white border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleSmartAdd()}
                autoFocus
              />
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleSmartAdd}
                  disabled={isAnalyzing || !query.trim()}
                  className="flex-1 sm:flex-none px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  Add
                </button>
                <button
                  onClick={() => { setShowCustomInput(false); setQuery(''); }}
                  className="px-3 py-3 text-slate-400 hover:text-slate-600 rounded-2xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus size={18} />
              Add custom item
            </button>
          )}
        </div>

        {/* Day log */}
        <div className="px-4 sm:px-6 space-y-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {toDateStr(selectedDate) === toDateStr(new Date()) ? "Today's log" : 'Log'}
          </h3>
          {dayMeals.length === 0 ? (
            <div className="py-10 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
              No entries yet. Use quick add or add a custom item above.
            </div>
          ) : (
            <ul className="space-y-2">
              {dayMeals.map((meal) => (
                <li
                  key={meal.id}
                  className="bg-white border border-slate-100 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 truncate text-sm sm:text-base">{meal.name}</p>
                    <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5">
                      {meal.calories} kcal · P {meal.protein}g · C {meal.carbs}g · F {meal.fats}g
                    </p>
                  </div>
                  <button
                    onClick={() => removeMeal(meal.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors flex-shrink-0"
                    aria-label="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

function MacroCard({
  label,
  current,
  goal,
  unit,
  icon,
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  icon: React.ReactNode;
}) {
  const pct = goal ? Math.min(100, (current / goal) * 100) : 0;
  return (
    <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 min-w-0">
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1 flex-wrap">
        <span className="text-lg sm:text-xl font-black text-slate-900">{current}</span>
        <span className="text-[10px] sm:text-xs font-bold text-slate-400">/ {goal} {unit}</span>
      </div>
      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default CalorieTracker;
