'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Course, CourseStatus } from '@/lib/types';
import CourseStatusBadge from './CourseStatusBadge';
import CourseRowActions from './CourseRowActions';

const filterTabs: { value: 'all' | CourseStatus; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'published', label: '公開中' },
  { value: 'draft', label: '下書き' },
  { value: 'archived', label: 'アーカイブ' },
];

interface Props {
  courses: Course[];
}

export default function AdminCourseTable({ courses }: Props) {
  const [filter, setFilter] = useState<'all' | CourseStatus>('all');

  const filtered = filter === 'all'
    ? courses
    : courses.filter((c) => c.status === filter);

  return (
    <>
      <div className="flex items-center gap-2 px-4 md:px-8 max-w-7xl mx-auto mb-4">
        {filterTabs.map((tab) => {
          const count = tab.value === 'all'
            ? courses.length
            : courses.filter((c) => c.status === tab.value).length;
          const active = filter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                active
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-secondary hover:text-on-surface'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">{count}</span>
            </button>
          );
        })}
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-secondary">
                      該当するコースがありません
                    </td>
                  </tr>
                ) : (
                  filtered.map((course) => (
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
                        <CourseStatusBadge status={course.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <CourseRowActions courseId={course.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between">
            <div className="text-sm text-secondary">
              全 {courses.length} 件中 {filtered.length} 件を表示
            </div>
            <div className="flex items-center gap-2">
              <button disabled className="p-2 rounded-full border border-outline-variant/30 text-secondary transition-colors disabled:opacity-50" aria-label="前のページ">
                <ChevronLeft size={16} />
              </button>
              <button disabled className="p-2 rounded-full border border-outline-variant/30 text-secondary transition-colors disabled:opacity-50" aria-label="次のページ">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
