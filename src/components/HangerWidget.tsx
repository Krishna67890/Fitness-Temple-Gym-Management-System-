"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Dumbbell,
  Apple,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Calendar,
  Flame,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Zap,
  Activity,
  X,
  ShieldCheck,
} from "lucide-react";

// Elite Weekly Routine Data For All Users
export const WEEKLY_ROUTINES: Record<string, {
  dayName: string;
  focus: string;
  intensity: string;
  exercises: { name: string; sets: string; reps: string; target: string }[];
  trainerTip: string;
}> = {
  MON: {
    dayName: "Monday",
    focus: "Chest & Triceps Hypertrophy",
    intensity: "90% Max Effort",
    exercises: [
      { name: "Incline Barbell Bench Press", sets: "4 Sets", reps: "8-10 Reps", target: "Upper Pectorals" },
      { name: "Flat Dumbbell Press", sets: "4 Sets", reps: "10-12 Reps", target: "Mid Chest Mass" },
      { name: "Parallel Bar Dips (Weighted)", sets: "3 Sets", reps: "12-15 Reps", target: "Lower Chest & Triceps" },
      { name: "Cable Tricep Pushdowns", sets: "4 Sets", reps: "12-15 Reps", target: "Triceps Lateral Head" }
    ],
    trainerTip: "Keep shoulders retracted and maintain a 3-second eccentric lower on all pressing motions."
  },
  TUE: {
    dayName: "Tuesday",
    focus: "Back Width & Bicep Peak",
    intensity: "88% Max Effort",
    exercises: [
      { name: "Wide-Grip Lat Pulldowns", sets: "4 Sets", reps: "10-12 Reps", target: "Lats Width" },
      { name: "T-Bar Rows / Barbell Rows", sets: "4 Sets", reps: "8-10 Reps", target: "Mid-Back Thickness" },
      { name: "Seated Cable Rows", sets: "3 Sets", reps: "12 Reps", target: "Rhomboids & Lower Lat" },
      { name: "Incline Dumbbell Bicep Curls", sets: "4 Sets", reps: "10-12 Reps", target: "Biceps Long Head" }
    ],
    trainerTip: "Initiate the pull from your elbows, squeezing the shoulder blades together at peak contraction."
  },
  WED: {
    dayName: "Wednesday",
    focus: "Legs Power & Core Stability",
    intensity: "95% Max Effort",
    exercises: [
      { name: "Barbell Back Squats", sets: "5 Sets", reps: "6-8 Reps", target: "Quadriceps & Glutes" },
      { name: "Romanian Deadlifts (RDL)", sets: "4 Sets", reps: "8-10 Reps", target: "Hamstrings & Lower Back" },
      { name: "Leg Press (Heavy Load)", sets: "4 Sets", reps: "12 Reps", target: "Overall Leg Density" },
      { name: "Hanging Leg Raises", sets: "4 Sets", reps: "15-20 Reps", target: "Lower Abdominal Core" }
    ],
    trainerTip: "Drive knees outwards over toes during squats. Maintain brace in the abdominal wall."
  },
  THU: {
    dayName: "Thursday",
    focus: "Shoulder Boulder & Traps",
    intensity: "85% Max Effort",
    exercises: [
      { name: "Seated Overhead Dumbbell Press", sets: "4 Sets", reps: "8-10 Reps", target: "Anterior Deltoid" },
      { name: "Leaning Cable Lateral Raises", sets: "4 Sets", reps: "12-15 Reps", target: "Lateral Deltoid Caps" },
      { name: "Face Pulls with Rope", sets: "4 Sets", reps: "15-20 Reps", target: "Rear Delts & Rotator Cuff" },
      { name: "Heavy Dumbbell Shrugs", sets: "3 Sets", reps: "12-15 Reps", target: "Upper Trapezius" }
    ],
    trainerTip: "Keep elbows slightly in front of the body on lateral raises to isolate the side deltoid completely."
  },
  FRI: {
    dayName: "Friday",
    focus: "Arms Supersets & Forearms",
    intensity: "90% Max Effort",
    exercises: [
      { name: "EZ-Bar Preacher Curls", sets: "4 Sets", reps: "10-12 Reps", target: "Bicep Short Head Peak" },
      { name: "Skull Crushers (Lying Triceps)", sets: "4 Sets", reps: "10-12 Reps", target: "Tricep Long Head" },
      { name: "Hammer Curls with Rope", sets: "3 Sets", reps: "12 Reps", target: "Brachialis & Forearm" },
      { name: "Overhead Dumbbell Extension", sets: "3 Sets", reps: "12-15 Reps", target: "Tricep Deep Stretch" }
    ],
    trainerTip: "Perform curls and extensions back-to-back as supersets for massive blood volume pump."
  },
  SAT: {
    dayName: "Saturday",
    focus: "Full-Body Functional HIIT & Conditioning",
    intensity: "92% Max Effort",
    exercises: [
      { name: "Kettlebell Swings", sets: "4 Sets", reps: "20 Reps", target: "Posterior Chain Power" },
      { name: "Battle Ropes Waves & Slams", sets: "5 Sets", reps: "45 Secs", target: "Cardiovascular Stamina" },
      { name: "Medicine Ball Slams", sets: "4 Sets", reps: "15 Reps", target: "Explosive Core" },
      { name: "Assault Bike / Sprint Intervals", sets: "5 Sets", reps: "30s Sprint / 30s Rest", target: "Aerobic Capacity" }
    ],
    trainerTip: "Maintain high tempo with minimum transition rest. Breathe deeply through the diaphragm."
  },
  SUN: {
    dayName: "Sunday",
    focus: "Active Recovery & Fascial Mobility",
    intensity: "60% Restorative",
    exercises: [
      { name: "Full Body Foam Rolling", sets: "1 Flow", reps: "15 Mins", target: "Myofascial Release" },
      { name: "Dynamic Hip & Hamstring Yoga Flow", sets: "1 Flow", reps: "20 Mins", target: "Joint Mobility" },
      { name: "Incline Treadmill Zone 2 Walk", sets: "1 Set", reps: "25 Mins", target: "Lactic Acid Flush" }
    ],
    trainerTip: "Hydrate heavily with electrolytes today. Prepare your central nervous system for Monday's push."
  }
};

// Advanced Warrior Diet Protocol
export const WARRIOR_DIET_PLAN = [
  {
    time: "07:30 AM",
    title: "Morning Ignition",
    meal: "Warm Lemon Water with Himalayan Salt + 6 Soaked Almonds & 2 Walnuts",
    macros: "P: 4g • C: 3g • F: 10g",
    focus: "Cortisol balancing, hydration, vital minerals"
  },
  {
    time: "09:00 AM",
    title: "Power Breakfast",
    meal: "Rolled Oats (60g) cooked in almond milk + 1 scoop Whey Protein + 1 tbsp Peanut Butter & Blueberries",
    macros: "P: 34g • C: 52g • F: 12g",
    focus: "Complex carbs for sustained energy and anabolic threshold"
  },
  {
    time: "01:30 PM",
    title: "Anabolic Lunch",
    meal: "180g Grilled Chicken Breast or Spiced Paneer Tikka + 1 cup Brown Rice + Yellow Dal & Green Salad",
    macros: "P: 42g • C: 60g • F: 14g",
    focus: "Complete amino acid profile & digestive enzymes"
  },
  {
    time: "04:00 PM",
    title: "Pre-Workout Primer",
    meal: "1 Double Shot Espresso or Pre-Workout + 1 Banana with 1 slice Multigrain Toast",
    macros: "P: 5g • C: 36g • F: 2g",
    focus: "Blood flow vasodilation & glycogen replenishment"
  },
  {
    time: "06:30 PM",
    title: "Post-Workout Window",
    meal: "1 Scoop Whey Isolate + 5g Micronized Creatine Monohydrate with 300ml Chilled Water",
    macros: "P: 27g • C: 2g • F: 1g",
    focus: "Rapid muscle protein synthesis and ATP recovery"
  },
  {
    time: "08:30 PM",
    title: "Lean Recovery Dinner",
    meal: "Grilled Fish Fillet or Steamed Tofu Bowl with Sauteed Broccoli, Zucchini, Sweet Potato & Olive Oil",
    macros: "P: 38g • C: 28g • F: 12g",
    focus: "Nighttime cellular repair & hormone optimization"
  }
];

const daysMap = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function HangerWidget() {
  const [mounted, setMounted] = useState(false);
  const [timeString, setTimeString] = useState<string>("--:--:--");
  const [dateString, setDateString] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"routine" | "diet">("routine");
  const [selectedDay, setSelectedDay] = useState("MON");
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFullPlanModal, setShowFullPlanModal] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
      setDateString(
        now.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
      setSelectedDay(daysMap[now.getDay()] || "MON");
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentRoutine = WEEKLY_ROUTINES[selectedDay] || WEEKLY_ROUTINES["MON"];

  return (
    <div className="container px-4 -mt-16 relative z-30">
      {/* Hanging Chain Fasteners Anchored to Top */}
      <div className="flex justify-between max-w-4xl mx-auto px-12 pointer-events-none -mb-3 z-10 relative">
        {/* Left Chain */}
        <div className="flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-700 border-2 border-black shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
          <div className="w-1.5 h-7 bg-gradient-to-b from-gray-400 via-gray-200 to-amber-500 shadow-md border-x border-black/40" />
          <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-r from-gray-700 to-gray-900 border border-amber-400/80 -mt-1 shadow-md" />
        </div>

        {/* Right Chain */}
        <div className="flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-700 border-2 border-black shadow-[0_0_15px_rgba(255,215,0,0.6)]" />
          <div className="w-1.5 h-7 bg-gradient-to-b from-gray-400 via-gray-200 to-amber-500 shadow-md border-x border-black/40" />
          <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-r from-gray-700 to-gray-900 border border-amber-400/80 -mt-1 shadow-md" />
        </div>
      </div>

      {/* Main Hanging Board */}
      <motion.div
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="glass rounded-[2.5rem] border border-white/15 bg-[#080808]/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden relative"
      >
        {/* Subtle Top Metallic Rail */}
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {isMinimized ? (
          /* Minimized Bar */
          <div className="p-4 md:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                <Clock size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Arena Standard Time
                  </span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span className="text-[9px] font-black uppercase text-emerald-400">Open 4:30 PM</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black font-mono tracking-tight text-white mt-0.5">
                  {mounted ? timeString : "--:--:--"}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Today's Focus</span>
                <span className="text-xs font-black uppercase italic text-primary">{currentRoutine.focus}</span>
              </div>
              <button
                onClick={() => setIsMinimized(false)}
                className="px-4 py-2.5 bg-primary text-black hover:bg-primary/90 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              >
                <Maximize2 size={14} />
                <span>Expand Arsenal & Diet</span>
              </button>
            </div>
          </div>
        ) : (
          /* Expanded Full Widget */
          <div className="p-6 md:p-8">
            {/* Top Control Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-white/5 pb-6">
              {/* Real-time Clock Card (Hydration-Safe Client-Only Mounting) */}
              <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center justify-between group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary block">
                      Arena Standard Time
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black font-mono tracking-tight text-white mt-0.5">
                      {mounted ? timeString : "--:--:--"}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      {mounted ? dateString : "Live Schedule"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    OPEN 4:30 PM
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase mt-1">Evening Devotion</span>
                </div>
              </div>

              {/* Tab Selector & Controls */}
              <div className="lg:col-span-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-primary text-black text-[9px] font-black rounded-full uppercase tracking-wider">
                      Open To All Users
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                      Daily Gym Routine & Nutrition Protocol
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tight text-white">
                    Workout Routine & <span className="ft-gradient-text">Warrior Diet</span>
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* Toggle Tabs */}
                  <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                    <button
                      onClick={() => setActiveTab("routine")}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        activeTab === "routine"
                          ? "bg-primary text-black shadow-lg"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Dumbbell size={15} />
                      <span>Gym Routine</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("diet")}
                      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        activeTab === "diet"
                          ? "bg-primary text-black shadow-lg"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Apple size={15} />
                      <span>Warrior Diet</span>
                    </button>
                  </div>

                  {/* Minimize Button */}
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
                    title="Minimize Hanger"
                    aria-label="Minimize Hanger"
                  >
                    <Minimize2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Content Body */}
            <div className="pt-6">
              {activeTab === "routine" ? (
                <div>
                  {/* Day Selector Pills */}
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                    <div className="flex flex-wrap gap-2">
                      {(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const).map((day) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            selectedDay === day
                              ? "bg-primary text-black shadow-md scale-105"
                              : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black uppercase tracking-wider text-primary">
                        {currentRoutine.dayName} Target:
                      </span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white">
                        {currentRoutine.focus}
                      </span>
                      <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black text-red-400 uppercase">
                        {currentRoutine.intensity}
                      </span>
                    </div>
                  </div>

                  {/* Exercises Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currentRoutine.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-primary/30 transition-all group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                            {ex.sets}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">{ex.reps}</span>
                        </div>
                        <h4 className="text-sm font-black uppercase italic tracking-tight text-white group-hover:text-primary transition-colors">
                          {ex.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">
                          Focus: {ex.target}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Trainer Advice Footer */}
                  <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Sparkles size={16} />
                      </div>
                      <p className="text-xs text-gray-300 font-medium leading-relaxed">
                        <strong className="text-primary font-bold">Trainer Tip: </strong>
                        {currentRoutine.trainerTip}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowFullPlanModal(true)}
                      className="flex-shrink-0 px-4 py-2 bg-primary/20 border border-primary/40 hover:bg-primary hover:text-black rounded-xl text-xs font-black uppercase tracking-wider text-primary transition-all flex items-center gap-2"
                    >
                      <span>Full Week Arsenal</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Advanced Warrior Diet Schedule */
                <div>
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        High Performance Anabolic Fuel
                      </span>
                      <h3 className="text-lg font-black uppercase italic text-white">
                        Standard Daily Caloric & Micronutrient Protocol
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold rounded-xl">
                      Daily Target: ~2,500 kcal • 160g+ Protein
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {WARRIOR_DIET_PLAN.map((meal, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                              {meal.time}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono font-bold">
                              {meal.macros}
                            </span>
                          </div>
                          <h4 className="text-sm font-black uppercase italic text-white mt-1">
                            {meal.title}
                          </h4>
                          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                            {meal.meal}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                          <span className="text-primary font-bold">Purpose</span>
                          <span>{meal.focus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Full Week Workout Arsenal Modal */}
      <AnimatePresence>
        {showFullPlanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass max-w-4xl w-full p-6 md:p-8 rounded-[2.5rem] border border-white/10 max-h-[85vh] overflow-y-auto no-scrollbar relative"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-2xl font-black uppercase italic text-white">
                    Official 7-Day Arena Blueprint
                  </h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-widest mt-0.5">
                    Universal Training Split & Progressive Overload
                  </p>
                </div>
                <button
                  onClick={() => setShowFullPlanModal(false)}
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(WEEKLY_ROUTINES).map(([dayKey, r]) => (
                  <div key={dayKey} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-primary/20 text-primary font-black font-mono flex items-center justify-center text-sm border border-primary/30">
                          {dayKey}
                        </span>
                        <div>
                          <h4 className="text-base font-black uppercase italic text-white">{r.dayName}</h4>
                          <p className="text-xs text-primary font-bold">{r.focus}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                        {r.intensity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                      {r.exercises.map((ex, i) => (
                        <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/5">
                          <p className="text-xs font-bold text-white">{ex.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-1">{ex.sets} • {ex.reps}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowFullPlanModal(false)}
                className="mt-6 w-full py-4 bg-primary text-black rounded-2xl text-xs font-black uppercase tracking-wider"
              >
                Close Blueprint
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
