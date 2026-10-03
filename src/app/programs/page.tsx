"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Zap,
  Flame,
  Scale,
  UserCheck,
  ChefHat,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles
} from "lucide-react";
import Link from "next/link";

const programsList = [
  {
    slug: "bodybuilding",
    title: "Bodybuilding",
    subtitle: "Sculpt Your Masterpiece",
    desc: "Focus on maximum hypertrophy, aesthetic symmetry, and high-intensity volume to pack on serious muscle mass safely.",
    icon: Dumbbell,
    color: "from-red-600 to-black",
    textColor: "text-red-500",
    bgHover: "group-hover:bg-red-600",
    stats: { frequency: "5-6 Days/Wk", level: "Advanced" }
  },
  {
    slug: "strength-conditioning",
    title: "Strength & Conditioning",
    subtitle: "Build Functional Power",
    desc: "Increase raw power and explosive athletic performance. Focus heavily on compound movements like squats, deadlifts, and bench presses.",
    icon: Zap,
    color: "from-yellow-600 to-black",
    textColor: "text-yellow-500",
    bgHover: "group-hover:bg-yellow-600",
    stats: { frequency: "3-4 Days/Wk", level: "Intermediate+" }
  },
  {
    slug: "fat-loss-plans",
    title: "Fat Loss Plans",
    subtitle: "Torch Calories, Keep Muscle",
    desc: "Maximize fat oxidation while preserving lean muscle mass using high-intensity metabolic conditioning and strength protocols.",
    icon: Flame,
    color: "from-orange-600 to-black",
    textColor: "text-orange-500",
    bgHover: "group-hover:bg-orange-600",
    stats: { frequency: "4-5 Days/Wk", level: "All Levels" }
  },
  {
    slug: "muscle-gain",
    title: "Muscle Gain",
    subtitle: "The Science of Growth",
    desc: "Strategic clean-bulking programming designed for individuals looking to put on premium lean weight without excessive body fat.",
    icon: Scale,
    color: "from-blue-600 to-black",
    textColor: "text-blue-500",
    bgHover: "group-hover:bg-blue-600",
    stats: { frequency: "4 Days/Wk", level: "Beginner+" }
  },
  {
    slug: "personal-training",
    title: "Personal Training",
    subtitle: "Elite 1-on-1 Coaching",
    desc: "Work directly with Coach Sanket or Coach Suraj for a fully bespoke training experience, meticulous form refinement, and high accountability.",
    icon: UserCheck,
    color: "from-purple-600 to-black",
    textColor: "text-purple-500",
    bgHover: "group-hover:bg-purple-600",
    stats: { frequency: "Flexible", level: "Bespoke" }
  },
  {
    slug: "diet-nutrition",
    title: "Diet & Nutrition",
    subtitle: "Fuel Your Ambition",
    desc: "Science-backed, highly sustainable whole-food macro plans customized perfectly to align with your high-performance training lifestyle.",
    icon: ChefHat,
    color: "from-emerald-600 to-black",
    textColor: "text-emerald-500",
    bgHover: "group-hover:bg-emerald-600",
    stats: { frequency: "7 Days/Wk", level: "Lifestyle" }
  }
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-96 h-96 bg-red-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary font-black uppercase text-xs tracking-[0.2em] mb-6"
          >
            <Sparkles size={14} />
            Elite Training Protocols
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 leading-none"
          >
            CHOOSE YOUR <span className="ft-gradient-text">DESTINY</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed"
          >
            Our expert coaches have designed premium, result-oriented workout regimens to challenge your limits and build a supreme physique. Click on any protocol to view deep age-specific priorities and detailed structural highlights.
          </motion.p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programsList.map((program, idx) => {
            const IconComponent = program.icon;
            return (
              <motion.div
                key={program.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative glass rounded-[3.5rem] border border-white/5 hover:border-white/10 p-10 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300"
              >
                {/* Subtle gradient hover block */}
                <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />

                <div>
                  {/* Icon and Stats header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/10 ${program.bgHover} group-hover:text-black`}>
                      <IconComponent className={`${program.textColor} group-hover:text-white transition-colors duration-300`} size={28} />
                    </div>
                    <div className="flex flex-col items-end text-[11px] font-black tracking-widest text-gray-500 uppercase space-y-0.5">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock size={12} className="text-primary" />
                        {program.stats.frequency}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <TrendingUp size={12} className="text-primary" />
                        {program.stats.level}
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-3xl font-black uppercase italic tracking-tight mb-2 group-hover:text-primary transition-colors duration-300">
                    {program.title}
                  </h3>
                  <p className="text-primary/90 text-xs font-bold uppercase tracking-wider mb-4 italic">
                    {program.subtitle}
                  </p>
                  <p className="text-gray-400 leading-relaxed text-sm font-medium mb-8">
                    {program.desc}
                  </p>
                </div>

                {/* Call To Action button */}
                <Link
                  href={`/programs/${program.slug}`}
                  className="mt-auto w-full py-4 rounded-2xl bg-white/5 group-hover:bg-primary border border-white/5 group-hover:border-primary flex items-center justify-center gap-2 text-sm font-black uppercase tracking-wider text-white group-hover:text-black shadow-lg transition-all duration-300"
                >
                  Explore Protocol
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
