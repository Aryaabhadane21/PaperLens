import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon: LucideIcon;
  badge?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, badge, children }) => {
  return (
    <div className="bg-cream-50 dark:bg-slate-900 border border-cream-200 dark:border-slate-800 rounded-2xl shadow-academic overflow-hidden transition-all duration-200 hover:shadow-academic-hover">
      {/* Header bar with navy accent and gold badge */}
      <div className="px-6 py-4 border-b border-cream-200 dark:border-slate-800/80 bg-white/60 dark:bg-navy-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy-900 dark:bg-navy-800 text-gold-400 flex items-center justify-center shadow-sm border border-gold-500/20">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-serif font-bold text-base text-navy-900 dark:text-cream-50 tracking-tight">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-gold-500/10 text-gold-700 dark:text-gold-400 rounded-full border border-gold-500/20">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
};
