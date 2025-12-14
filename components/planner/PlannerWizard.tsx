
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Brain, Target, Activity, Dumbbell, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { UserProfile, GoalType, Gender, ExperienceLevel, ActivityLevel, FitnessResponse } from '../../types';
import { generateFitnessPlan } from '../../services/geminiService';
import GeneratingView from './GeneratingView';

interface PlannerWizardProps {
  onBack: () => void;
  onComplete: (plan: FitnessResponse) => void;
  onLogActivity: () => void;
}

const PlannerWizard: React.FC<PlannerWizardProps> = ({ onBack, onComplete, onLogActivity }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<UserProfile>({
    goal: GoalType.GAIN_MUSCLE,
    timeline: '16 weeks',
    quantifiableTarget: 'Gain 4kg muscle',
    age: 25,
    gender: Gender.MALE,
    height: 175,
    weight: 70,
    bodyFat: '15%',
    dietaryRestrictions: 'None',
    medicalConditions: 'None',
    experience: ExperienceLevel.INTERMEDIATE,
    frequency: 4,
    equipment: 'Commercial Gym',
    workoutSplit: 'Upper/Lower',
    cardioPreference: 'HIIT',
    activityLevel: ActivityLevel.MODERATE,
    sleepHours: 7,
    stressLevel: 'Medium',
    minutesPerSession: 60,
    mealPrepStyle: 'Quick (under 30 mins)',
    cuisinePreference: 'Mediterranean'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (['age', 'height', 'weight', 'frequency', 'minutesPerSession', 'sleepHours'].includes(name))
        ? Number(value) 
        : value
    }));
  };

  const handleNextStep = () => { if (step < totalSteps) setStep(step + 1); };
  const handlePrevStep = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const plan = await generateFitnessPlan(formData);
      onLogActivity();
      onComplete(plan);
    } catch (err) {
      console.error(err);
      alert('Failed to generate plan. Please try again.'); // Simple error handling for now
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:scale-[1.01] md:focus:scale-[1.02] outline-none shadow-sm transition-all duration-300 placeholder:text-slate-400 hover:border-gray-300";
  const labelClasses = "block text-[10px] md:text-xs font-bold text-slate-500 uppercase mb-1.5 md:mb-2 ml-1 group-focus-within:text-indigo-600 transition-colors tracking-widest";
  const selectClasses = "w-full bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none shadow-sm transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300";

  const renderStepContent = () => {
    switch(step) {
      case 1: 
        return (
          <div className="w-full animate-in slide-in-from-right duration-500">
             <div className="text-center mb-8 md:mb-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                   <Target className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 md:mb-3 tracking-tight">Define Your Vision</h3>
                <p className="text-slate-500 text-sm md:text-lg">Where do you want to be in 6 months?</p>
             </div>
             <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start justify-center">
                <div className="flex-1 w-full group">
                   <label className={labelClasses}>Primary Goal</label>
                   <div className="relative">
                      <select name="goal" value={formData.goal} onChange={handleInputChange} className={selectClasses}>
                         {Object.values(GoalType).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={20} />
                   </div>
                </div>
                <div className="flex-1 w-full group">
                   <label className={labelClasses}>Timeline</label>
                   <input name="timeline" value={formData.timeline} onChange={handleInputChange} placeholder="e.g. 16 weeks" className={inputClasses} />
                </div>
                <div className="flex-1 w-full group">
                   <label className={labelClasses}>Exact Target</label>
                   <input name="quantifiableTarget" value={formData.quantifiableTarget} onChange={handleInputChange} placeholder="e.g. -5% Body Fat" className={inputClasses} />
                </div>
             </div>
          </div>
        );
      case 2: return (
        <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                <Activity className="w-8 h-8 md:w-10 md:h-10 text-rose-600" />
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 md:mb-3 tracking-tight">Biological Profile</h3>
            <p className="text-slate-500 text-sm md:text-lg">Calibrating macros to your metabolism.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                    <label className={labelClasses}>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} className={inputClasses} />
                    </div>
                    <div className="group">
                    <label className={labelClasses}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className={selectClasses}>
                        {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                    <label className={labelClasses}>Height (cm)</label>
                    <input type="number" name="height" value={formData.height} onChange={handleInputChange} className={inputClasses} />
                    </div>
                    <div className="group">
                    <label className={labelClasses}>Weight (kg)</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className={inputClasses} />
                    </div>
                </div>
                <div className="group">
                    <label className={labelClasses}>Body Fat %</label>
                    <input name="bodyFat" value={formData.bodyFat} onChange={handleInputChange} className={inputClasses} />
                </div>
            </div>
            
            <div className="flex flex-col gap-4">
                <div className="flex-1 group">
                    <label className={labelClasses}>Medical / Injuries</label>
                    <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleInputChange} className={`${inputClasses} resize-none min-h-[100px] h-full`} placeholder="List any injuries..." />
                </div>
                <div className="group">
                    <label className={labelClasses}>Dietary Restrictions</label>
                    <input name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleInputChange} className={inputClasses} />
                </div>
            </div>
            </div>
        </div>
      );
      case 3: return (
        <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                <Dumbbell className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 md:mb-3 tracking-tight">Training Framework</h3>
            <p className="text-slate-500 text-sm md:text-lg">Structuring your weekly periodization.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="group">
                <label className={labelClasses}>Experience Level</label>
                <select name="experience" value={formData.experience} onChange={handleInputChange} className={selectClasses}>
                    {Object.values(ExperienceLevel).map(e => <option key={e} value={e}>{e}</option>)}
                </select>
            </div>
            <div className="group">
                <label className={labelClasses}>Frequency (Days/Week)</label>
                <input type="number" max="7" name="frequency" value={formData.frequency} onChange={handleInputChange} className={inputClasses} />
            </div>
            <div className="md:col-span-2 group">
                <label className={labelClasses}>Equipment Access</label>
                <input name="equipment" value={formData.equipment} onChange={handleInputChange} placeholder="e.g. Commercial Gym, Home Gym" className={inputClasses} />
            </div>
            <div className="group">
                <label className={labelClasses}>Preferred Split</label>
                <input name="workoutSplit" value={formData.workoutSplit} onChange={handleInputChange} placeholder="e.g. PPL, Upper/Lower" className={inputClasses} />
            </div>
            <div className="group">
                <label className={labelClasses}>Cardio Style</label>
                <input name="cardioPreference" value={formData.cardioPreference} onChange={handleInputChange} placeholder="e.g. HIIT, Running" className={inputClasses} />
            </div>
            </div>
        </div>
      );
      case 4: return (
        <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 mb-2 md:mb-3 tracking-tight">Lifestyle Integration</h3>
            <p className="text-slate-500 text-sm md:text-lg">Fitting fitness into your reality.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-2 group">
                <label className={labelClasses}>Daily Activity Level</label>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className={selectClasses}>
                    {Object.values(ActivityLevel).map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>
            <div className="group">
                <label className={labelClasses}>Sleep (Hrs)</label>
                <input type="number" name="sleepHours" value={formData.sleepHours} onChange={handleInputChange} className={inputClasses} />
            </div>
            <div className="group">
                <label className={labelClasses}>Stress Level</label>
                <select name="stressLevel" value={formData.stressLevel} onChange={handleInputChange} className={selectClasses}>
                    {['Low', 'Medium', 'High'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="group">
                <label className={labelClasses}>Session Duration (Mins)</label>
                <input type="number" name="minutesPerSession" value={formData.minutesPerSession} onChange={handleInputChange} className={inputClasses} />
            </div>
            <div className="group">
                <label className={labelClasses}>Cuisine Preference</label>
                <input name="cuisinePreference" value={formData.cuisinePreference} onChange={handleInputChange} className={inputClasses} />
            </div>
            <div className="md:col-span-2 group">
                <label className={labelClasses}>Meal Prep Style</label>
                <input name="mealPrepStyle" value={formData.mealPrepStyle} onChange={handleInputChange} placeholder="e.g. Bulk prep Sundays" className={inputClasses} />
            </div>
            </div>
        </div>
      );
      default: return null;
    }
  };

  if (loading) return <GeneratingView />;

  return (
    <div className="flex-1 relative z-10 flex flex-col h-full bg-white overflow-hidden">
        {/* TOP BAR */}
        <div className="flex-none flex items-center justify-between p-4 md:p-8 z-20 bg-white/80 backdrop-blur-sm sticky top-0">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-all hover:bg-gray-100 px-4 py-2 rounded-full text-sm md:text-base"
            >
                <ArrowLeft size={18} /> Back
            </button>
            <div className="flex gap-2">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`h-1.5 w-8 md:w-12 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-600' : 'bg-gray-100'}`}></div>
                ))}
            </div>
        </div>

        {/* SCROLLABLE FORM CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 md:px-12 pb-24">
            <div className="min-h-full flex flex-col items-center justify-center py-8">
                <div className="w-full max-w-3xl">
                     {renderStepContent()}
                </div>
            </div>
        </div>

        {/* NAVIGATION FOOTER */}
        <div className="flex-none p-4 md:p-8 border-t border-gray-50 bg-white z-20 absolute bottom-0 inset-x-0">
             <div className="max-w-3xl mx-auto flex justify-between items-center">
                <button 
                    onClick={handlePrevStep}
                    disabled={step === 1}
                    className={`flex items-center gap-2 text-slate-400 font-bold px-4 py-3 md:px-6 rounded-xl hover:text-slate-900 hover:bg-gray-50 transition-all text-sm md:text-base ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                >
                    <ChevronLeft size={20} /> <span className="hidden md:inline">Previous</span>
                </button>

                {step < totalSteps ? (
                    <button 
                    onClick={handleNextStep}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 md:px-8 md:py-3 rounded-xl font-bold flex items-center gap-2 md:gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200 text-sm md:text-base"
                    >
                    Next Step <ChevronRight size={18} />
                    </button>
                ) : (
                    <button
                    onClick={handleSubmit}
                    className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 md:px-10 md:py-3 rounded-xl font-bold flex items-center gap-2 md:gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-200 text-sm md:text-base"
                    >
                    Generate <span className="hidden md:inline">Protocol</span> <Brain size={18} />
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default PlannerWizard;
