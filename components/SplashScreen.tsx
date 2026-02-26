import React, { useEffect, useRef, useState } from 'react';
interface SplashScreenProps {
  onFinish: () => void;
  minDuration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDuration = 2200,
}) => {
  const [phase, setPhase] = useState<'visible' | 'exiting'>('visible');
  const hasFinished = useRef(false);

  const finish = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setPhase('exiting');
  };

  useEffect(() => {
    const timer = setTimeout(finish, minDuration);
    return () => clearTimeout(timer);
  }, [minDuration]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const timer = setTimeout(onFinish, 400);
    return () => clearTimeout(timer);
  }, [phase, onFinish]);

  return (
    <button
      type="button"
      onClick={finish}
      className={`
        fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden cursor-default
        bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900
        transition-opacity duration-400 ease-out
        ${phase === 'exiting' ? 'opacity-0' : 'opacity-100'}
      `}
      aria-label="Splash screen"
      aria-hidden={phase === 'exiting'}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 45%, rgba(99, 102, 241, 0.35) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <h1
          className={`
            text-4xl sm:text-5xl font-black tracking-tight text-white mb-2
            transition-all duration-700 ease-out delay-150
            animate-fade-in
            ${phase === 'visible' ? 'splash-text-enter' : 'splash-text-exit'}
          `}
        >
          FitAura<span className="text-indigo-400">.AI</span>
        </h1>
        <p
          className={`
            text-slate-400 font-medium text-sm sm:text-base tracking-wide
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
