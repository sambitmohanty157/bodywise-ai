import { useState, useEffect } from 'react';

import {User,Ruler,Target,Activity,UtensilsCrossed,Loader2,ArrowLeft,Zap,Check,AlertCircle,Save} from "lucide-react";

import { supabase } from '../lib/supabase';

import type { User as SupabaseUser } from '@supabase/supabase-js';

import SectionHeader from "./SectionHeader";



interface ProfileSetupProps {

  user: SupabaseUser | null;

  onBack: () => void;

}



type FormStatus = 'idle' | 'loading' | 'success' | 'error';



interface ProfileData {

  full_name: string;

  age: string;

  gender: string;

  height_cm: string;

  current_weight_kg: string;

  goal_weight_kg: string;



  fitness_goal: string;

  activity_level: string;



  // Nutrition

  diet_preference: string;

  meals_per_day: string;

  water_intake: string;

  food_allergies: string;

  food_restrictions: string;



  // Training

workout_location: string;

experience_level: string;

workout_days: string;

workout_duration: string;



// Recovery

sleep_duration: string;

sleep_quality: string;

energy_level: string;

routine_stress: string;

injuries: string;

medical_conditions: string;

}



const fitnessGoals = [

  { value: 'fat_loss', label: 'Fat Loss' },

  { value: 'body_recomposition', label: 'Body Recomposition' },

  { value: 'muscle_gain', label: 'Muscle Gain' },

  { value: 'maintenance', label: 'Maintenance' },

];



export default function ProfileSetup({

  user,

  onBack,

}: ProfileSetupProps) {



const [form, setForm] = useState<ProfileData>({

  full_name: '',

  age: '',

  gender: '',

  height_cm: '',

  current_weight_kg: '',

  goal_weight_kg: '',

  fitness_goal: '',

  activity_level: '',



  // Nutrition

  diet_preference: '',

  meals_per_day: '3',

  water_intake: '3',

  food_allergies: '',

  food_restrictions: '',



  // Training

workout_location: "",

experience_level: "",

workout_days: "4",

workout_duration: "60",



// Recovery

sleep_duration: "",

sleep_quality: "",

energy_level: "",

routine_stress: "",

injuries: "",

medical_conditions: "",

});

  const [status, setStatus] = useState<FormStatus>('idle');

  const [errorMessage, setErrorMessage] = useState('');

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [isExisting, setIsExisting] = useState(false);

  const [loadingProfile, setLoadingProfile] = useState(true);



  useEffect(() => {

    if (!user || !supabase) {

      setLoadingProfile(false);

      return;

    }



    const userId = user.id;

const userMetadata = user.user_metadata;



    async function loadProfile() {

      const { data, error } = await supabase

        .from('user_profiles')

        .select('*')

        .eq('id', userId)

        .maybeSingle();



      if (error) {

        setLoadingProfile(false);

        return;

      }



      if (data) {

        setIsExisting(true);

        setForm({

  full_name: data.full_name || '',

  age: data.age?.toString() || '',

  gender: data.gender || '',

  height_cm: data.height_cm?.toString() || '',

  current_weight_kg: data.current_weight_kg?.toString() || '',

  goal_weight_kg: data.goal_weight_kg?.toString() || '',

  fitness_goal: data.fitness_goal || '',

  activity_level: data.activity_level || '',



  // Nutrition

  diet_preference: data.diet_preference || '',

  meals_per_day: data.meals_per_day?.toString() || '3',

  water_intake: data.water_intake?.toString() || '3',

  food_allergies: data.food_allergies || '',

  food_restrictions: data.food_restrictions || '',



  workout_location: data.workout_location || "",

experience_level: data.experience_level || "",

workout_days: data.workout_days?.toString() || "4",

workout_duration: data.workout_duration?.toString() || "60",



sleep_duration: data.sleep_duration || "",

sleep_quality: data.sleep_quality || "",

energy_level: data.energy_level || "",

routine_stress: data.routine_stress || "",

injuries: data.injuries || "",

medical_conditions: data.medical_conditions || "",

});

      } else {

        const fullName = userMetadata?.full_name || '';

        setForm((f) => ({ ...f, full_name: fullName }));

      }



      setLoadingProfile(false);

    }



    loadProfile();

  }, [user]);



  function handleChange(field: keyof ProfileData, value: string) {

    setForm((prev) => ({ ...prev, [field]: value }));

  }



  function handleBlur(field: string) {

    setTouched((t) => ({ ...t, [field]: true }));

  }



  function validate(): string | null {

    if (!form.full_name.trim()) return 'Full name is required.';

    if (!form.age.trim()) return 'Age is required.';

    const ageNum = parseInt(form.age, 10);

    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) return 'Please enter a valid age (10-120).';

    if (!form.gender) return 'Please select a gender.';

    if (!form.height_cm.trim()) return 'Height is required.';

    const heightNum = parseFloat(form.height_cm);

    if (isNaN(heightNum) || heightNum < 50 || heightNum > 300) return 'Please enter a valid height (50-300 cm).';

    if (!form.current_weight_kg.trim()) return 'Current weight is required.';

    const cwNum = parseFloat(form.current_weight_kg);

    if (isNaN(cwNum) || cwNum < 20 || cwNum > 500) return 'Please enter a valid weight (20-500 kg).';

    if (!form.goal_weight_kg.trim()) return 'Goal weight is required.';

    const gwNum = parseFloat(form.goal_weight_kg);

    if (isNaN(gwNum) || gwNum < 20 || gwNum > 500) return 'Please enter a valid goal weight (20-500 kg).';

    if (!form.fitness_goal) return 'Please select a fitness goal.';

    return null;

  }



  function fieldError(field: string): string | null {

    if (!touched[field]) return null;

    switch (field) {

      case 'full_name':

        if (!form.full_name.trim()) return 'Full name is required.';

        return null;

      case 'age': {

        if (!form.age.trim()) return 'Age is required.';

        const ageNum = parseInt(form.age, 10);

        if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) return 'Valid age is 10-120.';

        return null;

      }

      case 'gender':

        if (!form.gender) return 'Please select a gender.';

        return null;

      case 'height_cm': {

        if (!form.height_cm.trim()) return 'Height is required.';

        const h = parseFloat(form.height_cm);

        if (isNaN(h) || h < 50 || h > 300) return 'Valid height is 50-300 cm.';

        return null;

      }

      case 'current_weight_kg': {

        if (!form.current_weight_kg.trim()) return 'Current weight is required.';

        const w = parseFloat(form.current_weight_kg);

        if (isNaN(w) || w < 20 || w > 500) return 'Valid weight is 20-500 kg.';

        return null;

      }

      case 'goal_weight_kg': {

        if (!form.goal_weight_kg.trim()) return 'Goal weight is required.';

        const w = parseFloat(form.goal_weight_kg);

        if (isNaN(w) || w < 20 || w > 500) return 'Valid weight is 20-500 kg.';

        return null;

      }

      case 'fitness_goal':

        if (!form.fitness_goal) return 'Please select a fitness goal.';

        return null;

      default:

        return null;

    }

  }



  function inputClass(field: string): string {

    const err = fieldError(field);

    const base = 'w-full bg-surface-gray-800/60 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-surface-gray-600 focus:outline-none transition-colors duration-200 backdrop-blur-sm';

    if (err) return `${base} border-brand-red/60 focus:border-brand-red`;

    return `${base} border-white/[0.06] focus:border-brand-red/50`;

  }



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTouched({
      full_name: true,
      age: true,
      gender: true,
      height_cm: true,
      current_weight_kg: true,
      goal_weight_kg: true,
      fitness_goal: true,
    });

    const error = validate();
    if (error) {
      setStatus('error');
      setErrorMessage(error);
      return;
    }

    if (!supabase || !user) {
      setStatus('error');
      setErrorMessage('You must be signed in to save your profile.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const payload = {
      id: user.id,
      full_name: form.full_name.trim(),
      age: parseInt(form.age, 10),
      gender: form.gender,
      height_cm: parseFloat(form.height_cm),
      current_weight_kg: parseFloat(form.current_weight_kg),
      goal_weight_kg: parseFloat(form.goal_weight_kg),
      fitness_goal: form.fitness_goal,
      activity_level: form.activity_level,
      diet_preference: form.diet_preference,
      meals_per_day: parseInt(form.meals_per_day, 10),
      water_intake: parseInt(form.water_intake, 10),
      food_allergies: form.food_allergies,
      food_restrictions: form.food_restrictions,
      workout_location: form.workout_location,
      experience_level: form.experience_level,
      workout_days: parseInt(form.workout_days, 10),
      workout_duration: parseInt(form.workout_duration, 10),
      sleep_duration: form.sleep_duration,
      sleep_quality: form.sleep_quality,
      energy_level: form.energy_level,
      routine_stress: form.routine_stress,
      injuries: form.injuries,
      medical_conditions: form.medical_conditions,
      updated_at: new Date().toISOString(),
    };

    if (isExisting) {
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .update(payload)
        .eq('id', user.id);

      if (upsertError) {
        setStatus('error');
        setErrorMessage(upsertError.message || 'Failed to update profile.');
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          ...payload,
          created_at: new Date().toISOString(),
          trial_start_date: new Date().toISOString(),
          trial_end_date: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        });

      if (insertError) {
        setStatus('error');
        setErrorMessage(insertError.message || 'Failed to create profile.');
        return;
      }

      setIsExisting(true);
    }

    // Track successful profile completion in Google Analytics
    if (
      typeof window !== 'undefined' &&
      typeof window.gtag === 'function'
    ) {
      window.gtag('event', 'profile_completed', {
        method: isExisting ? 'update' : 'create',
      });
    }

    setStatus('success');
  }

  if (loadingProfile) {

    return (

      <div className="min-h-screen bg-surface-black flex items-center justify-center">

        <Loader2 className="w-8 h-8 text-brand-red animate-spin" />

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-surface-black pt-24 pb-16">

      <div className="section-container max-w-2xl">

        <button

          onClick={onBack}

          className="flex items-center gap-2 text-sm text-surface-gray-400 hover:text-brand-red transition-colors duration-200 mb-6"

        >

          <ArrowLeft className="w-4 h-4" />

          Back

        </button>



        <div className="bg-surface-gray-900 border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 animate-fade-in">

          {/* Header */}

          <div className="relative px-8 pt-8 pb-5 border-b border-white/[0.04]">

            <div className="flex items-center gap-2.5 mb-4">

              <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">

                <Zap className="w-4 h-4 text-white" />

              </div>

              <span className="text-lg font-extrabold">

                Body<span className="text-brand-red">Wise</span> AI

              </span>

            </div>

            <h2 className="text-2xl font-bold mb-1">

            🤖 AI Fitness Assessment

            </h2>

            <p className="text-surface-gray-400 leading-6">

            Complete your AI Fitness Assessment once.

            BodyWise AI will generate a personalized workout,

            nutrition plan, calorie target and track your progress automatically.

            </p>

          </div>





          {/* Body */}

          <div className="px-8 py-6">

            {status === 'success' ? (

              <div className="text-center py-4">

                <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">

                  <Check className="w-8 h-8 text-green-400" />

                </div>

                <h3 className="text-lg font-bold mb-2">Profile saved!</h3>

                <p className="text-sm text-surface-gray-400 mb-6">

                  Your profile has been {isExisting ? 'updated' : 'created'} successfully.

                </p>

                <button

                  onClick={onBack}

                  className="btn-primary w-full text-base"

                >

                  Continue

                </button>

              </div>

            ) : (

              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>



 <SectionHeader

  icon={<User className="w-5 h-5 text-red-500" />}

  title="Personal Information"

  subtitle="Tell us about yourself."

/>

                {/* Full Name */}

                <div>

                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">

                    Full Name

                  </label>

                  <input

                    type="text"

                    value={form.full_name}

                    onChange={(e) => handleChange('full_name', e.target.value)}

                    onBlur={() => handleBlur('full_name')}

                    className={inputClass('full_name')}

                    placeholder="Enter your full name"

                    disabled={status === 'loading'}

                  />

                  {fieldError('full_name') && (

                    <p className="text-xs text-brand-red mt-1">{fieldError('full_name')}</p>

                  )}

                </div>



                {/* Age & Gender row */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">

                      Age

                    </label>

                    <input

                      type="number"

                      value={form.age}

                      onChange={(e) => handleChange('age', e.target.value)}

                      onBlur={() => handleBlur('age')}

                      className={inputClass('age')}

                      placeholder="Years"

                      min={10}

                      max={120}

                      disabled={status === 'loading'}

                    />

                    {fieldError('age') && (

                      <p className="text-xs text-brand-red mt-1">{fieldError('age')}</p>

                    )}

                  </div>



                  <div>

                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">

                      Gender

                    </label>

                    <select

                      value={form.gender}

                      onChange={(e) => handleChange('gender', e.target.value)}

                      onBlur={() => handleBlur('gender')}

                      className={`${inputClass('gender')} appearance-none cursor-pointer`}

                      disabled={status === 'loading'}

                    >

                      <option value="" disabled className="bg-surface-gray-900 text-surface-gray-600">

                        Select gender

                      </option>

                      <option value="male" className="bg-surface-gray-900 text-white">Male</option>

                      <option value="female" className="bg-surface-gray-900 text-white">Female</option>

                      <option value="other" className="bg-surface-gray-900 text-white">Other</option>

                    </select>

                    {fieldError('gender') && (

                      <p className="text-xs text-brand-red mt-1">{fieldError('gender')}</p>

                    )}

                  </div>

                </div>

<SectionHeader

  icon={<Ruler className="w-5 h-5 text-red-500" />}

  title="Body Measurements"

  subtitle="Help us calculate your calorie needs."

/>



                {/* Height */}

                <div>

                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">

                    Height (cm)

                  </label>

                  <input

                    type="number"

                    step="0.1"

                    value={form.height_cm}

                    onChange={(e) => handleChange('height_cm', e.target.value)}

                    onBlur={() => handleBlur('height_cm')}

                    className={inputClass('height_cm')}

                    placeholder="e.g. 175"

                    disabled={status === 'loading'}

                  />

                  {fieldError('height_cm') && (

                    <p className="text-xs text-brand-red mt-1">{fieldError('height_cm')}</p>

                  )}

                </div>



                {/* Current & Goal Weight row */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>

                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">

                      Current Weight (kg)

                    </label>

                    <input

                      type="number"

                      step="0.1"

                      value={form.current_weight_kg}

                      onChange={(e) => handleChange('current_weight_kg', e.target.value)}

                      onBlur={() => handleBlur('current_weight_kg')}

                      className={inputClass('current_weight_kg')}

                      placeholder="e.g. 75"

                      disabled={status === 'loading'}

                    />

                    {fieldError('current_weight_kg') && (

                      <p className="text-xs text-brand-red mt-1">{fieldError('current_weight_kg')}</p>

                    )}

                  </div>



                  <div>

                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-1.5">

                      Goal Weight (kg)

                    </label>

                    <input

                      type="number"

                      step="0.1"

                      value={form.goal_weight_kg}

                      onChange={(e) => handleChange('goal_weight_kg', e.target.value)}

                      onBlur={() => handleBlur('goal_weight_kg')}

                      className={inputClass('goal_weight_kg')}

                      placeholder="e.g. 70"

                      disabled={status === 'loading'}

                    />

                    {fieldError('goal_weight_kg') && (

                      <p className="text-xs text-brand-red mt-1">{fieldError('goal_weight_kg')}</p>

                    )}

                  </div>

                </div>

<SectionHeader

  icon={<Target className="w-5 h-5 text-red-500" />}

  title="Fitness Goal"

  subtitle="Choose your primary fitness objective."

/>



                {/* Fitness Goal */}

                <div>

                  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">

                    Fitness Goal

                  </label>

                  <div className="grid grid-cols-3 gap-3">

                    {fitnessGoals.map((goal) => {

                      const selected = form.fitness_goal === goal.value;

                      return (

                        <button

                          key={goal.value}

                          type="button"

                          onClick={() => handleChange('fitness_goal', goal.value)}

                          onBlur={() => handleBlur('fitness_goal')}

                          className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 transition-all duration-200 ${

                            selected

                              ? 'border-brand-red/60 bg-brand-red/10 shadow-[0_0_20px_rgba(229,57,53,0.1)]'

                              : 'border-white/[0.06] bg-surface-gray-800/40 hover:border-surface-gray-600 hover:bg-surface-gray-800/60'

                          }`}

                          disabled={status === 'loading'}

                        >

                          {selected && (

                            <div className="absolute top-2 right-2">

                              <div className="w-4 h-4 bg-brand-red rounded-full flex items-center justify-center">

                                <Check className="w-2.5 h-2.5 text-white" />

                              </div>

                            </div>

                          )}

                          <span

                            className={`text-xs font-semibold text-center ${

                              selected ? 'text-brand-red' : 'text-surface-gray-400'

                            }`}

                          >

                            {goal.label}

                          </span>

                        </button>

                      );

                    })}

                  </div>

                  {fieldError('fitness_goal') && (

                    <p className="text-xs text-brand-red mt-2">{fieldError('fitness_goal')}</p>

                  )}

                </div>



                <SectionHeader

  icon={<Activity className="w-5 h-5 text-red-500" />}

  title="Lifestyle"

  subtitle="Tell us about your daily lifestyle."

/>



                <div className="mt-8">

  <h3 className="text-lg font-semibold text-white mb-4">

    Activity Level

  </h3>



  <select

    value={form.activity_level}

    onChange={(e) =>

      setForm({ ...form, activity_level: e.target.value })

    }

    className="w-full bg-surface-black border border-gray-700 rounded-xl px-4 py-3 text-white"

  >

    <option value="">Select Activity Level</option>

    <option value="sedentary">Sedentary</option>

    <option value="light">Lightly Active</option>

    <option value="moderate">Moderately Active</option>

    <option value="active">Very Active</option>

    <option value="athlete">Athlete</option>

  </select>

</div>



<SectionHeader

  icon={<UtensilsCrossed className="w-5 h-5 text-red-500" />}

  title="Nutrition"

  subtitle="Help us understand your eating habits."

/>

{/* Diet Preference */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Diet Preference

  </label>



  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">



    {[

      { value: "vegetarian", label: "🥦 Vegetarian" },

      { value: "non_vegetarian", label: "🍗 Non-Vegetarian" },

      { value: "vegan", label: "🌱 Vegan" },

    ].map((diet) => {



      const selected = form.diet_preference === diet.value;



      return (

        <button

          key={diet.value}

          type="button"

          onClick={() => handleChange("diet_preference", diet.value)}

          className={`rounded-xl border px-4 py-4 transition-all duration-200

          ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

        >

          {diet.label}

        </button>

      );

    })}

  </div>

</div>



{/* Meals Per Day */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">

    Meals Per Day

  </label>



  <select

    value={form.meals_per_day}

    onChange={(e) => handleChange("meals_per_day", e.target.value)}

    className="w-full bg-surface-black border border-gray-700 rounded-xl px-4 py-3 text-white"

  >

    <option value="2">2 Meals</option>

    <option value="3">3 Meals</option>

    <option value="4">4 Meals</option>

    <option value="5">5 Meals</option>

    <option value="6">6 Meals</option>

  </select>

</div>



{/* Water Intake */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">

    Daily Water Intake

  </label>



  <select

    value={form.water_intake}

    onChange={(e) => handleChange("water_intake", e.target.value)}

    className="w-full bg-surface-black border border-gray-700 rounded-xl px-4 py-3 text-white"

  >

    <option value="1">1 Liter</option>

    <option value="2">2 Liters</option>

    <option value="3">3 Liters</option>

    <option value="4">4 Liters</option>

    <option value="5">5 Liters</option>

    <option value="6">6 Liters</option>

  </select>

</div>



{/* Food Allergies */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Food Allergies

  </label>



  <div className="flex flex-wrap gap-3">



    {[

      "None",

      "Peanuts",

      "Dairy",

      "Eggs",

      "Gluten",

      "Fish",

      "Shellfish",

      "Soy",

    ].map((item) => {



    const selected =

     form.food_allergies

    .split(",")

    .map((value) => value.trim())

    .includes(item);



      return (

        <button

          key={item}

          type="button"

          onClick={() => {

  const current = form.food_allergies

    .split(",")

    .map((value) => value.trim())

    .filter(Boolean);



  if (item === "None") {

    handleChange("food_allergies", "None");

    return;

  }



  const withoutNone = current.filter(

    (value) => value !== "None"

  );



  const updated = withoutNone.includes(item)

    ? withoutNone.filter((value) => value !== item)

    : [...withoutNone, item];



  handleChange(

    "food_allergies",

    updated.join(", ")

  );

}}

          className={`px-4 py-2 rounded-full border transition-all duration-200

          ${

            selected

              ? "bg-brand-red border-brand-red text-white"

              : "border-gray-700 text-gray-300 hover:border-brand-red"

          }`}

        >

          {item}

        </button>

      );

    })}

  </div>

</div>



{/* Food Restrictions */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Food Restrictions

  </label>



  <div className="flex flex-wrap gap-3">



    {[

      "None",

      "No Beef",

      "No Pork",

      "No Onion",

      "No Garlic",

      "No Spicy Food",

      "No Seafood",

    ].map((item) => {



    const selected =

    form.food_restrictions

    .split(",")

    .map((value) => value.trim())

    .includes(item);



      return (

        <button

          key={item}

          type="button"

          onClick={() => {

  const current = form.food_restrictions

    .split(",")

    .map((value) => value.trim())

    .filter(Boolean);



  if (item === "None") {

    handleChange("food_restrictions", "None");

    return;

  }



  const withoutNone = current.filter(

    (value) => value !== "None"

  );



  const updated = withoutNone.includes(item)

    ? withoutNone.filter((value) => value !== item)

    : [...withoutNone, item];



  handleChange(

    "food_restrictions",

    updated.join(", ")

  );

}}

          className={`px-4 py-2 rounded-full border transition-all duration-200

          ${

            selected

              ? "bg-brand-red border-brand-red text-white"

              : "border-gray-700 text-gray-300 hover:border-brand-red"

          }`}

        >

          {item}

        </button>

      );

    })}

  </div>

</div>



<SectionHeader

  icon={<Activity className="w-5 h-5 text-red-500" />}

  title="Training"

  subtitle="Tell us about your workout routine."

/>

<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Workout Location

  </label>



  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">



    {[

      { value: "gym", label: "🏋️ Gym" },

      { value: "home", label: "🏠 Home" },

      { value: "both", label: "🔄 Both" },

    ].map((item) => {



      const selected =

        form.workout_location === item.value;



      return (

        <button

          key={item.value}

          type="button"

          onClick={() =>

            handleChange("workout_location", item.value)

          }

          className={`rounded-xl border px-4 py-4 transition-all duration-200

          ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

        >

          {item.label}

        </button>

      );

    })}

  </div>

</div>



{/* Experience Level */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Experience Level

  </label>



  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

    {[

      { value: "beginner", label: "🌱 Beginner" },

      { value: "intermediate", label: "💪 Intermediate" },

      { value: "advanced", label: "🔥 Advanced" },

    ].map((item) => {



      const selected =

        form.experience_level === item.value;



      return (

        <button

          key={item.value}

          type="button"

          onClick={() =>

            handleChange("experience_level", item.value)

          }

          className={`rounded-xl border px-4 py-4 transition-all duration-200 ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

          disabled={status === "loading"}

        >

          {item.label}

        </button>

      );

    })}

   </div>

</div>



{/* Workout Days */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Workout Days Per Week

  </label>



  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">

    {[

      { value: "2", label: "2 Days" },

      { value: "3", label: "3 Days" },

      { value: "4", label: "4 Days" },

      { value: "5", label: "5 Days" },

      { value: "6", label: "6 Days" },

    ].map((item) => {

      const selected = form.workout_days === item.value;



      return (

        <button

          key={item.value}

          type="button"

          onClick={() =>

            handleChange("workout_days", item.value)

          }

          className={`rounded-xl border px-3 py-4 transition-all duration-200 ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

          disabled={status === "loading"}

        >

          {item.label}

        </button>

      );

    })}

  </div>

</div>



{/* Workout Duration */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Workout Duration

  </label>



  <div className="grid grid-cols-4 gap-3">

    {[

      { value: "30", label: "30 min" },

      { value: "45", label: "45 min" },

      { value: "60", label: "60 min" },

      { value: "90", label: "90 min" },

    ].map((item) => {

      const selected = form.workout_duration === item.value;



      return (

        <button

          key={item.value}

          type="button"

          onClick={() =>

            handleChange("workout_duration", item.value)

          }

          className={`rounded-xl border px-4 py-4 transition-all duration-200 ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

          disabled={status === "loading"}

        >

          {item.label}

        </button>

      );

    })}

  </div>

</div>



<SectionHeader 

  icon={<Activity className="w-5 h-5 text-red-500" />} 

  title="Recovery" 

  subtitle="Help us understand your recovery and health." 

/>

<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Sleep Duration

  </label>



  <div className="grid grid-cols-2 gap-3">



    {[

      "<5 Hours",

      "5-6 Hours",

      "7-8 Hours",

      "8+ Hours",

    ].map((item) => {



      const selected = form.sleep_duration === item;



      return (

        <button

          key={item}

          type="button"

          onClick={() => handleChange("sleep_duration", item)}

          className={`rounded-xl border px-4 py-4 transition-all duration-200 ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

        >

          😴 {item}

        </button>

      );

    })}

  </div>

</div>



{/* Sleep Quality */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Sleep Quality

  </label>



  <div className="grid grid-cols-2 gap-3">



    {[

      { value: "Poor", label: "😞 Poor" },

      { value: "Average", label: "😐 Average" },

      { value: "Good", label: "😊 Good" },

      { value: "Excellent", label: "🌙 Excellent" },

    ].map((item) => {



      const selected = form.sleep_quality === item.value;



      return (

        <button

          key={item.value}

          type="button"

          onClick={() => handleChange("sleep_quality", item.value)}

          className={`rounded-xl border px-4 py-4 transition-all duration-200 ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

        >

          {item.label}

        </button>

      );

    })}



  </div>

</div>



{/* Daily Energy Level */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Daily Energy Level

  </label>



  <div className="grid grid-cols-3 gap-3">



    {[

      { value: "Low", label: "🔴 Low" },

      { value: "Moderate", label: "🟡 Moderate" },

      { value: "High", label: "🟢 High" },

    ].map((item) => {



      const selected = form.energy_level === item.value;



      return (

        <button

          key={item.value}

          type="button"

          onClick={() => handleChange("energy_level", item.value)}

          className={`rounded-xl border px-4 py-4 transition-all duration-200 ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

        >

          {item.label}

        </button>

      );

    })}



  </div>

</div>



{/* Daily Routine Stress */}



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Daily Routine Stress

  </label>



  <div className="grid grid-cols-2 gap-3">



    {[

      { value: "Relaxed", label: "😊 Relaxed" },

      { value: "Manageable", label: "🙂 Manageable" },

      { value: "Busy", label: "😓 Busy" },

      { value: "Very Stressful", label: "😫 Very Stressful" },

    ].map((item) => {



      const selected = form.routine_stress === item.value;



      return (

        <button

          key={item.value}

          type="button"

          onClick={() => handleChange("routine_stress", item.value)}

          className={`rounded-xl border px-4 py-4 transition-all duration-200 ${

            selected

              ? "border-brand-red bg-brand-red/10 text-brand-red"

              : "border-white/[0.06] bg-surface-gray-800/40 hover:border-brand-red/50"

          }`}

        >

          {item.label}

        </button>

      );

    })}



  </div>

</div>



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Current Injury

  </label>



  <select

    value={form.injuries}

    onChange={(e) => handleChange("injuries", e.target.value)}

    className="w-full bg-surface-black border border-gray-700 rounded-xl px-4 py-3 text-white"

  >

    <option value="">Select</option>

    <option value="None">None</option>

    <option value="Shoulder">Shoulder</option>

    <option value="Knee">Knee</option>

    <option value="Lower Back">Lower Back</option>

    <option value="Neck">Neck</option>

    <option value="Elbow">Elbow</option>

  </select>

</div>



<div className="mt-6">

  <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-3">

    Medical Conditions

  </label>



  <select

    value={form.medical_conditions}

    onChange={(e) => handleChange("medical_conditions", e.target.value)}

    className="w-full bg-surface-black border border-gray-700 rounded-xl px-4 py-3 text-white"

  >

    <option value="">Select</option>

    <option value="None">None</option>

    <option value="Diabetes">Diabetes</option>

    <option value="High Blood Pressure">High Blood Pressure</option>

    <option value="Thyroid">Thyroid</option>

    <option value="Asthma">Asthma</option>

    <option value="Other">Other</option>

  </select>

</div>

                {/* Error banner */}

                {status === 'error' && errorMessage && (

                  <div className="flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-xl px-4 py-3">

                    <AlertCircle className="w-4 h-4 text-brand-red shrink-0" />

                    <p className="text-sm text-brand-red">{errorMessage}</p>

                  </div>

                )}



                {/* Submit */}

                <button

                  type="submit"

                  disabled={status === 'loading'}

                  className="btn-primary w-full text-base flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"

                >

                  {status === 'loading' ? (

                    <>

                      <Loader2 className="w-4 h-4 animate-spin" />

                      Saving...

                    </>

                  ) : (

                    <>

                      <Save className="w-4 h-4" />

                      {isExisting ? 'Update Profile' : 'Save Profile'}

                    </>

                  )}

                </button>

              </form>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}
