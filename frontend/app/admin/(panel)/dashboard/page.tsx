import type { Metadata } from 'next';
import Image from 'next/image';
import { Users, BookOpen, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { getCourses } from '@/lib/api';
import KPICard from '@/components/KPICard';
import ProgressBar from '@/components/ProgressBar';

export const metadata: Metadata = {
  title: 'ダッシュボード | 管理者 | Niigata AI Academy',
};

export default function AdminDashboard() {
  const courses = getCourses();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-500">

      <div>
        <h2 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">
          ダッシュボード
        </h2>
        <p className="text-secondary mt-2">全体のアクティビティと未対応のタスクを確認します。</p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard label="アクティブ受講者" value="128" icon={Users} iconColorClass="text-primary" iconBgClass="bg-primary/10" badge={{ text: '+12%', colorClass: 'text-primary' }} />
        <KPICard label="公開コース数" value="14" icon={BookOpen} iconColorClass="text-tertiary" iconBgClass="bg-tertiary/10" />
        <KPICard label="未採点の課題" value="24" icon={Clock} iconColorClass="text-tertiary" iconBgClass="bg-[#ffcebd]/30" badge={{ text: '要対応', colorClass: 'text-error' }} />
        <KPICard label="平均修了率" value="68%" icon={CheckCircle} iconColorClass="text-primary" iconBgClass="bg-primary/10" badge={{ text: '+5%', colorClass: 'text-primary' }} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-4 md:p-6 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="font-bold font-headline text-base md:text-lg">提出された課題 (未採点)</h3>
            <button className="text-primary text-sm font-bold hover:underline">すべて見る</button>
          </div>
          <div className="divide-y divide-surface-container-low flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 md:p-6 hover:bg-surface-container-low transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3 md:gap-4">
                  <Image src="https://placehold.co/150x150/e2e8f0/475569?text=Student" alt="Student" width={40} height={40} className="rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">ペルソナ設定プロンプトの作成</p>
                    <p className="text-xs text-secondary mt-1">佐藤 美咲 • 2時間前</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-colors" aria-label="詳細を見る">
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-outline-variant/10">
            <h3 className="font-bold font-headline text-base md:text-lg">コース別アクティビティ</h3>
          </div>
          <div className="p-4 md:p-6 space-y-5">
            {courses.map((course) => (
              <div key={course.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-on-surface truncate pr-4">{course.title}</span>
                  <span className="text-xs font-bold text-secondary shrink-0">{course.studentCount} 名受講中</span>
                </div>
                <ProgressBar value={(course.studentCount / 100) * 100} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
