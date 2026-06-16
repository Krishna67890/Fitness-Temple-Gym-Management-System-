"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Vikram Singh",
    role: "Member for 2 Years",
    content: "Rajarajeshwari Fitness Arena completely changed my perspective on fitness. The trainers are highly professional and the atmosphere is electric!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop"
  },
  {
    name: "Priya Sharma",
    role: "Member for 1 Year",
    content: "The best gym in Nashik! Clean facilities, modern equipment, and a very supportive community. I lost 15kg in just 6 months.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
  },
  {
    name: "Arjun Deshmukh",
    role: "Member for 3 Years",
    content: "Professionalism at its best. Krishna sir's vision for this fitness arena is truly inspiring. Highly recommended for serious fitness enthusiasts.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
  }
];

const SuccessStories = () => {
  return (
    <section className="py-24 bg-secondary/10">
      <div className="container">
        <h2 className="section-title">Success <span className="text-primary gold-gradient-text">Stories</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-10 rounded-[2.5rem] relative hover:border-primary/20 transition-all duration-500 group"
            >
              <Quote className="absolute top-10 right-10 text-primary/10 w-16 h-16 group-hover:text-primary/20 transition-colors" />
              <div className="flex items-center space-x-5 mb-8">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary/50 p-1"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-primary text-black p-1.5 rounded-full">
                    <Star className="w-3 h-3 fill-black" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-xl">{item.name}</h4>
                  <p className="text-xs text-primary/60 uppercase tracking-[0.2em] font-bold">{item.role}</p>
                </div>
              </div>
              <div className="flex mb-6 space-x-1">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-gray-400 italic leading-relaxed text-lg">"{item.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
