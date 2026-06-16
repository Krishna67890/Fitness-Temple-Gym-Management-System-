"use client";
import React from "react";
import { Search, Bell, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DashboardHeader = () => {
  const { userData } = useAuth();

  return (
    <header className="h-20 border-b border-white/5 bg-secondary/50 backdrop-blur-md sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between">
      <div className="relative w-full max-w-md hidden md:block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search members, plans, reports..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:border-primary outline-none transition-all"
        />
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-primary transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-secondary" />
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{userData?.fullName || "Warrior"}</p>
            <p className="text-[10px] text-gray-500 uppercase font-black">{userData?.role || "Member"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black font-black uppercase">
            {userData?.fullName?.split(' ').map((n: string) => n[0]).join('') || "W"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
