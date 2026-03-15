// News ingestion sources for SIGNAL
// Each source has: id, name, category, type ('rss' | 'api'), url, and optional apiKeyEnv

const SOURCES = [
  // ── AI / Technology ────────────────────────────────────────────────────────
  {
    id: 'openai-blog',
    name: 'OpenAI Blog',
    category: 'ai',
    type: 'rss',
    url: 'https://openai.com/blog/rss.xml',
  },
  {
    id: 'deepmind-blog',
    name: 'Google DeepMind Blog',
    category: 'ai',
    type: 'rss',
    url: 'https://deepmind.google/blog/rss.xml',
  },
  {
    id: 'mit-ai',
    name: 'MIT News — AI',
    category: 'ai',
    type: 'rss',
    url: 'https://news.mit.edu/rss/topic/artificial-intelligence2',
  },
  {
    id: 'huggingface-blog',
    name: 'Hugging Face Blog',
    category: 'ai',
    type: 'rss',
    url: 'https://huggingface.co/blog/feed.xml',
  },
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat AI',
    category: 'ai',
    type: 'rss',
    url: 'https://venturebeat.com/category/ai/feed/',
  },

  // ── Finance ────────────────────────────────────────────────────────────────
  {
    id: 'reuters-finance',
    name: 'Reuters Finance',
    category: 'finance',
    type: 'rss',
    url: 'https://feeds.reuters.com/reuters/businessNews',
  },
  {
    id: 'ft-markets',
    name: 'Financial Times Markets',
    category: 'finance',
    type: 'rss',
    url: 'https://www.ft.com/markets?format=rss',
  },
  {
    id: 'wsj-markets',
    name: 'WSJ Markets',
    category: 'finance',
    type: 'rss',
    url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',
  },
  {
    id: 'seekingalpha',
    name: 'Seeking Alpha',
    category: 'finance',
    type: 'rss',
    url: 'https://seekingalpha.com/feed.xml',
  },
  {
    id: 'investopedia',
    name: 'Investopedia News',
    category: 'finance',
    type: 'rss',
    url: 'https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline',
  },

  // ── Crypto ─────────────────────────────────────────────────────────────────
  {
    id: 'coindesk',
    name: 'CoinDesk',
    category: 'crypto',
    type: 'rss',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  },
  {
    id: 'cointelegraph',
    name: 'CoinTelegraph',
    category: 'crypto',
    type: 'rss',
    url: 'https://cointelegraph.com/rss',
  },
  {
    id: 'decrypt',
    name: 'Decrypt',
    category: 'crypto',
    type: 'rss',
    url: 'https://decrypt.co/feed',
  },
  {
    id: 'theblock',
    name: 'The Block',
    category: 'crypto',
    type: 'rss',
    url: 'https://www.theblock.co/rss.xml',
  },
  {
    id: 'bitcoinmagazine',
    name: 'Bitcoin Magazine',
    category: 'crypto',
    type: 'rss',
    url: 'https://bitcoinmagazine.com/.rss/full/',
  },

  // ── API sources (require keys — set env vars) ──────────────────────────────
  {
    id: 'newsapi-ai',
    name: 'NewsAPI — AI',
    category: 'ai',
    type: 'api',
    url: 'https://newsapi.org/v2/everything?q=artificial+intelligence&language=en&sortBy=publishedAt',
    apiKeyEnv: 'NEWSAPI_KEY',
    apiKeyParam: 'apiKey',
  },
  {
    id: 'newsapi-crypto',
    name: 'NewsAPI — Crypto',
    category: 'crypto',
    type: 'api',
    url: 'https://newsapi.org/v2/everything?q=cryptocurrency+bitcoin&language=en&sortBy=publishedAt',
    apiKeyEnv: 'NEWSAPI_KEY',
    apiKeyParam: 'apiKey',
  },
];

function getSourcesByCategory(category) {
  return SOURCES.filter(s => s.category === category);
}

function getSourceById(id) {
  return SOURCES.find(s => s.id === id) || null;
}

function getActiveSources() {
  return SOURCES.filter(s => {
    if (s.type === 'api' && s.apiKeyEnv && !process.env[s.apiKeyEnv]) return false;
    return true;
  });
}

module.exports = { SOURCES, getSourcesByCategory, getSourceById, getActiveSources };
