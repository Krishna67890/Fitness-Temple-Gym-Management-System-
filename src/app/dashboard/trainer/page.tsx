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
import { collection, query, onSnapshot, orderBy, doc, updateDoc, getDocs } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { X, Check } from "lucide-react";

interface Member {
  id: string;
  fullName: string;
  memberId: string;
  membershipType: string;
  mobile: string;
  weight?: string;
  height?: string;
  age?: string;
  fitnessGoal?: string;
  profileImage?: string;
  status: string;
  assignedWorkout?: string;
  assignedDiet?: string;
}

const TrainerDashboard = () => {
  const { userData } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [assignmentType, setAssignmentType] = useState<"workout" | "diet" | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([
    { label: "Total Members", value: "0", icon: Users, color: "text-blue-500" },
    { label: "Active Today", value: "0", icon: Clock, color: "text-green-500" },
    { label: "New Joinings", value: "0", icon: Plus, color: "text-primary" },
    { label: "Assessments", value: "0", icon: TrendingUp, color: "text-yellow-500" },
  ]);

  // Mock plans for now - in a real app, these would come from Firestore
  const workoutPlans = [
    { id: "wp1", name: "Full Body Blast", level: "Beginner" },
    { id: "wp2", name: "Muscle Gain Pro", level: "Advanced" },
    { id: "wp3", name: "Fat Loss Elite", level: "Intermediate" },
    { id: "wp4", name: "Strength Starter", level: "Beginner" },
  ];

  const dietPlans = [
    { id: "dp1", name: "Muscle Building Pro", type: "High Protein" },
    { id: "dp2", name: "Shred & Lean", type: "Low Carb" },
    { id: "dp3", name: "Vegetarian Power", type: "Balanced" },
    { id: "dp4", name: "Keto Advanced", type: "Ketogenic" },
  ];

  // Use real trainer data from AuthContext
  const trainer = {
    name: userData?.fullName?.split(' ')[0] || "Coach",
    role: userData?.role === 'trainer' ? "Elite Strength Coach" : "Staff",
    id: userData?.uid || "trainer_id"
  };

  useEffect(() => {
    const firestore = db;
    if (!firestore) return;

    // Real-time listener for ALL members
    const q = query(collection(firestore, "members"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberList: Member[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const isExpired = data.expiryDate && new Date(data.expiryDate) < new Date();
        return {
          id: doc.id,
          ...data,
          fullName: data.fullName || "Unknown Member",
          memberId: data.memberId || "N/A",
          membershipType: data.membershipType || "Basic",
          mobile: data.mobile || "N/A",
          status: isExpired ? "expired" : (data.status || "active")
        } as Member;
      });
      setMembers(memberList);

      setStats([
        { label: "Total Members", value: snapshot.size.toString(), icon: Users, color: "text-blue-500" },
        { label: "Active Today", value: Math.floor(snapshot.size * 0.4).toString(), icon: Clock, color: "text-green-500" },
        { label: "New Joinings", value: memberList.filter(m => {
            const now = new Date();
            // @ts-ignore
            const created = m.createdAt?.toDate ? m.createdAt.toDate() : new Date();
            return now.getTime() - created.getTime() < 86400000;
          }).length.toString(), icon: Plus, color: "text-primary" },
        { label: "Assessments", value: "12", icon: TrendingUp, color: "text-yellow-500" },
      ]);
    });

    return () => unsubscribe();
  }, []);

  const handleAssign = async (planId: string) => {
    if (!selectedMember || !assignmentType) return;

    setLoading(true);
    try {
      const memberRef = doc(db!, "members", selectedMember.id);
      const updateData = assignmentType === "workout"
        ? { assignedWorkout: planId }
        : { assignedDiet: planId };

      await updateDoc(memberRef, updateData);
      alert(`${assignmentType === "workout" ? "Workout" : "Diet"} plan assigned to ${selectedMember.fullName}`);
      setAssignmentType(null);
      setSelectedMember(null);
    } catch (error) {
      console.error("Error assigning plan:", error);
      alert("Failed to assign plan.");
    } finally {
      setLoading(false);
    }
  };

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
                       <button
                         onClick={() => { setSelectedMember(member); setAssignmentType("diet"); }}
                         className="flex-1 md:flex-none p-3 bg-white/5 hover:bg-primary rounded-xl transition-all group/btn"
                       >
                          <ChefHat size={18} className={`${member.assignedDiet ? 'text-primary' : 'text-gray-500'} group-hover/btn:text-black mx-auto`} />
                       </button>
                       <button
                         onClick={() => { setSelectedMember(member); setAssignmentType("workout"); }}
                         className="flex-1 md:flex-none p-3 bg-white/5 hover:bg-primary rounded-xl transition-all group/btn"
                       >
                          <Dumbbell size={18} className={`${member.assignedWorkout ? 'text-primary' : 'text-gray-500'} group-hover/btn:text-black mx-auto`} />
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

        {/* Assignment Modal */}
        <AnimatePresence>
          {assignmentType && selectedMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative w-full max-w-lg glass p-8 rounded-[3rem] border-white/10"
              >
                <button
                  onClick={() => { setAssignmentType(null); setSelectedMember(null); }}
                  className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"
                >
                  <X size={24} />
                </button>

                <h3 className="text-2xl font-black uppercase italic mb-2">
                  Assign {assignmentType === "workout" ? "Workout" : "Diet"} <span className="text-primary">Plan</span>
                </h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">
                  Assigning to: <span className="text-white">{selectedMember.fullName}</span>
                </p>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {(assignmentType === "workout" ? workoutPlans : dietPlans).map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleAssign(plan.id)}
                      disabled={loading}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group text-left ${
                        (assignmentType === "workout" ? selectedMember.assignedWorkout : selectedMember.assignedDiet) === plan.id
                          ? "bg-primary/20 border-primary"
                          : "bg-white/5 border-white/5 hover:border-primary/50"
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-sm">{(plan as any).name}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">
                          {(plan as any).level || (plan as any).type}
                        </p>
                      </div>
                      {(assignmentType === "workout" ? selectedMember.assignedWorkout : selectedMember.assignedDiet) === plan.id ? (
                        <Check size={18} className="text-primary" />
                      ) : (
                        <ArrowRight size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
                      )}
                    </button>
                  ))}
                </div>

                {loading && (
                  <div className="absolute inset-0 bg-black/50 rounded-[3rem] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
