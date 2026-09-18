import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { searchFood } from '../lib/usda';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface UserDashboardProps {
  user: User | null;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const [profile, setProfile] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState<any[]>([]);
  const [weightInput, setWeightInput] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [photoIds, setPhotoIds] = useState<string[]>([]);
  const [weightHistory, setWeightHistory] = useState<any[]>([]);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('100');

  const [caloriesInput, setCaloriesInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatInput, setFatInput] = useState('');
  const [foodLogs, setFoodLogs] = useState<any[]>([]);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [aiPlan, setAiPlan] = useState<any>(null);
  const [exerciseWeights, setExerciseWeights] = useState<Record<string, string>>({});
  const [exerciseReps, setExerciseReps] = useState<Record<string, string>>({});

const autoFillFood = async (food: string) => {
  if (!food) return;

  try {
    const data = await searchFood(food);

    if (data.foods && data.foods.length > 0) {
      const item = data.foods[0];

      const qty = Math.max(1, Number(quantity) || 100);
      const multiplier = qty / 100;
      console.log("FIRST FOOD:", item);
      
      const nutrients = item.foodNutrients || [];

const getNutrient = (...names: string[]) => {
  const nutrient = nutrients.find(
    (n: any) => names.includes(n.nutrientName)
  );
  return nutrient?.value || 0;
};

const calories =
  getNutrient('Energy', 'Energy (Atwater General)') * multiplier;

const protein =
  getNutrient('Protein') * multiplier;

const carbs =
  getNutrient(
    'Carbohydrate, by difference',
    'Carbohydrate'
  ) * multiplier;

const fat =
  getNutrient(
    'Total lipid (fat)',
    'Total Fat'
  ) * multiplier;

setCaloriesInput(String(Math.round(calories)));
setProteinInput(protein.toFixed(1));
setCarbsInput(carbs.toFixed(1));
setFatInput(fat.toFixed(1));
   
    }
  } catch (error) {
    console.error(error);
  }
};
  

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) {
  setProfile(data);

  console.log("USER PROFILE:", data);
// Check active Pro subscription
const { data: subscription, error: subscriptionError } =
  await supabase
    .from("subscriptions")
    .select("id, plan_name, status, end_date")
    .eq("user_id", user.id)
    .eq("status", "active")
    .gt("end_date", new Date().toISOString())
    .order("end_date", { ascending: false })
    .limit(1)
    .maybeSingle();

if (subscriptionError) {
  console.error(
    "Subscription check error:",
    subscriptionError
  );
}

// Check 7-day free trial
const { data: trialProfile, error: trialError } =
  await supabase
    .from("user_profiles")
    .select("trial_start_date, trial_end_date")
    .eq("id", user.id)
    .maybeSingle();

if (trialError) {
  console.error("Trial check error:", trialError);
}

const trialActive =
  !!trialProfile?.trial_end_date &&
  new Date(trialProfile.trial_end_date) > new Date();

setIsPro(!!subscription || trialActive);


  await loadAIPlan();
  await loadFoodLogs();


        const { data: transformationPhotos, error: photoError } =
  await supabase
    .from('transformation_photos')
    .select('id, image_url')
    .eq('user_id', user.id);

console.log("TRANSFORMATION PHOTOS:", transformationPhotos);
console.log("TRANSFORMATION PHOTO ERROR:", photoError);

if (transformationPhotos) {
  const imageUrls = transformationPhotos.map(
    (photo) => photo.image_url
  );

  const ids = transformationPhotos.map(
    (photo) => photo.id
  );

  setPhotos(imageUrls);
  setPhotoIds(ids);
}

const { data: workoutLogs } = await supabase
  .from("workout_logs")
  .select(`
    id,
    workout_date,
    workout_exercises (
      exercise_name,
      sets,
      reps,
      weight_kg,
      completed
    )
  `)
  .eq("user_id", user.id)
  .order("workout_date", { ascending: false });

if (workoutLogs) {
  setWorkoutHistory(workoutLogs);
  calculateStreak(workoutLogs);
}

const { data: history } = await supabase
  .from('workout_logs')
  .select(`
    id,
    workout_date,
    workout_exercises (
      exercise_name,
      sets,
      reps,
      weight_kg,
      completed
    )
  `)
  .eq('user_id', user.id)
  .order('workout_date', { ascending: false });

if (history) {
  setWorkoutHistory(history);
}

const { data: measurements } = await supabase
  .from('measurements')
  .select('measurement_date, weight_kg')
  .eq('user_id', user.id)
  .order('measurement_date', { ascending: true });

if (measurements) {
  setWeightHistory(
    measurements.map(item => ({
      week: item.measurement_date,
      weight: item.weight_kg
    }))
  );
  const { data: logs } = await supabase
  .from('food_logs')
  .select('*')
  .eq('user_id', user.id);

if (logs) {
  setFoodLogs(logs);
}
}
      }
    }

    loadProfile();
  }, [user]);

 const bmi =
  profile?.height_cm && profile?.current_weight_kg
    ? (
        profile.current_weight_kg /
        ((profile.height_cm / 100) * (profile.height_cm / 100))
      ).toFixed(1)
    : '--';

  const calories =
  profile?.current_weight_kg &&
  profile?.height_cm &&
  profile?.age
    ? (() => {
        const weight = Number(profile.current_weight_kg);
        const height = Number(profile.height_cm);
        const age = Number(profile.age);

        // Calculate BMR
        const bmr =
          10 * weight +
          6.25 * height -
          5 * age +
          (profile.gender?.toLowerCase() === "male" ? 5 : -161);

        // Activity level
        const activityLevel =
          profile.activity_level?.toLowerCase() || "sedentary";

        const activityMultiplier =
          activityLevel === "sedentary"
            ? 1.2
            : activityLevel === "light"
            ? 1.375
            : activityLevel === "moderate"
            ? 1.55
            : activityLevel === "active"
            ? 1.725
            : activityLevel === "very_active" ||
              activityLevel === "very active"
            ? 1.9
            : 1.2;

        // Estimated maintenance calories
        const maintenanceCalories = bmr * activityMultiplier;

        // Adjust calories based on the user's goal
        const goal =
          profile.fitness_goal?.toLowerCase() || "maintenance";

        const goalCalories =
          goal === "fat_loss"
            ? maintenanceCalories * 0.80
            : goal === "body_recomposition"
            ? maintenanceCalories * 0.90
            : goal === "muscle_gain"
            ? maintenanceCalories * 1.05
            : maintenanceCalories;

        return Math.round(goalCalories);
      })()
    : "--";

    const proteinTarget =
  profile?.current_weight_kg
    ? (() => {
        const weight = Number(profile.current_weight_kg);
        const goal =
          profile.fitness_goal?.toLowerCase() || "maintenance";

        const proteinMultiplier =
          goal === "fat_loss"
            ? 2.2
            : goal === "body_recomposition"
            ? 2.2
            : goal === "muscle_gain"
            ? 2.0
            : 1.8;

        return Math.round(weight * proteinMultiplier);
      })()
    : '--';

const waterIntake =
  profile?.current_weight_kg
    ? (profile.current_weight_kg * 0.04).toFixed(1)
    : '--';

const dailySteps = 10000;

const todayName = new Date().toLocaleDateString("en-US", {
  weekday: "long",
});

const todayWorkout =
  aiPlan?.plan_json?.workout?.weekly_plan?.find(
    (day: any) => day.day === todayName
  );

  const recoveryPlan = generateRecoveryPlan(profile);

    const goalProgress =
  profile?.current_weight_kg &&
  profile?.goal_weight_kg
    ? (
        ((profile.current_weight_kg - profile.goal_weight_kg) /
          profile.current_weight_kg) *
        100
      ).toFixed(1)
    : '--';
    console.log(profile);

  const fitnessScore =
  profile?.current_weight_kg &&
  profile?.goal_weight_kg
    ? Math.round(
        Math.max(
          0,
          Math.min(
            100,
            100 -
              Math.abs(
                profile.current_weight_kg -
                profile.goal_weight_kg
              ) * 5
          )
        )
      )
    : '--';

 const bodyFat =
  bmi !== '--' && profile?.age
    ? (
        1.20 * Number(bmi) +
        0.23 * Number(profile.age) -
        (profile.gender?.toLowerCase() === "male" ? 16.2 : 5.4)
      ).toFixed(1)
    : '--';

    const totalCalories = foodLogs.reduce(
  (sum, item) => sum + (item.calories || 0),
  0
);

const totalProtein = foodLogs.reduce(
  (sum, item) => sum + (item.protein || 0),
  0
);

const totalCarbs = foodLogs.reduce(
  (sum, item) => sum + (item.carbs || 0),
  0
);

const totalFat = foodLogs.reduce(
  (sum, item) => sum + (item.fat || 0),
  0
);

    const workoutPlan =
  profile?.fitness_goal === 'muscle_gain'
    ? [
        {
          day: 'Monday - Push',
          exercises: [
            'Bench Press',
            'Incline Dumbbell Press',
            'Shoulder Press',
            'Lateral Raises',
            'Tricep Pushdowns'
          ]
        },
        {
          day: 'Tuesday - Pull',
          exercises: [
            'Pull Ups',
            'Barbell Rows',
            'Lat Pulldown',
            'Face Pulls',
            'Barbell Curls'
          ]
        },
        {
          day: 'Wednesday - Legs',
          exercises: [
            'Squats',
            'Romanian Deadlift',
            'Leg Press',
            'Leg Curl',
            'Standing Calf Raises'
          ]
        },
        {
          day: 'Thursday - Push',
          exercises: [
            'Incline Bench Press',
            'Machine Chest Press',
            'Arnold Press',
            'Cable Lateral Raises',
            'Overhead Tricep Extension'
          ]
        },
        {
          day: 'Friday - Pull',
          exercises: [
            'Deadlift',
            'Seated Cable Row',
            'Lat Pulldown',
            'Hammer Curl',
            'Preacher Curl'
          ]
        },
        {
          day: 'Saturday - Legs',
          exercises: [
            'Hack Squat',
            'Bulgarian Split Squat',
            'Leg Extension',
            'Leg Curl',
            'Seated Calf Raises'
          ]
        },
        {
          day: 'Sunday - Recovery',
          exercises: [
            'Walking',
            'Stretching',
            'Foam Rolling',
            'Mobility Work'
          ]
        }
      ]
    : [];

    const mealPlan =
  profile?.fitness_goal === 'muscle_gain'
    ? {
        breakfast:
          '6 Egg Whites + Oats + Banana',
        lunch:
          '200g Chicken + Rice + Vegetables',
        dinner:
          '200g Fish + Sweet Potato + Salad',
        snacks:
          'Whey Protein + Peanut Butter Toast'
      }
    : {
        breakfast:
          'Oats + Fruits',
        lunch:
          'Chicken Salad',
        dinner:
          'Fish + Vegetables',
        snacks:
          'Greek Yogurt'
      };

async function logWorkout() {

  console.log("Button clicked");

  if (!user) {

    console.log("No user found");

    return;
  }

    const {
    data: { user: authUser },
    error: authError
  } = await supabase.auth.getUser();



  if (!isPro) {
    alert("🔥 BodyWise Pro is required to log workouts.");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  // Check if today's workout already exists
  const { data: existingWorkout, error: existingWorkoutError } =
    await supabase
      .from("workout_logs")
      .select(`
        *,
        workout_exercises (*)
      `)
      .eq("user_id", user.id)
      .eq("workout_date", today)
      .maybeSingle();

  console.log("Existing Workout:", existingWorkout);
  console.log("Existing Workout Error:", existingWorkoutError);

  if (existingWorkoutError) {
    alert(existingWorkoutError.message);
    return;
  }

  // If today's workout is already completed, don't create another one
  if (
    existingWorkout &&
    existingWorkout.workout_exercises &&
    existingWorkout.workout_exercises.length > 0
  ) {
    alert("Today's workout has already been logged.");
    return;
  }

  // Reuse an incomplete workout log if one already exists
  let workoutLog = existingWorkout;

  // Otherwise create a new workout log
  if (!workoutLog) {
    const { data: newWorkoutLog, error: workoutError } =
      await supabase
        .from("workout_logs")
        .insert([
          {
            user_id: user.id,
            workout_date: today,
          },
        ])
        .select()
        .single();

    console.log("Workout Log:", newWorkoutLog);
    console.log("Workout Error:", workoutError);

    if (workoutError) {
      alert(workoutError.message);
      return;
    }

    workoutLog = newWorkoutLog;
  }

  // Save today's exercises
  if (todayWorkout?.exercises?.length && workoutLog) {
    const exerciseRows = todayWorkout.exercises.map((exercise: any) => ({
      workout_log_id: workoutLog.id,
      user_id: user.id,
      exercise_name: exercise.name,
      sets: Number(exercise.sets) || 0,
      reps: Number(exerciseReps[exercise.name]) || 0,
      weight_kg: Number(exerciseWeights[exercise.name]) || 0,
      completed:
        Number(exerciseWeights[exercise.name]) > 0 &&
        Number(exerciseReps[exercise.name]) > 0,
    }));

    const { data: exerciseData, error: exerciseError } =
  await supabase
    .from("workout_exercises")
    .insert(exerciseRows);

    console.log("Exercise Data:", exerciseData);
    console.log("Exercise Error:", exerciseError);

    if (exerciseError) {
      alert(exerciseError.message);
      return;
    }
  }

  alert("🎉 Workout Logged Successfully!");

}

function calculateStreak(logs: any[]) {
  const dates = logs.map(log => log.workout_date);

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const dateString = currentDate.toISOString().split('T')[0];

    if (dates.includes(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  setWorkoutStreak(streak);
}
async function saveWeight() {
  if (!user || !weightInput) return;

  const { error } = await supabase
    .from('measurements')
    .insert([
      {
        user_id: user.id,
        weight_kg: Number(weightInput)
      }
    ]);

  if (error) {
    alert(error.message);
  } else {
    alert('Weight Saved!');
    setWeightInput('');
  }
}


async function uploadTransformationPhoto() {
  if (!photoFile || !user) return;

  if (!isPro) {
    alert("🔥 BodyWise Pro is required to upload transformation photos.");
    return;
  }

  const fileName = `${user.id}-${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('transformations')
    .upload(fileName, photoFile);

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const { data } = supabase.storage
    .from('transformations')
    .getPublicUrl(fileName);

  const imageUrl = data.publicUrl;

  const { error } = await supabase
    .from('transformation_photos')
    .insert([
      {
        user_id: user.id,
        image_url: imageUrl
      }
    ]);

  if (error) {
    alert(error.message);
  } else {
    alert('Transformation Photo Uploaded!');
  }
}

const deleteTransformationPhoto = async (
  photoId: string,
  imageUrl: string
) => {
  if (!user) return;

  if (!isPro) {
    alert("🔥 BodyWise Pro is required to delete transformation photos.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this transformation photo?"
  );

  if (!confirmed) return;

  const fileName = imageUrl.split("/").pop();

  if (fileName) {
    const { error: storageError } = await supabase.storage
      .from("transformations")
      .remove([fileName]);

    if (storageError) {
      alert(storageError.message);
      return;
    }
  }

  const { error: deleteError } = await supabase
    .from("transformation_photos")
    .delete()
    .eq("id", photoId)
    .eq("user_id", user.id);

  if (deleteError) {
    alert(deleteError.message);
    return;
  }

  setPhotos((currentPhotos) =>
    currentPhotos.filter((photo) => photo !== imageUrl)
  );

  setPhotoIds((currentIds) =>
    currentIds.filter((id) => id !== photoId)
  );

  alert("Transformation Photo Deleted!");
};

const clearFoodForm = () => {
  setFoodName('');
  setQuantity('100');
  setCaloriesInput('');
  setProteinInput('');
  setCarbsInput('');
  setFatInput('');
};

const deleteFoodLog = async (id: number) => {
  const { error } = await supabase
    .from("food_logs")
    .delete()
    .eq("id", id);

  if (!error) {
    loadFoodLogs();
  }
};

const deleteWorkout = async (workoutId: string) => {
  if (!user) return;

  const confirmed = window.confirm(
    "⚠️ Are you sure you want to delete this workout?"
  );

  if (!confirmed) return;

  const { error: exerciseError } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("workout_log_id", workoutId)
    .eq("user_id", user.id);

  if (exerciseError) {
    alert(exerciseError.message);
    return;
  }

  const { error: workoutError } = await supabase
    .from("workout_logs")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (workoutError) {
    alert(workoutError.message);
    return;
  }

  setWorkoutHistory((prev: any[]) =>
    prev.filter((workout) => workout.id !== workoutId)
  );

  alert("✅ Workout deleted successfully!");
};

const saveFoodLog = async () => {

  if (!user) {

    alert('Please login first');

    return;
  }

  if (!isPro) {
    alert("🔥 BodyWise Pro is required to log food.");
    return;
}
  
  if (!foodName || !caloriesInput) {
    alert('Please enter food details');
    return;
  }
  
 const { error } = await supabase
  .from('food_logs')
  .insert([
    {
      user_id: user?.id,
      food_name: foodName,
      quantity: Number(quantity),
      calories: Number(caloriesInput),
      protein: Number(proteinInput),
      carbs: Number(carbsInput),
      fat: Number(fatInput),
    },
  ]);
  if (error) {
    alert(error.message);
  } else {
    alert('Food Saved!');

    
setFoodLogs(prev => [
  ...prev,
  {
    food_name: foodName,
    quantity: Number(quantity),
    calories: Number(caloriesInput),
    protein: Number(proteinInput),
    carbs: Number(carbsInput),
    fat: Number(fatInput),
  },
]);
    setFoodName('');
    setQuantity('100');
    setCaloriesInput('');
    setProteinInput('');
    setCarbsInput('');
    setFatInput('');
  }
};

const loadFoodLogs = async () => {
  if (!user) return;

  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (!error && data) {
    setFoodLogs(data);
  }
};
function generateExercisesForWorkout(
  workoutType: string,
  profile: any
) {
  const experience = profile?.experience_level || "beginner";
  const location = profile?.workout_location || "gym";
  const duration = Number(profile?.workout_duration || 60);
  const fitnessGoal = profile?.fitness_goal || "maintenance";
  const injury = (profile?.injuries || "").toLowerCase();

  const isBeginner = experience === "beginner";
  const isIntermediate = experience === "intermediate";
  const isAdvanced = experience === "advanced";

  const isMuscleGain = fitnessGoal === "muscle_gain";
  const isFatLoss = fitnessGoal === "fat_loss";

  let exercises: any[] = [];

  // =========================================================
  // PUSH
  // =========================================================

  if (workoutType === "Push") {
    if (location === "home") {
      exercises = [
        {
          name: "Push-Ups",
          sets: isBeginner ? 3 : isAdvanced ? 4 : 3,
          reps: isMuscleGain ? "8-12" : "10-15",
          rest: isAdvanced ? "75 sec" : "60 sec",
        },
        {
          name: "Incline Push-Ups",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Pike Push-Ups",
          sets: isAdvanced ? 3 : 2,
          reps: "8-12",
          rest: "75 sec",
        },
        {
          name: "Chair Tricep Dips",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
      ];
    } else {
      exercises = [
        {
          name: "Bench Press",
          sets: isBeginner ? 3 : isAdvanced ? 4 : 3,
          reps: isMuscleGain ? "6-10" : "8-12",
          rest: isAdvanced ? "120 sec" : "90 sec",
        },
        {
          name: "Incline Dumbbell Press",
          sets: isAdvanced ? 4 : 3,
          reps: "8-12",
          rest: "75 sec",
        },
        {
          name: "Lateral Raises",
          sets: 3,
          reps: "12-15",
          rest: "60 sec",
        },
        {
          name: "Tricep Pushdowns",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
      ];
    }
  }

  // =========================================================
  // PULL
  // =========================================================

  else if (workoutType === "Pull") {
    if (location === "home") {
      exercises = [
        {
          name: "Resistance Band Rows",
          sets: isAdvanced ? 4 : 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Resistance Band Pulldowns",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Band Face Pulls",
          sets: 3,
          reps: "12-15",
          rest: "60 sec",
        },
        {
          name: "Dumbbell Curls",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
      ];
    } else {
      exercises = [
        {
          name: "Lat Pulldown",
          sets: isBeginner ? 3 : 4,
          reps: "8-12",
          rest: isAdvanced ? "120 sec" : "90 sec",
        },
        {
          name: "Seated Cable Row",
          sets: isAdvanced ? 4 : 3,
          reps: "8-12",
          rest: "75 sec",
        },
        {
          name: "Face Pull",
          sets: 3,
          reps: "12-15",
          rest: "60 sec",
        },
        {
          name: "Dumbbell Curl",
          sets: 3,
          reps: "10-12",
          rest: "60 sec",
        },
      ];
    }
  }

  // =========================================================
  // LEGS
  // =========================================================

  else if (workoutType === "Legs") {
    if (location === "home") {
      exercises = [
        {
          name: "Bodyweight Squats",
          sets: isAdvanced ? 4 : 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Reverse Lunges",
          sets: 3,
          reps: "8-12 each leg",
          rest: "60 sec",
        },
        {
          name: "Glute Bridges",
          sets: 3,
          reps: "12-15",
          rest: "60 sec",
        },
        {
          name: "Standing Calf Raises",
          sets: 3,
          reps: "15-20",
          rest: "45 sec",
        },
      ];
    } else {
      exercises = [
        {
          name: "Leg Press",
          sets: isBeginner ? 3 : isAdvanced ? 4 : 3,
          reps: isMuscleGain ? "8-12" : "10-15",
          rest: isAdvanced ? "120 sec" : "90 sec",
        },
        {
          name: "Romanian Deadlift",
          sets: isBeginner ? 2 : 3,
          reps: "8-12",
          rest: "90 sec",
        },
        {
          name: "Leg Curl",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Standing Calf Raise",
          sets: 3,
          reps: "12-15",
          rest: "60 sec",
        },
      ];
    }
  }

  // =========================================================
  // UPPER BODY
  // =========================================================

  else if (workoutType === "Upper Body") {
    exercises = [
      {
        name: location === "home"
          ? "Push-Ups"
          : "Incline Bench Press",
        sets: isAdvanced ? 4 : 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: location === "home"
          ? "Resistance Band Row"
          : "Chest Supported Row",
        sets: isAdvanced ? 4 : 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Lateral Raises",
        sets: 3,
        reps: "12-15",
        rest: "60 sec",
      },
      {
        name: location === "home"
          ? "Dumbbell Curl"
          : "Cable Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
    ];
  }

  // =========================================================
  // LOWER BODY
  // =========================================================

  else if (workoutType === "Lower Body") {
    if (location === "home") {
      exercises = [
        {
          name: "Bodyweight Squats",
          sets: isAdvanced ? 4 : 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Reverse Lunges",
          sets: 3,
          reps: "8-12 each leg",
          rest: "60 sec",
        },
        {
          name: "Glute Bridges",
          sets: 3,
          reps: "12-15",
          rest: "60 sec",
        },
        {
          name: "Standing Calf Raises",
          sets: 3,
          reps: "15-20",
          rest: "45 sec",
        },
      ];
    } else {
      exercises = [
        {
          name: "Leg Press",
          sets: isAdvanced ? 4 : 3,
          reps: "8-12",
          rest: "90 sec",
        },
        {
          name: "Bulgarian Split Squat",
          sets: isBeginner ? 2 : 3,
          reps: "8-12",
          rest: "90 sec",
        },
        {
          name: "Leg Curl",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Seated Calf Raise",
          sets: 3,
          reps: "12-15",
          rest: "60 sec",
        },
      ];
    }
  }

  // =========================================================
  // FULL BODY
  // =========================================================

  else if (workoutType === "Full Body") {
    if (location === "home") {
      exercises = [
        {
          name: "Bodyweight Squats",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Push-Ups",
          sets: 3,
          reps: "8-15",
          rest: "60 sec",
        },
        {
          name: "Resistance Band Rows",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Glute Bridges",
          sets: 3,
          reps: "12-15",
          rest: "60 sec",
        },
      ];
    } else {
      exercises = [
        {
          name: "Squat",
          sets: isBeginner ? 3 : isAdvanced ? 4 : 3,
          reps: isMuscleGain ? "6-10" : "8-12",
          rest: isAdvanced ? "120 sec" : "90 sec",
        },
        {
          name: "Bench Press",
          sets: 3,
          reps: "8-12",
          rest: "90 sec",
        },
        {
          name: "Lat Pulldown",
          sets: 3,
          reps: "8-12",
          rest: "75 sec",
        },
        {
          name: "Romanian Deadlift",
          sets: isBeginner ? 2 : 3,
          reps: "8-12",
          rest: "90 sec",
        },
      ];
    }
  }

  // =========================================================
  // REST / RECOVERY
  // =========================================================

  else {
    exercises = [];
  }

  // =========================================================
  // DURATION ADAPTATION
  // =========================================================

  if (duration <= 30) {
    exercises = exercises.slice(0, 3);
  } else if (duration <= 45) {
    exercises = exercises.slice(0, 4);
  }

  // =========================================================
  // GOAL ADAPTATION
  // =========================================================

  if (isFatLoss) {
    exercises = exercises.map((exercise) => ({
      ...exercise,
      rest:
        exercise.rest === "120 sec"
          ? "90 sec"
          : exercise.rest,
    }));
  }

  // Apply injury adjustment
exercises = adjustExercisesForInjury(exercises, injury);

return exercises;

// =========================================================
// INJURY-BASED EXERCISE ADJUSTMENT
// =========================================================

function adjustExercisesForInjury(exercises: any[], injury: string) {
  const normalizedInjury = injury.toLowerCase().trim();

  if (!normalizedInjury || normalizedInjury === "none") {
    return exercises;
  }

  const injuryReplacements: Record<string, Record<string, any>> = {

    // -------------------------
    // SHOULDER
    // -------------------------
    shoulder: {
      "Bench Press": {
        name: "Machine Chest Press",
        sets: 3,
        reps: "8-12",
        rest: "75 sec",
      },

      "Incline Bench Press": {
        name: "Machine Chest Press",
        sets: 3,
        reps: "8-12",
        rest: "75 sec",
      },

      "Lateral Raises": {
        name: "Cable Chest Fly",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Shoulder Press": {
        name: "Cable Chest Fly",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Pike Push-Ups": {
        name: "Resistance Band Chest Press",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
    },

    // -------------------------
    // KNEE
    // -------------------------
    knee: {
      "Squat": {
        name: "Glute Bridge",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Bodyweight Squats": {
        name: "Glute Bridge",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Reverse Lunges": {
        name: "Hip Thrust",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Bulgarian Split Squat": {
        name: "Hip Thrust",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Leg Press": {
        name: "Seated Leg Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
    },

    // -------------------------
    // LOWER BACK
    // -------------------------
    "lower back": {
      "Romanian Deadlift": {
        name: "Seated Leg Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Squat": {
        name: "Leg Press",
        sets: 3,
        reps: "10-15",
        rest: "75 sec",
      },

      "Bodyweight Squats": {
        name: "Glute Bridge",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
    },

    // -------------------------
    // ELBOW
    // -------------------------
    elbow: {
      "Chair Tricep Dips": {
        name: "Cable Tricep Extension",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Tricep Pushdowns": {
        name: "Light Cable Tricep Extension",
        sets: 3,
        reps: "12-15",
        rest: "60 sec",
      },

      "Dumbbell Curl": {
        name: "Hammer Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Dumbbell Curls": {
        name: "Hammer Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },

      "Cable Curl": {
        name: "Hammer Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
    },

    // -------------------------
    // NECK
    // -------------------------
    neck: {
      "Shrugs": {
        name: "Cable Row",
        sets: 3,
        reps: "10-12",
        rest: "75 sec",
      },

      "Barbell Row": {
        name: "Chest Supported Row",
        sets: 3,
        reps: "8-12",
        rest: "75 sec",
      },
    },
  };

  const replacements = injuryReplacements[normalizedInjury];

  if (!replacements) {
    return exercises;
  }

    return exercises.map((exercise) => {
    const replacement = replacements[exercise.name];

    if (replacement) {
      return replacement;
    }

    return exercise;
  });
}
}

function generateRecoveryPlan(profile: any) {
  const goal = profile?.fitness_goal || "maintenance";
  const sleepQuality = profile?.sleep_quality || "";
  const energyLevel = profile?.energy_level || "";
  const stressLevel = profile?.routine_stress || "";
  const injury = (profile?.injuries || "").toLowerCase();

  let activity = "Light Walking";
  let duration = "20–30 min";
  let focus = "Prioritize sleep, hydration and recovery.";
  let coachTip =
    "Recovery is part of your progress. Give your body time to recharge.";

  // -------------------------
  // GOAL-BASED RECOVERY
  // -------------------------

  if (goal === "muscle_gain") {
    activity = "Light Walking";
    duration = "20–30 min";
    focus =
      "Prioritize quality sleep, adequate protein and hydration to support muscle recovery.";
    coachTip =
      "Your muscles grow during recovery. Keep today's activity light and prepare for your next training session.";
  }

  else if (goal === "fat_loss") {
    activity = "Light Walking";
    duration = "25–35 min";
    focus =
      "Stay lightly active while keeping your recovery and nutrition on track.";
    coachTip =
      "You don't need hard training every day. Light activity today can support consistency while your body recovers.";
  }

  else if (goal === "maintenance") {
    activity = "Light Walking";
    duration = "20–30 min";
    focus =
      "Maintain normal activity, hydration and good sleep while allowing your body to recover.";
    coachTip =
      "Progress comes from balancing training with recovery. Use today to restore your energy.";
  }

  // -------------------------
  // SLEEP ADJUSTMENT
  // -------------------------

  if (
    sleepQuality === "Poor" ||
    sleepQuality === "Average"
  ) {
    focus =
      "Your sleep quality needs attention today. Prioritize rest, hydration and an earlier bedtime.";

    coachTip =
      "Recovery starts with sleep. Keep today's activity easy and focus on getting better quality sleep tonight.";
  }

  // -------------------------
  // ENERGY ADJUSTMENT
  // -------------------------

  if (energyLevel === "Low") {
    activity = "Easy Walking";
    duration = "10–20 min";

    coachTip =
      "Your energy is low today, so keep activity easy and focus on restoring your energy.";
  }

  // -------------------------
  // STRESS ADJUSTMENT
  // -------------------------

  if (
    stressLevel === "Busy" ||
    stressLevel === "Very Stressful"
  ) {
    coachTip =
      "Your stress level is elevated today. Keep recovery simple: light movement, hydration and quality sleep.";
  }

  // -------------------------
  // INJURY ADJUSTMENT
  // -------------------------

  if (injury && injury !== "none") {
    activity = "Gentle Walking";
    duration = "10–20 min";

    focus =
      "Keep today's activity gentle and avoid movements that aggravate your injury.";

    coachTip =
      "Recovery comes first. Avoid painful movements and follow appropriate professional guidance for your injury.";
  }

    let checklist = [
    "Stay hydrated throughout the day.",
    "Aim for quality sleep tonight.",
    "Keep your nutrition consistent with your goal.",
  ];

  if (goal === "muscle_gain") {
    checklist = [
      "Eat enough protein today.",
      "Stay well hydrated.",
      "Aim for 7–9 hours of sleep.",
    ];
  } else if (goal === "fat_loss") {
    checklist = [
      "Stay consistent with your nutrition target.",
      "Get some light daily movement.",
      "Stay hydrated.",
    ];
  } else if (goal === "maintenance") {
    checklist = [
      "Stay hydrated.",
      "Do light mobility work.",
      "Get quality sleep tonight.",
    ];
  }

if (injury && injury !== "none") {
  checklist.unshift("Avoid movements that aggravate your injury.");
}

return {
    activity,
    duration,
    focus,
    coachTip,
    checklist,
  };
}

function generateWorkoutPlan(profile: any) {
  const days = Number(profile?.workout_days || 4);
  const goal = profile?.fitness_goal || "maintenance";
  const experience = profile?.experience_level || "beginner";
  const location = profile?.workout_location || "gym";

  console.log("WORKOUT GENERATION INPUT:", {
    days,
    goal,
    experience,
    location,
  });

  let weeklyPlan: any[] = [];

  if (days === 3) {
  weeklyPlan = [
  {
    day: "Monday",
    type: "Full Body",
    focus: "Full Body Strength",
    exercises: generateExercisesForWorkout("Full Body", profile),
  },
  {
    day: "Tuesday",
    type: "Rest",
    focus: "Recovery",
    exercises: [],
  },
  {
    day: "Wednesday",
    type: "Full Body",
    focus: "Full Body Strength",
    exercises: generateExercisesForWorkout("Full Body", profile),
  },
  {
    day: "Thursday",
    type: "Rest",
    focus: "Recovery",
    exercises: [],
  },
  {
    day: "Friday",
    type: "Full Body",
    focus: "Full Body Strength",
    exercises: generateExercisesForWorkout("Full Body", profile),
  },
  {
    day: "Saturday",
    type: "Recovery",
    focus: "Walking • Mobility • Recovery",
    exercises: [],
  },
  {
    day: "Sunday",
    type: "Rest",
    focus: "Recovery",
    exercises: [],
  },
];
  } else if (days === 4) {
    weeklyPlan = [
      {
        day: "Monday",
        type: "Upper Body",
        focus: "Chest • Back • Shoulders • Arms",
        exercises: generateExercisesForWorkout("Upper Body", profile),
      },
      {
        day: "Tuesday",
        type: "Lower Body",
        focus: "Quads • Hamstrings • Glutes • Calves",
        exercises: generateExercisesForWorkout("Lower Body", profile),
      },
      {
        day: "Wednesday",
        type: "Rest",
        focus: "Recovery",
        exercises: [],
      },
      {
        day: "Thursday",
        type: "Upper Body",
        focus: "Chest • Back • Shoulders • Arms",
       exercises: generateExercisesForWorkout("Upper Body", profile),
      },
      {
        day: "Friday",
        type: "Lower Body",
        focus: "Quads • Hamstrings • Glutes • Calves",
        exercises: generateExercisesForWorkout("Lower Body", profile),

      },
      {
        day: "Saturday",
        type: "Recovery",
        focus: "Walking • Mobility • Recovery",
        exercises: [],
      },
      {
        day: "Sunday",
        type: "Rest",
        focus: "Recovery",
        exercises: [],
      },
    ];
  } else if (days === 5) {
    weeklyPlan = [
      {
        day: "Monday",
        type: "Push",
        focus: "Chest • Shoulders • Triceps",
        exercises: generateExercisesForWorkout("Push", profile),
      },
      {
        day: "Tuesday",
        type: "Pull",
        focus: "Back • Rear Delts • Biceps",
        exercises: generateExercisesForWorkout("Pull", profile),
      },
      {
        day: "Wednesday",
        type: "Legs",
        focus: "Quads • Hamstrings • Glutes • Calves",
        exercises: generateExercisesForWorkout("Legs", profile),
      },
      {
        day: "Thursday",
        type: "Rest",
        focus: "Recovery",
        exercises: [],
      },
      {
        day: "Friday",
        type: "Upper Body",
        focus: "Chest • Back • Shoulders • Arms",
        exercises: generateExercisesForWorkout("Upper Body", profile),
      },
      {
        day: "Saturday",
        type: "Lower Body",
        focus: "Quads • Hamstrings • Glutes • Calves",
        exercises: generateExercisesForWorkout("Lower Body", profile),
      },
      {
        day: "Sunday",
        type: "Rest",
        focus: "Recovery",
        exercises: [],
      },
    ];
  } else if (days === 6) {
    weeklyPlan = [
      {
        day: "Monday",
        type: "Push",
        focus: "Chest • Shoulders • Triceps",
        exercises: generateExercisesForWorkout("Push", profile),
      },
      {
        day: "Tuesday",
        type: "Pull",
        focus: "Back • Rear Delts • Biceps",
        exercises: generateExercisesForWorkout("Pull", profile),
      },
      {
        day: "Wednesday",
        type: "Legs",
        focus: "Quads • Hamstrings • Glutes • Calves",
        exercises: generateExercisesForWorkout("Legs", profile),
      },
      {
        day: "Thursday",
        type: "Push",
        focus: "Chest • Shoulders • Triceps",
        exercises: generateExercisesForWorkout("Push", profile),
      },
      {
        day: "Friday",
        type: "Pull",
        focus: "Back • Rear Delts • Biceps",
        exercises: generateExercisesForWorkout("Pull", profile),
      },
      {
        day: "Saturday",
        type: "Legs",
        focus: "Quads • Hamstrings • Glutes • Calves",
        exercises: generateExercisesForWorkout("Legs", profile),
      },
      {
        day: "Sunday",
        type: "Rest",
        focus: "Recovery",
        exercises: [],
      },
    ];
  } else {
    weeklyPlan = [
      {
        day: "Monday",
        type: "Full Body",
        focus: "Full Body Training",
        exercises: generateExercisesForWorkout("Full Body", profile),
      },
      {
        day: "Tuesday",
        type: "Rest",
        focus: "Recovery",
        exercises: [],
      },
      {
        day: "Wednesday",
        type: "Full Body",
        focus: "Full Body Training",
        exercises: generateExercisesForWorkout("Full Body", profile),
      },
      {
        day: "Thursday",
        type: "Rest",
        focus: "Recovery",
        exercises: [],
      },
      {
        day: "Friday",
        type: "Full Body",
        focus: "Full Body Training",
        exercises: generateExercisesForWorkout("Full Body", profile),
      },
      {
        day: "Saturday",
        type: "Recovery",
        focus: "Walking • Mobility • Recovery",
        exercises: [],
      },
      {
        day: "Sunday",
        type: "Rest",
        focus: "Recovery",
        exercises: [],
      },
    ];
  }

  return weeklyPlan;
}

async function handleGenerateAIPlan() {
  if (!user) return;

  if (!isPro) {
    alert("🔥 BodyWise Pro is required to create or update your AI plan.");
    return;
  }

  setGeneratingPlan(true);

  const userContext = {
  age: profile?.age,
  gender: profile?.gender,

  currentWeight: profile?.current_weight_kg,
  goalWeight: profile?.goal_weight_kg,
  height: profile?.height_cm,

  fitnessGoal: profile?.fitness_goal,
  activityLevel: profile?.activity_level,
  energyLevel: profile?.energy_level,

  workoutDays: profile?.workout_days,
  workoutDuration: profile?.workout_duration,
  workoutLocation: profile?.workout_location,
  experienceLevel: profile?.experience_level,

  injuries: profile?.injuries,

  dietPreference: profile?.diet_preference,
  mealsPerDay: profile?.meals_per_day,

  sleepHours: profile?.sleep_duration,
  sleepQuality: profile?.sleep_quality,
  stressLevel: profile?.routine_stress,

  waterIntake: profile?.water_intake,
};

console.log("AI USER CONTEXT:", userContext);

const personalizedWeeklyPlan = generateWorkoutPlan(profile);

console.log("PERSONALIZED WEEKLY PLAN:", personalizedWeeklyPlan);



  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  function generateNutritionMeals(
  profile: any,
  calories: number | string,
  proteinTarget: number | string
) {
  const goal = String(profile?.fitness_goal || "maintenance").toLowerCase();
  const diet = String(profile?.diet_preference || "").toLowerCase();
  const mealsPerDay = Number(profile?.meals_per_day || 3);

  const allergies = String(profile?.food_allergies || "").toLowerCase();
  const restrictions = String(profile?.food_restrictions || "").toLowerCase();

  const isVegetarian =
    diet.includes("vegetarian") ||
    diet.includes("veg");

  const isVegan =
    diet.includes("vegan");

  const avoidFood = (food: string) => {
    const text = food.toLowerCase();

    return (
      (allergies && text.includes(allergies)) ||
      (restrictions && text.includes(restrictions))
    );
  };

  let meals: any[] = [];

    const dailyCalories = Number(calories) || 0;
  const dailyProtein = Number(proteinTarget) || 0;

  const mealCount = Math.max(1, mealsPerDay);

  const calorieDistribution =
  mealCount === 3
    ? [0.35, 0.40, 0.25]
    : mealCount === 4
    ? [0.25, 0.35, 0.15, 0.25]
    : [0.20, 0.30, 0.15, 0.10, 0.25];
  const proteinDistribution =
  mealCount === 3
    ? [0.30, 0.40, 0.30]
    : mealCount === 4
    ? [0.25, 0.35, 0.15, 0.25]
    : [0.20, 0.30, 0.15, 0.10, 0.25];

  // MUSCLE GAIN
  if (
    goal.includes("muscle") ||
    goal.includes("gain")
  ) {
    if (isVegan) {
      meals = [
        {
          name: "Breakfast",
          foods: ["Oats", "Soy Milk", "Banana", "Peanut Butter"],
        },
        {
          name: "Lunch",
          foods: ["Rice", "Tofu", "Lentils", "Vegetables"],
        },
        {
          name: "Snack",
          foods: ["Soy Yogurt", "Fruit", "Nuts"],
        },
        {
          name: "Dinner",
          foods: ["Tofu", "Rice", "Vegetables", "Lentils"],
        },
      ];
    } else if (isVegetarian) {
      meals = [
        {
          name: "Breakfast",
          foods: ["Oats", "Milk", "Banana", "Peanut Butter"],
        },
        {
          name: "Lunch",
          foods: ["Rice", "Paneer", "Dal", "Vegetables"],
        },
        {
          name: "Snack",
          foods: ["Greek Yogurt", "Fruit", "Nuts"],
        },
        {
          name: "Dinner",
          foods: ["Paneer", "Rice", "Vegetables", "Curd"],
        },
      ];
    } else {
      meals = [
        {
          name: "Breakfast",
          foods: ["Oats", "Eggs", "Banana", "Peanut Butter"],
        },
        {
          name: "Lunch",
          foods: ["Chicken", "Rice", "Vegetables"],
        },
        {
          name: "Snack",
          foods: ["Greek Yogurt", "Fruit", "Nuts"],
        },
        {
          name: "Dinner",
          foods: ["Fish", "Sweet Potato", "Salad"],
        },
      ];
    }
  }

  // FAT LOSS
  else if (
    goal.includes("fat") ||
    goal.includes("loss") ||
    goal.includes("weight loss")
  ) {
    if (isVegan) {
      meals = [
        {
          name: "Breakfast",
          foods: ["Oats", "Soy Milk", "Berries"],
        },
        {
          name: "Lunch",
          foods: ["Tofu", "Rice", "Vegetables", "Salad"],
        },
        {
          name: "Snack",
          foods: ["Soy Yogurt", "Fruit"],
        },
        {
          name: "Dinner",
          foods: ["Lentils", "Vegetables", "Salad"],
        },
      ];
    } else if (isVegetarian) {
      meals = [
        {
          name: "Breakfast",
          foods: ["Oats", "Greek Yogurt", "Berries"],
        },
        {
          name: "Lunch",
          foods: ["Paneer", "Rice", "Vegetables", "Salad"],
        },
        {
          name: "Snack",
          foods: ["Greek Yogurt", "Fruit"],
        },
        {
          name: "Dinner",
          foods: ["Dal", "Vegetables", "Salad", "Curd"],
        },
      ];
    } else {
      meals = [
        {
          name: "Breakfast",
          foods: ["Eggs", "Oats", "Fruit"],
        },
        {
          name: "Lunch",
          foods: ["Chicken", "Rice", "Vegetables", "Salad"],
        },
        {
          name: "Snack",
          foods: ["Greek Yogurt", "Fruit"],
        },
        {
          name: "Dinner",
          foods: ["Fish", "Vegetables", "Salad"],
        },
      ];
    }
  }

  // MAINTENANCE
  else {
    if (isVegan) {
      meals = [
        {
          name: "Breakfast",
          foods: ["Oats", "Soy Milk", "Banana"],
        },
        {
          name: "Lunch",
          foods: ["Rice", "Tofu", "Vegetables"],
        },
        {
          name: "Snack",
          foods: ["Soy Yogurt", "Fruit"],
        },
        {
          name: "Dinner",
          foods: ["Lentils", "Rice", "Salad"],
        },
      ];
    } else if (isVegetarian) {
      meals = [
        {
          name: "Breakfast",
          foods: ["Oats", "Milk", "Banana"],
        },
        {
          name: "Lunch",
          foods: ["Paneer", "Rice", "Vegetables"],
        },
        {
          name: "Snack",
          foods: ["Greek Yogurt", "Fruit"],
        },
        {
          name: "Dinner",
          foods: ["Dal", "Rice", "Salad", "Curd"],
        },
      ];
    } else {
      meals = [
        {
          name: "Breakfast",
          foods: ["Oats", "Eggs", "Banana"],
        },
        {
          name: "Lunch",
          foods: ["Chicken", "Rice", "Vegetables"],
        },
        {
          name: "Snack",
          foods: ["Greek Yogurt", "Fruit"],
        },
        {
          name: "Dinner",
          foods: ["Fish", "Sweet Potato", "Salad"],
        },
      ];
    }
  }

  // Remove foods mentioned in allergies/restrictions
  meals = meals.map((meal) => ({
    ...meal,
    foods: meal.foods.filter(
      (food: string) => !avoidFood(food)
    ),
  }));

  // Adjust number of meals
  if (mealsPerDay <= 3) {
    meals = meals.slice(0, 3);
  } else if (mealsPerDay === 4) {
    meals = meals.slice(0, 4);
  } else if (mealsPerDay >= 5) {
    meals = [
      ...meals.slice(0, 3),
      {
        name: "Pre/Post Workout",
        foods: isVegan
          ? ["Soy Milk", "Banana"]
          : isVegetarian
          ? ["Greek Yogurt", "Banana"]
          : ["Greek Yogurt", "Banana"],
      },
      meals[3],
    ];
  }

   return meals.map((meal, index) => ({
  ...meal,
  calories: Math.round(
    dailyCalories * (calorieDistribution[index] || 0)
  ),
  protein: Math.round(
    dailyProtein * (proteinDistribution[index] || 0)
  ),
}));
}

  // Temporary dummy plan
  const dummyPlan = {
  summary: {
    goal: profile?.fitness_goal,
    current_weight: profile?.current_weight_kg,
    goal_weight: profile?.goal_weight_kg,
    calories,
    protein: proteinTarget,
    water: `${waterIntake} L`,
  },

  workout: {
    weekly_plan: personalizedWeeklyPlan,
},

  nutrition: {
    daily_targets: {
      calories,
      protein: proteinTarget,
      water: waterIntake,
    },

      meals: generateNutritionMeals(
    profile,
    calories,
    proteinTarget
  ),
  
  },

  recovery: {
    sleep_target: "7-9 hours",
    rest_days: 1,
  },
};

  const { data, error } = await supabase
    .from("ai_plans")
    .upsert(
      {
        user_id: user.id,
        plan_json: dummyPlan,
      },
      {
        onConflict: "user_id",
      }
    )
    .select()
    .single();

  setGeneratingPlan(false);

  if (error) {
    console.error(error);
    alert("Failed to save AI Plan");
    return;
  }

  setAiPlan(data);

  alert("🎉 AI Plan saved successfully!");
}

async function loadAIPlan() {
  if (!user) return;

  const { data, error } = await supabase
    .from("ai_plans")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  console.log("AI Plan Loaded:", data);

  if (data) {
    setAiPlan(data);
  }
}

const currentWeight =
  weightHistory.length > 0
    ? weightHistory[weightHistory.length - 1].weight
    : 0;

const startingWeight =
  weightHistory.length > 0
    ? weightHistory[0].weight
    : 0;

const goalWeight = profile?.goal_weight_kg || 0;

const weightLost = startingWeight - currentWeight;

const remainingWeight = currentWeight - goalWeight;

const totalJourney = startingWeight - goalWeight;

const completedJourney = startingWeight - currentWeight;

const progressPercentage =
  totalJourney > 0
    ? Math.min((completedJourney / totalJourney) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-surface-black text-white pt-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
  <h1 className="text-4xl font-bold">
    Welcome {profile?.full_name || user?.email}
  </h1>

  {isPro && (
    <span className="inline-flex items-center w-fit px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold">
      🔥 BodyWise Pro Active
    </span>
  )}
</div>

{/* Personal AI Coach */}

<div className="mb-8 rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-surface-gray-900 to-surface-black p-8 shadow-xl">

  <div className="flex flex-col gap-8">

    <div className="w-full">

      <div className="inline-flex items-center gap-2 bg-red-500/15 text-red-400 px-4 py-2 rounded-full text-sm font-semibold mb-5">
        🤖 BodyWise AI
      </div>

      <h2 className="text-4xl font-bold mb-4">
        Your Personal AI Coach
      </h2>

      {aiPlan && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

    <div className="rounded-2xl bg-surface-gray-900 border border-white/10 p-6">

  <h3 className="text-2xl font-bold mb-5">
    🏋️ Today's Workout
  </h3>

  <div className="space-y-3">

    <p className="text-xl font-bold text-red-400 mb-1">
  {todayWorkout?.type || "Rest Day"}
</p>

<p className="text-sm text-surface-gray-400">
  {todayWorkout?.focus || "Recovery"}
</p>

  {todayWorkout?.exercises?.length ? (
  <div className="space-y-3">
    {todayWorkout.exercises.map(
      (exercise: any, index: number) => (
        <div
          key={index}
          className="bg-surface-black border border-white/5 rounded-xl p-4"
        >
          <div className="flex flex-col gap-4">

            <div>
              <p className="font-semibold text-white">
                {exercise.name}
              </p>

              {exercise.rest === "—" ? (
  <p className="text-sm text-surface-gray-400 mt-1">
    {exercise.reps}
  </p>
) : (
  <p className="text-sm text-surface-gray-400 mt-1">
    {exercise.sets} Sets × {exercise.reps} Reps
  </p>
)}

<div className="flex gap-3 mt-4">
  <div>
    <label className="text-xs text-surface-gray-400">
      Weight (kg)
    </label>

    <input
      type="number"
      min="0"
      step="0.5"
      placeholder="e.g. 60"
      value={exerciseWeights[exercise.name] || ""}
      onChange={(e) =>
        setExerciseWeights((prev) => ({
          ...prev,
          [exercise.name]: e.target.value,
        }))
      }
      className="mt-1 w-32 bg-surface-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white"
    />
  </div>

  <div>
    <label className="text-xs text-surface-gray-400">
      Reps Completed
    </label>

    <input
      type="number"
      min="0"
      placeholder="e.g. 10"
      value={exerciseReps[exercise.name] || ""}
      onChange={(e) =>
        setExerciseReps((prev) => ({
          ...prev,
          [exercise.name]: e.target.value,
        }))
      }
      className="mt-1 w-32 bg-surface-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white"
    />
  </div>
</div>

           </div>

            <div className="text-right">
              <p className="text-xs text-surface-gray-400">
                Rest
              </p>

              <p className="text-sm font-semibold text-red-400">
                {exercise.rest}
              </p>
            </div>

          </div>
        </div>
      )
    )}
  </div>
) : (
  <div className="mt-5 space-y-4">

    <div className="bg-surface-black border border-white/5 rounded-xl p-4">
      <p className="text-sm text-surface-gray-400">
        🚶 Recovery Activity
      </p>

      <p className="text-lg font-semibold text-white mt-1">
        {recoveryPlan.activity}
      </p>

      <p className="text-sm text-red-400 mt-1">
        {recoveryPlan.duration}
      </p>
    </div>

    <div className="bg-surface-black border border-white/5 rounded-xl p-4">
      <p className="text-sm text-surface-gray-400">
        😴 Recovery Focus
      </p>

      <p className="text-sm text-white mt-2 leading-relaxed">
        {recoveryPlan.focus}
      </p>
    </div>

    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
      <p className="text-sm text-red-400 font-semibold">
        💡 AI Coach Tip
      </p>

      <p className="text-sm text-surface-gray-300 mt-2 leading-relaxed">
        {recoveryPlan.coachTip}
      </p>
    </div>

    <div className="bg-surface-black border border-white/5 rounded-xl p-4">
      <p className="text-sm text-surface-gray-400 font-semibold mb-3">
        💧 Recovery Checklist
      </p>

      <div className="space-y-2">
        {recoveryPlan.checklist.map((item: string, index: number) => (
          <p
            key={index}
            className="text-sm text-surface-gray-300"
          >
            ✓ {item}
          </p>
        ))}
      </div>
    </div>

  </div>
)}
{todayWorkout?.exercises?.length ? (
  <button
    onClick={logWorkout}
    className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-3 rounded-lg"
  >
    Complete Workout
  </button>
) : null}

  </div>

</div>

   {/* Nutrition Card */}
<div className="rounded-2xl bg-surface-gray-900 border border-white/10 p-6">

  <h3 className="text-2xl font-bold mb-6">
    🥗 Today's Nutrition
  </h3>

 <div className="space-y-5 mt-6">
    {aiPlan?.plan_json?.nutrition?.meals?.map(
      (meal: any, index: number) => (
        <div key={index}>
          <p className="text-sm text-surface-gray-400 mb-1">
            {meal.name}
          </p>

          <p className="text-lg font-bold text-white">
            {meal.foods.join(" + ")}
          </p>

          <p className="text-sm text-surface-gray-400 mt-1">
            {meal.calories} kcal • {meal.protein}g protein
          </p>
        </div>
      )
    )}
  </div>

</div>

</div>
)}

<p className="text-surface-gray-300 text-lg leading-8">

        Your assessment has been completed successfully.

        Based on your body measurements, goals,
        nutrition, lifestyle, training preferences,
        and recovery profile, BodyWise AI will create
        a personalized fitness plan designed specifically
        for you.

      </p>

      <div className="flex flex-wrap gap-3 mt-6">

        <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400">
          ✅ Assessment Complete
        </span>

        <span className="px-4 py-2 rounded-full bg-red-500/10 text-red-400">
          🎯 Personalized
        </span>

        <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400">
          ⚡ AI Powered
        </span>

      </div>

    </div>

    <div className="flex flex-col items-center gap-4">

      <button 
  onClick={handleGenerateAIPlan}
  disabled={generatingPlan}
  className="bg-red-500 hover:bg-red-600 transition-all duration-300 px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 disabled:opacity-50"
>
  {generatingPlan
  ? "🧠 Generating Your AI Plan..."
  : aiPlan
  ? "🔄 Update My AI Plan"
  : "✨ Create My Personalized Plan"}
</button>

      <p className="text-sm text-surface-gray-400 text-center">

        Workout • Nutrition • Recovery • Progress

      </p>

    </div>

  </div>

</div>

     <div className="grid lg:col-span-12 gap-6">

          <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-3">
            <h3 className="text-surface-gray-400">Current Weight</h3>
            <p className="text-3xl font-bold mt-2">
              {profile?.current_weight_kg || '--'} kg
            </p>
          </div>

  <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-3">

  <h3 className="text-surface-gray-400">
     Protein Target
    </h3>

    <p className="text-3xl font-bold mt-2">
      {proteinTarget} g
    </p>

  </div>

<div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-3">
  <h3 className="text-surface-gray-400">Water Intake</h3>
  <p className="text-3xl font-bold mt-2">
    {waterIntake} L
  </p>
</div>

<div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-3">
  <h3 className="text-surface-gray-400">Daily Steps Goal</h3>
  <p className="text-3xl font-bold mt-2">
    {dailySteps.toLocaleString()}
  </p>
</div>

          <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-3">
            <h3 className="text-surface-gray-400">Goal Weight</h3>
            <p className="text-3xl font-bold mt-2">
              {profile?.goal_weight_kg || '--'} kg
            </p>
          </div>

          <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-3">
            <h3 className="text-surface-gray-400">BMI</h3>
            <p className="text-3xl font-bold mt-2">
              {bmi}
            </p>
          </div>

          <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-3">
            <h3 className="text-surface-gray-400">Body Fat %</h3>
            <p className="text-3xl font-bold mt-2">
              {bodyFat}%
            </p>
          </div>

          <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-3">
            <h3 className="text-surface-gray-400">Fitness Score</h3>
            <p className="text-3xl font-bold mt-2">
               {fitnessScore}/100
           </p>
        </div>

          <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-4">
            <h3 className="text-surface-gray-400">Daily Calories</h3>
            <p className="text-3xl font-bold mt-2">
             {calories} kcal
           </p>
           </div>

         
          <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-8">
            <h3 className="text-surface-gray-400">Workout Streak</h3>
            <p className="text-3xl font-bold mt-2">
              {workoutStreak} Days
            </p>
          </div>

         <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-4">
          <h3 className="text-surface-gray-400">Weight Tracker</h3>

           <input
              type="number"
              placeholder="Enter Weight (kg)"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="mt-3 w-full p-2 rounded bg-gray-800 text-white"
            />

           <button
              onClick={saveWeight}
              className="mt-3 bg-red-500 px-4 py-2 rounded-lg"
            >
          Save Weight
        </button>
      </div>

      {workoutHistory.length > 0 && (
  <div className="mt-6 bg-surface-gray-900 p-6 rounded-2xl lg:col-span-12">
    <h3 className="text-xl font-bold mb-4">
      📈 Workout History
    </h3>

    <div className="space-y-4">
      {workoutHistory.map((workout: any) => (
        <div
          key={workout.id}
          className="bg-surface-black border border-white/5 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
  <p className="font-semibold text-white">
    {workout.workout_date}
  </p>

  <button
    onClick={() => deleteWorkout(workout.id)}
    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm font-semibold"
  >
    🗑️ Delete
  </button>
</div>

          {workout.workout_exercises?.map(
            (exercise: any, index: number) => (
              <p
                key={index}
                className="text-sm text-surface-gray-400 mt-2"
              >
                {exercise.exercise_name} • {exercise.weight_kg} kg ×{" "}
                {exercise.reps} reps
              </p>
            )
          )}
        </div>
      ))}
    </div>
  </div>
)}

        <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-8">
        <h3 className="text-surface-gray-400 mb-4">Calories & Macro Tracker</h3>
        <label className="block text-xs text-gray-400 mb-1">
         Food Name
        </label>

        <input
           placeholder="Paneer, Chicken Breast..."
           value={foodName}
           onChange={(e) => setFoodName(e.target.value)}
           className="w-full p-2 mb-2 rounded bg-gray-800"
         />

       <button
         onClick={() => autoFillFood(foodName)}
         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mb-2"
         >
         Auto Fill Nutrition
      </button>
  
  
       <label className="block text-sm text-gray-400 mb-1">
        Quantity (g)
      </label>

  <input
  type="number"
  placeholder="Quantity (g)"
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
  className="w-full p-2 mb-2 rounded bg-gray-800"
/>

 <hr className="my-4 border-gray-700" />

<div className="space-y-2 text-base">

  <p className="flex justify-between">
    <span className="text-gray-400">🔥 Calories</span>
    <span className="font-semibold">
      {caloriesInput || "--"} kcal
    </span>
  </p>

  <p className="flex justify-between">
    <span className="text-gray-400">💪 Protein</span>
    <span className="font-semibold">
      {proteinInput || "--"} g
    </span>
  </p>

  <p className="flex justify-between">
    <span className="text-gray-400">🍚 Carbs</span>
    <span className="font-semibold">
      {carbsInput || "--"} g
    </span>
  </p>

  <p className="flex justify-between">
    <span className="text-gray-400">🥑 Fat</span>
    <span className="font-semibold">
      {fatInput || "--"} g
    </span>
  </p>

</div>

<hr className="my-4 border-gray-700" />

  <button
  onClick={saveFoodLog}
  className="mt-1 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg text-white font-semibold"
>
  ➕ Add Food
</button>

<button
  onClick={clearFoodForm}
  className="mt-1 ml-3 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg text-white font-semibold"
>
  🔄 Clear
</button>
</div>

<div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-4">
  <h3 className="text-surface-gray-400 mb-4">
    Daily Totals
  </h3>

<div className="space-y-4">

  {/* Calories */}
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>🔥 Calories</span>
      <span>{totalCalories} / 2200 kcal</span>
    </div>

    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-red-500 h-2 rounded-full"
        style={{
          width: `${Math.min((totalCalories / 2200) * 100, 100)}%`,
        }}
      />
    </div>
  </div>

  {/* Protein */}
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>💪 Protein</span>
      <span>{totalProtein} / 200 g</span>
    </div>

    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-green-500 h-2 rounded-full"
        style={{
          width: `${Math.min((totalProtein / 200) * 100, 100)}%`,
        }}
      />
    </div>
  </div>

  {/* Carbs */}
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>🍚 Carbs</span>
      <span>{totalCarbs} / 180 g</span>
    </div>

    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-yellow-500 h-2 rounded-full"
        style={{
          width: `${Math.min((totalCarbs / 180) * 100, 100)}%`,
        }}
      />
    </div>
  </div>

  {/* Fat */}
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>🥑 Fat</span>
      <span>{totalFat} / 70 g</span>
    </div>

    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-blue-500 h-2 rounded-full"
        style={{
          width: `${Math.min((totalFat / 70) * 100, 100)}%`,
        }}
      />
    </div>
  </div>
 </div>
</div>
<div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-12">
  <h3 className="text-surface-gray-400 mb-4">
    Food History
  </h3>

  <div className="max-h-[350px] overflow-y-auto space-y-3">
    {foodLogs.map((food: any) => (
      <div
        key={food.id}
        className="bg-gray-800 p-3 rounded-lg text-sm"
      >
      <div className="flex justify-between items-start">

  <p className="font-bold">
    {food.food_name}
  </p>

  <button
    onClick={() => deleteFoodLog(food.id)}
    className="text-red-500 hover:text-red-400"
  >
    🗑
  </button>

</div>

        <p className="text-gray-300">
  {food.quantity || 100}g •
  🔥 {food.calories} kcal •
  💪 {food.protein}g •
  🍚 {food.carbs}g •
  🥑 {food.fat}g
</p>
      </div>
    ))}
  </div>
</div>

<div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-12">
  <h3 className="text-surface-gray-400 mb-4">
    Transformation Photos
  </h3>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setPhotoFile(e.target.files?.[0] || null)
    }
    className="w-full"
  />

  <button
    onClick={uploadTransformationPhoto}
    className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
  >
    Upload Photo
  </button>

<p className="mt-4 text-sm text-gray-400">
  🔥 Your transformation is already in progress. Stay consistent, trust the process, and keep showing up — BodyWise is with you every step of the way.
</p>

  <div className="mt-4 flex flex-wrap gap-4">
  {photos.map((photo, index) => (
    <div key={photoIds[index]} className="relative">
      <img
        src={photo}
        alt="Transformation"
        className="w-40 h-40 object-cover rounded-lg"
      />

      <button
        onClick={() =>
          deleteTransformationPhoto(photoIds[index], photo)
        }
        className="mt-2 w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm font-semibold"
      >
        🗑️ Delete
      </button>
    </div>
  ))}
</div>

</div>

<div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-12">
  <h3 className="text-2xl font-bold mb-6">
    📊 Weight Summary
  </h3>

  <div className="grid md:grid-cols-5 gap-4">

    <div className="bg-black p-4 rounded-xl">
      <p className="text-gray-400">Current</p>
      <p className="text-3xl font-bold">{currentWeight} kg</p>
    </div>

    <div className="bg-black p-4 rounded-xl">
      <p className="text-gray-400">Starting</p>
      <p className="text-3xl font-bold">{startingWeight} kg</p>
    </div>

    <div className="bg-black p-4 rounded-xl">
      <p className="text-gray-400">Goal</p>
      <p className="text-3xl font-bold">{goalWeight} kg</p>
    </div>

    <div className="bg-black p-4 rounded-xl">
      <p className="text-gray-400">Lost</p>
      <p className="text-3xl font-bold text-green-400">
        {weightLost.toFixed(1)} kg
      </p>
    </div>

    <div className="bg-black p-4 rounded-xl">
      <p className="text-gray-400">Remaining</p>
      <p className="text-3xl font-bold text-red-400">
        {remainingWeight.toFixed(1)} kg
      </p>
    </div>

  </div>
</div>

<div className="bg-surface-gray-900 p-6 rounded-2xl mt-6 lg:col-span-12">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-2xl font-bold text-white">
      🎯 Goal Progress
    </h3>

    <span className="text-red-400 text-xl font-bold">
      {progressPercentage.toFixed(1)}%
    </span>
  </div>

  <div className="w-full bg-gray-700 rounded-full h-5">
    <div
      className="bg-red-500 h-5 rounded-full transition-all duration-700"
      style={{
        width: `${progressPercentage}%`,
      }}
    />
  </div>

  <p className="text-gray-400 mt-4 text-lg">
    {weightLost.toFixed(1)} kg lost of {(startingWeight - goalWeight).toFixed(1)} kg goal
  </p>
</div>
     <div className="bg-surface-gray-900 p-6 rounded-2xl lg:col-span-12">
  <h3 className="text-surface-gray-400 mb-4">
    Weight Progress
  </h3>

  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <LineChart data={weightHistory}>
        <XAxis
  dataKey="week"
  tickFormatter={(date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    })
  }
/>
        <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
        <Tooltip />
        <Line
  type="monotone"
  dataKey="weight"
  stroke="#ef4444"
  strokeWidth={3}
  dot={{ r: 5 }}
  activeDot={{ r: 7 }}
  animationDuration={1200}
/>
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>

        </div>
      </div>
   </div>
  );
 }
