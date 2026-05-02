'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, Plus, Check, X, Settings } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function CategoryManager() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    setCategories(data.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpen = () => {
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setNewName('');
    setError('');
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || data.errors?.name?.[0] || '追加に失敗しました');
    } else {
      setNewName('');
      await fetchCategories();
    }
    setAdding(false);
  };

  const handleEditStart = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setError('');
  };

  const handleEditSave = async (id: number) => {
    if (!editingName.trim()) return;
    setError('');
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || data.errors?.name?.[0] || '更新に失敗しました');
    } else {
      setEditingId(null);
      await fetchCategories();
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
    setError('');
  };

  const handleDelete = async (id: number) => {
    setError('');
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || '削除に失敗しました');
    } else {
      await fetchCategories();
    }
  };

  return (
    <>
      {/* 設定ページ上のカード */}
      <div className="bg-white rounded-2xl border border-outline-variant/20 p-6 md:p-8">
        <h3 className="text-base font-bold text-on-surface mb-1">カテゴリ管理</h3>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-secondary">
            {loading ? '読み込み中...' : `コースカテゴリを管理します。現在 ${categories.length} 件登録されています。`}
          </p>
          <button
            onClick={handleOpen}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shrink-0"
          >
            <Settings size={14} />
            カテゴリ管理を開く
          </button>
        </div>
      </div>

      {/* モーダル */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface">カテゴリ管理</h3>
              <button onClick={handleClose} aria-label="閉じる" className="p-1.5 rounded-lg text-secondary hover:bg-surface-low transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* 本文 */}
            <div className="px-6 py-4">
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <p className="text-sm text-secondary py-4 text-center">読み込み中...</p>
              ) : (
                <ul className="space-y-1 mb-5 max-h-64 overflow-y-auto">
                  {categories.map(cat => (
                    <li key={cat.id} className="flex items-center gap-2 group">
                      {editingId === cat.id ? (
                        <>
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleEditSave(cat.id);
                              if (e.key === 'Escape') handleEditCancel();
                            }}
                            className="flex-1 px-3 py-1.5 bg-surface-low border border-primary rounded-lg text-sm outline-none"
                            autoFocus
                          />
                          <button onClick={() => handleEditSave(cat.id)} aria-label="保存" className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                            <Check size={15} />
                          </button>
                          <button onClick={handleEditCancel} aria-label="キャンセル" className="p-1.5 rounded-lg text-secondary hover:bg-surface-low transition-colors">
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span
                            className="flex-1 px-3 py-1.5 text-sm text-on-surface rounded-lg cursor-pointer hover:bg-surface-low transition-colors select-none"
                            onDoubleClick={() => handleEditStart(cat)}
                            title="ダブルクリックで編集"
                          >
                            {cat.name}
                          </span>
                          <button onClick={() => handleEditStart(cat)} aria-label="編集" className="p-1.5 rounded-lg text-secondary hover:bg-surface-low transition-colors">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDelete(cat.id)} aria-label="削除" className="p-1.5 rounded-lg text-secondary hover:bg-red-50 hover:text-red-500 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* 追加フォーム */}
              <div className="flex gap-2 pt-3 border-t border-outline-variant/20">
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                  placeholder="新しいカテゴリ名"
                  className="flex-1 px-3 py-2 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={handleAdd}
                  disabled={adding || !newName.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Plus size={15} />
                  追加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
