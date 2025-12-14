
import React, { useState, useEffect } from 'react';
import { Moon, Battery, Activity, ArrowLeft, Loader2, Brain, Sparkles } from 'lucide-react';
import { SleepLog, RecoveryAnalysis } from '../types';
import { analyzeRecovery } from '../services/geminiService';

interface SleepTrackerProps {
  onBack: () => void;
  onLogActivity: (type: 'sleep') => void;
}

const SleepTracker: React.FC<SleepTrackerProps> = ({ onBack, onLogActivity }) => {
  const [logs, setLogs] = useState<SleepLog[]>(() => {
    const saved = localStorage.getItem('fitaura_sleep');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState({
    hours: 7,
    quality: 'Good' as const,
    soreness: 'Low' as const
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<RecoveryAnalysis | null>(null);

  useEffect(() => {
    localStorage.setItem('fitaura_sleep', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(l => l.date === today);
    if (todayLog && todayLog.readinessScore) {
       // logic to preload cached analysis if needed
    }
  }, [logs]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeRecovery(input.hours, input.quality, input.soreness);
      setLatestAnalysis(analysis);

      const newLog: SleepLog = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        hours: input.hours,
        quality: input.quality,
        soreness: input.soreness,
        readinessScore: analysis.readinessScore,
        aiFeedback: analysis.workoutAdjustment
      };

      const filteredLogs = logs.filter(l => l.date !== newLog.date);
      setLogs([newLog, ...filteredLogs]);
      onLogActivity('sleep');

    } catch (error) {
      console.error("Recovery analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRingColor = (score: number) => {
     if (score >= 80) return 'stroke-emerald-500';
     if (score >= 60) return 'stroke-yellow-500';
     return 'stroke-red-500';
  };

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex-none px-6 py-4 flex items-center gap-4 border-b border-gray-200 bg-white z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Recovery Lab <Moon size={18} className="text-indigo-500"/>
          </h2>
          <p className="text-xs text-slate-500">Sleep tracking & readiness analysis</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left: Input Module */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-8 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity size={18} className="text-indigo-500"/> Daily Input
              </h3>
              
              {/* Hours Slider */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                  <span className="text-indigo-600 font-bold text-lg">{input.hours} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="12" 
                  step="0.5" 
                  value={input.hours}
                  onChange={(e) => setInput({...input, hours: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Quality Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Sleep Quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Poor', 'Fair', 'Good', 'Excellent'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput({...input, quality: q as any})}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        input.quality === q 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                        : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Soreness Selector */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Muscle Soreness</label>
                <div className="grid grid-cols-4 gap-2">
                  {['None', 'Low', 'Medium', 'High'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput({...input, soreness: s as any})}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        input.soreness === s 
                        ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200' 
                        : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                Analyze Recovery
              </button>
            </div>
          </div>

          {/* Right: Analysis Result */}
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center shadow-sm">
               {!latestAnalysis && logs.length > 0 && logs[0].date === new Date().toISOString().split('T')[0] ? (
                   <div className="text-center">
                      <h4 className="text-slate-500 text-xs font-bold uppercase mb-4">Today's Readiness</h4>
                      <div className={`text-6xl font-bold mb-2 ${getScoreColor(logs[0].readinessScore || 0)}`}>
                        {logs[0].readinessScore}
                      </div>
                      <div className="text-slate-600 text-sm max-w-[200px] mx-auto">{logs[0].aiFeedback}</div>
                   </div>
               ) : latestAnalysis ? (
                 <div className="w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-slate-500 text-xs font-bold uppercase">Readiness Score</h4>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        latestAnalysis.recommendation === 'Push Hard' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        latestAnalysis.recommendation === 'Rest' ? 'bg-red-50 text-red-600 border-red-200' :
                        'bg-indigo-50 text-indigo-600 border-indigo-200'
                      }`}>
                        {latestAnalysis.recommendation}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="relative w-32 h-32 flex-shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="60" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                            <circle 
                              cx="64" cy="64" r="60" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="8"
                              strokeDasharray={377}
                              strokeDashoffset={377 - (377 * latestAnalysis.readinessScore) / 100}
                              className={`transition-all duration-1000 ${getRingColor(latestAnalysis.readinessScore)}`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-slate-800">
                            {latestAnalysis.readinessScore}
                          </div>
                       </div>
                       <div className="flex-1">
                         <p className="text-sm text-slate-600 mb-2 leading-relaxed">{latestAnalysis.summary}</p>
                         <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                            <div className="text-xs text-indigo-600 font-bold mb-1 flex items-center gap-1">
                              <Brain size={10} /> AI Adjustment
                            </div>
                            <p className="text-xs text-slate-700">{latestAnalysis.workoutAdjustment}</p>
                         </div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="text-center opacity-40">
                   <Battery size={48} className="mx-auto mb-2 text-slate-800"/>
                   <p className="text-sm text-slate-800">No data for today</p>
                 </div>
               )}
            </div>

            {/* History List */}
            <div className="bg-white border border-gray-200 rounded-3xl p-6 h-[250px] overflow-y-auto custom-scrollbar shadow-sm">
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 sticky top-0 bg-white py-2">Recent Logs</h4>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                       <div className={`w-2 h-10 rounded-full ${getScoreColor(log.readinessScore || 0).replace('text', 'bg')}`}></div>
                       <div>
                         <div className="text-sm text-slate-900 font-bold">{log.date}</div>
                         <div className="text-xs text-slate-500">{log.hours}h • {log.quality}</div>
                       </div>
                    </div>
                    <div className="text-lg font-bold text-slate-800 opacity-50">{log.readinessScore}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
