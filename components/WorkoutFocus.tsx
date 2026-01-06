import React from 'react';
import { Exercise } from '../types';
import { ArrowRight, CheckCircle, Activity, ChevronLeft, Cpu, Zap } from 'lucide-react';

interface WorkoutFocusProps {
  exercise: Exercise;
  onComplete: () => void;
  onBack: () => void;
  totalExercises: number;
  currentIndex: number;
}

const WorkoutFocus: React.FC<WorkoutFocusProps> = ({ exercise, onComplete, onBack, totalExercises, currentIndex }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex-none flex items-center justify-between p-4 md:p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-600"
            >
                <ChevronLeft size={24} />
            </button>
            <div>
                <h2 className="text-xl md:text-2xl font-bold brand-font text-cyan-400 leading-tight">{exercise.name}</h2>
                <p className="text-slate-400 text-xs md:text-sm">
                    Sequence {currentIndex + 1}/{totalExercises} • {exercise.category}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Cpu className="text-cyan-500 animate-pulse" size={18} />
            <span className="text-xs font-mono text-cyan-500 hidden md:block">SYSTEM ACTIVE</span>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-slate-950 relative">
        <div className="min-h-full flex flex-col lg:flex-row">
            
            {/* Visualizer / Hologram Section */}
            <div className="relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-auto bg-slate-900/50 flex flex-col items-center justify-center p-8 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        perspective: '1000px',
                        transform: 'rotateX(60deg) scale(1.5) translateY(-20%)'
                    }}>
                </div>

                {/* Holographic Circle */}
                <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-4 rounded-full border border-cyan-400/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                    
                    {/* Center Icon */}
                    <div className="flex flex-col items-center text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                        <Activity size={80} strokeWidth={1} />
                        <span className="mt-4 text-2xl font-black brand-font tracking-widest">FOCUS</span>
                    </div>
                </div>

                <div className="mt-8 text-center relative z-10">
                    <h3 className="text-white text-lg font-bold mb-2 flex items-center justify-center gap-2">
                        <Zap size={16} className="text-yellow-400" />
                        Target Muscle: {exercise.category}
                    </h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto">
                        Visual feed disabled. Follow the neural link protocol displayed in the data panel.
                    </p>
                </div>
            </div>

            {/* Controls & Details Section */}
            <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center bg-slate-950 relative">
                <div className="max-w-xl mx-auto w-full">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Activity />
                            </div>
                            <span className="text-slate-400 text-xs font-bold tracking-wider uppercase">Sets</span>
                            <div className="text-4xl md:text-5xl font-black text-white brand-font mt-2">{exercise.sets}</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                             <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Zap />
                            </div>
                            <span className="text-slate-400 text-xs font-bold tracking-wider uppercase">Target</span>
                            <div className="text-2xl md:text-3xl font-black text-cyan-400 brand-font mt-2 break-words">{exercise.repsOrDuration}</div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm mb-10">
                        <h4 className="text-white font-bold mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            EXECUTION PROTOCOL
                        </h4>
                        <ul className="space-y-6">
                            {exercise.instructions.map((inst, idx) => (
                                <li key={idx} className="flex gap-4 text-slate-300">
                                    <span className="flex-none flex items-center justify-center w-6 h-6 rounded bg-slate-800 text-cyan-400 text-xs font-bold border border-slate-700">
                                        {idx + 1}
                                    </span>
                                    <span className="leading-relaxed">{inst}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Complete Button */}
                    <button 
                        onClick={onComplete}
                        className="w-full py-5 md:py-6 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xl tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] transform transition-all hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-4 group"
                    >
                        <span>Mark Completed</span>
                        <CheckCircle className="group-hover:scale-110 transition-transform" />
                    </button>
                    
                    <div className="mt-6 text-center">
                        <button onClick={onBack} className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
                            Cancel & Return to List
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutFocus;
