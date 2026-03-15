const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const samplePosts = [
  { id: '1', title: 'Fed Signals Rate Cut as AI Chips Surge', category: 'finance', videoUrl: '', thumbnail: 'https://picsum.photos/seed/1/400/225', summary: 'Federal Reserve hints at rate reduction amid AI infrastructure boom.', timestamp: new Date().toISOString(), isPremium: false },
  { id: '2', title: 'Bitcoin Breaks $100K on ETF Inflows', category: 'crypto', videoUrl: '', thumbnail: 'https://picsum.photos/seed/2/400/225', summary: 'BTC surges past six figures as institutional demand accelerates.', timestamp: new Date().toISOString(), isPremium: true },
  { id: '3', title: 'OpenAI Launches GPT-5 with Real-Time Market Analysis', category: 'ai', videoUrl: '', thumbnail: 'https://picsum.photos/seed/3/400/225', summary: 'New model can parse SEC filings and crypto order books simultaneously.', timestamp: new Date().toISOString(), isPremium: false },
];

router.get('/', (req, res) => {
  res.json({ posts: samplePosts, total: samplePosts.length });
});

router.get('/:id', (req, res) => {
  const post = samplePosts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

module.exports = router;
