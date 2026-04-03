'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Users } from 'lucide-react';
import type { Enrollment, Student } from '@/lib/types';

interface Props {
  courseId: string;
}

export default function CourseEnrollments({ courseId }: Props) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}/enrollments`)
      .then(r => r.json())
      .then(data => setEnrollments(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm('この受講生の登録を解除しますか？進捗データも削除されます。')) return;
    const res = await fetch(`/api/admin/courses/${courseId}/enrollments/${enrollmentId}`, { method: 'DELETE' });
    if (res.ok) {
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
    }
  };

  const handleEnroll = async (studentId: string) => {
    const res = await fetch(`/api/admin/courses/${courseId}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    if (res.ok) {
      const data = await res.json();
      setEnrollments(prev => [data.data, ...prev]);
      setShowAddModal(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/20 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-secondary" />
          <h3 className="text-sm font-bold text-on-surface">受講生一覧</h3>
          <span className="text-xs text-secondary">({enrollments.length}名)</span>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-colors"
        >
          <Plus size={12} /> 受講生を追加
        </button>
      </div>

      {loading ? (
        <div className="px-5 py-8 text-center text-sm text-secondary">読み込み中...</div>
      ) : enrollments.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-secondary">受講生がいません</div>
      ) : (
        <div className="divide-y divide-outline-variant/10">
          {enrollments.map(e => (
            <div key={e.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-container-low/50 transition-colors">
              <div>
                <div className="text-sm font-bold text-on-surface">{e.studentName}</div>
                <div className="text-xs text-secondary">{e.studentEmail}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-secondary">
                  {e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString('ja-JP') : ''}
                </span>
                {e.completedAt && (
                  <span className="text-[10px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-bold">修了</span>
                )}
                <button
                  onClick={() => handleUnenroll(e.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="受講登録を解除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <StudentPickerModal
          courseId={courseId}
          enrolledStudentIds={enrollments.map(e => e.studentId)}
          onSelect={handleEnroll}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

function StudentPickerModal({
  courseId,
  enrolledStudentIds,
  onSelect,
  onClose,
}: {
  courseId: string;
  enrolledStudentIds: string[];
  onSelect: (studentId: string) => void;
  onClose: () => void;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/students')
      .then(r => r.json())
      .then(data => setStudents(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const available = students.filter(
    s => !enrolledStudentIds.includes(s.id) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-outline-variant/10">
          <h3 className="text-sm font-bold text-on-surface mb-3">受講生を追加</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors"
              placeholder="名前またはメールで検索..."
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-secondary">読み込み中...</div>
          ) : available.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-secondary">
              {search ? '該当する受講生がいません' : '追加可能な受講生がいません'}
            </div>
          ) : (
            available.map(s => (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low/50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="text-sm font-bold text-on-surface">{s.name}</div>
                  <div className="text-xs text-secondary">{s.email}</div>
                </div>
                <Plus size={14} className="text-primary shrink-0" />
              </button>
            ))
          )}
        </div>
        <div className="px-5 py-3 border-t border-outline-variant/10">
          <button onClick={onClose} className="text-sm text-secondary font-bold hover:text-on-surface transition-colors">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
