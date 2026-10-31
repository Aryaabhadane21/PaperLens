import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { analyzeRouter } from './routes/analyze.js';
import { exportRouter } from './routes/export.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): Express {
  const app = express();

  // Basic Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Healthcheck & System status
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'PaperLens Analysis API',
      version: '1.0.0',
      llmMode: config.llmMock || !config.geminiApiKey ? 'mock' : 'gemini',
      geminiModel: config.geminiModel,
      timestamp: new Date().toISOString(),
    });
  });

  // Sample Paper Presets
  app.get('/api/sample-papers', (_req: Request, res: Response) => {
    res.json([
      {
        id: 'sample-transformers',
        title: 'Attention Is All You Need (Vaswani et al.)',
        abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
        url: 'https://arxiv.org/abs/1706.03762',
      },
      {
        id: 'sample-llm-verification',
        title: 'Grounding Verification in Large Language Models via Multi-Pass Extraction',
        abstract: 'Automated synthesis of scientific literature frequently suffers from ungrounded hallucination...',
      }
    ]);
  });

  // API Routes
  app.use('/api', analyzeRouter);
  app.use('/api', exportRouter);

  // Serve client static assets in production
  const clientDistPath = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Global Error]', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
    });
  });

  return app;
}
