import DashboardLayout from '@/components/DashboardLayout';
import { currentUser } from '@/lib/mockData';

export default function StudentPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout user={currentUser}>{children}</DashboardLayout>;
}
