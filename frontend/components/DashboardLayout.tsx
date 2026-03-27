'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, LogOut, Plus } from 'lucide-react';
import { studentNav, adminNav } from '@/lib/navigation';
import type { User } from '@/lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isStudent = user.role === 'student';
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  const navItems = isStudent ? studentNav : adminNav;

  const handleLogout = async () => {
    setAvatarMenuOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push(isStudent ? '/' : '/admin');
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = navItems.map((item) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`w-full flex items-center px-6 py-3 gap-3 transition-all duration-200 ${
          isActive
            ? "text-white bg-blue-700/10 relative before:content-[''] before:absolute before:left-0 before:w-1 before:h-8 before:bg-primary before:rounded-r-full"
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
        }`}
        aria-label={item.label}
      >
        <Icon size={20} />
        <span className="font-headline text-sm font-medium">{item.label}</span>
      </Link>
    );
  });

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar (Desktop) */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-on-secondary-fixed flex flex-col py-6 z-40 hidden lg:flex">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg overflow-hidden bg-white/5 shrink-0">
              <Image src="/logo.png" alt="Niigata AI Academy" width={40} height={40} className="object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-[15px] font-extrabold text-white tracking-wide leading-none font-headline mb-1.5">Niigata AI Academy</h2>
              <span className="text-[9px] text-slate-400 font-medium tracking-wider leading-none">Learning Management System</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 mt-4">{navLinks}</nav>

        {!isStudent && (
          <div className="px-6 mt-4 mb-4">
            <Link href="/admin/courses/new" className="w-full primary-gradient text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Plus size={18} />
              新規コース作成
            </Link>
          </div>
        )}

        <div className="mt-auto pt-6 space-y-1 border-t border-white/5">
          <Link
            href={isStudent ? '/student/settings' : '/admin/settings'}
            className="w-full flex items-center px-6 py-3 gap-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-200"
          >
            <Settings size={20} />
            <span className="font-headline text-sm font-medium">設定</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 gap-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-headline text-sm font-medium">ログアウト</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 md:h-20 bg-background/90 backdrop-blur-xl flex justify-between items-center px-5 md:px-8">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-on-surface font-headline hidden md:block tracking-tight">
              Niigata AI Academy
            </h1>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-md overflow-hidden bg-surface-container-low shrink-0">
                <Image src="/logo.png" alt="Niigata AI Academy" width={32} height={32} className="object-cover" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative" ref={avatarMenuRef}>
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="ユーザーメニュー"
              >
                <Image src={user.avatar} alt={user.name} width={40} height={40} className="object-cover" />
              </button>
              {avatarMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-outline-variant/20 py-2 z-50">
                  <div className="px-4 py-3 border-b border-outline-variant/10">
                    <p className="text-sm font-bold text-on-surface">{user.name}</p>
                    <p className="text-xs text-secondary">{isStudent ? '受講者' : '管理者'}</p>
                  </div>
                  <Link
                    href={isStudent ? '/student/settings' : '/admin/settings'}
                    onClick={() => setAvatarMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    <Settings size={16} />
                    設定
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    <LogOut size={16} />
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 pb-28 lg:pb-0">{children}</main>

        {/* Mobile Floating Bottom Nav */}
        <div className="lg:hidden fixed bottom-6 left-0 w-full px-5 z-50 pointer-events-none flex justify-center">
          <nav className="bg-on-surface/95 backdrop-blur-xl text-white px-6 py-3.5 rounded-full flex justify-between max-w-[320px] w-full shadow-2xl pointer-events-auto items-center">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 transition-all ${
                    isActive ? 'text-white scale-110' : 'text-white/40 hover:text-white/80'
                  }`}
                  aria-label={item.label}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                  {isActive && <span className="w-1 h-1 bg-white rounded-full mt-1 absolute -bottom-2"></span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
