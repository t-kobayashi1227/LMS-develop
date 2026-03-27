import { redirect } from 'next/navigation';
import { getLesson } from '@/lib/api';
import QuizView from './QuizView';

interface Props {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lessonId?: string }>;
}

export default async function QuizPage({ params, searchParams }: Props) {
  const { courseId } = await params;
  const { lessonId } = await searchParams;

  if (!lessonId) {
    redirect(`/student/lesson/${courseId}`);
  }

  const lesson = await getLesson(lessonId);

  if (!lesson.quizQuestions || lesson.quizQuestions.length === 0) {
    redirect(`/student/lesson/${courseId}`);
  }

  return (
    <QuizView
      courseId={courseId}
      lessonTitle={lesson.title}
      chapterTitle={lesson.chapterTitle}
      questions={lesson.quizQuestions}
    />
  );
}
