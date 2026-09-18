"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Target, Activity, Zap, CheckCircle2, TrendingUp } from "lucide-react";
import { membershipData } from "@/lib/gymData";

const MembershipWizard = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: "",
    experience: "",
    frequency: ""
  });

  const goals = [
    { id: "weight-loss", label: "Weight Loss", icon: Target },
    { id: "muscle-gain", label: "Muscle Gain", icon: Zap },
    { id: "strength", label: "Strength", icon: Activity },
    { id: "fitness", label: "General Fitness", icon: Sparkles }
  ];

  const experienceLevels = ["Beginner", "Intermediate", "Advanced"];
  const frequencies = ["2–3 days", "4–5 days", "6+ days"];

  const getRecommendation = () => {
    const annual = membershipData.find(m => m.id === "annual");
    const quarterly = membershipData.find(m => m.id === "quarterly");
    const monthly = membershipData.find(m => m.id === "monthly");

    if (answers.frequency === "6+ days" || answers.experience === "Advanced") {
      return {
        ...annual,
        why: "Based on your high training frequency and elite experience, the Annual Temple membership offers the maximum ROI and legacy status."
      };
    }
    if (answers.experience === "Intermediate" || answers.goal === "Muscle Gain") {
      return {
        ...quarterly,
        why: "Our 3-Month Pro plan is designed for those hitting the transition phase where consistency meets results."
      };
    }
    return {
      ...monthly,
      why: "Perfect for starting your journey and building the habit without a long-term commitment."
    };
  };

  const recommendation: any = getRecommendation();

  const handleComplete = () => {
    // Reward user for completing the wizard
    const currentXP = parseInt(localStorage.getItem("fitnessTempleXP") || "0");
    localStorage.setItem("fitnessTempleXP", (currentXP + 5).toString());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl glass p-10 md:p-14 rounded-[4rem] border-primary/20"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {step === 1 && (
              <div>
                <h3 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6">Plan Finder</h3>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-10">What&apos;s your goal?</h2>
                <div className="grid grid-cols-2 gap-4">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => { setAnswers({ ...answers, goal: g.label }); setStep(2); }}
                      className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all text-center group"
                    >
                      <g.icon size={24} className="mx-auto mb-4 text-gray-500 group-hover:text-primary transition-colors" />
                      <span className="text-white font-bold text-xs uppercase tracking-widest">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6">Experience</h3>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-10">Your level?</h2>
                <div className="space-y-4">
                  {experienceLevels.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setAnswers({ ...answers, experience: l }); setStep(3); }}
                      className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all text-left flex justify-between items-center group"
                    >
                      <span className="text-white font-bold uppercase tracking-widest">{l}</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                        <CheckCircle2 size={16} className="text-transparent group-hover:text-black" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6">Frequency</h3>
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-10">How often?</h2>
                <div className="space-y-4">
                  {frequencies.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setAnswers({ ...answers, frequency: f }); setStep(4); }}
                      className="w-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all text-left flex justify-between items-center group"
                    >
                      <span className="text-white font-bold uppercase tracking-widest">{f} / Week</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                        <CheckCircle2 size={16} className="text-transparent group-hover:text-black" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 shadow-[0_0_40px_rgba(255,215,0,0.2)]">
                  <Sparkles size={40} />
                </div>
                <h3 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Recommended For You</h3>
                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-6 leading-none">{recommendation.name}</h2>
                <div className="text-3xl font-black text-primary mb-8 tracking-tighter">₹{recommendation.price}</div>
                <p className="text-gray-400 leading-relaxed mb-12 text-sm italic">
                  &quot;{recommendation.why}&quot;
                </p>
                <button
                  onClick={handleComplete}
                  className="w-full py-6 bg-primary text-black font-black rounded-2xl hover:scale-[1.02] transition-all uppercase tracking-widest shadow-[0_20px_40px_-15px_rgba(255,215,0,0.3)] flex items-center justify-center gap-3"
                >
                  <TrendingUp size={20} /> Choose This Plan
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MembershipWizard;
