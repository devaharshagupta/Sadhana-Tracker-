import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, Flame, Target, BookOpen } from 'lucide-react';
import { Pillar, Priority, TaskItem } from '../types';
import { sound } from '../utils/audio';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<TaskItem, 'id' | 'createdAt'>, existingId?: string) => void;
  initialTask?: TaskItem | null;
  currentDate: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  currentDate
}) => {
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState<Pillar>('gate');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [dueTime, setDueTime] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [notes, setNotes] = useState('');
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setPillar(initialTask.pillar);
      setCategory(initialTask.category);
      setPriority(initialTask.priority);
      setDueTime(initialTask.dueTime || '');
      setEstimatedMinutes(initialTask.estimatedMinutes || 45);
      setNotes(initialTask.notes || '');
      setRepeatDaily(initialTask.repeatDaily || false);
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle('');
      setPillar('gate');
      setCategory('');
      setPriority('high');
      setDueTime('');
      setEstimatedMinutes(45);
      setNotes('');
      setRepeatDaily(false);
      setSubtasks([]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'st-' + Date.now(), title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
    sound.playBeadClick();
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(
      {
        title: title.trim(),
        pillar,
        category: category.trim() || (pillar === 'sadhana' ? 'Sādhana' : pillar === 'gate' ? 'GATE Prep' : 'College'),
        priority,
        completed: initialTask ? initialTask.completed : false,
        status: initialTask ? initialTask.status : 'pending',
        date: currentDate,
        dueTime: dueTime || undefined,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        notes: notes.trim() || undefined,
        subtasks,
        repeatDaily
      },
      initialTask?.id
    );

    sound.playTempleBell();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900 p-6 md:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <h2 className="text-lg font-bold text-white">
            {initialTask ? 'Edit Task' : 'Create New Priority Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs text-stone-400 block mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Solve 30 PYQs on Paging & Virtual Memory"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Pillar Selector */}
          <div>
            <label className="text-xs text-stone-400 block mb-1.5">Pillar Category</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPillar('sadhana')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  pillar === 'sadhana'
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>Sādhana</span>
              </button>

              <button
                type="button"
                onClick={() => setPillar('gate')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  pillar === 'gate'
                    ? 'bg-sky-950/60 border-sky-500/50 text-sky-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                <span>GATE</span>
              </button>

              <button
                type="button"
                onClick={() => setPillar('college')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  pillar === 'college'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>College</span>
              </button>
            </div>
          </div>

          {/* Category Tag & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 block mb-1">Subject / Subtopic</label>
              <input
                type="text"
                placeholder="e.g. Operating Systems / Japa"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 block mb-1">Target Time (Optional)</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">Est. Duration (Minutes)</label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 30)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Repeat Daily Toggle */}
          <div className="flex items-center gap-2 p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl cursor-pointer" onClick={() => setRepeatDaily(!repeatDaily)}>
            <input
              type="checkbox"
              checked={repeatDaily}
              onChange={(e) => setRepeatDaily(e.target.checked)}
              className="rounded border-stone-700 bg-stone-900 text-amber-500"
            />
            <span className="text-xs text-stone-300">
              Repeat daily vow (e.g. 16 Rounds Japa, Morning Brahma Muhurta)
            </span>
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-xs text-stone-400 block mb-1">Subtasks / Checklist</label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 pl-1 max-h-32 overflow-y-auto">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center justify-between text-xs text-stone-300 bg-stone-950/40 p-2 rounded-lg border border-stone-800">
                    <span>{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-stone-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-stone-400 block mb-1">Notes & Key Formulas / References</label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on edge conditions, check notes on textbook page 142..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-colors"
            >
              {initialTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
