"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  UserCheck,
  UserMinus,
  Download
} from "lucide-react";
import { motion } from "framer-motion";

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: "Monthly" | "Quarterly" | "Annual";
  status: "Active" | "Expired" | "Pending";
  joiningDate: string;
  expiryDate: string;
}

import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firestore = db;
    if (!firestore) return;

    const q = query(collection(firestore, "members"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const memberList = snapshot.docs.map(doc => {
        const data = doc.data();
        const expiryDate = data.expiryDate;
        const isExpired = expiryDate && new Date(expiryDate) < new Date();

        return {
          id: doc.id,
          ...data,
          plan: data.membershipType || "Basic",
          status: isExpired ? "Expired" : (data.status || "Active"),
          joiningDate: data.createdAt?.toDate().toLocaleDateString('en-GB') || "N/A",
          expiryDate: expiryDate ? new Date(expiryDate).toLocaleDateString('en-GB') : "N/A",
          phone: data.mobile || "N/A",
          name: data.fullName || "Unknown Member"
        };
      });
      setMembers(memberList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-500";
      case "Expired": return "bg-red-500/10 text-red-500";
      case "Pending": return "bg-yellow-500/10 text-yellow-500";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic mb-2">Member <span className="text-primary">Management</span></h1>
          <p className="text-gray-400">Manage your gym members, their plans and status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 glass rounded-xl text-gray-400 hover:text-white transition-all">
            <Download size={20} />
          </button>
          <button className="btn-primary py-3 px-6 flex items-center space-x-2">
            <Plus size={20} />
            <span className="text-sm">Add New Member</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, ID, phone..."
            className="w-full bg-secondary/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 px-6 py-3 bg-secondary/50 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all">
          <Filter size={18} />
          <span className="text-sm font-bold uppercase">Filter</span>
        </button>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Member</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Membership</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Joining Date</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Expiry Date</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((member) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xs">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{member.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{member.id} • {member.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-xs font-bold px-2 py-1 bg-white/5 rounded-md text-gray-300">
                      {member.plan}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="text-xs text-gray-400 font-bold">{member.joiningDate}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-xs text-gray-400 font-bold">{member.expiryDate}</p>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-500 hover:text-primary transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-white transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-bold uppercase">Showing {filteredMembers.length} of {members.length} members</p>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold uppercase disabled:opacity-50">Prev</button>
            <button className="px-4 py-2 bg-primary text-black rounded-lg text-xs font-bold uppercase">1</button>
            <button className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold uppercase">2</button>
            <button className="px-4 py-2 bg-white/5 rounded-lg text-xs font-bold uppercase">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
