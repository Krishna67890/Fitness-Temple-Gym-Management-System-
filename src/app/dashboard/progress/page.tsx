"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Scale,
  Calendar,
  Download,
  Plus
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

const weightData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Weight (kg)",
      data: [85, 83.5, 82, 80.5, 79, 78],
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

const ProgressPage = () => {
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
          <button className="btn-primary py-3 px-6 flex items-center space-x-2">
            <Plus size={20} />
            <span className="text-sm">Log New Entry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Scale className="text-primary" size={24} />
            </div>
            <div className="flex items-center text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
              <TrendingDown size={14} className="mr-1" />
              -7kg total
            </div>
          </div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Current Weight</p>
          <h3 className="text-4xl font-black">78.0 <span className="text-lg text-gray-500">kg</span></h3>
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
                <th className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: "May 25, 2024", w: "78.0 kg", f: "18%", c: "42 in", wa: "32 in", s: "Improved" },
                { date: "May 10, 2024", w: "79.2 kg", f: "19%", c: "41.5 in", wa: "33 in", s: "Improved" },
                { date: "Apr 25, 2024", w: "80.5 kg", f: "20%", c: "41 in", wa: "34 in", s: "Stable" },
                { date: "Apr 10, 2024", w: "81.8 kg", f: "21%", c: "40.5 in", wa: "35 in", s: "Improved" },
              ].map((row, i) => (
                <tr key={i} className="group">
                  <td className="py-5 text-sm font-bold text-gray-300">{row.date}</td>
                  <td className="py-5 text-sm font-black text-primary">{row.w}</td>
                  <td className="py-5 text-sm text-gray-300">{row.f}</td>
                  <td className="py-5 text-sm text-gray-300">{row.c}</td>
                  <td className="py-5 text-sm text-gray-300">{row.wa}</td>
                  <td className="py-5">
                    <span className="text-[10px] font-black uppercase px-2 py-1 bg-green-500/10 text-green-500 rounded-md">
                      {row.s}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
