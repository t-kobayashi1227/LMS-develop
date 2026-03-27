'use client';

import DashboardError from '@/components/DashboardError';

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return <DashboardError dashboardHref="/admin/dashboard" reset={reset} />;
}
