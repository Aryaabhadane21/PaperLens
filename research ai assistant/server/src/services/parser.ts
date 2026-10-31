import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import WordExtractor from 'word-extractor';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { validateUrlAgainstSSRF } from './ssrfGuard.js';

export interface ParsedDocument {
  text: string;
  title?: string;
  pageCount?: number;
  wordCount: number;
  sourceType: 'pdf' | 'docx' | 'doc' | 'txt' | 'url';
  originalFileName?: string;
  sourceUrl?: string;
}

export class ParserError extends Error {
  public code: string;
  constructor(message: string, code: string = 'PARSE_ERROR') {
    super(message);
    this.name = 'ParserError';
    this.code = code;
  }
}

/**
 * Extracts raw text from a PDF buffer.
 * Detects scanned/empty PDFs where text length is minimal.
 */
export async function parsePdf(buffer: Buffer, originalFileName: string = 'document.pdf'): Promise<ParsedDocument> {
  let pdfData: { text: string; numpages: number };
  try {
    pdfData = await pdfParse(buffer);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new ParserError(`Failed to parse PDF document: ${msg}`, 'PDF_PARSE_FAILED');
  }

  const rawText = pdfData.text || '';
  const cleanedText = cleanText(rawText);
  const nonWhitespaceChars = cleanedText.replace(/\s+/g, '').length;

  // Edge case: Empty or scanned PDF (image-only)
  if (nonWhitespaceChars < 60) {
    throw new ParserError(
      'No extractable text found in PDF. This document appears to be an image-only or scanned PDF without OCR text layers. PaperLens requires machine-readable text.',
      'SCANNED_OR_EMPTY_PDF'
    );
  }

  const title = extractTitleFromText(cleanedText) || originalFileName.replace(/\.pdf$/i, '');
  const wordCount = countWords(cleanedText);

  return {
    text: cleanedText,
    title,
    pageCount: pdfData.numpages || 1,
    wordCount,
    sourceType: 'pdf',
    originalFileName,
  };
}

/**
 * Extracts text from DOCX buffer using mammoth.
 */
export async function parseDocx(buffer: Buffer, originalFileName: string = 'document.docx'): Promise<ParsedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value || '';
    const cleanedText = cleanText(rawText);

    if (cleanedText.replace(/\s+/g, '').length < 30) {
      throw new ParserError('The DOCX file contains insufficient text for analysis.', 'EMPTY_DOCUMENT');
    }

    const title = extractTitleFromText(cleanedText) || originalFileName.replace(/\.docx$/i, '');
    const wordCount = countWords(cleanedText);

    return {
      text: cleanedText,
      title,
      wordCount,
      sourceType: 'docx',
      originalFileName,
    };
  } catch (err: unknown) {
    if (err instanceof ParserError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new ParserError(`Failed to parse DOCX document: ${msg}`, 'DOCX_PARSE_FAILED');
  }
}

/**
 * Extracts text from legacy DOC buffer using word-extractor.
 */
export async function parseDoc(buffer: Buffer, originalFileName: string = 'document.doc'): Promise<ParsedDocument> {
  try {
    const extractor = new WordExtractor();
    const extracted = await extractor.extract(buffer);
    const rawText = extracted.getBody() || '';
    const cleanedText = cleanText(rawText);

    if (cleanedText.replace(/\s+/g, '').length < 30) {
      throw new ParserError('The legacy DOC file contains insufficient text for analysis.', 'EMPTY_DOCUMENT');
    }

    const title = extractTitleFromText(cleanedText) || originalFileName.replace(/\.doc$/i, '');
    const wordCount = countWords(cleanedText);

    return {
      text: cleanedText,
      title,
      wordCount,
      sourceType: 'doc',
      originalFileName,
    };
  } catch (err: unknown) {
    if (err instanceof ParserError) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    throw new ParserError(`Failed to parse DOC document: ${msg}`, 'DOC_PARSE_FAILED');
  }
}

/**
 * Parses plain text buffer.
 */
export function parseTxt(buffer: Buffer, originalFileName: string = 'document.txt'): ParsedDocument {
  const rawText = buffer.toString('utf-8');
  const cleanedText = cleanText(rawText);

  if (cleanedText.replace(/\s+/g, '').length < 30) {
    throw new ParserError('The text file contains insufficient text for analysis.', 'EMPTY_DOCUMENT');
  }

  const title = extractTitleFromText(cleanedText) || originalFileName.replace(/\.txt$/i, '');
  const wordCount = countWords(cleanedText);

  return {
    text: cleanedText,
    title,
    wordCount,
    sourceType: 'txt',
    originalFileName,
  };
}

/**
 * Parses a webpage or research paper URL using Mozilla Readability with SSRF protection.
 */
export async function parseUrl(targetUrl: string): Promise<ParsedDocument> {
  const ssrfCheck = await validateUrlAgainstSSRF(targetUrl);
  if (!ssrfCheck.isValid) {
    throw new ParserError(`Security Error: URL rejected by SSRF guard. ${ssrfCheck.reason}`, 'SSRF_BLOCKED');
  }

  let response: Response;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PaperLens-Research-Bot/1.0 (+https://paperlens.ai)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeout);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new ParserError(`Failed to fetch paper URL: ${msg}`, 'URL_FETCH_FAILED');
  }

  if (!response.ok) {
    throw new ParserError(`Failed to fetch URL: HTTP ${response.status} ${response.statusText}`, 'HTTP_ERROR');
  }

  const contentType = response.headers.get('content-type') || '';

  // If the URL directly returns a PDF
  if (contentType.includes('application/pdf')) {
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const parsed = await parsePdf(buffer, targetUrl.split('/').pop() || 'online-paper.pdf');
    return {
      ...parsed,
      sourceType: 'url',
      sourceUrl: targetUrl,
    };
  }

  const html = await response.text();
  const dom = new JSDOM(html, { url: targetUrl });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article || !article.textContent || article.textContent.trim().length < 50) {
    // Fallback: extract body text directly if readability didn't parse clean article
    const bodyText = dom.window.document.body?.textContent || '';
    const cleaned = cleanText(bodyText);
    if (cleaned.length < 50) {
      throw new ParserError('Could not extract readable article text from the provided URL.', 'READABILITY_FAILED');
    }
    return {
      text: cleaned,
      title: dom.window.document.title || targetUrl,
      wordCount: countWords(cleaned),
      sourceType: 'url',
      sourceUrl: targetUrl,
    };
  }

  const cleanedText = cleanText(article.textContent);
  return {
    text: cleanedText,
    title: article.title || extractTitleFromText(cleanedText) || 'Online Research Paper',
    wordCount: countWords(cleanedText),
    sourceType: 'url',
    sourceUrl: targetUrl,
  };
}

/**
 * Normalizes text, fixes line breaks, removes excessive spaces.
 */
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function extractTitleFromText(text: string): string | undefined {
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 5);
  if (lines.length > 0) {
    const candidate = lines[0];
    if (candidate.length < 160 && !candidate.toLowerCase().startsWith('http')) {
      return candidate;
    }
  }
  return undefined;
}
