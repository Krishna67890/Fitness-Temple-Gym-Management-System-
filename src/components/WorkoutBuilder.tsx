"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Plus, Trash2, Zap, Save, RefreshCw, ChevronRight, X, Info, AlertTriangle, PlayCircle } from "lucide-react";
import { equipmentData } from "@/lib/gymData";

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
}

const WorkoutBuilder = () => {
  const [goal, setGoal] = useState("Muscle Building");
  const [level, setLevel] = useState("Beginner");
  const [workout, setWorkout] = useState<Exercise[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  const generateWorkout = () => {
    // Basic logic to pick equipment based on goal/level
    const pool = equipmentData.filter(e => {
      if (level === "Beginner") return e.difficulty === "Beginner" || e.difficulty === "All Levels";
      return true;
    });

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5).map(e => ({
      id: e.id,
      name: e.name,
      sets: e.sets,
      reps: e.reps
    }));

    setWorkout(selected);
    setIsGenerated(true);
  };

  const handleSave = () => {
    const saved = localStorage.getItem("fitnessTempleWorkouts") || "[]";
    const workouts = JSON.parse(saved);
    workouts.push({
      id: Date.now(),
      name: `${goal} - ${level}`,
      exercises: workout,
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem("fitnessTempleWorkouts", JSON.stringify(workouts));
    alert("Workout saved to your Temple Dashboard!");
  };

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden" id="workout-builder">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -z-10" />

      <div className="container">
        {/* Exercise Detail Modal */}
        <AnimatePresence>
          {selectedExercise && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedExercise(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] border-primary/20 p-8 md:p-12 relative z-10"
              >
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-primary hover:text-black rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>

                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary">
                      <PlayCircle size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{selectedExercise.name}</h3>
                      <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-2">{selectedExercise.category} • {selectedExercise.difficulty} Level</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedExercise.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest mb-4">
                        <Info size={14} className="text-primary" /> How to Perform
                      </h4>
                      <div className="space-y-3">
                        {selectedExercise.instructions?.map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                            <span className="text-primary font-black">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest mb-4">
                        <AlertTriangle size={14} className="text-red-500" /> Common Mistakes
                      </h4>
                      <div className="space-y-3">
                        {selectedExercise.mistakes?.map((mistake: string, idx: number) => (
                          <div key={idx} className="flex gap-3 text-xs text-gray-400 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                            <span>{mistake}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Target Muscles</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.primaryMuscles?.map((m: string) => (
                          <span key={m} className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-white border border-white/5">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-full py-5 bg-primary text-black font-black rounded-2xl uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Got It, Let's Lift
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4">Smart Generator</h2>
            <h2 className="section-title">Build Your <span className="ft-gradient-text">Temple Routine</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI-powered builder creates personalized routines based on our elite equipment and your fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-8">
              <div className="glass p-8 rounded-[2rem] border-white/5">
                <div className="mb-6">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block">Primary Goal</label>
                  <div className="space-y-2">
                    {["Muscle Building", "Fat Loss", "Strength Training"].map(g => (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                          goal === g ? "bg-primary text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 block">Experience Level</label>
                  <div className="flex gap-2">
                    {["Beginner", "Intermediate", "Advanced"].map(l => (
                      <button
                        key={l}
                        onClick={() => setLevel(l)}
                        className={`flex-1 text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                          level === l ? "bg-primary text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateWorkout}
                  className="w-full py-4 bg-primary text-black font-black rounded-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                >
                  <RefreshCw size={16} className={isGenerated ? "animate-spin-slow" : ""} />
                  {isGenerated ? "Regenerate" : "Generate Workout"}
                </button>
              </div>
            </div>

            {/* Display */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {isGenerated ? (
                  <motion.div
                    key="workout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass p-10 rounded-[3rem] border-primary/20"
                  >
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">{goal}</h3>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{level} Specialized</p>
                      </div>
                      <button
                        onClick={handleSave}
                        className="p-4 bg-white/5 text-primary rounded-2xl hover:bg-primary hover:text-black transition-all group"
                      >
                        <Save size={20} />
                      </button>
                    </div>

                    <div className="space-y-4 mb-10">
                      {workout.map((ex, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const details = equipmentData.find(e => e.id === ex.id);
                            setSelectedExercise(details || { name: ex.name, instructions: ["No details available."] });
                          }}
                          className="flex w-full items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group text-left"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all font-black">
                              {i + 1}
                            </div>
                            <div>
                              <h4 className="font-bold text-white uppercase tracking-tight">{ex.name}</h4>
                              <p className="text-xs text-gray-500 font-bold">{ex.sets} Sets • {ex.reps} Reps</p>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-gray-700 group-hover:text-primary transition-all" />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                      <Zap size={24} className="text-primary" />
                      <p className="text-xs text-gray-400 leading-relaxed">
                        <span className="text-white font-bold">Pro Tip:</span> Focus on controlled movements and mind-muscle connection. Rest 60-90 seconds between sets.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-20 glass rounded-[3rem] border-dashed border-white/10">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                      <Dumbbell size={40} className="text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Your Routine Awaits</h3>
                    <p className="text-gray-500 text-sm max-w-xs uppercase font-bold tracking-widest leading-loose">
                      Select your goals and level to generate a professional workout plan.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkoutBuilder;
