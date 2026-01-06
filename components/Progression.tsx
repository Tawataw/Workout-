import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DayRoutine, UserProgress } from '../types';
import { Trophy, Flame, Target } from 'lucide-react';

interface ProgressionProps {
  schedule: DayRoutine[];
  progress: UserProgress;
}

const Progression: React.FC<ProgressionProps> = ({ schedule, progress }) => {
  // Calculate stats
  const totalCompleted = Object.values(progress.completedExercises).flat().length;
  const completedDaysCount = progress.completedDays.length;
  
  const chartData = schedule.map(day => ({
    name: day.dayName.substring(0, 3),
    exercises: day.exercises.length,
    completed: progress.completedExercises[day.id]?.length || 0
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-8 brand-font flex items-center gap-3">
            <span className="text-blue-500">STATS</span> & ANALYTICS
        </h2>

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
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={80} />
            </div>
            <h3 className="text-slate-400 font-bold text-sm tracking-wider mb-2">COMPLETION RATE</h3>
            <div className="text-4xl font-black text-green-400 brand-font flex items-end gap-2">
                {Math.round((completedDaysCount / 7) * 100)}%
            </div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
             <h3 className="text-slate-400 font-bold text-sm tracking-wider mb-6">WEEKLY EXERCISE VOLUME</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{fill: '#1e293b'}}
                        />
                        <Bar dataKey="completed" radius={[6, 6, 0, 0]} animationDuration={1000}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.completed === entry.exercises && entry.exercises > 0 ? '#10b981' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
    </div>
  );
};

export default Progression;
