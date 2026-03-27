'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { User } from '@/lib/types';

interface Props {
  user: User;
  roleLabel: string;
}

export default function SettingsForm({ user, roleLabel }: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setIsError(false);

    try {
      const body: Record<string, string> = {};
      if (name !== user.name) body.name = name;
      if (email) body.email = email;

      if (Object.keys(body).length === 0) {
        setMessage('変更はありません');
        setSaving(false);
        return;
      }

      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage(err.message || '保存に失敗しました');
        setIsError(true);
      } else {
        setMessage('保存しました');
      }
    } catch {
      setMessage('サーバーに接続できません');
      setIsError(true);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-outline-variant/10">
          <h3 className="font-bold font-headline text-base md:text-lg">プロフィール</h3>
        </div>
        <div className="p-5 md:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Image src={user.avatar} alt={user.name} width={64} height={64} className="rounded-full object-cover" />
            <div>
              <p className="font-bold text-on-surface">{user.name}</p>
              <p className="text-sm text-secondary">{roleLabel}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="display-name" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">表示名</label>
              <input
                id="display-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">メールアドレス</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="変更する場合のみ入力"
                className="w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        {message && (
          <span className={`text-sm font-medium ${isError ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? '保存中...' : '変更を保存'}
        </button>
      </div>
    </>
  );
}
