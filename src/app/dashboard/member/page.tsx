"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  Calendar,
  CheckCircle2,
  Clock,
  Droplets,
  Flame,
  Award,
  TrendingUp,
  User,
  ShieldCheck,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  Apple,
  MessageSquare,
  QrCode,
  CalendarCheck,
  AlertCircle,
  Maximize2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GymEquipment3D, EquipmentType } from "@/components/portal/GymEquipment3D";
import { FitnessAvatar3D, ExerciseDemoType } from "@/components/portal/FitnessAvatar3D";
import { WorkoutTimer } from "@/components/portal/WorkoutTimer";
import { WorkoutPlayer } from "@/components/portal/WorkoutPlayer";
import Link from "next/link";
import { gsap } from "gsap";

// Daily routines mapping for the calendar week
interface DayRoutine {
  dayName: string;
  focus: string;
  equipment: EquipmentType;
  avatarDemo: ExerciseDemoType;
  exercises: {
    id: string;
    name: string;
    muscle: string;
    equipmentName: EquipmentType;
    sets: number;
    reps: string;
    targetWeight: string;
    restSecs: number;
    notes: string;
  }[];
  meals: {
    time: string;
    name: string;
    items: string;
    calories: number;
    protein: string;
    carbs: string;
    fats: string;
  }[];
}

const WEEKLY_ROUTINES: Record<string, DayRoutine> = {
  Mon: {
    dayName: "Monday",
    focus: "Chest & Triceps Hypertrophy",
    equipment: "bench-press",
    avatarDemo: "bench-press",
    exercises: [
      { id: "e1", name: "Barbell Bench Press", muscle: "Chest / Front Delts", equipmentName: "bench-press", sets: 4, reps: "12, 10, 8, 6", targetWeight: "70 kg", restSecs: 75, notes: "Retract scapula, drive with heels, 2-sec eccentric phase" },
      { id: "e2", name: "Incline Dumbbell Press", muscle: "Upper Chest", equipmentName: "dumbbells", sets: 3, reps: "10-12", targetWeight: "24 kg", restSecs: 60, notes: "30-degree incline, full stretch at the bottom" },
      { id: "e3", name: "Cable Chest Flyes", muscle: "Pectoralis Major", equipmentName: "cable-machine", sets: 3, reps: "15", targetWeight: "15 kg", restSecs: 45, notes: "Squeeze chest at peak contraction for 1 second" },
      { id: "e4", name: "Triceps Rope Pushdown", muscle: "Triceps Lateral Head", equipmentName: "cable-machine", sets: 4, reps: "12", targetWeight: "25 kg", restSecs: 45, notes: "Flave rope outward at full extension" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Oats with skim milk, 4 egg whites, 1 banana, almonds", calories: 540, protein: "32g", carbs: "68g", fats: "14g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Greek yogurt with mixed berries, green tea", calories: 210, protein: "18g", carbs: "24g", fats: "4g" },
      { time: "01:30 PM", name: "Lunch", items: "Brown rice (150g), grilled chicken breast or paneer, mixed salad", calories: 620, protein: "44g", carbs: "70g", fats: "16g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Whole wheat toast with peanut butter, black coffee", calories: 280, protein: "10g", carbs: "34g", fats: "11g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey isolate shake with creatine monohydrate", calories: 160, protein: "27g", carbs: "4g", fats: "2g" },
      { time: "09:00 PM", name: "Dinner", items: "Grilled fish or soya chunks, steamed broccoli, sweet potato", calories: 510, protein: "38g", carbs: "52g", fats: "12g" },
    ],
  },
  Tue: {
    dayName: "Tuesday",
    focus: "Back & Biceps Power Split",
    equipment: "lat-pulldown",
    avatarDemo: "lat-pulldown",
    exercises: [
      { id: "e5", name: "Lat Pulldown (Wide Grip)", muscle: "Latissimus Dorsi", equipmentName: "lat-pulldown", sets: 4, reps: "10-12", targetWeight: "55 kg", restSecs: 60, notes: "Drive elbows down and back, do not swing torso" },
      { id: "e6", name: "Barbell Bent-Over Row", muscle: "Mid Back / Rhomboids", equipmentName: "barbell", sets: 4, reps: "8-10", targetWeight: "60 kg", restSecs: 75, notes: "Maintain neutral spine, pull towards belly button" },
      { id: "e7", name: "Seated Cable Row", muscle: "Lower Lat / Middle Traps", equipmentName: "row-machine", sets: 3, reps: "12", targetWeight: "50 kg", restSecs: 60, notes: "Full stretch on release, tight squeeze" },
      { id: "e8", name: "Standing Barbell Bicep Curl", muscle: "Biceps Brachii", equipmentName: "barbell", sets: 4, reps: "10-12", targetWeight: "30 kg", restSecs: 45, notes: "Pin elbows to ribs, prevent shoulder recruitment" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Scrambled eggs, whole grain toast, apple, chia seeds", calories: 520, protein: "30g", carbs: "60g", fats: "16g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Sprouted moong salad with lemon & cucumber", calories: 190, protein: "14g", carbs: "28g", fats: "2g" },
      { time: "01:30 PM", name: "Lunch", items: "Quinoa bowl with paneer cubes, dal, green leafy veggies", calories: 590, protein: "36g", carbs: "68g", fats: "18g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Banana with 10 almonds & beetroot juice", calories: 230, protein: "6g", carbs: "42g", fats: "7g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey protein shake with chilled water", calories: 150, protein: "26g", carbs: "3g", fats: "2g" },
      { time: "09:00 PM", name: "Dinner", items: "Paneer tikka or grilled chicken, sautéed beans, roti", calories: 480, protein: "34g", carbs: "45g", fats: "14g" },
    ],
  },
  Wed: {
    dayName: "Wednesday",
    focus: "Leg Day & Quadriceps Blast",
    equipment: "squat-rack",
    avatarDemo: "squat",
    exercises: [
      { id: "e9", name: "Barbell Back Squat", muscle: "Quadriceps / Glutes", equipmentName: "squat-rack", sets: 5, reps: "12, 10, 8, 6, 6", targetWeight: "85 kg", restSecs: 90, notes: "Descend below parallel, chest up, brace core" },
      { id: "e10", name: "Leg Press 45-Degree", muscle: "Quads & Hamstrings", equipmentName: "leg-press", sets: 4, reps: "12", targetWeight: "140 kg", restSecs: 75, notes: "Do not lock knees at top of movement" },
      { id: "e11", name: "Walking Dumbbell Lunges", muscle: "Glutes & Stabilizers", equipmentName: "dumbbells", sets: 3, reps: "20 steps", targetWeight: "16 kg each", restSecs: 60, notes: "90-degree knee bend on each forward step" },
      { id: "e12", name: "Standing Calf Raises", muscle: "Gastrocnemius", equipmentName: "squat-rack", sets: 4, reps: "15-20", targetWeight: "60 kg", restSecs: 45, notes: "Hold stretch at bottom, peak squeeze at top" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Peanut butter banana oats with 3 boiled eggs", calories: 580, protein: "34g", carbs: "74g", fats: "18g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Handful of walnuts, roasted chana & tender coconut water", calories: 240, protein: "11g", carbs: "30g", fats: "9g" },
      { time: "01:30 PM", name: "Lunch", items: "Chicken biryani (low oil) or Soy chunk pulao with raita", calories: 650, protein: "42g", carbs: "82g", fats: "15g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Boiled sweet potatoes with pinch of pink salt", calories: 220, protein: "4g", carbs: "48g", fats: "1g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey isolate shake + 1 rice cake with honey", calories: 210, protein: "27g", carbs: "22g", fats: "1g" },
      { time: "09:00 PM", name: "Dinner", items: "Grilled tofu or chicken breast with stir-fried veggies", calories: 490, protein: "39g", carbs: "40g", fats: "13g" },
    ],
  },
  Thu: {
    dayName: "Thursday",
    focus: "Shoulders & Trap Overload",
    equipment: "shoulder-press",
    avatarDemo: "shoulder-press",
    exercises: [
      { id: "e13", name: "Overhead Barbell Military Press", muscle: "Anterior & Lateral Deltoids", equipmentName: "barbell", sets: 4, reps: "8-10", targetWeight: "45 kg", restSecs: 75, notes: "Strict form, lock core, press directly overhead" },
      { id: "e14", name: "Dumbbell Lateral Raises", muscle: "Lateral Deltoids (Boulder Cap)", equipmentName: "dumbbells", sets: 4, reps: "12-15", targetWeight: "10 kg", restSecs: 45, notes: "Lead with elbows, slight forward torso lean" },
      { id: "e15", name: "Face Pulls with Rope", muscle: "Rear Delts / Rotator Cuff", equipmentName: "cable-machine", sets: 4, reps: "15", targetWeight: "20 kg", restSecs: 45, notes: "Pull towards eyes, externally rotate shoulders" },
      { id: "e16", name: "Dumbbell Shrugs", muscle: "Upper Trapezius", equipmentName: "dumbbells", sets: 4, reps: "12", targetWeight: "28 kg each", restSecs: 45, notes: "Straight up elevation, pause for 2 seconds at top" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Omelette (3 whole + 2 whites) with spinach and toast", calories: 510, protein: "33g", carbs: "42g", fats: "21g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Whey protein with water + handful of almonds", calories: 230, protein: "29g", carbs: "6g", fats: "10g" },
      { time: "01:30 PM", name: "Lunch", items: "Steamed rice, chicken curry or rajma masala, green salad", calories: 600, protein: "38g", carbs: "75g", fats: "15g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Apple slices with peanut butter", calories: 200, protein: "5g", carbs: "28g", fats: "9g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Electrolyte hydration mix + whey protein", calories: 170, protein: "26g", carbs: "12g", fats: "1g" },
      { time: "09:00 PM", name: "Dinner", items: "Grilled fish or paneer, asparagus and pumpkin soup", calories: 460, protein: "36g", carbs: "35g", fats: "14g" },
    ],
  },
  Fri: {
    dayName: "Friday",
    focus: "Deadlift & Posterior Chain Conditioning",
    equipment: "barbell",
    avatarDemo: "deadlift",
    exercises: [
      { id: "e17", name: "Conventional Barbell Deadlift", muscle: "Erectors, Hamstrings, Glutes", equipmentName: "barbell", sets: 4, reps: "8, 6, 4, 2", targetWeight: "110 kg", restSecs: 120, notes: "Push the floor away, hip extension at lockout" },
      { id: "e18", name: "Romanian Deadlift (Dumbbells)", muscle: "Hamstring Deep Stretch", equipmentName: "dumbbells", sets: 3, reps: "10-12", targetWeight: "26 kg each", restSecs: 60, notes: "Hinge at hips, soft knees, feel hamstring tension" },
      { id: "e19", name: "Seated Hamstring Leg Curls", muscle: "Biceps Femoris", equipmentName: "leg-press", sets: 3, reps: "12-15", targetWeight: "45 kg", restSecs: 45, notes: "Controlled negative, don't let weight slam" },
      { id: "e20", name: "Hanging Leg Raises", muscle: "Core & Rectus Abdominis", equipmentName: "lat-pulldown", sets: 3, reps: "15", targetWeight: "Bodyweight", restSecs: 45, notes: "Roll pelvis upward, avoid swinging" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Muesli with milk, pumpkin seeds, whey scoop, berries", calories: 530, protein: "35g", carbs: "65g", fats: "14g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Boiled egg chaat with tomatoes and cilantro", calories: 180, protein: "13g", carbs: "8g", fats: "10g" },
      { time: "01:30 PM", name: "Lunch", items: "Brown rice with grilled chicken or dal makhani (light)", calories: 590, protein: "40g", carbs: "70g", fats: "14g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Black coffee + 2 dates + dark chocolate piece", calories: 160, protein: "2g", carbs: "32g", fats: "4g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey protein shake with creatine", calories: 150, protein: "27g", carbs: "4g", fats: "1g" },
      { time: "09:00 PM", name: "Dinner", items: "Egg bhurji or sautéed paneer with 2 rotis and cucumber", calories: 470, protein: "32g", carbs: "46g", fats: "14g" },
    ],
  },
  Sat: {
    dayName: "Saturday",
    focus: "Cardio HIIT & Functional Endurance",
    equipment: "treadmill",
    avatarDemo: "lunge",
    exercises: [
      { id: "e21", name: "Interval Treadmill Sprints", muscle: "Cardiovascular System", equipmentName: "treadmill", sets: 8, reps: "30s sprint / 60s walk", targetWeight: "Speed 14 km/h", restSecs: 60, notes: "All-out high-cadence sprint on 2% incline" },
      { id: "e22", name: "Dumbbell Walking Lunges", muscle: "Legs & Core Dynamic Balance", equipmentName: "dumbbells", sets: 3, reps: "20 steps", targetWeight: "14 kg", restSecs: 45, notes: "Keep torso upright and brace" },
      { id: "e23", name: "Push-ups to Failure", muscle: "Chest & Shoulders", equipmentName: "bench-press", sets: 3, reps: "To failure (~25)", targetWeight: "Bodyweight", restSecs: 45, notes: "Full range of motion, touch chest to floor" },
      { id: "e24", name: "Cable Core Woodchops", muscle: "Obliques & Transverse Abdominis", equipmentName: "cable-machine", sets: 3, reps: "15 each side", targetWeight: "18 kg", restSecs: 30, notes: "Rotate with core, not arms" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Avocado toast with poached eggs and orange juice", calories: 500, protein: "22g", carbs: "52g", fats: "22g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Protein bar or roasted almonds with green tea", calories: 210, protein: "15g", carbs: "18g", fats: "8g" },
      { time: "01:30 PM", name: "Lunch", items: "Grilled chicken sandwich or veg paneer wrap in multigrain", calories: 560, protein: "36g", carbs: "60g", fats: "16g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Hydration electrolytes + 1 banana", calories: 120, protein: "1g", carbs: "28g", fats: "0g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey protein with chilled almond milk", calories: 170, protein: "28g", carbs: "6g", fats: "3g" },
      { time: "09:00 PM", name: "Dinner", items: "Clear chicken or mushroom soup, grilled salmon or paneer", calories: 440, protein: "38g", carbs: "20g", fats: "18g" },
    ],
  },
  Sun: {
    dayName: "Sunday",
    focus: "Active Recovery & Mobility Flow",
    equipment: "dumbbells",
    avatarDemo: "bicep-curl",
    exercises: [
      { id: "e25", name: "Light Foam Rolling & Myofascial Release", muscle: "Full Body Fascia", equipmentName: "dumbbells", sets: 1, reps: "15 mins", targetWeight: "N/A", restSecs: 0, notes: "Target IT bands, lats, thoracic spine, calves" },
      { id: "e26", name: "Dynamic Yoga Flow & Hip Openers", muscle: "Flexibility & Joint Capsule", equipmentName: "dumbbells", sets: 1, reps: "20 mins", targetWeight: "N/A", restSecs: 0, notes: "Pigeon pose, world greatest stretch, cat-cow" },
      { id: "e27", name: "Zone 2 Incline Treadmill Walk", muscle: "Aerobic Recovery", equipmentName: "treadmill", sets: 1, reps: "30 mins", targetWeight: "Incline 6%, Speed 5.5", restSecs: 0, notes: "Heart rate between 115-130 bpm" },
    ],
    meals: [
      { time: "08:30 AM", name: "Breakfast", items: "Whole grain pancakes with blueberries and honey", calories: 510, protein: "18g", carbs: "78g", fats: "12g" },
      { time: "11:30 AM", name: "Mid-Morning", items: "Fresh watermelon juice with chia seeds", calories: 140, protein: "3g", carbs: "30g", fats: "1g" },
      { time: "02:00 PM", name: "Lunch", items: "Home-style balanced thali (dal, sabzi, 2 rotis, curd, salad)", calories: 580, protein: "24g", carbs: "80g", fats: "16g" },
      { time: "05:30 PM", name: "Snack", items: "Roasted makhana (foxnuts) with green tea", calories: 150, protein: "4g", carbs: "24g", fats: "3g" },
      { time: "08:30 PM", name: "Dinner", items: "Vegetable khichdi with ghee or light grilled chicken salad", calories: 430, protein: "22g", carbs: "55g", fats: "12g" },
    ],
  },
};

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MemberDashboardPage = () => {
  const { user, userData, loading, updateUserData } = useAuth();
  const router = useRouter();

  // Calendar State
  const [selectedDay, setSelectedDay] = useState("Mon");

  // Active workout execution state
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Water Tracker State
  const [waterIntakeMl, setWaterIntakeMl] = useState(1750);
  const waterGoalMl = 2500;

  // Visual View Mode: 3D Equipment vs 3D Avatar Demo
  const [visualMode, setVisualMode] = useState<"equipment" | "avatar">("equipment");

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !userData) {
      router.replace("/login");
    }
  }, [userData, loading, router]);

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

  const routine = WEEKLY_ROUTINES[selectedDay] || WEEKLY_ROUTINES.Mon;

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
  const progressPercent = Math.round((completedCount / (totalExercises || 1)) * 100);

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

  return (
    <div className="min-h-screen bg-[#060606] text-white p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#111111] via-[#161616] to-[#0A0A0A] border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(255,215,0,0.3)] bg-black">
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="Member Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-black text-3xl italic">
                    {userData?.name?.charAt(0) || "M"}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center" title="Active">
                <ShieldCheck size={14} className="text-black" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  Member Portal • Private Isolation
                </span>
                <span className="text-[10px] font-mono text-gray-400">ID: {userData?.memberId || "FT-2026"}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight">
                Welcome Back, <span className="ft-gradient-text">{userData?.name || user?.displayName || "Member"}</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>{todayFormatted}</span>
                <span className="text-gray-600">•</span>
                <span className="text-primary font-bold">Goal: {userData?.fitnessGoal || "Strength & Hypertrophy"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-4 py-3 bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all"
            >
              <QrCode size={16} className="text-primary" />
              <span>Gate Pass QR</span>
            </button>
            <div className="px-5 py-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {userData?.trainerName?.charAt(0) || "S"}
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Assigned Trainer</p>
                <p className="text-xs font-black uppercase italic text-primary">{userData?.trainerName || "Suraj Sir"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Today's Split</p>
            <p className="text-sm font-black uppercase italic text-white truncate max-w-[140px]">{routine.focus.split(" ")[0]}</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Workout Progress</p>
            <p className="text-lg font-black font-mono text-white">{progressPercent}%</p>
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

          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10">
            {daysOfWeek.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setActiveExerciseIndex(0);
                  }}
                  className={`px-3 md:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    isSelected
                      ? "bg-primary text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] scale-105"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {day}
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
              <GymEquipment3D equipment={activeExercise.equipmentName} />
            ) : (
              <FitnessAvatar3D exercise={activeExercise.name} />
            )}
          </div>

          {/* Advanced Rest Timer Component */}
          <WorkoutTimer
            initialSeconds={activeExercise.restSecs || 60}
            exerciseName={activeExercise.name}
            onNextExercise={handleNextExercise}
          />
        </div>
      </div>

      {/* 5. Member Diet System & Daily Hydration Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Daily Meal Schedule (8 cols) */}
        <div className="lg:col-span-8 glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Apple className="text-primary w-6 h-6" />
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-wider">
                  Personalized Nutrition Blueprint
                </h3>
                <p className="text-xs text-gray-400">Assigned meal timings, macronutrients & clean fuel</p>
              </div>
            </div>
            <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20">
              Total: ~2,400 kcal
            </span>
          </div>

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

      {/* 6. Gate Pass QR Modal */}
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
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${userData?.memberId || "FT-MEMBER-PASS"}`}
                  alt="Member Access QR"
                  className="w-44 h-44"
                />
              </div>

              <p className="text-xs font-mono font-bold text-primary">{userData?.memberId || "FT-2026-089"}</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                {userData?.membershipPlan || "Gold Annual Elite"}
              </p>

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

      {/* 7. Dedicated Full-Screen Workout Execution Arena */}
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
    </div>
  );
};

export default MemberDashboardPage;
