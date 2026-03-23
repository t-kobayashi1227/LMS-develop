import React from 'react';
import { PlayCircle, Search, Filter } from 'lucide-react';
import { mockCourses } from '../../mockData';

export default function CourseList({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">
            マイコース
          </h2>
          <p className="text-secondary mt-2">現在学習中のコースと、おすすめのコース</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-white rounded-xl px-4 py-2 w-full md:w-64 border border-outline-variant/20 focus-within:border-primary/50 transition-colors shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="コースを検索..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2 outline-none"
            />
          </div>
          <button className="p-2.5 bg-white border border-outline-variant/20 rounded-xl text-slate-500 hover:text-primary hover:border-primary/30 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['すべて', 'AI Writing', 'Data Science', 'Design', 'Marketing'].map((cat, i) => (
          <button 
            key={cat}
            className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              i === 0 
                ? 'bg-on-secondary-fixed text-white' 
                : 'bg-white text-secondary border border-outline-variant/20 hover:bg-surface-container-low'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockCourses.map((course) => (
          <div 
            key={course.id} 
            onClick={() => onNavigate('lesson')}
            className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,64,161,0.04)] border border-outline-variant/10 cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,64,161,0.08)] transition-all duration-300 flex flex-col"
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-80"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-md uppercase tracking-widest border border-white/10">
                  {course.category}
                </span>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-primary group-hover:border-primary transition-colors">
                  <PlayCircle size={20} className={course.progress > 0 ? 'fill-white text-primary group-hover:text-white' : ''} />
                </div>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-on-surface font-headline leading-tight mb-3 group-hover:text-primary transition-colors">
                {course.title}
              </h3>
              <p className="text-sm text-secondary line-clamp-2 mb-6 flex-1">
                {course.description}
              </p>
              
              <div className="mt-auto">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className={course.progress > 0 ? 'text-primary' : 'text-secondary'}>
                    {course.progress > 0 ? `${course.progress}% 完了` : '未開始'}
                  </span>
                  <span className="text-secondary">{course.completedLessons} / {course.totalLessons} レッスン</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
