import type { Metadata } from 'next';
import { getCourseCategories } from '@/lib/api';
import NewCourseForm from './NewCourseForm';

export const metadata: Metadata = {
  title: '新規コース作成 | 管理者 | Niigata AI Academy',
};

export default async function NewCoursePage() {
  const categories = await getCourseCategories();
  // "All" を除外
  const filtered = categories.filter(c => c !== 'All');
  return <NewCourseForm categories={filtered} />;
}
