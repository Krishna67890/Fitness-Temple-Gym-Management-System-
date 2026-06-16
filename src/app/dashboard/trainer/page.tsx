"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Dumbbell,
  ChefHat,
  CheckCircle2,
  Clock,
  Search,
  MessageSquare,
  ClipboardList,
  Plus,
  ArrowRight,
  Video,
  Camera,
  TrendingUp,
  Phone,
  Calendar,
  MapPin,
  Mail,
  MoreVertical,
  ChevronRight
} from "lucide-react";

import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const TrainerDashboard = () => {
  const { userData } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: "Total Members", value: "0", icon: Users, color: "text-blue-500" },
    { label: "Active Today", value: "0", icon: Clock, color: "text-green-500" },
    { label: "New Joinings", value: "0", icon: Plus, color: "text-primary" },
    { label: "Assessments", value: "0", icon: TrendingUp, color: "text-yellow-500" },
  ]);

  // Use real trainer data from AuthContext
  const trainer = {
    name: userData?.fullName?.split(' ')[0] || "Coach",
    role: userData?.role === 'trainer' ? "Elite Strength Coach" : "Staff",
    id: userData?.uid || "trainer_id"
  };

  useEffect(() => {
    if (!db) return;

    // Real-time listener for ALL members (since trainers need to see the tribe)
    const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(memberList);

      setStats([
        { label: "Total Members", value: snapshot.size.toString(), icon: Users, color: "text-blue-500" },
        { label: "Active Today", value: Math.floor(snapshot.size * 0.4).toString(), icon: Clock, color: "text-green-500" },
        { label: "New Joinings", value: memberList.filter(m => {
            const now = new Date();
            const created = m.createdAt?.toDate ? m.createdAt.toDate() : new Date();
            return now.getTime() - created.getTime() < 86400000;
          }).length.toString(), icon: Plus, color: "text-primary" },
        { label: "Assessments", value: "12", icon: TrendingUp, color: "text-yellow-500" },
      ]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Trainer <span className="ft-gradient-text">Command Center</span></h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Coach: {trainer.name} • {trainer.role}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary py-3 px-6 flex items-center gap-2 text-sm uppercase font-black italic">
            <Plus size={18} />
            New Assessment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-5 md:p-6 rounded-[2.5rem] border-white/5"
          >
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} mb-4`}>
              <stat.icon size={20} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Members Tribe */}
        <div className="lg:col-span-8">
          <div className="glass p-6 md:p-8 rounded-[3rem] border-white/5 min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase italic tracking-tight">The Tribe <span className="text-primary">({members.length})</span></h3>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Search member..."
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-primary w-48 transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              {members.length > 0 ? members.map((member, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  className="p-5 md:p-6 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-primary/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Member ID Card Style */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors">
                          {member.profileImage ? (
                             <img src={member.profileImage} alt={member.fullName} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black italic text-2xl">
                                {member.fullName?.charAt(0)}
                             </div>
                          )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-black rounded-full" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg leading-tight uppercase italic">{member.fullName}</h4>
                        <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">ID: {member.memberId}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-black uppercase rounded-md tracking-tighter">
                             {member.membershipType}
                           </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats & Info */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 border-l border-white/5 pl-0 md:pl-6">
                       <div>
                          <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Metrics</p>
                          <div className="flex gap-3 text-xs font-bold">
                             <span>{member.weight || "--"}kg</span>
                             <span className="text-gray-700">|</span>
                             <span>{member.height || "--"}cm</span>
                             <span className="text-gray-700">|</span>
                             <span>{member.age || "--"}yrs</span>
                          </div>
                       </div>
                       <div>
                          <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Contact</p>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                             <Phone size={10} className="text-primary" />
                             {member.mobile}
                          </div>
                       </div>
                       <div className="hidden md:block">
                          <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">Fitness Goal</p>
                          <p className="text-xs font-bold text-white capitalize">{member.fitnessGoal?.replace('-', ' ') || "General Fitness"}</p>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-l border-white/5 pl-0 md:pl-6 justify-between md:justify-end">
                       <button className="flex-1 md:flex-none p-3 bg-white/5 hover:bg-primary rounded-xl transition-all group/btn">
                          <ChefHat size={18} className="text-gray-500 group-hover/btn:text-black mx-auto" />
                       </button>
                       <button className="flex-1 md:flex-none p-3 bg-white/5 hover:bg-primary rounded-xl transition-all group/btn">
                          <Dumbbell size={18} className="text-gray-500 group-hover/btn:text-black mx-auto" />
                       </button>
                       <button className="flex-1 md:flex-none p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group/btn">
                          <MoreVertical size={18} className="text-gray-500 mx-auto" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="h-64 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-white/5 rounded-3xl">
                  <Users size={48} className="mb-4" />
                  <p className="text-xl font-black uppercase italic italic tracking-tighter text-center px-4">Recruiting Warriors...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel Tools */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[3rem] border-white/5">
            <h3 className="text-xl font-black uppercase italic tracking-tight mb-8 flex items-center gap-3">
               <Dumbbell size={20} className="text-primary" />
               Gym Operation
            </h3>
            <div className="space-y-3">
              {[
                { title: "Broadcast Message", icon: Mail, desc: "Notify all members" },
                { title: "Attendance Log", icon: Clock, desc: "Check daily history" },
                { title: "Workout Builder", icon: ClipboardList, desc: "Template manager" },
                { title: "Trainer Schedule", icon: Calendar, desc: "Personal sessions" },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition-all group text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 group-hover:text-primary transition-all">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-800 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden bg-primary">
             <div className="absolute top-[-20%] right-[-20%] opacity-10 rotate-12">
                <Dumbbell size={200} className="text-black" />
             </div>
             <div className="relative z-10 text-black">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-2 opacity-60">Temple Quote</h4>
                <p className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-4">
                  "Pain is just weakness leaving the body."
                </p>
                <div className="h-1 w-20 bg-black/20" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
