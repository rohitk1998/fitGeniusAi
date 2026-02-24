import React, { useState, useEffect } from 'react';
import { Home, Dumbbell, Utensils, Moon, Trophy, User, LogOut, Bell } from 'lucide-react';
import { FitnessResponse, ActivityRecord } from './types';
import SplashScreen from './components/SplashScreen';
import OnboardingStory from './components/OnboardingStory';
import ResultView from './components/ResultView';
import CalorieTracker from './components/CalorieTracker';
import SleepTracker from './components/SleepTracker';
import StreakStats from './components/StreakStats';
import PlannerWizard from './components/planner/PlannerWizard';

type TabType = 'dashboard' | 'planner' | 'fuel' | 'recovery' | 'profile';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      return localStorage.getItem('fitaura_onboarding_complete') === 'true' ? false : true;
    } catch {
      return true;
    }
  });
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [result, setResult] = useState<FitnessResponse | null>(() => {
    try {
      const saved = localStorage.getItem('fitaura_plan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activityLog, setActivityLog] = useState<ActivityRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fitaura_activity');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fitaura_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  useEffect(() => {
    if (result) {
      localStorage.setItem('fitaura_plan', JSON.stringify(result));
    }
  }, [result]);

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

  const navItems: { id: TabType; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Home' },
    { id: 'planner', icon: <Dumbbell size={20} />, label: 'Plan' },
    { id: 'fuel', icon: <Utensils size={20} />, label: 'Fuel' },
    { id: 'recovery', icon: <Moon size={20} />, label: 'Sleep' },
    { id: 'profile', icon: <Trophy size={20} />, label: 'Stats' },
  ];

  const SidebarItem = ({ id, icon, label }: { id: TabType, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl transition-all duration-300 ${
        activeTab === id 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      <span className="font-bold text-sm tracking-tight">{label}</span>
    </button>
  );

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 animate-fade-in overflow-y-auto no-scrollbar min-w-0">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Welcome Back, Alpha</h1>
                <p className="text-slate-500 font-medium text-sm sm:text-base">Here's your bio-status for today.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                  <Bell size={20} />
                </button>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <User size={24} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </header>

            {/* Desktop Widget Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
              
              {/* Macro Overview */}
              <div className="col-span-1 xl:col-span-2 bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
                    <circle cx="96" cy="96" r="80" fill="none" stroke="#f8fafc" strokeWidth="16" />
                    <circle 
                      cx="96" cy="96" r="80" 
                      fill="none" stroke="#4f46e5" strokeWidth="16" 
                      strokeDasharray={502} 
                      strokeDashoffset={150} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-black">1,840</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calories In</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3 md:gap-6 w-full min-w-0">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Protein</div>
                    <div className="text-2xl font-black text-slate-900">145g</div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden"><div className="w-[80%] h-full bg-blue-500"></div></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carbs</div>
                    <div className="text-2xl font-black text-slate-900">210g</div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-amber-500"></div></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fats</div>
                    <div className="text-2xl font-black text-slate-900">65g</div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden"><div className="w-[40%] h-full bg-rose-500"></div></div>
                  </div>
                </div>
              </div>

              {/* Recovery Quick Widget */}
              <div className="bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200 min-h-[180px]">
                <div className="flex justify-between items-start">
                   <div className="p-4 bg-white/10 rounded-3xl"><Moon size={24} className="text-indigo-400"/></div>
                   <div className="text-right">
                      <div className="text-3xl font-black">88%</div>
                      <div className="text-[10px] font-bold uppercase text-indigo-300">Readiness Score</div>
                   </div>
                </div>
                <div>
                   <h4 className="font-bold mb-2">Prime to Push</h4>
                   <p className="text-sm text-slate-400 leading-relaxed">Central nervous system is recovered. Ideal for a high-intensity session today.</p>
                </div>
              </div>

              {/* Planner Shortcut */}
              <div 
                onClick={() => setActiveTab('planner')}
                className="col-span-1 xl:col-span-3 bg-indigo-50 border border-indigo-100 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cursor-pointer group hover:bg-indigo-100 transition-all"
              >
                <div className="flex items-center gap-4 md:gap-6 min-w-0">
                   <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl text-indigo-600 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                      <Dumbbell size={28} className="sm:w-8 sm:h-8" />
                   </div>
                   <div className="min-w-0">
                      <h3 className="text-lg sm:text-2xl font-black text-slate-900">Your Training Protocol</h3>
                      <p className="text-slate-600 font-medium text-sm sm:text-base truncate sm:whitespace-normal">{result ? 'View your personalized week-by-week guide.' : 'You haven\'t generated a plan yet. Let\'s fix that.'}</p>
                   </div>
                </div>
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-slate-900 text-white rounded-2xl font-black text-sm group-hover:px-10 transition-all flex-shrink-0">
                  {result ? 'Open Protocol' : 'Start Assessment'}
                </button>
              </div>

            </div>
          </div>
        );
      case 'planner':
        return result ? (
          <ResultView data={result} onReset={() => setResult(null)} onBack={() => setActiveTab('dashboard')} />
        ) : (
          <div className="flex-1 bg-white h-full relative overflow-hidden">
            <PlannerWizard 
              onBack={() => setActiveTab('dashboard')} 
              onComplete={(p) => {setResult(p); setActiveTab('planner');}} 
              onLogActivity={() => logActivity('planner')} 
            />
          </div>
        );
      case 'fuel':
        return <CalorieTracker onBack={() => setActiveTab('dashboard')} plannerData={result} onLogActivity={() => logActivity('meal')} />;
      case 'recovery':
        return <SleepTracker onBack={() => setActiveTab('dashboard')} onLogActivity={() => logActivity('sleep')} />;
      case 'profile':
        return <StreakStats onBack={() => setActiveTab('dashboard')} activityData={activityLog} />;
      default:
        return (
          <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
            <p className="text-slate-500 text-sm sm:text-base">Select a section from the menu.</p>
          </div>
        );
    }
  };

  return (
    <>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} minDuration={2200} />
      )}

      {!showSplash && showOnboarding && (
        <OnboardingStory onComplete={() => setShowOnboarding(false)} />
      )}

      <div className="h-screen w-full flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      
      {/* DESKTOP SIDEBAR - hidden on mobile/tablet */}
      <aside className="hidden lg:flex w-80 flex-none bg-white border-r border-slate-100 flex-col p-6 xl:p-8 z-40">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Trophy size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter">FitAura<span className="text-indigo-600">.AI</span></span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem id="dashboard" icon={<Home size={20}/>} label="Command Center" />
          <SidebarItem id="planner" icon={<Dumbbell size={20}/>} label="Workout Protocol" />
          <SidebarItem id="fuel" icon={<Utensils size={20}/>} label="Nutrition Lab" />
          <SidebarItem id="recovery" icon={<Moon size={20}/>} label="Recovery Suite" />
          <SidebarItem id="profile" icon={<Trophy size={20}/>} label="Performance Stats" />
        </nav>

        <div className="pt-6 border-t border-slate-50">
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300">
            <LogOut size={20} />
            <span className="font-bold text-sm tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA - padding-bottom for mobile nav */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0 pb-20 lg:pb-0">
        {renderActiveScreen()}
      </main>

      {/* MOBILE / TABLET BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 safe-area-pb flex items-center justify-around py-2 px-1">
        {navItems.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 px-1 rounded-xl transition-colors ${
              activeTab === id
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-slate-400'
            }`}
            aria-label={label}
          >
            {icon}
            <span className="text-[10px] font-bold tracking-tight">{label}</span>
          </button>
        ))}
      </nav>
    </div>
    </>
  );
};

export default App;