"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Dumbbell, Star, Users, Trophy, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden py-20">
      {/* Background Video with Elite Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src="/assets/Fitness-Temple.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60 z-10" />
        {/* Animated Grid lines for tech feel */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] z-[5]" />
      </div>

      {/* Content */}
      <div className="container relative z-20 px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/30 px-6 py-2.5 rounded-full mb-10 backdrop-blur-md shadow-[0_0_20px_rgba(255,215,0,0.1)]"
            >
              <div className="flex items-center justify-center bg-primary p-2 rounded-full animate-pulse shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                 <Dumbbell size={16} className="text-black" />
              </div>
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">
                Nashik's Elite Fitness Sanctuary
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-[8rem] font-black mb-10 leading-[0.8] uppercase italic tracking-tighter"
            >
              FITNESS <br />
              <span className="ft-gradient-text">TEMPLE.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-xl text-gray-300 text-lg md:text-2xl mb-14 font-medium leading-relaxed border-l-[6px] border-primary pl-8"
            >
              "YOUR BODY IS YOUR TEMPLE." <br />
              <span className="text-white/80 text-base md:text-xl font-normal">Train stronger. Move better. Feel unstoppable. Join a fitness community built around your transformation.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row flex-wrap items-center gap-6"
            >
              <button
                onClick={() => document.getElementById('membership')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-4 group px-10 py-5"
              >
                <span className="text-lg italic font-black uppercase tracking-[0.15em]">Start Transformation</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <Link
                href="/portal"
                className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-5 rounded-2xl bg-black/60 border border-primary/50 hover:bg-primary/10 hover:border-primary transition-all text-primary font-black uppercase italic tracking-wider shadow-[0_0_25px_rgba(255,215,0,0.15)] group backdrop-blur-md"
              >
                <ShieldCheck size={22} className="text-primary group-hover:scale-110 transition-transform" />
                <span>Access Member Portal</span>
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <button
                onClick={() => document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center space-x-5 group text-white hover:text-primary transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all shadow-xl backdrop-blur-sm">
                  <Play className="fill-current ml-1 text-primary" size={28} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-black uppercase italic tracking-widest text-sm leading-tight">Explore Gym</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">View Our Arsenal</span>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Dynamic Stats Grid (Visual Component) */}
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.8 }}
             className="hidden lg:grid grid-cols-2 gap-6 relative"
          >
            {/* Background glow for stats */}
            <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full -z-10" />

            {[
              { label: "Active Members", value: "500+", icon: Users },
              { label: "Modern Stations", value: "25+", icon: Dumbbell },
              { label: "Expert Trainers", value: "10+", icon: Trophy },
              { label: "Star Rating", value: "4.9/5", icon: Star },
            ].map((stat, i) => (
              <div key={i} className="glass p-10 rounded-[3rem] border-white/10 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                  <stat.icon size={24} className="text-primary group-hover:text-black transition-colors" />
                </div>
                <h4 className="text-4xl font-black text-white italic leading-none mb-2 tracking-tighter">{stat.value}</h4>
                <p className="text-gray-500 uppercase font-black text-[10px] tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scrolling Background Text */}
      <div className="absolute bottom-10 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none whitespace-nowrap hidden lg:block">
        <span className="text-[12rem] font-black italic uppercase tracking-tighter inline-block animate-marquee">
          STRENGTH • DISCIPLINE • TRANSFORMATION • POWER • COMMUNITY • EXCELLENCE • STRENGTH • DISCIPLINE • TRANSFORMATION • POWER • COMMUNITY • EXCELLENCE •
        </span>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#050505] to-transparent z-10" />

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
