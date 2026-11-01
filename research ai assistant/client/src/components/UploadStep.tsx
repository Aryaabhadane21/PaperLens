import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Link as LinkIcon, FileText, X, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface UploadStepProps {
  onStartAnalysis: (payload: { file?: File | null; url?: string | null }) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export const UploadStep: React.FC<UploadStepProps> = ({ onStartAnalysis, isLoading, errorMessage }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setLocalError(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalError(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.pdf', '.txt', '.doc', '.docx'];
    const fileExt = '.' + (file.name.split('.').pop() || '').toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      setLocalError(`Unsupported file format (${fileExt}). Please upload a PDF, TXT, DOC, or DOCX document.`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setLocalError('File size exceeds the 25MB maximum limit.');
      return;
    }

    setSelectedFile(file);
    setLocalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (activeTab === 'file') {
      if (!selectedFile) {
        setLocalError('Please choose or drag-and-drop a research paper file first.');
        return;
      }
      onStartAnalysis({ file: selectedFile });
    } else {
      const cleanUrl = urlInput.trim();
      if (!cleanUrl) {
        setLocalError('Please enter a research paper or article URL.');
        return;
      }
      try {
        new URL(cleanUrl);
      } catch {
        setLocalError('Please provide a valid URL format starting with http:// or https://');
        return;
      }
      onStartAnalysis({ url: cleanUrl });
    }
  };

  const loadSamplePaper = async () => {
    setLocalError(null);
    try {
      const sampleText = `Attention Mechanisms in Deep Neural Architectures for Scientific Language Modeling

Abstract
Recent breakthroughs in natural language processing rely heavily on self-attention mechanisms. In this study, we propose "Self-Grounded Transformer", an attention-based architecture that dynamically verifies internal factual representations. Across three benchmark corpora containing over 100,000 academic papers, our model achieves a 94.2% factual grounding accuracy, representing a 14.8% improvement over recurrent baselines (79.4%) and an 8.5% improvement over standard ungrounded transformers. In addition, inference latency is reduced by 22.3% through sparse attention routing.

1. Introduction and Problem Statement
Scientific literature is expanding exponentially, with more than 3 million peer-reviewed articles published annually. Researchers face cognitive overload trying to synthesize findings across fragmented domains. Existing sequence-to-sequence models frequently generate plausible-sounding hallucinations when tasked with summarizing complex papers. The central problem addressed in this work is the lack of verifiable grounding mechanisms in deep language models. Prior literature failed to integrate dual-pass claim verification directly into the decoding loop, leading to uncontrolled hallucination rates in high-stakes summarization.

2. Objectives and Hypotheses
Our primary objective is to formulate an end-to-end grounded neural architecture capable of extracting verifiable structured claims from long-form scientific documents. Secondary objectives include: (1) Benchmarking factual precision against human expert annotators, and (2) Developing a low-overhead claim corroboration algorithm. We test the hypothesis that multi-pass cross-attention filtering reduces factual hallucination by at least 10% without reducing ROUGE-L recall.

3. Methodology
We utilized a mixed-method empirical experimental design. The primary dataset consists of 50,000 peer-reviewed papers from arXiv and PubMed, balanced across computer science, biomedicine, and physics. Our experimental framework was implemented in PyTorch and HuggingFace Transformers, trained across a cluster of 8 NVIDIA A100 GPUs using AdamW optimizer (learning rate 5e-5). Evaluation metrics include Precision@K, Factual Grounding Score (FGS), ROUGE-1, ROUGE-2, and ROUGE-L. Models were compared against three baseline systems: Bi-LSTM, Standard Transformer, and GPT-3.5 zero-shot.

4. Findings and Results
The empirical evaluation demonstrated substantial performance leaps:
- Factual Grounding Accuracy reached 94.2% compared to 79.4% for Bi-LSTM and 85.7% for standard Transformer.
- Hallucination frequency dropped from 18.2% to 3.8% (a 14.4% absolute reduction).
- Inference latency improved by 22.3% due to sparse cross-attention heads.
Qualitative inspection revealed that our verification pass successfully identified and filtered out 91.5% of unsupported speculative statements.

5. Limitations and Threats to Validity
Several limitations must be noted: First, our parser assumes machine-readable text layers; performance degrades significantly on scanned PDFs without clean OCR. Second, training on English-only academic corpora limits generalizability to non-English scientific texts. Third, context window constraints of 16,384 tokens restrict single-pass analysis on lengthy doctoral dissertations. Future research should explore multi-modal visual document transformers for table and equation extraction.`;

      const blob = new Blob([sampleText], { type: 'text/plain' });
      const file = new File([blob], 'Attention_Mechanisms_Paper.txt', { type: 'text/plain' });
      setSelectedFile(file);
      setActiveTab('file');
    } catch (err: any) {
      setLocalError('Failed to load sample paper: ' + err.message);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div id="upload-section" className="w-full max-w-3xl mx-auto scroll-mt-28 mb-16">
      {/* Sleek Frosted Glass Container */}
      <div className="bg-[#090d1f]/90 backdrop-blur-2xl border border-indigo-900/50 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] p-6 sm:p-9 transition-all">
        {/* Tab Headers */}
        <div className="flex border-b border-indigo-950/80 mb-7">
          <button
            type="button"
            onClick={() => {
              setActiveTab('file');
              setLocalError(null);
            }}
            className={`flex items-center gap-2 pb-3.5 px-5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'file'
                ? 'border-indigo-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Upload Document</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('url');
              setLocalError(null);
            }}
            className={`flex items-center gap-2 pb-3.5 px-5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-indigo-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-indigo-400" />
            <span>Paper URL</span>
          </button>
        </div>

        {/* Error Alert */}
        {(errorMessage || localError) && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-rose-100">Analysis Notice</p>
              <p className="mt-0.5 opacity-90">{errorMessage || localError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {activeTab === 'file' ? (
            <div>
              {/* Drag and drop zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-9 text-center cursor-pointer transition-all duration-200 group ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : selectedFile
                    ? 'border-indigo-500/50 bg-[#0e1430]/70'
                    : 'border-indigo-950 hover:border-indigo-500/60 bg-[#060814]/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-300 flex items-center justify-center mb-3 shadow-md border border-indigo-500/30">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-2 max-w-full">
                      <span className="font-semibold text-white text-base truncate max-w-xs sm:max-w-md">
                        {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 mt-1">
                      {formatFileSize(selectedFile.size)} • Click or drop another to replace
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-white text-slate-950 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-md">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    <p className="text-base font-medium text-white">
                      <span className="text-indigo-300 font-semibold underline underline-offset-4">Click to browse</span> or drag & drop paper
                    </p>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Supports PDF, TXT, DOC, DOCX (up to 25MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Sample paper quick action */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400">Need a paper to test right now?</span>
                <button
                  type="button"
                  onClick={loadSamplePaper}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0e1430] border border-indigo-900/60 text-indigo-300 hover:border-indigo-400/60 font-medium transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Load Sample Research Paper (Self-Grounded Transformer)</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* URL Input */}
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Academic Paper or Article URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setLocalError(null);
                  }}
                  placeholder="https://arxiv.org/abs/1706.03762 or web article URL"
                  className="w-full px-4 py-3.5 rounded-xl border border-indigo-950 bg-[#060814]/70 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                />
                {urlInput && (
                  <button
                    type="button"
                    onClick={() => setUrlInput('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Protected with strict SSRF guard against loopbacks and cloud internal networks.
              </p>

              {/* Sample preset links */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400">Quick presets:</span>
                <button
                  type="button"
                  onClick={() => setUrlInput('https://arxiv.org/abs/1706.03762')}
                  className="px-3 py-1 rounded-md bg-[#0e1430] border border-indigo-900/60 text-slate-300 hover:border-indigo-400/60 transition-colors"
                >
                  Attention Is All You Need (arXiv)
                </button>
                <button
                  type="button"
                  onClick={() => setUrlInput('https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)')}
                  className="px-3 py-1 rounded-md bg-[#0e1430] border border-indigo-900/60 text-slate-300 hover:border-indigo-400/60 transition-colors"
                >
                  Transformer Architecture (Overview)
                </button>
              </div>
            </div>
          )}

          {/* Submit Button (Matching Inspo Image 1 button style) */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading || (activeTab === 'file' && !selectedFile) || (activeTab === 'url' && !urlInput.trim())}
              className={`w-full py-4 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                isLoading || (activeTab === 'file' && !selectedFile) || (activeTab === 'url' && !urlInput.trim())
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#9bb0f4] via-[#abb9fa] to-[#bba7fc] text-slate-950 hover:opacity-95 shadow-[0_0_25px_rgba(157,177,245,0.35)] active:scale-[0.99]'
              }`}
            >
              <span>Analyze Paper & Verify Claims</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
