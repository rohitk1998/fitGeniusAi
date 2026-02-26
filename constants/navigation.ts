export type TabType = 'dashboard' | 'planner' | 'fuel' | 'recovery' | 'profile';

export const SIDEBAR_LINKS: { id: TabType; label: string }[] = [
  { id: 'dashboard', label: 'Command Center' },
  { id: 'planner', label: 'Workout Protocol' },
  { id: 'fuel', label: 'Nutrition Lab' },
  { id: 'recovery', label: 'Recovery Suite' },
  { id: 'profile', label: 'Performance Stats' },
];

export const BOTTOM_NAV_LINKS: { id: TabType; label: string }[] = [
  { id: 'dashboard', label: 'Home' },
  { id: 'planner', label: 'Plan' },
  { id: 'fuel', label: 'Fuel' },
  { id: 'recovery', label: 'Sleep' },
];
