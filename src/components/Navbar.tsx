"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, LayoutDashboard, LogOut, ChevronRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { userData, logout } = useAuth();

  const isLoggedIn = !!userData;
  const isDashboardPage = pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Programs", href: "/programs" },
    { name: "Trainers", href: "/trainers" },
    { name: "Membership", href: "/membership" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const getDashboardLink = () => {
    if (!userData) return "/portal";
    const role = userData.role?.toLowerCase();
    if (role === "owner") return "/dashboard/owner";
    if (role === "trainer") return "/dashboard/trainer";
    return "/dashboard/member";
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-2xl py-3 border-b border-white/10 shadow-2xl" : "bg-transparent py-8"}`}>
      <div className="container flex justify-between items-center px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-4 group">
          <div className="relative w-12 h-12 md:w-14 md:h-14 transition-all group-hover:scale-110 duration-500">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src="/assets/FitnessTempleGym.png"
              alt="Fitness Temple Gym Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,215,0,0.4)] relative z-10"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-3xl font-black uppercase italic tracking-tighter leading-none flex flex-col">
              <span>Fitness</span>
              <span className="text-primary text-[10px] tracking-[0.4em] not-italic font-bold -mt-1 uppercase">Temple Gym</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {!isDashboardPage && navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[11px] uppercase font-black tracking-[0.25em] transition-all relative group ${
                pathname === link.href ? "text-primary" : "text-gray-400 hover:text-white"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-0 h-[2px] bg-primary transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>
          ))}

          <div className="h-8 w-[1px] bg-white/10 mx-2" />

          <div className="flex items-center space-x-4">
            {/* Highly Visible Access Member Portal Button */}
            <Link
              href="/portal"
              className="relative group overflow-hidden rounded-2xl p-[1px] focus:outline-none shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-transform hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] rounded-2xl animate-pulse" />
              <span className="relative flex items-center space-x-2 bg-black px-4 py-2.5 rounded-2xl transition-colors group-hover:bg-black/90">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                  Access Portal
                </span>
                <ChevronRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {isLoggedIn ? (
              <>
                <Link href={getDashboardLink()} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl hover:bg-primary hover:text-black transition-all group shadow-xl">
                  <LayoutDashboard size={16} className="group-hover:text-black transition-colors" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/50 transition-all text-red-500"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/membership" className="btn-primary px-6 py-2.5 text-[11px] rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center space-x-3 lg:hidden">
          <Link
            href="/portal"
            className="px-3 py-2 rounded-xl bg-primary/20 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
          >
            <ShieldCheck size={14} />
            <span>Portal</span>
          </Link>
          {isLoggedIn && (
             <Link href={getDashboardLink()} className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <LayoutDashboard size={20} />
             </Link>
          )}
          <button
            className="w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-white/5 rounded-2xl border border-white/10"
            onClick={() => setIsOpen(true)}
          >
            <div className="w-6 h-0.5 bg-white rounded-full" />
            <div className="w-4 h-0.5 bg-primary rounded-full" />
            <div className="w-6 h-0.5 bg-white rounded-full" />
          </button>
        </div>
      </div>

      {/* Modern Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0A0A0A] border-l border-white/10 z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-8 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center space-x-3">
                  <img src="/assets/FitnessTempleGym.png" alt="Logo" className="w-10 h-10 object-contain" />
                  <span className="text-xl font-black italic tracking-tighter">FT <span className="text-primary">GYM</span></span>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white"><X size={28} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-2">
                {/* Access Member Portal Mobile Callout */}
                <Link
                  href="/portal"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 mb-4 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 text-primary"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={22} className="text-primary" />
                    <div>
                      <span className="text-sm font-black uppercase tracking-wider block">Access Member Portal</span>
                      <span className="text-[10px] text-gray-400 font-bold">Routines, Diets & 3D Workouts</span>
                    </div>
                  </div>
                  <ChevronRight size={18} />
                </Link>

                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-5 rounded-[1.5rem] transition-all border ${
                        pathname === link.href ? "bg-primary/10 border-primary/30 text-primary" : "hover:bg-white/5 border-transparent text-gray-400"
                      }`}
                    >
                      <span className="text-2xl font-black uppercase italic tracking-tighter">{link.name}</span>
                      <ChevronRight size={20} className={pathname === link.href ? "opacity-100" : "opacity-0"} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 space-y-4 bg-black/40 border-t border-white/5">
                {isLoggedIn ? (
                  <>
                    <Link href={getDashboardLink()} onClick={() => setIsOpen(false)} className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3">
                      <LayoutDashboard size={20} />
                      <span className="text-lg font-black uppercase italic">My Dashboard</span>
                    </Link>
                    <button onClick={logout} className="w-full py-5 rounded-2xl border border-red-500/20 text-red-500 font-black uppercase italic tracking-widest hover:bg-red-500/10 transition-all">
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/membership" onClick={() => setIsOpen(false)} className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center">
                      <span className="text-lg font-black uppercase italic">Join The Temple</span>
                    </Link>
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <span className="text-lg font-black uppercase italic">Member Login</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
