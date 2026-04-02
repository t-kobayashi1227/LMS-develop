import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAdminCourses } from '@/lib/api';
import AdminCourseTable from '@/components/AdminCourseTable';

export const metadata: Metadata = {
  title: 'コース管理 | 管理者 | Niigata AI Academy',
};

export default async function AdminCourseList() {
  const courses = await getAdminCourses();

  return (
    <div className="animate-in fade-in duration-500 pb-24 overflow-x-hidden">

      <div className="px-4 md:px-8 pt-6 md:pt-16 pb-6 md:pb-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-on-surface tracking-tight mb-3 md:mb-4">
              コース管理
            </h2>
            <p className="text-secondary text-base md:text-lg font-light max-w-md">
              提供中のコースの編集、新規作成、および受講状況の分析を行います。
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0 justify-end">
            <Link href="/admin/courses/new" className="flex items-center gap-2 px-6 py-2.5 md:py-3 bg-primary text-on-primary rounded-full text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
              <Plus size={18} />
              <span className="hidden md:inline">新規作成</span>
            </Link>
          </div>
        </div>
      </div>

      <AdminCourseTable courses={courses} />
    </div>
  );
}
