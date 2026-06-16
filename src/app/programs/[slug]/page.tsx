"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Target,
  Clock,
  Users,
  ChevronRight,
  CheckCircle2,
  Info,
  ArrowLeft,
  Zap,
  Flame,
  Scale,
  UserCheck,
  ChefHat
} from "lucide-react";
import Link from "next/link";

const programImages: Record<string, string[]> = {
  "bodybuilding": [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
  ],
  "strength-conditioning": [
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1887&auto=format&fit=crop"
  ],
  "fat-loss-plans": [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=2085&auto=format&fit=crop"
  ],
  "muscle-gain": [
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1434754239826-eb3b7d8b888a?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
  ],
  "personal-training": [
    "https://images.unsplash.com/photo-1571902258288-6aee36259ad1?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591117207239-788cd8593840?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop"
  ],
  "diet-nutrition": [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
  ]
};

const programData: Record<string, any> = {
  "bodybuilding": {
    title: "Bodybuilding",
    subtitle: "Sculpt Your Masterpiece",
    description: "Our bodybuilding program focuses on maximum hypertrophy and aesthetic symmetry. We combine old-school intensity with modern scientific principles to help you pack on serious muscle mass.",
    icon: <Dumbbell className="text-primary" size={48} />,
    color: "from-red-600 to-black",
    benefits: ["Maximum Hypertrophy", "Aesthetic Symmetry", "Increased Strength", "Posing Guidance"],
    ageGroups: [
      { age: "18-25", priority: "High Intensity / Fast Recovery", focus: "Building foundation and heavy compound movements." },
      { age: "26-40", priority: "Volume & Consistency", focus: "Refining shape and maintaining metabolic health." },
      { age: "40+", priority: "Joint Longevity / Recovery", focus: "Control, mind-muscle connection, and injury prevention." }
    ],
    schedule: "5-6 Days / Week",
    nutrition: "High Protein / Moderate Carbs (Bulking/Cutting phases)",
    difficulty: "Advanced"
  },
  "strength-conditioning": {
    title: "Strength & Conditioning",
    subtitle: "Build Functional Power",
    description: "This program is designed for athletes and those looking to increase their raw power and explosive performance. Focus on compound lifts: Squat, Bench, Deadlift, and Overhead Press.",
    icon: <Zap className="text-yellow-500" size={48} />,
    color: "from-yellow-600 to-black",
    benefits: ["Raw Power", "Explosive Speed", "Injury Resilience", "Core Stability"],
    ageGroups: [
      { age: "18-25", priority: "Explosiveness", focus: "Maximum power output and plyometrics." },
      { age: "26-40", priority: "Strength Maintenance", focus: "Heavy triples and progressive overload." },
      { age: "40+", priority: "Functional Mobility", focus: "Stability, posture, and bone density." }
    ],
    schedule: "3-4 Days / Week",
    nutrition: "High Carb / High Protein (Fueling for Performance)",
    difficulty: "Intermediate to Advanced"
  },
  "fat-loss-plans": {
    title: "Fat Loss Plans",
    subtitle: "Torch Calories, Keep Muscle",
    description: "Our fat loss protocols are designed to maximize fat oxidation while preserving lean muscle mass. We use a combination of HIIT, metabolic conditioning, and strength training.",
    icon: <Flame className="text-orange-500" size={48} />,
    color: "from-orange-600 to-black",
    benefits: ["Rapid Fat Oxidation", "Preserved Muscle", "Increased Metabolism", "Endurance"],
    ageGroups: [
      { age: "18-25", priority: "Metabolic Flexibility", focus: "High intensity intervals and active lifestyle." },
      { age: "26-40", priority: "Sustainability", focus: "Steady state cardio + Heavy lifting to burn more at rest." },
      { age: "40+", priority: "Hormonal Balance", focus: "Stress management and consistent low-impact movement." }
    ],
    schedule: "4-5 Days / Week",
    nutrition: "Caloric Deficit / High Protein / High Fiber",
    difficulty: "Beginner to Advanced"
  },
  "muscle-gain": {
    title: "Muscle Gain",
    subtitle: "The Science of Growth",
    description: "Perfect for those struggling to put on weight. Our Lean Bulk program ensures you gain quality muscle without excessive fat gain through strategic caloric surpluses.",
    icon: <Scale className="text-blue-500" size={48} />,
    color: "from-blue-600 to-black",
    benefits: ["Quality Mass", "Increased Strength", "Better Insulin Sensitivity", "Improved Posture"],
    ageGroups: [
      { age: "18-25", priority: "Maximum Growth", focus: "Frequent eating and heavy lifting." },
      { age: "26-40", priority: "Steady Progress", focus: "Balanced macros and structured deloads." },
      { age: "40+", priority: "Lean Gains", focus: "Avoiding inflammation and focusing on recovery." }
    ],
    schedule: "4 Days / Week",
    nutrition: "Caloric Surplus / Targeted Carbohydrates",
    difficulty: "Beginner to Intermediate"
  },
  "personal-training": {
    title: "Personal Training",
    subtitle: "Elite 1-on-1 Coaching",
    description: "Work directly with Coach Sanket or Coach Suraj for a completely customized fitness experience. No guesswork—just results through expert form correction and accountability.",
    icon: <UserCheck className="text-primary" size={48} />,
    color: "from-red-800 to-black",
    benefits: ["Expert Form Correction", "Personalized Plans", "Daily Accountability", "Mental Coaching"],
    ageGroups: [
      { age: "Any", priority: "Individualized Goal", focus: "We tailor everything based on your medical history and current fitness level." }
    ],
    schedule: "Flexible (3-6 Days)",
    nutrition: "Fully Personalized Meal Plans",
    difficulty: "All Levels"
  },
  "diet-nutrition": {
    title: "Diet & Nutrition",
    subtitle: "Fuel Your Ambition",
    description: "Training is only 30% of the equation. Our nutrition plans are science-backed and sustainable—no fad diets, just balanced macros that fit your lifestyle.",
    icon: <ChefHat className="text-emerald-500" size={48} />,
    color: "from-emerald-600 to-black",
    benefits: ["Sustainable Habits", "Optimal Performance", "Better Recovery", "Improved Energy"],
    ageGroups: [
      { age: "18-25", priority: "Growth & Performance", focus: "High energy demands and muscle building." },
      { age: "26-40", priority: "Body Composition", focus: "Balancing busy lifestyle with nutritious choices." },
      { age: "40+", priority: "Longevity & Health", focus: "Anti-inflammatory foods and micronutrient density." }
    ],
    schedule: "7 Days / Week (Lifestyle)",
    nutrition: "Macro-based / Whole Foods Focus",
    difficulty: "Lifestyle Change"
  }
};

const ProgramDetail = () => {
  const params = useParams();
  const slug = params.slug as string;
  const program = programData[slug];

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">PROGRAM NOT FOUND</h1>
          <Link href="/" className="btn-primary py-2 px-6">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-20">
      {/* Hero Section */}
      <section className={`relative pt-32 pb-20 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-20`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

        <div className="container relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Temple</span>
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 bg-white/5 rounded-3xl border border-white/10"
            >
              {program.icon}
            </motion.div>
            <div className="text-center md:text-left">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-2"
              >
                {program.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-primary text-xl font-bold uppercase italic tracking-widest"
              >
                {program.subtitle}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-[-40px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[3rem] border-white/5"
            >
              <h2 className="text-2xl font-black uppercase italic mb-6 flex items-center gap-3">
                <Info className="text-primary" />
                Program <span className="text-primary">Overview</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {program.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {program.benefits.map((benefit: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className="font-bold text-gray-200">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Added Gallery Section */}
              <div className="mt-12">
                <h3 className="text-xl font-black uppercase italic mb-6">Program <span className="text-primary">Gallery</span></h3>
                <div className="grid grid-cols-3 gap-4">
                  {programImages[slug]?.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-video rounded-2xl overflow-hidden border border-white/10"
                    >
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Age Priority Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[3rem] border-white/5"
            >
              <h2 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                <Users className="text-primary" />
                Age-Specific <span className="text-primary">Priority</span>
              </h2>
              <div className="space-y-6">
                {program.ageGroups.map((group: any, i: number) => (
                  <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-primary font-black text-xl italic">{group.age} Years</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase tracking-widest">Priority</span>
                    </div>
                    <p className="text-white font-bold mb-2 uppercase text-sm tracking-tighter">{group.priority}</p>
                    <p className="text-gray-500 text-sm">{group.focus}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-[3rem] border-white/5 sticky top-32"
            >
              <h3 className="text-xl font-black uppercase italic mb-8">Program <span className="text-primary">Stats</span></h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Frequency</p>
                    <p className="font-bold text-white">{program.schedule}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                    <Target size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Difficulty</p>
                    <p className="font-bold text-white">{program.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                    <ChefHat size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Nutrition</p>
                    <p className="font-bold text-white text-sm">{program.nutrition}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/5">
                <p className="text-gray-500 text-sm mb-6 italic">Ready to transform? Start your journey today with Fitness Temple.</p>
                <Link href="/register" className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                  Enroll Now
                  <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramDetail;
