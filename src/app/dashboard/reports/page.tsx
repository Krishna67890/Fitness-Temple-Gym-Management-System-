"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Filter,
  Search,
  PieChart,
  BarChart,
  TrendingUp,
  Users,
  Calendar,
  ChevronRight,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, Timestamp } from "firebase/firestore";

const ReportsPage = () => {
  const { userData } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "history">("analytics");

  const isAdvanced = userData?.role === 'owner' || userData?.role === 'trainer';

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(item =>
        headers.map(header => {
          const val = item[header];
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMembers = () => {
    const exportData = members.map(m => ({
      ID: m.memberId || m.id,
      Name: m.fullName || m.name,
      Email: m.email || 'N/A',
      Phone: m.mobile || m.phone || 'N/A',
      Plan: m.membershipType || m.plan || 'Basic',
      Status: m.status || 'Active',
      Joined: m.createdAt ? (m.createdAt.toDate ? m.createdAt.toDate().toLocaleDateString() : new Date(m.createdAt).toLocaleDateString()) : 'N/A'
    }));
    downloadCSV(exportData, "FT_Members_Master");
  };

  const exportAnalytics = () => {
    const analyticsData = [
      { goal: "Muscle Gain", count: 42, efficiency: "75%" },
      { goal: "Weight Loss", count: 28, efficiency: "60%" },
      { goal: "Endurance", count: 15, efficiency: "45%" },
      { goal: "Maintenance", count: 20, efficiency: "90%" },
    ];
    downloadCSV(analyticsData, "FT_Goal_Analytics");
  };

  const exportHistory = () => {
    downloadCSV(generatedReports, "FT_Report_History");
  };

  useEffect(() => {
    const fetchMembers = async () => {
      if (!db) {
        const local = localStorage.getItem("ft_all_members");
        setMembers(local ? JSON.parse(local) : []);
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const firebaseMembers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const local = localStorage.getItem("ft_all_members");
        const localMembers = local ? JSON.parse(local) : [];

        const combined = [...firebaseMembers] as any[];
        localMembers.forEach((lm: any) => {
          if (!combined.some((fm: any) => fm.email === lm.email)) {
            combined.push(lm);
          }
        });

        setMembers(combined);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const generatedReports = [
    { id: "REP-001", type: "Monthly Attendance", date: "Oct 24, 2024", generatedBy: "Omkar", status: "Completed" },
    { id: "REP-002", type: "Revenue Analytics", date: "Oct 22, 2024", generatedBy: "Siddhant", status: "Completed" },
    { id: "REP-003", type: "Member Progress", date: "Oct 20, 2024", generatedBy: "Coach Suraj", status: "Completed" },
    { id: "REP-004", type: "Diet Compliance", date: "Oct 18, 2024", generatedBy: "Coach Sanket", status: "In Progress" },
  ];

  if (!isAdvanced) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Shield className="text-primary w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Access <span className="text-primary">Denied</span></h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] max-w-xs mt-4">
          Detailed analytical reports are reserved for management and coaching staff only.
        </p>
        <button onClick={() => window.location.href = '/dashboard/member'} className="btn-primary mt-8 px-10 py-4 text-xs font-black uppercase italic">
          Return to Base
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Advanced <span className="ft-gradient-text">Reporting</span></h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Generate and review performance intelligence</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
           <button
             onClick={() => setActiveTab("analytics")}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-primary text-black' : 'text-gray-500'}`}
           >
              Analytics
           </button>
           <button
             onClick={() => setActiveTab("history")}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-primary text-black' : 'text-gray-500'}`}
           >
              Report History
           </button>
        </div>
      </div>

      {activeTab === "analytics" ? (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Growth Rate", value: "+18.2%", icon: TrendingUp, trend: "up", color: "text-green-500" },
              { label: "Retention", value: "94.5%", icon: Users, trend: "up", color: "text-blue-500" },
              { label: "Avg. Attendance", value: "82%", icon: Clock, trend: "down", color: "text-orange-500" },
              { label: "Net Revenue", value: "₹4.2L", icon: PieChart, trend: "up", color: "text-primary" },
            ].map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="glass p-6 rounded-[2.5rem] border-white/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="text-green-500" size={16} />
                  ) : (
                    <ArrowDownRight className="text-orange-500" size={16} />
                  )}
                </div>
                <h3 className="text-2xl font-black italic tracking-tighter mb-1">{stat.value}</h3>
                <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Intelligence Card */}
            <div className="lg:col-span-8 glass p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white">Member Progress Intelligence</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Aggregated Goal Achievement Status</p>
                  </div>
                  <button
                    onClick={exportAnalytics}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-primary hover:text-black transition-all"
                  >
                    <Download size={18} />
                  </button>
               </div>

               <div className="space-y-6">
                  {[
                    { goal: "Muscle Gain", count: 42, color: "bg-primary", percentage: 75 },
                    { goal: "Weight Loss", count: 28, color: "bg-blue-500", percentage: 60 },
                    { goal: "Endurance", count: 15, color: "bg-green-500", percentage: 45 },
                    { goal: "Maintenance", count: 20, color: "bg-purple-500", percentage: 90 },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-end">
                          <div>
                             <span className="text-xs font-black uppercase italic">{item.goal}</span>
                             <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{item.count} Warriors Active</p>
                          </div>
                          <span className="text-xs font-black text-white">{item.percentage}% Efficiency</span>
                       </div>
                       <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1.5, delay: i * 0.2 }}
                            className={`h-full ${item.color} shadow-[0_0_15px_rgba(255,215,0,0.3)]`}
                          />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-10 p-6 bg-white/5 border border-white/5 rounded-3xl">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <TrendingUp size={24} />
                     </div>
                     <div>
                        <h4 className="text-sm font-black uppercase italic">AI Recommendation</h4>
                        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                          Peak activity detected between 6PM-9PM. Suggesting new "Muscle Blast" templates for the endurance group to optimize facility load.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
               <div className="glass p-8 rounded-[3rem] border-white/5">
                  <h3 className="text-lg font-black uppercase italic tracking-tight mb-6">Generate New Report</h3>
                  <div className="space-y-3">
                     {[
                       { name: "Attendance Master", icon: Calendar, color: "text-yellow-500" },
                       { name: "Revenue Audit", icon: FileText, color: "text-primary" },
                       { name: "Inventory Usage", icon: BarChart, color: "text-purple-500" },
                       { name: "Trainer Efficiency", icon: Users, color: "text-green-500" },
                     ].map((report, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/50 group transition-all">
                           <div className="flex items-center gap-4">
                              <report.icon size={18} className={report.color} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{report.name}</span>
                           </div>
                           <Plus size={16} className="text-gray-600 group-hover:text-primary" />
                        </button>
                     ))}
                  </div>
               </div>

               <div className="glass p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
                  <h3 className="text-lg font-black uppercase italic tracking-tight mb-4">Export <span className="text-primary">All Data</span></h3>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed mb-6">Download the complete database of members, payments, and attendance for offline review.</p>
                  <button
                    onClick={exportMembers}
                    className="w-full btn-primary py-4 text-[10px]"
                  >
                     Download Master CSV
                  </button>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass p-8 rounded-[3rem] border-white/5">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                 <h3 className="text-xl font-black uppercase italic tracking-tight">Report <span className="text-primary">Vault</span></h3>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">History of all generated analytical files</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <button
                   onClick={exportHistory}
                   className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-primary transition-all"
                   title="Export History"
                 >
                    <Download size={18} />
                 </button>
                 <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input type="text" placeholder="Search by ID or Type..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-primary" />
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b border-white/5">
                       <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Report Details</th>
                       <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Generated By</th>
                       <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
                       <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                       <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {generatedReports.map((report, i) => (
                      <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                         <td className="py-5">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                  <FileText size={16} />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-white">{report.type}</p>
                                  <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{report.id}</p>
                               </div>
                            </div>
                         </td>
                         <td className="py-5">
                            <p className="text-xs font-bold text-gray-400 uppercase italic">Coach {report.generatedBy}</p>
                         </td>
                         <td className="py-5 text-xs text-gray-500 font-bold">{report.date}</td>
                         <td className="py-5">
                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${report.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                               {report.status}
                            </span>
                         </td>
                         <td className="py-5 text-right">
                            <div className="flex justify-end gap-2">
                               <button className="p-2 text-gray-600 hover:text-white transition-colors"><Printer size={16} /></button>
                               <button className="p-2 text-gray-600 hover:text-primary transition-colors"><Download size={16} /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

const Shield = ({ className, size }: { className?: string, size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default ReportsPage;
