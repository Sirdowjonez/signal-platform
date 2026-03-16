import React, { useState, useEffect, useRef } from 'react';

const BULLETS = [
  { cat: 'finance', text: 'Fed holds rates; Powell signals cuts "later this year" amid strong jobs data.' },
  { cat: 'crypto',  text: 'Bitcoin spot ETFs log $3.2B weekly inflow — largest since launch in January.' },
  { cat: 'ai',      text: 'Anthropic releases Claude 4 with real-time SEC filing analysis capability.' },
  { cat: 'finance', text: 'NVDA pre-market up 6.1% after H200 chip shipment beats Wall St. estimates.' },
  { cat: 'crypto',  text: 'Solana daily DeFi volume surpasses Ethereum for the first time in history.' },
];

const PRICES = [
  { sym: 'BTC',  price: 98420, change: +2.34, up: true  },
  { sym: 'NVDA', price: 924,   change: +3.11, up: true  },
  { sym: 'SPY',  price: 542,   change: +0.48, up: true  },
  { sym: 'ETH',  price: 3812,  change: +1.87, up: true  },
];

const CAT_COLOR = {
  finance: '#34d399',
  crypto:  '#fbbf24',
  ai:      '#a78bfa',
};

function useLivePrices(initial) {
  const [prices, setPrices] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const delta = (Math.random() - 0.48) * 0.25;
        const c = +(p.change + delta).toFixed(2);
        return { ...p, change: c, up: c >= 0 };
      }));
    }, 3500);
    return () => clearInterval(id);
  }, []);
  return prices;
}

export default function MorningBriefing() {
  const videoRef = useRef(null);
  const prices = useLivePrices(PRICES);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);

  useEffect(() => {
    if (!alertTriggered && prices[0].change > 2.5) {
      setAlertTriggered(true);
    }
  }, [prices]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Price Alert Banner */}
      {alertTriggered && !alertDismissed && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 14,
          animation: 'liveDot 2s ease-in-out infinite',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24' }}>PRICE ALERT</span>
              <span style={{ fontSize: 11, color: '#c0c0d8', marginLeft: 8 }}>
                BTC {prices[0].up ? '▲' : '▼'} {Math.abs(prices[0].change)}% — target reached
              </span>
            </div>
          </div>
          <button
            onClick={() => setAlertDismissed(true)}
            style={{ background: 'none', border: 'none', color: '#6a6a8a', cursor: 'pointer', fontSize: 16, padding: 0 }}
          >×</button>
        </div>
      )}

      {/* Main Card */}
      <div style={{
        borderRadius: 18,
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #1a1040 0%, #0f0f2a 60%, #080810 100%)',
        border: '1px solid rgba(108,99,255,0.25)',
        boxShadow: '0 0 60px rgba(108,99,255,0.08)',
      }}>
        {/* Video hero with overlays */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', minHeight: 180, background: '#000' }}>
          <video
            ref={videoRef}
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }}
          />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(26,16,64,0.3) 0%, rgba(15,15,42,0.7) 60%, rgba(8,8,16,0.95) 100%)',
          }} />

          {/* Purple/blue shimmer overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 30% 50%, rgba(108,99,255,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.12) 0%, transparent 55%)',
            pointerEvents: 'none',
          }} />

          {/* Top badges */}
          <div style={{
            position: 'absolute', top: 14, left: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: '#ef4444', borderRadius: 6, padding: '4px 10px',
            }}>
              <span style={{
                display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                background: '#fff', animation: 'liveDot 1.2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: 0.8 }}>BREAKING</span>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6, padding: '4px 10px',
              fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
            }}>
              {timeStr}
            </div>
          </div>

          {/* Price strip overlaid on video */}
          <div style={{
            position: 'absolute', top: 14, right: 14,
            display: 'flex', gap: 8,
          }}>
            {prices.map(p => (
              <div key={p.sym} style={{
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
                border: `1px solid ${p.up ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`,
                borderRadius: 8, padding: '4px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.5 }}>{p.sym}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: p.up ? '#34d399' : '#f87171', lineHeight: 1.2 }}>
                  {p.up ? '▲' : '▼'} {Math.abs(p.change)}%
                </div>
              </div>
            ))}
          </div>

          {/* Bottom title on video */}
          <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
            <p style={{
              margin: 0, fontSize: 15, fontWeight: 800, color: '#fff',
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              lineHeight: 1.3,
            }}>
              Morning Markets: Fed Decision Day, Bitcoin ATH & GPT-5 Disrupts Finance
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px 20px' }}>
          {/* Date / subhead */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: '#6a6a8a', fontWeight: 600 }}>{dateStr}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
              color: '#6c63ff', background: 'rgba(108,99,255,0.1)',
              border: '1px solid rgba(108,99,255,0.25)',
              padding: '2px 8px', borderRadius: 4,
            }}>Morning Briefing</span>
          </div>

          {/* 5 Bullet points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BULLETS.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  flexShrink: 0, marginTop: 2,
                  width: 6, height: 6, borderRadius: '50%',
                  background: CAT_COLOR[b.cat] || '#888',
                  display: 'inline-block',
                }} />
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#a0a0c0' }}>
                  <span style={{ color: CAT_COLOR[b.cat], fontWeight: 700, marginRight: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {b.cat}
                  </span>
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          {/* Price Alerts CTA */}
          <div style={{
            marginTop: 16,
            background: 'rgba(108,99,255,0.08)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: 10, padding: '10px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🔔</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#eeeef5' }}>Price Alerts</div>
                <div style={{ fontSize: 10, color: '#6a6a8a' }}>Get notified when BTC hits $100K</div>
              </div>
            </div>
            <button style={{
              background: 'linear-gradient(90deg, #6c63ff, #a78bfa)',
              border: 'none', borderRadius: 8, padding: '6px 12px',
              fontSize: 10, fontWeight: 700, color: '#fff', cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              Set Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
