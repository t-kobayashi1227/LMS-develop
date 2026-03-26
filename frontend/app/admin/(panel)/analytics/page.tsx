import type { Metadata } from 'next';
import { TrendingUp, Users, Clock, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getMonthlyStudentData, getCoursePerformanceData, getRecentActivityData, getAdminKpi } from '@/lib/api';
import KPICard from '@/components/KPICard';
import ProgressBar from '@/components/ProgressBar';
import type { ActivityType } from '@/lib/types';

export const metadata: Metadata = {
  title: '分析レポート | 管理者 | Niigata AI Academy',
};

const CHART_BAR_MAX_HEIGHT = 160;

const activityDotColor: Record<ActivityType, string> = {
  complete: 'bg-green-500',
  submit: 'bg-primary',
  enroll: 'bg-tertiary',
  warning: 'bg-amber-500',
};

export default async function AdminAnalytics() {
  const [monthlyData, coursePerformance, recentActivity, kpi] = await Promise.all([
    getMonthlyStudentData(),
    getCoursePerformanceData(),
    getRecentActivityData(),
    getAdminKpi(),
  ]);
  const maxStudents = monthlyData.reduce((max, d) => Math.max(max, d.students), 0);

  return (
    <div className="animate-in fade-in duration-500 pb-24 overflow-x-hidden">

      <div className="px-4 md:px-8 pt-6 md:pt-16 pb-6 md:pb-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-on-surface tracking-tight mb-3 md:mb-4">
              分析レポート
            </h2>
            <p className="text-secondary text-base md:text-lg font-light max-w-md">
              受講者の学習状況とコースパフォーマンスを分析します。
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <select className="px-4 py-2.5 bg-surface-low border border-outline-variant/30 rounded-full text-sm font-medium text-on-surface outline-none" aria-label="期間選択">
              <option>過去6ヶ月</option>
              <option>過去3ヶ月</option>
              <option>過去1年</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-7xl mx-auto mb-8 md:mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KPICard label="アクティブ受講者" value={String(kpi.activeStudents)} icon={Users} iconColorClass="text-primary" iconBgClass="bg-primary/10" />
          <KPICard label="公開コース数" value={String(kpi.publishedCourses)} icon={TrendingUp} iconColorClass="text-tertiary" iconBgClass="bg-tertiary/10" />
          <KPICard label="平均修了率" value={`${kpi.avgCompletion}%`} icon={Award} iconColorClass="text-primary" iconBgClass="bg-primary/10" />
          <KPICard label="総学習時間" value={`${kpi.totalHours}h`} icon={Clock} iconColorClass="text-tertiary" iconBgClass="bg-[#ffcebd]/30" />
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-7xl mx-auto mb-8 md:mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-outline-variant/10">
              <h3 className="font-bold font-headline text-base md:text-lg">受講者数の推移</h3>
              <p className="text-xs text-secondary mt-1">月別のアクティブ受講者数</p>
            </div>
            <div className="p-4 md:p-8">
              <div className="flex items-end justify-between gap-2 md:gap-4 h-48 md:h-64">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] md:text-xs font-bold text-on-surface">{d.students}</span>
                    <div className="w-full max-w-[48px]">
                      <div
                        className="w-full bg-primary/15 rounded-t-lg overflow-hidden"
                        style={{ height: `${(d.students / maxStudents) * CHART_BAR_MAX_HEIGHT}px` }}
                      >
                        <div
                          className="w-full h-full bg-primary rounded-t-lg transition-all duration-700"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] md:text-xs text-secondary font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden flex flex-col">
            <div className="p-4 md:p-6 border-b border-outline-variant/10">
              <h3 className="font-bold font-headline text-base md:text-lg">最近のアクティビティ</h3>
            </div>
            <div className="divide-y divide-surface-container-low flex-1 overflow-y-auto">
              {recentActivity.map((item, i) => (
                <div key={i} className="p-4 md:p-5 flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activityDotColor[item.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface leading-relaxed">{item.action}</p>
                    <p className="text-[10px] text-secondary mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-outline-variant/10 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-outline-variant/10">
            <h3 className="font-bold font-headline text-base md:text-lg">コース別パフォーマンス</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">コース名</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">受講者数</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">平均進捗</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">修了率</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-xs font-bold text-secondary uppercase tracking-widest whitespace-nowrap">満足度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {coursePerformance.map((course) => (
                  <tr key={course.name} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-on-surface text-sm max-w-[200px] md:max-w-none truncate block">{course.name}</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-on-surface font-mono">{course.students}</span>
                      <span className="text-xs text-secondary ml-1">名</span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-on-surface w-8">{course.avgProgress}%</span>
                        <div className="w-20">
                          <ProgressBar value={course.avgProgress} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                        course.completionRate >= 40 ? 'bg-green-500/10 text-green-600' :
                        course.completionRate >= 15 ? 'bg-amber-500/10 text-amber-600' :
                        'bg-secondary/10 text-secondary'
                      }`}>
                        {course.completionRate}%
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-on-surface">{course.satisfaction}</span>
                        <span className="text-amber-400 text-sm">★</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
