'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Video, FileText, ClipboardList, HelpCircle } from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: string;
  questionText: string;
  options: string[] | null;
  correctOptionIndex: number | null;
  conditions: string[] | null;
}

interface LessonData {
  id: string;
  title: string;
  type: string;
  hasVideo: boolean;
  videoUrl: string | null;
  contentBody: string | null;
  durationSeconds: number | null;
  sortOrder: number;
  quizQuestions: QuizQuestion[];
}

interface ChapterData {
  id: string;
  title: string;
  sortOrder: number;
  lessons: LessonData[];
}

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  status: string;
  categoryId: number;
  chapters: ChapterData[];
}

interface Props {
  course: CourseData;
  categories: string[];
}

async function apiCall(path: string, method: string, body?: unknown) {
  const res = await fetch(`/api/admin/${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  return res.json();
}

export default function CourseEditor({ course: initial, categories }: Props) {
  const [course, setCourse] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedChapter, setExpandedChapter] = useState<string | null>(
    initial.chapters[0]?.id ?? null
  );
  const [editingLesson, setEditingLesson] = useState<string | null>(null);

  // ── State update helpers ──────────────────────────
  const updateLessonLocal = useCallback((lessonId: string, updates: Partial<LessonData>) => {
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch => ({
        ...ch,
        lessons: ch.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l),
      })),
    }));
  }, []);

  const updateChapterLocal = useCallback((chapterId: string, updates: Partial<ChapterData>) => {
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch => ch.id === chapterId ? { ...ch, ...updates } : ch),
    }));
  }, []);

  // ── Course actions ─────────────────────────────────
  const saveCourse = async () => {
    setSaving(true);
    setMessage('');
    try {
      await apiCall(`courses/${course.id}`, 'PUT', {
        title: course.title,
        description: course.description,
        status: course.status,
      });
      setMessage('保存しました');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const addChapter = async () => {
    const result = await apiCall(`courses/${course.id}/chapters`, 'POST', {
      title: `新しいセクション ${course.chapters.length + 1}`,
    });
    setCourse(prev => ({
      ...prev,
      chapters: [...prev.chapters, {
        id: result.data.id,
        title: `新しいセクション ${prev.chapters.length + 1}`,
        sortOrder: prev.chapters.length,
        lessons: [],
      }],
    }));
  };

  const deleteChapter = async (chapterId: string) => {
    if (!confirm('このセクションを削除しますか？含まれるレッスンも全て削除されます。')) return;
    await apiCall(`chapters/${chapterId}`, 'DELETE');
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.filter(ch => ch.id !== chapterId),
    }));
  };

  const saveChapterTitle = async (chapterId: string, title: string) => {
    await apiCall(`chapters/${chapterId}`, 'PUT', { title });
  };

  const addLesson = async (chapterId: string) => {
    const result = await apiCall(`chapters/${chapterId}/lessons`, 'POST', {
      title: '新しいレッスン',
      type: 'text',
    });
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch => ch.id === chapterId ? {
        ...ch,
        lessons: [...ch.lessons, {
          id: result.data.id,
          title: '新しいレッスン',
          type: 'text',
          hasVideo: false,
          videoUrl: null,
          contentBody: null,
          durationSeconds: null,
          sortOrder: ch.lessons.length,
          quizQuestions: [],
        }],
      } : ch),
    }));
  };

  const saveLesson = async (lessonId: string, updates: Partial<LessonData>) => {
    await apiCall(`lessons/${lessonId}`, 'PUT', updates);
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('このレッスンを削除しますか？')) return;
    await apiCall(`lessons/${lessonId}`, 'DELETE');
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch => ({
        ...ch,
        lessons: ch.lessons.filter(l => l.id !== lessonId),
      })),
    }));
  };

  const addQuiz = async (lessonId: string) => {
    const result = await apiCall(`lessons/${lessonId}/quiz`, 'POST', {
      type: 'choice',
      questionText: '新しい問題',
      options: ['選択肢1', '選択肢2', '選択肢3'],
      correctOptionIndex: 0,
    });
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch => ({
        ...ch,
        lessons: ch.lessons.map(l => l.id === lessonId ? {
          ...l,
          quizQuestions: [...l.quizQuestions, {
            id: result.data.id,
            type: 'choice',
            questionText: '新しい問題',
            options: ['選択肢1', '選択肢2', '選択肢3'],
            correctOptionIndex: 0,
            conditions: null,
          }],
        } : l),
      })),
    }));
  };

  const deleteQuiz = async (quizId: string) => {
    await apiCall(`quiz/${quizId}`, 'DELETE');
    setCourse(prev => ({
      ...prev,
      chapters: prev.chapters.map(ch => ({
        ...ch,
        lessons: ch.lessons.map(l => ({
          ...l,
          quizQuestions: l.quizQuestions.filter(q => q.id !== quizId),
        })),
      })),
    }));
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={14} className="text-blue-500" />;
      case 'assignment': return <ClipboardList size={14} className="text-amber-500" />;
      default: return <FileText size={14} className="text-green-500" />;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-6 max-w-5xl mx-auto">
        <Link href="/admin/courses" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-on-surface transition-colors mb-6">
          <ArrowLeft size={16} /> コース管理に戻る
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <input
            type="text"
            value={course.title}
            onChange={e => setCourse(prev => ({ ...prev, title: e.target.value }))}
            className="text-2xl md:text-4xl font-serif font-bold text-on-surface bg-transparent border-none outline-none focus:ring-0 w-full"
            placeholder="コースタイトル"
          />
          <div className="flex items-center gap-3 shrink-0">
            {message && <span className={`text-sm font-medium ${message.includes('失敗') ? 'text-red-500' : 'text-green-600'}`}>{message}</span>}
            <select
              value={course.status}
              onChange={e => setCourse(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-surface-low border border-outline-variant/30 rounded-full text-sm font-medium outline-none"
            >
              <option value="draft">下書き</option>
              <option value="published">公開</option>
              <option value="archived">アーカイブ</option>
            </select>
            <button
              onClick={saveCourse}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        <textarea
          value={course.description ?? ''}
          onChange={e => setCourse(prev => ({ ...prev, description: e.target.value }))}
          rows={2}
          className="w-full mt-4 text-secondary bg-transparent border-none outline-none resize-none text-base"
          placeholder="コースの説明文..."
        />
      </div>

      <div className="px-4 md:px-8 max-w-5xl mx-auto space-y-4">
        {course.chapters.map((chapter) => (
          <div key={chapter.id} className="bg-white rounded-2xl border border-outline-variant/20 overflow-hidden">
            <div
              className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-surface-container-low/50 transition-colors"
              onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
            >
              <GripVertical size={16} className="text-slate-300" />
              <input
                type="text"
                value={chapter.title}
                onChange={e => updateChapterLocal(chapter.id, { title: e.target.value })}
                onBlur={() => saveChapterTitle(chapter.id, chapter.title)}
                onClick={e => e.stopPropagation()}
                className="flex-1 font-bold text-on-surface bg-transparent outline-none"
              />
              <span className="text-xs text-secondary">{chapter.lessons.length} レッスン</span>
              <button onClick={e => { e.stopPropagation(); deleteChapter(chapter.id); }} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded" aria-label="セクション削除">
                <Trash2 size={14} />
              </button>
              {expandedChapter === chapter.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>

            {expandedChapter === chapter.id && (
              <div className="border-t border-outline-variant/10">
                {chapter.lessons.map((lesson) => (
                  <div key={lesson.id} className="border-b border-outline-variant/10 last:border-b-0">
                    <div
                      className="flex items-center gap-3 px-5 py-3 pl-10 hover:bg-surface-container-low/30 transition-colors cursor-pointer"
                      onClick={() => setEditingLesson(editingLesson === lesson.id ? null : lesson.id)}
                    >
                      {typeIcon(lesson.type)}
                      <span className="flex-1 text-sm text-on-surface">{lesson.title}</span>
                      {lesson.quizQuestions.length > 0 && (
                        <span className="text-[10px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full font-bold">
                          クイズ {lesson.quizQuestions.length}問
                        </span>
                      )}
                      {lesson.videoUrl && (
                        <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-bold">
                          動画
                        </span>
                      )}
                      <button onClick={e => { e.stopPropagation(); deleteLesson(lesson.id); }} className="p-1 text-slate-400 hover:text-red-500 transition-colors" aria-label="レッスン削除">
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {editingLesson === lesson.id && (
                      <div className="px-10 py-4 bg-surface-container-low/30 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5">タイトル</label>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={e => updateLessonLocal(lesson.id, { title: e.target.value })}
                              onBlur={() => saveLesson(lesson.id, { title: lesson.title })}
                              className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none"
                            />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5">種別</label>
                              <select
                                value={lesson.type}
                                onChange={e => {
                                  const type = e.target.value;
                                  updateLessonLocal(lesson.id, { type });
                                  saveLesson(lesson.id, { type });
                                }}
                                className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none"
                              >
                                <option value="text">テキスト</option>
                                <option value="video">動画</option>
                                <option value="assignment">課題</option>
                              </select>
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5">所要時間(秒)</label>
                              <input
                                type="number"
                                value={lesson.durationSeconds ?? ''}
                                onChange={e => updateLessonLocal(lesson.id, { durationSeconds: e.target.value ? Number(e.target.value) : null })}
                                onBlur={() => saveLesson(lesson.id, { durationSeconds: lesson.durationSeconds })}
                                className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5">動画URL</label>
                          <input
                            type="text"
                            value={lesson.videoUrl ?? ''}
                            onChange={e => updateLessonLocal(lesson.id, { videoUrl: e.target.value || null, hasVideo: !!e.target.value })}
                            onBlur={() => saveLesson(lesson.id, { videoUrl: lesson.videoUrl, hasVideo: !!lesson.videoUrl })}
                            className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none"
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-1.5">本文コンテンツ (HTML)</label>
                          <textarea
                            value={lesson.contentBody ?? ''}
                            onChange={e => updateLessonLocal(lesson.id, { contentBody: e.target.value || null })}
                            onBlur={() => saveLesson(lesson.id, { contentBody: lesson.contentBody })}
                            rows={6}
                            className="w-full px-3 py-2 bg-white border border-outline-variant/30 rounded-lg text-sm outline-none font-mono resize-y"
                            placeholder="<h3>見出し</h3><p>本文...</p>"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                              <HelpCircle size={12} /> 理解度チェック ({lesson.quizQuestions.length}問)
                            </label>
                            <button onClick={() => addQuiz(lesson.id)} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                              <Plus size={12} /> 問題を追加
                            </button>
                          </div>
                          {lesson.quizQuestions.map((q) => (
                            <div key={q.id} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-outline-variant/20 mb-2">
                              <span className="text-[10px] bg-tertiary/10 text-tertiary px-1.5 py-0.5 rounded font-bold mt-0.5 shrink-0">
                                {q.type === 'choice' ? '選択' : '記述'}
                              </span>
                              <p className="text-sm text-on-surface flex-1 line-clamp-2">{q.questionText}</p>
                              <button onClick={() => deleteQuiz(q.id)} className="p-1 text-slate-400 hover:text-red-500 shrink-0" aria-label="問題削除">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addLesson(chapter.id)}
                  className="w-full px-5 py-3 text-sm text-primary font-bold hover:bg-primary/5 transition-colors flex items-center gap-2 pl-10"
                >
                  <Plus size={14} /> レッスンを追加
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addChapter}
          className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-2xl text-sm text-secondary font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> セクションを追加
        </button>
      </div>
    </div>
  );
}
