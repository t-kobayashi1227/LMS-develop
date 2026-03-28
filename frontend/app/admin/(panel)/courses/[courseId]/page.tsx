import type { Metadata } from 'next';
import { fetchData } from '@/lib/apiClient';
import CourseEditor from './CourseEditor';

export const metadata: Metadata = {
  title: 'コース編集 | 管理者 | Niigata AI Academy',
};

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CourseEditPage({ params }: Props) {
  const { courseId } = await params;
  const course = await fetchData<Parameters<typeof CourseEditor>[0]['course']>(`/admin/courses/${courseId}`);

  return <CourseEditor course={course} />;
}
