'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, PlayCircle, FileText, CheckCircle2, Lock, Download, Lightbulb, List, ChevronUp } from 'lucide-react';

export default function LessonView() {
  const [playlistOpen, setPlaylistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col animate-in fade-in duration-300">
      {/* Lesson Header */}
      <header className="h-14 md:h-16 bg-on-secondary-fixed text-white flex items-center justify-between px-3 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/student/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0" aria-label="ダッシュボードに戻る">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xs md:text-base truncate max-w-[180px] sm:max-w-xs md:max-w-md font-headline">
            AI時代のデジタル・エディトリアル戦略
          </h1>
        </div>
        <span className="text-[10px] md:text-xs font-medium text-slate-400 hidden sm:block tracking-widest uppercase">
          進捗: 85% (12/14)
        </span>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-background flex flex-col relative">

          {/* Video Player */}
          <div className="aspect-video w-full bg-black relative group shrink-0">
            <Image
              src="https://placehold.co/1200x675/e2e8f0/475569?text=Video+Content"
              alt="Video Content"
              fill
              className="object-cover opacity-50"
              sizes="100vw"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform" aria-label="再生">
                <PlayCircle size={40} strokeWidth={1.5} className="md:hidden" />
                <PlayCircle size={48} strokeWidth={1.5} className="hidden md:block" />
              </button>
            </div>
            {/* Controls Bar */}
            <div className="absolute bottom-0 w-full p-3 md:p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-3 md:gap-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button aria-label="再生">
                <PlayCircle size={20} className="text-white md:hidden" />
                <PlayCircle size={24} className="text-white hidden md:block" />
              </button>
              <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                <div className="h-full bg-primary w-[65%] relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <span className="text-white text-[10px] md:text-xs font-mono">10:24 / 15:00</span>
            </div>
          </div>

          {/* Article Content below video */}
          <div className="p-5 md:p-8 lg:p-16 max-w-3xl mx-auto w-full">

            {/* Lesson Header */}
            <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-widest">
                  Chapter 4
                </span>
                <span className="text-sm text-secondary font-medium">Lesson 2</span>
                <span className="text-sm text-slate-300 mx-1 md:mx-2">|</span>
                <span className="text-sm text-secondary flex items-center gap-1">
                  <FileText size={14} />
                  読了目安: 10分
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-on-surface font-headline leading-tight">
                プロンプトエンジニアリングの基礎と応用
              </h2>
              <p className="text-lg md:text-xl text-secondary font-light leading-relaxed">
                LLM（大規模言語モデル）から高品質な出力を得るためのプロンプト設計の基本原則と、実践的なテクニックを解説します。
              </p>
            </div>

            {/* Learning Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-14">
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
                <h4 className="font-bold mb-4 flex items-center gap-2 font-headline">
                  <Lightbulb className="text-primary" size={20} />
                  学習のポイント
                </h4>
                <ul className="text-sm space-y-3 text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                    <span>コンテキストの明確化と制約条件の与え方</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                    <span>出力フォーマットの指定手法（JSON, Markdown等）</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                    <span>ハルシネーションを軽減するためのプロンプト構造</span>
                  </li>
                </ul>
              </div>

              <div className="bg-surface-container-low p-5 md:p-6 rounded-2xl border-l-4 border-tertiary">
                <h4 className="font-bold mb-4 font-headline">ダウンロード資料</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-outline-variant/10 hover:border-tertiary/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-tertiary" />
                      <span className="text-sm font-medium text-on-surface group-hover:text-tertiary transition-colors">プロンプトテンプレート集</span>
                    </div>
                    <Download size={16} className="text-slate-400 group-hover:text-tertiary" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-outline-variant/10 hover:border-tertiary/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-tertiary" />
                      <span className="text-sm font-medium text-on-surface group-hover:text-tertiary transition-colors">講義スライド (PDF)</span>
                    </div>
                    <Download size={16} className="text-slate-400 group-hover:text-tertiary" />
                  </button>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="prose prose-slate prose-lg max-w-none mb-12 md:mb-16 text-on-surface-variant">
              <h3 className="text-xl md:text-2xl font-bold text-on-surface mt-8 mb-4">1. コンテキストの明確化</h3>
              <p className="mb-6 leading-relaxed">
                AIに対して指示を出す際、最も重要なのは「前提条件（コンテキスト）」を明確にすることです。単に「記事を書いて」と指示するのではなく、「誰に向けて」「どのような目的で」「どんなトーンで」書くのかを指定することで、出力の精度は劇的に向上します。
              </p>

              <div className="bg-surface-container-low p-4 md:p-6 rounded-2xl border-l-4 border-primary mb-8">
                <h4 className="font-bold text-sm text-primary uppercase tracking-widest mb-2">Bad Prompt</h4>
                <p className="text-sm italic mb-4">「AIの導入メリットについての記事を書いてください。」</p>
                <h4 className="font-bold text-sm text-primary uppercase tracking-widest mb-2">Good Prompt</h4>
                <p className="text-sm italic">「あなたはITコンサルタントです。初めてAIツールを導入する中小企業の経営者に向けて、業務効率化の観点からAI導入のメリットを解説するブログ記事を作成してください。専門用語は避け、親しみやすいトーンでお願いします。」</p>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-on-surface mt-8 mb-4">2. 出力フォーマットの指定</h3>
              <p className="mb-6 leading-relaxed">
                業務でAIの出力を活用する場合、そのままシステムに組み込んだり、資料に転記したりしやすいフォーマットで出力させることが重要です。MarkdownやJSON、CSVなどの形式を明示的に指定しましょう。
              </p>

              <hr className="my-8 md:my-12 border-outline-variant/20" />
            </div>

            {/* CTA to Quiz Page */}
            <Link
              href="/student/lesson/quiz"
              className="flex items-center justify-between p-5 md:p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 group hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                  <Lightbulb size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-on-surface font-headline group-hover:text-primary transition-colors">理解度チェック＆課題</h3>
                  <p className="text-sm text-secondary mt-1">このレッスンの理解度を確認しましょう</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shrink-0">
                <ArrowLeft size={18} className="rotate-180" />
              </div>
            </Link>

          </div>
        </div>

        {/* Sidebar (Playlist) */}
        <div className={`w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-outline-variant/10 shrink-0 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] ${playlistOpen ? 'max-h-[60vh]' : 'max-h-0 lg:max-h-none'} lg:max-h-none overflow-hidden transition-all duration-300`}>
          <div className="overflow-y-auto h-full max-h-[60vh] lg:max-h-none lg:h-full">
            <div className="p-4 md:p-6 border-b border-outline-variant/10 sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <h3 className="font-bold font-headline text-base md:text-lg">コースの内容</h3>
              <p className="text-xs text-secondary mt-1">全24レッスン中 12完了</p>
            </div>

            <div className="divide-y divide-surface-container-low">
              {/* Chapter 1 */}
              <div className="bg-surface p-4 sticky top-[73px] lg:top-[89px] z-10 border-b border-outline-variant/10">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">セクション 1: 基礎理論</span>
              </div>

              <div className="p-4 flex items-start gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="mt-1 flex-shrink-0">
                  <CheckCircle2 size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">1. イントロダクション</p>
                  <p className="text-xs text-secondary mt-1">動画 2:30 + テキスト</p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-4 bg-primary/5 border-l-4 border-primary transition-colors cursor-pointer">
                <div className="mt-1 flex-shrink-0">
                  <PlayCircle size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-primary">2. プロンプトエンジニアリングの基礎と応用</p>
                  <p className="text-xs text-primary font-medium mt-1">学習中 • 動画 15:00 + テキスト</p>
                </div>
              </div>

              {/* Chapter 2 */}
              <div className="bg-surface p-4 sticky top-[73px] lg:top-[89px] z-10 border-b border-outline-variant/10 border-t">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">セクション 2: 実践演習</span>
              </div>

              <div className="p-4 flex items-start gap-4 hover:bg-surface-container-low transition-colors cursor-pointer opacity-60">
                <div className="mt-1 flex-shrink-0">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">3. 記事構成案の作成ワーク</p>
                  <p className="text-xs text-secondary mt-1">テキスト • 読了 8分</p>
                </div>
              </div>

              <div className="p-4 flex items-start gap-4 hover:bg-surface-container-low transition-colors cursor-pointer opacity-60">
                <div className="mt-1 flex-shrink-0">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-on-surface">4. トーン＆マナーの調整テクニック</p>
                  <p className="text-xs text-secondary mt-1">動画 12:20 + テキスト</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Playlist Toggle */}
        <button
          onClick={() => setPlaylistOpen(!playlistOpen)}
          className="lg:hidden fixed bottom-6 right-5 z-50 bg-on-surface text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          aria-label={playlistOpen ? 'プレイリストを閉じる' : 'プレイリストを開く'}
        >
          {playlistOpen ? <ChevronUp size={20} /> : <List size={20} />}
        </button>
      </div>
    </div>
  );
}
