"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Lock,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Camera,
  Check
} from "lucide-react";

const SettingsPage = () => {
  const { userData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    workout: true,
    diet: true,
    community: false,
    promotional: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase italic mb-2">Account <span className="text-primary">Settings</span></h1>
        <p className="text-gray-400">Manage your profile preferences and security settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-1/4 space-y-2">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 lg:w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-black shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <tab.icon size={20} />
                  <span className="text-sm font-black uppercase italic tracking-wider whitespace-nowrap">{tab.label}</span>
                </div>
                <ChevronRight size={16} className="hidden lg:block" />
              </button>
            ))}
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center space-x-3 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all mt-4 lg:mt-8"
          >
            <LogOut size={20} />
            <span className="text-sm font-black uppercase italic tracking-wider">Sign Out</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4 glass p-6 md:p-10 rounded-[3rem] border border-white/5">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/5">
                <div className="relative group">
                   <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-4xl font-black text-black overflow-hidden border-4 border-white/10">
                      {userData?.profileImage ? (
                        <img src={userData.profileImage} className="w-full h-full object-cover" />
                      ) : (
                        userData?.fullName?.charAt(0) || "W"
                      )}
                   </div>
                   <button className="absolute bottom-0 right-0 p-3 bg-white text-black rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={20} />
                   </button>
                </div>
                <div className="text-center md:text-left">
                   <h3 className="text-2xl font-black uppercase italic">{userData?.fullName || "Warrior"}</h3>
                   <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{userData?.membershipType || "Basic"} Member • Since {new Date(userData?.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                </div>
                <button className="md:ml-auto btn-outline py-2 px-6 text-xs rounded-xl">Edit Photo</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Full Name</label>
                    <input type="text" defaultValue={userData?.fullName} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Email Address</label>
                    <input type="email" defaultValue={userData?.email} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Phone Number</label>
                    <input type="tel" defaultValue={userData?.mobile} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Member ID</label>
                    <input type="text" value={userData?.memberId} readOnly className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-gray-500 cursor-not-allowed" />
                 </div>
              </div>

              <div className="pt-6">
                 <button className="btn-primary w-full md:w-auto py-4 px-10 text-xs flex items-center justify-center gap-2">
                    <Check size={18} />
                    Save Changes
                 </button>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
               <h3 className="text-xl font-black uppercase italic mb-8">Notification <span className="text-primary">Preferences</span></h3>
               {[
                 { id: "workout", title: "Workout Reminders", desc: "Get notified when it's time for your session." },
                 { id: "diet", title: "Diet Alerts", desc: "Reminders for your meal timings and macros." },
                 { id: "community", title: "Community Updates", desc: "Notifications for likes/comments on your posts." },
                 { id: "promotional", title: "Promotional Offers", desc: "Stay updated with gym events and membership deals." }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div>
                       <p className="font-bold text-gray-200">{item.title}</p>
                       <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button
                        onClick={() => toggleNotification(item.id as any)}
                        className={`w-12 h-6 rounded-full relative transition-all ${notifications[item.id as keyof typeof notifications] ? "bg-primary" : "bg-white/10"}`}
                    >
                       <motion.div
                        animate={{ x: notifications[item.id as keyof typeof notifications] ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-black rounded-full"
                       />
                    </button>
                 </div>
               ))}
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
               <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex items-center gap-4">
                  <Shield size={32} className="text-primary" />
                  <div>
                     <p className="text-sm font-black uppercase italic">Two-Factor Authentication</p>
                     <p className="text-xs text-gray-400">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="ml-auto btn-primary py-2 px-6 text-[10px]">Enable</button>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Change Password</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <input type="password" placeholder="Current Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                    <input type="password" placeholder="New Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                    <input type="password" placeholder="Confirm New Password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                  </div>
                  <button className="btn-outline py-3 px-8 text-xs rounded-xl">Update Password</button>
               </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
