import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Headphones, 
  Heart, 
  ShieldCheck, 
  CircleDot,
  CheckCircle2,
  Circle,
  Plus,
  Minus
} from 'lucide-react';
import { DailySadhanaLog, RegulativePrinciples } from '../types';
import { sound } from '../utils/audio';

interface SadhanaTrackerProps {
  sadhanaLog: DailySadhanaLog;
  onUpdateSadhana: (updated: Partial<DailySadhanaLog>) => void;
  onOpenJapaModal: () => void;
}

export const SadhanaTracker: React.FC<SadhanaTrackerProps> = ({
  sadhanaLog,
  onUpdateSadhana,
  onOpenJapaModal,
}) => {
  const handleRoundChange = (delta: number) => {
    const newCount = Math.max(0, Math.min(64, sadhanaLog.japaRounds + delta));
    onUpdateSadhana({ japaRounds: newCount });
    if (delta > 0) {
      sound.playTempleBell();
    } else {
      sound.playBeadClick();
    }
  };

  const handleTogglePrinciple = (key: keyof RegulativePrinciples) => {
    const updated = {
      ...sadhanaLog.regulativePrinciples,
      [key]: !sadhanaLog.regulativePrinciples[key]
    };
    onUpdateSadhana({ regulativePrinciples: updated });
    sound.playBeadClick();
  };

  const percentComplete = Math.min(100, Math.round((sadhanaLog.japaRounds / (sadhanaLog.japaTarget || 16)) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/10 text-amber-400">
              <Flame className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-display font-bold text-white">
              Daily Sādhana & Spiritual Regimen
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Krishna Consciousness practice: Japa meditation, Shastra study, 4 Regulative Principles, and Brahma Muhurta
          </p>
        </div>

        <button
          onClick={onOpenJapaModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 rounded-xl transition-all shadow-md active:scale-95 self-start sm:self-auto"
        >
          <CircleDot className="h-4 w-4" />
          <span>Launch 108 Bead Mala Counter</span>
        </button>
      </div>

      {/* Grid: 1. Japa Mala Central Card, 2. Morning & Principles Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Japa Mala Command Station (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/60 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-stone-200">
                Hare Krishna Mahā-Mantra Japa Rounds
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-sans-body">
              Target: <strong className="font-mono-tabular text-amber-300">{sadhanaLog.japaTarget} rounds</strong> daily
            </span>
          </div>

          {/* Big Progress Counter Box */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <div className="flex items-baseline gap-2">
                <span className="font-mono-tabular text-4xl md:text-5xl font-bold text-amber-300">
                  {sadhanaLog.japaRounds}
                </span>
                <span className="text-stone-500 text-lg">/ {sadhanaLog.japaTarget}</span>
                <span className="text-xs text-stone-400 font-sans-body">rounds chanted</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {sadhanaLog.japaRounds >= sadhanaLog.japaTarget ? (
                  <span className="text-emerald-400 font-medium">Daily vow fulfilled! Hari Haribol!</span>
                ) : (
                  <span>{sadhanaLog.japaTarget - sadhanaLog.japaRounds} rounds remaining today</span>
                )}
              </p>
            </div>

            {/* Quick +/- controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRoundChange(-1)}
                disabled={sadhanaLog.japaRounds <= 0}
                className="p-2.5 bg-stone-900 border border-stone-800 hover:border-stone-700 disabled:opacity-30 rounded-xl text-stone-300 hover:text-white transition-colors"
                title="Subtract 1 round"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleRoundChange(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-200 rounded-xl font-medium text-xs transition-colors"
                title="Add 1 round"
              >
                <Plus className="h-4 w-4" />
                <span>Log Round</span>
              </button>
            </div>
          </div>

          {/* Visual Round Dots Indicator (up to 16 rounds) */}
          <div>
            <div className="flex justify-between items-center text-xs text-stone-400 mb-2">
              <span>Rounds tracker:</span>
              <span className="font-mono-tabular">{percentComplete}% complete</span>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
              {Array.from({ length: sadhanaLog.japaTarget || 16 }).map((_, idx) => {
                const roundNum = idx + 1;
                const isDone = roundNum <= sadhanaLog.japaRounds;
                return (
                  <button
                    key={roundNum}
                    onClick={() => {
                      onUpdateSadhana({ japaRounds: roundNum });
                      sound.playTempleBell();
                    }}
                    title={`Round ${roundNum}`}
                    className={`h-7 rounded flex items-center justify-center font-mono-tabular text-xs font-semibold transition-all ${
                      isDone
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'bg-stone-900 border border-stone-800 text-stone-600 hover:border-stone-700 hover:text-stone-400'
                    }`}
                  >
                    {roundNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sacred Mantra Guide */}
          <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-4 space-y-2">
            <div>
              <span className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold block">
                Sri Pancha-Tattva Mantra (Recite before starting japa)
              </span>
              <p className="text-xs text-stone-300 font-mono-tabular mt-0.5">
                jaya śrī-kṛṣṇa-caitanya prabhu-nityānanda śrī-advaita gadādhara śrīvāsādi-gaura-bhakta-vṛnda
              </p>
            </div>
            <div className="pt-2 border-t border-stone-900">
              <span className="text-[10px] text-amber-400/80 uppercase tracking-wider font-semibold block">
                Hare Krishna Mahā-Mantra (Chant 108 times per round)
              </span>
              <p className="text-xs text-amber-200 font-mono-tabular font-medium mt-0.5">
                hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare / hare rāma hare rāma rāma rāma hare hare
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Wakeup, Regulative Principles, Shastra Study (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Brahma Muhurta & Wakeup Log */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-stone-200">
                  Brahma Muhūrta Wake-up
                </h3>
              </div>
              <button
                onClick={() => {
                  onUpdateSadhana({ brahmaMuhurtaWakeup: !sadhanaLog.brahmaMuhurtaWakeup });
                  sound.playBeadClick();
                }}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium border ${
                  sadhanaLog.brahmaMuhurtaWakeup
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                {sadhanaLog.brahmaMuhurtaWakeup ? 'Woke Early' : 'Late Wakeup'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-stone-400">Wake-up Time:</label>
              <input
                type="time"
                value={sadhanaLog.wakeupTime || '04:30'}
                onChange={(e) => onUpdateSadhana({ wakeupTime: e.target.value })}
                className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-amber-500"
              />
            </div>
            <p className="text-[11px] text-stone-400 leading-normal">
              Rising before 5:00 AM activates the mode of goodness (sattva-guna), sharpening memory for GATE algorithms and deepening meditation.
            </p>
          </div>

          {/* 4 Regulative Principles (Chār Niyam) */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-stone-200">
                Four Regulative Principles
              </h3>
            </div>
            <p className="text-[11px] text-stone-400">
              The four pillars of dharma (mercy, truthfulness, cleanliness, austerity):
            </p>

            <div className="space-y-2">
              {[
                { key: 'noMeatFishEgg' as const, label: 'No Meat, Fish, or Eggs (Ahimsā / Mercy)' },
                { key: 'noGambling' as const, label: 'No Gambling or Speculation (Satyam / Truth)' },
                { key: 'noIntoxication' as const, label: 'No Intoxication, Alcohol, Caffeine (Tapasya / Austerity)' },
                { key: 'noIllicitSex' as const, label: 'Strict Celibacy / Brahmacharya (Śaucam / Cleanliness)' },
              ].map(({ key, label }) => {
                const adhered = sadhanaLog.regulativePrinciples[key];
                return (
                  <div
                    key={key}
                    onClick={() => handleTogglePrinciple(key)}
                    className="flex items-center gap-2.5 p-2 bg-stone-950/60 border border-stone-800/80 rounded-lg cursor-pointer hover:border-stone-700 select-none transition-colors"
                  >
                    {adhered ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-stone-600 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${adhered ? 'text-stone-200' : 'text-stone-500'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Shastra Study & Hearing Log Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gita Study */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-stone-200">Bhagavad Gītā Study</h4>
            </div>
            <div className="flex items-center gap-1 font-mono-tabular text-xs text-amber-300">
              <input
                type="number"
                min="0"
                max="300"
                value={sadhanaLog.gitaStudyMinutes}
                onChange={(e) => onUpdateSadhana({ gitaStudyMinutes: parseInt(e.target.value) || 0 })}
                className="w-12 bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-center text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <span className="text-stone-400">mins</span>
            </div>
          </div>
          <input
            type="text"
            placeholder="Verses read e.g. BG 6.20 - 6.26..."
            value={sadhanaLog.gitaReadingNote}
            onChange={(e) => onUpdateSadhana({ gitaReadingNote: e.target.value })}
            className="w-full bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Bhagavatam / Sravanam */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-stone-200">Śravaṇam (Lecture / Kirtan)</h4>
            </div>
            <div className="flex items-center gap-1 font-mono-tabular text-xs text-amber-300">
              <input
                type="number"
                min="0"
                max="300"
                value={sadhanaLog.hearingMinutes}
                onChange={(e) => onUpdateSadhana({ hearingMinutes: parseInt(e.target.value) || 0 })}
                className="w-12 bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-center text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <span className="text-stone-400">mins</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-400">
            Hear Prabhupada's nectar in the evening while walking or relaxing from college stress.
          </p>
        </div>

        {/* Deity Seva & Prasadam */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-stone-200">Deity Seva & Prasādam</h4>
            </div>
            <button
              onClick={() => {
                onUpdateSadhana({ deitySevaPrasadam: !sadhanaLog.deitySevaPrasadam });
                sound.playBeadClick();
              }}
              className={`px-2.5 py-1 text-xs rounded transition-colors font-medium border ${
                sadhanaLog.deitySevaPrasadam
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {sadhanaLog.deitySevaPrasadam ? 'Honored Prasādam' : 'Not Yet'}
            </button>
          </div>
          <p className="text-[11px] text-stone-400">
            Offered all daily food to Sri Krishna with Tulasi leaves. Eating sanctified food purifies intellect.
          </p>
        </div>
      </div>

      {/* Sādhana Reflections & Realizations Note */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 space-y-2">
        <label className="text-xs font-semibold text-stone-300">
          Daily Sādhana Realization / Spiritual Diary:
        </label>
        <textarea
          rows={2}
          value={sadhanaLog.notes}
          onChange={(e) => onUpdateSadhana({ notes: e.target.value })}
          placeholder="How was your focus during Japa today? Any challenges with college distractions or restlessness? Write your prayer to Lord Krishna..."
          className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
        />
      </div>
    </div>
  );
};
