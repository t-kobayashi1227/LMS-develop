/**
 * Data service abstraction layer.
 * Currently returns mock data. When Laravel backend is ready,
 * replace implementations with actual API calls.
 */

import {
  mockCourses,
  mockStudents,
  mockAssignments,
  currentUser,
  adminUser,
  monthlyStudentData,
  coursePerformanceData,
  recentActivityData,
  courseCategories,
} from './mockData';
import type { Course, Student, Assignment, User, MonthlyData, CoursePerformance, RecentActivity } from './types';

export function getCourses(): Course[] {
  return mockCourses;
}

export function getStudents(): Student[] {
  return mockStudents;
}

export function getAssignments(): Assignment[] {
  return mockAssignments;
}

export function getCurrentUser(): User {
  return currentUser;
}

export function getAdminUser(): User {
  return adminUser;
}

export function getMonthlyStudentData(): MonthlyData[] {
  return monthlyStudentData;
}

export function getCoursePerformanceData(): CoursePerformance[] {
  return coursePerformanceData;
}

export function getRecentActivityData(): RecentActivity[] {
  return recentActivityData;
}

export function getCourseCategories(): readonly string[] {
  return courseCategories;
}
