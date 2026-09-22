"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import MembershipPreview from "@/components/MembershipPreview";
import TrainersPreview from "@/components/TrainersPreview";
import EquipmentSection from "@/components/EquipmentSection";
import BMICalculator from "@/components/BMICalculator";
import GalleryPreview from "@/components/GalleryPreview";
import ReviewsSection from "@/components/ReviewsSection";
import WorkoutBuilder from "@/components/WorkoutBuilder";
import TrialBooking from "@/components/TrialBooking";
import GoalSelector from "@/components/GoalSelector";
import ContactSection from "@/components/ContactSection";
import HangerWidget from "@/components/HangerWidget";
import {
  Dumbbell,
  Users,
  Trophy,
  ShieldCheck,
  Clock,
  Zap,
  MapPin,
  Calendar as CalendarIcon,
  Flame,
  Apple,
  Droplets,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  X,
  Activity,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

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
      <GoalSelector />
      <Hero />
      <Stats />

      {/* Dynamic Hanger Section with Clock, Routine & Diet */}
      <HangerWidget />

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden bg-[#080808]">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4">Our Core Values</h2>
            <h2 className="section-title">
              WHY TRAIN AT <span className="ft-gradient-text">THE TEMPLE?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="glass group p-12 rounded-[3.5rem] hover:border-primary/40 transition-all duration-500 hover:-translate-y-3">
                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-primary transition-all duration-500 shadow-[0_0_0_0_rgba(255,215,0,0)] group-hover:shadow-[0_0_40px_rgba(255,215,0,0.3)]">
                  <feature.icon className="text-primary group-hover:text-black transition-colors" size={36} />
                </div>
                <h3 className="text-3xl font-black uppercase italic mb-6 tracking-tighter">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium text-lg">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MembershipPreview />

      <WorkoutBuilder />

      <EquipmentSection />

      {/* 3D Tour Section */}
      <section className="py-32 relative overflow-hidden bg-[#080808]">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -z-10" />
        <div className="container px-4">
          <div className="text-center mb-20">
            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4">Interactive Experience</h2>
            <h2 className="section-title">
              3D <span className="ft-gradient-text">GYM TOUR</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto rounded-[3.5rem] overflow-hidden border border-white/10 glass p-4 shadow-2xl relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[3.5rem]" />
            <div className="sketchfab-embed-wrapper aspect-video w-full rounded-[2.5rem] overflow-hidden bg-black/50">
              <iframe
                title="Gym Equipments"
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src="https://sketchfab.com/models/14a4a06784d9429085b19135af75db25/embed"
              ></iframe>
            </div>
            <p className="text-[13px] font-normal my-2 text-center text-gray-400">
              <a
                href="https://sketchfab.com/3d-models/gym-equipments-14a4a06784d9429085b19135af75db25"
                target="_blank"
                rel="nofollow noreferrer"
                className="font-bold text-[#1CAAD9] hover:underline"
              >
                Gym Equipments
              </a>{" "}
              by{" "}
              <a
                href="https://sketchfab.com/elvair"
                target="_blank"
                rel="nofollow noreferrer"
                className="font-bold text-[#1CAAD9] hover:underline"
              >
                Elvair Lima
              </a>{" "}
              on{" "}
              <a
                href="https://sketchfab.com/"
                target="_blank"
                rel="nofollow noreferrer"
                className="font-bold text-[#1CAAD9] hover:underline"
              >
                Sketchfab
              </a>
            </p>
          </div>
          <div className="mt-8 text-center text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">
            Explore Our Elite Equipment In Immersive 3D Space
          </div>
        </div>
      </section>

      <TrainersPreview />

      {/* Location Section */}
      <section className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6">Find Us</h2>
              <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-10 leading-[0.85]">
                VISIT THE <br/><span className="ft-gradient-text">SANCTUARY</span>
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6 glass p-8 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all">
                  <div className="bg-primary/10 p-5 rounded-2xl mt-1 shadow-inner">
                    <MapPin className="text-primary" size={28} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tight mb-2">Location</h4>
                    <p className="text-gray-400 text-lg font-medium">Fitness Temple Gym, Nashik</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 glass p-8 rounded-[2.5rem] border-white/5 hover:border-primary/20 transition-all">
                  <div className="bg-primary/10 p-5 rounded-2xl mt-1 shadow-inner">
                    <Clock className="text-primary" size={28} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tight mb-2">Hours</h4>
                    <p className="text-gray-400 text-lg font-medium">Daily: Opens at 4:30 PM (Evening Session)</p>
                  </div>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/place/Fitness+Temple/@19.9743064,73.8407527,20z"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-14 px-16 py-6 inline-block text-center shadow-[0_0_30px_rgba(255,215,0,0.2)]"
              >
                Get Directions
              </a>
            </div>
            <div className="h-[550px] rounded-[4rem] overflow-hidden border-[12px] border-white/5 shadow-2xl relative group">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.61376816654!2d73.8407527!3d19.9743064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddebddfc419adb%3A0xaa642814b39b7de3!2sFitness%20Temple!5e0!3m2!1sen!2sin!4v1716900000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale group-hover:grayscale-0 transition-all duration-1000"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <BMICalculator />
      <ReviewsSection />
      <TrialBooking />
      <GalleryPreview />
      <ContactSection />
    </>
  );
}
