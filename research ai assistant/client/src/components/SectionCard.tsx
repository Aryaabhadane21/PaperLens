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
    <div className="bg-[#090d1f]/90 backdrop-blur-xl border border-indigo-900/40 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-200 hover:border-indigo-500/50">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-indigo-950/80 bg-[#060814]/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 text-indigo-300 flex items-center justify-center shadow-sm border border-indigo-500/30">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-sans font-bold text-base text-white tracking-tight">
            {title}
          </h3>
        </div>
        {badge && (
          <span className="px-3 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/15 text-indigo-300 rounded-full border border-indigo-500/30">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 text-sm text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
};
