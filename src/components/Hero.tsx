"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Dumbbell } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40 z-10" />
      </div>

      {/* Content */}
      <div className="container relative z-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-8"
          >
            <div className="flex items-center justify-center bg-primary p-1.5 rounded-full">
               <Dumbbell size={14} className="text-white" />
            </div>
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
              Nashik's Ultimate Fitness Temple
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-9xl font-black mb-8 leading-[0.85] uppercase italic tracking-tighter"
          >
            TRANSFORM YOUR <br />
            <span className="ft-gradient-text">BODY & LIFE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-xl text-gray-300 text-lg md:text-xl mb-12 font-medium leading-relaxed border-l-4 border-primary pl-6"
          >
            Welcome to <span className="text-white font-black italic uppercase">Fitness Temple Gym.</span> Stop making excuses. Start making results with Nashik's most elite trainers and equipment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 mt-12"
          >
            <Link href="/membership" className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-3 group">
              <span className="text-xl italic font-black uppercase tracking-widest">Join The Temple</span>
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/gallery" className="flex items-center space-x-4 group text-white hover:text-secondary transition-colors">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary/10 transition-all">
                <Play className="fill-current ml-1" />
              </div>
              <span className="font-black uppercase italic tracking-widest text-sm">Experience Tour</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Floating (Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="hidden lg:flex absolute right-12 bottom-24 flex-col gap-8"
      >
        {[
          { label: "Elite Trainers", value: "05+" },
          { label: "Modern Machines", value: "50+" },
          { label: "Active Members", value: "300+" },
        ].map((stat, i) => (
          <div key={i} className="text-right border-r-4 border-primary pr-6">
            <h4 className="text-4xl font-black text-white italic leading-none">{stat.value}</h4>
            <p className="text-gray-500 uppercase font-black text-[10px] tracking-widest">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
