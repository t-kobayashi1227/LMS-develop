'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, FileText, CheckCircle2, Lock, Download, Send, BrainCircuit, MonitorPlay, AlignLeft } from 'lucide-react';

export default function LessonView() {
  const [activeTab, setActiveTab] = useState<'content' | 'assignment'>('content');
  const [lessonMode, setLessonMode] = useState<'video' | 'text'>('text');

  return (
    <div className="min-h-screen bg-surface flex flex-col animate-in fade-in duration-300">
      {/* Lesson Header */}
      <header className="h-16 bg-on-secondary-fixed text-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-sm md:text-base truncate max-w-xs md:max-w-md font-headline">
            AI時代のデジタル・エディトリアル戦略
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Mode Toggle for Prototype Demonstration */}
          <div className="hidden md:flex items-center bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setLessonMode('video')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${lessonMode === 'video' ? 'bg-white text-on-secondary-fixed' : 'text-white/70 hover:text-white'}`}
            >
              <MonitorPlay size={14} />
              動画
            </button>
            <button
              onClick={() => setLessonMode('text')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${lessonMode === 'text' ? 'bg-white text-on-secondary-fixed' : 'text-white/70 hover:text-white'}`}
            >
              <AlignLeft size={14} />
              テキスト
            </button>
          </div>

          <span className="text-xs font-medium text-slate-400 hidden sm:block tracking-widest uppercase ml-4">
            進捗: 85% (12/14)
          </span>
          {lessonMode === 'video' && (
            <button
              onClick={() => setActiveTab('assignment')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'assignment'
                  ? 'bg-white text-on-secondary-fixed'
                  : 'bg-primary hover:bg-primary-container text-white'
              }`}
            >
              課題に取り組む
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-background flex flex-col relative">

          {lessonMode === 'video' ? (
            /* VIDEO MODE */
            activeTab === 'content' ? (
              <>
                {/* Video Player Mockup */}
                <div className="aspect-video w-full bg-black relative group shrink-0">
                  <img
                    src="https://placehold.co/1200x675/e2e8f0/475569?text=Video+Content"
                    alt="Video Content"
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform">
                      <PlayCircle size={48} strokeWidth={1.5} />
                    </button>
                  </div>
                  {/* Controls Bar Mock */}
                  <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={24} className="text-white" />
                    <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                      <div className="h-full bg-primary w-[65%] relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                      </div>
                    </div>
                    <span className="text-white text-xs font-mono">10:24 / 15:00</span>
                  </div>
                </div>

                {/* Description Area */}
                <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full">
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-widest">
                          Chapter 4
                        </span>
                        <span className="text-sm text-secondary font-medium">Lesson 2</span>
                      </div>
                      <h2 className="text-3xl font-extrabold text-on-surface mb-6 font-headline leading-tight">
                        プロンプトエンジニアリングの基礎と応用
                      </h2>
                      <p className="text-on-surface-variant leading-relaxed text-lg font-light">
                        このレッスンでは、LLM（大規模言語モデル）から高品質な出力を得るためのプロンプト設計の基本原則を学びます。Zero-shot, Few-shotプロンプティングの違いから、役割付与（Role-prompting）によるトーン＆マナーの制御まで、実践的なテクニックを解説します。
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div className="bg-white p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
                        <h4 className="font-bold mb-4 flex items-center gap-2 font-headline">
                          <BrainCircuit className="text-primary" size={20} />
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

                      <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-tertiary">
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
                  </div>
                </div>
              </>
            ) : (
              /* Assignment Submission Area (Video Mode) */
              <div className="p-8 lg:p-12 max-w-3xl mx-auto w-full animate-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-on-surface mb-4 font-headline">
                    課題：ペルソナ設定プロンプトの作成
                  </h2>
                  <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20 text-on-surface-variant text-sm leading-relaxed space-y-4">
                    <p>
                      <strong>課題内容：</strong><br/>
                      本レッスンで学んだ「役割付与（Role-prompting）」の技術を用いて、特定のターゲット層に向けた記事の構成案を出力させるためのプロンプトを作成してください。
                    </p>
                    <p>
                      <strong>条件：</strong><br/>
                      1. ターゲットは「初めてAIツールを導入する中小企業の経営者」<br/>
                      2. 専門用語を避け、メリットが伝わるトーンを指定すること<br/>
                      3. 出力形式は「タイトル案（3つ）」「見出し構成」「想定される読者の疑問」を含むこと
                    </p>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">
                      回答を入力
                    </label>
                    <textarea
                      rows={10}
                      className="w-full p-4 bg-white border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none text-sm"
                      placeholder="ここに作成したプロンプトを入力してください..."
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">または</span>
                    <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-on-surface mb-2">
                      ファイルをアップロード
                    </label>
                    <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-8 text-center hover:bg-surface-container-low transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Download size={24} className="rotate-180" />
                      </div>
                      <p className="text-sm font-medium text-on-surface">クリックしてファイルを選択、またはドラッグ＆ドロップ</p>
                      <p className="text-xs text-secondary mt-1">PDF, Word, TXT (最大 10MB)</p>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button className="flex items-center gap-2 px-8 py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">
                      <Send size={18} />
                      課題を提出する
                    </button>
                  </div>
                </form>
              </div>
            )
          ) : (
            /* TEXT MODE (Article + Embedded Form) */
            <div className="p-8 lg:p-16 max-w-3xl mx-auto w-full animate-in fade-in duration-500">

              {/* Article Header */}
              <div className="mb-12 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-widest">
                    Chapter 4
                  </span>
                  <span className="text-sm text-secondary font-medium">Lesson 2</span>
                  <span className="text-sm text-slate-300 mx-2">|</span>
                  <span className="text-sm text-secondary flex items-center gap-1">
                    <FileText size={14} />
                    読了目安: 10分
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface font-headline leading-tight">
                  プロンプトエンジニアリングの基礎と応用
                </h2>
                <p className="text-xl text-secondary font-light leading-relaxed">
                  LLM（大規模言語モデル）から高品質な出力を得るためのプロンプト設計の基本原則と、実践的なテクニックを解説します。
                </p>
              </div>

              {/* Article Content */}
              <div className="prose prose-slate prose-lg max-w-none mb-16 text-on-surface-variant">
                <h3 className="text-2xl font-bold text-on-surface mt-8 mb-4">1. コンテキストの明確化</h3>
                <p className="mb-6 leading-relaxed">
                  AIに対して指示を出す際、最も重要なのは「前提条件（コンテキスト）」を明確にすることです。単に「記事を書いて」と指示するのではなく、「誰に向けて」「どのような目的で」「どんなトーンで」書くのかを指定することで、出力の精度は劇的に向上します。
                </p>

                <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary mb-8">
                  <h4 className="font-bold text-sm text-primary uppercase tracking-widest mb-2">Bad Prompt</h4>
                  <p className="text-sm italic mb-4">「AIの導入メリットについての記事を書いてください。」</p>
                  <h4 className="font-bold text-sm text-primary uppercase tracking-widest mb-2">Good Prompt</h4>
                  <p className="text-sm italic">「あなたはITコンサルタントです。初めてAIツールを導入する中小企業の経営者に向けて、業務効率化の観点からAI導入のメリットを解説するブログ記事を作成してください。専門用語は避け、親しみやすいトーンでお願いします。」</p>
                </div>

                <h3 className="text-2xl font-bold text-on-surface mt-8 mb-4">2. 出力フォーマットの指定</h3>
                <p className="mb-6 leading-relaxed">
                  業務でAIの出力を活用する場合、そのままシステムに組み込んだり、資料に転記したりしやすいフォーマットで出力させることが重要です。MarkdownやJSON、CSVなどの形式を明示的に指定しましょう。
                </p>

                <hr className="my-12 border-outline-variant/20" />
              </div>

              {/* Embedded Questionnaire / Assignment Form */}
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                    <BrainCircuit size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-on-surface font-headline">理解度チェック＆課題</h3>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

                  {/* Question 1: Multiple Choice */}
                  <div className="space-y-4">
                    <label className="block font-bold text-on-surface">
                      Q1. プロンプトにおいて「役割付与（Role-prompting）」を行う主な目的は何ですか？
                    </label>
                    <div className="space-y-3">
                      {['AIの計算速度を上げるため', '出力のトーン＆マナーや専門性を制御するため', '文字数を制限するため'].map((option, i) => (
                        <label key={i} className="flex items-center gap-3 p-4 border border-outline-variant/30 rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                          <input type="radio" name="q1" className="w-4 h-4 text-primary focus:ring-primary" />
                          <span className="text-sm font-medium text-on-surface-variant">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Question 2: Text Area */}
                  <div className="space-y-4">
                    <label className="block font-bold text-on-surface">
                      Q2. 以下の条件を満たすプロンプトを実際に作成してください。
                    </label>
                    <div className="p-4 bg-surface-container-low rounded-xl text-sm text-on-surface-variant space-y-2">
                      <p>・ターゲット：新入社員</p>
                      <p>・テーマ：ビジネスマナーの基本</p>
                      <p>・出力形式：箇条書き（3つのポイント）</p>
                    </div>
                    <textarea
                      rows={5}
                      className="w-full p-4 bg-white border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none outline-none text-sm"
                      placeholder="プロンプトを入力..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
                    <button className="flex items-center gap-2 px-8 py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">
                      <Send size={18} />
                      回答を送信して完了
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}
        </div>

        {/* Sidebar (Playlist) */}
        <div className="w-full lg:w-96 bg-white border-l border-outline-variant/10 overflow-y-auto shrink-0 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="p-6 border-b border-outline-variant/10 sticky top-0 bg-white/90 backdrop-blur-md z-10">
            <h3 className="font-bold font-headline text-lg">コースの内容</h3>
            <p className="text-xs text-secondary mt-1">全24レッスン中 12完了</p>
          </div>

          <div className="divide-y divide-surface-container-low">
            {/* Chapter 1 */}
            <div className="bg-surface p-4 sticky top-[89px] z-10 border-b border-outline-variant/10">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">セクション 1: 基礎理論</span>
            </div>

            <div className="p-4 flex items-start gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="mt-1 flex-shrink-0">
                <CheckCircle2 size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">1. イントロダクション</p>
                <p className="text-xs text-secondary mt-1">
                  {lessonMode === 'video' ? '2:30' : '読了 3分'}
                </p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-4 bg-primary/5 border-l-4 border-primary transition-colors cursor-pointer">
              <div className="mt-1 flex-shrink-0">
                {lessonMode === 'video' ? <PlayCircle size={20} className="text-primary" /> : <FileText size={20} className="text-primary" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-primary">2. プロンプトエンジニアリングの基礎と応用</p>
                <p className="text-xs text-primary font-medium mt-1">
                  学習中 • {lessonMode === 'video' ? '15:00' : '読了 10分'}
                </p>
              </div>
            </div>

            {/* Chapter 2 */}
            <div className="bg-surface p-4 sticky top-[89px] z-10 border-b border-outline-variant/10 border-t">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">セクション 2: 実践演習</span>
            </div>

            <div className="p-4 flex items-start gap-4 hover:bg-surface-container-low transition-colors cursor-pointer opacity-60">
              <div className="mt-1 flex-shrink-0">
                <Lock size={18} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">3. 記事構成案の作成ワーク</p>
                <p className="text-xs text-secondary mt-1">
                  {lessonMode === 'video' ? '15:40' : '読了 8分'}
                </p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-4 hover:bg-surface-container-low transition-colors cursor-pointer opacity-60">
              <div className="mt-1 flex-shrink-0">
                <Lock size={18} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">4. トーン＆マナーの調整テクニック</p>
                <p className="text-xs text-secondary mt-1">
                  {lessonMode === 'video' ? '12:20' : '読了 6分'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
