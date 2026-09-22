"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, CheckCheck, Trash2, Dumbbell, Apple, Sparkles, Clock, CheckCircle2, AlertCircle, X } from "lucide-react";
import { useAuth, getCleanEmailName } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationItem {
  id: string;
  category: "workout" | "diet" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority?: "high" | "normal";
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    category: "workout",
    title: "Daily Protocol Loaded",
    message: "Today's strength cycle is active: Chest & Triceps Hypertrophy with progressive overload tracking.",
    time: "10 mins ago",
    read: false,
    priority: "high",
  },
  {
    id: "notif-2",
    category: "diet",
    title: "Hydration & Fuel Reminder",
    message: "Drink at least 500ml water and consume your pre-workout carbs (banana + peanut butter) before 4:30 PM.",
    time: "45 mins ago",
    read: false,
  },
  {
    id: "notif-3",
    category: "system",
    title: "Evening Devotion Hours",
    message: "Fitness Temple Gym opens at 4:30 PM for high-intensity evening training. Trainers Suraj and Bhavesh on deck.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif-4",
    category: "diet",
    title: "Post-Workout Recovery Window",
    message: "Remember to consume 30g whey isolate with 5g micronized creatine within 45 minutes after workout.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "notif-5",
    category: "system",
    title: "Community Reviews Live",
    message: "Real member feedback system is active. Check verified reviews or share your own temple experience.",
    time: "2 days ago",
    read: true,
  },
];

const DashboardHeader = () => {
  const { userData } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);
  const [filterCategory, setFilterCategory] = useState<"all" | "workout" | "diet" | "system">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load and persist notification read state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ft_notifications_data");
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  const saveNotifications = (updated: NotificationItem[]) => {
    setNotifications(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("ft_notifications_data", JSON.stringify(updated));
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  // Name resolution before @ in email address
  let displayName = userData?.name || userData?.fullName || "";
  const isGeneric =
    !displayName ||
    ["warrior", "fitness warrior", "fitness member", "member"].includes(displayName.trim().toLowerCase()) ||
    displayName.includes("@");

  if (isGeneric && userData?.email) {
    displayName = getCleanEmailName(userData.email);
  } else if (!displayName) {
    displayName = "Member";
  }

  const initials = displayName.charAt(0).toUpperCase();

  const filteredNotifs = notifications.filter((n) => {
    if (filterCategory === "all") return true;
    return n.category === filterCategory;
  });

  return (
    <header className="h-20 border-b border-white/5 bg-secondary/50 backdrop-blur-md sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between">
      <div className="relative w-full max-w-md hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search members, plans, routines, reports..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:border-primary outline-none transition-all placeholder:text-gray-500"
        />
      </div>

      <div className="flex items-center space-x-4 ml-auto" ref={dropdownRef}>
        {/* Interactive Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl border transition-all relative ${
              showNotifications
                ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-primary hover:border-primary/40"
            }`}
            aria-label="Toggle notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 animate-pulse shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Advanced Notifications Drawer / Popover */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-14 w-[360px] sm:w-[420px] bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 backdrop-blur-2xl"
              >
                {/* Header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/40">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Bell size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                        Arena Notifications
                        {unreadCount > 0 && (
                          <span className="text-[9px] bg-primary text-black font-black px-2 py-0.5 rounded-full not-italic">
                            {unreadCount} NEW
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium">Real-time alerts & schedule updates</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-white/5 rounded-lg transition-all text-xs flex items-center gap-1 font-bold"
                        title="Mark all as read"
                      >
                        <CheckCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={clearNotifications}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all text-xs"
                      title="Clear all"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex p-2 gap-1.5 bg-black/20 border-b border-white/5">
                  {(["all", "workout", "diet", "system"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                        filterCategory === cat
                          ? "bg-primary text-black shadow-md"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Notifications List */}
                <div className="max-h-[340px] overflow-y-auto no-scrollbar p-3 space-y-2">
                  {filteredNotifs.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                      <CheckCircle2 size={32} className="mx-auto text-primary/40 mb-2" />
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">All Caught Up</p>
                      <p className="text-[10px] text-gray-600 mt-1">No alerts in this category</p>
                    </div>
                  ) : (
                    filteredNotifs.map((notif) => {
                      const isWorkout = notif.category === "workout";
                      const isDiet = notif.category === "diet";

                      return (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 relative group ${
                            notif.read
                              ? "bg-white/[0.02] border-white/5 opacity-70 hover:opacity-100 hover:border-white/10"
                              : "bg-white/[0.06] border-primary/20 hover:border-primary/50 shadow-sm"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                              isWorkout
                                ? "bg-primary/10 text-primary"
                                : isDiet
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {isWorkout ? (
                              <Dumbbell size={16} />
                            ) : isDiet ? (
                              <Apple size={16} />
                            ) : (
                              <Sparkles size={16} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h5
                                className={`text-xs font-black uppercase tracking-tight truncate ${
                                  notif.read ? "text-gray-300" : "text-white"
                                }`}
                              >
                                {notif.title}
                              </h5>
                              <span className="text-[9px] text-gray-500 font-mono flex items-center gap-1 flex-shrink-0">
                                <Clock size={10} />
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-normal">
                              {notif.message}
                            </p>
                          </div>

                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-black/40 border-t border-white/5 text-center">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                    Arena Smart Notification Engine
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white tracking-tight">{displayName}</p>
            <p className="text-[10px] text-primary uppercase font-black tracking-wider">{userData?.role || "Member"}</p>
          </div>
          {userData?.photoURL || userData?.profileImage ? (
            <img
              src={(userData.photoURL || userData.profileImage) as string}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary/40 shadow-lg"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-amber-300 flex items-center justify-center text-black font-black text-base uppercase shadow-lg">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
