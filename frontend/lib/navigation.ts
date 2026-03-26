import { Home, BookOpen, GraduationCap, Users, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const studentNav: NavItem[] = [
  { href: '/student/dashboard', label: 'ホーム', icon: Home },
  { href: '/student/courses', label: 'マイコース', icon: BookOpen },
  { href: '/student/lesson', label: '学習ルーム', icon: GraduationCap },
];

export const adminNav: NavItem[] = [
  { href: '/admin/dashboard', label: 'ダッシュボード', icon: Home },
  { href: '/admin/users', label: '受講者管理', icon: Users },
  { href: '/admin/courses', label: 'コース管理', icon: BookOpen },
  { href: '/admin/analytics', label: '分析レポート', icon: BarChart3 },
];
