"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, Mail, MapPin, Calendar, Weight, Ruler,
  Users, Camera, Zap, CheckCircle2, Eye, EyeOff,
  ChevronDown, Loader2, ShieldCheck, Lock, Shield,
  Check, Dumbbell, MessageCircle, Target
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const WHATSAPP_OWNER = "919665231230";
const OWNER_NAME = "Owner";

const RegisterContent = () => {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedPlan = searchParams.get("plan") || "basic";
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const planMap: Record<string, string> = {
    basic: "basic-1",
    standard: "basic-3",
    annual: "basic-12",
    cardio: "cardio-1",
  };

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
    membershipType: planMap[selectedPlan] || "basic-1",
    joinDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (selectedPlan) {
      setFormData((prev) => ({ ...prev, membershipType: planMap[selectedPlan] || "basic-1" }));
    }
  }, [selectedPlan]);

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Empty",
    color: "bg-gray-800",
  });

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
    setPasswordStrength({ score, label: levels[Math.min(score, 4)].label, color: levels[Math.min(score, 4)].color });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "password") checkPasswordStrength(value);
    if (name === "mobile" || name === "emergencyContact") {
      setFormData({ ...formData, [name]: value.replace(/\D/g, "").slice(0, 10) });
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

  const priceMap: Record<string, number> = {
    "basic-1": 700, "basic-3": 1800, "basic-6": 3500, "basic-12": 6000,
    "cardio-1": 800, "cardio-3": 2000, "cardio-6": 4000, "cardio-12": 7000,
    pt: 3000,
  };
  const amount = priceMap[formData.membershipType] || 700;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.mobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!formData.gender) {
      alert("Please select your gender");
      return;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    // Proceed to registration + WhatsApp redirect
    handleFinalizeAndWhatsApp();
  };

  const handleFinalizeAndWhatsApp = async () => {
    setLoading(true);
    try {
      const newMemberId = `RFA${Math.floor(1000 + Math.random() * 9000)}`;
      setMemberId(newMemberId);

      const joinDate = new Date();
      const expiryDate = new Date();
      const plan = formData.membershipType;
      let months = 1;
      if (plan.includes("-3")) months = 3;
      if (plan.includes("-6")) months = 6;
      if (plan.includes("-12")) months = 12;
      expiryDate.setMonth(joinDate.getMonth() + months);

      const defaultAvatar = formData.gender === "boy" ? "/assets/boy.png" : "/assets/girl.png";

      await register(formData.email, formData.password, {
        name: formData.fullName,
        phone: formData.mobile,
        gender: formData.gender,
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        address: formData.address,
        fitnessGoal: formData.fitnessGoal,
        membershipPlan: formData.membershipType,
        membershipExpiry: expiryDate.toISOString(),
        role: "member",
        trainerId: "trainer_suraj",
        trainerName: "Suraj Sir",
        photoURL: previewImage || defaultAvatar,
        profileImage: previewImage || defaultAvatar,
        memberId: newMemberId,
      });

      // Open WhatsApp with owner
      const message = `🏋️ New Registration at Rajarajeshwari Fitness Arena!

📋 Details:
• Name: ${formData.fullName}
• Mobile: ${formData.mobile}
• Email: ${formData.email}
• Age: ${formData.age || "Not provided"}
• Gender: ${formData.gender === "boy" ? "Male" : "Female"}
• Weight: ${formData.weight ? formData.weight + "kg" : "Not provided"}
• Height: ${formData.height ? formData.height + "cm" : "Not provided"}
• Fitness Goal: ${formData.fitnessGoal.replace("-", " ").toUpperCase()}
• Plan: ${formData.membershipType.toUpperCase()} (₹${amount})
• Member ID: ${newMemberId}
• Address: ${formData.address || "Not provided"}

Please confirm my membership activation. Thank you! 🙏`;

      window.open(
        `https://wa.me/${WHATSAPP_OWNER}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      setStep(3);
      try {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
        audio.play();
      } catch {}
    } catch (error: any) {
      console.error("Registration Error:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered! Please login instead.");
        router.push("/login");
      } else {
        alert("Registration failed: " + (error.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#050505] text-white">
      <div className="container max-w-4xl px-4 mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/3 border border-white/10 backdrop-blur-xl p-6 md:p-12 rounded-[3rem] relative overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

              <div className="text-center mb-12 relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full mb-4 border border-primary/20">
                  <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Join Rajarajeshwari Fitness Arena
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-3">
                  START YOUR <span className="text-primary">JOURNEY</span>
                </h1>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                  Fill your details — We'll connect you via WhatsApp
                </p>
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col items-center mb-10">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-36 h-36 rounded-[2.5rem] bg-white/5 border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden relative group"
                >
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Camera className="text-gray-500 mx-auto mb-2" size={30} />
                      <span className="text-[9px] font-black uppercase text-gray-500">
                        Upload Photo
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-primary" size={28} />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-3">
                  Optional — Profile Photo
                </p>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* Row 1: Name + Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input
                        name="fullName" required placeholder="Your Full Name"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input
                        name="mobile" value={formData.mobile} required placeholder="10-digit number"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email + Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input
                        type="email" name="email" required placeholder="your@email.com"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Password * (min 6 chars)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input
                        type={showPassword ? "text" : "password"} name="password" required placeholder="Create password"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-11 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all"
                        onChange={handleChange}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1 flex-1">
                          {[0,1,2,3,4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength.score ? passwordStrength.color : "bg-white/10"}`} />
                          ))}
                        </div>
                        <span className={`text-[9px] font-black uppercase ${passwordStrength.score >= 3 ? "text-green-400" : "text-orange-400"}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Gender + Plan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Gender *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <select
                        name="gender" required
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all appearance-none cursor-pointer"
                        onChange={handleChange} value={formData.gender}
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="boy">Male</option>
                        <option value="girl">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Membership Plan *
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <select
                        name="membershipType"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all appearance-none cursor-pointer"
                        onChange={handleChange} value={formData.membershipType}
                      >
                        <option value="basic-1">Monthly Basic — ₹700 / 1 Month</option>
                        <option value="basic-3">Quarterly — ₹1800 / 3 Months</option>
                        <option value="basic-6">Half-Year — ₹3500 / 6 Months</option>
                        <option value="basic-12">Annual (Best Value) — ₹6000 / Year</option>
                        <option value="cardio-1">Gym + Cardio — ₹800 / Month</option>
                        <option value="cardio-3">Gym + Cardio — ₹2000 / 3 Months</option>
                        <option value="cardio-6">Gym + Cardio — ₹4000 / 6 Months</option>
                        <option value="cardio-12">Gym + Cardio — ₹7000 / Year</option>
                        <option value="pt">Personal Training — ₹3000 / Month</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 4: Age + Fitness Goal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Age
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input
                        type="number" name="age" placeholder="Your age" min="10" max="80"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Fitness Goal
                    </label>
                    <div className="relative">
                      <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <select
                        name="fitnessGoal"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all appearance-none cursor-pointer"
                        onChange={handleChange} value={formData.fitnessGoal}
                      >
                        <option value="muscle-gain">Muscle Gain / Bodybuilding</option>
                        <option value="fat-loss">Fat Loss / Weight Loss</option>
                        <option value="strength">Strength & Conditioning</option>
                        <option value="cardio">Cardio & Endurance</option>
                        <option value="general">General Fitness</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 5: Weight + Height */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Current Weight (kg)
                    </label>
                    <div className="relative">
                      <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input
                        type="number" name="weight" placeholder="e.g. 70"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Height (cm)
                    </label>
                    <div className="relative">
                      <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={16} />
                      <input
                        type="number" name="height" placeholder="e.g. 175"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 6: Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Home Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-primary" size={16} />
                    <textarea
                      name="address" placeholder="Your home address (optional)"
                      rows={2}
                      className="w-full bg-white/3 border border-white/10 rounded-2xl py-4 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-primary focus:bg-primary/5 transition-all resize-none"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Plan Summary Card */}
                <div className="bg-primary/8 border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">
                      Selected Plan
                    </p>
                    <p className="text-xl font-black text-white uppercase italic">
                      {formData.membershipType.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary italic">₹{amount}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                      One-time payment via WhatsApp
                    </p>
                  </div>
                </div>

                {/* WhatsApp trust note */}
                <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/15 rounded-2xl">
                  <MessageCircle className="text-green-400 shrink-0" size={20} />
                  <p className="text-xs text-gray-400 font-medium">
                    After submitting, you'll be redirected to <span className="text-green-400 font-bold">WhatsApp</span> to confirm your membership with the gym owner at <span className="text-white font-bold">9665231230</span>.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-5 text-base rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={20} /> Registering…</>
                  ) : (
                    <><MessageCircle size={20} /> Register & Open WhatsApp</>
                  )}
                </button>

                <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  Already a member?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/3 border border-primary/20 backdrop-blur-xl p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-28 h-28 bg-primary text-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,215,0,0.4)]"
              >
                <Check size={52} strokeWidth={3.5} />
              </motion.div>

              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
                WELCOME!
              </h2>
              <p className="text-primary text-xl font-black uppercase italic mb-3">
                You are now part of Rajarajeshwari Fitness Arena 🏋️
              </p>
              <p className="text-gray-400 text-sm font-medium mb-10 max-w-md mx-auto">
                Your registration is complete and WhatsApp has been opened to confirm your membership with the owner. You'll receive your activation shortly!
              </p>

              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 mb-10 max-w-sm mx-auto">
                <p className="text-[10px] font-black uppercase text-gray-500 mb-2">
                  Your Member ID
                </p>
                <p className="text-4xl font-black italic text-primary mb-4">#{memberId}</p>
                <div className="text-left space-y-2 border-t border-white/5 pt-4">
                  <p className="text-xs font-bold flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="text-white">{formData.email}</span>
                  </p>
                  <p className="text-xs font-bold flex justify-between">
                    <span className="text-gray-500">Plan:</span>
                    <span className="text-primary">{formData.membershipType.toUpperCase()}</span>
                  </p>
                  <p className="text-xs font-bold flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="text-primary">₹{amount}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/member"
                  className="btn-primary px-10 py-5 text-base rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,215,0,0.25)] flex items-center justify-center gap-2"
                >
                  <Dumbbell size={20} />
                  Access Member Dashboard
                </Link>
                <Link
                  href={`https://wa.me/${WHATSAPP_OWNER}?text=Hi! I just registered at Rajarajeshwari Fitness Arena. My Member ID is ${memberId}. Please activate my membership!`}
                  target="_blank"
                  className="px-8 py-5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-green-500/20 transition-all"
                >
                  <MessageCircle size={18} />
                  WhatsApp Owner
                </Link>
              </div>

              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-8">
                Save your email & password for future logins
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
