import { EquipmentType } from "@/components/portal/GymEquipment3D";
import { ExerciseDemoType } from "@/components/portal/FitnessAvatar3D";

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipmentName: EquipmentType;
  sets: number;
  reps: string;
  targetWeight: string;
  restSecs: number;
  notes: string;
}

export interface Meal {
  time: string;
  name: string;
  items: string;
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
}

export interface DailyRoutine {
  dayKey: string;
  dayName: string;
  focus: string;
  intensity: string;
  trainerTip: string;
  equipment: EquipmentType;
  avatarDemo: ExerciseDemoType;
  exercises: Exercise[];
  meals: Meal[];
}

export const WEEKLY_ROUTINES: Record<string, DailyRoutine> = {
  MON: {
    dayKey: "MON",
    dayName: "Monday",
    focus: "Chest & Triceps Hypertrophy",
    intensity: "90% Max Effort",
    trainerTip: "Keep shoulders retracted and maintain a 3-second eccentric lower on all pressing motions.",
    equipment: "bench-press",
    avatarDemo: "bench-press",
    exercises: [
      { id: "e1", name: "Barbell Bench Press", muscle: "Chest / Front Delts", equipmentName: "bench-press", sets: 4, reps: "12, 10, 8, 6", targetWeight: "70 kg", restSecs: 75, notes: "Retract scapula, drive with heels, 2-sec eccentric phase" },
      { id: "e2", name: "Incline Dumbbell Press", muscle: "Upper Chest", equipmentName: "dumbbells", sets: 3, reps: "10-12", targetWeight: "24 kg", restSecs: 60, notes: "30-degree incline, full stretch at the bottom" },
      { id: "e3", name: "Cable Chest Flyes", muscle: "Pectoralis Major", equipmentName: "cable-machine", sets: 3, reps: "15", targetWeight: "15 kg", restSecs: 45, notes: "Squeeze chest at peak contraction for 1 second" },
      { id: "e4", name: "Triceps Rope Pushdown", muscle: "Triceps Lateral Head", equipmentName: "cable-machine", sets: 4, reps: "12", targetWeight: "25 kg", restSecs: 45, notes: "Flave rope outward at full extension" },
      { id: "e_chest_1", name: "Dumbbell Pullover", muscle: "Upper Chest / Lats", equipmentName: "dumbbells", sets: 3, reps: "12", targetWeight: "22 kg", restSecs: 60, notes: "Focus on stretching the chest at the bottom" },
      { id: "e_tricep_2", name: "Skull Crushers", muscle: "Triceps Long Head", equipmentName: "barbell", sets: 3, reps: "10", targetWeight: "25 kg", restSecs: 60, notes: "Keep elbows tucked and fixed" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Oats with skim milk, 4 egg whites, 1 banana, almonds", calories: 540, protein: "32g", carbs: "68g", fats: "14g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Greek yogurt with mixed berries, green tea", calories: 210, protein: "18g", carbs: "24g", fats: "4g" },
      { time: "01:30 PM", name: "Lunch", items: "Brown rice (150g), grilled chicken breast or paneer, mixed salad", calories: 620, protein: "44g", carbs: "70g", fats: "16g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Whole wheat toast with peanut butter, black coffee", calories: 280, protein: "10g", carbs: "34g", fats: "11g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey isolate shake with creatine monohydrate", calories: 160, protein: "27g", carbs: "4g", fats: "2g" },
      { time: "09:00 PM", name: "Dinner", items: "Grilled fish or soya chunks, steamed broccoli, sweet potato", calories: 510, protein: "38g", carbs: "52g", fats: "12g" },
      { time: "10:30 PM", name: "Night Fuel", items: "Casein protein or 100g cottage cheese", calories: 120, protein: "20g", carbs: "4g", fats: "3g" },
    ],
  },
  TUE: {
    dayKey: "TUE",
    dayName: "Tuesday",
    focus: "Back & Biceps Power Split",
    intensity: "88% Max Effort",
    trainerTip: "Initiate the pull from your elbows, squeezing the shoulder blades together at peak contraction.",
    equipment: "lat-pulldown",
    avatarDemo: "lat-pulldown",
    exercises: [
      { id: "e5", name: "Lat Pulldown (Wide Grip)", muscle: "Latissimus Dorsi", equipmentName: "lat-pulldown", sets: 4, reps: "10-12", targetWeight: "55 kg", restSecs: 60, notes: "Drive elbows down and back, do not swing torso" },
      { id: "e6", name: "Barbell Bent-Over Row", muscle: "Mid Back / Rhomboids", equipmentName: "barbell", sets: 4, reps: "8-10", targetWeight: "60 kg", restSecs: 75, notes: "Maintain neutral spine, pull towards belly button" },
      { id: "e7", name: "Seated Cable Row", muscle: "Lower Lat / Middle Traps", equipmentName: "row-machine", sets: 3, reps: "12", targetWeight: "50 kg", restSecs: 60, notes: "Full stretch on release, tight squeeze" },
      { id: "e8", name: "Standing Barbell Bicep Curl", muscle: "Biceps Brachii", equipmentName: "barbell", sets: 4, reps: "10-12", targetWeight: "30 kg", restSecs: 45, notes: "Pin elbows to ribs, prevent shoulder recruitment" },
      { id: "e_back_1", name: "Single Arm DB Row", muscle: "Lats / Rhomboids", equipmentName: "dumbbells", sets: 3, reps: "12 each", targetWeight: "24 kg", restSecs: 45, notes: "Full extension at the bottom" },
      { id: "e_bicep_2", name: "Hammer Curls", muscle: "Brachialis / Forearms", equipmentName: "dumbbells", sets: 3, reps: "12", targetWeight: "14 kg", restSecs: 45, notes: "Controlled movement, no swinging" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Scrambled eggs, whole grain toast, apple, chia seeds", calories: 520, protein: "30g", carbs: "60g", fats: "16g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Sprouted moong salad with lemon & cucumber", calories: 190, protein: "14g", carbs: "28g", fats: "2g" },
      { time: "01:30 PM", name: "Lunch", items: "Quinoa bowl with paneer cubes, dal, green leafy veggies", calories: 590, protein: "36g", carbs: "68g", fats: "18g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Banana with 10 almonds & beetroot juice", calories: 230, protein: "6g", carbs: "42g", fats: "7g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey protein shake with chilled water", calories: 150, protein: "26g", carbs: "3g", fats: "2g" },
      { time: "09:00 PM", name: "Dinner", items: "Paneer tikka or grilled chicken, sautéed beans, roti", calories: 480, protein: "34g", carbs: "45g", fats: "14g" },
      { time: "10:30 PM", name: "Night Fuel", items: "Handful of walnuts with warm milk", calories: 180, protein: "8g", carbs: "12g", fats: "12g" },
    ],
  },
  WED: {
    dayKey: "WED",
    dayName: "Wednesday",
    focus: "Leg Day & Quadriceps Blast",
    intensity: "95% Max Effort",
    trainerTip: "Drive knees outwards over toes during squats. Maintain brace in the abdominal wall.",
    equipment: "squat-rack",
    avatarDemo: "squat",
    exercises: [
      { id: "e9", name: "Barbell Back Squat", muscle: "Quadriceps / Glutes", equipmentName: "squat-rack", sets: 5, reps: "12, 10, 8, 6, 6", targetWeight: "85 kg", restSecs: 90, notes: "Descend below parallel, chest up, brace core" },
      { id: "e10", name: "Leg Press 45-Degree", muscle: "Quads & Hamstrings", equipmentName: "leg-press", sets: 4, reps: "12", targetWeight: "140 kg", restSecs: 75, notes: "Do not lock knees at top of movement" },
      { id: "e11", name: "Walking Dumbbell Lunges", muscle: "Glutes & Stabilizers", equipmentName: "dumbbells", sets: 3, reps: "20 steps", targetWeight: "16 kg each", restSecs: 60, notes: "90-degree knee bend on each forward step" },
      { id: "e12", name: "Standing Calf Raises", muscle: "Gastrocnemius", equipmentName: "squat-rack", sets: 4, reps: "15-20", targetWeight: "60 kg", restSecs: 45, notes: "Hold stretch at bottom, peak squeeze at top" },
      { id: "e_leg_1", name: "Leg Extensions", muscle: "Quadriceps Isolation", equipmentName: "leg-press", sets: 3, reps: "15", targetWeight: "40 kg", restSecs: 45, notes: "Hold for 1 sec at peak contraction" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Peanut butter banana oats with 3 boiled eggs", calories: 580, protein: "34g", carbs: "74g", fats: "18g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Handful of walnuts, roasted chana & tender coconut water", calories: 240, protein: "11g", carbs: "30g", fats: "9g" },
      { time: "01:30 PM", name: "Lunch", items: "Chicken biryani (low oil) or Soy chunk pulao with raita", calories: 650, protein: "42g", carbs: "82g", fats: "15g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Boiled sweet potatoes with pinch of pink salt", calories: 220, protein: "4g", carbs: "48g", fats: "1g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey isolate shake + 1 rice cake with honey", calories: 210, protein: "27g", carbs: "22g", fats: "1g" },
      { time: "09:00 PM", name: "Dinner", items: "Grilled tofu or chicken breast with stir-fried veggies", calories: 490, protein: "39g", carbs: "40g", fats: "13g" },
      { time: "10:30 PM", name: "Night Fuel", items: "1 glass turmeric milk (Golden Milk)", calories: 150, protein: "8g", carbs: "15g", fats: "6g" },
    ],
  },
  THU: {
    dayKey: "THU",
    dayName: "Thursday",
    focus: "Shoulders & Trap Overload",
    intensity: "85% Max Effort",
    trainerTip: "Keep elbows slightly in front of the body on lateral raises to isolate the side deltoid completely.",
    equipment: "shoulder-press",
    avatarDemo: "shoulder-press",
    exercises: [
      { id: "e13", name: "Overhead Barbell Military Press", muscle: "Anterior & Lateral Deltoids", equipmentName: "barbell", sets: 4, reps: "8-10", targetWeight: "45 kg", restSecs: 75, notes: "Strict form, lock core, press directly overhead" },
      { id: "e14", name: "Dumbbell Lateral Raises", muscle: "Lateral Deltoids (Boulder Cap)", equipmentName: "dumbbells", sets: 4, reps: "12-15", targetWeight: "10 kg", restSecs: 45, notes: "Lead with elbows, slight forward torso lean" },
      { id: "e15", name: "Face Pulls with Rope", muscle: "Rear Delts / Rotator Cuff", equipmentName: "cable-machine", sets: 4, reps: "15", targetWeight: "20 kg", restSecs: 45, notes: "Pull towards eyes, externally rotate shoulders" },
      { id: "e16", name: "Dumbbell Shrugs", muscle: "Upper Trapezius", equipmentName: "dumbbells", sets: 4, reps: "12", targetWeight: "28 kg each", restSecs: 45, notes: "Straight up elevation, pause for 2 seconds at top" },
      { id: "e_shoulder_1", name: "Front Plate Raises", muscle: "Anterior Deltoids", equipmentName: "barbell", sets: 3, reps: "12", targetWeight: "15 kg", restSecs: 45, notes: "Control the weight on the way down" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Omelette (3 whole + 2 whites) with spinach and toast", calories: 510, protein: "33g", carbs: "42g", fats: "21g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Whey protein with water + handful of almonds", calories: 230, protein: "29g", carbs: "6g", fats: "10g" },
      { time: "01:30 PM", name: "Lunch", items: "Steamed rice, chicken curry or rajma masala, green salad", calories: 600, protein: "38g", carbs: "75g", fats: "15g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Apple slices with peanut butter", calories: 200, protein: "5g", carbs: "28g", fats: "9g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Electrolyte hydration mix + whey protein", calories: 170, protein: "26g", carbs: "12g", fats: "1g" },
      { time: "09:00 PM", name: "Dinner", items: "Grilled fish or paneer, asparagus and pumpkin soup", calories: 460, protein: "36g", carbs: "35g", fats: "14g" },
      { time: "10:30 PM", name: "Night Fuel", items: "Greek yogurt with a hint of honey", calories: 140, protein: "12g", carbs: "18g", fats: "2g" },
    ],
  },
  FRI: {
    dayKey: "FRI",
    dayName: "Friday",
    focus: "Deadlift & Posterior Chain Conditioning",
    intensity: "90% Max Effort",
    trainerTip: "Perform curls and extensions back-to-back as supersets for massive blood volume pump.",
    equipment: "barbell",
    avatarDemo: "deadlift",
    exercises: [
      { id: "e17", name: "Conventional Barbell Deadlift", muscle: "Erectors, Hamstrings, Glutes", equipmentName: "barbell", sets: 4, reps: "8, 6, 4, 2", targetWeight: "110 kg", restSecs: 120, notes: "Push the floor away, hip extension at lockout" },
      { id: "e18", name: "Romanian Deadlift (Dumbbells)", muscle: "Hamstring Deep Stretch", equipmentName: "dumbbells", sets: 3, reps: "10-12", targetWeight: "26 kg each", restSecs: 60, notes: "Hinge at hips, soft knees, feel hamstring tension" },
      { id: "e19", name: "Seated Hamstring Leg Curls", muscle: "Biceps Femoris", equipmentName: "leg-press", sets: 3, reps: "12-15", targetWeight: "45 kg", restSecs: 45, notes: "Controlled negative, don't let weight slam" },
      { id: "e20", name: "Hanging Leg Raises", muscle: "Core & Rectus Abdominis", equipmentName: "lat-pulldown", sets: 3, reps: "15", targetWeight: "Bodyweight", restSecs: 45, notes: "Roll pelvis upward, avoid swinging" },
      { id: "e_abs_1", name: "Plank to Failure", muscle: "Core Stability", equipmentName: "dumbbells", sets: 3, reps: "Failure", targetWeight: "Bodyweight", restSecs: 60, notes: "Keep back flat, engage glutes" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Muesli with milk, pumpkin seeds, whey scoop, berries", calories: 530, protein: "35g", carbs: "65g", fats: "14g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Boiled egg chaat with tomatoes and cilantro", calories: 180, protein: "13g", carbs: "8g", fats: "10g" },
      { time: "01:30 PM", name: "Lunch", items: "Brown rice with grilled chicken or dal makhani (light)", calories: 590, protein: "40g", carbs: "70g", fats: "14g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Black coffee + 2 dates + dark chocolate piece", calories: 160, protein: "2g", carbs: "32g", fats: "4g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey protein shake with creatine", calories: 150, protein: "27g", carbs: "4g", fats: "1g" },
      { time: "09:00 PM", name: "Dinner", items: "Egg bhurji or sautéed paneer with 2 rotis and cucumber", calories: 470, protein: "32g", carbs: "46g", fats: "14g" },
      { time: "10:30 PM", name: "Night Fuel", items: "Casein protein shake", calories: 120, protein: "25g", carbs: "3g", fats: "1g" },
    ],
  },
  SAT: {
    dayKey: "SAT",
    dayName: "Saturday",
    focus: "Cardio HIIT & Functional Endurance",
    intensity: "92% Max Effort",
    trainerTip: "Maintain high tempo with minimum transition rest. Breathe deeply through the diaphragm.",
    equipment: "treadmill",
    avatarDemo: "lunge",
    exercises: [
      { id: "e21", name: "Interval Treadmill Sprints", muscle: "Cardiovascular System", equipmentName: "treadmill", sets: 8, reps: "30s sprint / 60s walk", targetWeight: "Speed 14 km/h", restSecs: 60, notes: "All-out high-cadence sprint on 2% incline" },
      { id: "e22", name: "Dumbbell Walking Lunges", muscle: "Legs & Core Dynamic Balance", equipmentName: "dumbbells", sets: 3, reps: "20 steps", targetWeight: "14 kg", restSecs: 45, notes: "Keep torso upright and brace" },
      { id: "e23", name: "Push-ups to Failure", muscle: "Chest & Shoulders", equipmentName: "bench-press", sets: 3, reps: "To failure (~25)", targetWeight: "Bodyweight", restSecs: 45, notes: "Full range of motion, touch chest to floor" },
      { id: "e24", name: "Cable Core Woodchops", muscle: "Obliques & Transverse Abdominis", equipmentName: "cable-machine", sets: 3, reps: "15 each side", targetWeight: "18 kg", restSecs: 30, notes: "Rotate with core, not arms" },
      { id: "e_cardio_1", name: "Battle Ropes", muscle: "Full Body / Cardio", equipmentName: "cable-machine", sets: 4, reps: "45 seconds", targetWeight: "Heavy", restSecs: 45, notes: "Maintain high intensity" },
    ],
    meals: [
      { time: "07:30 AM", name: "Breakfast", items: "Avocado toast with poached eggs and orange juice", calories: 500, protein: "22g", carbs: "52g", fats: "22g" },
      { time: "11:00 AM", name: "Mid-Morning", items: "Protein bar or roasted almonds with green tea", calories: 210, protein: "15g", carbs: "18g", fats: "8g" },
      { time: "01:30 PM", name: "Lunch", items: "Grilled chicken sandwich or veg paneer wrap in multigrain", calories: 560, protein: "36g", carbs: "60g", fats: "16g" },
      { time: "05:00 PM", name: "Pre-Workout", items: "Hydration electrolytes + 1 banana", calories: 120, protein: "1g", carbs: "28g", fats: "0g" },
      { time: "07:30 PM", name: "Post-Workout", items: "Whey protein with chilled almond milk", calories: 170, protein: "28g", carbs: "6g", fats: "3g" },
      { time: "09:00 PM", name: "Dinner", items: "Clear chicken or mushroom soup, grilled salmon or paneer", calories: 440, protein: "38g", carbs: "20g", fats: "18g" },
      { time: "10:30 PM", name: "Night Fuel", items: "A cup of Chamomile tea with 2 walnuts", calories: 60, protein: "2g", carbs: "4g", fats: "5g" },
    ],
  },
  SUN: {
    dayKey: "SUN",
    dayName: "Sunday",
    focus: "Active Recovery & Mobility Flow",
    intensity: "60% Restorative",
    trainerTip: "Hydrate heavily with electrolytes today. Prepare your central nervous system for Monday's push.",
    equipment: "dumbbells",
    avatarDemo: "bicep-curl",
    exercises: [
      { id: "e25", name: "Light Foam Rolling & Myofascial Release", muscle: "Full Body Fascia", equipmentName: "dumbbells", sets: 1, reps: "15 mins", targetWeight: "N/A", restSecs: 0, notes: "Target IT bands, lats, thoracic spine, calves" },
      { id: "e26", name: "Dynamic Yoga Flow & Hip Openers", muscle: "Flexibility & Joint Capsule", equipmentName: "dumbbells", sets: 1, reps: "20 mins", targetWeight: "N/A", restSecs: 0, notes: "Pigeon pose, world greatest stretch, cat-cow" },
      { id: "e27", name: "Zone 2 Incline Treadmill Walk", muscle: "Aerobic Recovery", equipmentName: "treadmill", sets: 1, reps: "30 mins", targetWeight: "Incline 6%, Speed 5.5", restSecs: 0, notes: "Heart rate between 115-130 bpm" },
    ],
    meals: [
      { time: "08:30 AM", name: "Breakfast", items: "Whole grain pancakes with blueberries and honey", calories: 510, protein: "18g", carbs: "78g", fats: "12g" },
      { time: "11:30 AM", name: "Mid-Morning", items: "Fresh watermelon juice with chia seeds", calories: 140, protein: "3g", carbs: "30g", fats: "1g" },
      { time: "02:00 PM", name: "Lunch", items: "Home-style balanced thali (dal, sabzi, 2 rotis, curd, salad)", calories: 580, protein: "24g", carbs: "80g", fats: "16g" },
      { time: "05:30 PM", name: "Snack", items: "Roasted makhana (foxnuts) with green tea", calories: 150, protein: "4g", carbs: "24g", fats: "3g" },
      { time: "08:30 PM", name: "Dinner", items: "Vegetable khichdi with ghee or light grilled chicken salad", calories: 430, protein: "22g", carbs: "55g", fats: "12g" },
    ],
  },
};
