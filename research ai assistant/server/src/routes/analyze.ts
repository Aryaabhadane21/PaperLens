import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parsePdf, parseDocx, parseDoc, parseTxt, parseUrl, ParsedDocument } from '../services/parser.js';
import { getLLMService } from '../services/llm/llmService.js';
import { verifyAnalysisClaims } from '../services/verifier.js';
import { analysisStorage } from '../services/storage.js';
import { PaperAnalysisResult, SSEPipelineEvent } from '../types.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

export const analyzeRouter = Router();

/**
 * Helper to push an SSE event
 */
function sendSse(res: Response, data: SSEPipelineEvent) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

/**
 * 4-Stage Live Analysis Pipeline over Server-Sent Events (SSE)
 */
analyzeRouter.post('/analyze/sse', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    const file = req.file;
    const url = req.body?.url;

    if (!file && !url) {
      sendSse(res, {
        stage: 'ingest',
        percent: 0,
        message: 'No document provided',
        error: 'Please upload a file (PDF, TXT, DOC, DOCX) or provide a valid research paper URL.',
      });
      res.end();
      return;
    }

    // STAGE 1: INGEST
    sendSse(res, {
      stage: 'ingest',
      percent: 25,
      message: file ? `Ingesting and parsing ${file.originalname}...` : `Fetching and extracting text from URL...`,
    });

    let doc: ParsedDocument;
    if (file) {
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') {
        doc = await parsePdf(file.buffer, file.originalname);
      } else if (ext === 'docx') {
        doc = await parseDocx(file.buffer, file.originalname);
      } else if (ext === 'doc') {
        doc = await parseDoc(file.buffer, file.originalname);
      } else if (ext === 'txt') {
        doc = parseTxt(file.buffer, file.originalname);
      } else {
        // Attempt parsing based on mimetype or fallback
        if (file.mimetype.includes('pdf')) {
          doc = await parsePdf(file.buffer, file.originalname);
        } else {
          doc = parseTxt(file.buffer, file.originalname);
        }
      }
    } else {
      doc = await parseUrl(url);
    }

    // STAGE 2: EXTRACT
    sendSse(res, {
      stage: 'extract',
      percent: 50,
      message: `Analyzing research structure (${doc.wordCount.toLocaleString()} words). Extracting core pillars...`,
    });

    const llmService = getLLMService();
    const analysisData = await llmService.analyzePaper(doc.text, doc.title);

    // STAGE 3: VERIFY
    sendSse(res, {
      stage: 'verify',
      percent: 75,
      message: 'Grounding key assertions against source text to prevent hallucinations...',
    });

    const verificationSummary = await verifyAnalysisClaims(analysisData, doc.text);

    // STAGE 4: SAVE
    sendSse(res, {
      stage: 'save',
      percent: 90,
      message: 'Storing verified analysis and formatting academic synthesis...',
    });

    const finalResult: PaperAnalysisResult = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      metadata: {
        title: analysisData.title || doc.title || 'Untitled Research Paper',
        sourceType: doc.sourceType,
        originalFileName: doc.originalFileName,
        sourceUrl: doc.sourceUrl,
        wordCount: doc.wordCount,
        pageCount: doc.pageCount,
      },
      analysis: analysisData,
      verification: verificationSummary,
      rawTextPreview: doc.text.slice(0, 1500),
    };

    analysisStorage.save(finalResult);

    // Final complete event
    sendSse(res, {
      stage: 'save',
      percent: 100,
      message: 'Analysis complete!',
      result: finalResult,
    });

    res.end();
  } catch (err: any) {
    console.error('[analyze/sse] Error processing paper:', err);
    sendSse(res, {
      stage: 'ingest',
      percent: 0,
      message: 'Processing failed',
      error: err.message || 'An unexpected error occurred during paper analysis.',
    });
    res.end();
  }
});

/**
 * Standard REST analysis endpoint
 */
analyzeRouter.post('/analyze', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const url = req.body?.url;

    if (!file && !url) {
      res.status(400).json({ error: 'Please upload a file or provide a URL.' });
      return;
    }

    let doc: ParsedDocument;
    if (file) {
      const ext = file.originalname.split('.').pop()?.toLowerCase();
      if (ext === 'pdf') doc = await parsePdf(file.buffer, file.originalname);
      else if (ext === 'docx') doc = await parseDocx(file.buffer, file.originalname);
      else if (ext === 'doc') doc = await parseDoc(file.buffer, file.originalname);
      else doc = parseTxt(file.buffer, file.originalname);
    } else {
      doc = await parseUrl(url);
    }

    const llmService = getLLMService();
    const analysisData = await llmService.analyzePaper(doc.text, doc.title);
    const verificationSummary = await verifyAnalysisClaims(analysisData, doc.text);

    const finalResult: PaperAnalysisResult = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      metadata: {
        title: analysisData.title || doc.title || 'Untitled Research Paper',
        sourceType: doc.sourceType,
        originalFileName: doc.originalFileName,
        sourceUrl: doc.sourceUrl,
        wordCount: doc.wordCount,
        pageCount: doc.pageCount,
      },
      analysis: analysisData,
      verification: verificationSummary,
      rawTextPreview: doc.text.slice(0, 1500),
    };

    analysisStorage.save(finalResult);
    res.json(finalResult);
  } catch (err: any) {
    console.error('[analyze] Error:', err);
    res.status(400).json({
      error: err.message || 'Failed to process document',
      code: err.code || 'PROCESSING_ERROR',
    });
  }
});

/**
 * Retrieve analysis by ID
 */
analyzeRouter.get('/analysis/:id', (req: Request, res: Response): void => {
  const result = analysisStorage.get(req.params.id);
  if (!result) {
    res.status(404).json({ error: 'Analysis record not found.' });
    return;
  }
  res.json(result);
});

/**
 * List recent analyses
 */
analyzeRouter.get('/analysis', (_req: Request, res: Response): void => {
  res.json(analysisStorage.list());
});
