"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, X, Shield, Star, Crown, Zap, Dumbbell, Activity, Target } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "basic-1",
    name: "Monthly Plan",
    icon: Shield,
    price: "700",
    duration: "1 Month",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: ["Gym Access", "Basic Workout Guidance", "Locker Access", "Digital ID Card"],
  },
  {
    id: "basic-3",
    name: "Quarterly Plan",
    icon: Star,
    price: "1800",
    duration: "3 Months",
    color: "text-primary",
    bgColor: "bg-primary/10",
    popular: true,
    features: ["Gym Access", "Full Workout Guidance", "Diet Consultation", "Progress Tracking"],
  },
  {
    id: "basic-6",
    name: "Half-Year Plan",
    icon: Activity,
    price: "3500",
    duration: "6 Months",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: ["All Quarterly Features", "Priority Support", "Personalized Adjustments", "Free Assessment"],
  },
  {
    id: "basic-12",
    name: "Annual Plan",
    icon: Crown,
    price: "6000",
    duration: "12 Months",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    bestValue: true,
    features: ["Best Value (₹500/Mo)", "Full Temple Access", "All-Season Guidance", "Legacy Status"],
  },
];

const cardioPlans = [
  { name: "Monthly + Cardio", price: "800", duration: "1 Month" },
  { name: "Quarterly + Cardio", price: "2000", duration: "3 Months" },
  { name: "Half-Year + Cardio", price: "4000", duration: "6 Months" },
  { name: "Annual + Cardio", price: "7000", duration: "12 Months" },
];

const MembershipPage = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-sm mb-6"
          >
            Invest In Yourself
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-8"
          >
            MEMBERSHIP <span className="ft-gradient-text">PLANS</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Choose the plan that fits your goals. From short-term intensity to long-term devotion.
          </p>
          <div className="mt-8">
            <Link href="/membership/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-all group">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary">Not sure? Take our AI Membership Quiz</span>
              <ChevronRight size={14} className="text-gray-600 group-hover:text-primary" />
            </Link>
          </div>
        </div>

        {/* Best Value Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mb-20 p-[2px] rounded-[2.5rem] bg-gradient-to-r from-primary via-secondary to-primary"
        >
          <div className="bg-[#0A0A0A] rounded-[calc(2.5rem-2px)] p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="bg-primary/20 p-4 rounded-2xl">
                <Crown size={32} className="text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic leading-none mb-1 text-white">Best Value Selection</h3>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Annual Membership Only ₹6000 (₹500/Month)</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Link href="/register?plan=annual" className="btn-primary px-8 py-3 rounded-xl text-xs font-black uppercase italic">
                Get Annual Deal
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-24">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass p-8 rounded-[3rem] border transition-all relative flex flex-col ${
                plan.popular ? "border-primary/50 shadow-[0_0_30px_rgba(255,215,0,0.1)] scale-105 z-10" : "border-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Most Popular
                </div>
              )}
              {plan.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Best Value
                </div>
              )}

              <div className={`${plan.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                <plan.icon className={plan.color} size={28} />
              </div>

              <h3 className="text-2xl font-black uppercase italic mb-1 text-white">{plan.name}</h3>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-6">{plan.duration} Commitment</p>

              <div className="mb-8">
                <span className="text-4xl font-black text-white italic tracking-tighter">₹{plan.price}</span>
                <span className="text-gray-500 text-xs font-bold uppercase ml-2">Total</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="text-primary" size={14} strokeWidth={3} />
                    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/register?plan=${plan.id}`}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                  plan.popular ? "bg-primary text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                }`}
              >
                Enroll Now
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Gym + Cardio Section */}
          <div className="glass p-10 rounded-[4rem] border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12">
                <Activity size={200} />
             </div>
             <div className="relative z-10">
               <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-4">
                  <Activity className="text-primary" size={32} />
                  🏃 GYM + <span className="text-primary">CARDIO</span>
               </h3>
               <div className="space-y-4 mb-10">
                 {cardioPlans.map((plan, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-3xl group hover:border-primary/50 transition-all">
                     <div>
                       <p className="text-lg font-black uppercase italic text-white leading-none mb-1">{plan.name}</p>
                       <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{plan.duration}</p>
                     </div>
                     <span className="text-2xl font-black text-primary italic tracking-tighter group-hover:scale-110 transition-transform">₹{plan.price}</span>
                   </div>
                 ))}
               </div>
               <Link href="/register?type=cardio" className="btn-primary w-full py-5 rounded-2xl text-sm font-black uppercase italic text-center">
                  Enroll In Cardio Plan
               </Link>
             </div>
          </div>

          {/* Personal Training Section */}
          <div className="glass p-10 rounded-[4rem] border-white/5 relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent">
             <div className="absolute top-0 right-0 p-10 opacity-10 -rotate-12">
                <Dumbbell size={200} />
             </div>
             <div className="relative z-10 h-full flex flex-col">
               <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4 flex items-center gap-4">
                  <Target className="text-primary" size={32} />
                  👨‍🏫 PERSONAL <span className="text-primary">TRAINING</span>
               </h3>
               <p className="text-gray-400 font-medium italic text-lg mb-8 leading-relaxed">
                 Work directly with Coach Suraj or Coach Sanket for a completely customized fitness experience tailored to your unique biology.
               </p>

               <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border border-primary/20 mb-8 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2">Service Fee</p>
                    <p className="text-5xl font-black italic tracking-tighter text-white">₹3000 <span className="text-sm text-gray-500 uppercase">/ Month</span></p>
                  </div>
                  <div className="p-4 bg-primary/20 rounded-full">
                     <Star size={32} className="text-primary animate-pulse" fill="currentColor" />
                  </div>
               </div>

               <Link href="https://wa.me/919665231230?text=I'm interested in Personal Training with Coach Suraj/Sanket" className="btn-primary w-full py-5 rounded-2xl text-sm font-black uppercase italic text-center">
                  Book Professional Coach
               </Link>
             </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto border-t border-white/5 pt-24">
           {[
             { title: "WhatsApp Support", desc: "Talk directly to the owner for any queries or payments." },
             { title: "Quick Enrollment", desc: "Enroll instantly via WhatsApp and get started today." },
             { title: "Direct Payment", desc: "Pay securely via WhatsApp and receive your digital receipt." }
           ].map((f, i) => (
             <div key={i} className="text-center group">
                <div className="w-16 h-1 bg-primary/20 mx-auto mb-8 group-hover:w-32 transition-all duration-500" />
                <h4 className="text-2xl font-black uppercase italic tracking-tight mb-4">{f.title}</h4>
                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
