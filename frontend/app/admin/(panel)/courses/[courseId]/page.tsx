import { fetchData } from '@/lib/apiClient';
import { getCourseCategories } from '@/lib/api';
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
