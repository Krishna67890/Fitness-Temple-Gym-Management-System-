"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  CreditCard,
  Activity,
  ArrowUpRight,
  Calendar,
  Download,
  Search,
  MoreVertical,
  Bell,
  Plus,
  Trash2,
  Edit,
  Package,
  Dumbbell,
  Settings,
  PieChart,
  MessageCircle,
  QrCode
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { X, Camera, User as UserIcon, Phone, Mail, Lock, Calendar as CalendarIcon, Ruler, Weight, Target, Shield } from "lucide-react";
import { AnimatePresence } from "framer-motion";

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

const OwnerDashboard = () => {
  const { userData } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    gender: "male",
    membershipType: "basic",
    age: "",
    height: "",
    weight: "",
    fitnessGoal: "muscle-gain",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMemberId = `FT${Math.floor(1000 + Math.random() * 9000)}`;
      const joinDate = new Date();
      const expiryDate = new Date();
      if (formData.membershipType === "basic") {
        expiryDate.setMonth(joinDate.getMonth() + 1);
      } else {
        expiryDate.setMonth(joinDate.getMonth() + 3);
      }

      const memberData = {
        ...formData,
        memberId: newMemberId,
        status: "Active",
        role: "user",
        profileImage: previewImage,
        expiryDate: expiryDate.toISOString(),
        createdAt: new Date().toISOString(),
      };

      const existingMembersRaw = localStorage.getItem("ft_all_members");
      const existingMembers = existingMembersRaw ? JSON.parse(existingMembersRaw) : [];
      existingMembers.push(memberData);
      localStorage.setItem("ft_all_members", JSON.stringify(existingMembers));

      if (db) {
        await addDoc(collection(db, "members"), {
          ...memberData,
          createdAt: serverTimestamp(),
        });
      }

      setIsAddModalOpen(false);
      setFormData({
        fullName: "", mobile: "", email: "", password: "", gender: "male",
        membershipType: "basic", age: "", height: "", weight: "", fitnessGoal: "muscle-gain",
      });
      setPreviewImage(null);
      alert("Member added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add member");
    }
  };
  const [stats, setStats] = useState<any[]>([
    { label: "Total Members", value: "0", icon: Users, trend: "0%", color: "text-blue-500" },
    { label: "Active Members", value: "0", icon: Activity, trend: "0%", color: "text-green-500" },
    { label: "Monthly Revenue", value: "₹0", icon: TrendingUp, trend: "0%", color: "text-primary" },
    { label: "Pending Renewals", value: "0", icon: Bell, trend: "Stable", color: "text-secondary" },
  ]);

  const isOwner = userData?.role === 'owner';

  useEffect(() => {
    const updateStats = (allMembers: any[]) => {
      const count = allMembers.length;
      const activeCount = allMembers.filter((m: any) => {
        const isExpired = m.expiryDate && new Date(m.expiryDate) < new Date();
        return !isExpired && (m.status === "active" || !m.status || m.status === "Active");
      }).length;

      const revenue = allMembers.reduce((acc: number, m: any) => {
        const amount = m.membershipType === "basic" || m.membershipType === "Basic Plan" ? 700 : 1800;
        const isExpired = m.expiryDate && new Date(m.expiryDate) < new Date();
        return acc + (!isExpired ? amount : 0);
      }, 0);

      const pendingRenewals = allMembers.filter((m: any) => {
        if (!m.expiryDate) return false;
        const expiry = new Date(m.expiryDate);
        const diff = expiry.getTime() - new Date().getTime();
        return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000); // 7 days
      }).length;

      setStats([
        { label: "Total Members", value: count.toString(), icon: Users, trend: "+12%", color: "text-blue-500" },
        { label: "Active Members", value: activeCount.toString(), icon: Activity, trend: "Live", color: "text-green-500" },
        { label: "Monthly Revenue", value: `₹${revenue.toLocaleString()}`, icon: TrendingUp, trend: "+12%", color: "text-primary" },
        { label: "Pending Renewals", value: pendingRenewals.toString(), icon: Bell, trend: pendingRenewals > 5 ? "Urgent" : "Stable", color: "text-secondary" },
      ]);
      setMembers(allMembers);
    };

    // Load Local Storage
    const existingMembersRaw = localStorage.getItem("ft_all_members");
    const localMembers = existingMembersRaw ? JSON.parse(existingMembersRaw) : [];

    if (!db) {
      updateStats(localMembers);
      return;
    }

    // Real-time members listener
    const q = query(collection(db!, "members"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Merge
      const combined = [...firebaseMembers];
      localMembers.forEach((lm: any) => {
        if (!combined.some((fm: any) => fm.email === lm.email)) {
          combined.push(lm);
        }
      });

      updateStats(combined);
    });

    return () => unsubscribe();
  }, []);

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Settings className="text-primary w-16 h-16 animate-pulse" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-center">Owner <span className="text-primary">Restricted</span></h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center max-w-xs">
          Access denied. This high-level console is for Owners only.
        </p>
        <button
          onClick={() => window.location.href = '/dashboard/user'}
          className="btn-primary px-8 py-3 text-sm font-black uppercase italic"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Owner <span className="ft-gradient-text">Command Center</span></h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Gym: Fitness Temple • Owners: Omkar & Siddhant</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary py-3 px-6 flex items-center gap-2 text-sm uppercase font-black italic"
          >
            <Plus size={18} />
            Add Member
          </button>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: "Members", icon: Users, color: "text-blue-500", path: "/dashboard/members" },
          { label: "Trainers", icon: Dumbbell, color: "text-green-500", path: "#" },
          { label: "Finance", icon: TrendingUp, color: "text-primary", path: "#" },
          { label: "Attendance", icon: Calendar, color: "text-yellow-500", path: "/dashboard/attendance" },
          { label: "Inventory", icon: Package, color: "text-purple-500", path: "#" },
          { label: "QR Cards", icon: QrCode, color: "text-secondary", path: "#" },
          { label: "Reports", icon: PieChart, color: "text-orange-500", path: "/dashboard/reports" },
        ].map((action, i) => (
          <button
            onClick={() => action.path !== "#" && (window.location.href = action.path)}
            key={i}
            className="glass p-4 rounded-2xl border-white/5 hover:border-primary/50 transition-all flex flex-col items-center group"
          >
             <action.icon className={`${action.color} mb-2 group-hover:scale-110 transition-transform`} size={20} />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-[2.5rem] border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.trend === "Urgent" ? "text-primary animate-pulse" : "text-green-500"}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-black italic tracking-tighter mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-8 glass p-8 rounded-[3rem] border-white/5">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black uppercase italic tracking-tight">Financial Performance</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Revenue Analytics</p>
            </div>
          </div>
          <div className="h-[300px]">
            <Line data={revenueData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#666' } }, x: { grid: { display: false }, ticks: { color: '#666' } } } }} />
          </div>
        </div>

        {/* Assignments / Inventory */}
        <div className="lg:col-span-4 glass p-8 rounded-[3rem] border-white/5">
          <h3 className="text-xl font-black uppercase italic tracking-tight mb-8">Trainer Capacity</h3>
          <div className="space-y-6">
            {[
              { name: "Coach Suraj", load: 75, color: "bg-green-500" },
              { name: "Coach Sanket", load: 92, color: "bg-primary" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-gray-400">{item.name}</span>
                  <span className={item.load > 90 ? "text-primary" : "text-white"}>{item.load}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.load}%` }} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
             Assign Members
          </button>
        </div>
      </div>

      {/* Member Table */}
      <div className="glass p-8 rounded-[3rem] border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
           <div>
             <h3 className="text-xl font-black uppercase italic tracking-tight">Recent Enrollments</h3>
             <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Manage your warriors</p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
               <input type="text" placeholder="Search members..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs" />
             </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 px-4">Warrior</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 px-4">Plan</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 px-4">Status</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 px-4">Payment</th>
                <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.slice(0, 5).map((member, i) => {
                const isExpired = member.expiryDate && new Date(member.expiryDate) < new Date();
                const status = isExpired ? "Expired" : (member.status || "Active");

                return (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black italic text-xs">
                          {member.fullName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{member.fullName}</p>
                          <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">{member.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{member.membershipType}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 ${isExpired ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"} text-[10px] font-black uppercase tracking-widest rounded-lg`}>
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-black text-white">₹{member.membershipType === "basic" ? 700 : 1800}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white"><Edit size={16} /></button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-primary"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-4xl glass p-8 md:p-12 rounded-[3rem] border-white/10 my-8"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">ADD NEW <span className="text-primary">WARRIOR</span></h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Enroll a new member into the temple</p>
              </div>

              <form onSubmit={handleAddMember} className="space-y-8">
                <div className="flex flex-col items-center mb-8">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative group"
                  >
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Camera className="text-gray-500 mx-auto mb-2" size={24} />
                        <span className="text-[8px] font-black uppercase text-gray-500">Photo</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="fullName" required placeholder="Name" className="ft-input-sm" onChange={handleChange} value={formData.fullName} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mobile</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="mobile" required placeholder="Phone" className="ft-input-sm" onChange={handleChange} value={formData.mobile} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input type="email" name="email" required placeholder="Email" className="ft-input-sm" onChange={handleChange} value={formData.email} />
                    </div>
                  </div>

                  {/* Physical Stats */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Age</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="age" required placeholder="Age" className="ft-input-sm" onChange={handleChange} value={formData.age} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Height (cm)</label>
                    <div className="relative">
                      <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="height" required placeholder="Height" className="ft-input-sm" onChange={handleChange} value={formData.height} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Weight (kg)</label>
                    <div className="relative">
                      <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="weight" required placeholder="Weight" className="ft-input-sm" onChange={handleChange} value={formData.weight} />
                    </div>
                  </div>

                  {/* Plans & Goals */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fitness Goal</label>
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <select name="fitnessGoal" className="ft-input-sm appearance-none bg-[#0a0a0a]" onChange={handleChange} value={formData.fitnessGoal}>
                        <option value="muscle-gain">Muscle Gain</option>
                        <option value="weight-loss">Weight Loss</option>
                        <option value="fat-loss">Fat Loss</option>
                        <option value="endurance">Endurance</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Membership</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <select name="membershipType" className="ft-input-sm appearance-none bg-[#0a0a0a]" onChange={handleChange} value={formData.membershipType}>
                        <option value="basic">Basic (1 Month)</option>
                        <option value="standard">Standard (3 Months)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input type="password" name="password" required placeholder="Password" className="ft-input-sm" onChange={handleChange} value={formData.password} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary py-4 text-[10px]">
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .ft-input-sm {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 0.8rem 1rem 0.8rem 3rem;
          font-weight: 700;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: all 0.3s;
        }
        .ft-input-sm:focus {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default OwnerDashboard;
