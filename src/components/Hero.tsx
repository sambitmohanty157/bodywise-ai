import { ArrowRight, Play, Activity, Brain, Target, TrendingUp, Sparkles, ChevronDown } from 'lucide-react';

interface HeroProps {
  onSignUp: () => void;
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] bg-brand-red/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.2 + Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, unit, color, delay }: {
  icon: React.ElementType; label: string; value: string; unit: string; color: string; delay: string;
}) {
  return (
    <div
      className="glass-card rounded-xl p-3.5 animate-float min-w-[140px]"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-surface-gray-500">{label}</p>
          <p className="text-sm font-bold">
            {value} <span className="text-[10px] text-surface-gray-500">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ onSignUp }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Base layers */}
      <div className="absolute inset-0 bg-surface-black" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <ParticleField />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-red/6 rounded-full blur-[200px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-red/4 rounded-full blur-[180px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/3 rounded-full blur-[250px]" />

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(229,57,53,0.5) 2px, rgba(229,57,53,0.5) 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Floating metric cards - desktop only */}
      <div className="absolute top-28 right-[8%] hidden lg:block">
        <MetricCard icon={Activity} label="Heart Rate" value="72" unit="bpm" color="#E53935" delay="0s" />
      </div>
      <div className="absolute top-28 right-[24%] hidden lg:block">
        <MetricCard icon={TrendingUp} label="Muscle Gain" value="+12%" unit="month" color="#22C55E" delay="1.5s" />
      </div>
      <div className="absolute bottom-36 right-[12%] hidden lg:block">
        <MetricCard icon={Brain} label="AI Score" value="98%" unit="optimal" color="#E53935" delay="3s" />
      </div>
      <div className="absolute bottom-36 right-[30%] hidden lg:block">
        <MetricCard icon={Target} label="Calories" value="2,450" unit="kcal" color="#3B82F6" delay="2s" />
      </div>

      {/* Athlete imagery - right side */}
      <div className="absolute right-0 top-0 h-full w-full lg:w-[50%] hidden lg:flex items-center justify-center">
        <div className="relative">
          {/* Concentric rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[480px] h-[480px] rounded-full border border-brand-red/10 animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[380px] h-[380px] rounded-full border border-brand-red/15 border-dashed animate-[spin_40s_linear_infinite_reverse]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[280px] h-[280px] rounded-full border border-brand-red/20" />
          </div>

          {/* Center image */}
          <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden border-2 border-brand-red/30 red-glow">
            <img
              src="https://images.pexels.com/photos/1954554/pexels-photo-1954554.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Athletic fitness model"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-black/40 to-transparent" />
          </div>

          {/* Secondary image - female athlete */}
          <div className="absolute -bottom-8 -left-20 w-[140px] h-[140px] rounded-2xl overflow-hidden border border-brand-red/20 glass-card">
            <img
              src="https://images.pexels.com/photos/4058394/pexels-photo-4058394.jpeg?auto=compress&cs=tinysrgb&w=300"
              alt="Female athlete"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-black/50 to-transparent" />
          </div>

          {/* AI data overlay */}
          <div className="absolute -top-6 -right-16 glass-card rounded-lg px-3 py-2 animate-float" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-brand-red" />
              <span className="text-[10px] font-semibold text-brand-red">AI ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 section-container pt-28 pb-20">
        <div className="max-w-2xl lg:max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/25 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">AI-Powered Fitness Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-black leading-[1.08] tracking-tight mb-6 animate-fade-in-up">
            Transform Your Body
            <br />
            with{' '}
            <span className="relative inline-block">
              <span className="text-gradient">AI-Powered</span>
              <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-brand-red to-transparent rounded-full" />
            </span>
            {' '}Fitness
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-surface-gray-400 leading-relaxed mb-10 animate-fade-in-up animation-delay-200 max-w-lg">
            Personalized workouts, nutrition guidance, progress tracking, and intelligent fitness insights — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14 animate-fade-in-up animation-delay-400">
            <button
              onClick={onSignUp}
              className="btn-primary inline-flex items-center justify-center gap-2.5 text-base group"
            >
              Start Your Transformation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onSignUp}
              className="btn-secondary inline-flex items-center justify-center gap-2.5 text-base"
            >
              <Play className="w-4 h-4" />
              Try BodyWise AI Free
            </button>
          </div>

          {/* Feature highlights row */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in-up animation-delay-600">
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
              <div className="h-9 w-9 rounded-lg bg-brand-red/15 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-brand-red" />
              </div>
              <p className="text-sm font-semibold leading-tight">AI-Powered<br /><span className="text-surface-gray-400 font-medium">Workout Plans</span></p>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
              <div className="h-9 w-9 rounded-lg bg-brand-red/15 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-brand-red" />
              </div>
              <p className="text-sm font-semibold leading-tight">Smart Progress<br /><span className="text-surface-gray-400 font-medium">Tracking</span></p>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
              <div className="h-9 w-9 rounded-lg bg-brand-red/15 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-brand-red" />
              </div>
              <p className="text-sm font-semibold leading-tight">Personalized<br /><span className="text-surface-gray-400 font-medium">Nutrition Guidance</span></p>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
              <div className="h-9 w-9 rounded-lg bg-brand-red/15 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-brand-red" />
              </div>
              <p className="text-sm font-semibold leading-tight">Goal-Based<br /><span className="text-surface-gray-400 font-medium">Fitness Coaching</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface-black via-surface-black/80 to-transparent" />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center gap-2">
        <span className="text-[10px] text-surface-gray-500 uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 text-surface-gray-500" />
      </div>
    </section>
  );
}
