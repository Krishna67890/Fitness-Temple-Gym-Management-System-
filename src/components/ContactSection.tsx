"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, X } from "lucide-react";

const ContactSection = () => {
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "Membership Inquiry",
    message: ""
  });

  const handleWhatsAppChoice = (target: 'dev' | 'owner') => {
    const phone = target === 'dev' ? '8080690631' : '9665231230';
    const text = `Contact Inquiry from ${formData.name}:
- Phone: ${formData.phone}
- Subject: ${formData.subject}
- Message: ${formData.message}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/91${phone}?text=${encoded}`, '_blank');
    setWhatsappModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWhatsappModalOpen(true);
  };

  return (
    <section className="py-24 bg-secondary/10">
      <div className="container">
        <h2 className="section-title">Get In <span className="text-primary gold-gradient-text">Touch</span></h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-4xl font-black uppercase italic mb-6 leading-none">Visit Our <span className="text-primary gold-gradient-text">Arena</span></h3>
              <p className="text-gray-400 mb-8 max-w-md text-lg leading-relaxed">
                Ready to start your transformation? Drop by for a free tour or message us with any questions about our memberships and services.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: <MapPin className="text-primary" size={24} />, title: "Location", detail: "Fitness Temple Gym, Nashik" },
                { icon: <Phone className="text-primary" size={24} />, title: "Call Us", detail: "+91 96652 31230" },
                { icon: <Mail className="text-primary" size={24} />, title: "Plus Code", detail: "XRFR+P8 Nashik, Maharashtra" },
                { icon: <Clock className="text-primary" size={24} />, title: "Working Hours", detail: "Daily: 5:00 AM - 10:00 AM & 4:30 PM - 10:00 PM" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-5 group">
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/10 group-hover:border-primary/30 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1 uppercase tracking-tighter italic">{item.title}</h4>
                    <p className="text-gray-400 text-base leading-snug">{item.detail}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  setFormData({ name: "Direct Interest", phone: "", subject: "WhatsApp Inquiry", message: "Hello! I want to join Fitness Temple Gym." });
                  setWhatsappModalOpen(true);
                }}
                className="btn-secondary w-full py-4 text-lg flex items-center justify-center space-x-3 mt-4"
              >
                <span className="uppercase tracking-widest font-black">Send a Message</span>
                <Send size={20} />
              </button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-12 rounded-[3.5rem] border-white/5 shadow-3xl"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase mb-3 tracking-[0.2em] text-gray-500">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all focus:bg-white/[0.07]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-3 tracking-[0.2em] text-gray-500">Phone Number</label>
                  <input
                    required
                    type="tel"
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit phone number"
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all focus:bg-white/[0.07]"
                    placeholder="10 Digit Number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-3 tracking-[0.2em] text-gray-500">Subject</label>
                <div className="relative">
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none appearance-none transition-all focus:bg-white/[0.07]"
                  >
                    <option value="Membership Inquiry" className="bg-background">Membership Inquiry</option>
                    <option value="Personal Training" className="bg-background">Personal Training</option>
                    <option value="General Feedback" className="bg-background">General Feedback</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-3 tracking-[0.2em] text-gray-500">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all focus:bg-white/[0.07] resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-3">
                <span className="uppercase tracking-widest font-black">Send To Temple</span>
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* WhatsApp Choice Modal */}
        <AnimatePresence>
          {whatsappModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg glass p-8 md:p-12 rounded-[3rem] border-white/10 text-center"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Mail className="text-primary" size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-4">Send to Temple</h3>
                <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8">
                  Do you want to send this message to <span className="text-white">Developer 8080690631</span> or else <span className="text-white">Owner 96652 31230</span>?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleWhatsAppChoice('dev')}
                    className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white"
                  >
                    Developer
                  </button>
                  <button
                    onClick={() => handleWhatsAppChoice('owner')}
                    className="btn-primary py-4 text-[10px]"
                  >
                    Owner
                  </button>
                </div>

                <button
                  onClick={() => setWhatsappModalOpen(false)}
                  className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Map */}
        <div className="mt-24 h-[500px] w-full rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.61376816654!2d73.8407527!3d19.9743064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddebddfc419adb%3A0xaa642814b39b7de3!2sFitness%20Temple!5e0!3m2!1sen!2sin!4v1716900000000!5m2!1sen!2sin&q=Fitness+Temple+Gym+Jail+Road"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
