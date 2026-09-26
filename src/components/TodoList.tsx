import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Repeat, 
  Search,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  Flame,
  Target,
  BookOpen,
  Edit2
} from 'lucide-react';
import { Pillar, Priority, TaskItem } from '../types';
import { sound } from '../utils/audio';
import { CircularProgressRing } from './TaskCircularProgress';

interface TodoListProps {
  tasks: TaskItem[];
  currentDate: string;
  onToggleTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  onEditTask: (task: TaskItem) => void;
  onOpenNewTaskModal: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  tasks,
  currentDate,
  onToggleTask,
  onToggleSubtask,
  onDeleteTask,
  onAddTask,
  onEditTask,
  onOpenNewTaskModal
}) => {
  const [filterPillar, setFilterPillar] = useState<'all' | Pillar>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Quick inline task input
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPillar, setQuickPillar] = useState<Pillar>('gate');
  const [quickPriority, setQuickPriority] = useState<Priority>('high');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle.trim(),
      pillar: quickPillar,
      category: quickPillar === 'sadhana' ? 'Sadhana' : quickPillar === 'gate' ? 'GATE Prep' : 'College',
      priority: quickPriority,
      completed: false,
      status: 'pending',
      date: currentDate,
      estimatedMinutes: 45,
      subtasks: [],
      repeatDaily: false
    });

    setQuickTitle('');
    sound.playBeadClick();
  };

  // Filter tasks for current date (or repeatDaily tasks)
  const filteredTasks = tasks.filter((t) => {
    // Date match or repeat daily
    const dateMatch = t.date === currentDate || t.repeatDaily;
    if (!dateMatch) return false;

    // Pillar filter
    if (filterPillar !== 'all' && t.pillar !== filterPillar) return false;

    // Status filter
    if (filterStatus === 'active' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchCat = t.category?.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchNotes) return false;
    }

    return true;
  });

  // Calculate today's overall task metrics for the progress ring
  const todayTasksAll = tasks.filter((t) => t.date === currentDate || t.repeatDaily);
  const todayTasksCompleted = todayTasksAll.filter((t) => t.completed).length;
  const todayTasksTotal = todayTasksAll.length;
  const todayCompletionRate = todayTasksTotal > 0 ? Math.round((todayTasksCompleted / todayTasksTotal) * 100) : 0;

  const getPillarColor = (pillar: Pillar) => {
    switch (pillar) {
      case 'sadhana':
        return 'text-amber-400';
      case 'gate':
        return 'text-sky-400';
      case 'college':
        return 'text-emerald-400';
    }
  };

  const getPillarLabel = (pillar: Pillar) => {
    switch (pillar) {
      case 'sadhana':
        return 'Sādhana';
      case 'gate':
        return 'GATE';
      case 'college':
        return 'College';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'text-rose-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-stone-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <CircularProgressRing
            percentage={todayCompletionRate}
            completedCount={todayTasksCompleted}
            totalCount={todayTasksTotal}
            size={48}
            strokeWidth={5}
            showSubtext={false}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-bold text-white">
                Daily Action & Sādhana Plan
              </h2>
              <span className="font-mono-tabular text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {todayTasksCompleted}/{todayTasksTotal} ({todayCompletionRate}%)
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Harmonizing spiritual discipline, GATE targets, and college obligations
            </p>
          </div>
        </div>

        {/* Filter Tab controls */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-lg">
          <button
            onClick={() => setFilterPillar('all')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              filterPillar === 'all'
                ? 'bg-stone-800 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All Pillars
          </button>
          <button
            onClick={() => setFilterPillar('sadhana')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
              filterPillar === 'sadhana'
                ? 'bg-amber-950/60 border border-amber-800/40 text-amber-300'
                : 'text-stone-400 hover:text-amber-300'
            }`}
          >
            <Flame className="h-3 w-3" />
            <span>Sādhana</span>
          </button>
          <button
            onClick={() => setFilterPillar('gate')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
              filterPillar === 'gate'
                ? 'bg-sky-950/60 border border-sky-800/40 text-sky-300'
                : 'text-stone-400 hover:text-sky-300'
            }`}
          >
            <Target className="h-3 w-3" />
            <span>GATE</span>
          </button>
          <button
            onClick={() => setFilterPillar('college')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap ${
              filterPillar === 'college'
                ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-300'
                : 'text-stone-400 hover:text-emerald-300'
            }`}
          >
            <BookOpen className="h-3 w-3" />
            <span>College</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-500" />
          <input
            type="text"
            placeholder="Search tasks, formulas, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1 p-0.5 bg-stone-900 border border-stone-800 rounded-md">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded ${
                filterStatus === 'all' ? 'bg-stone-800 text-stone-100' : 'text-stone-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded ${
                filterStatus === 'active' ? 'bg-stone-800 text-stone-100' : 'text-stone-400'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded ${
                filterStatus === 'completed' ? 'bg-stone-800 text-stone-100' : 'text-stone-400'
              }`}
            >
              Done
            </button>
          </div>

          <button
            onClick={onOpenNewTaskModal}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Detailed Task</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-stone-900/60 border border-stone-800 rounded-xl"
      >
        <input
          type="text"
          placeholder="Quick add: e.g. Solve 20 PYQs on Graph Theory, Read 5 slokas..."
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
        />

        <div className="flex items-center gap-2 justify-between sm:justify-start">
          <select
            value={quickPillar}
            onChange={(e) => setQuickPillar(e.target.value as Pillar)}
            className="bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
          >
            <option value="sadhana">Sādhana</option>
            <option value="gate">GATE</option>
            <option value="college">College</option>
          </select>

          <select
            value={quickPriority}
            onChange={(e) => setQuickPriority(e.target.value as Priority)}
            className="bg-stone-900 border border-stone-800 rounded-lg px-2 py-1 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1 text-xs font-medium bg-amber-400 text-stone-950 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </form>

      {/* Task List Items */}
      <div className="space-y-2 pt-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-800 rounded-xl p-6 bg-stone-900/20">
            <CheckSquare className="h-8 w-8 text-stone-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-400">No tasks found for this view</p>
            <p className="text-xs text-stone-500 mt-1">
              Add your daily Sādhana, GATE targets, or college assignments above.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isExpanded = expandedTaskId === task.id;
            const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

            return (
              <div
                key={task.id}
                className={`group border transition-all rounded-xl p-3.5 bg-stone-900/40 hover:bg-stone-900/70 ${
                  task.completed
                    ? 'border-stone-800/50 opacity-70'
                    : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Completion Checkbox */}
                  <button
                    onClick={() => {
                      onToggleTask(task.id);
                      if (!task.completed) {
                        sound.playTempleBell();
                      } else {
                        sound.playBeadClick();
                      }
                    }}
                    className="mt-0.5 text-stone-500 hover:text-amber-400 transition-colors flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-stone-600 group-hover:text-stone-400" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-medium leading-snug transition-all ${
                          task.completed
                            ? 'line-through text-stone-500'
                            : 'text-stone-100'
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 flex-shrink-0">
                        <button
                          onClick={() => onEditTask(task)}
                          className="p-1 text-stone-500 hover:text-stone-200 transition-colors rounded"
                          title="Edit Task"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-stone-500 hover:text-rose-400 transition-colors rounded"
                          title="Delete Task"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Unboxed Metadata Line conforming to Zero-Pill Constitution */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-400 mt-1.5 font-sans-body">
                      {/* Pillar text */}
                      <span className={`font-semibold ${getPillarColor(task.pillar)}`}>
                        {getPillarLabel(task.pillar)}
                      </span>
                      <span aria-hidden="true" className="text-stone-600">·</span>

                      {/* Category */}
                      <span>{task.category || 'General'}</span>
                      <span aria-hidden="true" className="text-stone-600">·</span>

                      {/* Priority unboxed */}
                      <span className={`capitalize font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority} Priority
                      </span>

                      {task.dueTime && (
                        <>
                          <span aria-hidden="true" className="text-stone-600">·</span>
                          <span className="flex items-center gap-1 font-mono-tabular">
                            <Clock className="h-3 w-3 text-stone-500" />
                            {task.dueTime}
                          </span>
                        </>
                      )}

                      {task.estimatedMinutes && (
                        <>
                          <span aria-hidden="true" className="text-stone-600">·</span>
                          <span className="font-mono-tabular">{task.estimatedMinutes} min</span>
                        </>
                      )}

                      {task.repeatDaily && (
                        <>
                          <span aria-hidden="true" className="text-stone-600">·</span>
                          <span className="flex items-center gap-1 text-amber-300/80">
                            <Repeat className="h-3 w-3" />
                            Daily Vow
                          </span>
                        </>
                      )}

                      {task.subtasks.length > 0 && (
                        <>
                          <span aria-hidden="true" className="text-stone-600">·</span>
                          <button
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            className="font-mono-tabular text-amber-300/90 hover:underline flex items-center gap-0.5"
                          >
                            <span>Subtasks ({completedSubtasks}/{task.subtasks.length})</span>
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Notes if present */}
                    {task.notes && (
                      <p className="text-xs text-stone-400/90 mt-1.5 bg-stone-950/40 p-2 rounded border border-stone-800/60">
                        {task.notes}
                      </p>
                    )}

                    {/* Subtasks expander */}
                    {isExpanded && task.subtasks.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-stone-800/80 space-y-1.5 pl-2">
                        {task.subtasks.map((st) => (
                          <div
                            key={st.id}
                            onClick={() => {
                              onToggleSubtask(task.id, st.id);
                              sound.playBeadClick();
                            }}
                            className="flex items-center gap-2 text-xs text-stone-300 hover:text-stone-100 cursor-pointer select-none"
                          >
                            {st.completed ? (
                              <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Square className="h-3.5 w-3.5 text-stone-600" />
                            )}
                            <span className={st.completed ? 'line-through text-stone-500' : ''}>
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
