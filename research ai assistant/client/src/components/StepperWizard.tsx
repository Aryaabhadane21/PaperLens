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
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

        {steps.map((step) => {
          const status = getStepStatus(step.id as WizardStep);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center bg-white dark:bg-navy-950 px-3 py-1 rounded-full z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-sm ${
                  status === 'completed'
                    ? 'bg-navy-900 dark:bg-navy-800 text-gold-400 border-2 border-gold-500'
                    : status === 'active'
                    ? 'bg-gold-500 text-white shadow-gold-500/20 ring-4 ring-gold-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs mt-1.5 font-medium transition-colors ${
                  status === 'active'
                    ? 'text-navy-900 dark:text-cream-50 font-semibold'
                    : status === 'completed'
                    ? 'text-gold-700 dark:text-gold-400'
                    : 'text-slate-400 dark:text-slate-500'
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
