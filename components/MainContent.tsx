import { FC } from 'react';
import type { TabType } from '../constants/navigation';
import type { FitnessResponse, ActivityRecord } from '../types';
import ResultView from './ResultView';
import CalorieTracker from './CalorieTracker';
import SleepTracker from './SleepTracker';
import StreakStats from './StreakStats';
import PlannerWizard from './planner/PlannerWizard';
import DashboardScreen from './dashboard/DashboardScreen';

interface MainContentProps {
  activeTab: TabType;
  result: FitnessResponse | null;
  activityLog: ActivityRecord[];
  setActiveTab: (tab: TabType) => void;
  setResult: (r: FitnessResponse | null) => void;
  logActivity: (type: 'planner' | 'meal' | 'sleep') => void;
}

const MainContent: FC<MainContentProps> = ({
  activeTab,
  result,
  activityLog,
  setActiveTab,
  setResult,
  logActivity,
}) => {
  const goDashboard = () => setActiveTab('dashboard');

  switch (activeTab) {
    case 'dashboard':
      return (
        <DashboardScreen
          hasPlan={!!result}
          onOpenPlanner={() => setActiveTab('planner')}
        />
      );
    case 'planner':
      return result ? (
        <ResultView
          data={result}
          onReset={() => setResult(null)}
          onBack={goDashboard}
        />
      ) : (
        <div className="flex-1 bg-white h-full relative overflow-hidden">
          <PlannerWizard
            onBack={goDashboard}
            onComplete={(p) => {
              setResult(p);
              setActiveTab('planner');
            }}
            onLogActivity={() => logActivity('planner')}
          />
        </div>
      );
    case 'fuel':
      return (
        <CalorieTracker
          onBack={goDashboard}
          plannerData={result}
          onLogActivity={() => logActivity('meal')}
        />
      );
    case 'recovery':
      return <SleepTracker onBack={goDashboard} onLogActivity={() => logActivity('sleep')} />;
    case 'profile':
      return <StreakStats onBack={goDashboard} activityData={activityLog} />;
    default:
      return (
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <p className="text-slate-500 text-sm sm:text-base">Select a section from the menu.</p>
        </div>
      );
  }
};

export default MainContent;
