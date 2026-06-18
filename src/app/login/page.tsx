"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { isFirebaseConfigured } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [role, setRole] = useState<"member" | "trainer" | "owner">("member");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Official Staff Credentials
    const ownerAccounts = [
      { email: "omkar@fitnesstemple.com", password: "Omkar@123", name: "Omkar" },
      { email: "siddhant@fitnesstemple.com", password: "Siddhant@123", name: "Siddhant" }
    ];

    const trainerAccounts = [
      { email: "suraj@fitnesstemple.com", password: "Suraj@123", name: "Suraj" },
      { email: "sanket@fitnesstemple.com", password: "Sanket@123", name: "Sanket" }
    ];

    const memberAccounts = [
        { email: "member1@fitnesstemple.com", password: "Member@123", name: "Member One" },
        { email: "fitness@temple.com", password: "fitnesstemple", name: "Test Member" }
    ];

    try {
      if (role === "owner") {
        const owner = ownerAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);
        if (owner) {
          localStorage.setItem("ft_user_role", "owner");
          localStorage.setItem("ft_member_session", JSON.stringify({ role: "owner", name: owner.name, email: owner.email }));
          router.push("/dashboard/owner");
          return;
        }
      } else if (role === "trainer") {
        const trainer = trainerAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);
        if (trainer) {
          localStorage.setItem("ft_user_role", "trainer");
          localStorage.setItem("ft_member_session", JSON.stringify({ role: "trainer", name: trainer.name, email: trainer.email }));
          router.push("/dashboard/trainer");
          return;
        }
      } else if (role === "member") {
        const member = memberAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);
        if (member) {
          localStorage.setItem("ft_user_role", "member");
          localStorage.setItem("ft_member_session", JSON.stringify({ role: "member", name: member.name, email: member.email }));
          router.push("/dashboard/member");
          return;
        }

        // Check Local Storage for registered members
        const existingMembersRaw = localStorage.getItem("ft_all_members");
        if (existingMembersRaw) {
          const existingMembers = JSON.parse(existingMembersRaw);
          const localMember = existingMembers.find((m: any) => m.email.toLowerCase() === email.toLowerCase() && m.password === password);
          if (localMember) {
            localStorage.setItem("ft_user_role", "member");
            localStorage.setItem("ft_member_session", JSON.stringify(localMember));
            router.push("/dashboard/member");
            return;
          }
        }
      }

      // Default Firebase Login for Members (Disabled for now as per request)
      /*
      if (!isFirebaseConfigured || !auth) {
        setError("Firebase not connected. Please check your configuration.");
        return;
      }
      await signInWithEmailAndPassword(auth!, email, password);
      localStorage.setItem("ft_user_role", "member");
      router.push("/dashboard/member");
      */
      setError("Access Denied: Invalid credentials for the " + role + " portal.");
    } catch (err: any) {
      console.error(err);
      setError("Access Denied: Invalid credentials for the " + role + " portal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-6 py-20">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 md:p-10 rounded-[3rem] border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center mb-6 group">
            <img src="/assets/FitnessTempleGym.png" alt="Logo" className="w-16 h-16 object-contain mb-2" />
            <span className="text-2xl font-black tracking-tighter uppercase italic">
              Fitness Temple <span className="text-primary">Portal</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black uppercase italic mb-2 tracking-tight">Login <span className="text-primary">As</span></h1>

          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5">
            {(["member", "trainer", "owner"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  role === r ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-gray-500 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-2xl mb-6 text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:border-primary focus:bg-white/10 outline-none transition-all text-white placeholder:text-gray-600"
                placeholder="name@fitnesstemple.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Password</label>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Secure Access</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-5 focus:border-primary focus:bg-white/10 outline-none transition-all text-white placeholder:text-gray-600"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-5 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_20px_40px_rgba(255,215,0,0.2)]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <span className="text-lg font-black uppercase italic tracking-widest">Authorize Access</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center space-y-4">
          <p className="text-gray-500 font-medium">
            New Warrior?{" "}
            <Link href="/register" className="text-primary font-black uppercase italic tracking-widest hover:underline ml-1 text-xs">Join the Temple</Link>
          </p>
          <div className="pt-4 border-t border-white/5">
             <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-2">Platform Developer</p>
             <a
               href="https://krishna-patil-rajput.vercel.app/"
               target="_blank"
               className="text-[10px] text-primary font-bold hover:text-white transition-colors"
             >
                Krishna Patil Rajput
             </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
