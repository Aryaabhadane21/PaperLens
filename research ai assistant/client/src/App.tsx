import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesHub } from './components/FeaturesHub';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { StepperWizard, WizardStep } from './components/StepperWizard';
import { UploadStep } from './components/UploadStep';
import { AnalyseStep } from './components/AnalyseStep';
import { ResultsStep } from './components/ResultsStep';
import { PaperAnalysisResult, PipelineStage, SSEPipelineEvent } from './types';
import { analyzePaperSse, checkServerHealth } from './lib/api';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [currentStage, setCurrentStage] = useState<PipelineStage>('ingest');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PaperAnalysisResult | null>(null);
  const [llmMode, setLlmMode] = useState<string>('mock');
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    checkServerHealth().then((health) => {
      if (health?.llmMode) {
        setLlmMode(health.llmMode);
      }
    });
  }, []);

  const handleStartAnalysis = async (payload: { file?: File | null; url?: string | null }) => {
    setErrorMessage(null);
    setCurrentStep('analyse');
    setCurrentStage('ingest');
    setProgressPercent(15);
    setStatusMessage('Initiating multi-stage analysis pipeline...');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await analyzePaperSse(
        payload,
        (event: SSEPipelineEvent) => {
          if (event.stage) setCurrentStage(event.stage);
          if (typeof event.percent === 'number') setProgressPercent(event.percent);
          if (event.message) setStatusMessage(event.message);
        },
        controller.signal
      );

      setAnalysisResult(result);
      setCurrentStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Analysis aborted by user.');
        setCurrentStep('upload');
        return;
      }
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while analyzing the document.');
      setCurrentStep('upload');
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelAnalysis = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setCurrentStep('upload');
    setStatusMessage('');
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setAnalysisResult(null);
    setCurrentStep('upload');
    setCurrentStage('ingest');
    setProgressPercent(0);
    setStatusMessage('');
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Demo sample paper trigger from Hero
  const handleLoadSampleFromHero = () => {
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
    handleStartAnalysis({ file });
  };

  const scrollToUpload = () => {
    const el = document.getElementById('upload-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (currentStep !== 'upload') {
      setCurrentStep('upload');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060814] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar llmMode={llmMode} onReset={handleReset} onScrollToSection={scrollToSection} />

      <main className="flex-1 w-full">
        {/* Landing Page Content (when in 'upload' step) */}
        {currentStep === 'upload' && (
          <div>
            {/* 1. Hero Banner (Inspo Image 1) */}
            <HeroBanner
              onLoadSample={handleLoadSampleFromHero}
              onGetStarted={scrollToUpload}
            />

            {/* 2. Interactive Document Upload Container */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <UploadStep
                onStartAnalysis={handleStartAnalysis}
                isLoading={false}
                errorMessage={errorMessage}
              />
            </div>

            {/* 3. How It Works Section (Inspo Image 2) */}
            <HowItWorks />

            {/* 4. Features Radial Hub (Inspo Image 3) */}
            <FeaturesHub onStartFree={scrollToUpload} />

            {/* 5. FAQ Accordion (Inspo Image 4) */}
            <FaqSection />
          </div>
        )}

        {/* Live SSE Analysis View (when processing) */}
        {currentStep === 'analyse' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <StepperWizard currentStep={currentStep} />
            <AnalyseStep
              currentStage={currentStage}
              progressPercent={progressPercent}
              statusMessage={statusMessage}
              onCancel={handleCancelAnalysis}
            />
          </div>
        )}

        {/* Structured Results View */}
        {currentStep === 'results' && analysisResult && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <StepperWizard currentStep={currentStep} />
            <ResultsStep result={analysisResult} onReset={handleReset} />
          </div>
        )}
      </main>

      {/* Modern ThinkAI Footer (Inspo Image 4) */}
      <Footer />
    </div>
  );
};

export default App;
