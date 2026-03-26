import { getCourseChapters, getLesson } from '@/lib/api';
import QuizView from './QuizView';

interface Props {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lessonId?: string }>;
}

export default async function QuizPage({ params, searchParams }: Props) {
  const { courseId } = await params;
  const { lessonId } = await searchParams;

  // lessonId が指定されていない場合、最初のクイズ付きレッスンを探す
  let targetLessonId = lessonId;
  if (!targetLessonId) {
    const courseData = await getCourseChapters(courseId);
    const allLessons = courseData.chapters.flatMap(ch => ch.lessons);
    // クイズ付きレッスンはAPI経由では判別できないので最初のレッスンを使う
    targetLessonId = allLessons[0]?.id;
  }

  if (!targetLessonId) {
    return <div className="p-8 text-center text-secondary">レッスンが見つかりません</div>;
  }

  const lesson = await getLesson(targetLessonId);

  if (!lesson.quizQuestions || lesson.quizQuestions.length === 0) {
    return <div className="p-8 text-center text-secondary">このレッスンにはクイズがありません</div>;
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
