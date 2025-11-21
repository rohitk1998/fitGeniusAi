
export enum GoalType {
  LOSE_WEIGHT = 'Lose Weight',
  GAIN_MUSCLE = 'Gain Muscle',
  MAINTAIN = 'Maintain & Tone',
  IMPROVE_STAMINA = 'Improve Stamina'
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary (Office job)',
  LIGHTLY_ACTIVE = 'Lightly Active (1-2 days/week)',
  MODERATELY_ACTIVE = 'Moderately Active (3-5 days/week)',
  VERY_ACTIVE = 'Very Active (6-7 days/week)'
}

export interface UserProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  goal: GoalType;
  timeline: number; // months
  activityLevel: ActivityLevel;
  additionalInfo: string;
}

export interface RoutineItem {
  exercise: string;
  sets: string;
  reps: string;
}

export interface DailyPlan {
  day: string;
  focus: string;
  exercises: RoutineItem[];
}

export interface MealMacro {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface NutritionInfo {
  dailyCalories: number;
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
  keyFoods: string[];
  exampleMeals: MealMacro[];
}

export interface Milestone {
  month: number;
  description: string;
  expectedResult: string;
}

export interface FitnessResponse {
  summary: string;
  nutrition: NutritionInfo;
  weeklySchedule: DailyPlan[];
  milestones: Milestone[];
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  timestamp: Date;
}

// --- NEW TYPES FOR SLEEP & STREAKS ---

export interface SleepLog {
  id: string;
  date: string;
  hours: number;
  quality: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  soreness: 'None' | 'Low' | 'Medium' | 'High';
  readinessScore?: number;
  aiFeedback?: string;
}

export interface RecoveryAnalysis {
  readinessScore: number;
  summary: string;
  recommendation: 'Rest' | 'Active Recovery' | 'Maintain' | 'Push Hard';
  workoutAdjustment: string;
}

export interface ActivityRecord {
  date: string; // YYYY-MM-DD
  actions: ('planner' | 'meal' | 'sleep')[];
}
