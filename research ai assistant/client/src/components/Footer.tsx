import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-indigo-950/80 bg-[#050711] pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Brand & Address (Image 4) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center text-white">
                <svg className="w-9 h-9" viewBox="0 0 40 40" fill="none">
                  <rect x="7" y="7" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="7" y="22" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="23" y="7" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
                  <rect x="23" y="22" width="10" height="11" rx="4" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="17" y1="12.5" x2="23" y2="12.5" stroke="currentColor" strokeWidth="2.5" />
                  <line x1="17" y1="27.5" x2="23" y2="27.5" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </div>
              <span className="font-sans font-bold text-2xl text-white tracking-tight">
                PaperLens AI
              </span>
            </div>

            <div className="text-slate-400 space-y-1 text-sm pt-2">
              <p className="font-medium text-slate-300">Pearl Labs LLC</p>
              <p>8 The Green Ste A</p>
              <p>Dover, DE 19901</p>
            </div>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-semibold text-white text-sm">Legal</h5>
            <ul className="space-y-2">
              <li><a href="#privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-slate-200 transition-colors">Terms and Conditions</a></li>
              <li><a href="#disclaimer" className="hover:text-slate-200 transition-colors">Disclaimer</a></li>
              <li><a href="#payment" className="hover:text-slate-200 transition-colors">Payment Policy</a></li>
            </ul>
          </div>

          {/* Learn More Links */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-semibold text-white text-sm">Learn More</h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li><a href="#about" className="hover:text-slate-200 transition-colors">About Us</a></li>
              <li><a href="#faq" className="hover:text-slate-200 transition-colors">FAQ</a></li>
              <li><a href="#tutorials" className="hover:text-slate-200 transition-colors">Tutorials</a></li>
              <li><a href="#docx" className="hover:text-slate-200 transition-colors">Chat With DOCX Files</a></li>
              <li><a href="#pptx" className="hover:text-slate-200 transition-colors">Chat With PPTX Files</a></li>
              <li><a href="#markdown" className="hover:text-slate-200 transition-colors">Chat With Markdown</a></li>
              <li><a href="#txt" className="hover:text-slate-200 transition-colors">Chat With TXT Files</a></li>
              <li><a href="#audio" className="hover:text-slate-200 transition-colors">Audio to Text</a></li>
              <li><a href="#pdf" className="hover:text-slate-200 transition-colors">Audio to PDF</a></li>
              <li><a href="#video" className="hover:text-slate-200 transition-colors">Summarize Research Papers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-indigo-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>©PaperLens AI 2025 • Research Analysis Engine</p>
          <p className="flex items-center gap-1.5">
            <span>Anti-Hallucination Verification Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </p>
        </div>
      </div>
    </footer>
  );
};

