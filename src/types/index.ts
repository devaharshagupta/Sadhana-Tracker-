export type Pillar = 'sadhana' | 'gate' | 'college';
export type Priority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  pillar: Pillar;
  category: string;
  priority: Priority;
  completed: boolean;
  status: TaskStatus;
  date: string; // YYYY-MM-DD
  dueTime?: string;
  estimatedMinutes?: number;
  notes?: string;
  subtasks: SubTask[];
  repeatDaily?: boolean;
  createdAt: number;
}

export interface RegulativePrinciples {
  noMeatFishEgg: boolean;
  noGambling: boolean;
  noIntoxication: boolean;
  noIllicitSex: boolean;
}

export interface DailySadhanaLog {
  date: string;
  japaRounds: number;
  japaTarget: number;
  brahmaMuhurtaWakeup: boolean;
  wakeupTime: string;
  gitaStudyMinutes: number;
  gitaReadingNote: string;
  bhagavatamMinutes: number;
  hearingMinutes: number; // Lecture / Kirtan
  deitySevaPrasadam: boolean;
  regulativePrinciples: RegulativePrinciples;
  notes: string;
}

export interface GateSubject {
  id: string;
  name: string;
  shortCode: string;
  weightage: number; // e.g. 10 marks
  progressPercent: number; // 0 to 100
  pyqsSolved: number;
  pyqTarget: number;
  revisionStatus: 'Not Started' | 'In Progress' | 'R1 Done' | 'R2 Done' | 'Mastered';
  notes: string;
}

export interface GateMockTest {
  id: string;
  title: string;
  date: string;
  score: number;
  maxScore: number;
  accuracyPercent: number;
  mistakesAndLearnings: string;
  subjectOrFull: string;
}

export interface DailyGateLog {
  date: string;
  studyMinutes: number;
  pyqsSolved: number;
  subjectsStudied: string[];
  mockTestNotes?: string;
}

export interface CollegeCourse {
  id: string;
  code: string;
  name: string;
  attended: number;
  total: number;
  targetPercent: number; // e.g. 75
  credits: number;
  professor?: string;
  nextAssignmentDeadline?: string;
  nextAssignmentTitle?: string;
}

export interface DailyCollegeLog {
  date: string;
  classesAttendedToday: number;
  classesHeldToday: number;
  assignmentCompleted: boolean;
  labCompleted: boolean;
  notes: string;
}

export interface BhagavadGitaSloka {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  practicalApplication: string;
}

export interface UserSettings {
  userName: string;
  japaDailyTarget: number;
  gateExamDate: string;
  gateTargetBranch: string;
  dailyGateTargetHours: number;
  collegeMinAttendance: number;
  soundEnabled: boolean;
}

export type QuickThoughtCategory = 'realization' | 'gate' | 'college' | 'general';

export interface QuickThought {
  id: string;
  content: string;
  category: QuickThoughtCategory;
  isPinned?: boolean;
  createdAt: number;
  updatedAt?: number;
}
