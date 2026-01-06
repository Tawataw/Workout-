import React from 'react';
import { UserProgress } from '../types';
import { Flame, Activity, ArrowRight, Calendar } from 'lucide-react';

interface HomeProps {
  progress: UserProgress;
  userName: string;
  onNavigate: (view: 'workouts' | 'progression') => void;
}

const Home: React.FC<HomeProps> = ({ progress, userName, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white brand-font mb-2">
            WELCOME BACK, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{userName.toUpperCase()}</span>
        </h1>
        <p className="text-slate-400 text-lg">Your journey to greatness continues today.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-orange-500">
                <Flame size={120} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 text-orange-400 font-bold tracking-wider text-sm">
                    <Flame size={16} /> CURRENT STREAK
                </div>
                <div className="text-6xl font-black text-white brand-font">
                    {progress.streak} <span className="text-2xl text-slate-500 font-normal">DAYS</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">Keep the fire burning!</p>
            </div>
        </div>

        <button 
            onClick={() => onNavigate('workouts')}
            className="group bg-cyan-900/20 hover:bg-cyan-900/30 p-6 rounded-3xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all text-left relative overflow-hidden"
        >
             <div className="absolute top-0 right-0 p-4 opacity-20 text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                <Activity size={120} />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold tracking-wider text-sm">
                        <Calendar size={16} /> TODAY'S PLAN
                    </div>
                    <div className="text-3xl font-bold text-white brand-font mb-1">
                        CONTINUE TRAINING
                    </div>
                    <p className="text-slate-300 text-sm">Week {progress.currentWeek} • Ready to crush it?</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-cyan-400 font-bold group-hover:translate-x-2 transition-transform">
                    GO TO WORKOUTS <ArrowRight size={20} />
                </div>
            </div>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
            onClick={() => onNavigate('progression')}
            className="bg-slate-800/50 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-3 transition-colors py-8"
        >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Activity size={24} />
            </div>
            <span className="font-bold text-slate-300">Check Progression</span>
        </button>
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex flex-col items-center justify-center gap-3 py-8 opacity-75">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <div className="font-black">7</div>
            </div>
            <span className="font-bold text-slate-300">Week {progress.currentWeek}</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
