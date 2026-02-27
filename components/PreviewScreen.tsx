import { useEffect, useState, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Flame, Calendar, Target, ChevronRight, Loader2 } from 'lucide-react';
import { generateFitnessPlan } from '../services/geminiService';
import { mapOnboardingToProfile } from '../utils/mapOnboardingToProfile';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSigningIn, setPlan } from '../store/authSlice';

const SkeletonCard: FC = () => (
    <div className="animate-pulse space-y-3 bg-white/60 rounded-2xl p-4 border border-slate-100">
        <div className="h-3 bg-slate-200 rounded-full w-2/3" />
        <div className="h-3 bg-slate-200 rounded-full w-full" />
        <div className="h-3 bg-slate-200 rounded-full w-4/5" />
    </div>
);

const PreviewScreen: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { signingIn, plan } = useAppSelector((s) => s.auth);
    const answers = useAppSelector((s) => s.onboarding.answers);
    const { session, signInWithGoogle } = useAuth();

    const [generating, setGenerating] = useState(!plan);
    const [error, setError] = useState<string | null>(null);

    const userName = answers.name ? answers.name.split(' ')[0] : 'there';

    useEffect(() => {
        if (session) {
            navigate('/app/dashboard');
            return;
        }
    }, [session, navigate]);

    useEffect(() => {
        if (plan) {
            setGenerating(false);
            return;
        }

        const cached = localStorage.getItem('fitaura_auth_plan');
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                dispatch(setPlan(parsed));
                setGenerating(false);
                return;
            } catch { }
        }

        const profile = mapOnboardingToProfile(answers);
        generateFitnessPlan(profile)
            .then((result) => {
                dispatch(setPlan(result));
                localStorage.setItem('fitaura_auth_plan', JSON.stringify(result));
                setGenerating(false);
            })
            .catch(() => {
                setError('Could not generate your plan. Please try again.');
                setGenerating(false);
            });
    }, []);

    const handleSignIn = async () => {
        dispatch(setSigningIn(true));
        await signInWithGoogle();
    };

    return (
        <div className="fixed inset-0 z-[80] flex flex-col bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 overflow-y-auto safe-area-pb">
            <div className="flex items-center gap-2 px-6 pt-10 pb-2">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                    <Trophy size={18} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                    FitAura<span className="text-indigo-600">.AI</span>
                </span>
            </div>

            <div className="px-6 pt-6 pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    Hey {userName}, your plan<br />
                    <span className="text-indigo-600">is ready. 🎯</span>
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Here's a preview of what we built for you. Sign in to unlock the full experience.
                </p>
            </div>

            <div className="flex-1 px-5 pb-4 space-y-3">
                {generating ? (
                    <>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <p className="text-xs text-center text-slate-400 mt-1 animate-pulse">
                            Building your personalized plan…
                        </p>
                    </>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">
                        {error}
                    </div>
                ) : plan ? (
                    <>
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">Your Plan</p>
                            <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{plan.summary}</p>
                        </div>

                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <Flame size={16} className="text-orange-500" />
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Daily Nutrition</p>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {[
                                    { label: 'Calories', value: `${plan.nutrition.dailyCalories}` },
                                    { label: 'Protein', value: plan.nutrition.protein },
                                    { label: 'Carbs', value: plan.nutrition.carbs },
                                    { label: 'Fats', value: plan.nutrition.fats },
                                ].map((item) => (
                                    <div key={item.label} className="bg-slate-50 rounded-xl py-2 px-1">
                                        <p className="text-sm font-bold text-slate-800">{item.value}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {plan.weeklySchedule?.[0] && (
                            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar size={16} className="text-indigo-500" />
                                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                        {plan.weeklySchedule[0].day}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{plan.weeklySchedule[0].focus}</p>
                                <div className="space-y-1">
                                    {plan.weeklySchedule[0].exercises.slice(0, 3).map((ex, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 rounded-lg px-3 py-1.5">
                                            <span className="font-medium">{ex.exercise}</span>
                                            <span className="text-slate-400">{ex.sets} × {ex.reps}</span>
                                        </div>
                                    ))}
                                    {plan.weeklySchedule[0].exercises.length > 3 && (
                                        <p className="text-[11px] text-slate-400 text-center pt-0.5">
                                            +{plan.weeklySchedule[0].exercises.length - 3} more exercises
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {plan.milestones?.[0] && (
                            <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target size={16} className="text-indigo-600" />
                                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                                        Month 1 Milestone
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-slate-800">{plan.milestones[0].expectedResult}</p>
                                <p className="text-xs text-slate-500 mt-1">{plan.milestones[0].description}</p>
                                <p className="text-xs italic text-indigo-500 mt-2">"{plan.milestones[0].motivationalQuote}"</p>
                            </div>
                        )}
                    </>
                ) : null}
            </div>

            <div className="sticky bottom-0 px-5 pb-8 pt-3 bg-gradient-to-t from-slate-100 via-slate-100/90 to-transparent">
                <button
                    type="button"
                    onClick={handleSignIn}
                    disabled={signingIn}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl py-4 px-6 shadow-md hover:shadow-lg hover:border-indigo-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
                >
                    {signingIn ? (
                        <Loader2 size={20} className="animate-spin text-indigo-500" />
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    )}
                    <span className="text-sm font-semibold text-slate-800">
                        {signingIn ? 'Redirecting to Google…' : 'Continue with Google'}
                    </span>
                    {!signingIn && <ChevronRight size={16} className="text-slate-400 ml-auto" />}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                    Your plan is ready — sign in to start your journey
                </p>
            </div>
        </div>
    );
};

export default PreviewScreen;
