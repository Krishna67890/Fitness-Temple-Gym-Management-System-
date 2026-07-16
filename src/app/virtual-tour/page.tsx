"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Map as MapIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Info,
  Box,
  Eye,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

const areas = [
  {
    id: "cardio",
    name: "Cardio Zone",
    description: "Premium treadmills and ellipticals with a view. Equipped with high-performance flooring for joint protection.",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070",
    hotspots: [
      { x: "30%", y: "40%", label: "Treadmills", info: "Latest matrix series with heart rate monitoring." },
      { x: "70%", y: "60%", label: "Cross Trainers", info: "Zero-impact cardiovascular conditioning." }
    ]
  },
  {
    id: "strength",
    name: "Strength Pit",
    description: "Heavy-duty power racks, plate-loaded machines, and a massive dumbbell range up to 50kg.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
    hotspots: [
      { x: "50%", y: "30%", label: "Squat Racks", info: "Olympic standard racks with safety bars." },
      { x: "20%", y: "70%", label: "Dumbbell Area", info: "Padded floor with mirrors for form check." }
    ]
  },
  {
    id: "crossfit",
    name: "Functional Area",
    description: "Open space for HIIT, kettlebells, and functional training. Includes battle ropes and sleds.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070",
    hotspots: [
      { x: "40%", y: "50%", label: "Battle Ropes", info: "Heavy duty ropes for explosive power." }
    ]
  }
];

const VirtualTour = () => {
  const [currentArea, setCurrentArea] = useState(0);
  const [showHotspot, setShowHotspot] = useState<number | null>(null);

  const nextArea = () => setCurrentArea((prev) => (prev + 1) % areas.length);
  const prevArea = () => setCurrentArea((prev) => (prev - 1 + areas.length) % areas.length);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black overflow-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-md bg-black/20">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-white/5 rounded-xl group-hover:bg-primary group-hover:text-black transition-all">
            <ArrowLeft size={20} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Arena</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
            {areas.map((area, idx) => (
              <button
                key={area.id}
                onClick={() => setCurrentArea(idx)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentArea === idx ? "bg-primary text-black" : "text-gray-500 hover:text-white"
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Viewport */}
      <div className="relative w-full h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={areas[currentArea].id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={areas[currentArea].image}
              alt={areas[currentArea].name}
              className="w-full h-full object-cover grayscale-[0.5] brightness-50"
            />

            {/* Hotspots */}
            {areas[currentArea].hotspots.map((spot, idx) => (
              <div
                key={idx}
                className="absolute"
                style={{ left: spot.x, top: spot.y }}
              >
                <button
                  onMouseEnter={() => setShowHotspot(idx)}
                  onMouseLeave={() => setShowHotspot(null)}
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute w-8 h-8 bg-primary/20 rounded-full animate-ping" />
                  <div className="relative w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_#FFD700]" />

                  <AnimatePresence>
                    {showHotspot === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 bg-black/90 backdrop-blur-xl border border-primary/30 p-4 rounded-2xl z-20 shadow-2xl"
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{spot.label}</p>
                        <p className="text-[9px] text-gray-400 font-bold leading-relaxed">{spot.info}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-12 bg-gradient-to-t from-black via-transparent to-transparent">
          <div className="max-w-xl pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              key={areas[currentArea].name + "title"}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-2xl text-primary">
                  <Compass className="animate-spin-slow" />
                </div>
                <h2 className="text-7xl font-black uppercase italic tracking-tighter leading-none">
                  {areas[currentArea].name.split(' ')[0]} <br />
                  <span className="text-primary">{areas[currentArea].name.split(' ')[1]}</span>
                </h2>
              </div>
              <p className="text-gray-400 text-lg font-medium max-w-md leading-relaxed">
                {areas[currentArea].description}
              </p>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={prevArea}
                  className="p-5 bg-white/5 hover:bg-white/10 rounded-3xl border border-white/10 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextArea}
                  className="p-5 bg-primary text-black rounded-3xl hover:scale-105 transition-all flex items-center gap-3 font-black uppercase tracking-widest text-xs"
                >
                  Next Area <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 flex flex-col gap-6 items-center">
          <div className="h-32 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="flex flex-col gap-4">
             <button className="p-3 bg-white/5 rounded-2xl hover:bg-primary hover:text-black transition-all group">
                <Maximize2 size={18} />
             </button>
             <button className="p-3 bg-white/5 rounded-2xl hover:bg-primary hover:text-black transition-all">
                <Info size={18} />
             </button>
             <button className="p-3 bg-white/5 rounded-2xl hover:bg-primary hover:text-black transition-all">
                <Box size={18} />
             </button>
          </div>
          <div className="h-32 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VirtualTour;
