import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  llmMode?: string;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ llmMode = 'mock', onReset }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-navy-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onReset}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-navy-900 dark:bg-navy-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-gold-500/30">
            <BookOpen className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl tracking-tight text-navy-900 dark:text-cream-50">
                PaperLens
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-gold-500/10 text-gold-700 dark:text-gold-400 rounded-full border border-gold-500/20">
                Assistant
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Verifiable Research Paper Synthesis
            </p>
          </div>
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>LLM: {llmMode === 'gemini' ? 'Google Gemini 2.5' : 'Keyless Intelligent Mock'}</span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
