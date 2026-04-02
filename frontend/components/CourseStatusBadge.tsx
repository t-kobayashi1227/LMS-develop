import type { CourseStatus } from '@/lib/types';

const statusConfig: Record<CourseStatus, { label: string; className: string }> = {
  published: {
    label: '公開中',
    className: 'bg-green-500/10 text-green-600',
  },
  draft: {
    label: '下書き',
    className: 'bg-amber-500/10 text-amber-600',
  },
  archived: {
    label: 'アーカイブ',
    className: 'bg-gray-500/10 text-gray-500',
  },
};

interface Props {
  status: CourseStatus;
}

export default function CourseStatusBadge({ status }: Props) {
  const config = statusConfig[status] ?? statusConfig.draft;
  return (
    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
}
