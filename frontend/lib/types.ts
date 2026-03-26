export type Role = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
}

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
}

export interface Lesson {
  id: string;
  courseId: string;
  chapterId: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'text' | 'assignment';
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
