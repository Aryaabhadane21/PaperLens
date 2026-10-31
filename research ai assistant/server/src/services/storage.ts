import { PaperAnalysisResult } from '../types.js';

class AnalysisStore {
  private store: Map<string, PaperAnalysisResult> = new Map();

  public save(result: PaperAnalysisResult): void {
    this.store.set(result.id, result);
  }

  public get(id: string): PaperAnalysisResult | undefined {
    return this.store.get(id);
  }

  public has(id: string): boolean {
    return this.store.has(id);
  }

  public list(limit = 20): PaperAnalysisResult[] {
    return Array.from(this.store.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export const analysisStorage = new AnalysisStore();
