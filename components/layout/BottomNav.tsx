import { FC, ReactNode } from 'react';
import { Home, Dumbbell, Utensils, Moon, Trophy } from 'lucide-react';
import type { TabType } from '../../constants/navigation';
import { BOTTOM_NAV_LINKS } from '../../constants/navigation';

const ICONS: Record<TabType, ReactNode> = {
  dashboard: <Home size={20} />,
  planner: <Dumbbell size={20} />,
  fuel: <Utensils size={20} />,
  recovery: <Moon size={20} />,
  profile: <Trophy size={20} />,
};

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav: FC<BottomNavProps> = ({ activeTab, onTabChange }) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb pb-3 px-2 pointer-events-none">
    <nav
      className="pointer-events-auto w-full md:w-[40%] md:max-w-[360px] mx-auto bg-white/95 backdrop-blur-md rounded-t-2xl md:rounded-2xl border border-slate-100 shadow-lg flex items-center justify-around py-2 px-2"
      aria-label="Main navigation"
    >
      {BOTTOM_NAV_LINKS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-2 px-1 rounded-xl transition-colors ${activeTab === id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'
            }`}
          aria-label={label}
        >
          {ICONS[id]}
          <span className="text-[10px] font-bold tracking-tight truncate w-full text-center">
            {label}
          </span>
        </button>
      ))}
    </nav>
  </div>
);

export default BottomNav;
