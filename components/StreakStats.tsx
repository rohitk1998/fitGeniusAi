
import React, { useMemo } from 'react';
import { Trophy, Calendar, Flame, Star, Shield, Zap, ArrowLeft } from 'lucide-react';
import { ActivityRecord } from '../types';

interface StreakStatsProps {
  onBack: () => void;
  activityData: ActivityRecord[];
}

const StreakStats: React.FC<StreakStatsProps> = ({ onBack, activityData }) => {
  
  const stats = useMemo(() => {
    // Sort activity by date desc
    const sorted = [...activityData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Calculate Current Streak
    let streak = 0;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if active today or yesterday to keep streak alive
    let hasActivityToday = sorted.some(r => r.date === todayStr);
    let hasActivityYesterday = sorted.some(r => r.date === yesterdayStr);
    
    if (hasActivityToday || hasActivityYesterday) {
       streak = 1;
       let currentPointer = new Date(hasActivityToday ? today : yesterday);
       let count = 0;
       
       while (true) {
          const dateStr = currentPointer.toISOString().split('T')[0];
          if (activityData.some(a => a.date === dateStr)) {
             count++;
             currentPointer.setDate(currentPointer.getDate() - 1);
          } else {
             break;
          }
       }
       streak = count;
    }

    const totalWorkouts = sorted.reduce((acc, curr) => acc + (curr.actions.includes('planner') ? 1 : 0), 0);
    const totalMeals = sorted.reduce((acc, curr) => acc + (curr.actions.includes('meal') ? 1 : 0), 0);

    return { streak, totalWorkouts, totalMeals };
  }, [activityData]);

  // Generate Calendar Grid for current month
  const renderCalendar = () => {
     const today = new Date();
     const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
     const days = [];
     
     for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = new Date(today.getFullYear(), today.getMonth(), i).toISOString().split('T')[0];
        const isActive = activityData.some(a => a.date === dateStr);
        const isToday = i === today.getDate();
        
        days.push(
          <div key={i} className={`
             aspect-square rounded-lg flex items-center justify-center text-xs font-bold relative
             ${isActive ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-gray-100 text-slate-400'}
             ${isToday ? 'ring-2 ring-indigo-400' : ''}
          `}>
             {i}
             {isActive && <div className="absolute bottom-1 w-1 h-1 bg-indigo-500 rounded-full"></div>}
          </div>
        );
     }
     return days;
  };

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col min-w-0">
      {/* Header */}
      <div className="flex-none px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 border-b border-gray-200 bg-white z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            Legacy <Trophy size={18} className="text-yellow-500 flex-shrink-0"/>
          </h2>
          <p className="text-xs text-slate-500">Stats & Achievements</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Main Streak Card */}
          <div className="md:col-span-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden shadow-xl shadow-orange-500/20">
             <div className="absolute right-0 top-0 p-4 sm:p-8 opacity-20 text-white pointer-events-none">
               <Flame size={200} />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="min-w-0">
                   <div className="text-orange-100 font-bold uppercase tracking-widest text-xs sm:text-sm mb-2">Current Streak</div>
                   <div className="text-5xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter leading-none">
                      {stats.streak}<span className="text-2xl sm:text-4xl opacity-70 ml-2">Days</span>
                   </div>
                   <p className="text-orange-50 mt-3 sm:mt-4 max-w-md text-sm sm:text-base">
                     Consistency is the key to biology. Keep logging your meals, workouts, or sleep to maintain the fire.
                   </p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full sm:min-w-[200px] sm:w-auto text-center border border-white/30">
                   <div className="text-2xl sm:text-3xl font-bold text-white mb-1">Top 1%</div>
                   <div className="text-[10px] sm:text-xs text-orange-100 uppercase font-bold">Global Rank</div>
                </div>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
             <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
                <Zap className="text-indigo-500 mb-3 sm:mb-4" size={28} />
                <div>
                   <div className="text-3xl font-bold text-slate-900">{stats.totalWorkouts}</div>
                   <div className="text-xs text-slate-500 uppercase font-bold">Plans Generated</div>
                </div>
             </div>
             <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between shadow-sm">
                <Shield className="text-emerald-500 mb-3 sm:mb-4" size={28} />
                <div>
                   <div className="text-3xl font-bold text-slate-900">{stats.totalMeals}</div>
                   <div className="text-xs text-slate-500 uppercase font-bold">Meals Logged</div>
                </div>
             </div>

             {/* Calendar Heatmap */}
             <div className="col-span-2 bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm overflow-x-auto">
                <div className="flex items-center justify-between mb-4 sm:mb-6 min-w-[280px]">
                   <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Calendar size={16} className="text-slate-500"/> Activity Log
                   </h4>
                   <span className="text-xs text-slate-500 font-bold uppercase">
                      {new Date().toLocaleString('default', { month: 'long' })}
                   </span>
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[280px]">
                   {['S','M','T','W','T','F','S'].map(d => (
                      <div key={d} className="text-center text-[10px] font-bold text-slate-400 mb-2">{d}</div>
                   ))}
                   {renderCalendar()}
                </div>
             </div>
          </div>

          {/* Badges */}
          <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm">
             <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
               <Star size={16} className="text-yellow-500"/> Badges
             </h4>
             <div className="space-y-4">
                <div className={`flex items-center gap-4 p-3 rounded-xl border ${stats.streak >= 3 ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                   <div className="p-3 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                      <Flame size={20}/>
                   </div>
                   <div>
                      <div className="text-sm font-bold text-slate-900">Ignition</div>
                      <div className="text-[10px] text-slate-500">3 Day Streak</div>
                   </div>
                </div>

                <div className={`flex items-center gap-4 p-3 rounded-xl border ${stats.streak >= 7 ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                   <div className="p-3 bg-purple-500 rounded-lg text-white shadow-lg shadow-purple-500/20">
                      <Zap size={20}/>
                   </div>
                   <div>
                      <div className="text-sm font-bold text-slate-900">Momentum</div>
                      <div className="text-[10px] text-slate-500">7 Day Streak</div>
                   </div>
                </div>

                <div className={`flex items-center gap-4 p-3 rounded-xl border ${stats.totalMeals >= 10 ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100 opacity-50'}`}>
                   <div className="p-3 bg-emerald-500 rounded-lg text-white shadow-lg shadow-emerald-500/20">
                      <Shield size={20}/>
                   </div>
                   <div>
                      <div className="text-sm font-bold text-slate-900">Fueled Up</div>
                      <div className="text-[10px] text-slate-500">Log 10 Meals</div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StreakStats;
