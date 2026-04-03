import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ShieldAlert } from 'lucide-react';
import { getCourseChapters, getLesson, getCurrentUser } from '@/lib/api';
import LessonView from './LessonView';

export const metadata: Metadata = {
  title: 'レッスン | Niigata AI Academy',
};

interface Props {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export default async function LessonPage({ params, searchParams }: Props) {
  const { courseId } = await params;
  const { preview } = await searchParams;

  let user;
  try {
    user = await getCurrentUser();
  } catch {
    return <ErrorPage message="ログインしてください。" href="/" linkText="ログインページへ" />;
  }

  const isPreview = preview === 'true' && user.role === 'admin';
  const backHref = user.role === 'admin' ? '/admin/courses' : '/student/dashboard';

  let courseData;
  try {
    courseData = await getCourseChapters(courseId);
  } catch {
    return (
      <ErrorPage
        icon="shield"
        message="このコースにアクセスできません。受講登録されていない可能性があります。"
        href={backHref}
        linkText="戻る"
      />
    );
  }

  const allLessons = courseData.chapters.flatMap(ch => ch.lessons);

  if (allLessons.length === 0) {
    return (
      <ErrorPage
        title={courseData.courseTitle}
        message="このコースにはまだレッスンがありません。"
        href={backHref}
        linkText="戻る"
      />
    );
  }

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

function ErrorPage({ title, message, href, linkText, icon }: {
  title?: string;
  message: string;
  href: string;
  linkText: string;
  icon?: 'shield';
}) {
  const Icon = icon === 'shield' ? ShieldAlert : BookOpen;
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
          <Icon size={28} className="text-secondary" />
        </div>
        {title && <h2 className="text-xl font-bold text-on-surface font-headline mb-2">{title}</h2>}
        <p className="text-secondary mb-6">{message}</p>
        <Link href={href} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
          {linkText}
        </Link>
      </div>
    </div>
  );
}
