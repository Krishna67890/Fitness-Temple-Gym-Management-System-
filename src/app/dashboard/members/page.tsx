"use client";
import React, { useState, useEffect, useRef } from "react";
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
  Download,
  X,
  Camera,
  User,
  Phone,
  Mail,
  Lock,
  ChevronDown,
  Shield,
  Weight,
  Ruler,
  Calendar as CalendarIcon,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from "firebase/firestore";

interface Member {
  id: string;
  name: string;
  email?: string;
  phone: string;
  plan: string;
  status: string;
  joiningDate: string;
  expiryDate: string;
  age?: string;
  height?: string;
  weight?: string;
}

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    gender: "male",
    membershipType: "basic",
    age: "",
    height: "",
    weight: "",
    fitnessGoal: "muscle-gain",
  });

  useEffect(() => {
    const existingMembersRaw = localStorage.getItem("ft_all_members");
    const localMembers = existingMembersRaw ? JSON.parse(existingMembersRaw) : [];

    const formattedLocalMembers = localMembers.map((m: any) => ({
      id: m.memberId || m.uid,
      name: m.fullName,
      email: m.email,
      phone: m.mobile,
      plan: m.membershipType || "Basic",
      status: (m.expiryDate && new Date(m.expiryDate) < new Date()) ? "Expired" : (m.status || "Active"),
      joiningDate: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : "N/A",
      expiryDate: m.expiryDate ? new Date(m.expiryDate).toLocaleDateString('en-GB') : "N/A",
    }));

    if (!db) {
      setMembers(formattedLocalMembers);
      setLoading(false);
      return;
    }

    const q = query(collection(db!, "members"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseMembers: Member[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const expiryDate = data.expiryDate;
        const isExpired = expiryDate && new Date(expiryDate) < new Date();

        return {
          id: data.memberId || doc.id,
          name: data.fullName || "Unknown Member",
          email: data.email,
          phone: data.mobile || "N/A",
          plan: data.membershipType || "Basic",
          status: isExpired ? "Expired" : (data.status || "Active"),
          joiningDate: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString('en-GB') : "N/A",
          expiryDate: expiryDate ? new Date(expiryDate).toLocaleDateString('en-GB') : "N/A",
        };
      });

      const combined = [...firebaseMembers];
      formattedLocalMembers.forEach((lm: any) => {
        if (!combined.some(fm => fm.email === lm.email)) {
          combined.push(lm);
        }
      });

      setMembers(combined);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newMemberId = `FT${Math.floor(1000 + Math.random() * 9000)}`;

      const joinDate = new Date();
      const expiryDate = new Date();
      if (formData.membershipType === "basic") {
        expiryDate.setMonth(joinDate.getMonth() + 1);
      } else {
        expiryDate.setMonth(joinDate.getMonth() + 3);
      }

      const memberData = {
        ...formData,
        memberId: newMemberId,
        status: "Active",
        role: "user",
        profileImage: previewImage,
        expiryDate: expiryDate.toISOString(),
        createdAt: new Date().toISOString(),
      };

      const existingMembersRaw = localStorage.getItem("ft_all_members");
      const existingMembers = existingMembersRaw ? JSON.parse(existingMembersRaw) : [];
      existingMembers.push(memberData);
      localStorage.setItem("ft_all_members", JSON.stringify(existingMembers));

      if (db) {
        await addDoc(collection(db, "members"), {
          ...memberData,
          createdAt: serverTimestamp(),
        });
      }

      setIsAddModalOpen(false);
      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        password: "",
        gender: "male",
        membershipType: "basic",
        age: "",
        height: "",
        weight: "",
        fitnessGoal: "muscle-gain",
      });
      setPreviewImage(null);
      alert("Member added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add member");
    }
  };

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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary py-3 px-6 flex items-center space-x-2"
          >
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

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-4xl glass p-8 md:p-12 rounded-[3rem] border-white/10 my-8"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">ADD NEW <span className="text-primary">WARRIOR</span></h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Enroll a new member into the temple</p>
              </div>

              <form onSubmit={handleAddMember} className="space-y-8">
                <div className="flex flex-col items-center mb-8">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-32 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative group"
                  >
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Camera className="text-gray-500 mx-auto mb-2" size={24} />
                        <span className="text-[8px] font-black uppercase text-gray-500">Photo</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="fullName" required placeholder="Name" className="ft-input-sm" onChange={handleChange} value={formData.fullName} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mobile</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="mobile" required placeholder="Phone" className="ft-input-sm" onChange={handleChange} value={formData.mobile} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input type="email" name="email" required placeholder="Email" className="ft-input-sm" onChange={handleChange} value={formData.email} />
                    </div>
                  </div>

                  {/* Physical Stats */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Age</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="age" required placeholder="Age" className="ft-input-sm" onChange={handleChange} value={formData.age} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Height (cm)</label>
                    <div className="relative">
                      <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="height" required placeholder="Height" className="ft-input-sm" onChange={handleChange} value={formData.height} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Weight (kg)</label>
                    <div className="relative">
                      <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input name="weight" required placeholder="Weight" className="ft-input-sm" onChange={handleChange} value={formData.weight} />
                    </div>
                  </div>

                  {/* Plans & Goals */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fitness Goal</label>
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <select name="fitnessGoal" className="ft-input-sm appearance-none" onChange={handleChange} value={formData.fitnessGoal}>
                        <option value="muscle-gain">Muscle Gain</option>
                        <option value="weight-loss">Weight Loss</option>
                        <option value="fat-loss">Fat Loss</option>
                        <option value="endurance">Endurance</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Membership</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <select name="membershipType" className="ft-input-sm appearance-none" onChange={handleChange} value={formData.membershipType}>
                        <option value="basic">Basic (1 Month)</option>
                        <option value="standard">Standard (3 Months)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input type="password" name="password" required placeholder="Password" className="ft-input-sm" onChange={handleChange} value={formData.password} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary py-4 text-[10px]">
                    Create Account
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .ft-input-sm {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 0.8rem 1rem 0.8rem 3rem;
          font-weight: 700;
          font-size: 0.875rem;
          color: white;
          outline: none;
          transition: all 0.3s;
        }
        .ft-input-sm:focus {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default MembersPage;
