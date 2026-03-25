import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { mockCourses } from '../../mockData';

export default function CourseList({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = mockCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 pb-24 overflow-x-hidden">
      
      {/* Header Section */}
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

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
            <div className="relative flex items-center bg-surface-low rounded-full px-4 md:px-5 py-2.5 md:py-3 flex-1 md:w-72 border border-outline-variant/30 focus-within:border-on-surface transition-colors">
              <Search size={18} className="text-secondary" />
              <input 
                type="text" 
                placeholder="コース名やカテゴリで検索..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-secondary/50 ml-2 md:ml-3 outline-none"
              />
            </div>
            <button className="p-2.5 md:p-3.5 bg-surface-low border border-outline-variant/30 rounded-full text-on-surface hover:bg-on-surface hover:text-white transition-colors shrink-0">
              <Filter size={18} />
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 md:py-3 bg-primary text-on-primary rounded-full text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
              <Plus size={18} />
              <span className="hidden md:inline">新規作成</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
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
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <img src={course.thumbnail} alt={course.title} className="w-16 h-12 rounded-lg object-cover" />
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
                        <span className="text-sm font-bold text-on-surface font-mono">{Math.floor(Math.random() * 100) + 10}</span>
                        <span className="text-xs text-secondary">名</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-green-500/10 text-green-600">
                        公開中
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-high" title="プレビュー">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-high" title="分析">
                          <BarChart2 size={16} />
                        </button>
                        <button className="p-2 text-secondary hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high" title="編集">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-secondary hover:text-red-500 transition-colors rounded-full hover:bg-surface-container-high" title="削除">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-outline-variant/30 flex items-center justify-between">
            <div className="text-sm text-secondary">
              全 {filteredCourses.length} 件中 1 - {filteredCourses.length} 件を表示
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full border border-outline-variant/30 text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50">
                <ChevronLeft size={16} />
              </button>
              <button className="p-2 rounded-full border border-outline-variant/30 text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
