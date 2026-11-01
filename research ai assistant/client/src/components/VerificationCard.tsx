import React, { useState } from 'react';
import { VerificationSummary, VerifiedClaim } from '../types';
import { ShieldCheck, CheckCircle2, AlertCircle, Quote, ChevronDown, ChevronUp } from 'lucide-react';

interface VerificationCardProps {
  verification: VerificationSummary;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ verification }) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'partially_verified'>('all');
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);

  const filteredClaims = verification.claims.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="bg-[#090d1f]/90 backdrop-blur-xl border border-indigo-900/40 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-6 mb-8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-indigo-950/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/80 text-indigo-300 flex items-center justify-center shadow-md border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-bold text-lg text-white">
                Factual Grounding & Claim Audit
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {verification.overallConfidenceScore}% Confidence
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-pass audit cross-referencing extracted assertions against original paper sentences.
            </p>
          </div>
        </div>

        {/* Counter chips */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-[#060814] text-slate-400 border border-indigo-950 hover:text-white'
            }`}
          >
            All ({verification.totalClaimsChecked})
          </button>
          <button
            type="button"
            onClick={() => setFilter('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'verified'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-[#060814] text-emerald-400 border border-indigo-950 hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified ({verification.verifiedCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('partially_verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'partially_verified'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[#060814] text-amber-400 border border-indigo-950 hover:bg-amber-950/40'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Partial ({verification.partiallyVerifiedCount})</span>
          </button>
        </div>
      </div>

      {/* Auditor Note */}
      <div className="my-4 p-3.5 rounded-xl bg-[#060814]/70 border border-indigo-950 text-xs text-slate-300 flex items-start gap-2.5">
        <span className="font-semibold text-indigo-400 uppercase tracking-wider shrink-0 mt-0.5">
          Audit Note:
        </span>
        <span>{verification.verificationNotes}</span>
      </div>

      {/* Claims List */}
      <div className="space-y-3 mt-4">
        {filteredClaims.map((claim: VerifiedClaim) => {
          const isExpanded = expandedClaimId === claim.id;
          const isVerified = claim.status === 'verified';

          return (
            <div
              key={claim.id}
              className={`p-4 rounded-xl border transition-all ${
                isVerified
                  ? 'bg-[#060814]/80 border-indigo-950 hover:border-indigo-500/40'
                  : 'bg-amber-950/20 border-amber-900/40'
              }`}
            >
              <div
                className="flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 p-1 rounded-md ${
                      isVerified
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-800/40'
                    }`}
                  >
                    {isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900/60">
                        {claim.section}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {claim.confidenceScore}% Concordance
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {claim.claim}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-slate-400 hover:text-white p-1"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Collapsible Source Quote & Audit Explanation */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-indigo-950 pl-8 space-y-2 text-xs">
                  {claim.sourceQuote && (
                    <div className="p-3 rounded-lg bg-[#0a0e24] border border-indigo-900/50 text-slate-200 italic flex items-start gap-2">
                      <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>"{claim.sourceQuote}"</span>
                    </div>
                  )}
                  <p className="text-slate-400">
                    <span className="font-semibold text-slate-200">Grounding Rationale: </span>
                    {claim.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
