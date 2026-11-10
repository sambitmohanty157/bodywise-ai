
import { useInView } from '../hooks/useInView';
import {
  ArrowRight,
  Dumbbell,
  Utensils,
  HeartPulse,
  Activity,
  Sparkles,
  Zap,
} from 'lucide-react';

const lifestyleCards = [
  {
    number: '01',
    title: 'Fuel Your Body',
    category: 'SMART NUTRITION',
    description:
      'Make smarter food choices and support your fitness goals with personalized nutrition guidance.',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=85',
    icon: Utensils,
  },
  {
    number: '02',
    title: 'Stay Active',
    category: 'ACTIVE LIFESTYLE',
    description:
      'Build consistency through movement, cardio and healthy daily habits.',
    image:
      'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&q=85',
    icon: Activity,
  },
  {
    number: '03',
    title: 'Recover Better',
    category: 'REST & RECOVERY',
    description:
      'Give your body the recovery it needs to support sustainable fitness progress.',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=85',
    icon: HeartPulse,
  },
  {
    number: '04',
    title: 'Get Stronger',
    category: 'STRENGTH TRAINING',
    description:
      'Train with purpose, follow structured workouts and work towards your strength goals.',
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85',
    icon: Dumbbell,
  },
];

export default function Transformations() {
  const { ref, isInView } = useInView(0.05);

  return (
    <section
      id="transformations"
      className="relative py-24 sm:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-surface-black" />
      <div className="absolute inset-0 bg-grid opacity-15" />

      <div className="absolute top-1/4 -left-40 w-[450px] h-[450px] bg-brand-red/10 rounded-full blur-[180px]" />

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-brand-red/5 rounded-full blur-[180px]" />

      <div
        ref={ref}
        className="section-container relative z-10"
      >

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">

          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-brand-red" />

            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">
              The BodyWise Lifestyle
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight mb-5">
            Train Hard.
            <span className="text-gradient"> Eat Smart.</span>
            <span className="block mt-2">
              Live Strong.
            </span>
          </h2>

          <p className="text-surface-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Fitness is more than just lifting weights.
            Build better habits, fuel your body and create
            a lifestyle that supports your goals.
          </p>

        </div>

        {/* Hero Image */}
        <div
          className={`relative max-w-6xl mx-auto mb-7 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] group ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >

          <div className="relative h-[300px] sm:h-[420px] lg:h-[500px] overflow-hidden">

            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=90"
              alt="Strength training in a modern gym"
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-6 sm:p-10 lg:p-16">

              <div className="max-w-xl">

                <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/30 rounded-full px-3 py-1.5 mb-5">
                  <Zap className="w-3.5 h-3.5 text-brand-red" />

                  <span className="text-[10px] sm:text-xs font-bold tracking-wider text-white">
                    YOUR FITNESS. YOUR JOURNEY.
                  </span>
                </div>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                  Build The Body.
                  <span className="block text-brand-red">
                    Build The Lifestyle.
                  </span>
                </h3>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-md">
                  Bring together intelligent workouts,
                  personalized nutrition and healthier
                  everyday habits with BodyWise AI.
                </p>

                <a
                  href="#pricing"
                  className="btn-primary inline-flex items-center gap-2 mt-7 group/button"
                >
                  Start Your Journey

                  <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* Lifestyle Cards Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7 mt-14">

          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-brand-red mb-2">
              THE FOUR PILLARS
            </p>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Make Fitness Your Lifestyle.
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-surface-gray-500 max-w-xs leading-relaxed">
            Every part of your lifestyle plays a role
            in your fitness journey.
          </p>

        </div>

        {/* Lifestyle Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {lifestyleCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={card.number}
                className={`group relative min-h-[370px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-white/[0.06] bg-surface-gray-900 transition-all duration-500 hover:-translate-y-2 hover:border-brand-red/40 ${
                  isInView
                    ? 'animate-fade-in-up'
                    : 'opacity-0'
                }`}
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >

                {/* Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/5" />

                {/* Top Number */}
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="text-xs font-black text-white bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2">
                    {card.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-brand-red/20 border border-brand-red/30 backdrop-blur-md flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">

                  <p className="text-[10px] font-bold tracking-[0.16em] text-brand-red mb-3">
                    {card.category}
                  </p>

                  <h4 className="text-xl sm:text-2xl font-black text-white mb-3">
                    {card.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {card.description}
                  </p>

                  <div className="w-10 h-0.5 bg-brand-red mt-5 group-hover:w-full transition-all duration-500" />

                </div>

              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="relative mt-16 sm:mt-20 rounded-2xl border border-brand-red/20 bg-gradient-to-r from-brand-red/15 via-[#171111] to-[#151515] p-7 sm:p-10 overflow-hidden">

          <div className="absolute -right-10 -top-20 w-64 h-64 rounded-full bg-brand-red/10 blur-[90px]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">

            <div className="text-center lg:text-left">

              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-brand-red" />

                <span className="text-xs font-bold tracking-widest text-brand-red uppercase">
                  Your Next Chapter Starts Here
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Ready to Level Up?
              </h3>

              <p className="text-sm text-surface-gray-400">
                Let BodyWise AI help you build a smarter fitness routine.
              </p>

            </div>

            <a
              href="#pricing"
              className="btn-primary inline-flex items-center gap-2 shrink-0"
            >
              Explore Our Plans
              <ArrowRight className="w-4 h-4" />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}
