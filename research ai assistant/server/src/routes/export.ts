import { Router, Request, Response } from 'express';
import { analysisStorage } from '../services/storage.js';
import { generateMarkdown, generateWordBuffer, generatePdfBuffer } from '../services/exporter.js';

export const exportRouter = Router();

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_\-\.]/g, '_').slice(0, 60);
}

/**
 * Download Markdown
 */
exportRouter.get('/export/:id/markdown', (req: Request, res: Response): void => {
  const result = analysisStorage.get(req.params.id);
  if (!result) {
    res.status(404).json({ error: 'Analysis not found' });
    return;
  }

  const markdown = generateMarkdown(result);
  const filename = `${sanitizeFilename(result.analysis.title || 'PaperLens_Analysis')}.md`;

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(markdown);
});

/**
 * Download Word (.docx)
 */
exportRouter.get('/export/:id/word', async (req: Request, res: Response): Promise<void> => {
  const result = analysisStorage.get(req.params.id);
  if (!result) {
    res.status(404).json({ error: 'Analysis not found' });
    return;
  }

  try {
    const buffer = await generateWordBuffer(result);
    const filename = `${sanitizeFilename(result.analysis.title || 'PaperLens_Analysis')}.docx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('[export/word] Error generating Word doc:', err);
    res.status(500).json({ error: 'Failed to generate Word document' });
  }
});

/**
 * Download PDF (.pdf)
 */
exportRouter.get('/export/:id/pdf', async (req: Request, res: Response): Promise<void> => {
  const result = analysisStorage.get(req.params.id);
  if (!result) {
    res.status(404).json({ error: 'Analysis not found' });
    return;
  }

  try {
    const buffer = await generatePdfBuffer(result);
    const filename = `${sanitizeFilename(result.analysis.title || 'PaperLens_Analysis')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('[export/pdf] Error generating PDF:', err);
    res.status(500).json({ error: 'Failed to generate PDF document' });
  }
});
