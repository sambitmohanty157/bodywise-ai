import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { Trophy, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const transformations = [
  {
    name: 'Marcus J.',
    before: 'https://images.pexels.com/photos/17840/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    after: 'https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '12 weeks',
    weightLost: '-14 kg',
    muscleGained: '+4.2 kg',
    bodyFat: '-8%',
    quote: 'BodyWise AI completely transformed my approach to fitness. The AI-adjusted workouts kept me progressing every single week.',
  },
  {
    name: 'Sarah K.',
    before: 'https://images.pexels.com/photos/38389/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',
    after: 'https://images.pexels.com/photos/4058394/pexels-photo-4058394.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '16 weeks',
    weightLost: '-11 kg',
    muscleGained: '+3.5 kg',
    bodyFat: '-6.2%',
    quote: 'The nutrition planner was a game-changer. I finally understood how to fuel my body for real, lasting results.',
  },
  {
    name: 'David R.',
    before: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400',
    after: 'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '20 weeks',
    weightLost: '-18 kg',
    muscleGained: '+5.8 kg',
    bodyFat: '-10%',
    quote: 'From 112 kg to 94 kg. The progress dashboard kept me motivated when I wanted to give up. Best investment ever.',
  },
];

export default function Transformations() {
  const { ref, isInView } = useInView(0.05);
  const [active, setActive] = useState(0);

  const t = transformations[active];

  return (
    <section id="transformations" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-surface-black" />
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-brand-red/3 rounded-full blur-[180px]" />

      <div ref={ref} className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <Trophy className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">Real Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
            Stunning{' '}
            <span className="text-gradient">Transformations</span>
          </h2>
          <p className="text-surface-gray-400 text-lg leading-relaxed">
            Real people, real results. See what dedication and AI-powered coaching can achieve.
          </p>
        </div>

        {/* Featured Card */}
        <div
          className={`max-w-5xl mx-auto ${
            isInView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <div className="rounded-3xl bg-surface-gray-900/60 border border-white/[0.05] backdrop-blur-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Images */}
              <div className="grid grid-cols-2">
                <div className="relative aspect-square lg:aspect-auto lg:min-h-[420px] overflow-hidden">
                  <img src={t.before} alt="Before" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-xs font-bold uppercase tracking-wider text-surface-gray-300">Before</span>
                  </div>
                </div>
                <div className="relative aspect-square lg:aspect-auto lg:min-h-[420px] overflow-hidden">
                  <img src={t.after} alt="After" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-brand-red/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">After</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <h3 className="text-2xl font-extrabold mb-2">{t.name}</h3>
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-4 h-4 text-brand-red" />
                  <span className="text-sm text-surface-gray-400">{t.duration}</span>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-surface-gray-800/60 rounded-xl p-4 border border-white/[0.03]">
                    <p className="text-lg font-extrabold text-green-400">{t.weightLost}</p>
                    <p className="text-[10px] text-surface-gray-500 uppercase tracking-wider mt-1">Weight Lost</p>
                  </div>
                  <div className="bg-surface-gray-800/60 rounded-xl p-4 border border-white/[0.03]">
                    <p className="text-lg font-extrabold text-blue-400">{t.muscleGained}</p>
                    <p className="text-[10px] text-surface-gray-500 uppercase tracking-wider mt-1">Muscle Gained</p>
                  </div>
                  <div className="bg-surface-gray-800/60 rounded-xl p-4 border border-white/[0.03]">
                    <p className="text-lg font-extrabold text-brand-red">{t.bodyFat}</p>
                    <p className="text-[10px] text-surface-gray-500 uppercase tracking-wider mt-1">Body Fat</p>
                  </div>
                </div>

                <blockquote className="text-sm text-surface-gray-400 leading-relaxed italic border-l-2 border-brand-red/30 pl-4">
                  "{t.quote}"
                </blockquote>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setActive((prev) => (prev - 1 + transformations.length) % transformations.length)}
              className="w-10 h-10 rounded-full bg-surface-gray-800 border border-white/[0.05] flex items-center justify-center hover:border-brand-red/40 hover:bg-surface-gray-700 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {transformations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === active ? 'bg-brand-red w-8' : 'bg-surface-gray-600 hover:bg-surface-gray-500'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setActive((prev) => (prev + 1) % transformations.length)}
              className="w-10 h-10 rounded-full bg-surface-gray-800 border border-white/[0.05] flex items-center justify-center hover:border-brand-red/40 hover:bg-surface-gray-700 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
