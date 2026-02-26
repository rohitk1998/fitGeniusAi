import React from 'react';
import { Home, Dumbbell, Utensils, Moon, Trophy, LogOut } from 'lucide-react';
import type { TabType } from '../../constants/navigation';
import { SIDEBAR_LINKS } from '../../constants/navigation';

const ICONS: Record<TabType, React.ReactNode> = {
  dashboard: <Home size={20} />,
  planner: <Dumbbell size={20} />,
  fuel: <Utensils size={20} />,
  recovery: <Moon size={20} />,
  profile: <Trophy size={20} />,
};

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => (
  <aside className="hidden lg:flex w-80 flex-none bg-white border-r border-slate-100 flex-col p-6 xl:p-8 z-40">
    <div className="flex items-center gap-3 mb-10 px-2">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
        <Trophy size={20} />
      </div>
      <span className="text-xl font-black tracking-tighter">
        FitAura<span className="text-indigo-600">.AI</span>
      </span>
    </div>

    <nav className="flex-1 space-y-1">
      {SIDEBAR_LINKS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`w-full flex items-center gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl transition-all duration-300 ${
            activeTab === id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          {ICONS[id]}
          <span className="font-bold text-sm tracking-tight">{label}</span>
        </button>
      ))}
    </nav>

    <div className="pt-6 border-t border-slate-50">
      <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300">
        <LogOut size={20} />
        <span className="font-bold text-sm tracking-tight">Logout</span>
      </button>
    </div>
  </aside>
);

export default Sidebar;
