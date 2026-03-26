import { fetchData } from '@/lib/apiClient';
import { getCourseCategories } from '@/lib/api';
import CourseEditor from './CourseEditor';

interface Props {
  params: Promise<{ courseId: string }>;
}

interface AdminCourseDetail {
  id: string;
  title: string;
  description: string | null;
  status: string;
  categoryId: number;
  categoryName: string;
  totalLessons: number;
  studentCount: number;
  chapters: {
    id: string;
    title: string;
    sortOrder: number;
    lessons: {
      id: string;
      title: string;
      type: string;
      hasVideo: boolean;
      videoUrl: string | null;
      contentBody: string | null;
      durationSeconds: number | null;
      sortOrder: number;
      quizQuestions: {
        id: string;
        type: string;
        questionText: string;
        options: string[] | null;
        correctOptionIndex: number | null;
        conditions: string[] | null;
      }[];
    }[];
  }[];
}

export default async function CourseEditPage({ params }: Props) {
  const { courseId } = await params;
  const [course, categories] = await Promise.all([
    fetchData<AdminCourseDetail>(`/admin/courses/${courseId}`),
    getCourseCategories(),
  ]);

  return <CourseEditor course={course} categories={categories} />;
}
