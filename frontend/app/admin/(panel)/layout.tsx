import DashboardLayout from '@/components/DashboardLayout';
import { adminUser } from '@/lib/mockData';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout user={adminUser}>{children}</DashboardLayout>;
}
