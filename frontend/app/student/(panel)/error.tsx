'use client';

import DashboardError from '@/components/DashboardError';

export default function StudentError({ reset }: { error: Error; reset: () => void }) {
  return <DashboardError dashboardHref="/student/dashboard" reset={reset} />;
}
