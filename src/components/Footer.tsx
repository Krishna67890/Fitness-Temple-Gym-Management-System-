"use client";
import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#050505] pt-24 pb-12 border-t border-white/5">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Col */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 transition-transform group-hover:scale-110 duration-300">
                <img
                  src="/assets/FitnessTempleGym.png"
                  alt="Fitness Temple Gym Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]"
                />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic flex flex-col leading-none">
                <span>Fitness</span>
                <span className="text-primary text-[10px] tracking-[0.4em] not-italic font-bold -mt-0.5 uppercase">Temple Gym</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-base font-medium">
              Fitness Temple (फिटनेस टेंपल) - Nashik's elite fitness sanctuary. Transform your physique under the guidance of Sanket Sir, Suraj Sir, and our expert staff.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-xl">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-black mb-8 uppercase tracking-widest italic text-primary">Explore</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Membership", "Trainers", "Gallery", "Contact"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(" ", "-") === 'home' ? '' : link.toLowerCase().replace(" ", "-")}`} className="text-gray-400 hover:text-primary transition-all flex items-center group text-lg font-bold">
                    <ArrowRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all duration-300" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-xl font-black mb-8 uppercase tracking-widest italic text-primary">Programs</h4>
            <ul className="space-y-4">
              {[
                { name: "Bodybuilding", slug: "bodybuilding" },
                { name: "Strength & Conditioning", slug: "strength-conditioning" },
                { name: "Fat Loss Plans", slug: "fat-loss-plans" },
                { name: "Muscle Gain", slug: "muscle-gain" },
                { name: "Personal Training", slug: "personal-training" },
                { name: "Diet Nutrition", slug: "diet-nutrition" }
              ].map((item) => (
                <li key={item.slug}>
                  <Link href={`/programs/${item.slug}`} className="text-gray-400 hover:text-primary transition-colors text-lg flex items-center font-bold group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-3 group-hover:bg-primary transition-all"></div>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-black mb-8 uppercase tracking-widest italic text-primary">Location</h4>
            <p className="text-gray-400 mb-6 text-base font-medium">
              Fitness Temple Gym, Nashik
            </p>
            <div className="space-y-2 text-sm font-bold">
              <p className="text-white">Trainers: Sanket Sir & Suraj Sir</p>
              <p className="text-gray-500">Rating: 4.9/5 ⭐ (56 Reviews)</p>
              <p className="text-gray-500 italic">Opens daily at 4:30 PM</p>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} Fitness Temple Gym. All Rights Reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
