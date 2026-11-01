import React from 'react';
import { Sparkles, Play } from 'lucide-react';

interface HeroBannerProps {
  onLoadSample: () => void;
  onGetStarted: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onLoadSample, onGetStarted }) => {
  return (
    <section id="home" className="relative pt-12 pb-20 overflow-hidden text-center">
      {/* Central Aurora / Nebula Glow Effect from Inspo Image 1 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[450px] sm:h-[550px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, rgba(165, 180, 252, 0.28) 0%, rgba(99, 102, 241, 0.22) 35%, rgba(45, 212, 191, 0.12) 65%, transparent 75%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Powered by AI ✦ Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-indigo-400/25 text-indigo-300 text-xs font-medium tracking-wide mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <span>Powered by AI</span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
        </div>

        {/* Hero Title */}
        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
          Understand Complex Research <br className="hidden sm:inline" />
          <span className="text-white">in Seconds</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          PaperLens AI summarizes academic papers, highlights key insights, and helps you
          stay ahead—without reading every word.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onLoadSample}
            className="px-7 py-3 rounded-full text-sm font-medium text-slate-200 bg-[#0e142b]/90 hover:bg-[#161f42] border border-indigo-900/60 hover:border-indigo-400/50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-slate-300" />
            <span>Watch Demo Paper</span>
          </button>

          <button
            type="button"
            onClick={onGetStarted}
            className="px-8 py-3 rounded-full text-sm font-semibold text-slate-950 bg-gradient-to-r from-[#9db1f5] via-[#aab9fa] to-[#bba6fc] hover:opacity-95 shadow-[0_0_25px_rgba(157,177,245,0.4)] transition-all active:scale-[0.98]"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};
