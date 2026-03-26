import type { Metadata } from 'next';
import { getStudents } from '@/lib/api';
import AdminUserTable from '@/components/AdminUserTable';

export const metadata: Metadata = {
  title: '受講者管理 | 管理者 | Niigata AI Academy',
};

export default async function AdminUserList() {
  const students = await getStudents();

  return <AdminUserTable students={students} />;
}
