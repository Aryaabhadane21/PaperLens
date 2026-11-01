import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How can I use this?',
      answer:
        'Simply drag and drop any research paper in PDF, DOCX, or TXT format, or paste an arXiv / web article URL. PaperLens AI automatically runs a multi-stage pipeline: ingesting text, extracting the 5 core academic pillars (Problem, Objectives, Methodology, Findings, Limitations), and auditing every claim against the original text.',
    },
    {
      question: 'Can I upload different type files?',
      answer:
        'Yes! PaperLens AI supports PDF documents, Microsoft Word (.docx and legacy .doc), plain text (.txt), and direct web URLs. It features built-in OCR detection for scanned or empty PDFs and strict SSRF security for safe URL processing.',
    },
    {
      question: 'Will it give correct answers?',
      answer:
        'PaperLens AI is engineered with an anti-hallucination verification engine. Every extracted claim is audited in a secondary pass against the raw text, scoring confidence from 0% to 100% and attributing exact verbatim citations directly from the source.',
    },
    {
      question: 'Can I export the synthesized research?',
      answer:
        'Yes. You can export complete academic dossiers formatted as styled PDFs, Microsoft Word documents (.docx), GitHub-flavored Markdown (.md), or copy structured notes directly to your clipboard.',
    },
  ];

  return (
    <section id="faq" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-full border border-indigo-900/60 bg-gradient-to-r from-[#0d1430]/90 to-[#121838]/90 overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-indigo-500/50"
                style={{
                  borderRadius: isOpen ? '1.5rem' : '9999px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-8 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-base sm:text-lg text-white">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 ml-4 border border-indigo-500/30">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-8 pb-6 text-sm text-slate-300 leading-relaxed pt-1 border-t border-indigo-950/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

