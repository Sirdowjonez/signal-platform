import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLOR = {
  finance: { text: '#34d399', bg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.3)'  },
  crypto:  { text: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.3)'  },
  ai:      { text: '#a78bfa', bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.3)' },
};

const ITEMS = [
  { id: '1', title: 'Fed Signals Rate Cut as AI Chips Surge',             category: 'finance', duration: '4:12', thumbnail: 'https://picsum.photos/seed/sig1/320/180' },
  { id: '2', title: 'Bitcoin Breaks $100K on ETF Inflows',                category: 'crypto',  duration: '2:48', thumbnail: 'https://picsum.photos/seed/sig2/320/180' },
  { id: '3', title: 'OpenAI GPT-5 Parses SEC Filings in Real-Time',       category: 'ai',      duration: '6:05', thumbnail: 'https://picsum.photos/seed/sig3/320/180' },
  { id: '4', title: 'Ethereum L2 Hits 50M Daily Transactions',            category: 'crypto',  duration: '3:33', thumbnail: 'https://picsum.photos/seed/sig4/320/180' },
  { id: '5', title: 'Anthropic Claude 4 Passes CFA Level III',            category: 'ai',      duration: '5:17', thumbnail: 'https://picsum.photos/seed/sig5/320/180' },
  { id: '6', title: 'SEC Approves First On-Chain Equity Token',           category: 'finance', duration: '7:01', thumbnail: 'https://picsum.photos/seed/sig6/320/180' },
  { id: '7', title: 'NVDA Hits $1T Market Cap on AI Datacenter Boom',     category: 'finance', duration: '3:55', thumbnail: 'https://picsum.photos/seed/sig7/320/180' },
  { id: '8', title: 'Solana DeFi Volume Surpasses Ethereum for First Time', category: 'crypto', duration: '4:40', thumbnail: 'https://picsum.photos/seed/sig8/320/180' },
];

function CarouselCard({ item }) {
  const navigate = useNavigate();
  const cat = CATEGORY_COLOR[item.category] || { text: '#888', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={() => navigate(`/post/${item.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 220,
        cursor: 'pointer',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#0f0f1a',
        border: `1px solid ${hovered ? cat.border : '#1c1c2e'}`,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 28px ${cat.text}18` : 'none',
        transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#0a0a14' }}>
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Hover play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.18s',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>▶</div>
        </div>

        {/* Duration badge */}
        <div style={{
          position: 'absolute', bottom: 7, right: 8,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '2px 6px', borderRadius: 4, letterSpacing: 0.3,
        }}>
          {item.duration}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{
          display: 'inline-block', alignSelf: 'flex-start',
          fontSize: 9, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
          color: cat.text, background: cat.bg, border: `1px solid ${cat.border}`,
          padding: '2px 7px', borderRadius: 3,
        }}>
          {item.category}
        </span>
        <p style={{
          margin: 0, fontSize: 12, fontWeight: 700, lineHeight: 1.4, color: '#d0d0e8',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.title}
        </p>
      </div>
    </div>
  );
}

export default function VideoCarousel({ title = 'Trending Now' }) {
  const trackRef = useRef(null);

  function scroll(dir) {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' });
    }
  }

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#eeeef5', letterSpacing: 0.3 }}>
          🔥 {title}
        </h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {['←', '→'].map((arrow, i) => (
            <button
              key={arrow}
              onClick={() => scroll(i === 0 ? -1 : 1)}
              style={{
                background: '#0f0f1a', border: '1px solid #1c1c2e',
                borderRadius: 8, width: 30, height: 30,
                color: '#6a6a8a', fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff44'; e.currentTarget.style.color = '#eeeef5'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1c1c2e'; e.currentTarget.style.color = '#6a6a8a'; }}
            >
              {arrow}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 12,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: 4,
        }}
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>
        {ITEMS.map(item => <CarouselCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
