import { BhagavadGitaSloka, CollegeCourse, DailyCollegeLog, DailyGateLog, DailySadhanaLog, GateMockTest, GateSubject, QuickThought, TaskItem, UserSettings } from '../types';

export const BG_SLOKAS: BhagavadGitaSloka[] = [
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
    practicalApplication: "Dedicate your GATE preparation and college study with complete sincerity as service to the Supreme Lord (Yajna), releasing anxiety about ranks or outcome."
  },
  {
    chapter: 6,
    verse: 26,
    sanskrit: "यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्। ततस्ततो नियम्यैतदात्मन्येव वशं नयेत्॥",
    transliteration: "yato yato niścarati manaś cañcalam asthiram | tato tato niyamyaitad ātmany eva vaśaṁ nayet",
    translation: "From wherever the mind wanders due to its flickering and unsteady nature, one must certainly withdraw it and bring it back under the control of the Self.",
    practicalApplication: "During both Japa chanting and deep GATE problem-solving, whenever the mind wanders into digital distractions or daydreaming, gently bring it back."
  },
  {
    chapter: 6,
    verse: 5,
    sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet | ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    translation: "One must deliver oneself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
    practicalApplication: "Early morning waking, regulation of eating/sleeping, and daily habit tracking train the mind to become your supreme ally."
  },
  {
    chapter: 9,
    verse: 22,
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    transliteration: "ananyāś cintayanto māṁ ye janāḥ paryupāsate | teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
    translation: "To those who are constantly devoted to serving Me with love, I supply what they lack and preserve what they have.",
    practicalApplication: "Have faith that spiritual time spent in Japa and hearing does not waste your study hours; Lord Krishna reciprocates by granting sharp intellect and inner peace."
  },
  {
    chapter: 18,
    verse: 66,
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja | ahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
    translation: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
    practicalApplication: "Surrender your academic ambitions and daily efforts at the lotus feet of Sri Krishna; fear and exam anxiety will dissolve."
  }
];

export const INITIAL_USER_SETTINGS: UserSettings = {
  userName: "Harsha",
  japaDailyTarget: 16,
  gateExamDate: "2027-02-06",
  gateTargetBranch: "Computer Science & IT (CS)",
  dailyGateTargetHours: 4.5,
  collegeMinAttendance: 75,
  soundEnabled: true
};

export const INITIAL_GATE_SUBJECTS: GateSubject[] = [
  {
    id: "engg_math",
    name: "Engineering Mathematics",
    shortCode: "EM",
    weightage: 13,
    progressPercent: 65,
    pyqsSolved: 140,
    pyqTarget: 220,
    revisionStatus: "R1 Done",
    notes: "Linear Algebra & Calculus completed; Probability & Differential Equations in progress."
  },
  {
    id: "discrete_math",
    name: "Discrete Mathematics",
    shortCode: "DM",
    weightage: 8,
    progressPercent: 70,
    pyqsSolved: 95,
    pyqTarget: 150,
    revisionStatus: "R1 Done",
    notes: "Graph theory and Combinatorics need 1 more mock practice session."
  },
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    shortCode: "DSA",
    weightage: 12,
    progressPercent: 80,
    pyqsSolved: 185,
    pyqTarget: 240,
    revisionStatus: "R2 Done",
    notes: "Dynamic Programming and Graph traversal algorithms revised. Focus on time complexities."
  },
  {
    id: "os",
    name: "Operating Systems",
    shortCode: "OS",
    weightage: 9,
    progressPercent: 55,
    pyqsSolved: 75,
    pyqTarget: 160,
    revisionStatus: "In Progress",
    notes: "Process Synchronization, Semaphores and Deadlock Banker's algorithm ongoing."
  },
  {
    id: "dbms",
    name: "Databases (DBMS)",
    shortCode: "DBMS",
    weightage: 8,
    progressPercent: 60,
    pyqsSolved: 80,
    pyqTarget: 140,
    revisionStatus: "In Progress",
    notes: "Normalization (BCNF/3NF decompositions) and SQL queries thoroughly practiced."
  },
  {
    id: "cn",
    name: "Computer Networks",
    shortCode: "CN",
    weightage: 9,
    progressPercent: 40,
    pyqsSolved: 45,
    pyqTarget: 150,
    revisionStatus: "In Progress",
    notes: "IP Subnetting, TCP flow/congestion control, Routing protocols."
  },
  {
    id: "toc",
    name: "Theory of Computation",
    shortCode: "TOC",
    weightage: 8,
    progressPercent: 75,
    pyqsSolved: 110,
    pyqTarget: 150,
    revisionStatus: "R1 Done",
    notes: "Decidability and regular expressions mastered. Revise Turing machine reductions."
  },
  {
    id: "aptitude",
    name: "General Aptitude",
    shortCode: "GA",
    weightage: 15,
    progressPercent: 85,
    pyqsSolved: 210,
    pyqTarget: 250,
    revisionStatus: "Mastered",
    notes: "Verbal & numerical ability. Consistent 12-14/15 scoring."
  }
];

export const INITIAL_COLLEGE_COURSES: CollegeCourse[] = [
  {
    id: "cs301",
    code: "CS-301",
    name: "Design & Analysis of Algorithms",
    attended: 28,
    total: 32,
    targetPercent: 75,
    credits: 4,
    professor: "Dr. K. Sharma",
    nextAssignmentDeadline: "In 3 days",
    nextAssignmentTitle: "Greedy vs DP complexity proofs"
  },
  {
    id: "cs302",
    code: "CS-302",
    name: "Operating Systems & System Programming",
    attended: 24,
    total: 30,
    targetPercent: 75,
    credits: 4,
    professor: "Prof. S. Ranganathan",
    nextAssignmentDeadline: "Friday 5 PM",
    nextAssignmentTitle: "POSIX thread synchronization simulation"
  },
  {
    id: "cs303",
    code: "CS-303",
    name: "Database Management Systems",
    attended: 25,
    total: 30,
    targetPercent: 75,
    credits: 4,
    professor: "Dr. Ananya Sen",
    nextAssignmentDeadline: "Tomorrow 11:59 PM",
    nextAssignmentTitle: "Lab 4: Transaction recovery & ACID demo"
  },
  {
    id: "cs304",
    code: "CS-304",
    name: "Software Engineering & Ethics",
    attended: 21,
    total: 28,
    targetPercent: 75,
    credits: 3,
    professor: "Prof. M. Verma",
    nextAssignmentDeadline: "Next Monday",
    nextAssignmentTitle: "Agile Sprint documentation report"
  }
];

export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_TASKS: TaskItem[] = [
  // Sadhana
  {
    id: "task-sadhana-1",
    title: "Chant 16 Rounds of Hare Krishna Maha-Mantra (Focus on clear hearing)",
    pillar: "sadhana",
    category: "Japa Mala",
    priority: "high",
    completed: false,
    status: "in-progress",
    date: getTodayDateString(),
    dueTime: "07:30",
    estimatedMinutes: 110,
    notes: "Wake up in Brahma Muhurta, recite Pancha-Tattva mantra before starting, avoid mind wandering.",
    repeatDaily: true,
    createdAt: Date.now() - 3600000,
    subtasks: [
      { id: "st-1", title: "Morning 8 rounds before 6:30 AM", completed: true },
      { id: "st-2", title: "Afternoon/Evening remaining 8 rounds", completed: false }
    ]
  },
  {
    id: "task-sadhana-2",
    title: "Read Bhagavad Gita As It Is: Chapter 6 Verses 20–26",
    pillar: "sadhana",
    category: "Shastra Study",
    priority: "medium",
    completed: true,
    status: "completed",
    date: getTodayDateString(),
    dueTime: "08:30",
    estimatedMinutes: 25,
    notes: "Reflect on how controlling the restless mind directly applies to GATE test temperament.",
    repeatDaily: true,
    createdAt: Date.now() - 7200000,
    subtasks: []
  },
  {
    id: "task-sadhana-3",
    title: "Listen to Srila Prabhupada Srimad Bhagavatam lecture (30 mins)",
    pillar: "sadhana",
    category: "Sravanam",
    priority: "medium",
    completed: false,
    status: "pending",
    date: getTodayDateString(),
    dueTime: "21:30",
    estimatedMinutes: 30,
    notes: "Listen with full attention while winding down in the evening.",
    repeatDaily: true,
    createdAt: Date.now() - 5000000,
    subtasks: []
  },

  // GATE
  {
    id: "task-gate-1",
    title: "Solve 25 GATE PYQs on Linear Algebra (Eigenvalues, Diagonalization)",
    pillar: "gate",
    category: "Engg Mathematics",
    priority: "high",
    completed: false,
    status: "in-progress",
    date: getTodayDateString(),
    dueTime: "18:00",
    estimatedMinutes: 90,
    notes: "Review short formulas for Cayley-Hamilton theorem and properties of symmetric matrices.",
    repeatDaily: false,
    createdAt: Date.now() - 4000000,
    subtasks: [
      { id: "st-g1", title: "Questions 1 to 12 (1-mark PYQs)", completed: true },
      { id: "st-g2", title: "Questions 13 to 25 (2-mark tricky questions)", completed: false }
    ]
  },
  {
    id: "task-gate-2",
    title: "Revise Operating Systems: Classical IPC Problems (Dining Philosophers & Readers-Writers)",
    pillar: "gate",
    category: "Operating Systems",
    priority: "high",
    completed: false,
    status: "pending",
    date: getTodayDateString(),
    dueTime: "20:00",
    estimatedMinutes: 60,
    notes: "Draw semaphore pseudocode and analyze potential deadlocks / starvation conditions.",
    repeatDaily: false,
    createdAt: Date.now() - 3000000,
    subtasks: []
  },
  {
    id: "task-gate-3",
    title: "Update GATE Error Log: Document tricky mistake from Sunday mock test",
    pillar: "gate",
    category: "Error Notebook",
    priority: "medium",
    completed: true,
    status: "completed",
    date: getTodayDateString(),
    dueTime: "19:30",
    estimatedMinutes: 20,
    notes: "Noted trap in TOC DFA minimization with unreachable states.",
    repeatDaily: false,
    createdAt: Date.now() - 8000000,
    subtasks: []
  },

  // College
  {
    id: "task-college-1",
    title: "Attend CS-301 Algorithms & CS-302 OS Lectures (Do not bunk, maintain 80%+)",
    pillar: "college",
    category: "Lectures",
    priority: "high",
    completed: true,
    status: "completed",
    date: getTodayDateString(),
    dueTime: "13:00",
    estimatedMinutes: 120,
    notes: "Lecture Hall 204. Marked attendance and took running notes.",
    repeatDaily: true,
    createdAt: Date.now() - 10000000,
    subtasks: []
  },
  {
    id: "task-college-2",
    title: "Complete DBMS Lab 4 Assignment & Push SQL code to Git",
    pillar: "college",
    category: "Lab & Assignments",
    priority: "high",
    completed: false,
    status: "in-progress",
    date: getTodayDateString(),
    dueTime: "16:30",
    estimatedMinutes: 75,
    notes: "Write B-Tree index lookup queries and prepare PDF report for submission.",
    repeatDaily: false,
    createdAt: Date.now() - 6000000,
    subtasks: [
      { id: "st-c1", title: "Execute queries in PostgreSQL container", completed: true },
      { id: "st-c2", title: "Take execution plan screenshots (EXPLAIN ANALYZE)", completed: false },
      { id: "st-c3", title: "Generate PDF and submit on Google Classroom", completed: false }
    ]
  }
];

export const INITIAL_DAILY_SADHANA: DailySadhanaLog = {
  date: getTodayDateString(),
  japaRounds: 10,
  japaTarget: 16,
  brahmaMuhurtaWakeup: true,
  wakeupTime: "04:30",
  gitaStudyMinutes: 25,
  gitaReadingNote: "Chapter 6 Verses 20-26 (Mind control and steadfast yoga practice)",
  bhagavatamMinutes: 15,
  hearingMinutes: 30,
  deitySevaPrasadam: true,
  regulativePrinciples: {
    noMeatFishEgg: true,
    noGambling: true,
    noIntoxication: true,
    noIllicitSex: true
  },
  notes: "Felt peaceful in early morning rounds. Mind was calm. Krishna consciousness gave energy for college classes."
};

export const INITIAL_MOCK_TESTS: GateMockTest[] = [
  {
    id: "mock-1",
    title: "Subject Test: Theory of Computation",
    date: "2026-09-20",
    score: 21.5,
    maxScore: 25,
    accuracyPercent: 88,
    mistakesAndLearnings: "Made 1 calculation mistake on ambiguous grammar derivation length. Need to be more careful with counting rules.",
    subjectOrFull: "TOC"
  },
  {
    id: "mock-2",
    title: "Combined Sectional Test: Data Structures & Algorithms",
    date: "2026-09-23",
    score: 42,
    maxScore: 50,
    accuracyPercent: 86,
    mistakesAndLearnings: "Fell into trap on worst-case QuickSort partition recursion stack depth. Remember O(N) auxiliary space in degenerate tree.",
    subjectOrFull: "DSA"
  }
];

export const INITIAL_QUICK_THOUGHTS: QuickThought[] = [
  {
    id: "thought-1",
    content: "When chanting rounds, keep the conscious mind attentive to the sound vibration of the Holy Name rather than anticipating the next bead.",
    category: "realization",
    isPinned: true,
    createdAt: Date.now() - 1000 * 60 * 180
  },
  {
    id: "thought-2",
    content: "TOC: A language L is regular if and only if the number of equivalence classes of Myhill-Nerode relation RL is finite.",
    category: "gate",
    isPinned: false,
    createdAt: Date.now() - 1000 * 60 * 95
  },
  {
    id: "thought-3",
    content: "Prof. Narayanan mentioned Distributed Systems Quiz 2 will heavily weigh Lamport timestamps & Vector clocks.",
    category: "college",
    isPinned: false,
    createdAt: Date.now() - 1000 * 60 * 35
  }
];
