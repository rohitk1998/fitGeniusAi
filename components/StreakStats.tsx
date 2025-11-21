
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
       // Check backwards from yesterday
       let checkDate = new Date(yesterday);
       if (hasActivityToday && !hasActivityYesterday) {
          // Streak is 1 (today), check yesterday was handled above, wait loop logic below needs consistent stepping
          checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - 1);
       }
       
       // Simple loop: Check consecutive days in history
       // Actually, easier: Set a pointer date to today or yesterday. 
       // Iterate backwards day by day, checking if date exists in logs.
       
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
             ${isActive ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50' : 'bg-slate-800/50 text-slate-600'}
             ${isToday ? 'ring-2 ring-white' : ''}
          `}>
             {i}
             {isActive && <div className="absolute bottom-1 w-1 h-1 bg-indigo-400 rounded-full"></div>}
          </div>
        );
     }
     return days;
  };

  return (
    <div className="h-full w-full bg-[#0f172a] flex flex-col">
      {/* Header */}
      <div className="flex-none px-6 py-4 flex items-center gap-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Legacy <Trophy size={18} className="text-yellow-500"/>
          </h2>
          <p className="text-xs text-slate-400">Stats & Achievements</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Streak Card */}
          <div className="md:col-span-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-orange-900/20">
             <div className="absolute right-0 top-0 p-8 opacity-20">
               <Flame size={200} />
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <div className="text-orange-200 font-bold uppercase tracking-widest text-sm mb-2">Current Streak</div>
                   <div className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none">
                      {stats.streak}<span className="text-4xl opacity-50 ml-2">Days</span>
                   </div>
                   <p className="text-orange-100 mt-4 max-w-md">
                     Consistency is the key to biology. Keep logging your meals, workouts, or sleep to maintain the fire.
                   </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 min-w-[200px] text-center border border-white/20">
                   <div className="text-3xl font-bold text-white mb-1">Top 1%</div>
                   <div className="text-xs text-orange-200 uppercase font-bold">Global Rank</div>
                </div>
             </div>
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
             <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between">
                <Zap className="text-indigo-400 mb-4" size={32} />
                <div>
                   <div className="text-3xl font-bold text-white">{stats.totalWorkouts}</div>
                   <div className="text-xs text-slate-500 uppercase font-bold">Plans Generated</div>
                </div>
             </div>
             <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between">
                <Shield className="text-emerald-400 mb-4" size={32} />
                <div>
                   <div className="text-3xl font-bold text-white">{stats.totalMeals}</div>
                   <div className="text-xs text-slate-500 uppercase font-bold">Meals Logged</div>
                </div>
             </div>

             {/* Calendar Heatmap */}
             <div className="col-span-2 bg-slate-800/50 border border-slate-700 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400"/> Activity Log
                   </h4>
                   <span className="text-xs text-slate-500 font-bold uppercase">
                      {new Date().toLocaleString('default', { month: 'long' })}
                   </span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                   {['S','M','T','W','T','F','S'].map(d => (
                      <div key={d} className="text-center text-[10px] font-bold text-slate-600 mb-2">{d}</div>
                   ))}
                   {renderCalendar()}
                </div>
             </div>
          </div>

          {/* Badges */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6">
             <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
               <Star size={16} className="text-yellow-500"/> Badges
             </h4>
             <div className="space-y-4">
                <div className={`flex items-center gap-4 p-3 rounded-xl border ${stats.streak >= 3 ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900/50 border-slate-700/50 opacity-50'}`}>
                   <div className="p-3 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                      <Flame size={20}/>
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white">Ignition</div>
                      <div className="text-[10px] text-slate-400">3 Day Streak</div>
                   </div>
                </div>

                <div className={`flex items-center gap-4 p-3 rounded-xl border ${stats.streak >= 7 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-slate-900/50 border-slate-700/50 opacity-50'}`}>
                   <div className="p-3 bg-purple-500 rounded-lg text-white shadow-lg shadow-purple-500/20">
                      <Zap size={20}/>
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white">Momentum</div>
                      <div className="text-[10px] text-slate-400">7 Day Streak</div>
                   </div>
                </div>

                <div className={`flex items-center gap-4 p-3 rounded-xl border ${stats.totalMeals >= 10 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900/50 border-slate-700/50 opacity-50'}`}>
                   <div className="p-3 bg-emerald-500 rounded-lg text-white shadow-lg shadow-emerald-500/20">
                      <Shield size={20}/>
                   </div>
                   <div>
                      <div className="text-sm font-bold text-white">Fueled Up</div>
                      <div className="text-[10px] text-slate-400">Log 10 Meals</div>
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
