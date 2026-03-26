'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface LoginFormProps {
  isAdmin?: boolean;
}

export default function LoginForm({ isAdmin = false }: LoginFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(isAdmin ? '/admin/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Abstract Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-tertiary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-surface-lowest p-8 md:p-10 rounded-3xl shadow-[0_40px_80px_rgba(0,64,161,0.08)] border border-outline-variant/10 bg-white">

          {/* Header */}
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

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                メールアドレス
              </label>
              <input
                type="email"
                id="email"
                placeholder={isAdmin ? "admin@example.com" : "student@example.com"}
                className="w-full px-4 py-3.5 bg-white border border-outline-variant/60 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/50 text-sm outline-none"
                defaultValue={isAdmin ? "admin@example.com" : "student@example.com"}
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
                defaultValue="password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] mt-2"
            >
              {isAdmin ? '管理者としてログイン' : 'ログイン'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
