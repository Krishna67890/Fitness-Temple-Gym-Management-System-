"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Calendar,
  CheckCircle2,
  Clock,
  Droplets,
  Flame,
  User,
  ShieldCheck,
  Play,
  RotateCcw,
  Apple,
  QrCode,
  CalendarCheck,
  Settings,
  Image as ImageIcon,
  Map as MapIcon,
  Star,
  Instagram,
  Sparkles,
} from "lucide-react";
import { useAuth, getCleanEmailName } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { GymEquipment3D } from "@/components/portal/GymEquipment3D";
import { FitnessAvatar3D } from "@/components/portal/FitnessAvatar3D";
import { WorkoutTimer } from "@/components/portal/WorkoutTimer";
import { WorkoutPlayer } from "@/components/portal/WorkoutPlayer";
import Link from "next/link";
import { WEEKLY_ROUTINES } from "@/lib/workoutRoutines";
import { generateRecommendations } from "@/lib/ai-recommender";

const daysOfWeek = [
  { key: "MON", label: "Mon" },
  { key: "TUE", label: "Tue" },
  { key: "WED", label: "Wed" },
  { key: "THU", label: "Thu" },
  { key: "FRI", label: "Fri" },
  { key: "SAT", label: "Sat" },
  { key: "SUN", label: "Sun" },
];

const trainersData = [
  {
    name: "Suraj",
    role: "Certified Fitness Trainer",
    instagram: "https://www.instagram.com/_._s.u.r.a.j._?stkn=MWF5dzIxdmJhenN3eA=="
  },
  {
    name: "Sanket",
    role: "Strength & Conditioning Coach",
    instagram: "https://www.instagram.com/sanket_ghode10?igsh=MWwyZnF0bzJ2b3JpbQ=="
  },
  {
    name: "Poonam Ghode",
    role: "Female Fitness Consultant",
    instagram: "https://www.instagram.com/pbwagh?stkn=ZnQyOWZ5dWk1OTZi"
  }
];

const MemberDashboardPage = () => {
  const { user, userData, loading, updateUserData } = useAuth();
  const router = useRouter();

  // Calendar State using uniform upper-case keys matching WEEKLY_ROUTINES
  const [selectedDay, setSelectedDay] = useState("MON");

  // Active workout execution state
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [isWearableSyncing, setIsWearableSyncing] = useState(false);

  // AI Nutrition State
  const [aiNutrition, setAiNutrition] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    suggestion: string;
  } | null>(null);

  // Compute AI Recommendation if user properties exist
  useEffect(() => {
    if (userData) {
      try {
        const weight = userData.weight ? parseFloat(userData.weight) : 70;
        const height = userData.height ? parseFloat(userData.height) : 175;
        const age = userData.age ? parseInt(userData.age) : 25;
        const gender = userData.gender === "girl" ? "girl" : "boy";

        let goal: "weight-loss" | "muscle-gain" | "maintenance" = "maintenance";
        if (userData.fitnessGoal?.toLowerCase().includes("loss") || userData.fitnessGoal?.toLowerCase().includes("cut")) {
          goal = "weight-loss";
        } else if (userData.fitnessGoal?.toLowerCase().includes("gain") || userData.fitnessGoal?.toLowerCase().includes("bulk")) {
          goal = "muscle-gain";
        }

        const stats = {
          weight,
          height,
          age,
          gender,
          goal,
          activityLevel: "moderate" as const
        };

        const res = generateRecommendations(stats);
        setAiNutrition({
          calories: res.calories,
          protein: res.macros.protein,
          carbs: res.macros.carbs,
          fats: res.macros.fats,
          suggestion: res.suggestion
        });
      } catch (e) {
        console.error("AI Recommender Error:", e);
      }
    }
  }, [userData]);

  // Water Tracker State
  const [waterIntakeMl, setWaterIntakeMl] = useState(1750);
  const waterGoalMl = 2500;

  // Visual View Mode: 3D Equipment vs 3D Avatar Demo
  const [visualMode, setVisualMode] = useState<"equipment" | "avatar">("equipment");

  // Local storage users can be mapped here to show dynamic details
  useEffect(() => {
    if (userData && !userData.memberId) {
      const storedLocalUsers = localStorage.getItem("ft_local_users");
      const localUsers = storedLocalUsers ? JSON.parse(storedLocalUsers) : {};

      // If this is a local session, ensure it has a unique local ID
      if (!localUsers[userData.uid]) {
        const localId = `FT-LOC-${Math.floor(1000 + Math.random() * 9000)}`;
        localUsers[userData.uid] = { ...userData, memberId: localId };
        localStorage.setItem("ft_local_users", JSON.stringify(localUsers));
        updateUserData({ memberId: localId });
      }
    }
  }, [userData, updateUserData]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !userData) {
      router.replace("/login");
    }
  }, [userData, loading, router]);

  // Check if gender is set, if not show modal
  useEffect(() => {
    if (!loading && userData && !userData.gender) {
      setShowGenderModal(true);
    }
  }, [userData, loading]);

  if (loading || !userData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin" />
          <img src="/assets/FitnessTempleGym.png" className="w-12 h-12 absolute inset-0 m-auto animate-pulse" alt="Loading" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  const routine = WEEKLY_ROUTINES[selectedDay] || WEEKLY_ROUTINES.MON;

  // Today's Date String
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const activeExercise = routine.exercises[activeExerciseIndex] || routine.exercises[0];

  // Calculate Progress
  const totalExercises = routine.exercises.length;
  const completedCount = Object.values(completedExercises).filter(Boolean).length;

  const toggleExerciseComplete = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNextExercise = () => {
    if (activeExerciseIndex < routine.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
    }
  };

  const addWater = (amount: number) => {
    setWaterIntakeMl((prev) => Math.min(waterGoalMl + 1000, prev + amount));
  };

  const resetWater = () => {
    setWaterIntakeMl(0);
  };

  const handleGenderSelection = async (gender: "boy" | "girl") => {
    const avatarPath = gender === "boy" ? "/assets/boy.png" : "/assets/girl.png";

    // Update local state immediately for instant feedback
    const updatedData = {
      ...userData,
      gender,
      profileImage: avatarPath,
      photoURL: avatarPath
    };

    // Persist to local storage for offline users
    const storedLocalUsers = localStorage.getItem("ft_local_users");
    if (storedLocalUsers && userData?.uid) {
      const localUsers = JSON.parse(storedLocalUsers);
      if (localUsers[userData.uid]) {
        localUsers[userData.uid] = { ...localUsers[userData.uid], gender, profileImage: avatarPath, photoURL: avatarPath };
        localStorage.setItem("ft_local_users", JSON.stringify(localUsers));
      }
    }

    await updateUserData({
      gender,
      profileImage: avatarPath,
      photoURL: avatarPath
    });
    setShowGenderModal(false);
  };

  const handleWearableSync = () => {
    setIsWearableSyncing(true);
    setTimeout(() => {
      setIsWearableSyncing(false);
      alert("Wearable Sync Success: Data fully connected.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#111111] via-[#161616] to-[#0A0A0A] border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-5">
            <div
              className="relative flex-shrink-0 cursor-pointer group"
              onClick={() => setShowGenderModal(true)}
            >
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(255,215,0,0.3)] bg-black group-hover:border-white transition-all">
                {userData?.profileImage || userData?.photoURL ? (
                  <img src={userData.profileImage || userData.photoURL} alt="Member Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-black text-3xl italic">
                    {(userData?.fullName || userData?.name)?.charAt(0) || "M"}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center z-20" title="Active">
                <ShieldCheck size={14} className="text-black" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  Member Portal • Private Isolation
                </span>
                <span className="text-[10px] font-mono text-gray-400">ID: {userData?.memberId || "FT-MEMBER"}</span>
              </div>
              <h1 className="text-xl md:text-4xl font-black uppercase italic tracking-tight leading-tight">
                Welcome Back, <span className="ft-gradient-text block sm:inline">{(() => {
                  const raw = userData?.fullName || userData?.name || "";
                  const isGeneric = !raw || ["warrior", "fitness warrior", "fitness member", "member"].includes(raw.trim().toLowerCase()) || raw.includes('@');
                  if (isGeneric && userData?.email) {
                    return getCleanEmailName(userData.email);
                  }
                  return raw || (userData?.email ? getCleanEmailName(userData.email) : "Member");
                })()}</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>{todayFormatted}</span>
                <span className="text-gray-600">•</span>
                <span className="text-primary font-bold">Goal: {userData?.fitnessGoal || "General Fitness"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowTourModal(true)}
              className="px-4 py-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all"
            >
              <MapIcon size={16} className="text-primary" />
              <span>3D Tour</span>
            </button>
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-4 py-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all"
            >
              <Play size={16} className="text-primary fill-primary/20" />
              <span>Videos</span>
            </button>
            <button
              onClick={() => setShowGalleryModal(true)}
              className="px-4 py-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all"
            >
              <ImageIcon size={16} className="text-primary" />
              <span>Gallery</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-4 py-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all"
            >
              <Settings size={16} className="text-primary" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setShowQrModal(true)}
              className="px-4 py-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all"
            >
              <QrCode size={16} className="text-primary" />
              <span>Gate Pass</span>
            </button>
            <Link
              href="/reviews"
              className="px-4 py-3 bg-primary text-black hover:bg-primary/80 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all"
            >
              <Star size={16} />
              <span>Reviews</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4 relative overflow-hidden group cursor-pointer" onClick={handleWearableSync}>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
            <Clock size={24} className={isWearableSyncing ? "animate-spin" : ""} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Wearable Sync</p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-white">
                {isWearableSyncing ? "Syncing..." : "Connected"}
              </span>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Est. Calories</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black font-mono text-white">
                {isWorkoutStarted ? 120 + Math.floor(Math.random() * 200) : 0}
              </span>
              <span className="text-[10px] font-bold text-green-500">KCAL</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Hydration</p>
            <p className="text-lg font-black font-mono text-white">{(waterIntakeMl / 1000).toFixed(2)} / {(waterGoalMl / 1000).toFixed(1)} L</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Attendance</p>
            <p className="text-sm font-black uppercase italic text-white">Verified Present</p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Daily Fitness Calendar */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="text-primary w-5 h-5" />
              <h2 className="text-xl font-black uppercase italic tracking-wider">
                Daily Fitness Calendar & Routine
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Select any day to preview and execute that day's specialized routine & customized nutrition.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar max-w-full">
            {daysOfWeek.map((day) => {
              const isSelected = selectedDay === day.key;
              return (
                <button
                  key={day.key}
                  onClick={() => {
                    setSelectedDay(day.key);
                    setActiveExerciseIndex(0);
                  }}
                  className={`px-3 md:px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-primary text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Routine Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 gap-4">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">
              {routine.dayName} Target
            </span>
            <h3 className="text-xl font-black uppercase italic text-white tracking-tight mt-0.5">
              {routine.focus}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              {routine.exercises.length} Exercises Scheduled • Total Volume ~24 Sets • Rest Timing Active
            </p>
          </div>

          <button
            onClick={() => setIsWorkoutStarted(true)}
            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-wider font-black shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            <Play size={16} className="fill-current" />
            <span>Launch Workout Engine</span>
          </button>
        </div>
      </div>

      {/* 4. Main Workout Engine & Interactive 3D Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Workout Routine List & Execution */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black uppercase italic tracking-wider flex items-center gap-2">
              <Dumbbell className="text-primary" size={20} />
              <span>Target Exercises</span>
            </h3>
            <span className="text-xs font-mono text-gray-400">
              Completed: {completedCount} / {totalExercises}
            </span>
          </div>

          {/* Exercises List */}
          <div className="space-y-4">
            {routine.exercises.map((ex, idx) => {
              const isSelected = activeExerciseIndex === idx;
              const isDone = completedExercises[ex.id];

              return (
                <motion.div
                  key={ex.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setActiveExerciseIndex(idx)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-primary/15 via-black to-black border-primary shadow-[0_0_25px_rgba(255,215,0,0.15)]"
                      : isDone
                      ? "bg-black/40 border-green-500/30 opacity-70"
                      : "bg-black/50 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExerciseComplete(ex.id);
                        }}
                        className={`mt-1 w-6 h-6 rounded-xl border flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-green-500 border-green-500 text-black font-black"
                            : "border-white/30 hover:border-primary"
                        }`}
                      >
                        {isDone && <CheckCircle2 size={16} />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-primary font-bold">0{idx + 1}</span>
                          <h4 className={`text-base font-black uppercase italic tracking-tight ${isSelected ? "text-primary" : "text-white"}`}>
                            {ex.name}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{ex.muscle}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] font-bold uppercase tracking-wider">
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                            {ex.sets} Sets × {ex.reps} Reps
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-primary">
                            Target: {ex.targetWeight}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> Rest: {ex.restSecs}s
                          </span>
                        </div>

                        {ex.notes && (
                          <p className="text-[11px] text-gray-500 mt-2 italic bg-black/40 p-2 rounded-xl border border-white/5">
                            💡 Coach Note: {ex.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-white/5 text-gray-400">
                        {ex.equipmentName.replace("-", " ")}
                      </span>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: 3D Visualization & Timer System */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* Visual Selector Toggle */}
          <div className="glass rounded-3xl p-2 border border-white/10 flex items-center justify-between">
            <button
              onClick={() => setVisualMode("equipment")}
              className={`flex-1 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                visualMode === "equipment"
                  ? "bg-primary text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              3D Equipment Arsenal
            </button>
            <button
              onClick={() => setVisualMode("avatar")}
              className={`flex-1 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
                visualMode === "avatar"
                  ? "bg-primary text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              3D Form AI Avatar
            </button>
          </div>

          {/* Interactive 3D Canvas */}
          <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            {visualMode === "equipment" ? (
              <GymEquipment3D equipment={routine.equipment} />
            ) : (
              <FitnessAvatar3D exercise={routine.avatarDemo} />
            )}
          </div>

          {/* Advanced Rest Timer Component */}
          <WorkoutTimer
            initialSeconds={activeExercise?.restSecs || 60}
            exerciseName={activeExercise?.name || ""}
            onNextExercise={handleNextExercise}
          />
        </div>
      </div>

      {/* 5. Member Diet System & Daily Hydration Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Daily Meal Schedule (8 cols) */}
        <div className="lg:col-span-8 glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2.5">
              <Apple className="text-primary w-6 h-6" />
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-wider">
                  {aiNutrition ? "AI Custom Fuel Blueprint" : "Personalized Nutrition Blueprint"}
                </h3>
                <p className="text-xs text-gray-400">Assigned meal timings, macronutrients & clean fuel</p>
              </div>
            </div>

            {aiNutrition && (
              <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary">Daily Target</p>
                  <p className="text-sm font-black font-mono text-white">{aiNutrition.calories} KCAL</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="grid grid-cols-3 gap-3 text-[9px] font-mono text-gray-400">
                  <div className="text-center">
                    <p className="font-black text-white">{aiNutrition.protein}g</p>
                    <p>PRO</p>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-white">{aiNutrition.carbs}g</p>
                    <p>CHO</p>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-white">{aiNutrition.fats}g</p>
                    <p>FAT</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {aiNutrition && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-medium flex items-start gap-3"
            >
              <Sparkles size={16} className="mt-0.5 flex-shrink-0 text-emerald-300" />
              <p>
                <strong className="uppercase font-black text-emerald-300 tracking-wider mr-2">AI Dietitian:</strong>
                {aiNutrition.suggestion}
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routine.meals.map((meal, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-black/50 border border-white/5 hover:border-white/15 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    {meal.time}
                  </span>
                  <span className="text-xs font-mono text-gray-400 font-bold">
                    {meal.calories} kcal
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black uppercase italic text-white">{meal.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{meal.items}</p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[9px] font-mono text-gray-500">
                  <span>P: <strong className="text-white">{meal.protein}</strong></span>
                  <span>•</span>
                  <span>C: <strong className="text-white">{meal.carbs}</strong></span>
                  <span>•</span>
                  <span>F: <strong className="text-white">{meal.fats}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Hydration Water Tracker (4 cols) */}
        <div className="lg:col-span-4 glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2">
            <Droplets className="text-blue-400 w-5 h-5" />
            <h3 className="text-lg font-black uppercase italic tracking-wider">
              Water Tracker
            </h3>
          </div>

          {/* Animated Water Progress Container */}
          <div className="relative rounded-3xl bg-black/60 border border-white/10 p-6 flex flex-col items-center justify-center overflow-hidden h-56">
            {/* Water Wave fill animation */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.min(100, (waterIntakeMl / waterGoalMl) * 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600/60 to-cyan-400/40 pointer-events-none rounded-b-3xl"
            />

            <div className="relative z-10 text-center space-y-1">
              <Droplets className="mx-auto text-cyan-300 w-8 h-8 animate-bounce" />
              <span className="text-4xl font-black font-mono tracking-tighter text-white drop-shadow-md">
                {(waterIntakeMl / 1000).toFixed(2)}
                <span className="text-xl text-cyan-300 font-sans"> L</span>
              </span>
              <p className="text-[10px] uppercase font-bold text-gray-300 tracking-widest">
                Target: {(waterGoalMl / 1000).toFixed(1)} Liters / Day
              </p>
              <div className="text-[9px] font-mono text-cyan-200 mt-2 bg-black/40 px-3 py-1 rounded-full inline-block">
                {Math.round((waterIntakeMl / waterGoalMl) * 100)}% Hydrated
              </div>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => addWater(250)}
              className="py-3 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/50 rounded-2xl text-xs font-black uppercase tracking-wider text-blue-300 transition-all"
            >
              +250 ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="py-3 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-400/50 rounded-2xl text-xs font-black uppercase tracking-wider text-blue-300 transition-all"
            >
              +500 ml
            </button>
            <button
              onClick={resetWater}
              className="py-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-2xl text-xs font-black uppercase tracking-wider text-red-400 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* 6. Trainers Instagram Assets Synchronization */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-wider flex items-center gap-2">
            <Instagram className="text-primary" size={22} />
            <span>Connect with Certified Coaches</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Follow your favorite instructors live on Instagram for advanced transformation motivation and tips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trainersData.map((trainer, i) => (
            <div key={i} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
              <div>
                <h4 className="text-base font-black text-white">{trainer.name}</h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{trainer.role}</p>
              </div>
              <a
                href={trainer.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-black transition-all"
              >
                <Instagram size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Gate Pass QR Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-sm w-full p-8 rounded-3xl border border-white/10 text-center relative"
            >
              <h3 className="text-xl font-black uppercase italic tracking-wider mb-1">
                Gate Pass QR
              </h3>
              <p className="text-xs text-gray-400 mb-6">Scan at reception terminal for contactless check-in</p>

              <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${userData?.memberId || userData?.uid || "FT-WARRIOR"}`}
                  alt="Member Access QR"
                  className="w-44 h-44"
                />
              </div>

              <p className="text-xs font-mono font-bold text-primary">{userData?.memberId || "FT-WARRIOR"}</p>
              <button
                onClick={() => setShowQrModal(false)}
                className="mt-6 w-full py-3 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Close Pass
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gender Profile Selection Modal */}
      <AnimatePresence>
        {showGenderModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass max-w-md w-full p-8 rounded-[3rem] border border-white/10 text-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <h3 className="text-2xl font-black uppercase italic tracking-wider mb-2">
                Identify Your Profile
              </h3>
              <p className="text-xs text-gray-400 mb-8 uppercase tracking-[0.2em]">Select your avatar archetype</p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => handleGenderSelection("boy")}
                  className="group flex flex-col items-center gap-4 p-6 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-inner"
                >
                  <div className="w-24 h-24 rounded-3xl overflow-hidden bg-black p-1">
                    <img src="/assets/boy.png" alt="Boy" className="w-full h-full object-cover rounded-2xl" />
                  </div>
                  <span className="font-black uppercase italic tracking-widest text-sm group-hover:text-primary transition-colors">Boy</span>
                </button>

                <button
                  onClick={() => handleGenderSelection("girl")}
                  className="group flex flex-col items-center gap-4 p-6 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all shadow-inner"
                >
                  <div className="w-24 h-24 rounded-3xl overflow-hidden bg-black p-1">
                    <img src="/assets/girl.png" alt="Girl" className="w-full h-full object-cover rounded-2xl" />
                  </div>
                  <span className="font-black uppercase italic tracking-widest text-sm group-hover:text-primary transition-colors">Girl</span>
                </button>
              </div>

              <button
                onClick={() => setShowGenderModal(false)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
              >
                Cancel & Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Standalone Workout Player component */}
      <AnimatePresence>
        {isWorkoutStarted && (
          <WorkoutPlayer
            workoutName={`${routine.dayName} — ${routine.focus}`}
            dayName={routine.dayName}
            exercises={routine.exercises}
            onClose={() => setIsWorkoutStarted(false)}
            onWorkoutComplete={(summary) => {
              const updated: Record<string, boolean> = {};
              routine.exercises.forEach((ex) => {
                updated[ex.id] = true;
              });
              setCompletedExercises((prev) => ({ ...prev, ...updated }));
              setIsWorkoutStarted(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass max-w-lg w-full p-8 rounded-[2.5rem] border border-white/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-wider">Account Settings</h3>
                  <p className="text-xs text-gray-400 font-mono">{userData?.fullName || userData?.name}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</p>
                    <p className="text-sm font-bold text-white">{userData?.fullName || userData?.name}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Contact Email</p>
                    <p className="text-sm font-bold text-white">{userData?.email}</p>
                  </div>
                  <ShieldCheck size={18} className="text-green-500" />
                </div>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-4 bg-primary text-black rounded-2xl text-xs font-black uppercase tracking-widest"
              >
                Save & Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="w-full max-w-5xl h-[80vh] overflow-y-auto no-scrollbar glass p-8 rounded-[3rem] border border-white/10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">Arena Gallery & Videos</h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">Official Media & Walkthroughs</p>
                </div>
                <button onClick={() => setShowGalleryModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                  <RotateCcw size={20} />
                </button>
              </div>

              <div className="mb-8 rounded-3xl overflow-hidden border border-white/10 bg-black/60 relative aspect-video max-h-[380px] w-full">
                <video
                  src="/assets/Fitness-Temple.mp4"
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                ></video>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-square rounded-3xl bg-white/5 border border-white/10 overflow-hidden group">
                    <img
                      src={`https://images.unsplash.com/photo-${1534438327276 + i}-1091f1a12463?w=500&auto=format&fit=crop&q=80`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                      alt="Gym"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3D Tour Modal */}
      <AnimatePresence>
        {showTourModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-6xl aspect-video glass rounded-[3rem] border border-white/10 overflow-hidden relative flex flex-col"
            >
              <div className="p-4 bg-black/50 border-b border-white/10 flex items-center justify-between z-20">
                <div>
                  <h3 className="text-xl font-black uppercase italic text-white">Rajarajeshwari Fitness Arena</h3>
                  <p className="text-[10px] text-primary font-bold tracking-widest uppercase">
                    3D Gym Equipments Arsenal (Interactive Orbit & Spatial View)
                  </p>
                </div>
                <button
                  onClick={() => setShowTourModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-red-500 hover:text-white border border-white/20 rounded-xl text-xs font-black uppercase transition-all"
                >
                  Exit Tour
                </button>
              </div>

              <div className="flex-1 p-4 overflow-hidden flex flex-col">
                <div className="sketchfab-embed-wrapper w-full flex-1 rounded-2xl overflow-hidden bg-black/50 border border-white/10 relative">
                  <iframe
                    title="Gym Equipments"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/14a4a06784d9429085b19135af75db25/embed"
                    className="w-full h-full border-0"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Standalone Video Walkthrough Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl aspect-video glass rounded-[3rem] border border-white/10 overflow-hidden relative flex flex-col shadow-2xl"
            >
              <div className="p-4 bg-black/50 border-b border-white/10 flex items-center justify-between z-20">
                <div>
                  <h3 className="text-xl font-black uppercase italic text-white">Fitness Arena Video Walkthrough</h3>
                  <p className="text-[10px] text-primary font-bold tracking-widest uppercase">HD Walkthrough & Facility Tour</p>
                </div>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-red-500 hover:text-white border border-white/20 rounded-xl text-xs font-black uppercase transition-all"
                >
                  Close Video
                </button>
              </div>
              <div className="flex-1 w-full h-full bg-black relative">
                <video
                  src="/assets/Fitness-Temple.mp4"
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                ></video>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberDashboardPage;
