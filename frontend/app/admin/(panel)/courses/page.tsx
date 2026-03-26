import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCourses } from '@/lib/api';
import CourseRowActions from '@/components/CourseRowActions';

export const metadata: Metadata = {
  title: 'コース管理 | 管理者 | Niigata AI Academy',
};

export default async function AdminCourseList() {
  const courses = await getCourses();

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
            <button className="p-2.5 md:p-3.5 bg-surface-low border border-outline-variant/30 rounded-full text-on-surface hover:bg-on-surface hover:text-white transition-colors shrink-0" aria-label="フィルター">
              <Filter size={18} />
            </button>
            <Link href="/admin/courses/new" className="flex items-center gap-2 px-6 py-2.5 md:py-3 bg-primary text-on-primary rounded-full text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
              <Plus size={18} />
              <span className="hidden md:inline">新規作成</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-surface-low rounded-3xl border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">コース情報</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">カテゴリ</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">レッスン数</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">受講者数</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">公開状態</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap text-right">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <Image src={course.thumbnail} alt={course.title} width={64} height={48} className="rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-on-surface max-w-[200px] truncate">{course.title}</div>
                          <div className="text-xs text-secondary max-w-[200px] truncate">{course.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-surface-container-high text-on-surface text-[10px] font-bold rounded-full uppercase tracking-widest">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-on-surface font-mono">
                      {course.totalLessons}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-on-surface font-mono">{course.studentCount}</span>
                        <span className="text-xs text-secondary">名</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-green-500/10 text-green-600">
                        公開中
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <CourseRowActions courseId={course.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between">
            <div className="text-sm text-secondary">
              全 {courses.length} 件中 1 - {courses.length} 件を表示
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full border border-outline-variant/30 text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50" aria-label="前のページ">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 rounded-full border border-outline-variant/30 text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50" aria-label="次のページ">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
