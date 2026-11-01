import React from 'react';
import { UploadCloud, Cpu, CheckCircle2 } from 'lucide-react';

export type WizardStep = 'upload' | 'analyse' | 'results';

interface StepperWizardProps {
  currentStep: WizardStep;
}

export const StepperWizard: React.FC<StepperWizardProps> = ({ currentStep }) => {
  const steps = [
    { id: 'upload', label: '1. Upload Paper', icon: UploadCloud },
    { id: 'analyse', label: '2. Analyse & Verify', icon: Cpu },
    { id: 'results', label: '3. Grounded Results', icon: CheckCircle2 },
  ];

  const getStepStatus = (stepId: WizardStep) => {
    if (stepId === currentStep) return 'active';
    if (
      (stepId === 'upload' && (currentStep === 'analyse' || currentStep === 'results')) ||
      (stepId === 'analyse' && currentStep === 'results')
    ) {
      return 'completed';
    }
    return 'upcoming';
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-indigo-950/80 -z-10" />

        {steps.map((step) => {
          const status = getStepStatus(step.id as WizardStep);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center bg-[#060814] px-4 py-1 rounded-full z-10">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  status === 'completed'
                    ? 'bg-indigo-950 text-indigo-300 border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : status === 'active'
                    ? 'bg-gradient-to-r from-[#9bb0f4] to-[#bba7fc] text-slate-950 shadow-[0_0_20px_rgba(157,177,245,0.4)] ring-4 ring-indigo-500/20'
                    : 'bg-[#0d1229] text-slate-500 border border-indigo-950'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs mt-2 font-medium transition-colors ${
                  status === 'active'
                    ? 'text-white font-semibold'
                    : status === 'completed'
                    ? 'text-indigo-300'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
