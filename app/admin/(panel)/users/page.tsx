'use client';

import { useState } from 'react';
import { Search, Filter, Mail, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockStudents } from '@/lib/mockData';

export default function AdminUserList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500 pb-24 overflow-x-hidden">

      {/* Header Section */}
      <div className="px-4 md:px-8 pt-6 md:pt-16 pb-6 md:pb-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-on-surface tracking-tight mb-3 md:mb-4">
              受講者管理
            </h2>
            <p className="text-secondary text-base md:text-lg font-light max-w-md">
              プラットフォームに登録されている受講者の学習状況やアカウントを管理します。
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
            <div className="relative flex items-center bg-surface-low rounded-full px-4 md:px-5 py-2.5 md:py-3 flex-1 md:w-72 border border-outline-variant/30 focus-within:border-on-surface transition-colors">
              <Search size={18} className="text-secondary" />
              <input
                type="text"
                placeholder="名前やメールアドレスで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-secondary/50 ml-2 md:ml-3 outline-none"
              />
            </div>
            <button className="p-2.5 md:p-3.5 bg-surface-low border border-outline-variant/30 rounded-full text-on-surface hover:bg-on-surface hover:text-white transition-colors shrink-0">
              <Filter size={18} />
            </button>
            <button className="px-6 py-2.5 md:py-3 bg-primary text-on-primary rounded-full text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap">
              新規登録
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
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">受講者</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">ステータス</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">登録コース数</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">平均進捗率</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">最終アクセス</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap text-right">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-on-surface">{student.name}</div>
                          <div className="text-xs text-secondary">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                        student.status === 'active'
                          ? 'bg-green-500/10 text-green-600'
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        {student.status === 'active' ? 'アクティブ' : '非アクティブ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-on-surface">
                      {student.enrolledCourses} コース
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-on-surface w-8">{student.progress}%</span>
                        <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                      {student.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-high">
                          <Mail size={16} />
                        </button>
                        <button className="p-2 text-secondary hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-secondary hover:text-red-500 transition-colors rounded-full hover:bg-surface-container-high">
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
              全 {filteredStudents.length} 件中 1 - {filteredStudents.length} 件を表示
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
