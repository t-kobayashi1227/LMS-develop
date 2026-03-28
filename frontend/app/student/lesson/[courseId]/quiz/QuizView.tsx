'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Send, CheckCircle, Circle } from 'lucide-react';
import type { QuizQuestion } from '@/lib/types';

interface Props {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  chapterTitle: string;
  questions: QuizQuestion[];
}

export default function QuizView({ courseId, lessonId, lessonTitle, chapterTitle, questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = questions.every((q) => {
    const answer = answers[q.id];
    return answer && answer.trim() !== '';
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch(`/api/lessons/${lessonId}/quiz-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });
    } catch {
      // 送信失敗しても完了画面は表示（オフライン対応）
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const lessonUrl = `/student/lesson/${courseId}`;

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex flex-col animate-in fade-in duration-300">
        <header className="h-14 md:h-16 bg-on-secondary-fixed text-white flex items-center px-3 md:px-6 shrink-0">
          <Link href={lessonUrl} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="レッスンに戻る">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xs md:text-base ml-2 font-headline">理解度チェック</h1>
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface font-headline mb-3">
              回答を送信しました
            </h2>
            <p className="text-secondary leading-relaxed mb-8">
              メンターが確認後、フィードバックをお送りします。
            </p>
            <Link
              href={lessonUrl}
              className="inline-flex items-center gap-2 px-8 py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
            >
              <ArrowLeft size={18} />
              レッスンに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col animate-in fade-in duration-300">
      <header className="h-14 md:h-16 bg-on-secondary-fixed text-white flex items-center justify-between px-3 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href={lessonUrl} className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0" aria-label="レッスンに戻る">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xs md:text-base font-headline">理解度チェック</h1>
        </div>
        <span className="text-[10px] md:text-xs text-slate-400 tracking-widest uppercase truncate max-w-[200px]">
          {chapterTitle}
        </span>
      </header>

      <div className="flex-1 overflow-y-auto bg-background">
        <div className="p-5 md:p-8 lg:p-16 max-w-3xl mx-auto w-full">

          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface font-headline">{lessonTitle}</h2>
              <p className="text-sm text-secondary mt-1">全{questions.length}問</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            {questions.map((q, i) => {
              const answered = answers[q.id] && answers[q.id].trim() !== '';
              return (
                <div key={q.id} className="flex items-center gap-1.5">
                  {answered ? (
                    <CheckCircle size={16} className="text-primary" />
                  ) : (
                    <Circle size={16} className="text-outline-variant" />
                  )}
                  <span className={`text-xs font-bold ${answered ? 'text-primary' : 'text-secondary'}`}>Q{i + 1}</span>
                </div>
              );
            })}
          </div>

          <form className="space-y-8 md:space-y-12" onSubmit={handleSubmit}>
            {questions.map((q, i) => (
              <div key={q.id}>
                {q.type === 'choice' && q.options ? (
                  <fieldset className="bg-white p-5 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 space-y-5">
                    <legend className="font-bold text-on-surface text-base md:text-lg">
                      Q{i + 1}. {q.questionText}
                    </legend>
                    <div className="space-y-3">
                      {q.options.map((option, j) => (
                        <label key={j} className="flex items-center gap-3 p-3 md:p-4 border border-outline-variant/30 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <input
                            type="radio"
                            name={q.id}
                            value={option}
                            className="w-4 h-4 text-primary focus:ring-primary"
                            onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          />
                          <span className="text-sm font-medium text-on-surface-variant">{option}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ) : (
                  <div className="bg-white p-5 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 space-y-5">
                    <label htmlFor={`answer-${q.id}`} className="block font-bold text-on-surface text-base md:text-lg">
                      Q{i + 1}. {q.questionText}
                    </label>
                    {q.conditions && q.conditions.length > 0 && (
                      <div className="p-3 md:p-4 bg-surface-container-low rounded-xl text-sm text-on-surface-variant space-y-2">
                        {q.conditions.map((c) => (
                          <p key={c}>・{c}</p>
                        ))}
                      </div>
                    )}
                    <textarea
                      id={`answer-${q.id}`}
                      rows={5}
                      className="w-full p-4 bg-white border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none text-sm"
                      placeholder="回答を入力..."
                      value={answers[q.id] ?? ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 flex items-center justify-between">
              <Link href={lessonUrl} className="text-sm font-bold text-secondary hover:text-on-surface transition-colors flex items-center gap-2">
                <ArrowLeft size={16} />
                レッスンに戻る
              </Link>
              <button
                type="submit"
                disabled={!allAnswered || submitting}
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Send size={18} />
                {submitting ? '送信中...' : '回答を送信'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
