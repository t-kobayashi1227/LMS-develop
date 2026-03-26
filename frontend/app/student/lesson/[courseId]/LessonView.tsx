'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, PlayCircle, FileText, CheckCircle2, Lock, Download, Lightbulb, List, ChevronUp } from 'lucide-react';
import type { CourseChapters, Lesson, LessonDetail } from '@/lib/types';

interface LessonViewProps {
  courseData: CourseChapters;
  initialLessonId: string;
  initialLessonDetail: LessonDetail | null;
}

export default function LessonView({ courseData, initialLessonId, initialLessonDetail }: LessonViewProps) {
  const [activeLessonId, setActiveLessonId] = useState(initialLessonId);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(initialLessonDetail);
  const [detailLoading, setDetailLoading] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);

  const allLessons = useMemo(
    () => courseData.chapters.flatMap(ch => ch.lessons),
    [courseData]
  );

  const activeChapter = courseData.chapters.find(ch =>
    ch.lessons.some(l => l.id === activeLessonId)
  );

  const lessonIndex = allLessons.findIndex(l => l.id === activeLessonId);

  const progressPercent = courseData.totalLessons > 0
    ? Math.round((courseData.completedLessons / courseData.totalLessons) * 100)
    : 0;

  const fetchLessonDetail = useCallback(async (lessonId: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      if (res.ok) {
        const json = await res.json();
        setLessonDetail(json.data);
      }
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.isLocked) {
      setActiveLessonId(lesson.id);
      setPlaylistOpen(false);
      fetchLessonDetail(lesson.id);
    }
  };

  const hasVideo = lessonDetail?.hasVideo && lessonDetail?.videoUrl;
  const hasQuiz = lessonDetail?.quizQuestions && lessonDetail.quizQuestions.length > 0;
  const hasResources = lessonDetail?.resources && lessonDetail.resources.length > 0;

  const durationLabel = lessonDetail?.durationSeconds
    ? `${Math.ceil(lessonDetail.durationSeconds / 60)}分`
    : '';

  return (
    <div className="min-h-screen bg-surface flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="h-14 md:h-16 bg-on-secondary-fixed text-white flex items-center justify-between px-3 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <Link href="/student/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0" aria-label="ダッシュボードに戻る">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold text-xs md:text-base truncate max-w-[180px] sm:max-w-xs md:max-w-md font-headline">
            {courseData.courseTitle}
          </h1>
        </div>
        <span className="text-[10px] md:text-xs font-medium text-slate-400 hidden sm:block tracking-widest uppercase">
          進捗: {progressPercent}% ({courseData.completedLessons}/{courseData.totalLessons})
        </span>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-background flex flex-col relative">

          {detailLoading && (
            <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Video Player — video_url が設定されている場合のみ表示 */}
          {hasVideo ? (
            <div className="aspect-video w-full bg-black relative group shrink-0">
              <video
                key={lessonDetail.videoUrl!}
                className="w-full h-full object-contain"
                controls
                poster="https://placehold.co/1200x675/1a1a2e/ffffff?text=▶"
              >
                <source src={lessonDetail.videoUrl!} />
              </video>
            </div>
          ) : lessonDetail?.hasVideo ? (
            /* has_video フラグはあるが URL が未設定 → プレースホルダー */
            <div className="aspect-video w-full bg-black relative group shrink-0">
              <Image
                src="https://placehold.co/1200x675/e2e8f0/475569?text=動画準備中"
                alt="Video placeholder"
                fill
                className="object-cover opacity-50"
                sizes="100vw"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 text-white text-sm font-medium">
                  動画は現在準備中です
                </div>
              </div>
            </div>
          ) : null}

          {/* Article Content */}
          <div className="p-5 md:p-8 lg:p-16 max-w-3xl mx-auto w-full">

            {/* Lesson Header */}
            <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-md uppercase tracking-widest">
                  {activeChapter?.title?.split(':')[0] ?? ''}
                </span>
                <span className="text-sm text-secondary font-medium">Lesson {lessonIndex + 1}</span>
                {durationLabel && (
                  <>
                    <span className="text-sm text-slate-300 mx-1 md:mx-2">|</span>
                    <span className="text-sm text-secondary flex items-center gap-1">
                      <FileText size={14} />
                      {lessonDetail?.type === 'video' ? `動画: ${durationLabel}` : `読了目安: ${durationLabel}`}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-on-surface font-headline leading-tight">
                {lessonDetail?.title}
              </h2>
            </div>

            {/* Resources — DB に資料がある場合のみ表示 */}
            {hasResources && (
              <div className="bg-surface-container-low p-5 md:p-6 rounded-2xl border-l-4 border-tertiary mb-10 md:mb-14">
                <h4 className="font-bold mb-4 font-headline">ダウンロード資料</h4>
                <div className="space-y-3">
                  {lessonDetail!.resources.map((r) => (
                    <button key={r.id} className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-outline-variant/10 hover:border-tertiary/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-tertiary" />
                        <span className="text-sm font-medium text-on-surface group-hover:text-tertiary transition-colors">{r.title}</span>
                      </div>
                      <Download size={16} className="text-slate-400 group-hover:text-tertiary" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Body */}
            {lessonDetail?.contentBody ? (
              <div
                className="prose prose-slate prose-lg max-w-none mb-12 md:mb-16 text-on-surface-variant"
                dangerouslySetInnerHTML={{ __html: lessonDetail.contentBody }}
              />
            ) : (
              <div className="prose prose-slate prose-lg max-w-none mb-12 md:mb-16 text-on-surface-variant">
                <p className="text-secondary italic">このレッスンの本文コンテンツは現在準備中です。</p>
              </div>
            )}

            {/* 理解度チェック CTA — DB にクイズ問題がある場合のみ表示 */}
            {hasQuiz && (
              <Link
                href={`/student/lesson/${courseData.courseId}/quiz?lessonId=${activeLessonId}`}
                className="flex items-center justify-between p-5 md:p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-outline-variant/10 group hover:border-primary/30 transition-colors cursor-pointer mb-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-on-surface font-headline group-hover:text-primary transition-colors">
                      理解度チェック
                    </h3>
                    <p className="text-sm text-secondary mt-1">
                      全{lessonDetail!.quizQuestions.length}問 — このレッスンの理解度を確認しましょう
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shrink-0">
                  <ArrowLeft size={18} className="rotate-180" />
                </div>
              </Link>
            )}

          </div>
        </div>

        {/* Sidebar (Playlist) */}
        <div className={`w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-outline-variant/10 shrink-0 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] ${playlistOpen ? 'max-h-[60vh]' : 'max-h-0 lg:max-h-none'} lg:max-h-none overflow-hidden transition-all duration-300`}>
          <div className="overflow-y-auto h-full max-h-[60vh] lg:max-h-none lg:h-full">
            <div className="p-4 md:p-6 border-b border-outline-variant/10 sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <h3 className="font-bold font-headline text-base md:text-lg">コースの内容</h3>
              <p className="text-xs text-secondary mt-1">
                全{courseData.totalLessons}レッスン中 {courseData.completedLessons}完了
              </p>
            </div>

            <div className="divide-y divide-surface-container-low">
              {courseData.chapters.map((chapter) => (
                <div key={chapter.id}>
                  <div className="bg-surface p-4 sticky top-[73px] lg:top-[89px] z-10 border-b border-outline-variant/10">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                      {chapter.title}
                    </span>
                  </div>
                  {chapter.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        disabled={lesson.isLocked}
                        className={`w-full p-4 flex items-start gap-4 transition-colors cursor-pointer text-left ${
                          isActive
                            ? 'bg-primary/5 border-l-4 border-primary'
                            : lesson.isLocked
                              ? 'opacity-60'
                              : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="mt-1 flex-shrink-0">
                          {lesson.isCompleted ? (
                            <CheckCircle2 size={20} className="text-primary" />
                          ) : isActive ? (
                            <PlayCircle size={20} className="text-primary" />
                          ) : lesson.isLocked ? (
                            <Lock size={18} className="text-slate-400" />
                          ) : (
                            <PlayCircle size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                            {lesson.title}
                          </p>
                          <p className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-secondary'}`}>
                            {isActive ? '学習中 • ' : ''}
                            {lesson.type === 'video' ? '動画' : lesson.type === 'assignment' ? '課題' : 'テキスト'}
                            {' '}{lesson.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
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
