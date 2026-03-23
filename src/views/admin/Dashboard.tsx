import React from 'react';
import { Users, BookOpen, CheckCircle, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import { mockAssignments, mockMessages, mockCourses } from '../../mockData';

export default function AdminDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">
          ダッシュボード
        </h2>
        <p className="text-secondary mt-2">全体のアクティビティと未対応のタスクを確認します。</p>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,64,161,0.04)] border border-outline-variant/10 flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-widest font-headline">アクティブ受講者</h3>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-on-surface font-headline">128</span>
            <span className="text-primary font-bold text-sm mb-1">+12%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,64,161,0.04)] border border-outline-variant/10 flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-widest font-headline">公開コース数</h3>
            <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-on-surface font-headline">14</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,64,161,0.04)] border border-outline-variant/10 flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-widest font-headline">未採点の課題</h3>
            <div className="w-10 h-10 rounded-full bg-[#ffcebd]/30 flex items-center justify-center text-tertiary">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-on-surface font-headline">24</span>
            <span className="text-error font-bold text-sm mb-1">要対応</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,64,161,0.04)] border border-outline-variant/10 flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-widest font-headline">平均修了率</h3>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-on-surface font-headline">68%</span>
            <span className="text-primary font-bold text-sm mb-1">+5%</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Assignments */}
        <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
            <h3 className="font-bold font-headline text-lg">提出された課題 (未採点)</h3>
            <button className="text-primary text-sm font-bold hover:underline">すべて見る</button>
          </div>
          <div className="divide-y divide-surface-container-low flex-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 hover:bg-surface-container-low transition-colors flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <img src={`https://i.pravatar.cc/150?img=${i+10}`} alt="Student" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">ペルソナ設定プロンプトの作成</p>
                    <p className="text-xs text-secondary mt-1">佐藤 美咲 • 2時間前</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages & Course Performance */}
        <div className="space-y-8">
          
          {/* Unread Messages */}
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="font-bold font-headline text-lg flex items-center gap-2">
                <MessageSquare size={20} className="text-tertiary" />
                未読メッセージ
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <img src="https://i.pravatar.cc/150?img=32" alt="Student" className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-bold text-on-surface">田中 健太</span>
                  <span className="text-[10px] text-secondary ml-auto">10:30</span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed line-clamp-2">
                  第3章の課題について質問があります。JSONフォーマットでの出力指定がうまくいかず...
                </p>
              </div>
              <div className="p-4 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <img src="https://i.pravatar.cc/150?img=45" alt="Student" className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-bold text-on-surface">鈴木 一郎</span>
                  <span className="text-[10px] text-secondary ml-auto">昨日</span>
                </div>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed line-clamp-2">
                  コース修了証の発行手順について教えていただけますでしょうか。
                </p>
              </div>
            </div>
          </div>

          {/* Popular Courses */}
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10">
              <h3 className="font-bold font-headline text-lg">コース別アクティビティ</h3>
            </div>
            <div className="p-6 space-y-5">
              {mockCourses.slice(0, 2).map((course, idx) => (
                <div key={course.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-on-surface truncate pr-4">{course.title}</span>
                    <span className="text-xs font-bold text-secondary shrink-0">{85 - idx * 20} 名受講中</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${85 - idx * 20}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
