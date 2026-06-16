"use client";
import React from "react";
import { motion } from "framer-motion";
import { Quote, Award, Briefcase, Phone, Mail, Instagram } from "lucide-react";

const OwnerPage = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start">
          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border-2 border-primary/20 shadow-2xl relative z-10">
              <img
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
                alt="Krishna Patil Rajput"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative background blocks */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px] -z-0" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0" />

            {/* Stats Overlay */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 glass px-8 py-6 rounded-3xl flex space-x-8 z-20 shadow-xl border-primary/20">
              <div className="text-center">
                <p className="text-primary font-black text-2xl">10+</p>
                <p className="text-[10px] uppercase font-bold text-gray-400">Years Exp.</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-primary font-black text-2xl">5k+</p>
                <p className="text-[10px] uppercase font-bold text-gray-400">Trained</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <p className="text-primary font-black text-2xl">3</p>
                <p className="text-[10px] uppercase font-bold text-gray-400">Centers</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 pt-10 lg:pt-0"
          >
            <h2 className="text-primary font-bold uppercase tracking-[0.3em] mb-4">Founder & Gym Owner</h2>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic mb-8">
              Krishna Patil <span className="text-primary">Rajput</span>
            </h1>

            <div className="relative mb-10">
              <Quote className="text-primary/20 absolute -top-4 -left-6 w-12 h-12" />
              <p className="text-xl md:text-2xl text-gray-300 italic leading-relaxed pl-6 border-l-4 border-primary/50">
                "My vision is to create a fitness revolution in Nashik. Rajarajeshwari Fitness Arena is not just a gym; it's a platform for people to rediscover their strength and transform their lives."
              </p>
            </div>

            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Briefcase className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm mb-1">Professional Background</h4>
                  <p className="text-gray-400">
                    A fitness entrepreneur with over a decade of experience in sports management and physical conditioning. Krishna has mentored hundreds of athletes and fitness enthusiasts.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Award className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm mb-1">Key Achievements</h4>
                  <ul className="text-gray-400 list-disc pl-5 space-y-1">
                    <li>Certified Master Trainer - International Fitness Association</li>
                    <li>Entrepreneur of the Year (Fitness Category) - 2022</li>
                    <li>State-level Powerlifting Medalist</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="btn-primary flex items-center space-x-2">
                <Phone size={18} />
                <span>Contact Krishna</span>
              </button>
              <div className="flex items-center space-x-3 ml-4">
                <a href="#" className="p-3 glass rounded-full hover:bg-primary hover:text-black transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-3 glass rounded-full hover:bg-primary hover:text-black transition-all">
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="container mx-auto px-6 mt-32">
        <div className="glass rounded-[4rem] p-12 md:p-20 relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] -z-10" />
          <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-8">Vision for <span className="text-primary">Fitness Temple</span></h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
            "We aim to bring world-class fitness standards to our community. Our focus is on providing an inclusive environment where everyone—from beginners to pro athletes—feels empowered. We are continuously investing in the latest equipment and training methodologies to ensure our members get nothing but the best."
          </p>
        </div>
      </section>
    </div>
  );
};

export default OwnerPage;
