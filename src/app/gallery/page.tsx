"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ZoomIn } from "lucide-react";

const categories = ["All", "Gym Interior", "Equipment", "Transformation", "Videos"];

const galleryItems = [
  { id: 1, category: "Gym Interior", type: "image", src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", title: "Main Workout Floor" },
  { id: 2, category: "Equipment", type: "image", src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop", title: "Premium Cardio Zone" },
  { id: 3, category: "Transformation", type: "image", src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop", title: "Member Success" },
  { id: 4, category: "Gym Interior", type: "image", src: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop", title: "Strength Area" },
  { id: 5, category: "Equipment", type: "image", src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop", title: "Weight Training" },
  { id: 6, category: "Videos", type: "video", src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", title: "Gym Tour" },
  { id: 7, category: "Transformation", type: "image", src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1887&auto=format&fit=crop", title: "Client Result" },
  { id: 8, category: "Gym Interior", type: "image", src: "https://images.unsplash.com/photo-1590239068532-626f63434682?q=80&w=2070&auto=format&fit=crop", title: "Reception" },
  { id: 9, category: "Equipment", type: "image", src: "https://images.unsplash.com/photo-1558017487-06bf9f82613a?q=80&w=1970&auto=format&fit=crop", title: "Cable Machines" },
  { id: 10, category: "Gym Interior", type: "image", src: "https://images.unsplash.com/photo-1571902258288-6aee36259ad1?q=80&w=1974&auto=format&fit=crop", title: "Functional Zone" },
  { id: 11, category: "Equipment", type: "image", src: "https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop", title: "Leg Press Hub" },
  { id: 12, category: "Transformation", type: "image", src: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=2070&auto=format&fit=crop", title: "Fat to Fit" },
  { id: 13, category: "Gym Interior", type: "image", src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop", title: "Upper Level View" },
  { id: 14, category: "Equipment", type: "image", src: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop", title: "Dumbbell Rack" },
  { id: 15, category: "Transformation", type: "image", src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop", title: "Body Recomp" },
  { id: 16, category: "Gym Interior", type: "image", src: "/assets/FitnessTempleCertificate.jpg", title: "Official Certification" },
  { id: 17, category: "Equipment", type: "image", src: "/assets/FitnessTempleRate.jpg", title: "Membership Rates" },
];

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredItems = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <section className="container mx-auto px-6 mb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black uppercase italic mb-6 gold-gradient-text"
        >
          Visual Journey
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Explore our state-of-the-art facility, high-end equipment,
          and the incredible transformations of our members.
        </p>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-6 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-500 ${
                activeCategory === cat
                  ? "bg-primary text-black shadow-[0_0_30px_rgba(255,215,0,0.4)] scale-105"
                  : "glass text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-end p-8 text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    {item.type === "video" ? (
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                        <Play className="text-black fill-current w-6 h-6 ml-1" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                        <ZoomIn className="text-black w-6 h-6" />
                      </div>
                    )}
                    <h3 className="text-2xl font-black uppercase italic text-white mb-1">{item.title}</h3>
                    <p className="text-primary font-bold text-xs uppercase tracking-[0.3em]">{item.category}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedItem(null)}
          >
            <button
              className="absolute top-10 right-10 text-white hover:text-primary transition-colors p-2 glass rounded-full"
              onClick={() => setSelectedItem(null)}
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.src}
                alt={selectedItem.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-3xl shadow-2xl"
              />
              <div className="mt-8 text-center">
                <h3 className="text-3xl font-black uppercase italic text-white">{selectedItem.title}</h3>
                <p className="text-primary font-bold uppercase tracking-widest mt-2">{selectedItem.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
