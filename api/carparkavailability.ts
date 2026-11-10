/**
 * LTA DataMall CarParkAvailabilityv2 Serverless Endpoint
 * GET /api/carparkavailability
 *
 * Pulls real-time carpark availability data directly from LTA DataMall:
 * https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
 *
 * Headers required by LTA:
 *   AccountKey: <process.env.LTA_DATAMALL_ACCOUNT_KEY>
 */
import type { Request, Response } from 'express';

const LTA_ENDPOINT = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

export interface LTACarparkRecord {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // Space-separated lat lon, e.g. "1.29375 103.85718"
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y'; // C: Cars, H: Heavy Vehicles, Y: Motorcycles
  Agency: 'HDB' | 'URA' | 'LTA' | string;
}

export interface LTAResponse {
  'odata.metadata'?: string;
  value: LTACarparkRecord[];
}

export interface NormalizedCarpark {
  id: string;
  carpark_number: string;
  name: string;
  address: string;
  agency: string;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lots: {
    car: { available: number; total: number };
    motorcycle: { available: number; total: number };
    heavy?: { available: number; total: number };
  };
  lot_type: string;
  available_lots: number;
  raw_location: string;
}

export default async function handler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // Retrieve AccountKey from environment or request header (never hardcoded)
  const headerKey =
    req.headers['accountkey'] ||
    req.headers['account-key'] ||
    req.headers['x-account-key'];

  const accountKey = (
    process.env.LTA_DATAMALL_ACCOUNT_KEY ||
    process.env.LTA_ACCOUNT_KEY ||
    (typeof headerKey === 'string' ? headerKey : Array.isArray(headerKey) ? headerKey[0] : '')
  )?.trim();

  // If no AccountKey is configured, return clear instructions without crashing
  if (!accountKey) {
    return res.status(200).json({
      status: 'CONFIG_REQUIRED',
      hasKey: false,
      message:
        'LTA DataMall AccountKey is not yet configured. Please set LTA_DATAMALL_ACCOUNT_KEY in your .env file or pass the AccountKey request header.',
      targetEndpoint: LTA_ENDPOINT,
      instructions: [
        '1. Request a free API AccountKey at: https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html',
        '2. Add LTA_DATAMALL_ACCOUNT_KEY="your-key-here" in .env',
        '3. Alternatively, supply the "AccountKey: <key>" header with your request.'
      ],
      timestamp: new Date().toISOString()
    });
  }

  try {
    const skipParam = req.query.skip || req.query.$skip || '0';
    const fetchAll = req.query.fetchAll === 'true';

    let records: LTACarparkRecord[] = [];

    if (fetchAll) {
      // LTA DataMall returns up to 500 records per call. Paginate through pages if fetchAll=true.
      let currentSkip = 0;
      let hasMore = true;
      const maxPages = 6; // Safety cap at 3000 records
      let page = 0;

      while (hasMore && page < maxPages) {
        const url = `${LTA_ENDPOINT}?$skip=${currentSkip}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            AccountKey: accountKey,
            accept: 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`LTA DataMall responded with HTTP ${response.status}: ${response.statusText}`);
        }

        const data = (await response.json()) as LTAResponse;
        const pageRecords = data.value || [];
        records = records.concat(pageRecords);

        if (pageRecords.length < 500) {
          hasMore = false;
        } else {
          currentSkip += 500;
          page++;
        }
      }
    } else {
      // Single page fetch
      const url = `${LTA_ENDPOINT}?$skip=${encodeURIComponent(String(skipParam))}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          AccountKey: accountKey,
          accept: 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          status: 'ERROR',
          hasKey: true,
          httpStatus: response.status,
          message: `LTA DataMall API error: ${response.statusText}`,
          details: errorText,
          targetEndpoint: LTA_ENDPOINT
        });
      }

      const data = (await response.json()) as LTAResponse;
      records = data.value || [];
    }

    // Optional query filtering
    const agencyFilter = typeof req.query.agency === 'string' ? req.query.agency.toUpperCase() : null;
    const lotTypeFilter = typeof req.query.lotType === 'string' ? req.query.lotType.toUpperCase() : null;
    const searchFilter = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : null;

    let filteredRecords = records;
    if (agencyFilter) {
      filteredRecords = filteredRecords.filter((r) => r.Agency.toUpperCase() === agencyFilter);
    }
    if (lotTypeFilter) {
      filteredRecords = filteredRecords.filter((r) => r.LotType.toUpperCase() === lotTypeFilter);
    }
    if (searchFilter) {
      filteredRecords = filteredRecords.filter(
        (r) =>
          r.Development.toLowerCase().includes(searchFilter) ||
          r.CarParkID.toLowerCase().includes(searchFilter) ||
          (r.Area && r.Area.toLowerCase().includes(searchFilter))
      );
    }

    // Parse and normalize records into easy-to-consume format for map & client
    const normalized: NormalizedCarpark[] = filteredRecords.map((r) => {
      let lat = 1.3521;
      let lng = 103.8198;
      if (r.Location && r.Location.trim().length > 0) {
        const parts = r.Location.trim().split(/\s+/);
        if (parts.length >= 2) {
          const parsedLat = parseFloat(parts[0]);
          const parsedLng = parseFloat(parts[1]);
          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            lat = parsedLat;
            lng = parsedLng;
          }
        }
      }

      return {
        id: `LTA-${r.Agency}-${r.CarParkID}`,
        carpark_number: r.CarParkID,
        name: r.Development,
        address: r.Area ? `${r.Development}, ${r.Area}` : r.Development,
        agency: r.Agency,
        district: r.Area || 'Singapore',
        coordinates: { lat, lng },
        lots: {
          car: {
            available: r.LotType === 'C' ? r.AvailableLots : 0,
            total: Math.max(r.AvailableLots, 100)
          },
          motorcycle: {
            available: r.LotType === 'Y' ? r.AvailableLots : 0,
            total: Math.max(r.AvailableLots, 50)
          },
          heavy: {
            available: r.LotType === 'H' ? r.AvailableLots : 0,
            total: Math.max(r.AvailableLots, 20)
          }
        },
        lot_type: r.LotType,
        available_lots: r.AvailableLots,
        raw_location: r.Location
      };
    });

    return res.status(200).json({
      status: 'OK',
      hasKey: true,
      timestamp: new Date().toISOString(),
      source: 'LTA DataMall CarParkAvailabilityv2',
      targetEndpoint: LTA_ENDPOINT,
      count: filteredRecords.length,
      totalFetched: records.length,
      value: filteredRecords,
      normalized
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      status: 'FAILED',
      hasKey: true,
      message: 'Failed to communicate with LTA DataMall service',
      error: errorMessage,
      targetEndpoint: LTA_ENDPOINT,
      timestamp: new Date().toISOString()
    });
  }
}
