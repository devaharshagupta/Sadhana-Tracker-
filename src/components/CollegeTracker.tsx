import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Plus, 
  Calendar, 
  Trash2,
  Check,
  X
} from 'lucide-react';
import { CollegeCourse, UserSettings } from '../types';
import { sound } from '../utils/audio';

interface CollegeTrackerProps {
  courses: CollegeCourse[];
  onUpdateCourses: (courses: CollegeCourse[]) => void;
  userSettings: UserSettings;
}

export const CollegeTracker: React.FC<CollegeTrackerProps> = ({
  courses,
  onUpdateCourses,
  userSettings
}) => {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [attendedCount, setAttendedCount] = useState('20');
  const [totalCount, setTotalCount] = useState('24');
  const [credits, setCredits] = useState('4');
  const [professor, setProfessor] = useState('');

  // Handle logging today's attendance
  const handleLogAttendance = (courseId: string, attended: boolean) => {
    const updated = courses.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          total: c.total + 1,
          attended: attended ? c.attended + 1 : c.attended
        };
      }
      return c;
    });
    onUpdateCourses(updated);
    if (attended) {
      sound.playTempleBell();
    } else {
      sound.playBeadClick();
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    onUpdateCourses(courses.filter((c) => c.id !== courseId));
    sound.playBeadClick();
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    const newCourse: CollegeCourse = {
      id: 'course-' + Date.now(),
      name: courseName.trim(),
      code: courseCode.trim() || 'CS-' + Math.floor(100 + Math.random() * 900),
      attended: parseInt(attendedCount) || 0,
      total: Math.max(1, parseInt(totalCount) || 1),
      targetPercent: userSettings.collegeMinAttendance || 75,
      credits: parseInt(credits) || 3,
      professor: professor.trim() || undefined
    };

    onUpdateCourses([...courses, newCourse]);
    setShowAddCourse(false);
    setCourseName('');
    setCourseCode('');
    sound.playTempleBell();
  };

  // Calculate mathematical safety:
  // Let A = attended, T = total, target = 0.75
  // If A/T >= target: how many consecutive bunks B can we take such that A / (T + B) >= 0.75?
  // A >= 0.75*(T + B) => B <= (A - 0.75*T) / 0.75
  // If A/T < target: how many consecutive attendances X needed such that (A + X) / (T + X) >= 0.75?
  // A + X >= 0.75*T + 0.75*X => 0.25*X >= 0.75*T - A => X >= (0.75*T - A) / 0.25
  const getAttendanceMath = (attended: number, total: number, targetPercent: number) => {
    const p = total > 0 ? (attended / total) * 100 : 100;
    const target = targetPercent / 100;

    if (p >= targetPercent) {
      const safeBunks = Math.floor((attended - target * total) / target);
      return {
        percent: p,
        isSafe: true,
        margin: Math.max(0, safeBunks),
        message: safeBunks > 0 
          ? `Safe zone: You can bunk ${safeBunks} more ${safeBunks === 1 ? 'class' : 'classes'} safely!`
          : `On the edge: Cannot miss any classes.`
      };
    } else {
      const needed = Math.ceil((target * total - attended) / (1 - target));
      return {
        percent: p,
        isSafe: false,
        margin: Math.max(1, needed),
        message: `Attendance alert! Attend next ${needed} ${needed === 1 ? 'class' : 'classes'} consecutively to reach ${targetPercent}%.`
      };
    }
  };

  // Overall attendance across all subjects
  const totalAttended = courses.reduce((acc, c) => acc + c.attended, 0);
  const totalClasses = courses.reduce((acc, c) => acc + c.total, 0);
  const overallPercent = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-display font-bold text-white">
              College Academics & Attendance Safety Engine
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Maintain your 75% attendance quota with zero stress while preserving maximum hours for GATE & Sādhana
          </p>
        </div>

        <button
          onClick={() => setShowAddCourse(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 rounded-xl transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Snapshot Bar */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-stone-400 block font-sans-body">Overall Semester Attendance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-bold font-mono-tabular ${
              parseFloat(overallPercent) >= 75 ? 'text-emerald-300' : 'text-rose-400'
            }`}>
              {overallPercent}%
            </span>
            <span className="text-xs text-stone-400">
              ({totalAttended} of {totalClasses} total lectures attended)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-300 bg-stone-950/70 border border-stone-800 p-3 rounded-xl">
          <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="font-semibold text-stone-100 block">75% Criteria Guard Active</span>
            <span className="text-stone-400 text-[11px]">
              Every bunk margin is calculated in real time so you never face debarment or penalty.
            </span>
          </div>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => {
          const stats = getAttendanceMath(course.attended, course.total, course.targetPercent || 75);
          const percentFormatted = stats.percent.toFixed(1);

          return (
            <div
              key={course.id}
              className={`bg-stone-900/60 border transition-all rounded-2xl p-5 space-y-3.5 ${
                stats.isSafe ? 'border-stone-800 hover:border-emerald-800/60' : 'border-rose-900/50 bg-rose-950/10'
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-tabular text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                      {course.code}
                    </span>
                    <span className="text-xs text-stone-500">{course.credits} Credits</span>
                  </div>
                  <h3 className="text-sm font-semibold text-stone-100 mt-1">{course.name}</h3>
                  {course.professor && (
                    <p className="text-xs text-stone-400 mt-0.5">Instructor: {course.professor}</p>
                  )}
                </div>

                <div className="text-right">
                  <div className={`text-xl font-bold font-mono-tabular ${
                    stats.isSafe ? 'text-emerald-300' : 'text-rose-400'
                  }`}>
                    {percentFormatted}%
                  </div>
                  <span className="text-[11px] font-mono-tabular text-stone-400">
                    {course.attended}/{course.total} attended
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-stone-950 rounded-full h-2 border border-stone-800 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      stats.isSafe ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, stats.percent)}%` }}
                  />
                </div>
              </div>

              {/* Smart Bunk / Recovery Guidance */}
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                stats.isSafe 
                  ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900/40' 
                  : 'bg-rose-950/30 text-rose-300 border-rose-900/40'
              }`}>
                {stats.isSafe ? (
                  <ShieldCheck className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-rose-400" />
                )}
                <span className="leading-snug">{stats.message}</span>
              </div>

              {/* Assignment Notice if present */}
              {course.nextAssignmentTitle && (
                <div className="text-[11px] text-stone-400 bg-stone-950/50 p-2 rounded-lg border border-stone-800/80 flex items-center justify-between">
                  <span>Assignment: {course.nextAssignmentTitle}</span>
                  <span className="text-amber-400 font-mono-tabular">{course.nextAssignmentDeadline}</span>
                </div>
              )}

              {/* Bottom Quick Attendance Logger Row */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs">
                <span className="text-stone-400">Today's Class:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLogAttendance(course.id, true)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/50 text-emerald-300 rounded-lg transition-colors font-medium"
                    title="Mark Attended"
                  >
                    <Check className="h-3 w-3" />
                    <span>Attended</span>
                  </button>
                  <button
                    onClick={() => handleLogAttendance(course.id, false)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-stone-200 rounded-lg transition-colors"
                    title="Mark Missed / Bunked"
                  >
                    <X className="h-3 w-3" />
                    <span>Missed</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1 text-stone-600 hover:text-rose-400 rounded transition-colors ml-1"
                    title="Delete Course"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Add College Course</h3>

            <form onSubmit={handleAddCourse} className="space-y-3">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Networks & Security"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-305"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Credits</label>
                  <input
                    type="number"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Lectures Attended</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={attendedCount}
                    onChange={(e) => setAttendedCount(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Total Lectures Held</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalCount}
                    onChange={(e) => setTotalCount(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 font-mono-tabular focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Professor Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramesh"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg p-2 text-xs text-stone-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg transition-colors"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
