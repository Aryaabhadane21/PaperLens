# PaperLens Demo Script (3–5 Minute Walkthrough)

This script provides a concise, professional walkthrough for demonstrating **PaperLens: Research Paper Analysis Assistant** to stakeholders, researchers, or evaluators.

---

## Overview & Timing Summary
- **Total Duration**: 3 to 5 minutes
- **Persona**: AI Researcher / Research Assistant
- **Target Audience**: Academics, R&D Teams, Software Engineers
- **Key Themes**: Structured Synthesis, Factual Grounding, Anti-Hallucination, Multi-Format Distribution

---

## Act 1: The Research Bottleneck & Solution Introduction (0:00 – 0:45)
**Visual**: Open PaperLens in browser at `http://localhost:5173`. Show dark/light mode toggle in top right.

**Presenter**:
> *"Welcome! Every year, over three million scientific research papers are published. Researchers and engineers face cognitive overload trying to extract reliable findings without getting bogged down by academic jargon or misleading conclusions.
> 
> General-purpose LLMs often hallucinate metrics, omit critical limitations, or produce unstructured walls of text.
> 
> This is **PaperLens**—a verifiable Research Paper Analysis Assistant. PaperLens ingests academic papers across PDF, TXT, Word, or web URLs, breaks them down into 5 core academic pillars, and subjects every single assertion to a dual-pass factual verification audit directly against the source text."*

---

## Act 2: Upload & Input Ingestion (0:45 – 1:30)
**Visual**: 
1. Point to the navy hero banner and the 3-step wizard stepper (`Upload` → `Analyse` → `Results`).
2. Show the tab switcher: **Upload Document** vs **Paper URL**.
3. Click the quick button: *"Load Sample Research Paper (Self-Grounded Transformer)"* or drag-and-drop `sample-paper.pdf`.

**Presenter**:
> *"Let's begin with our first step: **Upload**. PaperLens accepts PDF, DOC, DOCX, TXT documents up to 25MB, or live article URLs. 
> 
> If you provide a URL, our backend deploys an SSRF guard that prevents any access to loopback or cloud internal metadata endpoints.
> 
> To demonstrate immediate execution, let's load a standard research paper on attention architectures. Notice how our file card immediately parses the file size, filename, and format badge. Now let's click **Analyze Paper & Verify Claims**."*

---

## Act 3: Live 4-Stage SSE Pipeline (1:30 – 2:30)
**Visual**: Watch the wizard transition smoothly to Step 2 (**Analyse**). The radar pulse loader animates while the progress bar advances from $0\% \to 25\% \to 50\% \to 75\% \to 100\%$ with live SSE status messages.

**Presenter**:
> *"Instead of leaving users staring at an opaque spinner, PaperLens streams live telemetry via Server-Sent Events across four distinct stages:
> 
> 1. **Ingest (25%)**: Cleans text, computes word density, and verifies that the document contains extractable text layers.
> 2. **Extract (50%)**: Sends the paper to our LLM service—either Google Gemini 2.5 or our intelligent keyless mock engine—extracting the five core academic pillars under strict schema validation.
> 3. **Verify (75%)**: This is where PaperLens stands apart. It audits extracted assertions against the raw source text to ensure factual accuracy and prevent hallucinations.
> 4. **Save (100%)**: Indexes the synthesis record by UUID and formats the academic dossier for presentation and export."*

---

## Act 4: Structured Results & Verification Audit (2:30 – 3:45)
**Visual**: The view automatically reveals Step 3 (**Grounded Results**). 
1. Point to the header banner showing title, format badge, word count, and grounding score ($96\%$).
2. Point out the **Executive Synthesis** callout card.
3. Scroll down through the **Factual Grounding & Claim Audit** panel: click on a claim to expand and show the exact source quote and audit explanation.
4. Scroll through the **Five Section Cards**:
   - **Problem Statement**: Statement, Literature Gap, Technical Challenges.
   - **Objectives & Hypotheses**: Primary Aim, Testable Hypotheses.
   - **Methodology**: Research Design, Datasets, Tool tags, Metrics.
   - **Key Findings**: Primary Results, Quantitative Benchmark Table with percentage gains.
   - **Limitations & Future Work**: Methodological Constraints, Threats to Validity, Future Directions.

**Presenter**:
> *"Here are our results. At the top, we see the executive synthesis and metadata badges.
> 
> Below that is our **Claim Audit Panel**. Notice how it scored an overall confidence score of $96\%$. Every extracted assertion is categorized as Verified or Partial, and clicking on any assertion reveals the exact verbatim sentence from the paper corroborating that statement.
> 
> Next, our five section cards deconstruct the paper with academic clarity:
> - **Problem Statement** highlights the unsolved gap in prior literature.
> - **Objectives** enumerates testable hypotheses.
> - **Methodology** breaks down datasets and tools.
> - **Key Findings** includes a structured quantitative table comparing reported values against baselines.
> - And critically, **Limitations** transparently reports what the authors could not prove or where their assumptions degrade."*

---

## Act 5: Multi-Format Academic Exports (3:45 – 4:30)
**Visual**: 
1. Click **Copy Text** — notice the badge updates to a green *"Copied to Clipboard!"* checkmark.
2. Click **Download PDF** — show the styled PDF with navy banner and verification stamps.
3. Click **Word (.docx)** and **Markdown (.md)** to show full document generation.

**Presenter**:
> *"Researchers need to share their findings across multiple mediums. PaperLens provides one-click export actions:
> - **Copy Text**: Instantly copies a Markdown synthesis to your clipboard.
> - **Markdown (.md)**: Great for Obsidian, Notion, or GitHub documentation.
> - **Word (.docx)**: Fully formatted academic layout with tables and bullet runs.
> - **PDF (.pdf)**: Beautifully typeset summary generated server-side via PDFKit."*

---

## Act 6: Edge Case Handling & Wrap-up (4:30 – 5:00)
**Visual**: Show `npm test` running 7 test cases in terminal, highlighting the scanned PDF edge case and SSRF guard.

**Presenter**:
> *"Finally, PaperLens was built with strict production resilience:
> - If a researcher uploads a scanned or image-only PDF without OCR text layers, PaperLens immediately flags it with a friendly diagnosis rather than producing garbage outputs.
> - If an invalid URL is provided, our SSRF protection safeguards infrastructure.
> - The entire application is 100% portable: one command (`npm run dev`) launches both React and Express, and it deploys as a single web service on Render via `render.yaml`.
> 
> Thank you! PaperLens brings clarity, speed, and mathematical verification to research synthesis."*
