
import React, { useState, useEffect } from 'react';
import { Brain, Dumbbell, Utensils, Moon, Zap, Trophy, Flame } from 'lucide-react';
import { FitnessResponse, ActivityRecord } from './types';
import ResultView from './components/ResultView';
import CalorieTracker from './components/CalorieTracker';
import SleepTracker from './components/SleepTracker';
import StreakStats from './components/StreakStats';
import HeroSlideshow from './components/hub/HeroSlideshow';
import FloatingNav from './components/hub/FloatingNav';
import FeatureSection from './components/hub/FeatureSection';
import PlannerWizard from './components/planner/PlannerWizard';
import { FoodMarquee, GymMarquee } from './components/planner/InfiniteMarquee';

type ViewState = 'hub' | 'planner' | 'tracker' | 'sleep' | 'stats';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('hub');
  const [result, setResult] = useState<FitnessResponse | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Global Activity Tracker State
  const [activityLog, setActivityLog] = useState<ActivityRecord[]>(() => {
    const saved = localStorage.getItem('fitaura_activity');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fitaura_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  // Scroll Spy Logic
  useEffect(() => {
    if (view !== 'hub') return;
    const container = document.getElementById('hub-container');
    if (!container) return;

    const handleScroll = () => {
       const scrollPos = container.scrollTop + window.innerHeight / 3; 
       const sections = ['planner', 'tracker', 'sleep', 'stats'];
       let current = 'hero';
       if (container.scrollTop > window.innerHeight * 0.5) {
          for (const sec of sections) {
             const el = document.getElementById(sec);
             if (el && el.offsetTop <= scrollPos) current = sec;
          }
       }
       setActiveSection(current);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [view]);

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePlannerComplete = (plan: FitnessResponse) => {
    setResult(plan);
    // Note: The planner view in this structure handles display of result internally 
    // or we might need to adjust based on if we want to separate Wizard vs Result.
    // In this refactor, if result is present, we show ResultView.
  };

  return (
    <div className="h-screen w-screen bg-white text-slate-900 font-['Inter'] selection:bg-indigo-500/20 relative overflow-hidden">
      
      {/* HUB VIEW */}
      {view === 'hub' && (
        <div id="hub-container" className="h-full overflow-y-auto scroll-smooth relative">
          <HeroSlideshow onStart={() => scrollToSection('planner')} />
          <FloatingNav activeSection={activeSection} onNavigate={scrollToSection} />

          {/* PLANNER SECTION */}
          <FeatureSection 
            id="planner"
            title="Neural Workout Architect"
            description="Generate hyper-personalized training protocols based on your unique biometrics, equipment, and goals using Gemini 2.5."
            icon={<Brain size={24} />}
            colorClass="indigo"
            buttonText="Create Protocol"
            onAction={() => setView('planner')}
            visualContent={(
              <div className="relative h-full w-full p-6 overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="grid grid-cols-2 gap-4 h-full">
                      {/* Left Column */}
                      <div className="space-y-4 flex flex-col">
                          <img 
                              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80" 
                              className="w-full h-40 object-cover rounded-2xl shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500 delay-75" 
                              alt="Gym Workout"
                          />
                          <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex-1 flex flex-col justify-center relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Brain size={64} className="text-indigo-600"/>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">AI Generating</span>
                              </div>
                              <div className="space-y-2">
                                <div className="w-3/4 h-2 bg-indigo-200/50 rounded-full"></div>
                                <div className="w-1/2 h-2 bg-indigo-200/50 rounded-full"></div>
                                <div className="w-5/6 h-2 bg-indigo-200/50 rounded-full"></div>
                              </div>
                          </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4 pt-8 flex flex-col">
                          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl flex-1 flex flex-col justify-center relative overflow-hidden group-hover:shadow-2xl transition-shadow">
                              <div className="relative z-10">
                                  <div className="text-3xl font-black mb-1">PPL</div>
                                  <div className="text-xs text-slate-400 font-bold uppercase">Split Detected</div>
                              </div>
                              <Dumbbell className="absolute -right-4 -bottom-4 text-slate-800 opacity-50 transform rotate-12" size={80} />
                          </div>
                          <img 
                              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80" 
                              className="w-full h-40 object-cover rounded-2xl shadow-lg transform group-hover:translate-y-2 transition-transform duration-500 delay-100" 
                              alt="Training"
                          />
                      </div>
                  </div>
              </div>
            )}
          />

          {/* TRACKER SECTION */}
          <FeatureSection 
            id="tracker"
            title="Precision Fueling"
            description="Log meals with natural language. Our AI analyzes micronutrients and aligns them with your daily caloric and macro targets."
            icon={<Utensils size={24} />}
            colorClass="emerald"
            buttonText="Open Tracker"
            onAction={() => setView('tracker')}
            reversed
            visualContent={(
                <div className="space-y-6 select-none pointer-events-none mt-4 group-hover:scale-[1.02] transition-transform p-8 relative">
                    <div className="absolute top-0 right-0 p-6">
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                            <Zap size={24} fill="currentColor" />
                        </div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-slate-900 mb-2">2,450</div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Calories / Day</div>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
                    </div>
                </div>
            )}
          />

          {/* SLEEP SECTION */}
          <FeatureSection 
            id="sleep"
            title="Recovery Lab"
            description="Understand your body's readiness. We analyze your sleep quality and soreness to suggest dynamic training adjustments."
            icon={<Moon size={24} />}
            colorClass="blue"
            buttonText="Analyze Sleep"
            onAction={() => setView('sleep')}
            visualContent={(
                <div className="flex items-center justify-center h-full p-8">
                    <div className="relative w-48 h-48 select-none pointer-events-none group-hover:scale-105 transition-transform">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="80" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                            <circle cx="96" cy="96" r="80" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray={502} strokeDashoffset={100} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold text-slate-900">85</span>
                            <span className="text-xs font-bold text-slate-400 uppercase mt-2">Readiness</span>
                        </div>
                    </div>
                </div>
            )}
          />

          {/* STATS SECTION */}
          <FeatureSection 
            id="stats"
            title="Legacy & Streaks"
            description="Gamify your consistency. Build your streak, earn badges, and visualize your monthly activity heatmap."
            icon={<Trophy size={24} />}
            colorClass="orange"
            buttonText="View Stats"
            onAction={() => setView('stats')}
            reversed
            visualContent={(
                <div className="flex flex-col justify-between h-full p-8">
                    <div className="flex items-end gap-4 mb-8 select-none pointer-events-none">
                        <Flame className="text-orange-500 mb-1 group-hover:scale-110 transition-transform" size={48} />
                        <div>
                            <div className="text-6xl font-bold text-white leading-none">12</div>
                            <div className="text-sm text-slate-500 font-bold uppercase tracking-widest">Day Streak</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 opacity-50 select-none pointer-events-none">
                        {Array.from({length: 21}).map((_, i) => (
                            <div key={i} className={`aspect-square rounded-md ${i % 3 === 0 ? 'bg-orange-500' : 'bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>
            )}
          />

          <footer className="pt-40 pb-12 flex flex-col items-center justify-center overflow-hidden">
             <h1 className="text-[15vw] font-black text-slate-200 leading-none select-none tracking-tighter">FitAura</h1>
             <div className="flex items-center gap-8 mt-12 text-slate-400 font-medium text-sm">
                <span>© 2024 FitAura.AI</span>
                <span>Powered by Gemini</span>
                <span>Privacy</span>
             </div>
          </footer>
        </div>
      )}

      {/* PLANNER VIEW */}
      {view === 'planner' && (
        <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden">
          {!result ? (
              <div className="w-full h-full flex flex-row">
                 <GymMarquee />
                 <PlannerWizard 
                    onBack={() => setView('hub')} 
                    onComplete={handlePlannerComplete} 
                    onLogActivity={() => logActivity('planner')}
                 />
                 <FoodMarquee />
              </div>
            ) : (
              <div className="w-full h-full relative z-10 bg-gray-50">
                 <ResultView 
                   data={result} 
                   onReset={() => { setResult(null); }} 
                   onBack={() => setView('hub')}
                 />
              </div>
            )}
        </div>
      )}

      {/* TRACKER VIEW */}
      {view === 'tracker' && (
        <div className="relative z-10 h-full">
          <CalorieTracker onBack={() => setView('hub')} plannerData={result} onLogActivity={() => logActivity('meal')} />
        </div>
      )}

      {/* SLEEP VIEW */}
      {view === 'sleep' && (
        <div className="relative z-10 h-full">
           <SleepTracker onBack={() => setView('hub')} onLogActivity={(type) => logActivity(type)} />
        </div>
      )}

      {/* STATS VIEW */}
      {view === 'stats' && (
        <div className="relative z-10 h-full">
           <StreakStats onBack={() => setView('hub')} activityData={activityLog} />
        </div>
      )}

    </div>
  );
};

export default App;
