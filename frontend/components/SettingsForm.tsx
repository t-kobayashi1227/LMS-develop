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

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwIsError, setPwIsError] = useState(false);

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

  const handleChangePassword = async () => {
    if (newPassword !== newPasswordConfirm) {
      setPwMessage('新しいパスワードが一致しません');
      setPwIsError(true);
      return;
    }
    if (newPassword.length < 8) {
      setPwMessage('パスワードは8文字以上にしてください');
      setPwIsError(true);
      return;
    }

    setPwSaving(true);
    setPwMessage('');
    setPwIsError(false);

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          newPassword_confirmation: newPassword,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err.errors?.currentPassword?.[0] || err.message || 'パスワード変更に失敗しました';
        setPwMessage(msg);
        setPwIsError(true);
      } else {
        setPwMessage('パスワードを変更しました');
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');
      }
    } catch {
      setPwMessage('サーバーに接続できません');
      setPwIsError(true);
    } finally {
      setPwSaving(false);
      setTimeout(() => setPwMessage(''), 3000);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors";

  return (
    <>
      {/* Profile */}
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
              <input id="display-name" type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">メールアドレス</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="変更する場合のみ入力" className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        {message && (
          <span className={`text-sm font-medium ${isError ? 'text-red-500' : 'text-green-600'}`}>{message}</span>
        )}
        <button onClick={handleSave} disabled={saving} className="px-8 py-3 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50">
          {saving ? '保存中...' : '変更を保存'}
        </button>
      </div>

      {/* Password */}
      <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-outline-variant/10">
          <h3 className="font-bold font-headline text-base md:text-lg">パスワード変更</h3>
        </div>
        <div className="p-5 md:p-6 space-y-4">
          <div>
            <label htmlFor="current-pw" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">現在のパスワード</label>
            <input id="current-pw" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="new-pw" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">新しいパスワード</label>
              <input id="new-pw" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="8文字以上" className={inputClass} />
            </div>
            <div>
              <label htmlFor="new-pw-confirm" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">新しいパスワード（確認）</label>
              <input id="new-pw-confirm" type="password" value={newPasswordConfirm} onChange={e => setNewPasswordConfirm(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        {pwMessage && (
          <span className={`text-sm font-medium ${pwIsError ? 'text-red-500' : 'text-green-600'}`}>{pwMessage}</span>
        )}
        <button onClick={handleChangePassword} disabled={pwSaving || !currentPassword || !newPassword} className="px-8 py-3 bg-on-surface text-white font-bold rounded-xl hover:bg-on-surface/90 transition-all active:scale-95 disabled:opacity-50">
          {pwSaving ? '変更中...' : 'パスワードを変更'}
        </button>
      </div>
    </>
  );
}
