# PaperLens: Research Paper Analysis Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46e3b7.svg)](https://render.com)

**PaperLens** is an intelligent, full-stack Research Paper Analysis Assistant. It ingests academic research papers from multiple formats (PDF, TXT, Word `.doc`/`.docx`, or web URLs) and deconstructs them into five core academic pillars: **Problem Statement**, **Objectives & Hypotheses**, **Methodology**, **Key Findings**, and **Limitations & Future Work**.

Every extracted claim is audited against the original source text in a dual-pass verification pass, eliminating hallucinations and attaching verbatim citations with confidence ratings.

---

## Key Highlights

- **Clean 3-Step Wizard**: Modern minimal UI with Navy hero banner, cream cards, gold accents, and persistent Light + Dark mode (`Upload` → `Analyse` → `Results`).
- **Live 4-Stage SSE Stepper**: Server-Sent Events stream live progress across `Ingest (25%)` → `Extract (50%)` → `Verify (75%)` → `Save (100%)` with a radar pulse animation.
- **Anti-Hallucination Claim Verifier**: Re-checks every assertion against raw text, scoring confidence ($0-100\%$) and quoting supporting excerpts.
- **Robust Multi-Format Parsing**:
  - `pdf-parse` with automatic detection of scanned/empty image-only PDFs (`SCANNED_OR_EMPTY_PDF`).
  - `mammoth` for modern `.docx`.
  - `word-extractor` for legacy `.doc`.
  - Native UTF-8 parsing for `.txt`.
  - `@mozilla/readability` + `jsdom` for web URLs with strict **SSRF protection** against private IP and cloud metadata ranges.
- **Swappable LLM Service**:
  - Seamless support for **Google Gemini 2.5** via `GEMINI_API_KEY`.
  - Built-in **Intelligent Keyless Mock Provider** (`LLM_MOCK=true`) for 100% functional offline runs without API keys.
  - Strict JSON generation validated by `zod`, with automated **1-retry recovery** on malformed model outputs.
- **Full Academic Export Suite**: One-click download as **Markdown (.md)**, styled **PDF (.pdf)**, Microsoft **Word (.docx)**, or **Copy to Clipboard**.
- **Ready for Render**: Unified single-service deployment configured via `render.yaml`.

---

## Directory Structure

```
research ai assistant/
├── package.json              # Root monorepo orchestration
├── render.yaml               # Single-service Render deployment blueprint
├── .env.example              # Environment variables template
├── README.md                 # This file
├── docs/
│   ├── workflow.md           # Mermaid sequence & architecture diagrams
│   ├── demo-script.md        # 3-5 minute presentation walkthrough script
│   ├── prompt-testing.md     # In-depth prompt comparison (v1, v2, v3, verify)
│   └── test-evidence.md      # Automated test execution evidence
├── server/
│   ├── src/
│   │   ├── app.ts            # Express server configuration & static asset serving
│   │   ├── config.ts         # Environment settings
│   │   ├── types.ts          # Core TypeScript data structures
│   │   ├── schemas/          # Zod validation schemas
│   │   ├── prompts/          # Tested prompt versions (v1, v2, v3, verify)
│   │   ├── routes/           # REST & SSE endpoints (/api/analyze, /api/export)
│   │   └── services/         # Parsers, SSRF guard, LLM, Verifier, Exporters
│   └── tests/
│       ├── test-runner.ts    # 7-case automated test suite
│       └── fixtures/         # PDF, TXT, DOCX, and empty/scanned PDF fixtures
└── client/
    ├── src/
    │   ├── App.tsx           # 3-Step Wizard state manager
    │   ├── components/       # HeroBanner, StepperWizard, SectionCard, etc.
    │   └── lib/api.ts        # Client SSE streaming & export triggers
    └── vite.config.ts        # Vite dev server + /api proxy
```

---

## Quickstart (Works on Any Machine)

### 1. Installation
Clone the repository, enter the folder, and run:
```bash
cd "research ai assistant"
npm run install:all
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(PaperLens defaults to keyless mock mode if `GEMINI_API_KEY` is omitted, so you can test immediately without any API keys!)*

### 3. Run Development Server
```bash
npm run dev
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:5001`
- Requests to `/api/*` are automatically proxied from Vite to Express.

### 4. Run Automated Test Suite
```bash
npm test
```
Executes all 7 automated test cases:
1. Standard Research PDF Ingestion & Extraction
2. Plain Text (.txt) Document Analysis
3. Microsoft Word (.docx) Parsing
4. URL Extraction & SSRF Guard Security
5. Edge Case: Scanned/Empty PDF Detection (`SCANNED_OR_EMPTY_PDF`)
6. Zod Schema Pillar Validation
7. Multi-Format Exporters (Markdown, PDF, Word)

---

## Production Build & Single-Service Execution

PaperLens is configured to compile both frontend and backend and serve static assets through Express in production:

```bash
# 1. Build client and server
npm run build

# 2. Start production server
npm start
```
Open `http://localhost:5001` in your browser.

---

## Deploy to Render

Deploying to Render takes one click using the included `render.yaml`:
1. Push your repository to GitHub.
2. In Render, select **New +** → **Blueprint**.
3. Point to your repository. Render will automatically read `render.yaml`:
   - Runtime: Node
   - Build Command: `npm run install:all && npm run build`
   - Start Command: `npm start`
4. Add your `GEMINI_API_KEY` in the Render Environment Variables tab (or leave blank to use the intelligent mock).

---

## Documentation

- **[PaperLens Specification](../PaperLens_SPEC.md)**: Source of truth and architectural requirements.
- **[System Workflow & Architecture](docs/workflow.md)**: Mermaid sequence diagrams and pipeline breakdown.
- **[Demo Walkthrough Script](docs/demo-script.md)**: 3–5 minute step-by-step presentation script.
- **[Prompt Testing & Comparison](docs/prompt-testing.md)**: Evaluation of Prompt v1, v2, v3, and the Verification Prompt.
- **[Test Evidence & Logs](docs/test-evidence.md)**: Comprehensive verification logs for all test cases.

---

## License
MIT
