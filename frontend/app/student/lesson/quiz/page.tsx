'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, Send, CheckCircle, Circle } from 'lucide-react';

const questions = [
  {
    id: 'q1',
    type: 'choice' as const,
    question: 'Q1. プロンプトにおいて「役割付与（Role-prompting）」を行う主な目的は何ですか？',
    options: [
      'AIの計算速度を上げるため',
      '出力のトーン＆マナーや専門性を制御するため',
      '文字数を制限するため',
    ],
  },
  {
    id: 'q2',
    type: 'text' as const,
    question: 'Q2. 以下の条件を満たすプロンプトを実際に作成してください。',
    conditions: [
      'ターゲット：新入社員',
      'テーマ：ビジネスマナーの基本',
      '出力形式：箇条書き（3つのポイント）',
    ],
  },
];

export default function LessonQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => {
    const answer = answers[q.id];
    return answer && answer.trim() !== '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex flex-col animate-in fade-in duration-300">
        <header className="h-14 md:h-16 bg-on-secondary-fixed text-white flex items-center px-3 md:px-6 shrink-0">
          <Link href="/student/lesson" className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="レッスンに戻る">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xs md:text-base ml-2 font-headline">理解度チェック＆課題</h1>
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
              href="/student/lesson"
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
      {/* Header */}
      <header className="h-14 md:h-16 bg-on-secondary-fixed text-white flex items-center justify-between px-3 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/student/lesson" className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0" aria-label="レッスンに戻る">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xs md:text-base font-headline">理解度チェック＆課題</h1>
        </div>
        <span className="text-[10px] md:text-xs text-slate-400 tracking-widest uppercase">
          Chapter 4 — Lesson 2
        </span>
      </header>

      {/* Quiz Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="p-5 md:p-8 lg:p-16 max-w-3xl mx-auto w-full">

          {/* Quiz Header */}
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface font-headline">プロンプトエンジニアリングの基礎と応用</h2>
              <p className="text-sm text-secondary mt-1">全{questions.length}問</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-8">
            {questions.map((q) => {
              const answered = answers[q.id] && answers[q.id].trim() !== '';
              return (
                <div key={q.id} className="flex items-center gap-1.5">
                  {answered ? (
                    <CheckCircle size={16} className="text-primary" />
                  ) : (
                    <Circle size={16} className="text-outline-variant" />
                  )}
                  <span className={`text-xs font-bold ${answered ? 'text-primary' : 'text-secondary'}`}>{q.id.toUpperCase()}</span>
                </div>
              );
            })}
          </div>

          <form className="space-y-8 md:space-y-12" onSubmit={handleSubmit}>
            {/* Q1 */}
            <fieldset className="bg-white p-5 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 space-y-5">
              <legend className="font-bold text-on-surface text-base md:text-lg">
                {questions[0].question}
              </legend>
              <div className="space-y-3">
                {questions[0].options!.map((option, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 md:p-4 border border-outline-variant/30 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input
                      type="radio"
                      name="q1"
                      value={option}
                      className="w-4 h-4 text-primary focus:ring-primary"
                      onChange={(e) => setAnswers(prev => ({ ...prev, q1: e.target.value }))}
                    />
                    <span className="text-sm font-medium text-on-surface-variant">{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q2 */}
            <div className="bg-white p-5 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 space-y-5">
              <label htmlFor="q2-answer" className="block font-bold text-on-surface text-base md:text-lg">
                {questions[1].question}
              </label>
              <div className="p-3 md:p-4 bg-surface-container-low rounded-xl text-sm text-on-surface-variant space-y-2">
                {questions[1].conditions!.map((c) => (
                  <p key={c}>・{c}</p>
                ))}
              </div>
              <textarea
                id="q2-answer"
                rows={5}
                className="w-full p-4 bg-white border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none text-sm"
                placeholder="プロンプトを入力..."
                value={answers.q2 ?? ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, q2: e.target.value }))}
              />
            </div>

            {/* Submit */}
            <div className="pt-4 flex items-center justify-between">
              <Link href="/student/lesson" className="text-sm font-bold text-secondary hover:text-on-surface transition-colors flex items-center gap-2">
                <ArrowLeft size={16} />
                レッスンに戻る
              </Link>
              <button
                type="submit"
                disabled={!allAnswered}
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Send size={18} />
                回答を送信
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
