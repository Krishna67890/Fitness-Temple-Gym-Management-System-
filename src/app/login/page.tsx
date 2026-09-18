"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Dumbbell, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { login, loginWithGoogle, resetPassword, setDemoRole, isFirebaseConfigured } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleRoleRedirect = (role: string) => {
    if (role === "owner") {
      router.push("/dashboard/owner");
    } else if (role === "trainer") {
      router.push("/dashboard/trainer");
    } else {
      router.push("/dashboard/member");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const profile = await login(email, password);
      handleRoleRedirect(profile.role);
    } catch (err: any) {
      console.error(err);
      const code = err.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Invalid email or password. Please verify your credentials.");
      } else if (code === "auth/user-not-found") {
        setError("No warrior account found with this email.");
      } else if (code === "auth/too-many-requests") {
        setError("Access temporarily throttled due to multiple attempts. Try again shortly.");
      } else {
        setError(err.message || "Failed to authenticate. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const profile = await loginWithGoogle();
      handleRoleRedirect(profile.role);
    } catch (err: any) {
      console.error(err);
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Google authentication was cancelled or encountered an error.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      setTimeout(() => {
        setShowResetModal(false);
        setResetSent(false);
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Could not send reset email.");
    }
  };

  const handleDemoSelect = (role: "member" | "trainer" | "owner", trainerChoice?: "suraj" | "sanket") => {
    setDemoRole(role, trainerChoice);
    handleRoleRedirect(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4 py-20 text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#FFA500]/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass w-full max-w-lg p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center mb-4 group">
            <div className="relative w-16 h-16 mb-2 transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
              <img
                src="/assets/FitnessTempleGym.png"
                alt="Fitness Temple Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] relative z-10"
              />
            </div>
            <span className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">
              FITNESS TEMPLE <span className="text-primary">PORTAL</span>
            </span>
          </Link>
          <p className="text-gray-400 text-xs font-medium tracking-wide">
            Train Smarter. Live Stronger. Access your personalized fitness dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-4 rounded-2xl mb-6 text-center font-bold"
          >
            {error}
          </motion.div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">
              Warrior Email
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:border-primary focus:bg-white/10 outline-none transition-all text-white placeholder:text-gray-600 text-sm"
                placeholder="name@fitnesstemple.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-[10px] font-bold uppercase tracking-wider text-primary/70 hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-4 focus:border-primary focus:bg-white/10 outline-none transition-all text-white placeholder:text-gray-600 text-sm"
                placeholder="••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_15px_30px_rgba(255,215,0,0.2)]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span className="text-sm font-black uppercase italic tracking-widest">Access Portal</span>
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-4 bg-[#0A0A0A] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            Or Continue With
          </span>
        </div>

        {/* Google Authentication */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          type="button"
          className="w-full py-3.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl flex items-center justify-center space-x-3 text-xs font-black uppercase tracking-wider transition-all"
        >
          {googleLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.3 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Development / Demo Quick Persona Switcher */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary" />
              Role Fast-Access (Evaluation)
            </span>
            <span className="text-primary/70">1-Click Preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleDemoSelect("member")}
              className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-left transition-all group"
            >
              <span className="text-[10px] font-black uppercase block text-primary group-hover:underline">Member</span>
              <span className="text-[8px] text-gray-500 block truncate">Krishna P.</span>
            </button>
            <button
              onClick={() => handleDemoSelect("trainer", "suraj")}
              className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-left transition-all group"
            >
              <span className="text-[10px] font-black uppercase block text-primary group-hover:underline">Suraj Sir</span>
              <span className="text-[8px] text-gray-500 block truncate">Coach</span>
            </button>
            <button
              onClick={() => handleDemoSelect("trainer", "sanket")}
              className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-left transition-all group"
            >
              <span className="text-[10px] font-black uppercase block text-primary group-hover:underline">Sanket Sir</span>
              <span className="text-[8px] text-gray-500 block truncate">Coach</span>
            </button>
            <button
              onClick={() => handleDemoSelect("owner")}
              className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-left transition-all group"
            >
              <span className="text-[10px] font-black uppercase block text-primary group-hover:underline">Owner</span>
              <span className="text-[8px] text-gray-500 block truncate">Control Center</span>
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-500 text-xs">
            Don't have an active membership?{" "}
            <Link href="/register" className="text-primary font-black uppercase tracking-wider hover:underline ml-1">
              Join Tribe
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-md w-full p-8 rounded-3xl border border-white/10 relative"
            >
              <h3 className="text-xl font-black uppercase italic tracking-wider mb-2">
                Reset Password
              </h3>
              <p className="text-gray-400 text-xs mb-6">
                Enter your registered warrior email to receive password reset instructions.
              </p>

              {resetSent ? (
                <div className="flex items-center gap-3 text-primary text-xs bg-primary/10 p-4 rounded-xl border border-primary/20">
                  <CheckCircle2 size={18} />
                  <span>Password reset email dispatched. Check your inbox!</span>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@fitnesstemple.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowResetModal(false)}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 btn-primary text-xs font-black uppercase tracking-wider rounded-xl"
                    >
                      Send Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
