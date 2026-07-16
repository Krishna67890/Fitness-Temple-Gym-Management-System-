"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Flame,
  Dumbbell,
  Clock,
  Zap,
  ChevronRight,
  ArrowLeft,
  Crown,
  Star,
  Activity
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: "goal",
    question: "What is your primary training goal?",
    options: [
      { id: "fat-loss", label: "Fat Loss & Toning", icon: Flame, desc: "Focus on cardio and high-intensity work." },
      { id: "muscle", label: "Muscle & Strength", icon: Dumbbell, desc: "Heavy lifting and hypertrophy focus." },
      { id: "performance", label: "Athletic Performance", icon: Zap, desc: "Agility, power, and functional sport training." }
    ]
  },
  {
    id: "experience",
    question: "What is your current fitness level?",
    options: [
      { id: "beg", label: "Beginner", icon: Activity, desc: "Just starting out or returning after a long break." },
      { id: "int", label: "Intermediate", icon: Star, desc: "Consistent training for 6-12 months." },
      { id: "adv", label: "Advanced Warrior", icon: Crown, desc: "Training for 2+ years with specific targets." }
    ]
  },
  {
    id: "frequency",
    question: "How many days per week can you devote?",
    options: [
      { id: "3days", label: "3 Days / Week", icon: Clock, desc: "Efficient full-body sessions." },
      { id: "5days", label: "5 Days / Week", icon: Clock, desc: "Standard PPL or Upper/Lower split." },
      { id: "6days", label: "6 Days / Week", icon: Clock, desc: "Elite Push-Pull-Legs curriculum." }
    ]
  }
];

const QuizPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [steps[currentStep].id]: optionId };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const getRecommendation = () => {
    if (answers.goal === 'muscle' && answers.experience === 'adv') {
      return {
        name: "Pro Annual Membership",
        price: "6000",
        period: "Year",
        benefit: "Personal Training Discount + Advanced PPL Access",
        link: "/register?plan=annual"
      };
    }
    if (answers.goal === 'fat-loss') {
      return {
        name: "Monthly + Cardio Plan",
        price: "800",
        period: "Month",
        benefit: "Unlimited HIIT & Cardio Suite Access",
        link: "/register?type=cardio"
      };
    }
    return {
      name: "Quarterly Transformation",
      price: "1800",
      period: "3 Months",
      benefit: "Full Diet Plan & Progress Tracking Included",
      link: "/register?plan=basic-3"
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="min-h-screen bg-[#050505] text-white py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <div className="flex gap-2">
                    {steps.map((_, i) => (
                      <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= currentStep ? "bg-primary" : "bg-white/10"}`} />
                    ))}
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                  {steps[currentStep].question}
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {steps[currentStep].options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className="glass p-6 rounded-[2rem] border border-white/5 text-left hover:border-primary/50 group transition-all flex items-center gap-6"
                  >
                    <div className="p-4 bg-white/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                      <opt.icon size={24} />
                    </div>
                    <div>
                      <p className="text-xl font-black uppercase italic leading-none mb-1 group-hover:text-primary transition-colors">{opt.label}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{opt.desc}</p>
                    </div>
                    <ChevronRight className="ml-auto text-gray-700 group-hover:text-primary" />
                  </button>
                ))}
              </div>

              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-all uppercase font-black text-[10px] tracking-widest"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="inline-block p-6 bg-primary/10 rounded-full text-primary mb-4">
                <Target size={48} className="animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-primary font-black uppercase tracking-[0.4em] text-sm">AI Recommendation</h2>
                <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">THE PERFECT <br /> <span className="ft-gradient-text">MATCH</span></h1>
              </div>

              <div className="glass p-10 rounded-[3rem] border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent relative overflow-hidden text-left">
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-4">Optimized for your profile</p>
                   <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{recommendation.name}</h3>
                   <p className="text-xl font-black italic text-gray-400 mb-8">₹{recommendation.price} / {recommendation.period}</p>

                   <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 mb-8">
                      <Zap className="text-primary" size={20} />
                      <p className="text-xs font-bold text-gray-300">{recommendation.benefit}</p>
                   </div>

                   <Link href={recommendation.link} className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase italic tracking-widest text-sm">
                      Enroll with this plan <ChevronRight size={20} />
                   </Link>
                </div>
                <Crown className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12" size={180} />
              </div>

              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentStep(0);
                  setAnswers({});
                }}
                className="text-gray-500 hover:text-white transition-all uppercase font-black text-[10px] tracking-widest"
              >
                Restart Quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;
