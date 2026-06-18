"use client";
import React, { useState, useEffect, Suspense } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useSearchParams } from "next/navigation";

const SettingsContent = () => {
  const { user, userData, logout, updateUserData } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    fitnessGoal: "",
    weight: "",
    height: ""
  });

  const [notifications, setNotifications] = useState({
    workout: true,
    diet: true,
    community: false,
    promotional: true
  });

  // Sync state when userData is loaded
  useEffect(() => {
    if (userData) {
      setProfileData({
        fullName: userData.fullName || "",
        email: userData.email || "",
        mobile: userData.mobile || "",
        fitnessGoal: userData.fitnessGoal || "",
        weight: userData.weight || "",
        height: userData.height || ""
      });
      if (userData.notifications) {
        setNotifications({
          workout: userData.notifications.workout ?? true,
          diet: userData.notifications.diet ?? true,
          community: userData.notifications.community ?? false,
          promotional: userData.notifications.promotional ?? true
        });
      }
    }
  }, [userData]);

  const handleSaveProfile = async () => {
    const uid = user?.uid || userData?.uid;
    if (!uid || !db) {
      alert("Error: Missing user ID or database connection.");
      return;
    }
    setIsSaving(true);
    try {
      const userRef = doc(db!, "users", uid);
      const memberRef = doc(db!, "members", uid);

      const updates = {
        ...profileData,
        notifications,
        updatedAt: serverTimestamp()
      };

      await Promise.all([
        updateDoc(userRef, updates),
        updateDoc(memberRef, updates)
      ]);

      // Update local storage session and context
      updateUserData(updates);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handleRazorpayUpgrade = async (plan: string) => {
    const amount = plan === "standard" ? 1800 : 700;
    try {
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR" }),
      });
      const order = await response.json();

      const finalizeUpgrade = async (paymentId: string) => {
        if (!db || !userData?.uid) return;
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + (plan === "standard" ? 3 : 1));

        const updates = {
          membershipType: plan,
          expiryDate: expiryDate.toISOString(),
          lastPaymentId: paymentId,
          updatedAt: serverTimestamp()
        };

        await Promise.all([
          updateDoc(doc(db!, "users", userData.uid), updates),
          updateDoc(doc(db!, "members", userData.uid), updates)
        ]);
        alert("Plan upgraded successfully!");
        window.location.reload();
      };

      if (order.is_mock) {
        finalizeUpgrade(order.id);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Fitness Temple Gym",
        description: `${plan.toUpperCase()} Membership Upgrade`,
        order_id: order.id,
        handler: (res: any) => finalizeUpgrade(res.razorpay_payment_id),
        prefill: {
          name: userData?.fullName,
          email: userData?.email,
          contact: userData?.mobile,
        },
        theme: { color: "#FFD700" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error(e);
      alert("Upgrade failed. Please contact support.");
    }
  };

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
                   <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                    {userData?.membershipType || "Basic"} Member • Since {
                      userData?.createdAt?.seconds
                        ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString()
                        : "Joined"
                    }
                   </p>
                </div>
                <button className="md:ml-auto btn-outline py-2 px-6 text-xs rounded-xl">Edit Photo</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Fitness Goal</label>
                    <select
                      value={profileData.fitnessGoal}
                      onChange={(e) => setProfileData({...profileData, fitnessGoal: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    >
                      <option value="weight-loss">Weight Loss</option>
                      <option value="muscle-gain">Muscle Gain</option>
                      <option value="general-fitness">General Fitness</option>
                      <option value="athletic-performance">Athletic Performance</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Weight (kg)</label>
                    <input
                      type="number"
                      value={profileData.weight}
                      onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Height (cm)</label>
                    <input
                      type="number"
                      value={profileData.height}
                      onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary"
                    />
                 </div>
              </div>

              <div className="pt-6">
                 <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="btn-primary w-full md:w-auto py-4 px-10 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
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

          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h3 className="text-xl font-black uppercase italic mb-8">Billing & <span className="text-primary">Subscription</span></h3>

              <div className="glass p-8 rounded-3xl border-primary/20 bg-primary/5 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-2">Current Plan</p>
                    <h4 className="text-3xl font-black uppercase italic">{userData?.membershipType || "Basic"} Pass</h4>
                    <p className="text-sm text-gray-400 mt-2">Your next billing date is <span className="text-white font-bold">Oct 12, 2023</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleRazorpayUpgrade("standard")}
                        className="btn-primary py-3 px-8 text-xs"
                      >
                        Upgrade to Standard
                      </button>
                      {userData?.membershipType === "standard" && (
                         <button
                           onClick={() => handleRazorpayUpgrade("basic")}
                           className="btn-outline py-2 px-8 text-[10px]"
                         >
                           Switch to Basic
                         </button>
                      )}
                    </div>
                    <button className="text-xs font-black uppercase text-red-500 hover:text-red-400 transition-colors">Cancel Plan</button>
                  </div>
                </div>
                <CreditCard className="absolute right-[-20px] bottom-[-20px] text-primary/10" size={120} />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Payment Methods</h4>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center font-bold text-[10px]">VISA</div>
                    <div>
                      <p className="text-sm font-bold">•••• •••• •••• 4242</p>
                      <p className="text-[10px] text-gray-500 uppercase">Expires 12/25</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-black uppercase text-primary hover:underline">Edit</button>
                </div>
                <button className="w-full py-4 border border-dashed border-white/20 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:border-primary hover:text-primary transition-all">
                  + Add New Payment Method
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Billing History</h4>
                <div className="overflow-hidden rounded-2xl border border-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-[10px] font-black uppercase text-gray-500">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Plan</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { date: "Sep 12, 2023", plan: "Basic Monthly", amount: "₹1,499", id: "#INV-001" },
                        { date: "Aug 12, 2023", plan: "Basic Monthly", amount: "₹1,499", id: "#INV-002" }
                      ].map((inv, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-gray-400">{inv.date}</td>
                          <td className="px-6 py-4 font-bold">{inv.plan}</td>
                          <td className="px-6 py-4 text-primary font-black">{inv.amount}</td>
                          <td className="px-6 py-4">
                            <button className="text-gray-500 hover:text-white transition-colors">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
};

export default SettingsPage;
