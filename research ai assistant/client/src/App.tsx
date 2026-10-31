import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
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

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7] dark:bg-[#070d19] text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar llmMode={llmMode} onReset={handleReset} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Top Hero Banner only shown on Upload or Analyse steps */}
        {currentStep !== 'results' && <HeroBanner />}

        {/* 3-Step Wizard Navigation */}
        <StepperWizard currentStep={currentStep} />

        {/* Step 1: Upload */}
        {currentStep === 'upload' && (
          <UploadStep
            onStartAnalysis={handleStartAnalysis}
            isLoading={false}
            errorMessage={errorMessage}
          />
        )}

        {/* Step 2: Live SSE Analyse */}
        {currentStep === 'analyse' && (
          <AnalyseStep
            currentStage={currentStage}
            progressPercent={progressPercent}
            statusMessage={statusMessage}
            onCancel={handleCancelAnalysis}
          />
        )}

        {/* Step 3: Structured Results */}
        {currentStep === 'results' && analysisResult && (
          <ResultsStep result={analysisResult} onReset={handleReset} />
        )}
      </main>

      {/* Modern Academic Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 mt-12 bg-white/50 dark:bg-navy-950/40 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-navy-900 dark:text-cream-100">PaperLens</span>
            <span>• Research Paper Analysis Assistant</span>
          </div>
          <p>
            Dual-Pass Source Verification & Anti-Hallucination Engine • Portable Vite + Express Architecture
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
