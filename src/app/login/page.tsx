"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, Dumbbell, Sparkles, CheckCircle2, User, Users, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { gsap } from "gsap";

const LoginPage = () => {
  const { login, loginWithGoogle, resetPassword, setDemoRole, isFirebaseConfigured, user, userData, verifyPortalAccess } = useAuth();
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

  // Portal Selection State
  const [stage, setStage] = useState<'login' | 'portal-selection'>('login');
  const [selectedPortal, setSelectedPortal] = useState<UserRole | null>(null);
  const [portalPassword, setPortalPassword] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage === 'portal-selection' && portalRef.current) {
      gsap.fromTo(".portal-card",
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: "power4.out" }
      );
    }
  }, [stage]);

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
      await login(email, password);
      setStage('portal-selection');
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
      await loginWithGoogle();
      setStage('portal-selection');
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

  const handlePortalAccess = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedPortal) return;

    // Member portal bypasses secondary password if already logged in via Firebase
    if (selectedPortal === 'member') {
      setPortalLoading(true);
      const success = await verifyPortalAccess(user?.email || userData?.email || "", "", 'member');
      if (success) {
        handleRoleRedirect('member');
      } else {
        setPortalError("Could not verify member identity.");
      }
      setPortalLoading(false);
      return;
    }

    if (!portalPassword) {
      setPortalError("Please enter the portal security key.");
      return;
    }

    setPortalLoading(true);
    setPortalError("");

    try {
      const success = await verifyPortalAccess(user?.email || userData?.email || "", portalPassword, selectedPortal);
      if (success) {
        handleRoleRedirect(selectedPortal);
      } else {
        setPortalError("Invalid portal security key.");
      }
    } catch (err) {
      setPortalError("Verification failed. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden px-4 py-20 text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-[#FFA500]/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <AnimatePresence mode="wait">
        {stage === 'login' ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
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
        ) : (
          <motion.div
            key="portal-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">
                CHOOSE YOUR <span className="text-primary">PORTAL</span>
              </h2>
              <p className="text-gray-400 font-medium">
                Identity verified. Select the gateway to your destination.
              </p>
            </div>

            <div ref={portalRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Member Card */}
              <button
                onClick={() => {
                  setSelectedPortal('member');
                  handlePortalAccess();
                }}
                className="portal-card group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <User size={80} />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic mb-2">Member</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Access your personalized workout plans, diet charts, and progress tracking.
                  </p>
                  <div className="flex items-center text-primary text-xs font-black uppercase tracking-widest gap-2">
                    Enter Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Trainer Card */}
              <button
                onClick={() => setSelectedPortal('trainer')}
                className="portal-card group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Dumbbell size={80} />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic mb-2">Trainer</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Manage your athletes, update training programs, and monitor performance.
                  </p>
                  <div className="flex items-center text-primary text-xs font-black uppercase tracking-widest gap-2">
                    Enter Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Owner Card */}
              <button
                onClick={() => setSelectedPortal('owner')}
                className="portal-card group relative p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Crown size={80} />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase italic mb-2">Owner</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Overview of gym operations, financial analytics, and management tools.
                  </p>
                  <div className="flex items-center text-primary text-xs font-black uppercase tracking-widest gap-2">
                    Enter Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => setStage('login')}
                className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                Back to Identity Verification
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal Secondary Auth Modal */}
      <AnimatePresence>
        {selectedPortal && selectedPortal !== 'member' && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass max-w-md w-full p-8 md:p-10 rounded-[2.5rem] border border-white/10 relative"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                  {selectedPortal === 'owner' ? <Crown size={32} /> : <Dumbbell size={32} />}
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-wider mb-2">
                  {selectedPortal === 'owner' ? 'Owner' : 'Trainer'} Access
                </h3>
                <p className="text-gray-400 text-xs font-medium">
                  Enter your secondary security key to unlock this portal.
                </p>
              </div>

              {portalError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] p-3 rounded-xl mb-6 text-center font-bold uppercase tracking-wider">
                  {portalError}
                </div>
              )}

              <form onSubmit={handlePortalAccess} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">
                    Security Key
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="password"
                      value={portalPassword}
                      onChange={(e) => setPortalPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 focus:border-primary focus:bg-white/10 outline-none transition-all text-white placeholder:text-gray-600 text-sm"
                      placeholder="Enter security key..."
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPortal(null);
                      setPortalPassword("");
                      setPortalError("");
                    }}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={portalLoading}
                    className="flex-1 py-4 btn-primary rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {portalLoading ? <Loader2 size={16} className="animate-spin" /> : 'Verify'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
