"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Dumbbell,
  TrendingUp,
  QrCode,
  Clock,
  CreditCard,
  ChefHat,
  MessageCircle,
  LogOut,
  Weight,
  Target,
  Ruler
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const MemberDashboard = () => {
  const router = useRouter();
  const { userData: memberData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!memberData) return null;

  const workoutPlans = {
    beginner: ["Push-ups", "Squats", "Plank", "Walking", "Jumping Jacks"],
    intermediate: ["Bench Press", "Deadlift", "Pull-Ups", "Shoulder Press", "Barbell Rows"],
    advanced: ["Powerlifting Program", "Bodybuilding Split", "Functional Training", "HIIT Workouts", "Athletic Conditioning"]
  };

  const dietPlans = [
    "Weight Loss Diet", "Weight Gain Diet", "Muscle Gain Diet",
    "Vegetarian Diet", "Non-Vegetarian Diet", "Maintenance Diet"
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              {memberData.profileImage ? (
                <img src={memberData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-black italic">
                  {memberData.fullName?.charAt(0)}
                </div>
              )}
           </div>
           <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                Warrior <span className="ft-gradient-text">{memberData.fullName?.split(' ')[0]}</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                ID: {memberData.memberId} • {memberData.fitnessGoal?.replace('-', ' ')}
              </p>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl flex items-center gap-3">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#FFD700]" />
             <span className="text-primary text-[10px] font-black uppercase tracking-widest">Tribe Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Membership Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="relative aspect-[1.6/1] bg-gradient-to-br from-primary to-yellow-600 rounded-[2.5rem] p-6 overflow-hidden shadow-2xl group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
               <Dumbbell size={80} className="text-black" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between text-black">
              <div>
                <h3 className="font-black uppercase italic text-xl tracking-tighter leading-none">Fitness Temple</h3>
                <p className="font-bold text-[8px] uppercase tracking-[0.3em] opacity-60">Elite Member Access</p>
              </div>
              <div>
                <h4 className="font-black text-lg uppercase tracking-widest leading-none truncate">{memberData.fullName}</h4>
                <p className="font-bold text-xs tracking-widest opacity-80 mt-1">{memberData.memberId}</p>
              </div>
            </div>
          </motion.div>

          {/* Check-in QR */}
          <div className="glass p-6 rounded-[2.5rem] text-center border-white/5 bg-black/40">
            <div className="bg-white p-3 rounded-2xl inline-block mb-4 shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${memberData.memberId}`}
                alt="Member QR Code"
                className="w-[120px] h-[120px]"
              />
            </div>
            <h4 className="text-sm font-black uppercase italic tracking-tight mb-1">Gate Pass</h4>
            <p className="text-gray-600 text-[8px] font-black uppercase tracking-[0.2em]">Scan at Front Desk</p>
          </div>

          {/* Plan Info */}
          <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-4 bg-white/[0.02]">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Subscription</h4>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Type</span>
                  <span className="text-white font-black uppercase italic">{memberData.membershipType}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Valid Until</span>
                  <span className="text-white font-black uppercase italic">Next Month</span>
                </div>
             </div>
             <button className="w-full bg-white/5 border border-white/10 hover:bg-primary hover:text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Upgrade Plan
             </button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3 space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Weight", value: `${memberData.weight || "--"} KG`, icon: Weight, color: "text-blue-400" },
              { label: "Height", value: `${memberData.height || "--"} CM`, icon: Ruler, color: "text-purple-400" },
              { label: "Age", value: `${memberData.age || "--"} YRS`, icon: Calendar, color: "text-green-400" },
              { label: "Goal", value: memberData.fitnessGoal?.split('-')[0] || "FIT", icon: Target, color: "text-primary" },
            ].map((stat, i) => (
              <div key={i} className="glass p-5 rounded-3xl border-white/5 flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors">
                <stat.icon className={`${stat.color} mb-3`} size={20} />
                <h5 className="text-xl font-black italic leading-none mb-1">{stat.value}</h5>
                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Workouts Section */}
            <div className="glass p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Dumbbell size={20} />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">Active Plan</h3>
                </div>
                <button className="text-[10px] font-black uppercase text-primary tracking-widest">Change</button>
              </div>

              <div className="space-y-3">
                {workoutPlans.beginner.map((ex, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-primary/30 transition-all group"
                  >
                     <div className="flex items-center gap-3">
                        <span className="text-primary font-black italic text-xs">{i+1}.</span>
                        <span className="text-sm font-bold text-gray-300">{ex}</span>
                     </div>
                     <span className="text-[10px] text-gray-600 font-black uppercase italic">Ready</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Diet Section */}
            <div className="glass p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                    <ChefHat size={20} />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">Fuel Log</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-primary text-black rounded-3xl shadow-lg mb-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Today's Focus</p>
                    <p className="text-lg font-black uppercase italic leading-tight">High Protein Intake</p>
                    <p className="text-xs font-bold mt-2 opacity-80">Target: {parseInt(memberData.weight || "70") * 2}g Protein</p>
                  </div>
                  <ChefHat className="absolute right-[-10px] bottom-[-10px] opacity-10" size={80} />
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {dietPlans.slice(0, 5).map((diet, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors">{diet}</span>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-800 group-hover:text-primary">View</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tribe Connect */}
          <div className="glass p-8 rounded-[3rem] border-white/5 bg-gradient-to-r from-primary/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="p-4 bg-white/5 rounded-full">
                   <MessageCircle className="text-primary" size={24} />
                </div>
                <div>
                   <h4 className="text-lg font-black uppercase italic tracking-tight">Need Support?</h4>
                   <p className="text-xs text-gray-500 font-bold">Coach Sanket is online and ready to help.</p>
                </div>
             </div>
             <Link href="/contact" className="w-full md:w-auto px-10 py-4 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl hover:scale-105 transition-all text-center text-sm">
                Start Chat
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
