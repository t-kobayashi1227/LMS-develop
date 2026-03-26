import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { getCourses } from '@/lib/api';
import ProgressBar from '@/components/ProgressBar';

export const metadata: Metadata = {
  title: 'ホーム | Niigata AI Academy',
};

export default async function StudentDashboard() {
  const courses = await getCourses();

  return (
    <div className="animate-in fade-in duration-500">

      {/* Hero / Next Lesson */}
      <section className="md:px-8 pt-0 md:pt-12 pb-10 md:pb-12">
        <div className="relative px-6 py-12 md:p-16 bg-on-surface text-white md:rounded-[2.5rem] overflow-hidden flex flex-col justify-center min-h-[360px] md:min-h-[400px]">
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full border-[1px] border-white/20"></div>
            <div className="absolute right-10 top-10 w-64 h-64 rounded-full border-[1px] border-white/10"></div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 font-bold">Currently Learning</span>
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.2] tracking-tight mb-4 text-balance">
              プロンプトエンジニアリングの<br className="hidden md:block" />
              <span className="italic font-light text-primary-container">基礎と応用</span>
            </h2>

            <p className="text-white/70 text-sm md:text-lg font-light leading-relaxed mb-8 max-w-lg">
              LLMから高品質な出力を得るためのプロンプト設計の基本原則を学びます。
            </p>

            <Link
              href={`/student/lesson/${courses[0]?.id ?? ''}`}
              className="group inline-flex items-center gap-4 bg-white text-on-surface px-6 md:px-8 py-3.5 md:py-4 rounded-full text-sm md:text-base font-bold hover:bg-primary-container hover:text-white transition-all active:scale-95 w-fit"
            >
              <PlayCircle size={20} className="group-hover:scale-110 transition-transform" />
              学習を再開する
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial List Section */}
      <section className="px-5 md:px-8 max-w-7xl mx-auto pb-32">
        <div className="flex items-end justify-between mb-6 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tight text-on-surface">
            Ongoing Courses
          </h3>
          <Link href="/student/courses" className="text-on-surface text-xs md:text-sm font-bold hover:opacity-60 transition-opacity flex items-center gap-1">
            すべて見る <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col">
          {courses.slice(0, 3).map((course, index) => (
            <Link
              key={course.id}
              href={`/student/lesson/${courses[0]?.id ?? ''}`}
              className="group flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-12 py-6 md:py-8 hairline-t cursor-pointer"
            >
              <div className="hidden md:block text-5xl font-serif font-light text-outline-variant/50 group-hover:text-primary transition-colors w-16">
                0{index + 1}
              </div>

              <div className="flex gap-4 md:gap-12 w-full items-center md:items-stretch">
                <div className="w-28 h-28 md:w-64 md:h-auto md:aspect-video rounded-xl md:rounded-2xl overflow-hidden relative shrink-0">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 112px, 256px"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="md:hidden absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase">
                    0{index + 1}
                  </div>
                </div>

                <div className="flex-1 space-y-2 md:space-y-4 py-1 md:py-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-secondary border border-outline-variant/30 px-2 py-0.5 md:py-1 rounded-md">
                      {course.category}
                    </span>
                  </div>
                  <h4 className="text-base md:text-2xl font-bold text-on-surface font-serif leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h4>

                  <div className="pt-2 md:pt-4 flex items-center gap-6">
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-[10px] md:text-xs font-bold mb-1.5 md:mb-2">
                        <span className="text-on-surface">{course.progress}%</span>
                        <span className="text-secondary hidden md:inline">{course.completedLessons}/{course.totalLessons}</span>
                      </div>
                      <ProgressBar value={course.progress} height="h-1" barClass="bg-on-surface" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex w-12 h-12 rounded-full border border-outline-variant/30 items-center justify-center text-on-surface group-hover:bg-on-surface group-hover:text-white transition-all shrink-0">
                <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
