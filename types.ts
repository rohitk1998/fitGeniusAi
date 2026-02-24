
export enum GoalType {
  LOSE_WEIGHT = 'Fat Loss',
  GAIN_MUSCLE = 'Lean Bulking',
  RECOMP = 'Body Recomposition',
  STAMINA = 'Athletic Performance'
}

export enum ActivityLevel {
  SEDENTARY = 'Sedentary (Desk job)',
  LIGHT = 'Lightly Active',
  MODERATE = 'Moderately Active',
  HIGH = 'Highly Active',
  ATHLETE = 'Athlete'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface UserProfile {
  // Step 1: Goals
  goal: GoalType;
  timeline: string; // e.g. "16 weeks"
  quantifiableTarget: string; // e.g. "Lose 5kg"

  // Step 2: Profile
  age: number;
  gender: Gender;
  height: number; // cm
  weight: number; // kg
  bodyFat: string; // "15%" or "N/A"
  dietaryRestrictions: string;
  medicalConditions: string;

  // Step 3: Fitness
  experience: ExperienceLevel;
  frequency: number; // days per week
  equipment: string;
  workoutSplit: string;
  cardioPreference: string;

  // Step 4: Lifestyle
  activityLevel: ActivityLevel;
  sleepHours: number;
  stressLevel: 'Low' | 'Medium' | 'High';
  minutesPerSession: number;
  mealPrepStyle: string;
  cuisinePreference: string;
}

export interface RoutineItem {
  exercise: string;
  sets: string;
  reps: string;
  rest: string; // Added rest time
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
  imageKeyword?: string; // Added for visual generation
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
  habitToMaster: string; // New: Specific habit
  motivationalQuote: string; // New: Motivation
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
