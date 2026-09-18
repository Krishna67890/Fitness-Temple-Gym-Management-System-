"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Dumbbell,
  Apple,
  Clock,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Phone,
  Calendar,
  CheckCircle2,
  ChevronRight,
  User,
  ShieldCheck,
  CalendarCheck,
  MessageSquare,
  Edit3,
  Flame,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

interface AssignedMember {
  id: string;
  fullName: string;
  memberId: string;
  membershipPlan: string;
  mobile: string;
  email: string;
  trainerId: string;
  fitnessGoal: string;
  weight: string;
  height: string;
  workoutStatus: "completed" | "pending" | "in-progress";
  attendanceToday: boolean;
  assignedWorkoutName: string;
  assignedDietName: string;
  notes?: string;
  profilePhoto?: string;
}

// INITIAL_MEMBERS replaced — data now comes from Firestore in real-time
// (see useEffect below — queries `members` collection where trainerId == currentTrainerId)


const TrainerDashboard = () => {
  const { userData, setDemoRole } = useAuth();

  // Identify which trainer is active
  const isSanket = userData?.trainerId === "trainer_sanket" || userData?.name?.toLowerCase().includes("sanket");
  const currentTrainerId = isSanket ? "trainer_sanket" : "trainer_suraj";
  const trainerName = userData?.name || (isSanket ? "Sanket Sir" : "Suraj Sir");
  const trainerSpecialty = isSanket
    ? "Biomechanics & Hypertrophy Specialist"
    : "Senior Strength & Conditioning Head Coach";

  const [members, setMembers] = useState<AssignedMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "in-progress">("all");
  const [selectedMember, setSelectedMember] = useState<AssignedMember | null>(null);

  // Modals
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({
    workoutName: "",
    splitType: "Chest + Triceps",
    sets: 4,
    reps: "10-12",
    restTime: "60s",
    notes: "",
  });
  const [dietForm, setDietForm] = useState({
    planName: "",
    calories: "2200",
    protein: "140g",
    carbs: "220g",
    fats: "60g",
  });
  const [isSaving, setIsSaving] = useState(false);

  // ---- Real-time Firestore listener for assigned members ----
  useEffect(() => {
    if (!db) {
      setLoadingMembers(false);
      return;
    }
    setLoadingMembers(true);
    const q = query(
      collection(db, "members"),
      where("trainerId", "==", currentTrainerId)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: AssignedMember[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          fetched.push({
            id: docSnap.id,
            fullName: d.name || d.fullName || "Member",
            memberId: d.memberId || docSnap.id.slice(0, 10).toUpperCase(),
            membershipPlan: d.membershipPlan || d.membershipType || "Standard",
            mobile: d.mobile || d.phone || "—",
            email: d.email || "—",
            trainerId: d.trainerId || currentTrainerId,
            fitnessGoal: d.fitnessGoal || "General Fitness",
            weight: d.weight ? `${d.weight} kg` : "—",
            height: d.height ? `${d.height} cm` : "—",
            workoutStatus: d.workoutStatus || "pending",
            attendanceToday: d.attendanceToday || false,
            assignedWorkoutName: d.assignedWorkoutName || "Not assigned",
            assignedDietName: d.assignedDietName || "Not assigned",
            notes: d.trainerNotes || d.notes || "",
            profilePhoto: d.photoURL || d.profileImage || undefined,
          });
        });
        setMembers(fetched);
        setLoadingMembers(false);
      },
      (error) => {
        console.warn("Firestore trainer members fetch error:", error);
        setMembers([]);
        setLoadingMembers(false);
      }
    );
    return () => unsubscribe();
  }, [currentTrainerId]);

  // Filter
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.workoutStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI calculations — all from real data
  const totalAssigned = members.length;
  const activeToday = members.filter((m) => m.attendanceToday).length;
  const workoutsDone = members.filter((m) => m.workoutStatus === "completed").length;
  const adherenceRate = totalAssigned > 0 ? Math.round((activeToday / totalAssigned) * 100) : 0;

  const toggleAttendance = async (id: string) => {
    const m = members.find((m) => m.id === id);
    if (!m) return;
    const newVal = !m.attendanceToday;
    setMembers((prev) => prev.map((mem) => (mem.id === id ? { ...mem, attendanceToday: newVal } : mem)));
    if (db) {
      try {
        await updateDoc(doc(db, "members", id), {
          attendanceToday: newVal,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("Attendance update error:", e);
      }
    }
  };

  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    const newWorkoutName = workoutForm.workoutName || workoutForm.splitType;
    setIsSaving(true);
    setMembers((prev) =>
      prev.map((m) => m.id === selectedMember.id ? { ...m, assignedWorkoutName: newWorkoutName, notes: workoutForm.notes || m.notes } : m)
    );
    if (db) {
      try {
        await updateDoc(doc(db, "members", selectedMember.id), {
          assignedWorkoutName: newWorkoutName,
          trainerNotes: workoutForm.notes || selectedMember.notes || "",
          workoutSets: workoutForm.sets,
          workoutReps: workoutForm.reps,
          workoutRest: workoutForm.restTime,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("Workout save error:", e);
      }
    }
    setIsSaving(false);
    setShowWorkoutModal(false);
  };

  const handleSaveDiet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    const dietLabel = `${dietForm.planName || "Customized Diet"} (${dietForm.calories} kcal)`;
    setIsSaving(true);
    setMembers((prev) =>
      prev.map((m) => m.id === selectedMember.id ? { ...m, assignedDietName: dietLabel } : m)
    );
    if (db) {
      try {
        await updateDoc(doc(db, "members", selectedMember.id), {
          assignedDietName: dietLabel,
          dietCalories: dietForm.calories,
          dietProtein: dietForm.protein,
          dietCarbs: dietForm.carbs,
          dietFats: dietForm.fats,
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("Diet save error:", e);
      }
    }
    setIsSaving(false);
    setShowDietModal(false);
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Trainer Profile Header Banner */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#111111] via-[#161616] to-[#0A0A0A] border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(255,215,0,0.3)] bg-black flex items-center justify-center text-primary font-black text-3xl italic">
              {trainerName.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  Trainer Portal • Coaching Suite
                </span>
                <span className="text-[10px] font-mono text-gray-400">UID: {currentTrainerId}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight">
                Welcome, <span className="ft-gradient-text">{trainerName}</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" />
                <span>{trainerSpecialty}</span>
              </p>
            </div>
          </div>

          {/* Switch Trainer Account for testing */}
          <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setDemoRole("trainer", "suraj")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                !isSanket
                  ? "bg-primary text-black shadow-lg scale-105"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Suraj Sir
            </button>
            <button
              onClick={() => setDemoRole("trainer", "sanket")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                isSanket
                  ? "bg-primary text-black shadow-lg scale-105"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sanket Sir
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Coaching KPI Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">My Assigned Members</p>
            <p className="text-2xl font-black font-mono text-white">{totalAssigned}</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Present in Arena Today</p>
            <p className="text-2xl font-black font-mono text-white">{activeToday}</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Dumbbell size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Workouts Finished</p>
            <p className="text-2xl font-black font-mono text-white">{workoutsDone}</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Adherence Rate</p>
            <p className="text-2xl font-black font-mono text-white">{adherenceRate}%</p>
          </div>
        </div>
      </div>

      {/* 3. Assigned Members Management Section */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-wider flex items-center gap-2">
              <Users className="text-primary" size={22} />
              <span>Assigned Athletes ({members.length})</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Strict data isolation: Only athletes assigned to {trainerName} are accessible.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search athlete or ID..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:border-primary outline-none"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-bold uppercase">
              {(["all", "completed", "in-progress", "pending"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === st ? "bg-primary text-black font-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Member Cards Grid */}
        {loadingMembers ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="text-sm font-semibold">Loading assigned members from Firestore...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Users size={28} className="text-primary" />
            </div>
            <div>
              <p className="text-white font-black text-lg">No Athletes Assigned Yet</p>
              <p className="text-gray-500 text-sm mt-1 max-w-sm">
                Members will appear here once the gym owner assigns them to {trainerName}.
              </p>
            </div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-black/50 border border-white/10 hover:border-primary/40 transition-all space-y-4 shadow-xl relative"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase italic text-white leading-tight">
                    {member.fullName}
                  </h3>
                  <p className="text-[10px] font-mono text-primary font-bold mt-0.5">{member.memberId}</p>
                  <p className="text-xs text-gray-400 mt-1">Goal: {member.fitnessGoal}</p>
                </div>

                <button
                  onClick={() => toggleAttendance(member.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    member.attendanceToday
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:border-primary"
                  }`}
                  title="Click to toggle attendance"
                >
                  <CheckCircle2 size={12} />
                  <span>{member.attendanceToday ? "Checked-In" : "Absent"}</span>
                </button>
              </div>

              {/* Vitals summary */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-mono">
                <div>
                  <span className="text-gray-500 block">Weight</span>
                  <strong className="text-white">{member.weight}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Height</span>
                  <strong className="text-white">{member.height}</strong>
                </div>
              </div>

              {/* Routine Assignment Status */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Dumbbell size={14} className="text-primary flex-shrink-0" />
                  <span className="text-gray-300 font-bold truncate">{member.assignedWorkoutName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Apple size={14} className="text-green-400 flex-shrink-0" />
                  <span className="text-gray-400 truncate">{member.assignedDietName}</span>
                </div>
              </div>

              {member.notes && (
                <p className="text-[11px] text-gray-400 italic bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                  "{member.notes}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedMember(member);
                    setWorkoutForm({
                      workoutName: member.assignedWorkoutName,
                      splitType: "Chest + Triceps",
                      sets: 4,
                      reps: "10-12",
                      restTime: "60s",
                      notes: member.notes || "",
                    });
                    setShowWorkoutModal(true);
                  }}
                  className="flex-1 py-2.5 px-3 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded-xl text-[10px] font-black uppercase tracking-wider text-primary flex items-center justify-center gap-1.5 transition-all"
                >
                  <Edit3 size={13} />
                  <span>Edit Workout</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedMember(member);
                    setShowDietModal(true);
                  }}
                  className="flex-1 py-2.5 px-3 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 rounded-xl text-[10px] font-black uppercase tracking-wider text-green-400 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Apple size={13} />
                  <span>Edit Diet</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>

      {/* 4. Edit Workout Plan Modal */}
      <AnimatePresence>
        {showWorkoutModal && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-lg w-full p-8 rounded-3xl border border-white/10 relative"
            >
              <h3 className="text-xl font-black uppercase italic tracking-wider mb-1">
                Assign Workout Routine
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Assigning customized routine for <strong className="text-primary">{selectedMember.fullName}</strong>
              </p>

              <form onSubmit={handleSaveWorkout} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">
                    Routine / Split Title
                  </label>
                  <input
                    type="text"
                    value={workoutForm.workoutName}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, workoutName: e.target.value })}
                    placeholder="e.g. Chest Hypertrophy & Arms Blast"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Sets</label>
                    <input
                      type="number"
                      value={workoutForm.sets}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, sets: parseInt(e.target.value) || 4 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Reps Target</label>
                    <input
                      type="text"
                      value={workoutForm.reps}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, reps: e.target.value })}
                      placeholder="10-12"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Rest Timer</label>
                    <input
                      type="text"
                      value={workoutForm.restTime}
                      onChange={(e) => setWorkoutForm({ ...workoutForm, restTime: e.target.value })}
                      placeholder="60s"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">
                    Coach Guidance Notes
                  </label>
                  <textarea
                    rows={3}
                    value={workoutForm.notes}
                    onChange={(e) => setWorkoutForm({ ...workoutForm, notes: e.target.value })}
                    placeholder="Focus on 2s pause at peak contraction..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWorkoutModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3 btn-primary text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Save & Push Routine"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Edit Diet Plan Modal */}
      <AnimatePresence>
        {showDietModal && selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-lg w-full p-8 rounded-3xl border border-white/10 relative"
            >
              <h3 className="text-xl font-black uppercase italic tracking-wider mb-1">
                Customize Nutrition Blueprint
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Diet programming for <strong className="text-green-400">{selectedMember.fullName}</strong>
              </p>

              <form onSubmit={handleSaveDiet} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Plan Name</label>
                  <input
                    type="text"
                    value={dietForm.planName}
                    onChange={(e) => setDietForm({ ...dietForm, planName: e.target.value })}
                    placeholder="e.g. Clean Lean Muscle Protocol"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                  />
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-widest text-primary/80">Calories</label>
                    <input
                      type="text"
                      value={dietForm.calories}
                      onChange={(e) => setDietForm({ ...dietForm, calories: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-widest text-primary/80">Protein</label>
                    <input
                      type="text"
                      value={dietForm.protein}
                      onChange={(e) => setDietForm({ ...dietForm, protein: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-widest text-primary/80">Carbs</label>
                    <input
                      type="text"
                      value={dietForm.carbs}
                      onChange={(e) => setDietForm({ ...dietForm, carbs: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-black tracking-widest text-primary/80">Fats</label>
                    <input
                      type="text"
                      value={dietForm.fats}
                      onChange={(e) => setDietForm({ ...dietForm, fats: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDietModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 btn-primary text-xs font-black uppercase tracking-wider rounded-xl"
                  >
                    Save Diet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainerDashboard;
