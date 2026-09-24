"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, X, Sparkles, Bot, Volume2, VolumeX,
  Dumbbell, Apple, CreditCard, Users, Image, Star,
  ChevronRight, Phone, Home, Info, MessageSquare
} from "lucide-react";
import { usePathname } from "next/navigation";

// ─── Page-specific gym AI knowledge base ─────────────────────────────────────

const PAGE_GREETINGS: Record<string, string> = {
  "/": "Welcome to Rajarajeshwari Fitness Arena! On this home page, you can explore our elite facilities, calculate your BMI, and see our core values. I recommend starting with our 3D Gym Tour or checking today's workout in the Hanger Widget. How can I help you transform today?",
  "/about": "Welcome to the About page. Here, you'll learn about our legacy and our expert coaches, Suraj Sir and Sanket Sir. You can read about our philosophy of building warriors. Would you like to know more about our trainers' specialties?",
  "/about-us": "Welcome to the About page. Here, you'll learn about our legacy and our expert coaches, Suraj Sir and Sanket Sir. You can read about our philosophy of building warriors. Would you like to know more about our trainers' specialties?",
  "/programs": "This is our Training Programs hub. You can find detailed plans for Bodybuilding, Fat Loss, and Strength & Conditioning. Click on any program to see the specific workout routines. Which goal are you chasing?",
  "/trainers": "Meet our professional coaches here. Coach Suraj is our Bodybuilding expert, and Coach Sanket specializes in Strength and Conditioning. You can see their certifications and success stories. Need help choosing a personal trainer?",
  "/membership": "You're at the Membership center. We have plans ranging from Monthly at 700 rupees to our best-value Annual plan at 6000 rupees. You can enroll in any plan instantly via WhatsApp. Which plan interests you?",
  "/gallery": "Welcome to our Visual Gallery. You can view high-definition photos of our equipment, member transformations, and facility walkthroughs. Take a look at the hard work our members put in!",
  "/reviews": "This is our Live Review Portal. Here, you can read honest feedback from our members. You can also publish your own review instantly—it will be visible to everyone on all devices. Go ahead, share your experience!",
  "/contact": "Need to reach us? On this page, you can find our exact location on Google Maps, our WhatsApp contact, and gym timings. We're open from 4:30 PM for the evening session. Shall I give you the owner's WhatsApp number?",
  "/register": "Ready to join the family? Fill out this registration form to get started. Once you submit, I'll redirect you to WhatsApp to confirm your membership with the owner. It only takes a minute!",
  "/login": "Welcome back, Warrior! Log in here to access your personalized dashboard, track your daily calories, and view your workout history. Let's get to work!",
};

const PAGE_TIPS: Record<string, string[]> = {
  "/": [
    "💡 Tip: Use the BMI Calculator below to find your starting point!",
    "🏋️ Suggestion: Check the 'Push Day' routine if you're training today.",
    "📱 You can join instantly by clicking any 'Enroll' button—it goes to WhatsApp!",
    "🔍 Check out the 3D Tour to see our equipment before you visit."
  ],
  "/programs": [
    "💡 For beginners, I recommend the 'Muscle Gain Pro' program.",
    "🔥 Looking to shred? Our 'Fat Loss' program is top-rated.",
    "🏆 Strength & Conditioning is best for athletes and functional power."
  ],
  "/membership": [
    "💎 The Annual Plan is the most popular—it saves you 2400 rupees a year!",
    "📞 All 'Enroll' buttons connect you directly to the owner on WhatsApp.",
    "⚡ Membership activation is instant after payment confirmation."
  ],
  "/reviews": [
    "✍️ Anyone can post a review! You don't even need to be logged in.",
    "🌐 Your review syncs in real-time across all member devices worldwide.",
    "🛡️ We value genuine feedback—share your transformation story here!"
  ]
};

const GYM_KNOWLEDGE = {
  // MEMBERSHIP
  membership: `Our membership plans: Monthly Basic ₹700, Quarterly ₹1800 for 3 months, Half-Year ₹3500 for 6 months, Annual ₹6000 for 12 months which is the best value at ₹500 per month. We also offer Gym plus Cardio plans: Monthly ₹800, Quarterly ₹2000, Half-Year ₹4000, Annual ₹7000. Personal Training with Coach Suraj or Sanket costs ₹3000 per month. All memberships are enrolled directly via WhatsApp for instant activation!`,

  // WORKOUTS
  pushDay: `Push Day — Chest, Shoulders & Triceps workout: Start with Barbell Bench Press 4 sets of 8 to 12 reps. Then Incline Dumbbell Press 3 sets of 10 reps. Shoulder Press 3 sets of 10. Lateral Raises 3 sets of 15. Tricep Pushdowns 3 sets of 12. Overhead Tricep Extension 3 sets of 12. Rest 60 to 90 seconds between sets. This routine builds a strong upper body push strength!`,

  pullDay: `Pull Day — Back & Biceps workout: Start with Deadlifts 4 sets of 5 reps. Bent-Over Rows 4 sets of 8 to 10. Pull-Ups or Lat Pulldowns 3 sets to failure. Cable Rows 3 sets of 12. Barbell Curls 3 sets of 10. Hammer Curls 3 sets of 12. Focus on squeezing the back muscles and controlled bicep curls. Coach Suraj recommends this for maximum back width!`,

  legDay: `Leg Day — Quads, Hamstrings & Calves workout: Barbell Squats 5 sets of 5 to 8 reps, this is the king of exercises! Leg Press 3 sets of 12. Romanian Deadlifts 3 sets of 10. Leg Curls 3 sets of 12. Leg Extensions 3 sets of 15. Standing Calf Raises 4 sets of 20. Never skip leg day — it builds your foundation of strength!`,

  chestDay: `Chest Day workout: Flat Barbell Bench Press 4 sets of 8 reps is the classic foundation. Incline Bench Press 3 sets of 10 for upper chest. Decline Press 3 sets of 10 for lower chest. Cable Flyes 3 sets of 15 for stretch and contraction. Dips 3 sets to failure. Push-Ups as a finisher. Coach Sanket recommends mind-muscle connection on every rep for maximum chest growth!`,

  armDay: `Arm Day — Biceps & Triceps: EZ Bar Curls 4 sets of 10 for peak bicep. Dumbbell Curls 3 sets of 12. Concentration Curls 3 sets of 15 for the peak. Skull Crushers 4 sets of 10 for long head tricep. Tricep Dips 3 sets of failure. Close Grip Bench Press 3 sets of 8. Tricep Kickbacks 3 sets of 15. Arms respond well to high volume and mind-muscle connection!`,

  shoulderDay: `Shoulder Day workout: Military Barbell Press 4 sets of 8 for overall mass. Dumbbell Shoulder Press 3 sets of 10. Lateral Raises 4 sets of 15 for width. Front Raises 3 sets of 12. Rear Delt Flyes 3 sets of 15 for balanced look. Face Pulls 3 sets of 20. Upright Rows 3 sets of 12. Shoulders are trained 3 times a week indirectly through push and pull movements!`,

  cardio: `Cardio training at Fitness Arena: For fat loss, do 20 to 30 minutes of High Intensity Interval Training — sprint for 30 seconds, walk for 60 seconds, repeat 10 times. For endurance, do 45 minutes of moderate steady state cardio on treadmill or cycle. Morning fasted cardio burns more fat! Coach Suraj recommends combining cardio with strength training for maximum fat loss results. Our Cardio plan is available from ₹800 per month!`,

  // DIET & NUTRITION
  diet: `Nutrition is 70 percent of your fitness results! High protein diet: Eat 1.5 to 2 grams of protein per kilogram of body weight. Good protein sources — chicken breast, eggs, paneer, dal, fish, and whey protein. For bulking: calorie surplus of 300 to 500 calories above maintenance. For cutting: calorie deficit of 300 to 500 calories. Drink 3 to 4 liters of water daily. Avoid processed foods, sugar, and junk food. Meal timing: have protein within 30 minutes post-workout!`,

  protein: `Protein requirements for gym members: A 70kg person needs 105 to 140 grams of protein daily. Top protein foods: Chicken breast has 31 grams per 100 grams. Eggs have 6 grams each. Paneer has 18 grams per 100 grams. Dal has 9 grams per 100 grams. Fish has 20 to 25 grams per 100 grams. Whey protein shake gives 24 grams per scoop. Spread protein intake across 4 to 5 meals for best absorption. Coach Sanket recommends a whey protein shake post-workout!`,

  fatLoss: `Fat Loss Plan: Create a 300 to 500 calorie daily deficit. Do 4 days of weight training plus 3 days of cardio per week. Eat high protein to preserve muscle. Avoid alcohol, sugar, and processed carbs. Sleep 7 to 8 hours for optimal fat burning hormone production. Our Fat Loss program at Fitness Arena is specially designed with both training and diet protocols to maximize your results. Results typically show in 4 to 8 weeks with consistent effort!`,

  muscleGain: `Muscle Gain Plan: Eat in a calorie surplus of 300 to 500 calories. Focus on compound movements — squats, deadlifts, bench press, rows, overhead press. Train each muscle group twice per week. Get 7 to 9 hours of sleep for muscle recovery. Progressive overload is key — add weight or reps each week. Consistency beats intensity. Our Muscle Gain program at Fitness Arena takes 3 to 6 months to see significant transformation. Trust the process!`,

  // TRAINERS
  suraj: `Coach Suraj is an ACE Certified Fitness Trainer specializing in Bodybuilding and Weight Loss with 8 plus years of experience. He is an expert in form correction, personalized diet plans, and transformation programs. Coach Suraj has helped 500 plus members achieve their fitness goals. He is available for Personal Training sessions at ₹3000 per month. Connect on WhatsApp or visit the gym to book a session!`,

  sanket: `Coach Sanket is a certified Strength and Conditioning Coach with expertise in functional fitness, sports performance, and powerlifting. With 8 plus years of coaching experience, he specializes in building raw strength and athletic performance. Coach Sanket is available for Personal Training at ₹3000 per month. He is also known for his motivational coaching style that pushes members beyond their limits!`,

  // GYM INFO
  gymInfo: `Rajarajeshwari Fitness Arena is a premium gym facility with air-conditioned workout area, separate cardio zone, heavy weight training section, functional training area, personal training pods, clean locker facility, drinking water, and a hygienic environment. We have 500 plus active members and have achieved 1000 plus transformations. Our gym is open for all fitness levels from beginners to advanced athletes!`,

  // ENROLL
  enroll: `To join Rajarajeshwari Fitness Arena, simply go to our Membership page and click any Enroll Now button. This opens WhatsApp directly with the owner at 9665231230. Choose your plan — Monthly at ₹700, Quarterly at ₹1800, Half-Year at ₹3500, or Annual at ₹6000. Payment is made through WhatsApp and your membership is activated instantly. Join today and start your transformation journey!`,

  // REVIEWS
  reviews: `To write a review, go to the Reviews page and click Write a Review. You do NOT need to log in — anyone can post! Enter your name, pick your star rating, choose a custom color for your review card, write your experience, and hit Publish. Your review appears instantly on all devices worldwide and stays until the owner removes it. Share your fitness journey and inspire others!`,

  // DETAILED PLANS
  bodybuilding: "Our Bodybuilding program is a hyper-focused hypertrophy plan designed by Coach Suraj. It features a 5-day split: Chest, Back, Shoulders, Legs, and Arms. We focus on isolation movements and high volume to carve muscle definition. You'll receive a monthly mass-gaining diet chart and weekly progress check-ins. Perfect for those looking to compete or build a powerhouse physique!",
  strengthConditioning: "Strength & Conditioning at Fitness Arena is led by Coach Sanket. This program uses functional movements, compound lifts, and explosive drills to improve athletic performance. We use methodologies like 5-3-1 and linear periodization. It's ideal for athletes, martial artists, or anyone who wants to be as strong as they look!",
  muscleGainPro: "The Muscle Gain Pro plan is our most popular for beginners. It includes a 3-day full-body split transitioning to a 4-day upper/lower split. You get a personalized protein-rich diet plan, supplement guidance, and form coaching for the big three lifts: Squat, Bench, and Deadlift. Expect to gain significant lean mass in 12 weeks!",
  personalTraining: "Our 1-on-1 Personal Training is the elite experience. For ₹3000/month, you get a dedicated coach (Suraj or Sanket) for 1 hour daily, a dynamic nutrition plan that changes weekly, priority equipment access, and daily accountability. This is the fastest way to reach any fitness goal with zero guesswork!",
};

// ─── Detect which knowledge to use from user's voice input ───────────────────
const processVoiceInput = (input: string, pathname: string): string => {
  const txt = input.toLowerCase();

  // Page navigation guidance
  if (txt.includes("what") && (txt.includes("do") || txt.includes("here") || txt.includes("page") || txt.includes("guide") || txt.includes("help"))) {
    const pageTips = PAGE_TIPS[pathname] || PAGE_TIPS["/"];
    const tip = pageTips ? pageTips[Math.floor(Math.random() * pageTips.length)] : "";
    return (PAGE_GREETINGS[pathname] || PAGE_GREETINGS["/"]) + (tip ? ` Also: ${tip}` : "");
  }

  // Workout plans
  if (txt.includes("push day") || (txt.includes("chest") && txt.includes("shoulder"))) return GYM_KNOWLEDGE.pushDay;
  if (txt.includes("pull day") || (txt.includes("back") && txt.includes("bicep"))) return GYM_KNOWLEDGE.pullDay;
  if (txt.includes("leg") || txt.includes("squat") || txt.includes("deadlift")) return GYM_KNOWLEDGE.legDay;
  if (txt.includes("chest") && !txt.includes("shoulder")) return GYM_KNOWLEDGE.chestDay;
  if (txt.includes("arm") || txt.includes("bicep") || txt.includes("tricep") || txt.includes("curl")) return GYM_KNOWLEDGE.armDay;
  if (txt.includes("shoulder") || txt.includes("delt") || txt.includes("press")) return GYM_KNOWLEDGE.shoulderDay;
  if (txt.includes("cardio") || txt.includes("running") || txt.includes("treadmill") || txt.includes("hiit")) return GYM_KNOWLEDGE.cardio;

  // Specific Programs
  if (txt.includes("bodybuilding")) return GYM_KNOWLEDGE.bodybuilding;
  if (txt.includes("strength") && txt.includes("conditioning")) return GYM_KNOWLEDGE.strengthConditioning;
  if (txt.includes("muscle gain") && txt.includes("pro")) return GYM_KNOWLEDGE.muscleGainPro;
  if (txt.includes("personal training") || txt.includes("one on one")) return GYM_KNOWLEDGE.personalTraining;

  if (txt.includes("workout") || txt.includes("exercise") || txt.includes("routine") || txt.includes("training")) {
    return "We offer multiple workout programs! Ask me about Push Day, Pull Day, Leg Day, Chest Day, Arm Day, Shoulder Day, or Cardio. Our coaches Suraj Sir and Sanket Sir design all programs for maximum results. Which specific workout would you like to know about?";
  }

  // Diet & Nutrition
  if (txt.includes("fat loss") || txt.includes("weight loss") || txt.includes("cut") || txt.includes("shred")) return GYM_KNOWLEDGE.fatLoss;
  if (txt.includes("muscle") || txt.includes("bulk") || txt.includes("mass") || txt.includes("gain weight")) return GYM_KNOWLEDGE.muscleGain;
  if (txt.includes("protein") || txt.includes("whey") || txt.includes("food source")) return GYM_KNOWLEDGE.protein;
  if (txt.includes("diet") || txt.includes("food") || txt.includes("nutrition") || txt.includes("meal") || txt.includes("eat")) return GYM_KNOWLEDGE.diet;

  // Membership & Pricing
  if (txt.includes("annual") || txt.includes("yearly") || txt.includes("6000")) {
    return "Our Annual Membership is ₹6000 for 12 months — that's only ₹500 per month, the best value! It includes full gym access, all-season guidance, and legacy member status. Enroll now via WhatsApp at 9665231230!";
  }
  if (txt.includes("monthly") || txt.includes("month") || txt.includes("700") || txt.includes("1 month")) {
    return "Our Monthly Basic Plan is ₹700 for 1 month, giving you full gym access and basic workout guidance. Perfect for trying out the gym! Enroll via WhatsApp at 9665231230.";
  }
  if (txt.includes("quarterly") || txt.includes("3 month") || txt.includes("1800")) {
    return "Our Quarterly Plan is ₹1800 for 3 months. It includes full workout guidance, diet consultation, and progress tracking. Our most popular plan! Enroll via WhatsApp at 9665231230.";
  }
  if (txt.includes("plan") || txt.includes("price") || txt.includes("cost") || txt.includes("fee") || txt.includes("member") || txt.includes("join")) {
    return GYM_KNOWLEDGE.membership;
  }

  // Trainers
  if (txt.includes("suraj")) return GYM_KNOWLEDGE.suraj;
  if (txt.includes("sanket")) return GYM_KNOWLEDGE.sanket;
  if (txt.includes("trainer") || txt.includes("coach") || txt.includes("personal training") || txt.includes("instructor")) {
    return "We have two expert coaches! Coach Suraj specializes in Bodybuilding and Weight Loss. Coach Sanket is a Strength & Conditioning expert. Both are available for Personal Training at ₹3000 per month. Visit the Trainers page to learn more or WhatsApp us at 9665231230!";
  }

  // Gym info
  if (txt.includes("gym") || txt.includes("facility") || txt.includes("equipment") || txt.includes("about")) return GYM_KNOWLEDGE.gymInfo;

  // Enroll / Join
  if (txt.includes("enroll") || txt.includes("register") || txt.includes("sign up") || txt.includes("how to join")) return GYM_KNOWLEDGE.enroll;

  // Reviews
  if (txt.includes("review") || txt.includes("feedback") || txt.includes("rate") || txt.includes("post")) return GYM_KNOWLEDGE.reviews;

  // Greetings
  if (txt.includes("hello") || txt.includes("hi") || txt.includes("hey") || txt.includes("namaste")) {
    return "Namaste Warrior! I'm your Fitness Arena AI Guide. I can help you with workout plans like Push, Pull, Leg, Chest, Arm days, diet and nutrition advice, membership plans, trainer information, and much more. What would you like to know?";
  }

  // Contact / WhatsApp
  if (txt.includes("contact") || txt.includes("whatsapp") || txt.includes("phone") || txt.includes("number") || txt.includes("call")) {
    return "Contact Rajarajeshwari Fitness Arena directly on WhatsApp at 9665231230. The owner and coaches are available to answer all your queries about memberships, training programs, and schedules. You can also visit our Contact page for the gym address!";
  }

  // Default
  return `I'm your Fitness Arena AI Guide! I specialize in gym knowledge. Try asking me: What is today's workout? What's a good diet plan? Which membership plan is best? Tell me about the trainers. How do I enroll? How to post a review? Or simply ask 'What can I do on this page?'`;
};

// ─── Component ─────────────────────────────────────────────────────────────────
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const pathname = usePathname();

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const hasSpokenGreeting = useRef<string>("");

  // Set greeting when page changes
  useEffect(() => {
    const greeting = PAGE_GREETINGS[pathname] || PAGE_GREETINGS["/"];
    setBotResponse(greeting);

    // Auto-speak greeting only if widget is open and page changed
    if (isOpen && hasSpokenGreeting.current !== pathname && !isMuted) {
      hasSpokenGreeting.current = pathname;
      setTimeout(() => speak(greeting), 300);
    }
  }, [pathname]);

  // On open — speak greeting for current page
  useEffect(() => {
    if (isOpen && hasSpokenGreeting.current !== pathname) {
      const greeting = PAGE_GREETINGS[pathname] || PAGE_GREETINGS["/"];
      hasSpokenGreeting.current = pathname;
      if (!isMuted) speak(greeting);
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-IN";

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          const response = processVoiceInput(text, pathname);
          setBotResponse(response);
          if (!isMuted) speak(response);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || isMuted) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  }, [isMuted]);

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {}
    }
  };

  const handleQuickCommand = (command: string) => {
    let response = processVoiceInput(command, pathname);
    setBotResponse(response);
    setTranscript(command);
    if (!isMuted) speak(response);
  };

  // Quick action buttons per page
  const getQuickButtons = () => {
    const baseButtons = [
      { label: "Plans", icon: CreditCard, cmd: "membership plan price" },
      { label: "Workout", icon: Dumbbell, cmd: "workout routine training" },
      { label: "Diet", icon: Apple, cmd: "diet nutrition food" },
      { label: "Trainers", icon: Users, cmd: "trainer coach" },
    ];

    const pageButtons: Record<string, Array<{ label: string; icon: any; cmd: string }>> = {
      "/": [
        { label: "Plans", icon: CreditCard, cmd: "membership plan" },
        { label: "Workout", icon: Dumbbell, cmd: "what workout today" },
        { label: "Gallery", icon: Image, cmd: "gallery facilities" },
        { label: "Reviews", icon: Star, cmd: "how to post review" },
      ],
      "/programs": [
        { label: "Push Day", icon: Dumbbell, cmd: "push day workout chest shoulder" },
        { label: "Pull Day", icon: Dumbbell, cmd: "pull day workout back bicep" },
        { label: "Leg Day", icon: Dumbbell, cmd: "leg day workout squat" },
        { label: "Fat Loss", icon: Dumbbell, cmd: "fat loss plan weight loss" },
      ],
      "/membership": [
        { label: "Monthly", icon: CreditCard, cmd: "monthly plan 700" },
        { label: "Annual", icon: CreditCard, cmd: "annual plan 6000" },
        { label: "Cardio+", icon: Dumbbell, cmd: "cardio plan" },
        { label: "Personal", icon: Users, cmd: "personal training coach" },
      ],
      "/trainers": [
        { label: "Suraj Sir", icon: Users, cmd: "about trainer suraj" },
        { label: "Sanket Sir", icon: Users, cmd: "about trainer sanket" },
        { label: "Book PT", icon: Phone, cmd: "how to enroll personal training" },
        { label: "Diet", icon: Apple, cmd: "diet plan nutrition" },
      ],
      "/reviews": [
        { label: "Post Review", icon: MessageSquare, cmd: "how to post review" },
        { label: "Sync Info", icon: Star, cmd: "how reviews work all devices" },
        { label: "Gym Info", icon: Info, cmd: "about gym facilities" },
        { label: "Enroll", icon: CreditCard, cmd: "how to enroll membership" },
      ],
    };

    return pageButtons[pathname] || baseButtons;
  };

  const quickButtons = getQuickButtons();

  return (
    <div className="fixed bottom-24 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="absolute bottom-20 right-0 w-[340px] bg-[#0A0A0A] border border-primary/25 rounded-[2.5rem] overflow-hidden shadow-[0_0_60px_rgba(255,215,0,0.15)]"
          >
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-primary/15 to-transparent border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] relative">
                  <Bot size={18} className="text-black" />
                  {isSpeaking && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#0A0A0A] animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="text-[11px] font-black uppercase italic text-white tracking-widest leading-none">
                    Gym AI Guide
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isListening ? "bg-red-500 animate-pulse" : isSpeaking ? "bg-green-400 animate-pulse" : "bg-primary"}`} />
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                      {isListening ? "Listening…" : isSpeaking ? "Speaking…" : "Ready"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setIsMuted(!isMuted); if (!isMuted) stopSpeaking(); }}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={14} className="text-gray-400" /> : <Volume2 size={14} className="text-primary" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                  <X size={14} className="text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Bot Response Bubble */}
              <div className="bg-white/4 border border-white/8 rounded-2xl p-4 relative min-h-[72px]">
                {isSpeaking && (
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded-full animate-bounce"
                        style={{
                          height: `${8 + (i % 3) * 6}px`,
                          animationDelay: `${i * 0.07}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
                <p className="text-[11px] text-gray-300 font-medium leading-relaxed">
                  {botResponse}
                </p>
              </div>

              {/* User Transcript */}
              {transcript && (
                <div className="flex justify-end">
                  <div className="bg-primary text-black px-3 py-2 rounded-2xl rounded-tr-sm text-[10px] font-black uppercase max-w-[80%]">
                    {transcript}
                  </div>
                </div>
              )}

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {quickButtons.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleQuickCommand(btn.cmd)}
                    className="bg-white/4 hover:bg-primary/15 border border-white/8 hover:border-primary/40 p-2.5 rounded-2xl flex items-center gap-2 transition-all group"
                  >
                    <btn.icon size={12} className="text-primary shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-tight text-gray-400 group-hover:text-white">
                      {btn.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Voice Button */}
              <button
                onClick={toggleListening}
                className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-[11px] uppercase tracking-widest ${
                  isListening
                    ? "bg-red-500/90 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]"
                    : "bg-primary text-black shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                {isListening ? "Stop Listening" : "Talk to AI"}
              </button>

              {/* Page hint */}
              <p className="text-center text-[8px] text-gray-600 font-bold uppercase tracking-widest">
                Page-aware • Gym-specific AI • Always learning
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.4)] relative group"
      >
        {/* Ping ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/60 group-hover:animate-ping opacity-40" />
        <div className="absolute inset-[-6px] rounded-full border border-primary/20 animate-pulse" />

        {isOpen ? (
          <X className="text-black" size={24} />
        ) : (
          <Sparkles className="text-black" size={26} />
        )}

        {/* Listening indicator */}
        {isListening && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-black">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}

        {/* Speaking indicator */}
        {isSpeaking && !isListening && (
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg border-2 border-black">
            <Volume2 size={10} className="text-black" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIAssistant;
