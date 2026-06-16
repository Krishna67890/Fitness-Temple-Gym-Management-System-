"use client";
import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, ShieldCheck, Trophy, Instagram, Twitter, Linkedin, MessageCircle } from "lucide-react";

const trainerList = [
  {
    name: "Suraj",
    role: "Head Fitness Trainer",
    specialization: "Bodybuilding & Lifestyle Transformation",
    experience: "8+ Years",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1974&auto=format&fit=crop",
    bio: "Suraj is a world-class bodybuilding specialist dedicated to helping members achieve their dream physique with scientific training and nutrition methods.",
    certifications: ["ACE Certified", "Nutrition Specialist", "Gold's Gym Elite Trainer"]
  },
  {
    name: "Sanket",
    role: "Strength & Conditioning Coach",
    specialization: "Powerlifting & Athletic Performance",
    experience: "6+ Years",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    bio: "Sanket specializes in explosive power and strength development, ensuring members build functional muscle and peak athletic performance.",
    certifications: ["Certified Strength Coach", "First Aid Certified", "Sports Science Diploma"]
  }
];

const TrainersPage = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-black uppercase tracking-[0.4em] text-sm mb-6"
          >
            The Elite Squad
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none"
          >
            MEET THE <span className="ft-gradient-text">GURUS</span>
          </motion.h1>
          <p className="mt-8 text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Learn from the best. Our trainers are certified professionals committed to your success.
          </p>
        </div>

        {/* Detailed Profiles */}
        <div className="space-y-32">
          {trainerList.map((trainer, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
              {/* Image Card */}
              <div className="w-full lg:w-1/2 group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative h-[650px] rounded-[4rem] overflow-hidden border-8 border-white/5"
                >
                  <img src={trainer.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={trainer.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                  {/* Socials Floating */}
                  <div className="absolute bottom-10 left-10 flex gap-4">
                    {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                       <button key={i} className="w-14 h-14 bg-black/50 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 hover:bg-primary hover:border-primary transition-all text-white">
                          <Icon size={24} />
                       </button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Text Info */}
              <div className="w-full lg:w-1/2 space-y-10">
                <div>
                   <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block border border-primary/20">
                     {trainer.role}
                   </span>
                   <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">{trainer.name}</h2>
                   <p className="text-primary font-bold text-xl uppercase italic tracking-widest">{trainer.specialization}</p>
                </div>

                <p className="text-gray-400 text-xl leading-relaxed font-medium italic">
                  "{trainer.bio}"
                </p>

                <div className="grid grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-3xl">
                     <Trophy className="text-primary mb-4" size={32} />
                     <h4 className="font-black uppercase italic tracking-tight mb-1">Experience</h4>
                     <p className="text-gray-500 font-bold">{trainer.experience} in Elite Fitness</p>
                  </div>
                  <div className="glass p-8 rounded-3xl">
                     <ShieldCheck className="text-primary mb-4" size={32} />
                     <h4 className="font-black uppercase italic tracking-tight mb-1">Status</h4>
                     <p className="text-gray-500 font-bold">Verified Professional</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Expertise & Certs</h4>
                   <div className="flex flex-wrap gap-3">
                      {trainer.certifications.map((cert, i) => (
                        <span key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-gray-300">
                          {cert}
                        </span>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-6">
                   <button className="btn-primary flex items-center justify-center gap-3">
                      <MessageCircle size={20} />
                      Book 1-on-1 Session
                   </button>
                   <button className="btn-outline">View Transformation</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainersPage;
