/**
 * OneMap (Singapore Land Authority) Token & Proxy Serverless Endpoint
 * GET /api/onemap
 *
 * Automatically manages authentication and 72-hour token renewal with OneMap:
 * https://www.onemap.gov.sg/api/auth/post/getToken
 *
 * Reads:
 *   process.env.ONEMAP_EMAIL
 *   process.env.ONEMAP_PASSWORD
 *   (or fallback process.env.ONEMAP_API_TOKEN)
 */
import type { Request, Response } from 'express';

interface TokenCache {
  token: string;
  expiresAt: number; // Unix timestamp in seconds
}

let cachedToken: TokenCache | null = null;

const ONEMAP_AUTH_URL = 'https://www.onemap.gov.sg/api/auth/post/getToken';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  const directToken = process.env.ONEMAP_API_TOKEN || process.env.ONEMAP_TOKEN;
  const email = process.env.ONEMAP_EMAIL?.trim();
  const password = process.env.ONEMAP_PASSWORD?.trim();

  // If a direct token is provided in env vars, return it
  if (directToken && directToken.trim().length > 0) {
    return res.status(200).json({
      status: 'OK',
      source: 'ONEMAP_API_TOKEN_ENV',
      access_token: directToken.trim(),
      message: 'Direct OneMap token active.'
    });
  }

  // Check if we have credentials
  if (!email || !password) {
    return res.status(200).json({
      status: 'CONFIG_REQUIRED',
      hasCredentials: false,
      message: 'OneMap credentials not configured in environment.',
      instructions: [
        '1. Register for free at: https://www.onemap.gov.sg/apidocs/register',
        '2. Add ONEMAP_EMAIL="your_email@gmail.com" in Vercel Environment Variables',
        '3. Add ONEMAP_PASSWORD="your_password" in Vercel Environment Variables'
      ]
    });
  }

  const nowSeconds = Math.floor(Date.now() / 1000);

  // Return cached token if valid (with 1-hour buffer before expiration)
  if (cachedToken && cachedToken.expiresAt > nowSeconds + 3600) {
    const hoursRemaining = Math.round(((cachedToken.expiresAt - nowSeconds) / 3600) * 10) / 10;
    return res.status(200).json({
      status: 'OK',
      source: 'CACHED_TOKEN',
      access_token: cachedToken.token,
      expires_at: cachedToken.expiresAt,
      hours_remaining: hoursRemaining
    });
  }

  // Request fresh token from OneMap
  try {
    const authResponse = await fetch(ONEMAP_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      return res.status(authResponse.status).json({
        status: 'AUTH_FAILED',
        httpStatus: authResponse.status,
        message: 'Failed to authenticate with OneMap using provided credentials.',
        details: errorText
      });
    }

    const data = (await authResponse.json()) as {
      access_token?: string;
      expiry_timestamp?: string | number;
      error?: string;
    };

    if (!data.access_token) {
      return res.status(401).json({
        status: 'AUTH_FAILED',
        message: data.error || 'OneMap did not return an access token. Check your email/password.'
      });
    }

    const expiresAt = Number(data.expiry_timestamp) || nowSeconds + 72 * 3600;

    cachedToken = {
      token: data.access_token,
      expiresAt
    };

    return res.status(200).json({
      status: 'OK',
      source: 'NEW_TOKEN_GENERATED',
      access_token: data.access_token,
      expires_at: expiresAt,
      hours_remaining: 72
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to reach OneMap authentication service.',
      error: msg
    });
  }
}
