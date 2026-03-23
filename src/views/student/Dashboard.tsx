import React from 'react';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { mockCourses } from '../../mockData';

export default function StudentDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
  const ongoingCourse = mockCourses[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Hero / Next Lesson */}
      <section>
        <div className="relative group overflow-hidden rounded-3xl bg-inverse-surface p-10 text-white shadow-xl flex flex-col justify-center min-h-[320px]">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <PlayCircle size={200} strokeWidth={1} />
          </div>
          
          <div className="relative z-10 max-w-lg space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-xs font-bold tracking-widest uppercase">
              Next Lesson
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight font-headline">
              {ongoingCourse.title}：第4章
            </h2>
            <p className="text-slate-300 text-lg font-light leading-relaxed">
              プロンプトエンジニアリングを活用した高度な記事構成案の作成方法について学びます。
            </p>
            <button 
              onClick={() => onNavigate('lesson')}
              className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-primary-fixed transition-all active:scale-95 w-fit"
            >
              学習を再開する
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Modules Grid */}
      <section>
        
        {/* Ongoing Courses */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight font-headline">進行中のコース</h3>
            <button onClick={() => onNavigate('courses')} className="text-primary text-sm font-bold hover:underline">
              すべて見る
            </button>
          </div>
          
          <div className="space-y-4">
            {mockCourses.slice(0, 2).map(course => (
              <div key={course.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 bg-white rounded-2xl hover:shadow-md transition-all duration-300 border border-outline-variant/10 cursor-pointer" onClick={() => onNavigate('lesson')}>
                <div className="w-full sm:w-32 h-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                
                <div className="flex-1 space-y-3 w-full">
                  <h4 className="font-bold text-on-surface font-headline leading-tight">{course.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-secondary font-medium">
                    <span>{course.totalLessons} レッスン</span>
                    <span>進捗 {course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
                
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-surface-container-low items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                  <PlayCircle size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
