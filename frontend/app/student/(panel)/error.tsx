'use client';

import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function StudentError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle size={32} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-on-surface font-headline mb-3">エラーが発生しました</h2>
      <p className="text-secondary mb-8 max-w-md">ページの読み込み中に問題が発生しました。再試行するか、ダッシュボードに戻ってください。</p>
      <div className="flex items-center gap-4">
        <button onClick={reset} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
          <RefreshCw size={16} /> 再試行
        </button>
        <Link href="/student/dashboard" className="px-6 py-3 border border-outline-variant/30 rounded-xl font-bold text-secondary hover:text-on-surface transition-colors">
          ダッシュボードに戻る
        </Link>
      </div>
    </div>
  );
}
