export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  studentCount: number;
  status: CourseStatus;
}

export interface Lesson {
  id: string;
  courseId: string;
  chapterId: string;
  title: string;
  duration: string;
  durationSeconds: number;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'text' | 'assignment';
  hasVideo: boolean;
  videoUrl?: string;
  contentBody?: string;
}

export interface Chapter {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface CourseChapters {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  chapters: Chapter[];
}

export interface QuizQuestion {
  id: string;
  type: 'choice' | 'text';
  questionText: string;
  options: string[] | null;
  conditions: string[] | null;
  explanation?: string | null;
  sortOrder: number;
}

export interface QuizResult {
  questionId: string;
  type: 'choice' | 'text';
  explanation: string | null;
  isCorrect?: boolean;
  correctOptionIndex?: number;
}

export interface LessonDetail {
  id: string;
  courseId: string;
  courseTitle: string;
  chapterId: string;
  chapterTitle: string;
  title: string;
  type: 'video' | 'text' | 'assignment';
  hasVideo: boolean;
  videoUrl: string | null;
  contentBody: string | null;
  duration: string;
  durationSeconds: number;
  isCompleted: boolean;
  isLocked: boolean;
  sortOrder: number;
  resources: { id: string; title: string; fileOriginalName: string; fileSizeBytes: number | null; mimeType: string | null; url: string | null }[];
  quizQuestions: QuizQuestion[];
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  courseName: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isUnread: boolean;
  type: 'direct' | 'feedback' | 'system';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: number;
  progress: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

export type ActivityType = 'complete' | 'submit' | 'enroll' | 'warning';

export interface MonthlyData {
  month: string;
  students: number;
}

export interface CoursePerformance {
  name: string;
  students: number;
  avgProgress: number;
  completionRate: number;
  satisfaction: number;
}

export interface RecentActivity {
  action: string;
  time: string;
  type: ActivityType;
}

export interface KpiData {
  activeStudents: number;
  publishedCourses: number;
  pendingSubmissions: number;
  avgCompletion: number;
  totalHours: number;
}

export interface PendingSubmission {
  id: string;
  assignmentTitle: string;
  studentName: string;
  studentAvatar: string;
  submittedAt: string;
}
