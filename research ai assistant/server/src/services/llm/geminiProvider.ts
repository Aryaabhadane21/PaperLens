import { GoogleGenerativeAI } from '@google/generative-ai';
import { ILLMService } from './types.js';
import { AnalysisData } from '../../types.js';
import { config } from '../../config.js';
import {
  AnalysisDataSchema,
  VerificationOutputSchema,
  VerificationOutputDto,
} from '../../schemas/analysisSchema.js';
import { buildAnalysisPrompt, buildJsonRepairPrompt } from '../../prompts/structured-prompt.js';
import { buildVerifyPrompt } from '../../prompts/verify-prompt.js';

export class GeminiProvider implements ILLMService {
  public name = 'Google Gemini';
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor() {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not defined. Switch to LLM_MOCK=true or provide an API key.');
    }
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.modelName = config.geminiModel || 'gemini-2.5-flash';
  }

  public async analyzePaper(text: string, titleHint?: string): Promise<AnalysisData> {
    const prompt = buildAnalysisPrompt(text, 'v3') + (titleHint ? `\n\nTitle hint: ${titleHint}` : '');
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse and validate with one retry on bad JSON
    return this.parseAndValidateAnalysis(responseText, model);
  }

  public async verifyClaims(claims: unknown, sourceText: string): Promise<VerificationOutputDto> {
    const prompt = buildVerifyPrompt(claims, sourceText);
    const model = this.genAI.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return this.parseAndValidateVerification(responseText, model);
  }

  private cleanJsonString(raw: string): string {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  private async parseAndValidateAnalysis(rawResponse: string, model: any): Promise<AnalysisData> {
    const cleaned = this.cleanJsonString(rawResponse);
    try {
      const parsedJson = JSON.parse(cleaned);
      const validation = AnalysisDataSchema.safeParse(parsedJson);

      if (validation.success) {
        return validation.data;
      }

      // First attempt failed validation: attempt 1 retry
      const issueMessage = validation.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      console.warn(`[GeminiProvider] Schema validation failed: ${issueMessage}. Attempting 1 retry...`);

      const repairPrompt = buildJsonRepairPrompt(rawResponse, issueMessage);
      const repairResult = await model.generateContent(repairPrompt);
      const repairedRaw = this.cleanJsonString(repairResult.response.text());
      const repairedJson = JSON.parse(repairedRaw);

      return AnalysisDataSchema.parse(repairedJson);
    } catch (parseError: any) {
      console.warn(`[GeminiProvider] JSON parse error: ${parseError.message}. Attempting 1 retry...`);
      // Retry once for malformed JSON
      try {
        const repairPrompt = buildJsonRepairPrompt(rawResponse, parseError.message);
        const repairResult = await model.generateContent(repairPrompt);
        const repairedRaw = this.cleanJsonString(repairResult.response.text());
        const repairedJson = JSON.parse(repairedRaw);
        return AnalysisDataSchema.parse(repairedJson);
      } catch (retryError: any) {
        throw new Error(`LLM output failed JSON formatting after retry: ${retryError.message}`);
      }
    }
  }

  private async parseAndValidateVerification(rawResponse: string, model: any): Promise<VerificationOutputDto> {
    const cleaned = this.cleanJsonString(rawResponse);
    try {
      const parsed = JSON.parse(cleaned);
      const validation = VerificationOutputSchema.safeParse(parsed);
      if (validation.success) {
        return validation.data;
      }

      // Retry once on schema validation error
      const repairPrompt = buildJsonRepairPrompt(rawResponse, validation.error.message);
      const repairResult = await model.generateContent(repairPrompt);
      const repairedRaw = this.cleanJsonString(repairResult.response.text());
      const repairedJson = JSON.parse(repairedRaw);
      return VerificationOutputSchema.parse(repairedJson);
    } catch (err: any) {
      console.warn(`[GeminiProvider] Verification parsing failed: ${err.message}. Retrying...`);
      const repairPrompt = buildJsonRepairPrompt(rawResponse, err.message);
      const repairResult = await model.generateContent(repairPrompt);
      const repairedRaw = this.cleanJsonString(repairResult.response.text());
      const repairedJson = JSON.parse(repairedRaw);
      return VerificationOutputSchema.parse(repairedJson);
    }
  }
}
