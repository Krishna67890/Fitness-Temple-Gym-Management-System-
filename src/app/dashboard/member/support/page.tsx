"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  ArrowRight
} from "lucide-react";

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  const tickets = [
    {
      id: "TKT-1024",
      subject: "Locker Room Key Issue",
      status: "Open",
      priority: "Medium",
      date: "2024-05-15",
      category: "Facility"
    },
    {
      id: "TKT-0988",
      subject: "Membership Renewal Query",
      status: "Resolved",
      priority: "Low",
      date: "2024-05-10",
      category: "Billing"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Customer <span className="ft-gradient-text">Support</span></h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">We're here to help you on your journey</p>
          </div>
          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="btn-primary py-3 px-6 flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            New Ticket
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* FAQ / Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-[2rem] border-white/5">
              <h3 className="text-lg font-black uppercase italic mb-4">Quick <span className="text-primary">Contact</span></h3>
              <div className="space-y-4">
                <a href="https://wa.me/919552123533" target="_blank" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">WhatsApp Support</p>
                    <p className="text-[10px] text-gray-500">Instant response</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Support Hours</p>
                    <p className="text-[10px] text-gray-500">6 AM - 10 PM Daily</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-[2rem] border-white/5 bg-gradient-to-b from-primary/5 to-transparent">
              <h3 className="text-lg font-black uppercase italic mb-4">FAQs</h3>
              <div className="space-y-2">
                {["How to freeze membership?", "Guest pass policy", "Lost & Found"].map((faq, i) => (
                  <button key={i} className="w-full text-left p-2 text-xs text-gray-400 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2">
                    <HelpCircle size={12} className="text-primary" />
                    {faq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-3">
            <div className="glass p-8 rounded-[3rem] border-white/5">
              <div className="flex items-center gap-8 mb-8 border-b border-white/5 pb-4">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`text-sm font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${activeTab === "active" ? "border-primary text-primary" : "border-transparent text-gray-500"}`}
                >
                  Active Tickets
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`text-sm font-black uppercase tracking-widest pb-4 border-b-2 transition-all ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-gray-500"}`}
                >
                  Ticket History
                </button>
              </div>

              <div className="space-y-4">
                {tickets.filter(t => activeTab === "active" ? t.status === "Open" : t.status === "Resolved").map((ticket, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/20 transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ticket.status === "Open" ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-500"}`}>
                        {ticket.status === "Open" ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold">{ticket.subject}</h4>
                          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase font-black">{ticket.id}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ticket.category} • {ticket.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${ticket.status === "Open" ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-500"}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                        <ArrowRight size={18} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}

                {tickets.filter(t => activeTab === "active" ? t.status === "Open" : t.status === "Resolved").length === 0 && (
                  <div className="py-20 text-center">
                    <MessageSquare size={40} className="mx-auto text-gray-800 mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest">No tickets found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder Modal for New Ticket */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-8 rounded-[3rem] w-full max-w-md border-white/10"
          >
            <h3 className="text-2xl font-black uppercase italic mb-6">Create <span className="text-primary">Ticket</span></h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary">
                  <option>Facility</option>
                  <option>Billing</option>
                  <option>Workout Plan</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Message</label>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary resize-none" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsNewTicketModalOpen(false)} className="flex-1 py-4 bg-white/5 rounded-2xl text-xs font-black uppercase hover:bg-white/10">Cancel</button>
                <button className="flex-1 btn-primary py-4 text-xs">Submit</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SupportPage;
