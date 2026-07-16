"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Watch,
  Smartphone,
  Bluetooth,
  Activity,
  Heart,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

const BiometricsPage = () => {
  const [syncing, setSyncing] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>([]);

  const devices = [
    { id: "apple", name: "Apple Watch", icon: Watch, color: "text-red-500", brand: "Apple Health" },
    { id: "garmin", name: "Garmin Connect", icon: Activity, color: "text-blue-500", brand: "Garmin Ltd" },
    { id: "fitbit", name: "Fitbit Sense", icon: Heart, color: "text-teal-500", brand: "Google" },
    { id: "samsung", name: "Galaxy Watch", icon: Smartphone, color: "text-orange-500", brand: "Samsung Health" }
  ];

  const handleConnect = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setSyncing(null);
      setConnected(prev => [...prev, id]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          </Link>
          <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
            <Bluetooth size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Biometric Sync Active</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">
            WEARABLE <span className="ft-gradient-text">SYNCING</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl font-medium leading-relaxed">
            Connect your favorite fitness devices to automatically track your heart rate, calories, and recovery within the Temple ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {devices.map((device, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={device.id}
              className={`glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all ${
                connected.includes(device.id) ? "bg-primary/5" : ""
              }`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 bg-white/5 rounded-2xl ${device.color}`}>
                    <device.icon size={28} />
                  </div>
                  {connected.includes(device.id) ? (
                    <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 size={12} /> Connected
                    </div>
                  ) : (
                    <Zap size={20} className="text-gray-700" />
                  )}
                </div>

                <h3 className="text-2xl font-black uppercase italic mb-1">{device.name}</h3>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-8">{device.brand}</p>

                <button
                  onClick={() => handleConnect(device.id)}
                  disabled={syncing !== null || connected.includes(device.id)}
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                    connected.includes(device.id)
                      ? "bg-white/5 text-gray-500 cursor-default"
                      : "bg-primary text-black hover:scale-[1.02]"
                  }`}
                >
                  {syncing === device.id ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Authorizing...
                    </>
                  ) : connected.includes(device.id) ? (
                    "Manage Connection"
                  ) : (
                    "Connect Now"
                  )}
                </button>
              </div>

              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <device.icon size={160} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass p-10 rounded-[4rem] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-3 text-primary">
                  <AlertCircle size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Privacy Protocol</span>
               </div>
               <h3 className="text-3xl font-black uppercase italic tracking-tight">Your Data <br />Is <span className="text-primary">Secured</span></h3>
               <p className="text-gray-500 text-sm leading-relaxed">
                 We use end-to-end encryption for all biometric data synced from your wearable devices. No health data is shared with third parties without your explicit consent.
               </p>
            </div>
            <div className="w-full md:w-auto">
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Uptime", val: "99.9%" },
                    { label: "Encryption", val: "AES-256" }
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 text-center">
                       <p className="text-2xl font-black italic text-white">{s.val}</p>
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{s.label}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricsPage;
