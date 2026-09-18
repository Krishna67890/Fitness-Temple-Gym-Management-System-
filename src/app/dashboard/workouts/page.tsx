"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Dumbbell,
  Clock,
  Flame,
  ChevronRight,
  Filter,
  PlayCircle,
  X,
  Check,
  ChevronLeft,
  Info,
  Youtube,
  Trophy,
  Volume2,
  VolumeX,
  Calendar,
  Activity,
  Heart,
  Zap,
  Mic
} from "lucide-react";
import { useVoice } from "@/hooks/useVoice";
import { useAuth } from "@/context/AuthContext";

// Advanced Workout Engine Data
const weeklyRoutine = {
  Monday: { focus: "Chest & Triceps", exercises: ["Bench Press", "Incline DB Press", "Tricep Pushdowns"], color: "from-blue-500/20" },
  Tuesday: { focus: "Back & Biceps", exercises: ["Deadlifts", "Pull-ups", "Barbell Curls"], color: "from-emerald-500/20" },
  Wednesday: { focus: "Legs & Core", exercises: ["Squats", "Leg Press", "Plank"], color: "from-orange-500/20" },
  Thursday: { focus: "Shoulders & Front", exercises: ["Overhead Press", "Lateral Raises", "Front Raises"], color: "from-purple-500/20" },
  Friday: { focus: "Chest & Back (Hypertrophy)", exercises: ["DB Flyes", "Rows", "Pulldowns"], color: "from-pink-500/20" },
  Saturday: { focus: "Arms & Weak Points", exercises: ["Skull Crushers", "Hammer Curls", "Calf Raises"], color: "from-yellow-500/20" },
  Sunday: { focus: "Rest & Recovery", exercises: ["Stretching", "Light Walking"], color: "from-gray-500/20" }
};

const WorkoutsPage = () => {
  const { userData } = useAuth();
  const role = userData?.role || 'member';
  const { speak, stop, isSpeaking } = useVoice();
  const [view, setView] = useState<"plans" | "library" | "calendar" | "wearable">("calendar");
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [isListening, setIsListening] = useState(false);

  const [newPlan, setNewPlan] = useState({
    name: "",
    duration: 4,
    difficulty: "Beginner"
  });

  const handleCreatePlan = () => {
    if (!newPlan.name) return alert("Please enter a plan name");

    const createdPlan = {
        id: Date.now(),
        title: newPlan.name,
        level: newPlan.difficulty,
        duration: `${newPlan.duration} weeks`,
        calories: "---",
        exercisesCount: 0,
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
        isNew: true
    };

    setLocalWorkouts([...localWorkouts, createdPlan]);
    setShowCreateModal(false);
    alert("New plan initialized successfully!");
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic mb-2">
            Workout <span className="text-primary">{view === "plans" ? "Plans" : "Library"}</span>
          </h1>
          <p className="text-gray-400">
            {view === "plans"
              ? "Personalized workout routines for every fitness goal."
              : "Advanced exercise database with professional instructions."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setView("calendar")}
            className={`btn-outline py-3 px-6 flex items-center space-x-2 ${view === 'calendar' ? 'border-primary text-primary' : ''}`}
          >
            <Calendar size={20} />
            <span className="text-sm">Calendar</span>
          </button>
          <button
            onClick={() => setView("wearable")}
            className={`btn-outline py-3 px-6 flex items-center space-x-2 ${view === 'wearable' ? 'border-primary text-primary' : ''}`}
          >
            <Activity size={20} />
            <span className="text-sm">Wearable Sync</span>
          </button>
          <button
            onClick={() => setView(view === "plans" ? "library" : "plans")}
            className="btn-outline py-3 px-6 flex items-center space-x-2"
          >
            <Dumbbell size={20} />
            <span className="text-sm">{view === "plans" ? "Library" : "Plans"}</span>
          </button>
          {(role === 'owner' || role === 'trainer') && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary py-3 px-6 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span className="text-sm">Create New Plan</span>
            </button>
          )}
        </div>
      </div>

      {view === "calendar" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.keys(weeklyRoutine).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`glass p-4 rounded-3xl border transition-all text-center ${
                  selectedDay === day ? 'border-primary bg-primary/10' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <p className="text-[10px] font-black uppercase text-gray-500">{day.substring(0, 3)}</p>
                <p className={`text-sm font-bold ${selectedDay === day ? 'text-primary' : ''}`}>{day === 'Sunday' ? 'Rest' : 'Workout'}</p>
              </button>
            ))}
          </div>

          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass p-8 rounded-[3rem] border border-white/10 bg-gradient-to-br ${weeklyRoutine[selectedDay as keyof typeof weeklyRoutine].color} to-transparent`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <span className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/20 px-3 py-1 rounded-full mb-3 inline-block">
                  Current Session: {selectedDay}
                </span>
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">
                  {weeklyRoutine[selectedDay as keyof typeof weeklyRoutine].focus.split(' ')[0]} <span className="text-primary">{weeklyRoutine[selectedDay as keyof typeof weeklyRoutine].focus.split(' ').slice(1).join(' ')}</span>
                </h2>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const routine = weeklyRoutine[selectedDay as keyof typeof weeklyRoutine];
                    speak(`Today is ${selectedDay}. Your focus is ${routine.focus}. You have ${routine.exercises.length} exercises scheduled: ${routine.exercises.join(', ')}. Let's get to work!`);
                  }}
                  className="w-14 h-14 bg-primary text-black rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                >
                  <Volume2 size={24} />
                </button>
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10'}`}
                >
                  <Mic size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weeklyRoutine[selectedDay as keyof typeof weeklyRoutine].exercises.map((ex, i) => (
                <div key={i} className="glass p-6 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-primary">
                      {i + 1}
                    </div>
                    <PlayCircle size={20} className="text-gray-500 group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="text-lg font-black uppercase italic mb-1">{ex}</h4>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">3 Sets • 12 Reps • 60s Rest</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : view === "wearable" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-8 rounded-[3rem] border border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:scale-110 transition-transform">
                <Heart size={120} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                <Heart size={14} className="text-red-500" /> Live Heart Rate
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black italic">128</span>
                <span className="text-xl font-bold text-gray-400 uppercase">BPM</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-green-400 text-[10px] font-black uppercase">
                <Activity size={12} /> Target Zone: Aerobic
              </div>
            </div>

            <div className="glass p-8 rounded-[3rem] border border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:scale-110 transition-transform">
                <Flame size={120} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                <Flame size={14} className="text-orange-500" /> Active Calories
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black italic">482</span>
                <span className="text-xl font-bold text-gray-400 uppercase">KCAL</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-primary text-[10px] font-black uppercase">
                <Zap size={12} /> 65% of daily goal
              </div>
            </div>

            <div className="glass p-8 rounded-[3rem] border border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:scale-110 transition-transform">
                <Activity size={120} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2">
                <Activity size={14} className="text-blue-500" /> Recovery Score
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black italic">84</span>
                <span className="text-xl font-bold text-gray-400 uppercase">%</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase">
                <Check size={12} /> Ready for high intensity
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] border border-white/10 text-center">
            <h3 className="text-2xl font-black uppercase italic mb-4">Connect <span className="text-primary">Wearables</span></h3>
            <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
              Sync your Apple Watch, Garmin, or WHOOP to unlock deep bio-metric insights and adaptive workout intensity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase border border-white/10 transition-all">Link Apple Health</button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase border border-white/10 transition-all">Link Google Fit</button>
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase border border-white/10 transition-all">Link Garmin</button>
            </div>
          </div>
        </div>
      ) : view === "plans" ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4 space-y-6">
            {/* Workout Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => setSelectedPlanDetails(workout)}
                  className="glass rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/5 hover:border-primary/50 transition-all"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img src={workout.image} alt={workout.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <span className="bg-primary text-black text-[10px] font-black uppercase px-2 py-1 rounded-md mb-2 inline-block">
                        {workout.level}
                      </span>
                      <h3 className="text-xl font-black uppercase italic">{workout.title}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} className="text-primary" />
                        <span className="text-xs text-gray-400 font-bold">{workout.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Flame size={16} className="text-primary" />
                        <span className="text-xs text-gray-400 font-bold">{workout.calories}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dumbbell size={16} className="text-primary" />
                        <span className="text-xs text-gray-400 font-bold">{workout.exercisesCount} Exer.</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/4 space-y-6">
             <div className="glass p-6 rounded-[2.5rem]">
                <h3 className="text-lg font-black uppercase italic mb-6">Recent <span className="text-primary">Achievement</span></h3>
                <div className="flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Trophy size={40} className="text-primary" />
                   </div>
                   <p className="text-sm font-bold">10 Day Streak!</p>
                   <p className="text-[10px] text-gray-500 uppercase font-black">You're on fire, keep it up!</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search exercises by name or muscle group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-primary outline-none"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className="glass rounded-3xl overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
                >
                   <div className="h-40 relative">
                      <img src={ex.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute top-3 right-3">
                         <span className="text-[8px] font-black uppercase px-2 py-1 bg-white/10 backdrop-blur-md rounded-md">{ex.difficulty}</span>
                      </div>
                   </div>
                   <div className="p-4">
                      <h4 className="font-black uppercase italic text-sm mb-1">{ex.name}</h4>
                      <div className="flex flex-wrap gap-1">
                         {ex.muscles.map(m => (
                           <span key={m} className="text-[8px] text-primary font-bold uppercase">{m}</span>
                         ))}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedExercise(null)} />
           <div className="relative glass w-full max-w-2xl rounded-[3rem] overflow-hidden">
              <button onClick={() => setSelectedExercise(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full z-10">
                 <X size={24} />
              </button>
              <div className="h-64 relative">
                 <img src={selectedExercise.image} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                 <div className="absolute bottom-6 left-8">
                    <p className="text-primary text-xs font-black uppercase mb-1">{selectedExercise.category}</p>
                    <h2 className="text-3xl font-black uppercase italic">{selectedExercise.name}</h2>
                 </div>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <div className="flex items-center justify-between mb-3">
                       <h4 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                          <Info size={14} /> Instructions
                       </h4>
                       <button
                         onClick={() => isSpeaking ? stop() : speak(`${selectedExercise.name}. Instructions: ${selectedExercise.instructions}`)}
                         className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-primary text-black' : 'bg-white/5 text-primary hover:bg-white/10'}`}
                       >
                          {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                       </button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedExercise.instructions}</p>
                 </div>
                 <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex gap-2">
                       <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase transition-all">
                          <Youtube size={16} className="text-red-500" /> Watch Video
                       </button>
                    </div>
                    <button className="btn-primary py-2 px-6 text-[10px]">Add to Plan</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
           <div className="relative glass w-full max-w-xl p-10 rounded-[3rem] border border-white/10">
              <h2 className="text-2xl font-black uppercase italic mb-6">Create New <span className="text-primary">Plan</span></h2>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-500">Plan Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Summer Shred"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-500">Duration (Weeks)</label>
                       <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                        value={newPlan.duration}
                        onChange={(e) => setNewPlan({...newPlan, duration: parseInt(e.target.value)})}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-gray-500">Difficulty</label>
                       <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                        value={newPlan.difficulty}
                        onChange={(e) => setNewPlan({...newPlan, difficulty: e.target.value})}
                       >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                       </select>
                    </div>
                 </div>
                 <div className="pt-6">
                    <button onClick={handleCreatePlan} className="btn-primary w-full py-4 text-xs">Initialize Plan</button>
                    <button onClick={() => setShowCreateModal(false)} className="w-full mt-2 py-4 text-[10px] font-black uppercase text-gray-500 hover:text-white">Cancel</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Plan Details Modal */}
      {selectedPlanDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedPlanDetails(null)} />
          <div className="relative glass w-full max-w-3xl rounded-[3rem] overflow-hidden max-h-[90vh] overflow-y-auto border border-white/10">
            <button onClick={() => setSelectedPlanDetails(null)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full z-10">
              <X size={24} />
            </button>
            <div className="h-48 relative">
              <img src={selectedPlanDetails.image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <div className="absolute bottom-6 left-8">
                <span className="bg-primary text-black text-[10px] font-black uppercase px-2 py-1 rounded-md mb-2 inline-block">
                  {selectedPlanDetails.level}
                </span>
                <h2 className="text-3xl font-black uppercase italic">{selectedPlanDetails.title}</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <Clock className="mx-auto mb-1 text-primary" size={20} />
                  <p className="text-[10px] font-black uppercase text-gray-500">Duration</p>
                  <p className="text-sm font-bold">{selectedPlanDetails.duration}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <Flame className="mx-auto mb-1 text-primary" size={20} />
                  <p className="text-[10px] font-black uppercase text-gray-500">Target</p>
                  <p className="text-sm font-bold">{selectedPlanDetails.calories}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl text-center">
                  <Dumbbell className="mx-auto mb-1 text-primary" size={20} />
                  <p className="text-[10px] font-black uppercase text-gray-500">Exercises</p>
                  <p className="text-sm font-bold">{selectedPlanDetails.exercisesCount}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase italic">Recommended <span className="text-primary">Exercises</span></h3>
                  <button
                    onClick={() => {
                      const allExercises = exercises.map((ex, i) => `Exercise ${i+1}: ${ex.name}`).join('. ');
                      const fullSpeech = `Here is your ${selectedPlanDetails.title} routine. It includes: ${allExercises}. Let's get to work!`;
                      isSpeaking ? stop() : speak(fullSpeech);
                    }}
                    className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-primary text-black' : 'bg-white/5 text-primary hover:bg-white/10'}`}
                  >
                    {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
                {exercises.map((ex, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                    <img src={ex.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">{ex.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{ex.muscles.join(', ')}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (isSpeaking) {
                          stop();
                        } else {
                          speak(`${ex.name}. Focusing on ${ex.muscles.join(' and ')}. Instructions: ${ex.instructions}`);
                        }
                      }}
                      className={`p-2 rounded-lg transition-all ${isSpeaking ? 'bg-primary text-black' : 'hover:bg-primary hover:text-black'}`}
                    >
                      {isSpeaking ? <VolumeX size={20} /> : <PlayCircle size={20} />}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    speak(`Great choice! Starting the ${selectedPlanDetails.title} plan. Let's crush those goals!`);
                    // Logic to set as active plan could go here
                  }}
                  className="btn-primary w-full py-4 uppercase font-black italic"
                >
                  Start This Plan Today
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutsPage;
