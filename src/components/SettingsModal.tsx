import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, Check, ShieldAlert, Settings } from 'lucide-react';
import { UserSettings } from '../types';
import { StorageService } from '../utils/storage';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onDataReload: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onDataReload
}) => {
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    sound.setEnabled(formData.soundEnabled);
    sound.playTempleBell();
    onClose();
  };

  const handleExport = () => {
    const data = StorageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sadhana_gate_college_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playBeadClick();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importAllData(content);
        if (success) {
          setImportStatus('Backup successfully restored!');
          onDataReload();
          sound.playTempleBell();
        } else {
          setImportStatus('Failed to parse backup JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all tasks, mocks, and logs to fresh defaults?")) {
      StorageService.resetToDefaults();
      onDataReload();
      sound.playBeadClick();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900 p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Target Vows & System Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 block mb-1">Aspirant Name</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">Japa Target Rounds</label>
              <input
                type="number"
                min="1"
                max="64"
                value={formData.japaDailyTarget}
                onChange={(e) => setFormData({ ...formData, japaDailyTarget: parseInt(e.target.value) || 16 })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 block mb-1">GATE Target Exam Date</label>
              <input
                type="date"
                value={formData.gateExamDate}
                onChange={(e) => setFormData({ ...formData, gateExamDate: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">Daily Study Target (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={formData.dailyGateTargetHours}
                onChange={(e) => setFormData({ ...formData, dailyGateTargetHours: parseFloat(e.target.value) || 4 })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-400 block mb-1">Engineering Discipline / Branch</label>
              <input
                type="text"
                value={formData.gateTargetBranch}
                onChange={(e) => setFormData({ ...formData, gateTargetBranch: e.target.value })}
                placeholder="e.g. Computer Science & IT"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-stone-400 block mb-1">College Min Attendance %</label>
              <input
                type="number"
                min="50"
                max="90"
                value={formData.collegeMinAttendance}
                onChange={(e) => setFormData({ ...formData, collegeMinAttendance: parseInt(e.target.value) || 75 })}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Sound enable */}
          <div className="flex items-center gap-2 p-2.5 bg-stone-950/60 border border-stone-800 rounded-xl cursor-pointer" onClick={() => setFormData({ ...formData, soundEnabled: !formData.soundEnabled })}>
            <input
              type="checkbox"
              checked={formData.soundEnabled}
              onChange={(e) => setFormData({ ...formData, soundEnabled: e.target.checked })}
              className="rounded border-stone-700 bg-stone-900 text-amber-500"
            />
            <span className="text-xs text-stone-300">
              Enable temple bell chime & bead audio feedback
            </span>
          </div>

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
              Save Changes
            </button>
          </div>
        </form>

        {/* Backup & Restore Data */}
        <div className="pt-4 border-t border-stone-800 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Data Portability & Backup
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-xl text-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 rounded-xl text-xs transition-colors cursor-pointer">
              <Upload className="h-3.5 w-3.5" />
              <span>Restore JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <p className="text-xs text-amber-300 font-medium">{importStatus}</p>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset all to initial default sample data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
