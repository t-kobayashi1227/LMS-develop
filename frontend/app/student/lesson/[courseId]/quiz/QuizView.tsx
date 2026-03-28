'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Send, CheckCircle, Circle, XCircle, BookOpen, type LucideIcon } from 'lucide-react';
import type { QuizQuestion, QuizResult } from '@/lib/types';

function ExplanationBlock({ icon: Icon, label, text }: { icon: LucideIcon; label: string; text: string }) {
  return (
    <div className="p-4 bg-tertiary/5 rounded-xl border border-tertiary/20">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-tertiary" />
        <span className="text-xs font-bold text-tertiary uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  );
}

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
  const [results, setResults] = useState<QuizResult[] | null>(null);

  const allAnswered = questions.every((q) => {
    const answer = answers[q.id];
    return answer && answer.trim() !== '';
  });

  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch(`/api/lessons/${lessonId}/quiz-answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });

      if (!res.ok) {
        setSubmitError(true);
        setSubmitting(false);
        return;
      }

      const data = await res.json();
      setResults(data.data?.results ?? null);
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const lessonUrl = `/student/lesson/${courseId}`;

  if (submitted && results && results.length > 0) {
    const choiceResults = results.filter((r) => r.type === 'choice');
    const correctCount = choiceResults.filter((r) => r.isCorrect).length;
    const resultMap = new Map(results.map((r) => [r.questionId, r]));

    return (
      <div className="min-h-screen bg-surface flex flex-col animate-in fade-in duration-300">
        <header className="h-14 md:h-16 bg-on-secondary-fixed text-white flex items-center justify-between px-3 md:px-6 shrink-0 z-20">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <Link href={lessonUrl} className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0" aria-label="レッスンに戻る">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-xs md:text-base font-headline">理解度チェック — 結果</h1>
          </div>
          <span className="text-[10px] md:text-xs text-slate-400 tracking-widest uppercase truncate max-w-[200px]">
            {chapterTitle}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto bg-background">
          <div className="p-5 md:p-8 lg:p-16 max-w-3xl mx-auto w-full">

            {choiceResults.length > 0 && (
              <div className="flex items-center gap-4 mb-8 md:mb-12">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-on-surface font-headline">{lessonTitle}</h2>
                  <p className="text-sm text-secondary mt-1">
                    選択式: <span className="font-bold text-primary">{correctCount}/{choiceResults.length}</span> 正解
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-8 md:space-y-12">
              {questions.map((q, i) => {
                const result = resultMap.get(q.id);
                if (!result) return null;

                return (
                  <div key={q.id}>
                    {q.type === 'choice' && q.options ? (
                      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 space-y-5">
                        <div className="flex items-start gap-3">
                          {result.isCorrect ? (
                            <CheckCircle size={22} className="text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle size={22} className="text-red-500 shrink-0 mt-0.5" />
                          )}
                          <p className="font-bold text-on-surface text-base md:text-lg">
                            Q{i + 1}. {q.questionText}
                          </p>
                        </div>
                        <div className="space-y-3">
                          {q.options.map((option, j) => {
                            const isCorrectOption = j === result.correctOptionIndex;
                            const isSelected = answers[q.id] === option;
                            const isWrongSelection = isSelected && !isCorrectOption;

                            return (
                              <div
                                key={j}
                                className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-colors ${
                                  isCorrectOption
                                    ? 'border-green-400 bg-green-50'
                                    : isWrongSelection
                                      ? 'border-red-300 bg-red-50'
                                      : 'border-outline-variant/30'
                                }`}
                              >
                                {isCorrectOption ? (
                                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                                ) : isWrongSelection ? (
                                  <XCircle size={16} className="text-red-500 shrink-0" />
                                ) : (
                                  <Circle size={16} className="text-outline-variant shrink-0" />
                                )}
                                <span className={`text-sm font-medium ${
                                  isCorrectOption ? 'text-green-700' : isWrongSelection ? 'text-red-600' : 'text-on-surface-variant'
                                }`}>{option}</span>
                              </div>
                            );
                          })}
                        </div>
                        {result.explanation && (
                          <ExplanationBlock icon={Lightbulb} label="解説" text={result.explanation} />
                        )}
                      </div>
                    ) : (
                      <div className="bg-white p-5 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 space-y-5">
                        <p className="font-bold text-on-surface text-base md:text-lg">
                          Q{i + 1}. {q.questionText}
                        </p>
                        <div className="p-4 bg-surface-container-low rounded-xl">
                          <span className="text-xs font-bold text-secondary uppercase tracking-widest block mb-2">あなたの回答</span>
                          <p className="text-sm text-on-surface whitespace-pre-wrap">{answers[q.id]}</p>
                        </div>
                        {result.explanation && (
                          <ExplanationBlock icon={BookOpen} label="解説・模範解答" text={result.explanation} />
                        )}
                        <p className="text-xs text-secondary">※ メンターからのフィードバックも別途届く場合があります</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-8 flex justify-center">
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

            {submitError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                送信に失敗しました。もう一度お試しください。
              </div>
            )}

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
