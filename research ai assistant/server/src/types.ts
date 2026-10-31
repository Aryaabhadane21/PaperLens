export interface PaperMetadata {
  title: string;
  authors?: string[];
  year?: string;
  sourceType: 'pdf' | 'docx' | 'doc' | 'txt' | 'url';
  originalFileName?: string;
  sourceUrl?: string;
  wordCount: number;
  pageCount?: number;
  language?: string;
}

export interface ProblemSection {
  statement: string;
  contextAndSignificance: string;
  literatureGap: string;
  keyChallenges: string[];
}

export interface ObjectivesSection {
  primaryObjective: string;
  secondaryObjectives: string[];
  hypotheses: string[];
}

export interface MethodologySection {
  researchDesign: string;
  datasetOrParticipants: string;
  toolsAndFrameworks: string[];
  experimentalProcedure: string;
  evaluationMetrics: string[];
}

export interface FindingsSection {
  keyResults: string[];
  quantitativeMetrics: Array<{
    metricName: string;
    value: string;
    baselineOrComparison?: string;
  }>;
  mainTakeaways: string[];
  unexpectedObservations?: string[];
}

export interface LimitationsSection {
  methodologicalLimitations: string[];
  threatsToValidity: string[];
  unaddressedAvenues: string[];
  futureResearchDirections: string[];
}

export interface VerifiedClaim {
  id: string;
  claim: string;
  section: 'problem' | 'objectives' | 'methodology' | 'findings' | 'limitations';
  status: 'verified' | 'partially_verified' | 'unverified';
  confidenceScore: number; // 0 to 100
  sourceQuote?: string;
  sourceLocationHint?: string;
  explanation: string;
}

export interface VerificationSummary {
  totalClaimsChecked: number;
  verifiedCount: number;
  partiallyVerifiedCount: number;
  unverifiedCount: number;
  overallConfidenceScore: number;
  verificationNotes: string;
  claims: VerifiedClaim[];
}

export interface AnalysisData {
  title: string;
  executiveSummary: string;
  problem: ProblemSection;
  objectives: ObjectivesSection;
  methodology: MethodologySection;
  findings: FindingsSection;
  limitations: LimitationsSection;
}

export interface PaperAnalysisResult {
  id: string;
  createdAt: string;
  metadata: PaperMetadata;
  analysis: AnalysisData;
  verification: VerificationSummary;
  rawTextPreview?: string;
}

export type PipelineStage = 'ingest' | 'extract' | 'verify' | 'save';

export interface SSEPipelineEvent {
  stage: PipelineStage;
  percent: number;
  message: string;
  error?: string;
  result?: PaperAnalysisResult;
}
