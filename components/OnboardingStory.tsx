import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  VenusAndMars,
  Target,
  Activity,
  Ruler,
  Scale,
  ScaleIcon,
  Calendar,
  HeartPulse,
  Utensils,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAnswer, setStep, markDone } from '../store/onboardingSlice';

type SlideType = 'choice' | 'text' | 'height' | 'select';

interface StorySlideBase {
  id: string;
  icon: React.ReactNode;
  label: string;
  question: string;
  helper?: string;
}

interface StorySlideChoice extends StorySlideBase {
  type: 'choice';
  options: string[];
}

interface StorySlideText extends StorySlideBase {
  type: 'text';
  placeholder?: string;
}

interface StorySlideHeight extends StorySlideBase {
  type: 'height';
}

interface StorySlideSelect extends StorySlideBase {
  type: 'select';
  options: { value: string; label: string }[];
}

type StorySlide = StorySlideChoice | StorySlideText | StorySlideHeight | StorySlideSelect;

const FEET_OPTIONS = Array.from({ length: 4 }, (_, i) => (i + 4).toString());
const INCH_OPTIONS = Array.from({ length: 12 }, (_, i) => i.toString());
const WEIGHT_OPTIONS = Array.from({ length: 161 }, (_, i) => (i + 40).toString());
const AGE_OPTIONS = Array.from({ length: 68 }, (_, i) => (i + 13).toString());

const slides: StorySlide[] = [
  {
    id: 'name',
    type: 'text',
    icon: <User className="text-indigo-500" size={28} />,
    label: 'Your name',
    question: "What's your name?",
    helper: "We'll use this to personalize your plan.",
    placeholder: 'Enter your name',
  },
  {
    id: 'biologicalSex',
    type: 'choice',
    icon: <VenusAndMars className="text-rose-500" size={28} />,
    label: 'Biological sex',
    question: "What's your biological sex?",
    helper: 'Used for accurate calorie and macro estimates.',
    options: ['Male', 'Female', 'Prefer not to say'],
  },
  {
    id: 'lookingFor',
    type: 'choice',
    icon: <Target className="text-emerald-500" size={28} />,
    label: 'What you want',
    question: 'What are you looking for?',
    helper: 'Pick the one that best matches your goal.',
    options: [
      'Coach guidance',
      'Diet plan',
      'Weight loss',
      'Intermittent fasting',
      'Count calories',
      'Muscle gain',
    ],
  },
  {
    id: 'activityLevel',
    type: 'choice',
    icon: <Activity className="text-amber-500" size={28} />,
    label: 'Activity level',
    question: 'How active are you?',
    helper: 'Think about your typical week.',
    options: [
      'Sedentary (little or no exercise)',
      'Light (1–3 days/week)',
      'Moderate (3–5 days/week)',
      'Active (6–7 days/week)',
      'Very active (athlete / physical job)',
    ],
  },
  {
    id: 'height',
    type: 'height',
    icon: <Ruler className="text-blue-500" size={28} />,
    label: 'Height',
    question: 'How tall are you?',
    helper: 'Select your height in feet and inches.',
  },
  {
    id: 'currentWeight',
    type: 'select',
    icon: <Scale className="text-slate-500" size={28} />,
    label: 'Current weight',
    question: "What's your current weight?",
    helper: 'In kilograms.',
    options: WEIGHT_OPTIONS.map((n) => ({ value: n, label: `${n} kg` })),
  },
  {
    id: 'targetWeight',
    type: 'select',
    icon: <ScaleIcon className="text-indigo-500" size={28} />,
    label: 'Target weight',
    question: "What's your target weight?",
    helper: 'In kilograms.',
    options: WEIGHT_OPTIONS.map((n) => ({ value: n, label: `${n} kg` })),
  },
  {
    id: 'goalPace',
    type: 'choice',
    icon: <Calendar className="text-emerald-500" size={28} />,
    label: 'Goal pace',
    question: 'How fast do you want to reach your goal?',
    helper: 'Sustainable pace leads to better results.',
    options: ['4 weeks', '8 weeks', '12 weeks', '16 weeks', '6 months', 'No rush'],
  },
  {
    id: 'age',
    type: 'select',
    icon: <HeartPulse className="text-rose-500" size={28} />,
    label: 'Age',
    question: 'How old are you?',
    helper: 'Helps us tailor recommendations.',
    options: AGE_OPTIONS.map((n) => ({ value: n, label: `${n} years` })),
  },
  {
    id: 'dietaryNotes',
    type: 'choice',
    icon: <Utensils className="text-amber-500" size={28} />,
    label: 'Dietary preferences',
    question: 'Any dietary restrictions or preferences?',
    helper: 'Optional.',
    options: ['None', 'Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'Other'],
  },
];

const OnboardingStory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { answers, currentStep, isDone } = useAppSelector((s) => s.onboarding);

  useEffect(() => {
    if (isDone) {
      navigate('/preview');
    }
  }, [isDone, navigate]);

  const slide = slides[currentStep];
  const value = answers[slide.id] ?? '';

  const heightFeet = answers.height
    ? (answers.height.match(/^(\d+)ft/)?.[1] ?? FEET_OPTIONS[1])
    : FEET_OPTIONS[1];
  const heightInches = answers.height
    ? (answers.height.match(/(\d+)in$/)?.[1] ?? INCH_OPTIONS[0])
    : INCH_OPTIONS[0];

  useEffect(() => {
    const s = slides[currentStep];
    if (s.type !== 'select' || !('options' in s) || s.options.length === 0 || answers[s.id]) return;
    dispatch(setAnswer({ id: s.id, value: s.options[0].value }));
  }, [currentStep]);

  const goNext = () => {
    if (currentStep < slides.length - 1) {
      dispatch(setStep(currentStep + 1));
    } else {
      dispatch(markDone());
    }
  };

  const handleSelect = (val: string) => {
    dispatch(setAnswer({ id: slide.id, value: val }));
    if (slide.type === 'choice') {
      if (currentStep < slides.length - 1) {
        setTimeout(() => dispatch(setStep(currentStep + 1)), 220);
      } else {
        dispatch(markDone());
      }
    }
  };

  const handleHeightChange = (feet: string, inches: string) => {
    dispatch(setAnswer({ id: 'height', value: `${feet}ft ${inches}in` }));
  };

  const isOptional = slide.id === 'dietaryNotes';
  const canContinue =
    slide.type === 'choice' ||
    slide.type === 'select' ||
    slide.type === 'height' ||
    isOptional ||
    (slide.type === 'text' && value.trim().length > 0);

  const handleContinue = () => {
    if (!canContinue) return;
    if (slide.type === 'height' && !answers.height) {
      dispatch(setAnswer({ id: 'height', value: `${FEET_OPTIONS[1]}ft ${INCH_OPTIONS[0]}in` }));
    }
    goNext();
  };

  const selectClass =
    'w-full appearance-none bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl px-4 py-3.5 text-base font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 border-0';

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 safe-area-pb px-5 py-8 overflow-y-auto">
      <div className="flex flex-col items-center justify-center text-center w-full max-w-md mx-auto my-auto">
        <div className="w-14 h-14 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800 flex items-center justify-center mb-5">
          {slide.icon}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-2">
          {slide.label}
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2 max-w-sm">
          {slide.question}
        </h2>
        {slide.helper && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs mb-6">
            {slide.helper}
          </p>
        )}

        <div className="w-full text-left mt-2">
          {slide.type === 'choice' && (
            <div className="flex flex-col gap-2.5">
              {slide.options.map((option) => {
                const selected = value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all active:scale-[0.98] ${selected
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700'
                      }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {slide.type === 'text' && (
            <div className="space-y-3">
              <input
                type="text"
                value={value}
                onChange={(e) => dispatch(setAnswer({ id: slide.id, value: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                placeholder={slide.placeholder}
                autoFocus
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={handleContinue}
                disabled={!value.trim()}
                className="w-full py-3.5 rounded-xl bg-indigo-500 text-white text-[15px] font-semibold disabled:opacity-40 active:opacity-90"
              >
                Continue
              </button>
            </div>
          )}

          {slide.type === 'height' && (
            <div className="flex gap-3 items-center justify-center">
              <div className="flex-1 relative">
                <select
                  value={heightFeet}
                  onChange={(e) => handleHeightChange(e.target.value, heightInches)}
                  className={selectClass}
                  aria-label="Feet"
                >
                  {FEET_OPTIONS.map((ft) => (
                    <option key={ft} value={ft}>{ft} ft</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 relative">
                <select
                  value={heightInches}
                  onChange={(e) => handleHeightChange(heightFeet, e.target.value)}
                  className={selectClass}
                  aria-label="Inches"
                >
                  {INCH_OPTIONS.map((in_) => (
                    <option key={in_} value={in_}>{in_} in</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {slide.type === 'select' && (
            <div className="space-y-3">
              <select
                value={value || (slide.options[0]?.value ?? '')}
                onChange={(e) => dispatch(setAnswer({ id: slide.id, value: e.target.value }))}
                className={selectClass}
              >
                {slide.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-3.5 rounded-xl bg-indigo-500 text-white text-[15px] font-semibold active:opacity-90"
              >
                Continue
              </button>
            </div>
          )}

          {slide.type === 'height' && (
            <button
              type="button"
              onClick={handleContinue}
              className="mt-4 w-full py-3.5 rounded-xl bg-indigo-500 text-white text-[15px] font-semibold active:opacity-90"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingStory;
