"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Volume2, VolumeX, Mic, ExternalLink, Dumbbell, CreditCard, Calendar, Info, Award } from "lucide-react";

import { equipmentData, trainerData, faqData, programData, membershipData } from "@/lib/gymData";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Welcome to Fitness Temple 💪\n\nI am your Personal Fitness Assistant. How can I help you build your temple today?", actions: true }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Book Free Trial", value: "How do I book a trial?", icon: Calendar },
    { label: "View Memberships", value: "Which membership is best for me?", icon: CreditCard },
    { label: "Find Equipment", value: "Show me your equipment", icon: Dumbbell },
    { label: "Build Workout", value: "I want a workout plan", icon: Award },
    { label: "Ask a Question", value: "I have a question", icon: MessageSquare }
  ];

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

    // Membership wizard trigger
    if (q.includes("which membership") || q.includes("best plan") || q.includes("recommend a plan")) {
      return "I can help you choose! Are you a beginner, intermediate, or advanced athlete? Also, how many days a week do you plan to train?";
    }

    // Membership check
    if (q.includes("membership") || q.includes("price") || q.includes("fee") || q.includes("cost") || q.includes("plan")) {
      const plans = membershipData.map(p => `${p.name}: ₹${p.price}/${p.duration}`).join("\n");
      return `We have several options for you:\n\n${plans}\n\nWould you like me to recommend the best one for your goals?`;
    }

    // Equipment check
    if (q.includes("equipment") || q.includes("machine") || q.includes("what do you have")) {
      const items = equipmentData.slice(0, 6).map(e => `• ${e.name}`).join("\n");
      return `Our arsenal includes professional-grade equipment like:\n\n${items}\n\n...and much more. Which muscle group are you focusing on?`;
    }

    // Search specific equipment or muscle
    for (const eq of equipmentData) {
      if (q.includes(eq.name.toLowerCase()) || eq.primaryMuscles.some(m => q.includes(m.toLowerCase()))) {
        return `For ${eq.primaryMuscles[0]}, the ${eq.name} is excellent. It's a ${eq.category} machine.\n\nRecommended: ${eq.sets} sets of ${eq.reps}.\n\nWould you like to see how to use it?`;
      }
    }

    // Workout builder trigger
    if (q.includes("workout plan") || q.includes("routine") || q.includes("create workout") || q.includes("build workout")) {
      return "I'd love to build a workout for you! 💪\n\nWhat is your primary goal? (Build Muscle, Lose Fat, or Strength)";
    }

    // Trainer check
    if (q.includes("trainer") || q.includes("coach") || q.includes("personal training")) {
      const trainers = trainerData.map(t => `• ${t.name} (${t.specialty})`).join("\n");
      return `Our expert trainers are here to guide you:\n\n${trainers}\n\nPersonal training starts at ₹3000/month. Would you like to book a consultation?`;
    }

    // Specific Goal advice: Beginner + Muscle
    if ((q.includes("beginner") || q.includes("start")) && (q.includes("muscle") || q.includes("gain"))) {
      return "Welcome to Fitness Temple 💪\n\nFor a beginner focused on muscle growth, start with 3–4 training days per week.\n\nRecommended path:\n1. Full-body strength training\n2. Controlled weights\n3. 8–12 repetitions\n4. 60–90 seconds rest\n\nRecommended equipment: Smith Machine, Chest Press, Lat Pulldown.\n\nWould you like me to create a beginner muscle-building workout?";
    }

    // Goal recommendations
    if (q.includes("muscle") || q.includes("gain") || q.includes("bulk")) {
      const p = programData.find(p => p.id === "muscle-gain");
      return `For muscle growth, we recommend our ${p?.name} program. ${p?.description} Targets: ${p?.target}.`;
    }
    if (q.includes("fat") || q.includes("weight") || q.includes("loss") || q.includes("cut")) {
      const p = programData.find(p => p.id === "fat-loss");
      return `For fat loss, our ${p?.name} is perfect. ${p?.description} It's high-intensity and targets ${p?.target}.`;
    }

    // Timings
    if (q.includes("timing") || q.includes("open") || q.includes("hours") || q.includes("close")) {
      return "We are open daily. Our main evening session starts at 4:30 PM and goes until 10:00 PM. Perfect for after-work warriors!";
    }

    // FAQ matching
    for (const faq of faqData) {
      if (q.includes(faq.question.toLowerCase().replace("?", ""))) {
        return faq.answer;
      }
    }

    // Fallback/Escalation
    if (q.length > 5) {
      return "I want to make sure you get the right answer. Would you like to speak with a trainer, call the gym, or see our contact form?";
    }

    return "I'm here to help you reach your goals! You can ask about our memberships, trainers, equipment, or workout tips.";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text: text, actions: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const response = getBotResponse(text);
      setMessages(prev => [...prev, { role: "bot", text: response, actions: false }]);
      speak(response);
    }, 600);
  };

  const handleAction = (value: string) => {
    handleSend(value);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass w-[400px] h-[600px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden mb-6 border-primary/20 bg-black/95 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary via-yellow-500 to-yellow-600 p-7 flex justify-between items-center text-black">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="bg-black p-2.5 rounded-2xl border border-black/20 shadow-lg">
                    <Bot size={28} className="text-primary" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-base italic tracking-tight leading-none mb-1">Temple Support</h4>
                  <p className="text-[10px] font-black uppercase opacity-70 tracking-widest leading-none">Always Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2.5 hover:bg-black/10 rounded-xl transition-colors"
                  title={voiceEnabled ? "Disable Voice" : "Enable Voice"}
                >
                  {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2.5 hover:bg-black/10 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-[14px] leading-relaxed shadow-xl ${
                    msg.role === "user"
                      ? "bg-primary text-black font-bold rounded-tr-none"
                      : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none"
                  }`}>
                    {msg.text.split('\n').map((line, j) => (
                      <p key={j} className={line === "" ? "h-2" : ""}>{line}</p>
                    ))}
                  </div>

                  {msg.role === 'bot' && msg.actions && (
                     <div className="grid grid-cols-1 gap-2 w-full mt-4">
                        {quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAction(action.value)}
                            className="flex items-center gap-3 w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-primary hover:text-black transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-black group-hover:text-primary transition-all">
                              <action.icon size={16} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">{action.label}</span>
                          </button>
                        ))}
                     </div>
                  )}

                  {msg.text.includes("speak with a trainer") && (
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-2 bg-green-500 text-black text-[10px] font-black uppercase rounded-lg">WhatsApp</button>
                      <button className="px-4 py-2 bg-primary text-black text-[10px] font-black uppercase rounded-lg">Call Gym</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-6 border-t border-white/5 bg-black/50 backdrop-blur-xl">
              <div className="relative flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="How can we help?"
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-primary outline-none text-white placeholder:text-gray-600 font-medium"
                />
                <button type="submit" className="p-4 bg-primary text-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  <Send size={20} />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">
                 <Info size={10} /> Powered by Fitness Temple Intelligence
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 bg-primary text-black rounded-[2rem] shadow-[0_0_50px_rgba(255,215,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative border-4 border-black overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        {isOpen ? <X size={32} /> : (
          <div className="relative">
            <MessageSquare size={32} className="group-hover:rotate-12 transition-transform" />
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-500 rounded-full border-4 border-black flex items-center justify-center text-[10px] font-black text-white">1</div>
          </div>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
