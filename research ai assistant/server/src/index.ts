import { createApp } from './app.js';
import { config } from './config.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`===============================================`);
  console.log(`  PaperLens Analysis Engine`);
  console.log(`  Listening on port http://localhost:${config.port}`);
  console.log(`  Mode: ${config.nodeEnv}`);
  console.log(`  LLM Provider: ${config.llmMock || !config.geminiApiKey ? 'MOCK (Keyless)' : `Gemini (${config.geminiModel})`}`);
  console.log(`===============================================`);
});
