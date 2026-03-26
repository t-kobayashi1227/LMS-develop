import type { Metadata } from 'next';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/api';

export const metadata: Metadata = {
  title: '設定 | 管理者 | Niigata AI Academy',
};

export default async function AdminSettings() {
  const user = await getCurrentUser();

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="px-4 md:px-8 pt-6 md:pt-16 pb-6 md:pb-8 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-on-surface tracking-tight mb-3 md:mb-4">
          設定
        </h2>
        <p className="text-secondary text-base md:text-lg font-light">
          管理者アカウントやシステム設定を管理します。
        </p>
      </div>

      <div className="px-4 md:px-8 max-w-3xl mx-auto space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-outline-variant/10">
            <h3 className="font-bold font-headline text-base md:text-lg">プロフィール</h3>
          </div>
          <div className="p-5 md:p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Image src={user.avatar} alt={user.name} width={64} height={64} className="rounded-full object-cover" />
              <div>
                <p className="font-bold text-on-surface">{user.name}</p>
                <p className="text-sm text-secondary">管理者</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="admin-name" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">表示名</label>
                <input id="admin-name" type="text" defaultValue={user.name} className="w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label htmlFor="admin-email" className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">メールアドレス</label>
                <input id="admin-email" type="email" defaultValue="yui.sato@example.com" className="w-full px-4 py-3 bg-surface-low border border-outline-variant/30 rounded-xl text-sm outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-8 py-3 primary-gradient text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">
            変更を保存
          </button>
        </div>
      </div>
    </div>
  );
}
