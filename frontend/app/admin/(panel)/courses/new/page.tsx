import { getCourseCategories } from '@/lib/api';
import NewCourseForm from './NewCourseForm';

export default async function NewCoursePage() {
  const categories = await getCourseCategories();
  // "All" を除外
  const filtered = categories.filter(c => c !== 'All');
  return <NewCourseForm categories={filtered} />;
}
