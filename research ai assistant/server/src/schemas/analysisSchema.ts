import { z } from 'zod';

export const ProblemSectionSchema = z.object({
  statement: z.string().min(1, 'Problem statement is required'),
  contextAndSignificance: z.string().default(''),
  literatureGap: z.string().default(''),
  keyChallenges: z.array(z.string()).default([]),
});

export const ObjectivesSectionSchema = z.object({
  primaryObjective: z.string().min(1, 'Primary objective is required'),
  secondaryObjectives: z.array(z.string()).default([]),
  hypotheses: z.array(z.string()).default([]),
});

export const MethodologySectionSchema = z.object({
  researchDesign: z.string().min(1, 'Research design is required'),
  datasetOrParticipants: z.string().default(''),
  toolsAndFrameworks: z.array(z.string()).default([]),
  experimentalProcedure: z.string().default(''),
  evaluationMetrics: z.array(z.string()).default([]),
});

export const QuantitativeMetricSchema = z.object({
  metricName: z.string(),
  value: z.string(),
  baselineOrComparison: z.string().optional(),
});

export const FindingsSectionSchema = z.object({
  keyResults: z.array(z.string()).min(1, 'At least one key result is required'),
  quantitativeMetrics: z.array(QuantitativeMetricSchema).default([]),
  mainTakeaways: z.array(z.string()).default([]),
  unexpectedObservations: z.array(z.string()).optional(),
});

export const LimitationsSectionSchema = z.object({
  methodologicalLimitations: z.array(z.string()).min(1, 'At least one limitation is required'),
  threatsToValidity: z.array(z.string()).default([]),
  unaddressedAvenues: z.array(z.string()).default([]),
  futureResearchDirections: z.array(z.string()).default([]),
});

export const AnalysisDataSchema = z.object({
  title: z.string().min(1, 'Paper title is required'),
  executiveSummary: z.string().min(1, 'Executive summary is required'),
  problem: ProblemSectionSchema,
  objectives: ObjectivesSectionSchema,
  methodology: MethodologySectionSchema,
  findings: FindingsSectionSchema,
  limitations: LimitationsSectionSchema,
});

export const VerifiedClaimItemSchema = z.object({
  claim: z.string(),
  section: z.enum(['problem', 'objectives', 'methodology', 'findings', 'limitations']),
  status: z.enum(['verified', 'partially_verified', 'unverified']),
  confidenceScore: z.number().min(0).max(100),
  sourceQuote: z.string().optional(),
  sourceLocationHint: z.string().optional(),
  explanation: z.string(),
});

export const VerificationOutputSchema = z.object({
  overallConfidenceScore: z.number().min(0).max(100),
  verificationNotes: z.string(),
  claims: z.array(VerifiedClaimItemSchema),
});

export type AnalysisDataDto = z.infer<typeof AnalysisDataSchema>;
export type VerificationOutputDto = z.infer<typeof VerificationOutputSchema>;
