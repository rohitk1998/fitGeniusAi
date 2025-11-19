import React from 'react';
import { FitnessResponse } from '../types';
import { 
  Utensils, 
  TrendingUp, 
  Calendar,
  Dumbbell,
  Clock
} from 'lucide-react';

interface ResultViewProps {
  data: FitnessResponse;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ data, onReset }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-4">Your Personalized Plan</h2>
            <p className="text-indigo-50 text-lg leading-relaxed max-w-3xl">
              {data.summary}
            </p>
          </div>
          <button 
            onClick={onReset}
            className="shrink-0 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg backdrop-blur-sm transition-colors font-medium border border-white/20"
          >
            Create New Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nutrition Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <Utensils size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Nutrition Strategy</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Calories</p>
              <p className="text-2xl font-extrabold text-slate-800">{data.nutrition.dailyCalories}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Protein</p>
              <p className="text-2xl font-extrabold text-slate-800">{data.nutrition.protein}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Carbs</p>
              <p className="text-2xl font-extrabold text-slate-800">{data.nutrition.carbs}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fats</p>
              <p className="text-2xl font-extrabold text-slate-800">{data.nutrition.fats}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Recommended Foods
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.nutrition.keyFoods.map((food, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full font-medium border border-green-100">
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Progress Timeline</h3>
          </div>
          
          <div className="space-y-6">
            {data.milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-4 items-start relative">
                {idx !== data.milestones.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-[-24px] w-0.5 bg-slate-100"></div>
                )}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center font-bold border border-blue-100 shadow-sm z-10">
                  <span className="text-[10px] uppercase font-medium text-blue-400">Mo</span>
                  <span className="leading-none">{milestone.month}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{milestone.expectedResult}</p>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Calendar size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Weekly Workout Schedule</h3>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {data.weeklySchedule.map((dayPlan, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden hover:border-purple-200 transition-colors">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
                <h4 className="font-bold text-slate-800">{dayPlan.day}</h4>
                <span className="text-xs font-medium px-2 py-1 bg-white rounded-md border border-slate-200 text-slate-500">
                  {dayPlan.focus}
                </span>
              </div>
              <div className="p-4">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-white border-b border-slate-50">
                    <tr>
                      <th className="py-2 pl-2 font-medium">Exercise</th>
                      <th className="py-2 font-medium w-16">Sets</th>
                      <th className="py-2 font-medium w-16">Reps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {dayPlan.exercises.map((exercise, exIdx) => (
                      <tr key={exIdx} className="hover:bg-slate-50/50">
                        <td className="py-3 pl-2 font-medium text-slate-700 flex items-center gap-2">
                          <Dumbbell size={14} className="text-purple-400" />
                          {exercise.exercise}
                        </td>
                        <td className="py-3 text-slate-500">{exercise.sets}</td>
                        <td className="py-3 text-slate-500">{exercise.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultView;
