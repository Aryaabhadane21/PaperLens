import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, 'fixtures');

if (!fs.existsSync(fixturesDir)) {
  fs.mkdirSync(fixturesDir, { recursive: true });
}

const samplePaperContent = `
Attention Mechanisms in Deep Neural Architectures for Scientific Language Modeling

Abstract
Recent breakthroughs in natural language processing rely heavily on self-attention mechanisms.
In this study, we propose "Self-Grounded Transformer", an attention-based architecture that dynamically verifies internal factual representations.
Across three benchmark corpora containing over 100,000 academic papers, our model achieves a 94.2% factual grounding accuracy,
representing a 14.8% improvement over recurrent baselines (79.4%) and an 8.5% improvement over standard ungrounded transformers.
In addition, inference latency is reduced by 22.3% through sparse attention routing.

1. Introduction and Problem Statement
Scientific literature is expanding exponentially, with more than 3 million peer-reviewed articles published annually.
Researchers face cognitive overload trying to synthesize findings across fragmented domains.
Existing sequence-to-sequence models frequently generate plausible-sounding hallucinations when tasked with summarizing complex papers.
The central problem addressed in this work is the lack of verifiable grounding mechanisms in deep language models.
Prior literature failed to integrate dual-pass claim verification directly into the decoding loop, leading to uncontrolled hallucination rates in high-stakes summarization.

2. Objectives and Hypotheses
Our primary objective is to formulate an end-to-end grounded neural architecture capable of extracting verifiable structured claims from long-form scientific documents.
Secondary objectives include:
1. Benchmarking factual precision against human expert annotators.
2. Developing a low-overhead claim corroboration algorithm.
We test the hypothesis that multi-pass cross-attention filtering reduces factual hallucination by at least 10% without reducing ROUGE-L recall.

3. Methodology
We utilized a mixed-method empirical experimental design.
The primary dataset consists of 50,000 peer-reviewed papers from arXiv and PubMed, balanced across computer science, biomedicine, and physics.
Our experimental framework was implemented in PyTorch and HuggingFace Transformers, trained across a cluster of 8 NVIDIA A100 GPUs using AdamW optimizer (learning rate 5e-5).
Evaluation metrics include Precision@K, Factual Grounding Score (FGS), ROUGE-1, ROUGE-2, and ROUGE-L.
Models were compared against three baseline systems: Bi-LSTM, Standard Transformer, and GPT-3.5 zero-shot.

4. Findings and Results
The empirical evaluation demonstrated substantial performance leaps:
- Factual Grounding Accuracy reached 94.2% compared to 79.4% for Bi-LSTM and 85.7% for standard Transformer.
- Hallucination frequency dropped from 18.2% to 3.8% (a 14.4% absolute reduction).
- Inference latency improved by 22.3% due to sparse cross-attention heads.
Qualitative inspection revealed that our verification pass successfully identified and filtered out 91.5% of unsupported speculative statements.

5. Limitations and Threats to Validity
Several limitations must be noted:
First, our parser assumes machine-readable text layers; performance degrades significantly on scanned PDFs without clean OCR.
Second, training on English-only academic corpora limits generalizability to non-English scientific texts.
Third, context window constraints of 16,384 tokens restrict single-pass analysis on lengthy doctoral dissertations.
Future research should explore multi-modal visual document transformers for table and equation extraction.
`;

async function generateFixtures() {
  // 1. sample-paper.txt
  fs.writeFileSync(path.join(fixturesDir, 'sample-paper.txt'), samplePaperContent.trim(), 'utf-8');
  console.log('✓ Generated sample-paper.txt');

  // 2. sample-paper.pdf (Valid PDF with extractable text)
  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(path.join(fixturesDir, 'sample-paper.pdf'));
    doc.pipe(stream);
    doc.fontSize(16).font('Helvetica-Bold').text('Attention Mechanisms in Deep Neural Architectures', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).font('Helvetica').text(samplePaperContent);
    doc.end();
    stream.on('finish', () => {
      console.log('✓ Generated sample-paper.pdf');
      resolve();
    });
    stream.on('error', reject);
  });

  // 3. empty-scanned.pdf (Edge case: PDF with no extractable text / scanned representation)
  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(path.join(fixturesDir, 'empty-scanned.pdf'));
    doc.pipe(stream);
    // Draw only a vector rectangle and dot, no text
    doc.rect(50, 50, 400, 300).stroke();
    doc.circle(200, 200, 20).fill('#cccccc');
    doc.end();
    stream.on('finish', () => {
      console.log('✓ Generated empty-scanned.pdf (Edge Case)');
      resolve();
    });
    stream.on('error', reject);
  });

  // 4. sample-paper.docx (Valid Word document)
  const docx = new Document({
    sections: [
      {
        children: samplePaperContent
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .map((line) => new Paragraph({ children: [new TextRun(line)] })),
      },
    ],
  });
  const docxBuffer = await Packer.toBuffer(docx);
  fs.writeFileSync(path.join(fixturesDir, 'sample-paper.docx'), docxBuffer);
  console.log('✓ Generated sample-paper.docx');
}

generateFixtures().catch((err) => {
  console.error('Failed generating fixtures:', err);
  process.exit(1);
});
