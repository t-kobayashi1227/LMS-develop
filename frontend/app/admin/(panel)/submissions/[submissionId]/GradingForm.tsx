'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, CheckCircle, FileText, Download } from 'lucide-react';
import type { SubmissionDetail } from '@/lib/types';

interface Props {
  submission: SubmissionDetail;
}

export default function GradingForm({ submission: initial }: Props) {
  const [score, setScore] = useState(initial.score !== null ? String(initial.score) : '');
  const [feedback, setFeedback] = useState(initial.feedback ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(initial.status);

  const handleGrade = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/admin/submissions/${initial.id}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: score ? Number(score) : null,
          feedback: feedback || null,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('graded');
      setMessage('採点を保存しました');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-6 max-w-3xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-on-surface transition-colors mb-6">
          <ArrowLeft size={16} /> ダッシュボードに戻る
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-on-surface tracking-tight">
            {initial.assignmentTitle}
          </h2>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
            status === 'graded' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
          }`}>
            {status === 'graded' ? '採点済み' : '未採点'}
          </span>
        </div>
        <p className="text-sm text-secondary mb-8">{initial.courseName} • {initial.studentName} ({initial.studentEmail})</p>

        <div className="space-y-6">
          {/* Assignment description */}
          {initial.assignmentDescription && (
            <div className="bg-surface-container-low/50 p-5 rounded-2xl">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">課題内容</span>
              <p className="text-sm text-on-surface-variant leading-relaxed">{initial.assignmentDescription}</p>
            </div>
          )}

          {/* Student's submission */}
          <div className="bg-white rounded-2xl border border-outline-variant/20 p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">受講生の提出内容</span>
              {initial.submittedAt && (
                <span className="text-xs text-secondary ml-auto">
                  {new Date(initial.submittedAt).toLocaleString('ja-JP')}
                </span>
              )}
            </div>

            {initial.content && (
              <div className="p-4 bg-surface-container-low rounded-xl">
                <p className="text-sm text-on-surface whitespace-pre-wrap">{initial.content}</p>
              </div>
            )}

            {initial.fileName && (
              <div className="flex items-center gap-3">
                {initial.fileUrl ? (
                  <a href={initial.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-surface-low border border-outline-variant/30 rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors">
                    <Download size={14} /> {initial.fileName}
                  </a>
                ) : (
                  <span className="text-sm text-secondary">{initial.fileName}</span>
                )}
              </div>
            )}

            {!initial.content && !initial.fileName && (
              <p className="text-sm text-secondary italic">提出内容がありません</p>
            )}
          </div>

          {/* Grading form */}
          <div className="bg-white rounded-2xl border border-outline-variant/20 p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">採点</span>
            </div>

            {initial.maxScore !== null && (
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                  スコア（最大 {initial.maxScore} 点）
                </label>
                <input
                  type="number"
                  value={score}
                  onChange={e => setScore(e.target.value)}
                  min={0}
                  max={initial.maxScore ?? undefined}
                  step="0.01"
                  className="w-32 px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors"
                  placeholder="0"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">フィードバック</label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors resize-y"
                placeholder="受講生へのフィードバックを入力..."
              />
            </div>

            {message && (
              <span className={`text-sm font-medium ${message.includes('失敗') ? 'text-red-500' : 'text-green-600'}`}>{message}</span>
            )}

            <button
              onClick={handleGrade}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? '保存中...' : '採点を保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
