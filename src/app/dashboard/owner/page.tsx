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
import { collection, query, getDocs, orderBy, limit, onSnapshot } from "firebase/firestore";

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
  const [members, setMembers] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: "Total Members", value: "...", icon: Users, trend: "+0%", color: "text-blue-500" },
    { label: "Active Members", value: "...", icon: Activity, trend: "+0%", color: "text-green-500" },
    { label: "Monthly Revenue", value: "₹...", icon: TrendingUp, trend: "+0%", color: "text-primary" },
    { label: "Pending Renewals", value: "...", icon: Bell, trend: "Stable", color: "text-secondary" },
  ]);

  useEffect(() => {
    const firestore = db;
    if (!firestore) return;

    // Real-time members listener
    const q = query(collection(firestore!, "members"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(memberList);

      const count = snapshot.size;
      const activeCount = memberList.filter((m: any) => {
        const isExpired = m.expiryDate && new Date(m.expiryDate) < new Date();
        return !isExpired && (m.status === "active" || !m.status);
      }).length;

      // Calculate approximate revenue
      const revenue = memberList.reduce((acc: number, m: any) => {
        const amount = m.membershipType === "basic" ? 700 : 1800;
        const isExpired = m.expiryDate && new Date(m.expiryDate) < new Date();
        return acc + (!isExpired ? amount : 0);
      }, 0);

      const pendingRenewals = memberList.filter((m: any) => {
        if (!m.expiryDate) return false;
        const expiry = new Date(m.expiryDate);
        const diff = expiry.getTime() - new Date().getTime();
        return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000); // 7 days
      }).length;

      setStats([
        { label: "Total Members", value: count.toString(), icon: Users, trend: `+${snapshot.metadata.fromCache ? 0 : 1}%`, color: "text-blue-500" },
        { label: "Active Members", value: activeCount.toString(), icon: Activity, trend: "Live", color: "text-green-500" },
        { label: "Monthly Revenue", value: `₹${revenue.toLocaleString()}`, icon: TrendingUp, trend: "+12%", color: "text-primary" },
        { label: "Pending Renewals", value: pendingRenewals.toString(), icon: Bell, trend: pendingRenewals > 5 ? "Urgent" : "Stable", color: "text-secondary" },
      ]);
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

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Owner <span className="ft-gradient-text">Command Center</span></h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Gym: Fitness Temple • Admins: Omkar & Siddhant</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-primary py-3 px-6 flex items-center gap-2 text-sm uppercase font-black italic">
            <Plus size={18} />
            Add Member
          </button>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {[
          { label: "Members", icon: Users, color: "text-blue-500" },
          { label: "Trainers", icon: Dumbbell, color: "text-green-500" },
          { label: "Finance", icon: TrendingUp, color: "text-primary" },
          { label: "Attendance", icon: Calendar, color: "text-yellow-500" },
          { label: "Inventory", icon: Package, color: "text-purple-500" },
          { label: "QR Cards", icon: QrCode, color: "text-secondary" },
          { label: "Reports", icon: PieChart, color: "text-orange-500" },
        ].map((action, i) => (
          <button key={i} className="glass p-4 rounded-2xl border-white/5 hover:border-primary/50 transition-all flex flex-col items-center group">
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
    </div>
  );
};

export default OwnerDashboard;
