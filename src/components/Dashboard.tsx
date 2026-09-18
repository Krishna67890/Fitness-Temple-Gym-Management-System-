"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Trophy, Zap, Dumbbell, Heart, Settings, Layout, X, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    title: "Temple Novice",
    goal: "Not Set"
  });
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const workouts = JSON.parse(localStorage.getItem("fitnessTempleWorkouts") || "[]");
    const storedBookings = JSON.parse(localStorage.getItem("fitnessTempleBookings") || "[]");
    const reviews = JSON.parse(localStorage.getItem("fitnessTempleReviews") || "[]");

    setSavedWorkouts(workouts);
    setBookings(storedBookings);

    // Calculate XP
    let xp = (workouts.length * 20) + (storedBookings.length * 50) + (reviews.length * 10);
    const level = Math.floor(xp / 100) + 1;

    let title = "Temple Novice";
    if (level >= 2) title = "Consistent Athlete";
    if (level >= 5) title = "Temple Elite";

    setUserStats({
      xp,
      level,
      title,
      goal: localStorage.getItem("fitnessTempleGoal") || "Build Muscle"
    });
  }, [isOpen]);

  return (
    <>
      <div className="fixed top-24 right-8 z-[90]">
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-primary/50 transition-all group flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
            <User size={20} />
          </div>
          <div className="text-left hidden md:block">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">My Temple</div>
            <div className="text-xs font-bold text-white uppercase tracking-tighter">LVL {userStats.level} • {userStats.title}</div>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[400] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#050505] border-l border-white/10 h-full flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">My Profile</h3>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{userStats.title}</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-3 text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="p-8 grid grid-cols-2 gap-4">
                <div className="glass p-6 rounded-3xl border-white/5 text-center">
                  <div className="text-primary font-black text-2xl mb-1">{userStats.xp}</div>
                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Total XP</div>
                </div>
                <div className="glass p-6 rounded-3xl border-white/5 text-center">
                  <div className="text-white font-black text-2xl mb-1">{userStats.level}</div>
                  <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Rank Level</div>
                </div>
              </div>

              {/* Progress */}
              <div className="px-8 mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-gray-500">Progress to LVL {userStats.level + 1}</span>
                  <span className="text-primary">{userStats.xp % 100}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${userStats.xp % 100}%` }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 space-y-8 pb-20">
                <div>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Layout size={14} className="text-primary" /> Saved Workouts
                  </h4>
                  {savedWorkouts.length > 0 ? (
                    <div className="space-y-3">
                      {savedWorkouts.map((w: any, i) => (
                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-primary/20 transition-all">
                          <div>
                            <div className="text-sm font-bold text-white uppercase tracking-tight">{w.name}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase">{w.exercises.length} Exercises • {w.date}</div>
                          </div>
                          <ChevronRight size={16} className="text-gray-700 group-hover:text-primary transition-all" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center glass rounded-3xl border-dashed border-white/10 text-gray-600 text-xs font-bold uppercase tracking-widest">
                      No Workouts Saved
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap size={14} className="text-primary" /> Active Bookings
                  </h4>
                  {bookings.length > 0 ? (
                    <div className="space-y-3">
                      {bookings.map((b: any, i) => (
                        <div key={i} className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex justify-between items-center">
                          <div>
                            <div className="text-sm font-black text-primary uppercase tracking-tight">Free Trial Session</div>
                            <div className="text-[10px] text-primary/60 font-bold uppercase">{b.time} • Status: Pending</div>
                          </div>
                          <Heart size={16} className="text-primary fill-primary/20" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center glass rounded-3xl border-dashed border-white/10 text-gray-600 text-xs font-bold uppercase tracking-widest">
                      No Active Sessions
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/5 bg-black/50">
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Settings size={14} /> Account Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dashboard;
