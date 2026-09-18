"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, Check, Rocket, X } from "lucide-react";

const TrialBooking = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    goal: "Build Muscle",
    time: "4:30 PM"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    const bookings = JSON.parse(localStorage.getItem("fitnessTempleBookings") || "[]");
    bookings.push({ ...formData, date: new Date().toLocaleDateString(), id: Date.now() });
    localStorage.setItem("fitnessTempleBookings", JSON.stringify(bookings));
  };

  return (
    <>
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
          <div className="text-[20rem] font-black italic tracking-tighter leading-none -ml-20">TRANSFORM</div>
        </div>

        <div className="container relative z-10 text-center">
          <h2 className="text-black font-black text-5xl md:text-7xl uppercase italic tracking-tighter mb-8 leading-tight">
            Ready to Build <br/>Your Temple?
          </h2>
          <p className="text-black/70 text-lg font-bold uppercase tracking-widest mb-12 max-w-2xl mx-auto">
            Experience the most elite training atmosphere in Nashik with a complimentary trial session.
          </p>
          <button
            onClick={() => { setIsOpen(true); setStep(1); }}
            className="px-16 py-6 bg-black text-primary font-black rounded-full hover:scale-110 transition-all text-xl shadow-2xl"
          >
            BOOK YOUR FREE TRIAL
          </button>
        </div>
      </section>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="relative w-full max-w-xl glass p-12 rounded-[4rem] border-primary/20"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {step === 1 && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8">
                    <Rocket size={40} />
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Start Your Journey</h3>
                  <p className="text-gray-500 uppercase font-bold tracking-widest text-xs mb-10">Step 1: Choose your mission</p>

                  <div className="grid grid-cols-1 gap-4 mb-10">
                    {["Build Muscle", "Lose Weight", "Increase Strength", "General Fitness"].map(g => (
                      <button
                        key={g}
                        onClick={() => { setFormData({...formData, goal: g}); setStep(2); }}
                        className="w-full py-5 px-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary text-white font-bold transition-all flex justify-between items-center group"
                      >
                        {g}
                        <Check size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8">Personal Details</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        <input
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="Your Name"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white focus:border-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          placeholder="Your Mobile Number"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white focus:border-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Preferred Time (Daily 4:30 PM - 10:00 PM)</label>
                      <div className="relative">
                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        <select
                          value={formData.time}
                          onChange={e => setFormData({...formData, time: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white focus:border-primary outline-none appearance-none"
                        >
                          <option className="bg-black">4:30 PM</option>
                          <option className="bg-black">5:30 PM</option>
                          <option className="bg-black">6:30 PM</option>
                          <option className="bg-black">7:30 PM</option>
                          <option className="bg-black">8:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-6 bg-primary text-black font-black rounded-2xl hover:scale-[1.02] transition-all uppercase tracking-[0.2em] shadow-[0_20px_40px_-15px_rgba(255,215,0,0.3)]"
                    >
                      SECURE MY TRIAL
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full text-center text-gray-600 text-[10px] font-black uppercase tracking-widest hover:text-gray-400 transition-colors"
                    >
                      Back to Goals
                    </button>
                  </form>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8"
                  >
                    <Check size={48} />
                  </motion.div>
                  <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">Trial Confirmed!</h3>
                  <p className="text-gray-400 leading-relaxed max-w-xs mx-auto mb-12">
                    Welcome to the community, <span className="text-white font-bold">{formData.name}</span>. Our team will contact you shortly to confirm your {formData.time} session.
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-12 py-5 border-2 border-primary text-primary font-black rounded-2xl hover:bg-primary hover:text-black transition-all uppercase tracking-widest"
                  >
                    Close & Explore
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TrialBooking;
