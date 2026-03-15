# SIGNAL — News Platform

AI · Finance · Crypto news platform with a Node.js/Express backend and React frontend.

## Architecture

```
/
├── server/                   Node.js + Express API (port 3001)
│   ├── index.js              Entry point — Express app, starts pipeline scheduler
│   ├── middleware/
│   │   └── auth.js           JWT verify middleware (verifyToken, optionalAuth)
│   ├── models/
│   │   ├── Post.js           Post schema stub (in-memory; swap for Mongoose)
│   │   └── User.js           User schema stub with JWT generation + password hashing
│   ├── pipeline/
│   │   ├── orchestrator.js   News ingestion cron job (runs every 30 min)
│   │   └── sources.js        RSS + API source definitions (AI, finance, crypto)
│   └── routes/
│       └── subscriptions.js  POST /api/subscribe — Stripe checkout stub
│
├── client/                   React + Vite frontend (port 5000)
│   ├── index.html
│   ├── vite.config.js        Proxies /api → localhost:3001
│   └── src/
│       ├── main.jsx          React entry point
│       ├── App.jsx           Router: /, /post/:id, /subscribe, /login
│       └── index.css         Dark theme design system
│
└── package.json              Root — server deps (express, cors, jsonwebtoken, node-cron)
```

## Routes

| Route | Description |
|---|---|
| `GET /api/health` | Health check |
| `GET /api/subscribe` | List subscription plans |
| `POST /api/subscribe` | Create Stripe checkout session (requires JWT) |
| `POST /api/subscribe/webhook` | Stripe webhook handler |

## Environment Variables

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret for signing JWTs |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_BASIC_PRICE_ID` | Stripe price ID for Basic plan |
| `STRIPE_PRO_PRICE_ID` | Stripe price ID for Pro plan |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEWSAPI_KEY` | NewsAPI key for API-based sources |
| `CLIENT_URL` | Frontend origin for CORS (default: http://localhost:5173) |

## Key Design Decisions

- **In-memory models**: Post.js and User.js use plain JS arrays as a stub. Replace with Mongoose + MongoDB for production.
- **Stripe stub**: subscriptions.js returns a stub response when `STRIPE_SECRET_KEY` is not set — safe for development.
- **Pipeline**: orchestrator.js runs on startup + every 30 min via node-cron. fetchRssFeed/fetchApiSource are stubs — integrate `rss-parser` and `axios`/`node-fetch` when ready.
- **Auth**: JWT middleware in auth.js. `verifyToken` blocks unauthenticated requests; `optionalAuth` sets `req.user = null` without blocking.
- **Vite proxy**: All `/api` requests from the frontend are proxied to Express on port 3001.

## Running

- **Frontend** (workflow): `cd client && npm run dev` → port 5000
- **Backend** (manual): `node server/index.js` → port 3001
