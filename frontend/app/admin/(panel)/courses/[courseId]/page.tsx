import type { Metadata } from 'next';
import { fetchData } from '@/lib/apiClient';
import { getCourseCategories } from '@/lib/api';

export const metadata: Metadata = {
  title: 'コース編集 | 管理者 | Niigata AI Academy',
};
import CourseEditor from './CourseEditor';

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CourseEditPage({ params }: Props) {
  const { courseId } = await params;
  const [course, categories] = await Promise.all([
    fetchData<Parameters<typeof CourseEditor>[0]['course']>(`/admin/courses/${courseId}`),
    getCourseCategories(),
  ]);

  return <CourseEditor course={course} categories={categories} />;
}
