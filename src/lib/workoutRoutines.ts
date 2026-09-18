import { ExerciseItem } from "@/components/portal/WorkoutPlayer";

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DailyRoutine {
  day: DayOfWeek;
  focus: string;
  exercises: ExerciseItem[];
}

export const WEEKLY_ROUTINE: DailyRoutine[] = [
  {
    day: 'Monday',
    focus: 'Chest & Triceps',
    exercises: [
      { id: 'm1', name: 'Incline Barbell Press', muscle: 'Chest', equipmentName: 'barbell', sets: 4, reps: '10', targetWeight: '60 kg', restSecs: 90, notes: 'Focus on the stretch.' },
      { id: 'm2', name: 'Flat Dumbbell Fly', muscle: 'Chest', equipmentName: 'dumbbells', sets: 3, reps: '12', targetWeight: '18 kg', restSecs: 60, notes: 'Keep elbows slightly bent.' },
      { id: 'm3', name: 'Tricep Rope Pushdown', muscle: 'Triceps', equipmentName: 'cable-machine', sets: 4, reps: '15', targetWeight: '40 kg', restSecs: 45, notes: 'Flare the rope at the bottom.' }
    ]
  },
  {
    day: 'Tuesday',
    focus: 'Back & Biceps',
    exercises: [
      { id: 't1', name: 'Deadlifts', muscle: 'Back', equipmentName: 'barbell', sets: 5, reps: '5', targetWeight: '100 kg', restSecs: 180, notes: 'Keep back flat.' },
      { id: 't2', name: 'Lat Pulldown', muscle: 'Back', equipmentName: 'lat-pulldown', sets: 4, reps: '12', targetWeight: '55 kg', restSecs: 90, notes: 'Pull to upper chest.' },
      { id: 't3', name: 'Barbell Curl', muscle: 'Biceps', equipmentName: 'barbell', sets: 4, reps: '10', targetWeight: '30 kg', restSecs: 60, notes: 'No swinging.' }
    ]
  },
  {
    day: 'Wednesday',
    focus: 'Legs & Core',
    exercises: [
      { id: 'w1', name: 'Barbell Squat', muscle: 'Legs', equipmentName: 'squat-rack', sets: 5, reps: '8', targetWeight: '80 kg', restSecs: 120, notes: 'Go below parallel.' },
      { id: 'w2', name: 'Leg Press', muscle: 'Legs', equipmentName: 'leg-press', sets: 4, reps: '12', targetWeight: '150 kg', restSecs: 90, notes: 'Don\'t lock knees.' },
      { id: 'w3', name: 'Plank', muscle: 'Core', equipmentName: 'bench-press', sets: 3, reps: '60s', targetWeight: '0 kg', restSecs: 60, notes: 'Keep core tight.' }
    ]
  },
  {
    day: 'Thursday',
    focus: 'Shoulders & Traps',
    exercises: [
      { id: 'th1', name: 'Military Press', muscle: 'Shoulders', equipmentName: 'barbell', sets: 4, reps: '8', targetWeight: '45 kg', restSecs: 90, notes: 'Core engaged.' },
      { id: 'th2', name: 'Lateral Raise', muscle: 'Shoulders', equipmentName: 'dumbbells', sets: 4, reps: '15', targetWeight: '10 kg', restSecs: 60, notes: 'Lead with elbows.' },
      { id: 'th3', name: 'Dumbbell Shrug', muscle: 'Traps', equipmentName: 'dumbbells', sets: 4, reps: '12', targetWeight: '30 kg', restSecs: 60, notes: 'Hold for 1s at top.' }
    ]
  },
  {
    day: 'Friday',
    focus: 'Arms & Forearms',
    exercises: [
      { id: 'f1', name: 'Skull Crushers', muscle: 'Triceps', equipmentName: 'barbell', sets: 4, reps: '10', targetWeight: '25 kg', restSecs: 60, notes: 'Elbows tucked.' },
      { id: 'f2', name: 'Preacher Curl', muscle: 'Biceps', equipmentName: 'barbell', sets: 4, reps: '12', targetWeight: '20 kg', restSecs: 60, notes: 'Full extension.' },
      { id: 'f3', name: 'Wrist Curl', muscle: 'Forearms', equipmentName: 'barbell', sets: 3, reps: '20', targetWeight: '15 kg', restSecs: 30, notes: 'High reps.' }
    ]
  },
  {
    day: 'Saturday',
    focus: 'Cardio & Mobility',
    exercises: [
      { id: 's1', name: 'Treadmill Run', muscle: 'Cardio', equipmentName: 'treadmill', sets: 1, reps: '20 min', targetWeight: '0 kg', restSecs: 0, notes: 'Maintain steady pace.' },
      { id: 's2', name: 'Burpees', muscle: 'Full Body', equipmentName: 'bench-press', sets: 4, reps: '15', targetWeight: '0 kg', restSecs: 60, notes: 'Explosive.' }
    ]
  }
];
