
import React from 'react';

interface FloatingNavProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

const menuItems = [
  { id: 'planner', label: 'Workout Plan' },
  { id: 'tracker', label: 'Nutrition' },
  { id: 'sleep', label: 'Sleep Lab' },
  { id: 'stats', label: 'Analytics' }
];

const FloatingNav: React.FC<FloatingNavProps> = ({ activeSection, onNavigate }) => {
  return (
    <div className="sticky top-6 z-50 flex justify-center w-full pointer-events-none mb-8">
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-2 flex items-center overflow-x-auto max-w-[95vw] no-scrollbar gap-1 mx-2">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    px-4 md:px-6 py-2.5 rounded-full text-sm md:text-base font-bold transition-all duration-300 whitespace-nowrap
                    ${activeSection === item.id 
                      ? 'bg-slate-900 text-white shadow-lg transform scale-105' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-gray-100'
                    }
                  `}
              >
                  {item.label}
              </button>
              {/* Divider: Only show if next item exists and neither this nor next item is active */}
              {index < menuItems.length - 1 && activeSection !== item.id && activeSection !== menuItems[index+1].id && (
                  <div className="h-4 w-px bg-gray-300 mx-1 flex-shrink-0 opacity-50"></div>
              )}
            </React.Fragment>
          ))}
      </div>
    </div>
  );
};

export default FloatingNav;
