"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  TrendingUp,
  CreditCard,
  Activity,
  ArrowUpRight,
  Calendar,
  Search,
  Plus,
  Trash2,
  Edit,
  Dumbbell,
  Settings,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Clock,
  ChevronRight,
  Filter,
  CheckCircle2,
  CalendarCheck,
  Eye,
  FileText,
  Sparkles,
  Star,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToAllReviewsForOwner,
  setReviewStatusByOwner,
  deleteReviewByOwner,
  GymReview,
} from "@/lib/reviewsService";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GymMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberId: string;
  trainerId: "trainer_suraj" | "trainer_sanket";
  trainerName: string;
  membershipPlan: string;
  status: "active" | "expiring" | "expired";
  joinDate: string;
  expiryDate: string;
  workoutPlan: string;
  dietPlan: string;
  attendanceRate: string;
}

const INITIAL_MEMBERS: GymMember[] = [
  {
    id: "m-001",
    name: "Krishna Patil",
    email: "krishna@fitnesstemple.com",
    phone: "+91 98765 43210",
    memberId: "FT-2026-089",
    trainerId: "trainer_suraj",
    trainerName: "Suraj Sir",
    membershipPlan: "Gold Annual Elite",
    status: "active",
    joinDate: "2026-01-10",
    expiryDate: "2027-01-10",
    workoutPlan: "Chest & Triceps Hypertrophy",
    dietPlan: "High Protein Clean (2,400 kcal)",
    attendanceRate: "94%",
  },
  {
    id: "m-002",
    name: "Aarav Sharma",
    email: "aarav@gmail.com",
    phone: "+91 98123 45678",
    memberId: "FT-2026-012",
    trainerId: "trainer_suraj",
    trainerName: "Suraj Sir",
    membershipPlan: "Standard 3-Month",
    status: "active",
    joinDate: "2026-07-01",
    expiryDate: "2026-10-01",
    workoutPlan: "Leg Day & HIIT",
    dietPlan: "Caloric Deficit (1,800 kcal)",
    attendanceRate: "88%",
  },
  {
    id: "m-003",
    name: "Rohan Deshmukh",
    email: "rohan@gmail.com",
    phone: "+91 99234 56789",
    memberId: "FT-2026-045",
    trainerId: "trainer_suraj",
    trainerName: "Suraj Sir",
    membershipPlan: "Monthly Basic",
    status: "expiring",
    joinDate: "2026-08-25",
    expiryDate: "2026-09-25",
    workoutPlan: "Back & Pull-Up Flow",
    dietPlan: "Maintenance (2,200 kcal)",
    attendanceRate: "76%",
  },
  {
    id: "m-004",
    name: "Vikram Rane",
    email: "vikram@gmail.com",
    phone: "+91 97654 32109",
    memberId: "FT-2026-077",
    trainerId: "trainer_sanket",
    trainerName: "Sanket Sir",
    membershipPlan: "Gold Annual",
    status: "active",
    joinDate: "2026-02-15",
    expiryDate: "2027-02-15",
    workoutPlan: "Deadlift 5x5 Strength",
    dietPlan: "Bulking Protocol (3,000 kcal)",
    attendanceRate: "96%",
  },
  {
    id: "m-005",
    name: "Pooja Kulkarni",
    email: "pooja@gmail.com",
    phone: "+91 98901 23456",
    memberId: "FT-2026-104",
    trainerId: "trainer_sanket",
    trainerName: "Sanket Sir",
    membershipPlan: "Standard 6-Month",
    status: "active",
    joinDate: "2026-05-12",
    expiryDate: "2026-11-12",
    workoutPlan: "Glute Sculpting & Core",
    dietPlan: "Vegetarian Lean (1,900 kcal)",
    attendanceRate: "90%",
  },
  {
    id: "m-006",
    name: "Siddharth Verma",
    email: "siddharth@gmail.com",
    phone: "+91 91234 11223",
    memberId: "FT-2026-155",
    trainerId: "trainer_sanket",
    trainerName: "Sanket Sir",
    membershipPlan: "Monthly Cardio",
    status: "expired",
    joinDate: "2026-08-10",
    expiryDate: "2026-09-10",
    workoutPlan: "Cardio Shred",
    dietPlan: "Low Carb (1,700 kcal)",
    attendanceRate: "62%",
  },
];

const INITIAL_AUDIT_LOGS = [
  { time: "10 mins ago", event: "Suraj Sir updated daily routine for Krishna Patil", type: "workout" },
  { time: "25 mins ago", event: "Member check-in: Vikram Rane verified present by front desk", type: "attendance" },
  { time: "1 hour ago", event: "Automated alert: Rohan Deshmukh membership expires in 7 days", type: "alert" },
  { time: "2 hours ago", event: "Sanket Sir customized nutrition blueprint for Pooja Kulkarni", type: "diet" },
  { time: "4 hours ago", event: "Owner approved trainer reassignment for Member FT-2026-012", type: "owner" },
];

const OwnerDashboard = () => {
  const { userData } = useAuth();
  const [members, setMembers] = useState<GymMember[]>(INITIAL_MEMBERS);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expiring" | "expired">("all");
  const [filterTrainer, setFilterTrainer] = useState<"all" | "suraj" | "sanket">("all");
  const [localRegistry, setLocalRegistry] = useState<UserProfile[]>([]);
  const [showLocalRegistry, setShowLocalRegistry] = useState(false);

  // Load local registry from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ft_local_users");
    if (stored) {
      try {
        const users = JSON.parse(stored);
        setLocalRegistry(Object.values(users));
      } catch (e) {
        console.error("Local registry parse error", e);
      }
    }
  }, []);

  // Real-time Firestore listener for all members
  useEffect(() => {
    if (!db) {
      setLoadingMembers(false);
      return;
    }
    setLoadingMembers(true);
    const q = query(collection(db, "members"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched: GymMember[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          fetched.push({
            id: docSnap.id,
            name: d.name || d.fullName || "Member",
            email: d.email || "—",
            phone: d.phone || d.mobile || "—",
            memberId: d.memberId || docSnap.id.slice(0, 10).toUpperCase(),
            trainerId: d.trainerId || "trainer_suraj",
            trainerName: d.trainerId === "trainer_sanket" ? "Sanket Sir" : "Suraj Sir",
            membershipPlan: d.membershipPlan || d.membershipType || "Standard",
            status: d.status || "active",
            joinDate: d.joinDate || new Date().toISOString().split("T")[0],
            expiryDate: d.expiryDate || new Date().toISOString().split("T")[0],
            workoutPlan: d.assignedWorkoutName || "Not assigned",
            dietPlan: d.assignedDietName || "Not assigned",
            attendanceRate: d.attendanceRate || "0%",
          });
        });
        setMembers(fetched);
        setLoadingMembers(false);
      },
      (error) => {
        console.warn("Firestore owner members fetch error:", error);
        setLoadingMembers(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Add Member Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    membershipPlan: "Gold Annual Elite",
    trainerId: "trainer_suraj" as "trainer_suraj" | "trainer_sanket",
    fitnessGoal: "Strength & Hypertrophy",
  });

  // Selected Member Details Modal
  const [selectedMember, setSelectedMember] = useState<GymMember | null>(null);

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || m.status === filterStatus;
    const matchesTrainer =
      filterTrainer === "all" ||
      (filterTrainer === "suraj" && m.trainerId === "trainer_suraj") ||
      (filterTrainer === "sanket" && m.trainerId === "trainer_sanket");
    return matchesSearch && matchesStatus && matchesTrainer;
  });

  // Trainer Stats
  const surajMembers = members.filter((m) => m.trainerId === "trainer_suraj").length;
  const sanketMembers = members.filter((m) => m.trainerId === "trainer_sanket").length;

  // Real Member Reviews for Owner Moderation
  const [ownerReviews, setOwnerReviews] = useState<GymReview[]>([]);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");

  useEffect(() => {
    const unsub = subscribeToAllReviewsForOwner((revs) => {
      setOwnerReviews(revs);
    });
    return () => unsub();
  }, []);

  const handleToggleReviewStatus = async (rev: GymReview) => {
    const newStatus = rev.status === "published" ? "hidden" : "published";
    await setReviewStatusByOwner(rev.id, newStatus);
    setAuditLogs([
      {
        time: "Just now",
        event: `Owner ${newStatus === "published" ? "published" : "hid"} review by ${rev.userName}`,
        type: "owner",
      },
      ...auditLogs,
    ]);
  };

  const handleDeleteReviewByOwner = async (rev: GymReview) => {
    if (confirm(`Permanently delete review by ${rev.userName}?`)) {
      await deleteReviewByOwner(rev.id);
      setAuditLogs([
        {
          time: "Just now",
          event: `Owner deleted review by ${rev.userName}`,
          type: "owner",
        },
        ...auditLogs,
      ]);
    }
  };

  const filteredOwnerReviews = ownerReviews.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.comment.toLowerCase().includes(reviewSearch.toLowerCase());
    const matchesRating =
      reviewRatingFilter === "all" || r.rating === parseInt(reviewRatingFilter);
    return matchesSearch && matchesRating;
  });

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    const memberData = {
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone || "+91 99000 11223",
      memberId: `FT-2026-${Math.floor(100 + Math.random() * 900)}`,
      trainerId: newMember.trainerId,
      membershipPlan: newMember.membershipPlan,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
      assignedWorkoutName: "Standard Starter Split",
      assignedDietName: "Standard Maintenance (2,200 kcal)",
      attendanceRate: "100%",
      createdAt: serverTimestamp(),
      fitnessGoal: newMember.fitnessGoal,
    };

    if (db) {
      try {
        const newMemberRef = doc(collection(db, "members"));
        await setDoc(newMemberRef, memberData);

        setAuditLogs([
          { time: "Just now", event: `Owner added new member: ${memberData.name} (${memberData.memberId})`, type: "owner" },
          ...auditLogs,
        ]);
      } catch (err) {
        console.error("Error adding member to Firestore:", err);
      }
    }

    setShowAddModal(false);
    setNewMember({
      name: "",
      email: "",
      phone: "",
      membershipPlan: "Gold Annual Elite",
      trainerId: "trainer_suraj",
      fitnessGoal: "Strength & Hypertrophy",
    });
  };

  const handleDeleteMember = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to deactivate ${name}?`)) {
      if (db) {
        try {
          await deleteDoc(doc(db, "members", id));
          setAuditLogs([
            { time: "Just now", event: `Owner deactivated member account: ${name}`, type: "owner" },
            ...auditLogs,
          ]);
        } catch (err) {
          console.error("Error deleting member:", err);
        }
      }
    }
  };

  const handleReassignTrainer = async (memberId: string, newTrainerId: "trainer_suraj" | "trainer_sanket") => {
    const trainerName = newTrainerId === "trainer_suraj" ? "Suraj Sir" : "Sanket Sir";

    if (db) {
      try {
        await updateDoc(doc(db, "members", memberId), {
          trainerId: newTrainerId,
          updatedAt: serverTimestamp(),
        });

        setAuditLogs([
          { time: "Just now", event: `Owner reallocated member to ${trainerName}`, type: "owner" },
          ...auditLogs,
        ]);
      } catch (err) {
        console.error("Error reassigning trainer:", err);
      }
    }
  };

  // Chart Data
  const attendanceChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Arena Attendance",
        data: [172, 185, 194, 180, 188, 184, 95],
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const membershipDistributionData = {
    labels: ["Annual Elite", "6-Month Pro", "3-Month Standard", "Monthly Cardio", "PT Coaching"],
    datasets: [
      {
        label: "Active Members",
        data: [112, 64, 38, 22, 12],
        backgroundColor: [
          "#FFD700",
          "rgba(255, 215, 0, 0.7)",
          "rgba(255, 215, 0, 0.5)",
          "rgba(255, 215, 0, 0.3)",
          "#3B82F6",
        ],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#0D0D0D] border border-white/10 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                Administrative Authority • Full Gym Access
              </span>
              <span className="text-[10px] font-mono text-gray-400">Rajarajeshwari Fitness Arena</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tight">
              Gym Owner <span className="ft-gradient-text">Control Center</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Executive control of members, trainers, attendance logs, and workout pipelines.
            </p>
          </div>

          <button
            onClick={() => setShowLocalRegistry(true)}
            className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all"
          >
            <ShieldCheck size={16} className="text-primary" />
            <span>Local Registry ({localRegistry.length})</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary px-6 py-3.5 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            <Plus size={16} />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      {/* 2. Top Administrative Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Members</p>
            <p className="text-3xl font-black font-mono text-white">248</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Members</p>
            <p className="text-3xl font-black font-mono text-white">221</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Today's Attendance</p>
            <p className="text-3xl font-black font-mono text-white">184</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Expiring (7 Days)</p>
            <p className="text-3xl font-black font-mono text-white">14</p>
          </div>
        </div>
      </div>

      {/* 3. Trainers Management Section */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-wider flex items-center gap-2">
              <Dumbbell className="text-primary" size={22} />
              <span>Coaching Staff & Trainer Supervision (2)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Assigned athlete allocation and coaching performance oversight.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Suraj Sir Card */}
          <div className="p-6 rounded-3xl bg-black/60 border border-white/10 relative overflow-hidden space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-2xl italic">
                  S
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase italic text-white">Suraj Sir</h3>
                  <p className="text-xs text-primary font-bold">Senior Strength & Conditioning Coach</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: trainer_suraj</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/40">
                Active On Floor
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono">
              <div>
                <span className="text-gray-500 text-[10px] block">Athletes</span>
                <strong className="text-white text-base">{surajMembers}</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Present Today</span>
                <strong className="text-white text-base">2</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Adherence</span>
                <strong className="text-primary text-base">94%</strong>
              </div>
            </div>
          </div>

          {/* Sanket Sir Card */}
          <div className="p-6 rounded-3xl bg-black/60 border border-white/10 relative overflow-hidden space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-2xl italic">
                  S
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase italic text-white">Sanket Sir</h3>
                  <p className="text-xs text-blue-400 font-bold">Biomechanics & Hypertrophy Specialist</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">ID: trainer_sanket</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/40">
                Active On Floor
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono">
              <div>
                <span className="text-gray-500 text-[10px] block">Athletes</span>
                <strong className="text-white text-base">{sanketMembers}</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Present Today</span>
                <strong className="text-white text-base">2</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Adherence</span>
                <strong className="text-blue-400 text-base">91%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Members Directory & Filter Table */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-wider flex items-center gap-2">
              <Users className="text-primary" size={22} />
              <span>Member Directory ({filteredMembers.length})</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live status, assigned trainer, routine tracking, and membership validity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member or ID..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:border-primary outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-bold uppercase">
              {(["all", "active", "expiring", "expired"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterStatus === st ? "bg-primary text-black font-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Trainer Filter */}
            <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-bold uppercase">
              {(["all", "suraj", "sanket"] as const).map((tr) => (
                <button
                  key={tr}
                  onClick={() => setFilterTrainer(tr)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filterTrainer === tr ? "bg-primary text-black font-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tr === "all" ? "All Coaches" : tr === "suraj" ? "Suraj Sir" : "Sanket Sir"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Member Directory Table */}
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/40">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-gray-500 bg-white/[0.02]">
                <th className="py-4 px-6">Member Name & ID</th>
                <th className="py-4 px-4">Assigned Trainer</th>
                <th className="py-4 px-4">Plan Tier</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Expires On</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{m.name}</span>
                        <span className="text-[10px] font-mono text-gray-500">{m.memberId} • {m.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={m.trainerId}
                        onChange={(e) => handleReassignTrainer(m.id, e.target.value as any)}
                        className="bg-black/60 border border-white/10 text-[11px] font-bold text-primary rounded-xl px-2.5 py-1.5 focus:border-primary outline-none"
                      >
                        <option value="trainer_suraj">Suraj Sir</option>
                        <option value="trainer_sanket">Sanket Sir</option>
                      </select>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-gray-300">
                    {m.membershipPlan}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        m.status === "active"
                          ? "bg-green-500/20 text-green-400 border border-green-500/40"
                          : m.status === "expiring"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 animate-pulse"
                          : "bg-red-500/20 text-red-400 border border-red-500/40"
                      }`}
                    >
                      {m.status === "expiring" ? "Expires in 7d" : m.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono text-gray-400">
                    {m.expiryDate}
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setSelectedMember(m)}
                      className="p-2 bg-white/5 hover:bg-primary hover:text-black rounded-xl text-gray-300 transition-all"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(m.id, m.name)}
                      className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-gray-400 transition-all"
                      title="Deactivate Member"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Analytics Charts & Realtime Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Weekly Attendance Trend (7 cols) */}
        <div className="lg:col-span-7 glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black uppercase italic tracking-wider">
                Weekly Attendance Density
              </h3>
              <p className="text-xs text-gray-400">Daily check-in volume trends</p>
            </div>
            <span className="text-xs font-mono text-primary font-bold">Avg: 178 / day</span>
          </div>

          <div className="h-64">
            <Line
              data={attendanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    grid: { color: "rgba(255,255,255,0.05)" },
                    ticks: { color: "#888888" },
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: "#888888" },
                  },
                },
                plugins: {
                  legend: { display: false },
                },
              }}
            />
          </div>
        </div>

        {/* Live Activity Audit Feed (5 cols) */}
        <div className="lg:col-span-5 glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="text-primary w-5 h-5" />
              <h3 className="text-lg font-black uppercase italic tracking-wider">
                Live Audit Activity
              </h3>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {auditLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 leading-snug">{log.event}</p>
                  <span className="text-[10px] font-mono text-gray-500 mt-1 block">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Member Reviews Moderation & Governance */}
      <div className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="text-primary w-5 h-5" />
              <h2 className="text-xl font-black uppercase italic tracking-wider">
                Member Reviews Moderation (Firestore)
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Live authentic reviews submitted by registered members. Published directly to the public website.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
              Total: <strong className="text-white">{ownerReviews.length}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
              Published: <strong className="text-green-300">{ownerReviews.filter((r) => r.status === "published").length}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              Hidden: <strong className="text-yellow-300">{ownerReviews.filter((r) => r.status === "hidden").length}</strong>
            </span>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/10 w-full sm:w-64">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              placeholder="Search reviewer or comment..."
              className="bg-transparent text-xs text-white placeholder:text-gray-600 outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Rating:</span>
            <select
              value={reviewRatingFilter}
              onChange={(e) => setReviewRatingFilter(e.target.value)}
              className="bg-black/60 text-xs font-bold text-white border border-white/10 rounded-xl px-3 py-2 outline-none"
            >
              <option value="all">All Stars</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
              <option value="4">⭐⭐⭐⭐ 4 Stars</option>
              <option value="3">⭐⭐⭐ 3 Stars</option>
              <option value="2">⭐⭐ 2 Stars</option>
              <option value="1">⭐ 1 Star</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {filteredOwnerReviews.length > 0 ? (
          <div className="space-y-3">
            {filteredOwnerReviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  rev.status === "published"
                    ? "bg-black/50 border-white/10 hover:border-white/20"
                    : "bg-red-500/5 border-yellow-500/20 opacity-70"
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm text-white uppercase italic">
                      {rev.userName}
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.rating ? "fill-primary text-primary" : "text-gray-700"}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                        rev.status === "published"
                          ? "text-green-400 bg-green-500/10 border-green-500/20"
                          : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <p className="text-[10px] font-mono text-gray-500">
                    User UID: {rev.userId}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleToggleReviewStatus(rev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      rev.status === "published"
                        ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                        : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20"
                    }`}
                  >
                    {rev.status === "published" ? "Hide from Public" : "Publish to Public"}
                  </button>

                  <button
                    onClick={() => handleDeleteReviewByOwner(rev)}
                    className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all"
                    title="Delete Inappropriate Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-black/40 rounded-2xl border border-dashed border-white/10 p-6 space-y-2">
            <p className="text-xs text-gray-400 font-medium">
              No member reviews found matching criteria.
            </p>
            <p className="text-[10px] text-gray-600">
              When members submit reviews on the website, they will appear here for governance.
            </p>
          </div>
        )}
      </div>

      {/* 7. Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-lg w-full p-8 rounded-3xl border border-white/10 relative"
            >
              <h3 className="text-xl font-black uppercase italic tracking-wider mb-1">
                Register New Member
              </h3>
              <p className="text-xs text-gray-400 mb-6">Create credentials and assign coach</p>

              <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Full Name</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="e.g. Yash Kadam"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Email</label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="yash@gmail.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Mobile</label>
                    <input
                      type="text"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Assign Trainer</label>
                    <select
                      value={newMember.trainerId}
                      onChange={(e) => setNewMember({ ...newMember, trainerId: e.target.value as any })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1 text-white"
                    >
                      <option value="trainer_suraj">Suraj Sir</option>
                      <option value="trainer_sanket">Sanket Sir</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black tracking-widest text-primary/80">Membership Tier</label>
                    <select
                      value={newMember.membershipPlan}
                      onChange={(e) => setNewMember({ ...newMember, membershipPlan: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs focus:border-primary outline-none mt-1 text-white"
                    >
                      <option value="Gold Annual Elite">Gold Annual Elite (1 Year)</option>
                      <option value="Standard 6-Month">Standard 6-Month</option>
                      <option value="Quarterly Pro">Quarterly Pro (3 Months)</option>
                      <option value="Monthly Basic">Monthly Basic</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 btn-primary text-xs font-black uppercase tracking-wider rounded-xl"
                  >
                    Create Member Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Local Registry Modal */}
      <AnimatePresence>
        {showLocalRegistry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-4xl w-full p-8 rounded-[2.5rem] border border-white/10 relative flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-wider">
                    Browser Local Registry
                  </h3>
                  <p className="text-xs text-gray-400">Users stored in this browser's localStorage (ft_local_users)</p>
                </div>
                <button
                  onClick={() => setShowLocalRegistry(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl"
                >
                  <RotateCcw size={20} className="rotate-45" />
                </button>
              </div>

              <div className="overflow-y-auto pr-2 custom-scrollbar">
                {localRegistry.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-gray-500 bg-white/[0.02]">
                        <th className="py-4 px-4">Name / ID</th>
                        <th className="py-4 px-4">Email / Phone</th>
                        <th className="py-4 px-4">Goal / Gender</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {localRegistry.map((u) => (
                        <tr key={u.uid} className="hover:bg-white/[0.02]">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={u.profileImage || "/assets/boy.png"} className="w-8 h-8 rounded-lg bg-primary/20" alt="" />
                              <div>
                                <span className="font-bold text-white block">{u.name || u.fullName}</span>
                                <span className="text-[10px] font-mono text-primary">{u.memberId}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-gray-400">
                            {u.email} <br /> {u.phone || u.mobile}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300 block">{u.fitnessGoal}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${u.gender === 'girl' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                              {u.gender || 'Not Set'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                const newRegistry = localRegistry.filter(user => user.uid !== u.uid);
                                setLocalRegistry(newRegistry);
                                const registryMap = newRegistry.reduce((acc, curr) => ({ ...acc, [curr.uid]: curr }), {});
                                localStorage.setItem("ft_local_users", JSON.stringify(registryMap));
                              }}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-20 bg-black/40 rounded-3xl border border-dashed border-white/10">
                    <p className="text-gray-500 text-sm">No local users found in registry.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Member Drilldown Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full p-8 rounded-3xl border border-white/10 relative space-y-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase italic tracking-wider text-white">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs font-mono text-primary font-bold">{selectedMember.memberId}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase bg-green-500/20 text-green-400 border border-green-500/40">
                  {selectedMember.status}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500 uppercase text-[10px] font-bold">Assigned Trainer</span>
                  <strong className="text-primary">{selectedMember.trainerName}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500 uppercase text-[10px] font-bold">Plan</span>
                  <strong className="text-white">{selectedMember.membershipPlan}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500 uppercase text-[10px] font-bold">Expires</span>
                  <strong className="text-white font-mono">{selectedMember.expiryDate}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500 uppercase text-[10px] font-bold">Attendance Rate</span>
                  <strong className="text-green-400 font-mono">{selectedMember.attendanceRate}</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500 uppercase text-[10px] font-bold">Active Workout</span>
                  <strong className="text-gray-300 truncate max-w-[200px]">{selectedMember.workoutPlan}</strong>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500 uppercase text-[10px] font-bold">Active Diet</span>
                  <strong className="text-gray-300 truncate max-w-[200px]">{selectedMember.dietPlan}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="w-full py-3 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Close Drilldown
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerDashboard;
