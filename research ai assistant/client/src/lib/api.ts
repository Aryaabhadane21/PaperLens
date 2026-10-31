import { PaperAnalysisResult, SSEPipelineEvent } from '../types';

export async function analyzePaperSse(
  payload: { file?: File | null; url?: string | null },
  onProgress: (event: SSEPipelineEvent) => void,
  signal?: AbortSignal
): Promise<PaperAnalysisResult> {
  const formData = new FormData();
  if (payload.file) {
    formData.append('file', payload.file);
  }
  if (payload.url) {
    formData.append('url', payload.url);
  }

  const response = await fetch('/api/analyze/sse', {
    method: 'POST',
    body: formData,
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server returned error ${response.status}: ${errorText}`);
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported by browser or empty body returned.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalResult: PaperAnalysisResult | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';

    for (const chunk of lines) {
      const trimmed = chunk.trim();
      if (trimmed.startsWith('data:')) {
        const jsonStr = trimmed.replace(/^data:\s*/, '');
        try {
          const event: SSEPipelineEvent = JSON.parse(jsonStr);
          onProgress(event);

          if (event.error) {
            throw new Error(event.error);
          }

          if (event.result) {
            finalResult = event.result;
          }
        } catch (err: any) {
          if (err.message && !err.message.includes('JSON')) {
            throw err;
          }
        }
      }
    }
  }

  if (!finalResult) {
    throw new Error('Analysis pipeline ended without returning a structured result.');
  }

  return finalResult;
}

export function getExportUrl(id: string, format: 'markdown' | 'pdf' | 'word'): string {
  return `/api/export/${id}/${format}`;
}

export async function checkServerHealth(): Promise<{ llmMode: string; version: string }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      return await res.json();
    }
    return { llmMode: 'mock', version: '1.0.0' };
  } catch {
    return { llmMode: 'mock', version: '1.0.0' };
  }
}
