import { redirect } from 'next/navigation';
import { getCourses } from '@/lib/api';

export default async function LessonRedirect() {
  const courses = await getCourses();
  const firstCourse = courses[0];
  if (firstCourse) {
    redirect(`/student/lesson/${firstCourse.id}`);
  }
  redirect('/student/dashboard');
}
