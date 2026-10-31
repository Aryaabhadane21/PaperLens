# PaperLens: Research Paper Analysis Assistant - Specification

## 1. Overview
**PaperLens** is an intelligent, full-stack Research Paper Analysis Assistant. It ingests academic research papers from various file formats (PDF, TXT, DOC, DOCX) or via web URLs, extracts and sanitizes their content, performs deep structured analysis via Large Language Models (Google Gemini with seamless mock fallback), verifies every key claim against the original source text to prevent hallucinations, and presents a comprehensive multi-section breakdown with export capabilities (PDF, Word, Markdown, Clipboard).

The project is located in `research ai assistant` and is designed for portable execution (`npm install && npm run dev`) and single-service deployment on platforms like Render via `render.yaml`.

---

## 2. Architecture & Tech Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS with custom academic palette (Deep Navy `#0a192f` / `#0f172a`, Cream `#fdfbf7` / `#f8fafc`, Gold `#d97706` / `#b45309`, Slate borders)
- **Theming**: Seamless Light and Dark mode with persistence
- **Icons**: Lucide React
- **Design System**: 3-step wizard workflow (Upload → Analyse → Results), modern minimalist aesthetics, responsive grid layouts, card elevations, smooth micro-interactions.

### Backend
- **Runtime**: Node.js & Express (TypeScript)
- **Input Parsing**:
  - `pdf-parse` for PDF documents with edge-case detection for scanned/image-only PDFs.
  - `mammoth` for DOCX files.
  - `word-extractor` for legacy DOC files.
  - `@mozilla/readability` + `jsdom` for web articles and URLs.
  - **Security**: Robust SSRF guard blocking private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.169.254`, IPv6 equivalents, non-HTTP/HTTPS protocols).
- **LLM Engine**:
  - Google Gemini API (`@google/genai` / `@google/generative-ai`) via `GEMINI_API_KEY`.
  - Swappable `LLMService` architecture with an intelligent `MockLLMProvider` activated when `LLM_MOCK=true` or when no API key is configured.
  - Strict JSON generation validated by `zod`.
  - Automatic retry mechanism with error-feedback prompting if JSON parsing or validation fails.
- **Pipeline & Real-time Updates**:
  - 4-Stage streaming pipeline via Server-Sent Events (SSE):
    1. **Ingest**: File read, format parsing, text cleanup, length validation.
    2. **Extract**: Structured extraction of summary, problem, objectives, methodology, findings, and limitations.
    3. **Verify**: Source-text grounding pass that assesses confidence, flags discrepancies, and quotes corroborating excerpts.
    4. **Save**: In-memory and persistent record storage indexed by UUID.
- **Exports**:
  - Markdown (.md) generation.
  - Formatted Word (.docx) generation using `docx`.
  - Formatted PDF (.pdf) generation using `pdfkit`.
  - Direct clipboard copying with markdown formatting.

---

## 3. UI/UX Specifications

### 3-Step Wizard
1. **Upload Step**:
   - Hero banner with navy background, crisp academic typography, and gold accent badges.
   - Tabbed input:
     - **File Upload**: Drag-and-drop zone accepting `.pdf`, `.txt`, `.doc`, `.docx` up to 25MB. File size, name, and type badge indicator.
     - **URL Tab**: Validated URL input box with fast paste and sample paper presets (e.g. arXiv papers).
   - "Analyze Paper" CTA button with validation feedback.

2. **Analyse Step**:
   - Live 4-stage stepper:
     - Step 1: *Ingest* (Parsing document & cleaning text)
     - Step 2: *Extract* (Extracting core research sections with LLM)
     - Step 3: *Verify* (Grounding claims against source text)
     - Step 4: *Save* (Storing analysis & preparing report)
   - Visual progress indicator, animated pulsing loader, live status message updates via SSE stream.

3. **Results Step**:
   - Paper Title, Metadata badge (word count, processing time, format, confidence score).
   - Executive Summary callout card.
   - Five deep-dive section cards with custom Lucide icons and navy accents:
     1. **Problem Statement**: Core research question and context.
     2. **Objectives & Hypotheses**: Target goals, specific aims, testable claims.
     3. **Methodology**: Research design, datasets, tools, mathematical or experimental formulation.
     4. **Key Findings**: Concrete empirical results, percentage changes, major breakthroughs.
     5. **Limitations & Future Work**: Methodological constraints, sample biases, unaddressed avenues.
   - **Verification & Grounding Panel**: Confidence rating, claims verified counter, quote citations from source text.
   - **Export Suite**:
     - Download Markdown (.md)
     - Download PDF (.pdf)
     - Download Word (.docx)
     - Copy formatted analysis to Clipboard with feedback indicator
   - "Analyze Another Paper" reset button.

---

## 4. Prompts System (`server/prompts`)
- `structured-prompt.ts`: Production structured JSON prompt instructing the LLM to extract fields strictly adhering to the Zod schema.
- `analysis-v1.ts`: Baseline zero-shot prompt.
- `analysis-v2.ts`: Few-shot role-prompt with strict domain guidelines.
- `analysis-v3.ts`: Chain-of-thought structured prompt with explicit negative constraints and citation requirements (Selected Production Prompt).
- `verify-prompt.ts`: Verification prompt that cross-references extracted claims against the raw source text to output confidence scores and grounding notes.
- Documented in `docs/prompt-testing.md`.

---

## 5. Testing & Quality Assurance
- Automated test suite covering 5 required scenarios:
  1. PDF parsing and analysis.
  2. TXT file processing.
  3. DOCX document parsing.
  4. URL extraction with SSRF security verification.
  5. Edge Case: Scanned/empty PDF without extractable text returning clear diagnostic guidance.
  6. Schema validation and auto-retry on malformed LLM responses.
- Test evidence documented in `docs/test-evidence.md`.

---

## 6. Deployment & Portability
- Single service deployment on Render (`render.yaml`).
- Server serves built static Vite client assets in production (`NODE_ENV=production`).
- Root `package.json` providing:
  - `npm run dev`: starts both backend and frontend concurrently in development mode.
  - `npm run build`: builds client and compiles backend TypeScript.
  - `npm run test`: runs full backend test suite.
  - `npm start`: starts production server.
- `.env.example` with clear defaults.
