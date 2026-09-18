"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, X, Info, ChevronRight, Plus, Zap, Target, Clock, Flame, Weight, ChevronDown } from "lucide-react";
import { equipmentData } from "@/lib/gymData";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Three.js Particle Canvas
const ThreeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 30;

    // Golden particles
    const geometry = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
      velocities[i] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xFFD700,
      size: 0.12,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Wireframe torus for depth
    const torusGeo = new THREE.TorusGeometry(15, 0.08, 8, 80);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true, transparent: true, opacity: 0.04 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    const torusGeo2 = new THREE.TorusGeometry(22, 0.06, 6, 60);
    const torusMat2 = new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true, transparent: true, opacity: 0.025 });
    const torus2 = new THREE.Mesh(torusGeo2, torusMat2);
    torus2.rotation.x = Math.PI / 3;
    scene.add(torus2);

    let mouseX = 0, mouseY = 0;
    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.3;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener("mousemove", handleMouse);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      particles.rotation.y = t * 0.04 + mouseX;
      particles.rotation.x = t * 0.02 + mouseY;
      torus.rotation.y = t * 0.06;
      torus.rotation.z = t * 0.03;
      torus2.rotation.x = t * 0.04;
      torus2.rotation.z = t * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

// Difficulty badge colors
const difficultyConfig: Record<string, { color: string; dot: string }> = {
  "Beginner": { color: "text-green-400 bg-green-400/10 border-green-400/20", dot: "bg-green-400" },
  "Intermediate": { color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", dot: "bg-yellow-400" },
  "Advanced": { color: "text-red-400 bg-red-400/10 border-red-400/20", dot: "bg-red-400" },
  "All Levels": { color: "text-blue-400 bg-blue-400/10 border-blue-400/20", dot: "bg-blue-400" },
};

const categoryIcons: Record<string, string> = {
  "All": "⚡",
  "Strength": "💪",
  "Cardio": "🏃",
  "Functional": "🎯",
  "Free Weights": "🏋️",
};

const EquipmentSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-100px" });

  const categories = ["All", "Strength", "Cardio", "Functional", "Free Weights"];

  const filteredEquipment = equipmentData.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // GSAP scroll animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        ".equipment-title-word",
        { y: 100, opacity: 0, rotationX: -60 },
        {
          y: 0, opacity: 1, rotationX: 0,
          stagger: 0.12,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // GSAP card entrance
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".eq-card",
        { y: 60, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [filteredEquipment]);

  const addToWorkout = (item: any) => {
    const saved = localStorage.getItem("fitnessTempleWorkouts") || "[]";
    const workouts = JSON.parse(saved);
    const currentWorkout = workouts.find((w: any) => w.name === "My Favorites") || {
      name: "My Favorites",
      exercises: [],
      date: new Date().toLocaleDateString(),
      id: "favorites"
    };
    if (!currentWorkout.exercises.find((ex: any) => ex.id === item.id)) {
      currentWorkout.exercises.push({ id: item.id, name: item.name, sets: item.sets, reps: item.reps, image: item.image });
      const index = workouts.findIndex((w: any) => w.id === "favorites");
      if (index > -1) workouts[index] = currentWorkout;
      else workouts.push(currentWorkout);
      localStorage.setItem("fitnessTempleWorkouts", JSON.stringify(workouts));
      const currentXP = parseInt(localStorage.getItem("fitnessTempleXP") || "0");
      localStorage.setItem("fitnessTempleXP", (currentXP + 10).toString());
      // Animate button feedback
      gsap.to(`#add-btn-${item.id}`, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 });
      alert(`${item.name} added to My Favorites! +10 XP 🏆`);
    } else {
      alert("Already in your favorites!");
    }
  };

  return (
    <section ref={sectionRef} className="py-32 bg-[#080808] relative overflow-hidden" id="equipment">
      {/* Three.js particle bg */}
      <ThreeBackground />

      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-primary/4 blur-[150px] rounded-full pointer-events-none" />

      <div className="container px-4 relative z-20">
        {/* ── Title ── */}
        <div ref={titleRef} className="text-center mb-20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-6 py-2.5 mb-8"
          >
            <Zap size={12} className="text-primary" />
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">The Arsenal</span>
          </motion.div>

          <div className="overflow-hidden">
            <h2 className="text-5xl md:text-8xl font-black text-center uppercase italic tracking-tighter leading-[0.85] mb-6">
              <span className="equipment-title-word inline-block">ELITE&nbsp;</span>
              <span className="equipment-title-word inline-block ft-gradient-text">EQUIPMENT</span>
            </h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={titleInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-gray-400 max-w-2xl mx-auto font-medium text-lg leading-relaxed"
          >
            Professional-grade machinery designed for maximum performance, safety, and results.
          </motion.p>
        </div>

        {/* ── Search & Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row gap-5 mb-16 items-center justify-between glass p-5 rounded-[2.5rem] border-white/5"
        >
          <div className="relative w-full md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search equipment or muscle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 focus:border-primary outline-none transition-all font-bold text-sm text-white placeholder:text-gray-600"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? "bg-primary text-black shadow-[0_8px_25px_rgba(255,215,0,0.4)]"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                <span>{categoryIcons[cat]}</span>
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest whitespace-nowrap">
            {filteredEquipment.length} machines
          </div>
        </motion.div>

        {/* ── Equipment Grid ── */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEquipment.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.3 }}
                className="eq-card"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className="glass rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500 cursor-pointer group h-full flex flex-col"
                  style={{
                    boxShadow: hoveredId === item.id
                      ? "0 30px 60px -20px rgba(255, 215, 0, 0.15), 0 0 0 1px rgba(255, 215, 0, 0.15)"
                      : "none",
                    transform: hoveredId === item.id ? "translateY(-8px)" : "translateY(0px)",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ filter: hoveredId === item.id ? "grayscale(0)" : "grayscale(40%)", transition: "filter 0.5s" }}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/70 backdrop-blur-md text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/30 flex items-center gap-1">
                        <span>{categoryIcons[item.category] || "⚡"}</span>
                        {item.category}
                      </span>
                    </div>

                    {/* Difficulty badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border backdrop-blur-md flex items-center gap-1.5 ${difficultyConfig[item.difficulty]?.color || "text-gray-400 bg-gray-400/10 border-gray-400/20"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${difficultyConfig[item.difficulty]?.dot || "bg-gray-400"}`} />
                        {item.difficulty}
                      </span>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2">
                        <span className="bg-black/60 backdrop-blur-md text-[9px] text-gray-300 font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                          <Clock size={9} /> {item.rest}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md text-[9px] text-gray-300 font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                          <Flame size={9} /> {item.calories || "~150 cal/30min"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-black uppercase italic tracking-tight group-hover:text-primary transition-colors duration-300 mb-2 leading-tight">
                      {item.name}
                    </h3>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.primaryMuscles.slice(0, 3).map(m => (
                        <span key={m} className="text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                          {m}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-500 text-xs leading-relaxed mb-5 flex-1 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Sets</div>
                          <div className="text-sm font-black text-white">{item.sets}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Reps</div>
                          <div className="text-sm font-black text-white">{item.reps}</div>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300"
                      >
                        <Info size={16} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredEquipment.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass rounded-[3.5rem] border-dashed border-white/10 mt-8"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-black uppercase tracking-widest">No equipment found</p>
          </motion.div>
        )}
      </div>

      {/* ── Equipment Detail Modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 40 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className="relative w-full max-w-5xl bg-[#0A0A0A] rounded-[3.5rem] border border-white/8 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row max-h-[92vh]"
            >
              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-30 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white hover:bg-red-500/80 border border-white/10 transition-all duration-300"
              >
                <X size={20} />
              </motion.button>

              {/* Image Side */}
              <div className="lg:w-[45%] h-[300px] lg:h-auto relative flex-shrink-0">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A] hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent lg:hidden" />

                {/* Floating badges on image */}
                <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border backdrop-blur-md flex items-center gap-1.5 w-fit ${difficultyConfig[selectedItem.difficulty]?.color || "text-gray-400 bg-gray-400/10 border-gray-400/20"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${difficultyConfig[selectedItem.difficulty]?.dot || "bg-gray-400"}`} />
                    {selectedItem.difficulty}
                  </span>
                  <span className="bg-black/70 backdrop-blur-md text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/30 flex items-center gap-1 w-fit">
                    {categoryIcons[selectedItem.category] || "⚡"} {selectedItem.category}
                  </span>
                </div>
              </div>

              {/* Info Side */}
              <div className="lg:w-[55%] p-8 md:p-12 overflow-y-auto flex-1">
                {/* Header */}
                <div className="mb-8">
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] block mb-3">
                    {selectedItem.category} • Fitness Arsenal
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none">
                    {selectedItem.name}
                  </h2>
                  <p className="text-gray-400 leading-relaxed">{selectedItem.description}</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {[
                    { icon: Target, label: "Muscles", value: selectedItem.primaryMuscles.join(", ") },
                    { icon: Zap, label: "Sets", value: selectedItem.sets },
                    { icon: ChevronDown, label: "Reps", value: selectedItem.reps },
                    { icon: Clock, label: "Rest", value: selectedItem.rest },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                      <Icon size={14} className="text-primary mx-auto mb-1.5" />
                      <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</div>
                      <div className="text-white font-black text-xs leading-tight">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Calories & weight */}
                {(selectedItem.calories || selectedItem.weight) && (
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {selectedItem.calories && (
                      <div className="bg-orange-500/5 border border-orange-500/15 p-4 rounded-2xl flex items-center gap-3">
                        <Flame size={18} className="text-orange-400" />
                        <div>
                          <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Calorie Burn</div>
                          <div className="text-white font-black text-xs">{selectedItem.calories}</div>
                        </div>
                      </div>
                    )}
                    {selectedItem.weight && (
                      <div className="bg-blue-500/5 border border-blue-500/15 p-4 rounded-2xl flex items-center gap-3">
                        <Weight size={18} className="text-blue-400" />
                        <div>
                          <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Capacity</div>
                          <div className="text-white font-black text-xs">{selectedItem.weight}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Secondary muscles */}
                {selectedItem.secondaryMuscles?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3">Secondary Muscles</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.secondaryMuscles.map((m: string) => (
                        <span key={m} className="text-[9px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Workout */}
                <motion.button
                  id={`add-btn-${selectedItem.id}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => addToWorkout(selectedItem)}
                  className="w-full py-5 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest mb-8 shadow-[0_20px_40px_-15px_rgba(255,215,0,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(255,215,0,0.5)] transition-all"
                >
                  <Plus size={16} /> Add to My Workout
                </motion.button>

                {/* How to use */}
                <div className="mb-6">
                  <h4 className="text-lg font-black uppercase italic tracking-tight mb-5 flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center">
                      <ChevronRight className="text-primary" size={14} />
                    </div>
                    How to Use
                  </h4>
                  <div className="space-y-3">
                    {selectedItem.instructions.map((step: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex gap-4 group"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all">
                          {i + 1}
                        </span>
                        <span className="text-gray-400 font-medium text-sm group-hover:text-gray-200 transition-colors leading-relaxed">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes */}
                <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10">
                  <h4 className="text-red-400 text-[10px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    Common Mistakes to Avoid
                  </h4>
                  <div className="space-y-2">
                    {selectedItem.mistakes.map((m: string, i: number) => (
                      <div key={i} className="text-gray-500 text-sm font-medium flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-red-500/40 rounded-full mt-1.5 flex-shrink-0" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Tips */}
                {selectedItem.safetyTips?.length > 0 && (
                  <div className="mt-4 p-6 bg-green-500/5 rounded-2xl border border-green-500/10">
                    <h4 className="text-green-400 text-[10px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      Safety Tips
                    </h4>
                    <div className="space-y-2">
                      {selectedItem.safetyTips.map((tip: string, i: number) => (
                        <div key={i} className="text-gray-500 text-sm font-medium flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-green-500/40 rounded-full mt-1.5 flex-shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EquipmentSection;
