import { useInView } from '../hooks/useInView';
import {
  Activity, Scale, Target, Flame, Zap, TrendingDown,
  Calendar, BarChart3, ArrowRight, Sparkles, Info
} from 'lucide-react';

interface DashboardProps {
  onSignUp: () => void;
}

/* ---- Stat Widget ---- */
function StatWidget({ icon: Icon, label, value, sub, color, bg }: {
  icon: typeof Scale; label: string; value: string; sub?: string; color: string; bg: string;
}) {
  return (
    <div className="glass-card-hover rounded-xl p-4 group cursor-default">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-[10px] text-surface-gray-500 uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <p className="text-2xl font-black tracking-tight">{value}</p>
      {sub && <p className="text-[11px] text-surface-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

/* ---- Weight Progress Chart ---- */
function WeightChart() {
  const weeks = [
    { label: 'W1', weight: 90 },
    { label: 'W2', weight: 88 },
    { label: 'W3', weight: 86 },
    { label: 'W4', weight: 84 },
  ];

  const minW = 80;
  const maxW = 92;
  const range = maxW - minW;
  const chartW = 320;
  const chartH = 120;
  const padX = 32;
  const padY = 12;

  const points = weeks.map((w, i) => ({
    x: padX + (i / (weeks.length - 1)) * (chartW - padX * 2),
    y: padY + (1 - (w.weight - minW) / range) * (chartH - padY * 2),
  }));

  const lineStr = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaStr = `${padX},${chartH - padY} ${lineStr} ${chartW - padX},${chartH - padY}`;

  const goalY = padY + (1 - (78 - minW) / range) * (chartH - padY * 2);

  return (
    <div className="glass-card-hover rounded-xl p-5 group cursor-default">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-green-400" />
          <h4 className="text-sm font-bold text-white">Weight Progress</h4>
        </div>
        <span className="text-xs font-medium text-green-400 flex items-center gap-1">
          <TrendingDown className="w-3 h-3" /> -6 kg
        </span>
      </div>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="weight-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Goal line */}
        <line x1={padX} y1={goalY} x2={chartW - padX} y2={goalY}
          stroke="#E53935" strokeOpacity="0.4" strokeDasharray="6 4" strokeWidth="1" />
        <text x={chartW - padX + 4} y={goalY + 3} fill="#E53935" fontSize="8" opacity="0.6">Goal</text>
        {/* Area fill */}
        <polygon points={areaStr} fill="url(#weight-area-grad)" />
        {/* Line */}
        <polyline points={lineStr} fill="none" stroke="#22C55E" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#1A1A1A" stroke="#22C55E" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#9A9A9A" fontSize="8" fontWeight="600">
              {weeks[i].weight}
            </text>
          </g>
        ))}
        {/* End pulse */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6"
          fill="#22C55E" opacity="0.3">
          <animate attributeName="r" values="4;10;4" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
        {/* Week labels */}
        {weeks.map((w, i) => (
          <text key={i} x={points[i].x} y={chartH - 2} textAnchor="middle" fill="#6B6B6B" fontSize="8">
            {w.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ---- Goal Progress Ring ---- */
function GoalProgress() {
  const pct = 40;
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="glass-card-hover rounded-xl p-5 flex flex-col items-center justify-center group cursor-default">
      <svg width="110" height="110" viewBox="0 0 110 110" className="mb-2">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#242424" strokeWidth="8" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#E53935" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 55 55)"
          className="transition-all duration-1000" />
        <text x="55" y="50" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="22" fontWeight="900">
          {pct}%
        </text>
        <text x="55" y="68" textAnchor="middle" fill="#6B6B6B" fontSize="8" fontWeight="600">
          COMPLETE
        </text>
      </svg>
      <span className="text-xs text-surface-gray-400 font-semibold flex items-center gap-1.5">
        <Target className="w-3.5 h-3.5 text-brand-red" /> Goal Progress
      </span>
    </div>
  );
}

/* ---- Workout Streak ---- */
function WorkoutStreak() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completed = [true, true, true, true, true, false, false];

  return (
    <div className="glass-card-hover rounded-xl p-5 group cursor-default">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-red" />
          <h4 className="text-sm font-bold text-white">Workout Streak</h4>
        </div>
        <span className="text-xs font-semibold text-brand-red">5 Days</span>
      </div>
      <div className="flex gap-2">
        {days.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
              completed[i]
                ? 'bg-brand-red/20 text-brand-red border border-brand-red/30 group-hover:border-brand-red/50'
                : 'bg-surface-gray-800 text-surface-gray-600 border border-surface-gray-700'
            }`}>
              {completed[i] ? '\u2713' : d.charAt(0)}
            </div>
            <span className="text-[9px] text-surface-gray-500">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Fitness Insights ---- */
function FitnessInsights() {
  return (
    <div className="glass-card-hover rounded-xl p-5 group cursor-default md:col-span-2 lg:col-span-1">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-brand-red/10 rounded-lg flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-brand-red" />
        </div>
        <h4 className="text-sm font-bold text-white">AI Fitness Insights</h4>
      </div>
      <div className="bg-surface-gray-800/40 rounded-lg p-4 border border-white/[0.03]">
        <p className="text-sm text-surface-gray-300 leading-relaxed">
          You are on track to reach your goal weight in approximately{' '}
          <span className="text-brand-red font-bold">8 weeks</span>{' '}
          if current progress continues.
        </p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
          <Info className="w-3.5 h-3.5 text-surface-gray-500" />
          <span className="text-[10px] text-surface-gray-500">Based on your current weight trend and activity level</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Main Section ---- */
export default function Dashboard({ onSignUp }: DashboardProps) {
  const { ref, isInView } = useInView(0.05);

  return (
    <section id="dashboard" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-surface-gray-950" />
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/3 rounded-full blur-[180px]" />

      <div ref={ref} className="section-container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 rounded-full px-4 py-2 mb-6">
            <Activity className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-semibold tracking-wide text-brand-red uppercase">Dashboard Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5">
            Your Fitness{' '}
            <span className="text-gradient">Command Center</span>
          </h2>
          <p className="text-surface-gray-400 text-lg leading-relaxed">
            See how BodyWise AI helps you track your fitness transformation with intelligent analytics and progress insights.
          </p>
        </div>

        {/* Dashboard Panel */}
        <div className={`rounded-3xl p-5 sm:p-8 bg-surface-gray-900/70 border border-white/[0.05] backdrop-blur-md shadow-2xl shadow-black/40 ${
          isInView ? 'animate-scale-in' : 'opacity-0'
        }`}>

          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">BodyWise AI Dashboard</p>
                <p className="text-[10px] text-surface-gray-500">Last synced: 2 min ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 bg-surface-gray-800/60 border border-white/[0.06] rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                <span className="text-[10px] text-surface-gray-400 font-medium">Demo Preview</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] text-surface-gray-500">Live</span>
              </div>
            </div>
          </div>

          {/* Stat Widgets */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <StatWidget
              icon={Scale} label="Current Weight" value="86 kg"
              sub="Updated today" color="#22C55E" bg="bg-green-500/10"
            />
            <StatWidget
              icon={Target} label="Goal Weight" value="78 kg"
              sub="Target goal" color="#E53935" bg="bg-brand-red/10"
            />
            <StatWidget
              icon={Activity} label="BMI Status" value="25.1"
              sub="Overweight" color="#F97316" bg="bg-orange-500/10"
            />
            <StatWidget
              icon={Flame} label="Daily Calorie Target" value="2,762 kcal"
              sub="Adjusted weekly" color="#F97316" bg="bg-orange-500/10"
            />
            <StatWidget
              icon={Zap} label="Workout Streak" value="5 Days"
              sub="Keep it up!" color="#E53935" bg="bg-brand-red/10"
            />
            <GoalProgress />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <WeightChart />
            </div>
            <WorkoutStreak />
          </div>

          {/* Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <FitnessInsights />
            <div className="glass-card-hover rounded-xl p-5 group cursor-default lg:col-span-2 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-brand-red" />
              </div>
              <h4 className="text-lg font-bold mb-2">Ready to start your transformation?</h4>
              <p className="text-sm text-surface-gray-400 mb-5 max-w-md">
                Create your free account and get instant access to personalized fitness analytics, AI insights, and progress tracking.
              </p>
              <button
                onClick={onSignUp}
                className="btn-primary text-sm flex items-center gap-2 group/btn"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
