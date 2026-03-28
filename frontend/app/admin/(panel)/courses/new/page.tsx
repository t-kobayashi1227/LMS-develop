import type { Metadata } from 'next';
import NewCourseForm from './NewCourseForm';

export const metadata: Metadata = {
  title: '新規コース作成 | 管理者 | Niigata AI Academy',
};

export default function NewCoursePage() {
  return <NewCourseForm />;
}
