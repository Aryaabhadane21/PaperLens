import { AnalysisData } from '../../types.js';
import { VerificationOutputDto } from '../../schemas/analysisSchema.js';

export interface ILLMService {
  name: string;
  analyzePaper(text: string, titleHint?: string): Promise<AnalysisData>;
  verifyClaims(claims: unknown, sourceText: string): Promise<VerificationOutputDto>;
}
