"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Scale,
  Calendar,
  Download,
  Plus,
  X,
  Check
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
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

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

const ProgressPage = () => {
  const { userData, user, updateUserData } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: "",
    height: "",
    chest: "",
    waist: "",
    bodyFat: ""
  });

  const progressHistory = userData?.progressHistory || [];

  // Prepare chart data
  const chartLabels = progressHistory.slice(-6).map((h: any) =>
    new Date(h.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
  );

  const weightValues = progressHistory.slice(-6).map((h: any) => parseFloat(h.weight));

  const weightData = {
    labels: chartLabels.length > 0 ? chartLabels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Weight (kg)",
        data: weightValues.length > 0 ? weightValues : [85, 83.5, 82, 80.5, 79, 78],
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const muscleData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Muscle Mass (%)",
        data: [30, 31, 31.5, 32, 33, 34],
        backgroundColor: "#FFD700",
        borderRadius: 8,
      },
    ],
  };

  const handleLogEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const uid = user?.uid || userData?.uid;
    if (!uid || !db) return;

    setLoading(true);
    try {
      const entry = {
        ...newEntry,
        date: new Date().toISOString(),
        id: Date.now().toString()
      };

      const userRef = doc(db!, "users", uid);
      const memberRef = doc(db!, "members", uid);

      const updates: any = {
        progressHistory: arrayUnion(entry),
        updatedAt: serverTimestamp()
      };

      // Also update current weight/height if provided
      if (newEntry.weight) updates.weight = newEntry.weight;
      if (newEntry.height) updates.height = newEntry.height;

      await Promise.all([
        updateDoc(userRef, updates),
        updateDoc(memberRef, updates)
      ]);

      // Update local storage and context
      updateUserData({
        weight: newEntry.weight || userData.weight,
        height: newEntry.height || userData.height,
        progressHistory: [...(userData.progressHistory || []), entry]
      });

      alert("Progress logged successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error logging progress:", error);
      alert("Failed to log progress.");
    } finally {
      setLoading(false);
    }
  };

  const currentWeight = userData?.weight || "--";
  const startWeight = progressHistory.length > 0 ? progressHistory[0].weight : currentWeight;
  const weightDiff = (parseFloat(currentWeight) - parseFloat(startWeight)).toFixed(1);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic mb-2">Progress <span className="text-primary">Tracking</span></h1>
          <p className="text-gray-400">Monitor your body transformation with detailed analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 glass rounded-xl text-gray-400 hover:text-white transition-all">
            <Download size={20} />
          </button>
          {(userData?.role === 'owner' || userData?.role === 'trainer') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary py-3 px-6 flex items-center space-x-2"
            >
              <Plus size={20} />
              <span className="text-sm">Log New Entry</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Scale className="text-primary" size={24} />
            </div>
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${parseFloat(weightDiff) <= 0 ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}>
              {parseFloat(weightDiff) <= 0 ? <TrendingDown size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1" />}
              {weightDiff}kg total
            </div>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Current Weight</p>
          <h3 className="text-4xl font-black">{currentWeight} <span className="text-lg text-gray-500">kg</span></h3>
        </div>

        <div className="glass p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Activity className="text-primary" size={24} />
            </div>
            <div className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
              <TrendingUp size={14} className="mr-1" />
              +4% total
            </div>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Muscle Mass</p>
          <h3 className="text-4xl font-black">34.0 <span className="text-lg text-gray-500">%</span></h3>
        </div>

        <div className="glass p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Calendar className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Days Consistent</p>
          <h3 className="text-4xl font-black">124 <span className="text-lg text-gray-500">days</span></h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[3rem] h-[400px]">
          <h3 className="text-xl font-black uppercase italic mb-8">Weight <span className="text-primary">Journey</span></h3>
          <div className="h-[280px]">
            <Line
              data={weightData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#666" } },
                  x: { grid: { display: false }, ticks: { color: "#666" } }
                }
              }}
            />
          </div>
        </div>

        <div className="glass p-8 rounded-[3rem] h-[400px]">
          <h3 className="text-xl font-black uppercase italic mb-8">Muscle <span className="text-primary">Gain</span></h3>
          <div className="h-[280px]">
            <Bar
              data={muscleData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#666" } },
                  x: { grid: { display: false }, ticks: { color: "#666" } }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="glass p-10 rounded-[3rem]">
        <h3 className="text-xl font-black uppercase italic mb-8">Measurement <span className="text-primary">History</span></h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500">Date</th>
                <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500">Weight</th>
                <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500">Body Fat %</th>
                <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500">Chest</th>
                <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500">Waist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {progressHistory.length > 0 ? (
                [...progressHistory].reverse().map((row: any, i: number) => (
                  <tr key={i} className="group">
                    <td className="py-5 text-sm font-bold text-gray-300">
                      {new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-5 text-sm font-black text-primary">{row.weight} kg</td>
                    <td className="py-5 text-sm text-gray-300">{row.bodyFat || "--"}%</td>
                    <td className="py-5 text-sm text-gray-300">{row.chest || "--"} in</td>
                    <td className="py-5 text-sm text-gray-300">{row.waist || "--"} in</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500 uppercase font-black text-xs tracking-widest">
                    No progress entries yet. Start tracking your journey!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0A0A0A] border border-white/10 w-full max-w-lg rounded-[3rem] overflow-hidden relative z-10"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black uppercase italic italic">Log New <span className="text-primary">Entry</span></h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleLogEntry} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Weight (kg)</label>
                      <input
                        required
                        type="number"
                        step="0.1"
                        value={newEntry.weight}
                        onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors"
                        placeholder="75.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Height (cm)</label>
                      <input
                        type="number"
                        value={newEntry.height}
                        onChange={(e) => setNewEntry({...newEntry, height: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-colors"
                        placeholder="175"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Chest (in)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newEntry.chest}
                        onChange={(e) => setNewEntry({...newEntry, chest: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Waist (in)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newEntry.waist}
                        onChange={(e) => setNewEntry({...newEntry, waist: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Body Fat %</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newEntry.bodyFat}
                        onChange={(e) => setNewEntry({...newEntry, bodyFat: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check size={20} />
                        Save Entry
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressPage;
