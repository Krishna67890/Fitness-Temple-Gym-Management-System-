export const equipmentData = [
  {
    id: "leg-press",
    name: "Leg Press",
    category: "Strength",
    difficulty: "Beginner",
    primaryMuscles: ["Quadriceps"],
    secondaryMuscles: ["Glutes", "Hamstrings"],
    image: "/assets/Fitnesstemple1.jpg",
    description: "The leg press is a fundamental strength training exercise that targets the lower body with precision. Perfect for developing quad strength and muscle hypertrophy.",
    howItWorks: "The leg press uses a guided resistance system that allows users to train the lower body while maintaining a supported body position, reducing spinal load compared to squats.",
    instructions: [
      "Adjust the seat so your knees are at 90 degrees when feet are on platform.",
      "Place feet shoulder-width apart on the platform.",
      "Unlock safety handles and lower platform slowly and controlled.",
      "Push back through your heels, avoid locking knees at the top.",
      "Maintain constant tension throughout the movement."
    ],
    mistakes: ["Locking knees at the top", "Lifting lower back off the seat", "Using too much weight", "Placing feet too low on platform"],
    safetyTips: ["Start with a manageable resistance", "Keep your feet flat on the platform", "Don't lock your knees", "Always use safety hooks"],
    sets: "3-4",
    reps: "10-12",
    rest: "90-120 sec",
    calories: "~120 cal/30 min",
    weight: "50-200 kg adjustable"
  },
  {
    id: "smith-machine",
    name: "Smith Machine",
    category: "Strength",
    difficulty: "Intermediate",
    primaryMuscles: ["Chest", "Quads", "Shoulders"],
    secondaryMuscles: ["Stabilizers", "Glutes"],
    image: "/assets/Fitnesstemple2.jpg",
    description: "A versatile machine for squats, presses, and rows with a guided barbell path. Ideal for isolation movements and safe solo heavy lifting.",
    howItWorks: "Guided bar path ensures stability while allowing for heavy loading across multiple movement patterns without the need for a spotter.",
    instructions: ["Set bar height appropriate for your exercise", "Position yourself centrally under the bar", "Rotate bar to unlock from safety catches", "Maintain controlled path throughout the movement", "Re-rack safely by rotating bar into catches"],
    mistakes: ["Relying too much on the guide for stabilization", "Improper foot positioning for squats", "Not setting safety stops correctly"],
    safetyTips: ["Always engage the safety stops", "Test the rotation lock before adding weight", "Use collars on the bar"],
    sets: "3-5",
    reps: "8-15",
    rest: "60-90 sec",
    calories: "~150 cal/30 min",
    weight: "Bar + up to 200 kg plates"
  },
  {
    id: "bench-press",
    name: "Standard Bench Press",
    category: "Strength",
    difficulty: "Intermediate",
    primaryMuscles: ["Chest"],
    secondaryMuscles: ["Triceps", "Shoulders"],
    image: "/assets/Fitnesstemple3.jpg",
    description: "The ultimate upper body strength builder. The flat bench press is king for building a powerful, thick chest with exceptional pressing strength.",
    howItWorks: "Horizontal pressing movement using a barbell on a flat bench, engaging the pectorals as the primary mover with triceps and deltoids assisting.",
    instructions: ["Lie flat on bench with eyes under the bar", "Grip bar slightly wider than shoulder width", "Unrack the bar with arms extended", "Lower bar slowly to mid-chest with elbows at 45°", "Press up explosively while maintaining back arch"],
    mistakes: ["Bouncing bar off chest", "Flaring elbows too wide", "Lifting hips off bench", "Not using full range of motion"],
    safetyTips: ["Always use a spotter for heavy weights", "Ensure even grip on the bar", "Keep wrists stiff and aligned", "Use J-hooks at proper height"],
    sets: "4-5",
    reps: "6-10",
    rest: "120 sec",
    calories: "~180 cal/30 min",
    weight: "20 kg bar + plates up to 150 kg"
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown Machine",
    category: "Strength",
    difficulty: "Beginner",
    primaryMuscles: ["Lats"],
    secondaryMuscles: ["Biceps", "Upper Back"],
    image: "/assets/Fitnesstemple4.jpg",
    description: "Target your back width with this essential machine. The lat pulldown builds that coveted V-taper and wide, powerful back.",
    howItWorks: "Vertical pulling motion primarily targeting the Latissimus Dorsi through a cable and weight stack system.",
    instructions: ["Sit and secure knees under the knee pad", "Grip bar wider than shoulder-width, overhand", "Pull bar down to upper chest leading with elbows", "Squeeze lats at bottom of movement", "Control the weight back up slowly"],
    mistakes: ["Leaning back too far", "Pulling with arms only", "Not squeezing lats at bottom", "Using momentum to swing"],
    safetyTips: ["Don't jerk the weight", "Keep chest up throughout", "Avoid hyperextending at the top"],
    sets: "3-4",
    reps: "10-12",
    rest: "60-90 sec",
    calories: "~130 cal/30 min",
    weight: "10-100 kg weight stack"
  },
  {
    id: "dumbbells-pro",
    name: "Elite Dumbbell Set",
    category: "Free Weights",
    difficulty: "All Levels",
    primaryMuscles: ["Full Body"],
    secondaryMuscles: ["Stabilizers"],
    image: "/assets/FitnessTempleGym.png",
    description: "Rubber-coated professional dumbbells ranging from 2.5kg to 50kg. Perfect for all fitness levels and isolation exercises.",
    howItWorks: "Isolates muscles and improves stabilizer strength through unilateral training. Allows greater range of motion than barbells.",
    instructions: ["Select appropriate weight for the exercise", "Maintain strict form throughout", "Exhale on exertion phase", "Control the negative/lowering phase", "Never sacrifice form for weight"],
    mistakes: ["Using too much weight", "Swinging the weights for momentum", "Neglecting the weaker side"],
    safetyTips: ["Don't drop weights on floor after use", "Use a spotter for heavy overhead pressing", "Store properly on rack after use"],
    sets: "3-4",
    reps: "8-12",
    rest: "60-90 sec",
    calories: "~100-200 cal/30 min",
    weight: "2.5 kg to 50 kg"
  },
  {
    id: "squat-rack",
    name: "Power Squat Rack",
    category: "Strength",
    difficulty: "Advanced",
    primaryMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    image: "/assets/Fitnesstemple1.jpg",
    description: "The foundation of lower body strength training. The squat rack enables safe heavy squatting and is the cornerstone of any serious strength program.",
    howItWorks: "Compound lower body movement that engages multiple muscle groups simultaneously under a loaded barbell.",
    instructions: ["Set bar at shoulder height on the rack", "Place bar on upper traps, not neck", "Feet slightly wider than shoulder width, toes slightly out", "Sit back and down keeping chest tall", "Drive up through the whole foot, squeeze glutes at top"],
    mistakes: ["Rounding the lower back", "Knees caving inward", "Rising on toes", "Looking down", "Not going to depth"],
    safetyTips: ["Set safety bars at the correct height", "Keep core braced throughout", "Use a spotter for max attempts", "Warm up thoroughly before heavy sets"],
    sets: "4-6",
    reps: "5-8",
    rest: "180 sec",
    calories: "~200 cal/30 min",
    weight: "20 kg bar + up to 300 kg plates"
  },
  {
    id: "treadmill",
    name: "Commercial Treadmill",
    category: "Cardio",
    difficulty: "Beginner",
    primaryMuscles: ["Calves", "Quads", "Glutes"],
    secondaryMuscles: ["Core", "Hip Flexors"],
    image: "/assets/Fitnesstemple2.jpg",
    description: "State-of-the-art commercial treadmill with incline settings up to 15%. Perfect for HIIT, steady-state cardio, and fat burning sessions.",
    howItWorks: "Motorized belt running surface with programmable speed (0–22 km/h) and incline settings. Built-in heart rate monitoring for optimal training zones.",
    instructions: ["Start at a slow walking pace to warm up", "Gradually increase speed as comfortable", "Use incline to simulate outdoor running", "Maintain upright posture, don't grip rails", "Cool down with 5 minutes of walking"],
    mistakes: ["Holding the handrails during running", "Starting too fast", "Not using the safety clip", "Ignoring pain signals"],
    safetyTips: ["Always attach the safety clip to your clothing", "Know the emergency stop button location", "Stay centered on the belt"],
    sets: "1",
    reps: "20-45 min",
    rest: "Ongoing",
    calories: "~300-500 cal/30 min",
    weight: "Speed: 0-22 km/h | Incline: 0-15%"
  },
  {
    id: "cable-crossover",
    name: "Cable Crossover Station",
    category: "Functional",
    difficulty: "Intermediate",
    primaryMuscles: ["Chest", "Shoulders"],
    secondaryMuscles: ["Triceps", "Core"],
    image: "/assets/Fitnesstemple3.jpg",
    description: "Dual cable pulley system for unlimited exercise variations. The most versatile machine in the gym for cable flies, rows, tricep pushdowns and more.",
    howItWorks: "Dual weight stacks with adjustable pulleys (floor to ceiling) connected via cables and handles, allowing constant tension throughout movement.",
    instructions: ["Set pulley height for your exercise", "Select appropriate weight on each stack", "Stand centered between cables", "Perform movement with controlled form", "Use full range of motion"],
    mistakes: ["Uneven cable heights", "Swinging torso", "Too much weight reducing ROM"],
    safetyTips: ["Ensure pulley pins are fully inserted", "Check cable integrity before use", "Stand balanced"],
    sets: "3-4",
    reps: "12-15",
    rest: "60 sec",
    calories: "~100 cal/30 min",
    weight: "2 × 70 kg weight stacks"
  },
  {
    id: "rowing-machine",
    name: "Air Rowing Machine",
    category: "Cardio",
    difficulty: "Beginner",
    primaryMuscles: ["Back", "Biceps"],
    secondaryMuscles: ["Legs", "Core", "Shoulders"],
    image: "/assets/Fitnesstemple4.jpg",
    description: "Full-body cardio powerhouse. Rowing machines engage 86% of all muscle groups and are one of the most calorie-efficient pieces of cardio equipment.",
    howItWorks: "Air resistance flywheel creates resistance proportional to rowing effort. Monitor tracks pace, distance, strokes per minute and calories.",
    instructions: ["Sit with feet in foot straps, strapped firmly", "Start with legs, then lean back, then pull arms", "Return in reverse order: arms, body, legs", "Maintain a ratio of 1:2 drive to recovery", "Keep back straight throughout"],
    mistakes: ["Pulling with arms first", "Hunching the back", "Jerky movements", "Not driving with legs"],
    safetyTips: ["Warm up with easy rows", "Don't over-grip the handle", "Keep core engaged to protect back"],
    sets: "1",
    reps: "15-30 min",
    rest: "Ongoing",
    calories: "~250-400 cal/30 min",
    weight: "Air resistance - self-regulated"
  },
  {
    id: "preacher-curl",
    name: "Preacher Curl Bench",
    category: "Strength",
    difficulty: "Beginner",
    primaryMuscles: ["Biceps"],
    secondaryMuscles: ["Brachialis", "Forearms"],
    image: "/assets/suraj.jpg",
    description: "Isolate and maximize bicep development with the preacher curl bench. Eliminates cheating through strict form enforcement.",
    howItWorks: "Padded arm support holds upper arms at fixed position, isolating biceps without shoulder or body involvement.",
    instructions: ["Adjust pad height so armpits sit at top edge", "Grip EZ bar at natural angle", "Lower weight fully for complete stretch", "Curl up until forearms are vertical", "Squeeze hard at the top of the movement"],
    mistakes: ["Not using full range of motion", "Rushing the repetitions", "Using too heavy weight", "Swinging body"],
    safetyTips: ["Keep elbows on pad throughout", "Don't hyperextend at bottom", "Use controlled movements"],
    sets: "3-4",
    reps: "10-15",
    rest: "60 sec",
    calories: "~80 cal/30 min",
    weight: "Up to 50 kg with EZ bar"
  },
  {
    id: "battle-ropes",
    name: "Battle Ropes",
    category: "Functional",
    difficulty: "Intermediate",
    primaryMuscles: ["Shoulders", "Core"],
    secondaryMuscles: ["Arms", "Back", "Legs"],
    image: "/assets/sanket.jpg",
    description: "High-intensity functional training tool that builds explosive power, cardiovascular endurance and upper body strength simultaneously.",
    howItWorks: "Heavy ropes anchored at one end create waves that require constant muscular effort, providing both resistance and cardio training.",
    instructions: ["Stand with feet shoulder-width, slight squat stance", "Grip rope ends firmly with both hands", "Alternate arms in a wave pattern", "Keep core engaged, spine neutral", "Vary patterns: alternating, bilateral, circles"],
    mistakes: ["Standing too upright without squat stance", "Letting arms go completely straight", "Poor breathing pattern"],
    safetyTips: ["Check anchor point before use", "Start with shorter intervals", "Stay hydrated"],
    sets: "5-8",
    reps: "30-45 sec on, 15 sec off",
    rest: "15-30 sec",
    calories: "~300 cal/30 min",
    weight: "15-20 kg rope"
  },
  {
    id: "spin-bike",
    name: "Spin Bike",
    category: "Cardio",
    difficulty: "All Levels",
    primaryMuscles: ["Quads", "Calves"],
    secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
    image: "/assets/Poonam-ghode.jpg",
    description: "Professional spin bike for intense cycling workouts. Low impact on joints while delivering high caloric burn and excellent cardiovascular benefits.",
    howItWorks: "Heavy flywheel provides smooth, consistent resistance. Fully adjustable seat and handlebar positions accommodate all body types.",
    instructions: ["Adjust seat height — leg slightly bent at lowest point", "Set handlebar height comfortably", "Clip in cycling shoes or use toe cages", "Start at moderate resistance for warm-up", "Alternate between seated and standing climbs"],
    mistakes: ["Seat too low causing knee pain", "Riding too light with bouncing form", "Not engaging core"],
    safetyTips: ["Secure feet before starting", "Always wear proper cycling shoes or secure straps", "Stay hydrated during session"],
    sets: "1",
    reps: "20-60 min",
    rest: "Ongoing",
    calories: "~400-600 cal/30 min",
    weight: "Resistance knob — infinite levels"
  }
];

export const programData = [
  {
    id: "muscle-gain",
    name: "Muscle Building",
    difficulty: "Intermediate",
    duration: "60–75 min",
    calories: "400-600",
    target: "Chest • Back • Shoulders • Arms",
    frequency: "4-5 days/week",
    description: "High-volume hypertrophy training designed to maximize muscle size.",
    goal: "Muscle hypertrophy and strength development"
  },
  {
    id: "fat-loss",
    name: "Fat Loss Blitz",
    difficulty: "Beginner",
    duration: "45–60 min",
    calories: "600-800",
    target: "Full Body",
    frequency: "3-4 days/week",
    description: "High-intensity metabolic conditioning to burn calories and preserve muscle.",
    goal: "Body fat reduction and cardiovascular health"
  }
];

export const faqData = [
  {
    id: 1,
    question: "What are the gym timings?",
    answer: "We are open daily. The evening session starts at 4:30 PM and goes until 10:00 PM.",
    keywords: ["timings", "hours", "open", "close"]
  },
  {
    id: 2,
    question: "Do you provide personal training?",
    answer: "Yes! Coach Suraj and Coach Sanket provide specialized personal training for ₹3000/month.",
    keywords: ["trainer", "personal training", "coach"]
  },
  {
    id: 3,
    question: "Which membership is best for me?",
    answer: "If you're looking for the best value, our Annual Plan at ₹6000 is the most popular choice.",
    keywords: ["membership", "plan", "price", "cost"]
  },
  {
    id: 4,
    question: "I am a beginner. Where should I start?",
    answer: "Welcome! We recommend starting with a Full-body strength program. Use our 'Build Workout' tool or ask a trainer for a demo.",
    keywords: ["beginner", "start", "new"]
  }
];

export const trainerData = [
  {
    id: "suraj",
    name: "Suraj",
    specialty: "Bodybuilding & Weight Loss",
    experience: "8+ Years",
    rating: 4.9,
    image: "/assets/suraj.jpg",
    certifications: ["K11 Certified", "Nutrition Specialist"],
    philosophy: "Consistency over intensity. Your body is a temple, treat it with respect."
  },
  {
    id: "sanket",
    name: "Sanket",
    specialty: "Strength & Conditioning",
    experience: "6+ Years",
    rating: 4.8,
    image: "/assets/sanket.jpg",
    certifications: ["ACE Certified", "Powerlifting Coach"],
    philosophy: "Move well, then move heavy. Mechanics before intensity."
  }
];

export const membershipData = [
  {
    id: "monthly",
    name: "Monthly Warrior",
    price: 700,
    duration: "1 Month",
    features: ["Full Gym Access", "Evening Sessions", "Basic Locker Access", "Free Trial Session"],
    recommendedFor: ["Beginners", "Short-term goals"]
  },
  {
    id: "quarterly",
    name: "3-Month Pro",
    price: 1800,
    duration: "3 Months",
    features: ["Full Gym Access", "Personal Training Intro", "Basic Locker Access", "Diet Guidance"],
    recommendedFor: ["Intermediate", "Foundation building"]
  },
  {
    id: "annual",
    name: "Annual Temple Member",
    price: 6000,
    duration: "12 Months",
    features: ["All Monthly Features", "Personal Training Discount", "Priority Support", "Free Diet Chart", "Legacy Member Status"],
    recommendedFor: ["Serious Athletes", "Long-term transformation"]
  }
];

export const challengeData = [
  {
    id: "squat-100",
    name: "100 Squats Challenge",
    target: 100,
    unit: "Squats",
    xp: 50,
    description: "Do 100 bodyweight squats today!"
  },
  {
    id: "plank-3",
    name: "3 Minute Plank",
    target: 180,
    unit: "Seconds",
    xp: 40,
    description: "Hold a plank for a total of 3 minutes."
  }
];

export const scheduleData = [
  {
    day: "Monday",
    classes: [
      { time: "05:00 PM", name: "Power Lifting", trainer: "Sanket", intensity: "High" },
      { time: "07:00 PM", name: "HIIT Circuit", trainer: "Suraj", intensity: "Extreme" }
    ]
  },
  {
    day: "Tuesday",
    classes: [
      { time: "06:00 PM", name: "Bodybuilding 101", trainer: "Suraj", intensity: "Medium" },
      { time: "08:00 PM", name: "Core Blast", trainer: "Sanket", intensity: "High" }
    ]
  },
  {
    day: "Wednesday",
    classes: [
      { time: "05:30 PM", name: "Leg Day Special", trainer: "Sanket", intensity: "Extreme" },
      { time: "07:30 PM", name: "Cardio Kickbox", trainer: "Suraj", intensity: "High" }
    ]
  },
  {
    day: "Thursday",
    classes: [
      { time: "06:00 PM", name: "Upper Body Hypertrophy", trainer: "Suraj", intensity: "High" },
      { time: "08:00 PM", name: "Mobility & Flow", trainer: "Sanket", intensity: "Low" }
    ]
  },
  {
    day: "Friday",
    classes: [
      { time: "05:00 PM", name: "Functional Strength", trainer: "Sanket", intensity: "High" },
      { time: "07:00 PM", name: "Friday Night Shred", trainer: "Suraj", intensity: "Extreme" }
    ]
  },
  {
    day: "Saturday",
    classes: [
      { time: "05:30 PM", name: "Full Body Warrior", trainer: "Suraj", intensity: "Extreme" },
      { time: "07:00 PM", name: "Recovery Session", trainer: "Sanket", intensity: "Low" }
    ]
  }
];

// Real reviews are fetched dynamically from Firestore 'reviews' collection.
// Zero fake reviews allowed.
export const reviewsData: any[] = [];

