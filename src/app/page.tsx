"use client";
import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import MembershipPreview from "@/components/MembershipPreview";
import TrainersPreview from "@/components/TrainersPreview";
import BMICalculator from "@/components/BMICalculator";
import GalleryPreview from "@/components/GalleryPreview";
import SuccessStories from "@/components/SuccessStories";
import ContactSection from "@/components/ContactSection";
import { Dumbbell, Users, Trophy, ShieldCheck, Clock, Zap, MapPin } from "lucide-react";

export default function Home() {
  const features = [
    { title: "Strength Training", desc: "Heavy-duty lifting equipment for maximum gains.", icon: Dumbbell },
    { title: "Guru Coaching", desc: "Expert guidance from Suraj & Sanket.", icon: Users },
    { title: "Elite Facility", desc: "Premium training environment and hygiene standards.", icon: Trophy },
    { title: "Safe Training", desc: "Secure environment with 24/7 CCTV.", icon: ShieldCheck },
    { title: "Evening Devotion", desc: "Open daily from 4:30 PM for the fitness warriors.", icon: Clock },
    { title: "Rapid Results", desc: "Scientifically backed workout & diet plans.", icon: Zap }
  ];

  return (
    <>
      <Hero />
      <Stats />

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4">Our Core Values</h2>
            <h2 className="section-title">
              WHY TRAIN AT <span className="ft-gradient-text">THE TEMPLE?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="glass group p-10 rounded-[3rem] hover:border-primary/40 transition-all duration-500 hover:-translate-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-500 shadow-[0_0_0_0_rgba(255,0,0,0)] group-hover:shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                  <feature.icon className="text-primary group-hover:text-white transition-colors" size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MembershipPreview />

      {/* Equipment Showcase Section */}
      <section className="py-32 relative overflow-hidden bg-black">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -z-10" />
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4">The Arsenal</h2>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                PREMIUM <span className="ft-gradient-text">EQUIPMENT</span>
              </h2>
            </div>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-4">Professional Grade Infrastructure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Olympic Racks", category: "Strength", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" },
              { name: "Cardio Suite", category: "Endurance", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070" },
              { name: "Plate Loaded", category: "Hypertrophy", img: "https://images.unsplash.com/photo-1583454110551-21f2fa209f9c?q=80&w=2070" },
              { name: "Dumbbell Set", category: "Versatility", img: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=2070" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[400px] rounded-[3rem] overflow-hidden border border-white/5"
              >
                <img src={item.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10">
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-2 block">{item.category}</span>
                  <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">{item.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrainersPreview />

      {/* Location Section */}
      <section className="py-32 bg-secondary/5">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-8 leading-none">
                VISIT THE <br/><span className="ft-gradient-text">SANCTUARY</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl mt-1">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight">Location</h4>
                    <p className="text-gray-400">Fitness Temple Gym, Nashik</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl mt-1">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic tracking-tight">Hours</h4>
                    <p className="text-gray-400">Daily: Opens at 4:30 PM (Evening Session)</p>
                  </div>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/place/Fitness+Temple/@19.9743064,73.8407527,20z"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-12 px-12 inline-block text-center"
              >
                Get Directions
              </a>
            </div>
            <div className="h-[450px] rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.61376816654!2d73.8407527!3d19.9743064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddebddfc419adb%3A0xaa642814b39b7de3!2sFitness%20Temple!5e0!3m2!1sen!2sin!4v1716900000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <BMICalculator />
      <SuccessStories />
      <GalleryPreview />
      <ContactSection />
    </>
  );
}
