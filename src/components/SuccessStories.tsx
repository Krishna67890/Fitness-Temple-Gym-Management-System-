"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { subscribeToPublishedReviews, GymReview } from "@/lib/reviewsService";
import Link from "next/link";

const SuccessStories = () => {
  const [reviews, setReviews] = useState<GymReview[]>([]);

  useEffect(() => {
    const unsub = subscribeToPublishedReviews((realReviews) => {
      setReviews(realReviews.slice(0, 3));
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-24 bg-secondary/10">
      <div className="container px-4">
        <h2 className="section-title text-center mb-12">
          Member <span className="text-primary gold-gradient-text">Voices</span>
        </h2>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {reviews.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-10 rounded-[2.5rem] relative hover:border-primary/20 transition-all duration-500 group"
              >
                <Quote className="absolute top-10 right-10 text-primary/10 w-16 h-16 group-hover:text-primary/20 transition-colors" />
                <div className="flex items-center space-x-5 mb-8">
                  <div className="relative">
                    {item.userPhotoURL ? (
                      <img
                        src={item.userPhotoURL}
                        alt={item.userName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/50 p-1"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center font-black text-primary text-xl">
                        {item.userName[0]}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-primary text-black p-1 rounded-full flex">
                      <Star className="w-3 h-3 fill-black" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-white">{item.userName}</h4>
                    <p className="text-xs text-primary/60 uppercase tracking-[0.2em] font-bold">
                      Verified Member
                    </p>
                  </div>
                </div>
                <div className="flex mb-4 space-x-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-gray-400 italic leading-relaxed text-base">"{item.comment}"</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-[2.5rem] max-w-xl mx-auto border-white/10 p-8">
            <p className="text-gray-400 text-sm font-medium mb-4">
              Be the first member to share your Fitness Temple experience.
            </p>
            <Link href="/#reviews" className="btn-primary text-xs uppercase tracking-widest px-6 py-3">
              Write a Review
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SuccessStories;
