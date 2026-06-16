"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight && height) {
      const hMetres = parseFloat(height) / 100;
      const bmiValue = parseFloat(weight) / (hMetres * hMetres);
      setBmi(parseFloat(bmiValue.toFixed(1)));

      if (bmiValue < 18.5) setMessage("Underweight");
      else if (bmiValue >= 18.5 && bmiValue < 25) setMessage("Healthy Weight");
      else if (bmiValue >= 25 && bmiValue < 30) setMessage("Overweight");
      else setMessage("Obese");
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container">
        <div className="glass rounded-[3.5rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border-white/5">
          <div className="lg:w-1/2 p-10 md:p-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase italic tracking-tighter">Calculate Your <span className="text-primary gold-gradient-text">BMI</span></h2>
            <p className="text-gray-400 mb-12 text-lg leading-relaxed">
              The Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women.
            </p>

            <form onSubmit={calculateBMI} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase mb-3 tracking-[0.2em] text-gray-500">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all duration-300 focus:bg-white/[0.07]"
                    placeholder="e.g. 70"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-3 tracking-[0.2em] text-gray-500">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 focus:border-primary outline-none transition-all duration-300 focus:bg-white/[0.07]"
                    placeholder="e.g. 175"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-lg">Calculate Now</button>
            </form>

            {bmi && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 p-6 bg-primary/10 rounded-2xl border border-primary/20"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-primary uppercase">Your BMI</p>
                    <p className="text-4xl font-black">{bmi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary uppercase">Status</p>
                    <p className="text-2xl font-bold">{message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="lg:w-1/2 relative min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=2085&auto=format&fit=crop"
              alt="BMI"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BMICalculator;
