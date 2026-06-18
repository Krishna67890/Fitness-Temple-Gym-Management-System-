"use client";
import React from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

const trainers = [
  {
    name: "Suraj",
    role: "Certified Fitness Trainer",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1974&auto=format&fit=crop",
    specialty: "Bodybuilding & Weight Loss"
  },
  {
    name: "Sanket",
    role: "Strength & Conditioning Coach",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    specialty: "Functional Training & Powerlifting"
  }
];

const TrainersPreview = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-[#0F0F0F]">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <h2 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4 text-center md:text-left">The Gurus</h2>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-center md:text-left">
              MEET OUR <span className="ft-gradient-text">TRAINERS</span>
            </h2>
          </div>
          <Link href="/trainers" className="btn-outline mt-10 md:mt-0">View All Coaches</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {trainers.map((trainer, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group relative h-[600px] rounded-[4rem] overflow-hidden border border-white/10"
            >
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-12">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{trainer.name}</h3>
                    <p className="text-primary font-bold uppercase tracking-widest text-xs mb-4">{trainer.role}</p>
                    <p className="text-gray-400 font-medium max-w-xs">{trainer.specialty}</p>
                  </div>

                  <div className="flex flex-col gap-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                    {[Instagram, Twitter].map((Icon, i) => (
                      <button key={i} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                        <Icon size={20} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Line */}
              <div className="absolute top-0 right-12 w-[1px] h-32 bg-gradient-to-b from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersPreview;
