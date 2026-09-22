"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ZoomIn } from "lucide-react";
import Link from "next/link";

const previewItems = [
  { type: "image", src: "/assets/Fitnesstemple1.jpg", title: "Elite Workout Zone", category: "Gym Interior" },
  { type: "image", src: "/assets/Fitnesstemple2.jpg", title: "Strength Area", category: "Gym Interior" },
  { type: "image", src: "/assets/Poonam-ghode.jpg", title: "Member Transformation", category: "Transformation" },
  { type: "image", src: "/assets/sanket.jpg", title: "Coach Sanket Conditioning", category: "Transformation" },
  { type: "video", src: "/assets/Fitness-Temple.mp4", title: "Video Walkthrough", category: "Videos" },
  { type: "image", src: "/assets/FitnessTempleCertificate.png", title: "Official Certification", category: "Equipment" },
];

const GalleryPreview = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 leading-none italic tracking-tighter">
              Our <span className="text-primary gold-gradient-text">Gallery</span>
            </h2>
            <p className="text-gray-400 max-w-xl text-base md:text-lg">
              Take a look at our state-of-the-art facilities, elite transformations, and walkthrough walkthroughs.
            </p>
          </div>
          <Link href="/gallery" className="btn-outline w-full md:w-auto px-8 py-4 flex items-center justify-center text-center uppercase tracking-widest text-sm font-bold">
            View All Media
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="relative aspect-square overflow-hidden rounded-[2rem] group cursor-pointer border border-white/5 bg-black/40"
              onClick={() => setSelectedItem(item)}
            >
              {item.type === "video" ? (
                <div className="w-full h-full relative">
                  <video
                    src={item.src}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                    onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                  />
                  <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full backdrop-blur-md border border-white/10 text-primary">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end p-6 text-center">
                <div className="flex flex-col items-center">
                  {item.type === "video" ? (
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                      <Play className="text-black fill-current w-5 h-5 ml-0.5" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                      <ZoomIn className="text-black w-5 h-5" />
                    </div>
                  )}
                  <h3 className="text-xl font-black uppercase italic text-white mb-0.5">{item.title}</h3>
                  <p className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">{item.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors p-2 glass rounded-full z-[110]"
              onClick={() => setSelectedItem(null)}
            >
              <X size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === "video" ? (
                <video
                  src={selectedItem.src}
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[70vh] rounded-3xl shadow-2xl bg-black border border-white/10"
                />
              ) : (
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-3xl shadow-2xl"
                />
              )}
              <div className="mt-6 text-center">
                <h3 className="text-2xl md:text-3xl font-black uppercase italic text-white">{selectedItem.title}</h3>
                <p className="text-primary font-bold uppercase tracking-widest mt-1 text-sm">{selectedItem.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryPreview;
