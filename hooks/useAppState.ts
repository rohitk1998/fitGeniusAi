import { useState, useEffect } from 'react';
import type { FitnessResponse, ActivityRecord } from '../types';

export function useAppState() {
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
    setActivityLog((prev) => {
      const idx = prev.findIndex((r) => r.date === today);
      if (idx >= 0) {
        const record = prev[idx];
        if (!record.actions.includes(type)) {
          const updated = [...prev];
          updated[idx] = { ...record, actions: [...record.actions, type] };
          return updated;
        }
        return prev;
      }
      return [...prev, { date: today, actions: [type] }];
    });
  };

  return { result, setResult, activityLog, logActivity };
}
