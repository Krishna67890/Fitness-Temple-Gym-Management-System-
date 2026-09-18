"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Shield, Zap, Sparkles, ChevronRight } from "lucide-react";

const GoalSelector = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("");

  useEffect(() => {
    const hasSetGoal = localStorage.getItem("fitnessTempleGoal");
    if (!hasSetGoal) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setStep(2);
  };

  const finalize = () => {
    localStorage.setItem("fitnessTempleGoal", selectedGoal);
    setIsVisible(false);
  };

  const goals = [
    { name: "Lose Fat", icon: Flame, color: "text-orange-500" },
    { name: "Build Muscle", icon: Shield, color: "text-blue-500" },
    { name: "Build Strength", icon: Zap, color: "text-primary" },
    { name: "I'm a Beginner", icon: Sparkles, color: "text-green-500" }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass p-10 md:p-14 rounded-[3.5rem] border-primary/20 text-center"
          >
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {step === 1 ? (
              <>
                <h3 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6">Welcome to The Temple</h3>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-[0.9]">
                  What are you <br/><span className="text-primary">training for?</span>
                </h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-12">Select your primary objective</p>

                <div className="grid grid-cols-1 gap-4">
                  {goals.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => handleGoalSelect(g.name)}
                      className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${g.color} group-hover:bg-primary group-hover:text-black transition-all`}>
                          <g.icon size={24} />
                        </div>
                        <span className="text-white font-black uppercase italic tracking-tight text-lg">{g.name}</span>
                      </div>
                      <ChevronRight className="text-gray-700 group-hover:text-primary transition-all" size={20} />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-10 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
                  <Shield size={40} />
                </div>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-6">Excellent Choice.</h2>
                <p className="text-gray-400 leading-relaxed mb-12 uppercase font-bold text-sm tracking-widest">
                  We've prepared Fitness Temple <br/>for your <span className="text-white">{selectedGoal}</span> journey.
                </p>
                <button
                  onClick={finalize}
                  className="w-full py-6 bg-primary text-black font-black rounded-2xl hover:scale-[1.02] transition-all uppercase tracking-widest shadow-[0_20px_40px_-15px_rgba(255,215,0,0.3)]"
                >
                  Enter The Temple
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GoalSelector;
