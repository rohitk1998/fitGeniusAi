import { FC } from 'react';
import { Bell, User, Moon, Dumbbell } from 'lucide-react';
interface DashboardScreenProps {
  hasPlan: boolean;
  onOpenPlanner: () => void;
}

const DashboardScreen: FC<DashboardScreenProps> = ({
  hasPlan,
  onOpenPlanner,
}) => (
  <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 animate-fade-in overflow-y-auto no-scrollbar min-w-0">
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
        Welcome Back, Alpha
      </h1>
      <p className="text-slate-500 font-medium text-sm sm:text-base">
        Here's your bio-status for today.
      </p>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
      {/* Macro Overview */}
      <div className="col-span-1 xl:col-span-2 bg-white rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 192 192"
          >
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#f8fafc"
              strokeWidth="16"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="16"
              strokeDasharray={502}
              strokeDashoffset={150}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-black">1,840</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Calories In
            </span>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-3 md:gap-6 w-full min-w-0">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Protein
            </div>
            <div className="text-2xl font-black text-slate-900">145g</div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[80%] h-full bg-blue-500" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Carbs
            </div>
            <div className="text-2xl font-black text-slate-900">210g</div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[60%] h-full bg-amber-500" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Fats
            </div>
            <div className="text-2xl font-black text-slate-900">65g</div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[40%] h-full bg-rose-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Quick Widget */}
      <div className="bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200 min-h-[180px]">
        <div className="flex justify-between items-start">
          <div className="p-4 bg-white/10 rounded-3xl">
            <Moon size={24} className="text-indigo-400" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">88%</div>
            <div className="text-[10px] font-bold uppercase text-indigo-300">
              Readiness Score
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-2">Prime to Push</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            Central nervous system is recovered. Ideal for a high-intensity
            session today.
          </p>
        </div>
      </div>

      {/* Planner Shortcut */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenPlanner}
        onKeyDown={(e) => e.key === 'Enter' && onOpenPlanner()}
        className="col-span-1 xl:col-span-3 bg-indigo-50 border border-indigo-100 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 cursor-pointer group hover:bg-indigo-100 transition-all"
      >
        <div className="flex items-center gap-4 md:gap-6 min-w-0">
          <div className="p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl text-indigo-600 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
            <Dumbbell size={28} className="sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-2xl font-black text-slate-900">
              Your Training Protocol
            </h3>
            <p className="text-slate-600 font-medium text-sm sm:text-base truncate sm:whitespace-normal">
              {hasPlan
                ? 'View your personalized week-by-week guide.'
                : "You haven't generated a plan yet. Let's fix that."}
            </p>
          </div>
        </div>
        <span className="px-6 py-3 sm:px-8 sm:py-4 bg-slate-900 text-white rounded-2xl font-black text-sm group-hover:px-10 transition-all flex-shrink-0 inline-block text-center">
          {hasPlan ? 'Open Protocol' : 'Start Assessment'}
        </span>
      </div>
    </div>
  </div>
);

export default DashboardScreen;
