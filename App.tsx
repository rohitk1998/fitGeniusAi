import React, { useState, useEffect } from 'react';
import { Home, Dumbbell, Utensils, Moon, Trophy, User, LogOut, Search, Bell, Settings } from 'lucide-react';
import { FitnessResponse, ActivityRecord } from './types';
import ResultView from './components/ResultView';
import CalorieTracker from './components/CalorieTracker';
import SleepTracker from './components/SleepTracker';
import StreakStats from './components/StreakStats';
import PlannerWizard from './components/planner/PlannerWizard';

type TabType = 'dashboard' | 'planner' | 'fuel' | 'recovery' | 'profile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [result, setResult] = useState<FitnessResponse | null>(() => {
    const saved = localStorage.getItem('fitaura_plan');
    return saved ? JSON.parse(saved) : null;
  });

  const [activityLog, setActivityLog] = useState<ActivityRecord[]>(() => {
    const saved = localStorage.getItem('fitaura_activity');
    return saved ? JSON.parse(saved) : [];
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

  const SidebarItem = ({ id, icon, label }: { id: TabType, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
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
          <div className="flex-1 p-8 space-y-8 animate-fade-in overflow-y-auto no-scrollbar">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back, Alpha</h1>
                <p className="text-slate-500 font-medium">Here's your bio-status for today.</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                  <Bell size={20} />
                </button>
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                  <User size={24} />
                </div>
              </div>
            </header>

            {/* Desktop Widget Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Macro Overview */}
              <div className="col-span-1 xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-12">
                <div className="relative w-48 h-48 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
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
                    <span className="text-3xl font-black">1,840</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calories In</span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-6 w-full">
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
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200">
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
                className="col-span-1 xl:col-span-3 bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem] flex items-center justify-between cursor-pointer group hover:bg-indigo-100 transition-all"
              >
                <div className="flex items-center gap-6">
                   <div className="p-6 bg-white rounded-3xl text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      <Dumbbell size={32} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900">Your Training Protocol</h3>
                      <p className="text-slate-600 font-medium">{result ? 'View your personalized week-by-week guide.' : 'You haven\'t generated a plan yet. Let\'s fix that.'}</p>
                   </div>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm group-hover:px-10 transition-all">
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
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="w-80 flex-none bg-white border-r border-slate-100 flex flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Trophy size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter">FitAura<span className="text-indigo-600">.AI</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem id="dashboard" icon={<Home size={20}/>} label="Command Center" />
          <SidebarItem id="planner" icon={<Dumbbell size={20}/>} label="Workout Protocol" />
          <SidebarItem id="fuel" icon={<Utensils size={20}/>} label="Nutrition Lab" />
          <SidebarItem id="recovery" icon={<Moon size={20}/>} label="Recovery Suite" />
          <SidebarItem id="profile" icon={<Trophy size={20}/>} label="Performance Stats" />
        </nav>

        <div className="pt-8 border-t border-slate-50">
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300">
            <LogOut size={20} />
            <span className="font-bold text-sm tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {renderActiveScreen()}
      </main>
    </div>
  );
};

export default App;