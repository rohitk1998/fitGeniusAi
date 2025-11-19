import React, { useState } from 'react';
import { Activity, Brain, ChevronRight, Loader2 } from 'lucide-react';
import { UserProfile, GoalType, ActivityLevel, FitnessResponse } from './types';
import { generateFitnessPlan } from './services/geminiService';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FitnessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserProfile>({
    age: 25,
    height: 175,
    weight: 70,
    goal: GoalType.GAIN_MUSCLE,
    timeline: 3,
    activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    additionalInfo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' || name === 'timeline' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const plan = await generateFitnessPlan(formData);
      setResult(plan);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Brain className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">FitGenius AI</h1>
          </div>
          <ResultView data={result} onReset={() => setResult(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-center">
          <div className="mx-auto bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FitGenius AI</h1>
          <p className="text-indigo-100">Generate your personalized fitness & nutrition roadmap</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Age (years)</label>
              <input
                type="number"
                name="age"
                required
                min="16"
                max="99"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                required
                min="100"
                max="250"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                required
                min="30"
                max="300"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Goal & Activity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Primary Goal</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              >
                {Object.values(GoalType).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Activity Level</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              >
                {Object.values(ActivityLevel).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Timeline: <span className="text-indigo-600 font-bold">{formData.timeline} Months</span>
            </label>
            <input
              type="range"
              name="timeline"
              min="1"
              max="12"
              step="1"
              value={formData.timeline}
              onChange={handleInputChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>1 Month</span>
              <span>6 Months</span>
              <span>1 Year</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Additional Preferences or Injuries</label>
            <textarea
              name="additionalInfo"
              placeholder="E.g., Vegetarian diet, bad knees, prefer home workouts..."
              value={formData.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating Plan...
              </>
            ) : (
              <>
                Generate My Plan
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
