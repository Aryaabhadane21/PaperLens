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
    <div className="w-full max-w-2xl mx-auto my-8">
      <div className="bg-[#090d1f]/90 backdrop-blur-2xl border border-indigo-900/50 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] p-8 text-center transition-all">
        {/* Radar/Pulse Loading Animation */}
        <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-indigo-500/15 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-indigo-400/30 animate-spin [animation-duration:8s]" />
          <div className="w-20 h-20 rounded-full bg-[#0d1430] text-indigo-300 flex items-center justify-center shadow-lg border border-indigo-500/40">
            <Loader2 className="w-9 h-9 animate-spin text-indigo-300" />
          </div>
        </div>

        {/* Live Status Header */}
        <h3 className="font-sans text-2xl font-bold text-white mb-2">
          Deconstructing Research Paper
        </h3>
        <p className="text-sm text-slate-300 font-mono min-h-[2.5rem] flex items-center justify-center max-w-md mx-auto px-4 py-1.5 rounded-lg bg-[#060814]/70 border border-indigo-950 mb-6">
          {statusMessage || 'Initializing analysis pipeline...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-[#060814] rounded-full h-2.5 mb-8 overflow-hidden border border-indigo-950">
          <div
            className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 h-2.5 rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
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
                    ? 'bg-indigo-950/40 border-indigo-700/60'
                    : status === 'active'
                    ? 'bg-indigo-500/15 border-indigo-400/50 shadow-sm ring-1 ring-indigo-400/30'
                    : 'bg-[#060814]/30 border-indigo-950/60 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      status === 'completed'
                        ? 'bg-indigo-600 text-white'
                        : status === 'active'
                        ? 'bg-gradient-to-r from-[#9bb0f4] to-[#bba7fc] text-slate-950 animate-pulse'
                        : 'bg-[#0e1430] text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      status === 'completed'
                        ? 'text-indigo-300'
                        : status === 'active'
                        ? 'text-indigo-200'
                        : 'text-slate-600'
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-white mb-0.5">
                  {stage.label}
                </h4>
                <p className="text-[11px] text-slate-400 leading-tight">
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
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancel & Return to Upload</span>
        </button>
      </div>
    </div>
  );
};
