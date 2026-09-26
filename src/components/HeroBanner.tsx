import React from 'react';
import { Calendar, Flame, Target, BookOpen, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { DailySadhanaLog, UserSettings } from '../types';
import { CircularProgressRing } from './TaskCircularProgress';

interface HeroBannerProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  sadhanaLog: DailySadhanaLog;
  totalTasksToday: number;
  completedTasksToday: number;
  gateStudyMinutesToday: number;
  pyqsToday: number;
  userSettings: UserSettings;
  onOpenJapaModal: () => void;
  onOpenFocusTimer: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentDate,
  onDateChange,
  sadhanaLog,
  totalTasksToday,
  completedTasksToday,
  gateStudyMinutesToday,
  pyqsToday,
  userSettings,
  onOpenJapaModal,
  onOpenFocusTimer
}) => {
  // Calculate days left to GATE
  const calculateDaysToGate = () => {
    try {
      const today = new Date(currentDate);
      const examDate = new Date(userSettings.gateExamDate);
      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return 133;
    }
  };

  const daysToGate = calculateDaysToGate();

  // Date navigation helpers
  const handleShiftDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return currentDate === `${y}-${m}-${day}`;
  };

  const taskCompletionRate = totalTasksToday > 0 ? Math.round((completedTasksToday / totalTasksToday) * 100) : 0;
  const japaPercent = Math.min(100, Math.round((sadhanaLog.japaRounds / (sadhanaLog.japaTarget || 16)) * 100));
  const gateStudyHours = (gateStudyMinutesToday / 60).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 shadow-xl">
      {/* Background with atmosphere */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/sadhana_study_sanctuary_1790441009052.jpg"
          alt="Sadhana & Study Sanctuary"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity filter blur-[1px]"
          onError={(e) => {
            // Elegant CSS fallback
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-stone-900/60" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Top date and GATE countdown row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-amber-400">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>BRAHMA MUHURTA & DHARMA PROTOCOL</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-300 font-sans-body">Hare Krishna Movement</span>
            </div>
            
            <div className="flex items-center gap-3 mt-1.5">
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white">
                {formatDisplayDate(currentDate)}
              </h1>
              {isToday() && (
                <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono-tabular">
                  Today
                </span>
              )}
            </div>
          </div>

          {/* Date Picker Controls & Exam Countdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-stone-900/90 border border-stone-800 rounded-lg p-1">
              <button
                onClick={() => handleShiftDate(-1)}
                className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const y = today.getFullYear();
                  const m = String(today.getMonth() + 1).padStart(2, '0');
                  const day = String(today.getDate()).padStart(2, '0');
                  onDateChange(`${y}-${m}-${day}`);
                }}
                className="px-2.5 py-1 text-xs font-medium text-stone-300 hover:text-white"
              >
                Current Day
              </button>
              <button
                onClick={() => handleShiftDate(1)}
                className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded transition-colors"
                title="Next Day"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* GATE countdown banner */}
            <div className="bg-sky-950/40 border border-sky-800/50 rounded-lg px-3.5 py-1.5 flex items-center gap-2">
              <Target className="h-4 w-4 text-sky-400" />
              <div>
                <span className="text-[10px] text-sky-300/80 block uppercase tracking-wider font-semibold">
                  GATE Countdown
                </span>
                <span className="font-mono-tabular font-bold text-sm text-sky-200">
                  {daysToGate} Days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* The 3 Pillars Snapshot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          {/* Pillar 1: Sadhana (Krishna Consciousness) */}
          <div className="bg-stone-950/70 border border-amber-900/40 hover:border-amber-700/60 transition-all rounded-xl p-4.5 relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                  <Flame className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-stone-100">Sādhana Practice</h3>
                  <p className="text-[11px] text-stone-400">Japa & Shastra Study</p>
                </div>
              </div>
              <button
                onClick={onOpenJapaModal}
                className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors font-medium"
              >
                Chant Japa
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-stone-400">Maha-Mantra Rounds:</span>
                <span className="font-mono-tabular font-semibold text-amber-300 text-sm">
                  {sadhanaLog.japaRounds} / {sadhanaLog.japaTarget} rounds
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                <div 
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${japaPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>Wakeup: {sadhanaLog.wakeupTime || '04:30 AM'}</span>
                <span>Gita: {sadhanaLog.gitaStudyMinutes} mins</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: GATE Preparation */}
          <div className="bg-stone-950/70 border border-sky-900/40 hover:border-sky-700/60 transition-all rounded-xl p-4.5 relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
                  <Target className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-stone-100">GATE Engineering</h3>
                  <p className="text-[11px] text-stone-400">Rank Target & PYQs</p>
                </div>
              </div>
              <button
                onClick={onOpenFocusTimer}
                className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors font-medium"
              >
                Focus Timer
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-stone-400">Study / PYQs today:</span>
                <span className="font-mono-tabular font-semibold text-sky-300 text-sm">
                  {gateStudyHours}h · {pyqsToday} PYQs
                </span>
              </div>
              {/* Progress bar based on target hours */}
              <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                <div 
                  className="bg-gradient-to-r from-sky-600 to-sky-400 h-2 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min(100, (gateStudyMinutesToday / (userSettings.dailyGateTargetHours * 60)) * 100)}%` 
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>Target: {userSettings.dailyGateTargetHours} hrs</span>
                <span>Branch: {userSettings.gateTargetBranch.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: College Academics & Daily Tasks */}
          <div className="bg-stone-950/70 border border-emerald-900/40 hover:border-emerald-700/60 transition-all rounded-xl p-4.5 relative group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-stone-100">College & Day Plan</h3>
                  <p className="text-[11px] text-stone-400">Attendance & Tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <CircularProgressRing
                  percentage={taskCompletionRate}
                  completedCount={completedTasksToday}
                  totalCount={totalTasksToday}
                  size={46}
                  strokeWidth={5}
                  showSubtext={false}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-stone-400">Overall Tasks Done:</span>
                <span className="font-mono-tabular font-semibold text-emerald-300 text-sm">
                  {completedTasksToday}/{totalTasksToday} ({taskCompletionRate}%)
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${taskCompletionRate}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>Safe attendance &gt;= 75%</span>
                <span>{totalTasksToday - completedTasksToday} pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
