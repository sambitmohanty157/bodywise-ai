import { useState } from 'react';
import { Calculator, Ruler, Weight, ArrowRight } from 'lucide-react';
import { useInView } from '../hooks/useInView';

interface BMIResult {
  value: number;
  category: string;
  color: string;
  barPosition: number;
}

function getBMIResult(bmi: number): BMIResult {
  if (bmi < 18.5) return { value: bmi, category: 'Underweight', color: '#3B82F6', barPosition: Math.max(0, (bmi / 40) * 100) };
  if (bmi < 25) return { value: bmi, category: 'Normal Weight', color: '#22C55E', barPosition: Math.max(0, (bmi / 40) * 100) };
  if (bmi < 30) return { value: bmi, category: 'Overweight', color: '#F97316', barPosition: Math.max(0, (bmi / 40) * 100) };
  return { value: bmi, category: 'Obese', color: '#EF4444', barPosition: Math.min(100, (bmi / 40) * 100) };
}

const categoryRanges = [
  { label: 'Underweight', range: '< 18.5', color: '#3B82F6' },
  { label: 'Normal', range: '18.5 - 24.9', color: '#22C55E' },
  { label: 'Overweight', range: '25 - 29.9', color: '#F97316' },
  { label: 'Obese', range: '30+', color: '#EF4444' },
];

export default function BMICalculator() {
  const { ref, isInView } = useInView(0.1);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    setResult(null);

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || h <= 0 || h > 300) {
      setError('Enter a valid height between 1 and 300 cm.');
      return;
    }
    if (!w || w <= 0 || w > 500) {
      setError('Enter a valid weight between 1 and 500 kg.');
      return;
    }

    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    setResult(getBMIResult(Math.round(bmi * 10) / 10));
  }

  return (
    <section id="bmi" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-surface-black" />
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-red/3 rounded-full blur-[200px]" />

      <div ref={ref} className={`section-container relative z-10 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <Calculator className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">Free Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
            BMI <span className="text-gradient">Calculator</span>
          </h2>
          <p className="text-surface-gray-400 text-lg leading-relaxed">
            Instantly calculate your Body Mass Index and understand where you stand on the health spectrum.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-2xl overflow-hidden">
            {/* Top accent line */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-brand-red to-transparent" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Input side */}
              <div className="p-8 lg:p-10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-brand-red" />
                  Enter Your Measurements
                </h3>

                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">
                      Height (cm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-surface-gray-800/60 border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder-surface-gray-600 focus:outline-none focus:border-brand-red/50 transition-colors backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="e.g. 175"
                        min="1"
                        max="300"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-surface-gray-600 font-medium">cm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-surface-gray-400 uppercase tracking-wider mb-2">
                      Weight (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-surface-gray-800/60 border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder-surface-gray-600 focus:outline-none focus:border-brand-red/50 transition-colors backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="e.g. 70"
                        min="1"
                        max="500"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-surface-gray-600 font-medium">kg</span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-brand-red">{error}</p>
                  )}

                  <button
                    onClick={handleCalculate}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-base mt-1"
                  >
                    <Weight className="w-4 h-4" />
                    Calculate BMI
                  </button>
                </div>
              </div>

              {/* Result side */}
              <div className="p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-white/[0.04] flex flex-col justify-center">
                {result ? (
                  <div className="animate-fade-in">
                    {/* BMI Value */}
                    <div className="text-center mb-8">
                      <p className="text-xs font-semibold text-surface-gray-500 uppercase tracking-widest mb-2">Your BMI</p>
                      <p className="text-6xl font-black" style={{ color: result.color }}>
                        {result.value}
                      </p>
                      <p className="text-lg font-bold mt-2" style={{ color: result.color }}>
                        {result.category}
                      </p>
                    </div>

                    {/* BMI Scale Bar */}
                    <div className="mb-8">
                      <div className="relative h-3 rounded-full overflow-hidden flex">
                        <div className="flex-1" style={{ background: '#3B82F6' }} />
                        <div className="flex-[1.73]" style={{ background: '#22C55E' }} />
                        <div className="flex-[1.25]" style={{ background: '#F97316' }} />
                        <div className="flex-1" style={{ background: '#EF4444' }} />
                      </div>
                      {/* Marker */}
                      <div
                        className="absolute top-0 w-1.5 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)] -translate-x-1/2 transition-all duration-500"
                        style={{ left: `${result.barPosition}%` }}
                      />
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-surface-gray-500">0</span>
                        <span className="text-[10px] text-surface-gray-500">18.5</span>
                        <span className="text-[10px] text-surface-gray-500">25</span>
                        <span className="text-[10px] text-surface-gray-500">30</span>
                        <span className="text-[10px] text-surface-gray-500">40</span>
                      </div>
                    </div>

                    {/* Category Legend */}
                    <div className="grid grid-cols-2 gap-2">
                      {categoryRanges.map((cat) => (
                        <div
                          key={cat.label}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                            result.category === cat.label
                              ? 'bg-white/[0.04] border-white/[0.1]'
                              : 'border-transparent'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <div>
                            <p className={`text-xs font-semibold ${result.category === cat.label ? 'text-white' : 'text-surface-gray-500'}`}>
                              {cat.label}
                            </p>
                            <p className="text-[10px] text-surface-gray-600">{cat.range}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-6 pt-6 border-t border-white/[0.04] text-center">
                      <p className="text-sm text-surface-gray-400 mb-3">Get a personalized plan for your BMI range</p>
                      <a href="#pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover transition-colors group">
                        Explore BodyWise AI Plans
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-2xl bg-surface-gray-800/60 border border-white/[0.06] flex items-center justify-center mx-auto mb-5">
                      <Calculator className="w-8 h-8 text-surface-gray-600" />
                    </div>
                    <p className="text-surface-gray-500 text-sm leading-relaxed">
                      Enter your height and weight, then hit <span className="text-white font-semibold">Calculate BMI</span> to see your results.
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
