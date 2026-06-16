"use client";
import React from "react";
import { Check, ArrowRight, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Basic Plan",
    price: "700",
    duration: "1 Month",
    description: "🥉 Essential training for beginners.",
    features: ["Gym Access", "Basic Workout Guidance", "Attendance Tracking", "Locker Access"],
    popular: false,
    color: "from-orange-400 to-orange-700" // Bronze-ish
  },
  {
    name: "Standard Plan",
    price: "1,800",
    duration: "3 Months",
    description: "🥈 Most popular choice for consistency.",
    features: ["Gym Access", "Full Workout Guidance", "Monthly Progress Tracking", "Attendance Tracking", "Diet Consultation"],
    popular: true,
    color: "from-gray-300 to-gray-500" // Silver-ish
  }
];

const MembershipPreview = () => {
  return (
    <section className="py-32 relative">
      {/* Special Offer Banner */}
      <div className="container mb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary via-secondary to-primary p-[2px] rounded-3xl overflow-hidden"
        >
          <div className="bg-black rounded-[calc(1.5rem-1px)] p-6 text-center">
            <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-4">
              <Zap className="text-secondary animate-pulse" />
              🎉 Join Fitness Temple Gym Today!
              <span className="text-primary"> ₹700 for 1 Month | ₹1800 for 3 Months</span>
              <Zap className="text-secondary animate-pulse" />
            </h3>
            <p className="text-gray-400 mt-2 font-bold uppercase tracking-tighter">
              Train with Experts <span className="text-white">Suraj & Sanket</span> under the guidance of Owners <span className="text-white">Omkar & Siddhant</span>. 💪⚡
            </p>
          </div>
        </motion.div>
      </div>

      <div className="container">
        <div className="text-center mb-20">
          <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4">Membership Tiers</h2>
          <h2 className="section-title">
            START YOUR <span className="ft-gradient-text">DEVOTION</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative glass p-12 rounded-[4rem] flex flex-col transition-all duration-500 group hover:border-primary/40 ${
                plan.popular ? "border-2 border-primary ring-[15px] ring-primary/5 z-10 bg-white/[0.08]" : "border-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-black px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                  <Star size={14} fill="black" />
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">{plan.name}</h3>
                <p className="text-gray-500 font-medium text-sm italic">{plan.description}</p>
              </div>

              <div className="flex items-baseline mb-10">
                <span className="text-7xl font-black text-primary ft-gradient-text tracking-tighter">₹{plan.price}</span>
                <span className="text-gray-500 font-black uppercase tracking-widest text-[12px] ml-3">/ {plan.duration}</span>
              </div>

              <ul className="space-y-6 mb-12 flex-grow">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center text-gray-300 font-bold text-base tracking-tight group-hover:text-white transition-colors">
                    <div className="bg-primary/10 p-1.5 rounded-full mr-5 group-hover:bg-primary/20 transition-all">
                      <Check className="text-primary w-5 h-5" strokeWidth={4} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/membership"
                className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] transition-all duration-300 transform flex items-center justify-center space-x-3 text-lg ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-secondary hover:text-black shadow-[0_20px_40px_rgba(255,0,0,0.3)]"
                    : "bg-white/5 text-white border border-white/10 hover:bg-primary hover:border-primary"
                }`}
              >
                <span>Select Plan</span>
                <ArrowRight size={22} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipPreview;
