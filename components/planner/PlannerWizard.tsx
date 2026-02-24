import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Brain, Target, Activity, Dumbbell, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { UserProfile, GoalType, Gender, ExperienceLevel, ActivityLevel, FitnessResponse } from '../../types';
import { generateFitnessPlan } from '../../services/geminiService';
import GeneratingView from './GeneratingView';
import { GymMarquee } from './InfiniteMarquee';

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
      alert('Generation failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300";
  const labelClasses = "block text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-widest";
  const selectClasses = "w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer";

  const renderStepContent = () => {
    switch(step) {
      case 1: 
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Define Your Mission</h3>
                <p className="text-slate-500 text-lg">Let's set the coordinates for your transformation.</p>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 group">
                   <label className={labelClasses}>Primary Goal</label>
                   <select name="goal" value={formData.goal} onChange={handleInputChange} className={selectClasses}>
                      {Object.values(GoalType).map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                </div>
                <div className="group">
                   <label className={labelClasses}>Target Timeline</label>
                   <input name="timeline" value={formData.timeline} onChange={handleInputChange} placeholder="e.g. 16 weeks" className={inputClasses} />
                </div>
                <div className="group">
                   <label className={labelClasses}>Exact Quantitative Target</label>
                   <input name="quantifiableTarget" value={formData.quantifiableTarget} onChange={handleInputChange} placeholder="e.g. Lose 5kg" className={inputClasses} />
                </div>
             </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Biological Profile</h3>
                <p className="text-slate-500 text-lg">Calibrating macros to your unique metabolism.</p>
             </div>
             <div className="grid grid-cols-3 gap-6">
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
                <div className="group">
                   <label className={labelClasses}>Body Fat %</label>
                   <input name="bodyFat" value={formData.bodyFat} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="group">
                   <label className={labelClasses}>Height (cm)</label>
                   <input type="number" name="height" value={formData.height} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="group">
                   <label className={labelClasses}>Weight (kg)</label>
                   <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="group">
                   <label className={labelClasses}>Daily Activity</label>
                   <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className={selectClasses}>
                      {Object.values(ActivityLevel).map(a => <option key={a} value={a}>{a}</option>)}
                   </select>
                </div>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Training Context</h3>
                <p className="text-slate-500 text-lg">Where and how will you be training?</p>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="group">
                   <label className={labelClasses}>Experience</label>
                   <select name="experience" value={formData.experience} onChange={handleInputChange} className={selectClasses}>
                      {Object.values(ExperienceLevel).map(e => <option key={e} value={e}>{e}</option>)}
                   </select>
                </div>
                <div className="group">
                   <label className={labelClasses}>Days Per Week</label>
                   <input type="number" max="7" name="frequency" value={formData.frequency} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="col-span-2 group">
                   <label className={labelClasses}>Equipment Access</label>
                   <input name="equipment" value={formData.equipment} onChange={handleInputChange} placeholder="e.g. Commercial Gym" className={inputClasses} />
                </div>
             </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="space-y-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">Lifestyle Guardrails</h3>
                <p className="text-slate-500 text-lg">Fitting the protocol into your professional life.</p>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="group">
                   <label className={labelClasses}>Session Duration (mins)</label>
                   <input type="number" name="minutesPerSession" value={formData.minutesPerSession} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div className="group">
                   <label className={labelClasses}>Stress Levels</label>
                   <select name="stressLevel" value={formData.stressLevel} onChange={handleInputChange} className={selectClasses}>
                      {['Low', 'Medium', 'High'].map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
                <div className="col-span-2 group">
                   <label className={labelClasses}>Cuisine & Dietary Style</label>
                   <input name="cuisinePreference" value={formData.cuisinePreference} onChange={handleInputChange} placeholder="e.g. Mediterranean / High Protein" className={inputClasses} />
                </div>
             </div>
          </div>
        );
      default: return null;
    }
  };

  if (loading) return <GeneratingView />;

  return (
    <div className="h-full w-full flex overflow-hidden">
        
        {/* Left: Interactive Form (Scrollable) */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative border-r border-slate-100">
            <div className="flex-none p-12 flex justify-between items-center">
               <button onClick={onBack} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors">
                  <ArrowLeft size={20} />
               </button>
               <div className="flex gap-2">
                  {[1, 2, 3, 4].map(s => (
                     <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
                  ))}
               </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-24 py-12">
               <div className="max-w-2xl mx-auto">
                  {renderStepContent()}
               </div>
            </div>

            <div className="flex-none p-12 border-t border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-md">
               <button 
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  className={`px-8 py-4 font-bold text-slate-400 hover:text-slate-900 transition-all ${step === 1 ? 'opacity-0' : ''}`}
               >
                  Go Back
               </button>

               {step < totalSteps ? (
                  <button onClick={handleNextStep} className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                     Continue <ChevronRight size={18} />
                  </button>
               ) : (
                  <button onClick={handleSubmit} className="px-16 py-5 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                     Generate Protocol <Brain size={20} />
                  </button>
               )}
            </div>
        </div>

        {/* Right: Visual Marquee (Aesthetics) */}
        <GymMarquee />
    </div>
  );
};

export default PlannerWizard;