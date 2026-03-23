import React from 'react';
import { 
  Home, BookOpen, BrainCircuit, MessageSquare, 
  Settings, LogOut, Bell, Search, Users, BarChart3, Plus
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export default function Layout({ children, user, currentView, onNavigate, onLogout }: LayoutProps) {
  const isStudent = user.role === 'student';

  const studentNav = [
    { id: 'dashboard', label: 'ホーム', icon: Home },
    { id: 'courses', label: 'マイコース', icon: BookOpen },
    { id: 'lesson', label: '学習ルーム', icon: BrainCircuit },
    { id: 'messages', label: 'メッセージ', icon: MessageSquare },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'ダッシュボード', icon: Home },
    { id: 'admin-users', label: '受講者管理', icon: Users },
    { id: 'admin-courses', label: 'コース管理', icon: BookOpen },
    { id: 'admin-messages', label: 'メッセージ', icon: MessageSquare },
    { id: 'admin-analytics', label: '分析レポート', icon: BarChart3 },
  ];

  const navItems = isStudent ? studentNav : adminNav;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-on-secondary-fixed flex flex-col py-6 z-40 hidden lg:flex">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-widest leading-none font-headline">Digital Mentor</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Intelligence Suite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-6 py-3 gap-3 transition-all duration-200 ${
                  isActive 
                    ? "text-white bg-blue-700/10 relative before:content-[''] before:absolute before:left-0 before:w-1 before:h-8 before:bg-primary before:rounded-r-full" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                }`}
              >
                <Icon size={20} />
                <span className="font-headline text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {!isStudent && (
          <div className="px-6 mt-4 mb-4">
            <button className="w-full primary-gradient text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Plus size={18} />
              新規コース作成
            </button>
          </div>
        )}

        <div className="mt-auto pt-6 space-y-1 border-t border-white/5">
          <button className="w-full flex items-center px-6 py-3 gap-3 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all duration-200">
            <Settings size={20} />
            <span className="font-headline text-sm font-medium">設定</span>
          </button>
          <button 
            onClick={onLogout}
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
        <header className="sticky top-0 z-30 h-16 glass-panel flex justify-between items-center px-8 border-b border-outline-variant/10">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-on-surface font-headline hidden md:block">
              Editorial Intelligence
            </h1>
            <div className="lg:hidden flex items-center gap-2">
              <BrainCircuit className="text-primary" size={24} />
              <span className="font-bold font-headline">Digital Mentor</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative items-center bg-surface-container-low rounded-full px-4 py-2 w-64 border border-outline-variant/20 focus-within:border-primary/50 transition-colors">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="検索..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2 outline-none"
              />
            </div>
            <button className="p-2 text-slate-500 hover:text-primary hover:bg-surface-container-low rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/10 cursor-pointer hover:border-primary/30 transition-colors">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 w-full glass-panel border-t border-outline-variant/10 flex justify-around items-center h-16 pb-safe z-40">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-1 w-full h-full ${
                  isActive ? 'text-primary' : 'text-slate-400'
                }`}
              >
                <Icon size={20} className={isActive ? 'fill-primary/10' : ''} />
                <span className="text-[10px] font-bold font-headline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
