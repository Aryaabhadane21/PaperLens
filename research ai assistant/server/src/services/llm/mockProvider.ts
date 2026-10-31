import { ILLMService } from './types.js';
import { AnalysisData } from '../../types.js';
import { VerificationOutputDto } from '../../schemas/analysisSchema.js';

export class MockProvider implements ILLMService {
  public name = 'PaperLens Intelligent Mock';

  public async analyzePaper(text: string, titleHint?: string): Promise<AnalysisData> {
    // Simulate brief network latency for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 600));

    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 25);

    const firstSentence = sentences[0] || 'This paper investigates automated systems in scientific computation.';
    const secondSentence = sentences[1] || 'Empirical evidence demonstrates substantial accuracy improvements.';

    // Look for numbers or percentages in text
    const numbers = text.match(/\b\d+(?:\.\d+)?%?\b/g) || ['89.4%', '4.2x', '99.1%'];
    const metric1 = numbers[0] || '88.5%';
    const metric2 = numbers[1] || '12.4%';

    const inferredTitle = titleHint || this.extractTitle(text);

    return {
      title: inferredTitle,
      executiveSummary: `${firstSentence} By conducting thorough empirical evaluations, the authors introduce a robust framework addressing previous architectural bottlenecks. The results indicate significant gains (${metric1}) over standard baselines with reproducible methodology.`,
      problem: {
        statement: `Contemporary approaches struggle to balance high accuracy with computational efficiency when processing complex heterogeneous data. ${firstSentence}`,
        contextAndSignificance: 'Scientific workflows increasingly rely on scalable, verifiable pipelines. Existing architectures incur prohibitive overheads or suffer from hallucinations in high-stakes domains.',
        literatureGap: 'Prior studies largely focused on isolated benchmark scenarios without validating continuous verification against grounded source text.',
        keyChallenges: [
          'High computational latency in real-time verification passes',
          'Mitigating hallucination risks in unstructured document extraction',
          'Ensuring robust cross-domain generalizability across varied formatting conventions',
        ],
      },
      objectives: {
        primaryObjective: `Develop and evaluate an end-to-end framework that guarantees verifiable structured synthesis from arbitrary scientific publications.`,
        secondaryObjectives: [
          'Formulate an algorithmic grounding pass that cross-references assertions against source citations',
          'Optimize pipeline latency through asynchronous stream processing',
          'Quantify empirical fidelity improvements across standard academic corpora',
        ],
        hypotheses: [
          'Enforcing dual-pass semantic verification significantly suppresses ungrounded claims compared to single-pass extraction.',
          'Structured schema constraints improve parse consistency without degrading qualitative synthesis depth.',
        ],
      },
      methodology: {
        researchDesign: 'Mixed-method quantitative evaluation with controlled ablation studies comparing zero-shot, few-shot, and chain-of-thought grounding architectures.',
        datasetOrParticipants: 'Curated corpus of peer-reviewed publications spanning Computer Science, Artificial Intelligence, and Computational Biology (N=1,250 articles).',
        toolsAndFrameworks: ['TypeScript', 'Express', 'React', 'Gemini API', 'Mozilla Readability', 'Zod Schema Engine'],
        experimentalProcedure: 'Documents were normalized, passed through multi-stage ingest parsers, analyzed under strict temperature controls (T=0.1), and verified via dual-pass corroboration against raw document spans.',
        evaluationMetrics: ['Precision@K', 'Claim Verification Grounding Score (VGS)', 'F1 Consistency Score', 'Latency per Kilobyte'],
      },
      findings: {
        keyResults: [
          `Achieved ${metric1} factual grounding rate across all benchmark documents.`,
          `Observed a ${metric2} reduction in hallucinated assertions compared to unconstrained zero-shot baselines.`,
          `${secondSentence}`,
        ],
        quantitativeMetrics: [
          {
            metricName: 'Factual Grounding Accuracy',
            value: metric1.includes('%') ? metric1 : `${metric1}%`,
            baselineOrComparison: 'vs. 74.2% for standard zero-shot models',
          },
          {
            metricName: 'Latency Reduction',
            value: metric2.includes('%') ? metric2 : `${metric2}%`,
            baselineOrComparison: 'vs. sequential synchronous baseline',
          },
          {
            metricName: 'Verification Confidence (Average)',
            value: '94.8%',
            baselineOrComparison: 'Human expert consensus rating',
          },
        ],
        mainTakeaways: [
          'Explicit schema-driven extraction combined with post-generation corroboration produces dependable academic summaries.',
          'Negative prompting constraints reliably suppress extraneous speculative claims.',
        ],
        unexpectedObservations: [
          'Document layout artifacts in scanned documents require dedicated OCR pre-validation rather than purely text-based parsers.',
        ],
      },
      limitations: {
        methodologicalLimitations: [
          'Heavy dependence on machine-readable text layers; scanned image-only documents require upstream OCR.',
          'Maximum context token boundaries necessitate chunking or truncation on extremely lengthy monographs (>100 pages).',
        ],
        threatsToValidity: [
          'Potential dataset selection bias toward English-language computer science literature.',
        ],
        unaddressedAvenues: [
          'Automated figure, table, and mathematical formula parsing remains out of current textual scope.',
        ],
        futureResearchDirections: [
          'Integration of multi-modal vision-language models for direct diagram and tabular analysis.',
          'Active learning loops incorporating human-in-the-loop expert corrections into verification prompts.',
        ],
      },
    };
  }

  public async verifyClaims(claims: any, sourceText: string): Promise<VerificationOutputDto> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const claimList: Array<{ claim: string; section: any }> = [];

    if (claims && typeof claims === 'object') {
      if (claims.problem?.statement) {
        claimList.push({ claim: claims.problem.statement, section: 'problem' });
      }
      if (claims.objectives?.primaryObjective) {
        claimList.push({ claim: claims.objectives.primaryObjective, section: 'objectives' });
      }
      if (claims.methodology?.researchDesign) {
        claimList.push({ claim: claims.methodology.researchDesign, section: 'methodology' });
      }
      if (Array.isArray(claims.findings?.keyResults)) {
        for (const res of claims.findings.keyResults.slice(0, 3)) {
          claimList.push({ claim: res, section: 'findings' });
        }
      }
      if (Array.isArray(claims.limitations?.methodologicalLimitations)) {
        for (const lim of claims.limitations.methodologicalLimitations.slice(0, 2)) {
          claimList.push({ claim: lim, section: 'limitations' });
        }
      }
    }

    // Corroborate claims against source text
    const textLower = sourceText.toLowerCase();
    const verifiedClaims = claimList.map((item, idx) => {
      // Find keywords from claim
      const words = item.claim
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 4);

      const matchedWords = words.filter((w) => textLower.includes(w));
      const matchRatio = words.length > 0 ? matchedWords.length / words.length : 0.8;

      let status: 'verified' | 'partially_verified' | 'unverified' = 'verified';
      let confidenceScore = 95;
      let quote = '';

      if (matchRatio >= 0.5) {
        status = 'verified';
        confidenceScore = Math.min(99, Math.round(85 + matchRatio * 14));
        // Find a matching snippet in source text
        const foundWord = matchedWords[0];
        if (foundWord) {
          const index = textLower.indexOf(foundWord);
          const start = Math.max(0, index - 40);
          const end = Math.min(sourceText.length, index + 120);
          quote = '...' + sourceText.slice(start, end).replace(/\s+/g, ' ').trim() + '...';
        }
      } else if (matchRatio >= 0.25) {
        status = 'partially_verified';
        confidenceScore = Math.round(70 + matchRatio * 15);
        quote = 'Partial conceptual overlap identified in source text context.';
      } else {
        status = 'partially_verified';
        confidenceScore = 75;
        quote = 'Concept synthesized from contextual discussion.';
      }

      return {
        claim: item.claim,
        section: item.section,
        status,
        confidenceScore,
        sourceQuote: quote || 'Direct textual evidence substantiated in document body.',
        sourceLocationHint: `Section: ${item.section.toUpperCase()}`,
        explanation: `Substantiated against document body with ${confidenceScore}% semantic concordance.`,
      };
    });

    const avgConfidence = verifiedClaims.length > 0
      ? Math.round(verifiedClaims.reduce((acc, c) => acc + c.confidenceScore, 0) / verifiedClaims.length)
      : 94;

    return {
      overallConfidenceScore: avgConfidence,
      verificationNotes: `All ${verifiedClaims.length} core claims were evaluated against the source text. High factual concordance detected with rigorous empirical grounding.`,
      claims: verifiedClaims,
    };
  }

  private extractTitle(text: string): string {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 10 && !l.toLowerCase().startsWith('http'));
    if (lines.length > 0 && lines[0].length < 150) {
      return lines[0];
    }
    return 'Analysis of Scientific Literature';
  }
}
