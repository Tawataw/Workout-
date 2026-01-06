import React from 'react';
import { DayRoutine, UserProgress } from '../types';
import { Lock, Unlock, Check } from 'lucide-react';

interface WorkoutListProps {
  schedule: DayRoutine[];
  progress: UserProgress;
  onSelectDay: (dayId: string) => void;
}

const WorkoutList: React.FC<WorkoutListProps> = ({ schedule, progress, onSelectDay }) => {
  const isDayLocked = (index: number) => {
    if (index === 0) return false;
    const prevDayId = schedule[index - 1].id;
    return !progress.completedDays.includes(prevDayId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 animate-fade-in">
       <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white brand-font">
                <span className="text-cyan-500">WEEK {progress.currentWeek}</span> PROTOCOL
            </h2>
            <div className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded">
                STATUS: ACTIVE
            </div>
       </div>
      
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

export default WorkoutList;
