import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'student' | 'admin') => void;
}

export default function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Abstract Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-tertiary/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-surface-lowest p-8 md:p-10 rounded-3xl shadow-[0_40px_80px_rgba(0,64,161,0.08)] border border-outline-variant/10 bg-white">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container text-white mb-6 shadow-lg shadow-primary/20">
              <BrainCircuit size={32} />
            </div>
            <h1 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
              Editorial Intelligence
            </h1>
            <p className="text-on-surface-variant text-sm font-medium">
              学習を再定義する、インテリジェントな体験
            </p>
          </div>

          {/* Social Login */}
          <button 
            onClick={() => onLogin('student')}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-all duration-200 group mb-6"
          >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              className="w-5 h-5" 
            />
            <span className="text-on-surface font-semibold text-sm">Googleでログイン (受講者)</span>
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-outline-variant/30"></div>
            <span className="flex-shrink mx-4 text-outline text-[10px] uppercase tracking-widest font-bold">または</span>
            <div className="flex-grow border-t border-outline-variant/30"></div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin('admin'); }}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 ml-1">
                メールアドレス
              </label>
              <input 
                type="email" 
                id="email" 
                placeholder="admin@example.com" 
                className="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/50 text-sm outline-none"
                defaultValue="admin@example.com"
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
                className="w-full px-4 py-3.5 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-outline/50 text-sm outline-none"
                defaultValue="password"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98] mt-2"
            >
              管理者としてログイン
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
