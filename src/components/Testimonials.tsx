
import { useInView } from '../hooks/useInView';
import {
  Dumbbell,
  Utensils,
  Brain,
  TrendingUp,
  Library,
  RefreshCw,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: Dumbbell,
    title: 'Personalized Workout Plans',
    description:
      'Get workout routines designed around your fitness goals, training experience, activity level and available equipment.',
    tag: 'SMART TRAINING',
  },
  {
    icon: Utensils,
    title: 'Smart Nutrition Planning',
    description:
      'Get personalized meal guidance with calorie and protein targets based on your goals and dietary preferences.',
    tag: 'BETTER NUTRITION',
  },
  {
    icon: Brain,
    title: 'AI Fitness Coach',
    description:
      'Get AI-powered fitness guidance to help you understand your plan, make informed adjustments and stay consistent.',
    tag: 'AI ASSISTANCE',
  },
  {
    icon: TrendingUp,
    title: 'Fitness Progress Tracking',
    description:
      'Monitor your weight, workout history and fitness progress to understand how your journey is developing.',
    tag: 'TRACK PROGRESS',
  },
  {
    icon: Library,
    title: 'Exercise Library',
    description:
      'Explore exercise demonstrations and structured workout routines to support your training sessions.',
    tag: 'TRAIN SMARTER',
  },
  {
    icon: RefreshCw,
    title: 'Adaptive Fitness Plans',
    description:
      'Update your workout and nutrition plans as your goals, preferences and progress change.',
    tag: 'STAY ADAPTIVE',
  },
];

export default function Testimonials() {
  const { ref, isInView } = useInView(0.05);

  return (
    <section
      id="testimonials"
      className="relative py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-surface-black" />
      <div className="absolute inset-0 bg-grid opacity-15" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/3 rounded-full blur-[180px]" />

      <div
        ref={ref}
        className="section-container relative z-10"
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">

          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-brand-red" />

            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">
              Why Choose BodyWise AI?
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
            Everything You Need for{' '}
            <span className="text-gradient">
              Your Fitness Journey
            </span>
          </h2>

          <p className="text-surface-gray-400 text-lg leading-relaxed">
            Train smarter, make better nutrition choices and
            track your progress with AI-powered fitness tools
            designed around your goals.
          </p>

        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`group relative rounded-2xl p-7 bg-surface-gray-900/60 border border-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/30 hover:bg-surface-gray-900 ${
                  isInView
                    ? 'animate-fade-in-up'
                    : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              >

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center mb-6 group-hover:bg-brand-red/20 group-hover:border-brand-red/40 transition-all duration-300">

                  <Icon className="w-7 h-7 text-brand-red group-hover:scale-110 transition-transform duration-300" />

                </div>

                {/* Feature Tag */}
                <div className="flex items-center gap-2 mb-3">

                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-red" />

                  <span className="text-[10px] font-bold tracking-[0.15em] text-brand-red uppercase">
                    {feature.tag}
                  </span>

                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 group-hover:text-brand-red transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-surface-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-brand-red/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">

          <p className="text-surface-gray-400 text-sm mb-5">
            Your goals. Your plan. Your fitness journey.
          </p>

          <a
            href="#pricing"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            Explore Our Plans
            <Sparkles className="w-4 h-4" />
          </a>

        </div>

      </div>
    </section>
  );
}
