"use client";
import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="pt-32 pb-20">
      <section className="container mx-auto px-6 mb-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-primary font-black uppercase tracking-[0.4em] text-sm mb-6"
        >
          Get In Touch
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-8xl font-black uppercase italic mb-6 ft-gradient-text tracking-tighter"
        >
          CONTACT THE <br/>TEMPLE
        </motion.h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">
          Have a question about our memberships, trainers, or facilities?
          Our team (Omkar, Siddhant, Suraj & Sanket) is here to help you start your transformation.
        </p>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="glass p-10 rounded-[3rem] text-center group hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-[0_0_0_0_rgba(255,0,0,0)] group-hover:shadow-[0_0_30px_rgba(255,0,0,0.3)]">
              <Phone size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-3">Call Us</h3>
            <p className="text-gray-400 text-sm mb-6">Direct support from the Arena</p>
            <div className="space-y-1">
              <p className="text-white font-black text-xl tracking-tight">+91 98XXX XXXXX</p>
              <p className="text-white font-black text-xl tracking-tight">+91 88XXX XXXXX</p>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] text-center group hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-[0_0_0_0_rgba(255,0,0,0)] group-hover:shadow-[0_0_30px_rgba(255,0,0,0.3)]">
              <Mail size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-3">Email Us</h3>
            <p className="text-gray-400 text-sm mb-6">Send us your detailed goals</p>
            <div className="space-y-1">
              <p className="text-white font-black text-lg tracking-tight">info@fitnesstemple.com</p>
              <p className="text-white font-black text-lg tracking-tight">support@fitnesstemple.fit</p>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] text-center group hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-[0_0_0_0_rgba(255,0,0,0)] group-hover:shadow-[0_0_30px_rgba(255,0,0,0.3)]">
              <MapPin size={32} />
            </div>
            <h3 className="text-2xl font-black uppercase italic mb-3">Visit Us</h3>
            <p className="text-gray-400 text-sm mb-6">Nashik's Elite Fitness Hub</p>
            <div className="space-y-1">
              <p className="text-white font-black text-lg tracking-tight">Fitness Temple Gym</p>
              <p className="text-white font-black text-lg tracking-tight">Nashik, Maharashtra</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 md:p-16 rounded-[4rem]"
          >
            <h2 className="text-4xl font-black uppercase italic mb-10">Send a <span className="ft-gradient-text">Message</span></h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Full Name</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-primary focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-600" placeholder="Your Name" />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Phone Number</label>
                  <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-primary focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-600" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Email Address</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-primary focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-600" placeholder="your@email.com" />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Interest</label>
                <div className="relative">
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-primary focus:bg-white/10 transition-all outline-none text-white appearance-none cursor-pointer">
                    <option className="bg-black">1 Month Plan (₹700)</option>
                    <option className="bg-black">3 Month Plan (₹1800)</option>
                    <option className="bg-black">Bodybuilding</option>
                    <option className="bg-black">Fat Loss</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Message</label>
                <textarea rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-primary focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-600 resize-none" placeholder="Tell us about your fitness goals..."></textarea>
              </div>
              <button type="submit" className="btn-primary w-full py-6 flex items-center justify-center space-x-4 group shadow-[0_20px_40px_rgba(255,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(255,0,0,0.3)]">
                <span className="text-xl font-black uppercase tracking-widest italic">Send To Temple</span>
                <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
              </button>
            </form>
          </motion.div>

          <div className="space-y-8">
            <div className="glass p-10 rounded-[3rem] overflow-hidden relative">
              <h3 className="text-2xl font-black uppercase italic mb-6">Temple <span className="text-primary">Hours</span></h3>
              <div className="space-y-4">
                {[
                  { day: "Monday - Saturday", hours: "05:00 AM - 10:00 PM" },
                  { day: "Sunday", hours: "06:00 AM - 12:00 PM" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="font-bold text-gray-300">{item.day}</span>
                    <span className="text-primary font-black">{item.hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <Clock className="text-primary" size={24} />
                <p className="text-xs text-gray-300">Note: Early morning slots (5 AM - 7 AM) are highly recommended for focused training.</p>
              </div>
            </div>

            <div className="glass p-10 rounded-[3rem] bg-secondary text-black relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase italic mb-4">Direct Support</h3>
                  <p className="font-bold mb-6 text-sm">Need a quick response? Message our team directly on WhatsApp.</p>

                  <div className="grid grid-cols-1 gap-3">
                    <a
                      href="https://wa.me/91XXXXXXXXXX?text=Hi%20Sanket%20Sir,%20I'm%20interested%20in%20joining%20Fitness%20Temple%20Gym."
                      target="_blank"
                      className="bg-black text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center justify-between group/wa hover:scale-[1.02] transition-all"
                    >
                      <span className="text-xs">Coach Sanket</span>
                      <MessageCircle size={18} className="text-green-500" />
                    </a>

                    <a
                      href="https://wa.me/91XXXXXXXXXX?text=Hi%20Suraj%20Sir,%20I'd%20like%20to%20know%20more%20about%20personal%20training."
                      target="_blank"
                      className="bg-black text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center justify-between group/wa hover:scale-[1.02] transition-all"
                    >
                      <span className="text-xs">Coach Suraj</span>
                      <MessageCircle size={18} className="text-green-500" />
                    </a>

                    <a
                      href="https://wa.me/91XXXXXXXXXX?text=Hi%20Owner,%20I%20have%20a%20business%20inquiry%20regarding%20Fitness%20Temple%20Gym."
                      target="_blank"
                      className="bg-black text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest flex items-center justify-between group/wa hover:scale-[1.02] transition-all"
                    >
                      <span className="text-xs">Gym Owner</span>
                      <MessageCircle size={18} className="text-green-500" />
                    </a>
                  </div>
               </div>
               <MessageCircle className="absolute -bottom-10 -right-10 w-48 h-48 text-black/5 -rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0" />
            </div>
          </div>
        </div>

        {/* Full Width Map */}
        <div className="mt-24 h-[500px] w-full rounded-[4rem] overflow-hidden border-2 border-white/5 relative group shadow-2xl">
           <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.61376816654!2d73.8407527!3d19.9743064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddebddfc419adb%3A0xaa642814b39b7de3!2sFitness%20Temple!5e0!3m2!1sen!2sin!4v1716900000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
          <div className="absolute top-8 left-8 glass px-8 py-6 rounded-2xl hidden md:block group-hover:translate-y-2 transition-transform border border-primary/20">
            <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Our Location</p>
            <p className="font-black text-lg italic tracking-tighter">Fitness Temple Gym</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
