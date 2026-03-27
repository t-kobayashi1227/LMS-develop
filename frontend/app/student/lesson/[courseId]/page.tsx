import type { Metadata } from 'next';
import { getCourseChapters, getLesson } from '@/lib/api';

export const metadata: Metadata = {
  title: 'レッスン | Niigata AI Academy',
};
import LessonView from './LessonView';

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { courseId } = await params;
  const courseData = await getCourseChapters(courseId);

  const allLessons = courseData.chapters.flatMap(ch => ch.lessons);
  const firstIncomplete = allLessons.find(l => !l.isCompleted && !l.isLocked);
  const activeLessonId = firstIncomplete?.id ?? allLessons[0]?.id ?? '';

  const initialLesson = activeLessonId ? await getLesson(activeLessonId) : null;

  return (
    <LessonView
      courseData={courseData}
      initialLessonId={activeLessonId}
      initialLessonDetail={initialLesson}
    />
  );
}
