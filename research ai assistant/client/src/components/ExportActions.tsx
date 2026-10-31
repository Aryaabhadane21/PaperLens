import React, { useState } from 'react';
import { PaperAnalysisResult } from '../types';
import { getExportUrl } from '../lib/api';
import { FileText, Download, Check, Copy } from 'lucide-react';

interface ExportActionsProps {
  result: PaperAnalysisResult;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ result }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyClipboard = async () => {
    try {
      const summaryText = `# ${result.analysis.title}
PaperLens Grounded Analysis (Score: ${result.verification.overallConfidenceScore}%)

## Executive Summary
${result.analysis.executiveSummary}

## 1. Problem Statement
${result.analysis.problem.statement}
Literature Gap: ${result.analysis.problem.literatureGap || 'N/A'}

## 2. Objectives
Primary: ${result.analysis.objectives.primaryObjective}
${result.analysis.objectives.secondaryObjectives?.map((o) => `- ${o}`).join('\n') || ''}

## 3. Methodology
Design: ${result.analysis.methodology.researchDesign}
Dataset: ${result.analysis.methodology.datasetOrParticipants || 'N/A'}

## 4. Key Findings
${result.analysis.findings.keyResults.map((r) => `- ${r}`).join('\n')}
${result.analysis.findings.quantitativeMetrics?.map((m) => `- ${m.metricName}: ${m.value} (${m.baselineOrComparison || ''})`).join('\n') || ''}

## 5. Limitations
${result.analysis.limitations.methodologicalLimitations.map((l) => `- ${l}`).join('\n')}
`;

      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Copy Clipboard */}
      <button
        type="button"
        onClick={handleCopyClipboard}
        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-gold-500 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">Copied to Clipboard!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-gold-600 dark:text-gold-400" />
            <span>Copy Text</span>
          </>
        )}
      </button>

      {/* Markdown */}
      <a
        href={getExportUrl(result.id, 'markdown')}
        download
        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-gold-500 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
      >
        <FileText className="w-4 h-4 text-navy-800 dark:text-cream-100" />
        <span>Markdown (.md)</span>
      </a>

      {/* Word */}
      <a
        href={getExportUrl(result.id, 'word')}
        download
        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
      >
        <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>Word (.docx)</span>
      </a>

      {/* PDF */}
      <a
        href={getExportUrl(result.id, 'pdf')}
        download
        className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy-900 hover:bg-navy-800 dark:bg-gold-500 dark:hover:bg-gold-600 text-white dark:text-navy-950 flex items-center gap-1.5 shadow-md shadow-navy-900/20 dark:shadow-gold-500/20 transition-all active:scale-95"
      >
        <Download className="w-4 h-4 text-gold-400 dark:text-navy-950" />
        <span>Download PDF</span>
      </a>
    </div>
  );
};
