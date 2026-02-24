
import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, MoveDown } from 'lucide-react';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1541781777631-fa95371aad95?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1552674605-1e9474321dce?q=80&w=1600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1511295742362-92c96b504802?q=80&w=1600&auto=format&fit=crop"  
];

interface HeroSlideshowProps {
  onStart: () => void;
}

const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ onStart }) => {
  const [currentBg, setCurrentBg] = useState(0);
  const [prevBg, setPrevBg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevBg(currentBg);
      setCurrentBg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentBg]);

  return (
    <div id="hero" className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-black">
      {/* Background Slideshow */}
      {HERO_IMAGES.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out z-0`}
          style={{ 
            backgroundImage: `url(${img})`,
            opacity: index === currentBg ? 1 : 0,
            zIndex: index === currentBg ? 20 : (index === prevBg ? 10 : 0)
          }}
        />
      ))}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-30 pointer-events-none"></div>

      {/* Centered Content */}
      <div className="relative z-40 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
        <div className="mb-8 w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl animate-fade-in-up">
            <Activity size={64} className="text-white drop-shadow-lg" />
        </div>
        <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-6 leading-none drop-shadow-xl animate-fade-in-up">
            FitAura<span className="text-indigo-400">.AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-200 font-light tracking-wide max-w-2xl mb-12 animate-fade-in-up delay-100">
          Experience Optimization. <br/>
          <span className="text-white/60 text-lg">AI-driven protocols for training, nutrition, and recovery.</span>
        </p>
        <button 
          onClick={onStart}
          className="bg-white text-slate-900 hover:bg-indigo-50 px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-fade-in-up delay-200"
        >
          Start Your Transformation <ArrowRight size={20} />
        </button>
      </div>
      
      {/* Scroll Indicator */}
      <button 
        onClick={onStart}
        className="absolute bottom-10 z-40 animate-bounce text-white/50 flex flex-col items-center hover:text-white transition-colors"
      >
        <span className="text-xs uppercase tracking-[0.3em] mb-2">Explore Modules</span>
        <MoveDown size={24} />
      </button>
    </div>
  );
};

export default HeroSlideshow;
