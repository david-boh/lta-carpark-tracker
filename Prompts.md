# Project Prompts Log: SG ParkPulse (LTA Carpark Tracker)

This document contains a collation of all user prompts provided during the development of the Singapore Carpark Tracker application.

---

### Prompt 1: Initial Application Build (Frontend)
**Date / Timestamp:** 2026-11-09T19:35:13-08:00

```text
Build me an singapore based carpark tracker application that tracks real time carpark availability. build just the frontend for now, i will integrate the backend connection later.
```

**Actions Executed:**
- Built full React + TypeScript + Tailwind CSS v4 frontend.
- Created interactive Leaflet vector map with custom live-lot markers, Singapore district jump points, and user geolocation.
- Built comprehensive Singapore carpark directory (HDB, URA, and major shopping destinations like ION Orchard, Suntec City, VivoCity, Jewel Changi, etc.).
- Implemented real-time lot fluctuation simulator with trend tags (*Lots opening*, *Filling up*, *Steady*).
- Created parking fee estimator adhering to Singapore rules (15-min grace period, $0.60 vs $1.20 central area HDB rates, $5.00 night cap, Sunday/PH free parking).
- Created Backend Integration modal showing expected REST API contracts and schema.

---

### Prompt 2: Initial Git Repository Push
**Date / Timestamp:** 2026-11-09T19:47:17-08:00

```text
push https://[REDACTED_TOKEN]@https://github.com/david-boh/lta-carpark-tracker.git
```

**Actions Executed:**
- Initialized local Git repository on `main` branch.
- Committed initial codebase.
- Configured remote origin and pushed to `https://github.com/david-boh/lta-carpark-tracker.git`.
- Sanitized remote URL to remove plaintext credentials from the local config.

---

### Prompt 3: LTA DataMall Serverless Connection
**Date / Timestamp:** 2026-11-09T20:00:12-08:00

```text
1. add a serverless connection that pulls live data from LTA's datamall using the following endpoints: 

https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2

# All requests need the header:  AccountKey: 

2. Store this in /api folder (at project root level)

3. Include a /health.ts and /carparkavailability.ts

4. Do not hardcode any keys, i will include them later
```

**Actions Executed:**
- Created `/api/health.ts` for serverless health checks, uptime tracking, and LTA key configuration detection.
- Created `/api/carparkavailability.ts` to query `https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2` using dynamic `AccountKey` from `process.env.LTA_DATAMALL_ACCOUNT_KEY` or request headers (zero hardcoded keys).
- Added full-stack Express server (`server.ts`) mounting the `/api` routes alongside Vite dev middleware.
- Updated `package.json` scripts (`"dev": "tsx server.ts"`, `"start": "NODE_ENV=production tsx server.ts"`).
- Documented `LTA_DATAMALL_ACCOUNT_KEY` in `.env.example`.
- Updated client service and UI modal with one-click testing of `/api/health` and `/api/carparkavailability`.

---

### Prompt 4: GitHub Deployment Update
**Date / Timestamp:** 2026-11-09T20:20:53-08:00

```text
can you deploy to github?
```

**Actions Executed:**
- Committed all new backend endpoints (`/api/health.ts`, `/api/carparkavailability.ts`), `server.ts`, and updated frontend integration files.
- Pushed commit `dcff642` to `origin/main` on GitHub repository `https://github.com/david-boh/lta-carpark-tracker.git`.

---

### Prompt 5: Collate Prompts
**Date / Timestamp:** 2026-11-09T22:06:07-08:00

```text
Collate all the prompts into filename Prompts.md
```

**Actions Executed:**
- Generated `Prompts.md` in the project root documenting all prompts in chronological order with execution summaries.
