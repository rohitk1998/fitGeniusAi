import React, { useState, useEffect } from 'react';
import { HeartPulse, Target, Clock, Dumbbell } from 'lucide-react';

type AnswerMap = Record<string, string>;

interface OnboardingStoryProps {
  onComplete: () => void;
}

interface StorySlide {
  id: string;
  icon: React.ReactNode;
  label: string;
  question: string;
  helper?: string;
  options: string[];
}

const STORAGE_KEY = 'fitaura_onboarding';
const STORAGE_DONE_KEY = 'fitaura_onboarding_complete';

const slides: StorySlide[] = [
  {
    id: 'primaryGoal',
    icon: <Target className="text-indigo-400" size={24} />,
    label: 'Primary Goal',
    question: 'What do you want FitAura to prioritize for you?',
    helper: 'This sets how we score your training and nutrition.',
    options: ['Lose fat', 'Build muscle', 'Recomp / tone', 'Performance & energy'],
  },
  {
    id: 'experience',
    icon: <Dumbbell className="text-emerald-400" size={24} />,
    label: 'Training Experience',
    question: 'How experienced are you with structured training?',
    helper: 'We will tune intensity and complexity based on this.',
    options: ['New to it', 'Some experience', 'Train consistently', 'Athlete level'],
  },
  {
    id: 'timePerWeek',
    icon: <Clock className="text-amber-400" size={24} />,
    label: 'Time Budget',
    question: 'How many days per week can you realistically commit?',
    helper: 'Be honest—consistency beats perfection.',
    options: ['2–3 days', '3–4 days', '5+ days'],
  },
  {
    id: 'biggestStruggle',
    icon: <HeartPulse className="text-rose-400" size={24} />,
    label: 'Biggest Struggle',
    question: 'What has held you back the most so far?',
    helper: 'Helps the AI coach prioritize support.',
    options: ['Motivation', 'Time & schedule', 'Nutrition habits', 'Injuries / pain'],
  },
];

const OnboardingStory: React.FC<OnboardingStoryProps> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as AnswerMap) : {};
    } catch {
      return {};
    }
  });

  const slide = slides[current];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore
    }
  }, [answers]);

  const handleSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [slide.id]: value }));

    // Auto-advance like a storyboard
    if (current < slides.length - 1) {
      setTimeout(() => {
        setCurrent(prev => Math.min(prev + 1, slides.length - 1));
      }, 220);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...answers, [slide.id]: value }));
        localStorage.setItem(STORAGE_DONE_KEY, 'true');
      } catch {
        // ignore
      }
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex bg-slate-950 text-slate-50">
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-slate-800 flex items-center justify-center">
              {slide.icon}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {slide.label}
              </p>
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-50 mb-2">
            {slide.question}
          </h2>
          {slide.helper && (
            <p className="text-xs sm:text-sm text-slate-400 mb-4">{slide.helper}</p>
          )}

        <div className="flex flex-col gap-2 mt-4">
          {slide.options.map(option => {
            const selected = answers[slide.id] === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${
                  selected
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-900'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStory;

