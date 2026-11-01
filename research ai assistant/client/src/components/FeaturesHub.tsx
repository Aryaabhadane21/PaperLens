import React from 'react';

interface FeaturesHubProps {
  onStartFree: () => void;
}

export const FeaturesHub: React.FC<FeaturesHubProps> = ({ onStartFree }) => {
  const features = [
    {
      title: 'Smart Summarization',
      desc: 'Instantly break down long papers into concise, readable takeaways.',
      position: 'top-right',
    },
    {
      title: 'Ask Your Paper Anything',
      desc: "Chat with your document like it's an expert — get instant answers.",
      position: 'right',
    },
    {
      title: 'Highlight & Extract Key Points',
      desc: 'Automatically highlight important findings, methods, or conclusions.',
      position: 'bottom-right',
    },
    {
      title: 'Context-Aware AI',
      desc: 'Understand not just what the paper says, but why it matters.',
      position: 'bottom-left',
    },
    {
      title: 'Multilingual Support',
      desc: 'Read and understand papers in multiple languages with ease.',
      position: 'left',
    },
    {
      title: 'Save & Export Insights',
      desc: 'Organize, bookmark, and download insights for your next project.',
      position: 'top-left',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background soft ambient blur */}
      <div
        className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-4 space-y-6">
            <span className="text-sm font-semibold tracking-wide text-indigo-300 uppercase block">
              Our Features
            </span>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
              Smart Research <br />
              Starts Here
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              PaperLens AI isn't just a reader. It's your co-pilot for deep understanding.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onStartFree}
                className="px-8 py-3.5 rounded-full text-sm font-semibold text-slate-950 bg-gradient-to-r from-[#9bb0f4] via-[#abb9fa] to-[#bba7fc] hover:opacity-95 shadow-[0_0_25px_rgba(157,177,245,0.35)] transition-all active:scale-[0.98]"
              >
                Start Free
              </button>
            </div>
          </div>

          {/* Right Column: Radial Hub (matching Inspo Image 3) */}
          <div className="lg:col-span-8 relative flex items-center justify-center min-h-[520px]">
            {/* Desktop Visual Hub */}
            <div className="relative w-full max-w-[620px] aspect-square flex items-center justify-center">
              {/* Radial spoke lines connecting center to nodes (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-indigo-900/60" strokeWidth="1.5">
                {/* Connecting lines from center (50% 50%) */}
                <line x1="50%" y1="50%" x2="50%" y2="8%" />
                <line x1="50%" y1="50%" x2="86%" y2="28%" />
                <line x1="50%" y1="50%" x2="86%" y2="72%" />
                <line x1="50%" y1="50%" x2="50%" y2="92%" />
                <line x1="50%" y1="50%" x2="14%" y2="72%" />
                <line x1="50%" y1="50%" x2="14%" y2="28%" />
              </svg>

              {/* Center Glowing Orb */}
              <div className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-b from-[#111736] to-[#090d1f] border-2 border-indigo-400/40 p-4 flex flex-col items-center justify-center text-center shadow-[0_0_50px_rgba(99,102,241,0.35)]">
                <div className="w-12 h-12 flex items-center justify-center text-white mb-2">
                  <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                    <rect x="7" y="7" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="7" y="22" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="23" y="7" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="23" y="22" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="17" y1="12.5" x2="23" y2="12.5" stroke="currentColor" strokeWidth="2.5" />
                    <line x1="17" y1="27.5" x2="23" y2="27.5" stroke="currentColor" strokeWidth="2.5" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white leading-tight">
                  one stop <br /> app for <br /> any tasks
                </span>
              </div>

              {/* Node 1: Smart Summarization (Top) */}
              <div className="absolute top-[2%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center max-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-[#0d1430] border-2 border-indigo-500/50 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] mb-2">
                  <div className="w-7 h-7 rounded-full border border-indigo-400/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white">Smart Summarization</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Break down long papers into concise takeaways
                </p>
              </div>

              {/* Node 2: Ask Your Paper Anything (Top Right) */}
              <div className="absolute top-[22%] right-[-4%] sm:right-[2%] flex items-center gap-3 text-left max-w-[210px]">
                <div className="w-14 h-14 shrink-0 rounded-full bg-[#0d1430] border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <div className="w-7 h-7 rounded-full border border-indigo-400/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Ask Your Paper Anything</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Chat with your document like an expert
                  </p>
                </div>
              </div>

              {/* Node 3: Highlight & Extract Key Points (Bottom Right) */}
              <div className="absolute bottom-[18%] right-[-4%] sm:right-[2%] flex items-center gap-3 text-left max-w-[210px]">
                <div className="w-14 h-14 shrink-0 rounded-full bg-[#0d1430] border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <div className="w-7 h-7 rounded-full border border-indigo-400/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Highlight & Extract</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Auto-extract findings, methods, conclusions
                  </p>
                </div>
              </div>

              {/* Node 4: Context-Aware AI (Bottom) */}
              <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center max-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-[#0d1430] border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] mb-2">
                  <div className="w-7 h-7 rounded-full border border-indigo-400/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white">Context-Aware AI</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Understand what it says and why it matters
                </p>
              </div>

              {/* Node 5: Multilingual Support (Bottom Left) */}
              <div className="absolute bottom-[18%] left-[-4%] sm:left-[2%] flex flex-row-reverse items-center gap-3 text-right max-w-[210px]">
                <div className="w-14 h-14 shrink-0 rounded-full bg-[#0d1430] border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <div className="w-7 h-7 rounded-full border border-indigo-400/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Multilingual Support</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Read and parse papers in multiple languages
                  </p>
                </div>
              </div>

              {/* Node 6: Save & Export Insights (Top Left) */}
              <div className="absolute top-[22%] left-[-4%] sm:left-[2%] flex flex-row-reverse items-center gap-3 text-right max-w-[210px]">
                <div className="w-14 h-14 shrink-0 rounded-full bg-[#0d1430] border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <div className="w-7 h-7 rounded-full border border-indigo-400/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Save & Export Insights</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Download as PDF, Word, Markdown, or Copy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

