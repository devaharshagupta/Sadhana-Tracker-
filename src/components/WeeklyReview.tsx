import React from 'react';
import { 
  Flame, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  Award, 
  TrendingUp, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { DailySadhanaLog, TaskItem, UserSettings } from '../types';

interface WeeklyReviewProps {
  currentDate: string;
  sadhanaLogs: Record<string, DailySadhanaLog>;
  tasks: TaskItem[];
  userSettings: UserSettings;
}

export const WeeklyReview: React.FC<WeeklyReviewProps> = ({
  currentDate,
  sadhanaLogs,
  tasks,
  userSettings
}) => {
  // Generate the last 7 days from currentDate
  const getLast7Days = () => {
    const days: { dateStr: string; label: string; shortDay: string }[] = [];
    const baseDate = new Date(currentDate + 'T00:00:00');

    for (let i = 6; i >= 0; i--) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      const shortDay = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      days.push({ dateStr, label, shortDay });
    }
    return days;
  };

  const past7Days = getLast7Days();

  // Aggregate stats across the week
  let totalJapaRoundsWeek = 0;
  let brahmaMuhurtaDaysCount = 0;
  let totalGitaMinutes = 0;

  past7Days.forEach(({ dateStr }) => {
    const log = sadhanaLogs[dateStr];
    if (log) {
      totalJapaRoundsWeek += log.japaRounds || 0;
      if (log.brahmaMuhurtaWakeup) brahmaMuhurtaDaysCount++;
      totalGitaMinutes += log.gitaStudyMinutes || 0;
    }
  });

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-amber-500/10 text-amber-400">
            <Award className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-display font-bold text-white">
            Weekly Discipline & Consistency Analysis
          </h2>
        </div>
        <p className="text-xs text-stone-400 mt-0.5">
          "Steadfastness is the foundation of both spiritual realization and competitive excellence."
        </p>
      </div>

      {/* Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Japa Rounds */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">Japa Rounds (7 Days)</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-tabular text-amber-300">
              {totalJapaRoundsWeek}
            </span>
            <span className="text-xs text-stone-500">
              / {userSettings.japaDailyTarget * 7} goal
            </span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Avg: {(totalJapaRoundsWeek / 7).toFixed(1)} rounds/day
          </p>
        </div>

        {/* Brahma Muhurta Waking */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">Brahma Muhūrta Waking</span>
            <Sparkles className="h-4 w-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-tabular text-sky-300">
              {brahmaMuhurtaDaysCount}
            </span>
            <span className="text-xs text-stone-500">/ 7 mornings</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Woke before 5:00 AM for Mangala Aarti & quiet japa
          </p>
        </div>

        {/* Gita & Bhagavatam Study */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-400">Shāstra Svadhyāya</span>
            <BookOpen className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold font-mono-tabular text-emerald-300">
              {totalGitaMinutes}
            </span>
            <span className="text-xs text-stone-500">minutes read</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            Bhagavad Gita As It Is verses contemplation
          </p>
        </div>
      </div>

      {/* 7-Day Consistency Matrix */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4">
        <h3 className="text-base font-semibold text-stone-100">
          7-Day Habit Matrix (GATE · College · Sādhana)
        </h3>

        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {past7Days.map(({ dateStr, label, shortDay }) => {
            const log = sadhanaLogs[dateStr];
            const rounds = log ? log.japaRounds : 0;
            const target = userSettings.japaDailyTarget || 16;
            const hitJapa = rounds >= target;
            const early = log?.brahmaMuhurtaWakeup;
            const isToday = dateStr === currentDate;

            return (
              <div
                key={dateStr}
                className={`bg-stone-950/70 border rounded-xl p-2.5 md:p-3 text-center space-y-2 transition-all ${
                  isToday ? 'border-amber-500/60 ring-1 ring-amber-500/30' : 'border-stone-800'
                }`}
              >
                <div className="text-[11px] font-medium text-stone-400 truncate">
                  {label}
                </div>

                {/* Japa count */}
                <div className="py-1">
                  <span className={`font-mono-tabular text-lg md:text-xl font-bold block ${
                    hitJapa ? 'text-amber-300' : 'text-stone-300'
                  }`}>
                    {rounds}
                  </span>
                  <span className="text-[10px] text-stone-500 block uppercase">
                    Rounds
                  </span>
                </div>

                {/* Micro indicators */}
                <div className="flex items-center justify-center gap-1 text-[11px] pt-1 border-t border-stone-900">
                  <span
                    title={early ? "Woke in Brahma Muhurta" : "Late wakeup"}
                    className={`h-2 w-2 rounded-full ${
                      early ? 'bg-amber-400' : 'bg-stone-700'
                    }`}
                  />
                  <span
                    title={hitJapa ? "16 rounds completed" : "Partial rounds"}
                    className={`h-2 w-2 rounded-full ${
                      hitJapa ? 'bg-emerald-400' : 'bg-stone-700'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vedic Principle on Habit Building */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-5 space-y-2">
        <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>Srila Prabhupada's Principle of Regulated Life (Yuktāhāra-vihāra)</span>
        </h4>
        <p className="text-xs text-stone-300 leading-relaxed">
          "He who is regulated in his habits of eating, sleeping, working and recreation can mitigate all material pains by practicing the yoga system." (Bhagavad Gita 6.17). By waking early and offering your academic duties as service to Krishna, you never suffer burn-out or academic paralysis.
        </p>
      </div>
    </div>
  );
};
