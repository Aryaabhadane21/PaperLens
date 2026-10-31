import { ANALYSIS_PROMPT_V3 } from './analysis-v3.js';
import { ANALYSIS_PROMPT_V1 } from './analysis-v1.js';
import { ANALYSIS_PROMPT_V2 } from './analysis-v2.js';

export const STRUCTURED_PROMPT = ANALYSIS_PROMPT_V3;

export function buildAnalysisPrompt(paperText: string, version: 'v1' | 'v2' | 'v3' = 'v3'): string {
  let basePrompt: string;
  switch (version) {
    case 'v1':
      basePrompt = ANALYSIS_PROMPT_V1;
      break;
    case 'v2':
      basePrompt = ANALYSIS_PROMPT_V2;
      break;
    case 'v3':
    default:
      basePrompt = ANALYSIS_PROMPT_V3;
      break;
  }

  // Truncate if exceptionally large to fit Gemini input constraints comfortably (e.g. 60,000 characters ~ 15k tokens)
  const maxChars = 75000;
  const processedText = paperText.length > maxChars
    ? paperText.slice(0, maxChars) + '\n\n[Note: Paper text truncated for length limit]'
    : paperText;

  return `${basePrompt}\n${processedText}`;
}

export function buildJsonRepairPrompt(rawResponse: string, validationError: string): string {
  return `
You previously returned an analysis that was either invalid JSON or failed schema validation.
Error details: ${validationError}

Your previous output:
${rawResponse.slice(0, 3000)}

Please FIX the JSON so it strictly adheres to the requested format and valid JSON syntax.
Output ONLY the valid JSON object without any backticks, markdown, or commentary.
`;
}
