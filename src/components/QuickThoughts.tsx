import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Target, 
  BookOpen, 
  Lightbulb, 
  Pin, 
  Trash2, 
  Copy, 
  Check, 
  PlusCircle, 
  Search, 
  Edit3, 
  X, 
  CornerDownLeft,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { QuickThought, QuickThoughtCategory, Pillar, TaskItem } from '../types';
import { sound } from '../utils/audio';

interface QuickThoughtsProps {
  thoughts: QuickThought[];
  onSaveThought: (thought: Omit<QuickThought, 'id' | 'createdAt'>, existingId?: string) => void;
  onDeleteThought: (id: string) => void;
  onTogglePin: (id: string) => void;
  onConvertToTask?: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  currentDate: string;
}

export const QuickThoughts: React.FC<QuickThoughtsProps> = ({
  thoughts,
  onSaveThought,
  onDeleteThought,
  onTogglePin,
  onConvertToTask,
  currentDate
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuickThoughtCategory>('realization');
  const [isInputPinned, setIsInputPinned] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingCategory, setEditingCategory] = useState<QuickThoughtCategory>('realization');

  // Copy status feedback per thought
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [convertedId, setConvertedId] = useState<string | null>(null);

  const categoryMeta: Record<QuickThoughtCategory, { label: string; icon: React.FC<{ className?: string }>; color: string; badge: string; pillar: Pillar }> = {
    realization: {
      label: 'Realization',
      icon: Flame,
      color: 'text-amber-400',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      pillar: 'sadhana'
    },
    gate: {
      label: 'GATE Insight',
      icon: Target,
      color: 'text-sky-400',
      badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      pillar: 'gate'
    },
    college: {
      label: 'College Note',
      icon: BookOpen,
      color: 'text-emerald-400',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      pillar: 'college'
    },
    general: {
      label: 'General Thought',
      icon: Lightbulb,
      color: 'text-stone-300',
      badge: 'bg-stone-800 text-stone-300 border-stone-700',
      pillar: 'sadhana'
    }
  };

  const handleAddThought = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSaveThought({
      content: inputText.trim(),
      category: selectedCategory,
      isPinned: isInputPinned
    });

    setInputText('');
    setIsInputPinned(false);
    sound.playBeadClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleAddThought();
    }
  };

  const handleStartEdit = (thought: QuickThought) => {
    setEditingId(thought.id);
    setEditingText(thought.content);
    setEditingCategory(thought.category);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    onSaveThought(
      {
        content: editingText.trim(),
        category: editingCategory,
        updatedAt: Date.now()
      },
      id
    );
    setEditingId(null);
    sound.playBeadClick();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleCopy = (thought: QuickThought) => {
    navigator.clipboard.writeText(thought.content);
    setCopiedId(thought.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleConvert = (thought: QuickThought) => {
    if (!onConvertToTask) return;
    const meta = categoryMeta[thought.category];
    
    onConvertToTask({
      title: thought.content.length > 90 ? thought.content.substring(0, 87) + '...' : thought.content,
      pillar: meta.pillar,
      category: meta.label,
      priority: thought.isPinned ? 'high' : 'medium',
      completed: false,
      status: 'pending',
      date: currentDate,
      estimatedMinutes: 30,
      notes: `Captured from Quick Thoughts: "${thought.content}"`,
      subtasks: []
    });

    setConvertedId(thought.id);
    sound.playTempleBell();
    setTimeout(() => {
      setConvertedId(null);
    }, 3000);
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Filter & Search logic
  const filteredThoughts = thoughts
    .filter((t) => {
      // Category filter
      if (filterCategory === 'pinned' && !t.isPinned) return false;
      if (filterCategory !== 'all' && filterCategory !== 'pinned' && t.category !== filterCategory) return false;
      
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return t.content.toLowerCase().includes(query) || t.category.toLowerCase().includes(query);
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned first, then newest first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });

  const pinnedCount = thoughts.filter((t) => t.isPinned).length;

  return (
    <section className="bg-stone-900/60 border border-stone-800 hover:border-stone-700/80 transition-colors rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide">
                Quick Thoughts & Realizations
              </h2>
              <span className="font-mono-tabular text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                {thoughts.length} {thoughts.length === 1 ? 'Note' : 'Notes'}
              </span>
              {pinnedCount > 0 && (
                <span className="font-mono-tabular text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Pin className="h-3 w-3 fill-amber-300" />
                  <span>{pinnedCount}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Jot down transient epiphanies, Japa realizations, formulas, or sudden reminders to persist in local storage
            </p>
          </div>
        </div>

        {/* Quick Inspiration Starters */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] text-stone-500 mr-1 hidden md:inline">Quick template:</span>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('realization');
              setInputText('Realization during chanting: ');
            }}
            className="text-[11px] px-2 py-1 rounded-lg bg-stone-950 border border-stone-800 text-amber-300/80 hover:text-amber-200 hover:border-amber-500/40 transition-colors"
          >
            🪷 Realization
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('gate');
              setInputText('Formula / Concept: ');
            }}
            className="text-[11px] px-2 py-1 rounded-lg bg-stone-950 border border-stone-800 text-sky-300/80 hover:text-sky-200 hover:border-sky-500/40 transition-colors"
          >
            🎯 GATE Concept
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('college');
              setInputText('College note: ');
            }}
            className="text-[11px] px-2 py-1 rounded-lg bg-stone-950 border border-stone-800 text-emerald-300/80 hover:text-emerald-200 hover:border-emerald-500/40 transition-colors"
          >
            📚 College
          </button>
        </div>
      </div>

      {/* Input Jot-Down Section */}
      <form onSubmit={handleAddThought} className="mt-4 bg-stone-950/80 border border-stone-800/90 rounded-xl p-3.5 sm:p-4 space-y-3 shadow-inner">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jot down a fleeting thought, spiritual realization, technical formula, or question... (Ctrl+Enter to save)"
            rows={2}
            className="w-full bg-stone-900/60 border border-stone-800 focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/40 rounded-lg p-3 text-sm text-stone-100 placeholder-stone-500 resize-none outline-none transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Category Selector Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-stone-400 mr-1 font-medium">Category:</span>
            {(['realization', 'gate', 'college', 'general'] as QuickThoughtCategory[]).map((cat) => {
              const meta = categoryMeta[cat];
              const Icon = meta.icon;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? `${meta.badge} ring-1 ring-amber-500/30 font-semibold shadow-sm`
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                  }`}
                >
                  <Icon className={`h-3 w-3 ${isSelected ? meta.color : 'text-stone-400'}`} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsInputPinned(!isInputPinned)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                isInputPinned
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-300'
              }`}
              title={isInputPinned ? 'Pinned to top' : 'Click to pin to top'}
            >
              <Pin className={`h-3.5 w-3.5 ${isInputPinned ? 'fill-amber-300' : ''}`} />
              <span className="hidden sm:inline">{isInputPinned ? 'Pinned' : 'Pin'}</span>
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-xs rounded-lg shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Jot Down</span>
              <CornerDownLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Filter and Search Bar */}
      <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              filterCategory === 'all'
                ? 'bg-stone-800 text-stone-100 border-stone-700 font-medium'
                : 'text-stone-400 border-transparent hover:text-stone-200'
            }`}
          >
            All ({thoughts.length})
          </button>
          
          <button
            onClick={() => setFilterCategory('pinned')}
            className={`px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
              filterCategory === 'pinned'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-medium'
                : 'text-stone-400 border-transparent hover:text-stone-200'
            }`}
          >
            <Pin className="h-3 w-3" />
            <span>Pinned ({pinnedCount})</span>
          </button>

          {(['realization', 'gate', 'college', 'general'] as QuickThoughtCategory[]).map((cat) => {
            const count = thoughts.filter((t) => t.category === cat).length;
            const meta = categoryMeta[cat];
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  filterCategory === cat
                    ? `${meta.badge} font-medium`
                    : 'text-stone-400 border-transparent hover:text-stone-200'
                }`}
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-56">
          <Search className="h-3.5 w-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-8 pr-3 py-1 bg-stone-950/80 border border-stone-800 focus:border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Thought Cards List */}
      <div className="mt-4">
        {filteredThoughts.length === 0 ? (
          <div className="text-center py-10 bg-stone-950/40 rounded-xl border border-dashed border-stone-800 px-4">
            <div className="inline-flex p-3 rounded-full bg-stone-900 text-stone-500 mb-2">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-stone-300">
              {searchQuery || filterCategory !== 'all' ? 'No matching thoughts found' : 'No quick thoughts yet'}
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
              {searchQuery || filterCategory !== 'all'
                ? 'Try resetting the filter or search term to view all notes.'
                : 'Spontaneous insights during Bhagavad Gita reading, deep problem solving, or lectures vanish quickly if not noted. Jot one down above!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredThoughts.map((thought) => {
              const meta = categoryMeta[thought.category] || categoryMeta.general;
              const Icon = meta.icon;
              const isEditing = editingId === thought.id;
              const isCopied = copiedId === thought.id;
              const isConverted = convertedId === thought.id;

              return (
                <div
                  key={thought.id}
                  className={`group relative flex flex-col justify-between p-3.5 rounded-xl border transition-all ${
                    thought.isPinned
                      ? 'bg-stone-950/90 border-amber-500/40 shadow-md shadow-amber-950/20'
                      : 'bg-stone-950/60 border-stone-800/90 hover:border-stone-700/80 hover:bg-stone-950/80'
                  }`}
                >
                  {/* Card Top: Category Badge, Timestamp, Pin */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${meta.badge}`}>
                        <Icon className="h-3 w-3" />
                        <span>{meta.label}</span>
                      </span>
                      {thought.isPinned && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-medium">
                          <Pin className="h-3 w-3 fill-amber-400" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                      <span className="font-mono-tabular">{formatTimestamp(thought.createdAt)}</span>
                      <button
                        onClick={() => onTogglePin(thought.id)}
                        className={`p-1 rounded hover:bg-stone-800 transition-colors ${
                          thought.isPinned ? 'text-amber-400' : 'text-stone-500 opacity-60 group-hover:opacity-100 hover:text-stone-300'
                        }`}
                        title={thought.isPinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className={`h-3 w-3 ${thought.isPinned ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Card Content or Inline Edit */}
                  {isEditing ? (
                    <div className="space-y-2 my-1">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-stone-100 outline-none focus:border-amber-500/80"
                      />
                      <div className="flex items-center justify-between">
                        <select
                          value={editingCategory}
                          onChange={(e) => setEditingCategory(e.target.value as QuickThoughtCategory)}
                          className="bg-stone-900 border border-stone-700 text-stone-300 text-[11px] rounded px-2 py-1 outline-none"
                        >
                          <option value="realization">Realization</option>
                          <option value="gate">GATE Insight</option>
                          <option value="college">College Note</option>
                          <option value="general">General</option>
                        </select>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handleCancelEdit}
                            className="px-2 py-0.5 text-[11px] text-stone-400 hover:text-stone-200"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(thought.id)}
                            className="px-2.5 py-0.5 text-[11px] bg-amber-500 text-stone-950 font-semibold rounded hover:bg-amber-400"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-200 leading-relaxed font-sans-body whitespace-pre-wrap break-words flex-1 my-1">
                      {thought.content}
                    </p>
                  )}

                  {/* Card Footer: Quick Actions */}
                  {!isEditing && (
                    <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-stone-900 text-stone-500">
                      {/* Convert to Task shortcut */}
                      {onConvertToTask ? (
                        <button
                          onClick={() => handleConvert(thought)}
                          disabled={isConverted}
                          className={`text-[11px] flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                            isConverted
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-stone-400 hover:text-amber-300 hover:bg-stone-900'
                          }`}
                          title="Convert this note into a task on Today's Action Plan"
                        >
                          {isConverted ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span className="font-semibold">Added as Task!</span>
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="h-3 w-3" />
                              <span>Make Task</span>
                            </>
                          )}
                        </button>
                      ) : <div />}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(thought)}
                          className="p-1 rounded text-stone-500 hover:text-stone-300 hover:bg-stone-900 transition-colors"
                          title="Copy text"
                        >
                          {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                        <button
                          onClick={() => handleStartEdit(thought)}
                          className="p-1 rounded text-stone-500 hover:text-stone-300 hover:bg-stone-900 transition-colors"
                          title="Edit note"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {
                            onDeleteThought(thought.id);
                            sound.playBeadClick();
                          }}
                          className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
