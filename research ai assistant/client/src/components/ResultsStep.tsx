import React from 'react';
import { PaperAnalysisResult } from '../types';
import { SectionCard } from './SectionCard';
import { VerificationCard } from './VerificationCard';
import { ExportActions } from './ExportActions';
import {
  AlertCircle,
  Target,
  FlaskConical,
  TrendingUp,
  ShieldAlert,
  ArrowLeft,
  FileText,
  Calendar,
  Layers,
  BarChart2,
  CheckCircle,
} from 'lucide-react';

interface ResultsStepProps {
  result: PaperAnalysisResult;
  onReset: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ result, onReset }) => {
  const { analysis, metadata, verification } = result;

  return (
    <div className="w-full max-w-5xl mx-auto pb-16">
      {/* Top Bar / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-gold-400 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Paper</span>
        </button>

        <ExportActions result={result} />
      </div>

      {/* Title & Metadata Card */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-850 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-800 mb-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="px-3 py-1 rounded-full bg-navy-800 text-gold-400 border border-gold-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gold-400" />
            <span>{metadata.sourceType.toUpperCase()} Source</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-navy-800/80 text-slate-300 text-xs flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{metadata.wordCount.toLocaleString()} Words</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{verification.overallConfidenceScore}% Grounded</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-navy-800/80 text-slate-300 text-xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date(result.createdAt).toLocaleDateString()}</span>
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-cream-50 leading-snug mb-4">
          {analysis.title}
        </h1>

        {/* Executive Summary Block */}
        <div className="mt-4 p-5 rounded-2xl bg-navy-900/90 border border-gold-500/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Executive Synthesis</span>
          </div>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light">
            {analysis.executiveSummary}
          </p>
        </div>
      </div>

      {/* Verification Breakdown Panel */}
      <VerificationCard verification={verification} />

      {/* Five Section Cards */}
      <div className="space-y-6">
        {/* 1. Problem Statement */}
        <SectionCard title="1. Problem Statement" icon={AlertCircle} badge="Context & Literature Gap">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Core Research Bottleneck
              </h4>
              <p className="text-slate-900 dark:text-slate-100 font-medium">
                {analysis.problem.statement}
              </p>
            </div>

            {analysis.problem.literatureGap && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs">
                <span className="font-semibold uppercase tracking-wider block mb-1">
                  Identified Literature Gap
                </span>
                <p>{analysis.problem.literatureGap}</p>
              </div>
            )}

            {analysis.problem.contextAndSignificance && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Broader Significance
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {analysis.problem.contextAndSignificance}
                </p>
              </div>
            )}

            {analysis.problem.keyChallenges?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Key Challenges
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 dark:text-slate-300 marker:text-gold-500">
                  {analysis.problem.keyChallenges.map((challenge, idx) => (
                    <li key={idx}>{challenge}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SectionCard>

        {/* 2. Objectives & Hypotheses */}
        <SectionCard title="2. Objectives & Hypotheses" icon={Target} badge="Target Goals">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Primary Objective
              </h4>
              <p className="text-slate-900 dark:text-slate-100 font-medium">
                {analysis.objectives.primaryObjective}
              </p>
            </div>

            {analysis.objectives.secondaryObjectives?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Secondary Objectives
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 dark:text-slate-300 marker:text-gold-500">
                  {analysis.objectives.secondaryObjectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.objectives.hypotheses?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-navy-900 dark:text-gold-400 uppercase tracking-wider mb-2">
                  Testable Hypotheses
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 dark:text-slate-300 marker:text-gold-500">
                  {analysis.objectives.hypotheses.map((hyp, idx) => (
                    <li key={idx} className="italic">"{hyp}"</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SectionCard>

        {/* 3. Methodology */}
        <SectionCard title="3. Methodology" icon={FlaskConical} badge="Experimental Design">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Research Design
              </h4>
              <p className="text-slate-900 dark:text-slate-100">
                {analysis.methodology.researchDesign}
              </p>
            </div>

            {analysis.methodology.datasetOrParticipants && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Corpus & Datasets
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {analysis.methodology.datasetOrParticipants}
                </p>
              </div>
            )}

            {analysis.methodology.toolsAndFrameworks?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Tools, Frameworks & Infrastructure
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.methodology.toolsAndFrameworks.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {analysis.methodology.experimentalProcedure && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Procedure & Pipeline
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {analysis.methodology.experimentalProcedure}
                </p>
              </div>
            )}

            {analysis.methodology.evaluationMetrics?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Evaluation Metrics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.methodology.evaluationMetrics.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-gold-50 dark:bg-gold-950/40 text-gold-800 dark:text-gold-300 border border-gold-300 dark:border-gold-800 text-[11px] font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* 4. Findings */}
        <SectionCard title="4. Key Findings" icon={TrendingUp} badge="Empirical Discoveries">
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Primary Findings
              </h4>
              <ul className="space-y-2 pl-4 list-disc text-sm text-slate-800 dark:text-slate-200 marker:text-emerald-500 font-medium">
                {analysis.findings.keyResults.map((resultStr, idx) => (
                  <li key={idx}>{resultStr}</li>
                ))}
              </ul>
            </div>

            {/* Quantitative Metrics Table */}
            {analysis.findings.quantitativeMetrics?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                  <span>Quantitative Benchmarks</span>
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-4 font-semibold">Metric</th>
                        <th className="py-2.5 px-4 font-semibold">Reported Value</th>
                        <th className="py-2.5 px-4 font-semibold">Baseline / Comparison</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                      {analysis.findings.quantitativeMetrics.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/60">
                          <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-slate-100">
                            {row.metricName}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                            {row.value}
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-sans">
                            {row.baselineOrComparison || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {analysis.findings.mainTakeaways?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Main Takeaways
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 dark:text-slate-300 marker:text-gold-500">
                  {analysis.findings.mainTakeaways.map((takeaway, idx) => (
                    <li key={idx}>{takeaway}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SectionCard>

        {/* 5. Limitations */}
        <SectionCard title="5. Limitations & Future Work" icon={ShieldAlert} badge="Constraints & Horizons">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Methodological Limitations
              </h4>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 dark:text-slate-300 marker:text-rose-500">
                {analysis.limitations.methodologicalLimitations.map((lim, idx) => (
                  <li key={idx}>{lim}</li>
                ))}
              </ul>
            </div>

            {analysis.limitations.threatsToValidity?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Threats to Validity
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 dark:text-slate-300 marker:text-amber-500">
                  {analysis.limitations.threatsToValidity.map((threat, idx) => (
                    <li key={idx}>{threat}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.limitations.futureResearchDirections?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold text-navy-900 dark:text-gold-400 uppercase tracking-wider mb-2">
                  Recommended Future Directions
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-700 dark:text-slate-300 marker:text-gold-500">
                  {analysis.limitations.futureResearchDirections.map((dir, idx) => (
                    <li key={idx}>{dir}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Footer Reset & Export */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-navy-900 dark:hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Research Paper</span>
        </button>

        <ExportActions result={result} />
      </div>
    </div>
  );
};
