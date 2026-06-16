"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Trophy, Target, ShieldCheck, HeartPulse,
  Dumbbell, Users, Zap, CheckCircle2,
  ArrowRight, Award, Flame, ClipboardList,
  Coffee, Droplets, Smile, Clock, ExternalLink,
  Code
} from "lucide-react";
import Link from "next/link";

const trainers = [
  { name: "Suraj", role: "Expert Trainer / Bodybuilding Specialist", image: "https://images.unsplash.com/photo-1567013127542-490d757e51fe?q=80&w=1974&auto=format&fit=crop" },
  { name: "Sanket", role: "Expert Trainer / Strength Coach", image: "https://images.unsplash.com/photo-1491756589698-65707e8a4936?q=80&w=2070&auto=format&fit=crop" }
];

const facilities = [
  "Air Conditioned Workout Area", "Cardio Zone", "Weight Training Zone",
  "Functional Training Area", "Personal Training", "Locker Facility",
  "Clean Drinking Water", "Hygienic Environment", "Supplement Guidance",
  "Fitness Assessments"
];

const stats = [
  { value: "500+", label: "Active Members", icon: Users },
  { value: "2", label: "Certified Trainers", icon: Award },
  { value: "1000+", label: "Transformations", icon: Zap },
  { value: "5-Star", label: "Satisfaction", icon: Smile }
];

const AboutPage = () => {
  return (
    <div className="pt-20 pb-24 bg-[#050505]">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden mb-24">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Gym Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-sm mb-6">Fitness Temple Gym, Nashik</h2>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-tight mb-8">
              TRANSFORM YOUR <span className="ft-gradient-text">BODY</span>,<br />
              BUILD YOUR <span className="ft-gradient-text">CONFIDENCE</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-medium italic">
              "Change Your Life with the Ultimate Warrior Tribe Experience."
            </p>
            <Link href="/register" className="btn-primary px-10 py-5 text-lg rounded-full inline-flex items-center gap-3">
              Join The Tribe Now <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="container">
        {/* Statistics Counter */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              key={i}
              className="glass p-8 rounded-[2rem] text-center border border-white/5 relative overflow-hidden group"
            >
              <stat.icon className="text-primary/20 absolute -right-4 -bottom-4 w-24 h-24 group-hover:scale-110 transition-transform" />
              <h3 className="text-5xl font-black text-primary italic mb-2">{stat.value}</h3>
              <p className="text-gray-400 uppercase font-black tracking-widest text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
              WHY CHOOSE <span className="ft-gradient-text">FITNESS TEMPLE</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Modern Equipment", desc: "Modern Strength Training Equipment", icon: Dumbbell },
              { title: "Expert Trainers", desc: "Suraj & Sanket - Professional Guidance", icon: Award },
              { title: "Personalized Diets", desc: "Nutrition plans tailored for you", icon: ClipboardList },
              { title: "Progress Tracking", desc: "Systematic performance monitoring", icon: Target },
              { title: "Friendly Community", desc: "Join the Warrior Tribe family", icon: Users },
              { title: "Goal Focused", desc: "Fat Loss & Muscle Gain Programs", icon: Flame },
              { title: "Flexible Plans", desc: "Memberships that suit your lifestyle", icon: Clock },
              { title: "Pro Guidance", desc: "For Beginners & Advanced Athletes", icon: ShieldCheck }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all group"
              >
                <item.icon className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="text-xl font-black uppercase italic mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-[4rem] overflow-hidden border-8 border-white/5">
              <img
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Gym Interior"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 glass p-10 rounded-[3rem] hidden md:block">
               <h4 className="text-5xl font-black text-primary italic">7+</h4>
               <p className="text-gray-400 uppercase font-black tracking-widest text-xs">Years of Legacy</p>
            </div>
          </motion.div>

          <div className="space-y-12">
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tight mb-4 flex items-center gap-3">
                <Target className="text-primary" /> Our Mission
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                At Fitness Temple Gym, our mission is to help every member become stronger, healthier, and more confident through proper training, nutrition, and consistency. We believe fitness is not a destination but a lifelong devotion.
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tight mb-4 flex items-center gap-3">
                <ShieldCheck className="text-primary" /> Our Vision
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                To become the most trusted fitness destination in Nashik Road by providing world-class training, guidance, and support to every member, fostering a community of warriors who inspire each other.
              </p>
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <section className="mb-32">
          <div className="glass p-12 rounded-[4rem] border border-white/5">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-12 text-center">World-Class <span className="ft-gradient-text">Facilities</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <CheckCircle2 size={20} className="text-primary group-hover:text-black transition-colors" />
                  </div>
                  <span className="text-lg font-bold text-gray-300 group-hover:text-primary transition-colors">{facility}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Motivation Section */}
        <section className="mb-32 text-center py-20 relative overflow-hidden rounded-[4rem]">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Success" />
             <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative z-10 px-10">
            <h3 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-tight">
              "Every champion was once a beginner<br />who <span className="text-primary">refused to quit.</span>"
            </h3>
            <p className="text-xl text-gray-400 italic font-medium">Start your journey today and become the best version of yourself.</p>
          </div>
        </section>

        {/* Developers Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">MEET THE <span className="ft-gradient-text">DEVELOPER</span></h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <motion.div
              whileHover={{ y: -10 }}
              className="glass p-10 md:p-16 rounded-[4rem] border border-white/5 flex flex-col md:flex-row items-center gap-12 group"
            >
              <div className="w-64 h-64 flex-shrink-0 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-[3rem] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                <img
                  src="/assets/developer.jpg"
                  alt="Krishna Patil Rajput"
                  className="w-full h-full object-cover rounded-[3rem] relative z-10 border-4 border-white/10 group-hover:border-primary transition-colors duration-500"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <Code className="text-primary" size={24} />
                  <span className="text-primary font-black uppercase tracking-widest text-sm">Full Stack Web Developer & Freelancer</span>
                </div>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Krishna Patil Rajput</h3>
                <p className="text-gray-400 text-lg leading-relaxed font-medium mb-8">
                  "Designed and developed the complete Fitness Temple Gym Management Platform with advanced member management, trainer dashboards, AI fitness assistance, payment systems, and modern responsive design."
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <button className="btn-primary px-8 py-3 rounded-full text-sm font-black uppercase flex items-center gap-2">
                    Contact Me <ArrowRight size={18} />
                  </button>
                  <button className="glass px-8 py-3 rounded-full text-sm font-black uppercase border border-white/10 hover:border-primary transition-all flex items-center gap-2">
                    Portfolio <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Achievements / Visionaries (from original) */}
        <div>
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">THE <span className="ft-gradient-text">VISIONARIES</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { name: "Omkar", role: "Co-Owner / Fitness Enthusiast", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" },
              { name: "Siddhant", role: "Co-Owner / Operations Head", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop" }
            ].map((owner, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="glass rounded-[4rem] overflow-hidden group border border-white/5"
              >
                <div className="h-[400px] overflow-hidden">
                  <img src={owner.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={owner.name} />
                </div>
                <div className="p-10 text-center">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{owner.name}</h3>
                  <p className="text-primary font-bold uppercase tracking-widest text-sm">{owner.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
