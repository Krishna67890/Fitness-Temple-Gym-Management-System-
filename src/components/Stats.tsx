"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Dumbbell, Award, Timer } from "lucide-react";
import { gsap } from "gsap";

const stats = [
  { label: "Active Members", numericValue: 500, suffix: "+", icon: Users, color: "text-primary" },
  { label: "Expert Coaches", numericValue: 3, suffix: "+", icon: Dumbbell, color: "text-blue-400" },
  { label: "Years of Excellence", numericValue: 10, suffix: "+", icon: Award, color: "text-purple-400" },
  { label: "Daily Sessions", numericValue: 24, suffix: "+", icon: Timer, color: "text-green-400" },
];

const Stats = () => {
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const initCounters = async () => {
      try {
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        counterRefs.current.forEach((el, i) => {
          if (!el) return;
          const target = stats[i].numericValue;
          const obj = { val: 0 };

          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: "power2.out",
            onUpdate: () => {
              if (el) el.textContent = Math.round(obj.val).toString();
            },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });
      } catch {
        // Fallback: show values directly
        counterRefs.current.forEach((el, i) => {
          if (el) el.textContent = stats[i].numericValue.toString();
        });
      }
    };

    initCounters();
  }, []);

  return (
    <section className="relative z-20 -mt-20 lg:-mt-28">
      <div className="container px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass p-6 md:p-10 rounded-2xl md:rounded-[3rem] text-center flex flex-col items-center justify-center border-t border-white/10 shadow-3xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden"
            >
              {/* Animated Background Pulse */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

              <stat.icon className={`${stat.color} opacity-60 group-hover:opacity-100 mb-6 transition-all duration-500 group-hover:scale-110`} size={40} />

              <h3 className="text-5xl md:text-6xl font-black mb-2 ft-gradient-text tracking-tighter">
                <span
                  ref={(el) => { counterRefs.current[index] = el; }}
                >
                  0
                </span>
                {stat.suffix}
              </h3>

              <p className="text-gray-500 group-hover:text-gray-300 font-black uppercase tracking-[0.2em] text-[10px] transition-colors">
                {stat.label}
              </p>

              {/* Decorative Corner Accent */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
