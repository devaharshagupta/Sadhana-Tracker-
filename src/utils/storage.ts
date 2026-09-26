import { CollegeCourse, DailyCollegeLog, DailyGateLog, DailySadhanaLog, GateMockTest, GateSubject, QuickThought, TaskItem, UserSettings } from '../types';
import {
  INITIAL_COLLEGE_COURSES,
  INITIAL_DAILY_SADHANA,
  INITIAL_GATE_SUBJECTS,
  INITIAL_MOCK_TESTS,
  INITIAL_QUICK_THOUGHTS,
  INITIAL_TASKS,
  INITIAL_USER_SETTINGS,
  getTodayDateString
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'sadhana_vidya_settings_v1',
  TASKS: 'sadhana_vidya_tasks_v1',
  SADHANA_LOGS: 'sadhana_vidya_sadhana_logs_v1',
  GATE_SUBJECTS: 'sadhana_vidya_gate_subjects_v1',
  GATE_MOCKS: 'sadhana_vidya_gate_mocks_v1',
  COLLEGE_COURSES: 'sadhana_vidya_college_courses_v1',
  QUICK_THOUGHTS: 'sadhana_vidya_quick_thoughts_v1',
  SELECTED_DATE: 'sadhana_vidya_selected_date_v1'
};

export const StorageService = {
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...INITIAL_USER_SETTINGS, ...JSON.parse(data) } : INITIAL_USER_SETTINGS;
    } catch {
      return INITIAL_USER_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  },

  getTasks(): TaskItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: TaskItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  },

  getSadhanaLogs(): Record<string, DailySadhanaLog> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SADHANA_LOGS);
      if (data) return JSON.parse(data);
      const today = getTodayDateString();
      return { [today]: INITIAL_DAILY_SADHANA };
    } catch {
      const today = getTodayDateString();
      return { [today]: INITIAL_DAILY_SADHANA };
    }
  },

  saveSadhanaLogs(logs: Record<string, DailySadhanaLog>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SADHANA_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error("Failed to save sadhana logs", e);
    }
  },

  getGateSubjects(): GateSubject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GATE_SUBJECTS);
      return data ? JSON.parse(data) : INITIAL_GATE_SUBJECTS;
    } catch {
      return INITIAL_GATE_SUBJECTS;
    }
  },

  saveGateSubjects(subjects: GateSubject[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GATE_SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error("Failed to save gate subjects", e);
    }
  },

  getGateMocks(): GateMockTest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GATE_MOCKS);
      return data ? JSON.parse(data) : INITIAL_MOCK_TESTS;
    } catch {
      return INITIAL_MOCK_TESTS;
    }
  },

  saveGateMocks(mocks: GateMockTest[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GATE_MOCKS, JSON.stringify(mocks));
    } catch (e) {
      console.error("Failed to save gate mocks", e);
    }
  },

  getCollegeCourses(): CollegeCourse[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COLLEGE_COURSES);
      return data ? JSON.parse(data) : INITIAL_COLLEGE_COURSES;
    } catch {
      return INITIAL_COLLEGE_COURSES;
    }
  },

  saveCollegeCourses(courses: CollegeCourse[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLEGE_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error("Failed to save college courses", e);
    }
  },

  getQuickThoughts(): QuickThought[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUICK_THOUGHTS);
      return data ? JSON.parse(data) : INITIAL_QUICK_THOUGHTS;
    } catch {
      return INITIAL_QUICK_THOUGHTS;
    }
  },

  saveQuickThoughts(thoughts: QuickThought[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUICK_THOUGHTS, JSON.stringify(thoughts));
    } catch (e) {
      console.error("Failed to save quick thoughts", e);
    }
  },

  exportAllData(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      tasks: this.getTasks(),
      sadhanaLogs: this.getSadhanaLogs(),
      gateSubjects: this.getGateSubjects(),
      gateMocks: this.getGateMocks(),
      collegeCourses: this.getCollegeCourses(),
      quickThoughts: this.getQuickThoughts()
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (parsed.tasks) this.saveTasks(parsed.tasks);
      if (parsed.sadhanaLogs) this.saveSadhanaLogs(parsed.sadhanaLogs);
      if (parsed.gateSubjects) this.saveGateSubjects(parsed.gateSubjects);
      if (parsed.gateMocks) this.saveGateMocks(parsed.gateMocks);
      if (parsed.collegeCourses) this.saveCollegeCourses(parsed.collegeCourses);
      if (parsed.quickThoughts) this.saveQuickThoughts(parsed.quickThoughts);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  },

  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.SADHANA_LOGS);
    localStorage.removeItem(STORAGE_KEYS.GATE_SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.GATE_MOCKS);
    localStorage.removeItem(STORAGE_KEYS.COLLEGE_COURSES);
    localStorage.removeItem(STORAGE_KEYS.QUICK_THOUGHTS);
  }
};
