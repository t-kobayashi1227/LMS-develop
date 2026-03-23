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
