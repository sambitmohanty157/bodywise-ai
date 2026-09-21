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

/* =========================================================
   FEATURE CARD
========================================================= */

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
    <div
      className="
        group flex items-center gap-4
        rounded-2xl
        border border-white/[0.08]
        bg-white/[0.035]
        px-5 py-4
        backdrop-blur-xl
        transition-all duration-300
        hover:border-brand-red/30
        hover:bg-white/[0.055]
      "
    >
      <div
        className="
          flex h-12 w-12 shrink-0 items-center justify-center
          rounded-xl
          border border-brand-red/15
          bg-brand-red/10
        "
      >
        <Icon className="h-5 w-5 text-brand-red" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-white sm:text-base">
          {title}
        </p>

        <p className="text-xs text-surface-gray-400 sm:text-sm">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   FLOATING CARD
========================================================= */

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
      className={`
        rounded-2xl
        border border-white/[0.10]
        bg-[#111111]/90
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        backdrop-blur-xl
        ${className}
      `}
    >
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4">

        <div
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-xl
            bg-brand-red/10
            border border-brand-red/10
          "
        >
          <Icon className="h-5 w-5 text-brand-red" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white sm:text-base">
            {title}
          </p>

          <p className="truncate text-[11px] text-surface-gray-400 sm:text-xs">
            {subtitle}
          </p>
        </div>

        <span className="shrink-0 text-lg text-white/50">
          ›
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   PROGRESS CARD
========================================================= */

function ProgressCard() {
  return (
    <div
      className="
        w-[150px]
        rounded-2xl
        border border-white/[0.10]
        bg-[#111111]/95
        p-4
        shadow-[0_20px_60px_rgba(0,0,0,0.55)]
        backdrop-blur-xl
      "
    >
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
            d="
              M5 50
              C25 45, 28 48, 42 38
              C55 28, 58 42, 70 31
              C82 20, 87 30, 98 22
              C110 14, 118 18, 135 5
            "
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

/* =========================================================
   NUTRITION PHONE
========================================================= */

function NutritionPhone() {
  return (
    <div
      className="
        absolute
        z-20
        left-[3%]
        bottom-[-25px]
        rotate-[8deg]
        sm:left-[7%]
        lg:left-[8%]
      "
    >
      <div
        className="
          relative
          h-[275px]
          w-[155px]
          rounded-[28px]
          border-[5px]
          border-[#202020]
          bg-[#080808]
          shadow-[0_30px_70px_rgba(0,0,0,0.7)]
          sm:h-[300px]
          sm:w-[170px]
          lg:h-[310px]
          lg:w-[175px]
        "
      >
        {/* Dynamic Island */}
        <div
          className="
            absolute
            left-1/2
            top-1
            z-10
            h-4
            w-16
            -translate-x-1/2
            rounded-full
            bg-black
          "
        />

        <div
          className="
            h-full
            overflow-hidden
            rounded-[22px]
            bg-[#090909]
            px-3
            pt-7
          "
        >
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
          <div
            className="
              mx-auto
              mb-4
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-[conic-gradient(#E53935_0deg,#E53935_125deg,#22C55E_125deg,#22C55E_225deg,#3B82F6_225deg,#3B82F6_315deg,#333_315deg)]
            "
          >
            <div
              className="
                flex
                h-[62px]
                w-[62px]
                items-center
                justify-center
                rounded-full
                bg-[#0b0b0b]
              "
            >
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

/* =========================================================
   HERO
========================================================= */

export default function Hero({ onSignUp }: HeroProps) {
  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-surface-black
      "
    >

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 bg-grid opacity-20" />

      <div
        className="
          absolute
          left-[20%]
          top-[15%]
          h-[450px]
          w-[450px]
          rounded-full
          bg-brand-red/[0.04]
          blur-[160px]
        "
      />

      <div
        className="
          absolute
          right-[5%]
          top-[15%]
          h-[600px]
          w-[600px]
          rounded-full
          bg-brand-red/[0.08]
          blur-[180px]
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-1/2
          h-[450px]
          w-[450px]
          -translate-x-1/2
          rounded-full
          bg-brand-red/[0.035]
          blur-[170px]
        "
      />

      {/* subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'linear-gradient(rgba(229,57,53,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,0.7) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* =====================================================
          MAIN HERO
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1500px]
          px-5
          pt-28
          pb-10
          sm:px-8
          lg:px-12
          lg:pt-32
        "
      >

        <div
          className="
            grid
            gap-8
            lg:grid-cols-[0.92fr_1.08fr]
            lg:items-center
            lg:gap-2
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="relative z-40 max-w-2xl">

            {/* AI badge */}
            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-brand-red/25
                bg-brand-red/10
                px-4
                py-2
              "
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-red" />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-brand-red
                  sm:text-[11px]
                "
              >
                AI-Powered Fitness Platform
              </span>
            </div>

            {/* Headline */}
            <h1
              className="
                text-5xl
                font-black
                leading-[0.98]
                tracking-[-0.045em]
                text-white
                sm:text-6xl
                lg:text-[5rem]
                xl:text-[5.6rem]
              "
            >
              Transform Your
              <br />

              Body
              <br />

              <span className="relative inline-block">
                <span
                  className="
                    bg-gradient-to-r
                    from-white
                    via-[#ffb5b3]
                    to-brand-red
                    bg-clip-text
                    text-transparent
                  "
                >
                  with AI-Powered
                </span>

                <span
                  className="
                    absolute
                    -bottom-2
                    left-0
                    h-[4px]
                    w-[72%]
                    rounded-full
                    bg-gradient-to-r
                    from-brand-red
                    to-transparent
                  "
                />
              </span>

              <br />

              Fitness
            </h1>

            {/* Description */}
            <p
              className="
                mt-7
                max-w-xl
                text-base
                leading-7
                text-surface-gray-400
                sm:text-lg
              "
            >
              Personalized workouts, nutrition guidance, progress tracking,
              and intelligent fitness insights — all in one platform.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <button
                onClick={onSignUp}
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-brand-red
                  px-7
                  py-4
                  text-base
                  font-bold
                  text-white
                  shadow-[0_15px_40px_rgba(229,57,53,0.25)]
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                  hover:bg-red-500
                "
              >
                Start Your Transformation

                <ArrowRight
                  className="
                    h-5
                    w-5
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </button>

              <button
                onClick={onSignUp}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-white/20
                  bg-white/[0.02]
                  px-7
                  py-4
                  text-base
                  font-semibold
                  text-white
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:border-white/40
                  hover:bg-white/[0.05]
                "
              >
                <Play className="h-4 w-4" />

                Start 7-Day Free Trial
              </button>

            </div>

            {/* Trust row */}
            <div
              className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
                text-[10px]
                text-surface-gray-500
                sm:text-[11px]
              "
            >
              <span>No Credit Card Required</span>

              <span className="h-1 w-1 rounded-full bg-brand-red" />

              <span>7-Day Free Trial</span>

              <span className="h-1 w-1 rounded-full bg-brand-red" />

              <span>Cancel Anytime</span>
            </div>
          </div>

          {/* =================================================
              RIGHT VISUAL
          ================================================= */}

          <div
            className="
              relative
              mt-2
              min-h-[650px]
              sm:min-h-[700px]
              lg:mt-0
              lg:min-h-[720px]
            "
          >

            {/* =================================================
                RED GLOW
            ================================================= */}

            <div
              className="
                absolute
                left-[25%]
                top-[10%]
                h-[500px]
                w-[500px]
                rounded-full
                bg-brand-red/15
                blur-[130px]
                sm:left-[28%]
                lg:left-[25%]
              "
            />

            {/* =================================================
                TECHNICAL RINGS
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                left-[15%]
                top-[9%]
                h-[500px]
                w-[500px]
                rounded-full
                border
                border-brand-red/20
                sm:left-[20%]
                lg:left-[24%]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-[20%]
                top-[14%]
                h-[420px]
                w-[420px]
                rounded-full
                border
                border-brand-red/15
                sm:left-[25%]
                lg:left-[29%]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                left-[25%]
                top-[19%]
                h-[340px]
                w-[340px]
                rounded-full
                border
                border-brand-red/10
                border-dashed
                sm:left-[30%]
                lg:left-[34%]
              "
            />

{/* =================================================
    ATHLETE
================================================= */}

<div
  className="
    absolute
    inset-x-0
    bottom-0
    top-0
    z-10
    overflow-hidden
    lg:inset-x-[5%]
    lg:top-[2%]
  "
  style={{
    maskImage:
      "radial-gradient(ellipse 105% 100% at 50% 45%, black 78%, rgba(0,0,0,0.92) 90%, transparent 100%)",
    WebkitMaskImage:
      "radial-gradient(ellipse 105% 100% at 50% 45%, black 78%, rgba(0,0,0,0.92) 90%, transparent 100%)",
  }}
>
  <img
    src="/bodywise-athlete.png"
    alt="BodyWise fitness athlete"
    className="
      h-full
      w-full
      object-cover
      object-[62%_42%]
      sm:object-[52%_10%]
      lg:object-[55%_center]
    "
  />

  {/* Left background blend */}
  <div
    className="
      pointer-events-none
      absolute
      inset-y-0
      left-0
      w-[18%]
      bg-gradient-to-r
      from-surface-black/55
      to-transparent
      lg:w-[12%]
    "
  />

  {/* Bottom blend */}
  <div
    className="
      pointer-events-none
      absolute
      inset-x-0
      bottom-0
      h-[15%]
      bg-gradient-to-t
      from-surface-black
      via-surface-black/30
      to-transparent
    "
  />

  {/* Right blend */}
  <div
    className="
      pointer-events-none
      absolute
      inset-y-0
      right-0
      w-[12%]
      bg-gradient-to-l
      from-surface-black/45
      to-transparent
    "
  />
</div>

            {/* =================================================
                AI ACTIVE
            ================================================= */}

            <div
              className="
                absolute
                right-[2%]
                top-[1%]
                z-40
                rounded-2xl
                border
                border-white/[0.10]
                bg-[#111111]/90
                px-4
                py-3
                shadow-2xl
                backdrop-blur-xl
                sm:right-[4%]
                lg:right-[3%]
              "
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-red" />

                <span className="text-xs font-bold tracking-wide text-brand-red">
                  AI ACTIVE
                </span>
              </div>
            </div>

            {/* =================================================
                WORKOUT PLAN
            ================================================= */}

            <div
              className="
                absolute
                left-[0%]
                top-[13%]
                z-40
                w-[235px]
                sm:left-[2%]
                sm:w-[255px]
                lg:left-[2%]
                lg:w-[270px]
              "
            >
              <FloatingCard
                icon={Dumbbell}
                title="Workout Plan"
                subtitle="Personalized for you"
              />
            </div>

            {/* =================================================
                NUTRITION PLAN
            ================================================= */}

            <div
              className="
                absolute
                right-[1%]
                top-[28%]
                z-40
                w-[250px]
                sm:right-[3%]
                sm:w-[280px]
                lg:right-[2%]
                lg:w-[300px]
              "
            >
              <FloatingCard
                icon={UtensilsCrossed}
                title="Nutrition Plan"
                subtitle="Meals tailored to your goals"
              />
            </div>

            {/* =================================================
                PROGRESS TRACKING
            ================================================= */}

            <div
              className="
                absolute
                right-[0%]
                top-[43%]
                z-40
                w-[250px]
                sm:right-[1%]
                sm:w-[275px]
                lg:right-[1%]
                lg:w-[270px]
              "
            >
              <FloatingCard
                icon={TrendingUp}
                title="Progress Tracking"
                subtitle="See your transformation"
              />
            </div>

            {/* =================================================
                AI COACH
            ================================================= */}

            <div
              className="
                absolute
                right-[8%]
                top-[59%]
                z-40
                w-[255px]
                sm:right-[12%]
                sm:top-[58%]
                sm:w-[250px]
                lg:right-[22%]
                lg:top-[57%]
                lg:w-[270px]
              "
            >
              <FloatingCard
                icon={Brain}
                title="AI Coach"
                subtitle="Always here to guide you"
              />
            </div>

            {/* =================================================
                PROGRESS CARD
            ================================================= */}

            <div
             className="
             absolute
             right-[6%]
             bottom-[3%]
             z-30
             rotate-[6deg]
             sm:right-[8%]
             lg:right-[10%]
             lg:bottom-[4%]
           "
          >
           <ProgressCard />
       </div>

            {/* =================================================
                NUTRITION PHONE
            ================================================= */}

            <NutritionPhone />

          </div>
        </div>

        {/* =====================================================
            BOTTOM FEATURE CARDS
        ===================================================== */}

        <div
          className="
            relative
            z-40
            mt-14 sm:mt-4
            grid
            grid-cols-1
            gap-2x
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
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
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-50
          h-24
          bg-gradient-to-t
          from-surface-black
          to-transparent
        "
      />

    </section>
  );
}