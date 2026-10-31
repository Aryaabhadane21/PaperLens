import { ILLMService } from './types.js';
import { GeminiProvider } from './geminiProvider.js';
import { MockProvider } from './mockProvider.js';
import { config } from '../../config.js';

let serviceInstance: ILLMService | null = null;

export function getLLMService(): ILLMService {
  if (serviceInstance) {
    return serviceInstance;
  }

  if (config.llmMock || !config.geminiApiKey) {
    console.log('[LLMService] Initializing MockProvider (keyless mode active)');
    serviceInstance = new MockProvider();
  } else {
    try {
      console.log(`[LLMService] Initializing GeminiProvider with model ${config.geminiModel}`);
      serviceInstance = new GeminiProvider();
    } catch (err) {
      console.warn('[LLMService] Failed to initialize GeminiProvider, falling back to MockProvider:', err);
      serviceInstance = new MockProvider();
    }
  }

  return serviceInstance;
}

export function setLLMService(customService: ILLMService): void {
  serviceInstance = customService;
}
