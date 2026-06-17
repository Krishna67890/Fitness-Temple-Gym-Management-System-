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
  VolumeX
} from "lucide-react";
import { useVoice } from "@/hooks/useVoice";

const exercises = [
// ... (rest of the code)
  {
    id: 1,
    name: "Barbell Squats",
    category: "Legs",
    difficulty: "Advanced",
    instructions: "1. Place barbell on upper traps. 2. Feet shoulder-width apart. 3. Squat down until thighs are parallel to floor. 4. Drive back up through heels.",
    muscles: ["Quads", "Glutes", "Hamstrings"],
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2158?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Bench Press",
    category: "Chest",
    difficulty: "Intermediate",
    instructions: "1. Lie flat on bench. 2. Grip bar slightly wider than shoulders. 3. Lower bar to mid-chest. 4. Press bar back up until arms are straight.",
    muscles: ["Chest", "Triceps", "Shoulders"],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Deadlifts",
    category: "Back",
    difficulty: "Advanced",
    instructions: "1. Feet hip-width apart. 2. Grip bar outside knees. 3. Keep back flat, chest up. 4. Stand up by extending hips and knees.",
    muscles: ["Back", "Hamstrings", "Glutes", "Core"],
    image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Pull Ups",
    category: "Back",
    difficulty: "Intermediate",
    instructions: "1. Grip bar wider than shoulders. 2. Pull body up until chin is over bar. 3. Lower body with control.",
    muscles: ["Lats", "Biceps", "Upper Back"],
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=2070&auto=format&fit=crop"
  }
];

const workouts = [
  {
    id: 1,
    title: "Full Body Blast",
    level: "Beginner",
    duration: "45 mins",
    calories: "350 kcal",
    exercisesCount: 8,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Muscle Gain Pro",
    level: "Advanced",
    duration: "75 mins",
    calories: "500 kcal",
    exercisesCount: 12,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef03a71018?q=80&w=2070&auto=format&fit=crop"
  }
];

const WorkoutsPage = () => {
  const { speak, stop, isSpeaking } = useVoice();
  const [view, setView] = useState<"plans" | "library">("plans");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<any>(null);
  const [localWorkouts, setLocalWorkouts] = useState(workouts);

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
            onClick={() => setView(view === "plans" ? "library" : "plans")}
            className="btn-outline py-3 px-6 flex items-center space-x-2"
          >
            <Dumbbell size={20} />
            <span className="text-sm">{view === "plans" ? "Browse Library" : "View My Plans"}</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary py-3 px-6 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span className="text-sm">Create New Plan</span>
          </button>
        </div>
      </div>

      {view === "plans" ? (
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
