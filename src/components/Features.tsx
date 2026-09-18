import {
  BrainCircuit,
  Utensils,
  BarChart3,
  Ruler,
  Flame,
  LineChart,
  Target,
  Dumbbell,
} from 'lucide-react';
import { useInView } from '../hooks/useInView';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Workout Generator',
    desc: 'Custom workout plans created by AI that adapt to your fitness level, goals, and available equipment in real time.',
    accent: '#E53935',
  },
  {
    icon: Utensils,
    title: 'Smart Nutrition Planner',
    desc: 'AI-curated meal plans with precise macro breakdowns tailored to your dietary preferences and body composition goals.',
    accent: '#F97316',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking Dashboard',
    desc: 'Comprehensive visual dashboards showing every metric of your fitness journey in real time with trend analysis.',
    accent: '#3B82F6',
  },
  {
    icon: Ruler,
    title: 'Body Measurements Tracker',
    desc: 'Track waist, arms, chest, thighs, and more with smart reminders, progress photos, and trend analysis.',
    accent: '#8B5CF6',
  },
  {
    icon: Flame,
    title: 'Calorie & Macro Calculator',
    desc: 'Intelligent calorie counting with macro splits optimized for cutting, bulking, or maintenance phases.',
    accent: '#EF4444',
  },
  {
    icon: LineChart,
    title: 'Fitness Analytics & Insights',
    desc: 'Deep analytics revealing patterns in your training, recovery, and nutrition for data-driven decisions.',
    accent: '#06B6D4',
  },
  {
    icon: Target,
    title: 'Goal-Based Training Plans',
    desc: 'Structured programs for weight loss, muscle gain, endurance, flexibility, and sport-specific performance.',
    accent: '#22C55E',
  },
  {
    icon: Dumbbell,
    title: 'Exercise Library',
    desc: 'HD video demonstrations and form guides for 1000+ exercises with AI-powered substitution suggestions.',
    accent: '#EAB308',
  },
];

export default function Features() {
  const { ref, isInView } = useInView(0.05);

  return (
    <section id="features" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-surface-black" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-red/3 rounded-full blur-[200px]" />

      <div ref={ref} className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <BrainCircuit className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
            Everything You Need
            <br />
            to <span className="text-gradient">Transform</span>
          </h2>
          <p className="text-surface-gray-400 text-lg leading-relaxed">
            Eight AI-powered tools designed to maximize every aspect of your fitness journey — from workouts to nutrition to recovery.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative rounded-2xl p-6 bg-surface-gray-900/60 border border-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-opacity-100 hover:-translate-y-1 ${
                isInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${i * 80}ms`,
                borderColor: `rgba(255,255,255,0.04)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${f.accent}40`;
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${f.accent}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `rgba(255,255,255,0.04)`;
                e.currentTarget.style.boxShadow = `none`;
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                style={{ backgroundColor: `${f.accent}12` }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${f.accent}22`; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${f.accent}12`; }}
              >
                <f.icon className="w-6 h-6" style={{ color: f.accent }} />
              </div>

              <h3 className="text-base font-bold mb-2 text-white group-hover:text-white transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-surface-gray-500 leading-relaxed">
                {f.desc}
              </p>

              {/* Corner accent on hover */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at top right, ${f.accent}15, transparent 70%)`,
                  borderRadius: '0 1rem 0 0',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
