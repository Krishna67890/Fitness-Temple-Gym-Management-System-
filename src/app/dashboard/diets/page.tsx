"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Apple,
  Beef,
  Carrot,
  ChevronRight,
  Info,
  Scale,
  Zap,
  X,
  Volume2,
  VolumeX
} from "lucide-react";
import { generateRecommendations, UserStats } from "@/lib/ai-recommender";
import { useVoice } from "@/hooks/useVoice";

const dietPlans = [
// ... (rest of the dietPlans array remains same)
  {
    title: "Muscle Building Pro",
    type: "High Protein",
    calories: "2800 kcal",
    macros: { p: "200g", c: "300g", f: "80g" },
    goal: "Bulking",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
  },
  {
    title: "Shred & Lean",
    type: "Low Carb",
    calories: "1800 kcal",
    macros: { p: "180g", c: "120g", f: "60g" },
    goal: "Fat Loss",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Vegetarian Power",
    type: "Balanced",
    calories: "2200 kcal",
    macros: { p: "140g", c: "250g", f: "70g" },
    goal: "Maintenance",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Keto Advanced",
    type: "Ketogenic",
    calories: "2000 kcal",
    macros: { p: "150g", c: "30g", f: "140g" },
    goal: "Rapid Fat Loss",
    image: "https://images.unsplash.com/photo-1535914211154-b4438c61f917?q=80&w=2070&auto=format&fit=crop"
  }
];

const DietPlansPage = () => {
  const { speak, stop, isSpeaking } = useVoice();
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    weight: 70,
    height: 175,
    age: 25,
    goal: "muscle-gain",
    activityLevel: "moderate",
  });
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleGenerate = () => {
    const result = generateRecommendations(stats);
    setRecommendation(result);
  };

  return (
    <div className="space-y-8">
      {/* AI Recommendation Modal */}
      <AnimatePresence>
        {showAIModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAIModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass max-w-lg w-full p-8 md:p-12 rounded-[3rem] border-white/10"
            >
              <button onClick={() => setShowAIModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">AI <span className="text-primary">Diet</span> Recommender</h2>
              <p className="text-gray-400 text-sm mb-8">Enter your details for a personalized nutritional profile.</p>

              {!recommendation ? (
                <div className="space-y-6">
                  {/* ... (input fields) */}
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase italic text-primary">Your Recommendation</h3>
                    <button
                       onClick={() => isSpeaking ? stop() : speak(`Your daily calorie target is ${recommendation.calories} calories with ${recommendation.macros.protein} grams of protein and ${recommendation.macros.carbs} grams of carbs. ${recommendation.suggestion}`)}
                       className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-primary text-black' : 'bg-white/5 text-primary hover:bg-white/10'}`}
                     >
                        {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                     </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                      <p className="text-2xl font-black text-primary">{recommendation.calories}</p>
                      <p className="text-[8px] font-black uppercase text-gray-500">Daily Kcal</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                      <p className="text-2xl font-black text-white">{recommendation.macros.protein}g</p>
                      <p className="text-[8px] font-black uppercase text-gray-500">Protein</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl">
                      <p className="text-2xl font-black text-white">{recommendation.macros.carbs}g</p>
                      <p className="text-[8px] font-black uppercase text-gray-500">Carbs</p>
                    </div>
                  </div>
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                    <p className="text-sm italic text-gray-300">"{recommendation.suggestion}"</p>
                  </div>
                  <button onClick={() => setRecommendation(null)} className="w-full py-4 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors">
                    Re-calculate
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic mb-2">Diet <span className="text-primary">Planner</span></h1>
          <p className="text-gray-400">Nutritional guides tailored to your specific fitness goals.</p>
        </div>
        <button className="btn-primary py-3 px-6 flex items-center space-x-2">
          <Plus size={20} />
          <span className="text-sm">Create New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Diet Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-[2.5rem]">
            <div className="flex items-center space-x-3 mb-6">
               <Scale className="text-primary" size={24} />
               <h3 className="text-lg font-black uppercase italic">Current <span className="text-primary">Target</span></h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Daily Calories</span>
                <span className="text-xl font-black">2,450 kcal</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[70%]" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="text-center p-3 bg-white/5 rounded-2xl">
                   <p className="text-[10px] font-black uppercase text-gray-500 mb-1">P</p>
                   <p className="text-xs font-bold">180g</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-2xl">
                   <p className="text-[10px] font-black uppercase text-gray-500 mb-1">C</p>
                   <p className="text-xs font-bold">250g</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-2xl">
                   <p className="text-[10px] font-black uppercase text-gray-500 mb-1">F</p>
                   <p className="text-xs font-bold">70g</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-green-500/10 to-transparent border-green-500/10">
            <h3 className="text-sm font-black uppercase italic mb-4 flex items-center gap-2">
              <Apple size={16} className="text-green-500" />
              AI Diet Recommendation
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Get a personalized nutrition plan based on your body metrics and fitness goals.
            </p>
            <button
              onClick={() => setShowAIModal(true)}
              className="w-full py-3 bg-green-500/20 text-green-500 border border-green-500/20 rounded-xl text-[10px] font-black uppercase hover:bg-green-500 hover:text-white transition-all"
            >
              Get AI Plan
            </button>
          </div>

          <div className="glass p-8 rounded-[2.5rem]">
            <h3 className="text-lg font-black uppercase italic mb-6">Quick <span className="text-primary">Recipes</span></h3>
            <div className="space-y-4">
              {[
                { name: "Oatmeal Bowl", time: "10m", p: "12g" },
                { name: "Chicken Salad", time: "20m", p: "35g" },
                { name: "Peanut Shake", time: "5m", p: "25g" }
              ].map((recipe, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div>
                    <p className="text-sm font-bold">{recipe.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{recipe.time} • {recipe.p} Protein</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-600" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diet Plans Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search diet plans..."
                className="w-full bg-secondary/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dietPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[3rem] overflow-hidden group hover:border-primary/30 transition-all"
              >
                <div className="h-48 relative overflow-hidden">
                   <img src={plan.image} alt={plan.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                   <div className="absolute bottom-4 left-8">
                      <span className="text-[10px] font-black uppercase px-2 py-1 bg-primary text-black rounded-md mb-2 inline-block">
                        {plan.goal}
                      </span>
                      <h3 className="text-2xl font-black uppercase italic">{plan.title}</h3>
                   </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Total Calories</p>
                      <p className="text-lg font-black text-primary">{plan.calories}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Diet Type</p>
                      <p className="text-lg font-bold">{plan.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl mb-8">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-gray-500">Protein</p>
                      <p className="font-bold">{plan.macros.p}</p>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-gray-500">Carbs</p>
                      <p className="font-bold">{plan.macros.c}</p>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-gray-500">Fats</p>
                      <p className="font-bold">{plan.macros.f}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDiet(plan)}
                    className="w-full py-4 btn-outline text-xs rounded-2xl flex items-center justify-center gap-2"
                  >
                    <Info size={16} />
                    View Detailed Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Diet Modal */}
      <AnimatePresence>
        {selectedDiet && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDiet(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass max-w-2xl w-full rounded-[3rem] overflow-hidden border-white/10"
            >
              <button onClick={() => setSelectedDiet(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-all z-10">
                <X size={28} />
              </button>

              <div className="h-64 relative">
                <img src={selectedDiet.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-8 left-10">
                   <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">{selectedDiet.type}</p>
                   <h2 className="text-4xl font-black uppercase italic">{selectedDiet.title}</h2>
                </div>
              </div>

              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-3xl text-center">
                       <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Calories</p>
                       <p className="text-lg font-black text-primary">{selectedDiet.calories}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl text-center">
                       <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Protein</p>
                       <p className="text-lg font-black">{selectedDiet.macros.p}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl text-center">
                       <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Carbs</p>
                       <p className="text-lg font-black">{selectedDiet.macros.c}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl text-center">
                       <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Fats</p>
                       <p className="text-lg font-black">{selectedDiet.macros.f}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                       <Beef size={20} className="text-primary" /> Daily Meal Structure
                    </h3>
                    <button
                      onClick={() => {
                        const mealPlan = `The ${selectedDiet.title} plan consists of: Breakfast: Oats with protein scoop and berries. Lunch: Grilled chicken or Tofu with brown rice and vegetables. Snack: Greek yogurt or almonds. Dinner: Fish or Paneer with a large salad.`;
                        isSpeaking ? stop() : speak(mealPlan);
                      }}
                      className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-primary text-black' : 'bg-white/5 text-primary hover:bg-white/10'}`}
                    >
                      {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                 </div>
                 <div className="space-y-3">
                       {[
                         { meal: "Breakfast", food: "Oats with protein scoop & berries" },
                         { meal: "Lunch", food: "Grilled chicken/Tofu with brown rice & veg" },
                         { meal: "Snack", food: "Greek yogurt or handful of almonds" },
                         { meal: "Dinner", food: "Fish or Paneer with large salad" }
                       ].map((m, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                            <span className="text-xs font-black uppercase text-primary w-24">{m.meal}</span>
                            <span className="text-sm text-gray-300 flex-1">{m.food}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <button
                  onClick={() => {
                    speak(`Great choice! The ${selectedDiet.title} plan is now active. Let's fuel your body for success!`);
                  }}
                  className="btn-primary w-full py-5 text-sm uppercase font-black italic"
                 >
                  Set as Current Active Plan
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DietPlansPage;
