# ⚡ SIGNAL

> Bloomberg for the AI-native generation.

Real-time video-first news platform covering the AI + Finance + Crypto intersection.

## Stack
- **Backend**: Node.js + Express (port 3001)
- **Frontend**: React 18 (mobile-first)
- **DB**: MongoDB (via Mongoose)
- **Auth**: JWT
- **Payments**: Stripe ($29/mo)
- **Push**: OneSignal
- **Pipeline**: 30-min autonomous news ingestion (node-cron)

## Structure
```
signal-platform/
├── server/
│   ├── index.js              # Express entry point
│   ├── routes/posts.js       # GET /api/posts
│   ├── routes/auth.js        # POST /api/auth/login|register
│   ├── routes/subscriptions.js # POST /api/subscribe (Stripe)
│   ├── middleware/auth.js    # JWT verify
│   ├── pipeline/
│   │   ├── orchestrator.js   # 30-min cron job
│   │   └── sources.js        # AI/finance/crypto sources
│   └── models/               # Post, User schemas
└── client/
    └── src/
        ├── pages/            # Feed, PostDetail, Subscribe, Login
        └── components/       # VideoCard, Navbar, PushBell
```

## Setup
```bash
cp .env.example .env   # fill in your keys
npm install
cd client && npm install && cd ..
npm run dev            # starts both server + client
```

## Monetization
- Free tier: 3 posts/day, ads
- Premium ($29/mo): unlimited, no ads, push alerts
