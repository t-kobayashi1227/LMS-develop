'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, BarChart2, Edit, Trash2, Loader2 } from 'lucide-react';

interface Props {
  courseId: string;
}

export default function CourseRowActions({ courseId }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('このコースを削除しますか？')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('削除に失敗しました');
        return;
      }
      router.refresh();
    } catch {
      alert('サーバーに接続できません');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
      <Link href={`/student/lesson/${courseId}`} className="p-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-high" aria-label="プレビュー">
        <Eye size={16} />
      </Link>
      <button className="p-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container-high" aria-label="分析">
        <BarChart2 size={16} />
      </button>
      <Link href={`/admin/courses/${courseId}`} className="p-2 text-secondary hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high" aria-label="編集">
        <Edit size={16} />
      </Link>
      <button onClick={handleDelete} disabled={deleting} className="p-2 text-secondary hover:text-red-500 transition-colors rounded-full hover:bg-surface-container-high disabled:opacity-50" aria-label="削除">
        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      </button>
    </div>
  );
}
