"use client";
import React from "react";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#050505] text-white">
      <div className="container max-w-4xl px-4">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-primary/20 p-4 rounded-2xl">
            <Shield size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Privacy <span className="text-primary">Policy</span></h1>
        </div>

        <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 space-y-8 text-gray-400 font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">1. Data Collection</h2>
            <p>We collect information you provide directly to us when you register for a membership, such as your name, email address, phone number, and profile image. We also use Firebase for authentication and database management.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">2. Use of Information</h2>
            <p>We use your data to manage your membership, provide personalized workout and diet plans, and communicate important gym updates. Your payment information is securely processed by Razorpay.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">4. Third-Party Services</h2>
            <p>Our website utilizes services like Google Maps, Firebase, and Razorpay, which have their own privacy policies regarding data usage.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
