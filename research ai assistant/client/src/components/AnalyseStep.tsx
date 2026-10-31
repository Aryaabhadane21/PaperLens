import React from 'react';
import { PipelineStage } from '../types';
import { FileSearch, Sparkles, ShieldCheck, Database, Loader2, XCircle } from 'lucide-react';

interface AnalyseStepProps {
  currentStage: PipelineStage;
  progressPercent: number;
  statusMessage: string;
  onCancel: () => void;
}

export const AnalyseStep: React.FC<AnalyseStepProps> = ({
  currentStage,
  progressPercent,
  statusMessage,
  onCancel,
}) => {
  const stages: Array<{ id: PipelineStage; label: string; desc: string; icon: React.ElementType }> = [
    {
      id: 'ingest',
      label: 'Ingest',
      desc: 'Parsing layout & extracting text',
      icon: FileSearch,
    },
    {
      id: 'extract',
      label: 'Extract',
      desc: 'Synthesizing 5 core pillars via LLM',
      icon: Sparkles,
    },
    {
      id: 'verify',
      label: 'Verify',
      desc: 'Grounding claims against source text',
      icon: ShieldCheck,
    },
    {
      id: 'save',
      label: 'Save',
      desc: 'Assembling academic synthesis',
      icon: Database,
    },
  ];

  const getStageStatus = (stageId: PipelineStage) => {
    const stageOrder: PipelineStage[] = ['ingest', 'extract', 'verify', 'save'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stageIndex = stageOrder.indexOf(stageId);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-cream-50 dark:bg-slate-900 border border-cream-200 dark:border-slate-800 rounded-3xl shadow-academic p-8 text-center transition-colors">
        {/* Radar/Pulse Loading Animation */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gold-500/10 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-gold-500/30 dark:border-gold-500/20 animate-spin [animation-duration:8s]" />
          <div className="w-20 h-20 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center shadow-lg border border-gold-500/30">
            <Loader2 className="w-9 h-9 animate-spin text-gold-400" />
          </div>
        </div>

        {/* Live Status Header */}
        <h3 className="font-serif text-2xl font-bold text-navy-900 dark:text-cream-50 mb-2">
          Deconstructing Paper
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-mono min-h-[2.5rem] flex items-center justify-center max-w-md mx-auto px-4 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-6">
          {statusMessage || 'Initializing analysis pipeline...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-gold-500 to-amber-400 h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>

        {/* 4-Stage Stepper Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mb-8">
          {stages.map((stage) => {
            const status = getStageStatus(stage.id);
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  status === 'completed'
                    ? 'bg-navy-900/5 dark:bg-navy-900/40 border-navy-900/20 dark:border-navy-700'
                    : status === 'active'
                    ? 'bg-gold-500/10 border-gold-500/40 shadow-sm ring-1 ring-gold-500/30'
                    : 'bg-white/40 dark:bg-slate-800/20 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      status === 'completed'
                        ? 'bg-navy-900 text-gold-400'
                        : status === 'active'
                        ? 'bg-gold-500 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      status === 'completed'
                        ? 'text-navy-900 dark:text-gold-400'
                        : status === 'active'
                        ? 'text-gold-600 dark:text-gold-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mb-0.5">
                  {stage.label}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Abort button */}
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancel & Return to Upload</span>
        </button>
      </div>
    </div>
  );
};
