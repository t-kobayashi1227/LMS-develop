import type { Metadata } from 'next';
import { getCourseChapters, getLesson, getCurrentUser } from '@/lib/api';

export const metadata: Metadata = {
  title: 'レッスン | Niigata AI Academy',
};
import LessonView from './LessonView';

interface Props {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export default async function LessonPage({ params, searchParams }: Props) {
  const { courseId } = await params;
  const { preview } = await searchParams;
  const [courseData, user] = await Promise.all([
    getCourseChapters(courseId),
    getCurrentUser(),
  ]);

  const isPreview = preview === 'true' && user.role === 'admin';
  const backHref = user.role === 'admin' ? '/admin/courses' : '/student/dashboard';

  const allLessons = courseData.chapters.flatMap(ch => ch.lessons);
  const firstIncomplete = allLessons.find(l => !l.isCompleted && !l.isLocked);
  const activeLessonId = firstIncomplete?.id ?? allLessons[0]?.id ?? '';

  const initialLesson = activeLessonId ? await getLesson(activeLessonId) : null;

  return (
    <LessonView
      courseData={courseData}
      initialLessonId={activeLessonId}
      initialLessonDetail={initialLesson}
      backHref={backHref}
      preview={isPreview}
    />
  );
}
