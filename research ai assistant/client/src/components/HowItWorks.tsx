import React from 'react';
import { FolderUp, FileText, MessageSquareQuote, BookmarkCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Upload Your Paper',
      desc: 'Drag and drop any research paper, article, or PDF.',
      icon: FolderUp,
    },
    {
      num: '2',
      title: 'AI Reads & Summarizes',
      desc: 'PaperLens AI scans the document and extracts key insights in seconds.',
      icon: FileText,
    },
    {
      num: '3',
      title: 'Ask Anything',
      desc: 'Chat with your paper — ask questions, clarify concepts, and go deeper.',
      icon: MessageSquareQuote,
    },
    {
      num: '4',
      title: 'Save or Share',
      desc: 'Bookmark key ideas or export insights for future reference.',
      icon: BookmarkCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold tracking-wide text-indigo-300 uppercase mb-3">
            How it Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 leading-tight">
            We're an intelligent research assistant
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-300">
            We turn complex papers into clear insights
          </h3>
        </div>

        {/* 4 Cards Grid from Inspo Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative flex flex-col justify-between p-7 rounded-2xl bg-[#090d1f]/90 border border-indigo-900/40 hover:border-indigo-500/50 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)] group overflow-hidden min-h-[340px]"
              >
                {/* Subtle top card glow on hover */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

                <div>
                  {/* Icon badge */}
                  <div className="w-14 h-14 rounded-2xl bg-white text-slate-950 flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Big Hollow Number at Bottom matching Inspo Image 2 */}
                <div className="mt-8 pt-4">
                  <span className="text-stroke-outline text-6xl sm:text-7xl font-light select-none font-sans block leading-none">
                    {step.num}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

