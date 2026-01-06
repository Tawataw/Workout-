import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DayRoutine, UserProgress } from '../types';
import { Lock, Unlock, Check, Trophy, Flame } from 'lucide-react';

interface DashboardProps {
  schedule: DayRoutine[];
  progress: UserProgress;
  onSelectDay: (dayId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ schedule, progress, onSelectDay }) => {
  // Calculate stats
  const totalCompleted = Object.values(progress.completedExercises).flat().length;
  const completedDaysCount = progress.completedDays.length;
  
  const chartData = schedule.map(day => ({
    name: day.dayName.substring(0, 3),
    exercises: day.exercises.length,
    completed: progress.completedExercises[day.id]?.length || 0
  }));

  const isDayLocked = (index: number) => {
    // If it's day 1 (index 0), it's never locked if progress is 0.
    // Otherwise, previous day must be in completedDays
    if (index === 0) return false;
    const prevDayId = schedule[index - 1].id;
    return !progress.completedDays.includes(prevDayId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame size={80} />
            </div>
            <h3 className="text-slate-400 font-bold text-sm tracking-wider mb-2">WEEKLY STREAK</h3>
            <div className="text-4xl font-black text-white brand-font flex items-end gap-2">
                {progress.streak} <span className="text-lg text-slate-500 font-normal mb-1">DAYS</span>
            </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy size={80} />
            </div>
            <h3 className="text-slate-400 font-bold text-sm tracking-wider mb-2">TOTAL REPS COMPLETED</h3>
            <div className="text-4xl font-black text-cyan-400 brand-font flex items-end gap-2">
                {totalCompleted} <span className="text-lg text-slate-500 font-normal mb-1">UNITS</span>
            </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
             <h3 className="text-slate-400 font-bold text-sm tracking-wider mb-4">WEEKLY PROGRESS</h3>
             <div className="h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{fill: 'transparent'}}
                        />
                        <Bar dataKey="completed" radius={[4, 4, 4, 4]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.completed === entry.exercises && entry.exercises > 0 ? '#10b981' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

      {/* Week Grid */}
      <h2 className="text-2xl font-bold text-white mb-6 brand-font flex items-center gap-3">
        <span className="text-cyan-500">WEEK {progress.currentWeek}</span> SCHEDULE
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedule.map((day, index) => {
          const locked = isDayLocked(index);
          const isComplete = progress.completedDays.includes(day.id);
          const completedCount = progress.completedExercises[day.id]?.length || 0;
          const totalCount = day.exercises.length;
          const isToday = !locked && !isComplete && (index === 0 || progress.completedDays.includes(schedule[index-1].id));

          return (
            <button
              key={day.id}
              disabled={locked}
              onClick={() => onSelectDay(day.id)}
              className={`relative overflow-hidden text-left p-6 rounded-3xl border transition-all duration-300 group
                ${locked 
                  ? 'bg-slate-900 border-slate-800 opacity-60 cursor-not-allowed grayscale' 
                  : isComplete 
                    ? 'bg-slate-900/80 border-green-500/50 hover:border-green-400' 
                    : isToday
                        ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                        : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }
              `}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded mb-2 inline-block
                        ${day.isRestDay ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-300'}
                    `}>
                        DAY {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-white brand-font">{day.dayName}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${locked ? 'bg-slate-800 text-slate-600' : isComplete ? 'bg-green-500 text-slate-900' : 'bg-cyan-500/20 text-cyan-400'}
                `}>
                    {locked ? <Lock size={18} /> : isComplete ? <Check size={20} strokeWidth={3} /> : <Unlock size={18} />}
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-medium mb-4 h-10 line-clamp-2">{day.focus}</p>
                
                {!day.isRestDay && (
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${isComplete ? 'bg-green-500' : 'bg-cyan-500'}`}
                            style={{ width: `${(completedCount / totalCount) * 100}%` }}
                        ></div>
                    </div>
                )}
                {!day.isRestDay && (
                    <p className="text-xs text-slate-500 mt-2 text-right">{completedCount}/{totalCount} completed</p>
                )}
              </div>

              {/* Background Decoration */}
              {!locked && (
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
