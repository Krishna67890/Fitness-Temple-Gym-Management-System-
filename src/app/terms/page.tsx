"use client";
import React from "react";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#050505] text-white">
      <div className="container max-w-4xl px-4">
        <div className="flex items-center gap-4 mb-12">
          <div className="bg-primary/20 p-4 rounded-2xl">
            <FileText size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Terms of <span className="text-primary">Service</span></h1>
        </div>

        <div className="glass p-8 md:p-12 rounded-[3rem] border border-white/10 space-y-8 text-gray-400 font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">1. Membership Agreement</h2>
            <p>By joining Fitness Temple Gym, you agree to follow all gym rules and regulations. Memberships are non-transferable and non-refundable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">2. Health & Safety</h2>
            <p>You acknowledge that physical exercise involves risks. You are responsible for ensuring you are in good physical condition to use gym equipment. Consult a physician before starting any new fitness program.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">3. Code of Conduct</h2>
            <p>We maintain a respectful and clean environment. Any form of harassment or damage to property may result in immediate termination of membership without refund.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">4. Payment Terms</h2>
            <p>Membership fees must be paid in advance. For the 3-month standard plan, the full amount is due at registration.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
