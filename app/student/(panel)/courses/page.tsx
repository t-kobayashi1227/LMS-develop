'use client';

import Link from 'next/link';
import { PlayCircle, Filter, ArrowRight } from 'lucide-react';
import { mockCourses } from '@/lib/mockData';

export default function StudentCourseList() {
  const featuredCourse = mockCourses[0];
  const otherCourses = mockCourses.slice(1);

  return (
    <div className="animate-in fade-in duration-500 pb-24 overflow-x-hidden">

      {/* Header Section */}
      <div className="px-4 md:px-8 pt-6 md:pt-16 pb-6 md:pb-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-6xl font-serif font-bold text-on-surface tracking-tight mb-3 md:mb-4">
              Courses
            </h2>
            <p className="text-secondary text-base md:text-lg font-light max-w-md">
              Explore our curated curriculum designed to elevate your intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
            <button className="p-2.5 md:p-3.5 bg-surface-low border border-outline-variant/30 rounded-full text-on-surface hover:bg-on-surface hover:text-white transition-colors shrink-0">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Categories (Pills) */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {['All', 'AI Writing', 'Data Science', 'Design', 'Marketing'].map((cat, i) => (
            <button
              key={cat}
              className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all ${
                i === 0
                  ? 'bg-on-surface text-white'
                  : 'bg-transparent text-secondary border border-outline-variant/30 hover:border-on-surface hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Course (Breaks the grid) */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto mb-12 md:mb-24">
        <Link
          href="/student/lesson"
          className="group relative rounded-3xl md:rounded-[3rem] overflow-hidden cursor-pointer bg-on-surface text-white flex flex-col md:flex-row min-h-[360px] md:min-h-[500px]"
        >
          {/* Image taking up half on desktop, full background on mobile */}
          <div className="absolute inset-0 md:relative md:w-1/2 h-full">
            <img
              src={featuredCourse.thumbnail}
              alt={featuredCourse.title}
              className="w-full h-full object-cover opacity-50 md:opacity-100 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 md:hidden"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8 md:p-16 flex flex-col justify-end md:justify-center md:w-1/2 h-full min-h-[360px] md:min-h-[400px]">
            <div className="mb-3 md:mb-4 mt-auto md:mt-0">
              <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase border border-white/30 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full backdrop-blur-md">
                Featured
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold leading-tight mb-3 md:mb-6 text-balance">
              {featuredCourse.title}
            </h3>
            <p className="text-white/80 text-sm md:text-lg font-light mb-6 md:mb-8 max-w-md line-clamp-2 md:line-clamp-3">
              {featuredCourse.description}
            </p>

            <div className="flex items-center justify-between pt-5 md:pt-8 border-t border-white/20">
              <div>
                <div className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/50 mb-1">Progress</div>
                <div className="text-xl md:text-2xl font-serif">{featuredCourse.progress}%</div>
              </div>
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white text-on-surface flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayCircle size={20} className="fill-on-surface text-white md:w-6 md:h-6" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Other Courses (Editorial List) */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-12 gap-y-10 md:gap-y-16">
          {otherCourses.map((course) => (
            <Link
              key={course.id}
              href="/student/lesson"
              className="group cursor-pointer flex flex-col"
            >
              <div className="aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-6 relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-white/90 backdrop-blur-md text-on-surface text-[9px] md:text-[10px] font-bold rounded-full uppercase tracking-widest">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="font-serif font-bold text-xl md:text-2xl text-on-surface leading-tight mb-2 md:mb-3 group-hover:text-primary transition-colors text-balance">
                  {course.title}
                </h3>
                <p className="text-secondary text-sm md:text-base font-light line-clamp-2 mb-4 md:mb-6 flex-1">
                  {course.description}
                </p>

                <div className="pt-4 md:pt-6 hairline-t flex items-center justify-between mt-auto">
                  <div className="flex-1 pr-6 md:pr-8">
                    <div className="flex justify-between text-[9px] md:text-[10px] font-bold tracking-widest uppercase mb-1.5 md:mb-2">
                      <span className={course.progress > 0 ? 'text-on-surface' : 'text-secondary'}>
                        {course.progress > 0 ? `${course.progress}% Completed` : 'Not Started'}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-surface-low rounded-full overflow-hidden">
                      <div
                        className="h-full bg-on-surface rounded-full transition-all duration-1000"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface group-hover:bg-on-surface group-hover:text-white transition-colors shrink-0">
                    <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300 md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
