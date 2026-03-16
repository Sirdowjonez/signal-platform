import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TRENDING = [
  { tag: '#FedRateCut',      posts: '14.2k' },
  { tag: '#BitcoinATH',      posts: '9.8k'  },
  { tag: '#GPT5',            posts: '8.1k'  },
  { tag: '#NVDAEarnings',    posts: '6.5k'  },
  { tag: '#EthereumMerge2',  posts: '5.3k'  },
  { tag: '#SolanaFlip',      posts: '4.7k'  },
  { tag: '#SECCrypto',       posts: '3.9k'  },
];

const LIVE_PRICES = [
  { sym: 'BTC',  price: 98420, change: +2.34,  up: true  },
  { sym: 'ETH',  price: 3812,  change: +1.87,  up: true  },
  { sym: 'SOL',  price: 187,   change: -0.92,  up: false },
  { sym: 'NVDA', price: 924,   change: +3.11,  up: true  },
  { sym: 'SPY',  price: 542,   change: +0.48,  up: true  },
  { sym: 'TSLA', price: 248,   change: -1.63,  up: false },
];

const TOP_STORIES = [
  { id: 'a1', title: 'Fed holds rates steady — markets erupt',     category: 'finance', ago: '3m'  },
  { id: 'a2', title: 'Bitcoin breaks $100K on record ETF volume',  category: 'crypto',  ago: '11m' },
  { id: 'a3', title: 'Anthropic Claude 4 passes CFA Level III',    category: 'ai',      ago: '28m' },
  { id: 'a4', title: 'NVDA up 6% pre-market on H200 chip news',    category: 'finance', ago: '45m' },
  { id: 'a5', title: 'Solana DeFi volume tops Ethereum for first time', category: 'crypto', ago: '1h' },
];

const CAT_COLOR = {
  finance: '#34d399',
  crypto:  '#fbbf24',
  ai:      '#a78bfa',
};

function useLivePrices() {
  const [prices, setPrices] = useState(LIVE_PRICES);
  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const jitter = (Math.random() - 0.49) * 0.4;
        const newChange = +(p.change + jitter).toFixed(2);
        return { ...p, change: newChange, up: newChange >= 0 };
      }));
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return prices;
}

export default function SideBar() {
  const navigate = useNavigate();
  const prices = useLivePrices();
  const [email, setEmail] = useState('');
  const [subDone, setSubDone] = useState(false);

  function handleSub(e) {
    e.preventDefault();
    if (email) setSubDone(true);
  }

  return (
    <aside style={{
      width: 260,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      position: 'sticky',
      top: 88,
      height: 'fit-content',
    }}>

      {/* Live Prices */}
      <div style={{
        background: '#0f0f1a',
        border: '1px solid #1c1c2e',
        borderRadius: 14,
        padding: '14px 16px',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <span style={{
            display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
            background: '#34d399',
            animation: 'liveDot 1.4s ease-in-out infinite',
          }} />
          <h3 style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#eeeef5', letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Live Prices
          </h3>
        </div>

        {/* Ticker scroll strip */}
        <div style={{ overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            display: 'flex', gap: 10,
            animation: 'tickScroll 18s linear infinite',
            width: 'max-content',
          }}>
            {[...prices, ...prices].map((p, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap',
                color: p.up ? '#34d399' : '#f87171',
              }}>
                {p.sym} {p.up ? '▲' : '▼'}{Math.abs(p.change)}%
              </span>
            ))}
          </div>
        </div>

        {/* Price rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {prices.map(p => (
            <div key={p.sym} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#c0c0d8' }}>{p.sym}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#eeeef5' }}>
                  ${p.price.toLocaleString()}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  color: p.up ? '#34d399' : '#f87171',
                }}>
                  {p.up ? '▲' : '▼'} {Math.abs(p.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div style={{
        background: '#0f0f1a',
        border: '1px solid #1c1c2e',
        borderRadius: 14,
        padding: '14px 16px',
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 800, color: '#eeeef5', letterSpacing: 0.6, textTransform: 'uppercase' }}>
          🔥 Trending
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TRENDING.map((t, i) => (
            <div
              key={t.tag}
              onClick={() => navigate(`/search?q=${encodeURIComponent(t.tag)}`)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', padding: '5px 0',
                borderBottom: i < TRENDING.length - 1 ? '1px solid #1c1c2e' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6c63ff' }}>{t.tag}</div>
                <div style={{ fontSize: 9, color: '#6a6a8a', marginTop: 1 }}>{t.posts} posts</div>
              </div>
              <span style={{ fontSize: 11, color: '#3a3a5a' }}>›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Stories */}
      <div style={{
        background: '#0f0f1a',
        border: '1px solid #1c1c2e',
        borderRadius: 14,
        padding: '14px 16px',
      }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 800, color: '#eeeef5', letterSpacing: 0.6, textTransform: 'uppercase' }}>
          ⚡ Top Stories
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TOP_STORIES.map((s, i) => (
            <div
              key={s.id}
              onClick={() => navigate(`/post/${s.id}`)}
              style={{
                cursor: 'pointer',
                paddingBottom: i < TOP_STORIES.length - 1 ? 10 : 0,
                borderBottom: i < TOP_STORIES.length - 1 ? '1px solid #1c1c2e' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <span style={{
                  fontSize: 8, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
                  color: CAT_COLOR[s.category] || '#888',
                  background: `${CAT_COLOR[s.category] || '#888'}18`,
                  padding: '2px 5px', borderRadius: 3,
                }}>
                  {s.category}
                </span>
                <span style={{ fontSize: 9, color: '#3a3a5a' }}>{s.ago} ago</span>
              </div>
              <p style={{
                margin: 0, fontSize: 11, fontWeight: 600, lineHeight: 1.4,
                color: '#b0b0c8',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {s.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter subscribe */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1430 0%, #0f0f1a 100%)',
        border: '1px solid #2a2050',
        borderRadius: 14,
        padding: '16px',
      }}>
        <h3 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800, color: '#eeeef5' }}>
          📬 Signal Daily
        </h3>
        <p style={{ margin: '0 0 12px', fontSize: 11, color: '#6a6a8a', lineHeight: 1.4 }}>
          Markets, AI & crypto delivered before the open.
        </p>
        {subDone ? (
          <div style={{ fontSize: 12, color: '#34d399', fontWeight: 700, textAlign: 'center', padding: '6px 0' }}>
            ✓ You're on the list!
          </div>
        ) : (
          <form onSubmit={handleSub} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                background: '#080810', border: '1px solid #2a2050',
                borderRadius: 8, padding: '8px 10px',
                fontSize: 11, color: '#eeeef5', outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(90deg, #6c63ff, #a78bfa)',
                border: 'none', borderRadius: 8, padding: '8px',
                fontSize: 11, fontWeight: 700, color: '#fff', cursor: 'pointer',
              }}
            >
              Subscribe Free
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}
