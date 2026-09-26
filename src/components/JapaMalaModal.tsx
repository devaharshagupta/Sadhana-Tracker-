import React, { useState, useEffect } from 'react';
import { X, Volume2, Sparkles, RotateCcw, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface JapaMalaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRounds: number;
  japaTarget: number;
  onUpdateRounds: (newRounds: number) => void;
}

export const JapaMalaModal: React.FC<JapaMalaModalProps> = ({
  isOpen,
  onClose,
  currentRounds,
  japaTarget,
  onUpdateRounds
}) => {
  const [currentBead, setCurrentBead] = useState(0); // 0 to 108
  const [showPanchaTattva, setShowPanchaTattva] = useState(true);

  // Keyboard shortcut: Spacebar to count bead
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleNextBead();
      } else if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentBead, currentRounds]);

  if (!isOpen) return null;

  const handleNextBead = () => {
    if (currentBead >= 107) {
      // Completed 108 beads (1 full round)
      sound.playTempleBell();
      onUpdateRounds(currentRounds + 1);
      setCurrentBead(0);
      setShowPanchaTattva(true);
    } else {
      sound.playBeadClick();
      setCurrentBead((prev) => prev + 1);
      if (showPanchaTattva && currentBead > 0) {
        setShowPanchaTattva(false);
      }
    }
  };

  const handleResetBead = () => {
    setCurrentBead(0);
    sound.playBeadClick();
  };

  const percentBeads = Math.round(((currentBead + 1) / 108) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-900/40 bg-gradient-to-b from-stone-950 via-stone-900 to-amber-950/30 p-6 md:p-8 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Tulasī Japa Mālā Counter
              </h2>
              <p className="text-[11px] text-stone-400">
                108 Beads · Click anywhere or tap Spacebar to count
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Round & Target Badge */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-sans-body">Completed Today:</span>
            <span className="font-mono-tabular text-sm font-bold text-amber-300">
              {currentRounds} / {japaTarget} Rounds
            </span>
          </div>

          <button
            onClick={handleResetBead}
            className="flex items-center gap-1 text-[11px] text-stone-500 hover:text-amber-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Bead</span>
          </button>
        </div>

        {/* Pancha-Tattva or Maha-Mantra Display */}
        {showPanchaTattva && currentBead === 0 ? (
          <div className="bg-amber-950/30 border border-amber-800/40 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] text-amber-400 uppercase font-semibold tracking-wider">
              Recite Pancha-Tattva Mantra First
            </span>
            <p className="text-xs text-amber-100 font-serif leading-relaxed italic">
              "jaya śrī-kṛṣṇa-caitanya prabhu-nityānanda śrī-advaita gadādhara śrīvāsādi-gaura-bhakta-vṛnda"
            </p>
          </div>
        ) : (
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 text-center space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider">
              Hare Krishna Mahā-Mantra
            </span>
            <p className="text-sm md:text-base font-serif text-amber-200 leading-relaxed font-medium">
              hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare<br />
              hare rāma hare rāma rāma rāma hare hare
            </p>
          </div>
        )}

        {/* Interactive Bead Dial / Click Zone */}
        <div
          onClick={handleNextBead}
          className="relative mx-auto flex h-56 w-56 cursor-pointer select-none items-center justify-center rounded-full border-4 border-amber-600/30 bg-stone-950/90 shadow-inner hover:border-amber-500/60 active:scale-95 transition-all group"
        >
          {/* Circular progress visual rim */}
          <div className="absolute inset-2 rounded-full border border-dashed border-stone-800 group-hover:border-amber-700/50 transition-colors" />

          {/* Central count display */}
          <div className="text-center z-10">
            <span className="text-[10px] font-sans-body uppercase tracking-widest text-stone-500 group-hover:text-amber-400 transition-colors block">
              Bead
            </span>
            <span className="font-mono-tabular text-5xl font-bold text-amber-300">
              {currentBead + 1}
            </span>
            <span className="text-xs text-stone-500 font-mono-tabular block mt-0.5">
              / 108
            </span>
            <span className="text-[11px] text-amber-400/80 mt-1 block group-hover:underline">
              Tap / Press Space
            </span>
          </div>
        </div>

        {/* Linear Bead Progress & Guidance */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-400 font-mono-tabular">
            <span>Current Round Progress</span>
            <span>{percentBeads}%</span>
          </div>
          <div className="w-full bg-stone-900 rounded-full h-2 border border-stone-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-150"
              style={{ width: `${percentBeads}%` }}
            />
          </div>
          <p className="text-center text-[11px] text-stone-400 italic pt-1">
            "Chant each name distinctly and hear with complete attention. Mind is purified through sound vibration."
          </p>
        </div>

        {/* Quick Manual Round Increment */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs text-stone-400">
          <span>Manual override:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateRounds(Math.max(0, currentRounds - 1))}
              className="px-2.5 py-1 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 rounded"
            >
              -1 Round
            </button>
            <button
              onClick={() => {
                onUpdateRounds(currentRounds + 1);
                sound.playTempleBell();
              }}
              className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 rounded font-medium"
            >
              +1 Full Round Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
