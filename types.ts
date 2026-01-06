export enum ExerciseType {
  RepBased = 'REP_BASED',
  TimeBased = 'TIME_BASED',
  Failure = 'FAILURE'
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repsOrDuration: string; // e.g. "15 reps", "1 min", "Fail"
  videoUrl?: string; // YouTube Embed URL
  category: string;
  instructions: string[];
}

export interface DayRoutine {
  id: string;
  dayName: string; // e.g., "Saturday", "Sunday"
  focus: string; // e.g., "Chest + Triceps"
  exercises: Exercise[];
  isRestDay: boolean;
}

export interface UserProgress {
  currentWeek: number;
  completedDays: string[]; // IDs of completed days
  completedExercises: {
    [dateKey: string]: string[]; // "2023-10-27": ["ex_1", "ex_2"]
  };
  streak: number;
  lastWorkoutDate: string | null;
}