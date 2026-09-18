"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Plus, SkipForward, Bell, Flame } from "lucide-react";
import { gsap } from "gsap";

interface WorkoutTimerProps {
  initialSeconds?: number;
  onTimerComplete?: () => void;
  onNextExercise?: () => void;
  exerciseName?: string;
  className?: string;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  initialSeconds = 60,
  onTimerComplete,
  onNextExercise,
  exerciseName = "Rest Interval",
  className = "",
}) => {
  const [totalTime, setTotalTime] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"rest" | "set">("rest");

  const circleRef = useRef<SVGCircleElement>(null);
  const timerTextRef = useRef<HTMLSpanElement>(null);

  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  // Sync with initialSeconds
  useEffect(() => {
    setTotalTime(initialSeconds);
    setTimeLeft(initialSeconds);
    setIsActive(false);
  }, [initialSeconds]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            if (onTimerComplete) onTimerComplete();
            try {
              const beep = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
              beep.volume = 0.5;
              beep.play();
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onTimerComplete]);

  // GSAP animation on circular progress
  useEffect(() => {
    if (!circleRef.current) return;
    const progress = timeLeft / (totalTime || 1);
    const strokeDashoffset = circumference - progress * circumference;

    gsap.to(circleRef.current, {
      strokeDashoffset,
      duration: 0.5,
      ease: "power1.out",
    });

    if (timeLeft <= 5 && timeLeft > 0 && timerTextRef.current) {
      gsap.fromTo(
        timerTextRef.current,
        { scale: 1.15, color: "#EF4444" },
        { scale: 1, color: "#FFD700", duration: 0.4 }
      );
    }
  }, [timeLeft, totalTime, circumference]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
  };

  const addSeconds = (secs: number) => {
    setTimeLeft((prev) => prev + secs);
    setTotalTime((prev) => prev + secs);
  };

  const setPreset = (secs: number) => {
    setTotalTime(secs);
    setTimeLeft(secs);
    setIsActive(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div
      className={`glass rounded-3xl p-6 border border-white/10 flex flex-col items-center justify-between relative overflow-hidden bg-gradient-to-b from-[#111111]/90 to-black/80 shadow-2xl ${className}`}
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-500 animate-ping" : "bg-primary"}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            {mode === "rest" ? "Rest Interval" : "Set Timer"}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5 text-[9px] font-bold uppercase">
          <button
            onClick={() => {
              setMode("rest");
              setPreset(60);
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${mode === "rest" ? "bg-primary text-black font-black" : "text-gray-400"}`}
          >
            Rest (60s)
          </button>
          <button
            onClick={() => {
              setMode("set");
              setPreset(45);
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${mode === "set" ? "bg-primary text-black font-black" : "text-gray-400"}`}
          >
            Set (45s)
          </button>
        </div>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative my-2 flex items-center justify-center">
        <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="text-white/5"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            ref={circleRef}
            cx="80"
            cy="80"
            r={radius}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="round"
            stroke={timeLeft <= 5 ? "#EF4444" : "#FFD700"}
            fill="transparent"
            className="transition-colors duration-300"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span
            ref={timerTextRef}
            className="text-4xl font-black font-mono tracking-tighter text-white drop-shadow-[0_0_12px_rgba(255,215,0,0.3)]"
          >
            {formatTime(timeLeft)}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1 max-w-[110px] truncate">
            {exerciseName}
          </span>
        </div>
      </div>

      {/* Quick Interval Adjusters */}
      <div className="flex items-center gap-2 mb-4">
        {[30, 45, 60, 90].map((secs) => (
          <button
            key={secs}
            onClick={() => setPreset(secs)}
            className={`px-3 py-1 rounded-lg text-[10px] font-mono border transition-all ${
              totalTime === secs
                ? "border-primary bg-primary/20 text-primary font-bold"
                : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            {secs}s
          </button>
        ))}
        <button
          onClick={() => addSeconds(15)}
          className="px-2 py-1 rounded-lg text-[10px] border border-white/10 bg-white/5 text-gray-400 hover:text-primary hover:border-primary transition-all flex items-center gap-0.5"
          title="Add 15 seconds"
        >
          <Plus size={12} />
          <span>15s</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="w-full flex items-center justify-center gap-3">
        <button
          onClick={resetTimer}
          className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={toggleTimer}
          className="flex-1 py-3 px-6 rounded-2xl btn-primary flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:scale-102 transition-transform"
        >
          {isActive ? <Pause size={18} /> : <Play size={18} className="fill-current" />}
          <span className="text-xs font-black uppercase italic tracking-widest">
            {isActive ? "Pause Rest" : timeLeft === 0 ? "Restart" : "Start Rest"}
          </span>
        </button>

        {onNextExercise && (
          <button
            onClick={onNextExercise}
            className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 flex items-center justify-center text-primary transition-all"
            title="Next Exercise"
          >
            <SkipForward size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
