'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LoginFormProps {
  isAdmin?: boolean;
}

export default function LoginForm({ isAdmin = false }: LoginFormProps) {
  const [email, setEmail] = useState(isAdmin ? 'yui.sato@example.com' : 'kenta.tanaka@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.errors?.email?.[0] || data.message || 'ログインに失敗しました。');
        return;
      }

      // フルリロードで遷移（cookie をミドルウェアに認識させる）
      const dest = data.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      window.location.href = dest;
    } catch {
      setError('サーバーに接続できません。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-tertiary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-surface-lowest p-8 md:p-10 rounded-3xl shadow-[0_40px_80px_rgba(0,64,161,0.08)] border border-outline-variant/10 bg-white">

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
              <Image src="/logo.png" alt="Niigata AI Academy" width={96} height={96} className="object-cover" />
            </div>
            <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
              {isAdmin ? '管理者ログイン' : 'Niigata AI Academy'}
            </h1>
            <p className="text-on-surface-variant text-sm font-medium">
              {isAdmin ? 'システム管理ダッシュボード' : 'Learning Management System'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                placeholder={isAdmin ? "admin@example.com" : "student@example.com"}
                className="w-full px-4 py-3.5 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/50 text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label htmlFor="password" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  パスワード
                </label>
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/50 text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] mt-2 disabled:opacity-50"
            >
              {loading ? 'ログイン中...' : isAdmin ? '管理者としてログイン' : 'ログイン'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
