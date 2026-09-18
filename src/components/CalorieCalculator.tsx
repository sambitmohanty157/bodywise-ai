import { useState, useEffect } from 'react';
import { Flame, ArrowRight, Zap, Target, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import { supabase } from '../lib/supabase';


type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';

interface CalorieResult {
  bmr: number;
  maintenance: number;
  fatLoss: number;
  muscleGain: number;
}

const activityOptions: { value: ActivityLevel; label: string; factor: number }[] = [
  { value: 'sedentary', label: 'Sedentary', factor: 1.2 },
  { value: 'light', label: 'Lightly Active', factor: 1.375 },
  { value: 'moderate', label: 'Moderately Active', factor: 1.55 },
  { value: 'active', label: 'Very Active', factor: 1.725 },
  { value: 'athlete', label: 'Athlete', factor: 1.9 },
];

function calculateCalories(
  gender: Gender,
  age: number,
  height: number,
  weight: number,
  activity: ActivityLevel
): CalorieResult {
  // Mifflin-St Jeor
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;

  const factor = activityOptions.find(a => a.value === activity)!.factor;
  const maintenance = Math.round(bmr * factor);

  return {
    bmr: Math.round(bmr),
    maintenance,
    fatLoss: maintenance - 500,
    muscleGain: maintenance + 300,
  };
}

export default function CalorieCalculator() {
  const { ref, isInView } = useInView(0.1);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('sedentary');
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!data) return;

    setAge(data.age?.toString() || '');
    setGender(data.gender || 'male');
    setHeight(data.height_cm?.toString() || '');
    setWeight(data.current_weight_kg?.toString() || '');

    if (data.activity_level) {
      setActivity(data.activity_level as ActivityLevel);
    }
  }

  loadProfile();
}, []);

  function handleCalculate() {
    setError('');
    setResult(null);

    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!a || a <= 0 || a > 120) {
      setError('Enter a valid age between 1 and 120.');
      return;
    }
    if (!h || h <= 0 || h > 300) {
      setError('Enter a valid height between 1 and 300 cm.');
      return;
    }
    if (!w || w <= 0 || w > 500) {
      setError('Enter a valid weight between 1 and 500 kg.');
      return;
    }

    setResult(calculateCalories(gender, a, h, w, activity));
  }

  const resultCards = result
    ? [
        { icon: Zap, label: 'BMR', value: result.bmr, unit: 'kcal', color: '#E53935', desc: 'Basal Metabolic Rate' },
        { icon: Activity, label: 'Maintenance', value: result.maintenance, unit: 'kcal', color: '#3B82F6', desc: 'Calories to maintain weight' },
        { icon: TrendingDown, label: 'Fat Loss', value: result.fatLoss, unit: 'kcal', color: '#F97316', desc: '-500 kcal deficit' },
        { icon: TrendingUp, label: 'Muscle Gain', value: result.muscleGain, unit: 'kcal', color: '#22C55E', desc: '+300 kcal surplus' },
      ]
    : [];

  return (
    <section id="calories" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-surface-black" />
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/3 rounded-full blur-[200px]" />

      <div ref={ref} className={`section-container relative z-10 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <Flame className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">Free Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
            Daily Calorie <span className="text-gradient">Calculator</span>
          </h2>
          <p className="text-surface-gray-400 text-lg leading-relaxed">
            Calculate your daily caloric needs using the Mifflin-St Jeor formula, personalized to your body and activity level.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-red to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Input side — 2 cols */}
              <div className="lg:col-span-2 p-8 lg:p-10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-red" />
                  Your Details
                </h3>

                <div className="flex flex-col gap-4">
                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['male', 'female'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            gender === g
                              ? 'bg-brand-red/20 border border-brand-red/40 text-brand-red'
                              : 'bg-surface-gray-800/40 border border-white/[0.06] text-surface-gray-400 hover:text-white hover:border-white/[0.12]'
                          }`}
                        >
                          {g === 'male' ? 'Male' : 'Female'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">
                      Age
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-surface-gray-800/60 border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder-surface-gray-600 focus:outline-none focus:border-brand-red/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="e.g. 25"
                        min="1"
                        max="120"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-surface-gray-600 font-medium">yrs</span>
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">
                      Height
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-surface-gray-800/60 border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder-surface-gray-600 focus:outline-none focus:border-brand-red/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="e.g. 180"
                        min="1"
                        max="300"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-surface-gray-600 font-medium">cm</span>
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">
                      Weight
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-surface-gray-800/60 border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder-surface-gray-600 focus:outline-none focus:border-brand-red/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="e.g. 80"
                        min="1"
                        max="500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-surface-gray-600 font-medium">kg</span>
                    </div>
                  </div>

                  {/* Activity Level */}
                  <div>
                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">
                      Activity Level
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {activityOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setActivity(opt.value)}
                          className={`flex items-center justify-between py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                            activity === opt.value
                              ? 'bg-brand-red/15 border border-brand-red/30 text-brand-red'
                              : 'bg-surface-gray-800/30 border border-white/[0.04] text-surface-gray-500 hover:text-surface-gray-300 hover:border-white/[0.08]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="text-[10px] opacity-60">x{opt.factor}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-brand-red">{error}</p>
                  )}

                  <button
                    onClick={handleCalculate}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-base mt-1"
                  >
                    <Flame className="w-4 h-4" />
                    Calculate Calories
                  </button>
                </div>
              </div>

              {/* Result side — 3 cols */}
              <div className="lg:col-span-3 p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-white/[0.04]">
                {result ? (
                  <div className="animate-fade-in">
                    {/* Result cards grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {resultCards.map((card) => (
                        <div
                          key={card.label}
                          className="relative rounded-xl p-5 bg-surface-gray-900/60 border border-white/[0.04] overflow-hidden group hover:border-white/[0.08] transition-colors"
                        >
                          <div
                            className="absolute top-0 right-0 w-20 h-20 opacity-20 group-hover:opacity-30 transition-opacity"
                            style={{
                              background: `radial-gradient(circle at top right, ${card.color}30, transparent 70%)`,
                              borderRadius: '0 0.75rem 0 0',
                            }}
                          />
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${card.color}15` }}
                          >
                            <card.icon className="w-5 h-5" style={{ color: card.color }} />
                          </div>
                          <p className="text-[10px] uppercase tracking-wider text-surface-gray-500 mb-1">{card.label}</p>
                          <p className="text-2xl font-black" style={{ color: card.color }}>
                            {card.value.toLocaleString()}
                            <span className="text-xs font-medium text-surface-gray-600 ml-1">{card.unit}</span>
                          </p>
                          <p className="text-[11px] text-surface-gray-600 mt-1">{card.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recommendation */}
                    <div className="rounded-xl bg-surface-gray-900/60 border border-white/[0.04] p-5 mb-6">
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-brand-red" />
                        Personalized Recommendation
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-lg bg-[#F97316]/10 border border-[#F97316]/20 px-4 py-3">
                          <p className="text-xs font-semibold text-[#F97316] mb-1">Fat Loss Goal</p>
                          <p className="text-sm text-surface-gray-300">
                            Eat <span className="font-bold text-white">{result.fatLoss.toLocaleString()} kcal</span>/day with a 500 kcal deficit. Focus on high protein and consistent strength training.
                          </p>
                        </div>
                        <div className="rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 px-4 py-3">
                          <p className="text-xs font-semibold text-[#22C55E] mb-1">Muscle Gain Goal</p>
                          <p className="text-sm text-surface-gray-300">
                            Eat <span className="font-bold text-white">{result.muscleGain.toLocaleString()} kcal</span>/day with a 300 kcal surplus. Prioritize progressive overload and adequate recovery.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                      <p className="text-sm text-surface-gray-400 mb-3">Get AI-powered meal plans tailored to your calorie targets</p>
                      <a href="#pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover transition-colors group">
                        Explore BodyWise AI Plans
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-2xl bg-surface-gray-800/60 border border-white/[0.06] flex items-center justify-center mx-auto mb-5">
                      <Flame className="w-8 h-8 text-surface-gray-600" />
                    </div>
                    <p className="text-surface-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Fill in your details and hit <span className="text-white font-semibold">Calculate Calories</span> to see your personalized daily calorie targets.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
