import React from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Volume2, 
  VolumeX, 
  Plus, 
  Timer,
  Settings,
  CircleDot
} from 'lucide-react';
import { Pillar } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'todos' | 'sadhana' | 'gate' | 'college' | 'weekly';
  setActiveTab: (tab: 'dashboard' | 'todos' | 'sadhana' | 'gate' | 'college' | 'weekly') => void;
  onOpenNewTask: () => void;
  onOpenJapaModal: () => void;
  onOpenTimerModal: () => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentJapaRounds: number;
  japaTarget: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTask,
  onOpenJapaModal,
  onOpenTimerModal,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
  currentJapaRounds,
  japaTarget,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-left group transition-opacity hover:opacity-90"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 group-hover:border-amber-400/50 transition-colors">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-stone-100 block leading-tight">
                Sādhana & Vidyā
              </span>
              <span className="text-[11px] text-stone-400 font-sans-body hidden sm:block">
                GATE · College · Krishna Consciousness
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'todos'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            To-Do Planner
          </button>

          <button
            onClick={() => setActiveTab('sadhana')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sadhana'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Sādhana</span>
            <span className="font-mono-tabular text-xs text-amber-400/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
              {currentJapaRounds}/{japaTarget}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('gate')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'gate'
                ? 'border-sky-500 text-sky-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            GATE Prep
          </button>

          <button
            onClick={() => setActiveTab('college')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'college'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            College Attendance
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'weekly'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Review & Habits
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions and utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Japa counter button */}
          <button
            onClick={onOpenJapaModal}
            title="Open Japa Mala Counter"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-700/50 rounded-lg hover:bg-amber-900/50 transition-colors whitespace-nowrap"
          >
            <CircleDot className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Japa Mala</span>
            <span className="font-mono-tabular">({currentJapaRounds})</span>
          </button>

          {/* Quick Study Focus Timer */}
          <button
            onClick={onOpenTimerModal}
            title="Open Focus Stopwatch"
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors border border-transparent hover:border-stone-700"
          >
            <Timer className="h-4 w-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Mute audio cues" : "Enable bell & bead audio"}
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-amber-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-stone-500" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Settings & Backup"
            className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm whitespace-nowrap active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex md:hidden overflow-x-auto border-t border-stone-800/80 px-4 py-2 gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'dashboard' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('todos')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'todos' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
          }`}
        >
          To-Dos
        </button>
        <button
          onClick={() => setActiveTab('sadhana')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'sadhana' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
          }`}
        >
          Sādhana ({currentJapaRounds}/{japaTarget})
        </button>
        <button
          onClick={() => setActiveTab('gate')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'gate' ? 'bg-sky-500/20 text-sky-300' : 'text-stone-400'
          }`}
        >
          GATE Prep
        </button>
        <button
          onClick={() => setActiveTab('college')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'college' ? 'bg-emerald-500/20 text-emerald-300' : 'text-stone-400'
          }`}
        >
          College
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-3 py-1 text-xs whitespace-nowrap rounded ${
            activeTab === 'weekly' ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400'
          }`}
        >
          Review
        </button>
      </div>
    </header>
  );
};
