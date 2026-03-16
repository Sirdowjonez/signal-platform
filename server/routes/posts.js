const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');

const POSTS = [
  {
    id: '1',
    title: 'Fed Signals Rate Cut as AI Chips Surge',
    category: 'finance',
    source: 'Reuters',
    thumbnail: 'https://picsum.photos/seed/signal1/800/450',
    videoUrl: '',
    summary: 'Federal Reserve hints at rate reduction amid AI infrastructure boom, sending tech stocks sharply higher.',
    content: 'The Federal Reserve signaled a potential rate cut at its next meeting, citing cooling inflation and strong AI-driven productivity gains. Chip stocks surged on the news, with NVDA up 4.2%.',
    isPremium: false,
    isLive: false,
    tags: ['fed', 'rates', 'ai', 'chips'],
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: '2',
    title: 'Bitcoin Breaks $100K on ETF Inflows',
    category: 'crypto',
    source: 'CoinDesk',
    thumbnail: 'https://picsum.photos/seed/signal2/800/450',
    videoUrl: '',
    summary: 'BTC surges past six figures as institutional demand accelerates through spot ETFs.',
    content: 'Bitcoin crossed the $100,000 mark for the first time in 2026 as spot ETF inflows hit a weekly record of $3.2B. Analysts attribute the move to growing institutional allocation.',
    isPremium: true,
    isLive: false,
    tags: ['bitcoin', 'btc', 'etf', 'crypto'],
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: '3',
    title: 'OpenAI Launches GPT-5 with Real-Time Market Analysis',
    category: 'ai',
    source: 'OpenAI Blog',
    thumbnail: 'https://picsum.photos/seed/signal3/800/450',
    videoUrl: '',
    summary: 'New model can parse SEC filings and crypto order books simultaneously with sub-second latency.',
    content: 'OpenAI unveiled GPT-5 today, featuring native financial data integrations. The model can ingest live market feeds, SEC filings, and on-chain data in a single context window.',
    isPremium: false,
    isLive: true,
    tags: ['openai', 'gpt5', 'ai', 'markets'],
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: '4',
    title: 'Ethereum Layer-2 Transactions Hit 50M Daily',
    category: 'crypto',
    source: 'The Block',
    thumbnail: 'https://picsum.photos/seed/signal4/800/450',
    videoUrl: '',
    summary: 'Arbitrum and Base drive record L2 activity as gas fees on mainnet remain elevated.',
    content: 'Ethereum Layer-2 networks processed a combined 50 million transactions in a single day for the first time, driven largely by DeFi activity on Arbitrum and social apps on Base.',
    isPremium: false,
    isLive: false,
    tags: ['ethereum', 'layer2', 'arbitrum', 'base'],
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: '5',
    title: 'Anthropic Claude 4 Passes CFA Level III Exam',
    category: 'ai',
    source: 'VentureBeat',
    thumbnail: 'https://picsum.photos/seed/signal5/800/450',
    videoUrl: '',
    summary: 'Anthropic\'s latest model scores in the 94th percentile on the rigorous financial analyst certification.',
    content: 'Claude 4 achieved a 94th-percentile score on the CFA Level III examination, outperforming the average human candidate. Anthropic says the model can now reason reliably about complex portfolio construction.',
    isPremium: true,
    isLive: false,
    tags: ['anthropic', 'claude', 'ai', 'finance'],
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: '6',
    title: 'SEC Approves First On-Chain Equity Token',
    category: 'finance',
    source: 'WSJ Markets',
    thumbnail: 'https://picsum.photos/seed/signal6/800/450',
    videoUrl: '',
    summary: 'A landmark ruling allows tokenized shares of public companies to trade 24/7 on blockchain rails.',
    content: 'The SEC granted approval for the first publicly-traded equity token, marking a watershed moment for the intersection of traditional finance and blockchain technology.',
    isPremium: false,
    isLive: false,
    tags: ['sec', 'tokenization', 'equity', 'blockchain'],
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
  },
];

// GET /api/posts
router.get('/', optionalAuth, (req, res) => {
  const { category, limit = 20, offset = 0, search } = req.query;

  let results = [...POSTS];

  if (category && category !== 'all') {
    results = results.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.includes(q))
    );
  }

  const total = results.length;
  results = results.slice(Number(offset), Number(offset) + Number(limit));

  res.json({ posts: results, total, limit: Number(limit), offset: Number(offset) });
});

// GET /api/posts/:id
router.get('/:id', optionalAuth, (req, res) => {
  const post = POSTS.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (post.isPremium && (!req.user || req.user.role === 'free')) {
    return res.status(403).json({
      error: 'Premium content',
      isPremium: true,
      preview: {
        id: post.id,
        title: post.title,
        category: post.category,
        thumbnail: post.thumbnail,
        summary: post.summary,
        timestamp: post.timestamp,
      },
    });
  }

  res.json(post);
});

module.exports = router;
