'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, BarChart2, Edit, Trash2 } from 'lucide-react';

interface Props {
  courseId: string;
}

export default function CourseRowActions({ courseId }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('このコースを削除しますか？')) return;
    const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
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
      <button onClick={handleDelete} className="p-2 text-secondary hover:text-red-500 transition-colors rounded-full hover:bg-surface-container-high" aria-label="削除">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
