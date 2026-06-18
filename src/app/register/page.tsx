"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Phone, Mail, MapPin, Calendar, Weight, Ruler, Users, Camera, Zap, CheckCircle2, Eye, EyeOff, ChevronDown, Loader2, QrCode, CreditCard, ShieldCheck, Lock, Shield, Check, Dumbbell } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const RegisterContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedPlan = searchParams.get("plan") || "basic";
  const [step, setStep] = useState(1); // 1: Form, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    age: "",
    weight: "",
    height: "",
    fitnessGoal: "muscle-gain",
    emergencyContact: "",
    membershipType: selectedPlan,
    joinDate: new Date().toISOString().split('T')[0],
  });

  // Update membershipType when selectedPlan changes
  useEffect(() => {
    if (selectedPlan) {
      setFormData(prev => ({ ...prev, membershipType: selectedPlan }));
    }
  }, [selectedPlan]);

  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "Empty", color: "bg-gray-800" });

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const levels = [
      { label: "Weak", color: "bg-red-500" },
      { label: "Fair", color: "bg-orange-500" },
      { label: "Good", color: "bg-yellow-500" },
      { label: "Strong", color: "bg-green-500" },
      { label: "Elite", color: "bg-primary" },
    ];

    setPasswordStrength({
      score,
      label: levels[Math.min(score, 4)].label,
      color: levels[Math.min(score, 4)].color
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "password") {
      checkPasswordStrength(value);
    }

    if (name === "mobile" || name === "emergencyContact") {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: numbersOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mobile.length < 10) return alert("Enter valid 10-digit mobile number");
    if (!formData.gender) return alert("Select gender");
    if (formData.password.length < 6) return alert("Password must be at least 6 characters");
    setWhatsappModalOpen(true);
  };

  const handleWhatsAppChoice = (target: 'dev' | 'owner') => {
    const phone = target === 'dev' ? '8080690631' : '9665231230';
    const message = `Hello! I would like to join Fitness Temple.
Details:
- Name: ${formData.fullName}
- Mobile: ${formData.mobile}
- Email: ${formData.email}
- Goal: ${formData.fitnessGoal}
- Plan: ${formData.membershipType}
- Gender: ${formData.gender}
- Age: ${formData.age}
- Weight: ${formData.weight}
- Height: ${formData.height}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    finalizeRegistration("WHATSAPP-" + target.toUpperCase());
    setWhatsappModalOpen(false);
  };

  const finalizeRegistration = async (paymentId: string) => {
    setLoading(true);
    try {
      const newMemberId = `FT${Math.floor(1000 + Math.random() * 9000)}`;
      setMemberId(newMemberId);

      // Calculate Expiry Date
      const joinDate = new Date();
      const expiryDate = new Date();
      if (formData.membershipType === "basic") {
        expiryDate.setMonth(joinDate.getMonth() + 1);
      } else if (formData.membershipType === "standard") {
        expiryDate.setMonth(joinDate.getMonth() + 3);
      }

      const memberData = {
        ...formData,
        uid: "local_" + Date.now(),
        memberId: newMemberId,
        paymentId: paymentId,
        status: "active",
        role: "member",
        profileImage: previewImage,
        expiryDate: expiryDate.toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Save to Local Storage Registered Members list
      const existingMembersRaw = localStorage.getItem("ft_all_members");
      const existingMembers = existingMembersRaw ? JSON.parse(existingMembersRaw) : [];

      // Check if email already exists
      if (existingMembers.some((m: any) => m.email.toLowerCase() === formData.email.toLowerCase())) {
          throw new Error("Email already registered. Please login.");
      }

      existingMembers.push(memberData);
      localStorage.setItem("ft_all_members", JSON.stringify(existingMembers));

      // Set active session
      localStorage.setItem("ft_member_session", JSON.stringify(memberData));
      localStorage.setItem("ft_user_role", "member");

      setStep(3);

      try {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
        audio.play();
      } catch (e) {}

    } catch (error: any) {
      alert("Registration failed: " + error.message);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const amount = formData.membershipType === "basic" ? 700 : 1800;

    try {
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          currency: "INR",
        }),
      });

      const order = await response.json();

      if (order.is_mock) {
          setIsDemoMode(true);
          setTimeout(() => {
              finalizeRegistration(order.id);
          }, 2000);
          return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Fitness Temple Gym",
        description: `${formData.membershipType.toUpperCase()} Membership`,
        order_id: order.id,
        handler: async function (response: any) {
          await finalizeRegistration(response.razorpay_payment_id || response.razorpay_order_id);
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#FFD700",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment Error:", error);
      // Fallback for demo
      finalizeRegistration("FT-DEMO-PAY-" + Date.now());
    }
  };

  const amount = formData.membershipType === "basic" ? 700 : 1800;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
      <div className="container max-w-4xl px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass p-6 md:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full mb-4 border border-primary/20">
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Step 01: Fill Details</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">CHAT ON <span className="text-primary">WHATSAPP</span></h1>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Provide your details to register via WhatsApp</p>
              </div>

              <form onSubmit={handleInitialSubmit} className="space-y-8">
                <div className="flex flex-col items-center mb-10">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-40 h-40 rounded-[3rem] bg-white/5 border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative group"
                  >
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Camera className="text-gray-500 mx-auto mb-2" size={32} />
                        <span className="text-[9px] font-black uppercase text-gray-500">Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <input name="fullName" required placeholder="JOHN DOE" className="ft-input" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <input name="mobile" value={formData.mobile} required className="ft-input" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <input type="email" name="email" required placeholder="WARRIOR@TEMPLE.COM" className="ft-input" onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••" className="ft-input" onChange={handleChange} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Gender</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <select name="gender" required className="ft-input appearance-none pl-12" onChange={handleChange} value={formData.gender}>
                        <option value="" disabled>SELECT GENDER</option>
                        <option value="male">MALE</option>
                        <option value="female">FEMALE</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Membership Plan</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <select name="membershipType" className="ft-input appearance-none pl-12" onChange={handleChange} value={formData.membershipType}>
                        <option value="basic">BASIC (₹700 / 1 MONTH)</option>
                        <option value="standard">STANDARD (₹1800 / 3 MONTHS)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full py-6 text-xl rounded-2xl flex items-center justify-center gap-4">
                  <span>Continue on WhatsApp</span>
                  <Zap size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass p-8 md:p-16 rounded-[4rem] border border-primary/20 text-center"
            >
              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">SECURE <span className="text-primary">PAYMENT</span></h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Total Payable: ₹{amount}</p>

              {isDemoMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl"
                >
                  <p className="text-primary text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                    <Zap size={14} /> Demo Mode Active: Processing Test Payment...
                  </p>
                </motion.div>
              )}

              <div className="relative w-64 h-64 mx-auto mb-10 bg-white p-6 rounded-[3rem] border-4 border-primary shadow-[0_0_40px_rgba(255,215,0,0.2)]">
                <QrCode size="100%" className="text-black" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase border border-primary">
                  Scan to Pay
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="w-full bg-primary text-black font-black uppercase italic py-6 rounded-2xl flex items-center justify-center gap-4 text-xl hover:scale-105 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={24} /> Pay with Razorpay</>}
                </button>
                <button
                  onClick={() => finalizeRegistration("FT-MANUAL-" + Date.now())}
                  disabled={loading}
                  className="w-full bg-white/5 border border-white/10 text-white font-black uppercase italic py-4 rounded-2xl hover:bg-white/10 transition-all"
                >
                  Confirm Manual Payment
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-12 md:p-24 rounded-[5rem] text-center border-primary/40"
            >
              <div className="w-24 h-24 bg-primary text-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,215,0,0.4)]">
                <Check size={48} strokeWidth={4} />
              </div>
              <h2 className="text-6xl font-black uppercase italic tracking-tighter mb-4">CONGRATS!</h2>
              <p className="text-primary text-xl font-black uppercase italic mb-6">You are now a part of Fitness Temple Gym</p>

              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 mb-10 max-w-md mx-auto">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Member Identity Card</p>
                <p className="text-3xl font-black italic text-white mb-4">#{memberId}</p>
                <div className="text-left space-y-2 border-t border-white/5 pt-4">
                  <p className="text-xs font-bold flex justify-between"><span>Email:</span> <span className="text-primary">{formData.email}</span></p>
                  <p className="text-xs font-bold flex justify-between"><span>Password:</span> <span className="text-primary">{formData.password}</span></p>
                </div>
              </div>

              <Link href="/dashboard/member" className="btn-primary w-full py-6 text-2xl rounded-[2rem] block shadow-[0_20px_40px_rgba(255,215,0,0.2)]">
                Access Member Portal
              </Link>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-6">Use your email/password for future logins</p>
            </motion.div>
          )}
        </AnimatePresence>

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
                    className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
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
      </div>

      <style jsx>{`
        .ft-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.25rem;
          padding: 1.25rem 1.5rem 1.25rem 3.5rem;
          font-weight: 700;
          color: white;
          outline: none;
          transition: all 0.3s;
        }
        .ft-input:focus {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
