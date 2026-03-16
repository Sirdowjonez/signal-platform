import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY = {
  ai:      { label: 'AI',      color: '#a78bfa', bg: 'rgba(167,139,250,0.13)', border: 'rgba(167,139,250,0.28)' },
  finance: { label: 'Finance', color: '#34d399', bg: 'rgba(52,211,153,0.13)',  border: 'rgba(52,211,153,0.28)'  },
  crypto:  { label: 'Crypto',  color: '#fbbf24', bg: 'rgba(251,191,36,0.13)',  border: 'rgba(251,191,36,0.28)'  },
};

function timeAgo(iso) {
  if (!iso) return '';
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60)    return `${Math.floor(s)}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function VideoCard({ post }) {
  const navigate = useNavigate();
  const cat = CATEGORY[post?.category] || { label: post?.category || '', color: '#666', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
  const ts = post?.timestamp || post?.publishedAt;

  return (
    <article
      onClick={() => navigate(`/post/${post.id}`)}
      style={{
        background: '#0f0f1a',
        border: '1px solid #1c1c2e',
        borderRadius: 14,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.18s, border-color 0.18s, box-shadow 0.18s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = cat.color + '55';
        e.currentTarget.style.boxShadow = `0 12px 40px ${cat.color}1a`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#1c1c2e';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#0a0a14', flexShrink: 0 }}>
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: `linear-gradient(135deg, #0a0a14 0%, ${cat.color}14 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 36, opacity: 0.12 }}>▶</span>
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,15,26,0.9) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* LIVE */}
        {post.isLive && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: '#ef4444', color: '#fff',
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
            padding: '3px 8px', borderRadius: 4,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'liveDot 1.2s ease-in-out infinite' }} />
            LIVE
          </div>
        )}

        {/* PRO */}
        {post.isPremium && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'linear-gradient(90deg,#7c3aed,#a78bfa)',
            color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: 1,
            padding: '3px 8px', borderRadius: 4,
          }}>PRO</div>
        )}

        {/* Category */}
        <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase',
            color: cat.color, background: cat.bg, border: `1px solid ${cat.border}`,
            padding: '3px 8px', borderRadius: 4, backdropFilter: 'blur(8px)',
          }}>{cat.label}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <h3 style={{
          margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: '#eeeef5',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{post.title}</h3>

        {post.summary && (
          <p style={{
            margin: 0, fontSize: 12, color: '#4a4a6a', lineHeight: 1.55,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{post.summary}</p>
        )}

        <div style={{
          marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #16162a',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 11, color: '#35355a', fontWeight: 500 }}>{post.source || 'SIGNAL'}</span>
          <span style={{ fontSize: 11, color: '#35355a' }}>{timeAgo(ts)}</span>
        </div>
      </div>
    </article>
  );
}
