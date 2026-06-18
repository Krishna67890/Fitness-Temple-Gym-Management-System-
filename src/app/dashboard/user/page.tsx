"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Calendar,
  Dumbbell,
  TrendingUp,
  QrCode,
  Clock,
  Weight,
  Target,
  Ruler,
  ChefHat,
  MessageCircle,
  Activity,
  ChevronRight,
  Droplets,
  Flame,
  PieChart,
  Mail,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { generateRecommendations } from "@/lib/ai-recommender";

const UserDashboard = () => {
  const router = useRouter();
  const { userData: memberData, loading } = useAuth();
  const [tribeMembers, setTribeMembers] = useState<any[]>([]);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);

  const handleWhatsAppChoice = (target: 'dev' | 'owner') => {
    const phone = target === 'dev' ? '8080690631' : '9665231230';
    const text = `Hi, I am ${memberData?.fullName} (Member ID: ${memberData?.memberId}). I have a question about my fitness plan or the AI recommendation: "${aiTip}"`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/91${phone}?text=${encoded}`, '_blank');
    setWhatsappModalOpen(false);
  };

  useEffect(() => {
    // Fetch members to show in "Warrior Tribe"
    const savedMembers = localStorage.getItem("ft_all_members");
    if (savedMembers) {
      try {
        const parsed = JSON.parse(savedMembers);
        setTribeMembers(parsed.slice(0, 10)); // Just show 10
      } catch (e) {
        console.error("Error parsing tribe members", e);
      }
    }
  }, []);

  // BMI Calculation
  const weight = parseFloat(memberData?.weight || "0");
  const height = parseFloat(memberData?.height || "0"); // in cm
  const bmi = weight > 0 && height > 0 ? (weight / ((height / 100) * (height / 100))).toFixed(1) : "--";

  const getBMICategory = (bmiValue: string) => {
    if (bmiValue === "--") return "N/A";
    const val = parseFloat(bmiValue);
    if (val < 18.5) return "Underweight";
    if (val < 25) return "Normal";
    if (val < 30) return "Overweight";
    return "Obese";
  };

  // AI Recommendations
  const [aiTip, setAiTip] = useState("Loading guidance...");
  const [macros, setMacros] = useState<any>(null);

  useEffect(() => {
    if (memberData) {
      const stats = {
        weight: parseFloat(memberData.weight || "70"),
        height: parseFloat(memberData.height || "170"),
        age: parseFloat(memberData.age || "25"),
        goal: (memberData.fitnessGoal === "muscle-gain" || memberData.fitnessGoal === "weight-loss")
              ? memberData.fitnessGoal
              : "maintenance",
        activityLevel: "moderate" as const
      };
      const recs = generateRecommendations(stats);
      setAiTip(recs.suggestion);
      setMacros(recs.macros);
    }
  }, [memberData]);

  const dailyWorkout = [
    { day: "Monday", routine: "Chest + Triceps + Cardio" },
    { day: "Tuesday", routine: "Back + Biceps + Abs" },
    { day: "Wednesday", routine: "Legs" },
    { day: "Thursday", routine: "Shoulders" },
    { day: "Friday", routine: "Chest + Back" },
    { day: "Saturday", routine: "Arms + Cardio" },
    { day: "Sunday", routine: "Rest Day" },
  ];

  const currentDayIndex = new Date().getDay(); // 0 is Sunday
  const todayWorkout = dailyWorkout[currentDayIndex === 0 ? 6 : currentDayIndex - 1];

  const dietPlan = [
    { meal: "Breakfast", food: "Oatmeal & 4 Egg Whites" },
    { meal: "Lunch", food: "Grilled Chicken & Brown Rice" },
    { meal: "Evening Snack", food: "Greek Yogurt & Almonds" },
    { meal: "Dinner", food: "Fish/Paneer & Steamed Veggies" },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!memberData) return null;

  return (
    <div className="space-y-10">
      {/* WhatsApp Choice Modal */}
      <AnimatePresence>
        {whatsappModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass p-8 md:p-12 rounded-[3rem] border-white/10 text-center"
            >
              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <MessageCircle className="text-primary" size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-4">Temple <span className="text-primary">Support</span></h3>
              <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8">
                Would you like to send your inquiry to our <span className="text-white">Developer</span> for technical issues or the <span className="text-white">Gym Owner</span> for fitness & membership queries?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleWhatsAppChoice('dev')}
                  className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Technical (Dev)
                </button>
                <button
                  onClick={() => handleWhatsAppChoice('owner')}
                  className="btn-primary py-4 text-[10px] font-black uppercase tracking-widest italic"
                >
                  Gym Owner
                </button>
              </div>

              <button
                onClick={() => setWhatsappModalOpen(false)}
                className="mt-6 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
           <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              {memberData.profileImage ? (
                <img src={memberData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-black italic">
                  {memberData.fullName?.charAt(0)}
                </div>
              )}
           </div>
           <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                Welcome, <span className="ft-gradient-text">{memberData.fullName?.split(' ')[0]}</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
                Member ID: {memberData.memberId} • {memberData.fitnessGoal?.replace('-', ' ')}
              </p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <Link href="/dashboard/settings" className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-white/5 hover:bg-white/5 transition-all">
              <User className="text-primary" size={20} />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Profile</p>
                <p className="text-xs font-black uppercase text-white italic">Edit Details</p>
              </div>
           </Link>
           <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3 border-white/5">
              <Activity className="text-primary" size={20} />
              <div className="text-left">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Status</p>
                <p className="text-xs font-black uppercase text-white italic">Active Warrior</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Stats & Attendance */}
        <div className="lg:col-span-8 space-y-8">
          {/* Warrior Tribe (All Members Progress) */}
          <div className="glass p-8 rounded-[3rem] border-white/5">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black uppercase italic tracking-tight">Warrior <span className="text-primary">Tribe</span></h3>
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Community Progress</span>
             </div>

             <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
               {tribeMembers.length > 0 ? tribeMembers.map((member, i) => (
                 <div key={i} className="flex-shrink-0 w-32 glass p-4 rounded-2xl border-white/5 text-center">
                   <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-3 flex items-center justify-center text-primary font-black italic overflow-hidden">
                     {member.profileImage ? (
                       <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
                     ) : (
                       member.fullName?.charAt(0)
                     )}
                   </div>
                   <h4 className="text-[10px] font-black uppercase truncate">{member.fullName}</h4>
                   <p className="text-[8px] text-gray-500 font-bold uppercase mb-1">{member.fitnessGoal?.replace('-', ' ')}</p>
                   <div className="text-xs font-black text-primary">{member.weight || "--"} KG</div>
                 </div>
               )) : (
                 <p className="text-[10px] text-gray-500 font-bold uppercase italic p-4">Recruiting more warriors...</p>
               )}
             </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/progress" className="glass p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all text-center group">
              <Weight className="text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" size={20} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Weight</p>
              <h4 className="text-2xl font-black italic tracking-tighter">{memberData.weight || "--"} <span className="text-[10px]">KG</span></h4>
              <p className="text-[7px] font-black text-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity mt-1">Track Progress</p>
            </Link>
            <Link href="/dashboard/progress" className="glass p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all text-center group">
              <Ruler className="text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" size={20} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Height</p>
              <h4 className="text-2xl font-black italic tracking-tighter">{memberData.height || "--"} <span className="text-[10px]">CM</span></h4>
              <p className="text-[7px] font-black text-blue-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity mt-1">Update Stats</p>
            </Link>
            <div className="glass p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all text-center">
              <Activity className="text-green-400 mx-auto mb-3" size={20} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">BMI</p>
              <h4 className="text-2xl font-black italic tracking-tighter">{bmi}</h4>
              <p className="text-[8px] font-black uppercase text-primary mt-1">{getBMICategory(bmi)}</p>
            </div>
            <div className="glass p-6 rounded-[2rem] border-white/5 hover:bg-white/5 transition-all text-center">
              <Target className="text-purple-400 mx-auto mb-3" size={20} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Goal</p>
              <h4 className="text-lg font-black italic tracking-tighter uppercase">{memberData.fitnessGoal?.split('-')[0] || "FIT"}</h4>
            </div>
          </div>

          {/* Today's Workout & Diet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
               <Dumbbell className="absolute -right-4 -bottom-4 opacity-5" size={120} />
               <h3 className="text-xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-2">
                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                 Today's Workout
               </h3>
               <div className="p-6 bg-white/5 rounded-3xl border border-white/5 mb-6">
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{todayWorkout.day}</p>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase">{todayWorkout.routine}</h4>
               </div>
               <Link href="/dashboard/workouts" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline">
                 View Full Routine <ChevronRight size={14} />
               </Link>
            </div>

            <div className="glass p-8 rounded-[3rem] border-white/5 relative overflow-hidden">
               <ChefHat className="absolute -right-4 -bottom-4 opacity-5" size={120} />
               <h3 className="text-xl font-black uppercase italic tracking-tight mb-6 flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 Fuel Your Body
               </h3>
               <div className="space-y-4">
                  {dietPlan.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                       <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{item.meal}</span>
                       <span className="text-xs font-bold">{item.food}</span>
                    </div>
                  ))}
               </div>
               <Link href="/dashboard/diets" className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:underline">
                 Detailed Diet Plan <ChevronRight size={14} />
               </Link>
            </div>
          </div>

          {/* Attendance Tracker */}
          <div className="glass p-8 rounded-[3rem] border-white/5">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black uppercase italic tracking-tight">Attendance <span className="text-primary">Log</span></h3>
               <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Marked by Owner Only</span>
             </div>

             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="border-b border-white/5">
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Month</th>
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Year</th>
                     <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {/* Sample Local Attendance Data */}
                    {[
                      { d: "19", m: "June", y: "2026", s: "Present" },
                      { d: "20", m: "June", y: "2026", s: "Present" },
                      { d: "21", m: "June", y: "2026", s: "Absent" },
                    ].map((row, i) => (
                      <tr key={i} className="group">
                        <td className="py-4 text-sm font-bold text-white">{row.d}</td>
                        <td className="py-4 text-sm text-gray-400 font-bold">{row.m}</td>
                        <td className="py-4 text-sm text-gray-400 font-bold">{row.y}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            row.s === "Present" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}>
                            {row.s}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!memberData.attendance || memberData.attendance.length === 0) && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">No recent attendance records found.</td>
                      </tr>
                    )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Column - Profile & Extras */}
        <div className="lg:col-span-4 space-y-8">
          {/* Membership Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-primary to-yellow-600 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl relative group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
               <QrCode size={120} className="text-black" />
            </div>
            <div className="relative z-10 space-y-12 text-black">
              <div className="flex justify-between items-start">
                <div>
                   <h3 className="font-black uppercase italic text-2xl tracking-tighter leading-none">Fitness Temple</h3>
                   <p className="font-bold text-[8px] uppercase tracking-[0.3em] opacity-60">Gold Membership Access</p>
                </div>
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                   <Dumbbell className="text-primary" size={24} />
                </div>
              </div>

              <div>
                <h4 className="font-black text-2xl uppercase tracking-widest leading-none mb-2">{memberData.fullName}</h4>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="font-bold text-[10px] tracking-widest opacity-60 uppercase">Member ID</p>
                      <p className="font-black text-lg tracking-widest">{memberData.memberId}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-[10px] tracking-widest opacity-60 uppercase">Valid Thru</p>
                      <p className="font-black text-sm uppercase">
                         {memberData.expiryDate ? new Date(memberData.expiryDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : "JUN 2026"}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Assistant AI Card */}
          <div className="glass p-8 rounded-[3rem] border-white/5 bg-gradient-to-br from-white/5 to-transparent">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                   <MessageCircle className="text-primary" size={24} />
                </div>
                <div>
                   <h4 className="text-lg font-black uppercase italic tracking-tight">Temple Assistant</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">AI Support Ready</p>
                </div>
             </div>
             <div className="space-y-4">
               <p className="text-sm text-gray-400 leading-relaxed font-medium italic">
                 "{aiTip}"
               </p>
               {macros && (
                 <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-gray-500 uppercase">Protein</p>
                      <p className="text-xs font-bold text-primary">{macros.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-gray-500 uppercase">Carbs</p>
                      <p className="text-xs font-bold text-blue-400">{macros.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-gray-500 uppercase">Fats</p>
                      <p className="text-xs font-bold text-orange-400">{macros.fats}g</p>
                    </div>
                 </div>
               )}
             </div>
             <button
                onClick={() => setWhatsappModalOpen(true)}
                className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                Ask Questions
             </button>
          </div>

          {/* Daily Trackers */}
          <div className="glass p-8 rounded-[3rem] border-white/5">
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">Quick Trackers</h4>
             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <Droplets size={16} className="text-blue-400" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Water Intake</span>
                      </div>
                      <span className="text-xs font-black">2.5 / 4L</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 w-[62%]" />
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <Flame size={16} className="text-orange-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Calories Burnt</span>
                      </div>
                      <span className="text-xs font-black">450 kcal</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 w-[45%]" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
