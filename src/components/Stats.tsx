"use client";
import React from "react";
import { motion } from "framer-motion";

import { Users, Dumbbell, Award, Timer } from "lucide-react";

const stats = [
  { label: "Active Members", value: "500+", icon: Users },
  { label: "Expert Coaches", value: "3+", icon: Dumbbell },
  { label: "Years of Excellence", value: "10+", icon: Award },
  { label: "Daily Sessions", value: "24+", icon: Timer },
];

const Stats = () => {
  return (
    <section className="relative z-20 -mt-20 lg:-mt-28">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass p-10 rounded-[3rem] text-center flex flex-col items-center justify-center border-t border-white/10 shadow-3xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Animated Background Pulse */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

              <stat.icon className="text-primary/40 group-hover:text-primary mb-6 transition-colors duration-500" size={40} />

              <h3 className="text-5xl md:text-6xl font-black mb-2 ft-gradient-text tracking-tighter">
                {stat.value}
              </h3>

              <p className="text-gray-500 group-hover:text-gray-300 font-black uppercase tracking-[0.2em] text-[10px] transition-colors">
                {stat.label}
              </p>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
