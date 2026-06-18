"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  Apple,
  TrendingUp,
  Image as ImageIcon,
  Settings,
  LogOut,
  Dumbbell,
  ShieldCheck,
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const role = userData?.role || 'member';

  const menuItems = [
    {
      name: "Dashboard",
      href: role === 'owner' ? "/dashboard/owner" : role === 'trainer' ? "/dashboard/trainer" : "/dashboard/user",
      icon: LayoutDashboard
    },
    {
      name: "Members",
      href: "/dashboard/members",
      icon: Users,
      roles: ['owner', 'trainer']
    },
    {
      name: "Attendance",
      href: "/dashboard/attendance",
      icon: CalendarCheck,
      roles: ['owner', 'trainer', 'user']
    },
    {
      name: "Workout Plans",
      href: "/dashboard/workouts",
      icon: ClipboardList,
      roles: ['owner', 'trainer', 'user']
    },
    {
      name: "Diet Plans",
      href: "/dashboard/diets",
      icon: Apple,
      roles: ['owner', 'trainer', 'user']
    },
    {
      name: "Progress",
      href: "/dashboard/progress",
      icon: TrendingUp,
      roles: ['owner', 'trainer', 'user']
    },
    {
      name: "Gallery",
      href: "/dashboard/gallery",
      icon: ImageIcon,
      roles: ['owner', 'trainer', 'user']
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ['owner', 'trainer', 'user']
    },
  ];

  const filteredMenu = menuItems.filter(item => !item.roles || item.roles.includes(role));

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-5 left-6 z-[60] lg:hidden p-2 bg-primary text-black rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "w-64 bg-secondary border-r border-white/5 flex flex-col h-screen fixed lg:sticky top-0 z-50 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <Dumbbell className="text-primary w-8 h-8" />
            <span className="text-xl font-black tracking-tighter uppercase italic">
              FITNESS <span className="text-primary">TEMPLE</span>
            </span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4 overflow-y-auto">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-black font-bold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn(isActive ? "text-black" : "text-gray-400 group-hover:text-primary")} />
                <span className="text-sm font-bold uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto space-y-4">
          <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {role === 'owner' ? <ShieldCheck size={16} className="text-primary" /> : <UserCheck size={16} className="text-primary" />}
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">Access Level</p>
                  <p className="text-xs font-black uppercase italic text-white tracking-tighter">{role}</p>
               </div>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
