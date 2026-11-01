import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  llmMode?: string;
  onReset: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ llmMode = 'mock', onReset, onScrollToSection }) => {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const sectionIds = ['home', 'upload-section', 'how-it-works', 'features', 'faq'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id === 'upload-section' ? 'home' : id);
            return;
          }
        }
      }
      setActiveSection('home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setActiveSection(sectionId);
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'faq', label: 'For Researchers' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#060814]/85 border-b border-indigo-950/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={onReset}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-10 h-10 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-transform group-hover:scale-105">
            <svg
              className="w-9 h-9"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="7" y="7" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
              <rect x="7" y="22" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
              <rect x="23" y="7" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
              <rect x="23" y="22" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
              <line x1="17" y1="12.5" x2="23" y2="12.5" stroke="currentColor" strokeWidth="2.5" />
              <line x1="17" y1="27.5" x2="23" y2="27.5" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-2xl tracking-tight text-white">
              PaperLens AI
            </span>
          </div>
        </button>

        {/* Dynamic Center Nav Links with Dynamic Scroll Bar */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative py-1.5 transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full animate-in fade-in duration-200" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right CTA / LLM Status */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#0d1226] border border-indigo-950 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>LLM: {llmMode === 'gemini' ? 'Google Gemini' : 'Intelligent Mock'}</span>
          </div>

          <a
            href="#upload-section"
            onClick={(e) => handleNavClick(e, 'upload-section')}
            className="px-5 py-2 rounded-full text-sm font-medium text-slate-200 bg-[#0d1226] hover:bg-[#151c38] border border-indigo-500/40 hover:border-indigo-400 transition-all shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
};
