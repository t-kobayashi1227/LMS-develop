import { fetchData } from './apiClient';
import type {
  Course, Student, Assignment, User,
  MonthlyData, CoursePerformance, RecentActivity, KpiData,
} from './types';

export const getCourses = () => fetchData<Course[]>('/courses');
export const getStudents = () => fetchData<Student[]>('/students');
export const getAssignments = () => fetchData<Assignment[]>('/assignments');
export const getCurrentUser = () => fetchData<User>('/user');
export const getMonthlyStudentData = () => fetchData<MonthlyData[]>('/analytics/monthly-students');
export const getCoursePerformanceData = () => fetchData<CoursePerformance[]>('/analytics/course-performance');
export const getRecentActivityData = () => fetchData<RecentActivity[]>('/analytics/recent-activity');
export const getAdminKpi = () => fetchData<KpiData>('/analytics/kpi');
export const getCourseCategories = () => fetchData<string[]>('/course-categories', { noAuth: true });
