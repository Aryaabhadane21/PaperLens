import React from 'react';
import { ShieldCheck, FileCheck, Layers, Cpu } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-850 text-white pt-10 pb-12 px-4 sm:px-6 rounded-3xl shadow-xl border border-navy-800/80 mb-8">
      {/* Subtle Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badges */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-800/80 border border-gold-500/30 text-gold-400 text-xs font-medium tracking-wide uppercase mb-4 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span>Factual Grounding & Anti-Hallucination Pipeline</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-cream-50 leading-tight mb-4">
          Deconstruct Research Papers into <span className="text-gold-400 underline decoration-gold-600/40 underline-offset-8">Grounded Insights</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Upload any academic paper as <span className="text-cream-100 font-medium">PDF, DOCX, TXT</span> or paste a URL. 
          Extract Problem, Objectives, Methodology, Findings & Limitations—with every assertion verified against source text.
        </p>

        {/* Highlight pill cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-navy-850/60 border border-navy-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <FileCheck className="w-4 h-4" />
              <span>Multi-Format</span>
            </div>
            <p className="text-xs text-slate-300">PDF, TXT, Word (.doc/x), & URL Readability</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-850/60 border border-navy-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>5 Core Pillars</span>
            </div>
            <p className="text-xs text-slate-300">Problem, Objectives, Method, Results, Limits</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-850/60 border border-navy-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Claim Audit</span>
            </div>
            <p className="text-xs text-slate-300">Dual-pass cross-checking with source quotes</p>
          </div>

          <div className="p-3 rounded-xl bg-navy-850/60 border border-navy-700/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Cpu className="w-4 h-4" />
              <span>Full Export</span>
            </div>
            <p className="text-xs text-slate-300">One-click PDF, Word, Markdown, or Copy</p>
          </div>
        </div>
      </div>
    </div>
  );
};
