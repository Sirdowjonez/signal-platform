import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/api/posts/${id}`).then(r => setPost(r.data)).catch(() => navigate('/'));
  }, [id, navigate]);

  const s = {
    wrap: { maxWidth:'600px', margin:'0 auto', padding:'20px 16px' },
    back: { background:'none', border:'none', color:'#00ff88', fontSize:'14px', cursor:'pointer', padding:'0 0 16px', display:'block' },
    img: { width:'100%', borderRadius:'12px', aspectRatio:'16/9', objectFit:'cover', background:'#1a1a1a', display:'block', marginBottom:'20px' },
    title: { fontSize:'24px', fontWeight:800, lineHeight:1.3, margin:'0 0 12px' },
    meta: { color:'#555', fontSize:'13px', marginBottom:'20px' },
    body: { fontSize:'16px', lineHeight:1.7, color:'#ccc' },
    lock: { background:'#111', border:'1px solid #1e1e1e', borderRadius:'12px', padding:'32px', textAlign:'center', marginTop:'24px' },
    lockTitle: { fontSize:'18px', fontWeight:700, marginBottom:'8px' },
    lockBtn: { background:'#00ff88', color:'#000', border:'none', borderRadius:'8px', padding:'12px 24px', fontSize:'15px', fontWeight:700, cursor:'pointer', marginTop:'12px' }
  };

  if (!post) return <div style={{...s.wrap, textAlign:'center', paddingTop:'60px', color:'#555'}}>Loading...</div>;

  return (
    <div style={s.wrap}>
      <button style={s.back} onClick={() => navigate('/')}>← Back to Feed</button>
      <img src={post.thumbnail} alt={post.title} style={s.img} />
      <h1 style={s.title}>{post.title}</h1>
      <p style={s.meta}>{post.category?.toUpperCase()} · {new Date(post.timestamp).toLocaleString()}</p>
      {post.isPremium ? (
        <div style={s.lock}>
          <p style={s.lockTitle}>🔒 Premium Story</p>
          <p style={{color:'#888', fontSize:'14px'}}>Subscribe to SIGNAL for full access to this story and all premium content.</p>
          <button style={s.lockBtn} onClick={() => navigate('/subscribe')}>Unlock for $29/mo</button>
        </div>
      ) : (
        <p style={s.body}>{post.summary} Full article content would appear here after connecting to your content pipeline.</p>
      )}
    </div>
  );
}
