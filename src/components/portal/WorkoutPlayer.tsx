"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Clock,
  Flame,
  Dumbbell,
  X,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { GymEquipment3D, EquipmentType } from "./GymEquipment3D";
import { FitnessAvatar3D, ExerciseDemoType } from "./FitnessAvatar3D";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export interface ExerciseItem {
  id: string;
  name: string;
  muscle: string;
  equipmentName: EquipmentType;
  sets: number;
  reps: string;
  targetWeight: string;
  restSecs: number;
  notes: string;
}

interface WorkoutPlayerProps {
  workoutName: string;
  dayName: string;
  exercises: ExerciseItem[];
  onClose: () => void;
  onWorkoutComplete: (summary: {
    durationSecs: number;
    completedExercises: number;
    totalSets: number;
  }) => void;
}

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  workoutName,
  dayName,
  exercises,
  onClose,
  onWorkoutComplete,
}) => {
  const { user, userData, updateUserData } = useAuth();

  // Exercise Navigation
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const activeEx = exercises[currentExIndex] || exercises[0];

  // Set Tracking: per exercise, array of completed sets { reps: number, weight: string }
  const [setTracking, setSetTracking] = useState<
    Record<string, { setNumber: number; reps: string; weight: string; completed: boolean }[]>
  >(() => {
    const initial: Record<string, any[]> = {};
    exercises.forEach((ex) => {
      const setsArr = [];
      for (let s = 1; s <= ex.sets; s++) {
        setsArr.push({
          setNumber: s,
          reps: ex.reps.split(",")[0]?.trim() || "10",
          weight: ex.targetWeight.replace(" kg", "") || "50",
          completed: false,
        });
      }
      initial[ex.id] = setsArr;
    });
    return initial;
  });

  // Overall Workout Timer
  const [workoutElapsed, setWorkoutElapsed] = useState(0);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);

  // Dedicated Rest Timer (in seconds)
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);

  // 3D View Mode: equipment vs biomechanical avatar
  const [viewMode, setViewMode] = useState<"avatar" | "equipment">("avatar");

  // Workout Summary Celebration Modal
  const [isFinished, setIsFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Workout duration ticker
  useEffect(() => {
    if (isWorkoutPaused || isFinished) return;
    const interval = setInterval(() => {
      setWorkoutElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWorkoutPaused, isFinished]);

  // Rest Timer ticker
  useEffect(() => {
    if (!isResting || restSecondsLeft === null) return;
    if (restSecondsLeft <= 0) {
      setIsResting(false);
      setRestSecondsLeft(null);
      return;
    }
    const timer = setInterval(() => {
      setRestSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Active sets for current exercise
  const currentSets = setTracking[activeEx.id] || [];
  const currentCompletedSets = currentSets.filter((s) => s.completed).length;

  // Complete a specific set
  const handleCompleteSet = (index: number) => {
    setSetTracking((prev) => {
      const exSets = [...(prev[activeEx.id] || [])];
      if (exSets[index]) {
        exSets[index] = { ...exSets[index], completed: !exSets[index].completed };
      }
      return { ...prev, [activeEx.id]: exSets };
    });

    // Auto trigger rest timer if completing a set
    if (!currentSets[index]?.completed) {
      setRestSecondsLeft(activeEx.restSecs || 60);
      setIsResting(true);
    }
  };

  // Complete entire current exercise
  const handleCompleteAllSetsForCurrent = () => {
    setSetTracking((prev) => {
      const exSets = (prev[activeEx.id] || []).map((s) => ({ ...s, completed: true }));
      return { ...prev, [activeEx.id]: exSets };
    });
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex((idx) => idx + 1);
      setRestSecondsLeft(activeEx.restSecs || 60);
      setIsResting(true);
    }
  };

  // Compute Total Stats
  const totalSetsCount = Object.values(setTracking).reduce((acc, sArr) => acc + sArr.length, 0);
  const totalCompletedSets = Object.values(setTracking).reduce(
    (acc, sArr) => acc + sArr.filter((s) => s.completed).length,
    0
  );
  const completedExercisesCount = exercises.filter(
    (ex) => (setTracking[ex.id] || []).every((s) => s.completed)
  ).length;

  const overallProgress = Math.round((totalCompletedSets / (totalSetsCount || 1)) * 100);

  // Finish and persist to Firestore
  const handleFinishWorkout = async () => {
    setIsSaving(true);
    setIsWorkoutPaused(true);

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];

    const workoutLog = {
      workoutName,
      dayName,
      completedAt: serverTimestamp(),
      date: dateStr,
      durationSecs: workoutElapsed,
      exercisesCompleted: completedExercisesCount,
      totalExercises: exercises.length,
      totalSetsCompleted: totalCompletedSets,
      totalSets: totalSetsCount,
      caloriesBurned: Math.round((workoutElapsed / 60) * 8.5), // ~8.5 kcal/min
      log: setTracking,
    };

    try {
      if (db && user?.uid) {
        const docRef = doc(db, "workouts", user.uid, "history", dateStr);
        await setDoc(docRef, workoutLog, { merge: true });
      }
      if (updateUserData) {
        updateUserData({
          workoutProgress: `${completedExercisesCount}/${exercises.length}`,
          lastWorkoutDate: dateStr,
        });
      }
    } catch (err) {
      console.warn("Could not save to Firestore, stored in local state:", err);
    }

    setIsSaving(false);
    setIsFinished(true);
    onWorkoutComplete({
      durationSecs: workoutElapsed,
      completedExercises: completedExercisesCount,
      totalSets: totalCompletedSets,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col overflow-hidden">
      {/* 1. Top HUD Control Bar */}
      <header className="h-20 border-b border-white/10 bg-black/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
            title="Exit Workout"
          >
            <X size={18} className="text-gray-300" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                Live Workout Execution
              </span>
            </div>
            <h2 className="text-base md:text-lg font-black uppercase italic tracking-tight truncate max-w-xs md:max-w-md">
              {workoutName}
            </h2>
          </div>
        </div>

        {/* Center: Live Workout Timer & Progress */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl font-mono">
            <Clock size={16} className="text-primary animate-pulse" />
            <span className="text-lg font-black tracking-wider text-white">
              {formatTime(workoutElapsed)}
            </span>
            <button
              onClick={() => setIsWorkoutPaused(!isWorkoutPaused)}
              className="ml-2 text-xs text-gray-400 hover:text-primary transition-colors"
            >
              {isWorkoutPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="w-32 bg-white/10 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div
                className="bg-primary h-full transition-all duration-500 rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-primary">{overallProgress}%</span>
          </div>
        </div>

        {/* Right: End Workout Button */}
        <button
          onClick={handleFinishWorkout}
          disabled={isSaving}
          className="px-4 md:px-6 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] flex items-center gap-2"
        >
          <Trophy size={16} />
          <span className="hidden sm:inline">Finish Workout</span>
        </button>
      </header>

      {/* 2. Main Workout Split Arena */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full items-start">
        {/* Left Column (6 Cols): 3D Form / Equipment Stage */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between bg-white/5 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setViewMode("avatar")}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                viewMode === "avatar"
                  ? "bg-primary text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Biomechanical Avatar
            </button>
            <button
              onClick={() => setViewMode("equipment")}
              className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                viewMode === "equipment"
                  ? "bg-primary text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              3D Equipment Arsenal
            </button>
          </div>

          {/* 3D Scene */}
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
            {viewMode === "avatar" ? (
              <FitnessAvatar3D exercise={activeEx.name} className="h-80 md:h-96" />
            ) : (
              <GymEquipment3D equipment={activeEx.equipmentName} className="h-80 md:h-96" />
            )}

            {/* Floating Cues */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <span className="text-[10px] font-mono text-gray-300 bg-black/80 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                Muscle: <strong className="text-primary">{activeEx.muscle}</strong>
              </span>
              <span className="text-[10px] font-mono text-gray-300 bg-black/80 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                Target: <strong className="text-white">{activeEx.targetWeight}</strong>
              </span>
            </div>
          </div>

          {/* Form Cues / Coach Notes */}
          {activeEx.notes && (
            <div className="p-4 rounded-2xl bg-black/40 border border-primary/20 flex items-start gap-3 text-xs">
              <Zap size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Trainer Execution Cue
                </p>
                <p className="text-gray-300 mt-0.5 leading-relaxed">{activeEx.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (6 Cols): Exercise Set Logger & Rest Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Exercise Card Header */}
          <div className="p-6 rounded-3xl bg-[#111111] border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                Exercise {currentExIndex + 1} of {exercises.length}
              </span>
              <span className="text-xs font-mono text-gray-400">
                Sets Complete: {currentCompletedSets} / {currentSets.length}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
              {activeEx.name}
            </h1>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={currentExIndex === 0}
                onClick={() => setCurrentExIndex((idx) => Math.max(0, idx - 1))}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 flex items-center gap-1 text-xs font-bold"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                disabled={currentExIndex === exercises.length - 1}
                onClick={() => setCurrentExIndex((idx) => Math.min(exercises.length - 1, idx + 1))}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 flex items-center gap-1 text-xs font-bold"
              >
                Next <ChevronRight size={16} />
              </button>
              <button
                onClick={handleCompleteAllSetsForCurrent}
                className="ml-auto px-4 py-2 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Pass Exercise
              </button>
            </div>
          </div>

          {/* Sets Execution Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <span>Set</span>
              <span>Target Reps</span>
              <span>Weight (KG)</span>
              <span>Status</span>
            </div>

            {currentSets.map((set, sIdx) => {
              return (
                <div
                  key={sIdx}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    set.completed
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-black/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        set.completed
                          ? "bg-green-500 text-black"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {set.setNumber}
                    </span>
                    <span className="text-xs font-bold uppercase text-gray-300">
                      Set {set.setNumber}
                    </span>
                  </div>

                  {/* Reps */}
                  <div className="text-sm font-mono font-bold text-white">
                    {set.reps} reps
                  </div>

                  {/* Weight */}
                  <div className="text-sm font-mono font-bold text-primary">
                    {set.weight} kg
                  </div>

                  {/* Complete Set Button */}
                  <button
                    onClick={() => handleCompleteSet(sIdx)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      set.completed
                        ? "bg-green-500 text-black shadow-lg"
                        : "bg-primary hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    }`}
                  >
                    {set.completed ? (
                      <>
                        <CheckCircle2 size={14} /> Done
                      </>
                    ) : (
                      <>
                        <Play size={12} className="fill-current" /> Log Set
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Rest Timer HUD if Active */}
          <AnimatePresence>
            {isResting && restSecondsLeft !== null && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 rounded-3xl bg-gradient-to-r from-primary/20 via-black to-black border-2 border-primary shadow-[0_0_30px_rgba(255,215,0,0.25)] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                      Active Rest Interval
                    </span>
                  </div>
                  <p className="text-2xl font-black font-mono tracking-tight text-white mt-1">
                    00:{restSecondsLeft.toString().padStart(2, "0")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRestSecondsLeft((s) => (s ? s + 15 : 15))}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-mono font-bold"
                  >
                    +15s
                  </button>
                  <button
                    onClick={() => {
                      setIsResting(false);
                      setRestSecondsLeft(null);
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    Skip Rest
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Celebration / Finish Workout Modal */}
      <AnimatePresence>
        {isFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="glass max-w-md w-full p-8 rounded-[2.5rem] border border-primary/40 text-center relative overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.2)]"
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/20 border-2 border-primary mx-auto flex items-center justify-center text-primary shadow-[0_0_30px_rgba(255,215,0,0.5)] mb-4 animate-bounce">
                <Trophy size={40} />
              </div>

              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                Session Accomplished
              </span>
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white mt-1">
                Workout Complete!
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                Outstanding effort! Your workout volume, sets, and cadence have been securely logged to
                your private profile.
              </p>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-2xl bg-black/60 border border-white/10">
                <div>
                  <p className="text-[9px] uppercase font-bold text-gray-400">Duration</p>
                  <p className="text-lg font-black font-mono text-white mt-0.5">
                    {formatTime(workoutElapsed)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-gray-400">Sets Done</p>
                  <p className="text-lg font-black font-mono text-primary mt-0.5">
                    {totalCompletedSets}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-gray-400">Calories</p>
                  <p className="text-lg font-black font-mono text-amber-400 mt-0.5">
                    ~{Math.round((workoutElapsed / 60) * 8.5)} kcal
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-primary hover:bg-yellow-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-[0_0_25px_rgba(255,215,0,0.4)]"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
