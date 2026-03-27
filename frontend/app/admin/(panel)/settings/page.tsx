import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/api';
import SettingsForm from '@/components/SettingsForm';

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
        <SettingsForm user={user} roleLabel="管理者" />
      </div>
    </div>
  );
}
