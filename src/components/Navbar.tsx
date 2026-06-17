"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
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
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Trainers", href: "/trainers" },
    { name: "Membership", href: "/membership" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  const getDashboardLink = () => {
    if (!userData) return "/login";
    const role = userData.role?.toLowerCase();
    if (role === "owner") return "/dashboard/owner";
    if (role === "trainer") return "/dashboard/trainer";
    return "/dashboard/member";
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-xl py-4 border-b border-white/10" : "bg-transparent py-8"}`}>
      <div className="container flex justify-between items-center px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform group-hover:scale-110 duration-300">
            <img
              src="/assets/FitnessTempleGym.png"
              alt="Fitness Temple Gym Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none">Fitness Temple</span>
            <span className="text-[8px] md:text-[10px] uppercase font-bold text-primary tracking-[0.3em] leading-none">Gym & Wellness</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {!isDashboardPage && navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}

          <div className="flex items-center space-x-4 ml-4">
            {isLoggedIn ? (
              <>
                <Link href={getDashboardLink()} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full hover:bg-white/10 transition-all group">
                  <LayoutDashboard size={14} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="bg-primary text-black px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/membership" className="btn-primary px-6 py-2.5 text-[10px] rounded-full">
                  Join Now
                </Link>
                <Link href="/login" className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-full hover:bg-white/10 transition-all group">
                  <User size={14} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Portal</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white p-2" onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black z-[60] flex flex-col p-6 md:p-10"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black uppercase italic">FT <span className="text-primary">GYM</span></span>
              <button onClick={() => setIsOpen(false)} className="p-2"><X size={32} /></button>
            </div>
            <div className="flex flex-col space-y-6 overflow-y-auto pb-10">
              {isLoggedIn ? (
                <>
                  <Link href="/" className="text-4xl font-black uppercase italic tracking-tighter hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link href={getDashboardLink()} className="text-4xl font-black uppercase italic tracking-tighter hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="text-left text-4xl font-black uppercase italic tracking-tighter hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                  <div className="border-t border-white/10 pt-6 mt-6">
                    <p className="text-[10px] font-bold uppercase text-gray-500 tracking-[0.2em] mb-6">Quick Links</p>
                    <div className="grid grid-cols-2 gap-4">
                      {navLinks.slice(1).map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className="text-sm font-bold uppercase tracking-widest text-gray-400"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-4xl font-black uppercase italic tracking-tighter hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-4 mt-10">
                    <Link
                      href="/membership"
                      className="btn-primary w-full text-center py-5 text-xl rounded-2xl"
                    >
                      Join Now
                    </Link>
                    <Link
                      href="/login"
                      className="w-full text-center py-5 text-xl font-black uppercase italic border border-white/10 rounded-2xl"
                    >
                      Member Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
