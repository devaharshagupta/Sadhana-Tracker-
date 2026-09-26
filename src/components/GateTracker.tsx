import React, { useState } from 'react';
import { 
  Target, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Plus, 
  TrendingUp, 
  AlertCircle, 
  Award,
  Timer,
  FileText,
  BarChart3,
  Edit2
} from 'lucide-react';
import { GateMockTest, GateSubject, UserSettings } from '../types';
import { sound } from '../utils/audio';

interface GateTrackerProps {
  subjects: GateSubject[];
  mocks: GateMockTest[];
  onUpdateSubjects: (subjects: GateSubject[]) => void;
  onAddMock: (mock: GateMockTest) => void;
  onDeleteMock: (id: string) => void;
  onOpenFocusTimer: () => void;
  gateStudyMinutesToday: number;
  pyqsSolvedToday: number;
  onUpdateDailyGate: (minutes: number, pyqs: number) => void;
  userSettings: UserSettings;
}

export const GateTracker: React.FC<GateTrackerProps> = ({
  subjects,
  mocks,
  onUpdateSubjects,
  onAddMock,
  onDeleteMock,
  onOpenFocusTimer,
  gateStudyMinutesToday,
  pyqsSolvedToday,
  onUpdateDailyGate,
  userSettings
}) => {
  // New Mock Test form state
  const [showAddMock, setShowAddMock] = useState(false);
  const [mockTitle, setMockTitle] = useState('');
  const [mockSubject, setMockSubject] = useState('Full Syllabus');
  const [mockScore, setMockScore] = useState('');
  const [mockMaxScore, setMockMaxScore] = useState('100');
  const [mockAccuracy, setMockAccuracy] = useState('85');
  const [mockLearnings, setMockLearnings] = useState('');

  // Editing subject modal state
  const [editingSubject, setEditingSubject] = useState<GateSubject | null>(null);

  const handleSaveMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockTitle.trim() || !mockScore) return;

    const newMock: GateMockTest = {
      id: 'mock-' + Date.now(),
      title: mockTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      score: parseFloat(mockScore) || 0,
      maxScore: parseFloat(mockMaxScore) || 100,
      accuracyPercent: parseFloat(mockAccuracy) || 80,
      mistakesAndLearnings: mockLearnings.trim() || 'Reviewed questions and marked key traps.',
      subjectOrFull: mockSubject
    };

    onAddMock(newMock);
    setShowAddMock(false);
    setMockTitle('');
    setMockScore('');
    setMockLearnings('');
    sound.playTempleBell();
  };

  const handleUpdateSubjectProgress = (id: string, deltaPercent: number) => {
    const updated = subjects.map((sub) => {
      if (sub.id === id) {
        const nextPercent = Math.min(100, Math.max(0, sub.progressPercent + deltaPercent));
        let nextStatus = sub.revisionStatus;
        if (nextPercent >= 90) nextStatus = 'Mastered';
        else if (nextPercent >= 70) nextStatus = 'R2 Done';
        else if (nextPercent >= 50) nextStatus = 'R1 Done';
        else if (nextPercent > 0) nextStatus = 'In Progress';
        return { ...sub, progressPercent: nextPercent, revisionStatus: nextStatus };
      }
      return sub;
    });
    onUpdateSubjects(updated);
    sound.playBeadClick();
  };

  const handleIncrementPyq = (id: string, delta: number) => {
    const updated = subjects.map((sub) => {
      if (sub.id === id) {
        return { ...sub, pyqsSolved: Math.max(0, sub.pyqsSolved + delta) };
      }
      return sub;
    });
    onUpdateSubjects(updated);
    onUpdateDailyGate(gateStudyMinutesToday, Math.max(0, pyqsSolvedToday + delta));
    sound.playBeadClick();
  };

  // High-level statistics
  const totalWeightage = subjects.reduce((acc, s) => acc + s.weightage, 0);
  const weightedCompletion = subjects.reduce((acc, s) => acc + (s.progressPercent * s.weightage), 0) / (totalWeightage || 1);
  const totalPyqsSolved = subjects.reduce((acc, s) => acc + s.pyqsSolved, 0);
  const totalPyqsTarget = subjects.reduce((acc, s) => acc + s.pyqTarget, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-sky-500/10 text-sky-400">
              <Target className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-display font-bold text-white">
              GATE Engineering Preparation Hub
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Target: {userSettings.gateTargetBranch} · Daily Target: {userSettings.dailyGateTargetHours} hrs · Spaced Revisions & PYQs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFocusTimer}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-sky-500/15 border border-sky-500/30 hover:bg-sky-500/25 text-sky-300 rounded-xl transition-all"
          >
            <Timer className="h-4 w-4" />
            <span>Pomodoro Deep Study</span>
          </button>
          <button
            onClick={() => setShowAddMock(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 rounded-xl transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Log Mock Test</span>
          </button>
        </div>
      </div>

      {/* Daily Study & Target Snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Syllabus Progress */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <span className="text-[11px] text-stone-400 block font-medium">Weighted Syllabus Ready</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-sky-300">
              {Math.round(weightedCompletion)}%
            </span>
            <span className="text-xs text-stone-500">of 100 marks</span>
          </div>
          <div className="w-full bg-stone-950 rounded-full h-1.5 mt-2 border border-stone-800 overflow-hidden">
            <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${weightedCompletion}%` }} />
          </div>
        </div>

        {/* Total PYQs Solved */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <span className="text-[11px] text-stone-400 block font-medium">Total PYQs Mastered</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-amber-300">
              {totalPyqsSolved}
            </span>
            <span className="text-xs text-stone-500">/ {totalPyqsTarget} goal</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            +{pyqsSolvedToday} solved today
          </p>
        </div>

        {/* Today's Study Time */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <span className="text-[11px] text-stone-400 block font-medium">Today's Deep Work Hours</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-emerald-300">
              {(gateStudyMinutesToday / 60).toFixed(1)}h
            </span>
            <span className="text-xs text-stone-500">/ {userSettings.dailyGateTargetHours}h target</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <input
              type="number"
              min="0"
              step="15"
              value={gateStudyMinutesToday}
              onChange={(e) => onUpdateDailyGate(parseInt(e.target.value) || 0, pyqsSolvedToday)}
              className="w-16 bg-stone-950 border border-stone-800 rounded px-1.5 py-0.5 text-center text-xs text-stone-200"
            />
            <span className="text-xs text-stone-500">adjust mins</span>
          </div>
        </div>

        {/* Mock Tests Given */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <span className="text-[11px] text-stone-400 block font-medium">Mocks & Sectionals Taken</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono-tabular text-stone-100">
              {mocks.length}
            </span>
            <span className="text-xs text-stone-500">tests logged</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            Average accuracy: {mocks.length > 0 ? Math.round(mocks.reduce((a, m) => a + m.accuracyPercent, 0) / mocks.length) : 0}%
          </p>
        </div>
      </div>

      {/* Subject-Wise Syllabus Matrix */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-100">
              Syllabus Matrix & Spaced Revision Cycles
            </h3>
            <p className="text-xs text-stone-400">
              Track concept completion, PYQs solved, and revision stages (R1, R2, Mastered)
            </p>
          </div>
          <span className="text-xs text-stone-400 font-mono-tabular">
            {subjects.length} Core Subjects
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400">
                <th className="py-2.5 px-3 font-semibold">Subject</th>
                <th className="py-2.5 px-3 font-semibold text-center">Marks</th>
                <th className="py-2.5 px-3 font-semibold">Progress</th>
                <th className="py-2.5 px-3 font-semibold text-center">PYQs Solved</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {subjects.map((sub) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'Mastered': return 'text-emerald-400 font-semibold';
                    case 'R2 Done': return 'text-sky-400';
                    case 'R1 Done': return 'text-amber-400';
                    case 'In Progress': return 'text-stone-300';
                    default: return 'text-stone-500';
                  }
                };

                return (
                  <tr key={sub.id} className="hover:bg-stone-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-200">{sub.name}</div>
                      <div className="text-[11px] text-stone-400 truncate max-w-xs">{sub.notes}</div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono-tabular text-stone-300">
                      ~{sub.weightage}M
                    </td>

                    <td className="py-3 px-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-stone-950 rounded-full h-1.5 border border-stone-800 overflow-hidden">
                          <div
                            className="bg-sky-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${sub.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono-tabular text-[11px] text-stone-300 w-8">
                          {sub.progressPercent}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono-tabular">
                      <span className="text-stone-200">{sub.pyqsSolved}</span>
                      <span className="text-stone-500"> / {sub.pyqTarget}</span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`text-xs ${getStatusColor(sub.revisionStatus)}`}>
                        {sub.revisionStatus}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleIncrementPyq(sub.id, 5)}
                          title="Add 5 PYQs solved"
                          className="px-2 py-0.5 text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-mono-tabular"
                        >
                          +5 PYQ
                        </button>
                        <button
                          onClick={() => handleUpdateSubjectProgress(sub.id, 5)}
                          title="Increase progress by 5%"
                          className="px-2 py-0.5 text-[11px] bg-sky-950/60 border border-sky-800/50 hover:bg-sky-900/60 text-sky-300 rounded font-mono-tabular"
                        >
                          +5%
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mock Tests & Mistake / Error Notebook */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-100 flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span>GATE Error Notebook & Mock Test Log</span>
            </h3>
            <p className="text-xs text-stone-400">
              The secret to a top 100 rank is systematically eliminating recurring mistakes.
            </p>
          </div>

          <button
            onClick={() => setShowAddMock(true)}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            + Add Test Entry
          </button>
        </div>

        {mocks.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-stone-800 rounded-xl text-stone-400 text-xs">
            No mock tests logged yet. Take a sectional test and record your learnings!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mocks.map((m) => (
              <div
                key={m.id}
                className="bg-stone-950/70 border border-stone-800 rounded-xl p-4 space-y-2 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">{m.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                      <span>{m.subjectOrFull}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">{m.date}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono-tabular text-base font-bold text-sky-300">
                      {m.score}
                    </span>
                    <span className="font-mono-tabular text-xs text-stone-500"> / {m.maxScore}</span>
                    <div className="text-[10px] text-stone-400 font-mono-tabular">
                      {m.accuracyPercent}% Accuracy
                    </div>
                  </div>
                </div>

                <div className="bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80 text-xs text-stone-300 leading-relaxed">
                  <span className="text-amber-400 font-medium block text-[11px] mb-0.5">
                    Mistakes Analysis & Trap Warnings:
                  </span>
                  {m.mistakesAndLearnings}
                </div>

                <button
                  onClick={() => onDeleteMock(m.id)}
                  className="text-[11px] text-stone-600 hover:text-rose-400 transition-colors self-end"
                >
                  Delete Log
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Mock Test Modal */}
      {showAddMock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Log Mock Test & Mistake Analysis</h3>
            
            <form onSubmit={handleSaveMock} className="space-y-3">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Made Easy Sectional: Linear Algebra + Calculus"
                  value={mockTitle}
                  onChange={(e) => setMockTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Subject / Coverage</label>
                  <input
                    type="text"
                    value={mockSubject}
                    onChange={(e) => setMockSubject(e.target.value)}
                    placeholder="Full Syllabus / TOC / OS"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Score Obtained</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.33"
                      required
                      placeholder="e.g. 52.33"
                      value={mockScore}
                      onChange={(e) => setMockScore(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-sky-500"
                    />
                    <span className="text-xs text-stone-500">/ 100</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Accuracy %</label>
                <input
                  type="number"
                  placeholder="e.g. 85"
                  value={mockAccuracy}
                  onChange={(e) => setMockAccuracy(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">
                  Mistakes, Traps & Lessons (What went wrong?):
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Did not notice negative cycle in Bellman-Ford question; missed formula for eigenvalues trace property..."
                  value={mockLearnings}
                  onChange={(e) => setMockLearnings(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMock(false)}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-stone-950 rounded-lg transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
