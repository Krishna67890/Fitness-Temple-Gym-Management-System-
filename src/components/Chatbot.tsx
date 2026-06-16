"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Volume2, VolumeX, Mic, ExternalLink } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [messages, setMessages] = useState([
    { role: "bot", text: "🙏 Welcome to Fitness Temple Gym! I am Temple Assistant. Ask me anything about workouts, fitness, nutrition, supplements, muscle gain, fat loss, gym exercises, or healthy living." }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const getBotResponse = (userInput: string) => {
    const q = userInput.toLowerCase();

    // Developer Information
    if (q.includes("developer") || q.includes("who built") || q.includes("who made") || q.includes("krishna")) {
      return "This platform was developed by Krishna Patil Rajput. You can view his portfolio at https://krishna-patil-rajput.vercel.app/ or connect on LinkedIn: https://www.linkedin.com/in/krishna-patil-rajput-b66b03340";
    }

    // Equipment
    if (q.includes("equipment") || q.includes("machine") || q.includes("treadmill") || q.includes("bench press") || q.includes("leg press") || q.includes("smith machine") || q.includes("lat pulldown") || q.includes("cable") || q.includes("dumbbells") || q.includes("barbells") || q.includes("squat rack") || q.includes("hack squat")) {
      return "We have top-tier commercial equipment including Treadmills, Bench Press stations, Leg Press, Smith Machines, Lat Pulldowns, Functional Cable Trainers, Pec Decks, a wide range of Dumbbells & Barbells, Squat Racks, and Hack Squat machines. Each is designed for maximum safety and muscle engagement.";
    }

    // Workout Plans
    if (q.includes("workout plan") || q.includes("beginner") || q.includes("intermediate") || q.includes("advanced") || q.includes("push pull legs") || q.includes("bro split") || q.includes("full body")) {
      if (q.includes("beginner")) return "For beginners, I recommend a 3-day Full Body split or a Basic Bro Split (one muscle per day) to build a foundation. Focus on form over weight.";
      if (q.includes("push pull legs") || q.includes("ppl")) return "Push-Pull-Legs is an elite 3 or 6 day split. Push (Chest/Shoulders/Triceps), Pull (Back/Biceps), and Legs (Quads/Hams/Glutes). It's great for frequency!";
      return "We offer personalized workout programs: Beginner foundation, Intermediate PPL or Bro Splits, and Advanced high-volume training. Which level are you at?";
    }

    // Specific Exercises
    if (q.includes("how to") || q.includes("form") || q.includes("mistakes") || q.includes("reps") || q.includes("sets")) {
      return "For most muscle-building goals, aim for 3-4 sets of 8-12 reps with correct form. Avoid using momentum; control the 'eccentric' (lowering) phase. Safety first—always warm up before heavy lifts!";
    }

    // Nutrition & Diet
    if (q.includes("diet") || q.includes("nutrition") || q.includes("eat") || q.includes("muscle gain") || q.includes("fat loss")) {
      if (q.includes("gain") || q.includes("bulk")) return "For muscle gain, stay in a 200-500 calorie surplus. Prioritize protein (1.8g+ per kg) and complex carbs like oats and sweet potatoes.";
      if (q.includes("loss") || q.includes("cut")) return "For fat loss, maintain a caloric deficit. Eat high volume, low calorie foods like green veggies, and keep your protein high to preserve muscle.";
      return "Nutrition is 70% of fitness. We provide customized diet plans for both muscle gain and fat loss. Focus on lean proteins, complex carbs, and healthy fats.";
    }

    // Supplements
    if (q.includes("supplement") || q.includes("whey") || q.includes("creatine") || q.includes("mass gainer") || q.includes("bcaa") || q.includes("multivitamin")) {
      return "Recommended Supplements: 1. Whey Protein for recovery. 2. Creatine Monohydrate for strength/size. 3. Multivitamins for overall health. 4. Mass Gainers only if you're a hard gainer. Supplements help, but diet is primary!";
    }

    // Membership & Gym Info
    if (q.includes("fee") || q.includes("price") || q.includes("cost") || q.includes("plan") || q.includes("timing") || q.includes("trainer")) {
      return "Membership Plans: ₹700 (1 Month) and ₹1800 (3 Months). We have expert trainers like Suraj and Sanket. Timings: 5 AM - 10 PM. Owners Omkar & Siddhant ensure a premium environment.";
    }

    // General Fitness Knowledge
    if (q.includes("bmi") || q.includes("calorie") || q.includes("cardio") || q.includes("strength")) {
      return "Fitness Tip: Balance strength training for muscle and cardio for heart health. Track your calories and calculate your BMI to monitor progress accurately.";
    }

    // Greet
    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "Hello Warrior! I'm Temple Assistant from Fitness Temple Gym. Ready to crush your goals? Ask me about workouts, diet, or our gym equipment!";
    }

    // Fallback - providing more value than just a refusal
    return "I can help you with: 1. Workout Plans (Beginner to Advanced) 2. Equipment Info (Treadmills, Squat Racks, etc.) 3. Nutrition & Supplements 4. Exercise Form & Safety. What would you like to know more about?";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    const userQuery = input;
    setInput("");

    setTimeout(() => {
      const response = getBotResponse(userQuery);
      setMessages(prev => [...prev, { role: "bot", text: response }]);
      speak(response);
    }, 600);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass w-[380px] h-[550px] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden mb-6 border-primary/20 bg-black/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-yellow-600 p-6 flex justify-between items-center text-black">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="bg-black p-2 rounded-full border border-black/20">
                    <Bot size={24} className="text-primary" />
                  </div>
                  {isSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm italic tracking-tight leading-none mb-1">Temple Assistant</h4>
                  <p className="text-[10px] font-bold uppercase opacity-80 leading-none">Ready for Gains</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 hover:bg-black/10 rounded-full transition-colors"
                >
                  {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:rotate-90 transition-all duration-300">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-95"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] shadow-lg ${
                    msg.role === "user"
                      ? "bg-primary text-black font-bold rounded-tr-none"
                      : "bg-white/5 border border-white/10 text-gray-100 rounded-tl-none"
                  }`}>
                    {msg.text.includes("https://") ? (
                      <div>
                        {msg.text.split(/(https:\/\/\S+)/).map((part, index) =>
                          part.startsWith("https://") ? (
                            <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline text-primary break-all">
                              {part} <ExternalLink size={10} className="inline" />
                            </a>
                          ) : part
                        )}
                      </div>
                    ) : msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about workouts, diet, equipment..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-10 py-4 text-sm focus:border-primary outline-none text-white placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  >
                    <Mic size={18} />
                  </button>
                </div>
                <button type="submit" className="p-4 bg-primary text-black rounded-2xl hover:scale-105 active:scale-95 transition-all">
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[8px] text-center text-gray-600 uppercase font-black tracking-widest mt-3">
                Developed by Krishna Patil Rajput
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-black rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-4 border-black"
      >
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-black animate-pulse" />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="group-hover:scale-110 transition-transform" />}
      </button>
    </div>
  );
};

export default Chatbot;
