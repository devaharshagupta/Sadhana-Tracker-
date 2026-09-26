import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Timer, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogCompletedSession: (minutes: number, topic: string) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  onLogCompletedSession
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionTopic, setSessionTopic] = useState('GATE PYQ Deep Practice');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSecondsLeft(selectedDuration * 60);
    setIsActive(false);
  }, [selectedDuration]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            sound.playDeepChime();
            onLogCompletedSession(selectedDuration, sessionTopic);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, selectedDuration, sessionTopic]);

  if (!isOpen) return null;

  const handleToggle = () => {
    if (!isActive) {
      sound.playBeadClick();
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(selectedDuration * 60);
    sound.playBeadClick();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((selectedDuration * 60 - secondsLeft) / (selectedDuration * 60)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-sky-900/40 bg-gradient-to-b from-stone-950 via-stone-900 to-sky-950/30 p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Timer className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-display font-bold text-white">
                Deep Work Focus Stopwatch
              </h2>
              <p className="text-[11px] text-stone-400">
                GATE & College distraction-free study blocks
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

        {/* Preset Duration Buttons */}
        <div className="flex items-center justify-center gap-2">
          {[
            { label: '25 Min (Pomodoro)', val: 25 },
            { label: '50 Min (Deep Work)', val: 50 },
            { label: '90 Min (GATE Section)', val: 90 },
          ].map((preset) => (
            <button
              key={preset.val}
              onClick={() => {
                setSelectedDuration(preset.val);
                sound.playBeadClick();
              }}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
                selectedDuration === preset.val
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Topic Input */}
        <div>
          <label className="text-[11px] text-stone-400 block mb-1">Study Focus Topic:</label>
          <input
            type="text"
            value={sessionTopic}
            onChange={(e) => setSessionTopic(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Big Time Display */}
        <div className="text-center py-6">
          <div className="font-mono-tabular text-6xl font-bold tracking-tight text-sky-200">
            {formatTime(secondsLeft)}
          </div>
          <span className="text-xs text-stone-400 mt-2 block font-sans-body">
            {isActive ? 'Distraction-free focus ongoing...' : 'Ready to begin session'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-900 rounded-full h-2 border border-stone-800 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-600 to-sky-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="p-3 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-400 hover:text-white rounded-2xl transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all shadow-lg active:scale-95 ${
              isActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-sky-500 text-stone-950 hover:bg-sky-400'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="h-5 w-5" />
                <span>Pause Focus</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Start Session</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] text-stone-400 pt-2 border-t border-stone-800/80">
          Tip: Offer the fruit of this study session to Sri Krishna for a peaceful, unagitated mind.
        </p>
      </div>
    </div>
  );
};
