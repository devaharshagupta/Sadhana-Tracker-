import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  Clock, 
  CircleDot, 
  Timer, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  CollegeCourse, 
  DailyGateLog, 
  DailySadhanaLog, 
  GateMockTest, 
  GateSubject, 
  Pillar, 
  QuickThought,
  TaskItem, 
  UserSettings 
} from './types';
import { StorageService } from './utils/storage';
import { getTodayDateString, INITIAL_DAILY_SADHANA } from './data/initialData';
import { sound } from './utils/audio';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { SlokaCard } from './components/SlokaCard';
import { TodoList } from './components/TodoList';
import { SadhanaTracker } from './components/SadhanaTracker';
import { GateTracker } from './components/GateTracker';
import { CollegeTracker } from './components/CollegeTracker';
import { WeeklyReview } from './components/WeeklyReview';
import { JapaMalaModal } from './components/JapaMalaModal';
import { FocusTimerModal } from './components/FocusTimerModal';
import { TaskModal } from './components/TaskModal';
import { SettingsModal } from './components/SettingsModal';
import { TaskCircularProgress } from './components/TaskCircularProgress';
import { QuickThoughts } from './components/QuickThoughts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'todos' | 'sadhana' | 'gate' | 'college' | 'weekly'>('dashboard');
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());

  // Application persistent state
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [tasks, setTasks] = useState<TaskItem[]>(() => StorageService.getTasks());
  const [sadhanaLogs, setSadhanaLogs] = useState<Record<string, DailySadhanaLog>>(() => StorageService.getSadhanaLogs());
  const [gateSubjects, setGateSubjects] = useState<GateSubject[]>(() => StorageService.getGateSubjects());
  const [gateMocks, setGateMocks] = useState<GateMockTest[]>(() => StorageService.getGateMocks());
  const [collegeCourses, setCollegeCourses] = useState<CollegeCourse[]>(() => StorageService.getCollegeCourses());
  const [quickThoughts, setQuickThoughts] = useState<QuickThought[]>(() => StorageService.getQuickThoughts());

  // Daily GATE tracking
  const [gateStudyMinutesToday, setGateStudyMinutesToday] = useState<number>(135);
  const [pyqsSolvedToday, setPyqsSolvedToday] = useState<number>(25);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [isJapaModalOpen, setIsJapaModalOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Ensure sound matches settings
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Current day's sadhana log
  const currentSadhanaLog: DailySadhanaLog = sadhanaLogs[currentDate] || {
    ...INITIAL_DAILY_SADHANA,
    date: currentDate,
    japaRounds: 0,
    japaTarget: settings.japaDailyTarget || 16
  };

  // Handlers for state updates
  const handleUpdateSadhana = (updatedFields: Partial<DailySadhanaLog>) => {
    const updated = {
      ...currentSadhanaLog,
      ...updatedFields
    };
    const nextLogs = {
      ...sadhanaLogs,
      [currentDate]: updated
    };
    setSadhanaLogs(nextLogs);
    StorageService.saveSadhanaLogs(nextLogs);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          status: nextCompleted ? ('completed' as const) : ('pending' as const)
        };
      }
      return t;
    });
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks: nextSubtasks };
      }
      return t;
    });
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    StorageService.saveTasks(updated);
    sound.playBeadClick();
  };

  const handleSaveTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>, existingId?: string) => {
    if (existingId) {
      const updated = tasks.map((t) =>
        t.id === existingId ? { ...t, ...taskData } : t
      );
      setTasks(updated);
      StorageService.saveTasks(updated);
    } else {
      const newTask: TaskItem = {
        ...taskData,
        id: 'task-' + Date.now(),
        createdAt: Date.now()
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      StorageService.saveTasks(updated);
    }
  };

  const handleUpdateGateSubjects = (subjects: GateSubject[]) => {
    setGateSubjects(subjects);
    StorageService.saveGateSubjects(subjects);
  };

  const handleAddMock = (mock: GateMockTest) => {
    const updated = [mock, ...gateMocks];
    setGateMocks(updated);
    StorageService.saveGateMocks(updated);
  };

  const handleDeleteMock = (id: string) => {
    const updated = gateMocks.filter((m) => m.id !== id);
    setGateMocks(updated);
    StorageService.saveGateMocks(updated);
  };

  const handleUpdateCollegeCourses = (courses: CollegeCourse[]) => {
    setCollegeCourses(courses);
    StorageService.saveCollegeCourses(courses);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleToggleSound = () => {
    const nextSound = !settings.soundEnabled;
    const nextSettings = { ...settings, soundEnabled: nextSound };
    setSettings(nextSettings);
    StorageService.saveSettings(nextSettings);
    sound.setEnabled(nextSound);
    if (nextSound) sound.playTempleBell();
  };

  const handleReloadData = () => {
    setSettings(StorageService.getSettings());
    setTasks(StorageService.getTasks());
    setSadhanaLogs(StorageService.getSadhanaLogs());
    setGateSubjects(StorageService.getGateSubjects());
    setGateMocks(StorageService.getGateMocks());
    setCollegeCourses(StorageService.getCollegeCourses());
    setQuickThoughts(StorageService.getQuickThoughts());
  };

  const handleSaveQuickThought = (thoughtData: Omit<QuickThought, 'id' | 'createdAt'>, existingId?: string) => {
    if (existingId) {
      const updated = quickThoughts.map((t) =>
        t.id === existingId ? { ...t, ...thoughtData } : t
      );
      setQuickThoughts(updated);
      StorageService.saveQuickThoughts(updated);
    } else {
      const newThought: QuickThought = {
        ...thoughtData,
        id: 'thought-' + Date.now(),
        createdAt: Date.now()
      };
      const updated = [newThought, ...quickThoughts];
      setQuickThoughts(updated);
      StorageService.saveQuickThoughts(updated);
    }
  };

  const handleDeleteQuickThought = (id: string) => {
    const updated = quickThoughts.filter((t) => t.id !== id);
    setQuickThoughts(updated);
    StorageService.saveQuickThoughts(updated);
  };

  const handleTogglePinQuickThought = (id: string) => {
    const updated = quickThoughts.map((t) =>
      t.id === id ? { ...t, isPinned: !t.isPinned } : t
    );
    setQuickThoughts(updated);
    StorageService.saveQuickThoughts(updated);
  };

  // Focus timer completed callback
  const handleLogFocusSession = (minutes: number, topic: string) => {
    setGateStudyMinutesToday((prev) => prev + minutes);
    // Add task log or update subject
    const autoTask: TaskItem = {
      id: 'session-' + Date.now(),
      title: `Completed Deep Work Session: ${topic}`,
      pillar: 'gate',
      category: 'Deep Focus',
      priority: 'medium',
      completed: true,
      status: 'completed',
      date: currentDate,
      estimatedMinutes: minutes,
      subtasks: [],
      notes: `Focus stopwatch logged ${minutes} minutes of dedicated problem-solving.`,
      createdAt: Date.now()
    };
    const updated = [autoTask, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  // Quick stats for current date
  const todayTasks = tasks.filter((t) => t.date === currentDate || t.repeatDaily);
  const completedTodayTasks = todayTasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans-body">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTask={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onOpenJapaModal={() => setIsJapaModalOpen(true)}
        onOpenTimerModal={() => setIsFocusTimerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        currentJapaRounds={currentSadhanaLog.japaRounds}
        japaTarget={settings.japaDailyTarget}
      />

      {/* Main App Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Hero Banner */}
        <HeroBanner
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          sadhanaLog={currentSadhanaLog}
          totalTasksToday={todayTasks.length}
          completedTasksToday={completedTodayTasks.length}
          gateStudyMinutesToday={gateStudyMinutesToday}
          pyqsToday={pyqsSolvedToday}
          userSettings={settings}
          onOpenJapaModal={() => setIsJapaModalOpen(true)}
          onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
        />

        {/* Tab 1: Dashboard View (The Unified Command Center) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Bhagavad Gita Sloka of the Day */}
            <SlokaCard />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Today's Priority Action Plan (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <TodoList
                  tasks={tasks}
                  currentDate={currentDate}
                  onToggleTask={handleToggleTask}
                  onToggleSubtask={handleToggleSubtask}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={(task) => handleSaveTask(task)}
                  onEditTask={(task) => {
                    setEditingTask(task);
                    setIsTaskModalOpen(true);
                  }}
                  onOpenNewTaskModal={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                />
              </div>

              {/* Right Column: 3 Pillar Quick Actions & Health Watchdogs (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Visual Task Completion & Productivity Pulse Circular Progress */}
                <TaskCircularProgress
                  tasks={tasks}
                  currentDate={currentDate}
                  onOpenNewTaskModal={() => {
                    setEditingTask(null);
                    setIsTaskModalOpen(true);
                  }}
                />

                {/* 1. Quick Sādhana Card */}
                <div className="bg-stone-900/60 border border-amber-900/40 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-amber-400" />
                      <h3 className="text-sm font-semibold text-stone-200">
                        Sādhana Quick Tracker
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('sadhana')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                    >
                      <span>Open Station</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Japa count row */}
                  <div className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div>
                      <span className="text-xs text-stone-400 block">Japa Rounds</span>
                      <span className="font-mono-tabular text-xl font-bold text-amber-300">
                        {currentSadhanaLog.japaRounds} / {settings.japaDailyTarget}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          handleUpdateSadhana({ japaRounds: Math.max(0, currentSadhanaLog.japaRounds - 1) });
                          sound.playBeadClick();
                        }}
                        className="px-2.5 py-1 text-xs bg-stone-900 border border-stone-800 text-stone-400 hover:text-white rounded"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => {
                          handleUpdateSadhana({ japaRounds: currentSadhanaLog.japaRounds + 1 });
                          sound.playTempleBell();
                        }}
                        className="px-3 py-1 text-xs bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 rounded font-medium"
                      >
                        +1 Round
                      </button>
                      <button
                        onClick={() => setIsJapaModalOpen(true)}
                        className="p-1 text-amber-400 hover:text-amber-300"
                        title="Open Bead Counter"
                      >
                        <CircleDot className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Regulative Principles Micro Check */}
                  <div>
                    <span className="text-[11px] text-stone-400 block mb-1.5">
                      4 Regulative Principles Today:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { key: 'noMeatFishEgg' as const, label: 'Ahimsā (No Meat)' },
                        { key: 'noGambling' as const, label: 'Satyam (No Gamble)' },
                        { key: 'noIntoxication' as const, label: 'Tapasya (No Tea/Alcohol)' },
                        { key: 'noIllicitSex' as const, label: 'Śaucam (Celibacy)' }
                      ].map(({ key, label }) => {
                        const val = currentSadhanaLog.regulativePrinciples[key];
                        return (
                          <div
                            key={key}
                            onClick={() => {
                              const updated = {
                                ...currentSadhanaLog.regulativePrinciples,
                                [key]: !val
                              };
                              handleUpdateSadhana({ regulativePrinciples: updated });
                              sound.playBeadClick();
                            }}
                            className={`p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                              val
                                ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                                : 'bg-stone-950 border-stone-800 text-stone-500'
                            }`}
                          >
                            <span className="text-[11px] font-medium">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. GATE Study Focus Widget */}
                <div className="bg-stone-900/60 border border-sky-900/40 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-sky-400" />
                      <h3 className="text-sm font-semibold text-stone-200">
                        GATE Daily Target
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('gate')}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                    >
                      <span>Syllabus Matrix</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div>
                      <span className="text-xs text-stone-400 block">Today's Deep Work</span>
                      <span className="font-mono-tabular text-xl font-bold text-sky-300">
                        {(gateStudyMinutesToday / 60).toFixed(1)} / {settings.dailyGateTargetHours} hrs
                      </span>
                    </div>

                    <button
                      onClick={() => setIsFocusTimerOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 border border-sky-500/40 hover:bg-sky-500/30 text-sky-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Timer className="h-3.5 w-3.5" />
                      <span>Start Pomodoro</span>
                    </button>
                  </div>

                  <div className="text-xs text-stone-400 flex items-center justify-between">
                    <span>PYQs solved today: <strong className="text-stone-200 font-mono-tabular">{pyqsSolvedToday}</strong></span>
                    <button
                      onClick={() => {
                        setPyqsSolvedToday((prev) => prev + 5);
                        sound.playBeadClick();
                      }}
                      className="text-sky-400 hover:underline"
                    >
                      +5 PYQs
                    </button>
                  </div>
                </div>

                {/* 3. College Attendance Watchdog Card */}
                <div className="bg-stone-900/60 border border-emerald-900/40 rounded-2xl p-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-emerald-400" />
                      <h3 className="text-sm font-semibold text-stone-200">
                        College Attendance Health
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('college')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      <span>All Courses</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {collegeCourses.slice(0, 3).map((c) => {
                      const p = ((c.attended / (c.total || 1)) * 100).toFixed(1);
                      const isSafe = parseFloat(p) >= (c.targetPercent || 75);

                      return (
                        <div
                          key={c.id}
                          className="flex items-center justify-between text-xs p-2 bg-stone-950/70 border border-stone-800 rounded-lg"
                        >
                          <span className="text-stone-300 font-medium truncate max-w-[140px]">
                            {c.code}: {c.name.split(' ')[0]}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className={`font-mono-tabular font-semibold ${
                              isSafe ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {p}%
                            </span>
                            {isSafe ? (
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Thoughts & Realizations Section */}
            <QuickThoughts
              thoughts={quickThoughts}
              onSaveThought={handleSaveQuickThought}
              onDeleteThought={handleDeleteQuickThought}
              onTogglePin={handleTogglePinQuickThought}
              onConvertToTask={(task) => handleSaveTask(task)}
              currentDate={currentDate}
            />
          </div>
        )}

        {/* Tab 2: To-Dos View */}
        {activeTab === 'todos' && (
          <div className="max-w-4xl mx-auto">
            <TodoList
              tasks={tasks}
              currentDate={currentDate}
              onToggleTask={handleToggleTask}
              onToggleSubtask={handleToggleSubtask}
              onDeleteTask={handleDeleteTask}
              onAddTask={(task) => handleSaveTask(task)}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onOpenNewTaskModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab 3: Sādhana Hub */}
        {activeTab === 'sadhana' && (
          <SadhanaTracker
            sadhanaLog={currentSadhanaLog}
            onUpdateSadhana={handleUpdateSadhana}
            onOpenJapaModal={() => setIsJapaModalOpen(true)}
          />
        )}

        {/* Tab 4: GATE Preparation Hub */}
        {activeTab === 'gate' && (
          <GateTracker
            subjects={gateSubjects}
            mocks={gateMocks}
            onUpdateSubjects={handleUpdateGateSubjects}
            onAddMock={handleAddMock}
            onDeleteMock={handleDeleteMock}
            onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
            gateStudyMinutesToday={gateStudyMinutesToday}
            pyqsSolvedToday={pyqsSolvedToday}
            onUpdateDailyGate={(mins, pyqs) => {
              setGateStudyMinutesToday(mins);
              setPyqsSolvedToday(pyqs);
            }}
            userSettings={settings}
          />
        )}

        {/* Tab 5: College Attendance */}
        {activeTab === 'college' && (
          <CollegeTracker
            courses={collegeCourses}
            onUpdateCourses={handleUpdateCollegeCourses}
            userSettings={settings}
          />
        )}

        {/* Tab 6: Weekly Consistency & Habits */}
        {activeTab === 'weekly' && (
          <WeeklyReview
            currentDate={currentDate}
            sadhanaLogs={sadhanaLogs}
            tasks={tasks}
            userSettings={settings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-stone-950 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Sādhana & Vidyā · Dedicated to Sri Sri Radha Krishna & Disciplined Aspirants
          </p>
          <p className="font-mono-tabular">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare · Hare Rama Hare Rama Rama Rama Hare Hare
          </p>
        </div>
      </footer>

      {/* Modals */}
      <JapaMalaModal
        isOpen={isJapaModalOpen}
        onClose={() => setIsJapaModalOpen(false)}
        currentRounds={currentSadhanaLog.japaRounds}
        japaTarget={settings.japaDailyTarget}
        onUpdateRounds={(newRounds) => handleUpdateSadhana({ japaRounds: newRounds })}
      />

      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        onLogCompletedSession={handleLogFocusSession}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        currentDate={currentDate}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onDataReload={handleReloadData}
      />
    </div>
  );
}
