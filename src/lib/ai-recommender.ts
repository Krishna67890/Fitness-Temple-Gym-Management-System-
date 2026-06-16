export interface UserStats {
  weight: number;
  height: number;
  age: number;
  goal: "weight-loss" | "muscle-gain" | "maintenance";
  activityLevel: "sedentary" | "moderate" | "active";
}

export const generateRecommendations = (stats: UserStats) => {
  const { weight, height, age, goal, activityLevel } = stats;

  // Calculate BMR (Mifflin-St Jeor Equation)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Assuming male for simplicity, +5 for male, -161 for female

  let tdeeMultiplier = 1.2;
  if (activityLevel === "moderate") tdeeMultiplier = 1.55;
  if (activityLevel === "active") tdeeMultiplier = 1.725;

  const tdee = bmr * tdeeMultiplier;

  let targetCalories = tdee;
  let protein = weight * 1.8;
  let carbs = (tdee * 0.4) / 4;
  let fats = (tdee * 0.25) / 9;

  if (goal === "weight-loss") {
    targetCalories = tdee - 500;
    protein = weight * 2.2;
  } else if (goal === "muscle-gain") {
    targetCalories = tdee + 300;
    protein = weight * 2.0;
  }

  return {
    calories: Math.round(targetCalories),
    macros: {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    },
    suggestion: getTip(goal),
  };
};

const getTip = (goal: string) => {
  const tips = {
    "weight-loss": "Focus on high-volume, low-calorie foods like leafy greens. Increase NEAT (Non-Exercise Activity Thermogenesis) by walking more.",
    "muscle-gain": "Prioritize progressive overload in your lifts. Ensure you're getting enough sleep for muscle recovery.",
    "maintenance": "Focus on refining your technique and improving cardiovascular health.",
  };
  return tips[goal as keyof typeof tips] || tips.maintenance;
};
