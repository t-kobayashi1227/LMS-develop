import type { Metadata } from 'next';
import { getCourses, getCourseCategories } from '@/lib/api';
import CourseFilter from './CourseFilter';

export const metadata: Metadata = {
  title: 'マイコース | Niigata AI Academy',
};

export default async function StudentCourseList() {
  const [courses, categories] = await Promise.all([getCourses(), getCourseCategories()]);

  return (
    <div className="animate-in fade-in duration-500 pb-24 overflow-x-hidden">
      <div className="px-4 md:px-8 pt-6 md:pt-16 pb-6 md:pb-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-6xl font-serif font-bold text-on-surface tracking-tight mb-3 md:mb-4">
              Courses
            </h2>
            <p className="text-secondary text-base md:text-lg font-light max-w-md">
              Explore our curated curriculum designed to elevate your intelligence.
            </p>
          </div>
        </div>

        <CourseFilter courses={courses} categories={categories} />
      </div>
    </div>
  );
}
