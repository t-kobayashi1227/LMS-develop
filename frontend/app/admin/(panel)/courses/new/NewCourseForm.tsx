'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, ImageIcon } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function NewCourseForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('/school_img.jpg');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => {
        setDbCategories(data.data || []);
        if (data.data?.length > 0) setCategoryId(String(data.data[0].id));
      })
      .catch(() => {});
  }, []);

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (thumbnailPreview.startsWith('blob:')) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    if (!categoryId) {
      setError('カテゴリを選択してください');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          categoryId: Number(categoryId),
          status: 'draft',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || '作成に失敗しました');
        return;
      }

      const data = await res.json();
      const courseId = data.data.id;

      // Upload thumbnail if selected
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('thumbnail', thumbnailFile);
        await fetch(`/api/admin/courses/${courseId}/thumbnail`, {
          method: 'POST',
          body: formData,
        }).catch(() => {});
      }

      window.location.href = `/admin/courses/${courseId}`;
    } catch {
      setError('サーバーに接続できません');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="px-4 md:px-8 pt-6 md:pt-10 pb-6 max-w-3xl mx-auto">
        <Link href="/admin/courses" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-on-surface transition-colors mb-6">
          <ArrowLeft size={16} /> コース管理に戻る
        </Link>

        <h2 className="text-3xl md:text-4xl font-serif font-bold text-on-surface tracking-tight mb-8">
          新規コース作成
        </h2>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-outline-variant/20 p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">コースタイトル</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors"
              placeholder="例: AI時代のデジタル・エディトリアル戦略"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">カテゴリ</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors"
            >
              {dbCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">説明</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors resize-none"
              placeholder="コースの概要を入力..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">サムネイル画像</label>
            <div className="flex items-start gap-4">
              <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container-low shrink-0">
                <Image src={thumbnailPreview} alt="サムネイルプレビュー" fill className="object-cover" sizes="144px" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-secondary">推奨: 600×400px / JPG, PNG, WebP / 最大5MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface-low border border-outline-variant/30 rounded-xl text-sm font-medium hover:bg-surface-container-low transition-colors w-fit"
                >
                  <ImageIcon size={14} />
                  画像を選択
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? '作成中...' : '作成して編集する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
