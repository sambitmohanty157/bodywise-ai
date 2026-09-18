import { useInView } from '../hooks/useInView';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Morgan',
    role: 'Lost 12 kg in 14 weeks',
    avatar: 'https://images.pexels.com/photos/220449/pexels-photo-220449.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'BodyWise AI gave me a personalized plan that actually worked. The AI adapts to your progress — it feels like having a trainer who knows exactly what you need every single day.',
  },
  {
    name: 'Priya Sharma',
    role: 'Gained 4 kg muscle in 10 weeks',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'The nutrition planner is incredible. It calculated my exact macros and created meal plans I actually enjoy. My energy levels have never been higher and the results speak for themselves.',
  },
  {
    name: 'James Wilson',
    role: 'Lost 20 kg in 24 weeks',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "I tried every fitness app out there. BodyWise AI is the only one that kept me consistent. The progress dashboard is addictive in the best way possible — you'll want to check it daily.",
  },
  {
    name: 'Emma Chen',
    role: 'Marathon ready in 16 weeks',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'From couch to marathon — seriously. The AI adjusted my training plan every week based on my recovery and performance data. Mind-blowing technology that delivers real results.',
  },
  {
    name: 'Carlos Rivera',
    role: 'Lost 15 kg, gained 6 kg muscle',
    avatar: 'https://images.pexels.com/photos/694507/pexels-photo-694507.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'The body recomposition results speak for themselves. BodyWise AI understood my dual goals and created a plan that delivered both fat loss and muscle gain simultaneously.',
  },
  {
    name: 'Mia Thompson',
    role: 'Yoga + strength hybrid athlete',
    avatar: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "I love how the AI respects my yoga practice while pushing my strength training forward. It created a hybrid plan that enhanced both disciplines — something no human trainer ever did.",
  },
];

export default function Testimonials() {
  const { ref, isInView } = useInView(0.05);

  return (
    <section id="testimonials" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-surface-black" />
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/3 rounded-full blur-[180px]" />

      <div ref={ref} className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <Quote className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
            Loved by{' '}
            <span className="text-gradient">50,000+</span>{' '}
            Athletes
          </h2>
          <p className="text-surface-gray-400 text-lg leading-relaxed">
            Join thousands who've already transformed their bodies and lives with BodyWise AI.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`group rounded-2xl p-6 bg-surface-gray-900/60 border border-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/20 ${
                isInView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`w-4 h-4 ${si < t.rating ? 'text-brand-red fill-brand-red' : 'text-surface-gray-700'}`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-surface-gray-300 leading-relaxed mb-6">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-surface-gray-700 group-hover:ring-brand-red/30 transition-all"
                />
                <div>
                  <p className="text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-brand-red font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
