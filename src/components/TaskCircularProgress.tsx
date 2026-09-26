import React, { useId } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Target, 
  BookOpen, 
  Plus, 
  Award,
  Zap
} from 'lucide-react';
import { Pillar, TaskItem } from '../types';

interface CircularProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  completedCount: number;
  totalCount: number;
  colorVariant?: 'dynamic' | 'emerald' | 'amber' | 'sky';
  showSubtext?: boolean;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  percentage,
  size = 136,
  strokeWidth = 11,
  completedCount,
  totalCount,
  colorVariant = 'dynamic',
  showSubtext = true
}) => {
  const rawId = useId();
  const gradId = `task-circle-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  // Dynamic gradient colors based on completion tier
  const getGradientColors = () => {
    if (colorVariant === 'emerald') {
      return { start: '#10b981', middle: '#34d399', end: '#059669' };
    }
    if (colorVariant === 'amber') {
      return { start: '#f59e0b', middle: '#fbbf24', end: '#d97706' };
    }
    if (colorVariant === 'sky') {
      return { start: '#0284c7', middle: '#38bdf8', end: '#0369a1' };
    }

    // Dynamic based on completion percentage
    if (clampedPercentage >= 100) {
      return { start: '#10b981', middle: '#34d399', end: '#fbbf24' }; // Emerald + Gold celebratory
    }
    if (clampedPercentage >= 75) {
      return { start: '#059669', middle: '#10b981', end: '#34d399' }; // Rich emerald
    }
    if (clampedPercentage >= 40) {
      return { start: '#d97706', middle: '#f59e0b', end: '#10b981' }; // Amber turning emerald
    }
    return { start: '#b45309', middle: '#f59e0b', end: '#fbbf24' }; // Warm amber
  };

  const colors = getGradientColors();
  const isComplete = clampedPercentage >= 100 && totalCount > 0;

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="50%" stopColor={colors.middle} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          {/* Subtle soft glow for completion track */}
          <filter id={`${gradId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer ambient subtle border */}
        <circle
          cx={center}
          cy={center}
          r={radius + strokeWidth / 2 + 1}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth="1"
        />

        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1c1917" // stone-900
          strokeWidth={strokeWidth}
        />
        
        {/* Subtle decorative tick marks at 25%, 50%, 75% */}
        {[0.25, 0.5, 0.75].map((pos) => {
          const angle = pos * 2 * Math.PI;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <circle
              key={pos}
              cx={x}
              cy={y}
              r={1.5}
              fill="rgba(120, 113, 108, 0.4)"
            />
          );
        })}

        {/* Ambient glow stroke behind the main stroke for depth */}
        {clampedPercentage > 0 && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth + 4}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            opacity="0.25"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s ease'
            }}
          />
        )}

        {/* Primary animated foreground progress bar */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s ease'
          }}
        />
      </svg>

      {/* Center Label Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1 pointer-events-none">
        {isComplete ? (
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <Award className="h-6 w-6 text-amber-300 drop-shadow-md animate-bounce" />
            <span className="font-mono-tabular text-xl font-bold text-emerald-300 leading-tight mt-0.5">
              100%
            </span>
            {showSubtext && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400/90">
                All Done
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span className="font-mono-tabular text-2xl font-bold tracking-tight text-white leading-tight">
              {Math.round(clampedPercentage)}
              <span className="text-xs font-semibold text-stone-400 ml-0.5">%</span>
            </span>
            {showSubtext && (
              <span className="text-[10px] font-mono-tabular font-semibold text-stone-400 leading-none mt-1">
                {completedCount}/{totalCount} <span className="font-sans-body uppercase text-[9px] tracking-wider text-stone-500">Tasks</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface TaskCircularProgressProps {
  tasks: TaskItem[];
  currentDate: string;
  onOpenNewTaskModal?: () => void;
}

export const TaskCircularProgress: React.FC<TaskCircularProgressProps> = ({
  tasks,
  currentDate,
  onOpenNewTaskModal
}) => {
  // Filter for today's active tasks
  const todayTasks = tasks.filter((t) => t.date === currentDate || t.repeatDaily);
  const totalCount = todayTasks.length;
  const completedTasks = todayTasks.filter((t) => t.completed);
  const completedCount = completedTasks.length;
  const remainingCount = totalCount - completedCount;

  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Estimate remaining focus minutes
  const remainingMinutes = todayTasks
    .filter((t) => !t.completed)
    .reduce((sum, t) => sum + (t.estimatedMinutes || 45), 0);

  const formatHoursMinutes = (mins: number) => {
    if (mins <= 0) return '0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  // Pillar breakdown
  const getPillarStats = (pillar: Pillar) => {
    const pillarTasks = todayTasks.filter((t) => t.pillar === pillar);
    const done = pillarTasks.filter((t) => t.completed).length;
    const total = pillarTasks.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  };

  const sadhanaStats = getPillarStats('sadhana');
  const gateStats = getPillarStats('gate');
  const collegeStats = getPillarStats('college');

  // Dynamic motivational status
  const getStatusDetails = () => {
    if (totalCount === 0) {
      return {
        badge: 'No Tasks Scheduled',
        badgeColor: 'bg-stone-800 text-stone-300 border-stone-700',
        quote: 'Add high-impact tasks to structure your spiritual and academic day.',
        icon: Plus
      };
    }
    if (percentage === 100) {
      return {
        badge: '100% Vyavasayatmika Buddhi',
        badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        quote: 'All prescribed duties fulfilled with steady devotion! Keep mind fixed on Krishna.',
        icon: Sparkles
      };
    }
    if (percentage >= 75) {
      return {
        badge: 'Peak Velocity · Final Stretch',
        badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        quote: 'Victory is in sight! Finish remaining tasks with complete presence.',
        icon: Zap
      };
    }
    if (percentage >= 50) {
      return {
        badge: 'Strong Momentum · Past Halfway',
        badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        quote: 'Steady discipline brings clarity of intellect and calm determination.',
        icon: TrendingUp
      };
    }
    if (percentage > 0) {
      return {
        badge: 'Action in Motion',
        badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        quote: 'Karma-yoga in practice: offer each action with care, unattached to anxiety.',
        icon: Target
      };
    }
    return {
      badge: 'Laying the Day’s Foundations',
      badgeColor: 'bg-stone-800/80 text-stone-300 border-stone-700',
      quote: 'Early morning focus sets the rhythm. Begin with the highest priority task.',
      icon: Clock
    };
  };

  const status = getStatusDetails();
  const StatusIcon = status.icon;

  return (
    <div className="bg-stone-900/70 border border-stone-800 hover:border-stone-700 transition-colors rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm">
      {/* Background soft ambient gradient glow */}
      <div 
        className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: percentage >= 75 
            ? 'radial-gradient(circle, #10b981 0%, transparent 70%)'
            : 'radial-gradient(circle, #f59e0b 0%, transparent 70%)'
        }}
      />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-4 border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
              <span>Today's Task Completion</span>
              {percentage === 100 && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono-tabular">
                  100%
                </span>
              )}
            </h3>
            <p className="text-[11px] text-stone-400">
              Immediate visual velocity & productivity pulse
            </p>
          </div>
        </div>

        {onOpenNewTaskModal && (
          <button
            onClick={onOpenNewTaskModal}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium hover:underline transition-all"
            title="Create a new task for today"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        )}
      </div>

      {/* Primary Section: Circular Progress Ring & High-level Metrics */}
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {/* The Circular Progress Bar */}
        <div className="flex-shrink-0 flex items-center justify-center p-1">
          <CircularProgressRing
            percentage={percentage}
            completedCount={completedCount}
            totalCount={totalCount}
            size={132}
            strokeWidth={11}
          />
        </div>

        {/* Right Info Section */}
        <div className="flex-1 w-full space-y-3">
          {/* Status badge & quote */}
          <div className="space-y-1.5">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.badgeColor}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              <span>{status.badge}</span>
            </div>
            <p className="text-xs text-stone-300 italic leading-relaxed">
              "{status.quote}"
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Done</span>
              <span className="font-mono-tabular text-base font-bold text-emerald-400">
                {completedCount}
              </span>
            </div>

            <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Pending</span>
              <span className={`font-mono-tabular text-base font-bold ${remainingCount > 0 ? 'text-amber-400' : 'text-stone-400'}`}>
                {remainingCount}
              </span>
            </div>

            <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Time Left</span>
              <span className="font-mono-tabular text-base font-bold text-sky-300">
                {formatHoursMinutes(remainingMinutes)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pillar Breakdown Micro-Dashboard */}
      <div className="mt-4 pt-3.5 border-t border-stone-800/80 space-y-2">
        <span className="text-[11px] font-semibold text-stone-400 block uppercase tracking-wider">
          Pillar Completion Breakdown
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Sādhana Pillar */}
          <div className="bg-stone-950/60 border border-stone-800/70 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-stone-200 block leading-tight">Sādhana</span>
                <span className="font-mono-tabular text-[10px] text-amber-400/90">
                  {sadhanaStats.done}/{sadhanaStats.total} done
                </span>
              </div>
            </div>
            <span className="font-mono-tabular text-xs font-bold text-amber-300">
              {sadhanaStats.pct}%
            </span>
          </div>

          {/* GATE Pillar */}
          <div className="bg-stone-950/60 border border-stone-800/70 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-sky-400 flex-shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-stone-200 block leading-tight">GATE Prep</span>
                <span className="font-mono-tabular text-[10px] text-sky-400/90">
                  {gateStats.done}/{gateStats.total} done
                </span>
              </div>
            </div>
            <span className="font-mono-tabular text-xs font-bold text-sky-300">
              {gateStats.pct}%
            </span>
          </div>

          {/* College Pillar */}
          <div className="bg-stone-950/60 border border-stone-800/70 rounded-lg p-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-stone-200 block leading-tight">College</span>
                <span className="font-mono-tabular text-[10px] text-emerald-400/90">
                  {collegeStats.done}/{collegeStats.total} done
                </span>
              </div>
            </div>
            <span className="font-mono-tabular text-xs font-bold text-emerald-300">
              {collegeStats.pct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
