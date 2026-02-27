import { type FC, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { OnboardingStory, PreviewScreen } from '../routes/routes';
import splashVideo from '../assets/splash_video.mp4';

const SplashScreen: FC = () => {
  const navigate = useNavigate();
  const isDone = useAppSelector((s) => s.onboarding.isDone);
  const [phase, setPhase] = useState<'visible' | 'exiting'>('visible');
  const hasFinished = useRef(false);

  const finish = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setPhase('exiting');
  };

  useEffect(() => {
    OnboardingStory.preload();
    PreviewScreen.preload();
    const timer = setTimeout(finish, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const timer = setTimeout(() => {
      navigate(isDone ? '/preview' : '/onboarding');
    }, 400);
    return () => clearTimeout(timer);
  }, [phase, isDone, navigate]);

  return (
    <button
      type="button"
      onClick={finish}
      className={`
        fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-default
        transition-opacity duration-400 ease-out
        ${phase === 'exiting' ? 'opacity-0' : 'opacity-100'}
      `}
      aria-label="Splash screen"
      aria-hidden={phase === 'exiting'}
    >
      {/* Fullscreen video background */}
      <video
        src={splashVideo}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Logo + text overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <h1
          className={`
            text-4xl sm:text-5xl font-black tracking-tight text-white mb-2
            transition-all duration-700 ease-out delay-150
            ${phase === 'visible' ? 'splash-text-enter' : 'splash-text-exit'}
          `}
        >
          FitAura<span className="text-indigo-400">.AI</span>
        </h1>
        <p
          className={`
            text-slate-300 font-medium text-sm sm:text-base tracking-wide
            transition-all duration-700 ease-out delay-300
            ${phase === 'visible' ? 'splash-text-enter' : 'splash-text-exit'}
          `}
        >
          Your biological edge
        </p>
        <div
          className={`
            mt-12 w-32 h-0.5 rounded-full bg-white/10 overflow-hidden
            transition-opacity duration-300 delay-500
            ${phase === 'visible' ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <div
            className="splash-progress h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-300"
            style={{ width: '0%' }}
          />
        </div>
      </div>
    </button>
  );
};

export default SplashScreen;
