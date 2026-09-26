import React, { useState } from 'react';
import { BookOpen, Sparkles, RefreshCw, Volume2 } from 'lucide-react';
import { BG_SLOKAS } from '../data/initialData';
import { sound } from '../utils/audio';

export const SlokaCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sloka = BG_SLOKAS[currentIndex];

  const handleNextSloka = () => {
    setCurrentIndex((prev) => (prev + 1) % BG_SLOKAS.length);
    sound.playBeadClick();
  };

  const handleChime = () => {
    sound.playTempleBell();
  };

  return (
    <div className="rounded-xl border border-amber-900/40 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/20 p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-amber-500/10 text-amber-400">
            <BookOpen className="h-4 w-4" />
          </span>
          <span className="font-display text-sm font-semibold tracking-wide text-amber-200">
            Bhagavad Gītā As It Is · Chapter {sloka.chapter}, Verse {sloka.verse}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleChime}
            title="Temple Bell Chime"
            className="p-1 text-stone-400 hover:text-amber-300 transition-colors rounded"
          >
            <Volume2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleNextSloka}
            title="Next Inspiring Verse"
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-amber-300 px-2 py-1 rounded transition-colors border border-stone-800 hover:border-amber-700/50"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Next Verse</span>
          </button>
        </div>
      </div>

      <div className="pt-3.5 space-y-2.5">
        {/* Sanskrit */}
        <p className="text-base text-amber-100 font-serif leading-relaxed text-center tracking-wide italic">
          {sloka.sanskrit}
        </p>

        {/* Transliteration */}
        <p className="text-xs text-stone-400 font-mono-tabular text-center tracking-normal">
          {sloka.transliteration}
        </p>

        {/* Translation */}
        <p className="text-xs text-stone-200 leading-relaxed pt-1">
          <span className="text-amber-400 font-semibold">Translation: </span>
          {sloka.translation}
        </p>

        {/* Practical Student Devotee Application */}
        <div className="bg-stone-900/80 border-l-2 border-amber-500 p-2.5 rounded-r text-xs text-stone-300 leading-relaxed">
          <span className="font-semibold text-amber-300">Spiritual & Academic Mindset: </span>
          {sloka.practicalApplication}
        </div>
      </div>
    </div>
  );
};
