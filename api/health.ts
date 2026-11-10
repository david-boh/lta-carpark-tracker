/**
 * Health check serverless endpoint
 * GET /api/health
 */
import type { Request, Response } from 'express';

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  ltaConnection: {
    targetEndpoint: string;
    accountKeyConfigured: boolean;
  };
}

export default async function handler(req: Request, res: Response) {
  const accountKey = process.env.LTA_DATAMALL_ACCOUNT_KEY || process.env.LTA_ACCOUNT_KEY;

  const data: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    ltaConnection: {
      targetEndpoint: 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
      accountKeyConfigured: Boolean(accountKey && accountKey.trim().length > 0)
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  return res.status(200).json(data);
}
