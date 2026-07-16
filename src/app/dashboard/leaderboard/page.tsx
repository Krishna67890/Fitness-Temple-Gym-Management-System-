"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  Dumbbell,
  TrendingUp,
  Search,
  Filter,
  User,
  Zap
} from "lucide-react";

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState<"strength" | "attendance" | "transformation">("strength");

  const leaders = [
    { id: 1, name: "Krishna Patil", score: "240kg", type: "Deadlift", rank: 1, avatar: null, trend: "up", change: "+5kg" },
    { id: 2, name: "Suraj Rathod", score: "210kg", type: "Deadlift", rank: 2, avatar: null, trend: "up", change: "+10kg" },
    { id: 3, name: "Sanket Patil", score: "190kg", type: "Deadlift", rank: 3, avatar: null, trend: "down", change: "-2kg" },
    { id: 4, name: "Omkar G.", score: "185kg", type: "Deadlift", rank: 4, avatar: null, trend: "up", change: "+15kg" },
    { id: 5, name: "Siddhant K.", score: "170kg", type: "Deadlift", rank: 5, avatar: null, trend: "stable", change: "0kg" },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Arena <span className="ft-gradient-text">Leaderboard</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Honoring the strongest warriors of the temple</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
           {["strength", "attendance", "transformation"].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}
             >
                {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto pt-12">
        {/* Silver - Rank 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="order-2 md:order-1"
        >
          <div className="glass p-8 rounded-[3rem] border-white/5 text-center relative pt-16">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
               <div className="w-24 h-24 rounded-3xl bg-gray-400/20 p-1">
                  <div className="w-full h-full bg-[#0A0A0A] rounded-2xl flex items-center justify-center text-gray-400">
                    <Medal size={48} />
                  </div>
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-400 text-black rounded-full flex items-center justify-center font-black italic">2</div>
            </div>
            <h3 className="text-xl font-black uppercase italic truncate">{leaders[1].name}</h3>
            <p className="text-primary font-black text-2xl mt-2 tracking-tighter">{leaders[1].score}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{leaders[1].type}</p>
          </div>
        </motion.div>

        {/* Gold - Rank 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="order-1 md:order-2"
        >
          <div className="glass p-10 rounded-[4rem] border-primary/30 bg-primary/5 text-center relative pt-20 scale-110 shadow-[0_0_50px_rgba(255,215,0,0.1)]">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
               <div className="w-28 h-28 rounded-3xl bg-primary/20 p-1 animate-pulse">
                  <div className="w-full h-full bg-[#0A0A0A] rounded-[1.5rem] flex items-center justify-center text-primary">
                    <Crown size={56} />
                  </div>
               </div>
               <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center font-black italic text-xl shadow-lg">1</div>
            </div>
            <h3 className="text-2xl font-black uppercase italic truncate">{leaders[0].name}</h3>
            <p className="text-primary font-black text-4xl mt-2 tracking-tighter">{leaders[0].score}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{leaders[0].type} PR</p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
               <Zap className="text-primary" size={12} />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary">Unstoppable</span>
            </div>
          </div>
        </motion.div>

        {/* Bronze - Rank 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="order-3"
        >
          <div className="glass p-8 rounded-[3rem] border-white/5 text-center relative pt-16">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
               <div className="w-24 h-24 rounded-3xl bg-orange-700/20 p-1">
                  <div className="w-full h-full bg-[#0A0A0A] rounded-2xl flex items-center justify-center text-orange-700">
                    <Trophy size={48} />
                  </div>
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-700 text-black rounded-full flex items-center justify-center font-black italic">3</div>
            </div>
            <h3 className="text-xl font-black uppercase italic truncate">{leaders[2].name}</h3>
            <p className="text-primary font-black text-2xl mt-2 tracking-tighter">{leaders[2].score}</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{leaders[2].type}</p>
          </div>
        </motion.div>
      </div>

      {/* Rankings List */}
      <div className="glass p-10 rounded-[4rem] border-white/5 max-w-5xl mx-auto mt-20">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-xl font-black uppercase italic tracking-tight">Full <span className="text-primary">Rankings</span></h3>
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input type="text" placeholder="Search Warrior..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase outline-none focus:border-primary w-64" />
           </div>
        </div>

        <div className="space-y-4">
           {leaders.map((leader, i) => (
             <div key={leader.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-6">
                   <span className="w-8 text-2xl font-black italic text-gray-700 group-hover:text-primary transition-colors">#{leader.rank}</span>
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                      <User className="text-gray-500" size={20} />
                   </div>
                   <div>
                      <h4 className="text-lg font-black uppercase italic">{leader.name}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{leader.type}</p>
                   </div>
                </div>
                <div className="flex items-center gap-12 text-right">
                   <div>
                      <p className="text-2xl font-black italic tracking-tighter text-white">{leader.score}</p>
                      <div className={`flex items-center justify-end gap-1 text-[10px] font-black uppercase ${leader.trend === 'up' ? 'text-green-500' : leader.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                         {leader.trend === 'up' ? <TrendingUp size={10} /> : <Flame size={10} />}
                         {leader.change}
                      </div>
                   </div>
                   <button className="p-3 bg-white/5 border border-white/5 rounded-xl hover:text-primary transition-colors">
                      <Zap size={16} />
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
