import type { Metadata } from 'next';
import { fetchData } from '@/lib/apiClient';
import GradingForm from './GradingForm';

export const metadata: Metadata = {
  title: '課題採点 | 管理者 | Niigata AI Academy',
};

interface SubmissionDetail {
  id: string;
  content: string | null;
  fileName: string | null;
  fileUrl: string | null;
  status: 'submitted' | 'graded';
  score: number | null;
  feedback: string | null;
  submittedAt: string | null;
  gradedAt: string | null;
  assignmentTitle: string;
  assignmentDescription: string | null;
  maxScore: number | null;
  courseName: string;
  studentName: string;
  studentEmail: string;
}

interface Props {
  params: Promise<{ submissionId: string }>;
}

export default async function SubmissionGradePage({ params }: Props) {
  const { submissionId } = await params;
  const submission = await fetchData<SubmissionDetail>(`/admin/submissions/${submissionId}`);

  return <GradingForm submission={submission} />;
}
