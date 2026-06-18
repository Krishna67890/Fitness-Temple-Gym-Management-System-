"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, X, Shield, Star, Crown, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    icon: Shield,
    price: "700",
    duration: "1 Month",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: [
      { name: "Gym Access", included: true },
      { name: "Basic Workout Guidance", included: true },
      { name: "Attendance Tracking", included: true },
      { name: "Locker Access", included: true },
      { name: "Monthly Progress Tracking", included: false },
      { name: "Diet Consultation", included: false },
      { name: "Digital Membership Card", included: true },
    ],
  },
  {
    id: "standard",
    name: "Standard Plan",
    icon: Star,
    price: "1800",
    duration: "3 Months",
    color: "text-primary",
    bgColor: "bg-primary/10",
    popular: true,
    features: [
      { name: "Gym Access", included: true },
      { name: "Full Workout Guidance", included: true },
      { name: "Attendance Tracking", included: true },
      { name: "Locker Access", included: true },
      { name: "Monthly Progress Tracking", included: true },
      { name: "Diet Consultation", included: true },
      { name: "Digital Membership Card", included: true },
    ],
  },
];

const MembershipPage = () => {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container">
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
        </div>

        {/* Special Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mb-20 p-[2px] rounded-[2.5rem] bg-gradient-to-r from-primary via-secondary to-primary"
        >
          <div className="bg-[#0A0A0A] rounded-[calc(2.5rem-2px)] p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="bg-primary/20 p-4 rounded-2xl">
                <Zap size={32} className="text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic leading-none mb-1">Limited Time Offer</h3>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Get started today at the Temple</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-4xl font-black text-white italic tracking-tighter">₹700 <span className="text-gray-500 text-lg">/ Month</span></span>
              <span className="text-primary font-black uppercase text-xs tracking-[0.2em]">All Features Included</span>
            </div>
          </div>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`relative glass p-10 md:p-16 rounded-[4rem] border-2 transition-all duration-500 ${
                plan.popular ? "border-primary shadow-[0_0_50px_rgba(255,0,0,0.1)] scale-105" : "border-white/5 hover:border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-16 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                  <Crown size={14} fill="white" />
                  Most Devoted
                </div>
              )}

              <div className="flex items-center gap-6 mb-12">
                <div className={`${plan.bgColor} p-6 rounded-3xl`}>
                  <plan.icon className={plan.color} size={40} />
                </div>
                <div>
                  <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-1">{plan.name}</h3>
                  <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">{plan.duration} Commitment</p>
                </div>
              </div>

              <div className="mb-12 border-b border-white/10 pb-12">
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black ft-gradient-text tracking-tighter">₹{plan.price}</span>
                  <span className="text-gray-500 font-black uppercase text-sm tracking-widest">Fixed Fee</span>
                </div>
              </div>

              <div className="space-y-8 mb-16">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">What's Included</h4>
                <div className="grid grid-cols-1 gap-6">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <span className={`font-bold text-lg tracking-tight ${feature.included ? "text-gray-200" : "text-gray-600 line-through"}`}>
                        {feature.name}
                      </span>
                      {feature.included ? (
                        <Check className="text-primary" size={20} strokeWidth={3} />
                      ) : (
                        <X className="text-gray-700" size={20} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/919665231230?text=Hello! I want to enroll in the ${plan.name} (${plan.duration}) at Fitness Temple Gym.`}
                target="_blank"
                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 text-lg ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-white hover:text-black shadow-[0_20px_40px_rgba(255,0,0,0.2)]"
                    : "bg-white/5 text-white border border-white/10 hover:bg-primary hover:border-primary"
                }`}
              >
                Enroll via WhatsApp
                <Zap size={20} fill="currentColor" />
              </a>
            </motion.div>
          ))}
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
