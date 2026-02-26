import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Bell, User, LogOut } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { TabType } from '../../constants/navigation';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  children: React.ReactNode;
  user: SupabaseUser | null;
  onSignOut: () => Promise<void>;
}

const AppLayout: React.FC<AppLayoutProps> = ({ activeTab, onTabChange, children, user, onSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? 'User';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="flex-none flex items-center justify-between h-14 px-4 sm:px-6 safe-area-pt z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Trophy size={16} className="text-white" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            FitAura<span className="text-indigo-600">.AI</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowDropdown((v) => !v)}
              className="w-9 h-9 rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Profile menu"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
              )}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 truncate">{displayName}</p>
                  {user?.email && (
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setShowDropdown(false);
                    await onSignOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden pb-24">
        {children}
      </main>

      {/* Bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default AppLayout;

