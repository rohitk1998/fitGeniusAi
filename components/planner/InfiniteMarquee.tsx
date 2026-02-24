
import React from 'react';

const GYM_IMAGES_MARQUEE = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=600&auto=format&fit=crop"
];

const FOOD_IMAGES_MARQUEE = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=600&auto=format&fit=crop"
];

export const GymMarquee = () => (
    <div className="hidden lg:block w-72 xl:w-96 h-full relative overflow-hidden bg-white border-r border-gray-100 flex-shrink-0">
        <div className="w-full absolute top-0 left-0 animate-marquee-up flex flex-col pt-6">
            {GYM_IMAGES_MARQUEE.concat(GYM_IMAGES_MARQUEE).map((img, i) => (
                <div key={i} className="px-6 pb-8 w-full">
                    <div className="w-full h-auto aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-gray-100 relative group">
                        <img src={img} alt="Gym" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                    </div>
                </div>
            ))}
        </div>
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>
);

export const FoodMarquee = () => (
    <div className="hidden lg:block w-72 xl:w-96 h-full relative overflow-hidden bg-white border-l border-gray-100 flex-shrink-0">
        <div className="w-full absolute top-0 left-0 animate-marquee-down flex flex-col pt-6">
            {FOOD_IMAGES_MARQUEE.concat(FOOD_IMAGES_MARQUEE).map((img, i) => (
                <div key={i} className="px-6 pb-8 w-full">
                    <div className="w-full h-auto aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-gray-100 relative group">
                        <img src={img} alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                    </div>
                </div>
            ))}
        </div>
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent z-10"></div>
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>
);
