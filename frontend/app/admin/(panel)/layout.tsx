import DashboardLayout from '@/components/DashboardLayout';
import { getCurrentUser } from '@/lib/api';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
