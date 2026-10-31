import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parsePdf, parseDocx, parseTxt, parseUrl, ParserError } from '../src/services/parser.js';
import { validateUrlAgainstSSRF } from '../src/services/ssrfGuard.js';
import { getLLMService } from '../src/services/llm/llmService.js';
import { verifyAnalysisClaims } from '../src/services/verifier.js';
import { AnalysisDataSchema } from '../src/schemas/analysisSchema.js';
import { generateMarkdown, generatePdfBuffer, generateWordBuffer } from '../src/services/exporter.js';
import { PaperAnalysisResult } from '../src/types.js';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, 'fixtures');

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  durationMs: number;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(name: string, category: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ name, category, passed: true, durationMs });
    console.log(`  ✓ PASS [${category}]: ${name} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    results.push({ name, category, passed: false, durationMs, error: err.message || String(err) });
    console.error(`  ✗ FAIL [${category}]: ${name} (${durationMs}ms)`);
    console.error(`    Error: ${err.message || err}`);
  }
}

async function main() {
  console.log('\n======================================================');
  console.log('       PaperLens Automated Verification Suite         ');
  console.log('======================================================\n');

  const llmService = getLLMService();
  console.log(`Active LLM Service: ${llmService.name}\n`);

  // ---------------------------------------------------------
  // TEST 1: PDF Analysis (Standard Valid Research Paper)
  // ---------------------------------------------------------
  await runTest('Parse & Analyze Standard Research PDF', 'Case 1: PDF Ingest', async () => {
    const pdfBuffer = fs.readFileSync(path.join(fixturesDir, 'sample-paper.pdf'));
    const parsed = await parsePdf(pdfBuffer, 'sample-paper.pdf');

    if (!parsed.text || parsed.text.length < 100) {
      throw new Error(`Extracted text is too short: ${parsed.text?.length} chars`);
    }
    if (parsed.wordCount < 50) {
      throw new Error(`Word count unexpected: ${parsed.wordCount}`);
    }

    const analysis = await llmService.analyzePaper(parsed.text, parsed.title);
    const validated = AnalysisDataSchema.parse(analysis);

    if (!validated.problem.statement) throw new Error('Missing problem statement');
    if (!validated.objectives.primaryObjective) throw new Error('Missing primary objective');
    if (!validated.methodology.researchDesign) throw new Error('Missing methodology research design');
    if (!validated.findings.keyResults.length) throw new Error('No key findings extracted');
    if (!validated.limitations.methodologicalLimitations.length) throw new Error('No limitations extracted');

    const verification = await verifyAnalysisClaims(validated, parsed.text);
    if (verification.claims.length === 0) throw new Error('Verification produced no claims');
    if (verification.overallConfidenceScore <= 0) throw new Error('Invalid confidence score');
  });

  // ---------------------------------------------------------
  // TEST 2: TXT Analysis (Plain Text Paper)
  // ---------------------------------------------------------
  await runTest('Parse & Analyze Plain Text Paper (.txt)', 'Case 2: TXT Ingest', async () => {
    const txtBuffer = fs.readFileSync(path.join(fixturesDir, 'sample-paper.txt'));
    const parsed = parseTxt(txtBuffer, 'sample-paper.txt');

    if (!parsed.text.includes('Self-Grounded Transformer')) {
      throw new Error('Parsed TXT content missing expected paper phrases');
    }

    const analysis = await llmService.analyzePaper(parsed.text, parsed.title);
    const validated = AnalysisDataSchema.parse(analysis);
    if (!validated.executiveSummary) throw new Error('Missing executive summary');
  });

  // ---------------------------------------------------------
  // TEST 3: DOCX Analysis (Word Document)
  // ---------------------------------------------------------
  await runTest('Parse & Analyze Word Document (.docx)', 'Case 3: DOCX Ingest', async () => {
    const docxBuffer = fs.readFileSync(path.join(fixturesDir, 'sample-paper.docx'));
    const parsed = await parseDocx(docxBuffer, 'sample-paper.docx');

    if (!parsed.text || parsed.wordCount < 50) {
      throw new Error(`DOCX parser failed to extract body text: ${parsed.wordCount} words`);
    }

    const analysis = await llmService.analyzePaper(parsed.text, parsed.title);
    const validated = AnalysisDataSchema.parse(analysis);
    if (!validated.title) throw new Error('Missing title in DOCX analysis');
  });

  // ---------------------------------------------------------
  // TEST 4: URL Analysis & SSRF Guard
  // ---------------------------------------------------------
  await runTest('SSRF Guard: Block Private IP & Metadata Access', 'Case 4: Security & URL', async () => {
    // 1. Loopback
    const loopback = await validateUrlAgainstSSRF('http://127.0.0.1:8080/secret');
    if (loopback.isValid) throw new Error('SSRF guard failed to block 127.0.0.1');

    // 2. AWS/Cloud metadata IP
    const metadata = await validateUrlAgainstSSRF('http://169.254.169.254/latest/meta-data/');
    if (metadata.isValid) throw new Error('SSRF guard failed to block metadata IP 169.254.169.254');

    // 3. Localhost hostname
    const localhost = await validateUrlAgainstSSRF('http://localhost:3000/internal');
    if (localhost.isValid) throw new Error('SSRF guard failed to block localhost');

    // 4. Non-http scheme (file:/// or gopher://)
    const fileScheme = await validateUrlAgainstSSRF('file:///etc/passwd');
    if (fileScheme.isValid) throw new Error('SSRF guard failed to block file:// scheme');
  });

  // ---------------------------------------------------------
  // TEST 5 (EDGE CASE): Scanned / Empty PDF Detection
  // ---------------------------------------------------------
  await runTest('Edge Case: Scanned/Empty PDF Without Text Layer', 'Case 5: Edge Case', async () => {
    const emptyPdfBuffer = fs.readFileSync(path.join(fixturesDir, 'empty-scanned.pdf'));
    let errorCaught: ParserError | null = null;

    try {
      await parsePdf(emptyPdfBuffer, 'empty-scanned.pdf');
    } catch (err: any) {
      errorCaught = err;
    }

    if (!errorCaught) {
      throw new Error('Expected ParserError for scanned/empty PDF, but parser succeeded silently!');
    }

    if (errorCaught.code !== 'SCANNED_OR_EMPTY_PDF') {
      throw new Error(`Expected error code 'SCANNED_OR_EMPTY_PDF', but got '${errorCaught.code}'`);
    }

    if (!errorCaught.message.includes('image-only or scanned PDF')) {
      throw new Error(`Error message does not provide helpful user guidance: ${errorCaught.message}`);
    }
  });

  // ---------------------------------------------------------
  // TEST 6: Schema Validation & Strict Pillar Verification
  // ---------------------------------------------------------
  await runTest('Zod Schema Validation for All 5 Core Pillars', 'Case 6: Schema Enforcement', async () => {
    const txtBuffer = fs.readFileSync(path.join(fixturesDir, 'sample-paper.txt'));
    const parsed = parseTxt(txtBuffer, 'sample-paper.txt');
    const analysis = await llmService.analyzePaper(parsed.text, parsed.title);

    // Verify all 5 core pillars exist and conform
    const validated = AnalysisDataSchema.parse(analysis);
    if (typeof validated.problem.statement !== 'string') throw new Error('Problem pillar invalid');
    if (typeof validated.objectives.primaryObjective !== 'string') throw new Error('Objectives pillar invalid');
    if (typeof validated.methodology.researchDesign !== 'string') throw new Error('Methodology pillar invalid');
    if (!Array.isArray(validated.findings.keyResults)) throw new Error('Findings pillar invalid');
    if (!Array.isArray(validated.limitations.methodologicalLimitations)) throw new Error('Limitations pillar invalid');
  });

  // ---------------------------------------------------------
  // TEST 7: Multi-Format Exporters (Markdown, PDF, Word)
  // ---------------------------------------------------------
  await runTest('Generate Academic Markdown, PDF, and DOCX Exports', 'Case 7: Exports', async () => {
    const txtBuffer = fs.readFileSync(path.join(fixturesDir, 'sample-paper.txt'));
    const parsed = parseTxt(txtBuffer, 'sample-paper.txt');
    const analysis = await llmService.analyzePaper(parsed.text, parsed.title);
    const verification = await verifyAnalysisClaims(analysis, parsed.text);

    const mockResult: PaperAnalysisResult = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      metadata: {
        title: analysis.title,
        sourceType: 'txt',
        wordCount: parsed.wordCount,
      },
      analysis,
      verification,
    };

    // 1. Markdown
    const markdown = generateMarkdown(mockResult);
    if (!markdown.includes('# ' + analysis.title) || !markdown.includes('## Executive Summary')) {
      throw new Error('Markdown export missing header sections');
    }

    // 2. PDF Buffer
    const pdfBuf = await generatePdfBuffer(mockResult);
    if (!pdfBuf || pdfBuf.length < 500) {
      throw new Error(`PDF generation produced suspiciously small buffer: ${pdfBuf.length} bytes`);
    }

    // 3. Word Document Buffer
    const docxBuf = await generateWordBuffer(mockResult);
    if (!docxBuf || docxBuf.length < 500) {
      throw new Error(`Word generation produced suspiciously small buffer: ${docxBuf.length} bytes`);
    }
  });

  console.log('\n======================================================');
  console.log('                   TEST SUMMARY                       ');
  console.log('======================================================');
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
