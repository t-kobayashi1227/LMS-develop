import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColorClass: string;
  iconBgClass: string;
  badge?: {
    text: string;
    colorClass: string;
  };
}

export default function KPICard({ label, value, icon: Icon, iconColorClass, iconBgClass, badge }: KPICardProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-[0_4px_20px_rgba(0,64,161,0.04)] border border-outline-variant/10 flex flex-col justify-between h-auto min-h-[130px] md:min-h-[160px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] md:text-sm font-bold text-secondary uppercase tracking-widest font-headline">{label}</h3>
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${iconBgClass} flex items-center justify-center ${iconColorClass}`}>
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
      <div className="flex items-end gap-2 md:gap-3 mt-3">
        <span className="text-3xl md:text-4xl font-black text-on-surface font-headline">{value}</span>
        {badge && (
          <span className={`${badge.colorClass} font-bold text-xs md:text-sm mb-0.5 md:mb-1`}>{badge.text}</span>
        )}
      </div>
    </div>
  );
}
