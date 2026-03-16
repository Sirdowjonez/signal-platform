import React, { useState, useRef, useEffect } from 'react';

const SHORTS = [
  {
    id: 's1',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Fed rate cut sends Nasdaq up 2.4% in after-hours trading',
    category: 'finance',
    author: '@signalfinance',
    likes: 12400,
    comments: 342,
    shares: 891,
  },
  {
    id: 's2',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Bitcoin ETF inflows hit $3.2B weekly record — institutions are all in',
    category: 'crypto',
    author: '@signalcrypto',
    likes: 8750,
    comments: 210,
    shares: 430,
  },
  {
    id: 's3',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'GPT-5 demos real-time SEC filing analysis — Wall St takes notice',
    category: 'ai',
    author: '@signalair',
    likes: 21300,
    comments: 678,
    shares: 1204,
  },
];

const CATEGORY_COLOR = {
  finance: '#34d399',
  crypto:  '#fbbf24',
  ai:      '#a78bfa',
};

function fmtCount(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

function ShortItem({ short, active }) {
  const videoRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(short.likes);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;
    if (active) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [active]);

  function handleLike() {
    setLiked(l => {
      setLikeCount(c => l ? c - 1 : c + 1);
      return !l;
    });
  }

  function toggleMute() {
    setMuted(m => {
      if (videoRef.current) videoRef.current.muted = !m;
      return !m;
    });
  }

  const catColor = CATEGORY_COLOR[short.category] || '#888';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '9/16',
      borderRadius: 18,
      overflow: 'hidden',
      background: '#000',
      flexShrink: 0,
    }}>
      {/* Video */}
      <video
        ref={videoRef}
        src={short.src}
        muted
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.05) 55%)',
        pointerEvents: 'none',
      }} />

      {/* Mute button */}
      <button
        onClick={toggleMute}
        style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%', width: 34, height: 34,
          color: '#fff', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >{muted ? '🔇' : '🔊'}</button>

      {/* Right action rail */}
      <div style={{
        position: 'absolute', right: 12, bottom: 90,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
      }}>
        {[
          { icon: liked ? '❤️' : '🤍', label: fmtCount(likeCount), action: handleLike },
          { icon: '💬', label: fmtCount(short.comments), action: null },
          { icon: '↗️', label: fmtCount(short.shares), action: null },
        ].map(({ icon, label, action }) => (
          <button
            key={label + icon}
            onClick={action}
            style={{
              background: 'none', border: 'none', cursor: action ? 'pointer' : 'default',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: 0,
            }}
          >
            <span style={{ fontSize: 26 }}>{icon}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Bottom info */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 18px' }}>
        <span style={{
          display: 'inline-block', marginBottom: 8,
          fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
          color: catColor, background: `${catColor}20`,
          border: `1px solid ${catColor}44`,
          padding: '3px 8px', borderRadius: 4,
        }}>
          {short.category}
        </span>
        <p style={{
          margin: '0 0 6px', fontSize: 14, fontWeight: 700,
          lineHeight: 1.35, color: '#fff', paddingRight: 56,
          textShadow: '0 1px 6px rgba(0,0,0,0.7)',
        }}>
          {short.title}
        </p>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
          {short.author}
        </span>
      </div>
    </div>
  );
}

export default function Shorts() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );

    const items = container.querySelectorAll('[data-index]');
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 14px', color: '#eeeef5', letterSpacing: 0.3 }}>
        ⚡ Shorts
      </h2>

      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxHeight: '72vh',
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          borderRadius: 18,
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {SHORTS.map((short, i) => (
          <div
            key={short.id}
            data-index={i}
            style={{ scrollSnapAlign: 'start', flexShrink: 0 }}
          >
            <ShortItem short={short} active={activeIndex === i} />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
        {SHORTS.map((_, i) => (
          <div key={i} style={{
            width: activeIndex === i ? 18 : 6,
            height: 6, borderRadius: 3,
            background: activeIndex === i ? '#6c63ff' : '#1c1c2e',
            transition: 'width 0.2s, background 0.2s',
          }} />
        ))}
      </div>
    </div>
  );
}
