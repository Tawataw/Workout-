import React, { useState, useEffect } from 'react';
import { WORKOUT_SCHEDULE } from './constants';
import { UserProgress } from './types';
import Home from './components/Home';
import WorkoutList from './components/WorkoutList';
import Progression from './components/Progression';
import WorkoutFocus from './components/WorkoutFocus';
import { Dumbbell, Home as HomeIcon, List, BarChart3, RotateCcw } from 'lucide-react';

// Key for LocalStorage
const STORAGE_KEY = 'titanforged_progress_v1';
const USER_NAME = "Tawhid";

const INITIAL_PROGRESS: UserProgress = {
  currentWeek: 1,
  completedDays: [],
  completedExercises: {},
  streak: 0,
  lastWorkoutDate: null
};

type View = 'home' | 'workouts' | 'progression';

function App() {
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [view, setView] = useState<View>('home');
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved progress");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const activeDay = WORKOUT_SCHEDULE.find(d => d.id === activeDayId);

  const handleStartDay = (dayId: string) => {
    const day = WORKOUT_SCHEDULE.find(d => d.id === dayId);
    if (!day) return;
    
    // Check if we already have progress on this day to resume
    const done = progress.completedExercises[dayId] || [];
    
    if (day.isRestDay) {
        completeDay(dayId);
    } else if (done.length < day.exercises.length) {
        setActiveDayId(dayId);
        setActiveExerciseIndex(done.length); // Start at first incomplete
    } else {
        alert("Day already completed! Great job.");
    }
  };

  const completeExercise = () => {
    if (!activeDay || activeExerciseIndex === null) return;

    const exercise = activeDay.exercises[activeExerciseIndex];
    const todayStr = new Date().toDateString();
    
    const newCompleted = { ...progress.completedExercises };
    if (!newCompleted[activeDay.id]) newCompleted[activeDay.id] = [];
    newCompleted[activeDay.id].push(exercise.id);

    // Update progress
    let newStreak = progress.streak;
    if (progress.lastWorkoutDate !== todayStr) {
        newStreak += 1;
    }

    const updatedProgress = {
        ...progress,
        completedExercises: newCompleted,
        lastWorkoutDate: todayStr,
        streak: newStreak
    };

    setProgress(updatedProgress);

    // Check if day is finished
    if (activeExerciseIndex + 1 >= activeDay.exercises.length) {
        completeDay(activeDay.id, updatedProgress);
    } else {
        setActiveExerciseIndex(prev => (prev !== null ? prev + 1 : 0));
    }
  };

  const completeDay = (dayId: string, currentProgress = progress) => {
    const updatedDays = [...currentProgress.completedDays, dayId];
    
    // Check if week is finished (all 7 days done)
    const allDaysDone = WORKOUT_SCHEDULE.every(d => updatedDays.includes(d.id));

    if (allDaysDone) {
        // Reset for next week
        setProgress({
            ...currentProgress,
            currentWeek: currentProgress.currentWeek + 1,
            completedDays: [],
            completedExercises: {}
        });
        alert("WEEK COMPLETED! LEVEL UP!");
    } else {
        setProgress({
            ...currentProgress,
            completedDays: updatedDays
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    }

    // Close workout view
    setActiveDayId(null);
    setActiveExerciseIndex(null);
    setView('workouts'); // Return to list after finish
  };

  const handleReset = () => {
    if (confirm("Reset all progress? This cannot be undone.")) {
        setProgress(INITIAL_PROGRESS);
        setActiveDayId(null);
        setActiveExerciseIndex(null);
        setView('home');
    }
  };

  // 1. Workout Mode (Focus View) - Full Screen Overlay
  if (activeDay && activeExerciseIndex !== null && !activeDay.isRestDay) {
    const exercise = activeDay.exercises[activeExerciseIndex];
    return (
        <WorkoutFocus 
            exercise={exercise}
            totalExercises={activeDay.exercises.length}
            currentIndex={activeExerciseIndex}
            onComplete={completeExercise}
            onBack={() => {
                setActiveDayId(null);
                setActiveExerciseIndex(null);
            }}
        />
    );
  }

  // 2. Main Navigation Views
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500 selection:text-white pb-20 md:pb-0">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Dumbbell className="text-slate-900" size={20} />
                </div>
                <span className="text-xl font-black tracking-tighter text-white brand-font hidden md:block">TITAN<span className="text-cyan-500">FORGED</span></span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
                 <button onClick={() => setView('home')} className={`text-sm font-bold transition-colors ${view === 'home' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>HOME</button>
                 <button onClick={() => setView('workouts')} className={`text-sm font-bold transition-colors ${view === 'workouts' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>WORKOUTS</button>
                 <button onClick={() => setView('progression')} className={`text-sm font-bold transition-colors ${view === 'progression' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>PROGRESSION</button>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={handleReset}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors" 
                    title="Reset Progress"
                >
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-20">
        {view === 'home' && (
            <Home 
                progress={progress} 
                userName={USER_NAME}
                onNavigate={(v) => setView(v)} 
            />
        )}
        {view === 'workouts' && (
            <WorkoutList 
                schedule={WORKOUT_SCHEDULE} 
                progress={progress} 
                onSelectDay={handleStartDay} 
            />
        )}
        {view === 'progression' && (
            <Progression 
                schedule={WORKOUT_SCHEDULE} 
                progress={progress} 
            />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 w-full md:hidden bg-slate-900 border-t border-slate-800 z-40 pb-safe">
        <div className="flex justify-around items-center h-16">
            <button 
                onClick={() => setView('home')} 
                className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-cyan-400' : 'text-slate-500'}`}
            >
                <HomeIcon size={24} />
                <span className="text-[10px] font-bold">HOME</span>
            </button>
            <button 
                onClick={() => setView('workouts')} 
                className={`flex flex-col items-center gap-1 ${view === 'workouts' ? 'text-cyan-400' : 'text-slate-500'}`}
            >
                <List size={24} />
                <span className="text-[10px] font-bold">LIST</span>
            </button>
            <button 
                onClick={() => setView('progression')} 
                className={`flex flex-col items-center gap-1 ${view === 'progression' ? 'text-cyan-400' : 'text-slate-500'}`}
            >
                <BarChart3 size={24} />
                <span className="text-[10px] font-bold">STATS</span>
            </button>
        </div>
      </div>

      {/* Congratulations Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-black/80 absolute inset-0 backdrop-blur-sm"></div>
            <div className="relative z-10 text-center animate-bounce">
                <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 brand-font mb-4">
                    DAY COMPLETE
                </h2>
                <p className="text-white text-xl">Rest up, {USER_NAME}.</p>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;
