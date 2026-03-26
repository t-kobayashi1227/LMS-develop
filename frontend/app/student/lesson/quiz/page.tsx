import { redirect } from 'next/navigation';
import { getCourses } from '@/lib/api';

export default async function QuizRedirect() {
  const courses = await getCourses();
  const firstCourse = courses[0];
  if (firstCourse) {
    redirect(`/student/lesson/${firstCourse.id}/quiz`);
  }
  redirect('/student/dashboard');
}
