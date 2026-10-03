"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Shield,
  Star,
  Crown,
  Zap,
  Dumbbell,
  Activity,
  Target,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { PRICING, OWNER_WHATSAPP, GYM_NAME } from "@/lib/constants";
import imageMap from "@/lib/imageMap";

const plans = [
  {
    id: "basic-1-day",
    name: "1 Day Pass",
    icon: Zap,
    price: PRICING.ONE_DAY.toString(),
    duration: "1 Day",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    features: ["Single Day Access", "Standard Gym Rules", "All Equipment Use", "No Commitment"],
  },
  {
    id: "basic-1",
    name: "Monthly Plan",
    icon: Shield,
    price: PRICING.MONTHLY.toString(),
    duration: "1 Month",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    features: ["Gym Access", "Basic Workout Guidance", "Locker Access", "Digital ID Card"],
  },
  {
    id: "basic-3",
    name: "Quarterly Plan",
    icon: Star,
    price: PRICING.QUARTERLY.toString(),
    duration: "3 Months",
    color: "text-primary",
    bgColor: "bg-primary/10",
    popular: true,
    features: ["Gym Access", "Full Workout Guidance", "Diet Consultation", "Progress Tracking"],
  },
  {
    id: "basic-12",
    name: "Annual Plan",
    icon: Crown,
    price: PRICING.ANNUAL.toString(),
    duration: "12 Months",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    bestValue: true,
    features: ["Best Value (₹583/Mo)", "Full Temple Access", "All-Season Guidance", "Legacy Status"],
  },
];

const cardioPlans = [
  { name: "1 Day Membership", price: PRICING.ONE_DAY.toString(), duration: "1 Day" },
  { name: "1 Month Membership", price: PRICING.MONTHLY.toString(), duration: "1 Month" },
  { name: "2 Months Membership", price: PRICING.TWO_MONTHS.toString(), duration: "2 Months" },
  { name: "3 Months Membership", price: PRICING.QUARTERLY.toString(), duration: "3 Months" },
  { name: "6 Months Membership", price: PRICING.HALF_YEARLY.toString(), duration: "6 Months" },
  { name: "12 Months Membership", price: PRICING.ANNUAL.toString(), duration: "12 Months" },
];

const MembershipPage = () => {
  const [selectedPlanIndex, setSelectedPlanIndex] = React.useState(2); // Default to 3 Months

  const selectedPlan = cardioPlans[selectedPlanIndex];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-sm mb-6"
          >
            Invest In Yourself
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none mb-8"
          >
            MEMBERSHIP <span className="ft-gradient-text">PLANS</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Choose the plan that fits your goals. From short-term intensity to long-term devotion.
          </p>
          <div className="mt-8">
            <Link href="/membership/quiz" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-all group">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-primary">Not sure? Take our AI Membership Quiz</span>
              <ChevronRight size={14} className="text-gray-600 group-hover:text-primary" />
            </Link>
          </div>
        </div>

        {/* Best Value Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mb-20 p-[2px] rounded-[2.5rem] bg-gradient-to-r from-primary via-secondary to-primary"
        >
          <div className="bg-[#0A0A0A] rounded-[calc(2.5rem-2px)] p-8 text-center flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="bg-primary/20 p-4 rounded-2xl">
                <Crown size={32} className="text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase italic leading-none mb-1 text-white">Best Value Selection</h3>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Annual Membership Only ₹{PRICING.ANNUAL} (₹583/Month)</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Link href={`https://wa.me/${OWNER_WHATSAPP}?text=Hi!%20I%20want%20to%20enroll%20in%20the%20Annual%20Plan%20at%20${encodeURIComponent(GYM_NAME)}.`} className="btn-primary px-8 py-3 rounded-xl text-xs font-black uppercase italic text-center flex items-center justify-center">
                Get Annual Deal
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-24">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass p-8 rounded-[3rem] border transition-all relative flex flex-col ${
                plan.popular ? "border-primary/50 shadow-[0_0_30px_rgba(255,215,0,0.1)] scale-105 z-10" : "border-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Most Popular
                </div>
              )}
              {plan.bestValue && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Best Value
                </div>
              )}

              <div className={`${plan.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                <plan.icon className={plan.color} size={28} />
              </div>

              <h3 className="text-2xl font-black uppercase italic mb-1 text-white">{plan.name}</h3>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-6">{plan.duration} Commitment</p>

              <div className="mb-8">
                <span className="text-4xl font-black text-white italic tracking-tighter">₹{plan.price}</span>
                <span className="text-gray-500 text-xs font-bold uppercase ml-2">Total</span>
              </div>

              <div className="space-y-4 mb-10 flex-grow text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="text-primary" size={14} strokeWidth={3} />
                    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`https://wa.me/${OWNER_WHATSAPP}?text=Hi!%20I%20want%20to%20enroll%20in%20the%20${encodeURIComponent(plan.name)}%20(₹${plan.price})%20at%20${encodeURIComponent(GYM_NAME)}.`}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all text-center flex items-center justify-center ${
                  plan.popular ? "bg-primary text-black" : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                }`}
              >
                Enroll Now
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Gym + Cardio Section */}
          <div className="glass p-10 rounded-[4rem] border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12">
                <Activity size={200} />
             </div>
             <div className="relative z-10">
               <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-4">
                  <Activity className="text-primary" size={32} />
                  🏋️ FITNESS <span className="text-primary">PLANS</span>
               </h3>
               <div className="space-y-4 mb-10">
                 {cardioPlans.map((plan, i) => (
                   <button
                     key={i}
                     onClick={() => setSelectedPlanIndex(i)}
                     className={`w-full flex items-center justify-between p-5 border rounded-3xl transition-all group text-left ${
                       selectedPlanIndex === i
                       ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                       : "bg-white/5 border-white/5 hover:border-white/20"
                     }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full border-2 transition-all ${selectedPlanIndex === i ? "bg-primary border-primary scale-125" : "border-gray-600"}`} />
                        <div>
                          <p className="text-lg font-black uppercase italic text-white leading-none mb-1">{plan.name}</p>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{plan.duration}</p>
                        </div>
                     </div>
                     <span className={`text-2xl font-black italic tracking-tighter transition-transform group-hover:scale-110 ${selectedPlanIndex === i ? "text-white" : "text-primary"}`}>
                       ₹{plan.price}
                     </span>
                   </button>
                 ))}
               </div>
               <Link
                 href={`https://wa.me/${OWNER_WHATSAPP}?text=Hi!%20I%20want%20to%20enroll%20in%20the%20${encodeURIComponent(selectedPlan.name)}%20(₹${selectedPlan.price})%20at%20${encodeURIComponent(GYM_NAME)}.`}
                 className="btn-primary w-full py-5 rounded-2xl text-sm font-black uppercase italic text-center flex items-center justify-center shadow-[0_10px_30px_rgba(255,215,0,0.2)]"
               >
                  Enroll In {selectedPlan.name}
               </Link>
               <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80 bg-red-500/5 py-2 rounded-lg border border-red-500/10">
                 ⚠️ Note: Fees once paid will not refunded.
               </p>
             </div>
          </div>

          {/* Personal Training Section */}
          <div className="glass p-10 rounded-[4rem] border-white/5 relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent group">
             <div className="absolute top-0 right-0 p-10 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Dumbbell size={200} />
             </div>

             <div className="relative z-10 h-full flex flex-col">
               <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                  <div>
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                        <Target className="text-primary" size={32} />
                        👨‍🏫 PERSONAL <span className="text-primary">TRAINING</span>
                    </h3>
                    <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mt-1">Lead by Coach Sanket Sir</p>
                  </div>
               </div>

               <p className="text-gray-400 font-medium italic text-lg mb-8 leading-relaxed max-w-md">
                 Work directly with Coach Sanket for a completely customized fitness experience tailored to your unique biology.
               </p>

               <div className="mb-8 w-full h-[576px] rounded-[3.5rem] overflow-hidden border border-primary/20 shadow-[0_0_80px_rgba(255,215,0,0.25)] relative group">
                  {/* Photo adjusted to 6 inches (576px) height for a premium print feel */}
                  <img
                    src={imageMap.sanket}
                    alt="Coach Sanket"
                    className="w-full h-full object-cover object-[center_10%] group-hover:scale-105 transition-transform duration-[3s] ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent opacity-90" />

                  {/* Decorative corner accent */}
                  <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               </div>

               <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[3rem] border border-primary/20 mb-8 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2">Service Fee</p>
                    <p className="text-5xl font-black italic tracking-tighter text-white">₹{PRICING.PERSONAL_TRAINING} <span className="text-sm text-gray-500 uppercase">/ Month</span></p>
                  </div>
                  <div className="p-4 bg-primary/20 rounded-full">
                     <Star size={32} className="text-primary animate-pulse" fill="currentColor" />
                  </div>
               </div>

               <Link href={`https://wa.me/${OWNER_WHATSAPP}?text=I'm%20interested%20in%20Personal%20Training%20with%20Sanket%20Sir%20at%20${encodeURIComponent(GYM_NAME)}`} className="btn-primary w-full py-5 rounded-2xl text-sm font-black uppercase italic text-center">
                  Book Sanket Sir
               </Link>
             </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto border-t border-white/5 pt-24">
           {[
             { title: "WhatsApp Support", desc: "Talk directly to the owner for any queries or payments." },
             { title: "Quick Enrollment", desc: "Enroll instantly via WhatsApp and get started today." },
             { title: "Direct Payment", desc: "Pay securely via WhatsApp and receive your digital receipt." }
           ].map((f, i) => (
             <div key={i} className="text-center group">
                <div className="w-16 h-1 bg-primary/20 mx-auto mb-8 group-hover:w-32 transition-all duration-500" />
                <h4 className="text-2xl font-black uppercase italic tracking-tight mb-4">{f.title}</h4>
                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
