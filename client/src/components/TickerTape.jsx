import React, { useState, useEffect } from 'react';

const INITIAL_PRICES = [
  { symbol: 'BTC',  price: 98420.50, change: 2.34  },
  { symbol: 'ETH',  price: 3812.18,  change: 1.87  },
  { symbol: 'SOL',  price: 187.44,   change: -0.92 },
  { symbol: 'NVDA', price: 924.67,   change: 3.11  },
  { symbol: 'SPY',  price: 542.30,   change: 0.48  },
  { symbol: 'TSLA', price: 248.91,   change: -1.63 },
];

function fmt(price) {
  return price >= 1000
    ? price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : price.toFixed(2);
}

function TickerItem({ symbol, price, change }) {
  const up = change >= 0;
  const color = up ? '#34d399' : '#f87171';
  const arrow = up ? '▲' : '▼';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 28px', borderRight: '1px solid #1c1c2e', whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#eeeef5', letterSpacing: 0.5 }}>{symbol}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#9898b8', fontVariantNumeric: 'tabular-nums' }}>${fmt(price)}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color, display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ fontSize: 8 }}>{arrow}</span>
        {Math.abs(change).toFixed(2)}%
      </span>
    </span>
  );
}

export default function TickerTape() {
  const [prices, setPrices] = useState(INITIAL_PRICES);

  // Simulate live price jitter every 4 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setPrices(prev => prev.map(item => {
        const jitter = (Math.random() - 0.48) * 0.15;
        const newPrice = +(item.price * (1 + jitter / 100)).toFixed(2);
        const newChange = +(item.change + (Math.random() - 0.5) * 0.08).toFixed(2);
        return { ...item, price: newPrice, change: newChange };
      }));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Duplicate items to create seamless infinite loop (tickScroll moves -50%)
  const items = [...prices, ...prices];

  return (
    <div style={{
      position: 'sticky',
      top: 56,
      zIndex: 190,
      height: 36,
      background: 'rgba(8,8,16,0.95)',
      borderBottom: '1px solid #1c1c2e',
      backdropFilter: 'blur(12px)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Left fade */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 48, zIndex: 2,
        background: 'linear-gradient(to right, rgba(8,8,16,1), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Scrolling track */}
      <div style={{
        display: 'inline-flex',
        animation: 'tickScroll 32s linear infinite',
        willChange: 'transform',
      }}>
        {items.map((item, i) => (
          <TickerItem key={`${item.symbol}-${i}`} {...item} />
        ))}
      </div>

      {/* Right fade */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, zIndex: 2,
        background: 'linear-gradient(to left, rgba(8,8,16,1), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
