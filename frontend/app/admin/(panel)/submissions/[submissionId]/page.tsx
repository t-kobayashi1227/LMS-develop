import type { Metadata } from 'next';
import type { SubmissionDetail } from '@/lib/types';
import { fetchData } from '@/lib/apiClient';
import GradingForm from './GradingForm';

export const metadata: Metadata = {
  title: '課題採点 | 管理者 | Niigata AI Academy',
};

interface Props {
  params: Promise<{ submissionId: string }>;
}

export default async function SubmissionGradePage({ params }: Props) {
  const { submissionId } = await params;
  const submission = await fetchData<SubmissionDetail>(`/admin/submissions/${submissionId}`);

  return <GradingForm submission={submission} />;
}
