import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_COLORS = { ai: '#7c3aed', finance: '#0ea5e9', crypto: '#f59e0b' };

export default function VideoCard({ post }) {
  const navigate = useNavigate();
  const color = CATEGORY_COLORS[post.category] || '#00ff88';
  const s = {
    card: { background:'#111', borderRadius:'16px', overflow:'hidden', cursor:'pointer', border:'1px solid #1e1e1e', transition:'transform 0.2s, border-color 0.2s', marginBottom:'16px' },
    thumb: { width:'100%', aspectRatio:'16/9', objectFit:'cover', background:'#1a1a1a', display:'block' },
    body: { padding:'14px 16px' },
    badge: { display:'inline-block', background:color+'22', color:color, fontSize:'11px', fontWeight:700, padding:'3px 8px', borderRadius:'4px', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'8px' },
    title: { fontSize:'16px', fontWeight:700, lineHeight:1.35, margin:'0 0 6px', color:'#fff' },
    summary: { fontSize:'13px', color:'#888', lineHeight:1.5, margin:0 },
    lock: { display:'inline-block', marginLeft:'6px', fontSize:'12px' }
  };
  return (
    <div style={s.card} onClick={() => navigate(`/post/${post.id}`)}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor=color; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='#1e1e1e'; }}>
      <img src={post.thumbnail} alt={post.title} style={s.thumb} loading="lazy" />
      <div style={s.body}>
        <span style={s.badge}>{post.category}</span>
        <p style={s.title}>{post.title}{post.isPremium && <span style={s.lock}>🔒</span>}</p>
        <p style={s.summary}>{post.summary}</p>
      </div>
    </div>
  );
}
