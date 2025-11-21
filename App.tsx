
import React, { useState, useEffect } from 'react';
import { Activity, Brain, ChevronRight, Loader2, LayoutDashboard, Calculator, ArrowRight, ArrowLeft, Moon, Trophy, Dumbbell } from 'lucide-react';
import { UserProfile, GoalType, ActivityLevel, FitnessResponse, ActivityRecord } from './types';
import { generateFitnessPlan } from './services/geminiService';
import ResultView from './components/ResultView';
import CalorieTracker from './components/CalorieTracker';
import SleepTracker from './components/SleepTracker';
import StreakStats from './components/StreakStats';

type ViewState = 'hub' | 'planner' | 'tracker' | 'sleep' | 'stats';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('hub');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FitnessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Global Activity Tracker State
  const [activityLog, setActivityLog] = useState<ActivityRecord[]>(() => {
    const saved = localStorage.getItem('fitaura_activity');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fitaura_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  const logActivity = (type: 'planner' | 'meal' | 'sleep') => {
    const today = new Date().toISOString().split('T')[0];
    setActivityLog(prev => {
       const existingRecordIndex = prev.findIndex(r => r.date === today);
       if (existingRecordIndex >= 0) {
          const record = prev[existingRecordIndex];
          if (!record.actions.includes(type)) {
             const updated = [...prev];
             updated[existingRecordIndex] = { ...record, actions: [...record.actions, type] };
             return updated;
          }
          return prev;
       } else {
          return [...prev, { date: today, actions: [type] }];
       }
    });
  };

  const [formData, setFormData] = useState<UserProfile>({
    age: 25,
    height: 175,
    weight: 70,
    goal: GoalType.GAIN_MUSCLE,
    timeline: 3,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    additionalInfo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'timeline' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const plan = await generateFitnessPlan(formData);
      setResult(plan);
      logActivity('planner');
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-slate-200 font-['Inter'] selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

      {/* HUB VIEW */}
      {view === 'hub' && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 overflow-y-auto">
          <div className="text-center mb-10 mt-10 md:mt-0">
             <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
                   <Activity className="text-white" size={32} />
                </div>
             </div>
             <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-4">
               FitAura<span className="text-indigo-500">.AI</span>
             </h1>
             <p className="text-slate-400 text-lg max-w-md mx-auto">
               Next-generation biological optimization engine. Select a module to begin.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full pb-10">
             {/* Card 1: Planner */}
             <button 
               onClick={() => setView('planner')}
               className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-3xl p-6 md:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
             >
               <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                 <Dumbbell size={120} />
               </div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                   <Brain size={24} />
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold text-white mb-2">AI Workout Planner</h2>
                 <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-6">
                   Generate hyper-personalized training protocols based on biometrics using Gemini AI.
                 </p>
                 <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold group-hover:translate-x-2 transition-transform">
                   Launch <ArrowRight size={16} />
                 </div>
               </div>
             </button>

             {/* Card 2: Tracker */}
             <button 
               onClick={() => setView('tracker')}
               className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-3xl p-6 md:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                 <Calculator size={120} />
               </div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                   <LayoutDashboard size={24} />
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Macro Tracker</h2>
                 <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-6">
                   Log meals and track Calories, Protein, Carbs & Fiber with AI food analysis.
                 </p>
                 <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold group-hover:translate-x-2 transition-transform">
                   Track <ArrowRight size={16} />
                 </div>
               </div>
             </button>

             {/* Card 3: Sleep & Recovery */}
             <button 
               onClick={() => setView('sleep')}
               className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-3xl p-6 md:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden"
             >
               <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                 <Moon size={120} />
               </div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                   <Activity size={24} />
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Sleep & Recovery</h2>
                 <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-6">
                   Monitor rest quality and get AI-adjusted readiness scores for your daily training.
                 </p>
                 <div className="flex items-center gap-2 text-blue-400 text-sm font-bold group-hover:translate-x-2 transition-transform">
                   Analyze <ArrowRight size={16} />
                 </div>
               </div>
             </button>

             {/* Card 4: Streaks */}
             <button 
               onClick={() => setView('stats')}
               className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/50 rounded-3xl p-6 md:p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 overflow-hidden"
             >
               <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                 <Trophy size={120} />
               </div>
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                   <Trophy size={24} />
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Legacy & Streaks</h2>
                 <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-6">
                   Visualize your consistency, earn badges, and maintain your active day streak.
                 </p>
                 <div className="flex items-center gap-2 text-orange-400 text-sm font-bold group-hover:translate-x-2 transition-transform">
                   View Stats <ArrowRight size={16} />
                 </div>
               </div>
             </button>
          </div>
        </div>
      )}

      {/* PLANNER VIEW */}
      {view === 'planner' && (
        <div className="relative z-10 h-full flex flex-col">
          {!result ? (
              <div className="h-full overflow-y-auto p-4 md:p-8 flex items-center justify-center">
                <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-8 md:p-10 border-b border-slate-700/50 relative overflow-hidden">
                    <button 
                      onClick={() => setView('hub')}
                      className="absolute top-6 left-6 p-2 hover:bg-slate-700/50 rounded-full text-slate-400 hover:text-white transition-colors z-20"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                      <Brain size={200} className="text-indigo-500" />
                    </div>
                    <div className="mt-4">
                      <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Initialize Setup</h2>
                      <p className="text-slate-400 relative z-10">Configure your parameters for the AI engine.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
                        <input
                          type="number"
                          name="age"
                          required
                          min="16"
                          max="99"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          required
                          min="100"
                          max="250"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          required
                          min="30"
                          max="300"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Objective</label>
                        <select
                          name="goal"
                          value={formData.goal}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                        >
                          {Object.values(GoalType).map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Profile</label>
                        <select
                          name="activityLevel"
                          value={formData.activityLevel}
                          onChange={handleInputChange}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer"
                        >
                          {Object.values(ActivityLevel).map((l) => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline Projection</label>
                          <span className="text-indigo-400 font-bold bg-indigo-400/10 px-3 py-1 rounded-full text-sm">{formData.timeline} Months</span>
                       </div>
                      <input
                        type="range"
                        name="timeline"
                        min="1"
                        max="12"
                        step="1"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Specific Constraints / Injuries</label>
                      <textarea
                        name="additionalInfo"
                        placeholder="E.g., No equipment available, previous knee injury..."
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl border border-red-500/20">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Processing Data...
                        </>
                      ) : (
                        <>
                          Generate Protocol
                          <ChevronRight size={20} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <ResultView 
                data={result} 
                onReset={() => setResult(null)} 
                onBack={() => setView('hub')}
              />
            )}
        </div>
      )}

      {/* TRACKER VIEW */}
      {view === 'tracker' && (
        <div className="relative z-10 h-full">
          <CalorieTracker 
            onBack={() => setView('hub')} 
            plannerData={result}
            onLogActivity={() => logActivity('meal')}
          />
        </div>
      )}

      {/* SLEEP VIEW */}
      {view === 'sleep' && (
        <div className="relative z-10 h-full">
           <SleepTracker 
              onBack={() => setView('hub')}
              onLogActivity={(type) => logActivity(type)}
           />
        </div>
      )}

      {/* STATS VIEW */}
      {view === 'stats' && (
        <div className="relative z-10 h-full">
           <StreakStats 
              onBack={() => setView('hub')}
              activityData={activityLog}
           />
        </div>
      )}

    </div>
  );
};

export default App;
