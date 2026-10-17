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

// =========================================================
// EXERCISE VISUALS
// Lightweight built-in SVG thumbnails so every workout
// exercise has a visual without requiring another API/key.
// =========================================================

type ExerciseVisualType =
  | "bench"
  | "inclinePress"
  | "chestFly"
  | "pushup"
  | "pulldown"
  | "row"
  | "facePull"
  | "deadlift"
  | "squat"
  | "legPress"
  | "legExtension"
  | "legCurl"
  | "lunge"
  | "calf"
  | "lateralRaise"
  | "shoulderPress"
  | "dumbbellCurl"
  | "hammerCurl"
  | "cableCurl"
  | "barbellCurl"
  | "curl"
  | "tricepPushdown"
  | "tricepExtension"
  | "dip"
  | "core"
  | "cardio"
  | "general";

function getExerciseVisualType(name: string): ExerciseVisualType {
  const n = String(name || "").toLowerCase();

  // Specific variations must be checked before their generic parent names.
  if (n.includes("incline dumbbell press") || n.includes("incline bench press") || n.includes("incline press")) return "inclinePress";
  if (n.includes("reverse fly") || n.includes("rear delt")) return "facePull";
  if (n.includes("fly")) return "chestFly";
  if (n.includes("bench press") || n.includes("floor press") || n.includes("chest press") || n.includes("resistance band chest press")) return "bench";
  if (n.includes("push-up") || n.includes("push up")) return "pushup";

  if (n.includes("straight-arm pulldown") || n.includes("straight arm pulldown")) return "pulldown";
  if (n.includes("lat pulldown") || n.includes("pulldown") || n.includes("pull down")) return "pulldown";
  if (n.includes("face pull")) return "facePull";
  if (n.includes("row") || n.includes("pullover")) return "row";

  if (n.includes("deadlift") || n.includes("hip thrust") || n.includes("glute bridge") || n.includes("hamstring walkout")) return "deadlift";
  if (n.includes("leg press")) return "legPress";
  if (n.includes("leg extension")) return "legExtension";
  if (n.includes("leg curl") || n.includes("seated leg curl") || n.includes("lying leg curl")) return "legCurl";
  if (n.includes("squat") || n.includes("goblet squat")) return "squat";
  if (n.includes("lunge") || n.includes("bulgarian") || n.includes("split squat")) return "lunge";
  if (n.includes("calf")) return "calf";

  if (n.includes("lateral raise")) return "lateralRaise";
  if (n.includes("shoulder press") || n.includes("pike push")) return "shoulderPress";
  if (n.includes("hammer curl") || n.includes("hammer curls")) return "hammerCurl";
  if (n.includes("dumbbell curl") || n.includes("dumbbell curls")) return "dumbbellCurl";
  if (n.includes("cable curl") || n.includes("cable curls")) return "cableCurl";
  if (n.includes("barbell curl") || n.includes("barbell curls")) return "barbellCurl";
  if (n.includes("curl")) return "curl";
  if (n.includes("overhead") && n.includes("tricep")) return "tricepExtension";
  if (n.includes("tricep pushdown") || n.includes("triceps pushdown") || n.includes("tricep extension") || n.includes("triceps extension") || n.includes("cable tricep")) return "tricepPushdown";
  if (n.includes("dip")) return "dip";

  if (n.includes("plank") || n.includes("crunch") || n.includes("leg raise") || n.includes(" ab")) return "core";
  if (n.includes("walk") || n.includes("run") || n.includes("cycling") || n.includes("bike") || n.includes("cardio") || n.includes("hiit")) return "cardio";
  return "general";
}

const getFoodImage = (foodName?: string) => {
  const name = String(foodName || "").toLowerCase().trim();

  if (!name) return "/foods/vegetables.jpg";

  if (name.includes("oat")) return "/foods/oats.jpg";
  if (name.includes("egg")) return "/foods/eggs.jpg";
  if (name.includes("banana")) return "/foods/banana.jpg";
  if (name.includes("milk")) return "/foods/milk.jpg";
  if (name.includes("greek yogurt") || name.includes("greek-yogurt"))
    return "/foods/greek-yogurt.jpg";
  if (name.includes("yogurt") || name.includes("curd"))
    return "/foods/greek-yogurt.jpg";
  if (name.includes("rice")) return "/foods/rice.jpg";
  if (name.includes("chicken")) return "/foods/chicken.jpg";
  if (name.includes("fish") || name.includes("salmon"))
    return "/foods/fish.jpg";
  if (name.includes("paneer")) return "/foods/paneer.jpg";
  if (name.includes("tofu")) return "/foods/tofu.jpg";
  if (name.includes("dal")) return "/foods/dal.jpg";
  if (name.includes("chickpea") || name.includes("chana"))
    return "/foods/chickpeas.jpg";
  if (name.includes("rajma") || name.includes("kidney bean"))
    return "/foods/rajma.jpg";
  if (name.includes("vegetable") || name.includes("sabzi"))
    return "/foods/vegetables.jpg";
  if (name.includes("salad")) return "/foods/salad.jpg";
  if (name.includes("apple")) return "/foods/apple.jpg";
  if (name.includes("almond")) return "/foods/almonds.jpg";
  if (name.includes("sweet potato"))
    return "/foods/sweet-potato.jpg";
  if (name.includes("soy milk")) return "/foods/soy-milk.jpg";
  if (name.includes("soy yogurt") || name.includes("soy yoghurt"))
    return "/foods/soy-yogurt.jpg";
  if (name.includes("soy chunk") || name.includes("soya chunk"))
    return "/foods/soy-chunks.jpg";
  if (name.includes("berry") || name.includes("berries"))
    return "/foods/berries.jpg";
  if (name.includes("nut")) return "/foods/nuts.jpg";
  if (name.includes("peanut butter"))
    return "/foods/peanut-butter.jpg";
  if (name.includes("lentil")) return "/foods/lentils.jpg";
  if (name.includes("fruit")) return "/foods/fruit.jpg";
  if (name.includes("potato")) return "/foods/potato.jpg";
  if (name.includes("spinach")) return "/foods/spinach.jpg";

  return "/foods/vegetables.jpg";
};

function getExerciseImageSlug(name: string): string | null {
  const n = String(name || "").toLowerCase().trim().replace(/[–—]/g, "-");

  // Match specific variants before generic exercise terms.
  if (n.includes("close-grip") && n.includes("bench press")) return "close-grip-bench";
  if ((n.includes("straight-arm") || n.includes("straight arm")) && n.includes("pulldown")) return "straight-arm-pulldown";
  if (n.includes("cable lateral raise") || n.includes("cable lateral raises")) return "cable-lateral-raise";
  if (n.includes("reverse fly") || n.includes("reverse flyes") || n.includes("rear delt")) return "rear-delt-fly";
  if (n.includes("incline") && (n.includes("press") || n.includes("bench"))) return "incline-press";
  if (n.includes("bench press") || n.includes("floor press") || n.includes("chest press") || n.includes("band chest press")) return "bench-press";
  if (n.includes("cable") && n.includes("fly")) return "cable-chest-fly";
  if (n.includes("fly")) return "chest-fly";

  if (n.includes("lat pulldown") || n.includes("pulldown") || n.includes("pull down")) return "lat-pulldown";
  if (n.includes("pull-up") || n.includes("pull up") || n.includes("pullups")) return "pull-ups";
  if (n.includes("face pull")) return "face-pull";
  if (n.includes("t-bar row")) return "t-bar-row";
  if (n.includes("seated cable row") || n.includes("seated row")) return "seated-cable-row";
  if (n.includes("barbell row") || n.includes("bent-over row") || n.includes("bent over row")) return "barbell-row";
  if (n.includes("row") || n.includes("pullover")) return "barbell-row";

  if (n.includes("leg press")) return "leg-press";
  if (n.includes("leg extension")) return "leg-extension";
  if (n.includes("lying leg curl")) return "lying-leg-curl";
  if (n.includes("leg curl") || n.includes("sliding leg curl") || n.includes("hamstring walkout")) return "leg-curl";
  if (n.includes("seated calf")) return "seated-calf-raise";
  if (n.includes("calf")) return "calf-raise";
  if (n.includes("bulgarian") || n.includes("split squat")) return "bulgarian-split-squat";
  if (n.includes("lunge")) return "walking-lunge";
  if (n.includes("romanian deadlift")) return "romanian-deadlift";
  if (n.includes("deadlift")) return "deadlift";
  if (n.includes("hip thrust") || n.includes("glute bridge")) return "hip-thrust";
  if (n.includes("good morning")) return "good-morning";
  if (n.includes("hack squat")) return "hack-squat";
  if (n.includes("squat") || n.includes("goblet")) return "squat";

  if (n.includes("lateral raise")) return "lateral-raise";
  if (n.includes("front raise")) return "front-raise";
  if (n.includes("upright row")) return "upright-row";
  if (n.includes("shrug")) return "shrugs";
  if (n.includes("shoulder press") || n.includes("pike push")) return "shoulder-press";

  if (n.includes("wrist curl")) return "wrist-curl";
  if (n.includes("preacher curl")) return "preacher-curl";
  if (n.includes("hammer curl")) return "hammer-curl";
  if (n.includes("cable curl")) return "cable-curl";
  if (n.includes("dumbbell curl")) return "dumbbell-curl";
  if (n.includes("barbell curl")) return "barbell-curl";
  if (n.includes("curl")) return "barbell-curl";
  if (n.includes("tricep pushdown") || n.includes("triceps pushdown")) return "tricep-pushdown";
  if (n.includes("overhead") && n.includes("tricep")) return "overhead-tricep-extension";
  if (n.includes("tricep extension") || n.includes("triceps extension") || n.includes("cable tricep")) return "overhead-tricep-extension";
  if (n.includes("dip")) return "dips";
  return null;
}

function ExerciseThumbnail({ name }: { name: string }) {
  const imageSlug = getExerciseImageSlug(name);
  const type = getExerciseVisualType(name);

  if (imageSlug) {
    return (
      <div className="relative w-full aspect-[16/9] min-h-[150px] sm:min-h-[210px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#1a0909] via-[#101010] to-black shadow-inner shadow-red-500/10 flex items-center justify-center p-2 sm:p-3">
        <img
          src={`/exercises/${imageSlug}.jpg`}
          alt={`${name} exercise demonstration`}
          className="block w-full h-full object-contain object-center"
          loading="lazy"
          onError={(event) => {
            const image = event.currentTarget;
            image.style.display = "none";
            const fallback = image.parentElement?.querySelector("[data-exercise-image-fallback]");
            if (fallback) fallback.classList.remove("hidden");
          }}
        />
        <span data-exercise-image-fallback className="hidden text-center text-xs text-gray-400 px-2">Exercise preview unavailable</span>
      </div>
    );
  }

  const line = { stroke: "#ff6b6b", strokeWidth: 4.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const metal = { stroke: "#b7b7b7", strokeWidth: 2.5, strokeLinecap: "round" as const, fill: "none" };

  const common = (
    <>
      <circle cx="52" cy="18" r="7" fill="#ff8b8b" stroke="#ff6b6b" strokeWidth="2" />
      <path d="M47 27 Q52 24 57 27" {...line} />
    </>
  );

  let pose: any;
  switch (type) {
    case "bench":
      pose = <>
        <path d="M28 68 L84 68" {...metal} /><path d="M38 68 L32 82 M73 68 L79 82" {...metal} />
        <path d="M35 49 L70 49" {...metal} /><path d="M38 49 L44 38 L61 38 L69 49" {...line} />
        <path d="M44 38 L34 31 M61 38 L72 31" {...line} /><path d="M28 28 L78 28" {...metal} /><path d="M33 25 L33 34 M73 25 L73 34" {...metal} />
        {common}
      </>;
      break;
    case "inclinePress":
      pose = <>
        <path d="M30 76 L82 76 M39 64 L34 82 M69 64 L77 82" {...metal} />
        <path d="M37 57 L68 39" {...metal} /><path d="M43 52 L67 35" {...line} />
        <path d="M48 48 L38 35 M62 40 L74 28" {...line} /><path d="M33 29 L82 29" {...metal} />
        <path d="M38 26 L38 34 M77 26 L77 34" {...metal} />{common}
      </>;
      break;
    case "chestFly":
      pose = <>
        <path d="M27 72 L83 72 M34 72 L31 82 M76 72 L79 82" {...metal} /><path d="M40 59 L70 59" {...metal} />
        <path d="M52 54 L52 35" {...line} /><path d="M52 38 L33 28 M52 38 L71 28" {...line} />
        <path d="M30 26 L36 29 M68 29 L74 26" {...metal} />{common}
      </>;
      break;
    case "pushup":
      pose = <><path d="M25 69 L77 55" {...line} /><path d="M37 65 L28 79 M57 59 L70 75" {...line} /><path d="M23 80 L35 80 M65 76 L78 76" {...metal} /><path d="M43 63 L35 48" {...line} />
        <circle cx="83" cy="53" r="6" fill="#ff8b8b" stroke="#ff6b6b" strokeWidth="2" /></>;
      break;
    case "pulldown":
      pose = <><path d="M25 11 L82 11" {...metal} /><path d="M30 11 L30 24 M77 11 L77 24" {...metal} /><path d="M52 28 L52 54" {...line} />
        <path d="M52 30 L34 43 M52 30 L70 43" {...line} /><path d="M34 43 L39 23 M70 43 L65 23" {...line} /><path d="M39 23 L65 23" {...metal} />
        <path d="M52 54 L39 77 M52 54 L65 77" {...line} />{common}</>;
      break;
    case "row":
      pose = <><path d="M20 76 L88 76" {...metal} /><path d="M33 74 L43 54 L63 54 L76 74" {...metal} /><path d="M43 54 L51 31" {...line} />
        <path d="M51 32 L67 43 M51 38 L36 48" {...line} /><path d="M67 43 L78 51" {...metal} /><path d="M34 48 L25 55" {...metal} />{common}</>;
      break;
    case "facePull":
      pose = <><path d="M82 12 L82 82" {...metal} /><path d="M78 35 L58 35" {...metal} /><path d="M58 35 L45 28 M58 35 L45 42" {...line} /><path d="M45 28 L39 28 M45 42 L39 42" {...metal} />
        <path d="M52 47 L52 68 M52 50 L35 43 M52 50 L69 43 M52 68 L42 79 M52 68 L62 79" {...line} />{common}</>;
      break;
    case "deadlift":
      pose = <><path d="M18 73 L86 73" {...metal} /><path d="M35 72 L42 47 L58 47 L69 72" {...line} /><path d="M42 47 L52 31 L66 40" {...line} />
        <path d="M66 40 L72 57" {...line} /><path d="M27 58 L77 58" {...metal} /><path d="M24 54 L24 62 M80 54 L80 62" {...metal} />{common}</>;
      break;
    case "squat":
      pose = <><path d="M28 26 L80 26" {...metal} /><path d="M33 22 L33 31 M75 22 L75 31" {...metal} /><path d="M52 29 L52 49" {...line} /><path d="M52 35 L37 28 M52 35 L67 28" {...line} />
        <path d="M52 49 L37 61 L29 76 M52 49 L67 61 L78 76" {...line} /><path d="M24 78 L37 78 M75 78 L88 78" {...metal} />{common}</>;
      break;
    case "legPress":
      pose = <><path d="M23 76 L83 76 M32 76 L28 83 M73 76 L78 83" {...metal} /><path d="M34 58 L57 58 L68 38" {...metal} /><path d="M44 56 L59 40" {...line} /><path d="M59 40 L76 25" {...line} /><path d="M72 22 L82 29" {...metal} />{common}</>;
      break;
    case "legExtension":
      pose = <><path d="M25 73 L83 73" {...metal} /><path d="M31 73 L28 82 M75 73 L78 82" {...metal} /><path d="M37 58 L60 58 L69 69" {...metal} /><path d="M47 53 L55 34 L69 43" {...line} /><path d="M69 43 L78 55" {...line} />{common}</>;
      break;
    case "legCurl":
      pose = <><path d="M25 70 L84 70" {...metal} /><path d="M33 70 L30 81 M76 70 L79 81" {...metal} /><path d="M39 55 L67 55" {...metal} /><path d="M46 51 L59 35 L72 46" {...line} /><path d="M72 46 L64 61" {...line} />{common}</>;
      break;
    case "lunge":
      pose = <><path d="M52 29 L52 51" {...line} /><path d="M52 35 L38 44 M52 35 L66 44" {...line} /><path d="M52 51 L38 62 L24 77 M52 51 L68 59 L85 59" {...line} /><path d="M18 79 L31 79 M80 61 L92 61" {...metal} />{common}</>;
      break;
    case "calf":
      pose = <><path d="M52 29 L52 61" {...line} /><path d="M52 36 L36 45 M52 36 L68 45" {...line} /><path d="M52 61 L43 77 M52 61 L61 77" {...line} /><path d="M35 79 L49 79 M55 79 L69 79" {...metal} /><path d="M32 22 L72 22" {...metal} />{common}</>;
      break;
    case "lateralRaise":
      pose = <><path d="M52 28 L52 57" {...line} /><path d="M52 34 L31 43 L24 50 M52 34 L73 43 L80 50" {...line} /><circle cx="22" cy="52" r="3" fill="#c9c9c9" /><circle cx="82" cy="52" r="3" fill="#c9c9c9" /><path d="M52 57 L43 78 M52 57 L61 78" {...line} />{common}</>;
      break;
    case "shoulderPress":
      pose = <><path d="M52 31 L52 57" {...line} /><path d="M52 36 L38 22 M52 36 L66 22" {...line} /><path d="M34 20 L42 20 M62 20 L70 20" {...metal} /><path d="M52 57 L43 78 M52 57 L61 78" {...line} />{common}</>;
      break;
    case "curl":
      pose = <><path d="M52 29 L52 58" {...line} /><path d="M52 36 L38 47 L46 57 M52 36 L66 47 L58 57" {...line} /><path d="M42 55 L62 55" {...metal} /><path d="M52 58 L43 78 M52 58 L61 78" {...line} />{common}</>;
      break;
    case "tricepPushdown":
      pose = <><path d="M76 10 L76 77" {...metal} /><path d="M72 24 L52 24" {...metal} /><path d="M52 24 L48 40 L48 56" {...line} /><path d="M48 40 L37 47" {...line} /><path d="M48 56 L40 73 M48 56 L58 73" {...line} /><path d="M34 75 L45 75 M55 75 L66 75" {...metal} />{common}</>;
      break;
    case "tricepExtension":
      pose = <><path d="M52 30 L52 59" {...line} /><path d="M52 35 L43 24 L42 15 M52 35 L61 24 L62 15" {...line} /><circle cx="42" cy="13" r="3" fill="#c9c9c9" /><circle cx="62" cy="13" r="3" fill="#c9c9c9" /><path d="M52 59 L43 78 M52 59 L61 78" {...line} />{common}</>;
      break;
    case "dip":
      pose = <><path d="M28 20 L28 78 M76 20 L76 78" {...metal} /><path d="M28 31 L76 31" {...metal} /><path d="M52 37 L52 58" {...line} /><path d="M52 42 L37 31 M52 42 L67 31" {...line} /><path d="M52 58 L42 76 M52 58 L62 76" {...line} />{common}</>;
      break;
    case "core":
      pose = <><path d="M24 66 L79 50" {...line} /><path d="M34 62 L27 77 M55 56 L68 72" {...line} /><path d="M24 79 L37 79 M63 74 L76 74" {...metal} /><circle cx="84" cy="48" r="6" fill="#ff8b8b" stroke="#ff6b6b" strokeWidth="2" /></>;
      break;
    case "cardio":
      pose = <><path d="M25 70 L82 70" {...metal} /><path d="M35 70 L31 80 M73 70 L77 80" {...metal} /><path d="M42 54 L62 54 L69 66" {...metal} /><path d="M52 50 L52 29 M52 33 L37 42 M52 33 L67 42 M52 50 L42 70 M52 50 L63 70" {...line} />{common}</>;
      break;
    default:
      pose = <><path d="M52 29 L52 58 M52 36 L36 45 M52 36 L68 45 M52 58 L43 78 M52 58 L61 78" {...line} />{common}</>;
  }

  return (
    <div className="relative w-full aspect-[16/9] min-h-[180px] sm:min-h-[220px] shrink-0 rounded-xl border border-red-500/20 bg-gradient-to-br from-red-950/70 via-zinc-900 to-black flex items-center justify-center overflow-hidden shadow-inner shadow-red-500/10">
      <svg viewBox="0 0 104 92" className="w-full h-full" aria-label={`${name} exercise illustration`} role="img">
        <defs>
          <radialGradient id="exerciseGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#3b1515" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#090909" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="104" height="92" rx="16" fill="url(#exerciseGlow)" />
        {pose}
      </svg>
    </div>
  );
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

  // Reusable BodyWise AI popup system
  const [popup, setPopup] = useState<{
    open: boolean;
    type: "message" | "confirm";
    title: string;
    message: string;
  }>({
    open: false,
    type: "message",
    title: "",
    message: "",
  });

  const [confirmResolver, setConfirmResolver] = useState<
    ((value: boolean) => void) | null
  >(null);

  const showMessage = (message: string, title = "BodyWise AI") => {
    setPopup({
      open: true,
      type: "message",
      title,
      message,
    });
  };

  const showConfirm = (message: string, title = "Please Confirm") =>
    new Promise<boolean>((resolve) => {
      setConfirmResolver(() => resolve);
      setPopup({
        open: true,
        type: "confirm",
        title,
        message,
      });
    });

  const closePopup = (confirmed = false) => {
    if (popup.type === "confirm" && confirmResolver) {
      confirmResolver(confirmed);
    }

    setConfirmResolver(null);
    setPopup((current) => ({ ...current, open: false }));
  };

  const autoFillFood = async (food: string) => {
  if (!food.trim()) {
    showMessage("Please enter a food name.");
    return;
  }

  try {
    const data = await searchFood(food.trim());

    console.log("USDA RESPONSE:", data);

    if (!data?.foods || data.foods.length === 0) {
      showMessage(`No nutrition data found for "${food}".`);
      return;
    }

    const item = data.foods[0];

    console.log("FIRST FOOD:", item);

    const qty = Math.max(1, Number(quantity) || 100);
    const multiplier = qty / 100;

    const nutrients = item.foodNutrients || [];

    const getNutrient = (...names: string[]) => {
      const nutrient = nutrients.find((n: any) => {
        const nutrientName = String(n.nutrientName || "")
          .trim()
          .toLowerCase();

        return names.some(
          (name) =>
            nutrientName === name.toLowerCase() ||
            nutrientName.includes(name.toLowerCase())
        );
      });

      return Number(nutrient?.value) || 0;
    };

    const calories =
      getNutrient(
        "Energy",
        "Energy (Atwater General)",
        "Energy (Atwater Specific Factors)"
      ) * multiplier;

    const protein =
      getNutrient("Protein") * multiplier;

    const carbs =
      getNutrient(
        "Carbohydrate, by difference",
        "Carbohydrate"
      ) * multiplier;

    const fat =
      getNutrient(
        "Total lipid (fat)",
        "Total Fat",
        "Fat"
      ) * multiplier;

    console.log("CALCULATED NUTRITION:", {
      calories,
      protein,
      carbs,
      fat,
      quantity: qty,
    });

    setCaloriesInput(String(Math.round(calories)));
    setProteinInput(protein.toFixed(1));
    setCarbsInput(carbs.toFixed(1));
    setFatInput(fat.toFixed(1));

  } catch (error) {
    console.error("AUTO FILL ERROR:", error);

    showMessage(
      "Unable to fetch nutrition data. Please check your USDA API key or internet connection."
    );
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

  const getBodyFatPercentage = () => {
    const candidates = [
      profile?.body_fat_percentage,
      profile?.body_fat_percent,
      profile?.body_fat,
      profile?.fat_percentage,
      profile?.bodyfat_percentage,
      profile?.bodyfat,
    ];

    for (const value of candidates) {
      const parsed = Number(value);
      if (Number.isFinite(parsed) && parsed > 0 && parsed < 70) {
        return parsed;
      }
    }

    return null;
  };

  const nutritionTargets = (() => {
    if (
      !profile?.current_weight_kg ||
      !profile?.height_cm ||
      !profile?.age
    ) {
      return {
        calories: "--",
        protein: "--",
        maintenance: "--",
        calorieAdjustment: 0,
        bodyFat: getBodyFatPercentage(),
      };
    }

    const weight = Number(profile.current_weight_kg);
    const height = Number(profile.height_cm);
    const age = Number(profile.age);

    // Mifflin-St Jeor BMR
    const gender = String(profile.gender || "").toLowerCase();
    const bmr =
      10 * weight +
      6.25 * height -
      5 * age +
      (gender === "male" ? 5 : -161);

    const activityLevel = String(
      profile.activity_level || "sedentary"
    )
      .toLowerCase()
      .trim()
      .replace(/[\s-]+/g, "_");

    const activityMultiplier: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      lightly_active: 1.375,
      moderate: 1.55,
      moderately_active: 1.55,
      active: 1.725,
      very_active: 1.9,
      veryactive: 1.9,
    };

    const maintenanceCalories =
      bmr * (activityMultiplier[activityLevel] || 1.2);

    const goal = String(profile.fitness_goal || "maintenance")
      .toLowerCase()
      .trim()
      .replace(/[\s-]+/g, "_");

    const bodyFat = getBodyFatPercentage();

    // Goal-based calorie adjustment.
    // Recomposition uses body-fat bands when a body-fat value is available.
    let calorieAdjustment = 0;

    if (goal === "fat_loss" || goal === "weight_loss") {
      calorieAdjustment = -450;
    } else if (goal === "muscle_gain" || goal === "weight_gain") {
      calorieAdjustment = 350;
    } else if (
      goal === "body_recomposition" ||
      goal === "body_recomp" ||
      goal === "recomposition"
    ) {
      if (bodyFat !== null) {
        if (bodyFat > 20) {
          calorieAdjustment = -250;
        } else if (bodyFat >= 15) {
          calorieAdjustment = 0;
        } else {
          calorieAdjustment = 250;
        }
      } else {
        // Conservative fallback when body-fat data is unavailable.
        calorieAdjustment = 0;
      }
    }

    const targetCalories = Math.max(
      1200,
      Math.round(maintenanceCalories + calorieAdjustment)
    );

    // Keep protein in the requested 2.0–2.2 g/kg range.
    // Higher protein is used for fat loss; a middle value is used otherwise.
    const proteinMultiplier =
      goal === "fat_loss" || goal === "weight_loss" ? 2.2 : 2.1;

    const protein = Math.round(weight * proteinMultiplier);

    return {
      calories: targetCalories,
      protein,
      maintenance: Math.round(maintenanceCalories),
      calorieAdjustment,
      bodyFat,
    };
  })();

const calories = nutritionTargets.calories;
const proteinTarget = nutritionTargets.protein;

const today = new Date();
today.setHours(0, 0, 0, 0);

const todayFoodLogs = foodLogs.filter((log: any) => {
  if (!log.created_at) return false;

  const logDate = new Date(log.created_at);

  return logDate >= today;
});

const consumedCalories = todayFoodLogs.reduce(
  (total: number, log: any) =>
    total + Number(log.calories || 0),
  0
);

const consumedProtein = todayFoodLogs.reduce(
  (total: number, log: any) =>
    total + Number(log.protein || 0),
  0
);

const remainingCalories =
  typeof calories === "number"
    ? Math.max(0, calories - consumedCalories)
    : 0;

const remainingProtein =
  typeof proteinTarget === "number"
    ? Math.max(0, proteinTarget - consumedProtein)
    : 0;

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

const todayNutrition =
  aiPlan?.plan_json?.nutrition?.weekly_plan?.find(
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
  nutritionTargets.bodyFat !== null && nutritionTargets.bodyFat !== undefined
    ? Number(nutritionTargets.bodyFat).toFixed(1)
    : bmi !== '--' && profile?.age
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
    showMessage("🔥 BodyWise Pro is required to log workouts.");
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
    showMessage(existingWorkoutError.message);
    return;
  }

  // If today's workout is already completed, don't create another one
  if (
    existingWorkout &&
    existingWorkout.workout_exercises &&
    existingWorkout.workout_exercises.length > 0
  ) {
    showMessage("Today's workout has already been logged.");
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
      showMessage(workoutError.message);
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
      showMessage(exerciseError.message);
      return;
    }
  }

  showMessage("Your workout has been successfully logged.", "Workout Logged!");

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
    showMessage(error.message);
  } else {
    showMessage('Your weight has been successfully saved.', 'Weight Saved!');
    setWeightInput('');
  }
}


async function uploadTransformationPhoto() {
  if (!photoFile || !user) return;

  if (!isPro) {
    showMessage("🔥 BodyWise Pro is required to upload transformation photos.");
    return;
  }

  const fileName = `${user.id}-${Date.now()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from('transformations')
    .upload(fileName, photoFile);

  if (uploadError) {
    showMessage(uploadError.message);
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
    showMessage(error.message);
  } else {
    showMessage('Your transformation photo has been successfully uploaded.', 'Photo Uploaded!');
  }
}

const deleteTransformationPhoto = async (
  photoId: string,
  imageUrl: string
) => {
  if (!user) return;

  if (!isPro) {
    showMessage("🔥 BodyWise Pro is required to delete transformation photos.");
    return;
  }

  const confirmed = await showConfirm(
    "Are you sure you want to delete this transformation photo?",
    "Delete Transformation Photo"
  );

  if (!confirmed) return;

  const fileName = imageUrl.split("/").pop();

  if (fileName) {
    const { error: storageError } = await supabase.storage
      .from("transformations")
      .remove([fileName]);

    if (storageError) {
      showMessage(storageError.message);
      return;
    }
  }

  const { error: deleteError } = await supabase
    .from("transformation_photos")
    .delete()
    .eq("id", photoId)
    .eq("user_id", user.id);

  if (deleteError) {
    showMessage(deleteError.message);
    return;
  }

  setPhotos((currentPhotos) =>
    currentPhotos.filter((photo) => photo !== imageUrl)
  );

  setPhotoIds((currentIds) =>
    currentIds.filter((id) => id !== photoId)
  );

  showMessage("Your transformation photo has been successfully deleted.", "Photo Deleted!");
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

  const confirmed = await showConfirm(
    "Are you sure you want to delete this workout?",
    "Delete Workout"
  );

  if (!confirmed) return;

  const { error: exerciseError } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("workout_log_id", workoutId)
    .eq("user_id", user.id);

  if (exerciseError) {
    showMessage(exerciseError.message);
    return;
  }

  const { error: workoutError } = await supabase
    .from("workout_logs")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", user.id);

  if (workoutError) {
    showMessage(workoutError.message);
    return;
  }

  setWorkoutHistory((prev: any[]) =>
    prev.filter((workout) => workout.id !== workoutId)
  );

  showMessage("✅ Workout deleted successfully!");
};

const saveFoodLog = async () => {

  if (!user) {

    showMessage('Please login first');

    return;
  }

  if (!isPro) {
    showMessage("🔥 BodyWise Pro is required to log food.");
    return;
}
  
  if (!foodName || !caloriesInput) {
    showMessage('Please enter food details');
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
    showMessage(error.message);
  } else {
    showMessage('Your food entry has been successfully saved.', 'Food Saved!');

    
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
  profile: any,
  legFocus: "quad" | "hamstring" = "quad"
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
        name: "Dumbbell Floor Press",
        sets: 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Dumbbell Fly",
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
      {
        name: "Overhead Dumbbell Tricep Extension",
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
        name: "Machine Chest Press",
        sets: 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Cable Fly",
        sets: 3,
        reps: "12-15",
        rest: "60 sec",
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
      {
        name: "Overhead Tricep Extension",
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
        name: "One-Arm Dumbbell Row",
        sets: isAdvanced ? 4 : 3,
        reps: "8-12 each side",
        rest: "75 sec",
      },
      {
        name: "Dumbbell Pullover",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
      {
        name: "Dumbbell Reverse Fly",
        sets: 3,
        reps: "12-15",
        rest: "60 sec",
      },
      {
        name: "Dumbbell Curls",
        sets: 3,
        reps: "10-12",
        rest: "60 sec",
      },
      {
        name: "Hammer Curls",
        sets: 3,
        reps: "10-12",
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
        name: "Chest Supported Row",
        sets: isBeginner ? 3 : 4,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Straight Arm Pulldown",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
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
      {
        name: "Hammer Curl",
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
    if (legFocus === "hamstring") {
      exercises = [
        {
          name: "Dumbbell Romanian Deadlift",
          sets: isBeginner ? 3 : isAdvanced ? 4 : 3,
          reps: "8-12",
          rest: isAdvanced ? "120 sec" : "90 sec",
        },
        {
          name: "Hamstring Walkouts",
          sets: 3,
          reps: "8-12",
          rest: "60 sec",
        },
        {
          name: "Sliding Leg Curl",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Goblet Squat",
          sets: 3,
          reps: "8-12",
          rest: "75 sec",
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
          name: "Goblet Squat",
          sets: isBeginner ? 3 : isAdvanced ? 4 : 3,
          reps: "8-12",
          rest: isAdvanced ? "120 sec" : "90 sec",
        },
        {
          name: "Bulgarian Split Squat",
          sets: 3,
          reps: "8-12 each leg",
          rest: "75 sec",
        },
        {
          name: "Dumbbell Lunges",
          sets: 3,
          reps: "10-12 each leg",
          rest: "60 sec",
        },
        {
          name: "Dumbbell Romanian Deadlift",
          sets: 3,
          reps: "8-12",
          rest: "90 sec",
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
    }
  } else {
    if (legFocus === "hamstring") {
      exercises = [
        {
          name: "Romanian Deadlift",
          sets: isBeginner ? 3 : isAdvanced ? 4 : 3,
          reps: "8-12",
          rest: isAdvanced ? "120 sec" : "90 sec",
        },
        {
          name: "Seated Leg Curl",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Lying Leg Curl",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Leg Press",
          sets: 3,
          reps: "8-12",
          rest: "90 sec",
        },
        {
          name: "Hip Thrust",
          sets: 3,
          reps: "8-12",
          rest: "75 sec",
        },
        {
          name: "Standing Calf Raise",
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
          name: "Leg Press",
          sets: 3,
          reps: "8-12",
          rest: "90 sec",
        },
        {
          name: "Leg Extension",
          sets: 3,
          reps: "10-15",
          rest: "60 sec",
        },
        {
          name: "Romanian Deadlift",
          sets: 3,
          reps: "8-12",
          rest: "90 sec",
        },
        {
          name: "Hip Thrust",
          sets: 3,
          reps: "8-12",
          rest: "75 sec",
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
}

  // =========================================================
  // UPPER BODY
  // =========================================================

  else if (workoutType === "Upper Body") {
  if (location === "home") {
    exercises = [
      {
        name: "Push-Ups",
        sets: isAdvanced ? 4 : 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Dumbbell Floor Press",
        sets: 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Resistance Band Row",
        sets: isAdvanced ? 4 : 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "One-Arm Dumbbell Row",
        sets: 3,
        reps: "8-12 each side",
        rest: "75 sec",
      },
      {
        name: "Dumbbell Lateral Raises",
        sets: 3,
        reps: "12-15",
        rest: "60 sec",
      },
      {
        name: "Dumbbell Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
      {
        name: "Overhead Dumbbell Tricep Extension",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
    ];
  } else {
    exercises = [
      {
        name: "Incline Bench Press",
        sets: isAdvanced ? 4 : 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Machine Chest Press",
        sets: 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Lat Pulldown",
        sets: isBeginner ? 3 : 4,
        reps: "8-12",
        rest: isAdvanced ? "120 sec" : "90 sec",
      },
      {
        name: "Chest Supported Row",
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
        name: "Cable Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
      {
        name: "Tricep Pushdown",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
    ];
  }
}

  // =========================================================
  // LOWER BODY
  // =========================================================

  else if (workoutType === "Lower Body") {
  if (location === "home") {
    exercises = [
      {
        name: "Goblet Squats",
        sets: isAdvanced ? 4 : 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Reverse Lunges",
        sets: 3,
        reps: "8-12 each leg",
        rest: "60 sec",
      },
      {
        name: "Romanian Deadlift",
        sets: isBeginner ? 2 : 3,
        reps: "8-12",
        rest: "75 sec",
      },
      {
        name: "Dumbbell Leg Curl",
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
        reps: "8-12 each leg",
        rest: "90 sec",
      },
      {
        name: "Romanian Deadlift",
        sets: isBeginner ? 2 : 3,
        reps: "8-12",
        rest: "90 sec",
      },
      {
        name: "Seated Leg Curl",
        sets: 3,
        reps: "10-15",
        rest: "60 sec",
      },
      {
        name: "Hip Thrust",
        sets: 3,
        reps: "8-12",
        rest: "75 sec",
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
        exercises: generateExercisesForWorkout(
  "Legs",
  profile,
  "quad"
),
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
        exercises: generateExercisesForWorkout(
  "Legs",
  profile,
  "hamstring"
),
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
    showMessage("🔥 BodyWise Pro is required to create or update your AI plan.");
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

const FOOD_DATABASE = {
  "Oats": {
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    unit: "100g",
    diet: "vegan",
  },

  "Rice": {
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    unit: "100g cooked",
    diet: "vegan",
  },

  "Chicken": {
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    unit: "100g",
    diet: "non_veg",
  },

  "Fish": {
    calories: 128,
    protein: 26,
    carbs: 0,
    fat: 2.7,
    unit: "100g",
    diet: "non_veg",
  },

  "Eggs": {
    calories: 72,
    protein: 6.3,
    carbs: 0.4,
    fat: 4.8,
    unit: "1 egg",
    diet: "non_veg",
  },

  "Paneer": {
    calories: 265,
    protein: 18.3,
    carbs: 1.2,
    fat: 20.8,
    unit: "100g",
    diet: "vegetarian",
  },

  "Tofu": {
    calories: 76,
    protein: 8,
    carbs: 1.9,
    fat: 4.8,
    unit: "100g",
    diet: "vegan",
  },

  "Dal": {
    calories: 116,
    protein: 9,
    carbs: 20,
    fat: 0.4,
    unit: "100g cooked",
    diet: "vegan",
  },

  "Soy Chunks": {
    calories: 345,
    protein: 52,
    carbs: 33,
    fat: 0.5,
    unit: "100g dry",
    diet: "vegan",
  },

  "Milk": {
    calories: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.3,
    unit: "100ml",
    diet: "vegetarian",
  },

  "Greek Yogurt": {
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    unit: "100g",
    diet: "vegetarian",
  },

  "Curd": {
    calories: 61,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    unit: "100g",
    diet: "vegetarian",
  },

  "Chickpeas": {
    calories: 164,
    protein: 8.9,
    carbs: 27.4,
    fat: 2.6,
    unit: "100g cooked",
    diet: "vegan",
  },

  "Rajma": {
    calories: 127,
    protein: 8.7,
    carbs: 22.8,
    fat: 0.5,
    unit: "100g cooked",
    diet: "vegan",
  },

  "Banana": {
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    unit: "1 medium",
    diet: "vegan",
  },

  "Apple": {
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    unit: "1 medium",
    diet: "vegan",
  },

  "Peanut Butter": {
    calories: 588,
    protein: 25,
    carbs: 20,
    fat: 50,
    unit: "100g",
    diet: "vegan",
  },

  "Almonds": {
    calories: 579,
    protein: 21.2,
    carbs: 21.6,
    fat: 49.9,
    unit: "100g",
    diet: "vegan",
  },

  "Sweet Potato": {
    calories: 86,
    protein: 1.6,
    carbs: 20.1,
    fat: 0.1,
    unit: "100g",
    diet: "vegan",
  },

  "Potato": {
    calories: 87,
    protein: 1.9,
    carbs: 20.1,
    fat: 0.1,
    unit: "100g",
    diet: "vegan",
  },

  "Spinach": {
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    unit: "100g",
    diet: "vegan",
  },

  "Vegetables": {
    calories: 50,
    protein: 2,
    carbs: 10,
    fat: 0.5,
    unit: "100g",
    diet: "vegan",
  },

  "Salad": {
    calories: 25,
    protein: 1,
    carbs: 5,
    fat: 0.2,
    unit: "100g",
    diet: "vegan",
  },

  "Soy Milk": {
    calories: 33,
    protein: 3.3,
    carbs: 0.7,
    fat: 1.8,
    unit: "100ml",
    diet: "vegan",
  },

  "Soy Yogurt": {
    calories: 55,
    protein: 4,
    carbs: 3,
    fat: 2.5,
    unit: "100g",
    diet: "vegan",
  },

  "Berries": {
    calories: 50,
    protein: 0.7,
    carbs: 12,
    fat: 0.3,
    unit: "100g",
    diet: "vegan",
  },

  "Nuts": {
    calories: 607,
    protein: 20,
    carbs: 22,
    fat: 54,
    unit: "100g",
    diet: "vegan",
  },

  "Fruit": {
    calories: 60,
    protein: 0.8,
    carbs: 15,
    fat: 0.3,
    unit: "100g",
    diet: "vegan",
  },

  "Lentils": {
    calories: 116,
    protein: 9,
    carbs: 20,
    fat: 0.4,
    unit: "100g cooked",
    diet: "vegan",
  },
};

 // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 3000));

  function generateNutritionMeals(
    profile: any,
    calories: number | string,
    proteinTarget: number | string
  ) {
    const dailyCalories = Number(calories) || 0;
    const dailyProtein = Number(proteinTarget) || 0;

    const diet = String(profile?.diet_preference || "")
      .toLowerCase()
      .trim()
      .replace(/[\s-]+/g, "_");

    const requestedMeals = Math.max(
      3,
      Math.min(5, Number(profile?.meals_per_day) || 3)
    );

    const allergies = String(profile?.food_allergies || "").toLowerCase();
    const restrictions = String(profile?.food_restrictions || "").toLowerCase();

    const isVegan = diet === "vegan";
    const isVegetarian = diet === "vegetarian" || diet === "veg";

    const allergyList = allergies
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);
    const restrictionList = restrictions
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);

    const avoidFood = (food: string) => {
      const text = String(food).toLowerCase();
      return [...allergyList, ...restrictionList].some(
        (item) => item && text.includes(item)
      );
    };

    const calculateFood = (
      name: string,
      quantity: number,
      unit: string
    ) => {
      const food = FOOD_DATABASE[name as keyof typeof FOOD_DATABASE];

      if (!food) {
        return {
          name,
          quantity,
          unit,
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      }

      const isSingleServing =
        food.unit === "1 egg" || food.unit === "1 medium";

      const multiplier = isSingleServing ? quantity : quantity / 100;

      return {
        name,
        quantity,
        unit,
        calories: Math.round(food.calories * multiplier),
        protein: Number((food.protein * multiplier).toFixed(1)),
        carbs: Number((food.carbs * multiplier).toFixed(1)),
        fat: Number((food.fat * multiplier).toFixed(1)),
      };
    };

    const vegetarianMeals = [
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Milk", 250, "ml"], ["Banana", 1, "medium"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Paneer", 150, "g"], ["Dal", 150, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Apple", 1, "medium"], ["Almonds", 20, "g"]] },
        { name: "Dinner", foods: [["Paneer", 120, "g"], ["Rice", 150, "g cooked"], ["Vegetables", 200, "g"], ["Curd", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Greek Yogurt", 200, "g"], ["Banana", 1, "medium"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Chickpeas", 180, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Curd", 200, "g"], ["Apple", 1, "medium"], ["Almonds", 20, "g"]] },
        { name: "Dinner", foods: [["Paneer", 150, "g"], ["Sweet Potato", 200, "g"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Milk", 250, "ml"], ["Apple", 1, "medium"], ["Almonds", 15, "g"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Rajma", 180, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Banana", 1, "medium"]] },
        { name: "Dinner", foods: [["Paneer", 150, "g"], ["Dal", 150, "g cooked"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Soy Milk", 250, "ml"], ["Berries", 100, "g"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Tofu", 180, "g"], ["Dal", 150, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Apple", 1, "medium"]] },
        { name: "Dinner", foods: [["Paneer", 120, "g"], ["Sweet Potato", 200, "g"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Milk", 250, "ml"], ["Banana", 1, "medium"], ["Peanut Butter", 15, "g"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Dal", 200, "g cooked"], ["Paneer", 120, "g"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Curd", 200, "g"], ["Apple", 1, "medium"], ["Almonds", 15, "g"]] },
        { name: "Dinner", foods: [["Tofu", 200, "g"], ["Rice", 150, "g cooked"], ["Vegetables", 200, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Greek Yogurt", 200, "g"], ["Berries", 100, "g"], ["Almonds", 15, "g"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Rajma", 180, "g cooked"], ["Paneer", 100, "g"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Milk", 250, "ml"], ["Banana", 1, "medium"]] },
        { name: "Dinner", foods: [["Paneer", 150, "g"], ["Sweet Potato", 200, "g"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Milk", 250, "ml"], ["Apple", 1, "medium"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Chickpeas", 180, "g cooked"], ["Paneer", 120, "g"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Banana", 1, "medium"], ["Almonds", 15, "g"]] },
        { name: "Dinner", foods: [["Tofu", 180, "g"], ["Rice", 150, "g cooked"], ["Vegetables", 200, "g"]] },
      ],
    ];

    const nonVegetarianMeals = [
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Eggs", 3, "eggs"], ["Banana", 1, "medium"]] },
        { name: "Lunch", foods: [["Chicken", 150, "g"], ["Rice", 180, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Apple", 1, "medium"], ["Almonds", 20, "g"]] },
        { name: "Dinner", foods: [["Fish", 150, "g"], ["Sweet Potato", 200, "g"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Eggs", 3, "eggs"], ["Apple", 1, "medium"]] },
        { name: "Lunch", foods: [["Chicken", 150, "g"], ["Rice", 180, "g cooked"], ["Dal", 150, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Banana", 1, "medium"]] },
        { name: "Dinner", foods: [["Fish", 160, "g"], ["Rice", 150, "g cooked"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Milk", 250, "ml"], ["Eggs", 2, "eggs"], ["Banana", 1, "medium"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Chicken", 150, "g"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Almonds", 20, "g"]] },
        { name: "Dinner", foods: [["Paneer", 120, "g"], ["Fish", 120, "g"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Greek Yogurt", 200, "g"], ["Banana", 1, "medium"]] },
        { name: "Lunch", foods: [["Chicken", 170, "g"], ["Rice", 180, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Milk", 250, "ml"], ["Apple", 1, "medium"], ["Almonds", 15, "g"]] },
        { name: "Dinner", foods: [["Fish", 150, "g"], ["Sweet Potato", 200, "g"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Eggs", 3, "eggs"], ["Apple", 1, "medium"], ["Milk", 200, "ml"]] },
        { name: "Lunch", foods: [["Chicken", 150, "g"], ["Rice", 180, "g cooked"], ["Dal", 150, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Banana", 1, "medium"]] },
        { name: "Dinner", foods: [["Paneer", 100, "g"], ["Fish", 150, "g"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Eggs", 2, "eggs"], ["Greek Yogurt", 150, "g"], ["Banana", 1, "medium"]] },
        { name: "Lunch", foods: [["Rice", 180, "g cooked"], ["Chicken", 170, "g"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Milk", 250, "ml"], ["Apple", 1, "medium"], ["Almonds", 15, "g"]] },
        { name: "Dinner", foods: [["Fish", 160, "g"], ["Rice", 150, "g cooked"], ["Salad", 150, "g"]] },
      ],
      [
        { name: "Breakfast", foods: [["Oats", 60, "g"], ["Eggs", 3, "eggs"], ["Banana", 1, "medium"]] },
        { name: "Lunch", foods: [["Chicken", 150, "g"], ["Rice", 180, "g cooked"], ["Chickpeas", 120, "g cooked"], ["Vegetables", 150, "g"]] },
        { name: "Snack", foods: [["Greek Yogurt", 200, "g"], ["Apple", 1, "medium"], ["Almonds", 15, "g"]] },
        { name: "Dinner", foods: [["Fish", 150, "g"], ["Sweet Potato", 200, "g"], ["Salad", 150, "g"]] },
      ],
    ];

    const veganAllowed = new Set([
      "Oats", "Soy Milk", "Banana", "Rice", "Tofu", "Dal",
      "Vegetables", "Soy Yogurt", "Apple", "Almonds", "Soy Chunks",
      "Sweet Potato", "Salad", "Chickpeas", "Rajma", "Berries",
      "Nuts", "Peanut Butter", "Lentils", "Potato", "Spinach", "Fruit",
    ]);

    const weeklyTemplates = isVegan
      ? vegetarianMeals.map((day) =>
          day.map((meal) => ({
            ...meal,
            foods: meal.foods.filter((food: any[]) => veganAllowed.has(food[0])),
          }))
        )
      : isVegetarian
      ? vegetarianMeals
      : nonVegetarianMeals.map((day, dayIndex) => {
          if (dayIndex % 2 === 1) {
            return day.map((meal, mealIndex) => ({
              ...meal,
              foods:
                mealIndex === 0 || mealIndex === 2
                  ? vegetarianMeals[dayIndex][mealIndex].foods
                  : meal.foods,
            }));
          }
          return day;
        });

    const dayNames = [
      "Monday", "Tuesday", "Wednesday", "Thursday",
      "Friday", "Saturday", "Sunday",
    ];

    const proteinPriority = [
      "Chicken", "Fish", "Eggs", "Greek Yogurt", "Soy Chunks",
      "Tofu", "Paneer", "Dal", "Lentils", "Chickpeas", "Rajma",
    ];

    const calorieFlexibleFoods = [
      "Rice", "Oats", "Sweet Potato", "Potato", "Banana",
      "Peanut Butter", "Almonds", "Nuts", "Fruit", "Berries",
      "Vegetables", "Salad",
    ];

    const getFoodStep = (name: string) => {
      if (name === "Banana" || name === "Apple") return 1;
      if (name === "Eggs") return 1;
      if (name === "Peanut Butter" || name === "Almonds" || name === "Nuts") return 5;
      if (name === "Oats") return 10;
      if (name === "Rice" || name === "Sweet Potato" || name === "Potato") return 25;
      if (name === "Vegetables" || name === "Salad" || name === "Berries" || name === "Fruit") return 25;
      return 25;
    };

    const getFoodMax = (name: string) => {
      if (name === "Banana") return 3;
      if (name === "Apple") return 2;
      if (name === "Eggs") return 6;
      if (name === "Peanut Butter") return 60;
      if (name === "Almonds" || name === "Nuts") return 60;
      if (name === "Oats") return 120;
      if (name === "Rice") return 450;
      if (name === "Sweet Potato" || name === "Potato") return 450;
      if (name === "Vegetables" || name === "Salad") return 400;
      if (name === "Berries" || name === "Fruit") return 250;
      return 400;
    };

    const getFoodMin = (name: string) => {
      if (name === "Banana" || name === "Apple" || name === "Eggs") return 0;
      if (name === "Peanut Butter" || name === "Almonds" || name === "Nuts") return 0;
      return 0;
    };

    const recalculateMeal = (meal: any) => {
      const foods = meal.foods
        .map((food: any) => {
          // Meal templates use tuple format: [name, quantity, unit].
          // Normalize tuples and object-shaped foods into one safe format.
          if (Array.isArray(food)) {
            return calculateFood(
              String(food[0] || ""),
              Number(food[1]) || 0,
              String(food[2] || "g")
            );
          }

          return calculateFood(
            String(food?.name || ""),
            Number(food?.quantity) || 0,
            String(food?.unit || "g")
          );
        })
        .filter((food: any) => food.name);
      return {
        ...meal,
        foods,
        calories: Math.round(foods.reduce((sum: number, food: any) => sum + food.calories, 0)),
        protein: Number(foods.reduce((sum: number, food: any) => sum + food.protein, 0).toFixed(1)),
        carbs: Number(foods.reduce((sum: number, food: any) => sum + food.carbs, 0).toFixed(1)),
        fat: Number(foods.reduce((sum: number, food: any) => sum + food.fat, 0).toFixed(1)),
      };
    };

    const weeklyPlan = weeklyTemplates.map((dayTemplate, dayIndex) => {
      let selectedMeals = dayTemplate
        .map((meal: any) => ({
          ...meal,
          // Keep the original tuple data here; recalculateMeal() below
          // converts every food into the dashboard's object format.
          foods: meal.foods.filter((food: any) => {
            const foodName = Array.isArray(food)
              ? food[0]
              : food?.name;
            return foodName && !avoidFood(String(foodName));
          }),
        }))
        .slice(0, Math.min(4, requestedMeals));

      // Add a dedicated pre/post workout meal only when the user selected 5 meals.
      if (requestedMeals === 5) {
        selectedMeals.splice(3, 0, {
          name: "Pre/Post Workout",
          foods: isVegan
            ? [["Soy Milk", 250, "ml"], ["Banana", 1, "medium"]]
            : [["Greek Yogurt", 200, "g"], ["Banana", 1, "medium"]],
        });
      }

      // If allergy/restriction filtering removed all foods from a meal,
      // keep the meal but let the balancing logic work with the remaining foods.
      let meals = selectedMeals.map(recalculateMeal);

      const getDailyTotals = () =>
        meals.reduce(
          (totals: any, meal: any) => ({
            calories: totals.calories + meal.calories,
            protein: totals.protein + meal.protein,
            carbs: totals.carbs + meal.carbs,
            fat: totals.fat + meal.fat,
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

      // ---------------------------------------------------------
      // 1. Protein target: add protein-rich foods/quantities first.
      // ---------------------------------------------------------
      for (let iteration = 0; iteration < 150; iteration++) {
        const totals = getDailyTotals();
        if (totals.protein >= dailyProtein - 1) break;

        let bestMeal = -1;
        let bestFood = -1;
        let bestGain = 0;
        let replacement: any = null;

        meals.forEach((meal: any, mealIndex: number) => {
          meal.foods.forEach((food: any, foodIndex: number) => {
            if (!proteinPriority.includes(food.name)) return;

            const step = food.name === "Eggs" ? 1 : food.name === "Greek Yogurt" ? 50 : 25;
            if (food.quantity + step > getFoodMax(food.name)) return;

            const next = calculateFood(food.name, food.quantity + step, food.unit);
            const gain = next.protein - food.protein;

            if (gain > bestGain) {
              bestGain = gain;
              bestMeal = mealIndex;
              bestFood = foodIndex;
              replacement = next;
            }
          });
        });

        if (bestMeal < 0 || bestFood < 0 || !replacement) break;
        meals[bestMeal].foods[bestFood] = replacement;
        meals[bestMeal] = recalculateMeal(meals[bestMeal]);
      }

      // ---------------------------------------------------------
      // 2. Calorie target: raise/lower calories primarily through
      //    carbohydrate/fat foods, without deliberately chasing protein.
      // ---------------------------------------------------------
      for (let iteration = 0; iteration < 500; iteration++) {
        const totals = getDailyTotals();
        const difference = dailyCalories - totals.calories;

        if (Math.abs(difference) <= 25) break;

        let bestMeal = -1;
        let bestFood = -1;
        let bestDelta = 0;
        let replacement: any = null;

        meals.forEach((meal: any, mealIndex: number) => {
          meal.foods.forEach((food: any, foodIndex: number) => {
            if (!calorieFlexibleFoods.includes(food.name)) return;

            const step = getFoodStep(food.name);
            const currentQuantity = Number(food.quantity) || 0;
            const nextQuantity = difference > 0
              ? currentQuantity + step
              : currentQuantity - step;

            if (nextQuantity > getFoodMax(food.name)) return;
            if (nextQuantity < getFoodMin(food.name)) return;

            const next = calculateFood(food.name, nextQuantity, food.unit);
            const delta = next.calories - food.calories;

            if (difference > 0) {
              if (delta > 0 && (bestDelta === 0 || delta < bestDelta || Math.abs(difference - delta) < Math.abs(difference - bestDelta))) {
                bestDelta = delta;
                bestMeal = mealIndex;
                bestFood = foodIndex;
                replacement = next;
              }
            } else {
              if (delta < 0 && (bestDelta === 0 || delta > bestDelta || Math.abs(difference - delta) < Math.abs(difference - bestDelta))) {
                bestDelta = delta;
                bestMeal = mealIndex;
                bestFood = foodIndex;
                replacement = next;
              }
            }
          });
        });

        // If no existing flexible food can move, add a flexible food to a meal.
        if (bestMeal < 0 || bestFood < 0 || !replacement) {
          if (difference > 25 && meals.length > 0) {
            const candidateNames = isVegan
              ? ["Rice", "Oats", "Peanut Butter", "Sweet Potato"]
              : ["Rice", "Oats", "Peanut Butter", "Sweet Potato"];

            const candidate = candidateNames.find((name) => !avoidFood(name));
            if (candidate) {
              const unit = candidate === "Rice" ? "g cooked" : candidate === "Sweet Potato" ? "g" : "g";
              const quantity = candidate === "Peanut Butter" ? 10 : candidate === "Oats" ? 20 : 50;
              const targetMealIndex = meals.length > 1 ? 1 : 0;
              meals[targetMealIndex].foods.push(calculateFood(candidate, quantity, unit));
              meals[targetMealIndex] = recalculateMeal(meals[targetMealIndex]);
              continue;
            }
          }
          break;
        }

        meals[bestMeal].foods[bestFood] = replacement;
        meals[bestMeal] = recalculateMeal(meals[bestMeal]);
      }

      // ---------------------------------------------------------
      // 3. Final small correction. Choose the closest calorie state
      //    from a small set of flexible-food adjustments.
      // ---------------------------------------------------------
      let totals = getDailyTotals();
      let correctionIterations = 0;

      while (Math.abs(dailyCalories - totals.calories) > 40 && correctionIterations < 40) {
        correctionIterations++;
        const direction = dailyCalories > totals.calories ? 1 : -1;
        let bestChoice: any = null;
        const beforeDistance = Math.abs(dailyCalories - totals.calories);

        meals.forEach((meal: any, mealIndex: number) => {
          meal.foods.forEach((food: any, foodIndex: number) => {
            if (!calorieFlexibleFoods.includes(food.name)) return;
            const step = getFoodStep(food.name);
            const nextQuantity = food.quantity + direction * step;
            if (nextQuantity < getFoodMin(food.name) || nextQuantity > getFoodMax(food.name)) return;

            const next = calculateFood(food.name, nextQuantity, food.unit);
            const nextCalories = totals.calories - food.calories + next.calories;
            const distance = Math.abs(dailyCalories - nextCalories);

            if (distance < beforeDistance && (!bestChoice || distance < bestChoice.distance)) {
              bestChoice = { mealIndex, foodIndex, next, distance };
            }
          });
        });

        if (!bestChoice) break;
        meals[bestChoice.mealIndex].foods[bestChoice.foodIndex] = bestChoice.next;
        meals[bestChoice.mealIndex] = recalculateMeal(meals[bestChoice.mealIndex]);
        totals = getDailyTotals();
      }

      meals = meals.map(recalculateMeal);
      totals = getDailyTotals();

      return {
        day: dayNames[dayIndex],
        meals,
        target_calories: dailyCalories,
        target_protein: dailyProtein,
        actual_calories: Math.round(totals.calories),
        actual_protein: Number(totals.protein.toFixed(1)),
      };
    });

    return weeklyPlan;
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

  weekly_plan: generateNutritionMeals(
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
    showMessage("Failed to save your AI Plan.", "AI Plan Error");
    return;
  }

  setAiPlan(data);

  showMessage("Your personalized workout and nutrition plan has been successfully updated.", "AI Plan Updated!");
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

<div className="mb-8 rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-surface-gray-900 to-surface-black p-2 sm:p-8 shadow-xl">

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

    <div className="w-full rounded-2xl bg-surface-gray-900 border border-white/10 p-6">

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
  <div className="space-y-3 w-full">
    {todayWorkout.exercises.map(
      (exercise: any, index: number) => (
        <div
          key={index}
          className="group bg-gradient-to-b from-[#171717] to-[#090909] border border-white/10 hover:border-red-500/40 rounded-2xl p-3 sm:p-4 shadow-lg shadow-black/20 transition-colors duration-200"
        >
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-3">
              <ExerciseThumbnail name={exercise.name} />

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white leading-tight">
                  {exercise.name}
                </p>

                {exercise.rest === "—" ? (
                  <p className="inline-flex mt-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-gray-200">
                    {exercise.reps}
                  </p>
                ) : (
                  <p className="inline-flex mt-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-gray-300">
                    {exercise.sets} Sets <span className="mx-2 text-red-400">×</span> {exercise.reps} Reps
                  </p>
                )}
              </div>
            </div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
  <div className="min-w-0">
    <label className="text-xs text-surface-gray-400 whitespace-nowrap">
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
      className="mt-1 w-full min-w-0 bg-[#111] border border-white/10 focus:border-red-500/60 rounded-lg px-3 py-2 text-white outline-none transition-colors"
    />
  </div>

  <div className="min-w-0">
    <label className="text-xs text-surface-gray-400 whitespace-nowrap">
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
      className="mt-1 w-full min-w-0 bg-[#111] border border-white/10 focus:border-red-500/60 rounded-lg px-3 py-2 text-white outline-none transition-colors"
    />
  </div>
</div>

            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-surface-gray-500">
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

  <div className="grid grid-cols-2 gap-3 mb-6">
  <div className="rounded-xl bg-surface-gray-800/70 border border-white/10 p-4">
    <p className="text-xs text-surface-gray-400">
      Calories
    </p>

    <p className="text-xl font-bold text-white mt-1">
      {totalCalories} / {calories} kcal
    </p>

    <p className="text-xs text-surface-gray-500 mt-1">
      {Math.max(0, Number(calories) - Number(totalCalories))} kcal remaining
    </p>
  </div>

  <div className="rounded-xl bg-surface-gray-800/70 border border-white/10 p-4">
    <p className="text-xs text-surface-gray-400">
      Protein
    </p>

    <p className="text-xl font-bold text-white mt-1">
      {totalProtein} / {proteinTarget} g
    </p>

    <p className="text-xs text-surface-gray-500 mt-1">
      {Math.max(0, Number(proteinTarget) - Number(totalProtein)).toFixed(1)} g remaining
    </p>
  </div>
</div>

 <div className="space-y-5 mt-6">
    {todayNutrition?.meals?.map(
      (meal: any, index: number) => (
        <div key={index}>
          <p className="text-sm text-surface-gray-400 mb-1">
            {meal.name}
          </p>

          <div className="flex flex-wrap gap-2">
  {meal.foods.map((food: any, foodIndex: number) => (
    <div
  key={foodIndex}
  className="inline-flex items-center gap-3 rounded-xl bg-surface-gray-800 border border-white/10 px-3 py-2 text-sm text-white"
>
  <img
    src={getFoodImage(food.name)}
    alt={food.name}
    className="w-12 h-12 rounded-lg object-cover border border-white/10"
  />

  <div className="flex flex-col">
    <span className="font-medium">{food.name}</span>
    <span className="text-xs text-surface-gray-400">
      {food.quantity} {food.unit}
    </span>
  </div>
</div>
  ))}
</div>

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
      <span>{totalCalories} / {calories} kcal</span>
    </div>

    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-red-500 h-2 rounded-full"
        style={{
          width: `${
  typeof calories === "number"
    ? Math.min((totalCalories / calories) * 100, 100)
    : 0
}%`,
        }}
      />
    </div>
  </div>

  {/* Protein */}
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>💪 Protein</span>
      <span>{totalProtein} / {proteinTarget} g</span>
    </div>

    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className="bg-green-500 h-2 rounded-full"
        style={{
          width: `${
  typeof proteinTarget === "number"
    ? Math.min((totalProtein / proteinTarget) * 100, 100)
    : 0
}%`,
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

      {/* BodyWise AI reusable confirmation / message popup */}
      {popup.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md rounded-3xl border border-red-500/30 bg-gradient-to-br from-surface-gray-900 to-black p-8 text-center shadow-2xl shadow-red-500/10">
            <div className="absolute inset-0 rounded-3xl bg-red-500/5 pointer-events-none" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 border border-red-500/30">
                <span className="text-3xl">
                  {popup.type === "confirm" ? "⚠️" : "🎉"}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {popup.title}
              </h2>

              <p className="text-surface-gray-400 mb-7 leading-relaxed">
                {popup.message}
              </p>

              {popup.type === "confirm" ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => closePopup(false)}
                    className="w-full rounded-xl border border-white/10 bg-surface-gray-800 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-surface-gray-700 active:scale-[0.98]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => closePopup(true)}
                    className="w-full rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98]"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => closePopup()}
                  className="w-full rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98]"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
   </div>
  );
 }
 