import {
  ArrowRight,
  Play,
  Activity,
  TrendingUp,
  Brain,
  Target,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
} from 'lucide-react';

interface HeroProps {
  onSignUp: () => void;
}

function FeatureCard({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-brand-red/30 hover:bg-white/[0.055]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 border border-brand-red/15">
        <Icon className="h-5 w-5 text-brand-red" />
      </div>

      <div>
        <p className="text-sm sm:text-base font-semibold text-white">
          {title}
        </p>
        <p className="text-xs sm:text-sm text-surface-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function FloatingCard({
  icon: Icon,
  title,
  subtitle,
  className = '',
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.1] bg-[#111111]/90 px-4 py-3 shadow-2xl backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10">
          <Icon className="h-5 w-5 text-brand-red" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            {title}
          </p>
          <p className="text-[11px] text-surface-gray-400">
            {subtitle}
          </p>
        </div>

        <span className="ml-auto text-white/50 text-lg">›</span>
      </div>
    </div>
  );
}

function ProgressCard() {
  return (
    <div className="w-[150px] rounded-2xl border border-white/[0.1] bg-[#111111]/95 p-4 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white">
          Your Progress
        </span>

        <TrendingUp className="h-4 w-4 text-brand-red" />
      </div>

      <div className="relative h-16 w-full">
        <svg
          viewBox="0 0 140 60"
          className="h-full w-full overflow-visible"
        >
          <path
            d="M5 50 C25 45, 28 48, 42 38 C55 28, 58 42, 70 31 C82 20, 87 30, 98 22 C110 14, 118 18, 135 5"
            fill="none"
            stroke="rgba(229,57,53,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="text-xl font-bold text-white">
        +12.5 <span className="text-sm">kg</span>
      </p>

      <p className="mt-1 text-[10px] text-surface-gray-400">
        Stronger Every Day
      </p>
    </div>
  );
}

function NutritionPhone() {
  return (
    <div className="absolute bottom-[-20px] left-[8%] z-20 rotate-[8deg]">
      <div className="relative h-[275px] w-[155px] rounded-[26px] border-[5px] border-[#202020] bg-[#080808] shadow-[0_25px_60px_rgba(0,0,0,0.65)]">
        {/* Phone top */}
        <div className="absolute left-1/2 top-1 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />

        <div className="h-full overflow-hidden rounded-[20px] bg-[#0b0b0b] px-3 pt-7">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[7px] text-white/50">
              BodyWise AI
            </span>

            <Activity className="h-3 w-3 text-brand-red" />
          </div>

          <div className="mb-3 text-center">
            <p className="text-[8px] text-white/50">
              Today's Nutrition
            </p>

            <p className="text-xl font-bold text-white">
              2,450
            </p>

            <p className="text-[7px] text-white/40">
              kcal
            </p>
          </div>

          {/* Nutrition ring */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[conic-gradient(#E53935_0deg,#E53935_125deg,#22C55E_125deg,#22C55E_225deg,#3B82F6_225deg,#3B82F6_315deg,#333_315deg)]">
            <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#0b0b0b]">
              <span className="text-[9px] font-bold text-white">
                2,450
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 text-center">
            <div>
              <p className="text-[9px] font-bold text-white">
                180g
              </p>
              <p className="text-[6px] text-white/40">
                Protein
              </p>
            </div>

            <div>
              <p className="text-[9px] font-bold text-white">
                250g
              </p>
              <p className="text-[6px] text-white/40">
                Carbs
              </p>
            </div>

            <div>
              <p className="text-[9px] font-bold text-white">
                70g
              </p>
              <p className="text-[6px] text-white/40">
                Fats
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="h-1 rounded-full bg-white/10">
              <div className="h-1 w-[82%] rounded-full bg-green-500" />
            </div>

            <div className="h-1 rounded-full bg-white/10">
              <div className="h-1 w-[68%] rounded-full bg-blue-500" />
            </div>

            <div className="h-1 rounded-full bg-white/10">
              <div className="h-1 w-[54%] rounded-full bg-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ onSignUp }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-surface-black">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-25" />

      <div className="absolute left-[25%] top-[20%] h-[500px] w-[500px] rounded-full bg-brand-red/[0.05] blur-[160px]" />

      <div className="absolute right-[15%] top-[25%] h-[550px] w-[550px] rounded-full bg-brand-red/[0.10] blur-[180px]" />

      {/* Subtle red grid glow */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(229,57,53,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,0.6) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Main hero */}
      <div className="relative z-10 mx-auto max-w-[1500px] px-6 pt-28 pb-10 sm:px-8 lg:px-12 lg:pt-32">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4">

          {/* LEFT CONTENT */}
          <div className="relative z-30 max-w-2xl">

            {/* AI badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-red/25 bg-brand-red/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-red" />

              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
                AI-Powered Fitness Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5.2rem] xl:text-[5.8rem]">

              Transform Your
              <br />

              Body
              <br />

              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-white via-[#ffb5b3] to-brand-red bg-clip-text text-transparent">
                  with AI-Powered
                </span>

                <span className="absolute -bottom-2 left-0 h-[4px] w-[72%] rounded-full bg-gradient-to-r from-brand-red to-transparent" />
              </span>

              <br />

              Fitness
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-xl text-base leading-7 text-surface-gray-400 sm:text-lg">
              Personalized workouts, nutrition guidance, progress tracking,
              and intelligent fitness insights — all in one platform.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">

              <button
                onClick={onSignUp}
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-brand-red px-7 py-4 text-base font-bold text-white shadow-[0_15px_40px_rgba(229,57,53,0.25)] transition-all duration-300 hover:scale-[1.02] hover:bg-red-500"
              >
                Start Your Transformation

                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onSignUp}
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/[0.02] px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/[0.05]"
              >
                <Play className="h-4 w-4" />

                Start 7-Day Free Trial
              </button>

            </div>

            {/* Trust row */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-surface-gray-500">
              <span>No Credit Card Required</span>
              <span className="h-1 w-1 rounded-full bg-brand-red" />
              <span>7-Day Free Trial</span>
              <span className="h-1 w-1 rounded-full bg-brand-red" />
              <span>Cancel Anytime</span>
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative min-h-[480px] sm:min-h-[560px] lg:min-h-[720px]">

            {/* Main red glow */}
            <div className="absolute left-[30%] top-[12%] h-[520px] w-[520px] rounded-full bg-brand-red/20 blur-[130px]" />

            {/* Circular technical rings */}
            <div className="absolute left-[30%] top-[15%] h-[500px] w-[500px] rounded-full border border-brand-red/20" />

            <div className="absolute left-[34%] top-[19%] h-[420px] w-[420px] rounded-full border border-brand-red/15" />

            <div className="absolute left-[38%] top-[23%] h-[340px] w-[340px] rounded-full border border-brand-red/10 border-dashed" />

            {/* Athlete */}
            <div
            className="absolute inset-x-[8%] bottom-0 top-[2%] -translate-x-[8%] overflow-hidden"
            style={{
            maskImage:
             "radial-gradient(ellipse 95% 95% at 50% 50%, black 100%, rgba(0,0,0,0.98) 94%, transparent 100%)",
           WebkitMaskImage:
             "radial-gradient(ellipse 95% 95% at 50% 50%, black 100%, rgba(0,0,0,0.98) 94%, transparent 100%)",
            }}
      >
            <img
             src="/bodywise-athlete.png"
             alt="BodyWise fitness athlete"
             className="h-full w-full object-cover object-[55%_center]"
             />

          <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-surface-black to-transparent pointer-events-none" />

             {/* Hide unwanted text inside the reference crop */}
            <div className="absolute left-0 top-[12%] h-[48%] w-[38%] bg-gradient-to-r from-surface-black via-surface-black/90 to-transparent" />

            {/* Blend the right edge into the background */}
            <div className="absolute inset-y-0 right-0 w-[28%] bg-gradient-to-l from-surface-black via-surface-black/70 to-transparent" />

            {/* Blend the lower edge */}
             <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-surface-black via-surface-black/70 to-transparent" />

             <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-red/20 mix-blend-screen" />

              {/* Red lighting */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-red/20 mix-blend-screen" />
            </div>

            {/* AI ACTIVE */}
            <div className="absolute right-[3%] top-[4%] z-30 rounded-xl border border-white/10 bg-[#111111]/90 px-4 py-3 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-red" />

                <span className="text-xs font-bold tracking-wide text-brand-red">
                  AI ACTIVE
                </span>
              </div>
            </div>

            {/* Workout card */}
            <div className="absolute left-[2%] top-[15%] z-30 w-[220px] sm:w-[250px] lg:w-[270px]">
              <FloatingCard
                icon={Dumbbell}
                title="Workout Plan"
                subtitle="Personalized for you"
              />
            </div>

            {/* Nutrition card */}
            <div className="absolute right-[6%] top-[28%] z-30 w-[250px] sm:w-[280px] lg:w-[300px]">
              <FloatingCard
                icon={UtensilsCrossed}
                title="Nutrition Plan"
                subtitle="Meals tailored to your goals"
              />
            </div>

            <div className="absolute right-[16%] top-[75%] z-30 rotate-[6deg]">
              <ProgressCard />
           </div>

            {/* Progress tracking */}
            <div className="absolute right-[0%] top-[48%] z-30 w-[250px] sm:w-[280px] lg:w-[310px]">
              <FloatingCard
                icon={TrendingUp}
                title="Progress Tracking"
                subtitle="See your transformation"
              />
            </div>

            {/* AI Coach */}
            <div className="absolute right-[8%] top-[60%] z-30 w-[240px] sm:w-[250px] lg:right-[22%] lg:top-[57%] lg:w-[270px]">
              <FloatingCard
                icon={Brain}
                title="AI Coach"
                subtitle="Always here to guide you"
              />
            </div>

            {/* Nutrition phone */}
            <NutritionPhone />

          </div>
        </div>

        {/* Bottom feature cards */}
        <div className="relative z-30 mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <FeatureCard
            icon={Activity}
            title="AI-Powered"
            subtitle="Workout Plans"
          />

          <FeatureCard
            icon={TrendingUp}
            title="Smart Progress"
            subtitle="Tracking"
          />

          <FeatureCard
            icon={UtensilsCrossed}
            title="Personalized"
            subtitle="Nutrition Guidance"
          />

          <FeatureCard
            icon={Target}
            title="Goal-Based"
            subtitle="Fitness Coaching"
          />

        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-black to-transparent" />
    </section>
  );
}